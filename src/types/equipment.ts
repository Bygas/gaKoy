
import type { EquipmentEffect } from './ring'

/** Başlık tanımı */
export interface HatDef {
  id: string
  name: string
  description: string
  effects: EquipmentEffect[]
  /** Dükkândan satın alma fiyatı (null = satın alınamaz, üretim gerekir) */
  shopPrice: number | null
  /** Üretim tarifi (null = üretilemez) */
  recipe: { itemId: string; quantity: number }[] | null
  /** Üretim için gereken para */
  recipeMoney: number
  /** Elde edilme yolu */
  obtainSource: string
  /** Satış fiyatı */
  sellPrice: number
}

/** Sahip olunan başlık */
export interface OwnedHat {
  defId: string
}

/** Ayakkabı tanımı */
export interface ShoeDef {
  id: string
  name: string
  description: string
  effects: EquipmentEffect[]
  /** Dükkândan satın alma fiyatı (null = satın alınamaz, üretim gerekir) */
  shopPrice: number | null
  /** Üretim tarifi (null = üretilemez) */
  recipe: { itemId: string; quantity: number }[] | null
  /** Üretim için gereken para */
  recipeMoney: number
  /** Elde edilme yolu */
  obtainSource: string
  /** Satış fiyatı */
  sellPrice: number
}

/** Sahip olunan ayakkabı */
export interface OwnedShoe {
  defId: string
}
