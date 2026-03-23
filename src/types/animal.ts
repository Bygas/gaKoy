import type { Season } from '.'

/** Hayvan barınağı türü */
export type AnimalBuildingType = 'coop' | 'barn' | 'stable'

/** Hayvan türleri */
export type AnimalType =
  | 'chicken'
  | 'duck'
  | 'rabbit'
  | 'goose'
  | 'quail'
  | 'pigeon'
  | 'silkie'
  | 'peacock'
  | 'cow'
  | 'sheep'
  | 'goat'
  | 'pig'
  | 'buffalo'
  | 'yak'
  | 'alpaca'
  | 'deer'
  | 'donkey'
  | 'camel'
  | 'ostrich'
  | 'horse'

/** Hayvan barınağı tanımı */
export interface AnimalBuildingDef {
  type: AnimalBuildingType
  name: string
  description: string
  capacity: number
  cost: number
  materialCost: { itemId: string; quantity: number }[]
}

/** Hayvan tanımı */
export interface AnimalDef {
  type: AnimalType
  name: string
  building: AnimalBuildingType
  cost: number
  productId: string
  productName: string
  produceDays: number
  friendship: { min: number; max: number }
}

/** Hayvan durumu */
export interface Animal {
  id: string
  type: AnimalType
  name: string
  friendship: number
  mood: number
  daysOwned: number
  daysSinceProduct: number
  wasFed: boolean
  /** Bugün verilen yem türü */
  fedWith: string | null
  wasPetted: boolean
  /** Açlık: üst üste beslenmeyen gün sayısı */
  hunger: number
  /** Hasta mı */
  sick: boolean
  /** Üst üste hasta gün sayısı */
  sickDays: number
}

/** Meyve ağacı türleri */
export type FruitTreeType =
  | 'peach_tree'
  | 'lychee_tree'
  | 'mandarin_tree'
  | 'plum_tree'
  | 'apricot_tree'
  | 'pomegranate_tree'
  | 'persimmon_tree'
  | 'hawthorn_tree'

/** Meyve ağacı tanımı */
export interface FruitTreeDef {
  type: FruitTreeType
  name: string
  saplingId: string
  saplingPrice: number
  fruitId: string
  fruitName: string
  fruitSeason: Season
  growthDays: number
  fruitSellPrice: number
}

/** Dikili meyve ağacı */
export interface PlantedFruitTree {
  id: number
  type: FruitTreeType
  growthDays: number
  mature: boolean
  yearAge: number
  todayFruit: boolean
}

/** Çiftlik evi seviyesi */
export type FarmhouseLevel = 0 | 1 | 2 | 3

/** Mağara seçimi */
export type CaveChoice = 'none' | 'mushroom' | 'fruit_bat'

/** Evcil hayvan türü */
export type PetType = 'cat' | 'dog'

/** Evcil hayvan durumu */
export interface PetState {
  type: PetType
  name: string
  friendship: number
  wasPetted: boolean
}

/** Kuluçka durumu */
export interface IncubationState {
  itemId: string
  animalType: AnimalType
  daysLeft: number
  }
