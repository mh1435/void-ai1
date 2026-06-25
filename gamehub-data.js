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
  { id: 'bane', metaTier: 'C-TIER', role: 'Fighter/Mage' },
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
  { id: 'vale', role: 'A-TIER', role: 'Mage' },
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
  { id: 'marcel', metaTier: 'A-TIER', role: 'Support' }
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

// Global Application Base Infrastructure Structure
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
      desc: `GameHub item profile metrics baseline for deployment parameter unit: [${i.name.toUpperCase()}].`
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
        
        // Interactive Drawer Component UI Trigger Mapping Data Schema
        interactiveDetailsPanel: {
          cssTransitionStyle: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
          screenLayoutPosition: "bottom-up-to-mid-top",
          
          counters: [
            { enemyHeroId: "chou", dangerLevel: "HIGH", strategy: "Zoning and anti-dash spacing patterns" },
            { enemyHeroId: "hayabusa", dangerLevel: "CRITICAL", strategy: "Time burst immunity frame triggers effectively" }
          ],
          suitableSynergisticTeammates: [
            { heroId: "diggie", reason: "Provides clean crowd control immunity windows during initiation files" },
            { heroId: "minotaur", reason: "Sets up high-value front line zoning and continuous chain CC windows" }
          ],
          combos: [
            { sequence: "Skill 1 -> Basic Attack -> Skill 2 -> Ultimate", description: "Standard tactical burst engage chain protocol" },
            { sequence: "Skill 2 (Blink/Dash) -> Ultimate -> Skill 1 -> Execute", description: "Flank entry target isolation execution route" }
          ],
          bestThreeBuilds: [
            {
              buildName: "S-Tier Sustained Attack Burst",
              items: [
                { id: "blade_of_the_heptaseas", img: "images/items/blade_of_the_heptaseas.png" },
                { id: "hunter_strike", img: "images/items/hunter_strike.png" },
                { id: "blade_of_despair", img: "images/items/blade_of_despair.png" }
              ],
              details: "Prioritizes immediate raw burst optimization mechanics to secure lane clear priority tags and isolated squishy picks."
            },
            {
              buildName: "Anti-Heal Tank Shredder Configuration",
              items: [
                { id: "demon_hunter_sword", img: "images/items/demon_hunter_sword.png" },
                { id: "corrosion_scythe", img: "images/items/corrosion_scythe.png" },
                { id: "malefic_roar", img: "images/items/malefic_roar.png" }
              ],
              details: "Melts massive high-health sustained compositions and neutralizes continuous shielding buffs via high scaling pen rules."
            },
            {
              buildName: "Safe Utility Semi-Defense Setup",
              items: [
                { id: "endless_battle", img: "images/items/endless_battle.png" },
                { id: "thunder_belt", img: "images/items/thunder_belt.png" },
                { id: "immortality", img: "images/items/immortality.png" }
              ],
              details: "Balances defensive high-impact fallback systems alongside true-damage baseline cooldown procs for endgame match safety checks."
            }
          ]
        }
      };
    })
  }
};
