import type { AchievementDef, CommunityBundleDef } from '@/types'

/** Başarım listesi */
export const ACHIEVEMENTS: AchievementDef[] = [
  // Koleksiyon
  {
    id: 'collector_10',
    name: 'Yola Yeni Çıkan',
    description: '10 farklı eşya keşfet.',
    condition: { type: 'itemCount', count: 10 },
    reward: { money: 200 }
  },
  {
    id: 'collector_30',
    name: 'Doğa Bilgini',
    description: '30 farklı eşya keşfet.',
    condition: { type: 'itemCount', count: 30 },
    reward: { money: 500 }
  },
  {
    id: 'collector_60',
    name: 'Varlıkların Bilgesi',
    description: '60 farklı eşya keşfet.',
    condition: { type: 'itemCount', count: 60 },
    reward: { money: 1500 }
  },

  // Tarım
  {
    id: 'farmer_50',
    name: 'Çalışkan Çiftçi',
    description: 'Toplam 50 kez ürün hasat et.',
    condition: { type: 'cropHarvest', count: 50 },
    reward: { money: 300 }
  },
  {
    id: 'farmer_200',
    name: 'Bereket Beyi',
    description: 'Toplam 200 kez ürün hasat et.',
    condition: { type: 'cropHarvest', count: 200 },
    reward: { money: 1000, items: [{ itemId: 'compost', quantity: 10 }] }
  },

  // Balıkçılık
  {
    id: 'fisher_20',
    name: 'Olta Çömezi',
    description: 'Toplam 20 balık yakala.',
    condition: { type: 'fishCaught', count: 20 },
    reward: { money: 200 }
  },
  {
    id: 'fisher_100',
    name: 'Ağsakallı Balıkçı',
    description: 'Toplam 100 balık yakala.',
    condition: { type: 'fishCaught', count: 100 },
    reward: { money: 800 }
  },

  // Madencilik
  {
    id: 'miner_15',
    name: 'Maden Yolcusu',
    description: 'Madenin 15. katına ulaş.',
    condition: { type: 'mineFloor', floor: 15 },
    reward: { money: 300 }
  },
  {
    id: 'miner_30',
    name: 'Derin Maden Ustası',
    description: 'Madenin 30. katına ulaş.',
    condition: { type: 'mineFloor', floor: 30 },
    reward: { money: 1000, items: [{ itemId: 'gold_ore', quantity: 10 }] }
  },
  {
    id: 'miner_60',
    name: 'Kor Ateşi Fatihi',
    description: 'Madenin 60. katına ulaş.',
    condition: { type: 'mineFloor', floor: 60 },
    reward: { money: 2000, items: [{ itemId: 'gold_ore', quantity: 20 }] }
  },
  {
    id: 'miner_120',
    name: 'Uçurum Gezgini',
    description: 'Madenin en dip katına ulaş.',
    condition: { type: 'mineFloor', floor: 120 },
    reward: { money: 5000, items: [{ itemId: 'void_ore', quantity: 10 }] }
  },
  {
    id: 'skull_25',
    name: 'Kuru Kafa Kâşifi',
    description: 'Kuru Kafa Madeninde 25. kata ulaş.',
    condition: { type: 'skullCavernFloor', floor: 25 },
    reward: { money: 3000, items: [{ itemId: 'iridium_ore', quantity: 5 }] }
  },
  {
    id: 'skull_100',
    name: 'Uçurum Yiğidi',
    description: 'Kuru Kafa Madeninde 100. kata ulaş.',
    condition: { type: 'skullCavernFloor', floor: 100 },
    reward: { money: 10000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
  },

  // Para
  {
    id: 'rich_5000',
    name: 'Geçimi Yerinde',
    description: 'Toplam 5000 akçe kazan.',
    condition: { type: 'moneyEarned', amount: 5000 },
    reward: { money: 500 }
  },
  {
    id: 'rich_20000',
    name: 'gaKöy Beyi',
    description: 'Toplam 20000 akçe kazan.',
    condition: { type: 'moneyEarned', amount: 20000 },
    reward: { money: 2000 }
  },

  // Yemek
  {
    id: 'chef_10',
    name: 'Aş Ocağına Adım',
    description: 'Toplam 10 yemek pişir.',
    condition: { type: 'recipesCooked', count: 10 },
    reward: { money: 300 }
  },
  {
    id: 'chef_50',
    name: 'Toyga Ustası',
    description: 'Toplam 50 yemek pişir.',
    condition: { type: 'recipesCooked', count: 50 },
    reward: { money: 1000 }
  },

  // Yetenek
  {
    id: 'skill_master',
    name: 'Zanaat Ermişi',
    description: 'Çiftçilik yeteneğini 10. seviyeye ulaştır.',
    condition: { type: 'skillLevel', skillType: 'farming', level: 10 },
    reward: { money: 2000 }
  },

  // Sosyal
  {
    id: 'social_friend',
    name: 'Gönül Ehli',
    description: 'Tüm gaKöy halkıyla "Tanışık" ol.',
    condition: { type: 'npcFriendship', level: 'acquaintance' },
    reward: { money: 500 }
  },

  // Görev
  {
    id: 'quest_10',
    name: 'Köyün Yardımseveri',
    description: 'Toplam 10 görev tamamla.',
    condition: { type: 'questsCompleted', count: 10 },
    reward: { money: 500 }
  },
  {
    id: 'quest_40',
    name: 'Her Derde Derman',
    description: 'Toplam 40 görev tamamla.',
    condition: { type: 'questsCompleted', count: 40 },
    reward: { money: 2500 }
  },

  // Dostluk
  {
    id: 'friend_best',
    name: 'Can Yoldaşı',
    description: '1 köylüyle gönül bağı kur.',
    condition: { type: 'npcBestFriend', count: 1 },
    reward: { money: 200 }
  },
  {
    id: 'friend_all_friendly',
    name: 'gaKöy Dostu',
    description: 'Tüm köylülerle dost ol.',
    condition: { type: 'npcAllFriendly' },
    reward: { money: 1000, items: [{ itemId: 'jade_ring', quantity: 1 }] }
  },

  // Evlilik & Çocuk
  {
    id: 'married',
    name: 'Kutlu Birlik',
    description: 'Sevdiğin kişiyle yuva kur.',
    condition: { type: 'married' },
    reward: { money: 1314 }
  },
  {
    id: 'parent',
    name: 'Ocak Bereketi',
    description: 'İlk çocuğunu kucağına al.',
    condition: { type: 'hasChild' },
    reward: { money: 520 }
  },

  // Canavar
  {
    id: 'slayer_50',
    name: 'Yaratık Avcısı',
    description: 'Toplam 50 yaratık yok et.',
    condition: { type: 'monstersKilled', count: 50 },
    reward: { money: 300 }
  },
  {
    id: 'slayer_200',
    name: 'Azılı Avcı',
    description: 'Toplam 200 yaratık yok et.',
    condition: { type: 'monstersKilled', count: 200 },
    reward: { money: 1000 }
  },
  {
    id: 'slayer_500',
    name: 'Karanlık Kıran',
    description: 'Toplam 500 yaratık yok et.',
    condition: { type: 'monstersKilled', count: 500 },
    reward: { money: 3000 }
  },
  {
    id: 'slayer_1000',
    name: 'Bin Bela Yıkan',
    description: 'Toplam 1000 yaratık yok et.',
    condition: { type: 'monstersKilled', count: 1000 },
    reward: { money: 5000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
  },

  // Sevkiyat
  {
    id: 'shipper_10',
    name: 'Tüccarlığa İlk Adım',
    description: '10 farklı eşya sevk et.',
    condition: { type: 'shippedCount', count: 10 },
    reward: { money: 300 }
  },
  {
    id: 'shipper_30',
    name: 'Kervan Ustası',
    description: '30 farklı eşya sevk et.',
    condition: { type: 'shippedCount', count: 30 },
    reward: { money: 1000 }
  },
  {
    id: 'full_shipment',
    name: 'Tüm Malların Efendisi',
    description: 'Sevk edilebilen tüm eşyaları gönder.',
    condition: { type: 'fullShipment' },
    reward: { money: 5000 }
  },
  // Hayvancılık
{
  id: 'rancher_5',
  name: 'Sürüye Yeni Katılan',
  description: '5 baş hayvana sahip ol.',
  condition: { type: 'animalCount', count: 5 },
  reward: { money: 500 }
},
{
  id: 'rancher_15',
  name: 'Ağıl Beyi',
  description: '15 baş hayvana sahip ol.',
  condition: { type: 'animalCount', count: 15 },
  reward: { money: 2000 }
},
  // Daha yüksek zenginlik
{
  id: 'rich_50000',
  name: 'Diyarın Zengini',
  description: 'Toplam 50000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 50000 },
  reward: { money: 3000 }
},
{
  id: 'rich_200000',
  name: 'Karun Misali Servet',
  description: 'Toplam 200000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 200000 },
  reward: { money: 10000 }
},

// Daha fazla çiftçilik & balıkçılık
{
  id: 'farmer_500',
  name: 'Toprak Beyi',
  description: 'Toplam 500 mahsul hasat et.',
  condition: { type: 'cropHarvest', count: 500 },
  reward: { money: 2000 }
},
{
  id: 'fisher_200',
  name: 'Deniz Hanı',
  description: 'Toplam 200 balık yakala.',
  condition: { type: 'fishCaught', count: 200 },
  reward: { money: 2000 }
},

// Tüm yetenekler & tüm tapınak görevleri
{
  id: 'all_skills',
  name: 'Kâmil Usta',
  description: 'Tüm yetenekleri 10. seviyeye ulaştır.',
  condition: { type: 'allSkillsMax' },
  reward: { money: 5000 }
},
{
  id: 'all_bundles',
  name: 'Köy Birliği',
  description: 'Tüm kutsal ocak görevlerini tamamla.',
  condition: { type: 'allBundlesComplete' },
  reward: { money: 5000 }
},

// Koleksiyon, yemek, görev, dostluk
{
  id: 'collector_100',
  name: 'Eşya Bilgesi',
  description: '100 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 100 },
  reward: { money: 3000 }
},
{
  id: 'chef_100',
  name: 'Saray Aşçısı',
  description: 'Toplam 100 yemek pişir.',
  condition: { type: 'recipesCooked', count: 100 },
  reward: { money: 2000 }
},
{
  id: 'quest_80',
  name: 'Her İşe Koşan',
  description: 'Toplam 80 görev tamamla.',
  condition: { type: 'questsCompleted', count: 80 },
  reward: { money: 3000 }
},
{
  id: 'friend_all_best',
  name: 'Can Yoldaşı',
  description: '6 köylü ile gönül bağı kur.',
  condition: { type: 'npcBestFriend', count: 6 },
  reward: { money: 3000, items: [{ itemId: 'jade_ring', quantity: 1 }] }
},

// Koleksiyon
{
  id: 'collector_5',
  name: 'Meraklı Çırak',
  description: '5 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 5 },
  reward: { money: 100 }
},
{
  id: 'collector_20',
  name: 'Gezgin Göz',
  description: '20 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 20 },
  reward: { money: 300 }
},
{
  id: 'collector_45',
  name: 'Diyar Tanıyan',
  description: '45 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 45 },
  reward: { money: 800 }
},
{
  id: 'collector_80',
  name: 'Bilge Derleyici',
  description: '80 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 80 },
  reward: { money: 2000 }
},
{
  id: 'collector_120',
  name: 'Varlık Bilgesi',
  description: '120 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 120 },
  reward: { money: 5000 }
},
{
  id: 'collector_150',
  name: 'Her Şeyi Bilen',
  description: '150 farklı nesne keşfet.',
  condition: { type: 'itemCount', count: 150 },
  reward: { money: 8000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
},

// Çiftçilik
{
  id: 'farmer_10',
  name: 'Toprak Çırağı',
  description: '10 mahsul hasat et.',
  condition: { type: 'cropHarvest', count: 10 },
  reward: { money: 100 }
},
{
  id: 'farmer_100',
  name: 'Usta Çiftçi',
  description: '100 mahsul hasat et.',
  condition: { type: 'cropHarvest', count: 100 },
  reward: { money: 500 }
},
{
  id: 'farmer_1000',
  name: 'Toprağın Efsanesi',
  description: '1000 mahsul hasat et.',
  condition: { type: 'cropHarvest', count: 1000 },
  reward: { money: 5000, items: [{ itemId: 'iridium_ore', quantity: 5 }] }
},

// Balıkçılık
{
  id: 'fisher_5',
  name: 'Irmak Çocuğu',
  description: '5 balık yakala.',
  condition: { type: 'fishCaught', count: 5 },
  reward: { money: 100 }
},
{
  id: 'fisher_50',
  name: 'Olta Ustası',
  description: '50 balık yakala.',
  condition: { type: 'fishCaught', count: 50 },
  reward: { money: 500 }
},
  {
  id: 'fisher_500',
  name: 'Suyun Kutlu Efendisi',
  description: 'Toplam 500 balık yakala.',
  condition: { type: 'fishCaught', count: 500 },
  reward: { money: 5000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
},

// Zenginlik
{
  id: 'rich_1000',
  name: 'İlk Akçe Birikimi',
  description: 'Toplam 1000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 1000 },
  reward: { money: 100 }
},
{
  id: 'rich_10000',
  name: 'Sofrası Bolluklu',
  description: 'Toplam 10000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 10000 },
  reward: { money: 1000 }
},
{
  id: 'rich_100000',
  name: 'Ocağı Varlıklı',
  description: 'Toplam 100000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 100000 },
  reward: { money: 5000 }
},
{
  id: 'rich_500000',
  name: 'İle Denk Servet',
  description: 'Toplam 500000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 500000 },
  reward: { money: 15000 }
},
{
  id: 'rich_1000000',
  name: 'Altın Dağı Sahibi',
  description: 'Toplam 1000000 akçe kazan.',
  condition: { type: 'moneyEarned', amount: 1000000 },
  reward: { money: 30000, items: [{ itemId: 'prismatic_shard', quantity: 3 }] }
},

// Aşçılık
{
  id: 'chef_5',
  name: 'Ocak Çırağı',
  description: 'Toplam 5 yemek pişir.',
  condition: { type: 'recipesCooked', count: 5 },
  reward: { money: 100 }
},
{
  id: 'chef_25',
  name: 'Ocak Eri',
  description: 'Toplam 25 yemek pişir.',
  condition: { type: 'recipesCooked', count: 25 },
  reward: { money: 500 }
},
{
  id: 'chef_75',
  name: 'Aş Ocağı Ustası',
  description: 'Toplam 75 yemek pişir.',
  condition: { type: 'recipesCooked', count: 75 },
  reward: { money: 1500 }
},

// Görevler
{
  id: 'quest_5',
  name: 'İşe Koşan',
  description: 'Toplam 5 köy işi tamamla.',
  condition: { type: 'questsCompleted', count: 5 },
  reward: { money: 200 }
},
{
  id: 'quest_20',
  name: 'Haber Taşıyan',
  description: 'Toplam 20 köy işi tamamla.',
  condition: { type: 'questsCompleted', count: 20 },
  reward: { money: 1000 }
},
{
  id: 'quest_60',
  name: 'Sözü Yerde Kalmayan',
  description: 'Toplam 60 köy işi tamamla.',
  condition: { type: 'questsCompleted', count: 60 },
  reward: { money: 2000 }
},
{
  id: 'quest_100',
  name: 'Her Derde Yetişen',
  description: 'Toplam 100 köy işi tamamla.',
  condition: { type: 'questsCompleted', count: 100 },
  reward: { money: 5000, items: [{ itemId: 'dragon_jade', quantity: 1 }] }
},

// Canavar avı
{
  id: 'slayer_10',
  name: 'İlk Kılıç Denemesi',
  description: 'Toplam 10 yaratık öldür.',
  condition: { type: 'monstersKilled', count: 10 },
  reward: { money: 100 }
},
{
  id: 'slayer_100',
  name: 'Köy Koruyucusu',
  description: 'Toplam 100 yaratık öldür.',
  condition: { type: 'monstersKilled', count: 100 },
  reward: { money: 500 }
},
{
  id: 'slayer_300',
  name: 'Uğursuzluk Kıranı',
  description: 'Toplam 300 yaratık öldür.',
  condition: { type: 'monstersKilled', count: 300 },
  reward: { money: 2000 }
},
{
  id: 'slayer_2000',
  name: 'Destanlık Avcı',
  description: 'Toplam 2000 yaratık öldür.',
  condition: { type: 'monstersKilled', count: 2000 },
  reward: { money: 10000, items: [{ itemId: 'dragon_jade', quantity: 2 }] }
},

// Sevkiyat
{
  id: 'shipper_5',
  name: 'Pazar Yolcusu',
  description: '5 farklı nesneyi sevk et.',
  condition: { type: 'shippedCount', count: 5 },
  reward: { money: 100 }
},
{
  id: 'shipper_20',
  name: 'Kervan Yolu Açan',
  description: '20 farklı nesneyi sevk et.',
  condition: { type: 'shippedCount', count: 20 },
  reward: { money: 500 }
},
{
  id: 'shipper_50',
  name: 'Ticaret Beyi',
  description: '50 farklı nesneyi sevk et.',
  condition: { type: 'shippedCount', count: 50 },
  reward: { money: 2000 }
},

  // Hayvancılık
{
  id: 'rancher_1',
  name: 'İlk Ağıl',
  description: '1 baş hayvana sahip ol.',
  condition: { type: 'animalCount', count: 1 },
  reward: { money: 100 }
},
{
  id: 'rancher_3',
  name: 'Küçük Sürü',
  description: '3 baş hayvana sahip ol.',
  condition: { type: 'animalCount', count: 3 },
  reward: { money: 300 }
},
{
  id: 'rancher_10',
  name: 'Sürü Ustası',
  description: '10 baş hayvana sahip ol.',
  condition: { type: 'animalCount', count: 10 },
  reward: { money: 1000 }
},
{
  id: 'rancher_20',
  name: 'Ağıl Efsanesi',
  description: '20 baş hayvana sahip ol.',
  condition: { type: 'animalCount', count: 20 },
  reward: { money: 3000, items: [{ itemId: 'iridium_ore', quantity: 3 }] }
},

// Maden
{
  id: 'miner_5',
  name: 'Madene İlk Adım',
  description: 'Madenin 5. katına ulaş.',
  condition: { type: 'mineFloor', floor: 5 },
  reward: { money: 100 }
},
{
  id: 'miner_45',
  name: 'Ayaz Damarı',
  description: 'Madenin 45. katına ulaş.',
  condition: { type: 'mineFloor', floor: 45 },
  reward: { money: 1500, items: [{ itemId: 'iron_ore', quantity: 15 }] }
},
{
  id: 'miner_90',
  name: 'Billur Mağarası',
  description: 'Madenin 90. katına ulaş.',
  condition: { type: 'mineFloor', floor: 90 },
  reward: { money: 3000, items: [{ itemId: 'crystal_ore', quantity: 10 }] }
},
{
  id: 'miner_100',
  name: 'Yüz Kat Yiğidi',
  description: 'Madenin 100. katına ulaş.',
  condition: { type: 'mineFloor', floor: 100 },
  reward: { money: 4000, items: [{ itemId: 'shadow_ore', quantity: 5 }] }
},

// Kafatası Madeni
{
  id: 'skull_10',
  name: 'Kuru Kuyu Yolcusu',
  description: 'Kafatası Madeninde 10. kata ulaş.',
  condition: { type: 'skullCavernFloor', floor: 10 },
  reward: { money: 1000 }
},
{
  id: 'skull_50',
  name: 'Derinlik Aşanı',
  description: 'Kafatası Madeninde 50. kata ulaş.',
  condition: { type: 'skullCavernFloor', floor: 50 },
  reward: { money: 5000, items: [{ itemId: 'iridium_ore', quantity: 10 }] }
},
{
  id: 'skull_75',
  name: 'Öte Âlem Gezgini',
  description: 'Kafatası Madeninde 75. kata ulaş.',
  condition: { type: 'skullCavernFloor', floor: 75 },
  reward: { money: 8000, items: [{ itemId: 'dragon_jade', quantity: 1 }] }
},
{
  id: 'skull_150',
  name: 'Uçsuz Dip',
  description: 'Kafatası Madeninde 150. kata ulaş.',
  condition: { type: 'skullCavernFloor', floor: 150 },
  reward: { money: 20000, items: [{ itemId: 'prismatic_shard', quantity: 2 }] }
},

// Gönül bağı
{
  id: 'friend_best_2',
  name: 'İki Can Dost',
  description: '2 köylü ile gönül bağı kur.',
  condition: { type: 'npcBestFriend', count: 2 },
  reward: { money: 500 }
},
{
  id: 'friend_best_3',
  name: 'Can Yoldaşları',
  description: '3 köylü ile gönül bağı kur.',
  condition: { type: 'npcBestFriend', count: 3 },
  reward: { money: 1000 }
},
{
  id: 'friend_best_4',
  name: 'Dost Eli Geniş',
  description: '4 köylü ile gönül bağı kur.',
  condition: { type: 'npcBestFriend', count: 4 },
  reward: { money: 2000 }
},

// Sosyallik
{
  id: 'social_all_friendly',
  name: 'İyilikle Anılan',
  description: 'Tüm köylülerle "tanışık" ol.',
  condition: { type: 'npcFriendship', level: 'friendly' },
  reward: { money: 2000 }
},

// Yetenek seviyeleri
{
  id: 'farming_5',
  name: 'Toprağın Yolunu Bilen',
  description: 'Ekin biçme yeteneğini 5. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'farming', level: 5 },
  reward: { money: 300 }
},
{
  id: 'foraging_5',
  name: 'Dağın Oğlu',
  description: 'Toplayıcılık yeteneğini 5. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'foraging', level: 5 },
  reward: { money: 300 }
},
{
  id: 'foraging_10',
  name: 'Toplayıcılık Pir`i',
  description: 'Toplayıcılık yeteneğini 10. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'foraging', level: 10 },
  reward: { money: 2000 }
},
{
  id: 'fishing_5',
  name: 'Olta Yolcusu',
  description: 'Balıkçılık yeteneğini 5. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'fishing', level: 5 },
  reward: { money: 300 }
},
  {
  id: 'fishing_10',
  name: 'Olta Pir’i',
  description: 'Balıkçılık yeteneğini 10. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'fishing', level: 10 },
  reward: { money: 2000 }
},
{
  id: 'mining_5',
  name: 'Damar Sezicisi',
  description: 'Madencilik yeteneğini 5. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'mining', level: 5 },
  reward: { money: 300 }
},
{
  id: 'mining_10',
  name: 'Maden Pir’i',
  description: 'Madencilik yeteneğini 10. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'mining', level: 10 },
  reward: { money: 2000 }
},
{
  id: 'combat_5',
  name: 'Kılıca İlk El',
  description: 'Dövüş yeteneğini 5. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'combat', level: 5 },
  reward: { money: 300 }
},
{
  id: 'combat_10',
  name: 'Er Meydanı Ustası',
  description: 'Dövüş yeteneğini 10. seviyeye çıkar.',
  condition: { type: 'skillLevel', skillType: 'combat', level: 10 },
  reward: { money: 2000 }
},

// Yetiştirme
{
  id: 'breeding_1',
  name: 'Soy İşine İlk Adım',
  description: '1 kez yetiştirme yap.',
  condition: { type: 'breedingsDone', count: 1 },
  reward: { money: 200 }
},
{
  id: 'breeding_10',
  name: 'Soy Çırağı',
  description: 'Toplam 10 kez yetiştirme yap.',
  condition: { type: 'breedingsDone', count: 10 },
  reward: { money: 500 }
},
{
  id: 'breeding_50',
  name: 'Soy Bilicisi',
  description: 'Toplam 50 kez yetiştirme yap.',
  condition: { type: 'breedingsDone', count: 50 },
  reward: { money: 2000 }
},
{
  id: 'breeding_200',
  name: 'Soy Ustası',
  description: 'Toplam 200 kez yetiştirme yap.',
  condition: { type: 'breedingsDone', count: 200 },
  reward: { money: 5000 }
},
{
  id: 'hybrid_1',
  name: 'Yeni Tohum Doğdu',
  description: '1 melez tür keşfet.',
  condition: { type: 'hybridsDiscovered', count: 1 },
  reward: { money: 300 }
},
{
  id: 'hybrid_5',
  name: 'Tohum Derleyicisi',
  description: '5 melez tür keşfet.',
  condition: { type: 'hybridsDiscovered', count: 5 },
  reward: { money: 800 }
},
{
  id: 'hybrid_20',
  name: 'Melez Defteri',
  description: '20 melez tür keşfet.',
  condition: { type: 'hybridsDiscovered', count: 20 },
  reward: { money: 2000 }
},
{
  id: 'hybrid_50',
  name: 'Tohum Pir’i',
  description: '50 melez tür keşfet.',
  condition: { type: 'hybridsDiscovered', count: 50 },
  reward: { money: 5000 }
},
{
  id: 'hybrid_100',
  name: 'Binbir Soyun Yazıcısı',
  description: '100 melez tür keşfet.',
  condition: { type: 'hybridsDiscovered', count: 100 },
  reward: { money: 10000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
},
{
  id: 'tier_3',
  name: 'Üçüncü Soy',
  description: 'Üçüncü soy melez yetiştir.',
  condition: { type: 'hybridTier', tier: 3 },
  reward: { money: 1000 }
},
{
  id: 'tier_5',
  name: 'Beşinci Soy',
  description: 'Beşinci soy melez yetiştir.',
  condition: { type: 'hybridTier', tier: 5 },
  reward: { money: 3000 }
},
{
  id: 'tier_7',
  name: 'Yedinci Soy Mucizesi',
  description: 'Yedinci soy melez yetiştir.',
  condition: { type: 'hybridTier', tier: 7 },
  reward: { money: 5000 }
},
{
  id: 'tier_10',
  name: 'Ustalığın Zirvesi',
  description: 'Onuncu soy melez yetiştir.',
  condition: { type: 'hybridTier', tier: 10 },
  reward: { money: 15000, items: [{ itemId: 'prismatic_shard', quantity: 2 }] }
},

// Melez sevkiyatı
{
  id: 'hybrid_ship_1',
  name: 'İlk Melez Satışı',
  description: '1 tür melez ürünü sevk et.',
  condition: { type: 'hybridsShipped', count: 1 },
  reward: { money: 300 }
},
{
  id: 'hybrid_ship_5',
  name: 'İyi Tohum Pazarı',
  description: '5 tür melez ürünü sevk et.',
  condition: { type: 'hybridsShipped', count: 5 },
  reward: { money: 800 }
},
{
  id: 'hybrid_ship_15',
  name: 'Melez Tüccarı',
  description: '15 tür melez ürünü sevk et.',
  condition: { type: 'hybridsShipped', count: 15 },
  reward: { money: 2000 }
},
{
  id: 'hybrid_ship_30',
  name: 'Tohum Yolu Açan',
  description: '30 tür melez ürünü sevk et.',
  condition: { type: 'hybridsShipped', count: 30 },
  reward: { money: 5000 }
},
{
  id: 'hybrid_ship_50',
  name: 'Melez Defteri Tam',
  description: '50 tür melez ürünü sevk et.',
  condition: { type: 'hybridsShipped', count: 50 },
  reward: { money: 10000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
},

// Müze
{
  id: 'museum_20',
  name: 'Derleme Sevdalısı',
  description: 'Müzeye 20 parça bağışla.',
  condition: { type: 'museumDonations', count: 20 },
  reward: { money: 1000 }
},
{
  id: 'museum_36',
  name: 'Müzenin Yıldızı',
  description: 'Müzeye 36 parça bağışla.',
  condition: { type: 'museumDonations', count: 36 },
  reward: { money: 5000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
},
{
  id: 'museum_40',
  name: 'Kutlu Emanetlerin Defteri',
  description: 'Müzedeki tüm 40 parçayı tamamla (ruhânî eşyalar dahil).',
  condition: { type: 'museumDonations', count: 40 },
  reward: { money: 8000 }
},

// Maceracılar Ocağı
{
  id: 'guild_5',
  name: 'Yaratık Avcısı',
  description: '5 av hedefini tamamla.',
  condition: { type: 'guildGoalsCompleted', count: 5 },
  reward: { money: 1000 }
},
{
  id: 'guild_21',
  name: 'Ejder Yenen Yiğit',
  description: 'Tüm 21 av hedefini tamamla.',
  condition: { type: 'guildGoalsCompleted', count: 21 },
  reward: { money: 10000, items: [{ itemId: 'iridium_bar', quantity: 5 }] }
},

// Ruhânî varlıklar
{
  id: 'spirit_first',
  name: 'İlk Sezi',
  description: 'İlk ruhânî varlığı keşfet.',
  condition: { type: 'hiddenNpcRevealed', count: 1 },
  reward: { money: 500 }
},
{
  id: 'spirit_three',
  name: 'Canlara Kulak Veren',
  description: '3 ruhânî varlık keşfet.',
  condition: { type: 'hiddenNpcRevealed', count: 3 },
  reward: { money: 2000 }
},
{
  id: 'spirit_all',
  name: 'Altı Canın Gönlü',
  description: 'Tüm 6 ruhânî varlığı keşfet.',
  condition: { type: 'hiddenNpcRevealed', count: 6 },
  reward: { money: 5000, items: [{ itemId: 'prismatic_shard', quantity: 1 }] }
},
{
  id: 'spirit_bonded',
  name: 'Yazgılı Bağ',
  description: 'Bir ruhânî varlıkla gönül bağı kur.',
  condition: { type: 'hiddenNpcBonded' },
  reward: { money: 1314 }
},
{
  id: 'spirit_peach_found',
  name: 'Kutlu Şeftali Tadı',
  description: 'Kutlu şeftali elde et.',
  condition: { type: 'itemDiscovered', itemId: 'spirit_peach' },
  reward: { money: 300 }
},
{
  id: 'moon_herb_found',
  name: 'Ay Otu İlk Demet',
  description: 'Ay otu elde et.',
  condition: { type: 'itemDiscovered', itemId: 'moon_herb' },
  reward: { money: 300 }
},
{
  id: 'dream_silk_found',
  name: 'Düş İpeği',
  description: 'Düş ipeği elde et.',
  condition: { type: 'itemDiscovered', itemId: 'dream_silk' },
  reward: { money: 300 }
}
]

/** Tapınak görev tahtası */
export const COMMUNITY_BUNDLES: CommunityBundleDef[] = [
  {
    id: 'spring_bundle',
    name: 'Bahar Ekin Armağanı',
    description: 'Bahar mevsimi ürünleri.',
    requiredItems: [
      { itemId: 'cabbage', quantity: 5 },
      { itemId: 'radish', quantity: 5 },
      { itemId: 'bamboo_shoot', quantity: 3 },
      { itemId: 'tea', quantity: 2 }
    ],
    reward: { money: 500, items: [{ itemId: 'seed_peach', quantity: 3 }], description: '500 akçe + Şeftali tohumu x3' }
  },
  {
    id: 'summer_bundle',
    name: 'Yaz Bereketi Armağanı',
    description: 'Yaz mevsimi ürünleri.',
    requiredItems: [
      { itemId: 'watermelon', quantity: 3 },
      { itemId: 'rice', quantity: 5 },
      { itemId: 'lotus_root', quantity: 2 },
      { itemId: 'chili', quantity: 3 }
    ],
    reward: { money: 800, items: [{ itemId: 'seed_lotus_seed', quantity: 2 }], description: '800 akçe + Nilüfer tohumu x2' }
  },
  {
    id: 'autumn_bundle',
    name: 'Güz Hasadı Armağanı',
    description: 'Güz mevsimi ürünleri.',
    requiredItems: [
      { itemId: 'pumpkin', quantity: 3 },
      { itemId: 'osmanthus', quantity: 2 },
      { itemId: 'jujube', quantity: 3 },
      { itemId: 'persimmon', quantity: 2 }
    ],
    reward: { money: 800, items: [{ itemId: 'seed_snow_lotus', quantity: 1 }], description: '800 akçe + Kar nilüferi tohumu x1' }
  },
  {
    id: 'winter_bundle',
    name: 'Kış Zahiresi Armağanı',
    description: 'Kış mevsimi ürünleri.',
    requiredItems: [
      { itemId: 'winter_bamboo_shoot', quantity: 5 },
      { itemId: 'winter_wheat', quantity: 3 },
      { itemId: 'garlic', quantity: 3 },
      { itemId: 'ginger', quantity: 2 }
    ],
    reward: { money: 1000, description: '1000 akçe' }
  },
  {
    id: 'artisan_bundle',
    name: 'Ustalık Armağanı',
    description: 'Çeşitli işlenmiş ürünler.',
    requiredItems: [
      { itemId: 'watermelon_wine', quantity: 1 },
      { itemId: 'pickled_cabbage', quantity: 1 },
      { itemId: 'honey', quantity: 2 },
      { itemId: 'sesame_oil', quantity: 1 },
      { itemId: 'peach_wine', quantity: 1 }
    ],
    reward: { money: 2000, description: '2000 akçe' }
  },
  {
    id: 'friendship_bundle',
    name: 'Köy Gönlü Armağanı',
    description: 'Tüm köylülerle dostluk kur.',
    requiredItems: [
      { itemId: 'wintersweet', quantity: 2 },
      { itemId: 'chrysanthemum', quantity: 2 },
      { itemId: 'osmanthus', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },

  // Balık avı
  {
    id: 'fish_bundle',
    name: 'Balık Bereketi Armağanı',
    description: 'Çeşitli sulardan tutulan balıklar.',
    requiredItems: [
      { itemId: 'crucian', quantity: 3 },
      { itemId: 'carp', quantity: 3 },
      { itemId: 'bass', quantity: 2 },
      { itemId: 'catfish', quantity: 1 }
    ],
    reward: { money: 1000, description: '1000 akçe' }
  },
  {
    id: 'rare_fish_bundle',
    name: 'Nadir Balık Armağanı',
    description: 'Ender rastlanan kıymetli balıklar.',
    requiredItems: [
      { itemId: 'sturgeon', quantity: 1 },
      { itemId: 'mandarin_fish', quantity: 1 },
      { itemId: 'koi', quantity: 1 },
      { itemId: 'eel', quantity: 1 }
    ],
    reward: { money: 2500, items: [{ itemId: 'iridium_ore', quantity: 3 }], description: '2500 akçe + İridyum cevheri x3' }
  },

  // Cevher ve taşlar
  {
    id: 'ore_bundle',
    name: 'Cevher Armağanı',
    description: 'Madenden çıkan türlü cevherler.',
    requiredItems: [
      { itemId: 'copper_ore', quantity: 10 },
      { itemId: 'iron_ore', quantity: 5 },
      { itemId: 'gold_ore', quantity: 3 },
      { itemId: 'quartz', quantity: 3 }
    ],
    reward: { money: 1000, description: '1000 akçe' }
  },
  {
    id: 'gem_bundle',
    name: 'Mücevher Armağanı',
    description: 'Işıltılı taşlardan seçme derleme.',
    requiredItems: [
      { itemId: 'jade', quantity: 2 },
      { itemId: 'ruby', quantity: 1 },
      { itemId: 'moonstone', quantity: 1 },
      { itemId: 'obsidian', quantity: 1 }
    ],
    reward: { money: 3000, items: [{ itemId: 'dragon_jade', quantity: 1 }], description: '3000 akçe + Ejder yeşimi x1' }
  },

  // Hayvansal ürünler
  {
    id: 'animal_bundle',
    name: 'Ağıl Armağanı',
    description: 'Çiftlik hayvanlarının sunduğu nimetler.',
    requiredItems: [
      { itemId: 'egg', quantity: 5 },
      { itemId: 'milk', quantity: 3 },
      { itemId: 'duck_egg', quantity: 2 },
      { itemId: 'wool', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'egg_bundle',
    name: 'Yumurta Armağanı',
    description: 'Çeşit çeşit kuş yumurtaları.',
    requiredItems: [
      { itemId: 'egg', quantity: 3 },
      { itemId: 'duck_egg', quantity: 2 },
      { itemId: 'goose_egg', quantity: 1 },
      { itemId: 'quail_egg', quantity: 2 },
      { itemId: 'silkie_egg', quantity: 1 }
    ],
    reward: { money: 1200, description: '1200 akçe' }
  },
  {
    id: 'milk_bundle',
    name: 'Süt Armağanı',
    description: 'Türlü taze süt ürünleri.',
    requiredItems: [
      { itemId: 'milk', quantity: 3 },
      { itemId: 'goat_milk', quantity: 2 },
      { itemId: 'buffalo_milk', quantity: 1 },
      { itemId: 'yak_milk', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },

  // İşlenmiş ürünler
  {
    id: 'wine_bundle',
    name: 'Şarap Armağanı',
    description: 'Özenle mayalanmış nefis içkiler.',
    requiredItems: [
      { itemId: 'watermelon_wine', quantity: 1 },
      { itemId: 'peach_wine', quantity: 1 },
      { itemId: 'jujube_wine', quantity: 1 },
      { itemId: 'osmanthus_wine', quantity: 1 },
      { itemId: 'corn_wine', quantity: 1 }
    ],
    reward: { money: 2500, description: '2500 akçe' }
  },
  {
    id: 'tea_bundle',
    name: 'Çay Armağanı',
    description: 'Dört mevsimin kokusunu taşıyan çaylar.',
    requiredItems: [
      { itemId: 'green_tea_drink', quantity: 2 },
      { itemId: 'chrysanthemum_tea', quantity: 2 },
      { itemId: 'osmanthus_tea', quantity: 1 },
      { itemId: 'ginseng_tea', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'pickle_bundle',
    name: 'Turşu Armağanı',
    description: 'Çeşit çeşit salamura lezzetler.',
    requiredItems: [
      { itemId: 'pickled_cabbage', quantity: 2 },
      { itemId: 'pickled_chili', quantity: 2 },
      { itemId: 'pickled_ginger', quantity: 2 },
      { itemId: 'dried_radish', quantity: 2 }
    ],
    reward: { money: 1000, description: '1000 akçe' }
  },
  {
    id: 'smoked_bundle',
    name: 'İs Armağanı',
    description: 'İslenmiş balıkların kuvvetli tadı.',
    requiredItems: [
      { itemId: 'smoked_crucian', quantity: 1 },
      { itemId: 'smoked_carp', quantity: 1 },
      { itemId: 'smoked_bass', quantity: 1 },
      { itemId: 'smoked_eel', quantity: 1 },
      { itemId: 'smoked_sturgeon', quantity: 1 }
    ],
    reward: { money: 2000, description: '2000 akçe' }
  },
  {
    id: 'honey_bundle',
    name: 'Bal Armağanı',
    description: 'Çiçeklerden süzülen tatlı bereket.',
    requiredItems: [
      { itemId: 'honey', quantity: 3 },
      { itemId: 'chrysanthemum_honey', quantity: 1 },
      { itemId: 'osmanthus_honey', quantity: 1 },
      { itemId: 'rapeseed_honey', quantity: 1 }
    ],
    reward: { money: 1800, description: '1800 akçe' }
  },
  {
    id: 'cheese_bundle',
    name: 'Peynir Armağanı',
    description: 'Çeşit çeşit süt peyniri.',
    requiredItems: [
      { itemId: 'cheese', quantity: 2 },
      { itemId: 'goat_cheese', quantity: 1 },
      { itemId: 'buffalo_cheese', quantity: 1 },
      { itemId: 'yak_cheese', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'bar_bundle',
    name: 'Demirci Armağanı',
    description: 'Metal külçeleri ve temel işlik malzemeleri.',
    requiredItems: [
      { itemId: 'copper_bar', quantity: 5 },
      { itemId: 'iron_bar', quantity: 3 },
      { itemId: 'gold_bar', quantity: 2 },
      { itemId: 'charcoal', quantity: 5 }
    ],
    reward: { money: 2000, items: [{ itemId: 'iridium_bar', quantity: 1 }], description: '2000 akçe + İridyum külçesi x1' }
  },

  // Melez yetiştirme
  {
    id: 'hybrid_spring_bundle',
    name: 'Bahar Melezi',
    description: 'Bahar melez ürünlerinin ilk derlemesi.',
    requiredItems: [
      { itemId: 'emerald_radish', quantity: 2 },
      { itemId: 'jade_shoot', quantity: 2 },
      { itemId: 'peach_blossom_tea', quantity: 1 },
      { itemId: 'twin_bean', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'hybrid_summer_bundle',
    name: 'Yaz Melezi',
    description: 'Yaz melez ürünlerinin dolgun bereketi.',
    requiredItems: [
      { itemId: 'purple_melon', quantity: 2 },
      { itemId: 'golden_rice', quantity: 2 },
      { itemId: 'double_lotus', quantity: 1 },
      { itemId: 'fire_sesame', quantity: 2 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'hybrid_autumn_bundle',
    name: 'Güz Melezi',
    description: 'Güz melez ürünlerinin hasat tadı.',
    requiredItems: [
      { itemId: 'amber_yam', quantity: 2 },
      { itemId: 'twin_blossom', quantity: 1 },
      { itemId: 'golden_persimmon', quantity: 2 },
      { itemId: 'autumn_gem', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'hybrid_winter_bundle',
    name: 'Kış Melezi',
    description: 'Kış melez ürünlerinin ayaz içindeki cevheri.',
    requiredItems: [
      { itemId: 'jade_white', quantity: 2 },
      { itemId: 'garlic_cabbage', quantity: 2 },
      { itemId: 'evergreen_herb', quantity: 2 },
      { itemId: 'allium_king', quantity: 1 }
    ],
    reward: { money: 1500, description: '1500 akçe' }
  },
  {
    id: 'hybrid_elite_bundle',
    name: 'İkinci Soy Nadirleri',
    description: 'İkinci soy melezlerin kıymetli derlemesi.',
    requiredItems: [
      { itemId: 'melon_tea_fruit', quantity: 1 },
      { itemId: 'dragon_fire', quantity: 1 },
      { itemId: 'celestial_rice', quantity: 1 },
      { itemId: 'ice_lotus', quantity: 1 },
      { itemId: 'golden_dragon', quantity: 1 }
    ],
    reward: { money: 5000, items: [{ itemId: 'iridium_ore', quantity: 5 }], description: '5000 akçe + İridyum cevheri x5' }
  },
  {
    id: 'hybrid_legendary_bundle',
    name: 'Destanlık Tohumlar',
    description: 'Yüksek soy melezlerin dilden dile gezen örnekleri.',
    requiredItems: [
      { itemId: 'dragon_pearl', quantity: 1 },
      { itemId: 'immortal_flower', quantity: 1 },
      { itemId: 'jade_golden_melon', quantity: 1 },
      { itemId: 'moonlight_frost', quantity: 1 }
    ],
    reward: { money: 8000, items: [{ itemId: 'prismatic_shard', quantity: 1 }], description: '8000 akçe + Prizmatik parça x1' }
  }
]

export const getAchievementById = (id: string): AchievementDef | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export const getBundleById = (id: string): CommunityBundleDef | undefined => {
  return COMMUNITY_BUNDLES.find(b => b.id === id)
}
