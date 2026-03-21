import type { Weekday, TimePeriod, LocationGroup } from '@/types'

// === Zaman sabitleri ===
export const DAY_START_HOUR = 6
export const DAY_END_HOUR = 26 // gece 2
export const MIDNIGHT_HOUR = 24
export const PASSOUT_HOUR = 26

// === Hafta sistemi ===
export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const WEEKDAY_NAMES: Record<Weekday, string> = {
  mon: 'Pazartesi',
  tue: 'Salı',
  wed: 'Çarşamba',
  thu: 'Perşembe',
  fri: 'Cuma',
  sat: 'Cumartesi',
  sun: 'Pazar'
}

/** 1. gün = Pazartesi, 7. gün = Pazar, 8. gün = Pazartesi ... */
export const getWeekday = (day: number): Weekday => {
  return WEEKDAYS[(day - 1) % 7]!
}

// === Vakit belirleme ===
export const getTimePeriod = (hour: number): TimePeriod => {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  if (hour >= 20 && hour < 24) return 'night'
  return 'late_night'
}

// === Saat gösterimi ===
export const formatHour = (hour: number): string => {
  const realHour = hour >= 24 ? hour - 24 : hour
  if (hour >= 6 && hour < 12) return `Sabah ${realHour}:00`
  if (hour === 12) return `Öğle 12:00`
  if (hour > 12 && hour < 18) return `İkindi ${realHour}:00`
  if (hour >= 18 && hour < 24) return `Akşam ${realHour}:00`
  return `Gece ${realHour}:00`
}

/** Daha ayrıntılı zaman gösterimi (ondalıklı saati destekler) */
export const formatTime = (hour: number): string => {
  const totalMinutes = Math.round(hour * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const realH = h >= 24 ? h - 24 : h
  const mm = m.toString().padStart(2, '0')

  if (h >= 6 && h < 12) return `Sabah ${realH}:${mm}`
  if (h === 12 && m === 0) return `Öğle 12:00`
  if (h >= 12 && h < 18) return `İkindi ${realH}:${mm}`
  if (h >= 18 && h < 24) return `Akşam ${realH}:${mm}`
  return `Gece ${realH}:${mm}`
}

// === Eylem zaman bedelleri (birim: saat) ===
export const ACTION_TIME_COSTS = {
  // Çiftlik
  till: 0.17,
  plant: 0.17,
  water: 0.08,
  harvest: 0.17,
  // Balıkçılık
  fishStart: 1,
  // Madencilik
  mineOre: 0.25,
  combat: 0.25,
  nextFloor: 0.17,
  revealTile: 0.05,
  // Toplama
  forage: 1,
  chopTree: 1,
  // Aşçılık
  cook: 0.5,
  eat: 0,
  // Sosyalleşme
  talk: 0.17,
  gift: 0,
  // Atölye
  craftMachine: 0.17,
  startProcessing: 0,
  collectProduct: 0,
  craftSprinkler: 0.17,
  craftFertilizer: 0.17,
  craftJadeRing: 0.17,
  // Ahır ve kümes
  feedAnimals: 0.5,
  petAnimal: 0.17,
  batchPet: 0.5,
  graze: 1,
  // Çiftlik evi
  collectCave: 0.17,
  aging: 0.17,
  plantTree: 0.5,
  // Araç yükseltme
  toolUpgrade: 1,
  // Toplu çiftlik işlemleri
  batchWater: 0.17,
  batchTill: 0.25,
  batchHarvest: 0.5,
  // Altın eleme
  pan: 1,
  // Arayüz
  checkInventory: 0,
  checkSkills: 0,
  checkAchievement: 0,
  // Tohum yetiştirme
  breeding: 0.17,
  // Balık göleti
  feedFish: 0.5,
  cleanPond: 0.5,
  collectFishProducts: 0.17
} as const

/** Araç düzeyine göre eylem süresi indirimi (dakika) */
export const TOOL_TIME_SAVINGS: Record<string, number> = {
  basic: 0,
  iron: 10,
  steel: 20,
  iridium: 30
}

/** Beceri düzeyi başına eylem süresi azaltma oranı */
export const SKILL_TIME_REDUCTION_PER_LEVEL = 0.02

/** Bir eylemin en düşük süresi (dakika) */
export const MIN_ACTION_MINUTES = 10

// === Mekân grubu eşlemesi ===
export const TAB_TO_LOCATION_GROUP: Record<string, LocationGroup | null> = {
  farm: 'farm',
  animal: 'farm',
  home: 'farm',
  cottage: 'farm',
  village: 'village_area',
  shop: 'village_area',
  cooking: 'village_area',
  workshop: 'farm',
  breeding: 'farm',
  fishpond: 'farm',
  upgrade: 'village_area',
  forage: 'nature',
  fishing: 'nature',
  mining: 'mine',
  inventory: null,
  skills: null,
  achievement: null,
  charinfo: null,
  museum: 'village_area',
  guild: 'village_area',
  hanhai: 'hanhai'
}

// === Yolculuk süresi ===
export const TRAVEL_TIME: Record<string, number> = {
  'farm->village_area': 0.17,
  'farm->nature': 0.17,
  'farm->mine': 0.33,
  'village_area->farm': 0.17,
  'village_area->nature': 0.17,
  'village_area->mine': 0.33,
  'nature->farm': 0.17,
  'nature->village_area': 0.17,
  'nature->mine': 0.33,
  'mine->farm': 0.33,
  'mine->village_area': 0.33,
  'mine->nature': 0.33,
  'farm->hanhai': 0.5,
  'hanhai->farm': 0.5,
  'village_area->hanhai': 0.5,
  'hanhai->village_area': 0.5,
  'nature->hanhai': 0.5,
  'hanhai->nature': 0.5,
  'mine->hanhai': 0.5,
  'hanhai->mine': 0.5
}

// === Yolculuk direnç bedeli ===
export const TRAVEL_STAMINA: Record<string, number> = {
  'farm->village_area': 1,
  'farm->nature': 1,
  'farm->mine': 2,
  'village_area->farm': 1,
  'village_area->nature': 1,
  'village_area->mine': 2,
  'nature->farm': 1,
  'nature->village_area': 1,
  'nature->mine': 2,
  'mine->farm': 2,
  'mine->village_area': 2,
  'mine->nature': 2,
  'farm->hanhai': 3,
  'hanhai->farm': 3,
  'village_area->hanhai': 3,
  'hanhai->village_area': 3,
  'nature->hanhai': 3,
  'hanhai->nature': 3,
  'mine->hanhai': 3,
  'hanhai->mine': 3
}

const LOCATION_GROUP_NAMES: Record<LocationGroup, string> = {
  farm: 'Çiftlik',
  village_area: 'gaKöy',
  nature: 'Kır',
  mine: 'Maden Ocağı',
  hanhai: 'Kum Denizi'
}

export const getLocationGroupName = (group: LocationGroup): string => {
  return LOCATION_GROUP_NAMES[group]
}

// === Dükkân çalışma saatleri ===
export interface ShopSchedule {
  tabKey: string
  name: string
  closedDays: Weekday[]
  openHour: number
  closeHour: number
}

export const SHOP_SCHEDULES: ShopSchedule[] = [
  { tabKey: 'shop', name: 'gaKöy Çarşısı', closedDays: [], openHour: 6, closeHour: 24 },
  { tabKey: 'upgrade', name: 'Atölye', closedDays: ['sun'], openHour: 8, closeHour: 20 }
]

export const isShopOpen = (tabKey: string, day: number, hour: number): { open: boolean; reason?: string } => {
  const schedule = SHOP_SCHEDULES.find(s => s.tabKey === tabKey)
  if (!schedule) return { open: true }
  const weekday = getWeekday(day)
  if (schedule.closedDays.includes(weekday)) {
    return { open: false, reason: `${schedule.name} bugün kapalıdır (${WEEKDAY_NAMES[weekday]}).` }
  }
  if (hour < schedule.openHour) {
    return { open: false, reason: `${schedule.name} henüz açılmadı (${formatHour(schedule.openHour)} açılır).` }
  }
  if (hour >= schedule.closeHour) {
    return { open: false, reason: `${schedule.name} kapanmıştır (${formatHour(schedule.closeHour)} kapanır).` }
  }
  return { open: true }
}

// === NPC görünme vakitleri ===
export interface NpcScheduleEntry {
  npcId: string
  availableDays: Weekday[] | 'all'
  availableHours: { from: number; to: number }
}

export const NPC_SCHEDULES: NpcScheduleEntry[] = [
  // Eski NPC'ler
  { npcId: 'chen_bo', availableDays: 'all', availableHours: { from: 8, to: 20 } },
  { npcId: 'liu_niang', availableDays: 'all', availableHours: { from: 9, to: 21 } },
  { npcId: 'a_shi', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'], availableHours: { from: 7, to: 18 } },
  { npcId: 'qiu_yue', availableDays: 'all', availableHours: { from: 6, to: 22 } },
  { npcId: 'lin_lao', availableDays: 'all', availableHours: { from: 8, to: 19 } },
  { npcId: 'xiao_man', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], availableHours: { from: 9, to: 17 } },
  // Yeni evlenilebilir NPC'ler
  { npcId: 'chun_lan', availableDays: 'all', availableHours: { from: 7, to: 20 } },
  { npcId: 'xue_qin', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'], availableHours: { from: 10, to: 19 } },
  { npcId: 'su_su', availableDays: 'all', availableHours: { from: 8, to: 20 } },
  { npcId: 'hong_dou', availableDays: 'all', availableHours: { from: 10, to: 23 } },
  { npcId: 'dan_qing', availableDays: 'all', availableHours: { from: 8, to: 21 } },
  { npcId: 'a_tie', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], availableHours: { from: 7, to: 18 } },
  { npcId: 'yun_fei', availableDays: ['tue', 'thu', 'sat', 'sun'], availableHours: { from: 6, to: 16 } },
  { npcId: 'da_niu', availableDays: 'all', availableHours: { from: 6, to: 19 } },
  { npcId: 'mo_bai', availableDays: 'all', availableHours: { from: 12, to: 23 } },
  // Yeni evlenilemeyen NPC'ler
  { npcId: 'wang_dashen', availableDays: 'all', availableHours: { from: 6, to: 19 } },
  { npcId: 'zhao_mujiang', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], availableHours: { from: 7, to: 18 } },
  { npcId: 'sun_tiejiang', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], availableHours: { from: 7, to: 18 } },
  { npcId: 'zhang_popo', availableDays: 'all', availableHours: { from: 8, to: 17 } },
  { npcId: 'li_yu', availableDays: 'all', availableHours: { from: 6, to: 20 } },
  { npcId: 'zhou_xiucai', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'], availableHours: { from: 8, to: 17 } },
  { npcId: 'wu_shen', availableDays: 'all', availableHours: { from: 8, to: 20 } },
  { npcId: 'ma_liu', availableDays: ['wed', 'sat', 'sun'], availableHours: { from: 9, to: 18 } },
  { npcId: 'lao_song', availableDays: 'all', availableHours: { from: 18, to: 26 } },
  { npcId: 'pang_shen', availableDays: 'all', availableHours: { from: 5, to: 16 } },
  { npcId: 'a_hua', availableDays: 'all', availableHours: { from: 9, to: 18 } },
  { npcId: 'shi_tou', availableDays: 'all', availableHours: { from: 8, to: 20 } },
  { npcId: 'hui_niang', availableDays: 'all', availableHours: { from: 8, to: 19 } },
  { npcId: 'lao_lu', availableDays: 'all', availableHours: { from: 10, to: 22 } },
  { npcId: 'liu_cunzhang', availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'], availableHours: { from: 8, to: 18 } },
  { npcId: 'qian_niang', availableDays: 'all', availableHours: { from: 8, to: 18 } },
  { npcId: 'he_zhanggui', availableDays: 'all', availableHours: { from: 9, to: 22 } },
  { npcId: 'qin_dashu', availableDays: 'all', availableHours: { from: 6, to: 18 } },
  { npcId: 'a_fu', availableDays: 'all', availableHours: { from: 7, to: 18 } }
]

export const isNpcAvailable = (npcId: string, day: number, hour: number): boolean => {
  const schedule = NPC_SCHEDULES.find(s => s.npcId === npcId)
  if (!schedule) return true
  const weekday = getWeekday(day)
  if (schedule.availableDays !== 'all' && !schedule.availableDays.includes(weekday)) return false
  return hour >= schedule.availableHours.from && hour < schedule.availableHours.to
}

export const getNpcUnavailableReason = (npcId: string, day: number, hour: number): string | null => {
  const schedule = NPC_SCHEDULES.find(s => s.npcId === npcId)
  if (!schedule) return null
  const weekday = getWeekday(day)
  if (schedule.availableDays !== 'all' && !schedule.availableDays.includes(weekday)) {
    return 'Bugün köyde değil'
  }
  if (hour < schedule.availableHours.from) return 'Henüz dışarı çıkmadı'
  if (hour >= schedule.availableHours.to) return 'Eve döndü'
  return null
}

// === Geç yatma cezası ===
/** Giderek azalan geç gece toparlanması: yatış saatine göre doğrusal olarak düşer */
export const LATE_NIGHT_RECOVERY_MAX = 0.9 // saat 24'te yatarsa %90 toparlanır
export const LATE_NIGHT_RECOVERY_MIN = 0.6 // saat 25'te yatarsa %60 toparlanır
export const PASSOUT_STAMINA_RECOVERY = 0.5
export const PASSOUT_MONEY_PENALTY_RATE = 0.1
export const PASSOUT_MONEY_PENALTY_CAP = 1000
