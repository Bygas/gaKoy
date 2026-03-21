import type { WeaponDef, EnchantmentDef, WeaponType } from '@/types'

/** Büyü tanımları */
export const ENCHANTMENTS: Record<string, EnchantmentDef> = {
  sharp: {
    id: 'sharp',
    name: 'Keskin',
    description: 'Saldırı gücü +3',
    attackBonus: 3,
    critBonus: 0,
    special: null
  },
  fierce: {
    id: 'fierce',
    name: 'Hararetli',
    description: 'Saldırı gücü +5',
    attackBonus: 5,
    critBonus: 0,
    special: null
  },
  precise: {
    id: 'precise',
    name: 'İsabetli',
    description: 'Kritik oranı +10%',
    attackBonus: 0,
    critBonus: 0.1,
    special: null
  },
  vampiric: {
    id: 'vampiric',
    name: 'Kan Emen',
    description: 'Verilen hasarın %15 kadarını HP olarak geri verir',
    attackBonus: 0,
    critBonus: 0,
    special: 'vampiric'
  },
  sturdy: {
    id: 'sturdy',
    name: 'Metin',
    description: 'Alınan hasar -15%',
    attackBonus: 0,
    critBonus: 0,
    special: 'sturdy'
  },
  lucky: {
    id: 'lucky',
    name: 'Uğurlu',
    description: 'Canavar ganimet oranı +20%',
    attackBonus: 0,
    critBonus: 0,
    special: 'lucky'
  }
}

/** Rastgele büyü için kullanılacak ID listesi */
const RANDOM_ENCHANT_IDS = ['sharp', 'fierce', 'precise', 'vampiric', 'sturdy', 'lucky']

/** Rastgele bir büyü getirir (%30 ihtimalle tetiklenir) */
export const rollRandomEnchantment = (): string | null => {
  if (Math.random() >= 0.3) return null
  return RANDOM_ENCHANT_IDS[Math.floor(Math.random() * RANDOM_ENCHANT_IDS.length)]!
}

/** Silah türlerinin Türkçe adları */
export const WEAPON_TYPE_NAMES: Record<WeaponType, string> = {
  sword: 'Kılıç',
  dagger: 'Hançer',
  club: 'Tokmak'
}

/** Tüm silah tanımları */
export const WEAPONS: Record<string, WeaponDef> = {
  // === Dükkândan satın alınabilenler ===
  wooden_stick: {
    id: 'wooden_stick',
    name: 'Sopa',
    type: 'club',
    attack: 5,
    critRate: 0.02,
    description: 'Yerden bulunmuş bir sopa, yokluktan iyidir.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  copper_sword: {
    id: 'copper_sword',
    name: 'Bakır Kılıç',
    type: 'sword',
    attack: 12,
    critRate: 0.05,
    description: 'Bakırdan dökülmüş kısa kılıç, güvenilir bir başlangıç silahıdır.',
    shopPrice: 300,
    shopMaterials: [{ itemId: 'copper_ore', quantity: 5 }],
    fixedEnchantment: null
  },
  iron_blade: {
    id: 'iron_blade',
    name: 'Demir Bıçak',
    type: 'sword',
    attack: 18,
    critRate: 0.05,
    description: 'İşlenmiş demirden uzun bıçak, keskin ve sağlamdır.',
    shopPrice: 800,
    shopMaterials: [{ itemId: 'iron_ore', quantity: 5 }],
    fixedEnchantment: null
  },
  war_hammer: {
    id: 'war_hammer',
    name: 'Savaş Çekici',
    type: 'club',
    attack: 22,
    critRate: 0.03,
    description: 'Ağır bir demir çekici, tek vuruşta taşı çatlatır.',
    shopPrice: 1200,
    shopMaterials: [{ itemId: 'iron_ore', quantity: 8 }],
    fixedEnchantment: null
  },
  gold_halberd: {
    id: 'gold_halberd',
    name: 'Altın Mızrak',
    type: 'sword',
    attack: 28,
    critRate: 0.08,
    description: 'Altın parıltılı uzun bir mızrak, kudreti sıradışı.',
    shopPrice: 2500,
    shopMaterials: [{ itemId: 'gold_ore', quantity: 8 }],
    fixedEnchantment: null
  },
  // === Canavar ganimetleri ===
  bone_dagger: {
    id: 'bone_dagger',
    name: 'Kemik Hançer',
    type: 'dagger',
    attack: 9,
    critRate: 0.15,
    description: 'Canavar kemiğinden yontulmuş hançer, son derece keskindir.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  frost_dagger: {
    id: 'frost_dagger',
    name: 'Ayaz Hançeri',
    type: 'dagger',
    attack: 16,
    critRate: 0.18,
    description: 'Soğuktan donmuş bir hançer, dokunanın içini ürpertir.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  shadow_blade: {
    id: 'shadow_blade',
    name: 'Gölge Kılıcı',
    type: 'dagger',
    attack: 24,
    critRate: 0.22,
    description: 'Gölgelerden örülmüş bıçak, görünmeden can alır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  // === BOSS ganimetleri (sabit büyülü) ===
  mud_king_fang: {
    id: 'mud_king_fang',
    name: 'Çamur Hanı Dişi',
    type: 'sword',
    attack: 20,
    critRate: 0.12,
    description: 'Çamur kayası yaratığının dişinden dövülmüştür, can emici bir silahtır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: 'vampiric'
  },
  frost_queen_sting: {
    id: 'frost_queen_sting',
    name: 'Ayaz Dikeni',
    type: 'dagger',
    attack: 19,
    critRate: 0.25,
    description: 'Ayaz Kraliçesi’nden kalan sivri diken, şaşmaz isabet taşır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: 'precise'
  },
  lava_lord_maul: {
    id: 'lava_lord_maul',
    name: 'Kor Çekici',
    type: 'club',
    attack: 38,
    critRate: 0.08,
    description: 'Lav Beyi’nin asası, ateş gibi harlıdır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: 'fierce'
  },
  // === Yeni bölge canavar ganimetleri ===
  crystal_shard_dagger: {
    id: 'crystal_shard_dagger',
    name: 'Kristal Diken Hançer',
    type: 'dagger',
    attack: 30,
    critRate: 0.2,
    description: 'Kristal kırıklarından örülmüş keskin bir hançer.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  shadow_katana: {
    id: 'shadow_katana',
    name: 'Gölge Katanası',
    type: 'sword',
    attack: 35,
    critRate: 0.1,
    description: 'Gölge yarığından doğmuş katana, aydınlığı ikiye böler.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  void_hammer: {
    id: 'void_hammer',
    name: 'Boşluk Çekici',
    type: 'club',
    attack: 48,
    critRate: 0.05,
    description: 'Derin uçurum gücüyle dolu çekic, bin batman ağırlık taşır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  // === Yeni bölge dükkân silahları ===
  crystal_blade: {
    id: 'crystal_blade',
    name: 'Kristal Uzun Kılıç',
    type: 'sword',
    attack: 35,
    critRate: 0.08,
    description: 'Kristal cevherden dövülmüş uzun kılıç, yedi renk ışık saçar.',
    shopPrice: 5000,
    shopMaterials: [{ itemId: 'crystal_ore', quantity: 8 }],
    fixedEnchantment: null
  },
  shadow_mace: {
    id: 'shadow_mace',
    name: 'Gölge Tokmağı',
    type: 'club',
    attack: 42,
    critRate: 0.05,
    description: 'Gölge cevherinden dövülmüş ağır tokmak, düşmanı tek darbede yıkar.',
    shopPrice: 8000,
    shopMaterials: [{ itemId: 'shadow_ore', quantity: 8 }],
    fixedEnchantment: null
  },
  void_katana: {
    id: 'void_katana',
    name: 'Boşluk Katanası',
    type: 'sword',
    attack: 52,
    critRate: 0.1,
    description: 'Boşluk cevheriyle su verilmiş üstün katana, göğü yarar yeri böler.',
    shopPrice: 15000,
    shopMaterials: [{ itemId: 'void_ore', quantity: 10 }],
    fixedEnchantment: null
  },
  // === Yeni bölge BOSS ganimetleri (sabit büyülü) ===
  crystal_king_blade: {
    id: 'crystal_king_blade',
    name: 'Kristal Hanı Kutsal Kılıcı',
    type: 'sword',
    attack: 45,
    critRate: 0.15,
    description: 'Kristal Hanı’ndan kalan kutsal kılıç, uğur ışığıyla çevrilidir.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: 'lucky'
  },
  shadow_sovereign_fang: {
    id: 'shadow_sovereign_fang',
    name: 'Gölge Dişi',
    type: 'dagger',
    attack: 38,
    critRate: 0.3,
    description: 'Gölge Hükümdarı’nın dişinden yapılmıştır, kana susamıştır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: 'vampiric'
  },
  abyss_dragon_mace: {
    id: 'abyss_dragon_mace',
    name: 'Ejder Han Asası',
    type: 'club',
    attack: 60,
    critRate: 0.12,
    description: 'Uçurum Ejder Hanı’nın asası, her şeyi kavurur.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: 'fierce'
  },

  // === Yeni dükkân silahları ===
  bamboo_staff: {
    id: 'bamboo_staff',
    name: 'Bambu Asa',
    type: 'club',
    attack: 10,
    critRate: 0.03,
    description: 'Sert bambudan yontulmuş uzun asa, hafif ve kullanışlıdır.',
    shopPrice: 400,
    shopMaterials: [{ itemId: 'bamboo', quantity: 5 }],
    fixedEnchantment: null
  },
  iron_dagger: {
    id: 'iron_dagger',
    name: 'Demir Hançer',
    type: 'dagger',
    attack: 14,
    critRate: 0.15,
    description: 'İşlenmiş demirden kısa hançer, çok hızlı savrulur.',
    shopPrice: 600,
    shopMaterials: [{ itemId: 'iron_ore', quantity: 3 }],
    fixedEnchantment: null
  },
  golden_fan: {
    id: 'golden_fan',
    name: 'Altın Yelpaze',
    type: 'sword',
    attack: 26,
    critRate: 0.1,
    description: 'Altın kakmalı demir iskeletli yelpaze, açılınca bıçak, kapanınca sopa olur.',
    shopPrice: 2000,
    shopMaterials: [{ itemId: 'gold_ore', quantity: 5 }],
    fixedEnchantment: null
  },
  obsidian_blade: {
    id: 'obsidian_blade',
    name: 'Obsidyen Bıçak',
    type: 'sword',
    attack: 38,
    critRate: 0.08,
    description: 'Obsidyenden dövülmüş eğri kılıç, demiri çamur gibi keser.',
    shopPrice: 4000,
    shopMaterials: [{ itemId: 'shadow_ore', quantity: 5 }],
    fixedEnchantment: null
  },

  // === Yeni canavar ganimeti silahlar ===
  slime_mace: {
    id: 'slime_mace',
    name: 'Cıvık Tokmak',
    type: 'club',
    attack: 7,
    critRate: 0.02,
    description: 'Katılaşmış cıvık çekirdeği, beklenmedik kadar ağırdır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  magma_blade: {
    id: 'magma_blade',
    name: 'Kor Bıçağı',
    type: 'sword',
    attack: 21,
    critRate: 0.08,
    description: 'Magmadan donmuş kısa bıçak, hâlâ sıcaklık saçar.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  prism_dagger: {
    id: 'prism_dagger',
    name: 'Prizma Hançeri',
    type: 'dagger',
    attack: 28,
    critRate: 0.22,
    description: 'Kristal parçaların doğal biçimiyle oluşmuş keskin bir hançerdir.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  void_fang_dagger: {
    id: 'void_fang_dagger',
    name: 'Boşluk Dişi',
    type: 'dagger',
    attack: 42,
    critRate: 0.25,
    description: 'Uçurum yılanının zehirli dişi, çürütücü bir güç taşır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },

  // === Sandık ganimeti silahlar ===
  jade_sword: {
    id: 'jade_sword',
    name: 'Yeşim Kılıç',
    type: 'sword',
    attack: 22,
    critRate: 0.1,
    description: 'Sandıkta uyuyan eski kılıç, yeşil ışıkla döner.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },
  ancient_blade: {
    id: 'ancient_blade',
    name: 'Kadim Tanrı Kılıcı',
    type: 'sword',
    attack: 50,
    critRate: 0.15,
    description: 'Uzak çağlardan kalma gizemli uzun kılıç, kudretinden bir şey yitirmemiştir.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  },

  // === Loncaya özgü ===
  guild_war_blade: {
    id: 'guild_war_blade',
    name: 'Lonca Savaş Kılıcı',
    type: 'sword',
    attack: 36,
    critRate: 0.1,
    description: 'Serüvenciler loncasının seçkin üyeleri için dövülmüş kılıç, gövdesinde lonca damgası taşır.',
    shopPrice: null,
    shopMaterials: [],
    fixedEnchantment: null
  }
}
export const SHOP_WEAPONS: WeaponDef[] = Object.values(WEAPONS).filter(w => w.shopPrice !== null)

/** Bölgelere göre canavarların düşürebileceği silah ID’leri */
export const MONSTER_DROP_WEAPONS: Record<string, { weaponId: string; chance: number }[]> = {
  shallow: [
    { weaponId: 'bone_dagger', chance: 0.05 },
    { weaponId: 'slime_mace', chance: 0.03 }
  ],
  frost: [{ weaponId: 'frost_dagger', chance: 0.05 }],
  lava: [
    { weaponId: 'shadow_blade', chance: 0.05 },
    { weaponId: 'magma_blade', chance: 0.04 }
  ],
  crystal: [
    { weaponId: 'crystal_shard_dagger', chance: 0.05 },
    { weaponId: 'prism_dagger', chance: 0.04 }
  ],
  shadow: [{ weaponId: 'shadow_katana', chance: 0.05 }],
  abyss: [
    { weaponId: 'void_hammer', chance: 0.05 },
    { weaponId: 'void_fang_dagger', chance: 0.03 }
  ]
}

/** BOSS silah ganimeti eşlemesi */
export const BOSS_DROP_WEAPONS: Record<number, string> = {
  20: 'mud_king_fang',
  40: 'frost_queen_sting',
  60: 'lava_lord_maul',
  80: 'crystal_king_blade',
  100: 'shadow_sovereign_fang',
  120: 'abyss_dragon_mace'
}

/** ID ile silah tanımını getir */
export const getWeaponById = (id: string): WeaponDef | undefined => {
  return WEAPONS[id]
}

/** ID ile büyü tanımını getir */
export const getEnchantmentById = (id: string): EnchantmentDef | undefined => {
  return ENCHANTMENTS[id]
}

/** Silah satış fiyatını hesapla */
export const getWeaponSellPrice = (defId: string, enchantmentId: string | null): number => {
  const def = WEAPONS[defId]
  if (!def) return 0
  const base = def.shopPrice ? Math.floor(def.shopPrice * 0.5) : def.attack * 15
  // Büyü varsa ek fiyat
  if (enchantmentId) {
    const enchant = ENCHANTMENTS[enchantmentId]
    if (enchant) return base + 100 + enchant.attackBonus * 20
  }
  return base
}

/** Büyülü silahın görünen adını getir */
export const getWeaponDisplayName = (defId: string, enchantmentId: string | null): string => {
  const weapon = WEAPONS[defId]
  if (!weapon) return defId
  if (!enchantmentId) return weapon.name
  const enchant = ENCHANTMENTS[enchantmentId]
  if (!enchant) return weapon.name
  return `${enchant.name} ${weapon.name}`
}

/** Sandıktan düşen silahlar (maden bölgesine göre) */
export const TREASURE_DROP_WEAPONS: Record<string, { weaponId: string; chance: number }[]> = {
  shallow: [],
  frost: [{ weaponId: 'jade_sword', chance: 0.05 }],
  lava: [{ weaponId: 'jade_sword', chance: 0.04 }],
  crystal: [],
  shadow: [{ weaponId: 'ancient_blade', chance: 0.03 }],
  abyss: [{ weaponId: 'ancient_blade', chance: 0.025 }]
}
