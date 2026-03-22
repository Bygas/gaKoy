<template>
  <div>
    <!-- Başlık -->
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center space-x-1.5 text-sm text-accent">
        <Wrench :size="14" />
        <span>Alet Yükseltme</span>
      </div>
      <span class="text-xs text-muted">Demirci · Küçük Dolunay</span>
    </div>
    <p class="text-xs text-muted mb-3">Metal külçeleri ve akçe harcayarak aletini yükseltirsin; işin bitmesi 2 gün sürer.</p>

    <!-- Sürmekte olan dövüm bildirisi -->
    <div v-if="inventoryStore.pendingUpgrade" class="border border-accent/30 rounded-xs px-3 py-2 mb-3 flex items-center justify-between">
      <div class="flex items-center space-x-1.5">
        <Clock :size="12" class="text-accent shrink-0" />
        <span class="text-xs text-accent">
          Dövülüyor: 「{{ TOOL_NAMES[inventoryStore.pendingUpgrade.toolType] }}」→ {{ TIER_NAMES[inventoryStore.pendingUpgrade.targetTier] }}
        </span>
      </div>
      <span class="text-xs text-muted whitespace-nowrap ml-2">Kalan {{ inventoryStore.pendingUpgrade.daysRemaining }} gün</span>
    </div>

    <div class="flex flex-col space-y-1.5">
      <div
        v-for="tool in inventoryStore.tools"
        :key="tool.type"
        class="flex items-center justify-between border rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
        :class="isUpgrading(tool.type) ? 'border-accent/30' : 'border-accent/20'"
        @click="selectedTool = tool.type"
      >
        <div class="min-w-0">
          <span class="text-sm" :class="isUpgrading(tool.type) ? 'text-accent' : ''">{{ TOOL_NAMES[tool.type] }}</span>
          <p class="text-xs text-muted">{{ TIER_NAMES[tool.tier] }}</p>
        </div>
        <span v-if="isUpgrading(tool.type)" class="text-xs text-accent whitespace-nowrap ml-2">Dövümde</span>
        <span v-else-if="getUpgradeCost(tool.type, tool.tier)" class="text-xs text-muted whitespace-nowrap ml-2">
          → {{ TIER_NAMES[getUpgradeCost(tool.type, tool.tier)!.toTier] }}
        </span>
        <CircleCheck v-else :size="14" class="text-success shrink-0 ml-2" />
      </div>
    </div>

    <!-- Alet ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="selectedTool"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="selectedTool = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="selectedTool = null">
            <X :size="14" />
          </button>

          <p class="text-sm mb-2" :class="isUpgrading(selectedTool) ? 'text-accent' : 'text-text'">
            {{ TOOL_NAMES[selectedTool] }}
          </p>

          <!-- Şimdiki durum -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Şimdiki seviye</span>
              <span class="text-xs">{{ TIER_NAMES[selectedToolObj!.tier] }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Güç tasarrufu</span>
              <span class="text-xs">{{ staminaText(selectedToolObj!.tier) }}</span>
            </div>
            <template v-if="selectedTool === 'fishingRod'">
              <div class="flex items-center justify-between mt-0.5">
                <span class="text-xs text-muted">İğne erimi</span>
                <span class="text-xs">{{ ROD_HOOK[selectedToolObj!.tier] }}</span>
              </div>
              <div class="flex items-center justify-between mt-0.5">
                <span class="text-xs text-muted">Av süresi</span>
                <span class="text-xs">{{ ROD_TIME[selectedToolObj!.tier] }} saniye</span>
              </div>
            </template>
            <div v-if="isUpgrading(selectedTool)" class="flex items-center justify-between mt-1">
              <span class="text-xs text-muted">Dövüm hedefi</span>
              <span class="text-xs text-accent">{{ TIER_NAMES[inventoryStore.pendingUpgrade!.targetTier] }}</span>
            </div>
            <div v-if="isUpgrading(selectedTool)" class="flex items-center space-x-2 mt-1.5">
              <span class="text-xs text-muted shrink-0">İlerleyiş</span>
              <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                <div
                  class="h-full rounded-xs bg-accent transition-all"
                  :style="{ width: ((2 - inventoryStore.pendingUpgrade!.daysRemaining) / 2) * 100 + '%' }"
                />
              </div>
              <span class="text-xs text-muted whitespace-nowrap">{{ 2 - inventoryStore.pendingUpgrade!.daysRemaining }}/2 gün</span>
            </div>
          </div>

          <!-- Yükseltme bilgisi -->
          <template v-if="!isUpgrading(selectedTool) && selectedUpgradeCost">
            <div class="border border-accent/10 rounded-xs p-2 mb-2">
              <p class="text-xs text-muted mb-1">{{ TIER_NAMES[selectedUpgradeCost.toTier] }} düzeyine yükselt</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted">Akçe</span>
                <span class="text-xs" :class="playerStore.money >= selectedUpgradeCost.money ? '' : 'text-danger'">
                  {{ selectedUpgradeCost.money }} akçe
                </span>
              </div>
              <div v-for="mat in selectedUpgradeCost.materials" :key="mat.itemId" class="flex items-center justify-between mt-0.5">
                <span class="text-xs text-muted">{{ getItemById(mat.itemId)?.name ?? mat.itemId }}</span>
                <span class="text-xs" :class="getCombinedItemCount(mat.itemId) >= mat.quantity ? '' : 'text-danger'">
                  {{ getCombinedItemCount(mat.itemId) }}/{{ mat.quantity }}
                </span>
              </div>
              <template v-if="selectedFriendshipReq">
                <div class="flex items-center justify-between mt-0.5">
                  <span class="text-xs text-muted">Küçük Dolunay gönül bağı</span>
                  <span
                    class="text-xs"
                    :class="meetsLevel(npcStore.getFriendshipLevel('xiao_man'), selectedFriendshipReq) ? '' : 'text-danger'"
                  >
                    {{ LEVEL_NAMES[npcStore.getFriendshipLevel('xiao_man')] }} / {{ LEVEL_NAMES[selectedFriendshipReq] }}
                  </span>
                </div>
              </template>
            </div>

            <!-- Yükseltme etkisi ön gösterimi -->
            <div class="border border-success/20 rounded-xs p-2 mb-2">
              <p class="text-xs text-muted mb-1">Yükseltme etkisi</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted">Güç tasarrufu</span>
                <span class="text-xs">
                  {{ staminaText(selectedToolObj!.tier) }} →
                  <span class="text-success">{{ staminaText(selectedUpgradeCost.toTier) }}</span>
                </span>
              </div>
              <template v-if="selectedTool === 'fishingRod'">
                <div class="flex items-center justify-between mt-0.5">
                  <span class="text-xs text-muted">İğne erimi</span>
                  <span class="text-xs">
                    {{ ROD_HOOK[selectedToolObj!.tier] }} →
                    <span class="text-success">{{ ROD_HOOK[selectedUpgradeCost.toTier] }}</span>
                  </span>
                </div>
                <div class="flex items-center justify-between mt-0.5">
                  <span class="text-xs text-muted">Av süresi</span>
                  <span class="text-xs">
                    {{ ROD_TIME[selectedToolObj!.tier] }} saniye →
                    <span class="text-success">{{ ROD_TIME[selectedUpgradeCost.toTier] }} saniye</span>
                  </span>
                </div>
              </template>
            </div>

            <p v-if="getUpgradeBlockReason(selectedTool)" class="text-xs text-danger mb-2">
              {{ getUpgradeBlockReason(selectedTool) }}
            </p>

            <button
              class="btn text-xs w-full justify-center"
              :class="{ '!bg-accent !text-bg': canUpgrade(selectedTool) }"
              :disabled="!canUpgrade(selectedTool)"
              @click="handleUpgradeAndClose(selectedTool)"
            >
              <ArrowUp :size="12" />
              Yükselt · {{ selectedUpgradeCost.money }} akçe
            </button>
          </template>

          <!-- En üst seviye -->
          <div v-else-if="!isUpgrading(selectedTool)" class="border border-success/30 rounded-xs p-2">
            <div class="flex items-center justify-center space-x-1">
              <CircleCheck :size="12" class="text-success" />
              <span class="text-xs text-success">En yüksek düzeye ulaştı</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ArrowUp, Wrench, Clock, CircleCheck, X } from 'lucide-vue-next'
  import { useGameStore } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { useNpcStore } from '@/stores/useNpcStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { getCombinedItemCount, removeCombinedItem } from '@/composables/useCombinedInventory'
  import { getUpgradeCost, TOOL_NAMES, TIER_NAMES, getItemById } from '@/data'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'
  import type { ToolType, ToolTier, FriendshipLevel } from '@/types'

  /** Yükseltme hedef düzeyi → gereken Küçük Dolunay gönül bağı */
  const TIER_FRIENDSHIP_REQ: Partial<Record<ToolTier, FriendshipLevel>> = {
    iron: 'acquaintance',
    steel: 'friendly',
    iridium: 'bestFriend'
  }

  /** Her düzeyde güç tüketim katsayısı (useInventoryStore ile uyumlu) */
  const STAMINA_MULTIPLIERS: Record<ToolTier, number> = { basic: 1.0, iron: 0.8, steel: 0.6, iridium: 0.4 }
  const ROD_HOOK: Record<ToolTier, number> = { basic: 40, iron: 45, steel: 50, iridium: 60 }
  const ROD_TIME: Record<ToolTier, number> = { basic: 30, iron: 33, steel: 36, iridium: 40 }

  const staminaText = (tier: ToolTier): string => {
    const r = Math.round((1 - STAMINA_MULTIPLIERS[tier]) * 100)
    return r > 0 ? `-%${r}` : 'Artı yok'
  }
  const LEVEL_ORDER: FriendshipLevel[] = ['stranger', 'acquaintance', 'friendly', 'bestFriend']
  const LEVEL_NAMES: Record<FriendshipLevel, string> = {
    stranger: 'Yabancı',
    acquaintance: 'Tanış',
    friendly: 'Ahbap',
    bestFriend: 'Can Dost'
  }
  const meetsLevel = (current: FriendshipLevel, required: FriendshipLevel): boolean =>
    LEVEL_ORDER.indexOf(current) >= LEVEL_ORDER.indexOf(required)

  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const npcStore = useNpcStore()
  const gameStore = useGameStore()

  // === Pencere durumu ===

  const selectedTool = ref<ToolType | null>(null)

  const selectedToolObj = computed(() => {
    if (!selectedTool.value) return null
    return inventoryStore.getTool(selectedTool.value) ?? null
  })

  const selectedUpgradeCost = computed(() => {
    if (!selectedToolObj.value) return null
    return getUpgradeCost(selectedToolObj.value.type, selectedToolObj.value.tier) ?? null
  })

  const selectedFriendshipReq = computed(() => {
    if (!selectedUpgradeCost.value) return null
    return TIER_FRIENDSHIP_REQ[selectedUpgradeCost.value.toTier] ?? null
  })

  /** Bu alet şimdi dövümde mi */
  const isUpgrading = (type: ToolType): boolean => {
    return inventoryStore.pendingUpgrade?.toolType === type
  }

  const canUpgrade = (type: ToolType): boolean => {
    // Başka bir alet dövümdeyse yenisi yükselmez
    if (inventoryStore.pendingUpgrade) return false

    const tool = inventoryStore.getTool(type)
    if (!tool) return false
    const cost = getUpgradeCost(type, tool.tier)
    if (!cost) return false

    const requiredLevel = TIER_FRIENDSHIP_REQ[cost.toTier]
    if (requiredLevel && !meetsLevel(npcStore.getFriendshipLevel('xiao_man'), requiredLevel)) return false

    if (playerStore.money < cost.money) return false
    for (const mat of cost.materials) {
      if (getCombinedItemCount(mat.itemId) < mat.quantity) return false
    }
    return true
  }

  /** Yükseltmenin neden durduğunu döndürür (arayüz bildirisi için); yükseltilebiliyorsa boş dizge döner */
  const getUpgradeBlockReason = (type: ToolType): string => {
    if (inventoryStore.pendingUpgrade) return 'Küçük Dolunay başka bir aleti dövüyor'

    const tool = inventoryStore.getTool(type)
    if (!tool) return ''
    const cost = getUpgradeCost(type, tool.tier)
    if (!cost) return ''

    const requiredLevel = TIER_FRIENDSHIP_REQ[cost.toTier]
    if (requiredLevel && !meetsLevel(npcStore.getFriendshipLevel('xiao_man'), requiredLevel)) {
      return `Küçük Dolunay ile gönül bağın en az 「${LEVEL_NAMES[requiredLevel]}」 olmalı`
    }

    if (playerStore.money < cost.money) return 'Akçen yetmiyor'
    for (const mat of cost.materials) {
      if (getCombinedItemCount(mat.itemId) < mat.quantity) {
        const itemName = getItemById(mat.itemId)?.name ?? mat.itemId
        return `${itemName} eksik (${getCombinedItemCount(mat.itemId)}/${mat.quantity})`
      }
    }
    return ''
  }

  const handleUpgradeAndClose = (type: ToolType) => {
    const tool = inventoryStore.getTool(type)
    if (!tool) return
    const cost = getUpgradeCost(type, tool.tier)
    if (!cost) return
    if (!canUpgrade(type)) {
      addLog('Şartlar eksik; yükseltme yapılamadı.')
      return
    }

    playerStore.spendMoney(cost.money)
    for (const mat of cost.materials) {
      removeCombinedItem(mat.itemId, mat.quantity)
    }
    inventoryStore.startUpgrade(type, cost.toTier)

    addLog(`Sen ${TOOL_NAMES[type]} ile gereken gereçleri Küçük Dolunay’a verdin, bir de ${cost.money} akçe ödedin. 2 gün sonra yükselmiş aleti geri alabilirsin.`)
    selectedTool.value = null
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.toolUpgrade)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) {
      handleEndDay()
      return
    }
  }
</script>
