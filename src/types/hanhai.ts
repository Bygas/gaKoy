/** Hanhai dükkânı eşya tanımı */
export interface HanhaiShopItemDef {
  itemId: string
  name: string
  price: number
  description: string
  /** Haftalık satın alma sınırı (0 ya da boşsa sınırsız) */
  weeklyLimit?: number
}

/** Kumarhane oyun türü */
export type CasinoGameType = 'roulette' | 'dice' | 'cup' | 'cricket' | 'cardflip' | 'texas' | 'buckshot'

/** Cırcır böceği tanımı */
export interface CricketDef {
  id: string
  name: string
  description: string
}

/** Rulet ödül katsayısı kademesi */
export interface RouletteOutcome {
  label: string
  multiplier: number
  /** Olasılık yüzdesi (tüm değerlerin toplamı 100 olmalı) */
  chance: number
}

// === Hanhai Pokeri ===

export type PokerSuit = 'spade' | 'heart' | 'diamond' | 'club'
export type PokerRank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

export interface PokerCard {
  suit: PokerSuit
  rank: PokerRank
}

export type PokerHandType =
  | 'royal_flush'
  | 'straight_flush'
  | 'four_kind'
  | 'full_house'
  | 'flush'
  | 'straight'
  | 'three_kind'
  | 'two_pair'
  | 'one_pair'
  | 'high_card'

export interface PokerHandResult {
  type: PokerHandType
  /** El öncelik seviyesi (büyük olan daha güçlüdür) */
  typeRank: number
  /** Aynı el türünü karşılaştırmak için sıralama değerleri (azalan) */
  ranks: number[]
  label: string
}

export type TexasStreet = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'
export type PokerActionType = 'check' | 'raise' | 'call' | 'fold' | 'allin'
export type TexasTierId = 'beginner' | 'normal' | 'expert'

export interface TexasTierDef {
  id: TexasTierId
  name: string
  /** Giriş ücreti (= iki tarafın başlangıç fişi) */
  entryFee: number
  /** Büyük kör bahis */
  blind: number
  /** Her el için kesinti (dağıtıcı payı) */
  rake: number
  /** Masaya oturmak için gereken en az para */
  minMoney: number
  /** Her girişte oynanabilecek el sayısı */
  rounds: number
}

export interface TexasSetup {
  playerHole: PokerCard[]
  dealerHole: PokerCard[]
  /** Önceden dağıtılan 5 kart, bileşen bunları aşama aşama gösterir */
  community: PokerCard[]
  /** Masa ayarı */
  tier: TexasTierDef
}

// === Şeytan Ruleti ===

export type ShellType = 'live' | 'blank'

export interface BuckshotSetup {
  shells: ShellType[]
  playerHP: number
  dealerHP: number
}
