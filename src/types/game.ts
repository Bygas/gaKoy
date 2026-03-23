/** Mevsim */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

/** Hava durumu */
export type Weather = 'sunny' | 'rainy' | 'stormy' | 'snowy' | 'windy' | 'green_rain'

/** Haftanın günü */
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

/** Günün vakti */
export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night' | 'late_night'

/** Mekân grubu */
export type LocationGroup = 'farm' | 'village_area' | 'nature' | 'mine' | 'hanhai'

/** Oyun zamanı durumu */
export interface GameTime {
  year: number
  season: Season
  day: number // 1-28
  hour: number // 6-26 (6=06:00, 24=gece yarısı, 26=02:00)
  weather: Weather
}

/** Mekân / konum */
export type Location = 'farm' | 'village' | 'shop' | 'bamboo_forest' | 'creek' | 'mine' | 'home'

/** Çiftlik haritası türü */
export type FarmMapType = 'standard' | 'riverland' | 'forest' | 'hilltop' | 'wilderness' | 'meadowlands'

/** Cinsiyet */
export type Gender = 'male' | 'female'
