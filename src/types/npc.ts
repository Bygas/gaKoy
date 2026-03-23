import type { Season, Gender } from './game'

/** Gönül bağı düzeyi */
export type FriendshipLevel = 'stranger' | 'acquaintance' | 'friendly' | 'bestFriend'

/** NPC tanımı */
export interface NpcDef {
  id: string
  name: string
  /** Cinsiyet */
  gender: Gender
  role: string
  personality: string
  lovedItems: string[]
  likedItems: string[]
  hatedItems: string[]
  dialogues: Record<FriendshipLevel, string[]>
  /** Evlenebilir mi */
  marriageable?: boolean
  /** Bağlı gönül olayı kimlikleri */
  heartEventIds?: string[]
  /** Görüşme dönemi özel konuşmaları */
  datingDialogues?: string[]
  /** Can yoldaşı özel konuşmaları */
  zhijiDialogues?: string[]
  /** Can yoldaşı gönül olayı kimlikleri */
  zhijiHeartEventIds?: string[]
  /** Doğum günü (mevsim + gün) */
  birthday?: { season: Season; day: number }
}

/** NPC durumu (çalışma anı) */
export interface NpcState {
  npcId: string
  friendship: number
  talkedToday: boolean
  giftedToday: boolean
  /** Bu hafta hediye verme sayısı (üst sınır 2) */
  giftsThisWeek: number
  /** Şu anda görüşmede mi */
  dating: boolean
  /** Evli mi */
  married: boolean
  /** Can yoldaşı oldu mu */
  zhiji: boolean
  /** Tetiklenen gönül olayı kimlikleri */
  triggeredHeartEvents: string[]
}

/** Gönül olayı sahnesi */
export interface HeartEventScene {
  text: string
  /** Bu sahnede seçimler varsa sunulur, yoksa bir sonraki sahneye kendiliğinden geçer */
  choices?: {
    text: string
    friendshipChange: number
    response: string
  }[]
}

/** Gönül olayı tanımı */
export interface HeartEventDef {
  id: string
  npcId: string
  /** Tetiklenmek için gereken en düşük gönül puanı */
  requiredFriendship: number
  /** Tetiklenmek için can yoldaşı bağı gerekir mi */
  requiresZhiji?: boolean
  title: string
  scenes: HeartEventScene[]
}

/** Evlat büyüme evresi */
export type ChildStage = 'baby' | 'toddler' | 'child' | 'teen'

/** Evlat durumu */
export interface ChildState {
  id: number
  name: string
  daysOld: number
  stage: ChildStage
  friendship: number
  interactedToday: boolean
  /** Doğum niteliği */
  birthQuality: 'normal' | 'premature' | 'healthy'
}

/** Gebelik evresi */
export type PregnancyStage = 'early' | 'mid' | 'late' | 'ready'

/** Teklife yanıt */
export type ProposalResponse = 'accept' | 'decline' | 'wait'

/** Yardımcı görev türü */
export type FarmHelperTask = 'water' | 'feed' | 'harvest' | 'weed'

/** Yardımcı durumu */
export interface HiredHelper {
  npcId: string
  task: FarmHelperTask
  dailyWage: number
}

/** Gebelik durumu */
export interface PregnancyState {
  stage: PregnancyStage
  daysInStage: number
  stageDays: number
  /** Sağ doğum puanı 0-100 */
  careScore: number
  caredToday: boolean
  giftedForPregnancy: boolean
  companionToday: boolean
  medicalPlan: 'normal' | 'advanced' | 'luxury' | null
}
