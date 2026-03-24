import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RecipeDef, Quality } from '@/types'
import { getRecipeById } from '@/data'
import { useInventoryStore } from './useInventoryStore'
import { usePlayerStore } from './usePlayerStore'
import { useSkillStore } from './useSkillStore'
import { useAchievementStore } from './useAchievementStore'
import { useWalletStore } from './useWalletStore'
import { useHomeStore } from './useHomeStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'
import { getCombinedItemCount, removeCombinedItem, getLowestCombinedQuality } from '@/composables/useCombinedInventory'

const QUALITY_ORDER: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
const QUALITY_MULTIPLIER: Record<Quality, number> = { normal: 1, fine: 1.25, excellent: 1.5, supreme: 2 }
const QUALITY_LABEL: Record<Quality, string> = { normal: '', fine: 'Seçkin', excellent: 'Nefis', supreme: 'Kutlu' }

export const useCookingStore = defineStore('cooking', () => {
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const skillStore = useSkillStore()

  /** Açılmış yemek tariflerinin kimlikleri */
  const unlockedRecipes = ref<string[]>([
    'stir_fried_cabbage',
    'honey_tea',
    'ginger_soup',
    'bamboo_shoot_stir_fry',
    'dried_persimmon',
    'sesame_paste',
    'corn_pancake',
    'scrambled_egg_rice',
    'stir_fried_potato',
    'boiled_egg',
    'congee',
    'roasted_sweet_potato',
    'vegetable_soup',
    'chive_egg_stir_fry',
    'peanut_candy',
    'silkie_egg_soup'
  ])

  /** O gün etkili olan yemek bereketi */
  const activeBuff = ref<RecipeDef['effect']['buff'] | null>(null)

  /** Açılmış tarif tanımları */
  const recipes = computed(() => unlockedRecipes.value.map(id => getRecipeById(id)).filter((r): r is RecipeDef => r !== undefined))

  /** Gereç yetiyor mu */
  const canCook = (recipeId: string): boolean => {
    const recipe = getRecipeById(recipeId)
    if (!recipe) return false
    if (!unlockedRecipes.value.includes(recipeId)) return false

    // Hüner düzeyi eşiği
    if (recipe.requiredSkill) {
      const skill = skillStore.getSkill(recipe.requiredSkill.type)
      if (skill.level < recipe.requiredSkill.level) return false
    }

    return recipe.ingredients.every(ing => getCombinedItemCount(ing.itemId) >= ing.quantity)
  }

  /** En çok kaç pay pişirilebilir */
  const maxCookable = (recipeId: string): number => {
    const recipe = getRecipeById(recipeId)
    if (!recipe) return 0
    if (!unlockedRecipes.value.includes(recipeId)) return 0
    if (recipe.requiredSkill) {
      const skill = skillStore.getSkill(recipe.requiredSkill.type)
      if (skill.level < recipe.requiredSkill.level) return 0
    }

    let max = Infinity
    for (const ing of recipe.ingredients) {
      const available = getCombinedItemCount(ing.itemId)
      max = Math.min(max, Math.floor(available / ing.quantity))
    }
    return max === Infinity ? 0 : max
  }

  /** Pişirme niteliğini önceden göster (bütün gereçlerin en düşük niteliği alınır) */
  const previewCookQuality = (recipeId: string): Quality => {
    const recipe = getRecipeById(recipeId)
    if (!recipe) return 'normal'
    let minIdx = 3
    for (const ing of recipe.ingredients) {
      const q = getLowestCombinedQuality(ing.itemId)
      const idx = QUALITY_ORDER.indexOf(q)
      if (idx < minIdx) minIdx = idx
    }
    return QUALITY_ORDER[minIdx]!
  }

  /** Pişir */
  const cook = (recipeId: string, quantity: number = 1): { success: boolean; message: string } => {
    const recipe = getRecipeById(recipeId)
    if (!recipe) return { success: false, message: 'Tarif bulunamadı.' }
    if (!unlockedRecipes.value.includes(recipeId)) return { success: false, message: 'Bu tarif henüz açılmadı.' }

    // En çok kaç pay yapılabilir
    let maxPossible = quantity
    for (const ing of recipe.ingredients) {
      const available = getCombinedItemCount(ing.itemId)
      maxPossible = Math.min(maxPossible, Math.floor(available / ing.quantity))
    }
    if (maxPossible <= 0) return { success: false, message: 'Gereçler yetmiyor.' }

    // Nitelik hesabı: bütün gereçlerin en düşüğü alınır
    let minQualityIndex = 3
    for (const ing of recipe.ingredients) {
      const quality = getLowestCombinedQuality(ing.itemId)
      const idx = QUALITY_ORDER.indexOf(quality)
      if (idx < minQualityIndex) minQualityIndex = idx
    }
    const resultQuality = QUALITY_ORDER[minQualityIndex]!

    // Gereçleri topluca düş
    for (const ing of recipe.ingredients) {
      removeCombinedItem(ing.itemId, ing.quantity * maxPossible)
    }

    // Yemeği heybeye ekle
    inventoryStore.addItem(`food_${recipe.id}`, maxPossible, resultQuality)
    for (let i = 0; i < maxPossible; i++) {
      useAchievementStore().recordRecipeCooked()
    }

    const qualityTag = QUALITY_LABEL[resultQuality] ? `【${QUALITY_LABEL[resultQuality]}】` : ''
    const qtyTag = maxPossible > 1 ? `${maxPossible} pay ` : ''
    return { success: true, message: `${qtyTag}${qualityTag}${recipe.name} pişirildi!` }
  }

  /** Pişmiş yemeği ye */
  const eat = (recipeId: string, quality: Quality = 'normal'): { success: boolean; message: string } => {
    const foodItemId = `food_${recipeId}`
    if (!inventoryStore.removeItem(foodItemId, 1, quality)) {
      return { success: false, message: 'Heybende bu yemek yok.' }
    }

    const recipe = getRecipeById(recipeId)
    if (!recipe) return { success: false, message: 'Tarif kaydı eksik.' }

    // Nitelik bereketi
    const qualityBonus = QUALITY_MULTIPLIER[quality]
    // Cevherci ustalığı: yemek onarımı +%50
    const walletStore = useWalletStore()
    const homeStore = useHomeStore()
    const chefBonus = 1 + walletStore.getCookingRestoreBonus()
    const alchemistBonus = skillStore.getSkill('foraging').perk10 === 'alchemist' ? 1.5 : 1.0
    const kitchenBonus = homeStore.getKitchenBonus()
    // Kutlu kudret: Ay sofrası
    const moonRabbitBonus = useHiddenNpcStore().isAbilityActive('yue_tu_2') ? 1.5 : 1.0

    const staminaRestore = Math.floor(
      recipe.effect.staminaRestore * qualityBonus * alchemistBonus * chefBonus * kitchenBonus * moonRabbitBonus
    )
    playerStore.restoreStamina(staminaRestore)

    const qualityTag = QUALITY_LABEL[quality] ? `【${QUALITY_LABEL[quality]}】` : ''
    let msg = `${qualityTag}${recipe.name} yenildi, ${staminaRestore} takat geri geldi`

    if (recipe.effect.healthRestore) {
      const healthRestore = Math.floor(
        recipe.effect.healthRestore * qualityBonus * alchemistBonus * chefBonus * kitchenBonus * moonRabbitBonus
      )
      playerStore.restoreHealth(healthRestore)
      msg += `, ${healthRestore} can toparlandı`
    }
    msg += '。'

    if (recipe.effect.buff) {
      activeBuff.value = { ...recipe.effect.buff }
      msg += ` ${recipe.effect.buff.description}`
      // “Takatı bütünüyle yeniler” türü bereket
      if (recipe.effect.buff.type === 'stamina') {
        playerStore.restoreStamina(playerStore.maxStamina)
      }
    }

    return { success: true, message: msg }
  }

  /** Tarif aç */
  const unlockRecipe = (recipeId: string): boolean => {
    if (unlockedRecipes.value.includes(recipeId)) return false
    const recipe = getRecipeById(recipeId)
    if (!recipe) return false
    unlockedRecipes.value.push(recipeId)
    return true
  }

  /** Günlük bereketi sıfırla */
  const dailyReset = () => {
    activeBuff.value = null
  }

  const serialize = () => {
    return { unlockedRecipes: unlockedRecipes.value, activeBuff: activeBuff.value }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    unlockedRecipes.value = data.unlockedRecipes
    activeBuff.value = data.activeBuff
  }

  return {
    unlockedRecipes,
    activeBuff,
    recipes,
    canCook,
    maxCookable,
    previewCookQuality,
    cook,
    eat,
    unlockRecipe,
    dailyReset,
    serialize,
    deserialize
  }
})
