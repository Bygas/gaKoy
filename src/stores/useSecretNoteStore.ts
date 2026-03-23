import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SECRET_NOTES } from '@/data/secretNotes'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { addLog } from '@/composables/useGameLog'

export const useSecretNoteStore = defineStore('secretNote', () => {
  /** Toplanan notların ID listesi */
  const collectedNotes = ref<number[]>([])
  /** Kullanılmış notların ID listesi (hazine türü) */
  const usedNotes = ref<number[]>([])

  const totalNotes = computed(() => SECRET_NOTES.length)
  const collectedCount = computed(() => collectedNotes.value.length)

  /** Bir not toplanmış mı */
  const isCollected = (noteId: number): boolean => {
    return collectedNotes.value.includes(noteId)
  }

  /** Bir not kullanılmış mı */
  const isUsed = (noteId: number): boolean => {
    return usedNotes.value.includes(noteId)
  }

  /** Hâlâ toplanmamış not var mı */
  const hasUncollectedNotes = computed(() => {
    return collectedNotes.value.length < SECRET_NOTES.length
  })

  /** Rastgele bir not toplamayı dener, not ID'sini döndürür; yoksa null */
  const tryCollectNote = (): number | null => {
    if (!hasUncollectedNotes.value) return null
    const uncollected = SECRET_NOTES.filter(n => !collectedNotes.value.includes(n.id))
    if (uncollected.length === 0) return null
    const note = uncollected[Math.floor(Math.random() * uncollected.length)]!
    collectedNotes.value.push(note.id)
    addLog(`Gizli not bulundu #${note.id}: ${note.title}`)
    return note.id
  }

  /** Hazine notunu kullan (ödülü al) */
  const useNote = (noteId: number): { success: boolean; message: string } => {
    if (!isCollected(noteId)) return { success: false, message: 'Bu not henüz elde edilmedi.' }
    if (isUsed(noteId)) return { success: false, message: 'Bu not zaten kullanıldı.' }

    const noteDef = SECRET_NOTES.find(n => n.id === noteId)
    if (!noteDef || !noteDef.usable) return { success: false, message: 'Bu not kullanılamaz.' }

    usedNotes.value.push(noteId)

    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()

    const rewards: string[] = []
    if (noteDef.reward?.money) {
      playerStore.earnMoney(noteDef.reward.money)
      rewards.push(`${noteDef.reward.money} akçe`)
    }
    if (noteDef.reward?.items) {
      for (const item of noteDef.reward.items) {
        inventoryStore.addItem(item.itemId, item.quantity)
        rewards.push(`${item.itemId}×${item.quantity}`)
      }
    }

    const rewardText = rewards.join('、')
    addLog(`Gizli not #${noteId} kullanıldı, kazanılanlar: ${rewardText}!`)
    return { success: true, message: `${rewardText} kazanıldı!` }
  }

  const serialize = () => ({
    collectedNotes: collectedNotes.value,
    usedNotes: usedNotes.value
  })

  const deserialize = (data: any) => {
    collectedNotes.value = data.collectedNotes ?? []
    usedNotes.value = data.usedNotes ?? []
  }

  return {
    collectedNotes,
    usedNotes,
    totalNotes,
    collectedCount,
    isCollected,
    isUsed,
    hasUncollectedNotes,
    tryCollectNote,
    useNote,
    serialize,
    deserialize
  }
})
