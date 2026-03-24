import { ref } from 'vue'
import { useAchievementStore } from '@/stores/useAchievementStore'
import { useBreedingStore } from '@/stores/useBreedingStore'
import { useCookingStore } from '@/stores/useCookingStore'
import { useFarmStore } from '@/stores/useFarmStore'
import { useGameStore } from '@/stores/useGameStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useShopStore } from '@/stores/useShopStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { getCropById, getItemById } from '@/data'
import { getFertilizerById } from '@/data/processing'
import { ACTION_TIME_COSTS } from '@/data/timeConstants'
import type { Quality, ItemCategory } from '@/types'
import type { FertilizerType } from '@/types/processing'
import { addLog, showFloat } from './useGameLog'
import { handleEndDay } from './useEndDay'
import { sfxDig, sfxPlant, sfxWater, sfxHarvest, sfxLevelUp, sfxBuy, sfxCoin } from './useAudio'

export const QUALITY_NAMES: Record<Quality, string> = {
  normal: 'Sıradan',
  fine: 'İyi',
  excellent: 'Seçkin',
  supreme: 'Eşsiz'
}

/** Gizli bağ etkisi: ürün kutu (crop_blessing) olasılıkla kaliteyi +1 artırır */
const QUALITY_ORDER: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
export const applyCropBlessing = (quality: Quality): Quality => {
  const bondBonus = useHiddenNpcStore().getBondBonusByType('crop_blessing')
  if (bondBonus?.type === 'crop_blessing' && Math.random() < bondBonus.chance) {
    const idx = QUALITY_ORDER.indexOf(quality)
    if (idx < QUALITY_ORDER.length - 1) return QUALITY_ORDER[idx + 1]!
  }
  return quality
}

// Modül düzeyinde tekil durum
const selectedSeed = ref<string | null>(null)

/** Tarla gözüne tıklama işlemi: sür / ek / sula / biç */
export const handlePlotClick = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const achievementStore = useAchievementStore()

  const plot = farmStore.plots[plotId]
  if (!plot) return

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  if (plot.state === 'wasteland') {
    if (!inventoryStore.isToolAvailable('hoe')) {
      addLog('Çapa ustanın elinde, şimdilik toprağı süremezsin.')
      return
    }
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const cost = Math.max(
      1,
      Math.floor(
        3 *
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - ringFarmReduction) *
          (1 - ringGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Dermanın yetmedi, toprağı süremedin.')
      return
    }
    farmStore.tillPlot(plotId)
    sfxDig()
    showFloat(`-${cost} derman`, 'danger')
    addLog(`Boş toprağı sürdün. (-${cost} derman)`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  } else if (plot.state === 'tilled' && selectedSeed.value) {
    const cropDef = getCropById(selectedSeed.value)
    if (!cropDef) return
    if (!inventoryStore.hasItem(cropDef.seedId)) {
      addLog(`${cropDef.name} tohumu kalmamış.`)
      return
    }
    const cropFarmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cropRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const cropRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const cost = Math.max(
      1,
      Math.floor(
        3 *
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - cropFarmingBuff) *
          (1 - cropRingFarmReduction) *
          (1 - cropRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Dermanın yetmedi, ekim yapamadın.')
      return
    }
    inventoryStore.removeItem(cropDef.seedId)
    farmStore.plantCrop(plotId, cropDef.id)
    sfxPlant()
    showFloat(`-${cost} derman`, 'danger')
    addLog(`${cropDef.name} ektin. (-${cost} derman)`)

    // Mevsim uyarısı: ürün bu mevsimde yetişmeyebilir
    const daysLeft = 28 - gameStore.day
    if (cropDef.growthDays > daysLeft) {
      const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'] as const
      const nextSeason = SEASON_ORDER[(SEASON_ORDER.indexOf(gameStore.season) + 1) % 4]!
      if (!cropDef.season.includes(nextSeason)) {
        showFloat(`${cropDef.name} için ${cropDef.growthDays} gün gerek, mevsimde yalnız ${daysLeft} gün kaldı!`, 'danger')
        addLog(`Dikkat: ${cropDef.name} yetişmek için ${cropDef.growthDays} gün ister; bu mevsimde yalnız ${daysLeft} gün kaldı. Mevsim dönünce solar gider.`)
      }
    }

    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  } else if (plot.state === 'planted' || plot.state === 'growing') {
    if (!inventoryStore.isToolAvailable('wateringCan')) {
      addLog('Su kabı ustanın elinde, şimdi sulayamazsın.')
      return
    }
    if (plot.watered) {
      addLog('Bu toprak bugün suyunu aldı.')
      return
    }
    const crop = getCropById(plot.cropId!)
    const baseCost = crop?.deepWatering ? 3 : 2
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const waterRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const waterRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const cost = Math.max(
      1,
      Math.floor(
        baseCost *
          inventoryStore.getToolStaminaMultiplier('wateringCan') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - waterRingFarmReduction) *
          (1 - waterRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Dermanın yetmedi, sulayamadın.')
      return
    }
    farmStore.waterPlot(plotId)
    skillStore.addExp('farming', 2)
    sfxWater()
    showFloat(`-${cost} derman`, 'water')
    addLog(`Toprağı suladın. (-${cost} derman)`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.water)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  } else if (plot.state === 'harvestable') {
    if (!inventoryStore.isToolAvailable('scythe')) {
      addLog('Orak ustanın elinde, şimdi biçemezsin.')
      return
    }
    // Orakla biçmek derman harcamaz
    const plotFertilizer = plot.fertilizer
    const result = farmStore.harvestPlot(plotId)
    const cropId = result.cropId
    const genetics = result.genetics

    if (cropId) {
      const cropDef = getCropById(cropId)
      const fertDef = plotFertilizer ? getFertilizerById(plotFertilizer) : null
      const ringCropQualityBonus = inventoryStore.getRingEffectValue('crop_quality_bonus')
      const allSkillsBuff = cookingStore.activeBuff?.type === 'all_skills' ? cookingStore.activeBuff.value : 0
      let quality = skillStore.rollCropQualityWithBonus((fertDef?.qualityBonus ?? 0) + ringCropQualityBonus, allSkillsBuff)
      quality = applyCropBlessing(quality)

      // İnce emek hüneri: %20 olasılıkla çift ürün
      const intensiveDouble = skillStore.getSkill('farming').perk10 === 'intensive' && Math.random() < 0.2
      // Islah verim katkısı: yield/100 × %30 olasılıkla çift ürün
      const yieldDouble = genetics && !intensiveDouble && Math.random() < (genetics.yield / 100) * 0.3
      const harvestQty = intensiveDouble || yieldDouble ? 2 : 1

      inventoryStore.addItem(cropId, harvestQty, quality)
      achievementStore.discoverItem(cropId)
      achievementStore.recordCropHarvest()
      useQuestStore().onItemObtained(cropId, harvestQty)
      const { leveledUp, newLevel } = skillStore.addExp('farming', 10)

      const qualityLabel = quality !== 'normal' ? ` (${QUALITY_NAMES[quality]})` : ''
      sfxHarvest()
      const qtyLabel = intensiveDouble || yieldDouble ? ' ×2' : ''
      showFloat(`+${cropDef?.name ?? cropId}${qtyLabel}${qualityLabel}`, 'success')

      let msg = `${cropDef?.name ?? cropId}${qtyLabel}${qualityLabel} biçtin!`
      if (intensiveDouble) msg += ' Eli özenli olanın harmanı da bol olur; çift ürün aldın!'
      if (yieldDouble) msg += ' Islah bereket verdi; çift ürün aldın!'

      // Islah tatlılık katkısı: ek para
      if (genetics && genetics.sweetness > 0 && cropDef) {
        const bonusMoney = Math.floor((cropDef.sellPrice * harvestQty * genetics.sweetness) / 200)
        if (bonusMoney > 0) {
          usePlayerStore().earnMoney(bonusMoney)
          msg += ` Tatlılık bereketi +${bonusMoney} akçe`
          showFloat(`+${bonusMoney} akçe`, 'accent')
        }
      }

      // Melez kayıt
      if (genetics?.isHybrid && genetics.hybridId) {
        useBreedingStore().recordHybridGrown(genetics.hybridId)
      }

      if (leveledUp) {
        msg += ` Ekin hünerin ${newLevel}. düzeye ulaştı!`
        sfxLevelUp()
      }

      addLog(msg)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.harvest)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    }
  }
}

/** Çarşıdan tohum satın al */
export const handleBuySeed = (seedId: string) => {
  const shopStore = useShopStore()
  const walletStore = useWalletStore()
  const seed = shopStore.availableSeeds.find(s => s.seedId === seedId)
  if (!seed) return
  const discount = walletStore.getShopDiscount()
  const actualPrice = Math.floor(seed.price * (1 - discount))
  if (shopStore.buySeed(seedId)) {
    sfxBuy()
    showFloat(`-${actualPrice} akçe`, 'danger')
    addLog(`${seed.cropName} tohumu aldın. (-${actualPrice} akçe)`)
  } else {
    addLog('Akçen yetmedi ya da heybende yer kalmadı.')
  }
}

/** Çarşı üzerinden eşya sat */
export const handleSellItem = (itemId: string, quality: Quality) => {
  const shopStore = useShopStore()
  const itemDef = getItemById(itemId)
  if (!itemDef) return
  const earned = shopStore.sellItem(itemId, 1, quality)
  if (earned > 0) {
    sfxCoin()
    showFloat(`+${earned} akçe`, 'accent')
    addLog(`${itemDef.name} sattın. (+${earned} akçe)`)
  }
}

/** Belirli bir eşyanın tüm miktarını sat */
export const handleSellItemAll = (itemId: string, quantity: number, quality: Quality) => {
  const shopStore = useShopStore()
  const itemDef = getItemById(itemId)
  if (!itemDef || quantity <= 0) return
  const earned = shopStore.sellItem(itemId, quantity, quality)
  if (earned > 0) {
    sfxCoin()
    showFloat(`+${earned} akçe`, 'accent')
    addLog(`${itemDef.name} ×${quantity} sattın. (+${earned} akçe)`)
  }
}

/** Heybedeki tüm satılabilir eşyaları bir kerede sat */
export const handleSellAll = (filterCategories?: ItemCategory[]) => {
  const shopStore = useShopStore()
  const inventoryStore = useInventoryStore()
  let totalEarned = 0
  let totalCount = 0
  const allowed = filterCategories && filterCategories.length > 0 ? new Set(filterCategories) : null

  const sellable = inventoryStore.items
    .filter(inv => {
      const def = getItemById(inv.itemId)
      return def && def.category !== 'seed' && !inv.locked && (!allowed || allowed.has(def.category))
    })
    .map(inv => ({ itemId: inv.itemId, quantity: inv.quantity, quality: inv.quality }))

  for (const item of sellable) {
    const earned = shopStore.sellItem(item.itemId, item.quantity, item.quality)
    if (earned > 0) {
      totalEarned += earned
      totalCount += item.quantity
    }
  }

  if (totalEarned > 0) {
    sfxCoin()
    showFloat(`+${totalEarned} akçe`, 'accent')
    addLog(`Bir solukta ${totalCount} parça eşya sattın. (+${totalEarned} akçe)`)
  }
}

/** Bir kerede sulama (tüm susuz ekinleri sular, derman yetmezse durur) */
export const handleBatchWater = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()

  if (!inventoryStore.isToolAvailable('wateringCan')) {
    addLog('Su kabı ustanın elinde, şimdi sulayamazsın.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => (p.state === 'planted' || p.state === 'growing') && !p.watered)
  if (targets.length === 0) {
    addLog('Su bekleyen tarla gözü yok.')
    return
  }

  let watered = 0
  const batchRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const batchRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')

  for (const plot of targets) {
    const crop = getCropById(plot.cropId!)
    const baseCost = crop?.deepWatering ? 3 : 2
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        baseCost *
          inventoryStore.getToolStaminaMultiplier('wateringCan') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - batchRingFarmReduction) *
          (1 - batchRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.waterPlot(plot.id)
    skillStore.addExp('farming', 2)
    watered++
  }

  if (watered > 0) {
    sfxWater()
    addLog(`${watered} tarla gözüne bir solukta su verdin.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchWater * inventoryStore.getToolStaminaMultiplier('wateringCan'))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Dermanın yetmedi, sulama yapamadın.')
  }
}

/** Bir kerede sürme (tüm boş toprağı sürer, derman yetmezse durur) */
export const handleBatchTill = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()

  if (!inventoryStore.isToolAvailable('hoe')) {
    addLog('Çapa ustanın elinde, şimdi toprağı süremezsin.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => p.state === 'wasteland')
  if (targets.length === 0) {
    addLog('Sürülecek boş toprak yok.')
    return
  }

  let tilled = 0
  const tillRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const tillRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')

  for (const plot of targets) {
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        3 *
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - tillRingFarmReduction) *
          (1 - tillRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.tillPlot(plot.id)
    tilled++
  }

  if (tilled > 0) {
    sfxDig()
    addLog(`${tilled} parça boş toprağı bir çırpıda sürdün.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchTill * inventoryStore.getToolStaminaMultiplier('hoe'))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Dermanın yetmedi, toprağı süremedin.')
  }
}

/** Bir kerede biçme (tüm olgun ürünleri toplar, derman harcamaz) */
export const handleBatchHarvest = () => {
  const gameStore = useGameStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const achievementStore = useAchievementStore()

  if (!inventoryStore.isToolAvailable('scythe')) {
    addLog('Orak ustanın elinde, şimdi biçemezsin.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  let harvested = 0
  const harvestedCrops: string[] = []

  // Önce dev ürünleri biç
  const giantGroups = new Set<number>()
  for (const plot of farmStore.plots) {
    if (plot.state === 'harvestable' && plot.giantCropGroup !== null) {
      giantGroups.add(plot.giantCropGroup)
    }
  }

  for (const groupId of giantGroups) {
    const groupPlot = farmStore.plots.find(p => p.giantCropGroup === groupId && p.state === 'harvestable')
    if (!groupPlot) continue
    const result = farmStore.harvestGiantCrop(groupPlot.id)
    if (result) {
      const cropDef = getCropById(result.cropId)
      inventoryStore.addItem(result.cropId, result.quantity)
      achievementStore.discoverItem(result.cropId)
      achievementStore.recordCropHarvest()
      useQuestStore().onItemObtained(result.cropId, result.quantity)
      skillStore.addExp('farming', 10)
      harvested++
      harvestedCrops.push(`Dev ${cropDef?.name ?? result.cropId} x${result.quantity}`)
    }
  }

  // Sonra sıradan ürünleri biç
  const targets = farmStore.plots.filter(p => p.state === 'harvestable' && p.giantCropGroup === null)

  for (const plot of targets) {
    const plotFertilizer = plot.fertilizer
    const result = farmStore.harvestPlot(plot.id)
    const cropId = result.cropId
    const genetics = result.genetics

    if (cropId) {
      const cropDef = getCropById(cropId)
      const fertDef = plotFertilizer ? getFertilizerById(plotFertilizer) : null
      const batchRingCropQuality = inventoryStore.getRingEffectValue('crop_quality_bonus')
      const batchAllSkillsBuff = cookingStore.activeBuff?.type === 'all_skills' ? cookingStore.activeBuff.value : 0
      let quality = skillStore.rollCropQualityWithBonus((fertDef?.qualityBonus ?? 0) + batchRingCropQuality, batchAllSkillsBuff)
      quality = applyCropBlessing(quality)

      const intensiveDouble = skillStore.getSkill('farming').perk10 === 'intensive' && Math.random() < 0.2
      const yieldDouble = genetics && !intensiveDouble && Math.random() < (genetics.yield / 100) * 0.3
      const harvestQty = intensiveDouble || yieldDouble ? 2 : 1

      inventoryStore.addItem(cropId, harvestQty, quality)
      achievementStore.discoverItem(cropId)
      achievementStore.recordCropHarvest()
      useQuestStore().onItemObtained(cropId, harvestQty)
      skillStore.addExp('farming', 10)
      harvested++
      harvestedCrops.push(cropDef?.name ?? cropId)

      if (genetics && genetics.sweetness > 0 && cropDef) {
        const bonusMoney = Math.floor((cropDef.sellPrice * harvestQty * genetics.sweetness) / 200)
        if (bonusMoney > 0) {
          usePlayerStore().earnMoney(bonusMoney)
        }
      }

      if (genetics?.isHybrid && genetics.hybridId) {
        useBreedingStore().recordHybridGrown(genetics.hybridId)
      }
    }
  }

  if (harvested > 0) {
    sfxHarvest()
    const cropCounts = new Map<string, number>()
    for (const name of harvestedCrops) {
      cropCounts.set(name, (cropCounts.get(name) ?? 0) + 1)
    }
    const cropSummary = Array.from(cropCounts.entries())
      .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
      .join('、')
    addLog(`${harvested} ürün bir solukta toplandı: ${cropSummary}.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchHarvest * inventoryStore.getToolStaminaMultiplier('scythe'))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Biçilecek olgun ürün yok.')
  }
}

/** Tüm boş sürülü tarlalara belirli ürünü ek */
export const handleBatchPlant = (cropId: string) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()

  if (!inventoryStore.isToolAvailable('hoe')) {
    addLog('Çapa ustanın elinde, şimdi ekim yapamazsın.')
    return
  }

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const cropDef = getCropById(cropId)
  if (!cropDef) return

  const targets = farmStore.plots.filter(p => p.state === 'tilled')
  if (targets.length === 0) {
    addLog('Ekilecek boş sürülü toprak yok.')
    return
  }

  let planted = 0
  const plantRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const plantRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')

  for (const plot of targets) {
    if (!inventoryStore.hasItem(cropDef.seedId)) break
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        3 *
          inventoryStore.getToolStaminaMultiplier('hoe') *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - plantRingFarmReduction) *
          (1 - plantRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    inventoryStore.removeItem(cropDef.seedId)
    farmStore.plantCrop(plot.id, cropDef.id)
    planted++
  }

  if (planted > 0) {
    sfxPlant()
    addLog(`${cropDef.name} tohumundan ${planted} göz toprağa ekildi.`)

    const daysLeft = 28 - gameStore.day
    if (cropDef.growthDays > daysLeft) {
      const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'] as const
      const nextSeason = SEASON_ORDER[(SEASON_ORDER.indexOf(gameStore.season) + 1) % 4]!
      if (!cropDef.season.includes(nextSeason)) {
        showFloat(`${cropDef.name} için ${cropDef.growthDays} gün gerek, mevsimde yalnız ${daysLeft} gün kaldı!`, 'danger')
        addLog(`Dikkat: ${cropDef.name} yetişmek için ${cropDef.growthDays} gün ister; bu mevsimde yalnız ${daysLeft} gün kaldı. Mevsim dönünce solar gider.`)
      }
    }

    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant * Math.min(planted, 3))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Dermanın yetmedi ya da tohumun eksik, ekim yapamadın.')
  }
}

/** Tüm uygun tarlalara bir kerede gübre ser */
export const handleBatchFertilize = (fertilizerType: FertilizerType) => {
  const gameStore = useGameStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const fertDef = getFertilizerById(fertilizerType)
  if (!fertDef) return

  const targets = farmStore.plots.filter(p => p.state !== 'wasteland' && !p.fertilizer)
  if (targets.length === 0) {
    addLog('Gübre bekleyen tarla gözü yok.')
    return
  }

  let applied = 0
  for (const plot of targets) {
    if (!inventoryStore.hasItem(fertilizerType)) break
    if (!inventoryStore.removeItem(fertilizerType)) break
    if (farmStore.applyFertilizer(plot.id, fertilizerType)) {
      applied++
    } else {
      inventoryStore.addItem(fertilizerType)
      break
    }
  }

  if (applied > 0) {
    showFloat(`Gübre ×${applied}`, 'success')
    addLog(`${fertDef.name} ile ${applied} tarla gözüne bereket serptin.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant * Math.min(applied, 3))
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Gübren yetmedi, serpecek bir şey kalmadı.')
  }
}

/** Tek gözdeki ürünü sök */
export const handleRemoveCrop = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const plot = farmStore.plots[plotId]
  if (!plot) return
  if (plot.state !== 'planted' && plot.state !== 'growing' && plot.state !== 'harvestable') {
    addLog('Bu gözde sökülecek bir ürün yok.')
    return
  }

  const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
  const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  const cost = Math.max(
    1,
    Math.floor(
      2 * (1 - skillStore.getStaminaReduction('farming')) * (1 - farmingBuff) * (1 - ringFarmReduction) * (1 - ringGlobalReduction)
    )
  )
  if (!playerStore.consumeStamina(cost)) {
    addLog('Dermanın yetmedi, ürünü sökemedin.')
    return
  }

  const result = farmStore.removeCrop(plotId)
  if (result.cropId) {
    const cropDef = getCropById(result.cropId)
    sfxDig()
    addLog(`${cropDef?.name ?? result.cropId} söktün.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
}

/** Tek gözde zararlıyı temizle */
export const handleCurePest = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const plot = farmStore.plots[plotId]
  if (!plot || !plot.infested) {
    addLog('Bu gözde haşere izi yok.')
    return
  }

  const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
  const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  const cost = Math.max(
    1,
    Math.floor(
      2 * (1 - skillStore.getStaminaReduction('farming')) * (1 - farmingBuff) * (1 - ringFarmReduction) * (1 - ringGlobalReduction)
    )
  )
  if (!playerStore.consumeStamina(cost)) {
    addLog('Dermanın yetmedi, haşereyi temizleyemedin.')
    return
  }

  if (farmStore.curePest(plotId)) {
    sfxDig()
    addLog('Topraktaki haşereyi temizledin.')
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
}

/** Tüm haşereli gözleri bir kerede temizle */
export const handleBatchCurePest = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => p.infested)
  if (targets.length === 0) {
    addLog('Temizlenecek haşereli tarla yok.')
    return
  }

  let cured = 0
  const batchRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const batchRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')

  for (const plot of targets) {
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        2 *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - batchRingFarmReduction) *
          (1 - batchRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.curePest(plot.id)
    cured++
  }

  if (cured > 0) {
    sfxDig()
    addLog(`${cured} tarla gözündeki haşereyi bir solukta temizledin.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchTill)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Dermanın yetmedi, haşere temizlenemedi.')
  }
}

/** Tek gözde yabani otu temizle */
export const handleClearWeed = (plotId: number) => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const plot = farmStore.plots[plotId]
  if (!plot || !plot.weedy) {
    addLog('Bu gözde ayıklanacak yabani ot yok.')
    return
  }

  const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
  const ringFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
  const cost = Math.max(
    1,
    Math.floor(
      2 * (1 - skillStore.getStaminaReduction('farming')) * (1 - farmingBuff) * (1 - ringFarmReduction) * (1 - ringGlobalReduction)
    )
  )
  if (!playerStore.consumeStamina(cost)) {
    addLog('Dermanın yetmedi, otu ayıklayamadın.')
    return
  }

  if (farmStore.clearWeed(plotId)) {
    sfxDig()
    addLog('Yabani otu temizledin.')
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.till)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
}

/** Tüm yabani otları bir kerede temizle */
export const handleBatchClearWeed = () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const skillStore = useSkillStore()
  const cookingStore = useCookingStore()
  const inventoryStore = useInventoryStore()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    return
  }

  const targets = farmStore.plots.filter(p => p.weedy)
  if (targets.length === 0) {
    addLog('Ayıklanacak yabani ot yok.')
    return
  }

  let cleared = 0
  const batchRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
  const batchRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')

  for (const plot of targets) {
    const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
    const cost = Math.max(
      1,
      Math.floor(
        2 *
          (1 - skillStore.getStaminaReduction('farming')) *
          (1 - farmingBuff) *
          (1 - batchRingFarmReduction) *
          (1 - batchRingGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(cost)) break
    farmStore.clearWeed(plot.id)
    cleared++
  }

  if (cleared > 0) {
    sfxDig()
    addLog(`${cleared} tarla gözündeki yabani otu temizledin.`)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchTill)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  } else {
    addLog('Dermanın yetmedi, otları temizleyemedin.')
  }
}

export const useFarmActions = () => {
  return {
    selectedSeed,
    handlePlotClick,
    handleBuySeed,
    handleSellItem,
    handleSellItemAll,
    handleSellAll,
    handleBatchWater,
    handleBatchTill,
    handleBatchHarvest,
    QUALITY_NAMES
  }
      }
