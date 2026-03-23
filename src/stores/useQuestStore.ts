import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { QuestInstance, Season, MainQuestState, MainQuestObjective } from '@/types'
import { generateQuest, generateSpecialOrder as _generateSpecialOrder } from '@/data/quests'
import { getStoryQuestById, getNextStoryQuest, getFirstStoryQuest, STORY_QUESTS } from '@/data/storyQuests'
import { getNpcById } from '@/data/npcs'
import { useInventoryStore } from './useInventoryStore'
import { usePlayerStore } from './usePlayerStore'
import { useNpcStore } from './useNpcStore'
import { useAchievementStore } from './useAchievementStore'
import { useSkillStore } from './useSkillStore'
import { useShopStore } from './useShopStore'
import { useAnimalStore } from './useAnimalStore'

export const useQuestStore = defineStore('quest', () => {
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const npcStore = useNpcStore()
  const achievementStore = useAchievementStore()

  /** Duyuru tahtasındaki alınabilir görevler */
  const boardQuests = ref<QuestInstance[]>([])

  /** Kabul edilmiş, sürmekte olan görevler */
  const activeQuests = ref<QuestInstance[]>([])

  /** Toplam tamamlanan görev sayısı */
  const completedQuestCount = ref<number>(0)

  /** Şu anda alınabilir özel buyruğu */
  const specialOrder = ref<QuestInstance | null>(null)

  /** Aynı anda alınabilecek azami görev sayısı */
  const MAX_ACTIVE_QUESTS = 3

  /** Her gün duyuru tahtasına yeni görevler oluştur */
  const generateDailyQuests = (season: Season, day: number) => {
    boardQuests.value = [] // Eski duyuru tahtasını temizle
    const count = 1 + Math.floor(Math.random() * 2) // 1-2 görev
    for (let i = 0; i < count; i++) {
      const quest = generateQuest(season, day)
      if (quest) {
        boardQuests.value.push(quest)
      }
    }
  }

  /** Kademeye göre özel buyruk oluştur (tier: 1-4 = 7/14/21/28. gün) */
  const generateSpecialOrder = (season: Season, tier: number) => {
    const order = _generateSpecialOrder(season, tier)
    specialOrder.value = order
  }

  /** Görev al */
  const acceptQuest = (questId: string): { success: boolean; message: string } => {
    if (activeQuests.value.length >= MAX_ACTIVE_QUESTS) {
      return { success: false, message: `En fazla aynı anda ${MAX_ACTIVE_QUESTS} görev alabilirsin.` }
    }
    const idx = boardQuests.value.findIndex(q => q.id === questId)
    if (idx === -1) return { success: false, message: 'Görev bulunamadı.' }

    const quest = boardQuests.value[idx]!
    quest.accepted = true

    // Teslim görevi değilse çantadaki mevcut eşya sayısını hemen say
    if (quest.type !== 'delivery') {
      quest.collectedQuantity = Math.min(inventoryStore.getItemCount(quest.targetItemId), quest.targetQuantity)
    }

    activeQuests.value.push(quest)
    boardQuests.value.splice(idx, 1)
    return { success: true, message: `Görev alındı: ${quest.description}` }
  }

  /** Özel buyruk al */
  const acceptSpecialOrder = (): { success: boolean; message: string } => {
    if (!specialOrder.value) return { success: false, message: 'Alınabilir özel buyruk yok.' }
    if (activeQuests.value.length >= MAX_ACTIVE_QUESTS) {
      return { success: false, message: `En fazla aynı anda ${MAX_ACTIVE_QUESTS} görev alabilirsin.` }
    }

    const order = specialOrder.value
    order.accepted = true
    order.collectedQuantity = Math.min(inventoryStore.getItemCount(order.targetItemId), order.targetQuantity)

    activeQuests.value.push(order)
    specialOrder.value = null
    return { success: true, message: `Özel buyruk alındı: ${order.description}` }
  }

  /** Tamamlanan görevi teslim et */
  const submitQuest = (questId: string): { success: boolean; message: string } => {
    const idx = activeQuests.value.findIndex(q => q.id === questId)
    if (idx === -1) return { success: false, message: 'Görev bulunamadı.' }

    const quest = activeQuests.value[idx]!

    // Teslim görevinde eşya teslim anında çantadan düşer
    if (quest.type === 'delivery') {
      if (!inventoryStore.hasItem(quest.targetItemId, quest.targetQuantity)) {
        return { success: false, message: `Çantanda yeterince ${quest.targetItemName} yok.` }
      }
      inventoryStore.removeItem(quest.targetItemId, quest.targetQuantity)
    } else {
      // Balıkçılık / madencilik / toplama / özel buyruk görevlerinde ilerleme ya da çanta miktarını denetle
      const effectiveProgress = Math.max(quest.collectedQuantity, inventoryStore.getItemCount(quest.targetItemId))
      if (effectiveProgress < quest.targetQuantity) {
        return { success: false, message: `${quest.targetItemName} toplama ilerlemesi yetersiz (${effectiveProgress}/${quest.targetQuantity}).` }
      }
    }

    // Akçe ödülü ver
    playerStore.earnMoney(quest.moneyReward)
    npcStore.adjustFriendship(quest.npcId, quest.friendshipReward)

    // Eşya ödülü ver
    if (quest.itemReward) {
      for (const item of quest.itemReward) {
        inventoryStore.addItem(item.itemId, item.quantity)
      }
    }

    // Tamamlandı olarak kaydet
    completedQuestCount.value++

    // Aktif listeden kaldır
    activeQuests.value.splice(idx, 1)

    let message = `${quest.npcName} için verilen iş tamamlandı! ${quest.moneyReward} akçe aldın, ${quest.npcName} yakınlığı +${quest.friendshipReward}.`
    if (quest.itemReward && quest.itemReward.length > 0) {
      const itemNames = quest.itemReward.map(i => `${i.quantity} eşya`).join('、')
      message += ` Ayrıca ${itemNames} kazandın.`
    }

    return { success: true, message }
  }

  /** Oyuncu bir eşya aldığında sürmekte olan görev ilerlemesini güncelle */
  const onItemObtained = (itemId: string, quantity: number = 1) => {
    for (const quest of activeQuests.value) {
      if (quest.type === 'delivery') continue // Teslim görevleri kendiliğinden izlenmez
      if (quest.targetItemId === itemId && quest.collectedQuantity < quest.targetQuantity) {
        quest.collectedQuantity = Math.min(quest.collectedQuantity + quantity, quest.targetQuantity)
      }
    }

    // Ana görevdeki deliverItem hedeflerini de eşzamanlı güncelle
    if (mainQuest.value?.accepted) {
      const def = getStoryQuestById(mainQuest.value.questId)
      if (def) {
        for (let i = 0; i < def.objectives.length; i++) {
          const obj = def.objectives[i]!
          if (obj.type === 'deliverItem' && obj.itemId === itemId && !mainQuest.value.objectiveProgress[i]) {
            mainQuest.value.objectiveProgress[i] = evaluateObjective(obj)
          }
        }
      }
    }
  }

  /** Günlük güncelleme: süreyi azalt, süresi dolanı kaldır */
  const dailyUpdate = () => {
    // Aktif görevlerin kalan günü düşer
    const expired: QuestInstance[] = []
    activeQuests.value = activeQuests.value.filter(q => {
      q.daysRemaining--
      if (q.daysRemaining <= 0) {
        expired.push(q)
        return false
      }
      return true
    })

    // Özel buyruk süresi dolar (kabul edilmemiş olsa bile)
    if (specialOrder.value) {
      specialOrder.value.daysRemaining--
      if (specialOrder.value.daysRemaining <= 0) {
        specialOrder.value = null
      }
    }

    return expired
  }

  /** Belirli bir eşyayı isteyen aktif görev var mı */
  const hasActiveQuestFor = (itemId: string): boolean => {
    return activeQuests.value.some(q => q.targetItemId === itemId)
  }

  // ============================================================
  // Ana görevler
  // ============================================================

  /** Şu anki ana görev durumu */
  const mainQuest = ref<MainQuestState | null>(null)

  /** Tamamlanan ana görev kimlikleri */
  const completedMainQuests = ref<string[]>([])

  /** Yakınlık düzeyi sıralaması */
  const LEVEL_ORDER = ['stranger', 'acquaintance', 'friendly', 'bestFriend'] as const
  const meetsLevel = (current: string, required: string): boolean => {
    return LEVEL_ORDER.indexOf(current as (typeof LEVEL_ORDER)[number]) >= LEVEL_ORDER.indexOf(required as (typeof LEVEL_ORDER)[number])
  }

  /** Tek bir hedefin tamamlanıp tamamlanmadığını değerlendir */
  const evaluateObjective = (obj: MainQuestObjective): boolean => {
    const skillStore = useSkillStore()
    const shopStore = useShopStore()
    const animalStore = useAnimalStore()

    switch (obj.type) {
      case 'earnMoney':
        return achievementStore.stats.totalMoneyEarned >= (obj.target ?? 0)
      case 'reachMineFloor':
        return achievementStore.stats.highestMineFloor >= (obj.target ?? 0)
      case 'reachSkullFloor':
        return achievementStore.stats.skullCavernBestFloor >= (obj.target ?? 0)
      case 'skillLevel':
        if (obj.skillType) {
          return skillStore.getSkill(obj.skillType as 'farming' | 'foraging' | 'fishing' | 'mining' | 'combat').level >= (obj.target ?? 0)
        }
        // Belirli beceri türü yoksa herhangi bir beceri yeterlidir
        return skillStore.skills.some(s => s.level >= (obj.target ?? 0))
      case 'allSkillsLevel':
        return skillStore.skills.every(s => s.level >= (obj.target ?? 0))
      case 'harvestCrops':
        return achievementStore.stats.totalCropsHarvested >= (obj.target ?? 0)
      case 'catchFish':
        return achievementStore.stats.totalFishCaught >= (obj.target ?? 0)
      case 'cookRecipes':
        return achievementStore.stats.totalRecipesCooked >= (obj.target ?? 0)
      case 'killMonsters':
        return achievementStore.stats.totalMonstersKilled >= (obj.target ?? 0)
      case 'discoverItems':
        return achievementStore.discoveredItems.length >= (obj.target ?? 0)
      case 'npcFriendship': {
        if (obj.npcId === '_any') {
          // Herhangi bir köylü istenen yakınlığa ulaşsın
          return npcStore.npcStates.some(n => meetsLevel(npcStore.getFriendshipLevel(n.npcId), obj.friendshipLevel ?? 'acquaintance'))
        }
        const level = npcStore.getFriendshipLevel(obj.npcId ?? '')
        return meetsLevel(level, obj.friendshipLevel ?? 'acquaintance')
      }
      case 'npcAllFriendly':
        return npcStore.npcStates.every(n => meetsLevel(npcStore.getFriendshipLevel(n.npcId), obj.friendshipLevel ?? 'friendly'))
      case 'completeBundles':
        return achievementStore.completedBundles.length >= (obj.target ?? 0)
      case 'completeQuests':
        return completedQuestCount.value >= (obj.target ?? 0)
      case 'shipItems':
        return shopStore.shippedItems.length >= (obj.target ?? 0)
      case 'ownAnimals':
        return animalStore.animals.length >= (obj.target ?? 0)
      case 'married':
        return npcStore.getSpouse() !== null
      case 'hasChild':
        return npcStore.children.length > 0
      case 'deliverItem':
        // deliverItem yalnızca çantada yeterli eşya olup olmadığını denetler
        return inventoryStore.hasItem(obj.itemId ?? '', obj.itemQuantity ?? 1)
      default:
        return false
    }
  }

  /** Ana görevi başlat: mevcut yoksa sıradakini aç */
  const initMainQuest = () => {
    if (mainQuest.value) return // Zaten aktif ana görev var
    if (completedMainQuests.value.length >= STORY_QUESTS.length) return // Hepsi tamam

    // Tamamlanmamış bir sonraki ana görevi bul
    const nextQuest =
      completedMainQuests.value.length === 0
        ? getFirstStoryQuest()
        : getNextStoryQuest(completedMainQuests.value[completedMainQuests.value.length - 1]!)

    if (nextQuest) {
      mainQuest.value = {
        questId: nextQuest.id,
        accepted: false,
        objectiveProgress: nextQuest.objectives.map(() => false)
      }
    }
  }

  /** Ana görevi al */
  const acceptMainQuest = (): { success: boolean; message: string } => {
    if (!mainQuest.value) return { success: false, message: 'Alınabilir ana görev yok.' }
    if (mainQuest.value.accepted) return { success: false, message: 'Ana görev zaten alınmış.' }

    const def = getStoryQuestById(mainQuest.value.questId)
    if (!def) return { success: false, message: 'Ana görev verisi bozuk.' }

    mainQuest.value.accepted = true

    // Alınırken bir kez ilerlemeyi değerlendir
    for (let i = 0; i < def.objectives.length; i++) {
      mainQuest.value.objectiveProgress[i] = evaluateObjective(def.objectives[i]!)
    }

    const npcDef = getNpcById(def.npcId)
    const npcName = npcDef?.name ?? def.npcId
    return { success: true, message: `Ana görev alındı: ${def.title}（${npcName}）` }
  }

  /** Her gün ana görev ilerlemesini güncelle */
  const updateMainQuestProgress = () => {
    if (!mainQuest.value || !mainQuest.value.accepted) return

    const def = getStoryQuestById(mainQuest.value.questId)
    if (!def) return

    for (let i = 0; i < def.objectives.length; i++) {
      if (!mainQuest.value.objectiveProgress[i]) {
        mainQuest.value.objectiveProgress[i] = evaluateObjective(def.objectives[i]!)
      }
    }
  }

  /** Ana görev teslim edilebilir mi */
  const canSubmitMainQuest = (): boolean => {
    if (!mainQuest.value || !mainQuest.value.accepted) return false

    const def = getStoryQuestById(mainQuest.value.questId)
    if (!def) return false

    // Arayüz güncel kalsın diye eksik hedefleri anlık yenile
    for (let i = 0; i < def.objectives.length; i++) {
      if (!mainQuest.value.objectiveProgress[i]) {
        mainQuest.value.objectiveProgress[i] = evaluateObjective(def.objectives[i]!)
      }
    }

    return mainQuest.value.objectiveProgress.every(p => p)
  }

  /** Ana görevi teslim et */
  const submitMainQuest = (): { success: boolean; message: string } => {
    if (!mainQuest.value || !mainQuest.value.accepted) {
      return { success: false, message: 'Teslim edilecek ana görev yok.' }
    }

    const def = getStoryQuestById(mainQuest.value.questId)
    if (!def) return { success: false, message: 'Ana görev verisi bozuk.' }

    // Son kez tüm hedefleri doğrula
    for (let i = 0; i < def.objectives.length; i++) {
      mainQuest.value.objectiveProgress[i] = evaluateObjective(def.objectives[i]!)
    }
    if (!mainQuest.value.objectiveProgress.every(p => p)) {
      return { success: false, message: 'Ana görev hedefleri henüz bütünüyle tamamlanmadı.' }
    }

    // deliverItem türlerinde çantadan eşya düş
    for (const obj of def.objectives) {
      if (obj.type === 'deliverItem' && obj.itemId && obj.itemQuantity) {
        if (!inventoryStore.removeItem(obj.itemId, obj.itemQuantity)) {
          return { success: false, message: 'Çantadaki eşya yetersiz, görev teslim edilemedi.' }
        }
      }
    }

    // Akçe ödülü
    playerStore.earnMoney(def.moneyReward)

    // Yakınlık ödülü
    if (def.friendshipReward) {
      for (const fr of def.friendshipReward) {
        npcStore.adjustFriendship(fr.npcId, fr.amount)
      }
    }

    // Eşya ödülü
    if (def.itemReward) {
      for (const item of def.itemReward) {
        inventoryStore.addItem(item.itemId, item.quantity)
      }
    }

    // Tamamlandı olarak kaydet
    completedMainQuests.value.push(mainQuest.value.questId)
    mainQuest.value = null

    // Kendiliğinden sonraki ana görevi başlat
    initMainQuest()

    const npcDef = getNpcById(def.npcId)
    const npcName = npcDef?.name ?? def.npcId
    let message = `【Ana Görev Tamam】${def.title}！${npcName}: ${def.moneyReward} akçe kazandın.`
    if (def.itemReward && def.itemReward.length > 0) {
      message += ' Ayrıca eşya ödülü de aldın.'
    }
    if (!mainQuest.value) {
      if (completedMainQuests.value.length >= STORY_QUESTS.length) {
        message += ' Kutlu olsun! gaKöy’deki bütün ana görevleri tamamladın!'
      }
    }

    return { success: true, message }
  }

  // ============================================================
  // Serileştirme
  // ============================================================

  const serialize = () => {
    return {
      boardQuests: boardQuests.value,
      activeQuests: activeQuests.value,
      completedQuestCount: completedQuestCount.value,
      specialOrder: specialOrder.value,
      mainQuest: mainQuest.value,
      completedMainQuests: completedMainQuests.value
    }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    boardQuests.value = data.boardQuests ?? []
    activeQuests.value = data.activeQuests ?? []
    completedQuestCount.value = data.completedQuestCount ?? 0
    specialOrder.value = ((data as Record<string, unknown>).specialOrder as QuestInstance | null) ?? null
    mainQuest.value = ((data as Record<string, unknown>).mainQuest as MainQuestState | null) ?? null
    completedMainQuests.value = ((data as Record<string, unknown>).completedMainQuests as string[] | undefined) ?? []
    // Eski kayıtlarla uyum için yüklemeden sonra ana görevi başlat
    initMainQuest()
  }

  return {
    boardQuests,
    activeQuests,
    completedQuestCount,
    specialOrder,
    mainQuest,
    completedMainQuests,
    MAX_ACTIVE_QUESTS,
    generateDailyQuests,
    generateSpecialOrder,
    acceptQuest,
    acceptSpecialOrder,
    submitQuest,
    onItemObtained,
    dailyUpdate,
    hasActiveQuestFor,
    initMainQuest,
    acceptMainQuest,
    updateMainQuestProgress,
    canSubmitMainQuest,
    submitMainQuest,
    serialize,
    deserialize
  }
})
