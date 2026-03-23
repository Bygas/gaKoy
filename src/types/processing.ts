import type { Quality } from './item'
import type { FishingLocation } from './skill'

/** Üretim makinesi türü */
export type MachineType =
  | 'wine_workshop'
  | 'sauce_jar'
  | 'bee_house'
  | 'oil_press'
  | 'mayo_maker'
  | 'seed_maker'
  | 'crystal_duplicator'
  | 'smoker'
  | 'dehydrator'
  | 'recycler'
  | 'cheese_press'
  | 'loom'
  | 'furnace'
  | 'charcoal_kiln'
  | 'mill'
  | 'worm_bin'
  | 'tea_maker'
  | 'tofu_press'
  | 'herb_grinder'
  | 'incense_maker'

/** Üretim makinesi tanımı */
export interface ProcessingMachineDef {
  id: MachineType
  name: string
  description: string
  craftCost: { itemId: string; quantity: number }[]
  craftMoney: number
  /** Tamamlandıktan sonra ürünü kendiliğinden toplar (varsayılan false, elle toplamak gerekir) */
  autoCollect?: boolean
}

/** Üretim tarifi tanımı */
export interface ProcessingRecipeDef {
  id: string
  machineType: MachineType
  name: string
  /** Girdi eşya kimliği (null = girdi gerekmez, örn. arı kovanı) */
  inputItemId: string | null
  inputQuantity: number
  outputItemId: string
  outputQuantity: number
  /** İşleme gün sayısı */
  processingDays: number
  description: string
}

/** Çalışma anındaki üretim yuvası */
export interface ProcessingSlot {
  machineType: MachineType
  recipeId: string | null
  inputItemId: string | null
  inputQuality?: Quality
  daysProcessed: number
  totalDays: number
  ready: boolean
}

/** Sulayıcı türü */
export type SprinklerType = 'bamboo_sprinkler' | 'copper_sprinkler' | 'gold_sprinkler'

/** Sulayıcı tanımı */
export interface SprinklerDef {
  id: SprinklerType
  name: string
  description: string
  range: 4 | 8 | 24
  craftCost: { itemId: string; quantity: number }[]
  craftMoney: number
}

/** Gübre türü */
export type FertilizerType =
  | 'basic_fertilizer'
  | 'quality_fertilizer'
  | 'speed_gro'
  | 'deluxe_speed_gro'
  | 'retaining_soil'
  | 'quality_retaining_soil'

/** Gübre tanımı */
export interface FertilizerDef {
  id: FertilizerType
  name: string
  description: string
  /** Kalite artış ihtimali bonusu (0.2 = +20%) */
  qualityBonus?: number
  /** Büyüme hızı bonus yüzdesi (0.25 = +25%) */
  growthSpeedup?: number
  /** Gece boyunca suyu koruma ihtimali (0.5 = %50) */
  retainChance?: number
  craftCost: { itemId: string; quantity: number }[]
  craftMoney: number
  shopPrice: number | null
}

/** Yem türü */
export type BaitType = 'standard_bait' | 'wild_bait' | 'magic_bait' | 'deluxe_bait' | 'targeted_bait'

/** Yem tanımı */
export interface BaitDef {
  id: BaitType
  name: string
  description: string
  /** Davranış olasılığı düzeltmesi (calm/struggle/dash artış-azalışı) */
  behaviorModifier?: { calm: number; struggle: number; dash: number }
  /** İkili av yakalama ihtimali */
  doubleCatchChance?: number
  /** Mevsim kısıtını yok sayar mı */
  ignoresSeason?: boolean
  /** Debelenme başarı oranı bonusu */
  struggleBonus?: number
  /** Zor balık ağırlık çarpanı */
  hardWeightMult?: number
  /** Efsanevi balık ağırlık çarpanı */
  legendaryWeightMult?: number
  craftCost: { itemId: string; quantity: number }[]
  craftMoney: number
  shopPrice: number | null
}

/** Şamandıra türü */
export type TackleType = 'spinner' | 'trap_bobber' | 'cork_bobber' | 'quality_bobber' | 'lead_bobber'

/** Şamandıra tanımı */
export interface TackleDef {
  id: TackleType
  name: string
  description: string
  maxDurability: number
  requiredRodTier: 'iron' | 'steel' | 'iridium'
  /** Dayanıklılık tüketimi indirimi (0.5 = -50%) */
  staminaReduction?: number
  /** Misina koptuğunda ek şans hakkı sayısı */
  extraBreakChance?: number
  /** Debelenme başarı oranı bonusu */
  struggleBonus?: number
  /** Balık kalite artış kademesi */
  qualityBoost?: number
  /** Tehlikeli davranış olasılığı indirimi (0.1 = dash/surge için ayrı ayrı -10%) */
  dangerReduction?: number
  craftCost: { itemId: string; quantity: number }[]
  craftMoney: number
  shopPrice: number | null
}

/** Bomba tanımı */
export interface BombDef {
  id: string
  name: string
  description: string
  oreMultiplier: number
  clearsMonster: boolean
  craftCost: { itemId: string; quantity: number }[]
  craftMoney: number
  shopPrice: number | null
}

/** Yaban ağacı türü */
export type WildTreeType = 'pine' | 'camphor' | 'mulberry'

/** Yaban ağacı tanımı */
export interface WildTreeDef {
  type: WildTreeType
  name: string
  seedItemId: string
  growthDays: number
  tapProduct: string
  tapCycleDays: number
  tapProductName: string
}

/** Dikilmiş yaban ağacı (çalışma anı durumu) */
export interface PlantedWildTree {
  id: number
  type: WildTreeType
  growthDays: number
  mature: boolean
  hasTapper: boolean
  tapDaysElapsed: number
  tapReady: boolean
  /** Kesilmiş olma sayısı (>=3 olursa ağaç yok olur) */
  chopCount: number
}

/** Kerevit kapanı durumu */
export interface CrabPotState {
  location: FishingLocation
  hasBait: boolean
}

/** Kese eşyası tanımı */
export interface WalletItemDef {
  id: string
  name: string
  description: string
  effect: { type: string; value: number }
  unlockCondition: string
}
