<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Lightbulb :size="14" />
      <span>Fener Bilmeceleri</span>
    </h3>

    <!-- Hazırlık -->
    <div v-if="phase === 'ready'">
      <p class="text-xs text-muted mb-3">Meydan fenerlerle dolu; her fenerin altında bir bilmece var. Toplam 5 soru var, her birinin süresi sınırlı. Bilen ödülü kapar!</p>
      <Button class="w-full" @click="startGame">Bilmeceye Başla!</Button>
    </div>

    <!-- Fener gösterimi -->
    <div v-else-if="phase === 'showing'" class="text-center py-4">
      <div class="lantern-drop mb-3">
        <div class="inline-block border-2 border-accent/50 px-6 py-3">
          <Lamp :size="20" class="text-accent mx-auto mb-1" />
          <p class="text-accent text-xs">{{ currentIndex + 1 }}. soru</p>
        </div>
      </div>
      <!-- İlerleme noktaları -->
      <div class="flex justify-center space-x-2 mt-2">
        <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
      </div>
    </div>

    <!-- Cevaplama -->
    <div v-else-if="phase === 'answering'">
      <!-- İlerleme noktaları + geri sayım -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-1.5">
          <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
        </div>
        <p class="text-xs" :class="countdown <= 3 ? 'text-danger time-pulse' : 'text-accent'">
          <Timer :size="12" class="inline -mt-0.5" />
          {{ countdown }} sn
        </p>
      </div>

      <!-- Geri sayım çubuğu -->
      <div class="h-1 bg-bg border border-accent/20 mb-3">
        <div
          class="h-full transition-all duration-1000 ease-linear"
          :class="countdown <= 3 ? 'bg-danger/60' : 'bg-accent/60'"
          :style="{ width: `${(countdown / currentTimeLimit) * 100}%` }"
        />
      </div>

      <!-- Bilmece -->
      <div class="border border-accent/30 p-3 mb-3 text-center">
        <p class="text-xs text-muted mb-1">Bilmece</p>
        <p class="text-xs text-text leading-relaxed">{{ currentRiddle.question }}</p>
      </div>

      <!-- Seçenekler -->
      <div class="flex flex-col space-y-2">
        <Button
          v-for="(opt, i) in currentRiddle.options"
          :key="i"
          class="text-left w-full"
          :disabled="answered"
          :class="{ 'opacity-50': answered }"
          @click="answer(i)"
        >
          <span class="text-accent mr-1">{{ ['A', 'B', 'C', 'D'][i] }}.</span>
          {{ opt }}
        </Button>
      </div>
    </div>

    <!-- Tek soru sonucu -->
    <div v-else-if="phase === 'result'" class="text-center">
      <!-- İlerleme noktaları -->
      <div class="flex justify-center space-x-1.5 mb-3">
        <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
      </div>

      <div :class="lastCorrect ? 'correct-flash' : 'wrong-shake'" class="mb-3 py-3 border border-accent/20">
        <p class="text-sm mb-1" :class="lastCorrect ? 'text-success' : 'text-danger'">
          {{ lastCorrect ? 'Doğru bildin! +100 akçe' : 'Bilemedin…' }}
        </p>
        <p class="text-xs text-muted mt-1">
          Doğru cevap:
          <span class="text-accent">{{ currentRiddle.options[currentRiddle.answer] }}</span>
        </p>
      </div>
      <p class="text-xs text-muted">
        Şimdiki kazanç:
        <span class="text-accent">{{ score }}</span>
        akçe
      </p>
    </div>

    <!-- Son sonuç -->
    <div v-else>
      <p class="text-xs text-muted mb-2">Bilmece meclisi sona erdi!</p>

      <!-- İlerleme noktaları (son durum) -->
      <div class="flex justify-center space-x-1.5 mb-3">
        <div v-for="i in 5" :key="i" class="w-2 h-2" :class="dotClass(i - 1)" />
      </div>

      <div class="border border-accent/20 p-3 mb-3 text-center">
        <p class="text-xs mb-1">
          Doğru sayısı:
          <span class="text-success">{{ correctCount }}</span>
          / 5 soru
        </p>
        <p class="text-xs">
          Toplam ödül:
          <span class="text-accent">{{ score }}</span>
          akçe
          <span v-if="correctCount === 5" class="text-accent finish-flash">（hepsi doğruysa +300 akçe!）</span>
        </p>
      </div>
      <Button class="w-full" @click="handleClaim">Ödülü Al</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUnmounted } from 'vue'
  import { Lightbulb, Lamp, Timer } from 'lucide-vue-next'
  import {
    sfxGameStart,
    sfxRewardClaim,
    sfxCountdownTick,
    sfxCountdownFinal,
    sfxRiddleReveal,
    sfxRiddleWrong,
    sfxMiniGood,
    sfxMiniPerfect
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{ complete: [prize: number] }>()

  type Phase = 'ready' | 'showing' | 'answering' | 'result' | 'finished'
  const phase = ref<Phase>('ready')

  interface Riddle {
    question: string
    options: string[]
    answer: number
  }

  const RIDDLE_POOL: Riddle[] = [
    // === Geleneksel bilmeceler ===
    { question: 'Yüzü var ağzı yok, ayağı var eli yok, insanı dinler, sofraya yoldaş olur. (Nedir?)', options: ['Masa', 'Sandalye', 'Çaydanlık', 'Fener'], answer: 0 },
    { question: 'Binlerce çizgi iner, suya düşünce görünmez olur. (Nedir?)', options: ['Rüzgâr', 'Yağmur', 'Kar', 'Sis'], answer: 1 },
    { question: 'Yeşil elbiseli, içi sulu, çekirdeği çok, her biri kapkara. (Nedir?)', options: ['Üzüm', 'Karpuz', 'Nar', 'Liçi'], answer: 1 },
    { question: 'Kırmızı başlı, yeşil kuyruklu, gövdesi toprağın altında. (Nedir?)', options: ['Havuç', 'Turp', 'Tatlı patates', 'Yer fıstığı'], answer: 0 },
    { question: 'Yedi sekiz kardeş, direğin çevresine çöker; ayrılınca hepsinin üstü başı parçalanır. (Nedir?)', options: ['Mantı', 'Poğaça', 'Sarımsak', 'Portakal'], answer: 2 },
    { question: 'Kırmızı başlıklı, beyaz giysili, yürürken salınır, ses ederken boynunu uzatır. (Nedir?)', options: ['Tavuk', 'Kaz', 'Turna', 'Papağan'], answer: 1 },
    { question: 'Üç ağzı var, eli yok ayağı var; onsuz kalanın eş dosta çıkası gelmez. (Nedir?)', options: ['Şapka', 'Pantolon', 'Ayakkabı', 'Eldiven'], answer: 1 },
    { question: 'Küçük bir kız, suyun ortasında oturur, pembe kaftan giyer, mis gibi kokar. (Nedir?)', options: ['Nilüfer', 'Lotus', 'Kasımpatı', 'Orkide'], answer: 1 },
    { question: 'Bir ihtiyar var, ne koşar ne yürür; uyusun dersin, başını sallar. (Nedir?)', options: ['Sarkaç', 'Hacıyatmaz', 'Salıncak', 'Yel değirmeni'], answer: 1 },
    { question: 'Başı var boynu yok, gözü var kaşı yok, ayağı yok ama gider, kanadı var ama uçamaz. (Nedir?)', options: ['Yılan', 'Balık', 'İpekböceği', 'Salyangoz'], answer: 1 },
    { question: 'Kambur dede, gücü çok; üstünden ne geçer desen, araba sel gibi akar. (Nedir?)', options: ['Köprü', 'Yol', 'Gemi', 'Araba'], answer: 0 },
    { question: 'Üstü sudan korkmaz, altı ateşten korkmaz; her evin ocağında bulunur. (Nedir?)', options: ['Bıçak', 'Tencere', 'Kâse', 'Tezgâh'], answer: 1 },

    // === Kültür / bayram / şiir ===
    { question: '“Dilerim uzun ömür, uzaklar da aynı aya baksın” sözündeki “aya” neyi anlatır?', options: ['Güzel yüz', 'Ay', 'Güneş', 'Yıldız'], answer: 1 },
    { question: 'Yedinci ayın yedinci gecesi kutlanan bayrama başka ne denir?', options: ['Fener Bayramı', 'Çiçek Bayramı', 'Hüner Bayramı', 'Su Bayramı'], answer: 2 },
    { question: '“Patırtılar arasında bir yıl gider” dizesi kime aittir?', options: ['Li Bai', 'Du Fu', 'Su Shi', 'Wang Anshi'], answer: 3 },
    { question: 'Eski “beş tahıl” arasında hangisi yoktur?', options: ['Pirinç', 'Buğday', 'Pamuk', 'Darı'], answer: 2 },
    {
      question: '“Bahar yağmuru ince ince düşer” sözünün ardından ne gelir?',
      options: ['Yolcu yolda gamla yürür', 'Çoban uzakta hana işaret eder', 'Sor bakalım meyhane nerededir', 'Yabancı elde daha bir yalnızım'],
      answer: 0
    },
    { question: 'Ay takvimine göre beşinci ayın beşinci günü hangi bayramdır?', options: ['Orta Güz', 'Çifte Dokuz', 'Ejder Kayığı', 'Yedinci Gece'], answer: 2 },
    { question: '“Başımı kaldırır aya bakarım” sözünden sonra ne gelir?', options: ['Yerde kırağı sanırım', 'Başımı eğer yurdu anarım', 'Ay vatanda daha parlaktır', 'Gölgeyle üç olurum'], answer: 1 },
    { question: 'Dört kıymetli yazı gereci arasında hangisi yoktur?', options: ['Kalem', 'Mürekkep', 'Kâğıt', 'Cetvel'], answer: 3 },
    { question: '“Bahar uykusunda şafak sezilmez” sözünden sonra ne gelir?', options: ['Her yerde kuş sesi duyulur', 'Düşen çiçek ne kadardır', 'Gece yağmur rüzgârı eser', 'Bahar kokusu her yanı sarar'], answer: 0 },
    { question: 'Yirmi dört mevsim işaretinde ilkbahar başlangıcından sonra hangisi gelir?', options: ['Uyanan böcekler', 'Yağmur suyu', 'İlkbahar dengesi', 'Açık hava'], answer: 1 },
    { question: '“Kış dostu üçlü” hangi bitkilerdir?', options: ['Erik orkide bambu', 'Çam bambu erik', 'Orkide krizantem erik', 'Çam orkide bambu'], answer: 1 },
    { question: '“Yatağın önünde ay ışığı” sözündeki “yatak” en çok neyi anlatır?', options: ['Uyku yatağı', 'Kuyu başı', 'Kamp sediri', 'Pencere önü'], answer: 1 },
    { question: 'Çifte Dokuz Bayramı’nda hangi gelenek yapılır?', options: ['Tatlı yenir', 'Yükseğe çıkılır', 'Suya kandil bırakılır', 'Kır gezisi yapılır'], answer: 1 },
    {
      question: '“İnsan yüzü nereye gitti bilinmez” sözünden sonra ne gelir?',
      options: ['Şeftali çiçeği yine bahara güler', 'Bahar yeli geçide uğramaz', 'Çiçek açar solarken usul usul', 'Düşen çiçek vaktinde yine kavuşulur'],
      answer: 0
    },
    { question: 'Ejder Kayığı Bayramı’nda yapışkan pirinç sarması kimin anısına yenir?', options: ['Konfüçyüs', 'Qu Yuan', 'Li Bai', 'Zhuge Liang'], answer: 1 },
    { question: '“Çit dibinde kasımpatı toplarım” sözünden sonra ne gelir?', options: ['Sakin gözle dağa bakarım', 'Kadehi aya sorarım', 'Soğuk ırmakta yalnız avlanırım', 'Bahar suyu maviye döner'], answer: 0 },

    // === Doğa / tarım / hayvan ===
    {
      question: 'Yuvarlak yüzlü, elma gibi; ekşi tatlı, besini bol. Hem yemek olur hem meyve olur. (Nedir?)',
      options: ['Domates', 'Elma', 'Şeftali', 'Kayısı'],
      answer: 0
    },
    { question: 'Yuvarlak bakınca, pütürlü dokununca; içinde ince hilaller saklı. (Nedir?)', options: ['Ceviz', 'Yer fıstığı', 'Portakal', 'Nar'], answer: 2 },
    { question: 'Bembeyaz küçük yavru, yıkanırken köpürür; bedeni küçülür küçülür, sonunda kaybolur. (Nedir?)', options: ['Havlu', 'Sabun', 'Diş macunu', 'Kesecik'], answer: 1 },
    {
      question: 'Bir kamış boru, yedi küçük pencere; birinden üfleyince ezgisi her yana yayılır. (Nedir?)',
      options: ['Ney', 'Kaval', 'Toprak düdük', 'Ud'],
      answer: 1
    },
    { question: 'Adı öküzdür ama saban çekmez; gücü az sanılır ama evini sırtında taşır. (Nedir?)', options: ['Salyangoz', 'Gergedan', 'Manda', 'Karınca'], answer: 0 },
    { question: 'Kanadı var kuş değil, ayağı var koşamaz; yuva kurmaz, ağaçta yaşar, ötüşü kuşlarla yarışır. (Nedir?)', options: ['Arı', 'Kelebek', 'Ağustos böceği', 'Cırcır böceği'], answer: 2 },
    { question: 'İki yaprak, dört çiçek; beyazla sarı arası, yılda bir açar, sekizinci ayda güzel kokar. (Nedir?)', options: ['Orkide', 'Kasımpatı', 'Osmanthus', 'Lotus'], answer: 2 },
    {
      question: 'Dört köşe bir şehir, içinde on bin asker; kumandan çıkar hücum eder, ortalık kaynar. (Nedir?)',
      options: ['Satranç tahtası', 'Abaküs', 'Mühür', 'Mürekkep taşı'],
      answer: 0
    }
  ]

  /** İlk 2 soru 7 saniye, sonraki 3 soru 6 saniye */
  const currentTimeLimit = ref(7)

  const gameRiddles = ref<Riddle[]>([])
  const currentIndex = ref(0)
  const countdown = ref(7)
  const score = ref(0)
  const correctCount = ref(0)
  const lastCorrect = ref(false)
  const answered = ref(false)
  const results = ref<(boolean | null)[]>([null, null, null, null, null])

  let countdownTimer: ReturnType<typeof setInterval> | null = null
  let phaseTimeout: ReturnType<typeof setTimeout> | null = null

  const currentRiddle = ref<Riddle>(RIDDLE_POOL[0]!)

  const dotClass = (idx: number) => {
    const r = results.value[idx]
    if (r === true) return 'bg-success'
    if (r === false) return 'bg-danger'
    if (idx === currentIndex.value && phase.value !== 'finished') return 'bg-accent dot-pulse'
    return 'bg-accent/20'
  }

  const pickRiddles = (): Riddle[] => {
    const pool = [...RIDDLE_POOL]
    const picked: Riddle[] = []
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * pool.length)
      picked.push(pool.splice(idx, 1)[0]!)
    }
    return picked
  }

  const startGame = () => {
    sfxGameStart()
    gameRiddles.value = pickRiddles()
    currentIndex.value = 0
    score.value = 0
    correctCount.value = 0
    results.value = [null, null, null, null, null]
    showNextRiddle()
  }

  const showNextRiddle = () => {
    currentRiddle.value = gameRiddles.value[currentIndex.value]!
    answered.value = false
    currentTimeLimit.value = currentIndex.value < 2 ? 7 : 6
    sfxRiddleReveal()
    phase.value = 'showing'
    phaseTimeout = setTimeout(() => {
      phase.value = 'answering'
      countdown.value = currentTimeLimit.value
      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 3 && countdown.value > 0) sfxCountdownFinal()
        else if (countdown.value > 3) sfxCountdownTick()
        if (countdown.value <= 0) {
          answer(-1)
        }
      }, 1000)
    }, 800)
  }

  const answer = (choice: number) => {
    if (answered.value) return
    answered.value = true

    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = null

    const correct = choice === currentRiddle.value.answer
    lastCorrect.value = correct
    results.value[currentIndex.value] = correct
    if (correct) {
      sfxMiniGood()
      correctCount.value++
      score.value += 100
    } else {
      sfxRiddleWrong()
    }
    phase.value = 'result'

    phaseTimeout = setTimeout(() => {
      currentIndex.value++
      if (currentIndex.value >= 5) {
        if (correctCount.value === 5) {
          score.value += 300
          sfxMiniPerfect()
        }
        phase.value = 'finished'
      } else {
        showNextRiddle()
      }
    }, 1500)
  }

  const handleClaim = () => {
    sfxRewardClaim()
    emit('complete', score.value)
  }

  onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer)
    if (phaseTimeout) clearTimeout(phaseTimeout)
  })
</script>

<style scoped>
  .lantern-drop {
    animation: lantern-drop 0.6s ease-out;
  }

  @keyframes lantern-drop {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    60% {
      transform: translateY(3px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .dot-pulse {
    animation: dot-pulse 1s ease-in-out infinite;
  }

  @keyframes dot-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .time-pulse {
    animation: time-pulse 0.5s ease-in-out infinite;
  }

  @keyframes time-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .correct-flash {
    animation: correct-flash 0.4s ease-in-out;
  }

  @keyframes correct-flash {
    0% {
      background-color: transparent;
    }
    30% {
      background-color: rgba(90, 158, 111, 0.2);
    }
    100% {
      background-color: transparent;
    }
  }

  .wrong-shake {
    animation: wrong-shake 0.4s ease-in-out;
  }

  @keyframes wrong-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(3px);
    }
  }

  .finish-flash {
    animation: finish-flash 0.6s ease-in-out 3;
  }

  @keyframes finish-flash {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
</style>
