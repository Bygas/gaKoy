/** Sabah ipucu tanımı */
export interface MorningTipDef {
  id: string
  priority: number
  conditionKey: string
  message: string
}

/**
 * 18 adet sabah ipucu, önceliğe göre sıralanmıştır.
 * conditionKey, useEndDay içindeki sabah ipucu mantığında gerçek kontrol fonksiyonuna karşılık gelir.
 */
export const MORNING_TIPS: MorningTipDef[] = [
  {
    id: 'tip_welcome',
    priority: 1,
    conditionKey: 'earlyFirstDay',
    message: 'GaKöy Muhtarı der ki: "GaKöy’e hoş geldin! Heybende lahana tohumları var. Tarlaya git, toprağı sür ve ekimini yap."'
  },
  {
    id: 'tip_first_till',
    priority: 2,
    conditionKey: 'allWasteland',
    message: 'GaKöy Muhtarı der ki: "Toprak sürülmeden ürün yetişmez. Tarla kısmında “Toplu İşlem” → “Toplu Sürme”yi dene."'
  },
  {
    id: 'tip_first_plant',
    priority: 3,
    conditionKey: 'tilledNoPlanted',
    message: 'GaKöy Muhtarı der ki: "Toprağı sürdün, şimdi ekim vakti. “Toplu Ekim” ile birden fazla tohumu kolayca ekebilirsin."'
  },
  {
    id: 'tip_first_water',
    priority: 4,
    conditionKey: 'plantedUnwatered',
    message: 'GaKöy Muhtarı der ki: "Tohum ektikten sonra sulamayı unutma. Susuz mahsul büyümez. “Toplu Sulama”yı dene."'
  },
  {
    id: 'tip_first_harvest',
    priority: 5,
    conditionKey: 'hasHarvestable',
    message: 'GaKöy Muhtarı der ki: "Mahsul olgunlaştı! Tarlaya git ve hasadını yap. Altın renkli alanlar hazır demektir."'
  },
  {
    id: 'tip_sell_crops',
    priority: 6,
    conditionKey: 'harvestedNeverSold',
    message: 'GaKöy Muhtarı der ki: "Topladığın mahsulleri çıkış sandığına koy. Ertesi gün akçeye dönüşür."'
  },
  {
    id: 'tip_check_weather',
    priority: 7,
    conditionKey: 'earlyGame',
    message: 'GaKöy Muhtarı der ki: "Her sabah havaya bak. İşini önceden planlarsan daha bereketli olur."'
  },
  {
    id: 'tip_stamina',
    priority: 8,
    conditionKey: 'staminaWasLow',
    message: 'GaKöy Muhtarı der ki: "Gücün tükenirse erken dinlen. Geceyi zorlamak ertesi günü etkiler. Yemek de kuvvet verir."'
  },
  {
    id: 'tip_visit_shop',
    priority: 9,
    conditionKey: 'neverVisitedShop',
    message: 'GaKöy Muhtarı der ki: "Çarşıda türlü tohum ve araç bulunur. Fırsat bulunca uğra."'
  },
  {
    id: 'tip_try_fishing',
    priority: 10,
    conditionKey: 'neverFished',
    message: 'GaKöy Muhtarı der ki: "GaKöy’ün doğusundaki dere balıkla doludur. Olta al, nasibini ara."'
  },
  {
    id: 'tip_try_mining',
    priority: 11,
    conditionKey: 'neverMined',
    message: 'GaKöy Muhtarı der ki: "Kuzeydeki madenlerde cevher ve hazine bulunur. Lakin yaratıklar da vardır, dikkatli ol."'
  },
  {
    id: 'tip_talk_npc',
    priority: 12,
    conditionKey: 'neverTalkedNpc',
    message: 'GaKöy Muhtarı der ki: "Köylülerle sohbet et, hediye ver. Gönül bağları böyle kuvvetlenir."'
  },
  {
    id: 'tip_quest_board',
    priority: 13,
    conditionKey: 'neverCheckedQuests',
    message: 'GaKöy Muhtarı der ki: "İlan tahtasında köylülerin işleri var. Yardım edersen hem akçe hem itibar kazanırsın."'
  },
  {
    id: 'tip_try_cooking',
    priority: 14,
    conditionKey: 'neverCooked',
    message: 'GaKöy Muhtarı der ki: "Tarif öğrendiysen yemek pişir. Yemek kuvvet verir. Ocağı dene."'
  },
  {
    id: 'tip_rain',
    priority: 15,
    conditionKey: 'firstRainyDay',
    message: 'GaKöy Muhtarı der ki: "Yağmurda toprak kendi sulanır. Bugün başka işlere vakit ayırabilirsin."'
  },
  {
    id: 'tip_season_change',
    priority: 16,
    conditionKey: 'justChangedSeason',
    message: 'GaKöy Muhtarı der ki: "Mevsim döndü. Her mevsimin mahsulü ayrıdır. Çarşıdan yeni tohumlara bak."'
  },
  {
    id: 'tip_sprinkler',
    priority: 17,
    conditionKey: 'hasCropNoSprinkler',
    message: 'GaKöy Muhtarı der ki: "Tarla büyüdükçe sulama zorlaşır. Zanaatkâr ya da demirciden sulama düzeneği yapabilirsin."'
  },
  {
    id: 'tip_try_animal',
    priority: 18,
    conditionKey: 'neverHadAnimal',
    message: 'GaKöy Muhtarı der ki: "Tavuk, koyun, inek beslemek de bereket getirir. Önce bir kümes ya da ahır kur."'
  }
]
