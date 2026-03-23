/** Canavar avı hedef tanımı */
export interface MonsterGoalDef {
  monsterId: string
  monsterName: string
  zone: string
  killTarget: number
  reward: {
    money?: number
    items?: { itemId: string; quantity: number }[]
  }
  description: string
}

/** Lonca bağış eşyası tanımı */
export interface GuildDonationDef {
  itemId: string
  points: number
}

/** Lonca seviye tanımı */
export interface GuildLevelDef {
  level: number
  expRequired: number
}

/** Lonca dükkânı eşya tanımı */
export interface GuildShopItemDef {
  itemId: string
  name: string
  price: number
  contributionCost?: number
  description: string
  /** Açılmak için gereken lonca seviyesi */
  unlockGuildLevel?: number
  /** Günlük satın alma sınırı */
  dailyLimit?: number
  /** Haftalık satın alma sınırı */
  weeklyLimit?: number
  /** Toplam kalıcı satın alma sınırı */
  totalLimit?: number
  /** Ekipman türü (satın alındığında ilgili slota eklenir) */
  equipType?: 'weapon' | 'ring' | 'hat' | 'shoe'
  /** Gerekli malzemeler */
  materials?: { itemId: string; quantity: number }[]
}
