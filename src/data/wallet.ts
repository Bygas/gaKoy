import type { WalletItemDef } from '@/types'

/** Para kesesi eşya tanımları */
export const WALLET_ITEMS: WalletItemDef[] = [
  {
    id: 'merchant_seal',
    name: 'Tüccar Mührü',
    description: 'Dükkândaki alışveriş fiyatları %10 düşer.',
    effect: { type: 'shopDiscount', value: 0.1 },
    unlockCondition: 'Toplam 10000 akçe kazan'
  },
  {
    id: 'herb_guide',
    name: 'Şifalı Ot Defteri',
    description: 'Toplanan kır ürünlerinin niteliği 1 kademe artar.',
    effect: { type: 'forageQuality', value: 1 },
    unlockCondition: 'Toplayıcılık seviyesi 8 olsun'
  },
  {
    id: 'miners_charm',
    name: 'Madenci Muskası',
    description: 'Madencilikte direnç tüketimi %15 azalır.',
    effect: { type: 'miningStamina', value: 0.15 },
    unlockCondition: 'Madende 50. kata ulaş'
  },
  {
    id: 'anglers_token',
    name: 'Balıkçı Nişanı',
    description: 'Balık tutma mini oyununda balığın hareket hızı %10 azalır.',
    effect: { type: 'fishingCalm', value: 0.1 },
    unlockCondition: '30 farklı balık türü yakala'
  },
  {
    id: 'chefs_hat',
    name: 'Aşçı Külahı',
    description: 'Pişirilen yemeklerin iyileştirme miktarı %25 artar.',
    effect: { type: 'cookingRestore', value: 0.25 },
    unlockCondition: '10 farklı yemek tarifi pişir'
  },
  {
    id: 'earth_totem',
    name: 'Toprak Tılsımı',
    description: 'Ürünlerin büyüme hızı %10 artar.',
    effect: { type: 'cropGrowth', value: 0.1 },
    unlockCondition: '100 kez ürün hasat et'
  }
]

export const getWalletItemById = (id: string): WalletItemDef | undefined => {
  return WALLET_ITEMS.find(w => w.id === id)
}
