import type { ToolType, ToolTier } from '@/types'

/** Araç yükseltmesi için gereken malzeme ve ücret */
export interface ToolUpgradeCost {
  fromTier: ToolTier
  toTier: ToolTier
  money: number
  materials: { itemId: string; quantity: number }[]
}

/** Genel araç yükseltme ücretleri (suluk/çapa/kazma/orak/balta) */
const STANDARD_COSTS: ToolUpgradeCost[] = [
  { fromTier: 'basic', toTier: 'iron', money: 2000, materials: [{ itemId: 'copper_bar', quantity: 5 }] },
  { fromTier: 'iron', toTier: 'steel', money: 5000, materials: [{ itemId: 'iron_bar', quantity: 5 }] },
  { fromTier: 'steel', toTier: 'iridium', money: 10000, materials: [{ itemId: 'gold_bar', quantity: 5 }] }
]

/** Suluk yükseltme ücretleri (ilk yükseltmede eşik daha düşüktür) */
const WATERING_CAN_COSTS: ToolUpgradeCost[] = [
  { fromTier: 'basic', toTier: 'iron', money: 1200, materials: [{ itemId: 'copper_bar', quantity: 3 }] },
  { fromTier: 'iron', toTier: 'steel', money: 5000, materials: [{ itemId: 'iron_bar', quantity: 5 }] },
  { fromTier: 'steel', toTier: 'iridium', money: 10000, materials: [{ itemId: 'gold_bar', quantity: 5 }] }
]

/** Her araç için yükseltme ücretleri */
export const TOOL_UPGRADE_COSTS: Record<ToolType, ToolUpgradeCost[]> = {
  wateringCan: WATERING_CAN_COSTS,
  hoe: STANDARD_COSTS,
  pickaxe: STANDARD_COSTS,
  scythe: STANDARD_COSTS,
  axe: STANDARD_COSTS,
  fishingRod: [
    {
      fromTier: 'basic',
      toTier: 'iron',
      money: 2000,
      materials: [
        { itemId: 'copper_bar', quantity: 5 },
        { itemId: 'wood', quantity: 5 }
      ]
    },
    {
      fromTier: 'iron',
      toTier: 'steel',
      money: 5000,
      materials: [
        { itemId: 'iron_bar', quantity: 5 },
        { itemId: 'bamboo', quantity: 5 }
      ]
    },
    {
      fromTier: 'steel',
      toTier: 'iridium',
      money: 10000,
      materials: [
        { itemId: 'gold_bar', quantity: 5 },
        { itemId: 'bamboo', quantity: 10 }
      ]
    }
  ],
  pan: [
    {
      fromTier: 'basic',
      toTier: 'iron',
      money: 2000,
      materials: [
        { itemId: 'copper_bar', quantity: 5 },
        { itemId: 'quartz', quantity: 2 }
      ]
    },
    {
      fromTier: 'iron',
      toTier: 'steel',
      money: 5000,
      materials: [
        { itemId: 'iron_bar', quantity: 5 },
        { itemId: 'quartz', quantity: 3 }
      ]
    },
    {
      fromTier: 'steel',
      toTier: 'iridium',
      money: 10000,
      materials: [
        { itemId: 'gold_bar', quantity: 5 },
        { itemId: 'quartz', quantity: 5 }
      ]
    }
  ]
}

/** Bir aracın mevcut düzeyine göre kullanılabilir yükseltme bilgisini getir */
export const getUpgradeCost = (type: ToolType, currentTier: ToolTier): ToolUpgradeCost | undefined => {
  return TOOL_UPGRADE_COSTS[type].find(c => c.fromTier === currentTier)
}

/** Araç Türkçe adları */
export const TOOL_NAMES: Record<ToolType, string> = {
  wateringCan: 'Suluk',
  hoe: 'Çapa',
  pickaxe: 'Kazma',
  fishingRod: 'Olta',
  scythe: 'Orak',
  axe: 'Balta',
  pan: 'Altın Eleği'
}

/** Araç düzeyi Türkçe adları */
export const TIER_NAMES: Record<ToolTier, string> = {
  basic: 'Başlangıç',
  iron: 'Demir',
  steel: 'Çelik',
  iridium: 'İridyum'
}
