import type { ShoeDef } from '@/types'

/** Tüm ayakkabı tanımları */
export const SHOES: ShoeDef[] = [
  // ===== Kademe 1: Temel ayakkabılar (Kumaş Konağı'ndan alınır) =====
  {
    id: 'straw_sandals',
    name: 'Hasır Çarık',
    description: 'Sade bir hasır çarık; kuvvet tüketimini azaltır.',
    effects: [{ type: 'stamina_reduction', value: 0.05 }],
    shopPrice: 200,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 80
  },
  {
    id: 'cloth_shoes',
    name: 'Bez Ayakkabı',
    description: 'Rahat bir bez ayakkabı; tarlada işi kolaylaştırır.',
    effects: [{ type: 'farming_stamina', value: 0.08 }],
    shopPrice: 300,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 120
  },

  // ===== Kademe 2: Orta sınıf ayakkabılar (Kumaş Konağı'ndan alınır) =====
  {
    id: 'leather_boots',
    name: 'Deri Çizme',
    description: 'Sağlam bir deri çizme; yürüyüşü hızlandırır.',
    effects: [{ type: 'travel_speed', value: 0.15 }],
    shopPrice: 800,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 320
  },
  {
    id: 'miner_boots',
    name: 'Madenci Çizmesi',
    description: 'Kalın tabanlı, demir burunlu çizme; maden ocağında keşfi daha güvenli kılar.',
    effects: [
      { type: 'mining_stamina', value: 0.1 },
      { type: 'defense_bonus', value: 0.05 }
    ],
    shopPrice: 1000,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 400
  },

  // ===== Kademe 3: Yüksek sınıf ayakkabılar (Demirci Ocağı'nda dövülür) =====
  {
    id: 'gale_boots',
    name: 'Yel Çizmesi',
    description: 'Rüzgâr gibi hafif bir çizme; yolculuk süresini büyük ölçüde kısaltır.',
    effects: [
      { type: 'travel_speed', value: 0.25 },
      { type: 'stamina_reduction', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'iron_bar', quantity: 5 },
      { itemId: 'rabbit_foot', quantity: 1 }
    ],
    recipeMoney: 2000,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 1000
  },
  {
    id: 'iron_greaves',
    name: 'Demir Baldırlık',
    description: 'Ağır demir koruyucular; savunması pek yüksektir.',
    effects: [
      { type: 'defense_bonus', value: 0.12 },
      { type: 'max_hp_bonus', value: 10 }
    ],
    shopPrice: null,
    recipe: [{ itemId: 'iron_bar', quantity: 8 }],
    recipeMoney: 1500,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 750
  },
  {
    id: 'silk_slippers',
    name: 'İpek İşlemeli Pabuç',
    description: 'Zarif bir ipek pabuç; kırda gezinirken ve ot toplarken adımları hafifletir.',
    effects: [
      { type: 'farming_stamina', value: 0.08 },
      { type: 'crop_quality_bonus', value: 0.04 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'silk_cloth', quantity: 3 },
      { itemId: 'herb', quantity: 5 }
    ],
    recipeMoney: 800,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 400
  },
  {
    id: 'merchant_boots',
    name: 'Tacir Çizmesi',
    description: 'Gezgin tüccarların giydiği çizme; hem hızlı yürütür hem alışverişte indirim sağlar.',
    effects: [
      { type: 'travel_speed', value: 0.18 },
      { type: 'shop_discount', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 2500,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 1200
  },

  // ===== Kademe 4: Ulu sınıf ayakkabılar (Demirci Ocağı'nda dövülür) =====
  {
    id: 'moon_step_boots',
    name: 'Ayadım Çizmesi',
    description: 'Aytaşıyla bezeli çevik çizme; giyene uçuyormuşçasına hız verir.',
    effects: [
      { type: 'travel_speed', value: 0.3 },
      { type: 'luck', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'moonstone', quantity: 2 }
    ],
    recipeMoney: 4000,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 2000
  },
  {
    id: 'dragon_scale_boots',
    name: 'Ejder Pullu Çizme',
    description: 'Ejder pulundan yapılmış savaş çizmesi; yürüyüşü hızlandırır, hem saldırı hem savunma sağlar.',
    effects: [
      { type: 'defense_bonus', value: 0.1 },
      { type: 'attack_bonus', value: 3 },
      { type: 'travel_speed', value: 0.2 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'iridium_bar', quantity: 3 },
      { itemId: 'dragon_jade', quantity: 1 }
    ],
    recipeMoney: 8000,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 4000
  },

  // ===== Yaratık ganimeti =====
  {
    id: 'frost_treads',
    name: 'Kırağı Çizmesi',
    description: 'Ayaz katı yaratıklarının bıraktığı donuk baldırlık; giyene sağlam adım kazandırır.',
    effects: [
      { type: 'travel_speed', value: 0.08 },
      { type: 'defense_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Ayaz katı yaratık ganimeti',
    sellPrice: 150
  },
  {
    id: 'shadow_striders',
    name: 'Gölgeyürür',
    description: 'Gölge katı yaratıklarının karanlık kudretinden yoğrulmuştur; sessiz ve pek hızlı hareket ettirir.',
    effects: [
      { type: 'travel_speed', value: 0.18 },
      { type: 'monster_drop_bonus', value: 0.06 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Gölge katı yaratık ganimeti',
    sellPrice: 1000
  },
  {
    id: 'void_treads',
    name: 'Boşluk Savaş Çizmesi',
    description: 'Uçurum kemik ejderinin kemiklerinden dövülmüştür; içinde yıkım kudreti saklıdır.',
    effects: [
      { type: 'attack_bonus', value: 3 },
      { type: 'defense_bonus', value: 0.08 },
      { type: 'travel_speed', value: 0.15 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Uçurum katı yaratık ganimeti',
    sellPrice: 1800
  },

  // ===== BOSS ganimeti =====
  {
    id: 'lava_lord_greaves',
    name: 'Kor Zırh Çizmesi',
    description: 'Kor Beyi’nin sönmemiş hararetinden billurlaşmıştır; sert ve yakıcıdır.',
    effects: [
      { type: 'defense_bonus', value: 0.1 },
      { type: 'attack_bonus', value: 2 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '60. kat BOSS ilk zaferi',
    sellPrice: 800
  },
  {
    id: 'shadow_sovereign_treads',
    name: 'Karanlık Beyi Çizmesi',
    description: 'Gölge Hükümdarı’nın yadigârıdır; karanlık kudret ayak bileklerini sarar, adımlara rüzgâr verir.',
    effects: [
      { type: 'travel_speed', value: 0.22 },
      { type: 'defense_bonus', value: 0.08 },
      { type: 'vampiric', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '100. kat BOSS ilk zaferi',
    sellPrice: 1500
  },

  // ===== Sandık ganimeti =====
  {
    id: 'fortune_slippers',
    name: 'Kutlu Pabuç',
    description: 'Sandıktan çıkan yumuşak bir pabuç; sahibine uğur getirdiği söylenir.',
    effects: [
      { type: 'sell_price_bonus', value: 0.04 },
      { type: 'luck', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Maden ocağı sandığı',
    sellPrice: 300
  },

  // ===== Yeni dükkân ayakkabıları (Kumaş Konağı) =====
  {
    id: 'cotton_shoes',
    name: 'Pamuk Pabuç',
    description: 'Yumuşak ve sıcak tutan bir pabuç; gündelik kuvvet tüketimini azaltır.',
    effects: [
      { type: 'stamina_reduction', value: 0.04 },
      { type: 'farming_stamina', value: 0.04 }
    ],
    shopPrice: 400,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 160
  },
  {
    id: 'fishing_waders',
    name: 'Balıkçı Çizmesi',
    description: 'Su geçirmez uzun çizme; balık avını daha rahat kılar.',
    effects: [
      { type: 'fishing_stamina', value: 0.1 },
      { type: 'fishing_calm', value: 0.03 }
    ],
    shopPrice: 700,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 280
  },
  {
    id: 'jade_slippers',
    name: 'Yeşim Tabanlı Pabuç',
    description: 'Yeşim taşlı işlemeli pabuç; satış kazancını artırır ve armağan verirken gönül kazanır.',
    effects: [
      { type: 'sell_price_bonus', value: 0.04 },
      { type: 'gift_friendship', value: 0.06 }
    ],
    shopPrice: 1200,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kumaş Konağı',
    sellPrice: 480
  },

  // ===== Yeni dövme ayakkabılar (Demirci Ocağı) =====
  {
    id: 'obsidian_greaves',
    name: 'Obsidyen Zırh Çizmesi',
    description: 'Obsidyenden dövülmüş ağır bir çizme; savunması son derece yüksektir.',
    effects: [
      { type: 'defense_bonus', value: 0.15 },
      { type: 'max_hp_bonus', value: 15 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'obsidian', quantity: 2 },
      { itemId: 'iron_bar', quantity: 5 }
    ],
    recipeMoney: 3000,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 1500
  },
  {
    id: 'wind_walker',
    name: 'Yelyürür',
    description: 'Aytaşının verdiği hafiflikle yol hızını büyük ölçüde artırır.',
    effects: [
      { type: 'travel_speed', value: 0.22 },
      { type: 'stamina_reduction', value: 0.06 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'moonstone', quantity: 1 }
    ],
    recipeMoney: 2500,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 1200
  },
  {
    id: 'phoenix_boots',
    name: 'Anka Çizmesi',
    description: 'Ejder yeşimi ve altınla dövülmüş gösterişli çizme; uğur ve tecrübe bereketi sağlar.',
    effects: [
      { type: 'luck', value: 0.06 },
      { type: 'exp_bonus', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'dragon_jade', quantity: 1 }
    ],
    recipeMoney: 5000,
    obtainSource: 'Demirci Ocağı dövümü',
    sellPrice: 2500
  },

  // ===== Yeni BOSS ganimeti ayakkabılar =====
  {
    id: 'frost_queen_slippers',
    name: 'Buz Kraliçesi Pabucu',
    description: 'Ayaz Kraliçesi’nin yadigârı; giyen kimse buz üstünde dans edercesine hafif yürür.',
    effects: [
      { type: 'travel_speed', value: 0.12 },
      { type: 'fishing_calm', value: 0.06 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '40. kat BOSS ilk zaferi',
    sellPrice: 500
  },
  {
    id: 'abyss_dragon_treads',
    name: 'Ejder Hanı Çizmesi',
    description: 'Uçurum Ejder Hanı’nın pullarından dövülmüş ulu savaş çizmesi; rüzgâr gibi yürütür, hem saldırı hem savunma sağlar.',
    effects: [
      { type: 'travel_speed', value: 0.25 },
      { type: 'attack_bonus', value: 5 },
      { type: 'defense_bonus', value: 0.1 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '120. kat BOSS ilk zaferi',
    sellPrice: 5000
  },

  // ===== Yeni yaratık ganimeti ayakkabılar =====
  {
    id: 'crystal_treads',
    name: 'Kristal Maden Çizmesi',
    description: 'Kristal katı yaratıklarının parçalarından oluşmuş maden çizmesi; madencilik verimini artırır.',
    effects: [
      { type: 'ore_bonus', value: 1 },
      { type: 'mining_stamina', value: 0.06 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kristal katı yaratık ganimeti',
    sellPrice: 800
  },

  // ===== Yeni sandık ganimeti ayakkabılar =====
  {
    id: 'lucky_boots',
    name: 'Uğurlu Çizme',
    description: 'Sandıktan çıkan tuhaf bir çizme; uğur ve fazladan ganimet getirir.',
    effects: [
      { type: 'luck', value: 0.05 },
      { type: 'monster_drop_bonus', value: 0.04 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Maden ocağı sandığı',
    sellPrice: 450
  },

  // === Lonca'ya özel ===
  {
    id: 'guild_war_boots',
    name: 'Lonca Savaş Çizmesi',
    description: 'Serüvenciler Loncası’nın seçkin erlerine verilen savaş çizmesi; hafif ama dayanıklıdır.',
    effects: [
      { type: 'attack_bonus', value: 2 },
      { type: 'defense_bonus', value: 0.05 },
      { type: 'travel_speed', value: 0.1 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Lonca dükkânı',
    sellPrice: 800
  }
]

/** ID ile ayakkabı tanımını getir */
export const getShoeById = (id: string): ShoeDef | undefined => {
  return SHOES.find(s => s.id === id)
}

/** Kumaş Konağı'ndan satın alınabilen ayakkabılar */
export const SHOP_SHOES: ShoeDef[] = SHOES.filter(s => s.shopPrice !== null)

/** Demirci Ocağı'nda dövülebilen ayakkabılar */
export const CRAFTABLE_SHOES: ShoeDef[] = SHOES.filter(s => s.recipe !== null)

/** Yaratık ganimeti ayakkabılar (maden bölgesine göre) */
export const MONSTER_DROP_SHOES: Record<string, { shoeId: string; chance: number }[]> = {
  shallow: [],
  frost: [{ shoeId: 'frost_treads', chance: 0.015 }],
  lava: [],
  crystal: [{ shoeId: 'crystal_treads', chance: 0.015 }],
  shadow: [{ shoeId: 'shadow_striders', chance: 0.012 }],
  abyss: [{ shoeId: 'void_treads', chance: 0.01 }]
}

/** BOSS ilk zafer ayakkabı ganimetleri */
export const BOSS_DROP_SHOES: Record<number, string> = {
  40: 'frost_queen_slippers',
  60: 'lava_lord_greaves',
  100: 'shadow_sovereign_treads',
  120: 'abyss_dragon_treads'
}

/** Sandık ganimeti ayakkabılar (maden bölgesine göre) */
export const TREASURE_DROP_SHOES: Record<string, { shoeId: string; chance: number }[]> = {
  shallow: [{ shoeId: 'lucky_boots', chance: 0.05 }],
  frost: [{ shoeId: 'lucky_boots', chance: 0.04 }],
  lava: [],
  crystal: [{ shoeId: 'fortune_slippers', chance: 0.05 }],
  shadow: [{ shoeId: 'fortune_slippers', chance: 0.04 }],
  abyss: []
      }
