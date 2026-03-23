<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-accent text-sm">Ocak</h3>
      <button
        class="text-[10px] px-2 py-0.5 border rounded-xs"
        :class="showOnlyMakeable ? 'border-accent text-accent' : 'border-accent/20 text-muted'"
        @click="showOnlyMakeable = !showOnlyMakeable"
      >
        {{ showOnlyMakeable ? 'Yapılabilir' : 'Tümü' }}
      </button>
    </div>
    <p v-if="tutorialHint" class="text-[10px] text-muted/50 mb-2">{{ tutorialHint }}</p>

    <!-- Güncel güçlendirme -->
    <div v-if="cookingStore.activeBuff" class="border border-water/20 rounded-xs px-3 py-1.5 mb-3">
      <p class="text-[10px] text-water">
        <Zap :size="12" class="inline mr-0.5" />
        Geçerli güçlendirme: {{ cookingStore.activeBuff.description }}
      </p>
    </div>

    <!-- Tarif listesi -->
    <div v-if="displayedRecipeInfos.length > 0" class="border border-accent/20 rounded-xs divide-y divide-accent/10 mb-4">
      <div
        v-for="info in displayedRecipeInfos"
        :key="info.recipe.id"
        class="px-3 py-1.5 cursor-pointer hover:bg-accent/5"
        @click="openModal(info.recipe.id)"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs" :class="info.canCook ? 'text-text' : 'text-muted'">
            {{ info.recipe.name }}
            <span v-if="info.canCook && info.quality !== 'normal'" class="text-[10px] ml-0.5" :class="qualityTextClass(info.quality)">
              [{{ QUALITY_NAMES[info.quality] }}]
            </span>
          </span>
          <span class="text-[10px] whitespace-nowrap ml-2" :class="info.canCook ? 'text-success' : 'text-muted/50'">
            +{{ info.recipe.effect.staminaRestore }} güç
            <span v-if="info.recipe.effect.healthRestore">+{{ info.recipe.effect.healthRestore }} can</span>
          </span>
        </div>
        <p v-if="info.recipe.effect.buff" class="text-[10px] text-water mt-0.5">{{ info.recipe.effect.buff.description }}</p>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-8 mb-4">
      <UtensilsCrossed :size="36" class="text-accent/20 mb-2" />
      <p v-if="showOnlyMakeable" class="text-xs text-muted">Yapılabilir yemek yok</p>
      <p v-else-if="cookingStore.recipes.length === 0" class="text-xs text-muted">Henüz tarif yok</p>
      <p v-if="showOnlyMakeable" class="text-[10px] text-muted/50 mt-0.5">Süzgeci kapat ya da daha çok erzak topla</p>
      <p v-else-if="cookingStore.recipes.length === 0" class="text-[10px] text-muted/50 mt-0.5">gaKöy halkıyla yakınlaş ya da haber tahtasını izle</p>
    </div>

    <!-- Yemek pişirme penceresi -->
    <Transition name="panel-fade">
      <div v-if="modalInfo" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeModal">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="closeModal">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">
            {{ modalInfo.recipe.name }}
            <span
              v-if="modalInfo.canCook && modalInfo.quality !== 'normal'"
              class="text-[10px] ml-0.5"
              :class="qualityTextClass(modalInfo.quality)"
            >
              [{{ QUALITY_NAMES[modalInfo.quality] }}]
            </span>
          </p>

          <!-- Etki -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-success">
              {{ modalInfo.recipe.effect.staminaRestore }} güç yeniler
              <span v-if="modalInfo.recipe.effect.healthRestore" class="text-danger ml-1">
                {{ modalInfo.recipe.effect.healthRestore }} can
              </span>
            </p>
            <p v-if="modalInfo.recipe.effect.buff" class="text-xs text-water mt-0.5">
              {{ modalInfo.recipe.effect.buff.description }}
            </p>
          </div>

          <!-- Gerekenler -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted mb-1">Gerekli malzeme</p>
            <div v-for="ing in modalInfo.ingredients" :key="ing.itemId" class="flex items-center justify-between">
              <span class="text-xs text-muted">{{ ing.name }}</span>
              <span class="text-xs" :class="ing.enough ? '' : 'text-danger'">{{ ing.available }}/{{ ing.quantity }}</span>
            </div>
          </div>

          <!-- Adet seçimi -->
          <div v-if="modalInfo.maxQty > 1" class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-muted">Adet</span>
              <div class="flex items-center space-x-1">
                <Button class="h-6 px-1.5 py-0.5 text-xs justify-center" :disabled="modalQty <= 1" @click="modalQty--">
                  <Minus :size="12" />
                </Button>
                <input
                  type="number"
                  :value="modalQty"
                  min="1"
                  :max="modalInfo.maxQty"
                  class="w-24 h-6 px-2 py-0.5 bg-bg border border-accent/30 rounded-xs text-xs text-center text-accent outline-none focus:border-accent transition-colors"
                  @input="onModalQtyInput"
                />
                <Button class="h-6 px-1.5 py-0.5 text-xs justify-center" :disabled="modalQty >= modalInfo.maxQty" @click="modalQty++">
                  <Plus :size="12" />
                </Button>
              </div>
            </div>
            <div class="flex space-x-1">
              <Button class="flex-1 justify-center" :disabled="modalQty <= 1" @click="modalQty = 1">En az</Button>
              <Button class="flex-1 justify-center" :disabled="modalQty >= modalInfo.maxQty" @click="modalQty = modalInfo.maxQty">
                En çok
              </Button>
            </div>
            <div class="flex items-center justify-between mt-1.5">
              <span class="text-xs text-muted">Yapılabilir</span>
              <span class="text-xs text-accent">{{ modalInfo.maxQty }} tabak</span>
            </div>
          </div>

          <!-- Pişirme düğmesi -->
          <Button
            class="w-full justify-center"
            :class="{ '!bg-accent !text-bg': modalInfo.canCook }"
            :icon="UtensilsCrossed"
            :icon-size="12"
            :disabled="!modalInfo.canCook"
            @click="handleCookFromModal"
          >
            Pişir{{ modalQty > 1 ? ` ×${modalQty}` : '' }}
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { UtensilsCrossed, Zap, X, Minus, Plus } from 'lucide-vue-next'
  import { useAchievementStore } from '@/stores/useAchievementStore'
  import { useCookingStore } from '@/stores/useCookingStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useTutorialStore } from '@/stores/useTutorialStore'
  import { getCombinedItemCount } from '@/composables/useCombinedInventory'
  import { getItemById } from '@/data'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import { sfxClick } from '@/composables/useAudio'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'
  import { QUALITY_NAMES } from '@/composables/useFarmActions'
  import type { Quality } from '@/types'
  import Button from '@/components/game/Button.vue'

  const cookingStore = useCookingStore()
  const gameStore = useGameStore()
  const achievementStore = useAchievementStore()
  const tutorialStore = useTutorialStore()

  const showOnlyMakeable = ref(false)
  const modalRecipeId = ref<string | null>(null)
  const modalQty = ref(1)

  /** Tarif bilgisini önceden hesapla (adet hariç, böylece adet değişince hepsi yeniden hesaplanmaz) */
  const recipeInfos = computed(() => {
    return cookingStore.recipes.map(recipe => {
      const canCook = cookingStore.canCook(recipe.id)
      const maxQty = cookingStore.maxCookable(recipe.id)
      const quality = cookingStore.previewCookQuality(recipe.id)
      const ingredients = recipe.ingredients.map(ing => {
        const item = getItemById(ing.itemId)
        const available = getCombinedItemCount(ing.itemId)
        return {
          itemId: ing.itemId,
          name: item?.name ?? ing.itemId,
          quantity: ing.quantity,
          available,
          enough: available >= ing.quantity
        }
      })
      return { recipe, canCook, maxQty, quality, ingredients }
    })
  })

  const displayedRecipeInfos = computed(() => {
    if (!showOnlyMakeable.value) return recipeInfos.value
    return recipeInfos.value.filter(info => info.canCook)
  })

  /** Şu an açık olan pencerenin tarif bilgisi */
  const modalInfo = computed(() => {
    if (!modalRecipeId.value) return null
    return recipeInfos.value.find(i => i.recipe.id === modalRecipeId.value) ?? null
  })

  const openModal = (recipeId: string) => {
    modalRecipeId.value = recipeId
    modalQty.value = 1
  }

  const closeModal = () => {
    modalRecipeId.value = null
  }

  const onModalQtyInput = (event: Event) => {
    const val = parseInt((event.target as HTMLInputElement).value) || 1
    const max = modalInfo.value?.maxQty ?? 1
    modalQty.value = Math.max(1, Math.min(val, max))
  }

  const qualityTextClass = (quality: Quality): string => {
    const map: Record<Quality, string> = {
      normal: '',
      fine: 'text-water',
      excellent: 'text-purple-400',
      supreme: 'text-accent'
    }
    return map[quality]
  }

  const tutorialHint = computed(() => {
    if (!tutorialStore.enabled || gameStore.year > 1) return null
    if (achievementStore.stats.totalRecipesCooked === 0)
      return 'Bir tarife dokunup ayrıntılarını gör, sonra pişir. Yemekler güç ve can yeniler; nitelikli malzeme daha iyi aş verir.'
    return null
  })

  const handleCookFromModal = () => {
    if (!modalInfo.value || !modalInfo.value.canCook) return
    if (gameStore.isPastBedtime) {
      addLog('Gece çok ilerledi, artık ocak başına geçilmez.')
      handleEndDay()
      closeModal()
      return
    }
    const qty = Math.min(modalQty.value, modalInfo.value.maxQty)
    const result = cookingStore.cook(modalInfo.value.recipe.id, qty)
    sfxClick()
    addLog(result.message)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.cook * qty)
    if (tr.message) addLog(tr.message)
    closeModal()
    if (tr.passedOut) handleEndDay()
  }
</script>
