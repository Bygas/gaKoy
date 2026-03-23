import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { MachineType, ProcessingSlot, Quality } from '@/types'
import {
  PROCESSING_MACHINES,
  SPRINKLERS,
  FERTILIZERS,
  BAITS,
  TACKLES,
  TAPPER,
  CRAB_POT_CRAFT,
  BOMBS,
  getRecipesForMachine,
  getProcessingRecipeById
} from '@/data/processing'
import { useInventoryStore } from './useInventoryStore'
import { usePlayerStore } from './usePlayerStore'
import { useSkillStore } from './useSkillStore'
import { useBreedingStore } from './useBreedingStore'
import { useWarehouseStore } from './useWarehouseStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'
import { addLog } from '@/composables/useGameLog'
import { hasCombinedItem, removeCombinedItem, getLowestCombinedQuality } from '@/composables/useCombinedInventory'

/** Atölye yükseltme tanımları */
const WORKSHOP_UPGRADES = [
  {
    level: 1,
    cost: 10000,
    materials: [
      { itemId: 'iron_bar', quantity: 15 },
      { itemId: 'wood', quantity: 50 }
    ]
  },
  {
    level: 2,
    cost: 25000,
    materials: [
      { itemId: 'gold_bar', quantity: 10 },
      { itemId: 'wood', quantity: 80 }
    ]
  }
]

export const useProcessingStore = defineStore('processing', () => {
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const skillStore = useSkillStore()

  /** Yerleştirilmiş işleme makineleri (çalışan yuvalar) */
  const machines = ref<ProcessingSlot[]>([])

  /** Atölye seviyesi: 0/1/2, karşılığı 15/20/25 */
  const workshopLevel = ref(0)

  /** Yerleştirilebilecek azami makine sayısı */
  const maxMachines = computed(() => 15 + workshopLevel.value * 5)

  /** Şu anki yerleştirilmiş makine sayısı */
  const machineCount = computed(() => machines.value.length)

  // === Üretim (Craft) ===

  /** Bir şeyi üretmek için yeterli malzeme var mı kontrol et */
  const canCraft = (craftCost: { itemId: string; quantity: number }[], craftMoney: number): boolean => {
    if (playerStore.money < craftMoney) return false
    return craftCost.every(c => hasCombinedItem(c.itemId, c.quantity))
  }

  /** Malzeme tüket */
  const consumeCraftMaterials = (craftCost: { itemId: string; quantity: number }[], craftMoney: number): boolean => {
    if (!canCraft(craftCost, craftMoney)) return false
    if (!playerStore.spendMoney(craftMoney)) return false
    for (const c of craftCost) {
      if (!removeCombinedItem(c.itemId, c.quantity)) {
        // Geri sarma (basitleştirilmiş: canCraft zaten kontrol ettiği için normalde buraya düşmez)
        playerStore.earnMoney(craftMoney)
        return false
      }
    }
    return true
  }

  /** Bir işleme makinesi üret ve yerleştir */
  const craftMachine = (machineType: MachineType): boolean => {
    if (machines.value.length >= maxMachines.value) return false
    const def = PROCESSING_MACHINES.find(m => m.id === machineType)
    if (!def) return false
    if (!consumeCraftMaterials(def.craftCost, def.craftMoney)) return false
    machines.value.push({
      machineType,
      recipeId: null,
      inputItemId: null,
      daysProcessed: 0,
      totalDays: 0,
      ready: false
    })
    return true
  }

  /** Fıskiye üret (eşya kimliğini çantaya koyar) */
  const craftSprinkler = (sprinklerId: string): boolean => {
    const def = SPRINKLERS.find(s => s.id === sprinklerId)
    if (!def) return false
    if (!consumeCraftMaterials(def.craftCost, def.craftMoney)) return false
    inventoryStore.addItem(def.id)
    return true
  }

  /** Gübre üret */
  const craftFertilizer = (fertilizerId: string): boolean => {
    const def = FERTILIZERS.find(f => f.id === fertilizerId)
    if (!def) return false
    if (!consumeCraftMaterials(def.craftCost, def.craftMoney)) return false
    inventoryStore.addItem(def.id)
    return true
  }

  /** Yem üret */
  const craftBait = (baitId: string): boolean => {
    const def = BAITS.find(b => b.id === baitId)
    if (!def) return false
    if (!consumeCraftMaterials(def.craftCost, def.craftMoney)) return false
    inventoryStore.addItem(def.id)
    return true
  }

  /** Şamandıra üret */
  const craftTackle = (tackleId: string): boolean => {
    const def = TACKLES.find(t => t.id === tackleId)
    if (!def) return false
    if (!consumeCraftMaterials(def.craftCost, def.craftMoney)) return false
    inventoryStore.addItem(def.id)
    return true
  }

  /** Öz toplayıcı üret */
  const craftTapper = (): boolean => {
    if (!consumeCraftMaterials(TAPPER.craftCost, TAPPER.craftMoney)) return false
    inventoryStore.addItem(TAPPER.id)
    return true
  }

  /** Yengeç kapanı üret */
  const craftCrabPot = (): boolean => {
    if (!consumeCraftMaterials(CRAB_POT_CRAFT.craftCost, CRAB_POT_CRAFT.craftMoney)) return false
    inventoryStore.addItem(CRAB_POT_CRAFT.id)
    return true
  }

  /** Bomba üret */
  const craftBomb = (bombId: string): boolean => {
    const def = BOMBS.find(b => b.id === bombId)
    if (!def) return false
    if (!consumeCraftMaterials(def.craftCost, def.craftMoney)) return false
    inventoryStore.addItem(def.id)
    return true
  }

  // === İşleme işlemleri ===

  /** Çanta + ambar içindeki bir eşyanın en düşük kalitesini tespit et */
  const getLowestQuality = (itemId: string): Quality => {
    return getLowestCombinedQuality(itemId)
  }

  /** Yerleştirilmiş bir makineye girdi koyup işlemeyi başlat */
  const startProcessing = (slotIndex: number, recipeId: string): boolean => {
    const slot = machines.value[slotIndex]
    if (!slot || slot.recipeId !== null) return false // Zaten işleniyor
    const recipe = getProcessingRecipeById(recipeId)
    if (!recipe || recipe.machineType !== slot.machineType) return false

    // Girdi malzemesini tüket (arı kovanı girdi istemez), girilen kaliteyi kaydet
    let quality: Quality = 'normal'
    if (recipe.inputItemId !== null) {
      quality = getLowestQuality(recipe.inputItemId)
      // Belirli kalite istemeden tüket; karışık kalite girdisine izin ver
      if (!removeCombinedItem(recipe.inputItemId, recipe.inputQuantity)) return false
    }

    slot.recipeId = recipeId
    slot.inputItemId = recipe.inputItemId
    slot.inputQuality = quality
    slot.daysProcessed = 0
    slot.totalDays = recipe.processingDays
    // İlahi yetenek: Dokuma Tezi (gui_nv_1) dokuma tezgahı süresi %30 azalır
    if (slot.machineType === 'loom' && useHiddenNpcStore().isAbilityActive('gui_nv_1')) {
      slot.totalDays = Math.max(1, Math.ceil(slot.totalDays * 0.7))
    }
    slot.ready = false
    return true
  }

  /** İşlenmiş ürünü topla */
  const collectProduct = (slotIndex: number): string | null => {
    const slot = machines.value[slotIndex]
    if (!slot || !slot.ready || !slot.recipeId) return null

    const recipe = getProcessingRecipeById(slot.recipeId)
    if (!recipe) return null

    // Önce boşluk sandığına koy, doluysa çantaya düşsün
    const warehouseStore = useWarehouseStore()
    const voidOutput = warehouseStore.getVoidOutputChest()
    const outputQuality = slot.inputQuality ?? 'normal'
    if (!voidOutput || !warehouseStore.addItemToChest(voidOutput.id, recipe.outputItemId, recipe.outputQuantity, outputQuality)) {
      inventoryStore.addItem(recipe.outputItemId, recipe.outputQuantity, outputQuality)
    }

    // Tohum makinesi ayrıca ıslah tohumu üretme denemesi yapar
    if (slot.machineType === 'seed_maker' && slot.inputItemId) {
      const breedingStore = useBreedingStore()
      const farmingLevel = skillStore.farmingLevel
      if (breedingStore.trySeedMakerGeneticSeed(slot.inputItemId, farmingLevel)) {
        addLog('Tohum makinesi ayrıca bir ıslah tohumu üretti!')
      }
    }

    // Yuvayı sıfırla
    slot.recipeId = null
    slot.inputItemId = null
    slot.inputQuality = undefined
    slot.daysProcessed = 0
    slot.totalDays = 0
    slot.ready = false

    return recipe.outputItemId
  }

  /** Makineyi sök (girdi, bitmiş ürün ve üretim malzemelerini geri ver) */
  const removeMachine = (slotIndex: number): boolean => {
    const slot = machines.value[slotIndex]
    if (!slot) return false

    // Tamamlandıysa önce ürünü topla
    if (slot.recipeId && slot.ready) {
      const recipe = getProcessingRecipeById(slot.recipeId)
      if (recipe) {
        const warehouseStore = useWarehouseStore()
        const voidOutput = warehouseStore.getVoidOutputChest()
        const outputQuality = slot.inputQuality ?? 'normal'
        if (!voidOutput || !warehouseStore.addItemToChest(voidOutput.id, recipe.outputItemId, recipe.outputQuantity, outputQuality)) {
          inventoryStore.addItem(recipe.outputItemId, recipe.outputQuantity, outputQuality)
        }
      }
    }
    // İşleniyorsa girdiyi geri ver
    else if (slot.recipeId && !slot.ready && slot.inputItemId) {
      const recipe = getProcessingRecipeById(slot.recipeId)
      if (recipe && recipe.inputItemId) {
        inventoryStore.addItem(recipe.inputItemId, recipe.inputQuantity, slot.inputQuality ?? 'normal')
      }
    }

    // Makinenin üretim malzemelerini geri ver
    const machineDef = PROCESSING_MACHINES.find(m => m.id === slot.machineType)
    if (machineDef) {
      for (const mat of machineDef.craftCost) {
        inventoryStore.addItem(mat.itemId, mat.quantity)
      }
      playerStore.earnMoney(machineDef.craftMoney)
    }

    machines.value.splice(slotIndex, 1)
    return true
  }

  /** İşlemeyi iptal et (girdiyi geri ver, makine boşa çıksın) */
  const cancelProcessing = (slotIndex: number): boolean => {
    const slot = machines.value[slotIndex]
    if (!slot || !slot.recipeId) return false
    // İşleniyorsa ve girdi verilmişse girdiyi geri ver
    if (!slot.ready && slot.inputItemId) {
      const recipe = getProcessingRecipeById(slot.recipeId)
      if (recipe && recipe.inputItemId) {
        inventoryStore.addItem(recipe.inputItemId, recipe.inputQuantity, slot.inputQuality ?? 'normal')
      }
    }
    // Boş duruma sıfırla
    slot.recipeId = null
    slot.inputItemId = null
    slot.inputQuality = undefined
    slot.daysProcessed = 0
    slot.totalDays = 0
    slot.ready = false
    return true
  }

  /** Belirli bir makine için kullanılabilir tarifleri getir */
  const getAvailableRecipes = (machineType: MachineType) => {
    return getRecipesForMachine(machineType)
  }

  // === Günlük güncelleme ===

  const dailyUpdate = () => {
    const collected: string[] = []
    const readyNames: string[] = []
    const warehouseStore = useWarehouseStore()
    const voidOutput = warehouseStore.getVoidOutputChest()

    for (const slot of machines.value) {
      if (!slot.recipeId || slot.ready) continue
      slot.daysProcessed++
      if (slot.daysProcessed >= slot.totalDays) {
        const recipe = getProcessingRecipeById(slot.recipeId)
        if (recipe) {
          // İlahi yetenek: Düş İpi (gui_nv_2), dokuma tezgahında %8 ihtimalle düş ipeği
          if (slot.machineType === 'loom' && useHiddenNpcStore().isAbilityActive('gui_nv_2') && Math.random() < 0.08) {
            inventoryStore.addItem('dream_silk', 1)
            collected.push('Düş İpeği')
          }

          const machineDef = PROCESSING_MACHINES.find(m => m.id === slot.machineType)
          if (recipe.inputItemId === null || machineDef?.autoCollect) {
            // Kendiliğinden toplama: girdi istemeyen makineler veya autoCollect işaretli makineler
            const outputQuality = slot.inputQuality ?? 'normal'
            if (!voidOutput || !warehouseStore.addItemToChest(voidOutput.id, recipe.outputItemId, recipe.outputQuantity, outputQuality)) {
              inventoryStore.addItem(recipe.outputItemId, recipe.outputQuantity, outputQuality)
            }
            collected.push(recipe.name)

            // Girdi istemeyen makine kendiliğinden yeniden başlar; isteyen makine boşa döner
            if (recipe.inputItemId === null) {
              slot.daysProcessed = 0
              slot.inputQuality = undefined
              slot.ready = false
            } else {
              slot.recipeId = null
              slot.inputItemId = null
              slot.inputQuality = undefined
              slot.daysProcessed = 0
              slot.totalDays = 0
              slot.ready = false
            }
          } else {
            // Girdi isteyen makine: boşluk girdi sandığından otomatik devam edebilir mi bak
            const voidInput = warehouseStore.getVoidInputChest()
            if (voidInput && recipe.inputItemId) {
              // Mevcut ürünü otomatik topla
              const outputQuality = slot.inputQuality ?? 'normal'
              if (!voidOutput || !warehouseStore.addItemToChest(voidOutput.id, recipe.outputItemId, recipe.outputQuantity, outputQuality)) {
                inventoryStore.addItem(recipe.outputItemId, recipe.outputQuantity, outputQuality)
              }
              collected.push(recipe.name)

              // Boşluk girdi sandığından yeni tur başlatmayı dene
              const available = warehouseStore.getChestItemCount(voidInput.id, recipe.inputItemId)
              if (available >= recipe.inputQuantity) {
                // En düşük kaliteyi bul
                const qOrder: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
                const newQuality = qOrder.find(q => warehouseStore.getChestItemCount(voidInput.id, recipe.inputItemId!, q) > 0) ?? 'normal'
                warehouseStore.removeItemFromChest(voidInput.id, recipe.inputItemId, recipe.inputQuantity, newQuality)
                slot.daysProcessed = 0
                slot.inputQuality = newQuality
                slot.ready = false
              } else {
                // Yeterli girdi yoksa makine boşa döner
                slot.recipeId = null
                slot.inputItemId = null
                slot.inputQuality = undefined
                slot.daysProcessed = 0
                slot.totalDays = 0
                slot.ready = false
              }
            } else {
              // Boşluk girdi sandığı yoksa elde toplamayı bekler
              slot.ready = true
              readyNames.push(recipe.name)
            }
          }
        } else {
          slot.ready = true
        }
      }
    }

    if (collected.length > 0) {
      const counts = new Map<string, number>()
      for (const name of collected) {
        counts.set(name, (counts.get(name) ?? 0) + 1)
      }
      const summary = Array.from(counts.entries())
        .map(([name, count]) => (count > 1 ? `${name}x${count}` : name))
        .join('、')
      addLog(`Atölye kendiliğinden şunları topladı: ${summary}.`)
    }

    if (readyNames.length > 0) {
      const counts = new Map<string, number>()
      for (const name of readyNames) {
        counts.set(name, (counts.get(name) ?? 0) + 1)
      }
      const summary = Array.from(counts.entries())
        .map(([name, count]) => (count > 1 ? `${name}x${count}` : name))
        .join('、')
      addLog(`İşleme tamamlandı: ${summary}, atölyeye uğrayıp topla.`)
    }
  }

  // === Atölye yükseltmesi ===

  /** Atölyeyi yükselt (makine sınırı artsın) */
  const upgradeWorkshop = (): { success: boolean; message: string } => {
    const next = workshopLevel.value + 1
    const upgrade = WORKSHOP_UPGRADES.find(u => u.level === next)
    if (!upgrade) return { success: false, message: 'Atölye zaten en yüksek seviyede.' }
    if (!consumeCraftMaterials(upgrade.materials, upgrade.cost)) return { success: false, message: 'Malzeme ya da akçe yetersiz.' }
    workshopLevel.value = next
    return { success: true, message: `Atölye genişletildi! Makine sınırı ${maxMachines.value} oldu.` }
  }

  /** Bir sonraki yükseltme bilgisini getir */
  const getNextUpgrade = () => {
    const next = workshopLevel.value + 1
    return WORKSHOP_UPGRADES.find(u => u.level === next) ?? null
  }

  // === Serileştirme ===

  const serialize = () => {
    return { machines: machines.value, workshopLevel: workshopLevel.value }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    machines.value = data.machines ?? []
    workshopLevel.value = (data as any).workshopLevel ?? 0
  }

  return {
    machines,
    machineCount,
    maxMachines,
    workshopLevel,
    canCraft,
    consumeCraftMaterials,
    craftMachine,
    craftSprinkler,
    craftFertilizer,
    craftBait,
    craftTackle,
    craftTapper,
    craftCrabPot,
    craftBomb,
    startProcessing,
    collectProduct,
    cancelProcessing,
    removeMachine,
    getAvailableRecipes,
    dailyUpdate,
    upgradeWorkshop,
    getNextUpgrade,
    WORKSHOP_UPGRADES,
    serialize,
    deserialize
  }
})
