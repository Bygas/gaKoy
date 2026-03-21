import type { MonsterDef, MineFloorDef } from '@/types'
import { getItemById } from './items'

/** Madenin toplam kat sayısı */
export const MAX_MINE_FLOOR = 120

/** Bölgelere göre maden/taş eşleşmeleri (bakır 1-40 / demir 41-80 / altın 81-120, her bölgede kendine özgü cevherler de vardır) */
const ZONE_ORES: Record<MineFloorDef['zone'], string[]> = {
  shallow: ['copper_ore', 'quartz'],
  frost: ['copper_ore', 'jade'],
  lava: ['iron_ore', 'ruby'],
  crystal: ['iron_ore', 'crystal_ore', 'moonstone'],
  shadow: ['gold_ore', 'shadow_ore', 'obsidian'],
  abyss: ['gold_ore', 'void_ore', 'dragon_jade']
}

/** Mantar katı ödülleri */
export const getMushroomRewards = (floor: number): { itemId: string; quantity: number }[] => {
  if (floor <= 20) {
    return [
      { itemId: 'wild_mushroom', quantity: 2 },
      { itemId: 'herb', quantity: 1 }
    ]
  }
  if (floor <= 40) {
    const rewards = [
      { itemId: 'wild_mushroom', quantity: 2 },
      { itemId: 'herb', quantity: 2 }
    ]
    if (Math.random() < 0.1) rewards.push({ itemId: 'ginseng', quantity: 1 })
    return rewards
  }
  if (floor <= 60) {
    return [
      { itemId: 'wild_mushroom', quantity: 3 },
      { itemId: 'ginseng', quantity: 1 }
    ]
  }
  if (floor <= 80) {
    return [
      { itemId: 'wild_mushroom', quantity: 3 },
      { itemId: 'ginseng', quantity: 1 },
      { itemId: 'herb', quantity: 3 }
    ]
  }
  if (floor <= 100) {
    return [
      { itemId: 'ginseng', quantity: 2 },
      { itemId: 'wild_mushroom', quantity: 4 }
    ]
  }
  return [
    { itemId: 'ginseng', quantity: 3 },
    { itemId: 'wild_mushroom', quantity: 5 }
  ]
}

/** Sandık katı ödülleri */
export const getTreasureRewards = (floor: number): { items: { itemId: string; quantity: number }[]; money: number } => {
  const zoneIndex = Math.floor((floor - 1) / 20)
  const zones: MineFloorDef['zone'][] = ['shallow', 'frost', 'lava', 'crystal', 'shadow', 'abyss']
  const zone = zones[zoneIndex] ?? 'abyss'
  const orePool = ZONE_ORES[zone]!
  const ore = orePool[Math.floor(Math.random() * orePool.length)]!

  const rewardTable: Record<string, { qty: number; minMoney: number; maxMoney: number }> = {
    shallow: { qty: 3, minMoney: 50, maxMoney: 100 },
    frost: { qty: 2, minMoney: 100, maxMoney: 200 },
    lava: { qty: 3, minMoney: 200, maxMoney: 500 },
    crystal: { qty: 2, minMoney: 300, maxMoney: 600 },
    shadow: { qty: 2, minMoney: 500, maxMoney: 1000 },
    abyss: { qty: 3, minMoney: 800, maxMoney: 1500 }
  }
  const r = rewardTable[zone]!
  const items: { itemId: string; quantity: number }[] = [{ itemId: ore, quantity: r.qty }]

  // Fosil / eski eşya düşmesi (%20 olasılık, bölgeye göre seçilir)
  if (Math.random() < 0.2) {
    const ZONE_TREASURE_DROPS: Record<string, string[]> = {
      shallow: ['trilobite_fossil', 'shell_fossil'],
      frost: ['trilobite_fossil', 'shell_fossil'],
      lava: ['ammonite_fossil', 'bronze_mirror', 'painted_pottery'],
      crystal: ['ammonite_fossil', 'jade_disc', 'jade_pendant'],
      shadow: ['oracle_bone', 'amber', 'ancient_coin'],
      abyss: ['dragon_tooth', 'bone_fragment', 'ancient_seed']
    }
    const pool = ZONE_TREASURE_DROPS[zone]
    if (pool && pool.length > 0) {
      const drop = pool[Math.floor(Math.random() * pool.length)]!
      items.push({ itemId: drop, quantity: 1 })
    }
  }

  // Uçurum katı sandıklarında çok düşük ihtimalle can meyvesi çıkar
  if (zone === 'abyss' && Math.random() < 0.02) {
    items.push({ itemId: 'stamina_fruit', quantity: 1 })
  }

  return {
    items,
    money: r.minMoney + Math.floor(Math.random() * (r.maxMoney - r.minMoney + 1))
  }
}

/** Kara su katı ödülleri - nadir cevherler çıkabilir (bölge sınırı olmadan) */
export const getDarkFloorOres = (): string[] => {
  return [
    'copper_ore',
    'iron_ore',
    'gold_ore',
    'crystal_ore',
    'shadow_ore',
    'void_ore',
    'quartz',
    'jade',
    'ruby',
    'moonstone',
    'obsidian',
    'dragon_jade'
  ]
}

/** Kara su katı tuzak hasarı (derine indikçe artar) */
export const getDarkFloorTrapDamage = (floor: number): number => {
  const zoneIndex = Math.floor((floor - 1) / 20)
  const base = 5 + zoneIndex * 5
  const range = 10 + zoneIndex * 5
  return base + Math.floor(Math.random() * (range + 1))
}

/** Kara su katında saklı bakır para ödülü */
export const getDarkFloorTreasureMoney = (floor: number): number => {
  const zoneIndex = Math.floor((floor - 1) / 20)
  const base = 50 + zoneIndex * 50
  const range = 150 + zoneIndex * 50
  return base + Math.floor(Math.random() * (range + 1))
}

/** Musallatlı kat temizleme ödülü */
export const getInfestedClearRewards = (floor: number): { items: { itemId: string; quantity: number }[]; money: number } => {
  const zoneIndex = Math.floor((floor - 1) / 20)
  const zones: MineFloorDef['zone'][] = ['shallow', 'frost', 'lava', 'crystal', 'shadow', 'abyss']
  const zone = zones[zoneIndex] ?? 'abyss'
  const orePool = ZONE_ORES[zone]!
  const ore = orePool[0]! // Ana cevher

  const moneyTable = [
    { min: 30, max: 50 },
    { min: 60, max: 100 },
    { min: 100, max: 150 },
    { min: 150, max: 250 },
    { min: 200, max: 350 },
    { min: 300, max: 500 }
  ]
  const m = moneyTable[zoneIndex] ?? moneyTable[5]!
  return {
    items: [{ itemId: ore, quantity: 3 }],
    money: m.min + Math.floor(Math.random() * (m.max - m.min + 1))
  }
}

/** Ödül nesnelerinin adlarını getir */
export const getRewardNames = (items: { itemId: string; quantity: number }[]): string => {
  return items
    .map(r => {
      const def = getItemById(r.itemId)
      return `${def?.name ?? r.itemId}×${r.quantity}`
    })
    .join('、')
}

// ==================== Yaratık tanımları ====================

/** Sıradan yaratıklar */
export const MONSTERS: Record<string, MonsterDef> = {
  // Sığ maden (1-20)
  mud_worm: {
    id: 'mud_worm',
    name: 'Çamur Kurdu',
    hp: 15,
    attack: 5,
    defense: 1,
    expReward: 5,
    drops: [
      { itemId: 'copper_ore', chance: 0.5 },
      { itemId: 'quartz', chance: 0.1 }
    ],
    description: 'Toprağın içinde kıvranan bir kurtçuk; pek tehlikeli sayılmaz.'
  },
  stone_crab: {
    id: 'stone_crab',
    name: 'Taş Yengeci',
    hp: 25,
    attack: 6,
    defense: 3,
    expReward: 8,
    drops: [
      { itemId: 'copper_ore', chance: 0.6 },
      { itemId: 'iron_ore', chance: 0.15 }
    ],
    description: 'Kabuğu taş gibi serttir; savunması yüksektir.'
  },

  // Buz (21-40)
  ice_bat: {
    id: 'ice_bat',
    name: 'Ayaz Yarasa',
    hp: 30,
    attack: 8,
    defense: 2,
    expReward: 12,
    drops: [
      { itemId: 'iron_ore', chance: 0.5 },
      { itemId: 'jade', chance: 0.1 }
    ],
    description: 'Soğuk karanlıkta çırpınan kanatlı bir uğursuzluk.'
  },
  ghost: {
    id: 'ghost',
    name: 'Hortlak',
    hp: 20,
    attack: 10,
    defense: 0,
    expReward: 15,
    drops: [
      { itemId: 'jade', chance: 0.2 },
      { itemId: 'quartz', chance: 0.3 }
    ],
    description: 'Eline avuca sığmaz; vurması serttir ama dayanıksızdır.'
  },

  // Lav (41-60)
  fire_bat: {
    id: 'fire_bat',
    name: 'Kor Yarasa',
    hp: 35,
    attack: 9,
    defense: 3,
    expReward: 18,
    drops: [
      { itemId: 'gold_ore', chance: 0.55 },
      { itemId: 'ruby', chance: 0.15 }
    ],
    description: 'Kanatlarından ateş saçan kızgın bir yaratık.'
  },
  shadow_warrior: {
    id: 'shadow_warrior',
    name: 'Gölge Cengâveri',
    hp: 50,
    attack: 10,
    defense: 4,
    expReward: 28,
    drops: [
      { itemId: 'gold_ore', chance: 0.65 },
      { itemId: 'ruby', chance: 0.25 }
    ],
    description: 'Madenin derinlerinde gezen kudretli bir düşman.'
  },

  // Kristal (61-80)
  crystal_golem: {
    id: 'crystal_golem',
    name: 'Billur Heyula',
    hp: 110,
    attack: 18,
    defense: 10,
    expReward: 45,
    drops: [
      { itemId: 'crystal_ore', chance: 0.55 },
      { itemId: 'moonstone', chance: 0.15 }
    ],
    description: 'Billurdan yoğrulmuş gibidir; göz alan bir ışıltıyla parlar.'
  },
  prism_spider: {
    id: 'prism_spider',
    name: 'Işık Ağı Örümceği',
    hp: 75,
    attack: 22,
    defense: 5,
    expReward: 50,
    drops: [
      { itemId: 'crystal_ore', chance: 0.5 },
      { itemId: 'moonstone', chance: 0.2 }
    ],
    description: 'Ağ yerine ışık dokuyan iri bir örümcektir.'
  },

  // Gölge (81-100)
  shadow_lurker: {
    id: 'shadow_lurker',
    name: 'Gölge Pusucusu',
    hp: 150,
    attack: 28,
    defense: 10,
    expReward: 65,
    drops: [
      { itemId: 'shadow_ore', chance: 0.55 },
      { itemId: 'obsidian', chance: 0.15 }
    ],
    description: 'Karanlığa sinip av kollayan bir beladır.'
  },
  void_wraith: {
    id: 'void_wraith',
    name: 'Boşluk Ruhu',
    hp: 100,
    attack: 35,
    defense: 4,
    expReward: 70,
    drops: [
      { itemId: 'shadow_ore', chance: 0.5 },
      { itemId: 'obsidian', chance: 0.2 }
    ],
    description: 'Boşlukta salınan kinli bir ruh; sert vurur ama narindir.'
  },

  // Uçurum (101-120)
  abyss_serpent: {
    id: 'abyss_serpent',
    name: 'Uçurum Yılanı',
    hp: 200,
    attack: 35,
    defense: 14,
    expReward: 85,
    drops: [
      { itemId: 'void_ore', chance: 0.55 },
      { itemId: 'dragon_jade', chance: 0.15 }
    ],
    description: 'Uçurumun bağrında çöreklenmiş kadim bir yılandır.'
  },
  bone_dragon: {
    id: 'bone_dragon',
    name: 'Kemik Ejder',
    hp: 250,
    attack: 40,
    defense: 16,
    expReward: 100,
    drops: [
      { itemId: 'void_ore', chance: 0.6 },
      { itemId: 'dragon_jade', chance: 0.25 }
    ],
    description: 'Eski bir ejderin kemiklerinden dirilmiş dehşet.'
  }
}

/** Kuru Kafa Mağarası'na özgü yaratıklar */
export const SKULL_CAVERN_MONSTERS: Record<string, MonsterDef> = {
  iridium_golem: {
    id: 'iridium_golem',
    name: 'İridyum Heyulası',
    hp: 400,
    attack: 55,
    defense: 30,
    expReward: 150,
    drops: [
      { itemId: 'iridium_ore', chance: 0.6 },
      { itemId: 'prismatic_shard', chance: 0.03 }
    ],
    description: 'İridyumdan dökülmüş, sarsılmaz bir nöbetçidir.'
  },
  skull_serpent: {
    id: 'skull_serpent',
    name: 'Kuru Kafa Yılanı',
    hp: 300,
    attack: 65,
    defense: 14,
    expReward: 130,
    drops: [
      { itemId: 'iridium_ore', chance: 0.5 },
      { itemId: 'shadow_ore', chance: 0.2 }
    ],
    description: 'Kuru Kafa Mağarası’nda havada süzülen zehirli bir yılan.'
  },
  ancient_mummy: {
    id: 'ancient_mummy',
    name: 'Kadim Mumya',
    hp: 550,
    attack: 45,
    defense: 35,
    expReward: 180,
    drops: [
      { itemId: 'iridium_ore', chance: 0.65 },
      { itemId: 'prismatic_shard', chance: 0.05 }
    ],
    description: 'Unutulmuş bir uygarlığın ölümsüz bekçisi.'
  }
}

/** Bölgelere göre yaratık listesi */
export const ZONE_MONSTERS: Record<MineFloorDef['zone'], MonsterDef[]> = {
  shallow: [MONSTERS.mud_worm!, MONSTERS.stone_crab!],
  frost: [MONSTERS.ice_bat!, MONSTERS.ghost!],
  lava: [MONSTERS.fire_bat!, MONSTERS.shadow_warrior!],
  crystal: [MONSTERS.crystal_golem!, MONSTERS.prism_spider!],
  shadow: [MONSTERS.shadow_lurker!, MONSTERS.void_wraith!],
  abyss: [MONSTERS.abyss_serpent!, MONSTERS.bone_dragon!]
}

// ==================== BOSS tanımları ====================

/** BOSS yaratıkları */
export const BOSS_MONSTERS: Record<number, MonsterDef> = {
  20: {
    id: 'mud_golem',
    name: 'Balçık Dev’i',
    hp: 80,
    attack: 8,
    defense: 5,
    expReward: 50,
    drops: [
      { itemId: 'copper_ore', chance: 1.0 },
      { itemId: 'quartz', chance: 1.0 }
    ],
    description: 'Sığ madenin efendisi; koca gövdesi kaya gibidir.'
  },
  40: {
    id: 'frost_queen',
    name: 'Ayaz Hanım',
    hp: 120,
    attack: 12,
    defense: 6,
    expReward: 80,
    drops: [
      { itemId: 'iron_ore', chance: 1.0 },
      { itemId: 'jade', chance: 1.0 }
    ],
    description: 'Buzlu yeraltı sularının hükümranıdır; nefesi bile dondurur.'
  },
  60: {
    id: 'lava_lord',
    name: 'Kor Beyi',
    hp: 180,
    attack: 16,
    defense: 8,
    expReward: 120,
    drops: [
      { itemId: 'gold_ore', chance: 1.0 },
      { itemId: 'ruby', chance: 1.0 }
    ],
    description: 'Ateş katının derinliklerinde oturan alev efendisi.'
  },
  80: {
    id: 'crystal_king',
    name: 'Billur Han',
    hp: 400,
    attack: 32,
    defense: 16,
    expReward: 220,
    drops: [
      { itemId: 'crystal_ore', chance: 1.0 },
      { itemId: 'moonstone', chance: 1.0 }
    ],
    description: 'Sayısız billurun tek irade olmuş hâli; ışığı bile öldürücüdür.'
  },
  100: {
    id: 'shadow_sovereign',
    name: 'Gölge Hükümdarı',
    hp: 600,
    attack: 42,
    defense: 20,
    expReward: 350,
    drops: [
      { itemId: 'shadow_ore', chance: 1.0 },
      { itemId: 'obsidian', chance: 1.0 }
    ],
    description: 'Gölge yarığının en derininde oturan ulu karanlık.'
  },
  120: {
    id: 'abyss_dragon',
    name: 'Uçurum Ejderi',
    hp: 900,
    attack: 55,
    defense: 25,
    expReward: 500,
    drops: [
      { itemId: 'void_ore', chance: 1.0 },
      { itemId: 'dragon_jade', chance: 1.0 }
    ],
    description: 'Dipsiz karanlıkta uyuyan kadim ejder; son sınavın kendisidir.'
  }
}

/** BOSS ek bakır para ödülü */
export const BOSS_MONEY_REWARDS: Record<number, number> = {
  20: 100,
  40: 200,
  60: 500,
  80: 800,
  100: 1500,
  120: 3000
}

/** BOSS ek cevher ödülleri */
export const BOSS_ORE_REWARDS: Record<number, { itemId: string; quantity: number }[]> = {
  20: [{ itemId: 'copper_ore', quantity: 3 }],
  40: [{ itemId: 'iron_ore', quantity: 3 }],
  60: [{ itemId: 'gold_ore', quantity: 3 }],
  80: [{ itemId: 'crystal_ore', quantity: 3 }],
  100: [{ itemId: 'shadow_ore', quantity: 3 }],
  120: [{ itemId: 'void_ore', quantity: 5 }]
}

/** Zayıflatılmış BOSS getirir (yeniden girişte nitelikleri %30 düşer) */
export const getWeakenedBoss = (floor: number): MonsterDef | undefined => {
  const boss = BOSS_MONSTERS[floor]
  if (!boss) return undefined
  return {
    ...boss,
    hp: Math.floor(boss.hp * 0.7),
    attack: Math.floor(boss.attack * 0.7),
    defense: Math.floor(boss.defense * 0.7)
  }
}

// ==================== Kat oluşturma ====================

/** Maden katlarını oluşturur (120 kat) */
const generateFloors = (): MineFloorDef[] => {
  const floors: MineFloorDef[] = []
  const zones: MineFloorDef['zone'][] = ['shallow', 'frost', 'lava', 'crystal', 'shadow', 'abyss']

  for (let i = 1; i <= MAX_MINE_FLOOR; i++) {
    const zoneIndex = Math.floor((i - 1) / 20)
    const zone = zones[zoneIndex]!
    const posInZone = ((i - 1) % 20) + 1
    const posInHalf = ((i - 1) % 10) + 1

    let specialType: MineFloorDef['specialType'] = null
    if (posInZone === 20) specialType = 'boss'
    else if (posInHalf === 3) specialType = 'mushroom'
    else if (posInHalf === 4) specialType = 'dark'
    else if (posInHalf === 6) specialType = 'infested'
    else if (posInHalf === 8) specialType = 'treasure'

    floors.push({
      floor: i,
      zone,
      ores: ZONE_ORES[zone]!,
      monsters: ZONE_MONSTERS[zone]!,
      isSafePoint: i % 5 === 0,
      specialType
    })
  }
  return floors
}

export const MINE_FLOORS = generateFloors()

/** Belirli katın verisini getir */
export const getFloor = (floor: number): MineFloorDef | undefined => {
  return MINE_FLOORS[floor - 1]
}

/** Maden bölgelerinin Türkçe adları */
export const ZONE_NAMES: Record<MineFloorDef['zone'], string> = {
  shallow: 'Sığ Kat · Toprak Taş Kovuğu',
  frost: 'Ayaz Katı · Buzlu Yeraltı Suyu',
  lava: 'Kor Katı · Yer Ateşi Yatağı',
  crystal: 'Billur Katı · Kristal Dolambaç',
  shadow: 'Gölge Katı · Karanlık Yarık',
  abyss: 'Uçurum Katı · Dipsiz Karanlık'
}

// ==================== Kuru Kafa Mağarası ====================

/** Kuru Kafa Mağarası kat verisi (çalışma anında üretilir) */
export interface SkullCavernFloorDef {
  floor: number
  ores: string[]
  monsters: MonsterDef[]
  specialType: MineFloorDef['specialType']
  scaleFactor: number
  isSafePoint: false
}

/** Kuru Kafa Mağarası cevher havuzu */
const SKULL_CAVERN_BASE_ORES = [
  'copper_ore',
  'iron_ore',
  'gold_ore',
  'crystal_ore',
  'shadow_ore',
  'void_ore',
  'quartz',
  'jade',
  'ruby',
  'moonstone',
  'obsidian',
  'dragon_jade',
  'iridium_ore'
]

/** Kuru Kafa Mağarası katı oluşturur */
export const generateSkullCavernFloor = (floor: number): SkullCavernFloorDef => {
  const scaleFactor = 1 + (floor - 1) * 0.03

  // Cevher havuzu: derinlerde iridyum daha sık çıkar
  const ores = [...SKULL_CAVERN_BASE_ORES]
  if (floor > 20) ores.push('iridium_ore')
  if (floor > 50) ores.push('iridium_ore')
  if (floor > 30 && Math.random() < 0.05 + floor * 0.001) {
    ores.push('prismatic_shard')
  }

  // Yaratık havuzu
  const monsterPool: MonsterDef[] = Object.values(SKULL_CAVERN_MONSTERS)
  if (floor > 10) {
    monsterPool.push(MONSTERS.shadow_lurker!, MONSTERS.bone_dragon!)
  }

  // Özel katlar
  let specialType: MineFloorDef['specialType'] = null
  if (floor % 25 === 0) specialType = 'boss'
  else if (floor % 10 === 3) specialType = 'mushroom'
  else if (floor % 10 === 5) specialType = 'infested'
  else if (floor % 10 === 7) specialType = 'treasure'

  return {
    floor,
    ores,
    monsters: monsterPool,
    specialType,
    scaleFactor,
    isSafePoint: false
  }
}

/** Yaratık gücünü ölçekler (Kuru Kafa Mağarası için) */
export const scaleMonster = (monster: MonsterDef, scaleFactor: number): MonsterDef => {
  return {
    ...monster,
    hp: Math.floor(monster.hp * scaleFactor),
    attack: Math.floor(monster.attack * scaleFactor),
    defense: Math.floor(monster.defense * scaleFactor),
    expReward: Math.floor(monster.expReward * scaleFactor)
  }
}

/** Kuru Kafa Mağarası küçük BOSS'unu getirir (her 25 katta, rastgele BOSS ×2 ölçek) */
export const getSkullCavernBoss = (floor: number): MonsterDef | undefined => {
  if (floor % 25 !== 0) return undefined
  const bossFloors = Object.keys(BOSS_MONSTERS).map(Number)
  const randomFloor = bossFloors[Math.floor(Math.random() * bossFloors.length)]!
  const boss = BOSS_MONSTERS[randomFloor]!
  const scaleFactor = 2 * (1 + (floor - 1) * 0.03)
  return scaleMonster(boss, scaleFactor)
}

// ==================== Kare keşif sistemi ====================

import type { MineTile, MineTileData, FloorTileDistribution, FloorSpecialType } from '@/types'
import { GRID_SIZE, GRID_TOTAL, MIN_STAIRS_DISTANCE } from '@/types'

/** 6×6 kenar kare indekslerini getirir (ilk satır / son satır / ilk sütun / son sütun) */
export const getEdgeIndices = (): number[] => {
  const edges: number[] = []
  for (let i = 0; i < GRID_TOTAL; i++) {
    const row = Math.floor(i / GRID_SIZE)
    const col = i % GRID_SIZE
    if (row === 0 || row === GRID_SIZE - 1 || col === 0 || col === GRID_SIZE - 1) {
      edges.push(i)
    }
  }
  return edges
}

/** Komşu kare indekslerini getirir (yukarı, aşağı, sol, sağ) */
export const getAdjacentIndices = (index: number): number[] => {
  const row = Math.floor(index / GRID_SIZE)
  const col = index % GRID_SIZE
  const adj: number[] = []
  if (row > 0) adj.push((row - 1) * GRID_SIZE + col)
  if (row < GRID_SIZE - 1) adj.push((row + 1) * GRID_SIZE + col)
  if (col > 0) adj.push(row * GRID_SIZE + col - 1)
  if (col < GRID_SIZE - 1) adj.push(row * GRID_SIZE + col + 1)
  return adj
}

/** Manhattan uzaklığı */
export const manhattanDistance = (a: number, b: number): number => {
  const ar = Math.floor(a / GRID_SIZE)
  const ac = a % GRID_SIZE
  const br = Math.floor(b / GRID_SIZE)
  const bc = b % GRID_SIZE
  return Math.abs(ar - br) + Math.abs(ac - bc)
}

/** Bomba etki alanındaki indeksleri getirir */
export const getBombIndices = (center: number, bombId: string): number[] => {
  const cr = Math.floor(center / GRID_SIZE)
  const cc = center % GRID_SIZE
  const indices: number[] = []

  if (bombId === 'cherry_bomb') {
    // 3×3
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = cr + dr
        const c = cc + dc
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
          indices.push(r * GRID_SIZE + c)
        }
      }
    }
  } else if (bombId === 'bomb') {
    // Manhattan uzaklığı ≤ 2
    for (let i = 0; i < GRID_TOTAL; i++) {
      if (manhattanDistance(center, i) <= 2) indices.push(i)
    }
  } else if (bombId === 'mega_bomb') {
    // Tüm 36 kare
    for (let i = 0; i < GRID_TOTAL; i++) indices.push(i)
  }

  return indices
}

/** Kat kare dağılımını getirir */
export const getFloorDistribution = (specialType: FloorSpecialType): FloorTileDistribution => {
  switch (specialType) {
    case 'mushroom':
      return {
        oreCount: [1, 2],
        monsterCount: [1, 2],
        trapCount: [0, 1],
        mushroomCount: [6, 8],
        stairsHiddenUntilClear: false
      }
    case 'treasure':
      return {
        oreCount: [2, 3],
        monsterCount: [2, 3],
        trapCount: [1, 1],
        treasureCount: [1, 2],
        stairsHiddenUntilClear: false
      }
    case 'dark':
      return {
        oreCount: [2, 3],
        monsterCount: [2, 2],
        trapCount: [4, 5],
        stairsHiddenUntilClear: false
      }
    case 'infested':
      return {
        oreCount: [1, 2],
        monsterCount: [8, 10],
        trapCount: [0, 0],
        stairsHiddenUntilClear: true
      }
    case 'boss':
      return {
        oreCount: [1, 2],
        monsterCount: [0, 0],
        trapCount: [0, 1],
        bossCount: [1, 1],
        stairsHiddenUntilClear: true
      }
    default:
      // Olağan kat
      return {
        oreCount: [3, 4],
        monsterCount: [3, 4],
        trapCount: [1, 2],
        stairsHiddenUntilClear: false
      }
  }
}

/** Belirli aralıkta rastgele tam sayı [min, max] */
const randInt = (min: number, max: number): number => min + Math.floor(Math.random() * (max - min + 1))

/** Diziden rastgele bir öğe seçer */
const randPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!

/** Katın 6×6 karelerini oluşturur */
export const generateFloorGrid = (
  floorData: MineFloorDef,
  floorNum: number,
  isSkullCavern: boolean,
  scaleFactor: number
): { tiles: MineTile[]; entryIndex: number; totalMonsters: number; stairsUsable: boolean } => {
  const dist = getFloorDistribution(floorData.specialType)
  const tiles: MineTile[] = []

  // 1. 36 gizli / boş kare oluştur
  for (let i = 0; i < GRID_TOTAL; i++) {
    tiles.push({ index: i, type: 'empty', state: 'hidden' })
  }

  // 2. Giriş: rastgele kenar kare
  const edges = getEdgeIndices()
  const entryIndex = randPick(edges)
  tiles[entryIndex]!.state = 'revealed'

  // 3. Merdiveni yerleştir (girişten uzaklık en az MIN_STAIRS_DISTANCE)
  const stairsCandidates = []
  for (let i = 0; i < GRID_TOTAL; i++) {
    if (i !== entryIndex && manhattanDistance(entryIndex, i) >= MIN_STAIRS_DISTANCE) {
      stairsCandidates.push(i)
    }
  }
  const stairsIndex = randPick(stairsCandidates)
  tiles[stairsIndex]!.type = 'stairs'

  // Kullanılmış konumlar
  const used = new Set<number>([entryIndex, stairsIndex])

  /** Rastgele boş bir konuma kare yerleştir */
  const placeRandom = (type: MineTile['type'], data?: MineTileData): number => {
    const candidates = []
    for (let i = 0; i < GRID_TOTAL; i++) {
      if (!used.has(i)) candidates.push(i)
    }
    if (candidates.length === 0) return -1
    const idx = randPick(candidates)
    used.add(idx)
    tiles[idx]!.type = type
    if (data) tiles[idx]!.data = data
    return idx
  }

  // 4. BOSS katıysa boss’u orta bölgeye yerleştir
  const bossCount = dist.bossCount ? randInt(dist.bossCount[0], dist.bossCount[1]) : 0
  let totalMonsters = 0
  if (bossCount > 0) {
    // Merkez 2×2 alan
    const centerCandidates = [2 * GRID_SIZE + 2, 2 * GRID_SIZE + 3, 3 * GRID_SIZE + 2, 3 * GRID_SIZE + 3].filter(i => !used.has(i))

    if (centerCandidates.length > 0) {
      const bossIdx = randPick(centerCandidates)
      used.add(bossIdx)

      // BOSS verisini al
      let bossMonster: MonsterDef | undefined
      if (isSkullCavern) {
        bossMonster = getSkullCavernBoss(floorNum)
      } else {
        const bossId = BOSS_MONSTERS[floorNum]?.id
        const isFirstKill = bossId ? true : true
        bossMonster = isFirstKill ? BOSS_MONSTERS[floorNum] : getWeakenedBoss(floorNum)
      }

      if (bossMonster) {
        tiles[bossIdx]!.type = 'boss'
        tiles[bossIdx]!.data = { monster: bossMonster, isBoss: true }
        totalMonsters++
      }
    }
  }

  // 5. Cevher yerleştir
  const oreCount = randInt(dist.oreCount[0], dist.oreCount[1])
  const orePool = floorData.specialType === 'dark' ? getDarkFloorOres() : floorData.ores
  for (let i = 0; i < oreCount; i++) {
    const oreId = randPick(orePool)
    placeRandom('ore', { oreId, oreQuantity: 1 })
  }

  // 6. Yaratık yerleştir
  const monsterCount = randInt(dist.monsterCount[0], dist.monsterCount[1])
  for (let i = 0; i < monsterCount; i++) {
    if (floorData.monsters.length === 0) break
    let monster = randPick(floorData.monsters)
    if (isSkullCavern && scaleFactor > 1) {
      monster = scaleMonster(monster, scaleFactor)
    }
    placeRandom('monster', { monster })
    totalMonsters++
  }

  // 7. Tuzak yerleştir
  const trapCount = randInt(dist.trapCount[0], dist.trapCount[1])
  for (let i = 0; i < trapCount; i++) {
    const trapDamage = getDarkFloorTrapDamage(floorNum)
    placeRandom('trap', { trapDamage })
  }

  // 8. Sandık yerleştir
  if (dist.treasureCount) {
    const treasureCount = randInt(dist.treasureCount[0], dist.treasureCount[1])
    for (let i = 0; i < treasureCount; i++) {
      const rewards = getTreasureRewards(floorNum)
      placeRandom('treasure', { treasureItems: rewards.items, treasureMoney: rewards.money })
    }
  }

  // 9. Mantar yerleştir
  if (dist.mushroomCount) {
    const mushCount = randInt(dist.mushroomCount[0], dist.mushroomCount[1])
    for (let i = 0; i < mushCount; i++) {
      const items: { itemId: string; quantity: number }[] = []
      if (floorNum <= 40) {
        items.push({ itemId: Math.random() < 0.7 ? 'wild_mushroom' : 'herb', quantity: 1 })
      } else if (floorNum <= 80) {
        items.push({ itemId: Math.random() < 0.5 ? 'wild_mushroom' : 'ginseng', quantity: 1 })
      } else {
        items.push({ itemId: Math.random() < 0.4 ? 'ginseng' : 'wild_mushroom', quantity: 1 })
        if (Math.random() < 0.3) items.push({ itemId: 'herb', quantity: 1 })
      }
      placeRandom('mushroom', { mushroomItems: items })
    }
  }

  // 10. Giriş karesinin komşuları hep gizliyse, istenirse burada açılabilir
  const stairsUsable = !dist.stairsHiddenUntilClear
  return { tiles, entryIndex, totalMonsters, stairsUsable }
}
