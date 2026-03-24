import type { MonsterDef, MineFloorDef } from './skill'

/** Hücre türü */
export type MineTileType =
  | 'empty'
  | 'ore'
  | 'monster'
  | 'stairs'
  | 'trap'
  | 'treasure'
  | 'mushroom'
  | 'boss'

/** Hücre durumu */
export type MineTileState =
  | 'hidden'
  | 'revealed'
  | 'collected'
  | 'defeated'
  | 'triggered'

/** Hücre ek verisi */
export interface MineTileData {
  oreId?: string
  oreQuantity?: number
  monster?: MonsterDef
  isBoss?: boolean
  trapDamage?: number
  treasureItems?: { itemId: string; quantity: number }[]
  treasureMoney?: number
  mushroomItems?: { itemId: string; quantity: number }[]
}

/** Tek bir hücre */
export interface MineTile {
  index: number // 0-35
  type: MineTileType
  state: MineTileState
  data?: MineTileData
}

/** Kat hücre dağılımı yapılandırması */
export interface FloorTileDistribution {
  oreCount: [number, number]
  monsterCount: [number, number]
  trapCount: [number, number]
  treasureCount?: [number, number]
  mushroomCount?: [number, number]
  bossCount?: [number, number]
  /** Merdiven ancak tüm hücreler temizlenince kullanılabilir mi (enfekte/BOSS katları) */
  stairsHiddenUntilClear?: boolean
}

/** Izgara sabitleri */
export const GRID_SIZE = 6
export const GRID_TOTAL = 36
export const MIN_STAIRS_DISTANCE = 3

/** Özel kat türü */
export type FloorSpecialType = MineFloorDef['specialType']
