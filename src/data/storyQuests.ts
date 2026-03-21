import type { MainQuestDef } from '@/types'

/** Bölüm başlıkları */
export const CHAPTER_TITLES: Record<number, string> = {
  1: 'gaKöy’e İlk Adım',
  2: 'Toprağa Kök Salmak',
  3: 'Dört Yana Ün Salmak',
  4: 'Yazgıların Kesişmesi',
  5: 'gaKöy’ün Beği'
}

/** 50 ana görev tanımı, 5 bölüm ve her bölümde 10 görev */
export const STORY_QUESTS: MainQuestDef[] = [
  // ============================================================
  // 1. Bölüm「gaKöy’e İlk Adım」— Başlangıç rehberi
  // ============================================================
  {
    id: 'main_1_1',
    chapter: 1,
    order: 1,
    title: 'Yeni Başlangıç',
    description: 'Muhtar Mehmet der ki: gaKöy’de tutunmak isteyen evvela toprağı işler. Haydi, 5 kez mahsul topla.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'harvestCrops', label: 'Toplam 5 kez mahsul topla', target: 5 }],
    moneyReward: 300,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 20 }]
  },
  {
    id: 'main_1_2',
    chapter: 1,
    order: 2,
    title: 'Yakın Komşu Uzak Hısımdan Yeğdir',
    description: 'Hasan Enişte köyün Her Şey Dükkânı’nı işletir. Onunla biraz ahbaplık kur.',
    npcId: 'chen_bo',
    objectives: [{ type: 'npcFriendship', label: 'Hasan Enişte ile tanış ol', npcId: 'chen_bo', friendshipLevel: 'acquaintance' }],
    moneyReward: 200,
    friendshipReward: [{ npcId: 'chen_bo', amount: 20 }]
  },
  {
    id: 'main_1_3',
    chapter: 1,
    order: 3,
    title: 'Dere Kıyısında Olta',
    description: 'Aylin köyün en usta oltacısıdır. Seni dere kıyısına çağırıyor; hünerini göster.',
    npcId: 'qiu_yue',
    objectives: [{ type: 'catchFish', label: 'Toplam 5 balık yakala', target: 5 }],
    moneyReward: 300,
    itemReward: [{ itemId: 'standard_bait', quantity: 10 }],
    friendshipReward: [{ npcId: 'qiu_yue', amount: 20 }]
  },
  {
    id: 'main_1_4',
    chapter: 1,
    order: 4,
    title: 'Madene İlk İniş',
    description: 'İsmail der ki: Maden ocağında nimet de var, tehlike de. Hele bir 5. kata kadar in.',
    npcId: 'a_shi',
    objectives: [{ type: 'reachMineFloor', label: 'Maden ocağında 5. kata ulaş', target: 5 }],
    moneyReward: 500,
    friendshipReward: [{ npcId: 'a_shi', amount: 20 }]
  },
  {
    id: 'main_1_5',
    chapter: 1,
    order: 5,
    title: 'Köy Lezzeti',
    description: 'Fatma Teyze der ki: Toprak işi yorucudur, insan kendini güzel bir yemekle ödüllendirmelidir. 3 yemek pişir.',
    npcId: 'wang_dashen',
    objectives: [{ type: 'cookRecipes', label: 'Toplam 3 yemek pişir', target: 3 }],
    moneyReward: 300,
    friendshipReward: [{ npcId: 'wang_dashen', amount: 20 }]
  },
  {
    id: 'main_1_6',
    chapter: 1,
    order: 6,
    title: 'Hayırlı Bağlar Kurmak',
    description: 'Muhtar Mehmet ister ki köylüyü tanıyıp onların işlerine de omuz veresin.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'completeQuests', label: 'Toplam 3 iş tamamla', target: 3 }],
    moneyReward: 500,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 20 }]
  },
  {
    id: 'main_1_7',
    chapter: 1,
    order: 7,
    title: "Marangozun Sınaması",
    description: 'Mıstık der ki ustası Mustafa Usta’nın bir yığın keresteye ihtiyacı var. 30 odun ulaştır.',
    npcId: 'xiao_man',
    objectives: [{ type: 'deliverItem', label: 'Odun ×30 teslim et', itemId: 'wood', itemQuantity: 30 }],
    moneyReward: 500,
    itemReward: [{ itemId: 'basic_fertilizer', quantity: 5 }],
    friendshipReward: [{ npcId: 'xiao_man', amount: 30 }]
  },
  {
    id: 'main_1_8',
    chapter: 1,
    order: 8,
    title: "Hekim Dede'nin Tembihi",
    description: 'Hekim Dede bir ilaç hazırlayacak, ona biraz şifalı ot gerek. 10 ot topla.',
    npcId: 'lin_lao',
    objectives: [{ type: 'deliverItem', label: 'Şifalı ot ×10 teslim et', itemId: 'herb', itemQuantity: 10 }],
    moneyReward: 500,
    friendshipReward: [{ npcId: 'lin_lao', amount: 30 }]
  },
  {
    id: 'main_1_9',
    chapter: 1,
    order: 9,
    title: 'İlk Parıltı',
    description: 'Muhtar Mehmet yaptıklarından memnundur. Gayrete devam et, keseni biraz daha doldur.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'earnMoney', label: 'Toplam 5000 akçe kazan', target: 5000 }],
    moneyReward: 800,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 20 }]
  },
  {
    id: 'main_1_10',
    chapter: 1,
    order: 10,
    title: 'gaKöy’de Kök Salmak',
    description: 'gaKöy’de gerçekten yer edinmek istiyorsan çiftçilikte eli sağlam olmalı. Çiftçilik becerisini 3. düzeye çıkar.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'skillLevel', label: 'Çiftçilik becerisi 3. düzeye ulaşsın', skillType: 'farming', target: 3 }],
    moneyReward: 1000,
    itemReward: [{ itemId: 'quality_fertilizer', quantity: 5 }],
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },

  // ============================================================
  // 2. Bölüm「Toprağa Kök Salmak」— Orta oyunun başları
  // ============================================================
  {
    id: 'main_2_1',
    chapter: 2,
    order: 1,
    title: 'Bereket Yolu',
    description: 'Elif der ki tarlan artık iyiden iyiye kendini göstermeye başladı. Daha çok mahsul topla.',
    npcId: 'liu_niang',
    objectives: [{ type: 'harvestCrops', label: 'Toplam 50 kez mahsul topla', target: 50 }],
    moneyReward: 800,
    friendshipReward: [{ npcId: 'liu_niang', amount: 20 }]
  },
  {
    id: 'main_2_2',
    chapter: 2,
    order: 2,
    title: 'Madenin Derinleri',
    description: 'İsmail der ki 20. katın altında demir damarları başlar. Biraz daha derine in.',
    npcId: 'a_shi',
    objectives: [{ type: 'reachMineFloor', label: 'Maden ocağında 20. kata ulaş', target: 20 }],
    moneyReward: 1000,
    itemReward: [{ itemId: 'iron_ore', quantity: 10 }],
    friendshipReward: [{ npcId: 'a_shi', amount: 20 }]
  },
  {
    id: 'main_2_3',
    chapter: 2,
    order: 3,
    title: 'Oltacının Yolu',
    description: 'Balıkçı Dede der ki balıkçılık gönül dinginliği ister. Biraz daha balık tutup işin sırrına er.',
    npcId: 'li_yu',
    objectives: [{ type: 'catchFish', label: 'Toplam 30 balık yakala', target: 30 }],
    moneyReward: 800,
    friendshipReward: [{ npcId: 'li_yu', amount: 20 }]
  },
  {
    id: 'main_2_4',
    chapter: 2,
    order: 4,
    title: 'Köy Bağının Filizlenişi',
    description: 'Muhtar Mehmet der ki köyün mabedinde bir görev levhası vardır. Rehberdeki “Mabet” kısmına bak, bir görevi tamamlayıp köye katkı sun.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'completeBundles', label: 'Mabet görevlerinden 1 tanesini tamamla', target: 1 }],
    moneyReward: 1000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_2_5',
    chapter: 2,
    order: 5,
    title: 'Demircinin Dostluğu',
    description: 'Ali Usta yeni tarım araçları dövecek, biraz demir cevherine ihtiyacı var. Ona 15 demir cevheri götür.',
    npcId: 'sun_tiejiang',
    objectives: [
      { type: 'npcFriendship', label: 'Ali Usta ile tanış ol', npcId: 'sun_tiejiang', friendshipLevel: 'acquaintance' },
      { type: 'deliverItem', label: 'Demir cevheri ×15 teslim et', itemId: 'iron_ore', itemQuantity: 15 }
    ],
    moneyReward: 1000,
    friendshipReward: [{ npcId: 'sun_tiejiang', amount: 30 }]
  },
  {
    id: 'main_2_6',
    chapter: 2,
    order: 6,
    title: 'Çiftlik Düşü',
    description: 'İbo der ki hayvan yetiştirmek gönül açan bir iştir. 3 baş hayvan edin.',
    npcId: 'da_niu',
    objectives: [{ type: 'ownAnimals', label: '3 baş hayvana sahip ol', target: 3 }],
    moneyReward: 1000,
    friendshipReward: [{ npcId: 'da_niu', amount: 30 }]
  },
  {
    id: 'main_2_7',
    chapter: 2,
    order: 7,
    title: 'Aşçılıkta İlerlemek',
    description: 'Fatma Teyze elinin tadını öve öve bitiremez. Daha çok yemek öğren.',
    npcId: 'wang_dashen',
    objectives: [{ type: 'cookRecipes', label: 'Toplam 15 yemek pişir', target: 15 }],
    moneyReward: 800,
    friendshipReward: [{ npcId: 'wang_dashen', amount: 20 }]
  },
  {
    id: 'main_2_8',
    chapter: 2,
    order: 8,
    title: 'Köylünün İşi',
    description: 'Muhtar Mehmet der ki köylünün işine epey yarar dokundu. Bunu sürdür.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'completeQuests', label: 'Toplam 10 iş tamamla', target: 10 }],
    moneyReward: 1000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 20 }]
  },
  {
    id: 'main_2_9',
    chapter: 2,
    order: 9,
    title: 'Dört Mevsimin Nimeti',
    description: 'Hasan Enişte der ki gaKöy’ün nimeti boldur. Daha çok farklı eşya keşfet.',
    npcId: 'chen_bo',
    objectives: [{ type: 'discoverItems', label: '30 farklı eşya keşfet', target: 30 }],
    moneyReward: 1200,
    friendshipReward: [{ npcId: 'chen_bo', amount: 20 }]
  },
  {
    id: 'main_2_10',
    chapter: 2,
    order: 10,
    title: 'Küçük Bir Şöhret',
    description: 'Artık gaKöy’de adın anılır oldu. Servetini artır, kudretini göster.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'earnMoney', label: 'Toplam 15000 akçe kazan', target: 15000 }],
    moneyReward: 1500,
    itemReward: [{ itemId: 'seed_peach', quantity: 3 }],
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },

  // ============================================================
  // 3. Bölüm「Dört Yana Ün Salmak」— Orta dönem
  // ============================================================
  {
    id: 'main_3_1',
    chapter: 3,
    order: 1,
    title: 'Derinlik Meydan Okuması',
    description: 'İsmail der ki 40. katın altında altın damarları vardır, ama yaratıklar da azgınlaşır.',
    npcId: 'a_shi',
    objectives: [{ type: 'reachMineFloor', label: 'Maden ocağında 40. kata ulaş', target: 40 }],
    moneyReward: 1500,
    itemReward: [{ itemId: 'gold_ore', quantity: 10 }],
    friendshipReward: [{ npcId: 'a_shi', amount: 20 }]
  },
  {
    id: 'main_3_2',
    chapter: 3,
    order: 2,
    title: 'Her İşe Koşan',
    description: 'Muhtar Mehmet der ki artık köyün aranan kişisi oldun. Ahaliye yardım etmeyi sürdür.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'completeQuests', label: 'Toplam 25 iş tamamla', target: 25 }],
    moneyReward: 1500,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 20 }]
  },
  {
    id: 'main_3_3',
    chapter: 3,
    order: 3,
    title: 'Varlık Bileni',
    description: 'Hoca Efendi senin bilgine şaşar; gaKöy’ün daha nice nimetini keşfetmeni ister.',
    npcId: 'zhou_xiucai',
    objectives: [{ type: 'discoverItems', label: '50 farklı eşya keşfet', target: 50 }],
    moneyReward: 1500,
    friendshipReward: [{ npcId: 'zhou_xiucai', amount: 20 }]
  },
  {
    id: 'main_3_4',
    chapter: 3,
    order: 4,
    title: 'Lezzet Ehli',
    description: 'Hatice Abla der ki aşçılığın iyice ilerledi, durmak yok.',
    npcId: 'pang_shen',
    objectives: [{ type: 'cookRecipes', label: 'Toplam 30 yemek pişir', target: 30 }],
    moneyReward: 1200,
    friendshipReward: [{ npcId: 'pang_shen', amount: 20 }]
  },
  {
    id: 'main_3_5',
    chapter: 3,
    order: 5,
    title: 'Yüzü Tanınan',
    description: 'Muhtar Mehmet ister ki köyde tanımadığın kimse kalmasın.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'npcAllFriendly', label: 'Bütün köylülerle tanış ol', friendshipLevel: 'acquaintance' }],
    moneyReward: 2000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_3_6',
    chapter: 3,
    order: 6,
    title: 'Ağılın Büyümesi',
    description: 'İbo çiftliğine imrenir; hayvan sayını 8 başa çıkar.',
    npcId: 'da_niu',
    objectives: [{ type: 'ownAnimals', label: '8 baş hayvana sahip ol', target: 8 }],
    moneyReward: 1500,
    friendshipReward: [{ npcId: 'da_niu', amount: 20 }]
  },
  {
    id: 'main_3_7',
    chapter: 3,
    order: 7,
    title: 'Balıkçının Yükselişi',
    description: 'Aylin der ki oltacılığın artık iyice yol aldı. Daha da ustalaş.',
    npcId: 'qiu_yue',
    objectives: [{ type: 'catchFish', label: 'Toplam 80 balık yakala', target: 80 }],
    moneyReward: 1500,
    friendshipReward: [{ npcId: 'qiu_yue', amount: 20 }]
  },
  {
    id: 'main_3_8',
    chapter: 3,
    order: 8,
    title: 'Sevk Ustası',
    description: 'Kahveci Bekir mallarının çeşitlenmesine hayrandır. Ticaret yolunu genişlet.',
    npcId: 'he_zhanggui',
    objectives: [{ type: 'shipItems', label: '15 farklı eşya sevk et', target: 15 }],
    moneyReward: 2000,
    friendshipReward: [{ npcId: 'he_zhanggui', amount: 20 }]
  },
  {
    id: 'main_3_9',
    chapter: 3,
    order: 9,
    title: 'Hüner Sahibi',
    description: 'Hekim Dede der ki insanın elinde en az bir büyük hüner olmalı. Herhangi bir beceriyi 7. düzeye çıkar.',
    npcId: 'lin_lao',
    objectives: [{ type: 'skillLevel', label: 'Herhangi bir beceri 7. düzeye ulaşsın', target: 7 }],
    moneyReward: 2000,
    friendshipReward: [{ npcId: 'lin_lao', amount: 20 }]
  },
  {
    id: 'main_3_10',
    chapter: 3,
    order: 10,
    title: 'Namın Yayıldı',
    description: 'Ünün komşu köylere dek yayıldı. Servetini büyüt, gaKöy’ün gururu ol.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'earnMoney', label: 'Toplam 40000 akçe kazan', target: 40000 }],
    moneyReward: 2500,
    itemReward: [{ itemId: 'jade', quantity: 2 }],
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },

  // ============================================================
  // 4. Bölüm「Yazgıların Kesişmesi」— Orta oyunun sonları
  // ============================================================
  {
    id: 'main_4_1',
    chapter: 4,
    order: 1,
    title: 'Derinliğin Fatihi',
    description: 'İsmail der ki madenin derininde kudretli bir baş düşman saklanır. 80. kata var.',
    npcId: 'a_shi',
    objectives: [{ type: 'reachMineFloor', label: 'Maden ocağında 80. kata ulaş', target: 80 }],
    moneyReward: 3000,
    itemReward: [{ itemId: 'gold_ore', quantity: 15 }],
    friendshipReward: [{ npcId: 'a_shi', amount: 20 }]
  },
  {
    id: 'main_4_2',
    chapter: 4,
    order: 2,
    title: 'Canavar Kıran',
    description: 'Baran der ki dağlarda yaratıklar çoğaldı; birilerinin el atması gerekir.',
    npcId: 'yun_fei',
    objectives: [{ type: 'killMonsters', label: 'Toplam 150 yaratık öldür', target: 150 }],
    moneyReward: 2500,
    friendshipReward: [{ npcId: 'yun_fei', amount: 30 }]
  },
  {
    id: 'main_4_3',
    chapter: 4,
    order: 3,
    title: 'Köy Huzura Ersin',
    description: 'Muhtar Mehmet, mabette daha çok görevi tamamlamanı ister. Rehberdeki “Mabet”e gidip gereken eşyaları sun.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'completeBundles', label: '4 mabet görevini tamamla', target: 4 }],
    moneyReward: 3000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_4_4',
    chapter: 4,
    order: 4,
    title: 'Bir Ömür Bir Yastık',
    description: 'Muhtar Mehmet gülümser: Artık yuva kurmanın vakti gelmedi mi?',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'married', label: 'Gönlündeki kişiyle evlen' }],
    moneyReward: 2000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_4_5',
    chapter: 4,
    order: 5,
    title: 'Usta Aşçı Yolu',
    description: 'Fatma Teyze der ki elinin tadı onu geçmiş. Daha çok yemek dene.',
    npcId: 'wang_dashen',
    objectives: [{ type: 'cookRecipes', label: 'Toplam 50 yemek pişir', target: 50 }],
    moneyReward: 2500,
    friendshipReward: [{ npcId: 'wang_dashen', amount: 20 }]
  },
  {
    id: 'main_4_6',
    chapter: 4,
    order: 6,
    title: 'Her Şeyi Bilen',
    description: 'Hoca Efendi der ki görgün pek çok kişiyi aştı. Araştırmayı sürdür.',
    npcId: 'zhou_xiucai',
    objectives: [{ type: 'discoverItems', label: '80 farklı eşya keşfet', target: 80 }],
    moneyReward: 3000,
    friendshipReward: [{ npcId: 'zhou_xiucai', amount: 20 }]
  },
  {
    id: 'main_4_7',
    chapter: 4,
    order: 7,
    title: 'Ticaret Beği',
    description: 'Kahveci Bekir sevk ettiğin malların büyüklüğüne şaşmıştır. Daha çok çeşit gönder.',
    npcId: 'he_zhanggui',
    objectives: [{ type: 'shipItems', label: '30 farklı eşya sevk et', target: 30 }],
    moneyReward: 3000,
    friendshipReward: [{ npcId: 'he_zhanggui', amount: 20 }]
  },
  {
    id: 'main_4_8',
    chapter: 4,
    order: 8,
    title: 'Can Yoldaşı',
    description: 'İnsan ömründe bir hakiki dost yeter. Bir köylüyle can yoldaşı ol.',
    npcId: 'lin_lao',
    objectives: [{ type: 'npcFriendship', label: 'Herhangi bir köylüyle en yakın dost ol', npcId: '_any', friendshipLevel: 'bestFriend' }],
    moneyReward: 2500,
    friendshipReward: [{ npcId: 'lin_lao', amount: 20 }]
  },
  {
    id: 'main_4_9',
    chapter: 4,
    order: 9,
    title: 'Hasat Beği',
    description: 'Elif der ki senin tarlan gaKöy’ün en bereketlisi oldu. Böyle sürdür.',
    npcId: 'liu_niang',
    objectives: [{ type: 'harvestCrops', label: 'Toplam 300 kez mahsul topla', target: 300 }],
    moneyReward: 3000,
    friendshipReward: [{ npcId: 'liu_niang', amount: 20 }]
  },
  {
    id: 'main_4_10',
    chapter: 4,
    order: 10,
    title: 'Bir Diyarın Zengini',
    description: 'Servetin artık dilden dile gezer. Muhtar Mehmet der ki sen gaKöy’ün yüz akısın.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'earnMoney', label: 'Toplam 100000 akçe kazan', target: 100000 }],
    moneyReward: 5000,
    itemReward: [{ itemId: 'prismatic_shard', quantity: 1 }],
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },

  // ============================================================
  // 5. Bölüm「gaKöy’ün Beği」— Son dönem / bitiş
  // ============================================================
  {
    id: 'main_5_1',
    chapter: 5,
    order: 1,
    title: 'Madenin Dibinde',
    description: 'İsmail der ki en dipte kadim bir sır uyur. 120. kata inip hakikati ortaya çıkar.',
    npcId: 'a_shi',
    objectives: [{ type: 'reachMineFloor', label: 'Maden ocağında 120. kata ulaş', target: 120 }],
    moneyReward: 5000,
    friendshipReward: [{ npcId: 'a_shi', amount: 30 }]
  },
  {
    id: 'main_5_2',
    chapter: 5,
    order: 2,
    title: 'İskelet Uçurumu',
    description: 'İsmail der ki madenin sonu İskelet Ocağı’na açılır; orada daha kıymetli cevherler vardır.',
    npcId: 'a_shi',
    objectives: [{ type: 'reachSkullFloor', label: 'İskelet Ocağı’nda 50. kata ulaş', target: 50 }],
    moneyReward: 5000,
    itemReward: [{ itemId: 'iridium_ore', quantity: 5 }],
    friendshipReward: [{ npcId: 'a_shi', amount: 30 }]
  },
  {
    id: 'main_5_3',
    chapter: 5,
    order: 3,
    title: 'Bütün Uğursuzlara Karşı',
    description: 'Baran der ki artık gaKöy’ün en kudretli savaşçısı sensin, ama yaratıkların sonu kesilmiyor.',
    npcId: 'yun_fei',
    objectives: [{ type: 'killMonsters', label: 'Toplam 500 yaratık öldür', target: 500 }],
    moneyReward: 5000,
    friendshipReward: [{ npcId: 'yun_fei', amount: 30 }]
  },
  {
    id: 'main_5_4',
    chapter: 5,
    order: 4,
    title: 'Her Hünerde Usta',
    description: 'Hekim Dede der ki gerçek usta her işte söz sahibidir. Bütün becerileri 8. düzeye çıkar.',
    npcId: 'lin_lao',
    objectives: [{ type: 'allSkillsLevel', label: 'Bütün beceriler 8. düzeye ulaşsın', target: 8 }],
    moneyReward: 5000,
    friendshipReward: [{ npcId: 'lin_lao', amount: 30 }]
  },
  {
    id: 'main_5_5',
    chapter: 5,
    order: 5,
    title: 'Saray Sofrası',
    description: 'Fatma Teyze der ki aşçılığın kemale erdi. Yüz türlü yemeğe doğru yürü.',
    npcId: 'wang_dashen',
    objectives: [{ type: 'cookRecipes', label: 'Toplam 80 yemek pişir', target: 80 }],
    moneyReward: 3000,
    friendshipReward: [{ npcId: 'wang_dashen', amount: 30 }]
  },
  {
    id: 'main_5_6',
    chapter: 5,
    order: 6,
    title: 'Soyun Devamı',
    description: 'Muhtar Mehmet güler: Yuva kurduysan bir evlat da yakışır.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'hasChild', label: 'İlk çocuğunu kucağına al' }],
    moneyReward: 3000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_5_7',
    chapter: 5,
    order: 7,
    title: 'gaKöy’ün Dostu',
    description: 'Muhtar Mehmet ister ki köydeki herkesle gönül bağı kurasın.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'npcAllFriendly', label: 'Bütün köylülerle sıcak dost ol', friendshipLevel: 'friendly' }],
    moneyReward: 5000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_5_8',
    chapter: 5,
    order: 8,
    title: 'Sevk Defterinin Tamamı',
    description: 'Kahveci Bekir ister ki gaKöy’ün her nimeti en az bir kez senin elinden sevk edilmiş olsun.',
    npcId: 'he_zhanggui',
    objectives: [{ type: 'shipItems', label: '50 farklı eşya sevk et', target: 50 }],
    moneyReward: 5000,
    friendshipReward: [{ npcId: 'he_zhanggui', amount: 30 }]
  },
  {
    id: 'main_5_9',
    chapter: 5,
    order: 9,
    title: 'Mabedin Tamamı',
    description: 'Muhtar Mehmet der ki mabet levhasındaki bütün işler artık sana bakıyor. Rehberdeki “Mabet”e gidip kalanları tamamla.',
    npcId: 'liu_cunzhang',
    objectives: [{ type: 'completeBundles', label: 'Bütün 6 mabet görevini tamamla', target: 6 }],
    moneyReward: 8000,
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 30 }]
  },
  {
    id: 'main_5_10',
    chapter: 5,
    order: 10,
    title: 'gaKöy’ün Beği',
    description: 'Artık gerçekten gaKöy’ün sahibisin. Bütün beceriler dorukta, servetin dillere destan. İşte son meydan okuma.',
    npcId: 'liu_cunzhang',
    objectives: [
      { type: 'earnMoney', label: 'Toplam 300000 akçe kazan', target: 300000 },
      { type: 'allSkillsLevel', label: 'Bütün beceriler 10. düzeye ulaşsın', target: 10 }
    ],
    moneyReward: 10000,
    itemReward: [{ itemId: 'prismatic_shard', quantity: 1 }],
    friendshipReward: [{ npcId: 'liu_cunzhang', amount: 50 }]
  }
]

/** ID ile ana görev getir */
export const getStoryQuestById = (id: string): MainQuestDef | undefined => {
  return STORY_QUESTS.find(q => q.id === id)
}

/** Bölüm ve sıra ile ana görev getir */
export const getStoryQuestByOrder = (chapter: number, order: number): MainQuestDef | undefined => {
  return STORY_QUESTS.find(q => q.chapter === chapter && q.order === order)
}

/** Sonraki ana görevi getir */
export const getNextStoryQuest = (currentId: string): MainQuestDef | undefined => {
  const idx = STORY_QUESTS.findIndex(q => q.id === currentId)
  if (idx === -1 || idx >= STORY_QUESTS.length - 1) return undefined
  return STORY_QUESTS[idx + 1]
}

/** Bir bölümdeki bütün ana görevleri getir */
export const getChapterQuests = (chapter: number): MainQuestDef[] => {
  return STORY_QUESTS.filter(q => q.chapter === chapter)
}

/** İlk ana görevi getir */
export const getFirstStoryQuest = (): MainQuestDef => {
  return STORY_QUESTS[0]!
}
