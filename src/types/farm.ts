import type { FertilizerType } from './processing'
import type { SeedGenetics } from './breeding'
import type { Season } from './game'

/** Tarla durumu */
export type PlotState = 'wasteland' | 'tilled' | 'planted' | 'growing' | 'harvestable'

/** Çiftlik tarlası */
export interface FarmPlot {
  id: number
  state: PlotState
  /** Ekili ürün ID */
  cropId: string | null
  /** Geçen büyüme gün sayısı */
  growthDays: number
  /** Bugün sulandı mı */
  watered: boolean
  /** Üst üste sulanmayan gün sayısı */
  unwateredDays: number
  /** Uygulanan gübre türü */
  fertilizer: FertilizerType | null
  /** Çoklu hasat ürünlerde hasat sayısı */
  harvestCount: number
  /** Dev mahsul grup ID (null değilse dev mahsul parçasıdır) */
  giantCropGroup: number | null
  /** Tohum genetik özellikleri */
  seedGenetics: SeedGenetics | null
  /** Zararlı istilası var mı */
  infested: boolean
  /** Üst üste zararlı gün sayısı */
  infestedDays: number
  /** Yabani ot var mı */
  weedy: boolean
  /** Üst üste yabani ot gün sayısı */
  weedyDays: number
}

/** Ürün tanımı (veri yapısı) */
export interface CropDef {
  id: string
  name: string
  seedId: string
  season: Season[]
  growthDays: number
  sellPrice: number
  seedPrice: number
  /** Derin sulama gerektirir mi */
  deepWatering: boolean
  description: string
  /** Çoklu hasat ürünü mü */
  regrowth?: boolean
  /** Yeniden büyüme süresi */
  regrowthDays?: number
  /** Maksimum hasat sayısı */
  maxHarvests?: number
  /** Dev mahsule dönüşebilir mi */
  giantCropEligible?: boolean
}

/** Çiftlik boyutu */
export type FarmSize = 4 | 6 | 8
