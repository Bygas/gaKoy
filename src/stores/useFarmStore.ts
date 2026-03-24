import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { FarmPlot, FarmSize, Season, Quality } from '@/types'
import type { SprinklerType, FertilizerType, PlantedFruitTree, FruitTreeType, WildTreeType, PlantedWildTree } from '@/types'
import type { SeedGenetics } from '@/types/breeding'
import { getCropById } from '@/data'
import { SPRINKLERS, getFertilizerById } from '@/data/processing'
import { FRUIT_TREE_DEFS, MAX_FRUIT_TREES } from '@/data/fruitTrees'
import { MAX_WILD_TREES, getWildTreeDef } from '@/data/wildTrees'
import { GREENHOUSE_PLOT_COUNT } from '@/data/buildings'
import { useWalletStore } from './useWalletStore'
import { useGameStore } from './useGameStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'

/** Yerleştirilmiş suluk */
export interface PlacedSprinkler {
  id: string
  type: SprinklerType
  plotId: number
}

/** Başlangıç tarlalarını oluştur */
const createPlots = (size: FarmSize): FarmPlot[] => {
  const total = size * size
  return Array.from({ length: total }, (_, i) => ({
    id: i,
    state: 'wasteland' as const,
    cropId: null,
    growthDays: 0,
    watered: false,
    unwateredDays: 0,
    fertilizer: null,
    harvestCount: 0,
    giantCropGroup: null,
    seedGenetics: null,
    infested: false,
    infestedDays: 0,
    weedy: false,
    weedyDays: 0
  }))
}

export const useFarmStore = defineStore('farm', () => {
  const farmSize = ref<FarmSize>(4)
  const plots = ref<FarmPlot[]>(createPlots(4))
  const sprinklers = ref<PlacedSprinkler[]>([])
  const fruitTrees = ref<PlantedFruitTree[]>([])
  const greenhousePlots = ref<FarmPlot[]>([])
  const greenhouseLevel = ref(0)
  const wildTrees = ref<PlantedWildTree[]>([])
  const nextFruitTreeId = ref(0)
  const nextWildTreeId = ref(0)
  const lightningRods = ref(0)
  const scarecrows = ref(0)
  const giantCropCounter = ref(0)
  const tilledPlots = computed(() => plots.value.filter(p => p.state !== 'wasteland'))
  const harvestableCount = computed(() => plots.value.filter(p => p.state === 'harvestable').length)

  /** Yeni oyun için çiftliği belirli ölçüde sıfırla */
  const resetFarm = (size: FarmSize) => {
    farmSize.value = size
    plots.value = createPlots(size)
    sprinklers.value = []
    fruitTrees.value = []
    greenhousePlots.value = []
    wildTrees.value = []
    nextFruitTreeId.value = 0
    nextWildTreeId.value = 0
  }

  /** Toprağı belle */
  const tillPlot = (plotId: number): boolean => {
    const plot = plots.value[plotId]
    if (!plot || plot.state !== 'wasteland') return false
    plot.state = 'tilled'
    return true
  }

  /** Ekin dik */
  const plantCrop = (plotId: number, cropId: string): boolean => {
    const plot = plots.value[plotId]
    if (!plot || plot.state !== 'tilled') return false
    const crop = getCropById(cropId)
    if (!crop) return false
    plot.state = 'planted'
    plot.cropId = cropId
    plot.growthDays = 0
    plot.watered = getAllWateredBySprinklers().has(plotId) || useGameStore().isRainy
    plot.unwateredDays = 0
    plot.giantCropGroup = null
    plot.seedGenetics = null
    plot.infested = false
    plot.infestedDays = 0
    plot.weedy = false
    plot.weedyDays = 0
    return true
  }

  /** Islah tohumu ek */
  const plantGeneticSeed = (plotId: number, genetics: SeedGenetics): boolean => {
    const plot = plots.value[plotId]
    if (!plot || plot.state !== 'tilled') return false
    const crop = getCropById(genetics.cropId)
    if (!crop) return false
    plot.state = 'planted'
    plot.cropId = genetics.cropId
    plot.growthDays = 0
    plot.watered = getAllWateredBySprinklers().has(plotId) || useGameStore().isRainy
    plot.unwateredDays = 0
    plot.giantCropGroup = null
    plot.seedGenetics = genetics
    plot.infested = false
    plot.infestedDays = 0
    plot.weedy = false
    plot.weedyDays = 0
    return true
  }

  /** Sula */
  const waterPlot = (plotId: number): boolean => {
    const plot = plots.value[plotId]
    if (!plot || (plot.state !== 'planted' && plot.state !== 'growing')) return false
    if (plot.watered) return false
    plot.watered = true
    plot.unwateredDays = 0
    return true
  }

  /** Hasat et, ekin kimliğini döndür */
  const harvestPlot = (plotId: number): { cropId: string | null; genetics: SeedGenetics | null } => {
    const plot = plots.value[plotId]
    if (!plot || plot.state !== 'harvestable') return { cropId: null, genetics: null }
    const cropId = plot.cropId
    const crop = cropId ? getCropById(cropId) : null
    const genetics = plot.seedGenetics

    // Çok ürünlü ekinler
    if (crop && crop.regrowth && crop.regrowthDays) {
      plot.harvestCount++
      if (crop.maxHarvests && plot.harvestCount >= crop.maxHarvests) {
        plot.state = 'tilled'
        plot.cropId = null
        plot.growthDays = 0
        plot.watered = false
        plot.unwateredDays = 0
        plot.harvestCount = 0
        plot.fertilizer = null
        plot.giantCropGroup = null
        plot.seedGenetics = null
        plot.infested = false
        plot.infestedDays = 0
        plot.weedy = false
        plot.weedyDays = 0
      } else {
        plot.state = 'growing'
        plot.growthDays = crop.growthDays - crop.regrowthDays
        plot.watered = getAllWateredBySprinklers().has(plotId) || useGameStore().isRainy
        plot.unwateredDays = 0
        plot.giantCropGroup = null
      }
    } else {
      plot.state = 'tilled'
      plot.cropId = null
      plot.growthDays = 0
      plot.watered = false
      plot.unwateredDays = 0
      plot.fertilizer = null
      plot.harvestCount = 0
      plot.giantCropGroup = null
      plot.seedGenetics = null
      plot.infested = false
      plot.infestedDays = 0
      plot.weedy = false
      plot.weedyDays = 0
    }

    return { cropId, genetics }
  }

  /** Ekini sök: toprağı bellenmiş hâle döndürür */
  const removeCrop = (plotId: number): { cropId: string | null } => {
    const plot = plots.value[plotId]
    if (!plot) return { cropId: null }
    if (plot.state !== 'planted' && plot.state !== 'growing' && plot.state !== 'harvestable') {
      return { cropId: null }
    }
    const cropId = plot.cropId
    plot.state = 'tilled'
    plot.cropId = null
    plot.growthDays = 0
    plot.watered = false
    plot.unwateredDays = 0
    plot.harvestCount = 0
    plot.giantCropGroup = null
    plot.seedGenetics = null
    plot.infested = false
    plot.infestedDays = 0
    plot.weedy = false
    plot.weedyDays = 0
    return { cropId }
  }

  /** Haşereyi temizle */
  const curePest = (plotId: number): boolean => {
    const plot = plots.value[plotId]
    if (!plot || !plot.infested) return false
    plot.infested = false
    plot.infestedDays = 0
    return true
  }

  /** Otu temizle */
  const clearWeed = (plotId: number): boolean => {
    const plot = plots.value[plotId]
    if (!plot || !plot.weedy) return false
    plot.weedy = false
    plot.weedyDays = 0
    return true
  }

  // === Suluklar ===

  /** Suluğun suladığı tarla gözlerini getir */
  const getSprinklerCoverage = (plotId: number, range: number): number[] => {
    const size = farmSize.value
    const row = Math.floor(plotId / size)
    const col = plotId % size
    const covered: number[] = []

    if (range === 4) {
      // Dört yön
      const offsets = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ]
      for (const [dr, dc] of offsets) {
        const nr = row + dr!,
          nc = col + dc!
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          covered.push(nr * size + nc)
        }
      }
    } else if (range === 8) {
      // Çevredeki sekiz göz
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = row + dr,
            nc = col + dc
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            covered.push(nr * size + nc)
          }
        }
      }
    } else if (range === 24) {
      // 5×5 alan
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (dr === 0 && dc === 0) continue
          const nr = row + dr,
            nc = col + dc
          if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            covered.push(nr * size + nc)
          }
        }
      }
    }
    return covered
  }

  /** Suluk yerleştir */
  const placeSprinkler = (plotId: number, sprinklerType: SprinklerType): boolean => {
    if (sprinklers.value.some(s => s.plotId === plotId)) return false
    const plot = plots.value[plotId]
    if (!plot) return false
    sprinklers.value.push({
      id: `${sprinklerType}_${plotId}`,
      type: sprinklerType,
      plotId
    })
    return true
  }

  /** Suluğu kaldır */
  const removeSprinkler = (plotId: number): SprinklerType | null => {
    const idx = sprinklers.value.findIndex(s => s.plotId === plotId)
    if (idx === -1) return null
    const type = sprinklers.value[idx]!.type
    sprinklers.value.splice(idx, 1)
    return type
  }

  /** Tüm sulukların suladığı tarla gözlerini getir */
  const getAllWateredBySprinklers = (): Set<number> => {
    const watered = new Set<number>()
    for (const s of sprinklers.value) {
      const def = SPRINKLERS.find(d => d.id === s.type)
      if (!def) continue
      watered.add(s.plotId)
      for (const pid of getSprinklerCoverage(s.plotId, def.range)) {
        watered.add(pid)
      }
    }
    return watered
  }

  // === Gübre ===

  /** Gübre serp */
  const applyFertilizer = (plotId: number, fertilizerType: FertilizerType): boolean => {
    const plot = plots.value[plotId]
    if (!plot) return false
    if (plot.state === 'wasteland') return false
    if (plot.fertilizer) return false
    plot.fertilizer = fertilizerType
    return true
  }

  /** Bereketli yurt çiftliği: mevsim başında tüm bellenmiş ama gübresiz gözlere temel gübre ver */
  const applyFertileSoil = (): number => {
    let count = 0
    for (const plot of plots.value) {
      if (plot.state !== 'wasteland' && !plot.fertilizer) {
        plot.fertilizer = 'basic_fertilizer'
        count++
      }
    }
    for (const plot of greenhousePlots.value) {
      if (plot.state !== 'wasteland' && !plot.fertilizer) {
        plot.fertilizer = 'basic_fertilizer'
        count++
      }
    }
    return count
  }

  /** Ana tarladaki tüm gözleri günlük yenile */
  const dailyUpdate = (isRainy: boolean): { newInfestations: number; pestDeaths: number; newWeeds: number; weedDeaths: number } => {
    const sprinklerWatered = getAllWateredBySprinklers()
    const walletGrowth = useWalletStore().getCropGrowthBonus()
    const gameStore = useGameStore()
    // Kutlu kudret: Bahar soluğu
    const spiritGrowth = gameStore.season === 'spring' ? useHiddenNpcStore().getAbilityValue('tao_yao_2') / 100 : 0
    let newInfestations = 0
    let pestDeaths = 0
    let newWeeds = 0
    let weedDeaths = 0

    for (const plot of plots.value) {
      if (plot.state !== 'planted' && plot.state !== 'growing') continue

      // Haşere bulaşmışsa büyümez
      if (plot.infested) {
        plot.infestedDays++
        if (plot.infestedDays >= 3) {
          plot.state = 'tilled'
          plot.cropId = null
          plot.growthDays = 0
          plot.watered = false
          plot.unwateredDays = 0
          plot.fertilizer = null
          plot.harvestCount = 0
          plot.giantCropGroup = null
          plot.seedGenetics = null
          plot.infested = false
          plot.infestedDays = 0
          plot.weedy = false
          plot.weedyDays = 0
          pestDeaths++
        }
        continue
      }

      // Ot basmışsa ağır büyür
      if (plot.weedy) {
        plot.weedyDays++
        if (plot.weedyDays >= 4) {
          plot.state = 'tilled'
          plot.cropId = null
          plot.growthDays = 0
          plot.watered = false
          plot.unwateredDays = 0
          plot.fertilizer = null
          plot.harvestCount = 0
          plot.giantCropGroup = null
          plot.seedGenetics = null
          plot.infested = false
          plot.infestedDays = 0
          plot.weedy = false
          plot.weedyDays = 0
          weedDeaths++
          continue
        }
      }

      // Yağmur yahut suluk
      if (isRainy || sprinklerWatered.has(plot.id)) {
        plot.watered = true
        plot.unwateredDays = 0
      }

      // Sulama hesabı
      if (plot.watered) {
        const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
        const speedup = (fertDef?.growthSpeedup ?? 0) + walletGrowth + spiritGrowth
        plot.growthDays += 1
        const crop = getCropById(plot.cropId!)
        if (crop) {
          const effectiveDays = Math.max(1, Math.floor(crop.growthDays * (1 - speedup)))
          if (plot.growthDays >= effectiveDays) {
            plot.state = 'harvestable'
          } else if (plot.state === 'planted') {
            plot.state = 'growing'
          }
        }
      } else {
        // Dayanıklılık kuraklığı yavaşlatır
        const resistanceFactor = plot.seedGenetics ? 1 - plot.seedGenetics.resistance / 100 : 1
        plot.unwateredDays += resistanceFactor
        if (plot.unwateredDays >= 2) {
          plot.state = 'tilled'
          plot.cropId = null
          plot.growthDays = 0
          plot.unwateredDays = 0
          plot.fertilizer = null
          plot.harvestCount = 0
          plot.giantCropGroup = null
          plot.seedGenetics = null
          plot.infested = false
          plot.infestedDays = 0
          plot.weedy = false
          plot.weedyDays = 0
        }
      }

      // Gün sonu sulama sıfırlaması
      if (sprinklerWatered.has(plot.id)) {
        // Suluk koruyor
      } else {
        const retainFert = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
        if (retainFert?.retainChance && Math.random() < retainFert.retainChance) {
          // Nem tutan gübre koruyor
        } else {
          plot.watered = false
        }
      }

      // Haşere bulaşma hesabı
      if (!plot.infested && plot.giantCropGroup === null && (plot.state === 'planted' || plot.state === 'growing')) {
        const baseChance = 0.08
        const pestChance = scarecrows.value > 0 ? baseChance * 0.5 : baseChance
        if (Math.random() < pestChance) {
          plot.infested = true
          plot.infestedDays = 0
          newInfestations++
        }
      }

      // Ot sarma hesabı
      if (!plot.weedy && plot.giantCropGroup === null && (plot.state === 'planted' || plot.state === 'growing')) {
        const baseWeedChance = 0.06
        const weedChance = scarecrows.value > 0 ? baseWeedChance * 0.6 : baseWeedChance
        if (Math.random() < weedChance) {
          plot.weedy = true
          plot.weedyDays = 0
          newWeeds++
        }
      }
    }

    return { newInfestations, pestDeaths, newWeeds, weedDeaths }
  }

  const onSeasonChange = (newSeason: Season): { witheredCount: number; reclaimedCount: number } => {
    let witheredCount = 0
    let reclaimedCount = 0

    // Mevsim dönmeden önce boş bellenmiş gözleri işaretle
    const preExistingTilled = new Set(plots.value.filter(p => p.state === 'tilled' && !p.cropId).map(p => p.id))

    // Mevsim dışı ekinler solar
    for (const plot of plots.value) {
      if ((plot.state === 'planted' || plot.state === 'growing' || plot.state === 'harvestable') && plot.cropId) {
        const crop = getCropById(plot.cropId)
        if (crop && !crop.season.includes(newSeason)) {
          plot.state = 'tilled'
          plot.cropId = null
          plot.growthDays = 0
          plot.watered = false
          plot.unwateredDays = 0
          plot.harvestCount = 0
          plot.giantCropGroup = null
          plot.seedGenetics = null
          plot.infested = false
          plot.infestedDays = 0
          plot.weedy = false
          plot.weedyDays = 0
          witheredCount++
        }
      }
    }

    // Önceden boş bellenmiş topraklar boz yurt hâline dönebilir
    for (const plot of plots.value) {
      if (plot.state === 'tilled' && preExistingTilled.has(plot.id)) {
        const revertChance = newSeason === 'spring' ? 0.3 : 0.15
        if (Math.random() < revertChance) {
          plot.state = 'wasteland'
          plot.fertilizer = null
          reclaimedCount++
        }
      }
    }

    return { witheredCount, reclaimedCount }
  }

  /** Gök yarılması: %25 ihtimal, paratoner emer */
  const lightningStrike = (): { hit: boolean; absorbed: boolean; cropName?: string } => {
    if (Math.random() > 0.25) return { hit: false, absorbed: false }

    if (lightningRods.value > 0) {
      return { hit: false, absorbed: true }
    }

    const croppedPlots = plots.value.filter(p => (p.state === 'planted' || p.state === 'growing' || p.state === 'harvestable') && p.cropId)
    if (croppedPlots.length === 0) return { hit: false, absorbed: false }

    const target = croppedPlots[Math.floor(Math.random() * croppedPlots.length)]!
    const crop = getCropById(target.cropId!)
    const cropName = crop?.name ?? 'ekin'

    target.state = 'tilled'
    target.cropId = null
    target.growthDays = 0
    target.watered = false
    target.unwateredDays = 0
    target.harvestCount = 0
    target.giantCropGroup = null
    target.seedGenetics = null
    target.infested = false
    target.infestedDays = 0
    target.weedy = false
    target.weedyDays = 0

    return { hit: true, absorbed: false, cropName }
  }

  /** Karga baskını: korkuluk yoksa %15 ihtimalle bir ekin gider */
  const crowAttack = (): { attacked: boolean; cropName?: string } => {
    if (scarecrows.value > 0) return { attacked: false }
    if (Math.random() > 0.15) return { attacked: false }
    const croppedPlots = plots.value.filter(p => (p.state === 'planted' || p.state === 'growing' || p.state === 'harvestable') && p.cropId)
    if (croppedPlots.length === 0) return { attacked: false }
    const target = croppedPlots[Math.floor(Math.random() * croppedPlots.length)]!
    const crop = getCropById(target.cropId!)
    const cropName = crop?.name ?? 'ekin'
    target.state = 'tilled'
    target.cropId = null
    target.growthDays = 0
    target.watered = false
    target.unwateredDays = 0
    target.harvestCount = 0
    target.giantCropGroup = null
    target.seedGenetics = null
    target.infested = false
    target.infestedDays = 0
    target.weedy = false
    target.weedyDays = 0
    return { attacked: true, cropName }
  }

  /** Dev ekin olup olmayacağını denetle */
  const checkGiantCrops = (): { cropId: string; cropName: string }[] => {
    const size = farmSize.value
    if (size < 4) return []
    const formed: { cropId: string; cropName: string }[] = []
    const maxR = size - 3
    const maxC = size - 3
    for (let r = 0; r <= maxR; r++) {
      for (let c = 0; c <= maxC; c++) {
        const topLeft = plots.value[r * size + c]!
        if (topLeft.state !== 'harvestable' || !topLeft.cropId || topLeft.giantCropGroup !== null) continue
        const crop = getCropById(topLeft.cropId)
        if (!crop || !crop.giantCropEligible) continue
        let allMatch = true
        for (let dr = 0; dr < 3 && allMatch; dr++) {
          for (let dc = 0; dc < 3 && allMatch; dc++) {
            if (dr === 0 && dc === 0) continue
            const p = plots.value[(r + dr) * size + (c + dc)]!
            if (p.state !== 'harvestable' || p.cropId !== topLeft.cropId || p.giantCropGroup !== null) {
              allMatch = false
            }
          }
        }
        if (allMatch && Math.random() < 0.01) {
          giantCropCounter.value++
          const groupId = giantCropCounter.value
          for (let dr = 0; dr < 3; dr++) {
            for (let dc = 0; dc < 3; dc++) {
              plots.value[(r + dr) * size + (c + dc)]!.giantCropGroup = groupId
            }
          }
          formed.push({ cropId: topLeft.cropId, cropName: crop.name })
        }
      }
    }
    return formed
  }

  /** Dev ekini biç */
  const harvestGiantCrop = (plotId: number): { cropId: string; quantity: number } | null => {
    const plot = plots.value[plotId]
    if (!plot || plot.state !== 'harvestable' || plot.giantCropGroup === null) return null
    const groupId = plot.giantCropGroup
    const cropId = plot.cropId
    if (!cropId) return null
    const groupPlots = plots.value.filter(p => p.giantCropGroup === groupId)
    for (const gp of groupPlots) {
      gp.state = 'tilled'
      gp.cropId = null
      gp.growthDays = 0
      gp.watered = false
      gp.unwateredDays = 0
      gp.fertilizer = null
      gp.harvestCount = 0
      gp.giantCropGroup = null
      gp.seedGenetics = null
      gp.infested = false
      gp.infestedDays = 0
      gp.weedy = false
      gp.weedyDays = 0
    }
    return { cropId, quantity: groupPlots.length * 2 }
  }

  /** Çiftliği büyüt */
  const expandFarm = (): FarmSize | null => {
    const sizes: FarmSize[] = [4, 6, 8]
    const currentIndex = sizes.indexOf(farmSize.value)
    if (currentIndex >= sizes.length - 1) return null
    const newSize = sizes[currentIndex + 1]!
    const oldPlots = [...plots.value]
    const newPlots = createPlots(newSize)
    for (let row = 0; row < farmSize.value; row++) {
      for (let col = 0; col < farmSize.value; col++) {
        const oldIndex = row * farmSize.value + col
        const newIndex = row * newSize + col
        const oldPlot = oldPlots[oldIndex]
        if (oldPlot) {
          newPlots[newIndex] = { ...oldPlot, id: newIndex }
        }
      }
    }
    // Suluk yerlerini yeniden eşle
    const oldSize = farmSize.value
    for (const s of sprinklers.value) {
      const oldRow = Math.floor(s.plotId / oldSize)
      const oldCol = s.plotId % oldSize
      s.plotId = oldRow * newSize + oldCol
      s.id = `${s.type}_${s.plotId}`
    }
    farmSize.value = newSize
    plots.value = newPlots
    return newSize
  }

  // === Meyve ağaçları ===

  /** Meyve ağacı dik */
  const plantFruitTree = (treeType: FruitTreeType): boolean => {
    if (fruitTrees.value.length >= MAX_FRUIT_TREES) return false
    fruitTrees.value.push({
      id: nextFruitTreeId.value++,
      type: treeType,
      growthDays: 0,
      mature: false,
      yearAge: 0,
      todayFruit: false
    })
    return true
  }

  /** Meyve ağaçlarını günlük yenile */
  const dailyFruitTreeUpdate = (currentSeason: Season): { fruits: { fruitId: string; quality: Quality }[] } => {
    const results: { fruitId: string; quality: Quality }[] = []
    const hiddenNpcStore2 = useHiddenNpcStore()
    const extraFruit = hiddenNpcStore2.isAbilityActive('tao_yao_1')
    const spiritPeachActive = hiddenNpcStore2.isAbilityActive('tao_yao_3')

    for (const tree of fruitTrees.value) {
      tree.growthDays++
      tree.todayFruit = false
      if (!tree.mature && tree.growthDays >= 28) {
        tree.mature = true
      }
      if (tree.mature) {
        const def = FRUIT_TREE_DEFS.find(d => d.type === tree.type)
        if (def && def.fruitSeason === currentSeason) {
          const quality = getFruitQuality(tree.yearAge)
          const fruitId = tree.type === 'peach_tree' && spiritPeachActive && Math.random() < 0.1 ? 'spirit_peach' : def.fruitId
          results.push({ fruitId, quality })
          if (extraFruit) results.push({ fruitId, quality })
          tree.todayFruit = true
        }
      }
    }
    return { fruits: results }
  }

  /** Meyve niteliği */
  const getFruitQuality = (yearAge: number): Quality => {
    if (yearAge >= 3) return 'supreme'
    if (yearAge >= 2) return 'excellent'
    if (yearAge >= 1) return 'fine'
    return 'normal'
  }

  /** Meyve ağacını kes */
  const removeFruitTree = (treeId: number): number => {
    const idx = fruitTrees.value.findIndex(t => t.id === treeId)
    if (idx === -1) return 0
    const tree = fruitTrees.value[idx]!
    fruitTrees.value.splice(idx, 1)
    return tree.mature ? 5 : 2
  }

  /** Meyve ağacı mevsim yenilemesi */
  const fruitTreeSeasonUpdate = (isNewYear: boolean): void => {
    for (const tree of fruitTrees.value) {
      if (tree.mature && isNewYear) tree.yearAge++
      tree.todayFruit = false
    }
  }

  // === Yaban ağaçları ===

  /** Yaban ağacı dik */
  const plantWildTree = (treeType: WildTreeType): boolean => {
    if (wildTrees.value.length >= MAX_WILD_TREES) return false
    wildTrees.value.push({
      id: nextWildTreeId.value++,
      type: treeType,
      growthDays: 0,
      mature: false,
      hasTapper: false,
      tapDaysElapsed: 0,
      tapReady: false,
      chopCount: 0
    })
    return true
  }

  /** Reçine kabı tak */
  const attachTapper = (treeId: number): boolean => {
    const tree = wildTrees.value.find(t => t.id === treeId)
    if (!tree || !tree.mature || tree.hasTapper) return false
    tree.hasTapper = true
    tree.tapDaysElapsed = 0
    tree.tapReady = false
    return true
  }

  /** Reçine kabı ürününü topla */
  const collectTapProduct = (treeId: number): string | null => {
    const tree = wildTrees.value.find(t => t.id === treeId)
    if (!tree || !tree.tapReady) return null
    const def = getWildTreeDef(tree.type)
    if (!def) return null
    tree.tapReady = false
    tree.tapDaysElapsed = 0
    return def.tapProduct
  }

  /** Balta vur */
  const chopWildTree = (treeId: number): { removed: boolean } => {
    const tree = wildTrees.value.find(t => t.id === treeId)
    if (!tree) return { removed: false }
    tree.chopCount++
    if (tree.chopCount >= 3) {
      wildTrees.value = wildTrees.value.filter(t => t.id !== treeId)
      return { removed: true }
    }
    return { removed: false }
  }

  /** Yaban ağaçlarını günlük yenile */
  const dailyWildTreeUpdate = (): { products: { treeId: number; productId: string; productName: string }[] } => {
    const readyProducts: { treeId: number; productId: string; productName: string }[] = []
    for (const tree of wildTrees.value) {
      if (!tree.mature) {
        tree.growthDays++
        const def = getWildTreeDef(tree.type)
        if (def && tree.growthDays >= def.growthDays) {
          tree.mature = true
        }
      }
      if (tree.hasTapper && tree.mature && !tree.tapReady) {
        tree.tapDaysElapsed++
        const def = getWildTreeDef(tree.type)
        if (def && tree.tapDaysElapsed >= def.tapCycleDays) {
          tree.tapReady = true
          readyProducts.push({ treeId: tree.id, productId: def.tapProduct, productName: def.tapProductName })
        }
      }
    }
    return { products: readyProducts }
  }

  // === Sera ===

  /** Sera gözlerini hazırla */
  const initGreenhouse = (): void => {
    if (greenhousePlots.value.length > 0) return
    greenhousePlots.value = Array.from({ length: GREENHOUSE_PLOT_COUNT }, (_, i) => ({
      id: i,
      state: 'tilled' as const,
      cropId: null,
      growthDays: 0,
      watered: false,
      unwateredDays: 0,
      fertilizer: null,
      harvestCount: 0,
      giantCropGroup: null,
      seedGenetics: null,
      infested: false,
      infestedDays: 0,
      weedy: false,
      weedyDays: 0
    }))
  }

  /** Seraya ekin dik */
  const greenhousePlantCrop = (plotId: number, cropId: string): boolean => {
    const plot = greenhousePlots.value[plotId]
    if (!plot || plot.state !== 'tilled') return false
    const crop = getCropById(cropId)
    if (!crop) return false
    plot.state = 'planted'
    plot.cropId = cropId
    plot.growthDays = 0
    plot.watered = false
    plot.unwateredDays = 0
    return true
  }

  /** Serada hasat et */
  const greenhouseHarvestPlot = (plotId: number): string | null => {
    const plot = greenhousePlots.value[plotId]
    if (!plot || plot.state !== 'harvestable') return null
    const cropId = plot.cropId
    const crop = cropId ? getCropById(cropId) : null

    if (crop && crop.regrowth && crop.regrowthDays) {
      plot.harvestCount++
      if (crop.maxHarvests && plot.harvestCount >= crop.maxHarvests) {
        plot.state = 'tilled'
        plot.cropId = null
        plot.growthDays = 0
        plot.watered = false
        plot.unwateredDays = 0
        plot.harvestCount = 0
        plot.fertilizer = null
      } else {
        plot.state = 'growing'
        plot.growthDays = crop.growthDays - crop.regrowthDays
        plot.watered = false
        plot.unwateredDays = 0
      }
    } else {
      plot.state = 'tilled'
      plot.cropId = null
      plot.growthDays = 0
      plot.watered = false
      plot.unwateredDays = 0
      plot.fertilizer = null
      plot.harvestCount = 0
    }
    return cropId
  }

  /** Serayı günlük yenile */
  const greenhouseDailyUpdate = (): void => {
    const walletGrowth = useWalletStore().getCropGrowthBonus()
    for (const plot of greenhousePlots.value) {
      if (plot.state !== 'planted' && plot.state !== 'growing') continue
      plot.watered = true
      const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
      const speedup = (fertDef?.growthSpeedup ?? 0) + walletGrowth
      plot.growthDays += 1
      const crop = getCropById(plot.cropId!)
      if (crop) {
        const effectiveDays = Math.max(1, Math.floor(crop.growthDays * (1 - speedup)))
        if (plot.growthDays >= effectiveDays) {
          plot.state = 'harvestable'
        } else if (plot.state === 'planted') {
          plot.state = 'growing'
        }
      }
      plot.watered = false
    }
  }

  /** Serayı büyüt */
  const upgradeGreenhouse = (newPlotCount: number): boolean => {
    const current = greenhousePlots.value.length
    if (newPlotCount <= current) return false
    for (let i = current; i < newPlotCount; i++) {
      greenhousePlots.value.push({
        id: i,
        state: 'tilled' as const,
        cropId: null,
        growthDays: 0,
        watered: false,
        unwateredDays: 0,
        fertilizer: null,
        harvestCount: 0,
        giantCropGroup: null,
        seedGenetics: null,
        infested: false,
        infestedDays: 0,
        weedy: false,
        weedyDays: 0
      })
    }
    greenhouseLevel.value++
    return true
  }

  /** Serada toplu hasat */
  const greenhouseBatchHarvest = (): { cropId: string }[] => {
    const results: { cropId: string }[] = []
    for (let i = 0; i < greenhousePlots.value.length; i++) {
      const plot = greenhousePlots.value[i]!
      if (plot.state !== 'harvestable') continue
      const cropId = greenhouseHarvestPlot(i)
      if (cropId) results.push({ cropId })
    }
    return results
  }

  const serialize = () => {
    return {
      farmSize: farmSize.value,
      plots: plots.value,
      sprinklers: sprinklers.value,
      fruitTrees: fruitTrees.value,
      greenhousePlots: greenhousePlots.value,
      greenhouseLevel: greenhouseLevel.value,
      wildTrees: wildTrees.value,
      nextFruitTreeId: nextFruitTreeId.value,
      nextWildTreeId: nextWildTreeId.value,
      lightningRods: lightningRods.value,
      scarecrows: scarecrows.value,
      giantCropCounter: giantCropCounter.value
    }
  }

  /** Eski kayıt gübre adlarını yenile */
  const migrateFertilizer = (f: string | null): FertilizerType | null => {
    if (!f) return null
    if (f === 'compost') return 'basic_fertilizer'
    if (f === 'bone_meal') return 'deluxe_speed_gro'
    return f as FertilizerType
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    farmSize.value = data.farmSize as FarmSize
    plots.value = data.plots.map(p => ({
      ...p,
      fertilizer: migrateFertilizer(p.fertilizer),
      harvestCount: (p as any).harvestCount ?? 0,
      giantCropGroup: (p as any).giantCropGroup ?? null,
      seedGenetics: (p as any).seedGenetics ?? null,
      infested: (p as any).infested ?? false,
      infestedDays: (p as any).infestedDays ?? 0,
      weedy: (p as any).weedy ?? false,
      weedyDays: (p as any).weedyDays ?? 0
    }))
    sprinklers.value = (data as any).sprinklers ?? []
    fruitTrees.value = ((data as any).fruitTrees ?? []).map((t: any) => ({
      ...t,
      yearAge: t.yearAge ?? t.seasonAge ?? 0
    }))
    nextFruitTreeId.value =
      (data as any).nextFruitTreeId ?? (fruitTrees.value.length > 0 ? Math.max(...fruitTrees.value.map(t => t.id)) + 1 : 0)
    wildTrees.value = ((data as any).wildTrees ?? []).map((t: any) => ({
      ...t,
      chopCount: t.chopCount ?? 0
    }))
    nextWildTreeId.value =
      (data as any).nextWildTreeId ?? (wildTrees.value.length > 0 ? Math.max(...wildTrees.value.map(t => t.id)) + 1 : 0)
    greenhousePlots.value = ((data as any).greenhousePlots ?? []).map((p: any) => ({
      ...p,
      fertilizer: migrateFertilizer(p.fertilizer),
      harvestCount: p.harvestCount ?? 0,
      giantCropGroup: p.giantCropGroup ?? null,
      seedGenetics: p.seedGenetics ?? null,
      infested: p.infested ?? false,
      infestedDays: p.infestedDays ?? 0
    }))
    greenhouseLevel.value = (data as any).greenhouseLevel ?? 0
    lightningRods.value = (data as any).lightningRods ?? 0
    scarecrows.value = (data as any).scarecrows ?? 0
    giantCropCounter.value = (data as any).giantCropCounter ?? 0
  }

  return {
    farmSize,
    plots,
    sprinklers,
    fruitTrees,
    greenhousePlots,
    tilledPlots,
    harvestableCount,
    resetFarm,
    tillPlot,
    plantCrop,
    plantGeneticSeed,
    waterPlot,
    harvestPlot,
    removeCrop,
    curePest,
    clearWeed,
    getSprinklerCoverage,
    placeSprinkler,
    removeSprinkler,
    getAllWateredBySprinklers,
    applyFertilizer,
    applyFertileSoil,
    dailyUpdate,
    onSeasonChange,
    lightningStrike,
    lightningRods,
    scarecrows,
    crowAttack,
    checkGiantCrops,
    harvestGiantCrop,
    expandFarm,
    plantFruitTree,
    removeFruitTree,
    dailyFruitTreeUpdate,
    fruitTreeSeasonUpdate,
    wildTrees,
    plantWildTree,
    attachTapper,
    collectTapProduct,
    chopWildTree,
    dailyWildTreeUpdate,
    initGreenhouse,
    greenhouseLevel,
    greenhousePlantCrop,
    greenhouseHarvestPlot,
    greenhouseDailyUpdate,
    upgradeGreenhouse,
    greenhouseBatchHarvest,
    serialize,
    deserialize
  }
})
