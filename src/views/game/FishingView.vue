<template>
  <div>
    <h3 class="text-accent text-sm mb-3">
      <Fish :size="14" class="inline" />
      {{ currentLocationName }}’da Balıkçılık
    </h3>
    <p v-if="tutorialHint" class="text-[10px] text-muted/50 mb-2">{{ tutorialHint }}</p>

    <!-- Balık tutma yeri -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <p class="text-sm text-accent mb-2">
        <MapPin :size="14" class="inline" />
        Avlak Yeri
      </p>
      <div class="grid grid-cols-3 gap-1">
        <div
          v-for="loc in FISHING_LOCATIONS"
          :key="loc.id"
          class="text-center border rounded-xs px-2 py-1.5 cursor-pointer"
          :class="fishingStore.fishingLocation === loc.id ? 'border-accent/60 bg-accent/10' : 'border-accent/20 hover:bg-accent/5'"
          @click="handleSetLocation(loc.id)"
        >
          <span class="text-xs" :class="fishingStore.fishingLocation === loc.id ? 'text-accent' : ''">
            {{ loc.name }}
          </span>
        </div>
      </div>
      <p class="text-xs text-muted mt-2">{{ currentLocationDesc }}</p>
    </div>

    <!-- Donanım -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <p class="text-sm text-accent mb-2">Donanım</p>
      <div class="flex flex-col space-y-1">
        <!-- Olta -->
        <div class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Olta</span>
          <span class="text-xs text-accent">{{ rodTierName }}</span>
        </div>
        <!-- Yem -->
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
          @click="showBaitModal = true"
        >
          <span class="text-xs">Yem</span>
          <span class="text-xs" :class="fishingStore.equippedBait ? 'text-accent' : 'text-muted'">
            <template v-if="fishingStore.equippedBait">
              {{ getBaitName(fishingStore.equippedBait) }}
              <span class="text-muted">(&times;{{ inventoryStore.getItemCount(fishingStore.equippedBait) }})</span>
            </template>
            <template v-else>Takılı değil</template>
          </span>
        </div>
        <!-- Şamandıra -->
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5"
          :class="canEquipTackle ? 'cursor-pointer hover:bg-accent/5' : 'opacity-50'"
          @click="canEquipTackle && (showTackleModal = true)"
        >
          <span class="text-xs">Şamandıra</span>
          <span class="text-xs" :class="fishingStore.equippedTackle ? 'text-accent' : 'text-muted'">
            <template v-if="fishingStore.equippedTackle">
              {{ getTackleName(fishingStore.equippedTackle) }}
              <span class="text-muted">({{ fishingStore.tackleDurability }})</span>
            </template>
            <template v-else>{{ canEquipTackle ? 'Takılı değil' : 'Demir olta ve üstü gerekir' }}</template>
          </span>
        </div>
      </div>
    </div>

    <!-- Balık tutma işlemi -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-accent">Balık Tut</p>
        <span class="text-xs text-muted">{{ playerStore.stamina }}/{{ playerStore.maxStamina }} güç</span>
      </div>
      <div
        class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
        @click="handleStartFishing"
      >
        <span class="text-xs">
          <Target :size="12" class="inline" />
          Oltayı At
        </span>
        <span class="text-xs text-muted">Güç harcar · {{ fishTimeLabel }}</span>
      </div>
    </div>

    <!-- Balık tutma sonucu -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <p class="text-sm text-accent mb-2">Av Sonucu</p>
      <div v-if="lastResult" class="border border-accent/10 rounded-xs px-3 py-1.5">
        <span class="text-xs">{{ lastResult }}</span>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-6 text-muted">
        <Fish :size="32" class="text-muted/30 mb-2" />
        <p class="text-xs">Henüz hiç balık tutmadın, bir dene.</p>
      </div>
    </div>

    <!-- Şu an tutulabilecek balıklar -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-accent">Şu Anki Balıklar</p>
        <span class="text-xs text-muted">{{ fishingStore.availableFish.length }} tür</span>
      </div>
      <div v-if="fishingStore.availableFish.length > 0" class="flex flex-col space-y-1">
        <div
          v-for="f in fishingStore.availableFish"
          :key="f.name"
          class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
          @click="selectedFish = f"
        >
          <span class="text-xs" :class="DIFFICULTY_COLORS[f.difficulty]">{{ f.name }}</span>
          <span class="text-[10px]" :class="DIFFICULTY_COLORS[f.difficulty]">
            {{ DIFFICULTY_NAMES[f.difficulty] }}
          </span>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-6 text-muted">
        <Fish :size="32" class="text-muted/30 mb-2" />
        <p class="text-xs">Bu vakitte / havada / yerde tutulacak balık yok.</p>
      </div>
    </div>

    <!-- Yengeç kapanı -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-accent">
          <Box :size="14" class="inline" />
          Yengeç Kapanı
        </p>
        <span class="text-xs text-muted">{{ fishingStore.crabPots.length }}/10</span>
      </div>
      <div v-if="crabPotLocations.length > 0" class="flex flex-col space-y-1 mb-2">
        <div v-for="loc in crabPotLocations" :key="loc.id" class="border border-accent/10 rounded-xs p-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-accent">{{ loc.name }}</span>
            <div class="flex space-x-1">
              <Button class="py-0 px-1" @click="handleBaitCrabPots(loc.id)">Yemle</Button>
              <Button class="py-0 px-1" @click="handleRemoveCrabPot(loc.id)">Topla</Button>
            </div>
          </div>
          <p class="text-[10px] text-muted">{{ loc.total }} tane · {{ loc.baited }} tanesi yemli</p>
        </div>
      </div>
      <div v-else-if="!hasCrabPotInBag" class="flex flex-col items-center justify-center py-6 text-muted mb-2">
        <Box :size="32" class="text-muted/30 mb-2" />
        <p class="text-xs">Yengeç kapanı alınca ya da yapınca buraya kurabilirsin.</p>
      </div>
      <div
        v-if="hasCrabPotInBag"
        class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
        @click="handlePlaceCrabPot"
      >
        <span class="text-xs">Yengeç Kapanı Kur</span>
        <span class="text-xs text-muted">{{ currentLocationName }}</span>
      </div>
    </div>

    <!-- Kum eleği -->
    <div class="border border-accent/20 rounded-xs p-3">
      <p class="text-sm text-accent mb-2">
        <CircleDot :size="14" class="inline" />
        Altın Eleği
      </p>
      <div v-if="canPan">
        <p class="text-xs text-muted mb-2">Yağmurda sular kabarır; kıyıda elekle altın aranabilir.</p>
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
          @click="handlePan"
        >
          <span class="text-xs">Bir Kez Ele</span>
          <span class="text-xs text-muted">Güç harcar · {{ Math.round(panTime * 60) }} dakika</span>
        </div>
        <div v-if="panResult" class="border border-accent/10 rounded-xs px-3 py-1.5 mt-1">
          <span class="text-xs">{{ panResult }}</span>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-6 text-muted">
        <CircleDot :size="32" class="text-muted/30 mb-2" />
        <p class="text-xs">{{ panDisabledReason }}</p>
      </div>
    </div>

    <!-- Yem seçme penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showBaitModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showBaitModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showBaitModal = false">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">Yem</p>
          <!-- Şu an takılı -->
          <div v-if="fishingStore.equippedBait" class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-[10px] text-muted mb-1">Şu an takılı</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-accent">{{ getBaitName(fishingStore.equippedBait) }}</span>
              <Button class="py-0 px-1" @click="handleUnequipBait">Çıkar</Button>
            </div>
          </div>
          <!-- Çantadaki yemler -->
          <div v-if="availableBaits.length > 0" class="border border-accent/10 rounded-xs p-2">
            <p class="text-[10px] text-muted mb-1">Çantadaki yemler</p>
            <div class="flex flex-col space-y-1">
              <div
                v-for="b in availableBaits"
                :key="b.id"
                class="flex items-center justify-between border border-accent/10 rounded-xs px-2 py-1 cursor-pointer hover:bg-accent/5"
                @click="handleEquipBaitFromModal(b.id)"
              >
                <span class="text-xs">{{ b.name }}</span>
                <span class="text-xs text-muted">&times;{{ b.count }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="!fishingStore.equippedBait" class="flex flex-col items-center justify-center py-4 text-muted">
            <Target :size="28" class="text-muted/30 mb-2" />
            <p class="text-xs">Çantada yem yok</p>
            <p class="text-[10px] text-muted/60 mt-0.5">Dükkândan alabilir ya da yapabilirsin</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Şamandıra seçme penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showTackleModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showTackleModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showTackleModal = false">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">Şamandıra</p>
          <!-- Şu an takılı -->
          <div v-if="fishingStore.equippedTackle" class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-[10px] text-muted mb-1">Şu an takılı</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-accent">{{ getTackleName(fishingStore.equippedTackle) }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-[10px] text-muted">Dayanım {{ fishingStore.tackleDurability }}</span>
                <Button class="py-0 px-1" @click="handleUnequipTackle">Çıkar</Button>
              </div>
            </div>
          </div>
          <!-- Çantadaki şamandıralar -->
          <div v-if="availableTackles.length > 0" class="border border-accent/10 rounded-xs p-2">
            <p class="text-[10px] text-muted mb-1">Çantadaki şamandıralar</p>
            <div class="flex flex-col space-y-1">
              <div
                v-for="t in availableTackles"
                :key="t.id"
                class="flex items-center justify-between border border-accent/10 rounded-xs px-2 py-1 cursor-pointer hover:bg-accent/5"
                @click="handleEquipTackleFromModal(t.id)"
              >
                <span class="text-xs">{{ t.name }}</span>
                <span class="text-xs text-muted">&times;{{ t.count }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="!fishingStore.equippedTackle" class="flex flex-col items-center justify-center py-4 text-muted">
            <MapPin :size="28" class="text-muted/30 mb-2" />
            <p class="text-xs">Çantada şamandıra yok</p>
            <p class="text-[10px] text-muted/60 mt-0.5">Dükkândan alabilir ya da yapabilirsin</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Balık tutma mini oyunu -->
    <Transition name="panel-fade">
      <div
        v-if="showFishingModal && miniGameParams"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="handleCloseFishingModal"
      >
        <div class="game-panel max-w-sm w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="handleCloseFishingModal">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">
            <Fish :size="14" class="inline" />
            Balık Tutma
          </p>
          <!-- Vazgeçme onayı -->
          <div v-if="showCloseConfirm" class="border border-danger/40 rounded-xs p-3 mb-3">
            <p class="text-xs text-danger mb-2">Balık hâlâ oltada; vazgeçmek istediğine emin misin?</p>
            <div class="flex space-x-2">
              <Button class="text-danger" @click="handleConfirmClose">Bırak</Button>
              <Button @click="showCloseConfirm = false">Devam Et</Button>
            </div>
          </div>
          <FishingMiniGame v-bind="miniGameParams" @complete="handleMiniGameComplete" />
        </div>
      </div>
    </Transition>

    <!-- Balık tutma sonucu penceresi -->
    <Transition name="panel-fade">
      <div v-if="catchResult" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="dismissCatchResult">
            <X :size="14" />
          </button>

          <p
            class="text-sm mb-2"
            :class="
              catchResult.success && catchResult.quality
                ? QUALITY_COLORS[catchResult.quality]
                : catchResult.success
                  ? 'text-accent'
                  : 'text-danger'
            "
          >
            {{ catchResult.fishName }}
          </p>

          <div v-if="catchResult.description" class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ catchResult.description }}</p>
          </div>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Netice</span>
              <span class="text-xs" :class="catchResult.success ? 'text-success' : 'text-danger'">
                {{ catchResult.success ? 'Başarıyla yakalandı' : 'Balık kaçtı' }}
              </span>
            </div>
            <div v-if="catchResult.success && catchResult.quantity" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Adet</span>
              <span class="text-xs">×{{ catchResult.quantity }}</span>
            </div>
            <div v-if="catchResult.success && catchResult.quality" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Kalite</span>
              <span class="text-xs" :class="QUALITY_COLORS[catchResult.quality]">{{ QUALITY_NAMES[catchResult.quality] }}</span>
            </div>
            <div v-if="catchResult.difficulty" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Zorluk</span>
              <span class="text-xs" :class="DIFFICULTY_COLORS[catchResult.difficulty]">{{ DIFFICULTY_NAMES[catchResult.difficulty] }}</span>
            </div>
            <div v-if="catchResult.sellPrice" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ catchResult.sellPrice }} akçe</span>
            </div>
          </div>

          <p v-if="catchResult.message.includes('宝箱')" class="text-xs text-accent mb-2">
            {{ catchResult.message.slice(catchResult.message.indexOf('宝箱')) }}
          </p>

          <Button class="w-full justify-center !bg-accent !text-bg" @click="dismissCatchResult">Tamam</Button>
        </div>
      </div>
    </Transition>

    <!-- Balık ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="selectedFish"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="selectedFish = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="selectedFish = null">
            <X :size="14" />
          </button>
          <p class="text-sm mb-2" :class="DIFFICULTY_COLORS[selectedFish.difficulty]">{{ selectedFish.name }}</p>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ selectedFish.description }}</p>
          </div>

          <div class="border border-accent/10 rounded-xs p-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Zorluk</span>
              <span class="text-xs" :class="DIFFICULTY_COLORS[selectedFish.difficulty]">
                {{ DIFFICULTY_NAMES[selectedFish.difficulty] }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ selectedFish.sellPrice }} akçe</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Mevsim</span>
              <span class="text-xs">{{ selectedFish.season.map(s => SEASON_LABEL[s] ?? s).join('、') }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Hava</span>
              <span class="text-xs">{{ selectedFish.weather.map(w => WEATHER_LABEL[w] ?? w).join('、') }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Fish, X, Target, MapPin, Box, CircleDot } from 'lucide-vue-next'
  import { useAchievementStore } from '@/stores/useAchievementStore'
  import { useFishingStore } from '@/stores/useFishingStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { useSkillStore } from '@/stores/useSkillStore'
  import { useTutorialStore } from '@/stores/useTutorialStore'
  import { getBaitById, getTackleById } from '@/data/processing'
  import { FISHING_LOCATIONS } from '@/data/fish'
  import type { BaitType, TackleType, FishingLocation, FishDef, MiniGameParams, MiniGameResult, Quality } from '@/types'
  import { ACTION_TIME_COSTS, TOOL_TIME_SAVINGS, SKILL_TIME_REDUCTION_PER_LEVEL, MIN_ACTION_MINUTES } from '@/data/timeConstants'
  import { sfxFishCatch, sfxLineBroken, sfxClick } from '@/composables/useAudio'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'
  import FishingMiniGame from '@/components/game/FishingMiniGame.vue'
  import Button from '@/components/game/Button.vue'

  const fishingStore = useFishingStore()
  const gameStore = useGameStore()
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const skillStore = useSkillStore()
  const achievementStore = useAchievementStore()
  const tutorialStore = useTutorialStore()

  const tutorialHint = computed(() => {
    if (!tutorialStore.enabled || gameStore.year > 1) return null
    if (achievementStore.stats.totalFishCaught === 0) return 'Bir avlak seç, sonra “Oltayı At” düğmesine bas. Balık vurunca mini oyunu tamamlayıp avı yakalaman gerekir.'
    return null
  })

  // === Durum ===

  const lastResult = ref<string | null>(null)
  const miniGameParams = ref<MiniGameParams | null>(null)
  const panResult = ref<string | null>(null)

  const showBaitModal = ref(false)
  const showTackleModal = ref(false)
  const showFishingModal = ref(false)
  const showCloseConfirm = ref(false)
  const miniGameCompleted = ref(false)
  const selectedFish = ref<FishDef | null>(null)
  const catchResult = ref<{
    fishName: string
    fishId?: string
    difficulty?: string
    sellPrice?: number
    description?: string
    quality?: Quality
    quantity?: number
    success: boolean
    message: string
  } | null>(null)

  // === Hesaplananlar ===

  /** Balık tutma süresi (saat), alet ve beceri indirimiyle */
  const fishTime = computed(() => {
    const baseMin = ACTION_TIME_COSTS.fishStart * 60
    const toolTier = inventoryStore.getTool?.('fishingRod')?.tier ?? 'basic'
    const saving = TOOL_TIME_SAVINGS[toolTier] ?? 0
    const skillReduction = skillStore.getSkill('fishing').level * SKILL_TIME_REDUCTION_PER_LEVEL
    return Math.max(MIN_ACTION_MINUTES, Math.round((baseMin - saving) * (1 - skillReduction))) / 60
  })

  const fishTimeLabel = computed(() => `${Math.round(fishTime.value * 60)} dakika`)

  /** Altın eleği süresi (saat), alet ve beceri indirimiyle */
  const panTime = computed(() => {
    const baseMin = ACTION_TIME_COSTS.pan * 60
    const toolTier = inventoryStore.getTool('pan')?.tier ?? 'basic'
    const saving = TOOL_TIME_SAVINGS[toolTier] ?? 0
    const skillReduction = skillStore.getSkill('fishing').level * SKILL_TIME_REDUCTION_PER_LEVEL
    return Math.max(MIN_ACTION_MINUTES, Math.round((baseMin - saving) * (1 - skillReduction))) / 60
  })

  const currentLocationName = computed(() => {
    return FISHING_LOCATIONS.find(l => l.id === fishingStore.fishingLocation)?.name ?? 'Dere'
  })

  const currentLocationDesc = computed(() => {
    return FISHING_LOCATIONS.find(l => l.id === fishingStore.fishingLocation)?.description ?? ''
  })

  const rodTierName = computed(() => {
    const tier = inventoryStore.getTool?.('fishingRod')?.tier ?? 'basic'
    const names: Record<string, string> = { basic: 'Kamış Olta', iron: 'Demir Olta', steel: 'Çelik Olta', iridium: 'Göktaşı Olta' }
    return names[tier] ?? tier
  })

  const canEquipTackle = computed(() => {
    const tier = inventoryStore.getTool?.('fishingRod')?.tier ?? 'basic'
    return tier !== 'basic'
  })

  const ALL_BAIT_TYPES: BaitType[] = ['standard_bait', 'wild_bait', 'magic_bait', 'deluxe_bait', 'targeted_bait']
  const availableBaits = computed(() => {
    return ALL_BAIT_TYPES.map(id => ({ id, name: getBaitById(id)?.name ?? id, count: inventoryStore.getItemCount(id) })).filter(
      b => b.count > 0
    )
  })

  const availableTackles = computed(() => {
    const tackleTypes: TackleType[] = ['spinner', 'trap_bobber', 'cork_bobber', 'quality_bobber', 'lead_bobber']
    if (!canEquipTackle.value) return []
    return tackleTypes
      .map(id => ({ id, name: getTackleById(id)?.name ?? id, count: inventoryStore.getItemCount(id) }))
      .filter(t => t.count > 0)
  })

  const hasCrabPotInBag = computed(() => inventoryStore.getItemCount('crab_pot') > 0)

  const crabPotLocations = computed(() => {
    const result: { id: string; name: string; total: number; baited: number }[] = []
    for (const loc of FISHING_LOCATIONS) {
      const info = fishingStore.crabPotsByLocation[loc.id as FishingLocation]
      if (info) {
        result.push({ id: loc.id, name: loc.name, total: info.total, baited: info.baited })
      }
    }
    return result
  })

  const PAN_LOCATIONS: FishingLocation[] = ['creek', 'river', 'waterfall']
  const canPan = computed(() => gameStore.isRainy && PAN_LOCATIONS.includes(fishingStore.fishingLocation))
  const panDisabledReason = computed(() => {
    if (!gameStore.isRainy) return 'Altın eleği için yağmurlu gün gerekir; sular kabarınca kum açığa çıkar.'
    if (!PAN_LOCATIONS.includes(fishingStore.fishingLocation)) return 'Burada elek olmaz; dere, ırmak ya da çağlayana git.'
    return ''
  })

  const DIFFICULTY_NAMES: Record<string, string> = {
    easy: 'Kolay',
    normal: 'Orta',
    hard: 'Zor',
    legendary: 'Efsane'
  }
  const DIFFICULTY_COLORS: Record<string, string> = {
    easy: 'text-success',
    normal: 'text-muted',
    hard: 'text-danger',
    legendary: 'text-accent'
  }

  const SEASON_LABEL: Record<string, string> = { spring: 'İlkbahar', summer: 'Yaz', autumn: 'Güz', winter: 'Kış' }
  const WEATHER_LABEL: Record<string, string> = {
    any: 'Her hava',
    sunny: 'Açık',
    rainy: 'Yağmur',
    stormy: 'Fırtına',
    snowy: 'Kar',
    windy: 'Rüzgâr'
  }

  // === Yardımcılar ===

  const getBaitName = (type: BaitType): string => getBaitById(type)?.name ?? type
  const getTackleName = (type: TackleType): string => getTackleById(type)?.name ?? type

  // === Yer seçimi ===

  const handleSetLocation = (loc: FishingLocation) => {
    fishingStore.setLocation(loc)
    sfxClick()
  }

  // === Donanım ===

  const handleEquipBaitFromModal = (baitId: BaitType) => {
    const result = fishingStore.equipBait(baitId)
    addLog(result.message)
    showBaitModal.value = false
  }

  const handleUnequipBait = () => {
    const msg = fishingStore.unequipBait()
    addLog(msg)
  }

  const handleEquipTackleFromModal = (tackleId: TackleType) => {
    const result = fishingStore.equipTackle(tackleId)
    addLog(result.message)
    showTackleModal.value = false
  }

  const handleUnequipTackle = () => {
    const msg = fishingStore.unequipTackle()
    addLog(msg)
  }

  // === Balıkçılık ===

  const handleStartFishing = () => {
    if (gameStore.isPastBedtime) {
      addLog('Geç vakit oldu, artık balık tutulmaz.')
      handleEndDay()
      return
    }
    if (!inventoryStore.isToolAvailable('fishingRod')) {
      addLog('Olta yükseltmede, şimdi balık tutulamaz.')
      return
    }
    const result = fishingStore.startFishing()
    if (result.success) {
      sfxClick()
      const tr = gameStore.advanceTime(fishTime.value)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
      if (result.junk) {
        // Çerçöp doğrudan çantaya gider, mini oyuna girmez
        lastResult.value = result.message
      } else {
        miniGameParams.value = fishingStore.calculateMiniGameParams()
        miniGameCompleted.value = false
        showCloseConfirm.value = false
        showFishingModal.value = true
      }
    }
    addLog(result.message)
    if (!result.success) {
      lastResult.value = result.message
    }
  }

  const QUALITY_NAMES: Record<Quality, string> = {
    normal: 'Sıradan',
    fine: 'İyi',
    excellent: 'Seçkin',
    supreme: 'Kutlu'
  }

  const QUALITY_COLORS: Record<Quality, string> = {
    normal: 'text-muted',
    fine: 'text-quality-fine',
    excellent: 'text-quality-excellent',
    supreme: 'text-quality-supreme'
  }

  const handleMiniGameComplete = (result: MiniGameResult) => {
    miniGameCompleted.value = true

    const ratingNames: Record<string, string> = {
      perfect: 'Kusursuz',
      excellent: 'Pek İyi',
      good: 'İyi',
      poor: 'Başarısız'
    }
    addLog(`Mini oyun derecesi: ${ratingNames[result.rating]}!`)

    const catchData = fishingStore.completeFishing(result.rating)
    if (catchData) {
      addLog(catchData.message)
      lastResult.value = catchData.message
      if (catchData.success) sfxFishCatch()
      else sfxLineBroken()

      // Sonuç penceresi
      catchResult.value = {
        fishName: catchData.fishName ?? '',
        fishId: catchData.fishId,
        difficulty: catchData.difficulty,
        sellPrice: catchData.sellPrice,
        description: catchData.description,
        quality: catchData.quality,
        quantity: catchData.quantity,
        success: catchData.success,
        message: catchData.message
      }
    }

    showFishingModal.value = false
    showCloseConfirm.value = false
    miniGameParams.value = null
  }

  const dismissCatchResult = () => {
    catchResult.value = null
  }

  const handleCloseFishingModal = () => {
    if (!miniGameCompleted.value) {
      showCloseConfirm.value = true
    } else {
      showFishingModal.value = false
      miniGameParams.value = null
    }
  }

  const handleConfirmClose = () => {
    showCloseConfirm.value = false
    showFishingModal.value = false
    miniGameParams.value = null
    lastResult.value = 'Balığı bıraktın, av kaçtı.'
    addLog('Balığı bıraktın, av kaçtı.')
  }

  // === Yengeç kapanları ===

  const handlePlaceCrabPot = () => {
    const result = fishingStore.placeCrabPot(fishingStore.fishingLocation)
    addLog(result.message)
  }

  const handleRemoveCrabPot = (locId: string) => {
    const result = fishingStore.removeCrabPot(locId as FishingLocation)
    addLog(result.message)
  }

  const handleBaitCrabPots = (locId: string) => {
    const result = fishingStore.baitCrabPots(locId as FishingLocation)
    addLog(result.message)
  }

  // === Altın eleği ===

  const handlePan = () => {
    if (gameStore.isPastBedtime) {
      addLog('Geç vakit oldu, artık altın aranmaz.')
      handleEndDay()
      return
    }

    if (!inventoryStore.isToolAvailable('pan')) {
      addLog('Altın eleği yükseltmede, şimdi kullanılamaz.')
      return
    }

    const panMultiplier = inventoryStore.getToolStaminaMultiplier('pan')
    const cost = Math.max(1, Math.floor(4 * panMultiplier))
    if (!playerStore.consumeStamina(cost)) {
      addLog('Gücün yetmiyor, altın aranamaz.')
      return
    }

    const panTier = inventoryStore.getTool('pan')?.tier ?? 'basic'
    const tiers: string[] = ['basic', 'iron', 'steel', 'iridium']
    const tierIndex = tiers.indexOf(panTier)

    const roll = Math.random()
    let itemId: string
    let qty = 1
    let name: string

    if (roll < 0.4) {
      itemId = 'copper_ore'
      qty = 1
      name = 'Bakır cevheri'
    } else if (roll < 0.62) {
      itemId = tierIndex >= 1 ? 'iron_ore' : 'copper_ore'
      qty = 1
      name = tierIndex >= 1 ? 'Demir cevheri' : 'Bakır cevheri'
    } else if (roll < 0.75) {
      itemId = tierIndex >= 2 ? 'gold_ore' : 'iron_ore'
      qty = 1
      name = tierIndex >= 2 ? 'Altın cevheri' : 'Demir cevheri'
    } else if (roll < 0.84) {
      itemId = 'quartz'
      qty = 1
      name = 'Kuvars'
    } else if (roll < 0.9) {
      itemId = 'jade'
      qty = 1
      name = 'Yeşim'
    } else if (roll < 0.95) {
      itemId = 'ruby'
      qty = 1
      name = 'Yakut'
    } else {
      const goldNuggetChance = tierIndex >= 3 ? 0.12 : 0.04
      if (Math.random() < goldNuggetChance / 0.05) {
        itemId = 'gold_nugget'
        qty = 1
        name = 'Altın taneciği'
      } else {
        itemId = 'copper_ore'
        qty = 1
        name = 'Bakır cevheri'
      }
    }

    inventoryStore.addItem(itemId, qty)
    achievementStore.discoverItem(itemId)
    skillStore.addExp('mining', 5)
    panResult.value = `${name} buldun! (-${cost} güç)`
    addLog(`Altın eleğinde ${name} bulundu. (-${cost} güç)`)

    const tr = gameStore.advanceTime(panTime.value)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }
</script>
