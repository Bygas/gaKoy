import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { MUSEUM_ITEMS, MUSEUM_MILESTONES } from '@/data/museum'
import { useInventoryStore } from './useInventoryStore'
import { usePlayerStore } from './usePlayerStore'

export const useMuseumStore = defineStore('museum', () => {
  /** Bağışlanmış eşya kimlikleri */
  const donatedItems = ref<string[]>([])

  /** Ödülü alınmış dönüm taşı sayıları */
  const claimedMilestones = ref<number[]>([])

  /** Toplam bağış sayısı */
  const donatedCount = computed(() => donatedItems.value.length)

  /** Müzedeki toplam eşya sayısı */
  const totalCount = computed(() => MUSEUM_ITEMS.length)

  /** Eşya daha önce bağışlandı mı */
  const isDonated = (itemId: string): boolean => {
    return donatedItems.value.includes(itemId)
  }

  /** Bağışlanabilir mi (çantada var ve daha önce sunulmamış) */
  const canDonate = (itemId: string): boolean => {
    if (isDonated(itemId)) return false
    if (!MUSEUM_ITEMS.find(m => m.id === itemId)) return false
    const inventoryStore = useInventoryStore()
    return inventoryStore.hasItem(itemId)
  }

  /** Çantadaki bağışlanabilir eşyalar */
  const donatableItems = computed(() => {
    const inventoryStore = useInventoryStore()
    return inventoryStore.items
      .filter(inv => {
        const museumItem = MUSEUM_ITEMS.find(m => m.id === inv.itemId)
        return museumItem && !isDonated(inv.itemId)
      })
      .map(inv => inv.itemId)
  })

  /** Eşyayı müzeye bağışla */
  const donateItem = (itemId: string): boolean => {
    if (!canDonate(itemId)) return false
    const inventoryStore = useInventoryStore()
    const removed = inventoryStore.removeItem(itemId, 1)
    if (!removed) return false
    donatedItems.value.push(itemId)
    return true
  }

  /** Alınabilecek dönüm taşı ödülleri */
  const claimableMilestones = computed(() => {
    return MUSEUM_MILESTONES.filter(
      m => donatedCount.value >= m.count && !claimedMilestones.value.includes(m.count)
    )
  })

  /** Dönüm taşı ödülünü al */
  const claimMilestone = (count: number): boolean => {
    const milestone = MUSEUM_MILESTONES.find(m => m.count === count)
    if (!milestone) return false
    if (donatedCount.value < count) return false
    if (claimedMilestones.value.includes(count)) return false

    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()

    if (milestone.reward.money) {
      playerStore.earnMoney(milestone.reward.money)
    }
    if (milestone.reward.items) {
      for (const item of milestone.reward.items) {
        inventoryStore.addItem(item.itemId, item.quantity)
      }
    }
    claimedMilestones.value.push(count)
    return true
  }

  /** Kayda geçirme */
  const serialize = () => ({
    donatedItems: [...donatedItems.value],
    claimedMilestones: [...claimedMilestones.value]
  })

  /** Kayıttan geri yükleme */
  const deserialize = (data: ReturnType<typeof serialize>) => {
    donatedItems.value = data.donatedItems ?? []
    claimedMilestones.value = data.claimedMilestones ?? []
  }

  return {
    donatedItems,
    claimedMilestones,
    donatedCount,
    totalCount,
    isDonated,
    canDonate,
    donatableItems,
    donateItem,
    claimableMilestones,
    claimMilestone,
    serialize,
    deserialize
  }
})
