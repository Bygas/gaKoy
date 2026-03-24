
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { HIDDEN_NPCS, getHiddenNpcById } from '@/data/hiddenNpcs'
import { getHiddenNpcHeartEvents } from '@/data/hiddenNpcHeartEvents'
import { useGameStore } from './useGameStore'
import { useSkillStore } from './useSkillStore'
import { useAchievementStore } from './useAchievementStore'
import { useNpcStore } from './useNpcStore'
import { useQuestStore } from './useQuestStore'
import { useInventoryStore } from './useInventoryStore'
import { usePlayerStore } from './usePlayerStore'
import router from '@/router'
import type { HiddenNpcState, DiscoveryCondition, DiscoveryStep, AffinityLevel, BondBonusType } from '@/types/hiddenNpc'
import type { Quality, HeartEventDef } from '@/types'
import { AFFINITY_THRESHOLDS, MAX_AFFINITY, AFFINITY_DECAY_BONDED, AFFINITY_DECAY_COURTING, MAX_OFFERS_PER_WEEK } from '@/types/hiddenNpc'

/** Sununun temel bağ değeri */
const OFFERING_RESONANT = 100
const OFFERING_PLEASED = 50
const OFFERING_NEUTRAL = 10
const OFFERING_REPELLED = -40

/** Kalite katsayısı */
const QUALITY_MULTIPLIER: Record<Quality, number> = {
  normal: 1,
  fine: 1.25,
  excellent: 1.5,
  supreme: 2
}

/** Beliriş gününde sunu katsayısı */
const MANIFESTATION_BONUS = 3

const defaultState = (npcId: string): HiddenNpcState => ({
  npcId,
  discoveryPhase: 'unknown',
  completedSteps: [],
  affinity: 0,
  interactedToday: false,
  offeredToday: false,
  offersThisWeek: 0,
  specialInteractionCooldown: 0,
  courting: false,
  bonded: false,
  triggeredHeartEvents: [],
  unlockedAbilities: []
})

export const useHiddenNpcStore = defineStore('hiddenNpc', () => {
  const hiddenNpcStates = ref<HiddenNpcState[]>(HIDDEN_NPCS.map(n => defaultState(n.id)))

  // ==================== Temel sorgular ====================

  const getHiddenNpcState = (npcId: string): HiddenNpcState | undefined => hiddenNpcStates.value.find(s => s.npcId === npcId)

  const getAffinityLevel = (npcId: string): AffinityLevel => {
    const state = getHiddenNpcState(npcId)
    if (!state) return 'wary'
    for (const t of AFFINITY_THRESHOLDS) {
      if (state.affinity >= t.min) return t.level
    }
    return 'wary'
  }

  const getRevealedNpcs = computed(() =>
    HIDDEN_NPCS.filter(n => {
      const s = getHiddenNpcState(n.id)
      return s && s.discoveryPhase === 'revealed'
    })
  )

  const getRumorNpcs = computed(() =>
    HIDDEN_NPCS.filter(n => {
      const s = getHiddenNpcState(n.id)
      return s && (s.discoveryPhase === 'rumor' || s.discoveryPhase === 'glimpse')
    })
  )

  const getBondedNpc = computed(() => {
    const state = hiddenNpcStates.value.find(s => s.bonded)
    return state ? getHiddenNpcById(state.npcId) : undefined
  })

  /** Beliriş günü mü */
  const isManifestationDay = (npcId: string): boolean => {
    const def = getHiddenNpcById(npcId)
    if (!def) return false
    const gameStore = useGameStore()
    return gameStore.season === def.manifestationDay.season && gameStore.day === def.manifestationDay.day
  }

  // ==================== Keşif düzeni ====================

  /** Tek bir keşif şartını değerlendir */
  const evaluateCondition = (cond: DiscoveryCondition): boolean => {
    const gameStore = useGameStore()
    const skillStore = useSkillStore()
    const achievementStore = useAchievementStore()
    const npcStore = useNpcStore()
    const questStore = useQuestStore()
    const inventoryStore = useInventoryStore()
    const playerStore = usePlayerStore()

    switch (cond.type) {
      case 'season':
        return gameStore.season === cond.season
      case 'weather':
        return gameStore.weather === cond.weather
      case 'timeRange':
        return gameStore.hour >= cond.minHour && gameStore.hour <= cond.maxHour
      case 'location': {
        const routeName = router.currentRoute.value.name
        return routeName === cond.panel
      }
      case 'item':
        return inventoryStore.getItemCount(cond.itemId) >= (cond.quantity ?? 1)
      case 'skill':
        return skillStore.getSkill(cond.skillType as any).level >= cond.minLevel
      case 'npcFriendship': {
        const npcState = npcStore.getNpcState(cond.npcId)
        return npcState ? npcState.friendship >= cond.minFriendship : false
      }
      case 'questComplete':
        return questStore.completedMainQuests.includes(cond.questId)
      case 'mineFloor':
        return achievementStore.stats.highestMineFloor >= cond.minFloor
      case 'fishCaught':
        return achievementStore.discoveredItems.includes(cond.fishId)
      case 'money':
        return playerStore.money >= cond.minAmount
      case 'yearMin':
        return gameStore.year >= cond.year
      case 'day':
        return gameStore.day === cond.day
      default:
        return false
    }
  }

  /** Tüm gizli varlıkların keşif ilerleyişini denetle */
  const checkDiscoveryConditions = (): { npcId: string; step: DiscoveryStep }[] => {
    const triggered: { npcId: string; step: DiscoveryStep }[] = []

    for (const npc of HIDDEN_NPCS) {
      const state = getHiddenNpcState(npc.id)
      if (!state || state.discoveryPhase === 'revealed') continue

      for (const step of npc.discoverySteps) {
        if (state.completedSteps.includes(step.id)) continue

        const allMet = step.conditions.every(evaluateCondition)
        if (allMet) {
          state.completedSteps.push(step.id)
          state.discoveryPhase = step.phase
          triggered.push({ npcId: npc.id, step })
        }
        break
      }
    }

    return triggered
  }

  // ==================== Etkileşim düzeni ====================

  /** Bağ ekle ya da eksilt */
  const addAffinity = (npcId: string, amount: number) => {
    const state = getHiddenNpcState(npcId)
    if (!state) return
    state.affinity = Math.max(0, Math.min(MAX_AFFINITY, state.affinity + amount))
  }

  /** Sunu yap */
  const performOffering = (
    npcId: string,
    itemId: string,
    quality: Quality
  ): { success: boolean; message: string; affinityChange: number } => {
    const state = getHiddenNpcState(npcId)
    const def = getHiddenNpcById(npcId)
    if (!state || !def) return { success: false, message: 'Bu kutlu varlık bulunamadı.', affinityChange: 0 }
    if (state.discoveryPhase !== 'revealed') return { success: false, message: 'Bu kutlu varlıkla henüz bağ kurulmadı.', affinityChange: 0 }
    if (state.offeredToday) return { success: false, message: 'Bugün zaten sunu verildi.', affinityChange: 0 }
    if (state.offersThisWeek >= MAX_OFFERS_PER_WEEK) return { success: false, message: 'Bu haftaki sunu hakkı doldu.', affinityChange: 0 }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(itemId, 1, quality)) {
      return { success: false, message: 'Heybende bu nesne yok.', affinityChange: 0 }
    }

    let base = OFFERING_NEUTRAL
    if (def.resonantOfferings.includes(itemId)) base = OFFERING_RESONANT
    else if (def.pleasedOfferings.includes(itemId)) base = OFFERING_PLEASED
    else if (def.repelledOfferings.includes(itemId)) base = OFFERING_REPELLED

    let multiplier = QUALITY_MULTIPLIER[quality]
    if (isManifestationDay(npcId)) multiplier *= MANIFESTATION_BONUS

    const change = Math.round(base * multiplier)
    addAffinity(npcId, change)
    state.offeredToday = true
    state.offersThisWeek++

    let reaction = '……'
    if (base === OFFERING_RESONANT) reaction = `${def.name}, gönül telinin titreştiğini duydu.`
    else if (base === OFFERING_PLEASED) reaction = `${def.name}, sununu uygun buldu.`
    else if (base === OFFERING_REPELLED) reaction = `${def.name}, kaşlarını çattı.`
    else reaction = `${def.name}, sununu kabul etti.`

    return { success: true, message: reaction, affinityChange: change }
  }

  /** Özel etkileşimi gerçekleştir */
  const performSpecialInteraction = (npcId: string): { success: boolean; message: string; affinityChange: number } => {
    const state = getHiddenNpcState(npcId)
    const def = getHiddenNpcById(npcId)
    if (!state || !def) return { success: false, message: 'Bu kutlu varlık bulunamadı.', affinityChange: 0 }
    if (state.discoveryPhase !== 'revealed') return { success: false, message: 'Bu kutlu varlıkla henüz bağ kurulmadı.', affinityChange: 0 }
    if (state.interactedToday) return { success: false, message: 'Bugün zaten bir etkileşim yaşandı.', affinityChange: 0 }
    if (state.specialInteractionCooldown > 0)
      return { success: false, message: `Bunun için daha ${state.specialInteractionCooldown} gün beklemek gerekir.`, affinityChange: 0 }

    const skillStore = useSkillStore()
    let affinityGain = 30
    let message = ''

    switch (def.interactionType) {
      case 'meditation': {
        const totalLevels =
          skillStore.getSkill('farming').level +
          skillStore.getSkill('foraging').level +
          skillStore.getSkill('fishing').level +
          skillStore.getSkill('mining').level
        affinityGain = totalLevels * 3
        message = `Sen ve ${def.name}, su kıyısında sessizce oturup tefekküre daldınız.`
        break
      }
      case 'music': {
        affinityGain = 30 + Math.floor(Math.random() * 21)
        message = `Sen ve ${def.name}, birlikte eski bir ezgi çaldınız.`
        break
      }
      case 'ritual': {
        affinityGain = 40
        message = `Sen ve ${def.name}, kutsal bir erkânı tamamladınız.`
        break
      }
      case 'dreamwalk': {
        affinityGain = 35
        message = `Sen ve ${def.name}, bir düş yolunda birlikte yürüdünüz.`
        break
      }
      case 'cultivation': {
        const successRate = skillStore.getSkill('mining').level * 5 + skillStore.getSkill('foraging').level * 5
        if (Math.random() * 100 < successRate) {
          affinityGain = 40
          message = `Ruh arınışı başarıyla tamamlandı! Sen ve ${def.name}, yer ile göğün soluğunu birlikte hissettiniz.`
          const playerStore = usePlayerStore()
          playerStore.restoreStamina(10)
        } else {
          affinityGain = 10
          message = `Ruh arınışı tam kemale ermedi; ama ${def.name}, gayretini görüp başıyla onay verdi.`
        }
        break
      }
    }

    addAffinity(npcId, affinityGain)
    state.interactedToday = true
    state.specialInteractionCooldown = 1

    return { success: true, message, affinityChange: affinityGain }
  }

  // ==================== Gönül isteme ve bağ kurma ====================

  const startCourting = (npcId: string): { success: boolean; message: string } => {
    const state = getHiddenNpcState(npcId)
    const def = getHiddenNpcById(npcId)
    if (!state || !def) return { success: false, message: 'Bu kutlu varlık bulunamadı.' }
    if (!def.bondable) return { success: false, message: 'Bu kutlu varlıkla yazgı bağı kurulamaz.' }
    if (state.courting) return { success: false, message: 'Gönül isteme hâli zaten sürüyor.' }
    if (state.bonded) return { success: false, message: 'Bağ zaten kurulmuş.' }
    if (state.affinity < def.courtshipThreshold) return { success: false, message: `Bağ gücü yetmiyor (gereken: ${def.courtshipThreshold}).` }

    const existingBond = hiddenNpcStates.value.find(s => s.bonded || s.courting)
    if (existingBond && existingBond.npcId !== npcId) {
      return { success: false, message: 'Başka bir kutlu varlıkla bağ sürmektedir.' }
    }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(def.courtshipItemId, 1)) {
      return { success: false, message: `Bunun için “${def.courtshipItemId}” gerekir.` }
    }

    state.courting = true
    return { success: true, message: `${def.name}, gönül isteğini kabul etti.` }
  }

  const formBond = (npcId: string): { success: boolean; message: string } => {
    const state = getHiddenNpcState(npcId)
    const def = getHiddenNpcById(npcId)
    if (!state || !def) return { success: false, message: 'Bu kutlu varlık bulunamadı.' }
    if (!state.courting) return { success: false, message: 'Evvela gönül isteğinde bulunmalısın.' }
    if (state.bonded) return { success: false, message: 'Bağ zaten kurulmuş.' }
    if (state.affinity < def.bondThreshold) return { success: false, message: `Bağ gücü yetmiyor (gereken: ${def.bondThreshold}).` }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(def.bondItemId, 1)) {
      return { success: false, message: `Bunun için “${def.bondItemId}” gerekir.` }
    }

    state.bonded = true
    return { success: true, message: `Sen ve ${def.name}, sonsuz bir yazgı bağı kurdunuz.` }
  }

  const dissolveBond = (npcId: string): { success: boolean; message: string } => {
    const state = getHiddenNpcState(npcId)
    const def = getHiddenNpcById(npcId)
    if (!state || !def) return { success: false, message: 'Bu kutlu varlık bulunamadı.' }
    if (!state.bonded && !state.courting) return { success: false, message: 'Çözülecek bir bağ yok.' }

    const playerStore = usePlayerStore()
    if (playerStore.money < 10000) return { success: false, message: 'Bunun için 10000 akçe gerekir.' }
    playerStore.spendMoney(10000)

    state.bonded = false
    state.courting = false
    state.affinity = Math.min(state.affinity, 1000)
    return { success: true, message: `${def.name} ile arandaki bağ çözüldü.` }
  }

  // ==================== Kalp olayları ====================

  const checkHeartEvent = (npcId: string): HeartEventDef | null => {
    const state = getHiddenNpcState(npcId)
    const def = getHiddenNpcById(npcId)
    if (!state || !def || state.discoveryPhase !== 'revealed') return null

    const events = getHiddenNpcHeartEvents(npcId)
    for (const event of events) {
      if (state.affinity >= event.requiredFriendship && !state.triggeredHeartEvents.includes(event.id)) {
        return event
      }
    }
    return null
  }

  /** Kalp olayını işlendi diye işaretle */
  const markHeartEventTriggered = (npcId: string, eventId: string) => {
    const state = getHiddenNpcState(npcId)
    if (state && !state.triggeredHeartEvents.includes(eventId)) {
      state.triggeredHeartEvents.push(eventId)
    }
  }

  // ==================== Kudret düzeni ====================

  const checkAbilityUnlocks = (): { id: string; npcId: string; name: string; description: string }[] => {
    const newlyUnlocked: { id: string; npcId: string; name: string; description: string }[] = []

    for (const npc of HIDDEN_NPCS) {
      const state = getHiddenNpcState(npc.id)
      if (!state || state.discoveryPhase !== 'revealed') continue

      for (const ability of npc.abilities) {
        if (state.affinity >= ability.affinityRequired && !state.unlockedAbilities.includes(ability.id)) {
          state.unlockedAbilities.push(ability.id)
          newlyUnlocked.push({ id: ability.id, npcId: npc.id, name: ability.name, description: ability.description })
        }
      }
    }

    return newlyUnlocked
  }

  /** Belirli bir kudret etkin mi */
  const isAbilityActive = (abilityId: string): boolean => {
    return getActiveAbilities.value.some(a => a.id === abilityId)
  }

  /** Belirli bir kudretin pasif değeri */
  const getAbilityValue = (abilityId: string): number => {
    const ability = getActiveAbilities.value.find(a => a.id === abilityId)
    return ability?.passive.value ?? 0
  }

  /** Mevcut yazgı bağının ödül türü */
  const getBondBonusType = (): string | null => {
    const bondedState = hiddenNpcStates.value.find(s => s.bonded)
    if (!bondedState) return null
    const def = getHiddenNpcById(bondedState.npcId)
    return def?.bondBonuses[0]?.type ?? null
  }

  /** Türe göre bağ ödülü ara */
  const getBondBonusByType = (type: string): BondBonusType | null => {
    for (const state of hiddenNpcStates.value) {
      if (!state.bonded) continue
      const def = getHiddenNpcById(state.npcId)
      if (!def) continue
      const found = def.bondBonuses.find(b => b.type === type)
      if (found) return found
    }
    return null
  }

  /** Mevcut bağ ödülünü getir (ilkini döndürür) */
  const getBondBonus = (): BondBonusType | null => {
    const bondedState = hiddenNpcStates.value.find(s => s.bonded)
    if (!bondedState) return null
    const def = getHiddenNpcById(bondedState.npcId)
    return def?.bondBonuses[0] ?? null
  }

  /** Şu an etkin tüm pasif kudretleri getir */
  const getActiveAbilities = computed(() => {
    const abilities: {
      npcId: string
      id: string
      name: string
      passive: NonNullable<(typeof HIDDEN_NPCS)[0]['abilities'][0]['passive']>
    }[] = []

    for (const npc of HIDDEN_NPCS) {
      const state = getHiddenNpcState(npc.id)
      if (!state || state.discoveryPhase !== 'revealed') continue

      for (const ability of npc.abilities) {
        if (state.unlockedAbilities.includes(ability.id) && ability.passive) {
          abilities.push({ npcId: npc.id, id: ability.id, name: ability.name, passive: ability.passive })
        }
      }
    }

    return abilities
  })

  // ==================== Günlük işlemler ====================

  /** Yazgı bağının günlük ödüllerini işle */
  const dailyBondBonus = (): { messages: string[] } => {
    const messages: string[] = []
    const bondedState = hiddenNpcStates.value.find(s => s.bonded)
    if (!bondedState) return { messages }

    const def = getHiddenNpcById(bondedState.npcId)
    if (!def) return { messages }

    const bonus = def.bondBonuses
    for (const b of bonus) {
      switch (b.type) {
        case 'weather_control': {
          if (Math.random() < b.chance) {
            const gameStore = useGameStore()
            gameStore.setTomorrowWeather('sunny')
            messages.push(`${def.name} göğün perdesini araladı; yarın hava açık olacak.`)
          }
          break
        }
        case 'crop_blessing': {
          if (Math.random() < b.chance) {
            messages.push(`${def.name}’in bereketi gaKöy tarlalarına indi.`)
          }
          break
        }
        case 'animal_blessing': {
          break
        }
        case 'stamina_restore': {
          const playerStore = usePlayerStore()
          playerStore.restoreStamina(b.amount)
          messages.push(`${def.name}, sana ${b.amount} takat bağışladı.`)
          break
        }
        case 'spirit_shield': {
          messages.push(`${def.name}’in ruh kalkanı çevrende dolaşıyor.`)
          break
        }
        case 'sell_bonus': {
          break
        }
        case 'fish_attraction': {
          if (Math.random() < b.chance) {
            messages.push(`${def.name}, sulara kutsal balık kokusu saldı.`)
          }
          break
        }
      }
    }

    return { messages }
  }

  /** Günlük sıfırlama */
  const dailyReset = () => {
    const gameStore = useGameStore()

    for (const state of hiddenNpcStates.value) {
      if (state.discoveryPhase !== 'revealed') continue

      if (!state.interactedToday && !state.offeredToday) {
        if (state.bonded) {
          state.affinity = Math.max(0, state.affinity - AFFINITY_DECAY_BONDED)
        } else if (state.courting) {
          state.affinity = Math.max(0, state.affinity - AFFINITY_DECAY_COURTING)
        }
      }

      state.interactedToday = false
      state.offeredToday = false

      if (state.specialInteractionCooldown > 0) {
        state.specialInteractionCooldown--
      }

      if (gameStore.day % 7 === 0) {
        state.offersThisWeek = 0
      }
    }
  }

  // ==================== Kayda geçirme ====================

  const serialize = () => ({
    hiddenNpcStates: hiddenNpcStates.value
  })

  const deserialize = (data: ReturnType<typeof serialize>) => {
    const savedStates = (data.hiddenNpcStates ?? []).map((s: any) => ({
      ...defaultState(s.npcId),
      ...s
    }))
    const savedIds = new Set(savedStates.map((s: HiddenNpcState) => s.npcId))
    const newStates = HIDDEN_NPCS.filter(n => !savedIds.has(n.id)).map(n => defaultState(n.id))
    hiddenNpcStates.value = [...savedStates, ...newStates]
  }

  return {
    hiddenNpcStates,
    getHiddenNpcState,
    getAffinityLevel,
    getRevealedNpcs,
    getRumorNpcs,
    getBondedNpc,
    isManifestationDay,
    evaluateCondition,
    checkDiscoveryConditions,
    addAffinity,
    performOffering,
    performSpecialInteraction,
    startCourting,
    formBond,
    dissolveBond,
    checkHeartEvent,
    markHeartEventTriggered,
    checkAbilityUnlocks,
    getActiveAbilities,
    isAbilityActive,
    getAbilityValue,
    getBondBonusType,
    getBondBonus,
    getBondBonusByType,
    dailyBondBonus,
    dailyReset,
    serialize,
    deserialize
  }
})
