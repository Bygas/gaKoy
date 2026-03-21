import type { FarmMapType } from '@/types'

export interface FarmMapDef {
  type: FarmMapType
  name: string
  description: string
  bonus: string
}

export const FARM_MAP_DEFS: FarmMapDef[] = [
  { type: 'standard', name: 'gaKöy Ovası Çiftliği', description: 'Engin düzlükler üzerine kurulu; geniş çaplı ekim için en elverişli yerdir.', bonus: 'Başlangıç tarlası 6×6, mevsim değişince toprak kendiliğinden gübrelenir' },
  { type: 'riverland', name: 'Irmakyolu Çiftliği', description: 'Küçük akarsularla çevrili verimli topraklar; su nimetleri boldur.', bonus: 'Balıkçılık tecrübesi +25%, balık satış değeri +10%, her gün dere avı, yağmurlu havada balık kalitesi artar' },
  { type: 'forest', name: 'Bambuluk Çiftliği', description: 'Koruluk içindeki açıklık; türlü yabani nimet burada bulunur.', bonus: 'Toplayıcılık tecrübesi +25%, %20 çift toplama, her gün korudan ek ganimet' },
  { type: 'hilltop', name: 'Yamaçsekisi Çiftliği', description: 'Dağ eteğine kurulu sekili tarlalar; toprağın bağrında maden damarları saklıdır.', bonus: 'Madencilik tecrübesi +25%, cevher +1, çiftlik yüzeyinde maden damarı' },
  { type: 'wilderness', name: 'Issızkır Çiftliği', description: 'Uzak ve tenha arazi; geceleri yabani yaratıklar dolaşır.', bonus: 'Savaş tecrübesi +50%, her gün cevher kazanımı, geceleyin yabanî yaratık karşılaşmaları' },
  { type: 'meadowlands', name: 'Çayırlık Çiftliği', description: 'Açık otlaklar ve geniş mera; hayvan beslemek için biçilmiş kaftandır.', bonus: 'Başlangıçta kümes +2 tavuk, yakınlık +50%, hayvanlar hastalanmaz, ek üretim sağlar' }
]
