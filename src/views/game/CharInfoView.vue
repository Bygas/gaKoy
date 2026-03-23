<template>
  <div>
    <!-- Başlık -->
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center space-x-1.5 text-sm text-accent">
        <User :size="14" />
        <span>Kişi Bilgisi</span>
      </div>
      <span class="text-xs text-muted">Yıl {{ gameStore.year }} · {{ SEASON_NAMES[gameStore.season] }}</span>
    </div>

    <!-- Kimlik + Nitelikler -->
    <div class="border border-accent/20 rounded-xs p-2 mb-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-accent">{{ playerStore.playerName }}</span>
        <span class="text-xs text-muted">{{ genderLabel }}</span>
      </div>

      <div class="flex flex-col space-y-1.5">
        <!-- Güç -->
        <div class="flex items-center space-x-2">
          <span class="text-xs text-muted shrink-0">Güç</span>
          <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
            <div
              class="h-full rounded-xs transition-all"
              :class="playerStore.staminaPercent > 35 ? 'bg-success' : 'bg-danger'"
              :style="{ width: playerStore.staminaPercent + '%' }"
            />
          </div>
          <span class="text-xs whitespace-nowrap">{{ playerStore.stamina }}/{{ playerStore.maxStamina }}</span>
        </div>
        <!-- Can -->
        <div class="flex items-center space-x-2">
          <span class="text-xs text-muted shrink-0">Can</span>
          <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
            <div
              class="h-full rounded-xs transition-all"
              :class="playerStore.getHpPercent() > 25 ? 'bg-success' : 'bg-danger'"
              :style="{ width: playerStore.getHpPercent() + '%' }"
            />
          </div>
          <span class="text-xs whitespace-nowrap">{{ playerStore.hp }}/{{ playerStore.getMaxHp() }}</span>
        </div>
        <!-- Akçe -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted">Akçe</span>
          <span class="text-xs text-accent">{{ playerStore.money }} akçe</span>
        </div>
      </div>
    </div>

    <!-- Donanım yuvaları -->
    <div class="border border-accent/20 rounded-xs p-2 mb-3">
      <p class="text-xs text-muted mb-1.5">Kuşanım</p>
      <div class="grid grid-cols-3 gap-1 mb-1">
        <div
          class="border border-accent/10 rounded-xs px-2 py-1 text-center cursor-pointer hover:bg-accent/5"
          @click="activeSlot = 'weapon'"
        >
          <p class="text-[10px] text-muted">Silah</p>
          <p class="text-xs text-accent truncate">{{ equippedWeaponName }}</p>
        </div>
        <div
          class="border border-accent/10 rounded-xs px-2 py-1 text-center cursor-pointer hover:bg-accent/5"
          @click="activeSlot = 'ring1'"
        >
          <p class="text-[10px] text-muted">Yüzük 1</p>
          <p class="text-xs truncate" :class="equippedRing1 ? 'text-accent' : 'text-muted/40'">
            {{ equippedRing1?.name ?? 'Boş' }}
          </p>
        </div>
        <div
          class="border border-accent/10 rounded-xs px-2 py-1 text-center cursor-pointer hover:bg-accent/5"
          @click="activeSlot = 'ring2'"
        >
          <p class="text-[10px] text-muted">Yüzük 2</p>
          <p class="text-xs truncate" :class="equippedRing2 ? 'text-accent' : 'text-muted/40'">
            {{ equippedRing2?.name ?? 'Boş' }}
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-1">
        <div class="border border-accent/10 rounded-xs px-2 py-1 text-center cursor-pointer hover:bg-accent/5" @click="activeSlot = 'hat'">
          <p class="text-[10px] text-muted">Başlık</p>
          <p class="text-xs truncate" :class="equippedHatName ? 'text-accent' : 'text-muted/40'">
            {{ equippedHatName ?? 'Boş' }}
          </p>
        </div>
        <div class="border border-accent/10 rounded-xs px-2 py-1 text-center cursor-pointer hover:bg-accent/5" @click="activeSlot = 'shoe'">
          <p class="text-[10px] text-muted">Ayakkabı</p>
          <p class="text-xs truncate" :class="equippedShoeName ? 'text-accent' : 'text-muted/40'">
            {{ equippedShoeName ?? 'Boş' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Donanım seçme penceresi -->
    <Transition name="panel-fade">
      <div v-if="activeSlot" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="activeSlot = null">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeSlot = null">
            <X :size="14" />
          </button>

          <!-- Silah penceresi -->
          <template v-if="activeSlot === 'weapon'">
            <p class="text-sm text-accent mb-2">Silah seç</p>
            <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
              <div
                v-for="(weapon, index) in inventoryStore.ownedWeapons"
                :key="index"
                class="flex items-center justify-between border rounded-xs px-2 py-1.5 cursor-pointer hover:bg-accent/5 mr-1"
                :class="index === inventoryStore.equippedWeaponIndex ? 'border-accent/30' : 'border-accent/10'"
                @click="handleEquipWeapon(index)"
              >
                <div class="min-w-0">
                  <span class="text-xs" :class="index === inventoryStore.equippedWeaponIndex ? 'text-accent' : ''">
                    {{ getWeaponDisplayName(weapon.defId, weapon.enchantmentId) }}
                  </span>
                  <p class="text-[10px] text-muted truncate">
                    Saldırı {{ getWeaponStats(weapon).attack }} · Kritik %{{ Math.round(getWeaponStats(weapon).critRate * 100) }}
                    <template v-if="weapon.enchantmentId">· {{ getEnchantName(weapon.enchantmentId) }}</template>
                  </p>
                </div>
                <span v-if="index === inventoryStore.equippedWeaponIndex" class="text-[10px] text-accent shrink-0 ml-1">Kuşanılı</span>
              </div>
            </div>
          </template>

          <!-- Yüzük penceresi -->
          <template v-else-if="activeSlot === 'ring1' || activeSlot === 'ring2'">
            <p class="text-sm text-accent mb-2"> {{ activeSlot === 'ring1' ? 'Yüzük 1' : 'Yüzük 2' }} seç</p>
            <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
              <!-- Çıkar düğmesi -->
              <div
                v-if="(activeSlot === 'ring1' ? inventoryStore.equippedRingSlot1 : inventoryStore.equippedRingSlot2) >= 0"
                class="flex items-center border border-danger/20 rounded-xs px-2 py-1.5 cursor-pointer hover:bg-danger/5 mr-1"
                @click="handleUnequipRingFromPopup"
              >
                <span class="text-xs text-danger">Geçerli yüzüğü çıkar</span>
              </div>
              <!-- Yüzük listesi -->
              <template v-if="inventoryStore.ownedRings.length > 0">
                <div
                  v-for="(ring, idx) in ownedRingList"
                  :key="idx"
                  class="flex items-center justify-between border rounded-xs px-2 py-1.5 cursor-pointer hover:bg-accent/5 mr-1"
                  :class="isRingInCurrentSlot(idx) ? 'border-accent/30' : 'border-accent/10'"
                  @click="handleEquipRingFromPopup(idx)"
                >
                  <div class="min-w-0">
                    <span class="text-xs" :class="isRingInCurrentSlot(idx) ? 'text-accent' : ''">{{ ring.name }}</span>
                    <p class="text-[10px] text-muted truncate">{{ ring.effectText }}</p>
                  </div>
                  <span v-if="isRingInCurrentSlot(idx)" class="text-[10px] text-accent shrink-0 ml-1">Kuşanılı</span>
                  <span v-else-if="isRingInOtherSlot(idx)" class="text-[10px] text-muted shrink-0 ml-1">
                    {{ activeSlot === 'ring1' ? 'Yuva 2' : 'Yuva 1' }} içinde
                  </span>
                </div>
              </template>
              <p v-else class="text-xs text-muted/40 text-center py-2">Yüzük yok</p>
            </div>
          </template>

          <!-- Başlık penceresi -->
          <template v-else-if="activeSlot === 'hat'">
            <p class="text-sm text-accent mb-2">Başlık seç</p>
            <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
              <div
                v-if="inventoryStore.equippedHatIndex >= 0"
                class="flex items-center border border-danger/20 rounded-xs px-2 py-1.5 cursor-pointer hover:bg-danger/5 mr-1"
                @click="handleUnequipHatFromPopup"
              >
                <span class="text-xs text-danger">Geçerli başlığı çıkar</span>
              </div>
              <template v-if="inventoryStore.ownedHats.length > 0">
                <div
                  v-for="hat in ownedHatList"
                  :key="hat.index"
                  class="flex items-center justify-between border rounded-xs px-2 py-1.5 cursor-pointer hover:bg-accent/5 mr-1"
                  :class="hat.index === inventoryStore.equippedHatIndex ? 'border-accent/30' : 'border-accent/10'"
                  @click="handleEquipHatFromPopup(hat.index)"
                >
                  <div class="min-w-0">
                    <span class="text-xs" :class="hat.index === inventoryStore.equippedHatIndex ? 'text-accent' : ''">{{ hat.name }}</span>
                    <p class="text-[10px] text-muted truncate">{{ hat.effectText }}</p>
                  </div>
                  <span v-if="hat.index === inventoryStore.equippedHatIndex" class="text-[10px] text-accent shrink-0 ml-1">Kuşanılı</span>
                </div>
              </template>
              <p v-else class="text-xs text-muted/40 text-center py-2">Başlık yok</p>
            </div>
          </template>

          <!-- Ayakkabı penceresi -->
          <template v-else-if="activeSlot === 'shoe'">
            <p class="text-sm text-accent mb-2">Ayakkabı seç</p>
            <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
              <div
                v-if="inventoryStore.equippedShoeIndex >= 0"
                class="flex items-center border border-danger/20 rounded-xs px-2 py-1.5 cursor-pointer hover:bg-danger/5 mr-1"
                @click="handleUnequipShoeFromPopup"
              >
                <span class="text-xs text-danger">Geçerli ayakkabıyı çıkar</span>
              </div>
              <template v-if="inventoryStore.ownedShoes.length > 0">
                <div
                  v-for="shoe in ownedShoeList"
                  :key="shoe.index"
                  class="flex items-center justify-between border rounded-xs px-2 py-1.5 cursor-pointer hover:bg-accent/5 mr-1"
                  :class="shoe.index === inventoryStore.equippedShoeIndex ? 'border-accent/30' : 'border-accent/10'"
                  @click="handleEquipShoeFromPopup(shoe.index)"
                >
                  <div class="min-w-0">
                    <span class="text-xs" :class="shoe.index === inventoryStore.equippedShoeIndex ? 'text-accent' : ''">
                      {{ shoe.name }}
                    </span>
                    <p class="text-[10px] text-muted truncate">{{ shoe.effectText }}</p>
                  </div>
                  <span v-if="shoe.index === inventoryStore.equippedShoeIndex" class="text-[10px] text-accent shrink-0 ml-1">Kuşanılı</span>
                </div>
              </template>
              <p v-else class="text-xs text-muted/40 text-center py-2">Ayakkabı yok</p>
            </div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Aletler -->
    <div class="border border-accent/20 rounded-xs p-2 mb-3">
      <div class="flex items-center justify-between mb-1.5">
        <p class="text-xs text-muted">Aletler</p>
        <button class="text-xs text-accent hover:underline" @click="goToUpgrade">Yüceltmeye git</button>
      </div>
      <div class="flex flex-col space-y-1">
        <div
          v-for="tool in inventoryStore.tools"
          :key="tool.type"
          class="flex items-center justify-between border border-accent/10 rounded-xs px-2 py-1"
        >
          <div>
            <span class="text-xs">{{ TOOL_NAMES[tool.type] }}</span>
            <span class="text-xs text-muted ml-1">{{ TIER_NAMES[tool.tier] }}</span>
          </div>
          <span class="text-[10px] text-muted">Güç -%{{ Math.round((1 - inventoryStore.getToolStaminaMultiplier(tool.type)) * 100) }}</span>
        </div>
      </div>
    </div>

    <!-- Hüner özeti -->
    <div class="border border-accent/20 rounded-xs p-2 mb-3">
      <div class="flex items-center justify-between mb-1.5">
        <p class="text-xs text-muted">Hünerler</p>
        <button class="text-xs text-accent hover:underline" @click="goToSkills">Ayrıntıyı gör</button>
      </div>
      <div class="flex flex-col space-y-0.5">
        <div v-for="skill in skillStore.skills" :key="skill.type" class="flex items-center justify-between">
          <span class="text-xs text-muted">{{ SKILL_NAMES[skill.type] }}</span>
          <div class="flex items-center space-x-1.5">
            <span class="text-xs text-accent">Sv.{{ skill.level }}</span>
            <span v-if="skill.perk5" class="text-[10px] text-success">{{ PERK_NAMES[skill.perk5] }}</span>
            <span v-if="skill.perk10" class="text-[10px] text-success">{{ PERK_NAMES[skill.perk10] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edilgin katkılar -->
    <div v-if="unlockedWalletItems.length > 0" class="border border-accent/20 rounded-xs p-2 mb-3">
      <p class="text-xs text-muted mb-1.5">Edilgin katkılar</p>
      <div class="flex flex-col space-y-0.5">
        <div v-for="item in unlockedWalletItems" :key="item.id" class="flex items-center justify-between">
          <span class="text-xs text-accent">{{ item.name }}</span>
          <span class="text-xs text-muted">{{ item.description }}</span>
        </div>
      </div>
    </div>

    <!-- Aile -->
    <div v-if="spouseInfo" class="border border-accent/20 rounded-xs p-2">
      <p class="text-xs text-muted mb-1.5">Aile</p>
      <div class="flex flex-col space-y-0.5">
        <div class="flex items-center justify-between">
          <span class="text-xs text-muted">Eş</span>
          <span class="text-xs text-accent">{{ spouseInfo.name }}</span>
        </div>
        <div v-for="child in npcStore.children" :key="child.id" class="flex items-center justify-between">
          <span class="text-xs text-muted">{{ child.name }}</span>
          <span class="text-xs">{{ CHILD_STAGE_NAMES[child.stage] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { User, X } from 'lucide-vue-next'
  import { useGameStore, SEASON_NAMES } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { useNpcStore } from '@/stores/useNpcStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { useSkillStore } from '@/stores/useSkillStore'
  import { useWalletStore } from '@/stores/useWalletStore'
  import { TOOL_NAMES, TIER_NAMES, getNpcById } from '@/data'
  import { getWeaponById, getEnchantmentById, getWeaponDisplayName } from '@/data/weapons'
  import { getRingById } from '@/data/rings'
  import { getHatById } from '@/data/hats'
  import { getShoeById } from '@/data/shoes'
  import type { EquipmentEffectType } from '@/types'
  import { WALLET_ITEMS } from '@/data/wallet'
  import { navigateToPanel } from '@/composables/useNavigation'
  import type { SkillType, SkillPerk5, SkillPerk10, ChildStage, OwnedWeapon } from '@/types'
  import { addLog } from '@/composables/useGameLog'

  const playerStore = usePlayerStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const walletStore = useWalletStore()
  const npcStore = useNpcStore()
  const gameStore = useGameStore()

  // === Kimlik ===
  const genderLabel = computed(() => (playerStore.gender === 'male' ? 'Erkek' : 'Kadın'))

  // === Donanım yuvaları ===

  const activeSlot = ref<'weapon' | 'ring1' | 'ring2' | 'hat' | 'shoe' | null>(null)

  // === Silah ===

  const equippedWeaponName = computed(() => {
    const weapon = inventoryStore.ownedWeapons[inventoryStore.equippedWeaponIndex]
    if (!weapon) return 'Yok'
    return getWeaponDisplayName(weapon.defId, weapon.enchantmentId)
  })

  const getWeaponStats = (weapon: OwnedWeapon): { attack: number; critRate: number } => {
    const def = getWeaponById(weapon.defId)
    if (!def) return { attack: 0, critRate: 0 }
    let attack = def.attack
    let critRate = def.critRate
    if (weapon.enchantmentId) {
      const enchant = getEnchantmentById(weapon.enchantmentId)
      if (enchant) {
        attack += enchant.attackBonus
        critRate += enchant.critBonus
      }
    }
    return { attack, critRate }
  }

  const getEnchantName = (enchantmentId: string): string => {
    return getEnchantmentById(enchantmentId)?.name ?? ''
  }

  const handleEquipWeapon = (index: number) => {
    if (inventoryStore.equipWeapon(index)) {
      const weapon = inventoryStore.ownedWeapons[index]!
      const name = getWeaponDisplayName(weapon.defId, weapon.enchantmentId)
      addLog(`${name} kuşanıldı.`)
    }
  }

  // === Yüzük ===

  const RING_EFFECT_SHORT: Record<EquipmentEffectType, string> = {
    attack_bonus: 'Saldırı',
    crit_rate_bonus: 'Kritik',
    defense_bonus: 'Savunma',
    vampiric: 'Can emişi',
    max_hp_bonus: 'Azami can',
    stamina_reduction: 'Güç tasarrufu',
    mining_stamina: 'Kazı gücü tasarrufu',
    farming_stamina: 'Tarla gücü tasarrufu',
    fishing_stamina: 'Olta gücü tasarrufu',
    crop_quality_bonus: 'Mahsul niteliği',
    crop_growth_bonus: 'Büyüme hızı',
    fish_quality_bonus: 'Balık niteliği',
    fishing_calm: 'Olta dinginliği',
    sell_price_bonus: 'Satış değeri',
    shop_discount: 'Dükkân indirimi',
    gift_friendship: 'Gönül artışı',
    monster_drop_bonus: 'Düşüm oranı',
    exp_bonus: 'Deneyim',
    treasure_find: 'Define şansı',
    ore_bonus: 'Maden artışı',
    luck: 'Uğur',
    travel_speed: 'Yol hızı'
  }

  const formatRingEffects = (defId: string): string => {
    const def = getRingById(defId)
    if (!def) return ''
    return def.effects
      .map(e => {
        const label = RING_EFFECT_SHORT[e.type]
        return e.value > 0 && e.value < 1 ? `${label} %${Math.round(e.value * 100)}` : `${label} +${e.value}`
      })
      .join(' ')
  }

  const getRingInfo = (index: number): { name: string; effectText: string } | null => {
    if (index < 0 || index >= inventoryStore.ownedRings.length) return null
    const ring = inventoryStore.ownedRings[index]!
    const def = getRingById(ring.defId)
    if (!def) return null
    return { name: def.name, effectText: formatRingEffects(ring.defId) }
  }

  const equippedRing1 = computed(() => getRingInfo(inventoryStore.equippedRingSlot1))
  const equippedRing2 = computed(() => getRingInfo(inventoryStore.equippedRingSlot2))

  const ownedRingList = computed(() =>
    inventoryStore.ownedRings.map((ring, index) => ({
      index,
      name: getRingById(ring.defId)?.name ?? ring.defId,
      effectText: formatRingEffects(ring.defId)
    }))
  )

  const handleEquipRingFromPopup = (ringIndex: number) => {
    const slot: 0 | 1 = activeSlot.value === 'ring1' ? 0 : 1
    if (inventoryStore.equipRing(ringIndex, slot)) {
      const def = getRingById(inventoryStore.ownedRings[ringIndex]!.defId)
      addLog(`${def?.name ?? 'Yüzük'} ${slot + 1}. yuvaya takıldı.`)
      activeSlot.value = null
    }
  }

  const handleUnequipRingFromPopup = () => {
    const slot: 0 | 1 = activeSlot.value === 'ring1' ? 0 : 1
    const idx = slot === 0 ? inventoryStore.equippedRingSlot1 : inventoryStore.equippedRingSlot2
    const def = idx >= 0 ? getRingById(inventoryStore.ownedRings[idx]!.defId) : null
    if (inventoryStore.unequipRing(slot)) {
      addLog(`${def?.name ?? 'Yüzük'} çıkarıldı.`)
      activeSlot.value = null
    }
  }

  const isRingInCurrentSlot = (idx: number): boolean => {
    if (activeSlot.value === 'ring1') return inventoryStore.equippedRingSlot1 === idx
    return inventoryStore.equippedRingSlot2 === idx
  }

  const isRingInOtherSlot = (idx: number): boolean => {
    if (activeSlot.value === 'ring1') return inventoryStore.equippedRingSlot2 === idx
    return inventoryStore.equippedRingSlot1 === idx
  }

  // === Başlık ===

  const equippedHatName = computed(() => {
    const hat = inventoryStore.ownedHats[inventoryStore.equippedHatIndex]
    if (!hat) return null
    return getHatById(hat.defId)?.name ?? null
  })

  const formatEquipEffects = (effects: { type: EquipmentEffectType; value: number }[]): string => {
    return effects
      .map(e => {
        const label = RING_EFFECT_SHORT[e.type]
        return e.value > 0 && e.value < 1 ? `${label} %${Math.round(e.value * 100)}` : `${label} +${e.value}`
      })
      .join(' ')
  }

  const ownedHatList = computed(() =>
    inventoryStore.ownedHats.map((hat, index) => {
      const def = getHatById(hat.defId)
      return {
        index,
        name: def?.name ?? hat.defId,
        effectText: def ? formatEquipEffects(def.effects) : ''
      }
    })
  )

  const handleEquipHatFromPopup = (index: number) => {
    if (inventoryStore.equipHat(index)) {
      const def = getHatById(inventoryStore.ownedHats[index]!.defId)
      addLog(`${def?.name ?? 'Başlık'} kuşanıldı.`)
      activeSlot.value = null
    }
  }

  const handleUnequipHatFromPopup = () => {
    const idx = inventoryStore.equippedHatIndex
    const def = idx >= 0 ? getHatById(inventoryStore.ownedHats[idx]!.defId) : null
    if (inventoryStore.unequipHat()) {
      addLog(`${def?.name ?? 'Başlık'} çıkarıldı.`)
      activeSlot.value = null
    }
  }

  // === Ayakkabı ===

  const equippedShoeName = computed(() => {
    const shoe = inventoryStore.ownedShoes[inventoryStore.equippedShoeIndex]
    if (!shoe) return null
    return getShoeById(shoe.defId)?.name ?? null
  })

  const ownedShoeList = computed(() =>
    inventoryStore.ownedShoes.map((shoe, index) => {
      const def = getShoeById(shoe.defId)
      return {
        index,
        name: def?.name ?? shoe.defId,
        effectText: def ? formatEquipEffects(def.effects) : ''
      }
    })
  )

  const handleEquipShoeFromPopup = (index: number) => {
    if (inventoryStore.equipShoe(index)) {
      const def = getShoeById(inventoryStore.ownedShoes[index]!.defId)
      addLog(`${def?.name ?? 'Ayakkabı'} kuşanıldı.`)
      activeSlot.value = null
    }
  }

  const handleUnequipShoeFromPopup = () => {
    const idx = inventoryStore.equippedShoeIndex
    const def = idx >= 0 ? getShoeById(inventoryStore.ownedShoes[idx]!.defId) : null
    if (inventoryStore.unequipShoe()) {
      addLog(`${def?.name ?? 'Ayakkabı'} çıkarıldı.`)
      activeSlot.value = null
    }
  }

  // === Hünerler ===
  const SKILL_NAMES: Record<SkillType, string> = {
    farming: 'Çiftçilik',
    foraging: 'Toplayıcılık',
    fishing: 'Balıkçılık',
    mining: 'Maden',
    combat: 'Cenk'
  }

  const PERK_NAMES: Record<SkillPerk5 | SkillPerk10, string> = {
    harvester: 'Bereketçi',
    rancher: 'Sürü Ustası',
    lumberjack: 'Oduncu',
    herbalist: 'Otacı',
    fisher: 'Balıkçı',
    trapper: 'Tuzakçı',
    miner: 'Madenci',
    geologist: 'Yerbilici',
    fighter: 'Cengâver',
    defender: 'Koruyucu',
    intensive: 'Yoğun Tarım',
    artisan: 'Zanaatkâr',
    coopmaster: 'Ağıl Ustası',
    shepherd: 'Çobanbaşı',
    botanist: 'Bitkibilir',
    alchemist: 'Simyacı',
    forester: 'Ormancı',
    tracker: 'İz Sürücü',
    angler: 'Olta Eri',
    aquaculture: 'Su Yetiştiricisi',
    mariner: 'Deniz Eri',
    luremaster: 'Yem Ustası',
    prospector: 'Maden Arayıcı',
    blacksmith: 'Demirci',
    excavator: 'Kazıcı',
    mineralogist: 'Taşbilir',
    warrior: 'Savaş Eri',
    brute: 'Yaman Güç',
    acrobat: 'Çevik',
    tank: 'Demir Göğüs'
  }

  // === Edilginler ===
  const unlockedWalletItems = computed(() => WALLET_ITEMS.filter(w => walletStore.has(w.id)))

  // === Aile ===
  const spouseInfo = computed(() => {
    const spouseState = npcStore.getSpouse()
    if (!spouseState) return null
    const npcDef = getNpcById(spouseState.npcId)
    return npcDef ? { name: npcDef.name } : null
  })

  const CHILD_STAGE_NAMES: Record<ChildStage, string> = {
    baby: 'Bebek',
    toddler: 'Yürümeye Başlayan',
    child: 'Çocuk',
    teen: 'Delikanlı'
  }

  // === Yöneltme ===
  const goToUpgrade = () => {
    navigateToPanel('upgrade')
  }

  const goToSkills = () => {
    navigateToPanel('skills')
  }
</script>
