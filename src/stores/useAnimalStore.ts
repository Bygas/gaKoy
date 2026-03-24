import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { AnimalBuildingType, AnimalType, Animal, Quality, PetState, PetType, IncubationState } from '@/types'
import {
  ANIMAL_BUILDINGS,
  ANIMAL_DEFS,
  HAY_ITEM_ID,
  getBuildingUpgrade,
  INCUBATION_MAP,
  PREMIUM_FEED_ID,
  NOURISHING_FEED_ID,
  VITALITY_FEED_ID
} from '@/data'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { useGameStore } from './useGameStore'
import { useSkillStore } from './useSkillStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'
import { getCombinedItemCount, removeCombinedItem } from '@/composables/useCombinedInventory'

export const useAnimalStore = defineStore('animal', () => {
  const buildings = ref<{ type: AnimalBuildingType; built: boolean; level: number }[]>([
    { type: 'coop', built: false, level: 0 },
    { type: 'barn', built: false, level: 0 },
    { type: 'stable', built: false, level: 0 }
  ])
  const animals = ref<Animal[]>([])

  /** Kümes kuluçka durumu (aynı anda en fazla 1 adet) */
  const incubating = ref<IncubationState | null>(null)

  /** Ahır kuluçka durumu (aynı anda en fazla 1 adet, barn level ≥ 2) */
  const barnIncubating = ref<IncubationState | null>(null)

  /** Evcil hayvan durumu */
  const pet = ref<PetState | null>(null)

  /** Bugün otlatma yapıldı mı */
  const grazedToday = ref(false)

  /** Otomatik sevme düzeneği takılı yapı türleri */
  const autoPetterBuildings = ref<AnimalBuildingType[]>([])

  const coopBuilt = computed(() => buildings.value.find(b => b.type === 'coop')?.built ?? false)
  const barnBuilt = computed(() => buildings.value.find(b => b.type === 'barn')?.built ?? false)
  const stableBuilt = computed(() => buildings.value.find(b => b.type === 'stable')?.built ?? false)

  const coopAnimals = computed(() =>
    animals.value.filter(a => {
      const def = ANIMAL_DEFS.find(d => d.type === a.type)
      return def?.building === 'coop'
    })
  )

  const barnAnimals = computed(() =>
    animals.value.filter(a => {
      const def = ANIMAL_DEFS.find(d => d.type === a.type)
      return def?.building === 'barn'
    })
  )

  /** Atı getir */
  const getHorse = computed(() => animals.value.find(a => a.type === 'horse') ?? null)

  /** At var mı */
  const hasHorse = computed(() => getHorse.value !== null)

  /** Hayvan barınağı inşa et */
  const buildBuilding = (type: AnimalBuildingType): boolean => {
    const playerStore = usePlayerStore()

    const b = buildings.value.find(b => b.type === type)
    if (!b || b.built) return false

    const def = ANIMAL_BUILDINGS.find(d => d.type === type)
    if (!def) return false

    // Malzemeleri denetle
    for (const mat of def.materialCost) {
      if (getCombinedItemCount(mat.itemId) < mat.quantity) return false
    }
    // Parayı denetle
    if (!playerStore.spendMoney(def.cost)) return false

    // Malzemeleri düş
    for (const mat of def.materialCost) {
      removeCombinedItem(mat.itemId, mat.quantity)
    }

    b.built = true
    b.level = 1
    return true
  }

  /** Hayvan barınağını yükselt */
  const upgradeBuilding = (type: AnimalBuildingType): boolean => {
    const playerStore = usePlayerStore()

    const b = buildings.value.find(b => b.type === type)
    if (!b || !b.built || b.level >= 3) return false

    const upgrade = getBuildingUpgrade(type, b.level + 1)
    if (!upgrade) return false

    for (const mat of upgrade.materialCost) {
      if (getCombinedItemCount(mat.itemId) < mat.quantity) return false
    }
    if (!playerStore.spendMoney(upgrade.cost)) return false

    for (const mat of upgrade.materialCost) {
      removeCombinedItem(mat.itemId, mat.quantity)
    }

    b.level++
    return true
  }

  /** Hayvan satın al */
  const buyAnimal = (animalType: AnimalType, customName: string): boolean => {
    const playerStore = usePlayerStore()

    const def = ANIMAL_DEFS.find(d => d.type === animalType)
    if (!def) return false

    // Kapasite denetimi (seviye × 4, ahır sabit 1)
    const building = buildings.value.find(b => b.type === def.building)
    if (!building?.built) return false
    const maxCapacity = def.building === 'stable' ? 1 : building.level * 4
    const currentCount = animals.value.filter(a => {
      const aDef = ANIMAL_DEFS.find(d => d.type === a.type)
      return aDef?.building === def.building
    }).length
    if (currentCount >= maxCapacity) return false

    // Parayı denetle
    if (!playerStore.spendMoney(def.cost)) return false

    animals.value.push({
      id: `${animalType}_${Date.now()}`,
      type: animalType,
      name: customName || def.name,
      friendship: 0,
      mood: 128,
      daysOwned: 0,
      daysSinceProduct: 0,
      wasFed: false,
      fedWith: null,
      wasPetted: false,
      hunger: 0,
      sick: false,
      sickDays: 0
    })
    return true
  }

  /** Tüm hayvanları yemle (belirtilen yem harcanır, at da yem ister; çanta + depodan alınır) */
  const feedAll = (feedId: string = HAY_ITEM_ID): { fedCount: number; noFeedCount: number } => {
    let fedCount = 0
    let noFeedCount = 0
    const unfed = animals.value.filter(a => !a.wasFed)

    for (const animal of unfed) {
      if (removeCombinedItem(feedId, 1)) {
        animal.wasFed = true
        animal.fedWith = feedId
        animal.hunger = 0
        fedCount++
      } else {
        noFeedCount++
      }
    }
    return { fedCount, noFeedCount }
  }

  /** Tüm hayvanları yemlenmiş say (yem harcamaz, sabah yardımcısı/eş ön yemlemesi için) */
  const markAllFed = () => {
    for (const animal of animals.value) {
      if (!animal.wasFed) {
        animal.wasFed = true
        animal.fedWith = HAY_ITEM_ID
        animal.hunger = 0
      }
    }
  }

  /** Hayvanı sev */
  const petAnimal = (animalId: string): boolean => {
    const animal = animals.value.find(a => a.id === animalId)
    if (!animal || animal.wasPetted) return false
    animal.wasPetted = true
    const coopmasterBonus = useSkillStore().getSkill('farming').perk10 === 'coopmaster' ? 1.5 : 1.0
    animal.friendship = Math.min(1000, animal.friendship + Math.floor(5 * coopmasterBonus))
    return true
  }

  /** Tüm hayvanları ve evcil hayvanı tek seferde sev */
  const petAllAnimals = (): number => {
    const coopmasterBonus = useSkillStore().getSkill('farming').perk10 === 'coopmaster' ? 1.5 : 1.0
    let count = 0
    for (const animal of animals.value) {
      if (animal.wasPetted) continue
      animal.wasPetted = true
      animal.friendship = Math.min(1000, animal.friendship + Math.floor(5 * coopmasterBonus))
      count++
    }
    if (pet.value && !pet.value.wasPetted) {
      pet.value.wasPetted = true
      pet.value.friendship = Math.min(1000, pet.value.friendship + 5)
      count++
    }
    return count
  }

  // ============================================================
  // Kuluçka
  // ============================================================

  /** Kümes kuluçkasını başlat (kümes ≥ 2. seviye olmalı, yalnızca coop türü yumurtalar) */
  const startIncubation = (itemId: string): { success: boolean; message: string } => {
    const coopBuilding = buildings.value.find(b => b.type === 'coop')
    if (!coopBuilding?.built || coopBuilding.level < 2) {
      return { success: false, message: 'Kuluçka düzeneğini kullanmak için Büyük Kümes (2. seviye) gerekir.' }
    }
    if (incubating.value) {
      return { success: false, message: 'Kuluçkada zaten bir yumurta var.' }
    }
    const mapping = INCUBATION_MAP[itemId]
    if (!mapping || mapping.building !== 'coop') {
      return { success: false, message: 'Bu nesne kümeste kuluçkaya yatırılamaz.' }
    }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(itemId, 1)) {
      return { success: false, message: 'Çantada bu nesne yok.' }
    }

    // coopmaster uzmanlığı kuluçka süresini yarıya indirir
    const skillStore = useSkillStore()
    const hasCoopmaster = skillStore.getSkill('farming').perk10 === 'coopmaster'
    const days = hasCoopmaster ? Math.ceil(mapping.days / 2) : mapping.days

    incubating.value = { itemId, animalType: mapping.animalType, daysLeft: days }
    const animalDef = ANIMAL_DEFS.find(d => d.type === mapping.animalType)
    return { success: true, message: `${animalDef?.name ?? 'Hayvan'} için kuluçka başladı. Yaklaşık ${days} gün sonra çıkacak.` }
  }

  /** Günlük kümes kuluçka güncellemesi */
  const dailyIncubatorUpdate = (): { hatched?: { type: AnimalType; name: string } } => {
    if (!incubating.value) return {}

    incubating.value.daysLeft--
    if (incubating.value.daysLeft <= 0) {
      const { animalType, itemId } = incubating.value
      const def = ANIMAL_DEFS.find(d => d.type === animalType)

      // Kapasite denetimi
      const building = buildings.value.find(b => b.type === 'coop')
      const maxCapacity = (building?.level ?? 0) * 4
      const currentCount = coopAnimals.value.length

      if (currentCount >= maxCapacity) {
        // Yer doluysa yumurtayı geri ver
        const inventoryStore = useInventoryStore()
        inventoryStore.addItem(itemId, 1)
        incubating.value = null
        return {}
      }

      const count = animals.value.filter(a => a.type === animalType).length
      const name = `${def?.name ?? 'Hayvan'}${count + 1}`
      animals.value.push({
        id: `${animalType}_${Date.now()}`,
        type: animalType,
        name,
        friendship: 0,
        mood: 200,
        daysOwned: 0,
        daysSinceProduct: 0,
        wasFed: false,
        fedWith: null,
        wasPetted: false,
        hunger: 0,
        sick: false,
        sickDays: 0
      })
      incubating.value = null
      return { hatched: { type: animalType, name } }
    }

    return {}
  }

  /** Ahır kuluçkasını başlat (ahır ≥ 2. seviye olmalı, yalnızca barn türü yumurtalar) */
  const startBarnIncubation = (itemId: string): { success: boolean; message: string } => {
    const barnBuilding = buildings.value.find(b => b.type === 'barn')
    if (!barnBuilding?.built || barnBuilding.level < 2) {
      return { success: false, message: 'Kuluçka düzeneğini kullanmak için Büyük Ahır (2. seviye) gerekir.' }
    }
    if (barnIncubating.value) {
      return { success: false, message: 'Ahır kuluçkasında zaten bir yumurta var.' }
    }
    const mapping = INCUBATION_MAP[itemId]
    if (!mapping || mapping.building !== 'barn') {
      return { success: false, message: 'Bu nesne ahırda kuluçkaya yatırılamaz.' }
    }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(itemId, 1)) {
      return { success: false, message: 'Çantada bu nesne yok.' }
    }

    const skillStore = useSkillStore()
    const hasCoopmaster = skillStore.getSkill('farming').perk10 === 'coopmaster'
    const days = hasCoopmaster ? Math.ceil(mapping.days / 2) : mapping.days

    barnIncubating.value = { itemId, animalType: mapping.animalType, daysLeft: days }
    const animalDef = ANIMAL_DEFS.find(d => d.type === mapping.animalType)
    return { success: true, message: `${animalDef?.name ?? 'Hayvan'} için ahırda kuluçka başladı. Yaklaşık ${days} gün sonra çıkacak.` }
  }

  /** Günlük ahır kuluçka güncellemesi */
  const dailyBarnIncubatorUpdate = (): { hatched?: { type: AnimalType; name: string } } => {
    if (!barnIncubating.value) return {}

    barnIncubating.value.daysLeft--
    if (barnIncubating.value.daysLeft <= 0) {
      const { animalType, itemId } = barnIncubating.value
      const def = ANIMAL_DEFS.find(d => d.type === animalType)

      const building = buildings.value.find(b => b.type === 'barn')
      const maxCapacity = (building?.level ?? 0) * 4
      const currentCount = barnAnimals.value.length

      if (currentCount >= maxCapacity) {
        const inventoryStore = useInventoryStore()
        inventoryStore.addItem(itemId, 1)
        barnIncubating.value = null
        return {}
      }

      const count = animals.value.filter(a => a.type === animalType).length
      const name = `${def?.name ?? 'Hayvan'}${count + 1}`
      animals.value.push({
        id: `${animalType}_${Date.now()}`,
        type: animalType,
        name,
        friendship: 0,
        mood: 200,
        daysOwned: 0,
        daysSinceProduct: 0,
        wasFed: false,
        fedWith: null,
        wasPetted: false,
        hunger: 0,
        sick: false,
        sickDays: 0
      })
      barnIncubating.value = null
      return { hatched: { type: animalType, name } }
    }

    return {}
  }

  // ============================================================
  // Evcil hayvan
  // ============================================================

  /** Evcil hayvan sahiplen */
  const adoptPet = (type: PetType, name: string) => {
    pet.value = { type, name, friendship: 0, wasPetted: false }
  }

  /** Evcil hayvanı sev */
  const petThePet = (): boolean => {
    if (!pet.value || pet.value.wasPetted) return false
    pet.value.wasPetted = true
    pet.value.friendship = Math.min(1000, pet.value.friendship + 5)
    return true
  }

  /** Günlük evcil hayvan güncellemesi */
  const dailyPetUpdate = (): { item?: string } => {
    if (!pet.value) return {}

    // Sevilmediyse yakınlık azalır
    if (!pet.value.wasPetted) {
      pet.value.friendship = Math.max(0, pet.value.friendship - 2)
    }
    pet.value.wasPetted = false

    // Yüksek yakınlıkta toplama eşyası getirebilir
    if (pet.value.friendship >= 800 && Math.random() < 0.1) {
      const finds = ['herb', 'wild_berry', 'pine_cone', 'bamboo_shoot', 'wild_mushroom']
      const item = finds[Math.floor(Math.random() * finds.length)]!
      const inventoryStore = useInventoryStore()
      inventoryStore.addItem(item, 1)
      return { item }
    }
    return {}
  }

  // ============================================================
  // Otlatma
  // ============================================================

  /** Otlatma (ilkbahar/yaz/güz yağmursuz günlerde; kışın yalnız yak otlayabilir) */
  const grazeAnimals = (): { success: boolean; count: number; message: string; bonusProducts?: { itemId: string; quality: Quality }[] } => {
    if (grazedToday.value) {
      return { success: false, count: 0, message: 'Bugün otlatma zaten yapıldı.' }
    }

    const gameStore = useGameStore()
    if (gameStore.isRainy) {
      return { success: false, count: 0, message: 'Yağmurlu havada otlatma yapılamaz.' }
    }

    // Yalnız yemlenmiş hayvanlar otlayabilir (at hariç)
    let grazeable: Animal[]
    if (gameStore.season === 'winter') {
      // Kışın yalnız yak otlayabilir
      grazeable = animals.value.filter(a => a.wasFed && a.type === 'yak')
      if (grazeable.length === 0) {
        return { success: false, count: 0, message: 'Kışın yalnız yak otlayabilir, hem de önce yemlenmiş olması gerekir.' }
      }
    } else {
      grazeable = animals.value.filter(a => a.wasFed && a.type !== 'horse')
      if (grazeable.length === 0) {
        return { success: false, count: 0, message: 'Otlatılabilecek yemlenmiş hayvan yok.' }
      }
    }

    grazedToday.value = true
    const bonusProducts: { itemId: string; quality: Quality }[] = []

    for (const animal of grazeable) {
      animal.mood = 255
      animal.friendship = Math.min(1000, animal.friendship + 10)

      // Domuz otlarken fazladan trüf bulur
      if (animal.type === 'pig') {
        bonusProducts.push({ itemId: 'truffle', quality: getAnimalProductQuality(animal.friendship) })
      }
    }

    // Domuzların bulduğu trüfleri doğrudan çantaya ekle
    if (bonusProducts.length > 0) {
      const inventoryStore = useInventoryStore()
      for (const bp of bonusProducts) {
        inventoryStore.addItem(bp.itemId, 1, bp.quality)
      }
    }

    const pigCount = bonusProducts.length
    let message = `${grazeable.length} hayvan çayıra çıkıp keyifle otlandı.`
    if (pigCount > 0) {
      message += ` Domuzlar ${pigCount} adet trüf buldu!`
    }

    return { success: true, count: grazeable.length, message, bonusProducts: bonusProducts.length > 0 ? bonusProducts : undefined }
  }

  /** Açlıktan ölme gün sınırı */
  const HUNGER_DEATH_DAYS = 7
  /** Açlık bunun üstüne çıkarsa hastalanma ihtimali doğar */
  const HUNGER_SICK_THRESHOLD = 3
  /** Günlük hastalanma ihtimali */
  const SICK_CHANCE = 0.3
  /** Uzun süre hastalıktan ölme gün sınırı */
  const SICK_DEATH_DAYS = 5

  /** Günlük güncelleme: ürün toplama, ruh hâli/yakınlık değişimi, açlık/hastalık/ölüm */
  const dailyUpdate = (): { products: { itemId: string; quality: Quality }[]; died: string[]; gotSick: string[]; healed: string[] } => {
    const products: { itemId: string; quality: Quality }[] = []
    const died: string[] = []
    const gotSick: string[] = []
    const healed: string[] = []
    const skillStore = useSkillStore()
    const gameStore = useGameStore()
    const coopmasterBonus = skillStore.getSkill('farming').perk10 === 'coopmaster' ? 1.5 : 1.0
    const hasShepherd = skillStore.getSkill('farming').perk10 === 'shepherd'

    for (const animal of animals.value) {
      animal.daysOwned++
      animal.daysSinceProduct++

      // === Açlık sistemi ===
      if (!animal.wasFed) {
        animal.hunger++
        // Deve yazın açlığa daha dayanıklıdır: açlık artışı yarıya iner
        if (animal.type === 'camel' && gameStore.season === 'summer' && animal.hunger > 1) {
          animal.hunger = Math.max(1, animal.hunger - 1)
        }
      } else {
        // Yemlenince açlık sıfırlanır
        animal.hunger = 0
        // Yemlenince hastalık iyileşebilir: canlılık yemi %100, diğerleri %50
        if (animal.sick) {
          const cureChance = animal.fedWith === VITALITY_FEED_ID ? 1.0 : 0.5
          if (Math.random() < cureChance) {
            animal.sick = false
            animal.sickDays = 0
            healed.push(animal.name)
          }
        }
      }

      // Açlık eşik değere gelince hastalanma olasılığı
      if (animal.hunger >= HUNGER_SICK_THRESHOLD && !animal.sick && Math.random() < SICK_CHANCE) {
        // Çayır Çiftliği: hayvanlar açlıktan hastalanmaz
        if (gameStore.farmMapType !== 'meadowlands') {
          animal.sick = true
          animal.sickDays = 0
          gotSick.push(animal.name)
        }
      }

      // Hastalık günü birikir
      if (animal.sick) {
        animal.sickDays++
      }

      // Açlıktan ya da uzun hastalıktan ölüm
      if (animal.hunger >= HUNGER_DEATH_DAYS || animal.sickDays >= SICK_DEATH_DAYS) {
        died.push(animal.name)
        continue
      }

      // Yakınlık değişimi
      const friendshipMultiplier = gameStore.farmMapType === 'meadowlands' ? 1.5 : 1.0
      // Ruh bağı yeteneği: Ruh Eli (gui_nv_3), hayvan yakınlığı kazanımı +%25
      const spiritFriendshipBonus = 1 + useHiddenNpcStore().getAbilityValue('gui_nv_3') / 100

      // Otomatik sevme düzeneği: takılıysa otomatik sevildi say
      if (!animal.wasPetted) {
        const animalDef = ANIMAL_DEFS.find(d => d.type === animal.type)
        if (animalDef && autoPetterBuildings.value.includes(animalDef.building)) {
          animal.wasPetted = true
        }
      }

      if (!animal.wasFed) {
        animal.friendship = Math.max(0, animal.friendship - 10)
      }
      // Yak: sevilmediyse yakınlık düşmez
      if (!animal.wasPetted && animal.type !== 'yak') {
        animal.friendship = Math.max(0, animal.friendship - 5)
      }
      // Hastaysa yakınlık ek olarak düşer
      if (animal.sick) {
        animal.friendship = Math.max(0, animal.friendship - 10)
      }
      if (animal.wasFed && animal.wasPetted) {
        const base = animal.fedWith === PREMIUM_FEED_ID ? 25 : 15
        animal.friendship = Math.min(
          1000,
          animal.friendship + Math.floor(base * friendshipMultiplier * coopmasterBonus * spiritFriendshipBonus)
        )
      } else if (animal.wasFed) {
        const base = animal.fedWith === PREMIUM_FEED_ID ? 10 : 5
        animal.friendship = Math.min(
          1000,
          animal.friendship + Math.floor(base * friendshipMultiplier * coopmasterBonus * spiritFriendshipBonus)
        )
      }

      // Ruh hâli yeme göre değişir
      // Deve: yazın yemlenmese de moral kaybetmez
      if (animal.wasFed) {
        const moodGain = animal.fedWith === PREMIUM_FEED_ID ? 60 : 30
        animal.mood = Math.min(255, animal.mood + moodGain)
      } else if (animal.type === 'camel' && gameStore.season === 'summer') {
        // Deve yazın sıcağa dayanıklıdır, yemlenmese de morali düşmez
      } else {
        animal.mood = Math.max(0, animal.mood - 50)
      }
      // Hastalıkta ruh hâli ayrıca düşer
      if (animal.sick) {
        animal.mood = Math.max(0, animal.mood - 30)
      }

      // Ürün kontrolü (atı geç; at ürün vermez, hastaysa da vermez)
      const def = ANIMAL_DEFS.find(d => d.type === animal.type)
      if (def && def.produceDays > 0 && animal.wasFed && !animal.sick) {
        const effectiveDays = animal.fedWith === NOURISHING_FEED_ID ? Math.max(1, def.produceDays - 1) : def.produceDays
        if (animal.daysSinceProduct >= effectiveDays) {
          let quality = getAnimalProductQuality(animal.friendship)
          // Çoban uzmanlığı: kalite bir kademe artar
          if (hasShepherd) {
            const qualityOrder: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
            const idx = qualityOrder.indexOf(quality)
            quality = qualityOrder[Math.min(idx + 1, qualityOrder.length - 1)]!
          }
          // Ruh bağı: Hayvan Kut'u ürün kalitesini +1 artırabilir
          const animalBondBonus = useHiddenNpcStore().getBondBonusByType('animal_blessing')
          if (animalBondBonus?.type === 'animal_blessing' && Math.random() < animalBondBonus.chance) {
            const qualityOrder2: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
            const idx2 = qualityOrder2.indexOf(quality)
            if (idx2 < qualityOrder2.length - 1) quality = qualityOrder2[idx2 + 1]!
          }
          products.push({ itemId: def.productId, quality })
          animal.daysSinceProduct = 0

          // Çayır Çiftliği: %40 olasılıkla 1 ek ürün
          if (gameStore.farmMapType === 'meadowlands' && Math.random() < 0.4) {
            products.push({ itemId: def.productId, quality })
          }
        }
      }

      // Tavşan: yakınlık ≥600 ise %4 ihtimalle tavşan ayağı bulur
      if (animal.type === 'rabbit' && animal.friendship >= 600 && !animal.sick && Math.random() < 0.04) {
        products.push({ itemId: 'rabbit_foot', quality: getAnimalProductQuality(animal.friendship) })
      }

      // Günlük durumu sıfırla
      animal.wasFed = false
      animal.fedWith = null
      animal.wasPetted = false
    }

    // Ölen hayvanları kaldır
    if (died.length > 0) {
      animals.value = animals.value.filter(a => a.hunger < HUNGER_DEATH_DAYS && a.sickDays < SICK_DEATH_DAYS)
    }

    // Otlatma durumunu sıfırla
    grazedToday.value = false

    // Otomatik sevme düzeneği: yeni gün için UI'da “sevildi” olarak görünsün
    for (const animal of animals.value) {
      const animalDef = ANIMAL_DEFS.find(d => d.type === animal.type)
      if (animalDef && autoPetterBuildings.value.includes(animalDef.building)) {
        animal.wasPetted = true
      }
    }

    return { products, died, gotSick, healed }
  }

  /** Hayvanı sat, alış fiyatının yarısını geri ver */
  const sellAnimal = (animalId: string): { success: boolean; refund: number; name: string } => {
    const idx = animals.value.findIndex(a => a.id === animalId)
    if (idx === -1) return { success: false, refund: 0, name: '' }
    const animal = animals.value[idx]!
    const def = ANIMAL_DEFS.find(d => d.type === animal.type)
    const refund = Math.floor((def?.cost ?? 0) / 2)
    const name = animal.name
    animals.value.splice(idx, 1)
    if (refund > 0) {
      const playerStore = usePlayerStore()
      playerStore.earnMoney(refund)
    }
    return { success: true, refund, name }
  }

  /** Tek bir hasta hayvanı iyileştir (1 hayvan ilacı harcar) */
  const healAnimal = (animalId: string): boolean => {
    const animal = animals.value.find(a => a.id === animalId)
    if (!animal || !animal.sick) return false
    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem('animal_medicine', 1)) return false
    animal.sick = false
    animal.sickDays = 0
    return true
  }

  /** Tüm hasta hayvanları iyileştir (toplu ilaç harcaması) */
  const healAllSick = (): { healedCount: number; noMedicineCount: number } => {
    const inventoryStore = useInventoryStore()
    let healedCount = 0
    let noMedicineCount = 0
    for (const animal of animals.value.filter(a => a.sick)) {
      if (inventoryStore.removeItem('animal_medicine', 1)) {
        animal.sick = false
        animal.sickDays = 0
        healedCount++
      } else {
        noMedicineCount++
      }
    }
    return { healedCount, noMedicineCount }
  }

  /** Yakınlığa göre ürün kalitesini belirle */
  const getAnimalProductQuality = (friendship: number): Quality => {
    if (friendship >= 800) return 'supreme'
    if (friendship >= 500) return 'excellent'
    if (friendship >= 200) return 'fine'
    return 'normal'
  }

  /** Hayvanın adını değiştir (id='pet' ise evcil hayvandır) */
  const renameAnimal = (id: string, newName: string): boolean => {
    const trimmed = newName.trim()
    if (!trimmed || trimmed.length > 8) return false
    if (id === 'pet' && pet.value) {
      pet.value.name = trimmed
      return true
    }
    const animal = animals.value.find(a => a.id === id)
    if (animal) {
      animal.name = trimmed
      return true
    }
    return false
  }

  /** Belirli yapıda otomatik sevme düzeneği var mı */
  const hasAutoPetter = (buildingType: AnimalBuildingType): boolean => {
    return autoPetterBuildings.value.includes(buildingType)
  }

  /** Belirli yapıya otomatik sevme düzeneği kur */
  const installAutoPetter = (buildingType: AnimalBuildingType): { success: boolean; message: string } => {
    if (buildingType === 'stable') return { success: false, message: 'Atağıra otomatik sevme düzeneği kurulamaz.' }
    const building = buildings.value.find(b => b.type === buildingType)
    if (!building || !building.built) return { success: false, message: 'Önce ilgili yapıyı inşa etmek gerekir.' }
    if (building.level < 2) return { success: false, message: 'Kurulum için büyük yapı (2. seviye) gerekir.' }
    if (autoPetterBuildings.value.includes(buildingType)) return { success: false, message: 'Bu yapıda zaten otomatik sevme düzeneği var.' }
    autoPetterBuildings.value.push(buildingType)
    return { success: true, message: `Otomatik sevme düzeneği ${buildingType === 'coop' ? 'kümese' : 'ahıra'} kuruldu.` }
  }

  const serialize = () => {
    return {
      buildings: buildings.value,
      animals: animals.value,
      incubating: incubating.value,
      barnIncubating: barnIncubating.value,
      pet: pet.value,
      grazedToday: grazedToday.value,
      autoPetterBuildings: autoPetterBuildings.value
    }
  }

  const deserialize = (data: any) => {
    if (data.buildings) {
      const savedBuildings = data.buildings.map((b: any) => ({
        ...b,
        level: b.level && b.level > 0 ? b.level : b.built ? 1 : 0
      }))
      // Eski kayıt uyumluluğu: eksik stable yapısını ekle
      const savedTypes = new Set(savedBuildings.map((b: any) => b.type))
      if (!savedTypes.has('stable')) {
        savedBuildings.push({ type: 'stable', built: false, level: 0 })
      }
      buildings.value = savedBuildings
    }
    if (data.animals) {
      animals.value = data.animals.map((a: any) => ({
        ...a,
        hunger: a.hunger ?? 0,
        sick: a.sick ?? false,
        sickDays: a.sickDays ?? 0,
        fedWith: a.fedWith ?? null
      }))
    }
    incubating.value = data.incubating ?? null
    barnIncubating.value = data.barnIncubating ?? null
    pet.value = data.pet ?? null
    grazedToday.value = data.grazedToday ?? false
    autoPetterBuildings.value = data.autoPetterBuildings ?? []
  }

  return {
    buildings,
    animals,
    incubating,
    barnIncubating,
    pet,
    grazedToday,
    coopBuilt,
    barnBuilt,
    stableBuilt,
    coopAnimals,
    barnAnimals,
    getHorse,
    hasHorse,
    buildBuilding,
    upgradeBuilding,
    buyAnimal,
    sellAnimal,
    healAnimal,
    healAllSick,
    feedAll,
    markAllFed,
    petAnimal,
    petAllAnimals,
    startIncubation,
    dailyIncubatorUpdate,
    startBarnIncubation,
    dailyBarnIncubatorUpdate,
    adoptPet,
    petThePet,
    dailyPetUpdate,
    grazeAnimals,
    dailyUpdate,
    getAnimalProductQuality,
    renameAnimal,
    autoPetterBuildings,
    hasAutoPetter,
    installAutoPetter,
    serialize,
    deserialize
  }
})
