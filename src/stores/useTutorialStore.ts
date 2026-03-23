import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTutorialStore = defineStore('tutorial', () => {
  /** Ana anahtar, varsayılan olarak açık */
  const enabled = ref(true)
  /** Daha önce gösterilmiş sabah ipucu ID listesi */
  const shownTipIds = ref<string[]>([])
  /** Daha önce ziyaret edilmiş paneller listesi ("ilk ziyaret" kontrolü için) */
  const visitedPanels = ref<string[]>([])
  /** Genel işaretler (ör. staminaWasLow, seenRain gibi) */
  const flags = ref<Record<string, boolean>>({})

  const isTipShown = (id: string) => shownTipIds.value.includes(id)
  const markTipShown = (id: string) => {
    if (!shownTipIds.value.includes(id)) shownTipIds.value.push(id)
  }
  const hasPanelVisited = (panel: string) => visitedPanels.value.includes(panel)
  const markPanelVisited = (panel: string) => {
    if (!visitedPanels.value.includes(panel)) visitedPanels.value.push(panel)
  }
  const setFlag = (key: string, val: boolean = true) => {
    flags.value[key] = val
  }
  const getFlag = (key: string) => flags.value[key] ?? false

  const serialize = () => ({
    enabled: enabled.value,
    shownTipIds: shownTipIds.value,
    visitedPanels: visitedPanels.value,
    flags: flags.value
  })

  const deserialize = (data: any) => {
    enabled.value = data?.enabled ?? true
    shownTipIds.value = data?.shownTipIds ?? []
    visitedPanels.value = data?.visitedPanels ?? []
    flags.value = data?.flags ?? {}
  }

  return {
    enabled,
    shownTipIds,
    visitedPanels,
    flags,
    isTipShown,
    markTipShown,
    hasPanelVisited,
    markPanelVisited,
    setFlag,
    getFlag,
    serialize,
    deserialize
  }
})
