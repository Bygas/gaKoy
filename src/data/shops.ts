import type { Weather, Season, Weekday } from '@/types'
import { getWeekday } from './timeConstants'

/** Dükkân tanımı */
export interface ShopDef {
  id: string
  name: string
  description: string
  npcName: string
  closedDays: Weekday[]
  openHour: number
  closeHour: number
  closedWeathers: Weather[]
  closedSeasons: Season[]
}

/** gaKöy'deki altı dükkân */
export const SHOPS: ShopDef[] = [
  {
    id: 'wanwupu',
    name: 'Her Şey Dükkânı',
    description: 'Hasan Enişte’nin işlettiği dükkân; tohum ve gündelik eşya satar.',
    npcName: 'Hasan Enişte',
    closedDays: ['wed'],
    openHour: 8,
    closeHour: 20,
    closedWeathers: [],
    closedSeasons: []
  },
  {
    id: 'tiejiangpu',
    name: 'Demirci Ocağı',
    description: 'Ali Usta’nın ocağı; maden ve demir işleri satar.',
    npcName: 'Ali Usta',
    closedDays: ['sun'],
    openHour: 7,
    closeHour: 18,
    closedWeathers: [],
    closedSeasons: []
  },
  {
    id: 'biaoju',
    name: 'Yiğitler Ocağı',
    description: 'Baran’ın işlettiği ocak; silah ve dövüş levazımı satar.',
    npcName: 'Baran',
    closedDays: [],
    openHour: 10,
    closeHour: 22,
    closedWeathers: ['stormy'],
    closedSeasons: []
  },
  {
    id: 'yugupu',
    name: 'Olta Dükkânı',
    description: 'Aylin’in küçük dükkânı; yem ve şamandıra satar.',
    npcName: 'Aylin',
    closedDays: ['mon', 'tue'],
    openHour: 6,
    closeHour: 17,
    closedWeathers: ['stormy'],
    closedSeasons: []
  },
  {
    id: 'yaopu',
    name: 'Şifa Ocağı',
    description: 'Hekim Dede’nin dükkânı; gübre ve şifalı otlar satar.',
    npcName: 'Hekim Dede',
    closedDays: [],
    openHour: 8,
    closeHour: 20,
    closedWeathers: ['stormy'],
    closedSeasons: ['winter']
  },
  {
    id: 'chouduanzhuang',
    name: 'Kumaş Konağı',
    description: 'Suna’nın konağı; kumaş ve zarif armağanlar satar.',
    npcName: 'Suna',
    closedDays: ['sat', 'sun'],
    openHour: 9,
    closeHour: 18,
    closedWeathers: [],
    closedSeasons: []
  }
]

/** ID’ye göre dükkân bul */
export const getShopById = (id: string): ShopDef | undefined => {
  return SHOPS.find(s => s.id === id)
}

/** Dükkân açık mı kontrol et */
export const isShopAvailable = (
  shop: ShopDef,
  day: number,
  hour: number,
  weather: Weather,
  season: Season
): boolean => {
  const weekday = getWeekday(day)
  if (shop.closedDays.includes(weekday)) return false
  if (hour < shop.openHour || hour >= shop.closeHour) return false
  if (shop.closedWeathers.length > 0 && shop.closedWeathers.includes(weather)) return false
  if (shop.closedSeasons.length > 0 && shop.closedSeasons.includes(season)) return false
  return true
}

/** Dükkânın neden kapalı olduğunu getir */
export const getShopClosedReason = (
  shop: ShopDef,
  day: number,
  hour: number,
  weather: Weather,
  season: Season
): string => {
  const weekday = getWeekday(day)

  if (shop.closedSeasons.length > 0 && shop.closedSeasons.includes(season)) {
    return 'Bu mevsimde kapalı'
  }
  if (shop.closedWeathers.length > 0 && shop.closedWeathers.includes(weather)) {
    return 'Hava muhalefeti yüzünden kapalı'
  }
  if (shop.closedDays.includes(weekday)) {
    return 'Bugün kapalı'
  }
  if (hour < shop.openHour) {
    return `${shop.openHour}'de açılır`
  }
  if (hour >= shop.closeHour) {
    return 'Dükkân kapandı'
  }

  return ''
}
