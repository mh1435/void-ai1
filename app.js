/* =========================================================
   VOID // SYSTEM CORE LOGIC
   ========================================================= */

const App = {
  settings: { theme: 'matrix' },
  stats: { interactions: 0, messages: 0 },
  widgetPositions: {},
  activeHubTab: 'heroes' // Tracks if Heroes or Items is active
};

document.addEventListener('DOMContentLoaded', () => {
  initMainRouting();
  initSettingsRouting();
  initChatEngine();
  initWorkspaceWidgets();
  initGameHub();
});

/* --- UI Routing --- */
function initMainRouting() {
  document.getElementById('open-settings-btn').addEventListener('click', () => {
    document.getElementById('view-main').classList.remove('active');
    document.getElementById('view-settings').classList.add('active');
  });
  
  document.getElementById('close-settings-btn').addEventListener('click', () => {
    document.getElementById('view-settings').classList.remove('active');
    document.getElementById('view-main').classList.add('active');
  });

  // Top Tabs (Intelligence vs Workspace)
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.content-frame > .view-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-target')).classList.add('active');
    });
  });

  // Workspace View Tabs (Widgets vs Game Hub)
  document.querySelectorAll('[data-workspace-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-workspace-view]').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.workspace-sub-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      const targetId = `workspace-${btn.getAttribute('data-workspace-view')}`;
      document.getElementById(targetId).classList.add('active');
      
      document.getElementById('widget-tools').style.display = targetId === 'workspace-board' ? 'flex' : 'none';
    });
  });
  
  // Slide Panel Close Logic
  document.getElementById('close-hero-detail').addEventListener('click', closeHeroPanel);
}

function initSettingsRouting() {
  document.querySelectorAll('.theme-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.theme-swatch').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      document.body.setAttribute('data-theme-variant', theme);
    });
  });
}

/* --- Chat & Terminal Engine --- */
function initChatEngine() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-msg-btn');
  const msgBox = document.getElementById('messages-box');

  const triggerSend = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    appendBubble('user', text);
    chatInput.value = '';
    App.stats.interactions++;
    document.getElementById('welcome-stats-line').innerText = `INT::${App.stats.interactions} | MSG::${App.stats.interactions * 2}`;
    
    setTimeout(() => { appendBubble('assistant', 'Core processing command... Output generated.'); }, 800);
  };

  sendBtn.addEventListener('click', triggerSend);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); triggerSend(); } });
  
  document.getElementById('util-clear-btn').addEventListener('click', () => {
    msgBox.innerHTML = '';
    appendBubble('system', 'Memory cache purged successfully.');
  });
}

function appendBubble(role, text) {
  const box = document.getElementById('messages-box');
  const bNode = document.createElement('div');
  bNode.className = `chat-bubble ${role}`;
  const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const label = role === 'user' ? 'USER::NODE' : 'VOID::CORE';
  bNode.innerHTML = `<div class="bubble-meta">${label} // ${stamp}</div><div class="bubble-body">${text}</div>`;
  box.appendChild(bNode);
  box.scrollTop = box.scrollHeight;
}

/* --- Draggable System Widgets --- */
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
  card.style.width = '240px'; card.style.height = '140px';
  card.innerHTML = `
    <div class="widget-head"><span>MODULE</span><button class="widget-close" data-remove="${type}">×</button></div>
    <div class="widget-body"><div style="color:var(--muted);font-size:12px;">Active System Component</div></div>
  `;
  board.appendChild(card);
  placeWidgetElement(card, type, 20, 20);
  card.querySelector('[data-remove]').addEventListener('click', () => { card.remove(); delete App.widgetPositions[type]; updateEmptyState(); });
  updateEmptyState();
}

function placeWidgetElement(el, type, x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; App.widgetPositions[type] = { x, y }; }
function updateEmptyState() {
  const msg = document.getElementById('canvas-empty-msg');
  if(msg) msg.style.display = Object.keys(App.widgetPositions).length === 0 ? 'block' : 'none';
}

/* --- GameHub Core Logic --- */
function initGameHub() {
  // Nested Tabs Inside Game Hub
  document.querySelectorAll('[data-hub-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-hub-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      App.activeHubTab = btn.getAttribute('data-hub-tab');
      
      document.getElementById('heroes-grid-target').style.display = App.activeHubTab === 'heroes' ? 'grid' : 'none';
      document.getElementById('items-grid-target').style.display = App.activeHubTab === 'items' ? 'grid' : 'none';
      filterHub(document.getElementById('hub-search').value);
    });
  });

  document.getElementById('hub-search').addEventListener('input', (e) => filterHub(e.target.value));
  
  if (typeof GameHubData !== 'undefined') {
    renderHubGrid('heroes', GameHubData.heroes);
    renderHubGrid('items', GameHubData.items);
  }
}

function renderHubGrid(type, dataArr) {
  const target = document.getElementById(`${type}-grid-target`);
  if (!target || !dataArr) return;

  target.innerHTML = dataArr.map(item => {
    const badge = item.rarity || item.tier || 'N/A';
    const sub = item.role || item.type || 'N/A';
    return `
      <div class="hub-card" onclick="hubItemClick('${item.name}', '${type}')">
        <div class="hub-card-media">
          <img class="hub-card-img" src="${item.img}" loading="lazy" alt="${item.name}">
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

function filterHub(query) {
  if (typeof GameHubData === 'undefined') return;
  const q = query.toLowerCase();
  const type = App.activeHubTab; // filter only the active grid
  const filtered = GameHubData[type].filter(i => i.name.toLowerCase().includes(q) || (i.role && i.role.toLowerCase().includes(q)));
  renderHubGrid(type, filtered);
}

/* --- Hero Detail Panel Logic --- */
window.hubItemClick = function(name, type) {
  if (type === 'heroes') {
    openHeroPanel(name);
  } else {
    // If it's an item, maybe log to chat or expand future logic.
    appendBubble('system', `Item Matrix scanned: [${name}].`);
    document.querySelector('.tab-pill[data-target="tab-chat"]').click();
  }
};

function openHeroPanel(heroName) {
  const hero = GameHubData.heroes.find(h => h.name === heroName);
  if (!hero) return;

  document.getElementById('detail-hero-name').innerText = hero.name.toUpperCase() + ' // TACTICAL';
  
  // Build Items HTML
  let buildsHTML = '';
  if (hero.builds) {
    hero.builds.forEach(b => {
      // Cross-reference item data to get image URLs
      const itemIcons = b.items.map(itemName => {
        const itemObj = GameHubData.items.find(i => i.name === itemName);
        const imgUrl = itemObj ? itemObj.img : '';
        return `<div class="item-mini-slot"><img src="${imgUrl}" title="${itemName}" alt="${itemName}"></div>`;
      }).join('');

      buildsHTML += `
        <div class="build-card">
          <div class="build-header">
            <span class="build-name">${b.name.toUpperCase()}</span>
            <span class="build-stats">${b.details}</span>
          </div>
          <div class="build-items-row">${itemIcons}</div>
        </div>
      `;
    });
  }

  // Tags HTML
  const counterHTML = (hero.counters || []).map(c => renderHeroTag(c, 'danger')).join('');
  const synergyHTML = (hero.synergies || []).map(s => renderHeroTag(s, 'synergy')).join('');

  document.getElementById('hero-detail-content').innerHTML = `
    <div class="detail-section">
      <div class="detail-title">OPTIMIZED EQUIPMENT PATTERNS</div>
      ${buildsHTML}
    </div>
    
    <div class="detail-section">
      <div class="detail-title">THREAT ANALYSIS (COUNTERS)</div>
      <div class="hero-tag-list">${counterHTML}</div>
    </div>

    <div class="detail-section">
      <div class="detail-title">SYNERGY PROTOCOLS (BEST WITH)</div>
      <div class="hero-tag-list">${synergyHTML}</div>
    </div>

    <div class="detail-section">
      <div class="detail-title">EXECUTION COMBOS</div>
      <div class="combo-box">${hero.combos || 'Adaptive Combat Logic'}</div>
    </div>
  `;

  document.getElementById('hero-detail-panel').classList.add('active');
}

function renderHeroTag(heroName, typeClass) {
  const hObj = GameHubData.heroes.find(h => h.name === heroName);
  const imgUrl = hObj ? hObj.img : '';
  return `<span class="hero-tag ${typeClass}"><img src="${imgUrl}">${heroName}</span>`;
}

function closeHeroPanel() {
  document.getElementById('hero-detail-panel').classList.remove('active');
}
