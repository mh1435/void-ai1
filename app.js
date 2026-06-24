/* =========================================================
   VOID — application logic
   No browser storage APIs — keys and configurations persist via
   backend api instead. Handles local asset queries for GameHub.
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
  modules: {}
};

// Static Local Content Engine for the GameHub (.png Extensions Fixed)
const GameHubData = {
  heroes: [
    { id: 'alpha', name: 'Alpha Prime', role: 'Vanguard', rarity: 'LEGENDARY', img: 'images/heroes/alpha.png', desc: 'Frontline cybernetic chassis built to absorb terminal impact parameters.' },
    { id: 'phantom', name: 'Phantom Spectre', role: 'Infiltrator', rarity: 'EPIC', img: 'images/heroes/phantom.png', desc: 'Quantum stealth operator focused on structural node extraction.' },
    { id: 'apex', name: 'Apex Titan', role: 'Enforcer', rarity: 'RARE', img: 'images/heroes/apex.png', desc: 'Heavy arms munitions engineer with localized gravity dampening fields.' }
  ],
  items: [
    { id: 'core_mod', name: 'Overclock Module', type: 'Processor', tier: 'TIER III', img: 'images/items/core_mod.png', desc: 'Injects transient cycles to local instruction streams, elevating capability parameters.' },
    { id: 'matrix_shield', name: 'Refractor Aegis', type: 'Shielding', tier: 'TIER II', img: 'images/items/matrix_shield.png', desc: 'Coherent energy plane engineered to disperse localized thermal distribution paths.' }
  ]
};

const panelHistory = [];
const widgetPositions = {};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSettingsLayout();
  initChatEngine();
  initWorkspaceGrid();
  initGameHubLayout();
  loadApplicationConfig();
});

/* --- Controller Navigation Core --- */
function initNavigation() {
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      const tNode = document.getElementById(target);
      if (tNode) tNode.classList.add('active');
    });
  });

  const openSettings = document.getElementById('open-settings-btn');
  const closeSettings = document.getElementById('close-settings-btn');
  const vMain = document.getElementById('view-main');
  const vSet = document.getElementById('view-settings');

  if (openSettings && closeSettings && vMain && vSet) {
    openSettings.addEventListener('click', () => {
      vMain.classList.remove('active');
      vSet.classList.add('active');
    });
    closeSettings.addEventListener('click', () => {
      vSet.classList.remove('active');
      vMain.classList.add('active');
      // Clear panel sub-layers
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      panelHistory.length = 0;
    });
  }
}

/* --- Slide Over Sub Panels Fix --- */
function initSettingsLayout() {
  document.querySelectorAll('[data-open-panel]').forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-open-panel');
      const panel = document.getElementById(targetId);
      if (panel) {
        panel.classList.add('active');
        panelHistory.push(panel);
      }
    });
  });

  document.querySelectorAll('[data-close-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = panelHistory.pop();
      if (panel) panel.classList.remove('active');
    });
  });

  const saveKeysBtn = document.getElementById('save-keys-btn');
  if (saveKeysBtn) {
    saveKeysBtn.addEventListener('click', () => {
      App.settings.geminiKey = document.getElementById('input-gemini-key')?.value || '';
      App.settings.groqKey = document.getElementById('input-groq-key')?.value || '';
      App.settings.apiKey = document.getElementById('input-api-key')?.value || '';
      App.settings.togetherKey = document.getElementById('input-together-key')?.value || '';
      App.settings.mistralKey = document.getElementById('input-mistral-key')?.value || '';
      persistSettingsToServer();
    });
  }

  const saveModelsBtn = document.getElementById('save-models-btn');
  if (saveModelsBtn) {
    saveModelsBtn.addEventListener('click', () => {
      App.settings.geminiModel = document.getElementById('input-gemini-model')?.value || 'gemini-2.5-flash';
      App.settings.groqModel = document.getElementById('input-groq-model')?.value || 'llama-3.3-70b-versatile';
      App.settings.model = document.getElementById('input-model')?.value || 'meta-llama/llama-3.2-3b-instruct:free';
      App.settings.togetherModel = document.getElementById('input-together-model')?.value || 'meta-llama/Llama-3.2-70B-Instruct-Turbo';
      App.settings.mistralModel = document.getElementById('input-mistral-model')?.value || 'mistral-large-latest';
      persistSettingsToServer();
    });
  }

  document.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const variant = swatch.getAttribute('data-theme');
      App.settings.theme = variant;
      document.body.setAttribute('data-theme-variant', variant);
      persistSettingsToServer();
    });
  });
}

/* --- Inference Chat Assistant Engine --- */
function initChatEngine() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-msg-btn');
  
  if (!chatInput || !sendBtn) return;

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

  document.getElementById('util-clear-btn')?.addEventListener('click', () => {
    fetch('/api/clear', { method: 'POST' })
      .then(() => {
        const box = document.getElementById('messages-box');
        if (box) {
          box.innerHTML = `
            <div class="matrix-welcome">
              <div class="welcome-logo">VOID</div>
              <p>Localized terminal core connected via micro-services. Memory engine initialized.</p>
              <div class="welcome-stats monospace" id="welcome-stats-line">INT::${App.stats.totalInteractions} | MSG::0</div>
            </div>
          `;
        }
      });
  });
}

function appendBubbleMessage(role, text) {
  const box = document.getElementById('messages-box');
  if (!box) return;

  const bNode = document.createElement('div');
  bNode.className = `chat-bubble ${role}`;
  
  const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
  placeholder.innerHTML = `<div class="bubble-meta">VOID::CORE // COMPUTING...</div><div class="bubble-body muted monospace">Executing pipeline loop...</div>`;
  
  const box = document.getElementById('messages-box');
  box.appendChild(placeholder);
  box.scrollTop = box.scrollHeight;

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  .then(r => r.json())
  .then(data => {
    placeholder.remove();
    if (data.response) {
      appendBubbleMessage('assistant', data.response);
    } else if (data.error) {
      appendBubbleMessage('assistant', `!! PIPELINE_ERROR: ${data.error}`);
    }
  })
  .catch(() => {
    placeholder.remove();
    appendBubbleMessage('assistant', '!! NETWORK_TIMEOUT: Transmission core drops links.');
  });
}

/* --- Drag Drop Workspace Widgets --- */
function initWorkspaceGrid() {
  document.querySelectorAll('[data-add-widget]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-add-widget');
      spawnWorkspaceWidget(type);
    });
  });
}

function spawnWorkspaceWidget(type) {
  if (widgetPositions[type]) return; // Already deployed

  const board = document.getElementById('widget-board');
  const card = document.createElement('div');
  card.className = 'dashboard-widget';
  card.id = `widget-${type}`;
  
  let title = 'MODULE';
  let bodyHTML = '';
  let w = 240, h = 160;

  if (type === 'sys-stats') {
    title = 'SYSTEM MONITORS';
    bodyHTML = `
      <div class="sys-metric-row">
        <div class="sys-meta"><span>CPU THREADS</span><span class="val" id="cpu-val">24%</span></div>
        <div class="sys-progress-bar"><div class="sys-progress-fill" id="cpu-fill" style="width: 24%"></div></div>
      </div>
      <div class="sys-metric-row">
        <div class="sys-meta"><span>MEM STORAGE</span><span class="val" id="mem-val">4.1 GB</span></div>
        <div class="sys-progress-bar"><div class="sys-progress-fill" id="mem-fill" style="width: 55%"></div></div>
      </div>
    `;
  } else if (type === 'quick-notes') {
    title = 'SCRATCHPAD';
    bodyHTML = `<textarea id='widget-notes-text' placeholder='Store continuous variables...'></textarea>`;
    w = 260; h = 200;
  } else if (type === 'world-clock') {
    title = 'CHRONO CLOCK';
    bodyHTML = `<div class='clock-display' id='live-chrono'>00:00:00</div><div class='date-display' id='live-date'>LOADING</div>`;
    w = 200; h = 120;
  }

  card.innerHTML = `
    <div class="widget-head"><span>${title}</span><button class="widget-close" data-remove="${type}">×</button></div>
    <div class="widget-body">${bodyHTML}</div>
  `;
  
  card.style.width = w + 'px';
  card.style.height = h + 'px';
  
  board.appendChild(card);
  placeWidgetElement(card, type, 40, 40);
  bindDragLogic(card, type);

  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove();
    delete widgetPositions[type];
    updateCanvasEmptyState();
  });

  if (type === 'world-clock') startChronographLoop();
  updateCanvasEmptyState();
}

function placeWidgetElement(el, type, x, y) {
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  widgetPositions[type] = { x, y };
}

function bindDragLogic(el, type) {
  const head = el.querySelector('.widget-head');
  let active = false, currentX, currentY, initialX, initialY, xOffset = widgetPositions[type].x, yOffset = widgetPositions[type].y;

  head.addEventListener('touchstart', dragStart, {passive: false});
  document.addEventListener('touchend', dragEnd, {passive: false});
  document.addEventListener('touchmove', drag, {passive: false});

  head.addEventListener('mousedown', dragStart);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('mousemove', drag);

  function dragStart(e) {
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
    if (e.target === head || head.contains(e.target)) active = true;
  }

  function dragEnd() {
    if (!active) return;
    initialX = currentX;
    initialY = currentY;
    active = false;
  }

  function drag(e) {
    if (!active) return;
    e.preventDefault();
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }
    xOffset = currentX;
    yOffset = currentY;
    el.style.left = currentX + "px";
    el.style.top = currentY + "px";
    widgetPositions[type] = { x: currentX, y: currentY };
  }
}

function updateCanvasEmptyState() {
  const msg = document.getElementById('canvas-empty-msg');
  if (!msg) return;
  msg.style.display = Object.keys(widgetPositions).length === 0 ? 'block' : 'none';
}

function startChronographLoop() {
  const track = () => {
    const clock = document.getElementById('live-chrono');
    const dateLine = document.getElementById('live-date');
    if (!clock) return;
    const d = new Date();
    clock.innerText = d.toTimeString().split(' ')[0];
    dateLine.innerText = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
    setTimeout(track, 1000);
  };
  track();
}

/* --- GameHub Data View Handler (Images Fix) --- */
function initGameHubLayout() {
  const hBoard = document.getElementById('tab-canvas');
  if (!hBoard) return;

  // Append GameHub Base Container if not defined in static DOM templates
  let hubContainer = document.querySelector('.gamehub-container');
  if (!hubContainer) {
    const canvasWrap = document.querySelector('.canvas-container');
    if (canvasWrap) {
      const divider = document.createElement('div');
      divider.className = 'sheet-divider';
      canvasWrap.appendChild(divider);

      hubContainer = document.createElement('div');
      hubContainer.className = 'gamehub-container';
      hubContainer.innerHTML = `
        <div class="gamehub-tabs">
          <button class="gamehub-tab-btn active" data-hub-tab="heroes">HERO FILES</button>
          <button class="gamehub-tab-btn" data-hub-tab="items">ITEM CORES</button>
        </div>
        <div class="gamehub-content-view active" id="hub-view-heroes">
          <div class="hub-grid" id="heroes-grid-target"></div>
        </div>
        <div class="gamehub-content-view" id="hub-view-items">
          <div class="hub-grid" id="items-grid-target"></div>
        </div>
      `;
      canvasWrap.appendChild(hubContainer);
    }
  }

  document.querySelectorAll('.gamehub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gamehub-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.gamehub-content-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`hub-view-${btn.getAttribute('data-hub-tab')}`);
      if (target) target.classList.add('active');
    });
  });

  renderGameHubGridElements();
}

function renderGameHubGridElements() {
  const hGrid = document.getElementById('heroes-grid-target');
  const iGrid = document.getElementById('items-grid-target');

  if (hGrid) {
    hGrid.innerHTML = GameHubData.heroes.map(hero => `
      <div class="hub-card" onclick="openGameHubDetailItem('heroes', '${hero.id}')">
        <div class="hub-card-media">
          <img class="hub-card-img" src="${hero.img}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' style=\'fill:%23222\'><rect width=\'100\' height=\'100\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23555\' font-family=\'monospace\'>MISSING PNG</text></svg>'">
          <span class="hub-card-badge">${hero.rarity}</span>
        </div>
        <div class="hub-card-overlay">
          <div class="hub-card-title">${hero.name}</div>
          <div class="hub-card-sub">${hero.role}</div>
        </div>
      </div>
    `).join('');
  }

  if (iGrid) {
    iGrid.innerHTML = GameHubData.items.map(item => `
      <div class="hub-card" onclick="openGameHubDetailItem('items', '${item.id}')">
        <div class="hub-card-media">
          <img class="hub-card-img" src="${item.img}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' style=\'fill:%23222\'><rect width=\'100\' height=\'100\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23555\' font-family=\'monospace\'>MISSING PNG</text></svg>'">
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

  appendBubbleMessage('assistant', `**[${dataset.name}]** Profile Loaded:\n${dataset.desc}\nConfiguration Path Source: \`${dataset.img}\``);
}

/* --- Persistent Network Configuration Handlers --- */
function loadApplicationConfig() {
  fetch('/api/settings')
    .then(r => r.json())
    .then(config => {
      if (!config) return;
      App.settings = { ...App.settings, ...config };
      
      // Update form field variables
      if(document.getElementById('input-gemini-key')) document.getElementById('input-gemini-key').value = App.settings.geminiKey;
      if(document.getElementById('input-groq-key')) document.getElementById('input-groq-key').value = App.settings.groqKey;
      if(document.getElementById('input-api-key')) document.getElementById('input-api-key').value = App.settings.apiKey;
      if(document.getElementById('input-together-key')) document.getElementById('input-together-key').value = App.settings.togetherKey;
      if(document.getElementById('input-mistral-key')) document.getElementById('input-mistral-key').value = App.settings.mistralKey;

      if(document.getElementById('input-gemini-model')) document.getElementById('input-gemini-model').value = App.settings.geminiModel;
      if(document.getElementById('input-groq-model')) document.getElementById('input-groq-model').value = App.settings.groqModel;
      if(document.getElementById('input-model')) document.getElementById('input-model').value = App.settings.model;

      if (App.settings.theme) {
        document.body.setAttribute('data-theme-variant', App.settings.theme);
        const activeSwatch = document.querySelector(`.theme-swatch[data-theme="${App.settings.theme}"]`);
        if (activeSwatch) activeSwatch.classList.add('active');
      }
      updateStatusDashboardLines();
    }).catch(() => {});
}

function persistSettingsToServer() {
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(App.settings)
  }).then(() => {
    updateStatusDashboardLines();
  });
}

function updateStatusDashboardLines() {
  const line = document.getElementById('welcome-stats-line');
  if (line) line.innerText = `INT::${App.stats.totalInteractions} | MSG::${App.stats.messages}`;
  const indicator = document.getElementById('active-model-indicator');
  if (indicator) indicator.innerText = (App.settings.model.split('/')[1] || App.settings.model).toUpperCase();
}
