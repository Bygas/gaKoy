import type { Weather } from '@/types'

/** Toplanabilir eşya tanımı */
export interface ForageItemDef {
  itemId: string
  name: string
  season: ('spring' | 'summer' | 'autumn' | 'winter')[]
  chance: number // Çıkma ihtimali 0-1
  expReward: number
}

/** Havanın toplama ihtimaline etkisi */
export const WEATHER_FORAGE_MODIFIER: Record<Weather, number> = {
  sunny: 1.0,
  rainy: 1.15,
  stormy: 0.8,
  snowy: 0.9,
  windy: 1.1,
  green_rain: 1.5
}

/** Korulukta toplanabilen eşyalar */
export const FORAGE_ITEMS: ForageItemDef[] = [
  { itemId: 'bamboo', name: 'Kamış', season: ['spring', 'summer', 'autumn'], chance: 0.5, expReward: 3 },
  { itemId: 'wood', name: 'Odun', season: ['spring', 'summer', 'autumn', 'winter'], chance: 0.6, expReward: 2 },
  { itemId: 'herb', name: 'Şifalı Ot', season: ['spring', 'summer', 'autumn'], chance: 0.3, expReward: 5 },
  { itemId: 'firewood', name: 'Çıra', season: ['spring', 'summer', 'autumn', 'winter'], chance: 0.7, expReward: 1 },
  { itemId: 'winter_bamboo_shoot', name: 'Kış Sürgünü', season: ['winter'], chance: 0.35, expReward: 8 },
  { itemId: 'wintersweet', name: 'Kış Çiçeği', season: ['winter'], chance: 0.2, expReward: 10 },
  { itemId: 'wild_mushroom', name: 'Yabani Mantar', season: ['autumn'], chance: 0.35, expReward: 6 },
  { itemId: 'ginseng', name: 'Adamotu', season: ['autumn', 'winter'], chance: 0.1, expReward: 15 },
  { itemId: 'wild_berry', name: 'Dağ Yemişi', season: ['summer'], chance: 0.4, expReward: 4 },
  { itemId: 'pine_cone', name: 'Çam Kozalağı', season: ['autumn', 'winter'], chance: 0.3, expReward: 5 },
  { itemId: 'camphor_seed', name: 'Ağaç Tohumu', season: ['spring', 'summer'], chance: 0.15, expReward: 5 },
  { itemId: 'mulberry', name: 'Dut', season: ['summer', 'autumn'], chance: 0.2, expReward: 4 },

  // ===== Nadir toplanabilirler (müze fosilleri / eski eserler) =====
  { itemId: 'ancient_pottery', name: 'Kadim Çömlek Parçası', season: ['spring', 'summer', 'autumn', 'winter'], chance: 0.03, expReward: 12 },
  { itemId: 'bamboo_scroll', name: 'Kil Tablet', season: ['spring', 'summer', 'autumn'], chance: 0.03, expReward: 12 },
  { itemId: 'stone_axe_head', name: 'Taş Balta Ağzı', season: ['spring', 'summer', 'autumn', 'winter'], chance: 0.04, expReward: 10 },
  { itemId: 'fern_fossil', name: 'Eğrelti Fosili', season: ['spring', 'summer', 'autumn'], chance: 0.03, expReward: 12 },
  { itemId: 'petrified_wood', name: 'Taşlaşmış Odun', season: ['autumn', 'winter'], chance: 0.04, expReward: 10 }
]

/** Mevcut mevsimde toplanabilen eşyaları getirir */
export const getForageItems = (season: string): ForageItemDef[] => {
  return FORAGE_ITEMS.filter(f => f.season.includes(season as any))
}
