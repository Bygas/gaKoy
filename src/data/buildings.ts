import type { FarmhouseLevel } from '@/types'

/** Çiftlik Evi Yükseltme Tanımı */
export interface FarmhouseUpgradeDef {
  level: FarmhouseLevel
  name: string
  description: string
  cost: number
  materialCost: { itemId: string; quantity: number }[]
  benefit: string
}

export const FARMHOUSE_UPGRADES: FarmhouseUpgradeDef[] = [
  {
    level: 1,
    name: 'Kerpiç Ocak Evi',
    description: 'Mutfak genişletilir, yemekler Gaköy usulü daha doyurucu olur (+%20 enerji).',
    cost: 10000,
    materialCost: [{ itemId: 'wood', quantity: 200 }],
    benefit: 'kitchen_bonus'
  },
  {
    level: 2,
    name: 'Avlulu Konak',
    description: 'Geniş bir avlu kurulur, her gece %10 fazladan enerji geri kazanılır.',
    cost: 65000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'iron_ore', quantity: 50 }
    ],
    benefit: 'stamina_bonus'
  },
  {
    level: 3,
    name: 'Yeraltı Şaraplığı',
    description: 'Toprak altına oyulmuş mahzen; içkiler burada dinlenerek değer kazanır.',
    cost: 100000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'gold_ore', quantity: 30 }
    ],
    benefit: 'cellar'
  }
]

/** Mağara açılma şartı — toplam kazanç */
export const CAVE_UNLOCK_EARNINGS = 25000

/** Mantar mağarası günlük üretim ihtimali */
export const CAVE_MUSHROOM_DAILY_CHANCE = 0.6

/** Yarasa mağarası günlük üretim ihtimali */
export const CAVE_FRUIT_BAT_DAILY_CHANCE = 0.5

/** Ambar açma gereksinimi */
export const WAREHOUSE_UNLOCK_MATERIALS = [
  { itemId: 'wood', quantity: 300 },
  { itemId: 'iron_ore', quantity: 20 }
]

/** Sera açma ücreti */
export const GREENHOUSE_UNLOCK_COST = 35000

/** Sera malzeme gereksinimi */
export const GREENHOUSE_MATERIAL_COST = [
  { itemId: 'wood', quantity: 200 },
  { itemId: 'iron_ore', quantity: 30 },
  { itemId: 'gold_ore', quantity: 10 }
]

/** Sera başlangıç tarla sayısı */
export const GREENHOUSE_PLOT_COUNT = 12

/** Sera yükseltme tanımı */
export interface GreenhouseUpgradeDef {
  level: number
  name: string
  plotCount: number
  gridCols: number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
  description: string
}

export const GREENHOUSE_UPGRADES: GreenhouseUpgradeDef[] = [
  {
    level: 1,
    name: 'Sera Genişletme · Birinci Kademe',
    plotCount: 20,
    gridCols: 5,
    cost: 50000,
    materialCost: [
      { itemId: 'wood', quantity: 300 },
      { itemId: 'iron_bar', quantity: 20 }
    ],
    description: '20 tarla (5×4) olacak şekilde genişletilir.'
  },
  {
    level: 2,
    name: 'Sera Genişletme · İkinci Kademe',
    plotCount: 30,
    gridCols: 6,
    cost: 100000,
    materialCost: [
      { itemId: 'wood', quantity: 500 },
      { itemId: 'gold_bar', quantity: 15 }
    ],
    description: '30 tarla (6×5) olacak şekilde genişletilir.'
  }
]

/** Şarap olgunlaşma süresi (gün) */
export const CELLAR_AGING_DAYS = 14

/** Mahzen kapasitesi */
export const CELLAR_MAX_SLOTS = 6

export const getFarmhouseUpgrade = (level: number): FarmhouseUpgradeDef | undefined => {
  return FARMHOUSE_UPGRADES.find(u => u.level === level)
}
