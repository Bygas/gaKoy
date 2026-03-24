<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Fish :size="14" />
      <span>Balıkçılık Yarışması</span>
    </h3>

    <!-- Hazırlık -->
    <div v-if="phase === 'ready'">
      <p class="text-xs text-muted mb-3">
        Balıkçılık yarışı 3 tur sürer! Oltayı attıktan sonra balığın vurmasını bekle, sonra gerginlik çubuğunu izle —
        yeşil bölgede oltayı çekersen en iyi balığı yakalarsın! Gerginlik fazla yükselirse misina kopar!
      </p>

      <div v-if="catches.length > 0" class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Topladıkların:</p>
        <div
          v-for="(c, i) in catches"
          :key="i"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <span class="text-accent">{{ c.name }}</span>
          <span class="text-muted">{{ c.weight }} okka · +{{ c.score }} puan</span>
        </div>
        <div class="flex items-center justify-between text-xs mt-1.5 pt-1">
          <span class="text-muted">Şimdiki toplam puan</span>
          <span class="text-accent">{{ playerTotal }} puan</span>
        </div>
      </div>

      <p class="text-xs text-muted mb-2">Tur {{ currentRound }} / 3</p>
      <Button class="w-full" @click="castLine">Oltayı At!</Button>
    </div>

    <!-- Olta atma animasyonu -->
    <div v-else-if="phase === 'casting'" class="flex flex-col items-center py-8">
      <div class="cast-anim">
        <Fish :size="28" class="text-accent" />
      </div>
      <p class="text-xs text-muted mt-3">Olta atılıyor...</p>
    </div>

    <!-- Vuruş bekleme -->
    <div v-else-if="phase === 'waiting'" class="flex flex-col items-center py-6">
      <div class="float-bob mb-2">
        <Waves :size="28" class="text-accent/50" />
      </div>
      <p class="text-xs text-muted">Balığın vurması bekleniyor...</p>
      <div class="flex justify-center space-x-1.5 mt-2">
        <span class="w-1.5 h-1.5 bg-accent/40 dot-loading" />
        <span class="w-1.5 h-1.5 bg-accent/40 dot-loading" style="animation-delay: 0.2s" />
        <span class="w-1.5 h-1.5 bg-accent/40 dot-loading" style="animation-delay: 0.4s" />
      </div>
    </div>

    <!-- Balık vurdu! Gerginlik oyunu -->
    <div v-else-if="phase === 'tension'">
      <p class="text-xs text-center mb-2 text-accent bite-flash">Balık vurdu! Gerginliğe dikkat et!</p>

      <div class="flex space-x-3 items-stretch mb-3">
        <!-- Gerginlik çubuğu -->
        <div class="w-8 h-44 bg-bg border border-accent/30 relative overflow-hidden shrink-0">
          <!-- En iyi bölge 60-72% -->
          <div class="absolute left-0 right-0 bg-success/15 border-y border-success/30" style="bottom: 60%; height: 12%" />
          <!-- Tehlikeli bölge 85%+ -->
          <div class="absolute left-0 right-0 bg-danger/15 border-b border-danger/30" style="bottom: 85%; height: 15%" />
          <!-- Dolum -->
          <div
            class="absolute bottom-0 left-0 right-0 transition-none"
            :class="tensionPct > 85 ? 'bg-danger/70' : tensionPct >= 55 ? 'bg-success/60' : 'bg-accent/40'"
            :style="{ height: `${tensionPct}%` }"
          />
          <!-- Etiketler -->
          <span class="absolute text-center w-full" style="bottom: 65%; font-size: 8px; color: var(--color-success)">İyi</span>
          <span class="absolute text-center w-full" style="bottom: 88%; font-size: 8px; color: var(--color-danger)">Kopar</span>
        </div>

        <!-- Su alanı -->
        <div class="flex-1 h-44 bg-bg border border-accent/20 relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 water-ripple" />
          <!-- Balık -->
          <div class="absolute transition-none" :style="{ top: `${fishVisualY}%`, left: `${fishVisualX}%` }">
            <Fish :size="18" class="text-accent fish-thrash" />
          </div>
          <span class="absolute bottom-0.5 right-1 text-muted" style="font-size: 9px">Tur {{ currentRound }}</span>
        </div>
      </div>

      <Button class="w-full py-2.5" :icon="ArrowUp" @click="pullRod">Çek!</Button>
      <p class="text-xs text-muted text-center mt-1">Yeşil bölgede çekersen sonuç en iyi olur, kırmızı bölgede misina kopar!</p>
    </div>

    <!-- Tek tur sonucu -->
    <div v-else-if="phase === 'round_result'" class="text-center py-4">
      <div :class="resultAnimClass">
        <p
          class="text-sm mb-1"
          :class="{
            'text-accent': lastGrade === 'perfect',
            'text-success': lastGrade === 'good',
            'text-danger': lastGrade === 'escaped',
            'text-muted': lastGrade === 'poor'
          }"
        >
          {{ gradeText }}
        </p>
        <div v-if="lastGrade !== 'escaped'" class="mt-2">
          <p class="text-accent text-xs">{{ catches[catches.length - 1]?.name }}</p>
          <p class="text-xs text-muted">{{ catches[catches.length - 1]?.weight }} okka · +{{ catches[catches.length - 1]?.score }} puan</p>
        </div>
        <div v-else class="mt-2">
          <p class="text-xs text-danger">Gerginlik fazla yükseldi, misina koptu!</p>
        </div>
      </div>
    </div>

    <!-- Yarışma sonu -->
    <div v-else>
      <p class="text-xs text-muted mb-2">Yarışma bitti!</p>

      <div class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Son sıralama:</p>
        <div
          v-for="(entry, i) in rankings"
          :key="entry.name"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <div>
            <span class="mr-2" :class="{ 'text-accent': i === 0, 'text-success': entry.name === 'Sen' }">{{ i + 1 }}.</span>
            <span :class="{ 'text-success': entry.name === 'Sen' }">{{ entry.name }}</span>
          </div>
          <span class="text-muted">{{ entry.score }} puan</span>
        </div>
      </div>

      <div v-if="catches.length > 0" class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Topladıkların:</p>
        <div
          v-for="(c, i) in catches"
          :key="i"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <span class="text-accent">{{ c.name }}</span>
          <span class="text-muted">{{ c.weight }} okka · +{{ c.score }} puan</span>
        </div>
      </div>

      <div class="mb-3 text-xs text-center border border-accent/20 p-2">
        <span v-if="playerRank === 1" class="text-accent">Kutlu olsun! Birinci oldun! Ödülün 500 akçe</span>
        <span v-else-if="playerRank === 2" class="text-success">İkinci oldun! Ödülün 200 akçe</span>
        <span v-else-if="playerRank === 3" class="text-success">Üçüncü oldun! Ödülün 100 akçe</span>
        <span v-else class="text-muted">Bu kez dereceye giremedin. gaKöy kıyısında yeniden şansını denersin!</span>
      </div>

      <Button class="w-full" @click="handleClaim">Ödülü Al</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onUnmounted } from 'vue'
  import { Fish, ArrowUp, Waves } from 'lucide-vue-next'
  import {
    sfxGameStart,
    sfxCastLine,
    sfxFishBite,
    sfxMiniPerfect,
    sfxMiniGood,
    sfxMiniPoor,
    sfxMiniFail,
    sfxRankFirst,
    sfxRankSecond,
    sfxRankThird,
    sfxRankLose
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{ complete: [prize: number] }>()

  type Phase = 'ready' | 'casting' | 'waiting' | 'tension' | 'round_result' | 'finished'
  type CatchGrade = 'perfect' | 'good' | 'poor' | 'escaped'

  /** Balık seviye havuzları */
  const FISH_TIERS = {
    perfect: [
      { name: 'Alabalık', minW: 2.0, maxW: 5.0, baseScore: 50 },
      { name: 'Turna', minW: 1.5, maxW: 4.0, baseScore: 45 },
      { name: 'Mersin Balığı', minW: 3.0, maxW: 8.0, baseScore: 55 }
    ],
    good: [
      { name: 'Levrek', minW: 1.5, maxW: 4.0, baseScore: 30 },
      { name: 'Yayın', minW: 2.0, maxW: 5.0, baseScore: 25 },
      { name: 'Sazan', minW: 1.0, maxW: 3.5, baseScore: 20 }
    ],
    poor: [
      { name: 'Kara Balık', minW: 0.5, maxW: 2.0, baseScore: 8 },
      { name: 'Ot Balığı', minW: 1.0, maxW: 3.0, baseScore: 12 }
    ]
  }

  interface CatchRecord {
    name: string
    weight: number
    score: number
  }

  interface Participant {
    name: string
    score: number
  }

  const phase = ref<Phase>('ready')
  const currentRound = ref(1)
  const catches = ref<CatchRecord[]>([])
  const rankings = ref<Participant[]>([])
  const lastGrade = ref<CatchGrade>('poor')

  // Gerginlik oyunu durumu
  const tensionPct = ref(0)
  const fishVisualX = ref(40)
  const fishVisualY = ref(40)

  let tensionTimer: ReturnType<typeof setInterval> | null = null
  let fishMoveTimer: ReturnType<typeof setInterval> | null = null
  let phaseTimeout: ReturnType<typeof setTimeout> | null = null

  const playerTotal = computed(() => catches.value.reduce((sum, c) => sum + c.score, 0))

  const playerRank = computed(() => {
    const idx = rankings.value.findIndex(e => e.name === 'Sen')
    return idx === -1 ? 99 : idx + 1
  })

  const gradeText = computed(() => {
    switch (lastGrade.value) {
      case 'perfect':
        return 'Kusursuz çekiş! Koca balık oltada!'
      case 'good':
        return 'İyi av!'
      case 'poor':
        return 'Ufak bir balık geldi...'
      case 'escaped':
        return 'Misina koptu!'
    }
  })

  const resultAnimClass = computed(() => {
    switch (lastGrade.value) {
      case 'perfect':
        return 'catch-perfect'
      case 'good':
        return 'catch-good'
      default:
        return 'catch-poor'
    }
  })

  /** Dereceye göre rastgele balık üret */
  const randomFish = (grade: 'perfect' | 'good' | 'poor'): CatchRecord => {
    const pool = FISH_TIERS[grade]
    const fish = pool[Math.floor(Math.random() * pool.length)]!
    const weight = +(fish.minW + Math.random() * (fish.maxW - fish.minW)).toFixed(1)
    // Ağırlık çarpanı en fazla 1.8 olsun
    const weightMult = Math.min(1.8, weight / fish.minW)
    const score = Math.round(fish.baseScore * weightMult)
    return { name: fish.name, weight, score }
  }

  const castLine = () => {
    if (currentRound.value === 1) sfxGameStart()
    sfxCastLine()
    phase.value = 'casting'
    phaseTimeout = setTimeout(() => {
      phase.value = 'waiting'
      // 1-3 saniye sonra balık vurur
      const waitTime = 1000 + Math.random() * 2000
      phaseTimeout = setTimeout(() => {
        startTension()
      }, waitTime)
    }, 800)
  }

  const startTension = () => {
    sfxFishBite()
    phase.value = 'tension'
    tensionPct.value = 0
    fishVisualX.value = 30 + Math.random() * 40
    fishVisualY.value = 20 + Math.random() * 60

    // Gerginlik artış hızı tura göre yükselir
    const baseSpeed = [1.2, 1.8, 2.6][currentRound.value - 1] ?? 1.2
    let tickCount = 0

    tensionTimer = setInterval(() => {
      tickCount++
      // Balığın çırpınışını simüle eden dalgalanma
      const fluctuation = (Math.random() - 0.25) * 0.8
      let speed = Math.max(0.3, baseSpeed + fluctuation)

      // Zaman zaman ani gerginlik sıçraması
      if (tickCount % 20 === 0 && Math.random() < 0.4) {
        speed += 2.0 + Math.random() * 2.0
      }

      tensionPct.value = Math.min(100, tensionPct.value + speed)

      if (tensionPct.value >= 100) {
        stopTimers()
        lastGrade.value = 'escaped'
        phase.value = 'round_result'
        advanceRound()
      }
    }, 50)

    // Balığın görsel hareketi
    fishMoveTimer = setInterval(() => {
      fishVisualX.value = Math.max(5, Math.min(75, fishVisualX.value + (Math.random() - 0.5) * 15))
      fishVisualY.value = Math.max(5, Math.min(75, fishVisualY.value + (Math.random() - 0.5) * 15))
    }, 200)
  }

  const pullRod = () => {
    if (phase.value !== 'tension') return
    stopTimers()

    const pct = tensionPct.value
    let grade: CatchGrade

    if (pct >= 60 && pct <= 72) {
      grade = 'perfect'
    } else if ((pct >= 40 && pct < 60) || (pct > 72 && pct <= 85)) {
      grade = 'good'
    } else if (pct > 85) {
      grade = 'escaped'
    } else {
      grade = 'poor'
    }

    lastGrade.value = grade

    if (grade === 'perfect') sfxMiniPerfect()
    else if (grade === 'good') sfxMiniGood()
    else if (grade === 'poor') sfxMiniPoor()
    else sfxMiniFail()

    if (grade !== 'escaped') {
      const fishGrade = grade === 'perfect' ? 'perfect' : grade === 'good' ? 'good' : 'poor'
      const fish = randomFish(fishGrade)
      catches.value.push(fish)
    }

    phase.value = 'round_result'
    advanceRound()
  }

  const advanceRound = () => {
    phaseTimeout = setTimeout(() => {
      if (currentRound.value >= 3) {
        finishContest()
      } else {
        currentRound.value++
        phase.value = 'ready'
      }
    }, 1800)
  }

  const finishContest = () => {
    // NPC yetenek profilleri
    const npcProfiles: { name: string; perfectRate: number; goodRate: number }[] = [
      { name: 'Aylin', perfectRate: 0.55, goodRate: 0.9 },
      { name: 'Hasan Enişte', perfectRate: 0.45, goodRate: 0.85 },
      { name: 'Mıstık', perfectRate: 0.35, goodRate: 0.8 }
    ]

    const npcScores = npcProfiles.map(({ name, perfectRate, goodRate }) => {
      let total = 0
      for (let i = 0; i < 3; i++) {
        const r = Math.random()
        const grade = r < perfectRate ? 'perfect' : r < goodRate ? 'good' : ('poor' as const)
        total += randomFish(grade).score
      }
      // NPC sabit performans bonusu
      total += 15 + Math.floor(Math.random() * 20)
      return { name, score: total }
    })

    const player: Participant = { name: 'Sen', score: playerTotal.value }
    const all = [...npcScores, player]
    all.sort((a, b) => b.score - a.score)
    rankings.value = all
    phase.value = 'finished'
  }

  const stopTimers = () => {
    if (tensionTimer) clearInterval(tensionTimer)
    if (fishMoveTimer) clearInterval(fishMoveTimer)
    tensionTimer = null
    fishMoveTimer = null
  }

  const handleClaim = () => {
    const rank = playerRank.value
    if (rank === 1) sfxRankFirst()
    else if (rank === 2) sfxRankSecond()
    else if (rank === 3) sfxRankThird()
    else sfxRankLose()

    const prizes: Record<number, number> = { 1: 500, 2: 200, 3: 100 }
    emit('complete', prizes[playerRank.value] ?? 0)
  }

  onUnmounted(() => {
    stopTimers()
    if (phaseTimeout) clearTimeout(phaseTimeout)
  })
</script>

<style scoped>
  .cast-anim {
    animation: cast-anim 0.8s ease-out;
  }
  @keyframes cast-anim {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    40% {
      transform: translateY(-20px) rotate(-30deg);
    }
    100% {
      transform: translateY(10px) rotate(0deg);
    }
  }

  .float-bob {
    animation: float-bob 1.5s ease-in-out infinite;
  }
  @keyframes float-bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  .dot-loading {
    animation: dot-loading 1s ease-in-out infinite;
  }
  @keyframes dot-loading {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  .bite-flash {
    animation: bite-flash 0.5s ease-in-out infinite;
  }
  @keyframes bite-flash {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .fish-thrash {
    animation: fish-thrash 0.3s ease-in-out infinite;
  }
  @keyframes fish-thrash {
    0%,
    100% {
      transform: scaleX(1);
    }
    50% {
      transform: scaleX(-1);
    }
  }

  .water-ripple {
    background: repeating-linear-gradient(0deg, transparent, transparent 6px, var(--color-accent) 6px, var(--color-accent) 7px);
    animation: water-ripple 3s linear infinite;
  }
  @keyframes water-ripple {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(14px);
    }
  }

  .catch-perfect {
    animation: catch-perfect 0.5s ease-out;
  }
  @keyframes catch-perfect {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .catch-good {
    animation: catch-good 0.4s ease-out;
  }
  @keyframes catch-good {
    0% {
      transform: translateY(5px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .catch-poor {
    animation: catch-poor 0.4s ease-in-out;
  }
  @keyframes catch-poor {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
  }
</style>
