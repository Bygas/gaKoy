/** Eşya kategorisi */
export type ItemCategory =
  | 'seed'
  | 'crop'
  | 'fish'
  | 'ore'
  | 'gem'
  | 'gift'
  | 'food'
  | 'material'
  | 'misc'
  | 'processed'
  | 'machine'
  | 'sprinkler'
  | 'fertilizer'
  | 'animal_product'
  | 'sapling'
  | 'fruit'
  | 'bait'
  | 'tackle'
  | 'bomb'
  | 'fossil'
  | 'artifact'
  | 'weapon'
  | 'ring'
  | 'hat'
  | 'shoe'

/** Eşya kalitesi */
export type Quality = 'normal' | 'fine' | 'excellent' | 'supreme'

/** Eşya temel tanımı (veri yapılandırması için) */
export interface ItemDef {
  id: string
  name: string
  category: ItemCategory
  description: string
  sellPrice: number
  /** Yenilebilir mi */
  edible: boolean
  /** Yenildiğinde sağlanan dayanıklılık */
  staminaRestore?: number
  /** Yenildiğinde sağlanan can */
  healthRestore?: number
}

/** Envanterdeki eşya örneği */
export interface InventoryItem {
  itemId: string
  quantity: number
  quality: Quality
  locked?: boolean
}

/** Alet seviyesi */
export type ToolTier = 'basic' | 'iron' | 'steel' | 'iridium'

/** Alet türü */
export type ToolType = 'wateringCan' | 'hoe' | 'pickaxe' | 'fishingRod' | 'scythe' | 'axe' | 'pan'

/** Alet örneği */
export interface Tool {
  type: ToolType
  tier: ToolTier
}

/** Silah türü */
export type WeaponType = 'sword' | 'dagger' | 'club'

/** Silah tanımı */
export interface WeaponDef {
  id: string
  name: string
  type: WeaponType
  attack: number
  critRate: number
  description: string
  /** Dükkân fiyatı (null = satın alınamaz) */
  shopPrice: number | null
  /** Satın almak için gereken malzemeler */
  shopMaterials: { itemId: string; quantity: number }[]
  /** Sabit büyü (BOSS silahları) */
  fixedEnchantment: string | null
}

/** Büyü tanımı */
export interface EnchantmentDef {
  id: string
  name: string
  description: string
  attackBonus: number
  critBonus: number
  special: 'vampiric' | 'sturdy' | 'lucky' | null
}

/** Sahip olunan silah örneği */
export interface OwnedWeapon {
  defId: string
  enchantmentId: string | null
}

/** Sandık seviyesi */
export type ChestTier = 'wood' | 'copper' | 'iron' | 'gold' | 'void'

/** Boşluk sandığı rolü */
export type VoidChestRole = 'none' | 'input' | 'output'

/** Sandık örneği */
export interface Chest {
  id: string
  tier: ChestTier
  label: string
  items: InventoryItem[]
  voidRole: VoidChestRole
  }
