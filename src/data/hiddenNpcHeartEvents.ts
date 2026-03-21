import type { HeartEventDef } from '@/types'

/** Gizli NPC gönül olayları (HeartEventDef biçimi, requiredFriendship = bağ eşiği) */
export const HIDDEN_NPC_HEART_EVENTS: HeartEventDef[] = [
  // ============================================================
  // Su Ruhu — 3 gönül olayı
  // ============================================================
  {
    id: 'long_ling_heart_1',
    npcId: 'long_ling',
    requiredFriendship: 800,
    title: 'Pul Işığındaki Fısıltı',
    scenes: [
      { text: 'Çağlayanın kıyısına varıp sessizce oturursun. Su sisi içinde zümrüt renkli pul ışıkları belli belirsiz titreşir. Su Ruhu’nun sesi çağlayan gürültüsünün içinden yükselir:' },
      { text: '“Sesimi duyan ilk fani sensin… yüzyıllardır kimse bu suyun dibine böyle yaklaşmadı.”' },
      {
        text: 'Su Ruhu bakışlarını üzerine çevirir; sanki içinde bir şey tartıyordur.',
        choices: [
          {
            text: '“Neden bu yeri yurt edindin?”',
            friendshipChange: 30,
            response: '“Burada ruh damarları birleşir. gaKöy’ün bahtı bu sularda düğümlüdür. Benim koruduğum yalnızca bu göl değildir.”'
          },
          {
            text: '“Çok yalnız olmalısın.”',
            friendshipChange: 50,
            response: 'Su Ruhu uzun süre susar. Sonunda yumuşak bir sesle, “...Evet, yalnızlık vardır.” der. Suyun yüzeyinde ince halkalar yayılır.'
          }
        ]
      }
    ]
  },
  {
    id: 'long_ling_heart_2',
    npcId: 'long_ling',
    requiredFriendship: 1600,
    title: 'İnci Hatırası',
    scenes: [
      { text: 'Bu gece ay ışığı her zamankinden daha parlaktır. Çağlayan gölünde dolunay eksiksiz yansır. Su Ruhu, ay altında gerçek biçimiyle görünür: baştan sona zümrüt pullarla kaplı görkemli bir ruh ejderi.' },
      { text: '“Gerçek adımı biliyor musun?” diye sorar. Sesinde çok ince bir beklenti saklıdır.' },
      { text: '“Yüzyıllar önce suret kazandığımda bana bir ad verilmişti… Alazsu. Derin denizin kıpırtısı demektir.”' },
      {
        text: 'Sudan hafifçe ışıldayan bir inci yükseltir. “Bu, vaktiyle en kıymetli pulumun altında sakladığım eski bir emanettir.”',
        choices: [
          {
            text: '“Bunu iyi koruyacağım.”',
            friendshipChange: 50,
            response: 'Su Ruhu başını eğer. Su yüzeyi yumuşak bir ışıkla parlar. “Onu çıkarmaya razı olduğum tek kişi sensin.”'
          },
          {
            text: 'İnciyi iki elinle dikkatlice alırsın.',
            friendshipChange: 30,
            response: 'İnci avucunda serin ve canlıdır; içinde kalp atışını andıran hafif bir titreşim vardır.'
          }
        ]
      }
    ]
  },
  {
    id: 'long_ling_heart_3',
    npcId: 'long_ling',
    requiredFriendship: 2400,
    title: 'Alazsu’nun Andı',
    scenes: [
      { text: 'Fırtınalı bir gecede çağlayanın suyu coşup taşar. Yağmur altında koşarak vardığında Su Ruhu’nun ruh gücüyle gölü taşmaktan alıkoyduğunu görürsün.' },
      { text: '“Uzak dur!” diye seslenir ama sesi yorgunlukla titrer. “Bu gece ruh damarları bozuldu… daha fazla dayanamayacağım.”' },
      {
        text: 'Pullarının ışığı sönükleşmeye başlamıştır. Gücü tükenmektedir.',
        choices: [
          {
            text: 'Suya atılıp ruh sunusunu ona uzatırsın.',
            friendshipChange: 80,
            response: 'Yaptığın şey onu şaşkına çevirir. Sunuyu alır; kaybolan gücü ağır ağır geri dönmeye başlar. Fırtına dinerken sana fısıldar: “...Teşekkür ederim.”'
          },
          {
            text: 'Kıyıda gözlerini kapatıp bütün yüreğinle onun için dua edersin.',
            friendshipChange: 60,
            response: 'İçinden yayılan sıcaklık dalga dalga ona ulaşır. Su Ruhu bunu hisseder. “Gönlünün sesini aldım.” der. Sağanak hafiflemeye başlar.'
          }
        ]
      },
      { text: 'Fırtına dindikten sonra Su Ruhu ilk kez insan suretiyle karşına çıkar: zümrüt giysili bir kadın. “Bundan böyle bana Alazsu diye seslen.”' }
    ]
  },

  // ============================================================
  // Çiçek Ruhu — 3 gönül olayı
  // ============================================================
  {
    id: 'tao_yao_heart_1',
    npcId: 'tao_yao',
    requiredFriendship: 800,
    title: 'Çiçeğin Dili',
    scenes: [
      { text: 'Sabah erkenden tarlaya çıktığında şeftali ağaçlarının dibinde küçük yabani çiçeklerden halka halka açtığını görürsün. Yapraklarında taze çiy, havadaysa hafif tatlı bir koku vardır.' },
      { text: 'Çiçek Ruhu çiçeklerin arasından başını uzatır. “Bunları ben diktim, güzel olmuş mu?” Gülüşü baharın kendisi gibidir.' },
      {
        text: 'Bir çiçek koparıp sana uzatır.',
        choices: [
          {
            text: '“Çok güzel, sağ ol.”',
            friendshipChange: 40,
            response: 'Gülüşü daha da parlar. “Beğendiysen ne mutlu. Her gün senin için bir tane daha açtırırım.”'
          },
          {
            text: 'Çiçeği onun kulağının yanına iliştirirsin.',
            friendshipChange: 60,
            response: 'Bir an dona kalır; yanakları şeftali çiçeği gibi pembelenir. “S-sen ne yapıyorsun…” der ama çiçeği çıkarmaya da kıyamaz.'
          }
        ]
      }
    ]
  },
  {
    id: 'tao_yao_heart_2',
    npcId: 'tao_yao',
    requiredFriendship: 1600,
    title: 'Düşen Yaprakların Niyeti',
    scenes: [
      { text: 'Çiçek Ruhu’nu korudaki en yaşlı şeftali ağacının altında tek başına otururken bulursun. Yapraklar yağmur gibi dökülür; onun bedeni o yaprakların arasında kimi an belirir, kimi an silikleşir.' },
      { text: '“Bu ağaç… doğduğum yer.” der usulca. “Üç yüz yıldır her bahar buraya dönerim.”' },
      {
        text: 'Avuçlarında tuttuğu tek bir sararmış yaprak dikkatini çeker; ağacın üzerindeki tek solgun yaprak odur.',
        choices: [
          {
            text: '“Ağaç hasta mı?”',
            friendshipChange: 30,
            response: '“Hayır… zayıflayan benim kök bağım.” Gözlerini sana çevirir. “Ama sen geldikten sonra bu toprak yeniden canlandı.”'
          },
          {
            text: 'Sessizce gidip yanına oturursun.',
            friendshipChange: 50,
            response: 'Çiçek Ruhu sana yaslanır, başını omzuna hafifçe bırakır. Yapraklar üstünüze dökülür; sessiz bir kutsama gibi.'
          }
        ]
      }
    ]
  },
  {
    id: 'tao_yao_heart_3',
    npcId: 'tao_yao',
    requiredFriendship: 2400,
    title: 'Kutlu Meyvenin Yüreği',
    scenes: [
      { text: 'İlkbaharın son gününde Çiçek Ruhu’nu yaşlı şeftali ağacının önünde, ellerini birleştirmiş halde bulursun. Tüm bedeni yumuşak bir ışıkla parlıyordur.' },
      { text: '“Çok önemli bir iş yapıyorum.” der; sesi hafifçe titrer. “Kalan son ruh gücümü bu ağaca veriyorum… böylece üç yüz yıl daha yaşayabilecek.”' },
      { text: '“Ama bedeli… uzun bir uyku olabilir.”' },
      {
        text: 'Yüreğin sıkışır.',
        choices: [
          {
            text: 'Elini tutup, “Yükünü benimle paylaş.” dersin.',
            friendshipChange: 80,
            response: 'Parmaklarından geçen sıcaklık ona ulaşır. Gözleri büyür; sönmesi gereken ışık daha da güçlenir. “Demek insanın gönlü de ruh gücüne dönüşebiliyormuş…”'
          },
          {
            text: '“Ben bu ağaca her gün bakarım.”',
            friendshipChange: 60,
            response: 'Gülümsəyerek başını sallar. “Sen varken içim rahat.” Daldan altın renkli bir şeftali koparıp sana verir. “Bu kutlu meyve… benim gönül armağanım.”'
          }
        ]
      },
      { text: 'Yaşlı ağaç yeniden canlanır; dalları tomurcuklarla dolar. Çiçek Ruhu bu manzaraya huzurla bakar. “Teşekkür ederim. Sayende artık yalnız değilim.”' }
    ]
  },

  // ============================================================
  // Ay Tavşanı — 3 gönül olayı
  // ============================================================
  {
    id: 'yue_tu_heart_1',
    npcId: 'yue_tu',
    requiredFriendship: 800,
    title: 'Tokmağın Ezgisi',
    scenes: [
      { text: 'Ay ışıklı korulukta tıkırtılı bir ses yankılanır. Sesi izlediğinde Ay Tavşanı’nın yeşim tokmakla bir şeyler dövdüğünü görürsün.' },
      { text: '“Şşt, gürültü etme!” der, kulaklarını dikerek. “Çok özel bir karışım hazırlıyorum.”' },
      {
        text: 'Otlara yetişemeyecek kadar hızlı davranmaya başlar; karışım kabında tempo gittikçe hızlanır.',
        choices: [
          {
            text: 'Kabı sabitleyip ona yardım edersin.',
            friendshipChange: 40,
            response: '“Aa? Elin ne kadar sağlam!” Ay Tavşanı sevinçle güler. “Sen yardım edince bu ilaç kesin tutacak.”'
          },
          {
            text: 'Vuruşlarına ritim tutarak eşlik edersin.',
            friendshipChange: 50,
            response: 'Bir an şaşırır, sonra kıkırdamaya başlar. “Senin de benimle birlikte dövüyormuş gibi ritim tutman çok komik!” Tokmağın sesi bir anda tatlı bir ezgiye dönüşür.'
          }
        ]
      }
    ]
  },
  {
    id: 'yue_tu_heart_2',
    npcId: 'yue_tu',
    requiredFriendship: 1600,
    title: 'Ay Yurdunun Sırrı',
    scenes: [
      { text: 'Ay Tavşanı’nı dere kıyısında çömelmiş, sudaki ay yansısına dalıp gitmiş halde bulursun. Kulakları düşmüştür; keyifsiz görünüyordur.' },
      { text: '“Aslında… ben oradan gizlice kaçtım.” der kısık sesle. “Ay yurdunda hep aynı şey vardı: ilaç döv, yine döv, yine döv…”' },
      {
        text: 'Göğe bakar. “Ama bazen… orayı da özlediğim oluyor.”',
        choices: [
          {
            text: '“Burada mutlu değil misin?”',
            friendshipChange: 30,
            response: '“Burada çok güzel şeyler var! Çiçek, ot, güzel kokular…” Kulakları yeniden dikilir. “Bir de… sen.” Bunu der demez başını öne eğer; kulak uçları kızarmıştır.'
          },
          {
            text: '“İstersen bir gün dönüp bakabilirsin.”',
            friendshipChange: 50,
            response: '“Olur ama… dönersem yeniden aşağı inmem zor olur.” Sana bakar. “Ben o yüzden burada kalmayı seçtim.”'
          }
        ]
      }
    ]
  },
  {
    id: 'yue_tu_heart_3',
    npcId: 'yue_tu',
    requiredFriendship: 2400,
    title: 'Dönmeyen Ay Tavşanı',
    scenes: [
      { text: 'Güz ortası gecesinde gökten altın bir ışık inip köy dışındaki tepeye düşer. Ay Tavşanı korkuyla koluna sarılır. “Beni almaya geldiler…”' },
      { text: 'Gökyüzünden ağırbaşlı bir ses yankılanır: “Ay tavşanı, yurdun seni geri çağırıyor.”' },
      {
        text: 'Ay Tavşanı ürperir ama sana baktığında gözlerinde gitmek istemeyen bir bağlılık vardır.',
        choices: [
          {
            text: '“O, artık kendi yurdunu buldu.” dersin.',
            friendshipChange: 80,
            response: 'Sesin kararlı biçimde yükselir. Gökyüzü bir süre susar. Sonra altın ışık yavaşça dağılır. Ay Tavşanı sana sımsıkı sarılır. “Teşekkür ederim…”'
          },
          {
            text: 'Elini tutup sessizce yanında durursun.',
            friendshipChange: 60,
            response: 'Avucunun sıcaklığını hisseden Ay Tavşanı derin bir nefes alır ve göğe bağırır: “Ben geri dönmüyorum!” Altın ışık yavaşça sönüp gider.'
          }
        ]
      },
      { text: 'Ay ışığı yeniden sakinleşir. Ay Tavşanı gözlerini siler. “Bundan sonra benim ay yurdum burası.”' }
    ]
  },

  // ============================================================
  // Tilki Eren — 3 gönül olayı
  // ============================================================
  {
    id: 'hu_xian_heart_1',
    npcId: 'hu_xian',
    requiredFriendship: 800,
    title: 'Ruh Alevi Bilmecesi',
    scenes: [
      { text: 'Alacakaranlıkta köy girişinde maviye çalan birkaç alev topu süzülmeye başlar. Köylüler yolunu değiştirir ama sen merakla yaklaşırsın.' },
      { text: '“Oo, cesaretin varmış.” Tilki Eren alevlerin ardından çıkar; elinde saydam bir boncukla oynuyordur. “Bir oyun oynayalım mı?”' },
      {
        text: 'Üç el uzatır—bir an durursun, gerçekten üç mü? Gözlerini ovuşturunca yine iki el görürsün. Bir avucunda boncuk vardır, diğeri boştur. “Söyle bakalım, boncuk hangi elde?”',
        choices: [
          {
            text: 'Sol elini işaret edersin.',
            friendshipChange: 20,
            response: 'Sol elini açar—boştur. Sağ elini açar—o da boştur. Boncuk çoktan cebinde belirmiştir. “Bir dahaki sefere daha dikkatli bak.”'
          },
          {
            text: '“Boncuk kolunda saklı.” dersin.',
            friendshipChange: 50,
            response: 'Tilki Eren bir an durur, sonra kahkaha atar. “İlginç! Kurala göre değil, akla göre düşündün.” Kolunu silkince boncuk gerçekten yere düşer.'
          }
        ]
      }
    ]
  },
  {
    id: 'hu_xian_heart_2',
    npcId: 'hu_xian',
    requiredFriendship: 1600,
    title: 'Yüzyıllık Söz',
    scenes: [
      { text: 'Madenin derininde eski bir tunç ayna bulursun. Tozu sildiğinde aynada kendi yüzün değil, dokuz kuyruklu altın bir tilki belirir.' },
      { text: '“Gördün mü? O, yüzyıllar önceki hâlim.” Tilki Eren’in sesi arkandan gelir. Bu kez yüzünde alaycı gülüş yoktur. “O zamanlar insan dili bile bilmezdim.”' },
      { text: '“Uzun zaman boyunca insanları gözledim; biçimlerini, dillerini, duygularını öğrendim.” Aynaya bakar. “Ama insana benzeyiş arttıkça yalnızlık da büyüdü.”' },
      {
        text: 'Onu ilk kez böyle ciddi görürsün.',
        choices: [
          {
            text: '“Yalnızlık her zaman kötü değildir.”',
            friendshipChange: 30,
            response: '“Öyle mi?” Kaşını kaldırır. Sen de gaKöy’e ilk geldiğin günlerde hissettiğin yalnızlığı anlatırsın. Sessizce dinler; sonunda hafifçe gülümser. “Demek bir bakıma aynı türdeniz.”'
          },
          {
            text: '“Artık yalnız değilsin.”',
            friendshipChange: 50,
            response: 'Uzun süre susar. Sonra alışıldık alaydan uzak, içten bir gülümseme belirir yüzünde. “Evet… artık değilim.”'
          }
        ]
      }
    ]
  },
  {
    id: 'hu_xian_heart_3',
    npcId: 'hu_xian',
    requiredFriendship: 2400,
    title: 'Gerçek ile Gölge',
    scenes: [
      { text: 'Bir gece düşünde altın renkli uçsuz bucaksız bir ova görürsün. Tilki Eren uzakta duruyordur; ardındaki dokuz kuyruk bütünüyle açılmış, ışıl ışıl parlamaktadır.' },
      { text: '“Bu bir düş değil.” der. “Bu benim öz biçimim, benim dünyam.”' },
      { text: 'Sana doğru yürür. “Yüzyıllar boyunca nice kişiyi göz boyamayla aldattım. Ama senin yanında… artık perde kullanmak istemiyorum.”' },
      {
        text: 'Elini uzatır. Parmaklarının hafifçe titrediğini fark edersin.',
        choices: [
          {
            text: 'Elini tutarsın.',
            friendshipChange: 80,
            response: 'Görüntü çatlayıp dağılır; yeniden gerçek dünyaya dönersin. Ama Tilki Eren’in eli hâlâ elindedir—sıcak ve gerçektir. “Bir faninin önünde ilk kez öz suretimle durdum.”'
          },
          {
            text: '“Tilki de olsan insan suretinde de olsan, sen yine sensin.”',
            friendshipChange: 60,
            response: 'Dokuz kuyruğu yavaşça kapanır, altın ışık söner; yine o alaycı delikanlı görünümüne bürünür. Ama bakışlarında daha önce hiç görmediğin bir yumuşaklık vardır.'
          }
        ]
      }
    ]
  },

  // ============================================================
  // Dağ Dervişi — 3 gönül olayı
  // ============================================================
  {
    id: 'shan_weng_heart_1',
    npcId: 'shan_weng',
    requiredFriendship: 800,
    title: 'Dağdaki Taş Oyunu',
    scenes: [
      { text: 'Madenin derinliklerinde gizli bir taş oda keşfedersin. Dağ Dervişi taş masanın önünde bağdaş kurmuş oturuyordur; önünde dizili eski bir taş oyun tahtası vardır.' },
      { text: '“Geldin mi? Otur.” diyerek karşıdaki taş oturağı işaret eder. Taşların üzerinde hafif bir ışık gezinmektedir.' },
      {
        text: '“Bu oyunu üç yüz yıldır sürdürürüm.” der, tahtaya bakarak.',
        choices: [
          {
            text: '“Kiminle oynuyorsun?”',
            friendshipChange: 30,
            response: '“Kendimle.” Sakalını sıvazlar. “İnsanın en uzun hesabı kendi nefsiyledir.”'
          },
          {
            text: 'Bir taşı dikkatle yerine bırakırsın.',
            friendshipChange: 50,
            response: 'Dağ Dervişi senin hamlene bakarken gözlerinde kısa bir şaşkınlık belirir. “İyi hamle. Üç yüz yıldır kimse taşı buraya koymadı.”'
          }
        ]
      }
    ]
  },
  {
    id: 'shan_weng_heart_2',
    npcId: 'shan_weng',
    requiredFriendship: 1600,
    title: 'Usta ile Çırak Arasında',
    scenes: [
      { text: 'Dağ Dervişi seni dağın zirvesine götürür. Kış sabahında bulut denizi ayaklarının altındadır; doğan güneş ufku kızıl altına boyar.' },
      { text: '“Uzun yıllar boyunca nice manzara gördüm.” der derin bir soluk alarak. “Ama şu doğuş… her bakışta yeniden doğmuş gibi gelir.”' },
      {
        text: 'Sonra sana döner. “Evlat, senden bir dileğim var.”',
        choices: [
          {
            text: '“Buyur, söyle.”',
            friendshipChange: 30,
            response: '“İster misin, sana bildiklerimi bırakayım? Gösterişli büyüler değil; bedeni, nefesi ve ömrü korumanın yolunu.” Bakışları içtendir. “Öğrendiklerim bende sönsün istemem.”'
          },
          {
            text: 'Saygıyla eğilip selam verirsin.',
            friendshipChange: 50,
            response: 'Dağ Dervişi memnuniyetle gülümser. “Yüreğinin dengesi nice yıllık yolcudan sağlam. Seni talebe sayıyorum.”'
          }
        ]
      }
    ]
  },
  {
    id: 'shan_weng_heart_3',
    npcId: 'shan_weng',
    requiredFriendship: 2400,
    title: 'Yol Aktarımı',
    scenes: [
      { text: 'Kış gündönümünde Dağ Dervişi senden kar üstünde oturup nefesini dinlemeni ister. Ayaz keskindir ama o yalnızca, “Yüreği sakin olan üşümez.” der.' },
      { text: 'Ne kadar zaman geçtiğini anlamazsın. Gözlerini açtığında etrafındaki karın halka halinde eridiğini görürsün; bu, bedeninden yükselen ısıdır.' },
      { text: '“Oldu.” Dağ Dervişi ilk kez yüksek sesle güler. “Fani bedeniyle yerin göğün soluğunu kendine çağıran ender kişilerdensin.”' },
      {
        text: 'Koynundan eski, sade bir matarayı andıran kap çıkarır. “Bu, uzun yıllardır yanımdaki en kıymetli eşyadır.”',
        choices: [
          {
            text: '“Bunu alamam.”',
            friendshipChange: 60,
            response: '“Alırsın.” diyerek eline sıkıştırır. “Benim ona artık ihtiyacım yok. Senin varlığın, eşyaların hepsinden değerli.” Gözlerinde ince bir yaş parıltısı doğar.'
          },
          {
            text: 'İki elinle saygıyla kabul edersin.',
            friendshipChange: 80,
            response: '“Güzel.” diye başını sallar. “Bundan sonra gaKöy’ün dağ yoluna göz kulak olacak kişi sensin. Artık içim rahattır.”'
          }
        ]
      }
    ]
  },

  // ============================================================
  // Düş Dokuyucu — 3 gönül olayı
  // ============================================================
  {
    id: 'gui_nv_heart_1',
    npcId: 'gui_nv',
    requiredFriendship: 800,
    title: 'Tezgâhın Sesi',
    scenes: [
      { text: 'Gece yarısı ince bir dokuma sesi seni köy girişindeki eski kuyunun yanına çeker. Ay ışığının altında yarı saydam bir tezgâh kendi kendine belirir.' },
      { text: 'Düş Dokuyucu tezgâhın başında oturur; ince parmakları ışıklı teller arasında dolaşır. Dokuduğu şey kumaş değil—ayın ışığının kendisidir.' },
      {
        text: 'Seni fark edince hareketleri yavaşlar. “Benim ne ördüğümü… görebiliyor musun?” diye sorar.',
        choices: [
          {
            text: '“Ay ışığını mı?”',
            friendshipChange: 40,
            response: 'Usulca gülümser. “Evet. Ay ışığını düşe çeviriyorum. Dolunay gecelerinde gaKöy halkının güzel düşler görmesinde benim ilmiklerim vardır.”'
          },
          {
            text: '“Çok güzel bir şey dokuyorsun.”',
            friendshipChange: 50,
            response: 'Başını eğer, sesi iyice hafifler. “Çok uzun zamandır… kimse dokuduğum şeye güzel dememişti.” Teller avuçlarında yumuşak bir ışıkla parlar.'
          }
        ]
      }
    ]
  },
  {
    id: 'gui_nv_heart_2',
    npcId: 'gui_nv',
    requiredFriendship: 1600,
    title: 'Yurdun Yönü',
    scenes: [
      { text: 'Düş Dokuyucu bugün tezgâh başında değildir. Köy çıkışında kuzeye dönük durur; bedeni her zamankinden daha siliktir.' },
      { text: '“Yurdumun yönünü arıyorum.” der. Sesi rüzgârdaki bir tel kadar incedir. “Ama artık onun nerede olduğunu anımsamıyorum.”' },
      { text: '“Aklımda yalnızca kocaman bir dut ağacı kaldı. Altında bir tezgâh, çevresinde boyanmış ipler, serilmiş bezler… O zamanlar hâlâ yaşıyordum.”' },
      {
        text: 'Gümüş renkli bir gözyaşı yere düşer ve küçük parlak bir çiçeğe dönüşür.',
        choices: [
          {
            text: '“Burası da yurt olabilir.”',
            friendshipChange: 50,
            response: 'Sana bakar; gümüş gözlerinde suretin belirir. “Belki… haklısın. İnsanın gönül verdiği yer de yurt sayılır.”'
          },
          {
            text: 'Yere düşen çiçeği alıp sessizce ona uzatırsın.',
            friendshipChange: 40,
            response: 'Çiçeği avucunda tutar. Çiçek sıcak bir ışık yaymaya başlar. “Demek birinin seni hatırlaması böyle bir şeymiş…”'
          }
        ]
      }
    ]
  },
  {
    id: 'gui_nv_heart_3',
    npcId: 'gui_nv',
    requiredFriendship: 2400,
    title: 'Varılan Yer',
    scenes: [
      { text: 'Kış gündönümünün gecesinde Düş Dokuyucu’yu her zamankinden daha net görürsün. Karların ortasında durmaktadır; kollarında gümüş ışıklı bir dokuma vardır.' },
      { text: '“Bunu bir yıl boyunca işledim.” Kumaşı açınca üzerinde gaKöy’ün dört mevsimi görünür; sanki canlıymış gibi parlar.' },
      { text: '“Baharın şeftali çiçekleri, yazın nilüferli suları, güzün kızaran yaprakları, kışın karı… ve senin siluetin.” Yüzü hafifçe kızarır.' },
      {
        text: 'Dokumayı sana uzatır. “Bütün gönlümü buna işledim. Lütfen kabul et.”',
        choices: [
          {
            text: '“Hayatımda aldığım en güzel armağan bu.”',
            friendshipChange: 80,
            response: 'Gözleri kızarır ama yüzünde gülümseme vardır. “Teşekkür ederim. Senin sayende sonunda… varacağım yeri buldum.” Bedeni hiç olmadığı kadar net ve gerçek görünmeye başlar.'
          },
          {
            text: 'Dokumayı dikkatle onun omuzlarına yerleştirirsin.',
            friendshipChange: 60,
            response: '“Sen…” Sesi titrer. “Neden bunu kendine saklamadın?” Başını sallarsın. Düş Dokuyucu kısık sesle, “...Tatlı budala.” der ama kumaşı sıkıca üstüne sarar.'
          }
        ]
      }
    ]
  }
]

/** NPC ID’ye göre gönül olaylarını getir */
export const getHiddenNpcHeartEvents = (npcId: string): HeartEventDef[] => {
  return HIDDEN_NPC_HEART_EVENTS.filter(e => e.npcId === npcId)
}

/** Olay ID’sine göre gönül olayını getir */
export const getHiddenNpcHeartEventById = (eventId: string): HeartEventDef | undefined => {
  return HIDDEN_NPC_HEART_EVENTS.find(e => e.id === eventId)
      }
