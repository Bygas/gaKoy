<template>
  <div class="game-panel max-w-sm w-full">
    <h3 class="text-accent text-sm mb-3 flex items-center space-x-1">
      <Wheat :size="14" />
      <span>Ürün Şenliği</span>
    </h3>

    <!-- Sergi eşyası seçimi -->
    <div v-if="!submitted">
      <p class="text-xs text-muted mb-3">
        Heybenden en çok
        <span class="text-accent">5</span>
        parça sergilik seç. Kalitesi yüksek, değeri yüksek eşya daha çok puan getirir!
      </p>

      <!-- Seçilen sergilikler -->
      <div class="mb-3">
        <p class="text-xs text-muted mb-1">Seçilen sergilikler ({{ selectedItems.length }} / 5):</p>
        <div v-if="selectedItems.length === 0" class="flex flex-col items-center py-4 text-muted">
          <Package :size="28" class="mb-1.5 opacity-40" />
          <p class="text-xs">Henüz hiçbir eşya seçilmedi</p>
          <p class="text-xs opacity-60">Aşağıdaki listeden sergiliğini seç</p>
        </div>
        <div v-else class="flex flex-col space-y-1.5">
          <button
            v-for="(sel, i) in selectedItems"
            :key="i"
            class="border border-accent/20 rounded-xs px-2 py-1.5 text-xs flex items-center justify-between hover:border-danger/50 transition-colors"
            :title="'Kaldırmak için tıkla'"
            @click="removeSelection(i)"
          >
            <span class="truncate" :class="qualityClass(sel.quality)">{{ getItemById(sel.itemId)?.name }}</span>
            <span class="flex items-center space-x-2 shrink-0 ml-2">
              <span class="text-muted">{{ getItemById(sel.itemId)?.sellPrice }} akçe</span>
              <span class="text-danger">Kaldır</span>
            </span>
          </button>
        </div>
      </div>

      <p class="text-xs text-muted mb-1">
        Görünen toplam puan:
        <span class="text-accent">{{ previewScore }}</span>
      </p>

      <!-- Heybeden eşya seçimi -->
      <div class="mb-3">
        <p class="text-xs text-muted mb-1">Seçilebilir eşyalar:</p>
        <div v-if="selectableItems.length === 0" class="flex flex-col items-center py-4 text-muted">
          <Package :size="28" class="mb-1.5 opacity-40" />
          <p class="text-xs">Heybende sergiye uygun eşya yok</p>
          <p class="text-xs opacity-60">Tarla ürünü, balık, taş, işlenmiş eşya ve benzerleri sergilenebilir</p>
        </div>
        <div v-else class="flex flex-col space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            v-for="item in selectableItems"
            :key="item.itemId + item.quality"
            class="border border-accent/20 rounded-xs px-2 py-1.5 text-xs flex items-center justify-between hover:border-accent/50 transition-colors"
            :disabled="selectedItems.length >= 5"
            @click="addSelection(item)"
          >
            <span class="truncate" :class="qualityClass(item.quality)">{{ getItemById(item.itemId)?.name }}</span>
            <span class="flex items-center space-x-2 shrink-0 ml-2">
              <span class="text-muted">×{{ item.quantity }}</span>
              <span class="text-muted">{{ getItemById(item.itemId)?.sellPrice }} akçe</span>
            </span>
          </button>
        </div>
      </div>

      <div class="flex space-x-2">
        <Button class="flex-1" :disabled="selectedItems.length === 0" @click="handleSubmit">Sergiye koy!</Button>
        <Button class="flex-1 opacity-60 hover:opacity-100" @click="handleQuit">Vazgeç</Button>
      </div>
    </div>

    <!-- Sonuç aşaması -->
    <div v-else>
      <p class="text-xs text-muted mb-2">Değerlendirme bitti!</p>

      <div class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Son sıralama:</p>
        <div
          v-for="(entry, i) in rankings"
          :key="entry.name"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <div>
            <span
              class="mr-2"
              :class="{
                'text-accent': i === 0,
                'text-success': entry.name === 'Sen'
              }"
            >
              {{ i + 1 }}. sıra
            </span>
            <span :class="{ 'text-success': entry.name === 'Sen' }">{{ entry.name }}</span>
          </div>
          <span class="text-muted">{{ entry.score }} puan</span>
        </div>
      </div>

      <!-- Sergi ayrıntısı -->
      <div class="border border-accent/20 p-2 mb-3">
        <p class="text-xs text-muted mb-1">Senin sergiliklerin:</p>
        <div
          v-for="(d, i) in scoreDetails"
          :key="i"
          class="flex items-center justify-between text-xs py-0.5 border-b border-accent/10 last:border-0"
        >
          <span :class="qualityClass(d.quality) || 'text-accent'">{{ d.name }}</span>
          <span class="text-muted">{{ d.basePrice }} akçe × {{ d.multiplier }} = {{ d.score }} puan</span>
        </div>
        <div class="flex items-center justify-between text-xs mt-1.5 pt-1 border-t border-accent/20">
          <span class="text-muted">Toplam puan</span>
          <span class="text-accent">{{ playerScore }} puan</span>
        </div>
      </div>

      <div class="mb-3 text-xs text-center border border-accent/20 p-2">
        <span v-if="playerRank === 1" class="text-accent">Kutlu olsun, altın ödülü aldın! Ödül 1000 akçe</span>
        <span v-else-if="playerRank === 2" class="text-success">Gümüş ödül senin! Ödül 500 akçe</span>
        <span v-else-if="playerRank === 3" class="text-success">Tunç ödül aldın! Ödül 200 akçe</span>
        <span v-else class="text-muted">Bu kez sıralamaya giremedin. Seneye yine gel!</span>
      </div>

      <Button class="w-full" @click="handleClaim">Ödülü Al</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Wheat, Package } from 'lucide-vue-next'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { getItemById } from '@/data'
  import type { Quality } from '@/types'
  import {
    sfxRewardClaim,
    sfxItemSelect,
    sfxJudging,
    sfxMiniFail,
    sfxRankFirst,
    sfxRankSecond,
    sfxRankThird,
    sfxRankLose
  } from '@/composables/useAudio'
  import Button from '@/components/game/Button.vue'

  const emit = defineEmits<{
    complete: [prize: number]
  }>()

  const inventoryStore = useInventoryStore()

  const QUALITY_MULTIPLIERS: Record<Quality, number> = {
    normal: 1,
    fine: 1.25,
    excellent: 1.5,
    supreme: 2
  }

  interface SelectedItem {
    itemId: string
    quality: Quality
  }

  interface ScoreDetail {
    name: string
    quality: Quality
    basePrice: number
    multiplier: number
    score: number
  }

  interface Participant {
    name: string
    score: number
  }

  const selectedItems = ref<SelectedItem[]>([])
  const submitted = ref(false)
  const rankings = ref<Participant[]>([])
  const scoreDetails = ref<ScoreDetail[]>([])
  const playerScore = ref(0)

  /** Sergiye uygun heybede bulunan eşyalar */
  const selectableItems = computed(() => {
    const exhibitCategories = ['crop', 'fish', 'food', 'processed', 'gem', 'misc']
    return inventoryStore.items.filter(item => {
      const def = getItemById(item.itemId)
      return def && exhibitCategories.includes(def.category)
    })
  })

  /** Şu anki seçime göre görünen toplam puan */
  const previewScore = computed(() => {
    return selectedItems.value.reduce((sum, sel) => {
      const def = getItemById(sel.itemId)
      if (!def) return sum
      const mult = QUALITY_MULTIPLIERS[sel.quality]
      return sum + Math.round(def.sellPrice * mult)
    }, 0)
  })

  const playerRank = computed(() => {
    const idx = rankings.value.findIndex(e => e.name === 'Sen')
    return idx === -1 ? 99 : idx + 1
  })

  const qualityClass = (quality: Quality): string => {
    const classes: Record<Quality, string> = {
      normal: '',
      fine: 'text-quality-fine',
      excellent: 'text-quality-excellent',
      supreme: 'text-quality-supreme'
    }
    return classes[quality]
  }

  const addSelection = (item: { itemId: string; quality: Quality }) => {
    if (selectedItems.value.length >= 5) return
    sfxItemSelect()
    selectedItems.value.push({ itemId: item.itemId, quality: item.quality })
  }

  const removeSelection = (index: number) => {
    sfxMiniFail()
    selectedItems.value.splice(index, 1)
  }

  const handleSubmit = () => {
    if (selectedItems.value.length === 0) return
    sfxJudging()

    // Oyuncu puan ayrıntısını hesapla
    const details: ScoreDetail[] = []
    let total = 0
    for (const sel of selectedItems.value) {
      const def = getItemById(sel.itemId)
      if (!def) continue
      const mult = QUALITY_MULTIPLIERS[sel.quality]
      const score = Math.round(def.sellPrice * mult)
      total += score
      details.push({
        name: def.name,
        quality: sel.quality,
        basePrice: def.sellPrice,
        multiplier: mult,
        score
      })
    }
    scoreDetails.value = details
    playerScore.value = total

    // Köylü puanları (600-1200 arası)
    const npcs: Participant[] = [
      { name: 'Gökçe', score: Math.round(600 + Math.random() * 600) },
      { name: 'Demir Enişte', score: Math.round(600 + Math.random() * 600) },
      { name: 'Yel Ana', score: Math.round(600 + Math.random() * 600) }
    ]

    const player: Participant = { name: 'Sen', score: total }
    const all = [...npcs, player]
    all.sort((a, b) => b.score - a.score)
    rankings.value = all
    submitted.value = true

    // Sıralama sesi
    const rank = all.findIndex(e => e.name === 'Sen') + 1
    setTimeout(() => {
      if (rank === 1) sfxRankFirst()
      else if (rank === 2) sfxRankSecond()
      else if (rank === 3) sfxRankThird()
      else sfxRankLose()
    }, 300)
  }

  const handleQuit = () => {
    emit('complete', 0)
  }

  const handleClaim = () => {
    sfxRewardClaim()
    const prizes: Record<number, number> = { 1: 1000, 2: 500, 3: 200 }
    const prize = prizes[playerRank.value] ?? 0
    emit('complete', prize)
  }
</script>
