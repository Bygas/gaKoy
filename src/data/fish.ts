import type { FishDef, FishingLocation } from '@/types'

/** Balıkçılık bölgeleri tanımları */
export const FISHING_LOCATIONS: { id: FishingLocation; name: string; description: string }[] = [
  { id: 'creek', name: 'Dere', description: 'gaKöy yanındaki berrak dere; oltaya yeni alışanlar için uygundur.' },
  { id: 'pond', name: 'Gölet', description: 'Köy içindeki dingin gölet; suyu ayna gibi durudur.' },
  { id: 'river', name: 'Irmak', description: 'Coşkun büyük ırmak; iri balıklar burada dolaşır.' },
  { id: 'mine', name: 'Maden Yeraltı Suyu', description: 'Madenin derinlerindeki yeraltı suları; buradaki balıklar mevsimden etkilenmez.' },
  { id: 'waterfall', name: 'Çağlayan', description: 'Dağ çağlayanının altındaki derin çukur; burada ancak usta oltacılar kazançlı çıkar.' },
  { id: 'swamp', name: 'Bataklık', description: 'gaKöy dışındaki sulak alan; tuhaf su canlıları burada barınır.' }
]

/** Tüm balık tanımları (60 tür) */
export const FISH: FishDef[] = [
  // ==================== Dere (creek) — 15 tür ====================
  {
    id: 'crucian',
    name: 'Gümüş Balığı',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 15,
    description: 'En yaygın tatlı su balığı; yeni başlayanların güvenilir yoldaşı.',
    location: 'creek',
    miniGameSpeed: 0.8,
    miniGameDirChange: 0.02
  },
  {
    id: 'carp',
    name: 'Sazan',
    season: ['spring', 'summer'],
    weather: ['sunny'],
    difficulty: 'easy',
    sellPrice: 25,
    description: 'Güneşli günlerde dere kıyısında sıkça görülen balık.',
    location: 'creek',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.03
  },
  {
    id: 'silver_carp',
    name: 'Gümüş Sazan',
    season: ['spring', 'summer'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 20,
    description: 'Sık rastlanan açık pullu bir sazan türü.',
    location: 'creek',
    miniGameSpeed: 1.2,
    miniGameDirChange: 0.03
  },
  {
    id: 'ice_fish',
    name: 'Buz Balığı',
    season: ['winter'],
    weather: ['snowy'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Ayaz sularda yaşayan küçük bir balık.',
    location: 'creek',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.04
  },
  {
    id: 'dragonfish',
    name: 'Ejder Balığı',
    season: ['summer'],
    weather: ['stormy'],
    difficulty: 'legendary',
    sellPrice: 500,
    description: 'Yalnızca fırtınada görülen, dillere destan bir balık.',
    location: 'creek',
    miniGameSpeed: 5.0,
    miniGameDirChange: 0.10
  },
  // Dere ekleri
  {
    id: 'minnow',
    name: 'Akbalık',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 10,
    description: 'Derenin en gösterişsiz balığı; üç beşli sürüler hâlinde gezer.',
    location: 'creek',
    miniGameSpeed: 0.6,
    miniGameDirChange: 0.02
  },
  {
    id: 'creek_chub',
    name: 'Dere Kefali',
    season: ['spring', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 18,
    description: 'Dere içinde kıvrakça dolaşan küçük balık.',
    location: 'creek',
    miniGameSpeed: 1.3,
    miniGameDirChange: 0.04
  },
  {
    id: 'loach',
    name: 'Çamur Balığı',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'easy',
    sellPrice: 22,
    description: 'Yağmur sonrası dere dibinde coşan çamur balığı.',
    location: 'creek',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.05
  },
  {
    id: 'rainbow_trout',
    name: 'Gökkuşağı Alabalığı',
    season: ['spring', 'summer'],
    weather: ['sunny'],
    difficulty: 'normal',
    sellPrice: 45,
    description: 'Güneşte yedi renk parıltısı saçan alabalık.',
    location: 'creek',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.05
  },
  {
    id: 'creek_perch',
    name: 'Dere Levreği',
    season: ['autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Sonbahar sonu dere sularında görülen levrek.',
    location: 'creek',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.03
  },
  {
    id: 'stone_loach',
    name: 'Taş Beneklisi',
    season: ['summer'],
    weather: ['sunny', 'windy'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Dere taşlarının çatlaklarına sinen benekli balık.',
    location: 'creek',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.06
  },
  {
    id: 'creek_shrimp',
    name: 'Dere Karidesi',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 30,
    description: 'Berrak dere suyunda yaşayan ufak karides.',
    location: 'creek',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.06
  },
  {
    id: 'creek_salmon',
    name: 'Dere Somonu',
    season: ['autumn'],
    weather: ['rainy', 'windy'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'Güz vakti akıntıya karşı göç eden somon.',
    location: 'creek',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'golden_perch',
    name: 'Altın Levrek',
    season: ['summer'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 110,
    description: 'Nadir görülen altın pullu levrek; değeri yüksektir.',
    location: 'creek',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.05
  },
  {
    id: 'creek_king',
    name: 'Dere Hükümdarı',
    season: ['spring', 'autumn'],
    weather: ['rainy'],
    difficulty: 'hard',
    sellPrice: 140,
    description: 'Derenin efendisi sayılan, kudretli ve inatçı balık.',
    location: 'creek',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.04
  },

  // ==================== Gölet (pond) — 10 tür ====================
  {
    id: 'grass_carp',
    name: 'Ot Sazanı',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 40,
    description: 'İri yapılı bir tatlı su balığı.',
    location: 'pond',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'koi',
    name: 'Benekli Süs Sazanı',
    season: ['spring'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 120,
    description: 'Gösterişli pullarıyla çok kıymetli bir süs balığı.',
    location: 'pond',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.08
  },
  {
    id: 'golden_carp',
    name: 'Altın Sazan',
    season: ['spring'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 150,
    description: 'Işıl ışıl parlayan altın renkli sazan.',
    location: 'pond',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.09
  },
  {
    id: 'golden_turtle',
    name: 'Altın Kabuklu Kaplumbağa',
    season: ['autumn'],
    weather: ['sunny'],
    difficulty: 'legendary',
    sellPrice: 450,
    description: 'Sırtında altın kabuk taşıdığı söylenen kutlu kaplumbağa.',
    location: 'pond',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.12
  },
  // Gölet ekleri
  {
    id: 'pond_snail',
    name: 'Su Salyangozu',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 12,
    description: 'Gölet dibinde yaşayan küçük salyangoz.',
    location: 'pond',
    miniGameSpeed: 0.5,
    miniGameDirChange: 0.01
  },
  {
    id: 'crucian_pond',
    name: 'Gölet Gümüşü',
    season: ['spring', 'summer'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 18,
    description: 'Gölette semirmiş, eti dolgun gümüş balığı.',
    location: 'pond',
    miniGameSpeed: 0.9,
    miniGameDirChange: 0.02
  },
  {
    id: 'red_tail',
    name: 'Kızıl Kuyruk',
    season: ['summer', 'autumn'],
    weather: ['sunny'],
    difficulty: 'easy',
    sellPrice: 25,
    description: 'Kuyruk yüzgeci kızıl parlayan süs balığı.',
    location: 'pond',
    miniGameSpeed: 1.1,
    miniGameDirChange: 0.03
  },
  {
    id: 'lotus_carp',
    name: 'Nilüfer Sazanı',
    season: ['summer'],
    weather: ['sunny', 'rainy'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'Nilüfer yaprakları arasında süzülen sazan.',
    location: 'pond',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.06
  },
  {
    id: 'pond_turtle',
    name: 'Gölet Kaplumbağası',
    season: ['summer', 'autumn'],
    weather: ['sunny'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Güneşte kabuğunu ısıtan küçük gölet kaplumbağası.',
    location: 'pond',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.02
  },
  {
    id: 'moon_fish',
    name: 'Ay Işığı Balığı',
    season: ['autumn'],
    weather: ['windy'],
    difficulty: 'normal',
    sellPrice: 75,
    description: 'Güz rüzgârında su yüzüne çıkan gümüş parlaklığındaki balık.',
    location: 'pond',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.05
  },

  // ==================== Irmak (river) — 12 tür ====================
  {
    id: 'bass',
    name: 'Levrek',
    season: ['autumn'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 60,
    description: 'Güz yağmurunda ortaya çıkan leziz bir balık.',
    location: 'river',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.04
  },
  {
    id: 'catfish',
    name: 'Yayın Balığı',
    season: ['summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 45,
    description: 'Yağmurlu havada daha da hareketlenen yayın balığı.',
    location: 'river',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.05
  },
  {
    id: 'sturgeon',
    name: 'Mersin Balığı',
    season: ['summer', 'autumn'],
    weather: ['sunny'],
    difficulty: 'hard',
    sellPrice: 130,
    description: 'Gövdeli ve eski çağları anımsatan iri bir balık türü.',
    location: 'river',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'mandarin_fish',
    name: 'Benekli Tatlısu Levreği',
    season: ['autumn'],
    weather: ['sunny'],
    difficulty: 'normal',
    sellPrice: 70,
    description: 'Eti yumuşak ve pek makbul bir ırmak balığı.',
    location: 'river',
    miniGameSpeed: 2.3,
    miniGameDirChange: 0.05
  },
  // Irmak ekleri
  {
    id: 'green_fish',
    name: 'Yeşil Sazan',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 28,
    description: 'Irmakta sık rastlanan iri tatlı su balığı.',
    location: 'river',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.02
  },
  {
    id: 'bighead_carp',
    name: 'Koca Kafalı Sazan',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 30,
    description: 'Başı iri, gövdesi dolgun bir sazan türü.',
    location: 'river',
    miniGameSpeed: 0.8,
    miniGameDirChange: 0.02
  },
  {
    id: 'pike',
    name: 'Turna',
    season: ['summer'],
    weather: ['sunny', 'windy'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'Tatlı suyun saldırgan avcısı.',
    location: 'river',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'knife_fish',
    name: 'Bıçak Balığı',
    season: ['spring'],
    weather: ['windy', 'rainy'],
    difficulty: 'normal',
    sellPrice: 75,
    description: 'Bedeni bıçak gibi ince; bahar kabarmasında göç eder.',
    location: 'river',
    miniGameSpeed: 2.8,
    miniGameDirChange: 0.03
  },
  {
    id: 'river_crab',
    name: 'Irmak Yengesi',
    season: ['autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 80,
    description: 'Güz gelince eti dolup taşan irice yengeç.',
    location: 'river',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.07
  },
  {
    id: 'river_eel',
    name: 'Irmak Yılan Balığı',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'hard',
    sellPrice: 100,
    description: 'Yağmurlu gecelerde canlanan çevik yılan balığı.',
    location: 'river',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.07
  },
  {
    id: 'chinese_sturgeon',
    name: 'Kutlu Mersin',
    season: ['spring', 'autumn'],
    weather: ['rainy', 'stormy'],
    difficulty: 'hard',
    sellPrice: 180,
    description: 'Nadide, iri ve uzun yol göçü yapan görkemli balık.',
    location: 'river',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'river_dragon',
    name: 'Irmak Ejderi',
    season: ['summer'],
    weather: ['stormy'],
    difficulty: 'legendary',
    sellPrice: 550,
    description: 'Fırtınada ırmak yüzüne sıçrayan efsanevi dev balık.',
    location: 'river',
    miniGameSpeed: 5.5,
    miniGameDirChange: 0.05
  },

  // ==================== Maden Yeraltı Suyu (mine) — 8 tür ====================
  {
    id: 'cave_loach',
    name: 'Maden Çamur Balığı',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 35,
    description: 'Madenin yeraltı sularında yaşayan çamur balığı.',
    location: 'mine',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.05
  },
  {
    id: 'cave_blindfish',
    name: 'Mağara Kör Balığı',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'hard',
    sellPrice: 100,
    description: 'Madenin derinlerinde görülen, çok seyrek rastlanan kör balık.',
    location: 'mine',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.09
  },
  // Maden ekleri
  {
    id: 'glowfish',
    name: 'Işıldak Balık',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 25,
    description: 'Karanlıkta zayıf bir ışık saçan küçük balık.',
    location: 'mine',
    miniGameSpeed: 0.8,
    miniGameDirChange: 0.03
  },
  {
    id: 'stone_crab',
    name: 'Taş Yengeci',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 30,
    description: 'Maden kayaları arasında yaşayan küçük yengeç.',
    location: 'mine',
    miniGameSpeed: 0.7,
    miniGameDirChange: 0.02
  },
  {
    id: 'crystal_shrimp',
    name: 'Billur Karides',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 60,
    description: 'Büsbütün saydam görünen, billur gibi karides.',
    location: 'mine',
    miniGameSpeed: 2.2,
    miniGameDirChange: 0.06
  },
  {
    id: 'lava_snail',
    name: 'Kor Salyangozu',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 70,
    description: 'Kor katmanına yakın yaşayan, sıcağa dayanıklı salyangoz.',
    location: 'mine',
    miniGameSpeed: 1.2,
    miniGameDirChange: 0.03
  },
  {
    id: 'shadow_fish',
    name: 'Gölge Balığı',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'hard',
    sellPrice: 120,
    description: 'Karanlık yarıklarda dolaşan uğursu görünümlü balık.',
    location: 'mine',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.08
  },
  {
    id: 'abyss_leviathan',
    name: 'Dip Ulu Yılanı',
    season: ['spring', 'summer', 'autumn', 'winter'],
    weather: ['any'],
    difficulty: 'legendary',
    sellPrice: 800,
    description: 'Madenin en dibindeki kadim yaratık; onu tüm gören çıkmamıştır.',
    location: 'mine',
    miniGameSpeed: 4.5,
    miniGameDirChange: 0.15
  },

  // ==================== Çağlayan (waterfall) — 8 tür ====================
  {
    id: 'eel',
    name: 'Yılan Balığı',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'hard',
    sellPrice: 85,
    description: 'Kaygan bedenli, ele avuca sığmayan bir balık.',
    location: 'waterfall',
    miniGameSpeed: 3.5,
    miniGameDirChange: 0.08
  },
  // Çağlayan ekleri
  {
    id: 'mountain_minnow',
    name: 'Dağ Deresi Balığı',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 20,
    description: 'Çağlayan havuzcuğunun kıyısında görülen küçük balık.',
    location: 'waterfall',
    miniGameSpeed: 1.0,
    miniGameDirChange: 0.03
  },
  {
    id: 'rock_fish',
    name: 'Kaya Balığı',
    season: ['spring', 'summer'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Çağlayan kayaları arasında saklanan balık.',
    location: 'waterfall',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.04
  },
  {
    id: 'waterfall_crab',
    name: 'Dağ Yengesi',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Çağlayan altındaki kaya çatlaklarında yaşayan yengeç.',
    location: 'waterfall',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.06
  },
  {
    id: 'torrent_fish',
    name: 'Coşkun Akıntı Balığı',
    season: ['spring', 'summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 60,
    description: 'Azgın akıntıya karşı yüzebilen güçlü balık.',
    location: 'waterfall',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.03
  },
  {
    id: 'flying_fish',
    name: 'Uçar Balık',
    season: ['summer'],
    weather: ['windy'],
    difficulty: 'normal',
    sellPrice: 70,
    description: 'Sudan sıçrayıp rüzgârla bir an süzülen garip balık.',
    location: 'waterfall',
    miniGameSpeed: 3.0,
    miniGameDirChange: 0.07
  },
  {
    id: 'rock_eel',
    name: 'Kaya Yılan Balığı',
    season: ['autumn', 'winter'],
    weather: ['rainy', 'snowy'],
    difficulty: 'hard',
    sellPrice: 130,
    description: 'Çağlayan dibindeki mağaralarda dolaşan iri yılan balığı.',
    location: 'waterfall',
    miniGameSpeed: 3.0,
    miniGameDirChange: 0.04
  },
  {
    id: 'jade_dragon',
    name: 'Yeşim Ejderi',
    season: ['spring'],
    weather: ['rainy'],
    difficulty: 'legendary',
    sellPrice: 600,
    description: 'Bahar yağmurunda çağlayanda belirdiği söylenen yeşil ruh ejderi.',
    location: 'waterfall',
    miniGameSpeed: 4.5,
    miniGameDirChange: 0.07
  },

  // ==================== Bataklık (swamp) — 7 tür ====================
  {
    id: 'giant_salamander',
    name: 'Ulu Semender',
    season: ['winter'],
    weather: ['snowy'],
    difficulty: 'legendary',
    sellPrice: 300,
    description: 'Kış karında ortaya çıkan, efsanelere karışmış gizemli yaratık.',
    location: 'swamp',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.10
  },
  // Bataklık ekleri
  {
    id: 'mud_loach',
    name: 'Bataklık Çamur Balığı',
    season: ['spring', 'summer', 'autumn'],
    weather: ['any'],
    difficulty: 'easy',
    sellPrice: 15,
    description: 'Çamurlu suda kıvranıp duran küçük balık.',
    location: 'swamp',
    miniGameSpeed: 1.2,
    miniGameDirChange: 0.04
  },
  {
    id: 'swamp_frog',
    name: 'Kurbağa Balığı',
    season: ['summer', 'autumn'],
    weather: ['rainy'],
    difficulty: 'normal',
    sellPrice: 35,
    description: 'Yarısı kurbağayı andıran, tuhaf bir su yaratığı.',
    location: 'swamp',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.08
  },
  {
    id: 'yellow_eel',
    name: 'Sarı Yılan Balığı',
    season: ['summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 50,
    description: 'Yağmur sonrası çamur deliklerinden çıkan sarı yılan balığı.',
    location: 'swamp',
    miniGameSpeed: 2.3,
    miniGameDirChange: 0.05
  },
  {
    id: 'snapping_turtle',
    name: 'Isırgan Kaplumbağa',
    season: ['summer', 'autumn'],
    weather: ['any'],
    difficulty: 'normal',
    sellPrice: 65,
    description: 'Huysuz tabiatlı, saldırgan bir bataklık kaplumbağası.',
    location: 'swamp',
    miniGameSpeed: 1.5,
    miniGameDirChange: 0.06
  },
  {
    id: 'swamp_catfish',
    name: 'Bataklık Yayını',
    season: ['spring', 'summer'],
    weather: ['rainy', 'stormy'],
    difficulty: 'normal',
    sellPrice: 55,
    description: 'Bataklığın derin çukurunda yaşayan iri yayın balığı.',
    location: 'swamp',
    miniGameSpeed: 1.8,
    miniGameDirChange: 0.04
  },
  {
    id: 'miasma_fish',
    name: 'Sis Balığı',
    season: ['autumn', 'winter'],
    weather: ['rainy', 'windy'],
    difficulty: 'hard',
    sellPrice: 110,
    description: 'Ağır bataklık buharı içinde dolaşan tekinsiz balık.',
    location: 'swamp',
    miniGameSpeed: 2.5,
    miniGameDirChange: 0.09
  },
  {
    id: 'ancient_newt',
    name: 'Kadim Semender',
    season: ['spring', 'winter'],
    weather: ['snowy', 'rainy'],
    difficulty: 'hard',
    sellPrice: 160,
    description: 'Söylenceye göre çok eski çağlardan beri bu bataklıkta yaşayan semender.',
    location: 'swamp',
    miniGameSpeed: 2.0,
    miniGameDirChange: 0.08
  }
]

/** Kimliğe göre balığı getirir */
export const getFishById = (id: string): FishDef | undefined => {
  return FISH.find(f => f.id === id)
}

/** Mevcut mevsim, hava ve bölgeye göre tutulabilecek balıkları getirir */
export const getAvailableFish = (season: string, weather: string, location?: FishingLocation): FishDef[] => {
  return FISH.filter(f => {
    const seasonMatch = f.season.includes(season as any)
    const weatherMatch = f.weather.includes('any') || f.weather.includes(weather as any)
    const locationMatch = !location || (f.location ?? 'creek') === location
    return seasonMatch && weatherMatch && locationMatch
  })
    }
