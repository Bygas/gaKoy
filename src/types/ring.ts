/** Ekipman etkisi türleri (yüzük, başlık, ayakkabı ortak) */
export type EquipmentEffectType =
  | 'attack_bonus'
  | 'crit_rate_bonus'
  | 'defense_bonus'
  | 'vampiric'
  | 'max_hp_bonus'
  | 'stamina_reduction'
  | 'mining_stamina'
  | 'farming_stamina'
  | 'fishing_stamina'
  | 'crop_quality_bonus'
  | 'crop_growth_bonus'
  | 'fish_quality_bonus'
  | 'fishing_calm'
  | 'sell_price_bonus'
  | 'shop_discount'
  | 'gift_friendship'
  | 'monster_drop_bonus'
  | 'exp_bonus'
  | 'treasure_find'
  | 'ore_bonus'
  | 'luck'
  | 'travel_speed'

/** Uyumluluk için takma ad */
export type RingEffectType = EquipmentEffectType

/** Tek bir ekipman etkisi */
export interface EquipmentEffect {
  type: EquipmentEffectType
  value: number
}

/** Uyumluluk için takma ad */
export type RingEffect = EquipmentEffect

/** Yüzük tanımı (veri sabiti) */
export interface RingDef {
  id: string
  name: string
  description: string
  effects: RingEffect[]
  /** Üretim tarifi (null = üretilemez) */
  recipe: { itemId: string; quantity: number }[] | null
  /** Üretim için gereken bakır para */
  recipeMoney: number
  /** Elde edilme yolu açıklaması */
  obtainSource: string
  /** Satış fiyatı */
  sellPrice: number
}

/** Sahip olunan yüzük (kayıt için) */
export interface OwnedRing {
  defId: string
}
