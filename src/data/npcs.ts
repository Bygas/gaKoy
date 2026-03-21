import type { NpcDef } from '@/types'

/** Tüm NPC tanımları */
export const NPCS: NpcDef[] = [
  // ============================================================
  // Eski NPC'ler (6)
  // ============================================================
  {
    id: 'chen_bo',
    name: 'Hasan Enişte',
    gender: 'male',
    role: 'Her Şey Dükkânı Sahibi',
    personality: 'yardımsever, yiğit gönüllü',
    birthday: { season: 'spring', day: 8 },
    lovedItems: ['tea', 'osmanthus', 'ginseng'],
    likedItems: ['cabbage', 'rice', 'potato', 'goat_milk', 'truffle', 'rabbit_foot', 'hanhai_spice'],
    hatedItems: ['copper_ore', 'quartz'],
    dialogues: {
      stranger: ['Hele buyur yiğidim, buralara yeni ayak bastın galiba? Ben Hasan Enişte, şu dükkânın sahibiyim.', '{title}, ne gerekse çekinme, kapımız sana daima açıktır.'],
      acquaintance: ['Ha ha, {title} yine uğradı desene! Bugün gönlün ne ister?', 'Yeni birkaç güzel mal geldi, bir göz at istersen.'],
      friendly: ['{player}, deden gençliğinde de senin gibi dirayetliydi.', 'Bazı kıymetli şeyleri herkese ayırmam, yalnız sana saklarım {title}.'],
      bestFriend: ['{player}, seni öz evladım bellemiş gibiyim.', 'Şu dükkânı bir gün sana bıraksam yeridir… Heh, şaka ettim.']
    }
  },
  {
    id: 'liu_niang',
    name: 'Elif',
    gender: 'female',
    role: 'Muhtarın kızı',
    personality: 'yumuşak huylu, zeki',
    birthday: { season: 'summer', day: 14 },
    lovedItems: ['chrysanthemum', 'osmanthus', 'peacock_feather'],
    likedItems: ['tea', 'wintersweet', 'rabbit_fur', 'rabbit_foot', 'hanhai_silk'],
    hatedItems: ['iron_ore', 'firewood'],
    dialogues: {
      stranger: ['Selam, yeni gelen çiftlik sahibi sensin değil mi? Ben Elif.', 'gaKöy pek güzeldir, {title}; burayı seversin.'],
      acquaintance: ['Bugün hava pek hoş, {title}; biraz dolaşmaya mı çıktın?', 'Eski şiirlerden bir mecmua okuyorum, dilersen birlikte göz atalım.'],
      friendly: ['{title} burada olunca köy biraz daha can buldu.', '{player}, biraz osmanlı çöreği yaptım, bir parça tat bak.'],
      bestFriend: ['{title} ile konuşmak gönlüme ferahlık veriyor…', 'Şu çiçeği sana getirdim; dağ yolunda buldum.']
    },
    marriageable: true,
    heartEventIds: ['liu_niang_heart_3', 'liu_niang_heart_5', 'liu_niang_heart_8'],
    datingDialogues: [
      'Bugün {player} ile dere kıyısında gezmek isterim.',
      '{title}, senin için bir nazarlık işledim; yanında taşı.',
      '{player} ile geçen her gün, eski destanlardaki güzel mısralar gibi içime işler.'
    ],
    zhijiDialogues: [
      '{player} ile şiir okuduğum vakitler, gönlümün en kıymetli hatıraları oldu.',
      'Bazı sözler yalnız candan dosta söylenir… {title}, hep yanımda olduğun için sağ ol.',
      'Hakiki gönül yoldaşı ömrün bahtıdır. {player} ile karşılaşmam da benim bahtım oldu.'
    ],
    zhijiHeartEventIds: ['liu_niang_zhiji_7', 'liu_niang_zhiji_9']
  },
  {
    id: 'a_shi',
    name: 'İsmail',
    gender: 'male',
    role: 'madenci',
    personality: 'suskun, ağır başlı',
    birthday: { season: 'autumn', day: 5 },
    lovedItems: ['ruby', 'jade', 'hanhai_turquoise'],
    likedItems: ['gold_ore', 'iron_ore', 'potato', 'rabbit_foot'],
    hatedItems: ['chrysanthemum', 'wintersweet'],
    dialogues: {
      stranger: ['…He.', 'Maden ocağına… dikkatle in {title}.'],
      acquaintance: ['{title} sen de kazıya mı gidiyorsun?… Kazmanı yanına al.', 'Derinlerde iyi cevher de var, uğursuzluk da.'],
      friendly: ['Şu taş iyi çıktı, al senin olsun {title}.', '{player}, kazman artık yenilenmeli; isterse bir bakarım.'],
      bestFriend: ['…{player}, benim ilk gerçek dostumsun.', 'En dipteki sırrı… yalnız {title} ile paylaşırım.']
    },
    marriageable: true,
    heartEventIds: ['a_shi_heart_3', 'a_shi_heart_5', 'a_shi_heart_8'],
    datingDialogues: [
      '…{player}, şu taş pek güzel. Gözlerini andırıyor.',
      'Eskiden en iyi yer madenin dibi sanırdım. Şimdi… {title} neredeyse orası daha iyi.',
      'Söz söylemekte pek usta değilim… Ama {player} yanımda olsun yeter.'
    ],
    zhijiDialogues: ['…Yanımda kazı yapınca iş daha tez gidiyor sanki.', '{player}, şu taşı… ancak gönül kardeşi taşımalı.', 'Sözsüz de rahat durabiliyoruz… Demek gönül dostluğu böyle bir şey.'],
    zhijiHeartEventIds: ['a_shi_zhiji_7', 'a_shi_zhiji_9']
  },
  {
    id: 'qiu_yue',
    name: 'Aylin',
    gender: 'female',
    role: 'balıkçı kızı',
    personality: 'canlı, neşeli',
    birthday: { season: 'winter', day: 20 },
    lovedItems: ['koi', 'giant_salamander'],
    likedItems: ['crucian', 'carp', 'grass_carp', 'bass', 'rabbit_foot'],
    hatedItems: ['copper_ore', 'iron_ore'],
    dialogues: {
      stranger: ['A aa, yeni bir yüz! Selam {title}, ben Aylin; şu köyde oltayı en iyi ben sallarım!', 'Balıkçılığı öğrenmek istersen beni bul yeter!'],
      acquaintance: ['Bugün derenin suyu pek berrak, iri balık çıkar bundan!', '{title}, oltayı tutuşun gittikçe ustalaşıyor ha.'],
      friendly: ['Bu benim gizli avlak yerim, yalnız sana söylerim {title}.', '{player}, sana güzel bir balık yahnisi yapmayı öğreteyim; tadı dillere düşer!'],
      bestFriend: ['Bundan sonra hep birlikte balığa çıkalım mı? Her gün çıkalım!', '{title}, gördüğüm en iyi oltacısın! Heh heh.']
    },
    marriageable: true,
    heartEventIds: ['qiu_yue_heart_3', 'qiu_yue_heart_5', 'qiu_yue_heart_8'],
    datingDialogues: [
      '{player}! Şu akşam kızıllığına bak, gel birlikte seyredelim!',
      'Heh, {title} artık benimdir; kimse kapmaya kalkmasın.',
      'Bundan böyle her gün birlikte balığa gidelim mi? Yalnız ikimiz!'
    ],
    zhijiDialogues: [
      '{player}! Hadi bugün yine balığa çıkalım! Benim gizli avlağa yalnız gönül dostu gider!',
      'Heh, ne derdin varsa bana dök! Biz candan dostuz!',
      'Bundan sonra nereye gidersem {title} da yanımda olsun!'
    ],
    zhijiHeartEventIds: ['qiu_yue_zhiji_7', 'qiu_yue_zhiji_9']
  },
  {
    id: 'lin_lao',
    name: 'Hekim Dede',
    gender: 'male',
    role: 'eski hekim',
    personality: 'şefkatli, bilge',
    birthday: { season: 'autumn', day: 22 },
    lovedItems: ['herb', 'tea', 'antler_velvet'],
    likedItems: ['winter_bamboo_shoot', 'bamboo', 'yak_milk', 'camel_milk', 'rabbit_foot', 'hanhai_spice'],
    hatedItems: ['ruby', 'gold_ore'],
    dialogues: {
      stranger: ['Evlat, buraların suyuna toprağına alışabildin mi?', 'Ben yıllar yılı derman dağıttım; {title}, bir derdin varsa çekinmeden söyle.'],
      acquaintance: ['Şu ot şifalıdır; hem devaya girer hem çaya katılır.', '{title}, yüzüne renk geldi; ilk geldiğin günlere benzemez oldun.'],
      friendly: ['Elimde bir kuvvet yemeği tarifi var, insanın direncini artırır.', '{player}’ın dedesi… benim eski dostlarımdandı.'],
      bestFriend: ['Şu bitki mecmuasını sana veriyorum {title}. Güzelce oku.', 'gaKöy’ün yarını biraz da sana emanet, {player}.']
    }
  },
  {
    id: 'xiao_man',
    name: 'Mıstık',
    gender: 'male',
    role: 'marangoz çırağı',
    personality: 'yaramaz, meraklı',
    birthday: { season: 'spring', day: 18 },
    lovedItems: ['watermelon', 'sweet_potato'],
    likedItems: ['wood', 'bamboo', 'radish', 'rabbit_foot'],
    hatedItems: ['herb', 'tea'],
    dialogues: {
      stranger: ['Vay, yeni gelen sensin ha! Ben Mıstık!', '{title}’ın çiftliğine gizlice baktım… epey döküntüydü— şey yani, büyük umudu var!'],
      acquaintance: ['Şu sıra dolap yapmayı öğreniyorum, {title} isterse bir tane çıkarırım.', 'Usta diyor ki elim henüz tam kıvamında değil, hıh!'],
      friendly: ['{title}’ın aletlerini onarayım mı? Taş gibi yaparım!', 'Heh heh, {player} için gizli bir indirim yaparım.'],
      bestFriend: ['Bir gün köyün en büyük evini ben yapacağım! {title}, planını sen çizersin olur mu?', '{player}, benim en iyi dostumsun!… Ama başkasına söyleme.']
    }
  },

  // ============================================================
  // Yeni evlenilebilir NPC'ler (9) — toplam 12 evlenilebilir
  // ============================================================
  {
    id: 'chun_lan',
    name: 'Bahar',
    gender: 'female',
    role: 'çay konağı hanımı',
    personality: 'zarif, ağır başlı',
    birthday: { season: 'spring', day: 3 },
    lovedItems: ['tea', 'osmanthus', 'chrysanthemum'],
    likedItems: ['honey', 'lotus_seed', 'peach', 'rabbit_foot', 'hanhai_silk'],
    hatedItems: ['iron_ore', 'copper_ore'],
    dialogues: {
      stranger: ['Buyur içeri, bir fincan çay iç. Ben Bahar; bu çay konağı atalarımdan kaldı.', '{title} çayı seviyorsa bundan sonra sık sık uğrasın.'],
      acquaintance: ['Bugün demlediğim erken hasat çayıdır, {title}; bir tatmak ister misin?', 'Çay yaprağı sabah çiği üstündeyken toplanırsa en narin hâlini verir.'],
      friendly: ['{player}’ın damak tadını öğrendim; sevdiğin çayı sana ayırdım.', 'Bizim oralarda birkaç çaylık var; bir gün seni de götüreyim {title}.'],
      bestFriend: ['{title} ile çay içtiğim vakitler, günün en kıymetli anları olur.', 'Bu fincanı yalnız {player} için demledim.']
    },
    marriageable: true,
    heartEventIds: ['chun_lan_heart_3', 'chun_lan_heart_5', 'chun_lan_heart_8'],
    datingDialogues: [
      'Şu fincanı {player} için ayrı harmanladım, bir dene.',
      '{title} ile çay içilen öğle vakitleri, gönlümün en değerli zamanları oldu.',
      'Ömrümün kalan günlerinde de {player} ile aynı demlikten içmek isterim.'
    ],
    zhijiDialogues: [
      'Bu çay yalnız gönül ehline sunulur. {player}, yudumun afiyet olsun.',
      'Çay konağının yükü eskiden yalnız omzumdaydı. {title} olunca biraz hafifledi.',
      'Candan dostla çay içmek, insan ömrünün en hoş nimetlerinden biriymiş.'
    ],
    zhijiHeartEventIds: ['chun_lan_zhiji_7', 'chun_lan_zhiji_9']
  },
  {
    id: 'xue_qin',
    name: 'Nazan',
    gender: 'female',
    role: 'ressam',
    personality: 'mağrur, seçkin',
    birthday: { season: 'winter', day: 10 },
    lovedItems: ['snow_lotus', 'moonstone'],
    likedItems: ['chrysanthemum', 'wintersweet', 'bamboo', 'rabbit_foot', 'hanhai_turquoise'],
    hatedItems: ['pickled_cabbage', 'dried_radish'],
    dialogues: {
      stranger: ['…Işığımı kesiyorsun.', 'Resim almayacaksan boyalara el sürme.'],
      acquaintance: ['{title}’ın resme merakı mı var? Fena gözün yok doğrusu.', 'Şu dağ manzarasının ilhamı, köy ardındaki çağlayandır.'],
      friendly: ['{player}, gün batımında çiftliğin pek güzel göründü; bir resmini yaptım.', 'Eskiden kalabalığı hiç sevmezdim… ama {title} gelince öyle kötü olmuyor.'],
      bestFriend: ['Dünyada resmimi anlayan kimse yok sanırdım… ta ki {player} çıkana dek.', 'Şu resmi {title} için yaptım, iyi sakla.']
    },
    marriageable: true,
    heartEventIds: ['xue_qin_heart_3', 'xue_qin_heart_5', 'xue_qin_heart_8'],
    datingDialogues: [
      '…{player}, kımıldama; şu hâlini resme geçirmek istiyorum.',
      'Eskiden güzelliği yalnız tuvallerde arardım. Şimdi… {title} onlardan da öte.',
      'Bu tablonun adı “Yuva”. Çünkü seninle yuva duygusunu öğrendim.'
    ],
    zhijiDialogues: [
      '…Resim yaparken yanımda durup beni bunaltmayan tek kişi sensin. Demek candan dostluk bu.',
      'Şu tablonun adı “Yoldaş Sesi”… İlhamını {player} verdi.',
      'Evvelce kimsenin beni anlamadığını sanırdım. Artık öyle düşünmüyorum.'
    ],
    zhijiHeartEventIds: ['xue_qin_zhiji_7', 'xue_qin_zhiji_9']
  },
  {
    id: 'su_su',
    name: 'Suna',
    gender: 'female',
    role: 'terzi',
    personality: 'sakin, becerikli',
    birthday: { season: 'summer', day: 3 },
    lovedItems: ['silk', 'wintersweet', 'alpaca_wool', 'peacock_feather'],
    likedItems: ['wool', 'chrysanthemum', 'osmanthus', 'rabbit_fur', 'rabbit_foot'],
    hatedItems: ['iron_ore', 'stone'],
    dialogues: {
      stranger: ['Suna terzi dükkânına hoş geldin.', '{title}, nasıl bir giysi istersen söyle yeter.'],
      acquaintance: ['{title}’ın giysisi biraz sökülmüş, istersen dikebilirim.', 'Şu kumaşın deseni pek nadir; baharlık kaftana yaraşır.'],
      friendly: ['{player} için bir yelek diktim, bakalım üstüne olacak mı?', 'İğneyle iplikte biraz da gönül payı vardır…'],
      bestFriend: ['{player}’ı benim diktiğim giysiler içinde görmek, bana sevinç verir.', 'Artık dikişlerimi yalnız {title} için işlemek isterim.']
    },
    marriageable: true,
    heartEventIds: ['su_su_heart_3', 'su_su_heart_5', 'su_su_heart_8'],
    datingDialogues: [
      '{player} için bir giysi dikiyorum; her ilmikte gönlüm var.',
      '{title} üstüne benim işlediğim elbiseyi geçirdiğinde içim ısınıyor.',
      'Bundan böyle yalnız {player} için diksem… razı olur musun?'
    ],
    zhijiDialogues: [
      '{player} için diktiğim her ilmiğe ayrı bir özen katıyorum… çünkü sen benim can dostumsun.',
      'İçim sıkıldığında {title} aklıma gelince rahatlıyorum.',
      'Hakiki dostlar çok söz etmeden de anlaşır… ama yine de {player} ile daha çok konuşmak isterim.'
    ],
    zhijiHeartEventIds: ['su_su_zhiji_7', 'su_su_zhiji_9']
  },
  {
    id: 'hong_dou',
    name: 'Zeyno',
    gender: 'female',
    role: 'meyhane kızı',
    personality: 'coşkun, eli açık',
    birthday: { season: 'autumn', day: 10 },
    lovedItems: ['watermelon_wine', 'peach_wine', 'jujube_wine'],
    likedItems: ['watermelon', 'peanut', 'corn', 'rabbit_foot'],
    hatedItems: ['tea', 'herb'],
    dialogues: {
      stranger: ['Hey, bir tas ister misin? Ben Zeyno, şu meyhanenin başındayım!', 'İçmezsen de otur hele, {title}; kapımız gönle göre.'],
      acquaintance: ['Bu yılın şeftali şarabı pek güzel oldu, {title}; bir tas alır mısın?', 'Şarap yapmanın sırrı gönül ve sabırdır; başka da yoktur.'],
      friendly: ['{player}, sen benim iyi ahbabımsın; şu küp şarap senden yana olsun!', 'Bir gün karşılıklı kadeh tokuştururuz, kaybeden hesabı öder!'],
      bestFriend: ['Bütün köyde benim gizli küpümden içmeye layık biri varsa o da sensin {title}.', '{player} varken şarabın kokusu bile başka oluyor.']
    },
    marriageable: true,
    heartEventIds: ['hong_dou_heart_3', 'hong_dou_heart_5', 'hong_dou_heart_8'],
    datingDialogues: [
      '{player}! Gel, bugün bir tas birlikte içelim; şarap bugün pek tatlı.',
      'Heh {title}, beni utandırabilen tek kişi sensin.',
      'Bundan sonra küpteki en güzel şarapları {player} için saklayacağım!'
    ],
    zhijiDialogues: [
      '{player}! Gel! Candan dostlar içerken hesap sormaz! Bir dikişte bitir!',
      'Şu dünyada benimle içki yarıştıracak tek kişi {title}! İşte dostluk budur!',
      'Senin gibi bir dost olunca en sert içki bile tatlı gelir.'
    ],
    zhijiHeartEventIds: ['hong_dou_zhiji_7', 'hong_dou_zhiji_9']
  },
  {
    id: 'dan_qing',
    name: 'Cemil',
    gender: 'male',
    role: 'medrese görmüş genç',
    personality: 'zarif, edepli',
    birthday: { season: 'spring', day: 22 },
    lovedItems: ['tea', 'bamboo'],
    likedItems: ['chrysanthemum', 'osmanthus', 'pine_cone', 'rabbit_foot'],
    hatedItems: ['copper_ore', 'firewood'],
    dialogues: {
      stranger: ['Ben Cemil; diyar diyar gezip buralara dek geldim, şu güzel köy beni alıkoydu.', '{title} da kitap ehli midir acep?'],
      acquaintance: ['Bugün pek hoş bir metin okudum, {title} ile paylaşayım isterim.', 'Dağ ulu olmayabilir ama ermiş bir yürek varsa adı büyür; gaKöy de böyledir.'],
      friendly: ['{player}, bir gün senin için güzel bir hat yazısı yazayım.', '{title} gibi bir gönül dostu bulunca ömür boşa geçmemiş sayılır.'],
      bestFriend: ['{player} ile karşılaşmasam buradan çoktan ayrılmış olurdum.', 'Kalem, mürekkep, kâğıt… {title}’ın bir tebessümüne erişemez.']
    },
    marriageable: true,
    heartEventIds: ['dan_qing_heart_3', 'dan_qing_heart_5', 'dan_qing_heart_8'],
    datingDialogues: [
      'Bugün {player} için bir dörtlük yazdım… dinlemek ister misin?',
      '{title} ile tanışmadan evvel kaderimin yalnız kitaplarla geçeceğini sanırdım.',
      '{player}, el ele verip ömrü tamamlamak isterim.'
    ],
    zhijiDialogues: [
      'Dağların yankısı, suyun sesi… Hakiki yoldaşı sonunda buldum. {player}, o sensin.',
      'Bugün yine yeni bir metin yazdım; ilk sana göstermek istedim {title}.',
      'Senin gibi bir gönül dostu olunca sade bir ömür bile bana yeter.'
    ],
    zhijiHeartEventIds: ['dan_qing_zhiji_7', 'dan_qing_zhiji_9']
  },
  {
    id: 'a_tie',
    name: 'Demir',
    gender: 'male',
    role: 'demirci çırağı',
    personality: 'dürüst, saf yürekli',
    birthday: { season: 'autumn', day: 15 },
    lovedItems: ['iron_ore', 'gold_ore'],
    likedItems: ['copper_ore', 'potato', 'corn', 'rabbit_foot'],
    hatedItems: ['chrysanthemum', 'silk'],
    dialogues: {
      stranger: ['A… selam. Ben Demir… Ali Usta’nın çırağıyım.', 'Demir dövmek ağır iştir ama güzeldir… {title} bakmak isterse gösterebilirim.'],
      acquaintance: ['{title}’ın tamir ettireceği alet var mı? Ben… yardım edebilirim.', 'Bugün güzel bir bıçak çıkardım, ustam ilk kez aferin dedi!'],
      friendly: ['{player}’ın aletlerine biraz katkı yaptım, artık daha dayanıklı oldular.', '{title}, benim acemiliğime gülmeyen tek kişisin…'],
      bestFriend: ['{player}… beni hep yüreklendirdiğin için sağ ol.', 'Ustalığı alınca ilk büyük işimi {title}’a vereceğim.']
    },
    marriageable: true,
    heartEventIds: ['a_tie_heart_3', 'a_tie_heart_5', 'a_tie_heart_8'],
    datingDialogues: [
      'Ben… {player} için küçük bir demir süs yaptım. Beğenmezsen de gücenmem…',
      '{title} yanımda durunca örs hafifliyor sanki.',
      '{player}… ustalığa erişeceğim, sonra da… ömrümce sana kol kanat gereceğim.'
    ],
    zhijiDialogues: [
      '{player} yanımda olunca çekicim daha sağlam iner! Dostluk bu olsa gerek!',
      'Sana yeni bir alet yaptım; ötekilerinkinden daha güçlüdür.',
      '{title}, benim en sağlam dayanağımsın!… Yani, candan dostumsun!'
    ],
    zhijiHeartEventIds: ['a_tie_zhiji_7', 'a_tie_zhiji_9']
  },
  {
    id: 'yun_fei',
    name: 'Baran',
    gender: 'male',
    role: 'avcı',
    personality: 'özgür ruhlu, sert',
    birthday: { season: 'summer', day: 8 },
    lovedItems: ['wild_mushroom', 'ginseng'],
    likedItems: ['pine_cone', 'herb', 'wild_berry', 'rabbit_foot'],
    hatedItems: ['gold_ore', 'jade'],
    dialogues: {
      stranger: ['Pek yaklaşma; insan kalabalığını sevmem.', 'Dağa alışmışım, köyün gürültüsü ağır gelir.'],
      acquaintance: ['…{title} yine mi geldi. Neyse, otur bari.', 'Şu mantar dağdan toplandı; sizin tarladakilerden iyidir.'],
      friendly: ['{player}, canımı sıkmayan nadir kişilerdensin.', 'Bir dahaki dağ yürüyüşünde {title} da gelsin; yolu ben bilirim.'],
      bestFriend: ['Ben ömrümde kimseye kolay güvenmedim… {player} hariç.', '{title}, şu dağları birlikte koruyalım.']
    },
    marriageable: true,
    heartEventIds: ['yun_fei_heart_3', 'yun_fei_heart_5', 'yun_fei_heart_8'],
    datingDialogues: [
      '…{player}, ay bu gece güzel. Biraz yanımda otur.',
      'Eskiden yalnız kendime güvenir, yalnız kendime dayanırdım. Şimdi… {title} da var.',
      'Bu dağları bundan böyle {player} ile birlikte kollayacağım.'
    ],
    zhijiDialogues: ['…Kimseye güvenmezdim. Ama sen başka çıktın, {player}.', 'Dağın gizli yollarında yalnız seni yürüttüm. Bu bile yeter.', 'Gönül dostu, kardeşten hafif olmaz.'],
    zhijiHeartEventIds: ['yun_fei_zhiji_7', 'yun_fei_zhiji_9']
  },
  {
    id: 'da_niu',
    name: 'İbo',
    gender: 'male',
    role: 'çoban delikanlı',
    personality: 'dobra, sıcakkanlı',
    birthday: { season: 'winter', day: 3 },
    lovedItems: ['milk', 'hay', 'goat_milk', 'buffalo_milk', 'yak_milk'],
    likedItems: ['egg', 'corn', 'sweet_potato', 'truffle', 'donkey_milk', 'rabbit_foot'],
    hatedItems: ['ruby', 'moonstone'],
    dialogues: {
      stranger: ['Hey! Selam sana! Ben İbo! En çok da hayvanları severim!', '{title}, hayvan besliyor musun? İstersen öğretirim!'],
      acquaintance: ['Bizim sarı inek bugün keyifliydi vallahi!', '{title}, şu kuzunun yününe dokun, ne yumuşak!'],
      friendly: ['{player}’ın tavukları pek iyi bakılmış; bende de böyleydi vaktiyle!', 'Bir ara bizim ağıla gel de yeni doğan buzağıyı gösteririm {title}!'],
      bestFriend: ['{player}, gördüğüm en iyi hayvan bakıcısısın!', '{title}, ilerde birlikte büyük bir çiftlik kursak nasıl olur?']
    },
    marriageable: true,
    heartEventIds: ['da_niu_heart_3', 'da_niu_heart_5', 'da_niu_heart_8'],
    datingDialogues: [
      '{player}! Bugün yeni buzağı doğdu! İlk sana haber vermek istedim!',
      'Heh heh, {title} ile olmak, hayvanlarla olmaktan bile güzelmiş!',
      'Bir gün bizim çiftlik bütün köyün en büyüğü olacak! İnanıyor musun {player}?'
    ],
    zhijiDialogues: [
      '{player}! Sen benim en sağlam yoldaşımsın!',
      'Benimle yağmurda koyun güdüp inek bakman… hepsi gönlüme neşe veriyor!',
      'İkimiz ileride ortak çiftlik kuralım; iki dost bir araya gelince kimse baş edemez!'
    ],
    zhijiHeartEventIds: ['da_niu_zhiji_7', 'da_niu_zhiji_9']
  },
  {
    id: 'mo_bai',
    name: 'Mahir',
    gender: 'male',
    role: 'sazende',
    personality: 'sessiz, hüzünlü',
    birthday: { season: 'spring', day: 12 },
    lovedItems: ['bamboo', 'moonstone'],
    likedItems: ['tea', 'chrysanthemum', 'pine_cone', 'rabbit_foot'],
    hatedItems: ['iron_ore', 'pickled_cabbage'],
    dialogues: {
      stranger: ['…Selam. Saz çalışıyorum, fazla gürültü etmesen iyi olur.', 'Adım Mahir; diyar diyar gezerken buraya düşmüş bir ozanım.'],
      acquaintance: ['{title} da ezgi dinlemeyi sever mi? Bir gün senin için çalarım.', 'Şu parçanın adı “Güz Suyu”; gaKöy için yazdım.'],
      friendly: ['{player} gelmişken iyi oldu; yeni bir ezgi kurdum, bir dinle.', '{title} dinleyince sazımın sesi de içim de hafifliyor.'],
      bestFriend: ['Şu ezginin adı yok… çünkü onu {player} için kurdum.', '{title}, benim gönül sesimi duyan kişisin.']
    },
    marriageable: true,
    heartEventIds: ['mo_bai_heart_3', 'mo_bai_heart_5', 'mo_bai_heart_8'],
    datingDialogues: [
      '…{player}, bu ezgiyi yalnız sana çalıyorum.',
      'Eskiden musikiyi yalnızlık sanırdım… {title} ile birlikteyken sıcaklık da olabiliyormuş.',
      '{player} için bir ezgi besteledim; adı “Dönüş Yolu” olsun.'
    ],
    zhijiDialogues: [
      'Gönül sesi zor bulunur… {player}, sazımdan çıkanları anlayan tek kişisin.',
      'Senin için kurduğum ezgiler çoğalıyor… dostluğun tesiri böyle demek.',
      '{title} varken sazımın sesi daha sıcak çıkıyor.'
    ],
    zhijiHeartEventIds: ['mo_bai_zhiji_7', 'mo_bai_zhiji_9']
  },

  // ============================================================
  // Evlenilemeyen NPC'ler (22) — toplam 22
  // ============================================================
  {
    id: 'wang_dashen',
    name: 'Fatma Teyze',
    gender: 'female',
    role: 'köy aşçısı',
    personality: 'yardımsever, iyi kalpli',
    birthday: { season: 'summer', day: 18 },
    lovedItems: ['rice', 'sesame_oil'],
    likedItems: ['cabbage', 'radish', 'egg', 'rabbit_foot'],
    hatedItems: ['quartz', 'obsidian'],
    dialogues: {
      stranger: ['A yavrum, yeni gelensin değil mi? Çöp gibi kalmışsın, gel de sana bir tas aş vereyim!', 'Ben Fatma Teyze, köyün düğününde derneğinde kazan kaynatan kişiyim!'],
      acquaintance: ['{title}, bugün karnını doyurdun mu? Doyurmadıysan sana sıcak çorba veririm.', 'Yemek yapmanın sırrı şu: tuzu az, gönlü bol koyacaksın.'],
      friendly: ['{player} iyice palazlandı, belli ki benim yemeklerden geri durmuyor!', 'Şu benim meşhur yemeğimdir, {title} bir tadına bak.'],
      bestFriend: ['{player}, öz evladım gibi oldun; sabah akşam didinmen içimi sızlatıyor.', '{title}, ne vakit yuva kuracaksın? Toyunu ben kaldırırım!']
    }
  },
  {
    id: 'zhao_mujiang',
    name: 'Mustafa Usta',
    gender: 'male',
    role: 'marangoz ustası',
    personality: 'sert, titiz',
    birthday: { season: 'autumn', day: 1 },
    lovedItems: ['wood', 'bamboo'],
    likedItems: ['pine_resin', 'camphor_oil', 'rabbit_foot'],
    hatedItems: ['watermelon', 'peanut'],
    dialogues: {
      stranger: ['He? Bana mı geldin? Ben Mustafa Usta. Marangozluk işi varsa dosdoğru söyle.', 'Mıstık yine kaytarmıştır mutlaka…'],
      acquaintance: ['Şu evinin iskeleti sağlam; eski ustaların el işi belli. {title}, iyi koru onu.', 'Ağaç dediğin de insan gibidir; damarına ters gidersen çatlar.'],
      friendly: ['{player}, fena değilsin; işini düzgün yapıyorsun, Mıstık gibi sıçrayıp durmuyorsun.', 'Bir onarım işi olursa… yani, bana gelirsin.'],
      bestFriend: ['{player}, bana gençliğimi hatırlatıyorsun.', 'Şu rende otuz yıldır elimdedir, artık {title} kullansın.']
    }
  },
  {
    id: 'sun_tiejiang',
    name: 'Ali Usta',
    gender: 'male',
    role: 'demirci',
    personality: 'kaba görünümlü, yiğit',
    birthday: { season: 'winter', day: 15 },
    lovedItems: ['gold_ore', 'iridium_ore', 'copper_ore'],
    likedItems: ['iron_ore', 'crystal_ore', 'rabbit_foot'],
    hatedItems: ['chrysanthemum', 'silk'],
    dialogues: {
      stranger: ['Demir işi için doğru yere geldin! Ben Ali Usta!', 'Demir çırağı Demir daha toy; {title}’ın aletine ben bizzat bakarım.'],
      acquaintance: ['İyi çelik yerinde kullanılır; {title}’ın aletleri artık güçlenmeli.', 'Çekicin sesi var ya— tak tak tak— türküden güzel gelir bana!'],
      friendly: ['{player}, şu bıçağı üç gün üç gece dövdüm; bir dene bakalım.', '{title} gibi iyi müşterim olunca örsün başında canım artıyor!'],
      bestFriend: ['Köyün en iyi demir işi artık {player}’ın elindedir.', '{title}, bir gün yiğit işi bir silah yaptırmak istersen Ali Usta burada!']
    }
  },
  {
    id: 'zhang_popo',
    name: 'Emine Nine',
    gender: 'female',
    role: 'dokumacı nine',
    personality: 'şefkatli, çok konuşan',
    birthday: { season: 'spring', day: 7 },
    lovedItems: ['wool', 'silk'],
    likedItems: ['tea', 'pumpkin', 'sweet_potato', 'rabbit_foot'],
    hatedItems: ['gold_ore', 'ruby'],
    dialogues: {
      stranger: ['Aman yavrum, gelmişsin ya, otur hele. Ben Emine Nine, ömrüm dokuma başında geçti.', 'Şu üstündeki giysi de giysi mi? Sana yenisini dokurum ben.'],
      acquaintance: ['{title} gelmiş, iyi oldu. Bir çay iç de geçmişten bir şeyler anlatayım.', 'Ben gençken bu köy ne şendi ne şen…'],
      friendly: ['{player}, ne iyi evlatsın. Sana bir atkı dokudum.', 'Deden de sık sık gelir, benimle iki çift söz ederdi; huyun ona çekmiş.'],
      bestFriend: ['{player} olunca gönlüm rahat ediyor.', 'Şu uzun ömrümde beni en çok sevindiren gençlerden biri oldun {title}.']
    }
  },
  {
    id: 'li_yu',
    name: 'Balıkçı Dede',
    gender: 'male',
    role: 'yaşlı balıkçı',
    personality: 'sakin, dünya malına düşkün değil',
    birthday: { season: 'summer', day: 22 },
    lovedItems: ['koi', 'sturgeon'],
    likedItems: ['crucian', 'bass', 'tea', 'rabbit_foot'],
    hatedItems: ['gold_ore', 'ruby'],
    dialogues: {
      stranger: ['Ho, bir oltacı daha gelmiş. Ben Balıkçı Dede; şu dere başında yirmi senedir otururum.', 'Balık işi aceleye gelmez.'],
      acquaintance: ['Olta, elin uzantısıdır; gönül sakin olunca balık kendi gelir.', '{title}, bugün nasibin nasıl?'],
      friendly: ['{player}, oltan iyice ustalaşmış; biraz bana benzemeye başladın.', 'Şu av tekniğinin adı “yaprak düşüşü”dür; artık {title} da bilsin.'],
      bestFriend: ['Bir olta, bir tas içki, bir dost… {player} ile ömür ziyan sayılmaz.', 'Ömrümce öğrendiğim ne varsa {title}’a bıraktım.']
    }
  },
  {
    id: 'zhou_xiucai',
    name: 'Hoca Efendi',
    gender: 'male',
    role: 'köy hocası',
    personality: 'biraz eski kafalı, sevimli',
    birthday: { season: 'autumn', day: 18 },
    lovedItems: ['bamboo', 'tea'],
    likedItems: ['chrysanthemum', 'osmanthus', 'rabbit_foot'],
    hatedItems: ['pickled_cabbage', 'corn_wine'],
    dialogues: {
      stranger: ['Uzak yoldan gelen dosta neşe olur. Ben Hoca Efendi, köyün ders veren kişisiyim.', '{title} kitap yüzü açmış mıdır acep?'],
      acquaintance: ['Eskiyi bilmek yeniye ışık olur. {title}, son günlerde bir şeyler okudun mu?', 'Bugün Zehra ile Yaman’a yazı öğrettim; iki afacan bir arada… ah ah.'],
      friendly: ['{player}, çiftçi olsan da sende okur yazarlık vakarı var.', 'Yeni bir eski yazma buldum; {title} ile bir gün birlikte inceleyelim.'],
      bestFriend: ['{player}, benim aziz dostlarımdandır!', 'Şu kamış kalem hocamdan yadigârdır; artık {title} kullansın.']
    }
  },
  {
    id: 'wu_shen',
    name: 'Nuriye Teyze',
    gender: 'female',
    role: 'bakkal yardımcısı',
    personality: 'uyanık, dünyayı bilen',
    birthday: { season: 'spring', day: 25 },
    lovedItems: ['honey', 'sesame_oil'],
    likedItems: ['egg', 'rice', 'peanut', 'rabbit_foot'],
    hatedItems: ['wild_mushroom', 'pine_cone'],
    dialogues: {
      stranger: ['Yeni gelen sensin demek? Her Şey Dükkânı’nın asıl sahibi Hasan Enişte’dir ama ufak işleri bana sor.', 'Ben Nuriye Teyze, dükkâna bakarım.'],
      acquaintance: ['{title}, bugünkü lahanalar pek taze; biraz almaz mısın?', 'Hasan Enişte fazla yumuşak davranır, herkese veresiye açar; ben öyle etmem.'],
      friendly: ['{player}, işlerin iyi gidiyor ha! Gizlice söyleyeyim, bir sonraki maldan sana güzel şeyler ayırırım.', 'İnsan hesabını kitabını bilir de öyle yaşarsa rahat eder.'],
      bestFriend: ['{player}, gördüğüm en düzenli gençlerden biri oldun.', 'Bir işin düşerse Nuriye Teyze burada; {title} isterse elbet yardım ederim.']
    }
  },
  {
    id: 'ma_liu',
    name: 'Seyyar Salih',
    gender: 'male',
    role: 'gezgin satıcı',
    personality: 'dili kıvrak',
    birthday: { season: 'winter', day: 25 },
    lovedItems: ['jade', 'prismatic_shard'],
    likedItems: ['gold_ore', 'honey', 'peach', 'rabbit_foot'],
    hatedItems: ['stone', 'wood'],
    dialogues: {
      stranger: ['Hey hey {title}! Ben Seyyar Salih, diyar diyar mal taşırım! Nadir ne varsa bende bulunur!', 'Gel bak hele, dışarıda rastlayamayacağın şeyler var!'],
      acquaintance: ['{title} gelmiş! Bugün sana özel mallar göstereceğim— hem de tek nüsha!', 'Ticaretin özü dürüstlük… heh, bir de kâr tabii.'],
      friendly: ['{player}, artık eski müşterimsin; sana sekiz akçeye veririm!', 'Diyar diyar gezdim ama şu gaKöy kadar insanın içini açan yer görmedim.'],
      bestFriend: ['{player}, malımı teslim edeceğim en güvenilir kişisin.', 'Milleti kandırırım sanırlar ama {title}’ın yanında söylediklerim içtendir.']
    }
  },
  {
    id: 'lao_song',
    name: 'Bekçi Osman',
    gender: 'male',
    role: 'gece bekçisi',
    personality: 'ağırbaşlı, az sözlü',
    birthday: { season: 'summer', day: 10 },
    lovedItems: ['tea', 'firewood'],
    likedItems: ['wood', 'pine_resin', 'herb', 'rabbit_foot'],
    hatedItems: ['watermelon', 'peach'],
    dialogues: {
      stranger: ['…He. Bekçi Osman. Geceleri ben dolaşırım.', 'Gece bir ses duyarsan, {title}, telaş etme.'],
      acquaintance: ['Gece çöktü, {title}; artık evine dön.', 'Ay bugün parlak…'],
      friendly: ['{player}, çalışkan birisin; sabahı kuştan önce karşılıyorsun.', 'Şu sıcak çayı sana ayırdım {title}; gece içini ısıtsın.'],
      bestFriend: ['Yirmi yıldır gece gezerim; benimle sohbet eden az çıktı, {player} onlardan biri.', '{title} olunca içim daha rahattır.']
    }
  },
  {
    id: 'pang_shen',
    name: 'Hatice Abla',
    gender: 'female',
    role: 'peynir ve çökelek dükkânı sahibi',
    personality: 'sert dilli ama açık yürekli',
    birthday: { season: 'autumn', day: 25 },
    lovedItems: ['broad_bean', 'sesame'],
    likedItems: ['rice', 'peanut', 'cabbage', 'rabbit_foot'],
    hatedItems: ['ruby', 'jade'],
    dialogues: {
      stranger: ['Peynir almaya geldin değil mi? Tazecik! Ben Hatice Abla!', '{title}, beni iri görüp ağır sanma; işte elim ayağım pek çabuktur!'],
      acquaintance: ['Bugünkü lor pek yumuşak oldu, {title}; bir tas alır mısın?', 'Sütün özü iyi su ve temiz emektir; bu köyün pınarı bir başkadır!'],
      friendly: ['{player}, sana sağlam bir kalıp ayırdım; götür çorbanın içine doğra!', 'Sen düzgün birine benziyorsun; şu kıvrak dilli satıcılar gibi değilsin.'],
      bestFriend: ['{player}, ne zaman düğün dernek kuracaksın da ben de göreyim?', '{title}, bana yarı evlat oldun vallahi!']
    }
  },
  {
    id: 'a_hua',
    name: 'Zehra',
    gender: 'female',
    role: 'Hasan Enişte’nin torunu',
    personality: 'saf, neşeli',
    birthday: { season: 'spring', day: 1 },
    lovedItems: ['watermelon', 'wild_berry'],
    likedItems: ['peach', 'honey', 'peanut', 'rabbit_foot'],
    hatedItems: ['herb', 'ginseng'],
    dialogues: {
      stranger: ['Sen kimsin? Ben Zehra! Dedem yabancılarla konuşma der… A aa, ben konuştum!', '{title}, senin tarlanda ne yetişiyor? Güzel mi?'],
      acquaintance: ['{title}! Bugün Yaman yine beni kızdırdı! Hıh!', 'Hoca Efendi bana “çiçek” yazısını öğretiyor, ama zor işmiş.'],
      friendly: ['{player}, bak ne güzel taş buldum, sana göstereyim!', 'Ben en çok {title}’ı severim! Yaman’dan yüz kat daha çok!'],
      bestFriend: ['{player}, sana bir resim çizdim! Bak, burada tarlayı sürüyorsun.', 'Büyüyünce ben de {title} gibi güçlü olacağım!']
    }
  },
  {
    id: 'shi_tou',
    name: 'Yaman',
    gender: 'male',
    role: 'köy afacanı',
    personality: 'yaramaz, ele avuca sığmaz',
    birthday: { season: 'summer', day: 25 },
    lovedItems: ['sweet_potato', 'watermelon'],
    likedItems: ['wild_berry', 'corn', 'peanut', 'rabbit_foot'],
    hatedItems: ['tea', 'herb'],
    dialogues: {
      stranger: ['Heh heh! Demek yeni çiftçi sensin? Pek de korkutucu görünmüyorsun ha!', 'Ben Yaman! Bu köyde en hızlı ben koşarım!'],
      acquaintance: ['{title}, yarışalım mı? Kim önce tepeye varacak bakalım!', 'Bugün Hoca Efendi’nin mürekkebine su kattım, fark etmedi! Heh heh!'],
      friendly: ['{player}, bana balık tutmayı öğretsene! Aylin abla çok gürültücü buluyor beni!', 'Sana gizli bir sır söyleyeyim {title}— köy arkasındaki oyukta yarasalar var!'],
      bestFriend: ['Aslında… {player}, anamla babam dışarıda çalışıyor; uzun zamandır dönmediler.', '{title}, ileride de bu köyde kalacaksın değil mi? Gitme olur mu?']
    }
  },
  {
    id: 'hui_niang',
    name: 'Meryem',
    gender: 'female',
    role: 'nakış dükkânı sahibi',
    personality: 'dirençli, yumuşak huylu',
    birthday: { season: 'winter', day: 8 },
    lovedItems: ['silk', 'chrysanthemum', 'alpaca_wool'],
    likedItems: ['wool', 'tea', 'osmanthus', 'rabbit_fur', 'peacock_feather', 'rabbit_foot'],
    hatedItems: ['iron_ore', 'copper_ore'],
    dialogues: {
      stranger: ['Selam, ben Meryem. Şu nakış dükkânı rahmetli eşimden kalmadır.', '{title}, nakış ya da kumaş gerekirse gelip bakabilirsin.'],
      acquaintance: ['Bu dükkânı tek başına döndürmek kolay olmadı ama şükür ayakta kaldı.', '{title}, bugün sakin görünüyorsun.'],
      friendly: ['{player}, omuz vermeyi bilen biri; insana güven veriyor.', 'Şu işli mendili sana vereyim {title}; kendi ellerimle yaptım.'],
      bestFriend: ['{player}, bana insanın tek başına da dimdik durabileceğini gösterdi.', '{title} olunca Meryem kendini daha az yalnız hissediyor.']
    }
  },
  {
    id: 'lao_lu',
    name: 'Rıza Dayı',
    gender: 'male',
    role: 'şarap mahzeni sahibi',
    personality: 'içkiyi seven, konuksever',
    birthday: { season: 'autumn', day: 8 },
    lovedItems: ['watermelon_wine', 'peach_wine'],
    likedItems: ['jujube_wine', 'corn_wine', 'peanut', 'rabbit_foot'],
    hatedItems: ['tea', 'herb'],
    dialogues: {
      stranger: ['Gel hele, bir tas iç! Ben Rıza Dayı!', 'Dünya dediğin içmeden neye yarar, {title}?'],
      acquaintance: ['{title}! Gel, bugün yeni mayalanan şeftali şarabını dene!', 'Zeyno denen kızın eli bu işe benden de yatkın çıktı… heh.'],
      friendly: ['{player}, sen düzgün adamsın; ben de düzgün adamla içerim.', 'Şu üç yıllık küpü senin için sakladım {title}.'],
      bestFriend: ['{player} ile karşılıklı içmek, benim için baht işidir.', '{title}, kaldır tası; dibine kadar!']
    }
  },
  {
    id: 'liu_cunzhang',
    name: 'Muhtar Mehmet',
    gender: 'male',
    role: 'muhtar',
    personality: 'vakarlı, adil',
    birthday: { season: 'summer', day: 5 },
    lovedItems: ['tea', 'ginseng'],
    likedItems: ['herb', 'osmanthus', 'bamboo', 'rabbit_foot'],
    hatedItems: ['pickled_cabbage', 'firewood'],
    dialogues: {
      stranger: ['Demek o eski çiftliği devralan genç sensin? Ben Muhtar Mehmet. Atalarından kalanı yere düşürmezsin umarım.', 'gaKöy’ün töresi vardır; ona riayet etmek gerekir.'],
      acquaintance: ['{title}, son günlerde iyi iş çıkarıyorsun; köylü de bunu konuşuyor.', 'Kızım Elif senden birkaç kez söz etti… hmm.'],
      friendly: ['{player}, köy için ettiklerini görüyorum.', 'Deden de vaktiyle böyle kararlı bir adamdı.'],
      bestFriend: ['{player}, gaKöy için büyük bahttır.', 'Ben yaşlandım artık; köyün yüküne biraz da {title} omuz verecek.']
    }
  },
  {
    id: 'qian_niang',
    name: 'Yasemin',
    gender: 'female',
    role: 'hekim çırağı',
    personality: 'utangaç, yumuşak',
    birthday: { season: 'winter', day: 12 },
    lovedItems: ['herb', 'ginseng'],
    likedItems: ['tea', 'chrysanthemum', 'winter_bamboo_shoot', 'rabbit_foot'],
    hatedItems: ['iron_ore', 'gold_ore'],
    dialogues: {
      stranger: ['A… selam… Ben Yasemin, Hekim Dede’nin çırağıyım.', 'Şifalı ot gerekirse… bana da danışabilirsin…'],
      acquaintance: ['{title} selam… bugün yeni otlar topladım.', 'Hekim Dede pek çok reçete öğretti, ezberlemeye çalışıyorum…'],
      friendly: ['{player}, şu hapı al; deneme için yaptım, bir bakar mısın?', '{title} gelince ben de biraz daha az çekiniyorum.'],
      bestFriend: ['{player} ile durunca sanki biraz daha cesur oluyorum.', '{title} için hazırladığım kuvvet ilacını büyük özenle yapacağım.']
    }
  },
  {
    id: 'he_zhanggui',
    name: 'Kahveci Bekir',
    gender: 'male',
    role: 'kahvehane sahibi',
    personality: 'kıvrak dilli, konuşkan',
    birthday: { season: 'spring', day: 15 },
    lovedItems: ['tea', 'honey'],
    likedItems: ['osmanthus', 'lotus_seed', 'peanut', 'rabbit_foot'],
    hatedItems: ['iron_ore', 'stone'],
    dialogues: {
      stranger: ['Aman efendim, hoş geldiniz! Ben Kahveci Bekir, size güzel bir fincan hazırlayayım!', '{title} ilk kez mi geldi? Otur hele!'],
      acquaintance: ['{title}’ın köşesi hazır, hep ayırırım!', 'Köyün lafı sözü— şey yani haberi— hep bu kahvehanede dolaşır.'],
      friendly: ['{player}, senin çiftlik maceralarını ben de işittim, ha ha ha!', 'İyi çay iyi dosta gider; {title}, sen de benim iyi dostumsun!'],
      bestFriend: ['{player}’ın dürüstlüğüne bütün köy kefildir.', '{title}’ın çay parası mı? Olur mu öyle şey, eski dosta ücret alınmaz!']
    }
  },
  {
    id: 'qin_dashu',
    name: 'Kemal Amca',
    gender: 'male',
    role: 'bahçe sahibi',
    personality: 'dürüst, çalışkan',
    birthday: { season: 'autumn', day: 12 },
    lovedItems: ['peach', 'jujube'],
    likedItems: ['persimmon', 'sweet_potato', 'corn', 'rabbit_foot'],
    hatedItems: ['jade', 'moonstone'],
    dialogues: {
      stranger: ['Selam evlat, ben Kemal Amca. Köyün doğusunda meyve bahçem var.', 'Ağaç dediğin toprağa dikilince sabır ister, {title}; acele etmezsin.'],
      acquaintance: ['{title} da meyve ağacı ekti demek? Bir şey takılırsa sor bana.', 'Bu yılın şeftalisi pek tatlı oldu, sana da birkaç tane ayırdım.'],
      friendly: ['{player}, toprağa elin gittikçe daha iyi alışıyor.', 'Şu birkaç fidanı ben özel yetiştirdim; {title} götürsün diksin.'],
      bestFriend: ['{player}, bana gençliğimin çalışma hevesini hatırlatıyor.', 'Benim bahçeme {title} istediği zaman girip meyve toplayabilir.']
    }
  },
  {
    id: 'a_fu',
    name: 'Ufuk',
    gender: 'male',
    role: 'çoban çocuk',
    personality: 'saf, iyimser',
    birthday: { season: 'winter', day: 5 },
    lovedItems: ['sweet_potato', 'milk', 'goat_milk'],
    likedItems: ['corn', 'hay', 'wild_berry', 'truffle', 'buffalo_milk', 'rabbit_foot'],
    hatedItems: ['jade', 'silk'],
    dialogues: {
      stranger: ['Heh heh, selam! Ben Ufuk! İbo ağabeye inek bakarken yardım ederim!', 'İnekler dünyanın en sevimli yaratıkları, değil mi {title}?'],
      acquaintance: ['{title}! Bugün yine bir inek çitten sıyrılıp kaçtı, heh heh.', 'İbo ağabey diyor ki ben de bir gün büyük çiftlik sahibi olacakmışım!'],
      friendly: ['{player}’ın tavukları yumurtladı mı? Bizim inek bugün süt verdi!', 'Sana ottan bir şapka ördüm {title}; pek güzel değil ama güneşi keser!'],
      bestFriend: ['{player}, bana pek iyi davranıyor… İbo ağabey gibi.', 'Büyüyünce ben de {title} gibi işi gücü rast gitmiş biri olacağım!']
    }
  }
]

/** ID ile NPC tanımını bul */
export const getNpcById = (id: string): NpcDef | undefined => {
  return NPCS.find(n => n.id === id)
                     }
