import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  NpcState,
  FriendshipLevel,
  HeartEventDef,
  Quality,
  ChildState,
  PregnancyState,
  PregnancyStage,
  ProposalResponse,
  FarmHelperTask,
  HiredHelper
} from '@/types'
import { NPCS, getNpcById, getHeartEventsForNpc, RECIPES } from '@/data'
import { WEATHER_TIPS, getFortuneTip, getLivingTip, getRecipeTipMessage, NO_RECIPE_TIP, TIP_NPC_IDS } from '@/data/npcTips'
import { getItemById } from '@/data/items'
import { useInventoryStore } from './useInventoryStore'
import { useGameStore } from './useGameStore'
import { usePlayerStore } from './usePlayerStore'
import { useCookingStore } from './useCookingStore'
import { useFarmStore } from './useFarmStore'
import { useAnimalStore } from './useAnimalStore'
import { useFishPondStore } from './useFishPondStore'

/** Gönül seviyesi eşikleri (10 kalp, kalp başı 250 puan, üst sınır 2500) */
const FRIENDSHIP_THRESHOLDS: { level: FriendshipLevel; min: number }[] = [
  { level: 'bestFriend', min: 2000 },
  { level: 'friendly', min: 1000 },
  { level: 'acquaintance', min: 500 },
  { level: 'stranger', min: 0 }
]

export const useNpcStore = defineStore('npc', () => {
  const npcStates = ref<NpcState[]>(
    NPCS.map(npc => ({
      npcId: npc.id,
      friendship: 0,
      talkedToday: false,
      giftedToday: false,
      giftsThisWeek: 0,
      dating: false,
      married: false,
      zhiji: false,
      triggeredHeartEvents: []
    }))
  )

  /** Günlük öğüt NPC'si bugün konuştu mu */
  const tipGivenToday = ref<Record<string, boolean>>({})

  /** Çocuk listesi */
  const children = ref<ChildState[]>([])

  /** Çocuk kimliği sayaç değeri */
  const nextChildId = ref<number>(0)

  /** Evlilikte geçen gün sayısı */
  const daysMarried = ref<number>(0)

  /** Can yoldaşlığı gün sayısı */
  const daysZhiji = ref<number>(0)

  /** Gebelik durumu (null = gebelik yok) */
  const pregnancy = ref<PregnancyState | null>(null)

  /** Eş çocuk isteğinde bulundu mu */
  const childProposalPending = ref<boolean>(false)

  /** Reddedilen teklif sayısı */
  const childProposalDeclinedCount = ref<number>(0)

  /** Son ret/bekleme kararından beri geçen gün */
  const daysSinceProposalDecline = ref<number>(0)

  /** Düğün geri sayımı (0 = düğün yok) */
  const weddingCountdown = ref<number>(0)

  /** Düğün yapılacak NPC kimliği */
  const weddingNpcId = ref<string | null>(null)

  // ============================================================
  // Yardımcı sistemi
  // ============================================================

  const hiredHelpers = ref<HiredHelper[]>([])
  const MAX_HELPERS = 2

  /** Yardımcı gündeliği */
  const HELPER_WAGES: Record<FarmHelperTask, number> = {
    water: 100,
    feed: 150,
    harvest: 200,
    weed: 100
  }

  /** Yardımcı görev adları */
  const HELPER_TASK_NAMES: Record<FarmHelperTask, string> = {
    water: 'sulama',
    feed: 'yemleme',
    harvest: 'hasat',
    weed: 'ot ve haşere temizliği'
  }

  /** Çalıştırılabilir NPC listesi (gönül>=1000, zaten tutulmuyor, eş/can yoldaşı değil) */
  const getHireableNpcs = (): { npcId: string; name: string; friendship: number }[] => {
    return npcStates.value
      .filter(s => {
        if (s.friendship < 1000) return false
        if (s.married || s.zhiji) return false
        if (hiredHelpers.value.some(h => h.npcId === s.npcId)) return false
        return true
      })
      .map(s => {
        const def = getNpcById(s.npcId)
        return { npcId: s.npcId, name: def?.name ?? s.npcId, friendship: s.friendship }
      })
  }

  /** NPC'yi yardımcı olarak tut */
  const hireHelper = (npcId: string, task: FarmHelperTask): { success: boolean; message: string } => {
    const state = getNpcState(npcId)
    if (!state) return { success: false, message: 'Böyle biri gaKöy’de yok.' }
    if (state.friendship < 1000) return { success: false, message: 'Gönül bağı yetmiyor (4 kalp / 1000 gerekir).' }
    if (state.married || state.zhiji) return { success: false, message: 'Eşin ya da can yoldaşın ırgat tutulamaz.' }
    if (hiredHelpers.value.length >= MAX_HELPERS) return { success: false, message: `En fazla ${MAX_HELPERS} yardımcı tutulabilir.` }
    if (hiredHelpers.value.some(h => h.npcId === npcId)) return { success: false, message: 'Bu kişi zaten iş başında.' }

    const npcDef = getNpcById(npcId)
    const name = npcDef?.name ?? npcId
    hiredHelpers.value.push({ npcId, task, dailyWage: HELPER_WAGES[task] })
    return { success: true, message: `${name}, bugün itibarıyla ${HELPER_TASK_NAMES[task]} işine koyuldu! (Gündelik ${HELPER_WAGES[task]} akçe)` }
  }

  /** Yardımcıyı sal */
  const dismissHelper = (npcId: string): { success: boolean; message: string } => {
    const idx = hiredHelpers.value.findIndex(h => h.npcId === npcId)
    if (idx < 0) return { success: false, message: 'Bu kişi zaten yanında çalışmıyor.' }

    const npcDef = getNpcById(npcId)
    const name = npcDef?.name ?? npcId
    hiredHelpers.value.splice(idx, 1)
    return { success: true, message: `${name} işten ayrıldı.` }
  }

  /** Günlük yardımcı işlemleri (useEndDay çağırır) */
  const processDailyHelpers = (taskFilter?: FarmHelperTask[]): { messages: string[]; dismissedNpcs: string[] } => {
    const playerStore = usePlayerStore()
    const farmStore = useFarmStore()
    const animalStore = useAnimalStore()
    const inventoryStore = useInventoryStore()
    const messages: string[] = []
    const dismissed: string[] = []

    for (const helper of [...hiredHelpers.value]) {
      if (taskFilter && !taskFilter.includes(helper.task)) continue

      const npcDef = getNpcById(helper.npcId)
      const name = npcDef?.name ?? 'Yardımcı'
      const state = getNpcState(helper.npcId)

      // Eş veya can yoldaşı olduysa otomatik ayrılır
      if (state && (state.married || state.zhiji)) {
        hiredHelpers.value = hiredHelpers.value.filter(h => h.npcId !== helper.npcId)
        messages.push(`${name}, artık senin ${state.married ? 'eşin' : 'can yoldaşın'} olduğu için yardımcı olarak çalışmıyor.`)
        dismissed.push(helper.npcId)
        continue
      }

      const efficiency = state && state.friendship >= 2000 ? 1.5 : 1.0

      // Ücret öde
      if (!playerStore.spendMoney(helper.dailyWage)) {
        hiredHelpers.value = hiredHelpers.value.filter(h => h.npcId !== helper.npcId)
        messages.push(`${name}’in gündeliği ödenemedi, o da işi bıraktı.`)
        dismissed.push(helper.npcId)
        continue
      }

      switch (helper.task) {
        case 'water': {
          const unwatered = farmStore.plots.filter(p => (p.state === 'planted' || p.state === 'growing') && !p.watered)
          const count = Math.min(unwatered.length, Math.floor(4 * efficiency) + Math.floor(Math.random() * 3))
          for (let i = 0; i < count; i++) farmStore.waterPlot(unwatered[i]!.id)
          if (count > 0) messages.push(`${name}, ${count} tarlayı suladı. (-${helper.dailyWage} akçe)`)
          else messages.push(`${name} bugün sulanacak yer bulamadı. (-${helper.dailyWage} akçe)`)
          break
        }
        case 'feed': {
          const result = animalStore.feedAll()
          const fishPondStore = useFishPondStore()
          const fedFish = fishPondStore.pond.built && !fishPondStore.pond.fedToday ? fishPondStore.feedFish() : false
          if (result.fedCount > 0 && fedFish) {
            messages.push(`${name}, ${result.fedCount} baş hayvanı ve balık havuzunu doyurdu. (-${helper.dailyWage} akçe)`)
          } else if (result.fedCount > 0) {
            messages.push(`${name}, ${result.fedCount} baş hayvanı doyurdu. (-${helper.dailyWage} akçe)`)
          } else if (fedFish) {
            messages.push(`${name}, balık havuzundaki balıkları yemledi. (-${helper.dailyWage} akçe)`)
          } else {
            messages.push(`${name} bugün yemlenecek bir şey bulamadı. (-${helper.dailyWage} akçe)`)
          }
          break
        }
        case 'harvest': {
          const harvestable = farmStore.plots.filter(p => p.state === 'harvestable')
          const count = Math.min(harvestable.length, Math.floor(5 * efficiency))
          let harvested = 0
          for (let i = 0; i < count; i++) {
            const result = farmStore.harvestPlot(harvestable[i]!.id)
            if (result.cropId) {
              inventoryStore.addItem(result.cropId, 1, 'normal')
              harvested++
            }
          }
          if (harvested > 0) messages.push(`${name}, ${harvested} tarlalık mahsul topladı. (-${helper.dailyWage} akçe)`)
          else messages.push(`${name} bugün hasatlık ürün bulamadı. (-${helper.dailyWage} akçe)`)
          break
        }
        case 'weed': {
          let cleared = 0
          for (const plot of farmStore.plots) {
            if (plot.weedy) {
              farmStore.clearWeed(plot.id)
              cleared++
            }
            if (plot.infested) {
              farmStore.curePest(plot.id)
              cleared++
            }
          }
          if (cleared > 0) messages.push(`${name}, ${cleared} yerde otu ve haşereyi temizledi. (-${helper.dailyWage} akçe)`)
          else messages.push(`${name}, bugün tarlayı tertemiz buldu. (-${helper.dailyWage} akçe)`)
          break
        }
      }
    }
    return { messages, dismissedNpcs: dismissed }
  }

  /** Çocuk ad havuzu */
  const CHILD_NAMES_MALE = ['Tuna', 'Aras', 'Doruk', 'Mert']
  const CHILD_NAMES_FEMALE = ['Ece', 'İlay', 'Selin', 'Yaren']

  /** NPC durumunu getir */
  const getNpcState = (npcId: string): NpcState | undefined => {
    return npcStates.value.find(s => s.npcId === npcId)
  }

  /** Gönül seviyesini getir */
  const getFriendshipLevel = (npcId: string): FriendshipLevel => {
    const state = getNpcState(npcId)
    if (!state) return 'stranger'
    for (const t of FRIENDSHIP_THRESHOLDS) {
      if (state.friendship >= t.min) return t.level
    }
    return 'stranger'
  }

  /** Bugün doğum günü mü */
  const isBirthday = (npcId: string): boolean => {
    const npcDef = getNpcById(npcId)
    if (!npcDef?.birthday) return false
    const gameStore = useGameStore()
    return npcDef.birthday.season === gameStore.season && npcDef.birthday.day === gameStore.day
  }

  /** Bugün doğum günü olan NPC */
  const getTodayBirthdayNpc = (): string | null => {
    const gameStore = useGameStore()
    for (const npc of NPCS) {
      if (npc.birthday && npc.birthday.season === gameStore.season && npc.birthday.day === gameStore.day) {
        return npc.id
      }
    }
    return null
  }

  /** Tetiklenebilir kalp olayı var mı */
  const checkHeartEvent = (npcId: string): HeartEventDef | null => {
    const state = getNpcState(npcId)
    if (!state) return null
    const events = getHeartEventsForNpc(npcId)
    for (const event of events) {
      if (event.requiresZhiji && !state.zhiji) continue
      if (!event.requiresZhiji && state.zhiji && event.id.endsWith('_heart_8')) continue
      if (state.friendship >= event.requiredFriendship && !state.triggeredHeartEvents.includes(event.id)) {
        return event
      }
    }
    return null
  }

  /** Kalp olayını işlendi diye işaretle */
  const markHeartEventTriggered = (npcId: string, eventId: string) => {
    const state = getNpcState(npcId)
    if (state && !state.triggeredHeartEvents.includes(eventId)) {
      state.triggeredHeartEvents.push(eventId)
    }
  }

  /** Gönül puanı değiştir */
  const adjustFriendship = (npcId: string, amount: number) => {
    const state = getNpcState(npcId)
    if (state) {
      state.friendship = Math.max(0, state.friendship + amount)
    }
  }

  /** Diyalog içindeki yer tutucuları değiştir */
  const replaceDialoguePlaceholders = (text: string): string => {
    const playerStore = usePlayerStore()
    return text.replace(/\{player\}/g, playerStore.playerName).replace(/\{title\}/g, playerStore.honorific)
  }

  /** NPC ile konuş (+20 gönül) */
  const talkTo = (npcId: string): { message: string; friendshipGain: number } | null => {
    const state = getNpcState(npcId)
    if (!state) return null
    if (state.talkedToday) return null

    state.talkedToday = true
    state.friendship += 20

    const npcDef = getNpcById(npcId)
    if (!npcDef) return null

    // Eş için özel konuşmalar
    if (state.married) {
      const playerStore = usePlayerStore()
      const gameStore = useGameStore()
      const name = playerStore.playerName

      const marriedDialogues = [
        `${name}, bugün çok yoruldun; akşam erken dön de birlikte oturalım.`,
        `${name}, sana sıcak aş bıraktım, hâlâ tencerede tüter.`,
        'Tarladaki işin bitti mi? Kendini fazla zorlama.',
        `${name} yanımdayken evin içi başka bir sıcak oluyor.`,
        'Bu akşam ne yiyesin gelir? Hazırlayayım.',
        'Evin içini topladım, biraz soluklan artık.',
        `${name} ile geçen her gün, gönlüme iyi geliyor.`,
        `${name}, bugün yüzün aydınlık görünüyor.`
      ]

      const seasonDialogues: Record<string, string[]> = {
        spring: ['Bahar geldi, gaKöy’ün avluları çiçek kokuyor.', `${name}, ekim işlerin yetişti mi?`],
        summer: [`Bugün hava kızgın, ${name}; bol bol su iç.`, 'Yazın serinliği en çok kavunda bulunur.'],
        autumn: [`Güz yeli ne hoş eser, ${name}; biraz yürüyelim mi?`, 'Bereket zamanı geldi, emeğin karşılığı göründü.'],
        winter: [`Ayaz sert bugün, ${name}; içeri geç de ısın.`, 'Kış gününde sıcak çay kadar kıymetlisi yok.']
      }

      const weatherDialogues: Record<string, string | null> = {
        rainy: 'Yağmur indi, tarla bugün su ister diye düşünme; biraz dinlen.',
        stormy: 'Dışarıda fırtına koptu, bugün uzağa gitme.',
        snowy: 'Kar yağdı; gaKöy bembeyaz olmuş, ne hoş.',
        windy: 'Rüzgâr sert, üstünü sıkı giyin.',
        sunny: null,
        cloudy: null,
        green_rain: null
      }

      const pool = [...marriedDialogues, ...(seasonDialogues[gameStore.season] ?? [])]
      const weatherLine = weatherDialogues[gameStore.weather]
      if (weatherLine) pool.push(weatherLine)

      const message = pool[Math.floor(Math.random() * pool.length)]!
      return { message, friendshipGain: 20 }
    }

    // Can yoldaşı için özel konuşmalar
    if (state.zhiji && npcDef.zhijiDialogues?.length) {
      const raw = npcDef.zhijiDialogues[Math.floor(Math.random() * npcDef.zhijiDialogues.length)]!
      const message = replaceDialoguePlaceholders(raw)
      return { message, friendshipGain: 20 }
    }

    // Sevgili konuşmaları
    if (state.dating && npcDef.datingDialogues && npcDef.datingDialogues.length > 0) {
      const raw = npcDef.datingDialogues[Math.floor(Math.random() * npcDef.datingDialogues.length)]!
      const message = replaceDialoguePlaceholders(raw)
      return { message, friendshipGain: 20 }
    }

    const level = getFriendshipLevel(npcId)
    const dialogues = npcDef.dialogues[level]
    const raw = dialogues[Math.floor(Math.random() * dialogues.length)]!
    const message = replaceDialoguePlaceholders(raw)

    return { message, friendshipGain: 20 }
  }

  /** Hediye ver (günde 1, haftada 2 kez) */
  const giveGift = (
    npcId: string,
    itemId: string,
    giftBonusMultiplier: number = 1,
    quality: Quality = 'normal'
  ): { gain: number; reaction: string } | null => {
    const state = getNpcState(npcId)
    if (!state) return null
    if (state.giftedToday) return null
    if (state.giftsThisWeek >= 2) return null

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem(itemId, 1, quality)) return null

    state.giftedToday = true
    state.giftsThisWeek++
    const npcDef = getNpcById(npcId)
    if (!npcDef) return null

    let gain: number
    let reaction: string

    if (npcDef.lovedItems.includes(itemId)) {
      gain = 80
      reaction = 'bayıldı'
    } else if (npcDef.likedItems.includes(itemId)) {
      gain = 45
      reaction = 'beğendi'
    } else if (npcDef.hatedItems.includes(itemId)) {
      gain = -40
      reaction = 'hiç sevmedi'
    } else {
      gain = 20
      reaction = 'eh işte'
    }

    const qualityMultiplier: Record<Quality, number> = { normal: 1.0, fine: 1.25, excellent: 1.5, supreme: 2.0 }
    const birthdayMultiplier = isBirthday(npcId) ? 4 : 1

    gain = Math.floor(gain * qualityMultiplier[quality] * birthdayMultiplier * giftBonusMultiplier)
    state.friendship = Math.max(0, state.friendship + gain)

    return { gain, reaction }
  }

  /** Mendil verip sevgililiği başlat (2000 gönül / 8 kalp) */
  const startDating = (npcId: string): { success: boolean; message: string } => {
    const state = getNpcState(npcId)
    if (!state) return { success: false, message: 'Böyle biri yok.' }

    const npcDef = getNpcById(npcId)
    if (!npcDef?.marriageable) return { success: false, message: 'Bu kişiyle gönül bağı kurulamaz.' }

    const playerStore = usePlayerStore()
    if (npcDef.gender === playerStore.gender) {
      return { success: false, message: 'Mendil yalnız karşı cinse sunulabilir.' }
    }

    if (state.dating) return { success: false, message: 'Zaten gönül yoldaşısınız.' }
    if (state.married) return { success: false, message: 'Zaten evlisiniz.' }
    if (npcStates.value.some(s => s.married)) return { success: false, message: 'Zaten evlisin.' }
    if (state.friendship < 2000) return { success: false, message: 'Gönül bağı yetmiyor (8 kalp / 2000 gerekir).' }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem('silk_ribbon')) {
      return { success: false, message: 'Bir ipek mendil gerekir.' }
    }

    state.dating = true
    state.friendship += 160
    return { success: true, message: `${npcDef.name} utana sıkıla mendilini kabul etti… artık görüşmeye başladınız!` }
  }

  /** Evlenme teklifi (2500 gönül / 10 kalp) */
  const propose = (npcId: string): { success: boolean; message: string } => {
    const state = getNpcState(npcId)
    if (!state) return { success: false, message: 'Böyle biri yok.' }

    const npcDef = getNpcById(npcId)
    if (!npcDef?.marriageable) return { success: false, message: 'Bu kişiye evlenme teklifi edilemez.' }

    const playerStore = usePlayerStore()
    if (npcDef.gender === playerStore.gender) {
      return { success: false, message: 'Evlilik teklifi yalnız karşı cinse yapılabilir.' }
    }

    const alreadyMarried = npcStates.value.some(s => s.married)
    if (alreadyMarried) return { success: false, message: 'Zaten evlisin.' }

    if (weddingCountdown.value > 0) return { success: false, message: 'Düğün hazırlığı zaten sürüyor.' }

    if (!state.dating) return { success: false, message: 'Önce mendil verip gönül bağı kurman gerekir.' }

    if (state.friendship < 2500) return { success: false, message: 'Gönül bağı yetmiyor (10 kalp / 2500 gerekir).' }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem('jade_ring')) {
      return { success: false, message: 'Bir yeşim yüzük gerekir.' }
    }

    weddingCountdown.value = 3
    weddingNpcId.value = npcId
    state.friendship += 400
    return { success: true, message: `${npcDef.name}, gözleri dolarak yeşim yüzüğü kabul etti… düğün 3 gün sonra kurulacak!` }
  }

  /** Eşi getir */
  const getSpouse = (): NpcState | null => {
    return npcStates.value.find(s => s.married) ?? null
  }

  /** Can yoldaşını getir */
  const getZhiji = (): NpcState | null => {
    return npcStates.value.find(s => s.zhiji) ?? null
  }

  /** Aynı cinsle can yoldaşı ol (2000 gönül) */
  const becomeZhiji = (npcId: string): { success: boolean; message: string } => {
    const state = getNpcState(npcId)
    if (!state) return { success: false, message: 'Böyle biri yok.' }

    const npcDef = getNpcById(npcId)
    if (!npcDef?.marriageable) return { success: false, message: 'Bu kişiyle can yoldaşlığı kurulamaz.' }

    const playerStore = usePlayerStore()
    if (npcDef.gender !== playerStore.gender) {
      return { success: false, message: 'Can yoldaşlığı yalnız aynı cinsten biriyle kurulabilir.' }
    }

    if (state.zhiji) return { success: false, message: 'Zaten can yoldaşısınız.' }
    if (state.dating || state.married) return { success: false, message: 'Sevgili ya da eş ile can yoldaşı olunamaz.' }
    if (npcStates.value.some(s => s.zhiji)) return { success: false, message: 'Zaten bir can yoldaşın var.' }
    if (state.friendship < 2000) return { success: false, message: 'Gönül bağı yetmiyor (8 kalp / 2000 gerekir).' }

    const inventoryStore = useInventoryStore()
    if (!inventoryStore.removeItem('zhiji_jade')) {
      return { success: false, message: 'Bir can yoldaşı yeşimi gerekir.' }
    }

    state.zhiji = true
    state.friendship += 160
    const label = playerStore.gender === 'male' ? 'can kardeş' : 'can yoldaşı'
    return { success: true, message: `${npcDef.name}, yeşim nişanını saygıyla kabul etti… artık ${label} oldunuz!` }
  }

  /** Can yoldaşlığını boz */
  const dissolveZhiji = (): { success: boolean; message: string } => {
    const zhijiState = getZhiji()
    if (!zhijiState) return { success: false, message: 'Henüz bir can yoldaşın yok.' }

    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(10000)) {
      return { success: false, message: 'Yeterli akçe yok (10000 gerekir).' }
    }

    const npcDef = getNpcById(zhijiState.npcId)
    zhijiState.zhiji = false
    zhijiState.friendship = 1000
    daysZhiji.value = 0

    return { success: true, message: `${npcDef?.name ?? 'Can yoldaşın'} ile kurduğun bağ çözüldü.` }
  }

  /** Günlük düğün sayacı */
  const dailyWeddingUpdate = (): { weddingToday: boolean; npcId: string | null } => {
    if (weddingCountdown.value <= 0 || !weddingNpcId.value) {
      return { weddingToday: false, npcId: null }
    }
    weddingCountdown.value--
    if (weddingCountdown.value <= 0) {
      const npcId = weddingNpcId.value
      const state = getNpcState(npcId)
      if (state) {
        state.married = true
        state.dating = false
        state.friendship = Math.max(state.friendship, 3500)
      }
      weddingNpcId.value = null
      return { weddingToday: true, npcId }
    }
    return { weddingToday: false, npcId: null }
  }

  /** Düğünü iptal et */
  const cancelWedding = () => {
    weddingCountdown.value = 0
    weddingNpcId.value = null
  }

  /** Boşan */
  const divorce = (): { success: boolean; message: string } => {
    const spouse = getSpouse()
    if (!spouse) return { success: false, message: 'Henüz evli değilsin.' }

    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(30000)) {
      return { success: false, message: 'Yeterli akçe yok (30000 gerekir).' }
    }

    const npcDef = getNpcById(spouse.npcId)
    spouse.married = false
    spouse.dating = false
    spouse.friendship = 1000
    pregnancy.value = null
    childProposalPending.value = false
    daysMarried.value = 0
    cancelWedding()

    return { success: true, message: `${npcDef?.name ?? 'Eşin'} ile evliliğin sona erdi.` }
  }

  /** Çocuğu uzak akrabaya yolla */
  const releaseChild = (childId: number): { success: boolean; message: string } => {
    const child = children.value.find(c => c.id === childId)
    if (!child) return { success: false, message: 'Böyle bir çocuk bulunamadı.' }

    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(10000)) {
      return { success: false, message: 'Yeterli akçe yok (10000 gerekir).' }
    }

    const name = child.name
    children.value = children.value.filter(c => c.id !== childId)
    return { success: true, message: `${name}, uzak akrabaların yanına gönderildi.` }
  }

  // ============================================================
  // Gebelik sistemi
  // ============================================================

  const PREGNANCY_STAGE_CONFIG: Record<PregnancyStage, { days: number; label: string }> = {
    early: { days: 5, label: 'İlk dönem' },
    mid: { days: 5, label: 'Orta dönem' },
    late: { days: 5, label: 'Son dönem' },
    ready: { days: 3, label: 'Doğuma hazır' }
  }

  const STAGE_ORDER: PregnancyStage[] = ['early', 'mid', 'late', 'ready']

  const MEDICAL_PLANS = {
    normal: { cost: 1000, successRate: 0.8, label: 'Sade doğum hazırlığı' },
    advanced: { cost: 5000, successRate: 0.95, label: 'Usta ebe desteği' },
    luxury: { cost: 15000, successRate: 1.0, label: 'Konak usulü doğum' }
  } as const

  /** Eş çocuk teklif etmeli mi */
  const checkChildProposal = (): boolean => {
    const spouse = getSpouse()
    if (!spouse) return false
    if (children.value.length >= 2) return false
    if (pregnancy.value !== null) return false
    if (childProposalPending.value) return false
    if (daysMarried.value < 7) return false
    if (spouse.friendship < 3000) return false
    if (childProposalDeclinedCount.value > 0) {
      const cooldownDays = 7 + childProposalDeclinedCount.value * 7
      if (daysSinceProposalDecline.value < cooldownDays) return false
    }
    return Math.random() < 0.05
  }

  /** Teklifi beklemeye al */
  const triggerChildProposal = () => {
    childProposalPending.value = true
  }

  /** Oyuncunun cevap vermesi */
  const respondToChildProposal = (response: ProposalResponse): { message: string; friendshipChange: number } => {
    childProposalPending.value = false
    const spouse = getSpouse()

    switch (response) {
      case 'accept':
        pregnancy.value = {
          stage: 'early',
          daysInStage: 0,
          stageDays: PREGNANCY_STAGE_CONFIG.early.days,
          careScore: 50,
          caredToday: false,
          giftedForPregnancy: false,
          companionToday: false,
          medicalPlan: null
        }
        if (spouse) spouse.friendship += 100
        childProposalDeclinedCount.value = 0
        daysSinceProposalDecline.value = 0
        return { message: 'Yeni bir canı yuvanıza çağırmaya karar verdiniz.', friendshipChange: 100 }

      case 'decline':
        if (spouse) spouse.friendship = Math.max(0, spouse.friendship - 50)
        childProposalDeclinedCount.value++
        daysSinceProposalDecline.value = 0
        return { message: 'Teklifi nazikçe geri çevirdin.', friendshipChange: -50 }

      case 'wait':
        daysSinceProposalDecline.value = 0
        childProposalDeclinedCount.value++
        return { message: 'Biraz daha zaman isteyip beklemeyi seçtin.', friendshipChange: 0 }
    }
  }

  /** Gebelik bakımı */
  const performPregnancyCare = (
    action: 'gift' | 'companion' | 'supplement' | 'rest'
  ): { success: boolean; message: string; careGain: number } => {
    if (!pregnancy.value) return { success: false, message: 'Şu anda doğum beklenmiyor.', careGain: 0 }

    let careGain = 0
    let message = ''

    switch (action) {
      case 'gift': {
        if (pregnancy.value.giftedForPregnancy) {
          return { success: false, message: 'Bugün zaten bir armağan verildi.', careGain: 0 }
        }
        pregnancy.value.giftedForPregnancy = true
        careGain = pregnancy.value.stage === 'early' ? 5 : 3
        message = 'İç ısıtan bir armağan sundun.'
        break
      }
      case 'companion': {
        if (pregnancy.value.companionToday) {
          return { success: false, message: 'Bugün zaten yanında vakit geçirildi.', careGain: 0 }
        }
        pregnancy.value.companionToday = true
        careGain = pregnancy.value.stage === 'mid' ? 5 : 3
        message = 'Bir süre yanında oturup uzun uzun konuştun.'
        break
      }
      case 'supplement': {
        const inventoryStore = useInventoryStore()
        const supplementItems: { id: string; gain: number }[] = [
          { id: 'ginseng', gain: 6 },
          { id: 'ginseng_tea', gain: 5 },
          { id: 'herb', gain: 3 },
          { id: 'green_tea_drink', gain: 3 },
          { id: 'chrysanthemum_tea', gain: 3 },
          { id: 'osmanthus_tea', gain: 3 }
        ]
        let found = false
        for (const si of supplementItems) {
          if (inventoryStore.removeItem(si.id, 1)) {
            found = true
            careGain = si.gain
            const itemDef = getItemById(si.id)
            message = `${itemDef?.name ?? 'Şifalı bir içecek'} kullanıldı.`
            break
          }
        }
        if (!found) {
          return { success: false, message: 'Uygun bir destekleyici yok (ginseng / ot / çay içeceği gerekir).', careGain: 0 }
        }
        break
      }
      case 'rest': {
        if (pregnancy.value.caredToday) {
          return { success: false, message: 'Bugün zaten dinlenme ayarlandı.', careGain: 0 }
        }
        careGain = pregnancy.value.stage === 'late' ? 5 : 2
        message = 'Bugünü dinlenmeye ayırdın.'
        break
      }
    }

    pregnancy.value.careScore = Math.min(100, pregnancy.value.careScore + careGain)
    pregnancy.value.caredToday = true
    return { success: true, message, careGain }
  }

  /** Doğum planı seç */
  const chooseMedicalPlan = (plan: 'normal' | 'advanced' | 'luxury'): { success: boolean; message: string } => {
    if (!pregnancy.value) return { success: false, message: 'Şu anda beklenen bir doğum yok.' }
    if (pregnancy.value.stage !== 'ready') return { success: false, message: 'Henüz doğum vakti gelmedi.' }

    const planInfo = MEDICAL_PLANS[plan]
    const playerStore = usePlayerStore()
    if (!playerStore.spendMoney(planInfo.cost)) {
      return { success: false, message: `Yeterli akçe yok (${planInfo.cost} gerekir).` }
    }

    pregnancy.value.medicalPlan = plan
    return { success: true, message: `${planInfo.label} seçildi. (${planInfo.cost} akçe)` }
  }

  /** Doğumu işle */
  const handleDelivery = (): {
    born?: { name: string; quality: 'normal' | 'premature' | 'healthy' }
    miscarriage?: boolean
  } => {
    if (!pregnancy.value) return {}

    const plan = pregnancy.value.medicalPlan ?? 'normal'
    const planInfo = MEDICAL_PLANS[plan]

    const careBonus = (pregnancy.value.careScore / 100) * 0.15
    const totalSuccessRate = Math.min(1.0, planInfo.successRate + careBonus)

    const success = Math.random() < totalSuccessRate

    if (!success) {
      pregnancy.value = null
      const spouse = getSpouse()
      if (spouse) {
        spouse.friendship = Math.max(0, spouse.friendship - 200)
      }
      return { miscarriage: true }
    }

    const birthQuality: 'normal' | 'premature' | 'healthy' =
      pregnancy.value.careScore >= 80 ? 'healthy' : pregnancy.value.careScore < 40 ? 'premature' : 'normal'

    const isBoy = Math.random() < 0.5
    const namePool = isBoy ? CHILD_NAMES_MALE : CHILD_NAMES_FEMALE
    const usedNames = children.value.map(c => c.name)
    const availableNames = namePool.filter(n => !usedNames.includes(n))
    const name = availableNames[Math.floor(Math.random() * availableNames.length)] ?? 'Yavru'

    children.value.push({
      id: nextChildId.value++,
      name,
      daysOld: 0,
      stage: 'baby',
      friendship: birthQuality === 'healthy' ? 30 : 0,
      interactedToday: false,
      birthQuality
    })

    pregnancy.value = null
    return { born: { name, quality: birthQuality } }
  }

  /** Günlük gebelik güncellemesi */
  const dailyPregnancyUpdate = (): {
    stageChanged?: { from: PregnancyStage; to: PregnancyStage }
    born?: { name: string; quality: 'normal' | 'premature' | 'healthy' }
    miscarriage?: boolean
  } => {
    if (getSpouse()) daysMarried.value++

    if (childProposalDeclinedCount.value > 0) {
      daysSinceProposalDecline.value++
    }

    if (!pregnancy.value) return {}

    pregnancy.value.caredToday = false
    pregnancy.value.giftedForPregnancy = false
    pregnancy.value.companionToday = false

    pregnancy.value.daysInStage++

    if (pregnancy.value.daysInStage >= pregnancy.value.stageDays) {
      const currentStageIndex = STAGE_ORDER.indexOf(pregnancy.value.stage)

      if (pregnancy.value.stage === 'ready') {
        return handleDelivery()
      }

      const from = pregnancy.value.stage
      const nextStage = STAGE_ORDER[currentStageIndex + 1]!
      pregnancy.value.stage = nextStage
      pregnancy.value.daysInStage = 0
      pregnancy.value.stageDays = PREGNANCY_STAGE_CONFIG[nextStage].days

      return { stageChanged: { from, to: nextStage } }
    }

    return {}
  }

  /** Günlük çocuk büyüme güncellemesi */
  const dailyChildUpdate = () => {
    for (const child of children.value) {
      child.daysOld++
      child.interactedToday = false
      if (child.stage === 'baby' && child.daysOld >= 14) {
        child.stage = 'toddler'
      } else if (child.stage === 'toddler' && child.daysOld >= 28) {
        child.stage = 'child'
      } else if (child.stage === 'child' && child.daysOld >= 56) {
        child.stage = 'teen'
      }
    }
  }

  /** Çocukla vakit geçir */
  const interactWithChild = (childId: number): { message: string; item?: string } | null => {
    const child = children.value.find(c => c.id === childId)
    if (!child) return null
    if (child.interactedToday) return null
    if (child.stage === 'baby') return null

    child.interactedToday = true
    child.friendship = Math.min(300, child.friendship + 2)

    if (child.stage === 'child' && Math.random() < 0.1) {
      const finds = ['wood', 'herb', 'pine_cone', 'wild_berry']
      const item = finds[Math.floor(Math.random() * finds.length)]!
      return { message: `${child.name}, sana bir şey uzattı.`, item }
    }

    return { message: `${child.name} ile biraz oynadın. (+2 gönül)` }
  }

  /** NPC günlük öğüt verir mi */
  const hasDailyTip = (npcId: string): boolean => {
    return (TIP_NPC_IDS as readonly string[]).includes(npcId)
  }

  /** NPC bugün öğüt verdi mi */
  const isTipGivenToday = (npcId: string): boolean => {
    return tipGivenToday.value[npcId] ?? false
  }

  /** Günlük öğüdü al */
  const getDailyTip = (npcId: string): string | null => {
    if (!hasDailyTip(npcId)) return null
    if (tipGivenToday.value[npcId]) return null

    tipGivenToday.value[npcId] = true
    const gameStore = useGameStore()

    switch (npcId) {
      case 'li_yu':
        return WEATHER_TIPS[gameStore.tomorrowWeather]
      case 'zhou_xiucai':
        return getFortuneTip(gameStore.dailyLuck)
      case 'wang_dashen': {
        const cookingStore = useCookingStore()
        const unlockedRecipes = RECIPES.filter(r => cookingStore.unlockedRecipes.includes(r.id))
        if (unlockedRecipes.length === 0) return NO_RECIPE_TIP
        const weekIndex = Math.floor((gameStore.day - 1) / 7)
        const seed = (gameStore.year - 1) * 16 + ['spring', 'summer', 'autumn', 'winter'].indexOf(gameStore.season) * 4 + weekIndex
        const recipe = unlockedRecipes[seed % unlockedRecipes.length]!
        const ingredientNames = recipe.ingredients.map(ing => {
          const item = getItemById(ing.itemId)
          return item ? `${item.name}×${ing.quantity}` : ing.itemId
        })
        return getRecipeTipMessage(recipe.name, ingredientNames)
      }
      case 'liu_cunzhang':
        return getLivingTip(gameStore.day, gameStore.year)
      default:
        return null
    }
  }

  /** Günlük sıfırlama + eş/can yoldaşı gönül azalması */
  const dailyReset = () => {
    const gameStore = useGameStore()

    tipGivenToday.value = {}

    for (const state of npcStates.value) {
      if (!state.talkedToday && state.married) {
        state.friendship = Math.max(0, state.friendship - 10)
      }
      if (!state.talkedToday && state.zhiji) {
        state.friendship = Math.max(0, state.friendship - 5)
      }
      state.talkedToday = false
      state.giftedToday = false
      if (gameStore.day % 7 === 0) {
        state.giftsThisWeek = 0
      }
    }

    if (getZhiji()) daysZhiji.value++
  }

  const serialize = () => {
    return {
      npcStates: npcStates.value,
      children: children.value,
      nextChildId: nextChildId.value,
      daysMarried: daysMarried.value,
      daysZhiji: daysZhiji.value,
      pregnancy: pregnancy.value,
      childProposalPending: childProposalPending.value,
      childProposalDeclinedCount: childProposalDeclinedCount.value,
      daysSinceProposalDecline: daysSinceProposalDecline.value,
      pendingChild: false,
      childCountdown: 0,
      weddingCountdown: weddingCountdown.value,
      weddingNpcId: weddingNpcId.value,
      hiredHelpers: hiredHelpers.value,
      friendshipVersion: 2
    }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    const isOldScale = !(data as any).friendshipVersion || (data as any).friendshipVersion < 2
    const savedStates = data.npcStates.map(s => ({
      ...s,
      friendship: isOldScale ? Math.round(s.friendship * 8) : s.friendship,
      married: s.married ?? false,
      dating: s.dating ?? false,
      zhiji: (s as any).zhiji ?? false,
      giftsThisWeek: (s as any).giftsThisWeek ?? 0,
      triggeredHeartEvents: s.triggeredHeartEvents ?? []
    }))
    const savedIds = new Set(savedStates.map(s => s.npcId))
    const newNpcStates: NpcState[] = NPCS.filter(npc => !savedIds.has(npc.id)).map(npc => ({
      npcId: npc.id,
      friendship: 0,
      talkedToday: false,
      giftedToday: false,
      giftsThisWeek: 0,
      dating: false,
      married: false,
      zhiji: false,
      triggeredHeartEvents: []
    }))
    npcStates.value = [...savedStates, ...newNpcStates]
    children.value = ((data as any).children ?? []).map((c: any) => ({
      ...c,
      birthQuality: c.birthQuality ?? 'normal'
    }))
    nextChildId.value =
      (data as any).nextChildId ?? (children.value.length > 0 ? Math.max(...children.value.map((c: ChildState) => c.id)) + 1 : 0)
    daysMarried.value = (data as any).daysMarried ?? 0
    daysZhiji.value = (data as any).daysZhiji ?? 0

    pregnancy.value = (data as any).pregnancy ?? null
    childProposalPending.value = (data as any).childProposalPending ?? false
    childProposalDeclinedCount.value = (data as any).childProposalDeclinedCount ?? 0
    daysSinceProposalDecline.value = (data as any).daysSinceProposalDecline ?? 0

    if ((data as any).pendingChild && !pregnancy.value) {
      const oldCountdown: number = (data as any).childCountdown ?? 0
      let stage: PregnancyStage = 'early'
      if (oldCountdown <= 3) stage = 'ready'
      else if (oldCountdown <= 8) stage = 'late'
      else if (oldCountdown <= 13) stage = 'mid'
      pregnancy.value = {
        stage,
        daysInStage: 0,
        stageDays: PREGNANCY_STAGE_CONFIG[stage].days,
        careScore: 50,
        caredToday: false,
        giftedForPregnancy: false,
        companionToday: false,
        medicalPlan: null
      }
    }

    weddingCountdown.value = (data as any).weddingCountdown ?? 0
    weddingNpcId.value = (data as any).weddingNpcId ?? null
    hiredHelpers.value = (data as any).hiredHelpers ?? []
  }

  return {
    npcStates,
    children,
    nextChildId,
    daysMarried,
    daysZhiji,
    pregnancy,
    childProposalPending,
    childProposalDeclinedCount,
    daysSinceProposalDecline,
    weddingCountdown,
    weddingNpcId,
    hiredHelpers,
    HELPER_WAGES,
    HELPER_TASK_NAMES,
    getNpcState,
    getFriendshipLevel,
    isBirthday,
    getTodayBirthdayNpc,
    checkHeartEvent,
    markHeartEventTriggered,
    adjustFriendship,
    talkTo,
    giveGift,
    startDating,
    propose,
    getSpouse,
    getZhiji,
    becomeZhiji,
    dissolveZhiji,
    dailyWeddingUpdate,
    cancelWedding,
    divorce,
    releaseChild,
    getHireableNpcs,
    hireHelper,
    dismissHelper,
    processDailyHelpers,
    checkChildProposal,
    triggerChildProposal,
    respondToChildProposal,
    performPregnancyCare,
    chooseMedicalPlan,
    dailyPregnancyUpdate,
    interactWithChild,
    dailyChildUpdate,
    dailyReset,
    hasDailyTip,
    isTipGivenToday,
    getDailyTip,
    tipGivenToday,
    PREGNANCY_STAGE_CONFIG,
    MEDICAL_PLANS,
    serialize,
    deserialize
  }
})
