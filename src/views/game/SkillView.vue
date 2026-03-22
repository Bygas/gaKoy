<template>
  <div>
    <h3 class="text-accent text-sm mb-3">
      <Star :size="14" class="inline" />
      Hünerler
    </h3>
    <div class="space-y-3">
      <div v-for="skill in skillStore.skills" :key="skill.type" class="game-panel">
        <!-- Başlık satırı: simge + ad seviye + deneyim -->
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center space-x-1.5">
            <component :is="SKILL_ICONS[skill.type]" :size="14" class="text-accent" />
            <span class="text-sm">{{ SKILL_NAMES[skill.type] }}</span>
            <span class="text-xs text-accent">Sv.{{ skill.level }}</span>
          </div>
          <p v-if="expInfo(skill.type)" class="text-[10px] text-muted">
            {{ expInfo(skill.type)!.current }}/{{ expInfo(skill.type)!.required }}
          </p>
          <span v-else class="text-[10px] text-accent border border-accent/30 rounded-xs px-1">SON</span>
        </div>

        <!-- Deneyim çubuğu -->
        <div class="bg-bg rounded-xs h-1.5 mb-2">
          <div class="h-full bg-accent rounded-xs transition-all" :style="{ width: expPercent(skill.type) + '%' }" />
        </div>

        <!-- Tanıtım + her seviye artısı -->
        <div class="border border-accent/20 rounded-xs px-2 py-1.5 mb-2">
          <p class="text-[10px] text-muted leading-relaxed">{{ SKILL_DESCS[skill.type] }}</p>
          <p class="text-[10px] text-muted mt-0.5">Her seviye: güç tüketimi -%1, {{ SKILL_LEVEL_BONUS[skill.type] }}</p>
        </div>

        <!-- Ustalık yolu -->
        <div v-if="skill.perk5 || skill.perk10" class="flex flex-col space-y-1">
          <div v-if="skill.perk5" class="flex items-center space-x-1.5 border border-water rounded-xs px-2 py-1">
            <span class="text-[10px] text-water shrink-0">Sv5</span>
            <span class="text-xs text-water shrink-0">{{ PERK_NAMES[skill.perk5] }}</span>
            <span class="text-[10px] text-muted">{{ PERK_DESCS[skill.perk5] }}</span>
          </div>
          <div v-if="skill.perk10" class="flex items-center space-x-1.5 border border-water rounded-xs px-2 py-1">
            <span class="text-[10px] text-water shrink-0">Sv10</span>
            <span class="text-xs text-water shrink-0">{{ PERK_NAMES[skill.perk10] }}</span>
            <span class="text-[10px] text-muted">{{ PERK_DESCS[skill.perk10] }}</span>
          </div>
        </div>
        <p v-else-if="skill.level < 5" class="text-[10px] text-muted">Sv5 / Sv10 olduğunda bir ustalık yolu seçebilirsin</p>
        <p v-else class="text-[10px] text-muted">Sv{{ !skill.perk5 ? 5 : 10 }} olduğunda bir ustalık yolu seçebilirsin</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component } from 'vue'
  import { Star, Wheat, TreePine, Fish, Pickaxe, Sword } from 'lucide-vue-next'
  import { useSkillStore } from '@/stores/useSkillStore'
  import type { SkillType, SkillPerk5, SkillPerk10 } from '@/types'

  const skillStore = useSkillStore()

  const SKILL_ICONS: Record<SkillType, Component> = {
    farming: Wheat,
    foraging: TreePine,
    fishing: Fish,
    mining: Pickaxe,
    combat: Sword
  }

  const SKILL_NAMES: Record<SkillType, string> = {
    farming: 'Çiftçilik',
    foraging: 'Toplayıcılık',
    fishing: 'Balıkçılık',
    mining: 'Madencilik',
    combat: 'Dövüş'
  }

  const SKILL_DESCS: Record<SkillType, string> = {
    farming: 'Ekin yetiştirir, mahsul kaldırırsın. Seviye yükseldikçe ürün niteliği artar.',
    foraging: 'Kırdan nimet toplar, odun kesersin. Seviye yükseldikçe topladıklarının niteliği artar.',
    fishing: 'Çeşitli sularda balık tutarsın. Seviye yükseldikçe balık avı başarısı artar.',
    mining: 'Maden içinde cevher çıkarır ve dövüşürsün. Seviye yükseldikçe cevher verimi artar.',
    combat: 'Maden içindeki yaratıklarla dövüşürsün. Seviye yükseldikçe can sınırın artar.'
  }

  const SKILL_LEVEL_BONUS: Record<SkillType, string> = {
    farming: 'ürün niteliği ihtimali artar',
    foraging: 'toplanan nimetin niteliği ihtimali artar',
    fishing: 'balık avı başarısı artar',
    mining: 'cevher verimi artar',
    combat: 'can sınırı +5'
  }

  const PERK_DESCS: Record<SkillPerk5 | SkillPerk10, string> = {
    harvester: 'Mahsul satış bedeli +%10',
    rancher: 'Hayvansal ürün satış bedeli +%20',
    lumberjack: 'Toplarken %25 olasılıkla fazladan odun gelir',
    herbalist: 'Toplama nimeti bulma ihtimali +%20',
    fisher: 'Balık satış bedeli +%25',
    trapper: 'Balık çekiştirme başarısı +%15',
    miner: '%50 olasılıkla cevher +1',
    geologist: 'Nadir cevher ihtimali büyük ölçüde artar',
    fighter: 'Alınan yara %15 azalır, can sınırı +25',
    defender: 'Savunurken 5 can yenilenir',
    intensive: '%20 olasılıkla çift hasat',
    artisan: 'İşlenmiş ürün satış bedeli +%25',
    coopmaster: 'Hayvan yakınlığı kazanımı +%50',
    shepherd: 'Hayvansal ürün niteliği bir kademe artar',
    forester: 'Toplarken kesinlikle fazladan odun gelir',
    tracker: 'Her toplamaya fazladan +1 eşya',
    botanist: 'Toplanan nimet niteliği kesinlikle iyi olur',
    alchemist: 'Yemek yenileme etkisi +%50',
    angler: 'Efsane balık görünme ihtimali büyük ölçüde artar',
    aquaculture: 'Balık satış bedeli +%50',
    mariner: 'Tutulan balığın niteliği en az iyi olur',
    luremaster: 'Yemin etkisi iki katına çıkar',
    prospector: '%15 olasılıkla cevher iki kat gelir',
    blacksmith: 'Metal cevher satış bedeli +%50',
    excavator: 'Bomba kullanırken %30 olasılıkla harcanmaz',
    mineralogist: 'Yaratık yenince fazladan cevher düşer',
    warrior: 'Can sınırı +40',
    brute: 'Saldırı hasarı +%25',
    acrobat: '%25 olasılıkla sıyrılıp karşı vurursun',
    tank: 'Savunurken hasar azaltımı %70'
  }

  const PERK_NAMES: Record<SkillPerk5 | SkillPerk10, string> = {
    harvester: 'Bereketçi',
    rancher: 'Sürü Eri',
    lumberjack: 'Baltacı',
    herbalist: 'Otacı',
    fisher: 'Balıkçı',
    trapper: 'Tuzakçı',
    miner: 'Madenci',
    geologist: 'Taş Bilicisi',
    fighter: 'Dövüşçü',
    defender: 'Koruyucu',
    intensive: 'Sık Ekim',
    artisan: 'Usta El',
    coopmaster: 'Ağıl Beyi',
    shepherd: 'Çoban',
    botanist: 'Bitki Bilicisi',
    alchemist: 'İksirci',
    forester: 'Orman Eri',
    tracker: 'İz Sürücü',
    angler: 'Olta Pir’i',
    aquaculture: 'Su Tüccarı',
    mariner: 'Gemi Eri',
    luremaster: 'Yem Ustası',
    prospector: 'Maden Arayıcı',
    blacksmith: 'Demirci',
    excavator: 'Kazıcı',
    mineralogist: 'Cevher Bilicisi',
    warrior: 'Alp',
    brute: 'Yaman Güç',
    acrobat: 'Çevik Usta',
    tank: 'Zırhlı Er'
  }

  const expInfo = (type: SkillType) => {
    return skillStore.getExpToNextLevel(type)
  }

  const expPercent = (type: SkillType): number => {
    const info = skillStore.getExpToNextLevel(type)
    if (!info) return 100
    return Math.round((info.current / info.required) * 100)
  }
</script>
