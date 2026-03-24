import { ref } from 'vue'
import type { HeartEventDef, SkillType, SkillPerk5, SkillPerk10 } from '@/types'
import type { DiscoveryStep } from '@/types/hiddenNpc'
import type { SeasonEventDef } from '@/data/events'
import type { MorningChoiceEvent } from '@/data/farmEvents'
import { WEDDING_EVENT } from '@/data/heartEvents'
import { HIDDEN_NPCS } from '@/data/hiddenNpcs'
import { useGameStore } from '@/stores/useGameStore'
import { useNpcStore } from '@/stores/useNpcStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { addLog, showFloat, _registerPerkChecker } from './useGameLog'
import { useAudio } from './useAudio'

// Modül düzeyinde tekil durum
const currentEvent = ref<SeasonEventDef | null>(null)
const pendingHeartEvent = ref<HeartEventDef | null>(null)

type FestivalType =
  | 'fishing_contest'
  | 'harvest_fair'
  | 'dragon_boat'
  | 'lantern_riddle'
  | 'pot_throwing'
  | 'dumpling_making'
  | 'firework_show'
  | 'tea_contest'
  | 'kite_flying'

const currentFestival = ref<FestivalType | null>(null)
const pendingPerk = ref<{ skillType: SkillType; level: 5 | 10 } | null>(null)

/** Evcil dost edinme penceresi */
const pendingPetAdoption = ref(false)

/** Bir beceri yetenek eşiğine ulaştıysa ama seçim yapılmadıysa kontrol eder */
export const checkAllPerks = () => {
  const skillStore = useSkillStore()
  for (const skill of skillStore.skills) {
    if (skill.level >= 5 && !skill.perk5) {
      pendingPerk.value = { skillType: skill.type, level: 5 }
      return
    }
    if (skill.level >= 10 && !skill.perk10) {
      pendingPerk.value = { skillType: skill.type, level: 10 }
      return
    }
  }
}

// useGameLog içine checkAllPerks kaydı yapılır; böylece addLog çağrısı yetenek kontrolünü tetikleyebilir
_registerPerkChecker(checkAllPerks)

/** Yetenek seçimi konuşmasını işler */
export const handlePerkSelect = (perk: SkillPerk5 | SkillPerk10) => {
  if (!pendingPerk.value) return
  const skillStore = useSkillStore()
  const { skillType, level } = pendingPerk.value

  if (level === 5) {
    skillStore.setPerk5(skillType, perk as SkillPerk5)
  } else {
    skillStore.setPerk10(skillType, perk as SkillPerk10)
  }

  addLog('Yeni bir ustalık yolu öğrendin!')
  pendingPerk.value = null
}

/** Gizli ruhani kişi mi kontrol eder */
const isHiddenNpcId = (npcId: string): boolean => HIDDEN_NPCS.some(n => n.id === npcId)

/** Gönül olayı tetikler (NpcView / HiddenNpcModal tarafından çağrılır) */
export const triggerHeartEvent = (event: HeartEventDef) => {
  if (isHiddenNpcId(event.npcId)) {
    const hiddenNpcStore = useHiddenNpcStore()
    hiddenNpcStore.markHeartEventTriggered(event.npcId, event.id)
  } else {
    const npcStore = useNpcStore()
    npcStore.markHeartEventTriggered(event.npcId, event.id)
  }
  pendingHeartEvent.value = event
}

/** Gönül olayı penceresini kapatır ve yakınlık değişimini uygular */
export const closeHeartEvent = (changes: { npcId: string; amount: number }[]) => {
  for (const change of changes) {
    if (isHiddenNpcId(change.npcId)) {
      const hiddenNpcStore = useHiddenNpcStore()
      hiddenNpcStore.addAffinity(change.npcId, change.amount)
    } else {
      const npcStore = useNpcStore()
      npcStore.adjustFriendship(change.npcId, change.amount)
    }

    if (change.amount > 0) {
      addLog(`Gönül bağı +${change.amount}`)
    } else if (change.amount < 0) {
      addLog(`Gönül bağı ${change.amount}`)
    }
  }

  pendingHeartEvent.value = null
}

/** Düğün olayını tetikler (useEndDay tarafından çağrılır) */
export const triggerWeddingEvent = (npcId: string) => {
  const event: HeartEventDef = { ...WEDDING_EVENT, npcId }
  pendingHeartEvent.value = event
}

/** Mevsim olay penceresini gösterir */
export const showEvent = (event: SeasonEventDef) => {
  currentEvent.value = event
}

/** Mevsim olay penceresini kapatır */
export const closeEvent = () => {
  currentEvent.value = null
  const { endFestivalBgm } = useAudio()
  endFestivalBgm()
}

/** Bayram şenliği ekranını açar ve mini oyun ezgisini başlatır */
export const showFestival = (type: FestivalType) => {
  currentFestival.value = type
  const { startMinigameBgm } = useAudio()
  startMinigameBgm(type)
}

/** Bayram şenliğini kapatır ve ödülü verir */
export const closeFestival = (prize: number) => {
  if (prize > 0) {
    const playerStore = usePlayerStore()
    playerStore.earnMoney(prize)
    showFloat(`+${prize} akçe`, 'accent')
    addLog(`Şenlik ödülü: ${prize} akçe!`)
  }

  currentFestival.value = null

  // Hâlâ olay anlatısı açıksa mevsim şenliği ezgisine dön, yoksa normal mevsim ezgisine geç
  if (currentEvent.value) {
    const { startFestivalBgm } = useAudio()
    const gameStore = useGameStore()
    startFestivalBgm(gameStore.season)
  } else {
    const { endFestivalBgm } = useAudio()
    endFestivalBgm()
  }
}

/** Evcil dost edinme penceresini tetikler */
export const triggerPetAdoption = () => {
  pendingPetAdoption.value = true
}

/** Evcil dost edinme penceresini kapatır */
export const closePetAdoption = () => {
  pendingPetAdoption.value = false
}

/** Çocuk teklifi penceresi */
const childProposalVisible = ref(false)

/** Çocuk teklifi penceresini açar */
export const showChildProposal = () => {
  childProposalVisible.value = true
}

/** Çocuk teklifi penceresini kapatır */
export const closeChildProposal = () => {
  childProposalVisible.value = false
}

/** Sabah seçim olayı penceresi */
const pendingFarmEvent = ref<MorningChoiceEvent | null>(null)

/** Sabah seçim olayını gösterir */
export const showFarmEvent = (event: MorningChoiceEvent) => {
  pendingFarmEvent.value = event
}

/** Sabah seçim olayını kapatır */
export const closeFarmEvent = () => {
  pendingFarmEvent.value = null
}

/** Ruhani varlık keşif sahnesi sırası */
const pendingDiscoveryScenes = ref<{ npcId: string; step: DiscoveryStep }[]>([])

/** Şu anda gösterilen keşif sahnesi */
const pendingDiscoveryScene = ref<{ npcId: string; step: DiscoveryStep } | null>(null)

/** Ruhani keşif sahnesini sıraya ekler */
export const showDiscoveryScene = (npcId: string, step: DiscoveryStep) => {
  pendingDiscoveryScenes.value.push({ npcId, step })
  if (!pendingDiscoveryScene.value) {
    pendingDiscoveryScene.value = pendingDiscoveryScenes.value.shift() ?? null
  }
}

/** Geçerli keşif sahnesini kapatır, sıradakini açar */
export const closeDiscoveryScene = () => {
  pendingDiscoveryScene.value = pendingDiscoveryScenes.value.shift() ?? null
}

export const useDialogs = () => {
  return {
    currentEvent,
    pendingHeartEvent,
    currentFestival,
    pendingPerk,
    pendingPetAdoption,
    childProposalVisible,
    checkAllPerks,
    handlePerkSelect,
    triggerHeartEvent,
    triggerWeddingEvent,
    closeHeartEvent,
    showEvent,
    closeEvent,
    showFestival,
    closeFestival,
    triggerPetAdoption,
    closePetAdoption,
    showChildProposal,
    closeChildProposal,
    pendingFarmEvent,
    showFarmEvent,
    closeFarmEvent,
    pendingDiscoveryScene,
    showDiscoveryScene,
    closeDiscoveryScene
  }
  }
