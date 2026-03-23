/** Beceri türü */
export type SkillType = 'farming' | 'foraging' | 'fishing' | 'mining' | 'combat'

/** Beceri ustalığı (5. seviye seçimi) */
export type SkillPerk5 =
  | 'harvester'
  | 'rancher' // Tarım
  | 'lumberjack'
  | 'herbalist' // Toplayıcılık
  | 'fisher'
  | 'trapper' // Balıkçılık
  | 'miner'
  | 'geologist' // Madencilik
  | 'fighter'
  | 'defender' // Savaş

/** Beceri ustalığı (10. seviye seçimi, 5. seviye koluna göre) */
export type SkillPerk10 =
  | 'intensive'
  | 'artisan' // Tarım: harvester kolu
  | 'coopmaster'
  | 'shepherd' // Tarım: rancher kolu
  | 'botanist'
  | 'alchemist' // Toplayıcılık: herbalist kolu
  | 'forester'
  | 'tracker' // Toplayıcılık: lumberjack kolu
  | 'angler'
  | 'aquaculture' // Balıkçılık: fisher kolu
  | 'mariner'
  | 'luremaster' // Balıkçılık: trapper kolu
  | 'prospector'
  | 'blacksmith' // Madencilik: miner kolu
  | 'excavator'
  | 'mineralogist' // Madencilik: geologist kolu
  | 'warrior'
  | 'brute' // Savaş: fighter kolu
  | 'acrobat'
  | 'tank' // Savaş: defender kolu

/** Beceri durumu */
export interface SkillState {
  type: SkillType
  exp: number
  level: number
  perk5: SkillPerk5 | null
  perk10: SkillPerk10 | null
}

/** Balıkçılık mini oyunu derece türü */
export type MiniGameRating = 'perfect' | 'excellent' | 'good' | 'poor'

/** Balıkçılık mini oyunu parametreleri */
export interface MiniGameParams {
  fishName: string
  difficulty: 'easy' | 'normal' | 'hard' | 'legendary'
  hookHeight: number
  fishSpeed: number
  fishChangeDir: number
  gravity: number
  liftSpeed: number
  scoreGain: number
  scoreLoss: number
  timeLimit: number
}

/** Balıkçılık mini oyunu sonucu */
export interface MiniGameResult {
  rating: MiniGameRating
  score: number
  perfect: boolean
}

/** Balık tutma bölgesi */
export type FishingLocation = 'creek' | 'pond' | 'river' | 'mine' | 'waterfall' | 'swamp'

/** Balık tanımı */
export interface FishDef {
  id: string
  name: string
  season: ('spring' | 'summer' | 'autumn' | 'winter')[]
  weather: ('sunny' | 'rainy' | 'stormy' | 'snowy' | 'windy' | 'any')[]
  difficulty: 'easy' | 'normal' | 'hard' | 'legendary'
  sellPrice: number
  description: string
  /** Balık tutma bölgesi (varsayılan: creek) */
  location?: FishingLocation
  /** Mini oyunda balığın hareket hızı (zorluk varsayılanını ezer) */
  miniGameSpeed?: number
  /** Mini oyunda balığın yön değiştirme olasılığı (zorluk varsayılanını ezer) */
  miniGameDirChange?: number
}

/** Maden katı tanımı */
export interface MineFloorDef {
  floor: number
  zone: 'shallow' | 'frost' | 'lava' | 'crystal' | 'shadow' | 'abyss'
  ores: string[] // Elde edilebilecek maden ID'leri
  monsters: MonsterDef[]
  isSafePoint: boolean // Güvenli nokta mı (her 5 katta bir)
  specialType: 'mushroom' | 'treasure' | 'infested' | 'dark' | 'boss' | null // Özel kat türü
}

/** Yaratık tanımı */
export interface MonsterDef {
  id: string
  name: string
  hp: number
  attack: number // Verdiği HP hasarı
  defense: number
  expReward: number // Kesildiğinde verilen savaş deneyimi
  drops: { itemId: string; chance: number }[]
  description: string
}

/** Savaş durumu */
export interface CombatState {
  monster: MonsterDef
  monsterHp: number
  round: number
  log: string[]
  isBoss: boolean
}

/** Savaş eylemi */
export type CombatAction = 'attack' | 'defend' | 'flee'

/** Yemek tarifi tanımı */
export interface RecipeDef {
  id: string
  name: string
  ingredients: { itemId: string; quantity: number }[]
  effect: {
    staminaRestore: number
    healthRestore?: number
    buff?: {
      type: 'fishing' | 'mining' | 'giftBonus' | 'speed' | 'defense' | 'luck' | 'farming' | 'stamina' | 'all_skills'
      value: number // Yüzde ya da katsayı
      description: string
    }
  }
  unlockSource: string // Açılma kaynağının açıklaması
  description: string
  /** Bu yemeği pişirmek için gereken beceri seviyesi */
  requiredSkill?: { type: SkillType; level: number }
}
