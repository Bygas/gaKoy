import { ref } from 'vue'
import type { Season, Weather, TimePeriod } from '@/types'
import type * as ToneNs from 'tone'
import { useGameStore } from '@/stores/useGameStore'
import { getTimePeriod } from '@/data/timeConstants'

// ====== Tone.js tembel yükleme (modül başlatılırken AudioContext oluşmasın) ======

type ToneModule = typeof ToneNs
let T: ToneModule | null = null

/** Tone.js’i dinamik olarak yükler ve AudioContext’i başlatır (ilk çağrı kullanıcı etkileşimi içinde olmalı) */
const loadTone = async (): Promise<ToneModule> => {
  if (!T) {
    T = await import('tone')
  }
  await T.start()
  return T
}

// ====== Ses ayarları ======

const sfxEnabled = ref(true)
const bgmEnabled = ref(true)
const sfxVolume = 0.3
const bgmVolume = 0.15

/** Doğrusal ses düzeyi → desibel */
const toDb = (v: number): number => (v <= 0 ? -Infinity : 20 * Math.log10(v))

// ====== Ses efektleri (SFX) ======

type WaveType = 'sine' | 'square' | 'triangle' | 'sawtooth'

/** Basit sentezlenmiş bir ses efekti çalar (tek kullanımlık Synth, çaldıktan sonra kendini temizler) */
const playSfx = (freq: number, duration = 0.1, type: WaveType = 'square', vol = sfxVolume) => {
  if (!sfxEnabled.value || !T || document.hidden) return
  try {
    const synth = new T.Synth({
      oscillator: { type },
      envelope: {
        attack: 0.005,
        decay: duration * 0.6,
        sustain: 0,
        release: duration * 0.3
      },
      volume: toDb(vol)
    }).toDestination()
    synth.triggerAttackRelease(freq, duration)
    setTimeout(() => safeDispose(synth), (duration + 0.5) * 1000)
  } catch {
    /* AudioContext hazır değil */
  }
}

// ====== Oyun ses efektleri ======

/** Düğme tıklaması (kısa ve çıtır bir blip) */
export const sfxClick = () => {
  playSfx(1200, 0.025, 'square', 0.12)
  setTimeout(() => playSfx(800, 0.02, 'square', 0.08), 20)
}

/** Sulama (damlanın düşüşü + yayılması) */
export const sfxWater = () => {
  playSfx(500, 0.06, 'sine', 0.2)
  setTimeout(() => playSfx(350, 0.08, 'triangle', 0.18), 50)
  setTimeout(() => playSfx(250, 0.1, 'sine', 0.12), 100)
}

/** Ekim (toprağa usulca yerleşen iki ses) */
export const sfxPlant = () => {
  playSfx(400, 0.04, 'triangle', 0.2)
  setTimeout(() => playSfx(600, 0.05, 'triangle', 0.18), 40)
  setTimeout(() => playSfx(500, 0.03, 'sine', 0.12), 80)
}

/** Hasat (neşeli üçlü yükseliş) */
export const sfxHarvest = () => {
  ;[523, 659, 784].forEach((f, i) => setTimeout(() => playSfx(f, 0.07, 'square', 0.22), i * 55))
  setTimeout(() => playSfx(784, 0.12, 'square', 0.15), 220)
}

/** Çapalama (tok bir darbe + ufalanan toprak) */
export const sfxDig = () => {
  playSfx(120, 0.06, 'sawtooth', 0.25)
  setTimeout(() => playSfx(200, 0.04, 'square', 0.18), 40)
  setTimeout(() => playSfx(350, 0.03, 'triangle', 0.1), 70)
}

/** Satın alma (berrak iki onay sesi) */
export const sfxBuy = () => {
  playSfx(660, 0.04, 'triangle', 0.2)
  setTimeout(() => playSfx(880, 0.06, 'triangle', 0.22), 40)
  setTimeout(() => playSfx(880, 0.03, 'square', 0.1), 90)
}

/** Satış / akçe kazanma (klasik zıplayan akçe sesi) */
export const sfxCoin = () => {
  playSfx(988, 0.04, 'square', 0.22)
  setTimeout(() => playSfx(1319, 0.08, 'square', 0.2), 35)
}

/** Seviye atlama (gösterişli yükselen fanfar) */
export const sfxLevelUp = () => {
  if (!sfxEnabled.value) return
  ;[523, 659, 784, 880].forEach((f, i) => setTimeout(() => playSfx(f, 0.1, 'square', 0.25), i * 80))
  setTimeout(() => playSfx(1047, 0.3, 'square', 0.22), 350)
  setTimeout(() => playSfx(1047, 0.15, 'triangle', 0.12), 500)
}

/** Saldırı (yüksekten aşağı tarayan, 8-bit vuruş hissi) */
export const sfxAttack = () => {
  playSfx(800, 0.04, 'sawtooth', 0.3)
  setTimeout(() => playSfx(400, 0.05, 'square', 0.25), 30)
  setTimeout(() => playSfx(150, 0.08, 'sawtooth', 0.2), 60)
}

/** Hasar alma (hızlı alçalıp yükselen klasik yaralanma uğultusu) */
export const sfxHurt = () => {
  playSfx(300, 0.04, 'square', 0.25)
  setTimeout(() => playSfx(150, 0.04, 'square', 0.2), 40)
  setTimeout(() => playSfx(300, 0.04, 'square', 0.2), 80)
  setTimeout(() => playSfx(120, 0.06, 'square', 0.15), 120)
}

/** Yaratıkla karşılaşma (gerilimli yükseliş, tehlike uyarısı) */
export const sfxEncounter = () => {
  ;[200, 300, 400, 600].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.25), i * 50))
}

/** Savunma / blok (kısa, metalimsi ses) */
export const sfxDefend = () => {
  playSfx(600, 0.03, 'triangle', 0.25)
  setTimeout(() => playSfx(800, 0.05, 'triangle', 0.2), 30)
}

/** Kaçış (hızlı aşağı kayan dizi) */
export const sfxFlee = () => {
  ;[500, 400, 300, 200].forEach((f, i) => setTimeout(() => playSfx(f, 0.05, 'triangle', 0.2), i * 40))
}

/** Yaratığı yenme (kısa zafer ezgisi) */
export const sfxVictory = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.1, 'square', 0.25), i * 70))
}

/** Olta sarma (gerilimli tıkırtı, art arda çekişler) */
export const sfxReel = () => {
  playSfx(700, 0.03, 'triangle', 0.18)
  setTimeout(() => playSfx(600, 0.03, 'triangle', 0.15), 35)
  setTimeout(() => playSfx(750, 0.03, 'triangle', 0.18), 70)
  setTimeout(() => playSfx(650, 0.03, 'triangle', 0.12), 105)
}

/** Balık yakalama (neşeli yükselen küçük ezgi) */
export const sfxFishCatch = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.22), i * 55))
  setTimeout(() => playSfx(1047, 0.1, 'square', 0.15), 280)
}

/** Misina kopması (ani düşüş + tok ses) */
export const sfxLineBroken = () => {
  playSfx(500, 0.04, 'sawtooth', 0.25)
  setTimeout(() => playSfx(300, 0.05, 'sawtooth', 0.2), 35)
  setTimeout(() => playSfx(120, 0.1, 'square', 0.15), 70)
}

/** Maden kazma (keskin vuruş + taş kırılması yankısı) */
export const sfxMine = () => {
  playSfx(180, 0.04, 'sawtooth', 0.25)
  setTimeout(() => playSfx(400, 0.03, 'square', 0.18), 35)
  setTimeout(() => playSfx(300, 0.03, 'triangle', 0.12), 65)
}

/** Dinlenme / uyku (yumuşak, aşağı süzülen ninni) */
export const sfxSleep = () => {
  ;[523, 440, 392, 330, 262].forEach((f, i) => setTimeout(() => playSfx(f, 0.18, 'sine', 0.12), i * 130))
}

/** Hata / başarısızlık (kısa iki homurtu) */
export const sfxError = () => {
  playSfx(220, 0.06, 'square', 0.2)
  setTimeout(() => playSfx(180, 0.08, 'square', 0.18), 70)
}

/** Toplayıcılık (çevik ve hafif çekme sesi) */
export const sfxForage = () => {
  playSfx(500, 0.04, 'triangle', 0.2)
  setTimeout(() => playSfx(660, 0.05, 'triangle', 0.18), 35)
  setTimeout(() => playSfx(550, 0.03, 'sine', 0.1), 75)
}

// ====== Mini oyunlara özel ses efektleri ======

/** Mini oyun başlangıcı (coşkulu yükselen fanfar) */
export const sfxGameStart = () => {
  ;[523, 659, 784].forEach((f, i) => setTimeout(() => playSfx(f, 0.08, 'square', 0.22), i * 70))
  setTimeout(() => playSfx(1047, 0.2, 'square', 0.2), 240)
  setTimeout(() => playSfx(1047, 0.1, 'triangle', 0.1), 380)
}

/** Geri sayım tik sesi (her saniye bir kez) */
export const sfxCountdownTick = () => {
  playSfx(600, 0.04, 'triangle', 0.15)
}

/** Geri sayımın son 3 saniyesi (daha telaşlı, iki sesli) */
export const sfxCountdownFinal = () => {
  playSfx(800, 0.05, 'square', 0.2)
  setTimeout(() => playSfx(1000, 0.04, 'square', 0.18), 50)
}

/** Mini oyun etkileşim düğmesi (dokulu geri bildirim sesi) */
export const sfxGameAction = () => {
  playSfx(500, 0.03, 'square', 0.18)
  setTimeout(() => playSfx(700, 0.025, 'triangle', 0.14), 30)
}

/** Ödül alma (akçe + kısa kutlama) */
export const sfxRewardClaim = () => {
  playSfx(880, 0.06, 'square', 0.22)
  setTimeout(() => playSfx(1047, 0.06, 'square', 0.2), 60)
  setTimeout(() => playSfx(1319, 0.1, 'square', 0.22), 120)
  setTimeout(() => playSfx(1319, 0.06, 'triangle', 0.12), 220)
}

// ====== Mini oyun sonuç sesleri ======

/** Kusursuz hamle (dört notalı kutlama) */
export const sfxMiniPerfect = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.22), i * 60))
}

/** İyi hamle (yükselen iki ses) */
export const sfxMiniGood = () => {
  playSfx(523, 0.05, 'triangle', 0.18)
  setTimeout(() => playSfx(659, 0.05, 'triangle', 0.16), 50)
}

/** Zayıf hamle (kalın tek ses) */
export const sfxMiniPoor = () => {
  playSfx(196, 0.08, 'triangle', 0.15)
}

/** Başarısız / yanlış (alçalan iki ses) */
export const sfxMiniFail = () => {
  playSfx(330, 0.07, 'square', 0.2)
  setTimeout(() => playSfx(262, 0.07, 'square', 0.18), 70)
}

/** Birincilik kutlaması (gösterişli beşli fanfar) */
export const sfxRankFirst = () => {
  ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSfx(f, 0.08, 'square', 0.22), i * 80))
  setTimeout(() => playSfx(1047, 0.3, 'square', 0.2), 320)
  setTimeout(() => playSfx(1047, 0.15, 'triangle', 0.1), 520)
}

/** İkincilik (yükselen üç ses) */
export const sfxRankSecond = () => {
  ;[523, 659, 784].forEach((f, i) => setTimeout(() => playSfx(f, 0.07, 'triangle', 0.18), i * 70))
}

/** Üçüncülük (hafif yükselen iki ses) */
export const sfxRankThird = () => {
  playSfx(523, 0.06, 'triangle', 0.15)
  setTimeout(() => playSfx(659, 0.06, 'triangle', 0.13), 60)
}

/** Dereceye girememe (yavaşça alçalan üç ses) */
export const sfxRankLose = () => {
  ;[330, 294, 262].forEach((f, i) => setTimeout(() => playSfx(f, 0.1, 'sine', 0.12), i * 100))
}

// ====== Üst üste binmeyen hızlı işlem sesleri ======

let lastLightActionTime = 0
const LIGHT_ACTION_INTERVAL = 80

/** Hızlı işlem sesi (80ms kısma içerir; kayık çekişi gibi hızlı tıklamalar için uygundur) */
export const sfxGameActionLight = () => {
  const now = Date.now()
  if (now - lastLightActionTime < LIGHT_ACTION_INTERVAL) return
  lastLightActionTime = now
  playSfx(700, 0.015, 'square', 0.1)
}

// ====== Oyuna özel ses efektleri ======

// --- Balık tutma yarışması ---

/** Balık ısırdı uyarısı */
export const sfxFishBite = () => {
  playSfx(880, 0.02, 'square', 0.2)
  setTimeout(() => playSfx(1175, 0.025, 'square', 0.2), 25)
}

/** Olta atma (aşağı süzülen tarama) */
export const sfxCastLine = () => {
  playSfx(600, 0.04, 'triangle', 0.15)
  setTimeout(() => playSfx(400, 0.04, 'triangle', 0.12), 40)
  setTimeout(() => playSfx(250, 0.05, 'triangle', 0.1), 80)
}

// --- Kayık yarışı ---

/** Kürek çekme (tok ve hafif, kısma içerir) */
let lastPaddleTime = 0
export const sfxPaddle = () => {
  const now = Date.now()
  if (now - lastPaddleTime < 100) return
  lastPaddleTime = now
  playSfx(150, 0.02, 'sine', 0.12)
}

/** Bitiş çizgisi (yükselen üç ses) */
export const sfxRaceFinish = () => {
  ;[392, 523, 659].forEach((f, i) => setTimeout(() => playSfx(f, 0.06, 'square', 0.18), i * 50))
}

// --- Bilmece fenerleri ---

/** Fener yanışı / doğru cevap (yükselen tınlama) */
export const sfxRiddleReveal = () => {
  playSfx(659, 0.04, 'sine', 0.16)
  setTimeout(() => playSfx(880, 0.05, 'sine', 0.14), 45)
}

/** Yanlış cevap (kalın uğultu) */
export const sfxRiddleWrong = () => {
  playSfx(180, 0.1, 'square', 0.15)
}

// --- Çay meclisi ---

/** Çay dökme sesi (aşağı süzülen ses) */
export const sfxTeaPour = () => {
  playSfx(400, 0.05, 'sine', 0.12)
  setTimeout(() => playSfx(300, 0.04, 'sine', 0.1), 50)
  setTimeout(() => playSfx(220, 0.05, 'sine', 0.08), 90)
}

/** Kusursuz adım zili */
export const sfxTeaBell = () => {
  playSfx(880, 0.08, 'sine', 0.15)
  setTimeout(() => playSfx(1320, 0.06, 'sine', 0.13), 60)
}

// --- Harman şenliği ---

/** Eşya seçme (kısa mızrap sesi) */
export const sfxItemSelect = () => {
  playSfx(660, 0.03, 'triangle', 0.15)
  setTimeout(() => playSfx(880, 0.025, 'triangle', 0.13), 30)
}

/** Değerlendirme davulu (4 notalı seri vuruş) */
export const sfxJudging = () => {
  ;[262, 330, 392, 523].forEach((f, i) => setTimeout(() => playSfx(f, 0.05, 'square', 0.18), i * 50))
}

// --- Testi atışı ---

/** Okun uçuşu (yükselen tarama) */
export const sfxArrowFly = () => {
  playSfx(200, 0.04, 'triangle', 0.12)
  setTimeout(() => playSfx(350, 0.04, 'triangle', 0.12), 40)
  setTimeout(() => playSfx(500, 0.05, 'triangle', 0.1), 80)
}

/** Testiye isabet (metalimsi çarpma) */
export const sfxPotClang = () => {
  playSfx(800, 0.02, 'sawtooth', 0.2)
  setTimeout(() => playSfx(1200, 0.03, 'triangle', 0.18), 20)
}

// --- Uçurtma şenliği ---

/** Rüzgâr yönü değişimi (düşük frekanslı uğultu) */
export const sfxWindGust = () => {
  playSfx(220, 0.06, 'sine', 0.08)
  setTimeout(() => playSfx(180, 0.08, 'sine', 0.06), 50)
}

/** İp çekme (kısa tıngırtı, kısma içerir) */
let lastKitePullTime = 0
export const sfxKitePull = () => {
  const now = Date.now()
  if (now - lastKitePullTime < 80) return
  lastKitePullTime = now
  playSfx(500, 0.015, 'triangle', 0.1)
}

// --- Mantı / hamur işi yapımı ---

/** Hamur açma / iç koyma (yumuşak, tok vuruş) */
export const sfxDoughStep = () => {
  playSfx(200, 0.025, 'sine', 0.1)
}

/** Bir parça tamamlandı (neşeli iki ses) */
export const sfxDumplingDone = () => {
  playSfx(660, 0.03, 'square', 0.18)
  setTimeout(() => playSfx(880, 0.03, 'square', 0.16), 35)
}

// --- Havai fişek şenliği ---

/** Havai fişek yükselişi (yukarı çıkan tarama) */
export const sfxFireworkLaunch = () => {
  playSfx(200, 0.04, 'sawtooth', 0.12)
  setTimeout(() => playSfx(400, 0.04, 'sawtooth', 0.12), 40)
  setTimeout(() => playSfx(700, 0.05, 'sawtooth', 0.1), 80)
}

/** Havai fişek patlaması (karışık patlama sesi) */
export const sfxFireworkBoom = () => {
  playSfx(400, 0.04, 'sawtooth', 0.2)
  setTimeout(() => playSfx(600, 0.06, 'square', 0.18), 20)
}

// ====== Kumarhane / oyunhane sesleri ======

/** Çarkın tek tık sesi (her hücrede bir kez, kısma içerir) */
let lastRouletteTick = 0
export const sfxRouletteTick = () => {
  const now = Date.now()
  if (now - lastRouletteTick < 40) return
  lastRouletteTick = now
  playSfx(700 + Math.random() * 200, 0.015, 'square', 0.1)
}

/** Çark dönüşü (azalan hızlı tıklar) */
export const sfxRouletteSpin = () => {
  ;[800, 750, 700, 650, 600].forEach((f, i) => setTimeout(() => playSfx(f, 0.02, 'square', 0.12), i * 40))
}

/** Çarkın durması (tok karar sesi) */
export const sfxRouletteStop = () => {
  playSfx(300, 0.06, 'triangle', 0.2)
  setTimeout(() => playSfx(200, 0.1, 'sine', 0.15), 60)
}

/** Zarın tek çarpma sesi (her değişimde bir kez, kısma içerir) */
let lastDiceTick = 0
export const sfxDiceTick = () => {
  const now = Date.now()
  if (now - lastDiceTick < 60) return
  lastDiceTick = now
  playSfx(600 + Math.random() * 400, 0.012, 'square', 0.08)
}

/** Zar sallama (hızlı küçük tıkırtılar) */
export const sfxDiceRoll = () => {
  ;[900, 700, 1000, 800, 600].forEach((f, i) => setTimeout(() => playSfx(f, 0.015, 'square', 0.1), i * 30))
}

/** Zarın yere oturması (tok vuruş) */
export const sfxDiceLand = () => {
  playSfx(150, 0.05, 'sawtooth', 0.2)
  setTimeout(() => playSfx(250, 0.04, 'triangle', 0.15), 40)
}

/** Bardak oyunu tek kayma sesi (her adımda bir kez, kısma içerir) */
let lastCupTick = 0
export const sfxCupTick = () => {
  const now = Date.now()
  if (now - lastCupTick < 70) return
  lastCupTick = now
  playSfx(350 + Math.random() * 200, 0.018, 'triangle', 0.09)
}

/** Bardak karıştırma (sağa sola hızlı kayma sesi) */
export const sfxCupShuffle = () => {
  ;[400, 500, 350, 550, 400].forEach((f, i) => setTimeout(() => playSfx(f, 0.02, 'triangle', 0.1), i * 50))
}

/** Bardağı açma / gösterme (berrak kapak açılışı) */
export const sfxCupReveal = () => {
  playSfx(600, 0.03, 'triangle', 0.18)
  setTimeout(() => playSfx(900, 0.04, 'triangle', 0.16), 35)
}

/** Cırcır böceği dövüşünde çarpışma sesi (her adımda bir kez, kısma içerir) */
let lastCricketTick = 0
export const sfxCricketTick = () => {
  const now = Date.now()
  if (now - lastCricketTick < 80) return
  lastCricketTick = now
  playSfx(400 + Math.random() * 300, 0.02, 'sawtooth', 0.1)
}

/** Cırcır böceği meydan çıkışı (titreşimli böcek ötüşü) */
export const sfxCricketChirp = () => {
  ;[1200, 1100, 1200, 1100].forEach((f, i) => setTimeout(() => playSfx(f, 0.015, 'square', 0.08), i * 25))
}

/** Cırcır böceği çarpışması (kısa darbe) */
export const sfxCricketClash = () => {
  playSfx(300, 0.03, 'sawtooth', 0.2)
  setTimeout(() => playSfx(500, 0.04, 'square', 0.18), 30)
}

/** Kart çevirme */
export const sfxCardFlip = () => {
  playSfx(800, 0.02, 'triangle', 0.12)
  setTimeout(() => playSfx(600, 0.02, 'triangle', 0.1), 25)
}

/** Bahis / artırma (pul sürme sesi) */
export const sfxChipBet = () => {
  playSfx(500, 0.02, 'square', 0.15)
  setTimeout(() => playSfx(700, 0.025, 'triangle', 0.12), 25)
  setTimeout(() => playSfx(600, 0.02, 'square', 0.1), 50)
}

/** Kâğıt bırakma / çekilme (kalın bırakış sesi) */
export const sfxFoldCards = () => {
  playSfx(300, 0.04, 'sine', 0.12)
  setTimeout(() => playSfx(200, 0.05, 'sine', 0.1), 40)
}

/** Ateş etme (kalın, patlayıcı ses) */
export const sfxGunshot = () => {
  playSfx(100, 0.06, 'sawtooth', 0.3)
  setTimeout(() => playSfx(80, 0.08, 'square', 0.25), 30)
  setTimeout(() => playSfx(150, 0.04, 'sawtooth', 0.15), 70)
}

/** Boş tetik (kuru klik sesi) */
export const sfxGunEmpty = () => {
  playSfx(400, 0.02, 'triangle', 0.15)
  setTimeout(() => playSfx(300, 0.02, 'triangle', 0.1), 25)
}

/** Kumar kazanma (sfxCoin'den daha gösterişli akçe yağmuru) */
export const sfxCasinoWin = () => {
  ;[880, 1047, 1319, 1047, 1319].forEach((f, i) => setTimeout(() => playSfx(f, 0.05, 'square', 0.2), i * 50))
}

/** Kumar kaybı (aşağı inen hüzünlü ezgi) */
export const sfxCasinoLose = () => {
  ;[330, 294, 262, 220].forEach((f, i) => setTimeout(() => playSfx(f, 0.08, 'sine', 0.12), i * 80))
}

// ====== Arka plan müziği (beş sesli ezgi düzeni) ======

// Beş sesli dizi: C D E G A
// C3=131 D3=147 E3=165 G3=196 A3=220
// C4=262 D4=294 E4=330 G4=392 A4=440
// C5=523 D5=587 E5=659 G5=784 A5=880

// ---- BGM türleri ----

type SeasonBgmType = 'spring' | 'summer' | 'autumn' | 'winter'
type FestivalBgmType = 'festival_spring' | 'festival_summer' | 'festival_autumn' | 'festival_winter'
type MinigameBgmType =
  | 'minigame_fishing'
  | 'minigame_dragon_boat'
  | 'minigame_lantern_riddle'
  | 'minigame_tea_contest'
  | 'minigame_harvest_fair'
  | 'minigame_pot_throwing'
  | 'minigame_kite_flying'
  | 'minigame_dumpling'
  | 'minigame_firework'
  | 'hanhai'
type BgmType = SeasonBgmType | FestivalBgmType | MinigameBgmType | 'battle'

let currentFestivalOverride: FestivalBgmType | MinigameBgmType | null = null

// ---- İlkbahar BGM (aydınlık ve yükselen, sabah tarlası havası) ----

const SPRING_MELODY: number[] = [
  330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 440, 523, 440, 392, 330, 0, 523, 440, 392, 330, 392, 440, 523, 587, 523, 440, 392, 440,
  392, 330, 294, 0, 294, 330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 330, 294, 262, 294, 0, 440, 392, 330, 392, 440, 523, 440, 392,
  330, 294, 330, 392, 330, 294, 262, 0
]

const SPRING_BASS: number[] = [131, 147, 165, 196, 220, 196, 165, 131, 147, 165, 196, 131, 220, 196, 165, 131]

// ---- Yaz BGM (hareketli, yüksek tonda, öğle sıcağı ve su kenarı) ----

const SUMMER_MELODY: number[] = [
  523, 587, 659, 587, 523, 440, 523, 587, 659, 784, 659, 587, 523, 440, 392, 0, 440, 523, 587, 523, 440, 392, 440, 523, 587, 523, 440, 392,
  330, 392, 440, 0, 784, 659, 587, 523, 587, 659, 523, 440, 392, 440, 523, 587, 523, 440, 392, 0, 392, 440, 523, 587, 659, 587, 523, 440,
  392, 330, 392, 440, 392, 330, 262, 0
]

const SUMMER_BASS: number[] = [165, 196, 220, 196, 131, 165, 196, 220, 196, 165, 131, 147, 165, 196, 220, 131]

// ---- Güz BGM (yavaşça alçalan, dingin ve düşünceli) ----

const AUTUMN_MELODY: number[] = [
  440, 392, 330, 294, 262, 294, 330, 262, 440, 392, 330, 294, 262, 294, 262, 0, 330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392,
  330, 294, 262, 0, 523, 440, 392, 330, 262, 294, 330, 294, 262, 294, 330, 392, 330, 294, 262, 0, 294, 330, 392, 440, 392, 330, 294, 262,
  294, 262, 294, 330, 294, 262, 262, 0
]

const AUTUMN_BASS: number[] = [220, 196, 165, 131, 147, 165, 196, 165, 131, 147, 165, 196, 220, 196, 165, 131]

// ---- Kış BGM (seyrek, berrak ve içe dönük) ----

const WINTER_MELODY: number[] = [
  262, 0, 330, 0, 392, 330, 262, 0, 294, 0, 392, 0, 440, 392, 330, 0, 440, 392, 330, 262, 330, 392, 330, 0, 262, 294, 330, 294, 262, 0, 262,
  0, 330, 392, 440, 0, 392, 330, 0, 262, 294, 330, 0, 294, 262, 0, 262, 0, 392, 330, 294, 262, 294, 330, 392, 330, 294, 262, 0, 294, 262, 0,
  262, 0
]

const WINTER_BASS: number[] = [131, 0, 165, 0, 196, 0, 131, 0, 147, 0, 165, 131, 196, 165, 131, 0]

// ---- Savaş BGM (hızlı, itici ve gerilimli) ----

const BATTLE_MELODY: number[] = [
  // Bölüm 1: Hızlı yükselen motif
  330, 392, 440, 523, 330, 392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392,
  // Bölüm 2: Kesik darbeler
  523, 0, 523, 587, 0, 659, 587, 523, 440, 0, 440, 523, 0, 392, 440, 0,
  // Bölüm 3: Yüksek tonda gerilim
  659, 587, 523, 587, 659, 784, 659, 587, 523, 440, 392, 440, 523, 587, 659, 0,
  // Bölüm 4: Düşüş ve dönüş
  784, 659, 587, 523, 392, 440, 523, 659, 587, 523, 440, 392, 330, 392, 440, 0
]

const BATTLE_BASS: number[] = [131, 196, 131, 196, 220, 196, 165, 196, 131, 220, 196, 165, 131, 165, 196, 220]

// ---- Bayram BGM’leri ----

const FESTIVAL_SPRING_MELODY: number[] = [523, 587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 523, 0]
const FESTIVAL_SPRING_BASS: number[] = [131, 196, 165, 220]

const FESTIVAL_SUMMER_MELODY: number[] = [440, 523, 587, 523, 440, 392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 0]
const FESTIVAL_SUMMER_BASS: number[] = [220, 196, 165, 196]

const FESTIVAL_AUTUMN_MELODY: number[] = [392, 440, 523, 440, 392, 330, 392, 440, 523, 587, 523, 440, 523, 440, 392, 0]
const FESTIVAL_AUTUMN_BASS: number[] = [196, 220, 165, 131]

const FESTIVAL_WINTER_MELODY: number[] = [262, 330, 392, 440, 523, 440, 392, 330, 440, 523, 587, 659, 587, 523, 440, 0]
const FESTIVAL_WINTER_BASS: number[] = [131, 165, 196, 220]

// ---- Mini oyun BGM’leri ----

// Balık tutma yarışması: su gibi akıp giden, sabırlı bekleyiş havası
const MINIGAME_FISHING_MELODY: number[] = [
  196, 220, 262, 294, 262, 220, 196, 0, 220, 262, 294, 330, 294, 262, 220, 196, 262, 294, 330, 392, 330, 294, 262, 0, 294, 330, 392, 440,
  392, 330, 294, 262, 330, 294, 262, 220, 262, 294, 330, 0, 392, 330, 294, 262, 220, 262, 220, 0
]
const MINIGAME_FISHING_BASS: number[] = [131, 196, 165, 220, 131, 196, 165, 131]

// Kayık yarışı: hızlı ve itici, davul gibi aceleci
const MINIGAME_DRAGON_MELODY: number[] = [
  330, 392, 440, 523, 440, 392, 330, 392, 440, 523, 587, 523, 440, 0, 440, 523, 330, 392, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392,
  440, 523, 440, 0, 523, 587, 659, 587, 523, 440, 523, 587, 659, 784, 659, 587, 523, 0, 523, 0, 440, 523, 587, 523, 440, 392, 440, 523, 330,
  392, 440, 392, 330, 392, 330, 0
]
const MINIGAME_DRAGON_BASS: number[] = [131, 196, 131, 220, 165, 196, 131, 196]

// Bilmece fenerleri: titrek ışıklar, gizem ve düşünce
const MINIGAME_RIDDLE_MELODY: number[] = [
  330, 0, 440, 392, 330, 0, 294, 262, 330, 392, 440, 0, 392, 330, 0, 262, 294, 330, 0, 440, 392, 330, 294, 0, 262, 330, 392, 0, 440, 523,
  440, 0, 392, 330, 0, 294, 330, 392, 0, 440, 523, 440, 392, 0, 330, 294, 262, 0
]
const MINIGAME_RIDDLE_BASS: number[] = [131, 0, 165, 0, 196, 0, 131, 0]

// Çay meclisi: zarif, ince işlenmiş ve eski ezgi tadında
const MINIGAME_TEA_MELODY: number[] = [
  440, 392, 330, 294, 330, 392, 440, 0, 523, 440, 392, 330, 392, 440, 523, 0, 440, 523, 587, 523, 440, 392, 330, 392, 440, 392, 330, 294,
  262, 294, 330, 0, 330, 392, 440, 523, 440, 392, 330, 294, 330, 294, 262, 294, 330, 392, 330, 0
]
const MINIGAME_TEA_BASS: number[] = [220, 196, 165, 131, 220, 196, 165, 131]

// Harman şenliği: bolluklu, neşeli, ürün bereketi havası
const MINIGAME_HARVEST_MELODY: number[] = [
  262, 294, 330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392, 330, 0, 523, 587, 659, 587, 523, 440, 392, 440, 523, 440, 392, 330,
  294, 330, 392, 0, 440, 523, 587, 659, 587, 523, 440, 392, 330, 392, 440, 523, 440, 392, 330, 0
]
const MINIGAME_HARVEST_BASS: number[] = [131, 165, 196, 220, 131, 196, 165, 131]

// Testi atışı: sakin, odaklı ve disiplinli
const MINIGAME_POT_MELODY: number[] = [
  294, 330, 392, 330, 294, 0, 262, 294, 330, 392, 440, 392, 330, 0, 294, 330, 392, 440, 523, 440, 392, 330, 294, 330, 392, 330, 294, 262,
  294, 330, 392, 0, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392, 330, 294, 262, 294, 262, 0
]
const MINIGAME_POT_BASS: number[] = [147, 196, 131, 165, 147, 196, 165, 131]

// Uçurtma şenliği: hafif, yüksek ve göğe açılan
const MINIGAME_KITE_MELODY: number[] = [
  392, 440, 523, 587, 523, 440, 392, 0, 440, 523, 587, 659, 587, 523, 440, 0, 523, 587, 659, 784, 659, 587, 523, 440, 392, 440, 523, 440,
  392, 0, 330, 392, 440, 523, 587, 523, 440, 392, 440, 523, 587, 523, 440, 392, 330, 392, 330, 0
]
const MINIGAME_KITE_BASS: number[] = [196, 220, 196, 165, 131, 196, 165, 196]

// Kış sofrası hamur işi yapımı: sıcak, kalabalık ve ev tadında
const MINIGAME_DUMPLING_MELODY: number[] = [
  262, 294, 330, 294, 262, 294, 330, 392, 330, 294, 262, 294, 330, 392, 440, 0, 330, 392, 440, 392, 330, 294, 330, 392, 440, 523, 440, 392,
  330, 294, 262, 0, 294, 330, 392, 440, 392, 330, 294, 262, 294, 330, 392, 330, 294, 262, 262, 0
]
const MINIGAME_DUMPLING_BASS: number[] = [131, 165, 196, 131, 165, 131, 196, 165]

// Yıl sonu havai fişekleri: parlak, dalgalı ve görkemli
const MINIGAME_FIREWORK_MELODY: number[] = [
  262, 330, 392, 523, 0, 523, 659, 784, 659, 523, 392, 0, 330, 392, 523, 659, 784, 880, 784, 659, 523, 392, 330, 0, 523, 659, 784, 0, 880,
  784, 659, 523, 392, 523, 659, 784, 659, 523, 392, 330, 262, 330, 392, 523, 659, 784, 880, 0
]
const MINIGAME_FIREWORK_BASS: number[] = [131, 196, 220, 196, 131, 165, 196, 220]

// ---- Hanhai BGM (uzak diyar, ipek yolu ve gizemli oyunhane havası) ----

const HANHAI_MELODY: number[] = [
  // Bölüm 1: Gizemli açılış, alt perdede gezinme
  220, 262, 294, 262, 220, 0, 196, 220, 262, 330, 294, 262, 220, 196, 220, 0,
  // Bölüm 2: Yükselen keşif duygusu
  294, 330, 392, 330, 294, 262, 294, 330, 392, 440, 392, 330, 294, 0, 262, 294,
  // Bölüm 3: Zirve, oyunhane heyecanı
  440, 392, 330, 392, 440, 523, 440, 392, 330, 294, 262, 294, 330, 392, 440, 0,
  // Bölüm 4: Yeniden döngüye iniş
  330, 294, 262, 220, 262, 294, 330, 262, 220, 196, 220, 262, 294, 262, 220, 0
]

const HANHAI_BASS: number[] = [131, 165, 196, 165, 131, 196, 220, 196, 131, 165, 196, 220, 165, 131, 196, 165]

// ---- BGM yapı tablosu ----

interface BgmConfig {
  melody: number[]
  bass: number[]
  noteDur: number
  melodyWave: WaveType
  bassWave: WaveType
  /** Bas her kaç vuruşta bir çalınır (varsayılan 4) */
  bassInterval?: number
}

const BGM_CONFIG: Record<BgmType, BgmConfig> = {
  spring: { melody: SPRING_MELODY, bass: SPRING_BASS, noteDur: 0.38, melodyWave: 'triangle', bassWave: 'sine' },
  summer: { melody: SUMMER_MELODY, bass: SUMMER_BASS, noteDur: 0.34, melodyWave: 'triangle', bassWave: 'sine' },
  autumn: { melody: AUTUMN_MELODY, bass: AUTUMN_BASS, noteDur: 0.42, melodyWave: 'triangle', bassWave: 'sine' },
  winter: { melody: WINTER_MELODY, bass: WINTER_BASS, noteDur: 0.5, melodyWave: 'sine', bassWave: 'sine' },
  festival_spring: { melody: FESTIVAL_SPRING_MELODY, bass: FESTIVAL_SPRING_BASS, noteDur: 0.3, melodyWave: 'square', bassWave: 'triangle' },
  festival_summer: { melody: FESTIVAL_SUMMER_MELODY, bass: FESTIVAL_SUMMER_BASS, noteDur: 0.4, melodyWave: 'sine', bassWave: 'sine' },
  festival_autumn: {
    melody: FESTIVAL_AUTUMN_MELODY,
    bass: FESTIVAL_AUTUMN_BASS,
    noteDur: 0.28,
    melodyWave: 'square',
    bassWave: 'triangle'
  },
  festival_winter: { melody: FESTIVAL_WINTER_MELODY, bass: FESTIVAL_WINTER_BASS, noteDur: 0.35, melodyWave: 'triangle', bassWave: 'sine' },
  battle: { melody: BATTLE_MELODY, bass: BATTLE_BASS, noteDur: 0.15, melodyWave: 'sawtooth', bassWave: 'square', bassInterval: 2 },
  // Mini oyun BGM’leri
  minigame_fishing: {
    melody: MINIGAME_FISHING_MELODY,
    bass: MINIGAME_FISHING_BASS,
    noteDur: 0.4,
    melodyWave: 'triangle',
    bassWave: 'sine'
  },
  minigame_dragon_boat: {
    melody: MINIGAME_DRAGON_MELODY,
    bass: MINIGAME_DRAGON_BASS,
    noteDur: 0.18,
    melodyWave: 'square',
    bassWave: 'square',
    bassInterval: 2
  },
  minigame_lantern_riddle: {
    melody: MINIGAME_RIDDLE_MELODY,
    bass: MINIGAME_RIDDLE_BASS,
    noteDur: 0.45,
    melodyWave: 'sine',
    bassWave: 'sine'
  },
  minigame_tea_contest: { melody: MINIGAME_TEA_MELODY, bass: MINIGAME_TEA_BASS, noteDur: 0.42, melodyWave: 'sine', bassWave: 'triangle' },
  minigame_harvest_fair: {
    melody: MINIGAME_HARVEST_MELODY,
    bass: MINIGAME_HARVEST_BASS,
    noteDur: 0.3,
    melodyWave: 'square',
    bassWave: 'triangle'
  },
  minigame_pot_throwing: { melody: MINIGAME_POT_MELODY, bass: MINIGAME_POT_BASS, noteDur: 0.3, melodyWave: 'sawtooth', bassWave: 'square' },
  minigame_kite_flying: { melody: MINIGAME_KITE_MELODY, bass: MINIGAME_KITE_BASS, noteDur: 0.28, melodyWave: 'triangle', bassWave: 'sine' },
  minigame_dumpling: {
    melody: MINIGAME_DUMPLING_MELODY,
    bass: MINIGAME_DUMPLING_BASS,
    noteDur: 0.24,
    melodyWave: 'triangle',
    bassWave: 'triangle'
  },
  minigame_firework: {
    melody: MINIGAME_FIREWORK_MELODY,
    bass: MINIGAME_FIREWORK_BASS,
    noteDur: 0.22,
    melodyWave: 'square',
    bassWave: 'sawtooth',
    bassInterval: 2
  },
  // Hanhai BGM
  hanhai: { melody: HANHAI_MELODY, bass: HANHAI_BASS, noteDur: 0.32, melodyWave: 'sawtooth', bassWave: 'square', bassInterval: 2 }
}

// ---- Hava durumu değiştiricileri ----

type NoiseType = 'white' | 'pink' | 'brown'

interface WeatherModifier {
  tempoScale: number
  volumeScale: number
  melodyWaveOverride?: WaveType
  noiseType?: NoiseType
  noiseVolume?: number
  noiseFilterFreq?: number
  noiseFilterType?: BiquadFilterType
  detuneAmount?: number
}

const WEATHER_MODIFIERS: Record<Weather, WeatherModifier> = {
  sunny: {
    tempoScale: 1.0,
    volumeScale: 1.0
  },
  rainy: {
    tempoScale: 1.15,
    volumeScale: 0.85,
    noiseType: 'brown',
    noiseVolume: 0.04,
    noiseFilterFreq: 800,
    noiseFilterType: 'lowpass',
    detuneAmount: 5
  },
  stormy: {
    tempoScale: 0.9,
    volumeScale: 0.75,
    melodyWaveOverride: 'sawtooth',
    noiseType: 'brown',
    noiseVolume: 0.06,
    noiseFilterFreq: 600,
    noiseFilterType: 'lowpass',
    detuneAmount: 10
  },
  snowy: {
    tempoScale: 1.25,
    volumeScale: 0.7,
    melodyWaveOverride: 'sine',
    noiseType: 'white',
    noiseVolume: 0.02,
    noiseFilterFreq: 2000,
    noiseFilterType: 'lowpass',
    detuneAmount: 8
  },
  windy: {
    tempoScale: 0.95,
    volumeScale: 0.9,
    noiseType: 'pink',
    noiseVolume: 0.05,
    noiseFilterFreq: 800,
    noiseFilterType: 'bandpass',
    detuneAmount: 3
  },
  green_rain: {
    tempoScale: 1.1,
    volumeScale: 0.8,
    noiseType: 'brown',
    noiseVolume: 0.05,
    noiseFilterFreq: 1000,
    noiseFilterType: 'lowpass',
    detuneAmount: 6
  }
}

// ---- Günün vakti değiştiricileri ----

interface TimeModifier {
  volumeScale: number
  tempoScale: number
  detuneOffset: number
  bassVolumeScale: number
}

const TIME_MODIFIERS: Record<TimePeriod, TimeModifier> = {
  morning: { volumeScale: 1.0, tempoScale: 1.0, detuneOffset: 0, bassVolumeScale: 0.8 },
  afternoon: { volumeScale: 0.95, tempoScale: 1.05, detuneOffset: 0, bassVolumeScale: 1.0 },
  evening: { volumeScale: 0.85, tempoScale: 1.1, detuneOffset: 3, bassVolumeScale: 1.1 },
  night: { volumeScale: 0.7, tempoScale: 1.2, detuneOffset: 6, bassVolumeScale: 1.3 },
  late_night: { volumeScale: 0.55, tempoScale: 1.3, detuneOffset: 10, bassVolumeScale: 1.5 }
}

// ====== BGM oynatma çekirdeği ======

let bgmPlaying = false
let bgmLoopId = 0
let melodySynth: any = null
let bassSynth: any = null
let ambientNoise: any = null
let ambientFilter: any = null

/** Tone düğümünü güvenle temizler (zaten dispose edilmişse sessizce geçer) */
const safeDispose = (node: any) => {
  try {
    node?.dispose()
  } catch {
    /* zaten temizlenmiş */
  }
}

/** Ortam ses katmanını durdurur */
const stopAmbient = () => {
  if (ambientNoise?.state === 'started') {
    try {
      ambientNoise.stop()
    } catch {
      /* görmezden gel */
    }
  }
  safeDispose(ambientNoise)
  safeDispose(ambientFilter)
  ambientNoise = null
  ambientFilter = null
}

/** BGM sentezleyicilerini ve ortam katmanını temizler */
const cleanupBgm = () => {
  safeDispose(melodySynth)
  safeDispose(bassSynth)
  melodySynth = null
  bassSynth = null
  stopAmbient()
}

/** BGM döngüsünü başlatır */
const playBgmLoop = async (type: BgmType = 'spring', weather: Weather = 'sunny') => {
  if (!bgmEnabled.value || bgmPlaying) return
  bgmPlaying = true
  const myLoopId = ++bgmLoopId

  // Tone.js’i dinamik yükle ve AudioContext’i başlat
  let Tone: ToneModule
  try {
    Tone = await loadTone()
  } catch {
    bgmPlaying = false
    return
  }

  // await sonrası durum yeniden kontrol edilir
  if (!bgmEnabled.value || !bgmPlaying || myLoopId !== bgmLoopId) {
    if (myLoopId === bgmLoopId) bgmPlaying = false
    return
  }

  const baseConfig = BGM_CONFIG[type]
  const isBattle = type === 'battle'
  const weatherMod = isBattle ? WEATHER_MODIFIERS.sunny : WEATHER_MODIFIERS[weather]

  // Hava etkisi (döngü boyunca sabit)
  const weatherNoteDur = baseConfig.noteDur * weatherMod.tempoScale
  const weatherMelodyWave = weatherMod.melodyWaveOverride ?? baseConfig.melodyWave
  const weatherBassWave = baseConfig.bassWave
  const weatherVolume = bgmVolume * weatherMod.volumeScale
  const weatherDetune = weatherMod.detuneAmount ?? 0

  // Ezgi sentezleyicisi
  melodySynth = new Tone.Synth({
    oscillator: { type: weatherMelodyWave },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.08, release: 0.1 },
    volume: toDb(weatherVolume)
  }).toDestination()

  // Bas sentezleyicisi
  bassSynth = new Tone.Synth({
    oscillator: { type: weatherBassWave },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.2 },
    volume: toDb(weatherVolume * 0.5)
  }).toDestination()

  if (weatherDetune) {
    melodySynth.detune.value = weatherDetune
    bassSynth.detune.value = weatherDetune * 0.5
  }

  // Ortam gürültüsü katmanı başlatılır (yağmur/rüzgâr/kar sesi)
  if (weatherMod.noiseVolume && weatherMod.noiseFilterFreq) {
    try {
      ambientFilter = new Tone.Filter({
        frequency: weatherMod.noiseFilterFreq,
        type: weatherMod.noiseFilterType ?? 'lowpass'
      }).toDestination()

      ambientNoise = new Tone.Noise({
        type: weatherMod.noiseType ?? 'pink',
        volume: toDb(weatherMod.noiseVolume),
        fadeIn: 0.5,
        fadeOut: 0.3
      })
      ambientNoise.connect(ambientFilter)
      ambientNoise.start()
    } catch {
      /* ortam sesi kurulamadı */
    }
  }

  let noteIndex = 0

  const playNext = () => {
    // Devam edilmeli mi kontrolü
    if (!bgmEnabled.value || !bgmPlaying || myLoopId !== bgmLoopId) {
      if (myLoopId === bgmLoopId) {
        bgmPlaying = false
        cleanupBgm()
      }
      return
    }

    // Sentezleyiciler temizlenmişse çık
    if (!melodySynth || !bassSynth) return

    // Gün vakti etkisi (her notada dinamik okunur, savaşta atlanır)
    const gameStore = useGameStore()
    const timeMod = isBattle ? TIME_MODIFIERS.morning : TIME_MODIFIERS[getTimePeriod(gameStore.hour)]

    // Son parametreleri birleştir
    const noteDur = weatherNoteDur * timeMod.tempoScale
    const volume = weatherVolume * timeMod.volumeScale
    const detune = weatherDetune + timeMod.detuneOffset

    const freq = baseConfig.melody[noteIndex % baseConfig.melody.length]!

    try {
      // Ezgi ses düzeyi ve kaydırma
      melodySynth.volume.value = toDb(volume)
      if (detune !== 0) melodySynth.detune.value = detune

      // Ezgi notası (freq=0 ise sus)
      if (freq > 0) {
        melodySynth.triggerAttackRelease(freq, noteDur * 0.8)
      }

      // Bas — varsayılan olarak her 4 vuruşta bir
      const bassInterval = baseConfig.bassInterval ?? 4
      if (noteIndex % bassInterval === 0) {
        const bassIndex = Math.floor(noteIndex / bassInterval) % baseConfig.bass.length
        const bassFreq = baseConfig.bass[bassIndex]!
        if (bassFreq > 0) {
          bassSynth.volume.value = toDb(volume * timeMod.bassVolumeScale * 0.5)
          if (detune !== 0) bassSynth.detune.value = detune * 0.5
          bassSynth.triggerAttackRelease(bassFreq, noteDur * 3)
        }
      }
    } catch {
      /* synth temizlenmiş olabilir */
    }

    noteIndex++
    setTimeout(playNext, noteDur * 1000)
  }

  playNext()
}

/** BGM’yi durdurur */
const stopBgm = () => {
  bgmPlaying = false
  cleanupBgm()
}

/** Şu anda çalması gereken BGM türünü ve havayı çözümler */
const resolveCurrentBgm = (): { type: BgmType; weather: Weather } => {
  const gameStore = useGameStore()
  if (currentFestivalOverride) {
    return { type: currentFestivalOverride, weather: 'sunny' }
  }
  return { type: gameStore.season as SeasonBgmType, weather: gameStore.weather as Weather }
}

// ====== Sayfa görünürlüğü işlemleri (sekme değişince sesi durdur / sürdür) ======

let bgmWasPlayingBeforeHidden = false

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    bgmWasPlayingBeforeHidden = bgmPlaying
    if (bgmPlaying) stopBgm()
  } else {
    if (bgmWasPlayingBeforeHidden && bgmEnabled.value) {
      const { type, weather } = resolveCurrentBgm()
      void playBgmLoop(type, weather)
    }
    bgmWasPlayingBeforeHidden = false
  }
})

// ====== Dışa açılan composable ======

export const useAudio = () => {
  const toggleSfx = () => {
    sfxEnabled.value = !sfxEnabled.value
  }

  const toggleBgm = () => {
    bgmEnabled.value = !bgmEnabled.value
    if (bgmEnabled.value) {
      const { type, weather } = resolveCurrentBgm()
      void playBgmLoop(type, weather)
    } else {
      stopBgm()
    }
  }

  /** BGM’yi başlatır (mevcut mevsim + havaya göre) */
  const startBgm = () => {
    if (bgmEnabled.value && !bgmPlaying) {
      const { type, weather } = resolveCurrentBgm()
      void playBgmLoop(type, weather)
    }
  }

  /** Mevcut mevsim / hava BGM’sine zorla geçer (gün sonu sonrası kullanılır) */
  const switchToSeasonalBgm = () => {
    if (!bgmEnabled.value) return
    stopBgm()
    const { type, weather } = resolveCurrentBgm()
    void playBgmLoop(type, weather)
  }

  /** Savaş BGM’sine geçer */
  const startBattleBgm = () => {
    if (!bgmEnabled.value) return
    stopBgm()
    void playBgmLoop('battle', 'sunny')
  }

  /** Savaştan önceki BGM’ye döner (mevsim / bayram) */
  const resumeNormalBgm = () => {
    if (!bgmEnabled.value) return
    stopBgm()
    const { type, weather } = resolveCurrentBgm()
    void playBgmLoop(type, weather)
  }

  /** Bayram BGM’sini başlatır */
  const startFestivalBgm = (season: Season) => {
    if (!bgmEnabled.value) return
    const festivalType = `festival_${season}` as FestivalBgmType
    currentFestivalOverride = festivalType
    stopBgm()
    void playBgmLoop(festivalType, 'sunny')
  }

  /** Mini oyuna özel BGM’yi başlatır */
  const startMinigameBgm = (festivalType: string) => {
    if (!bgmEnabled.value) return
    const MINIGAME_BGM_MAP: Record<string, MinigameBgmType> = {
      fishing_contest: 'minigame_fishing',
      dragon_boat: 'minigame_dragon_boat',
      lantern_riddle: 'minigame_lantern_riddle',
      tea_contest: 'minigame_tea_contest',
      harvest_fair: 'minigame_harvest_fair',
      pot_throwing: 'minigame_pot_throwing',
      kite_flying: 'minigame_kite_flying',
      dumpling_making: 'minigame_dumpling',
      firework_show: 'minigame_firework'
    }
    const bgmType = MINIGAME_BGM_MAP[festivalType]
    if (!bgmType) return
    currentFestivalOverride = bgmType
    stopBgm()
    void playBgmLoop(bgmType, 'sunny')
  }

  /** Bayram BGM’sini bitirir, mevsim ezgisine döner */
  const endFestivalBgm = () => {
    currentFestivalOverride = null
    if (bgmEnabled.value) {
      switchToSeasonalBgm()
    }
  }

  /** Hanhai BGM’sini başlatır */
  const startHanhaiBgm = () => {
    if (!bgmEnabled.value) return
    currentFestivalOverride = 'hanhai'
    stopBgm()
    void playBgmLoop('hanhai', 'sunny')
  }

  /** Hanhai BGM’sini bitirir, mevsim ezgisine döner */
  const endHanhaiBgm = () => {
    currentFestivalOverride = null
    if (bgmEnabled.value) {
      switchToSeasonalBgm()
    }
  }

  return {
    sfxEnabled,
    bgmEnabled,
    toggleSfx,
    toggleBgm,
    startBgm,
    stopBgm,
    startBattleBgm,
    resumeNormalBgm,
    switchToSeasonalBgm,
    startFestivalBgm,
    startMinigameBgm,
    endFestivalBgm,
    startHanhaiBgm,
    endHanhaiBgm
  }
          }
