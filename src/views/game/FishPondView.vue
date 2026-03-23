<template>
  <div>
    <!-- Başlık -->
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center space-x-1.5 text-sm text-accent">
        <Waves :size="14" />
        <span>Balık Havuzu</span>
      </div>
      <span v-if="!fishPondStore.pond.built" class="text-xs text-muted">{{ fishPondStore.fishCount }}/{{ fishPondStore.capacity }}</span>
    </div>

    <!-- İnşa edilmemiş -->
    <div v-if="!fishPondStore.pond.built" class="border border-accent/10 rounded-xs py-6 flex flex-col items-center space-y-2">
      <Waves :size="32" class="text-muted/30" />
      <p class="text-xs text-muted">Balık havuzu henüz kurulmadı</p>
      <p class="text-xs text-muted/60">Havuz kurulduğunda balık yetiştirip çoğaltabilir, ürün toplayabilirsin</p>
      <Button :icon="Hammer" :icon-size="12" @click="pondModal = 'build'">Havuz Kur</Button>
    </div>

    <!-- İnşa edilmiş -->
    <template v-else>
      <!-- İki sekme -->
      <div class="flex space-x-1 mb-3">
        <Button class="flex-1 justify-center" :class="{ '!bg-accent !text-bg': currentTab === 'pond' }" @click="currentTab = 'pond'">
          Havuz
        </Button>
        <Button
          class="flex-1 justify-center"
          :class="{ '!bg-accent !text-bg': currentTab === 'compendium' }"
          @click="currentTab = 'compendium'"
        >
          Defter {{ fishPondStore.discoveredBreeds.size }}/{{ totalBreedCount }}
        </Button>
      </div>

      <!-- ===== Havuz Sekmesi ===== -->
      <template v-if="currentTab === 'pond'">
        <!-- Durum özeti -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-1.5">
            <Divider>Balık Havuzu Sv.{{ fishPondStore.pond.level }}</Divider>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-muted">{{ fishPondStore.fishCount }}/{{ fishPondStore.capacity }}</span>
              <Button v-if="fishPondStore.pond.level < 3" :icon="ArrowUp" :icon-size="12" @click="pondModal = 'upgrade'">Yükselt</Button>
            </div>
          </div>

          <!-- Su kalitesi çubuğu -->
          <div class="border border-accent/20 rounded-xs px-3 py-2">
            <div class="flex items-center space-x-2 mb-1.5">
              <span class="text-xs text-muted shrink-0">Su Kalitesi</span>
              <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                <div
                  class="h-full rounded-xs transition-all"
                  :class="waterQualityColor"
                  :style="{ width: fishPondStore.pond.waterQuality + '%' }"
                />
              </div>
              <span class="text-xs whitespace-nowrap" :class="waterQualityTextColor">{{ fishPondStore.pond.waterQuality }}%</span>
            </div>
            <!-- İşlem düğmeleri -->
            <div class="flex flex-wrap space-x-1">
              <Button
                :icon="Droplets"
                :icon-size="12"
                :disabled="fishPondStore.pond.fedToday || fishPondStore.pond.fish.length === 0"
                @click="handleFeed"
              >
                {{ fishPondStore.pond.fedToday ? 'Bugün Yem Verildi' : 'Yem Ver' }}
              </Button>
              <Button :icon="Sparkles" :icon-size="12" @click="handleClean">Suyu Arıt</Button>
              <Button v-if="fishPondStore.sickFish.length > 0" :icon="HeartPulse" :icon-size="12" @click="handleTreat">
                Tedavi Et ({{ fishPondStore.sickFish.length }})
              </Button>
              <Button
                v-if="fishPondStore.pendingProducts.length > 0"
                :icon="Package"
                :icon-size="12"
                :disabled="fishPondStore.pond.collectedToday"
                @click="handleCollect"
              >
                Topla ({{ fishPondStore.pendingProducts.length }})
              </Button>
            </div>
          </div>
        </div>

        <!-- Havuzdaki balıklar -->
        <div class="mb-3">
          <Divider label="Havuzdaki Balıklar" />

          <!-- Boş durum -->
          <div
            v-if="fishPondStore.pond.fish.length === 0"
            class="border border-accent/10 rounded-xs py-6 flex flex-col items-center space-y-2"
          >
            <Fish :size="32" class="text-muted/30" />
            <p class="text-xs text-muted">Havuz bomboş</p>
            <p class="text-xs text-muted/60">Çantadan yavru balık koyup yetiştirmeye başla</p>
          </div>

          <!-- Balık listesi -->
          <div v-else class="flex flex-col space-y-1.5 max-h-80 overflow-auto">
            <div
              v-for="fish in fishPondStore.pond.fish"
              :key="fish.id"
              class="border rounded-xs px-3 py-2 cursor-pointer hover:bg-accent/5 transition-colors mr-1"
              :class="
                fish.sick ? 'border-danger/30' : selectedBreedingFish?.id === fish.id ? 'border-accent bg-accent/10' : 'border-accent/20'
              "
              @click="openFishDetail(fish)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-1.5">
                  <Waves v-if="fish.mature && !fish.sick" :size="12" class="text-success" />
                  <HeartPulse v-else-if="fish.sick" :size="12" class="text-danger" />
                  <Fish v-else :size="12" class="text-muted/40" />
                  <span class="text-xs" :class="fish.sick ? 'text-danger' : fish.mature ? 'text-text' : 'text-muted'">
                    {{ fish.name }}
                  </span>
                  <span v-if="fish.sick" class="text-[10px] text-danger">[Hasta]</span>
                  <span v-if="!fish.mature" class="text-[10px] text-muted">[Yavru]</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] text-accent flex items-center space-x-px">
                    <Star v-for="n in fishPondStore.getGeneticStarRating(fish.genetics)" :key="n" :size="10" />
                  </span>
                  <span class="text-[10px] text-muted">{{ fish.daysInPond }} gün</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yavru balık ekleme -->
        <div class="mb-3">
          <Divider label="Yavru Balık Ekle" />
          <div v-if="pondableFishInBag.length > 0" class="flex flex-col space-y-1.5 max-h-80 overflow-auto">
            <div
              v-for="item in pondableFishInBag"
              :key="item.itemId"
              class="border border-accent/20 rounded-xs px-3 py-2 flex items-center justify-between mr-1"
            >
              <span class="text-xs">
                {{ item.name }}
                <span class="text-muted">&times;{{ item.count }}</span>
              </span>
              <Button :icon-size="12" @click="handleAddFish(item.itemId)">Ekle</Button>
            </div>
          </div>
          <div v-else class="border border-accent/10 rounded-xs py-6 flex flex-col items-center space-y-2">
            <Package :size="32" class="text-muted/30" />
            <p class="text-xs text-muted">Çantada havuza uygun balık yok</p>
            <p class="text-xs text-muted/60">gaKöy deresinde balık tutup buraya yerleştirebilirsin</p>
          </div>
        </div>

        <!-- Üreme -->
        <div class="mb-3">
          <Divider label="Üreme" />
          <!-- Üreme sürüyor -->
          <div v-if="fishPondStore.pond.breeding" class="border border-accent/20 rounded-xs px-3 py-2">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center space-x-1.5">
                <Heart :size="12" class="text-accent" />
                <span class="text-xs text-accent">Üreme Sürüyor</span>
              </div>
              <span class="text-xs text-muted">{{ fishPondStore.pond.breeding.daysLeft }}/{{ breedingTotalDays }} gün</span>
            </div>
            <div class="h-1 bg-bg rounded-xs border border-accent/10">
              <div class="h-full rounded-xs bg-accent transition-all" :style="{ width: breedingProgress + '%' }" />
            </div>
            <p class="text-[10px] text-muted mt-1">Tür: {{ getPondableFishName(fishPondStore.pond.breeding.fishId) }}</p>
          </div>
          <!-- Bir ebeveyn seçilmiş -->
          <div v-else-if="selectedBreedingFish" class="border border-accent/20 rounded-xs px-3 py-2">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center space-x-1.5">
                <Heart :size="12" class="text-muted/40" />
                <span class="text-xs">
                  Seçilen: {{ selectedBreedingFish.name }}
                  <span class="text-accent inline-flex items-center space-x-px">
                    <Star v-for="n in fishPondStore.getGeneticStarRating(selectedBreedingFish.genetics)" :key="n" :size="10" />
                  </span>
                </span>
              </div>
              <Button @click="selectedBreedingFish = null">Vazgeç</Button>
            </div>
            <p class="text-[10px] text-muted">Balık listesinden aynı türde yetişkin bir balığı eş olarak seç</p>
          </div>
          <!-- Boş durum -->
          <div v-else class="border border-accent/10 rounded-xs py-6 flex flex-col items-center space-y-2">
            <Heart :size="32" class="text-muted/30" />
            <p class="text-xs text-muted">Üreme için aynı türden iki yetişkin balık seç</p>
            <p class="text-xs text-muted/60">Havuzda boş yer bulunmalı</p>
          </div>
        </div>
      </template>

      <!-- ===== Defter Sekmesi ===== -->
      <template v-if="currentTab === 'compendium'">
        <!-- Nesil filtresi -->
        <div class="grid grid-cols-5 space-x-1 mb-2">
          <Button
            v-for="g in 5"
            :key="g"
            class="grow shrink-0 basis-[calc(20%-3px)] justify-center"
            :class="{ '!bg-accent !text-bg': compendiumGen === g }"
            @click="compendiumGen = g as 1 | 2 | 3 | 4 | 5"
          >
            {{ g }}. Nesil
          </Button>
        </div>

        <!-- İlerleme -->
        <p class="text-xs text-muted mb-2">Bulunan {{ discoveredCountByGen(compendiumGen) }}/{{ BREED_COUNTS[compendiumGen] }}</p>

        <!-- İpucu -->
        <div v-if="compendiumGen > 1" class="border border-accent/10 rounded-xs p-2 mb-2">
          <p class="text-xs text-muted leading-relaxed">
            <span class="text-accent">{{ compendiumGen }}. nesil</span>
            türleri, belirli
            <span class="text-accent">{{ compendiumGen - 1 }}. nesil</span>
            türlerin çiftleşmesiyle elde edilir.
          </p>
        </div>

        <!-- Tür ızgarası -->
        <div class="grid grid-cols-5 gap-1 p-2 max-h-[50vh] overflow-auto">
          <div
            v-for="breed in currentGenBreeds"
            :key="breed.breedId"
            class="border rounded-xs p-1.5 text-xs text-center transition-colors truncate"
            :class="isDiscovered(breed.breedId) ? 'border-accent/20 ' + genColor(compendiumGen) : 'border-accent/10 text-muted/30'"
          >
            <template v-if="isDiscovered(breed.breedId)">{{ breed.name }}</template>
            <Lock v-else :size="12" class="mx-auto text-muted/30" />
          </div>
        </div>

        <!-- Tamamlanma -->
        <div class="mt-3 border border-accent/20 rounded-xs p-2">
          <div class="flex items-center space-x-2 text-xs mb-1.5">
            <span class="text-xs text-muted shrink-0">Tamamlanma</span>
            <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
              <div class="h-full bg-accent rounded-xs transition-all" :style="{ width: completionPercent + '%' }" />
            </div>
            <span class="text-xs text-accent whitespace-nowrap">{{ fishPondStore.discoveredBreeds.size }}/{{ totalBreedCount }}</span>
          </div>
          <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <div v-for="g in 5" :key="g" class="flex items-center justify-between">
              <span class="text-xs text-muted">{{ g }}. Nesil</span>
              <span class="text-xs">{{ discoveredCountByGen(g) }}/{{ BREED_COUNTS[g] }}</span>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Balık detay penceresi -->
    <Transition name="panel-fade">
      <div v-if="detailFish" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="detailFish = null">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="detailFish = null">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">{{ detailFish.name }}</p>
          <p class="text-xs mb-2 flex items-center space-x-1">
            <span class="text-accent flex items-center space-x-px">
              <Star v-for="n in fishPondStore.getGeneticStarRating(detailFish.genetics)" :key="n" :size="10" />
            </span>
            <span class="text-muted">·</span>
            <span class="text-muted">{{ detailFish.daysInPond }}. gün</span>
            <span v-if="detailFish.sick" class="text-danger">· Hastalıklı</span>
            <span v-if="!detailFish.mature" class="text-muted">· Yetişkin değil</span>
          </p>

          <!-- Gen çubukları -->
          <div class="flex flex-col space-y-1 mb-3">
            <div v-for="attr in fishAttributes" :key="attr.key" class="flex items-center space-x-2">
              <span class="text-xs text-muted w-10 shrink-0">{{ attr.label }}</span>
              <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                <div class="h-full rounded-xs transition-all" :class="attr.barClass" :style="{ width: attr.value + '%' }" />
              </div>
              <span class="text-xs w-6 text-right">{{ attr.value }}</span>
            </div>
          </div>

          <!-- İşlem düğmeleri -->
          <div class="flex flex-col space-y-1">
            <Button
              v-if="detailFish.mature && !detailFish.sick"
              class="w-full justify-center"
              :class="{ '!bg-accent !text-bg': !fishPondStore.pond.breeding }"
              :icon="Heart"
              :icon-size="12"
              :disabled="!!fishPondStore.pond.breeding"
              @click="handleDetailBreed"
            >
              Ebeveyn Olarak Seç
            </Button>
            <Button class="w-full justify-center" :icon="ArrowUp" :icon-size="12" @click="handleDetailRemove">Çantaya Al</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Kurulum / yükseltme penceresi -->
    <Transition name="panel-fade">
      <div v-if="pondModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="pondModal = null">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="pondModal = null">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">{{ modalTitle }}</p>

          <!-- Seviye bilgisi -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">{{ pondModal === 'build' ? 'Seviye' : 'Mevcut seviye' }}</span>
              <span class="text-xs">Sv.{{ modalCurrentLevel }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">{{ pondModal === 'build' ? 'Başlangıç kapasitesi' : 'Mevcut kapasite' }}</span>
              <span class="text-xs">{{ modalCurrentCapacity }}</span>
            </div>
          </div>

          <!-- Yükseltmeden sonra bilgi -->
          <div v-if="pondModal === 'upgrade'" class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Yükselecek seviye</span>
              <span class="text-xs text-accent">Sv.{{ modalTargetLevel }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Yeni kapasite</span>
              <span class="text-xs text-accent">{{ modalTargetCapacity }}</span>
            </div>
          </div>

          <!-- Gerekli malzemeler -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted mb-1">Gerekli Malzemeler</p>
            <div v-for="mat in modalMaterials" :key="mat.itemId" class="flex items-center justify-between mt-0.5">
              <span class="text-xs">{{ mat.name }}</span>
              <span class="text-xs" :class="mat.enough ? 'text-success' : 'text-danger'">{{ mat.owned }}/{{ mat.required }}</span>
            </div>
          </div>

          <!-- Ücret -->
          <div class="border border-accent/10 rounded-xs p-2 mb-3">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Bedel</span>
              <span class="text-xs" :class="playerStore.money >= modalMoney ? 'text-accent' : 'text-danger'">{{ modalMoney }} akçe</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Elde olan</span>
              <span class="text-xs">{{ playerStore.money }} akçe</span>
            </div>
          </div>

          <Button
            class="w-full justify-center"
            :class="{ '!bg-accent !text-bg': canConfirmModal }"
            :icon="pondModal === 'build' ? Hammer : ArrowUp"
            :icon-size="12"
            :disabled="!canConfirmModal"
            @click="handleModalConfirm"
          >
            {{ pondModal === 'build' ? 'Kurulumu Onayla' : 'Yükseltmeyi Onayla' }}
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Waves, Droplets, Sparkles, HeartPulse, Package, ArrowUp, Hammer, Lock, Fish, Heart, X, Star } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import { useFishPondStore } from '@/stores/useFishPondStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { addLog, showFloat } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import { POND_BUILD_COST, POND_UPGRADE_COSTS, POND_CAPACITY, PONDABLE_FISH, getPondableFish, FISH_BREEDING_DAYS } from '@/data/fishPond'
  import { getBreedsByGeneration, BREED_COUNTS } from '@/data/pondBreeds'
  import { getItemById } from '@/data/items'
  import type { PondFish } from '@/types/fishPond'

  const fishPondStore = useFishPondStore()
  const inventoryStore = useInventoryStore()
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()

  const currentTab = ref<'pond' | 'compendium'>('pond')
  const selectedBreedingFish = ref<PondFish | null>(null)
  const detailFish = ref<PondFish | null>(null)
  const compendiumGen = ref<1 | 2 | 3 | 4 | 5>(1)

  /** Kurulum / yükseltme ortak pencere */
  const pondModal = ref<'build' | 'upgrade' | null>(null)

  const getItemName = (itemId: string): string => getItemById(itemId)?.name ?? itemId
  const getPondableFishName = (fishId: string): string => getPondableFish(fishId)?.name ?? fishId

  const totalBreedCount = 400

  const isDiscovered = (breedId: string): boolean => fishPondStore.discoveredBreeds.has(breedId)

  const discoveredCountByGen = (gen: number): number => {
    const breeds = getBreedsByGeneration(gen as 1 | 2 | 3 | 4 | 5)
    return breeds.filter(b => fishPondStore.discoveredBreeds.has(b.breedId)).length
  }

  const currentGenBreeds = computed(() => getBreedsByGeneration(compendiumGen.value))

  /** Defter tamamlama yüzdesi */
  const completionPercent = computed(() => {
    return Math.floor((fishPondStore.discoveredBreeds.size / totalBreedCount) * 100)
  })

  /** Nesil rengi */
  const genColor = (gen: number): string => {
    if (gen >= 5) return 'text-quality-supreme'
    if (gen >= 4) return 'text-quality-excellent'
    if (gen >= 3) return 'text-quality-fine'
    return 'text-accent'
  }

  /** Su kalitesi çubuğu rengi */
  const waterQualityColor = computed(() => {
    const wq = fishPondStore.pond.waterQuality
    if (wq >= 70) return 'bg-success'
    if (wq >= 30) return 'bg-accent'
    return 'bg-danger'
  })

  /** Su kalitesi yazı rengi */
  const waterQualityTextColor = computed(() => {
    const wq = fishPondStore.pond.waterQuality
    if (wq >= 70) return 'text-success'
    if (wq >= 30) return 'text-accent'
    return 'text-danger'
  })

  /** Üreme ilerlemesi */
  const breedingTotalDays = FISH_BREEDING_DAYS
  const breedingProgress = computed(() => {
    if (!fishPondStore.pond.breeding) return 0
    return ((breedingTotalDays - fishPondStore.pond.breeding.daysLeft) / breedingTotalDays) * 100
  })

  // === Kurulum / yükseltme ortak pencere ===

  const upgradeNextLevel = computed(() => Math.min(fishPondStore.pond.level + 1, 3) as 2 | 3)

  const modalTitle = computed(() => (pondModal.value === 'build' ? 'Balık Havuzu Kur' : 'Balık Havuzunu Yükselt'))

  const modalCurrentLevel = computed(() => (pondModal.value === 'build' ? 1 : fishPondStore.pond.level))

  const modalCurrentCapacity = computed(() => (pondModal.value === 'build' ? POND_CAPACITY[1] : fishPondStore.capacity))

  const modalTargetLevel = computed(() => upgradeNextLevel.value)

  const modalTargetCapacity = computed(() => POND_CAPACITY[upgradeNextLevel.value])

  const modalMoney = computed(() =>
    pondModal.value === 'build' ? POND_BUILD_COST.money : POND_UPGRADE_COSTS[upgradeNextLevel.value].money
  )

  const modalMaterials = computed(() => {
    const mats = pondModal.value === 'build' ? POND_BUILD_COST.materials : POND_UPGRADE_COSTS[upgradeNextLevel.value].materials
    return mats.map(m => ({
      itemId: m.itemId,
      name: getItemName(m.itemId),
      required: m.quantity,
      owned: inventoryStore.getItemCount(m.itemId),
      enough: inventoryStore.getItemCount(m.itemId) >= m.quantity
    }))
  })

  const canConfirmModal = computed(() => {
    if (playerStore.money < modalMoney.value) return false
    return modalMaterials.value.every(m => m.enough)
  })

  const handleModalConfirm = () => {
    if (pondModal.value === 'build') {
      if (fishPondStore.buildPond()) {
        addLog('Balık havuzu tamamlandı!')
        showFloat('Balık havuzu tamamlandı!', 'success')
        pondModal.value = null
      } else {
        addLog('Malzeme ya da akçe yetmiyor; havuz kurulamadı.')
      }
    } else {
      const nextLevel = (fishPondStore.pond.level + 1) as 2 | 3
      if (fishPondStore.upgradePond()) {
        addLog(`Balık havuzu Sv.${nextLevel} oldu! Kapasite arttı.`)
        showFloat(`Balık havuzu Sv.${nextLevel}`, 'success')
        pondModal.value = null
      } else {
        addLog('Malzeme ya da akçe yetmiyor; yükseltilemedi.')
      }
    }
  }

  /** Çantadaki havuza uygun balıklar */
  const pondableFishInBag = computed(() => {
    const result: { itemId: string; name: string; count: number }[] = []
    for (const def of PONDABLE_FISH) {
      const count = inventoryStore.getItemCount(def.fishId)
      if (count > 0) {
        result.push({ itemId: def.fishId, name: def.name, count })
      }
    }
    return result
  })

  /** Balık detay penceresi nitelik çubukları */
  const fishAttributes = computed(() => {
    if (!detailFish.value) return []
    const g = detailFish.value.genetics
    return [
      { key: 'weight', label: 'Ağırlık', value: g.weight, barClass: 'bg-accent' },
      { key: 'growthRate', label: 'Büyüme', value: g.growthRate, barClass: 'bg-success' },
      { key: 'diseaseRes', label: 'Direnç', value: g.diseaseRes, barClass: 'bg-water' },
      { key: 'qualityGene', label: 'Kalite', value: g.qualityGene, barClass: 'bg-quality-fine' },
      { key: 'mutationRate', label: 'Değişim', value: g.mutationRate, barClass: 'bg-danger' }
    ]
  })

  /** Balık detayını aç */
  const openFishDetail = (fish: PondFish) => {
    detailFish.value = fish
  }

  /** Pencereden üreme ebeveyni seç */
  const handleDetailBreed = () => {
    if (!detailFish.value) return
    handleSelectForBreeding(detailFish.value)
    detailFish.value = null
  }

  /** Pencereden çantaya çıkar */
  const handleDetailRemove = () => {
    if (!detailFish.value) return
    handleRemoveFish(detailFish.value.id)
    detailFish.value = null
  }

  // === İşlemler ===

  const handleFeed = () => {
    if (fishPondStore.feedFish()) {
      addLog('Havuzdaki balıklara yem verildi.')
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.feedFish)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else if (fishPondStore.pond.fedToday) {
      addLog('Bugün zaten yem verildi.')
    } else {
      addLog('Balık yemi yok, yemleme yapılamadı.')
    }
  }

  const handleClean = () => {
    if (fishPondStore.cleanPond()) {
      addLog('Su arıtıcıyla havuz temizlendi.')
      showFloat('+Su kalitesi', 'success')
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.cleanPond)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Su arıtıcı yok.')
    }
  }

  const handleTreat = () => {
    const count = fishPondStore.treatSickFish()
    if (count > 0) {
      addLog(`${count} hasta balık iyileştirildi.`)
      showFloat(`${count} balık iyileşti`, 'success')
    } else {
      addLog('İlaç yok ya da hasta balık bulunmuyor.')
    }
  }

  const handleCollect = () => {
    const products = fishPondStore.collectProducts()
    if (products.length > 0) {
      for (const p of products) {
        inventoryStore.addItem(p.itemId, 1, p.quality)
      }
      const names = products.map(p => getItemName(p.itemId)).join('、')
      addLog(`${names} toplandı.`)
      showFloat(`+${products.length} su ürünü`, 'success')
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.collectFishProducts)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Toplanacak ürün yok.')
    }
  }

  const handleAddFish = (fishId: string) => {
    const added = fishPondStore.addFish(fishId, 1)
    if (added > 0) {
      const name = getPondableFishName(fishId)
      addLog(`${added} adet ${name} havuza bırakıldı.`)
    } else if (fishPondStore.isFull) {
      addLog('Havuz dolu, daha fazla balık eklenemez.')
    } else {
      addLog('Çantada bu tür balık yok.')
    }
  }

  const handleRemoveFish = (pondFishId: string) => {
    if (fishPondStore.removeFish(pondFishId)) {
      addLog('Bir balık çantaya alındı.')
      selectedBreedingFish.value = null
    } else {
      addLog('Çanta dolu, balık çıkarılamadı.')
    }
  }

  const handleSelectForBreeding = (fish: PondFish) => {
    if (!selectedBreedingFish.value) {
      selectedBreedingFish.value = fish
      return
    }

    if (selectedBreedingFish.value.id === fish.id) {
      selectedBreedingFish.value = null
      return
    }

    // Eşleştirmeyi dene
    if (fishPondStore.startBreeding(selectedBreedingFish.value.id, fish.id)) {
      addLog(`${fish.name} üremeye başladı; ${fishPondStore.pond.breeding!.daysLeft} gün sonra sonuç alınacak.`)
      showFloat('Üreme başladı', 'success')
      selectedBreedingFish.value = null
    } else {
      if (selectedBreedingFish.value.fishId !== fish.fishId) {
        addLog('Sadece aynı tür balıklar eşleştirilebilir.')
      } else if (fishPondStore.isFull) {
        addLog('Havuz dolu, üreme yapılamaz.')
      } else {
        addLog('Eşleşme olmadı; balıkların yetişkin ve sağlıklı olduğundan emin ol.')
      }
      selectedBreedingFish.value = null
    }
  }
</script>
