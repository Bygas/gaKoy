<template>
  <div>
    <!-- Sekme geçişi -->
    <div class="flex space-x-1.5 mb-3">
      <Button
        class="flex-1 justify-center"
        :class="{ '!bg-accent !text-bg': activeTab === 'process' }"
        :icon="Boxes"
        @click="activeTab = 'process'"
      >
        İşlik Bölüğü
        <span class="text-[10px] ml-0.5 opacity-70">{{ processingStore.machineCount }}/{{ processingStore.maxMachines }}</span>
      </Button>
      <Button
        class="flex-1 justify-center"
        :class="{ '!bg-accent !text-bg': activeTab === 'craft' }"
        :icon="Hammer"
        @click="activeTab = 'craft'"
      >
        Yapım
      </Button>
    </div>

    <!-- İşlik bölüğü -->
    <div v-if="activeTab === 'process'" class="border border-accent/20 rounded-xs p-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-1.5 text-sm text-accent">
          <Boxes :size="14" />
          <span>İşlik Bölüğü</span>
          <span class="text-[10px] text-muted font-normal">{{ processingStore.machineCount }}/{{ processingStore.maxMachines }}</span>
        </div>
        <button
          v-if="nextUpgrade || processingStore.workshopLevel > 0"
          class="text-[10px] px-2 py-0.5 border rounded-xs"
          :class="nextUpgrade ? 'border-accent/30 text-accent hover:bg-accent/5 cursor-pointer' : 'border-accent/10 text-muted'"
          @click="showUpgradeModal = true"
        >
          <ArrowUpCircle :size="10" class="inline mr-0.5" />
          İşlik Sv.{{ processingStore.workshopLevel }}
        </button>
      </div>

      <!-- Boş durum -->
      <div v-if="processingStore.machines.length === 0" class="flex flex-col items-center justify-center py-8">
        <Boxes :size="36" class="text-accent/20 mb-2" />
        <p class="text-xs text-muted">Henüz düzenek yok</p>
        <p class="text-[10px] text-muted/50 mt-0.5">“Yapım” sekmesine geçip bir işleme düzeneği kur</p>
      </div>

      <!-- Düzenek listesi -->
      <div v-else class="flex flex-col space-y-1.5">
        <div
          v-for="(slot, idx) in processingStore.machines"
          :key="idx"
          class="border rounded-xs p-2"
          :class="slot.ready ? 'border-success/30' : 'border-accent/20'"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs" :class="slot.ready ? 'text-success' : 'text-accent'">{{ getMachineName(slot.machineType) }}</span>
            <button class="text-muted hover:text-danger" @click="handleRemoveMachine(idx)">
              <Trash2 :size="12" />
            </button>
          </div>

          <!-- Boşta: terkip seç -->
          <div v-if="!slot.recipeId">
            <div v-if="processingStore.getAvailableRecipes(slot.machineType).length > 0" class="grid space-y-1">
              <Button
                v-for="recipe in processingStore.getAvailableRecipes(slot.machineType)"
                :key="recipe.id"
                :disabled="recipe.inputItemId !== null && !hasCombinedItem(recipe.inputItemId, recipe.inputQuantity)"
                @click="handleStartProcessing(idx, recipe.id)"
              >
                {{ recipe.name }}
                <span v-if="recipe.inputItemId" class="text-muted">
                  ({{ getItemName(recipe.inputItemId) }} {{ getCombinedItemCount(recipe.inputItemId) }}/{{ recipe.inputQuantity }})
                </span>
              </Button>
            </div>
            <p v-else class="text-xs text-muted">Kullanılabilir terkip yok</p>
          </div>

          <!-- İşleniyor -->
          <div v-else-if="!slot.ready">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-muted">{{ getRecipeName(slot.recipeId) }}</span>
              <span class="text-muted">{{ slot.daysProcessed }}/{{ slot.totalDays }} gün</span>
            </div>
            <div class="h-1 bg-bg rounded-xs border border-accent/10 mb-1.5">
              <div
                class="h-full bg-accent rounded-xs transition-all"
                :style="{ width: Math.floor((slot.daysProcessed / slot.totalDays) * 100) + '%' }"
              />
            </div>
            <Button class="w-full justify-center" :icon="X" :icon-size="10" @click="handleCancelProcessing(idx)">İşlemeyi Durdur</Button>
          </div>

          <!-- Tamam -->
          <div v-else>
            <Button class="w-full justify-center !bg-accent !text-bg" :icon="Package" :icon-size="12" @click="handleCollect(idx)">
              Al {{ getRecipeOutputName(slot.recipeId) }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Yapım bölüğü -->
    <div v-if="activeTab === 'craft'" class="border border-accent/20 rounded-xs p-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-1.5 text-sm text-accent">
          <Hammer :size="14" />
          <span>Yapım</span>
        </div>
        <span class="text-xs text-muted">Düzenek {{ processingStore.machineCount }}/{{ processingStore.maxMachines }}</span>
      </div>

      <div v-for="cat in craftCategories" :key="cat.label" class="mb-3 last:mb-0">
        <p class="text-xs text-muted mb-1">{{ cat.label }}</p>
        <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
          <div
            v-for="item in cat.items"
            :key="item.id"
            class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5 mr-1"
            @click="openCraftModal(item)"
          >
            <div class="text-xs truncate mr-2">
              {{ item.name }}
              <span v-if="item.badge" class="text-muted ml-1">[{{ item.badge }}]</span>
            </div>
            <span v-if="item.cost > 0" class="text-xs text-accent whitespace-nowrap">{{ item.cost }} akçe</span>
          </div>
        </div>
      </div>
    </div>

    <!-- İşlik genişletme penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showUpgradeModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showUpgradeModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showUpgradeModal = false">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">
            <ArrowUpCircle :size="14" class="inline mr-0.5" />
            İşlik Bilgisi
          </p>

          <!-- Şimdiki durum -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Şimdiki seviye</span>
              <span class="text-xs text-accent">Sv.{{ processingStore.workshopLevel }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Düzenek sınırı</span>
              <span class="text-xs text-text">{{ processingStore.maxMachines }} düzenek</span>
            </div>
          </div>

          <!-- Bir sonraki yükseltme -->
          <template v-if="nextUpgrade">
            <div class="border border-accent/10 rounded-xs p-2 mb-2">
              <p class="text-xs text-muted mb-1">Sv.{{ processingStore.workshopLevel + 1 }} düzeyine yükselt</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted">Düzenek sınırı</span>
                <span class="text-xs text-text">{{ processingStore.maxMachines }} → {{ processingStore.maxMachines + 5 }}</span>
              </div>
            </div>

            <!-- Gereken gereçler -->
            <div class="border border-accent/10 rounded-xs p-2 mb-2">
              <p class="text-xs text-muted mb-1">Gereken gereçler</p>
              <div v-for="mat in nextUpgrade.materials" :key="mat.itemId" class="flex items-center justify-between">
                <span class="text-xs text-muted">{{ getItemById(mat.itemId)?.name }}</span>
                <span class="text-xs" :class="getCombinedItemCount(mat.itemId) >= mat.quantity ? '' : 'text-danger'">
                  {{ getCombinedItemCount(mat.itemId) }}/{{ mat.quantity }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-0.5">
                <span class="text-xs text-muted">Akçe</span>
                <span class="text-xs" :class="playerStore.money >= nextUpgrade.cost ? '' : 'text-danger'">{{ nextUpgrade.cost }} akçe</span>
              </div>
            </div>

            <!-- Genişletme düğmesi -->
            <Button
              v-if="!showUpgradeConfirm"
              class="w-full justify-center"
              :class="{ '!bg-accent !text-bg': canUpgrade }"
              :icon="ArrowUpCircle"
              :icon-size="12"
              :disabled="!canUpgrade"
              @click="showUpgradeConfirm = true"
            >
              İşliği Genişlet
            </Button>

            <!-- Onay -->
            <div v-else class="flex space-x-1">
              <Button class="flex-1 justify-center" @click="showUpgradeConfirm = false">Vazgeç</Button>
              <Button
                class="flex-1 justify-center !bg-accent !text-bg"
                :icon="ArrowUpCircle"
                :icon-size="12"
                @click="handleUpgradeFromModal"
              >
                Genişletmeyi Onayla
              </Button>
            </div>
          </template>

          <p v-else class="text-[10px] text-muted text-center">İşlik en yüksek düzeye ulaştı.</p>
        </div>
      </div>
    </Transition>

    <!-- Yapım penceresi -->
    <Transition name="panel-fade">
      <div v-if="craftModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="craftModal = null">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="craftModal = null">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">{{ craftModal.name }}</p>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ craftModal.description }}</p>
            <p v-if="craftModal.badge" class="text-xs text-muted mt-0.5">Şimdi: {{ craftModal.badge }}</p>
          </div>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted mb-1">Gereken gereçler</p>
            <div v-for="mat in craftModal.materials" :key="mat.itemId" class="flex items-center justify-between">
              <span class="text-xs text-muted">{{ getItemName(mat.itemId) }}</span>
              <span class="text-xs" :class="getCombinedItemCount(mat.itemId) >= mat.quantity * displayQty ? '' : 'text-danger'">
                {{ getCombinedItemCount(mat.itemId) }}/{{ mat.quantity * displayQty }}
              </span>
            </div>
            <div v-if="craftModal.cost > 0" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Akçe</span>
              <span class="text-xs" :class="playerStore.money >= craftModal.cost * displayQty ? '' : 'text-danger'">
                {{ craftModal.cost * displayQty }} akçe
              </span>
            </div>
          </div>

          <!-- Çoklu sayı denetimi -->
          <div v-if="craftModal.batchable && maxCraftable > 1" class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-muted">Sayı</span>
              <div class="flex items-center space-x-1">
                <Button class="h-6 px-1.5 py-0.5 text-xs justify-center" :disabled="craftQuantity <= 1" @click="addCraftQuantity(-1)">
                  -
                </Button>
                <input
                  type="number"
                  :value="craftQuantity"
                  min="1"
                  :max="maxCraftable"
                  class="w-16 h-6 px-2 py-0.5 bg-bg border border-accent/30 rounded-xs text-xs text-center text-accent outline-none focus:border-accent transition-colors"
                  @input="onCraftQuantityInput"
                />
                <Button
                  class="h-6 px-1.5 py-0.5 text-xs justify-center"
                  :disabled="craftQuantity >= maxCraftable"
                  @click="addCraftQuantity(1)"
                >
                  +
                </Button>
              </div>
            </div>
            <div class="flex space-x-1">
              <Button class="flex-1 justify-center" :disabled="craftQuantity <= 1" @click="setCraftQuantity(1)">En Az</Button>
              <Button class="flex-1 justify-center" :disabled="craftQuantity >= maxCraftable" @click="setCraftQuantity(maxCraftable)">
                En Çok
              </Button>
            </div>
            <div v-if="craftModal.cost > 0" class="flex items-center justify-between mt-1.5">
              <span class="text-xs text-muted">Toplam</span>
              <span class="text-xs text-accent">{{ craftModal.cost * craftQuantity }} akçe</span>
            </div>
          </div>

          <Button
            class="w-full justify-center"
            :class="{ '!bg-accent !text-bg': craftModal.canCraft() }"
            :icon="Hammer"
            :icon-size="12"
            :disabled="!craftModal.canCraft()"
            @click="handleCraftFromModal"
          >
            {{ craftModal.batchable && craftQuantity > 1 ? `Yap ×${craftQuantity}` : 'Yap' }}
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Hammer, Trash2, Package, Boxes, X, ArrowUpCircle } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import type { MachineType, AnimalBuildingType, ChestTier } from '@/types'
  import { useAnimalStore } from '@/stores/useAnimalStore'
  import { useFarmStore } from '@/stores/useFarmStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { useProcessingStore } from '@/stores/useProcessingStore'
  import { useSkillStore } from '@/stores/useSkillStore'
  import { useWarehouseStore } from '@/stores/useWarehouseStore'
  import { getCombinedItemCount, hasCombinedItem, removeCombinedItem } from '@/composables/useCombinedInventory'
  import {
    PROCESSING_MACHINES,
    SPRINKLERS,
    FERTILIZERS,
    BAITS,
    TACKLES,
    TAPPER,
    CRAB_POT_CRAFT,
    LIGHTNING_ROD,
    SCARECROW,
    AUTO_PETTER,
    BOMBS,
    getProcessingRecipeById
  } from '@/data/processing'
  import { getItemById, CHEST_DEFS, CHEST_TIER_ORDER } from '@/data/items'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import { sfxClick } from '@/composables/useAudio'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'

  const processingStore = useProcessingStore()
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const gameStore = useGameStore()
  const farmStore = useFarmStore()
  const animalStore = useAnimalStore()
  const skillStore = useSkillStore()
  const warehouseStore = useWarehouseStore()

  const activeTab = ref<'process' | 'craft'>('process')

  // === İşlik yükseltmesi ===

  const showUpgradeModal = ref(false)
  const showUpgradeConfirm = ref(false)

  const nextUpgrade = computed(() => processingStore.getNextUpgrade())

  const canUpgrade = computed(() => {
    const u = nextUpgrade.value
    if (!u) return false
    return processingStore.canCraft(u.materials, u.cost)
  })

  const handleUpgradeFromModal = () => {
    const result = processingStore.upgradeWorkshop()
    sfxClick()
    addLog(result.message)
    if (result.success) {
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    }
    showUpgradeConfirm.value = false
    showUpgradeModal.value = false
  }

  // === Yapım penceresi ===

  interface CraftableItem {
    id: string
    name: string
    description: string
    materials: { itemId: string; quantity: number }[]
    cost: number
    onCraft: () => void
    canCraft: () => boolean
    badge?: string
    batchable?: boolean
    maxBatch?: () => number
  }

  const craftModal = ref<CraftableItem | null>(null)
  const craftQuantity = ref(1)

  const maxCraftable = computed(() => {
    const item = craftModal.value
    if (!item?.batchable) return 1
    let max = 99
    for (const m of item.materials) {
      max = Math.min(max, Math.floor(getCombinedItemCount(m.itemId) / m.quantity))
    }
    if (item.cost > 0) {
      max = Math.min(max, Math.floor(playerStore.money / item.cost))
    }
    if (item.maxBatch) {
      max = Math.min(max, item.maxBatch())
    }
    return Math.max(1, max)
  })

  const displayQty = computed(() => (craftModal.value?.batchable ? craftQuantity.value : 1))

  const openCraftModal = (item: CraftableItem) => {
    craftModal.value = item
    craftQuantity.value = 1
  }

  const setCraftQuantity = (val: number) => {
    craftQuantity.value = Math.max(1, Math.min(val, maxCraftable.value))
  }

  const addCraftQuantity = (delta: number) => {
    setCraftQuantity(craftQuantity.value + delta)
  }

  const onCraftQuantityInput = (e: Event) => {
    const val = parseInt((e.target as HTMLInputElement).value, 10)
    if (!isNaN(val)) setCraftQuantity(val)
  }

  const JADE_RING_COST = [
    { itemId: 'jade', quantity: 1 },
    { itemId: 'gold_ore', quantity: 2 }
  ]
  const JADE_RING_MONEY = 500

  const canCraftJadeRing = computed(() => processingStore.canCraft(JADE_RING_COST, JADE_RING_MONEY))

  const STAMINA_FRUIT_COST = [
    { itemId: 'prismatic_shard', quantity: 1 },
    { itemId: 'dragon_jade', quantity: 2 },
    { itemId: 'ginseng', quantity: 5 },
    { itemId: 'iridium_bar', quantity: 3 }
  ]
  const STAMINA_FRUIT_MONEY = 10000

  const allSkillsAbove8 = computed(() => ['farming', 'foraging', 'fishing', 'mining'].every(s => skillStore.getSkill(s as any).level >= 8))
  const canCraftStaminaFruit = computed(
    () => allSkillsAbove8.value && playerStore.staminaCapLevel < 4 && processingStore.canCraft(STAMINA_FRUIT_COST, STAMINA_FRUIT_MONEY)
  )

  const craftCategories = computed((): { label: string; items: CraftableItem[] }[] => [
    {
      label: 'İşleme düzenekleri',
      items: PROCESSING_MACHINES.map(m => ({
        id: m.id as string,
        name: m.name,
        description: m.description,
        materials: m.craftCost,
        cost: m.craftMoney,
        onCraft: () => handleCraftMachine(m.id),
        canCraft: () => processingStore.canCraft(m.craftCost, m.craftMoney) && processingStore.machineCount < processingStore.maxMachines,
        batchable: true,
        maxBatch: () => processingStore.maxMachines - processingStore.machineCount
      }))
    },
    {
      label: 'Çiftlik düzenleri',
      items: [
        ...SPRINKLERS.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          materials: s.craftCost,
          cost: s.craftMoney,
          onCraft: () => handleCraftSprinkler(s.id),
          canCraft: () => processingStore.canCraft(s.craftCost, s.craftMoney),
          batchable: true
        })),
        ...FERTILIZERS.map(f => ({
          id: f.id,
          name: f.name,
          description: f.description,
          materials: f.craftCost,
          cost: f.craftMoney,
          onCraft: () => handleCraftFertilizer(f.id),
          canCraft: () => processingStore.canCraft(f.craftCost, f.craftMoney),
          batchable: true
        })),
        {
          id: 'tapper',
          name: TAPPER.name,
          description: TAPPER.description,
          materials: TAPPER.craftCost,
          cost: TAPPER.craftMoney,
          onCraft: () => handleCraftTapper(),
          canCraft: () => processingStore.canCraft(TAPPER.craftCost, TAPPER.craftMoney),
          batchable: true
        },
        {
          id: 'lightning_rod',
          name: LIGHTNING_ROD.name,
          description: LIGHTNING_ROD.description,
          materials: LIGHTNING_ROD.craftCost,
          cost: LIGHTNING_ROD.craftMoney,
          onCraft: () => handleCraftLightningRod(),
          canCraft: () => processingStore.canCraft(LIGHTNING_ROD.craftCost, LIGHTNING_ROD.craftMoney),
          badge: `Var olan ${farmStore.lightningRods}`,
          batchable: true
        },
        {
          id: 'scarecrow',
          name: SCARECROW.name,
          description: SCARECROW.description,
          materials: SCARECROW.craftCost,
          cost: SCARECROW.craftMoney,
          onCraft: () => handleCraftScarecrow(),
          canCraft: () => processingStore.canCraft(SCARECROW.craftCost, SCARECROW.craftMoney),
          badge: `Var olan ${farmStore.scarecrows}`,
          batchable: true
        },
        ...((animalStore.buildings.find(b => b.type === 'coop')?.level ?? 0) >= 2
          ? [
              {
                id: 'auto_petter_coop',
                name: `${AUTO_PETTER.name}（Kümes）`,
                description: AUTO_PETTER.description,
                materials: AUTO_PETTER.craftCost,
                cost: AUTO_PETTER.craftMoney,
                onCraft: () => handleCraftAutoPetter('coop'),
                canCraft: () =>
                  !animalStore.hasAutoPetter('coop') && processingStore.canCraft(AUTO_PETTER.craftCost, AUTO_PETTER.craftMoney),
                badge: animalStore.hasAutoPetter('coop') ? 'Kurulu' : undefined
              }
            ]
          : []),
        ...((animalStore.buildings.find(b => b.type === 'barn')?.level ?? 0) >= 2
          ? [
              {
                id: 'auto_petter_barn',
                name: `${AUTO_PETTER.name}（Ağıl）`,
                description: AUTO_PETTER.description,
                materials: AUTO_PETTER.craftCost,
                cost: AUTO_PETTER.craftMoney,
                onCraft: () => handleCraftAutoPetter('barn'),
                canCraft: () =>
                  !animalStore.hasAutoPetter('barn') && processingStore.canCraft(AUTO_PETTER.craftCost, AUTO_PETTER.craftMoney),
                badge: animalStore.hasAutoPetter('barn') ? 'Kurulu' : undefined
              }
            ]
          : [])
      ]
    },
    {
      label: 'Balıkçılık gereçleri',
      items: [
        ...BAITS.map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          materials: b.craftCost,
          cost: b.craftMoney,
          onCraft: () => handleCraftBait(b.id),
          canCraft: () => processingStore.canCraft(b.craftCost, b.craftMoney),
          batchable: true
        })),
        ...TACKLES.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          materials: t.craftCost,
          cost: t.craftMoney,
          onCraft: () => handleCraftTackle(t.id),
          canCraft: () => processingStore.canCraft(t.craftCost, t.craftMoney),
          batchable: true
        })),
        {
          id: CRAB_POT_CRAFT.id,
          name: CRAB_POT_CRAFT.name,
          description: CRAB_POT_CRAFT.description,
          materials: CRAB_POT_CRAFT.craftCost,
          cost: CRAB_POT_CRAFT.craftMoney,
          onCraft: () => handleCraftCrabPot(),
          canCraft: () => processingStore.canCraft(CRAB_POT_CRAFT.craftCost, CRAB_POT_CRAFT.craftMoney),
          batchable: true
        }
      ]
    },
    {
      label: 'Öteki',
      items: [
        ...BOMBS.map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          materials: b.id === 'mega_bomb' ? [{ itemId: 'mega_bomb_recipe', quantity: 1 }, ...b.craftCost] : b.craftCost,
          cost: b.craftMoney,
          onCraft: () => handleCraftBomb(b.id),
          canCraft: () =>
            (b.id !== 'mega_bomb' || hasCombinedItem('mega_bomb_recipe')) && processingStore.canCraft(b.craftCost, b.craftMoney),
          batchable: true
        })),
        {
          id: 'jade_ring',
          name: 'Yeşim Yüzük',
          description: 'Yeşim ve altın cevherinden yapılan yüzüktür; evlilik teklifinde kullanılabilir.',
          materials: JADE_RING_COST,
          cost: JADE_RING_MONEY,
          onCraft: () => handleCraftJadeRing(),
          canCraft: () => canCraftJadeRing.value
        },
        ...(allSkillsAbove8.value
          ? [
              {
                id: 'stamina_fruit',
                name: 'Kutlu Şeftali',
                description: 'Kadim esini taşıyan meyvedir; yenince güç sınırını kalıcı artırır. Çiftçilik/toplayıcılık/balıkçılık/madencilik hepsi en az 8 olmalı.',
                materials: STAMINA_FRUIT_COST,
                cost: STAMINA_FRUIT_MONEY,
                onCraft: () => handleCraftStaminaFruit(),
                canCraft: () => canCraftStaminaFruit.value,
                badge: playerStore.staminaCapLevel >= 4 ? 'Son düzey' : `${playerStore.staminaCapLevel}/4`
              }
            ]
          : [])
      ]
    },
    ...(warehouseStore.unlocked
      ? [
          {
            label: 'Sandıklar',
            items: CHEST_TIER_ORDER.map(tier => {
              const def = CHEST_DEFS[tier]
              return {
                id: `chest_${tier}`,
                name: def.name,
                description: def.description,
                materials: def.craftCost,
                cost: def.craftMoney,
                onCraft: () => handleCraftChest(tier),
                canCraft: () =>
                  warehouseStore.chests.length < warehouseStore.maxChests && processingStore.canCraft(def.craftCost, def.craftMoney),
                badge: `${warehouseStore.chests.length}/${warehouseStore.maxChests}`,
                batchable: true,
                maxBatch: () => warehouseStore.maxChests - warehouseStore.chests.length
              }
            })
          }
        ]
      : [])
  ])

  const handleCraftFromModal = () => {
    if (!craftModal.value) return
    const qty = craftModal.value.batchable ? Math.min(craftQuantity.value, maxCraftable.value) : 1
    const startDay = gameStore.day
    for (let i = 0; i < qty; i++) {
      if (!craftModal.value.canCraft()) break
      craftModal.value.onCraft()
      // Bayılma yüzünden gün değişirse çoklu yapımı durdur
      if (gameStore.day !== startDay) break
    }
    craftModal.value = null
  }

  // === Yardımcı araçlar ===

  const getMachineName = (type: MachineType): string => {
    return PROCESSING_MACHINES.find(m => m.id === type)?.name ?? type
  }

  const getItemName = (id: string): string => {
    return getItemById(id)?.name ?? id
  }

  const getRecipeName = (recipeId: string): string => {
    return getProcessingRecipeById(recipeId)?.name ?? recipeId
  }

  const getRecipeOutputName = (recipeId: string): string => {
    const recipe = getProcessingRecipeById(recipeId)
    if (!recipe) return recipeId
    return getItemById(recipe.outputItemId)?.name ?? recipe.name
  }

  // === Yapım işlemleri ===

  const handleCraftMachine = (machineType: MachineType) => {
    if (processingStore.craftMachine(machineType)) {
      sfxClick()
      addLog(`${getMachineName(machineType)} yapıldı ve işlik bölüğüne kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik ya da sınır dolu.')
    }
  }

  const handleCraftSprinkler = (sprinklerId: string) => {
    if (processingStore.craftSprinkler(sprinklerId)) {
      sfxClick()
      const name = SPRINKLERS.find(s => s.id === sprinklerId)?.name ?? sprinklerId
      addLog(`${name} yapıldı, heybeye kondu. Götürüp çiftliğe yerleştir.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftFertilizer = (fertilizerId: string) => {
    if (processingStore.craftFertilizer(fertilizerId)) {
      sfxClick()
      const name = FERTILIZERS.find(f => f.id === fertilizerId)?.name ?? fertilizerId
      addLog(`${name} yapıldı, heybeye kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftBait = (baitId: string) => {
    if (processingStore.craftBait(baitId)) {
      sfxClick()
      const name = BAITS.find(b => b.id === baitId)?.name ?? baitId
      addLog(`${name} yapıldı, heybeye kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftTackle = (tackleId: string) => {
    if (processingStore.craftTackle(tackleId)) {
      sfxClick()
      const name = TACKLES.find(t => t.id === tackleId)?.name ?? tackleId
      addLog(`${name} yapıldı, heybeye kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftCrabPot = () => {
    if (processingStore.craftCrabPot()) {
      sfxClick()
      addLog(`${CRAB_POT_CRAFT.name} yapıldı, heybeye kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftTapper = () => {
    if (processingStore.craftTapper()) {
      sfxClick()
      addLog(`Öz çekici yapıldı, heybeye kondu. Götürüp yaban ağacına kur.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftLightningRod = () => {
    if (processingStore.consumeCraftMaterials(LIGHTNING_ROD.craftCost, LIGHTNING_ROD.craftMoney)) {
      sfxClick()
      farmStore.lightningRods++
      addLog(`Yıldırım kıran yapıldı, çiftliğe kuruldu. (Toplam ${farmStore.lightningRods})`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftScarecrow = () => {
    if (processingStore.consumeCraftMaterials(SCARECROW.craftCost, SCARECROW.craftMoney)) {
      sfxClick()
      farmStore.scarecrows++
      addLog(`Korkuluk yapıldı, çiftliğe kuruldu. (Toplam ${farmStore.scarecrows})`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftAutoPetter = (buildingType: AnimalBuildingType) => {
    if (animalStore.hasAutoPetter(buildingType)) {
      addLog('Bu hayvan evine otomatik sevici çoktan kurulmuş.')
      return
    }
    if (processingStore.consumeCraftMaterials(AUTO_PETTER.craftCost, AUTO_PETTER.craftMoney)) {
      sfxClick()
      const result = animalStore.installAutoPetter(buildingType)
      addLog(result.message)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftBomb = (bombId: string) => {
    if (processingStore.craftBomb(bombId)) {
      sfxClick()
      const name = BOMBS.find(b => b.id === bombId)?.name ?? bombId
      addLog(`${name} yapıldı, heybeye kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftJadeRing = () => {
    if (!canCraftJadeRing.value) return
    if (!playerStore.spendMoney(JADE_RING_MONEY)) return
    for (const c of JADE_RING_COST) {
      if (!removeCombinedItem(c.itemId, c.quantity)) {
        playerStore.earnMoney(JADE_RING_MONEY)
        return
      }
    }
    inventoryStore.addItem('jade_ring')
    sfxClick()
    addLog('Yeşim Yüzük yapıldı! Evlilik teklifinde kullanılabilir.')
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  }

  const handleCraftStaminaFruit = () => {
    if (!canCraftStaminaFruit.value) return
    if (processingStore.consumeCraftMaterials(STAMINA_FRUIT_COST, STAMINA_FRUIT_MONEY)) {
      sfxClick()
      inventoryStore.addItem('stamina_fruit')
      addLog('Kutlu Şeftali yapıldı! Heybeden kullanınca güç sınırın kalıcı artar.')
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  const handleCraftChest = (tier: ChestTier) => {
    const def = CHEST_DEFS[tier]
    if (warehouseStore.chests.length >= warehouseStore.maxChests) {
      addLog('Sandık yerleri dolu; önce ambarı genişlet.')
      return
    }
    if (processingStore.consumeCraftMaterials(def.craftCost, def.craftMoney)) {
      sfxClick()
      warehouseStore.addChest(tier)
      addLog(`${def.name} yapıldı, ambarına kondu.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.craftMachine)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
    } else {
      addLog('Gereçler eksik.')
    }
  }

  // === İşleme işlemleri ===

  const handleStartProcessing = (slotIndex: number, recipeId: string) => {
    if (processingStore.startProcessing(slotIndex, recipeId)) {
      sfxClick()
      const recipe = getProcessingRecipeById(recipeId)
      addLog(`${recipe?.name ?? recipeId} işlenmeye başladı, ${recipe?.processingDays ?? '?'} gün sürecek.`)
    } else {
      addLog('Hammadde eksik ya da düzenek meşgul.')
    }
  }

  const handleCollect = (slotIndex: number) => {
    const outputId = processingStore.collectProduct(slotIndex)
    if (outputId) {
      sfxClick()
      const name = getItemById(outputId)?.name ?? outputId
      addLog(`${name} alındı!`)
    }
  }

  const handleRemoveMachine = (slotIndex: number) => {
    const slot = processingStore.machines[slotIndex]
    if (!slot) return
    const name = getMachineName(slot.machineType)
    if (processingStore.removeMachine(slotIndex)) {
      addLog(`${name} söküldü, yapım gereçleri geri verildi.`)
    }
  }

  const handleCancelProcessing = (slotIndex: number) => {
    const slot = processingStore.machines[slotIndex]
    if (!slot) return
    const name = getMachineName(slot.machineType)
    if (processingStore.cancelProcessing(slotIndex)) {
      addLog(`${name} işlemesi durduruldu, hammaddeler geri verildi.`)
    }
  }
</script>
