import type { SeedGenetics, HybridDef, SeedStarRating } from '@/types/breeding'
import { getCropById } from './crops'

// === Sabit ==

// ===Tohumluk kutu baz kapasitesi ==
export const BASE_BREEDING_BOX = 30

/** Tohum kutusu yükseltme tanımı */
export const SEED_BOX_UPGRADES = [
  {
    level: 1,
    cost: 5000,
    materials: [
      { itemId: 'wood', quantity: 50 },
      { itemId: 'copper_bar', quantity: 5 }
    ]
  },
  {
    level: 2,
    cost: 15000,
    materials: [
      { itemId: 'iron_bar', quantity: 8 },
      { itemId: 'pine_resin', quantity: 10 }
    ]
  },
  {
    level: 3,
    cost: 30000,
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'cloth', quantity: 3 },
      { itemId: 'wood', quantity: 100 }
    ]
  },
  {
    level: 4,
    cost: 50000,
    materials: [
      { itemId: 'gold_bar', quantity: 10 },
      { itemId: 'silk_cloth', quantity: 5 },
      { itemId: 'battery', quantity: 3 }
    ]
  },
  {
    level: 5,
    cost: 80000,
    materials: [
      { itemId: 'iridium_bar', quantity: 5 },
      { itemId: 'dream_silk', quantity: 3 },
      { itemId: 'moon_herb', quantity: 5 }
    ]
  }
]

/** Her aşamada tohum kutusu kapasitesinin artırılması */
export const SEED_BOX_UPGRADE_INCREMENT = 15

/** @deprecated useBreedingStore().maxSeedBox yerine kullan */
export const MAX_BREEDING_BOX = 30

/** Tohum yetiştirme süresi (gün) */
export const BREEDING_DAYS = 2

/** Özellik üst sınırı */
export const STAT_CAP = 100

/** Temel dalgalanma aralığı */
export const BASE_MUTATION_MAGNITUDE = 8

/** Nesil başına denge artışı */
export const GENERATIONAL_STABILITY_GAIN = 3

/** Denge üst sınırı */
export const MAX_STABILITY = 95

/** Mutasyon sırasında sıçrama aralığı */
export const MUTATION_JUMP_MIN = 15
export const MUTATION_JUMP_MAX = 30

/** Mutasyon oranı sapması */
export const MUTATION_RATE_DRIFT = 5

/** Gaköy Tohum Ocağı kurulum maliyeti */
export const BREEDING_STATION_COST = {
  money: 100000,
  materials: [
    { itemId: 'wood', quantity: 30 },
    { itemId: 'iron_ore', quantity: 10 },
    { itemId: 'gold_ore', quantity: 3 }
  ]
}
/** Tohum ocağı maksimum sayısı */
export const MAX_BREEDING_STATIONS = 3

// === Yardımcı Fonksiyonlar ===

let _nextGeneticsId = 1

/** Benzersiz gen kimliği oluşturur */
export const generateGeneticsId = (): string => {
  return `gen_${Date.now()}_${_nextGeneticsId++}`
}

/** Özelliği 0-100 aralığında sınırlar */
export const clampStat = (value: number): number => {
  return Math.max(0, Math.min(STAT_CAP, Math.round(value)))
}

/** Mutasyon oranını 1-50 aralığında sınırlar */
export const clampMutationRate = (value: number): number => {
  return Math.max(1, Math.min(50, Math.round(value)))
}

/** Ürüne göre varsayılan gen değerlerini hesaplar */
export const getDefaultGenetics = (cropId: string): Omit<SeedGenetics, 'id'> => {
  const crop = getCropById(cropId)
  if (!crop) {
    return {
      cropId,
      generation: 0,
      sweetness: 20,
      yield: 20,
      resistance: 20,
      stability: 50,
      mutationRate: 10,
      parentA: null,
      parentB: null,
      isHybrid: false,
      hybridId: null
    }
  }

// Gaköy’de değerli ve zor yetişen ürünler daha güçlü olur
  const priceScore = Math.min(crop.sellPrice / 350, 1) // 350 = Kutsal Kar Çiçeği değeri
  const growthScore = Math.min(crop.growthDays / 12, 1) // 12 = Kutsal Kar Çiçeği büyüme süresi

  const baseSweetness = clampStat(15 + Math.round(priceScore * 40))
  const baseYield = clampStat(15 + Math.round(growthScore * 35))
  const baseResistance = clampStat(10 + Math.round((priceScore + growthScore) * 15))

  return {
    cropId,
    generation: 0,
    sweetness: baseSweetness,
    yield: baseYield,
    resistance: baseResistance,
    stability: 50,
    mutationRate: 10,
    parentA: null,
    parentB: null,
    isHybrid: false,
    hybridId: null
  }
}

/** Toplam öznitelikleri hesaplayın */
export const getTotalStats = (g: SeedGenetics): number => {
  return g.sweetness + g.yield + g.resistance
}

/** Yıldız derecelendirmesi alın */
export const getStarRating = (g: SeedGenetics): SeedStarRating => {
  const total = getTotalStats(g)
  if (total >= 250) return 5
  if (total >= 200) return 4
  if (total >= 150) return 3
  if (total >= 100) return 2
  return 1
}

/** Tohum görüntüleme etiketleri oluşturun */
export const makeSeedLabel = (g: SeedGenetics): string => {
  const crop = getCropById(g.cropId)
  const name = crop?.name ?? g.cropId
  return `${name} G${g.generation}`
}
// === Melez Tarifler ===

export const HYBRID_DEFS: HybridDef[] = [
  {
    id: 'golden_melon',
    name: 'Altın Bal Kavunu',
    parentCropA: 'watermelon',
    parentCropB: 'lotus_root',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'golden_melon',
    baseGenetics: { sweetness: 70, yield: 60, resistance: 50 },
    discoveryText: 'Karpuzun tatlılığı ile nilüfer kökünün ferahlığı birleşti, Gaköy’de efsane Altın Bal Kavunu doğdu!'
  },
  {
    id: 'jade_tea',
    name: 'Yeşim Çayı',
    parentCropA: 'tea',
    parentCropB: 'chrysanthemum',
    minSweetness: 50,
    minYield: 45,
    resultCropId: 'jade_tea',
    baseGenetics: { sweetness: 60, yield: 55, resistance: 55 },
    discoveryText: 'Çayın yumuşaklığı ile kasımpatının zarafeti birleşti, Yeşim Çayı yeşil bir ışıkla parlar!'
  },
  {
    id: 'phoenix_pepper',
    name: 'Anka Biberi',
    parentCropA: 'chili',
    parentCropB: 'pumpkin',
    minSweetness: 40,
    minYield: 55,
    resultCropId: 'phoenix_pepper',
    baseGenetics: { sweetness: 50, yield: 65, resistance: 60 },
    discoveryText: 'Biberin ateşi ile kabağın yoğunluğu çarpıştı, Anka Biberi alev gibi doğdu!'
  },
  {
    id: 'moonlight_rice',
    name: 'Ay Işığı Pirinci',
    parentCropA: 'rice',
    parentCropB: 'bamboo_shoot',
    minSweetness: 45,
    minYield: 60,
    resultCropId: 'moonlight_rice',
    baseGenetics: { sweetness: 55, yield: 70, resistance: 45 },
    discoveryText: 'Pirinç ile bahar filizinin ruhu birleşti, Ay Işığı Pirinci gecede gümüş gibi parlar!'
  },
  {
    id: 'frost_garlic',
    name: 'Buz Sarımsağı',
    parentCropA: 'snow_lotus',
    parentCropB: 'garlic',
    minSweetness: 55,
    minYield: 40,
    resultCropId: 'frost_garlic',
    baseGenetics: { sweetness: 65, yield: 50, resistance: 70 },
    discoveryText: 'Kar çiçeğinin saflığı ile sarımsağın keskinliği birleşti, Buz Sarımsağı don gibi bir aura yayar!'
  },
  {
    {
    id: 'emerald_radish',
    name: 'Zümrüt Turp',
    parentCropA: 'cabbage',
    parentCropB: 'radish',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'emerald_radish',
    baseGenetics: { sweetness: 40, yield: 35, resistance: 30 },
    discoveryText: 'Lahananın çıtırtısı ile turpun tatlılığı birleşti, kökü zümrüt gibi ışıldar.'
  },
  {
    id: 'jade_shoot',
    name: 'Yeşim Filizi',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'tea',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'jade_shoot',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'Bahar filizinin tazeliği ile çayın aroması birleşir, yeşim gibi saf ve canlıdır.'
  },
  {
    id: 'golden_tuber',
    name: 'Altın Yağ Yumrusu',
    parentCropA: 'potato',
    parentCropB: 'rapeseed',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'golden_tuber',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 30 },
    discoveryText: 'Patatesin dolgunluğu ile kanola bitkisinin altın rengi birleşir, tüm bedeni altın gibi parlar.'
  },
  {
    id: 'peach_blossom_tea',
    name: 'Şeftali Çiçeği Çayı',
    parentCropA: 'peach',
    parentCropB: 'tea',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'peach_blossom_tea',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 40 },
    discoveryText: 'Şeftali çiçeğinin zarafeti ile çayın asaleti birleşir, yaprakları kelebek gibi süzülür.'
  },
  {
    id: 'ruby_bean',
    name: 'Yakut Fasulye',
    parentCropA: 'broad_bean',
    parentCropB: 'peach',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'ruby_bean',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'Baklanın dolgunluğu ile şeftalinin kızıllığı birleşir, her tanesi yakut gibi parlar.'
  },
  {
    {
    id: 'twin_bean',
    name: 'İkiz Fasulye',
    parentCropA: 'broad_bean',
    parentCropB: 'rapeseed',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'twin_bean',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 30 },
    discoveryText: 'Bakla ile kanola birleşti, her kapsülde ikiz gibi doğan taneler ortaya çıktı.'
  },
  {
    id: 'jade_melon',
    name: 'Yeşim Kavunu',
    parentCropA: 'watermelon',
    parentCropB: 'potato',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'jade_melon',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 35 },
    discoveryText: 'Karpuzun suyu ile patatesin yoğunluğu birleşti, içi yeşim gibi parlayan bir meyve doğdu.'
  },
  {
    id: 'pearl_grain',
    name: 'İnci Tanesi',
    parentCropA: 'rice',
    parentCropB: 'tea',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'pearl_grain',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 40 },
    discoveryText: 'Pirinç ile çayın zarafeti birleşti, taneler inci gibi ışıldar.'
  },
  {
    id: 'golden_corn',
    name: 'Altın Başak Mısır',
    parentCropA: 'corn',
    parentCropB: 'rapeseed',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'golden_corn',
    baseGenetics: { sweetness: 40, yield: 55, resistance: 35 },
    discoveryText: 'Mısırın bereketi ile kanolanın altın rengi birleşti, başaklar altın gibi parlar.'
  },
  {
    id: 'lotus_tea',
    name: 'Nilüfer Çayı',
    parentCropA: 'lotus_root',
    parentCropB: 'tea',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'lotus_tea',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 45 },
    discoveryText: 'Nilüfer kökü ile çayın kokusu birleşti, fincanda açan bir çiçek gibi huzur verir.'
  },
  {
    id: 'purple_bamboo',
    name: 'Mor Bambu Patlıcanı',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'eggplant',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'purple_bamboo',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 40 },
    discoveryText: 'Bahar filizinin dikliği ile patlıcanın mor özü birleşir, bambu düğümleri gibi mor meyveler verir.'
  },
  {
    id: 'honey_peach_melon',
    name: 'Bal Şeftali Kavunu',
    parentCropA: 'peach',
    parentCropB: 'watermelon',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'honey_peach_melon',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 35 },
    discoveryText: 'Şeftalinin bal gibi tadı ile karpuzun ferahlığı birleşir, her ısırıkta tatlı su taşar.'
  },
  {
    id: 'fire_bean',
    name: 'Alev Fasulyesi',
    parentCropA: 'broad_bean',
    parentCropB: 'chili',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'fire_bean',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 40 },
    discoveryText: 'Baklanın dolgunluğu biberin ateşiyle sarılır, yakıcı ama aromatik bir lezzet doğar.'
  },
  {
    id: 'silk_bean',
    name: 'İpek Fasulye',
    parentCropA: 'green_bean',
    parentCropB: 'loofah',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'silk_bean',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'Fasulyenin çıtırtısı ile lif kabağının yumuşaklığı birleşir, ipek gibi bir doku oluşur.'
  },
  {
    id: 'double_oil_seed',
    name: 'Çift Yağ Tohumu',
    parentCropA: 'rapeseed',
    parentCropB: 'sesame',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'double_oil_seed',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 30 },
    discoveryText: 'Kanola ile susam birleşir, yoğun aromalı ve bol yağ veren nadide bir tohum ortaya çıkar.'
  },
  {
    id: 'lotus_potato',
    name: 'Nilüfer Patatesi',
    parentCropA: 'potato',
    parentCropB: 'lotus_seed',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'lotus_potato',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 40 },
    discoveryText: 'Patatesin doyuruculuğu ile nilüfer tohumunun tatlılığı birleşir, yumuşak ve yoğun bir doku ortaya çıkar.'
  },
  {
    id: 'jade_pumpkin',
    name: 'Yeşim Balkabağı',
    parentCropA: 'potato',
    parentCropB: 'pumpkin',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'jade_pumpkin',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 40 },
    discoveryText: 'Patatesin sadeliği ile balkabağının altın özü birleşir, dışı yeşim yeşili içi altın sarısıdır.'
  },
  {
    id: 'crystal_yam',
    name: 'Kristal Yam Kökü',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'yam',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'crystal_yam',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 45 },
    discoveryText: 'Bahar filizinin çıtırlığı ile yam kökünün şifası birleşir, bedeni kristal gibi saydamdır.'
  },
  {
    id: 'osmanthus_tea',
    name: 'Osmanthus Çayı',
    parentCropA: 'tea',
    parentCropB: 'osmanthus',
    minSweetness: 50,
    minYield: 40,
    resultCropId: 'osmanthus_tea',
    baseGenetics: { sweetness: 60, yield: 50, resistance: 50 },
    discoveryText: 'Çayın derinliği ile osmanthus çiçeğinin kokusu birleşir, Gaköy evlerini hoş bir koku sarar.'
  },
  {
    {
    id: 'mountain_bamboo',
    name: 'Dağ Bambu Yumrusu',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'sweet_potato',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'mountain_bamboo',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Bahar filizinin ferahlığı ile tatlı patatesin yumuşaklığı birleşir, dağların armağanı olur.'
  },
  {
    id: 'golden_fruit',
    name: 'Altın Güz Meyvesi',
    parentCropA: 'peach',
    parentCropB: 'persimmon',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'golden_fruit',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 40 },
    discoveryText: 'Şeftalinin tatlılığı ile hurmanın yoğunluğu birleşir, dallar altın meyvelerle dolar.'
  },
  {
    id: 'nut_potato',
    name: 'Fıstık Patatesi',
    parentCropA: 'potato',
    parentCropB: 'peanut',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'nut_potato',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 35 },
    discoveryText: 'Patatesin yumuşaklığı ile fıstığın aroması birleşir, her lokmada lezzet artar.'
  },
  {
    id: 'autumn_bean',
    name: 'Güz Hurma Fasulyesi',
    parentCropA: 'broad_bean',
    parentCropB: 'jujube',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'autumn_bean',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'Bakla ile kırmızı hurma birleşir, her tanede tatlı bir koku saklıdır.'
  },
  {
    id: 'jujube_blossom',
    name: 'Hurma Çiçeği Şeftalisi',
    parentCropA: 'peach',
    parentCropB: 'jujube',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'jujube_blossom',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 40 },
    discoveryText: 'Şeftali çiçeği ile hurma çiçeği birlikte açar, meyvesi tatlı ve zarif olur.'
  },
  {
    {
    id: 'ginger_blossom',
    name: 'Zencefil Çiçeği Otu',
    parentCropA: 'rapeseed',
    parentCropB: 'ginger',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'ginger_blossom',
    baseGenetics: { sweetness: 40, yield: 40, resistance: 40 },
    discoveryText: 'Kanolanın tazeliği ile zencefilin keskinliği birleşir, çiçekleri kelebek gibi açar.'
  },
  {
    id: 'fairy_chrysanthemum',
    name: 'Peri Kasımpatı Otu',
    parentCropA: 'cabbage',
    parentCropB: 'chrysanthemum',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'fairy_chrysanthemum',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'Lahananın sadeliği ile kasımpatının zarafeti birleşir, yaprakları çiçek gibi açılır.'
  },
  {
    id: 'imperial_cabbage',
    name: 'İmparator Lahanası',
    parentCropA: 'cabbage',
    parentCropB: 'napa_cabbage',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'imperial_cabbage',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'İki lahana türünün soylu birleşimi, yumuşak yapraklı ve lezzetli bir ürün doğurur.'
  },
  {
    id: 'spicy_radish',
    name: 'Sarımsaklı Turp',
    parentCropA: 'radish',
    parentCropB: 'garlic',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'spicy_radish',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'Turpun çıtırtısı ile sarımsağın keskinliği birleşir, güçlü ve özgün bir tat ortaya çıkar.'
  },
  {
    id: 'snow_tea',
    name: 'Kar Çayı',
    parentCropA: 'tea',
    parentCropB: 'snow_lotus',
    minSweetness: 55,
    minYield: 45,
    resultCropId: 'snow_tea',
    baseGenetics: { sweetness: 65, yield: 55, resistance: 55 },
    discoveryText: 'Çay ile kar çiçeğinin saf özü birleşir, deminde kar gibi beyaz bir berraklık oluşur.'
  },
  {
    {
    id: 'spring_chive',
    name: 'Bahar Frenk Soğanı',
    parentCropA: 'cabbage',
    parentCropB: 'chives',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'spring_chive',
    baseGenetics: { sweetness: 30, yield: 40, resistance: 30 },
    discoveryText: 'Lahananın yumuşaklığı ile frenk soğanının yoğun aroması birleşir, dört mevsim yetişebilen bir ürün doğar.'
  },
  {
    id: 'wheat_potato',
    name: 'Buğday Aromalı Patates',
    parentCropA: 'potato',
    parentCropB: 'winter_wheat',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'wheat_potato',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 35 },
    discoveryText: 'Patates ile kış buğdayı birleşir, her lokmada buğday kokusu hissedilir.'
  },
  {
    id: 'spring_green_peach',
    name: 'Yeşil Şeftali',
    parentCropA: 'peach',
    parentCropB: 'spinach',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'spring_green_peach',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'Şeftalinin tatlılığı ile ıspanağın yeşilliği birleşir, kabuğu yeşim gibi parlayan bir meyve oluşur.'
  },
  {
    id: 'mustard_bean',
    name: 'Hardal Aromalı Fasulye',
    parentCropA: 'broad_bean',
    parentCropB: 'mustard_green',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'mustard_bean',
    baseGenetics: { sweetness: 40, yield: 40, resistance: 40 },
    discoveryText: 'Bakla, hardal yaprağının hafif acılığıyla birleşir; serin mevsimlerin vazgeçilmez tadıdır.'
  },
  {
    {
    id: 'frost_rapeseed',
    name: 'Kırağı Kanola',
    parentCropA: 'rapeseed',
    parentCropB: 'spinach',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'frost_rapeseed',
    baseGenetics: { sweetness: 35, yield: 35, resistance: 35 },
    discoveryText: 'Kanola soğuğa meydan okur, yapraklarında kırağı olsa bile yeşilliğini korur.'
  },
  {
    id: 'purple_melon',
    name: 'Mor Kristal Kavun',
    parentCropA: 'watermelon',
    parentCropB: 'eggplant',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'purple_melon',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 40 },
    discoveryText: 'Karpuzun suyu ile patlıcanın mor özü birleşir, içi kristal gibi mor parlayan bir meyve doğar.'
  },
  {
    id: 'golden_rice',
    name: 'Altın Susam Pirinci',
    parentCropA: 'rice',
    parentCropB: 'sesame',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'golden_rice',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 35 },
    discoveryText: 'Pirinç ile susam birleşir, altın taneler susam kokusu yayar.'
  },
  {
    id: 'double_lotus',
    name: 'İkiz Nilüfer',
    parentCropA: 'lotus_root',
    parentCropB: 'lotus_seed',
    minSweetness: 50,
    minYield: 45,
    resultCropId: 'double_lotus',
    baseGenetics: { sweetness: 60, yield: 55, resistance: 50 },
    discoveryText: 'Nilüfer kökü ile tohumu birleşir, aynı gövdede iki çiçek açar; Gaköy’de kutsal sayılır.'
  },
  {
    {
    id: 'fire_sesame',
    name: 'Alev Susamı',
    parentCropA: 'chili',
    parentCropB: 'sesame',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'fire_sesame',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Biberin ateşi ile susamın aroması birleşir, hem yakıcı hem de mis kokuludur.'
  },
  {
    id: 'silk_corn',
    name: 'İpek Başak',
    parentCropA: 'loofah',
    parentCropB: 'corn',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'silk_corn',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 40 },
    discoveryText: 'Lif kabağının yumuşaklığı ile mısırın dolgunluğu birleşir, altın iplikler gibi uzanır.'
  },
  {
    id: 'purple_lotus',
    name: 'Mor Nilüfer Patlıcanı',
    parentCropA: 'eggplant',
    parentCropB: 'lotus_root',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'purple_lotus',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 45 },
    discoveryText: 'Patlıcanın mor özü ile nilüferin saflığı birleşir, zarif ve dik bir duruş sergiler.'
  },
  {
    id: 'chrysanthemum_melon',
    name: 'Kasımpatı Kavunu',
    parentCropA: 'watermelon',
    parentCropB: 'chrysanthemum',
    minSweetness: 40,
    minYield: 30,
    resultCropId: 'chrysanthemum_melon',
    baseGenetics: { sweetness: 50, yield: 40, resistance: 40 },
    discoveryText: 'Karpuzun tatlılığı ile kasımpatının zarafeti birleşir, meyvesinde çiçek kokusu taşır.'
  },
  {
    {
    id: 'pumpkin_rice',
    name: 'Balkabaklı Pirinç',
    parentCropA: 'rice',
    parentCropB: 'pumpkin',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'pumpkin_rice',
    baseGenetics: { sweetness: 45, yield: 55, resistance: 40 },
    discoveryText: 'Pirinç ile balkabağı birleşir, her lokmada hafif tatlı bir koku yayılır.'
  },
  {
    id: 'mountain_lotus',
    name: 'Dağ Nilüferi',
    parentCropA: 'lotus_root',
    parentCropB: 'yam',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'mountain_lotus',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 50 },
    discoveryText: 'Nilüferin ferahlığı ile yam kökünün şifası birleşir, dağ ve suyun uyumunu taşır.'
  },
  {
    id: 'double_nut',
    name: 'Çift Çekirdek',
    parentCropA: 'peanut',
    parentCropB: 'sesame',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'double_nut',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Fıstık ile susam birleşir, yoğun ve kalıcı bir aroma bırakır.'
  },
  {
    id: 'sweet_gourd',
    name: 'Tatlı Lif Kabağı',
    parentCropA: 'loofah',
    parentCropB: 'sweet_potato',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'sweet_gourd',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'Lif kabağının yumuşaklığı ile tatlı patatesin lezzeti birleşir, içi tatlı ve yumuşaktır.'
  },
  {
    {
    id: 'purple_persimmon',
    name: 'Mor Trabzon Hurması',
    parentCropA: 'eggplant',
    parentCropB: 'persimmon',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'purple_persimmon',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 40 },
    discoveryText: 'Patlıcanın mor özü ile hurmanın tatlılığı birleşir, meyve mor-kızıl bir renkte parlar.'
  },
  {
    id: 'fire_ginger',
    name: 'Alev Zencefili',
    parentCropA: 'chili',
    parentCropB: 'ginger',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'fire_ginger',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 45 },
    discoveryText: 'Biberin yakıcılığı ile zencefilin sıcaklığı birleşir, iç ısıtan güçlü bir tat doğar.'
  },
  {
    id: 'osmanthus_lotus',
    name: 'Osmanthus Nilüferi',
    parentCropA: 'lotus_seed',
    parentCropB: 'osmanthus',
    minSweetness: 50,
    minYield: 40,
    resultCropId: 'osmanthus_lotus',
    baseGenetics: { sweetness: 60, yield: 50, resistance: 55 },
    discoveryText: 'Nilüfer tohumunun dinginliği ile osmanthus çiçeğinin kokusu birleşir, adeta bir düş bahçesi hissi verir.'
  },
  {
    id: 'golden_sweet',
    name: 'Altın Tatlı Yumru',
    parentCropA: 'corn',
    parentCropB: 'sweet_potato',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'golden_sweet',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 35 },
    discoveryText: 'Mısırın altın rengi ile tatlı patatesin lezzeti birleşir, bütünüyle altın gibi parlayan bir ürün doğar.'
  },
  {
    {
    id: 'ruby_melon',
    name: 'Yakut Kavun',
    parentCropA: 'watermelon',
    parentCropB: 'jujube',
    minSweetness: 40,
    minYield: 30,
    resultCropId: 'ruby_melon',
    baseGenetics: { sweetness: 50, yield: 40, resistance: 40 },
    discoveryText: 'Karpuzun suyu ile kırmızı hurmanın tatlılığı birleşir, içi yakut gibi parlayan bir meyve doğar.'
  },
  {
    id: 'chrysanthemum_rice',
    name: 'Kasımpatı Pirinci',
    parentCropA: 'rice',
    parentCropB: 'chrysanthemum',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'chrysanthemum_rice',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 40 },
    discoveryText: 'Pirinç ile kasımpatı birleşir, pişince hafif çiçek kokusu yayar.'
  },
  {
    id: 'nut_corn',
    name: 'Fıstıklı Mısır',
    parentCropA: 'corn',
    parentCropB: 'peanut',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'nut_corn',
    baseGenetics: { sweetness: 40, yield: 55, resistance: 35 },
    discoveryText: 'Mısır ile fıstık birleşir, her başakta zengin ve doyurucu bir aroma taşır.'
  },
  {
    id: 'frost_melon',
    name: 'Kırağı Kavunu',
    parentCropA: 'watermelon',
    parentCropB: 'napa_cabbage',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'frost_melon',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'Karpuzun tatlılığı ile lahananın soğuğa direnci birleşir, kışın bile tatlı meyve verir.'
  },
  {
    {
    id: 'twin_grain',
    name: 'İkiz Tahıl',
    parentCropA: 'rice',
    parentCropB: 'winter_wheat',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'twin_grain',
    baseGenetics: { sweetness: 40, yield: 55, resistance: 35 },
    discoveryText: 'Pirinç ile kış buğdayı birleşir, kuzey ve güneyin bereketi tek başakta buluşur.'
  },
  {
    id: 'lotus_cabbage',
    name: 'Nilüfer Lahanası',
    parentCropA: 'lotus_root',
    parentCropB: 'napa_cabbage',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'lotus_cabbage',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 40 },
    discoveryText: 'Nilüferin ferahlığı ile lahananın sadeliği birleşir, kış günlerinde hafif ve besleyici bir tat sunar.'
  },
  {
    id: 'garlic_sesame',
    name: 'Sarımsaklı Susam',
    parentCropA: 'sesame',
    parentCropB: 'garlic',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'garlic_sesame',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 40 },
    discoveryText: 'Susamın yoğun aroması ile sarımsağın keskinliği birleşir, Gaköy mutfağının vazgeçilmez baharatı olur.'
  },
  {
    {
    id: 'chive_gourd',
    name: 'Frenk Soğanlı Lif Kabağı',
    parentCropA: 'loofah',
    parentCropB: 'chives',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'chive_gourd',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'Lif kabağının yumuşaklığı ile frenk soğanının keskin aroması birleşir, üç mevsim yetişebilen bir ürün doğar.'
  },
  {
    id: 'mustard_eggplant',
    name: 'Hardallı Patlıcan',
    parentCropA: 'eggplant',
    parentCropB: 'mustard_green',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'mustard_eggplant',
    baseGenetics: { sweetness: 40, yield: 40, resistance: 40 },
    discoveryText: 'Patlıcanın mor özü, hardal yaprağının hafif acılığıyla sarılır; kendine özgü bir tat ortaya çıkar.'
  },
  {
    id: 'snow_fire_pepper',
    name: 'Buz Alev Biberi',
    parentCropA: 'chili',
    parentCropB: 'snow_lotus',
    minSweetness: 50,
    minYield: 40,
    resultCropId: 'snow_fire_pepper',
    baseGenetics: { sweetness: 60, yield: 50, resistance: 55 },
    discoveryText: 'Biberin ateşi ile kar çiçeğinin soğuğu çarpışır, Gaköy’de “iki âlemin meyvesi” diye anılır.'
  },
  {
    {
    id: 'winter_corn',
    name: 'Kış Mısırı',
    parentCropA: 'corn',
    parentCropB: 'spinach',
    minSweetness: 30,
    minYield: 40,
    resultCropId: 'winter_corn',
    baseGenetics: { sweetness: 40, yield: 50, resistance: 40 },
    discoveryText: 'Mısır soğuğa meydan okur, yaprakları kışın bile çam gibi yeşil kalır.'
  },
  {
    id: 'amber_yam',
    name: 'Kehribar Yumru',
    parentCropA: 'yam',
    parentCropB: 'sweet_potato',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'amber_yam',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 40 },
    discoveryText: 'Yam kökünün şifası ile tatlı patatesin lezzeti birleşir, rengi kehribar gibi parlar.'
  },
  {
    id: 'twin_blossom',
    name: 'İkiz Çiçek',
    parentCropA: 'chrysanthemum',
    parentCropB: 'osmanthus',
    minSweetness: 45,
    minYield: 35,
    resultCropId: 'twin_blossom',
    baseGenetics: { sweetness: 55, yield: 45, resistance: 50 },
    discoveryText: 'Kasımpatı ile osmanthus birlikte açar, Gaköy bahçelerinde iki çiçek yarışır gibi parlar.'
  },
  {
    {
    id: 'mountain_nut',
    name: 'Dağ Fıstığı',
    parentCropA: 'yam',
    parentCropB: 'peanut',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'mountain_nut',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 35 },
    discoveryText: 'Yam kökünün yumuşaklığı ile fıstığın çıtırtısı birleşir, dağların sakladığı nadide bir lezzet olur.'
  },
  {
    id: 'autumn_gem',
    name: 'Güz Osmanthus Balkabağı',
    parentCropA: 'pumpkin',
    parentCropB: 'osmanthus',
    minSweetness: 45,
    minYield: 40,
    resultCropId: 'autumn_gem',
    baseGenetics: { sweetness: 55, yield: 50, resistance: 45 },
    discoveryText: 'Balkabağının dolgunluğu ile osmanthus çiçeğinin kokusu birleşir, sonbaharın altın hazinesi olur.'
  },
  {
    id: 'ginger_yam',
    name: 'Zencefilli Yam Kökü',
    parentCropA: 'ginger',
    parentCropB: 'yam',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'ginger_yam',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 45 },
    discoveryText: 'Zencefilin sıcaklığı ile yam kökünün besleyiciliği birleşir, kış günlerinde şifa kaynağı olur.'
  },
  {
    {
    id: 'golden_persimmon',
    name: 'Altın Hurma',
    parentCropA: 'persimmon',
    parentCropB: 'pumpkin',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'golden_persimmon',
    baseGenetics: { sweetness: 50, yield: 50, resistance: 40 },
    discoveryText: 'Hurmaların yumuşak tatlılığı ile balkabağının altın özü birleşir, bal gibi parlayan bir meyve doğar.'
  },
  {
    id: 'chrysanthemum_jujube',
    name: 'Kasımpatı Hurması',
    parentCropA: 'chrysanthemum',
    parentCropB: 'jujube',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'chrysanthemum_jujube',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 45 },
    discoveryText: 'Kasımpatının zarafeti ile kırmızı hurmanın tatlılığı birleşir, çiçek ile meyve bir arada yaşar.'
  },
  {
    id: 'osmanthus_yam',
    name: 'Osmanthus Yam Kökü',
    parentCropA: 'osmanthus',
    parentCropB: 'sweet_potato',
    minSweetness: 40,
    minYield: 35,
    resultCropId: 'osmanthus_yam',
    baseGenetics: { sweetness: 50, yield: 45, resistance: 45 },
    discoveryText: 'Osmanthus çiçeğinin kokusu tatlı patatese işler, her lokmada Gaköy bahçelerinin kokusu hissedilir.'
  },
  {
    {
    id: 'winter_pumpkin',
    name: 'Kış Balkabağı',
    parentCropA: 'pumpkin',
    parentCropB: 'napa_cabbage',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'winter_pumpkin',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 40 },
    discoveryText: 'Balkabağının bolluğu ile lahananın soğuğa direnci birleşir, kış sofralarının sıcak nimeti olur.'
  },
  {
    id: 'emerald_yam',
    name: 'Zümrüt Yam Kökü',
    parentCropA: 'yam',
    parentCropB: 'spinach',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'emerald_yam',
    baseGenetics: { sweetness: 45, yield: 45, resistance: 45 },
    discoveryText: 'Yam kökünün şifası ile ıspanağın yeşilliği birleşir, kesildiğinde zümrüt gibi parlar.'
  },
  {
    id: 'snow_chrysanthemum',
    name: 'Kar Kasımpatısı',
    parentCropA: 'chrysanthemum',
    parentCropB: 'snow_lotus',
    minSweetness: 55,
    minYield: 40,
    resultCropId: 'snow_chrysanthemum',
    baseGenetics: { sweetness: 65, yield: 50, resistance: 60 },
    discoveryText: 'Kasımpatının zarafeti ile kar çiçeğinin saflığı birleşir, taç yaprakları kar gibi beyazdır.'
  },
  {
    {
    id: 'osmanthus_garlic',
    name: 'Osmanthus Sarımsağı',
    parentCropA: 'osmanthus',
    parentCropB: 'garlic',
    minSweetness: 40,
    minYield: 30,
    resultCropId: 'osmanthus_garlic',
    baseGenetics: { sweetness: 50, yield: 40, resistance: 45 },
    discoveryText: 'Osmanthus çiçeğinin hoş kokusu sarımsağın keskinliğini yumuşatır, etrafa yayılan bir aroma bırakır.'
  },
  {
    id: 'wheat_yam',
    name: 'Buğday Yam Kökü',
    parentCropA: 'yam',
    parentCropB: 'winter_wheat',
    minSweetness: 35,
    minYield: 40,
    resultCropId: 'wheat_yam',
    baseGenetics: { sweetness: 45, yield: 50, resistance: 40 },
    discoveryText: 'Yam kökü ile kış buğdayı birleşir, besin değeri yüksek ve doyurucu bir mahsul doğar.'
  },
  {
    id: 'cream_peanut',
    name: 'Beyaz Fıstık',
    parentCropA: 'peanut',
    parentCropB: 'napa_cabbage',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'cream_peanut',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Fıstığın aroması ile lahananın sadeliği birleşir, kabuğu kar gibi beyaz bir ürün oluşur.'
  },
  {
    {
    id: 'garlic_jujube',
    name: 'Sarımsaklı Hurma',
    parentCropA: 'jujube',
    parentCropB: 'garlic',
    minSweetness: 35,
    minYield: 35,
    resultCropId: 'garlic_jujube',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 45 },
    discoveryText: 'Kırmızı hurmanın tatlılığı ile sarımsağın keskinliği birleşir, beklenmedik bir lezzet doğar.'
  },
  {
    id: 'chive_persimmon',
    name: 'Frenk Soğanlı Hurma',
    parentCropA: 'persimmon',
    parentCropB: 'chives',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'chive_persimmon',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 40 },
    discoveryText: 'Hurma meyvesinin tatlılığı ile frenk soğanının aroması birleşir, üç mevsim hasat edilir.'
  },
  {
    id: 'mustard_ginger',
    name: 'Hardallı Zencefil',
    parentCropA: 'ginger',
    parentCropB: 'mustard_green',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'mustard_ginger',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 40 },
    discoveryText: 'Zencefilin sıcaklığı ile hardal yaprağının hafif acılığı birleşir, soğuğa karşı güçlü bir şifa olur.'
  },
  {
    {
    id: 'snow_pumpkin',
    name: 'Kar Balkabağı',
    parentCropA: 'pumpkin',
    parentCropB: 'snow_lotus',
    minSweetness: 55,
    minYield: 45,
    resultCropId: 'snow_pumpkin',
    baseGenetics: { sweetness: 65, yield: 55, resistance: 55 },
    discoveryText: 'Balkabağının bolluğu ile kar çiçeğinin saflığı birleşir, Gaköy’de anlatılan beyaz dev meyve efsanesi doğar.'
  },
  {
    id: 'jade_white',
    name: 'Yeşim Lahana',
    parentCropA: 'napa_cabbage',
    parentCropB: 'spinach',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'jade_white',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 30 },
    discoveryText: 'Lahananın sadeliği ile ıspanağın yeşilliği birleşir, yaprakları yeşim gibi ışıldar.'
  },
  {
    id: 'garlic_cabbage',
    name: 'Sarımsaklı Lahana',
    parentCropA: 'garlic',
    parentCropB: 'napa_cabbage',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'garlic_cabbage',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'Sarımsağın keskinliği ile lahananın tatlılığı birleşir, kışlık erzakların vazgeçilmezi olur.'
  },
  {
    {
    id: 'evergreen_herb',
    name: 'Ebedi Yeşil Otu',
    parentCropA: 'spinach',
    parentCropB: 'mustard_green',
    minSweetness: 25,
    minYield: 25,
    resultCropId: 'evergreen_herb',
    baseGenetics: { sweetness: 30, yield: 35, resistance: 35 },
    discoveryText: 'Ispanak ile hardal otu birleşir, soğuğa boyun eğmez; dört mevsim yeşil kalır.'
  },
  {
    id: 'wheat_mustard',
    name: 'Buğday Hardal Otu',
    parentCropA: 'winter_wheat',
    parentCropB: 'mustard_green',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'wheat_mustard',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 35 },
    discoveryText: 'Kış buğdayının dolgunluğu ile hardalın keskinliği birleşir, Gaköy sofralarında farklı bir tat bırakır.'
  },
  {
    id: 'allium_king',
    name: 'Soğanlar Kralı',
    parentCropA: 'garlic',
    parentCropB: 'chives',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'allium_king',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 40 },
    discoveryText: 'Sarımsak ile frenk soğanı birleşir, kokusu güçlü, tadı efsanevi bir bitki doğar.'
  },
  {
    {
    id: 'green_wheat',
    name: 'Yeşil Buğday',
    parentCropA: 'spinach',
    parentCropB: 'winter_wheat',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'green_wheat',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 35 },
    discoveryText: 'Ispanağın yeşilliği kış buğdayına işler, başaklar rüzgârda zümrüt gibi dalgalanır.'
  },
  {
    id: 'chive_mustard',
    name: 'Frenk Soğanlı Hardal',
    parentCropA: 'chives',
    parentCropB: 'mustard_green',
    minSweetness: 25,
    minYield: 25,
    resultCropId: 'chive_mustard',
    baseGenetics: { sweetness: 30, yield: 35, resistance: 35 },
    discoveryText: 'Frenk soğanı ile hardal otu birleşir, keskin tadıyla iştah açar.'
  },
  {
    id: 'jade_bamboo_corn',
    name: 'Yeşim Bambu Mısırı',
    parentCropA: 'bamboo_shoot',
    parentCropB: 'corn',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'jade_bamboo_corn',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Bahar filizinin çıtırlığı ile mısırın tatlılığı birleşir, yeşim gibi parlak başaklar verir.'
  },
  {
    {
    id: 'ginger_jade_green',
    name: 'Zencefilli Yeşim Otu',
    parentCropA: 'cabbage',
    parentCropB: 'ginger',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'ginger_jade_green',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'Lahananın ferahlığı ile zencefilin sıcaklığı birleşir, hem mideyi ısıtır hem de hafiflik verir.'
  },
  {
    id: 'spicy_sesame',
    name: 'Acı Fıstık Tanesi',
    parentCropA: 'chili',
    parentCropB: 'peanut',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'spicy_sesame',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 40 },
    discoveryText: 'Biberin ateşi ile fıstığın çıtırtısı birleşir, Gaköy sofralarında unutulmaz bir tat bırakır.'
  },
  {
    id: 'honey_gourd',
    name: 'Ballı Lif Kabağı',
    parentCropA: 'loofah',
    parentCropB: 'peanut',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'honey_gourd',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 30 },
    discoveryText: 'Lif kabağının yumuşaklığı ile fıstığın tatlılığı birleşir, ağızda bal gibi bir his bırakır.'
  },
  {
    {
    id: 'golden_peanut_yam',
    name: 'Fıstıklı Tatlı Yumru',
    parentCropA: 'peanut',
    parentCropB: 'sweet_potato',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'golden_peanut_yam',
    baseGenetics: { sweetness: 40, yield: 45, resistance: 35 },
    discoveryText: 'Fıstığın aroması ile tatlı patatesin yumuşaklığı birleşir, Gaköy’de sevilen tatlı bir mahsul olur.'
  },
  {
    id: 'spice_jujube',
    name: 'Baharatlı Hurma',
    parentCropA: 'jujube',
    parentCropB: 'ginger',
    minSweetness: 30,
    minYield: 30,
    resultCropId: 'spice_jujube',
    baseGenetics: { sweetness: 40, yield: 35, resistance: 40 },
    discoveryText: 'Hurma meyvesinin tatlılığı ile zencefilin keskinliği birleşir, damakta uzun süre kalan bir tat bırakır.'
  },
  {
    id: 'bean_eggplant',
    name: 'Fasulye Patlıcanı',
    parentCropA: 'green_bean',
    parentCropB: 'eggplant',
    minSweetness: 25,
    minYield: 30,
    resultCropId: 'bean_eggplant',
    baseGenetics: { sweetness: 35, yield: 40, resistance: 35 },
    discoveryText: 'Fasulyenin tazeliği ile patlıcanın yumuşaklığı birleşir, tarlaların iki hazinesi tek üründe buluşur.'
  },
  {
    {
    id: 'chrysanthemum_persimmon',
    name: 'Kasımpatı Hurması',
    parentCropA: 'persimmon',
    parentCropB: 'chrysanthemum',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'chrysanthemum_persimmon',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 35 },
    discoveryText: 'Hurma meyvesinin tatlılığı ile kasımpatının hoş kokusu birleşir, sonbaharın en nadide lezzeti olur.'
  },
  {
    id: 'purple_yam',
    name: 'Mor Yeşim Yumru',
    parentCropA: 'yam',
    parentCropB: 'eggplant',
    minSweetness: 30,
    minYield: 35,
    resultCropId: 'purple_yam',
    baseGenetics: { sweetness: 35, yield: 45, resistance: 40 },
    discoveryText: 'Yam kökünün yumuşaklığı ile patlıcanın mor özü birleşir, yüzeyi mor bir ışıltı yayar.'
  },
  {
    id: 'snow_lotus_pearl',
    name: 'Kar Nilüfer Tanesi',
    parentCropA: 'lotus_seed',
    parentCropB: 'snow_lotus',
    minSweetness: 35,
    minYield: 30,
    resultCropId: 'snow_lotus_pearl',
    baseGenetics: { sweetness: 45, yield: 40, resistance: 45 },
    discoveryText: 'Nilüfer tohumunun dinginliği ile kar çiçeğinin saflığı birleşir, kışın parlayan bir inci gibi görünür.'
  },
  {
    {
    id: 'melon_tea_fruit',
    name: 'Bal Çay Meyvesi',
    parentCropA: 'golden_melon',
    parentCropB: 'tea',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'melon_tea_fruit',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'Altın kavunun tatlılığı ile çayın zarafeti en yüce hâlde birleşir, Gaköy efsanelerinde anlatılan kutsal meyve doğar.'
  },
  {
    id: 'dragon_fire',
    name: 'Ejder Ateş Biberi',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'ginger',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'dragon_fire',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 60 },
    discoveryText: 'Anka biberinin alevi ile zencefilin yakıcılığı birleşir, ejder nefesi gibi kavurucu bir güç doğurur.'
  },
  {
    id: 'celestial_rice',
    name: 'Gök Kokulu Pirinç',
    parentCropA: 'moonlight_rice',
    parentCropB: 'osmanthus',
    minSweetness: 65,
    minYield: 60,
    resultCropId: 'celestial_rice',
    baseGenetics: { sweetness: 75, yield: 70, resistance: 60 },
    discoveryText: 'Ay ışığı pirincinin parıltısı ile osmanthus çiçeğinin kokusu birleşir, göksel bir mahsul ortaya çıkar.'
  },
  {
    {
    id: 'ice_lotus',
    name: 'Buz Nilüferi',
    parentCropA: 'frost_garlic',
    parentCropB: 'lotus_seed',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'ice_lotus',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 65 },
    discoveryText: 'Don sarımsağının soğuğu ile nilüfer tohumunun dinginliği birleşir; Gaköy’de anlatılır, bu çiçek açınca asla solmaz.'
  },
  {
    id: 'jade_peach_tea',
    name: 'Yeşim Şeftali Çayı',
    parentCropA: 'jade_tea',
    parentCropB: 'peach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'jade_peach_tea',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'Yeşim çayının yeşil ışıltısı ile şeftalinin tatlılığı birleşir, bilgelerin içtiği nadide bir içecek doğar.'
  },
  {
    id: 'golden_dragon',
    name: 'Altın Ejder Meyvesi',
    parentCropA: 'golden_melon',
    parentCropB: 'phoenix_pepper',
    minSweetness: 70,
    minYield: 65,
    resultCropId: 'golden_dragon',
    baseGenetics: { sweetness: 80, yield: 75, resistance: 65 },
    discoveryText: 'Altın kavunun asaleti ile anka biberinin alevi çarpışır; bu meyveye Gaköy’de “ejderlerin armağanı” denir.'
  },
  {
    {
    id: 'moonlight_frost',
    name: 'Ay Don Pirinci',
    parentCropA: 'moonlight_rice',
    parentCropB: 'frost_garlic',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'moonlight_frost',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 65 },
    discoveryText: 'Ay ışığı pirincinin parıltısı ile don sarımsağının soğuğu birleşir; Gaköy gecelerinde ay altında parlayan kutsal bir ürün doğar.'
  },
  {
    id: 'jade_golden_melon',
    name: 'Yeşim Altın Kavun',
    parentCropA: 'jade_tea',
    parentCropB: 'golden_melon',
    minSweetness: 70,
    minYield: 65,
    resultCropId: 'jade_golden_melon',
    baseGenetics: { sweetness: 80, yield: 70, resistance: 70 },
    discoveryText: 'Yeşim çayının yeşili ile altın kavunun ışıltısı birleşir, sanki yeşim içine altın saklanmış gibidir.'
  },
  {
    id: 'immortal_flower',
    name: 'Eren Çiçeği',
    parentCropA: 'frost_garlic',
    parentCropB: 'jade_tea',
    minSweetness: 70,
    minYield: 60,
    resultCropId: 'immortal_flower',
    baseGenetics: { sweetness: 85, yield: 70, resistance: 75 },
    discoveryText: 'Don sarımsağının soğuğu ile yeşim çayının özü birleşir; Gaköy ozanları bu çiçeği ölümsüzlerin nimeti diye anar.'
  },
  {
    {
    id: 'dragon_pearl',
    name: 'Ejder İncisi',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'moonlight_rice',
    minSweetness: 75,
    minYield: 70,
    resultCropId: 'dragon_pearl',
    baseGenetics: { sweetness: 85, yield: 80, resistance: 70 },
    discoveryText: 'Anka biberinin alevi ile ay pirincinin ışıltısı birleşir; yuvarlak meyvesi ejder incisi gibi parlar, Gaköy’de kutsal sayılır.'
  },
  // --- Yeni İkinci Nesil Melezler ---
  {
    id: 'emerald_jade_tea',
    name: 'Yeşim Dem Çayı',
    parentCropA: 'emerald_radish',
    parentCropB: 'tea',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'emerald_jade_tea',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'Zümrüt turpun yeşilliği ile çayın zarafeti birleşir, kokusu Gaköy yaylalarını sarar.'
  },
  {
    id: 'pearl_osmanthus',
    name: 'İnci Osmanthus Tanesi',
    parentCropA: 'pearl_grain',
    parentCropB: 'osmanthus',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'pearl_osmanthus',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'İnci tanesi gibi parlayan tahıl ile osmanthus çiçeğinin kokusu birleşir, her tanesi mis gibi kokar.'
  },
  {
    {
    id: 'ruby_fire',
    name: 'Kızıl Kor Biberi',
    parentCropA: 'ruby_bean',
    parentCropB: 'chili',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'ruby_fire',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'Kızıl fasulyenin parlaklığı ile biberin ateşi birleşir, kor gibi yanan bir taş misali parlar.'
  },
  {
    id: 'golden_corn_king',
    name: 'Altın Başak Hanı',
    parentCropA: 'golden_corn',
    parentCropB: 'rice',
    minSweetness: 55,
    minYield: 60,
    resultCropId: 'golden_corn_king',
    baseGenetics: { sweetness: 65, yield: 70, resistance: 55 },
    discoveryText: 'Altın mısırın bolluğu ile pirincin bereketi birleşir; Gaköy’de buna “tanelerin hanı” denir.'
  },
  {
    id: 'jade_melon_tea',
    name: 'Yeşim Dem Kavunu',
    parentCropA: 'jade_melon',
    parentCropB: 'tea',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'jade_melon_tea',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'Yeşim kavunun ferahlığı ile çayın kokusu birleşir, yaz sıcağında serinlik veren bir nimet olur.'
  },
  {
    {
    id: 'twin_golden_bean',
    name: 'Altın İkiz Fasulye',
    parentCropA: 'twin_bean',
    parentCropB: 'peanut',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'twin_golden_bean',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 50 },
    discoveryText: 'İkiz fasulyenin çift doğası ile fıstığın dolgunluğu birleşir, altın gibi parlayan çift taneler verir.'
  },
  {
    id: 'peach_rice',
    name: 'Şeftali Pilavı',
    parentCropA: 'peach_blossom_tea',
    parentCropB: 'rice',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'peach_rice',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'Şeftali çayının kokusu pirince işler, Gaköy sofralarında pembe tonlu pilav olarak sunulur.'
  },
  {
    id: 'jade_shoot_ginger',
    name: 'Yeşim Filiz Zencefili',
    parentCropA: 'jade_shoot',
    parentCropB: 'ginger',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'jade_shoot_ginger',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'Yeşim filizin tazeliği ile zencefilin yakıcılığı birleşir, Gaköy kışlarında iç ısıtan bir nimet olur.'
  },
  {
    {
    id: 'golden_tuber_lotus',
    name: 'Altın Nilüfer Yumrusu',
    parentCropA: 'golden_tuber',
    parentCropB: 'lotus_root',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'golden_tuber_lotus',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Altın yumrunun parlaklığı ile nilüfer kökünün saflığı birleşir, hem tatlı hem ferah bir lezzet doğurur.'
  },
  {
    id: 'frost_chrysanthemum',
    name: 'Don Kasımpatısı',
    parentCropA: 'frost_garlic',
    parentCropB: 'chrysanthemum',
    minSweetness: 65,
    minYield: 50,
    resultCropId: 'frost_chrysanthemum',
    baseGenetics: { sweetness: 75, yield: 60, resistance: 70 },
    discoveryText: 'Don sarımsağının soğuğu ile kasımpatının direnci birleşir, ayazda bile açan bir çiçek olur.'
  },
  {
    id: 'phoenix_sesame',
    name: 'Anka Susamı',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'sesame',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'phoenix_sesame',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 60 },
    discoveryText: 'Anka biberinin alevi ile susamın aroması birleşir, Gaköy’de hem acı hem kokulu nadir bir mahsul sayılır.'
  },
  {
    {
    id: 'moonlight_lotus',
    name: 'Ay Nilüferi',
    parentCropA: 'moonlight_rice',
    parentCropB: 'lotus_seed',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'moonlight_lotus',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'Ay pirincinin gümüş ışıltısı ile nilüfer tohumunun huzuru birleşir, Gaköy gecelerinde ay altında beyaz bir çiçek açar.'
  },
  {
    id: 'jade_snow',
    name: 'Yeşim Kar Filizi',
    parentCropA: 'jade_tea',
    parentCropB: 'snow_lotus',
    minSweetness: 65,
    minYield: 50,
    resultCropId: 'jade_snow',
    baseGenetics: { sweetness: 75, yield: 60, resistance: 70 },
    discoveryText: 'Yeşim çayının yeşili ile kar çiçeğinin beyazı birleşir, saf ve berrak bir öz doğar.'
  },
  {
    id: 'golden_pumpkin',
    name: 'Altın Kabak Hanı',
    parentCropA: 'golden_melon',
    parentCropB: 'pumpkin',
    minSweetness: 65,
    minYield: 60,
    resultCropId: 'golden_pumpkin',
    baseGenetics: { sweetness: 75, yield: 70, resistance: 60 },
    discoveryText: 'Altın kavunun tatlılığı ile kabağın bereketi birleşir, Gaköy’de tarlaların hükümdarı sayılır.'
  },
  {
    {
    id: 'phoenix_corn',
    name: 'Alev Başak',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'corn',
    minSweetness: 55,
    minYield: 60,
    resultCropId: 'phoenix_corn',
    baseGenetics: { sweetness: 65, yield: 70, resistance: 55 },
    discoveryText: 'Anka biberinin ateşi mısır başağına işler, kızıl taneleri hem tatlı hem yakıcı olur.'
  },
  {
    id: 'moonlight_yam',
    name: 'Ay Işığı Yumrusu',
    parentCropA: 'moonlight_rice',
    parentCropB: 'sweet_potato',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'moonlight_yam',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 55 },
    discoveryText: 'Ay pirincinin gümüş ışığı tatlı yumruya işler, yüzeyi ay gibi soluk bir parıltı yayar.'
  },
  {
    id: 'jade_peanut',
    name: 'Yeşim Fıstık Meyvesi',
    parentCropA: 'jade_tea',
    parentCropB: 'peanut',
    minSweetness: 55,
    minYield: 50,
    resultCropId: 'jade_peanut',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 55 },
    discoveryText: 'Yeşim çayının özü fıstığa işler, kabuğunun içinde yeşim gibi parlayan taneler saklıdır.'
  },
  {
    {
    id: 'frost_radish',
    name: 'Don Yeşim Turpu',
    parentCropA: 'frost_garlic',
    parentCropB: 'radish',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'frost_radish',
    baseGenetics: { sweetness: 70, yield: 60, resistance: 65 },
    discoveryText: 'Don sarımsağının soğuğu turpa işler, kökü buz yeşimi gibi saydam parlar.'
  },
  {
    id: 'golden_jujube',
    name: 'Altın Bal Hurması',
    parentCropA: 'golden_melon',
    parentCropB: 'jujube',
    minSweetness: 70,
    minYield: 55,
    resultCropId: 'golden_jujube',
    baseGenetics: { sweetness: 80, yield: 65, resistance: 60 },
    discoveryText: 'Altın kavunun tatlı özü hurmaya işler, her tanesi bal gibi dolgun olur.'
  },
  {
    id: 'phoenix_eggplant',
    name: 'Alev Patlıcanı',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'eggplant',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'phoenix_eggplant',
    baseGenetics: { sweetness: 60, yield: 65, resistance: 60 },
    discoveryText: 'Anka biberinin ateşi patlıcanın mor kabuğuna işler, içi yakıcı ve lezzetli olur.'
  },
  {
    {
    id: 'moonlight_spinach',
    name: 'Ay Yaprağı Otu',
    parentCropA: 'moonlight_rice',
    parentCropB: 'spinach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'moonlight_spinach',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Ay pirincinin gümüş ışıltısı ıspanak yapraklarına işler, yapraklar gece ışık saçar.'
  },
  {
    id: 'jade_loofah',
    name: 'Yeşim Lif Kabağı',
    parentCropA: 'jade_tea',
    parentCropB: 'loofah',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'jade_loofah',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 50 },
    discoveryText: 'Yeşim çayının rengi kabağa işler, gövdesi yeşim gibi parlak olur.'
  },
  {
    id: 'frost_winter_wheat',
    name: 'Don Buğdayı',
    parentCropA: 'frost_garlic',
    parentCropB: 'winter_wheat',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'frost_winter_wheat',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 70 },
    discoveryText: 'Don sarımsağının soğuğu buğdaya işler, başakları kırağıyla süslenir.'
  },
  {
    {
    id: 'golden_sesame',
    name: 'Altın Susam',
    parentCropA: 'golden_melon',
    parentCropB: 'sesame',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'golden_sesame',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 55 },
    discoveryText: 'Altın kavunun ışıltısı susama işler, her tanesi Gaköy güneşi gibi parlar.'
  },
  {
    id: 'phoenix_garlic',
    name: 'Alev Sarımsağı',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'garlic',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'phoenix_garlic',
    baseGenetics: { sweetness: 65, yield: 60, resistance: 65 },
    discoveryText: 'Anka biberinin ateşi sarımsağa işler, keskinliği daha da yakıcı bir hâl alır.'
  },
  {
    id: 'moonlight_cabbage',
    name: 'Ay Lahanası',
    parentCropA: 'moonlight_rice',
    parentCropB: 'napa_cabbage',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'moonlight_cabbage',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 55 },
    discoveryText: 'Ay pirincinin gümüş ışığı lahana yapraklarına iner, yapraklar ipek gibi parlak ve tatlı olur.'
  },
  {
    {
    id: 'jade_persimmon',
    name: 'Yeşim Hurması',
    parentCropA: 'jade_tea',
    parentCropB: 'persimmon',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'jade_persimmon',
    baseGenetics: { sweetness: 70, yield: 60, resistance: 55 },
    discoveryText: 'Yeşim çayının rengi hurmaya işler, içi yeşim gibi parlayan tatlı bir meyveye dönüşür.'
  },
  {
    id: 'frost_bamboo',
    name: 'Buz Filizi',
    parentCropA: 'frost_garlic',
    parentCropB: 'bamboo_shoot',
    minSweetness: 60,
    minYield: 50,
    resultCropId: 'frost_bamboo',
    baseGenetics: { sweetness: 70, yield: 60, resistance: 65 },
    discoveryText: 'Don sarımsağının soğuğu bambu filizine işler, serinliğiyle tanınan eşsiz bir lezzet doğar.'
  },
  {
    id: 'golden_watermelon',
    name: 'Hükümdar Karpuzu',
    parentCropA: 'golden_melon',
    parentCropB: 'watermelon',
    minSweetness: 70,
    minYield: 60,
    resultCropId: 'golden_watermelon',
    baseGenetics: { sweetness: 80, yield: 70, resistance: 60 },
    discoveryText: 'Altın kavun kökenine döner, karpuzla birleşir; Gaköy’de buna meyvelerin hükümdarı denir.'
  },
  {
    {
    id: 'phoenix_peach',
    name: 'Alev Şeftalisi',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'peach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'phoenix_peach',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 60 },
    discoveryText: 'Anka biberinin ateşi şeftaliyi öper, kızıl alev gibi parlar; tatlılığına hafif bir yakıcılık karışır.'
  },
  {
    id: 'moonlight_corn',
    name: 'Ay Başağı',
    parentCropA: 'moonlight_rice',
    parentCropB: 'corn',
    minSweetness: 60,
    minYield: 65,
    resultCropId: 'moonlight_corn',
    baseGenetics: { sweetness: 70, yield: 75, resistance: 55 },
    discoveryText: 'Ay pirincinin gümüş ışığı mısır başaklarını kutsar, Gaköy ambarlarını dolduran bereket doğar.'
  },
  {
    id: 'jade_chive',
    name: 'Yeşim Frenk Otu',
    parentCropA: 'jade_tea',
    parentCropB: 'chives',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'jade_chive',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Yeşim çayının özü frenk soğanına işler, keskin kokusu yeşim gibi berraklaşır.'
  },
  {
    {
    id: 'frost_pumpkin',
    name: 'Don Kabağı',
    parentCropA: 'frost_garlic',
    parentCropB: 'pumpkin',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'frost_pumpkin',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 65 },
    discoveryText: 'Don sarımsağının soğuğu kabağa işler, serin tadı bal gibi tatlı olur.'
  },
  {
    id: 'emerald_rice',
    name: 'Zümrüt Taneli Pirinç',
    parentCropA: 'emerald_radish',
    parentCropB: 'rice',
    minSweetness: 50,
    minYield: 55,
    resultCropId: 'emerald_rice',
    baseGenetics: { sweetness: 60, yield: 65, resistance: 50 },
    discoveryText: 'Zümrüt turpun rengi pirince geçer, taneleri yeşilimsi bir ışıkla parlar.'
  },
  {
    id: 'pearl_peach',
    name: 'İnci Şeftali',
    parentCropA: 'pearl_grain',
    parentCropB: 'peach',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'pearl_peach',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 55 },
    discoveryText: 'İnci taneli tahıl ile şeftalinin kızıllığı birleşir, meyvesi inci gibi yuvarlak ve parlak olur.'
  },
  {
    {
    id: 'golden_lotus',
    name: 'Altın Nilüfer',
    parentCropA: 'golden_melon',
    parentCropB: 'lotus_seed',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'golden_lotus',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'Altın kavunun ışığı nilüfer tohumuna işler, Gaköy göllerinde altın gibi parlayan bir çiçek açar.'
  },
  {
    id: 'phoenix_broad_bean',
    name: 'Anka Fasulyesi',
    parentCropA: 'phoenix_pepper',
    parentCropB: 'broad_bean',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'phoenix_broad_bean',
    baseGenetics: { sweetness: 60, yield: 65, resistance: 60 },
    discoveryText: 'Anka biberinin alevi baklayı sarar, ateşte yoğrulmuş değerli bir ürün doğar.'
  },
  {
    id: 'moonlight_tea',
    name: 'Ay Filizi Çayı',
    parentCropA: 'moonlight_rice',
    parentCropB: 'tea',
    minSweetness: 65,
    minYield: 55,
    resultCropId: 'moonlight_tea',
    baseGenetics: { sweetness: 75, yield: 65, resistance: 60 },
    discoveryText: 'Ay pirincinin gümüş ışıltısı çay yapraklarına işler, Gaköy bilginlerinin içtiği uzun kokulu bir dem olur.'
  },
  {
    {
    id: 'jade_rapeseed',
    name: 'Yeşim Altın Otu',
    parentCropA: 'jade_tea',
    parentCropB: 'rapeseed',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'jade_rapeseed',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Yeşim çayının yeşili ile kanola çiçeğinin altını birleşir, Gaköy tarlalarında iki renkli bir mucize doğar.'
  },
  {
    id: 'frost_yam',
    name: 'Don Yam Kökü',
    parentCropA: 'frost_garlic',
    parentCropB: 'yam',
    minSweetness: 60,
    minYield: 55,
    resultCropId: 'frost_yam',
    baseGenetics: { sweetness: 70, yield: 65, resistance: 65 },
    discoveryText: 'Don sarımsağının soğuğu yam köküne işler, serin ve yumuşak dokusuyla ağızda erir.'
  },
  // === Üçüncü Nesil Melez Ürünler ===,
  {
    id: 'wind_melon',
    name: 'Rüzgâr Kavunu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_tea',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'wind_melon',
    baseGenetics: { sweetness: 55, yield: 55, resistance: 45 },
    discoveryText: 'Altın meyve ile yeşim çayı rüzgâr ve zamanla yoğrulur, Gaköy ovalarında doğan nadide bir kavun olur.'
  },
  {
    {
    id: 'cloud_bean',
    name: 'Bulut Fasulyesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'phoenix_pepper',
    minSweetness: 40,
    minYield: 40,
    resultCropId: 'cloud_bean',
    baseGenetics: { sweetness: 55, yield: 55, resistance: 45 },
    discoveryText: 'Altın meyve ile anka biberi rüzgârda birleşir, Gaköy göklerinde süzülen bulutlar gibi hafif bir ürün doğar.'
  },
  {
    id: 'rain_rice',
    name: 'Yağmur Pirinci',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'moonlight_rice',
    minSweetness: 41,
    minYield: 41,
    resultCropId: 'rain_rice',
    baseGenetics: { sweetness: 56, yield: 56, resistance: 46 },
    discoveryText: 'Altın meyve ile ay pirinci çiğ ve yağmurla beslenir, göğün bereketini taşıyan bir mahsul olur.'
  },
  {
    id: 'hoar_tuber',
    name: 'Kırağı Yumrusu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'frost_garlic',
    minSweetness: 41,
    minYield: 41,
    resultCropId: 'hoar_tuber',
    baseGenetics: { sweetness: 56, yield: 56, resistance: 46 },
    discoveryText: 'Altın meyve ile don sarımsağı yıldızlı gecede değişir, doğanın özünü taşıyan nadir bir yumruya dönüşür.'
  },
  {
    {
    id: 'thunder_green',
    name: 'Yıldırım Otu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'emerald_radish',
    minSweetness: 41,
    minYield: 41,
    resultCropId: 'thunder_green',
    baseGenetics: { sweetness: 56, yield: 56, resistance: 47 },
    discoveryText: 'Altın meyve ile zümrüt turp dağların gücünü toplar, Gaköy’de buna yıldırımın nimeti denir.'
  },
  {
    id: 'rainbow_fruit',
    name: 'Gökkuşağı Meyvesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_shoot',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'rainbow_fruit',
    baseGenetics: { sweetness: 57, yield: 57, resistance: 47 },
    discoveryText: 'Altın meyve ile yeşim filizi rüzgâr ve yağmurla yoğrulur, yedi renkli bir nimet doğar.'
  },
  {
    id: 'dew_bloom',
    name: 'Çiğ Çiçeği',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_tuber',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'dew_bloom',
    baseGenetics: { sweetness: 57, yield: 57, resistance: 47 },
    discoveryText: 'Altın meyve ile altın yumru sabah çiğiyle birleşir, doğanın saf kokusunu taşıyan bir çiçek açar.'
  },
  {
    {
    id: 'dawn_tea',
    name: 'Şafak Çayı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'peach_blossom_tea',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'dawn_tea',
    baseGenetics: { sweetness: 57, yield: 57, resistance: 48 },
    discoveryText: 'Altın meyve ile şeftali çiçeği çayı sabah çiyiyle arınır, Gaköy’de şafak vakti içilen kutsal dem olur.'
  },
  {
    id: 'dusk_shoot',
    name: 'Alaca Filiz',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'ruby_bean',
    minSweetness: 42,
    minYield: 42,
    resultCropId: 'dusk_shoot',
    baseGenetics: { sweetness: 58, yield: 58, resistance: 48 },
    discoveryText: 'Altın meyve ile kızıl fasulye yıldızlı akşamda değişir, alacakaranlığın özünü taşıyan bir filiz doğar.'
  },
  {
    id: 'star_lotus',
    name: 'Yıldız Nilüferi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'twin_bean',
    minSweetness: 43,
    minYield: 43,
    resultCropId: 'star_lotus',
    baseGenetics: { sweetness: 58, yield: 58, resistance: 49 },
    discoveryText: 'Altın meyve ile ikiz tohumlar gök ve yerin gücünü toplar, Gaköy göllerinde yıldız gibi parlayan bir nilüfer açar.'
  },
  {
    {
    id: 'wind_splendor_wheat',
    name: 'Rüzgâr İhtişam Buğdayı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_melon',
    minSweetness: 43,
    minYield: 43,
    resultCropId: 'wind_splendor_wheat',
    baseGenetics: { sweetness: 58, yield: 58, resistance: 49 },
    discoveryText: 'Altın meyve ile yeşim kavun rüzgâr ve zamanla yoğrulur, Gaköy ovalarında yetişen nadide bir buğday olur.'
  },
  {
    id: 'cloud_splendor_sesame',
    name: 'Bulut İhtişam Susamı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'pearl_grain',
    minSweetness: 43,
    minYield: 43,
    resultCropId: 'cloud_splendor_sesame',
    baseGenetics: { sweetness: 59, yield: 59, resistance: 49 },
    discoveryText: 'Altın meyve ile inci tahıl rüzgârda birleşir, göklerin zarafetini taşıyan bir susam doğar.'
  },
  {
    id: 'rain_splendor_pepper',
    name: 'Yağmur İhtişam Biberi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_corn',
    minSweetness: 44,
    minYield: 44,
    resultCropId: 'rain_splendor_pepper',
    baseGenetics: { sweetness: 59, yield: 59, resistance: 50 },
    discoveryText: 'Altın meyve ile altın başak çiy ve yağmurla beslenir, Gaköy tarlalarında göğün bereketini taşıyan bir biber doğar.'
  },
  {
    {
    id: 'hoar_splendor_root',
    name: 'Kırağı İhtişam Kökü',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'lotus_tea',
    minSweetness: 44,
    minYield: 44,
    resultCropId: 'hoar_splendor_root',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 50 },
    discoveryText: 'Altın meyve ile nilüfer çayı yıldızlı gecede değişir, Gaköy bilginlerinin aradığı nadir bir kök olur.'
  },
  {
    id: 'thunder_splendor_sprout',
    name: 'Yıldırım İhtişam Filizi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_bamboo',
    minSweetness: 44,
    minYield: 44,
    resultCropId: 'thunder_splendor_sprout',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 51 },
    discoveryText: 'Altın meyve ile mor bambu dağların gücünü toplar, Gaköy’de buna yıldırımın filizi denir.'
  },
  {
    id: 'rainbow_splendor_vine',
    name: 'Gökkuşağı İhtişam Asması',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'honey_peach_melon',
    minSweetness: 45,
    minYield: 45,
    resultCropId: 'rainbow_splendor_vine',
    baseGenetics: { sweetness: 60, yield: 60, resistance: 51 },
    discoveryText: 'Altın meyve ile bal şeftali kavunu rüzgâr ve yağmurla yoğrulur, Gaköy bağlarında renk renk uzanan bir asma olur.'
  },
  {
    {
    id: 'dew_splendor_bud',
    name: 'Çiğ İhtişam Tomurcuğu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'fire_bean',
    minSweetness: 45,
    minYield: 45,
    resultCropId: 'dew_splendor_bud',
    baseGenetics: { sweetness: 61, yield: 61, resistance: 52 },
    discoveryText: 'Altın meyve ile ateş fasulyesi sabah rüzgârında birleşir, Gaköy tarlalarında çiğ kokulu bir tomurcuk doğar.'
  },
  {
    id: 'dawn_splendor_orchid',
    name: 'Şafak İhtişam Orkidesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'silk_bean',
    minSweetness: 45,
    minYield: 45,
    resultCropId: 'dawn_splendor_orchid',
    baseGenetics: { sweetness: 61, yield: 61, resistance: 52 },
    discoveryText: 'Altın meyve ile ipek fasulyesi çiy ve sabah ışığıyla yoğrulur, Gaköy’de kutsal sayılan bir çiçek açar.'
  },
  {
    id: 'dusk_splendor_gourd',
    name: 'Alaca İhtişam Kabağı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'double_oil_seed',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'dusk_splendor_gourd',
    baseGenetics: { sweetness: 61, yield: 61, resistance: 52 },
    discoveryText: 'Altın meyve ile çift yağ tohumu yıldızlı akşamda değişir, Gaköy bağlarında yetişen değerli bir kabak olur.'
  },
  {
    {
    id: 'star_splendor_herb',
    name: 'Yıldız İhtişam Otu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'lotus_potato',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'star_splendor_herb',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 53 },
    discoveryText: 'Altın meyve ile nilüfer kökü toprağın ve dağların gücünü toplar, Gaköy’de yıldız gibi parlayan bir ot doğar.'
  },
  {
    id: 'wind_jade3_chestnut',
    name: 'Rüzgâr Yeşim Kestanesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jade_pumpkin',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'wind_jade3_chestnut',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 53 },
    discoveryText: 'Altın meyve ile yeşim kabak rüzgâr ve zamanla yoğrulur, Gaköy ormanlarında yetişen değerli bir kestane olur.'
  },
  {
    id: 'cloud_jade3_apricot',
    name: 'Bulut Yeşim Kayısısı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'crystal_yam',
    minSweetness: 46,
    minYield: 46,
    resultCropId: 'cloud_jade3_apricot',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 54 },
    discoveryText: 'Altın meyve ile kristal yam rüzgârda birleşir, Gaköy göklerinin zarafetini taşıyan bir kayısı doğar.'
  },
  {
    {
    id: 'rain_jade3_pear',
    name: 'Yağmur Yeşim Armudu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'osmanthus_tea',
    minSweetness: 47,
    minYield: 47,
    resultCropId: 'rain_jade3_pear',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 54 },
    discoveryText: 'Altın meyve ile osmanthus çayı çiy ve yağmurla beslenir, Gaköy’de göğün bereketini taşıyan bir armut doğar.'
  },
  {
    id: 'hoar_jade3_berry',
    name: 'Kırağı Yeşim Meyvesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'mountain_bamboo',
    minSweetness: 47,
    minYield: 47,
    resultCropId: 'hoar_jade3_berry',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 54 },
    discoveryText: 'Altın meyve ile dağ bambusu yıldızlı gecede değişir, doğanın özünü taşıyan nadir bir meyveye dönüşür.'
  },
  {
    id: 'thunder_jade3_peach_t',
    name: 'Yıldırım Yeşim Şeftalisi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_fruit',
    minSweetness: 47,
    minYield: 47,
    resultCropId: 'thunder_jade3_peach_t',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 55 },
    discoveryText: 'Altın meyve ile altın sonbahar meyvesi dağların gücünü toplar, Gaköy’de yıldırımın armağanı sayılan bir şeftali olur.'
  },
  {
    {
    id: 'rainbow_jade3_melon',
    name: 'Gökkuşağı Yeşim Kavunu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'nut_potato',
    minSweetness: 48,
    minYield: 48,
    resultCropId: 'rainbow_jade3_melon',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 55 },
    discoveryText: 'Altın meyve ile yer fıstıklı kök rüzgâr ve yağmurla yoğrulur, Gaköy bağlarında renkli bir kavun doğar.'
  },
  {
    id: 'dew_jade3_bean',
    name: 'Çiğ Yeşim Fasulyesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'autumn_bean',
    minSweetness: 48,
    minYield: 48,
    resultCropId: 'dew_jade3_bean',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 56 },
    discoveryText: 'Altın meyve ile sonbahar fasulyesi sabah çiğinde birleşir, doğanın saf lezzetini taşıyan bir ürün olur.'
  },
  {
    id: 'dawn_jade3_rice',
    name: 'Şafak Yeşim Pirinci',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'jujube_blossom',
    minSweetness: 48,
    minYield: 48,
    resultCropId: 'dawn_jade3_rice',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 56 },
    discoveryText: 'Altın meyve ile hünnap çiçeği şafağın çiyiyle yoğrulur, Gaköy tarlalarında kutsal sayılan bir pirinç doğar.'
  },
  {
    {
    id: 'dusk_jade3_tuber',
    name: 'Alaca Yeşim Yumrusu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'ginger_blossom',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'dusk_jade3_tuber',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 56 },
    discoveryText: 'Altın meyve ile zencefil çiçeği yıldızlı akşamda değişir, Gaköy topraklarının özünü taşıyan bir yumru doğar.'
  },
  {
    id: 'star_jade3_green',
    name: 'Yıldız Yeşim Otu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'fairy_chrysanthemum',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'star_jade3_green',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 57 },
    discoveryText: 'Altın meyve ile kutsal krizantem dağların gücünü toplar, Gaköy’de yıldız gibi parlayan bir bitki doğar.'
  },
  {
    id: 'wind_aura_fruit',
    name: 'Rüzgâr Ruh Meyvesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'imperial_cabbage',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'wind_aura_fruit',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 57 },
    discoveryText: 'Altın meyve ile asil lahana rüzgâr ve zamanla yoğrulur, Gaköy’de ruh taşıdığına inanılan bir meyve doğar.'
  },
  {
    {
    id: 'cloud_aura_bloom',
    name: 'Bulut Ruh Çiçeği',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'spicy_radish',
    minSweetness: 49,
    minYield: 49,
    resultCropId: 'cloud_aura_bloom',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 58 },
    discoveryText: 'Altın meyve ile sarımsaklı turp rüzgârda birleşir, Gaköy kırlarında ruh taşıyan bir çiçek doğar.'
  },
  {
    id: 'rain_aura_tea',
    name: 'Yağmur Ruh Çayı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'snow_tea',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'rain_aura_tea',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 58 },
    discoveryText: 'Altın meyve ile kar çayı çiy ve yağmurla arınır, göğün ruhunu taşıyan bir dem olur.'
  },
  {
    id: 'hoar_aura_shoot',
    name: 'Kırağı Ruh Filizi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'spring_chive',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'hoar_aura_shoot',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 58 },
    discoveryText: 'Altın meyve ile bahar frenk otu yıldızlı gecede değişir, Gaköy toprağının özünü taşıyan bir filiz doğar.'
  },
  {
    {
    id: 'thunder_aura_lotus',
    name: 'Yıldırım Ruh Nilüferi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'wheat_potato',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'thunder_aura_lotus',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 59 },
    discoveryText: 'Altın meyve ile buğday kokulu kök dağların gücünü toplar, Gaköy sularında kutsal bir nilüfer açar.'
  },
  {
    id: 'rainbow_aura_wheat',
    name: 'Gökkuşağı Ruh Buğdayı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'spring_green_peach',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'rainbow_aura_wheat',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 59 },
    discoveryText: 'Altın meyve ile yeşil şeftali rüzgâr ve yağmurla yoğrulur, Gaköy tarlalarında renkli başaklar verir.'
  },
  {
    id: 'dew_aura_sesame',
    name: 'Çiğ Ruh Susamı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'mustard_bean',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'dew_aura_sesame',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 60 },
    discoveryText: 'Altın meyve ile hardal kokulu fasulye sabah rüzgârında birleşir, Gaköy’de doğanın ruhunu taşıyan bir susam doğar.'
  },
  {
    {
    id: 'dawn_aura_pepper',
    name: 'Şafak Ruh Biberi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'frost_rapeseed',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'dawn_aura_pepper',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 60 },
    discoveryText: 'Altın meyve ile don kanolası çiy ve sabah ışığıyla yoğrulur, Gaköy’de kutsal sayılan bir biber doğar.'
  },
  {
    id: 'dusk_aura_root',
    name: 'Alaca Ruh Kökü',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_melon',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'dusk_aura_root',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 61 },
    discoveryText: 'Altın meyve ile mor kristal kavun yıldızlı gecede değişir, Gaköy toprağının özünü taşıyan bir kök doğar.'
  },
  {
    id: 'star_aura_sprout',
    name: 'Yıldız Ruh Filizi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'golden_rice',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'star_aura_sprout',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 61 },
    discoveryText: 'Altın meyve ile altın pirinç dağların ve toprağın gücünü toplar, Gaköy’de yıldız gibi doğan bir filiz olur.'
  },
  {
    {
    id: 'wind_glow_vine',
    name: 'Rüzgâr Işıltı Asması',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'double_lotus',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'wind_glow_vine',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 61 },
    discoveryText: 'Altın meyve ile çift nilüfer rüzgâr ve zamanla yoğrulur, Gaköy bağlarında ışık saçan bir asma doğar.'
  },
  {
    id: 'cloud_glow_bud',
    name: 'Bulut Işıltı Tomurcuğu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'fire_sesame',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'cloud_glow_bud',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 62 },
    discoveryText: 'Altın meyve ile ateş susamı rüzgârda birleşir, Gaköy göklerinde parlayan bir tomurcuk doğar.'
  },
  {
    id: 'rain_glow_orchid',
    name: 'Yağmur Işıltı Orkidesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'silk_corn',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'rain_glow_orchid',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 62 },
    discoveryText: 'Altın meyve ile ipek başak çiy ve yağmurla yoğrulur, Gaköy’de kutsal sayılan ışıklı bir çiçek açar.'
  },
  {
    {
    id: 'hoar_glow_gourd',
    name: 'Kırağı Parıltısı Kabağı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_lotus',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'hoar_glow_gourd',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 63 },
    discoveryText: 'Altın kavun ile mor nilüfer yıldız ışığında dönüşür, Gaköy’de doğanın özünden bir kabak doğar.'
  },
  {
    id: 'thunder_glow_herb',
    name: 'Yıldırım Parıltısı Otu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'chrysanthemum_melon',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'thunder_glow_herb',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 63 },
    discoveryText: 'Altın kavun ile krizantem kavunu birleşir, Gaköy’de dağların ve toprağın gücünü taşıyan bir bitki doğar.'
  },
  {
    id: 'rainbow_glow_chestnut',
    name: 'Gökkuşağı Parıltısı Kestanesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'pumpkin_rice',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'rainbow_glow_chestnut',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 63 },
    discoveryText: 'Altın kavun ile kabak pirinci birleşir, Gaköy’de rüzgâr ve yağmurla yoğrulmuş bir kestane doğar.'
  },
  {
    id: 'dew_glow_apricot',
    name: 'Çiy Parıltısı Kayısısı',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'mountain_lotus',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'dew_glow_apricot',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 64 },
    discoveryText: 'Altın kavun ile dağ nilüferi birleşir, Gaköy’de sabah çiyiyle beslenen bir kayısı doğar.'
  },
  {
    id: 'dawn_glow_pear',
    name: 'Şafak Parıltısı Armutu',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'double_nut',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'dawn_glow_pear',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 64 },
    discoveryText: 'Altın kavun ile çift çekirdekli meyve birleşir, Gaköy’de şafak ışığıyla doğan kutsal bir armut ortaya çıkar.'
  },
  {
    id: 'dusk_glow_berry',
    name: 'Alacakaranlık Parıltısı Meyvesi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'sweet_gourd',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'dusk_glow_berry',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 65 },
    discoveryText: 'Altın kavun ile tatlı kabak yıldız ışığında dönüşür, Gaköy’de doğanın özünden bir meyve doğar.'
  },
  {
    id: 'star_glow_peach_t',
    name: 'Yıldız Parıltısı Şeftalisi',
    parentCropA: 'melon_tea_fruit',
    parentCropB: 'purple_persimmon',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'star_glow_peach_t',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 65 },
    discoveryText: 'Altın kavun ile mor hurma birleşir, Gaköy’de dağların ve göğün gücünü taşıyan bir şeftali doğar.'
  },
  // === Dördüncü Nesil Melez Ürünler ===,
  {
    id: 'moon_hua_melon',
    name: 'Ay Işığı Kavunu',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_melon',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'moon_hua_melon',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 52 },
    discoveryText: 'Bal çay meyvesi ile altın kavun birleşir, Gaköy’de ay ışığında parlayan bir kavun doğar.'
  },
  {
    id: 'sun_hua_bean',
    name: 'Güneş Işığı Fasulyesi',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_tea',
    minSweetness: 50,
    minYield: 50,
    resultCropId: 'sun_hua_bean',
    baseGenetics: { sweetness: 62, yield: 62, resistance: 52 },
    discoveryText: 'Bal çay meyvesi ile yeşim çayı birleşir, Gaköy’de güneşin bereketini taşıyan bir fasulye doğar.'
  },  
  {
    id: 'sky_hua_rice',
    name: 'Gök Işığı Pirinci',
    parentCropA: 'wind_melon',
    parentCropB: 'phoenix_pepper',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'sky_hua_rice',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 53 },
    discoveryText: 'Bal çay meyvesi ile anka biberi birleşir, Gaköy’de göğün kutsal gücünü taşıyan bir pirinç doğar.'
  },
  {
    id: 'gem_hua_tuber',
    name: 'Yeşim Işığı Yumrusu',
    parentCropA: 'wind_melon',
    parentCropB: 'moonlight_rice',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'gem_hua_tuber',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 53 },
    discoveryText: 'Bal çay meyvesi ile ay ışığı pirinci birleşir, Gaköy’de yıldızların bereketini taşıyan bir kök doğar.'
  },
  {
    id: 'prism_hua_green',
    name: 'Prizma Işığı Otu',
    parentCropA: 'wind_melon',
    parentCropB: 'frost_garlic',
    minSweetness: 51,
    minYield: 51,
    resultCropId: 'prism_hua_green',
    baseGenetics: { sweetness: 63, yield: 63, resistance: 53 },
    discoveryText: 'Bal çay meyvesi ile kırağı sarımsağı birleşir, Gaköy’de ay ışığında doğmuş kutsal bir bitki ortaya çıkar.'
  },
  {
    id: 'silver_hua_fruit',
    name: 'Gümüş Işığı Meyvesi',
    parentCropA: 'wind_melon',
    parentCropB: 'emerald_radish',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'silver_hua_fruit',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 54 },
    discoveryText: 'Bal çay meyvesi ile zümrüt turp birleşir, Gaköy’de ışıldayan bir meyve doğar.'
  },
  {
    id: 'verdant_hua_bloom',
    name: 'Yeşil Işığı Çiçeği',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_shoot',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'verdant_hua_bloom',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 54 },
    discoveryText: 'Bal çay meyvesi ile yeşim filizi birleşir, Gaköy’de doğanın bereketini yayan bir çiçek açar.'
  },
  {
    id: 'violet_hua_tea',
    name: 'Mor Işığı Çayı',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_tuber',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'violet_hua_tea',
    baseGenetics: { sweetness: 64, yield: 64, resistance: 55 },
    discoveryText: 'Bal çay meyvesi ile altın yumru birleşir, Gaköy’de göksel öz taşıyan bir çay doğar.'
  },
  {
    id: 'scarlet_hua_shoot',
    name: 'Kızıl Işığı Filizi',
    parentCropA: 'wind_melon',
    parentCropB: 'peach_blossom_tea',
    minSweetness: 52,
    minYield: 52,
    resultCropId: 'scarlet_hua_shoot',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Bal çay meyvesi ile şeftali çiçeği çayı birleşir, Gaköy’de kutsal bir filiz doğar.'
  },
{
    id: 'azure_hua_lotus',
    name: 'Gök Işığı Nilüferi',
    parentCropA: 'wind_melon',
    parentCropB: 'ruby_bean',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'azure_hua_lotus',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 55 },
    discoveryText: 'Bal çay meyvesi ile yakut fasulye ay ışığında dönüşür, gaKöy’de göğün armağanı bir nilüfer açar.'
  },
  {
    id: 'moon_shine_wheat',
    name: 'Ay Parıltısı Buğdayı',
    parentCropA: 'wind_melon',
    parentCropB: 'twin_bean',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'moon_shine_wheat',
    baseGenetics: { sweetness: 65, yield: 65, resistance: 56 },
    discoveryText: 'Bal çay meyvesi ile ikiz fasulye gök ışığında birleşir, gaKöy tarlalarında ay gibi parlayan başaklar verir.'
  },
  {
    id: 'sun_shine_sesame',
    name: 'Güneş Parıltısı Susamı',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_melon',
    minSweetness: 53,
    minYield: 53,
    resultCropId: 'sun_shine_sesame',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 56 },
    discoveryText: 'Bal çay meyvesi ile yeşim kavunu gün ile ayın özünü taşır, gaKöy’de altın gibi parlayan susamlar doğar.'
  },
  {
    id: 'sky_shine_pepper',
    name: 'Gök Parıltısı Biberi',
    parentCropA: 'wind_melon',
    parentCropB: 'pearl_grain',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'sky_shine_pepper',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 56 },
    discoveryText: 'Bal çay meyvesi ile inci tanesi gök ile yerin gücünü toplar, gaKöy’de kutsal sayılan bir biber doğar.'
  },
  {
    id: 'gem_shine_root',
    name: 'Yeşim Parıltısı Kökü',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_corn',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'gem_shine_root',
    baseGenetics: { sweetness: 66, yield: 66, resistance: 57 },
    discoveryText: 'Bal çay meyvesi ile altın mısır yıldız ışığıyla yoğrulur, gaKöy toprağında uğur getiren bir kök doğar.'
  },
  {
    id: 'prism_shine_sprout',
    name: 'Prizma Parıltısı Filizi',
    parentCropA: 'wind_melon',
    parentCropB: 'lotus_tea',
    minSweetness: 54,
    minYield: 54,
    resultCropId: 'prism_shine_sprout',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 57 },
    discoveryText: 'Bal çay meyvesi ile nilüfer çayı ay ışığında dönüşür, gaKöy’de göğün bağışı sayılan bir filiz doğar.'
  },
  {
    id: 'silver_shine_vine',
    name: 'Gümüş Parıltısı Asması',
    parentCropA: 'wind_melon',
    parentCropB: 'purple_bamboo',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'silver_shine_vine',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 58 },
    discoveryText: 'Bal çay meyvesi ile mor bambu gök ışığında birleşir, gaKöy bağlarında gümüş gibi parlayan bir asma doğar.'
  },
  {
    id: 'verdant_shine_bud',
    name: 'Yeşil Parıltısı Tomurcuğu',
    parentCropA: 'wind_melon',
    parentCropB: 'honey_peach_melon',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'verdant_shine_bud',
    baseGenetics: { sweetness: 67, yield: 67, resistance: 58 },
    discoveryText: 'Bal çay meyvesi ile bal şeftali kavunu gün ile ayın özünü taşır, gaKöy’de ışık saçan bir tomurcuk doğar.'
  },
  {
    id: 'violet_shine_orchid',
    name: 'Mor Parıltısı Orkidesi',
    parentCropA: 'wind_melon',
    parentCropB: 'fire_bean',
    minSweetness: 55,
    minYield: 55,
    resultCropId: 'violet_shine_orchid',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 58 },
    discoveryText: 'Bal çay meyvesi ile ateş fasulyesi gök ile yerin gücünü toplar, gaKöy’de mor ışık saçan bir orkide doğar.'
  },
  {
    id: 'scarlet_shine_gourd',
    name: 'Kızıl Parıltısı Kabağı',
    parentCropA: 'wind_melon',
    parentCropB: 'silk_bean',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'scarlet_shine_gourd',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 59 },
    discoveryText: 'Bal çay meyvesi ile ipek fasulye yıldız ışığıyla yoğrulur, gaKöy’de uğur getiren kızıl bir kabak doğar.'
  },
  {
    id: 'azure_shine_herb',
    name: 'Gök Parıltısı Otu',
    parentCropA: 'wind_melon',
    parentCropB: 'double_oil_seed',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'azure_shine_herb',
    baseGenetics: { sweetness: 68, yield: 68, resistance: 59 },
    discoveryText: 'Bal çay meyvesi ile çift yağ tohumu ay ışığında dönüşür, gaKöy’de göğün bağışı sayılan bir ot doğar.'
  },
  {
    id: 'moon_fortune_chestnut',
    name: 'Ay Uğuru Kestanesi',
    parentCropA: 'wind_melon',
    parentCropB: 'lotus_potato',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'moon_fortune_chestnut',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 59 },
    discoveryText: 'Bal çay meyvesi ile nilüfer yumrusu gök ışığında birleşir, gaKöy ormanlarında uğur getiren bir kestane doğar.'
  },
  {
    id: 'sun_fortune_apricot',
    name: 'Güneş Uğuru Kayısısı',
    parentCropA: 'wind_melon',
    parentCropB: 'jade_pumpkin',
    minSweetness: 56,
    minYield: 56,
    resultCropId: 'sun_fortune_apricot',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 60 },
    discoveryText: 'Bal çay meyvesi ile yeşim kabak gün ile ayın özünü taşır, gaKöy’de kutlu bir kayısı doğar.'
  },
  {
    id: 'sky_fortune_pear',
    name: 'Gök Uğuru Armudu',
    parentCropA: 'wind_melon',
    parentCropB: 'crystal_yam',
    minSweetness: 57,
    minYield: 57,
    resultCropId: 'sky_fortune_pear',
    baseGenetics: { sweetness: 69, yield: 69, resistance: 60 },
    discoveryText: 'Bal çay meyvesi ile billur yam gök ile yerin gücünü toplar, gaKöy’de parıltılı bir armut doğar.'
  },
  {
    id: 'gem_fortune_berry',
    name: 'Yeşim Uğuru Meyvesi',
    parentCropA: 'wind_melon',
    parentCropB: 'osmanthus_tea',
    minSweetness: 57,
    minYield: 57,
    resultCropId: 'gem_fortune_berry',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 60 },
    discoveryText: 'Bal çay meyvesi ile osmanthus çayı yıldız ışığıyla yoğrulur, gaKöy’de uğur getiren bir meyve doğar.'
  },
  {
    id: 'prism_fortune_peach_t',
    name: 'Prizma Uğuru Şeftalisi',
    parentCropA: 'wind_melon',
    parentCropB: 'mountain_bamboo',
    minSweetness: 57,
    minYield: 57,
    resultCropId: 'prism_fortune_peach_t',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 61 },
    discoveryText: 'Bal çay meyvesi ile dağ bambusu ay ışığında dönüşür, gaKöy’de göğün bağışı sayılan bir şeftali doğar.'
  },
  {
    id: 'silver_fortune_melon',
    name: 'Gümüş Uğuru Kavunu',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_fruit',
    minSweetness: 58,
    minYield: 58,
    resultCropId: 'silver_fortune_melon',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 61 },
    discoveryText: 'Bal çay meyvesi ile altın güz meyvesi gök ışığında birleşir, gaKöy’de gümüş gibi parlayan bir kavun doğar.'
  },
  {
    id: 'verdant_fortune_bean',
    name: 'Yeşil Uğuru Fasulyesi',
    parentCropA: 'wind_melon',
    parentCropB: 'nut_potato',
    minSweetness: 58,
    minYield: 58,
    resultCropId: 'verdant_fortune_bean',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 62 },
    discoveryText: 'Bal çay meyvesi ile yer fıstıklı yumru gün ile ayın özünü taşır, gaKöy tarlalarında bereketli bir fasulye doğar.'
  },
  {
    id: 'violet_fortune_rice',
    name: 'Mor Uğuru Pirinci',
    parentCropA: 'wind_melon',
    parentCropB: 'autumn_bean',
    minSweetness: 58,
    minYield: 58,
    resultCropId: 'violet_fortune_rice',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 62 },
    discoveryText: 'Bal çay meyvesi ile güz fasulyesi gök ile yerin gücünü toplar, gaKöy’de mor parıltılı bir pirinç doğar.'
  },
  {
    id: 'scarlet_fortune_tuber',
    name: '丹瑞薯',
    parentCropA: 'wind_melon',
    parentCropB: 'jujube_blossom',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'scarlet_fortune_tuber',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 62 },
    discoveryText: '蜜茶果与枣花桃沐浴星辉，祥瑞之兆。'
  },
  {
    id: 'azure_fortune_green',
    name: '青瑞菜',
    parentCropA: 'wind_melon',
    parentCropB: 'ginger_blossom',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'azure_fortune_green',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 63 },
    discoveryText: '蜜茶果与姜花菜在月华中蜕变，天赐之品。'
  },
  {
    id: 'moon_glory_fruit',
    name: '月祥果',
    parentCropA: 'wind_melon',
    parentCropB: 'fairy_chrysanthemum',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'moon_glory_fruit',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 63 },
    discoveryText: '蜜茶果与仙菊菜在天光下交融，绽放华彩。'
  },
  {
    id: 'sun_glory_bloom',
    name: '日祥花',
    parentCropA: 'wind_melon',
    parentCropB: 'imperial_cabbage',
    minSweetness: 59,
    minYield: 59,
    resultCropId: 'sun_glory_bloom',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 63 },
    discoveryText: '蜜茶果与御品白菜承日月精华，辉映四方。'
  },
  {
    id: 'sky_glory_tea',
    name: '天祥茶',
    parentCropA: 'wind_melon',
    parentCropB: 'spicy_radish',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'sky_glory_tea',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 64 },
    discoveryText: '蜜茶果与蒜香萝卜凝天地灵气，瑞光盈盈。'
  },
  {
    id: 'gem_glory_shoot',
    name: '玉祥笋',
    parentCropA: 'wind_melon',
    parentCropB: 'snow_tea',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'gem_glory_shoot',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 64 },
    discoveryText: '蜜茶果与雪茶沐浴星辉，祥瑞之兆。'
  },
  {
    id: 'prism_glory_lotus',
    name: '琉祥莲',
    parentCropA: 'wind_melon',
    parentCropB: 'spring_chive',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'prism_glory_lotus',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 64 },
    discoveryText: '蜜茶果与春韭菜在月华中蜕变，天赐之品。'
  },
  {
    id: 'silver_glory_wheat',
    name: '银祥麦',
    parentCropA: 'wind_melon',
    parentCropB: 'wheat_potato',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'silver_glory_wheat',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 65 },
    discoveryText: '蜜茶果与麦香薯在天光下交融，绽放华彩。'
  },
  {
    id: 'verdant_glory_sesame',
    name: '翠祥芝',
    parentCropA: 'wind_melon',
    parentCropB: 'spring_green_peach',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'verdant_glory_sesame',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 65 },
    discoveryText: '蜜茶果与绿桃承日月精华，辉映四方。'
  },
  {
    id: 'violet_glory_pepper',
    name: '紫祥椒',
    parentCropA: 'wind_melon',
    parentCropB: 'mustard_bean',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'violet_glory_pepper',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 66 },
    discoveryText: '蜜茶果与芥香豆凝天地灵气，瑞光盈盈。'
  },
  {
    id: 'scarlet_glory_root',
    name: '丹祥参',
    parentCropA: 'wind_melon',
    parentCropB: 'frost_rapeseed',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'scarlet_glory_root',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 66 },
    discoveryText: '蜜茶果与霜油菜沐浴星辉，祥瑞之兆。'
  },
  {
    id: 'azure_glory_sprout',
    name: '青祥芽',
    parentCropA: 'wind_melon',
    parentCropB: 'purple_melon',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'azure_glory_sprout',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 66 },
    discoveryText: '蜜茶果与紫晶瓜在月华中蜕变，天赐之品。'
  },
  {
    id: 'moon_prism4_vine',
    name: '月彩藤',
    parentCropA: 'wind_melon',
    parentCropB: 'golden_rice',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'moon_prism4_vine',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 67 },
    discoveryText: '蜜茶果与金芝稻在天光下交融，绽放华彩。'
  },
  {
    id: 'sun_prism4_bud',
    name: '日彩蕾',
    parentCropA: 'wind_melon',
    parentCropB: 'double_lotus',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'sun_prism4_bud',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 67 },
    discoveryText: '蜜茶果与双莲承日月精华，辉映四方。'
  },
  {
    id: 'sky_prism4_orchid',
    name: '天彩兰',
    parentCropA: 'wind_melon',
    parentCropB: 'fire_sesame',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'sky_prism4_orchid',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 67 },
    discoveryText: '蜜茶果与火麻仁凝天地灵气，瑞光盈盈。'
  },
  {
    id: 'gem_prism4_gourd',
    name: '玉彩葫',
    parentCropA: 'wind_melon',
    parentCropB: 'silk_corn',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'gem_prism4_gourd',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 68 },
    discoveryText: '蜜茶果与丝穗沐浴星辉，祥瑞之兆。'
  },
  {
    id: 'prism_prism4_herb',
    name: '琉彩草',
    parentCropA: 'wind_melon',
    parentCropB: 'purple_lotus',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'prism_prism4_herb',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 68 },
    discoveryText: '蜜茶果与紫莲茄在月华中蜕变，天赐之品。'
  },
  {
    id: 'silver_prism4_chestnut',
    name: '银彩栗',
    parentCropA: 'wind_melon',
    parentCropB: 'chrysanthemum_melon',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'silver_prism4_chestnut',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 69 },
    discoveryText: '蜜茶果与菊瓜在天光下交融，绽放华彩。'
  },
  {
    id: 'verdant_prism4_apricot',
    name: '翠彩杏',
    parentCropA: 'wind_melon',
    parentCropB: 'pumpkin_rice',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'verdant_prism4_apricot',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 69 },
    discoveryText: '蜜茶果与南瓜稻承日月精华，辉映四方。'
  },
  {
    id: 'violet_prism4_pear',
    name: '紫彩梨',
    parentCropA: 'wind_melon',
    parentCropB: 'mountain_lotus',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'violet_prism4_pear',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 69 },
    discoveryText: '蜜茶果与山莲凝天地灵气，瑞光盈盈。'
  },
  {
    id: 'scarlet_prism4_berry',
    name: '丹彩莓',
    parentCropA: 'wind_melon',
    parentCropB: 'double_nut',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'scarlet_prism4_berry',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 70 },
    discoveryText: '蜜茶果与双果仁沐浴星辉，祥瑞之兆。'
  },
  {
    id: 'azure_prism4_peach_t',
    name: '青彩桃',
    parentCropA: 'wind_melon',
    parentCropB: 'sweet_gourd',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'azure_prism4_peach_t',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 70 },
    discoveryText: '蜜茶果与甜丝瓜在月华中蜕变，天赐之品。'
  },
  // === 五代杂交作物 ===,
  {
    id: 'precious_light5_melon',
    name: '瑶光瓜',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'melon_tea_fruit',
    minSweetness: 60,
    minYield: 60,
    resultCropId: 'precious_light5_melon',
    baseGenetics: { sweetness: 70, yield: 70, resistance: 60 },
    discoveryText: '风瓜与蜜茶果的精华凝结，珍贵异常。'
  },
  {
    id: 'rare_light5_bean',
    name: '琼光豆',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'dragon_fire',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'rare_light5_bean',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 61 },
    discoveryText: '风瓜与龙火椒在晨曦中绽放瑶光。'
  },
  {
    id: 'magnif_light5_rice',
    name: '瑰光稻',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'celestial_rice',
    minSweetness: 61,
    minYield: 61,
    resultCropId: 'magnif_light5_rice',
    baseGenetics: { sweetness: 71, yield: 71, resistance: 62 },
    discoveryText: '风瓜与天香稻汇聚琼露，锦绣天成。'
  },
  {
    id: 'radiant_light5_tuber',
    name: '曦光薯',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'ice_lotus',
    minSweetness: 62,
    minYield: 62,
    resultCropId: 'radiant_light5_tuber',
    baseGenetics: { sweetness: 72, yield: 72, resistance: 62 },
    discoveryText: '风瓜与冰莲璃光交映，绮丽非凡。'
  },
  {
    id: 'lustrous_light5_green',
    name: '璃光菜',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'jade_peach_tea',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'lustrous_light5_green',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 63 },
    discoveryText: '风瓜与翠桃茶凝珊瑚之精，琳琅之品。'
  },
  {
    id: 'precious_hua5_fruit',
    name: '瑶华果',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'golden_dragon',
    minSweetness: 63,
    minYield: 63,
    resultCropId: 'precious_hua5_fruit',
    baseGenetics: { sweetness: 73, yield: 73, resistance: 64 },
    discoveryText: '风瓜与金龙果的精华凝结，珍贵异常。'
  },
  {
    id: 'rare_hua5_bloom',
    name: '琼华花',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'moonlight_frost',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'rare_hua5_bloom',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 65 },
    discoveryText: '风瓜与月霜稻在晨曦中绽放瑶光。'
  },
  {
    id: 'magnif_hua5_tea',
    name: '瑰华茶',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'jade_golden_melon',
    minSweetness: 64,
    minYield: 64,
    resultCropId: 'magnif_hua5_tea',
    baseGenetics: { sweetness: 74, yield: 74, resistance: 65 },
    discoveryText: '风瓜与翡翠金瓜汇聚琼露，锦绣天成。'
  },
  {
    id: 'radiant_hua5_shoot',
    name: '曦华笋',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'immortal_flower',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'radiant_hua5_shoot',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 66 },
    discoveryText: '风瓜与仙人花璃光交映，绮丽非凡。'
  },
  {
    id: 'lustrous_hua5_lotus',
    name: '璃华莲',
    parentCropA: 'moon_hua_melon',
    parentCropB: 'dragon_pearl',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'lustrous_hua5_lotus',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 67 },
    discoveryText: '风瓜与龙珠凝珊瑚之精，琳琅之品。'
  },
  {
    id: 'precious_dewdrop_wheat',
    name: '瑶露麦',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'ice_lotus',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'precious_dewdrop_wheat',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 68 },
    discoveryText: '云豆与冰莲的精华凝结，珍贵异常。'
  },
  {
    id: 'rare_dewdrop_sesame',
    name: '琼露芝',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'jade_peach_tea',
    minSweetness: 67,
    minYield: 67,
    resultCropId: 'rare_dewdrop_sesame',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 68 },
    discoveryText: '云豆与翠桃茶在晨曦中绽放瑶光。'
  },
  {
    id: 'magnif_dewdrop_pepper',
    name: '瑰露椒',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'golden_dragon',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'magnif_dewdrop_pepper',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 69 },
    discoveryText: '云豆与金龙果汇聚琼露，锦绣天成。'
  },
  {
    id: 'radiant_dewdrop_root',
    name: '曦露参',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'moonlight_frost',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'radiant_dewdrop_root',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 70 },
    discoveryText: '云豆与月霜稻璃光交映，绮丽非凡。'
  },
  {
    id: 'lustrous_dewdrop_sprout',
    name: '璃露芽',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'jade_golden_melon',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'lustrous_dewdrop_sprout',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 71 },
    discoveryText: '云豆与翡翠金瓜凝珊瑚之精，琳琅之品。'
  },
  {
    id: 'precious_soul_vine',
    name: '瑶灵藤',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'immortal_flower',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'precious_soul_vine',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 71 },
    discoveryText: '云豆与仙人花的精华凝结，珍贵异常。'
  },
  {
    id: 'rare_soul_bud',
    name: '琼灵蕾',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'dragon_pearl',
    minSweetness: 70,
    minYield: 70,
    resultCropId: 'rare_soul_bud',
    baseGenetics: { sweetness: 80, yield: 80, resistance: 72 },
    discoveryText: '云豆与龙珠在晨曦中绽放瑶光。'
  },
  {
    id: 'magnif_soul_orchid',
    name: '瑰灵兰',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'melon_tea_fruit',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'magnif_soul_orchid',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 73 },
    discoveryText: '云豆与蜜茶果汇聚琼露，锦绣天成。'
  },
  {
    id: 'radiant_soul_gourd',
    name: '曦灵葫',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'dragon_fire',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'radiant_soul_gourd',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 74 },
    discoveryText: '云豆与龙火椒璃光交映，绮丽非凡。'
  },
  {
    id: 'lustrous_soul_herb',
    name: '璃灵草',
    parentCropA: 'sun_hua_bean',
    parentCropB: 'celestial_rice',
    minSweetness: 72,
    minYield: 72,
    resultCropId: 'lustrous_soul_herb',
    baseGenetics: { sweetness: 82, yield: 82, resistance: 74 },
    discoveryText: '云豆与天香稻凝珊瑚之精，琳琅之品。'
  },
  {
    id: 'precious_silk5_chestnut',
    name: '瑶锦栗',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'moonlight_frost',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'precious_silk5_chestnut',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 75 },
    discoveryText: '雨稻与月霜稻的精华凝结，珍贵异常。'
  },
  {
    id: 'rare_silk5_apricot',
    name: '琼锦杏',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'jade_golden_melon',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'rare_silk5_apricot',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 76 },
    discoveryText: '雨稻与翡翠金瓜在晨曦中绽放瑶光。'
  },
  {
    id: 'magnif_silk5_pear',
    name: '瑰锦梨',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'immortal_flower',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'magnif_silk5_pear',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 77 },
    discoveryText: '雨稻与仙人花汇聚琼露，锦绣天成。'
  },
  {
    id: 'radiant_silk5_berry',
    name: '曦锦莓',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'dragon_pearl',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'radiant_silk5_berry',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 77 },
    discoveryText: '雨稻与龙珠璃光交映，绮丽非凡。'
  },
  {
    id: 'lustrous_silk5_peach_t',
    name: '璃锦桃',
    parentCropA: 'sky_hua_rice',
    parentCropB: 'melon_tea_fruit',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'lustrous_silk5_peach_t',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 78 },
    discoveryText: '雨稻与蜜茶果凝珊瑚之精，琳琅之品。'
  },
  // === 六代杂交作物 ===,
  {
    id: 'spirit_wonder_melon',
    name: '灵妙瓜',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'wind_melon',
    minSweetness: 65,
    minYield: 65,
    resultCropId: 'spirit_wonder_melon',
    baseGenetics: { sweetness: 75, yield: 75, resistance: 65 },
    discoveryText: '月华瓜与风瓜灵气交汇，仙韵天成。'
  },
  {
    id: 'fairy_wonder_bean',
    name: '仙妙豆',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'cloud_bean',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'fairy_wonder_bean',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 66 },
    discoveryText: '月华瓜与云豆圣华流转，超凡入圣。'
  },
  {
    id: 'holy_wonder_rice',
    name: '圣妙稻',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rain_rice',
    minSweetness: 66,
    minYield: 66,
    resultCropId: 'holy_wonder_rice',
    baseGenetics: { sweetness: 76, yield: 76, resistance: 66 },
    discoveryText: '月华瓜与雨稻神妙莫测，真灵之品。'
  },
  {
    id: 'divine_wonder_tuber',
    name: '神妙薯',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'hoar_tuber',
    minSweetness: 67,
    minYield: 67,
    resultCropId: 'divine_wonder_tuber',
    baseGenetics: { sweetness: 77, yield: 77, resistance: 67 },
    discoveryText: '月华瓜与霜薯幻梦交织，禅意盎然。'
  },
  {
    id: 'trueth_wonder_green',
    name: '真妙菜',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'thunder_green',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'trueth_wonder_green',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 68 },
    discoveryText: '月华瓜与雷菜仙灵缭绕，不染尘埃。'
  },
  {
    id: 'spirit_grace6_fruit',
    name: '灵华果',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rainbow_fruit',
    minSweetness: 68,
    minYield: 68,
    resultCropId: 'spirit_grace6_fruit',
    baseGenetics: { sweetness: 78, yield: 78, resistance: 69 },
    discoveryText: '月华瓜与虹果灵气交汇，仙韵天成。'
  },
  {
    id: 'fairy_grace6_bloom',
    name: '仙华花',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dew_bloom',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'fairy_grace6_bloom',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 69 },
    discoveryText: '月华瓜与露花圣华流转，超凡入圣。'
  },
  {
    id: 'holy_grace6_tea',
    name: '圣华茶',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dawn_tea',
    minSweetness: 69,
    minYield: 69,
    resultCropId: 'holy_grace6_tea',
    baseGenetics: { sweetness: 79, yield: 79, resistance: 70 },
    discoveryText: '月华瓜与晨茶神妙莫测，真灵之品。'
  },
  {
    id: 'divine_grace6_shoot',
    name: '神华笋',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dusk_shoot',
    minSweetness: 70,
    minYield: 70,
    resultCropId: 'divine_grace6_shoot',
    baseGenetics: { sweetness: 80, yield: 80, resistance: 71 },
    discoveryText: '月华瓜与暮笋幻梦交织，禅意盎然。'
  },
  {
    id: 'trueth_grace6_lotus',
    name: '真华莲',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'star_lotus',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'trueth_grace6_lotus',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 71 },
    discoveryText: '月华瓜与星莲仙灵缭绕，不染尘埃。'
  },
  {
    id: 'spirit_phantom_wheat',
    name: '灵幻麦',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'wind_splendor_wheat',
    minSweetness: 71,
    minYield: 71,
    resultCropId: 'spirit_phantom_wheat',
    baseGenetics: { sweetness: 81, yield: 81, resistance: 72 },
    discoveryText: '月华瓜与风华麦灵气交汇，仙韵天成。'
  },
  {
    id: 'fairy_phantom_sesame',
    name: '仙幻芝',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'cloud_splendor_sesame',
    minSweetness: 72,
    minYield: 72,
    resultCropId: 'fairy_phantom_sesame',
    baseGenetics: { sweetness: 82, yield: 82, resistance: 73 },
    discoveryText: '月华瓜与云华芝圣华流转，超凡入圣。'
  },
  {
    id: 'holy_phantom_pepper',
    name: '圣幻椒',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rain_splendor_pepper',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'holy_phantom_pepper',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 74 },
    discoveryText: '月华瓜与雨华椒神妙莫测，真灵之品。'
  },
  {
    id: 'divine_phantom_root',
    name: '神幻参',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'hoar_splendor_root',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'divine_phantom_root',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 74 },
    discoveryText: '月华瓜与霜华参幻梦交织，禅意盎然。'
  },
  {
    id: 'trueth_phantom_sprout',
    name: '真幻芽',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'thunder_splendor_sprout',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'trueth_phantom_sprout',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 75 },
    discoveryText: '月华瓜与雷华芽仙灵缭绕，不染尘埃。'
  },
  {
    id: 'spirit_dream_vine',
    name: '灵梦藤',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rainbow_splendor_vine',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'spirit_dream_vine',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 76 },
    discoveryText: '月华瓜与虹华藤灵气交汇，仙韵天成。'
  },
  {
    id: 'fairy_dream_bud',
    name: '仙梦蕾',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dew_splendor_bud',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'fairy_dream_bud',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 76 },
    discoveryText: '月华瓜与露华蕾圣华流转，超凡入圣。'
  },
  {
    id: 'holy_dream_orchid',
    name: '圣梦兰',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dawn_splendor_orchid',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'holy_dream_orchid',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 77 },
    discoveryText: '月华瓜与晨华兰神妙莫测，真灵之品。'
  },
  {
    id: 'divine_dream_gourd',
    name: '神梦葫',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'dusk_splendor_gourd',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'divine_dream_gourd',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 78 },
    discoveryText: '月华瓜与暮华葫幻梦交织，禅意盎然。'
  },
  {
    id: 'trueth_dream_herb',
    name: '真梦草',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'star_splendor_herb',
    minSweetness: 77,
    minYield: 77,
    resultCropId: 'trueth_dream_herb',
    baseGenetics: { sweetness: 87, yield: 87, resistance: 78 },
    discoveryText: '月华瓜与星华草仙灵缭绕，不染尘埃。'
  },
  {
    id: 'spirit_zen_chestnut',
    name: '灵禅栗',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'wind_jade3_chestnut',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'spirit_zen_chestnut',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 79 },
    discoveryText: '月华瓜与风翠栗灵气交汇，仙韵天成。'
  },
  {
    id: 'fairy_zen_apricot',
    name: '仙禅杏',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'cloud_jade3_apricot',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'fairy_zen_apricot',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 80 },
    discoveryText: '月华瓜与云翠杏圣华流转，超凡入圣。'
  },
  {
    id: 'holy_zen_pear',
    name: '圣禅梨',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'rain_jade3_pear',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'holy_zen_pear',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: '月华瓜与雨翠梨神妙莫测，真灵之品。'
  },
  {
    id: 'divine_zen_berry',
    name: '神禅莓',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'hoar_jade3_berry',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'divine_zen_berry',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: '月华瓜与霜翠莓幻梦交织，禅意盎然。'
  },
  {
    id: 'trueth_zen_peach_t',
    name: '真禅桃',
    parentCropA: 'precious_light5_melon',
    parentCropB: 'thunder_jade3_peach_t',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'trueth_zen_peach_t',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 82 },
    discoveryText: '月华瓜与雷翠桃仙灵缭绕，不染尘埃。'
  },
  // === 七代杂交作物 ===,
  {
    id: 'draco_song_melon',
    name: '龙吟瓜',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'moon_hua_melon',
    minSweetness: 72,
    minYield: 72,
    resultCropId: 'draco_song_melon',
    baseGenetics: { sweetness: 82, yield: 82, resistance: 72 },
    discoveryText: '瑶光瓜与月华瓜的神力融合，有神兽之威。'
  },
  {
    id: 'fenghuang_song_bean',
    name: '凤吟豆',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sun_hua_bean',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'fenghuang_song_bean',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 73 },
    discoveryText: '瑶光瓜与日华豆龙吟凤鸣，瑞兽降世。'
  },
  {
    id: 'qilin_song_rice',
    name: '麟吟稻',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sky_hua_rice',
    minSweetness: 73,
    minYield: 73,
    resultCropId: 'qilin_song_rice',
    baseGenetics: { sweetness: 83, yield: 83, resistance: 73 },
    discoveryText: '瑶光瓜与天华稻虎啸山林，鹤舞九天。'
  },
  {
    id: 'crane_song_tuber',
    name: '鹤吟薯',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'gem_hua_tuber',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'crane_song_tuber',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 74 },
    discoveryText: '瑶光瓜与玉华薯麟光闪耀，百兽朝拜。'
  },
  {
    id: 'tiger_song_green',
    name: '虎吟菜',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'prism_hua_green',
    minSweetness: 74,
    minYield: 74,
    resultCropId: 'tiger_song_green',
    baseGenetics: { sweetness: 84, yield: 84, resistance: 75 },
    discoveryText: '瑶光瓜与琉华菜蛟龙出水，威震八方。'
  },
  {
    id: 'draco_dance_fruit',
    name: '龙舞果',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'silver_hua_fruit',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'draco_dance_fruit',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 75 },
    discoveryText: '瑶光瓜与银华果的神力融合，有神兽之威。'
  },
  {
    id: 'fenghuang_dance_bloom',
    name: '凤舞花',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'verdant_hua_bloom',
    minSweetness: 75,
    minYield: 75,
    resultCropId: 'fenghuang_dance_bloom',
    baseGenetics: { sweetness: 85, yield: 85, resistance: 76 },
    discoveryText: '瑶光瓜与翠华花龙吟凤鸣，瑞兽降世。'
  },
  {
    id: 'qilin_dance_tea',
    name: '麟舞茶',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'violet_hua_tea',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'qilin_dance_tea',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 77 },
    discoveryText: '瑶光瓜与紫华茶虎啸山林，鹤舞九天。'
  },
  {
    id: 'crane_dance_shoot',
    name: '鹤舞笋',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'scarlet_hua_shoot',
    minSweetness: 76,
    minYield: 76,
    resultCropId: 'crane_dance_shoot',
    baseGenetics: { sweetness: 86, yield: 86, resistance: 77 },
    discoveryText: '瑶光瓜与丹华笋麟光闪耀，百兽朝拜。'
  },
  {
    id: 'tiger_dance_lotus',
    name: '虎舞莲',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'azure_hua_lotus',
    minSweetness: 77,
    minYield: 77,
    resultCropId: 'tiger_dance_lotus',
    baseGenetics: { sweetness: 87, yield: 87, resistance: 78 },
    discoveryText: '瑶光瓜与青华莲蛟龙出水，威震八方。'
  },
  {
    id: 'draco_gleam7_wheat',
    name: '龙辉麦',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'moon_shine_wheat',
    minSweetness: 77,
    minYield: 77,
    resultCropId: 'draco_gleam7_wheat',
    baseGenetics: { sweetness: 87, yield: 87, resistance: 79 },
    discoveryText: '瑶光瓜与月辉麦的神力融合，有神兽之威。'
  },
  {
    id: 'fenghuang_gleam7_sesame',
    name: '凤辉芝',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sun_shine_sesame',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'fenghuang_gleam7_sesame',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 79 },
    discoveryText: '瑶光瓜与日辉芝龙吟凤鸣，瑞兽降世。'
  },
  {
    id: 'qilin_gleam7_pepper',
    name: '麟辉椒',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sky_shine_pepper',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'qilin_gleam7_pepper',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 80 },
    discoveryText: '瑶光瓜与天辉椒虎啸山林，鹤舞九天。'
  },
  {
    id: 'crane_gleam7_root',
    name: '鹤辉参',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'gem_shine_root',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'crane_gleam7_root',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: '瑶光瓜与玉辉参麟光闪耀，百兽朝拜。'
  },
  {
    id: 'tiger_gleam7_sprout',
    name: '虎辉芽',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'prism_shine_sprout',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'tiger_gleam7_sprout',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 81 },
    discoveryText: '瑶光瓜与琉辉芽蛟龙出水，威震八方。'
  },
  {
    id: 'draco_shadow_vine',
    name: '龙影藤',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'silver_shine_vine',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'draco_shadow_vine',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 82 },
    discoveryText: '瑶光瓜与银辉藤的神力融合，有神兽之威。'
  },
  {
    id: 'fenghuang_shadow_bud',
    name: '凤影蕾',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'verdant_shine_bud',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'fenghuang_shadow_bud',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 83 },
    discoveryText: '瑶光瓜与翠辉蕾龙吟凤鸣，瑞兽降世。'
  },
  {
    id: 'qilin_shadow_orchid',
    name: '麟影兰',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'violet_shine_orchid',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'qilin_shadow_orchid',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 83 },
    discoveryText: '瑶光瓜与紫辉兰虎啸山林，鹤舞九天。'
  },
  {
    id: 'crane_shadow_gourd',
    name: '鹤影葫',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'scarlet_shine_gourd',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'crane_shadow_gourd',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 84 },
    discoveryText: '瑶光瓜与丹辉葫麟光闪耀，百兽朝拜。'
  },
  {
    id: 'tiger_shadow_herb',
    name: '虎影草',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'azure_shine_herb',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'tiger_shadow_herb',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: '瑶光瓜与青辉草蛟龙出水，威震八方。'
  },
  {
    id: 'draco_roar_chestnut',
    name: '龙啸栗',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'moon_fortune_chestnut',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'draco_roar_chestnut',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: '瑶光瓜与月瑞栗的神力融合，有神兽之威。'
  },
  {
    id: 'fenghuang_roar_apricot',
    name: '凤啸杏',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sun_fortune_apricot',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'fenghuang_roar_apricot',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: '瑶光瓜与日瑞杏龙吟凤鸣，瑞兽降世。'
  },
  {
    id: 'qilin_roar_pear',
    name: '麟啸梨',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'sky_fortune_pear',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'qilin_roar_pear',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 87 },
    discoveryText: '瑶光瓜与天瑞梨虎啸山林，鹤舞九天。'
  },
  {
    id: 'crane_roar_berry',
    name: '鹤啸莓',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'gem_fortune_berry',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'crane_roar_berry',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 87 },
    discoveryText: '瑶光瓜与玉瑞莓麟光闪耀，百兽朝拜。'
  },
  {
    id: 'tiger_roar_peach_t',
    name: '虎啸桃',
    parentCropA: 'spirit_wonder_melon',
    parentCropB: 'prism_fortune_peach_t',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'tiger_roar_peach_t',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: '瑶光瓜与琉瑞桃蛟龙出水，威震八方。'
  },
  // === 八代杂交作物 ===,
  {
    id: 'supreme_origin_melon',
    name: '太初瓜',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_light5_melon',
    minSweetness: 78,
    minYield: 78,
    resultCropId: 'supreme_origin_melon',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 78 },
    discoveryText: '灵妙瓜与瑶光瓜天地之气凝聚，元气充沛。'
  },
  {
    id: 'firmament_origin_bean',
    name: '乾初豆',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_light5_bean',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'firmament_origin_bean',
    baseGenetics: { sweetness: 88, yield: 88, resistance: 79 },
    discoveryText: '灵妙瓜与琼光豆乾坤交泰，阴阳和合。'
  },
  {
    id: 'terra_origin_rice',
    name: '坤初稻',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_light5_rice',
    minSweetness: 79,
    minYield: 79,
    resultCropId: 'terra_origin_rice',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 79 },
    discoveryText: '灵妙瓜与瑰光稻太初之力觉醒，混元归一。'
  },
  {
    id: 'primal_origin_tuber',
    name: '元初薯',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_light5_tuber',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'primal_origin_tuber',
    baseGenetics: { sweetness: 89, yield: 89, resistance: 80 },
    discoveryText: '灵妙瓜与曦光薯天极之光降临，万物归元。'
  },
  {
    id: 'chaos_origin_green',
    name: '混初菜',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_light5_green',
    minSweetness: 80,
    minYield: 80,
    resultCropId: 'chaos_origin_green',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 80 },
    discoveryText: '灵妙瓜与璃光菜元气混沌初开，太一显化。'
  },
  {
    id: 'supreme_vital8_fruit',
    name: '太灵果',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_hua5_fruit',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'supreme_vital8_fruit',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 81 },
    discoveryText: '灵妙瓜与瑶华果天地之气凝聚，元气充沛。'
  },
  {
    id: 'firmament_vital8_bloom',
    name: '乾灵花',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_hua5_bloom',
    minSweetness: 81,
    minYield: 81,
    resultCropId: 'firmament_vital8_bloom',
    baseGenetics: { sweetness: 90, yield: 90, resistance: 82 },
    discoveryText: '灵妙瓜与琼华花乾坤交泰，阴阳和合。'
  },
  {
    id: 'terra_vital8_tea',
    name: '坤灵茶',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_hua5_tea',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'terra_vital8_tea',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 82 },
    discoveryText: '灵妙瓜与瑰华茶太初之力觉醒，混元归一。'
  },
  {
    id: 'primal_vital8_shoot',
    name: '元灵笋',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_hua5_shoot',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'primal_vital8_shoot',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 83 },
    discoveryText: '灵妙瓜与曦华笋天极之光降临，万物归元。'
  },
  {
    id: 'chaos_vital8_lotus',
    name: '混灵莲',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_hua5_lotus',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'chaos_vital8_lotus',
    baseGenetics: { sweetness: 91, yield: 91, resistance: 83 },
    discoveryText: '灵妙瓜与璃华莲元气混沌初开，太一显化。'
  },
  {
    id: 'supreme_glory8_wheat',
    name: '太华麦',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_dewdrop_wheat',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'supreme_glory8_wheat',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 84 },
    discoveryText: '灵妙瓜与瑶露麦天地之气凝聚，元气充沛。'
  },
  {
    id: 'firmament_glory8_sesame',
    name: '乾华芝',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_dewdrop_sesame',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'firmament_glory8_sesame',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 84 },
    discoveryText: '灵妙瓜与琼露芝乾坤交泰，阴阳和合。'
  },
  {
    id: 'terra_glory8_pepper',
    name: '坤华椒',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_dewdrop_pepper',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'terra_glory8_pepper',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 85 },
    discoveryText: '灵妙瓜与瑰露椒太初之力觉醒，混元归一。'
  },
  {
    id: 'primal_glory8_root',
    name: '元华参',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_dewdrop_root',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'primal_glory8_root',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: '灵妙瓜与曦露参天极之光降临，万物归元。'
  },
  {
    id: 'chaos_glory8_sprout',
    name: '混华芽',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_dewdrop_sprout',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'chaos_glory8_sprout',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: '灵妙瓜与璃露芽元气混沌初开，太一显化。'
  },
  {
    id: 'supreme_zenith_vine',
    name: '太极藤',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_soul_vine',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'supreme_zenith_vine',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 87 },
    discoveryText: '灵妙瓜与瑶灵藤天地之气凝聚，元气充沛。'
  },
  {
    id: 'firmament_zenith_bud',
    name: '乾极蕾',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_soul_bud',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'firmament_zenith_bud',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 87 },
    discoveryText: '灵妙瓜与琼灵蕾乾坤交泰，阴阳和合。'
  },
  {
    id: 'terra_zenith_orchid',
    name: '坤极兰',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_soul_orchid',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'terra_zenith_orchid',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: '灵妙瓜与瑰灵兰太初之力觉醒，混元归一。'
  },
  {
    id: 'primal_zenith_gourd',
    name: '元极葫',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_soul_gourd',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'primal_zenith_gourd',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 89 },
    discoveryText: '灵妙瓜与曦灵葫天极之光降临，万物归元。'
  },
  {
    id: 'chaos_zenith_herb',
    name: '混极草',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_soul_herb',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'chaos_zenith_herb',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 89 },
    discoveryText: '灵妙瓜与璃灵草元气混沌初开，太一显化。'
  },
  {
    id: 'supreme_core_chestnut',
    name: '太元栗',
    parentCropA: 'draco_song_melon',
    parentCropB: 'precious_silk5_chestnut',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'supreme_core_chestnut',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: '灵妙瓜与瑶锦栗天地之气凝聚，元气充沛。'
  },
  {
    id: 'firmament_core_apricot',
    name: '乾元杏',
    parentCropA: 'draco_song_melon',
    parentCropB: 'rare_silk5_apricot',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'firmament_core_apricot',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: '灵妙瓜与琼锦杏乾坤交泰，阴阳和合。'
  },
  {
    id: 'terra_core_pear',
    name: '坤元梨',
    parentCropA: 'draco_song_melon',
    parentCropB: 'magnif_silk5_pear',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'terra_core_pear',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: '灵妙瓜与瑰锦梨太初之力觉醒，混元归一。'
  },
  {
    id: 'primal_core_berry',
    name: '元元莓',
    parentCropA: 'draco_song_melon',
    parentCropB: 'radiant_silk5_berry',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'primal_core_berry',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 91 },
    discoveryText: '灵妙瓜与曦锦莓天极之光降临，万物归元。'
  },
  {
    id: 'chaos_core_peach_t',
    name: '混元桃',
    parentCropA: 'draco_song_melon',
    parentCropB: 'lustrous_silk5_peach_t',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'chaos_core_peach_t',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: '灵妙瓜与璃锦桃元气混沌初开，太一显化。'
  },
  // === 九代杂交作物 ===,
  {
    id: 'vast_meng_melon',
    name: '鸿蒙瓜',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_wonder_melon',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'vast_meng_melon',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: '龙吟瓜与灵妙瓜鸿蒙之力交汇，通灵化境。'
  },
  {
    id: 'ancient_meng_bean',
    name: '古蒙豆',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_wonder_bean',
    minSweetness: 82,
    minYield: 82,
    resultCropId: 'ancient_meng_bean',
    baseGenetics: { sweetness: 92, yield: 92, resistance: 85 },
    discoveryText: '龙吟瓜与仙妙豆太古洪荒之气，开天辟地。'
  },
  {
    id: 'infinite_meng_rice',
    name: '无蒙稻',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_wonder_rice',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'infinite_meng_rice',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: '龙吟瓜与圣妙稻无极之道显现，玄之又玄。'
  },
  {
    id: 'primeval_meng_tuber',
    name: '洪蒙薯',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_wonder_tuber',
    minSweetness: 83,
    minYield: 83,
    resultCropId: 'primeval_meng_tuber',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 86 },
    discoveryText: '龙吟瓜与神妙薯洪荒大力，超越万物。'
  },
  {
    id: 'genesis_meng_green',
    name: '开蒙菜',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_wonder_green',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'genesis_meng_green',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 87 },
    discoveryText: '龙吟瓜与真妙菜鸿蒙初判，天地为之变色。'
  },
  {
    id: 'vast_apex9_fruit',
    name: '鸿极果',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_grace6_fruit',
    minSweetness: 84,
    minYield: 84,
    resultCropId: 'vast_apex9_fruit',
    baseGenetics: { sweetness: 93, yield: 93, resistance: 87 },
    discoveryText: '龙吟瓜与灵华果鸿蒙之力交汇，通灵化境。'
  },
  {
    id: 'ancient_apex9_bloom',
    name: '古极花',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_grace6_bloom',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'ancient_apex9_bloom',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: '龙吟瓜与仙华花太古洪荒之气，开天辟地。'
  },
  {
    id: 'infinite_apex9_tea',
    name: '无极茶',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_grace6_tea',
    minSweetness: 85,
    minYield: 85,
    resultCropId: 'infinite_apex9_tea',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 88 },
    discoveryText: '龙吟瓜与圣华茶无极之道显现，玄之又玄。'
  },
  {
    id: 'primeval_apex9_shoot',
    name: '洪极笋',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_grace6_shoot',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'primeval_apex9_shoot',
    baseGenetics: { sweetness: 94, yield: 94, resistance: 89 },
    discoveryText: '龙吟瓜与神华笋洪荒大力，超越万物。'
  },
  {
    id: 'genesis_apex9_lotus',
    name: '开极莲',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_grace6_lotus',
    minSweetness: 86,
    minYield: 86,
    resultCropId: 'genesis_apex9_lotus',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 89 },
    discoveryText: '龙吟瓜与真华莲鸿蒙初判，天地为之变色。'
  },
  {
    id: 'vast_wilder_wheat',
    name: '鸿荒麦',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_phantom_wheat',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'vast_wilder_wheat',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 90 },
    discoveryText: '龙吟瓜与灵幻麦鸿蒙之力交汇，通灵化境。'
  },
  {
    id: 'ancient_wilder_sesame',
    name: '古荒芝',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_phantom_sesame',
    minSweetness: 87,
    minYield: 87,
    resultCropId: 'ancient_wilder_sesame',
    baseGenetics: { sweetness: 95, yield: 95, resistance: 90 },
    discoveryText: '龙吟瓜与仙幻芝太古洪荒之气，开天辟地。'
  },
  {
    id: 'infinite_wilder_pepper',
    name: '无荒椒',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_phantom_pepper',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'infinite_wilder_pepper',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: '龙吟瓜与圣幻椒无极之道显现，玄之又玄。'
  },
  {
    id: 'primeval_wilder_root',
    name: '洪荒参',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_phantom_root',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'primeval_wilder_root',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: '龙吟瓜与神幻参洪荒大力，超越万物。'
  },
  {
    id: 'genesis_wilder_sprout',
    name: '开荒芽',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_phantom_sprout',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'genesis_wilder_sprout',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: '龙吟瓜与真幻芽鸿蒙初判，天地为之变色。'
  },
  {
    id: 'vast_empyrean_vine',
    name: '鸿天藤',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_dream_vine',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'vast_empyrean_vine',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 92 },
    discoveryText: '龙吟瓜与灵梦藤鸿蒙之力交汇，通灵化境。'
  },
  {
    id: 'ancient_empyrean_bud',
    name: '古天蕾',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_dream_bud',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'ancient_empyrean_bud',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: '龙吟瓜与仙梦蕾太古洪荒之气，开天辟地。'
  },
  {
    id: 'infinite_empyrean_orchid',
    name: '无天兰',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_dream_orchid',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'infinite_empyrean_orchid',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: '龙吟瓜与圣梦兰无极之道显现，玄之又玄。'
  },
  {
    id: 'primeval_empyrean_gourd',
    name: '洪天葫',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_dream_gourd',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'primeval_empyrean_gourd',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: '龙吟瓜与神梦葫洪荒大力，超越万物。'
  },
  {
    id: 'genesis_empyrean_herb',
    name: '开天草',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_dream_herb',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'genesis_empyrean_herb',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: '龙吟瓜与真梦草鸿蒙初判，天地为之变色。'
  },
  {
    id: 'vast_spirit9_chestnut',
    name: '鸿灵栗',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'spirit_zen_chestnut',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'vast_spirit9_chestnut',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: '龙吟瓜与灵禅栗鸿蒙之力交汇，通灵化境。'
  },
  {
    id: 'ancient_spirit9_apricot',
    name: '古灵杏',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'fairy_zen_apricot',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'ancient_spirit9_apricot',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: '龙吟瓜与仙禅杏太古洪荒之气，开天辟地。'
  },
  {
    id: 'infinite_spirit9_pear',
    name: '无灵梨',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'holy_zen_pear',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'infinite_spirit9_pear',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: '龙吟瓜与圣禅梨无极之道显现，玄之又玄。'
  },
  {
    id: 'primeval_spirit9_berry',
    name: '洪灵莓',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'divine_zen_berry',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'primeval_spirit9_berry',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 96 },
    discoveryText: '龙吟瓜与神禅莓洪荒大力，超越万物。'
  },
  {
    id: 'genesis_spirit9_peach_t',
    name: '开灵桃',
    parentCropA: 'supreme_origin_melon',
    parentCropB: 'trueth_zen_peach_t',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'genesis_spirit9_peach_t',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 96 },
    discoveryText: '龙吟瓜与真禅桃鸿蒙初判，天地为之变色。'
  },
  // === 十代杂交作物 ===,
  {
    id: 'creation_change_melon',
    name: '造化瓜',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_song_melon',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'creation_change_melon',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: '太初瓜与龙吟瓜造化之力成就，永恒不朽之品。'
  },
  {
    id: 'eternal_change_bean',
    name: '永化豆',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_song_bean',
    minSweetness: 88,
    minYield: 88,
    resultCropId: 'eternal_change_bean',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 90 },
    discoveryText: '太初瓜与凤吟豆天命所归，万象更新。'
  },
  {
    id: 'undying_change_rice',
    name: '不化稻',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_song_rice',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'undying_change_rice',
    baseGenetics: { sweetness: 96, yield: 96, resistance: 91 },
    discoveryText: '太初瓜与麟吟稻不朽轮回，涅槃重生。'
  },
  {
    id: 'heavenly_change_tuber',
    name: '天化薯',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_song_tuber',
    minSweetness: 89,
    minYield: 89,
    resultCropId: 'heavenly_change_tuber',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 91 },
    discoveryText: '太初瓜与鹤吟薯造化弄人，终成至宝。'
  },
  {
    id: 'myriad_change_green',
    name: '万化菜',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_song_green',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'myriad_change_green',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: '太初瓜与虎吟菜永恒不灭之光，照耀天地。'
  },
  {
    id: 'creation_lasting_fruit',
    name: '造恒果',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_dance_fruit',
    minSweetness: 90,
    minYield: 90,
    resultCropId: 'creation_lasting_fruit',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 92 },
    discoveryText: '太初瓜与龙舞果造化之力成就，永恒不朽之品。'
  },
  {
    id: 'eternal_lasting_bloom',
    name: '永恒花',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_dance_bloom',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'eternal_lasting_bloom',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: '太初瓜与凤舞花天命所归，万象更新。'
  },
  {
    id: 'undying_lasting_tea',
    name: '不恒茶',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_dance_tea',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'undying_lasting_tea',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: '太初瓜与麟舞茶不朽轮回，涅槃重生。'
  },
  {
    id: 'heavenly_lasting_shoot',
    name: '天恒笋',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_dance_shoot',
    minSweetness: 91,
    minYield: 91,
    resultCropId: 'heavenly_lasting_shoot',
    baseGenetics: { sweetness: 97, yield: 97, resistance: 93 },
    discoveryText: '太初瓜与鹤舞笋造化弄人，终成至宝。'
  },
  {
    id: 'myriad_lasting_lotus',
    name: '万恒莲',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_dance_lotus',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'myriad_lasting_lotus',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: '太初瓜与虎舞莲永恒不灭之光，照耀天地。'
  },
  {
    id: 'creation_timeless_wheat',
    name: '造朽麦',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_gleam7_wheat',
    minSweetness: 92,
    minYield: 92,
    resultCropId: 'creation_timeless_wheat',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 94 },
    discoveryText: '太初瓜与龙辉麦造化之力成就，永恒不朽之品。'
  },
  {
    id: 'eternal_timeless_sesame',
    name: '永朽芝',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_gleam7_sesame',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'eternal_timeless_sesame',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: '太初瓜与凤辉芝天命所归，万象更新。'
  },
  {
    id: 'undying_timeless_pepper',
    name: '不朽椒',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_gleam7_pepper',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'undying_timeless_pepper',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: '太初瓜与麟辉椒不朽轮回，涅槃重生。'
  },
  {
    id: 'heavenly_timeless_root',
    name: '天朽参',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_gleam7_root',
    minSweetness: 93,
    minYield: 93,
    resultCropId: 'heavenly_timeless_root',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 95 },
    discoveryText: '太初瓜与鹤辉参造化弄人，终成至宝。'
  },
  {
    id: 'myriad_timeless_sprout',
    name: '万朽芽',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_gleam7_sprout',
    minSweetness: 94,
    minYield: 94,
    resultCropId: 'myriad_timeless_sprout',
    baseGenetics: { sweetness: 98, yield: 98, resistance: 96 },
    discoveryText: '太初瓜与虎辉芽永恒不灭之光，照耀天地。'
  },
  {
    id: 'creation_destiny_vine',
    name: '造命藤',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_shadow_vine',
    minSweetness: 94,
    minYield: 94,
    resultCropId: 'creation_destiny_vine',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 96 },
    discoveryText: '太初瓜与龙影藤造化之力成就，永恒不朽之品。'
  },
  {
    id: 'eternal_destiny_bud',
    name: '永命蕾',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_shadow_bud',
    minSweetness: 95,
    minYield: 95,
    resultCropId: 'eternal_destiny_bud',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 97 },
    discoveryText: '太初瓜与凤影蕾天命所归，万象更新。'
  },
  {
    id: 'undying_destiny_orchid',
    name: '不命兰',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_shadow_orchid',
    minSweetness: 95,
    minYield: 95,
    resultCropId: 'undying_destiny_orchid',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 97 },
    discoveryText: '太初瓜与麟影兰不朽轮回，涅槃重生。'
  },
  {
    id: 'heavenly_destiny_gourd',
    name: '天命葫',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_shadow_gourd',
    minSweetness: 96,
    minYield: 96,
    resultCropId: 'heavenly_destiny_gourd',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 98 },
    discoveryText: '太初瓜与鹤影葫造化弄人，终成至宝。'
  },
  {
    id: 'myriad_destiny_herb',
    name: '万命草',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_shadow_herb',
    minSweetness: 96,
    minYield: 96,
    resultCropId: 'myriad_destiny_herb',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 98 },
    discoveryText: '太初瓜与虎影草永恒不灭之光，照耀天地。'
  },
  {
    id: 'creation_form_chestnut',
    name: '造象栗',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'draco_roar_chestnut',
    minSweetness: 96,
    minYield: 96,
    resultCropId: 'creation_form_chestnut',
    baseGenetics: { sweetness: 99, yield: 99, resistance: 98 },
    discoveryText: '太初瓜与龙啸栗造化之力成就，永恒不朽之品。'
  },
  {
    id: 'eternal_form_apricot',
    name: '永象杏',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'fenghuang_roar_apricot',
    minSweetness: 97,
    minYield: 97,
    resultCropId: 'eternal_form_apricot',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 99 },
    discoveryText: '太初瓜与凤啸杏天命所归，万象更新。'
  },
  {
    id: 'undying_form_pear',
    name: '不象梨',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'qilin_roar_pear',
    minSweetness: 97,
    minYield: 97,
    resultCropId: 'undying_form_pear',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 99 },
    discoveryText: '太初瓜与麟啸梨不朽轮回，涅槃重生。'
  },
  {
    id: 'heavenly_form_berry',
    name: '天象莓',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'crane_roar_berry',
    minSweetness: 98,
    minYield: 98,
    resultCropId: 'heavenly_form_berry',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 100 },
    discoveryText: '太初瓜与鹤啸莓造化弄人，终成至宝。'
  },
  {
    id: 'myriad_form_peach_t',
    name: '万象桃',
    parentCropA: 'vast_meng_melon',
    parentCropB: 'tiger_roar_peach_t',
    minSweetness: 98,
    minYield: 98,
    resultCropId: 'myriad_form_peach_t',
    baseGenetics: { sweetness: 100, yield: 100, resistance: 100 },
    discoveryText: '太初瓜与虎啸桃永恒不灭之光，照耀天地。'
  }
]

/** 杂交品种阶层 (tier) 划分：基于 HYBRID_DEFS 数组顺序 */
const TIER_COUNTS = [100, 50, 50, 50, 25, 25, 25, 25, 25, 25] // T1..T10
const _tierMap = new Map<string, number>()
let _offset = 0
for (let t = 0; t < TIER_COUNTS.length; t++) {
  for (let i = 0; i < TIER_COUNTS[t]!; i++) {
    const def = HYBRID_DEFS[_offset + i]
    if (def) _tierMap.set(def.id, t + 1)
  }
  _offset += TIER_COUNTS[t]!
}

/** 获取杂交品种所属阶层 (1-10) */
export const getHybridTier = (hybridId: string): number => _tierMap.get(hybridId) ?? 1

/** 查找可能的杂交配方 */
export const findPossibleHybrid = (cropIdA: string, cropIdB: string): HybridDef | null => {
  return (
    HYBRID_DEFS.find(
      h => (h.parentCropA === cropIdA && h.parentCropB === cropIdB) || (h.parentCropA === cropIdB && h.parentCropB === cropIdA)
    ) ?? null
  )
}

/** 根据杂交种ID查找配方 */
export const findPossibleHybridById = (hybridId: string): HybridDef | null => {
  return HYBRID_DEFS.find(h => h.id === hybridId) ?? null
}

/** 种子制造机产出育种种子的概率 */
export const getSeedMakerGeneticChance = (farmingLevel: number): number => {
  return 0.3 + farmingLevel * 0.03
}
