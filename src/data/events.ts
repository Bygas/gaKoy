import type { Season } from '@/types'

/** Mevsim etkinliği tanımı */
export interface SeasonEventDef {
  id: string
  name: string
  season: Season
  day: number // Tetiklenme günü
  description: string
  /** Etkinlik etkileri */
  effects: {
    friendshipBonus?: number // Tüm NPC’lere yakınlık artışı
    moneyReward?: number // Bakır sikke ödülü
    itemReward?: { itemId: string; quantity: number }[]
    staminaBonus?: number // Ek dayanıklılık yenilenmesi
  }
  /** Etkinlik anlatıları */
  narrative: string[]
  /** Etkileşimli bayram mı (mini oyun var mı) */
  interactive?: boolean
  /** Etkileşimli bayram türü */
  festivalType?:
    | 'fishing_contest'
    | 'harvest_fair'
    | 'dragon_boat'
    | 'lantern_riddle'
    | 'pot_throwing'
    | 'dumpling_making'
    | 'firework_show'
    | 'tea_contest'
    | 'kite_flying'
}

export const SEASON_EVENTS: SeasonEventDef[] = [
  {
    id: 'spring_festival',
    name: 'İlk Sürüm Şenliği',
    season: 'spring',
    day: 8,
    description: 'Bütün gaKöy, bahar ekiminin başlangıcını kutlar; bereket için dua edilir.',
    effects: {
      friendshipBonus: 5,
      itemReward: [{ itemId: 'seed_cabbage', quantity: 5 }]
    },
    narrative: [
      'gaKöy’ün yıl içindeki en kutlu ilk sürüm şenliği geldi!',
      'Köylüler meydanda toplandı; duayı Hasan Enişte yönetiyor.',
      'Elif, dallara al al bezler bağladı; rüzgâr estikçe göğe kızıl bulut gibi yayılıyorlar.',
      '“Bu yıl yağmur da vaktiyle gelsin, ekin de başağa dursun!”',
      'Hasan Enişte, hayır duası niyetine sana biraz tohum verdi.',
      'Tüm köylülerle yakınlık +5.'
    ]
  },
  {
    id: 'summer_lantern',
    name: 'Nilüfer Kandili · Balık Tutma Yarışı',
    season: 'summer',
    day: 15,
    description: 'Irmak kıyısında kandiller suya bırakılır; üstüne bir de heyecanlı balık yarışı yapılır!',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Yaz gecesinde berrak su kıyısında köylüler bir araya gelip nilüfer kandilleri yüzdürüyor.',
      'Aylin erkenden türlü türlü çiçek kandilleri hazırlamış.',
      '“Çabuk gel! Bu yıl balık tutma yarışını da kattılar!”',
      'Yumuşak kandil ışıkları suyun üstünde kayarken gökte yıldızlar parlıyor.',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'fishing_contest'
  },
  {
    id: 'autumn_harvest',
    name: 'Bereket Sofrası · Ürün Panayırı',
    season: 'autumn',
    day: 22,
    description: 'Hasadı yarıştırma vakti; bakalım en güzel ürünü kim getirecek!',
    effects: {
      friendshipBonus: 5,
      staminaBonus: 30
    },
    narrative: [
      'Güz gelince gaKöy’ün her yanı hasat kokusuna büründü.',
      'Köylüler en iyi ürünlerini alıp meydanda toplandı.',
      'Hasan Enişte yüksek sesle duyurdu: “Bu yıl ürün panayırı kuruldu; herkes en iyisini getirsin!”',
      'Kurulan bereket sofrası sana ek olarak 30 dayanıklılık kazandırdı.',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'harvest_fair'
  },
  {
    id: 'winter_new_year',
    name: 'Yıl Sonu Gece Bekleyişi',
    season: 'winter',
    day: 28,
    description: 'Yıl sonu toplanması; eski yıl uğurlanır, yeni yıl karşılanır.',
    effects: {
      friendshipBonus: 10,
      moneyReward: 300,
      itemReward: [
        { itemId: 'herb', quantity: 3 },
        { itemId: 'firewood', quantity: 5 }
      ]
    },
    narrative: [
      'Kışın 28. günü — yıl sonu gecesi.',
      'gaKöy’de her ev ışıklarla süslenmiş, bacalardan dumanlar yükseliyor.',
      'Elif seni kolundan çekip muhtar evine götürdü: “İnsan bu geceyi tek başına geçirmez, hadi bize gel.”',
      'Hasan Enişte dumanı tüten akşam sofrasını getirdi; Hekim Dede de eline iç ısıtan bir kadeh tutuşturdu.',
      'İsmail mahcup bir tavırla küçük bir kese uzattı: “…Yeni yıl kutlu olsun.”',
      'Aylin ile Mıstık avluda çıtır çıtır patlayan fişekler yakarken kahkaha sesleri geceye yayıldı.',
      '“Yeni yılda gaKöy daha da güzelleşecek,” dedi Hekim Dede.',
      'Bu, gaKöy’de geçirdiğin {year}. yeni yıl oldu.',
      '300 bakır sikke ve köylülerin armağanlarını aldın. Tüm köylülerle yakınlık +10.'
    ]
  },

  // ==================== Yeni bayramlar (10) ====================

  // --- Pasif bayramlar ---
  {
    id: 'yuan_ri',
    name: 'Yılbaşı Günü',
    season: 'spring',
    day: 1,
    description: 'Yeni yıl başlar, her şey tazelenir.',
    effects: {
      friendshipBonus: 5,
      moneyReward: 300,
      itemReward: [{ itemId: 'seed_cabbage', quantity: 3 }]
    },
    narrative: [
      'Baharın 1. günü — yılbaşı.',
      'Sabah gaKöy’de her kapının önüne taze dilek bezleri asılmış.',
      'Hasan Enişte gülümseyerek sana sıcak bir lokma uzattı: “Yeni yılın ağzı tatlı başlasın da adım adım yükselesin.”',
      'Elif, köylülerle birlikte köy girişinde fişekler patlatıyor; ortalık cıvıl cıvıl.',
      'Hekim Dede çiçek açmış ağacın dibinde durup yumuşak bir sesle konuştu: “Bir güzel yıl daha doğdu.”',
      '300 bakır sikke ve tohum aldın. Tüm köylülerle yakınlık +5.'
    ]
  },
  {
    id: 'hua_chao',
    name: 'Çiçek Uyanışı Günü',
    season: 'spring',
    day: 15,
    description: 'Çiçeklerin doğum günü sayılır; seyir ve bereket duası günüdür.',
    effects: {
      friendshipBonus: 5,
      itemReward: [
        { itemId: 'peach', quantity: 3 },
        { itemId: 'seed_chrysanthemum', quantity: 2 }
      ]
    },
    narrative: [
      'Baharın 15. günü — çiçek uyanışı.',
      'gaKöy’de ağaçlar tam çiçekte; yapraklar rüzgârla savruluyor.',
      'Aylin başına kendi ördüğü çiçek halkasını takmış: “Bugün çiçeklerin doğum günü sayılır!”',
      'Elif çiçekli ağacın altına küçük bir adak köşesi kurup herkesi kırmızı bağlar bağlamaya çağırdı.',
      'Mıstık çiçeklerin arasında kelebek kovalıyor, gülüşü her yana yayılıyor.',
      'Şeftali ve çiçek tohumu aldın. Tüm köylülerle yakınlık +5.'
    ]
  },
  {
    id: 'shang_si',
    name: 'Bahar Gezisi',
    season: 'spring',
    day: 24,
    description: 'Kırlara çıkılır, tabiatla baş başa kalınır.',
    effects: {
      friendshipBonus: 3,
      staminaBonus: 40,
      itemReward: [{ itemId: 'wild_berry', quantity: 3 }]
    },
    narrative: [
      'Baharın 24. günü — kırlara çıkış günü.',
      'Bütün köy dağ eteklerine gezmeye çıktı; dere şırıl şırıl, kuşlar ötüşüyor.',
      'İsmail nadiren görülen bir gülümsemeyle dere kenarında ellerini yıkayıp sessizce dua etti.',
      'Aylin ile Mıstık çimenlerin üstünde ot halkaları örerken sen de onlara katıldın.',
      'Hekim Dede bir sepet yabani meyve topladı, herkesle paylaştı; esen serinlik insanın içini açtı.',
      'Gezi seni canlandırdı; 40 dayanıklılık yenilendi. Tüm köylülerle yakınlık +3.'
    ]
  },
  {
    id: 'zhong_qiu',
    name: 'Dolunay Seyri',
    season: 'autumn',
    day: 8,
    description: 'Ay dolarken herkes bir araya gelir, birlikte göğe bakar.',
    effects: {
      friendshipBonus: 8,
      moneyReward: 500,
      itemReward: [{ itemId: 'lotus_seed', quantity: 3 }]
    },
    narrative: [
      'Güzün 8. günü — dolunay gecesi.',
      'Gece bastığında göğe iri ve parlak bir ay yükseldi.',
      'Köylüler meydanda toplandı; sofralarda tatlılar ve meyveler diziliydi.',
      'Hasan Enişte kadehini kaldırıp ay ışığına karşı eski bir beyit mırıldandı.',
      'Elif herkese birer pay çörek ve ay seyri kesesi dağıttı.',
      'Aylin ay ışığına dalıp gitmiş, sanki derin bir şey anımsıyor gibiydi.',
      '“Sizlerle birlikte gaKöy’de geçirdiğim her gün çok güzel,” diye fısıldadı.',
      '500 bakır sikke ve nilüfer tohumu aldın. Tüm köylülerle yakınlık +8.'
    ]
  },
  {
    id: 'la_ba',
    name: 'Kış Aşı Günü',
    season: 'winter',
    day: 8,
    description: 'Soğuğu kırmak için kazan kaynar, herkes bir kap aş içer.',
    effects: {
      friendshipBonus: 5,
      staminaBonus: 50,
      itemReward: [{ itemId: 'rice', quantity: 5 }]
    },
    narrative: [
      'Kışın 8. günü — kış aşı günü.',
      'Ayaz sert ama köy ocakları harlı yanıyor.',
      'Hasan Enişte daha gün doğmadan büyük kazanı kurmuş; herkes evinden biraz erzak getirmiş.',
      'Fıstık, hurma, tohum, pirinç… koca kazanda fokur fokur kaynayan aşın buğusu yükseliyor.',
      'Elif gülümseyip dolu bir tas uzattı: “Bunu içenin yılı sıcak ve bereketli geçer.”',
      'İçtiğin sıcak aş içini ısıttı; 50 dayanıklılık yenilendi.',
      'Pirinç aldın. Tüm köylülerle yakınlık +5.'
    ]
  },

  // --- Etkileşimli bayramlar ---
  {
    id: 'duan_wu',
    name: 'Kayık Yarışı Bayramı',
    season: 'summer',
    day: 5,
    description: 'Uzun kayıklar yarışır; kürek çeken öne geçer!',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Yazın 5. günü — kayık yarışı bayramı.',
      'gaKöy Irmağı bugün capcanlı; üç uzun yarış kayığı yan yana dizilmiş!',
      'Hasan Enişte kıyıda hakem olmuş: “Herkes yerine — hazır —”',
      'İsmail ile Mıstık çoktan kayığa çıkmış, sabırsızlanıyor.',
      '“Hadi çabuk! Yarış başlamak üzere!” diye Aylin sana el salladı.',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'dragon_boat'
  },
  {
    id: 'qi_xi',
    name: 'Fener Bilmecesi Gecesi',
    season: 'summer',
    day: 22,
    description: 'Yaz gecesi fenerler asılır, bilmeceler çözülür.',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Yazın 22. günü — fener gecesi.',
      'Gece çökünce meydan renk renk kandillerle doldu.',
      'Her kandilin altında çözülmeyi bekleyen bir bilmece sallanıyor; doğru bilen ödül alacak!',
      'Hoca Efendi sakalını sıvazlayıp gülümsedi: “Bu yılın bilmecelerini ince ince seçtim.”',
      'Aylin’in gözleri ışıl ışıl: “Hadi yarışalım, bakalım kim daha çok bilecek!”',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'lantern_riddle'
  },
  {
    id: 'chong_yang',
    name: 'Hedefe Atış Günü',
    season: 'autumn',
    day: 15,
    description: 'Güz esintisinde hedefe atış yapılır, hüner denenir.',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Güzün 15. günü — hedefe atış bayramı.',
      'Hava açık ve serin; köylüler meydanda tunç hedef kaplarını hazırlamış.',
      'Hekim Dede gülerek dedi ki: “Bu eski bir meydan geleneğidir; bakalım eli en sağlam olan kim.”',
      'İsmail tek söz etmeden oku eline aldı; gözleri son derece ciddi.',
      'Mıstık yerinde duramıyor: “Bu kez tam ortadan vuracağım!”',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'pot_throwing'
  },
  {
    id: 'dong_zhi',
    name: 'Kış Dönümü Hamur Günü',
    season: 'winter',
    day: 15,
    description: 'Kış dönümünde hamur açılır, sıcak lokmalar paylaşılır.',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Kışın 15. günü — kış dönümü.',
      'Kuzeyden sert rüzgâr esiyor ama köy odasının içi sıcacık.',
      'Hasan Enişte erkenden hamuru yoğurmuş: “Bu günde sıcak lokma yemeyenin kulağı dona kalır!”',
      'Elif ile Aylin çoktan sofranın başına geçmiş, yufkalar açılıyor, içler hazırlanıyor.',
      '“Haydi bakalım, en düzgününü kim kapatacak görelim!” diye Elif seni çağırdı.',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'dumpling_making'
  },
  {
    id: 'nian_mo',
    name: 'Yıl Sonu Işık Şöleni',
    season: 'winter',
    day: 22,
    description: 'Yıl bitmeye yaklaşırken gece göğü ışıklarla süslenir.',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Kışın 22. günü — yıl sonu ışık şöleni.',
      'Bu, yılın kapanışından önceki en görkemli kutlama.',
      'İsmail birkaç sandık renkli ateş getirdi: “…Ben yakarım.”',
      'Mıstık sevinçten yerinde zıplıyor: “Işıklar! En çok ben seviyorum!”',
      'Aylin elinden tutup gülümsedi: “Gel, bu geceyi aklımıza kazıyalım.”',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'firework_show'
  },
  {
    id: 'dou_cha',
    name: 'Çay Meydanı',
    season: 'summer',
    day: 18,
    description: 'Çay bahanedir; maharet ve incelik yarıştırılır.',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Yazın 18. günü — çay meydanı.',
      'Sıcak yaz gününde en makbul şey, güzel demlenmiş bir çaydır.',
      'Hekim Dede meydanda çay tezgâhını kurdu; kaynak suyu hazır, takımlar tam.',
      '“İyi çay için iyi su, iyi ateş ve iyi el gerekir. Bugün bunların iyisini arayacağız.”',
      'Aylin takımları hazırlamış, İsmail de dağ pınarından su taşımış.',
      'Hasan Enişte gülerek seslendi: “Haydi herkes denesin; bakalım en güzel çayı kim demleyecek!”',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'tea_contest'
  },
  {
    id: 'qiu_yuan',
    name: 'Güz Uçurtma Günü',
    season: 'autumn',
    day: 18,
    description: 'Güz rüzgârı çıkınca kâğıt kuşlar göğe salınır.',
    effects: {
      friendshipBonus: 5
    },
    narrative: [
      'Güzün 18. günü — uçurtma günü.',
      'Gökyüzü açık, rüzgâr kıvamında; tam uçurtmalık hava.',
      'Mıstık daha sabah vakti kelebek biçimli bir uçurtma yapmış: “Bak bak, nasıl olmuş!”',
      'İsmail sessizce kartal biçimli bir uçurtma çıkardı; işçiliği pek inceydi.',
      'Aylin kızararak çiçek biçimli olanı uzattı: “Ben… bunu ilk kez yaptım.”',
      'Elif kahkahayla, “Bakalım kimin uçurtması en yükseğe, en dengeli çıkacak!” dedi.',
      'Tüm köylülerle yakınlık +5.'
    ],
    interactive: true,
    festivalType: 'kite_flying'
  }
]

/** Mevsim ve güne göre bugünün etkinliğini getirir */
export const getTodayEvent = (season: Season, day: number): SeasonEventDef | undefined => {
  return SEASON_EVENTS.find(e => e.season === season && e.day === day)
    }
