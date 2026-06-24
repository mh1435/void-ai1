/* =========================================================
   VOID — application logic
   No browser storage APIs (per artifact rules elsewhere too) —
   here we DO have a real backend, so settings persist via
   void_web.py's /api/settings instead of localStorage.
   ========================================================= */

const App = {
  settings: {
    theme: 'frost',
    apiKey: '',
    geminiKey: '',
    groqKey: '',
    togetherKey: '',
    mistralKey: '',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    groqModel: 'llama-3.3-70b-versatile',
    geminiModel: 'gemini-2.5-flash',
    togetherModel: 'meta-llama/Llama-3.2-70B-Instruct-Turbo',
    mistralModel: 'mistral-large-latest',
    providerOrder: ['gemini', 'groq', 'together', 'mistral', 'openrouter'],
    activeProvider: '',
    activeModel: '',
    mapProvider: 'google',
    lang: 'auto',
    reducedMotion: false,
    responseMode: 'standard',
    voiceEnabled: true,
    voiceRate: 1.0,
    voicePitch: 1.0,
    voiceName: '',
    floatingAssistantEnabled: false
  },
  stats: {
    totalInteractions: 0,
    conversations: 1,
    messages: 0,
    queries: 0,
    replies: 0
  },
  location: null, // { lat, lon, label }
  modelCatalog: [],
  tasks: [],
  commands: [],
  canvasView: { x: 0, y: 0, scale: 1, panMode: false }
};

/* ============ Boot ============ */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadModelCatalog();
  await loadWidgetLayout();
  applyTheme(App.settings.theme);
  setupNav();
  setupSettingsPanels();
  setupThemePicker();
  setupGameHub();
  setupCanvas();
  setupAssistant();
  setupChat();
  setupModelSheet();
  setupVoicePanel();
  setupCommandsPanel();
  requestLocationOnBoot(); // Auto-request location on page load
  setupTasksPanel();
  setupFloatingAssistantPanel();
  setupLocationPanel();
  await loadTasks();
  await loadCommands();
  refreshDashboard();
});

/* ============ Settings persistence (server-backed) ============ */

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      App.settings = { ...App.settings, ...data };
    }
  } catch (e) {
    // server not reachable yet on first paint — defaults are fine
  }
  document.getElementById('lang-select').value = App.settings.lang;
  document.getElementById('toggle-reduced').checked = App.settings.reducedMotion;
  document.getElementById('map-provider-select').value = App.settings.mapProvider;
  document.getElementById('api-model-select').value = App.settings.model;
  document.getElementById('gemini-model-select').value = App.settings.geminiModel;
  document.getElementById('groq-model-select').value = App.settings.groqModel;
  document.body.classList.toggle('reduced-motion', App.settings.reducedMotion);

  document.getElementById('toggle-voice-enabled').checked = App.settings.voiceEnabled;
  document.getElementById('voice-rate-range').value = App.settings.voiceRate;
  document.getElementById('voice-rate-value').textContent = App.settings.voiceRate.toFixed(1) + '×';
  document.getElementById('voice-pitch-range').value = App.settings.voicePitch;
  document.getElementById('voice-pitch-value').textContent = App.settings.voicePitch.toFixed(1);
  document.getElementById('toggle-floating-assistant').checked = App.settings.floatingAssistantEnabled;

  const modeLabels = { standard: 'Standard', concise: 'Concise', detailed: 'Detailed' };
  const modePillLabel = modeLabels[App.settings.responseMode] || 'Standard';
  document.getElementById('mode-pill').firstChild.textContent = modePillLabel + ' ';

  updateModelPillLabel();
}

async function saveSettings() {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(App.settings)
    });
    if (!res.ok) {
      throw new Error(`Server responded ${res.status}`);
    }
    return true;
  } catch (e) {
    console.error('saveSettings failed:', e);
    return false;
  }
}

async function loadModelCatalog() {
  try {
    const res = await fetch('/api/models');
    if (res.ok) {
      const data = await res.json();
      App.modelCatalog = data.models || [];
    }
  } catch (e) {
    console.error('loadModelCatalog failed:', e);
  }
}

async function loadWidgetLayout() {
  try {
    const res = await fetch('/api/widgets');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object') widgetPositions = data;
    }
  } catch (e) { /* fresh layout is fine */ }
}

async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      const data = await res.json();
      App.tasks = data.tasks || [];
    }
  } catch (e) { /* keep whatever is in memory */ }
  renderTasks();
}

async function saveTasks() {
  try {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: App.tasks })
    });
  } catch (e) {
    console.error('saveTasks failed:', e);
  }
}

async function loadCommands() {
  try {
    const res = await fetch('/api/commands');
    if (res.ok) {
      const data = await res.json();
      App.commands = data.commands || [];
    }
  } catch (e) { /* keep whatever is in memory */ }
  renderCommands();
}

async function saveCommands() {
  try {
    await fetch('/api/commands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands: App.commands })
    });
  } catch (e) {
    console.error('saveCommands failed:', e);
  }
}

/* ============ Theme ============ */

function applyTheme(name) {
  App.settings.theme = name;
  const root = document.documentElement;
  root.setAttribute('data-theme', name === 'frost' ? '' : name);

  // Theme color values for button/UI tinting
  const themeColors = {
    'frost': { hue: 200, sat: 70, light: 50 }, // cyan
    'ember': { hue: 0, sat: 70, light: 50 },    // red
    'sage': { hue: 120, sat: 50, light: 45 },   // green
    'violet': { hue: 270, sat: 60, light: 50 }, // purple
    'gold': { hue: 40, sat: 80, light: 50 }     // orange/gold
  };

  const color = themeColors[name] || themeColors.frost;
  root.style.setProperty('--theme-hue', color.hue);
  root.style.setProperty('--theme-sat', color.sat + '%');
  root.style.setProperty('--theme-light', color.light + '%');

  document.querySelectorAll('.theme-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.theme === name);
  });
}

function setupThemePicker() {
  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      applyTheme(dot.dataset.theme);
      saveSettings();
    });
  });
}

/* ============ Navigation ============ */

function setupNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === viewId));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === viewId));
  if (viewId === 'view-dashboard') refreshDashboard();
}

/* ============ Settings slide-over panels ============ */

function setupSettingsPanels() {
  const overlay = document.getElementById('panel-overlay');

  document.querySelectorAll('.settings-row').forEach(row => {
    row.addEventListener('click', () => openPanel(row.dataset.panel));
  });

  document.querySelectorAll('[data-close-panel]').forEach(btn => {
    btn.addEventListener('click', closeAllPanels);
  });
  overlay.addEventListener('click', closeAllPanels);

  // General settings
  document.getElementById('lang-select').addEventListener('change', e => {
    App.settings.lang = e.target.value;
    saveSettings();
  });
  document.getElementById('toggle-reduced').addEventListener('change', e => {
    App.settings.reducedMotion = e.target.checked;
    document.body.classList.toggle('reduced-motion', e.target.checked);
    saveSettings();
  });

  // API key panel
  document.getElementById('save-api-key').addEventListener('click', async () => {
    App.settings.geminiKey = document.getElementById('gemini-key-input').value.trim();
    App.settings.geminiModel = document.getElementById('gemini-model-select').value;
    App.settings.groqKey = document.getElementById('groq-key-input').value.trim();
    App.settings.groqModel = document.getElementById('groq-model-select').value;
    App.settings.apiKey = document.getElementById('api-key-input').value.trim();
    App.settings.model = document.getElementById('api-model-select').value;
    App.settings.togetherKey = document.getElementById('together-key-input').value.trim();
    App.settings.togetherModel = document.getElementById('together-model-select').value;
    App.settings.mistralKey = document.getElementById('mistral-key-input').value.trim();
    App.settings.mistralModel = document.getElementById('mistral-model-select').value;

    const status = document.getElementById('api-key-status');
    status.textContent = 'Saving…';

    const ok = await saveSettings();

    if (!ok) {
      status.textContent = 'Save failed — check the Void server is running and try again.';
      return;
    }

    // Verify by reading settings back from the server rather than trusting local state
    try {
      const verifyRes = await fetch('/api/settings');
      const serverSettings = await verifyRes.json();
      const mismatch =
        (serverSettings.geminiKey || '') !== App.settings.geminiKey ||
        (serverSettings.groqKey || '') !== App.settings.groqKey ||
        (serverSettings.apiKey || '') !== App.settings.apiKey ||
        (serverSettings.togetherKey || '') !== App.settings.togetherKey ||
        (serverSettings.mistralKey || '') !== App.settings.mistralKey;

      if (mismatch) {
        status.textContent = 'Saved, but server shows different values — try reloading the page.';
        console.warn('Settings mismatch after save:', { sent: App.settings, server: serverSettings });
      } else {
        const anyKey = App.settings.geminiKey || App.settings.groqKey || App.settings.apiKey || App.settings.togetherKey || App.settings.mistralKey;
        status.textContent = anyKey ? 'Keys saved and verified.' : 'No keys set.';
      }
    } catch (e) {
      status.textContent = 'Saved, but could not verify — check Termux for errors.';
    }

    updateModelPillLabel();
    refreshDashboard();
  });

  // Chat settings panel
  document.getElementById('clear-history-btn').addEventListener('click', async () => {
    try {
      await fetch('/api/clear', { method: 'POST' });
    } catch (e) { /* proceed regardless */ }
    resetChatView();
    closeAllPanels();
  });
}

function getActiveModelLabel() {
  // Explicit choice from the unified picker wins, if its key is still configured.
  const keyMap = { gemini: App.settings.geminiKey, groq: App.settings.groqKey, openrouter: App.settings.apiKey };

  if (App.settings.activeProvider && keyMap[App.settings.activeProvider] && App.settings.activeModel) {
    const entry = App.modelCatalog.find(m => m.id === App.settings.activeModel && m.provider === App.settings.activeProvider);
    return entry ? entry.label : App.settings.activeModel;
  }

  // Fall back to whichever provider is first in the order AND has a key.
  const order = App.settings.providerOrder || ['gemini', 'groq', 'openrouter'];
  const modelMap = { gemini: App.settings.geminiModel, groq: App.settings.groqModel, openrouter: App.settings.model };
  const active = order.find(p => keyMap[p]);
  if (!active) return null;

  const model = modelMap[active];
  const entry = App.modelCatalog.find(m => m.id === model && m.provider === active);
  return entry ? entry.label : model;
}

function updateModelPillLabel() {
  const label = getActiveModelLabel();
  document.getElementById('model-pill').firstChild.textContent = (label || 'No provider') + ' ';
}

/* ============ Unified model picker sheet ============ */

function setupModelSheet() {
  const overlay = document.getElementById('model-sheet-overlay');
  overlay.addEventListener('click', closeModelSheet);
}

function openModelSheet() {
  renderModelSheet();
  document.getElementById('model-sheet').classList.add('open');
  document.getElementById('model-sheet-overlay').classList.add('open');
}

function closeModelSheet() {
  document.getElementById('model-sheet').classList.remove('open');
  document.getElementById('model-sheet-overlay').classList.remove('open');
}

function renderModelSheet() {
  const list = document.getElementById('model-sheet-list');
  const keyMap = { gemini: App.settings.geminiKey, groq: App.settings.groqKey, openrouter: App.settings.apiKey };
  const providerLabels = { gemini: 'Gemini', groq: 'Groq', openrouter: 'OpenRouter' };

  list.innerHTML = '';

  if (!App.modelCatalog.length) {
    list.innerHTML = '<p class="muted small">No models available — check the Void server is running.</p>';
    return;
  }

  App.modelCatalog.forEach(m => {
    const hasKey = !!keyMap[m.provider];
    const isActive = App.settings.activeProvider === m.provider && App.settings.activeModel === m.id;

    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'model-row' + (isActive ? ' active' : '');
    row.innerHTML = `
      <div class="model-row-text">
        <span class="model-row-name">${m.label}</span>
        <span class="model-row-provider">${providerLabels[m.provider]}${hasKey ? '' : ' · no key set'}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="model-row-dot ${hasKey ? 'ready' : ''}"></span>
        <svg class="model-row-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
    `;
    row.addEventListener('click', () => selectModel(m));
    list.appendChild(row);
  });
}

async function selectModel(m) {
  const keyMap = { gemini: App.settings.geminiKey, groq: App.settings.groqKey, openrouter: App.settings.apiKey };
  if (!keyMap[m.provider]) {
    closeModelSheet();
    addChatMessage('ai error', `No API key set for ${m.provider}. Add one in Settings → API Keys, then pick this model again.`);
    openPanel('panel-api');
    return;
  }

  App.settings.activeProvider = m.provider;
  App.settings.activeModel = m.id;
  await saveSettings();
  updateModelPillLabel();
  closeModelSheet();
}

function openPanel(panelId) {
  document.getElementById(panelId).classList.add('open');
  document.getElementById('panel-overlay').classList.add('open');
  if (panelId === 'panel-api') {
    if (App.settings.geminiKey) document.getElementById('gemini-key-input').value = App.settings.geminiKey;
    if (App.settings.groqKey) document.getElementById('groq-key-input').value = App.settings.groqKey;
    if (App.settings.apiKey) document.getElementById('api-key-input').value = App.settings.apiKey;
    if (App.settings.togetherKey) document.getElementById('together-key-input').value = App.settings.togetherKey;
    if (App.settings.mistralKey) document.getElementById('mistral-key-input').value = App.settings.mistralKey;
  }
}

function closeAllPanels() {
  document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('open'));
  document.getElementById('panel-overlay').classList.remove('open');
}

/* ============ Dashboard ============ */

/* ============ Gaming Hub (dashboard replacement) ============ */

// Generic structure so new games/entries can be added without touching
// any rendering logic — just append to this object.
const GAMES_DB = {
  mlbb: {
    name: 'Mobile Legends',
    short: 'MLBB',
    characters: [
      { name: 'Fanny', tag: 'Assassin' },
      { name: 'Granger', tag: 'Marksman' },
      { name: 'Lancelot', tag: 'Assassin' },
      { name: 'Angela', tag: 'Support' },
      { name: 'Tigreal', tag: 'Tank' },
      { name: 'Gusion', tag: 'Assassin' },
      { name: 'Chou', tag: 'Fighter' },
      { name: 'Ling', tag: 'Assassin' },
      { name: 'Kagura', tag: 'Mage' },
      { name: 'Esmeralda', tag: 'Mage/Tank' },
      { name: 'Lesley', tag: 'Marksman' },
      { name: 'Karrie', tag: 'Marksman' },
      { name: 'Khufra', tag: 'Tank' },
      { name: 'Mathilda', tag: 'Support' },
      { name: 'Beatrix', tag: 'Marksman' },
      { name: 'Yu Zhong', tag: 'Fighter' },
      { name: 'Paquito', tag: 'Fighter' },
      { name: 'Valentina', tag: 'Mage' },
      { name: 'Aldous', tag: 'Fighter' },
      { name: 'Hayabusa', tag: 'Assassin' },
      { name: 'Saber', tag: 'Assassin' },
      { name: 'Layla', tag: 'Marksman' },
      { name: 'Miya', tag: 'Marksman' },
      { name: 'Alucard', tag: 'Fighter' },
      { name: 'Zilong', tag: 'Fighter' },
      { name: 'Fredrinn', tag: 'Fighter/Tank' },
      { name: 'Joy', tag: 'Assassin' },
      { name: 'Arlott', tag: 'Fighter' },
      { name: 'Suyou', tag: 'Assassin' },
      { name: 'Lukas', tag: 'Fighter' },
    ],
    weapons: [
      { name: 'Blade of Despair', tag: 'Physical' },
      { name: 'Clock of Destiny', tag: 'Magic' },
      { name: "Demon Hunter Sword", tag: 'Physical' },
      { name: 'Holy Crystal', tag: 'Magic' },
      { name: "Berserker's Fury", tag: 'Physical' },
      { name: 'Wind of Nature', tag: 'Physical' },
      { name: 'Immortality', tag: 'Defense' },
      { name: "Athena's Shield", tag: 'Defense' },
      { name: 'Antique Cuirass', tag: 'Defense' },
      { name: 'Brute Force Breastplate', tag: 'Defense' },
      { name: 'Genius Wand', tag: 'Magic' },
      { name: 'Lightning Truncheon', tag: 'Magic' },
      { name: 'Endless Battle', tag: 'Physical' },
      { name: 'Malefic Roar', tag: 'Physical' },
      { name: 'Windtalker', tag: 'Physical' },
      { name: 'Rose Gold Meteor', tag: 'Magic' },
      { name: 'Blade Armor', tag: 'Defense' },
      { name: 'Dominance Ice', tag: 'Defense' },
    ],
    maps: [
      { name: 'Land of Dawn', tag: '5v5' },
      { name: 'Mines of Glory', tag: 'Brawl' },
    ],
  },
  freefire: {
    name: 'Free Fire',
    short: 'FF',
    characters: [
      { name: 'Alok', tag: 'Support' },
      { name: 'Chrono', tag: 'Defense' },
      { name: 'K', tag: 'Hybrid' },
      { name: 'Kelly', tag: 'Speed' },
      { name: 'Wukong', tag: 'Stealth' },
    ],
    weapons: [
      { name: 'M1014', tag: 'Shotgun' },
      { name: 'AWM', tag: 'Sniper' },
      { name: 'Groza', tag: 'Assault Rifle' },
      { name: 'MP40', tag: 'SMG' },
    ],
    maps: [
      { name: 'Bermuda', tag: 'Battle Royale' },
      { name: 'Purgatory', tag: 'Battle Royale' },
      { name: 'Kalahari', tag: 'Clash Squad' },
    ],
  },
};

const HubState = {
  activeGame: null,
  activeTab: 'characters',
};

// Optional generated detail data (from generate_mlbb_data.py).
// If output/heroes.json or output/items.json don't exist yet, the app
// just falls back to showing name/tag only — nothing breaks.
const HubDetails = { heroes: {}, items: {} };

async function loadHubDetails() {
  try {
    const heroRes = await fetch('output/heroes.json');
    if (heroRes.ok) HubDetails.heroes = await heroRes.json();
  } catch (_) {}
  try {
    const itemRes = await fetch('output/items.json');
    if (itemRes.ok) HubDetails.items = await itemRes.json();
  } catch (_) {}
}

function setupGameHub() {
  renderGameRail();
  setupInfoTabs();
  HubState.activeGame = Object.keys(GAMES_DB)[0];
  loadHubDetails().then(renderInfoGrid);
  renderInfoGrid();
  setupSkyBand();
  setupInfoDetailSheet();
}

function closeInfoDetailSheet() {
  document.getElementById('info-detail-overlay').classList.remove('open');
  document.getElementById('info-detail-sheet').classList.remove('open');
}

function setupInfoDetailSheet() {
  document.getElementById('info-detail-overlay').addEventListener('click', closeInfoDetailSheet);
}

function openInfoDetail(entry) {
  const isWeapon = HubState.activeTab === 'weapons';
  const data = isWeapon ? HubDetails.items[entry.name] : HubDetails.heroes[entry.name];
  const content = document.getElementById('info-detail-content');

  if (!data) {
    content.innerHTML = `
      <div class="info-detail-hero-head">
        ${tileHTML(entry.name, entry.tag, 'lg')}
        <div>
          <div class="sheet-title" style="padding:0;">${entry.name}</div>
          <p class="info-detail-tag">${entry.tag}</p>
        </div>
      </div>
      <p class="muted small" style="padding:0 4px 16px;">No details added yet for this one.</p>
    `;
  } else if (isWeapon) {
    content.innerHTML = `
      <div class="info-detail-hero-head">
        ${tileHTML(data.name, data.category, 'lg')}
        <div>
          <div class="sheet-title" style="padding:0;">${data.name}</div>
          <p class="info-detail-tag">${data.category || ''}</p>
        </div>
      </div>
      ${renderTileRow('Best for', data.best_for)}
    `;
  } else {
    content.innerHTML = `
      <div class="info-detail-hero-head">
        ${tileHTML(data.name, data.role, 'lg')}
        <div>
          <div class="sheet-title" style="padding:0;">${data.name}</div>
          <p class="info-detail-tag">${data.role || ''}</p>
        </div>
      </div>
      ${renderTileRow('Countered by', data.counters)}
      ${renderTileRow('Best build', data.best_build)}
      ${data.skill_combo ? `
        <div class="info-detail-section-label">Skill combo</div>
        <p class="info-detail-summary">${data.skill_combo}</p>
      ` : ''}
      ${renderTileRow('Pairs well with', data.team_combo)}
    `;
  }

  document.getElementById('info-detail-overlay').classList.add('open');
  document.getElementById('info-detail-sheet').classList.add('open');
}

// Deterministic color from a name, used for icon tile gradients
function colorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return hue;
}

function tileHTML(name, tag, size = 'sm') {
  const hue = colorFromName(name);
  const initials = name.slice(0, 2).toUpperCase();
  const sizeClass = size === 'lg' ? 'tile-lg' : size === 'card' ? 'tile-card' : 'tile-sm';
  return `
    <div class="name-tile ${sizeClass}" style="background: linear-gradient(135deg, hsl(${hue}, 65%, 45%), hsl(${(hue + 50) % 360}, 60%, 35%));">
      <span>${initials}</span>
    </div>
  `;
}

function renderTileRow(label, items) {
  if (!items || !items.length) return '';
  return `
    <div class="info-detail-section-label">${label}</div>
    <div class="tile-row">
      ${items.map(item => {
        const name = typeof item === 'string' ? item : item.name;
        return `
          <div class="tile-row-item">
            ${tileHTML(name, '', 'sm')}
            <span class="tile-row-label">${name}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderGameRail() {
  const rail = document.getElementById('game-rail');
  rail.innerHTML = '';
  Object.entries(GAMES_DB).forEach(([id, game], i) => {
    const tile = document.createElement('button');
    tile.className = 'game-tile' + (i === 0 ? ' active' : '');
    tile.dataset.game = id;
    tile.innerHTML = `
      <div class="game-tile-icon">${game.short}</div>
      <div class="game-tile-label">${game.name}</div>
    `;
    tile.addEventListener('click', () => {
      document.querySelectorAll('.game-tile').forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      HubState.activeGame = id;
      renderInfoGrid();
    });
    rail.appendChild(tile);
  });
}

function setupInfoTabs() {
  document.querySelectorAll('.info-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      HubState.activeTab = tab.dataset.tab;
      renderInfoGrid();
    });
  });
}

function renderInfoGrid() {
  const grid = document.getElementById('info-grid');
  const game = GAMES_DB[HubState.activeGame];
  if (!game) { grid.innerHTML = ''; return; }

  const entries = game[HubState.activeTab] || [];
  if (entries.length === 0) {
    grid.innerHTML = `<div class="info-grid-empty">No ${HubState.activeTab} listed yet for ${game.name}.</div>`;
    return;
  }

  grid.innerHTML = entries.map(entry => `
    <div class="info-card">
      ${tileHTML(entry.name, entry.tag, 'card')}
      <div class="info-card-name">${entry.name}</div>
      <div class="info-card-tag">${entry.tag}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.info-card').forEach((card, i) => {
    card.addEventListener('click', () => openInfoDetail(entries[i]));
  });
}

/* ---------- Sky band: live weather, automatic on load ---------- */

// WMO weather codes (from Open-Meteo) bucketed into visual states.
function weatherCodeToVisualState(code, isDay) {
  if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night';
  if (code === 2 || code === 3) return 'clouds';
  if (code === 45 || code === 48) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return isDay ? 'clear-day' : 'clear-night';
}

function setupSkyBand() {
  document.getElementById('sky-refresh').addEventListener('click', () => {
    if (App.location) {
      loadSkyWeather(App.location.lat, App.location.lon);
    } else {
      requestSkyLocation();
    }
  });

  if (App.location) {
    document.getElementById('sky-place').textContent = App.location.label;
    loadSkyWeather(App.location.lat, App.location.lon);
  } else {
    requestSkyLocation();
  }
}

function requestSkyLocation() {
  const placeEl = document.getElementById('sky-place');
  if (!navigator.geolocation) {
    placeEl.textContent = 'Location not supported';
    return;
  }

  placeEl.textContent = 'Locating you…';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      let label = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

      try {
        const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const data = await res.json();
          if (data.label) label = data.label;
        }
      } catch (e) { /* keep coordinate fallback */ }

      App.location = { lat, lon, label };
      placeEl.textContent = label;
      loadSkyWeather(lat, lon);
      addMapWidgetIfMissing();
      refreshDashboard();
    },
    () => {
      placeEl.textContent = 'Location unavailable';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

async function loadSkyWeather(lat, lon) {
  const band = document.getElementById('sky-band');
  try {
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('weather fetch failed');
    const w = await res.json();

    const state = weatherCodeToVisualState(w.weather_code, w.is_day);
    band.dataset.state = state;

    document.getElementById('sky-temp').textContent = `${Math.round(w.temp)}°`;
    document.getElementById('sky-desc').textContent = w.description || '—';
    document.getElementById('sky-feels').textContent = `Feels like ${Math.round(w.feels_like)}°`;
    if (w.temp_max !== undefined && w.temp_min !== undefined) {
      document.getElementById('sky-range').textContent = `H: ${Math.round(w.temp_max)}°  L: ${Math.round(w.temp_min)}°`;
    }
  } catch (e) {
    band.dataset.state = 'clouds';
    document.getElementById('sky-desc').textContent = 'Weather unavailable';
  }
}

function setupDashboard() {}

function refreshDashboard() {
  // The old dashboard's stat cards were replaced by the gaming hub.
  // Usage stats are still tracked in App.stats for potential future use,
  // but there's no longer a dashboard UI surface to push them into —
  // kept as a safe no-op so existing call sites don't break.
}

/* ============ Canvas widgets (free drag + pan/zoom) ============ */

let widgetSeq = 0;
let widgetPositions = {}; // id -> {x, y}

const SNAP_GRID = 16; // pixels for grid snapping

function setupCanvas() {
  document.getElementById('canvas-add').addEventListener('click', openWidgetMenu);
  document.getElementById('canvas-empty-add').addEventListener('click', openWidgetMenu);
  document.getElementById('canvas-clear').addEventListener('click', () => {
    document.getElementById('canvas-board').innerHTML = '';
    widgetPositions = {};
    persistWidgetLayout();
    updateCanvasEmptyState();
  });

  setupWidgetMenu();
  setupCanvasPanZoom();

  // Load existing widgets from persisted positions, or add defaults on first load
  if (Object.keys(widgetPositions).length === 0) {
    addTimeWidget();
    addWeatherWidget();
    persistWidgetLayout();
  } else {
    // Re-render widgets from saved positions
    document.getElementById('canvas-board').innerHTML = '';
    if (widgetPositions['widget-time']) addTimeWidget();
    if (widgetPositions['widget-weather']) addWeatherWidget();
  }
  updateCanvasEmptyState();
}

function setupWidgetMenu() {
  const overlay = document.getElementById('widget-menu-overlay');
  const menu = document.getElementById('widget-menu');
  const list = document.getElementById('widget-menu-list');

  // Widget type definitions
  const widgetTypes = [
    { id: 'time', label: 'Clock', desc: 'Current time' },
    { id: 'weather', label: 'Weather', desc: 'Local forecast' },
  ];

  list.innerHTML = widgetTypes.map(w => `
    <button class="widget-menu-item" data-widget-type="${w.id}">
      <strong>${w.label}</strong>
      <span class="widget-menu-desc">${w.desc}</span>
    </button>
  `).join('');

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.widget-menu-item');
    if (!btn) return;
    const type = btn.dataset.widgetType;
    closeWidgetMenu();
    if (type === 'time') addTimeWidget();
    else if (type === 'weather') addWeatherWidget();
    updateCanvasEmptyState();
  });

  overlay.addEventListener('click', closeWidgetMenu);
}

function openWidgetMenu() {
  document.getElementById('widget-menu-overlay').classList.add('open');
  document.getElementById('widget-menu').classList.add('open');
}

function closeWidgetMenu() {
  document.getElementById('widget-menu-overlay').classList.remove('open');
  document.getElementById('widget-menu').classList.remove('open');
}

/* ---- pan & zoom ---- */

function setupCanvasPanZoom() {
  const viewport = document.getElementById('canvas-viewport');
  const board = document.getElementById('canvas-board');
  const panBtn = document.getElementById('canvas-pan-toggle');

  applyCanvasTransform();

  panBtn.addEventListener('click', () => {
    App.canvasView.panMode = !App.canvasView.panMode;
    panBtn.classList.toggle('active', App.canvasView.panMode);
  });

  document.getElementById('canvas-zoom-in').addEventListener('click', () => zoomCanvas(1.2));
  document.getElementById('canvas-zoom-out').addEventListener('click', () => zoomCanvas(1 / 1.2));
  document.getElementById('canvas-fit').addEventListener('click', () => {
    App.canvasView = { x: 0, y: 0, scale: 1, panMode: App.canvasView.panMode };
    applyCanvasTransform();
  });

  let isPanning = false;
  let startX = 0, startY = 0, startViewX = 0, startViewY = 0;

  viewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.widget-card')) return; // widget drag handles its own
    isPanning = true;
    viewport.classList.add('panning');
    startX = e.clientX;
    startY = e.clientY;
    startViewX = App.canvasView.x;
    startViewY = App.canvasView.y;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isPanning) return;
    App.canvasView.x = startViewX + (e.clientX - startX);
    App.canvasView.y = startViewY + (e.clientY - startY);
    applyCanvasTransform();
  });

  ['pointerup', 'pointercancel'].forEach(evt => {
    viewport.addEventListener(evt, () => {
      isPanning = false;
      viewport.classList.remove('panning');
    });
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    zoomCanvas(factor);
  }, { passive: false });
}

function zoomCanvas(factor) {
  const next = Math.min(2.5, Math.max(0.4, App.canvasView.scale * factor));
  App.canvasView.scale = next;
  applyCanvasTransform();
}

function applyCanvasTransform() {
  const board = document.getElementById('canvas-board');
  const { x, y, scale } = App.canvasView;
  board.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

/* ---- widget persistence ---- */

async function persistWidgetLayout() {
  try {
    await fetch('/api/widgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(widgetPositions)
    });
  } catch (e) { /* non-critical */ }
}

function placeWidget(card, id, defaultX, defaultY) {
  const pos = widgetPositions[id] || { x: defaultX, y: defaultY };
  widgetPositions[id] = pos;
  card.style.left = pos.x + 'px';
  card.style.top = pos.y + 'px';
  makeWidgetDraggable(card, id);
}

function snapToGrid(value, gridSize = SNAP_GRID) {
  return Math.round(value / gridSize) * gridSize;
}

function snapToEdges(x, y, card) {
  const threshold = 16;
  const board = document.getElementById('canvas-board');
  const allCards = board.querySelectorAll('.widget-card:not(.dragging)');
  let snappedX = x;
  let snappedY = y;

  const rect = card.getBoundingClientRect();
  const cardW = rect.width;
  const cardH = rect.height;

  allCards.forEach(other => {
    const otherRect = other.getBoundingClientRect();
    const otherX = parseFloat(other.style.left) || 0;
    const otherY = parseFloat(other.style.top) || 0;
    const otherW = otherRect.width;
    const otherH = otherRect.height;

    // Snap X: left edge to other left, or right edge to other right
    if (Math.abs(x - otherX) < threshold) snappedX = otherX;
    if (Math.abs((x + cardW) - (otherX + otherW)) < threshold) snappedX = otherX + otherW - cardW;

    // Snap Y: top edge to other top, or bottom to other bottom
    if (Math.abs(y - otherY) < threshold) snappedY = otherY;
    if (Math.abs((y + cardH) - (otherY + otherH)) < threshold) snappedY = otherY + otherH - cardH;
  });

  return { x: snapToGrid(snappedX), y: snapToGrid(snappedY) };
}

function makeWidgetDraggable(card, id) {
  const handle = card.querySelector('.widget-head');
  if (!handle) return;

  let dragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;

  handle.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.widget-close')) return;
    dragging = true;
    card.classList.add('dragging');
    startX = e.clientX;
    startY = e.clientY;
    startLeft = parseFloat(card.style.left) || 0;
    startTop = parseFloat(card.style.top) || 0;
    handle.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });

  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const scale = App.canvasView.scale || 1;
    const dx = (e.clientX - startX) / scale;
    const dy = (e.clientY - startY) / scale;
    let newLeft = startLeft + dx;
    let newTop = startTop + dy;

    // Apply snapping (grid + edges)
    const snapped = snapToEdges(newLeft, newTop, card);
    newLeft = snapped.x;
    newTop = snapped.y;

    card.style.left = newLeft + 'px';
    card.style.top = newTop + 'px';
    widgetPositions[id] = { x: newLeft, y: newTop };
  });

  ['pointerup', 'pointercancel'].forEach(evt => {
    handle.addEventListener(evt, () => {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('dragging');
      persistWidgetLayout();
    });
  });
}

function updateCanvasEmptyState() {
  const board = document.getElementById('canvas-board');
  document.getElementById('canvas-empty').classList.toggle('hidden', board.children.length > 0);
}

function requestLocationOnBoot() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      App.location = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        label: null
      };
      // Optionally update weather/weather widget if already exists
      const weatherWidget = document.getElementById('widget-weather');
      if (weatherWidget) updateWeatherWidget();
    },
    () => { /* permission denied or error, silently continue */ }
  );
}

function addTimeWidget() {
  const board = document.getElementById('canvas-board');
  const card = document.createElement('div');
  card.className = 'widget-card';
  card.id = 'widget-time';
  card.innerHTML = `
    <div class="widget-head">
      <span>TIME</span>
      <button class="widget-close" data-remove="widget-time">&times;</button>
    </div>
    <div class="widget-clock-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
    <div class="widget-time-value" id="widget-time-value">--:--:--</div>
    <div class="widget-time-sub" id="widget-time-sub"></div>
  `;
  board.appendChild(card);
  placeWidget(card, 'widget-time', 60, 60);
  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove();
    delete widgetPositions['widget-time'];
    persistWidgetLayout();
    updateCanvasEmptyState();
  });
  tickTimeWidget();
  updateCanvasEmptyState();
}

function tickTimeWidget() {
  const valueEl = document.getElementById('widget-time-value');
  const subEl = document.getElementById('widget-time-sub');
  if (!valueEl) return;
  const now = new Date();
  valueEl.textContent = now.toLocaleTimeString();
  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  subEl.textContent = `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
  setTimeout(tickTimeWidget, 1000);
}

async function addWeatherWidget() {
  const board = document.getElementById('canvas-board');
  const card = document.createElement('div');
  card.className = 'widget-card';
  card.id = 'widget-weather';
  card.innerHTML = `
    <div class="widget-head">
      <span>WEATHER</span>
      <button class="widget-close" data-remove="widget-weather">&times;</button>
    </div>
    <div class="widget-weather-loc" id="weather-loc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span>Allow location to see local weather</span></div>
    <div id="weather-body"></div>
  `;
  board.appendChild(card);
  placeWidget(card, 'widget-weather', 60, 260);
  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove();
    delete widgetPositions['widget-weather'];
    persistWidgetLayout();
    updateCanvasEmptyState();
  });
  updateCanvasEmptyState();

  if (App.location) loadWeatherForWidget();
}

async function loadWeatherForWidget() {
  const locEl = document.getElementById('weather-loc');
  const bodyEl = document.getElementById('weather-body');
  if (!locEl || !bodyEl || !App.location) return;

  locEl.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> <span>${App.location.label}</span>`;
  bodyEl.innerHTML = `<div class="muted small">Loading…</div>`;

  try {
    const res = await fetch(`/api/weather?lat=${App.location.lat}&lon=${App.location.lon}`);
    if (!res.ok) throw new Error('weather fetch failed');
    const w = await res.json();

    bodyEl.innerHTML = `
      <div class="widget-weather-main">
        <div class="widget-weather-icon"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17.5 19a4.5 4.5 0 1 0-1.41-8.78 6 6 0 0 0-11.59 2.78A4 4 0 0 0 5 21h12.5z"></path></svg></div>
        <div>
          <div class="widget-weather-temp">${w.temp}°C</div>
          <div class="widget-weather-desc">${w.description}</div>
        </div>
      </div>
      <div class="widget-weather-grid">
        <div class="widget-weather-stat"><div class="widget-weather-stat-label">Feels like</div><div class="widget-weather-stat-value">${w.feels_like}°C</div></div>
        <div class="widget-weather-stat"><div class="widget-weather-stat-label">Humidity</div><div class="widget-weather-stat-value">${w.humidity}%</div></div>
        <div class="widget-weather-stat"><div class="widget-weather-stat-label">Wind</div><div class="widget-weather-stat-value">${w.wind_speed} m/s</div></div>
        <div class="widget-weather-stat"><div class="widget-weather-stat-label">Pressure</div><div class="widget-weather-stat-value">${w.pressure} hPa</div></div>
      </div>
    `;
  } catch (e) {
    bodyEl.innerHTML = `<div class="muted small">Couldn't load weather right now.</div>`;
  }
}

/* ============ Assistant (voice) ============ */

let recognizer = null;
let isListening = false;

// Deep links for a fixed set of common apps. Each can take an optional
// query, used for search/play-style opens. Android intercepts these specific
// URL patterns and routes them to the matching installed app; if the app
// isn't installed, most fall back to opening the equivalent website instead.
const APP_DEEP_LINKS = {
  youtube: (q) => q
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
    : `https://www.youtube.com`,
  maps: (q) => q
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
    : `https://www.google.com/maps`,
  spotify: (q) => q
    ? `https://open.spotify.com/search/${encodeURIComponent(q)}`
    : `https://open.spotify.com`,
  whatsapp: (q) => q
    ? `https://wa.me/?text=${encodeURIComponent(q)}`
    : `https://web.whatsapp.com`,
  instagram: () => `https://www.instagram.com`,
  gmail: () => `https://mail.google.com`,
  camera: () => null // handled specially below — no web deep link for this one
};

const OPEN_TAG_PATTERN = /\[\[OPEN:([a-z]+):([^\]]*)\]\]/i;

/**
 * Looks for a [[OPEN:app:query]] tag in the AI's reply, fires the matching
 * deep link if found, and returns the reply text with the tag stripped out
 * so it's never shown to the user.
 */
function processOpenAppTags(reply) {
  const match = reply.match(OPEN_TAG_PATTERN);
  if (!match) return reply;

  const appId = match[1].toLowerCase();
  const query = match[2].trim();
  const cleanedReply = reply.replace(OPEN_TAG_PATTERN, '').trim();

  if (appId === 'camera') {
    // No universal web deep link for the camera app — best effort via a
    // capture-intent file input click, which on most phones opens the
    // camera picker directly.
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.capture = 'environment';
    tempInput.click();
    return cleanedReply;
  }

  const linkBuilder = APP_DEEP_LINKS[appId];
  if (linkBuilder) {
    const url = linkBuilder(query);
    if (url) window.open(url, '_blank');
  }

  return cleanedReply;
}

function resolveSpeechLang() {
  // Explicit setting always wins.
  if (App.settings.lang === 'ar') return 'ar-SA';
  if (App.settings.lang === 'en') return 'en-US';

  // 'auto' — follow the device/browser's own language rather than
  // hardcoding English, so speech recognition actually listens for
  // the language the person is likely to speak.
  const deviceLang = navigator.language || navigator.userLanguage || 'en-US';
  if (deviceLang.toLowerCase().startsWith('ar')) return 'ar-SA';
  return deviceLang;
}

function setupAssistant() {
  const orb = document.getElementById('orb-btn');
  const hint = document.getElementById('assistant-hint');
  const line = document.getElementById('assistant-line');
  const pillMic = document.getElementById('pill-mic');
  const pillStatus = document.getElementById('pill-status');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  orb.addEventListener('click', () => {
    if (!SpeechRecognition) {
      line.textContent = 'Voice input isn\'t supported in this browser. Try the Chat tab instead.';
      return;
    }

    if (isListening) {
      recognizer.stop();
      return;
    }

    recognizer = new SpeechRecognition();
    recognizer.lang = resolveSpeechLang();
    recognizer.interimResults = false;

    recognizer.onstart = () => {
      isListening = true;
      orb.classList.add('listening');
      hint.textContent = 'Listening…';
      pillMic.classList.add('active');
      pillStatus.classList.add('active');
      pillStatus.querySelector('span:last-child')?.remove();
      pillStatus.lastChild.textContent = ' Listening';
    };

    recognizer.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      line.textContent = `"${transcript}"`;
      const reply = await askVoid(transcript);
      const cleanedReply = processOpenAppTags(reply);
      line.textContent = cleanedReply;
      speak(cleanedReply);
    };

    recognizer.onerror = () => {
      line.textContent = 'Didn\'t catch that — try again.';
    };

    recognizer.onend = () => {
      isListening = false;
      orb.classList.remove('listening');
      hint.textContent = 'Tap to activate';
      pillMic.classList.remove('active');
      pillStatus.classList.remove('active');
    };

    recognizer.start();
  });
}

function speak(text) {
  if (!window.speechSynthesis || !App.settings.voiceEnabled) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = resolveSpeechLang();
  utter.rate = App.settings.voiceRate || 1.0;
  utter.pitch = App.settings.voicePitch || 1.0;

  if (App.settings.voiceName) {
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.name === App.settings.voiceName);
    if (match) utter.voice = match;
  }

  const orb = document.getElementById('orb-btn');
  const hint = document.getElementById('assistant-hint');

  utter.onstart = () => {
    orb?.classList.add('speaking');
    if (hint) hint.textContent = 'Void is speaking…';
  };
  utter.onend = () => {
    orb?.classList.remove('speaking');
    if (hint) hint.textContent = 'Tap to activate';
  };
  utter.onerror = () => {
    orb?.classList.remove('speaking');
  };

  window.speechSynthesis.speak(utter);
}

/* ============ Voice settings panel ============ */

function setupVoicePanel() {
  const enabledToggle = document.getElementById('toggle-voice-enabled');
  const voiceSelect = document.getElementById('voice-name-select');
  const rateRange = document.getElementById('voice-rate-range');
  const rateValue = document.getElementById('voice-rate-value');
  const pitchRange = document.getElementById('voice-pitch-range');
  const pitchValue = document.getElementById('voice-pitch-value');
  const testBtn = document.getElementById('voice-test-btn');

  enabledToggle.addEventListener('change', e => {
    App.settings.voiceEnabled = e.target.checked;
    saveSettings();
  });

  rateRange.addEventListener('input', e => {
    App.settings.voiceRate = parseFloat(e.target.value);
    rateValue.textContent = App.settings.voiceRate.toFixed(1) + '×';
  });
  rateRange.addEventListener('change', () => saveSettings());

  pitchRange.addEventListener('input', e => {
    App.settings.voicePitch = parseFloat(e.target.value);
    pitchValue.textContent = App.settings.voicePitch.toFixed(1);
  });
  pitchRange.addEventListener('change', () => saveSettings());

  function populateVoices() {
    if (!window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;
    voiceSelect.innerHTML = '<option value="">Default</option>';
    voices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      voiceSelect.appendChild(opt);
    });
    voiceSelect.value = App.settings.voiceName || '';
  }

  if (window.speechSynthesis) {
    populateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', populateVoices);
  }

  voiceSelect.addEventListener('change', e => {
    App.settings.voiceName = e.target.value;
    saveSettings();
  });

  testBtn.addEventListener('click', () => {
    const wasEnabled = App.settings.voiceEnabled;
    App.settings.voiceEnabled = true;
    speak('This is what Void sounds like.');
    App.settings.voiceEnabled = wasEnabled;
  });
}

/* ============ Custom commands panel ============ */

function setupCommandsPanel() {
  document.getElementById('add-command-btn').addEventListener('click', async () => {
    const labelInput = document.getElementById('command-label-input');
    const actionInput = document.getElementById('command-action-input');
    const label = labelInput.value.trim();
    const action = actionInput.value.trim();
    if (!label || !action) return;

    App.commands.push({ id: 'cmd_' + Date.now(), label, action });
    labelInput.value = '';
    actionInput.value = '';
    renderCommands();
    await saveCommands();
  });
}

function renderCommands() {
  const list = document.getElementById('commands-list');
  const empty = document.getElementById('commands-empty');
  list.innerHTML = '';

  if (!App.commands.length) {
    list.appendChild(empty);
    empty.classList.remove('hidden');
    return;
  }

  App.commands.forEach(cmd => {
    const row = document.createElement('div');
    row.className = 'command-row';
    row.innerHTML = `
      <div class="command-text">
        <span class="command-label"></span>
        <span class="command-action"></span>
      </div>
      <button class="row-remove" aria-label="Remove">&times;</button>
    `;
    row.querySelector('.command-label').textContent = cmd.label;
    row.querySelector('.command-action').textContent = cmd.action;
    row.querySelector('.row-remove').addEventListener('click', async () => {
      App.commands = App.commands.filter(c => c.id !== cmd.id);
      renderCommands();
      await saveCommands();
    });
    row.addEventListener('click', (e) => {
      if (e.target.closest('.row-remove')) return;
      runCommand(cmd);
    });
    list.appendChild(row);
  });
}

function runCommand(cmd) {
  const action = cmd.action.trim();
  if (/^https?:\/\//i.test(action)) {
    window.open(action, '_blank');
  } else {
    // Not a URL — treat as a quick prompt to Void instead of executing arbitrary system commands.
    switchView('view-chat');
    document.getElementById('user-input').value = action;
  }
}

/* ============ Task management panel ============ */

function setupTasksPanel() {
  const input = document.getElementById('task-input');
  document.getElementById('add-task-btn').addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;
    App.tasks.push({ id: 'task_' + Date.now(), text, done: false });
    input.value = '';
    renderTasks();
    await saveTasks();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('add-task-btn').click();
    }
  });
}

function renderTasks() {
  const list = document.getElementById('tasks-list');
  const empty = document.getElementById('tasks-empty');
  list.innerHTML = '';

  if (!App.tasks.length) {
    list.appendChild(empty);
    empty.classList.remove('hidden');
    return;
  }

  App.tasks.forEach(task => {
    const row = document.createElement('div');
    row.className = 'task-row';
    row.innerHTML = `
      <button class="task-check ${task.done ? 'done' : ''}" aria-label="Toggle done">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </button>
      <span class="task-text ${task.done ? 'done' : ''}"></span>
      <button class="row-remove" aria-label="Remove">&times;</button>
    `;
    row.querySelector('.task-text').textContent = task.text;
    row.querySelector('.task-check').addEventListener('click', async () => {
      task.done = !task.done;
      renderTasks();
      await saveTasks();
    });
    row.querySelector('.row-remove').addEventListener('click', async () => {
      App.tasks = App.tasks.filter(t => t.id !== task.id);
      renderTasks();
      await saveTasks();
    });
    list.appendChild(row);
  });
}

/* ============ Floating assistant panel ============ */

function setupFloatingAssistantPanel() {
  document.getElementById('toggle-floating-assistant').addEventListener('change', e => {
    App.settings.floatingAssistantEnabled = e.target.checked;
    saveSettings();
  });
}

/* ============ Shared "ask Void" used by both voice + chat ============ */

async function askVoid(message, image) {
  App.stats.queries++;
  App.stats.messages++;
  App.stats.totalInteractions++;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        image_base64: image ? image.base64 : undefined,
        image_mime: image ? image.mime : undefined,
        openrouter_key: App.settings.apiKey,
        model: App.settings.model,
        gemini_key: App.settings.geminiKey,
        gemini_model: App.settings.geminiModel,
        groq_key: App.settings.groqKey,
        groq_model: App.settings.groqModel,
        provider_order: App.settings.providerOrder,
        active_provider: App.settings.activeProvider,
        active_model: App.settings.activeModel,
        lang: App.settings.lang,
        location: App.location,
        response_mode: App.settings.responseMode
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.reply || `Request failed: ${res.status}`);
    }
    const data = await res.json();
    App.stats.replies++;
    App.stats.messages++;
    App.stats.totalInteractions++;
    refreshDashboard();
    return data.reply || 'No response received.';
  } catch (err) {
    if (err.name === 'AbortError') {
      return 'No response after 50s. The model may be overloaded — try again.';
    }
    return err.message || 'Connection lost. Check that the Void server is running.';
  }
}

/* ============ Chat ============ */

function setupChat() {
  const composer = document.getElementById('composer');
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const attachBtn = document.getElementById('attach-btn');
  const imageInput = document.getElementById('image-input');
  const previewRow = document.getElementById('image-preview-row');
  const previewThumb = document.getElementById('image-preview-thumb');
  const previewRemove = document.getElementById('image-preview-remove');

  let pendingImage = null; // { base64, mime, dataUrl }

  attachBtn.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      pendingImage = { base64, mime: file.type || 'image/jpeg', dataUrl };
      previewThumb.src = dataUrl;
      previewRow.style.display = 'block';
      attachBtn.classList.add('has-image');
    };
    reader.readAsDataURL(file);
    imageInput.value = '';
  });

  previewRemove.addEventListener('click', () => {
    pendingImage = null;
    previewRow.style.display = 'none';
    attachBtn.classList.remove('has-image');
  });

  document.getElementById('model-pill').addEventListener('click', () => openModelSheet());
  document.getElementById('chat-new-btn').addEventListener('click', resetChatView);
  document.getElementById('chat-history-btn').addEventListener('click', () => openPanel('panel-chat'));

  const modePill = document.getElementById('mode-pill');
  const modes = ['standard', 'concise', 'detailed'];
  const modeLabels = { standard: 'Standard', concise: 'Concise', detailed: 'Detailed' };
  modePill.addEventListener('click', () => {
    const i = modes.indexOf(App.settings.responseMode);
    App.settings.responseMode = modes[(i + 1) % modes.length];
    modePill.firstChild.textContent = modeLabels[App.settings.responseMode] + ' ';
    saveSettings();
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      composer.requestSubmit();
    }
  });

  composer.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    const image = pendingImage;
    if (!text && !image) return;

    addChatMessage('user', text, image ? image.dataUrl : null);
    input.value = '';
    input.style.height = 'auto';
    pendingImage = null;
    previewRow.style.display = 'none';
    attachBtn.classList.remove('has-image');

    const typingRow = addTypingIndicator();
    const reply = await askVoid(text, image);
    typingRow.remove();
    const cleanedReply = processOpenAppTags(reply);
    const isError = /^(ERROR|HTTP \d|No API key|All configured providers failed|Connection lost|The model took too long|Network issue)/i.test(cleanedReply);
    addChatMessage(isError ? 'ai error' : 'ai', cleanedReply);
  });
}

function addChatMessage(role, text, imageDataUrl) {
  const chatBox = document.getElementById('chat-box');
  const row = document.createElement('div');
  row.className = 'msg ' + role;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  if (imageDataUrl) {
    const img = document.createElement('img');
    img.src = imageDataUrl;
    img.className = 'msg-image';
    bubble.appendChild(img);
  }
  if (text) {
    const textNode = document.createElement('div');
    textNode.textContent = text;
    bubble.appendChild(textNode);
  }
  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

function addTypingIndicator() {
  const chatBox = document.getElementById('chat-box');
  const row = document.createElement('div');
  row.className = 'msg ai';
  row.innerHTML = '<div class="msg-bubble typing"><span></span><span></span><span></span></div>';
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

function resetChatView() {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = '';
  addChatMessage('ai', 'Conversation cleared. What would you like to talk about?');
  App.stats.conversations++;
}

/* ============ Location / GPS ============ */

function setupLocationPanel() {
  document.getElementById('request-location-btn').addEventListener('click', requestLocation);
  document.getElementById('map-provider-select').addEventListener('change', e => {
    App.settings.mapProvider = e.target.value;
    saveSettings();
  });
}

function requestLocation() {
  const statusSub = document.getElementById('location-status-sub');
  if (!navigator.geolocation) {
    statusSub.textContent = 'Not supported in this browser.';
    return;
  }
  statusSub.textContent = 'Requesting…';

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      let label = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;

      try {
        const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const data = await res.json();
          if (data.label) label = data.label;
        }
      } catch (e) { /* fall back to coordinates */ }

      App.location = { lat, lon, label };
      statusSub.textContent = `Allowed — ${label}`;
      addMapWidgetIfMissing();
      loadWeatherForWidget();
      refreshDashboard();
    },
    (err) => {
      statusSub.textContent = 'Permission denied or unavailable.';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function addMapWidgetIfMissing() {
  if (document.getElementById('widget-map') || !App.location) return;
  const board = document.getElementById('canvas-board');
  const card = document.createElement('div');
  card.className = 'widget-card';
  card.id = 'widget-map';
  const { lat, lon } = App.location;
  card.innerHTML = `
    <div class="widget-head">
      <span>YOUR LOCATION</span>
      <button class="widget-close" data-remove="widget-map">&times;</button>
    </div>
    <div class="widget-map-frame">
      <iframe loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>
    </div>
  `;
  board.appendChild(card);
  placeWidget(card, 'widget-map', 60, 460);
  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove();
    delete widgetPositions['widget-map'];
    persistWidgetLayout();
    updateCanvasEmptyState();
  });
  updateCanvasEmptyState();
}

function openDirections(destinationQuery) {
  if (!App.location) {
    return 'I need your location first — open Settings → Location & GPS and allow access, then ask me again.';
  }
  const { lat, lon } = App.location;
  let url;
  if (App.settings.mapProvider === 'osm') {
    url = `https://www.openstreetmap.org/directions?from=${lat}%2C${lon}&to=${encodeURIComponent(destinationQuery)}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${encodeURIComponent(destinationQuery)}&travelmode=walking`;
  }
  window.open(url, '_blank');
  return `Opening directions to "${destinationQuery}" from your current location.`;
}

// Make available to inline-ish usage if extended later
window.VoidApp = { askVoid, openDirections, requestLocation };


