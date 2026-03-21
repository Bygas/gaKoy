import type { PondLevel, PondableFishDef, FishGenetics } from '@/types/fishPond'

// === İnşa / Yükseltme Bedelleri ===

export const POND_BUILD_COST = {
  money: 5000,
  materials: [
    { itemId: 'wood', quantity: 100 },
    { itemId: 'bamboo', quantity: 50 }
  ]
}

export const POND_UPGRADE_COSTS: Record<2 | 3, { money: number; materials: { itemId: string; quantity: number }[] }> = {
  2: {
    money: 10000,
    materials: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'iron_bar', quantity: 5 }
    ]
  },
  3: {
    money: 25000,
    materials: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'iron_bar', quantity: 10 }
    ]
  }
}

// === Kapasite ===

export const POND_CAPACITY: Record<PondLevel, number> = {
  1: 5,
  2: 10,
  3: 20
}

// === Su Kalitesi Parametreleri ===

/** Günlük temel su kalitesi düşüşü */
export const WATER_QUALITY_DECAY_BASE = 2
/** Yoğunluk %50 üstündeyse ek düşüş */
export const WATER_QUALITY_DECAY_HALF = 2
/** Yoğunluk %80 üstündeyse ek düşüş */
export const WATER_QUALITY_DECAY_CROWDED = 3
/** Yem verilmezse ek düşüş */
export const WATER_QUALITY_DECAY_HUNGRY = 5

/** Su kalitesi bunun altına inerse hastalık ihtimali başlar */
export const DISEASE_THRESHOLD = 30
/** Günlük temel hastalanma ihtimali */
export const DISEASE_CHANCE_BASE = 0.05
/** Art arda hasta kalınca ölüm günü */
export const SICK_DEATH_DAYS = 5

/** Yem vermek su kalitesini toparlar */
export const FEED_WATER_RESTORE = 10
/** Su arıtıcısı su kalitesini toparlar */
export const PURIFIER_WATER_RESTORE = 30

/** Üreme döngüsü (gün) */
export const FISH_BREEDING_DAYS = 3

/** Genetik sabitler */
export const GENETICS_FLUCTUATION_BASE = 15
export const POND_MUTATION_JUMP_MIN = 15
export const POND_MUTATION_JUMP_MAX = 30

// === Yetiştirilebilir Balık Türleri (13 tür) ===

const defaultGene = (overrides: Partial<FishGenetics> = {}): FishGenetics => ({
  weight: 50,
  growthRate: 50,
  diseaseRes: 50,
  qualityGene: 30,
  mutationRate: 10,
  ...overrides
})

export const PONDABLE_FISH: PondableFishDef[] = [
  // Dere
  {
    fishId: 'crucian',
    name: 'Gümüş Balığı',
    maturityDays: 3,
    baseProductionRate: 0.4,
    productItemId: 'crucian',
    defaultGenetics: defaultGene({ weight: 30, growthRate: 70, diseaseRes: 60 })
  },
  {
    fishId: 'carp',
    name: 'Sazan',
    maturityDays: 4,
    baseProductionRate: 0.35,
    productItemId: 'carp',
    defaultGenetics: defaultGene({ weight: 45, growthRate: 55, diseaseRes: 55 })
  },
  {
    fishId: 'grass_carp',
    name: 'Ot Sazanı',
    maturityDays: 5,
    baseProductionRate: 0.3,
    productItemId: 'grass_carp',
    defaultGenetics: defaultGene({ weight: 60, growthRate: 45, diseaseRes: 50 })
  },
  // Göl
  {
    fishId: 'golden_carp',
    name: 'Altın Sazan',
    maturityDays: 7,
    baseProductionRate: 0.2,
    productItemId: 'golden_carp',
    defaultGenetics: defaultGene({ weight: 40, growthRate: 35, diseaseRes: 40, qualityGene: 50 })
  },
  {
    fishId: 'koi',
    name: 'Benekli Süs Sazanı',
    maturityDays: 6,
    baseProductionRate: 0.25,
    productItemId: 'koi',
    defaultGenetics: defaultGene({ weight: 45, growthRate: 40, diseaseRes: 45, qualityGene: 55 })
  },
  {
    fishId: 'pond_turtle',
    name: 'Kaplumbağa',
    maturityDays: 8,
    baseProductionRate: 0.15,
    productItemId: 'pond_turtle',
    defaultGenetics: defaultGene({ weight: 70, growthRate: 25, diseaseRes: 80, qualityGene: 40 })
  },
  // Irmak
  {
    fishId: 'bass',
    name: 'Levrek',
    maturityDays: 5,
    baseProductionRate: 0.3,
    productItemId: 'bass',
    defaultGenetics: defaultGene({ weight: 55, growthRate: 50, diseaseRes: 45 })
  },
  {
    fishId: 'catfish',
    name: 'Yayın Balığı',
    maturityDays: 5,
    baseProductionRate: 0.3,
    productItemId: 'catfish',
    defaultGenetics: defaultGene({ weight: 65, growthRate: 45, diseaseRes: 50 })
  },
  {
    fishId: 'yellow_eel',
    name: 'Sarı Yılan Balığı',
    maturityDays: 6,
    baseProductionRate: 0.25,
    productItemId: 'yellow_eel',
    defaultGenetics: defaultGene({ weight: 50, growthRate: 40, diseaseRes: 55, qualityGene: 45 })
  },
  // Şelale
  {
    fishId: 'rainbow_trout',
    name: 'Gökkuşağı Alabalığı',
    maturityDays: 6,
    baseProductionRate: 0.25,
    productItemId: 'rainbow_trout',
    defaultGenetics: defaultGene({ weight: 50, growthRate: 45, diseaseRes: 40, qualityGene: 50 })
  },
  // Bataklık
  {
    fishId: 'mud_loach',
    name: 'Bataklık Çamur Balığı',
    maturityDays: 3,
    baseProductionRate: 0.4,
    productItemId: 'mud_loach',
    defaultGenetics: defaultGene({ weight: 25, growthRate: 65, diseaseRes: 70 })
  },
  {
    fishId: 'pond_snail',
    name: 'Su Salyangozu',
    maturityDays: 2,
    baseProductionRate: 0.5,
    productItemId: 'pond_snail',
    defaultGenetics: defaultGene({ weight: 15, growthRate: 80, diseaseRes: 75, qualityGene: 20 })
  },
  // Maden Ocağı
  {
    fishId: 'cave_blindfish',
    name: 'Mağara Kör Balığı',
    maturityDays: 8,
    baseProductionRate: 0.15,
    productItemId: 'cave_blindfish',
    defaultGenetics: defaultGene({ weight: 35, growthRate: 30, diseaseRes: 30, qualityGene: 60, mutationRate: 25 })
  }
]

/** Balık kimliğine göre yetiştirilebilir türü bulur */
export const getPondableFish = (fishId: string): PondableFishDef | undefined => {
  return PONDABLE_FISH.find(f => f.fishId === fishId)
}

/** Balığın havuzda yetiştirilebilir olup olmadığını kontrol eder */
export const isPondableFish = (fishId: string): boolean => {
  return PONDABLE_FISH.some(f => f.fishId === fishId)
    }
