import type { Component } from 'vue'
import router from '@/router'
import { useGameStore } from '@/stores/useGameStore'
import { isShopOpen, TAB_TO_LOCATION_GROUP } from '@/data/timeConstants'
import { addLog, showFloat } from './useGameLog'
import { handleEndDay } from './useEndDay'
import { sfxClick, useAudio } from './useAudio'
import { useGameClock } from './useGameClock'
import { useTutorialStore } from '@/stores/useTutorialStore'
import {
  Wheat,
  Egg,
  Home,
  Heart,
  Building,
  Users,
  Store,
  TreePine,
  Fish,
  Pickaxe,
  Flame,
  Cog,
  Wrench,
  Package,
  Star,
  BookOpen,
  Wallet,
  ScrollText,
  User,
  FlaskConical,
  Landmark,
  Swords,
  Tent,
  Waves
} from 'lucide-vue-next'
import { useNpcStore } from '@/stores/useNpcStore'

export type PanelKey =
  | 'farm'
  | 'shop'
  | 'inventory'
  | 'fishing'
  | 'mining'
  | 'village'
  | 'cooking'
  | 'forage'
  | 'upgrade'
  | 'skills'
  | 'workshop'
  | 'achievement'
  | 'animal'
  | 'home'
  | 'wallet'
  | 'quest'
  | 'charinfo'
  | 'breeding'
  | 'museum'
  | 'guild'
  | 'hanhai'
  | 'fishpond'
  | 'cottage'

export const TABS: { key: PanelKey; label: string; icon: Component; getIcon?: () => Component }[] = [
  { key: 'farm', label: 'Tarla', icon: Wheat },
  { key: 'animal', label: 'Hayvanlık', icon: Egg },
  { key: 'cottage', label: 'Ev', icon: Home, getIcon: () => (useNpcStore().getSpouse() ? Heart : Home) },
  { key: 'home', label: 'Yapılar', icon: Building },
  { key: 'breeding', label: 'Islah', icon: FlaskConical },
  { key: 'fishpond', label: 'Balık Göleti', icon: Waves },
  { key: 'village', label: 'gaKöy', icon: Users },
  { key: 'shop', label: 'Çarşı', icon: Store },
  { key: 'forage', label: 'Kamışlık', icon: TreePine },
  { key: 'fishing', label: 'Akarsu', icon: Fish },
  { key: 'mining', label: 'Maden Ocağı', icon: Pickaxe },
  { key: 'cooking', label: 'Ocakbaşı', icon: Flame },
  { key: 'workshop', label: 'İşlik', icon: Cog },
  { key: 'upgrade', label: 'Ustalık Ocağı', icon: Wrench },
  { key: 'charinfo', label: 'Kişi', icon: User },
  { key: 'inventory', label: 'Heybe', icon: Package },
  { key: 'skills', label: 'Hüner', icon: Star },
  { key: 'achievement', label: 'Defter', icon: BookOpen },
  { key: 'wallet', label: 'Kesecik', icon: Wallet },
  { key: 'quest', label: 'Duyuru Tahtası', icon: ScrollText },
  { key: 'museum', label: 'Müzehane', icon: Landmark },
  { key: 'guild', label: 'Lonca', icon: Swords },
  { key: 'hanhai', label: 'Uçsuz Kumluk', icon: Tent }
]

/** Oyun paneline geçiş yap; yol süresi, uyku vakti ve dükkân açıklığını denetle */
export const navigateToPanel = (panelKey: PanelKey) => {
  const gameStore = useGameStore()
  const { startBgm } = useAudio()

  if (gameStore.isPastBedtime) {
    addLog('Gece ikinci saati geçti, artık dinlenmen gerek.')
    handleEndDay()
    // Yeni gün başlayınca saat yine yürüsün
    const { resumeClock: resumeAfterEnd } = useGameClock()
    resumeAfterEnd()
    return
  }

  // Dükkân açıklık denetimi
  const shopCheck = isShopOpen(panelKey, gameStore.day, gameStore.hour)
  if (!shopCheck.open) {
    showFloat(shopCheck.reason!, 'danger')
    return
  }

  // Yol süresi
  const travelResult = gameStore.travelTo(panelKey)
  if (travelResult.timeCost > 0) {
    addLog(travelResult.message)
  }
  if (travelResult.passedOut) {
    handleEndDay()
    return
  }

  sfxClick()
  startBgm()
  void router.push({ name: panelKey })
  useTutorialStore().markPanelVisited(panelKey)

  // Konumsuz arayüz panelleri saati durdurur, oyun alanları yeniden işletir
  const { pauseClock, resumeClock } = useGameClock()
  const targetGroup = TAB_TO_LOCATION_GROUP[panelKey]
  if (targetGroup === null || targetGroup === undefined) {
    pauseClock()
  } else {
    resumeClock()
  }
}

export const useNavigation = () => {
  return {
    TABS,
    navigateToPanel
  }
}
