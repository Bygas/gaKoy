import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { useGameStore } from '@/stores/useGameStore'
import { addLog, showFloat } from './useGameLog'
import { getHiddenNpcById } from '@/data/hiddenNpcs'
import type { Quality } from '@/types'

/** Adak sun */
export const doOffering = (npcId: string, itemId: string, quality: Quality): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.performOffering(npcId, itemId, quality)

  if (result.success) {
    const gameStore = useGameStore()
    gameStore.advanceTime(30)

    if (result.affinityChange > 0) {
      showFloat(`+${result.affinityChange} bağ`, 'accent')
    } else if (result.affinityChange < 0) {
      showFloat(`${result.affinityChange} bağ`, 'danger')
    }

    addLog(result.message)
  } else {
    addLog(result.message)
  }

  return result.success
}

/** Özel etkileşim */
export const doSpecialInteraction = (npcId: string): boolean => {
  const def = getHiddenNpcById(npcId)
  if (!def) return false

  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.performSpecialInteraction(npcId)

  if (result.success) {
    const gameStore = useGameStore()
    gameStore.advanceTime(60)

    showFloat(`+${result.affinityChange} bağ`, 'accent')
    addLog(result.message)
  } else {
    addLog(result.message)
  }

  return result.success
}

/** Gönül arayışı başlat */
export const doCourting = (npcId: string): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.startCourting(npcId)

  if (result.success) {
    showFloat('Gönül bağı kuruldu', 'accent')
  }

  addLog(result.message)
  return result.success
}

/** Bağ kur (kader bağı) */
export const doBond = (npcId: string): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.formBond(npcId)

  if (result.success) {
    showFloat('Bağ kuruldu!', 'accent')
  }

  addLog(result.message)
  return result.success
}

/** Bağı çöz */
export const doDissolve = (npcId: string): boolean => {
  const hiddenNpcStore = useHiddenNpcStore()
  const result = hiddenNpcStore.dissolveBond(npcId)

  addLog(result.message)
  return result.success
}

/** Adak uyumunu al */
export const getOfferingPreference = (
  npcId: string,
  itemId: string
): 'resonant' | 'pleased' | 'repelled' | 'neutral' => {
  const def = getHiddenNpcById(npcId)
  if (!def) return 'neutral'

  if (def.resonantOfferings.includes(itemId)) return 'resonant'
  if (def.pleasedOfferings.includes(itemId)) return 'pleased'
  if (def.repelledOfferings.includes(itemId)) return 'repelled'

  return 'neutral'
}

export const OFFERING_PREF_LABELS: Record<string, string> = {
  resonant: 'Uyumlu',
  pleased: 'Hoşnut',
  repelled: 'İtici',
  neutral: ''
}

export const OFFERING_PREF_CLASS: Record<string, string> = {
  resonant: 'text-accent',
  pleased: 'text-success',
  repelled: 'text-danger',
  neutral: ''
}

export const OFFERING_PREF_ORDER: Record<string, number> = {
  resonant: 0,
  pleased: 1,
  neutral: 2,
  repelled: 3
}
