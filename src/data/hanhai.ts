import type {
  HanhaiShopItemDef,
  RouletteOutcome,
  CricketDef,
  PokerSuit,
  PokerRank,
  PokerCard,
  PokerHandType,
  PokerHandResult,
  TexasStreet,
  TexasTierId,
  TexasTierDef,
  PokerActionType,
  ShellType
} from '@/types'

/** Uçsuz Hanı dükkân eşyaları */
export const HANHAI_SHOP_ITEMS: HanhaiShopItemDef[] = [
  { itemId: 'hanhai_cactus_seed', name: 'Kaktüs Tohumu', price: 500, description: 'Uzak diyarlardan gelen garip bir bitki tohumu.', weeklyLimit: 5 },
  { itemId: 'hanhai_date_seed', name: 'Hünnap Tohumu', price: 400, description: 'İpek Yolu kervanlarıyla gelen meyve ağacı tohumu.', weeklyLimit: 5 },
  { itemId: 'hanhai_spice', name: 'Çöl Baharatı', price: 300, description: 'Yabancı ellerden gelen hoş kokulu baharat; aşta işe yarar.', weeklyLimit: 3 },
  { itemId: 'hanhai_silk', name: 'İpek Kumaş', price: 800, description: 'İncecik, kaygan ve pek değerli ipek kumaş.', weeklyLimit: 2 },
  { itemId: 'hanhai_turquoise', name: 'Firuze', price: 600, description: 'Batı çöllerinden gelen kıymetli bir taş.', weeklyLimit: 2 },
  { itemId: 'hanhai_map', name: 'Define Haritası', price: 1000, description: 'Issız kırların bir köşesindeki gömüyü işaret eden harita.', weeklyLimit: 1 },
  { itemId: 'mega_bomb_recipe', name: 'Dev Bomba Tarifi', price: 5000, description: 'Söylentiye göre madenin bir katını birden yaracak gizli tarif.', weeklyLimit: 1 }
]

/** Çark oyunu sonuçları */
export const ROULETTE_OUTCOMES: RouletteOutcome[] = [
  { label: 'Boş', multiplier: 0, chance: 72 },
  { label: 'İki Kat', multiplier: 2, chance: 18 },
  { label: 'Üç Kat', multiplier: 3, chance: 7 },
  { label: 'Beş Kat', multiplier: 5, chance: 3 }
]

/** Çark bahis kademeleri */
export const ROULETTE_BET_TIERS = [100, 500, 1000] as const

/** Zar oyunu bahis miktarı */
export const DICE_BET_AMOUNT = 200

/** Günlük azami kumar sayısı */
export const MAX_DAILY_BETS = 10

/** Uçsuz Hanı açma bedeli */
export const HANHAI_UNLOCK_COST = 100000

/** Olasılığa göre çark sonucunu seçer */
export const spinRoulette = (): RouletteOutcome => {
  let roll = Math.random() * 100
  for (const outcome of ROULETTE_OUTCOMES) {
    roll -= outcome.chance
    if (roll <= 0) return outcome
  }
  return ROULETTE_OUTCOMES[0]!
}

/** Zar oyunu: büyük mü küçük mü */
export const rollDice = (): { dice1: number; dice2: number; total: number; isBig: boolean } => {
  const dice1 = Math.floor(Math.random() * 6) + 1
  const dice2 = Math.floor(Math.random() * 6) + 1
  const total = dice1 + dice2
  return { dice1, dice2, total, isBig: total >= 7 }
}

// ==================== Kupa Tahmini ====================

/** Kupa tahmini bahis miktarı */
export const CUP_BET_AMOUNT = 250

/** Kupa tahmini kazanç katsayısı */
export const CUP_WIN_MULTIPLIER = 3

/** Top hangi kupanın altında */
export const playCupRound = (): { correctCup: number } => {
  return { correctCup: Math.floor(Math.random() * 3) }
}

// ==================== Cırcır Dövüşü ====================

/** Cırcır dövüşü bahis miktarı */
export const CRICKET_BET_AMOUNT = 300

/** Cırcır dövüşü kazanç katsayısı */
export const CRICKET_WIN_MULTIPLIER = 2.5

/** Seçilebilir cırcırlar */
export const CRICKETS: CricketDef[] = [
  { id: 'general', name: 'Paşa', description: 'Gövdesi güçlüdür; hem saldırı hem savunmada dengelidir.' },
  { id: 'ironhead', name: 'Demirkafa', description: 'Başı serttir; kafa kafaya çarpışmayı sever.' },
  { id: 'dragonfly', name: 'Gökhan', description: 'Çeviktir; beklenmedik anda atılır.' }
]

/** Cırcır dövüşü: iki taraf da güç atar, yükseği alan kazanır */
export const fightCricket = (): { playerPower: number; opponentPower: number } => {
  const playerPower = Math.floor(Math.random() * 10) + 1
  const opponentPower = Math.floor(Math.random() * 10) + 1
  return { playerPower, opponentPower }
}

// ==================== Kart Aç Hazine Bul ====================

/** Kart açma bahis miktarı */
export const CARD_BET_AMOUNT = 150

/** Kart açma kazanç katsayısı */
export const CARD_WIN_MULTIPLIER = 2.5

/** Toplam kart sayısı */
export const CARD_TOTAL = 5

/** Hazineli kart sayısı */
export const CARD_TREASURE_COUNT = 2

/** Hazine kartlarının yerini üretir */
export const dealCards = (): { treasures: number[] } => {
  const positions = [0, 1, 2, 3, 4]
  // Fisher-Yates karıştırma
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j]!, positions[i]!]
  }
  return { treasures: positions.slice(0, CARD_TREASURE_COUNT) }
}

// ==================== Uçsuz Han Pokeri ====================

/** Masa ayarları */
export const TEXAS_TIERS: TexasTierDef[] = [
  { id: 'beginner', name: 'Acemi Masası', entryFee: 200, blind: 10, rake: 20, minMoney: 500, rounds: 3 },
  { id: 'normal', name: 'Orta Masa', entryFee: 500, blind: 25, rake: 50, minMoney: 2000, rounds: 5 },
  { id: 'expert', name: 'Usta Masası', entryFee: 2000, blind: 100, rake: 200, minMoney: 10000, rounds: 8 }
]

/** Kimliğe göre masa ayarını döndürür */
export const getTexasTier = (id: TexasTierId): TexasTierDef => TEXAS_TIERS.find(t => t.id === id)!

/** Sembol gösterimleri */
export const SUIT_LABELS: Record<PokerSuit, string> = {
  spade: '\u2660',
  heart: '\u2665',
  diamond: '\u2666',
  club: '\u2663'
}

/** Sayı gösterimleri */
export const RANK_LABELS: Record<number, string> = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
}

/** El türü adları */
export const HAND_LABELS: Record<PokerHandType, string> = {
  royal_flush: 'Aslı Floş',
  straight_flush: 'Sıralı Floş',
  four_kind: 'Dörtlü',
  full_house: 'Ful',
  flush: 'Floş',
  straight: 'Seri',
  three_kind: 'Üçlü',
  two_pair: 'Çift Çift',
  one_pair: 'Bir Çift',
  high_card: 'Yüksek Kart'
}

/** El gücü sırası (büyük olan daha kuvvetlidir) */
const HAND_TYPE_RANK: Record<PokerHandType, number> = {
  high_card: 0,
  one_pair: 1,
  two_pair: 2,
  three_kind: 3,
  straight: 4,
  flush: 5,
  full_house: 6,
  four_kind: 7,
  straight_flush: 8,
  royal_flush: 9
}

const ALL_SUITS: PokerSuit[] = ['spade', 'heart', 'diamond', 'club']
const ALL_RANKS: PokerRank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

/** Deste oluşturur ve karıştırır */
export const createShuffledDeck = (): PokerCard[] => {
  const deck: PokerCard[] = []
  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS) {
      deck.push({ suit, rank })
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j]!, deck[i]!]
  }
  return deck
}

/** 5 kartlık eli değerlendirir */
export const evaluateHand = (cards: PokerCard[]): PokerHandResult => {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank)
  const ranks = sorted.map(c => c.rank)

  // Floş kontrolü
  const isFlush = sorted.every(c => c.suit === sorted[0]!.suit)

  // Seri kontrolü
  let isStraight = false
  let straightHighRank = ranks[0]!

  // Normal seri
  if (ranks[0]! - ranks[4]! === 4 && new Set(ranks).size === 5) {
    isStraight = true
  }
  // A-2-3-4-5 küçük seri
  if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
    isStraight = true
    straightHighRank = 5
  }

  // Sıklık sayımı
  const freq = new Map<number, number>()
  for (const r of ranks) {
    freq.set(r, (freq.get(r) ?? 0) + 1)
  }
  const counts = [...freq.values()].sort((a, b) => b - a)
  // Önce sıklığa göre, eşitse karta göre büyükten küçüğe
  const groupedRanks = [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]).map(e => e[0])

  // El türünü belirle
  let type: PokerHandType
  let compareRanks: number[]

  if (isFlush && isStraight && ranks[0] === 14 && ranks[1] === 13) {
    type = 'royal_flush'
    compareRanks = [14]
  } else if (isFlush && isStraight) {
    type = 'straight_flush'
    compareRanks = [straightHighRank]
  } else if (counts[0] === 4) {
    type = 'four_kind'
    compareRanks = groupedRanks
  } else if (counts[0] === 3 && counts[1] === 2) {
    type = 'full_house'
    compareRanks = groupedRanks
  } else if (isFlush) {
    type = 'flush'
    compareRanks = ranks
  } else if (isStraight) {
    type = 'straight'
    compareRanks = [straightHighRank]
  } else if (counts[0] === 3) {
    type = 'three_kind'
    compareRanks = groupedRanks
  } else if (counts[0] === 2 && counts[1] === 2) {
    type = 'two_pair'
    compareRanks = groupedRanks
  } else if (counts[0] === 2) {
    type = 'one_pair'
    compareRanks = groupedRanks
  } else {
    type = 'high_card'
    compareRanks = ranks
  }

  return {
    type,
    typeRank: HAND_TYPE_RANK[type],
    ranks: compareRanks,
    label: HAND_LABELS[type]
  }
}

/** n karttan tüm 5'li kombinasyonları üretir */
const combinations5 = (cards: PokerCard[]): PokerCard[][] => {
  const result: PokerCard[][] = []
  const n = cards.length
  for (let i = 0; i < n - 4; i++) {
    for (let j = i + 1; j < n - 3; j++) {
      for (let k = j + 1; k < n - 2; k++) {
        for (let l = k + 1; l < n - 1; l++) {
          for (let m = l + 1; m < n; m++) {
            result.push([cards[i]!, cards[j]!, cards[k]!, cards[l]!, cards[m]!])
          }
        }
      }
    }
  }
  return result
}

/** İki eli karşılaştırır: >0 = a kazanır, <0 = b kazanır, 0 = berabere */
export const compareHands = (a: PokerHandResult, b: PokerHandResult): number => {
  if (a.typeRank !== b.typeRank) return a.typeRank - b.typeRank
  for (let i = 0; i < Math.min(a.ranks.length, b.ranks.length); i++) {
    if (a.ranks[i]! !== b.ranks[i]!) return a.ranks[i]! - b.ranks[i]!
  }
  return 0
}

/** 7 kart içinden en iyi 5'liyi bulur */
export const evaluateBestHand = (cards: PokerCard[]): PokerHandResult => {
  const combos = combinations5(cards)
  let best = evaluateHand(combos[0]!)
  for (let i = 1; i < combos.length; i++) {
    const hand = evaluateHand(combos[i]!)
    if (compareHands(hand, best) > 0) {
      best = hand
    }
  }
  return best
}

/** Bir el Uçsuz Han pokeri dağıtır */
export const dealTexas = (): {
  playerHole: PokerCard[]
  dealerHole: PokerCard[]
  community: PokerCard[]
} => {
  const deck = createShuffledDeck()
  return {
    playerHole: [deck[0]!, deck[1]!],
    dealerHole: [deck[2]!, deck[3]!],
    community: [deck[4]!, deck[5]!, deck[6]!, deck[7]!, deck[8]!]
  }
}

/** Dağıtıcı yapay zekâ kararı */
export const texasDealerAI = (
  dealerHole: PokerCard[],
  community: PokerCard[],
  street: TexasStreet,
  pot: number,
  dealerStack: number,
  playerBet: number,
  dealerBet: number,
  playerAllIn: boolean,
  blind: number
): { action: PokerActionType; amount: number } => {
  const toCall = playerBet - dealerBet

  // Mevcut el gücü değerlendirmesi
  const visibleCards = [...dealerHole, ...community]
  let strength = 0 // 0=zayıf 1=orta 2=güçlü
  if (visibleCards.length >= 5) {
    const hand = evaluateBestHand(visibleCards)
    if (hand.typeRank >= 3) strength = 2 // üçlü ve üstü
    else if (hand.typeRank >= 1) strength = 1 // çift ve üstü
  } else if (visibleCards.length >= 2) {
    // preflop için kaba değerlendirme
    const r1 = dealerHole[0]!.rank
    const r2 = dealerHole[1]!.rank
    const paired = r1 === r2
    const highCard = Math.max(r1, r2) >= 11
    const suited = dealerHole[0]!.suit === dealerHole[1]!.suit
    if (paired || (highCard && suited)) strength = 2
    else if (highCard || suited) strength = 1
  }

  // Oyuncu all-in ise yalnız gör ya da bırak
  if (playerAllIn) {
    if (toCall <= 0) return { action: 'check', amount: 0 }
    if (strength >= 1 || toCall <= pot * 0.3) return { action: 'call', amount: toCall }
    return Math.random() < 0.3 ? { action: 'call', amount: toCall } : { action: 'fold', amount: 0 }
  }

  // Görmesi gereken bahis yoksa
  if (toCall <= 0) {
    if (strength >= 2 && Math.random() < 0.6) {
      const raiseAmt = Math.min(blind * (street === 'preflop' ? 2 : 3), dealerStack)
      return raiseAmt > 0 ? { action: 'raise', amount: raiseAmt } : { action: 'check', amount: 0 }
    }
    if (strength >= 1 && Math.random() < 0.3) {
      const raiseAmt = Math.min(blind * 2, dealerStack)
      return raiseAmt > 0 ? { action: 'raise', amount: raiseAmt } : { action: 'check', amount: 0 }
    }
    return { action: 'check', amount: 0 }
  }

  // Görmesi gereken bahis varsa
  const potOdds = toCall / (pot + toCall)

  if (strength >= 2) {
    // Güçlü el: gör ya da artır
    if (Math.random() < 0.4 && dealerStack > toCall + blind) {
      const raiseAmt = toCall + Math.min(blind * 2, dealerStack - toCall)
      return { action: 'raise', amount: raiseAmt }
    }
    return { action: 'call', amount: toCall }
  }

  if (strength >= 1) {
    // Orta el: çoğu vakit görür, büyük bahiste bırakabilir
    if (potOdds > 0.5 && street === 'river') {
      return Math.random() < 0.5 ? { action: 'fold', amount: 0 } : { action: 'call', amount: toCall }
    }
    return { action: 'call', amount: toCall }
  }

  // Zayıf el
  if (potOdds > 0.4) {
    return Math.random() < 0.7 ? { action: 'fold', amount: 0 } : { action: 'call', amount: toCall }
  }
  return Math.random() < 0.3 ? { action: 'fold', amount: 0 } : { action: 'call', amount: toCall }
}

// ==================== Şeytan Çarkı ====================

/** Şeytan Çarkı bahis miktarı */
export const BUCKSHOT_BET_AMOUNT = 400

/** Şeytan Çarkı kazanç katsayısı */
export const BUCKSHOT_WIN_MULTIPLIER = 3

/** Başlangıç canı */
export const BUCKSHOT_PLAYER_HP = 2
export const BUCKSHOT_DEALER_HP = 2

/** Gerçek fişek sayısı */
export const BUCKSHOT_LIVE_COUNT = 4

/** Boş fişek sayısı */
export const BUCKSHOT_BLANK_COUNT = 4

/** Tüfeği doldurur ve karıştırır */
export const loadShotgun = (): ShellType[] => {
  const shells: ShellType[] = []
  for (let i = 0; i < BUCKSHOT_LIVE_COUNT; i++) shells.push('live')
  for (let i = 0; i < BUCKSHOT_BLANK_COUNT; i++) shells.push('blank')
  // Fisher-Yates karıştırma
  for (let i = shells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shells[i], shells[j]] = [shells[j]!, shells[i]!]
  }
  return shells
}

/** Dağıtıcının kararını verir */
export const dealerDecide = (shells: ShellType[], currentIndex: number, knowsCurrent: boolean): 'self' | 'opponent' => {
  if (knowsCurrent) {
    return shells[currentIndex] === 'blank' ? 'self' : 'opponent'
  }
  // Kalan fişekleri say
  let liveLeft = 0
  let blankLeft = 0
  for (let i = currentIndex; i < shells.length; i++) {
    if (shells[i] === 'live') liveLeft++
    else blankLeft++
  }
  return blankLeft > liveLeft ? 'self' : 'opponent'
    }
