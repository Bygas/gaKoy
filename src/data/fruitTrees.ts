import type { FruitTreeDef } from '@/types'

/** Meyve ağacı tanımları */
export const FRUIT_TREE_DEFS: FruitTreeDef[] = [
  {
    type: 'peach_tree',
    name: 'Şeftali Ağacı',
    saplingId: 'sapling_peach',
    saplingPrice: 300,
    fruitId: 'tree_peach',
    fruitName: 'Taze Şeftali',
    fruitSeason: 'spring',
    growthDays: 28,
    fruitSellPrice: 60
  },
  {
    type: 'lychee_tree',
    name: 'Liçi Ağacı',
    saplingId: 'sapling_lychee',
    saplingPrice: 400,
    fruitId: 'lychee',
    fruitName: 'Liçi',
    fruitSeason: 'summer',
    growthDays: 28,
    fruitSellPrice: 80
  },
  {
    type: 'mandarin_tree',
    name: 'Mandalina Ağacı',
    saplingId: 'sapling_mandarin',
    saplingPrice: 350,
    fruitId: 'mandarin',
    fruitName: 'Mandalina',
    fruitSeason: 'autumn',
    growthDays: 28,
    fruitSellPrice: 70
  },
  {
    type: 'plum_tree',
    name: 'Erik Ağacı',
    saplingId: 'sapling_plum',
    saplingPrice: 500,
    fruitId: 'plum_blossom',
    fruitName: 'Erik Çiçeği',
    fruitSeason: 'winter',
    growthDays: 28,
    fruitSellPrice: 100
  },
  {
    type: 'apricot_tree',
    name: 'Kayısı Ağacı',
    saplingId: 'sapling_apricot',
    saplingPrice: 350,
    fruitId: 'apricot',
    fruitName: 'Kayısı',
    fruitSeason: 'spring',
    growthDays: 28,
    fruitSellPrice: 55
  },
  {
    type: 'pomegranate_tree',
    name: 'Nar Ağacı',
    saplingId: 'sapling_pomegranate',
    saplingPrice: 500,
    fruitId: 'pomegranate',
    fruitName: 'Nar',
    fruitSeason: 'summer',
    growthDays: 28,
    fruitSellPrice: 95
  },
  {
    type: 'persimmon_tree',
    name: 'Hurma Ağacı',
    saplingId: 'sapling_persimmon',
    saplingPrice: 400,
    fruitId: 'persimmon',
    fruitName: 'Taze Hurma',
    fruitSeason: 'autumn',
    growthDays: 28,
    fruitSellPrice: 85
  },
  {
    type: 'hawthorn_tree',
    name: 'Alıç Ağacı',
    saplingId: 'sapling_hawthorn',
    saplingPrice: 350,
    fruitId: 'hawthorn',
    fruitName: 'Alıç',
    fruitSeason: 'winter',
    growthDays: 28,
    fruitSellPrice: 65
  }
]

/** En fazla meyve ağacı sayısı */
export const MAX_FRUIT_TREES = 8

export const getFruitTreeDef = (type: string): FruitTreeDef | undefined => {
  return FRUIT_TREE_DEFS.find(d => d.type === type)
}
