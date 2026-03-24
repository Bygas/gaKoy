import type { RingDef } from '@/types'

/** Tüm yüzük tanımları */
export const RINGS: RingDef[] = [
  // ===== Kademe 1: Bakır / Kuvars (erken dönem, 1-20. katlar) =====
  {
    id: 'jade_guard_ring',
    name: 'Yeşim Koruyucu Halka',
    description: 'Yeşim taşlı bir bakır halka; alınan hasarı azaltır.',
    effects: [{ type: 'defense_bonus', value: 0.08 }],
    recipe: [
      { itemId: 'copper_bar', quantity: 2 },
      { itemId: 'jade', quantity: 1 }
    ],
    recipeMoney: 200,
    obtainSource: 'Dövüm',
    sellPrice: 150
  },
  {
    id: 'quartz_ring',
    name: 'Kuvars Aydın Yüzüğü',
    description: 'Billur gibi parlayan bir kuvars yüzük; saldırı gücünü artırır.',
    effects: [{ type: 'attack_bonus', value: 3 }],
    recipe: [
      { itemId: 'copper_bar', quantity: 2 },
      { itemId: 'quartz', quantity: 2 }
    ],
    recipeMoney: 200,
    obtainSource: 'Dövüm',
    sellPrice: 120
  },
  {
    id: 'farmers_ring',
    name: 'Ekinci Halkası',
    description: 'Tarla işi sırasında harcanan kuvveti azaltır.',
    effects: [{ type: 'farming_stamina', value: 0.1 }],
    recipe: [
      { itemId: 'copper_bar', quantity: 3 },
      { itemId: 'quartz', quantity: 1 }
    ],
    recipeMoney: 250,
    obtainSource: 'Dövüm',
    sellPrice: 180
  },

  // ===== Kademe 2: Demir / Yeşim (orta-ön dönem, 21-40. katlar) =====
  {
    id: 'jade_spirit_ring',
    name: 'Yeşim Ruh Yüzüğü',
    description: 'Yeşimdeki diri kudret kritik vuruş olasılığını artırır.',
    effects: [{ type: 'crit_rate_bonus', value: 0.06 }],
    recipe: [
      { itemId: 'iron_bar', quantity: 2 },
      { itemId: 'jade', quantity: 2 }
    ],
    recipeMoney: 500,
    obtainSource: 'Dövüm',
    sellPrice: 300
  },
  {
    id: 'anglers_ring',
    name: 'Balıkçı Yüzüğü',
    description: 'Balık tutarken balıkları sakinleştirir, kuvvet tüketimini azaltır.',
    effects: [
      { type: 'fishing_calm', value: 0.08 },
      { type: 'fishing_stamina', value: 0.1 }
    ],
    recipe: [
      { itemId: 'iron_bar', quantity: 2 },
      { itemId: 'jade', quantity: 1 },
      { itemId: 'quartz', quantity: 1 }
    ],
    recipeMoney: 400,
    obtainSource: 'Dövüm',
    sellPrice: 280
  },
  {
    id: 'friendship_ring',
    name: 'Gönül Bağı Yüzüğü',
    description: 'Takılınca verilen armağanlar daha çok gönül alır.',
    effects: [{ type: 'gift_friendship', value: 0.15 }],
    recipe: [
      { itemId: 'iron_bar', quantity: 2 },
      { itemId: 'jade', quantity: 2 }
    ],
    recipeMoney: 600,
    obtainSource: 'Dövüm',
    sellPrice: 350
  },

  // ===== Kademe 3: Altın / Yakut (orta dönem, 41-60. katlar) =====
  {
    id: 'ruby_flame_ring',
    name: 'Kızıl Alev Yüzüğü',
    description: 'Yakutun sıcak kudreti saldırı gücünü büyük ölçüde artırır.',
    effects: [{ type: 'attack_bonus', value: 6 }],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'ruby', quantity: 2 }
    ],
    recipeMoney: 1000,
    obtainSource: 'Dövüm',
    sellPrice: 600
  },
  {
    id: 'miners_ring',
    name: 'Madenci Altın Yüzüğü',
    description: 'Madende keşif yaparken kuvvet tüketimini büyük ölçüde azaltır, fazladan cevher toplatır.',
    effects: [
      { type: 'mining_stamina', value: 0.15 },
      { type: 'ore_bonus', value: 1 }
    ],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'ruby', quantity: 1 },
      { itemId: 'quartz', quantity: 2 }
    ],
    recipeMoney: 800,
    obtainSource: 'Dövüm',
    sellPrice: 500
  },
  {
    id: 'merchants_ring',
    name: 'Tacir Altın Yüzüğü',
    description: 'Satılan malların değerini artırır, dükkân fiyatlarını düşürür.',
    effects: [
      { type: 'sell_price_bonus', value: 0.05 },
      { type: 'shop_discount', value: 0.05 }
    ],
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'ruby', quantity: 1 }
    ],
    recipeMoney: 1200,
    obtainSource: 'Dövüm',
    sellPrice: 700
  },

  // ===== Kademe 4: Aytaşı (61-80. katlar) =====
  {
    id: 'moonlight_ring',
    name: 'Ayışıltısı Yüzüğü',
    description: 'Aytaşının yumuşak ışığı canı korur, azami yaşamı artırır.',
    effects: [{ type: 'max_hp_bonus', value: 25 }],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'moonstone', quantity: 2 }
    ],
    recipeMoney: 1500,
    obtainSource: 'Dövüm',
    sellPrice: 800
  },
  {
    id: 'harvest_moon_ring',
    name: 'Bereket Ayı Yüzüğü',
    description: 'Ay ışığı ekinleri bereketlendirir; kaliteyi ve büyüme hızını artırır.',
    effects: [
      { type: 'crop_quality_bonus', value: 0.08 },
      { type: 'crop_growth_bonus', value: 0.08 }
    ],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'moonstone', quantity: 2 },
      { itemId: 'jade', quantity: 1 }
    ],
    recipeMoney: 1500,
    obtainSource: 'Dövüm',
    sellPrice: 900
  },
  {
    id: 'exp_ring',
    name: 'İdrak Yüzüğü',
    description: 'Kazanılan bütün tecrübeyi artırır.',
    effects: [{ type: 'exp_bonus', value: 0.1 }],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'moonstone', quantity: 1 },
      { itemId: 'ruby', quantity: 1 }
    ],
    recipeMoney: 1200,
    obtainSource: 'Dövüm',
    sellPrice: 750
  },

  // ===== Kademe 5: Obsidyen (81-100. katlar) =====
  {
    id: 'shadow_ring',
    name: 'Gölge Yüzüğü',
    description: 'Gölgenin kudreti can emer; saldırırken yaşam geri kazandırır.',
    effects: [{ type: 'vampiric', value: 0.1 }],
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'obsidian', quantity: 2 }
    ],
    recipeMoney: 2000,
    obtainSource: 'Dövüm',
    sellPrice: 1200
  },
  {
    id: 'treasure_hunter_ring',
    name: 'Hazine Arayıcı Yüzüğü',
    description: 'Madende sandıkların daha sık çıkmasını sağlar; balıkta sandık bulma ihtimalini de artırır.',
    effects: [{ type: 'treasure_find', value: 0.1 }],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'obsidian', quantity: 1 },
      { itemId: 'moonstone', quantity: 1 }
    ],
    recipeMoney: 1800,
    obtainSource: 'Dövüm',
    sellPrice: 1000
  },
  {
    id: 'stalwart_ring',
    name: 'Sağlam Kaya Yüzüğü',
    description: 'Obsidyenin sertliğiyle korur; hem hasarı azaltır hem azami yaşamı artırır.',
    effects: [
      { type: 'defense_bonus', value: 0.12 },
      { type: 'max_hp_bonus', value: 15 }
    ],
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'obsidian', quantity: 2 }
    ],
    recipeMoney: 2500,
    obtainSource: 'Dövüm',
    sellPrice: 1400
  },

  // ===== Kademe 6: Ejder Yeşimi / İridyum (101-120. katlar, son dönem) =====
  {
    id: 'dragon_ring',
    name: 'Ejder Damarı Yüzüğü',
    description: 'Ejder yeşimindeki kadim kudret, tüm kuvvet kullanımını daha verimli kılar.',
    effects: [{ type: 'stamina_reduction', value: 0.12 }],
    recipe: [
      { itemId: 'iridium_bar', quantity: 2 },
      { itemId: 'dragon_jade', quantity: 2 }
    ],
    recipeMoney: 5000,
    obtainSource: 'Dövüm',
    sellPrice: 2500
  },
  {
    id: 'fortune_ring',
    name: 'Kut Yüzüğü',
    description: 'Ejder yeşimindeki gök ve yer nefesi, genel talihi artırır.',
    effects: [{ type: 'luck', value: 0.08 }],
    recipe: [
      { itemId: 'iridium_bar', quantity: 2 },
      { itemId: 'dragon_jade', quantity: 1 },
      { itemId: 'moonstone', quantity: 1 }
    ],
    recipeMoney: 4000,
    obtainSource: 'Dövüm',
    sellPrice: 2200
  },
  {
    id: 'warlord_ring',
    name: 'Cenk Beyi Yüzüğü',
    description: 'İridyum ile ejder yeşiminin kusursuz birleşimi; saldırıyı ve kritik vuruşu büyük ölçüde artırır.',
    effects: [
      { type: 'attack_bonus', value: 8 },
      { type: 'crit_rate_bonus', value: 0.08 }
    ],
    recipe: [
      { itemId: 'iridium_bar', quantity: 3 },
      { itemId: 'dragon_jade', quantity: 2 }
    ],
    recipeMoney: 6000,
    obtainSource: 'Dövüm',
    sellPrice: 3000
  },
  {
    id: 'prismatic_ring',
    name: 'Alaca Gök Yüzüğü',
    description: 'Alaca parçalardan dövülmüş ulu bir yüzük; her işe uğur katar.',
    effects: [
      { type: 'luck', value: 0.12 },
      { type: 'exp_bonus', value: 0.08 },
      { type: 'sell_price_bonus', value: 0.05 }
    ],
    recipe: [
      { itemId: 'iridium_bar', quantity: 2 },
      { itemId: 'prismatic_shard', quantity: 1 }
    ],
    recipeMoney: 10000,
    obtainSource: 'Dövüm (Alaca Parça gerekir)',
    sellPrice: 5000
  },

  // ===== BOSS ganimeti (dövülemez) =====
  {
    id: 'mud_golem_band',
    name: 'Balçık Kaya Kuşağı',
    description: 'Balçık Kaya Devi’nden düşen koruyucu halka; genel kuvvet tüketimini azaltır.',
    effects: [{ type: 'stamina_reduction', value: 0.06 }],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'BOSS ganimeti: Balçık Kaya Devi (20. kat)',
    sellPrice: 300
  },
  {
    id: 'frost_queen_circlet',
    name: 'Ayaz Kraliçesi Yüzüğü',
    description: 'Ayaz Kraliçesi’nden kalan buz halka; yaratık ganimeti oranını artırır.',
    effects: [{ type: 'monster_drop_bonus', value: 0.15 }],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'BOSS ganimeti: Ayaz Kraliçesi (40. kat)',
    sellPrice: 600
  },
  {
    id: 'lava_lord_seal',
    name: 'Kor Beyi Mührü',
    description: 'Kor Beyi’nin mühür yüzüğü; saldırılara yakıcı can emiş gücü katar.',
    effects: [
      { type: 'attack_bonus', value: 5 },
      { type: 'vampiric', value: 0.08 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'BOSS ganimeti: Kor Beyi (60. kat)',
    sellPrice: 1200
  },

  // ===== Yeni dövülebilen yüzükler =====
  {
    id: 'endurance_ring',
    name: 'Dayanıklılık Yüzüğü',
    description: 'Kuvars kakmalı bakır halka; dayanma gücünü artırır.',
    effects: [{ type: 'stamina_reduction', value: 0.05 }],
    recipe: [
      { itemId: 'copper_bar', quantity: 3 },
      { itemId: 'quartz', quantity: 1 }
    ],
    recipeMoney: 200,
    obtainSource: 'Dövüm',
    sellPrice: 120
  },
  {
    id: 'fish_jade_ring',
    name: 'Balık Bereketi Yüzüğü',
    description: 'Yeşimin su nefesi, tutulan balıkların kalitesini artırır.',
    effects: [
      { type: 'fish_quality_bonus', value: 0.08 },
      { type: 'fishing_calm', value: 0.05 }
    ],
    recipe: [
      { itemId: 'iron_bar', quantity: 2 },
      { itemId: 'jade', quantity: 2 }
    ],
    recipeMoney: 500,
    obtainSource: 'Dövüm',
    sellPrice: 350
  },
  {
    id: 'growth_ring',
    name: 'Filiz Yüzüğü',
    description: 'Ay ışığı ile şifalı otların gücü canlılığı coşturur; ekinler daha hızlı olgunlaşır.',
    effects: [{ type: 'crop_growth_bonus', value: 0.12 }],
    recipe: [
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'herb', quantity: 5 },
      { itemId: 'moonstone', quantity: 1 }
    ],
    recipeMoney: 1200,
    obtainSource: 'Dövüm',
    sellPrice: 750
  },
  {
    id: 'travel_ring',
    name: 'Yol Yüzüğü',
    description: 'Tavşan ayağı ile altının birleşimi hafif adım verir; yolu daha çabuk aldırır.',
    effects: [
      { type: 'travel_speed', value: 0.15 },
      { type: 'stamina_reduction', value: 0.05 }
    ],
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'rabbit_foot', quantity: 1 }
    ],
    recipeMoney: 2000,
    obtainSource: 'Dövüm',
    sellPrice: 1100
  },

  // ===== Yeni BOSS ganimetleri =====
  {
    id: 'crystal_king_seal',
    name: 'Kristal Han Mührü',
    description: 'Kristal Han parçalanınca geriye kalan mühür halka; irfan kudreti taşır.',
    effects: [
      { type: 'exp_bonus', value: 0.12 },
      { type: 'luck', value: 0.06 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'BOSS ganimeti: Kristal Han (80. kat)',
    sellPrice: 1800
  },
  {
    id: 'shadow_sovereign_ring',
    name: 'Gölge Hükümdarı Yüzüğü',
    description: 'Gölge Hükümdarı’nın ruhundan billurlaşmış yüzük; kritik darbeyi ölümcül kılar ve can emer.',
    effects: [
      { type: 'crit_rate_bonus', value: 0.1 },
      { type: 'vampiric', value: 0.06 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'BOSS ganimeti: Gölge Hükümdarı (100. kat)',
    sellPrice: 2500
  },
  {
    id: 'abyss_dragon_ring',
    name: 'Ejder Hanı Yüzüğü',
    description: 'Uçurum Ejder Hanı’nın ters pulundan doğmuş ulu yüzük; hem vurur hem korur.',
    effects: [
      { type: 'attack_bonus', value: 10 },
      { type: 'defense_bonus', value: 0.1 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'BOSS ganimeti: Uçurum Ejder Hanı (120. kat)',
    sellPrice: 4000
  },

  // ===== Yeni yaratık ganimetleri =====
  {
    id: 'shallow_guard',
    name: 'Sığ Maden Halkası',
    description: 'Sığ maden katındaki taş yengeç kabuğundan yapılmış basit bir koruma halkası.',
    effects: [{ type: 'defense_bonus', value: 0.05 }],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Sığ maden katı yaratık ganimeti',
    sellPrice: 80
  },
  {
    id: 'crystal_prism_band',
    name: 'Kristal Prizma Kuşağı',
    description: 'Kristal katı yaratıklarında oluşan prizma halka; uğur taşır.',
    effects: [
      { type: 'luck', value: 0.05 },
      { type: 'ore_bonus', value: 1 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kristal katı yaratık ganimeti',
    sellPrice: 900
  },

  // ===== Yeni sandık ganimetleri =====
  {
    id: 'ancient_jade_ring',
    name: 'Kadim Yeşim Yüzüğü',
    description: 'Sandıkta uyuyan eski bir yeşim yüzük; kazanç bereketi getirir.',
    effects: [
      { type: 'sell_price_bonus', value: 0.06 },
      { type: 'shop_discount', value: 0.04 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Maden sandığı',
    sellPrice: 600
  },

  // === Lonca'ya özel ===
  {
    id: 'guild_war_ring',
    name: 'Lonca Savaş Yüzüğü',
    description: 'Serüvenciler Loncası’nın seçkin üyelerine verilen savaş yüzüğü; loncanın kudretini taşır.',
    effects: [
      { type: 'attack_bonus', value: 4 },
      { type: 'defense_bonus', value: 0.06 }
    ],
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Lonca dükkânı',
    sellPrice: 800
  }
]

/** ID ile yüzük tanımını getir */
export const getRingById = (id: string): RingDef | undefined => {
  return RINGS.find(r => r.id === id)
}

/** Dövülebilen tüm yüzükler */
export const CRAFTABLE_RINGS: RingDef[] = RINGS.filter(r => r.recipe !== null)

/** Bölgelere göre yaratıklardan düşebilen yüzükler */
export const MONSTER_DROP_RINGS: Record<string, { ringId: string; chance: number }[]> = {
  shallow: [{ ringId: 'shallow_guard', chance: 0.02 }],
  frost: [{ ringId: 'jade_guard_ring', chance: 0.02 }],
  lava: [{ ringId: 'jade_spirit_ring', chance: 0.02 }],
  crystal: [
    { ringId: 'moonlight_ring', chance: 0.02 },
    { ringId: 'crystal_prism_band', chance: 0.015 }
  ],
  shadow: [{ ringId: 'shadow_ring', chance: 0.02 }],
  abyss: [{ ringId: 'dragon_ring', chance: 0.015 }]
}

/** BOSS ilk zaferinde düşen yüzükler */
export const BOSS_DROP_RINGS: Record<number, string> = {
  20: 'mud_golem_band',
  40: 'frost_queen_circlet',
  60: 'lava_lord_seal',
  80: 'crystal_king_seal',
  100: 'shadow_sovereign_ring',
  120: 'abyss_dragon_ring'
}

/** Sandık katlarından düşebilen yüzükler (bölgeye göre) */
export const TREASURE_DROP_RINGS: Record<string, { ringId: string; chance: number }[]> = {
  shallow: [{ ringId: 'quartz_ring', chance: 0.08 }],
  frost: [{ ringId: 'farmers_ring', chance: 0.08 }],
  lava: [
    { ringId: 'anglers_ring', chance: 0.08 },
    { ringId: 'ancient_jade_ring', chance: 0.04 }
  ],
  crystal: [
    { ringId: 'exp_ring', chance: 0.06 },
    { ringId: 'ancient_jade_ring', chance: 0.035 }
  ],
  shadow: [{ ringId: 'treasure_hunter_ring', chance: 0.06 }],
  abyss: [{ ringId: 'fortune_ring', chance: 0.05 }]
        }
