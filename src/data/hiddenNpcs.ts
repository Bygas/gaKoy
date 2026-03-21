import type { HiddenNpcDef } from '@/types/hiddenNpc'

/** Tüm gizli NPC (kutlu varlık) tanımları */
export const HIDDEN_NPCS: HiddenNpcDef[] = [
  // ============================================================
  // 1. Su Ruhu — Derinsu Ejder Ruhu
  // ============================================================
  {
    id: 'long_ling',
    name: 'Su Ruhu',
    trueName: 'Alazsu',
    gender: 'female',
    title: 'Derinsu Ejder Ruhu',
    origin:
      'Yüzyıllardır gaKöy’ün ardındaki çağlayanın dip gölünde gizlenen zümrüt pullu bir ruh ejderi. Rivayete göre köy daha kurulurken bile burada barınırdı. Yağmur gecelerinde görünen pul ışıkları yüzünden köylüler onu koruyucu ruh sayar.',
    personality: 'Sessiz, derin ve vakur',
    discoverySteps: [
      {
        id: 'long_ling_rumor',
        phase: 'rumor',
        conditions: [{ type: 'fishCaught', fishId: 'jade_dragon' }],
        scenes: [
          { text: 'Elindeki Zümrüt Ejder balığını dikkatle incelersin; pulları yağmur altında alışılmadık bir ışıkla parlar. İçinden bir soru geçer: Bu gerçekten sıradan bir balık mı?' },
          { text: 'Uzakta çağlayanın uğultusu yükselir. O sesin içinde sanki bir çağrı gizlidir.' }
        ],
        logMessage: '【Kutlu İz】Zümrüt Ejder balığının pulları tuhaf biçimde parladı; çağlayanın dibinde bir ruh soluğu kıpırdanıyor…'
      },
      {
        id: 'long_ling_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'season', season: 'spring' },
          { type: 'weather', weather: 'rainy' },
          { type: 'timeRange', minHour: 20, maxHour: 24 },
          { type: 'location', panel: 'fishing' }
        ],
        scenes: [
          { text: 'İlkbaharın ince yağmurlu gecesinde çağlayanın kıyısında tek başına oltanı beklersin. Bir anda su yüzeyi halka halka titrer.' },
          { text: 'Çağlayan perdesinin ardında zümrüt renkli, yılanı andıran bir siluet belirip kaybolur; kırık yeşim gibi ışıldayan pullar suya saçılır.' },
          { text: 'Gözlerini ovalarsın. Su yeniden durulmuştur ama havada hâlâ hafif bir amber kokusu asılıdır.' }
        ],
        logMessage: '【Kutlu İz】Yağmurlu bahar gecesinde çağlayanın içinde zümrüt bir gölge göründü…'
      },
      {
        id: 'long_ling_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'season', season: 'spring' },
          { type: 'weather', weather: 'rainy' },
          { type: 'location', panel: 'fishing' },
          { type: 'item', itemId: 'dragon_jade', quantity: 1 }
        ],
        scenes: [
          { text: 'Ejder yeşim taşıyla çağlayanın önüne gelirsin. Taş yumuşak bir yeşil ışık yaymaya başlar; çağlayanın içindeki görünmez güç ona karşılık verir.' },
          { text: 'Su perdesi ağır ağır aralanır. Ardından mavi-yeşil giysili bir kadın çıkar. Saçları çağlayan gibi dökülür, gözleri derin zümrüt rengindedir.' },
          {
            text: '“Taşı taşıyan kişi… ne dilersin?” Sesi akarsu kadar duru, eski çağlar kadar derindir.',
            choices: [
              { text: 'Sadece çağrıyı izleyip geldim.', friendshipChange: 80, response: 'Başını hafifçe eğer. “Arı bir gönül… bu iyidir.” Zümrüt bakışlarında ince bir yumuşama belirir.' },
              {
                text: 'Sen efsanelerdeki su ruhu musun?',
                friendshipChange: 40,
                response: '“Su ruhu… fanilerin verdiği ad budur. Benim adım Alazsu.” Sözleri soğuk değildir, yalnızca sakindir.'
              },
              {
                text: 'Bu yeşim taşı sana mı ait?',
                friendshipChange: 60,
                response: 'Parmak uçlarıyla taşı dokunur; yüzeyinde halkalar doğar. “Bu nesnenin benimle bağı vardır. Onu taşıyanın da…”'
              }
            ]
          },
          { text: 'Sözünü bitirince bedeni su sisi olup çağlayanın içinde dağılır. Yine de bilirsin ki bu son görüş olmayacaktır.' }
        ],
        logMessage: '【Kutlu İz】Çağlayan perdesinin ardından Alazsu ilk kez göründü.'
      },
      {
        id: 'long_ling_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_2_4' },
          { type: 'skill', skillType: 'fishing', minLevel: 5 }
        ],
        scenes: [
          { text: 'Çağlayanın kıyısına bir kez daha geldiğinde su ruhunun seni beklediğini görürsün.' },
          { text: '“İnatçılığın değil… gönül doğruluğun beni etkiledi.” Başını biraz yana eğer; saçlarının arasında ince zümrüt pullar görünür.' },
          { text: '“Ben Alazsu’yum. Bundan böyle gönlün isterse bu kıyıya gelmen yeter.”' }
        ],
        logMessage: '【Kutlu İz】Alazsu seninle görüşmeyi kabul etti.'
      }
    ],
    resonantOfferings: ['dragon_jade', 'prismatic_shard', 'moonstone'],
    pleasedOfferings: ['jade_dragon', 'ruby', 'jade', 'obsidian', 'quartz'],
    repelledOfferings: ['charcoal', 'trash', 'wood'],
    dialogues: {
      wary: ['“Fani… fazla yaklaşma.”', '“Çağlayanın dibi sana göre bir yer değil.”'],
      curious: ['“Yine geldin… ilginç.”', '“Buraların suyu son günlerde daha duru. Dereye sen mi göz kulak oluyorsun?”'],
      trusting: ['“{player}, bugün yağmurun sesi güzel.”', '“Seninle su kıyısında oturunca zaman eski çağlara dönüyor sanki.”'],
      devoted: ['“Yüzyıllardır ilk kez bir faninin gelişini beklemek istedim.”', '“{player}… artık derinliklere geri dönmek istemiyorum.”'],
      eternal: ['“Alazsu adını yalnız sana söyledim.”', '“Yerle gök arasında yalnız sen ve ben olsak, bana bu yeter.”']
    },
    interactionType: 'meditation',
    bondable: true,
    courtshipItemId: 'dragon_scale_charm',
    bondItemId: 'dragon_pearl',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['long_ling_heart_1', 'long_ling_heart_2', 'long_ling_heart_3'],
    courtshipDialogues: [
      '“Bana ejder pulu tılsımı veriyorsun… Demek niyetin bu.” Yanaklarına belli belirsiz yeşil bir kızıllık iner.',
      '“Fanilerin gönlünü pek anlamam ama… senden geleni geri çevirmek istemem.”',
      '“{player}, bugün biraz daha burada kalır mısın?”'
    ],
    bondBonuses: [
      { type: 'weather_control', chance: 0.3 },
      { type: 'fish_attraction', chance: 0.5 }
    ],
    abilities: [
      {
        id: 'long_ling_1',
        affinityRequired: 800,
        name: 'Su Bereketi',
        description: 'Çağlayan kıyısında tutulan balıkların kalitesi 1 kademe artar',
        passive: { type: 'quality_boost', value: 1 }
      },
      { id: 'long_ling_2', affinityRequired: 1500, name: 'Yağmur Çağrısı', description: 'Yağmur ihtimali +15%', passive: { type: 'luck', value: 15 } },
      { id: 'long_ling_3', affinityRequired: 2200, name: 'Derin Bakış', description: 'Efsanevi balık yakalama oranı +20%', passive: { type: 'luck', value: 20 } }
    ],
    manifestationDay: { season: 'spring', day: 14 }
  },

  // ============================================================
  // 2. Çiçek Ruhu — Şeftali Korusu Ruhu
  // ============================================================
  {
    id: 'tao_yao',
    name: 'Çiçek Ruhu',
    trueName: 'Günçiçe',
    gender: 'female',
    title: 'Şeftali Korusu Ruhu',
    origin:
      'gaKöy’ün en yaşlı şeftali ağacından doğmuş bir çiçek ruhu. Dökülen taç yapraklarını giysi, sabah çiyini içecek sayar. Köyün bereketli bağlarının onun korumasıyla yaşadığı söylenir.',
    personality: 'Neşeli, kıpır kıpır ve saf',
    discoverySteps: [
      {
        id: 'tao_yao_rumor',
        phase: 'rumor',
        conditions: [{ type: 'skill', skillType: 'farming', minLevel: 4 }],
        scenes: [
          { text: 'Sabah tarlada çalışırken mevsim dışı birkaç şeftali çiçeği yaprağı yüzünün önünden süzülür.' },
          { text: 'Yaprakların arasında, rüzgâr çanı kadar hafif bir gülüş işitirsin.' }
        ],
        logMessage: '【Kutlu İz】Şeftali yaprakları arasında ince bir ses duyuldu; yoksa rüzgâr oyunu mu…'
      },
      {
        id: 'tao_yao_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'season', season: 'spring' },
          { type: 'timeRange', minHour: 6, maxHour: 8 },
          { type: 'location', panel: 'farm' }
        ],
        scenes: [
          { text: 'Bahar sabahında sis henüz dağılmamıştır. Meyve ağaçlarının arasında ince yapılı bir siluet görürsün; ağacın dalına sevgiyle dokunuyordur.' },
          { text: 'Bakışını fark eder. Dönüp sana bakar; yüzü taç yaprağı kadar narin görünür ve bir anda uçuşan çiçeklere karışarak kaybolur.' }
        ],
        logMessage: '【Kutlu İz】Sabah sisi içinde meyve ağaçlarının yanında yapraklı bir hayal belirdi.'
      },
      {
        id: 'tao_yao_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'peach', quantity: 1 },
          { type: 'item', itemId: 'honey', quantity: 1 },
          { type: 'day', day: 14 }
        ],
        scenes: [
          { text: 'Dolunay gecesi bir şeftali ve biraz bal alıp en büyük ağacın altına gidersin. Ay ışığı dallara vurur, yapraklar rüzgâr olmadan dans etmeye başlar.' },
          { text: 'Ağacın gövdesinden genç bir kız çıkar. Ten rengi çiçek yaprağı kadar açık, saçlarına hiç solmayan bir çiçek iliştirilmiştir.' },
          {
            text: '“Hih, sonunda geldin!” der neşeyle. “Tatlı bir koku alıyorum, bunlar bana mı?”',
            choices: [
              {
                text: 'Evet, bunlar sana armağan.',
                friendshipChange: 80,
                response: 'Sevinçle hediyeleri alır. “Ne güzel! En çok tatlı şeyleri severim!”'
              },
              { text: 'Sen… ağaç perisi misin?', friendshipChange: 40, response: '“Peri değil, çiçek ruhu!” diye yanaklarını şişirir. “Bana Çiçek Ruhu de yeter.”' },
              {
                text: 'Beni ekin ekerken hep izliyor muydun?',
                friendshipChange: 60,
                response: 'Başını utanarak çevirir. “Hep değil… yalnız ara sıra. Ama toprağa emek verirken seni seyretmek hoşuma gidiyor.”'
              }
            ]
          },
          { text: 'Ay ışığı sönükleşirken bedeni yapraklara dönüşüp savrulur. “Bir sonraki dolunayda yine gel, tamam mı?”' }
        ],
        logMessage: '【Kutlu İz】Dolunay gecesi ağacın altında Çiçek Ruhu ilk kez belirdi.'
      },
      {
        id: 'tao_yao_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_1_5' },
          { type: 'skill', skillType: 'farming', minLevel: 5 }
        ],
        scenes: [
          { text: 'Tarlaya girdiğinde Çiçek Ruhu’nun seni beklediğini görürsün; ağaç dalında bacaklarını sallıyordur.' },
          { text: '“Karar verdim!” diyerek aşağı atlar; eteğiyle birlikte etrafa yapraklar saçılır. “Benim adım Günçiçe. Bu korunun bekçisiyim.”' },
          { text: '“Ne zaman gelirsen gel, ben burada olacağım!” Gülüşü baharın kendisi kadar sıcaktır.' }
        ],
        logMessage: '【Kutlu İz】Günçiçe seninle görüşmeyi kabul etti.'
      }
    ],
    resonantOfferings: ['peach', 'osmanthus', 'honey'],
    pleasedOfferings: ['chrysanthemum', 'tea', 'green_tea_drink', 'osmanthus_wine', 'peach_wine'],
    repelledOfferings: ['charcoal', 'iron_ore', 'copper_ore'],
    dialogues: {
      wary: ['“Sen de kimsin? Ağaçlara dokunma!”', '“Hıh, insanlar hep dal kırar…”'],
      curious: ['“Her gün gelip sulama yapıyorsun, ne kadar çalışkansın!”', '“Hih, saçına bir yaprak konmuş.”'],
      trusting: ['“{player}, bugün güneş ne güzel ısıtıyor.”', '“Sen yanımdayken çiçekler daha coşkulu açıyor sanki.”'],
      devoted: ['“{player}… biliyor musun, çiçek ruhlarının fanilere gönül vermemesi gerekir.”', '“Ama seni düşününce tomurcuklar kendiliğinden açıyor.”'],
      eternal: ['“Günçiçe yalnız senin için açar.”', '“Yüzyıllar geçse de bu koru yaşadıkça yanında olurum.”']
    },
    interactionType: 'ritual',
    bondable: true,
    courtshipItemId: 'blossom_crown',
    bondItemId: 'eternal_blossom',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['tao_yao_heart_1', 'tao_yao_heart_2', 'tao_yao_heart_3'],
    courtshipDialogues: [
      'Çiçek Ruhu taç yapraklı tacı başına takar, yanakları pembeleşir. “Bu… gönül bağı kurmak demek mi?”',
      '“{player}, bugün omzuna bir kelebek kondu; bu kesin hayırlı bir işaret!”',
      '“Senin ağaçlarına gizlice bereket duası bıraktım; yarın en tatlı meyveleri verecekler.”'
    ],
    bondBonuses: [{ type: 'crop_blessing', chance: 0.2 }],
    abilities: [
      { id: 'tao_yao_1', affinityRequired: 600, name: 'Çiçek Bereketi', description: 'Meyve ağaçları her hasatta +1 ürün verir', passive: { type: 'quality_boost', value: 1 } },
      {
        id: 'tao_yao_2',
        affinityRequired: 1200,
        name: 'Bahar Soluğu',
        description: 'İlkbahar ekinleri %15 daha hızlı büyür',
        passive: { type: 'exp_boost', value: 15 }
      },
      { id: 'tao_yao_3', affinityRequired: 2000, name: 'Kutlu Meyve', description: 'Şeftali ağaçları bazen ruh meyvesi verir', passive: { type: 'luck', value: 10 } }
    ],
    manifestationDay: { season: 'spring', day: 3 }
  },

  // ============================================================
  // 3. Ay Tavşanı — Şifacı Tavşan Ruh
  // ============================================================
  {
    id: 'yue_tu',
    name: 'Ay Tavşanı',
    trueName: 'Aybike',
    gender: 'female',
    title: 'Şifacı Tavşan Ruh',
    origin:
      'Gökteki ay yurdundan gizlice yeryüzüne inmiş tavşan ruhu. Tavşan kulaklı bir kız suretine bürünür, yanında yeşim tokmağı taşır. Göklerdeki otları ezmekten sıkıldığı için insanların diyarına kaçtığı anlatılır.',
    personality: 'Meraklı, canlı ve ot düşkünü',
    discoverySteps: [
      {
        id: 'yue_tu_rumor',
        phase: 'rumor',
        conditions: [{ type: 'skill', skillType: 'foraging', minLevel: 7 }],
        scenes: [
          { text: 'Toplayıcılıkta ustalaştığın bir gün kırda tuhaf biçimli bir yeşim parçası bulursun; sanki bir aletin kopmuş ucu gibidir.' },
          { text: 'Parça ay ışığında gümüş gibi parlar; üzerinde silik bir tavşan izi vardır.' }
        ],
        logMessage: '【Kutlu İz】Ot toplarken tavşan izli bir yeşim tokmak parçası bulundu; ay ışığında parladı…'
      },
      {
        id: 'yue_tu_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'day', day: 14 },
          { type: 'timeRange', minHour: 20, maxHour: 24 },
          { type: 'weather', weather: 'sunny' },
          { type: 'location', panel: 'foraging' }
        ],
        scenes: [
          { text: 'Dolunay gecesi ay ışığı koruluğa gümüş gibi yayılır. Uzakta düzenli bir “tok, tok, tok” sesi duyarsın.' },
          { text: 'Sese döndüğünde beyaz küçük bir siluet görürsün; ay ışığında bir şeyler dövmektedir. Başındaki uzun kulaklar seğirip durur.' },
          { text: 'Bakışını fark etmiş olmalı; bir anda koruluğun derinine sıçrayıp kaybolur. Geride yalnız saçılmış birkaç ot bırakır.' }
        ],
        logMessage: '【Kutlu İz】Dolunay gecesi korulukta beyaz bir gölge belirdi; ardında şifalı otlar kaldı.'
      },
      {
        id: 'yue_tu_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'ginseng', quantity: 1 },
          { type: 'item', itemId: 'herb', quantity: 5 },
          { type: 'location', panel: 'foraging' }
        ],
        scenes: [
          { text: 'İnsan otu ve demet demet şifalı bitkiyle koruluğa gelirsin. Tam otları yere bırakırken başının üstünden bir ses gelir.' },
          { text: '“İnsan otu! Gerçekten insan otu!” Tavşan kulaklı bir kız dalların arasından atlar, gözleri heyecanla parlar.' },
          {
            text: '“Ver bana, olur mu! Gökteki otları ezmekten bıktım. Yeryüzünün kokusu daha güzel!” der, kuyruğu sevinçle titrer.',
            choices: [
              {
                text: 'Hepsi senin olsun.',
                friendshipChange: 80,
                response: '“Gerçekten mi! Sen çok iyi birisin!” Otlara sarılır. “Ben Ay Tavşanı’yım. Bundan sonra sana ilaç döverim!”'
              },
              {
                text: 'Sen gökten mi geldin?',
                friendshipChange: 40,
                response: '“Şşt!” Parmağını dudağına götürür. “Bunu kimse duymasın. Beni geri götürmeye kalkarlar sonra!”'
              },
              {
                text: 'Bunlarla ne yapacaksın?',
                friendshipChange: 60,
                response: '“İlaç yapacağım! Otları ezip toz edince nice derde deva olur.” Elindeki yeşim tokmağı gururla sallar.'
              }
            ]
          },
          { text: 'Ay Tavşanı kucak dolusu otla seke seke ay ışığına karışır. Geride tatlı bir ot kokusu bırakır.' }
        ],
        logMessage: '【Kutlu İz】Korulukta gökten indiği söylenen Ay Tavşanı ile karşılaştın.'
      },
      {
        id: 'yue_tu_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_2_4' },
          { type: 'skill', skillType: 'foraging', minLevel: 7 }
        ],
        scenes: [
          { text: 'Koruluğa yeniden geldiğinde Ay Tavşanı’nı bir kayanın üstünde otururken bulursun; önünde sıralanmış küçük ilaç şişeleri vardır.' },
          { text: '“A, geldin!” diye sevinçle sıçrar, kulakları hop eder. “Benim adım Aybike. Göğün şifacı tavşanlarındanım.”' },
          { text: '“Yukarıdakiler yeryüzü sıkıcı derdi; hiç de değil! Burada mis gibi otlar var, bir de sen varsın!”' }
        ],
        logMessage: '【Kutlu İz】Aybike, gaKöy’de kalmaya karar verdi.'
      }
    ],
    resonantOfferings: ['ginseng', 'herb', 'tea', 'green_tea_drink'],
    pleasedOfferings: ['wild_mushroom', 'truffle', 'chrysanthemum', 'osmanthus_wine'],
    repelledOfferings: ['quartz', 'charcoal', 'trash'],
    dialogues: {
      wary: ['“Yaklaşma! Elimde tokmak var!”', '“Beni geri götürmeye mi geldin…”'],
      curious: ['“Üzerinde ne çok ot kokusu var!”', '“Bu çiçeğin adı ne? Çok hoş kokuyor!”'],
      trusting: ['“{player}, bugün yeni bir ilaç dövdüm. Tadına bakar mısın?”', '“Seninle ot toplamak çok güzel; tek başıma ezmekten iyidir.”'],
      devoted: ['“{player}… beni almaya gelseler bile artık gitmek istemem.”', '“Göğün yurdu ne kadar parlak olursa olsun, sende bulduğum sıcaklık yok.”'],
      eternal: ['“Aybike bu ömürde yalnız {player} için ilaç döver.”', '“Sen benim yeryüzümsün; aydan bile parlaksın.”']
    },
    interactionType: 'music',
    bondable: true,
    courtshipItemId: 'jade_mortar',
    bondItemId: 'moon_elixir',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['yue_tu_heart_1', 'yue_tu_heart_2', 'yue_tu_heart_3'],
    courtshipDialogues: [
      'Ay Tavşanı yeşim tokmağı alınca kulaklarının ucu kıpkırmızı olur. “Bu… bunu bana mı veriyorsun? Şey… aldım.”',
      '“{player}, yeni ot lokmaları yaptım; tadı çok güzel oldu, mutlaka dene!”',
      '“Seninle aya baktığım zaman göğü özlemiyorum artık.”'
    ],
    bondBonuses: [{ type: 'stamina_restore', amount: 15 }],
    abilities: [
      {
        id: 'yue_tu_1',
        affinityRequired: 500,
        name: 'Kutlu Toplayış',
        description: 'Şifalı ot toplama miktarı iki katına çıkar',
        passive: { type: 'quality_boost', value: 2 }
      },
      { id: 'yue_tu_2', affinityRequired: 1000, name: 'Şifa Katığı', description: 'Çay ve ilaçların etkisi +50%', passive: { type: 'exp_boost', value: 50 } },
      { id: 'yue_tu_3', affinityRequired: 1800, name: 'Ay Çiyi', description: 'Toplarken bazen ay otu bulunur', passive: { type: 'luck', value: 8 } }
    ],
    manifestationDay: { season: 'autumn', day: 14 }
  },

  // ============================================================
  // 4. Tilki Eren — Dokuz Kuyruklu Ruh Tilki
  // ============================================================
  {
    id: 'hu_xian',
    name: 'Tilki Eren',
    trueName: 'Adsız',
    gender: 'male',
    title: 'Dokuz Kuyruklu Ruh Tilki',
    origin:
      'Yüzyıllardır erginleşmiş bir ruh tilki. Ne bütünüyle ak ne tümüyle kara. Göz boyama ve kılık değiştirme işlerinde üstündür; insanların arasında türlü suretlerle dolaşır, nadide nesneler toplamayı sever.',
    personality: 'Kurnaz, nükteli, biraz da tekinsiz',
    discoverySteps: [
      {
        id: 'hu_xian_rumor',
        phase: 'rumor',
        conditions: [{ type: 'money', minAmount: 100000 }],
        scenes: [
          { text: 'Bu sabah kapının önünde imzasız bir mektup bulursun. Üzerinde yalnız tek cümle vardır:' },
          { text: '“Gün batımında insanların kalabalık olduğu yere git. Seni eğlenceli bir iş bekliyor.”' },
          { text: 'Kâğıdı çevirince arkasında alaycı gülümseyen bir tilki çizimi görürsün.' }
        ],
        logMessage: '【Kutlu İz】Kapına bırakılan gizemli mektubun arkasında bir tilki resmi vardı…'
      },
      {
        id: 'hu_xian_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'timeRange', minHour: 17, maxHour: 19 },
          { type: 'location', panel: 'npc' }
        ],
        scenes: [
          { text: 'Gün batımında köyde dolaşırken ortalık altın ışığa bürünür.' },
          { text: 'Kalabalığın içinde, yüzü fazla kusursuz görünen yabancı bir genç dikkatini çeker. Dudaklarında anlamlı bir tebessüm vardır.' },
          { text: 'Yaklaşmaya çalıştığında çoktan yok olmuştur. Sadece durduğu yerde parıldayan kızıl bir boncuk kalmıştır.' }
        ],
        logMessage: '【Kutlu İz】Akşam vakti köyde yabancı bir delikanlı belirdi ve gözden kayboldu.'
      },
      {
        id: 'hu_xian_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'ruby', quantity: 1 },
          { type: 'item', itemId: 'jade', quantity: 1 }
        ],
        scenes: [
          { text: 'Mücevherleri alıp köy çıkışına geldiğinde o genç bir anda arkanda belirir.' },
          { text: '“Demek beni buldun.” der ve parmak şıklatır. Ardında dokuz kabarık kuyruk görünür.' },
          {
            text: '“Şimdi bana üç soru cevaplayacaksın. İlkini bilebilirsen sana gerçek suretimi biraz daha gösteririm.” Üç parmağını kaldırır.\n“İlk soru: Paylaştıkça çoğalan şey nedir?”',
            choices: [
              { text: 'Sevinç.', friendshipChange: 80, response: '“Güzel. Demek içinde kıvılcım var.” Memnuniyetle başını sallar; kuyruklarından biri hafifçe parlar.' },
              { text: 'Altın?', friendshipChange: 20, response: '“Ne bayağı cevap.” der ama seni hemen kovmaz.' },
              { text: 'Dert.', friendshipChange: 40, response: '“Hımm… o da sayılır. Ama ben daha neşeli cevapları severim.”' }
            ]
          },
          { text: '“Fena değil.” Kuyruklarını geri çeker, yeniden sıradan bir delikanlı görünümüne bürünür. “Sandığımdan daha ilginç çıktın. Yine görüşürüz.”' }
        ],
        logMessage: '【Kutlu İz】Bilmece sınavından sonra Tilki Eren gerçek yüzünü gösterdi.'
      },
      {
        id: 'hu_xian_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'mineFloor', minFloor: 50 },
          { type: 'item', itemId: 'fox_bead', quantity: 1 }
        ],
        scenes: [
          { text: 'Madenin derinliklerinde bulduğun tilki boncuğunu getirince o genç bir ağaca yaslanmış seni bekler.' },
          { text: '“Benim boncuğumu bulmuşsun.” Nesneyi eline alır; boncuk avucunda kızıl ışıkla yanar.' },
          { text: '“Demek bağ kurulmuş. Ben ruh tilki soyundanım. Bana Tilki Eren demen yeter. Asıl adım mı? Onu duymak için beni daha çok tanıman gerekecek.”' }
        ],
        logMessage: '【Kutlu İz】Tilki boncuğunu geri verince Tilki Eren seninle görüşmeyi kabul etti.'
      }
    ],
    resonantOfferings: ['prismatic_shard', 'ruby', 'jade'],
    pleasedOfferings: ['obsidian', 'gold_ore', 'peach_wine', 'jujube_wine'],
    repelledOfferings: ['quartz', 'wood', 'bamboo'],
    dialogues: {
      wary: ['“Her fani öyle kolayca Tilki Eren’i göremez.”', '“Talihin yerinde ama hepsi bu.”'],
      curious: ['“Bugün ne ilginçlik yaptın, anlatsana.”', '“Şu dünyada en sıkıcı şey tekdüzeliktir; beni sakın sıkma.”'],
      trusting: ['“{player}, sen eğlenceli bir insansın.”', '“Bir hüner görmek ister misin?” Parmak ucunda küçük bir ruh alevi belirir.'],
      devoted: ['“Yüzyıllardır kimse için durup beklemedim. İlk kez sende takılı kaldım.”', '“{player}… bana yavru tilki olduğum günlerin saflığını anımsatıyorsun.”'],
      eternal: ['“Gerçek adımı yalnız senin kulağına söyledim.”', '“Dokuz kuyruğumun gölgesi yalnız seni korur.”']
    },
    interactionType: 'dreamwalk',
    bondable: true,
    courtshipItemId: 'fox_flame_lantern',
    bondItemId: 'fox_spirit_bead',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['hu_xian_heart_1', 'hu_xian_heart_2', 'hu_xian_heart_3'],
    courtshipDialogues: [
      'Tilki Eren ruh alevi fenerini alıp kaşlarını kaldırır, sonra gülümser. “Yani… bir tilkiye gönül mü sunuyorsun?”',
      '“{player}, bu gece seni gördüğüm bir düş gördüm. İçeriği mi? O sır bende kalsın.”',
      '“Eskiden insanların ömrünü fazla kısa bulurdum. Şimdi tam da bu yüzden kıymetli geldiklerini düşünüyorum.”'
    ],
    bondBonuses: [{ type: 'sell_bonus', percent: 15 }],
    abilities: [
      { id: 'hu_xian_1', affinityRequired: 700, name: 'Tilki Gözü', description: 'Dükkân fiyatları %5 düşer', passive: { type: 'sell_bonus', value: 5 } },
      { id: 'hu_xian_2', affinityRequired: 1400, name: 'Ruh Sezisi', description: 'Madende ek ganimet düşme ihtimali artar', passive: { type: 'luck', value: 15 } },
      { id: 'hu_xian_3', affinityRequired: 2100, name: 'Gizemli Tacirlik', description: 'Gezgin satıcıda 1 ek nadir eşya çıkar', passive: { type: 'luck', value: 10 } }
    ],
    manifestationDay: { season: 'autumn', day: 7 }
  },

  // ============================================================
  // 5. Dağ Dervişi — Şifacı Eren
  // ============================================================
  {
    id: 'shan_weng',
    name: 'Dağ Dervişi',
    trueName: 'Akıncı',
    gender: 'male',
    title: 'Şifacı Eren',
    origin:
      'gaKöy kurulurken buralara çekilip yıllarca dağlarda ot ve maden bilgisiyle yaşamış bir ermiş. İksirlerini bakır kaplarda kaynatır, çam rüzgârını dost bilir.',
    personality: 'Ağırbaşlı, dingin, ölçülü',
    discoverySteps: [
      {
        id: 'shan_weng_rumor',
        phase: 'rumor',
        conditions: [
          { type: 'mineFloor', minFloor: 50 },
          { type: 'skill', skillType: 'mining', minLevel: 8 }
        ],
        scenes: [
          { text: 'Madenin derininde sararmış yapraklı eski bir defter bulursun. Kapağında “Akıncı’nın Yol Notları” yazar.' },
          { text: 'İlk sayfayı açarsın: “Bu dağın bağrında nice cevher, nice sır saklıdır. Sessiz olan işitir.”' }
        ],
        logMessage: '【Kutlu İz】Madenin içinde çok eski bir yol defteri bulundu…'
      },
      {
        id: 'shan_weng_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'season', season: 'winter' },
          { type: 'weather', weather: 'sunny' },
          { type: 'location', panel: 'mining' }
        ],
        scenes: [
          { text: 'Kış günü madenin diplerinde yankılanan uzun bir ney sesi duyarsın; eski ve içli bir ezgidir.' },
          { text: 'Sesi takip ettiğinde ak sakallı bir ihtiyarı damar taşlarının yanında bağdaş kurmuş görürsün. Çevresinde altın renkli bir esinti dolaşır.' },
          { text: 'Bir adım atınca ayağının altındaki taş gıcırdar. İhtiyar gözlerini açar; yüzüne ağır bir kudret çarpar. Gözünü kırptığında ise ortada kimse kalmamıştır.' }
        ],
        logMessage: '【Kutlu İz】Madenin içinde ak sakallı bir ermiş göründü, sonra bir anda kayboldu.'
      },
      {
        id: 'shan_weng_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'item', itemId: 'ginseng', quantity: 1 },
          { type: 'item', itemId: 'snow_lotus', quantity: 1 }
        ],
        scenes: [
          { text: 'İnsan otu ve kar çiçeğiyle madenin derinliğine inersin. Ortamdaki hava alışıldık olandan daha yoğundur. İhtiyar, mağara duvarının önünde bakır bir ocak başında oturmaktadır.' },
          { text: '“Geldin.” der. Sesi ağır ama sakindir; sanki zaten yolunu bekliyordur.' },
          {
            text: '“Delikanlı, seni buralara getiren nedir?” Bir gözünü aralayıp sana bakar; donuk görünen gözlerinde beklenmedik bir canlılık çakar.',
            choices: [
              { text: 'Daha güçlü olmak için geldim.', friendshipChange: 60, response: '“Olur. Niyet sağlam ama hırsın seni yönetmesin.” diyerek başını sallar.' },
              { text: 'Bilmediğimi öğrenmek için geldim.', friendshipChange: 80, response: '“İşte doğru yol budur. Arayanın payı büyüktür.” Nadir bir onayla seni süzer.' },
              { text: 'Kazanç peşindeyim.', friendshipChange: 20, response: 'Bir süre susar. “En azından sözün eğri değil.” der, hafifçe başını sallar.' }
            ]
          },
          { text: '“Şimdi git. Hazır olduğunda yine gelirsin.” Gözlerini kapatır, çevresindeki esinti yeniden kıpırdanır.' }
        ],
        logMessage: '【Kutlu İz】Madenin derininde yaşayan bir dağ ereniyle karşılaştın.'
      },
      {
        id: 'shan_weng_revealed',
        phase: 'revealed',
        conditions: [
          { type: 'questComplete', questId: 'main_3_5' },
          { type: 'skill', skillType: 'mining', minLevel: 8 }
        ],
        scenes: [
          { text: 'Madenin derinliğine döndüğünde erenin çay demlediğini görürsün. Bir çaydanlık, iki tas vardır.' },
          { text: '“Otur.” diyerek karşısındaki taşa işaret eder. Bu, seni ilk kez davet edişidir.' },
          { text: '“Bana Akıncı derler. Nice yılı bu dağın içinde geçirdim. Madem gönül bağı doğdu, ara sıra gelip oturmanda sakınca yok.” Dudaklarının kenarı hafifçe kıvrılır.' }
        ],
        logMessage: '【Kutlu İz】Dağ Dervişi Akıncı seni çayına ortak etti.'
      }
    ],
    resonantOfferings: ['ginseng', 'snow_lotus', 'antler_velvet'],
    pleasedOfferings: ['herb', 'iron_ore', 'gold_ore', 'copper_ore', 'tea'],
    repelledOfferings: ['trash', 'wood', 'driftwood'],
    dialogues: {
      wary: ['“Yalnızlık arayanın sessizliğini bozma.”', '“Üzerinde çok fazla telaş var; biraz durul da öyle gel.”'],
      curious: ['“Bugün dağın soluğu başka esiyor.”', '“Bedenin sıradan bir köylüden biraz daha dayanıklı.”'],
      trusting: ['“{player}, gel de şu taş oyuna bir el atalım.”', '“Yolun başında acele eden çok olur. Sen bugün düne göre daha sakinsin.”'],
      devoted: ['“Bu kadar yıl sonra ilk kez birine bildiklerimi bırakmak istedim.”', '“{player}, sende yalnız insanlara has olmayan bir direnç var.”'],
      eternal: ['“Benim yürüdüğüm yol artık senin de yolun.”', '“Ömrümde kimseyi çırak seçmedim; ama sen bunun dışındasın.”']
    },
    interactionType: 'cultivation',
    bondable: true,
    courtshipItemId: 'cultivation_jade',
    bondItemId: 'immortal_gourd',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['shan_weng_heart_1', 'shan_weng_heart_2', 'shan_weng_heart_3'],
    courtshipDialogues: [
      'Dağ Dervişi yeşim muskayı alır, bir süre hiç konuşmaz. “...Bu gönül armağanını kabul ediyorum.”',
      '“{player}, bugün çalışman yerindeydi. Gel, bir tas sıcak çay iç.”',
      '“Bilirsin, ben de bir zamanlar gençtim. O günler… neyse, başka vakit.”'
    ],
    bondBonuses: [{ type: 'spirit_shield', staminaSave: 20, hpBonus: 30 }],
    abilities: [
      {
        id: 'shan_weng_1',
        affinityRequired: 600,
        name: 'Nefes Birikimi',
        description: 'Madende harcanan dayanıklılık -15%',
        passive: { type: 'stamina_save', value: 15 }
      },
      {
        id: 'shan_weng_2',
        affinityRequired: 1200,
        name: 'Cevher Yolu',
        description: 'Madende nadir ot bulma ihtimali artar',
        passive: { type: 'luck', value: 12 }
      },
      {
        id: 'shan_weng_3',
        affinityRequired: 2000,
        name: 'İç Kuvvet',
        description: 'Maksimum dayanıklılık kalıcı olarak +20',
        passive: { type: 'max_stamina', value: 20 }
      }
    ],
    manifestationDay: { season: 'winter', day: 1 }
  },

  // ============================================================
  // 6. Düş Dokuyucu — Ay İpliği Ruh
  // ============================================================
  {
    id: 'gui_nv',
    name: 'Düş Dokuyucu',
    trueName: 'Yurdagül',
    gender: 'female',
    title: 'Ay İpliği Ruh',
    origin:
      'Bir zamanlar yurduna dönmeyi bekleyen usta bir dokumacının hasretinden doğmuş ruh. Yaşarken ördüğü kumaşlar dillere destandı; öldükten sonra bile ay ışığı ve ince ipliklerle dokumayı sürdürür.',
    personality: 'Yumuşak huylu, kederli ve derin',
    discoverySteps: [
      {
        id: 'gui_nv_rumor',
        phase: 'rumor',
        conditions: [{ type: 'npcFriendship', npcId: 'su_su', minFriendship: 2000 }],
        scenes: [
          { text: 'Suna bugün biraz tedirgindir. “{player}, geceleri hiç dokuma tezgâhı sesi duydun mu?” diye sorar. 0' },
          { text: '“Benim evin yanındaki eski odadan ay ışıklı gecelerde tak tuk ses geliyor… sanki biri kumaş dokuyor.” 1' },
          { text: '“Gidip baktım, içeride kimse yoktu. Ama o ses… gerçekti.” Suna’nın gözlerinde açık bir tedirginlik vardır. 2' }
        ],
        logMessage: '【Kutlu İz】Suna, geceleri boş odadan dokuma sesi geldiğini söyledi…'
      },
      {
        id: 'gui_nv_glimpse',
        phase: 'glimpse',
        conditions: [
          { type: 'timeRange', minHour: 22, maxHour: 24 },
          { type: 'item', itemId: 'silk', quantity: 1 },
          { type: 'location', panel: 'npc' }
        ],
        scenes: [
          { text: 'Köy gecenin sessizliğine gömülmüşken eski odanın önünden geçersin. İçeriden gerçekten de o ses gelir: tak… tuk… tak…' },
          { text: 'Pencereden baktığında ay ışığı altında duran yaşlı tezgâhın kendi kendine çalıştığını görürsün. Gümüş renkli ipler havada süzülmektedir.' },
          { text: 'Tezgâhın başında silik bir kadın oturur. Gözyaşları ince tel tel ipliğe dönüşerek dokumaya karışır.' },
          { text: 'Elindeki ipek hafifçe parıldar ve tezgâhtaki ışıklı tellerle uyumlanır. Kadın sana doğru döner ama bir anda duman gibi çözülür.' }
        ],
        logMessage: '【Kutlu İz】Eski odada ay ışığında kumaş dokuyan bir ruh silueti gördün…'
      },
      {
        id: 'gui_nv_encounter',
        phase: 'encounter',
        conditions: [
          { type: 'season', season: 'winter' },
          { type: 'item', itemId: 'silk', quantity: 3 },
          { type: 'item', itemId: 'moonstone', quantity: 1 }
        ],
        scenes: [
          { text: 'Kış gecesi ipekleri ve aytaşını alıp eski odaya girersin. Tezgâhın önü boştur; eşyaları üstüne bıraktığında aytaşından gümüş ışık yükselir.' },
          { text: 'İpler kendiliğinden sarılıp çözgüye dizilir. Tezgâh hareket etmeye başlar ve ışığın içinden bir kadın sureti belirir.' },
          {
            text: 'Yüzü ince, bakışı hüzünlü bir kadın önünde oturur. Göz izleri hâlâ silinmemiştir. Sana bakıp fısıldar: “Beni… görebiliyor musun?”',
            choices: [
              { text: 'Evet, seni görüyorum. Ağlıyor musun?', friendshipChange: 80, response: 'Bir an şaşırır, göz kenarını siler. “Çok uzun zamandır… kimse benimle konuşmamıştı.”' },
              {
                text: 'Kimsin? Neden burada dokuyorsun?',
                friendshipChange: 60,
                response: '“Eve götüren yolu dokumaya çalışıyorum.” der hafifçe. “Ama artık evimin neresi olduğunu bile anımsamıyorum.”'
              },
              {
                text: 'Suna senin için kaygılanıyor.',
                friendshipChange: 40,
                response: '“Şu terzi kız mı?” Dudaklarında zayıf bir gülümseme belirir. “Eli çok yatkın. Benim gençliğimi anımsatıyor.”'
              }
            ]
          },
          { text: 'Tan yeri ağarmadan bedeni yeniden silikleşir. “İstersen… yarın yine gel. Biraz birlikte dokuruz.”' }
        ],
        logMessage: '【Kutlu İz】Eski odadaki düş dokuyan ruh sonunda seninle konuştu.'
      },
      {
        id: 'gui_nv_revealed',
        phase: 'revealed',
        conditions: [{ type: 'npcFriendship', npcId: 'su_su', minFriendship: 2000 }],
        scenes: [
          { text: 'Geceler boyunca eski odaya gidip onun yanında kalırsın. Bu kez silueti eskisinden daha nettir.' },
          { text: '“Senin gelişin bana unutulan şeyleri hatırlattı.” Tezgâhı bırakıp ilk kez yanına yaklaşır.' },
          { text: '“Benim adım Yurdagül. Yurdun gülü… belki de artık aradığım yurt burasıdır.”' }
        ],
        logMessage: '【Kutlu İz】Yurdagül artık kayıp yolunu değil, burada kalmayı seçti.'
      }
    ],
    resonantOfferings: ['silk', 'wool', 'moonstone'],
    pleasedOfferings: ['alpaca_wool', 'rabbit_foot', 'cloth'],
    repelledOfferings: ['quartz', 'charcoal', 'copper_ore'],
    dialogues: {
      wary: ['“…” Başını eğip dokumaya devam eder.', '“Benden… korkmuyor musun?”'],
      curious: ['“Bu gece ay çok güzel vuruyor.” Dokuması biraz yavaşlar.', '“Geldin… otur.”'],
      trusting: ['“{player}, bak… yeni bir desen denedim. Güzel olmuş mu?”', '“Seninle konuşurken artık kendimi ölü saymıyorum.”'],
      devoted: ['“{player}… izin verirsen sana hiç eskimeyecek bir giysi dokumak isterim.”', '“Bana gösterdin ki hasret bile güzelliğe dönüşebiliyormuş.”'],
      eternal: ['“Yurdagül’ün ipleri yalnız senin için örülür.”', '“Eve giden yol aramıyorum artık. Sen neredeysen orası yurdum.”']
    },
    interactionType: 'dreamwalk',
    bondable: true,
    courtshipItemId: 'silver_thread_ring',
    bondItemId: 'starlight_loom',
    courtshipThreshold: 1800,
    bondThreshold: 2500,
    heartEventIds: ['gui_nv_heart_1', 'gui_nv_heart_2', 'gui_nv_heart_3'],
    courtshipDialogues: [
      'Düş Dokuyucu gümüş ip yüzüğü titreyen parmaklarla alır. “Bu… benim için mi? Yaşayan biri benimle de gönül bağı kurmak ister mi…” Sözünü tamamlayamaz.',
      '“{player}, bu gece düşünde sana yıldızlı bir örtü dokudum. Gördün mü?”',
      '“Bazen düşünüyorum da… belki de seninle karşılaştığım için dağılmadan kaldım.”'
    ],
    bondBonuses: [{ type: 'animal_blessing', chance: 0.25 }],
    abilities: [
      { id: 'gui_nv_1', affinityRequired: 500, name: 'Hızlı Tezgâh', description: 'Kumaş işleme süresi -30%', passive: { type: 'exp_boost', value: 30 } },
      { id: 'gui_nv_2', affinityRequired: 1100, name: 'Düş İpliği', description: 'Tezgâhta bazen düş ipliği üretilir', passive: { type: 'luck', value: 8 } },
      { id: 'gui_nv_3', affinityRequired: 1900, name: 'Yumuşak El', description: 'Hayvan dostluğu kazanımı +25%', passive: { type: 'exp_boost', value: 25 } }
    ],
    manifestationDay: { season: 'winter', day: 21 }
  }
]

/** ID’ye göre gizli NPC tanımını getir */
export const getHiddenNpcById = (id: string): HiddenNpcDef | undefined => HIDDEN_NPCS.find(n => n.id === id)
