<template>
  <div>
    <h3 class="text-accent text-sm mb-3 flex items-center justify-between">
      <span>
        <component :is="npcStore.getSpouse() ? Heart : Home" :size="14" class="inline" />
        Hane
      </span>
      <button class="text-muted hover:text-accent transition-colors" @click="showCalendarModal = true">
        <Calendar :size="14" />
      </button>
    </h3>

    <!-- Çiftlik evi yükseltme -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-accent">{{ homeStore.farmhouseName }}</span>
        <span class="text-xs text-muted">Seviye {{ homeStore.farmhouseLevel }}</span>
      </div>
      <p class="text-xs text-muted mb-2">{{ currentBenefit }}</p>
      <div
        v-if="homeStore.nextUpgrade"
        class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
        @click="showUpgradeModal = true"
      >
        <span class="text-xs">“{{ homeStore.nextUpgrade.name }}” düzeyine yükselt</span>
        <span class="text-xs text-accent whitespace-nowrap">{{ homeStore.nextUpgrade.cost }} akçe</span>
      </div>
    </div>

    <!-- Aile -->
    <div v-if="npcStore.getSpouse()" class="border border-accent/20 rounded-xs p-3 mb-4">
      <p class="text-sm text-accent mb-2">
        <Users :size="14" class="inline" />
        Aile
      </p>

      <!-- Eş etkileşimi -->
      <div class="border border-accent/10 rounded-xs p-2 mb-2">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-accent">{{ spouseDef?.name }}</span>
          <span class="text-[10px] text-danger">
            <Heart :size="10" class="inline" />
            Eş
          </span>
        </div>
        <div v-if="spouseDialogue" class="border border-accent/10 rounded-xs p-2 mb-1.5">
          <p class="text-[10px] text-accent mb-0.5">“{{ spouseDef?.name }}”</p>
          <p class="text-xs">{{ spouseDialogue }}</p>
        </div>
        <div class="flex space-x-1.5">
          <Button
            class="flex-1 justify-center py-0.5"
            :icon="MessageCircle"
            :icon-size="10"
            :disabled="spouseState?.talkedToday"
            @click="handleSpouseTalk"
          >
            {{ spouseState?.talkedToday ? 'Bugün konuşuldu' : 'Konuş' }}
          </Button>
          <Button
            class="flex-1 justify-center py-0.5"
            :icon="Gift"
            :icon-size="10"
            :disabled="spouseState?.giftedToday || (spouseState?.giftsThisWeek ?? 0) >= 2"
            @click="showSpouseGiftModal = true"
          >
            {{ spouseState?.giftedToday ? 'Hediye verildi' : (spouseState?.giftsThisWeek ?? 0) >= 2 ? 'Bu hafta dolu' : 'Hediye ver' }}
          </Button>
        </div>
      </div>

      <!-- Teklif bildirimi -->
      <div v-if="npcStore.childProposalPending" class="border border-accent/30 rounded-xs p-2 mb-2">
        <p class="text-xs text-accent mb-1.5">Eşinin söylemek istediği bir söz var…</p>
        <Button class="w-full justify-center" @click="showChildProposalDialog">Cevap ver</Button>
      </div>

      <!-- Gebelik paneli -->
      <div v-if="npcStore.pregnancy" class="border border-success/20 rounded-xs p-2 mb-2">
        <p class="text-xs text-success mb-2">Gebelik · {{ PREGNANCY_STAGE_LABELS[npcStore.pregnancy.stage] }}</p>
        <!-- Evre ilerleme çubuğu -->
        <div class="flex items-center space-x-1 mb-1.5">
          <span class="text-[10px] text-muted w-8 shrink-0">Süreç</span>
          <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
            <div
              class="h-full rounded-xs bg-success transition-all"
              :style="{ width: Math.floor((npcStore.pregnancy.daysInStage / npcStore.pregnancy.stageDays) * 100) + '%' }"
            />
          </div>
          <span class="text-[10px] text-muted shrink-0">{{ npcStore.pregnancy.daysInStage }}/{{ npcStore.pregnancy.stageDays }} gün</span>
        </div>
        <!-- Sağ salim doğum oranı -->
        <div class="flex items-center space-x-1 mb-2">
          <span class="text-[10px] text-muted w-8 shrink-0">Esenlik</span>
          <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
            <div
              class="h-full rounded-xs transition-all"
              :class="npcStore.pregnancy.careScore >= 70 ? 'bg-success' : npcStore.pregnancy.careScore >= 40 ? 'bg-accent' : 'bg-danger'"
              :style="{ width: npcStore.pregnancy.careScore + '%' }"
            />
          </div>
          <span class="text-[10px] text-muted shrink-0">{{ npcStore.pregnancy.careScore }}%</span>
        </div>
        <!-- Evre ipucu -->
        <p class="text-[10px] text-muted/60 mb-2">{{ STAGE_TIPS[npcStore.pregnancy.stage] }}</p>
        <!-- Bakım işlemleri -->
        <div class="grid grid-cols-2 gap-1 mb-1">
          <Button
            class="py-0.5 px-1 text-[10px] justify-center"
            :disabled="npcStore.pregnancy.giftedForPregnancy"
            @click="handlePregnancyCare('gift')"
          >
            {{ npcStore.pregnancy.giftedForPregnancy ? 'Hediye verildi' : 'Armağan sun' }}
          </Button>
          <Button
            class="py-0.5 px-1 text-[10px] justify-center"
            :disabled="npcStore.pregnancy.companionToday"
            @click="handlePregnancyCare('companion')"
          >
            {{ npcStore.pregnancy.companionToday ? 'Bugün eşlik edildi' : 'Yanında otur' }}
          </Button>
          <Button class="py-0.5 px-1 text-[10px] justify-center" @click="handlePregnancyCare('supplement')">Şifa ver</Button>
          <Button
            class="py-0.5 px-1 text-[10px] justify-center"
            :disabled="npcStore.pregnancy.caredToday"
            @click="handlePregnancyCare('rest')"
          >
            {{ npcStore.pregnancy.caredToday ? 'Dinlendi' : 'Dinlenme ayarla' }}
          </Button>
        </div>
        <!-- Doğum seçeneği (bekleyiş evresi) -->
        <div v-if="npcStore.pregnancy.stage === 'ready'" class="border border-accent/20 rounded-xs p-2 mt-2">
          <p class="text-[10px] text-accent mb-1.5">Doğum yolunu seç</p>
          <div v-if="!npcStore.pregnancy.medicalPlan" class="flex flex-col space-y-1">
            <Button class="py-0.5 px-1 text-[10px] w-full justify-center" @click="handleChooseMedical('normal')">
              Olağan doğum yardımı (1000 akçe · %80 güven)
            </Button>
            <Button class="py-0.5 px-1 text-[10px] w-full justify-center" @click="handleChooseMedical('advanced')">
              Usta ebe yardımı (5000 akçe · %95 güven)
            </Button>
            <Button class="py-0.5 px-1 text-[10px] w-full justify-center text-accent" @click="handleChooseMedical('luxury')">
              Saray usulü doğum (15000 akçe · %100 güven)
            </Button>
          </div>
          <p v-else class="text-[10px] text-success">Seçildi: {{ MEDICAL_LABELS[npcStore.pregnancy.medicalPlan] }}</p>
        </div>
      </div>

      <!-- Çocuk yok, gebelik yok -->
      <div v-if="npcStore.children.length === 0 && !npcStore.pregnancy && !npcStore.childProposalPending">
        <div class="flex flex-col items-center justify-center py-6 text-muted">
          <Users :size="32" class="mb-2" />
          <p class="text-xs">Yuvanız huzurlu; belki bir gün yeni bir can gelir.</p>
        </div>
      </div>

      <!-- Çocuk listesi -->
      <div v-if="npcStore.children.length > 0" class="flex flex-col space-y-1">
        <div v-for="child in npcStore.children" :key="child.id" class="border border-accent/10 rounded-xs p-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-accent">
              {{ child.name }}
              <span v-if="child.birthQuality === 'healthy'" class="text-[10px] text-success ml-0.5">[Sağlıklı]</span>
              <span v-else-if="child.birthQuality === 'premature'" class="text-[10px] text-muted/60 ml-0.5">[Erken doğum]</span>
            </span>
            <div class="flex items-center space-x-1">
              <Button
                v-if="child.stage !== 'baby' && !child.interactedToday"
                class="py-0 px-1"
                :icon="Heart"
                @click="handleInteractChild(child.id)"
              >
                İlgilen
              </Button>
              <span v-else-if="child.stage !== 'baby'" class="text-xs text-muted">Bugün ilgilenildi</span>
              <span v-else class="text-xs text-muted">Henüz çok küçük</span>
              <Button class="py-0 px-1 text-danger" @click="releaseConfirmChildId = child.id">Uğurla</Button>
            </div>
          </div>
          <p class="text-[10px] text-muted mb-0.5">{{ CHILD_STAGE_NAMES[child.stage] }} · {{ child.daysOld }} gün</p>
          <div v-if="child.stage !== 'baby'" class="flex items-center space-x-0.5">
            <Heart
              v-for="h in 10"
              :key="h"
              :size="10"
              class="flex-shrink-0"
              :class="child.friendship >= h * 30 ? 'text-danger' : 'text-muted/30'"
              :fill="child.friendship >= h * 30 ? 'currentColor' : 'none'"
            />
          </div>
        </div>
      </div>
      <!-- Çocuğu gönderme onayı -->
      <div v-if="releaseConfirmChildId !== null" class="mt-2 game-panel border-danger/40">
        <p class="text-xs text-danger mb-2">{{ getChildName(releaseConfirmChildId) }} çocuğunu uzak akrabaların yanına göndermek istediğine emin misin? (10000 akçe)</p>
        <div class="grid grid-cols-2 gap-2">
          <Button class="text-danger" @click="handleReleaseChild">Onayla</Button>
          <Button @click="releaseConfirmChildId = null">Vazgeç</Button>
        </div>
      </div>
    </div>

    <!-- İşçi yönetimi -->
    <div class="border border-accent/20 rounded-xs p-3 mb-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-accent">
          <Hammer :size="14" class="inline" />
          Yevmiyeciler
        </p>
        <Button v-if="currentHelpers.length < 2" class="py-0 px-1.5" :icon="UserPlus" :icon-size="12" @click="showHireModal = true">
          Tut
        </Button>
      </div>
      <p class="text-xs text-muted mb-2">gaKöy halkından, gönlü en az 4 kalp olan kişileri günlük işlere tutabilirsin. Her gün yevmiye ödenir.</p>

      <!-- Mevcut işçiler -->
      <div v-if="currentHelpers.length > 0" class="flex flex-col space-y-1 mb-2">
        <div
          v-for="h in currentHelpers"
          :key="h.npcId"
          class="flex items-center justify-between border border-accent/10 rounded-xs px-3 py-1.5"
        >
          <div>
            <span class="text-xs text-accent">{{ getNpcById(h.npcId)?.name }}</span>
            <span class="text-xs text-muted ml-1">{{ npcStore.HELPER_TASK_NAMES[h.task] }}</span>
          </div>
          <div class="flex items-center space-x-1.5">
            <span class="text-[10px] text-muted">{{ h.dailyWage }} akçe/gün</span>
            <Button class="py-0 px-1 btn-danger" :icon="X" :icon-size="10" @click="dismissConfirmNpcId = h.npcId" />
          </div>
        </div>
      </div>
      <div v-if="currentHelpers.length === 0" class="flex flex-col items-center justify-center py-6 text-muted">
        <Hammer :size="32" class="mb-2" />
        <p class="text-xs">Henüz tutulan kimse yok</p>
      </div>
    </div>

    <!-- Mahzen -->
    <div v-if="homeStore.hasCellar" class="border border-accent/20 rounded-xs p-3">
      <p class="text-sm text-accent mb-2">
        <Gem :size="14" class="inline" />
        Mahzen
      </p>
      <div v-if="homeStore.cellarSlots.length > 0" class="flex flex-col space-y-1.5 mb-3">
        <div v-for="(slot, idx) in homeStore.cellarSlots" :key="idx" class="border border-accent/10 rounded-xs p-2">
          <div class="flex items-center justify-between mb-1">
            <span
              class="text-xs"
              :class="{
                'text-quality-fine': slot.quality === 'fine',
                'text-quality-excellent': slot.quality === 'excellent',
                'text-quality-supreme': slot.quality === 'supreme',
                'text-accent': slot.quality === 'normal'
              }"
            >
              {{ getItemName(slot.itemId) }}
            </span>
            <Button class="py-0 px-1" @click="removeAgingConfirmIdx = idx">Çıkar</Button>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-[10px] text-muted w-6">Dem</span>
            <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
              <div
                class="h-full rounded-xs bg-accent transition-all"
                :style="{ width: Math.min(100, Math.floor((slot.daysAging / 14) * 100)) + '%' }"
              />
            </div>
            <span class="text-[10px] text-muted">{{ slot.daysAging }}/14 gün</span>
          </div>
        </div>
      </div>
      <div v-if="homeStore.cellarSlots.length === 0" class="flex flex-col items-center justify-center py-6 text-muted mb-3">
        <Gem :size="32" class="mb-2" />
        <p class="text-xs">Mahzen bomboş</p>
      </div>

      <!-- Yeni içki koy -->
      <Button class="w-full" v-if="homeStore.cellarSlots.length < 6 && ageableInInventory.length > 0" @click="showAgingModal = true">
        Demlenmeye Koy
      </Button>
    </div>

    <!-- Çiftlik evi yükseltme penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showUpgradeModal && homeStore.nextUpgrade"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showUpgradeModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showUpgradeModal = false">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">Çiftlik Evini Yükselt</p>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs">“{{ homeStore.nextUpgrade.name }}” düzeyine çıkacak</p>
            <p class="text-xs text-muted mt-0.5">{{ homeStore.nextUpgrade.description }}</p>
          </div>

          <div class="border border-accent/10 rounded-xs p-2 mb-2 space-y-1">
            <p class="text-xs text-muted mb-1">Gerekli malzeme</p>
            <div v-for="mat in homeStore.nextUpgrade.materialCost" :key="mat.itemId" class="flex items-center justify-between">
              <span class="text-xs text-muted">{{ getItemName(mat.itemId) }}</span>
              <span class="text-xs" :class="getCombinedItemCount(mat.itemId) >= mat.quantity ? '' : 'text-danger'">
                {{ getCombinedItemCount(mat.itemId) }}/{{ mat.quantity }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Akçe</span>
              <span class="text-xs" :class="playerStore.money >= homeStore.nextUpgrade.cost ? '' : 'text-danger'">
                {{ homeStore.nextUpgrade.cost }} akçe
              </span>
            </div>
          </div>

          <Button
            class="w-full justify-center"
            :class="{ '!bg-accent !text-bg': canUpgradeFarmhouse }"
            :disabled="!canUpgradeFarmhouse"
            :icon="ArrowUp"
            :icon-size="12"
            @click="handleUpgradeFromModal"
          >
            Yükselt
          </Button>
        </div>
      </div>
    </Transition>

    <!-- Mahzene koyulacaklar listesi -->
    <Transition name="panel-fade">
      <div
        v-if="showAgingModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showAgingModal = false"
      >
        <div class="game-panel max-w-xs w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">Demlenmeye Koy</p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="showAgingModal = false" />
          </div>
          <div class="flex flex-col space-y-1">
            <div
              v-for="item in ageableInInventory"
              :key="item.itemId + item.quality"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="handleStartAgingFromModal(item.itemId, item.quality)"
            >
              <span
                class="text-xs"
                :class="{
                  'text-quality-fine': item.quality === 'fine',
                  'text-quality-excellent': item.quality === 'excellent',
                  'text-quality-supreme': item.quality === 'supreme'
                }"
              >
                {{ getItemName(item.itemId) }}
              </span>
              <span class="text-xs text-muted">&times;{{ item.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Takvim penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showCalendarModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showCalendarModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showCalendarModal = false">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">
            <Calendar :size="14" class="inline" />
            Takvim
          </p>

          <!-- Mevsim seçimi -->
          <div class="grid grid-cols-4 gap-2 mb-2">
            <button
              v-for="s in SEASONS"
              :key="s"
              class="text-[10px] px-2 py-0.5 border rounded-xs transition-colors"
              :class="calendarSeason === s ? 'bg-accent/20 border-accent/40 text-accent' : 'border-accent/10 text-muted hover:text-text'"
              @click="handleSelectSeason(s)"
            >
              {{ SEASON_NAMES[s] }}
            </button>
          </div>

          <!-- 28 günlük ızgara -->
          <div class="grid grid-cols-7 gap-px">
            <div v-for="wd in WEEKDAYS" :key="wd" class="text-center py-0.5">
              <span class="text-[10px]" :class="wd === 'sat' || wd === 'sun' ? 'text-accent' : 'text-muted'">{{ WEEKDAY_NAMES[wd] }}</span>
            </div>
            <div
              v-for="entry in calendarDays"
              :key="entry.day"
              class="text-center py-1 border border-transparent transition-colors"
              :class="[
                entry.isToday ? 'bg-accent/20 border-accent/40' : '',
                entry.festivals.length > 0 || entry.birthdays.length > 0 ? 'cursor-pointer hover:bg-accent/10 rounded-sm' : '',
                selectedCalendarDay === entry.day ? 'border-accent/30' : ''
              ]"
              @click="handleSelectDay(entry)"
            >
              <span class="text-[10px]" :class="entry.isToday ? 'text-accent' : 'text-muted'">
                {{ entry.day }}
              </span>
              <div class="flex justify-center space-x-px mt-px min-h-1.5">
                <span v-if="entry.festivals.length > 0" class="w-1 h-1 rounded-full bg-danger inline-block" />
                <span v-if="entry.birthdays.length > 0" class="w-1 h-1 rounded-full bg-success inline-block" />
              </div>
            </div>
          </div>

          <!-- Gösterge -->
          <div class="flex items-center space-x-3 mt-1.5">
            <span class="text-[10px] text-muted flex items-center space-x-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-danger inline-block" />
              <span>Şenlik</span>
            </span>
            <span class="text-[10px] text-muted flex items-center space-x-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              <span>Doğum günü</span>
            </span>
          </div>

          <!-- Seçili gün ayrıntısı -->
          <div
            v-if="selectedDayEntry && (selectedDayEntry.festivals.length > 0 || selectedDayEntry.birthdays.length > 0)"
            class="border border-accent/10 rounded-xs p-2 mt-2"
          >
            <p class="text-[10px] text-accent mb-1">
              {{ SEASON_NAMES[calendarSeason] }} {{ selectedCalendarDay }}. gün
              <span v-if="selectedDayEntry.isToday" class="text-danger ml-1">(bugün)</span>
            </p>
            <div v-for="f in selectedDayEntry.festivals" :key="f.name" class="mb-0.5">
              <span class="text-[10px] text-danger">{{ f.name }}</span>
              <span class="text-[10px] text-muted ml-1">{{ f.description }}</span>
            </div>
            <div v-for="b in selectedDayEntry.birthdays" :key="b.npcName">
              <span class="text-[10px] text-success">{{ b.npcName }} bugün doğmuş</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Eşe hediye verme penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showSpouseGiftModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showSpouseGiftModal = false"
      >
        <div class="game-panel max-w-sm w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">{{ spouseDef?.name }} için hediye seç</p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="showSpouseGiftModal = false" />
          </div>
          <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
            <div
              v-for="item in spouseGiftableItems"
              :key="item.itemId + item.quality"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="handleSpouseGift(item.itemId, item.quality)"
            >
              <span class="flex items-center space-x-1">
                <span class="text-xs" :class="qualityTextClass(item.quality)">
                  {{ getItemById(item.itemId)?.name }}
                </span>
                <span
                  v-if="getSpouseGiftPref(item.itemId) !== 'neutral'"
                  class="text-[10px]"
                  :class="GIFT_PREF_CLASS[getSpouseGiftPref(item.itemId)]"
                >
                  {{ GIFT_PREF_LABELS[getSpouseGiftPref(item.itemId)] }}
                </span>
              </span>
              <span class="text-xs text-muted">&times;{{ item.quantity }}</span>
            </div>
          </div>
          <div v-if="spouseGiftableItems.length === 0" class="py-4 text-center text-xs text-muted">Çantada sunulacak bir eşya yok</div>
        </div>
      </div>
    </Transition>

    <!-- İşçi tutma penceresi -->
    <Transition name="panel-fade">
      <div v-if="showHireModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" @click.self="closeHireModal">
        <div class="game-panel max-w-sm w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">Yevmiyeci Tut</p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="closeHireModal" />
          </div>

          <!-- İş seçimi -->
          <p class="text-xs text-muted mb-1">Görevi seç</p>
          <div class="grid grid-cols-4 gap-1 mb-3">
            <button
              v-for="(label, key) in npcStore.HELPER_TASK_NAMES"
              :key="key"
              class="text-xs py-1 rounded-xs border"
              :class="selectedHireTask === key ? 'border-accent text-accent' : 'border-accent/20 text-muted'"
              @click="selectHireTask(key as FarmHelperTask)"
            >
              {{ label }}
            </button>
          </div>
          <p class="text-xs text-muted mb-2">Günlük yevmiye: {{ npcStore.HELPER_WAGES[selectedHireTask] }} akçe</p>

          <!-- Tutma onayı -->
          <div v-if="hireConfirmNpc" class="border border-accent/30 rounded-xs p-3 mb-2">
            <p class="text-xs text-accent mb-2">
              <span class="text-text">{{ hireConfirmNpc.name }}</span>
              kişisini
              <span class="text-text">{{ npcStore.HELPER_TASK_NAMES[selectedHireTask] }}</span>
              işi için tutmak ister misin?
            </p>
            <p class="text-[10px] text-muted mb-2">Günlük yevmiye: {{ npcStore.HELPER_WAGES[selectedHireTask] }} akçe</p>
            <div class="flex space-x-2">
              <Button class="py-0.5 px-2 text-xs" @click="handleHire(hireConfirmNpcId!)">Tut</Button>
              <Button class="py-0.5 px-2 text-xs" @click="hireConfirmNpcId = null">Vazgeç</Button>
            </div>
          </div>

          <!-- Uygun köylüler -->
          <div v-else class="flex flex-col space-y-1 max-h-48 overflow-y-auto">
            <div
              v-for="npc in hireableNpcs"
              :key="npc.npcId"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="hireConfirmNpcId = npc.npcId"
            >
              <span class="text-xs">{{ npc.name }}</span>
              <span class="text-[10px] text-muted">
                <Heart :size="10" class="inline" />
                {{ Math.floor(npc.friendship / 250) }} kalp
              </span>
            </div>
          </div>
          <p v-if="!hireConfirmNpc && hireableNpcs.length === 0" class="text-xs text-muted text-center py-3">
            Tutulacak köylü yok (gönül bağı ≥ 4 kalp olmalı, eş ya da sırdaş olmamalı)
          </p>
        </div>
      </div>
    </Transition>

    <!-- İşçiyi çıkarma onayı -->
    <Transition name="panel-fade">
      <div
        v-if="dismissConfirmNpcId"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="dismissConfirmNpcId = null"
      >
        <div class="game-panel max-w-xs w-full text-center">
          <p class="text-sm text-danger mb-3">{{ getNpcById(dismissConfirmNpcId)?.name }} kişisini işten çıkarmak istediğine emin misin?</p>
          <p class="text-xs text-muted mb-4">Sonra yeniden tutman gerekir.</p>
          <div class="flex space-x-3 justify-center">
            <Button @click="dismissConfirmNpcId = null">Vazgeç</Button>
            <Button class="btn-danger" @click="handleDismiss(dismissConfirmNpcId!)">İşten çıkar</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mahzenden çıkarma onayı -->
    <Transition name="panel-fade">
      <div
        v-if="removeAgingConfirmSlot"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="removeAgingConfirmIdx = null"
      >
        <div class="game-panel max-w-xs w-full text-center">
          <p class="text-sm text-accent mb-3">{{ getItemName(removeAgingConfirmSlot.itemId) }} çıkarılsın mı?</p>
          <p class="text-xs text-muted mb-4">{{ removeAgingConfirmSlot.daysAging }} gündür demleniyor, 14 gün dolunca niteliği yükselir.</p>
          <div class="flex space-x-3 justify-center">
            <Button @click="removeAgingConfirmIdx = null">Vazgeç</Button>
            <Button @click="handleRemoveAging(removeAgingConfirmIdx!)">Çıkar</Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ArrowUp, Calendar, Gem, Gift, Hammer, Home, Heart, MessageCircle, UserPlus, Users, X } from 'lucide-vue-next'
  import { useCookingStore } from '@/stores/useCookingStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useHomeStore } from '@/stores/useHomeStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { useNpcStore } from '@/stores/useNpcStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { SEASON_NAMES } from '@/stores/useGameStore'
  import { getCombinedItemCount } from '@/composables/useCombinedInventory'
  import { getItemById, getNpcById, NPCS } from '@/data'
  import { SEASON_EVENTS } from '@/data/events'
  import { ACTION_TIME_COSTS, WEEKDAYS, WEEKDAY_NAMES } from '@/data/timeConstants'
  import type { Quality, ChildStage, PregnancyStage, Season, FarmHelperTask } from '@/types'
  import { addLog } from '@/composables/useGameLog'
  import { showChildProposal, triggerHeartEvent } from '@/composables/useDialogs'
  import { handleEndDay } from '@/composables/useEndDay'
  import Button from '@/components/game/Button.vue'

  const homeStore = useHomeStore()
  const inventoryStore = useInventoryStore()
  const gameStore = useGameStore()
  const npcStore = useNpcStore()
  const playerStore = usePlayerStore()

  const releaseConfirmChildId = ref<number | null>(null)
  const showUpgradeModal = ref(false)
  const showAgingModal = ref(false)
  const showCalendarModal = ref(false)
  const showSpouseGiftModal = ref(false)
  const showHireModal = ref(false)
  const selectedHireTask = ref<FarmHelperTask>('water')
  const hireConfirmNpcId = ref<string | null>(null)
  const dismissConfirmNpcId = ref<string | null>(null)
  const removeAgingConfirmIdx = ref<number | null>(null)
  const removeAgingConfirmSlot = computed(() =>
    removeAgingConfirmIdx.value !== null ? (homeStore.cellarSlots[removeAgingConfirmIdx.value] ?? null) : null
  )

  const hireableNpcs = computed(() => npcStore.getHireableNpcs())
  const currentHelpers = computed(() => npcStore.hiredHelpers)
  const hireConfirmNpc = computed(() => (hireConfirmNpcId.value ? getNpcById(hireConfirmNpcId.value) : null))

  const handleHire = (npcId: string) => {
    const result = npcStore.hireHelper(npcId, selectedHireTask.value)
    addLog(result.message)
    if (result.success) {
      hireConfirmNpcId.value = null
      showHireModal.value = false
    }
  }

  const closeHireModal = () => {
    showHireModal.value = false
    hireConfirmNpcId.value = null
  }

  const selectHireTask = (task: FarmHelperTask) => {
    selectedHireTask.value = task
    hireConfirmNpcId.value = null
  }

  const handleDismiss = (npcId: string) => {
    const result = npcStore.dismissHelper(npcId)
    addLog(result.message)
    dismissConfirmNpcId.value = null
  }

  // === Eş etkileşimi ===

  const spouseState = computed(() => npcStore.getSpouse())
  const spouseDef = computed(() => (spouseState.value ? getNpcById(spouseState.value.npcId) : null))
  const spouseDialogue = ref<string | null>(null)

  const handleSpouseTalk = () => {
    if (!spouseState.value) return
    if (gameStore.isPastBedtime) {
      addLog('Gece çok ilerledi, artık dinlenmek gerek.')
      handleEndDay()
      return
    }
    const result = npcStore.talkTo(spouseState.value.npcId)
    if (result) {
      spouseDialogue.value = result.message
      addLog(`${spouseDef.value?.name} ile konuşuldu.(+${result.friendshipGain} gönül bağı)`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.talk)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) {
        handleEndDay()
        return
      }
      const heartEvent = npcStore.checkHeartEvent(spouseState.value.npcId)
      if (heartEvent) triggerHeartEvent(heartEvent)
    }
  }

  type GiftPreference = 'loved' | 'liked' | 'hated' | 'neutral'

  const getSpouseGiftPref = (itemId: string): GiftPreference => {
    if (!spouseDef.value) return 'neutral'
    if (spouseDef.value.lovedItems.includes(itemId)) return 'loved'
    if (spouseDef.value.likedItems.includes(itemId)) return 'liked'
    if (spouseDef.value.hatedItems.includes(itemId)) return 'hated'
    return 'neutral'
  }

  const GIFT_PREF_LABELS: Record<GiftPreference, string> = { loved: 'En sevdiği', liked: 'Sever', hated: 'Hiç sevmez', neutral: '' }
  const GIFT_PREF_CLASS: Record<GiftPreference, string> = { loved: 'text-danger', liked: 'text-success', hated: 'text-muted', neutral: '' }
  const GIFT_PREF_ORDER: Record<GiftPreference, number> = { loved: 0, liked: 1, neutral: 2, hated: 3 }

  const spouseGiftableItems = computed(() => {
    const filtered = inventoryStore.items.filter(i => {
      const def = getItemById(i.itemId)
      return def && def.category !== 'seed'
    })
    if (!spouseDef.value) return filtered
    return [...filtered].sort((a, b) => GIFT_PREF_ORDER[getSpouseGiftPref(a.itemId)] - GIFT_PREF_ORDER[getSpouseGiftPref(b.itemId)])
  })

  const handleSpouseGift = (itemId: string, quality: Quality) => {
    if (!spouseState.value) return
    const cookingStore = useCookingStore()
    const cookingGiftBonus = cookingStore.activeBuff?.type === 'giftBonus' ? cookingStore.activeBuff.value : 1
    const ringGiftBonus = inventoryStore.getRingEffectValue('gift_friendship')
    const giftMultiplier = cookingGiftBonus * (1 + ringGiftBonus)
    const result = npcStore.giveGift(spouseState.value.npcId, itemId, giftMultiplier, quality)
    if (result) {
      const itemName = getItemById(itemId)?.name ?? itemId
      const name = spouseDef.value?.name
      if (result.gain > 0) {
        addLog(`${name} kişisine ${itemName} sunuldu, ${name} bunu ${result.reaction} buldu.(+${result.gain} gönül bağı)`)
      } else if (result.gain < 0) {
        addLog(`${name} kişisine ${itemName} sunuldu, ${name} buna ${result.reaction} baktı…(${result.gain} gönül bağı)`)
      } else {
        addLog(`${name} kişisine ${itemName} sunuldu, ${name} bunu ${result.reaction} buldu.`)
      }
      showSpouseGiftModal.value = false
      const heartEvent = npcStore.checkHeartEvent(spouseState.value.npcId)
      if (heartEvent) triggerHeartEvent(heartEvent)
    }
  }

  const qualityTextClass = (q: Quality): string => {
    if (q === 'fine') return 'text-quality-fine'
    if (q === 'excellent') return 'text-quality-excellent'
    if (q === 'supreme') return 'text-quality-supreme'
    return ''
  }

  const CHILD_STAGE_NAMES: Record<ChildStage, string> = {
    baby: 'Bebek',
    toddler: 'Yürümeye başlayan',
    child: 'Çocuk',
    teen: 'Delikanlı / Genç kız'
  }

  const PREGNANCY_STAGE_LABELS: Record<PregnancyStage, string> = {
    early: 'İlk dönem (besine ihtiyaç var)',
    mid: 'Orta dönem (eşlik gerek)',
    late: 'Son dönem (dinlenme gerek)',
    ready: 'Doğuma hazır (hazırlık vakti)'
  }

  const STAGE_TIPS: Record<PregnancyStage, string> = {
    early: 'İlk dönemde besine dikkat gerek; yiyecekler ve şifalı destekler çok fayda verir.',
    mid: 'Orta dönemde daha çok eşlik gerekir; konuşup yanında bulunmak güveni artırır.',
    late: 'Son dönemde dinlenmek önemlidir; eşin rahat etsin.',
    ready: 'Doğum yakındır; yardım yolunu seçip son hazırlıkları yap.'
  }

  const MEDICAL_LABELS: Record<string, string> = {
    normal: 'Olağan ebe yardımı',
    advanced: 'Usta ebe yardımı',
    luxury: 'Saray usulü yardım'
  }

  const AGEABLE_ITEMS = ['watermelon_wine', 'osmanthus_wine', 'peach_wine', 'jujube_wine', 'corn_wine', 'rice_vinegar']

  // === Takvim ===

  const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']
  const calendarSeason = ref<Season>(gameStore.season)
  const selectedCalendarDay = ref<number | null>(null)

  const calendarDays = computed(() => {
    const s = calendarSeason.value
    const entries = []
    for (let d = 1; d <= 28; d++) {
      const festivals = SEASON_EVENTS.filter(e => e.season === s && e.day === d).map(e => ({ name: e.name, description: e.description }))
      const birthdays = NPCS.filter(npc => npc.birthday?.season === s && npc.birthday?.day === d).map(npc => ({ npcName: npc.name }))
      entries.push({ day: d, festivals, birthdays, isToday: s === gameStore.season && d === gameStore.day })
    }
    return entries
  })

  const selectedDayEntry = computed(() => {
    if (selectedCalendarDay.value === null) return null
    return calendarDays.value[selectedCalendarDay.value - 1] ?? null
  })

  const handleSelectSeason = (s: Season) => {
    calendarSeason.value = s
    selectedCalendarDay.value = null
  }

  const handleSelectDay = (entry: { day: number; festivals: { name: string }[]; birthdays: { npcName: string }[] }) => {
    if (entry.festivals.length > 0 || entry.birthdays.length > 0) {
      selectedCalendarDay.value = selectedCalendarDay.value === entry.day ? null : entry.day
    }
  }

  const currentBenefit = computed(() => {
    switch (homeStore.farmhouseLevel) {
      case 0:
        return 'Mütevazı bir kulübe.'
      case 1:
        return 'Ocak büyüdü, pişen yemekler +%20 daha çok toparlar.'
      case 2:
        return 'Ev genişledi, her gece ek %10 dayanıklılık yenilenir.'
      case 3:
        return 'Yeraltı mahzeni açıldı, içkiler demlenip niteliği yükselir.'
      default:
        return ''
    }
  })

  const canUpgradeFarmhouse = computed(() => {
    const upgrade = homeStore.nextUpgrade
    if (!upgrade) return false
    if (playerStore.money < upgrade.cost) return false
    return upgrade.materialCost.every(mat => getCombinedItemCount(mat.itemId) >= mat.quantity)
  })

  const ageableInInventory = computed(() => {
    return inventoryStore.items.filter(inv => AGEABLE_ITEMS.includes(inv.itemId) && inv.quality !== 'supreme')
  })

  const getItemName = (itemId: string): string => {
    return getItemById(itemId)?.name ?? itemId
  }

  const getChildName = (childId: number): string => {
    return npcStore.children.find(c => c.id === childId)?.name ?? 'Çocuk'
  }

  // === İşlemler ===

  const handleUpgradeFromModal = () => {
    const upgrade = homeStore.nextUpgrade
    if (!upgrade) return
    if (homeStore.upgradeFarmhouse()) {
      addLog(`Çiftlik evi “${upgrade.name}” düzeyine çıktı! ${upgrade.description}`)
      showUpgradeModal.value = false
    } else {
      addLog('Akçe ya da malzeme yetmediği için yükseltilemedi.')
    }
  }

  const handleInteractChild = (childId: number) => {
    const result = npcStore.interactWithChild(childId)
    if (result) {
      addLog(result.message)
      if (result.item) {
        inventoryStore.addItem(result.item)
        const itemDef = getItemById(result.item)
        addLog(`${itemDef?.name ?? result.item} kazanıldı!`)
      }
    }
  }

  const handleReleaseChild = () => {
    if (releaseConfirmChildId.value === null) return
    const result = npcStore.releaseChild(releaseConfirmChildId.value)
    addLog(result.message)
    releaseConfirmChildId.value = null
  }

  const showChildProposalDialog = () => {
    showChildProposal()
  }

  const handlePregnancyCare = (action: 'gift' | 'companion' | 'supplement' | 'rest') => {
    const result = npcStore.performPregnancyCare(action)
    addLog(result.message)
    if (result.careGain > 0) addLog(`Esenlik +${result.careGain}%`)
  }

  const handleChooseMedical = (plan: 'normal' | 'advanced' | 'luxury') => {
    const result = npcStore.chooseMedicalPlan(plan)
    addLog(result.message)
  }

  const handleStartAgingFromModal = (itemId: string, quality: Quality) => {
    if (homeStore.startAging(itemId, quality)) {
      const name = getItemName(itemId)
      addLog(`${name} mahzende demlenmeye bırakıldı.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.aging)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Mahzene konamadı (yer dolu ya da eşya uygun değil).')
    }
    // Mahzen doluysa ya da elde demlenecek eşya kalmadıysa pencereyi kapat
    if (homeStore.cellarSlots.length >= 6 || ageableInInventory.value.length === 0) {
      showAgingModal.value = false
    }
  }

  const handleRemoveAging = (index: number) => {
    const result = homeStore.removeAging(index)
    if (result) {
      inventoryStore.addItem(result.itemId, 1, result.quality)
      const name = getItemName(result.itemId)
      addLog(`${name} mahzenden çıkarıldı.`)
    }
    removeAgingConfirmIdx.value = null
  }
</script>
