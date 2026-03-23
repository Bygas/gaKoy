/** Müze eşya türleri */
export type MuseumCategory = 'ore' | 'gem' | 'bar' | 'fossil' | 'artifact' | 'spirit'

/** Müzeye bağışlanabilir eşya tanımı */
export interface MuseumItemDef {
  id: string
  name: string
  category: MuseumCategory
  /** Kaynak ipucu (henüz elde edilmediyse gösterilir) */
  sourceHint: string
}

/** Müze kilometre taşı ödülleri */
export interface MuseumMilestone {
  count: number
  name: string
  reward: {
    money?: number
    items?: { itemId: string; quantity: number }[]
  }
}
