import { ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { PASSOUT_HOUR, MIDNIGHT_HOUR } from '@/data/timeConstants'
import { addLog } from './useGameLog'
import { handleEndDay } from './useEndDay'

// === Sabitler ===
/** Stardew benzeri akış: 0.7 gerçek saniye = oyun içinde 1 dakika */
const REAL_MS_PER_GAME_MINUTE = 700
/** tick aralığı (ms), küçüldükçe akış daha yumuşak görünür */
const TICK_MS = 200

// === Modül düzeyi tekil durum ===
const gameSpeed = ref(1)
const isPaused = ref(true)
let timerId: ReturnType<typeof setInterval> | null = null
/** Sayfa gizlenmeden önce saat işliyor muydu? (geri açınca sürdürmek için) */
let wasRunningBeforeHidden = false

/** Her tickte ilerleyen oyun saati miktarı */
const getHoursPerTick = (): number => {
  const minutesPerTick = (TICK_MS / REAL_MS_PER_GAME_MINUTE) * gameSpeed.value
  return minutesPerTick / 60
}

/** Saat tick'i */
const tick = () => {
  if (isPaused.value) return

  const gameStore = useGameStore()
  const prevHour = gameStore.hour
  const hoursPerTick = getHoursPerTick()
  const newHour = prevHour + hoursPerTick

  // Bayılma saatine ulaşıldıysa günü otomatik sonlandır
  if (newHour >= PASSOUT_HOUR) {
    gameStore.hour = PASSOUT_HOUR
    isPaused.value = true
    addLog('Gece ikinci saat vurdu, artık ayakta duramadın…')
    handleEndDay()
    // Yeni gün başlayınca saat yeniden yürüsün
    // (handleEndDay bir pencere açarsa, GameLayout izleyicisi saati yine durdurur)
    isPaused.value = false
    return
  }

  gameStore.hour = newHour

  // Gece yarısını geçme uyarısı (yalnız bir kez; advanceTime ile aynı işareti paylaşır)
  if (!gameStore.midnightWarned && prevHour < MIDNIGHT_HOUR && newHour >= MIDNIGHT_HOUR) {
    gameStore.midnightWarned = true
    addLog('Gece yarısı geçti, göz kapaklarına ağırlık çökmeye başladı…')
  }
}

export const useGameClock = () => {
  /** Gerçek zamanlı oyun saatini başlat */
  const startClock = () => {
    if (timerId) return
    isPaused.value = false
    timerId = setInterval(tick, TICK_MS)
  }

  /** Gerçek zamanlı oyun saatini durdur (interval yok edilir) */
  const stopClock = () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
    isPaused.value = true
  }

  /** Saati duraklat (interval kalır ama tick işlemez) */
  const pauseClock = () => {
    isPaused.value = true
  }

  /** Saati yeniden yürüt */
  const resumeClock = () => {
    isPaused.value = false
  }

  /** Hız katsayısını ayarla */
  const setSpeed = (speed: number) => {
    gameSpeed.value = speed
  }

  /** Hızı döngüyle değiştir: 1→2→3→1 */
  const cycleSpeed = () => {
    gameSpeed.value = gameSpeed.value >= 3 ? 1 : gameSpeed.value + 1
  }

  /** Duraklat / sürdür arasında geçiş yap */
  const togglePause = () => {
    isPaused.value = !isPaused.value
  }

  return {
    gameSpeed,
    isPaused,
    startClock,
    stopClock,
    pauseClock,
    resumeClock,
    setSpeed,
    cycleSpeed,
    togglePause
  }
}

// === Sayfa görünürlüğü denetimi ===
// Sekme değişince saati durdurur; böylece arka planda zaman birikip sıçrama yapmaz
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    wasRunningBeforeHidden = !isPaused.value
    if (!isPaused.value) isPaused.value = true
  } else {
    if (wasRunningBeforeHidden) isPaused.value = false
    wasRunningBeforeHidden = false
  }
})
