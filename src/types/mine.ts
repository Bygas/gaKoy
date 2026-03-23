
import type { MonsterDef, MineFloorDef } from './skill'

/** Maden karo türü */
export type MineTileType = 'empty' | 'ore' | 'monster' | 'stairs' | 'trap' | 'treasure' | 'mushroom' | 'boss'

/** Maden karo durumu */
export type MineTileState = 'hidden' | 'revealed' | 'collected' | 'defeated' | 'triggered'

/** Karo ek verisi */
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

/** Tek bir karo */
export interface MineTile {
  index: number // 0-35
  type: MineTileType
  state: MineTileState
  data?: MineTileData
}

/** Kat karo dağılımı yapılandırması */
export interface FloorTileDistribution {
  oreCount: [number, number]
  monsterCount: [number, number]
  trapCount: [number, number]
  treasureCount?: [number, number]
  mushroomCount?: [number, number]
  bossCount?: [number, number]
  /** Merdiven tüm alan temizlenmeden kullanılamaz mı (istila/BOSS katları) */
  stairsHiddenUntilClear?: boolean
}

/** Izgara sabitleri */
export const GRID_SIZE = 6
export const GRID_TOTAL = 36
export const MIN_STAIRS_DISTANCE = 3

/** Özel kat türü */
export type FloorSpecialType = MineFloorDef['specialType']  /** 楼梯是否需要全清才可使用（感染/BOSS层） */
  stairsHiddenUntilClear?: boolean
}

/** 网格常量 */
export const GRID_SIZE = 6
export const GRID_TOTAL = 36
export const MIN_STAIRS_DISTANCE = 3

/** 特殊层类型 */
export type FloorSpecialType = MineFloorDef['specialType']
