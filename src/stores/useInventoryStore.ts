import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { InventoryItem, Quality, Tool, ToolType, ToolTier, OwnedWeapon, OwnedRing, RingEffectType, OwnedHat, OwnedShoe } from '@/types'

/** Teçhizat düzeni */
export interface EquipmentPreset {
  id: string
  name: string
  weaponDefId: string | null
  ringSlot1DefId: string | null
  ringSlot2DefId: string | null
  hatDefId: string | null
  shoeDefId: string | null
}
import { showFloat } from '@/composables/useGameLog'
import { getItemById } from '@/data/items'
import { getWeaponById, getEnchantmentById, getWeaponSellPrice } from '@/data/weapons'
import { getRingById } from '@/data/rings'
import { getHatById } from '@/data/hats'
import { getShoeById } from '@/data/shoes'
import { EQUIPMENT_SETS } from '@/data/equipmentSets'
import { usePlayerStore } from './usePlayerStore'
import { useAchievementStore } from './useAchievementStore'

const INITIAL_CAPACITY = 24
const MAX_CAPACITY = 60
const MAX_STACK = 99
const TEMP_CAPACITY = 10

export const useInventoryStore = defineStore('inventory', () => {
  const items = ref<InventoryItem[]>([])
  const capacity = ref(INITIAL_CAPACITY)
  const tools = ref<Tool[]>([
    { type: 'wateringCan', tier: 'basic' },
    { type: 'hoe', tier: 'basic' },
    { type: 'pickaxe', tier: 'basic' },
    { type: 'fishingRod', tier: 'basic' },
    { type: 'scythe', tier: 'basic' },
    { type: 'axe', tier: 'basic' },
    { type: 'pan', tier: 'basic' }
  ])

  /** Sahip olunan silahlar */
  const ownedWeapons = ref<OwnedWeapon[]>([{ defId: 'wooden_stick', enchantmentId: null }])
  /** Takılı olan silahın indisi */
  const equippedWeaponIndex = ref(0)

  /** Sahip olunan yüzükler */
  const ownedRings = ref<OwnedRing[]>([])
  /** Takılı yüzük indisleri (2 yuva, -1 = boş) */
  const equippedRingSlot1 = ref(-1)
  const equippedRingSlot2 = ref(-1)

  /** Sahip olunan başlıklar */
  const ownedHats = ref<OwnedHat[]>([])
  /** Takılı başlık indisi (-1 = boş) */
  const equippedHatIndex = ref(-1)

  /** Sahip olunan ayakkabılar */
  const ownedShoes = ref<OwnedShoe[]>([])
  /** Takılı ayakkabı indisi (-1 = boş) */
  const equippedShoeIndex = ref(-1)

  /** Teçhizat düzenleri */
  const equipmentPresets = ref<EquipmentPreset[]>([])
  /** Kullanımda olan düzen kimliği */
  const activePresetId = ref<string | null>(null)

  /** Yükseltilmekte olan alet (2 gün bekleme) */
  const pendingUpgrade = ref<{ toolType: ToolType; targetTier: ToolTier; daysRemaining: number } | null>(null)

  const isFull = computed(() => items.value.length >= capacity.value)

  /** Geçici heybe (taşma bölmesi) */
  const tempItems = ref<InventoryItem[]>([])
  const isTempFull = computed(() => tempItems.value.length >= TEMP_CAPACITY)
  /** Ana heybe + geçici heybe bütünüyle dolu mu */
  const isAllFull = computed(() => isFull.value && isTempFull.value)

  /** Takılı silahı getir */
  const getEquippedWeapon = (): OwnedWeapon => {
    return ownedWeapons.value[equippedWeaponIndex.value] ?? { defId: 'wooden_stick', enchantmentId: null }
  }

  /** Silah saldırı gücünü getir (tılsım dahil) */
  const getWeaponAttack = (): number => {
    const owned = getEquippedWeapon()
    const def = getWeaponById(owned.defId)
    if (!def) return 5
    let attack = def.attack
    if (owned.enchantmentId) {
      const enchant = getEnchantmentById(owned.enchantmentId)
      if (enchant) attack += enchant.attackBonus
    }
    return attack
  }

  /** Silah kritik oranını getir (tılsım dahil) */
  const getWeaponCritRate = (): number => {
    const owned = getEquippedWeapon()
    const def = getWeaponById(owned.defId)
    if (!def) return 0.02
    let critRate = def.critRate
    if (owned.enchantmentId) {
      const enchant = getEnchantmentById(owned.enchantmentId)
      if (enchant) critRate += enchant.critBonus
    }
    return critRate
  }

  /** Yeni silah ekle */
  const addWeapon = (defId: string, enchantmentId: string | null = null): boolean => {
    ownedWeapons.value.push({ defId, enchantmentId })
    useAchievementStore().discoverItem(defId)
    return true
  }

  /** Bu silahtan var mı */
  const hasWeapon = (defId: string): boolean => {
    return ownedWeapons.value.some(w => w.defId === defId)
  }

  /** Silah kuşan */
  const equipWeapon = (index: number): boolean => {
    if (index < 0 || index >= ownedWeapons.value.length) return false
    equippedWeaponIndex.value = index
    return true
  }

  /** Silah sat (takılı silah satılamaz, son silah satılamaz) */
  const sellWeapon = (index: number): { success: boolean; message: string } => {
    if (ownedWeapons.value.length <= 1) return { success: false, message: 'En az bir silah elinde kalmalı.' }
    if (index === equippedWeaponIndex.value) return { success: false, message: 'Takılı silah satılamaz, önce başka bir silah kuşan.' }
    if (index < 0 || index >= ownedWeapons.value.length) return { success: false, message: 'Geçersiz sıra numarası.' }
    const weapon = ownedWeapons.value[index]!
    const price = getWeaponSellPrice(weapon.defId, weapon.enchantmentId)
    const playerStore = usePlayerStore()
    playerStore.earnMoney(price)
    ownedWeapons.value.splice(index, 1)
    if (equippedWeaponIndex.value > index) {
      equippedWeaponIndex.value--
    }
    const def = getWeaponById(weapon.defId)
    return { success: true, message: `${def?.name ?? 'Silah'} satıldı, ${price} akçe alındı.` }
  }

  /** Eşyayı heybeye ekle */
  const addItem = (itemId: string, quantity: number = 1, quality: Quality = 'normal'): boolean => {
    if (!getItemById(itemId)) return false
    useAchievementStore().discoverItem(itemId)
    let remaining = quantity

    for (const slot of items.value) {
      if (remaining <= 0) break
      if (slot.itemId === itemId && slot.quality === quality && slot.quantity < MAX_STACK) {
        const canAdd = Math.min(remaining, MAX_STACK - slot.quantity)
        slot.quantity += canAdd
        remaining -= canAdd
      }
    }

    while (remaining > 0 && !isFull.value) {
      const batch = Math.min(remaining, MAX_STACK)
      items.value.push({ itemId, quantity: batch, quality })
      remaining -= batch
    }

    if (remaining > 0) {
      for (const slot of tempItems.value) {
        if (remaining <= 0) break
        if (slot.itemId === itemId && slot.quality === quality && slot.quantity < MAX_STACK) {
          const canAdd = Math.min(remaining, MAX_STACK - slot.quantity)
          slot.quantity += canAdd
          remaining -= canAdd
        }
      }
      while (remaining > 0 && !isTempFull.value) {
        const batch = Math.min(remaining, MAX_STACK)
        tempItems.value.push({ itemId, quantity: batch, quality })
        remaining -= batch
      }
    }

    if (remaining > 0) {
      const name = getItemById(itemId)?.name ?? itemId
      showFloat(`Heybe doldu! ${name}×${remaining} yitirildi`, 'danger')
    } else {
      const freeSlots = capacity.value - items.value.length
      if (freeSlots <= 3) {
        showFloat(`Heybe dolmak üzere! Kalan göz sayısı: ${freeSlots}`, 'accent')
      }
    }

    return remaining <= 0
  }

  /** Eşyayı sil (birden çok yığından silmeyi destekler). quality verilmezse önce düşük kalite harcanır */
  const removeItem = (itemId: string, quantity: number = 1, quality?: Quality): boolean => {
    const matchQuality = (i: { itemId: string; quality: Quality }) =>
      i.itemId === itemId && (quality === undefined || i.quality === quality)
    const total = items.value.filter(matchQuality).reduce((sum, i) => sum + i.quantity, 0)
    if (total < quantity) return false

    const qualityOrder: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
    let remaining = quantity
    for (const q of quality !== undefined ? [quality] : qualityOrder) {
      for (let i = items.value.length - 1; i >= 0 && remaining > 0; i--) {
        const slot = items.value[i]!
        if (slot.itemId !== itemId || slot.quality !== q) continue
        const take = Math.min(remaining, slot.quantity)
        slot.quantity -= take
        remaining -= take
        if (slot.quantity <= 0) {
          items.value.splice(i, 1)
        }
      }
    }
    return true
  }

  /** Eşya sayısını sorgula */
  const getItemCount = (itemId: string, quality?: Quality): number => {
    return items.value
      .filter(i => i.itemId === itemId && (quality === undefined || i.quality === quality))
      .reduce((sum, i) => sum + i.quantity, 0)
  }

  /** Yeterince eşya var mı */
  const hasItem = (itemId: string, quantity: number = 1): boolean => {
    return getItemCount(itemId) >= quantity
  }

  /** Eşya sınıfı sıralama önceliği */
  const CATEGORY_ORDER: Record<string, number> = {
    seed: 0,
    crop: 1,
    fruit: 2,
    fish: 3,
    animal_product: 4,
    processed: 5,
    food: 6,
    ore: 7,
    gem: 8,
    material: 9,
    machine: 10,
    sprinkler: 11,
    fertilizer: 12,
    bait: 13,
    tackle: 14,
    bomb: 15,
    sapling: 16,
    gift: 17,
    fossil: 18,
    artifact: 19,
    misc: 20
  }

  /** Eşya kilidini aç/kapat */
  const toggleLock = (itemId: string, quality: Quality) => {
    const slot = items.value.find(i => i.itemId === itemId && i.quality === quality)
    if (slot) slot.locked = !slot.locked
  }

  /** Heybeyi bir kerede düzenle (sınıf → eşya ID → kalite sırası, benzer yığınları birleştir) */
  const sortItems = () => {
    const merged: InventoryItem[] = []
    for (const item of items.value) {
      const existing = merged.find(m => m.itemId === item.itemId && m.quality === item.quality)
      if (existing) {
        existing.quantity += item.quantity
        if (item.locked) existing.locked = true
      } else {
        merged.push({ ...item })
      }
    }

    const split: InventoryItem[] = []
    for (const item of merged) {
      let remaining = item.quantity
      while (remaining > 0) {
        const batch = Math.min(remaining, MAX_STACK)
        split.push({ itemId: item.itemId, quantity: batch, quality: item.quality, locked: item.locked })
        remaining -= batch
      }
    }

    const qualityOrder: Record<string, number> = { normal: 0, fine: 1, excellent: 2, supreme: 3 }
    split.sort((a, b) => {
      const defA = getItemById(a.itemId)
      const defB = getItemById(b.itemId)
      const catA = CATEGORY_ORDER[defA?.category ?? 'misc'] ?? 20
      const catB = CATEGORY_ORDER[defB?.category ?? 'misc'] ?? 20
      if (catA !== catB) return catA - catB
      if (a.itemId !== b.itemId) return a.itemId.localeCompare(b.itemId)
      return (qualityOrder[a.quality] ?? 0) - (qualityOrder[b.quality] ?? 0)
    })
    items.value = split
  }

  /** Heybe genişlet */
  const expandCapacity = (): boolean => {
    if (capacity.value >= MAX_CAPACITY) return false
    capacity.value += 4
    return true
  }

  /** Sınır aşan heybe genişletmesi (+1 göz, MAX_CAPACITY üstüne çıkar) */
  const expandCapacityExtra = (): boolean => {
    capacity.value += 1
    return true
  }

  /** Geçici heybede duran eşyayı ana heybeye taşı */
  const moveFromTemp = (index: number): boolean => {
    if (index < 0 || index >= tempItems.value.length) return false
    const tempSlot = tempItems.value[index]!
    const { itemId, quality } = tempSlot
    let remaining = tempSlot.quantity

    for (const slot of items.value) {
      if (remaining <= 0) break
      if (slot.itemId === itemId && slot.quality === quality && slot.quantity < MAX_STACK) {
        const canAdd = Math.min(remaining, MAX_STACK - slot.quantity)
        slot.quantity += canAdd
        remaining -= canAdd
      }
    }
    while (remaining > 0 && !isFull.value) {
      const batch = Math.min(remaining, MAX_STACK)
      items.value.push({ itemId, quantity: batch, quality })
      remaining -= batch
    }

    if (remaining <= 0) {
      tempItems.value.splice(index, 1)
      return true
    }
    tempSlot.quantity = remaining
    return false
  }

  /** Geçici heybede taşınabilecek her şeyi ana heybeye al */
  const moveAllFromTemp = (): number => {
    let movedCount = 0
    for (let i = tempItems.value.length - 1; i >= 0; i--) {
      if (isFull.value) break
      if (moveFromTemp(i)) movedCount++
    }
    return movedCount
  }

  /** Geçici heybede duran eşyayı at */
  const discardTempItem = (index: number): boolean => {
    if (index < 0 || index >= tempItems.value.length) return false
    tempItems.value.splice(index, 1)
    return true
  }

  /** Aleti getir */
  const getTool = (type: ToolType): Tool | undefined => {
    return tools.value.find(t => t.type === type)
  }

  /** Alet düzeyine göre takat harcama katsayısı */
  const getToolStaminaMultiplier = (type: ToolType): number => {
    const tool = getTool(type)
    if (!tool) return 1
    const multipliers: Record<ToolTier, number> = { basic: 1.0, iron: 0.8, steel: 0.6, iridium: 0.4 }
    return multipliers[tool.tier]
  }

  /** Alet düzeyine göre toplu iş sayısı (biriktirme usulü) */
  const getToolBatchCount = (type: ToolType): number => {
    const tool = getTool(type)
    if (!tool) return 1
    const counts: Record<ToolTier, number> = { basic: 1, iron: 2, steel: 4, iridium: 8 }
    return counts[tool.tier]
  }

  /** Alet yükselt */
  const upgradeTool = (type: ToolType): boolean => {
    const tool = getTool(type)
    if (!tool) return false
    const tiers: ToolTier[] = ['basic', 'iron', 'steel', 'iridium']
    const currentIndex = tiers.indexOf(tool.tier)
    if (currentIndex >= tiers.length - 1) return false
    tool.tier = tiers[currentIndex + 1]!
    return true
  }

  /** Alet kullanılabilir mi (yükseltmede değilse) */
  const isToolAvailable = (type: ToolType): boolean => {
    return !pendingUpgrade.value || pendingUpgrade.value.toolType !== type
  }

  /** Alet yükseltmesini başlat (2 günlük bekleme) */
  const startUpgrade = (type: ToolType, targetTier: ToolTier): boolean => {
    if (pendingUpgrade.value) return false
    pendingUpgrade.value = { toolType: type, targetTier, daysRemaining: 2 }
    return true
  }

  /** Günlük yükseltme ilerlemesi; tamamlanan aleti döndürür */
  const dailyUpgradeUpdate = (): { completed: boolean; toolType: ToolType; targetTier: ToolTier } | null => {
    if (!pendingUpgrade.value) return null
    pendingUpgrade.value.daysRemaining--
    if (pendingUpgrade.value.daysRemaining <= 0) {
      const { toolType, targetTier } = pendingUpgrade.value
      upgradeTool(toolType)
      pendingUpgrade.value = null
      return { completed: true, toolType, targetTier }
    }
    return null
  }

  // ============================================================
  // Yüzük düzeni
  // ============================================================

  /** Yüzük ekle */
  const addRing = (defId: string): boolean => {
    ownedRings.value.push({ defId })
    useAchievementStore().discoverItem(defId)
    return true
  }

  /** Bu yüzükten var mı */
  const hasRing = (defId: string): boolean => {
    return ownedRings.value.some(r => r.defId === defId)
  }

  /** Yüzük tak (0 ya da 1. yuva), iki yuvada aynı yüzük türü olamaz */
  const equipRing = (ringIndex: number, slot: 0 | 1): boolean => {
    if (ringIndex < 0 || ringIndex >= ownedRings.value.length) return false
    const targetSlot = slot === 0 ? equippedRingSlot1 : equippedRingSlot2
    const otherSlot = slot === 0 ? equippedRingSlot2 : equippedRingSlot1
    if (targetSlot.value === ringIndex) return true
    if (otherSlot.value === ringIndex) {
      otherSlot.value = targetSlot.value
      targetSlot.value = ringIndex
      return true
    }
    const targetDefId = ownedRings.value[ringIndex]!.defId
    if (otherSlot.value >= 0 && otherSlot.value < ownedRings.value.length && ownedRings.value[otherSlot.value]!.defId === targetDefId) {
      return false
    }
    targetSlot.value = ringIndex
    return true
  }

  /** Yüzüğü çıkar */
  const unequipRing = (slot: 0 | 1): boolean => {
    if (slot === 0) {
      if (equippedRingSlot1.value < 0) return false
      equippedRingSlot1.value = -1
    } else {
      if (equippedRingSlot2.value < 0) return false
      equippedRingSlot2.value = -1
    }
    return true
  }

  /** Yüzük sat */
  const sellRing = (index: number): { success: boolean; message: string } => {
    if (index < 0 || index >= ownedRings.value.length) return { success: false, message: 'Geçersiz sıra numarası.' }
    const ring = ownedRings.value[index]!
    const def = getRingById(ring.defId)
    const price = def?.sellPrice ?? 0
    if (equippedRingSlot1.value === index) equippedRingSlot1.value = -1
    if (equippedRingSlot2.value === index) equippedRingSlot2.value = -1
    const playerStore = usePlayerStore()
    playerStore.earnMoney(price)
    ownedRings.value.splice(index, 1)
    if (equippedRingSlot1.value > index) equippedRingSlot1.value--
    if (equippedRingSlot2.value > index) equippedRingSlot2.value--
    return { success: true, message: `${def?.name ?? 'Yüzük'} satıldı, ${price} akçe alındı.` }
  }

  /** Bir teçhizat etkisinin toplam değerini getir (yüzük + başlık + ayakkabı) */
  const getEquipmentBonus = (effectType: RingEffectType): number => {
    let total = 0

    const ringIndices = [equippedRingSlot1.value, equippedRingSlot2.value]
    for (const idx of ringIndices) {
      if (idx < 0 || idx >= ownedRings.value.length) continue
      const ring = ownedRings.value[idx]!
      const def = getRingById(ring.defId)
      if (def) {
        for (const eff of def.effects) {
          if (eff.type === effectType) total += eff.value
        }
      }
    }

    if (equippedHatIndex.value >= 0 && equippedHatIndex.value < ownedHats.value.length) {
      const hat = ownedHats.value[equippedHatIndex.value]!
      const def = getHatById(hat.defId)
      if (def) {
        for (const eff of def.effects) {
          if (eff.type === effectType) total += eff.value
        }
      }
    }

    if (equippedShoeIndex.value >= 0 && equippedShoeIndex.value < ownedShoes.value.length) {
      const shoe = ownedShoes.value[equippedShoeIndex.value]!
      const def = getShoeById(shoe.defId)
      if (def) {
        for (const eff of def.effects) {
          if (eff.type === effectType) total += eff.value
        }
      }
    }

    for (const b of activeSetBonuses.value) {
      if (b.type === effectType) total += b.value
    }
    return total
  }

  /** Yüzük etkisinin toplamını getir (başlık/ayakkabı etkisi de dahildir) */
  const getRingEffectValue = (effectType: RingEffectType): number => {
    return getEquipmentBonus(effectType)
  }

  // ============================================================
  // Takım düzeni
  // ============================================================

  /** Mevcut kuşanımda her takımın etkin parça sayısını hesapla */
  const _getSetPieceCount = (set: (typeof EQUIPMENT_SETS)[number]): number => {
    let count = 0
    if (set.pieces.weapon) {
      const w = ownedWeapons.value[equippedWeaponIndex.value]
      if (w && w.defId === set.pieces.weapon) count++
    }

    let ringMatched = false
    for (const idx of [equippedRingSlot1.value, equippedRingSlot2.value]) {
      if (!ringMatched && idx >= 0 && idx < ownedRings.value.length && ownedRings.value[idx]!.defId === set.pieces.ring) {
        ringMatched = true
        count++
      }
    }

    if (
      equippedHatIndex.value >= 0 &&
      equippedHatIndex.value < ownedHats.value.length &&
      ownedHats.value[equippedHatIndex.value]!.defId === set.pieces.hat
    )
      count++

    if (
      equippedShoeIndex.value >= 0 &&
      equippedShoeIndex.value < ownedShoes.value.length &&
      ownedShoes.value[equippedShoeIndex.value]!.defId === set.pieces.shoe
    )
      count++

    return count
  }

  /** Şu an etkin takım ödülleri */
  const activeSetBonuses = computed(() => {
    const bonuses: { type: RingEffectType; value: number }[] = []
    for (const set of EQUIPMENT_SETS) {
      const count = _getSetPieceCount(set)
      for (const bonus of set.bonuses) {
        if (count >= bonus.count) bonuses.push(...bonus.effects)
      }
    }
    return bonuses
  })

  /** Etkin takımlar (arayüz için) */
  const activeSets = computed(() => {
    return EQUIPMENT_SETS.map(set => {
      const equippedCount = _getSetPieceCount(set)
      return {
        id: set.id,
        name: set.name,
        description: set.description,
        equippedCount,
        bonuses: set.bonuses.map(b => ({
          count: b.count,
          description: b.description,
          active: equippedCount >= b.count
        }))
      }
    }).filter(s => s.equippedCount > 0)
  })

  /** Yüzük döv */
  const craftRing = (defId: string): { success: boolean; message: string } => {
    const def = getRingById(defId)
    if (!def || !def.recipe) return { success: false, message: 'Bu yüzük dövülemez.' }

    for (const mat of def.recipe) {
      if (getItemCount(mat.itemId) < mat.quantity) {
        const matName = getItemById(mat.itemId)?.name ?? mat.itemId
        return { success: false, message: `Gereç yetersiz: ${matName}.` }
      }
    }

    const playerStore = usePlayerStore()
    if (playerStore.money < def.recipeMoney) {
      return { success: false, message: `Akçe yetmiyor (${def.recipeMoney} gerekir).` }
    }

    for (const mat of def.recipe) {
      removeItem(mat.itemId, mat.quantity)
    }
    playerStore.spendMoney(def.recipeMoney)

    addRing(defId)
    return { success: true, message: `${def.name} dövüldü!` }
  }

  // ============================================================
  // Başlık düzeni
  // ============================================================

  /** Başlık ekle */
  const addHat = (defId: string): boolean => {
    ownedHats.value.push({ defId })
    useAchievementStore().discoverItem(defId)
    return true
  }

  /** Bu başlıktan var mı */
  const hasHat = (defId: string): boolean => {
    return ownedHats.value.some(h => h.defId === defId)
  }

  /** Başlık tak */
  const equipHat = (index: number): boolean => {
    if (index < 0 || index >= ownedHats.value.length) return false
    equippedHatIndex.value = index
    return true
  }

  /** Başlığı çıkar */
  const unequipHat = (): boolean => {
    if (equippedHatIndex.value < 0) return false
    equippedHatIndex.value = -1
    return true
  }

  /** Başlık sat */
  const sellHat = (index: number): { success: boolean; message: string } => {
    if (index < 0 || index >= ownedHats.value.length) return { success: false, message: 'Geçersiz sıra numarası.' }
    const hat = ownedHats.value[index]!
    const def = getHatById(hat.defId)
    const price = def?.sellPrice ?? 0
    if (equippedHatIndex.value === index) equippedHatIndex.value = -1
    const playerStore = usePlayerStore()
    playerStore.earnMoney(price)
    ownedHats.value.splice(index, 1)
    if (equippedHatIndex.value > index) equippedHatIndex.value--
    return { success: true, message: `${def?.name ?? 'Başlık'} satıldı, ${price} akçe alındı.` }
  }

  /** Başlık döv */
  const craftHat = (defId: string): { success: boolean; message: string } => {
    const def = getHatById(defId)
    if (!def || !def.recipe) return { success: false, message: 'Bu başlık yapılamaz.' }
    for (const mat of def.recipe) {
      if (getItemCount(mat.itemId) < mat.quantity) {
        const matName = getItemById(mat.itemId)?.name ?? mat.itemId
        return { success: false, message: `Gereç yetersiz: ${matName}.` }
      }
    }
    const playerStore = usePlayerStore()
    if (playerStore.money < def.recipeMoney) {
      return { success: false, message: `Akçe yetmiyor (${def.recipeMoney} gerekir).` }
    }
    for (const mat of def.recipe) {
      removeItem(mat.itemId, mat.quantity)
    }
    playerStore.spendMoney(def.recipeMoney)
    addHat(defId)
    return { success: true, message: `${def.name} yapıldı!` }
  }

  // ============================================================
  // Ayakkabı düzeni
  // ============================================================

  /** Ayakkabı ekle */
  const addShoe = (defId: string): boolean => {
    ownedShoes.value.push({ defId })
    useAchievementStore().discoverItem(defId)
    return true
  }

  /** Bu ayakkabıdan var mı */
  const hasShoe = (defId: string): boolean => {
    return ownedShoes.value.some(s => s.defId === defId)
  }

  /** Ayakkabı giy */
  const equipShoe = (index: number): boolean => {
    if (index < 0 || index >= ownedShoes.value.length) return false
    equippedShoeIndex.value = index
    return true
  }

  /** Ayakkabıyı çıkar */
  const unequipShoe = (): boolean => {
    if (equippedShoeIndex.value < 0) return false
    equippedShoeIndex.value = -1
    return true
  }

  /** Ayakkabı sat */
  const sellShoe = (index: number): { success: boolean; message: string } => {
    if (index < 0 || index >= ownedShoes.value.length) return { success: false, message: 'Geçersiz sıra numarası.' }
    const shoe = ownedShoes.value[index]!
    const def = getShoeById(shoe.defId)
    const price = def?.sellPrice ?? 0
    if (equippedShoeIndex.value === index) equippedShoeIndex.value = -1
    const playerStore = usePlayerStore()
    playerStore.earnMoney(price)
    ownedShoes.value.splice(index, 1)
    if (equippedShoeIndex.value > index) equippedShoeIndex.value--
    return { success: true, message: `${def?.name ?? 'Ayakkabı'} satıldı, ${price} akçe alındı.` }
  }

  /** Ayakkabı yap */
  const craftShoe = (defId: string): { success: boolean; message: string } => {
    const def = getShoeById(defId)
    if (!def || !def.recipe) return { success: false, message: 'Bu ayakkabı yapılamaz.' }
    for (const mat of def.recipe) {
      if (getItemCount(mat.itemId) < mat.quantity) {
        const matName = getItemById(mat.itemId)?.name ?? mat.itemId
        return { success: false, message: `Gereç yetersiz: ${matName}.` }
      }
    }
    const playerStore = usePlayerStore()
    if (playerStore.money < def.recipeMoney) {
      return { success: false, message: `Akçe yetmiyor (${def.recipeMoney} gerekir).` }
    }
    for (const mat of def.recipe) {
      removeItem(mat.itemId, mat.quantity)
    }
    playerStore.spendMoney(def.recipeMoney)
    addShoe(defId)
    return { success: true, message: `${def.name} yapıldı!` }
  }

  // ============================================================
  // Teçhizat düzeni sistemi
  // ============================================================

  /** Boş düzen oluştur */
  const createEquipmentPreset = (name: string): boolean => {
    if (equipmentPresets.value.length >= 3) return false
    equipmentPresets.value.push({
      id: Date.now().toString(),
      name,
      weaponDefId: null,
      ringSlot1DefId: null,
      ringSlot2DefId: null,
      hatDefId: null,
      shoeDefId: null
    })
    return true
  }

  /** Düzeni sil */
  const deleteEquipmentPreset = (id: string) => {
    const idx = equipmentPresets.value.findIndex(p => p.id === id)
    if (idx >= 0) equipmentPresets.value.splice(idx, 1)
    if (activePresetId.value === id) activePresetId.value = null
  }

  /** Düzeni yeniden adlandır */
  const renameEquipmentPreset = (id: string, name: string) => {
    const preset = equipmentPresets.value.find(p => p.id === id)
    if (preset) preset.name = name.trim() || preset.name
  }

  /** Şu anki kuşanımı düzene kaydet */
  const saveCurrentToPreset = (id: string) => {
    const preset = equipmentPresets.value.find(p => p.id === id)
    if (!preset) return
    preset.weaponDefId = ownedWeapons.value[equippedWeaponIndex.value]?.defId ?? null
    preset.ringSlot1DefId = equippedRingSlot1.value >= 0 ? (ownedRings.value[equippedRingSlot1.value]?.defId ?? null) : null
    preset.ringSlot2DefId = equippedRingSlot2.value >= 0 ? (ownedRings.value[equippedRingSlot2.value]?.defId ?? null) : null
    preset.hatDefId = equippedHatIndex.value >= 0 ? (ownedHats.value[equippedHatIndex.value]?.defId ?? null) : null
    preset.shoeDefId = equippedShoeIndex.value >= 0 ? (ownedShoes.value[equippedShoeIndex.value]?.defId ?? null) : null
  }

  /** Teçhizat düzenini uygula */
  const applyEquipmentPreset = (id: string): { success: boolean; message: string } => {
    const preset = equipmentPresets.value.find(p => p.id === id)
    if (!preset) return { success: false, message: 'Böyle bir düzen yok.' }

    const missing: string[] = []

    if (preset.weaponDefId) {
      const idx = ownedWeapons.value.findIndex(w => w.defId === preset.weaponDefId)
      if (idx >= 0) equipWeapon(idx)
      else missing.push('silah')
    }

    let ring1Idx = -1
    if (preset.ringSlot1DefId) {
      ring1Idx = ownedRings.value.findIndex(r => r.defId === preset.ringSlot1DefId)
      if (ring1Idx >= 0) equipRing(ring1Idx, 0)
      else missing.push('yüzük1')
    } else {
      unequipRing(0)
    }

    if (preset.ringSlot2DefId) {
      if (preset.ringSlot2DefId === preset.ringSlot1DefId) {
        unequipRing(1)
        missing.push('yüzük2 (ilk yuvayla aynı olamaz)')
      } else {
        const idx = ownedRings.value.findIndex(r => r.defId === preset.ringSlot2DefId)
        if (idx >= 0) equipRing(idx, 1)
        else missing.push('yüzük2')
      }
    } else {
      unequipRing(1)
    }

    if (preset.hatDefId) {
      const idx = ownedHats.value.findIndex(h => h.defId === preset.hatDefId)
      if (idx >= 0) equipHat(idx)
      else missing.push('başlık')
    } else {
      unequipHat()
    }

    if (preset.shoeDefId) {
      const idx = ownedShoes.value.findIndex(s => s.defId === preset.shoeDefId)
      if (idx >= 0) equipShoe(idx)
      else missing.push('ayakkabı')
    } else {
      unequipShoe()
    }

    activePresetId.value = id

    if (missing.length > 0) {
      return { success: true, message: `“${preset.name}” düzeni uygulandı; ancak ${missing.join('、')} heybede bulunamadı.` }
    }
    return { success: true, message: `“${preset.name}” düzeni uygulandı.` }
  }

  const serialize = () => {
    return {
      items: items.value,
      capacity: capacity.value,
      tempItems: tempItems.value,
      tools: tools.value,
      ownedWeapons: ownedWeapons.value,
      equippedWeaponIndex: equippedWeaponIndex.value,
      pendingUpgrade: pendingUpgrade.value,
      ownedRings: ownedRings.value,
      equippedRingSlot1: equippedRingSlot1.value,
      equippedRingSlot2: equippedRingSlot2.value,
      ownedHats: ownedHats.value,
      equippedHatIndex: equippedHatIndex.value,
      ownedShoes: ownedShoes.value,
      equippedShoeIndex: equippedShoeIndex.value,
      equipmentPresets: equipmentPresets.value,
      activePresetId: activePresetId.value
    }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    items.value = (data.items ?? []).filter(i => getItemById(i.itemId))
    capacity.value = data.capacity ?? INITIAL_CAPACITY
    tempItems.value = ((data as any).tempItems ?? []).filter((i: InventoryItem) => getItemById(i.itemId))
    tools.value = data.tools ?? [
      { type: 'wateringCan', tier: 'basic' },
      { type: 'hoe', tier: 'basic' },
      { type: 'pickaxe', tier: 'basic' },
      { type: 'fishingRod', tier: 'basic' },
      { type: 'scythe', tier: 'basic' },
      { type: 'axe', tier: 'basic' },
      { type: 'pan', tier: 'basic' }
    ]

    const requiredTools: ToolType[] = ['wateringCan', 'hoe', 'pickaxe', 'fishingRod', 'scythe', 'axe', 'pan']
    for (const rt of requiredTools) {
      if (!tools.value.find(t => t.type === rt)) {
        tools.value.push({ type: rt, tier: 'basic' })
      }
    }

    if ((data as any).ownedWeapons) {
      ownedWeapons.value = (data as any).ownedWeapons
      equippedWeaponIndex.value = (data as any).equippedWeaponIndex ?? 0
    } else {
      const oldWeapon = (data as any).weapon
      if (oldWeapon?.tier) {
        const tierMap: Record<string, string> = {
          wood: 'wooden_stick',
          copper: 'copper_sword',
          iron: 'iron_blade',
          gold: 'gold_halberd'
        }
        const defId = tierMap[oldWeapon.tier as string] ?? 'wooden_stick'
        ownedWeapons.value = [{ defId, enchantmentId: null }]
        equippedWeaponIndex.value = 0
      } else {
        ownedWeapons.value = [{ defId: 'wooden_stick', enchantmentId: null }]
        equippedWeaponIndex.value = 0
      }
    }

    pendingUpgrade.value = (data as any).pendingUpgrade ?? null

    ownedRings.value = ((data as Record<string, unknown>).ownedRings as OwnedRing[]) ?? []
    equippedRingSlot1.value = ((data as Record<string, unknown>).equippedRingSlot1 as number | undefined) ?? -1
    equippedRingSlot2.value = ((data as Record<string, unknown>).equippedRingSlot2 as number | undefined) ?? -1
    if (equippedRingSlot1.value >= ownedRings.value.length) equippedRingSlot1.value = -1
    if (equippedRingSlot2.value >= ownedRings.value.length) equippedRingSlot2.value = -1

    ownedHats.value = ((data as Record<string, unknown>).ownedHats as OwnedHat[]) ?? []
    equippedHatIndex.value = ((data as Record<string, unknown>).equippedHatIndex as number | undefined) ?? -1
    if (equippedHatIndex.value >= ownedHats.value.length) equippedHatIndex.value = -1

    ownedShoes.value = ((data as Record<string, unknown>).ownedShoes as OwnedShoe[]) ?? []
    equippedShoeIndex.value = ((data as Record<string, unknown>).equippedShoeIndex as number | undefined) ?? -1
    if (equippedShoeIndex.value >= ownedShoes.value.length) equippedShoeIndex.value = -1

    equipmentPresets.value = ((data as Record<string, unknown>).equipmentPresets as EquipmentPreset[] | undefined) ?? []
    activePresetId.value = ((data as Record<string, unknown>).activePresetId as string | null | undefined) ?? null
  }

  return {
    items,
    capacity,
    tools,
    ownedWeapons,
    equippedWeaponIndex,
    pendingUpgrade,
    isFull,
    tempItems,
    isTempFull,
    isAllFull,
    addItem,
    removeItem,
    getItemCount,
    hasItem,
    expandCapacity,
    expandCapacityExtra,
    MAX_CAPACITY,
    moveFromTemp,
    moveAllFromTemp,
    discardTempItem,
    sortItems,
    toggleLock,
    getTool,
    getToolStaminaMultiplier,
    getToolBatchCount,
    upgradeTool,
    isToolAvailable,
    startUpgrade,
    dailyUpgradeUpdate,
    getWeaponAttack,
    getWeaponCritRate,
    getEquippedWeapon,
    addWeapon,
    hasWeapon,
    equipWeapon,
    sellWeapon,
    ownedRings,
    equippedRingSlot1,
    equippedRingSlot2,
    addRing,
    hasRing,
    equipRing,
    unequipRing,
    sellRing,
    getRingEffectValue,
    getEquipmentBonus,
    craftRing,
    activeSets,
    ownedHats,
    equippedHatIndex,
    addHat,
    hasHat,
    equipHat,
    unequipHat,
    sellHat,
    craftHat,
    ownedShoes,
    equippedShoeIndex,
    addShoe,
    hasShoe,
    equipShoe,
    unequipShoe,
    sellShoe,
    craftShoe,
    equipmentPresets,
    activePresetId,
    createEquipmentPreset,
    deleteEquipmentPreset,
    renameEquipmentPreset,
    saveCurrentToPreset,
    applyEquipmentPreset,
    serialize,
    deserialize
  }
})
