/* =========================================================
   VOID // GAMEHUB ARCHITECTURE CONTENT ENGINE (2026 CORE)
   ========================================================= */

const MLBB_ITEM_DATA_RAW = [
  // Physical Attack Core Items
  { id: 'rose_gold_meteor', name: 'Rose Gold Meteor', type: 'Physical' },
  { id: 'hunter_strike', name: 'Hunter Strike', type: 'Physical' },
  { id: 'blade_of_despair', name: 'Blade of Despair', type: 'Physical' },
  { id: 'blade_of_the_heptaseas', name: 'Blade of the Heptaseas', type: 'Physical' },
  { id: 'windtalker', name: 'Windtalker', type: 'Physical' },
  { id: 'endless_battle', name: 'Endless Battle', type: 'Physical' },
  { id: 'berserker_fury', name: 'Berserker\'s Fury', type: 'Physical' },
  { id: 'haas_claws', name: 'Haas\'s Claws', type: 'Physical' },
  { id: 'malefic_roar', name: 'Malefic Roar', type: 'Physical' },
  { id: 'war_axe', name: 'War Axe', type: 'Physical' },
  { id: 'wind_of_nature', name: 'Wind of Nature', type: 'Physical' },
  { id: 'corrosion_scythe', name: 'Corrosion Scythe', type: 'Physical' },
  { id: 'demon_hunter_sword', name: 'Demon Hunter Sword', type: 'Physical' },
  { id: 'great_dragon_spear', name: 'Great Dragon Spear', type: 'Physical' },

  // Magic Power Items
  { id: 'genius_wand', name: 'Genius Wand', type: 'Magic' },
  { id: 'lightning_truncheon', name: 'Lightning Truncheon', type: 'Magic' },
  { id: 'fleeting_time', name: 'Fleeting Time', type: 'Magic' },
  { id: 'blood_wings', name: 'Blood Wings', type: 'Magic' },
  { id: 'clock_of_destiny', name: 'Clock of Destiny', type: 'Magic' },
  { id: 'holy_crystal', name: 'Holy Crystal', type: 'Magic' },
  { id: 'divine_glaive', name: 'Divine Glaive', type: 'Magic' },
  { id: 'glowing_wand', name: 'Glowing Wand', type: 'Magic' },
  { id: 'ice_queen_wand', name: 'Ice Queen Wand', type: 'Magic' },
  { id: 'feather_of_heaven', name: 'Feather of Heaven', type: 'Magic' },
  { id: 'starlium_scythe', name: 'Starlium Scythe', type: 'Magic' },
  { id: 'wishing_lantern', name: 'Wishing Lantern', type: 'Magic' },
  { id: 'flask_of_oasis', name: 'Flask of Oasis', type: 'Magic' },
  { id: 'enchanted_talisman', name: 'Enchanted Talisman', type: 'Magic' },
  { id: 'winter_crown', name: 'Winter Crown', type: 'Magic' },

  // Defense / Protective Armour Items
  { id: 'radiant_armor', name: 'Radiant Armor', type: 'Defense' },
  { id: 'twilight_armor', name: 'Twilight Armor', type: 'Defense' },
  { id: 'brute_force_breastplate', name: 'Brute Force Breastplate', type: 'Defense' },
  { id: 'immortality', name: 'Immortality', type: 'Defense' },
  { id: 'dominance_ice', name: 'Dominance Ice', type: 'Defense' },
  { id: 'athena_shield', name: 'Athena\'s Shield', type: 'Defense' },
  { id: 'oracle', name: 'Oracle', type: 'Defense' },
  { id: 'antique_cuirass', name: 'Antique Cuirass', type: 'Defense' },
  { id: 'guardian_helmet', name: 'Guardian Helmet', type: 'Defense' },
  { id: 'blade_armor', name: 'Blade Armor', type: 'Defense' },
  { id: 'thunder_belt', name: 'Thunder Belt', type: 'Defense' }
];

const MLBB_HERO_DATA_RAW = [
  // --- ASSASSINS / JUNGLERS ---
  { id: 'saber', role: 'Assassin', metaTier: 'C-TIER' },
  { id: 'karina', role: 'Assassin', metaTier: 'A-TIER' },
  { id: 'fanny', role: 'Assassin', metaTier: 'A-TIER' },
  { id: 'hayabusa', role: 'Assassin', metaTier: 'S-TIER (META)' },
  { id: 'natalia', role: 'Assassin', metaTier: 'C-TIER' },
  { id: 'lancelot', role: 'Assassin', metaTier: 'S-TIER (META)' },
  { id: 'helcurt', role: 'Assassin', metaTier: 'S-TIER (META)' },
  { id: 'gusion', role: 'Assassin/Mage', metaTier: 'S-TIER (META)' },
  { id: 'selena', role: 'Assassin/Mage', metaTier: 'A-TIER' },
  { id: 'hanzo', role: 'Assassin', metaTier: 'C-TIER' },
  { id: 'ling', role: 'Assassin', metaTier: 'A-TIER' },
  { id: 'benedetta', role: 'Assassin', metaTier: 'A-TIER' },
  { id: 'aamon', role: 'Assassin', metaTier: 'S-TIER (META)' },
  { id: 'joy', role: 'Assassin', metaTier: 'B-TIER' },
  { id: 'nolan', role: 'Assassin', metaTier: 'C-TIER' },
  { id: 'sora', role: 'Fighter/Assassin', metaTier: 'S-TIER (META)' },
  { id: 'hirara', role: 'Assassin', metaTier: 'A-TIER' },

  // --- FIGHTERS / EXP LANE ---
  { id: 'balmond', role: 'Fighter', metaTier: 'B-TIER' },
  { id: 'alucard', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'bane', role: 'Fighter/Mage', metaTier: 'C-TIER' },
  { id: 'zilong', role: 'Fighter/Assassin', metaTier: 'C-TIER' },
  { id: 'freya', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'chou', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'sun', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'alpha', role: 'Fighter', metaTier: 'B-TIER' },
  { id: 'ruby', role: 'Fighter', metaTier: 'B-TIER' },
  { id: 'lapu-lapu', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'roger', role: 'Fighter/Marksman', metaTier: 'C-TIER' },
  { id: 'gatotkaca', role: 'Tank/Fighter', metaTier: 'C-TIER' },
  { id: 'jawhead', role: 'Fighter', metaTier: 'B-TIER' },
  { id: 'martis', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'aldous', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'leomord', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'thamuz', role: 'Fighter', metaTier: 'A-TIER' },
  { id: 'minsitthar', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'badang', role: 'Fighter', metaTier: 'A-TIER' },
  { id: 'guinevere', role: 'Fighter/Mage', metaTier: 'S-TIER (META)' },
  { id: 'terizla', role: 'Fighter', metaTier: 'D-TIER' },
  { id: 'x-borg', role: 'Fighter', metaTier: 'B-TIER' },
  { id: 'dyrroth', role: 'Fighter', metaTier: 'B-TIER' },
  { id: 'silvanna', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'yu-zhong', role: 'Fighter', metaTier: 'A-TIER' },
  { id: 'khaleed', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'paquito', role: 'Fighter', metaTier: 'A-TIER' },
  { id: 'phoveus', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'yin', role: 'Fighter', metaTier: 'D-TIER' },
  { id: 'julian', role: 'Fighter/Mage', metaTier: 'S-TIER (META)' },
  { id: 'fredrinn', role: 'Tank/Fighter', metaTier: 'S-TIER (META)' },
  { id: 'cici', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'arlott', role: 'Fighter', metaTier: 'S-TIER (META)' },
  { id: 'aulus', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'masha', role: 'Fighter/Tank', metaTier: 'B-TIER' },
  { id: 'suyou', role: 'Fighter/Assassin', metaTier: 'C-TIER' },
  { id: 'lukas', role: 'Fighter', metaTier: 'C-TIER' },
  { id: 'kalea', role: 'Fighter', metaTier: 'C-TIER' },

  // --- MARKSMEN / GOLD LANE ---
  { id: 'miya', role: 'Marksman', metaTier: 'B-TIER' },
  { id: 'bruno', role: 'Marksman', metaTier: 'D-TIER' },
  { id: 'clint', role: 'Marksman', metaTier: 'C-TIER' },
  { id: 'layla', role: 'Marksman', metaTier: 'C-TIER' },
  { id: 'moskov', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'karrie', role: 'Marksman', metaTier: 'S-TIER (META)' },
  { id: 'iridhel', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'hanabi', role: 'Marksman', metaTier: 'S-TIER (META)' },
  { id: 'claude', role: 'Marksman', metaTier: 'S-TIER (META)' },
  { id: 'kimmy', role: 'Marksman/Mage', metaTier: 'S-TIER (META)' },
  { id: 'granger', role: 'Marksman', metaTier: 'S-TIER (META)' },
  { id: 'wanwan', role: 'Marksman', metaTier: 'S-TIER (META)' },
  { id: 'popol', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'brody', role: 'Marksman', metaTier: 'B-TIER' },
  { id: 'beatrix', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'melissa', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'ixia', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'natan', role: 'Marksman', metaTier: 'A-TIER' },
  { id: 'lesley', role: 'Marksman/Assassin', metaTier: 'A-TIER' },
  { id: 'obsidia', role: 'Marksman', metaTier: 'B-TIER' },

  // --- MAGES / MID LANE ---
  { id: 'alice', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'eudora', role: 'Mage', metaTier: 'D-TIER' },
  { id: 'gord', role: 'Mage', metaTier: 'C-TIER' },
  { id: 'kagura', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'cyclops', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'aurora', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'vexana', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'harley', role: 'Mage/Assassin', metaTier: 'S-TIER (META)' },
  { id: 'odette', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'zhask', role: 'Mage', metaTier: 'D-TIER' },
  { id: 'pharsa', role: 'Mage', metaTier: 'S-TIER (META)' },
  { id: 'valir', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'chang-e', role: 'Mage', metaTier: 'C-TIER' },
  { id: 'vale', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'lunox', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'harith', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'kadita', role: 'Mage/Assassin', metaTier: 'B-TIER' },
  { id: 'esmeralda', role: 'Mage/Tank', metaTier: 'B-TIER' },
  { id: 'lylia', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'cecilision', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'yve', role: 'Mage', metaTier: 'S-TIER (META)' },
  { id: 'valentina', role: 'Mage', metaTier: 'A-TIER' },
  { id: 'xavier', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'novaria', role: 'Mage', metaTier: 'B-TIER' },
  { id: 'zhuxin', role: 'Mage', metaTier: 'S-TIER (META)' },
  { id: 'luo-yi', role: 'Mage', metaTier: 'S-TIER (META)' },
  { id: 'zetian', role: 'Mage', metaTier: 'A-TIER' },

  // --- TANKS / ROAM ---
  { id: 'tigreal', role: 'Tank', metaTier: 'A-TIER' },
  { id: 'akai', role: 'Tank', metaTier: 'C-TIER' },
  { id: 'franco', role: 'Tank', metaTier: 'C-TIER' },
  { id: 'minotaur', role: 'Tank/Support', metaTier: 'A-TIER' },
  { id: 'johnson', role: 'Tank', metaTier: 'B-TIER' },
  { id: 'hilda', role: 'Fighter/Tank', metaTier: 'A-TIER' },
  { id: 'grock', role: 'Tank', metaTier: 'S-TIER (META)' },
  { id: 'argus', role: 'Fighter/Tank', metaTier: 'B-TIER' },
  { id: 'hylos', role: 'Tank', metaTier: 'A-TIER' },
  { id: 'uranus', role: 'Tank', metaTier: 'S-TIER (META)' },
  { id: 'belerick', role: 'Tank', metaTier: 'B-TIER' },
  { id: 'khufra', role: 'Tank', metaTier: 'C-TIER' },
  { id: 'baxia', role: 'Tank', metaTier: 'A-TIER' },
  { id: 'atlas', role: 'Tank', metaTier: 'C-TIER' },
  { id: 'barats', role: 'Tank/Fighter', metaTier: 'B-TIER' },
  { id: 'edith', role: 'Tank/Marksman', metaTier: 'B-TIER' },
  { id: 'gloo', role: 'Tank', metaTier: 'S-TIER (META)' },

  // --- SUPPORTS / ROAM ---
  { id: 'nana', role: 'Mage/Support', metaTier: 'B-TIER' },
  { id: 'rafaela', role: 'Support', metaTier: 'A-TIER' },
  { id: 'lolita', role: 'Support/Tank', metaTier: 'A-TIER' },
  { id: 'estes', role: 'Support', metaTier: 'A-TIER' },
  { id: 'diggie', role: 'Support', metaTier: 'S-TIER (META)' },
  { id: 'angela', role: 'Support', metaTier: 'A-TIER' },
  { id: 'carmilla', role: 'Support/Tank', metaTier: 'B-TIER' },
  { id: 'mathilda', role: 'Support/Assassin', metaTier: 'A-TIER' },
  { id: 'floryn', role: 'Support', metaTier: 'S-TIER (META)' },
  { id: 'faramis', role: 'Mage/Support', metaTier: 'B-TIER' },
  { id: 'kaja', role: 'Support/Fighter', metaTier: 'S-TIER (META)' },
  { id: 'chip', role: 'Support/Tank', metaTier: 'C-TIER' },
  { id: 'marcel', role: 'Support', metaTier: 'A-TIER' }
];

function buildHeroTitleString(id) {
  return id.split(/[-']/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(id.includes('-') ? '-' : "'");
}

function resolveHeroFilename(id) {
  if (id === 'lapu-lapu') return 'Lapu-lapu.png';
  if (id === 'popol') return 'Popol and Kupa.png';
  if (id === 'yu-zhong') return 'Yu Zhong.png';
  if (id === 'x-borg') return 'X-Borg.png';
  return id.charAt(0).toUpperCase() + id.slice(1) + '.png';
}

// Global Unified Application Base Architecture Map
const GameHubData = {
  widgets: {
    activeDisplayMode: 'grid_view_layout',
    panelTransitionDurationMs: 350,
    allowBackgroundOverlayBlur: true
  },
  gamehub: {
    items: MLBB_ITEM_DATA_RAW.map(i => ({
      id: i.id,
      name: i.name,
      type: i.type,
      img: `images/items/${i.id}.png`,
      desc: `GameHub item profile metrics baseline for parameter unit: [${i.name.toUpperCase()}].`
    })),
    heroes: MLBB_HERO_DATA_RAW.map(h => {
      const formattedName = buildHeroTitleString(h.id);
      return {
        id: h.id,
        name: formattedName,
        role: h.role,
        metaTier: h.metaTier,
        img: `images/heroes/${resolveHeroFilename(h.id)}`, 
        desc: `Battlefield tactical asset database log parsing parameters for registry unit [${h.id.toUpperCase()}].`,
        
        // Detailed Dashboard Layout Configuration Map
        interactiveDetailsPanel: {
          screenLayoutPosition: "bottom-up-to-mid-top",
          counters: [
            { enemyHeroId: "chou", dangerLevel: "HIGH", strategy: "Maintain zoning tools and anti-dash spacing patterns to avoid initiation flips." },
            { enemyHeroId: "hayabusa", dangerLevel: "CRITICAL", strategy: "Time burst immunity frame triggers effectively or stack physical defense properties early." }
          ],
          suitableSynergisticTeammates: [
            { heroId: "diggie", reason: "Provides clean crowd control immunity windows during team initiation protocols." },
            { heroId: "minotaur", reason: "Sets up high-value front line zoning zones and continuous chain knockup setup routes." }
          ],
          combos: [
            { sequence: "Skill 1 -> Basic Attack -> Skill 2 -> Ultimate", description: "Standard tactical high burst damage target engage execution chain." },
            { sequence: "Skill 2 (Blink/Dash) -> Ultimate -> Skill 1 -> Execute", description: "Flank entry strategy for priority backline isolation mechanics." }
          ],
          bestThreeBuilds: [
            {
              buildName: "S-Tier Sustained Attack Burst",
              items: [
                { id: "blade_of_the_heptaseas", img: "images/items/blade_of_the_heptaseas.png" },
                { id: "hunter_strike", img: "images/items/hunter_strike.png" },
                { id: "blade_of_despair", img: "images/items/blade_of_despair.png" }
              ],
              details: "Prioritizes high physical penetration metrics to maximize immediate raw damage options against low-defense squishies."
            },
            {
              buildName: "Anti-Heal Tank Shredder Configuration",
              items: [
                { id: "demon_hunter_sword", img: "images/items/demon_hunter_sword.png" },
                { id: "corrosion_scythe", img: "images/items/corrosion_scythe.png" },
                { id: "malefic_roar", img: "images/items/malefic_roar.png" }
              ],
              details: "Melts massive high-health sustained team compositions and neutralizes continuous lifesteal parameters via percent scaling rules."
            },
            {
              buildName: "Safe Utility Semi-Defense Setup",
              items: [
                { id: "endless_battle", img: "images/items/endless_battle.png" },
                { id: "thunder_belt", img: "images/items/thunder_belt.png" },
                { id: "immortality", img: "images/items/immortality.png" }
              ],
              details: "Balances defensive cooldown mechanics alongside true-damage baseline activation properties for safe late-game match assurance."
            }
          ]
        }
      };
    })
  }
};

/* =========================================================
   VOID // UI DETAILED INTERACTIVE INTERACTION SHEET CONTROLLER
   ========================================================= */

// Dynamically Initialize and Inject HTML Panel Container Elements
function initGameHubDetailsPanel() {
  if (document.getElementById('gamehub-bottom-panel')) return;

  const panelHtml = `
    <!-- Overlay Background Dimmer Block -->
    <div id="gamehub-panel-overlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.65); backdrop-filter:blur(5px); opacity:0; pointer-events:none; transition:opacity 0.3s ease; z-index:9998;"></div>
    
    <!-- Sliding Bottom Drawer Frame Context -->
    <div id="gamehub-bottom-panel" style="position:fixed; bottom:-100%; left:0; width:100%; height:75vh; background:#0a0e14; border-top:3px solid #00ff66; box-shadow:0 -10px 30px rgba(0,255,102,0.15); border-radius:20px 20px 0 0; transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1); z-index:9999; overflow-y:auto; color:#e2e8f0; font-family:monospace;">
      <!-- Title Toggle Header Action Box -->
      <div id="gamehub-panel-close" style="width:100%; padding:15px; text-align:center; cursor:pointer; border-bottom:1px solid #1a2333; background:#0f1622; color:#00ff66; font-weight:bold; letter-spacing:2px;">
        [ CLOSE ANALYSIS PANEL ]
      </div>
      <!-- Core Content Injected Shell Wrapper -->
      <div id="gamehub-panel-content" style="padding:25px;"></div>
    </div>
  `;
  
  const template = document.createElement('div');
  template.innerHTML = panelHtml;
  document.body.appendChild(template);

  // Link Event Listeners for Shutdown Triggers
  document.getElementById('gamehub-panel-close').addEventListener('click', closeHeroPanel);
  document.getElementById('gamehub-panel-overlay').addEventListener('click', closeHeroPanel);
}

// Intercept Clicks, Gather Data Profile, Build Layout, and Shift Viewport Positions
function openHeroPanel(heroId) {
  initGameHubDetailsPanel();
  
  // Extract Target Data Model
  const hero = GameHubData.gamehub.heroes.find(h => h.id === heroId);
  if (!hero) return;

  const panel = document.getElementById('gamehub-bottom-panel');
  const overlay = document.getElementById('gamehub-panel-overlay');
  const content = document.getElementById('gamehub-panel-content');
  const panelData = hero.interactiveDetailsPanel;

  // Render Inner Context HTML Structure Modules
  content.innerHTML = `
    <!-- Profile Metric Header Card -->
    <div style="display:flex; align-items:center; gap:20px; margin-bottom:25px; border-bottom:1px solid #1a2333; padding-bottom:15px;">
      <img src="${hero.img}" alt="${hero.name}" style="width:70px; height:70px; border-radius:10px; border:2px solid #00ff66; object-fit:cover;" onerror="this.src='images/heroes/default.png'">
      <div>
        <h2 style="margin:0; color:#00ff66; font-size:24px; text-transform:uppercase;">${hero.name}</h2>
        <div style="margin-top:5px;">
          <span style="background:#1a2333; padding:3px 8px; border-radius:4px; font-size:12px; color:#a0aec0; margin-right:5px;">${hero.role}</span>
          <span style="color:#00ff66; font-weight:bold; font-size:13px; background:rgba(0,255,102,0.1); padding:2px 6px; border-radius:4px; border:1px solid rgba(0,255,102,0.2);">${hero.metaTier}</span>
        </div>
      </div>
    </div>

    <!-- MODULE 1: THREAT ENEMY COUNTERS -->
    <h3 style="color:#ff3b3b; text-transform:uppercase; margin-top:20px; font-size:15px; letter-spacing:1px;">// THREAT COUNTERS PROFILE</h3>
    <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:25px;">
      ${panelData.counters.map(c => `
        <div style="background:#161212; border-left:4px solid #ff3b3b; padding:12px; border-radius:4px; border:1px solid #2a1818;">
          <strong style="color:#ff7c7c; font-size:13px;">vs ${c.enemyHeroId.toUpperCase()} &mdash; <span style="color:#ff3b3b;">[${c.dangerLevel}]</span></strong>
          <p style="margin:5px 0 0 0; font-size:12px; color:#cbd5e1; line-height:1.4;">${c.strategy}</p>
        </div>
      `).join('')}
    </div>

    <!-- MODULE 2: SYNERGISTIC TEAMMATES -->
    <h3 style="color:#00e5ff; text-transform:uppercase; margin-top:20px; font-size:15px; letter-spacing:1px;">// BEST SUITABLE SYNERGY PROTOCOL</h3>
    <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:25px;">
      ${panelData.suitableSynergisticTeammates.map(t => `
        <div style="background:#0f1b26; border-left:4px solid #00e5ff; padding:12px; border-radius:4px; border:1px solid #132b3d;">
          <strong style="color:#7ce7ff; font-size:13px;">COMPATIBLE WITH: ${t.heroId.toUpperCase()}</strong>
          <p style="margin:5px 0 0 0; font-size:12px; color:#cbd5e1; line-height:1.4;">${t.reason}</p>
        </div>
      `).join('')}
    </div>

    <!-- MODULE 3: COMBOS SEQUENCE PATHWAY -->
    <h3 style="color:#e5c158; text-transform:uppercase; margin-top:20px; font-size:15px; letter-spacing:1px;">// COMBOS SEQUENCE CHAIN MATRIX</h3>
    <div style="background:#161b22; padding:15px; border-radius:6px; margin-bottom:25px; border:1px solid #21262d;">
      ${panelData.combos.map((combo, idx) => `
        <div style="margin-bottom:15px; ${idx === panelData.combos.length - 1 ? 'margin-bottom:0;' : ''}">
          <div style="color:#e5c158; font-weight:bold; font-size:12px;">TACTICAL LINK SEQUENCE [0${idx + 1}]:</div>
          <code style="background:#0d1117; display:block; padding:8px; margin:5px 0; border-radius:4px; color:#00ff66; border:1px solid #30363d; font-size:13px; font-weight:bold;">${combo.sequence}</code>
          <p style="margin:0; font-size:12px; color:#8b949e; line-height:1.4;">${combo.description}</p>
        </div>
      `).join('')}
    </div>

    <!-- MODULE 4: TOP 3 TARGET ITEM BUILDS WITH PICTURES -->
    <h3 style="color:#00ff66; text-transform:uppercase; margin-top:20px; font-size:15px; letter-spacing:1px;">// OPTIMIZED RECOMMENDED ITEM SETS</h3>
    <div>
      ${panelData.bestThreeBuilds.map((build, index) => `
        <div style="background:#0f1622; border:1px solid #1a2333; padding:15px; border-radius:8px; margin-bottom:15px;">
          <h4 style="margin:0 0 12px 0; color:#00ff66; font-size:14px; text-transform:uppercase; letter-spacing:0.5px;">SYSTEM BUILD #0${index + 1}: ${build.buildName}</h4>
          
          <!-- Image Set Assembly Track -->
          <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
            ${build.items.map(item => `
              <div style="position:relative; width:55px; height:55px; background:#0d1117; border-radius:8px; border:1px solid #2d3748; padding:2px; display:flex; align-items:center; justify-content:center;">
                <img src="${item.img}" alt="${item.id}" style="width:100%; height:100%; border-radius:6px; object-fit:contain;" title="${item.id.replace(/_/g, ' ')}" onerror="this.src='images/items/default.png'">
              </div>
            `).join('')}
          </div>
          
          <p style="margin:0; font-size:12px; color:#a0aec0; line-height:1.5;">${build.details}</p>
        </div>
      `).join('')}
    </div>
  `;

  // Apply Animation Style Changes to Slide Up to Mid-Top Screen Range
  overlay.style.opacity = "1";
  overlay.style.pointerEvents = "auto";
  panel.style.transform = "translateY(-100%)";
}

// Close and Slide Back Panel Out of Viewport Bounds
function closeHeroPanel() {
  const panel = document.getElementById('gamehub-bottom-panel');
  const overlay = document.getElementById('gamehub-panel-overlay');
  if (panel) panel.style.transform = "translateY(0)";
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  }
}

/* =========================================================
   VOID // RUNTIME EVENT ATTACHMENT MAPPER HOCK
   ========================================================= */

// Attach this to your system renderer or element generation loop engine
// Call this function when passing generated lists into your dashboard document trees
function attachHeroCardClickListeners() {
  // Selector target corresponds to your individual hero entry card wrapper nodes
  const heroCards = document.querySelectorAll('.hero-card-element, [data-hero-id]');
  
  heroCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevents basic href execution loops if wrapping inside old a tag nodes
      e.preventDefault(); 
      
      const heroId = card.getAttribute('data-hero-id') || 'saber';
      
      // Fires presentation logic engine sequence directly
      openHeroPanel(heroId);
    });
  });
}

// Automatically hooks event targets if elements already sit inside DOM files
document.addEventListener("DOMContentLoaded", () => {
  attachHeroCardClickListeners();
});
