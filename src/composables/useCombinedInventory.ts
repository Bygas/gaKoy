import { useInventoryStore } from '@/stores/useInventoryStore'
import { useWarehouseStore } from '@/stores/useWarehouseStore'
import type { Quality } from '@/types'

/** Heybe + ambar sandıklarındaki bir eşyanın toplam sayısını döndürür */
export const getCombinedItemCount = (itemId: string, quality?: Quality): number => {
  const inv = useInventoryStore()
  const wh = useWarehouseStore()

  let total = inv.getItemCount(itemId, quality)

  if (wh.unlocked) {
    for (const chest of wh.chests) {
      total += wh.getChestItemCount(chest.id, itemId, quality)
    }
  }

  return total
}

/** Heybe + ambar sandıkları toplamında yeterli eşya var mı kontrol eder */
export const hasCombinedItem = (itemId: string, quantity: number = 1): boolean => getCombinedItemCount(itemId) >= quantity

/** Önce heybede harcar, yetmezse ambar sandıklarından düşer (Boşluk Hammadde Sandığı önceliklidir) */
export const removeCombinedItem = (itemId: string, quantity: number = 1, quality?: Quality): boolean => {
  const inv = useInventoryStore()
  const wh = useWarehouseStore()

  // Toplam miktarı hesapla
  const invCount = inv.getItemCount(itemId, quality)
  let warehouseTotal = 0
  const chestCounts: { id: string; count: number }[] = []

  if (wh.unlocked) {
    // Boşluk Hammadde Sandığı en başa alınır, önce oradan harcanır
    const voidInput = wh.getVoidInputChest()
    const ordered = voidInput ? [voidInput, ...wh.chests.filter(c => c.id !== voidInput.id)] : [...wh.chests]

    for (const chest of ordered) {
      const cnt = wh.getChestItemCount(chest.id, itemId, quality)
      if (cnt > 0) {
        chestCounts.push({ id: chest.id, count: cnt })
        warehouseTotal += cnt
      }
    }
  }

  if (invCount + warehouseTotal < quantity) return false

  let remaining = quantity

  // Önce heybede harca
  const fromInv = Math.min(remaining, invCount)
  if (fromInv > 0) {
    inv.removeItem(itemId, fromInv, quality)
    remaining -= fromInv
  }

  // Sonra sandıklardan harca (Boşluk Hammadde Sandığı zaten öne alındı)
  for (const cc of chestCounts) {
    if (remaining <= 0) break
    const take = Math.min(remaining, cc.count)
    wh.removeItemFromChest(cc.id, itemId, take, quality)
    remaining -= take
  }

  return true
}

/** Heybe + ambar sandıkları içinde bir eşyanın en düşük kalitesini bulur */
export const getLowestCombinedQuality = (itemId: string): Quality => {
  const inv = useInventoryStore()
  const wh = useWarehouseStore()
  const order: Quality[] = ['normal', 'fine', 'excellent', 'supreme']

  for (const q of order) {
    if (inv.getItemCount(itemId, q) > 0) return q
    if (wh.unlocked) {
      for (const chest of wh.chests) {
        if (wh.getChestItemCount(chest.id, itemId, q) > 0) return q
      }
    }
  }

  return 'normal'
}
