/** Günlük pazar düzeni — mevsim katsayısı × arz-talep katsayısı × rastgele dalgalanma (±%5), sınır [0.5, 2.0] */

// === Türler ===

export type MarketCategory = 'crop' | 'fish' | 'animal_product' | 'processed' | 'fruit' | 'ore' | 'gem'
export type MarketTrend = 'boom' | 'rising' | 'stable' | 'falling' | 'crash'

export interface CategoryMarketInfo {
  category: MarketCategory
  multiplier: number
  trend: MarketTrend
}

// === Sabitler ===

const MARKET_CATEGORIES: MarketCategory[] = ['crop', 'fish', 'animal_product', 'processed', 'fruit', 'ore', 'gem']

/** Mevsim katsayıları: [ilkbahar, yaz, güz, kış] */
const SEASON_COEFFICIENTS: Record<MarketCategory, [number, number, number, number]> = {
  crop: [1.0, 0.9, 0.85, 1.2], // Hasat zamanı en ucuz, kışın en pahalı
  fish: [1.0, 0.9, 1.0, 1.15], // Yazın balık bol olur, kışın değerlenir
  animal_product: [1.0, 0.95, 1.0, 1.1], // Kışın hayvansal ürüne talep artar
  processed: [0.95, 1.0, 1.1, 1.05], // Güzde işlenmiş mallar daha çok aranır
  fruit: [1.1, 0.85, 0.9, 1.2], // Yazın meyve bol, kışın kıymetli
  ore: [1.0, 1.05, 1.0, 0.9], // Kışın maden bol bulunduğundan ucuzlar
  gem: [1.0, 1.05, 1.0, 0.9] // Madenle aynı gidiş
}

/** Arz-talep eşikleri: son 7 günde sevk edilen toplam miktar */
const SUPPLY_THRESHOLDS: Record<MarketCategory, { low: number; mid: number; high: number }> = {
  crop: { low: 20, mid: 50, high: 100 },
  fish: { low: 10, mid: 25, high: 50 },
  animal_product: { low: 10, mid: 25, high: 50 },
  processed: { low: 5, mid: 15, high: 30 },
  fruit: { low: 10, mid: 25, high: 50 },
  ore: { low: 15, mid: 40, high: 80 },
  gem: { low: 3, mid: 8, high: 15 }
}

export const TREND_NAMES: Record<MarketTrend, string> = {
  boom: 'Coşkun Artış',
  rising: 'Yükselişte',
  stable: 'Dengede',
  falling: 'Düşüşte',
  crash: 'Sert Çöküş'
}

export const TREND_COLORS: Record<MarketTrend, string> = {
  boom: 'text-danger border-danger/30',
  rising: 'text-success border-success/30',
  stable: 'text-muted border-muted/20',
  falling: 'text-warning border-warning/30',
  crash: 'text-danger border-danger/30'
}

export const MARKET_CATEGORY_NAMES: Record<MarketCategory, string> = {
  crop: 'Tarla Ürünü',
  fish: 'Balık',
  animal_product: 'Hayvansal Ürün',
  processed: 'İşlenmiş Mal',
  fruit: 'Meyve',
  ore: 'Maden',
  gem: 'Mücevher'
}

// === Sözde rastgelelik ===

const seededRandom = (seed: number): (() => number) => {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

// === İç hesaplar ===

const _isMarketCategory = (category: string): category is MarketCategory => {
  return MARKET_CATEGORIES.includes(category as MarketCategory)
}

const _clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/** Doğrusal ara değer hesabı */
const _lerp = (v: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => {
  const t = (v - fromMin) / (fromMax - fromMin)
  return toMin + t * (toMax - toMin)
}

/** Arz-talep katsayısı: sevk arttıkça fiyat düşer */
const _computeSupplyDemand = (category: MarketCategory, recentVolume: number): number => {
  const th = SUPPLY_THRESHOLDS[category]
  if (recentVolume <= 0) return 1.1
  if (recentVolume < th.low) return _lerp(recentVolume, 0, th.low, 1.1, 1.0)
  if (recentVolume < th.mid) return _lerp(recentVolume, th.low, th.mid, 1.0, 0.9)
  if (recentVolume < th.high) return _lerp(recentVolume, th.mid, th.high, 0.9, 0.8)
  return 0.8
}

/** Üç çarpan hesabı: mevsim × arz-talep × rastgelelik (±%5) */
const _computeMultiplier = (category: MarketCategory, seasonIndex: number, rng: () => number, recentVolume: number): number => {
  const season = SEASON_COEFFICIENTS[category][seasonIndex] ?? 1.0
  const supply = _computeSupplyDemand(category, recentVolume)
  const random = 0.95 + rng() * 0.1 // 0.95 ~ 1.05
  return _clamp(Math.round(season * supply * random * 100) / 100, 0.5, 2.0)
}

const _toTrend = (multiplier: number): MarketTrend => {
  if (multiplier >= 1.4) return 'boom'
  if (multiplier > 1.05) return 'rising'
  if (multiplier <= 0.6) return 'crash'
  if (multiplier < 0.95) return 'falling'
  return 'stable'
}

// === Açık API ===

/** Bir kategorinin o günkü fiyat katsayısını getirir (dalgalanmayan türlerde 1.0 döner) */
export const getMarketMultiplier = (
  category: string,
  year: number,
  seasonIndex: number,
  day: number,
  recentCategoryVolume?: number
): number => {
  if (!_isMarketCategory(category)) return 1.0
  const info = getDailyMarketInfo(
    year,
    seasonIndex,
    day,
    recentCategoryVolume !== undefined ? { [category]: recentCategoryVolume } : undefined
  )
  return info.find(i => i.category === category)?.multiplier ?? 1.0
}

/** Önbellek */
let _cache: { key: string; data: CategoryMarketInfo[] } | null = null

/** Günün tüm kategori pazar bilgisini getirir */
export const getDailyMarketInfo = (
  year: number,
  seasonIndex: number,
  day: number,
  recentShipping?: Partial<Record<MarketCategory, number>>
): CategoryMarketInfo[] => {
  const shipping = recentShipping ?? {}
  const key = `${year}-${seasonIndex}-${day}-${JSON.stringify(shipping)}`
  if (_cache?.key === key) return _cache.data

  const seed = year * 10000 + seasonIndex * 1000 + day * 37 + 7777
  const rng = seededRandom(seed)

  const data: CategoryMarketInfo[] = MARKET_CATEGORIES.map(category => {
    const volume = shipping[category] ?? 0
    const multiplier = _computeMultiplier(category, seasonIndex, rng, volume)
    return { category, multiplier, trend: _toTrend(multiplier) }
  })

  _cache = { key, data }
  return data
}
