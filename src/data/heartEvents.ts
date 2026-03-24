import type { HeartEventDef } from '@/types'

/** Tüm gönül olayları tanımları */
export const HEART_EVENTS: HeartEventDef[] = [
  // ============================================================
  // Elif (liu_niang) —— Muhtarın kızı, yumuşak huylu ve zeki
  // ============================================================
  {
    id: 'liu_niang_heart_3',
    npcId: 'liu_niang',
    requiredFriendship: 800,
    title: 'Dere Kıyısında Şiir',
    scenes: [
      {
        text: `Çiçekli Dere boyunca gezinirken salkım söğüdün altında Elif'i görürsün. Ağaca yaslanmış, elinde sararmış bir şiir mecmuası vardır. Hafif esen yel sayfaların üstüne birkaç çiçek yaprağı bırakır.`
      },
      {
        text: `Elif başını kaldırıp ince bir tebessüm eder: "Sen de mi soluklanmak için buraya geldin? Ben en çok burada okumayı severim. Derenin sesi, sanki kendi kendine çalan bir saz gibidir."`
      },
      {
        text: `Mecmuayı açıp bir dizeyi gösterir: "Bunu okumuş muydun? Her okuyuşumda eski zaman insanlarının yüreğini düşünürüm."`,
        choices: [
          {
            text: `"Bu dizelerde güzel bir yurt özlemi var. Tıpkı gaKöy gibi."`,
            friendshipChange: 120,
            response: `Elif'in gözleri parlar: "Sen de öyle mi düşünürsün? Babam bu köye gaKöy adını verirken hep böyle bir huzur düşlemiş. Şiirden anlayan biriyle konuşmak ne hoş."`
          },
          {
            text: `"Doğrusu ben eski şiirlere pek vâkıf değilim..."`,
            friendshipChange: 40,
            response: `Elif hafifçe güler: "Olsun. Şiirin güzelliği anlamakta değil, hissetmektedir. İstersen otur, sana bir tane okuyayım."`
          },
          {
            text: `"Şiirden çok çalışmayı severim ben."`,
            friendshipChange: -40,
            response: `Elif'in gülüşü biraz solar: "Çalışkanlık elbet iyidir... ama bazen durup nefes almak da gerekir." Başını eğip yeniden sayfaları çevirmeye koyulur.`
          }
        ]
      },
      {
        text: `Gün akşamaya yüz tutar. Dere üstüne altın renkli ışıklar vurur. Elif şiir defterini kapatıp ayağa kalkar.`
      },
      {
        text: `"Bugün seninle söyleşmek gönlüme iyi geldi." Kitabın arasından kurutulmuş bir çiçek yaprağı çıkarıp sana uzatır. "Bunu al. Aramızda bir... şiir dostluğu nişanesi olsun." Derken yanakları hafifçe kızarır; sonra dere kıyısındaki patikadan ağır ağır uzaklaşır.`
      }
    ]
  },
  {
    id: 'liu_niang_heart_5',
    npcId: 'liu_niang',
    requiredFriendship: 1600,
    title: 'gaKöyün Saklı Hikâyesi',
    scenes: [
      {
        text: `Akşam üstü Elif seni bulur. Yüzü biraz ciddidir: "Vaktin var mı? Seni bir yere götürmek isterim. Bazı şeyleri... artık bilmen gerektiğini düşünüyorum."`
      },
      {
        text: `Seni köyün ardındaki terk edilmiş eski bir türbenin önüne götürür. Gıcırdayan kapıyı açınca içeride, üstü ufak yazılarla dolu kadim bir taş görürsün.`
      },
      {
        text: `"Bu, gaKöyün soy taşıdır." der Elif usulca. "İki yüz yıl evvel yaşananları anlatır. Burası sıradan bir köy değildir. Savaşlardan kaçan bir topluluk, dağları aşarak bu saklı vadiyi bulmuş; burada ağaç dikmiş, su yolu açmış ve bir daha dışarıdaki kavgaya karışmamaya yemin etmiş."`,
        choices: [
          {
            text: `"Demek bu yüzden buralar dünyadan uzak, masal yurdu gibi."`,
            friendshipChange: 120,
            response: `Elif başını sallar, gözleri hafifçe dolar: "Evet. Bizimkiler nesilden nesile bu sırrı korudu. Babam hep der ki, gaKöyün huzuru nice fedakârlıkla kuruldu; kıymetini bilmek gerekir."`
          },
          {
            text: `"Bunları neden bana anlatıyorsun?"`,
            friendshipChange: 80,
            response: `Elif bir süre susar, sonra alçak sesle konuşur: "Çünkü sen bu köye geldiğinden beri toprağı emekle işledin, insanlara el uzattın. Sana güveniyorum. Bir de... rahmetli deden de bunları bilirdi."`
          }
        ]
      },
      {
        text: `Elif taşın yanına gidip üstündeki tozu eliyle siler: "Burada bir de kehanet yazıyor. Diyor ki; 'Bu yurdun dirliği de çöküşü de sonradan gelene bağlıdır. Eğer temiz yürekli biri bu toprağı yeniden işlerse, eski bereket geri döner.' Babam, o kişinin sen olduğuna inanıyor."`
      },
      {
        text: `Türbeden çıktığınızda gece iyice çökmüştür. Gökte sayısız yıldız vardır. Elif dönüp sana bakar: "Bunları dinlediğin için sağ ol. Bu sır... bundan böyle ikimizin emaneti olsun." Ay ışığında bakışı hem yumuşak hem de kararlıdır.`
      }
    ]
  },
  {
    id: 'liu_niang_heart_8',
    npcId: 'liu_niang',
    requiredFriendship: 2400,
    title: 'Ay Altında Şeftali Çiçeği',
    scenes: [
      {
        text: `Gecenin ilerleyen bir vaktinde kapına hafifçe vurulur. Dışarı çıktığında yerde bir mektup bulursun. Üstünde şöyle yazar: "Bu gece ay dolunay. Şeftali bahçesinde seni beklerim. — Elif"`
      },
      {
        text: `Köyün doğusundaki şeftali bahçesine gidersin. Ay ışığı su gibi dalların üstüne dökülür, yapraklar gece rüzgârında usulca savrulur. Elif, bahçenin ortasındaki yaşlı ağacın altında durmaktadır. Üstünde sade renkli bir elbise, saçında yeni açmış bir çiçek vardır.`
      },
      {
        text: `"Geldin..." der. Ay ışığı yüzünü aydınlatır. "Ben seni bekliyordum." Birkaç adım yaklaşır. Sesi, savrulan yaprakları ürkütmemek ister gibi hafiftir. "Uzun zamandır içimde sakladığım sözler var..."` 
      },
      {
        text: `Elif başını eğer, elleriyle eteğinin ucunu sıkıştırır: "Sen gaKöye gelmeden önce, ömrüm boyunca bu küçük köyde yaşar giderim sanırdım; şiir okur, sessiz bir hayat sürerdim. Ama sen geldin... Toprağı dirilttin, insanlara omuz verdin, köyü yeniden canlandırdın. Benim içimde de sanki bir bahar açtı." Başını kaldırdığında gözlerinde yaş parıltısı vardır. "Ben... seni seviyorum."`,
        choices: [
          {
            text: `Elini usulca tutarsın: "Ben de seni seviyorum Elif. O dere kıyısındaki günden beri."`,
            friendshipChange: 160,
            response: `Elif'in gözyaşları dökülür ama yüzü çiçek gibi açar: "Gerçekten mi? Ben... bunun yalnız benim gönlümde kaldığını sanmıştım." Elini sıkıca kavrar. "Öyleyse bundan sonra bu bahçe bizim söz yerimiz olsun."`
          },
          {
            text: `"Elif, yüreğime dokundun... ama düşünmek için biraz vakte ihtiyacım var."`,
            friendshipChange: 0,
            response: `Elif bir an durur, sonra başını hafifçe sallar: "Olur. Seni beklerim. Ağaçlar her yıl yeniden çiçek açıyor... benim gönlüm de öyle." Gülümsese de ay ışığında gözleri kızarmıştır.`
          }
        ]
      },
      {
        text: `Bir gece yeli eser, dallardan çiçekler savrulur. Sen ve Elif, ayın altında yan yana durursunuz. O an gaKöy gerçekten de masallardaki yurtlara benzer. Uzaktan derenin sesi gelir; sanki toprağın kendisi size hayır dua etmektedir.`
      }
    ]
  },

  // ============================================================
  // Aylin (qiu_yue) —— Balıkçı kızı, neşeli ve hareketli
  // ============================================================
  {
    id: 'qiu_yue_heart_3',
    npcId: 'qiu_yue',
    requiredFriendship: 800,
    title: 'Olta Yarışı',
    scenes: [
      {
        text: `Aylin zıpır zıpır koşarak yanına gelir, elinde iki olta sallamaktadır: "Hey! Boş musun? Haydi benimle gel. Sana öyle bir yer göstereceğim ki daha önce görmediğine yemin ederim!" Cevabını beklemeden kolundan çekiştirip seni dağa doğru sürükler.`
      },
      {
        text: `Bir koruluğu geçip iri kayaların arasından dolanınca önünüzde zümrüt gibi bir gölet açılır. Etrafı taşlarla çevrilidir. Güneş, ağaç aralarından benek benek suya düşer. Su yüzeyi ayna gibi durudur; arada bir sıçrayan balıklar halkalar bırakır.`
      },
      {
        text: `"Burası benim gizli avlak yerim!" der Aylin, ellerini beline koyup gururla. "Köyde benden başka bilen yok! Buradaki balıkların iriliği başka yerde bulunmaz." Oltalardan birini senin eline tutuşturur. Gözleri ışıldar. "Haydi, yarışalım! Bir tütsü süresi dolmadan kim daha çok balık tutarsa o kazanır! Kaybeden ötekine yemek ısmarlar!"`,
        choices: [
          {
            text: `"Olur! Ama ben de sana acımam!"`,
            friendshipChange: 120,
            response: `Aylin kahkahayı basar: "İşte böyle! Bana acınmasından hiç hoşlanmam! Hadi bakalım, hazır ol — başlıyoruz!" Oltayı ustalıkla savurur; daha ilk hareketten işi bildiği bellidir.`
          },
          {
            text: `"Ben oltada pek usta değilim. Bana öğretir misin?"`,
            friendshipChange: 80,
            response: `Aylin başını yana eğer, muzipçe güler: "Pekâlâ, bugün sana bu işin inceliğini göstereyim. Bak şimdi — bilek hafif olacak, savuruş düzgün olacak, en mühimi de sabır. Ama yarış yine yarış!"`
          },
          {
            text: `"Balık tutmanın nesini yarıştıracağız ki..."`,
            friendshipChange: -40,
            response: `Aylin yanaklarını şişirir: "Hıh! Balık tutmak dünyanın en güzel işidir! Neyse, şimdilik alınmadım say. Bir gün iri bir balık yakalayınca ne demek istediğimi anlarsın!"`
          }
        ]
      },
      {
        text: `Bir tütsü vakti geçtikten sonra avınızı sayarsınız. Aylin altı balık tutmuştur, sen üç. Gülmekten iki büklüm olur: "Hah hah! Kaybettin işte! Hasan Enişte'nin dükkânından bana ballı çörek ısmarlayacaksın! Sakın sözünden dönme!"`
      },
      {
        text: `Oltaları toplarken Aylin birden sessizleşir. Suya bakarak der ki: "Aslında... beni çocukken anamla babam buraya getirirdi. Üçümüz burada bütün gün otururduk." Sonra dönüp sana gülümser. "Bugün burada seninle olmak da bana iyi geldi. Bir dahaki sefere bir daha yarışırız!"`
      }
    ]
  },
  {
    id: 'qiu_yue_heart_5',
    npcId: 'qiu_yue',
    requiredFriendship: 1600,
    title: 'Yağmur Gecesinin Sırrı',
    scenes: [
      {
        text: `Günlerdir süren sağanak dereyi kabartmış, herkes evine çekilmiştir. Aylin'in evinin önünden geçerken kapısının aralık olduğunu fark edersin; içeride lamba da yanmamaktadır.`
      },
      {
        text: `Kapıyı itip içeri girdiğinde şimşeğin ışığında Aylin'i pencere yanında dizlerine sarılmış halde görürsün. Yüzünde yaş izleri vardır. Seni görünce aceleyle gözlerini siler: "Sen... niye geldin? Bir şeyim yok. Sadece... yağmurlu havaları sevmem."`
      },
      {
        text: `Yanına oturursun. Uzunca bir sessizlikten sonra konuşur, sesi alıştığın neşeden uzaktır: "Üç yıl önce de böyleydi... İşte böyle bir sağanakta annemle babam aşağı çaya suyun hâline bakmaya gittiler. Bir daha da dönmediler." Sesi titremeye başlar. "Herkes sele kapıldılar dedi... çok aradılar ama hiçbir iz bulamadılar."`,
        choices: [
          {
            text: `Sessizce hırkanı omzuna bırakırsın ve yanında kalırsın.`,
            friendshipChange: 160,
            response: `Aylin bir an donakalır, sonra kendini tutamaz. Başını omzuna yaslayıp uzun uzun ağlar. Sakinleşince fısıldar: "Sağ ol... Onlar gittikten sonra hep güler gibi yaptım. Kimse bana üzülmesin istedim. Ama yağmur yağınca... onları çok özlüyorum."`
          },
          {
            text: `"Aylin... her şeyi tek başına taşımak zorunda değilsin. Üzülünce bana gel."`,
            friendshipChange: 120,
            response: `Aylin'in dudakları titrer, sonunda gözyaşlarına engel olamaz: "Ben... hep kendimi güçlü saydım. Ama her yağmurda düşünüyorum; o gün onları tutsaydım, her şey değişir miydi diye..." Gözlerini siler. "Bunları gerçekten dinlemek ister misin?"`
          }
        ]
      },
      {
        text: `Yağmur yavaş yavaş diner. Bulutların arasından ince bir ışık süzülür. Aylin gözlerini oraya kaldırır: "Annem hep derdi ki, yağmurdan sonra mutlaka güneş çıkar. Bir de gülersem onların da gökte benimle güleceğini söylerdi."`
      },
      {
        text: `Aylin ayağa kalkar, derin bir nefes alır. Sonra yüzünü sana çevirir; gözleri hâlâ ıslaktır ama gülüşü yeniden aydınlanmıştır: "Tamam! Aylin oturup ağlayacak değil ya! Yarın yağmur kesilirse balığa gideriz. Annemle babam beni en çok gülerken ve oltadayken görmek isterdi." Gözleri parlar. "Hem... sen yanımdayken yağmur da o kadar korkunç gelmiyor."`
      }
    ]
  },
  {
    id: 'qiu_yue_heart_8',
    npcId: 'qiu_yue',
    requiredFriendship: 2400,
    title: 'Günbatımında Kayık',
    scenes: [
      {
        text: `Aylin sabahın köründe kapına dayanır. Sırtında koca bir sepet vardır; içinde olta, yem, azık ve bir demlik çay tıkabasa doludur. "Bugün uzağa gidiyoruz! Çiçekli Dere'nin aşağısındaki sazlığa! Sana anamın gizli usulünü göstereceğim!"`
      },
      {
        text: `Aylinlerin küçük kayığına binip akıntıyla aşağı inersiniz. Aylin pruvada oturmuş, ayaklarını suya sarkıtmış bir türkü mırıldanmaktadır. Altın ışıkta sazlıklar salınır, su kuşları yüzeyi yarıp geçer. "Bu ezgiyi bana anam öğretmişti." der. "Söylerdi ki, bu türkü çalınınca balıklar kendi ayağıyla gelir."`
      },
      {
        text: `Geniş bir suya varınca Aylin ciddileşir. Sana özel bir atış biçimi öğretir. Misina havada güzel bir yay çizer, neredeyse hiç sıçratmadan suya iner. "Buna 'Söğüt Yaprağı Atışı' deriz." der. "Anamın icadıydı. Eli söğüt dalı gibi yumuşak, gönlü durgun su gibi sakin olacak."`,
        choices: [
          {
            text: `Dikkatle öğrenir, tekrar tekrar deneyip kusursuz bir atış yaparsın.`,
            friendshipChange: 120,
            response: `Aylin senin attığın misinanın çizdiği yayı görünce ağzı açık kalır: "Vay be! Bir öğleden sonra içinde öğrendin ha! Ben bunu çalışmak için bir ay debelenmiştim!" Neşeyle zıplar, az daha kayığı devirecektir. "Anam görseydi seni o da överdi!"`
          },
          {
            text: `"Ne güzel hüner. Demek annen gerçekten pek usta biriymiş."`,
            friendshipChange: 120,
            response: `Aylin kuvvetle başını sallar; bakışlarında gururla özlem karışmıştır: "O, gaKöyün gördüğü en iyi balıkçıydı! Benden yüz kat daha usta! Ben de onun bildiklerini öğrenip başkalarına öğretmek istiyorum. Böylece adı unutulmaz."`
          }
        ]
      },
      {
        text: `Güneş batıya inince sazlıklar turuncuya boyanır. Oltaları toplar, kayığı suyun üstünde ağır ağır bırakırsınız. Aylin kayığın önünde oturur; günbatımı yüz çizgilerini yumuşatmıştır.`
      },
      {
        text: `Birden sana döner, gözlerini ciddiyetle gözlerine diker. "Nasıl söylesem diye çok düşündüm..." Alışılmadık biçimde çekingen davranır, saçının ucunu parmağına dolamaktadır. "Sen gaKöye geldiğinden beri her günüm ayrı güzel geçiyor. Eskiden tek başıma da olur sanırdım ama şimdi..." Derin bir nefes alır ve her şeyi birden söyler: "Ben seni seviyorum! Hem de çok! Balıktan bile daha çok! Benim bildiğim en büyük sevme budur!" Sonra yüzü kıpkırmızı olup başını dizlerine gömer.`
      }
    ]
  },

  // ============================================================
  // İsmail (a_shi) —— Madenci, az konuşan bir yiğit
  // ============================================================
  {
    id: 'a_shi_heart_3',
    npcId: 'a_shi',
    requiredFriendship: 800,
    title: 'Madenden Kurtuluş',
    scenes: [
      {
        text: `Madenin derinlerinde çalışırken ilerden boğuk bir ses gelir; ardından kaya parçalarının düştüğünü duyarsın. Sesin geldiği yöne koştuğunda göçmüş taş duvarın yanında İsmail'i görürsün. Sol bacağı büyük bir kayanın altındadır, alnında kanlı bir çizik vardır ama dişini sıkıp tek ses çıkarmaz.`
      },
      {
        text: `Seni görünce kaşlarını hafifçe çatar: "...Sen burada ne arıyorsun." Bir an durur. "Yaklaşma. Tekrar çöker."`,
        choices: [
          {
            text: `Sözünü dinlemez, kayanın yanına koşup bacağı üstündeki taşı kaldırmaya çalışırsın.`,
            friendshipChange: 160,
            response: `İsmail bir an afallar; bir şey söyleyecek gibi olur ama susar. Bütün gücünle taşı kaldırıp onu güvenli duvara yaslarsın. Uzunca süre başı eğik oturur; sonra ancak iki kelime çıkar ağzından: "...Sağ ol."`
          },
          {
            text: `"Ben yardım getireceğim! Sen bekle!"`,
            friendshipChange: 80,
            response: `İsmail ağzını açar ama seni durdurmaz. Köylülerle geri döndüğünde hâlâ aynı yerde, aynı dik duruşla beklemektedir; taş duvarın üstünde ise tırnak izleri oluşmuştur. Kurtarıldıktan sonra sana yalnızca başını eğer: "...Eline sağlık."`
          },
          {
            text: `"Buralar çok tehlikeli. Niye tek başına bunca derine indin?"`,
            friendshipChange: -40,
            response: `İsmail'in bakışları kararır: "...Benim işim bu." Yüzünü çevirir, başka da bir şey demez. Sonunda ona yine yardım etmiş olsan da aradaki hava ağırlaşır.`
          }
        ]
      },
      {
        text: `Yarasını sarıp onu yavaş yavaş dışarı çıkarırsın. Yüzü her zamanki gibi donuktur ama yürürken ağırlığını bilinçli biçimde sana vermektedir; sanki sessizce sana dayanıyordur.`
      },
      {
        text: `Madenin ağzına geldiğinizde İsmail cebinden kaba görünümlü, soluk renkli bir taş çıkarır. "Bunu al." der. "Dıştan bakınca bir şeye benzemez... ama içinde cevher var." Kulaklarının ucu hafif kızarmıştır. "Ben... teşekkür etmeyi pek bilmem. Bunu onun yerine say."`
      }
    ]
  },
  {
    id: 'a_shi_heart_5',
    npcId: 'a_shi',
    requiredFriendship: 1600,
    title: 'Billur Mağarası',
    scenes: [
      {
        text: `Bir sabah İsmail alışılmadık biçimde kapına gelir. Elinde iki madenci feneri vardır. Sessizce bir süre bekler, sonra kısaca der ki: "...Benimle gel. Sana göstermek istediğim bir yer var."`
      },
      {
        text: `Seni madene götürür ama bu kez bildik patikadan değil, dar bir yarıktan geçer. Peşine takılır, eğri büğrü bir dehlizde uzun süre yürürsünüz. Yol gitgide daralır. Tam artık ilerlenmez dediğin anda önünüzde koca bir boşluk açılır.`
      },
      {
        text: `Nefesin kesilir. Gördüğün yer dev bir yeraltı mağarasıdır. Duvarların her yanı billur kümeleriyle doludur. Kimisi buz kadar duru, kimisi mora çalan bir ışık saçar, kimisi de kehribar gibi sıcak renkte parlar. Fener ışığı vurunca tüm mağara bir saray misali ışıldar.`,
        choices: [
          {
            text: `"İsmail... burası olağanüstü. Beni getirdiğin için sağ ol."`,
            friendshipChange: 120,
            response: `İsmail'in ağzının kenarı fark edilecek kadar az yukarı kıvrılır; muhtemelen gördüğün en belirgin gülümsemesi budur. "Hı." der. Mor billur kümesine ışığı tutar. "...Bunu bulmak iki yılımı aldı. Kimseye göstermedim."`
          },
          {
            text: `"Bunlar çok para eder doğrusu!"`,
            friendshipChange: -40,
            response: `İsmail'in gözleri bir an sertleşir, sonra yine taş kesilir. "...Satılık değil." Kısa cümlesi mağarada yankılanır. Büyük bir kristal sütunun yanına gidip yüzeyine, narin bir canlıya dokunur gibi eliyle yoklar.`
          }
        ]
      },
      {
        text: `İsmail mağaranın ortasına oturup feneri kısmaya başlar. Karanlık çöktüğünde kristallerin kendiliğinden ışık verdiğini hayretle fark edersin. O yumuşak, titrek aydınlık sanki toprağın altında asılı kalmış bir yıldız göğüdür. "Ben çocukken... karanlıktan korkardım." der. "Sonra bu taşları buldum. Bana şunu öğrettiler... En koyu karanlıkta bile ışık vardır."`
      },
      {
        text: `Bir süre daha susar, ardından konuşur: "Taş konuşmaz. Yalan da söylemez. Ben taşlarla, insanlardan daha rahat ederim." Sonra sana dönüp bakar; fenerin zayıf ışığı gözlerinde titreşir. "Ama... sen başka." Neyi kastettiğini açıklamaz. Ayağa kalkıp, "Hadi. Dönelim." der.`
      }
    ]
  },
  {
    id: 'a_shi_heart_8',
    npcId: 'a_shi',
    requiredFriendship: 2400,
    title: 'Taş Gönlün Sözü',
    scenes: [
      {
        text: `Günlerdir İsmail'i ortalarda görmezsin. Hasan Enişte, onun evine kapanıp habire tak tuk sesleri çıkardığını söyler. İçine kurt düşer ve onu görmeye gidersin.`
      },
      {
        text: `Kapısını çalarsın. İçerideki ses aniden kesilir. Uzun bir bekleyişten sonra kapı aralanır. İsmail'in yüzü taş tozuyla kaplı, saçları darmadağındır; elleri birkaç yerinden sarılmıştır. Seni görünce bir an afallar, elindekini arkasına saklar: "Sen... niye geldin? Ben iyiyim."`
      },
      {
        text: `Arkada çalışma tezgâhına gözün kayar. Küçük çekiçler, keski, zımpara ve işe yaramamış taş kırıkları her yere dağılmıştır. Köşede de kenarları iyice yıpranmış bir taş işçiligi kitabı durmaktadır.`,
        choices: [
          {
            text: `"İsmail, elin yara olmuş. İzin ver de sarayım."`,
            friendshipChange: 120,
            response: `İsmail biraz direnir gibi olur ama sonunda isteksizce elini uzatır. Parmaklarındaki yaraları yeniden sararken yüzünü hep başka yana çevirir; ama elinin hafiften titrediğini hissedersin. "...Sağ ol." der, neredeyse duyulmayacak bir sesle.`
          },
          {
            text: `"Ne yapıyordun sen? Bana da gösterir misin?"`,
            friendshipChange: 80,
            response: `İsmail olduğu yerde kasılır; kulakları bir anda kıpkırmızı olur. O kadar uzun susar ki, artık cevap vermeyecek sanırsın. Sonra yavaşça arkasındaki elini öne getirir. Avucunda bir şey vardır. "...Daha bitmedi." der utangaçça.`
          }
        ]
      },
      {
        text: `Sonunda kararını verir. Derin bir nefes alıp göğsünden küçük bir bez bohça çıkarır ve beceriksizce sana uzatır. Açınca içinden billur mağarasındaki mor taştan işlenmiş bir kolye çıkar. Işığa tutulduğunda yumuşak mor bir parıltı saçmaktadır. Şekli ise bir çiçektir; her yaprağı ince ince oyulmuştur.`
      },
      {
        text: `İsmail'in yüzü kızarıktır. Kelimeler ağzından parça parça dökülür: "Bunu... uzun zamandır yapıyorum. Çok taşı ziyan ettim... ellerimi de defalarca kestim. Çünkü ben... güzel söz bilmem. Başkaları gibi de... olamam." Eteğini sıkarcasına giysisini avuçlar, sonra ilk kez bu kadar açık bakışla sana bakar. "Ama... en iyi taşı, en güzel biçime sokup, en... en kıymetli kişiye vermek istedim." Sesi giderek kısılır. "O kişi... sensin. Hep sendin."`
      }
    ]
  },

  // ============================================================
  // Bahar (chun_lan) —— Çayhane sahibi, zarif ve ağırbaşlı
  // ============================================================
  {
    id: 'chun_lan_heart_3',
    npcId: 'chun_lan',
    requiredFriendship: 800,
    title: 'İlk Bahar Çayı',
    scenes: [
      {
        text: `Sabah sisi henüz dağılmamıştır. Bahar seni çay bahçesine çağırır. Kat kat uzanan yeşil sıralar, günün ilk ışığında yıkanmış gibi parlar; tomurcukların üstünde çiy damlaları vardır.`
      },
      {
        text: `"Bunlar bu yılın ilk çay yaprakları; en kıymetlileridir." der Bahar. İnce parmaklarıyla bir filizi tutar. "Çay toplamanın da usulü vardır: bir tomurcuk, bir yaprak. El hafif olacak; sanki kundaktaki bebeğin yüzüne dokunur gibi."`,
        choices: [
          {
            text: `Onun hareketlerini dikkatle taklit eder, büyük bir özenle yaprak toplamaya koyulursun.`,
            friendshipChange: 120,
            response: `Bahar topladığın yapraklara bakar, gözlerinde takdir belirir: "Elin şaşmamış, yaprak da zedelenmemiş. Bu işe yatkınsın." Dudaklarında yumuşak bir gülümseme açılır.`
          },
          {
            text: `"Yaprakların hepsi birbirine benziyor. İyisi kötüsü nasıl ayırt edilir?"`,
            friendshipChange: 40,
            response: `Bahar iki yaprağı yan yana tutup gösterir: "Bak, bunun rengi daha dengeli, damarları daha berrak. Çay da insan gibidir; ayırmak için dikkat ister."`
          },
          {
            text: `"Bu iş çok yavaş. Tahıl ekip biçmek daha kârlı değil mi?"`,
            friendshipChange: -40,
            response: `Bahar'ın tebessümü bir anlık duraklar, sonra yeniden toparlanır: "Her işin ayrı hikmeti vardır. Ben atalarımdan kalan bu bahçeyi boş bırakmaya kıyamam."`
          }
        ]
      },
      {
        text: `Toplama işi bitince seni çayhaneye götürür ve ilk çayı kendi elleriyle kavurur. Demir tavada yapraklar dönüp dururken her yana hoş bir koku yayılır. Hareketleri sessiz bir dans gibidir; sakin ama kusursuz.`
      },
      {
        text: `Bahar demlediği ilk fincanı iki eliyle sana uzatır: "Bu baharın ilk bardağıdır. Bizim ocakta bu, en kıymetli konuğa sunulur." Kirpikleri hafifçe titrer. "Bu yıl... onu sana ikram etmek istedim."`
      }
    ]
  },
  {
    id: 'chun_lan_heart_5',
    npcId: 'chun_lan',
    requiredFriendship: 1600,
    title: 'Yağmur Altında Çayhane',
    scenes: [
      {
        text: `Ansızın bastıran yağmur seni Bahar'ın çayhanesinde alıkoyar. Kiremitlere düşen yağmurun sesi ve çayın buruk kokusu içeriyi doldurur.`
      },
      {
        text: `Bahar pencere önünde sessizce oturmuştur; yağmur perdesine dalıp gitmiştir. Göz kenarlarının hafif kızardığını fark edersin. Uzun bir sessizlikten sonra usulca der ki: "Bugün babamın ölüm yıldönümü."`
      },
      {
        text: `"Babam erkenden göçtü. Çayhane bana kaldı. Köyde çoğu kimse bir kadının bu yükü taşımasının zor olduğunu söyledi; kimi yeniden evlenmemi, kimi de dükkânı satmamı öğütledi." Sesi durgun su gibidir ama dipten titrer. "Ama burası babamın emanetidir. Beş kuşaktır süren alın teri. Ben nasıl bırakırım?"`,
        choices: [
          {
            text: `"Sen çok iyi gidiyorsun Bahar. Baban seninle gurur duyardı."`,
            friendshipChange: 120,
            response: `Bahar'ın gözünden bir damla yaş süzülür; çabucak mendiliyle siler. Dudaklarında ferah bir gülümseme vardır: "Sağ ol. Bunları duymayı uzun zamandır bekliyormuşum."`
          },
          {
            text: `Sessizce fincanına çay eklersin ve yanında oturursun.`,
            friendshipChange: 120,
            response: `Bahar fincandaki çaya bakar, uzun süre susar. Sonra alçak sesle konuşur: "Çay ekleyişin... babamın elini hatırlattı bana. Onun kadar yumuşak." Başka bir şey söylemez ama yüz hatları belirgin biçimde yumuşamıştır.`
          }
        ]
      },
      {
        text: `Yağmur hafifleyince Bahar dolabın kuytusundan eski bir çay küpü çıkarır. Üstünde tek bir "B" harfi kazılıdır, yüzeyi zamanla kararmıştır. "Bu, babamın kavurduğu son çaydır. Yıllardır açmaya kıyamadım." Küpü büyük bir saygıyla açıp demler. Kokusu ağır ama derindir.`
      },
      {
        text: `"Eskiden yağmurlu günlerde hep tek başıma oturup babamı anardım." Bahar fincanını, yağmur sonrası aydınlanan göğe doğru hafifçe kaldırır. "Ama bugün... sen yanımdayken o yalnızlık biraz olsun dağıldı."`
      }
    ]
  },
  {
    id: 'chun_lan_heart_8',
    npcId: 'chun_lan',
    requiredFriendship: 2400,
    title: 'Ay Altında Dem',
    scenes: [
      {
        text: `Güz başında bir gece, Bahar'dan ince yazılı bir davet alırsın: "Ay parlakken çayhanede bir demlik çay hazırdır. Seni beklerim."`
      },
      {
        text: `Çayhanenin küçük avlusunda taş masa üstüne sade bir çay sergisi kurulmuştur. Bir kandilin ışığı birkaç kokulu dalı aydınlatır. Bahar ay ışığı renginde bir giysiyle diz çökmüş, bütün takımını önüne dizmiştir. Uzanıp baksan, sanki bir minyatür tablosu gibidir.`
      },
      {
        text: `"Buyur otur." der. Hareketleri su gibi akar. Fincan ısıtır, dem koyar, su döker, süzer; her adımı ölçülü ve zariftir. Sonunda fincanı iki eliyle sana uzatır. Bakışı ay ışığı kadar yumuşaktır.`,
        choices: [
          {
            text: `Fincanı iki elle alır, dikkatle koklayıp yudumlarsın. "Hayatımda içtiğim en güzel çay bu."`,
            friendshipChange: 120,
            response: `Bahar'ın yanakları pembeye çalar. Gülüşünü saklayamaz: "Çünkü... onu demleyen, içine tüm gönlünü kattı."`
          },
          {
            text: `"Bahar, bu gece her şey pek güzel. Ay, koku, bu sessizlik... bir de sen."`,
            friendshipChange: 160,
            response: `Bahar'ın parmakları titrer; neredeyse fincanı düşürecektir. Başını öne eğer ama kulakları kıpkırmızıdır. "Sen... böyle sözleri birden söyleyince insanın dili tutuluyor." Sesi hem hafif hem de yumuşacıktır.`
          }
        ]
      },
      {
        text: `Üç dem geçtikten sonra Bahar fincanını bırakır, ellerini dizleri üstünde birleştirir. Derin bir nefes alır. Gözlerinde ayın yansıması, suya düşmüş ışık gibidir.`
      },
      {
        text: `"Bizim ocakta ömürde bir kere kavrulan özel bir çay vardır. Adına 'yâr çayı' derler; yalnız bir ömür boyunca en kıymetli kişiye ikram edilir." Kolunun içinden küçük bir kese çıkarır. "Bunu bu yılın en iyi yapraklarından kendi ellerimle hazırladım. Toplarken de kavururken de aklımdaydın." Bu kez gözlerini kaçırmaz. "Ben söz söylemekte usta değilim. Ama bu fincandaki niyeti... anlarsın sanırım."`
      }
    ]
  },

  // ============================================================
  // Nazan (xue_qin) —— Ressam, soğuk duruşlu ama derin
  // ============================================================
  {
    id: 'xue_qin_heart_3',
    npcId: 'xue_qin',
    requiredFriendship: 800,
    title: 'Resimdeki Kişi',
    scenes: [
      {
        text: `Nazan'ın resim odasının önünden geçerken kapısının yarı açık olduğunu görürsün. Aralıktan baktığında onu büyük bir tuvalin önünde, elinde fırça, hiç kıpırdamadan dururken yakalarsın.`
      },
      {
        text: `Varlığını sezmiş olmalı ki arkasını dönmeden konuşur: "Madem geldin, gir. Ama ses çıkarma." İçeri girdiğinde, tuvalde sisler içinde dağlar ve aşağı inen bir çağlayan görürsün. Eseri yarım ama havası pek derindir.`
      },
      {
        text: `Nazan birden fırçayı indirir ve sana kaşlarını çatar. "Oraya geç. Pencerenin yanına." der. Dediğini yaparsın. O da yeniden fırçayı alır; bir sana, bir tuvale bakar.`,
        choices: [
          {
            text: `Sessizce durur, kıpırdamadan ona eşlik edersin.`,
            friendshipChange: 120,
            response: `Uzunca bir zaman geçer. Nazan sonunda fırçayı bırakır, birkaç adım geri çekilip yaptığı işe bakar. Dudaklarının ucunda neredeyse görünmez bir memnuniyet vardır. "Hımm... Işık fena olmadı. Kıpırdayabilirsin."`
          },
          {
            text: `"Beni mi çiziyorsun?" diyerek merakla yanaşırsın.`,
            friendshipChange: 40,
            response: `Nazan tuvali bedeninle kapatır. "Bitmeyen resme bakılmaz. Sende hiç sabır yok mu?" der. Azarlıyor gibidir ama gözlerinde gerçek bir öfke bulunmaz.`
          }
        ]
      },
      {
        text: `Sonradan Hasan Enişte'den duyarsın: Nazan'ın o gün yaptığı manzara resminde, çağlayanın kıyısında pencereye dayanmış bir insan silueti varmış. Söylentiye göre son üç yılda insan figürü çizdiği tek resim oymuş.`
      }
    ]
  },
  {
    id: 'xue_qin_heart_5',
    npcId: 'xue_qin',
    requiredFriendship: 1600,
    title: 'Kar Altında Dallar',
    scenes: [
      {
        text: `Kışın ilk karı yağmıştır. Arka dağda Nazan'ı tek başına bir ağacın altında bulursun. Önünde şövale vardır. Parmakları soğuktan kızarmış ama o, bembeyaz zemine düşen koyu dalları resmetmeyi sürdürmektedir.`
      },
      {
        text: `"Yaklaşma." der ayak sesini duyar duymaz. Sesi serttir. "Karın düzenini bozarsın." Ama dudaklarının morardığını da görürsün.`
      },
      {
        text: `Dolambaçlı bir yoldan yanına ulaşıp getirdiğin sıcak çayı uzatırsın. Nazan sana bir bakış atar; bir şey söyleyecek gibi olur ama sonunda fincanı alıp bir yudum içer. "...Gereksiz iş." diye mırıldanır.`,
        choices: [
          {
            text: `Üstündeki giysiyi omzuna bırakır, sonra da sessizce yanına oturup resmini izlersin.`,
            friendshipChange: 160,
            response: `Nazan'ın fırçası bir an havada asılı kalır. Verdiğin giysiyi geri çevirmez, yalnızca yüzünü azıcık yana çevirir. Dudaklarının ucunda belli belirsiz bir eğrilik görürsün. Uzun süre sonra ancak, "...Sen üşümüyor musun, sersem?" diyebilir.`
          },
          {
            text: `"Bu tablo pek güzel. Elin her geçen gün daha da olgunlaşıyor."`,
            friendshipChange: 80,
            response: `Nazan yan gözle bakar: "Benim elim hep iyiydi." Bir an susar, sonra ekler: "...Ama bugün dallar gerçekten resme layık açtı."`
          }
        ]
      },
      {
        text: `O günün akşamı evine döndüğünde kapının önünde bir tomar bulursun. Açınca içinden koyu mürekkeple işlenmiş zarif bir dal resmi çıkar. Köşesine küçücük şöyle yazılmıştır: "Soğukta açan dal, kendini ancak anlayana gösterir. — Armağan" İmza yoktur ama yazı kime ait bilirsin.`
      }
    ]
  },
  {
    id: 'xue_qin_heart_8',
    npcId: 'xue_qin',
    requiredFriendship: 2400,
    title: 'Fırça Gönüldaşı',
    scenes: [
      {
        text: `Nazan'ın resim odasının kapısı bu kez kapalıdır. Tıklatınca içeriden sesi gelir: "...Sen misin? Gir. Başkası görmesin."`
      },
      {
        text: `Kapıyı açınca olduğun yerde kalırsın. Dört duvarın her yanı resimlerle kaplıdır. gaKöyün dört mevsimi işlenmiştir: ilkbahar çiçekleri, yaz göleti, güz ekinleri, kış dağları... Ve her resimde, tarlalarda çalışan belli belirsiz tek bir siluet vardır.`
      },
      {
        text: `Nazan odanın ortasında sana arkasını dönmüştür. Sesi her zamankinden yumuşaktır: "Gördün işte. Bu resimlerin hepsini pencere gerisinden, gizlice çizdim." Yavaşça sana döner. Gözleri nemlidir. "Bu köye geldikten sonra, niçin renklerimin birden ısındığını bir türlü anlayamamıştım."`,
        choices: [
          {
            text: `"Nazan... demek bunca vakittir bunları çiziyordun."`,
            friendshipChange: 120,
            response: `Nazan başını öte yana çevirir; sesi titrer: "Öyle bakma bana. Ben sadece... o manzaraları güzel buldum, hepsi bu." Ama kolunu sıkan parmakları, ne kadar heyecanlandığını ele verir.`
          },
          {
            text: `Yanına yaklaşır, gözlerinin içine ciddiyetle bakarsın.`,
            friendshipChange: 120,
            response: `Nazan'ın nefesi bir an hızlanır. Geri çekilmek ister ama sırtı duvara dayanmıştır. "Ne... ne yapıyorsun?" O soğuk kabuğunda ilk çatlak o anda görünür.`
          }
        ]
      },
      {
        text: `Nazan derin bir soluk alır, koynundan avuç içi kadar küçük bir resim çıkarır. Üstünde iki dal birbirine dolanmıştır; biri koyu, biri açık tondadır. Yaprakları birbirine karışmış gibidir.`
      },
      {
        text: `"Ben tatlı söz bilmem. Kalabalığı da sevmem. İnsanlar beni soğuk, kibirli bulur." Sesi gittikçe alçalır, sanki her kelimeyi zorla çıkarıyordur. "Ama... sen başka oldun. Sen benim dünyama renk kattın." Küçük resmi eline sıkıştırır ve hızla arkasını döner. "Bunu al. Geri getirme. Bu benim... son gururum." Omuzları hafifçe titremektedir.`
      }
    ]
  },

  // ============================================================
  // Suna (su_su) —— Terzi, sakin ve eli mahir
  // ============================================================
  {
    id: 'su_su_heart_3',
    npcId: 'su_su',
    requiredFriendship: 800,
    title: 'Kopan İpliğin Tasası',
    scenes: [
      {
        text: `Suna'nın terzi dükkânının önünden geçerken içeriden hafif bir iç çekiş duyarsın. Kapıyı açtığında onu tezgâh başında dalgın dalgın renkli ipliklere bakarken bulursun.`
      },
      {
        text: `"Aa, geldin." der biraz mahcup şekilde. "Önemli bir iş değil aslında... şu ipek iplikler pek kötü çıktı. Çok mühim bir kıyafet işliyorum ama iplik durmadan kopuyor."`
      },
      {
        text: `Parmaklarında küçük küçük yara bantları olduğunu fark edersin; hepsi de iğne batmasından. İşlediği şey gösterişli bir gelinliktir; kuş motifleri yarısına dek ince ince tamamlanmıştır.`,
        choices: [
          {
            text: `"Bu gelinlik pek güzel olmuş. Elin gerçekten çok zarif."`,
            friendshipChange: 120,
            response: `Suna'nın yanakları hafifçe kızarır: "Sağ ol. Komşu köydeki bir gelin için dikiyorum. Her gelinlik, sahibinin ümidiyle dolu olur; o yüzden savsaklayamam." Başını eğip işlemeye devam eder, ama dudaklarında ince bir gülümseme vardır.`
          },
          {
            text: `"Ellerin bu kadar delinmiş. Biraz dinlensen olmaz mı?"`,
            friendshipChange: 80,
            response: `Suna başını sallar: "Terzinin eline iğne değmeden iş olmaz. Yeter ki elbise güzel olsun; bu küçük yaraların sözü mü olur."`
          }
        ]
      },
      {
        text: `Ayrılırken Suna seni çağırır: "Bir dur." Yan taraftan bir mendil alıp sana uzatır. Açık renkli kumaş üstünde minicik işlenmiş bir dal vardır; dikişleri çok sık ve düzgündür. "Senin mendilin epey eskimişti. Bunu al. Sık sık uğrayıp hâl hatır sorduğun için... teşekkür niyetine." Başını eğmiştir; gözlerine bakmaya çekinir.`
      }
    ]
  },
  {
    id: 'su_su_heart_5',
    npcId: 'su_su',
    requiredFriendship: 1600,
    title: 'Eski Kumaş Yeni Esvap',
    scenes: [
      {
        text: `Suna'yı nadir görülecek biçimde dükkân dışında, çiftliğinin önünde bulursun. Kucağında bir bohça vardır. Sana yaklaşırken sesi çekingen çıkar: "Şey... senden bir ricam olacaktı."`
      },
      {
        text: `Bohçayı açar. İçinden rengi solmuş, eski bir giysi çıkar. "Bu, annemden kalan tek elbise. Ben küçücükken gitmişti; geriye sadece bunun kokusu kaldı." Gözleri nemlenir. "Ama artık çok eskidi. Bazı yerleri lime lime oldu. Onu söküp yeni bir şeye katmak istiyorum; böylece hep benimle kalsın. Ama tek başıma cesaret edemiyorum... Ya mahvedersem diye korkuyorum."`,
        choices: [
          {
            text: `"Ben yanında olayım. Sen işle, ben sana yardım ederim."`,
            friendshipChange: 120,
            response: `Suna kuvvetle başını sallar, derin bir nefes alır. Parmakları hâlâ titremektedir ama sen yanında olunca yavaş yavaş sakinleşir. Dikişleri söker, kumaşı biçer, yeniden örer; her harekette en değerli emanete dokunur gibidir.`
          },
          {
            text: `"Annen de eminim senin kadar yumuşak huylu biriydi."`,
            friendshipChange: 120,
            response: `Suna'nın gözyaşları sonunda süzülür. Hemen silmeye çalışır, utangaçça gülümser: "Herkes öyle der. Ben de küçükken annem gibi eli becerikli biri olmayı isterdim; iğneyle iplikle insanın içini ısıtmayı..." `
          }
        ]
      },
      {
        text: `Bütün günün emeği sonunda eski kumaş yeni bir atkıya dönüşür. Suna onu avuçlarının içinde tutup usulca yanağına yaslar, gözlerini kapatır. "Annem... hâlâ burada." diye fısıldar.`
      },
      {
        text: `Gözlerini açıp sana bakar. Bakışlarında söylenmemiş nice şey vardır. Ama sonunda yalnızca hafifçe gülümser: "Bugün yanımda olduğun için sağ ol. Bir gün... ben de senin için bir giysi dikmek isterim. En güzel kumaştan, bütün gönlümü içine işleyerek."`
      }
    ]
  },
  {
    id: 'su_su_heart_8',
    npcId: 'su_su',
    requiredFriendship: 2400,
    title: 'Nakışlı Gönül',
    scenes: [
      {
        text: `Bir gün eve dönünce kapının önünde zarif bir ahşap kutu görürsün. Üstüne kırmızı bir bağ bağlanmıştır. Açtığında içinden pek özenli dikilmiş bir giysi çıkar. Kumaşı yumuşak ve berrak renklidir; yakasıyla kollarında ince motifler işlenmiştir. Yanında bir de mektup vardır.`
      },
      {
        text: `Mektupta şöyle yazar: "Bu giysiyi uzun zamandır dikiyorum. Ölçünü defalarca aldım; hem de sen fark etmezken gizlice, kusuruma bakma. Eğer bu gece müsaitsen, bunu giyip dükkâna gelir misin? — Suna"`
      },
      {
        text: `Üstüne yeni giysiyi giyip terzi dükkânına gidersin. Suna kapıda seni beklemektedir. O da açık renkli yeni bir elbise giymiştir. Seni kendi elleriyle diktiği kıyafet içinde görünce gözleri ışıldar. "Tam olmuş." der usulca. "Düşlediğimden de güzel durmuş."`,
        choices: [
          {
            text: `"Hayatımda aldığım en güzel armağan bu. Sağ ol Suna."`,
            friendshipChange: 120,
            response: `Suna başını eğer, iki eliyle eteğinin ucunu sıkıştırır. Sesi neredeyse fısıltıdır: "Bana teşekkür etme... Bu elbise... benim en çok emek verdiğim iştir. Çünkü..." Sözleri düğümlenir.`
          },
          {
            text: `Rüzgârın bozduğu saç telini uzanıp kulağının ardına iliştirirsin.`,
            friendshipChange: 160,
            response: `Suna irkilir, gözlerini kocaman açıp sana bakar. Yüzü kulaklarına kadar kızarmıştır. "Sen..." der, sesi bir kelebeği ürkütmek istemiyormuş kadar hafif.`
          }
        ]
      },
      {
        text: `Suna kolundan küçücük bir kese çıkarır. Senin üstündeki giysiyle aynı kumaştan yapılmış minik bir muskadır. İki eliyle sana uzatırken başı neredeyse göğsüne değecek kadar eğiktir.`
      },
      {
        text: `"Ben pek konuşkan değilim. Güzel söz de söyleyemem. Ama dikiş bilirim... Her ilmik, sana söylemek istediğim bir sözdür benim." Nihayet başını kaldırır. Gözleri kızarmıştır ama sesi şaşırtıcı biçimde kararlıdır. "Bu ömrüm boyunca sana giysi dikmek isterim. Baharda ince gömlek, kışta kalın aba, yağmurda pelerin... Dört mevsim, iğne iğne, hiç usanmadan."`
      }
    ]
  },

  // ============================================================
  // Zeyno (hong_dou) —— İçki ocağı sahibi, açık sözlü ve yürekli
  // ============================================================
  {
    id: 'hong_dou_heart_3',
    npcId: 'hong_dou',
    requiredFriendship: 800,
    title: 'İyi İçkinin Kokusu Saklanmaz',
    scenes: [
      {
        text: `Zeyno önünü keser ve eline bir testi tutuşturur: "Şunu bir tat bakalım! Yeni kurduğum çiçek rakısı! İlk küp! Daha kimseye içirmedim!"`
      },
      {
        text: `Bir yudum alırsın. Hafif tatlı, hoş kokulu, damağında uzun kalan bir içkidir. Zeyno ellerini beline koyup gözlerinin içine bakar: "Nasıl? Güzel olmuş, değil mi?"`
      },
      {
        text: `"Doğrusunu istersen bu küp için üç ay uğraştım. Çiçeği sabah çiği üstündeyken toplamak gerekir, suyu dağın pınarından almak şart, ısı ise..." diye anlatmaya koyulur. Sesinde hem heyecan hem de gurur vardır.`,
        choices: [
          {
            text: `"Pek güzel olmuş! Bir tas daha verir misin?"`,
            friendshipChange: 120,
            response: `Zeyno dizine vurup kahkaha atar: "İşte ben böyle açık gönüllü adam severim! Haydi otur! Bugün bardak bardak içeriz!" Kocaman bir tas doldurup sana uzatır, kendine de koyar. "Şerefe!"`
          },
          {
            text: `"Tadı güzel ama sonu biraz buruk. Belki mayayı biraz daha uzun tutsan?"`,
            friendshipChange: 80,
            response: `Zeyno bir an afallayıp sonra hayran hayran bakar: "Vay be! Demek işten anlayan biriymişsin ha? Sözünde hikmet var. Sen yalnız toprağı değil, küpü de tanıyorsun!" Gözlerinde takdir ışıldar. "İstersen benim ocakta tadım ustası ol!"`
          }
        ]
      },
      {
        text: `Birkaç tas sonra Zeyno'nun yanakları kızarmaya başlar. Sırtını küpe yaslar, gülümseyerek anlatır: "Babam ölmeden önce, 'Zeyno, senin huyun fazla deli, seni alan zor çıkar.' derdi. Ben de 'Kimse almazsa almasın, benim ocağım bana yeter.' derdim." Sonra sana yan gözle bakar. "Ama... içkinin dilinden anlayan biriyle yan yana oturup sohbet etmek de kötü olmazmış hani."`
      }
    ]
  },
  {
    id: 'hong_dou_heart_5',
    npcId: 'hong_dou',
    requiredFriendship: 1600,
    title: 'Kırık Küpün Sırrı',
    scenes: [
      {
        text: `İçki ocağının arka avlusunda Zeyno'yu dev küplerin önünde çömelmiş bulursun. Her zamanki neşesi yoktur. Yerde kırılmış bir küp ve etrafa yayılmış içki vardır.`
      },
      {
        text: `"Bakma öyle." der başını kaldırmadan. "On yıllık küplerden birini kırdım. Babamın elinden çıkmış son üç küpten biriydi. Şimdi iki kaldı." Sesi her zamanki tok tınısından uzaktır.`
      },
      {
        text: `"Babamı içki götürdü." der birden. "Ömrü boyunca en güzel içkileri kurdu, sonra kendisi de onlara yenildi. Son gün elimi tutup 'İçki iyidir ama kadehi ne zaman bırakacağını bilmek gerekir.' dedi." Sana bakar; gözleri doludur. "Ben bunu hâlâ tam öğrenemedim."`,
        choices: [
          {
            text: `Yanına çömelip kırık parçaları onunla birlikte toplamaya başlarsın.`,
            friendshipChange: 120,
            response: `Zeyno ellerine bakıp uzun süre susar, sonra o da eğilip parçaları toplamaya koyulur. "...Sağ ol." der. "Ben dışarıdan güle oynaya görünürüm ama iş başa düşünce söz bulamam."`
          },
          {
            text: `"Baban senden sadece küp bırakmadı Zeyno. Seni bıraktı. Bu, on yıllık içkiden daha kıymetli."`,
            friendshipChange: 160,
            response: `Zeyno birden yüzünü sana çevirir; yaşları sonunda düşer. Hemen koluyla silmeye çalışır: "Aman be... insanın yüreğine böyle söz edilir mi..." Sesi titrer. "...Ama sağ ol."`
          }
        ]
      },
      {
        text: `Zeyno ayağa kalkar, derin bir nefes alır; her zamanki sert neşesi geri dönmeye başlar. Elbiselerindeki toprağı silkeler: "Tamam! Surat asmak yok! Babam beni böyle görse 'Kız, kendine gel!' derdi." Ağzı gülse de göz kenarları ıslaktır. "Gel, öteki küpten sana bir tas koyayım. Babam, içkiyi hak eden birine pay ettiğimi bilse hoşuna giderdi."`
      }
    ]
  },
  {
    id: 'hong_dou_heart_8',
    npcId: 'hong_dou',
    requiredFriendship: 2400,
    title: 'Sarhoşun Dürüst Sözü',
    scenes: [
      {
        text: `Güz dolunayında Zeyno seni köyün arkasındaki tepeye çıkarır. Omzunda bir küp, elinde iki tas vardır. Gökte iri, parlak bir ay asılıdır; aşağıda ise gaKöyün lambaları titrek yıldızlar gibi görünür.`
      },
      {
        text: `"Haydi! Ay seyredip içelim!" Zeyno küpün ağzını açar, tasını doldurup sana uzatır. Kendine de bir tas koyar ve tek dikişte içer. Ay ışığında yüzündeki sertlik biraz dağılmış, yerine sıcak bir yumuşaklık gelmiştir.`
      },
      {
        text: `Birkaç tas sonra dili iyice çözülür. Bacaklarını toplayıp oturur, aya bakar: "Söyle bakalım... benim gibi birini seven çıkar mı? Sesim yüksek, içkiyi severim, öyle pek uslu kadın sayılmam..." İlk kez böylesine çekingen görünür.`,
        choices: [
          {
            text: `"Benim gördüğüm en gerçek, en alımlı insansın sen."`,
            friendshipChange: 120,
            response: `Zeyno önce dona kalır, sonra "Puh!" diye gülüp omzuna hafifçe vurur: "Sen de iki tas içince konuşmayı bilirmişsin!" der. Ama gözleri aydan daha parlak bakmaktadır.`
          },
          {
            text: `Sessizce kendi tasını da onun önüne koyarsın. "Bu gece ne kadar içeceksen ben de seninle içerim."`,
            friendshipChange: 120,
            response: `Zeyno taslara bakıp sessizleşir. Sesi çok daha alçak çıkar: "Sen var ya... insanın en ihtiyaç duyduğu vakitte en doğru şeyi yapanlardansın."`
          }
        ]
      },
      {
        text: `Gece derinleşir. Zeyno başını omzuna bırakır; yarı sarhoş, yarı uyanıktır. "Sana bir sır vereyim." der. "Bu kübün adı 'sevda demidir'. Bunu... bir kişi için kurdum. Yarım yıl uğraştım. En güzel çiçeği, en temiz suyu seçtim."`
      },
      {
        text: `Yüzünü çevirip sana bakar. O bakış, içmiş birinin değil, son derece ayık birinin bakışıdır: "O kişi sensin. İlk kez seninle aynı tası paylaştığım gün anladım. En iyi içkimi bölüşmek isteyeceğim tek kişi bu ömürde sensin." Tası sana doğru uzatır. "Bunu da içersen... artık benim sayılırsın. Şaka tabii." diye güler. Ama eli titremektedir.`
      }
    ]
  },

  // ============================================================
  // Cemil (dan_qing) —— Okumuş delikanlı, zarif ve nazik
  // ============================================================
  {
    id: 'dan_qing_heart_3',
    npcId: 'dan_qing',
    requiredFriendship: 800,
    title: 'Korulukta Söyleşi',
    scenes: [
      {
        text: `Köyün arka tarafındaki korulukta Cemil'e rastlarsın. Bir ağaca yaslanmış, elinde kitap, alçak sesle bir şeyler okumaktadır.`
      },
      {
        text: `"Ha?" Seni görünce yumuşak bir tebessüm eder. "Burası okumayı en sevdiğim yerlerden biridir. Düz duran dallar ve dinginlik, insana ölçü verir."`
      },
      {
        text: `Kitabını kapatıp seni yanına çağırır. "Sen gaKöye gelmeden önce şehirde yaşıyordun değil mi? Neden o kalabalığı bırakıp buralara, toprağın başına geldin?"`,
        choices: [
          {
            text: `"Şehirde boş koşturmaktansa kırda işe yarar bir emek vermek daha iyi."`,
            friendshipChange: 120,
            response: `Cemil'in gözleri parlar: "Ne güzel söyledin! Ayakları toprağa basan gönül, nice okumuştan üstündür." Ellerini göğsünde birleştirip sana saygıyla başını eğer.`
          },
          {
            text: `"Sebebini tam bilmem. Yalnız burası bana iyi geliyor."`,
            friendshipChange: 40,
            response: `Cemil gülümser: "Bazen en doğru yollar sebepsiz gibi görünür. İnsan, gönlünü çeken yere gider." Sana bakarken sesi bir hayli yumuşamıştır.`
          }
        ]
      },
      {
        text: `Gün batarken Cemil kitaplarını toplar. Sonra ansızın konuşur: "Yıllarca diyar diyar dolaştım, nice yer gördüm. Fakat beni gerçekten durmaya çağıran tek yer burası oldu." Hafifçe gülümser. "Çünkü burada kalmaya değer biri var." Kimin olduğunu söylemez; ama bakışları sana çok şey anlatır.`
      }
    ]
  },
  {
    id: 'dan_qing_heart_5',
    npcId: 'dan_qing',
    requiredFriendship: 1600,
    title: 'Kalem Ehlinin Niyeti',
    scenes: [
      {
        text: `Cemil'in kaldığı küçük evin önünden geçerken içeriden yırtılan kâğıt sesleri duyarsın. Kapıyı açınca yerde buruşturulmuş sayfalar görürsün. Cemil masanın başında, bir şeyi yazıp yazıp karalamaktadır.`
      },
      {
        text: `"Yazamıyorum." der seni görünce, acı bir gülümsemeyle. "Uzun süredir gaKöyün tarihini yazmak istiyorum. Burasının hikâyesi, insanları, toprağı... hepsi kalsın istedim. Lakin üç yıldır elim bir türlü istediğim sözü bulamadı."`
      },
      {
        text: `Sana müsveddelerini gösterir. Yazısı temizdir; köyün coğrafyası, ürünleri ve yaşayışı güzelce anlatılmıştır. Yine de içinde eksik bir sıcaklık sezersin.`,
        choices: [
          {
            text: `"Belki eksik olan hüner değil, hayatın kendisi. Evde oturup yazmak yerine tarlalara, dükkânlara gitmeli; insanları dinlemelisin."`,
            friendshipChange: 120,
            response: `Cemil bir anda doğrulup masaya vurur: "İşte bu! Ben hep kendimi odalara kapadım; hâlbuki yaşayan sözü toprağın ve halkın içinden duymam gerekirmiş." Kağıtlarını toplarken sana coşkuyla bakar. "Beni çiftliğine götürür müsün? İlk sayfayı tarlalarda bulacağım!"`
          },
          {
            text: `"Acele etme. İyi yazı, demlenerek çıkar."`,
            friendshipChange: 80,
            response: `Cemil iç çeker ama sonra başını sallar: "Doğru. Zorlarsam kelâm küser." Sonra hafifçe gülümser. "Seninle konuşunca içimdeki telaş dinecek gibi oluyor."`
          }
        ]
      },
      {
        text: `Birkaç gün sonra Cemil elinde yeni sayfalarla yanına koşarak gelir. "Bir bak! Hasan Enişte'nin dükkânını yazdım; dedesinden beri sürdüğü işi anlattım. Fatma Teyze'nin mutfağını da ekledim; yüz yıllık lezzetlerin izini..." Bu kez satırları canlıdır, içlerinde dumanı tüten bir hayat vardır. Sana bakarken minnetle gülümser: "Bu bölümün ruhunu bana sen verdin. Girişte adını anacağım."`
      }
    ]
  },
  {
    id: 'dan_qing_heart_8',
    npcId: 'dan_qing',
    requiredFriendship: 2400,
    title: 'Kalem Üzerine Yemin',
    scenes: [
      {
        text: `Cemil, güz ortasında seni ay ışıklı bir gecede koruluğa çağırır. Taş masa üstüne kâğıt serilmiş, mürekkep hazırlanmıştır.`
      },
      {
        text: `"Kitap bitti." der sakince. Özenle dikilmiş sayfaları sana uzatır. Kapağında "gaKöy Defteri" yazmaktadır; ilk sayfada ise şu satır vardır: "Bana yurdu yeniden öğreten kişiye."`
      },
      {
        text: `"On yıl dolaştım; yazmaya değer bir yer, durmaya değer bir insan aradım." Kalemi eline alır ve ay ışığında bir isim yazar. Yaklaşınca kendi adının yanına senin adını yazdığını görürsün.`,
        choices: [
          {
            text: `"Cemil, bu kitap yıllar sonra da okunur."`,
            friendshipChange: 80,
            response: `Cemil kalemi bırakıp başını sallar: "Okunup okunmaması umurumda değil. Benim için asıl kıymetli olan, onu yazarken senin hep yakınımda olmandı."`
          },
          {
            text: `Öteki kalemi alır, onun adının yanına kendi adını sen de yazarsın.`,
            friendshipChange: 160,
            response: `Cemil iki isme uzun uzun bakar. Dudakları hafifçe titrer, gözleri dolar. "Sen... bunun eski devirlerde ne demek olduğunu biliyor musun?" diye fısıldar.`
          }
        ]
      },
      {
        text: `Cemil ayağa kalkar. Ay ışığı yüzüne vurmuştur. Sana derin bir saygıyla eğilir; bu, sıradan bir selâm değil, gönülden edilen kadim bir taahhüttür.`
      },
      {
        text: `"Ben, Cemil... ne mal mülk sahibiyim ne de altın gümüş. Lakin elimde yazı, içimde de hakiki bir gönül var." Başını kaldırdığında sesi yumuşak ama kararlıdır. "Kalemi şahit, mürekkebi yemin bilirim. Yazacağım her sözde, göreceğim her seherde, karşılayacağım her akşamda seninle yürümek isterim."`
      }
    ]
  },

  // ============================================================
  // Demir (a_tie) —— Demirci çırağı, iyi yürekli ve dürüst
  // ============================================================
  {
    id: 'a_tie_heart_3',
    npcId: 'a_tie',
    requiredFriendship: 800,
    title: 'Demir Çiçek',
    scenes: [
      {
        text: `Demirci dükkânına vardığında Ali Usta ortalıkta yoktur; içeride yalnız Demir çalışmaktadır. Ter içindedir, çekici bir sacın üstünde tak tak inmektedir. Ama dikkatli bakınca dövdüğü parçanın epey eğri büğrü olduğu görülür.`
      },
      {
        text: `"Eyvah! Yine yamuldu!" diye telaşla söylenir Demir, parçayı ocağa geri atarken. O sırada seni fark eder ve yüzü kızarır. "Sen... gördün mü? Çapa dövmeye çalışıyordum ama bir türlü düzgün olmuyor. Usta diyor ki kol kuvvetim eşit dağılmıyormuş..."`
      },
      {
        text: `Biraz mahcup biçimde örsün yanına çöker, koca ellerini ovuşturur. "Ustamın işi öyle güzel ki... Ben üç yıldır uğraşıyorum, hâlâ böyleyim. Bazen düşünüyorum da... galiba akılsızın tekiyim."`,
        choices: [
          {
            text: `"Gel, ben tutayım. Sen bir daha dene."`,
            friendshipChange: 120,
            response: `Demir'in gözleri parlar: "Sahi mi?" Sen parçayı sabit tutunca nihayet eli düzgün bir çapa biçimi çıkarır. Onu kaldırıp çevirip çevirip bakar; çocuk gibi sevinmiştir. "Düz oldu! Vallahi düz oldu! Sen olmasan yapamazdım!"`
          },
          {
            text: `"Akıllı olmak şart değil. Azmetmek yeter. Bugünkü hâlin üç yıl öncekinden çok ileride."`,
            friendshipChange: 80,
            response: `Demir şaşırır, sonra ensesini kaşıyıp mahcup bir gülüş bırakır. "Sen gerçekten öyle mi düşünüyorsun? Heh... Usta bana pek övgü etmez. Bunu ilk kez senden duydum."`
          }
        ]
      },
      {
        text: `İş bitince Demir gizlice eline küçük bir demir halka sıkıştırır. Kaba saba bir iştir ama üstünde emek olduğu bellidir. "Bu... alıştırma yaparken yaptığım bir parçaydı. Pek kıymetli sayılmaz ama... sana vermek istedim." Yüzü kıpkırmızı olur, sonra hızla uzaklaşırken neredeyse kapı sövesine çarpar.`
      }
    ]
  },
  {
    id: 'a_tie_heart_5',
    npcId: 'a_tie',
    requiredFriendship: 1600,
    title: 'Ocağın Yüreği',
    scenes: [
      {
        text: `Gece yarısı tak tuk sesleriyle uyanırsın. Sesi izleyip demirci dükkânına gittiğinde Demir'i tek başına ateş başında bulursun. Yüzü kömür isi ve ter içinde, elindeki demiri büyük bir dikkatle dövmektedir.`
      },
      {
        text: `Seni görünce sıçrar: "Sen... bu saatte ne arıyorsun?" Elindekini saklamaya çalışır ama geç kalmıştır. İnce işlenmiş demir bir çiçek şekli yapmaktadır; yapraklar kat kat açılmaya başlamıştır.`
      },
      {
        text: `"Ustam der ki ben kaba işte iyiyim, ince işte değil." Demir başını eğer. "Ama ben aksini göstermek istiyorum. O yüzden geceleri, herkes gidince gizlice çalışıyorum." Ellerini açar; avuçlarının her yeri yanık izi ve nasırla doludur.`,
        choices: [
          {
            text: `Yara içindeki ellerini tutarsın. "Bu izler, emeğinin şahididir."`,
            friendshipChange: 160,
            response: `Demir bir anda donup kalır. Ocağın ateşi yüzündeki kızıllığı iyice belli eder; utanmaktan mı sıcaktan mı ayırt edemezsin. "Senin elin... çok sıcak." diye mırıldanır, ama elini geri çekmez.`
          },
          {
            text: `"Dayan Demir. Bir gün en iyi işi sen çıkaracaksın. Ben buna inanıyorum."`,
            friendshipChange: 80,
            response: `Demir tüm gücüyle başını sallar. Koca gözlerinde ateş ve senin yansıman titreşmektedir. "Hı! Sen bana inanıyorsan ben hiçbir şeyden korkmam!"`
          }
        ]
      },
      {
        text: `Bir ay sonra Demir nihayet o demir çiçeği bitirir. Güneşe tuttuğunda ince yapraklar ışığı kırar, neredeyse gerçek çiçek gibi parlar. Ali Usta bile şaşkınlıkla bakar. Demir, yüzü kıpkırmızı halde soluğu yanında alır ve çiçeği sana uzatır: "Bunu... sadece sen hak edersin."`
      }
    ]
  },
  {
    id: 'a_tie_heart_8',
    npcId: 'a_tie',
    requiredFriendship: 2400,
    title: 'Çelik Yürek',
    scenes: [
      {
        text: `Ali Usta seni bulur. Yüzünde nadir görülen ciddi ama memnun bir ifade vardır. "Şu Demir var ya... son zamanlarda acayip ilerledi. 'Ustalık eseri' diye bir şey yapacağım diye dükkâna kapanmış. Üç gündür kimseyi içeri almıyor." İç çeker. "Ama... seni çağırdı."`
      },
      {
        text: `Demirci dükkânına gidersin. Demir örsün yanında ayakta durmaktadır. Epey zayıflamış ama gözleri hiç olmadığı kadar parlaktır. Arkasındaki rafta bir kılıç durur. Fakat bu sıradan bir kılıç değildir; gövdesine ince desenler işlenmiş, kabzasına da çiçek motifleri sarılmıştır. Adeta sanat eseri gibidir.`
      },
      {
        text: `"Ben... bitirdim." der kısık ama gururlu bir sesle. Kılıcı iki eliyle sana uzatır; elleri hafif titremektedir. "Ustam der ki, demircinin ömründe bir kez dövdüğü bir 'gönül işi' olur. O, en kıymetli kişiye verilir."`,
        choices: [
          {
            text: `Kılıcı büyük bir ciddiyetle alır, incelersin. "Demir... bu kılıç gerçekten çok güzel."`,
            friendshipChange: 120,
            response: `Demir koca ellerini birbirine sürter, ağzı kulaklarına varır. "Sahi beğendin mi? Onu dövmek için parmaklarımı kaç kere yaktım sayamam. Ama değdi, değdi!"`
          },
          {
            text: `"Demir, sen artık eğri çapa çıkaran çırak değilsin."`,
            friendshipChange: 120,
            response: `Demir'in gözleri bir anda dolar. Hemen eliyle yüzünü ovuşturur. "Ben ağlamıyorum ha! Duman kaçtı gözüme!" Büyükçe nefes alır. "Şimdi olduğum hâle gelmemde senin payın var."`
          }
        ]
      },
      {
        text: `Demir derin bir nefes alıp dimdik durur. Eskiden hep omuzlarını büker, sanki dünyada az yer kaplamaya çalışırdı. Ama şimdi karşısında sağlam, dürüst ve yüreği görünür bir adam vardır.`
      },
      {
        text: `"Ben öyle Cemil gibi şiir yazamam. Sözümü süslemeyi de bilmem." Koca elleri önlüğünü öyle sıkmaktadır ki boğumları bembeyaz olur. "Ama şu ellerle sana dünyadaki en iyi aleti yaparım. En sağlam evi kurarım. En güzel demir çiçeği döverim. Bu ömürde de sonraki ömürlerde de!" Yüzü ocak gibi kızarmıştır. "O yüzden... benim hep yanında kalmama izin verir misin?"`
      }
    ]
  },

  // ============================================================
  // Baran (yun_fei) —— Avcı, başına buyruk ama derin yaralı
  // ============================================================
  {
    id: 'yun_fei_heart_3',
    npcId: 'yun_fei',
    requiredFriendship: 800,
    title: 'Ormanda Karşılaşma',
    scenes: [
      {
        text: `Arka dağda bitki toplarken yolunu kaybedersin. Hava kararmaya yüz tutmuş, etraf ağaç gölgeleriyle dolmuştur. Tam telaşlanmaya başlamışken çalıların arasından biri çıkar: Baran'dır.`
      },
      {
        text: `"Yine sen." der kuru bir sesle. Bir çam gövdesine yaslanmıştır. "Yolu mu şaşırdın?" Cevap vermeni beklemeden arkasını döner. "Peşimden gel. Geri kalma."`
      },
      {
        text: `Seni sık ağaçların içinden, kıvrak ve emin adımlarla yürütür. Belli ki her taşını, her ağacını bilir bu dağın. Birden eliyle sus işareti yapar. İleride açıklıkta bir dişi geyik yavrusuyla su içmektedir. Ay ışığı ikisinin üstüne dökülmüştür; görüntü olağanüstü sakindir.`,
        choices: [
          {
            text: `Nefesini tutup sessizce bu manzarayı seyredersin.`,
            friendshipChange: 120,
            response: `Baran yan gözle sana bakar; sessizliğine şaşırmış gibidir. Geyikler gidince konuşur: "...İyi. Çoğu kişi böyle bir şeyi görünce höykürür." Bu, onun ağzından çıkabilecek en büyük övgülerden biridir.`
          },
          {
            text: `"Senden korkmuyorlar mı?"`,
            friendshipChange: 40,
            response: `Baran hafifçe homurdanır: "Ben her önüne geleni vurmam. Yavrulu hayvana, gebe olana el kalkmaz. Dağın da bir töresi var." Sert durur ama bu sözlerde doğaya karşı büyük bir saygı duyulur.`
          }
        ]
      },
      {
        text: `Ormandan çıkarken Baran aniden durup heybesinden bir tutam ot çıkarır ve sana atar. "Buralarda yılan çok olur. Bunu ezip ayak bileğine sür." der. Sonra dönüp hızlıca uzaklaşır. Ama köye varana dek arka tepede seni gözlediğini fark edersin.`
      }
    ]
  },
  {
    id: 'yun_fei_heart_5',
    npcId: 'yun_fei',
    requiredFriendship: 1600,
    title: 'Yalnız Kurdun Yarası',
    scenes: [
      {
        text: `Baran'ı arka dağda bir ağaca yaslanmış bulursun. Sol koluna aceleyle sarılmış bir bez vardır; bez kanla ıslanmıştır. Gözleri kapalı, yüzü solgundur.`
      },
      {
        text: `Ayak sesini duyunca birden gözlerini açar; eli hemen bıçağına gider. Seni tanıyınca gevşer. "...Bir şey yok. Yaban domuzu sürttü geçti." Sesi yorgun ama inatçıdır. "Beni bırak. Geçer."`
      },
      {
        text: `Yanına eğilip yarasına baktığında etin açıldığını, epey kan kaybettiğini görürsün. Bu, "geçer" denilecek bir yara değildir.`,
        choices: [
          {
            text: `Karşı çıkmasına aldırmadan yarasını yeniden sararsın.`,
            friendshipChange: 160,
            response: `Baran seni itmek ister ama gücü yetmez. Yüzünü başka yana çevirir; çenesi sıkılıdır. İşin bitince bir süre hiç konuşmaz. Sonra dişlerinin arasından, "...Elin fena değilmiş." diyebilir ancak.`
          },
          {
            text: `"Dağa hep tek başına çıkman iyi değil. Bir dahaki sefere bana haber ver."`,
            friendshipChange: 80,
            response: `Baran alaylı gibi gülümser: "Ben bu dağlarda on yıldır yaşıyorum, bana..." Sözünü tamamlayamaz; yara sızlayınca yüzü gerilir. Sonunda pes eder. "...Nasıl istersen."`
          }
        ]
      },
      {
        text: `Onu destekleyerek kulübesine indirirsin. İçerisi yoksulluk kokar: tahta bir sedir, bir yay, birkaç eski giysi... Duvarda solmuş bir resim asılıdır; genç bir kadın kucağında küçük bir çocuk tutmaktadır.`
      },
      {
        text: `Bakışını fark eden Baran'ın sesi alçalır: "O... anam." der. "Beni doğururken ölmüş. Babam da suçu bana yükleyip altı yaşımdayken dağa bırakmış." Yüzünde duygu yok gibidir; sanki başkasının hikâyesini anlatır. "O günden sonra evim dağ oldu. Kuş, kurt, ağaç... hepsi insandan daha vefalı geldi." Sana kısa bir bakış atar. "...Sen hariç."`
      }
    ]
  },
  {
    id: 'yun_fei_heart_8',
    npcId: 'yun_fei',
    requiredFriendship: 2400,
    title: 'Dağ Başında Ahit',
    scenes: [
      {
        text: `Bir sabah Baran kapında belirir. Kapı sövesine yaslanmış, sana bakmamaya çalışmaktadır. "...Benimle gel. Sana göstereceğim bir yer var." Bir an durur. "Yalnız sen geleceksin."`
      },
      {
        text: `Seni arka dağın en yüksek sırtına çıkarır. Avcıların bile kolay kolay tırmanmadığı yerlerdir buralar. Sık ormanlardan geçer, sarp kayalara tutunur ve nihayet zirveye varırsınız.`
      },
      {
        text: `Gördüğün manzara nefesini keser. Aşağıda uçsuz bucaksız bir bulut denizi vardır. Güneş, bulutların arasından yükselip göğü altınla boyar. gaKöyün tüten ocakları, sanki o bulutların üstüne kurulmuş bir masal yurdu gibidir.`,
        choices: [
          {
            text: `"Baran... burası akıl almaz kadar güzel. Beni getirdiğin için sağ ol."`,
            friendshipChange: 120,
            response: `Baran rüzgârda savrulan saçlarıyla ufka bakar. Sesi her zamankinden yumuşaktır: "Burası benim sırrımdı. On yıldır kimseyi getirmedim."`
          },
          {
            text: `Hiç konuşmadan yanında durur, doğan güneşi onunla birlikte izlersin.`,
            friendshipChange: 120,
            response: `Uzun süre hiçbiriniz ses çıkarmazsınız. Ama bu sessizlik ağır değildir; aksine, sözsüz anlaşan iki insanın sessizliğidir.`
          }
        ]
      },
      {
        text: `Güneş iyice yükselince Baran konuşur. Sesi alçaktır; sanki rüzgâra söyler gibidir: "Eskiden insana güven olmaz sanırdım. Bir av köpeği, bir çam ağacı onlardan daha vefalıdır diye düşünürdüm." Sonra sana döner. Belki de hayatında ilk kez böylesine ciddi bakmaktadır.`
      },
      {
        text: `"Ama sen bu fikri bozdun." Her kelime sanki içinden sökülerek çıkıyordur. "Sen yüzünden dağdan inmeyi, insanların olduğu yerde kalmayı istedim. Çünkü orada sen varsın." Elini tutar; kavrayışı sıkıdır, bırakırsa bir daha yakalayamayacakmış gibidir. "Ben güzel konuşamam... ama seni canımla korurum. Bu dağ buna şahidim olsun."`
      }
    ]
  },

  // ============================================================
  // İbo (da_niu) —— Çiftlik delikanlısı, saf ve sıcakkanlı
  // ============================================================
  {
    id: 'da_niu_heart_3',
    npcId: 'da_niu',
    requiredFriendship: 800,
    title: 'Buzağı Doğumu',
    scenes: [
      {
        text: `İbo telaşla koşup seni bulur. "Yandık! Bizim sarı inek doğuruyor, ben tek başıma yetişemiyorum! Ne olur yardım et!"`
      },
      {
        text: `Onunla birlikte ağıla koşarsın. Büyük sarı inek yerde yatmakta, huzursuzca solumaktadır. İbo bir yandan onu sakinleştirir, bir yandan panikle ellerini ovuşturur. "Tamam kızım, tamam... İbo abin burada."`
      },
      {
        text: `İbo'nun söylediği gibi sıcak su, saman ve bez hazırlarsın. Uzun süren uğraş sonunda ıslak bir buzağı dünyaya gelir. Ayağa titreyerek kalkar ve ıslak burnuyla eline sürtünür.`,
        choices: [
          {
            text: `Buzağıyı dikkatle tutup kurulanmasına yardım edersin.`,
            friendshipChange: 120,
            response: `İbo senin nazik hareketlerine bakıp gözleri dolu dolu söylenir: "Bak hele, sana nasıl da ısındı! Buzağı ilk gördüğü kişiyi kolay unutmaz derler." Burnunu çeker. "Yardımın için sağ ol!"`
          },
          {
            text: `"İbo, hayvan dilinden gerçekten anlıyorsun."`,
            friendshipChange: 80,
            response: `İbo mahcupça ensesini kaşır: "He he... Küçüklüğümden beri onları çok severim. Hayvan insana güvenirse, insanın da ona iki kat iyilik etmesi gerekir." Çocuksu bir sevinçle gülümser.`
          }
        ]
      },
      {
        text: `İbo buzağıya "Uğur" adını verir. "Çünkü sen de yardım ettin, uğurla doğdu!" Sonra heyecanla omzuna vurur; az daha sendeleyip düşeceksindir. "İstediğin zaman gel bak. Buzağının yarı sahibi sayılırsın!"`
      }
    ]
  },
  {
    id: 'da_niu_heart_5',
    npcId: 'da_niu',
    requiredFriendship: 1600,
    title: 'Fırtınalı Ağıl',
    scenes: [
      {
        text: `Bir fırtına kopar. İbo'nun ağılı için endişelenip oraya koşarsın. Tahmin ettiğin gibi çitlerin bir kısmı devrilmiş, birkaç koyun kaçmıştır. İbo yağmurun altında oradan oraya koşturmakta, sesi kısılana kadar bağırmaktadır.`
      },
      {
        text: `"Sen niye geldin! Geri dön!" diye bağırır seni görünce. Ama ayakları durmaz; ürken bir koyunun peşinden yeniden fırlar.`
      },
      {
        text: `Onunla birlikte koyunları toplar, çitleri dikersin. Sağanak ve rüzgârın içinde koştura koştura son hayvanı da geri getirirsiniz. Her şey düzene girince samanlığın içinde sırılsıklam halde yere çökersiniz.`,
        choices: [
          {
            text: `"İbo, bütün bu ağılı tek başına ayakta tutmak kolay değil."`,
            friendshipChange: 120,
            response: `İbo bir süre susar, sonra mahcup bir gülüşle başını eğer. "Kolay değil elbet... ama onlar güvende olunca hepsine değer." Sonra sana bakar; gözlerinde içten bir minnet vardır. "Bugün çok yardım ettin. Gerçekten."`
          },
          {
            text: `Yanındaki son kuru yiyeceği onunla paylaşırsın.`,
            friendshipChange: 120,
            response: `İbo yiyeceği alırken burnu sızlar: "Senin de karnın açtır..." Bir lokma alır. Çiğnerken yağmurla gözyaşı birbirine karışır. "Ben ağlamıyorum ha! Yağmur bu!"`
          }
        ]
      },
      {
        text: `Yağmur dindiğinde bulutların ardından güneş vurur. İbo ayağa kalkıp ağılına bakar. Çitler yamuk yumuk duruyordur ama hayvanların hepsi güvendedir. Derin bir nefes alır. "Benim çok bir marifetim yok; bildiğim şey hayvana iyi davranmak. Eskiden bu bana yeter sanırdım..." Sonra sana döner, gözleri parıldar. "Ama bugün anladım ki benimle birlikte yağmurda ıslanacak biri olmak, her şeyden değerliymiş."`
      }
    ]
  },
  {
    id: 'da_niu_heart_8',
    npcId: 'da_niu',
    requiredFriendship: 2400,
    title: 'Çoban Türküsü',
    scenes: [
      {
        text: `İbo seni "çok mühim bir iş" için ağıla çağırır. Gittiğinde ortalığın tertemiz olduğunu görürsün. Her zamanki dağınık hâlinden eser yoktur; üzerinde yeni sayılacak düzgün bir kıyafet vardır, saçını bile taramıştır. Yalnız bir tutam yine de inatla havaya dikilmektedir.`
      },
      {
        text: `"Geldin ha!" der; o kadar gergindir ki ellerini nereye koyacağını bilemez. Gülümsemesi fazla çalışılmış gibidir. "Şuraya otur! Sana bir şey göstereceğim!"`
      },
      {
        text: `Sonra bir çoban kavalını üflemeye başlar. Ezgi kaba ama neşelidir. Sesle birlikte ağıldaki inek, koyun, tavuk hepsi sıra sıra dışarı çıkar. Her birinin boynuna küçük çiçekler bağlanmıştır. Dikkatle bakınca bu çiçeklerin iki kelime oluşturduğunu fark edersin.`,
        choices: [
          {
            text: `Önce şaşırır, sonra gülmeden edemezsin. "İbo, buna kaç gün çalıştın?"`,
            friendshipChange: 120,
            response: `İbo kıpkırmızı olur: "Yarım ay! Uğur hep yanlış yere kaçtı durdu... He he." Elleriyle oynar. "Güzel olmuş mu?"`
          },
          {
            text: `Duygulanmaktan konuşamaz, sadece kuvvetle başını sallarsın.`,
            friendshipChange: 120,
            response: `İbo'nun gözleri bir anda parlar: "Beğendin mi cidden?! Çok şükür! Ya saçma bulursun diye ödüm kopuyordu!" Sevincinden yerinde zıplar; birkaç tavuk korkup kanat çırpar.`
          }
        ]
      },
      {
        text: `Hayvanların üstündeki çiçekler bir araya geldiğinde "seni seviyorum" sözünü oluşturmaktadır.`
      },
      {
        text: `İbo önünde dimdik durur ama elleri hâlâ heyecandan birbirini ovuşturmaktadır. "Ben şiir bilmem, süslü söz de bilmem." der. Sonra aniden başını kaldırır ve öyle yüksek sesle bağırır ki ağaçlardaki kuşlar havalanır: "BEN SENİ SEVİYORUM! Hem de çok! İneklerden bile fazla!" Bağırdıktan sonra kendi söylediğine kendi utanır. "...Biraz fazla mı bağırdım?" O sırada Uğur da böğürür; sanki onu destekliyordur.`
      }
    ]
  },

  // ============================================================
  // Mahir (mo_bai) —— Saz ustası, sakin ve hüzünlü
  // ============================================================
  {
  id: 'mo_bai_heart_3',
  npcId: 'mo_bai',
  requiredFriendship: 800,
  title: 'Kopan Telin Sesi',
  scenes: [
    {
      text: `Bir saz sesi duyup peşine düşersin. Yol seni köyün batısındaki küçük köprüye çıkarır. Mahir köprü başında oturmuş, sazını kucağına almıştır. Ay ışığında çalan ezgi, sanki anlatılmamış bir kederi dile getirir.`
    },
    {
      text: `Birden "tınk" diye sert bir ses çıkar; sazın teli kopmuştur. Mahir susup kopan tele bakar. Sen yanına yaklaşınca başını kaldırmadan konuşur: "...Ne zamandır dinliyorsun?"`
    },
    {
      text: `"Bu saz bana ustamdan kaldı. O derdi ki, tel koparsa saz sana 'bazı yükleri bırak' diye işaret eder." Sesi öyle hafiftir ki sanki kendi kendine konuşuyordur.`,
      choices: [
        {
          text: `"Neyi bırakmalı insan?" diye usulca sorarsın.`,
          friendshipChange: 120,
          response: `Mahir uzun süre cevap vermez. Ay ışığı yanağını gölgeleyip bir resim gibi gösterir. "Geçmişi galiba." der sonunda. "Bir önceki yerde beni kimse dinlemez olmuştu. Ezgilerime fazla hüzünlü dediler."`
        },
        {
          text: `Sessizce yanına oturur, hiçbir şey sormazsın.`,
          friendshipChange: 80,
          response: `Mahir sana kısa bir bakış atar; sessizliğine şaşırmıştır. "...Niye diye sormayan ilk kişisin." Biraz geçince yeniden konuşur. "Eskiden anlaşılmamayı olağan sayardım. Ama sen burada böyle oturunca... yalnızlığım biraz hafifledi."`
        }
      ]
    },
    {
      text: `Koynundan yeni bir tel çıkarıp dikkatlice saza takar. Akordu düzelttikten sonra farklı bir ezgi çalmaya başlar. Bu kez melodide yine hüzün vardır ama sonunda sıcak bir ışık belirir. "Bu parçanın adı 'Karşılaşma'." der. "Bugün yazdım." Daha fazlasını söylemez ama nedenini anlarsın.`
    }
  ]
},
{
  id: 'mo_bai_heart_5',
  npcId: 'mo_bai',
  requiredFriendship: 1600,
  title: 'Yağmur İçinde Saz',
  scenes: [
    {
      text: `Günlerdir süren kapalı havalar köyü boz renkli bir örtüye bürümüştür. Mahir'in kulübesinin önünden geçerken içeriden gelen ezgiyi duyarsın; bu kez alıştığın sakin tını değil, hırçın ve dağınık bir ses vardır içinde. Sanki fırtınaya tutulmuş bir kuş çırpınmaktadır.`
    },
    {
      text: `Kapıyı itersin. Mahir köşede sazına sarılmış, yüzü kâğıt gibi beyaz, tellerin üstünde parmaklarını düzensizce gezdirmektedir. Seni görünce bakışları bir an dalgalanır. "...Gelmesen daha iyiydi." der boğuk bir sesle. "Bugün iyi değilim. Hiç iyi değilim."`
    },
    {
      text: `"Ben bazen içime gömülürüm. Çıkamam." Yüzünü kollarına gömer. "Ezgi gelmeyince, yağmur kesilmeyince, dünyada kimse beni umursamıyor sanınca... başımın içi uğultuyla dolar."`,
      choices: [
        {
          text: `Yanına gidip omzuna hafifçe elini koyarsın. "Ben buradayım."`,
          friendshipChange: 160,
          response: `Mahir'in bedeni hafifçe sarsılır. Uzun bir sessizlikten sonra başını kaldırır. Gözleri kızarmıştır. Sesi uzaklardan gelir gibi çıkar: "Birinin burada olması... gerçekten fark ediyormuş." Solgun ama gerçek bir tebessüm etmeye çalışır.`
        },
        {
          text: `"Öyleyse bugün saz çalma. Hiçbir şey yapma. Sadece otur."`,
          friendshipChange: 120,
          response: `Mahir şaşırır. "Hiçbir şey yapmamak?" diye tekrar eder. Sanki böyle bir ihtimali hiç düşünmemiştir. Yavaşça saza dokunmayı bırakıp duvara yaslanır, gözlerini kapatır. "...Pekâlâ. Bugün öyle olsun."`
        }
      ]
    },
    {
      text: `Bütün ikindiyi onunla sessizce geçirirsin. Yağmurun sesi de zamanla yumuşar. Akşamüstü Mahir sazını yeniden eline alır ve kısa, sade, dingin bir hava çalar; yağmur sonrası akan su gibi.`
    },
    {
      text: `"Eskiden böyle günlerde yalnızca sazım vardı." der. Parmakları tellerde ağır ağır gezinir. "Ama saz karşılık vermez. Bugün... sen geldin." Gözlerini kaldırdığında bakışlarında daha önce görmediğin bir sıcaklık vardır. "Gitmeyip kaldığın için sağ ol."`
    }
  ]
},
{
  id: 'mo_bai_heart_8',
  npcId: 'mo_bai',
  requiredFriendship: 2400,
  title: 'Gönüldaş',
  scenes: [
    {
      text: `Güz başı bir akşamüstü Mahir seni bulur ve eline sade bir kâğıt tutuşturur. Üzerinde tek satır yazı vardır: "Bu gece yarısı, köprü başı. Yüreğini de getir." Yazısı zarif ama kararlıdır.`
    },
    {
      text: `Gece yarısı gaKöyün batısındaki küçük köprüye varırsın. Köprü başında birkaç kandil yanmaktadır; ışıkları ay ışığı kadar yumuşaktır. Mahir köprünün üstünde oturur, dizinde sazı vardır. Açık renkli giysisi gece rüzgârında hafifçe dalgalanır. Seni görünce bakışlarında beklediği kişiye kavuşmuş birinin huzuru belirir.`
    },
    {
      text: `"Senin için bir ezgi besteledim." der. Sesi sakin ama hafifçe titremektedir. "Uzun sürdü. Defalarca değiştirdim. Çünkü bu ezginin içine, daha önce hiçbir parçama koymadığım şeyleri kattım." Derin bir nefes alır ve parmaklarını tellere indirir.`,
      choices: [
        {
          text: `Sessizce gözlerini kapatıp bütün gönlünle dinlersin.`,
          friendshipChange: 120,
          response: `Gözlerini kaparsın; ezgi bütün duyularını sarar. Başlangıçta yalnızlık vardır: soğuk, geniş, ıssız... Sanki biri uçsuz bucaksız bozkırda yapayalnız yürümektedir. Sonra yavaşça sıcak bir melodi katılır; yalnızlıkla iç içe geçer ve sonunda tek ses olur. Parça bittiğinde gözlerinin nemlendiğini fark edersin.`
        },
        {
          text: `Onu dikkatle izler, saz çalarken yüzüne bakarsın.`,
          friendshipChange: 120,
          response: `Mahir'in parmaklarını izlersin. Gözleri yarı kapalıdır, dudakları sessizce kıpırdar; sanki sazına söz söylemektedir. O anda fark edersin ki çalarken içindeki bütün keder dağılır, yerine bembeyaz bir berraklık gelir.`
        }
      ]
    },
    {
      text: `Son nota gece yeline karışıp uzaklaşır. Mahir ağır ağır gözlerini açar. Bakışı berrak su gibidir. Sazını yanına koyup ayağa kalkar.`
    },
    {
      text: `"Bu ezginin adı 'Gönüldaş'." der alçak sesle. "On yıldır saz çalıyorum. Nice yer gördüm, nice insan tanıdım. Ama beni gerçekten 'duyan' yalnızca sen oldun." Elini uzatır; parmakları hafif titremektedir. "Ben zor biriyim... susarım, içime kapanırım. Böyle biriyle bir ömür yol yürür müsün?" Ay ışığında gözleri hafifçe kızarmıştır ama dudağında içten bir gülümseme vardır.`
    }
  ]
},

// ============================================================
// Gönüldaşlık olayları — Her NPC için 2 adet (zhiji_7 + zhiji_9)
// ============================================================

// --- Elif Gönüldaşlık ---
{
  id: 'liu_niang_zhiji_7',
  npcId: 'liu_niang',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Ay Işığında Şiir Meclisi',
  scenes: [
    { text: `Elif seni arka avludaki köşke çağırır. Ay ışığı avluya dökülmektedir. Kâğıdı açıp mürekkebi hazırlar. "Böyle bir gecede gel, biraz şiir konuşalım."` },
    { text: `İlk dizeyi kendisi yazar ve kalemi sana uzatır. "Gönüldaşlar arasında şiirle sohbet etmekten daha zarif ne vardır?"` },
    {
      text: `Kalem sırayla el değiştirir. Kâğıt doldukça Elif'in yüzü aydınlanır. "Bunları bizden başka kimse tam anlayamaz."`,
      choices: [
        {
          text: `"Elif'in kalemi insanı hayran bırakıyor."`,
          friendshipChange: 120,
          response: `Elif başını eğip gülümser. "{player} gibi bir gönüldaş olunca, kalemin de kıymeti artıyor."`
        },
        {
          text: `"Bundan sonra her dolunayda yine şiir yazalım."`,
          friendshipChange: 80,
          response: `"Söz." Elif yazdığınız sayfayı dikkatle katlar. "Bu da bizim ilk sayfamız olsun."`
        }
      ]
    }
  ]
},
{
  id: 'liu_niang_zhiji_9',
  npcId: 'liu_niang',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Çiçekli Mektup Kâğıdı',
  scenes: [
    { text: `Elif zarif bir kutu çıkarır. "Bunu ben yaptım. Çiçek liflerinden iki defter hazırladım. Biri sana, biri bana."` },
    {
      text: `"Bundan böyle yazmak istediğin her şeyi buna yaz." Sana ciddiyetle bakar. "Yan yana olamasak bile sayfaları açınca birbirimizi hatırlarız."`,
      choices: [
        {
          text: `Defteri büyük bir saygıyla alırsın. "Bu sayfalar gönüldaşlığımızın emaneti olsun."`,
          friendshipChange: 160,
          response: `Elif'in gözleri dolar. "{player}... böyle bir gönüldaşa sahip olmak benim için büyük baht."`
        },
        {
          text: `"Merak etme, her sayfasını özenle dolduracağım."`,
          friendshipChange: 120,
          response: `"Bilirim." Elif ilk sayfayı açar. Üstünde küçük bir cümle yazılıdır: "Hakiki dostluk, kokusunu kimse görmese de kaybetmez."`
        }
      ]
    }
  ]
},

// --- İsmail Gönüldaşlık ---
{
  id: 'a_shi_zhiji_7',
  npcId: 'a_shi',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Ocağın Derinindeki Söz',
  scenes: [
    { text: `İsmail seni nadiren olduğu kadar isteyerek çağırır. Elinde iki fener vardır. "...Benimle gel. Sana göstereceğim şeyi yalnız gönüldaş bilsin."` },
    { text: `Seni ocağın en dibindeki gizli bir yarığa götürür. Taş duvarda iki ayrı damar yan yana uzanmaktadır; biri sarı, biri açık renkli, kıvrıla kıvrıla gider ama hiç ayrılmaz.` },
    {
      text: `"İki damar." der İsmail. "Ayrı ayrı... ama hep yan yana. Bizim gibi."`,
      choices: [
        {
          text: `"İsmail... bu gördüğüm, nice kıymetli taştan daha değerli."`,
          friendshipChange: 120,
          response: `İsmail nadir gülüşlerinden birini gösterir. "Hı. O yüzden kazmadım. Böyle kalsın."`
        },
        {
          text: `"Senin gönlün sandığımdan daha da sağlam."`,
          friendshipChange: 80,
          response: `İsmail yüzünü yana çevirir; kulakları kızarmıştır. "...Gönüldaşların, yalnız ikisinin bildiği bir yeri olmalı."`
        }
      ]
    },
    { text: `Ayrılmadan önce İsmail kayaya iki küçük işaret kazır. "Sonra yine buluruz." der. "Bunu bizden başka kimse bilmez."` }
  ]
},
{
  id: 'a_shi_zhiji_9',
  npcId: 'a_shi',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Taş Gibi Bağ',
  scenes: [
    { text: `İsmail seni bulduğunda elinde bir bohça tutmaktadır. Yüzü her zamankinden daha ciddi görünür.` },
    { text: `Bohçayı açıp sana uzatır. İçinden iki aynı taş kolye çıkar; temiz, yeşil parlaklıkları vardır. "Aynı damardan çıktı. Birini sen al."` },
    {
      text: `"Aynı damarın taşı ne kadar uzağa giderse gitsin, özü bir kalır." İsmail gözünü kaçırmadan konuşur. "Gönüldaş da öyledir."`,
      choices: [
        {
          text: `Kolye boynuna takarsın. "Bu bağ bozulmasın."`,
          friendshipChange: 160,
          response: `İsmail diğerini kendi göğsüne takar. Sana baktığında gözleri mağara billurları gibi sessiz ama sıcak yanmaktadır. "Bozulmaz."`
        },
        {
          text: `"İsmail, böylesi bir dosta sahip olmak benim için büyük talih."`,
          friendshipChange: 120,
          response: `İsmail uzun süre susar, sonra ağır ağır başını sallar. "...Benim için de."`
        }
      ]
    }
  ]
},

// --- Aylin Gönüldaşlık ---
{
  id: 'qiu_yue_zhiji_7',
  npcId: 'qiu_yue',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Gizli Avlak',
  scenes: [
    { text: `Aylin seni daha önce hiç görmediğin bir yere götürür. Uçurum altındaki küçük bir çağlayanın dibinde saklı bir havuz vardır. "İşte benim asıl gizli avlağım! Buraya daha kimseyi getirmedim!"` },
    { text: `Yan yana kayalara oturup oltalarınızı suya salarsınız. Aylin, alışılmadık biçimde biraz susar. Sonra gülümseyerek der ki: "Gönüldaş dediğin, yanında sessiz kalınca da insanın sıkılmadığı kişidir."` },
    {
      text: `Birden iki oltanız da aynı anda oynar! Göz göze gelir, birlikte gülmeye başlarsınız.`,
      choices: [
        {
          text: `"Aylin, seninleyken insanın canı hiç sıkılmıyor."`,
          friendshipChange: 120,
          response: `"Elbet!" Aylin gururla çenesini kaldırır. "Burası artık ikimizin gizli yeri! Hadi söz ver!"`
        },
        {
          text: `"Bu yer gerçekten de görülmeye değer."`,
          friendshipChange: 80,
          response: `"Öyle ya!" Aylin neşeyle ellerini çırpar. "Buraya ancak gönüldaş getirilir!"`
        }
      ]
    }
  ]
},
{
  id: 'qiu_yue_zhiji_9',
  npcId: 'qiu_yue',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'İkili Balık Düğümü',
  scenes: [
    { text: `Aylin sana misinadan örülmüş bir bileklik uzatır. Üstünde birbirine dolanmış iki küçük balık şekli vardır. "Bu, balıkçıların düğümüdür. Takılan iki kişiyi ömür boyu takım arkadaşı yapar derler!"` },
    {
      text: `"Bunu örmem günler sürdü..." der, başını kaşıyarak. İlk kez biraz utanıyordur. "Gönüldaşlığın da bir nişanesi olsun istedim."`,
      choices: [
        {
          text: `Bilekliğini hemen takarsın. "Bu düğüm çözülmesin."`,
          friendshipChange: 160,
          response: `Aylin kendi bileğindeki eşini sallayarak güler. "Artık resmen gönüldaş olduk! Bizi kimse ayıramaz!"`
        },
        {
          text: `"Aylin, elin oltada olduğu kadar düğümde de maharetliymiş."`,
          friendshipChange: 120,
          response: `"Ha ha, bunu inkâr etmeyeceğim!" Aylin omzuna vurur. "Bundan sonra başın sıkışırsa gönüldaşın burada!"`
        }
      ]
    }
  ]
},

// --- Bahar Gönüldaşlık ---
{
  id: 'chun_lan_zhiji_7',
  npcId: 'chun_lan',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Çay Bahçesinde Gece Sözü',
  scenes: [
    { text: `Bahar seni çay bahçesinin derinliklerinde gece çayı içmeye çağırır. Ay ışığı yaprakların üstünde gümüş gibi parlamaktadır. Daha önce kimseye sunmadığı bir demlik çıkarır. "Bunun adı 'gönüldaş demi'. Kendi usulümle hazırladım."` },
    {
      text: `"Eskiden bunu yalnız içer, adına da içimden gülerdim." der. Başını hafifçe öne eğer. "Şimdi {player} var... artık bu ismi hak etti."`,
      choices: [
        {
          text: `"Bahar, içtiğim en güzel çaylardan biri bu."`,
          friendshipChange: 120,
          response: `Bahar ay gibi gülümser. "Öyleyse her yıl yeni çay çıktığında ilk fincanı sana ayıracağım."`
        },
        {
          text: `"Gönüldaş demi... adı da kendisi gibi güzel."`,
          friendshipChange: 80,
          response: `"İyi çayı, anlayan biriyle içmek gerekir." Bahar fincanına bir kere daha çay doldurur. "Bu gece acelemiz yok."`
        }
      ]
    }
  ]
},
{
  id: 'chun_lan_zhiji_9',
  npcId: 'chun_lan',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'İkiz Demlik',
  scenes: [
    { text: `Bahar küçük bir kutu getirir. İçinden biçimleri aynı, boyları farklı iki demlik çıkar. Dışlarına zarif çiçekler işlenmiştir. "Bunlar ailemizin yadigârıdır. Biri büyük, biri küçük; ama takım hâlindedirler."` },
    {
      text: `"Söylenene göre, bunlar ayrı ayrı kullanılırsa sıradan tat verir; bir aradaysa demleri başka olur." Küçüğünü sana uzatır. "Büyüğü bende kalsın; küçüğü sen taşı."`,
      choices: [
        {
          text: `Demliği iki elinle alırsın. "Bunu elimde tutmak, seni yanı başımda hissetmek gibi."`,
          friendshipChange: 160,
          response: `Bahar büyük demliği en görünür yere bırakır. "Bundan sonra biri sorarsa derim ki: bunun öteki parçası, en kıymetli gönüldaşımda."`
        },
        {
          text: `"Merak etme, bunu özenle saklarım."`,
          friendshipChange: 120,
          response: `"Çay da demlik de kullanıldıkça kıymet kazanır." Bahar gülümser. "Dostluk da öyledir; gidip gelmekle çoğalır."`
        }
      ]
    }
  ]
},

// --- Nazan Gönüldaşlık ---
{
  id: 'xue_qin_zhiji_7',
  npcId: 'xue_qin',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Adsız Resim',
  scenes: [
    { text: `Nazan'ın odası resim doludur. Köşedeki örtülü bir tabloyu işaret eder: "Şunu üç yıldır bitiremiyorum. Gel, bir bak."` },
    { text: `Örtüyü kaldırdığında puslu bir manzara görürsün. Ortası boş bırakılmıştır. "Ne koysam eksik geldi." der Nazan.` },
    {
      text: `Fırçayı eline alır, kısa bir sessizlikten sonra boşluğa yan yana oturan iki siluet çizer. "...Demek eksik olan buymuş."`,
      choices: [
        {
          text: `"Nazan, bu resim şimdi bambaşka oldu."`,
          friendshipChange: 120,
          response: `Nazan'ın yanakları hafifçe kızarır. "...Buna 'Gönüldaşlar' derim artık. Satılık değil."`
        },
        {
          text: `"Demek sen de hep böyle bir dostu arıyordun."`,
          friendshipChange: 80,
          response: `"Sus." der ama dudaklarının ucu hafifçe kıvrılır. "...Doğru söyledin yine de."`
        }
      ]
    }
  ]
},
{
  id: 'xue_qin_zhiji_9',
  npcId: 'xue_qin',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Resimde Sen Varsın',
  scenes: [
    { text: `Nazan sana bir tomar uzatır. "Aç." Sesi her zamankinden daha gergindir.` },
    { text: `Tomarı açtığında ince işlenmiş büyükçe bir resim çıkar. Üstündeki kişi bütünüyle sana benzer; arka planda ise gaKöyün dört mevsimi vardır. Her ayrıntı büyük bir özenle çizilmiştir.` },
    {
      text: `"Bunu uzun vakitte bitirdim." der Nazan, gözlerini kaçırmadan. "İyi resim için iyi bir yüz gerekir. Uzun uzun çizmek isteyeceğim tek kişi sendin."`,
      choices: [
        {
          text: `"Bunu evimin en görünür yerine asacağım."`,
          friendshipChange: 160,
          response: `Nazan'ın yüzünde nadir görülen tam bir gülümseme belirir. "...Öyleyse yeni ilham gelince evine gelip çizim yaparım. Gönüldaşlar arasında izin istemek gerekmez."`
        },
        {
          text: `"Hayatımda aldığım en kıymetli hediyelerden biri bu."`,
          friendshipChange: 120,
          response: `"Hıh." Nazan başını yana çevirir ama sesi hayli yumuşaktır. "Daha niceleri olur. Çünkü anlayan biri varken ilham kurumaz."`
        }
      ]
    }
  ]
},

// --- Suna Gönüldaşlık ---
{
  id: 'su_su_zhiji_7',
  npcId: 'su_su',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Gönül Düğümü',
  scenes: [
    { text: `Suna seni dükkânın arka avlusunda bekler. Masanın üstünde çeşit çeşit ipek iplik durmaktadır. "Sana bir şey öğretmek istiyorum." der. "Bu, gönüldaşların ördüğü bir düğümdür."` },
    { text: `Sabırla, ilmik ilmik nasıl örüldüğünü gösterir. Parmaklarınız ara ara birbirine dokunur; Suna her seferinde hafifçe çekinir ama öğretmeye devam eder.` },
    {
      text: `Sonunda iki aynı düğüm ortaya çıkar. Biri kırmızı, biri maviye çalan tondadır. "Biri benim, biri senin gönlünü simgelesin. Bağlanınca çözülmesinler."`,
      choices: [
        {
          text: `"Bunu hep yanımda taşıyacağım."`,
          friendshipChange: 120,
          response: `Suna kırmızı olanı bileğine bağlar. "Gönüller bir olursa yol da kolaylaşır."`
        },
        {
          text: `"Elin gerçekten eşsiz iş çıkarıyor."`,
          friendshipChange: 80,
          response: `"Çünkü bunu gönüldaş için ördüm." Suna hafifçe gülümser ve ötekini kendi bileğine bağlar.`
        }
      ]
    }
  ]
},
{
  id: 'su_su_zhiji_9',
  npcId: 'su_su',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Gönüldaş Giysisi',
  scenes: [
    { text: `Suna sana özenle dikilmiş bir giysi getirir. Kumaşı yumuşak, rengi sade ama göz alıcıdır. Yaka ve kollarında ince işleme vardır. "Bunu tam bir ayda bitirdim."` },
    {
      text: `"Kumaşını çoktan beri saklıyordum. Motifleri de kendim düşündüm; birbirine dolanmış dallar gibi." Gözleri pırıl pırıldır. "Bir denesen?"`,
      choices: [
        {
          text: `Giysiyi giyip ona dönersin. "Bu, dost elinden çıkmış gerçek bir armağan."`,
          friendshipChange: 160,
          response: `Suna'nın gözleri dolu dolu olur. "Her dikişinde benim gönlüm var. Üzerinde görünce... sanki hep yanında olacağım gibi geliyor."`
        },
        {
          text: `"Çok güzel olmuş Suna. Sen gerçekten usta bir terzisin."`,
          friendshipChange: 120,
          response: `"Sen de iyi bir gönüldaşsın." Suna yakayı usulca düzeltir. "Sana çok yakıştı."`
        }
      ]
    }
  ]
},

// --- Zeyno Gönüldaşlık ---
{
  id: 'hong_dou_zhiji_7',
  npcId: 'hong_dou',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Gönüldaş Küpü',
  scenes: [
    { text: `Zeyno seni içki ocağının en dip kısmına götürür. Tozlu bir küp indirir. "Bunu babam gömdü. Dedi ki, ancak gerçek gönüldaş bulunursa açılır."` },
    { text: `Küpün mührünü kırar, ağır ama hoş bir koku yayılır. Sana tas doldurur, kendine de koyar. "Haydi! Gönüldaş tası, dibine kadar!"` },
    {
      text: `İlk yudum boğazdan ateş gibi geçer ama sonunda tatlı bir sıcaklık bırakır. Zeyno gözlerini hafifçe siler. "Babam derdi ki, gönüldaş iyi içkiden de zordur. Bulunca da bırakılmaz."`,
      choices: [
        {
          text: `"Bu içki de bu dostluk da pek kıymetli."`,
          friendshipChange: 120,
          response: `Zeyno omzuna sağlam bir şaplak indirir. "İşte böyle konuş! Bir tas daha!" der. Gülmeye çalışsa da gözünden yaş süzülür. "Babam görseydi sevinecekti."`
        },
        {
          text: `"Bu kadar önemli bir küpü benimle açtığın için sağ ol."`,
          friendshipChange: 80,
          response: `"Aman, ne teşekkürü!" Zeyno eliyle havayı yarar. "Gönüldaşlar teşekkür mü eder? Hadi bitirelim şunu!"`
        }
      ]
    }
  ]
},
{
  id: 'hong_dou_zhiji_9',
  npcId: 'hong_dou',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Tas Kardeşliği',
  scenes: [
    { text: `Zeyno arka avluda bir masa kurmuştur. Elinde iki aynı tas vardır; üzerlerine "gönüldaş" işlenmiştir. "Bugün işi usulüne göre yapacağız!"` },
    {
      text: `"Bundan böyle bu taslar bizim olsun." Bu kez yüzündeki ifade şaşırtıcı biçimde ciddidir. "Gökyüzü, toprak ve çiçekler şahit olsun. İyi günde de darda da omuz omuza."`,
      choices: [
        {
          text: `Tasını kaldırırsın. "İyi günde de darda da!"`,
          friendshipChange: 160,
          response: `Taslar çarpışır. Zeyno kahkahayla güler: "Tamamdır! Artık sen benim en sıkı gönüldaşımsın!" Sonra yine doldurur. "Bu gece uyku yok!"`
        },
        {
          text: `"Zeyno, sen göründüğünden daha da duyguluymuşsun."`,
          friendshipChange: 120,
          response: `"Hıh!" Zeyno'nun yüzü kızarır. "Ben de utanırım ha! Ama gönüldaşımın yanında numara yapmam. Haydi iç!"`
        }
      ]
    }
  ]
},

// --- Cemil Gönüldaşlık ---
{
  id: 'dan_qing_zhiji_7',
  npcId: 'dan_qing',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Yazı Meclisi',
  scenes: [
    { text: `Cemil koruluktaki taş masaya kâğıt, kalem ve mürekkep dizer. "Eski büyükler yazı meclisleri kurarmış. Bugün kalabalık yok ama ikimiz de yetiyoruz."` },
    { text: `Kalemi mürekkebe batırıp birkaç kelime yazar, sonra sana uzatır. "Gönüldaşlar bazen sözü yazıyla sınar. Buyur."` },
    {
      text: `Sırayla yazı yazar, okur, yorum yaparsınız. Cemil'in gözleri ışıldar. "Bazı dostluklar çok konuşmadan anlaşılır. Ben de bunu senin yanında öğrendim."`,
      choices: [
        {
          text: `"Senin kalemin gönle dokunuyor. Seninle böyle oturmak benim için de kıymetli."`,
          friendshipChange: 120,
          response: `Cemil gülümseyip kâğıda iki kelime daha yazar: "Hakiki Dost". "Bunu sana armağan ediyorum. Görünen bir yere as."`
        },
        {
          text: `"Seninle bir arada oturmak, uzun zamandır aranan huzur gibi."`,
          friendshipChange: 80,
          response: `"Güzel söyledin." Cemil içtenlikle gülümser. "Bunu bir gün yazıma koyarım; çünkü gönüldaş sözü kıymetlidir."`
        }
      ]
    }
  ]
},
{
  id: 'dan_qing_zhiji_9',
  npcId: 'dan_qing',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Kalem Dostluğu',
  scenes: [
    { text: `Cemil sana el yazısıyla doldurulmuş bir defter verir. Kapağında "Dostluk Defteri" yazar. "Yıllardır yazdıklarımın içinden en sevdiklerimi topladım. Birçoğu, seninle tanıştıktan sonra kaleme döküldü."` },
    {
      text: `"Ben güçlü biri değilim." der sakince. "Ama gönüldaş başı sıkıştığında, kalem ehli de olsa geri durmamalı." Bakışı açık ve içtendir.`,
      choices: [
        {
          text: `"Bu dostluğa ben de sonuna dek sahip çıkarım."`,
          friendshipChange: 160,
          response: `Cemil'in gözleri hafifçe dolar, ama gülümsemeyi elden bırakmaz. "Bu söz bana yeter. Böylesi bir bağ varken başka ne istenir?"`
        },
        {
          text: `"Bu defteri özenle saklayacağım."`,
          friendshipChange: 120,
          response: `"Kâğıt eskir, mürekkep solar." Cemil başını sallar. "Ama insan yüreğinde saklarsa söz kaybolmaz."`
        }
      ]
    }
  ]
},

// --- Demir Gönüldaşlık ---
{
  id: 'a_tie_zhiji_7',
  npcId: 'a_tie',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Demircinin Sırrı',
  scenes: [
    { text: `Demir seni dükkânın arka tarafına gizlice çeker. "Bir şey göstereceğim... bunu ancak gönüldaşa gösteririm." Dolaptan tuhaf biçimli küçük bir bıçak çıkarır.` },
    { text: `"Bu, tek başıma tamamladığım ilk iş." der. Ali Usta'nın bilmediğini de ekler. Bıçakta bariz kusurlar vardır ama kabzasına eğri büğrü bir işaret kazınmıştır.` },
    {
      text: `"Biraz çirkin oldu, değil mi?" Demir başını eğer. "Ama benim için kıymetlidir. Gönüldaşıma göstermek istedim."`,
      choices: [
        {
          text: `"Bu bıçağın manası, nice parlak silahtan daha ağır basar."`,
          friendshipChange: 120,
          response: `Demir'in gözleri iyice açılır. "Cidden mi? O zaman söz! Usta olduktan sonra sana çok daha iyisini yapacağım!"`
        },
        {
          text: `"Bana bunu göstermiş olman büyük güven demek."`,
          friendshipChange: 80,
          response: `"Hı!" Demir kuvvetle başını sallar, kulakları kıpkırmızıdır. "Gönüldaşa insan en mahcup olduğu şeyi bile gösterebilir!"`
        }
      ]
    }
  ]
},
{
  id: 'a_tie_zhiji_9',
  npcId: 'a_tie',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'İkiz Bilezik',
  scenes: [
    { text: `Demir koşa koşa gelir. "Bitti!" Elindeki kutuyu açar; içinden parlatılmış iki sade ama sağlam demir bilezik çıkar.` },
    {
      text: `"Bunu en iyi demirden dövdüm! Yedi gece uğraştım!" der heyecanla. "Usta der ki, en iyi işi en kıymetli kişiye verirsin. Gönüldaş da odur işte!"`,
      choices: [
        {
          text: `Bileziği takıp Demir'in elini güçlüce sıkarsın. "Bundan sonra kardeş kadar yakınsın."`,
          friendshipChange: 160,
          response: `Demir de ötekini takar, elini daha da sıkı kavrar. "Ben de söz! Bundan sonra aletin, işin gücün benden sorulur!"`
        },
        {
          text: `"Bu demir sade olabilir ama üstündeki emek altından ağır."`,
          friendshipChange: 120,
          response: `Demir'in gözleri dolar. "Ben güzel konuşamam... ama sen benim en kıymetli dostumsun. Bu hiç değişmez."`
        }
      ]
    }
  ]
},

// --- Baran Gönüldaşlık ---
{
  id: 'yun_fei_zhiji_7',
  npcId: 'yun_fei',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Kartal Yuvası',
  scenes: [
    { text: `Baran seni arka dağın en sarp yamacına çıkarır. Zirvede tek bir çam vardır; dallarından birine kocaman bir kartal yuvası kurulmuştur. "Bu yuvayı üç yıldır gözlerim." der.` },
    { text: `Gökte dönen kartal gelip ağaca konar; sizden ürküp kaçmaz. "Bana alıştı." der Baran. "Şimdi... seni de kabullendi."` },
    {
      text: `"Buraya herkesi getirmem." Uzak dağlara bakar. Sesi nadir görülen bir yumuşaklık taşır. "Ama sen gönüldaşsın. O yüzden bu manzara da senin."`,
      choices: [
        {
          text: `"Bana en saklı yerini açtın."`,
          friendshipChange: 120,
          response: `Baran uzun süre sessiz kalır. Sonra yalnızca iki kelime söyler: "Değdi." Kartal, akşam ışığında yukarıda geniş daireler çizer.`
        },
        {
          text: `"Bana güvendiğin için sağ ol."`,
          friendshipChange: 80,
          response: `"Teşekküre gerek yok." Baran'ın ağzının kenarı hafifçe yukarı kıvrılır. "Gönüldaşlar arasında bunlar söylenmez."`
        }
      ]
    }
  ]
},
{
  id: 'yun_fei_zhiji_9',
  npcId: 'yun_fei',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Avcı Sözü',
  scenes: [
    { text: `Baran toprağa bir bıçak saplar. Ay ışığında çeliği parıldar. "Bu bıçak on yıldır belimdeydi."` },
    {
      text: `"Avcılar arasında bir töre vardır." Sana dosdoğru bakar. "Birine kendi bıçağını verirsen, canını da ona emanet etmiş sayılırsın. Ben bunu sana veriyorum."`,
      choices: [
        {
          text: `Bıçağı yerden çekip dikkatle koynuna koyarsın. "Senin canın da benim emanetimdir."`,
          friendshipChange: 160,
          response: `Baran ilk kez açıkça gülümser; bu alaycı değil, düpedüz içten bir gülüştür. "...İyi." der. "Bundan sonra dağda arkana ben bakarım."`
        },
        {
          text: `"Baran... bu fazla kıymetli."`,
          friendshipChange: 120,
          response: `"Kıymetli diye vermiyorum sanıyorsan beni tanımamışsın." Kaşlarını çatar ama sesi yumuşar. "Al. Bunu verecek kadar güvendiğim tek kişi sensin."`
        }
      ]
    }
  ]
},

// --- İbo Gönüldaşlık ---
{
  id: 'da_niu_zhiji_7',
  npcId: 'da_niu',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Süt Kardeşliği',
  scenes: [
    { text: `İbo seni heyecanla ahıra çeker. "Gel çabuk! Uğur ilk kez süt verdi! İlk tası gönüldaş içer!"` },
    { text: `Taze sütü iki tasa doldurmaya çalışırken yarısını masaya sıçratır. "He he... elim titredi."` },
    {
      text: `Taslardan birini sana uzatır. "Ben öyle okumamış adam değilim. Güzel söz de bilmem. Ama şunu bilirim: aynı tastan süt içen adamlar birbirini yarı yolda bırakmaz!"`,
      choices: [
        {
          text: `Tasını kaldırıp bir dikişte içersin. "Öyleyse bundan sonra omuz omuzayız."`,
          friendshipChange: 120,
          response: `"İşte bu!" İbo göğsünü gere gere güler. "Artık benim ağırım da hafifim de senindir!"`
        },
        {
          text: `"İbo, sandığından daha güzel konuşuyorsun."`,
          friendshipChange: 80,
          response: `"Sahi mi?" İbo ensesini kaşıyıp kahkaha atar. "Bunu senden duymak, on inekten övgü almak gibi!"`
        }
      ]
    }
  ]
},
{
  id: 'da_niu_zhiji_9',
  npcId: 'da_niu',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Ağıl Andı',
  scenes: [
    { text: `İbo, ağılın girişine yeni bir tahta tabela asmıştır. Üzerine seninle kendi adını yamuk yumuk kazımıştır.` },
    {
      text: `"Bugünden sonra burası ikimizin de yeri sayılır!" der; gözleri sulanmıştır. "Ben hep yanımda biri olsun istemiştim. Gönüldaş dediğin, iş ortağından da öte olur!"`,
      choices: [
        {
          text: `Omzuna vurursun. "Bu ağılın hatırı da sözü de ortak."`,
          friendshipChange: 160,
          response: `İbo kuvvetle başını sallayıp sana sarılır; neredeyse nefesini kesecektir. "Çok iyi oldu! Şimdi gidip hayvanlara fazladan yem vereceğim, kutlama olsun!"`
        },
        {
          text: `"Böyle bir dosta sahip olmak benim için baht."`,
          friendshipChange: 120,
          response: `İbo hüngür hüngür olmasa da gözlerini tutamaz. "Aman... böyle konuşma, ben hemen duygulanıyorum... ama vallahi çok sevindim!"`
        }
      ]
    }
  ]
},

// --- Mahir Gönüldaşlık ---
{
  id: 'mo_bai_zhiji_7',
  npcId: 'mo_bai',
  requiredFriendship: 1750,
  requiresZhiji: true,
  title: 'Sözsüz Ezgi',
  scenes: [
    { text: `Mahir ay ışığında sana daha önce hiç duymadığın bir parça çalar. Ezgi bir neşe dalgasıyla başlar, sonra kedere uğrar, en sonunda da dinginliğe varır. Bittiğinde uzun süre sana bakar.` },
    {
      text: `"Bunun adı yok." der usulca. "Sözü de yok. Çünkü bu parça kulakla değil, yürekle anlaşılır. Ancak gönüldaş anlayabilir."`,
      choices: [
        {
          text: `"Duydum Mahir. Sevinci de kederi de, sonunda gelen huzuru da duydum."`,
          friendshipChange: 120,
          response: `Mahir olduğu yerde kalır. Başını eğer, parmakları sazın tellerine hafifçe dokunur. "...Gerçekten duydun. On yıldır bunu ilk kez birine söyleyebiliyorum."`
        },
        {
          text: `"Bu ezgi çok güzeldi."`,
          friendshipChange: 80,
          response: `"Güzel olmasından öte..." Mahir hafifçe başını sallar. "Bu parça gerçektir. Ben ancak gönüldaşın yanında hakiki sesi çıkarabilirim."`
        }
      ]
    }
  ]
},
{
  id: 'mo_bai_zhiji_9',
  npcId: 'mo_bai',
  requiredFriendship: 2250,
  requiresZhiji: true,
  title: 'Gönüldaş Sazı',
  scenes: [
    {
      text: `Mahir daha önce hiç görmediğin bir saz kutusu açar. İçinde küçük, eski bir saz vardır. Üstüne küçük bir işaret kazınmıştır. "Bunu ustam bana bırakmıştı. Demişti ki, gerçek gönüldaşı bulunca bunu ona emanet et."`
    },
    {
      text: `"Çalmayı bilmen şart değil." der, sazı dikkatle sana uzatırken. "Yanında dursun yeter; böylece benim sesim de yanında kalır." Bakışları beklenmedik kadar yumuşaktır. "Eskiler, anlayan gidince sazı kırar der. Ben öyle yapmam. Çünkü sen varsın."`,
      choices: [
        {
          text: `Sazı iki elinle alırsın. "Bu saz elimde kaldıkça sesin de gönlümde kalır. Ben senin ezgini unutmayacağım."`,
          friendshipChange: 160,
          response: `Mahir gözlerini kapatıp kendi sazında tek bir tel titreştirir. Nota geceye yayılır. "...İyi." der. "Öyleyse bu ses hiç kaybolmaz."`
        },
        {
          text: `"Mahir, bunu iyi saklayacağım."`,
          friendshipChange: 120,
          response: `"Saklamak yetmez." Mahir hafifçe gülümser. "Bir gün ilk notayı çıkarmayı öğrendiğinde, bana çal."`
        }
      ]
    }
  ]
}
]

/** Düğün olayı tanımı (genel, npcId çalışma anında değiştirilir) */
export const WEDDING_EVENT: HeartEventDef = {
  id: 'wedding_ceremony',
  npcId: '',
  requiredFriendship: 0,
  title: 'Bir Yastıkta Kocayın',
  scenes: [
    {
      text: `Uzun zamandır beklediğin gün nihayet gelmiştir. Sabah güneşi gaKöy meydanına vurur. Köylüler erkenden meydana renkli bezler ve fenerler asmıştır. Hasan Enişte kapıda geleni gideni karşılar, Fatma Teyze ise düğün sofrası için oradan oraya koşturur.`
    },
    {
      text: `Üstüne yeni düğün esvabını giyip meydanın ortasında durursun. Muhtar Mehmet, nikâh şahidi olarak öne çıkar ve gür sesiyle der ki: "Bugün hayırlı bir gündür; gaKöy yine bir yuvaya kavuşuyor." Kalabalıktan sevinç sesleri yükselir.`
    },
    {
      text: `Gönlünü verdiğin kişi ağır adımlarla sana yaklaşır. Üstünde al renkli düğünlük, yüzünde utangaç ama ışıklı bir gülümseme vardır. Herkesin huzurunda birbirinize armağanlarınızı verirsiniz. Muhtar Mehmet yüksek sesle ilan eder: "Söz tamamdır! Bir yastıkta kocayın, saçlarınız ak olana dek birlikte yürüyün!"`
    },
    {
      text: `Şölen sofrasında Fatma Teyze en güzel yemeklerini dizer, Rıza Dayı sakladığı en iyi içkiyi çıkarır, Hoca Efendi ise o anın hatırına birkaç kutlu söz kaleme alır. Mıstık ile Yaman masa altından tatlı aşırır, Zehra da meraklı gözlerle size bakar. Bütün gaKöy sevinç içindedir.`
    },
    {
      text: `Gece çöktüğünde misafirler yavaş yavaş dağılır. Siz de sıcacık yuvanıza dönersiniz. Bugünden sonra orası yalnız senin çiftliğin değildir artık; ikinizin birlikte kurduğu ocaktır.`
    }
  ]
}

/** NPC kimliğine göre tüm gönül olaylarını getirir */
export const getHeartEventsForNpc = (npcId: string): HeartEventDef[] => {
  return HEART_EVENTS.filter(e => e.npcId === npcId)
}

/** Olay kimliğine göre gönül olayı tanımını getirir */
export const getHeartEventById = (id: string): HeartEventDef | undefined => {
  return HEART_EVENTS.find(e => e.id === id)
          }
