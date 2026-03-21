// === Sabah Rastlantı Olayları Verisi ===
// Tasarım anlayışı: bir sistem bildirisi değil, "sabahın kısa bir anlatısı"

/** Etki türleri */
export type MorningEffect =
  | { type: 'loseCrop' }
  | { type: 'gainItem'; itemId: string; qty: number }
  | { type: 'gainMoney'; amount: number }
  | { type: 'gainFriendship'; amount: number }

/** Hırsız / hayvan anlatıları (%4) */
export interface MorningNarration {
  message: string
  effect?: MorningEffect
}

/** Seçenekli olaylar (%0,8) */
export interface MorningChoiceEvent {
  id: string
  message: string
  choices: {
    label: string
    result: string
    effect?: MorningEffect
  }[]
}

/** Sürpriz anlatılar (%0,2) */
export interface MorningEasterEgg {
  message: string
  effect?: MorningEffect
}

// ==================== %4 Hırsız / hayvan anlatıları (25 adet) ====================

export const MORNING_NARRATIONS: MorningNarration[] = [
  // —— Küçük kayıp var ——
  { message: 'Tarladaki sebzelerden biri bir ağız kemirilmiş; yanında da minik pençe izleri kalmış.', effect: { type: 'loseCrop' } },
  { message: 'Bir kara karga daha yeni olgunlaşmış bir meyveyi kapıp götürmüş; dal üstünde iki kez ötüp hava atmış.', effect: { type: 'loseCrop' } },
  { message: 'Tarlada bir ekin kökünden sökülüp yana atılmış. Bunu ancak bir yaban domuzu yapmış olabilir.', effect: { type: 'loseCrop' } },
  { message: 'Köşedeki bir fide kim bilir kimin ayağı altında kırılmış; toprakta toynak izi duruyor.', effect: { type: 'loseCrop' } },

  // —— Küçük kazanç var ——
  { message: 'Birileri ot demetinden biraz almış gibi, ama kapının önüne üç bakır sikke bırakmış.', effect: { type: 'gainMoney', amount: 3 } },
  { message: 'Çitin dışında ottan örülmüş küçük bir sepet duruyor; içinde birkaç şifalı ot var. Kimin bıraktığı bilinmiyor.', effect: { type: 'gainItem', itemId: 'herb', qty: 1 } },
  { message: 'Evin arkasındaki odun yığınının yanında ufak bir bambu demeti belirmiş; muntazam bağlanmış. Herhâlde iyi yürekli bir oduncunun işi.', effect: { type: 'gainItem', itemId: 'bamboo', qty: 2 } },

  // —— Sadece anlatı ——
  { message: 'Çitin üstüne birkaç tavşan tüyü takılmış; gece vakti davetsiz misafir uğramış olmalı.' },
  { message: 'Bir yabani kedi tarla setinde kestiriyor; belli ki geceyi orada geçirmiş.' },
  { message: 'Sebze bahçesinin kıyısında sincapların sakladığı ceviz kabukları bulunmuş. Görünüşe bakılırsa çiftliğini seviyorlar.' },
  { message: 'Şafakta dışarı çıkınca, tarladan çitin ötesine uzanan bir sıra minik ayak izi gördün.' },
  { message: 'Bir kirpi gübre yığınının dibine yuva kurmuş; yeni evinden pek memnun görünüyor.' },
  { message: 'Tarla kıyısındaki korkuluk yana eğilmiş; sanki gece bir şey çarpıp geçmiş. Belki dağ geyiğidir.' },
  { message: 'Kuyunun yanında birkaç dağınık tüy bulundu; anlaşılan yabani tavuklar su içmeye uğramış.' },
  { message: 'Damın üstünde bir baykuş çömelmiş, başını yana yatırıp seni süzüyor. Sen kıpırdayınca da sessizce uçup gidiyor.' },
  { message: 'Tarla tümseğinin kıyısında küçük bir oyuk açılmış; tarla faresinin kazdığına benziyor. Neyse ki ekinlere değmemiş.' },
  { message: 'Sabah sisi çekilirken, çitin üstünde asılı bir örümcek ağı belirdi; çiy damlaları güneşte pırıl pırıl yanıyor.' },
  { message: 'Birkaç serçe saçak altında birbirine girmiş, neyin kavgasını ettikleri anlaşılmıyor.' },
  { message: 'Sulama arkında birkaç iribaş dolaşıyor; demek ki kurbağalar da bu çiftliği beğenmiş.' },
  { message: 'Tarlanın başındaki büyük kayanın üstünde bir keler kımıldamadan güneşleniyor.' },
  { message: 'Rüzgârla birlikte tatlı bir çiçek kokusu geldi; belli ki gaKöy’de bir avludan savrulmuş.' },
  { message: 'Korkuluğun bugün daha da eğrilmiş. Belki gece kimse bakmaz sanıp kendi başına dolaşmıştır.' },
  { message: 'Sabahın ilk ışığında bir yusufçuk gelip çapanın sapına kondu; kanatları ışığı geçiriyor.' },
  { message: 'Bir karınca alayı tarla setini boydan boya geçiyor; taşıdıkları şey gözden seçilmiyor, kuyruğu da görünmüyor.' },
  { message: 'Çiftliğin bir köşesinde küçük bir kuş yuvası peyda olmuş; belli ki bazı kuşlar burayı yurt edinmeye niyetli.' }
]

/** Yalın anlatılar (loseCrop yok); boş çiftlikte geri dönüş için kullanılır */
export const NARRATIONS_NO_LOSS: MorningNarration[] = MORNING_NARRATIONS.filter(n => !n.effect || n.effect.type !== 'loseCrop')

// ==================== %0,8 Seçenekli olaylar (15 adet) ====================

export const MORNING_CHOICE_EVENTS: MorningChoiceEvent[] = [
  {
    id: 'injured_bird',
    message: 'Seher vakti tarla kıyısında yaralı bir kuş buldun; kara boncuk gibi gözleriyle sana bakıyor.',
    choices: [
      {
        label: 'Yarasını sar, bir süre iyileştir',
        result: 'Kuşun kanadını dikkatle sardın. gaKöy halkı bunu duyunca yüreğinin iyiliğini öve öve bitirmedi.',
        effect: { type: 'gainFriendship', amount: 10 }
      },
      { label: 'Onu çalılığa bırak', result: 'Kuş kanat çırpa çırpa uzaklaştı. Gitmeden önce iki kez öttü; sanki minnet etti.' }
    ]
  },
  {
    id: 'hungry_traveler',
    message: 'Çiftliğin önüne toz toprak içinde bir yolcu uğradı; hem bitkin hem aç görünüyor.',
    choices: [
      {
        label: 'Ona bir kap yemek ver',
        result: 'Karnını doyuran yolcu bin bir dua etti; giderken heybesinden bir tutam şifalı ot çıkarıp sana uzattı.',
        effect: { type: 'gainItem', itemId: 'herb', qty: 3 }
      },
      { label: 'Yolu göster, köye yönlendir', result: 'Yolcu sana eğilerek selam verdi, sonra patikadan gaKöy’e doğru yürüdü.' }
    ]
  },
  {
    id: 'stealing_child',
    message: 'Bir çocuk usulca tarlana girip turp çekiyor; seni görünce donup kaldı.',
    choices: [
      {
        label: 'Biraz daha ver',
        result: 'Çocuk yüzü kızararak sebzeleri aldı, eğilip selam verdi ve koşarak uzaklaştı. Sonradan anası gelip teşekkür etti.',
        effect: { type: 'gainFriendship', amount: 15 }
      },
      { label: 'Görmemiş gibi davran', result: 'Sessizce arkanı dönüp eve girdin. Arkanda önce hafif bir hışırtı, sonra da uzaklaşan ayak sesleri kaldı.' }
    ]
  },
  {
    id: 'mysterious_cat',
    message: 'Daha önce hiç görmediğin kara bir kedi tarlanın ortasında çömelmiş; önünde de muntazam bırakılmış bir kozalak var.',
    choices: [
      {
        label: 'Kozalağı al',
        result: 'Eğilip kozalağı aldın. Kara kedi bir kez miyavladı, sonra sabah sisi içinde ağır ağır gözden kayboldu.',
        effect: { type: 'gainItem', itemId: 'pine_cone', qty: 1 }
      },
      { label: 'Başını okşa', result: 'Kedi boğuk bir mırıltı çıkardı, eline sürtündü, sonra duvardan atlayıp gitti.' }
    ]
  },
  {
    id: 'old_man_fishing',
    message: 'Ak sakallı bir ihtiyar, çiftliğinin kıyısındaki su yolunda olta sallıyor. Seni görünce gülümseyip selam verdi.',
    choices: [
      { label: 'Yanına otur, biraz sohbet et', result: 'İhtiyar toprağın ve mevsimin dilinden uzun uzun söz etti. Dinledikçe çok şey öğrendiğini hissettin.', effect: { type: 'gainFriendship', amount: 8 } },
      { label: 'Ona bir tas çay ver', result: 'İhtiyar çayı sevinçle içti; giderken kovasındaki birkaç balığı sana bıraktı.', effect: { type: 'gainMoney', amount: 50 } }
    ]
  },
  {
    id: 'lost_dog',
    message: 'Kir pas içindeki küçük bir köpek kapının önünde büzülmüş yatıyor; epey zamandır kayıp olduğu belli.',
    choices: [
      {
        label: 'Yıka, karnını doyur',
        result: 'Köpek kuyruğunu sallayıp elini yaladı. Bir gün boyunca yanında kaldı; akşamüstü sahibi gelip onu aldı ve şükran nişanesi olarak birkaç sikke bıraktı.',
        effect: { type: 'gainMoney', amount: 30 }
      },
      {
        label: 'Köye götür, sahibini ara',
        result: 'Köpekle birlikte gaKöy sokaklarını dolaştın; çok geçmeden sahibi bulundu. Herkes yardımseverliğini konuştu.',
        effect: { type: 'gainFriendship', amount: 8 }
      }
    ]
  },
  {
    id: 'herb_woman',
    message: 'Sırtında bambu küfesiyle yaşlı bir kadın yoldan geçerken senden bir tas su istedi.',
    choices: [
      {
        label: 'Ona su ver',
        result: 'Kadın suyu içip dua etti; giderken küfesinden bir avuç şifalı ot çıkarıp sana verdi.',
        effect: { type: 'gainItem', itemId: 'herb', qty: 2 }
      },
      {
        label: 'Biraz dinlenmesini söyle',
        result: 'Yaşlı kadın biraz oturdu, gençlerin gönlünün temiz kaldığını söyleyip durdu. Yüzü sana bir yerden tanıdık geldi.',
        effect: { type: 'gainFriendship', amount: 5 }
      }
    ]
  },
  {
    id: 'fox_standoff',
    message: 'Bir tilki ağzında bir şey taşıyarak tarlada çömelmiş; sen çıkınca kaçmadı, sadece sana baktı.',
    choices: [
      { label: 'El sallayıp kov', result: 'Tilki ağır ağır uzaklaştı. Tarlayı dolaşıp baktın; neyse ki gözle görülür bir zarar yok.' },
      {
        label: 'Ona bir parça çörek at',
        result: 'Tilki ağzındaki şeyi bırakıp çöreği kaptı ve kaçtı. Yerde kalan şeye bakınca onun bir kozalak olduğunu gördün.',
        effect: { type: 'gainItem', itemId: 'pine_cone', qty: 1 }
      }
    ]
  },
  {
    id: 'broken_fence',
    message: 'Çitin bir yanı dürtülüp açılmış; birkaç yabani tavşan tarlada rahat rahat otluyor.',
    choices: [
      { label: 'Önce çiti onar', result: 'Biraz uğraşıp çiti kapattın. Tavşanlar da panikle açıklıktan dışarı kaçtı.' },
      { label: 'Ne yediklerine bak', result: 'Tavşanlar ekin değil, yabani ot kemiriyor. Gülümsedin, bırakıp gittin. Hatta biraz ot temizlemiş oldular.' }
    ]
  },
  {
    id: 'rain_mushroom',
    message: 'Gece yağan yağmurun ardından, tarla setinin dibinde birkaç mantar bitmiş.',
    choices: [
      {
        label: 'Biraz topla',
        result: 'Bunların yenir türden yabani mantarlar olduğunu anladın; birkaçını hemen topladın.',
        effect: { type: 'gainItem', itemId: 'wild_mushroom', qty: 2 }
      },
      { label: 'Bırak, büyüsünler', result: 'Dokunmamaya karar verdin. Belki birkaç güne daha da çoğalırlar.' }
    ]
  },
  {
    id: 'painting_visitor',
    message: 'Sırtında resim tahtası taşıyan genç biri tarla kıyısında durmuş, çiftliğini çiziyor.',
    choices: [
      {
        label: 'Yanına gidip bak',
        result: 'Ortaya çıkan resim hayli güzel. Genç, bu yerin ona ilham verdiğini söyleyip teşekkür için birkaç bakır sikke uzattı.',
        effect: { type: 'gainMoney', amount: 20 }
      },
      {
        label: 'Ona bir kupa çay ver',
        result: 'Genç çayı minnetle aldı. Resmi bir gün sana göndereceğini söyledi; sen de bir süre bunu bekleyip durdun.',
        effect: { type: 'gainFriendship', amount: 5 }
      }
    ]
  },
  {
    id: 'snake_shed',
    message: 'Su arkının yanında, neredeyse ışık geçirir incelikte, bütün hâliyle bir yılan gömleği buldun.',
    choices: [
      { label: 'Onu sakla', result: 'Köyün yaşlıları yılan gömleğinin uğur sayıldığını söyler. Sen de saçak altına astın, gönlün ferahladı.' },
      { label: 'Olduğu yerde bırak', result: 'Gömleği usulca yerine koyup uzaklaştın. Tabiatın malı yine tabiata kalsın dedin.' }
    ]
  },
  {
    id: 'wild_bee_nest',
    message: 'Evin arkasındaki yaşlı ağaca küçük bir arı peteği kurulmuş; birkaç bal arısı durmadan çalışıyor.',
    choices: [
      { label: 'Kalsınlar', result: 'Arıların ekinlere bereket getireceğini düşündün. Onlarla barış içinde yaşamaya karar verdin.' },
      {
        label: 'Biraz bal al',
        result: 'Duman yardımıyla azıcık bal çıkarabildin. Çok değil ama tadı pek güzeldi.',
        effect: { type: 'gainItem', itemId: 'honey', qty: 1 }
      }
    ]
  },
  {
    id: 'stone_buddha',
    message: 'Toprağı bellenirken yumruk kadar bir taş çıktı; dikkatle bakınca küçük bir putçuğu andırıyor.',
    choices: [
      {
        label: 'Temizleyip tarla kıyısına koy',
        result: 'Taşı silip tarla kenarına yerleştirdin. Yoldan geçen köylüler bunun uğur getireceğini söyleyip sevindi.',
        effect: { type: 'gainFriendship', amount: 10 }
      },
      { label: 'Sakla, sonra sat', result: 'Onu gaKöy’de eski eşya alan birine gösterdin; karşılığında birkaç bakır sikke aldın.', effect: { type: 'gainMoney', amount: 66 } }
    ]
  },
  {
    id: 'bamboo_shoots',
    message: 'Gece yağmurundan sonra, çitin dibinde birkaç taze bambu filizi yükselmiş.',
    choices: [
      { label: 'Söküp al', result: 'Taptaze filizler çıktı; iyi bir yemek olur diye düşündün.', effect: { type: 'gainItem', itemId: 'bamboo', qty: 3 } },
      { label: 'Bırak, uzasınlar', result: 'Filizleri olduğu gibi bıraktın. Çok geçmeden burada birkaç yeni bambu boy verecek.' }
    ]
  }
]

// ==================== %0,2 Sürpriz anlatılar (10 adet) ====================

export const MORNING_EASTER_EGGS: MorningEasterEgg[] = [
  {
    message: 'Toprağı kazarken eski bir bakır sikke buldun; üzerindeki yazılar silinmiş olsa da belli belirsiz ışıldıyor.',
    effect: { type: 'gainItem', itemId: 'ancient_coin', qty: 1 }
  },
  { message: 'Altın renkli bir kelebek tarlanın üstünde dönüp üç kez çevrende dolandı, sonra uzak dağlara doğru süzüldü. Onu görenin talihinin açıldığı söylenir.' },
  { message: 'Gece sanki yaprak ve çiçek yağmuru yağmış; bütün çiftliğe hafif bir koku sinmiş. O çiçeklerin nereden geldiğini kimse bilemez.' },
  { message: 'Kuyunun dibinde kendi aksini gördün; ama yansıman sana gülümsedi sanki. Belki de daha tam ayılmadın.' },
  { message: 'Sabah kapıyı açtığında eşikte kır çiçeklerinden bağlanmış düzenli bir demet buldun. Kimin bıraktığını bilen yok.', effect: { type: 'gainMoney', amount: 88 } },
  { message: 'Bir ak turna gökyüzünden süzülüp tarlana kısa bir an kondu, sonra yeniden kanatlandı. Eskiler, ak turnanın ermişlerin habercisi olduğunu söyler.' },
  { message: 'Bu sabah bütün ekinlerin dünkünden daha canlı göründüğünü fark ettin. Belki göz yanılmasıdır, belki değildir.' },
  {
    message: 'Yastığının altında nereden geldiği belli olmayan bir bakır sikke buldun. Düşününce, gece bereket tanrısı üzerine bir düş görmüş gibisin.',
    effect: { type: 'gainMoney', amount: 66 }
  },
  { message: 'Korkuluk bugün bambaşka bir yöne bakıyor. Dün böyle olmadığına eminsin. ...Yoksa değil misin?' },
  { message: 'Gün daha doğmadan uzaktan ney benzeri birkaç ezgi işittin; öyle inceydi ki insan nefesine benzemezdi. Kapıyı açıp baktığında ortada kimse yoktu.' }
]
