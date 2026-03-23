import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { WALLET_ITEMS } from '@/data/wallet'
import { FISH } from '@/data/fish'
import { useAchievementStore } from './useAchievementStore'
import { useSkillStore } from './useSkillStore'
import { useMiningStore } from './useMiningStore'

export const useWalletStore = defineStore('wallet', () => {
  /** Açılmış kese eşyalarının ID listesi */
  const unlockedItems = ref<string[]>([])

  /** Açılmış kese eşyalarının tanımları */
  const unlockedDefs = computed(() => WALLET_ITEMS.filter(w => unlockedItems.value.includes(w.id)))

  /** Belirli bir eşya açılmış mı */
  const has = (id: string): boolean => {
    return unlockedItems.value.includes(id)
  }

  /** Elle aç */
  const unlock = (id: string): boolean => {
    if (has(id)) return false
    if (!WALLET_ITEMS.find(w => w.id === id)) return false
    unlockedItems.value.push(id)
    return true
  }

  /** Şartları sağlayan eşyaları denetleyip otomatik aç, yeni açılan adları döndür */
  const checkAndUnlock = (): string[] => {
    const achievementStore = useAchievementStore()
    const skillStore = useSkillStore()
    const miningStore = useMiningStore()

    const newlyUnlocked: string[] = []

    // Tüccar Mührü: toplam 10000 bakır para kazan
    if (!has('merchant_seal') && achievementStore.stats.totalMoneyEarned >= 10000) {
      unlock('merchant_seal')
      newlyUnlocked.push('Tüccar Mührü')
    }

    // Şifacı Tomarı: toplama seviyesi 8
    if (!has('herb_guide') && skillStore.getSkill('foraging').level >= 8) {
      unlock('herb_guide')
      newlyUnlocked.push('Lokman Tomarı')
    }

    // Madenci Tılsımı: madenin 50. katı
    if (!has('miners_charm') && miningStore.safePointFloor >= 50) {
      unlock('miners_charm')
      newlyUnlocked.push('Madenci Tılsımı')
    }

    // Oltacı Nişanı: 30 tür balık yakala
    if (!has('anglers_token')) {
      const fishIdSet = new Set(FISH.map(f => f.id))
      const fishCount = achievementStore.discoveredItems.filter(id => fishIdSet.has(id)).length
      if (fishCount >= 30) {
        unlock('anglers_token')
        newlyUnlocked.push('Oltacı Nişanı')
      }
    }

    // Aşçı Serpuşu: 10 farklı yemek pişir
    if (!has('chefs_hat') && achievementStore.stats.totalRecipesCooked >= 10) {
      unlock('chefs_hat')
      newlyUnlocked.push('Aşçı Serpuşu')
    }

    // Toprak Totemi: 100 kez ürün hasat et
    if (!has('earth_totem') && achievementStore.stats.totalCropsHarvested >= 100) {
      unlock('earth_totem')
      newlyUnlocked.push('Toprak Totemi')
    }

    return newlyUnlocked
  }

  // === Pasif etkiler ===

  /** Dükkân indirimi (0.1 = %10) */
  const getShopDiscount = (): number => {
    return has('merchant_seal') ? 0.1 : 0
  }

  /** Toplama kalite artışı kademe sayısı */
  const getForageQualityBoost = (): number => {
    return has('herb_guide') ? 1 : 0
  }

  /** Madencilik dayanıklılık indirimi (0.15 = %15) */
  const getMiningStaminaReduction = (): number => {
    return has('miners_charm') ? 0.15 : 0
  }

  /** Balıkçılıkta calm olasılığı artışı */
  const getFishingCalmBonus = (): number => {
    return has('anglers_token') ? 0.1 : 0
  }

  /** Yemek iyileştirme miktarı artışı (0.25 = %25) */
  const getCookingRestoreBonus = (): number => {
    return has('chefs_hat') ? 0.25 : 0
  }

  /** Ürün büyüme hızı artışı (0.1 = %10) */
  const getCropGrowthBonus = (): number => {
    return has('earth_totem') ? 0.1 : 0
  }

  const serialize = () => {
    return { unlockedItems: unlockedItems.value }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    unlockedItems.value = data.unlockedItems ?? []
  }

  return {
    unlockedItems,
    unlockedDefs,
    has,
    unlock,
    checkAndUnlock,
    getShopDiscount,
    getForageQualityBoost,
    getMiningStaminaReduction,
    getFishingCalmBonus,
    getCookingRestoreBonus,
    getCropGrowthBonus,
    serialize,
    deserialize
  }
})
