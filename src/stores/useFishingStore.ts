import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {
  FishDef,
  BaitType,
  TackleType,
  BaitDef,
  TackleDef,
  ToolTier,
  Quality,
  FishingLocation,
  CrabPotState,
  MiniGameParams,
  MiniGameRating
} from '@/types'
import { getAvailableFish, getBaitById, getTackleById, getItemById } from '@/data'
import { FISH } from '@/data/fish'
import { useGameStore } from './useGameStore'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { useSkillStore } from './useSkillStore'
import { useAchievementStore } from './useAchievementStore'
import { useQuestStore } from './useQuestStore'
import { useCookingStore } from './useCookingStore'
import { useWalletStore } from './useWalletStore'
import { useSecretNoteStore } from './useSecretNoteStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'

const STAMINA_COST = 4
const MAX_CRAB_POTS = 10
const MAX_CRAB_POTS_PER_LOCATION = 3

/** Yengeç sepeti ganimet havuzu */
const CRAB_POT_LOOT: { itemId: string; weight: number; locationOverride?: FishingLocation; replaces?: string }[] = [
  { itemId: 'snail', weight: 20 },
  { itemId: 'freshwater_shrimp', weight: 25 },
  { itemId: 'crab', weight: 20 },
  { itemId: 'lobster', weight: 10 },
  { itemId: 'trash', weight: 10 },
  { itemId: 'driftwood', weight: 10 },
  { itemId: 'broken_cd', weight: 5 },
  { itemId: 'soggy_newspaper', weight: 8 },
  { itemId: 'cave_shrimp', weight: 25, locationOverride: 'mine', replaces: 'freshwater_shrimp' },
  { itemId: 'swamp_crab', weight: 20, locationOverride: 'swamp', replaces: 'crab' }
]

/** Balıkçılık hurdaları */
const FISHING_JUNK = ['trash', 'driftwood', 'broken_cd', 'soggy_newspaper']

/** Hazine sandığı ödül havuzu */
const TREASURE_POOL: { itemId: string | null; weight: number; minQty: number; maxQty: number; money?: number }[] = [
  { itemId: 'copper_ore', weight: 30, minQty: 1, maxQty: 3 },
  { itemId: 'iron_ore', weight: 20, minQty: 1, maxQty: 3 },
  { itemId: 'gold_ore', weight: 10, minQty: 1, maxQty: 2 },
  { itemId: 'crystal_ore', weight: 5, minQty: 1, maxQty: 1 },
  { itemId: 'jade', weight: 3, minQty: 1, maxQty: 1 },
  { itemId: 'quartz', weight: 5, minQty: 1, maxQty: 1 },
  { itemId: 'wood', weight: 15, minQty: 3, maxQty: 5 },
  { itemId: 'firewood', weight: 10, minQty: 2, maxQty: 4 },
  { itemId: 'standard_bait', weight: 10, minQty: 2, maxQty: 3 },
  { itemId: 'wild_berry', weight: 8, minQty: 1, maxQty: 2 },
  { itemId: 'herb', weight: 8, minQty: 1, maxQty: 2 },
  { itemId: 'ginseng', weight: 3, minQty: 1, maxQty: 1 },
  { itemId: null, weight: 10, minQty: 50, maxQty: 200 }
]

export const useFishingStore = defineStore('fishing', () => {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()

  /** Şu anki avlak */
  const fishingLocation = ref<FishingLocation>('creek')

  /** Avlağı değiştir */
  const setLocation = (loc: FishingLocation) => {
    fishingLocation.value = loc
  }

  /** Şu an tutulabilecek balıklar */
  const availableFish = computed(() => getAvailableFish(gameStore.season, gameStore.weather, fishingLocation.value))

  /** O anki balık tutma oturumu durumu */
  const currentFish = ref<FishDef | null>(null)

  /** Son tutuşta çıkan sandık ganimeti */
  const lastTreasure = ref<{ items: { itemId: string; name: string; quantity: number }[]; money: number } | null>(null)

  /** Son yakalayış kusursuz muydu */
  const lastPerfect = ref(false)

  /** Yem / şamandıra kuşanımı */
  const equippedBait = ref<BaitType | null>(null)
  const equippedTackle = ref<TackleType | null>(null)
  const tackleDurability = ref(0)

  /** Bu balık tutuşta kullanılan yem / şamandıra */
  const activeBaitDef = ref<BaitDef | null>(null)
  const activeTackleDef = ref<TackleDef | null>(null)

  /** Yengeç sepetleri */
  const crabPots = ref<CrabPotState[]>([])

  /** Yem kuşan */
  const equipBait = (type: BaitType): { success: boolean; message: string } => {
    const def = getBaitById(type)
    if (!def) return { success: false, message: 'Geçersiz yem.' }
    if (inventoryStore.getItemCount(type) <= 0) return { success: false, message: 'Heybende bu yem yok.' }
    equippedBait.value = type
    return { success: true, message: `${def.name} kuşanıldı.` }
  }

  /** Yemi çıkar */
  const unequipBait = (): string => {
    if (!equippedBait.value) return 'Kuşanılmış yem yok.'
    const def = getBaitById(equippedBait.value)
    equippedBait.value = null
    return `${def?.name ?? 'Yem'} çıkarıldı.`
  }

  /** Şamandıra kuşan */
  const equipTackle = (type: TackleType): { success: boolean; message: string } => {
    const def = getTackleById(type)
    if (!def) return { success: false, message: 'Geçersiz şamandıra.' }
    const rodTier = inventoryStore.getTool('fishingRod')?.tier ?? 'basic'
    if (rodTier === 'basic') return { success: false, message: 'Şamandıra takmak için demir ya da daha iyi bir olta gerekir.' }
    if (!inventoryStore.removeItem(type, 1)) return { success: false, message: 'Heybende bu şamandıra yok.' }
    if (equippedTackle.value) unequipTackle()
    equippedTackle.value = type
    tackleDurability.value = def.maxDurability
    return { success: true, message: `${def.name} kuşanıldı. (Dayanıklılık: ${def.maxDurability})` }
  }

  /** Şamandırayı çıkar */
  const unequipTackle = (): string => {
    if (!equippedTackle.value) return 'Kuşanılmış şamandıra yok.'
    const def = getTackleById(equippedTackle.value)
    if (tackleDurability.value > 0) {
      inventoryStore.addItem(equippedTackle.value, 1)
    }
    equippedTackle.value = null
    tackleDurability.value = 0
    return `${def?.name ?? 'Şamandıra'} çıkarıldı.`
  }

  /** Balık tutmaya başla */
  const startFishing = (): { success: boolean; message: string; junk?: boolean } => {
    const rodMultiplier = inventoryStore.getToolStaminaMultiplier('fishingRod')
    const tackleDef = equippedTackle.value ? getTackleById(equippedTackle.value) : null
    const tackleStaminaReduction = tackleDef?.staminaReduction ?? 0
    const ringFishingReduction = inventoryStore.getRingEffectValue('fishing_stamina')
    const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const staminaCost = Math.max(
      1,
      Math.floor(
        STAMINA_COST *
          rodMultiplier *
          (1 - skillStore.getStaminaReduction('fishing')) *
          (1 - tackleStaminaReduction) *
          (1 - ringFishingReduction) *
          (1 - ringGlobalReduction)
      )
    )
    if (!playerStore.consumeStamina(staminaCost)) {
      return { success: false, message: 'Takatin yetmiyor, olta atamazsın.' }
    }

    // Büyülü yem mevsimi hiçe sayar ama avlak şartı sürer
    const baitDef = equippedBait.value ? getBaitById(equippedBait.value) : null
    const loc = fishingLocation.value
    const fishPool = baitDef?.ignoresSeason
      ? FISH.filter(f => (f.location ?? 'creek') === loc && (f.weather.includes('any') || f.weather.includes(gameStore.weather as any)))
      : availableFish.value

    if (fishPool.length === 0) {
      playerStore.restoreStamina(staminaCost)
      return { success: false, message: 'Bu mevsim ve bu havada tutulacak balık yok.' }
    }

    // Yem tüket
    activeBaitDef.value = baitDef ?? null
    if (equippedBait.value) {
      inventoryStore.removeItem(equippedBait.value, 1)
      if (inventoryStore.getItemCount(equippedBait.value) <= 0) {
        equippedBait.value = null
      }
    }

    // Şamandıra dayanıklılığı
    activeTackleDef.value = tackleDef ?? null
    if (equippedTackle.value && tackleDef) {
      tackleDurability.value--
      if (tackleDurability.value <= 0) {
        equippedTackle.value = null
      }
    }

    // Hurdalık yakalama hesabı
    const junkBase = 0.12 - skillStore.fishingLevel * 0.01
    const junkChance = Math.max(0, baitDef ? junkBase * 0.5 : junkBase)
    if (Math.random() < junkChance) {
      const junkId = FISHING_JUNK[Math.floor(Math.random() * FISHING_JUNK.length)]!
      const junkName = getItemById(junkId)?.name ?? junkId
      inventoryStore.addItem(junkId)
      currentFish.value = null
      skillStore.addExp('fishing', 3)
      return { success: true, junk: true, message: `${junkName} çekip çıkardın… (-${staminaCost} takat)` }
    }

    const fish = pickRandomFish(fishPool)
    currentFish.value = fish
    lastTreasure.value = null
    lastPerfect.value = false

    let msg = `Olta suya düştü… Yakında ${fish.name} dolaşıyor gibi! (-${staminaCost} takat)`
    if (activeBaitDef.value) msg += ` [${activeBaitDef.value.name}]`
    if (activeTackleDef.value) msg += ` [${activeTackleDef.value.name}]`
    return { success: true, message: msg }
  }

  /** Mini oyun ayarlarını hesapla */
  const calculateMiniGameParams = (): MiniGameParams => {
    const fish = currentFish.value!
    const rodTier = inventoryStore.getTool('fishingRod')?.tier ?? 'basic'
    const level = skillStore.fishingLevel

    const rodHookMap: Record<ToolTier, number> = { basic: 40, iron: 45, steel: 50, iridium: 60 }
    let hookHeight = rodHookMap[rodTier] + level * 2

    const rodTimeMap: Record<ToolTier, number> = { basic: 30, iron: 33, steel: 36, iridium: 40 }
    const timeLimit = rodTimeMap[rodTier]

    const difficultySpeedMap: Record<string, number> = { easy: 1.0, normal: 2.0, hard: 3.0, legendary: 4.0 }
    const difficultyDirMap: Record<string, number> = { easy: 0.02, normal: 0.04, hard: 0.06, legendary: 0.08 }
    let fishSpeed = fish.miniGameSpeed ?? difficultySpeedMap[fish.difficulty] ?? 2.0
    let fishChangeDir = fish.miniGameDirChange ?? difficultyDirMap[fish.difficulty] ?? 0.04

    let gravity = 1.5
    let scoreGain = 0.15
    let scoreLoss = 0.1

    // Yem etkileri
    if (activeBaitDef.value?.behaviorModifier) {
      fishSpeed *= 1 - activeBaitDef.value.behaviorModifier.calm * 0.3
    }
    if (activeBaitDef.value?.struggleBonus) {
      fishSpeed *= 0.9
    }

    // Şamandıra etkileri
    if (activeTackleDef.value) {
      if (activeTackleDef.value.staminaReduction) gravity *= 1 - activeTackleDef.value.staminaReduction
      if (activeTackleDef.value.extraBreakChance) scoreLoss *= 0.5
      if (activeTackleDef.value.struggleBonus) hookHeight += 15
      if (activeTackleDef.value.dangerReduction) fishChangeDir *= 0.5
    }

    // Balıkçı nişanı etkisi
    const walletStore = useWalletStore()
    const calmBonus = walletStore.getFishingCalmBonus()
    if (calmBonus > 0) {
      fishSpeed *= 1 - calmBonus
    }

    // Yüzük etkisi
    const ringCalmBonus = inventoryStore.getRingEffectValue('fishing_calm')
    if (ringCalmBonus > 0) {
      fishSpeed *= 1 - ringCalmBonus
    }

    return {
      fishName: fish.name,
      difficulty: fish.difficulty,
      hookHeight,
      fishSpeed,
      fishChangeDir,
      gravity,
      liftSpeed: 3.0,
      scoreGain,
      scoreLoss,
      timeLimit
    }
  }

  /** Zorluk, seviye ve oltaya göre ağırlıklı balık seç */
  const pickRandomFish = (pool?: FishDef[]): FishDef => {
    const fishPool = pool ?? availableFish.value
    const cookingStore = useCookingStore()
    const fishingBuff =
      cookingStore.activeBuff?.type === 'fishing' || cookingStore.activeBuff?.type === 'all_skills' ? cookingStore.activeBuff.value : 0
    const luckBuff = cookingStore.activeBuff?.type === 'luck' ? cookingStore.activeBuff.value / 100 : 0
    const effectiveLevel = skillStore.fishingLevel + fishingBuff
    const rodTier = inventoryStore.getTool('fishingRod')?.tier ?? 'basic'
    const hasAngler = skillStore.getSkill('fishing').perk10 === 'angler'

    const hardMult = activeBaitDef.value?.hardWeightMult ?? 1
    const legendaryMult = activeBaitDef.value?.legendaryWeightMult ?? 1

    // Kutlu bağ kudretleri
    const hiddenNpcStore = useHiddenNpcStore()
    const legendaryBoost = 1 + hiddenNpcStore.getAbilityValue('long_ling_3') / 100
    const bondBonus = hiddenNpcStore.getBondBonusByType('fish_attraction')
    const fishAttractionMult = bondBonus?.type === 'fish_attraction' ? 1.5 : 1

    const weights: number[] = fishPool.map(f => {
      if (f.difficulty === 'legendary') {
        const minLevel = hasAngler ? 6 : 8
        if (rodTier === 'basic' || effectiveLevel < minLevel) return 0
        return (hasAngler ? 1.5 : 0.5) * (1 + luckBuff) * legendaryMult * legendaryBoost
      }
      if (f.difficulty === 'hard') {
        if (rodTier === 'basic' && effectiveLevel < 4) return 0
        return (rodTier === 'basic' ? 0.5 : 1) * (1 + luckBuff) * hardMult * fishAttractionMult
      }
      if (f.difficulty === 'easy') return 3
      if (f.difficulty === 'normal') return 2
      return 0.5
    })

    const total = weights.reduce((a, b) => a + b, 0)
    let roll = Math.random() * total
    for (let i = 0; i < fishPool.length; i++) {
      roll -= weights[i]!
      if (roll <= 0) return fishPool[i]!
    }
    return fishPool[0]!
  }

  /** Balık tutmayı tamamla */
  const completeFishing = (rating: MiniGameRating): { message: string; fishName?: string; fishId?: string; difficulty?: string; sellPrice?: number; description?: string; quality?: Quality; quantity?: number; success: boolean } | null => {
    if (!currentFish.value) return null

    // poor = balık kaçtı
    if (rating === 'poor') {
      const fish = currentFish.value
      endFishing()
      return {
        message: `Balık elinden sıyrıldı… ${fish.name} kaçıp gitti!`,
        fishName: fish.name,
        fishId: fish.id,
        difficulty: fish.difficulty,
        sellPrice: fish.sellPrice,
        description: fish.description,
        success: false
      }
    }

    // Kalite hesabı
    const qualityOrder: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
    let quality: Quality = skillStore.rollCropQuality()

    // Usta denizci: en az seçkin kalite
    if (skillStore.getSkill('fishing').perk10 === 'mariner' && quality === 'normal') {
      quality = 'fine'
    }

    // Yüzük kalite etkisi
    const ringFishQualityBonus = inventoryStore.getRingEffectValue('fish_quality_bonus')
    if (ringFishQualityBonus > 0 && Math.random() < ringFishQualityBonus) {
      const idx = qualityOrder.indexOf(quality)
      const newIdx = Math.min(idx + 1, qualityOrder.length - 1)
      quality = qualityOrder[newIdx]!
    }

    // Kalite şamandırası
    if (activeTackleDef.value?.qualityBoost) {
      const idx = qualityOrder.indexOf(quality)
      const newIdx = Math.min(idx + activeTackleDef.value.qualityBoost, qualityOrder.length - 1)
      quality = qualityOrder[newIdx]!
    }

    // Mini oyun derecesi etkisi
    if (rating === 'perfect') {
      const idx = qualityOrder.indexOf(quality)
      const newIdx = Math.min(idx + 2, qualityOrder.length - 1)
      quality = qualityOrder[newIdx]!
    } else if (rating === 'excellent') {
      const idx = qualityOrder.indexOf(quality)
      const newIdx = Math.min(idx + 1, qualityOrder.length - 1)
      quality = qualityOrder[newIdx]!
    }

    // Dere çiftliği yağmurlu günde kalite +1
    if (gameStore.farmMapType === 'riverland' && gameStore.isRainy) {
      const idx = qualityOrder.indexOf(quality)
      if (idx < qualityOrder.length - 1) {
        quality = qualityOrder[idx + 1]!
      }
    }

    // Kutlu kudret: Long Ling’in su bereketi
    if (fishingLocation.value === 'waterfall' && useHiddenNpcStore().isAbilityActive('long_ling_1')) {
      const idx = qualityOrder.indexOf(quality)
      if (idx < qualityOrder.length - 1) {
        quality = qualityOrder[idx + 1]!
      }
    }

    // Yabani yem: çift balık ihtimali
    const luremasterCatchMult = skillStore.getSkill('fishing').perk10 === 'luremaster' ? 2 : 1
    const doubleCatchChance = (activeBaitDef.value?.doubleCatchChance ?? 0) * luremasterCatchMult
    const catchQty = doubleCatchChance > 0 && Math.random() < doubleCatchChance ? 2 : 1
    const caughtFish = {
      name: currentFish.value.name,
      id: currentFish.value.id,
      difficulty: currentFish.value.difficulty,
      sellPrice: currentFish.value.sellPrice,
      description: currentFish.value.description
    }

    const added = inventoryStore.addItem(currentFish.value.id, catchQty, quality)
    const achievementStore = useAchievementStore()
    achievementStore.discoverItem(currentFish.value.id)
    achievementStore.recordFishCaught()
    useQuestStore().onItemObtained(currentFish.value.id, catchQty)

    // Gizli not ihtimali
    if (Math.random() < 0.04) {
      useSecretNoteStore().tryCollectNote()
    }

    // Tecrübe
    const difficultyExpMult: Record<string, number> = { easy: 1, normal: 1.5, hard: 2, legendary: 3 }
    const expGain = currentFish.value.sellPrice * (difficultyExpMult[currentFish.value.difficulty] ?? 1)
    const riverlandBonus = gameStore.farmMapType === 'riverland' ? 1.25 : 1.0
    const perfectMult = rating === 'perfect' ? 2 : 1
    skillStore.addExp('fishing', Math.floor(expGain * riverlandBonus * perfectMult))

    const ratingTag = rating === 'perfect' ? ' [Kusursuz!]' : ''
    let message = ''
    if (!added) {
      message = `${currentFish.value.name} tuttun ama heybe doluydu; balık yitirildi!`
    } else {
      message =
        catchQty > 1
          ? `${catchQty} adet ${currentFish.value.name} başarıyla tutuldu!${ratingTag}`
          : `${currentFish.value.name} başarıyla tutuldu!${ratingTag}`
    }

    // Sandık hesabı
    const treasure = rollTreasureChest()
    if (treasure) {
      lastTreasure.value = treasure
      const treasureNames = treasure.items.map(t => `${t.name}×${t.quantity}`).join('、')
      if (treasure.money > 0) {
        message += ` Sandıktan: ${treasureNames}${treasureNames ? '、' : ''}${treasure.money} akçe çıktı!`
      } else {
        message += ` Sandıktan: ${treasureNames} çıktı!`
      }
    }

    lastPerfect.value = rating === 'perfect'
    endFishing()
    return {
      message,
      fishName: caughtFish.name,
      fishId: caughtFish.id,
      difficulty: caughtFish.difficulty,
      sellPrice: caughtFish.sellPrice,
      description: caughtFish.description,
      quality,
      quantity: catchQty,
      success: true
    }
  }

  /** Balıkçılık sandığı */
  const rollTreasureChest = (): { items: { itemId: string; name: string; quantity: number }[]; money: number } | null => {
    const cookingStore = useCookingStore()
    const luckBuff = cookingStore.activeBuff?.type === 'luck' ? 0.05 : 0
    const ringTreasureFind = inventoryStore.getRingEffectValue('treasure_find')
    const ringLuck = inventoryStore.getRingEffectValue('luck')
    const chance = 0.15 + skillStore.fishingLevel * 0.01 + luckBuff + ringTreasureFind + ringLuck * 0.3
    if (Math.random() >= chance) return null

    const numPrizes = Math.random() < 0.3 ? 2 : 1
    const items: { itemId: string; name: string; quantity: number }[] = []
    let money = 0

    for (let i = 0; i < numPrizes; i++) {
      const totalWeight = TREASURE_POOL.reduce((a, b) => a + b.weight, 0)
      let roll = Math.random() * totalWeight
      for (const prize of TREASURE_POOL) {
        roll -= prize.weight
        if (roll <= 0) {
          const qty = prize.minQty + Math.floor(Math.random() * (prize.maxQty - prize.minQty + 1))
          if (prize.itemId) {
            inventoryStore.addItem(prize.itemId, qty)
            const itemDef = getItemById(prize.itemId)
            items.push({ itemId: prize.itemId, name: itemDef?.name ?? prize.itemId, quantity: qty })
          } else {
            money += qty
            playerStore.earnMoney(qty)
          }
          break
        }
      }
    }

    return items.length > 0 || money > 0 ? { items, money } : null
  }

  const endFishing = () => {
    currentFish.value = null
    activeBaitDef.value = null
    activeTackleDef.value = null
  }

  // =========== Yengeç sepeti düzeni ===========

  /** Yengeç sepeti yerleştir */
  const placeCrabPot = (location: FishingLocation): { success: boolean; message: string } => {
    if (crabPots.value.length >= MAX_CRAB_POTS) {
      return { success: false, message: `Yengeç sepeti sınırı doldu (${MAX_CRAB_POTS}).` }
    }
    const atLocation = crabPots.value.filter(p => p.location === location).length
    if (atLocation >= MAX_CRAB_POTS_PER_LOCATION) {
      return { success: false, message: `Bu avlak için sepet sınırı doldu (${MAX_CRAB_POTS_PER_LOCATION}).` }
    }
    if (!inventoryStore.removeItem('crab_pot', 1)) {
      return { success: false, message: 'Heybende yengeç sepeti yok.' }
    }
    crabPots.value.push({ location, hasBait: false })
    return { success: true, message: 'Yengeç sepeti yerleştirildi.' }
  }

  /** Yengeç sepetini geri al */
  const removeCrabPot = (location: FishingLocation): { success: boolean; message: string } => {
    const idx = crabPots.value.findIndex(p => p.location === location)
    if (idx === -1) return { success: false, message: 'Bu avlakta sepet yok.' }
    crabPots.value.splice(idx, 1)
    inventoryStore.addItem('crab_pot', 1)
    return { success: true, message: 'Yengeç sepeti toplandı.' }
  }

  /** Sepetleri yemle */
  const baitCrabPots = (location: FishingLocation): { success: boolean; message: string } => {
    const pots = crabPots.value.filter(p => p.location === location && !p.hasBait)
    if (pots.length === 0) return { success: false, message: 'Bu avlaktaki bütün sepetler zaten yemli.' }
    let baited = 0
    for (const pot of pots) {
      if (inventoryStore.removeItem('standard_bait', 1)) {
        pot.hasBait = true
        baited++
      } else {
        break
      }
    }
    if (baited === 0) return { success: false, message: 'Yem kalmadı.' }
    return { success: true, message: `${baited} sepet yemlendi.` }
  }

  /** Avlağa göre sepet sayımı */
  const crabPotsByLocation = computed(() => {
    const map: Partial<Record<FishingLocation, { total: number; baited: number }>> = {}
    for (const pot of crabPots.value) {
      if (!map[pot.location]) map[pot.location] = { total: 0, baited: 0 }
      map[pot.location]!.total++
      if (pot.hasBait) map[pot.location]!.baited++
    }
    return map
  })

  /** Gün sonunda sepetleri topla */
  const collectCrabPots = (): { itemId: string; name: string }[] => {
    const isLuremaster = skillStore.getSkill('fishing').perk10 === 'luremaster'
    const isMariner = skillStore.getSkill('fishing').perk10 === 'mariner'
    const collected: { itemId: string; name: string }[] = []

    for (const pot of crabPots.value) {
      if (!pot.hasBait && !isLuremaster) continue

      let pool = CRAB_POT_LOOT.filter(l => !l.locationOverride || l.locationOverride === pot.location)

      const overrides = pool.filter(l => l.locationOverride === pot.location)
      if (overrides.length > 0) {
        const replaceIds = new Set(overrides.map(o => o.replaces).filter(Boolean))
        pool = pool.filter(l => !replaceIds.has(l.itemId) || l.locationOverride === pot.location)
      }

      // Usta denizci hurdaları ayıklar
      if (isMariner) {
        const junkSet = new Set(FISHING_JUNK)
        pool = pool.filter(l => !junkSet.has(l.itemId))
      }

      const totalWeight = pool.reduce((a, b) => a + b.weight, 0)
      let roll = Math.random() * totalWeight
      for (const loot of pool) {
        roll -= loot.weight
        if (roll <= 0) {
          inventoryStore.addItem(loot.itemId, 1)
          const itemDef = getItemById(loot.itemId)
          collected.push({ itemId: loot.itemId, name: itemDef?.name ?? loot.itemId })

          // Su ürünleri de balıkçılık tecrübesi sayılır
          if (itemDef) {
            skillStore.addExp('fishing', Math.floor(itemDef.sellPrice * 0.5))
          }
          const achievementStore = useAchievementStore()
          achievementStore.discoverItem(loot.itemId)
          break
        }
      }

      pot.hasBait = false
    }

    return collected
  }

  const serialize = () => {
    return {
      equippedBait: equippedBait.value,
      equippedTackle: equippedTackle.value,
      tackleDurability: tackleDurability.value,
      fishingLocation: fishingLocation.value,
      crabPots: crabPots.value
    }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    equippedBait.value = data.equippedBait ?? null
    equippedTackle.value = data.equippedTackle ?? null
    tackleDurability.value = data.tackleDurability ?? 0
    fishingLocation.value = data.fishingLocation ?? 'creek'
    crabPots.value = (data as any).crabPots ?? []
  }

  return {
    availableFish,
    fishingLocation,
    currentFish,
    lastTreasure,
    lastPerfect,
    equippedBait,
    equippedTackle,
    tackleDurability,
    crabPots,
    crabPotsByLocation,
    setLocation,
    equipBait,
    unequipBait,
    equipTackle,
    unequipTackle,
    startFishing,
    calculateMiniGameParams,
    completeFishing,
    endFishing,
    placeCrabPot,
    removeCrabPot,
    baitCrabPots,
    collectCrabPots,
    serialize,
    deserialize
  }
})
