/* =========================================================
   VOID // GAMEHUB CONTENT DATABASE ENGINE (2026 MATRIX)
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
  { id: 'saber', role: 'Assassin', rarity: 'B-TIER' },
  { id: 'karina', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'fanny', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'hayabusa', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'natalia', role: 'Assassin', rarity: 'C-TIER' },
  { id: 'lancelot', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'helcurt', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'gusion', role: 'Assassin/Mage', rarity: 'S-TIER (META)' },
  { id: 'selena', role: 'Assassin/Mage', rarity: 'A-TIER' },
  { id: 'hanzo', role: 'Assassin', rarity: 'B-TIER' },
  { id: 'ling', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'benedetta', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'aamon', role: 'Assassin', rarity: 'S-TIER (META)' },
  { id: 'joy', role: 'Assassin', rarity: 'A-TIER' },
  { id: 'nolan', role: 'Assassin', rarity: 'B-TIER' },
  { id: 'sora', role: 'Fighter/Assassin', rarity: 'S-TIER (META)' },
  { id: 'hirara', role: 'Assassin', rarity: 'A-TIER' },

  // --- FIGHTERS / EXP LANE ---
  { id: 'balmond', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'alucard', role: 'Fighter', rarity: 'C-TIER' },
  { id: 'bane', role: 'Fighter/Mage', rarity: 'B-TIER' },
  { id: 'zilong', role: 'Fighter/Assassin', rarity: 'C-TIER' },
  { id: 'freya', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'chou', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'sun', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'alpha', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'ruby', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'lapu-lapu', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'roger', role: 'Fighter/Marksman', rarity: 'C-TIER' },
  { id: 'gatotkaca', role: 'Tank/Fighter', rarity: 'A-TIER' },
  { id: 'jawhead', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'martis', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'aldous', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'leomord', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'thamuz', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'minsitthar', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'badang', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'guinevere', role: 'Fighter/Mage', rarity: 'S-TIER (META)' },
  { id: 'terizla', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'x-borg', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'dyrroth', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'silvanna', role: 'Fighter', rarity: 'C-TIER' },
  { id: 'yu-zhong', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'khaleed', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'paquito', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'phoveus', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'yin', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'julian', role: 'Fighter/Mage', rarity: 'S-TIER (META)' },
  { id: 'fredrinn', role: 'Tank/Fighter', rarity: 'S-TIER (META)' },
  { id: 'cici', role: 'Fighter', rarity: 'A-TIER' },
  { id: 'arlott', role: 'Fighter', rarity: 'S-TIER (META)' },
  { id: 'aulus', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'masha', role: 'Fighter/Tank', rarity: 'B-TIER' },
  { id: 'suyou', role: 'Fighter/Assassin', rarity: 'B-TIER' },
  { id: 'lukas', role: 'Fighter', rarity: 'B-TIER' },
  { id: 'kalea', role: 'Fighter', rarity: 'A-TIER' },

  // --- MARKSMEN / GOLD LANE ---
  { id: 'miya', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'bruno', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'clint', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'layla', role: 'Marksman', rarity: 'C-TIER' },
  { id: 'moskov', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'karrie', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'iridhel', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'hanabi', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'claude', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'kimmy', role: 'Marksman/Mage', rarity: 'S-TIER (META)' },
  { id: 'granger', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'wanwan', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'popol', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'brody', role: 'Marksman', rarity: 'B-TIER' },
  { id: 'beatrix', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'melissa', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'ixia', role: 'Marksman', rarity: 'S-TIER (META)' },
  { id: 'natan', role: 'Marksman', rarity: 'A-TIER' },
  { id: 'lesley', role: 'Marksman/Assassin', rarity: 'A-TIER' },
  { id: 'obsidia', role: 'Marksman', rarity: 'B-TIER' },

  // --- MAGES / MID LANE ---
  { id: 'alice', role: 'Mage', rarity: 'A-TIER' },
  { id: 'eudora', role: 'Mage', rarity: 'B-TIER' },
  { id: 'gord', role: 'Mage', rarity: 'C-TIER' },
  { id: 'kagura', role: 'Mage', rarity: 'B-TIER' },
  { id: 'cyclops', role: 'Mage', rarity: 'B-TIER' },
  { id: 'aurora', role: 'Mage', rarity: 'B-TIER' },
  { id: 'vexana', role: 'Mage', rarity: 'B-TIER' },
  { id: 'harley', role: 'Mage/Assassin', rarity: 'S-TIER (META)' },
  { id: 'odette', role: 'Mage', rarity: 'B-TIER' },
  { id: 'zhask', role: 'Mage', rarity: 'C-TIER' },
  { id: 'pharsa', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'valir', role: 'Mage', rarity: 'A-TIER' },
  { id: 'chang-e', role: 'Mage', rarity: 'C-TIER' },
  { id: 'vale', role: 'Mage', rarity: 'B-TIER' },
  { id: 'lunox', role: 'Mage', rarity: 'B-TIER' },
  { id: 'harith', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'kadita', role: 'Mage/Assassin', rarity: 'B-TIER' },
  { id: 'esmeralda', role: 'Mage/Tank', rarity: 'B-TIER' },
  { id: 'lylia', role: 'Mage', rarity: 'B-TIER' },
  { id: 'cecilision', role: 'Mage', rarity: 'B-TIER' },
  { id: 'yve', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'valentina', role: 'Mage', rarity: 'A-TIER' },
  { id: 'xavier', role: 'Mage', rarity: 'B-TIER' },
  { id: 'novaria', role: 'Mage', rarity: 'B-TIER' },
  { id: 'zhuxin', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'luo-yi', role: 'Mage', rarity: 'S-TIER (META)' },
  { id: 'zetian', role: 'Mage', rarity: 'A-TIER' },

  // --- TANKS / ROAM ---
  { id: 'tigreal', role: 'Tank', rarity: 'A-TIER' },
  { id: 'akai', role: 'Tank', rarity: 'C-TIER' },
  { id: 'franco', border: 'Tank', rarity: 'C-TIER' },
  { id: 'minotaur', role: 'Tank/Support', rarity: 'S-TIER (META)' },
  { id: 'johnson', role: 'Tank', rarity: 'B-TIER' },
  { id: 'hilda', role: 'Fighter/Tank', rarity: 'A-TIER' },
  { id: 'grock', role: 'Tank', rarity: 'S-TIER (META)' },
  { id: 'argus', role: 'Fighter/Tank', rarity: 'B-TIER' },
  { id: 'hylos', role: 'Tank', rarity: 'A-TIER' },
  { id: 'uranus', role: 'Tank', rarity: 'S-TIER (META)' },
  { id: 'belerick', role: 'Tank', rarity: 'A-TIER' },
  { id: 'khufra', role: 'Tank', rarity: 'C-TIER' },
  { id: 'baxia', role: 'Tank', rarity: 'A-TIER' },
  { id: 'atlas', role: 'Tank', rarity: 'B-TIER' },
  { id: 'barats', role: 'Tank/Fighter', rarity: 'A-TIER' },
  { id: 'edith', role: 'Tank/Marksman', rarity: 'A-TIER' },
  { id: 'gloo', role: 'Tank', rarity: 'S-TIER (META)' },

  // --- SUPPORTS / ROAM ---
  { id: 'nana', role: 'Mage/Support', rarity: 'C-TIER' },
  { id: 'rafaela', role: 'Support', rarity: 'A-TIER' },
  { id: 'lolita', role: 'Support/Tank', rarity: 'A-TIER' },
  { id: 'estes', role: 'Support', rarity: 'A-TIER' },
  { id: 'diggie', role: 'Support', rarity: 'S-TIER (META)' },
  { id: 'angela', role: 'Support', rarity: 'S-TIER (META)' },
  { id: 'carmilla', role: 'Support/Tank', rarity: 'B-TIER' },
  { id: 'mathilda', role: 'Support/Assassin', rarity: 'A-TIER' },
  { id: 'floryn', role: 'Support', rarity: 'S-TIER (META)' },
  { id: 'faramis', role: 'Mage/Support', rarity: 'B-TIER' },
  { id: 'kaja', role: 'Support/Fighter', rarity: 'S-TIER (META)' },
  { id: 'chip', role: 'Support/Tank', rarity: 'A-TIER' },
  { id: 'marcel', role: 'Support', rarity: 'A-TIER' }
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
    img: `images/items/${i.id}.png`,
    desc: `GameHub equipment profile tracking baseline metrics for core: [${i.name.toUpperCase()}].`
  }))
};
