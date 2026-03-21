import type { ItemDef, ItemCategory } from '@/types/item'
import { CROPS } from './crops'
import { FISH } from './fish'
import { RECIPES } from './recipes'
import { PROCESSING_MACHINES, SPRINKLERS, FERTILIZERS, BAITS, TACKLES, BOMBS } from './processing'
import { FRUIT_TREE_DEFS } from './fruitTrees'
import { WEAPONS, getWeaponSellPrice } from './weapons'
import { RINGS } from './rings'
import { HATS } from './hats'
import { SHOES } from './shoes'

/** Ekin tanımlarından tohum eşyalarını kendiliğinden üretir (elde ayrıca tanımlanan tohumlar hariç) */
const SEED_ITEMS: ItemDef[] = CROPS.filter(
  crop => crop.seedId !== 'ancient_seed' && crop.seedId !== 'hanhai_cactus_seed' && crop.seedId !== 'hanhai_date_seed'
).map(crop => ({
  id: crop.seedId,
  name: `${crop.name} Tohumu`,
  category: 'seed',
  description: `${crop.name} tohumu. ${crop.season
    .map(s => {
      const names: Record<string, string> = { spring: 'İlkbahar', summer: 'Yaz', autumn: 'Güz', winter: 'Kış' }
      return names[s]
    })
    .join('/')} mevsiminde ekilebilir.`,
  sellPrice: Math.floor(crop.seedPrice / 2),
  edible: false
}))

/** Ekin tanımlarından hasat eşyalarını kendiliğinden üretir */
const CROP_ITEMS: ItemDef[] = CROPS.map(crop => ({
  id: crop.id,
  name: crop.name,
  category: 'crop',
  description: crop.description,
  sellPrice: Math.floor(crop.sellPrice * 1.5),
  edible: true,
  staminaRestore: Math.floor(crop.sellPrice / 5),
  healthRestore: Math.floor(crop.sellPrice / 10)
}))

/** Maden ve taş eşyaları */
const ORE_ITEMS: ItemDef[] = [
  { id: 'copper_ore', name: 'Bakır Cevheri', category: 'ore', description: 'Sık rastlanan bir metal cevheri.', sellPrice: 5, edible: false },
  { id: 'iron_ore', name: 'Demir Cevheri', category: 'ore', description: 'Sert ve sağlam bir demir cevheri.', sellPrice: 10, edible: false },
  { id: 'gold_ore', name: 'Altın Cevheri', category: 'ore', description: 'Kıymetli bir altın damarı parçası.', sellPrice: 18, edible: false },
  { id: 'crystal_ore', name: 'Billur Cevheri', category: 'ore', description: 'Işığı kıran billur cevheri.', sellPrice: 30, edible: false },
  { id: 'shadow_ore', name: 'Gölge Cevheri', category: 'ore', description: 'Kapkara ve ağır, gizemli bir cevher.', sellPrice: 45, edible: false },
  { id: 'void_ore', name: 'Boşluk Cevheri', category: 'ore', description: 'Uçurumun en dip yerinden geldiği söylenen cevher.', sellPrice: 60, edible: false },
  { id: 'iridium_ore', name: 'Gökdemir Cevheri', category: 'ore', description: 'Çok ender ve son derece sert bir metal cevheri.', sellPrice: 80, edible: false },
  { id: 'quartz', name: 'Aktaş', category: 'gem', description: 'Berrak ve ışıklı bir taş.', sellPrice: 10, edible: false },
  { id: 'jade', name: 'Yeşim', category: 'gem', description: 'Yumuşak parlaklıklı değerli taş.', sellPrice: 30, edible: false },
  { id: 'ruby', name: 'Yakut', category: 'gem', description: 'Ateş gibi parlayan kıymetli taş.', sellPrice: 45, edible: false },
  { id: 'moonstone', name: 'Aytaşı', category: 'gem', description: 'Yumuşak bir ay ışığı yayar.', sellPrice: 65, edible: false },
  { id: 'obsidian', name: 'Kara Cam', category: 'gem', description: 'Volkan ateşinden doğmuş koyu taş.', sellPrice: 90, edible: false },
  { id: 'dragon_jade', name: 'Ejder Yadigârı', category: 'gem', description: 'Söylenceye göre ejder soyunun kudretini taşıyan taş.', sellPrice: 120, edible: false },
  { id: 'prismatic_shard', name: 'Yedi Renk Parçası', category: 'gem', description: 'Kadim kudret taşıyan gizemli bir parça.', sellPrice: 180, edible: false },
  { id: 'battery', name: 'Yıldırım Hücresi', category: 'material', description: 'Paratonerin yıldırımdan topladığı güç.', sellPrice: 100, edible: false }
]

/** Çeşitli eşyalar */
const MISC_ITEMS: ItemDef[] = [
  { id: 'wood', name: 'Odun', category: 'material', description: 'Yapı ve el işi için temel malzeme.', sellPrice: 5, edible: false },
  { id: 'bamboo', name: 'Bambu', category: 'material', description: 'Bambu koruluğundan toplanan ince kamış.', sellPrice: 10, edible: false },
  { id: 'herb', name: 'Şifalı Ot', category: 'material', description: 'Dağ yamaçlarında yetişen yabani ot.', sellPrice: 15, edible: false },
  { id: 'firewood', name: 'Yakacak Odun', category: 'material', description: 'Ocak ve aş için kullanılan yakacak.', sellPrice: 5, edible: false },
  {
    id: 'winter_bamboo_shoot',
    name: 'Kış Filizi',
    category: 'misc',
    description: 'Kış mevsimine özgü taze bambu filizi.',
    sellPrice: 40,
    edible: true,
    staminaRestore: 8,
    healthRestore: 3
  },
  { id: 'wintersweet', name: 'Ayaz Çiçeği', category: 'gift', description: 'Soğuk günde açan hoş kokulu çiçek; armağan etmeye uygundur.', sellPrice: 50, edible: false },
  {
    id: 'wild_mushroom',
    name: 'Yaban Mantarı',
    category: 'misc',
    description: 'Güz mevsiminde dağlarda toplanan mantar.',
    sellPrice: 30,
    edible: true,
    staminaRestore: 5,
    healthRestore: 2
  },
  { id: 'ginseng', name: 'Ginseng Kökü', category: 'misc', description: 'Çok kıymetli yabani kök.', sellPrice: 200, edible: false },
  {
    id: 'wild_berry',
    name: 'Yaban Meyvesi',
    category: 'misc',
    description: 'Yaz dağlarında yetişen tatlı yaban meyvesi.',
    sellPrice: 20,
    edible: true,
    staminaRestore: 5,
    healthRestore: 2
  },
  { id: 'pine_cone', name: 'Çam Kozalağı', category: 'material', description: 'Çam ağacından düşen kozalak.', sellPrice: 10, edible: false },
  { id: 'jade_ring', name: 'Yeşim Yüzük', category: 'gift', description: 'Özenle işlenmiş yeşim yüzük; evlilik nişanı olarak verilebilir.', sellPrice: 500, edible: false },
  {
    id: 'silk_ribbon',
    name: 'İpek Mendil',
    category: 'gift',
    description: 'İnce işlemeli ipek mendil; gönül verilen kişiye duyguyu anlatır.',
    sellPrice: 200,
    edible: false
  },
  {
    id: 'zhiji_jade',
    name: 'Can Yoldaşı Tılsımı',
    category: 'gift',
    description: 'Çift oyulmuş tılsım taşı; yakın dosta verilirse can yoldaşlığı bağı kurar.',
    sellPrice: 300,
    edible: false
  },
  { id: 'scarecrow', name: 'Korkuluk', category: 'machine', description: 'Tarlaya dikilir, ekin gagalayan kargayı uzak tutar.', sellPrice: 75, edible: false },
  { id: 'rain_totem', name: 'Yağmur Totemi', category: 'misc', description: 'Kullanılınca ertesi gün yağmur yağdırır.', sellPrice: 30, edible: false },
  {
    id: 'fish_feed',
    name: 'Balık Yemi',
    category: 'material',
    description: 'Balık göleti için özel yem; suyu ve balığın sağlığını dengede tutar.',
    sellPrice: 10,
    edible: false
  },
  {
    id: 'water_purifier',
    name: 'Su Arıtı Kürü',
    category: 'material',
    description: 'Gölet suyunu iyileştirir, balıkların hastalanma ihtimalini azaltır.',
    sellPrice: 50,
    edible: false
  }
]

/** Balık tanımlarından balık eşyalarını kendiliğinden üretir */
const FISH_ITEMS: ItemDef[] = FISH.map(fish => ({
  id: fish.id,
  name: fish.name,
  category: 'fish' as const,
  description: fish.description,
  sellPrice: Math.floor(fish.sellPrice * 1.5),
  edible: true,
  staminaRestore: Math.floor(fish.sellPrice / 5),
  healthRestore: Math.floor(fish.sellPrice / 8)
}))

/** Yemek tariflerinden pişmiş yemek eşyalarını kendiliğinden üretir */
const _preFoodItems: ItemDef[] = [...SEED_ITEMS, ...CROP_ITEMS, ...ORE_ITEMS, ...MISC_ITEMS, ...FISH_ITEMS]
const FOOD_ITEMS: ItemDef[] = RECIPES.map(recipe => {
  const baseSellPrice = Math.floor(recipe.effect.staminaRestore * 2)
  // Malzeme toplam satış değerini hesaplar; taban kural: yemek fiyatı malzeme toplamının 1.2 katından düşük olmasın
  const ingredientTotal = recipe.ingredients.reduce((sum, ing) => {
    const def = _preFoodItems.find(i => i.id === ing.itemId)
    return sum + (def?.sellPrice ?? 0) * ing.quantity
  }, 0)
  const sellPrice = Math.max(baseSellPrice, Math.floor(ingredientTotal * 1.2))
  return {
    id: `food_${recipe.id}`,
    name: recipe.name,
    category: 'food' as const,
    description: recipe.description,
    sellPrice,
    edible: true,
    staminaRestore: recipe.effect.staminaRestore,
    healthRestore: recipe.effect.healthRestore ?? Math.floor(recipe.effect.staminaRestore * 0.4)
  }
})

/** İşlenmiş ürün eşyaları */
const PROCESSED_ITEMS: ItemDef[] = [
  {
    id: 'watermelon_wine',
    name: 'Karpuz Şarabı',
    category: 'processed',
    description: 'Tatlı karpuzdan yapılmış hoş içki.',
    sellPrice: 390,
    edible: true,
    staminaRestore: 25,
    healthRestore: 15
  },
  {
    id: 'osmanthus_wine',
    name: 'Altınçiçek Şarabı',
    category: 'processed',
    description: 'Mis kokulu çiçeklerden mayalanmış içki.',
    sellPrice: 600,
    edible: true,
    staminaRestore: 30,
    healthRestore: 18
  },
  { id: 'rice_vinegar', name: 'Pirinç Sirkesi', category: 'processed', description: 'Ev usulü yıllanmış sirke.', sellPrice: 290, edible: false },
  {
    id: 'pickled_cabbage',
    name: 'Lahana Turşusu',
    category: 'processed',
    description: 'İştah açan lahana turşusu.',
    sellPrice: 155,
    edible: true,
    staminaRestore: 10,
    healthRestore: 5
  },
  {
    id: 'dried_radish',
    name: 'Kuru Turp',
    category: 'processed',
    description: 'Kıtır kıtır kurutulmuş turp.',
    sellPrice: 245,
    edible: true,
    staminaRestore: 12,
    healthRestore: 5
  },
  {
    id: 'pumpkin_preserve',
    name: 'Balkabağı Ezmesi',
    category: 'processed',
    description: 'Yoğun kıvamlı balkabağı ezmesi.',
    sellPrice: 410,
    edible: true,
    staminaRestore: 15,
    healthRestore: 8
  },
  {
    id: 'honey',
    name: 'Bal',
    category: 'processed',
    description: 'Altın sarısı, tatlı bal.',
    sellPrice: 100,
    edible: true,
    staminaRestore: 20,
    healthRestore: 10
  },
  { id: 'sesame_oil', name: 'Susam Yağı', category: 'processed', description: 'Taş değirmende sıkılmış hoş kokulu yağ.', sellPrice: 260, edible: false },
  { id: 'tea_oil', name: 'Çay Tohumu Yağı', category: 'processed', description: 'Dağdan gelen çok kıymetli yağ.', sellPrice: 620, edible: false },
  {
    id: 'peach_wine',
    name: 'Şeftali Şarabı',
    category: 'processed',
    description: 'Yumuşak içimli şeftali şarabı.',
    sellPrice: 420,
    edible: true,
    staminaRestore: 25,
    healthRestore: 15
  },
  {
    id: 'jujube_wine',
    name: 'Hünnap Şarabı',
    category: 'processed',
    description: 'Yoğun ve besleyici hünnap şarabı.',
    sellPrice: 300,
    edible: true,
    staminaRestore: 20,
    healthRestore: 12
  },
  {
    id: 'corn_wine',
    name: 'Mısır Şarabı',
    category: 'processed',
    description: 'Hafif kokulu mısır şarabı.',
    sellPrice: 330,
    edible: true,
    staminaRestore: 18,
    healthRestore: 10
  },
  {
    id: 'pickled_chili',
    name: 'Biber Turşusu',
    category: 'processed',
    description: 'Ekşi acı biber turşusu.',
    sellPrice: 270,
    edible: true,
    staminaRestore: 10,
    healthRestore: 5
  },
  {
    id: 'pickled_ginger',
    name: 'Zencefil Turşusu',
    category: 'processed',
    description: 'Tatlı ekşi, gevrek zencefil turşusu.',
    sellPrice: 315,
    edible: true,
    staminaRestore: 12,
    healthRestore: 5
  },
  { id: 'mayonnaise', name: 'Mayonez', category: 'processed', description: 'Yumurtadan yapılmış koyu sos.', sellPrice: 115, edible: false },
  {
    id: 'duck_mayonnaise',
    name: 'Ördek Yumurtası Mayonezi',
    category: 'processed',
    description: 'Ördek yumurtasından yapılmış daha kıymetli mayonez.',
    sellPrice: 215,
    edible: false
  },
  {
    id: 'goose_mayonnaise',
    name: 'Kaz Yumurtası Mayonezi',
    category: 'processed',
    description: 'Kaz yumurtasından yapılmış yoğun mayonez.',
    sellPrice: 250,
    edible: false
  },
  {
    id: 'silkie_mayonnaise',
    name: 'Kara Tavuk Mayonezi',
    category: 'processed',
    description: 'Kara tavuk yumurtasından yapılmış besleyici mayonez.',
    sellPrice: 295,
    edible: false
  },
  {
    id: 'ostrich_mayonnaise',
    name: 'Devekuşu Yumurtası Mayonezi',
    category: 'processed',
    description: 'Devekuşu yumurtasından yapılmış iri boy mayonez.',
    sellPrice: 450,
    edible: false
  },
  {
    id: 'quail_mayonnaise',
    name: 'Bıldırcın Yumurtası Mayonezi',
    category: 'processed',
    description: 'Bıldırcın yumurtasından yapılmış ince mayonez.',
    sellPrice: 170,
    edible: false
  }
]

/** Tütsülenmiş balık eşyaları */
const SMOKED_ITEMS: ItemDef[] = [
  {
    id: 'smoked_crucian',
    name: 'Tütsülenmiş Sazgümüşü',
    category: 'processed',
    description: 'Tütsüden geçmiş saz balığı; kendine has kokusu vardır.',
    sellPrice: 30,
    edible: true,
    staminaRestore: 7,
    healthRestore: 3
  },
  {
    id: 'smoked_carp',
    name: 'Tütsülenmiş Aynalı',
    category: 'processed',
    description: 'Tütsülenmiş aynalı balık; eti diri kalır.',
    sellPrice: 50,
    edible: true,
    staminaRestore: 12,
    healthRestore: 6
  },
  {
    id: 'smoked_grass_carp',
    name: 'Tütsülenmiş Otbalığı',
    category: 'processed',
    description: 'Tütsülenmiş otbalığı; hoş kokulu ve lezzetlidir.',
    sellPrice: 80,
    edible: true,
    staminaRestore: 20,
    healthRestore: 10
  },
  {
    id: 'smoked_bass',
    name: 'Tütsülenmiş Levrek',
    category: 'processed',
    description: 'Tütsülenmiş levrek; eti ince ve yumuşaktır.',
    sellPrice: 120,
    edible: true,
    staminaRestore: 30,
    healthRestore: 15
  },
  {
    id: 'smoked_catfish',
    name: 'Tütsülenmiş Yayın',
    category: 'processed',
    description: 'Tütsülenmiş yayın; tadı dolgun gelir.',
    sellPrice: 90,
    edible: true,
    staminaRestore: 22,
    healthRestore: 11
  },
  {
    id: 'smoked_mandarin_fish',
    name: 'Tütsülenmiş Çiçek Levreği',
    category: 'processed',
    description: 'Tütsülenmiş çiçek levreği; narin ve sulu etlidir.',
    sellPrice: 140,
    edible: true,
    staminaRestore: 35,
    healthRestore: 17
  },
  {
    id: 'smoked_eel',
    name: 'Tütsülenmiş Yılanbalığı',
    category: 'processed',
    description: 'Tütsülenmiş yılanbalığı; yağlı ve kaygan dokulu bir lezzet.',
    sellPrice: 170,
    edible: true,
    staminaRestore: 42,
    healthRestore: 21
  },
  {
    id: 'smoked_sturgeon',
    name: 'Tütsülenmiş Mersin Balığı',
    category: 'processed',
    description: 'Tütsülenmiş mersin balığı; ender ve nefistir.',
    sellPrice: 260,
    edible: true,
    staminaRestore: 65,
    healthRestore: 32
  },
  {
    id: 'smoked_loach',
    name: 'Tütsülenmiş Çamur Kayağı',
    category: 'processed',
    description: 'Tütsülenmiş çamur kayağı; gevrek ve kokuludur.',
    sellPrice: 44,
    edible: true,
    staminaRestore: 11,
    healthRestore: 5
  },
  {
    id: 'smoked_yellow_eel',
    name: 'Tütsülenmiş Sarı Yılanbalığı',
    category: 'processed',
    description: 'Tütsülenmiş sarı yılanbalığı; besleyici ve lezzetlidir.',
    sellPrice: 100,
    edible: true,
    staminaRestore: 25,
    healthRestore: 12
  }
]

/** Kurutulmuş yiyecek eşyaları */
const DRIED_ITEMS: ItemDef[] = [
  {
    id: 'dried_mushroom',
    name: 'Kuru Mantar',
    category: 'processed',
    description: 'Kurutulmuş mantar; tadı daha yoğun gelir.',
    sellPrice: 135,
    edible: true,
    staminaRestore: 18,
    healthRestore: 9
  },
  {
    id: 'dried_peach',
    name: 'Kuru Şeftali',
    category: 'processed',
    description: 'Kurutulmuş şeftali; tatlı ekşi yenir.',
    sellPrice: 120,
    edible: true,
    staminaRestore: 30,
    healthRestore: 15
  },
  {
    id: 'dried_lychee',
    name: 'Kuru Liçi',
    category: 'processed',
    description: 'Kurutulmuş liçi; yoğun ve tatlı kokuludur.',
    sellPrice: 160,
    edible: true,
    staminaRestore: 40,
    healthRestore: 20
  },
  {
    id: 'dried_persimmon_slice',
    name: 'Kuru Hurma Dilimi',
    category: 'processed',
    description: 'Kurutulmuş hurma; yumuşak ve tatlıdır.',
    sellPrice: 170,
    edible: true,
    staminaRestore: 42,
    healthRestore: 21
  },
  {
    id: 'dried_hawthorn',
    name: 'Alıç Kurusu',
    category: 'processed',
    description: 'Kurutulmuş alıç; ekşi tatlı, iştah açar.',
    sellPrice: 130,
    edible: true,
    staminaRestore: 32,
    healthRestore: 16
  },
  {
    id: 'dried_apricot',
    name: 'Kuru Kayısı',
    category: 'processed',
    description: 'Kurutulmuş kayısı; tadı dengelidir.',
    sellPrice: 110,
    edible: true,
    staminaRestore: 27,
    healthRestore: 13
  },
  {
    id: 'dried_berry',
    name: 'Meyve Kurusu',
    category: 'processed',
    description: 'Yaban meyvesi kurusu; uzun saklanır.',
    sellPrice: 90,
    edible: true,
    staminaRestore: 12,
    healthRestore: 6
  }
]

/** Makine eşyaları */
const MACHINE_ITEMS: ItemDef[] = PROCESSING_MACHINES.map(m => ({
  id: `machine_${m.id}`,
  name: m.name,
  category: 'machine' as const,
  description: m.description,
  sellPrice: Math.floor(m.craftMoney * 0.5),
  edible: false
}))

/** Sulayıcı eşyaları */
const SPRINKLER_ITEMS: ItemDef[] = SPRINKLERS.map(s => ({
  id: s.id,
  name: s.name,
  category: 'sprinkler' as const,
  description: s.description,
  sellPrice: Math.floor(s.craftMoney * 0.5),
  edible: false
}))

/** Gübre eşyaları */
const FERTILIZER_ITEMS: ItemDef[] = FERTILIZERS.map(f => ({
  id: f.id,
  name: f.name,
  category: 'fertilizer' as const,
  description: f.description,
  sellPrice: 5,
  edible: false
}))

/** Yem eşyaları */
const BAIT_ITEMS: ItemDef[] = BAITS.map(b => ({
  id: b.id,
  name: b.name,
  category: 'bait' as const,
  description: b.description,
  sellPrice: b.shopPrice ? Math.floor(b.shopPrice * 0.4) : 5,
  edible: false
}))

/** Şamandıra eşyaları */
const TACKLE_ITEMS: ItemDef[] = TACKLES.map(t => ({
  id: t.id,
  name: t.name,
  category: 'tackle' as const,
  description: t.description,
  sellPrice: t.shopPrice ? Math.floor(t.shopPrice * 0.5) : 50,
  edible: false
}))

/** Hayvansal ürünler */
const ANIMAL_PRODUCT_ITEMS: ItemDef[] = [
  {
    id: 'egg',
    name: 'Yumurta',
    category: 'animal_product',
    description: 'Taze köy yumurtası.',
    sellPrice: 75,
    edible: true,
    staminaRestore: 5,
    healthRestore: 3
  },
  {
    id: 'duck_egg',
    name: 'Ördek Yumurtası',
    category: 'animal_product',
    description: 'İri ve lezzetli ördek yumurtası.',
    sellPrice: 142,
    edible: true,
    staminaRestore: 8,
    healthRestore: 4
  },
  {
    id: 'milk',
    name: 'Süt',
    category: 'animal_product',
    description: 'Taze süt.',
    sellPrice: 187,
    edible: true,
    staminaRestore: 10,
    healthRestore: 5
  },
  { id: 'wool', name: 'Yün', category: 'animal_product', description: 'Yumuşak koyun yünü.', sellPrice: 510, edible: false },
  { id: 'hay', name: 'Saman', category: 'material', description: 'Hayvan yemi olarak kullanılan kuru ot.', sellPrice: 0, edible: false },
  // Yeni hayvansal ürünler
  { id: 'rabbit_fur', name: 'Tavşan Tüyü', category: 'animal_product', description: 'Yumuşacık tavşan tüyü.', sellPrice: 225, edible: false },
  {
    id: 'rabbit_foot',
    name: 'Uğur Tavşan Ayağı',
    category: 'animal_product',
    description: 'Söylenceye göre baht açan ender tavşan ayağı.',
    sellPrice: 300,
    edible: false
  },
  {
    id: 'goose_egg',
    name: 'Kaz Yumurtası',
    category: 'animal_product',
    description: 'Oldukça iri kaz yumurtası.',
    sellPrice: 165,
    edible: true,
    staminaRestore: 10,
    healthRestore: 5
  },
  {
    id: 'quail_egg',
    name: 'Bıldırcın Yumurtası',
    category: 'animal_product',
    description: 'Küçük bıldırcın yumurtası.',
    sellPrice: 37,
    edible: true,
    staminaRestore: 3,
    healthRestore: 2
  },
  {
    id: 'pigeon_egg',
    name: 'Güvercin Yumurtası',
    category: 'animal_product',
    description: 'Besleyici güvercin yumurtası.',
    sellPrice: 67,
    edible: true,
    staminaRestore: 5,
    healthRestore: 3
  },
  {
    id: 'silkie_egg',
    name: 'Kara Tavuk Yumurtası',
    category: 'animal_product',
    description: 'Güç veren kara tavuk yumurtası.',
    sellPrice: 195,
    edible: true,
    staminaRestore: 15,
    healthRestore: 8
  },
  { id: 'peacock_feather', name: 'Tavus Tüyü', category: 'animal_product', description: 'Gösterişli tavus kuyruğu tüyü.', sellPrice: 525, edible: false },
  {
    id: 'goat_milk',
    name: 'Keçi Sütü',
    category: 'animal_product',
    description: 'Taze keçi sütü.',
    sellPrice: 165,
    edible: true,
    staminaRestore: 10,
    healthRestore: 5
  },
  {
    id: 'truffle',
    name: 'Trüf',
    category: 'animal_product',
    description: 'Toprak altında yetişen kıymetli mantar.',
    sellPrice: 450,
    edible: true,
    staminaRestore: 5,
    healthRestore: 3
  },
  {
    id: 'buffalo_milk',
    name: 'Manda Sütü',
    category: 'animal_product',
    description: 'Yoğun kıvamlı manda sütü.',
    sellPrice: 150,
    edible: true,
    staminaRestore: 8,
    healthRestore: 4
  },
  {
    id: 'yak_milk',
    name: 'Yak Sütü',
    category: 'animal_product',
    description: 'Yüksek yayladan gelen yoğun süt.',
    sellPrice: 210,
    edible: true,
    staminaRestore: 12,
    healthRestore: 6
  },
  { id: 'alpaca_wool', name: 'Alpaka Yünü', category: 'animal_product', description: 'Pek yumuşak alpaka yünü.', sellPrice: 375, edible: false },
  {
    id: 'antler_velvet',
    name: 'Boynuz Kadifesi',
    category: 'animal_product',
    description: 'Çok kıymetli geyik boynuzu özü; yenirse kuvvet verir.',
    sellPrice: 675,
    edible: true,
    staminaRestore: 30,
    healthRestore: 15
  },
  {
    id: 'donkey_milk',
    name: 'Eşek Sütü',
    category: 'animal_product',
    description: 'Tadı hafif eşek sütü.',
    sellPrice: 120,
    edible: true,
    staminaRestore: 6,
    healthRestore: 3
  },
  {
    id: 'camel_milk',
    name: 'Deve Sütü',
    category: 'animal_product',
    description: 'Besleyici deve sütü.',
    sellPrice: 240,
    edible: true,
    staminaRestore: 12,
    healthRestore: 6
  },
  {
    id: 'ostrich_egg',
    name: 'Devekuşu Yumurtası',
    category: 'animal_product',
    description: 'Koca bir devekuşu yumurtası.',
    sellPrice: 300,
    edible: true,
    staminaRestore: 15,
    healthRestore: 8
  }
]

/** Meyve ağaçları meyveleri */
const FRUIT_TREE_ITEMS: ItemDef[] = FRUIT_TREE_DEFS.map(t => ({
  id: t.fruitId,
  name: t.fruitName,
  category: 'fruit' as const,
  description: `${t.name} ağacının verdiği ${t.fruitName}.`,
  sellPrice: Math.floor(t.fruitSellPrice * 1.5),
  edible: true,
  staminaRestore: Math.floor(t.fruitSellPrice / 5),
  healthRestore: Math.floor(t.fruitSellPrice / 10)
}))

/** Fidanlar */
const SAPLING_ITEMS: ItemDef[] = FRUIT_TREE_DEFS.map(t => ({
  id: t.saplingId,
  name: `${t.name} Fidanı`,
  category: 'sapling' as const,
  description: `Dikildikten ${t.growthDays} gün sonra olgunlaşır; ${t.fruitSeason === 'spring' ? 'ilkbaharda' : t.fruitSeason === 'summer' ? 'yazın' : t.fruitSeason === 'autumn' ? 'güzde' : 'kışın'} ${t.fruitName} verir.`,
  sellPrice: Math.floor(t.saplingPrice / 2),
  edible: false
}))

/** Yabani ağaç ürünleri ve malzemeler */
const WILD_TREE_ITEMS: ItemDef[] = [
  {
    id: 'camphor_seed',
    name: 'Kafur Tohumu',
    category: 'material',
    description: 'Kafur ağacının tohumu; ekilirse ağaç olur.',
    sellPrice: 15,
    edible: false
  },
  {
    id: 'mulberry',
    name: 'Dut',
    category: 'misc',
    description: 'Mor siyah dut; tatlı ekşi lezzetlidir.',
    sellPrice: 25,
    edible: true,
    staminaRestore: 5,
    healthRestore: 2
  },
  { id: 'pine_resin', name: 'Çam Reçinesi', category: 'material', description: 'Çamın salgıladığı reçine; el işinde işe yarar.', sellPrice: 30, edible: false },
  { id: 'camphor_oil', name: 'Kafur Yağı', category: 'material', description: 'Kafur ağacından çıkarılan hoş kokulu yağ.', sellPrice: 50, edible: false },
  { id: 'silk', name: 'İpek Lif', category: 'material', description: 'Dut ağacından toplanan ince ipek.', sellPrice: 40, edible: false },
  { id: 'tapper', name: 'Reçine Toplayıcı', category: 'machine', description: 'Olgun yabani ağaca kurulur; belli aralıklarla reçine verir.', sellPrice: 100, edible: false }
]

/** Bomba eşyaları */
const BOMB_ITEMS: ItemDef[] = BOMBS.map(b => ({
  id: b.id,
  name: b.name,
  category: 'bomb' as const,
  description: b.description,
  sellPrice: 25,
  edible: false
}))

/** Yengeç kapanı ve su canlısı eşyaları */
const CRAB_POT_ITEMS: ItemDef[] = [
  {
    id: 'crab_pot',
    name: 'Yengeç Kapanı',
    category: 'machine',
    description: 'Balık tutulacak yere kurulur; her gün kendiliğinden su canlısı yakalar (yem ister).',
    sellPrice: 750,
    edible: false
  },
  {
    id: 'snail',
    name: 'Salyangoz',
    category: 'fish',
    description: 'Küçük bir tatlı su salyangozu.',
    sellPrice: 15,
    edible: true,
    staminaRestore: 3,
    healthRestore: 2
  },
  {
    id: 'freshwater_shrimp',
    name: 'Tatlı Su Karidesi',
    category: 'fish',
    description: 'Temiz sularda yaşayan küçük karides.',
    sellPrice: 20,
    edible: true,
    staminaRestore: 4,
    healthRestore: 2
  },
  {
    id: 'crab',
    name: 'Yengeç',
    category: 'fish',
    description: 'Lezzetli dere yengeci.',
    sellPrice: 30,
    edible: true,
    staminaRestore: 6,
    healthRestore: 3
  },
  {
    id: 'lobster',
    name: 'Istakoz',
    category: 'fish',
    description: 'Kıymetli tatlı su ıstakozu.',
    sellPrice: 50,
    edible: true,
    staminaRestore: 10,
    healthRestore: 5
  },
  {
    id: 'cave_shrimp',
    name: 'Mağara Karidesi',
    category: 'fish',
    description: 'Madenin kara suyunda yaşayan saydam küçük karides.',
    sellPrice: 40,
    edible: true,
    staminaRestore: 8,
    healthRestore: 4
  },
  {
    id: 'swamp_crab',
    name: 'Bataklık Yengeci',
    category: 'fish',
    description: 'Bataklığın koyu renkli yengeci.',
    sellPrice: 45,
    edible: true,
    staminaRestore: 9,
    healthRestore: 4
  },
  { id: 'trash', name: 'Çer Çöp', category: 'misc', description: 'Pek işe yaramayan artık eşya.', sellPrice: 1, edible: false },
  { id: 'driftwood', name: 'Sürüklenmiş Kütük', category: 'misc', description: 'Sudan çıkarılmış çürük odun.', sellPrice: 2, edible: false },
  { id: 'broken_cd', name: 'Kırık Disk', category: 'misc', description: 'Birinin suya attığı kırık tabaka.', sellPrice: 1, edible: false },
  { id: 'soggy_newspaper', name: 'Islak Gazete', category: 'misc', description: 'Suda hamur olmuş eski gazete.', sellPrice: 1, edible: false }
]

/** Çiçek balları */
const FLOWER_HONEY_ITEMS: ItemDef[] = [
  {
    id: 'chrysanthemum_honey',
    name: 'Kasımpatı Balı',
    category: 'processed',
    description: 'Kasımpatı kokusu taşıyan bal.',
    sellPrice: 200,
    edible: true,
    staminaRestore: 25,
    healthRestore: 12
  },
  {
    id: 'osmanthus_honey',
    name: 'Altınçiçek Balı',
    category: 'processed',
    description: 'Yoğun çiçek kokulu tatlı bal.',
    sellPrice: 450,
    edible: true,
    staminaRestore: 30,
    healthRestore: 15
  },
  {
    id: 'rapeseed_honey',
    name: 'Kanola Çiçeği Balı',
    category: 'processed',
    description: 'Hafif tatlı bir çiçek balı.',
    sellPrice: 150,
    edible: true,
    staminaRestore: 20,
    healthRestore: 10
  },
  {
    id: 'snow_lotus_honey',
    name: 'Karçiçeği Balı',
    category: 'processed',
    description: 'Çok kıymetli nadir çiçek balı.',
    sellPrice: 730,
    edible: true,
    staminaRestore: 40,
    healthRestore: 20
  }
]

/** Trüf yağı */
const TRUFFLE_OIL_ITEM: ItemDef[] = [
  { id: 'truffle_oil', name: 'Trüf Yağı', category: 'processed', description: 'Kıymetli trüf yağı; pişirmeye çok uygundur.', sellPrice: 680, edible: false }
]

/** Peynir eşyaları */
const CHEESE_ITEMS: ItemDef[] = [
  {
    id: 'cheese',
    name: 'Peynir',
    category: 'processed',
    description: 'İnek sütünden yapılmış yoğun peynir.',
    sellPrice: 250,
    edible: true,
    staminaRestore: 50,
    healthRestore: 25
  },
  {
    id: 'goat_cheese',
    name: 'Keçi Peyniri',
    category: 'processed',
    description: 'Keçi sütünden yapılmış kendine has peynir.',
    sellPrice: 220,
    edible: true,
    staminaRestore: 44,
    healthRestore: 22
  },
  {
    id: 'buffalo_cheese',
    name: 'Manda Peyniri',
    category: 'processed',
    description: 'Manda sütünden yapılmış yoğun peynir.',
    sellPrice: 200,
    edible: true,
    staminaRestore: 40,
    healthRestore: 20
  },
  {
    id: 'yak_cheese',
    name: 'Yak Peyniri',
    category: 'processed',
    description: 'Yayla sütünden yapılmış katı peynir.',
    sellPrice: 280,
    edible: true,
    staminaRestore: 56,
    healthRestore: 28
  }
]

/** Dokuma eşyaları */
const CLOTH_ITEMS: ItemDef[] = [
  { id: 'cloth', name: 'Bez', category: 'material', description: 'Yünden dokunmuş bez topu.', sellPrice: 660, edible: false },
  { id: 'silk_cloth', name: 'İpek Kumaş', category: 'material', description: 'Gösterişli ipek kumaş.', sellPrice: 200, edible: false },
  { id: 'alpaca_cloth', name: 'Alpaka Dokuma', category: 'material', description: 'Çok yumuşak alpaka kumaşı.', sellPrice: 530, edible: false },
  { id: 'felt', name: 'Keçe', category: 'material', description: 'Tavşan tüyünden basılmış keçe.', sellPrice: 340, edible: false }
]

/** Metal külçe eşyaları */
const BAR_ITEMS: ItemDef[] = [
  { id: 'copper_bar', name: 'Bakır Külçesi', category: 'material', description: 'Eritilmiş bakır külçesi.', sellPrice: 40, edible: false },
  { id: 'iron_bar', name: 'Demir Külçesi', category: 'material', description: 'Eritilmiş demir külçesi.', sellPrice: 80, edible: false },
  { id: 'gold_bar', name: 'Altın Külçesi', category: 'material', description: 'Eritilmiş altın külçesi.', sellPrice: 160, edible: false },
  { id: 'iridium_bar', name: 'Gökdemir Külçesi', category: 'material', description: 'Eritilmiş gökdemir külçesi; çok kıymetlidir.', sellPrice: 700, edible: false }
]

/** Odun kömürü eşyaları */
const CHARCOAL_ITEMS: ItemDef[] = [
  { id: 'charcoal', name: 'Odun Kömürü', category: 'material', description: 'Yakılarak elde edilen kömür; yakıt ve el işinde kullanılır.', sellPrice: 55, edible: false }
]

/** Un eşyaları */
const FLOUR_ITEMS: ItemDef[] = [
  { id: 'rice_flour', name: 'Pirinç Unu', category: 'material', description: 'Pirincin ince öğütülmüş hâli.', sellPrice: 160, edible: false },
  { id: 'wheat_flour', name: 'Buğday Unu', category: 'material', description: 'Kış buğdayından çekilmiş un.', sellPrice: 130, edible: false },
  { id: 'cornmeal', name: 'Mısır Unu', category: 'material', description: 'Mısırın iri çekilmiş unu.', sellPrice: 180, edible: false }
]

/** Çay içecekleri */
const TEA_DRINK_ITEMS: ItemDef[] = [
  {
    id: 'green_tea_drink',
    name: 'Yeşil Çay',
    category: 'processed',
    description: 'Hoş kokulu yeşil çay içeceği.',
    sellPrice: 620,
    edible: true,
    staminaRestore: 25,
    healthRestore: 12
  },
  {
    id: 'chrysanthemum_tea',
    name: 'Kasımpatı Çayı',
    category: 'processed',
    description: 'İç açan kasımpatı çayı.',
    sellPrice: 470,
    edible: true,
    staminaRestore: 20,
    healthRestore: 10
  },
  {
    id: 'osmanthus_tea',
    name: 'Altınçiçek Çayı',
    category: 'processed',
    description: 'Mis kokulu çiçek çayı.',
    sellPrice: 780,
    edible: true,
    staminaRestore: 30,
    healthRestore: 15
  },
  {
    id: 'ginseng_tea',
    name: 'Ginseng Çayı',
    category: 'processed',
    description: 'Bedeni güçlendiren kök çayı.',
    sellPrice: 300,
    edible: true,
    staminaRestore: 40,
    healthRestore: 20
  }
]

/** Tofu eşyaları */
const TOFU_ITEMS: ItemDef[] = [
  {
    id: 'tofu',
    name: 'Tofu',
    category: 'processed',
    description: 'Yumuşak ve taze tofu.',
    sellPrice: 500,
    edible: true,
    staminaRestore: 20,
    healthRestore: 10
  },
  {
    id: 'peanut_tofu',
    name: 'Yer Fıstığı Tofusu',
    category: 'processed',
    description: 'Yoğun aromalı fıstık tofusu.',
    sellPrice: 380,
    edible: true,
    staminaRestore: 18,
    healthRestore: 9
  },
  {
    id: 'sesame_paste',
    name: 'Susam Ezmesi',
    category: 'processed',
    description: 'Yoğun kokulu susam ezmesi.',
    sellPrice: 175,
    edible: true,
    staminaRestore: 15,
    healthRestore: 8
  }
]

/** Şifa eşyaları */
const HERB_PRODUCT_ITEMS: ItemDef[] = [
  {
    id: 'herbal_paste',
    name: 'Ot Merhemi',
    category: 'processed',
    description: 'Ezilmiş şifalı otlardan yapılmış merhem.',
    sellPrice: 80,
    edible: true,
    staminaRestore: 15,
    healthRestore: 10
  },
  {
    id: 'ginseng_extract',
    name: 'Ginseng Özütü',
    category: 'processed',
    description: 'Yoğunlaştırılmış ginseng özü.',
    sellPrice: 400,
    edible: true,
    staminaRestore: 50,
    healthRestore: 25
  },
  {
    id: 'antler_powder',
    name: 'Boynuz Tozu',
    category: 'processed',
    description: 'Öğütülmüş kıymetli boynuz tozu.',
    sellPrice: 950,
    edible: true,
    staminaRestore: 60,
    healthRestore: 30
  },
  {
    id: 'animal_medicine',
    name: 'Hayvan İlacı',
    category: 'misc',
    description: 'Hastalanan hayvanı hemen ayağa kaldırır.',
    sellPrice: 50,
    edible: false
  },
  {
    id: 'stamina_fruit',
    name: 'Hızır Meyvesi',
    category: 'misc',
    description: 'Kadim ruh özü taşıyan meyve; yenince dayanıklılık sınırını kalıcı artırır. Pek nadirdir.',
    sellPrice: 5000,
    edible: false
  }
]

/** Özel yem eşyaları */
const FEED_ITEMS: ItemDef[] = [
  {
    id: 'premium_feed',
    name: 'İyi Yem',
    category: 'material',
    description: 'Özenle hazırlanmış üstün yem; hayvanın keyfini ve sevgisini belirgin artırır.',
    sellPrice: 40,
    edible: false
  },
  {
    id: 'nourishing_feed',
    name: 'Besleyici Yem',
    category: 'material',
    description: 'Kuvvet verici öğeler katılmış yem; üretim döngüsünü hızlandırır.',
    sellPrice: 50,
    edible: false
  },
  {
    id: 'vitality_feed',
    name: 'Canlılık Yemi',
    category: 'material',
    description: 'Şifalı ot özü taşıyan yem; verildiğinde hastalığı kesin giderir.',
    sellPrice: 60,
    edible: false
  }
]

/** Tütsü eşyaları */
const INCENSE_ITEMS: ItemDef[] = [
  { id: 'pine_incense', name: 'Çam Tütsüsü', category: 'gift', description: 'Ferah çam kokulu tütsü; armağan etmeye uygundur.', sellPrice: 100, edible: false },
  { id: 'camphor_incense', name: 'Kafur Tütsüsü', category: 'gift', description: 'Zihni açan kafur kokusu.', sellPrice: 150, edible: false },
  { id: 'osmanthus_incense', name: 'Altınçiçek Tütsüsü', category: 'gift', description: 'Yoğun çiçek kokulu tütsü.', sellPrice: 780, edible: false }
]

/** Silah eşyaları */
const WEAPON_ITEMS: ItemDef[] = Object.values(WEAPONS).map(w => ({
  id: w.id,
  name: w.name,
  category: 'weapon' as const,
  description: w.description,
  sellPrice: getWeaponSellPrice(w.id, null),
  edible: false
}))

/** Yüzük eşyaları */
const RING_ITEMS: ItemDef[] = RINGS.map(r => ({
  id: r.id,
  name: r.name,
  category: 'ring' as const,
  description: r.description,
  sellPrice: r.sellPrice,
  edible: false
}))

/** Şapka eşyaları */
const HAT_ITEMS: ItemDef[] = HATS.map(h => ({
  id: h.id,
  name: h.name,
  category: 'hat' as const,
  description: h.description,
  sellPrice: h.sellPrice,
  edible: false
}))

/** Ayakkabı eşyaları */
const SHOE_ITEMS: ItemDef[] = SHOES.map(s => ({
  id: s.id,
  name: s.name,
  category: 'shoe' as const,
  description: s.description,
  sellPrice: s.sellPrice,
  edible: false
}))

/** Tüm eşya tanımları */
export const ITEMS: ItemDef[] = [
  ...SEED_ITEMS,
  ...CROP_ITEMS,
  ...ORE_ITEMS,
  ...MISC_ITEMS,
  ...FISH_ITEMS,
  ...FOOD_ITEMS,
  ...PROCESSED_ITEMS,
  ...SMOKED_ITEMS,
  ...DRIED_ITEMS,
  ...MACHINE_ITEMS,
  ...SPRINKLER_ITEMS,
  ...FERTILIZER_ITEMS,
  ...BAIT_ITEMS,
  ...TACKLE_ITEMS,
  ...ANIMAL_PRODUCT_ITEMS,
  ...FRUIT_TREE_ITEMS,
  ...SAPLING_ITEMS,
  ...WILD_TREE_ITEMS,
  ...BOMB_ITEMS,
  ...CRAB_POT_ITEMS,
  ...TRUFFLE_OIL_ITEM,
  ...FLOWER_HONEY_ITEMS,
  ...CHEESE_ITEMS,
  ...CLOTH_ITEMS,
  ...BAR_ITEMS,
  ...CHARCOAL_ITEMS,
  ...FLOUR_ITEMS,
  ...TEA_DRINK_ITEMS,
  ...TOFU_ITEMS,
  ...HERB_PRODUCT_ITEMS,
  ...FEED_ITEMS,
  ...INCENSE_ITEMS,

  // Donanım kayıtları
  ...WEAPON_ITEMS,
  ...RING_ITEMS,
  ...HAT_ITEMS,
  ...SHOE_ITEMS,

  // Altın eleme çıktısı
  { id: 'gold_nugget', name: 'Altın Kumu', category: 'misc', description: 'Irmakta elenen, pırıl pırıl altın kırıntısı.', sellPrice: 80, edible: false },

  // ===== Fosiller (8) =====
  { id: 'trilobite_fossil', name: 'Üç Loplu Fosil', category: 'fossil', description: 'Kadim deniz canlısının fosili.', sellPrice: 120, edible: false },
  { id: 'amber', name: 'Kehribar', category: 'fossil', description: 'Bin yılların reçinesi taşlaşmış hâlde.', sellPrice: 150, edible: false },
  { id: 'ammonite_fossil', name: 'Sarmal Kabuk Fosili', category: 'fossil', description: 'Helezon biçimli kadim deniz fosili.', sellPrice: 180, edible: false },
  { id: 'fern_fossil', name: 'Eğrelti Fosili', category: 'fossil', description: 'İyi korunmuş kadim eğrelti izi.', sellPrice: 100, edible: false },
  { id: 'shell_fossil', name: 'Kabuk Fosili', category: 'fossil', description: 'Eski çağ yumuşakçalarının kabuk kalıntısı.', sellPrice: 90, edible: false },
  { id: 'bone_fragment', name: 'Kemik Parçası', category: 'fossil', description: 'Kim olduğu bilinmeyen kadim canlının kemik kırığı.', sellPrice: 200, edible: false },
  { id: 'petrified_wood', name: 'Taşlaşmış Odun', category: 'fossil', description: 'Taşa dönmüş kadim ağaç parçası.', sellPrice: 130, edible: false },
  { id: 'dragon_tooth', name: 'Ejder Dişi Fosili', category: 'fossil', description: 'Söylenceye göre ejder soyundan kalma diş.', sellPrice: 350, edible: false },

  // ===== Kadim Eşyalar (10) =====
  { id: 'ancient_pottery', name: 'Kadim Çömlek Kırığı', category: 'artifact', description: 'Eski uygarlıktan kalmış çömlek parçası.', sellPrice: 100, edible: false },
  { id: 'jade_disc', name: 'Yeşim Disk Parçası', category: 'artifact', description: 'İnce işlenmiş kadim yeşim kırığı.', sellPrice: 250, edible: false },
  { id: 'bronze_mirror', name: 'Tunç Ayna', category: 'artifact', description: 'İyi perdahlanmış kadim tunç ayna.', sellPrice: 200, edible: false },
  { id: 'ancient_coin', name: 'Kadim Sikke', category: 'artifact', description: 'Hangi devre ait olduğu bilinmeyen eski sikke.', sellPrice: 150, edible: false },
  { id: 'oracle_bone', name: 'Kehanet Kemiği', category: 'artifact', description: 'Üzerinde fal yazıları işli kadim kemik.', sellPrice: 300, edible: false },
  { id: 'jade_pendant', name: 'Yeşim Tılsım', category: 'artifact', description: 'Yumuşak parıltılı kadim boyunluk.', sellPrice: 220, edible: false },
  {
    id: 'ancient_seed',
    name: 'Kadim Tohum',
    category: 'artifact',
    description: 'Kadim canlılık taşıyan gizemli tohum; söylenceye göre eski çağ meyvesi verir.',
    sellPrice: 400,
    edible: false
  },
  { id: 'bamboo_scroll', name: 'Bambu Yazıtı', category: 'artifact', description: 'Kadim yazılar taşıyan bambu levha kırığı.', sellPrice: 180, edible: false },
  { id: 'stone_axe_head', name: 'Taş Balta Başı', category: 'artifact', description: 'Eski halkların kullandığı taş balta başı.', sellPrice: 120, edible: false },
  { id: 'painted_pottery', name: 'Boyalı Çömlek Parçası', category: 'artifact', description: 'Üzeri desenli kadim çömlek kırığı.', sellPrice: 200, edible: false },

  // ===== Lonca dükkânı eşyaları =====
  {
    id: 'combat_tonic',
    name: 'Savaş Şurubu',
    category: 'food',
    description: '30 can yeniler.',
    sellPrice: 100,
    edible: true,
    staminaRestore: 0,
    healthRestore: 30
  },
  {
    id: 'fortify_brew',
    name: 'Güç Şerbeti',
    category: 'food',
    description: '60 can yeniler.',
    sellPrice: 250,
    edible: true,
    staminaRestore: 0,
    healthRestore: 60
  },
  {
    id: 'ironhide_potion',
    name: 'Demir Deri İksiri',
    category: 'food',
    description: 'Bütün canı yeniler.',
    sellPrice: 400,
    edible: true,
    staminaRestore: 0,
    healthRestore: 999
  },
  { id: 'slayer_charm', name: 'Avcı Muskası', category: 'misc', description: 'Yaratık düşürme oranı +%20 (o keşif için).', sellPrice: 750, edible: false },
  {
    id: 'warriors_feast',
    name: 'Yiğit Sofrası',
    category: 'food',
    description: '50 dayanıklılık ve 50 can yeniler.',
    sellPrice: 500,
    edible: true,
    staminaRestore: 50,
    healthRestore: 50
  },
  { id: 'monster_lure', name: 'Yaratık Yemi', category: 'misc', description: 'Bu katta yaratık sayısını iki katına çıkarır.', sellPrice: 1000, edible: false },
  { id: 'guild_badge', name: 'Lonca Nişanı', category: 'misc', description: 'Saldırı gücü kalıcı +3.', sellPrice: 0, edible: false },
  { id: 'life_talisman', name: 'Yaşam Muskası', category: 'misc', description: 'Azami can kalıcı +15.', sellPrice: 0, edible: false },
  { id: 'defense_charm', name: 'Korunma Tılsımı', category: 'misc', description: 'Savunma kalıcı +%3.', sellPrice: 0, edible: false },
  {
    id: 'adventurer_ration',
    name: 'Seyyah Azığı',
    category: 'food',
    description: '25 dayanıklılık ve 25 can yeniler.',
    sellPrice: 175,
    edible: true,
    staminaRestore: 25,
    healthRestore: 25
  },
  {
    id: 'stamina_elixir',
    name: 'Takat İksiri',
    category: 'food',
    description: '120 dayanıklılık yeniler.',
    sellPrice: 300,
    edible: true,
    staminaRestore: 120,
    healthRestore: 0
  },
  { id: 'lucky_coin', name: 'Uğurlu Sikke', category: 'misc', description: 'Yaratık düşürme oranı kalıcı +%5.', sellPrice: 0, edible: false },

  // ===== Batı çölü eşyaları =====
  {
    id: 'hanhai_cactus_seed',
    name: 'Kaktüs Tohumu',
    category: 'seed',
    description: 'Batı çöllerinden gelmiş tuhaf bitki tohumu; yazın ekilir.',
    sellPrice: 250,
    edible: false
  },
  {
    id: 'hanhai_date_seed',
    name: 'Hurma Tohumu',
    category: 'seed',
    description: 'İpek yolundan gelmiş batı meyvesi tohumu; yaz ve güzde ekilir.',
    sellPrice: 200,
    edible: false
  },
  { id: 'hanhai_spice', name: 'Batı Baharatı', category: 'material', description: 'Uzak diyarlardan gelen baharat; yemeklere çok yakışır.', sellPrice: 150, edible: false },
  { id: 'hanhai_silk', name: 'Üstün İpek', category: 'material', description: 'İnce ve kaygan seçkin ipek.', sellPrice: 400, edible: false },
  { id: 'hanhai_turquoise', name: 'Turkuaz', category: 'gem', description: 'Batı diyarına özgü kıymetli taş.', sellPrice: 300, edible: false },
  { id: 'hanhai_map', name: 'Define Haritası', category: 'misc', description: 'Bozkırın bir köşesindeki gömüyü işaretleyen harita.', sellPrice: 500, edible: false },
  {
    id: 'mega_bomb_recipe',
    name: 'Dev Bomba Tarifi',
    category: 'misc',
    description: 'Söylentiye göre bütün maden katını sarsacak gizli tarif.',
    sellPrice: 2500,
    edible: false
  },

  // ==================== Ruhani eşyalar ====================
  // İz bulma eşyası
  {
    id: 'fox_bead',
    name: 'Tilki Tılsımı',
    category: 'misc',
    description: 'Maden dibinde bulunmuş kızıl boncuk; elde sıcak durur, sanki canlı gibidir.',
    sellPrice: 500,
    edible: false
  },

  // Bağ kurma eşyaları
  {
    id: 'dragon_scale_charm',
    name: 'Ejder Pul Tılsımı',
    category: 'misc',
    description: 'Ejder Yadigârı’ndan oyulmuş pul biçimli takı; derin kudret taşır.',
    sellPrice: 0,
    edible: false
  },
  { id: 'blossom_crown', name: 'Çiçek Tacı', category: 'misc', description: 'Solmayan şeftali çiçeklerinden örülmüş taç.', sellPrice: 0, edible: false },
  { id: 'jade_mortar', name: 'Yeşim Havaneli', category: 'misc', description: 'Aytaşı’ndan oyulmuş havaneli; ay ruhunun tokmağına eştir.', sellPrice: 0, edible: false },
  { id: 'fox_flame_lantern', name: 'Tilki Alevi Feneri', category: 'misc', description: 'İçinde tilki alevi saklıdır; hiç sönmez.', sellPrice: 0, edible: false },
  {
    id: 'cultivation_jade',
    name: 'Arınma Tılsımı',
    category: 'misc',
    description: 'Ruh özü taşıyan yeşim takı; yol erlerinin nişanesidir.',
    sellPrice: 0,
    edible: false
  },
  {
    id: 'silver_thread_ring',
    name: 'Gümüş İplik Yüzüğü',
    category: 'misc',
    description: 'Ayışığı gibi gümüş tellerle örülmüş yüzük; yuvaya dönüş özlemini taşır.',
    sellPrice: 0,
    edible: false
  },

  // Son bağlılık eşyaları
  {
    id: 'dragon_pearl',
    name: 'Ejder İncisi',
    category: 'misc',
    description: 'Ejder Yadigârı, Aytaşı ve Yedi Renk Parçası’ndan dövülmüş kutlu inci; ejder soyunun en yüce bağlılık nişanesidir.',
    sellPrice: 0,
    edible: false
  },
  {
    id: 'eternal_blossom',
    name: 'Solmaz Çiçek',
    category: 'misc',
    description: 'Yüce şeftali, bal ve altınçiçek özünden yoğrulmuş; asla solmayan ruh çiçeği.',
    sellPrice: 0,
    edible: false
  },
  {
    id: 'moon_elixir',
    name: 'Ay Işığı İksiri',
    category: 'misc',
    description: 'Ginseng, karçiçeği ve Aytaşı’ndan pişirilmiş kutlu iksir; yumuşak gümüş ışık saçar.',
    sellPrice: 0,
    edible: false
  },
  {
    id: 'fox_spirit_bead',
    name: 'Kutlu Tilki Boncuğu',
    category: 'misc',
    description: 'Yakut, Aytaşı ve altınla işlenmiş boncuk; tilki ruhunun bir kıvılcımını saklar.',
    sellPrice: 0,
    edible: false
  },
  {
    id: 'immortal_gourd',
    name: 'Eren Testisi',
    category: 'misc',
    description: 'Ginseng, boynuz özü ve Gökdemir Cevheri ile yoğrulmuş ilaç testisi; içinde yüzyıllık arınma gücü taşır.',
    sellPrice: 0,
    edible: false
  },
  {
    id: 'starlight_loom',
    name: 'Yıldız Işığı Tezgâhı',
    category: 'misc',
    description: 'İpek Lif, Aytaşı ve Yedi Renk Parçası’ndan kurulmuş küçük tezgâh; yıldız gibi parlayan lifler dokur.',
    sellPrice: 0,
    edible: false
  },

  // Yetenek çıktısı eşyaları
  {
    id: 'spirit_peach',
    name: 'Kutlu Şeftali',
    category: 'misc',
    description: 'Kut verilmiş ruh şeftalisi; etrafına ince bir parıltı yayar.',
    sellPrice: 800,
    edible: true,
    staminaRestore: 50,
    healthRestore: 30
  },
  { id: 'moon_herb', name: 'Ay Otu', category: 'material', description: 'Ay ışığı altında büyüyen ruh otu; devası güçlüdür.', sellPrice: 300, edible: false },
  { id: 'dream_silk', name: 'Düş İpeği', category: 'material', description: 'Ruh dokuyucunun ördüğü gümüş iplik; yıldız gibi ışıldar.', sellPrice: 500, edible: false }
]

/** Kimliğe göre eşya bul */
export const getItemById = (id: string): ItemDef | undefined => {
  return ITEMS.find(i => i.id === id)
}

/** Eşya kategorisine göre varsayılan kaynak */
const CATEGORY_SOURCE: Record<ItemCategory, string> = {
  seed: 'Dükkândan alınır',
  crop: 'Ekimden hasat edilir',
  fish: 'Olta ile tutulur',
  ore: 'Madenden çıkar',
  gem: 'Madenden çıkar',
  material: 'Toplama / üretim',
  food: 'Pişirilir',
  processed: 'İşlenir',
  machine: 'Üretilir',
  sprinkler: 'Üretilir',
  fertilizer: 'Üretilir',
  bait: 'Dükkândan alınır',
  tackle: 'Dükkândan alınır',
  animal_product: 'Hayvancılıktan gelir',
  fruit: 'Ağaçtan toplanır',
  sapling: 'Dükkândan alınır',
  bomb: 'Üretilir',
  gift: 'Toplama / dükkân',
  fossil: 'Madende bulunur',
  artifact: 'Madende bulunur',
  weapon: 'Dükkân / düşürme',
  ring: 'Dükkân / üretim',
  hat: 'Dükkân / üretim',
  shoe: 'Demirci yapar',
  misc: 'Çeşitli yollarla'
}

/** Belirli eşyalar için özel kaynak açıklamaları */
const ITEM_SOURCE_OVERRIDES: Record<string, string> = {
  // Malzemeler
  wood: 'Ağaç kesilerek',
  bamboo: 'Bambu kesilerek',
  herb: 'Dağdan toplanır',
  firewood: 'Ağaç kesilerek',
  pine_cone: 'Ağaçtan düşer',
  battery: 'Paratoner (fırtınalı havada)',
  copper_bar: 'Ergitme ocağında',
  iron_bar: 'Ergitme ocağında',
  gold_bar: 'Ergitme ocağında',
  iridium_bar: 'Ergitme ocağında',
  charcoal: 'Kömür ocağında',
  rice_flour: 'Taş değirmende',
  wheat_flour: 'Taş değirmende',
  cornmeal: 'Taş değirmende',
  cloth: 'Dokuma tezgâhında',
  silk_cloth: 'Dokuma tezgâhında',
  alpaca_cloth: 'Dokuma tezgâhında',
  felt: 'Dokuma tezgâhında',
  fish_feed: 'Dükkândan alınır',
  water_purifier: 'Dükkândan alınır',
  // Toplananlar
  wild_mushroom: 'Maden mantar katı / güz toplayıcılığı',
  winter_bamboo_shoot: 'Kış toplayıcılığı',
  ginseng: 'Güz toplayıcılığı',
  wild_berry: 'Yaz toplayıcılığı',
  camphor_seed: 'Yabani ağaçtan düşer',
  mulberry: 'Dut ağacından toplanır',
  pine_resin: 'Reçine toplayıcı ile',
  // Yabani ağaçla ilgili
  tapper: 'Üretilir',
  lightning_rod: 'Üretilir',
  // Makineler
  scarecrow: 'Üretilir',
  crab_pot: 'Üretilir',
  // Kapanla yakalananlar
  snail: 'Yengeç kapanı ile',
  freshwater_shrimp: 'Yengeç kapanı ile',
  crab: 'Yengeç kapanı ile',
  lobster: 'Yengeç kapanı ile',
  cave_shrimp: 'Yengeç kapanı ile',
  swamp_crab: 'Yengeç kapanı ile',
  trash: 'Yengeç kapanı ile',
  driftwood: 'Yengeç kapanı ile',
  broken_cd: 'Yengeç kapanı ile',
  soggy_newspaper: 'Yengeç kapanı ile',
  // Bal
  chrysanthemum_honey: 'Arı kovanından',
  osmanthus_honey: 'Arı kovanından',
  rapeseed_honey: 'Arı kovanından',
  snow_lotus_honey: 'Arı kovanından',
  // Peynir
  cheese: 'Peynir düzeneğinde',
  goat_cheese: 'Peynir düzeneğinde',
  buffalo_cheese: 'Peynir düzeneğinde',
  yak_cheese: 'Peynir düzeneğinde',
  // Trüf yağı
  truffle_oil: 'Yağ düzeneğinde',
  // Tofu
  tofu: 'Taş değirmende',
  peanut_tofu: 'Taş değirmende',
  sesame_paste: 'Taş değirmende',
  // Çay içecekleri
  green_tea_drink: 'İşlenerek',
  chrysanthemum_tea: 'İşlenerek',
  ginseng_tea: 'İşlenerek',
  // Hediyeler
  jade_ring: 'Dükkândan alınır',
  silk_ribbon: 'Dükkândan alınır',
  zhiji_jade: 'Dükkândan alınır',
  wintersweet: 'Kış toplayıcılığı',
  pine_incense: 'Üretilir',
  camphor_incense: 'Üretilir',
  osmanthus_incense: 'Üretilir',
  // Çeşitli
  rain_totem: 'Üretilir',
  gold_nugget: 'Irmakta eleme ile',
  // Lonca dükkânı
  combat_tonic: 'Seyyahlar Loncası',
  fortify_brew: 'Seyyahlar Loncası',
  ironhide_potion: 'Seyyahlar Loncası',
  warriors_feast: 'Seyyahlar Loncası',
  slayer_charm: 'Seyyahlar Loncası',
  monster_lure: 'Seyyahlar Loncası',
  guild_badge: 'Seyyahlar Loncası',
  life_talisman: 'Seyyahlar Loncası',
  defense_charm: 'Seyyahlar Loncası',
  lucky_coin: 'Seyyahlar Loncası',
  adventurer_ration: 'Seyyahlar Loncası',
  stamina_elixir: 'Seyyahlar Loncası',
  // Batı çölü eşyaları
  hanhai_cactus_seed: 'Batı Çölü Tüccarı',
  hanhai_date_seed: 'Batı Çölü Tüccarı',
  hanhai_spice: 'Batı Çölü Tüccarı',
  hanhai_silk: 'Batı Çölü Tüccarı',
  hanhai_turquoise: 'Batı Çölü Tüccarı',
  hanhai_map: 'Batı Çölü',
  hanhai_fossil: 'Batı Çölü',
  mega_bomb_recipe: 'Batı Çölü',
  // Kadim tohum
  ancient_seed: 'Madende bulunur (ekilebilir)',
  // Ot işleme ürünleri
  herbal_paste: 'İşlenerek',
  ginseng_extract: 'İşlenerek',
  antler_powder: 'İşlenerek',
  stamina_fruit: 'Uçurum sandığı (pek nadir) / üretim',
  // Ruhani eşyalar
  fox_bead: 'Madenin derini (tilki ruhuna dair iz)',
  spirit_peach: 'Kutlu bağ yeteneği · Ruh Şeftalisi',
  moon_herb: 'Kutlu bağ yeteneği · Ay Işığı',
  dream_silk: 'Kutlu bağ yeteneği · Düş Dokusu',
  dragon_scale_charm: 'Üretim (ejder bağlılık nişanesi)',
  blossom_crown: 'Üretim (çiçek ruhu bağlılık nişanesi)',
  jade_mortar: 'Üretim (ay ruhu bağlılık nişanesi)',
  fox_flame_lantern: 'Üretim (tilki ruhu bağlılık nişanesi)',
  cultivation_jade: 'Üretim (dağ ereni bağlılık nişanesi)',
  silver_thread_ring: 'Üretim (düş dokuyucu bağlılık nişanesi)',
  dragon_pearl: 'Üretim (ejder son bağ nişanesi)',
  eternal_blossom: 'Üretim (çiçek ruhu son bağ nişanesi)',
  moon_elixir: 'Üretim (ay ruhu son bağ nişanesi)',
  fox_spirit_bead: 'Üretim (tilki ruhu son bağ nişanesi)',
  immortal_gourd: 'Üretim (dağ ereni son bağ nişanesi)',
  starlight_loom: 'Üretim (düş dokuyucu son bağ nişanesi)'
}

/** Eşyanın kaynak açıklamasını getirir */
export const getItemSource = (itemId: string): string => {
  const override = ITEM_SOURCE_OVERRIDES[itemId]
  if (override) return override
  const def = getItemById(itemId)
  if (!def) return 'Bilinmiyor'
  return CATEGORY_SOURCE[def.category]
}

/** Sandık aşama tanımları */
import type { ChestTier } from '@/types'

export const CHEST_DEFS: Record<
  ChestTier,
  {
    name: string
    capacity: number
    craftCost: { itemId: string; quantity: number }[]
    craftMoney: number
    description: string
  }
> = {
  wood: {
    name: 'Ahşap Sandık',
    capacity: 9,
    craftCost: [{ itemId: 'wood', quantity: 50 }],
    craftMoney: 500,
    description: 'Temel saklama sandığı; 9 göz eşya alır.'
  },
  copper: {
    name: 'Bakır Sandık',
    capacity: 18,
    craftCost: [{ itemId: 'copper_bar', quantity: 15 }],
    craftMoney: 2000,
    description: 'Sağlam bakır sandık; 18 göz eşya alır.'
  },
  iron: {
    name: 'Demir Sandık',
    capacity: 27,
    craftCost: [
      { itemId: 'iron_bar', quantity: 10 },
      { itemId: 'wood', quantity: 20 }
    ],
    craftMoney: 5000,
    description: 'Dayanıklı demir sandık; 27 göz eşya alır.'
  },
  gold: {
    name: 'Altın Sandık',
    capacity: 36,
    craftCost: [
      { itemId: 'gold_bar', quantity: 8 },
      { itemId: 'iron_bar', quantity: 5 }
    ],
    craftMoney: 10000,
    description: 'Gösterişli altın sandık; 36 göz eşya alır.'
  },
  void: {
    name: 'Boşluk Sandığı',
    capacity: 27,
    craftCost: [
      { itemId: 'iridium_bar', quantity: 5 },
      { itemId: 'void_ore', quantity: 20 }
    ],
    craftMoney: 25000,
    description: 'Uzaktan erişilebilir; atölye hammadde / ürün sandığı olarak da ayarlanabilir. 27 gözlüdür.'
  }
}

/** Sandık aşama sırası */
export const CHEST_TIER_ORDER: ChestTier[] = ['wood', 'copper', 'iron', 'gold', 'void']
