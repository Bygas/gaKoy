import type { WildTreeDef } from '@/types'

/** Yabani ağaç tanımları */
export const WILD_TREE_DEFS: WildTreeDef[] = [
  {
    type: 'pine',
    name: 'Çam Ağacı',
    seedItemId: 'pine_cone',
    growthDays: 21,
    tapProduct: 'pine_resin',
    tapCycleDays: 5,
    tapProductName: 'Çam Reçinesi'
  },
  {
    type: 'camphor',
    name: 'Kafur Ağacı',
    seedItemId: 'camphor_seed',
    growthDays: 28,
    tapProduct: 'camphor_oil',
    tapCycleDays: 7,
    tapProductName: 'Kafur Yağı'
  },
  {
    type: 'mulberry',
    name: 'Dut Ağacı',
    seedItemId: 'mulberry',
    growthDays: 14,
    tapProduct: 'silk',
    tapCycleDays: 4,
    tapProductName: 'İpek'
  }
]

/** En fazla yabani ağaç sayısı */
export const MAX_WILD_TREES = 6

export const getWildTreeDef = (type: string): WildTreeDef | undefined => {
  return WILD_TREE_DEFS.find(d => d.type === type)
}
