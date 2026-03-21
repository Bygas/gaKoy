import type { MonsterGoalDef, GuildShopItemDef, GuildDonationDef, GuildLevelDef } from '@/types'

/** Canavar avı hedefleri */
export const MONSTER_GOALS: MonsterGoalDef[] = [
  // ===== Sığ Katlar =====
  { monsterId: 'mud_worm', monsterName: 'Çamur Kurdu', zone: 'shallow', killTarget: 25, reward: { money: 200 }, description: 'Sığ katlardaki çamur kurtlarını temizle.' },
  {
    monsterId: 'stone_crab',
    monsterName: 'Taş Yengeci',
    zone: 'shallow',
    killTarget: 25,
    reward: { money: 300 },
    description: 'Sığ katlardaki taş yengeçlerini yok et.'
  },

  // ===== Ayaz Katı =====
  { monsterId: 'ice_bat', monsterName: 'Buz Yarasa', zone: 'frost', killTarget: 25, reward: { money: 500 }, description: 'Ayaz katındaki buz yarasalarını düşür.' },
  { monsterId: 'ghost', monsterName: 'Hortlak', zone: 'frost', killTarget: 25, reward: { money: 500 }, description: 'Ayaz katındaki hortlakları dağıt.' },

  // ===== Kor Katı =====
  { monsterId: 'fire_bat', monsterName: 'Ateş Yarasa', zone: 'lava', killTarget: 50, reward: { money: 800 }, description: 'Kor katındaki ateş yarasalarını püskürt.' },
  {
    monsterId: 'shadow_warrior',
    monsterName: 'Gölge Cengâveri',
    zone: 'lava',
    killTarget: 50,
    reward: { money: 1000 },
    description: 'Kor katındaki gölge cengâverlerini alt et.'
  },

  // ===== Billur Katı =====
  {
    monsterId: 'crystal_golem',
    monsterName: 'Billur Heyula',
    zone: 'crystal',
    killTarget: 50,
    reward: { money: 1500 },
    description: 'Billur katındaki heyulaları parçala.'
  },
  {
    monsterId: 'prism_spider',
    monsterName: 'Prizma Örümceği',
    zone: 'crystal',
    killTarget: 50,
    reward: { money: 1500 },
    description: 'Billur katındaki prizma örümceklerini yok et.'
  },

  // ===== Gölge Katı =====
  {
    monsterId: 'shadow_lurker',
    monsterName: 'Gölge Pusucusu',
    zone: 'shadow',
    killTarget: 75,
    reward: { money: 2000 },
    description: 'Gölge katındaki pusucuları avla.'
  },
  {
    monsterId: 'void_wraith',
    monsterName: 'Boşluk Ruhu',
    zone: 'shadow',
    killTarget: 75,
    reward: { money: 2500 },
    description: 'Gölge katındaki boşluk ruhlarını arındır.'
  },

  // ===== Uçurum Katı =====
  {
    monsterId: 'abyss_serpent',
    monsterName: 'Uçurum Yılanı',
    zone: 'abyss',
    killTarget: 100,
    reward: { money: 3000 },
    description: 'Uçurum katındaki dev yılanları avla.'
  },
  {
    monsterId: 'bone_dragon',
    monsterName: 'Kemik Ejder',
    zone: 'abyss',
    killTarget: 100,
    reward: { money: 4000 },
    description: 'Uçurum katındaki kemik ejderleri yen.'
  },

  // ===== BOSS =====
  {
    monsterId: 'mud_golem',
    monsterName: 'Çamur Kaya Devi',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 500, items: [{ itemId: 'copper_bar', quantity: 10 }] },
    description: 'Çamur Kaya Devini üç kez yen.'
  },
  {
    monsterId: 'frost_queen',
    monsterName: 'Ayaz Hatunu',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 800, items: [{ itemId: 'iron_bar', quantity: 10 }] },
    description: 'Ayaz Hatununu üç kez yen.'
  },
  {
    monsterId: 'lava_lord',
    monsterName: 'Kor Beyi',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 1500, items: [{ itemId: 'gold_bar', quantity: 10 }] },
    description: 'Kor Beyini üç kez yen.'
  },
  {
    monsterId: 'crystal_king',
    monsterName: 'Billur Hanı',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 2500, items: [{ itemId: 'moonstone', quantity: 3 }] },
    description: 'Billur Hanını üç kez yen.'
  },
  {
    monsterId: 'shadow_sovereign',
    monsterName: 'Gölge Hükümdarı',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 4000, items: [{ itemId: 'obsidian', quantity: 3 }] },
    description: 'Gölge Hükümdarını üç kez yen.'
  },
  {
    monsterId: 'abyss_dragon',
    monsterName: 'Uçurum Ejder Hanı',
    zone: 'boss',
    killTarget: 3,
    reward: { money: 6000, items: [{ itemId: 'dragon_jade', quantity: 2 }] },
    description: 'Uçurum Ejder Hanını üç kez yen.'
  },

  // ===== Kuru Kafa Madeni =====
  {
    monsterId: 'iridium_golem',
    monsterName: 'İridyum Heyula',
    zone: 'skull',
    killTarget: 50,
    reward: { money: 3000 },
    description: 'Kuru Kafa Madeninde iridyum heyulalarını avla.'
  },
  {
    monsterId: 'skull_serpent',
    monsterName: 'Kuru Kafa Yılanı',
    zone: 'skull',
    killTarget: 50,
    reward: { money: 3000 },
    description: 'Kuru Kafa Madeninde uçan kuru kafa yılanlarını yok et.'
  },
  {
    monsterId: 'ancient_mummy',
    monsterName: 'Kadim Mumya',
    zone: 'skull',
    killTarget: 50,
    reward: { money: 5000 },
    description: 'Kuru Kafa Madeninde kadim mumyaları yen.'
  }
]

/** Lonca dükkânı eşyaları (Kervan Ocağı ile çakışmaz) */
export const GUILD_SHOP_ITEMS: GuildShopItemDef[] = [
  // --- Tüketmelikler (akıçe ile alınır, limitsiz) ---
  { itemId: 'combat_tonic', name: 'Cenk Şerbeti', price: 200, description: '30 HP yeniler.' },
  { itemId: 'adventurer_ration', name: 'Yolcu Azığı', price: 350, description: '25 can ve 25 kuvvet yeniler.', unlockGuildLevel: 2 },
  { itemId: 'fortify_brew', name: 'Güç Şurubu', price: 500, description: '60 HP yeniler.' },
  { itemId: 'ironhide_potion', name: 'Demir Deri İksiri', price: 800, description: 'Tüm HP’yi yeniler.' },
  { itemId: 'warriors_feast', name: 'Yiğit Sofrası', price: 1000, description: '50 kuvvet ve 50 can yeniler.', unlockGuildLevel: 5 },
  { itemId: 'slayer_charm', name: 'Avcı Muskası', price: 1500, description: 'Canavar düşürme oranı +%20 (yalnız o keşif için).', unlockGuildLevel: 3 },
  { itemId: 'stamina_elixir', name: 'Derman İksiri', price: 600, description: '120 kuvvet yeniler.', unlockGuildLevel: 4 },
  { itemId: 'monster_lure', name: 'Canavar Yemi', price: 2000, description: 'Bulunduğun katta canavar sayısını iki katına çıkarır.', unlockGuildLevel: 7 },

  // --- Teçhizat (katkı puanı + malzeme, her biri 1 kez alınır) ---
  {
    itemId: 'guild_war_ring',
    name: 'Lonca Harp Yüzüğü',
    price: 0,
    contributionCost: 200,
    description: 'Saldırı +4, savunma +%6.',
    unlockGuildLevel: 5,
    totalLimit: 1,
    equipType: 'ring',
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'ruby', quantity: 2 }
    ]
  },
  {
    itemId: 'guild_war_helm',
    name: 'Lonca Harp Miğferi',
    price: 0,
    contributionCost: 250,
    description: 'Saldırı +3, HP +15.',
    unlockGuildLevel: 6,
    totalLimit: 1,
    equipType: 'hat',
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'moonstone', quantity: 1 }
    ]
  },
  {
    itemId: 'guild_war_boots',
    name: 'Lonca Harp Çizmesi',
    price: 0,
    contributionCost: 250,
    description: 'Saldırı +2, savunma +%5, hız +%10.',
    unlockGuildLevel: 7,
    totalLimit: 1,
    equipType: 'shoe',
    materials: [
      { itemId: 'gold_bar', quantity: 5 },
      { itemId: 'obsidian', quantity: 1 }
    ]
  },
  {
    itemId: 'guild_war_blade',
    name: 'Lonca Harp Kılıcı',
    price: 0,
    contributionCost: 350,
    description: 'Saldırı gücü 36, kritik oranı %10.',
    unlockGuildLevel: 9,
    totalLimit: 1,
    equipType: 'weapon',
    materials: [
      { itemId: 'gold_bar', quantity: 10 },
      { itemId: 'dragon_jade', quantity: 1 }
    ]
  },

  // --- Kalıcı eşyalar (katkı puanı ile alınır, günlük/haftalık sınır) ---
  {
    itemId: 'guild_badge',
    name: 'Lonca Nişanı',
    price: 0,
    contributionCost: 150,
    description: 'Kalıcı saldırı +3.',
    unlockGuildLevel: 6,
    dailyLimit: 1
  },
  {
    itemId: 'life_talisman',
    name: 'Can Muskası',
    price: 0,
    contributionCost: 200,
    description: 'Kalıcı azami can +15.',
    unlockGuildLevel: 8,
    dailyLimit: 1,
    totalLimit: 100
  },
  {
    itemId: 'defense_charm',
    name: 'Koruyucu Muska',
    price: 0,
    contributionCost: 180,
    description: 'Kalıcı savunma +%3.',
    unlockGuildLevel: 7,
    weeklyLimit: 3,
    totalLimit: 10
  },
  {
    itemId: 'lucky_coin',
    name: 'Uğur Akçesi',
    price: 0,
    contributionCost: 300,
    description: 'Kalıcı canavar düşürme oranı +%5.',
    unlockGuildLevel: 10,
    weeklyLimit: 3,
    totalLimit: 10
  }
]

/** Loncaya bağışlanabilecek eşyalar */
export const GUILD_DONATIONS: GuildDonationDef[] = [
  // Cevherler
  { itemId: 'copper_ore', points: 2 },
  { itemId: 'iron_ore', points: 4 },
  { itemId: 'gold_ore', points: 8 },
  { itemId: 'crystal_ore', points: 12 },
  { itemId: 'shadow_ore', points: 18 },
  { itemId: 'void_ore', points: 25 },
  { itemId: 'iridium_ore', points: 35 },

  // Taşlar
  { itemId: 'quartz', points: 4 },
  { itemId: 'jade', points: 12 },
  { itemId: 'ruby', points: 18 },
  { itemId: 'moonstone', points: 25 },
  { itemId: 'obsidian', points: 35 },
  { itemId: 'dragon_jade', points: 50 },
  { itemId: 'prismatic_shard', points: 80 }
]

/** Lonca seviye tablosu (10 seviye) */
export const GUILD_LEVELS: GuildLevelDef[] = [
  { level: 1, expRequired: 100 },
  { level: 2, expRequired: 300 },
  { level: 3, expRequired: 600 },
  { level: 4, expRequired: 1000 },
  { level: 5, expRequired: 1500 },
  { level: 6, expRequired: 2200 },
  { level: 7, expRequired: 3000 },
  { level: 8, expRequired: 4000 },
  { level: 9, expRequired: 5500 },
  { level: 10, expRequired: 7500 }
]

/** Her lonca seviyesinin sağladığı pasif artış */
export const GUILD_BONUS_PER_LEVEL = {
  attack: 1, // Her seviyede +1 saldırı
  maxHp: 5 // Her seviyede +5 azami can
}

/** Canavar kimliğine göre av hedefini bulur */
export const getMonsterGoal = (monsterId: string): MonsterGoalDef | undefined => MONSTER_GOALS.find(g => g.monsterId === monsterId)
