/* =========================================================
   VOID // GAMEHUB CONTENT DATABASE ENGINE (2026 MATRIX)
   ========================================================= */

const MLBB_HERO_DATA_RAW = [
  // --- ASSASSINS / JUNGLERS ---
  { id: 'saber', role: 'Assassin', rarity: 'B-TIER' },
  { id: 'karina', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'fanny', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'hayabusa', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'natalia', role: 'Assassin', rarity: 'B-TIER' },
  { id: 'lancelot', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'helcurt', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'gusion', role: 'Assassin/Mage', rarity: 'A-TIER' },
  { id: 'selena', role: 'Assassin/Mage', rarity: 'B-TIER' },
  { id: 'hanzo', role: 'Assassin', rarity: 'B-TIER' },
  { id: 'ling', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'benedetta', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'aamon', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'joy', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'nolan', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'sora', role: 'Fighter/Assassin', rarity: 'S-TIER (META)' },
  { id: 'hirara', role: 'Assassin', rarity: 'A-TIER' },

  // --- FIGHTERS / EXP LANE ---
  { id: 'balmond', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'alucard', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'bane', role: 'Fighter/Mage', rarity: 'A-TIER' },
  { id: 'zilong', role: 'Fighter/Assassin', rarity: 'B-TIER' },
  { id: 'freya', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'chou', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'sun', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'alpha', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'ruby', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'lapu-lapu', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'roger', role: 'Fighter/Marksman', rarity: 'S-TIER (META)' },
  { id: 'gatotkaca', role: 'Tank/Fighter', rarity: 'B-TIER' },
  { id: 'jawhead', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'martis', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'aldous', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'leomord', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'thamuz', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'minsitthar', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'badang', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'guinevere', role: 'Fighter/Mage', rarity: 'A-TIER' },
  { id: 'terizla', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'x-borg', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'dyrroth', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'silvanna', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'yu-zhong', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'khaleed', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'paquito', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'phoveus', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'yin', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'julian', role: 'Fighter/Mage', rarity: 'S-TIER (META)' },
  { id: 'fredrinn', role: 'Tank/Fighter', rarity: 'A-TIER' },
  { id: 'cici', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'arlott', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'aulus', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'masha', role: 'Fighter/Tank', rarity: 'A-TIER' },
  { id: 'suyou', role: 'Fighter/Assassin', rarity: 'S-TIER (META)' },
  { id: 'lukas', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'kalea', role: 'Fighter', rarity: 'A-TIER' },

  // --- MARKSMEN / GOLD LANE ---
  { id: 'miya', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'bruno', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'clint', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'layla', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'moskov', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'karrie', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'iridhel', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'hanabi', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'claude', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'kimmy', role: 'Marksman/Mage', rarity: 'B-TIER' },
  { id: 'granger', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'wanwan', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'popol', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'brody', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'beatrix', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'melissa', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'ixia', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'natan', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'lesley', role: 'Marksman/Assassin', rarity: 'B-TIER' },
  { id: 'obsidia', role: 'Marksman', rarity: 'A-TIER' },

  // --- MAGES / MID LANE ---
  { id: 'alice', role: 'Mage', rarity: 'B-TIER' },
  { id: 'eudora', role: 'Mage', rarity: 'B-TIER' },
  { id: 'gord', role: 'Mage', rarity: 'B-TIER' },
  { id: 'kagura', role: 'Mage', rarity: 'A-TIER' },
  { id: 'cyclops', role: 'Mage', rarity: 'B-TIER' },
  { id: 'aurora', role: 'Mage', rarity: 'A-TIER' },
  { id: 'vexana', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'harley', role: 'Mage/Assassin', rarity: 'B-TIER' },
  { id: 'odette', role: 'Mage', rarity: 'A-TIER' },
  { id: 'zhask', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'pharsa', role: 'Mage', rarity: 'B-TIER' },
  { id: 'valir', role: 'Mage', rarity: 'B-TIER' },
  { id: 'chang-e', role: 'Mage', rarity: 'B-TIER' },
  { id: 'vale', role: 'Mage', rarity: 'B-TIER' },
  { id: 'lunox', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'harith', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'kadita', role: 'Mage/Assassin', rarity: 'A-TIER' },
  { id: 'esmeralda', role: 'Mage/Tank', rarity: 'A-TIER' },
  { id: 'lylia', role: 'Mage', rarity: 'A-TIER' },
  { id: 'cecilision', role: 'Mage', rarity: 'B-TIER' },
  { id: 'yve', role: 'Mage', rarity: 'B-TIER' },
  { id: 'valentina', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'xavier', role: 'Mage', rarity: 'A-TIER' },
  { id: 'novaria', role: 'Mage', rarity: 'A-TIER' },
  { id: 'zhuxin', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'luo-yi', role: 'Mage', rarity: 'A-TIER' },
  { id: 'zetian', role: 'Mage', rarity: 'A-TIER' },

  // --- TANKS / ROAM ---
  { id: 'tigreal', role: 'Tank', rarity: 'A-TIER' },
  { id: 'akai', role: 'Tank', rarity: 'B-TIER' },
  { id: 'franco', border: 'Tank', rarity: 'A-TIER' },
  { id: 'minotaur', role: 'Tank/Support', rarity: 'S-TIER (META)' },
  { id: 'johnson', role: 'Tank', rarity: 'B-TIER' },
  { id: 'hilda', role: 'Fighter/Tank', rarity: 'B-TIER' },
  { id: 'grock', role: 'Tank', rarity: 'A-TIER' },
  { id: 'argus', role: 'Fighter/Tank', rarity: 'B-TIER' },
  { id: 'hylos', role: 'Tank', rarity: 'S-TIER (META)' },
  { id: 'uranus', role: 'Tank', rarity: 'B-TIER' },
  { id: 'belerick', role: 'Tank', rarity: 'B-TIER' },
  { id: 'khufra', role: 'Tank', rarity: 'A-TIER' },
  { id: 'baxia', role: 'Tank', rarity: 'A-TIER' },
  { id: 'atlas', role: 'Tank', rarity: 'A-TIER' },
  { id: 'barats', role: 'Tank/Fighter', rarity: 'A-TIER' },
  { id: 'edith', role: 'Tank/Marksman', rarity: 'S-TIER (META)' },
  { id: 'gloo', role: 'Tank', rarity: 'B-TIER' },

  // --- SUPPORTS / ROAM ---
  { id: 'nana', role: 'Mage/Support', rarity: 'B-TIER' },
  { id: 'rafaela', role: 'Support', rarity: 'B-TIER' },
  { id: 'lolita', role: 'Support/Tank', rarity: 'A-TIER' },
  { id: 'estes', role: 'Support', rarity: 'B-TIER' },
  { id: 'diggie', role: 'Support', rarity: 'S-TIER (META)' },
  { id: 'angela', role: 'Support', rarity: 'S-TIER (META)' },
  { id: 'carmilla', role: 'Support/Tank', rarity: 'A-TIER' },
  { id: 'mathilda', role: 'Support/Assassin', rarity: 'S-TIER (META)' },
  { id: 'floryn', role: 'Support', rarity: 'A-TIER' },
  { id: 'faramis', role: 'Mage/Support', rarity: 'S-TIER (META)' },
  { id: 'kaja', role: 'Support/Fighter', rarity: 'A-TIER' },
  { id: 'chip', role: 'Support/Tank', rarity: 'S-TIER (META)' },
  { id: 'marcel', role: 'Support', rarity: 'A-TIER' }
];

const MLBB_ITEM_DATA_RAW = [
  // Physical Attack Core Items
  { id: 'sea_halberd', name: 'Sea Halberd', type: 'Physical', tier: 'TIER III' },
  { id: 'rose_gold_meteor', name: 'Rose Gold Meteor', type: 'Physical', tier: 'TIER III' },
  { id: 'bloodlust_axe', name: 'Bloodlust Axe', type: 'Physical', tier: 'TIER III' },
  { id: 'hunter_strike', name: 'Hunter Strike', type: 'Physical', tier: 'TIER III' },
  { id: 'blade_of_despair', name: 'Blade of Despair', type: 'Physical', tier: 'TIER III' },
  { id: 'blade_of_the_heptaseas', name: 'Blade of the Heptaseas', type: 'Physical', tier: 'TIER III' },
  { id: 'windtalker', name: 'Windtalker', type: 'Physical', tier: 'TIER III' },
  { id: 'endless_battle', name: 'Endless Battle', type: 'Physical', tier: 'TIER III' },
  { id: 'berserker_fury', name: 'Berserker\'s Fury', type: 'Physical', tier: 'TIER III' },
  { id: 'haas_claws', name: 'Haas\'s Claws', type: 'Physical', tier: 'TIER III' },
  { id: 'malefic_roar', name: 'Malefic Roar', type: 'Physical', tier: 'TIER III' },
  { id: 'war_axe', name: 'War Axe', type: 'Physical', tier: 'TIER III' },
  { id: 'wind_of_nature', name: 'Wind of Nature', type: 'Physical', tier: 'TIER III' },
  { id: 'corrosion_scythe', name: 'Corrosion Scythe', type: 'Physical', tier: 'TIER III' },
  { id: 'demon_hunter_sword', name: 'Demon Hunter Sword', type: 'Physical', tier: 'TIER III' },
  { id: 'great_dragon_spear', name: 'Great Dragon Spear', type: 'Physical', tier: 'TIER III' },

  // Magic Power Items
  { id: 'genius_wand', name: 'Genius Wand', type: 'Magic', tier: 'TIER III' },
  { id: 'lightning_truncheon', name: 'Lightning Truncheon', type: 'Magic', tier: 'TIER III' },
  { id: 'fleeting_time', name: 'Fleeting Time', type: 'Magic', tier: 'TIER III' },
  { id: 'blood_wings', name: 'Blood Wings', type: 'Magic', tier: 'TIER III' },
  { id: 'clock_of_destiny', name: 'Clock of Destiny', type: 'Magic', tier: 'TIER III' },
  { id: 'holy_crystal', name: 'Holy Crystal', type: 'Magic', tier: 'TIER III' },
  { id: 'divine_glaive', name: 'Divine Glaive', type: 'Magic', tier: 'TIER III' },
  { id: 'glowing_wand', name: 'Glowing Wand', type: 'Magic', tier: 'TIER III' },
  { id: 'ice_queen_wand', name: 'Ice Queen Wand', type: 'Magic', tier: 'TIER III' },
  { id: 'feather_of_heaven', name: 'Feather of Heaven', type: 'Magic', tier: 'TIER III' },
  { id: 'star_shard', name: 'Star Shard', type: 'Magic', tier: 'TIER III' },
  { id: 'enchanted_talisman', name: 'Enchanted Talisman', type: 'Magic', tier: 'TIER III' },
  { id: 'winter_crown', name: 'Winter Crown', type: 'Magic', tier: 'TIER III' },

  // Defense / Protective Armour Items
  { id: 'radiant_armor', name: 'Radiant Armor', type: 'Defense', tier: 'TIER III' },
  { id: 'twilight_armor', name: 'Twilight Armor', type: 'Defense', tier: 'TIER III' },
  { id: 'brute_force_breastplate', name: 'Brute Force Breastplate', type: 'Defense', tier: 'TIER III' },
  { id: 'immortality', name: 'Immortality', type: 'Defense', tier: 'TIER III' },
  { id: 'dominance_ice', name: 'Dominance Ice', type: 'Defense', tier: 'TIER III' },
  { id: 'athena_shield', name: 'Athena\'s Shield', type: 'Defense', tier: 'TIER III' },
  { id: 'oracle', name: 'Oracle', type: 'Defense', tier: 'TIER III' },
  { id: 'antique_cuirass', name: 'Antique Cuirass', type: 'Defense', tier: 'TIER III' },
  { id: 'guardian_helmet', name: 'Guardian Helmet', type: 'Defense', tier: 'TIER III' },
  { id: 'blade_armor', name: 'Blade Armor', type: 'Defense', tier: 'TIER III' },
  { id: 'thunder_belt', name: 'Thunder Belt', type: 'Defense', tier: 'TIER III' }
];

function buildHeroTitleString(id) {
  return id.split(/[-']/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(id.includes('-') ? '-' : "'");
}

function resolveHeroFilename(id) {
  // Manual overrides to match the exact physical assets on disk from the screenshots
  if (id === 'lapu-lapu') return 'Lapu-lapu.png';
  if (id === 'popol') return 'Popol and Kupa.png';
  if (id === 'yu-zhong') return 'Yu Zhong.png';
  if (id === 'x-borg') return 'X-Borg.png';

  // Standard proper capitalization rule for all other single-word IDs
  return id.charAt(0).toUpperCase() + id.slice(1) + '.png';
}

const GameHubData = {
  heroes: MLBB_HERO_DATA_RAW.map(h => ({
    id: h.id,
    name: buildHeroTitleString(h.id),
    role: h.role,
    rarity: h.rarity,
    img: `images/heroes/${resolveHeroFilename(h.id)}`, 
    desc: `Battlefield tactical asset database log parsing parameters for registry unit [${h.id.toUpperCase()}].`
  })),
  items: MLBB_ITEM_DATA_RAW.map(i => ({
    id: i.id,
    name: i.name,
    type: i.type,
    tier: i.tier,
    img: `images/items/${i.id}.png`,
    desc: `GameHub equipment profile tracking baseline metrics for tier matrix core: [${i.name.toUpperCase()}].`
  }))
};
