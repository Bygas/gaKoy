import type { QuestTemplateDef, QuestInstance, QuestType } from '@/types/quest'
import type { Season } from '@/types/game'
import { getNpcById } from './npcs'

export const QUEST_TEMPLATES: QuestTemplateDef[] = [
  {
    type: 'delivery',
    targets: [
      // Yaygın mahsuller — karışık mevsimler
      { itemId: 'cabbage', name: 'Lahana', minQty: 2, maxQty: 5, seasons: ['spring'], unitPrice: 35 },
      { itemId: 'radish', name: 'Turp', minQty: 2, maxQty: 4, seasons: ['spring'], unitPrice: 55 },
      { itemId: 'potato', name: 'Patates', minQty: 2, maxQty: 4, seasons: ['spring'], unitPrice: 50 },
      { itemId: 'rice', name: 'Pirinç', minQty: 2, maxQty: 5, seasons: ['summer'], unitPrice: 40 },
      { itemId: 'watermelon', name: 'Karpuz', minQty: 1, maxQty: 3, seasons: ['summer'], unitPrice: 80 },
      { itemId: 'chili', name: 'Biber', minQty: 2, maxQty: 4, seasons: ['summer'], unitPrice: 45 },
      { itemId: 'pumpkin', name: 'Balkabağı', minQty: 1, maxQty: 3, seasons: ['autumn'], unitPrice: 100 },
      { itemId: 'sweet_potato', name: 'Tatlı Patates', minQty: 2, maxQty: 4, seasons: ['autumn'], unitPrice: 60 },
      { itemId: 'winter_wheat', name: 'Kış Buğdayı', minQty: 2, maxQty: 5, seasons: ['winter'], unitPrice: 45 },
      { itemId: 'garlic', name: 'Sarımsak', minQty: 2, maxQty: 4, seasons: ['winter'], unitPrice: 50 }
    ],
    npcPool: ['chen_bo', 'liu_niang', 'lin_lao', 'xiao_man'],
    rewardMultiplier: 3,
    friendshipReward: 5
  },
  {
    type: 'fishing',
    targets: [
      { itemId: 'crucian', name: 'Sazan', minQty: 1, maxQty: 3, seasons: [], unitPrice: 15 },
      { itemId: 'carp', name: 'Tatlı Su Sazanı', minQty: 1, maxQty: 2, seasons: ['spring', 'summer'], unitPrice: 25 },
      { itemId: 'grass_carp', name: 'Ot Sazanı', minQty: 1, maxQty: 2, seasons: ['summer', 'autumn'], unitPrice: 30 },
      { itemId: 'catfish', name: 'Yayın Balığı', minQty: 1, maxQty: 2, seasons: ['summer'], unitPrice: 40 },
      { itemId: 'bass', name: 'Levrek', minQty: 1, maxQty: 2, seasons: ['autumn'], unitPrice: 35 },
      { itemId: 'loach', name: 'Çamur Balığı', minQty: 1, maxQty: 3, seasons: ['summer', 'autumn'], unitPrice: 20 },
      { itemId: 'creek_shrimp', name: 'Dere Karidesi', minQty: 2, maxQty: 4, seasons: ['spring', 'summer', 'autumn'], unitPrice: 30 },
      { itemId: 'silver_carp', name: 'Gümüş Sazan', minQty: 1, maxQty: 2, seasons: ['summer'], unitPrice: 25 }
    ],
    npcPool: ['qiu_yue', 'chen_bo', 'lin_lao'],
    rewardMultiplier: 3,
    friendshipReward: 3
  },
  {
    type: 'mining',
    targets: [
      { itemId: 'copper_ore', name: 'Bakır Cevheri', minQty: 3, maxQty: 8, seasons: [], unitPrice: 10 },
      { itemId: 'iron_ore', name: 'Demir Cevheri', minQty: 3, maxQty: 6, seasons: [], unitPrice: 20 },
      { itemId: 'gold_ore', name: 'Altın Cevheri', minQty: 2, maxQty: 4, seasons: [], unitPrice: 40 },
      { itemId: 'quartz', name: 'Kuvars', minQty: 1, maxQty: 3, seasons: [], unitPrice: 30 },
      { itemId: 'jade', name: 'Yeşim', minQty: 1, maxQty: 2, seasons: [], unitPrice: 80 }
    ],
    npcPool: ['a_shi', 'xiao_man', 'chen_bo'],
    rewardMultiplier: 2,
    friendshipReward: 3
  },
  {
    type: 'gathering',
    targets: [
      { itemId: 'wood', name: 'Odun', minQty: 5, maxQty: 10, seasons: [], unitPrice: 5 },
      { itemId: 'herb', name: 'Şifalı Ot', minQty: 2, maxQty: 5, seasons: ['spring', 'summer', 'autumn'], unitPrice: 15 },
      { itemId: 'firewood', name: 'Yakacak', minQty: 5, maxQty: 10, seasons: [], unitPrice: 3 },
      { itemId: 'bamboo', name: 'Bambu', minQty: 3, maxQty: 6, seasons: ['spring', 'summer'], unitPrice: 10 },
      { itemId: 'pine_cone', name: 'Çam Kozalağı', minQty: 2, maxQty: 4, seasons: ['autumn', 'winter'], unitPrice: 10 },
      { itemId: 'wild_mushroom', name: 'Yabani Mantar', minQty: 2, maxQty: 4, seasons: ['autumn'], unitPrice: 20 },
      { itemId: 'wild_berry', name: 'Yabani Yemiş', minQty: 3, maxQty: 5, seasons: ['summer'], unitPrice: 10 },
      { itemId: 'ginseng', name: 'Ginseng', minQty: 1, maxQty: 2, seasons: ['autumn', 'winter'], unitPrice: 50 }
    ],
    npcPool: ['lin_lao', 'liu_niang', 'xiao_man'],
    rewardMultiplier: 3,
    friendshipReward: 5
  }
]

// Görev türü adları
export const QUEST_TYPE_LABELS: Record<QuestType, string> = {
  delivery: 'Teslimat',
  fishing: 'Balıkçılık',
  mining: 'Madencilik',
  gathering: 'Toplayıcılık',
  special_order: 'Özel Emir'
}

const QUEST_TYPE_VERBS: Record<QuestType, string> = {
  delivery: 'teslim et',
  fishing: 'yakala',
  mining: 'çıkar',
  gathering: 'topla',
  special_order: 'topla'
}

/** Özel emir şablonu */
interface SpecialOrderTemplate {
  name: string
  targetItemId: string
  targetItemName: string
  quantity: number
  days: number
  moneyReward: number
  itemReward: { itemId: string; quantity: number }[]
  seasons: Season[]
  npcId: string
  /** Zorluk kademesi: 1=7. gün (kolay), 2=14. gün (orta), 3=21. gün (zor), 4=28. gün (çok zor) */
  tier: number
}

/** Kademe bazlı özel emirler */
const SPECIAL_ORDER_TEMPLATES: SpecialOrderTemplate[] = [
  // === 1. Kademe (7. gün): Kolay ===
  {
    name: 'Bakır Tedariki',
    targetItemId: 'copper_ore',
    targetItemName: 'Bakır Cevheri',
    quantity: 15,
    days: 7,
    moneyReward: 600,
    itemReward: [{ itemId: 'iron_ore', quantity: 3 }],
    seasons: [],
    npcId: 'a_shi',
    tier: 1
  },
  {
    name: 'Taze Balık Toplama İşi',
    targetItemId: 'crucian',
    targetItemName: 'Sazan',
    quantity: 8,
    days: 7,
    moneyReward: 500,
    itemReward: [{ itemId: 'standard_bait', quantity: 10 }],
    seasons: [],
    npcId: 'qiu_yue',
    tier: 1
  },
  {
    name: 'Sebze Tedariki',
    targetItemId: 'cabbage',
    targetItemName: 'Lahana',
    quantity: 10,
    days: 7,
    moneyReward: 500,
    itemReward: [{ itemId: 'basic_fertilizer', quantity: 5 }],
    seasons: ['spring'],
    npcId: 'liu_niang',
    tier: 1
  },
  {
    name: 'Odun Hazırlığı',
    targetItemId: 'wood',
    targetItemName: 'Odun',
    quantity: 30,
    days: 7,
    moneyReward: 400,
    itemReward: [{ itemId: 'charcoal', quantity: 5 }],
    seasons: [],
    npcId: 'chen_bo',
    tier: 1
  },

  // === 2. Kademe (14. gün): Orta ===
  {
    name: 'Demir Hazırlığı',
    targetItemId: 'iron_ore',
    targetItemName: 'Demir Cevheri',
    quantity: 15,
    days: 7,
    moneyReward: 1200,
    itemReward: [{ itemId: 'charcoal', quantity: 10 }],
    seasons: [],
    npcId: 'a_shi',
    tier: 2
  },
  {
    name: 'Nadir Balık Buyruğu',
    targetItemId: 'catfish',
    targetItemName: 'Yayın Balığı',
    quantity: 5,
    days: 7,
    moneyReward: 1000,
    itemReward: [{ itemId: 'standard_bait', quantity: 20 }],
    seasons: ['summer'],
    npcId: 'qiu_yue',
    tier: 2
  },
  {
    name: 'Kışa Hazırlık',
    targetItemId: 'winter_wheat',
    targetItemName: 'Kış Buğdayı',
    quantity: 15,
    days: 7,
    moneyReward: 1200,
    itemReward: [{ itemId: 'seed_garlic', quantity: 5 }],
    seasons: ['winter'],
    npcId: 'chen_bo',
    tier: 2
  },
  {
    name: 'Şifalı Ot Toplama',
    targetItemId: 'herb',
    targetItemName: 'Şifalı Ot',
    quantity: 15,
    days: 7,
    moneyReward: 800,
    itemReward: [{ itemId: 'quality_fertilizer', quantity: 3 }],
    seasons: ['spring', 'summer', 'autumn'],
    npcId: 'lin_lao',
    tier: 2
  },

  // === 3. Kademe (21. gün): Zor ===
  {
    name: 'Bereket Planı',
    targetItemId: 'pumpkin',
    targetItemName: 'Balkabağı',
    quantity: 10,
    days: 7,
    moneyReward: 2000,
    itemReward: [{ itemId: 'quality_fertilizer', quantity: 5 }],
    seasons: ['autumn'],
    npcId: 'liu_niang',
    tier: 3
  },
  {
    name: 'Karpuz Bereketi',
    targetItemId: 'watermelon',
    targetItemName: 'Karpuz',
    quantity: 10,
    days: 7,
    moneyReward: 2200,
    itemReward: [{ itemId: 'seed_watermelon', quantity: 5 }],
    seasons: ['summer'],
    npcId: 'xiao_man',
    tier: 3
  },
  {
    name: 'Derin Maden Altını',
    targetItemId: 'gold_ore',
    targetItemName: 'Altın Cevheri',
    quantity: 15,
    days: 7,
    moneyReward: 2500,
    itemReward: [{ itemId: 'gold_ore', quantity: 5 }],
    seasons: [],
    npcId: 'a_shi',
    tier: 3
  },
  {
    name: 'Şifa Stoku',
    targetItemId: 'ginseng',
    targetItemName: 'Ginseng',
    quantity: 6,
    days: 7,
    moneyReward: 2000,
    itemReward: [{ itemId: 'herb', quantity: 15 }],
    seasons: ['autumn', 'winter'],
    npcId: 'lin_lao',
    tier: 3
  },

  // === 4. Kademe (28. gün): Çok zor ===
  {
    name: 'Büyük Maden Toplaması',
    targetItemId: 'gold_ore',
    targetItemName: 'Altın Cevheri',
    quantity: 25,
    days: 7,
    moneyReward: 4000,
    itemReward: [
      { itemId: 'gold_ore', quantity: 10 },
      { itemId: 'jade', quantity: 2 }
    ],
    seasons: [],
    npcId: 'a_shi',
    tier: 4
  },
  {
    name: 'Bereket Şöleni',
    targetItemId: 'pumpkin',
    targetItemName: 'Balkabağı',
    quantity: 20,
    days: 7,
    moneyReward: 4500,
    itemReward: [
      { itemId: 'quality_fertilizer', quantity: 10 },
      { itemId: 'speed_gro', quantity: 5 }
    ],
    seasons: ['autumn'],
    npcId: 'liu_niang',
    tier: 4
  },
  {
    name: 'Usta Balıkçı Meydan Okuması',
    targetItemId: 'catfish',
    targetItemName: 'Yayın Balığı',
    quantity: 12,
    days: 7,
    moneyReward: 3500,
    itemReward: [{ itemId: 'wild_bait', quantity: 10 }],
    seasons: ['summer'],
    npcId: 'qiu_yue',
    tier: 4
  },
  {
    name: 'Kışlık Büyük Erzak',
    targetItemId: 'winter_wheat',
    targetItemName: 'Kış Buğdayı',
    quantity: 30,
    days: 7,
    moneyReward: 3500,
    itemReward: [
      { itemId: 'seed_garlic', quantity: 10 },
      { itemId: 'charcoal', quantity: 10 }
    ],
    seasons: ['winter'],
    npcId: 'chen_bo',
    tier: 4
  }
]

const TIER_LABELS = ['Kolay', 'Orta', 'Zor', 'Çok Zor']
const TIER_FRIENDSHIP = [5, 8, 12, 15]

/** Mevsim ve kademeye göre özel emir üretir */
export const generateSpecialOrder = (season: Season, tier: number): QuestInstance | null => {
  const clampedTier = Math.max(1, Math.min(4, tier))
  const valid = SPECIAL_ORDER_TEMPLATES.filter(
    t => t.tier === clampedTier && (t.seasons.length === 0 || t.seasons.includes(season))
  )
  if (valid.length === 0) return null

  const template = valid[Math.floor(Math.random() * valid.length)]!
  const npcDef = getNpcById(template.npcId)
  const npcName = npcDef?.name ?? template.npcId
  const tierLabel = TIER_LABELS[clampedTier - 1]

  questCounter++
  return {
    id: `special_${Date.now()}_${questCounter}`,
    type: 'special_order',
    npcId: template.npcId,
    npcName,
    tierLabel,
    description: `${npcName}, ${template.targetItemName} cinsinden ${template.quantity} adet istiyor.`,
    targetItemId: template.targetItemId,
    targetItemName: template.targetItemName,
    targetQuantity: template.quantity,
    collectedQuantity: 0,
    moneyReward: template.moneyReward,
    friendshipReward: TIER_FRIENDSHIP[clampedTier - 1]!,
    daysRemaining: template.days,
    accepted: false,
    itemReward: template.itemReward
  }
}

let questCounter = 0

/** İçinde bulunulan mevsime göre rastgele görev üretir */
export const generateQuest = (season: Season, _day: number): QuestInstance | null => {
  // Rastgele görev türü seç
  const typeIndex = Math.floor(Math.random() * QUEST_TEMPLATES.length)
  const template = QUEST_TEMPLATES[typeIndex]!

  // Mevsime göre hedefleri süz
  const validTargets = template.targets.filter(t => t.seasons.length === 0 || t.seasons.includes(season))
  if (validTargets.length === 0) return null

  // Rastgele hedef seç
  const target = validTargets[Math.floor(Math.random() * validTargets.length)]!

  // NPC havuzundan rastgele kişi seç
  const npcId = template.npcPool[Math.floor(Math.random() * template.npcPool.length)]!
  const npcDef = getNpcById(npcId)
  const npcName = npcDef?.name ?? npcId

  // Rastgele miktar
  const quantity = target.minQty + Math.floor(Math.random() * (target.maxQty - target.minQty + 1))

  // Ödül hesabı
  const moneyReward = Math.floor(target.unitPrice * quantity * template.rewardMultiplier)

  questCounter++
  const verb = QUEST_TYPE_VERBS[template.type]
  const description =
    template.type === 'delivery'
      ? `${npcName} ${quantity} adet ${target.name} istiyor, bunları ${npcName} adlı kişiye ${verb}.`
      : `${npcName} senden ${quantity} adet ${target.name} için görev istiyor: ${verb}.`

  return {
    id: `quest_${Date.now()}_${questCounter}`,
    type: template.type,
    npcId,
    npcName,
    description,
    targetItemId: target.itemId,
    targetItemName: target.name,
    targetQuantity: quantity,
    collectedQuantity: 0,
    moneyReward,
    friendshipReward: template.friendshipReward,
    daysRemaining: 2,
    accepted: false
  }
    }
