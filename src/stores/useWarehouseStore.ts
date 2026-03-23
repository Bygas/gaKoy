import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { InventoryItem, Quality, Chest, ChestTier, VoidChestRole } from '@/types'
import { getItemById, CHEST_DEFS } from '@/data/items'
import { useInventoryStore } from './useInventoryStore'

const INITIAL_MAX_CHESTS = 3
const MAX_CHESTS_CAP = 10
const MAX_STACK = 99
const UNLOCK_COST = 50000

export const useWarehouseStore = defineStore('warehouse', () => {
  const unlocked = ref(false)
  const chests = ref<Chest[]>([])
  const maxChests = ref(INITIAL_MAX_CHESTS)

  const hasVoidChest = computed(() => chests.value.some(c => c.tier === 'void'))

  // ---- Sandık yönetimi ----

  /** Sandık oluştur */
  const addChest = (tier: ChestTier, label?: string): boolean => {
    if (chests.value.length >= maxChests.value) return false
    const def = CHEST_DEFS[tier]
    chests.value.push({
      id: `chest_${Date.now()}`,
      tier,
      label: label ?? def.name,
      items: [],
      voidRole: 'none'
    })
    return true
  }

  /** Boş sandığı kaldır */
  const removeChest = (chestId: string): boolean => {
    const idx = chests.value.findIndex(c => c.id === chestId)
    if (idx === -1) return false
    if (chests.value[idx]!.items.length > 0) return false
    chests.value.splice(idx, 1)
    return true
  }

  /** Sandığı yeniden adlandır */
  const renameChest = (chestId: string, label: string): boolean => {
    const trimmed = label.trim()
    if (!trimmed || trimmed.length > 8) return false
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return false
    chest.label = trimmed
    return true
  }

  /** Sandık referansını al */
  const getChest = (chestId: string): Chest | undefined => {
    return chests.value.find(c => c.id === chestId)
  }

  /** Sandık kapasitesini al */
  const getChestCapacity = (chestId: string): number => {
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return 0
    return CHEST_DEFS[chest.tier].capacity
  }

  /** Sandık dolu mu */
  const isChestFull = (chestId: string): boolean => {
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return true
    return chest.items.length >= CHEST_DEFS[chest.tier].capacity
  }

  // ---- Eşya işlemleri ----

  /** Doğrudan sandığa eşya ekle (iç kullanım / otomatik yönlendirme) */
  const addItemToChest = (chestId: string, itemId: string, quantity: number = 1, quality: Quality = 'normal'): boolean => {
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return false
    const cap = CHEST_DEFS[chest.tier].capacity
    let remaining = quantity

    for (const slot of chest.items) {
      if (remaining <= 0) break
      if (slot.itemId === itemId && slot.quality === quality && slot.quantity < MAX_STACK) {
        const canAdd = Math.min(remaining, MAX_STACK - slot.quantity)
        slot.quantity += canAdd
        remaining -= canAdd
      }
    }

    while (remaining > 0 && chest.items.length < cap) {
      const batch = Math.min(remaining, MAX_STACK)
      chest.items.push({ itemId, quantity: batch, quality })
      remaining -= batch
    }

    return remaining <= 0
  }

  /** Doğrudan sandıktan eşya çıkar */
  const removeItemFromChest = (chestId: string, itemId: string, quantity: number = 1, quality?: Quality): boolean => {
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return false

    const matchQuality = (i: { itemId: string; quality: Quality }) =>
      i.itemId === itemId && (quality === undefined || i.quality === quality)
    const total = chest.items.filter(matchQuality).reduce((sum, i) => sum + i.quantity, 0)
    if (total < quantity) return false

    const qualityOrder: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
    let remaining = quantity
    for (const q of quality !== undefined ? [quality] : qualityOrder) {
      for (let i = chest.items.length - 1; i >= 0 && remaining > 0; i--) {
        const slot = chest.items[i]!
        if (slot.itemId !== itemId || slot.quality !== q) continue
        const take = Math.min(remaining, slot.quantity)
        slot.quantity -= take
        remaining -= take
        if (slot.quantity <= 0) {
          chest.items.splice(i, 1)
        }
      }
    }
    return true
  }

  /** Sandıktaki eşya miktarını sorgula */
  const getChestItemCount = (chestId: string, itemId: string, quality?: Quality): number => {
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return 0
    return chest.items
      .filter(i => i.itemId === itemId && (quality === undefined || i.quality === quality))
      .reduce((sum, i) => sum + i.quantity, 0)
  }

  // ---- Depolama işlemleri (Çanta ↔ Sandık) ----

  /** Çantadan sandığa koy, gerçek yerleştirilen miktarı döndürür (0 = başarısız) */
  const depositToChest = (chestId: string, itemId: string, quantity: number, quality: Quality): number => {
    const inv = useInventoryStore()
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return 0

    // Sandığın alabileceği miktarı hesapla
    const cap = CHEST_DEFS[chest.tier].capacity
    let canStore = 0
    for (const slot of chest.items) {
      if (slot.itemId === itemId && slot.quality === quality && slot.quantity < MAX_STACK) {
        canStore += MAX_STACK - slot.quantity
      }
    }
    const freeSlots = cap - chest.items.length
    canStore += freeSlots * MAX_STACK

    const actual = Math.min(quantity, canStore)
    if (actual <= 0) return 0

    if (!inv.removeItem(itemId, actual, quality)) return 0
    addItemToChest(chestId, itemId, actual, quality)
    return actual
  }

  /** Sandıktan çantaya al */
  const withdrawFromChest = (chestId: string, itemId: string, quantity: number, quality: Quality): boolean => {
    const inv = useInventoryStore()
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest) return false

    const available = getChestItemCount(chestId, itemId, quality)
    const actual = Math.min(quantity, available)
    if (actual <= 0) return false

    // Önce sandıktan çıkar, sonra çantaya ekle
    removeItemFromChest(chestId, itemId, actual, quality)
    inv.addItem(itemId, actual, quality)
    return true
  }

  // ---- Depo genişletme ----

  /** Depoyu genişlet (sandık yuvası artır) */
  const expandMaxChests = (): boolean => {
    if (maxChests.value >= MAX_CHESTS_CAP) return false
    maxChests.value += 1
    return true
  }

  // ---- Boşluk sandığı yönetimi ----

  /** Boşluk sandığı rolü ayarla (aynı rol tek olabilir) */
  const setVoidRole = (chestId: string, role: VoidChestRole): boolean => {
    const chest = chests.value.find(c => c.id === chestId)
    if (!chest || chest.tier !== 'void') return false

    // Aynı roldeki diğer sandıkları temizle
    if (role !== 'none') {
      for (const c of chests.value) {
        if (c.id !== chestId && c.tier === 'void' && c.voidRole === role) {
          c.voidRole = 'none'
        }
      }
    }
    chest.voidRole = role
    return true
  }

  /** Boşluk girdi sandığını al */
  const getVoidInputChest = (): Chest | null => {
    return chests.value.find(c => c.tier === 'void' && c.voidRole === 'input') ?? null
  }

  /** Boşluk çıktı sandığını al */
  const getVoidOutputChest = (): Chest | null => {
    return chests.value.find(c => c.tier === 'void' && c.voidRole === 'output') ?? null
  }

  /** Tüm boşluk sandıklarını al */
  const getVoidChests = (): Chest[] => {
    return chests.value.filter(c => c.tier === 'void')
  }

  // ---- Serileştirme ----

  const serialize = () => {
    return {
      unlocked: unlocked.value,
      chests: chests.value,
      maxChests: maxChests.value
    }
  }

  const deserialize = (data: Record<string, unknown>) => {
    unlocked.value = (data.unlocked as boolean) ?? false
    maxChests.value = (data.maxChests as number) ?? INITIAL_MAX_CHESTS

    // Eski kayıt aktarımı: items var, chests yok
    if (data.items && !data.chests) {
      const oldItems = (data.items as InventoryItem[]).filter(i => getItemById(i.itemId))
      if (oldItems.length > 0) {
        // Altın sandık kapasitesi 36, aşarsa birkaç sandığa böl
        const goldCap = CHEST_DEFS.gold.capacity
        const migratedChests: Chest[] = []
        for (let i = 0; i < oldItems.length; i += goldCap) {
          migratedChests.push({
            id: `migrated_chest_${migratedChests.length + 1}`,
            tier: 'gold',
            label: migratedChests.length === 0 ? 'Eski Depo' : `Eski Depo${migratedChests.length + 1}`,
            items: oldItems.slice(i, i + goldCap),
            voidRole: 'none'
          })
        }
        chests.value = migratedChests
        // Taşınan sandıkları alacak kadar yuva aç
        if (maxChests.value < migratedChests.length) {
          maxChests.value = migratedChests.length
        }
      } else {
        chests.value = []
      }
    } else {
      chests.value = (data.chests as Chest[]) ?? []
    }

    // Eski kayıt uyumluluğu: sandık varsa ama kilit açılmamış görünüyorsa otomatik aç
    if (!unlocked.value && chests.value.length > 0) unlocked.value = true
  }

  return {
    unlocked,
    chests,
    maxChests,
    hasVoidChest,
    UNLOCK_COST,
    MAX_CHESTS_CAP,
    addChest,
    removeChest,
    renameChest,
    getChest,
    getChestCapacity,
    isChestFull,
    addItemToChest,
    removeItemFromChest,
    getChestItemCount,
    depositToChest,
    withdrawFromChest,
    expandMaxChests,
    setVoidRole,
    getVoidInputChest,
    getVoidOutputChest,
    getVoidChests,
    serialize,
    deserialize
  }
})
