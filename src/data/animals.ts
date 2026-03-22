import type { AnimalBuildingDef, AnimalDef, AnimalBuildingType, AnimalType } from '@/types'

/** Ahır ve kümes yapıları */
export const ANIMAL_BUILDINGS: AnimalBuildingDef[] = [
  {
    type: 'coop',
    name: 'Kümes',
    description: 'Tavuk, ördek ve benzeri küçük kanatlıları barındırır.',
    capacity: 4,
    cost: 4000,
    materialCost: [
      { itemId: 'wood', quantity: 100 },
      { itemId: 'bamboo', quantity: 50 }
    ]
  },
  {
    type: 'barn',
    name: 'Büyükbaş Ahırı',
    description: 'İnek, koyun ve benzeri iri çiftlik hayvanlarını barındırır.',
    capacity: 4,
    cost: 6000,
    materialCost: [
      { itemId: 'wood', quantity: 150 },
      { itemId: 'iron_ore', quantity: 20 }
    ]
  },
  {
    type: 'stable',
    name: 'At Ahırı',
    description: 'Atları barındırır; ata binince yolculuk daha hızlı olur.',
    capacity: 1,
    cost: 10000,
    materialCost: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'iron_ore', quantity: 30 }
    ]
  }
]

/** Hayvan tanımları */
export const ANIMAL_DEFS: AnimalDef[] = [
  // ===== Kümes hayvanları (8 tür) =====
  {
    type: 'chicken',
    name: 'Tavuk',
    building: 'coop',
    cost: 800,
    productId: 'egg',
    productName: 'Tavuk Yumurtası',
    produceDays: 1,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'duck',
    name: 'Ördek',
    building: 'coop',
    cost: 1200,
    productId: 'duck_egg',
    productName: 'Ördek Yumurtası',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'rabbit',
    name: 'Tavşan',
    building: 'coop',
    cost: 2000,
    productId: 'rabbit_fur',
    productName: 'Tavşan Yünü',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'goose',
    name: 'Kaz',
    building: 'coop',
    cost: 1500,
    productId: 'goose_egg',
    productName: 'Kaz Yumurtası',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'quail',
    name: 'Bıldırcın',
    building: 'coop',
    cost: 500,
    productId: 'quail_egg',
    productName: 'Bıldırcın Yumurtası',
    produceDays: 1,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'pigeon',
    name: 'Güvercin',
    building: 'coop',
    cost: 1000,
    productId: 'pigeon_egg',
    productName: 'Güvercin Yumurtası',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'silkie',
    name: 'İpek Tavuk',
    building: 'coop',
    cost: 3000,
    productId: 'silkie_egg',
    productName: 'İpek Tavuk Yumurtası',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'peacock',
    name: 'Tavus Kuşu',
    building: 'coop',
    cost: 8000,
    productId: 'peacock_feather',
    productName: 'Tavus Tüyü',
    produceDays: 4,
    friendship: { min: 0, max: 1000 }
  },

  // ===== Ahır hayvanları (11 tür) =====
  {
    type: 'cow',
    name: 'İnek',
    building: 'barn',
    cost: 1500,
    productId: 'milk',
    productName: 'Süt',
    produceDays: 1,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'sheep',
    name: 'Koyun',
    building: 'barn',
    cost: 8000,
    productId: 'wool',
    productName: 'Yün',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'goat',
    name: 'Keçi',
    building: 'barn',
    cost: 4000,
    productId: 'goat_milk',
    productName: 'Keçi Sütü',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'pig',
    name: 'Domuz',
    building: 'barn',
    cost: 16000,
    productId: 'truffle',
    productName: 'Trüf',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'buffalo',
    name: 'Manda',
    building: 'barn',
    cost: 3000,
    productId: 'buffalo_milk',
    productName: 'Manda Sütü',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'yak',
    name: 'Yak',
    building: 'barn',
    cost: 5000,
    productId: 'yak_milk',
    productName: 'Yak Sütü',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'alpaca',
    name: 'Alpaka',
    building: 'barn',
    cost: 6000,
    productId: 'alpaca_wool',
    productName: 'Alpaka Yünü',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'deer',
    name: 'Geyik',
    building: 'barn',
    cost: 12000,
    productId: 'antler_velvet',
    productName: 'Geyik Boynuzu Kadifesi',
    produceDays: 5,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'donkey',
    name: 'Eşek',
    building: 'barn',
    cost: 3000,
    productId: 'donkey_milk',
    productName: 'Eşek Sütü',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'camel',
    name: 'Deve',
    building: 'barn',
    cost: 7000,
    productId: 'camel_milk',
    productName: 'Deve Sütü',
    produceDays: 2,
    friendship: { min: 0, max: 1000 }
  },
  {
    type: 'ostrich',
    name: 'Devekuşu',
    building: 'barn',
    cost: 10000,
    productId: 'ostrich_egg',
    productName: 'Devekuşu Yumurtası',
    produceDays: 3,
    friendship: { min: 0, max: 1000 }
  },

  // ===== At ahırı (1 tür) =====
  {
    type: 'horse',
    name: 'At',
    building: 'stable',
    cost: 5000,
    productId: '',
    productName: '',
    produceDays: 0,
    friendship: { min: 0, max: 1000 }
  }
]

/** Saman eşya kimliği */
export const HAY_ITEM_ID = 'hay'

/** Saman satın alma fiyatı */
export const HAY_PRICE = 50

export const PREMIUM_FEED_ID = 'premium_feed'
export const NOURISHING_FEED_ID = 'nourishing_feed'
export const VITALITY_FEED_ID = 'vitality_feed'

/** Tüm yem tanımları (arayüzde listelemek için) */
export const FEED_DEFS: { id: string; name: string; price: number; description: string }[] = [
  { id: 'hay', name: 'Saman', price: 50, description: 'Temel yem' },
  { id: 'premium_feed', name: 'Seçkin Yem', price: 200, description: 'Neşe +60, dostluk iki kat artar' },
  { id: 'nourishing_feed', name: 'Besleyici Yem', price: 250, description: 'Üretim günü -1' },
  { id: 'vitality_feed', name: 'Canlılık Yemi', price: 300, description: 'Hastalığı %100 iyileştirir' }
]

export const getAnimalDef = (type: string): AnimalDef | undefined => {
  return ANIMAL_DEFS.find(d => d.type === type)
}

export const getBuildingDef = (type: string): AnimalBuildingDef | undefined => {
  return ANIMAL_BUILDINGS.find(b => b.type === type)
}

/** Yapı geliştirmeleri: level 2 = Büyük (kapasite 8), level 3 = Görkemli (kapasite 12) */
export const BUILDING_UPGRADES: {
  type: AnimalBuildingType
  level: number
  name: string
  capacity: number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
}[] = [
  {
    type: 'coop',
    level: 2,
    name: 'Büyük Kümes',
    capacity: 8,
    cost: 10000,
    materialCost: [
      { itemId: 'wood', quantity: 200 },
      { itemId: 'iron_ore', quantity: 15 }
    ]
  },
  {
    type: 'coop',
    level: 3,
    name: 'Görkemli Kümes',
    capacity: 12,
    cost: 20000,
    materialCost: [
      { itemId: 'wood', quantity: 300 },
      { itemId: 'gold_ore', quantity: 10 }
    ]
  },
  {
    type: 'barn',
    level: 2,
    name: 'Büyük Ahır',
    capacity: 8,
    cost: 12000,
    materialCost: [
      { itemId: 'wood', quantity: 250 },
      { itemId: 'iron_ore', quantity: 25 }
    ]
  },
  {
    type: 'barn',
    level: 3,
    name: 'Görkemli Ahır',
    capacity: 12,
    cost: 25000,
    materialCost: [
      { itemId: 'wood', quantity: 400 },
      { itemId: 'gold_ore', quantity: 15 }
    ]
  }
]

export const getBuildingUpgrade = (type: AnimalBuildingType, toLevel: number) => {
  return BUILDING_UPGRADES.find(u => u.type === type && u.level === toLevel)
}

/** Kuluçka eşlemesi: yumurta → hayvan türü + kuluçka günü + ait olduğu yapı */
export const INCUBATION_MAP: Record<string, { animalType: AnimalType; days: number; building: AnimalBuildingType }> = {
  egg: { animalType: 'chicken', days: 5, building: 'coop' },
  duck_egg: { animalType: 'duck', days: 7, building: 'coop' },
  goose_egg: { animalType: 'goose', days: 6, building: 'coop' },
  quail_egg: { animalType: 'quail', days: 4, building: 'coop' },
  pigeon_egg: { animalType: 'pigeon', days: 5, building: 'coop' },
  silkie_egg: { animalType: 'silkie', days: 6, building: 'coop' },
  ostrich_egg: { animalType: 'ostrich', days: 10, building: 'barn' }
}
