import type { SecretNoteDef } from '@/types'

/** Tüm gizli notlar */
export const SECRET_NOTES: SecretNoteDef[] = [
  {
    id: 1,
    type: 'tip',
    title: 'Yıpranmış Kâğıt',
    content: 'Şeftali Korusu’nun derinliklerinde bir şeyler saklı gibi… İlkbaharda şeftali çiçekleri dökülürken yerde ara sıra ender şeyler bulunur.',
    usable: false
  },
  {
    id: 2,
    type: 'treasure',
    title: 'Madencinin Son Sözü',
    content: 'Ömrüm boyunca biriktirdiğim akçeyi maden ocağının 20. katındaki kuytu bir köşeye sakladım… Bu mektubu bulduysan, o para artık senindir.',
    usable: true,
    reward: { money: 500 }
  },
  {
    id: 3,
    type: 'npc',
    title: 'Balıkçı Dede’nin Zevki',
    content: 'Safa Dede en çok alabalığı sever. Der ki, akarsuyun gerçek beyi alabalıktır; onu tutabilen kişi ancak hakiki balıkçı sayılır.',
    usable: false
  },
  {
    id: 4,
    type: 'story',
    title: 'gaKöy Vakayinâmesi · İlk Kısım',
    content: 'Yüz yıl evvel bir ermiş, dünyadan kopuk bu vadiyi keşfetti. Vadide dört bir yana şeftali çiçekleri saçılır, dereler şırıl şırıl akardı; adeta yeryüzündeki saklı cennet gibiydi. O da burada bir köy kurup yerleşti ve adına "gaKöy" dedi.',
    usable: false
  },
  {
    id: 5,
    type: 'treasure',
    title: 'Bambu Korusu Haritası',
    content: 'Bambu korusunun en gür yerinde yosun tutmuş bir taş vardır; o taşı kaldırırsan güzel bir yeşim parçası bulursun.',
    usable: true,
    reward: { items: [{ itemId: 'jade', quantity: 1 }] }
  },
  {
    id: 6,
    type: 'tip',
    title: 'Balıkçılık Öğüdü',
    content: 'Dolunay gecelerinde sudaki balıklar daha atak olur. Ender balıkları avlamak istersen ayın dolduğu geceyi dene.',
    usable: false
  },
  {
    id: 7,
    type: 'npc',
    title: 'Demircinin Sırrı',
    content: 'Ali Usta gün boyu demir dövse de gönlünde en çok bakır cevheri yatar. Der ki, bakır metallerin en sıcak huylusudur.',
    usable: false
  },
  {
    id: 8,
    type: 'story',
    title: 'gaKöy Vakayinâmesi · Son Kısım',
    content: 'Ermiş göçtükten sonra köylüler bu toprağı nesiller boyu korudu. Şöyle bir töre koydular: Şeftali Korusu kesilmeyecek, dere kirletilmeyecek. gaKöy işte böylece bir asır boyunca sessizce yaşadı.',
    usable: false
  },
  {
    id: 9,
    type: 'treasure',
    title: 'Dere Kıyısının Sırrı',
    content: 'Derenin kıvrıldığı yerdeki büyük kayanın altına vaktiyle biraz akçe saklamıştım. Bulursan al, işine yarasın.',
    usable: true,
    reward: { money: 800 }
  },
  {
    id: 10,
    type: 'tip',
    title: 'Toplayıcının Notu',
    content: 'Yağmurlu günlerde dağ bayırda, normalde pek rastlanmayan kimi otlar ve nimetler ortaya çıkar. Hele yağmurdan sonraki bambu korusu ayrıca görülmeye değer.',
    usable: false
  },
  {
    id: 11,
    type: 'npc',
    title: 'Gül Ana’nın Gönül Derdi',
    content: 'Gül Ana en çok osmanlı çiçeğini sever. Her sonbahar, o ağacın altında bütün gün oturur.',
    usable: false
  },
  {
    id: 12,
    type: 'treasure',
    title: 'Maden Ocağının İşareti',
    content: 'Maden ocağının yeraltı ırmağı katının en ucunda, suyun oya oya açtığı bir oyuk vardır. İçinde kıymetli bir aytaşı saklıdır.',
    usable: true,
    reward: { items: [{ itemId: 'moonstone', quantity: 1 }] }
  },
  {
    id: 13,
    type: 'story',
    title: 'Uzak Yol Kervanları',
    content: 'Çok eski vakitlerde gaKöy dünyadan kopuk değildi. Batıdaki çorak düzlüklerden geçen bir kervan yolu, burayı uzak diyarlara bağlardı. Tüccarlar o engin taşlı düzlüğe "Ulu Deniz" derdi; çünkü kumla taş deniz gibi sonsuz görünürdü.',
    usable: false
  },
  {
    id: 14,
    type: 'tip',
    title: 'Ekin Öğüdü',
    content: 'Ürünün kalitesini nice etken belirler: toprağın bereketi, sulama sıklığı, mevsimin uygunluğu… Hatta günlük bahtın bile tesiri olabilir.',
    usable: false
  },
  {
    id: 15,
    type: 'npc',
    title: 'Aşçı Bacı’nın Dileği',
    content: 'Fatma Bacı öteden beri en kusursuz pilavı yapmak ister. Der ki, iyi pirinç her güzel yemeğin temelidir.',
    usable: false
  },
  {
    id: 16,
    type: 'treasure',
    title: 'Eski Kuyu Rivayeti',
    content: 'Köy girişindeki kurumuş eski kuyunun dibinde, köy kurulurken gömülen bir koruyucu hazine olduğu söylenir. Kuyu kuruduysa da emanet hâlâ orada olmalı.',
    usable: true,
    reward: { money: 1500 }
  },
  {
    id: 17,
    type: 'story',
    title: 'Loncanın Eski Günleri',
    content: 'Serüvenciler Loncası ilkin yalnızca avcıların toplandığı küçük bir kulübeydi. Sonra maden ocağındaki yaratıklar çoğaldı; avcılar da yaratıkları temizlemek ve köylüyü korumak için loncayı kurdu.',
    usable: false
  },
  {
    id: 18,
    type: 'tip',
    title: 'Yıldırımlı Maden',
    content: 'Şimşekli havada maden ocağına girildiğinde cevherin kalitesinin daha yüksek olduğu söylenir. Belki de yıldırım bir şeyi uyandırıyordur…',
    usable: false
  },
  {
    id: 19,
    type: 'npc',
    title: 'Molla’nın Alışkanlığı',
    content: 'İlyas Molla her gün bir demlik güzel çay içer. Der ki, çay gönlü arındırır, gözü açar, zihni uyandırır. Ona iyi çay götürmek asla yanlış olmaz.',
    usable: false
  },
  {
    id: 20,
    type: 'treasure',
    title: 'Şeftali Korusu Hazinesi',
    content: 'Şeftali Korusu’ndaki en yaşlı ağacın altında kadim bir tohum gömülüdür. Söylendiğine göre onu köyü kuran ermiş bırakmıştır.',
    usable: true,
    reward: { items: [{ itemId: 'ancient_seed', quantity: 1 }] }
  },
  {
    id: 21,
    type: 'story',
    title: 'Müze Rivayeti',
    content:
      'Müze eskiden köyün eski ibadet ocağıydı. Sonradan bir bilgin, köylülerin bulduğu fosilleri ve eski eşyaları bir arada saklamayı önerince yapı müzeye çevrildi. Derler ki bütün sergiler tamamlanınca bir mucize vuku bulur.',
    usable: false
  },
  {
    id: 22,
    type: 'tip',
    title: 'Sera Sırrı',
    content: 'Kışın tabiat solar; ama serada dört mevsim bahar hüküm sürer. Bir seran varsa kışın da ekin yetiştirmeyi sürdürebilirsin.',
    usable: false
  },
  {
    id: 23,
    type: 'npc',
    title: 'Hasan Enişte’nin Dirlik Düzeni',
    content: 'Hasan Enişte en çok sıhhatine dikkat eder; der ki ginseng bütün otların beyi sayılır. Ona ginseng verirsen pek memnun olur.',
    usable: false
  },
  {
    id: 24,
    type: 'treasure',
    title: 'Terkedilmiş Maden Kuyusu',
    content: 'Maden ocağının derinliklerinde kapatılmış bir yan tünel vardır; denir ki bu, daha kadim bir maden kuyusunun kalıntısıdır. İçinde yalnız altınla gümüş değil, kıymetli iridyum cevheri de bulunur.',
    usable: true,
    reward: { money: 2000, items: [{ itemId: 'iridium_ore', quantity: 1 }] }
  },
  {
    id: 25,
    type: 'story',
    title: 'gaKöy’ün Saklı Hâli',
    content:
      'gaKöy’ün yer altı derinliklerinde kadim bir kudretin mühürlü olduğu söylenir. Köyü kuran ermişin burayı seçmesi boşuna değildi; o, bu kudretin bekçisiydi. Şimdi bekçi yok, kudret yavaş yavaş uyanıyor… Belki de maden ocağında yaratıkların çoğalmasının sebebi budur.',
    usable: false
  },
  // Kutlu varlık izleri
  {
    id: 26,
    type: 'story',
    title: 'Pul Işığı Altında Fısıltı',
    content:
      'Köy ihtiyarları anlatır: Arka dağın çağlayanının derinliklerinde zümrüt renkli bir kutlu ejder yaşarmış. Her ilkbahar yağmuru gecesinde suda pul ışıkları parıldar. Efsanevi Zümrüt Ejder Balığı tutulabilirse, belki onun varlığı da hissedilebilir.',
    usable: false
  },
  {
    id: 27,
    type: 'story',
    title: 'Yeşim Tokmak Parçası',
    content:
      'Ot toplarken tesadüfen ak yeşim renkli bir kırık parça bulundu; biçimi sanki bir havan tokmağının kırığına benziyor. İhtiyarlar der ki dolunay gecesi bambu korusunun derinlerinde bazen tıkır tıkır ilaç dövme sesi duyulur. Lakin onu kimin dövdüğünü bilen yoktur.',
    usable: false
  },
  {
    id: 28,
    type: 'story',
    title: 'Altın Işığın Gölgesi',
    content:
      'Bir değil birkaç köylü, alacakaranlıkta bir altın ışığın süzüldüğünü gördüğünü söyler. Rivayete göre köy yakınındaki dağlarda bin yıl ermiş bir tilki ruhu yaşar; ne tümden hayırlıdır ne de tümden uğursuz, yolculara bilmece sorup onlarla eğlenir. Derler ki ancak yeterince varlıklı ve halkça sevilen kişiler onun dikkatini çekebilir.',
    usable: false
  }
]
