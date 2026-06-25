/* =========================================================
   VOID // SYSTEM CORE LOGIC
   ========================================================= */

const App = {
  settings: {
    theme: 'matrix',
    activeProvider: 'openrouter',
    model: 'meta-llama/llama-3.2-3b-instruct:free',
    groqModel: 'llama-3.3-70b-versatile',
    geminiModel: 'gemini-2.5-flash',
    togetherModel: 'meta-llama/Llama-3.2-70B-Instruct-Turbo',
    mistralModel: 'mistral-large-latest',
    reducedMotion: false
  },
  stats: { interactions: 0, messages: 0 },
  widgetPositions: {}
};

document.addEventListener('DOMContentLoaded', () => {
  initMainRouting();
  initSettingsRouting();
  initSettingsSaving();
  initChatEngine();
  initWorkspaceWidgets();
  initGameHub();
});

/* --- UI Routing --- */
function initMainRouting() {
  // Main view vs Settings View
  document.getElementById('open-settings-btn').addEventListener('click', () => {
    document.getElementById('view-main').classList.remove('active');
    document.getElementById('view-settings').classList.add('active');
  });
  
  document.getElementById('close-settings-btn').addEventListener('click', () => {
    document.getElementById('view-settings').classList.remove('active');
    document.getElementById('view-main').classList.add('active');
  });

  // Top Pills (Intelligence vs Workspace)
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.content-frame > .view-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
  });

  // Workspace Sub-Tabs (Widgets vs Heroes vs Items)
  document.querySelectorAll('[data-workspace-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-workspace-view]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.workspace-sub-view').forEach(v => v.classList.remove('active'));
      
      btn.classList.add('active');
      const targetId = `workspace-${btn.getAttribute('data-workspace-view')}`;
      document.getElementById(targetId).classList.add('active');
      
      // Hide widget tool buttons if not on board
      document.getElementById('widget-tools').style.display = targetId === 'workspace-board' ? 'flex' : 'none';
    });
  });
}

function initSettingsRouting() {
  // Open Slide Panels
  document.querySelectorAll('[data-open-panel]').forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.getAttribute('data-open-panel'));
      if (target) target.classList.add('active');
    });
  });
  
  // Close Slide Panels
  document.querySelectorAll('[data-close-panel]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.settings-panel').classList.remove('active');
    });
  });

  // Theme Swatches
  document.querySelectorAll('.theme-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-swatch').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      document.body.setAttribute('data-theme-variant', theme);
      App.settings.theme = theme;
    });
  });
}

function initSettingsSaving() {
  // API Keys
  document.getElementById('save-keys-btn')?.addEventListener('click', (e) => {
    e.target.innerText = 'SAVED';
    setTimeout(() => e.target.innerText = 'COMMIT CONFIGURATION', 2000);
  });

  // Models
  document.getElementById('save-models-btn')?.addEventListener('click', (e) => {
    const prov = document.getElementById('select-active-provider').value;
    App.settings.activeProvider = prov;
    document.getElementById('active-model-indicator').innerText = `LLM::${prov.toUpperCase()}`;
    e.target.innerText = 'SAVED';
    setTimeout(() => e.target.innerText = 'SAVE SPECIFICATIONS', 2000);
  });
}

/* --- Chat & Terminal Engine --- */
function initChatEngine() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-msg-btn');
  const clearBtn = document.getElementById('util-clear-btn');
  const msgBox = document.getElementById('messages-box');

  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  const triggerSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendBubble('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    App.stats.interactions++;
    updateStats();
    
    // Mock Fetch
    setTimeout(() => {
      appendBubble('assistant', 'Matrix ping acknowledged. Engine executing logic parameters...');
    }, 800);
  };

  sendBtn.addEventListener('click', triggerSend);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); triggerSend(); }
  });

  clearBtn.addEventListener('click', () => {
    msgBox.innerHTML = '';
    appendBubble('system', 'Memory cache purged successfully. Listening.');
  });
}

function appendBubble(role, text) {
  const box = document.getElementById('messages-box');
  const bNode = document.createElement('div');
  bNode.className = `chat-bubble ${role}`;
  
  const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const label = role === 'user' ? 'USER::NODE' : 'VOID::CORE';
  
  let bodyHTML = text;
  if (role !== 'user' && typeof marked !== 'undefined') {
    bodyHTML = marked.parse(text);
  }

  bNode.innerHTML = `
    <div class="bubble-meta">${label} // ${stamp}</div>
    <div class="bubble-body">${bodyHTML}</div>
  `;
  
  box.appendChild(bNode);
  box.scrollTop = box.scrollHeight;
}

function updateStats() {
  document.getElementById('welcome-stats-line').innerText = `INT::${App.stats.interactions} | MSG::${App.stats.interactions * 2}`;
}

/* --- Draggable System Widgets Deck --- */
function initWorkspaceWidgets() {
  document.querySelectorAll('[data-add-widget]').forEach(btn => {
    btn.addEventListener('click', () => { spawnWidget(btn.getAttribute('data-add-widget')); });
  });
}

function spawnWidget(type) {
  if (App.widgetPositions[type]) return;
  const board = document.getElementById('workspace-board');
  
  const card = document.createElement('div');
  card.className = 'dashboard-widget';
  card.id = `widget-${type}`;
  card.style.width = '240px'; card.style.height = '140px';
  
  let title = 'MONITOR', bodyHTML = '';
  if (type === 'sys-stats') {
    title = 'SYS STATUS';
    bodyHTML = `
      <div class="sys-metric-row"><div class="sys-meta"><span>CPU LOAD</span><span class="val">24%</span></div><div class="sys-progress-bar"><div class="sys-progress-fill" style="width: 24%"></div></div></div>
      <div class="sys-metric-row"><div class="sys-meta"><span>MEMORY</span><span class="val">1.2GB</span></div><div class="sys-progress-bar"><div class="sys-progress-fill" style="width: 48%"></div></div></div>
    `;
  } else if (type === 'quick-notes') {
    title = 'SCRATCHPAD';
    bodyHTML = `<textarea id="widget-notes-text" placeholder="Jot notes here..."></textarea>`;
  }

  card.innerHTML = `
    <div class="widget-head"><span>${title}</span><button class="widget-close" data-remove="${type}">×</button></div>
    <div class="widget-body">${bodyHTML}</div>
  `;
  
  board.appendChild(card);
  placeWidgetElement(card, type, 20, 20);
  bindDragLogic(card, type);
  
  card.querySelector('[data-remove]').addEventListener('click', () => {
    card.remove(); delete App.widgetPositions[type]; updateEmptyState();
  });
  updateEmptyState();
}

function placeWidgetElement(el, type, x, y) {
  el.style.left = x + 'px'; el.style.top = y + 'px';
  App.widgetPositions[type] = { x, y };
}

function bindDragLogic(el, type) {
  const head = el.querySelector('.widget-head');
  let active = false, cx, cy, ix, iy;
  head.addEventListener('touchstart', e => { ix = e.touches[0].clientX - App.widgetPositions[type].x; iy = e.touches[0].clientY - App.widgetPositions[type].y; active = true; }, {passive: true});
  head.addEventListener('mousedown', e => { ix = e.clientX - App.widgetPositions[type].x; iy = e.clientY - App.widgetPositions[type].y; active = true; });
  
  document.addEventListener('mouseup', () => active = false);
  document.addEventListener('touchend', () => active = false);
  
  const move = (clientX, clientY) => {
    if (!active) return;
    cx = clientX - ix; cy = clientY - iy;
    el.style.left = cx + "px"; el.style.top = cy + "px";
    App.widgetPositions[type] = { x: cx, y: cy };
  };
  
  document.addEventListener('mousemove', e => move(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
}

function updateEmptyState() {
  const msg = document.getElementById('canvas-empty-msg');
  if(msg) msg.style.display = Object.keys(App.widgetPositions).length === 0 ? 'block' : 'none';
}

/* --- GameHub Render Logic --- */
function initGameHub() {
  document.getElementById('hero-search').addEventListener('input', (e) => filterHub('heroes', e.target.value));
  document.getElementById('item-search').addEventListener('input', (e) => filterHub('items', e.target.value));
  
  if (typeof GameHubData !== 'undefined') {
    renderHub('heroes', GameHubData.heroes);
    renderHub('items', GameHubData.items);
  }
}

function renderHub(type, dataArr) {
  const target = document.getElementById(`${type}-grid-target`);
  if (!target || !dataArr) return;

  target.innerHTML = dataArr.map(item => {
    const badge = item.rarity || item.tier || 'N/A';
    const sub = item.role || item.type || 'N/A';
    return `
      <div class="hub-card" onclick="hubItemClick('${item.name}')">
        <div class="hub-card-media">
          <img class="hub-card-img" src="${item.img}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' style=\\'fill:%23111\\'><rect width=\\'100\\' height=\\'100\\'/></svg>'">
          <span class="hub-card-badge">${badge}</span>
        </div>
        <div class="hub-card-overlay">
          <div class="hub-card-title">${item.name}</div>
          <div class="hub-card-sub">${sub}</div>
        </div>
      </div>
    `;
  }).join('');
}

function filterHub(type, query) {
  if (typeof GameHubData === 'undefined') return;
  const q = query.toLowerCase();
  const filtered = GameHubData[type].filter(i => i.name.toLowerCase().includes(q) || (i.role && i.role.toLowerCase().includes(q)));
  renderHub(type, filtered);
}

window.hubItemClick = function(name) {
  document.querySelector('.tab-pill[data-target="tab-chat"]').click();
  appendBubble('system', `Loaded metadata for: [${name}]. Ready for analysis.`);
};
