<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-accent text-sm">
        <Mountain :size="14" class="inline" />
        {{ miningStore.isInSkullCavern ? 'Kuru Kafa Oyuğu' : 'Bulut Saklı Maden' }}
      </h3>
      <Button class="py-0 px-1" :icon="Map" @click="showMapModal = true" />
    </div>
    <p v-if="tutorialHint" class="text-[10px] text-muted/50 mb-2">{{ tutorialHint }}</p>

    <!-- Kuru Kafa Oyuğu -->
    <div v-if="miningStore.isSkullCavernUnlocked()" class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-1">
        <p class="text-sm text-danger">
          <Skull :size="14" class="inline" />
          Kuru Kafa Oyuğu
        </p>
        <span v-if="miningStore.skullCavernBestFloor > 0" class="text-xs text-muted">En derin: {{ miningStore.skullCavernBestFloor }}. kat</span>
        <span v-else class="text-xs text-muted/40">Henüz girilmedi</span>
      </div>
      <p class="text-xs text-muted">Ucu bucağı yok · Emin durak yok · İridyum cevheri kaynağı · Yaratıklar derinlikle güçlenir</p>
    </div>

    <!-- Kuşanım ve durum -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-accent">
          <Swords :size="14" class="inline" />
          Kuşanım ve Durum
        </p>
      </div>
      <div class="flex flex-col space-y-1">
        <div class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Silah</span>
          <span class="text-xs text-accent">{{ weaponDisplayName }}</span>
        </div>
        <div class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Vuruş gücü</span>
          <span class="text-xs text-accent">{{ weaponAttack }}</span>
        </div>
        <div class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Tür · Ağır vurma</span>
          <span class="text-xs text-muted">{{ weaponTypeName }} · {{ critRateDisplay }}</span>
        </div>
        <div v-if="weaponEnchantName" class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Tılsım</span>
          <span class="text-xs text-success">{{ weaponEnchantName }}</span>
        </div>
        <div class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Can</span>
          <div class="flex items-center space-x-2">
            <div class="w-20 h-1.5 bg-bg rounded-xs border border-accent/10">
              <div
                class="h-full rounded-xs transition-all"
                :class="playerStore.getIsLowHp() ? 'bg-danger' : 'bg-success'"
                :style="{ width: playerStore.getHpPercent() + '%' }"
              />
            </div>
            <span class="text-xs" :class="playerStore.getIsLowHp() ? 'text-danger' : 'text-muted'">
              {{ playerStore.hp }}/{{ playerStore.getMaxHp() }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5">
          <span class="text-xs">Derman</span>
          <span class="text-xs text-muted">{{ playerStore.stamina }}/{{ playerStore.maxStamina }}</span>
        </div>
      </div>
    </div>

    <!-- Madene giriş -->
    <div
      class="border border-accent/20 rounded-xs px-3 py-2 mb-4 flex items-center justify-between cursor-pointer hover:bg-accent/5"
      @click="hasElevator ? (showElevatorModal = true) : handleEnterMine(undefined)"
    >
      <div class="flex items-center space-x-1.5">
        <Pickaxe :size="14" class="text-accent" />
        <span class="text-sm text-accent">İz Sür</span>
      </div>
      <span class="text-xs text-muted">{{ miningStore.safePointFloor + 1 }}. kat</span>
    </div>

    <!-- Yenilmiş ulu yaratıklar -->
    <div v-if="miningStore.defeatedBosses.length > 0" class="border border-accent/20 rounded-xs p-3">
      <p class="text-sm text-accent mb-2">
        <Skull :size="14" class="inline" />
        Yenilmiş Ulu Yaratıklar
      </p>
      <div class="flex flex-col space-y-1">
        <div
          v-for="zone in mineZones.filter(z => z.bossDefeated)"
          :key="zone.id"
          class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
        >
          <span class="text-xs text-success">{{ zone.bossName }}</span>
          <span class="text-xs text-muted">{{ zone.name }}</span>
        </div>
      </div>
    </div>

    <!-- Maden haritası penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showMapModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showMapModal = false"
      >
        <div class="game-panel max-w-xs w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">
              <Map :size="14" class="inline" />
              Maden Haritası
            </p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="showMapModal = false" />
          </div>
          <p class="text-xs text-muted mb-2">Emin durak: {{ miningStore.safePointFloor > 0 ? `${miningStore.safePointFloor}. kat` : 'Giriş' }}</p>
          <div class="flex flex-col space-y-1.5">
            <div
              v-for="zone in mineZones"
              :key="zone.id"
              class="border rounded-xs p-2"
              :class="zone.isCurrentZone ? 'border-accent/40' : 'border-accent/10'"
            >
              <div class="flex justify-between items-center text-xs mb-1">
                <span :class="zone.isCurrentZone ? 'text-accent' : zone.reached ? 'text-text' : 'text-muted/40'">
                  {{ zone.name }}
                  <span class="text-muted ml-1">{{ zone.start }}-{{ zone.end }}. kat</span>
                </span>
                <span v-if="zone.bossDefeated" class="text-success flex items-center">
                  <Check :size="12" class="mr-0.5" />
                  {{ zone.bossName }}
                </span>
                <span v-else-if="zone.reached" class="text-danger/70">{{ zone.bossName }}</span>
                <span v-else class="text-muted/30">
                  <Lock :size="12" class="inline" />
                </span>
              </div>
              <div class="bg-bg rounded-xs h-1.5">
                <div class="h-1.5 rounded-xs transition-all" :class="zone.barColor" :style="{ width: zone.progress + '%' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Asansör penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showElevatorModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showElevatorModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showElevatorModal = false">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-1">
            <Pickaxe :size="14" class="inline" />
            İz Sür
          </p>
          <p class="text-xs text-muted mb-2">Emin durak: {{ miningStore.safePointFloor > 0 ? `${miningStore.safePointFloor}. kat` : 'Giriş' }}</p>

          <!-- Madene giriş -->
          <div
            class="flex items-center justify-between border border-accent/30 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5 mb-2"
            @click="handleEnterMine(undefined)"
          >
            <span class="text-xs text-accent">Madene gir</span>
            <span class="text-xs text-muted">{{ miningStore.safePointFloor + 1 }}. kat</span>
          </div>

          <!-- Asansör katları -->
          <div v-if="elevatorZones.length > 0" class="max-h-48 overflow-y-auto mb-2">
            <div v-for="zone in elevatorZones" :key="zone.name" class="mb-2 last:mb-0">
              <p class="text-[10px] text-muted mb-1">{{ zone.name }}</p>
              <div class="flex flex-wrap space-x-1">
                <Button v-for="sp in zone.floors" :key="sp" class="py-0.5 px-0 min-w-9 justify-center" @click="handleEnterMine(sp)">
                  {{ sp + 1 }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Kuru Kafa Oyuğu -->
          <div
            v-if="miningStore.isSkullCavernUnlocked()"
            class="flex items-center justify-between border border-danger/30 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-danger/5"
            @click="handleEnterSkullCavern"
          >
            <span class="text-xs text-danger">
              <Skull :size="12" class="inline" />
              Kuru Kafa Oyuğu'na gir
            </span>
            <span class="text-xs text-muted">Uçsuz katlar</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Maden keşif penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="miningStore.isExploring && !miningStore.inCombat"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <div class="game-panel max-w-sm w-full">
          <!-- Başlık -->
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">
              {{ activeFloorNum }}. kat
              <span v-if="!miningStore.isInSkullCavern" class="text-muted">{{ zoneName }}</span>
              <span v-if="currentFloorSpecial === 'mushroom'" class="text-success ml-1">Mantar Katı</span>
              <span v-if="currentFloorSpecial === 'treasure'" class="text-accent ml-1">Sandık Katı</span>
              <span v-if="currentFloorSpecial === 'infested'" class="text-danger ml-1">Basık Kat</span>
              <span v-if="currentFloorSpecial === 'dark'" class="text-muted ml-1">Karanlık Kat</span>
              <span v-if="currentFloorSpecial === 'boss'" class="text-danger ml-1">Ulu Yaratık Katı</span>
            </p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="showLeaveConfirm = true" />
          </div>

          <!-- Silah bilgisi -->
          <div class="text-xs text-muted mb-2 border-b border-accent/20 pb-2 space-y-0.5">
            <p>
              <Swords :size="12" class="inline" />
              {{ weaponDisplayName }}（{{ weaponTypeName }} · Vuruş {{ weaponAttack }} · Ağır vurma {{ critRateDisplay }}）
            </p>
            <p v-if="weaponEnchantName" class="text-success">Tılsım: {{ weaponEnchantName }}</p>
          </div>

          <!-- Basık kat uyarısı -->
          <p v-if="currentFloorSpecial === 'infested' && remainingMonsters > 0" class="text-xs text-danger mb-2">
            Basık kat: daha {{ remainingMonsters }} yaratık devrilmeli
          </p>

          <!-- Bomba düzeni -->
          <div v-if="bombModeId" class="text-xs text-accent mb-2 border border-accent/30 rounded-xs px-2 py-1">
            <Zap :size="12" class="inline" />
            Bomba düzeni: patlama göbeği olsun diye açılmış bir gözeğe dokun
            <button class="text-muted ml-2 underline" @click="bombModeId = null">Vazgeç</button>
          </div>

          <!-- 6×6 gözeler -->
          <div class="flex justify-center mb-3">
            <div class="grid grid-cols-6 gap-1" style="max-width: 264px">
              <button
                v-for="tile in miningStore.floorGrid"
                :key="tile.index"
                class="w-10 h-10 rounded-xs flex items-center justify-center text-xs border transition-colors"
                :class="getTileClass(tile)"
                :disabled="!isTileClickable(tile)"
                @click="handleTileClick(tile)"
              >
                {{ getTileIcon(tile) }}
              </button>
            </div>
          </div>

          <!-- İşlemler -->
          <div class="flex flex-col space-y-1 mb-3">
            <div v-for="bombItem in availableBombs" :key="bombItem.id">
              <div
                class="flex items-center justify-between border rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
                :class="bombModeId === bombItem.id ? 'border-accent text-accent' : 'border-accent/20'"
                @click="toggleBombMode(bombItem.id)"
              >
                <span class="text-xs">
                  <Zap :size="12" class="inline" />
                  {{ bombItem.name }}
                </span>
                <span class="text-xs text-muted">&times;{{ bombItem.count }}</span>
              </div>
            </div>
            <div
              v-if="hasMonsterLure"
              class="flex items-center justify-between border border-danger/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-danger/5"
              @click="handleUseMonsterLure"
            >
              <span class="text-xs text-danger">
                <Skull :size="12" class="inline" />
                Yaratık yemi
              </span>
              <span class="text-xs text-muted">&times;{{ inventoryStore.getItemCount('monster_lure') }}</span>
            </div>
            <div
              v-if="availableCombatItems.length > 0"
              class="flex items-center justify-between border border-success/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-success/5"
              @click="showCombatItems = true"
            >
              <span class="text-xs text-success">
                <Backpack :size="12" class="inline" />
                Eşya kullan
              </span>
              <span class="text-xs text-muted">{{ availableCombatItems.length }} tür</span>
            </div>
            <div
              v-if="miningStore.stairsFound"
              class="flex items-center justify-between border border-success/30 rounded-xs px-3 py-1.5"
              :class="miningStore.stairsUsable ? 'cursor-pointer hover:bg-success/5' : 'opacity-50'"
              @click="miningStore.stairsUsable && handleNextFloor()"
            >
              <span class="text-xs text-success">
                <ChevronDown :size="12" class="inline" />
                Aşağı in
              </span>
              <span v-if="!miningStore.stairsUsable" class="text-xs text-muted">Basamak kullanılamaz</span>
            </div>
            <div
              class="flex items-center justify-between border border-danger/30 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-danger/5"
              @click="showLeaveConfirm = true"
            >
              <span class="text-xs text-danger">
                <LogOut :size="12" class="inline" />
                {{ miningStore.isInSkullCavern ? 'Kuru Kafa Oyuğu’ndan çık' : 'Madenden çık' }}
              </span>
            </div>
          </div>

          <!-- Keşif güncesi -->
          <div class="text-xs text-muted space-y-0.5 max-h-24 overflow-y-auto">
            <p v-for="(msg, i) in recentLog" :key="i" :class="{ 'text-text': i === recentLog.length - 1 }">{{ msg }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Dövüş penceresi -->
    <Transition name="panel-fade">
      <div v-if="miningStore.inCombat" class="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4">
        <div class="game-panel max-w-xs w-full">
          <!-- Başlık -->
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm" :class="miningStore.combatIsBoss ? 'text-danger' : 'text-accent'">
              {{ miningStore.combatIsBoss ? 'Ulu Yaratık Dövüşü' : 'Yaratıkla Karşılaştın' }}
            </p>
          </div>

          <!-- Oyuncu vs yaratık -->
          <div class="grid grid-cols-[1fr_auto_1fr] gap-1.5 mb-3 items-center">
            <!-- Oyuncu -->
            <div class="border border-accent/10 rounded-xs p-2 relative" :class="playerAnim">
              <p class="text-xs text-center mb-1.5 truncate">Sen</p>
              <div class="bg-bg rounded-xs h-1.5 mb-1">
                <div
                  class="h-1.5 rounded-xs transition-all"
                  :class="playerStore.getIsLowHp() ? 'bg-danger' : 'bg-success'"
                  :style="{ width: `${playerStore.getHpPercent()}%` }"
                />
              </div>
              <p class="text-[10px]" :class="playerStore.getIsLowHp() ? 'text-danger' : 'text-muted'">
                {{ playerStore.hp }}/{{ playerStore.getMaxHp() }}
              </p>
              <span
                v-if="playerFloat"
                :key="playerFloat.key"
                class="absolute -top-1 right-0 text-danger text-[11px] font-bold anim-float-up pointer-events-none"
              >
                {{ playerFloat.text }}
              </span>
            </div>
            <!-- VS -->
            <span class="text-[10px] text-muted/40">VS</span>
            <!-- Yaratık -->
            <div class="border border-danger/20 rounded-xs p-2 relative" :class="monsterAnim">
              <p class="text-xs text-center text-danger mb-1.5 truncate">
                {{ miningStore.combatMonster?.name }}
                <span v-if="miningStore.combatIsBoss" class="text-[10px]">[Ulu]</span>
              </p>
              <div class="bg-bg rounded-xs h-1.5 mb-1">
                <div
                  class="h-1.5 bg-danger rounded-xs transition-all"
                  :style="{
                    width: `${miningStore.combatMonster ? (miningStore.combatMonsterHp / miningStore.combatMonster.hp) * 100 : 0}%`
                  }"
                />
              </div>
              <p class="text-[10px] text-muted">{{ miningStore.combatMonsterHp }}/{{ miningStore.combatMonster?.hp }}</p>
              <span
                v-if="monsterFloat"
                :key="monsterFloat.key"
                class="absolute -top-1 right-0 text-accent text-[11px] font-bold anim-float-up pointer-events-none"
              >
                {{ monsterFloat.text }}
              </span>
            </div>
          </div>

          <!-- Dövüş işlemleri -->
          <div class="mb-3 space-y-1">
            <!-- Saldırı / Savunma / Kaçış -->
            <div class="grid grid-cols-3 gap-1">
              <div
                class="flex flex-col items-center border border-accent/20 rounded-xs py-1.5"
                :class="combatAnimLock ? 'opacity-50' : 'cursor-pointer hover:bg-accent/5'"
                @click="!combatAnimLock && handleCombat('attack')"
              >
                <span class="text-xs">
                  <Swords :size="12" class="inline" />
                  Vur
                </span>
                <span class="text-[10px] text-muted">{{ weaponAttack }} vuruş</span>
              </div>
              <div
                class="flex flex-col items-center border border-accent/20 rounded-xs py-1.5"
                :class="combatAnimLock ? 'opacity-50' : 'cursor-pointer hover:bg-accent/5'"
                @click="!combatAnimLock && handleCombat('defend')"
              >
                <span class="text-xs">
                  <Shield :size="12" class="inline" />
                  Sakın
                </span>
                <span class="text-[10px] text-muted">Zarar kısılır</span>
              </div>
              <div
                class="flex flex-col items-center border rounded-xs py-1.5"
                :class="
                  miningStore.combatIsBoss || combatAnimLock
                    ? 'border-accent/10 opacity-50'
                    : 'border-danger/20 cursor-pointer hover:bg-danger/5'
                "
                @click="!miningStore.combatIsBoss && !combatAnimLock && handleCombat('flee')"
              >
                <span class="text-xs" :class="miningStore.combatIsBoss ? 'text-muted' : 'text-danger'">
                  <MoveRight :size="12" class="inline" />
                  {{ miningStore.combatIsBoss ? 'Olmaz' : 'Kaç' }}
                </span>
                <span v-if="miningStore.combatIsBoss" class="text-[10px] text-muted/40">Ulu dövüşü</span>
              </div>
            </div>
            <!-- Eşya kullan -->
            <div
              v-if="availableCombatItems.length > 0"
              class="flex items-center justify-between border border-success/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-success/5"
              @click="showCombatItems = true"
            >
              <span class="text-xs text-success">
                <Backpack :size="12" class="inline" />
                Eşya kullan
              </span>
              <span class="text-xs text-muted">{{ availableCombatItems.length }} tür</span>
            </div>
            <!-- Kuşanım düzeni değiştir -->
            <div
              v-if="inventoryStore.equipmentPresets.length > 0"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="showPresetListModal = true"
            >
              <span class="text-xs text-accent">
                <BookMarked :size="12" class="inline" />
                Kuşanım düzeni değiştir
              </span>
              <span v-if="inventoryStore.activePresetId" class="text-[10px] text-muted">
                {{ inventoryStore.equipmentPresets.find(p => p.id === inventoryStore.activePresetId)?.name ?? '' }}
              </span>
            </div>
          </div>

          <!-- Dövüş güncesi -->
          <div class="text-xs space-y-0.5 max-h-28 overflow-y-auto">
            <p
              v-for="(msg, i) in miningStore.combatLog"
              :key="i"
              :class="i < miningStore.combatLog.length - 1 ? 'text-muted' : 'text-text'"
            >
              {{ msg }}
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Eşya kullanma penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showCombatItems"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4"
        @click.self="showCombatItems = false"
      >
        <div class="game-panel max-w-xs w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">
              <Backpack :size="14" class="inline" />
              Eşya Kullan
            </p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="showCombatItems = false" />
          </div>
          <div class="flex flex-col space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="item in availableCombatItems"
              :key="item.itemId"
              class="flex items-center justify-between border border-success/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-success/5"
              @click="handlePendingItem(item.itemId)"
            >
              <div class="flex flex-col">
                <span class="text-xs">{{ item.name }}</span>
                <span class="text-[10px] text-muted">{{ item.desc }}</span>
              </div>
              <span class="text-xs text-muted">&times;{{ item.count }}</span>
            </div>
          </div>
          <p v-if="availableCombatItems.length === 0" class="text-xs text-muted text-center py-2">Kullanılacak eşya yok</p>
        </div>
      </div>
    </Transition>

    <!-- Eşya kullanma onay penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="pendingItem"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4"
        @click.self="pendingItemId = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="pendingItemId = null">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">Eşya Kullan</p>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Eşya</span>
              <span class="text-xs">{{ pendingItem.name }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Etkisi</span>
              <span class="text-xs text-success">{{ pendingItem.desc }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Kalan</span>
              <span class="text-xs">&times;{{ pendingItem.count }}</span>
            </div>
          </div>
          <div class="flex space-x-1.5">
            <Button class="flex-1 justify-center" @click="pendingItemId = null">Vazgeç</Button>
            <Button class="flex-1 justify-center !bg-accent !text-bg" @click="handleConfirmUseItem">Kullan</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Maden bırakma onayı -->
    <Transition name="panel-fade">
      <div
        v-if="showLeaveConfirm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4"
        @click.self="showLeaveConfirm = false"
      >
        <div class="game-panel max-w-xs w-full">
          <p class="text-sm text-accent mb-2">Çıkışı Onayla</p>
          <p class="text-xs text-muted mb-3">Gerçekten {{ miningStore.isInSkullCavern ? 'Kuru Kafa Oyuğu’ndan' : 'madenden' }} çıkmak ister misin? Şimdiki iz saklanmayacak.</p>
          <div class="flex space-x-1.5">
            <Button class="flex-1 justify-center" @click="showLeaveConfirm = false">Sürmeye devam et</Button>
            <Button class="flex-1 justify-center btn-danger" :icon="LogOut" @click="confirmLeave">Çık</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hızlı kuşanım: düzen listesi -->
    <Transition name="panel-fade">
      <div
        v-if="showPresetListModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-70 p-4"
        @click.self="showPresetListModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showPresetListModal = false">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">
            <BookMarked :size="14" class="inline" />
            Kuşanım Düzenleri
          </p>
          <div v-if="inventoryStore.equipmentPresets.length > 0" class="flex flex-col space-y-1.5 max-h-60 overflow-y-auto">
            <div
              v-for="preset in inventoryStore.equipmentPresets"
              :key="preset.id"
              class="border rounded-xs p-2"
              :class="inventoryStore.activePresetId === preset.id ? 'border-accent/40' : 'border-accent/10'"
            >
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs text-accent truncate">{{ preset.name }}</p>
                <span v-if="inventoryStore.activePresetId === preset.id" class="text-[10px] text-success shrink-0 ml-1">Kuşanılı</span>
              </div>
              <div class="grid grid-cols-2 gap-1">
                <Button
                  class="py-0 px-1.5 text-[10px]"
                  :disabled="inventoryStore.activePresetId === preset.id"
                  @click="quickApplyPreset(preset.id)"
                >
                  Giy
                </Button>
                <Button class="py-0 px-1.5 text-[10px]" @click="viewPresetDetail(preset.id)">Bak</Button>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-6">
            <BookMarked :size="24" class="text-muted/30" />
            <p class="text-xs text-muted mt-1">Düzen yok</p>
            <p class="text-[10px] text-muted/60 mt-0.5">Heybe kuşanım bölümüne gidip bir düzen kur</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hızlı kuşanım: düzen ayrıntısı -->
    <Transition name="panel-fade">
      <div
        v-if="showPresetDetailModal && detailPreset"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-80 p-4"
        @click.self="showPresetDetailModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showPresetDetailModal = false">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">{{ detailPreset.name }}</p>
          <div class="flex flex-col space-y-1">
            <div
              class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
              :class="detailPreset.weaponDefId ? 'cursor-pointer hover:bg-accent/5' : ''"
              @click="detailPreset.weaponDefId && viewEquipProperty('weapon', detailPreset.weaponDefId)"
            >
              <span class="text-xs text-muted">Silah</span>
              <span class="text-xs" :class="detailPreset.weaponDefId ? 'text-accent' : 'text-muted/40'">
                {{ detailPreset.weaponDefId ? (getWeaponById(detailPreset.weaponDefId)?.name ?? 'Bilinmez') : 'Yok' }}
              </span>
            </div>
            <div
              class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
              :class="detailPreset.ringSlot1DefId ? 'cursor-pointer hover:bg-accent/5' : ''"
              @click="detailPreset.ringSlot1DefId && viewEquipProperty('ring', detailPreset.ringSlot1DefId)"
            >
              <span class="text-xs text-muted">Yüzük 1</span>
              <span class="text-xs" :class="detailPreset.ringSlot1DefId ? 'text-accent' : 'text-muted/40'">
                {{ detailPreset.ringSlot1DefId ? (getRingById(detailPreset.ringSlot1DefId)?.name ?? 'Bilinmez') : 'Yok' }}
              </span>
            </div>
            <div
              class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
              :class="detailPreset.ringSlot2DefId ? 'cursor-pointer hover:bg-accent/5' : ''"
              @click="detailPreset.ringSlot2DefId && viewEquipProperty('ring', detailPreset.ringSlot2DefId)"
            >
              <span class="text-xs text-muted">Yüzük 2</span>
              <span class="text-xs" :class="detailPreset.ringSlot2DefId ? 'text-accent' : 'text-muted/40'">
                {{ detailPreset.ringSlot2DefId ? (getRingById(detailPreset.ringSlot2DefId)?.name ?? 'Bilinmez') : 'Yok' }}
              </span>
            </div>
            <div
              class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
              :class="detailPreset.hatDefId ? 'cursor-pointer hover:bg-accent/5' : ''"
              @click="detailPreset.hatDefId && viewEquipProperty('hat', detailPreset.hatDefId)"
            >
              <span class="text-xs text-muted">Başlık</span>
              <span class="text-xs" :class="detailPreset.hatDefId ? 'text-accent' : 'text-muted/40'">
                {{ detailPreset.hatDefId ? (getHatById(detailPreset.hatDefId)?.name ?? 'Bilinmez') : 'Yok' }}
              </span>
            </div>
            <div
              class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
              :class="detailPreset.shoeDefId ? 'cursor-pointer hover:bg-accent/5' : ''"
              @click="detailPreset.shoeDefId && viewEquipProperty('shoe', detailPreset.shoeDefId)"
            >
              <span class="text-xs text-muted">Ayaklık</span>
              <span class="text-xs" :class="detailPreset.shoeDefId ? 'text-accent' : 'text-muted/40'">
                {{ detailPreset.shoeDefId ? (getShoeById(detailPreset.shoeDefId)?.name ?? 'Bilinmez') : 'Yok' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hızlı kuşanım: kuşanım özellik penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showEquipPropertyModal && equipPropertyInfo"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-90 p-4"
        @click.self="showEquipPropertyModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showEquipPropertyModal = false">
            <X :size="14" />
          </button>
          <p class="text-[10px] text-muted mb-0.5">{{ equipPropertyInfo.category }}</p>
          <p class="text-sm text-accent mb-1">{{ equipPropertyInfo.name }}</p>
          <p class="text-xs text-muted mb-2">{{ equipPropertyInfo.description }}</p>
          <div v-if="equipPropertyInfo.effects.length > 0" class="flex flex-col space-y-1">
            <div
              v-for="(eff, i) in equipPropertyInfo.effects"
              :key="i"
              class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1"
            >
              <span class="text-xs text-muted">{{ eff.label }}</span>
              <span class="text-xs text-accent">{{ eff.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import {
    Mountain,
    Pickaxe,
    Zap,
    ChevronDown,
    LogOut,
    Swords,
    Shield,
    MoveRight,
    Skull,
    X,
    Map,
    Backpack,
    Lock,
    BookMarked,
    Check
  } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import { useAchievementStore } from '@/stores/useAchievementStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { useMiningStore } from '@/stores/useMiningStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { useSkillStore } from '@/stores/useSkillStore'
  import { useTutorialStore } from '@/stores/useTutorialStore'
  import { ZONE_NAMES, getFloor, BOSS_MONSTERS } from '@/data'
  import { getWeaponById, getEnchantmentById, getWeaponDisplayName, WEAPON_TYPE_NAMES } from '@/data/weapons'
  import { getRingById, getHatById, getShoeById } from '@/data'
  import type { EquipmentEffectType } from '@/types'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import { BOMBS } from '@/data/processing'
  import { getItemById } from '@/data/items'
  import type { CombatAction, MineTile } from '@/types'
  import { sfxMine, sfxAttack, sfxHurt, sfxClick, sfxEncounter, sfxDefend, sfxFlee, sfxVictory } from '@/composables/useAudio'
  import { useAudio } from '@/composables/useAudio'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'

  const miningStore = useMiningStore()
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()
  const inventoryStore = useInventoryStore()
  const skillStore = useSkillStore()
  const achievementStore = useAchievementStore()
  const tutorialStore = useTutorialStore()
  const { startBattleBgm, resumeNormalBgm } = useAudio()

  const tutorialHint = computed(() => {
    if (!tutorialStore.enabled || gameStore.year > 1) return null
    if (achievementStore.stats.highestMineFloor === 0)
      return 'Maden 6x6 gözelerden kurulu. Gözeye dokunup iz sürersin. Cevher varsa kazarsın, yaratık çıkarsa dövüşürsün. Basamak bulursan alta inersin.'
    return null
  })

  const exploreLog = ref<string[]>([])

  const showMapModal = ref(false)
  const showElevatorModal = ref(false)

  /** Bomba düzeni */
  const bombModeId = ref<string | null>(null)

  /** Dövüş eşyaları bölüğü */
  const showCombatItems = ref(false)

  /** Eşya kullanma onayı */
  const pendingItemId = ref<string | null>(null)
  const pendingItem = computed(() => {
    if (!pendingItemId.value) return null
    return availableCombatItems.value.find(i => i.itemId === pendingItemId.value) ?? null
  })

  /** Madenden çıkma onayı */
  const showLeaveConfirm = ref(false)

  // Dövüş devinim durumu
  const combatAnimLock = ref(false)
  const playerAnim = ref('')
  const monsterAnim = ref('')
  const playerFloat = ref<{ text: string; key: number } | null>(null)
  const monsterFloat = ref<{ text: string; key: number } | null>(null)
  let floatCounter = 0

  const triggerAnim = (target: 'player' | 'monster', cls: string, duration: number = 400) => {
    if (target === 'player') {
      playerAnim.value = cls
      setTimeout(() => {
        playerAnim.value = ''
      }, duration)
    } else {
      monsterAnim.value = cls
      setTimeout(() => {
        monsterAnim.value = ''
      }, duration)
    }
  }

  const showDamageFloat = (target: 'player' | 'monster', text: string) => {
    const obj = { text, key: ++floatCounter }
    if (target === 'player') {
      playerFloat.value = obj
      setTimeout(() => {
        playerFloat.value = null
      }, 800)
    } else {
      monsterFloat.value = obj
      setTimeout(() => {
        monsterFloat.value = null
      }, 800)
    }
  }

  const parseDamage = (msg: string): { dealt: number; taken: number; isCrit: boolean } => {
    const dealt = msg.match(/造成(\d+)点伤害/)
    const taken = msg.match(/受到(\d+)点伤害/)
    return {
      dealt: dealt ? parseInt(dealt[1]!) : 0,
      taken: taken ? parseInt(taken[1]!) : 0,
      isCrit: msg.includes('暴击')
    }
  }

  const recentLog = computed(() => exploreLog.value.slice(-8))

  const activeFloorNum = computed(() => {
    return miningStore.isInSkullCavern ? miningStore.skullCavernFloor : miningStore.currentFloor
  })

  const availableBombs = computed(() => {
    return BOMBS.map(b => ({ id: b.id, name: b.name, count: inventoryStore.getItemCount(b.id) })).filter(b => b.count > 0)
  })

  /** Dövüşte kullanılacak eşyalar */
  const availableCombatItems = computed(() => {
    const items: { itemId: string; name: string; desc: string; count: number }[] = []

    // Lonca nişanı
    const badgeCount = inventoryStore.getItemCount('guild_badge')
    if (badgeCount > 0) {
      items.push({ itemId: 'guild_badge', name: 'Lonca Nişanı', desc: 'Vuruş gücü kalıcı +3', count: badgeCount })
    }

    // Can muskası
    const talismanCount = inventoryStore.getItemCount('life_talisman')
    if (talismanCount > 0) {
      items.push({ itemId: 'life_talisman', name: 'Can Muskası', desc: 'Azami can kalıcı +15', count: talismanCount })
    }

    // Uğur akçesi
    const coinCount = inventoryStore.getItemCount('lucky_coin')
    if (coinCount > 0) {
      items.push({ itemId: 'lucky_coin', name: 'Uğur Akçesi', desc: 'Düşürme oranı kalıcı +5%', count: coinCount })
    }

    // Korunç
    const defenseCharmCount = inventoryStore.getItemCount('defense_charm')
    if (defenseCharmCount > 0) {
      items.push({ itemId: 'defense_charm', name: 'Korunç', desc: 'Savunma kalıcı +3%', count: defenseCharmCount })
    }

    // Avcı muskası
    if (!miningStore.slayerCharmActive) {
      const charmCount = inventoryStore.getItemCount('slayer_charm')
      if (charmCount > 0) {
        items.push({ itemId: 'slayer_charm', name: 'Avcı Muskası', desc: 'Düşürme oranı +20% (bu keşif boyunca)', count: charmCount })
      }
    }

    // Yenebilir onarıcı eşyalar
    const seen = new Set<string>(['guild_badge', 'slayer_charm', 'monster_lure', 'life_talisman', 'lucky_coin', 'defense_charm'])
    for (const invItem of inventoryStore.items) {
      if (invItem.quantity <= 0 || seen.has(invItem.itemId)) continue
      const def = getItemById(invItem.itemId)
      if (!def?.edible) continue
      if (!def.healthRestore && !def.staminaRestore) continue
      seen.add(invItem.itemId)

      const parts: string[] = []
      if (def.healthRestore) parts.push(def.healthRestore >= 999 ? 'Can tam olur' : `Can +${def.healthRestore}`)
      if (def.staminaRestore) parts.push(`Derman +${def.staminaRestore}`)

      items.push({
        itemId: invItem.itemId,
        name: def.name,
        desc: parts.join('，'),
        count: inventoryStore.getItemCount(invItem.itemId)
      })
    }

    return items
  })

  /** Yaratık yemi var mı */
  const hasMonsterLure = computed(() => inventoryStore.getItemCount('monster_lure') > 0)

  const zoneName = computed(() => {
    const floor = getFloor(miningStore.currentFloor)
    return floor ? ZONE_NAMES[floor.zone] : ''
  })

  /** Maden haritası bölük bilgileri */
  const mineZones = computed(() => {
    const zones = [
      { id: 'shallow', name: 'Yüzey Katı · Toprak ve taş', start: 1, end: 20, bossFloor: 20 },
      { id: 'frost', name: 'Buz Oyukları · Donuk yeraltı suyu', start: 21, end: 40, bossFloor: 40 },
      { id: 'lava', name: 'Ateş Katı · Kor ateşi', start: 41, end: 60, bossFloor: 60 },
      { id: 'crystal', name: 'Billur Oyuk · Billur dolambaç', start: 61, end: 80, bossFloor: 80 },
      { id: 'shadow', name: 'Gölgeli Yarık · Karanlık gedik', start: 81, end: 100, bossFloor: 100 },
      { id: 'abyss', name: 'Dip Uçurumu · Sonu görünmez', start: 101, end: 120, bossFloor: 120 }
    ]
    const sp = miningStore.safePointFloor
    return zones.map(z => {
      const reached = sp >= z.start - 1
      const boss = BOSS_MONSTERS[z.bossFloor]
      const bossDefeated = boss ? miningStore.defeatedBosses.includes(boss.id) : false
      const progress = Math.min(100, Math.max(0, ((sp - (z.start - 1)) / 20) * 100))
      const isCurrentZone = sp >= z.start - 1 && sp < z.end
      return {
        ...z,
        reached,
        bossName: boss?.name ?? '???',
        bossDefeated,
        progress: reached ? Math.max(5, progress) : 0,
        isCurrentZone,
        barColor: bossDefeated ? 'bg-success' : isCurrentZone ? 'bg-accent' : reached ? 'bg-accent/50' : 'bg-bg'
      }
    })
  })

  /** Şimdiki kat özel mi */
  const currentFloorSpecial = computed(() => {
    const floor = miningStore.getActiveFloorData()
    return floor?.specialType ?? null
  })

  /** Basık katta kalan yaratık */
  const remainingMonsters = computed(() => {
    return miningStore.totalMonstersOnFloor - miningStore.monstersDefeatedCount
  })

  /** Asansör görünsün mü */
  const hasElevator = computed(() => elevatorZones.value.length > 0 || miningStore.isSkullCavernUnlocked())

  /** Silah bilgileri */
  const weaponDisplayName = computed(() => {
    const owned = inventoryStore.getEquippedWeapon()
    return getWeaponDisplayName(owned.defId, owned.enchantmentId)
  })
  const weaponTypeName = computed(() => {
    const owned = inventoryStore.getEquippedWeapon()
    const def = getWeaponById(owned.defId)
    return def ? WEAPON_TYPE_NAMES[def.type] : 'Bilinmez'
  })
  const weaponAttack = computed(
    () =>
      inventoryStore.getWeaponAttack() +
      skillStore.combatLevel * 2 +
      inventoryStore.getRingEffectValue('attack_bonus') +
      miningStore.guildBadgeBonusAttack
  )
  const critRateDisplay = computed(
    () => `${Math.round((inventoryStore.getWeaponCritRate() + inventoryStore.getRingEffectValue('crit_rate_bonus')) * 100)}%`
  )
  const weaponEnchantName = computed(() => {
    const owned = inventoryStore.getEquippedWeapon()
    if (!owned.enchantmentId) return ''
    const enchant = getEnchantmentById(owned.enchantmentId)
    return enchant ? `${enchant.name} - ${enchant.description}` : ''
  })

  /** Asansör katlarını bölüklere ayır */
  const elevatorZones = computed(() => {
    const allSafePoints = miningStore.getUnlockedSafePoints().filter(sp => sp < miningStore.safePointFloor)
    const zones = [
      { name: 'Yüzey', min: 0, max: 20 },
      { name: 'Buz', min: 21, max: 40 },
      { name: 'Ateş', min: 41, max: 60 },
      { name: 'Billur', min: 61, max: 80 },
      { name: 'Gölge', min: 81, max: 100 },
      { name: 'Dip', min: 101, max: 120 }
    ]
    return zones
      .map(z => ({
        name: z.name,
        floors: allSafePoints.filter(sp => sp >= z.min && sp <= z.max)
      }))
      .filter(z => z.floors.length > 0)
  })

  // ==================== Göze görünüşü yardımcıları ====================

  /** Göze biçemi */
  const getTileClass = (tile: MineTile): string => {
    if (tile.state === 'hidden') {
      if (bombModeId.value) return 'bg-panel/50 border-accent/10 cursor-not-allowed opacity-40'
      if (miningStore.canRevealTile(tile.index)) return 'bg-panel border-accent/30 hover:border-accent cursor-pointer'
      return 'bg-panel/50 border-accent/10 cursor-not-allowed opacity-40'
    }
    switch (tile.type) {
      case 'empty':
        return 'bg-bg border-accent/10'
      case 'ore':
        return tile.state === 'collected' ? 'bg-bg border-accent/10' : 'bg-accent/20 border-accent/40'
      case 'monster':
        return tile.state === 'defeated' ? 'bg-bg border-accent/10' : 'bg-danger/20 border-danger/40 cursor-pointer'
      case 'boss':
        return tile.state === 'defeated' ? 'bg-bg border-accent/10' : 'bg-danger/30 border-danger/50 cursor-pointer'
      case 'stairs':
        return 'bg-success/20 border-success/40'
      case 'trap':
        return 'bg-danger/10 border-danger/20'
      case 'treasure':
        return tile.state === 'collected' ? 'bg-bg border-accent/10' : 'bg-accent/30 border-accent/50'
      case 'mushroom':
        return tile.state === 'collected' ? 'bg-bg border-accent/10' : 'bg-success/20 border-success/30'
      default:
        return 'bg-bg border-accent/10'
    }
  }

  /** Göze imi */
  const getTileIcon = (tile: MineTile): string => {
    if (tile.state === 'hidden') return '?'
    switch (tile.type) {
      case 'empty':
        return '\u00B7'
      case 'ore':
        return tile.state === 'collected' ? '\u00B7' : '\u25C6'
      case 'monster':
        return tile.state === 'defeated' ? '\u00D7' : '!'
      case 'boss':
        return tile.state === 'defeated' ? '\u00D7' : '\u2620'
      case 'stairs':
        return '\u25BC'
      case 'trap':
        return '\u25B3'
      case 'treasure':
        return tile.state === 'collected' ? '\u00B7' : '\u2605'
      case 'mushroom':
        return tile.state === 'collected' ? '\u00B7' : '\u273F'
      default:
        return '\u00B7'
    }
  }

  /** Göze dokunulabilir mi */
  const isTileClickable = (tile: MineTile): boolean => {
    if (bombModeId.value) {
      return tile.state !== 'hidden'
    }
    // Açılmış yaratık/Ulu yaratık gözesine yeniden girilebilir
    if (tile.state === 'revealed' && (tile.type === 'monster' || tile.type === 'boss') && tile.data?.monster) {
      return true
    }
    return tile.state === 'hidden' && miningStore.canRevealTile(tile.index)
  }

  /** Göze dokunma işi */
  const handleTileClick = (tile: MineTile) => {
    if (gameStore.isPastBedtime) {
      addLog('Vakit çok geçti, artık iz sürülmez.')
      handleEndDay()
      return
    }

    if (bombModeId.value) {
      const result = miningStore.useBombOnGrid(bombModeId.value, tile.index)
      if (result.success) {
        sfxMine()
        exploreLog.value.push(result.message)
        addLog(result.message)
        const tr = gameStore.advanceTime(ACTION_TIME_COSTS.mineOre)
        if (tr.message) addLog(tr.message)
        if (tr.passedOut) handleEndDay()
      } else {
        exploreLog.value.push(result.message)
      }
      bombModeId.value = null
      return
    }

    // Açılmış yaratık/Ulu yaratık gözesinde yeniden dövüş
    if (tile.state === 'revealed' && (tile.type === 'monster' || tile.type === 'boss') && tile.data?.monster) {
      const result = miningStore.engageRevealedMonster(tile.index)
      if (result.success) {
        exploreLog.value.push(result.message)
        addLog(result.message)
        if (result.startsCombat) {
          startBattleBgm()
          sfxEncounter()
        }
      } else {
        exploreLog.value.push(result.message)
        addLog(result.message)
      }
      return
    }

    const result = miningStore.revealTile(tile.index)
    if (result.success) {
      exploreLog.value.push(result.message)
      addLog(result.message)

      if (result.startsCombat) {
        startBattleBgm()
        sfxEncounter()
        const tr = gameStore.advanceTime(ACTION_TIME_COSTS.combat)
        if (tr.message) addLog(tr.message)
        if (tr.passedOut) handleEndDay()
      } else {
        sfxClick()
        const tr = gameStore.advanceTime(ACTION_TIME_COSTS.revealTile)
        if (tr.message) addLog(tr.message)
        if (tr.passedOut) handleEndDay()
      }
    } else {
      exploreLog.value.push(result.message)
      addLog(result.message)
    }
  }

  /** Bomba düzenini değiştir */
  const toggleBombMode = (bombId: string) => {
    bombModeId.value = bombModeId.value === bombId ? null : bombId
  }

  // ==================== İşlemler ====================

  const handleEnterMine = (startFrom?: number) => {
    showElevatorModal.value = false
    showCombatItems.value = false
    const msg = miningStore.enterMine(startFrom)
    exploreLog.value = [msg]
    sfxClick()
    addLog(msg)
  }

  const handleEnterSkullCavern = () => {
    showElevatorModal.value = false
    showCombatItems.value = false
    const msg = miningStore.enterSkullCavern()
    exploreLog.value = [msg]
    sfxClick()
    addLog(msg)
  }

  const handleCombat = (action: CombatAction) => {
    if (combatAnimLock.value) return
    combatAnimLock.value = true

    const result = miningStore.combatAction(action)
    const { dealt, taken, isCrit } = parseDamage(result.message)

    if (action === 'attack') sfxAttack()
    if (action === 'defend') sfxDefend()
    if (action === 'flee') sfxFlee()
    if (result.message.includes('受到')) sfxHurt()

    if (action === 'attack' && dealt > 0) {
      triggerAnim('monster', isCrit ? 'anim-shake-heavy' : 'anim-shake', isCrit ? 400 : 300)
      showDamageFloat('monster', isCrit ? `Ağır -${dealt}` : `-${dealt}`)
    }
    if (action === 'defend') {
      triggerAnim('player', 'anim-flash-defend', 400)
    }
    if (taken > 0) {
      triggerAnim('player', isCrit ? 'anim-shake-heavy anim-flash-red' : 'anim-flash-red', 400)
      showDamageFloat('player', `-${taken}`)
    }

    addLog(result.message)

    if (result.combatOver) {
      if (result.won) {
        sfxVictory()
        triggerAnim('monster', 'anim-victory', 1500)
      }
      resumeNormalBgm()
      showCombatItems.value = false
      if (!miningStore.isExploring) {
        exploreLog.value.push(result.message)
      }
    }

    setTimeout(() => {
      combatAnimLock.value = false
    }, 400)
  }

  /** Dövüş eşyası kullan */
  const handleUseCombatItem = (itemId: string) => {
    const result = miningStore.useCombatItem(itemId)
    sfxClick()
    addLog(result.message)
    if (result.success) {
      exploreLog.value.push(result.message)
    }
  }

  const handleConfirmUseItem = () => {
    if (!pendingItemId.value) return
    handleUseCombatItem(pendingItemId.value)
    pendingItemId.value = null
  }

  const handlePendingItem = (itemId: string) => {
    pendingItemId.value = itemId
    showCombatItems.value = false
  }

  /** Yaratık yemi kullan */
  const handleUseMonsterLure = () => {
    const result = miningStore.useMonsterLure()
    sfxClick()
    addLog(result.message)
    if (result.success) {
      exploreLog.value.push(result.message)
    }
  }

  const handleNextFloor = () => {
    if (gameStore.isPastBedtime) {
      addLog('Vakit geçti, geri dönmek gerek.')
      handleEndDay()
      return
    }
    showCombatItems.value = false
    const result = miningStore.goNextFloor()
    if (result.success) {
      exploreLog.value = [result.message]
      bombModeId.value = null
    } else {
      exploreLog.value.push(result.message)
    }
    addLog(result.message)
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.nextFloor)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }

  const handleLeave = () => {
    if (miningStore.inCombat) resumeNormalBgm()
    showCombatItems.value = false
    showLeaveConfirm.value = false
    const msg = miningStore.leaveMine()
    exploreLog.value = []
    bombModeId.value = null
    addLog(msg)
  }

  const confirmLeave = () => {
    handleLeave()
  }

  // ==================== Hızlı kuşanım ====================

  const showPresetListModal = ref(false)
  const showPresetDetailModal = ref(false)
  const detailPresetId = ref<string | null>(null)
  const showEquipPropertyModal = ref(false)

  interface EquipPropertyInfo {
    category: string
    name: string
    description: string
    effects: { label: string; value: string }[]
  }

  const equipPropertyInfo = ref<EquipPropertyInfo | null>(null)

  const EFFECT_NAMES: Record<EquipmentEffectType, string> = {
    attack_bonus: 'Vuruş gücü',
    crit_rate_bonus: 'Ağır vurma oranı',
    defense_bonus: 'Savunma',
    vampiric: 'Can emişi',
    max_hp_bonus: 'Azami can',
    stamina_reduction: 'Derman gideri',
    mining_stamina: 'Maden dermanı',
    farming_stamina: 'Tarla dermanı',
    fishing_stamina: 'Av dermanı',
    crop_quality_bonus: 'Ekin niteliği',
    crop_growth_bonus: 'Ekin büyümesi',
    fish_quality_bonus: 'Balık niteliği',
    fishing_calm: 'Av sükûnu',
    sell_price_bonus: 'Satış artısı',
    shop_discount: 'Alış indirimi',
    gift_friendship: 'Armağan gönlü',
    monster_drop_bonus: 'Düşürme oranı',
    exp_bonus: 'Deneyim artısı',
    treasure_find: 'Sandık olasılığı',
    ore_bonus: 'Cevher artısı',
    luck: 'Uğur',
    travel_speed: 'Yol hızı'
  }

  const PCTG_EFFECTS: Set<EquipmentEffectType> = new Set([
    'crit_rate_bonus',
    'vampiric',
    'stamina_reduction',
    'mining_stamina',
    'farming_stamina',
    'fishing_stamina',
    'crop_quality_bonus',
    'crop_growth_bonus',
    'fish_quality_bonus',
    'fishing_calm',
    'sell_price_bonus',
    'shop_discount',
    'gift_friendship',
    'monster_drop_bonus',
    'exp_bonus',
    'treasure_find',
    'ore_bonus',
    'luck',
    'travel_speed',
    'defense_bonus'
  ])

  const fmtEffect = (eff: { type: EquipmentEffectType; value: number }): string => {
    if (PCTG_EFFECTS.has(eff.type)) return `+${Math.round(eff.value * 100)}%`
    return `+${eff.value}`
  }

  const detailPreset = computed(() => {
    if (!detailPresetId.value) return null
    return inventoryStore.equipmentPresets.find(p => p.id === detailPresetId.value) ?? null
  })

  const quickApplyPreset = (id: string) => {
    const result = inventoryStore.applyEquipmentPreset(id)
    addLog(result.message)
    showPresetListModal.value = false
  }

  const viewPresetDetail = (id: string) => {
    detailPresetId.value = id
    showPresetDetailModal.value = true
  }

  const viewEquipProperty = (type: 'weapon' | 'ring' | 'hat' | 'shoe', defId: string) => {
    if (type === 'weapon') {
      const def = getWeaponById(defId)
      if (!def) return
      equipPropertyInfo.value = {
        category: 'Silah',
        name: def.name,
        description: def.description,
        effects: [
          { label: 'Vuruş gücü', value: `${def.attack}` },
          { label: 'Tür', value: WEAPON_TYPE_NAMES[def.type] },
          { label: 'Ağır vurma', value: `${Math.round(def.critRate * 100)}%` }
        ]
      }
    } else if (type === 'ring') {
      const def = getRingById(defId)
      if (!def) return
      equipPropertyInfo.value = {
        category: 'Yüzük',
        name: def.name,
        description: def.description,
        effects: def.effects.map(e => ({ label: EFFECT_NAMES[e.type], value: fmtEffect(e) }))
      }
    } else if (type === 'hat') {
      const def = getHatById(defId)
      if (!def) return
      equipPropertyInfo.value = {
        category: 'Başlık',
        name: def.name,
        description: def.description,
        effects: def.effects.map(e => ({ label: EFFECT_NAMES[e.type], value: fmtEffect(e) }))
      }
    } else {
      const def = getShoeById(defId)
      if (!def) return
      equipPropertyInfo.value = {
        category: 'Ayaklık',
        name: def.name,
        description: def.description,
        effects: def.effects.map(e => ({ label: EFFECT_NAMES[e.type], value: fmtEffect(e) }))
      }
    }
    showEquipPropertyModal.value = true
  }
</script>

<style scoped>
  /* === Dövüş devinimleri === */

  @keyframes combat-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-3px);
    }
    40% {
      transform: translateX(3px);
    }
    60% {
      transform: translateX(-2px);
    }
    80% {
      transform: translateX(2px);
    }
  }

  @keyframes combat-shake-heavy {
    0%,
    100% {
      transform: translateX(0);
    }
    10% {
      transform: translate(-4px, 2px);
    }
    30% {
      transform: translate(4px, -2px);
    }
    50% {
      transform: translate(-3px, 1px);
    }
    70% {
      transform: translate(3px, -1px);
    }
    90% {
      transform: translate(-2px, 1px);
    }
  }

  @keyframes combat-flash-red {
    0%,
    100% {
      background-color: transparent;
    }
    50% {
      background-color: rgba(195, 64, 67, 0.3);
    }
  }

  @keyframes combat-flash-defend {
    0%,
    100% {
      background-color: transparent;
    }
    50% {
      background-color: rgba(76, 110, 138, 0.3);
    }
  }

  @keyframes combat-float-up {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-24px);
    }
  }

  @keyframes combat-victory-flash {
    0%,
    100% {
      border-color: rgba(200, 164, 92, 0.3);
    }
    50% {
      border-color: rgba(200, 164, 92, 0.8);
    }
  }

  .anim-shake {
    animation: combat-shake 0.3s ease-in-out;
  }
  .anim-shake-heavy {
    animation: combat-shake-heavy 0.4s ease-in-out;
  }
  .anim-flash-red {
    animation: combat-flash-red 0.3s ease-in-out;
  }
  .anim-flash-defend {
    animation: combat-flash-defend 0.4s ease-in-out;
  }
  .anim-victory {
    animation: combat-victory-flash 0.5s ease-in-out 3;
  }
  .anim-float-up {
    animation: combat-float-up 0.8s ease-out forwards;
  }
</style>
