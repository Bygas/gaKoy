import type { HatDef } from '@/types'

/** Tüm şapka tanımları */
export const HATS: HatDef[] = [
  // ===== Kademe 1: Temel başlıklar (Terzi Dükkânı) =====
  {
    id: 'straw_hat',
    name: 'Saman Şapka',
    description: 'Hafif örme bir şapka; tarla işlerinde kuvvet kaybını azaltır.',
    effects: [{ type: 'farming_stamina', value: 0.08 }],
    shopPrice: 200,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 80
  },
  {
    id: 'bamboo_hat',
    name: 'Kamış Külah',
    description: 'Kamıştan örülmüş geniş başlık; güneşe ve yağmura karşı korur, kuvvet harcamasını azaltır.',
    effects: [{ type: 'stamina_reduction', value: 0.05 }],
    shopPrice: 300,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 120
  },

  // ===== Kademe 2: Orta seviye başlıklar (Terzi Dükkânı) =====
  {
    id: 'miner_helmet',
    name: 'Madenci Başlığı',
    description: 'Lamba yuvalı deri başlık; maden ocağında kuvvet tüketimini büyük ölçüde azaltır.',
    effects: [{ type: 'mining_stamina', value: 0.12 }],
    shopPrice: 800,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 320
  },
  {
    id: 'fisher_hat',
    name: 'Balıkçı Şapkası',
    description: 'Geniş kenarlı güneşlik; balık tutarken daha sakin ve dikkatli olmanı sağlar.',
    effects: [
      { type: 'fishing_stamina', value: 0.1 },
      { type: 'fishing_calm', value: 0.05 }
    ],
    shopPrice: 800,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 320
  },

  // ===== Kademe 3: Usta işi başlıklar (Demirci Ocağı) =====
  {
    id: 'iron_helm',
    name: 'Demir Miğfer',
    description: 'Sağlam bir demir miğfer; savunmayı ve can üst sınırını artırır.',
    effects: [
      { type: 'defense_bonus', value: 0.1 },
      { type: 'max_hp_bonus', value: 15 }
    ],
    shopPrice: null,
    recipe: [{ itemId: 'iron_bar', quantity: 5 }],
    recipeMoney: 1000,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 500
  },
  {
    id: 'scholar_hat',
    name: 'Bilgin Başılığı',
    description: 'Ağırbaşlı bir bilgin başlığı; tecrübe kazanımını artırır.',
    effects: [{ type: 'exp_bonus', value: 0.1 }],
    shopPrice: null,
    recipe: [{ itemId: 'silk_cloth', quantity: 2 }],
    recipeMoney: 1500,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 600
  },
  {
    id: 'herbalist_hat',
    name: 'Otacı Şapkası',
    description: 'Ot toplayanların giydiği geniş başlık; çiftçilikte kuvvet tüketimini azaltır ve ürün kalitesini artırır.',
    effects: [
      { type: 'farming_stamina', value: 0.06 },
      { type: 'crop_quality_bonus', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'herb', quantity: 10 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 800,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 400
  },
  {
    id: 'merchant_hat',
    name: 'Tüccar Şapkası',
    description: 'İnce kumaştan yapılmış yuvarlak başlık; satış fiyatını artırır, alışveriş giderini düşürür.',
    effects: [
      { type: 'sell_price_bonus', value: 0.08 },
      { type: 'shop_discount', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 3 },
      { itemId: 'silk_cloth', quantity: 2 }
    ],
    recipeMoney: 2500,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 1200
  },

  // ===== Kademe 4: En nadide başlıklar (Demirci Ocağı) =====
  {
    id: 'golden_crown',
    name: 'Altın Taç',
    description: 'Altın ışıkla parlayan bir taç; uğuru ve kazancı artırır.',
    effects: [
      { type: 'luck', value: 0.1 },
      { type: 'sell_price_bonus', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'moonstone', quantity: 1 }
    ],
    recipeMoney: 3000,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 1500
  },
  {
    id: 'dragon_helm',
    name: 'Ejder Boynuzlu Miğfer',
    description: 'Ejder taşıyla süslenmiş savaş miğferi; hücum ve savunmayı birlikte güçlendirir.',
    effects: [
      { type: 'attack_bonus', value: 5 },
      { type: 'crit_rate_bonus', value: 0.05 },
      { type: 'defense_bonus', value: 0.08 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'iridium_bar', quantity: 3 },
      { itemId: 'dragon_jade', quantity: 1 }
    ],
    recipeMoney: 8000,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 4000
  },

  // ===== Canavar ganimetleri =====
  {
    id: 'frost_hood',
    name: 'Ayaz Kukulası',
    description: 'Buz yarasalarının postundan dikilmiş başlık; üstünden soğuk bir hava yayılır.',
    effects: [
      { type: 'defense_bonus', value: 0.05 },
      { type: 'stamina_reduction', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Ayaz Katı Canavar Ganimeti',
    sellPrice: 150
  },
  {
    id: 'shadow_mask',
    name: 'Gölge Maskesi',
    description: 'Gölge yaratıklarının geride bıraktığı maske; düşmanın zayıf yanını sezmeni sağlar.',
    effects: [
      { type: 'monster_drop_bonus', value: 0.08 },
      { type: 'vampiric', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Gölge Katı Canavar Ganimeti',
    sellPrice: 1000
  },
  {
    id: 'void_visor',
    name: 'Boşluk Siperi',
    description: 'Uçurum yılanının pullarından dövülmüş yüz siperi; derinliklerin kudretini taşır.',
    effects: [
      { type: 'attack_bonus', value: 4 },
      { type: 'defense_bonus', value: 0.06 },
      { type: 'crit_rate_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Uçurum Katı Canavar Ganimeti',
    sellPrice: 1800
  },

  // ===== BOSS ganimetleri =====
  {
    id: 'golem_stone_cap',
    name: 'Taş Dev Başlığı',
    description: 'Çamur taş devinin öz parçasıyla işlenmiş ağır başlık; son derece sağlamdır.',
    effects: [
      { type: 'defense_bonus', value: 0.06 },
      { type: 'mining_stamina', value: 0.06 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '20. Kat BOSS İlk Zafer',
    sellPrice: 300
  },
  {
    id: 'crystal_king_crown',
    name: 'Billur Hükümdar Tacı',
    description: 'Billur hükümdarın kırılan tacından kalmadır; saf kristal kudreti taşır.',
    effects: [
      { type: 'exp_bonus', value: 0.08 },
      { type: 'luck', value: 0.06 },
      { type: 'crit_rate_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '80. Kat BOSS İlk Zafer',
    sellPrice: 1500
  },

  // ===== Sandık ganimetleri =====
  {
    id: 'lucky_cap',
    name: 'Uğur Başlığı',
    description: 'Maden sandığında bulunan tuhaf bir başlık; sahibine şans getirdiği söylenir.',
    effects: [
      { type: 'luck', value: 0.04 },
      { type: 'sell_price_bonus', value: 0.03 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Maden Sandığı',
    sellPrice: 250
  },

  // ===== Yeni dükkân başlıkları (Terzi Dükkânı) =====
  {
    id: 'lotus_hat',
    name: 'Nilüfer Şapkası',
    description: 'Nilüfer yapraklarından örülmüş serin bir başlık; genel kuvvet tüketimini azaltır.',
    effects: [{ type: 'stamina_reduction', value: 0.06 }],
    shopPrice: 500,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 200
  },
  {
    id: 'fur_cap',
    name: 'Kürk Başlık',
    description: 'Yumuşak posttan yapılmış başlık; özellikle maden ocağında işe yarar.',
    effects: [
      { type: 'mining_stamina', value: 0.08 },
      { type: 'defense_bonus', value: 0.03 }
    ],
    shopPrice: 600,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 240
  },
  {
    id: 'silk_turban',
    name: 'İpek Sarık',
    description: 'Gösterişli bir ipek sarık; satış gelirini artırır ve hediye dostluğunu güçlendirir.',
    effects: [
      { type: 'sell_price_bonus', value: 0.05 },
      { type: 'gift_friendship', value: 0.08 }
    ],
    shopPrice: 1000,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Terzi Dükkânı',
    sellPrice: 400
  },

  // ===== Yeni dövme başlıklar (Demirci Ocağı) =====
  {
    id: 'jade_hairpin',
    name: 'Yeşim Saç İğnesi',
    description: 'Yeşimden işlenmiş zarif saç iğnesi; tarlada çalışmayı kolaylaştırır.',
    effects: [
      { type: 'crop_quality_bonus', value: 0.06 },
      { type: 'farming_stamina', value: 0.05 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'jade', quantity: 2 },
      { itemId: 'silk_cloth', quantity: 1 }
    ],
    recipeMoney: 600,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 300
  },
  {
    id: 'obsidian_helm',
    name: 'Obsidyen Miğfer',
    description: 'Obsidyenden dövülmüş ağır bir miğfer; savunması pek yüksektir.',
    effects: [
      { type: 'defense_bonus', value: 0.12 },
      { type: 'max_hp_bonus', value: 20 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'obsidian', quantity: 2 },
      { itemId: 'iron_bar', quantity: 3 }
    ],
    recipeMoney: 3000,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 1500
  },
  {
    id: 'phoenix_crown',
    name: 'Simurg Tacı',
    description: 'Ejder taşıyla bezeli görkemli taç; uğur ve bilgelik kazandırır.',
    effects: [
      { type: 'luck', value: 0.08 },
      { type: 'exp_bonus', value: 0.1 }
    ],
    shopPrice: null,
    recipe: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'dragon_jade', quantity: 1 }
    ],
    recipeMoney: 6000,
    obtainSource: 'Demirci Ocağı',
    sellPrice: 3000
  },

  // ===== Yeni BOSS ganimet başlıkları =====
  {
    id: 'frost_queen_tiara',
    name: 'Buz Hanım Tacı',
    description: 'Ayaz kraliçesinin tacı; soğuk kudret taşır ve balıkçılıkta büyük dinginlik sağlar.',
    effects: [
      { type: 'fishing_calm', value: 0.08 },
      { type: 'fishing_stamina', value: 0.08 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '40. Kat BOSS İlk Zafer',
    sellPrice: 500
  },
  {
    id: 'abyss_dragon_horns',
    name: 'Ejder Hükümdar Boynuz Tacı',
    description: 'Uçurum ejder hükümdarının boynuzlarından yapılmış savaş tacı; yıkıcı bir güç taşır.',
    effects: [
      { type: 'attack_bonus', value: 8 },
      { type: 'defense_bonus', value: 0.1 },
      { type: 'vampiric', value: 0.05 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: '120. Kat BOSS İlk Zafer',
    sellPrice: 5000
  },

  // ===== Yeni canavar ganimeti başlıkları =====
  {
    id: 'lava_helm',
    name: 'Kor Kukulası',
    description: 'Ateş yarasasının kanat derisinden dikilmiş sıcaklık dayanımlı başlık; içinde kor gücü taşır.',
    effects: [
      { type: 'attack_bonus', value: 3 },
      { type: 'defense_bonus', value: 0.04 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Kor Katı Canavar Ganimeti',
    sellPrice: 350
  },

  // ===== Yeni sandık ganimeti başlıkları =====
  {
    id: 'treasure_cap',
    name: 'Defineci Başlığı',
    description: 'Sandıktan çıkan tuhaf bir başlık; daha çok hazine çektiği söylenir.',
    effects: [
      { type: 'treasure_find', value: 0.05 },
      { type: 'ore_bonus', value: 1 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Maden Sandığı',
    sellPrice: 400
  },

  // ===== Loncaya özgü =====
  {
    id: 'guild_war_helm',
    name: 'Lonca Harp Miğferi',
    description: 'Maceracı Loncasının seçkin savaşçılarına verilen görkemli miğfer; dayanıklı ve heybetlidir.',
    effects: [
      { type: 'attack_bonus', value: 3 },
      { type: 'max_hp_bonus', value: 15 }
    ],
    shopPrice: null,
    recipe: null,
    recipeMoney: 0,
    obtainSource: 'Lonca Dükkânı',
    sellPrice: 800
  }
]

/** Kimliğe göre şapka tanımını getirir */
export const getHatById = (id: string): HatDef | undefined => {
  return HATS.find(h => h.id === id)
}

/** Terzi Dükkânında satılan şapkalar */
export const SHOP_HATS: HatDef[] = HATS.filter(h => h.shopPrice !== null)

/** Demirci Ocağında üretilebilen şapkalar */
export const CRAFTABLE_HATS: HatDef[] = HATS.filter(h => h.recipe !== null)

/** Canavar ganimeti şapkalar (maden bölgelerine göre) */
export const MONSTER_DROP_HATS: Record<string, { hatId: string; chance: number }[]> = {
  shallow: [],
  frost: [{ hatId: 'frost_hood', chance: 0.015 }],
  lava: [{ hatId: 'lava_helm', chance: 0.015 }],
  crystal: [],
  shadow: [{ hatId: 'shadow_mask', chance: 0.012 }],
  abyss: [{ hatId: 'void_visor', chance: 0.01 }]
}

/** BOSS ilk zafer şapka ganimetleri */
export const BOSS_DROP_HATS: Record<number, string> = {
  20: 'golem_stone_cap',
  40: 'frost_queen_tiara',
  80: 'crystal_king_crown',
  120: 'abyss_dragon_horns'
}

/** Sandık ganimeti şapkalar (maden bölgelerine göre) */
export const TREASURE_DROP_HATS: Record<string, { hatId: string; chance: number }[]> = {
  shallow: [{ hatId: 'treasure_cap', chance: 0.05 }],
  frost: [{ hatId: 'treasure_cap', chance: 0.04 }],
  lava: [{ hatId: 'lucky_cap', chance: 0.05 }],
  crystal: [{ hatId: 'lucky_cap', chance: 0.04 }],
  shadow: [],
  abyss: []
    }
