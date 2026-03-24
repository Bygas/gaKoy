<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-40">
    <div class="game-panel max-w-md w-full">
      <h3 class="text-accent text-sm mb-2">{{ SKILL_NAMES[skillType] }} {{ level }}. seviyeye ulaştı!</h3>
      <p class="text-xs text-muted mb-4">Bir ustalık yolu seç:</p>

      <div class="flex flex-col space-y-3">
        <button
          v-for="option in options"
          :key="option.id"
          class="btn text-xs text-left flex flex-col space-y-1 py-3"
          @click="handleSelect(option.id)"
        >
          <span class="text-accent">{{ option.name }}</span>
          <span class="text-muted">{{ option.description }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { SkillType, SkillPerk5, SkillPerk10 } from '@/types'
  import { useSkillStore } from '@/stores/useSkillStore'

  const props = defineProps<{
    skillType: SkillType
    level: 5 | 10
  }>()

  const emit = defineEmits<{
    select: [perk: SkillPerk5 | SkillPerk10]
  }>()

  const skillStore = useSkillStore()

  const SKILL_NAMES: Record<SkillType, string> = {
    farming: 'Çiftçilik',
    foraging: 'Toplayıcılık',
    fishing: 'Balıkçılık',
    mining: 'Madencilik',
    combat: 'Dövüş'
  }

  interface PerkOption {
    id: SkillPerk5 | SkillPerk10
    name: string
    description: string
  }

  const PERK5_OPTIONS: Record<SkillType, PerkOption[]> = {
    farming: [
      { id: 'harvester', name: 'Bereket Eri', description: 'Ürün satış değeri +%10' },
      { id: 'rancher', name: 'Sürü Eri', description: 'Hayvansal ürünlerin satış değeri +%20' }
    ],
    foraging: [
      { id: 'lumberjack', name: 'Oduncu', description: 'Toplayıcılıkta %25 olasılıkla fazladan odun kazanırsın' },
      { id: 'herbalist', name: 'Otacı', description: 'Toplanabilir eşya bulma olasılığı +%20' }
    ],
    fishing: [
      { id: 'fisher', name: 'Balıkçı', description: 'Balık satış değeri +%25' },
      { id: 'trapper', name: 'Tuzakçı', description: 'Balık çırpınırken başarı oranı +%15' }
    ],
    mining: [
      { id: 'miner', name: 'Madenci', description: '%50 olasılıkla cevher +1' },
      { id: 'geologist', name: 'Yerbilimci', description: 'Nadir cevher bulma olasılığı büyük ölçüde artar' }
    ],
    combat: [
      { id: 'fighter', name: 'Cenk Eri', description: 'Alınan hasar -%15, azami can +25' },
      { id: 'defender', name: 'Koruyucu', description: 'Savunurken 5 can yenilersin' }
    ]
  }

  /** 10. seviye ustalıkları, 5. seviye yoluna göre dallanır */
  const PERK10_BRANCHES: Record<SkillType, Record<string, PerkOption[]>> = {
    farming: {
      harvester: [
        { id: 'artisan', name: 'El Ustası', description: 'İşlenmiş ürünlerin satış değeri +%25' },
        { id: 'intensive', name: 'Sıkı Ekim', description: 'Hasatta %20 olasılıkla iki kat ürün' }
      ],
      rancher: [
        { id: 'coopmaster', name: 'Ağıl Ustası', description: 'Hayvan yakınlığı kazanımı +%50' },
        { id: 'shepherd', name: 'Çoban', description: 'Hayvansal ürün kalitesi bir kademe yükselir' }
      ]
    },
    foraging: {
      lumberjack: [
        { id: 'forester', name: 'Ormancı', description: 'Toplayıcılıkta her zaman fazladan odun kazanırsın' },
        { id: 'tracker', name: 'İz Eri', description: 'Her toplayışta fazladan 1 eşya kazanırsın' }
      ],
      herbalist: [
        { id: 'botanist', name: 'Bitki Bilgini', description: 'Topladığın otlar ve bitkiler her zaman iyi kalitede olur' },
        { id: 'alchemist', name: 'İksirci', description: 'Yiyeceklerin iyileştirme gücü +%50' }
      ]
    },
    fishing: {
      fisher: [
        { id: 'angler', name: 'Olta Ustası', description: 'Efsane balıkların görünme olasılığı büyük ölçüde artar' },
        { id: 'aquaculture', name: 'Su Ürünleri Eri', description: 'Balık satış değeri +%50' }
      ],
      trapper: [
        { id: 'mariner', name: 'Deniz Eri', description: 'Tuttuğun balık en az iyi kalite olur' },
        { id: 'luremaster', name: 'Yem Ustası', description: 'Yem etkisi iki katına çıkar' }
      ]
    },
    mining: {
      miner: [
        { id: 'prospector', name: 'Damar Avcısı', description: 'Cevherde %15 olasılıkla iki kat kazanç' },
        { id: 'blacksmith', name: 'Demirci', description: 'Metal cevherlerin satış değeri +%50' }
      ],
      geologist: [
        { id: 'excavator', name: 'Kazıcı', description: 'Bomba kullanırken %30 olasılıkla bomba harcanmaz' },
        { id: 'mineralogist', name: 'Taş Bilgini', description: 'Yendiğin yaratıklar fazladan cevher düşürür' }
      ]
    },
    combat: {
      fighter: [
        { id: 'warrior', name: 'Savaşçı', description: 'Azami can +40' },
        { id: 'brute', name: 'Kol Gücü', description: 'Saldırı hasarı +%25' }
      ],
      defender: [
        { id: 'acrobat', name: 'Çevik Eri', description: '%25 olasılıkla sıyrılıp karşı vuruş yaparsın' },
        { id: 'tank', name: 'Zırhlı', description: 'Savunurken hasar %70 azalır' }
      ]
    }
  }

  const options = computed<PerkOption[]>(() => {
    if (props.level === 5) return PERK5_OPTIONS[props.skillType]
    // 10. seviye: 5. seviyede seçilen ustalığa göre dal belirlenir
    const perk5 = skillStore.getSkill(props.skillType).perk5
    if (perk5) {
      const branches = PERK10_BRANCHES[props.skillType]
      return branches[perk5] ?? []
    }
    return []
  })

  const handleSelect = (perkId: SkillPerk5 | SkillPerk10) => {
    emit('select', perkId)
  }
</script>
