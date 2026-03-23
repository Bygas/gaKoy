<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-accent text-sm">
        <Home :size="14" class="inline" />
        Ağıl
      </h3>
      <Button v-if="unpettedCount > 0" :icon="Hand" @click="handlePetAll">Birlikte Sev ({{ unpettedCount }} baş)</Button>
    </div>

    <p v-if="tutorialHint" class="text-[10px] text-muted/50 mb-2">{{ tutorialHint }}</p>

    <!-- Evcil dost bölümü -->
    <div class="mb-4 border border-accent/20 rounded-xs p-3">
      <p class="text-xs text-muted mb-2">Evcil dost</p>
      <template v-if="animalStore.pet">
        <div class="flex items-center justify-between mb-1">
          <div class="flex items-center space-x-1">
            <template v-if="renamingId === 'pet'">
              <input
                v-model="renameInput"
                class="bg-bg border border-accent/30 rounded-xs px-1 py-0.5 text-xs text-text w-20 outline-none"
                maxlength="8"
                @keyup.enter="confirmRename"
                @keyup.escape="cancelRename"
              />
              <Button class="py-0 px-1" @click="confirmRename">Tamam</Button>
              <Button class="py-0 px-1" @click="cancelRename">Vazgeç</Button>
            </template>
            <template v-else>
              <span class="text-xs text-accent">{{ animalStore.pet.type === 'cat' ? 'Kedi' : 'Köpek' }} — {{ animalStore.pet.name }}</span>
              <button class="text-muted hover:text-accent" @click="startRename('pet', animalStore.pet!.name)">
                <Pencil :size="10" />
              </button>
            </template>
          </div>
          <Button class="py-0 px-1" :icon="Hand" :disabled="animalStore.pet.wasPetted" @click="handlePetThePet">
            {{ animalStore.pet.wasPetted ? 'Sevildi' : 'Sev' }}
          </Button>
        </div>
        <div class="flex items-center space-x-1">
          <span class="text-[10px] text-muted w-6">Gönül</span>
          <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
            <div class="h-full rounded-xs bg-danger transition-all" :style="{ width: Math.floor(animalStore.pet.friendship / 10) + '%' }" />
          </div>
          <span class="text-[10px] text-muted">{{ animalStore.pet.friendship }}/1000</span>
        </div>
        <p v-if="animalStore.pet.friendship >= 800" class="text-xs text-success mt-1">Sevgisi çok yüksek; her gün bazen toplama eşyası getirir!</p>
      </template>
      <div v-else class="flex flex-col items-center justify-center py-6 text-muted">
        <Home :size="32" class="mb-2" />
        <p class="text-xs">Henüz bir evcil dost yok</p>
        <p class="text-[10px] mt-1">Yerleştiğin yedinci günde bir küçük can gaKöy'e uğrayacak.</p>
      </div>
    </div>

    <!-- Kümes ve ahır listesi -->
    <div v-for="bDef in mainBuildings" :key="bDef.type" class="mb-4 border border-accent/20 rounded-xs p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-accent">{{ getBuildingDisplayName(bDef.type) }}</span>
        <div v-if="isBuildingBuilt(bDef.type)" class="flex items-center space-x-2">
          <span class="text-xs text-muted">{{ getAnimalsInBuilding(bDef.type).length }}/{{ getBuildingCapacity(bDef.type) }}</span>
          <Button v-if="getBuildingLevel(bDef.type) < 3" :icon="ArrowUp" @click="openUpgradeModal(bDef.type)">Yükselt</Button>
        </div>
        <Button v-else :icon="Hammer" @click="handleBuildBuilding(bDef.type)">Kur ({{ bDef.cost }} akçe)</Button>
      </div>

      <template v-if="isBuildingBuilt(bDef.type)">
        <p v-if="animalStore.hasAutoPetter(bDef.type)" class="text-[10px] text-success mb-2">Kendi kendine sevme düzeni çalışıyor — her gün tüm hayvanları okşar</p>

        <!-- Kümes kuluçkası -->
        <div v-if="bDef.type === 'coop' && getBuildingLevel('coop') >= 2" class="mb-3 p-2 border border-accent/10 rounded-xs">
          <p class="text-xs text-accent mb-1">
            <Egg :size="14" class="inline" />
            Kuluçka Gözü
          </p>
          <div v-if="animalStore.incubating">
            <p class="text-xs text-muted">
              Çıkıyor: {{ getAnimalName(animalStore.incubating.animalType) }} ({{ animalStore.incubating.daysLeft }} gün kaldı)
            </p>
          </div>
          <div v-else-if="coopIncubatableEggs.length > 0" class="flex flex-col space-y-1">
            <div
              v-for="eggItem in coopIncubatableEggs"
              :key="eggItem.itemId"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="handleStartIncubation(eggItem.itemId)"
            >
              <span class="text-xs">{{ eggItem.name }}</span>
              <span class="text-xs text-muted">&times;{{ eggItem.count }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-muted">Heybende kuluçkaya yatacak yumurta yok.</p>
        </div>

        <!-- Ahır kuluçkası -->
        <div v-if="bDef.type === 'barn' && getBuildingLevel('barn') >= 2" class="mb-3 p-2 border border-accent/10 rounded-xs">
          <p class="text-xs text-accent mb-1">
            <Egg :size="14" class="inline" />
            Kuluçka Gözü
          </p>
          <div v-if="animalStore.barnIncubating">
            <p class="text-xs text-muted">
              Çıkıyor: {{ getAnimalName(animalStore.barnIncubating.animalType) }} ({{ animalStore.barnIncubating.daysLeft }} gün kaldı)
            </p>
          </div>
          <div v-else-if="barnIncubatableEggs.length > 0" class="flex flex-col space-y-1">
            <div
              v-for="eggItem in barnIncubatableEggs"
              :key="eggItem.itemId"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="handleStartBarnIncubation(eggItem.itemId)"
            >
              <span class="text-xs">{{ eggItem.name }}</span>
              <span class="text-xs text-muted">&times;{{ eggItem.count }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-muted">Heybende ahır için çıkacak yumurta yok.</p>
        </div>

        <!-- Hayvan al düğmesi -->
        <Button class="w-full md:w-auto mb-3" :icon="ShoppingCart" @click="buyListBuilding = bDef.type">Hayvan Al</Button>

        <!-- Hayvan listesi -->
        <div v-if="getAnimalsInBuilding(bDef.type).length > 0" class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
          <div v-for="animal in getAnimalsInBuilding(bDef.type)" :key="animal.id" class="border border-accent/10 rounded-xs p-2 mr-1">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center space-x-1">
                <template v-if="renamingId === animal.id">
                  <input
                    v-model="renameInput"
                    class="bg-bg border border-accent/30 rounded-xs px-1 py-0.5 text-xs text-text w-20 outline-none"
                    maxlength="8"
                    @keyup.enter="confirmRename"
                    @keyup.escape="cancelRename"
                  />
                  <Button class="py-0 px-1" @click="confirmRename">Tamam</Button>
                  <Button class="py-0 px-1" @click="cancelRename">Vazgeç</Button>
                </template>
                <template v-else>
                  <span class="text-xs text-accent">{{ animal.name }}</span>
                  <button class="text-muted hover:text-accent" @click="startRename(animal.id, animal.name)">
                    <Pencil :size="10" />
                  </button>
                </template>
              </div>
              <div class="flex items-center space-x-1">
                <Button class="py-0 px-1" :icon="Hand" :disabled="animal.wasPetted" @click="handlePetAnimal(animal.id)">
                  {{ animal.wasPetted ? 'Sevildi' : 'Sev' }}
                </Button>
                <Button class="py-0 px-1" :icon="Coins" @click="sellTarget = { id: animal.id, name: animal.name, type: animal.type }">
                  Sat
                </Button>
              </div>
            </div>
            <div class="space-y-0.5">
              <div class="flex items-center space-x-1">
                <span class="text-[10px] text-muted w-6">Gönül</span>
                <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                  <div class="h-full rounded-xs bg-danger transition-all" :style="{ width: Math.floor(animal.friendship / 10) + '%' }" />
                </div>
              </div>
              <div class="flex items-center space-x-1">
                <span class="text-[10px] text-muted w-6">Hâl</span>
                <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                  <div
                    class="h-full rounded-xs transition-all"
                    :class="getMoodBarColor(animal.mood)"
                    :style="{ width: Math.floor((animal.mood / 255) * 100) + '%' }"
                  />
                </div>
                <span class="text-[10px] text-muted w-6">{{ getMoodText(animal.mood) }}</span>
              </div>
              <div v-if="animal.hunger > 0" class="flex items-center space-x-1">
                <span class="text-[10px] text-muted w-6">Açlık</span>
                <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                  <div class="h-full rounded-xs bg-danger transition-all" :style="{ width: Math.floor((animal.hunger / 7) * 100) + '%' }" />
                </div>
                <span class="text-[10px] text-danger w-6">{{ animal.hunger }} gün</span>
              </div>
            </div>
            <div v-if="animal.sick" class="flex items-center justify-between mt-0.5">
              <p class="text-[10px] text-danger">Hasta ({{ animal.sickDays }}/5 gün)</p>
              <Button class="py-0 px-1" :icon="Syringe" :disabled="medicineCount <= 0" @click="handleHealAnimal(animal.id, animal.name)">
                Sağalt
              </Button>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-6">
          <Home :size="36" class="text-accent/20 mb-2" />
          <p class="text-xs text-muted">Henüz hayvan yok</p>
          <p class="text-[10px] text-muted/50 mt-0.5">Dükkândan yavru alıp büyütmeye başla</p>
        </div>
      </template>
      <template v-else>
        <p class="text-xs text-muted">Gerekli: {{ bDef.materialCost.map(m => `${getItemName(m.itemId)}×${m.quantity}`).join('、') }}</p>
      </template>
    </div>

    <!-- Atlık -->
    <div class="mb-4 border border-accent/20 rounded-xs p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-accent">Atlık</span>
        <div v-if="animalStore.stableBuilt" class="flex items-center space-x-2">
          <span class="text-xs text-muted">{{ animalStore.getHorse ? '1/1' : '0/1' }}</span>
        </div>
        <Button v-else :icon="Hammer" @click="handleBuildBuilding('stable')">Kur ({{ stableDef?.cost ?? 10000 }} akçe)</Button>
      </div>

      <template v-if="animalStore.stableBuilt">
        <div v-if="animalStore.getHorse" class="border border-accent/10 rounded-xs p-2">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center space-x-1">
              <template v-if="renamingId === animalStore.getHorse.id">
                <input
                  v-model="renameInput"
                  class="bg-bg border border-accent/30 rounded-xs px-1 py-0.5 text-xs text-text w-20 outline-none"
                  maxlength="8"
                  @keyup.enter="confirmRename"
                  @keyup.escape="cancelRename"
                />
                <Button class="py-0 px-1" @click="confirmRename">Tamam</Button>
                <Button class="py-0 px-1" @click="cancelRename">Vazgeç</Button>
              </template>
              <template v-else>
                <span class="text-xs text-accent">{{ animalStore.getHorse.name }}</span>
                <button class="text-muted hover:text-accent" @click="startRename(animalStore.getHorse!.id, animalStore.getHorse!.name)">
                  <Pencil :size="10" />
                </button>
              </template>
            </div>
            <div class="flex items-center space-x-1">
              <Button
                class="py-0 px-1"
                :icon="Hand"
                :disabled="animalStore.getHorse.wasPetted"
                @click="handlePetAnimal(animalStore.getHorse.id)"
              >
                {{ animalStore.getHorse.wasPetted ? 'Sevildi' : 'Sev' }}
              </Button>
              <Button
                class="py-0 px-1"
                :icon="Coins"
                @click="sellTarget = { id: animalStore.getHorse!.id, name: animalStore.getHorse!.name, type: animalStore.getHorse!.type }"
              >
                Sat
              </Button>
            </div>
          </div>
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1">
              <span class="text-[10px] text-muted w-6">Gönül</span>
              <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                <div
                  class="h-full rounded-xs bg-danger transition-all"
                  :style="{ width: Math.floor(animalStore.getHorse.friendship / 10) + '%' }"
                />
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-[10px] text-muted w-6">Hâl</span>
              <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                <div
                  class="h-full rounded-xs transition-all"
                  :class="getMoodBarColor(animalStore.getHorse.mood)"
                  :style="{ width: Math.floor((animalStore.getHorse.mood / 255) * 100) + '%' }"
                />
              </div>
              <span class="text-[10px] text-muted w-6">{{ getMoodText(animalStore.getHorse.mood) }}</span>
            </div>
            <div v-if="animalStore.getHorse.hunger > 0" class="flex items-center space-x-1">
              <span class="text-[10px] text-muted w-6">Açlık</span>
              <div class="flex-1 h-1.5 bg-bg rounded-xs border border-accent/10">
                <div
                  class="h-full rounded-xs bg-danger transition-all"
                  :style="{ width: Math.floor((animalStore.getHorse.hunger / 7) * 100) + '%' }"
                />
              </div>
              <span class="text-[10px] text-danger w-6">{{ animalStore.getHorse.hunger }} gün</span>
            </div>
          </div>
          <div v-if="animalStore.getHorse.sick" class="flex items-center justify-between mt-0.5">
            <p class="text-[10px] text-danger">Hasta ({{ animalStore.getHorse.sickDays }}/5 gün)</p>
            <Button
              class="py-0 px-1"
              :icon="Syringe"
              :disabled="medicineCount <= 0"
              @click="handleHealAnimal(animalStore.getHorse!.id, animalStore.getHorse!.name)"
            >
              Sağalt
            </Button>
          </div>
          <p class="text-xs text-success mt-1">Ata binince yolculuk süresi %30 azalır.</p>
        </div>
        <div v-else>
          <div
            class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
            @click="
              openBuyModal(
                {
                  type: 'horse' as AnimalType,
                  name: 'At',
                  building: 'stable' as AnimalBuildingType,
                  cost: 5000,
                  productId: '',
                  productName: 'Yok',
                  produceDays: 0,
                  friendship: { min: 0, max: 1000 }
                },
                'stable'
              )
            "
          >
            <span class="text-xs">At</span>
            <span class="text-xs text-accent whitespace-nowrap">5000 akçe</span>
          </div>
          <p class="text-xs text-muted mt-1">At sahibi olmak yol süresini %30 kısaltır.</p>
        </div>
      </template>
      <template v-else>
        <p class="text-xs text-muted">
          Gerekli: {{ stableDef?.materialCost.map(m => `${getItemName(m.itemId)}×${m.quantity}`).join('、') ?? '' }}
        </p>
        <p class="text-xs text-muted mt-1">At sahibi olmak yol süresini %30 kısaltır.</p>
      </template>
    </div>

    <!-- Besi yönetimi -->
    <div class="border border-accent/20 rounded-xs p-3">
      <h3 class="text-accent text-sm mb-3">
        <Apple :size="14" class="inline" />
        Besi Yönetimi
      </h3>

      <!-- Yem seçimi -->
      <div class="mb-3">
        <p class="text-xs text-muted mb-1">Yem seçimi</p>
        <div class="flex flex-col space-y-1">
          <div
            v-for="feed in feedCounts"
            :key="feed.id"
            class="flex items-center justify-between border rounded-xs px-3 py-1.5 cursor-pointer"
            :class="selectedFeed === feed.id ? 'border-accent bg-accent/10' : 'border-accent/20 hover:bg-accent/5'"
            @click="selectedFeed = feed.id"
          >
            <div class="flex items-center space-x-2">
              <span class="text-xs" :class="selectedFeed === feed.id ? 'text-accent' : ''">{{ feed.name }}</span>
              <span class="text-[10px] text-muted">{{ feed.description }}</span>
            </div>
            <span class="text-xs text-muted">{{ feed.count }}</span>
          </div>
        </div>
      </div>

      <!-- Yem verme -->
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-muted">Yedirme</p>
          <span class="text-xs text-muted">{{ selectedFeedName }} stoğu: {{ selectedFeedCount }}</span>
        </div>
        <div class="flex flex-col space-y-1">
          <div
            class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5"
            :class="unfedCount > 0 ? 'cursor-pointer hover:bg-accent/5' : 'opacity-50'"
            @click="unfedCount > 0 && handleFeedAll()"
          >
            <span class="text-xs">Hepsini doyur</span>
            <span class="text-xs text-muted">{{ selectedFeedName }} gerek: &times;{{ unfedCount }}</span>
          </div>
          <div
            class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5"
            :class="playerStore.money >= selectedFeedPrice ? 'cursor-pointer hover:bg-accent/5' : 'opacity-50'"
            @click="playerStore.money >= selectedFeedPrice && handleBuyFeed()"
          >
            <span class="text-xs">{{ selectedFeedName }} al</span>
            <span class="text-xs text-accent">{{ selectedFeedPrice }} akçe</span>
          </div>
        </div>
      </div>

      <!-- Otlatma -->
      <div>
        <p class="text-xs text-muted mb-1">Otlatma</p>
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5"
          :class="canGraze ? 'cursor-pointer hover:bg-accent/5' : 'opacity-50'"
          @click="canGraze && handleGraze()"
        >
          <span class="text-xs">Tüm hayvanları ota çıkar</span>
          <span v-if="grazeDisabledReason" class="text-xs text-muted">{{ grazeDisabledReason }}</span>
        </div>
      </div>

      <!-- Sağaltma -->
      <div v-if="sickCount > 0" class="mt-3">
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs text-muted">Sağaltma</p>
          <span class="text-xs text-muted">Merhem stoğu: {{ medicineCount }}</span>
        </div>
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5"
          :class="medicineCount > 0 ? 'cursor-pointer hover:bg-accent/5' : 'opacity-50'"
          @click="medicineCount > 0 && handleHealAll()"
        >
          <span class="text-xs">Bütün hastaları sağalt</span>
          <span class="text-xs text-muted">Merhem gerek: &times;{{ sickCount }}</span>
        </div>
      </div>
    </div>

    <!-- Hayvan alım listesi penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="buyListBuilding"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="buyListBuilding = null"
      >
        <div class="game-panel max-w-xs w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">Hayvan Al</p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="buyListBuilding = null" />
          </div>
          <div class="flex flex-col space-y-1">
            <div
              v-for="aDef in getAnimalDefsForBuilding(buyListBuilding)"
              :key="aDef.type"
              class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-1.5 cursor-pointer hover:bg-accent/5"
              @click="handleSelectAnimalToBuy(aDef)"
            >
              <span class="text-xs">{{ aDef.name }}</span>
              <span class="text-xs text-accent whitespace-nowrap">{{ aDef.cost }} akçe</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Hayvan alım ayrıntı penceresi -->
    <Transition name="panel-fade">
      <div v-if="buyModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4" @click.self="buyModal = null">
        <div class="game-panel max-w-xs w-full">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm text-accent">{{ buyModal.name }}</p>
            <Button class="py-0 px-1" :icon="X" :icon-size="12" @click="buyModal = null" />
          </div>
          <div class="text-xs space-y-1 mb-3 border-b border-accent/20 pb-2">
            <p v-if="buyModal.productName && buyModal.productName !== 'Yok'" class="text-muted">
              Ürün: {{ buyModal.productName }} (her {{ buyModal.produceDays }} günde)
            </p>
            <p v-else class="text-muted">Yolculuk süresini %30 azaltır</p>
            <p>Bedel: {{ buyModal.cost }} akçe</p>
          </div>
          <Button class="w-full" :icon="ShoppingCart" :disabled="!buyModal.canBuy()" @click="handleBuyFromModal">Satın Al</Button>
        </div>
      </div>
    </Transition>

    <!-- Hayvan satma onay penceresi -->
    <Transition name="panel-fade">
      <div v-if="sellTarget" class="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4" @click.self="sellTarget = null">
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="sellTarget = null">
            <X :size="14" />
          </button>
          <p class="text-accent text-sm mb-2">Hayvanı Sat</p>
          <p class="text-xs text-text mb-1">
            <span class="text-accent">{{ sellTarget.name }}</span>
            satılsın mı?
          </p>
          <p class="text-xs text-muted mb-3">
            Satılınca geri gelmez; karşılığında
            <span class="text-accent">{{ sellTargetRefund }} akçe</span>
            alırsın (yarı bedel).
          </p>
          <div class="flex space-x-2">
            <Button class="flex-1" @click="sellTarget = null">Vazgeç</Button>
            <Button class="flex-1 !bg-danger !text-text" :icon="Coins" :icon-size="12" @click="confirmSellAnimal">Sat</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Yapı yükseltme penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="upgradeModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="upgradeModal = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="upgradeModal = null">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">Ağılı Yükselt</p>

          <!-- Mevcut düzey -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Şimdi</span>
              <span class="text-xs">{{ upgradeModal.currentName }} (Sv.{{ upgradeModal.currentLevel }})</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Sığa</span>
              <span class="text-xs">{{ upgradeModal.currentCapacity }} baş</span>
            </div>
          </div>

          <!-- Hedef düzey -->
          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Yükselecek hâl</span>
              <span class="text-xs text-accent">{{ upgradeModal.targetName }} (Sv.{{ upgradeModal.targetLevel }})</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Sığa</span>
              <span class="text-xs text-accent">{{ upgradeModal.targetCapacity }} baş</span>
            </div>
          </div>

          <!-- Gerekli kaynaklar -->
          <div class="border border-accent/10 rounded-xs p-2 mb-3">
            <p class="text-xs text-muted mb-1">Gerekli kaynaklar</p>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs">Akçe</span>
              <span class="text-xs" :class="playerStore.money >= upgradeModal.cost ? 'text-success' : 'text-danger'">
                {{ playerStore.money }} / {{ upgradeModal.cost }} akçe
              </span>
            </div>
            <div v-for="mat in upgradeModal.materials" :key="mat.itemId" class="flex items-center justify-between mt-0.5">
              <span class="text-xs">{{ mat.name }}</span>
              <span class="text-xs" :class="mat.have >= mat.need ? 'text-success' : 'text-danger'">{{ mat.have }} / {{ mat.need }}</span>
            </div>
          </div>

          <Button
            class="w-full justify-center"
            :class="canConfirmUpgrade ? '!bg-accent !text-bg' : 'opacity-50'"
            :icon="ArrowUp"
            :icon-size="12"
            :disabled="!canConfirmUpgrade"
            @click="confirmUpgradeBuilding"
          >
            Yükseltmeyi Onayla
          </Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Hammer, ShoppingCart, Hand, Apple, Home, ArrowUp, Egg, X, Coins, Syringe, Pencil } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import { useAnimalStore } from '@/stores/useAnimalStore'
  import { useGameStore } from '@/stores/useGameStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { ANIMAL_BUILDINGS, ANIMAL_DEFS, HAY_ITEM_ID, getItemById, getBuildingUpgrade, INCUBATION_MAP, FEED_DEFS } from '@/data'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import type { AnimalBuildingType, AnimalType, AnimalDef } from '@/types'
  import { addLog } from '@/composables/useGameLog'
  import { handleEndDay } from '@/composables/useEndDay'
  import { useTutorialStore } from '@/stores/useTutorialStore'

  const animalStore = useAnimalStore()
  const inventoryStore = useInventoryStore()
  const playerStore = usePlayerStore()
  const gameStore = useGameStore()
  const tutorialStore = useTutorialStore()

  const tutorialHint = computed(() => {
    if (!tutorialStore.enabled || gameStore.year > 1) return null
    const coopBuilt = animalStore.buildings.find(b => b.type === 'coop')?.built ?? false
    const barnBuilt = animalStore.buildings.find(b => b.type === 'barn')?.built ?? false
    if (!coopBuilt && !barnBuilt) return 'Önce dükkândan kümes ya da ahır kur; sonra hayvan alıp yetiştirebilirsin.'
    if (animalStore.animals.length > 0 && animalStore.animals.every(a => !a.wasPetted))
      return 'Hayvanları her gün sevmek gönüllerini artırır. “Birlikte Sev” ile hepsini birden okşayabilirsin.'
    return null
  })

  // === Satın alma penceresi ===

  interface BuyAnimalModalData {
    name: string
    productName: string
    produceDays: number
    cost: number
    onBuy: () => void
    canBuy: () => boolean
  }

  const buyModal = ref<BuyAnimalModalData | null>(null)
  const buyListBuilding = ref<AnimalBuildingType | null>(null)

  const handleSelectAnimalToBuy = (aDef: AnimalDef) => {
    if (!buyListBuilding.value) return
    openBuyModal(aDef, buyListBuilding.value)
    buyListBuilding.value = null
  }

  const openBuyModal = (aDef: AnimalDef, buildingType: AnimalBuildingType) => {
    buyModal.value = {
      name: aDef.name,
      productName: aDef.productName,
      produceDays: aDef.produceDays,
      cost: aDef.cost,
      onBuy: () => handleBuyAnimal(aDef.type),
      canBuy: () => {
        if (buildingType === 'stable') return !animalStore.getHorse && playerStore.money >= aDef.cost
        return getAnimalsInBuilding(buildingType).length < getBuildingCapacity(buildingType) && playerStore.money >= aDef.cost
      }
    }
  }

  const handleBuyFromModal = () => {
    if (!buyModal.value) return
    buyModal.value.onBuy()
    buyModal.value = null
  }

  // === Satış onayı ===

  const sellTarget = ref<{ id: string; name: string; type: AnimalType } | null>(null)

  const sellTargetRefund = computed(() => {
    if (!sellTarget.value) return 0
    const def = ANIMAL_DEFS.find(d => d.type === sellTarget.value!.type)
    return Math.floor((def?.cost ?? 0) / 2)
  })

  const confirmSellAnimal = () => {
    if (!sellTarget.value) return
    const result = animalStore.sellAnimal(sellTarget.value.id)
    sellTarget.value = null
    if (result.success) {
      addLog(`${result.name} satıldı, ${result.refund} akçe alındı.`)
    }
  }

  // === Hesaplar ===

  /** Sadece kümes ve ahır; atlık ayrı gösterilir */
  const mainBuildings = computed(() => ANIMAL_BUILDINGS.filter(b => b.type !== 'stable'))

  /** Atlık tanımı */
  const stableDef = computed(() => ANIMAL_BUILDINGS.find(b => b.type === 'stable'))

  /** Seçili yem türü */
  const selectedFeed = ref<string>(HAY_ITEM_ID)

  /** Yem stokları */
  const feedCounts = computed(() =>
    FEED_DEFS.map(f => ({
      ...f,
      count: inventoryStore.getItemCount(f.id)
    }))
  )

  /** Seçili yemin adı */
  const selectedFeedName = computed(() => FEED_DEFS.find(f => f.id === selectedFeed.value)?.name ?? 'Kuru ot')

  /** Seçili yemin stoğu */
  const selectedFeedCount = computed(() => inventoryStore.getItemCount(selectedFeed.value))

  /** Seçili yemin bedeli */
  const selectedFeedPrice = computed(() => FEED_DEFS.find(f => f.id === selectedFeed.value)?.price ?? 50)

  /** Doymamış hayvan sayısı */
  const unfedCount = computed(() => animalStore.animals.filter(a => !a.wasFed).length)

  /** Merhem sayısı */
  const medicineCount = computed(() => inventoryStore.getItemCount('animal_medicine'))

  /** Hasta hayvan sayısı */
  const sickCount = computed(() => animalStore.animals.filter(a => a.sick).length)

  /** Kümes için kuluçkaya uygun yumurtalar */
  const coopIncubatableEggs = computed(() => {
    const result: { itemId: string; name: string; count: number }[] = []
    for (const [itemId, mapping] of Object.entries(INCUBATION_MAP)) {
      if (mapping.building !== 'coop') continue
      const count = inventoryStore.getItemCount(itemId)
      if (count > 0) {
        const itemDef = getItemById(itemId)
        result.push({ itemId, name: itemDef?.name ?? itemId, count })
      }
    }
    return result
  })

  /** Ahır için kuluçkaya uygun yumurtalar */
  const barnIncubatableEggs = computed(() => {
    const result: { itemId: string; name: string; count: number }[] = []
    for (const [itemId, mapping] of Object.entries(INCUBATION_MAP)) {
      if (mapping.building !== 'barn') continue
      const count = inventoryStore.getItemCount(itemId)
      if (count > 0) {
        const itemDef = getItemById(itemId)
        result.push({ itemId, name: itemDef?.name ?? itemId, count })
      }
    }
    return result
  })

  // === Yardımcılar ===

  const getAnimalName = (type: AnimalType): string => {
    return ANIMAL_DEFS.find(d => d.type === type)?.name ?? type
  }

  const getItemName = (itemId: string): string => {
    return getItemById(itemId)?.name ?? itemId
  }

  const isBuildingBuilt = (type: AnimalBuildingType): boolean => {
    return animalStore.buildings.find(b => b.type === type)?.built ?? false
  }

  const getAnimalsInBuilding = (type: AnimalBuildingType) => {
    return animalStore.animals.filter(a => {
      const def = ANIMAL_DEFS.find(d => d.type === a.type)
      return def?.building === type
    })
  }

  const getAnimalDefsForBuilding = (type: AnimalBuildingType) => {
    return ANIMAL_DEFS.filter(d => d.building === type)
  }

  const getBuildingLevel = (type: AnimalBuildingType): number => {
    return animalStore.buildings.find(b => b.type === type)?.level ?? 0
  }

  const getBuildingDisplayName = (type: AnimalBuildingType): string => {
    const level = getBuildingLevel(type)
    if (level >= 2) {
      const upgrade = getBuildingUpgrade(type, level)
      if (upgrade) return upgrade.name
    }
    return ANIMAL_BUILDINGS.find(b => b.type === type)?.name ?? type
  }

  const getBuildingCapacity = (type: AnimalBuildingType): number => {
    const level = getBuildingLevel(type)
    if (type === 'stable') return 1
    return level * 4
  }

  const getMoodText = (mood: number): string => {
    if (mood > 200) return 'Şen'
    if (mood > 100) return 'Dingin'
    return 'Mahzun'
  }

  const getMoodBarColor = (mood: number): string => {
    if (mood > 200) return 'bg-success'
    if (mood > 100) return 'bg-accent'
    return 'bg-danger'
  }

  // === Otlatma ===

  const canGraze = computed(() => {
    if (animalStore.grazedToday) return false
    if (gameStore.isRainy) return false
    if (gameStore.season === 'winter') {
      return animalStore.animals.some(a => a.wasFed && a.type === 'yak')
    }
    const hasGrazeableAnimals = animalStore.animals.some(a => a.wasFed && a.type !== 'horse')
    return hasGrazeableAnimals
  })

  const grazeDisabledReason = computed(() => {
    if (animalStore.animals.filter(a => a.type !== 'horse').length === 0) return 'Hayvan yok'
    if (animalStore.grazedToday) return 'Bugün ota çıktı'
    if (gameStore.isRainy) return 'Yağmurda otlatılmaz'
    if (gameStore.season === 'winter') {
      const hasYak = animalStore.animals.some(a => a.wasFed && a.type === 'yak')
      return hasYak ? '' : 'Kışta yalnız yak dışarı çıkabilir'
    }
    if (!animalStore.animals.some(a => a.wasFed && a.type !== 'horse')) return 'Önce doyur'
    return ''
  })

  // === Yükseltme penceresi ===

  interface UpgradeModalData {
    buildingType: AnimalBuildingType
    currentName: string
    currentLevel: number
    currentCapacity: number
    targetName: string
    targetLevel: number
    targetCapacity: number
    cost: number
    materials: { itemId: string; name: string; need: number; have: number }[]
  }

  const upgradeModal = ref<UpgradeModalData | null>(null)

  const openUpgradeModal = (type: AnimalBuildingType) => {
    const level = getBuildingLevel(type)
    const upgrade = getBuildingUpgrade(type, level + 1)
    if (!upgrade) return
    upgradeModal.value = {
      buildingType: type,
      currentName: getBuildingDisplayName(type),
      currentLevel: level,
      currentCapacity: level * 4,
      targetName: upgrade.name,
      targetLevel: upgrade.level,
      targetCapacity: upgrade.capacity,
      cost: upgrade.cost,
      materials: upgrade.materialCost.map(m => ({
        itemId: m.itemId,
        name: getItemName(m.itemId),
        need: m.quantity,
        have: inventoryStore.getItemCount(m.itemId)
      }))
    }
  }

  const canConfirmUpgrade = computed(() => {
    if (!upgradeModal.value) return false
    if (playerStore.money < upgradeModal.value.cost) return false
    return upgradeModal.value.materials.every(m => inventoryStore.getItemCount(m.itemId) >= m.need)
  })

  const confirmUpgradeBuilding = () => {
    if (!upgradeModal.value) return
    const type = upgradeModal.value.buildingType
    const targetName = upgradeModal.value.targetName
    const targetCapacity = upgradeModal.value.targetCapacity
    upgradeModal.value = null
    const success = animalStore.upgradeBuilding(type)
    if (success) {
      addLog(`${targetName} kuruldu! Sığası ${targetCapacity} başa çıktı.`)
      const tr = gameStore.advanceTime(2)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Yükseltme olmadı; akçe ve gereçleri yeniden gözden geçir.')
    }
  }

  // === İşlemler ===

  const handleBuildBuilding = (type: AnimalBuildingType) => {
    const success = animalStore.buildBuilding(type)
    const bDef = ANIMAL_BUILDINGS.find(b => b.type === type)
    if (success) {
      addLog(`${bDef?.name ?? 'Yapı'} kuruldu!`)
      const tr = gameStore.advanceTime(2)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog(`${bDef?.name ?? 'Yapı'} kurulamadı; akçe ve gereç yetmiyor.`)
    }
  }

  const handleBuyAnimal = (type: AnimalType) => {
    const aDef = ANIMAL_DEFS.find(d => d.type === type)
    if (!aDef) return
    const count = animalStore.animals.filter(a => a.type === type).length
    const defaultName = `${aDef.name}${count + 1}`
    const success = animalStore.buyAnimal(type, defaultName)
    if (success) {
      addLog(`Bir ${aDef.name} aldın, adı da “${defaultName}” oldu.`)
    } else {
      addLog(`${aDef.name} alınamadı; akçeni ve ağıl yerini gözden geçir.`)
    }
  }

  const handlePetAnimal = (id: string) => {
    const success = animalStore.petAnimal(id)
    if (success) {
      const animal = animalStore.animals.find(a => a.id === id)
      addLog(`${animal?.name ?? 'Hayvan'} sevildi, gönlü arttı.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.petAnimal)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Bugün zaten sevildi.')
    }
  }

  const handlePetThePet = () => {
    const success = animalStore.petThePet()
    if (success) {
      addLog(`${animalStore.pet?.name ?? 'Evcil dost'} sevildi, gönül +5.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.petAnimal)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Bugün zaten sevildi.')
    }
  }

  const unpettedCount = computed(() => {
    let count = animalStore.animals.filter(a => !a.wasPetted).length
    if (animalStore.pet && !animalStore.pet.wasPetted) count++
    return count
  })

  const handlePetAll = () => {
    const STAMINA_COST = 2
    if (!playerStore.consumeStamina(STAMINA_COST)) {
      addLog('Gücün yetmedi; hepsini birden sevemedin.')
      return
    }
    const count = animalStore.petAllAnimals()
    if (count > 0) {
      addLog(`${count} canlıyı birden sevdin; hepsinin içi açıldı!`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.batchPet)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    } else {
      addLog('Bugün hepsi zaten sevilmişti.')
    }
  }

  const handleStartIncubation = (itemId: string) => {
    const result = animalStore.startIncubation(itemId)
    addLog(result.message)
  }

  const handleStartBarnIncubation = (itemId: string) => {
    const result = animalStore.startBarnIncubation(itemId)
    addLog(result.message)
  }

  const handleFeedAll = () => {
    const result = animalStore.feedAll(selectedFeed.value)
    const feedName = selectedFeedName.value
    if (result.fedCount > 0) {
      addLog(`${feedName} ile ${result.fedCount} hayvan doyuruldu.`)
    }
    if (result.noFeedCount > 0) {
      addLog(`${feedName} yetmedi; ${result.noFeedCount} hayvan aç kaldı.`)
    }
    if (result.fedCount === 0 && result.noFeedCount === 0) {
      addLog('Bugün hepsi zaten doymuştu.')
    }
    if (result.fedCount > 0) {
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.feedAnimals)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    }
  }

  const handleBuyFeed = () => {
    const feed = FEED_DEFS.find(f => f.id === selectedFeed.value)
    if (!feed) return
    const hasStack = inventoryStore.items.some(s => s.itemId === feed.id && s.quality === 'normal' && s.quantity < 99)
    if (!hasStack && inventoryStore.isFull) {
      addLog('Heybe dolu; satın alamazsın.')
      return
    }
    if (!playerStore.spendMoney(feed.price)) {
      addLog(`Akçe yetmedi; ${feed.name} alamadın.`)
      return
    }
    if (!inventoryStore.addItem(feed.id)) {
      playerStore.earnMoney(feed.price)
      addLog('Alım olmadı, akçe geri verildi.')
      return
    }
    addLog(`1 adet ${feed.name} alındı, ${feed.price} akçe verildi.`)
  }

  const handleGraze = () => {
    const result = animalStore.grazeAnimals()
    addLog(result.message)
    if (result.success) {
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.graze)
      if (tr.message) addLog(tr.message)
      if (tr.passedOut) handleEndDay()
    }
  }

  const handleHealAnimal = (animalId: string, animalName: string) => {
    const success = animalStore.healAnimal(animalId)
    if (success) addLog(`${animalName} merhemle sağaltıldı.`)
    else addLog('Sağaltma olmadı; merhem var mı bak.')
  }

  const handleHealAll = () => {
    const result = animalStore.healAllSick()
    if (result.healedCount > 0) addLog(`${result.healedCount} hasta hayvan sağaltıldı.`)
    if (result.noMedicineCount > 0) addLog(`Merhem yetmedi; ${result.noMedicineCount} hayvan iyileşemedi.`)
  }

  // === Ad değiştirme ===

  const renamingId = ref<string | null>(null)
  const renameInput = ref('')

  const startRename = (id: string, currentName: string) => {
    renamingId.value = id
    renameInput.value = currentName
  }

  const confirmRename = () => {
    if (!renamingId.value) return
    const success = animalStore.renameAnimal(renamingId.value, renameInput.value)
    if (success) {
      addLog(`Adı “${renameInput.value.trim()}” oldu.`)
    } else {
      addLog('Ad verme olmadı; ad 1 ile 8 harf arasında olmalı.')
    }
    renamingId.value = null
  }

  const cancelRename = () => {
    renamingId.value = null
  }
</script>
