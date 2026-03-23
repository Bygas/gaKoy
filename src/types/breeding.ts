/** Tohum genetik özellikleri */
export interface SeedGenetics {
  /** Benzersiz kimlik */
  id: string
  /** Bağlı olduğu ürün ID */
  cropId: string
  /** Nesil (tohum makinesi = 0, her çaprazlama +1) */
  generation: number
  /** Tatlılık 0-100 → satış fiyatı bonusu */
  sweetness: number
  /** Verim 0-100 → çift hasat ihtimali */
  yield: number
  /** Dayanıklılık 0-100 → solmayı geciktirir */
  resistance: number
  /** Kararlılık 0-100 → sonraki nesilde sapma azalır */
  stability: number
  /** Mutasyon oranı 1-50 → büyük mutasyon ihtimali */
  mutationRate: number
  /** Ebeveyn A ID (soy takibi için) */
  parentA: string | null
  /** Ebeveyn B ID (soy takibi için) */
  parentB: string | null
  /** Melez tür mü */
  isHybrid: boolean
  /** Melez tür ID (sadece melezlerde) */
  hybridId: string | null
}

/** Yetiştirme tohumu (tohum sandığındaki öğe) */
export interface BreedingSeed {
  genetics: SeedGenetics
  /** Görünen etiket (ürün adı + nesil + yıldız) */
  label: string
}

/** Yetiştirme yuvası */
export interface BreedingSlot {
  /** Ebeveyn A */
  parentA: SeedGenetics | null
  /** Ebeveyn B */
  parentB: SeedGenetics | null
  /** İşlenen gün sayısı */
  daysProcessed: number
  /** Toplam gereken gün */
  totalDays: number
  /** Sonuç tohumu */
  result: SeedGenetics | null
  /** Tamamlandı mı */
  ready: boolean
}

/** Melez tarif tanımı */
export interface HybridDef {
  /** Melez ID */
  id: string
  /** Melez adı */
  name: string
  /** Ebeveyn A ürün ID */
  parentCropA: string
  /** Ebeveyn B ürün ID */
  parentCropB: string
  /** Ortalama tatlılık gereksinimi */
  minSweetness: number
  /** Ortalama verim gereksinimi */
  minYield: number
  /** Ortaya çıkan ürün ID */
  resultCropId: string
  /** Melezin temel gen özellikleri */
  baseGenetics: { sweetness: number; yield: number; resistance: number }
  /** Keşif metni */
  discoveryText: string
}

/** Ansiklopedi kaydı */
export interface CompendiumEntry {
  /** Melez ID */
  hybridId: string
  /** Keşfedildiği yıl */
  discoveredYear: number
  /** En iyi toplam stat */
  bestTotalStats: number
  /** Yetiştirme sayısı */
  timesGrown: number
}

/** Yıldız derecesi 1-5 */
export type SeedStarRating = 1 | 2 | 3 | 4 | 5
