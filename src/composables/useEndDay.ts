import { useGameStore, SEASON_NAMES, WEATHER_NAMES } from '@/stores/useGameStore'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useFarmStore } from '@/stores/useFarmStore'
import { useInventoryStore } from '@/stores/useInventoryStore'
import { useSaveStore } from '@/stores/useSaveStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { useNpcStore } from '@/stores/useNpcStore'
import { useCookingStore } from '@/stores/useCookingStore'
import { useProcessingStore } from '@/stores/useProcessingStore'
import { useAchievementStore } from '@/stores/useAchievementStore'
import { useAnimalStore } from '@/stores/useAnimalStore'
import { useHomeStore } from '@/stores/useHomeStore'
import { useWalletStore } from '@/stores/useWalletStore'
import { useShopStore } from '@/stores/useShopStore'
import { useQuestStore } from '@/stores/useQuestStore'
import { useFishingStore } from '@/stores/useFishingStore'
import { useBreedingStore } from '@/stores/useBreedingStore'
import { useHanhaiStore } from '@/stores/useHanhaiStore'
import { useFishPondStore } from '@/stores/useFishPondStore'
import { useTutorialStore } from '@/stores/useTutorialStore'
import { useHiddenNpcStore } from '@/stores/useHiddenNpcStore'
import { useMiningStore } from '@/stores/useMiningStore'
import { getItemById, getTodayEvent, getNpcById, getCropById, getForageItems } from '@/data'
import { getFertilizerById } from '@/data/processing'
import { FISH } from '@/data/fish'
import { RECIPES } from '@/data/recipes'
import { CAVE_UNLOCK_EARNINGS } from '@/data/buildings'
import { TOOL_NAMES, TIER_NAMES } from '@/data/upgrades'
import { addLog, showFloat } from './useGameLog'
import { getDailyMarketInfo, MARKET_CATEGORY_NAMES } from '@/data/market'
import { showEvent, showFestival, triggerWeddingEvent, triggerPetAdoption, showFarmEvent, showDiscoveryScene } from './useDialogs'
import { sfxSleep, useAudio } from './useAudio'
import { MORNING_NARRATIONS, NARRATIONS_NO_LOSS, MORNING_CHOICE_EVENTS, MORNING_EASTER_EGGS } from '@/data/farmEvents'
import { MORNING_TIPS } from '@/data/tutorials'
import type { MorningEffect } from '@/data/farmEvents'
import router from '@/router'

const NPC_NAME_MAP: Record<string, string> = {
  chen_bo: 'Hasan Enişte',
  liu_niang: 'Elif',
  a_shi: 'İsmail',
  qiu_yue: 'Aylin',
  lin_lao: 'Hekim Dede',
  xiao_man: 'Mıstık',
  chun_lan: 'Bahar',
  xue_qin: 'Nazan',
  su_su: 'Suna',
  hong_dou: 'Zeyno',
  dan_qing: 'Cemil',
  a_tie: 'Demir',
  yun_fei: 'Baran',
  da_niu: 'İbo',
  mo_bai: 'Mahir',
  wang_dashen: 'Fatma Teyze',
  zhao_mujiang: 'Mustafa Usta',
  sun_tiejiang: 'Ali Usta',
  zhang_popo: 'Emine Nine',
  li_yu: 'Balıkçı Dede',
  zhou_xiucai: 'Hoca Efendi',
  wu_shen: 'Nuriye Teyze',
  ma_liu: 'Seyyar Salih',
  lao_song: 'Bekçi Osman',
  pang_shen: 'Hatice Abla',
  a_hua: 'Zehra',
  shi_tou: 'Yaman',
  hui_niang: 'Meryem',
  lao_lu: 'Rıza Dayı',
  liu_cunzhang: 'Muhtar Mehmet',
  qian_niang: 'Yasemin',
  he_zhanggui: 'Kahveci Bekir',
  qin_dashu: 'Kemal Amca',
  a_fu: 'Ufuk'
}

const getNpcName = (npcId: string): string => {
  return NPC_NAME_MAP[npcId] ?? npcId
}

/** NPC gönül bağı → tarif açılım eşlemesi (çok kademeli) */
const NPC_RECIPE_MAP: { npcId: string; level: 'acquaintance' | 'friendly' | 'bestFriend'; recipeId: string }[] = [
  // Tanış
  { npcId: 'chen_bo', level: 'acquaintance', recipeId: 'radish_soup' },
  { npcId: 'qiu_yue', level: 'acquaintance', recipeId: 'braised_carp' },
  { npcId: 'lin_lao', level: 'acquaintance', recipeId: 'herbal_porridge' },
  { npcId: 'liu_niang', level: 'acquaintance', recipeId: 'osmanthus_cake' },
  { npcId: 'a_shi', level: 'acquaintance', recipeId: 'miner_lunch' },
  { npcId: 'xiao_man', level: 'acquaintance', recipeId: 'sweet_osmanthus_tea' },
  // Dost
  { npcId: 'chen_bo', level: 'friendly', recipeId: 'aged_radish_stew' },
  { npcId: 'qiu_yue', level: 'friendly', recipeId: 'maple_grilled_fish' },
  { npcId: 'lin_lao', level: 'friendly', recipeId: 'herbal_pill' },
  { npcId: 'liu_niang', level: 'friendly', recipeId: 'embroidered_cake' },
  { npcId: 'a_shi', level: 'friendly', recipeId: 'deep_mine_stew' },
  { npcId: 'xiao_man', level: 'friendly', recipeId: 'wild_berry_jam' },
  // Can yoldaşı
  { npcId: 'chen_bo', level: 'bestFriend', recipeId: 'farmers_feast' },
  { npcId: 'qiu_yue', level: 'bestFriend', recipeId: 'autumn_moon_feast' },
  { npcId: 'lin_lao', level: 'bestFriend', recipeId: 'longevity_soup' },
  { npcId: 'liu_niang', level: 'bestFriend', recipeId: 'lovers_pastry' },
  { npcId: 'a_shi', level: 'bestFriend', recipeId: 'forgemasters_meal' },
  { npcId: 'xiao_man', level: 'bestFriend', recipeId: 'spirit_fruit_wine' },
  // Hayvansal ürünlerle ilgili ek tarifler
  { npcId: 'da_niu', level: 'friendly', recipeId: 'goat_milk_soup' },
  { npcId: 'da_niu', level: 'bestFriend', recipeId: 'truffle_fried_rice' },
  { npcId: 'lin_lao', level: 'bestFriend', recipeId: 'antler_soup' },
  { npcId: 'chen_bo', level: 'bestFriend', recipeId: 'camel_milk_tea' }
]

/** Evlilik tarif eşlemesi */
const MARRIAGE_RECIPE_MAP: Record<string, string> = {
  liu_niang: 'phoenix_cake',
  a_shi: 'molten_hotpot',
  qiu_yue: 'moonlight_sashimi',
  chun_lan: 'tea_banquet',
  xue_qin: 'snow_plum_soup',
  su_su: 'silk_dumpling',
  hong_dou: 'drunken_chicken',
  dan_qing: 'scholars_porridge',
  a_tie: 'ironforge_stew',
  yun_fei: 'hunters_roast',
  da_niu: 'ranch_milk_soup',
  mo_bai: 'moonlit_tea_rice'
}

/** Bayram tarif eşlemesi */
const FESTIVAL_RECIPE_MAP: Record<string, string> = {
  spring_festival: 'spring_roll',
  summer_lantern: 'lotus_lantern_cake',
  autumn_harvest: 'harvest_feast',
  winter_new_year: 'new_year_dumpling',
  yuan_ri: 'nian_gao',
  hua_chao: 'hua_gao',
  shang_si: 'qing_tuan',
  zhong_qiu: 'yue_bing',
  la_ba: 'la_ba_zhou',
  duan_wu: 'dragon_boat_zongzi',
  qi_xi: 'qiao_guo',
  chong_yang: 'chrysanthemum_wine',
  dong_zhi: 'jiaozi',
  nian_mo: 'tangyuan',
  dou_cha: 'dou_cha_yin',
  qiu_yuan: 'zhi_yuan_gao'
}

/** Gönül seviyesi sıralaması */
const LEVEL_ORDER = ['stranger', 'acquaintance', 'friendly', 'bestFriend'] as const

/** Gönül seviyesinin istenen eşiğe ulaşıp ulaşmadığını kontrol eder */
const meetsLevel = (current: string, required: 'acquaintance' | 'friendly' | 'bestFriend'): boolean => {
  return LEVEL_ORDER.indexOf(current as (typeof LEVEL_ORDER)[number]) >= LEVEL_ORDER.indexOf(required)
}

/** Efsanevi balık kimlikleri */
const LEGENDARY_FISH_IDS = ['dragonfish', 'golden_turtle', 'river_dragon', 'abyss_leviathan', 'jade_dragon']

/** NPC yakınlığı, beceri seviyesi ve evlilik durumuna göre tarif açılımlarını kontrol eder */
const checkRecipeUnlocks = () => {
  const npcStore = useNpcStore()
  const cookingStore = useCookingStore()
  const skillStore = useSkillStore()

  // NPC çok kademeli gönül bağı tarifleri
  for (const entry of NPC_RECIPE_MAP) {
    const level = npcStore.getFriendshipLevel(entry.npcId)
    if (meetsLevel(level, entry.level)) {
      if (cookingStore.unlockRecipe(entry.recipeId)) {
        const levelName = entry.level === 'acquaintance' ? 'Tanış' : entry.level === 'friendly' ? 'Dost' : 'Can Yoldaşı'
        addLog(`${getNpcName(entry.npcId)} (${levelName}) sana yeni bir yemek tarifi gönderdi!`)
      }
    }
  }

  // Evlilik tarifleri
  const spouse = npcStore.getSpouse()
  if (spouse) {
    const marriageRecipe = MARRIAGE_RECIPE_MAP[spouse.npcId]
    if (marriageRecipe) {
      if (cookingStore.unlockRecipe(marriageRecipe)) {
        const spouseName = getNpcName(spouse.npcId)
        addLog(`${spouseName} sana yeni bir yemek sırrı öğretti!`)
      }
    }
    // Ortak evlilik tarifi
    if (cookingStore.unlockRecipe('peacock_feast')) {
      addLog(`Evlilikten sonra yeni bir tarif açıldı: Tavus Sofrası!`)
    }
  }

  // Beceri tarifleri
  for (const recipe of RECIPES) {
    if (recipe.requiredSkill) {
      const skill = skillStore.getSkill(recipe.requiredSkill.type)
      if (skill.level >= recipe.requiredSkill.level) {
        if (cookingStore.unlockRecipe(recipe.id)) {
          addLog(`Becerin gelişti, yeni bir tarif açıldı: ${recipe.name}!`)
        }
      }
    }
  }

  // Eşya elde etmeyle açılan tarifler (Hanhai)
  const inventoryStore = useInventoryStore()
  const ITEM_RECIPE_MAP: { itemId: string; recipeId: string; name: string }[] = [
    { itemId: 'hanhai_spice', recipeId: 'spiced_lamb', name: 'Baharatlı Kuzu' },
    { itemId: 'hanhai_silk', recipeId: 'silk_dumpling_deluxe', name: 'İpek Yolu Mantısı' },
    { itemId: 'hanhai_cactus', recipeId: 'desert_cactus_soup', name: 'Kaktüs Çorbası' },
    { itemId: 'hanhai_date', recipeId: 'date_cake', name: 'Hurma Keki' }
  ]
  for (const entry of ITEM_RECIPE_MAP) {
    if (inventoryStore.hasItem(entry.itemId)) {
      if (cookingStore.unlockRecipe(entry.recipeId)) {
        addLog(`Yeni tarif öğrendin: ${entry.name}!`)
      }
    }
  }
}

/** Başarımlardan açılan tarifleri kontrol eder */
const checkAchievementRecipes = () => {
  const achievementStore = useAchievementStore()
  const cookingStore = useCookingStore()
  const npcStore = useNpcStore()
  const s = achievementStore.stats

  const checks: { condition: boolean; recipeId: string; message: string }[] = [
    { condition: s.totalFishCaught >= 1, recipeId: 'first_catch_soup', message: 'İlk Balığını Tuttun' },
    { condition: s.totalCropsHarvested >= 100, recipeId: 'bountiful_porridge', message: 'Yüz Kez Hasat Yaptın' },
    { condition: s.highestMineFloor >= 30, recipeId: 'miners_glory', message: 'Maden Keşfi' },
    { condition: s.totalRecipesCooked >= 20, recipeId: 'chef_special', message: 'Aşçılık Ustalığı' },
    {
      condition:
        (['chen_bo', 'liu_niang', 'a_shi', 'qiu_yue', 'lin_lao', 'xiao_man'] as const).filter(id =>
          meetsLevel(npcStore.getFriendshipLevel(id), 'friendly')
        ).length >= 3,
      recipeId: 'social_tea',
      message: 'Sohbet Eri'
    },
    { condition: s.totalFishCaught >= 20, recipeId: 'anglers_platter', message: 'Usta Oltacı' },
    {
      condition: LEGENDARY_FISH_IDS.some(id => achievementStore.isDiscovered(id)),
      recipeId: 'legendary_feast',
      message: 'Efsane Avcısı'
    },
    { condition: s.highestMineFloor >= 50, recipeId: 'abyss_stew', message: 'Derin Uçurum Kaşifi' },
    { condition: achievementStore.discoveredCount >= 50, recipeId: 'collectors_banquet', message: 'Koleksiyon Ustası' }
  ]

  for (const check of checks) {
    if (check.condition) {
      if (cookingStore.unlockRecipe(check.recipeId)) {
        addLog(`【Başarım Tarifi】${check.message} ile yeni bir tarif açıldı!`)
      }
    }
  }
}

/** Mevsim etkinliği etkilerini uygular */
const applyEventEffects = (event: { id: string; name: string; description: string; effects: any }) => {
  const playerStore = usePlayerStore()
  const npcStore = useNpcStore()
  const inventoryStore = useInventoryStore()
  const effects = event.effects

  if (effects.friendshipBonus) {
    for (const state of npcStore.npcStates) {
      state.friendship += effects.friendshipBonus
    }
  }
  if (effects.moneyReward) {
    playerStore.earnMoney(effects.moneyReward)
    showFloat(`+${effects.moneyReward} akçe`, 'accent')
  }
  if (effects.staminaBonus) {
    playerStore.restoreStamina(effects.staminaBonus)
    showFloat(`+${effects.staminaBonus} enerji`, 'success')
  }
  if (effects.itemReward) {
    for (const item of effects.itemReward) {
      inventoryStore.addItem(item.itemId, item.quantity)
    }
  }
  addLog(`【${event.name}】${event.description}`)

  // Bayram tarifi açılımı
  const cookingStore = useCookingStore()
  const festivalRecipe = FESTIVAL_RECIPE_MAP[event.id]
  if (festivalRecipe) {
    if (cookingStore.unlockRecipe(festivalRecipe)) {
      addLog(`Bayram sayesinde yeni bir tarif açıldı!`)
    }
  }
}

// ==================== Sabah rastgele olayları ====================

/** Sabah etkisini uygular */
const applyMorningEffect = (effect?: MorningEffect) => {
  if (!effect) return
  const playerStore = usePlayerStore()
  const inventoryStore = useInventoryStore()
  const npcStore = useNpcStore()
  const farmStore = useFarmStore()

  switch (effect.type) {
    case 'loseCrop': {
      const growing = farmStore.plots.filter(p => p.state === 'growing' || p.state === 'harvestable')
      if (growing.length > 0) {
        const target = growing[Math.floor(Math.random() * growing.length)]!
        const cropName = getCropById(target.cropId ?? '')?.name ?? 'ürün'
        target.state = 'tilled'
        target.cropId = null
        target.growthDays = 0
        target.watered = false
        target.harvestCount = 0
        target.seedGenetics = null
        addLog(`Bir ${cropName} heba oldu.`)
      }
      break
    }
    case 'gainItem':
      inventoryStore.addItem(effect.itemId, effect.qty)
      break
    case 'gainMoney':
      playerStore.earnMoney(effect.amount)
      break
    case 'gainFriendship':
      for (const s of npcStore.npcStates) {
        s.friendship += effect.amount
      }
      break
  }
}

/** Zar atımı: sabah rastgele olayı */
const rollMorningEvent = ():
  | { type: 'narration'; message: string; effect?: MorningEffect }
  | { type: 'choice'; event: (typeof MORNING_CHOICE_EVENTS)[number] }
  | { type: 'easter'; message: string; effect?: MorningEffect }
  | null => {
  const roll = Math.random()

  // %95 hiçbir şey olmaz
  if (roll >= 0.05) return null

  // %0.2 paskalya sürprizi
  if (roll < 0.002) {
    const egg = MORNING_EASTER_EGGS[Math.floor(Math.random() * MORNING_EASTER_EGGS.length)]!
    return { type: 'easter', message: egg.message, effect: egg.effect }
  }

  // %0.8 seçimli olay
  if (roll < 0.01) {
    const event = MORNING_CHOICE_EVENTS[Math.floor(Math.random() * MORNING_CHOICE_EVENTS.length)]!
    return { type: 'choice', event }
  }

  // %4 anlatı
  const farmStore = useFarmStore()
  const hasCrops = farmStore.plots.some(p => p.state === 'growing' || p.state === 'harvestable')
  const pool = hasCrops ? MORNING_NARRATIONS : NARRATIONS_NO_LOSS
  const narration = pool[Math.floor(Math.random() * pool.length)]!
  return { type: 'narration', message: narration.message, effect: narration.effect }
}

/** Gün sonu hesaplaşması */
export const handleEndDay = () => {
  sfxSleep()

  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const saveStore = useSaveStore()
  const npcStore = useNpcStore()
  const cookingStore = useCookingStore()
  const processingStore = useProcessingStore()
  const achievementStore = useAchievementStore()
  const animalStore = useAnimalStore()
  const homeStore = useHomeStore()
  const questStore = useQuestStore()
  const skillStore = useSkillStore()
  const tutorialStore = useTutorialStore()

  // Başlangıç rehberi: enerjinin düşük kaldığını kaydet
  if (playerStore.stamina < 20) tutorialStore.setFlag('staminaWasLow')

  // Toparlanma modu
  let recoveryMode: 'normal' | 'late' | 'passout'
  if (playerStore.stamina <= 0 || gameStore.hour >= 26) {
    recoveryMode = 'passout'
  } else if (gameStore.hour >= 24) {
    recoveryMode = 'late'
  } else {
    recoveryMode = 'normal'
  }

  // Madenden zorunlu çıkış: uykuya dalınca veya bayılınca maden durumu sıfırlanır
  const miningStore = useMiningStore()
  if (miningStore.isExploring) {
    miningStore.leaveMine()
  }

  const pestResult = farmStore.dailyUpdate(gameStore.isRainy)
  processingStore.dailyUpdate()

  // Tohum melezleme tezgâhı güncellemesi
  const breedingStore = useBreedingStore()
  breedingStore.dailyUpdate()

  // Yüzük etkisi: ürün büyümesi hızlanır
  const ringGrowthBonus = inventoryStore.getRingEffectValue('crop_growth_bonus')
  const walletGrowthBonus = useWalletStore().getCropGrowthBonus()
  if (ringGrowthBonus > 0) {
    for (const plot of farmStore.plots) {
      if ((plot.state === 'growing' || plot.state === 'planted') && plot.watered) {
        plot.growthDays += ringGrowthBonus
        const crop = getCropById(plot.cropId!)
        if (crop) {
          const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
          const speedup = (fertDef?.growthSpeedup ?? 0) + walletGrowthBonus
          const effectiveDays = Math.max(1, Math.floor(crop.growthDays * (1 - speedup)))
          if (plot.growthDays >= effectiveDays) {
            plot.state = 'harvestable'
          }
        }
      }
    }
  }

  // Yeşil yağmur etkisi: ürün ve yabani ağaç büyümesi hızlanır
  if (gameStore.weather === 'green_rain') {
    for (const plot of farmStore.plots) {
      if ((plot.state === 'growing' || plot.state === 'planted') && plot.watered) {
        plot.growthDays += 0.5
        const crop = getCropById(plot.cropId!)
        if (crop) {
          const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
          const speedup = (fertDef?.growthSpeedup ?? 0) + walletGrowthBonus
          const effectiveDays = Math.max(1, Math.floor(crop.growthDays * (1 - speedup)))
          if (plot.growthDays >= effectiveDays) {
            plot.state = 'harvestable'
          }
        }
      }
    }
    for (const tree of farmStore.wildTrees) {
      if (!tree.mature) {
        tree.growthDays += 1
      }
    }
    addLog('Yeşil yağmur toprağı besledi, ürünler ve ağaçlar daha hızlı büyüdü!')
  }

  // Alet yükseltme süreci
  const upgradeResult = inventoryStore.dailyUpgradeUpdate()
  if (upgradeResult?.completed) {
    addLog(`Mıstık, ${TOOL_NAMES[upgradeResult.toolType]} yükseltmesini tamamladı! Artık seviye ${TIER_NAMES[upgradeResult.targetTier]}.`)
  }

  // Karga saldırısı
  const crowResult = farmStore.crowAttack()
  if (crowResult.attacked) {
    addLog(`Kargalar tarlana dadandı, bir ${crowResult.cropName} yenildi! Ürünleri korumak için korkuluk dik.`)
  }

  // Haşere kaydı
  if (pestResult.newInfestations > 0) {
    addLog(
      `Haşereler üşüştü! ${pestResult.newInfestations} tarla karesi böceğe tutuldu. ${farmStore.scarecrows > 0 ? 'Korkuluklar riski azalttı.' : 'Korkuluk kurarsan böcek olasılığı düşer.'}`
    )
  }
  if (pestResult.pestDeaths > 0) {
    addLog(`${pestResult.pestDeaths} ürün böcekler yüzünden kurudu! Vaktinde temizlersen kurtarabilirsin.`)
  }

  // Yabani ot kaydı
  if (pestResult.newWeeds > 0) {
    addLog(
      `Yabani otlar yayıldı! ${pestResult.newWeeds} tarla karesinde ot bitti. ${farmStore.scarecrows > 0 ? 'Korkuluklar yayılmayı bastırdı.' : 'Korkuluk kurarsan yabani otlar azalır.'}`
    )
  }
  if (pestResult.weedDeaths > 0) {
    addLog(`${pestResult.weedDeaths} ürün yabani otların altında boğulup gitti! Otları zamanında temizlemek gerekir.`)
  }

  // Sabah rastgele olayı
  const morningEvent = rollMorningEvent()
  if (morningEvent) {
    if (morningEvent.type === 'choice') {
      showFarmEvent(morningEvent.event)
    } else {
      addLog(morningEvent.message)
      applyMorningEffect(morningEvent.effect)
    }
  }

  // Dev ürün kontrolü
  const giantCrops = farmStore.checkGiantCrops()
  for (const gc of giantCrops) {
    addLog(`Kocaman bir ${gc.cropName} ortaya çıktı! 3×3 ürün birleşip dev ürüne dönüştü!`)
  }

  // Yardımcıların yemleme hesabı
  const helperFeedResult = npcStore.processDailyHelpers(['feed'])
  for (const msg of helperFeedResult.messages) addLog(msg)

  // Eşin yemlemesi
  const spouse = npcStore.getSpouse()
  if (spouse) {
    const bonusChanceEve = spouse.friendship >= 2500 ? 0.1 : 0
    if (Math.random() < 0.4 + bonusChanceEve) {
      const result = animalStore.feedAll()
      if (result.fedCount > 0) {
        const spouseDefEve = getNpcById(spouse.npcId)
        addLog(`${spouseDefEve?.name ?? 'Eşin'} bütün hayvanları yemledi.`)
      }
    }
  }

  // Can yoldaşı günlük katkısı
  const zhiji = npcStore.getZhiji()
  if (zhiji) {
    const zhijiDef = getNpcById(zhiji.npcId)
    const zhijiName = zhijiDef?.name ?? 'Can yoldaşın'
    const bonusChance2 = zhiji.friendship >= 2500 ? 0.15 : 0

    switch (zhiji.npcId) {
      case 'a_shi':
        if (Math.random() < 0.3 + bonusChance2) {
          const ores = ['copper_ore', 'iron_ore', 'gold_ore']
          const ore = ores[Math.floor(Math.random() * ores.length)]!
          const qty = 1 + Math.floor(Math.random() * 3)
          inventoryStore.addItem(ore, qty)
          addLog(`${zhijiName}, sana ${qty} adet ${getItemById(ore)?.name ?? 'maden'} yolladı.`)
        }
        break
      case 'dan_qing':
        if (Math.random() < 0.2 + bonusChance2) {
          for (const s of npcStore.npcStates) {
            if (s.npcId !== zhiji.npcId) s.friendship += 5
          }
          addLog(`${zhijiName}, gaKöy halkına senin hakkında güzel sözler söyledi. (Köyde herkes +5 gönül)`)
        }
        break
      case 'a_tie':
        if (Math.random() < 0.3 + bonusChance2) {
          const mats = ['iron_ore', 'copper_ore', 'charcoal']
          const mat = mats[Math.floor(Math.random() * mats.length)]!
          inventoryStore.addItem(mat, 2)
          addLog(`${zhijiName}, dövme işinde lazım olacak birkaç malzeme gönderdi.`)
        }
        break
      case 'yun_fei':
        if (Math.random() < 0.3 + bonusChance2) {
          const items2 = ['wild_mushroom', 'herb', 'pine_cone']
          const item2 = items2[Math.floor(Math.random() * items2.length)]!
          inventoryStore.addItem(item2)
          addLog(`${zhijiName}, dağdan dönerken sana ${getItemById(item2)?.name ?? 'bir şey'} getirdi.`)
        }
        break
      case 'da_niu':
        if (Math.random() < 0.3 + bonusChance2) {
          const result2 = animalStore.feedAll()
          if (result2.fedCount > 0) addLog(`${zhijiName}, bütün hayvanları yemledi.`)
        }
        break
      case 'mo_bai':
        if (Math.random() < 0.25 + bonusChance2) {
          playerStore.restoreStamina(15)
          addLog(`${zhijiName}, sakin bir ezgi çaldı; iç ferahladı. (+15 enerji)`)
        }
        break
      case 'liu_niang':
        if (Math.random() < 0.2 + bonusChance2) {
          for (const s of npcStore.npcStates) {
            if (s.npcId !== zhiji.npcId) s.friendship += 5
          }
          addLog(`${zhijiName}, gaKöy halkına senden övgüyle bahsetti. (Köyde herkes +5 gönül)`)
        }
        break
      case 'qiu_yue':
        if (Math.random() < 0.3 + bonusChance2) {
          const fish = ['crucian', 'carp', 'grass_carp', 'bass']
          const f = fish[Math.floor(Math.random() * fish.length)]!
          inventoryStore.addItem(f)
          addLog(`${zhijiName}, sana bir ${getItemById(f)?.name ?? 'balık'} gönderdi.`)
        }
        break
      case 'chun_lan':
        if (Math.random() < 0.25 + bonusChance2) {
          inventoryStore.addItem('green_tea_drink')
          addLog(`${zhijiName}, sana mis kokulu bir demlik çay gönderdi.`)
        }
        break
      case 'xue_qin':
        if (Math.random() < 0.15 + bonusChance2) {
          inventoryStore.addItem('bamboo')
          addLog(`${zhijiName}, sana bir demet bambu gönderdi.`)
        }
        break
      case 'su_su':
        if (Math.random() < 0.25 + bonusChance2) {
          const cloths = ['cloth', 'silk_cloth', 'felt']
          const c = cloths[Math.floor(Math.random() * cloths.length)]!
          inventoryStore.addItem(c)
          addLog(`${zhijiName}, sana bir top ${getItemById(c)?.name ?? 'kumaş'} gönderdi.`)
        }
        break
      case 'hong_dou':
        if (Math.random() < 0.3 + bonusChance2) {
          const wines = ['peach_wine', 'jujube_wine', 'corn_wine']
          const w = wines[Math.floor(Math.random() * wines.length)]!
          inventoryStore.addItem(w)
          addLog(`${zhijiName}, sana bir testi ${getItemById(w)?.name ?? 'içki'} gönderdi.`)
        }
        break
    }
  }

  npcStore.dailyReset()
  cookingStore.dailyReset()
  useHanhaiStore().resetDailyBets()

  // Gizli ruhani karakterler günlük işlemleri
  const hiddenNpcStore = useHiddenNpcStore()
  const discoveryTriggered = hiddenNpcStore.checkDiscoveryConditions()
  for (const { npcId, step } of discoveryTriggered) {
    if (step.logMessage) addLog(step.logMessage)
    if (step.scenes.length > 0) showDiscoveryScene(npcId, step)
  }
  hiddenNpcStore.dailyReset()
  const newAbilities = hiddenNpcStore.checkAbilityUnlocks()
  for (const a of newAbilities) {
    addLog(`【Ruhani Bağ】${a.name}: ${a.description}`)
    // Kalıcı etki: azami enerji +20
    if (a.id === 'shan_weng_3') {
      playerStore.addBonusMaxStamina(20)
    }
  }
  // Eski kayıt düzeltmesi
  if (hiddenNpcStore.isAbilityActive('shan_weng_3')) {
    const expected = 20
    if (playerStore.bonusMaxStamina < expected) {
      playerStore.addBonusMaxStamina(expected - playerStore.bonusMaxStamina)
    }
  }

  // Hayvan ürünleri
  const animalResult = animalStore.dailyUpdate()
  if (animalResult.products.length > 0) {
    for (const p of animalResult.products) {
      inventoryStore.addItem(p.itemId, 1, p.quality)
    }
    addLog(`Hayvanların ${animalResult.products.length} ürün verdi.`)
  }
  if (animalResult.died.length > 0) {
    addLog(`${animalResult.died.join('、')} uzun süren açlık ya da ağır hastalık yüzünden öldü...`)
  }
  if (animalResult.gotSick.length > 0) {
    addLog(`${animalResult.gotSick.join('、')} açlıktan hastalandı! Bir an önce yem ver.`)
  }
  if (animalResult.healed.length > 0) {
    addLog(`${animalResult.healed.join('、')} doyunca yeniden toparlandı.`)
  }

  // Sabah yemleme işareti
  const hasHelperFeed = npcStore.hiredHelpers.some(h => h.task === 'feed')
  if (hasHelperFeed) {
    animalStore.markAllFed()
  }
  if (spouse && !hasHelperFeed) {
    const bonusChanceFeed = spouse.friendship >= 2500 ? 0.1 : 0
    if (Math.random() < 0.4 + bonusChanceFeed) {
      animalStore.markAllFed()
      const spouseDefFeed = getNpcById(spouse.npcId)
      addLog(`${spouseDefFeed?.name ?? 'Eşin'} gün doğmadan hayvanları yemledi.`)
    }
  }

  // Sabah işleri: yardımcılar sulama/hasat/ot temizliği
  const helperMorningResult = npcStore.processDailyHelpers(['water', 'harvest', 'weed'])
  for (const msg of helperMorningResult.messages) addLog(msg)

  // Sabah işleri: eş sulama/yemek/hasat
  if (spouse) {
    const spouseDef = getNpcById(spouse.npcId)
    const spouseName = spouseDef?.name ?? 'Eşin'
    const bonusChance = spouse.friendship >= 2500 ? 0.1 : 0
    const highBond = spouse.friendship >= 3000 ? 0.15 : 0

    // Sulama
    if (Math.random() < 0.5 + bonusChance + highBond) {
      const unwatered = farmStore.plots.filter(p => (p.state === 'planted' || p.state === 'growing') && !p.watered)
      const count = Math.min(unwatered.length, 3 + Math.floor(Math.random() * 4))
      for (let i = 0; i < count; i++) farmStore.waterPlot(unwatered[i]!.id)
      if (count > 0) addLog(`${spouseName}, sabah erkenden ${count} tarla karesini suladı.`)
    }

    // Yemek yapma
    if (spouse.friendship >= 2000 && Math.random() < 0.3 + bonusChance) {
      const foods = ['food_rice_ball', 'food_congee', 'food_steamed_bun', 'food_honey_tea', 'food_stir_fry', 'food_dumpling']
      const food = foods[Math.floor(Math.random() * foods.length)]!
      inventoryStore.addItem(food)
      addLog(`${spouseName}, sabah erkenden bir ${getItemById(food)?.name ?? 'yemek'} hazırladı.`)
    }

    // Hasat
    if (spouse.friendship >= 3000 && !inventoryStore.isFull && Math.random() < 0.3 + bonusChance) {
      const harvestable = farmStore.plots.filter(p => p.state === 'harvestable')
      const harvestCount = Math.min(harvestable.length, 3)
      let harvested = 0
      for (let i = 0; i < harvestCount; i++) {
        if (inventoryStore.isFull) break
        const hResult = farmStore.harvestPlot(harvestable[i]!.id)
        if (hResult.cropId) {
          inventoryStore.addItem(hResult.cropId, 1, 'normal')
          harvested++
        }
      }
      if (harvested > 0) addLog(`${spouseName}, sabah erkenden ${harvested} tarla karesinin hasadını yaptı.`)
    }
  }

  // Kuluçka güncellemesi
  const incubatorResult = animalStore.dailyIncubatorUpdate()
  if (incubatorResult.hatched) {
    addLog(`Kümes kuluçkasındaki yumurtadan bir ${incubatorResult.hatched.name} çıktı!`)
  }

  // Ahır kuluçkası güncellemesi
  const barnIncubatorResult = animalStore.dailyBarnIncubatorUpdate()
  if (barnIncubatorResult.hatched) {
    addLog(`Ahır kuluçkasındaki yumurtadan bir ${barnIncubatorResult.hatched.name} çıktı!`)
  }

  // Evcil hayvan günlük güncellemesi
  const petResult = animalStore.dailyPetUpdate()
  if (petResult.item) {
    const petName = animalStore.pet?.name ?? 'Evcil dostun'
    const itemDef2 = getItemById(petResult.item)
    addLog(`${petName}, ağzında bir ${itemDef2?.name ?? petResult.item} ile döndü.`)
  }

  // Balık havuzu günlük güncellemesi
  const fishPondStore = useFishPondStore()
  if (fishPondStore.pond.built) {
    const pondResult = fishPondStore.dailyUpdate()
    for (const p of pondResult.products) {
      inventoryStore.addItem(p.itemId, 1, p.quality)
    }
    if (pondResult.products.length > 0) {
      addLog(`Balık havuzu ${pondResult.products.length} su ürünü verdi.`)
    }
    if (pondResult.died.length > 0) {
      addLog(`${pondResult.died.join('、')} ağır hastalıktan öldü...`)
    }
    if (pondResult.gotSick.length > 0) {
      addLog(`${pondResult.gotSick.join('、')} hastalandı! Çabuk tedavi et.`)
    }
    if (pondResult.bred) {
      addLog(`Balık havuzunda üreme oldu, yeni bir ${pondResult.bred} dünyaya geldi!`)
    }
    if (pondResult.breedingFailed) {
      addLog(`${pondResult.breedingFailed}.`)
    }
  }

  // Yengeç kapanı hasadı
  const fishingStore = useFishingStore()
  const crabPotHarvest = fishingStore.collectCrabPots()
  if (crabPotHarvest.length > 0) {
    const names = crabPotHarvest.map(c => c.name).join('、')
    addLog(`Yengeç kapanında şunlar vardı: ${names}.`)
  }

  // Mağara ürünleri
  const caveProducts = homeStore.dailyCaveUpdate()
  for (const p of caveProducts) {
    inventoryStore.addItem(p.itemId, p.quantity)
    const itemDef = getItemById(p.itemId)
    addLog(`Dağ mağarasında ${itemDef?.name ?? p.itemId} bulundu.`)
  }

  // Meyve ağacı güncellemesi
  const fruitResult = farmStore.dailyFruitTreeUpdate(gameStore.season)
  for (const f of fruitResult.fruits) {
    inventoryStore.addItem(f.fruitId, 1, f.quality)
  }
  if (fruitResult.fruits.length > 0) {
    addLog(`Meyve ağaçları ${fruitResult.fruits.length} meyve verdi.`)
  }

  // Yabani ağaç güncellemesi
  const wildTreeResult = farmStore.dailyWildTreeUpdate()
  for (const p of wildTreeResult.products) {
    inventoryStore.addItem(p.productId)
  }
  if (wildTreeResult.products.length > 0) {
    addLog(`Öz toplayıcıdan şunlar çıktı: ${wildTreeResult.products.map(p => p.productName).join('、')}.`)
  }

  // Sera güncellemesi
  if (homeStore.greenhouseUnlocked) {
    farmStore.greenhouseDailyUpdate()
  }

  // Kiler güncellemesi
  if (homeStore.farmhouseLevel >= 3) {
    const cellarResult = homeStore.dailyCellarUpdate()
    for (const r of cellarResult.ready) {
      addLog(`Kilerdeki ${getItemById(r.itemId)?.name ?? r.itemId} daha nitelikli hâle geldi!`)
    }
  }

  // Kese açılımları
  const walletStore = useWalletStore()
  const newWalletItems = walletStore.checkAndUnlock()
  for (const name of newWalletItems) {
    addLog(`Kesede yeni bir eşya açıldı: ${name}!`)
  }

  // Günlük görev güncellemesi
  const expiredQuests = questStore.dailyUpdate()
  for (const eq of expiredQuests) {
    addLog(`Görev süresi doldu: "${eq.description}".`)
  }

  // Ana görev ilerlemesi
  questStore.updateMainQuestProgress()

  // Düğün geri sayımı
  const weddingResult = npcStore.dailyWeddingUpdate()
  if (weddingResult.weddingToday && weddingResult.npcId) {
    const weddingNpcDef = getNpcById(weddingResult.npcId)
    addLog(`Bugün seninle ${weddingNpcDef?.name ?? 'sevdiğinin'} düğün günü!`)
    triggerWeddingEvent(weddingResult.npcId)
  }

  // Gebelik güncellemesi
  const pregResult = npcStore.dailyPregnancyUpdate()
  if (pregResult.born) {
    const qMsg =
      pregResult.born.quality === 'healthy'
        ? 'Sapasağlam dünyaya geldi!'
        : pregResult.born.quality === 'premature'
          ? 'Biraz erken doğdu ama çok şükür sağ salim.'
          : ''
    addLog(`${pregResult.born.name} dünyaya geldi! Gözün aydın! ${qMsg}`)
  }
  if (pregResult.stageChanged) {
    const stageLabels: Record<string, string> = { early: 'başlangıç', mid: 'orta', late: 'ileri', ready: 'doğum vakti' }
    addLog(`Gebelik ${stageLabels[pregResult.stageChanged.to]} evresine geçti. Eşinle ilgilenmeyi unutma.`)
  }
  if (pregResult.miscarriage) {
    addLog('Ne yazık ki... bu kez yeni canı kucağa almak nasip olmadı. İkinizin de zamana ihtiyacı var.')
  }

  // Çocuk büyümesi
  npcStore.dailyChildUpdate()

  // Çocuk teklifi
  if (npcStore.checkChildProposal()) {
    npcStore.triggerChildProposal()
    const spouseDef2 = getNpcById(npcStore.getSpouse()?.npcId ?? '')
    addLog(`${spouseDef2?.name ?? 'Eşin'} sana söylemek istediği bir şey var gibi görünüyor...`)
  }

  // Sevkiyat sandığı hesabı
  const shopStore = useShopStore()
  const shippingIncome = shopStore.processShippingBox()
  if (shippingIncome > 0) {
    playerStore.earnMoney(shippingIncome)
    addLog(`Sevkiyat sandığı hesabı: ${shippingIncome} akçe kazandın.`)
  }

  const { seasonChanged, oldSeason } = gameStore.nextDay()

  // Yeni gün görev üretimi
  questStore.generateDailyQuests(gameStore.season, gameStore.day)

  // Her 7 günde özel sipariş
  const specialOrderDays: Record<number, number> = { 7: 1, 14: 2, 21: 3, 28: 4 }
  const tier = specialOrderDays[gameStore.day]
  if (tier && !questStore.specialOrder) {
    questStore.generateSpecialOrder(gameStore.season, tier)
  }

  // Yeni gün yağmurluysa ürünleri hemen sulansın göster
  if (gameStore.isRainy) {
    for (const plot of farmStore.plots) {
      if (plot.state === 'planted' || plot.state === 'growing') {
        plot.watered = true
        plot.unwateredDays = 0
      }
    }
  }

  const bedHour = gameStore.hour
  const { moneyLost, recoveryPct } = playerStore.dailyReset(recoveryMode, bedHour)

  // Ruhani bağ günlük ödülü
  const bondMessages = hiddenNpcStore.dailyBondBonus()
  for (const msg of bondMessages.messages) addLog(msg)

  let summary: string
  if (recoveryMode === 'passout') {
    summary =
      moneyLost > 0
        ? `Gücün tükendi ve yere yığıldın... biri seni eve kadar getirdi. ${moneyLost} akçe kaybettin. Ertesi gün enerjinin yalnızca %50'si dolacak.`
        : `Gücün tükendi ve yere yığıldın... Ertesi gün enerjinin yalnızca %50'si dolacak.`
  } else if (recoveryMode === 'late') {
    const pct = Math.round(recoveryPct * 100)
    summary = `Geceyi çok geç vakitte tamamladın... Ertesi gün enerjinin yalnızca %${pct}'i dolacak.`
  } else {
    summary = 'GaKöy’de bir gün daha güzellikle kapandı.'
  }

  addLog(summary)

  // Mevsim değişimi işlemi
  if (seasonChanged) {
    const { witheredCount, reclaimedCount } = farmStore.onSeasonChange(gameStore.season)
    addLog(`—— Mevsim döndü: ${SEASON_NAMES[oldSeason]} → ${SEASON_NAMES[gameStore.season]} ——`)
    if (witheredCount > 0) {
      addLog(`${witheredCount} ürün yeni mevsime dayanamadı ve kurudu...`)
    }
    if (reclaimedCount > 0) {
      addLog(`${reclaimedCount} terk edilmiş tarla karesini yabani otlar sardı.`)
    }
    if (oldSeason === 'winter' && gameStore.season === 'spring') {
      addLog('Yeni yıl başladı! Çiftlik kış boyunca biraz sahipsiz kalmış, yeniden elden geçirmek gerekecek.')
    }
    farmStore.fruitTreeSeasonUpdate(oldSeason === 'winter')

    // Verimli ova çiftliği: mevsim geçişinde doğal gübre
    if (gameStore.farmMapType === 'standard') {
      const fertCount = farmStore.applyFertileSoil()
      if (fertCount > 0) {
        addLog(`Bereketli toprak toprağı besledi, ${fertCount} tarla karesi doğal verim kazandı.`)
      }
    }

    tutorialStore.setFlag('justChangedSeason')
  }

  // Şimşek
  if (gameStore.weather === 'stormy') {
    const strike = farmStore.lightningStrike()
    if (strike.absorbed) {
      inventoryStore.addItem('battery')
      addLog('Paratoner yıldırımı çekti! Bir pil takımı elde ettin.')
    } else if (strike.hit) {
      addLog(`Fırtınada bir yıldırım çiftliğine düştü, bir ${strike.cropName} kül oldu! Paratoner kurarsan korunursun.`)
    }
  }

  if (gameStore.isRainy) {
    addLog('Bugün yağmur var, ürünler kendiliğinden sulandı.')
  }

  // Hava durumu
  addLog(`Yarın için hava: ${WEATHER_NAMES[gameStore.tomorrowWeather]}`)

  // Mevsim değişim uyarısı
  if (!seasonChanged && gameStore.day >= 25 && gameStore.day <= 27) {
    const daysLeft = 28 - gameStore.day
    const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'] as const
    const nextSeason = SEASON_ORDER[(SEASON_ORDER.indexOf(gameStore.season) + 1) % 4]!
    let cropAtRisk = 0
    for (const plot of farmStore.plots) {
      if ((plot.state === 'planted' || plot.state === 'growing' || plot.state === 'harvestable') && plot.cropId) {
        const crop = getCropById(plot.cropId)
        if (crop && !crop.season.includes(nextSeason)) cropAtRisk++
      }
    }
    if (cropAtRisk > 0) {
      addLog(`${daysLeft} gün sonra mevsim dönecek; ${cropAtRisk} ürün ${SEASON_NAMES[nextSeason]} mevsimine dayanamayacak ve kuruyacak.`)
      showFloat(`Mevsim dönüşüne ${daysLeft} gün kaldı! ${cropAtRisk} ürün kuruyacak`, 'danger')
    } else {
      addLog(`Mevsim dönüşüne ${daysLeft} gün kaldı.`)
    }
  }

  // Günlük pazar durumu
  const marketInfo = getDailyMarketInfo(gameStore.year, gameStore.seasonIndex, gameStore.day, shopStore.getRecentShipping())
  const booms = marketInfo.filter(m => m.trend === 'boom')
  const crashes = marketInfo.filter(m => m.trend === 'crash')
  if (booms.length > 0) {
    addLog(`Bugünkü pazar: ${booms.map(b => MARKET_CATEGORY_NAMES[b.category]).join('、')} fiyatları coştu!`)
  }
  if (crashes.length > 0) {
    addLog(`Bugünkü pazar: ${crashes.map(c => MARKET_CATEGORY_NAMES[c.category]).join('、')} fiyatları çakıldı.`)
  }

  // Başlangıç rehberi: sabah tüyoları
  if (tutorialStore.enabled && gameStore.year === 1) {
    const conditions: Record<string, () => boolean> = {
      earlyFirstDay: () => gameStore.day === 2 && gameStore.season === 'spring',
      allWasteland: () => farmStore.plots.every(p => p.state === 'wasteland') && gameStore.day > 2,
      tilledNoPlanted: () =>
        farmStore.plots.some(p => p.state === 'tilled') &&
        !farmStore.plots.some(p => p.state === 'planted' || p.state === 'growing' || p.state === 'harvestable'),
      plantedUnwatered: () =>
        farmStore.plots.some(p => (p.state === 'planted' || p.state === 'growing') && !p.watered) && !gameStore.isRainy,
      hasHarvestable: () => farmStore.plots.some(p => p.state === 'harvestable'),
      harvestedNeverSold: () => achievementStore.stats.totalCropsHarvested > 0 && achievementStore.stats.totalMoneyEarned === 0,
      earlyGame: () => gameStore.day <= 4 && gameStore.season === 'spring',
      staminaWasLow: () => tutorialStore.getFlag('staminaWasLow'),
      neverVisitedShop: () => !tutorialStore.hasPanelVisited('shop'),
      neverFished: () => achievementStore.stats.totalFishCaught === 0 && gameStore.day >= 4,
      neverMined: () => achievementStore.stats.highestMineFloor === 0 && gameStore.day >= 6,
      neverTalkedNpc: () => npcStore.npcStates.every(n => n.friendship === 0) && gameStore.day >= 3,
      neverCheckedQuests: () => !tutorialStore.hasPanelVisited('quest') && gameStore.day >= 5,
      neverCooked: () => achievementStore.stats.totalRecipesCooked === 0 && gameStore.day >= 8,
      firstRainyDay: () => gameStore.isRainy && !tutorialStore.getFlag('seenRain'),
      justChangedSeason: () => tutorialStore.getFlag('justChangedSeason'),
      hasCropNoSprinkler: () =>
        farmStore.plots.some(p => p.state === 'growing') && farmStore.sprinklers.length === 0 && gameStore.day >= 11,
      neverHadAnimal: () => animalStore.animals.length === 0 && gameStore.day >= 15
    }
    for (const tip of MORNING_TIPS) {
      if (tutorialStore.isTipShown(tip.id)) continue
      const check = conditions[tip.conditionKey]
      if (check && check()) {
        addLog(tip.message)
        tutorialStore.markTipShown(tip.id)
        if (tip.conditionKey === 'firstRainyDay') tutorialStore.setFlag('seenRain')
        if (tip.conditionKey === 'justChangedSeason') tutorialStore.setFlag('seenSeasonChange')
        break
      }
    }
    tutorialStore.setFlag('justChangedSeason', false)
    tutorialStore.setFlag('staminaWasLow', false)
  }

  // Tarif açılımları
  checkRecipeUnlocks()

  // Mevsim etkinlikleri
  const event = getTodayEvent(gameStore.season, gameStore.day)
  if (event) {
    applyEventEffects(event)
    if (event.interactive && event.festivalType) {
      showFestival(event.festivalType)
    } else {
      const { startFestivalBgm } = useAudio()
      startFestivalBgm(gameStore.season)
    }
    // Anlatıdaki dinamik yer tutucular
    const ORDINALS = ['birinci', 'ikinci', 'üçüncü', 'dördüncü', 'beşinci', 'altıncı', 'yedinci', 'sekizinci', 'dokuzuncu', 'onuncu']
    const yearStr = gameStore.year <= 10 ? ORDINALS[gameStore.year - 1]! : String(gameStore.year)
    const resolved = {
      ...event,
      narrative: event.narrative.map(line => line.replace('{year}', yearStr))
    }
    showEvent(resolved)
  }

  // Başarımlar
  const newAchievements = achievementStore.checkAchievements()
  for (const a of newAchievements) {
    addLog(`【Başarım】${a.name}! ${a.reward.money ? `${a.reward.money} akçe kazandın.` : ''}`)
    showFloat(`Başarım: ${a.name}`, 'accent')
  }

  // Başarım tarifleri
  checkAchievementRecipes()

  // Mağara açılımı
  if (!homeStore.caveUnlocked && achievementStore.stats.totalMoneyEarned >= CAVE_UNLOCK_EARNINGS) {
    homeStore.unlockCave()
    addLog('Toplam kazancın dikkat çekti... gaKöy arkasındaki dağ mağarası artık sana açık! Yapılar panelinden mağaranın işini seçebilirsin.')
  }

  // ===== Çiftlik türü özel etkileri =====

  // Yaban çiftliği: pasif maden + gece yaratık olayı
  if (gameStore.farmMapType === 'wilderness') {
    const orePool = ['copper_ore', 'iron_ore', 'gold_ore']
    const randomOre = orePool[Math.floor(Math.random() * orePool.length)]!
    const qty = 2 + Math.floor(Math.random() * 2)
    inventoryStore.addItem(randomOre, qty)
    const oreDef = getItemById(randomOre)
    addLog(`Yaban arazide ${qty} adet ${oreDef?.name ?? randomOre} buldun.`)

    if (Math.random() < 0.25) {
      const combatLevel = skillStore.getSkill('combat').level
      const winRate = Math.min(0.95, 0.5 + combatLevel * 0.05)
      if (Math.random() < winRate) {
        const lootPool = ['copper_ore', 'iron_ore', 'quartz', 'jade', 'gold_ore']
        const loot = lootPool[Math.floor(Math.random() * lootPool.length)]!
        const lootQty = 1 + Math.floor(Math.random() * 2)
        inventoryStore.addItem(loot, lootQty)
        skillStore.addExp('combat', 15)
        const lootName = getItemById(loot)?.name ?? loot
        addLog(`Gece vakti yabani bir canavar çiftliğe sokuldu! Onu püskürttün ve ${lootQty} adet ${lootName} ele geçirdin.`)
      } else {
        const damage = 5 + Math.floor(Math.random() * 11)
        playerStore.takeDamage(damage)
        const crops = farmStore.plots.filter(p => p.state === 'growing' || p.state === 'harvestable')
        if (crops.length > 0) {
          const target = crops[Math.floor(Math.random() * crops.length)]!
          const cropName = getCropById(target.cropId ?? '')?.name ?? 'ürün'
          farmStore.removeCrop(target.id)
          addLog(`Gece vakti yabani bir canavar çiftliğe sokuldu! Durduramadın; ${damage} hasar aldın ve bir ${cropName} mahvoldu.`)
        } else {
          addLog(`Gece vakti yabani bir canavar çiftliğe sokuldu! Durduramadın ve ${damage} hasar aldın.`)
        }
      }
    }
  }

  // Orman çiftliği: günlük toplayıcılık
  if (gameStore.farmMapType === 'forest') {
    const foragePool = getForageItems(gameStore.season)
    const commonForage = foragePool.filter(f => f.chance >= 0.1)
    if (commonForage.length > 0) {
      const count = 1 + (Math.random() < 0.4 ? 1 : 0)
      const gathered: string[] = []
      for (let i = 0; i < count; i++) {
        const item = commonForage[Math.floor(Math.random() * commonForage.length)]!
        const quality = skillStore.rollForageQuality()
        inventoryStore.addItem(item.itemId, 1, quality)
        skillStore.addExp('foraging', item.expReward)
        gathered.push(getItemById(item.itemId)?.name ?? item.itemId)
      }
      addLog(`Korulukta şunları buldun: ${gathered.join(' ve ')}.`)
    }
  }

  // Tepe çiftliği: yüzey cevher damarı
  if (gameStore.farmMapType === 'hilltop') {
    if (!gameStore.surfaceOrePatch && Math.random() < 0.35) {
      const year = gameStore.year
      const orePool = year >= 2 ? ['copper_ore', 'iron_ore', 'gold_ore'] : ['copper_ore', 'iron_ore']
      const oreId = orePool[Math.floor(Math.random() * orePool.length)]!
      const qty = 3 + Math.floor(Math.random() * 3)
      gameStore.surfaceOrePatch = { oreId, quantity: qty }
      const oreName = getItemById(oreId)?.name ?? 'maden'
      addLog(`Tepenin yamacında bir ${oreName} damarı belirdi!`)
    }
  }

  // Dere çiftliği: dere balığı birikimi
  if (gameStore.farmMapType === 'riverland') {
    const seasonFish = FISH.filter(f => (f.location ?? 'creek') === 'creek' && f.season.includes(gameStore.season as any))
    if (seasonFish.length > 0) {
      const isRainy = gameStore.isRainy
      const catchCount = isRainy ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2)
      const catches: { fishId: string; quality: 'normal' | 'fine' | 'excellent' | 'supreme' }[] = []
      for (let i = 0; i < catchCount; i++) {
        const fish = seasonFish[Math.floor(Math.random() * seasonFish.length)]!
        const quality: 'normal' | 'fine' = Math.random() < 0.15 ? 'fine' : 'normal'
        catches.push({ fishId: fish.id, quality })
      }
      const MAX_CREEK_CATCH = 10
      const merged = [...gameStore.creekCatch, ...catches].slice(0, MAX_CREEK_CATCH)
      gameStore.creekCatch = merged
      addLog(`Derede balıklar sıçrıyor; çiftlik paneline gidip avı toplayabilirsin.`)
    }
  }

  // Evcil dost edinme tetiklenmesi
  if (gameStore.day >= 7 && gameStore.year === 1 && gameStore.season === 'spring' && !animalStore.pet) {
    triggerPetAdoption()
  }

  // Çiftlik sayfasına dön
  void router.push({ name: 'farm' })

  // Otomatik kayıt
  saveStore.autoSave()
}

export const useEndDay = () => {
  return { handleEndDay }
  }
