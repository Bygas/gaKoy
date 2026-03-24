import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MonsterDef, CombatAction, MineFloorDef, MineTile, Quality } from '@/types'
import {
  getFloor,
  getRewardNames,
  getInfestedClearRewards,
  BOSS_MONSTERS,
  BOSS_MONEY_REWARDS,
  BOSS_ORE_REWARDS,
  getWeakenedBoss,
  MAX_MINE_FLOOR,
  generateSkullCavernFloor,
  scaleMonster,
  generateFloorGrid,
  getAdjacentIndices,
  getBombIndices
} from '@/data'
import { getBombById } from '@/data/processing'
import { getItemById } from '@/data/items'
import {
  getWeaponById,
  getEnchantmentById,
  MONSTER_DROP_WEAPONS,
  BOSS_DROP_WEAPONS,
  TREASURE_DROP_WEAPONS,
  rollRandomEnchantment,
  getWeaponDisplayName
} from '@/data/weapons'
import { getRingById, MONSTER_DROP_RINGS, BOSS_DROP_RINGS, TREASURE_DROP_RINGS } from '@/data/rings'
import { getHatById, MONSTER_DROP_HATS, BOSS_DROP_HATS, TREASURE_DROP_HATS } from '@/data/hats'
import { getShoeById, MONSTER_DROP_SHOES, BOSS_DROP_SHOES, TREASURE_DROP_SHOES } from '@/data/shoes'
import { usePlayerStore } from './usePlayerStore'
import { useInventoryStore } from './useInventoryStore'
import { useSkillStore } from './useSkillStore'
import { useAchievementStore } from './useAchievementStore'
import { useGuildStore } from './useGuildStore'
import { useQuestStore } from './useQuestStore'
import { useCookingStore } from './useCookingStore'
import { useGameStore } from './useGameStore'
import { useWalletStore } from './useWalletStore'
import { useSecretNoteStore } from './useSecretNoteStore'
import { useHiddenNpcStore } from './useHiddenNpcStore'
import type { SkullCavernFloorDef } from '@/data/mine'

const DEFEAT_MONEY_PENALTY_RATE = 0.1
const DEFEAT_MONEY_PENALTY_CAP = 15000
const DEFEAT_MAX_ITEM_LOSS = 3

export const useMiningStore = defineStore('mining', () => {
  const playerStore = usePlayerStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()

  /** Mevcut ilerleme (ana maden) */
  const currentFloor = ref(1)
  const safePointFloor = ref(0)
  const isExploring = ref(false)

  /** Kuru Kafa Mağarası durumu */
  const isInSkullCavern = ref(false)
  const skullCavernFloor = ref(0)
  const skullCavernBestFloor = ref(0)
  const cachedSkullFloorData = ref<SkullCavernFloorDef | null>(null)

  /** Cenk durumu */
  const inCombat = ref(false)
  const combatMonster = ref<MonsterDef | null>(null)
  const combatMonsterHp = ref(0)
  const combatRound = ref(0)
  const combatLog = ref<string[]>([])
  const combatIsBoss = ref(false)

  /** Yenilmiş BOSS'lar (ilk zafer kaydı) */
  const defeatedBosses = ref<string[]>([])

  /** Bu keşifte toplanan ganimetler (ayrılırken %50 kayıp için) */
  const sessionLoot = ref<{ itemId: string; quantity: number }[]>([])

  /** Avcı tılsımı etkisi: bu keşifte düşme oranı +%20 */
  const slayerCharmActive = ref(false)
  /** Lonca nişanı birikimli saldırı gücü artışı (kalıcı) */
  const guildBadgeBonusAttack = ref(0)
  /** Can muskası birikimli azami HP artışı (kalıcı) */
  const guildBonusMaxHp = ref(0)
  /** Uğur akçesi birikimli düşme oranı artışı (kalıcı, her sefer +0.05) */
  const guildBonusDropRate = ref(0)
  /** Koruyucu muska birikimli savunma artışı (kalıcı, her sefer +0.03) */
  const guildBonusDefense = ref(0)

  // ==================== Kare keşif durumu ====================

  /** Mevcut kattaki 6×6 kareler */
  const floorGrid = ref<MineTile[]>([])
  /** Giriş karesi indisi */
  const entryIndex = ref(0)
  /** Merdiven bulundu mu */
  const stairsFound = ref(false)
  /** Merdiven kullanılabilir mi (musallat/BOSS katlarında her şey temizlenmeli) */
  const stairsUsable = ref(false)
  /** Mevcut kattaki toplam yaratık sayısı */
  const totalMonstersOnFloor = ref(0)
  /** Yenilmiş yaratık sayısı */
  const monstersDefeatedCount = ref(0)
  /** Mevcut cenge karşılık gelen kare indisi */
  const _combatTileIndex = ref(-1)

  // ==================== Kuru Kafa Mağarası yardımı ====================

  /** Kuru Kafa Mağarası açıldı mı (60. kat BOSS'unu yenince) */
  const isSkullCavernUnlocked = (): boolean => {
    return defeatedBosses.value.includes('lava_lord')
  }

  /** Şu an faal olan kat numarasını al */
  const getActiveFloorNum = (): number => {
    return isInSkullCavern.value ? skullCavernFloor.value : currentFloor.value
  }

  /** Şu an faal olan kat verisini al (ana maden ve Kuru Kafa Mağarası uyumlu) */
  const getActiveFloorData = (): MineFloorDef | undefined => {
    if (isInSkullCavern.value) {
      const sc = cachedSkullFloorData.value
      if (!sc) return undefined
      return {
        floor: sc.floor,
        zone: 'abyss',
        ores: sc.ores,
        monsters: sc.monsters.map(m => scaleMonster(m, sc.scaleFactor)),
        isSafePoint: false,
        specialType: sc.specialType
      }
    }
    return getFloor(currentFloor.value)
  }

  /** Kuru Kafa Mağarası mevcut kat verisini üret ve sakla */
  const cacheSkullFloor = (floor: number) => {
    cachedSkullFloorData.value = generateSkullCavernFloor(floor)
  }

  // ==================== Kare üretimi ====================

  /** Mevcut katın 6×6 karelerini üret */
  const _generateGrid = () => {
    const floor = getActiveFloorData()
    if (!floor) return

    const floorNum = getActiveFloorNum()
    const scaleFactor = isInSkullCavern.value ? (cachedSkullFloorData.value?.scaleFactor ?? 1) : 1

    // BOSS katı ilk zafer kontrolü: BOSS verisini değiştir
    let floorForGrid = floor
    if (floor.specialType === 'boss' && !isInSkullCavern.value) {
      const bossId = BOSS_MONSTERS[currentFloor.value]?.id
      const isFirstKill = bossId ? !defeatedBosses.value.includes(bossId) : true
      if (!isFirstKill) {
        // Zayıflatılmış BOSS — kareler oluştuktan sonra değiştirilir
        const result = generateFloorGrid(floorForGrid, floorNum, isInSkullCavern.value, scaleFactor)
        const weakBoss = getWeakenedBoss(currentFloor.value)
        if (weakBoss) {
          for (const tile of result.tiles) {
            if (tile.type === 'boss' && tile.data?.monster) {
              tile.data.monster = weakBoss
            }
          }
        }
        floorGrid.value = result.tiles
        entryIndex.value = result.entryIndex
        totalMonstersOnFloor.value = result.totalMonsters
        monstersDefeatedCount.value = 0
        stairsFound.value = false
        stairsUsable.value = result.stairsUsable
        _combatTileIndex.value = -1
        return
      }
    }

    const result = generateFloorGrid(floorForGrid, floorNum, isInSkullCavern.value, scaleFactor)
    floorGrid.value = result.tiles
    entryIndex.value = result.entryIndex
    totalMonstersOnFloor.value = result.totalMonsters
    monstersDefeatedCount.value = 0
    stairsFound.value = false
    stairsUsable.value = result.stairsUsable
    _combatTileIndex.value = -1
  }

  // ==================== Kare etkileşimi ====================

  /** Açığa çıkmış yaratık/BOSS ile yeniden cenge gir (kaçtıktan ya da bomba ile açıldıktan sonra) */
  const engageRevealedMonster = (index: number): { success: boolean; message: string; startsCombat: boolean } => {
    if (!isExploring.value) return { success: false, message: 'Şu an madende değilsin.', startsCombat: false }
    if (inCombat.value) return { success: false, message: 'Cenk sürerken keşif yapılamaz.', startsCombat: false }

    const tile = floorGrid.value[index]
    if (!tile || tile.state !== 'revealed') return { success: false, message: 'Cenge girilemez.', startsCombat: false }
    if (tile.type !== 'monster' && tile.type !== 'boss') return { success: false, message: 'Bu karede yaratık yok.', startsCombat: false }

    const monster = tile.data?.monster
    if (!monster) return { success: false, message: 'Bu karede yaratık yok.', startsCombat: false }

    _combatTileIndex.value = tile.index
    combatMonster.value = { ...monster }
    combatMonsterHp.value = monster.hp
    combatRound.value = 0

    if (tile.type === 'boss') {
      const isFirstKill = !defeatedBosses.value.includes(monster.id)
      combatLog.value = [`BOSS cengi! ${monster.name} ile yeniden yüz yüzesin! (HP: ${monster.hp})${isFirstKill ? '' : ' (zayıflatılmış hâl)'}`]
      combatIsBoss.value = true
    } else {
      combatLog.value = [`Yeniden ${monster.name} ile karşılaştın! (HP: ${monster.hp})`]
      combatIsBoss.value = false
    }
    inCombat.value = true

    return { success: true, message: `${monster.name} ile cenge tutuştun!`, startsCombat: true }
  }

  /** Kare açılabilir mi */
  const canRevealTile = (index: number): boolean => {
    const tile = floorGrid.value[index]
    if (!tile || tile.state !== 'hidden') return false
    const adj = getAdjacentIndices(index)
    return adj.some(a => {
      const t = floorGrid.value[a]
      return t && t.state !== 'hidden'
    })
  }

  /** Kare aç — temel etkileşim girişi */
  const revealTile = (index: number): { success: boolean; message: string; startsCombat: boolean } => {
    if (!isExploring.value) return { success: false, message: 'Şu an madende değilsin.', startsCombat: false }
    if (inCombat.value) return { success: false, message: 'Cenk sürerken keşif yapılamaz.', startsCombat: false }

    const tile = floorGrid.value[index]
    if (!tile || tile.state !== 'hidden') return { success: false, message: 'Bu kare açılamaz.', startsCombat: false }
    if (!canRevealTile(index)) return { success: false, message: 'Yalnızca açılmış karelerin yanındaki yerler yoklanabilir.', startsCombat: false }

    // Kazma uygun mu kontrol et
    if (!inventoryStore.isToolAvailable('pickaxe')) {
      return { success: false, message: 'Kazman bileniyor ya da onarılıyor; şimdi maden kazılamaz.', startsCombat: false }
    }

    // Dayanıklılık harca
    const pickaxeMultiplier = inventoryStore.getToolStaminaMultiplier('pickaxe')
    const cookingStore = useCookingStore()
    const miningBuff = cookingStore.activeBuff?.type === 'mining' ? cookingStore.activeBuff.value / 100 : 0
    const walletStore = useWalletStore()
    const walletMiningReduction = walletStore.getMiningStaminaReduction()
    const ringMiningReduction = inventoryStore.getRingEffectValue('mining_stamina')
    const ringGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    const spiritMiningReduction = useHiddenNpcStore().getAbilityValue('shan_weng_1') / 100
    const staminaCost = Math.max(
      1,
      Math.floor(
        2 *
          pickaxeMultiplier *
          (1 - skillStore.getStaminaReduction('mining')) *
          (1 - miningBuff) *
          (1 - walletMiningReduction) *
          (1 - ringMiningReduction) *
          (1 - ringGlobalReduction) *
          (1 - spiritMiningReduction)
      )
    )
    if (!playerStore.consumeStamina(staminaCost)) {
      return { success: false, message: 'Takatin yetmiyor, keşfe devam edemezsin.', startsCombat: false }
    }

    // %3 olasılıkla gizli not
    if (Math.random() < 0.03) {
      useSecretNoteStore().tryCollectNote()
    }

    switch (tile.type) {
      case 'empty':
        return _handleEmptyTile(tile, staminaCost)
      case 'ore':
        return _handleOreTile(tile, staminaCost)
      case 'monster':
        return _handleMonsterTile(tile, staminaCost)
      case 'boss':
        return _handleBossTile(tile, staminaCost)
      case 'stairs':
        return _handleStairsTile(tile, staminaCost)
      case 'trap':
        return _handleTrapTile(tile, staminaCost)
      case 'treasure':
        return _handleTreasureTile(tile, staminaCost)
      case 'mushroom':
        return _handleMushroomTile(tile, staminaCost)
      default:
        tile.state = 'revealed'
        return { success: true, message: 'Bu köşede bir şey yok.', startsCombat: false }
    }
  }

  /** Boş kareyi işle */
  const _handleEmptyTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    tile.state = 'revealed'
    return { success: true, message: `Boş bir damar yokladın. (-${staminaCost} takat)`, startsCombat: false }
  }

  /** Maden cevheri karesini işle */
  const _handleOreTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    const oreId = tile.data?.oreId ?? 'copper_ore'
    let quantity = tile.data?.oreQuantity ?? 1

    if (skillStore.getSkill('mining').perk5 === 'miner' && Math.random() < 0.5) quantity += 1
    const gameStore = useGameStore()
    if (gameStore.farmMapType === 'hilltop' && Math.random() < 0.5) quantity += 1
    if (skillStore.getSkill('mining').perk10 === 'prospector' && Math.random() < 0.15) quantity *= 2
    const ringOreBonus = inventoryStore.getRingEffectValue('ore_bonus')
    if (ringOreBonus > 0) quantity += Math.floor(ringOreBonus)
    if (useHiddenNpcStore().isAbilityActive('hu_xian_2') && Math.random() < 0.15) quantity += 1

    inventoryStore.addItem(oreId, quantity)
    sessionLoot.value.push({ itemId: oreId, quantity })
    useAchievementStore().discoverItem(oreId)
    useQuestStore().onItemObtained(oreId, quantity)

    const hiddenNpcStore = useHiddenNpcStore()
    if (hiddenNpcStore.isAbilityActive('shan_weng_2') && Math.random() < 0.15) {
      const herbs = ['herb', 'ginseng'] as const
      const herbId = herbs[Math.floor(Math.random() * herbs.length)]!
      inventoryStore.addItem(herbId, 1)
      sessionLoot.value.push({ itemId: herbId, quantity: 1 })
    }

    const hilltopXpBonus = gameStore.farmMapType === 'hilltop' ? 1.25 : 1.0
    skillStore.addExp('mining', Math.floor(5 * hilltopXpBonus))

    tile.state = 'collected'
    return { success: true, message: `${quantity} parça cevher çıkardın! (-${staminaCost} takat)`, startsCombat: false }
  }

  /** Yaratık karesini işle */
  const _handleMonsterTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    const monster = tile.data?.monster
    if (!monster) {
      tile.state = 'revealed'
      return { success: true, message: 'Bu köşede bir şey yok.', startsCombat: false }
    }

    _combatTileIndex.value = tile.index
    combatMonster.value = { ...monster }
    combatMonsterHp.value = monster.hp
    combatRound.value = 0
    combatLog.value = [`${monster.name} önüne çıktı! (HP: ${monster.hp}) (-${staminaCost} takat)`]
    combatIsBoss.value = false
    inCombat.value = true

    return { success: true, message: `${monster.name} ile karşılaştın!`, startsCombat: true }
  }

  /** BOSS karesini işle */
  const _handleBossTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    const monster = tile.data?.monster
    if (!monster) {
      tile.state = 'revealed'
      return { success: true, message: 'Bu köşede bir şey yok.', startsCombat: false }
    }

    _combatTileIndex.value = tile.index
    combatMonster.value = { ...monster }
    combatMonsterHp.value = monster.hp
    combatRound.value = 0

    const isFirstKill = !defeatedBosses.value.includes(monster.id)
    combatLog.value = [`BOSS cengi! ${monster.name} yolunu kesti! (HP: ${monster.hp})${isFirstKill ? '' : ' (zayıflatılmış hâl)'} (-${staminaCost} takat)`]
    combatIsBoss.value = true
    inCombat.value = true

    return { success: true, message: `BOSS katı! ${monster.name} önünü kesti!`, startsCombat: true }
  }

  /** Merdiven karesini işle */
  const _handleStairsTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    tile.state = 'revealed'
    stairsFound.value = true

    if (!stairsUsable.value) {
      const floor = getActiveFloorData()
      if (floor?.specialType === 'infested') {
        const remaining = totalMonstersOnFloor.value - monstersDefeatedCount.value
        return {
          success: true,
          message: `Merdiven bulundu! Ama ilerlemek için evvela ${remaining} yaratığı daha temizlemelisin. (-${staminaCost} takat)`,
          startsCombat: false
        }
      }
      if (floor?.specialType === 'boss') {
        return { success: true, message: `Merdiven bulundu! Ama evvela BOSS'u devirmelisin. (-${staminaCost} takat)`, startsCombat: false }
      }
    }

    return { success: true, message: `Merdiveni buldun! Bir alt kata inebilirsin. (-${staminaCost} takat)`, startsCombat: false }
  }

  /** Tuzak karesini işle */
  const _handleTrapTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    const damage = tile.data?.trapDamage ?? 5
    playerStore.takeDamage(damage)
    tile.state = 'triggered'

    if (playerStore.hp <= 0) {
      const defeatResult = handleDefeat()
      return { success: true, message: `Bir tuzağa bastın! ${damage} hasar aldın. ${defeatResult.message}`, startsCombat: false }
    }

    return { success: true, message: `Bir tuzağa bastın! ${damage} hasar aldın. (-${staminaCost} takat)`, startsCombat: false }
  }

  /** Hazine sandığı karesini işle */
  const _handleTreasureTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    const items = tile.data?.treasureItems ?? []
    const money = tile.data?.treasureMoney ?? 0

    for (const r of items) {
      inventoryStore.addItem(r.itemId, r.quantity)
      sessionLoot.value.push(r)
      useAchievementStore().discoverItem(r.itemId)
    }
    if (money > 0) playerStore.earnMoney(money)

    const floor = getActiveFloorData()
    const treasureRings = TREASURE_DROP_RINGS[floor?.zone ?? 'shallow']
    if (treasureRings) {
      const ringTreasureBonus = inventoryStore.getRingEffectValue('treasure_find')
      for (const tr of treasureRings) {
        if (Math.random() < tr.chance + ringTreasureBonus * tr.chance) {
          inventoryStore.addRing(tr.ringId)
          items.push({ itemId: tr.ringId, quantity: 1 })
          getRingById(tr.ringId)
        }
      }
    }

    const treasureHats = TREASURE_DROP_HATS[floor?.zone ?? 'shallow']
    if (treasureHats) {
      const treasureBonus = inventoryStore.getRingEffectValue('treasure_find')
      for (const th of treasureHats) {
        if (Math.random() < th.chance + treasureBonus * th.chance) {
          inventoryStore.addHat(th.hatId)
          items.push({ itemId: th.hatId, quantity: 1 })
        }
      }
    }

    const treasureShoes = TREASURE_DROP_SHOES[floor?.zone ?? 'shallow']
    if (treasureShoes) {
      const treasureBonus = inventoryStore.getRingEffectValue('treasure_find')
      for (const ts of treasureShoes) {
        if (Math.random() < ts.chance + treasureBonus * ts.chance) {
          inventoryStore.addShoe(ts.shoeId)
          items.push({ itemId: ts.shoeId, quantity: 1 })
        }
      }
    }

    const treasureWeapons = TREASURE_DROP_WEAPONS[floor?.zone ?? 'shallow']
    if (treasureWeapons) {
      const treasureBonus = inventoryStore.getRingEffectValue('treasure_find')
      for (const tw of treasureWeapons) {
        if (Math.random() < tw.chance + treasureBonus * tw.chance) {
          const enchantId = rollRandomEnchantment()
          inventoryStore.addWeapon(tw.weaponId, enchantId)
          items.push({ itemId: tw.weaponId, quantity: 1 })
        }
      }
    }

    tile.state = 'collected'

    let msg = 'Bir hazine sandığı buldun!'
    if (items.length > 0) msg += `${getRewardNames(items)} elde ettin`
    if (money > 0) msg += `${items.length > 0 ? ' ve ' : ''}${money} akçe aldın`
    msg += `! (-${staminaCost} takat)`
    return { success: true, message: msg, startsCombat: false }
  }

  /** Mantar karesini işle */
  const _handleMushroomTile = (tile: MineTile, staminaCost: number): { success: boolean; message: string; startsCombat: boolean } => {
    const items = tile.data?.mushroomItems ?? []

    for (const r of items) {
      inventoryStore.addItem(r.itemId, r.quantity)
      sessionLoot.value.push(r)
      useAchievementStore().discoverItem(r.itemId)
    }
    skillStore.addExp('foraging', 3)

    tile.state = 'collected'
    return { success: true, message: `${getRewardNames(items)} topladın! (+3 toplayıcılık tecrübesi, -${staminaCost} takat)`, startsCombat: false }
  }

  // ==================== Bombalar ====================

  /** Kare üzerine bomba kullan */
  const useBombOnGrid = (bombId: string, centerIndex: number): { success: boolean; message: string } => {
    if (!isExploring.value) return { success: false, message: 'Şu an madende değilsin.' }
    if (inCombat.value) return { success: false, message: 'Cenk sürerken bomba kullanılamaz.' }

    const bombDef = getBombById(bombId)
    if (!bombDef) return { success: false, message: 'Geçersiz bomba.' }
    if (!inventoryStore.removeItem(bombId)) return { success: false, message: 'Heybende bu bomba yok.' }

    const excavatorSaved = skillStore.getSkill('mining').perk10 === 'excavator' && Math.random() < 0.3
    if (excavatorSaved) {
      inventoryStore.addItem(bombId, 1)
    }

    const indices = getBombIndices(centerIndex, bombId)
    const floor = getActiveFloorData()

    let oreCollected = 0
    let monstersKilled = 0

    for (const idx of indices) {
      const tile = floorGrid.value[idx]
      if (!tile || tile.state !== 'hidden') continue

      switch (tile.type) {
        case 'empty':
          tile.state = 'revealed'
          break
        case 'ore': {
          const oreId = tile.data?.oreId ?? 'copper_ore'
          const quantity = tile.data?.oreQuantity ?? 1
          inventoryStore.addItem(oreId, quantity)
          sessionLoot.value.push({ itemId: oreId, quantity })
          useAchievementStore().discoverItem(oreId)
          oreCollected++
          tile.state = 'collected'
          break
        }
        case 'monster': {
          if (bombDef.clearsMonster && tile.data?.monster) {
            const monster = tile.data.monster
            const wildernessXpBonus = useGameStore().farmMapType === 'wilderness' ? 1.5 : 1.0
            skillStore.addExp('combat', Math.floor(monster.expReward * 0.5 * wildernessXpBonus))
            for (const drop of monster.drops) {
              if (Math.random() < drop.chance * 0.5) {
                inventoryStore.addItem(drop.itemId)
                sessionLoot.value.push({ itemId: drop.itemId, quantity: 1 })
              }
            }
            tile.state = 'defeated'
            monstersDefeatedCount.value++
            useAchievementStore().recordMonsterKill()
            useGuildStore().recordKill(monster.id)
            monstersKilled++
          } else {
            tile.state = 'revealed'
          }
          break
        }
        case 'boss':
          tile.state = 'revealed'
          break
        case 'trap':
          tile.state = 'triggered'
          break
        case 'stairs':
          tile.state = 'revealed'
          stairsFound.value = true
          break
        case 'treasure': {
          const items = tile.data?.treasureItems ?? []
          const money = tile.data?.treasureMoney ?? 0
          for (const r of items) {
            inventoryStore.addItem(r.itemId, r.quantity)
            sessionLoot.value.push(r)
          }
          if (money > 0) playerStore.earnMoney(money)
          tile.state = 'collected'
          break
        }
        case 'mushroom': {
          const items = tile.data?.mushroomItems ?? []
          for (const r of items) {
            inventoryStore.addItem(r.itemId, r.quantity)
            sessionLoot.value.push(r)
          }
          tile.state = 'collected'
          break
        }
      }
    }

    if (monstersDefeatedCount.value >= totalMonstersOnFloor.value && totalMonstersOnFloor.value > 0) {
      stairsUsable.value = true
      if (floor?.specialType === 'infested') {
        const activeFloorNum = getActiveFloorNum()
        const clearRewards = getInfestedClearRewards(activeFloorNum)
        for (const r of clearRewards.items) {
          inventoryStore.addItem(r.itemId, r.quantity)
          sessionLoot.value.push(r)
        }
        playerStore.earnMoney(clearRewards.money)
      }
    }

    if (oreCollected > 0) skillStore.addExp('mining', 5 * oreCollected)

    let msg = `${bombDef.name} gürleyip patladı!`
    if (oreCollected > 0) msg += `${oreCollected} damar cevher toplandı`
    if (monstersKilled > 0) msg += `${oreCollected > 0 ? ', ' : ''}${monstersKilled} yaratık devrildi`
    if (oreCollected === 0 && monstersKilled === 0) msg += 'Biraz alan açığa çıktı'
    msg += '!'
    if (excavatorSaved) msg += ' (Kazıcı mahareti: bomba harcanmadı!)'
    return { success: true, message: msg }
  }

  // ==================== Gir / Çık ====================

  /** Madene gir (başlangıç emniyet katı seçilebilir) */
  const enterMine = (startFromSafePoint?: number): string => {
    isExploring.value = true
    isInSkullCavern.value = false
    const baseFloor = startFromSafePoint ?? safePointFloor.value
    currentFloor.value = baseFloor + 1
    sessionLoot.value = []

    _generateGrid()
    _checkAutoBossCombat()

    return `Bulut Saklı Maden’e girdin, şimdi ${currentFloor.value}. kattasın.`
  }

  /** Kuru Kafa Mağarası'na gir */
  const enterSkullCavern = (): string => {
    if (!isSkullCavernUnlocked()) return 'Evvela 60. katın BOSS’unu yenmeden Kuru Kafa Mağarası’na girilemez.'
    isExploring.value = true
    isInSkullCavern.value = true
    skullCavernFloor.value = 1
    cacheSkullFloor(1)
    sessionLoot.value = []

    _generateGrid()
    _checkAutoBossCombat()

    return 'Kuru Kafa Mağarası’na girdin, şimdi 1. kattasın.'
  }

  /** BOSS cengi kendi kendine başlar mı kontrol et */
  const _checkAutoBossCombat = () => {
    // BOSS katı kendi kendine başlamaz — oyuncu kareyi kendi açmalı
  }

  /** Açılmış emniyet duraklarını getir */
  const getUnlockedSafePoints = (): number[] => {
    const points: number[] = [0]
    for (let f = 5; f <= safePointFloor.value; f += 5) {
      points.push(f)
    }
    return points
  }

  // ==================== Cenk ====================

  /** Cenk hareketi */
  const combatAction = (action: CombatAction): { message: string; combatOver: boolean; won: boolean } => {
    if (!inCombat.value || !combatMonster.value) {
      return { message: 'Şu an cenk yok.', combatOver: true, won: false }
    }

    combatRound.value++
    const monster = combatMonster.value

    if (action === 'flee') {
      if (combatIsBoss.value) {
        combatLog.value.push('BOSS cenginden kaçılmaz!')
        return { message: 'BOSS cenginden kaçamazsın!', combatOver: false, won: false }
      }
      inCombat.value = false
      if (_combatTileIndex.value >= 0) {
        const tile = floorGrid.value[_combatTileIndex.value]
        if (tile) tile.state = 'revealed'
        _combatTileIndex.value = -1
      }
      combatLog.value.push('Cenk meydanından çekildin!')
      return { message: 'Çatışmadan sıyrılıp uzaklaştın.', combatOver: true, won: false }
    }

    if (action === 'defend') {
      const cookingStore = useCookingStore()
      const defenseReduction = cookingStore.activeBuff?.type === 'defense' ? cookingStore.activeBuff.value / 100 : 0
      const tankReduction = skillStore.getSkill('combat').perk10 === 'tank' ? 0.7 : 0.6
      const owned = inventoryStore.getEquippedWeapon()
      const enchant = owned.enchantmentId ? getEnchantmentById(owned.enchantmentId) : null
      const sturdyReduction = enchant?.special === 'sturdy' ? 0.85 : 1.0
      const ringDefenseBonus = inventoryStore.getRingEffectValue('defense_bonus')
      const damage = Math.max(
        1,
        Math.floor(
          monster.attack *
            (1 - tankReduction) *
            (1 - defenseReduction) *
            sturdyReduction *
            (1 - ringDefenseBonus) *
            (1 - guildBonusDefense.value)
        )
      )
      playerStore.takeDamage(damage)
      let defendMsg = `Savunmaya çekildin, ${damage} hasar aldın.`

      if (skillStore.getSkill('combat').perk5 === 'defender') {
        playerStore.restoreHealth(5)
        defendMsg += ' (Koruyucu ruh: 5 HP geri geldi)'
      }

      combatLog.value.push(defendMsg)

      if (playerStore.hp <= 0) {
        return handleDefeat()
      }
      return { message: `Savundun! ${damage} hasar aldın.`, combatOver: false, won: false }
    }

    const cookingStore = useCookingStore()
    const owned = inventoryStore.getEquippedWeapon()
    const weaponDef = getWeaponById(owned.defId)
    const enchant = owned.enchantmentId ? getEnchantmentById(owned.enchantmentId) : null

    const ringAttackBonus = inventoryStore.getRingEffectValue('attack_bonus')
    const allSkillsBuff = cookingStore.activeBuff?.type === 'all_skills' ? cookingStore.activeBuff.value : 0
    const guildStore = useGuildStore()
    const baseAttack =
      inventoryStore.getWeaponAttack() +
      (skillStore.combatLevel + allSkillsBuff) * 2 +
      ringAttackBonus +
      guildBadgeBonusAttack.value +
      guildStore.getGuildAttackBonus()
    const bruteBonus = skillStore.getSkill('combat').perk10 === 'brute' ? 1.25 : 1.0

    const ringCritBonus = inventoryStore.getRingEffectValue('crit_rate_bonus')
    const ringLuck = inventoryStore.getRingEffectValue('luck')
    const critRate = inventoryStore.getWeaponCritRate() + ringCritBonus + ringLuck * 0.5
    const isCrit = Math.random() < critRate
    const critMult = isCrit ? 1.5 : 1.0

    const damageToMonster = Math.max(1, Math.floor((baseAttack - monster.defense) * bruteBonus * critMult))
    combatMonsterHp.value -= damageToMonster
    const totalDamageDealt = damageToMonster

    let msg = `${monster.name} üzerine yürüdün, ${damageToMonster} hasar verdin.`
    if (isCrit) msg = `Kritik vuruş! ${msg}`

    let extraDamage = 0
    if (weaponDef?.type === 'dagger' && Math.random() < 0.25) {
      const bonusDamage = Math.max(1, Math.floor(damageToMonster * 0.5))
      combatMonsterHp.value -= bonusDamage
      extraDamage = bonusDamage
      msg += ` Ardıl darbe indi! Ek olarak ${bonusDamage} hasar verdin!`
    }

    const isStunned = weaponDef?.type === 'club' && Math.random() < 0.2

    const ringVampiric = inventoryStore.getRingEffectValue('vampiric')
    const totalVampiric = (enchant?.special === 'vampiric' ? 0.15 : 0) + ringVampiric
    if (totalVampiric > 0) {
      const healAmount = Math.floor((totalDamageDealt + extraDamage) * totalVampiric)
      if (healAmount > 0) {
        playerStore.restoreHealth(healAmount)
        msg += ` Kan emici kudretle ${healAmount} HP geri kazandın!`
      }
    }

    if (combatMonsterHp.value <= 0) {
      return handleMonsterDefeat(monster, msg, totalDamageDealt + extraDamage)
    }

    if (isStunned) {
      msg += ` ${monster.name} sersemledi!`
      combatLog.value.push(msg)
      return { message: msg, combatOver: false, won: false }
    }

    if (skillStore.getSkill('combat').perk10 === 'acrobat' && Math.random() < 0.25) {
      msg += ` ${monster.name}’in karşı darbesinden çeviklikle sıyrıldın!`
      combatLog.value.push(msg)
      return { message: msg, combatOver: false, won: false }
    }

    const defenseReduction = cookingStore.activeBuff?.type === 'defense' ? cookingStore.activeBuff.value / 100 : 0
    const fighterReduction = skillStore.getSkill('combat').perk5 === 'fighter' ? 0.15 : 0
    const sturdyReduction = enchant?.special === 'sturdy' ? 0.85 : 1.0
    const ringDefenseBonus = inventoryStore.getRingEffectValue('defense_bonus')
    const monsterDamage = Math.max(
      1,
      Math.floor(
        monster.attack *
          (1 - fighterReduction) *
          (1 - defenseReduction) *
          sturdyReduction *
          (1 - ringDefenseBonus) *
          (1 - guildBonusDefense.value)
      )
    )
    playerStore.takeDamage(monsterDamage)
    msg += ` ${monster.name} karşılık verdi, ${monsterDamage} hasar aldın.`
    combatLog.value.push(msg)

    if (playerStore.hp <= 0) {
      return handleDefeat()
    }

    return { message: msg, combatOver: false, won: false }
  }

  /** Yaratık yenilince işlenecekler */
  const handleMonsterDefeat = (
    monster: MonsterDef,
    msg: string,
    _totalDamage: number
  ): { message: string; combatOver: boolean; won: boolean } => {
    inCombat.value = false

    const floor = getActiveFloorData()
    const wildernessXpBonus = useGameStore().farmMapType === 'wilderness' ? 1.5 : 1.0
    const infestedXpBonus = floor?.specialType === 'infested' ? 1.5 : 1.0
    skillStore.addExp('combat', Math.floor(monster.expReward * wildernessXpBonus * infestedXpBonus))

    const owned = inventoryStore.getEquippedWeapon()
    const enchant = owned.enchantmentId ? getEnchantmentById(owned.enchantmentId) : null
    const ringDropBonus = inventoryStore.getRingEffectValue('monster_drop_bonus')
    const ringLuckBonus = inventoryStore.getRingEffectValue('luck')
    const luckyBonus =
      (enchant?.special === 'lucky' ? 0.2 : 0) +
      ringDropBonus +
      ringLuckBonus * 0.5 +
      (slayerCharmActive.value ? 0.2 : 0) +
      guildBonusDropRate.value

    const drops: string[] = []
    for (const drop of monster.drops) {
      if (Math.random() < drop.chance + luckyBonus) {
        inventoryStore.addItem(drop.itemId)
        sessionLoot.value.push({ itemId: drop.itemId, quantity: 1 })
        useAchievementStore().discoverItem(drop.itemId)
        drops.push(drop.itemId)
      }
    }

    if (skillStore.getSkill('mining').perk10 === 'mineralogist') {
      if (floor && floor.ores.length > 0) {
        const bonusOre = floor.ores[Math.floor(Math.random() * floor.ores.length)]!
        inventoryStore.addItem(bonusOre)
        sessionLoot.value.push({ itemId: bonusOre, quantity: 1 })
        drops.push(bonusOre)
      }
    }

    if (!combatIsBoss.value && floor) {
      const weaponDrops = MONSTER_DROP_WEAPONS[floor.zone]
      if (weaponDrops) {
        for (const wd of weaponDrops) {
          const dropChance = wd.chance + luckyBonus * wd.chance
          if (Math.random() < dropChance) {
            const enchantId = rollRandomEnchantment()
            inventoryStore.addWeapon(wd.weaponId, enchantId)
            const displayName = getWeaponDisplayName(wd.weaponId, enchantId)
            msg += ` Bir silah düştü: ${displayName}!`
          }
        }
      }
      const ringDrops = MONSTER_DROP_RINGS[floor.zone]
      if (ringDrops) {
        for (const rd of ringDrops) {
          if (Math.random() < rd.chance + luckyBonus * rd.chance) {
            inventoryStore.addRing(rd.ringId)
            const ringDef = getRingById(rd.ringId)
            msg += ` Bir yüzük düştü: ${ringDef?.name ?? rd.ringId}!`
          }
        }
      }
      const hatDrops = MONSTER_DROP_HATS[floor.zone]
      if (hatDrops) {
        for (const hd of hatDrops) {
          if (Math.random() < hd.chance + luckyBonus * hd.chance) {
            inventoryStore.addHat(hd.hatId)
            const hatDef = getHatById(hd.hatId)
            msg += ` Bir başlık düştü: ${hatDef?.name ?? hd.hatId}!`
          }
        }
      }
      const shoeDrops = MONSTER_DROP_SHOES[floor.zone]
      if (shoeDrops) {
        for (const sd of shoeDrops) {
          if (Math.random() < sd.chance + luckyBonus * sd.chance) {
            inventoryStore.addShoe(sd.shoeId)
            const shoeDef = getShoeById(sd.shoeId)
            msg += ` Bir çizme düştü: ${shoeDef?.name ?? sd.shoeId}!`
          }
        }
      }
    }

    if (combatIsBoss.value) {
      if (isInSkullCavern.value) {
        const scFloor = skullCavernFloor.value
        const moneyReward = 200 + scFloor * 20
        playerStore.earnMoney(moneyReward)
        msg += ` ${moneyReward} akçe kazandın!`
        const bonusOreCount = 3 + Math.floor(scFloor / 25)
        const orePool = ['iridium_ore', 'void_ore', 'shadow_ore']
        for (let i = 0; i < bonusOreCount; i++) {
          const oreId = orePool[Math.floor(Math.random() * orePool.length)]!
          inventoryStore.addItem(oreId)
          sessionLoot.value.push({ itemId: oreId, quantity: 1 })
        }
        msg += ` ${bonusOreCount} ender cevher elde ettin!`
      } else {
        const bossId = monster.id
        const isFirstKill = !defeatedBosses.value.includes(bossId)

        if (isFirstKill) {
          defeatedBosses.value.push(bossId)
          const weaponId = BOSS_DROP_WEAPONS[currentFloor.value]
          if (weaponId) {
            const bossWeaponDef = getWeaponById(weaponId)
            const fixedEnchant = bossWeaponDef?.fixedEnchantment ?? null
            inventoryStore.addWeapon(weaponId, fixedEnchant)
            const displayName = getWeaponDisplayName(weaponId, fixedEnchant)
            msg += ` BOSS’u ilk kez yendin! Efsane silah kazandın: ${displayName}!`
          }
        }

        const bossRingId = BOSS_DROP_RINGS[currentFloor.value]
        if (bossRingId && !inventoryStore.hasRing(bossRingId)) {
          inventoryStore.addRing(bossRingId)
          const bossRingDef = getRingById(bossRingId)
          msg += ` Bir yüzük kazandın: ${bossRingDef?.name ?? bossRingId}!`
        }
        const bossHatId = BOSS_DROP_HATS[currentFloor.value]
        if (bossHatId && !inventoryStore.hasHat(bossHatId)) {
          inventoryStore.addHat(bossHatId)
          const bossHatDef = getHatById(bossHatId)
          msg += ` Bir başlık kazandın: ${bossHatDef?.name ?? bossHatId}!`
        }
        const bossShoeId = BOSS_DROP_SHOES[currentFloor.value]
        if (bossShoeId && !inventoryStore.hasShoe(bossShoeId)) {
          inventoryStore.addShoe(bossShoeId)
          const bossShoeDef = getShoeById(bossShoeId)
          msg += ` Bir çizme kazandın: ${bossShoeDef?.name ?? bossShoeId}!`
        }

        const moneyReward = BOSS_MONEY_REWARDS[currentFloor.value] ?? 0
        if (moneyReward > 0) {
          playerStore.earnMoney(moneyReward)
          msg += ` ${moneyReward} akçe kazandın!`
        }
        const oreRewards = BOSS_ORE_REWARDS[currentFloor.value]
        if (oreRewards) {
          for (const ore of oreRewards) {
            inventoryStore.addItem(ore.itemId, ore.quantity)
            sessionLoot.value.push(ore)
          }
          msg += ` ${getRewardNames(oreRewards)} elde ettin!`
        }
      }
    }

    msg += ` ${monster.name} yere serildi! (+${monster.expReward} tecrübe)`
    if (drops.length > 0) msg += ' Bir şeyler de bıraktı.'
    combatLog.value.push(msg)

    if (_combatTileIndex.value >= 0) {
      const tile = floorGrid.value[_combatTileIndex.value]
      if (tile) tile.state = 'defeated'
      _combatTileIndex.value = -1
    }
    monstersDefeatedCount.value++
    useAchievementStore().recordMonsterKill()
    if (combatMonster.value) {
      useGuildStore().recordKill(combatMonster.value.id)
    }

    if (monstersDefeatedCount.value >= totalMonstersOnFloor.value && totalMonstersOnFloor.value > 0) {
      stairsUsable.value = true
      if (floor?.specialType === 'infested') {
        const activeFloorNum = getActiveFloorNum()
        const clearRewards = getInfestedClearRewards(activeFloorNum)
        for (const r of clearRewards.items) {
          inventoryStore.addItem(r.itemId, r.quantity)
          sessionLoot.value.push(r)
        }
        playerStore.earnMoney(clearRewards.money)
        msg += ` Musallat katı temizlendi! ${getRewardNames(clearRewards.items)} ve ${clearRewards.money} akçe kazandın!`
      }
    } else if (floor?.specialType === 'infested') {
      const remaining = totalMonstersOnFloor.value - monstersDefeatedCount.value
      msg += ` Daha ${remaining} yaratık kaldı!`
    }

    combatIsBoss.value = false
    return { message: msg, combatOver: true, won: true }
  }

  /** Yenilgi işlemleri */
  const handleDefeat = (): { message: string; combatOver: boolean; won: boolean } => {
    inCombat.value = false
    combatIsBoss.value = false
    const wasInSkullCavern = isInSkullCavern.value
    isExploring.value = false
    slayerCharmActive.value = false

    floorGrid.value = []
    _combatTileIndex.value = -1

    const lostCount = Math.ceil(sessionLoot.value.length / 2)
    for (let i = 0; i < lostCount; i++) {
      const item = sessionLoot.value.pop()
      if (item) inventoryStore.removeItem(item.itemId, item.quantity)
    }

    const droppedItems: string[] = []
    const availableItems = inventoryStore.items.filter(i => i.quantity > 0)
    const dropCount = Math.min(DEFEAT_MAX_ITEM_LOSS, availableItems.length)
    for (let i = 0; i < dropCount; i++) {
      const candidates = inventoryStore.items.filter(i => i.quantity > 0)
      if (candidates.length === 0) break
      const pick = candidates[Math.floor(Math.random() * candidates.length)]!
      droppedItems.push(pick.itemId)
      inventoryStore.removeItem(pick.itemId, 1, pick.quality)
    }

    const moneyLost = Math.min(Math.floor(playerStore.money * DEFEAT_MONEY_PENALTY_RATE), DEFEAT_MONEY_PENALTY_CAP)
    if (moneyLost > 0) playerStore.spendMoney(moneyLost)

    const maxHp = playerStore.getMaxHp()
    playerStore.restoreHealth(Math.floor(maxHp * 0.5))

    if (wasInSkullCavern) {
      isInSkullCavern.value = false
      skullCavernFloor.value = 0
      cachedSkullFloorData.value = null
    }

    const location = wasInSkullCavern ? 'Kuru Kafa Mağarası' : 'maden'
    const parts: string[] = [`${location} içinde takatin tükendi…`]
    parts.push('Ganimetin yarısını yitirdin')
    if (droppedItems.length > 0) parts.push(`, ayrıca heybenden ${droppedItems.length} parça eşya düştü`)
    if (moneyLost > 0) parts.push(`, üstüne ${moneyLost} akçe de eksildi`)
    parts.push('. Seni girişe geri getirdiler.')
    const msg = parts.join('')
    combatLog.value.push(msg)
    return { message: msg, combatOver: true, won: false }
  }

  // ==================== Kat ilerleyişi ====================

  /** Sonraki kata geç */
  const goNextFloor = (): { success: boolean; message: string } => {
    if (!isExploring.value) return { success: false, message: 'Şu an madende değilsin.' }
    if (!stairsFound.value) {
      return { success: false, message: 'Henüz merdiven bulunmadı; keşfi sürdür.' }
    }
    if (!stairsUsable.value) {
      const floor = getActiveFloorData()
      if (floor?.specialType === 'infested') {
        const remaining = totalMonstersOnFloor.value - monstersDefeatedCount.value
        return { success: false, message: `Daha ${remaining} yaratık ayakta; inemezsin!` }
      }
      if (floor?.specialType === 'boss') {
        return { success: false, message: 'BOSS devrilmeden ilerlenmez!' }
      }
      return { success: false, message: 'Merdiven şimdilik kullanılamaz.' }
    }

    if (isInSkullCavern.value) {
      skullCavernFloor.value++
      cacheSkullFloor(skullCavernFloor.value)
      if (skullCavernFloor.value > skullCavernBestFloor.value) {
        skullCavernBestFloor.value = skullCavernFloor.value
        useAchievementStore().recordSkullCavernFloor(skullCavernFloor.value)
      }
    } else {
      if (currentFloor.value >= MAX_MINE_FLOOR) {
        if (isSkullCavernUnlocked()) {
          isInSkullCavern.value = true
          skullCavernFloor.value = 1
          cacheSkullFloor(1)
          _generateGrid()
          return { success: true, message: 'Madenin en dip yarığından geçip Kuru Kafa Mağarası’nın 1. katına vardın!' }
        }
        return { success: false, message: 'Madenin son dibine ulaştın! (60. kat BOSS’unu yenince Kuru Kafa Mağarası açılır)' }
      }

      currentFloor.value++
      useAchievementStore().recordMineFloor(currentFloor.value)

      const newFloorData = getFloor(currentFloor.value)
      if (newFloorData?.isSafePoint && currentFloor.value > safePointFloor.value) {
        safePointFloor.value = currentFloor.value
      }
    }

    _generateGrid()

    const activeFloorNum = getActiveFloorNum()
    const newFloor = getActiveFloorData()
    const locationName = isInSkullCavern.value ? 'Kuru Kafa Mağarası ' : ''
    const specialLabels: Record<string, string> = {
      mushroom: 'Mantar Oyuğu',
      treasure: 'Hazine Katı',
      infested: 'Musallat Kat',
      dark: 'Karanlık Irmak Katı',
      boss: 'BOSS Katı'
    }
    const specialLabel = newFloor?.specialType ? (specialLabels[newFloor.specialType] ?? '') : ''
    let msg = `${locationName}${activeFloorNum}. kata indin.${newFloor?.isSafePoint ? ' (Emniyet durağı!)' : ''}`
    if (specialLabel) msg += ` [${specialLabel}]`
    return { success: true, message: msg }
  }

  /** Madenden çık */
  const leaveMine = (): string => {
    if (!isInSkullCavern.value) {
      const floor = getActiveFloorData()
      if (floor?.isSafePoint && currentFloor.value > safePointFloor.value) {
        safePointFloor.value = currentFloor.value
      }
    }
    isExploring.value = false
    combatIsBoss.value = false
    floorGrid.value = []
    _combatTileIndex.value = -1
    slayerCharmActive.value = false
    if (isInSkullCavern.value) {
      isInSkullCavern.value = false
      cachedSkullFloorData.value = null
      return 'Kuru Kafa Mağarası’ndan çıktın.'
    }
    return 'Madenden çıktın.'
  }

  // ==================== Eşya kullanımı ====================

  /** Cenkte/keşifte eşya kullan */
  const useCombatItem = (itemId: string): { success: boolean; message: string } => {
    if (!inCombat.value && !isExploring.value) return { success: false, message: 'Şu an madende değilsin.' }

    if (itemId === 'guild_badge') {
      if (!inventoryStore.removeItem('guild_badge')) return { success: false, message: 'Lonca nişanın yok.' }
      guildBadgeBonusAttack.value += 3
      const msg = 'Lonca nişanını kullandın, saldırı gücün kalıcı olarak +3 arttı!'
      if (inCombat.value) combatLog.value.push(msg)
      return { success: true, message: msg }
    }

    if (itemId === 'life_talisman') {
      if (!inventoryStore.removeItem('life_talisman')) return { success: false, message: 'Can muskan yok.' }
      guildBonusMaxHp.value += 15
      const msg = 'Can muskası kullandın, azami canın kalıcı olarak +15 arttı!'
      if (inCombat.value) combatLog.value.push(msg)
      return { success: true, message: msg }
    }

    if (itemId === 'lucky_coin') {
      if (!inventoryStore.removeItem('lucky_coin')) return { success: false, message: 'Uğur akçen yok.' }
      guildBonusDropRate.value += 0.05
      const msg = 'Uğur akçesini kullandın, yaratık ganimeti düşme oranı kalıcı olarak +%5 arttı!'
      if (inCombat.value) combatLog.value.push(msg)
      return { success: true, message: msg }
    }

    if (itemId === 'defense_charm') {
      if (!inventoryStore.removeItem('defense_charm')) return { success: false, message: 'Koruyucu muskan yok.' }
      guildBonusDefense.value += 0.03
      const msg = 'Koruyucu muska kullandın, savunman kalıcı olarak +%3 arttı!'
      if (inCombat.value) combatLog.value.push(msg)
      return { success: true, message: msg }
    }

    if (itemId === 'slayer_charm') {
      if (slayerCharmActive.value) return { success: false, message: 'Avcı tılsımının etkisi zaten sürüyor.' }
      if (!inventoryStore.removeItem('slayer_charm')) return { success: false, message: 'Avcı tılsımın yok.' }
      slayerCharmActive.value = true
      const msg = 'Avcı tılsımı kullandın, bu keşifte yaratık ganimeti düşme oranı +%20 arttı!'
      if (inCombat.value) combatLog.value.push(msg)
      return { success: true, message: msg }
    }

    const def = getItemById(itemId)
    if (!def) return { success: false, message: 'Bilinmeyen eşya.' }

    if (itemId.startsWith('food_')) {
      const cookingStore = useCookingStore()
      const hpFull = playerStore.hp >= playerStore.getMaxHp()
      const staminaFull = playerStore.stamina >= playerStore.maxStamina
      if (hpFull && staminaFull) {
        return { success: false, message: 'Canın da takatin de tam.' }
      }
      const qualityOrder: Quality[] = ['normal', 'fine', 'excellent', 'supreme']
      const foodQuality = qualityOrder.find(q => inventoryStore.getItemCount(itemId, q) > 0) ?? 'normal'
      const result = cookingStore.eat(itemId.slice(5), foodQuality)
      if (result.success && inCombat.value) combatLog.value.push(result.message)
      return result
    }

    const hpFull = playerStore.hp >= playerStore.getMaxHp()
    const staminaFull = playerStore.stamina >= playerStore.maxStamina
    const hasHpRestore = def.healthRestore && def.healthRestore > 0
    const hasStaminaRestore = def.staminaRestore && def.staminaRestore > 0

    if (hasHpRestore && !hasStaminaRestore && hpFull) {
      return { success: false, message: 'Canın zaten dolu.' }
    }
    if (hasStaminaRestore && !hasHpRestore && staminaFull) {
      return { success: false, message: 'Takatin zaten dolu.' }
    }
    if (hpFull && staminaFull && (hasHpRestore || hasStaminaRestore)) {
      return { success: false, message: 'Canın da takatin de tam.' }
    }

    if (!inventoryStore.removeItem(itemId)) return { success: false, message: `${def.name} sende yok.` }

    const alchemistBonus = skillStore.getSkill('foraging').perk10 === 'alchemist' ? 1.5 : 1.0
    const parts: string[] = []
    if (hasHpRestore) {
      const restore = def.healthRestore! >= 999 ? playerStore.getMaxHp() : Math.floor(def.healthRestore! * alchemistBonus)
      playerStore.restoreHealth(restore)
      parts.push(`${def.healthRestore! >= 999 ? 'tüm' : restore} HP geri kazandın`)
    }
    if (hasStaminaRestore) {
      const restore = Math.floor(def.staminaRestore! * alchemistBonus)
      playerStore.restoreStamina(restore)
      parts.push(`${restore} takat kazandın`)
    }

    const msg = `${def.name} kullandın, ${parts.join(' ve ')}!`
    if (inCombat.value) combatLog.value.push(msg)
    return { success: true, message: msg }
  }

  /** Keşifte yaratık yemi kullan */
  const useMonsterLure = (): { success: boolean; message: string } => {
    if (!isExploring.value) return { success: false, message: 'Şu an madende değilsin.' }
    if (inCombat.value) return { success: false, message: 'Cenk sürerken yaratık yemi kullanılamaz.' }
    if (!inventoryStore.removeItem('monster_lure')) return { success: false, message: 'Yaratık yemin yok.' }

    const floor = getActiveFloorData()
    if (!floor) return { success: true, message: 'Yemi kullandın ama bu katta bir tesiri olmadı.' }

    const existingMonsters = floorGrid.value.filter(t => (t.type === 'monster' || t.type === 'boss') && t.state !== 'defeated').length
    const hiddenEmpty = floorGrid.value.filter(t => t.state === 'hidden' && t.type === 'empty')
    const monstersToAdd = Math.min(existingMonsters, hiddenEmpty.length)

    if (monstersToAdd === 0) {
      return { success: true, message: 'Yemi kullandın ama yeni yaratıklar için yer yoktu.' }
    }

    const shuffled = [...hiddenEmpty].sort(() => Math.random() - 0.5)
    const monsterPool = floor.monsters
    for (let i = 0; i < monstersToAdd; i++) {
      const tile = shuffled[i]!
      const monster = monsterPool.length > 0 ? { ...monsterPool[Math.floor(Math.random() * monsterPool.length)]! } : undefined
      if (monster) {
        tile.type = 'monster'
        tile.data = { monster }
      }
    }

    totalMonstersOnFloor.value += monstersToAdd
    return { success: true, message: `Yaratık yemini kullandın! Bu katta ${monstersToAdd} yaratık daha belirdi.` }
  }

  // ==================== Kaydet / Yükle ====================

  const serialize = () => {
    return {
      currentFloor: currentFloor.value,
      safePointFloor: safePointFloor.value,
      defeatedBosses: defeatedBosses.value,
      isInSkullCavern: isInSkullCavern.value,
      skullCavernFloor: skullCavernFloor.value,
      skullCavernBestFloor: skullCavernBestFloor.value,
      guildBadgeBonusAttack: guildBadgeBonusAttack.value,
      guildBonusMaxHp: guildBonusMaxHp.value,
      guildBonusDropRate: guildBonusDropRate.value,
      guildBonusDefense: guildBonusDefense.value
    }
  }

  const deserialize = (data: ReturnType<typeof serialize>) => {
    defeatedBosses.value = ((data as Record<string, unknown>).defeatedBosses as string[]) ?? []

    const rawSafePoint = ((data as Record<string, unknown>).safePointFloor as number) ?? 0
    const hasSkullCavern = 'isInSkullCavern' in data
    const isOldSave = rawSafePoint <= 30 && !hasSkullCavern

    if (isOldSave) {
      safePointFloor.value = rawSafePoint * 2
      currentFloor.value = safePointFloor.value > 0 ? safePointFloor.value + 1 : 1
    } else {
      safePointFloor.value = rawSafePoint
      currentFloor.value = data.currentFloor ?? 1
    }

    isInSkullCavern.value = ((data as Record<string, unknown>).isInSkullCavern as boolean) ?? false
    skullCavernFloor.value = ((data as Record<string, unknown>).skullCavernFloor as number) ?? 0
    skullCavernBestFloor.value = ((data as Record<string, unknown>).skullCavernBestFloor as number) ?? 0

    isExploring.value = false
    floorGrid.value = []

    guildBadgeBonusAttack.value = ((data as Record<string, unknown>).guildBadgeBonusAttack as number) ?? 0
    guildBonusMaxHp.value = ((data as Record<string, unknown>).guildBonusMaxHp as number) ?? 0
    guildBonusDropRate.value = ((data as Record<string, unknown>).guildBonusDropRate as number) ?? 0
    guildBonusDefense.value = ((data as Record<string, unknown>).guildBonusDefense as number) ?? 0
  }

  return {
    currentFloor,
    safePointFloor,
    isExploring,
    isInSkullCavern,
    skullCavernFloor,
    skullCavernBestFloor,
    inCombat,
    combatMonster,
    combatMonsterHp,
    combatRound,
    combatLog,
    combatIsBoss,
    defeatedBosses,
    floorGrid,
    entryIndex,
    stairsFound,
    stairsUsable,
    totalMonstersOnFloor,
    monstersDefeatedCount,
    slayerCharmActive,
    guildBadgeBonusAttack,
    guildBonusMaxHp,
    guildBonusDropRate,
    guildBonusDefense,
    isSkullCavernUnlocked,
    getActiveFloorData,
    getUnlockedSafePoints,
    canRevealTile,
    engageRevealedMonster,
    revealTile,
    useBombOnGrid,
    enterMine,
    enterSkullCavern,
    combatAction,
    useCombatItem,
    useMonsterLure,
    goNextFloor,
    leaveMine,
    serialize,
    deserialize
  }
})
