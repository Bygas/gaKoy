import { ref } from 'vue'
import Qmsg from 'qmsg'

export type FloatColor = 'danger' | 'success' | 'accent' | 'water'

export interface QmsgConfigOptions {
  position: string
  timeout: number
  maxNums: number
  isLimitWidth: boolean
  limitWidthNum: number
  limitWidthWrap: 'no-wrap' | 'wrap' | 'ellipsis'
  animation: boolean
  autoClose: boolean
  showClose: boolean
  showIcon: boolean
  showReverse: boolean
}

// Qmsg genel görünüm ayarları
Qmsg.config({
  position: 'top',
  showIcon: false,
  maxNums: 5,
  timeout: 2500,
  isHTML: true,
  useShadowRoot: false
})

/** Qmsg bildirim ayarlarını topluca uygula */
export const applyQmsgConfig = (opts: QmsgConfigOptions) => {
  Qmsg.config({
    isHTML: true,
    position: opts.position as 'top',
    timeout: opts.timeout,
    maxNums: opts.maxNums,
    isLimitWidth: opts.isLimitWidth,
    limitWidthNum: opts.limitWidthNum,
    limitWidthWrap: opts.limitWidthWrap,
    animation: opts.animation,
    autoClose: opts.autoClose,
    showClose: opts.showClose,
    showIcon: opts.showIcon,
    showReverse: opts.showReverse,
    useShadowRoot: false
  })
}

// Hüner denetimi geri çağırımı
// döngüsel içe aktarmayı önlemek için useDialogs tarafından kaydedilir
let _perkChecker: (() => void) | null = null

/** Hüner denetimi geri çağırımını kaydet (useDialogs başlatılırken çağrılır) */
export const _registerPerkChecker = (fn: () => void) => {
  _perkChecker = fn
}

// === Kayıt geçmişi (yalnız bellekte tutulur, kayıt dosyasına yazılmaz, sayfa yenilenince silinir) ===

export interface LogEntry {
  msg: string
  dayLabel: string
}

/** Tüm kayıt geçmişi */
export const logHistory = ref<LogEntry[]>([])

/** Gün etiketi alıcısı
 * döngüsel içe aktarmayı önlemek için GameLayout tarafından kaydedilir
 */
let _dayLabelGetter: (() => string) | null = null

/** Gün etiketi alıcısını kaydet (GameLayout başlatılırken çağrılır) */
export const _registerDayLabelGetter = (fn: () => string) => {
  _dayLabelGetter = fn
}

/** Kayıt mesajı ekle (bildirim olarak gösterilir, ayrıca geçmişe yazılır) */
export const addLog = (msg: string) => {
  Qmsg.info(msg)
  const dayLabel = _dayLabelGetter?.() ?? ''
  logHistory.value.push({ msg, dayLabel })
  _perkChecker?.()
}

/** Yüzen kısa bildirim göster */
export const showFloat = (text: string, color: FloatColor = 'accent') => {
  switch (color) {
    case 'danger':
      Qmsg.error(text, { timeout: 1500 })
      break
    case 'success':
      Qmsg.success(text, { timeout: 1500 })
      break
    case 'accent':
      Qmsg.warning(text, { timeout: 1500 })
      break
    case 'water':
      Qmsg.info(text, { timeout: 1500 })
      break
  }
}

/** Kayıtları sıfırla (yeni oyun) */
export const resetLogs = () => {
  Qmsg.closeAll()
}

/** Tüm kayıt geçmişini temizle */
export const clearAllLogs = () => {
  logHistory.value = []
}

/** Belirli bir güne ait kayıtları temizle */
export const clearDayLogs = (dayLabel: string) => {
  logHistory.value = logHistory.value.filter(e => e.dayLabel !== dayLabel)
}

export const useGameLog = () => {
  return {
    addLog,
    showFloat,
    resetLogs,
    clearAllLogs,
    clearDayLogs,
    logHistory
  }
}
