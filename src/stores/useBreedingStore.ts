import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { SeedGenetics, BreedingSlot, BreedingSeed, CompendiumEntry } from '@/types/breeding'
import {
  BASE_BREEDING_BOX,
  SEED_BOX_UPGRADES,
  SEED_BOX_UPGRADE_INCREMENT,
  BREEDING_DAYS,
  BASE_MUTATION_MAGNITUDE,
  GENERATIONAL_STABILITY_GAIN,
  MAX_STABILITY,
  MUTATION_JUMP_MIN,
  MUTATION_JUMP_MAX,
  MUTATION_RATE_DRIFT,
  BREEDING_STATION_COST,
  MAX_BREEDING_STATIONS,
  generateGeneticsId,
  clampStat,
  clampMutationRate,
  getDefaultGenetics,
  getStarRating,
  makeSeedLabel,
  findPossibleHybrid,
  findPossibleHybridById,
  getSeedMakerGeneticChance,
  getHybridTier
} from '@/data/breeding'
import { getCropById } from '@/data/crops'
import { addLog } from '@/composables/useGameLog'
import { useAchievementStore } from './useAchievementStore'
import { useGameStore } from './useGameStore'

export const useBreedingStore = defineStore('breeding', () => {
  // === Durum ===

  /** Tohum sandığı */
  const breedingBox = ref<BreedingSeed[]>([])

  /** Islah tezgahları */
  const stations = ref<BreedingSlot[]>([])

  /** Kurulmuş ıslah tezgahı sayısı */
  const stationCount = ref(0)

  /** Kayıt defteri */
  const compendium = ref<CompendiumEntry[]>([])

  /** Islah sistemi açıldı mı? (Tohum yapım düzeneği olunca açılır) */
  const unlocked = ref(false)

  /** Tohum sandığı seviyesi: 0/1/2, karşılığı 30/45/60 */
  const seedBoxLevel = ref(0)

  // === Hesaplanan değerler ===

  /** Tohum sandığının azami kapasitesi (seviyeye göre) */
  const maxSeedBox = computed(() => BASE_BREEDING_BOX + seedBoxLevel.value * SEED_BOX_UPGRADE_INCREMENT)

  const boxCount = computed(() => breedingBox.value.length)
  const boxFull = computed(() => breedingBox.value.length >= maxSeedBox.value)

  // === Tohum sandığı işlemleri ===

  const addToBox = (genetics: SeedGenetics): boolean => {
    if (breedingBox.value.length >= maxSeedBox.value) return false
    breedingBox.value.push({
      genetics,
      label: makeSeedLabel(genetics)
    })
    return true
  }

  const removeFromBox = (geneticsId: string): BreedingSeed | null => {
    const idx = breedingBox.value.findIndex(s => s.genetics.id === geneticsId)
    if (idx === -1) return null
    return breedingBox.value.splice(idx, 1)[0] ?? null
  }

  // === Tohum yapım düzeneği geliştirmesi ===

  const trySeedMakerGeneticSeed = (cropId: string, farmingLevel: number): boolean => {
    if (breedingBox.value.length >= maxSeedBox.value) return false

    const chance = getSeedMakerGeneticChance(farmingLevel)
    if (Math.random() > chance) return false

    const base = getDefaultGenetics(cropId)
    // Az miktarda rastgele dalgalanma ekle
    const genetics: SeedGenetics = {
      ...base,
      id: generateGeneticsId(),
      sweetness: clampStat(base.sweetness + Math.round((Math.random() - 0.5) * 10)),
      yield: clampStat(base.yield + Math.round((Math.random() - 0.5) * 10)),
      resistance: clampStat(base.resistance + Math.round((Math.random() - 0.5) * 10))
    }

    addToBox(genetics)
    unlocked.value = true
    return true
  }

  // === Islah tezgahı ===

  const craftStation = (spendMoney: (amount: number) => void, removeItem: (id: string, qty: number) => void): boolean => {
    if (stationCount.value >= MAX_BREEDING_STATIONS) return false
    spendMoney(BREEDING_STATION_COST.money)
    for (const mat of BREEDING_STATION_COST.materials) {
      removeItem(mat.itemId, mat.quantity)
    }
    stationCount.value++
    stations.value.push({
      parentA: null,
      parentB: null,
      daysProcessed: 0,
      totalDays: BREEDING_DAYS,
      result: null,
      ready: false
    })
    return true
  }

  const canCraftStation = (money: number, getItemCount: (id: string) => number): boolean => {
    if (stationCount.value >= MAX_BREEDING_STATIONS) return false
    if (money < BREEDING_STATION_COST.money) return false
    for (const mat of BREEDING_STATION_COST.materials) {
      if (getItemCount(mat.itemId) < mat.quantity) return false
    }
    return true
  }

  // === Tohum sandığı yükseltmesi ===

  const getNextSeedBoxUpgrade = () => {
    const next = seedBoxLevel.value + 1
    return SEED_BOX_UPGRADES.find(u => u.level === next) ?? null
  }

  const canUpgradeSeedBox = (money: number, getItemCount: (id: string) => number): boolean => {
    const upgrade = getNextSeedBoxUpgrade()
    if (!upgrade) return false
    if (money < upgrade.cost) return false
    for (const mat of upgrade.materials) {
      if (getItemCount(mat.itemId) < mat.quantity) return false
    }
    return true
  }

  const upgradeSeedBox = (
    spendMoney: (amount: number) => void,
    removeItem: (id: string, qty: number) => void
  ): { success: boolean; message: string } => {
    const upgrade = getNextSeedBoxUpgrade()
    if (!upgrade) return { success: false, message: 'Tohum sandığı en yüksek seviyeye ulaştı.' }
    spendMoney(upgrade.cost)
    for (const mat of upgrade.materials) {
      removeItem(mat.itemId, mat.quantity)
    }
    seedBoxLevel.value++
    return { success: true, message: `Tohum sandığı genişletildi! Kapasite ${maxSeedBox.value} göze çıktı.` }
  }

  const startBreeding = (slotIndex: number, seedAId: string, seedBId: string): boolean => {
    const slot = stations.value[slotIndex]
    if (!slot || slot.parentA || slot.ready) return false

    const seedA = removeFromBox(seedAId)
    const seedB = removeFromBox(seedBId)
    if (!seedA || !seedB) {
      // Çıkarılmış tohumları geri ver
      if (seedA) addToBox(seedA.genetics)
      if (seedB) addToBox(seedB.genetics)
      return false
    }

    slot.parentA = seedA.genetics
    slot.parentB = seedB.genetics
    slot.daysProcessed = 0
    slot.totalDays = BREEDING_DAYS
    slot.result = null
    slot.ready = false
    return true
  }

  const collectResult = (slotIndex: number): SeedGenetics | null => {
    const slot = stations.value[slotIndex]
    if (!slot || !slot.ready || !slot.result) return null

    const result = slot.result
    // Tohum sandığına koy
    if (!addToBox(result)) {
      addLog('Tohum sandığı dolu, ürün alınamadı.')
      return null
    }

    // Güvenlik kontrolü: melez tohum kayıt defterine işlendi mi?
    if (result.isHybrid && result.hybridId) {
      const existing = compendium.value.find(e => e.hybridId === result.hybridId)
      if (!existing) {
        const hybrid = findPossibleHybridById(result.hybridId)
        compendium.value.push({
          hybridId: result.hybridId,
          discoveredYear: useGameStore().year,
          bestTotalStats: result.sweetness + result.yield + result.resistance,
          timesGrown: 0
        })
        if (hybrid) addLog(hybrid.discoveryText)
      }
    }

    // Yuvayı sıfırla
    slot.parentA = null
    slot.parentB = null
    slot.daysProcessed = 0
    slot.result = null
    slot.ready = false

    return result
  }

  // === Ana melezleme algoritması ===

  const breedSeeds = (parentA: SeedGenetics, parentB: SeedGenetics): SeedGenetics => {
    if (parentA.cropId === parentB.cropId) {
      // Aynı tür melezleme: nesil ıslahı
      return breedSameCrop(parentA, parentB)
    } else {
      // Farklı tür melezleme
      return breedDifferentCrop(parentA, parentB)
    }
  }

  /** Aynı tür melezleme (nesil ıslahı) */
  const breedSameCrop = (a: SeedGenetics, b: SeedGenetics): SeedGenetics => {
    const avgStability = (a.stability + b.stability) / 2
    const avgMutationRate = (a.mutationRate + b.mutationRate) / 2

    const fluctuationScale = (avgMutationRate / 50) * (1 - avgStability / 100)

    const fluctuate = (): number => {
      return Math.round((Math.random() - 0.5) * 2 * BASE_MUTATION_MAGNITUDE * fluctuationScale)
    }

    let sweetness = clampStat(Math.round((a.sweetness + b.sweetness) / 2) + fluctuate())
    let yieldVal = clampStat(Math.round((a.yield + b.yield) / 2) + fluctuate())
    let resistance = clampStat(Math.round((a.resistance + b.resistance) / 2) + fluctuate())
    let mutationRate = clampMutationRate(Math.round(avgMutationRate))

    // Mutasyon olayı
    if (Math.random() < avgMutationRate / 100) {
      const mutateCount = Math.random() < 0.5 ? 1 : 2
      const stats: ('sweetness' | 'yield' | 'resistance')[] = ['sweetness', 'yield', 'resistance']
      // Fisher-Yates karıştırma
      for (let j = stats.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1))
        ;[stats[j], stats[k]] = [stats[k]!, stats[j]!]
      }
      const shuffled = stats
      const current = { sweetness, yield: yieldVal, resistance }

      for (let i = 0; i < mutateCount; i++) {
        const stat = shuffled[i]!
        const jump = MUTATION_JUMP_MIN + Math.round(Math.random() * (MUTATION_JUMP_MAX - MUTATION_JUMP_MIN))
        const direction = Math.random() < 0.5 ? 1 : -1
        current[stat] = clampStat(current[stat] + jump * direction)
      }

      sweetness = current.sweetness
      yieldVal = current.yield
      resistance = current.resistance
      mutationRate = clampMutationRate(mutationRate + Math.round((Math.random() - 0.5) * 2 * MUTATION_RATE_DRIFT))

      addLog('Islah sırasında mutasyon oldu! Özelliklerde büyük dalgalanma yaşandı.')
    }

    const result: SeedGenetics = {
      id: generateGeneticsId(),
      cropId: a.cropId,
      generation: Math.max(a.generation, b.generation) + 1,
      sweetness,
      yield: yieldVal,
      resistance,
      stability: Math.min(Math.round(avgStability) + GENERATIONAL_STABILITY_GAIN, MAX_STABILITY),
      mutationRate,
      parentA: a.id,
      parentB: b.id,
      isHybrid: a.isHybrid || b.isHybrid,
      hybridId: a.hybridId ?? b.hybridId
    }

    // Aynı tür melezlemede de kayıt defteri eşzamanlı güncellensin
    // (kayıt silinirse geri kazanılabilsin diye)
    if (result.isHybrid && result.hybridId) {
      const existing = compendium.value.find(e => e.hybridId === result.hybridId)
      if (!existing) {
        const hybrid = findPossibleHybridById(result.hybridId)
        compendium.value.push({
          hybridId: result.hybridId,
          discoveredYear: useGameStore().year,
          bestTotalStats: result.sweetness + result.yield + result.resistance,
          timesGrown: 0
        })
        if (hybrid) addLog(hybrid.discoveryText)
      } else {
        const total = result.sweetness + result.yield + result.resistance
        if (total > existing.bestTotalStats) {
          existing.bestTotalStats = total
        }
      }
    }

    return result
  }

  /** Farklı tür melezleme */
  const breedDifferentCrop = (a: SeedGenetics, b: SeedGenetics): SeedGenetics => {
    const hybrid = findPossibleHybrid(a.cropId, b.cropId)
    const avgSweetness = (a.sweetness + b.sweetness) / 2
    const avgYield = (a.yield + b.yield) / 2

    if (hybrid && avgSweetness >= hybrid.minSweetness && avgYield >= hybrid.minYield) {
      // Eşleşme başarılı, melez tohum üret
      const avgStability = (a.stability + b.stability) / 2
      const avgMutationRate = (a.mutationRate + b.mutationRate) / 2
      const fluctuationScale = (avgMutationRate / 50) * (1 - avgStability / 100)

      const fluctuate = (): number => {
        return Math.round((Math.random() - 0.5) * 2 * BASE_MUTATION_MAGNITUDE * fluctuationScale)
      }

      const result: SeedGenetics = {
        id: generateGeneticsId(),
        cropId: hybrid.resultCropId,
        generation: Math.max(a.generation, b.generation) + 1,
        sweetness: clampStat(Math.round(hybrid.baseGenetics.sweetness * 0.6 + avgSweetness * 0.4) + fluctuate()),
        yield: clampStat(Math.round(hybrid.baseGenetics.yield * 0.6 + avgYield * 0.4) + fluctuate()),
        resistance: clampStat(Math.round(hybrid.baseGenetics.resistance * 0.6 + ((a.resistance + b.resistance) / 2) * 0.4) + fluctuate()),
        stability: Math.min(Math.round(avgStability) + GENERATIONAL_STABILITY_GAIN, MAX_STABILITY),
        mutationRate: clampMutationRate(Math.round(avgMutationRate)),
        parentA: a.id,
        parentB: b.id,
        isHybrid: true,
        hybridId: hybrid.id
      }

      // Kayıt defterini güncelle
      const existing = compendium.value.find(e => e.hybridId === hybrid.id)
      if (!existing) {
        compendium.value.push({
          hybridId: hybrid.id,
          discoveredYear: useGameStore().year,
          bestTotalStats: result.sweetness + result.yield + result.resistance,
          timesGrown: 0
        })
        addLog(hybrid.discoveryText)
        const achievementStore = useAchievementStore()
        achievementStore.recordHybridDiscovered()
        achievementStore.recordHybridTier(getHybridTier(hybrid.id))
      } else {
        const total = result.sweetness + result.yield + result.resistance
        if (total > existing.bestTotalStats) {
          existing.bestTotalStats = total
        }
      }

      return result
    } else {
      // Eşleşme başarısızsa, ebeveynlerden birinin kopyasını döndür ve bir özelliği biraz düşür
      const source = Math.random() < 0.5 ? a : b
      const statToReduce: ('sweetness' | 'yield' | 'resistance')[] = ['sweetness', 'yield', 'resistance']
      const randomStat = statToReduce[Math.floor(Math.random() * 3)]!

      const failed: SeedGenetics = {
        ...source,
        id: generateGeneticsId(),
        [randomStat]: clampStat(source[randomStat] - 5)
      } as SeedGenetics

      if (hybrid) {
        addLog(
          `Melezleme başarısız: ebeveyn ortalama tatlılığı ${Math.round(avgSweetness)} (gereken ≥${hybrid.minSweetness}), ortalama verimi ${Math.round(avgYield)} (gereken ≥${hybrid.minYield}). Önce aynı tür ıslahıyla özellikleri yükseltin.`
        )
      } else {
        addLog('Bu iki tür birbirine tutmadı, geriye bir tohum kaldı.')
      }

      return failed
    }
  }

  // === Günlük güncelleme ===

  const dailyUpdate = (): void => {
    for (const slot of stations.value) {
      if (slot.parentA && slot.parentB && !slot.ready) {
        slot.daysProcessed++
        if (slot.daysProcessed >= slot.totalDays) {
          const isCrossBreed = slot.parentA.cropId !== slot.parentB.cropId
          slot.result = breedSeeds(slot.parentA, slot.parentB)
          slot.ready = true
          const crop = getCropById(slot.result.cropId)
          const stars = getStarRating(slot.result)
          if (isCrossBreed && slot.result.isHybrid) {
            addLog(`Melezleme başarılı: ${crop?.name ?? slot.result.cropId} (${stars} yıldız)! Kayıt defterine işlendi.`)
          } else if (isCrossBreed) {
            addLog(`Melezleme tam tutmadı, ${crop?.name ?? slot.result.cropId} tohumu elde edildi (${stars} yıldız).`)
          } else {
            addLog(`Islah tamamlandı: ${crop?.name ?? slot.result.cropId} (${stars} yıldız).`)
          }
          const achievementStore = useAchievementStore()
          achievementStore.recordBreeding()
        }
      }
    }
  }

  /** Melez tohumun ekildiğini kaydet */
  const recordHybridGrown = (hybridId: string): void => {
    const entry = compendium.value.find(e => e.hybridId === hybridId)
    if (entry) {
      entry.timesGrown++
    }
  }

  // === Serileştirme ===

  const serialize = () => ({
    breedingBox: breedingBox.value.map(s => ({
      genetics: s.genetics,
      label: s.label
    })),
    stations: stations.value.map(s => ({
      parentA: s.parentA,
      parentB: s.parentB,
      daysProcessed: s.daysProcessed,
      totalDays: s.totalDays,
      result: s.result,
      ready: s.ready
    })),
    stationCount: stationCount.value,
    seedBoxLevel: seedBoxLevel.value,
    compendium: compendium.value,
    unlocked: unlocked.value
  })

  const deserialize = (data: any) => {
    breedingBox.value = (data.breedingBox ?? []).map((s: any) => ({
      genetics: s.genetics,
      label: s.label ?? makeSeedLabel(s.genetics)
    }))
    stations.value = (data.stations ?? []).map((s: any) => ({
      parentA: s.parentA ?? null,
      parentB: s.parentB ?? null,
      daysProcessed: s.daysProcessed ?? 0,
      totalDays: s.totalDays ?? BREEDING_DAYS,
      result: s.result ?? null,
      ready: s.ready ?? false
    }))
    stationCount.value = data.stationCount ?? 0
    seedBoxLevel.value = data.seedBoxLevel ?? 0
    compendium.value = data.compendium ?? []
    unlocked.value = data.unlocked ?? false
  }

  const reset = () => {
    breedingBox.value = []
    stations.value = []
    stationCount.value = 0
    seedBoxLevel.value = 0
    compendium.value = []
    unlocked.value = false
  }

  return {
    // Durum
    breedingBox,
    stations,
    stationCount,
    seedBoxLevel,
    compendium,
    unlocked,
    // Hesaplamalar
    boxCount,
    boxFull,
    maxSeedBox,
    // Yöntemler
    addToBox,
    removeFromBox,
    trySeedMakerGeneticSeed,
    craftStation,
    canCraftStation,
    getNextSeedBoxUpgrade,
    canUpgradeSeedBox,
    upgradeSeedBox,
    startBreeding,
    collectResult,
    dailyUpdate,
    recordHybridGrown,
    // Serileştirme
    serialize,
    deserialize,
    reset
  }
})
