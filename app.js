/* =========================================================
   VOID — CORE APPLICATION LOGIC FRAMEWORK CONTROL ENGINE
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
    activeProvider: 'openrouter',
    activeModel: 'meta-llama/llama-3.2-3b-instruct:free',
    lang: 'auto',
    reducedMotion: false,
    responseMode: 'standard',
    voiceEnabled: false,
    floatingAssistantEnabled: false
  },
  stats: {
    totalInteractions: 0,
    conversations: 1,
    messages: 0,
    queries: 0,
    replies: 0
  },
  location: null,
  modules: {}
};

const panelHistory = [];
const widgetPositions = {};

document.addEventListener('DOMContentLoaded', () => {
  adjustTopHeaderTitle();
  initNavigation();
  initSettingsLayout();
  initChatEngine();
  initWorkspaceGrid();
  initGameHubLayout();
  loadApplicationConfig();
});

/* --- Sync Header Title Target --- */
function adjustTopHeaderTitle() {
  const topHeader = document.getElementById('workspace-title');
  if (topHeader) {
    topHeader.textContent = "GAME HUB";
  }
}

/* --- Navigation & Panel Orchestrator Routing --- */
function initNavigation() {
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#workspace-canvas-floor > .view-tab').forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      const tNode = document.getElementById(target);
      if (tNode) tNode.classList.add('active');
    });
  });

  const openSettings = document.getElementById('open-settings-btn');
  const closeSettings = document.getElementById('close-settings-btn');
  const vMain = document.getElementById('workspace-container');
  const vSet = document.getElementById('view-settings');

  if (openSettings && closeSettings && vMain && vSet) {
    openSettings.addEventListener('click', () => {
      vSet.classList.add('active');
    });
    closeSettings.addEventListener('click', () => {
      vSet.classList.remove('active');
    });
  }
}

/* --- Parameter System Preferences Actions --- */
function initSettingsLayout() {
  document.getElementById('save-keys-btn')?.addEventListener('click', () => {
    App.settings.geminiKey = document.getElementById('input-gemini-key')?.value || '';
    App.settings.groqKey = document.getElementById('input-groq-key')?.value || '';
    App.settings.apiKey = document.getElementById('input-api-key')?.value || '';
    persistSettingsToServer();
  });

  document.getElementById('save-models-btn')?.addEventListener('click', () => {
    App.settings.geminiModel = document.getElementById('input-gemini-model')?.value || 'gemini-2.5-flash';
    App.settings.groqModel = document.getElementById('input-groq-model')?.value || 'llama-3.3-70b-versatile';
    App.settings.model = document.getElementById('input-model')?.value || 'meta-llama/llama-3.2-3b-instruct:free';
    persistSettingsToServer();
    updateModelQuickSelectUI();
  });
}

/* --- Chat Engine with Fixed Multi-Provider Switcher --- */
function initChatEngine() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-msg-btn');
  if (!chatInput || !sendBtn) return;

  const inputContainer = document.querySelector('.chat-input-container');
  if (inputContainer && !document.getElementById('model-quick-select-strip')) {
    const selectorStrip = document.createElement('div');
    selectorStrip.id = 'model-quick-select-strip';
    selectorStrip.className = 'model-quick-strip monospace';
    inputContainer.insertBefore(selectorStrip, chatInput);
  }

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });

  const triggerSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendBubbleMessage('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    dispatchPromptToBackend(text);
  };

  sendBtn.addEventListener('click', triggerSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  });

  updateModelQuickSelectUI();
}

function updateModelQuickSelectUI() {
  const strip = document.getElementById('model-quick-select-strip');
  if (!strip) return;

  const modelsList = [
    { provider: 'gemini', label: 'GEMINI', name: App.settings.geminiModel },
    { provider: 'groq', label: 'GROQ', name: App.settings.groqModel },
    { provider: 'openrouter', label: 'OPENROUTER', name: App.settings.model }
  ];

  strip.innerHTML = modelsList.map(item => {
    const shortName = item.name.split('/').pop() || item.name;
    const isActive = (item.provider === App.settings.activeProvider);
    return `
      <button class="model-strip-pill ${isActive ? 'active' : ''}" data-provider="${item.provider}">
        <span class="provider-label">${item.label}:</span> ${shortName}
      </button>
    `;
  }).join('');

  strip.querySelectorAll('.model-strip-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const chosenProvider = pill.getAttribute('data-provider');
      App.settings.activeProvider = chosenProvider;
      
      if (chosenProvider === 'openrouter') App.settings.activeModel = App.settings.model;
      if (chosenProvider === 'groq') App.settings.activeModel = App.settings.groqModel;
      if (chosenProvider === 'gemini') App.settings.activeModel = App.settings.geminiModel;

      persistSettingsToServer();
      updateModelQuickSelectUI();
    });
  });
}

function appendBubbleMessage(role, text) {
  const box = document.getElementById('messages-box');
  if (!box) return;

  const bNode = document.createElement('div');
  bNode.className = `chat-bubble ${role}`;
  const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const label = role === 'user' ? 'USER::NODE' : 'VOID::CORE';

  bNode.innerHTML = `
    <div class="bubble-meta">${label} // ${stamp}</div>
    <div class="bubble-body">${parseMarkdownText(text)}</div>
  `;
  box.appendChild(bNode);
  box.scrollTop = box.scrollHeight;
  
  App.stats.messages++;
  updateStatusDashboardLines();
}

function parseMarkdownText(raw) {
  return raw
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
    .replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
}

function dispatchPromptToBackend(prompt) {
  const placeholder = document.createElement('div');
  placeholder.className = 'chat-bubble assistant';
  placeholder.innerHTML = `<div class="bubble-meta">VOID::CORE // INTERFACES</div><div class="bubble-body muted monospace">Computing network loop via active node profile context...</div>`;
  
  const box = document.getElementById('messages-box');
  box.appendChild(placeholder);
  box.scrollTop = box.scrollHeight;

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt,
      provider: App.settings.activeProvider,
      model: App.settings.activeModel
    })
  })
  .then(r => r.json())
  .then(data => {
    placeholder.remove();
    if (data.response) appendBubbleMessage('assistant', data.response);
  })
  .catch(() => {
    placeholder.remove();
    appendBubbleMessage('assistant', '!! ERR_CONNECTION: Offline response array logic pipeline required.');
  });
}

/* --- Draggable System Widgets Deck --- */
function initWorkspaceGrid() {
  document.querySelectorAll('[data-add-widget]').forEach(btn => {
    btn.addEventListener('click', () => { spawnWorkspaceWidget(btn.getAttribute('data-add-widget')); });
  });
}

function spawnWorkspaceWidget(type) {
  if (widgetPositions[type]) return;
  const board = document.getElementById('widget-board');
  if (!board) return;

  const card = document.createElement('div');
  card.className = 'dashboard-widget';
  card.id = `widget-${type}`;
  let title = 'MONITOR', bodyHTML = '';

  if (type === 'sys-stats') {
    title = 'SYSTEM LOG CORE';
    bodyHTML = `
      <div class="sys-metric-row monospace">
        <div class="sys-meta"><span>PROCESS ENGINE CPU</span><span class="val">24%</span></div>
        <div class="sys-progress-bar"><div class="sys-progress-fill" style="width: 24%"></div></div>
      </div>
    `;
  }
  card.innerHTML = `
    <div class="widget-head"><span>${title}</span><button class="widget-close" data-remove="${type}">×</button></div>
    <div class="widget-body">${bodyHTML}</div>
  `;
  board.appendChild(card);
  placeWidgetElement(card, type, 20, 20);
  bindDragLogic(card, type);
  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove(); delete widgetPositions[type]; updateCanvasEmptyState();
  });
  updateCanvasEmptyState();
}

function placeWidgetElement(el, type, x, y) {
  el.style.left = x + 'px'; el.style.top = y + 'px';
  widgetPositions[type] = { x, y };
}

function bindDragLogic(el, type) {
  const head = el.querySelector('.widget-head');
  let active = false, currentX, currentY, initialX, initialY, xOffset = widgetPositions[type].x, yOffset = widgetPositions[type].y;
  head.addEventListener('mousedown', e => {
    initialX = e.clientX - xOffset; initialY = e.clientY - yOffset; active = true;
  });
  document.addEventListener('mouseup', () => { active = false; });
  document.addEventListener('mousemove', e => {
    if (!active) return;
    currentX = e.clientX - initialX; currentY = e.clientY - initialY;
    xOffset = currentX; yOffset = currentY;
    el.style.left = currentX + "px"; el.style.top = currentY + "px";
    widgetPositions[type] = { x: currentX, y: currentY };
  });
}

function updateCanvasEmptyState() {
  const msg = document.getElementById('canvas-empty-msg');
  if (msg) msg.style.display = Object.keys(widgetPositions).length === 0 ? 'block' : 'none';
}

/* --- GameHub Repository Rendering with Meta Badge Logic --- */
function initGameHubLayout() {
  document.querySelectorAll('.gamehub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gamehub-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.gamehub-content-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`hub-view-${btn.getAttribute('data-hub-tab')}`);
      if (target) target.classList.add('active');
    });
  });

  if (typeof GameHubData !== 'undefined') {
    renderGameHubGridElements();
  }
}

function renderGameHubGridElements() {
  const hGrid = document.getElementById('heroes-grid-target');
  const iGrid = document.getElementById('items-grid-target');

  if (hGrid && GameHubData.heroes) {
    hGrid.innerHTML = GameHubData.heroes.map(hero => {
      // Look for custom META labels and slide them into separate structural wrapper formatting layers
      let processedBadgeText = hero.rarity;
      if (hero.rarity.includes('(META)')) {
        processedBadgeText = hero.rarity.replace('(META)', '<span class="meta-fade">(META)</span>');
      }

      return `
        <div class="hub-card" data-tier="${hero.rarity}" onclick="openGameHubDetailItem('heroes', '${hero.id}')">
          <div class="hub-card-media">
            <img class="hub-card-img" src="${hero.img}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' style=\'fill:%23111\'><rect width=\'100\' height=\'100\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23555\' font-family=\'monospace\' font-size=\'11\'>${hero.name}</text></svg>'">
            <span class="hub-card-badge">${processedBadgeText}</span>
          </div>
          <div class="hub-card-overlay">
            <div class="hub-card-title">${hero.name}</div>
            <div class="hub-card-sub">${hero.role}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (iGrid && GameHubData.items) {
    iGrid.innerHTML = GameHubData.items.map(item => `
      <div class="hub-card" data-tier="${item.tier}" onclick="openGameHubDetailItem('items', '${item.id}')">
        <div class="hub-card-media">
          <img class="hub-card-img" src="${item.img}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' style=\'fill:%23111\'><rect width=\'100\' height=\'100\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23555\' font-family=\'monospace\' font-size=\'10\'>${item.name}</text></svg>'">
          <span class="hub-card-badge">${item.tier}</span>
        </div>
        <div class="hub-card-overlay">
          <div class="hub-card-title">${item.name}</div>
          <div class="hub-card-sub">${item.type}</div>
        </div>
      </div>
    `).join('');
  }
}

function openGameHubDetailItem(collection, id) {
  const dataset = GameHubData[collection].find(x => x.id === id);
  if (!dataset) return;
  appendBubbleMessage('assistant', `**[${dataset.name}]** Profile Asset Decoupled Readout:\nType Role Parameters: \`${dataset.role || dataset.type}\` — Active Registry Metadata Log Complete.`);
}

/* --- Storage Sync Framework Handlers --- */
function loadApplicationConfig() {
  fetch('/api/settings')
    .then(r => r.json())
    .then(config => {
      if (!config) return;
      App.settings = { ...App.settings, ...config };
      updateStatusDashboardLines();
      updateModelQuickSelectUI();
    }).catch(() => {});
}

function persistSettingsToServer() {
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(App.settings)
  });
}

function updateStatusDashboardLines() {
  const line = document.getElementById('welcome-stats-line');
  if (line) line.innerText = `INT::${App.stats.totalInteractions} | MSG::${App.stats.messages}`;
}
