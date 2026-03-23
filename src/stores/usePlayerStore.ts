import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Gender } from '@/types'
import {
  LATE_NIGHT_RECOVERY_MAX,
  LATE_NIGHT_RECOVERY_MIN,
  PASSOUT_STAMINA_RECOVERY,
  PASSOUT_MONEY_PENALTY_RATE,
  PASSOUT_MONEY_PENALTY_CAP
} from '@/data/timeConstants'
import { useSkillStore } from './useSkillStore'
import { useHomeStore } from './useHomeStore'
import { useInventoryStore } from './useInventoryStore'
import { useAchievementStore } from './useAchievementStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'
import { useMiningStore } from './useMiningStore'
import { useGuildStore } from './useGuildStore'

/** En yüksek dayanıklılık kademeleri (5 kademe, 270 başlayıp 508 tavan) */
const STAMINA_CAPS = [120, 160, 200, 250, 300]

/** Can sabitleri */
const BASE_MAX_HP = 100
const HP_PER_COMBAT_LEVEL = 5
const FIGHTER_HP_BONUS = 25
const WARRIOR_HP_BONUS = 40

export const usePlayerStore = defineStore('player', () => {
  const playerName = ref('Adsız')
  const gender = ref<Gender>('male')
  /** Eski kayıt yüklendikten sonra kimlik seçimi gerekir (kalıcı değil) */
  const needsIdentitySetup = ref(false)
  const money = ref(500)
  const stamina = ref(120)
  const maxStamina = ref(120)
  const staminaCapLevel = ref(0) // 0=120, 1=160, 2=200, 3=250, 4=300
  /** Ek dayanıklılık üst sınırı artışı (ör. ermiş iksiri), şeftali kademesi bunu ezmez */
  const bonusMaxStamina = ref(0)

  // Can sistemi
  const hp = ref(BASE_MAX_HP)
  const baseMaxHp = ref(BASE_MAX_HP)

  const isExhausted = computed(() => stamina.value <= 5)
  const staminaPercent = computed(() => Math.round((stamina.value / maxStamina.value) * 100))
  /** NPC'lerin oyuncuya hitap şekli */
  const honorific = computed(() => (gender.value === 'male' ? 'Yiğit' : 'Hatun'))

  /** Güncel azami canı hesapla (temel + savaş seviyesi + uzmanlık + ilahi bağ + lonca) */
  const getMaxHp = (): number => {
    const skillStore = useSkillStore()
    let bonus = skillStore.combatLevel * HP_PER_COMBAT_LEVEL
    const perk5 = skillStore.getSkill('combat').perk5
    const perk10 = skillStore.getSkill('combat').perk10
    if (perk5 === 'fighter') bonus += FIGHTER_HP_BONUS
    if (perk10 === 'warrior') bonus += WARRIOR_HP_BONUS
    const ringHpBonus = useInventoryStore().getRingEffectValue('max_hp_bonus')
    // Gizli bağ bonusu: Ruh Kalkanı (spirit_shield) can artışı
    const spiritShield = useHiddenNpcStore().getBondBonusByType('spirit_shield')
    const spiritHpBonus = spiritShield?.type === 'spirit_shield' ? spiritShield.hpBonus : 0
    // Lonca bonusu: yaşam tılsımı + seviye katkısı
    const guildHpBonus = useMiningStore().guildBonusMaxHp
    const guildLevelHpBonus = useGuildStore().getGuildHpBonus()
    return baseMaxHp.value + bonus + ringHpBonus + spiritHpBonus + guildHpBonus + guildLevelHpBonus
  }

  const getHpPercent = (): number => {
    return Math.round((hp.value / getMaxHp()) * 100)
  }

  const getIsLowHp = (): boolean => {
    return hp.value <= getMaxHp() * 0.25
  }

  /** Dayanıklılık harca (ilahi bağ indirimi dahil), başarılı mı döndür */
  const consumeStamina = (amount: number): boolean => {
    // Gizli bağ bonusu: Ruh Kalkanı (spirit_shield) dayanıklılık harcamasını azaltır
    const spiritShield2 = useHiddenNpcStore().getBondBonusByType('spirit_shield')
    const spiritSave = spiritShield2?.type === 'spirit_shield' ? spiritShield2.staminaSave / 100 : 0
    const effectiveAmount = Math.max(1, Math.floor(amount * (1 - spiritSave)))
    if (stamina.value < effectiveAmount) return false
    stamina.value -= effectiveAmount
    return true
  }

  /** Dayanıklılık yenile */
  const restoreStamina = (amount: number) => {
    stamina.value = Math.min(stamina.value + amount, maxStamina.value)
  }

  /** Hasar al (can azalt), gerçek hasarı döndür */
  const takeDamage = (amount: number): number => {
    const actual = Math.min(amount, hp.value)
    hp.value -= actual
    return actual
  }

  /** Can yenile */
  const restoreHealth = (amount: number) => {
    hp.value = Math.min(hp.value + amount, getMaxHp())
  }

  /**
   * Günlük sıfırlama
   * - Normal: tam dayanıklılık + tam can
   * - Geç yatış: kademeli yenilenme (24. saat %90 → 25. saat %60) + tam can
   * - Bayılma: %50 dayanıklılık + tam can + akçenin %10'u gider
   */
  const dailyReset = (mode: 'normal' | 'late' | 'passout', bedHour?: number): { moneyLost: number; recoveryPct: number } => {
    let moneyLost = 0
    let recoveryPct = 1
    switch (mode) {
      case 'normal':
        stamina.value = maxStamina.value
        break
      case 'late': {
        // Kademeli yenilenme: 24. saat→%90, 25. saat→%60, doğrusal geçiş
        const homeStore = useHomeStore()
        const staminaBonus = homeStore.getStaminaRecoveryBonus()
        const t = Math.min(Math.max((bedHour ?? 24) - 24, 0), 1)
        recoveryPct = LATE_NIGHT_RECOVERY_MAX - t * (LATE_NIGHT_RECOVERY_MAX - LATE_NIGHT_RECOVERY_MIN) + staminaBonus
        stamina.value = Math.floor(maxStamina.value * Math.min(recoveryPct, 1))
        break
      }
      case 'passout': {
        const homeStore2 = useHomeStore()
        const staminaBonus2 = homeStore2.getStaminaRecoveryBonus()
        recoveryPct = PASSOUT_STAMINA_RECOVERY + staminaBonus2
        stamina.value = Math.floor(maxStamina.value * Math.min(recoveryPct, 1))
        moneyLost = Math.min(Math.floor(money.value * PASSOUT_MONEY_PENALTY_RATE), PASSOUT_MONEY_PENALTY_CAP)
        money.value -= moneyLost
        break
      }
    }
    // Can her gün tamamen dolar
    hp.value = getMaxHp()
    return { moneyLost, recoveryPct }
  }

  /** Dayanıklılık üst sınırını artır */
  const upgradeMaxStamina = (): boolean => {
    if (staminaCapLevel.value >= STAMINA_CAPS.length - 1) return false
    staminaCapLevel.value++
    maxStamina.value = STAMINA_CAPS[staminaCapLevel.value]! + bonusMaxStamina.value
    return true
  }

  /** Ek dayanıklılık üst sınırı ver (ör. ermiş iksiri) */
  const addBonusMaxStamina = (amount: number) => {
    bonusMaxStamina.value += amount
    maxStamina.value = STAMINA_CAPS[staminaCapLevel.value]! + bonusMaxStamina.value
  }

  /** Akçe harca, başarı durumunu döndür */
  const spendMoney = (amount: number): boolean => {
    if (money.value < amount) return false
    money.value -= amount
    return true
  }

  /** Akçe kazan */
  const earnMoney = (amount: number) => {
    money.value += amount
    useAchievementStore().recordMoneyEarned(amount)
  }

  /** Oyuncu kimliğini ayarla (yeni oyun ya da eski kayıt geçişi için) */
  const setIdentity = (name: string, g: Gender) => {
    playerName.value = name
    gender.value = g
    needsIdentitySetup.value = false
  }

  const serialize = () => {
    return {
      playerName: playerName.value,
      gender: gender.value,
      money: money.value,
      stamina: stamina.value,
      maxStamina: maxStamina.value,
      staminaCapLevel: staminaCapLevel.value,
      bonusMaxStamina: bonusMaxStamina.value,
      hp: hp.value,
      baseMaxHp: baseMaxHp.value
    }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    const hasIdentity = (data as any).playerName != null
    playerName.value = (data as any).playerName ?? 'Adsız'
    gender.value = (data as any).gender ?? 'male'
    needsIdentitySetup.value = !hasIdentity
    money.value = data.money
    stamina.value = data.stamina
    maxStamina.value = data.maxStamina
    staminaCapLevel.value = data.staminaCapLevel
    bonusMaxStamina.value = (data as any).bonusMaxStamina ?? 0
    // Eski kayıt uyumluluğu: bonusMaxStamina yoksa maxStamina ile kademeden türet
    if ((data as any).bonusMaxStamina == null) {
      const expectedBase = STAMINA_CAPS[staminaCapLevel.value] ?? 120
      const diff = maxStamina.value - expectedBase
      if (diff > 0) bonusMaxStamina.value = diff
    }
    // maxStamina ile staminaCapLevel + bonusMaxStamina tutarlı olsun
    const expectedMax = (STAMINA_CAPS[staminaCapLevel.value] ?? 120) + bonusMaxStamina.value
    if (maxStamina.value !== expectedMax) {
      maxStamina.value = expectedMax
    }
    hp.value = (data as any).hp ?? BASE_MAX_HP
    baseMaxHp.value = (data as any).baseMaxHp ?? BASE_MAX_HP
  }

  return {
    playerName,
    gender,
    needsIdentitySetup,
    honorific,
    money,
    stamina,
    maxStamina,
    staminaCapLevel,
    bonusMaxStamina,
    hp,
    baseMaxHp,
    isExhausted,
    staminaPercent,
    getMaxHp,
    getHpPercent,
    getIsLowHp,
    consumeStamina,
    restoreStamina,
    takeDamage,
    restoreHealth,
    dailyReset,
    upgradeMaxStamina,
    addBonusMaxStamina,
    spendMoney,
    earnMoney,
    setIdentity,
    serialize,
    deserialize
  }
})
