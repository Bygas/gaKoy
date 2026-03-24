import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { MONSTER_GOALS, GUILD_SHOP_ITEMS, GUILD_DONATIONS, GUILD_LEVELS, GUILD_BONUS_PER_LEVEL } from '@/data/guild'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { useGameStore } from './useGameStore'
import { addLog } from '@/composables/useGameLog'

export const useGuildStore = defineStore('guild', () => {
  /** Yaratık kimliğine göre av sayısı kaydı */
  const monsterKills = ref<Record<string, number>>({})

  /** Ödülü alınmış av hedefleri */
  const claimedGoals = ref<string[]>([])

  /** Daha önce karşılaşılan yaratıklar (kayıt defteri için) */
  const encounteredMonsters = ref<string[]>([])

  /** Katkı puanı (harcanabilir değer) */
  const contributionPoints = ref(0)

  /** Lonca tecrübesi (örtük değer) */
  const guildExp = ref(0)

  /** Lonca düzeyi (açık görünen değer) */
  const guildLevel = ref(0)

  /** Günlük alım sınırı takibi: { itemId: bugün alınan sayı } */
  const dailyPurchases = ref<Record<string, number>>({})

  /** Günlük sınırın en son sıfırlandığı gün numarası */
  const lastResetDay = ref(-1)

  /** Haftalık alım sınırı takibi: { itemId: bu hafta alınan sayı } */
  const weeklyPurchases = ref<Record<string, number>>({})

  /** Haftalık sınırın en son sıfırlandığı hafta numarası */
  const lastResetWeek = ref(-1)

  /** Toplam kalıcı satın alım takibi: { itemId: bugüne dek alınan sayı } */
  const totalPurchases = ref<Record<string, number>>({})

  /** Av kaydı ekle */
  const recordKill = (monsterId: string) => {
    monsterKills.value[monsterId] = (monsterKills.value[monsterId] ?? 0) + 1
    if (!encounteredMonsters.value.includes(monsterId)) {
      encounteredMonsters.value.push(monsterId)
    }
  }

  /** Karşılaşma kaydı ekle (cenk başında çağrılır, öldürmek şart değildir) */
  const recordEncounter = (monsterId: string) => {
    if (!encounteredMonsters.value.includes(monsterId)) {
      encounteredMonsters.value.push(monsterId)
    }
  }

  /** Belirli yaratığın av sayısını getir */
  const getKillCount = (monsterId: string): number => {
    return monsterKills.value[monsterId] ?? 0
  }

  /** Bu yaratıkla karşılaşıldı mı */
  const isEncountered = (monsterId: string): boolean => {
    return encounteredMonsters.value.includes(monsterId)
  }

  /** Tamamlanan av hedefi sayısı */
  const completedGoalCount = computed(() => {
    return MONSTER_GOALS.filter(g => (monsterKills.value[g.monsterId] ?? 0) >= g.killTarget).length
  })

  /** Ödülü alınabilecek hedefler */
  const claimableGoals = computed(() => {
    return MONSTER_GOALS.filter(g => (monsterKills.value[g.monsterId] ?? 0) >= g.killTarget && !claimedGoals.value.includes(g.monsterId))
  })

  /** Av ödülünü al */
  const claimGoal = (monsterId: string): boolean => {
    const goal = MONSTER_GOALS.find(g => g.monsterId === monsterId)
    if (!goal) return false
    if ((monsterKills.value[monsterId] ?? 0) < goal.killTarget) return false
    if (claimedGoals.value.includes(monsterId)) return false

    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()

    if (goal.reward.money) {
      playerStore.earnMoney(goal.reward.money)
    }
    if (goal.reward.items) {
      for (const item of goal.reward.items) {
        inventoryStore.addItem(item.itemId, item.quantity)
      }
    }
    // Av ödülü yalnız katkı puanı verir; lonca tecrübesi vermez
    const bonusPoints = Math.floor((goal.reward.money ?? 0) / 20) + goal.killTarget
    contributionPoints.value += bonusPoints
    claimedGoals.value.push(monsterId)
    addLog(`Av ödülü alındı, ek olarak ${bonusPoints} katkı puanı kazanıldı.`)
    return true
  }

  // ==================== Lonca düzeyi ====================

  /** Mevcut oyun gün numarasını hesapla */
  const getCurrentDay = (): number => {
    const gameStore = useGameStore()
    const seasonIndex = ['spring', 'summer', 'autumn', 'winter'].indexOf(gameStore.season)
    return (gameStore.year - 1) * 112 + seasonIndex * 28 + gameStore.day
  }

  /** Günlük alım sınırını gerektiğinde sıfırla */
  const ensureDailyReset = () => {
    const day = getCurrentDay()
    if (day !== lastResetDay.value) {
      dailyPurchases.value = {}
      lastResetDay.value = day
    }
  }

  /** Mevcut oyun hafta numarasını hesapla */
  const getCurrentWeek = (): number => {
    return Math.floor((getCurrentDay() - 1) / 7)
  }

  /** Haftalık alım sınırını gerektiğinde sıfırla */
  const ensureWeeklyReset = () => {
    const week = getCurrentWeek()
    if (week !== lastResetWeek.value) {
      weeklyPurchases.value = {}
      lastResetWeek.value = week
    }
  }

  /** Düzey atlama denetimi */
  const checkLevelUp = () => {
    while (guildLevel.value < GUILD_LEVELS.length) {
      const next = GUILD_LEVELS[guildLevel.value]
      if (!next || guildExp.value < next.expRequired) break
      guildLevel.value++
      addLog(`Serüvenciler Loncası ${guildLevel.value}. düzeye yükseldi!`)
    }
  }

  /** Eşya bağışla */
  const donateItem = (itemId: string, quantity: number): { success: boolean; pointsGained: number } => {
    const donation = GUILD_DONATIONS.find(d => d.itemId === itemId)
    if (!donation) return { success: false, pointsGained: 0 }
    const inventoryStore = useInventoryStore()
    const available = inventoryStore.getItemCount(itemId)
    const actual = Math.min(quantity, available)
    if (actual <= 0) return { success: false, pointsGained: 0 }
    inventoryStore.removeItem(itemId, actual)
    const points = donation.points * actual
    contributionPoints.value += points
    guildExp.value += points
    checkLevelUp()
    return { success: true, pointsGained: points }
  }

  /** Bugün için kalan alım hakkını getir */
  const getDailyRemaining = (itemId: string, dailyLimit: number): number => {
    ensureDailyReset()
    return dailyLimit - (dailyPurchases.value[itemId] ?? 0)
  }

  /** Bu hafta için kalan alım hakkını getir */
  const getWeeklyRemaining = (itemId: string, weeklyLimit: number): number => {
    ensureWeeklyReset()
    return weeklyLimit - (weeklyPurchases.value[itemId] ?? 0)
  }

  /** Toplam kalan alım hakkını getir */
  const getTotalRemaining = (itemId: string, totalLimit: number): number => {
    return totalLimit - (totalPurchases.value[itemId] ?? 0)
  }

  /** Lonca düzeyinden gelen pasif saldırı artışı */
  const getGuildAttackBonus = (): number => {
    return guildLevel.value * GUILD_BONUS_PER_LEVEL.attack
  }

  /** Lonca düzeyinden gelen pasif can artışı */
  const getGuildHpBonus = (): number => {
    return guildLevel.value * GUILD_BONUS_PER_LEVEL.maxHp
  }

  // ==================== Lonca dükkânı ====================

  /** Lonca dükkânında eşya açıldı mı */
  const isShopItemUnlocked = (itemId: string): boolean => {
    const item = GUILD_SHOP_ITEMS.find(i => i.itemId === itemId)
    if (!item) return false
    if (!item.unlockGuildLevel) return true
    return guildLevel.value >= item.unlockGuildLevel
  }

  /** Lonca dükkânından eşya al */
  const buyShopItem = (itemId: string): boolean => {
    const item = GUILD_SHOP_ITEMS.find(i => i.itemId === itemId)
    if (!item) return false
    if (!isShopItemUnlocked(itemId)) return false

    // Günlük sınır denetimi
    if (item.dailyLimit) {
      ensureDailyReset()
      if ((dailyPurchases.value[itemId] ?? 0) >= item.dailyLimit) return false
    }

    // Haftalık sınır denetimi
    if (item.weeklyLimit) {
      ensureWeeklyReset()
      if ((weeklyPurchases.value[itemId] ?? 0) >= item.weeklyLimit) return false
    }

    // Kalıcı toplam sınır denetimi
    if (item.totalLimit) {
      if ((totalPurchases.value[itemId] ?? 0) >= item.totalLimit) return false
    }

    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()

    // Gereç denetimi
    if (item.materials) {
      for (const mat of item.materials) {
        if (inventoryStore.getItemCount(mat.itemId) < mat.quantity) return false
      }
    }

    // Kalıcı mallar katkı puanıyla, sarf malları akçeyle alınır
    if (item.contributionCost) {
      if (contributionPoints.value < item.contributionCost) return false
      contributionPoints.value -= item.contributionCost
    } else {
      if (playerStore.money < item.price) return false
      playerStore.spendMoney(item.price)
    }

    // Gereçleri düş
    if (item.materials) {
      for (const mat of item.materials) {
        inventoryStore.removeItem(mat.itemId, mat.quantity)
      }
    }

    // Teçhizat türüne göre uygun bölüme ekle
    let addSuccess = true
    if (item.equipType === 'weapon') {
      addSuccess = inventoryStore.addWeapon(item.itemId, null)
    } else if (item.equipType === 'ring') {
      addSuccess = inventoryStore.addRing(item.itemId)
    } else if (item.equipType === 'hat') {
      addSuccess = inventoryStore.addHat(item.itemId)
    } else if (item.equipType === 'shoe') {
      addSuccess = inventoryStore.addShoe(item.itemId)
    } else {
      addSuccess = inventoryStore.addItem(item.itemId, 1)
    }

    if (!addSuccess) {
      // Katkı puanı / akçeyi iade et
      if (item.contributionCost) contributionPoints.value += item.contributionCost
      else playerStore.earnMoney(item.price)
      // Gereçleri iade et
      if (item.materials) {
        for (const mat of item.materials) {
          inventoryStore.addItem(mat.itemId, mat.quantity)
        }
      }
      return false
    }

    // Alım kaydı
    if (item.dailyLimit) {
      dailyPurchases.value[itemId] = (dailyPurchases.value[itemId] ?? 0) + 1
    }
    if (item.weeklyLimit) {
      weeklyPurchases.value[itemId] = (weeklyPurchases.value[itemId] ?? 0) + 1
    }
    if (item.totalLimit) {
      totalPurchases.value[itemId] = (totalPurchases.value[itemId] ?? 0) + 1
    }
    addLog(`Lonca dükkânından “${item.name}” satın alındı.`)
    return true
  }

  /** Kayda geçirme */
  const serialize = () => ({
    monsterKills: { ...monsterKills.value },
    claimedGoals: [...claimedGoals.value],
    encounteredMonsters: [...encounteredMonsters.value],
    contributionPoints: contributionPoints.value,
    guildExp: guildExp.value,
    guildLevel: guildLevel.value,
    dailyPurchases: { ...dailyPurchases.value },
    lastResetDay: lastResetDay.value,
    weeklyPurchases: { ...weeklyPurchases.value },
    lastResetWeek: lastResetWeek.value,
    totalPurchases: { ...totalPurchases.value }
  })

  /** Kayıttan geri yükleme */
  const deserialize = (data: ReturnType<typeof serialize>) => {
    monsterKills.value = data.monsterKills ?? {}
    claimedGoals.value = data.claimedGoals ?? []
    encounteredMonsters.value = data.encounteredMonsters ?? []
    dailyPurchases.value = ((data as Record<string, unknown>).dailyPurchases as Record<string, number>) ?? {}
    lastResetDay.value = ((data as Record<string, unknown>).lastResetDay as number) ?? -1
    weeklyPurchases.value = ((data as Record<string, unknown>).weeklyPurchases as Record<string, number>) ?? {}
    lastResetWeek.value = ((data as Record<string, unknown>).lastResetWeek as number) ?? -1
    totalPurchases.value = ((data as Record<string, unknown>).totalPurchases as Record<string, number>) ?? {}

    // Eski kayıt geçişi: katkı puanı alanı yoksa, alınmış av ödüllerinden katkı puanı hesapla
    const isOldSave = !('contributionPoints' in data)
    if (isOldSave && claimedGoals.value.length > 0) {
      let migratedPoints = 0
      for (const monsterId of claimedGoals.value) {
        const goal = MONSTER_GOALS.find(g => g.monsterId === monsterId)
        if (goal) {
          migratedPoints += Math.floor((goal.reward.money ?? 0) / 20) + goal.killTarget
        }
      }
      contributionPoints.value = migratedPoints
      guildExp.value = 0
      guildLevel.value = 0
    } else {
      contributionPoints.value = ((data as Record<string, unknown>).contributionPoints as number) ?? 0
      guildExp.value = ((data as Record<string, unknown>).guildExp as number) ?? 0
      guildLevel.value = ((data as Record<string, unknown>).guildLevel as number) ?? 0
    }
  }

  return {
    monsterKills,
    claimedGoals,
    encounteredMonsters,
    contributionPoints,
    guildExp,
    guildLevel,
    recordKill,
    recordEncounter,
    getKillCount,
    isEncountered,
    completedGoalCount,
    claimableGoals,
    claimGoal,
    donateItem,
    getDailyRemaining,
    getWeeklyRemaining,
    getTotalRemaining,
    getGuildAttackBonus,
    getGuildHpBonus,
    isShopItemUnlocked,
    buyShopItem,
    serialize,
    deserialize
  }
})
