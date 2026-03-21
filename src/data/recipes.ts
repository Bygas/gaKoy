import type { RecipeDef } from '@/types'

/** Tüm yemek tarifleri */
export const RECIPES: RecipeDef[] = [
  {
    id: 'stir_fried_cabbage',
    name: 'Kavrulmuş Yeşillik',
    ingredients: [{ itemId: 'cabbage', quantity: 2 }],
    effect: { staminaRestore: 15, healthRestore: 5 },
    unlockSource: 'Başlangıçta açık',
    description: 'Sade ve gündelik bir köy yemeği.'
  },
  {
    id: 'radish_soup',
    name: 'Turp Çorbası',
    ingredients: [
      { itemId: 'radish', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: { staminaRestore: 25, healthRestore: 10 },
    unlockSource: 'Hasan Enişte dostluğu «Tanışıklık»',
    description: 'Dumanı üstünde turp çorbası; içi de bedeni de ısıtır.'
  },
  {
    id: 'braised_carp',
    name: 'Sazansı Yahni',
    ingredients: [
      { itemId: 'carp', quantity: 1 },
      { itemId: 'sesame', quantity: 2 }
    ],
    effect: {
      staminaRestore: 30,
      healthRestore: 15,
      buff: { type: 'fishing', value: 1, description: 'Balıkçılık +1 (o gün)' }
    },
    unlockSource: 'Aylin dostluğu «Tanışıklık»',
    description: 'Mis gibi kokan nefis sazan yahnisi.'
  },
  {
    id: 'herbal_porridge',
    name: 'Şifalı Lapa',
    ingredients: [
      { itemId: 'herb', quantity: 2 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: { staminaRestore: 40, healthRestore: 20 },
    unlockSource: 'Hekim Dede dostluğu «Tanışıklık»',
    description: 'Bedeni toparlayan şifalı bir lapa.'
  },
  {
    id: 'osmanthus_cake',
    name: 'Osmanlı Çiçeği Keki',
    ingredients: [
      { itemId: 'osmanthus', quantity: 3 },
      { itemId: 'rice', quantity: 2 }
    ],
    effect: {
      staminaRestore: 20,
      healthRestore: 5,
      buff: { type: 'giftBonus', value: 2, description: 'Hediye dostluğu ×2 (o gün)' }
    },
    unlockSource: 'Gül Ana dostluğu «Tanışıklık»',
    description: 'İnce işlenmiş, hediye etmeye pek uygun bir tatlı.'
  },
  {
    id: 'miner_lunch',
    name: 'Madenci Azığı',
    ingredients: [
      { itemId: 'potato', quantity: 2 },
      { itemId: 'sweet_potato', quantity: 1 }
    ],
    effect: {
      staminaRestore: 25,
      healthRestore: 25,
      buff: { type: 'mining', value: 20, description: 'Madencilik kuvvet harcaması -20% (o gün)' }
    },
    unlockSource: 'Taşçı dostluğu «Tanışıklık»',
    description: 'Gerçek madenci lokması; tok tutar.'
  },
  {
    id: 'spicy_hotpot',
    name: 'Ateşli Tencere',
    ingredients: [
      { itemId: 'chili', quantity: 2 },
      { itemId: 'cabbage', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 40,
      buff: { type: 'defense', value: 20, description: 'Alınan hasar -20% (o gün)' }
    },
    unlockSource: 'Aşçılık seviyesi 4',
    requiredSkill: { type: 'farming', level: 4 },
    description: 'Yakıcı ama iç ısıtan bir tencere yemeği.'
  },
  {
    id: 'steamed_bass',
    name: 'Buğulama Levrek',
    ingredients: [
      { itemId: 'bass', quantity: 1 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'fishing', value: 2, description: 'Balıkçılık +2 (o gün)' }
    },
    unlockSource: 'Balıkçılık seviyesi 3',
    requiredSkill: { type: 'fishing', level: 3 },
    description: 'Yumuşacık pişmiş taze levrek.'
  },
  {
    id: 'honey_tea',
    name: 'Ballı Çay',
    ingredients: [
      { itemId: 'honey', quantity: 1 },
      { itemId: 'herb', quantity: 1 }
    ],
    effect: { staminaRestore: 30, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Tatlı ve yumuşak içimli bir ballı çay.'
  },
  {
    id: 'ginger_soup',
    name: 'Zencefil Çorbası',
    ingredients: [
      { itemId: 'ginger', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 20,
      healthRestore: 10,
      buff: { type: 'speed', value: 15, description: 'Hareket hızı +15% (o gün)' }
    },
    unlockSource: 'Başlangıçta açık',
    description: 'İç ısıtan, mideyi rahatlatan zencefil çorbası.'
  },
  {
    id: 'jujube_cake',
    name: 'Hünnap Keki',
    ingredients: [
      { itemId: 'jujube', quantity: 3 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: { staminaRestore: 35, healthRestore: 15 },
    unlockSource: 'Aşçılık seviyesi 2',
    requiredSkill: { type: 'farming', level: 2 },
    description: 'Tatlı, yumuşak ve hoş kokulu bir kek.'
  },
  {
    id: 'peach_blossom_cake',
    name: 'Şeftali Çiçeği Böreği',
    ingredients: [
      { itemId: 'peach', quantity: 2 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: {
      staminaRestore: 25,
      healthRestore: 10,
      buff: { type: 'giftBonus', value: 2, description: 'Hediye dostluğu ×2 (o gün)' }
    },
    unlockSource: 'Aşçılık seviyesi 3',
    requiredSkill: { type: 'farming', level: 3 },
    description: 'İlkbahara mahsus hoş kokulu bir börek.'
  },
  {
    id: 'fish_noodle',
    name: 'Balık Sulu Erişte',
    ingredients: [
      { itemId: 'crucian', quantity: 1 },
      { itemId: 'winter_wheat', quantity: 2 }
    ],
    effect: { staminaRestore: 30, healthRestore: 15 },
    unlockSource: 'Balıkçılık seviyesi 2',
    requiredSkill: { type: 'fishing', level: 2 },
    description: 'Balık suyuyla yapılmış leziz erişte.'
  },
  {
    id: 'miner_iron_pot',
    name: 'Madenci Kazanı',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'copper_ore', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 30,
      buff: { type: 'mining', value: 25, description: 'Madencilik kuvvet harcaması -25% (o gün)' }
    },
    unlockSource: 'Madencilik seviyesi 4',
    requiredSkill: { type: 'mining', level: 4 },
    description: 'Madencilerin demir kazanda pişirdiği karışık aş.'
  },
  {
    id: 'bamboo_shoot_stir_fry',
    name: 'Kış Filizi Kavurması',
    ingredients: [
      { itemId: 'winter_bamboo_shoot', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: { staminaRestore: 25, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Taze kış filiziyle yapılmış hoş kokulu bir kavurma.'
  },
  {
    id: 'dried_persimmon',
    name: 'Kuru Trabzon Hurması',
    ingredients: [{ itemId: 'persimmon', quantity: 3 }],
    effect: { staminaRestore: 20, healthRestore: 5 },
    unlockSource: 'Başlangıçta açık',
    description: 'Güneşte kurutulmuş, tatlı ve yumuşak bir atıştırmalık.'
  },
  {
    id: 'lotus_seed_soup',
    name: 'Lotus Tohumu Tatlısı',
    ingredients: [
      { itemId: 'lotus_seed', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'luck', value: 15, description: 'Şans +15% (o gün)' }
    },
    unlockSource: 'Aşçılık seviyesi 5',
    requiredSkill: { type: 'farming', level: 5 },
    description: 'Gönlü yatıştıran, hafif ve duru bir tatlı.'
  },
  {
    id: 'sesame_paste',
    name: 'Susam Ezmesi',
    ingredients: [
      { itemId: 'sesame', quantity: 3 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: { staminaRestore: 30, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Yoğun kıvamlı, mis kokulu susam ezmesi.'
  },
  {
    id: 'ginseng_soup',
    name: 'Ginseng Çorbası',
    ingredients: [
      { itemId: 'ginseng', quantity: 1 },
      { itemId: 'herb', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 30,
      buff: { type: 'farming', value: 20, description: 'Tarla kuvvet harcaması -20% (o gün)' }
    },
    unlockSource: 'Toplayıcılık seviyesi 5',
    requiredSkill: { type: 'foraging', level: 5 },
    description: 'Canı kuvvetlendiren kudret çorbası.'
  },
  {
    id: 'corn_pancake',
    name: 'Mısır Tavası',
    ingredients: [
      { itemId: 'corn', quantity: 2 },
      { itemId: 'sesame_oil', quantity: 1 }
    ],
    effect: { staminaRestore: 25, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Altın sarısı, çıtır çıtır bir mısır yemeği.'
  },
  {
    id: 'osmanthus_lotus_root',
    name: 'Çiçekli Lotus Peltesi',
    ingredients: [
      { itemId: 'osmanthus', quantity: 1 },
      { itemId: 'lotus_root', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'luck', value: 10, description: 'Şans +10% (o gün)' }
    },
    unlockSource: 'Aşçılık seviyesi 3',
    requiredSkill: { type: 'farming', level: 3 },
    description: 'Mis kokulu, hafif ve hoş bir pelte.'
  },

  // ==================== Yeni başlangıç tarifleri ====================
  {
    id: 'scrambled_egg_rice',
    name: 'Yumurtalı Pilav',
    ingredients: [
      { itemId: 'egg', quantity: 1 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: { staminaRestore: 20, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Sade ama leziz yumurtalı pilav.'
  },
  {
    id: 'stir_fried_potato',
    name: 'İnce Patates Kavurması',
    ingredients: [{ itemId: 'potato', quantity: 2 }],
    effect: { staminaRestore: 18, healthRestore: 5 },
    unlockSource: 'Başlangıçta açık',
    description: 'Ekşili, hafif acılı ve diri patates kavurması.'
  },
  {
    id: 'boiled_egg',
    name: 'Haşlanmış Yumurta',
    ingredients: [{ itemId: 'egg', quantity: 2 }],
    effect: { staminaRestore: 15, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'En sade kuvvet kaynağı.'
  },
  {
    id: 'congee',
    name: 'Ak Lapa',
    ingredients: [{ itemId: 'rice', quantity: 2 }],
    effect: { staminaRestore: 15, healthRestore: 5 },
    unlockSource: 'Başlangıçta açık',
    description: 'Mideyi rahatlatan hafif bir lapa.'
  },
  {
    id: 'rice_ball',
    name: 'Pirinç Topağı',
    ingredients: [{ itemId: 'rice', quantity: 1 }],
    effect: { staminaRestore: 12, healthRestore: 3 },
    unlockSource: 'Başlangıçta açık',
    description: 'Elle sıkılmış, taşıması kolay bir pirinç lokması.'
  },
  {
    id: 'steamed_bun',
    name: 'Buharda Çörek',
    ingredients: [{ itemId: 'wheat_flour', quantity: 1 }],
    effect: { staminaRestore: 12, healthRestore: 3 },
    unlockSource: 'Başlangıçta açık',
    description: 'Yumuşacık beyaz çörek; en sade ana yiyecek.'
  },
  {
    id: 'roasted_sweet_potato',
    name: 'Köz Tatlı Patates',
    ingredients: [{ itemId: 'sweet_potato', quantity: 2 }],
    effect: { staminaRestore: 20, healthRestore: 5 },
    unlockSource: 'Başlangıçta açık',
    description: 'Tatlı, yumuşak ve köz kokulu.'
  },
  {
    id: 'vegetable_soup',
    name: 'Köy Sebze Çorbası',
    ingredients: [
      { itemId: 'cabbage', quantity: 1 },
      { itemId: 'radish', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: { staminaRestore: 25, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Taze sebzelerle kaynatılmış duru bir çorba.'
  },
  {
    id: 'chive_egg_stir_fry',
    name: 'Frenk Soğanlı Yumurta',
    ingredients: [
      { itemId: 'chives', quantity: 2 },
      { itemId: 'egg', quantity: 1 }
    ],
    effect: { staminaRestore: 22, healthRestore: 10 },
    unlockSource: 'Başlangıçta açık',
    description: 'Frenk soğanı ile yumurtanın eski bir dostluğu.'
  },
  {
    id: 'peanut_candy',
    name: 'Fıstık Şekeri',
    ingredients: [
      { itemId: 'peanut', quantity: 3 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: { staminaRestore: 18, healthRestore: 5 },
    unlockSource: 'Başlangıçta açık',
    description: 'Çıtır ve tatlı bir köy şekeri.'
  },

  // ==================== NPC dostluk tarifleri — Tanışıklık ====================
  {
    id: 'sweet_osmanthus_tea',
    name: 'Tatlı Çiçek Çayı',
    ingredients: [
      { itemId: 'osmanthus', quantity: 1 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 20,
      healthRestore: 5,
      buff: { type: 'luck', value: 10, description: 'Şans +10% (o gün)' }
    },
    unlockSource: 'Küçük Ay dostluğu «Tanışıklık»',
    description: 'Mis kokulu, tatlı bir çiçek çayı.'
  },

  // ==================== NPC dostluk tarifleri — Yakınlık ====================
  {
    id: 'aged_radish_stew',
    name: 'Usul Turp Yahnisi',
    ingredients: [
      { itemId: 'radish', quantity: 3 },
      { itemId: 'firewood', quantity: 2 }
    ],
    effect: { staminaRestore: 40, healthRestore: 25 },
    unlockSource: 'Hasan Enişte dostluğu «Yakınlık»',
    description: 'Hasan Enişte’nin gizli usulle pişirdiği turp yahnisi.'
  },
  {
    id: 'maple_grilled_fish',
    name: 'Akçaağaçta Balık Kebabı',
    ingredients: [
      { itemId: 'mandarin_fish', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 20,
      buff: { type: 'fishing', value: 2, description: 'Balıkçılık +2 (o gün)' }
    },
    unlockSource: 'Aylin dostluğu «Yakınlık»',
    description: 'Aylin’in kendi bulduğu usulle pişirdiği balık.'
  },
  {
    id: 'herbal_pill',
    name: 'Yüzot Macunu',
    ingredients: [
      { itemId: 'herb', quantity: 3 },
      { itemId: 'ginseng', quantity: 1 }
    ],
    effect: { staminaRestore: 60, healthRestore: 30 },
    unlockSource: 'Hekim Dede dostluğu «Yakınlık»',
    description: 'Hekim Dede’nin hazırladığı kuvvet verici ilaç.'
  },
  {
    id: 'embroidered_cake',
    name: 'Nakış Keki',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'osmanthus', quantity: 2 }
    ],
    effect: {
      staminaRestore: 30,
      healthRestore: 15,
      buff: { type: 'giftBonus', value: 2, description: 'Hediye dostluğu ×2 (o gün)' }
    },
    unlockSource: 'Gül Ana dostluğu «Yakınlık»',
    description: 'Gül Ana’nın özenle yaptığı ince bir tatlı.'
  },
  {
    id: 'deep_mine_stew',
    name: 'Derin Maden Güveci',
    ingredients: [
      { itemId: 'potato', quantity: 2 },
      { itemId: 'copper_ore', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 35,
      buff: { type: 'mining', value: 30, description: 'Madencilik kuvvet harcaması -30% (o gün)' }
    },
    unlockSource: 'Taşçı dostluğu «Yakınlık»',
    description: 'Taşçı’nın madenin dibinde bulduğu bir tencere yemeği.'
  },
  {
    id: 'wild_berry_jam',
    name: 'Yaban Yemişi Reçeli',
    ingredients: [
      { itemId: 'wild_berry', quantity: 3 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 25,
      healthRestore: 10,
      buff: { type: 'speed', value: 20, description: 'Hareket hızı +20% (o gün)' }
    },
    unlockSource: 'Küçük Ay dostluğu «Yakınlık»',
    description: 'Orman yemişlerinden yapılmış hoş bir reçel.'
  },

  // ==================== NPC dostluk tarifleri — Can Yoldaşı ====================
  {
    id: 'farmers_feast',
    name: 'Köylü Sofrası',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'cabbage', quantity: 2 },
      { itemId: 'egg', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 40,
      buff: { type: 'farming', value: 25, description: 'Tarla kuvvet harcaması -25% (o gün)' }
    },
    unlockSource: 'Hasan Enişte dostluğu «Can Yoldaşı»',
    description: 'Hasan Enişte’nin sandığından çıkan büyük köy yemeği.'
  },
  {
    id: 'autumn_moon_feast',
    name: 'Aylin Sofrası',
    ingredients: [
      { itemId: 'mandarin_fish', quantity: 1 },
      { itemId: 'river_crab', quantity: 1 },
      { itemId: 'osmanthus', quantity: 2 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 30,
      buff: { type: 'luck', value: 20, description: 'Şans +20% (o gün)' }
    },
    unlockSource: 'Aylin dostluğu «Can Yoldaşı»',
    description: 'Aylin’in gönül dostları için kurduğu sonbahar sofrası.'
  },
  {
    id: 'longevity_soup',
    name: 'Ömür Çorbası',
    ingredients: [
      { itemId: 'ginseng', quantity: 2 },
      { itemId: 'herb', quantity: 3 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: { staminaRestore: 80, healthRestore: 40 },
    unlockSource: 'Hekim Dede dostluğu «Can Yoldaşı»',
    description: 'Hekim Dede’nin ömrünü adadığı şifa tarifi.'
  },
  {
    id: 'lovers_pastry',
    name: 'Yâren Çöreği',
    ingredients: [
      { itemId: 'peach', quantity: 2 },
      { itemId: 'rice', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 20,
      buff: { type: 'giftBonus', value: 3, description: 'Hediye dostluğu ×3 (o gün)' }
    },
    unlockSource: 'Gül Ana dostluğu «Can Yoldaşı»',
    description: 'Sevdikler için yapılan zarif bir çörek.'
  },
  {
    id: 'forgemasters_meal',
    name: 'Dövümcü Yemeği',
    ingredients: [
      { itemId: 'iron_ore', quantity: 2 },
      { itemId: 'potato', quantity: 3 },
      { itemId: 'firewood', quantity: 2 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 50,
      buff: { type: 'defense', value: 25, description: 'Alınan hasar -25% (o gün)' }
    },
    unlockSource: 'Taşçı dostluğu «Can Yoldaşı»',
    description: 'Taşçı’nın dövümcüler için hazırladığı kuvvet sofrası.'
  },
  {
    id: 'spirit_fruit_wine',
    name: 'Kutlu Meyve Şarabı',
    ingredients: [
      { itemId: 'wild_berry', quantity: 3 },
      { itemId: 'honey', quantity: 2 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 25,
      buff: { type: 'luck', value: 25, description: 'Şans +25% (o gün)' }
    },
    unlockSource: 'Küçük Ay dostluğu «Can Yoldaşı»',
    description: 'Kutlu orman yemişlerinden yapılmış uğurlu bir içki.'
  },

  // ==================== Evlilik tarifleri ====================
  {
    id: 'phoenix_cake',
    name: 'Anka Keki',
    ingredients: [
      { itemId: 'rice', quantity: 3 },
      { itemId: 'osmanthus', quantity: 2 },
      { itemId: 'jujube', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 25,
      buff: { type: 'giftBonus', value: 3, description: 'Hediye dostluğu ×3 (o gün)' }
    },
    unlockSource: 'Gül Ana ile evlendikten sonra',
    description: 'Gül Ana’nın evlilikten sonra öğrettiği uğurlu kek.'
  },
  {
    id: 'molten_hotpot',
    name: 'Kor Kazanı',
    ingredients: [
      { itemId: 'iron_ore', quantity: 3 },
      { itemId: 'chili', quantity: 2 },
      { itemId: 'potato', quantity: 2 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 50,
      buff: { type: 'mining', value: 35, description: 'Madencilik kuvvet harcaması -35% (o gün)' }
    },
    unlockSource: 'Taşçı ile evlendikten sonra',
    description: 'Evlilikten sonra öğrenilen ateşli maden yemeği.'
  },
  {
    id: 'moonlight_sashimi',
    name: 'Ay Işığı Dilimi',
    ingredients: [
      { itemId: 'sturgeon', quantity: 1 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 20,
      buff: { type: 'fishing', value: 3, description: 'Balıkçılık +3 (o gün)' }
    },
    unlockSource: 'Aylin ile evlendikten sonra',
    description: 'Aylin’in ay ışığında hazırladığı ince balık yemeği.'
  },
  {
    id: 'tea_banquet',
    name: 'Çay Sofrası',
    ingredients: [
      { itemId: 'tea', quantity: 3 },
      { itemId: 'lotus_seed', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 55,
      healthRestore: 30,
      buff: { type: 'giftBonus', value: 2, description: 'Hediye dostluğu ×2 (o gün)' }
    },
    unlockSource: 'Bahar ile evlendikten sonra',
    description: 'Bahar’ın çayla zenginleştirdiği özel sofra.'
  },
  {
    id: 'snow_plum_soup',
    name: 'Kar Erik Tatlısı',
    ingredients: [
      { itemId: 'snow_lotus', quantity: 1 },
      { itemId: 'honey', quantity: 2 }
    ],
    effect: {
      staminaRestore: 65,
      healthRestore: 35,
      buff: { type: 'luck', value: 3, description: 'Şans +3 (o gün)' }
    },
    unlockSource: 'Karçiçek ile evlendikten sonra',
    description: 'Resim odasından çıkan ince bir ev yemeği.'
  },
  {
    id: 'silk_dumpling',
    name: 'İpek Bohça Böreği',
    ingredients: [
      { itemId: 'silk', quantity: 1 },
      { itemId: 'rice', quantity: 2 },
      { itemId: 'cabbage', quantity: 2 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'giftBonus', value: 2, description: 'Hediye dostluğu ×2 (o gün)' }
    },
    unlockSource: 'Suna ile evlendikten sonra',
    description: 'Suna’nın bohça gibi katladığı zarif börek.'
  },
  {
    id: 'drunken_chicken',
    name: 'Sarhoş Tavuk',
    ingredients: [
      { itemId: 'egg', quantity: 3 },
      { itemId: 'peach_wine', quantity: 1 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 40,
      buff: { type: 'farming', value: 30, description: 'Tarla kuvvet harcaması -30% (o gün)' }
    },
    unlockSource: 'Alnaz ile evlendikten sonra',
    description: 'Şeftali şarabıyla kokulandırılmış meşhur ev yemeği.'
  },
  {
    id: 'scholars_porridge',
    name: 'Bilge Lapası',
    ingredients: [
      { itemId: 'rice', quantity: 3 },
      { itemId: 'tea', quantity: 1 },
      { itemId: 'ginseng', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 30,
      buff: { type: 'speed', value: 2, description: 'Hareket hızı +2 (o gün)' }
    },
    unlockSource: 'Nakkaş ile evlendikten sonra',
    description: 'Eski usulle kaynatılmış gönül açıcı bir lapa.'
  },
  {
    id: 'ironforge_stew',
    name: 'Demirci Güveci',
    ingredients: [
      { itemId: 'potato', quantity: 3 },
      { itemId: 'corn', quantity: 2 },
      { itemId: 'iron_ore', quantity: 1 }
    ],
    effect: {
      staminaRestore: 80,
      healthRestore: 50,
      buff: { type: 'mining', value: 40, description: 'Madencilik kuvvet harcaması -40% (o gün)' }
    },
    unlockSource: 'Ali Usta ile evlendikten sonra',
    description: 'Ali Usta’nın bol, doyurucu ve sert mizaçlı yemeği.'
  },
  {
    id: 'hunters_roast',
    name: 'Avcı Kebabı',
    ingredients: [
      { itemId: 'wild_mushroom', quantity: 3 },
      { itemId: 'herb', quantity: 2 },
      { itemId: 'pine_cone', quantity: 1 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 45,
      buff: { type: 'defense', value: 3, description: 'Savunma +3 (o gün)' }
    },
    unlockSource: 'Baran ile evlendikten sonra',
    description: 'Baran’ın dağ başında öğrettiği köz usulü.'
  },
  {
    id: 'ranch_milk_soup',
    name: 'Çiftlik Süt Çorbası',
    ingredients: [
      { itemId: 'milk', quantity: 2 },
      { itemId: 'corn', quantity: 2 },
      { itemId: 'sweet_potato', quantity: 1 }
    ],
    effect: {
      staminaRestore: 55,
      healthRestore: 35,
      buff: { type: 'farming', value: 25, description: 'Tarla kuvvet harcaması -25% (o gün)' }
    },
    unlockSource: 'Börü ile evlendikten sonra',
    description: 'Börü’nün evde sık sık yaptığı koyu süt çorbası.'
  },
  {
    id: 'moonlit_tea_rice',
    name: 'Ayaltı Çaylı Pilav',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'tea', quantity: 2 },
      { itemId: 'bamboo_shoot', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 20,
      buff: { type: 'luck', value: 2, description: 'Şans +2 (o gün)' }
    },
    unlockSource: 'Akkara ile evlendikten sonra',
    description: 'Ay ışığında içilen hafif, dingin bir pilav.'
  },

  // ==================== Tarım beceri tarifleri ====================
  {
    id: 'pumpkin_pie',
    name: 'Balkabağı Çöreği',
    ingredients: [
      { itemId: 'pumpkin', quantity: 2 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'farming', value: 15, description: 'Tarla kuvvet harcaması -15% (o gün)' }
    },
    unlockSource: 'Tarım seviyesi 6',
    requiredSkill: { type: 'farming', level: 6 },
    description: 'Altın renkli, yumuşak bir çörek.'
  },
  {
    id: 'golden_fried_rice',
    name: 'Altın Pilav',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'egg', quantity: 2 },
      { itemId: 'corn', quantity: 1 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'farming', value: 20, description: 'Tarla kuvvet harcaması -20% (o gün)' }
    },
    unlockSource: 'Tarım seviyesi 7',
    requiredSkill: { type: 'farming', level: 7 },
    description: 'Taneleri altın gibi parlayan kızarmış pilav.'
  },
  {
    id: 'supreme_farm_feast',
    name: 'Bağ Bahçe Şöleni',
    ingredients: [
      { itemId: 'pumpkin', quantity: 1 },
      { itemId: 'watermelon', quantity: 1 },
      { itemId: 'corn', quantity: 1 },
      { itemId: 'rice', quantity: 2 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 35,
      buff: { type: 'farming', value: 30, description: 'Tarla kuvvet harcaması -30% (o gün)' }
    },
    unlockSource: 'Tarım seviyesi 9',
    requiredSkill: { type: 'farming', level: 9 },
    description: 'Dört mevsimin bereketini bir araya getiren büyük sofra.'
  },

  // ==================== Balıkçılık beceri tarifleri ====================
  {
    id: 'braised_catfish',
    name: 'Yahnili Yayın Balığı',
    ingredients: [
      { itemId: 'catfish', quantity: 1 },
      { itemId: 'chili', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'fishing', value: 1, description: 'Balıkçılık +1 (o gün)' }
    },
    unlockSource: 'Balıkçılık seviyesi 4',
    requiredSkill: { type: 'fishing', level: 4 },
    description: 'Baharatlı ve doyurucu bir yayın balığı yemeği.'
  },
  {
    id: 'grilled_eel',
    name: 'Köz Yılanbalığı',
    ingredients: [
      { itemId: 'eel', quantity: 1 },
      { itemId: 'sesame', quantity: 1 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'fishing', value: 2, description: 'Balıkçılık +2 (o gün)' }
    },
    unlockSource: 'Balıkçılık seviyesi 5',
    requiredSkill: { type: 'fishing', level: 5 },
    description: 'Dışı hafif çıtır, içi yumuşak köz balık.'
  },
  {
    id: 'crab_soup',
    name: 'Yengeç Çorbası',
    ingredients: [
      { itemId: 'river_crab', quantity: 2 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 25,
      buff: { type: 'luck', value: 15, description: 'Şans +15% (o gün)' }
    },
    unlockSource: 'Balıkçılık seviyesi 6',
    requiredSkill: { type: 'fishing', level: 6 },
    description: 'Yoğun ve leziz bir yengeç çorbası.'
  },
  {
    id: 'sturgeon_stew',
    name: 'Mersin Balığı Aşı',
    ingredients: [
      { itemId: 'sturgeon', quantity: 1 },
      { itemId: 'herb', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 55,
      healthRestore: 30,
      buff: { type: 'fishing', value: 3, description: 'Balıkçılık +3 (o gün)' }
    },
    unlockSource: 'Balıkçılık seviyesi 7',
    requiredSkill: { type: 'fishing', level: 7 },
    description: 'Kıymetli balıktan yapılmış seçkin bir aş.'
  },
  {
    id: 'dragon_sashimi',
    name: 'Ejder Balığı Dilimi',
    ingredients: [
      { itemId: 'dragonfish', quantity: 1 },
      { itemId: 'ginger', quantity: 2 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 35,
      buff: { type: 'fishing', value: 4, description: 'Balıkçılık +4 (o gün)' }
    },
    unlockSource: 'Balıkçılık seviyesi 8',
    requiredSkill: { type: 'fishing', level: 8 },
    description: 'Efsanevi ejder balığından yapılan üstün bir yemek.'
  },

  // ==================== Madencilik beceri tarifleri ====================
  {
    id: 'stone_soup',
    name: 'Cevher Çorbası',
    ingredients: [
      { itemId: 'copper_ore', quantity: 2 },
      { itemId: 'radish', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: { staminaRestore: 25, healthRestore: 20 },
    unlockSource: 'Madencilik seviyesi 3',
    requiredSkill: { type: 'mining', level: 3 },
    description: 'Madenin içinde bulunanlarla kaynatılmış çorba.'
  },
  {
    id: 'crystal_jelly',
    name: 'Kristal Pelte',
    ingredients: [
      { itemId: 'crystal_ore', quantity: 1 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 25,
      buff: { type: 'mining', value: 25, description: 'Madencilik kuvvet harcaması -25% (o gün)' }
    },
    unlockSource: 'Madencilik seviyesi 5',
    requiredSkill: { type: 'mining', level: 5 },
    description: 'Billur gibi parlayan, serin bir tatlı.'
  },
  {
    id: 'iron_tonic',
    name: 'Demirkemik Çorbası',
    ingredients: [
      { itemId: 'iron_ore', quantity: 2 },
      { itemId: 'herb', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 35,
      buff: { type: 'defense', value: 20, description: 'Alınan hasar -20% (o gün)' }
    },
    unlockSource: 'Madencilik seviyesi 6',
    requiredSkill: { type: 'mining', level: 6 },
    description: 'Bedeni sertleştiren koyu bir çorba.'
  },
  {
    id: 'gold_dumpling',
    name: 'Altın Cevher Böreği',
    ingredients: [
      { itemId: 'gold_ore', quantity: 1 },
      { itemId: 'winter_wheat', quantity: 2 }
    ],
    effect: {
      staminaRestore: 55,
      healthRestore: 30,
      buff: { type: 'mining', value: 30, description: 'Madencilik kuvvet harcaması -30% (o gün)' }
    },
    unlockSource: 'Madencilik seviyesi 7',
    requiredSkill: { type: 'mining', level: 7 },
    description: 'Altın tozu karılmış madenci böreği.'
  },
  {
    id: 'void_essence_soup',
    name: 'Boşluk Özlü Çorba',
    ingredients: [
      { itemId: 'void_ore', quantity: 1 },
      { itemId: 'ginseng', quantity: 1 },
      { itemId: 'herb', quantity: 2 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 40,
      buff: { type: 'mining', value: 35, description: 'Madencilik kuvvet harcaması -35% (o gün)' }
    },
    unlockSource: 'Madencilik seviyesi 8',
    requiredSkill: { type: 'mining', level: 8 },
    description: 'Boşluk cevherinden çıkarılan gizemli kudret çorbası.'
  },

  // ==================== Toplayıcılık beceri tarifleri ====================
  {
    id: 'wild_salad',
    name: 'Yaban Salatası',
    ingredients: [
      { itemId: 'herb', quantity: 2 },
      { itemId: 'wild_berry', quantity: 1 }
    ],
    effect: { staminaRestore: 20, healthRestore: 10 },
    unlockSource: 'Toplayıcılık seviyesi 3',
    requiredSkill: { type: 'foraging', level: 3 },
    description: 'Dağ bayırdan toplanan taze otların salatası.'
  },
  {
    id: 'mushroom_stew',
    name: 'Mantar Güveci',
    ingredients: [
      { itemId: 'wild_mushroom', quantity: 3 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 20,
      buff: { type: 'speed', value: 15, description: 'Hareket hızı +15% (o gün)' }
    },
    unlockSource: 'Toplayıcılık seviyesi 4',
    requiredSkill: { type: 'foraging', level: 4 },
    description: 'Yabani mantarlardan ağır ağır pişmiş koyu bir yemek.'
  },
  {
    id: 'forest_tonic',
    name: 'Orman Kuvveti',
    ingredients: [
      { itemId: 'ginseng', quantity: 1 },
      { itemId: 'wild_mushroom', quantity: 2 },
      { itemId: 'herb', quantity: 2 }
    ],
    effect: {
      staminaRestore: 55,
      healthRestore: 30,
      buff: { type: 'farming', value: 20, description: 'Tarla kuvvet harcaması -20% (o gün)' }
    },
    unlockSource: 'Toplayıcılık seviyesi 7',
    requiredSkill: { type: 'foraging', level: 7 },
    description: 'Ormanın nadide nimetlerinden kaynatılmış ilaç.'
  },
  {
    id: 'spirit_herb_elixir',
    name: 'Kutlu Ot İksiri',
    ingredients: [
      { itemId: 'ginseng', quantity: 2 },
      { itemId: 'herb', quantity: 3 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 80,
      healthRestore: 40,
      buff: { type: 'luck', value: 25, description: 'Şans +25% (o gün)' }
    },
    unlockSource: 'Toplayıcılık seviyesi 9',
    requiredSkill: { type: 'foraging', level: 9 },
    description: 'Usta toplayıcıların gizli otu ve şifası.'
  },

  // ==================== Savaş beceri tarifleri ====================
  {
    id: 'warrior_ration',
    name: 'Savaşçı Azığı',
    ingredients: [
      { itemId: 'potato', quantity: 2 },
      { itemId: 'egg', quantity: 1 }
    ],
    effect: { staminaRestore: 25, healthRestore: 25 },
    unlockSource: 'Savaş seviyesi 3',
    requiredSkill: { type: 'combat', level: 3 },
    description: 'Sade ama işe yarar savaşçı yiyeceği.'
  },
  {
    id: 'battle_stew',
    name: 'Cenk Güveci',
    ingredients: [
      { itemId: 'chili', quantity: 1 },
      { itemId: 'potato', quantity: 1 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 30,
      buff: { type: 'defense', value: 15, description: 'Alınan hasar -15% (o gün)' }
    },
    unlockSource: 'Savaş seviyesi 4',
    requiredSkill: { type: 'combat', level: 4 },
    description: 'Cenk gücünü artıran baharatlı bir güveç.'
  },
  {
    id: 'iron_fist_soup',
    name: 'Demiryumruk Çorbası',
    ingredients: [
      { itemId: 'iron_ore', quantity: 1 },
      { itemId: 'chili', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 35,
      buff: { type: 'defense', value: 20, description: 'Alınan hasar -20% (o gün)' }
    },
    unlockSource: 'Savaş seviyesi 5',
    requiredSkill: { type: 'combat', level: 5 },
    description: 'Dövüşçüler için hazırlanmış sert bir çorba.'
  },
  {
    id: 'shadow_brew',
    name: 'Gölge Demi',
    ingredients: [
      { itemId: 'shadow_ore', quantity: 1 },
      { itemId: 'herb', quantity: 2 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 55,
      healthRestore: 40,
      buff: { type: 'defense', value: 25, description: 'Alınan hasar -25% (o gün)' }
    },
    unlockSource: 'Savaş seviyesi 7',
    requiredSkill: { type: 'combat', level: 7 },
    description: 'Gölge cevherinden kaynatılan gizemli içecek.'
  },
  {
    id: 'void_elixir',
    name: 'Boşluk İksiri',
    ingredients: [
      { itemId: 'void_ore', quantity: 1 },
      { itemId: 'ginseng', quantity: 1 },
      { itemId: 'shadow_ore', quantity: 1 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 50,
      buff: { type: 'defense', value: 30, description: 'Alınan hasar -30% (o gün)' }
    },
    unlockSource: 'Savaş seviyesi 9',
    requiredSkill: { type: 'combat', level: 9 },
    description: 'Savaş ustalarının damıttığı son kudret iksiri.'
  },

  // ==================== Mevsim ve bayram tarifleri ====================
  {
    id: 'spring_roll',
    name: 'Bahar Sarması',
    ingredients: [
      { itemId: 'cabbage', quantity: 2 },
      { itemId: 'bamboo_shoot', quantity: 1 },
      { itemId: 'sesame_oil', quantity: 1 }
    ],
    effect: {
      staminaRestore: 30,
      healthRestore: 15,
      buff: { type: 'speed', value: 15, description: 'Hareket hızı +15% (o gün)' }
    },
    unlockSource: 'Bahar Ekim Şenliği ödülü',
    description: 'Bahar şenliğinin geleneksel sarması.'
  },
  {
    id: 'lotus_lantern_cake',
    name: 'Lotus Feneri Keki',
    ingredients: [
      { itemId: 'lotus_seed', quantity: 2 },
      { itemId: 'rice', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 20,
      buff: { type: 'luck', value: 15, description: 'Şans +15% (o gün)' }
    },
    unlockSource: 'Lotus Feneri Bayramı ödülü',
    description: 'Bayrama mahsus ışıklı bir tatlı.'
  },
  {
    id: 'harvest_feast',
    name: 'Bereket Sofrası',
    ingredients: [
      { itemId: 'pumpkin', quantity: 1 },
      { itemId: 'sweet_potato', quantity: 1 },
      { itemId: 'corn', quantity: 1 },
      { itemId: 'firewood', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 25,
      buff: { type: 'farming', value: 20, description: 'Tarla kuvvet harcaması -20% (o gün)' }
    },
    unlockSource: 'Bereket Şöleni ödülü',
    description: 'Hasat şöleninin büyük yemeği.'
  },
  {
    id: 'new_year_dumpling',
    name: 'Yılbaşı Böreği',
    ingredients: [
      { itemId: 'winter_wheat', quantity: 3 },
      { itemId: 'napa_cabbage', quantity: 2 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 30,
      buff: { type: 'luck', value: 20, description: 'Şans +20% (o gün)' }
    },
    unlockSource: 'Yıl sonu nöbeti ödülü',
    description: 'Yılın son gecesinde yapılan uğurlu börek.'
  },

  // ==================== Yeni bayram tarifleri ====================
  {
    id: 'nian_gao',
    name: 'Yıl Keki',
    ingredients: [
      { itemId: 'rice', quantity: 3 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 15,
      buff: { type: 'farming', value: 10, description: 'Tarla kuvvet harcaması -10% (o gün)' }
    },
    unlockSource: 'Yeni Gün ödülü',
    description: 'Yılı yükseltsin diye yapılan uğurlu kek.'
  },
  {
    id: 'hua_gao',
    name: 'Çiçek Keki',
    ingredients: [
      { itemId: 'peach', quantity: 2 },
      { itemId: 'rice', quantity: 1 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 10,
      buff: { type: 'luck', value: 10, description: 'Şans +10% (o gün)' }
    },
    unlockSource: 'Çiçek Bayramı ödülü',
    description: 'Çiçek kokulu, ince yapılı bir bayram tatlısı.'
  },
  {
    id: 'qing_tuan',
    name: 'Yeşil Lokma',
    ingredients: [
      { itemId: 'herb', quantity: 2 },
      { itemId: 'rice', quantity: 2 }
    ],
    effect: {
      staminaRestore: 30,
      healthRestore: 10,
      buff: { type: 'farming', value: 15, description: 'Tarla kuvvet harcaması -15% (o gün)' }
    },
    unlockSource: 'Kır Gezisi ödülü',
    description: 'Ot kokulu, taze bir yol lokması.'
  },
  {
    id: 'yue_bing',
    name: 'Ay Keki',
    ingredients: [
      { itemId: 'lotus_seed', quantity: 2 },
      { itemId: 'sesame_oil', quantity: 1 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'luck', value: 15, description: 'Şans +15% (o gün)' }
    },
    unlockSource: 'Ay Seyri ödülü',
    description: 'Dolunay gecesinin lotus özlü keki.'
  },
  {
    id: 'la_ba_zhou',
    name: 'Kış Lapası',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'peanut', quantity: 1 },
      { itemId: 'wild_berry', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 25
    },
    unlockSource: 'Kış Lapa Şenliği ödülü',
    description: 'İçi ısıtan, kuvvet toplayan bir kış lapası.'
  },
  {
    id: 'dragon_boat_zongzi',
    name: 'Yaprak Sarması',
    ingredients: [
      { itemId: 'rice', quantity: 3 },
      { itemId: 'bamboo_shoot', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'speed', value: 10, description: 'Hareket hızı +10% (o gün)' }
    },
    unlockSource: 'Irmak Yarışı ödülü',
    description: 'Yaprak kokusu sinmiş bayram lokması.'
  },
  {
    id: 'qiao_guo',
    name: 'Ustalık Tatlısı',
    ingredients: [
      { itemId: 'winter_wheat', quantity: 2 },
      { itemId: 'honey', quantity: 1 },
      { itemId: 'sesame_oil', quantity: 1 }
    ],
    effect: {
      staminaRestore: 30,
      healthRestore: 10,
      buff: { type: 'fishing', value: 1, description: 'Balıkçılık +1 (o gün)' }
    },
    unlockSource: 'Bilmece Gecesi ödülü',
    description: 'Şenlik gecelerinde yapılan geleneksel küçük tatlı.'
  },
  {
    id: 'chrysanthemum_wine',
    name: 'Kasımpatı Şarabı',
    ingredients: [
      { itemId: 'chrysanthemum', quantity: 3 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: {
      staminaRestore: 40,
      healthRestore: 20,
      buff: { type: 'luck', value: 12, description: 'Şans +12% (o gün)' }
    },
    unlockSource: 'Güz Tepesi ödülü',
    description: 'Güz bayramında içilen hoş kokulu bir şarap.'
  },
  {
    id: 'jiaozi',
    name: 'Gündönümü Böreği',
    ingredients: [
      { itemId: 'winter_wheat', quantity: 2 },
      { itemId: 'napa_cabbage', quantity: 2 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'mining', value: 1, description: 'Madencilik +1 (o gün)' }
    },
    unlockSource: 'Kış gündönümü ödülü',
    description: 'Soğuk günlerde iç ısıtan bir börek.'
  },
  {
    id: 'tangyuan',
    name: 'Yuvarlak Lokma',
    ingredients: [
      { itemId: 'rice', quantity: 3 },
      { itemId: 'honey', quantity: 1 },
      { itemId: 'peanut', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 25,
      buff: { type: 'all_skills', value: 1, description: 'Tüm beceriler +1 (o gün)' }
    },
    unlockSource: 'Yıl sonu havai fişek şöleni ödülü',
    description: 'Birlik ve bereketi simgeleyen tatlı lokmalar.'
  },
  {
    id: 'dou_cha_yin',
    name: 'Çay Yarışı Şerbeti',
    ingredients: [
      { itemId: 'tea', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'all_skills', value: 1, description: 'Tüm beceriler +1 (o gün)' }
    },
    unlockSource: 'Çay Meclisi ödülü',
    description: 'Çay meclislerinde sunulan ferah bir içecek.'
  },
  {
    id: 'zhi_yuan_gao',
    name: 'Uçurtma Keki',
    ingredients: [
      { itemId: 'rice', quantity: 2 },
      { itemId: 'peach', quantity: 1 },
      { itemId: 'sesame_oil', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'speed', value: 12, description: 'Hareket hızı +12% (o gün)' }
    },
    unlockSource: 'Güz Uçurtma Şenliği ödülü',
    description: 'Uçurtma günlerinde yapılan hafif bir kek.'
  },

  // ==================== Başarı kilometre taşı tarifleri ====================
  {
    id: 'first_catch_soup',
    name: 'İlk Av Çorbası',
    ingredients: [
      { itemId: 'crucian', quantity: 2 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: { staminaRestore: 20, healthRestore: 10 },
    unlockSource: 'Başarı: İlk balık',
    description: 'İlk tutulan balığın hatırasına kaynatılan çorba.'
  },
  {
    id: 'bountiful_porridge',
    name: 'Yüz Hasat Lapası',
    ingredients: [
      { itemId: 'rice', quantity: 3 },
      { itemId: 'jujube', quantity: 2 }
    ],
    effect: { staminaRestore: 40, healthRestore: 20 },
    unlockSource: 'Başarı: 100 kez hasat',
    description: 'Yüz bereketin şerefine pişirilen lapa.'
  },
  {
    id: 'miners_glory',
    name: 'Madencinin Şanı',
    ingredients: [
      { itemId: 'gold_ore', quantity: 1 },
      { itemId: 'egg', quantity: 2 },
      { itemId: 'rice', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 30,
      buff: { type: 'mining', value: 25, description: 'Madencilik kuvvet harcaması -25% (o gün)' }
    },
    unlockSource: 'Başarı: Madenin 30. katına var',
    description: 'Madenci şerefine yapılan kuvvet yemeği.'
  },
  {
    id: 'chef_special',
    name: 'Usta Aşçı Tabağı',
    ingredients: [
      { itemId: 'egg', quantity: 2 },
      { itemId: 'honey', quantity: 1 },
      { itemId: 'sesame', quantity: 2 }
    ],
    effect: { staminaRestore: 45, healthRestore: 20 },
    unlockSource: 'Başarı: 20 yemek pişir',
    description: 'Ancak eli yatkın aşçının çıkarabildiği özel yemek.'
  },
  {
    id: 'social_tea',
    name: 'Muhabbet Çayı',
    ingredients: [
      { itemId: 'osmanthus', quantity: 2 },
      { itemId: 'honey', quantity: 1 }
    ],
    effect: {
      staminaRestore: 30,
      healthRestore: 15,
      buff: { type: 'giftBonus', value: 2, description: 'Hediye dostluğu ×2 (o gün)' }
    },
    unlockSource: 'Başarı: 3 NPC ile Yakınlık',
    description: 'Sohbet ehlinin özel harman çayı.'
  },
  {
    id: 'anglers_platter',
    name: 'Balıkçı Tabağı',
    ingredients: [
      { itemId: 'bass', quantity: 1 },
      { itemId: 'creek_shrimp', quantity: 1 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 25,
      buff: { type: 'fishing', value: 2, description: 'Balıkçılık +2 (o gün)' }
    },
    unlockSource: 'Başarı: 20 balık tut',
    description: 'Usta balıkçıların bir araya getirdiği seçme tabak.'
  },
  {
    id: 'legendary_feast',
    name: 'Efsane Şöleni',
    ingredients: [
      { itemId: 'jade_dragon', quantity: 1 },
      { itemId: 'ginger', quantity: 2 }
    ],
    effect: {
      staminaRestore: 80,
      healthRestore: 40,
      buff: { type: 'fishing', value: 4, description: 'Balıkçılık +4 (o gün)' }
    },
    unlockSource: 'Başarı: Efsane balık tut',
    description: 'Efsanevi balıktan yapılan üstün bir şölen.'
  },
  {
    id: 'abyss_stew',
    name: 'Uçurum Güveci',
    ingredients: [
      { itemId: 'shadow_ore', quantity: 1 },
      { itemId: 'crystal_shrimp', quantity: 1 },
      { itemId: 'herb', quantity: 1 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 35,
      buff: { type: 'defense', value: 20, description: 'Alınan hasar -20% (o gün)' }
    },
    unlockSource: 'Başarı: Madenin 50. katına var',
    description: 'Uçurum kâşiflerinin gizli usul yemeği.'
  },
  {
    id: 'collectors_banquet',
    name: 'Koleksiyoncunun Sofrası',
    ingredients: [
      { itemId: 'ginseng', quantity: 1 },
      { itemId: 'sturgeon', quantity: 1 },
      { itemId: 'pumpkin', quantity: 1 },
      { itemId: 'rice', quantity: 2 }
    ],
    effect: {
      staminaRestore: 80,
      healthRestore: 40,
      buff: { type: 'luck', value: 25, description: 'Şans +25% (o gün)' }
    },
    unlockSource: 'Başarı: 50 çeşit eşya bul',
    description: 'Nadir nimetlerden kurulmuş seçkin bir sofra.'
  },

  // ===== Yeni: hayvansal ürün tarifleri =====
  {
    id: 'silkie_egg_soup',
    name: 'Kara Tavuk Yumurta Tatlısı',
    ingredients: [
      { itemId: 'silkie_egg', quantity: 2 },
      { itemId: 'ginger', quantity: 1 }
    ],
    effect: { staminaRestore: 50, healthRestore: 30 },
    unlockSource: 'Başlangıçta açık',
    description: 'Bedeni toparlayan yumurta tatlısı.'
  },
  {
    id: 'goat_milk_soup',
    name: 'Keçi Sütü Çorbası',
    ingredients: [
      { itemId: 'goat_milk', quantity: 2 },
      { itemId: 'herb', quantity: 1 }
    ],
    effect: { staminaRestore: 45, healthRestore: 25 },
    unlockSource: 'Börü dostluğu «Can Yoldaşı»',
    description: 'Sıcak ve koyu kıvamlı keçi sütü çorbası.'
  },
  {
    id: 'truffle_fried_rice',
    name: 'Yer Mantarlı Pilav',
    ingredients: [
      { itemId: 'truffle', quantity: 1 },
      { itemId: 'rice', quantity: 1 },
      { itemId: 'egg', quantity: 1 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 30,
      buff: { type: 'farming', value: 1, description: 'Tarım +1 (o gün)' }
    },
    unlockSource: 'Börü dostluğu «Sırdaş»',
    description: 'Kokusu her yana yayılan gösterişli bir pilav.'
  },
  {
    id: 'antler_soup',
    name: 'Boynuz İliği Çorbası',
    ingredients: [
      { itemId: 'antler_velvet', quantity: 1 },
      { itemId: 'herb', quantity: 2 },
      { itemId: 'ginseng', quantity: 1 }
    ],
    effect: {
      staminaRestore: 80,
      healthRestore: 40,
      buff: { type: 'stamina', value: 100, description: 'Kuvvet tam yenilenir' }
    },
    unlockSource: 'Hekim Dede dostluğu «Sırdaş»',
    description: 'Bir tas içenin zihni açılır, bedeni dinçleşir.'
  },
  {
    id: 'camel_milk_tea',
    name: 'Deve Sütlü Çay',
    ingredients: [
      { itemId: 'camel_milk', quantity: 1 },
      { itemId: 'tea', quantity: 1 }
    ],
    effect: {
      staminaRestore: 35,
      healthRestore: 15,
      buff: { type: 'speed', value: 15, description: 'Hareket hızı +15% (o gün)' }
    },
    unlockSource: 'Hasan Enişte dostluğu «Can Yoldaşı»',
    description: 'İpeksi içimli, doyurucu bir sütlü çay.'
  },
  {
    id: 'peacock_feast',
    name: 'Tavus Sofrası',
    ingredients: [
      { itemId: 'peacock_feather', quantity: 1 },
      { itemId: 'rice', quantity: 2 },
      { itemId: 'osmanthus', quantity: 1 }
    ],
    effect: {
      staminaRestore: 90,
      healthRestore: 50,
      buff: { type: 'all_skills', value: 1, description: 'Tüm beceriler +1 (o gün)' }
    },
    unlockSource: 'Evlilikten sonra açılır',
    description: 'Rivayetlere konu olmuş, görkemli bir sofra.'
  },

  // === Ulu Deniz tarifleri ===
  {
    id: 'spiced_lamb',
    name: 'Baharatlı Kuzu Kebabı',
    ingredients: [
      { itemId: 'hanhai_spice', quantity: 1 },
      { itemId: 'goat_milk', quantity: 1 }
    ],
    effect: {
      staminaRestore: 60,
      healthRestore: 30,
      buff: { type: 'mining', value: 2, description: 'Madencilik +2 (o gün)' }
    },
    unlockSource: 'Ulu Deniz Hanı’ndan baharat alınca açılır',
    description: 'Batı diyarlarının kokusunu taşıyan kuvvetli bir kebap.'
  },
  {
    id: 'silk_dumpling_deluxe',
    name: 'İpek Yolu Böreği',
    ingredients: [
      { itemId: 'hanhai_silk', quantity: 1 },
      { itemId: 'rice', quantity: 2 },
      { itemId: 'hanhai_spice', quantity: 1 }
    ],
    effect: {
      staminaRestore: 70,
      healthRestore: 35,
      buff: { type: 'giftBonus', value: 3, description: 'Hediye dostluğu ×3 (o gün)' }
    },
    unlockSource: 'Ulu Deniz Hanı’ndan ipek alınca açılır',
    description: 'Uzak diyar baharatıyla yapılan zarif bir börek.'
  },
  {
    id: 'desert_cactus_soup',
    name: 'Kaktüs Çorbası',
    ingredients: [
      { itemId: 'hanhai_cactus', quantity: 2 },
      { itemId: 'hanhai_spice', quantity: 1 }
    ],
    effect: {
      staminaRestore: 50,
      healthRestore: 40,
      buff: { type: 'stamina', value: 30, description: 'Azami kuvvet +30 (o gün)' }
    },
    unlockSource: 'Kaktüs hasat edilince açılır',
    description: 'Sıcak yolculuklarda can kurtaran serin bir çorba.'
  },
  {
    id: 'date_cake',
    name: 'Hurma Keki',
    ingredients: [
      { itemId: 'hanhai_date', quantity: 3 },
      { itemId: 'rice', quantity: 2 }
    ],
    effect: {
      staminaRestore: 45,
      healthRestore: 20,
      buff: { type: 'farming', value: 2, description: 'Tarım +2 (o gün)' }
    },
    unlockSource: 'Hurma hasat edilince açılır',
    description: 'Tatlı, yumuşak ve kan yapan bir kek.'
  }
]

/** ID ile tarifi getir */
export const getRecipeById = (id: string): RecipeDef | undefined => {
  return RECIPES.find(r => r.id === id)
        }
