import type { Weather } from '@/types'

/** Balıkçı Dede - Hava durumu sözleri */
export const WEATHER_TIPS: Record<Weather, string> = {
  sunny: 'Yarın gök açık, hava duru olur. Dışarı işi olan için pek uygundur.',
  rainy: 'Yarın yağmur var, şemsiyeni unutma... Ama balık da böyle havada oltaya gönüllü gelir.',
  stormy: 'Yarın gök gürler, yağmur sert iner. En iyisi evde dinlenmektir.',
  snowy: 'Yarın kar beklenir, sıkı giyin. Irmak kıyısı yer yer buz tutabilir.',
  windy: 'Yarın rüzgâr esecek, serdiğin ne varsa toplamayı unutma.',
  green_rain: 'İhtiyar gönlüm der ki... yarın alışılmadık bir hâl var.'
}

/** Hoca Efendi - Talih sözleri eşikleri */
export const FORTUNE_TIERS: { min: number; message: string }[] = [
  { min: 0.07, message: 'Kutlu bir gün doğmuş, bugün bahtın açıktır! Her iş elverir.' },
  { min: 0.03, message: 'Bugün talihin iyidir, dışarıdaki işlerini gönül rahatlığıyla görebilirsin.' },
  { min: -0.03, message: 'Bugün talih ne iyi ne kötü; işini olağan düzenince sürdür.' },
  { min: -0.07, message: 'Bugün bahtın biraz kapalı, elini attığın işte dikkatli ol.' },
  { min: -Infinity, message: 'Bugün uğurlu görünmüyor, evde dinlenmen daha hayırlıdır.' }
]

/** dailyLuck değerine göre talih sözü getir */
export const getFortuneTip = (luck: number): string => {
  for (const tier of FORTUNE_TIERS) {
    if (luck >= tier.min) return tier.message
  }
  return FORTUNE_TIERS[FORTUNE_TIERS.length - 1]!.message
}

/** Muhtar Mehmet - Hayat öğütleri (25 söz döngüyle gelir) */
export const LIVING_TIPS: string[] = [
  'İlkbahar, patates ile lahanayı toprağa vermek için pek iyi vakittir; erken eken erken biçer.',
  'Ürüne gübre verirsen kalitesi artar, kalite arttıkça pazardaki değeri de yükselir.',
  'Yağmurlu günde sulama gerekmez, elin başka işe kalır.',
  'Bambu koruluğunda filiz en çok ilkbaharda bulunur, toplamayı unutma.',
  'Balık tutarken vakte dikkat et; her balığın suya geldiği saat başkadır.',
  'Madenin dibi daha tehlikelidir, yanına yeterince yiyecek ve deva al.',
  'Hediye vermek köylüyle gönül bağını kuvvetlendirir; herkesin sevdiği başkadır.',
  'Aletlerini geliştirmek işini hızlandırır, ustaların dükkânına uğramayı unutma.',
  'Yazın şeftaliyle karpuz iyi para eder, geniş ekim için değerlidir.',
  'Sulama düzeneği kurarsan tarlan kendi kendine su alır, sana da zaman kalır.',
  'Güz mevsiminde uzun ömürlü ürünler ekmek kazancı daha dengeli kılar.',
  'Kışın tarla sessizdir ama maden daha bereketli olur.',
  'Köylüyle bol bol konuş; gönül bağı arttıkça yeni yemek usulleri öğrenirsin.',
  'Müzeye bağış yapmak dönüm noktası ödülleri kazandırır; fosil ve eski eşyaları toplamayı ihmal etme.',
  'Loncanın av görevleri cömert ödül verir, fırsat buldukça yap.',
  'Yem ile şamandıra, balıkçılıkta hem verimi hem kaliteyi artırır.',
  'İşleme tezgâhları ham malı daha değerli ürüne dönüştürür.',
  'Bayram günlerinde özel ödüller olur, gaKöy’de hiçbir şenliği kaçırma.',
  'Bomba ile bir kerede geniş damar açılır, madende çok işe yarar.',
  'Madene inmeden önce yüzüklerini kuşan; verdiği kudret az değildir.',
  'Kaliteli ürünlerden daha iyi yemek çıkar.',
  'Evcil hayvanla uzun vakit geçirirsen ummadığın güzellikler doğar.',
  'Şeftali çiçeği koruluğunun derinlerinde nadir toplanır şeyler saklı derler.',
  'Çiftliğini özenle işlet; gaKöy’de herkes çalışana göz ucuyla bakar.',
  'Gizli notlarda bu yörenin saklı sırları yatar, dikkatli olan çok şey görür.'
]

/** Günün hayat öğüdünü getir */
export const getLivingTip = (day: number, year: number): string => {
  const index = ((year - 1) * 112 + day - 1) % LIVING_TIPS.length
  return LIVING_TIPS[index]!
}

/** Fatma Teyze - Yemek tarifi öneri sözü */
export const getRecipeTipMessage = (recipeName: string, ingredientNames: string[]): string => {
  return `Bugün sana ${recipeName} yapmayı öğreteyim; bunun için ${ingredientNames.join('、')} gerekir.`
}

/** Fatma Teyze - Önerilecek tarif yoksa genel söz */
export const NO_RECIPE_TIP = 'Yemek yapmayı öğren evladım; önünde daha uzun bir ömür var.'

/** Günlük öğüt veren NPC kimlikleri */
export const TIP_NPC_IDS = ['li_yu', 'zhou_xiucai', 'wang_dashen', 'liu_cunzhang'] as const

/** NPC öğüt türü */
export type TipNpcId = (typeof TIP_NPC_IDS)[number]

/** NPC öğüt etiketleri */
export const TIP_NPC_LABELS: Record<TipNpcId, string> = {
  li_yu: 'Hava Durumu',
  zhou_xiucai: 'Günün Talihi',
  wang_dashen: 'Yemek Tarifi',
  liu_cunzhang: 'Hayat Öğüdü'
}
