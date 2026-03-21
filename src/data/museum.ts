import type { MuseumItemDef, MuseumMilestone } from '@/types'

/** Müze’ye bağışlanabilecek tüm nesneler */
export const MUSEUM_ITEMS: MuseumItemDef[] = [
  // ===== Madenler (7) =====
  { id: 'copper_ore', name: 'Bakır Cevheri', category: 'ore', sourceHint: 'Madenin sığ katmanlarında bulunur' },
  { id: 'iron_ore', name: 'Demir Cevheri', category: 'ore', sourceHint: 'Buz katmanlı madenlerde çıkar' },
  { id: 'gold_ore', name: 'Altın Cevheri', category: 'ore', sourceHint: 'Ateşli (lavlı) katmanlarda bulunur' },
  { id: 'crystal_ore', name: 'Billur Cevheri', category: 'ore', sourceHint: 'Kristal katmanlı madenlerde çıkar' },
  { id: 'shadow_ore', name: 'Gölge Cevheri', category: 'ore', sourceHint: 'Karanlık katmanlarda bulunur' },
  { id: 'void_ore', name: 'Boşluk Cevheri', category: 'ore', sourceHint: 'Uçurum katmanlarında çıkar' },
  { id: 'iridium_ore', name: 'İridyum Cevheri', category: 'ore', sourceHint: 'Kafatası mağarasında bulunur' },

  // ===== Değerli Taşlar (7) =====
  { id: 'quartz', name: 'Kuvars Taşı', category: 'gem', sourceHint: 'Madenin her katmanında bulunabilir' },
  { id: 'jade', name: 'Yeşim Taşı', category: 'gem', sourceHint: 'Buz katmanından daha derinlerde çıkar' },
  { id: 'ruby', name: 'Yakut', category: 'gem', sourceHint: 'Ateş katmanlarının altında bulunur' },
  { id: 'moonstone', name: 'Aytaşı', category: 'gem', sourceHint: 'Kristal katmanlarda bulunur' },
  { id: 'obsidian', name: 'Obsidyen', category: 'gem', sourceHint: 'Gölge katmanlarında çıkar' },
  { id: 'dragon_jade', name: 'Ejder Yeşimi', category: 'gem', sourceHint: 'Uçurum katmanlarında bulunur' },
  { id: 'prismatic_shard', name: 'Gökkuşağı Parçası', category: 'gem', sourceHint: 'Son derece nadir, derin sandıklardan çıkar' },

  // ===== Metal Külçeleri (4) =====
  { id: 'copper_bar', name: 'Bakır Külçesi', category: 'bar', sourceHint: 'Fırında bakır cevheri eritilerek elde edilir' },
  { id: 'iron_bar', name: 'Demir Külçesi', category: 'bar', sourceHint: 'Fırında demir cevheri eritilerek elde edilir' },
  { id: 'gold_bar', name: 'Altın Külçesi', category: 'bar', sourceHint: 'Fırında altın cevheri eritilerek elde edilir' },
  { id: 'iridium_bar', name: 'İridyum Külçesi', category: 'bar', sourceHint: 'Fırında iridyum cevheri eritilerek elde edilir' },

  // ===== Fosiller (8) =====
  { id: 'trilobite_fossil', name: 'Üç Loplu Canlı Fosili', category: 'fossil', sourceHint: 'Sığ ve buz katmanlı sandıklarda bulunur' },
  { id: 'amber', name: 'Kehribar', category: 'fossil', sourceHint: 'Madenin yeraltı ırmak katmanında düşer' },
  { id: 'ammonite_fossil', name: 'Sarmal Kabuk Fosili', category: 'fossil', sourceHint: 'Ateş ve kristal katman sandıklarında bulunur' },
  { id: 'fern_fossil', name: 'Eğrelti Fosili', category: 'fossil', sourceHint: 'Bambu koruluğunda nadir bulunur' },
  { id: 'shell_fossil', name: 'Kabuk Fosili', category: 'fossil', sourceHint: 'Sığ ve buz katmanlı sandıklarda bulunur' },
  { id: 'bone_fragment', name: 'Kemik Parçası', category: 'fossil', sourceHint: 'Derin katman yaratıklarından nadir düşer' },
  { id: 'petrified_wood', name: 'Taşlaşmış Odun', category: 'fossil', sourceHint: 'Bambu koruluğunda nadir bulunur' },
  { id: 'dragon_tooth', name: 'Ejder Dişi Fosili', category: 'fossil', sourceHint: 'Uçurum sandıkları veya kemik ejderlerden düşer' },

  // ===== Eski Eşyalar (10) =====
  { id: 'ancient_pottery', name: 'Eski Çömlek Parçası', category: 'artifact', sourceHint: 'Bambu koruluğunda nadir bulunur' },
  { id: 'jade_disc', name: 'Yeşim Disk Parçası', category: 'artifact', sourceHint: 'Kristal katman sandıklarında bulunur' },
  { id: 'bronze_mirror', name: 'Tunç Ayna', category: 'artifact', sourceHint: 'Ateş katmanı sandıklarında bulunur' },
  { id: 'ancient_coin', name: 'Eski Bakır Sikke', category: 'artifact', sourceHint: 'Yeraltı ırmak katmanında bulunur' },
  { id: 'oracle_bone', name: 'Kehanet Kemiği', category: 'artifact', sourceHint: 'Gölge katmanı sandıklarında bulunur' },
  { id: 'jade_pendant', name: 'Yeşim Tılsım', category: 'artifact', sourceHint: 'Kristal katmanlarda düşer' },
  { id: 'ancient_seed', name: 'Kadim Tohum', category: 'artifact', sourceHint: 'Derin sandıklarda son derece nadir bulunur' },
  { id: 'bamboo_scroll', name: 'Bambu Yazıtı', category: 'artifact', sourceHint: 'Bambu koruluğunda nadir bulunur' },
  { id: 'stone_axe_head', name: 'Taş Balta Başı', category: 'artifact', sourceHint: 'Bambu koruluğunda nadir bulunur' },
  { id: 'painted_pottery', name: 'Boyalı Çömlek Parçası', category: 'artifact', sourceHint: 'Ateş katmanı sandıklarında bulunur' },

  // ===== Ruhani Nesneler (4) =====
  { id: 'fox_bead', name: 'Tilki Tılsımı', category: 'spirit', sourceHint: 'Derin madenlerde (tilki ruhlarıyla ilgili izler)' },
  { id: 'spirit_peach', name: 'Kutlu Şeftali', category: 'spirit', sourceHint: 'Kutsanmış şeftali ağaçlarından nadiren düşer' },
  { id: 'moon_herb', name: 'Ay Otu', category: 'spirit', sourceHint: 'Ay ruhunun bereketinden sonra bulunabilir' },
  { id: 'dream_silk', name: 'Rüya İpliği', category: 'spirit', sourceHint: 'Ruh dokuması sırasında nadiren oluşur' }
]

/** Müze kategori etiketleri */
export const MUSEUM_CATEGORIES = [
  { key: 'ore' as const, label: 'Maden' },
  { key: 'gem' as const, label: 'Değerli Taş' },
  { key: 'bar' as const, label: 'Külçe' },
  { key: 'fossil' as const, label: 'Fosil' },
  { key: 'artifact' as const, label: 'Eski Eşya' },
  { key: 'spirit' as const, label: 'Ruhani Nesne' }
]

/** Müze kilometre taşı ödülleri */
export const MUSEUM_MILESTONES: MuseumMilestone[] = [
  { count: 5, name: 'Yola İlk Adım', reward: { money: 300 } },
  { count: 10, name: 'Küçük Koleksiyon', reward: { money: 500, items: [{ itemId: 'ancient_seed', quantity: 1 }] } },
  { count: 15, name: 'Maden Bilgesi', reward: { money: 1000 } },
  { count: 20, name: 'Geçmişin İzini Süren', reward: { money: 1500, items: [{ itemId: 'prismatic_shard', quantity: 1 }] } },
  { count: 25, name: 'Emanet Bekçisi', reward: { money: 3000 } },
  { count: 30, name: 'Kadim Sır Avcısı', reward: { money: 5000, items: [{ itemId: 'iridium_bar', quantity: 3 }] } },
  { count: 36, name: 'Müzenin Yıldızı', reward: { money: 10000 } },
  { count: 40, name: 'Ruhların Bilgesi', reward: { money: 8000, items: [{ itemId: 'moonstone', quantity: 3 }] } }
]

/** ID ile müze nesnesi bul */
export const getMuseumItemById = (id: string): MuseumItemDef | undefined =>
  MUSEUM_ITEMS.find(item => item.id === id)
