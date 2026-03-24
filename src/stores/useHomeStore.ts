import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FarmhouseLevel, CaveChoice, Quality } from '@/types'
import {
  FARMHOUSE_UPGRADES,
  CAVE_MUSHROOM_DAILY_CHANCE,
  CAVE_FRUIT_BAT_DAILY_CHANCE,
  GREENHOUSE_UNLOCK_COST,
  GREENHOUSE_MATERIAL_COST,
  CELLAR_AGING_DAYS,
  CELLAR_MAX_SLOTS
} from '@/data/buildings'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { useFarmStore } from './useFarmStore'
import { getCombinedItemCount, removeCombinedItem } from '@/composables/useCombinedInventory'

/** Mahzen dinlendirme yuvası */
interface CellarSlot {
  itemId: string
  quality: Quality
  daysAging: number
}

/** Kalite yükselme sırası */
const QUALITY_ORDER: Quality[] = ['normal', 'fine', 'excellent', 'supreme']

/** Dinlendirilebilen içecekler */
const AGEABLE_ITEMS = ['watermelon_wine', 'osmanthus_wine', 'peach_wine', 'jujube_wine', 'corn_wine', 'rice_vinegar']

export const useHomeStore = defineStore('home', () => {
  const farmhouseLevel = ref<FarmhouseLevel>(0)
  const caveChoice = ref<CaveChoice>('none')
  const caveUnlocked = ref(false)
  const greenhouseUnlocked = ref(false)
  const cellarSlots = ref<CellarSlot[]>([])

  const farmhouseName = computed(() => {
    const names: Record<FarmhouseLevel, string> = { 0: 'Kerpiç Kulübe', 1: 'Taş Ev', 2: 'Konak', 3: 'Mahzenli Konak' }
    return names[farmhouseLevel.value]
  })

  const nextUpgrade = computed(() => {
    const nextLevel = (farmhouseLevel.value + 1) as FarmhouseLevel
    return FARMHOUSE_UPGRADES.find(u => u.level === nextLevel) ?? null
  })

  const hasCellar = computed(() => farmhouseLevel.value >= 3)

  /** Evi yükselt */
  const upgradeFarmhouse = (): boolean => {
    const playerStore = usePlayerStore()

    const upgrade = nextUpgrade.value
    if (!upgrade) return false

    // Gereçleri denetle
    for (const mat of upgrade.materialCost) {
      if (getCombinedItemCount(mat.itemId) < mat.quantity) return false
    }
    if (!playerStore.spendMoney(upgrade.cost)) return false

    // Gereçleri düş
    for (const mat of upgrade.materialCost) {
      removeCombinedItem(mat.itemId, mat.quantity)
    }

    farmhouseLevel.value = upgrade.level
    return true
  }

  /** Mağarayı aç */
  const unlockCave = (): boolean => {
    if (caveUnlocked.value) return false
    caveUnlocked.value = true
    return true
  }

  /** Mağara türünü seç */
  const chooseCave = (choice: 'mushroom' | 'fruit_bat'): boolean => {
    if (!caveUnlocked.value) return false
    if (caveChoice.value !== 'none') return false
    caveChoice.value = choice
    return true
  }

  /** Mağaranın günlük verimi */
  const dailyCaveUpdate = (): { itemId: string; quantity: number }[] => {
    if (caveChoice.value === 'none') return []
    const results: { itemId: string; quantity: number }[] = []

    if (caveChoice.value === 'mushroom') {
      if (Math.random() < CAVE_MUSHROOM_DAILY_CHANCE) {
        results.push({ itemId: 'wild_mushroom', quantity: 1 })
      }
    } else if (caveChoice.value === 'fruit_bat') {
      if (Math.random() < CAVE_FRUIT_BAT_DAILY_CHANCE) {
        const fruits = ['tree_peach', 'lychee', 'mandarin', 'plum_blossom']
        const pick = fruits[Math.floor(Math.random() * fruits.length)]!
        results.push({ itemId: pick, quantity: 1 })
      }
    }

    return results
  }

  /** Sera aç */
  const unlockGreenhouse = (): boolean => {
    const playerStore = usePlayerStore()

    if (greenhouseUnlocked.value) return false

    for (const mat of GREENHOUSE_MATERIAL_COST) {
      if (getCombinedItemCount(mat.itemId) < mat.quantity) return false
    }
    if (!playerStore.spendMoney(GREENHOUSE_UNLOCK_COST)) return false

    for (const mat of GREENHOUSE_MATERIAL_COST) {
      removeCombinedItem(mat.itemId, mat.quantity)
    }

    greenhouseUnlocked.value = true
    // Sera topraklarını hazırla
    const farmStore = useFarmStore()
    farmStore.initGreenhouse()
    return true
  }

  /** Mahzene dinlenmeye içecek koy */
  const startAging = (itemId: string, quality: Quality): boolean => {
    if (!hasCellar.value) return false
    if (cellarSlots.value.length >= CELLAR_MAX_SLOTS) return false
    if (!AGEABLE_ITEMS.includes(itemId)) return false
    if (quality === 'supreme') return false

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(itemId, 1, quality)) return false

    cellarSlots.value.push({ itemId, quality, daysAging: 0 })
    return true
  }

  /** Mahzenden dinlenen içeceği çıkar */
  const removeAging = (index: number): { itemId: string; quality: Quality } | null => {
    if (index < 0 || index >= cellarSlots.value.length) return null
    const slot = cellarSlots.value[index]!
    cellarSlots.value.splice(index, 1)
    return { itemId: slot.itemId, quality: slot.quality }
  }

  /** Mahzenin günlük güncellemesi */
  const dailyCellarUpdate = (): { ready: { itemId: string; newQuality: Quality }[] } => {
    const ready: { itemId: string; newQuality: Quality }[] = []

    for (const slot of cellarSlots.value) {
      slot.daysAging++
      if (slot.daysAging >= CELLAR_AGING_DAYS) {
        const currentIdx = QUALITY_ORDER.indexOf(slot.quality)
        if (currentIdx < QUALITY_ORDER.length - 1) {
          slot.quality = QUALITY_ORDER[currentIdx + 1]!
          slot.daysAging = 0
          ready.push({ itemId: slot.itemId, newQuality: slot.quality })
        }
      }
    }

    return { ready }
  }

  /** Ocak aşçılığı bereketi (Seviye 1+) */
  const getKitchenBonus = (): number => {
    return farmhouseLevel.value >= 1 ? 1.2 : 1.0
  }

  /** Uyku dinçliği bereketi (Seviye 2+) */
  const getStaminaRecoveryBonus = (): number => {
    return farmhouseLevel.value >= 2 ? 0.1 : 0
  }

  const serialize = () => {
    return {
      farmhouseLevel: farmhouseLevel.value,
      caveChoice: caveChoice.value,
      caveUnlocked: caveUnlocked.value,
      greenhouseUnlocked: greenhouseUnlocked.value,
      cellarSlots: cellarSlots.value
    }
  }

  const deserialize = (data: any) => {
    farmhouseLevel.value = data.farmhouseLevel ?? 0
    caveChoice.value = data.caveChoice ?? 'none'
    caveUnlocked.value = data.caveUnlocked ?? false
    greenhouseUnlocked.value = data.greenhouseUnlocked ?? false
    cellarSlots.value = data.cellarSlots ?? []
    // Kayıt yüklenince sera açıksa toprağı yeniden hazırla
    if (greenhouseUnlocked.value) {
      const farmStore = useFarmStore()
      farmStore.initGreenhouse()
    }
  }

  return {
    farmhouseLevel,
    caveChoice,
    caveUnlocked,
    greenhouseUnlocked,
    cellarSlots,
    farmhouseName,
    nextUpgrade,
    hasCellar,
    upgradeFarmhouse,
    unlockCave,
    chooseCave,
    dailyCaveUpdate,
    unlockGreenhouse,
    startAging,
    removeAging,
    dailyCellarUpdate,
    getKitchenBonus,
    getStaminaRecoveryBonus,
    serialize,
    deserialize
  }
})
