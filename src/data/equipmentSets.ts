import type { EquipmentEffectType } from '@/types'

/** Takım bonusu kademesi */
export interface SetBonusLevel {
  count: 2 | 3 | 4
  effects: { type: EquipmentEffectType; value: number }[]
  description: string
}

/** Ekipman takımı tanımı */
export interface EquipmentSetDef {
  id: string
  name: string
  description: string
  pieces: {
    weapon?: string
    ring: string
    hat: string
    shoe: string
  }
  bonuses: SetBonusLevel[]
}

export const EQUIPMENT_SETS: EquipmentSetDef[] = [
  // === Erken dönem (dükkandan satın alınabilir) ===
  {
    id: 'miner_set',
    name: 'Madenci Takımı',
    description: 'Usta madencinin alışılmış donanımı',
    pieces: { ring: 'miners_ring', hat: 'miner_helmet', shoe: 'miner_boots' },
    bonuses: [
      { count: 2, effects: [{ type: 'ore_bonus', value: 1 }], description: 'Cevher kazancı +1' },
      { count: 3, effects: [{ type: 'mining_stamina', value: 0.1 }], description: 'Madencilik dayanıklılık tüketimi -%10' }
    ]
  },
  {
    id: 'fisher_set',
    name: 'Balıkçı Takımı',
    description: 'Tecrübeli balıkçının takım taklavatı',
    pieces: { ring: 'anglers_ring', hat: 'fisher_hat', shoe: 'fishing_waders' },
    bonuses: [
      { count: 2, effects: [{ type: 'fish_quality_bonus', value: 0.1 }], description: 'Balık kalitesi +%10' },
      { count: 3, effects: [{ type: 'fishing_calm', value: 0.1 }], description: 'Balık tutma dengesi +%10' }
    ]
  },

  // === Orta dönem (demirci dövmesiyle elde edilir) ===
  {
    id: 'merchant_set',
    name: 'Tacir Takımı',
    description: 'Kurnaz tüccarın iş görmüş kuşamı',
    pieces: { ring: 'merchants_ring', hat: 'merchant_hat', shoe: 'merchant_boots' },
    bonuses: [
      { count: 2, effects: [{ type: 'sell_price_bonus', value: 0.05 }], description: 'Satış fiyatı +%5' },
      { count: 3, effects: [{ type: 'shop_discount', value: 0.08 }], description: 'Dükkân indirimi +%8' }
    ]
  },
  {
    id: 'harvest_set',
    name: 'Bereket Takımı',
    description: 'Hasat mevsiminin çiftçi kuşamı',
    pieces: { ring: 'harvest_moon_ring', hat: 'jade_hairpin', shoe: 'silk_slippers' },
    bonuses: [
      { count: 2, effects: [{ type: 'crop_growth_bonus', value: 0.1 }], description: 'Mahsul büyümesi +%10' },
      { count: 3, effects: [{ type: 'crop_quality_bonus', value: 0.1 }], description: 'Mahsul kalitesi +%10' }
    ]
  },
  {
    id: 'dragon_warrior_set',
    name: 'Ejder Savaşçısı Takımı',
    description: 'Ejder adıyla anılan savaşçının zırhı',
    pieces: { ring: 'warlord_ring', hat: 'dragon_helm', shoe: 'dragon_scale_boots' },
    bonuses: [
      { count: 2, effects: [{ type: 'attack_bonus', value: 3 }], description: 'Saldırı gücü +3' },
      { count: 3, effects: [{ type: 'crit_rate_bonus', value: 0.1 }], description: 'Kritik vuruş oranı +%10' }
    ]
  },
  {
    id: 'obsidian_set',
    name: 'Obsidyen Takımı',
    description: 'Obsidyenden dövülmüş ağır zırh takımı',
    pieces: { ring: 'stalwart_ring', hat: 'obsidian_helm', shoe: 'obsidian_greaves' },
    bonuses: [
      { count: 2, effects: [{ type: 'max_hp_bonus', value: 20 }], description: 'Azami HP +20' },
      { count: 3, effects: [{ type: 'defense_bonus', value: 0.1 }], description: 'Savunma +%10' }
    ]
  },
  {
    id: 'phoenix_set',
    name: 'Anka Takımı',
    description: 'Anka gibi küllerinden doğanlara uğur getiren takım',
    pieces: { ring: 'fortune_ring', hat: 'phoenix_crown', shoe: 'phoenix_boots' },
    bonuses: [
      { count: 2, effects: [{ type: 'luck', value: 0.05 }], description: 'Talih +%5' },
      { count: 3, effects: [{ type: 'exp_bonus', value: 0.15 }], description: 'Tecrübe kazancı +%15' }
    ]
  },

  // === Geç dönem (BOSS / yaratık düşümü) ===
  {
    id: 'shadow_set',
    name: 'Gölge Takımı',
    description: 'Gölge içinde yürüyen suikastçının ekipmanı',
    pieces: { ring: 'shadow_ring', hat: 'shadow_mask', shoe: 'shadow_striders' },
    bonuses: [
      { count: 2, effects: [{ type: 'vampiric', value: 0.05 }], description: 'Can emme +%5' },
      { count: 3, effects: [{ type: 'monster_drop_bonus', value: 0.15 }], description: 'Düşüm oranı +%15' }
    ]
  },
  {
    id: 'frost_queen_set',
    name: 'Ayaz Hatunu Takımı',
    description: 'Ayaz kraliçesinden kalma yadigârlar',
    pieces: { ring: 'frost_queen_circlet', hat: 'frost_queen_tiara', shoe: 'frost_queen_slippers' },
    bonuses: [
      { count: 2, effects: [{ type: 'fishing_calm', value: 0.1 }], description: 'Balık tutma dengesi +%10' },
      { count: 3, effects: [{ type: 'monster_drop_bonus', value: 0.1 }], description: 'Düşüm oranı +%10' }
    ]
  },
  {
    id: 'dragon_king_set',
    name: 'Ejder Hanı Takımı',
    description: 'Dip ejder hükümdarının en yüce mirası',
    pieces: { ring: 'abyss_dragon_ring', hat: 'abyss_dragon_horns', shoe: 'abyss_dragon_treads' },
    bonuses: [
      { count: 2, effects: [{ type: 'attack_bonus', value: 5 }], description: 'Saldırı gücü +5' },
      {
        count: 3,
        effects: [
          { type: 'vampiric', value: 0.08 },
          { type: 'defense_bonus', value: 0.08 }
        ],
        description: 'Can emme +%8, savunma +%8'
      }
    ]
  },

  // === Lonca'ya özel ===
  {
    id: 'guild_champion_set',
    name: 'Lonca Yiğidi Takımı',
    description: 'Serüvenciler loncasının seçkin savaşçısına özgü takım',
    pieces: { weapon: 'guild_war_blade', ring: 'guild_war_ring', hat: 'guild_war_helm', shoe: 'guild_war_boots' },
    bonuses: [
      { count: 2, effects: [{ type: 'attack_bonus', value: 3 }], description: 'Saldırı gücü +3' },
      {
        count: 3,
        effects: [
          { type: 'defense_bonus', value: 0.08 },
          { type: 'max_hp_bonus', value: 20 }
        ],
        description: 'Savunma +%8, HP +20'
      },
      {
        count: 4,
        effects: [
          { type: 'vampiric', value: 0.08 },
          { type: 'crit_rate_bonus', value: 0.05 }
        ],
        description: 'Can emme +%8, kritik vuruş oranı +%5'
      }
    ]
  }
]

/** Ekipman kimliğine göre bağlı olduğu takımı bulur */
export const getSetByPieceId = (defId: string): EquipmentSetDef | undefined => {
  return EQUIPMENT_SETS.find(
    s => s.pieces.weapon === defId || s.pieces.ring === defId || s.pieces.hat === defId || s.pieces.shoe === defId
  )
}
