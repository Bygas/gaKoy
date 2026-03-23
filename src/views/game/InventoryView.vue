<template>
  <div>
    <!-- Başlık -->
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center space-x-1.5 text-sm text-accent">
        <Package :size="14" />
        <span>Heybe</span>
      </div>
      <span class="text-xs text-muted">
        {{ inventoryStore.items.length }}/{{ inventoryStore.capacity }}
        <span v-if="inventoryStore.tempItems.length > 0" class="text-danger">+{{ inventoryStore.tempItems.length }} taşan</span>
      </span>
    </div>

    <!-- Sekme geçişi -->
    <div class="flex space-x-1 mb-3">
      <Button class="flex-1 justify-center" :class="{ '!bg-accent !text-bg': tab === 'items' }" @click="tab = 'items'">Eşya</Button>
      <Button class="flex-1 justify-center" :class="{ '!bg-accent !text-bg': tab === 'tools' }" @click="tab = 'tools'">Kuşanım</Button>
      <Button
        class="flex-1 justify-center"
        :class="{ '!bg-danger !text-text': tab === 'temp', 'text-danger': tab !== 'temp' && inventoryStore.tempItems.length > 0 }"
        @click="tab = 'temp'"
      >
        Geçici{{ inventoryStore.tempItems.length > 0 ? `(${inventoryStore.tempItems.length})` : '' }}
      </Button>
    </div>

    <!-- Eşya sekmesi -->
    <template v-if="tab === 'items'">
      <div v-if="inventoryStore.items.length > 1" class="flex justify-end mb-1.5 space-x-1">
        <Button
          class="py-0 px-1.5"
          :class="{ '!bg-accent !text-bg': isFilterActive }"
          :icon="Filter"
          :icon-size="12"
          @click="openFilterModal"
        >
          Süz
        </Button>
        <Button class="py-0 px-1.5" :icon="ArrowDown01" :icon-size="12" @click="inventoryStore.sortItems()">Düzenle</Button>
      </div>
      <div v-if="filteredItems.length > 0" class="grid grid-cols-3 md:grid-cols-5 gap-1.5">
        <div
          v-for="(item, idx) in filteredItems"
          :key="idx"
          class="border border-accent/20 rounded-xs p-1.5 text-center cursor-pointer hover:bg-accent/5 transition-colors relative"
          @click="activeItemKey = item.itemId + ':' + item.quality"
        >
          <Lock v-if="item.locked" :size="10" class="absolute top-0.5 left-0.5 text-accent/60" />
          <div
            class="text-xs truncate"
            :class="{
              'text-quality-fine': item.quality === 'fine',
              'text-quality-excellent': item.quality === 'excellent',
              'text-quality-supreme': item.quality === 'supreme'
            }"
          >
            {{ getItemById(item.itemId)?.name }}
          </div>
          <div class="text-xs text-muted">×{{ item.quantity }}</div>
        </div>

        <!-- Boş gözeler -->
        <div
          v-for="i in isFilterActive ? 0 : Math.max(0, inventoryStore.capacity - inventoryStore.items.length)"
          :key="'empty-' + i"
          class="border border-accent/10 rounded-xs p-1.5 text-center text-xs text-muted/30"
        >
          Boş
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-4 text-muted">
        <Package :size="24" />
        <p class="text-xs mt-1">Heybe boş</p>
      </div>
    </template>

    <!-- Geçici heybe sekmesi -->
    <template v-if="tab === 'temp'">
      <div v-if="inventoryStore.tempItems.length > 0">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] text-muted">Heybe dolunca taşan eşyalar burada durur, vakitlice geri al</span>
          <Button v-if="!inventoryStore.isFull" class="py-0 px-1.5" @click="handleMoveAllFromTemp">Hepsini al</Button>
        </div>
        <div class="grid grid-cols-3 md:grid-cols-5 gap-1.5">
          <div
            v-for="(item, idx) in inventoryStore.tempItems"
            :key="'temp-' + idx"
            class="border border-danger/30 rounded-xs p-1.5 text-center cursor-pointer hover:bg-danger/5 transition-colors"
            @click="activeTempIdx = idx"
          >
            <div
              class="text-xs truncate"
              :class="{
                'text-quality-fine': item.quality === 'fine',
                'text-quality-excellent': item.quality === 'excellent',
                'text-quality-supreme': item.quality === 'supreme'
              }"
            >
              {{ getItemById(item.itemId)?.name }}
            </div>
            <div class="text-xs text-muted">×{{ item.quantity }}</div>
          </div>

          <!-- Boş gözeler -->
          <div
            v-for="i in Math.max(0, 10 - inventoryStore.tempItems.length)"
            :key="'temp-empty-' + i"
            class="border border-danger/10 rounded-xs p-1.5 text-center text-xs text-muted/30"
          >
            Boş
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-4 text-muted">
        <Archive :size="24" />
        <p class="text-xs mt-1">Geçici heybe boş</p>
      </div>
    </template>

    <!-- Kuşanım sekmesi -->
    <template v-if="tab === 'tools'">
      <!-- Düzen düğmesi -->
      <div class="flex items-center justify-end mb-1.5 space-x-1.5">
        <span v-if="activePresetName" class="text-[10px] text-success truncate">{{ activePresetName }}</span>
        <Button class="py-0 px-1.5" :icon="BookMarked" :icon-size="12" @click="showPresetModal = true">Düzen</Button>
      </div>

      <!-- Silah -->
      <div class="border border-accent/20 rounded-xs p-2 mb-3">
        <p class="text-xs text-muted mb-1">Silah</p>
        <div class="flex flex-col space-y-1 max-h-40 overflow-y-auto">
          <div
            v-for="(weapon, idx) in inventoryStore.ownedWeapons"
            :key="idx"
            class="flex items-center justify-between border rounded-xs px-2 py-1 mr-1 cursor-pointer hover:bg-accent/5"
            :class="idx === inventoryStore.equippedWeaponIndex ? 'border-accent/30' : 'border-accent/10'"
            @click="activeWeaponIdx = idx"
          >
            <span class="text-xs" :class="idx === inventoryStore.equippedWeaponIndex ? 'text-accent' : ''">
              {{ getWeaponDisplayName(weapon.defId, weapon.enchantmentId) }}
            </span>
            <span v-if="idx === inventoryStore.equippedWeaponIndex" class="text-xs text-accent">Kuşanılı</span>
            <span v-else class="text-xs text-muted">{{ getWeaponSellPrice(weapon.defId, weapon.enchantmentId) }} akçe</span>
          </div>
        </div>
      </div>

      <!-- Başlık -->
      <div class="border border-accent/20 rounded-xs p-2 mb-3">
        <p class="text-xs text-muted mb-1">Başlık</p>
        <div v-if="inventoryStore.ownedHats.length > 0" class="flex flex-col space-y-1">
          <!-- Yuva -->
          <div class="border border-accent/10 rounded-xs px-2 py-1 text-center mb-1">
            <p class="text-[10px] text-muted">Kuşanılı</p>
            <p class="text-xs" :class="equippedHatName ? 'text-accent' : 'text-muted/40'">
              {{ equippedHatName ?? 'Boş' }}
            </p>
          </div>
          <!-- Sahip olunan başlıklar -->
          <div class="max-h-40 overflow-y-auto flex flex-col space-y-1">
            <div
              v-for="(hat, idx) in inventoryStore.ownedHats"
              :key="idx"
              class="flex items-center justify-between border rounded-xs px-2 py-1 mr-1 cursor-pointer hover:bg-accent/5"
              :class="inventoryStore.equippedHatIndex === idx ? 'border-accent/30' : 'border-accent/10'"
              @click="activeHatIdx = idx"
            >
              <div class="min-w-0">
                <span class="text-xs" :class="inventoryStore.equippedHatIndex === idx ? 'text-accent' : ''">
                  {{ getHatById(hat.defId)?.name ?? hat.defId }}
                </span>
                <p class="text-[10px] text-muted truncate">{{ getHatById(hat.defId)?.description }}</p>
              </div>
              <Button
                class="py-0 px-1.5 shrink-0 ml-2"
                :class="inventoryStore.equippedHatIndex === idx ? '!bg-accent !text-bg' : ''"
                @click.stop="handleToggleHat(idx)"
              >
                {{ inventoryStore.equippedHatIndex === idx ? 'Çıkar' : 'Kuşan' }}
              </Button>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-muted/40 text-center py-2">Başlık yok</p>
      </div>

      <!-- Ayaklık -->
      <div class="border border-accent/20 rounded-xs p-2 mb-3">
        <p class="text-xs text-muted mb-1">Ayaklık</p>
        <div v-if="inventoryStore.ownedShoes.length > 0" class="flex flex-col space-y-1">
          <!-- Yuva -->
          <div class="border border-accent/10 rounded-xs px-2 py-1 text-center mb-1">
            <p class="text-[10px] text-muted">Kuşanılı</p>
            <p class="text-xs" :class="equippedShoeName ? 'text-accent' : 'text-muted/40'">
              {{ equippedShoeName ?? 'Boş' }}
            </p>
          </div>
          <!-- Sahip olunan ayaklıklar -->
          <div class="max-h-40 overflow-y-auto flex flex-col space-y-1">
            <div
              v-for="(shoe, idx) in inventoryStore.ownedShoes"
              :key="idx"
              class="flex items-center justify-between border rounded-xs px-2 py-1 mr-1 cursor-pointer hover:bg-accent/5"
              :class="inventoryStore.equippedShoeIndex === idx ? 'border-accent/30' : 'border-accent/10'"
              @click="activeShoeIdx = idx"
            >
              <div class="min-w-0">
                <span class="text-xs" :class="inventoryStore.equippedShoeIndex === idx ? 'text-accent' : ''">
                  {{ getShoeById(shoe.defId)?.name ?? shoe.defId }}
                </span>
                <p class="text-[10px] text-muted truncate">{{ getShoeById(shoe.defId)?.description }}</p>
              </div>
              <Button
                class="py-0 px-1.5 shrink-0 ml-2"
                :class="inventoryStore.equippedShoeIndex === idx ? '!bg-accent !text-bg' : ''"
                @click.stop="handleToggleShoe(idx)"
              >
                {{ inventoryStore.equippedShoeIndex === idx ? 'Çıkar' : 'Kuşan' }}
              </Button>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-muted/40 text-center py-2">Ayaklık yok</p>
      </div>

      <!-- Yüzük -->
      <div class="border border-accent/20 rounded-xs p-2">
        <p class="text-xs text-muted mb-1">Yüzük</p>
        <div v-if="inventoryStore.ownedRings.length > 0" class="flex flex-col space-y-1">
          <!-- Yuvalar -->
          <div class="flex space-x-1 mb-1">
            <div class="flex-1 border border-accent/10 rounded-xs px-2 py-1 text-center">
              <p class="text-[10px] text-muted">Yuva 1</p>
              <p class="text-xs" :class="equippedRing1Name ? 'text-accent' : 'text-muted/40'">
                {{ equippedRing1Name ?? 'Boş' }}
              </p>
            </div>
            <div class="flex-1 border border-accent/10 rounded-xs px-2 py-1 text-center">
              <p class="text-[10px] text-muted">Yuva 2</p>
              <p class="text-xs" :class="equippedRing2Name ? 'text-accent' : 'text-muted/40'">
                {{ equippedRing2Name ?? 'Boş' }}
              </p>
            </div>
          </div>
          <!-- Sahip olunan yüzükler -->
          <div class="max-h-40 overflow-y-auto flex flex-col space-y-1">
            <div
              v-for="(ring, idx) in inventoryStore.ownedRings"
              :key="idx"
              class="flex items-center justify-between border rounded-xs px-2 py-1 mr-1 cursor-pointer hover:bg-accent/5"
              :class="isRingEquipped(idx) ? 'border-accent/30' : 'border-accent/10'"
              @click="activeRingIdx = idx"
            >
              <div class="min-w-0">
                <span class="text-xs" :class="isRingEquipped(idx) ? 'text-accent' : ''">
                  {{ getRingById(ring.defId)?.name ?? ring.defId }}
                </span>
                <p class="text-[10px] text-muted truncate">{{ getRingById(ring.defId)?.description }}</p>
              </div>
              <div class="flex space-x-1 shrink-0 ml-2">
                <Button
                  class="py-0 px-1.5"
                  :class="
                    inventoryStore.equippedRingSlot1 === idx
                      ? '!bg-accent !text-bg'
                      : isRingBlockedForSlot(idx, 0)
                        ? 'opacity-30 cursor-not-allowed'
                        : ''
                  "
                  :disabled="isRingBlockedForSlot(idx, 0)"
                  @click.stop="handleToggleRingSlot(idx, 0)"
                >
                  Yuva1
                </Button>
                <Button
                  class="py-0 px-1.5"
                  :class="
                    inventoryStore.equippedRingSlot2 === idx
                      ? '!bg-accent !text-bg'
                      : isRingBlockedForSlot(idx, 1)
                        ? 'opacity-30 cursor-not-allowed'
                        : ''
                  "
                  :disabled="isRingBlockedForSlot(idx, 1)"
                  @click.stop="handleToggleRingSlot(idx, 1)"
                >
                  Yuva2
                </Button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-xs text-muted/40 text-center py-2">Yüzük yok</p>
      </div>

      <!-- Takım etkileri -->
      <div v-if="inventoryStore.activeSets.length > 0" class="border border-accent/20 rounded-xs p-2 mt-3">
        <p class="text-xs text-muted mb-1">Takım etkisi</p>
        <div v-for="set in inventoryStore.activeSets" :key="set.id" class="border border-accent/10 rounded-xs p-2 mb-1.5 last:mb-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-accent">{{ set.name }}</span>
            <span class="text-xs text-muted">{{ set.equippedCount }}/3</span>
          </div>
          <div v-for="bonus in set.bonuses" :key="bonus.count" class="text-[10px]" :class="bonus.active ? 'text-success' : 'text-muted/40'">
            ({{ bonus.count }} parça) {{ bonus.description }}
          </div>
        </div>
      </div>
    </template>

    <!-- Kuşanım düzeni penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showPresetModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showPresetModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showPresetModal = false">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">Kuşanım Düzeni</p>
          <div v-if="inventoryStore.equipmentPresets.length > 0" class="flex flex-col space-y-1.5 mb-3 max-h-60 overflow-y-auto">
            <div
              v-for="preset in inventoryStore.equipmentPresets"
              :key="preset.id"
              class="border rounded-xs p-2"
              :class="activePresetId === preset.id ? 'border-accent/40' : 'border-accent/10'"
            >
              <div class="flex items-center justify-between mb-1">
                <template v-if="renamingPresetId === preset.id">
                  <input
                    v-model="renameValue"
                    class="bg-transparent border border-accent/30 rounded-xs px-1 py-0.5 text-xs text-text w-full mr-2 outline-none"
                    @keyup.enter="confirmRename(preset.id)"
                    @blur="confirmRename(preset.id)"
                  />
                </template>
                <template v-else>
                  <span class="text-xs text-accent truncate">{{ preset.name }}</span>
                </template>
                <span v-if="activePresetId === preset.id" class="text-[10px] text-success shrink-0 ml-1">Kullanımda</span>
              </div>
              <div class="flex space-x-1">
                <Button
                  class="py-0 px-1.5 flex-1 justify-center"
                  :disabled="activePresetId === preset.id"
                  @click="handleApplyPreset(preset.id)"
                >
                  Kullan
                </Button>
                <Button class="py-0 px-1.5 flex-1 justify-center" @click="handleSaveToPreset(preset.id)">Kaydet</Button>
                <Button class="py-0 px-1.5" @click="startRename(preset)">Ad ver</Button>
                <Button class="py-0 px-1.5 text-danger" :disabled="activePresetId === preset.id" @click="handleDeletePreset(preset.id)">
                  Sil
                </Button>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-6 mb-3">
            <BookMarked :size="24" class="text-muted/30" />
            <p class="text-xs text-muted mt-1">Düzen yok</p>
            <p class="text-[10px] text-muted/60 mt-0.5">Düzen kurarsan kuşanımı bir anda değiştirebilirsin</p>
          </div>
          <Button class="w-full justify-center" :disabled="inventoryStore.equipmentPresets.length >= 3" @click="handleCreatePreset">
            Yeni düzen
          </Button>
        </div>
      </div>
    </Transition>

    <!-- Geçici heybe eşya ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showFilterModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showFilterModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showFilterModal = false">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">Eşya Süzgeci</p>
          <p class="text-[10px] text-muted mb-2">Görünsün istediğin türleri seç; seçmezsen hepsi görünür</p>
          <div class="grid grid-cols-3 gap-1.5 mb-3">
            <div
              v-for="cat in FILTER_CATEGORIES"
              :key="cat"
              class="border rounded-xs px-1.5 py-1 text-center text-xs cursor-pointer transition-colors"
              :class="tempFilter.has(cat) ? 'border-accent/50 bg-accent/10 text-accent' : 'border-accent/20 text-muted hover:bg-accent/5'"
              @click="toggleCategory(cat)"
            >
              {{ CATEGORY_NAMES[cat] }}
            </div>
          </div>
          <div class="flex space-x-1.5">
            <Button class="flex-1 justify-center" @click="handleClearFilter">Hepsi görünsün</Button>
            <Button class="flex-1 justify-center !bg-accent !text-bg" @click="handleSaveFilter">Sakla</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Geçici heybe eşya ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="activeTempItem"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="activeTempIdx = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeTempIdx = null">
            <X :size="14" />
          </button>
          <p
            class="text-sm mb-2"
            :class="{
              'text-quality-fine': activeTempItem.quality === 'fine',
              'text-quality-excellent': activeTempItem.quality === 'excellent',
              'text-quality-supreme': activeTempItem.quality === 'supreme',
              'text-accent': activeTempItem.quality === 'normal'
            }"
          >
            {{ activeTempItemDef?.name }}
            <span class="text-xs text-danger ml-1">（Geçici）</span>
          </p>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ activeTempItemDef?.description }}</p>
          </div>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Sayı</span>
              <span class="text-xs">×{{ activeTempItem.quantity }}</span>
            </div>
            <div v-if="activeTempItem.quality !== 'normal'" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Nitelik</span>
              <span
                class="text-xs"
                :class="{
                  'text-quality-fine': activeTempItem.quality === 'fine',
                  'text-quality-excellent': activeTempItem.quality === 'excellent',
                  'text-quality-supreme': activeTempItem.quality === 'supreme'
                }"
              >
                {{ QUALITY_NAMES[activeTempItem.quality] }}
              </span>
            </div>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Button
              class="w-full justify-center"
              :class="inventoryStore.isFull ? 'opacity-50' : ''"
              :icon="ArrowRight"
              :icon-size="12"
              :disabled="inventoryStore.isFull"
              @click="handleMoveFromTemp"
            >
              Heybeye koy
            </Button>
            <Button class="w-full justify-center text-danger border-danger/40" @click="handleDiscardTemp">At gitsin</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Eşya ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div v-if="activeItem" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="activeItemKey = null">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeItemKey = null">
            <X :size="14" />
          </button>

          <p
            class="text-sm mb-2"
            :class="{
              'text-quality-fine': activeItem.quality === 'fine',
              'text-quality-excellent': activeItem.quality === 'excellent',
              'text-quality-supreme': activeItem.quality === 'supreme',
              'text-accent': activeItem.quality === 'normal'
            }"
          >
            {{ activeItemDef?.name }}
          </p>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ activeItemDef?.description }}</p>
          </div>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Sayı</span>
              <span class="text-xs">×{{ activeItem.quantity }}</span>
            </div>
            <div v-if="activeItem.quality !== 'normal'" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Nitelik</span>
              <span
                class="text-xs"
                :class="{
                  'text-quality-fine': activeItem.quality === 'fine',
                  'text-quality-excellent': activeItem.quality === 'excellent',
                  'text-quality-supreme': activeItem.quality === 'supreme'
                }"
              >
                {{ QUALITY_NAMES[activeItem.quality] }}
              </span>
            </div>
            <div v-if="activeItemDef?.sellPrice" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ activeItemDef.sellPrice }} akçe</span>
            </div>
            <div v-if="activeItemDef?.staminaRestore" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Onarım</span>
              <span class="text-xs text-success">
                +{{ activeItemDef.staminaRestore }} derman
                <template v-if="activeItemDef.healthRestore">/ +{{ activeItemDef.healthRestore }} can</template>
              </span>
            </div>
            <div v-if="activeItemBuff" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Kut</span>
              <span class="text-xs text-accent">{{ activeItemBuff.description }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Kaynak</span>
              <span class="text-xs text-muted">{{ getItemSource(activeItem.itemId) }}</span>
            </div>
          </div>

          <div class="flex flex-col space-y-1.5">
            <Button
              class="w-full justify-center"
              :icon="activeItem.locked ? LockOpen : Lock"
              :icon-size="12"
              @click="inventoryStore.toggleLock(activeItem.itemId, activeItem.quality)"
            >
              {{ activeItem.locked ? 'Kilidi aç' : 'Kilitle' }}
            </Button>
            <Button
              v-if="isEdible(activeItem.itemId)"
              class="w-full justify-center"
              :icon="Apple"
              :icon-size="12"
              @click="handleEat(activeItem.itemId, activeItem.quality)"
            >
              Ye
            </Button>
            <Button
              v-if="isUsable(activeItem.itemId)"
              class="w-full justify-center"
              :icon="Zap"
              :icon-size="12"
              @click="handleUse(activeItem.itemId, activeItem.quality)"
            >
              Kullan
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Silah ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="activeWeaponIdx !== null && activeWeaponDef"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="activeWeaponIdx = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeWeaponIdx = null">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">{{ activeWeaponName }}</p>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ activeWeaponDef.description }}</p>
          </div>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Tür</span>
              <span class="text-xs">{{ WEAPON_TYPE_NAMES[activeWeaponDef.type] }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Vuruş gücü</span>
              <span class="text-xs">{{ activeWeaponDef.attack }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Ağır vurma</span>
              <span class="text-xs">{{ Math.round(activeWeaponDef.critRate * 100) }}%</span>
            </div>
            <div v-if="activeWeaponEnchant" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Tılsım</span>
              <span class="text-xs text-accent">{{ activeWeaponEnchant.name }}：{{ activeWeaponEnchant.description }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ activeWeaponPrice }} akçe</span>
            </div>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Button v-if="activeWeaponIdx !== inventoryStore.equippedWeaponIndex" class="w-full justify-center" @click="handleEquipWeapon">
              Kuşan
            </Button>
            <Button
              v-if="activeWeaponIdx !== inventoryStore.equippedWeaponIndex && inventoryStore.ownedWeapons.length > 1"
              class="w-full justify-center text-danger border-danger/40"
              @click="handleSellWeapon"
            >
              Sat · {{ activeWeaponPrice }} akçe
            </Button>
            <p v-if="activeWeaponIdx === inventoryStore.equippedWeaponIndex" class="text-[10px] text-muted text-center">
              Şu an kuşanılı; satmak için önce başka silaha geç
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Yüzük ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="activeRingIdx !== null && activeRingDef"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="activeRingIdx = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeRingIdx = null">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">{{ activeRingDef.name }}</p>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ activeRingDef.description }}</p>
          </div>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div v-for="eff in activeRingDef.effects" :key="eff.type" class="flex items-center justify-between mt-0.5 first:mt-0">
              <span class="text-xs text-muted">{{ RING_EFFECT_NAMES[eff.type] ?? eff.type }}</span>
              <span class="text-xs text-success">+{{ formatEffectValue(eff) }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ activeRingDef.sellPrice }} akçe</span>
            </div>
          </div>
          <div class="flex flex-col space-y-1.5">
            <div class="flex space-x-1.5">
              <Button
                class="flex-1 justify-center"
                :class="activeRingIdx !== null && isRingBlockedForSlot(activeRingIdx, 0) ? 'opacity-30 cursor-not-allowed' : ''"
                :disabled="activeRingIdx !== null && isRingBlockedForSlot(activeRingIdx, 0)"
                @click="handleEquipRingFromPopup(0)"
              >
                {{ inventoryStore.equippedRingSlot1 === activeRingIdx ? 'Yuva1’den çıkar' : 'Yuva1’e tak' }}
              </Button>
              <Button
                class="flex-1 justify-center"
                :class="activeRingIdx !== null && isRingBlockedForSlot(activeRingIdx, 1) ? 'opacity-30 cursor-not-allowed' : ''"
                :disabled="activeRingIdx !== null && isRingBlockedForSlot(activeRingIdx, 1)"
                @click="handleEquipRingFromPopup(1)"
              >
                {{ inventoryStore.equippedRingSlot2 === activeRingIdx ? 'Yuva2’den çıkar' : 'Yuva2’ye tak' }}
              </Button>
            </div>
            <Button class="w-full justify-center text-danger border-danger/40" @click="handleSellRing">
              Sat · {{ activeRingDef.sellPrice }} akçe
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Başlık ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="activeHatIdx !== null && activeHatDef"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="activeHatIdx = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeHatIdx = null">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">{{ activeHatDef.name }}</p>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ activeHatDef.description }}</p>
          </div>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div v-for="eff in activeHatDef.effects" :key="eff.type" class="flex items-center justify-between mt-0.5 first:mt-0">
              <span class="text-xs text-muted">{{ RING_EFFECT_NAMES[eff.type] ?? eff.type }}</span>
              <span class="text-xs text-success">+{{ formatEffectValue(eff) }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ activeHatDef.sellPrice }} akçe</span>
            </div>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Button class="w-full justify-center" @click="handleToggleHatFromPopup">
              {{ inventoryStore.equippedHatIndex === activeHatIdx ? 'Çıkar' : 'Kuşan' }}
            </Button>
            <Button class="w-full justify-center text-danger border-danger/40" @click="handleSellHat">
              Sat · {{ activeHatDef.sellPrice }} akçe
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Ayaklık ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="activeShoeIdx !== null && activeShoeDef"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="activeShoeIdx = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeShoeIdx = null">
            <X :size="14" />
          </button>
          <p class="text-sm text-accent mb-2">{{ activeShoeDef.name }}</p>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ activeShoeDef.description }}</p>
          </div>
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div v-for="eff in activeShoeDef.effects" :key="eff.type" class="flex items-center justify-between mt-0.5 first:mt-0">
              <span class="text-xs text-muted">{{ RING_EFFECT_NAMES[eff.type] ?? eff.type }}</span>
              <span class="text-xs text-success">+{{ formatEffectValue(eff) }}</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Satış değeri</span>
              <span class="text-xs text-accent">{{ activeShoeDef.sellPrice }} akçe</span>
            </div>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Button class="w-full justify-center" @click="handleToggleShoeFromPopup">
              {{ inventoryStore.equippedShoeIndex === activeShoeIdx ? 'Çıkar' : 'Kuşan' }}
            </Button>
            <Button class="w-full justify-center text-danger border-danger/40" @click="handleSellShoe">
              Sat · {{ activeShoeDef.sellPrice }} akçe
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Apple, Archive, ArrowDown01, ArrowRight, BookMarked, Filter, Lock, LockOpen, Package, X, Zap } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import { useCookingStore } from '@/stores/useCookingStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { useSettingsStore } from '@/stores/useSettingsStore'
  import { useSkillStore } from '@/stores/useSkillStore'
  import { getItemById, getItemSource } from '@/data'
  import { getRecipeById } from '@/data/recipes'
  import { getWeaponById, getWeaponDisplayName, getWeaponSellPrice, getEnchantmentById, WEAPON_TYPE_NAMES } from '@/data/weapons'
  import { getRingById } from '@/data/rings'
  import { getHatById } from '@/data/hats'
  import { getShoeById } from '@/data/shoes'
  import { QUALITY_NAMES } from '@/composables/useFarmActions'
  import { addLog } from '@/composables/useGameLog'
  import type { Quality, RingEffectType, ItemCategory } from '@/types'

  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const skillStore = useSkillStore()
  const gameStore = useGameStore()
  const cookingStore = useCookingStore()
  const settingsStore = useSettingsStore()

  // === Sekmeler ===

  const tab = ref<'items' | 'tools' | 'temp'>('items')

  // === Eşya süzme ===

  const FILTER_CATEGORIES: ItemCategory[] = [
    'seed',
    'crop',
    'fruit',
    'fish',
    'animal_product',
    'processed',
    'food',
    'ore',
    'gem',
    'material',
    'machine',
    'sprinkler',
    'fertilizer',
    'bait',
    'tackle',
    'bomb',
    'sapling',
    'gift',
    'fossil',
    'artifact',
    'misc'
  ]

  const CATEGORY_NAMES: Partial<Record<ItemCategory, string>> = {
    seed: 'Tohum',
    crop: 'Ekin',
    fruit: 'Meyve',
    fish: 'Balık',
    animal_product: 'Hayvan ürünü',
    processed: 'İşlenmiş',
    food: 'Aş',
    ore: 'Cevher',
    gem: 'Taş',
    material: 'Gereç',
    machine: 'Düzenek',
    sprinkler: 'Su saçan',
    fertilizer: 'Gübre',
    bait: 'Yem',
    tackle: 'Olta gereci',
    bomb: 'Bomba',
    sapling: 'Fidan',
    gift: 'Armağan',
    fossil: 'Kemiktaş',
    artifact: 'Eski yadigâr',
    misc: 'Öteberi'
  }

  const showFilterModal = ref(false)
  const tempFilter = ref<Set<ItemCategory>>(new Set())

  const isFilterActive = computed(() => settingsStore.inventoryFilter.length > 0)

  const filteredItems = computed(() => {
    if (settingsStore.inventoryFilter.length === 0) return inventoryStore.items
    const allowed = new Set(settingsStore.inventoryFilter)
    return inventoryStore.items.filter(item => {
      const def = getItemById(item.itemId)
      return def && allowed.has(def.category)
    })
  })

  const openFilterModal = () => {
    tempFilter.value = new Set(settingsStore.inventoryFilter)
    showFilterModal.value = true
  }

  const toggleCategory = (cat: ItemCategory) => {
    if (tempFilter.value.has(cat)) {
      tempFilter.value.delete(cat)
    } else {
      tempFilter.value.add(cat)
    }
  }

  const handleSaveFilter = () => {
    settingsStore.inventoryFilter = [...tempFilter.value]
    showFilterModal.value = false
  }

  const handleClearFilter = () => {
    tempFilter.value = new Set()
  }

  // === Kuşanım düzenleri ===

  const showPresetModal = ref(false)
  const renamingPresetId = ref<string | null>(null)
  const renameValue = ref('')

  const activePresetId = computed(() => inventoryStore.activePresetId)

  const activePresetName = computed(() => {
    if (!activePresetId.value) return null
    return inventoryStore.equipmentPresets.find(p => p.id === activePresetId.value)?.name ?? null
  })

  const handleCreatePreset = () => {
    inventoryStore.createEquipmentPreset('Düzen' + (inventoryStore.equipmentPresets.length + 1))
  }

  const startRename = (preset: { id: string; name: string }) => {
    renamingPresetId.value = preset.id
    renameValue.value = preset.name
  }

  const confirmRename = (id: string) => {
    if (renamingPresetId.value === null) return
    inventoryStore.renameEquipmentPreset(id, renameValue.value)
    renamingPresetId.value = null
  }

  const handleSaveToPreset = (id: string) => {
    if (renamingPresetId.value) confirmRename(renamingPresetId.value)
    inventoryStore.saveCurrentToPreset(id)
    addLog('Şimdiki kuşanım düzene saklandı.')
  }

  const handleApplyPreset = (id: string) => {
    if (renamingPresetId.value) confirmRename(renamingPresetId.value)
    const result = inventoryStore.applyEquipmentPreset(id)
    addLog(result.message)
  }

  const handleDeletePreset = (id: string) => {
    if (renamingPresetId.value) confirmRename(renamingPresetId.value)
    inventoryStore.deleteEquipmentPreset(id)
  }

  // === Yüzük yardımcıları ===

  const equippedRing1Name = computed(() => {
    const idx = inventoryStore.equippedRingSlot1
    const ring = inventoryStore.ownedRings[idx]
    if (!ring) return null
    return getRingById(ring.defId)?.name ?? null
  })

  const equippedRing2Name = computed(() => {
    const idx = inventoryStore.equippedRingSlot2
    const ring = inventoryStore.ownedRings[idx]
    if (!ring) return null
    return getRingById(ring.defId)?.name ?? null
  })

  const isRingEquipped = (idx: number): boolean => {
    return inventoryStore.equippedRingSlot1 === idx || inventoryStore.equippedRingSlot2 === idx
  }

  /** Yüzük aynı tanımdan dolayı öbür yuvada engelli mi */
  const isRingBlockedForSlot = (ringIdx: number, slot: 0 | 1): boolean => {
    const otherSlotIdx = slot === 0 ? inventoryStore.equippedRingSlot2 : inventoryStore.equippedRingSlot1
    if (otherSlotIdx < 0 || otherSlotIdx === ringIdx) return false
    if (otherSlotIdx >= inventoryStore.ownedRings.length) return false
    return inventoryStore.ownedRings[ringIdx]?.defId === inventoryStore.ownedRings[otherSlotIdx]?.defId
  }

  /** Yüzük yuvasını değiştir */
  const handleToggleRingSlot = (ringIdx: number, slot: 0 | 1) => {
    const slotRef = slot === 0 ? inventoryStore.equippedRingSlot1 : inventoryStore.equippedRingSlot2
    if (slotRef === ringIdx) {
      inventoryStore.unequipRing(slot)
    } else {
      if (isRingBlockedForSlot(ringIdx, slot)) return
      inventoryStore.equipRing(ringIdx, slot)
    }
  }

  // === Yüzük etkisi görünüşü ===

  const RING_EFFECT_NAMES: Record<RingEffectType, string> = {
    attack_bonus: 'Vuruş gücü',
    crit_rate_bonus: 'Ağır vurma',
    defense_bonus: 'Savunma',
    vampiric: 'Can çekiş',
    max_hp_bonus: 'Azami can',
    stamina_reduction: 'Derman gideri',
    mining_stamina: 'Maden dermanı',
    farming_stamina: 'Tarla dermanı',
    fishing_stamina: 'Av dermanı',
    crop_quality_bonus: 'Ekin niteliği',
    crop_growth_bonus: 'Ekin büyümesi',
    fish_quality_bonus: 'Balık niteliği',
    fishing_calm: 'Balık sükûnu',
    sell_price_bonus: 'Satış artısı',
    shop_discount: 'Pazar indirimi',
    gift_friendship: 'Armağan gönlü',
    monster_drop_bonus: 'Düşürme oranı',
    exp_bonus: 'Deney artısı',
    treasure_find: 'Sandık bahtı',
    ore_bonus: 'Cevher artısı',
    luck: 'Uğur',
    travel_speed: 'Yol hızı'
  }

  const PERCENTAGE_EFFECTS: Set<RingEffectType> = new Set([
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
    'travel_speed'
  ])

  const formatEffectValue = (eff: { type: RingEffectType; value: number }): string => {
    if (PERCENTAGE_EFFECTS.has(eff.type)) return `${Math.round(eff.value * 100)}%`
    return `${eff.value}`
  }

  // === Silah penceresi ===

  const activeWeaponIdx = ref<number | null>(null)

  const activeWeaponDef = computed(() => {
    if (activeWeaponIdx.value === null) return null
    const weapon = inventoryStore.ownedWeapons[activeWeaponIdx.value]
    if (!weapon) return null
    return getWeaponById(weapon.defId) ?? null
  })

  const activeWeaponName = computed(() => {
    if (activeWeaponIdx.value === null) return ''
    const weapon = inventoryStore.ownedWeapons[activeWeaponIdx.value]
    if (!weapon) return ''
    return getWeaponDisplayName(weapon.defId, weapon.enchantmentId)
  })

  const activeWeaponEnchant = computed(() => {
    if (activeWeaponIdx.value === null) return null
    const weapon = inventoryStore.ownedWeapons[activeWeaponIdx.value]
    if (!weapon?.enchantmentId) return null
    return getEnchantmentById(weapon.enchantmentId) ?? null
  })

  const activeWeaponPrice = computed(() => {
    if (activeWeaponIdx.value === null) return 0
    const weapon = inventoryStore.ownedWeapons[activeWeaponIdx.value]
    if (!weapon) return 0
    return getWeaponSellPrice(weapon.defId, weapon.enchantmentId)
  })

  const handleEquipWeapon = () => {
    if (activeWeaponIdx.value === null) return
    inventoryStore.equipWeapon(activeWeaponIdx.value)
    activeWeaponIdx.value = null
  }

  const handleSellWeapon = () => {
    if (activeWeaponIdx.value === null) return
    const result = inventoryStore.sellWeapon(activeWeaponIdx.value)
    addLog(result.message)
    activeWeaponIdx.value = null
  }

  // === Yüzük penceresi ===

  const activeRingIdx = ref<number | null>(null)

  const activeRingDef = computed(() => {
    if (activeRingIdx.value === null) return null
    const ring = inventoryStore.ownedRings[activeRingIdx.value]
    if (!ring) return null
    return getRingById(ring.defId) ?? null
  })

  const handleEquipRingFromPopup = (slot: 0 | 1) => {
    if (activeRingIdx.value === null) return
    if (isRingBlockedForSlot(activeRingIdx.value, slot)) return
    const slotRef = slot === 0 ? inventoryStore.equippedRingSlot1 : inventoryStore.equippedRingSlot2
    if (slotRef === activeRingIdx.value) {
      inventoryStore.unequipRing(slot)
    } else {
      inventoryStore.equipRing(activeRingIdx.value, slot)
    }
  }

  const handleSellRing = () => {
    if (activeRingIdx.value === null) return
    const result = inventoryStore.sellRing(activeRingIdx.value)
    addLog(result.message)
    activeRingIdx.value = null
  }

  // === Başlık yardımcıları ===

  const equippedHatName = computed(() => {
    const idx = inventoryStore.equippedHatIndex
    const hat = inventoryStore.ownedHats[idx]
    if (!hat) return null
    return getHatById(hat.defId)?.name ?? null
  })

  const handleToggleHat = (idx: number) => {
    if (inventoryStore.equippedHatIndex === idx) {
      inventoryStore.unequipHat()
    } else {
      inventoryStore.equipHat(idx)
    }
  }

  // === Başlık penceresi ===

  const activeHatIdx = ref<number | null>(null)

  const activeHatDef = computed(() => {
    if (activeHatIdx.value === null) return null
    const hat = inventoryStore.ownedHats[activeHatIdx.value]
    if (!hat) return null
    return getHatById(hat.defId) ?? null
  })

  const handleToggleHatFromPopup = () => {
    if (activeHatIdx.value === null) return
    handleToggleHat(activeHatIdx.value)
  }

  const handleSellHat = () => {
    if (activeHatIdx.value === null) return
    const result = inventoryStore.sellHat(activeHatIdx.value)
    addLog(result.message)
    activeHatIdx.value = null
  }

  // === Ayaklık yardımcıları ===

  const equippedShoeName = computed(() => {
    const idx = inventoryStore.equippedShoeIndex
    const shoe = inventoryStore.ownedShoes[idx]
    if (!shoe) return null
    return getShoeById(shoe.defId)?.name ?? null
  })

  const handleToggleShoe = (idx: number) => {
    if (inventoryStore.equippedShoeIndex === idx) {
      inventoryStore.unequipShoe()
    } else {
      inventoryStore.equipShoe(idx)
    }
  }

  // === Ayaklık penceresi ===

  const activeShoeIdx = ref<number | null>(null)

  const activeShoeDef = computed(() => {
    if (activeShoeIdx.value === null) return null
    const shoe = inventoryStore.ownedShoes[activeShoeIdx.value]
    if (!shoe) return null
    return getShoeById(shoe.defId) ?? null
  })

  const handleToggleShoeFromPopup = () => {
    if (activeShoeIdx.value === null) return
    handleToggleShoe(activeShoeIdx.value)
  }

  const handleSellShoe = () => {
    if (activeShoeIdx.value === null) return
    const result = inventoryStore.sellShoe(activeShoeIdx.value)
    addLog(result.message)
    activeShoeIdx.value = null
  }

  // === Geçici heybe ===

  const activeTempIdx = ref<number | null>(null)

  const activeTempItem = computed(() => {
    if (activeTempIdx.value === null) return null
    return inventoryStore.tempItems[activeTempIdx.value] ?? null
  })

  const activeTempItemDef = computed(() => {
    if (!activeTempItem.value) return null
    return getItemById(activeTempItem.value.itemId) ?? null
  })

  const handleMoveFromTemp = () => {
    if (activeTempIdx.value === null) return
    const success = inventoryStore.moveFromTemp(activeTempIdx.value)
    if (success) {
      addLog('Eşya heybeye geçirildi.')
      activeTempIdx.value = null
    } else {
      addLog('Heybede yer yetmedi; bazı eşya geçici heybede kaldı.')
    }
  }

  const handleMoveAllFromTemp = () => {
    const moved = inventoryStore.moveAllFromTemp()
    if (moved > 0) {
      addLog(`${moved} kalem eşya geçici heybede iken asıl heybeye geçirildi.`)
    }
    if (inventoryStore.tempItems.length > 0) {
      addLog('Yer yetmediğinden bazı eşya hâlâ geçici heybede duruyor.')
    }
  }

  const handleDiscardTemp = () => {
    if (activeTempIdx.value === null) return
    const item = inventoryStore.tempItems[activeTempIdx.value]
    const name = getItemById(item?.itemId ?? '')?.name ?? ''
    inventoryStore.discardTempItem(activeTempIdx.value)
    addLog(`${name} bırakılıp atıldı.`)
    activeTempIdx.value = null
  }

  // === Eşya penceresi ===

  const activeItemKey = ref<string | null>(null)

  const activeItem = computed(() => {
    if (!activeItemKey.value) return null
    const [itemId, quality] = activeItemKey.value.split(':')
    return inventoryStore.items.find(i => i.itemId === itemId && i.quality === quality) ?? null
  })

  const activeItemDef = computed(() => {
    if (!activeItem.value) return null
    return getItemById(activeItem.value.itemId) ?? null
  })

  /** Aş buff açıklaması */
  const activeItemBuff = computed(() => {
    if (!activeItem.value) return null
    const itemId = activeItem.value.itemId
    if (!itemId.startsWith('food_')) return null
    const recipe = getRecipeById(itemId.slice(5))
    return recipe?.effect.buff ?? null
  })

  const isEdible = (itemId: string): boolean => {
    const def = getItemById(itemId)
    return !!def?.edible && !!def.staminaRestore
  }

  const handleEat = (itemId: string, quality: Quality) => {
    const def = getItemById(itemId)
    if (!def?.edible || !def.staminaRestore) return
    const staminaFull = playerStore.stamina >= playerStore.maxStamina
    const hpFull = playerStore.hp >= playerStore.getMaxHp()
    if (staminaFull && hpFull) {
      addLog('Derman da can da tam; şimdi yemene gerek yok.')
      return
    }

    // Pişmiş aşlar cookingStore.eat() yolundan gider
    if (itemId.startsWith('food_')) {
      const recipeId = itemId.slice(5)
      const result = cookingStore.eat(recipeId, quality)
      if (result.success) {
        addLog(result.message)
      } else {
        addLog(result.message)
      }
      if (!inventoryStore.items.find(i => i.itemId === itemId && i.quality === quality)) {
        activeItemKey.value = null
      }
      return
    }

    if (!inventoryStore.removeItem(itemId, 1, quality)) return
    const alchemistBonus = skillStore.getSkill('foraging').perk10 === 'alchemist' ? 1.5 : 1.0
    const staminaRestore = Math.floor(def.staminaRestore * alchemistBonus)
    playerStore.restoreStamina(staminaRestore)
    let msg = `${def.name} yedin, ${staminaRestore} derman topladın`
    if (def.healthRestore) {
      const healthRestore = Math.floor(def.healthRestore * alchemistBonus)
      playerStore.restoreHealth(healthRestore)
      msg += `, ${healthRestore} can da kazandın`
    }
    msg += '.'
    addLog(msg)
    if (!inventoryStore.items.find(i => i.itemId === itemId && i.quality === quality)) {
      activeItemKey.value = null
    }
  }

  /** Kullanılabilir özel eşyalar */
  const USABLE_ITEMS = new Set(['rain_totem', 'stamina_fruit'])

  const isUsable = (itemId: string): boolean => {
    return USABLE_ITEMS.has(itemId)
  }

  const handleUse = (itemId: string, quality: Quality) => {
    if (itemId === 'rain_totem') {
      if (!inventoryStore.removeItem(itemId, 1, quality)) return
      gameStore.setTomorrowWeather('rainy')
      addLog('Yağmur tılsımını kullandın; yarın yağmur inecek.')
    }
    if (itemId === 'stamina_fruit') {
      if (playerStore.staminaCapLevel >= 4) {
        addLog('Derman sınırı en yüce noktaya vardı; artık kutlu şeftali yenmez.')
        return
      }
      if (!inventoryStore.removeItem(itemId, 1, quality)) return
      playerStore.upgradeMaxStamina()
      addLog(`Kutlu şeftaliyi yedin; derman sınırın kalıcı olarak ${playerStore.maxStamina} oldu!`)
    }
    if (!inventoryStore.items.find(i => i.itemId === itemId && i.quality === quality)) {
      activeItemKey.value = null
    }
  }
</script>
