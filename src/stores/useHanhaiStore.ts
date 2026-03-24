import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  HANHAI_SHOP_ITEMS,
  MAX_DAILY_BETS,
  HANHAI_UNLOCK_COST,
  spinRoulette,
  rollDice,
  ROULETTE_BET_TIERS,
  DICE_BET_AMOUNT,
  CUP_BET_AMOUNT,
  CUP_WIN_MULTIPLIER,
  playCupRound,
  CRICKET_BET_AMOUNT,
  CRICKET_WIN_MULTIPLIER,
  fightCricket,
  CARD_BET_AMOUNT,
  CARD_WIN_MULTIPLIER,
  dealCards,
  getTexasTier,
  dealTexas,
  BUCKSHOT_BET_AMOUNT,
  BUCKSHOT_WIN_MULTIPLIER,
  BUCKSHOT_PLAYER_HP,
  BUCKSHOT_DEALER_HP,
  loadShotgun
} from '@/data/hanhai'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { useGameStore } from './useGameStore'
import { addLog } from '@/composables/useGameLog'
import type { TexasSetup, TexasTierId, BuckshotSetup } from '@/types'

export const useHanhaiStore = defineStore('hanhai', () => {
  /** Hanhai yolu açıldı mı */
  const unlocked = ref(false)
  /** Bugünkü kumar sayısı */
  const casinoBetsToday = ref(0)
  /** Bu haftaki dükkân alımları { itemId: count } */
  const weeklyPurchases = ref<Record<string, number>>({})

  const canBet = computed(() => casinoBetsToday.value < MAX_DAILY_BETS)
  const betsRemaining = computed(() => MAX_DAILY_BETS - casinoBetsToday.value)

  /** Hanhai yolunu aç */
  const unlockHanhai = (): { success: boolean; message: string } => {
    if (unlocked.value) return { success: false, message: 'Hanhai yolu zaten açık.' }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(HANHAI_UNLOCK_COST)) {
      return { success: false, message: `Akçe yetmiyor (${HANHAI_UNLOCK_COST} gerekir).` }
    }
    unlocked.value = true
    addLog('gaKöy’den Hanhai diyarına uzanan ticaret yolu açıldı! Yeni serüvenler seni bekler.')
    return { success: true, message: 'Hanhai ticaret yolu açıldı!' }
  }

  /** Bir malın bu hafta kalan alım hakkını sorgula */
  const getWeeklyRemaining = (itemId: string): number => {
    const item = HANHAI_SHOP_ITEMS.find(i => i.itemId === itemId)
    if (!item?.weeklyLimit) return Infinity
    return Math.max(0, item.weeklyLimit - (weeklyPurchases.value[itemId] ?? 0))
  }

  /** Kervansaray dükkânından mal al */
  const buyShopItem = (itemId: string): { success: boolean; message: string } => {
    const item = HANHAI_SHOP_ITEMS.find(i => i.itemId === itemId)
    if (!item) return { success: false, message: 'Böyle bir mal yok.' }
    if (item.weeklyLimit && (weeklyPurchases.value[itemId] ?? 0) >= item.weeklyLimit) {
      return { success: false, message: `${item.name} için bu haftaki sınır doldu.` }
    }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(item.price)) {
      return { success: false, message: 'Akçe yetmiyor.' }
    }
    const inventoryStore = useInventoryStore()
    if (!inventoryStore.addItem(item.itemId, 1)) {
      playerStore.earnMoney(item.price)
      return { success: false, message: 'Heybe dolu, satın alma yapılamadı.' }
    }
    weeklyPurchases.value[itemId] = (weeklyPurchases.value[itemId] ?? 0) + 1
    return { success: true, message: `${item.name} satın alındı.` }
  }

  /** Define haritası kullan */
  const useTreasureMap = (): { success: boolean; message: string; rewards: { name: string; quantity: number }[] } => {
    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem('hanhai_map')) {
      return { success: false, message: 'Define haritan yok.', rewards: [] }
    }
    const playerStore = usePlayerStore()
    const roll = Math.random()
    const rewards: { itemId: string; name: string; quantity: number }[] = []
    if (roll < 0.05) {
      playerStore.earnMoney(5000)
      rewards.push({ itemId: '', name: '5000 akçe', quantity: 1 })
      rewards.push({ itemId: 'hanhai_turquoise', name: 'Firuze', quantity: 2 })
      inventoryStore.addItem('hanhai_turquoise', 2)
    } else if (roll < 0.2) {
      playerStore.earnMoney(2000)
      rewards.push({ itemId: '', name: '2000 akçe', quantity: 1 })
      rewards.push({ itemId: 'hanhai_spice', name: 'Doğu Baharatı', quantity: 3 })
      inventoryStore.addItem('hanhai_spice', 3)
    } else if (roll < 0.45) {
      playerStore.earnMoney(1000)
      rewards.push({ itemId: '', name: '1000 akçe', quantity: 1 })
      rewards.push({ itemId: 'hanhai_silk', name: 'İpek', quantity: 1 })
      inventoryStore.addItem('hanhai_silk', 1)
    } else {
      playerStore.earnMoney(500)
      rewards.push({ itemId: '', name: '500 akçe', quantity: 1 })
    }
    const rewardText = rewards.map(r => r.name + (r.quantity > 1 ? `×${r.quantity}` : '')).join('、')
    addLog(`Define haritası açıldı, şu ganimetler bulundu: ${rewardText}!`)
    return { success: true, message: `Arayış başarıyla sonuçlandı! Elde edilenler: ${rewardText}`, rewards }
  }

  /** Uğur çarkı oyna */
  const playRoulette = (betTier: number): { success: boolean; message: string; multiplier: number; winnings: number } => {
    if (!canBet.value) return { success: false, message: 'Bugünkü oyun hakkın tükendi.', multiplier: 0, winnings: 0 }
    if (!ROULETTE_BET_TIERS.includes(betTier as (typeof ROULETTE_BET_TIERS)[number])) {
      return { success: false, message: 'Geçersiz bahis miktarı.', multiplier: 0, winnings: 0 }
    }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(betTier)) {
      return { success: false, message: 'Akçe yetmiyor.', multiplier: 0, winnings: 0 }
    }
    casinoBetsToday.value++
    const outcome = spinRoulette()
    const winnings = Math.floor(betTier * outcome.multiplier)
    if (winnings > 0) {
      playerStore.earnMoney(winnings)
    }
    if (outcome.multiplier === 0) {
      addLog(`Uğur çarkı "${outcome.label}" üstünde durdu, ${betTier} akçe kaybettin.`)
    } else {
      addLog(`Uğur çarkı "${outcome.label}" üstünde durdu! ${winnings} akçe kazandın!`)
    }
    return { success: true, message: `Çark "${outcome.label}" üstünde durdu`, multiplier: outcome.multiplier, winnings }
  }

  /** Zar oyna (büyük-küçük tahmini) */
  const playDice = (
    guessBig: boolean
  ): { success: boolean; message: string; dice1: number; dice2: number; won: boolean; winnings: number } => {
    if (!canBet.value) return { success: false, message: 'Bugünkü oyun hakkın tükendi.', dice1: 0, dice2: 0, won: false, winnings: 0 }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(DICE_BET_AMOUNT)) {
      return { success: false, message: 'Akçe yetmiyor.', dice1: 0, dice2: 0, won: false, winnings: 0 }
    }
    casinoBetsToday.value++
    const result = rollDice()
    const won = guessBig === result.isBig
    const winnings = won ? DICE_BET_AMOUNT * 2 : 0
    if (won) {
      playerStore.earnMoney(winnings)
    }
    const guessText = guessBig ? 'büyük' : 'küçük'
    const resultText = result.isBig ? 'büyük' : 'küçük'
    if (won) {
      addLog(`Zarlar ${result.dice1}+${result.dice2}=${result.total} (${resultText}) geldi; ${guessText} dedin ve ${winnings} akçe kazandın!`)
    } else {
      addLog(`Zarlar ${result.dice1}+${result.dice2}=${result.total} (${resultText}) geldi; ${guessText} dedin ve ${DICE_BET_AMOUNT} akçe kaybettin.`)
    }
    return { success: true, message: won ? 'Kazandın!' : 'Kaybettin…', dice1: result.dice1, dice2: result.dice2, won, winnings }
  }

  /** Kâse tahmini oyna */
  const playCup = (guess: number): { success: boolean; message: string; correctCup: number; won: boolean; winnings: number } => {
    if (!canBet.value) return { success: false, message: 'Bugünkü oyun hakkın tükendi.', correctCup: 0, won: false, winnings: 0 }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(CUP_BET_AMOUNT)) {
      return { success: false, message: 'Akçe yetmiyor.', correctCup: 0, won: false, winnings: 0 }
    }
    casinoBetsToday.value++
    const result = playCupRound()
    const won = guess === result.correctCup
    const winnings = won ? Math.floor(CUP_BET_AMOUNT * CUP_WIN_MULTIPLIER) : 0
    if (won) {
      playerStore.earnMoney(winnings)
      addLog(`Kâse tahmininde ${guess + 1}. kâseyi doğru bildin! ${winnings} akçe kazandın!`)
    } else {
      addLog(`Kâse tahmininde yanıldın; top ${result.correctCup + 1}. kâsenin altındaydı. ${CUP_BET_AMOUNT} akçe kaybettin.`)
    }
    return { success: true, message: won ? 'Doğru bildin!' : 'Yanıldın…', correctCup: result.correctCup, won, winnings }
  }

  /** Cırcır böceği dövüştür */
  const playCricketFight = (
    cricketId: string
  ): { success: boolean; message: string; playerPower: number; opponentPower: number; won: boolean; draw: boolean; winnings: number } => {
    if (!canBet.value)
      return { success: false, message: 'Bugünkü oyun hakkın tükendi.', playerPower: 0, opponentPower: 0, won: false, draw: false, winnings: 0 }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(CRICKET_BET_AMOUNT)) {
      return { success: false, message: 'Akçe yetmiyor.', playerPower: 0, opponentPower: 0, won: false, draw: false, winnings: 0 }
    }
    casinoBetsToday.value++
    const result = fightCricket()
    const won = result.playerPower > result.opponentPower
    const draw = result.playerPower === result.opponentPower
    const winnings = won ? Math.floor(CRICKET_BET_AMOUNT * CRICKET_WIN_MULTIPLIER) : draw ? CRICKET_BET_AMOUNT : 0
    if (won || draw) {
      playerStore.earnMoney(winnings)
    }
    if (won) {
      addLog(`Cırcır dövüşü (${cricketId}): kudret ${result.playerPower} karşı ${result.opponentPower}, kesin zafer! ${winnings} akçe kazandın!`)
    } else if (draw) {
      addLog(`Cırcır dövüşü (${cricketId}): kudret ${result.playerPower} karşı ${result.opponentPower}, berabere. ${CRICKET_BET_AMOUNT} akçe geri verildi.`)
    } else {
      addLog(`Cırcır dövüşü (${cricketId}): kudret ${result.playerPower} karşı ${result.opponentPower}, yenildin. ${CRICKET_BET_AMOUNT} akçe kaybettin.`)
    }
    return {
      success: true,
      message: won ? 'Kazandın!' : draw ? 'Berabere' : 'Kaybettin…',
      playerPower: result.playerPower,
      opponentPower: result.opponentPower,
      won,
      draw,
      winnings
    }
  }

  /** Kart çevirip define ara */
  const playCardFlip = (pick: number): { success: boolean; message: string; treasures: number[]; won: boolean; winnings: number } => {
    if (!canBet.value) return { success: false, message: 'Bugünkü oyun hakkın tükendi.', treasures: [], won: false, winnings: 0 }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(CARD_BET_AMOUNT)) {
      return { success: false, message: 'Akçe yetmiyor.', treasures: [], won: false, winnings: 0 }
    }
    casinoBetsToday.value++
    const result = dealCards()
    const won = result.treasures.includes(pick)
    const winnings = won ? Math.floor(CARD_BET_AMOUNT * CARD_WIN_MULTIPLIER) : 0
    if (won) {
      playerStore.earnMoney(winnings)
      addLog(`Kart çevirmede define kartını buldun! ${winnings} akçe kazandın!`)
    } else {
      addLog(`Kart çevirmede boş kart geldi, ${CARD_BET_AMOUNT} akçe kaybettin.`)
    }
    return { success: true, message: won ? 'Define kartını buldun!' : 'Boş kart…', treasures: result.treasures, won, winnings }
  }

  /** Hanhai destesi başlat (giriş + pay kesilir, kartlar dağıtılır) */
  const startTexas = (tierId: TexasTierId): { success: boolean; message: string } & Partial<TexasSetup> => {
    if (!canBet.value) return { success: false, message: 'Bugünkü oyun hakkın tükendi.' }
    const tier = getTexasTier(tierId)
    const playerStore = usePlayerStore()
    if (playerStore.money < tier.minMoney) {
      return { success: false, message: `İçeri girmek için en az ${tier.minMoney} akçe bulundurmalısın.` }
    }
    const totalCost = tier.entryFee + tier.rake
    if (!playerStore.spendMoney(totalCost)) {
      return { success: false, message: 'Akçe yetmiyor.' }
    }
    casinoBetsToday.value++
    const deal = dealTexas()
    return {
      success: true,
      message: `${tier.name} başladı!`,
      playerHole: deal.playerHole,
      dealerHole: deal.dealerHole,
      community: deal.community,
      tier
    }
  }

  /** Hanhai destesini bitir (elde kalan pulu geri çevir) */
  const endTexas = (finalChips: number, tierName: string) => {
    const playerStore = usePlayerStore()
    if (finalChips > 0) {
      playerStore.earnMoney(finalChips)
    }
    addLog(`Hanhai destesi (${tierName}) sona erdi, ${finalChips} akçelik pul geri çevrildi.`)
  }

  /** Şeytan çarkını başlat (bahis + başlangıç durumu) */
  const startBuckshot = (): { success: boolean; message: string } & Partial<BuckshotSetup> => {
    if (!canBet.value) return { success: false, message: 'Bugünkü oyun hakkın tükendi.' }
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(BUCKSHOT_BET_AMOUNT)) {
      return { success: false, message: 'Akçe yetmiyor.' }
    }
    casinoBetsToday.value++
    return {
      success: true,
      message: 'Şeytan çarkı başladı!',
      shells: loadShotgun(),
      playerHP: BUCKSHOT_PLAYER_HP,
      dealerHP: BUCKSHOT_DEALER_HP
    }
  }

  /** Şeytan çarkı hesabını kapat */
  const endBuckshot = (won: boolean, draw: boolean) => {
    const playerStore = usePlayerStore()
    if (won) {
      playerStore.earnMoney(BUCKSHOT_BET_AMOUNT * BUCKSHOT_WIN_MULTIPLIER)
      addLog(`Şeytan çarkında galip geldin! ${BUCKSHOT_BET_AMOUNT * BUCKSHOT_WIN_MULTIPLIER} akçe kazandın!`)
    } else if (draw) {
      playerStore.earnMoney(BUCKSHOT_BET_AMOUNT)
      addLog(`Şeytan çarkı berabere bitti, ${BUCKSHOT_BET_AMOUNT} akçe geri verildi.`)
    } else {
      addLog(`Şeytan çarkında yenildin, ${BUCKSHOT_BET_AMOUNT} akçe kaybettin.`)
    }
  }

  /** Günlük oyun hakkını sıfırla, haftalık dükkân sınırlarını yenile */
  const resetDailyBets = () => {
    casinoBetsToday.value = 0
    const gameStore = useGameStore()
    if (gameStore.day % 7 === 0) {
      weeklyPurchases.value = {}
    }
  }

  const serialize = () => ({
    unlocked: unlocked.value,
    casinoBetsToday: casinoBetsToday.value,
    weeklyPurchases: weeklyPurchases.value
  })

  const deserialize = (data: any) => {
    unlocked.value = data.unlocked ?? false
    casinoBetsToday.value = data.casinoBetsToday ?? 0
    weeklyPurchases.value = data.weeklyPurchases ?? {}
  }

  return {
    unlocked,
    casinoBetsToday,
    weeklyPurchases,
    canBet,
    betsRemaining,
    unlockHanhai,
    getWeeklyRemaining,
    buyShopItem,
    useTreasureMap,
    playRoulette,
    playDice,
    playCup,
    playCricketFight,
    playCardFlip,
    startTexas,
    endTexas,
    startBuckshot,
    endBuckshot,
    resetDailyBets,
    serialize,
    deserialize
  }
})
