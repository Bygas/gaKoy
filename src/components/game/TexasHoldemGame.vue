<template>
  <div class="game-panel max-w-sm w-full">
    <Divider title class="!mb-1">Hanhai Pokeri · {{ tier.name }}</Divider>
    <div class="flex items-center justify-center space-x-2 mb-2">
      <span class="text-xs text-muted">El {{ currentRound }}/{{ tier.rounds }}</span>
      <span class="text-xs text-muted">Giriş bedeli {{ tier.entryFee }} akçe</span>
      <span class="text-xs text-muted">Kesinti {{ tier.rake }} akçe</span>
    </div>

    <!-- Pot + aşama -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-muted">{{ streetLabel }}</span>
      <span class="text-xs text-accent">Orta bahis: {{ pot }}</span>
    </div>

    <!-- Ortak kartlar -->
    <div class="mb-2">
      <p class="text-xs text-muted mb-1">Ortak kartlar</p>
      <div class="flex justify-center space-x-1">
        <span
          v-for="(card, i) in currentCommunity"
          :key="i"
          class="poker-card"
          :class="{
            'poker-card-hidden': !isCommunityVisible(i),
            'poker-card-red': isCommunityVisible(i) && isRedSuit(card.suit),
            'poker-card-reveal': isCommunityVisible(i)
          }"
        >
          <template v-if="isCommunityVisible(i)">
            <span class="poker-card-suit">{{ SUIT_LABELS[card.suit] }}</span>
            <span class="poker-card-rank">{{ RANK_LABELS[card.rank] }}</span>
          </template>
          <template v-else>?</template>
        </span>
      </div>
    </div>

    <!-- Oyuncu eli + pul -->
    <div class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted">Senin elin</span>
        <span class="text-xs">Pulun: {{ playerStack }}</span>
      </div>
      <div class="flex justify-center space-x-1">
        <span
          v-for="(card, i) in currentPlayerHole"
          :key="i"
          class="poker-card poker-card-reveal"
          :class="{ 'poker-card-red': isRedSuit(card.suit) }"
        >
          <span class="poker-card-suit">{{ SUIT_LABELS[card.suit] }}</span>
          <span class="poker-card-rank">{{ RANK_LABELS[card.rank] }}</span>
        </span>
      </div>
      <p v-if="playerHandResult" class="text-xs text-center mt-1 text-accent">{{ playerHandResult.label }}</p>
    </div>

    <!-- Dağıtanın eli + pul -->
    <div class="mb-2">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs text-muted">Dağıtanın eli</span>
        <span class="text-xs">Pul: {{ dealerStack }}</span>
      </div>
      <div class="flex justify-center space-x-1">
        <span
          v-for="(card, i) in currentDealerHole"
          :key="i"
          class="poker-card"
          :class="{
            'poker-card-hidden': !showDealerCards,
            'poker-card-red': showDealerCards && isRedSuit(card.suit),
            'poker-card-reveal': showDealerCards
          }"
        >
          <template v-if="showDealerCards">
            <span class="poker-card-suit">{{ SUIT_LABELS[card.suit] }}</span>
            <span class="poker-card-rank">{{ RANK_LABELS[card.rank] }}</span>
          </template>
          <template v-else>?</template>
        </span>
      </div>
      <p v-if="dealerHandResult" class="text-xs text-center mt-1 text-accent">{{ dealerHandResult.label }}</p>
    </div>

    <!-- İşlem düğmeleri -->
    <div v-if="!handOver && isPlayerTurn && !animating" class="flex flex-wrap space-x-1 mb-2">
      <template v-if="toCall <= 0">
        <Button class="flex-1 justify-center" @click="doCheck">Pas</Button>
        <Button class="flex-1 justify-center" @click="doRaise(tier.blind * 2)">Artır {{ tier.blind * 2 }}</Button>
        <Button class="flex-1 justify-center" @click="doRaise(tier.blind * 4)">Artır {{ tier.blind * 4 }}</Button>
      </template>
      <template v-else>
        <Button class="flex-1 justify-center" @click="doCall">Gör {{ toCall }}</Button>
        <Button v-if="playerStack > toCall" class="flex-1 justify-center" @click="doRaise(toCall + tier.blind * 2)">
          Artır {{ toCall + tier.blind * 2 }}
        </Button>
      </template>
      <Button class="flex-1 justify-center" @click="doAllIn">Hepsini sür</Button>
      <Button class="flex-1 justify-center text-danger" @click="doFold">Çekil</Button>
    </div>

    <!-- Dağıtan düşünüyor -->
    <p v-if="!handOver && !isPlayerTurn && animating" class="text-xs text-muted/40 text-center mb-2">Dağıtan düşünüyor…</p>

    <!-- Kayıt -->
    <div class="border border-accent/10 rounded-xs p-2 mb-2 max-h-24 overflow-y-auto" ref="logRef">
      <p v-for="(msg, i) in actionLog" :key="i" class="text-xs text-muted leading-relaxed">{{ msg }}</p>
    </div>

    <!-- Son hesap -->
    <template v-if="sessionOver && finalResult">
      <div class="border border-accent/10 rounded-xs p-3 text-center mb-2">
        <p class="text-sm" :class="finalResult.won ? 'text-success' : finalResult.draw ? 'text-accent' : 'text-danger'">
          {{ finalResult.won ? 'Bu masayı sen topladın!' : finalResult.draw ? 'Ne kâr ne zarar' : 'Bu eli yitirdin…' }}
        </p>
        <p class="text-xs mt-0.5" :class="finalResult.netProfit >= 0 ? 'text-success' : 'text-danger'">
          {{ finalResult.netProfit >= 0 ? '+' + finalResult.netProfit + ' akçe' : finalResult.netProfit + ' akçe' }}
        </p>
        <p class="text-xs text-muted mt-0.5">Dağıtan payı {{ tier.rake }} akçe</p>
        <p class="text-xs text-muted mt-0.5">Toplam {{ currentRound }} el · Son pulun {{ playerStack }}</p>
      </div>
      <Button class="w-full justify-center" @click="emit('complete', playerStack, tier.name)">Tamam</Button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { SUIT_LABELS, RANK_LABELS, evaluateBestHand, compareHands, texasDealerAI, dealTexas } from '@/data/hanhai'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { sfxChipBet, sfxFoldCards, sfxCardFlip, sfxCasinoWin, sfxCasinoLose } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import type { TexasSetup, TexasStreet, PokerSuit, PokerHandResult, PokerCard } from '@/types'

  const playerStore = usePlayerStore()

  const props = defineProps<{ setup: TexasSetup }>()
  const emit = defineEmits<{ complete: [finalChips: number, tierName: string] }>()

  const tier = props.setup.tier

  // === Çok elli yönetim ===
  const currentRound = ref(1)
  const currentPlayerHole = ref<PokerCard[]>(props.setup.playerHole)
  const currentDealerHole = ref<PokerCard[]>(props.setup.dealerHole)
  const currentCommunity = ref<PokerCard[]>(props.setup.community)

  // === Tek el durumu ===
  const street = ref<TexasStreet>('preflop')
  const playerStack = ref(tier.entryFee)
  const dealerStack = ref(tier.entryFee)
  const pot = ref(0)
  const playerBetRound = ref(0)
  const dealerBetRound = ref(0)
  const isPlayerTurn = ref(true)
  const animating = ref(false)
  const handOver = ref(false)
  const handResult = ref<'won' | 'draw' | 'lost' | null>(null)
  const playerFolded = ref(false)
  const dealerFolded = ref(false)
  const playerAllIn = ref(false)
  const dealerAllIn = ref(false)
  const showDealerCards = ref(false)
  const playerHandResult = ref<PokerHandResult | null>(null)
  const dealerHandResult = ref<PokerHandResult | null>(null)
  const sessionOver = ref(false)
  const finalResult = ref<{ won: boolean; draw: boolean; netProfit: number } | null>(null)
  const totalInvested = ref(0) // Dışarıdan eklenen toplam para (ilk giriş bedeli hariç)
  const actionLog = ref<string[]>([])
  const logRef = ref<HTMLElement | null>(null)

  const toCall = computed(() => Math.max(0, dealerBetRound.value - playerBetRound.value))

  const streetLabel = computed(() => {
    const labels: Record<TexasStreet, string> = {
      preflop: 'Açılış',
      flop: 'Üç açıldı',
      turn: 'Dördüncü kart',
      river: 'Son kart',
      showdown: 'Kart açma'
    }
    return labels[street.value]
  })

  const isRedSuit = (suit: PokerSuit) => suit === 'heart' || suit === 'diamond'

  const isCommunityVisible = (index: number) => {
    if (street.value === 'showdown') return true
    if (index < 3) return street.value === 'flop' || street.value === 'turn' || street.value === 'river'
    if (index === 3) return street.value === 'turn' || street.value === 'river'
    return street.value === 'river'
  }

  const visibleCommunity = computed(() => {
    const s = street.value
    if (s === 'preflop') return []
    if (s === 'flop') return currentCommunity.value.slice(0, 3)
    if (s === 'turn') return currentCommunity.value.slice(0, 4)
    return currentCommunity.value.slice(0, 5)
  })

  const addActionLog = (msg: string) => {
    actionLog.value.push(msg)
    void nextTick(() => {
      if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight
    })
  }

  /** Bir taraftan pulu ortaya sürer */
  const betFromPlayer = (amount: number) => {
    const actual = Math.min(amount, playerStack.value)
    playerStack.value -= actual
    playerBetRound.value += actual
    if (playerStack.value <= 0) playerAllIn.value = true
    return actual
  }

  const betFromDealer = (amount: number) => {
    const actual = Math.min(amount, dealerStack.value)
    dealerStack.value -= actual
    dealerBetRound.value += actual
    if (dealerStack.value <= 0) dealerAllIn.value = true
    return actual
  }

  /** Bu turun bahislerini ortaya toplar (eşit olmayan all-in fazlasını geri verir) */
  const collectBets = () => {
    const pBet = playerBetRound.value
    const dBet = dealerBetRound.value
    const matched = Math.min(pBet, dBet)
    pot.value += matched * 2

    // Fazla pulları geri ver
    if (pBet > matched) {
      const refund = pBet - matched
      playerStack.value += refund
    }
    if (dBet > matched) {
      const refund = dBet - matched
      dealerStack.value += refund
    }

    playerBetRound.value = 0
    dealerBetRound.value = 0
  }

  /** Sonraki aşamaya geç */
  const advanceStreet = () => {
    collectBets()
    const order: TexasStreet[] = ['preflop', 'flop', 'turn', 'river', 'showdown']
    const idx = order.indexOf(street.value)
    if (idx >= 3 || street.value === 'river') {
      doShowdown()
      return
    }
    street.value = order[idx + 1]!
    sfxCardFlip()
    addActionLog(`—— ${streetLabel.value} ——`)

    if (playerAllIn.value || dealerAllIn.value) {
      setTimeout(() => advanceStreet(), 600)
      return
    }

    isPlayerTurn.value = true
  }

  /** Bu turun bitip bitmediğini denetler */
  const checkRoundEnd = (playerActed: boolean) => {
    const pBet = playerBetRound.value
    const dBet = dealerBetRound.value
    // Bahisler eşitse ya da düşük kalan taraf all-in ise tur kapanır
    const settled = pBet === dBet || (pBet < dBet && playerAllIn.value) || (dBet < pBet && dealerAllIn.value)

    if (settled) {
      advanceStreet()
      return
    }

    // Diğer tarafın sırası
    if (playerActed) {
      isPlayerTurn.value = false
      animating.value = true
      setTimeout(() => dealerTurn(), 800)
    } else {
      isPlayerTurn.value = true
      animating.value = false
    }
  }

  // === Oyuncu işlemleri ===

  const doCheck = () => {
    sfxChipBet()
    addActionLog('Pas geçtin')
    isPlayerTurn.value = false
    animating.value = true
    setTimeout(() => dealerTurn(), 800)
  }

  const doCall = () => {
    const amount = betFromPlayer(toCall.value)
    sfxChipBet()
    addActionLog(`Bahsi gördün: ${amount}`)
    checkRoundEnd(true)
  }

  const doRaise = (total: number) => {
    const needed = total - playerBetRound.value
    const amount = betFromPlayer(needed)
    sfxChipBet()
    addActionLog(`Artırdın: ${amount}`)
    isPlayerTurn.value = false
    animating.value = true
    setTimeout(() => dealerTurn(), 800)
  }

  const doAllIn = () => {
    const amount = betFromPlayer(playerStack.value)
    sfxChipBet()
    addActionLog(`Ne var ne yok sürdün: ${amount}`)
    playerAllIn.value = true
    isPlayerTurn.value = false
    animating.value = true
    setTimeout(() => dealerTurn(), 800)
  }

  const doFold = () => {
    sfxFoldCards()
    addActionLog('Elden çekildin')
    playerFolded.value = true
    collectBets()
    endHand('lost')
  }

  // === Dağıtan yapay zekâsı ===

  const dealerTurn = () => {
    const decision = texasDealerAI(
      currentDealerHole.value,
      visibleCommunity.value,
      street.value,
      pot.value + playerBetRound.value + dealerBetRound.value,
      dealerStack.value,
      playerBetRound.value,
      dealerBetRound.value,
      playerAllIn.value,
      tier.blind
    )

    if (decision.action === 'fold') {
      sfxFoldCards()
      addActionLog('Dağıtan elden çekildi')
      dealerFolded.value = true
      collectBets()
      animating.value = false
      endHand('won')
      return
    }

    if (decision.action === 'check') {
      sfxChipBet()
      addActionLog('Dağıtan pas geçti')
      animating.value = false
      checkRoundEnd(false)
      return
    }

    if (decision.action === 'call') {
      const callAmt = playerBetRound.value - dealerBetRound.value
      const amount = betFromDealer(callAmt)
      sfxChipBet()
      addActionLog(`Dağıtan gördü: ${amount}`)
      animating.value = false
      checkRoundEnd(false)
      return
    }

    if (decision.action === 'allin') {
      const amount = betFromDealer(dealerStack.value)
      sfxChipBet()
      addActionLog(`Dağıtan hepsini sürdü: ${amount}`)
      dealerAllIn.value = true
      animating.value = false
      if (dealerBetRound.value > playerBetRound.value && !playerAllIn.value) {
        isPlayerTurn.value = true
      } else {
        checkRoundEnd(false)
      }
      return
    }

    // raise
    const amount = betFromDealer(decision.amount)
    sfxChipBet()
    addActionLog(`Dağıtan artırdı: ${amount}`)
    animating.value = false
    isPlayerTurn.value = true
  }

  // === Kart açma ===

  const doShowdown = () => {
    street.value = 'showdown'
    showDealerCards.value = true
    sfxCardFlip()
    addActionLog('—— Kartlar açılıyor ——')

    const allCards = currentCommunity.value
    const pHand = evaluateBestHand([...currentPlayerHole.value, ...allCards])
    const dHand = evaluateBestHand([...currentDealerHole.value, ...allCards])
    playerHandResult.value = pHand
    dealerHandResult.value = dHand

    addActionLog(`Sen: ${pHand.label}`)
    addActionLog(`Dağıtan: ${dHand.label}`)

    const cmp = compareHands(pHand, dHand)
    const result = cmp > 0 ? 'won' : cmp === 0 ? 'draw' : 'lost'

    setTimeout(() => endHand(result), 800)
  }

  // === Tek el hesabı ===

  const endHand = (result: 'won' | 'draw' | 'lost') => {
    handOver.value = true
    if (dealerFolded.value || playerFolded.value) {
      showDealerCards.value = true
    }

    // Pul hesabı: kazanan ortadaki bahsi alır
    if (result === 'won') {
      playerStack.value += pot.value
      sfxCasinoWin()
      addActionLog(`Bu eli aldın! Ortadaki bahis: ${pot.value}`)
    } else if (result === 'draw') {
      const half = Math.floor(pot.value / 2)
      playerStack.value += half
      dealerStack.value += pot.value - half
      addActionLog(`El berabere bitti, orta bahis pay edildi`)
    } else {
      dealerStack.value += pot.value
      sfxCasinoLose()
      addActionLog(`Bu eli yitirdin, dağıtan ortadaki bahsi aldı: ${pot.value}`)
    }
    pot.value = 0
    handResult.value = result

    // Tüm eller bitti mi ya da oyuncunun devam edecek pulu kalmadı mı
    const playerBroke = playerStack.value <= 0 && playerStore.money <= 0
    if (playerBroke || currentRound.value >= tier.rounds) {
      endSession()
    } else {
      // Hâlâ el varsa yenisini başlat
      setTimeout(() => startNextHand(), 1000)
    }
  }

  // === Yeni el başlat ===

  const startNextHand = () => {
    currentRound.value++
    const deal = dealTexas()
    currentPlayerHole.value = deal.playerHole
    currentDealerHole.value = deal.dealerHole
    currentCommunity.value = deal.community
    sfxCardFlip()

    // Dağıtanın pulu azsa giriş bedeline tamamla
    if (dealerStack.value < tier.blind * 2) {
      const refill = tier.entryFee - dealerStack.value
      dealerStack.value = tier.entryFee
      addActionLog(`Dağıtan pulunu tazeledi: ${refill}`)
    }

    // Oyuncunun pulu azsa dışarıdaki paradan ekle
    if (playerStack.value < tier.blind * 2) {
      const needed = tier.entryFee - playerStack.value
      const canAfford = Math.min(needed, playerStore.money)
      if (canAfford > 0) {
        playerStore.spendMoney(canAfford)
        playerStack.value += canAfford
        totalInvested.value += canAfford
        addActionLog(`Dışarıdan pula ekledin: ${canAfford}`)
      }
    }

    // Tek el durumunu sıfırla
    street.value = 'preflop'
    pot.value = 0
    playerBetRound.value = 0
    dealerBetRound.value = 0
    isPlayerTurn.value = true
    animating.value = false
    handOver.value = false
    handResult.value = null
    playerFolded.value = false
    dealerFolded.value = false
    playerAllIn.value = false
    dealerAllIn.value = false
    showDealerCards.value = false
    playerHandResult.value = null
    dealerHandResult.value = null

    // Kör bahisler
    betFromPlayer(tier.blind)
    betFromDealer(tier.blind)
    collectBets()
    addActionLog(`—— ${currentRound.value}. el ——`)
    addActionLog(`İkiniz de ${tier.blind} kör bahis sürdünüz`)
    addActionLog('—— Açılış ——')
    isPlayerTurn.value = true
  }

  // === Tüm masa hesabı ===

  const endSession = () => {
    sessionOver.value = true
    // netProfit: son pul - ilk giriş bedeli - dışarıdan eklenen pul
    const net = playerStack.value - tier.entryFee - totalInvested.value
    const won = net > 0
    const draw = net === 0

    finalResult.value = { won, draw, netProfit: net }

    if (won) {
      addActionLog(`Masa kapandı! Kârlısın! Temiz kazanç: ${net}`)
    } else if (draw) {
      addActionLog(`Masa kapandı! Ne aldın ne verdin`)
    } else {
      addActionLog(`Masa kapandı! Zarardasın… Temiz kayıp: ${Math.abs(net)}`)
    }
  }

  // === Başlatma ===

  onMounted(() => {
    betFromPlayer(tier.blind)
    betFromDealer(tier.blind)
    collectBets()
    addActionLog(`—— 1. el ——`)
    addActionLog(`İkiniz de ${tier.blind} kör bahis sürdünüz`)
    addActionLog('—— Açılış ——')
    isPlayerTurn.value = true
  })
</script>

<style scoped>
  .poker-card {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 3rem;
    border: 1px solid rgba(200, 164, 92, 0.3);
    border-radius: 2px;
    font-weight: bold;
    transition: all 0.3s;
  }

  .poker-card-suit {
    position: absolute;
    top: 2px;
    left: 3px;
    font-size: 0.55rem;
    line-height: 1;
  }

  .poker-card-rank {
    font-size: 0.85rem;
    line-height: 1;
  }

  .poker-card-hidden {
    background: rgba(200, 164, 92, 0.08);
    color: var(--color-muted);
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }

  .poker-card-reveal {
    background: rgba(232, 228, 217, 0.08);
    color: rgb(var(--color-text));
    animation: poker-flip 0.4s ease;
  }

  .poker-card-red {
    color: var(--color-danger);
  }

  @keyframes poker-flip {
    0% {
      transform: scaleX(0);
    }
    50% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
</style>
