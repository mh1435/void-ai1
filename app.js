/* =========================================================
   VOID // AI STUDIO SUITE SINGLE PAGE APPLICATION CONTROLLER
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
    replies: 0,
    tokens: 0,
    hourlyTraffic: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  location: null,
  prompts: [
    { id: 'p1', title: 'Analytical Game Expert', category: 'Strategy', text: 'Act as a professional esport analyst. Break down the current strategy parameters.' },
    { id: 'p2', title: 'Compile Framework Code', category: 'Development', text: 'Analyze software architecture designs and write production-ready source code.' }
  ]
};

const widgetPositions = {};

document.addEventListener('DOMContentLoaded', () => {
  initTopNavRouting();
  initSubRouting();
  initSettingsLayout();
  initChatEngine();
  initWorkspaceGrid();
  initGameHubLayout();
  initPromptLibrary();
  initLogsFeed();
  initAnalyticsMetrics();
  loadApplicationConfig();
});

/* --- Top Navigation Routing (Intelligence vs Workspace) --- */
function initTopNavRouting() {
  document.querySelectorAll('.top-nav-btn:not(#open-settings-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.top-nav-btn').forEach(b => {
        if (b.id !== 'open-settings-btn') b.classList.remove('active');
      });
      document.querySelectorAll('#workspace-canvas-floor > .view-tab').forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      const targetViewId = btn.getAttribute('data-target');
      const targetView = document.getElementById(targetViewId);
      if (targetView) targetView.classList.add('active');
    });
  });

  // Settings Slide Panel Logic
  const openSettings = document.getElementById('open-settings-btn');
  const closeSettings = document.getElementById('close-settings-btn');
  const vSet = document.getElementById('view-settings');

  if (openSettings && closeSettings && vSet) {
    openSettings.addEventListener('click', () => { vSet.classList.add('active'); });
    closeSettings.addEventListener('click', () => { vSet.classList.remove('active'); });
  }
}

/* --- Sub-Navigation Tabs (Sub-views) --- */
function initSubRouting() {
  document.querySelectorAll('.sub-nav-btn:not(.gamehub-tab-btn)').forEach(btn => {
    btn.addEventListener('click', () => {
      // Keep GameHub separate, target sub-tabs
      const parentView = btn.closest('.view-tab');
      parentView.querySelectorAll('.sub-nav-btn:not(.gamehub-tab-btn)').forEach(b => b.classList.remove('active'));
      parentView.querySelectorAll('.sub-view-content-wrap > .sub-tab').forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      const subTarget = btn.getAttribute('data-sub-target');
      const targetSubTab = document.getElementById(subTarget);
      if (targetSubTab) targetSubTab.classList.add('active');
    });
  });
}

/* --- System Application Preferences & Layout Actions --- */
function initSettingsLayout() {
  document.getElementById('save-keys-btn')?.addEventListener('click', () => {
    App.settings.geminiKey = document.getElementById('input-gemini-key')?.value || '';
    App.settings.groqKey = document.getElementById('input-groq-key')?.value || '';
    App.settings.apiKey = document.getElementById('input-api-key')?.value || '';
    App.settings.togetherKey = document.getElementById('input-together-key')?.value || '';
    App.settings.mistralKey = document.getElementById('input-mistral-key')?.value || '';
    persistSettingsToServer();
    appendSystemEventLog('info', 'Auth keys securely synchronized across backend memory array.');
  });

  document.getElementById('save-models-btn')?.addEventListener('click', () => {
    App.settings.geminiModel = document.getElementById('input-gemini-model')?.value || 'gemini-2.5-flash';
    App.settings.groqModel = document.getElementById('input-groq-model')?.value || 'llama-3.3-70b-versatile';
    App.settings.model = document.getElementById('input-model')?.value || 'meta-llama/llama-3.2-3b-instruct:free';
    App.settings.togetherModel = document.getElementById('input-together-model')?.value || 'meta-llama/Llama-3.2-70B-Instruct-Turbo';
    App.settings.mistralModel = document.getElementById('input-mistral-model')?.value || 'mistral-large-latest';
    persistSettingsToServer();
    updateModelQuickSelectUI();
    appendSystemEventLog('info', 'Inference model endpoints successfully updated.');
  });
  
  document.getElementById('save-preferences-btn')?.addEventListener('click', () => {
    App.settings.voiceEnabled = document.getElementById('chk-speech')?.checked || false;
    App.settings.reducedMotion = document.getElementById('chk-motion')?.checked || false;
    App.settings.floatingAssistantEnabled = document.getElementById('chk-float-assist')?.checked || false;
    App.settings.responseMode = document.getElementById('select-response-mode')?.value || 'standard';
    
    const chosenTheme = document.getElementById('select-theme')?.value || 'frost';
    App.settings.theme = chosenTheme;
    document.body.setAttribute('data-theme-variant', chosenTheme);
    
    persistSettingsToServer();
    appendSystemEventLog('info', 'System UI parameters and user preferences saved.');
  });
}

/* --- Chat Engine with Interactive Multi-Provider Switcher --- */
function initChatEngine() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-msg-btn');
  const clearBtn = document.getElementById('clear-chat-btn');
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

  clearBtn?.addEventListener('click', () => {
    const msgBox = document.getElementById('messages-box');
    if (msgBox) {
      msgBox.innerHTML = '';
      appendSystemEventLog('warn', 'Chat window active thread session completely purged.');
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
    { provider: 'together', label: 'TOGETHER', name: App.settings.togetherModel },
    { provider: 'mistral', label: 'MISTRAL', name: App.settings.mistralModel },
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
      if (chosenProvider === 'together') App.settings.activeModel = App.settings.togetherModel;
      if (chosenProvider === 'mistral') App.settings.activeModel = App.settings.mistralModel;

      persistSettingsToServer();
      updateModelQuickSelectUI();
      appendSystemEventLog('info', `Active provider node set to: ${chosenProvider.toUpperCase()}`);
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

  let renderedBody = '';
  if (typeof marked !== 'undefined') {
    renderedBody = marked.parse(text);
  } else {
    renderedBody = `<div class="bubble-body mutedmonospace">!! ERR_LIB_MISSING: Markup library load fail.</div>`;
  }

  bNode.innerHTML = `
    <div class="bubble-meta">${label} // ${stamp}</div>
    <div class="bubble-body">${renderedBody}</div>
  `;
  box.appendChild(bNode);
  box.scrollTop = box.scrollHeight;
  
  if (role === 'user') {
    App.stats.queries++;
    App.stats.messages++;
  } else {
    App.stats.replies++;
  }
  App.stats.totalInteractions++;
  
  const currentHour = new Date().getHours();
  App.stats.hourlyTraffic[currentHour]++;

  updateStatusDashboardLines();
  refreshAnalyticsVisuals();
}

function dispatchPromptToBackend(prompt) {
  const placeholder = document.createElement('div');
  placeholder.className = 'chat-bubble assistant';
  placeholder.innerHTML = `<div class="bubble-meta">VOID::CORE // INTERFACES</div><div class="bubble-body muted monospace">Computing network loop via active node profile context...</div>`;
  
  const box = document.getElementById('messages-box');
  box.appendChild(placeholder);
  box.scrollTop = box.scrollHeight;

  appendSystemEventLog('info', `Dispatched API request payload to provider: [${App.settings.activeProvider}]`);

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt,
      provider: App.settings.activeProvider,
      model: App.settings.activeModel,
      mode: App.settings.responseMode
    })
  })
  .then(r => r.json())
  .then(data => {
    placeholder.remove();
    if (data.response) {
      appendBubbleMessage('assistant', data.response);
      appendSystemEventLog('info', `Received response string from server. Token payload stats: ~${data.tokens || 120} tokens parsed.`);
    } else {
      appendBubbleMessage('assistant', '!! ERR_EMPTY_RESP: No data payload returned from the inference node endpoint.');
      appendSystemEventLog('err', 'Remote server node responded with empty data structure payload.');
    }
  })
  .catch((err) => {
    placeholder.remove();
    appendBubbleMessage('assistant', '!! ERR_CONNECTION: Offline response array logic pipeline required.');
    appendSystemEventLog('err', `Dispatching to endpoint threw network connectivity exception: ${err}`);
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
  
  appendSystemEventLog('info', `Spawned monitoring widget workspace node: [${type.toUpperCase()}]`);

  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove(); delete widgetPositions[type]; updateCanvasEmptyState();
    appendSystemEventLog('warn', `Terminated monitoring dashboard widget node: [${type.toUpperCase()}]`);
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

/* --- GameHub Repository Rendering with Meta Badge Logic & Searches --- */
function initGameHubLayout() {
  document.querySelectorAll('.gamehub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Un-highlight all gamehub tabs, hide views
      const parentView = btn.closest('.view-tab');
      parentView.querySelectorAll('.gamehub-tab-btn').forEach(b => b.classList.remove('active'));
      parentView.querySelectorAll('.gamehub-content-view').forEach(v => v.classList.remove('active'));
      
      btn.classList.add('active');
      const targetView = document.getElementById(`hub-view-${btn.getAttribute('data-hub-tab')}`);
      if (targetView) targetView.classList.add('active');
    });
  });

  const hSearch = document.getElementById('hero-search-input');
  const iSearch = document.getElementById('item-search-input');

  hSearch?.addEventListener('input', () => { filterGameHubCollection('heroes', hSearch.value); });
  iSearch?.addEventListener('input', () => { filterGameHubCollection('items', iSearch.value); });

  if (typeof GameHubData !== 'undefined') {
    renderGameHubGridElements(GameHubData.heroes, GameHubData.items);
  }
}

function renderGameHubGridElements(heroesArr, itemsArr) {
  const hGrid = document.getElementById('heroes-grid-target');
  const iGrid = document.getElementById('items-grid-target');

  if (hGrid && heroesArr) {
    hGrid.innerHTML = heroesArr.map(hero => {
      let processedBadgeText = hero.rarity;
      if (hero.rarity.includes('(META)')) {
        processedBadgeText = hero.rarity.replace('(META)', '<span class="meta-fade">(META)</span>');
      }

      return `
        <div class="hub-card" data-tier="${hero.rarity}" onclick="openGameHubDetailItem('heroes', '${hero.id}')">
          <div class="hub-card-media">
            <img class="hub-card-img" src="${hero.img}" alt="${hero.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' style=\'fill:%23111\'><rect width=\'100\' height=\'100\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23555\' font-family=\'monospace\' font-size=\'11\'>${hero.name}</text></svg>'">
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

  if (iGrid && itemsArr) {
    iGrid.innerHTML = itemsArr.map(item => `
      <div class="hub-card" data-tier="${item.tier}" onclick="openGameHubDetailItem('items', '${item.id}')">
        <div class="hub-card-media">
          <img class="hub-card-img" src="${item.img}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' style=\'fill:%23111\'><rect width=\'100\' height=\'100\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'%23555\' font-family=\'monospace\' font-size=\'10\'>${item.name}</text></svg>'">
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

function filterGameHubCollection(collection, query) {
  const qStr = query.toLowerCase().trim();
  const source = GameHubData[collection];
  if (!source) return;

  const matches = source.filter(item => 
    item.name.toLowerCase().includes(qStr) || 
    (item.role && item.role.toLowerCase().includes(qStr)) || 
    (item.type && item.type.toLowerCase().includes(qStr)) || 
    item.id.toLowerCase().includes(qStr)
  );

  if (collection === 'heroes') renderGameHubGridElements(matches, null);
  if (collection === 'items') renderGameHubGridElements(null, matches);
}

function openGameHubDetailItem(collection, id) {
  const dataset = GameHubData[collection].find(x => x.id === id);
  if (!dataset) return;
  const pillTab = document.querySelector('[data-target="view-workspace"]');
  if (pillTab) pillTab.click();
  appendBubbleMessage('assistant', `**[${dataset.name}]** Profile Asset Decoupled Readout:\nType Role Parameters: \`${dataset.role || dataset.type}\` — Active Registry Metadata Log Complete.`);
  appendSystemEventLog('info', `Loaded MLBB asset data parameters log read for: [${dataset.name.toUpperCase()}]`);
}

/* --- Tab 3: System Prompting Matrices Engine --- */
function initPromptLibrary() {
  const addBtn = document.getElementById('open-add-prompt-modal');
  const modal = document.getElementById('modal-prompt-overlay');
  const closeBtn = document.getElementById('close-modal-btn');
  const saveBtn = document.getElementById('save-prompt-btn');
  const searchInp = document.getElementById('prompt-search-input');

  addBtn?.addEventListener('click', () => { modal?.classList.add('active'); });
  closeBtn?.addEventListener('click', () => { modal?.classList.remove('active'); });
  
  saveBtn?.addEventListener('click', () => {
    const title = document.getElementById('modal-prompt-title')?.value.trim();
    const cat = document.getElementById('modal-prompt-cat')?.value.trim();
    const text = document.getElementById('modal-prompt-text')?.value.trim();

    if (!title || !text) return;
    
    App.prompts.push({
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      title,
      category: cat || 'Custom',
      text
    });

    document.getElementById('modal-prompt-title').value = '';
    document.getElementById('modal-prompt-cat').value = '';
    document.getElementById('modal-prompt-text').value = '';
    modal?.classList.remove('active');

    renderPromptLibraryGrid();
    appendSystemEventLog('info', `Injected new instruction script prompt template in inventory: [${title.toUpperCase()}]`);
  });

  searchInp?.addEventListener('input', () => {
    const q = searchInp.value.toLowerCase().trim();
    const matches = App.prompts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.text.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
    renderPromptLibraryGrid(matches);
  });

  renderPromptLibraryGrid();
}

function renderPromptLibraryGrid(subset) {
  const target = document.getElementById('prompt-library-grid-target');
  if (!target) return;
  
  const dataset = subset || App.prompts;
  target.innerHTML = dataset.map(p => `
    <div class="prompt-card">
      <div class="prompt-card-cat monospace">${p.category.toUpperCase()}</div>
      <div class="prompt-card-title">${p.title}</div>
      <div class="prompt-card-text">${p.text}</div>
      <div class="prompt-card-actions">
        <button class="prompt-action-pill" onclick="executePromptTemplatePayload('${p.id}')">RUN SCRIPT</button>
      </div>
    </div>
  `).join('');
}

function executePromptTemplatePayload(id) {
  const p = App.prompts.find(x => x.id === id);
  if (!p) return;
  
  const pillTab = document.querySelector('[data-target="view-intelligence"]');
  if (pillTab) pillTab.click();
  const termTab = document.querySelector('[data-sub-target="sub-terminal"]');
  if (termTab) termTab.click();
  
  appendBubbleMessage('user', p.text);
  appendSystemEventLog('info', `Compiled system prompt template script locally: [${p.title.toUpperCase()}]`);
}

/* --- Tab 4: System Telemetry Realtime Events Stream Processor --- */
function initLogsFeed() {
  document.getElementById('clear-logs-btn')?.addEventListener('click', () => {
    const stream = document.getElementById('logs-stream-target');
    if (stream) {
      stream.innerHTML = `<div class="log-row text-dim">[SYSTEM CLEARED BUFFER] -- Stream completely purged of older operations traces.</div>`;
    }
  });
}

function appendSystemEventLog(level, str) {
  const stream = document.getElementById('logs-stream-target');
  if (!stream) return;

  const row = document.createElement('div');
  row.className = `log-row monospace ${level}`;
  const stamp = new Date().toLocaleTimeString();
  row.textContent = `[${stamp}] -- ${str}`;
  
  stream.appendChild(row);
  stream.scrollTop = stream.scrollHeight;
}

/* --- Tab 5: Realtime API Analytics & Traffic Telemetry --- */
function initAnalyticsMetrics() {
  // Initialization logic hook
}

function refreshAnalyticsVisuals() {
  document.getElementById('metric-queries').textContent = App.stats.queries;
  document.getElementById('metric-replies').textContent = App.stats.replies;
  document.getElementById('metric-threads').textContent = App.stats.conversations;
  document.getElementById('metric-tokens').textContent = App.stats.queries * 220 + App.stats.replies * 850;
  
  const chartTarget = document.getElementById('bars-visual-recap-target');
  if (!chartTarget) return;

  const maxTraffic = Math.max(...App.stats.hourlyTraffic, 1);

  chartTarget.innerHTML = `
    <div class="bars-graph-vault">
      ${App.stats.hourlyTraffic.map((val, idx) => {
        const perc = (val / maxTraffic) * 100;
        const hh = idx.toString().padStart(2, '0');
        return `
          <div class="bar-col-wrap">
            <div class="bar-fill-seg" style="height: ${perc}%" data-tooltip="${val} reqs"></div>
            <span class="bar-stamp-lbl">${hh}h</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* --- Storage Application State Data Sync Handlers --- */
function loadApplicationConfig() {
  fetch('/api/settings')
    .then(r => r.json())
    .then(config => {
      if (!config) return;
      App.settings = { ...App.settings, ...config };
      
      document.getElementById('input-api-key').value = App.settings.apiKey || '';
      document.getElementById('input-gemini-key').value = App.settings.geminiKey || '';
      document.getElementById('input-groq-key').value = App.settings.groqKey || '';
      document.getElementById('input-together-key').value = App.settings.togetherKey || '';
      document.getElementById('input-mistral-key').value = App.settings.mistralKey || '';

      document.getElementById('input-model').value = App.settings.model || '';
      document.getElementById('input-groq-model').value = App.settings.groqModel || '';
      document.getElementById('input-gemini-model').value = App.settings.geminiModel || '';
      document.getElementById('input-together-model').value = App.settings.togetherModel || '';
      document.getElementById('input-mistral-model').value = App.settings.mistralModel || '';

      document.getElementById('chk-speech').checked = App.settings.voiceEnabled;
      document.getElementById('chk-motion').checked = App.settings.reducedMotion;
      document.getElementById('chk-float-assist').checked = App.settings.floatingAssistantEnabled;
      document.getElementById('select-response-mode').value = App.settings.responseMode;
      document.getElementById('select-theme').value = App.settings.theme;

      document.body.setAttribute('data-theme-variant', App.settings.theme);

      updateStatusDashboardLines();
      updateModelQuickSelectUI();
      appendSystemEventLog('info', 'Application config profile successfully fetched and parsed into memory.');
    }).catch(() => {
      appendSystemEventLog('warn', 'Sync config endpoint server not running - app continues on local state defaults.');
    });
}

function persistSettingsToServer() {
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(App.settings)
  });
}

function updateStatusDashboardLines() {
  // Stats line mapping in top-bar or sub views
}
