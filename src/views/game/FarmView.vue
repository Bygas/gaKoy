<template>
  <div>
    <!-- Sekme geçişi -->
    <div class="flex space-x-1.5 mb-3">
      <Button
        class="flex-1 justify-center"
        :class="{ '!bg-accent !text-bg': farmTab === 'field' }"
        :icon="Sprout"
        @click="farmTab = 'field'"
      >
        Tarla
      </Button>
      <Button
        class="flex-1 justify-center"
        :class="{ '!bg-accent !text-bg': farmTab === 'tree' }"
        :icon="TreeDeciduous"
        @click="farmTab = 'tree'"
      >
        Ağaçlık
      </Button>
    </div>

    <!-- Tarla sekmesi -->
    <div v-if="farmTab === 'field'">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center space-x-1.5 text-sm text-accent">
          <Sprout :size="14" />
          <span>Tarla ({{ farmStore.farmSize }}×{{ farmStore.farmSize }})</span>
        </div>
        <div class="text-xs text-muted flex space-x-3">
          <span v-if="farmStore.scarecrows > 0" class="inline-flex items-center space-x-0.5">
            <Bird :size="12" />
            <span>Korkuluk {{ farmStore.scarecrows }}</span>
          </span>
          <span v-else class="text-danger/80 inline-flex items-center space-x-0.5">
            <Bird :size="12" />
            <span>Korkuluk yok</span>
          </span>
          <span v-if="farmStore.lightningRods > 0" class="inline-flex items-center space-x-0.5">
            <Zap :size="12" />
            <span>Yıldırım Çubuğu {{ farmStore.lightningRods }}</span>
          </span>
        </div>
      </div>

      <!-- Yeni başlayan rehberi -->
      <p v-if="tutorialHint" class="text-[10px] text-muted/50 mb-2">{{ tutorialHint }}</p>

      <!-- Toplu işlem girişi -->
      <div class="mb-3">
        <Button class="w-full md:w-auto" :icon-size="12" :icon="Wrench" @click="showBatchActions = true">Toplu İşlem</Button>
      </div>

      <!-- Çiftlik özel işlevleri -->
      <div v-if="gameStore.farmMapType === 'riverland' && gameStore.creekCatch.length > 0" class="mb-3">
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-2 cursor-pointer hover:bg-accent/5"
          @click="handleCollectCreekCatch"
        >
          <div>
            <p class="text-xs text-accent">Dere Balığı</p>
            <p class="text-[10px] text-muted">Derede {{ gameStore.creekCatch.length }} balık tutuldu</p>
          </div>
          <span class="text-xs text-success">Topla</span>
        </div>
      </div>

      <div v-if="gameStore.farmMapType === 'hilltop' && gameStore.surfaceOrePatch" class="mb-3">
        <div
          class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-2 cursor-pointer hover:bg-accent/5"
          @click="handleMineSurfaceOre"
        >
          <div>
            <p class="text-xs text-accent">Yerüstü Madeni</p>
            <p class="text-[10px] text-muted">{{ surfaceOreName }}&times;{{ gameStore.surfaceOrePatch.quantity }} bulundu</p>
          </div>
          <span class="text-xs text-success">Kaz (-5 dayanıklılık)</span>
        </div>
      </div>

      <!-- Toplu işlem penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="showBatchActions"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="showBatchActions = false"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showBatchActions = false">
              <X :size="14" />
            </button>
            <p class="text-accent text-sm mb-2">Toplu İşlem</p>
            <div class="flex flex-col space-y-1.5">
              <button class="btn text-xs w-full justify-between" :disabled="unwateredCount === 0" @click="doBatchAction('water')">
                <span class="flex items-center space-x-1">
                  <Droplets :size="12" />
                  <span>Hepsini Sula</span>
                </span>
                <span class="text-muted">{{ unwateredCount }} parça</span>
              </button>
              <button class="btn text-xs w-full justify-between" :disabled="wastelandCount === 0" @click="doBatchAction('till')">
                <span class="flex items-center space-x-1">
                  <Shovel :size="12" />
                  <span>Hepsini Belle</span>
                </span>
                <span class="text-muted">{{ wastelandCount }} parça</span>
              </button>
              <button class="btn text-xs w-full justify-between" :disabled="harvestableCount === 0" @click="doBatchAction('harvest')">
                <span class="flex items-center space-x-1">
                  <Wheat :size="12" />
                  <span>Hepsini Biç</span>
                </span>
                <span class="text-muted">{{ harvestableCount }} parça</span>
              </button>
              <button
                class="btn text-xs w-full justify-between"
                :disabled="tilledEmptyCount === 0 || (plantableSeeds.length === 0 && plantableBreedingSeeds.length === 0)"
                @click="doBatchAction('plant')"
              >
                <span class="flex items-center space-x-1">
                  <Sprout :size="12" />
                  <span>Hepsini Ek</span>
                </span>
                <span class="text-muted">{{ tilledEmptyCount }} parça</span>
              </button>
              <button
                class="btn text-xs w-full justify-between"
                :disabled="fertilizableCount === 0 || fertilizerItems.length === 0"
                @click="doBatchAction('fertilize')"
              >
                <span class="flex items-center space-x-1">
                  <CirclePlus :size="12" />
                  <span>Hepsini Gübrele</span>
                </span>
                <span class="text-muted">{{ fertilizableCount }} parça</span>
              </button>
              <button class="btn text-xs w-full justify-between" :disabled="infestedCount === 0" @click="doBatchAction('curePest')">
                <span class="flex items-center space-x-1">
                  <Bug :size="12" />
                  <span>Hepsini İlaçla</span>
                </span>
                <span class="text-muted">{{ infestedCount }} parça</span>
              </button>
              <button class="btn text-xs w-full justify-between" :disabled="weedyCount === 0" @click="doBatchAction('clearWeed')">
                <span class="flex items-center space-x-1">
                  <Leaf :size="12" />
                  <span>Hepsini Ayıkla</span>
                </span>
                <span class="text-muted">{{ weedyCount }} parça</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Tarla ızgarası -->
      <div class="border border-accent/20 rounded-xs p-2">
        <div class="grid gap-0.5 max-w-full md:max-w-md" :style="{ gridTemplateColumns: `repeat(${farmStore.farmSize}, minmax(0, 1fr))` }">
          <button
            v-for="plot in farmStore.plots"
            :key="plot.id"
            class="farm-plot rounded-xs cursor-pointer transition-colors relative leading-tight"
            :class="[
              getPlotDisplay(plot).color,
              getPlotDisplay(plot).bg,
              needsWater(plot)
                ? 'border-2 border-danger/50'
                : isSprinklerCovered(plot.id)
                  ? 'border border-water/40'
                  : 'border border-accent/15',
              plot.state === 'harvestable' ? 'hover:border-accent/60' : 'hover:border-accent/40'
            ]"
            :title="getPlotTooltip(plot)"
            @click="activePlotId = plot.id"
          >
            <div class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <component :is="getPlotDisplay(plot).icon" :size="14" />
              <span v-if="plot.cropId" class="text-[10px] opacity-60 truncate max-w-full px-0.5 mt-1">{{ getCropName(plot.cropId) }}</span>
              <!-- Köşe işaretleri -->
              <Droplets
                v-if="(plot.state === 'planted' || plot.state === 'growing') && !plot.watered"
                :size="8"
                class="absolute bottom-0 right-0 text-danger drop-shadow-sm"
              />
              <Droplet v-if="hasSprinkler(plot.id)" :size="8" class="absolute top-0 right-0 text-water drop-shadow-sm" />
              <CirclePlus v-if="plot.fertilizer" :size="8" class="absolute bottom-0 left-0 text-success drop-shadow-sm" />
              <Bug v-if="plot.infested" :size="8" class="absolute top-0 left-0 text-danger drop-shadow-sm" />
              <Leaf
                v-if="plot.weedy"
                :size="8"
                class="absolute top-0 left-0 text-success drop-shadow-sm"
                :class="{ 'left-2': plot.infested }"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Tarla işlem penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="activePlot"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="activePlotId = null"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activePlotId = null">
              <X :size="14" />
            </button>
            <p class="text-accent text-sm mb-2">Tarla Parçası #{{ activePlot.id + 1 }}</p>
            <p class="text-xs text-muted mb-2">
              {{ plotStateLabel }}
              <template v-if="activePlot.giantCropGroup !== null">（Dev）</template>
              <template v-if="activePlot.cropId">
                · {{ activePlot.giantCropGroup !== null ? 'Dev ' : '' }}{{ getCropName(activePlot.cropId) }}
                <span v-if="plotCropRegrowth" class="text-success">[Yeniden ürün {{ activePlot.harvestCount }}/{{ plotCropMaxHarvests }}]</span>
              </template>
              <template v-if="activePlot.cropId && activePlot.giantCropGroup === null">
                ·
                <span :class="activePlot.watered ? 'text-water' : 'text-danger'">{{ activePlot.watered ? 'Sulandı' : 'Su bekliyor' }}</span>
              </template>
              <template v-if="activePlot.fertilizer">
                ·
                <span class="text-success">{{ plotFertName }}</span>
              </template>
              <template v-if="hasSprinkler(activePlot.id)">
                ·
                <span class="text-water">Fıskiye</span>
              </template>
              <template v-if="activePlot.infested">
                ·
                <span class="text-danger">Haşere({{ activePlot.infestedDays }} gün)</span>
              </template>
              <template v-if="activePlot.weedy">
                ·
                <span class="text-success">Yabani ot({{ activePlot.weedyDays }} gün)</span>
              </template>
            </p>
            <!-- Büyüme ilerleme çubuğu -->
            <div v-if="activePlot.cropId && activePlot.state !== 'harvestable'" class="flex items-center space-x-2 mb-2">
              <span class="text-xs text-muted shrink-0">Büyüme</span>
              <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                <div
                  class="h-full rounded-xs bg-success transition-all"
                  :style="{ width: Math.min(100, Math.floor((activePlot.growthDays / (Number(plotCropGrowthDays) || 1)) * 100)) + '%' }"
                />
              </div>
              <span class="text-xs text-muted whitespace-nowrap">
                {{ Number(activePlot.growthDays.toFixed(2)) }}/{{ plotCropGrowthDays }} gün
              </span>
            </div>
            <p v-if="activePlot.giantCropGroup !== null" class="text-xs text-accent mb-2">Biçildiğinde çok sayıda ürün verir!</p>

            <!-- İşlem listesi -->
            <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
              <Button
                v-if="activePlot.state === 'wasteland'"
                class="w-full justify-center shrink-0"
                :icon-size="12"
                :icon="Shovel"
                @click="doTill"
              >
                Belle
              </Button>
              <Button v-if="canWater" class="w-full justify-center shrink-0" :icon-size="12" :icon="Droplets" @click="doWater">Sula</Button>
              <Button
                v-if="activePlot.infested"
                class="w-full justify-center shrink-0 !bg-danger !text-text"
                :icon-size="12"
                :icon="Bug"
                @click="doCurePest"
              >
                Haşereyi Temizle
              </Button>
              <Button
                v-if="activePlot.weedy"
                class="w-full justify-center shrink-0 !bg-success !text-bg"
                :icon-size="12"
                :icon="Leaf"
                @click="doClearWeed"
              >
                Otu Temizle
              </Button>
              <Button
                v-if="activePlot.state === 'harvestable'"
                class="w-full justify-center shrink-0 !bg-accent !text-bg"
                :icon-size="12"
                :icon="Wheat"
                @click="doHarvest"
              >
                Biç
              </Button>
              <Button
                v-if="activePlot.state === 'planted' || activePlot.state === 'growing' || activePlot.state === 'harvestable'"
                class="w-full justify-center shrink-0"
                :icon-size="12"
                :icon="Trash2"
                @click="doRemoveCrop"
              >
                Sök
              </Button>
              <template v-if="activePlot.state === 'tilled' && plantableSeeds.length > 0">
                <Divider label="Ekim" />
                <button
                  v-for="seed in plantableSeeds"
                  :key="seed.cropId"
                  class="btn text-xs justify-between mr-1 shrink-0"
                  @click="doPlant(seed.cropId)"
                >
                  <span :class="seed.colorClass">
                    {{ seed.name }}
                    <span v-if="seed.regrowth" class="text-success ml-1">[Yeniden ürün]</span>
                  </span>
                  <span class="text-muted">×{{ seed.count }}</span>
                </button>
              </template>
              <template v-if="activePlot.state === 'tilled' && plantableBreedingSeeds.length > 0">
                <Divider label="Melez Tohumları" class="!my-2" />
                <button
                  v-for="seed in plantableBreedingSeeds"
                  :key="seed.genetics.id"
                  class="btn text-xs justify-between mr-1 shrink-0"
                  @click="doPlantGeneticSeed(seed.genetics.id)"
                >
                  <span>{{ getCropName(seed.genetics.cropId) }} G{{ seed.genetics.generation }}</span>
                  <span class="text-muted flex items-center space-x-px">
                    <Star v-for="n in getStarRating(seed.genetics)" :key="n" :size="10" />
                  </span>
                </button>
              </template>
              <!-- Tohum boş durumu -->
              <div
                v-if="activePlot.state === 'tilled' && plantableSeeds.length === 0 && plantableBreedingSeeds.length === 0"
                class="flex flex-col items-center py-4"
              >
                <Sprout :size="32" class="text-muted/30" />
                <p class="text-xs text-muted mt-2">Çantada bu mevsime uygun tohum yok</p>
                <Button v-if="isWanwupuOpen" class="mt-2" :icon-size="12" :icon="Store" @click="goToShop">Dükkâna Git</Button>
                <p v-else class="text-[10px] text-muted/60 mt-1">{{ wanwupuClosedReason }}</p>
              </div>
              <template v-if="canFertilize && fertilizerItems.length > 0">
                <Divider label="Gübreleme" />
                <button
                  v-for="f in fertilizerItems"
                  :key="f.itemId"
                  class="btn text-xs justify-between mr-1 shrink-0"
                  @click="doFertilize(f.type)"
                >
                  <span :class="f.colorClass">{{ f.name }}</span>
                  <span class="text-muted">×{{ f.count }}</span>
                </button>
              </template>
              <template v-if="!hasSprinkler(activePlot.id) && sprinklerItems.length > 0">
                <Divider label="Fıskiye" />
                <button
                  v-for="s in sprinklerItems"
                  :key="s.itemId"
                  class="btn text-xs justify-between mr-1 shrink-0"
                  @click="doPlaceSprinkler(s.type)"
                >
                  <span :class="s.colorClass">{{ s.name }}</span>
                  <span class="text-muted">×{{ s.count }}</span>
                </button>
              </template>
              <Button v-if="hasSprinkler(activePlot.id)" class="mr-1 justify-center shrink-0" @click="doRemoveSprinkler">Fıskiyeyi Sök</Button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Toplu ekim penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="showBatchPlant"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="showBatchPlant = false"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showBatchPlant = false">
              <X :size="14" />
            </button>
            <p class="text-accent text-sm mb-2">Toplu Ekim</p>
            <p class="text-xs text-muted mb-2">Boş sürülmüş alan {{ tilledEmptyCount }} parça, ekilecek tohumu seç:</p>
            <div class="flex flex-col space-y-1 max-h-40 overflow-y-auto">
              <button
                v-for="seed in plantableSeeds"
                :key="seed.cropId"
                class="btn text-xs justify-between mr-1 shrink-0"
                @click="doBatchPlant(seed.cropId)"
              >
                <span :class="seed.colorClass">
                  {{ seed.name }}
                  <span v-if="seed.regrowth" class="text-success ml-1">[Yeniden ürün]</span>
                </span>
                <span class="text-muted">×{{ seed.count }}</span>
              </button>
            </div>
            <template v-if="batchBreedingSeedGroups.length > 0">
              <Divider label="Melez Tohumları" class="!my-2" />
              <div class="flex flex-col space-y-1 max-h-40 overflow-y-auto">
                <button
                  v-for="group in batchBreedingSeedGroups"
                  :key="group.cropId"
                  class="btn text-xs justify-between mr-1 shrink-0"
                  @click="doBatchPlantBreeding(group.cropId)"
                >
                  <span>
                    {{ group.name }}
                    <span class="text-muted">G{{ group.minGen }}{{ group.minGen !== group.maxGen ? `~${group.maxGen}` : '' }}</span>
                  </span>
                  <span class="text-muted">×{{ group.count }}</span>
                </button>
              </div>
            </template>
            <div v-if="plantableSeeds.length === 0 && batchBreedingSeedGroups.length === 0" class="flex flex-col items-center py-4">
              <Sprout :size="32" class="text-muted/30" />
              <p class="text-xs text-muted mt-2">Bu mevsimde ekilecek tohum yok</p>
              <Button v-if="isWanwupuOpen" class="mt-2" :icon-size="12" :icon="Store" @click="goToShop">Dükkâna Git</Button>
              <p v-else class="text-[10px] text-muted/60 mt-1">{{ wanwupuClosedReason }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Toplu gübreleme penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="showBatchFertilize"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="showBatchFertilize = false"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showBatchFertilize = false">
              <X :size="14" />
            </button>
            <p class="text-accent text-sm mb-2">Toplu Gübreleme</p>
            <p class="text-xs text-muted mb-2">Gübrelenebilir alan {{ fertilizableCount }} parça, gübreyi seç:</p>
            <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
              <button
                v-for="f in fertilizerItems"
                :key="f.itemId"
                class="btn text-xs justify-between mr-1 shrink-0"
                @click="doBatchFertilize(f.type)"
              >
                <span :class="f.colorClass">{{ f.name }}</span>
                <span class="text-muted">×{{ f.count }}</span>
              </button>
            </div>
            <div v-if="fertilizerItems.length === 0" class="flex flex-col items-center py-4">
              <CirclePlus :size="32" class="text-muted/30" />
              <p class="text-xs text-muted mt-2">Kullanılabilir gübre yok</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Açıklamalar ve uyarılar -->
      <div class="mt-2 border border-accent/10 rounded-xs p-2">
        <div class="grid grid-cols-4 md:space-x-3 md:flex md:flex-wrap text-xs text-muted">
          <span v-for="(item, i) in PLOT_LEGENDS" :key="i">
            <component :is="item.icon" :size="10" :class="[item.color, 'inline']" />
            {{ item.label }}
          </span>
        </div>
        <div v-if="plotWarnings.length > 0" class="flex flex-wrap space-x-2 mt-1.5 border border-accent/20 rounded-xs p-2">
          <span v-for="(w, i) in plotWarnings" :key="i" class="inline-flex items-center space-x-0.5 text-xs" :class="w.color">
            {{ w.text }}
          </span>
        </div>
      </div>

      <!-- Sevkiyat sandığı girişi -->
      <div
        class="mt-3 flex items-center justify-between border border-accent/20 rounded-xs px-3 py-2 cursor-pointer hover:bg-accent/5"
        @click="showShippingBox = true"
      >
        <div class="flex items-center space-x-1.5">
          <Package :size="14" class="text-accent" />
          <span class="text-sm text-accent">Sevkiyat Sandığı</span>
          <span v-if="shopStore.shippingBox.length > 0" class="text-xs text-muted">{{ shopStore.shippingBox.length }} tür</span>
        </div>
        <span v-if="shippingBoxTotal > 0" class="text-xs text-accent">≈{{ shippingBoxTotal }} akçe</span>
        <span v-else class="text-xs text-muted">Boş</span>
      </div>

      <!-- Sevkiyat sandığı penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="showShippingBox"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="showShippingBox = false"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showShippingBox = false">
              <X :size="14" />
            </button>
            <div class="flex items-center space-x-1.5 text-sm text-accent mb-1">
              <Package :size="14" />
              <span>Sevkiyat Sandığı</span>
            </div>
            <p class="text-xs text-muted mb-2">Konan eşya ertesi gün hesabı görülür.</p>
            <p v-if="inventoryStore.getRingEffectValue('sell_price_bonus') > 0" class="text-success text-xs mb-2">
              Yüzük etkisi sürüyor: satış bedeli +{{ Math.round(inventoryStore.getRingEffectValue('sell_price_bonus') * 100) }}%
            </p>

            <!-- Eklenmiş eşyalar -->
            <div v-if="shopStore.shippingBox.length > 0" class="border border-accent/10 rounded-xs p-2 mb-2">
              <p class="text-xs text-muted mb-1">Konanlar</p>
              <div class="flex flex-col space-y-1 max-h-36 overflow-y-auto">
                <div
                  v-for="(entry, idx) in shopStore.shippingBox"
                  :key="idx"
                  class="flex items-center justify-between border border-accent/20 rounded-xs px-2 py-1 cursor-pointer hover:bg-accent/5"
                  @click="handleRemoveFromBox(entry.itemId, entry.quantity, entry.quality)"
                >
                  <div class="min-w-0">
                    <span
                      class="text-xs"
                      :class="{
                        'text-quality-fine': entry.quality === 'fine',
                        'text-quality-excellent': entry.quality === 'excellent',
                        'text-quality-supreme': entry.quality === 'supreme'
                      }"
                    >
                      {{ getItemName(entry.itemId) }}
                    </span>
                    <span class="text-muted text-xs ml-1">×{{ entry.quantity }}</span>
                  </div>
                  <span class="text-xs text-accent whitespace-nowrap ml-2">
                    ≈{{ shopStore.calculateSellPrice(entry.itemId, entry.quantity, entry.quality) }} akçe
                  </span>
                </div>
              </div>
              <p class="text-xs text-accent mt-1.5">Beklenen gelir: {{ shippingBoxTotal }} akçe</p>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-4 text-muted mb-2">
              <Package :size="32" class="text-muted/30" />
              <p class="text-xs mt-2">Sevkiyat sandığı boş</p>
            </div>

            <!-- Çantadan eklenebilecek eşyalar -->
            <div v-if="shippableItems.length > 0" class="border border-accent/10 rounded-xs p-2">
              <p class="text-xs text-muted mb-1">Çantadaki eşyalar</p>
              <div class="flex flex-col space-y-1 overflow-auto max-h-48">
                <div
                  v-for="item in shippableItems"
                  :key="item.itemId + item.quality"
                  class="flex items-center justify-between border border-accent/10 rounded-xs px-2 py-1 mr-1"
                >
                  <div class="min-w-0">
                    <span
                      class="text-xs"
                      :class="{
                        'text-quality-fine': item.quality === 'fine',
                        'text-quality-excellent': item.quality === 'excellent',
                        'text-quality-supreme': item.quality === 'supreme'
                      }"
                    >
                      {{ item.def?.name }}
                    </span>
                    <span class="text-muted text-xs ml-1">×{{ item.quantity }}</span>
                  </div>
                  <div class="flex space-x-1">
                    <Button @click="handleAddToBox(item.itemId, 1, item.quality)">1 Koy</Button>
                    <Button v-if="item.quantity > 1" @click="handleAddToBox(item.itemId, item.quantity, item.quality)">Hepsini Koy</Button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center py-3 text-muted">
              <Wheat :size="32" class="text-muted/30" />
              <p class="text-xs mt-2">Çantada sevk edilecek eşya yok</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Sera girişi -->
      <div
        v-if="showGreenhouse"
        class="mt-3 flex items-center justify-between border border-accent/20 rounded-xs px-3 py-2 cursor-pointer hover:bg-accent/5"
        @click="showGreenhouseModal = true"
      >
        <div class="flex items-center space-x-1.5">
          <Warehouse :size="14" class="text-accent" />
          <span class="text-sm text-accent">Sera</span>
          <span v-if="ghHarvestableCount > 0" class="text-xs text-accent">{{ ghHarvestableCount }} parça biçilmeye hazır</span>
        </div>
        <span class="text-xs text-muted">{{ farmStore.greenhousePlots.length }} parça</span>
      </div>
    </div>

    <!-- Ağaçlık sekmesi -->
    <div v-if="farmTab === 'tree'">
      <!-- Meyve ağaçları alanı -->
      <div class="border border-accent/20 rounded-xs p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-1.5 text-sm text-accent">
            <TreeDeciduous :size="14" />
            <span>Meyve Ağaçları</span>
          </div>
          <span class="text-xs text-muted">{{ farmStore.fruitTrees.length }}/{{ MAX_FRUIT_TREES }}</span>
        </div>
        <div v-if="farmStore.fruitTrees.length > 0" class="flex flex-col space-y-1.5 mb-2">
          <div v-for="tree in farmStore.fruitTrees" :key="tree.id" class="border border-accent/10 rounded-xs px-3 py-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold" :class="tree.mature ? 'text-accent' : 'text-muted'">{{ getTreeName(tree.type) }}</span>
              <span v-if="tree.mature" class="text-[10px] text-muted">{{ tree.yearAge }} yaşında</span>
            </div>
            <template v-if="!tree.mature">
              <div class="flex items-center space-x-2 mb-1.5">
                <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                  <div
                    class="h-full rounded-xs bg-success transition-all"
                    :style="{ width: Math.min(100, Math.floor((tree.growthDays / 28) * 100)) + '%' }"
                  />
                </div>
                <span class="text-[10px] text-muted whitespace-nowrap">{{ tree.growthDays }}/28 gün</span>
              </div>
              <div class="flex justify-end">
                <Button :icon-size="12" :icon="Axe" @click.stop="chopFruitTreeTarget = { id: tree.id, type: tree.type }">Kes</Button>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center justify-between">
                <span v-if="tree.todayFruit" class="text-[10px] text-accent">Bugün meyve verdi</span>
                <span v-else class="text-[10px] text-success">{{ getTreeFruitSeason(tree.type) }} mevsiminde verir</span>
                <Button :icon-size="12" :icon="Axe" @click.stop="chopFruitTreeTarget = { id: tree.id, type: tree.type }">Kes</Button>
              </div>
            </template>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-4 text-muted mb-2">
          <TreeDeciduous :size="32" class="text-muted/30" />
          <p class="text-xs mt-2">Meyve ağacı yok</p>
          <p class="text-[10px] text-muted/60 mt-0.5">Fidanı dükkândan alıp dikebilirsin</p>
        </div>
        <div v-if="plantableSaplings.length > 0 && farmStore.fruitTrees.length < MAX_FRUIT_TREES" class="flex space-x-1.5 flex-wrap">
          <Button v-for="s in plantableSaplings" :key="s.saplingId" :icon-size="12" :icon="TreePine" @click="handlePlantTree(s.type)">
            {{ s.name }} Dik (×{{ s.count }})
          </Button>
        </div>
      </div>

      <!-- Meyve ağacı kesme onay penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="chopFruitTreeTarget"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="chopFruitTreeTarget = null"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="chopFruitTreeTarget = null">
              <X :size="14" />
            </button>
            <p class="text-accent text-sm mb-2">Meyve Ağacını Kes</p>
            <p class="text-xs text-text mb-3">
              <span class="text-accent">{{ getTreeName(chopFruitTreeTarget.type) }}</span>
              ağacını kesmek istediğine emin misin? Kesilirse geri gelmez.
            </p>
            <div class="flex space-x-2">
              <Button class="flex-1" @click="chopFruitTreeTarget = null">Vazgeç</Button>
              <Button class="flex-1 !bg-danger !text-text" :icon-size="12" :icon="Axe" @click="confirmChopFruitTree">Kes</Button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Yabani ağaç kesme onay penceresi -->
      <Transition name="panel-fade">
        <div
          v-if="chopWildTreeTarget"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          @click.self="chopWildTreeTarget = null"
        >
          <div class="game-panel max-w-xs w-full relative">
            <button class="absolute top-2 right-2 text-muted hover:text-text" @click="chopWildTreeTarget = null">
              <X :size="14" />
            </button>
            <p class="text-accent text-sm mb-2">Odun Kes</p>
            <p class="text-xs text-text mb-2">
              <span class="text-accent">{{ getWildTreeName(chopWildTreeTarget.type) }}</span>
              için baltayı vurmak istediğine emin misin?
            </p>
            <p class="text-xs text-danger mb-3">
              Şimdiye dek {{ chopWildTreeTarget.chopCount }}/3 kez vuruldu, bir {{ 3 - chopWildTreeTarget.chopCount }} darbe daha sonra devrilir.
            </p>
            <div class="flex space-x-2">
              <Button class="flex-1" @click="chopWildTreeTarget = null">Vazgeç</Button>
              <Button
                class="flex-1"
                :class="chopWildTreeTarget.chopCount >= 2 ? '!bg-danger !text-text' : '!bg-accent !text-bg'"
                :icon-size="12"
                :icon="Axe"
                @click="confirmChopWildTree"
              >
                {{ chopWildTreeTarget.chopCount >= 2 ? 'Onayla' : 'Vur' }}
              </Button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Yabani ağaçlar alanı -->
      <div class="mt-3 border border-accent/20 rounded-xs p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-1.5 text-sm text-accent">
            <TreePine :size="14" />
            <span>Yabani Ağaçlar</span>
          </div>
          <span class="text-xs text-muted">{{ farmStore.wildTrees.length }}/{{ MAX_WILD_TREES }}</span>
        </div>
        <div v-if="farmStore.wildTrees.length > 0" class="flex flex-col space-y-1.5 mb-2">
          <div v-for="tree in farmStore.wildTrees" :key="tree.id" class="border border-accent/10 rounded-xs px-3 py-2">
            <!-- İlk satır: ağaç adı + durum -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center space-x-1.5">
                <span class="text-xs font-bold" :class="tree.mature ? 'text-accent' : 'text-muted'">{{ getWildTreeName(tree.type) }}</span>
                <span v-if="tree.chopCount > 0" class="text-[10px] text-danger">Kesim {{ tree.chopCount }}/3</span>
              </div>
              <span v-if="!tree.mature" class="text-[10px] text-muted">Büyüyor</span>
              <span v-else-if="tree.hasTapper && tree.tapReady" class="text-[10px] text-accent">Toplanabilir</span>
              <span v-else-if="tree.hasTapper" class="text-[10px] text-muted">Öz akıyor</span>
              <span v-else class="text-[10px] text-success">Olgun</span>
            </div>
            <!-- İkinci satır: ilerleme / ayrıntı + düğmeler -->
            <template v-if="!tree.mature">
              <div class="flex items-center space-x-2 mb-1.5">
                <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                  <div
                    class="h-full rounded-xs bg-success transition-all"
                    :style="{
                      width: Math.min(100, Math.floor((tree.growthDays / (getWildTreeDef(tree.type)?.growthDays ?? 28)) * 100)) + '%'
                    }"
                  />
                </div>
                <span class="text-[10px] text-muted whitespace-nowrap">
                  {{ tree.growthDays }}/{{ getWildTreeDef(tree.type)?.growthDays ?? '?' }} gün
                </span>
              </div>
            </template>
            <template v-else-if="tree.hasTapper">
              <div class="flex items-center space-x-2 mb-1.5">
                <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                  <div
                    class="h-full rounded-xs transition-all"
                    :class="tree.tapReady ? 'bg-accent' : 'bg-success'"
                    :style="{
                      width: tree.tapReady
                        ? '100%'
                        : Math.floor((tree.tapDaysElapsed / (getWildTreeDef(tree.type)?.tapCycleDays ?? 7)) * 100) + '%'
                    }"
                  />
                </div>
                <span class="text-[10px] text-muted whitespace-nowrap">
                  {{ tree.tapReady ? 'Hazır' : `${tree.tapDaysElapsed}/${getWildTreeDef(tree.type)?.tapCycleDays ?? '?'} gün` }}
                </span>
              </div>
            </template>
            <div class="flex items-center justify-end space-x-1.5">
              <Button
                v-if="tree.mature && tree.hasTapper && tree.tapReady"
                class="!bg-accent !text-bg"
                :icon-size="12"
                :icon="Gift"
                @click.stop="handleCollectTapProduct(tree.id)"
              >
                Topla
              </Button>
              <Button
                v-if="tree.mature && !tree.hasTapper && hasTapper"
                :icon-size="12"
                :icon="Wrench"
                @click.stop="handleAttachTapper(tree.id)"
              >
                Musluk Tak
              </Button>
              <span v-if="tree.mature && !tree.hasTapper && !hasTapper" class="text-[10px] text-muted">Önce öz musluğu yap</span>
              <Button v-if="tree.mature" :icon-size="12" :icon="Axe" @click.stop="handleChopTree(tree.id)">Kes</Button>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-4 text-muted mb-2">
          <TreePine :size="32" class="text-muted/30" />
          <p class="text-xs mt-2">Yabani ağaç yok</p>
          <p class="text-[10px] text-muted/60 mt-0.5">Yabani tohumla dikebilirsin</p>
        </div>
        <div v-if="plantableWildSeeds.length > 0 && farmStore.wildTrees.length < MAX_WILD_TREES" class="flex space-x-1.5 flex-wrap">
          <Button v-for="s in plantableWildSeeds" :key="s.type" :icon-size="12" :icon="TreePine" @click="handlePlantWildTree(s.type)">
            {{ s.name }} Dik (×{{ s.count }})
          </Button>
        </div>
      </div>
    </div>

    <!-- Sera penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showGreenhouseModal"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showGreenhouseModal = false"
      >
        <div class="game-panel max-w-sm w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showGreenhouseModal = false">
            <X :size="14" />
          </button>
          <div class="flex items-center space-x-1.5 text-sm text-accent mb-1">
            <Warehouse :size="14" />
            <span>Sera</span>
          </div>
          <p class="text-xs text-muted mb-3">Mevsimsiz · Kendi sulanır · {{ farmStore.greenhousePlots.length }} parça</p>

          <!-- İşlem düğmeleri -->
          <div class="flex space-x-2 mb-3">
            <Button
              class="flex-1 justify-center"
              :class="{ '!bg-accent !text-bg': ghHarvestableCount > 0 }"
              :disabled="ghHarvestableCount === 0"
              :icon-size="12"
              :icon="Wheat"
              @click="doGhBatchHarvest"
            >
              Hepsini Biç{{ ghHarvestableCount > 0 ? ` (${ghHarvestableCount} parça)` : '' }}
            </Button>
            <Button
              class="flex-1 justify-center"
              :disabled="ghTilledEmptyCount === 0 || allSeeds.length === 0"
              :icon-size="12"
              :icon="Sprout"
              @click="showGhBatchPlant = true"
            >
              Hepsini Ek{{ ghTilledEmptyCount > 0 ? ` (${ghTilledEmptyCount} parça)` : '' }}
            </Button>
            <Button v-if="nextGhUpgrade" class="flex-1 justify-center" :icon-size="12" :icon="ArrowUp" @click="showGhUpgradeModal = true">
              Serayı Büyüt
            </Button>
          </div>

          <!-- Sera parsel ızgarası -->
          <div class="grid gap-1 max-w-full" :style="{ gridTemplateColumns: `repeat(${ghGridCols}, minmax(0, 1fr))` }">
            <button
              v-for="plot in farmStore.greenhousePlots"
              :key="plot.id"
              class="aspect-square border border-accent/20 rounded-xs flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-accent/60 hover:bg-panel/80 leading-tight"
              :class="getPlotDisplay(plot).color"
              :title="getPlotTooltip(plot)"
              @click="activeGhPlotId = plot.id"
            >
              <component :is="getPlotDisplay(plot).icon" :size="14" />
              <span v-if="plot.cropId" class="text-[10px] opacity-70 truncate max-w-full px-0.5">{{ getCropName(plot.cropId) }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Sera büyütme onay penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showGhUpgradeModal && nextGhUpgrade"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showGhUpgradeModal = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showGhUpgradeModal = false">
            <X :size="14" />
          </button>
          <p class="text-accent text-sm mb-2">{{ nextGhUpgrade.name }}</p>
          <p class="text-xs text-muted mb-3">{{ nextGhUpgrade.description }}</p>

          <div class="border border-accent/10 rounded-xs p-2 mb-3">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="text-muted">Bedel</span>
              <span :class="playerStore.money >= nextGhUpgrade.cost ? 'text-success' : 'text-danger'">{{ nextGhUpgrade.cost }} akçe</span>
            </div>
            <div v-for="mat in nextGhUpgrade.materialCost" :key="mat.itemId" class="flex items-center justify-between text-xs">
              <span class="text-muted">{{ getItemName(mat.itemId) }}</span>
              <span :class="inventoryStore.getItemCount(mat.itemId) >= mat.quantity ? 'text-success' : 'text-danger'">
                {{ inventoryStore.getItemCount(mat.itemId) }}/{{ mat.quantity }}
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <Button class="flex-1" @click="showGhUpgradeModal = false">Vazgeç</Button>
            <Button class="flex-1 !bg-accent !text-bg" :icon-size="12" :icon="ArrowUp" @click="handleGhUpgrade">Onayla</Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Sera toplu ekim penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="showGhBatchPlant"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="showGhBatchPlant = false"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="showGhBatchPlant = false">
            <X :size="14" />
          </button>
          <p class="text-accent text-sm mb-2">Serada Toplu Ekim</p>
          <p class="text-xs text-muted mb-2">Boş sürülmüş alan {{ ghTilledEmptyCount }} parça, ekilecek tohumu seç:</p>
          <div class="flex flex-col space-y-1 max-h-60 overflow-y-auto">
            <button
              v-for="seed in allSeeds"
              :key="seed.cropId"
              class="btn text-xs justify-between mr-1 shrink-0"
              @click="doGhBatchPlant(seed.cropId)"
            >
              <span>
                {{ seed.name }}
                <span v-if="seed.regrowth" class="text-success ml-1">[Yeniden ürün]</span>
              </span>
              <span class="text-muted">×{{ seed.count }}</span>
            </button>
          </div>
          <div v-if="allSeeds.length === 0" class="flex flex-col items-center py-4">
            <Sprout :size="32" class="text-muted/30" />
            <p class="text-xs text-muted mt-2">Ekilecek tohum yok</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Sera parçası işlem penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="activeGhPlot"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="activeGhPlotId = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="activeGhPlotId = null">
            <X :size="14" />
          </button>
          <p class="text-accent text-sm mb-2">Sera Parçası #{{ activeGhPlot.id + 1 }}</p>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex flex-col space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted">Durum</span>
                <span class="text-xs">{{ ghPlotStateLabel }}</span>
              </div>
              <div v-if="activeGhPlot.cropId" class="flex items-center justify-between">
                <span class="text-xs text-muted">Ürün</span>
                <span class="text-xs">
                  {{ getCropName(activeGhPlot.cropId) }}
                  <span v-if="ghPlotCropRegrowth" class="text-success ml-1">
                    [Yeniden ürün {{ activeGhPlot.harvestCount }}/{{ ghPlotCropMaxHarvests }}]
                  </span>
                </span>
              </div>
              <div v-if="activeGhPlot.cropId && activeGhPlot.state !== 'harvestable'" class="flex items-center space-x-2">
                <span class="text-xs text-muted shrink-0">Büyüme</span>
                <div class="flex-1 h-1 bg-bg rounded-xs border border-accent/10">
                  <div
                    class="h-full rounded-xs bg-success transition-all"
                    :style="{
                      width: Math.min(100, Math.floor((activeGhPlot.growthDays / (Number(ghPlotCropGrowthDays) || 1)) * 100)) + '%'
                    }"
                  />
                </div>
                <span class="text-xs text-muted whitespace-nowrap">{{ activeGhPlot.growthDays }}/{{ ghPlotCropGrowthDays }} gün</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted">Özellik</span>
                <span class="text-xs text-water">Kendi sulanır · Mevsim şartı yok</span>
              </div>
            </div>
          </div>

          <!-- İşlem alanı -->
          <div class="flex flex-col space-y-1.5">
            <!-- Sürülmüş → ekim -->
            <div v-if="activeGhPlot.state === 'tilled' && allSeeds.length > 0" class="border border-accent/10 rounded-xs p-2">
              <p class="text-xs text-muted mb-1">Ekim</p>
              <div class="flex flex-wrap space-x-1">
                <Button v-for="seed in allSeeds" :key="seed.cropId" @click="doGhPlant(seed.cropId)">
                  {{ seed.name }}
                  <span v-if="seed.regrowth" class="text-success ml-1">[Yeniden ürün]</span>
                  (×{{ seed.count }})
                </Button>
              </div>
            </div>
            <!-- Sürülmüş ama tohum yok -->
            <div v-else-if="activeGhPlot.state === 'tilled'" class="flex flex-col items-center py-4">
              <Sprout :size="32" class="text-muted/30" />
              <p class="text-xs text-muted mt-2">Çantada tohum yok</p>
              <Button v-if="isWanwupuOpen" class="mt-2" :icon-size="12" :icon="Store" @click="goToShop">Dükkâna Git</Button>
              <p v-else class="text-[10px] text-muted/60 mt-1">{{ wanwupuClosedReason }}</p>
            </div>

            <!-- Biçilebilir → biç -->
            <Button
              v-if="activeGhPlot.state === 'harvestable'"
              class="w-full justify-center !bg-accent !text-bg"
              :icon-size="12"
              :icon="Wheat"
              @click="doGhHarvest"
            >
              Biç
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, type Component } from 'vue'
  import {
    Droplets,
    Droplet,
    TreePine,
    TreeDeciduous,
    ArrowUp,
    Wrench,
    Gift,
    CirclePlus,
    X,
    Shovel,
    Wheat,
    Sprout,
    Package,
    Warehouse,
    Store,
    Axe,
    Trash2,
    Bug,
    Leaf,
    Star,
    Bird,
    Zap,
    Square,
    Flower2
  } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import { useBreedingStore } from '@/stores/useBreedingStore'
  import { useCookingStore } from '@/stores/useCookingStore'
  import { useFarmStore } from '@/stores/useFarmStore'
  import { useGameStore, SEASON_NAMES } from '@/stores/useGameStore'
  import { useHomeStore } from '@/stores/useHomeStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import { useShopStore } from '@/stores/useShopStore'
  import { useSkillStore } from '@/stores/useSkillStore'
  import { useTutorialStore } from '@/stores/useTutorialStore'
  import { useWalletStore } from '@/stores/useWalletStore'
  import { getCropById, getCropsBySeason, getItemById } from '@/data'
  import { getStarRating } from '@/data/breeding'
  import { FRUIT_TREE_DEFS, MAX_FRUIT_TREES } from '@/data/fruitTrees'
  import { GREENHOUSE_UPGRADES } from '@/data/buildings'
  import { WILD_TREE_DEFS, MAX_WILD_TREES, getWildTreeDef } from '@/data/wildTrees'
  import { CROPS } from '@/data/crops'
  import { FERTILIZERS, getFertilizerById } from '@/data/processing'
  import { ACTION_TIME_COSTS } from '@/data/timeConstants'
  import { addLog, showFloat } from '@/composables/useGameLog'
  import { navigateToPanel } from '@/composables/useNavigation'
  import { handleEndDay } from '@/composables/useEndDay'
  import { getShopById, isShopAvailable, getShopClosedReason } from '@/data/shops'
  import {
    handlePlotClick,
    useFarmActions,
    handleBatchWater,
    handleBatchTill,
    handleBatchHarvest,
    handleBatchPlant,
    handleBatchFertilize,
    handleRemoveCrop,
    handleCurePest,
    handleBatchCurePest,
    handleClearWeed,
    handleBatchClearWeed,
    QUALITY_NAMES,
    applyCropBlessing
  } from '@/composables/useFarmActions'
  import type { SprinklerType, FertilizerType, FruitTreeType, WildTreeType, Quality } from '@/types'
  import { sfxHarvest, sfxPlant } from '@/composables/useAudio'

  const { selectedSeed } = useFarmActions()

  const farmTab = ref<'field' | 'tree'>('field')

  const farmStore = useFarmStore()
  const inventoryStore = useInventoryStore()
  const gameStore = useGameStore()
  const homeStore = useHomeStore()
  const playerStore = usePlayerStore()
  const shopStore = useShopStore()
  const breedingStore = useBreedingStore()

  // === Çiftlik özel işlevleri ===

  const tutorialStore = useTutorialStore()
  const tutorialHint = computed(() => {
    if (!tutorialStore.enabled || gameStore.year > 1) return null
    if (farmStore.plots.every(p => p.state === 'wasteland')) return 'Aşağıdaki “Toplu İşlem” menüsünden “Hepsini Belle”yi seçerek toprağı açabilir, ya da her parçaya ayrı ayrı dokunabilirsin.'
    const hasPlanted = farmStore.plots.some(p => p.state === 'planted' || p.state === 'growing' || p.state === 'harvestable')
    if (!hasPlanted && farmStore.plots.some(p => p.state === 'tilled'))
      return 'Sürülmüş toprağa ürün ekebilirsin. “Hepsini Ek” ile çantandaki tohumları topluca ekersin.'
    if (farmStore.plots.some(p => (p.state === 'planted' || p.state === 'growing') && !p.watered) && !gameStore.isRainy)
      return 'Ürünlerin büyümesi için her gün su gerekir. “Hepsini Sula” ile hepsini birden sulayabilirsin.'
    if (farmStore.plots.some(p => p.state === 'harvestable')) return 'Altın parlayan parçalar olgunlaşmıştır; “Hepsini Biç” ile topluca kaldırabilirsin.'
    return null
  })

  const surfaceOreName = computed(() => {
    const patch = gameStore.surfaceOrePatch
    if (!patch) return ''
    return getItemById(patch.oreId)?.name ?? 'Maden'
  })

  const handleCollectCreekCatch = () => {
    const catches = gameStore.creekCatch
    if (catches.length === 0) return
    const names: string[] = []
    const failed: typeof catches = []
    for (const c of catches) {
      const added = inventoryStore.addItem(c.fishId, 1, c.quality)
      if (added) {
        const fishDef = getItemById(c.fishId)
        if (fishDef) names.push(fishDef.name)
      } else {
        failed.push(c)
      }
    }
    gameStore.creekCatch = failed
    if (names.length > 0) {
      addLog(`Dere avı toplandı: ${names.join('、')}。`)
    }
    if (failed.length > 0) {
      addLog('Çanta dolu olduğu için bazı balıklar alınamadı.')
    }
  }

  const handleMineSurfaceOre = () => {
    const patch = gameStore.surfaceOrePatch
    if (!patch) return
    if (!playerStore.consumeStamina(5)) {
      addLog('Dayanıklılık yetmedi, kazılamadı.')
      return
    }
    const added = inventoryStore.addItem(patch.oreId, patch.quantity)
    if (!added) {
      playerStore.restoreStamina(5)
      addLog('Çanta dolu, kazı yapılamadı.')
      return
    }
    const oreName = getItemById(patch.oreId)?.name ?? 'Maden'
    const skillStore = useSkillStore()
    skillStore.addExp('mining', 8)
    gameStore.surfaceOrePatch = null
    addLog(`Yerüstü damarından ${patch.quantity} adet ${oreName} çıkarıldı.(+8 madencilik tecrübesi)`)
    const tr = gameStore.advanceTime(1)
    if (tr.message) addLog(tr.message)
    if (tr.passedOut) handleEndDay()
  }

  // === Sevkiyat sandığı ===

  const showShippingBox = ref(false)
  const showBatchPlant = ref(false)
  const showBatchFertilize = ref(false)
  const showBatchActions = ref(false)
  const showGreenhouseModal = ref(false)
  const showGhUpgradeModal = ref(false)
  const showGhBatchPlant = ref(false)
  const chopFruitTreeTarget = ref<{ id: number; type: string } | null>(null)
  const chopWildTreeTarget = ref<{ id: number; type: string; chopCount: number } | null>(null)

  const goToShop = () => {
    if (!isWanwupuOpen.value) {
      showFloat(wanwupuClosedReason.value, 'danger')
      return
    }
    activePlotId.value = null
    activeGhPlotId.value = null
    showBatchPlant.value = false
    showBatchFertilize.value = false
    showBatchActions.value = false
    showGreenhouseModal.value = false
    navigateToPanel('shop')
  }

  const wanwupu = getShopById('wanwupu')!

  const isWanwupuOpen = computed(() => {
    return isShopAvailable(wanwupu, gameStore.day, gameStore.hour, gameStore.weather, gameStore.season)
  })

  const wanwupuClosedReason = computed(() => {
    return '万物铺' + getShopClosedReason(wanwupu, gameStore.day, gameStore.hour, gameStore.weather, gameStore.season)
  })

  const getItemName = (itemId: string): string => getItemById(itemId)?.name ?? itemId

  const shippableItems = computed(() => {
    return inventoryStore.items
      .map(inv => ({ ...inv, def: getItemById(inv.itemId) }))
      .filter(item => item.def && item.def.category !== 'seed' && item.def.category !== 'machine' && item.def.category !== 'sprinkler')
  })

  const shippingBoxTotal = computed(() => {
    return shopStore.shippingBox.reduce((sum, entry) => sum + shopStore.calculateSellPrice(entry.itemId, entry.quantity, entry.quality), 0)
  })

  const handleAddToBox = (itemId: string, quantity: number, quality: Quality) => {
    if (shopStore.addToShippingBox(itemId, quantity, quality)) {
      const name = getItemName(itemId)
      addLog(`${name}×${quantity} sevkiyat sandığına kondu.`)
    }
  }

  const handleRemoveFromBox = (itemId: string, quantity: number, quality: Quality) => {
    if (shopStore.removeFromShippingBox(itemId, quantity, quality)) {
      const name = getItemName(itemId)
      addLog(`${name}×${quantity} sevkiyat sandığından çıkarıldı.`)
    }
  }

  // === Tarla pencere durumu ===

  const activePlotId = ref<number | null>(null)
  const activePlot = computed(() => (activePlotId.value !== null ? (farmStore.plots.find(p => p.id === activePlotId.value) ?? null) : null))

  const activeGhPlotId = ref<number | null>(null)
  const activeGhPlot = computed(() => (activeGhPlotId.value !== null ? (farmStore.greenhousePlots[activeGhPlotId.value] ?? null) : null))

  // === Pencere yardımcıları ===

  const STATE_LABELS: Record<string, string> = {
    wasteland: 'Bozkır',
    tilled: 'Sürülmüş',
    planted: 'Ekili',
    growing: 'Büyüyor',
    harvestable: 'Biçilebilir'
  }

  const plotStateLabel = computed(() => (activePlot.value ? (STATE_LABELS[activePlot.value.state] ?? '?') : ''))
  const ghPlotStateLabel = computed(() => (activeGhPlot.value ? (STATE_LABELS[activeGhPlot.value.state] ?? '?') : ''))

  const plotCropGrowthDays = computed(() => {
    if (!activePlot.value?.cropId) return '?'
    const baseDays = getCropById(activePlot.value.cropId)?.growthDays
    if (!baseDays) return '?'
    const fertDef = activePlot.value.fertilizer ? getFertilizerById(activePlot.value.fertilizer) : null
    const speedup = (fertDef?.growthSpeedup ?? 0) + useWalletStore().getCropGrowthBonus()
    return speedup > 0 ? Math.max(1, Math.floor(baseDays * (1 - speedup))) : baseDays
  })

  const plotCropRegrowth = computed(() => {
    if (!activePlot.value?.cropId) return false
    return getCropById(activePlot.value.cropId)?.regrowth ?? false
  })

  const plotCropMaxHarvests = computed(() => {
    if (!activePlot.value?.cropId) return 0
    return getCropById(activePlot.value.cropId)?.maxHarvests ?? 0
  })

  const ghPlotCropGrowthDays = computed(() => {
    if (!activeGhPlot.value?.cropId) return '?'
    const baseDays = getCropById(activeGhPlot.value.cropId)?.growthDays
    if (!baseDays) return '?'
    const fertDef = activeGhPlot.value.fertilizer ? getFertilizerById(activeGhPlot.value.fertilizer) : null
    const speedup = (fertDef?.growthSpeedup ?? 0) + useWalletStore().getCropGrowthBonus()
    return speedup > 0 ? Math.max(1, Math.floor(baseDays * (1 - speedup))) : baseDays
  })

  const ghPlotCropRegrowth = computed(() => {
    if (!activeGhPlot.value?.cropId) return false
    return getCropById(activeGhPlot.value.cropId)?.regrowth ?? false
  })

  const ghPlotCropMaxHarvests = computed(() => {
    if (!activeGhPlot.value?.cropId) return 0
    return getCropById(activeGhPlot.value.cropId)?.maxHarvests ?? 0
  })

  const plotFertName = computed(() => {
    if (!activePlot.value?.fertilizer) return ''
    return getFertilizerById(activePlot.value.fertilizer)?.name ?? activePlot.value.fertilizer
  })

  const canWater = computed(() => {
    if (!activePlot.value) return false
    return (activePlot.value.state === 'planted' || activePlot.value.state === 'growing') && !activePlot.value.watered
  })

  const canFertilize = computed(() => {
    if (!activePlot.value) return false
    return activePlot.value.state !== 'wasteland' && !activePlot.value.fertilizer
  })

  // === Çanta eşya listeleri ===

  const sprinklerItems = computed(() => {
    const types: { type: SprinklerType; itemId: string; name: string; colorClass: string }[] = [
      { type: 'bamboo_sprinkler', itemId: 'bamboo_sprinkler', name: 'Bambu Fıskiye', colorClass: '' },
      { type: 'copper_sprinkler', itemId: 'copper_sprinkler', name: 'Bakır Fıskiye', colorClass: 'text-quality-fine' },
      { type: 'gold_sprinkler', itemId: 'gold_sprinkler', name: 'Altın Fıskiye', colorClass: 'text-quality-supreme' }
    ]
    return types.map(s => ({ ...s, count: inventoryStore.getItemCount(s.itemId) })).filter(s => s.count > 0)
  })

  const fertilizerItems = computed(() => {
    return FERTILIZERS.map(f => ({
      type: f.id as FertilizerType,
      itemId: f.id,
      name: f.name,
      count: inventoryStore.getItemCount(f.id),
      colorClass: itemValueColor(f.shopPrice ?? 0)
    })).filter(f => f.count > 0)
  })

  const plantableSeeds = computed(() => {
    return getCropsBySeason(gameStore.season)
      .filter(crop => inventoryStore.hasItem(crop.seedId))
      .map(crop => ({
        cropId: crop.id,
        seedId: crop.seedId,
        name: crop.name,
        count: inventoryStore.getItemCount(crop.seedId),
        colorClass: cropValueColor(crop.sellPrice),
        regrowth: crop.regrowth ?? false,
        regrowthDays: crop.regrowthDays
      }))
  })

  /** Bu mevsim ekilebilen melez tohumları */
  const plantableBreedingSeeds = computed(() => {
    const season = gameStore.season
    return breedingStore.breedingBox.filter(seed => {
      const crop = getCropById(seed.genetics.cropId)
      if (!crop) return false
      return crop.season.includes(season)
    })
  })

  /** Ürün değeri rengi */
  const cropValueColor = (sellPrice: number): string => {
    if (sellPrice >= 180) return 'text-quality-supreme'
    if (sellPrice >= 100) return 'text-quality-excellent'
    if (sellPrice >= 60) return 'text-quality-fine'
    return ''
  }

  /** Eşya değeri rengi */
  const itemValueColor = (price: number): string => {
    if (price >= 100) return 'text-quality-supreme'
    if (price >= 75) return 'text-quality-excellent'
    if (price >= 40) return 'text-quality-fine'
    return ''
  }

  // === Tarla görünümü ===

  const getCropName = (cropId: string): string => {
    const crop = getCropById(cropId)
    return crop?.name ?? cropId
  }

  const hasSprinkler = (plotId: number): boolean => {
    return farmStore.sprinklers.some(s => s.plotId === plotId)
  }

  /** Fıskiye kapsama alanı */
  const sprinklerCoverage = computed(() => farmStore.getAllWateredBySprinklers())

  const isSprinklerCovered = (plotId: number): boolean => sprinklerCoverage.value.has(plotId)

  const needsWater = (plot: (typeof farmStore.plots)[number]): boolean => {
    return (plot.state === 'planted' || plot.state === 'growing') && !plot.watered && !sprinklerCoverage.value.has(plot.id)
  }

  const unwateredCount = computed(() => farmStore.plots.filter(needsWater).length)
  const wastelandCount = computed(() => farmStore.plots.filter(p => p.state === 'wasteland').length)
  const harvestableCount = computed(() => farmStore.plots.filter(p => p.state === 'harvestable').length)
  const tilledEmptyCount = computed(() => farmStore.plots.filter(p => p.state === 'tilled').length)
  const fertilizableCount = computed(() => farmStore.plots.filter(p => p.state !== 'wasteland' && !p.fertilizer).length)
  const infestedCount = computed(() => farmStore.plots.filter(p => p.infested).length)
  const weedyCount = computed(() => farmStore.plots.filter(p => p.weedy).length)

  const PLOT_LEGENDS: { icon: Component; color: string; label: string }[] = [
    { icon: Shovel, color: 'text-muted', label: 'Bozkır' },
    { icon: Square, color: 'text-earth', label: 'Sürülmüş' },
    { icon: Sprout, color: 'text-success/60', label: 'Ekili' },
    { icon: Flower2, color: 'text-success', label: 'Büyüyor' },
    { icon: Droplets, color: 'text-water', label: 'Sulandı' },
    { icon: Wheat, color: 'text-accent', label: 'Biçilebilir' },
    { icon: Star, color: 'text-accent', label: 'Dev' },
    { icon: Droplet, color: 'text-water', label: 'Fıskiye' },
    { icon: CirclePlus, color: 'text-success', label: 'Gübre' },
    { icon: Droplets, color: 'text-danger', label: 'Su ister' },
    { icon: Bug, color: 'text-danger', label: 'Haşere' },
    { icon: Leaf, color: 'text-success', label: 'Yabani ot' }
  ]

  const plotWarnings = computed(() => {
    const list: { color: string; text: string }[] = []
    if (unwateredCount.value > 0) list.push({ color: 'text-danger', text: `${unwateredCount.value} parça hâlâ su bekliyor` })
    if (infestedCount.value > 0) list.push({ color: 'text-danger', text: `${infestedCount.value} parçada haşere var` })
    if (weedyCount.value > 0) list.push({ color: 'text-success', text: `${weedyCount.value} parçada yabani ot var` })
    return list
  })

  const doBatchAction = (action: 'water' | 'till' | 'harvest' | 'plant' | 'fertilize' | 'curePest' | 'clearWeed') => {
    showBatchActions.value = false
    if (action === 'water') handleBatchWater()
    else if (action === 'till') handleBatchTill()
    else if (action === 'harvest') handleBatchHarvest()
    else if (action === 'plant') showBatchPlant.value = true
    else if (action === 'fertilize') showBatchFertilize.value = true
    else if (action === 'curePest') handleBatchCurePest()
    else if (action === 'clearWeed') handleBatchClearWeed()
  }

  /** cropId’e göre gruplanmış melez tohumları */
  const batchBreedingSeedGroups = computed(() => {
    const groups: Record<string, { cropId: string; name: string; count: number; minGen: number; maxGen: number }> = {}
    for (const seed of plantableBreedingSeeds.value) {
      const cid = seed.genetics.cropId
      if (!groups[cid]) {
        groups[cid] = { cropId: cid, name: getCropName(cid), count: 0, minGen: seed.genetics.generation, maxGen: seed.genetics.generation }
      }
      groups[cid]!.count++
      if (seed.genetics.generation < groups[cid]!.minGen) groups[cid]!.minGen = seed.genetics.generation
      if (seed.genetics.generation > groups[cid]!.maxGen) groups[cid]!.maxGen = seed.genetics.generation
    }
    return Object.values(groups)
  })

  const doBatchPlant = (cropId: string) => {
    handleBatchPlant(cropId)
    showBatchPlant.value = false
  }

  const doBatchPlantBreeding = (cropId: string) => {
    const skillStore = useSkillStore()
    const cookingStore = useCookingStore()
    const targets = farmStore.plots.filter(p => p.state === 'tilled')
    if (targets.length === 0) {
      addLog('Ekilecek boş sürülmüş tarla yok.')
      showBatchPlant.value = false
      return
    }
    const seeds = plantableBreedingSeeds.value.filter(s => s.genetics.cropId === cropId)
    let planted = 0
    const plantRingFarmReduction = inventoryStore.getRingEffectValue('farming_stamina')
    const plantRingGlobalReduction = inventoryStore.getRingEffectValue('stamina_reduction')
    for (const plot of targets) {
      if (seeds.length === 0) break
      const seed = seeds.shift()!
      const farmingBuff = cookingStore.activeBuff?.type === 'farming' ? cookingStore.activeBuff.value / 100 : 0
      const cost = Math.max(
        1,
        Math.floor(
          3 *
            inventoryStore.getToolStaminaMultiplier('hoe') *
            (1 - skillStore.getStaminaReduction('farming')) *
            (1 - farmingBuff) *
            (1 - plantRingFarmReduction) *
            (1 - plantRingGlobalReduction)
        )
      )
      if (!playerStore.consumeStamina(cost)) break
      if (farmStore.plantGeneticSeed(plot.id, seed.genetics)) {
        breedingStore.removeFromBox(seed.genetics.id)
        planted++
      }
    }
    if (planted > 0) {
      addLog(`${planted} adet melez tohum (${getCropName(cropId)}) topluca ekildi.(-${planted} dayanıklılık)`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant * planted)
      if (tr.message) addLog(tr.message)
    } else {
      addLog('Dayanıklılık yetmedi, ekim yapılamadı.')
    }
    showBatchPlant.value = false
  }

  const doBatchFertilize = (type: FertilizerType) => {
    handleBatchFertilize(type)
    showBatchFertilize.value = false
  }

  const doRemoveCrop = () => {
    if (activePlotId.value === null) return
    handleRemoveCrop(activePlotId.value)
    activePlotId.value = null
  }

  const doCurePest = () => {
    if (activePlotId.value === null) return
    handleCurePest(activePlotId.value)
    activePlotId.value = null
  }

  const doClearWeed = () => {
    if (activePlotId.value === null) return
    handleClearWeed(activePlotId.value)
    activePlotId.value = null
  }

  const getPlotDisplay = (plot: (typeof farmStore.plots)[number]): { icon: Component; color: string; bg: string } => {
    // Dev ürün özel görünüm
    if (plot.giantCropGroup !== null && plot.state === 'harvestable') {
      return { icon: Star, color: 'text-accent', bg: 'bg-accent/10' }
    }
    // Haşere görünümü
    if (plot.infested) {
      return { icon: Bug, color: 'text-danger', bg: 'bg-danger/10' }
    }
    // Ot görünümü
    if (plot.weedy) {
      return { icon: Leaf, color: 'text-success/70', bg: 'bg-success/10' }
    }
    switch (plot.state) {
      case 'wasteland':
        return { icon: Shovel, color: 'text-muted', bg: 'bg-panel/40' }
      case 'tilled':
        return { icon: Square, color: 'text-earth', bg: 'bg-earth/8' }
      case 'planted':
        return {
          icon: plot.watered ? Droplets : Sprout,
          color: plot.watered ? 'text-water' : 'text-success/60',
          bg: plot.watered ? 'bg-water/8' : 'bg-success/5'
        }
      case 'growing': {
        const crop = getCropById(plot.cropId!)
        const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
        const speedup = (fertDef?.growthSpeedup ?? 0) + useWalletStore().getCropGrowthBonus()
        const effectiveDays = crop ? (speedup > 0 ? Math.max(1, Math.floor(crop.growthDays * (1 - speedup))) : crop.growthDays) : 1
        const progress = crop ? Math.floor((plot.growthDays / effectiveDays) * 100) : 0
        return {
          icon: plot.watered ? Droplets : Leaf,
          color: plot.watered ? 'text-water' : progress > 60 ? 'text-success' : 'text-success/80',
          bg: plot.watered ? 'bg-water/8' : 'bg-success/8'
        }
      }
      case 'harvestable':
        return { icon: Wheat, color: 'text-accent', bg: 'bg-accent/15' }
      default:
        return { icon: Square, color: 'text-muted', bg: 'bg-panel/40' }
    }
  }

  const getPlotTooltip = (plot: (typeof farmStore.plots)[number]): string => {
    let tip = ''
    if (plot.state === 'wasteland') tip = 'Bozkır（dokun ve belle）'
    else if (plot.state === 'tilled') tip = 'Sürülmüş toprak（dokun ve ek）'
    else if (plot.state === 'harvestable') {
      const crop = getCropById(plot.cropId!)
      tip = `${crop?.name ?? ''} olgunlaştı（dokun ve biç）`
    } else if (plot.state === 'planted' || plot.state === 'growing') {
      const crop = getCropById(plot.cropId!)
      const fertDef = plot.fertilizer ? getFertilizerById(plot.fertilizer) : null
      const speedup = (fertDef?.growthSpeedup ?? 0) + useWalletStore().getCropGrowthBonus()
      const effectiveDays = crop ? (speedup > 0 ? Math.max(1, Math.floor(crop.growthDays * (1 - speedup))) : crop.growthDays) : '?'
      tip = `${crop?.name ?? ''} ${plot.growthDays}/${effectiveDays} gün ${plot.watered ? 'sulandı' : 'su bekliyor'}`
    }
    if (hasSprinkler(plot.id)) tip += ' [Fıskiye]'
    if (plot.fertilizer) {
      const fertDef = getFertilizerById(plot.fertilizer)
      tip += ` [${fertDef?.name ?? plot.fertilizer}]`
    }
    if (plot.infested) tip += ` [Haşere ${plot.infestedDays} gün]`
    if (plot.weedy) tip += ` [Yabani ot ${plot.weedyDays} gün]`
    return tip
  }

  // === Pencere işlemleri: tarla ===

  const doTill = () => {
    if (activePlotId.value === null) return
    selectedSeed.value = null
    handlePlotClick(activePlotId.value)
    activePlotId.value = null
  }

  const doPlant = (cropId: string) => {
    if (activePlotId.value === null) return
    selectedSeed.value = cropId
    handlePlotClick(activePlotId.value)
    selectedSeed.value = null
    activePlotId.value = null
  }

  const doPlantGeneticSeed = (seedId: string) => {
    if (activePlotId.value === null) return
    const seed = breedingStore.breedingBox.find(s => s.genetics.id === seedId)
    if (!seed) return
    if (farmStore.plantGeneticSeed(activePlotId.value, seed.genetics)) {
      breedingStore.removeFromBox(seedId)
      addLog(`Melez tohum ekildi: ${getCropName(seed.genetics.cropId)} G${seed.genetics.generation}。`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plant)
      if (tr.message) addLog(tr.message)
    }
    activePlotId.value = null
  }

  const doWater = () => {
    if (activePlotId.value === null) return
    selectedSeed.value = null
    handlePlotClick(activePlotId.value)
    activePlotId.value = null
  }

  const doHarvest = () => {
    if (activePlotId.value === null) return
    const plot = farmStore.plots.find(p => p.id === activePlotId.value)
    if (plot && plot.giantCropGroup !== null) {
      const result = farmStore.harvestGiantCrop(activePlotId.value)
      if (result) {
        inventoryStore.addItem(result.cropId, result.quantity)
        const cropName = getCropName(result.cropId)
        addLog(`Dev ${cropName} biçildi! ${result.quantity} adet ${cropName} kazanıldı!`)
        showFloat(`Dev ${cropName} ×${result.quantity}`, 'accent')
        sfxHarvest()
      }
      activePlotId.value = null
      return
    }
    selectedSeed.value = null
    handlePlotClick(activePlotId.value)
    activePlotId.value = null
  }

  const doFertilize = (type: FertilizerType) => {
    if (activePlotId.value === null) return
    if (!inventoryStore.removeItem(type)) {
      addLog('Bu gübre kalmadı.')
      return
    }
    if (farmStore.applyFertilizer(activePlotId.value, type)) {
      const fertDef = getFertilizerById(type)
      addLog(`${fertDef?.name ?? 'Gübre'} verildi.`)
    } else {
      inventoryStore.addItem(type)
      addLog('Buraya gübre verilemez（sürülmüş ve gübresiz olmalı）.')
    }
    activePlotId.value = null
  }

  const doPlaceSprinkler = (type: SprinklerType) => {
    if (activePlotId.value === null) return
    if (!inventoryStore.removeItem(type)) {
      addLog('Bu fıskiye kalmadı.')
      return
    }
    if (farmStore.placeSprinkler(activePlotId.value, type)) {
      addLog('Fıskiye yerleştirildi, çevresi kendi kendine sulanacak.')
    } else {
      inventoryStore.addItem(type)
      addLog('Buraya fıskiye yerleştirilemez.')
    }
    activePlotId.value = null
  }

  const doRemoveSprinkler = () => {
    if (activePlotId.value === null) return
    const plotId = activePlotId.value
    const type = farmStore.removeSprinkler(plotId)
    if (type) {
      if (inventoryStore.addItem(type)) {
        addLog('Fıskiye söküldü ve çantaya alındı.')
      } else {
        // Çanta doluysa geri koy
        farmStore.placeSprinkler(plotId, type)
        addLog('Çanta dolu, fıskiye geri alınamadı.')
      }
    }
    activePlotId.value = null
  }

  // === Meyve ağaçları ===

  const getTreeName = (type: string): string => {
    return FRUIT_TREE_DEFS.find(d => d.type === type)?.name ?? type
  }

  const getTreeFruitSeason = (type: string): string => {
    const def = FRUIT_TREE_DEFS.find(d => d.type === type)
    if (!def) return '?'
    return SEASON_NAMES[def.fruitSeason as keyof typeof SEASON_NAMES]
  }

  const plantableSaplings = computed(() => {
    return FRUIT_TREE_DEFS.filter(d => inventoryStore.hasItem(d.saplingId)).map(d => ({
      type: d.type as FruitTreeType,
      saplingId: d.saplingId,
      name: d.name,
      count: inventoryStore.getItemCount(d.saplingId)
    }))
  })

  const plantableWildSeeds = computed(() => {
    return WILD_TREE_DEFS.filter(d => inventoryStore.hasItem(d.seedItemId)).map(d => ({
      type: d.type as WildTreeType,
      seedItemId: d.seedItemId,
      name: d.name,
      count: inventoryStore.getItemCount(d.seedItemId)
    }))
  })

  const hasTapper = computed(() => inventoryStore.getItemCount('tapper') > 0)

  const handlePlantTree = (treeType: FruitTreeType) => {
    const def = FRUIT_TREE_DEFS.find(d => d.type === treeType)
    if (!def) return
    if (!inventoryStore.removeItem(def.saplingId)) {
      addLog('Çantada bu fidan yok.')
      return
    }
    if (farmStore.plantFruitTree(treeType)) {
      addLog(`${def.name} fidanı dikildi, 28 günde olgunlaşacak.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plantTree)
      if (tr.message) addLog(tr.message)
    } else {
      inventoryStore.addItem(def.saplingId)
      addLog(`Meyve ağacı yeri dolu（en çok ${MAX_FRUIT_TREES} ağaç）.`)
    }
  }

  const confirmChopFruitTree = () => {
    const target = chopFruitTreeTarget.value
    if (!target) return
    chopFruitTreeTarget.value = null
    if (gameStore.isPastBedtime) {
      addLog('Geç oldu, şimdi ağaç kesilemez.')
      return
    }
    if (!inventoryStore.isToolAvailable('axe')) {
      addLog('Balta yükseltmede, şimdi kullanılamaz.')
      return
    }
    const skillStore = useSkillStore()
    const cost = Math.max(
      1,
      Math.floor(5 * inventoryStore.getToolStaminaMultiplier('axe') * (1 - skillStore.getStaminaReduction('foraging')))
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Dayanıklılık yetmedi, ağaç kesilemez.')
      return
    }
    const treeName = getTreeName(target.type)
    const woodQty = farmStore.removeFruitTree(target.id)
    if (woodQty > 0) {
      inventoryStore.addItem('wood', woodQty)
      addLog(`${treeName} kesildi, ${woodQty} odun kazanıldı。（dayanıklılık -${cost}）`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.chopTree)
      if (tr.message) addLog(tr.message)
    }
  }

  // === Yabani ağaçlar ===

  const getWildTreeName = (type: string): string => {
    return getWildTreeDef(type)?.name ?? type
  }

  const handlePlantWildTree = (treeType: WildTreeType) => {
    const def = WILD_TREE_DEFS.find(d => d.type === treeType)
    if (!def) return
    if (!inventoryStore.removeItem(def.seedItemId)) {
      addLog('Çantada bu tohum yok.')
      return
    }
    if (farmStore.plantWildTree(treeType)) {
      addLog(`${def.name} dikildi, ${def.growthDays} günde büyüyecek.`)
      const tr = gameStore.advanceTime(ACTION_TIME_COSTS.plantTree)
      if (tr.message) addLog(tr.message)
    } else {
      inventoryStore.addItem(def.seedItemId)
      addLog(`Yabani ağaç yeri dolu（en çok ${MAX_WILD_TREES} ağaç）.`)
    }
  }

  const handleAttachTapper = (treeId: number) => {
    if (!inventoryStore.removeItem('tapper')) {
      addLog('Çantada öz musluğu yok.')
      return
    }
    if (farmStore.attachTapper(treeId)) {
      addLog('Öz musluğu takıldı, vakit geçtikçe reçine verecek.')
    } else {
      inventoryStore.addItem('tapper')
      addLog('Öz musluğu takılamadı（ağaç olgun olmalı ve üstünde musluk olmamalı）.')
    }
  }

  const handleCollectTapProduct = (treeId: number) => {
    const productId = farmStore.collectTapProduct(treeId)
    if (productId) {
      inventoryStore.addItem(productId)
      const def = WILD_TREE_DEFS.find(d => d.tapProduct === productId)
      addLog(`${def?.tapProductName ?? productId} toplandı!`)
    }
  }

  const handleChopTree = (treeId: number) => {
    const tree = farmStore.wildTrees.find(t => t.id === treeId)
    if (!tree) return
    chopWildTreeTarget.value = { id: tree.id, type: tree.type, chopCount: tree.chopCount }
  }

  const confirmChopWildTree = () => {
    const target = chopWildTreeTarget.value
    if (!target) return
    chopWildTreeTarget.value = null
    if (gameStore.isPastBedtime) {
      addLog('Geç oldu, şimdi odun kesilemez.')
      return
    }
    if (!inventoryStore.isToolAvailable('axe')) {
      addLog('Balta yükseltmede, şimdi kullanılamaz.')
      return
    }
    const skillStore = useSkillStore()
    const cost = Math.max(
      1,
      Math.floor(5 * inventoryStore.getToolStaminaMultiplier('axe') * (1 - skillStore.getStaminaReduction('foraging')))
    )
    if (!playerStore.consumeStamina(cost)) {
      addLog('Dayanıklılık yetmedi, odun kesilemez.')
      return
    }
    const baseQty = 2
    const hasLumberjack = skillStore.getSkill('foraging').perk5 === 'lumberjack' || skillStore.getSkill('foraging').perk10 === 'forester'
    const qty = baseQty + (hasLumberjack ? 2 : Math.random() < 0.5 ? 1 : 0)
    inventoryStore.addItem('wood', qty)
    const { removed } = farmStore.chopWildTree(target.id)
    const treeName = getWildTreeName(target.type)
    if (removed) {
      addLog(`${qty} odun elde edildi, ${treeName} devrilip yok oldu。（dayanıklılık -${cost}）`)
    } else {
      addLog(`${qty} odun elde edildi。（dayanıklılık -${cost}）`)
    }
    const tr = gameStore.advanceTime(ACTION_TIME_COSTS.chopTree)
    if (tr.message) addLog(tr.message)
  }

  // === Sera ===

  const showGreenhouse = computed(() => homeStore.greenhouseUnlocked)

  const ghHarvestableCount = computed(() => farmStore.greenhousePlots.filter(p => p.state === 'harvestable').length)

  const ghTilledEmptyCount = computed(() => farmStore.greenhousePlots.filter(p => p.state === 'tilled').length)

  const ghGridCols = computed(() => {
    const upgradeDef = GREENHOUSE_UPGRADES[farmStore.greenhouseLevel - 1]
    return upgradeDef?.gridCols ?? 4
  })

  const nextGhUpgrade = computed(() => GREENHOUSE_UPGRADES[farmStore.greenhouseLevel] ?? null)

  const allSeeds = computed(() => {
    return CROPS.filter(crop => inventoryStore.hasItem(crop.seedId)).map(crop => ({
      cropId: crop.id,
      seedId: crop.seedId,
      name: crop.name,
      count: inventoryStore.getItemCount(crop.seedId),
      regrowth: crop.regrowth ?? false
    }))
  })

  // === Pencere işlemleri: sera ===

  const doGhPlant = (cropId: string) => {
    if (activeGhPlotId.value === null) return
    const crop = getCropById(cropId)
    if (!crop) return
    if (!inventoryStore.removeItem(crop.seedId)) {
      addLog('Çantada bu tohum kalmadı.')
      return
    }
    if (farmStore.greenhousePlantCrop(activeGhPlotId.value, cropId)) {
      addLog(`Seraya ${crop.name} ekildi.`)
    } else {
      inventoryStore.addItem(crop.seedId)
    }
    activeGhPlotId.value = null
  }

  const doGhHarvest = () => {
    if (activeGhPlotId.value === null) return
    if (!playerStore.consumeStamina(1)) {
      addLog('Dayanıklılık yetmedi, biçilemedi.')
      return
    }
    const cropId = farmStore.greenhouseHarvestPlot(activeGhPlotId.value)
    if (cropId) {
      const cropDef = getCropById(cropId)
      const skillStore = useSkillStore()
      let quality = skillStore.rollCropQualityWithBonus(0)
      quality = applyCropBlessing(quality)
      inventoryStore.addItem(cropId, 1, quality)
      const qualityLabel = quality !== 'normal' ? `(${QUALITY_NAMES[quality]})` : ''
      sfxHarvest()
      showFloat(`+${cropDef?.name ?? cropId}${qualityLabel}`, 'success')
      addLog(`Serada ${cropDef?.name ?? cropId}${qualityLabel} biçildi!(-1 dayanıklılık)`)
    }
    activeGhPlotId.value = null
  }

  const doGhBatchHarvest = () => {
    const skillStore = useSkillStore()
    const results = farmStore.greenhouseBatchHarvest()
    if (results.length === 0) return
    let harvested = 0
    for (const { cropId } of results) {
      if (!playerStore.consumeStamina(1)) break
      harvested++
      let quality = skillStore.rollCropQualityWithBonus(0)
      quality = applyCropBlessing(quality)
      inventoryStore.addItem(cropId, 1, quality)
    }
    if (harvested > 0) {
      sfxHarvest()
      showFloat(`Sera biçimi ×${harvested}`, 'success')
      addLog(`Serada ${harvested} ürün topluca biçildi.(-${harvested} dayanıklılık)`)
    }
  }

  const doGhBatchPlant = (cropId: string) => {
    const crop = getCropById(cropId)
    if (!crop) return
    const targets = farmStore.greenhousePlots.filter(p => p.state === 'tilled')
    if (targets.length === 0) return
    let planted = 0
    for (const plot of targets) {
      if (!inventoryStore.hasItem(crop.seedId)) break
      if (!playerStore.consumeStamina(1)) break
      inventoryStore.removeItem(crop.seedId)
      farmStore.greenhousePlantCrop(plot.id, cropId)
      planted++
    }
    if (planted > 0) {
      sfxPlant()
      showFloat(`Serada ${crop.name} ×${planted}`, 'success')
      addLog(`Serada ${planted} adet ${crop.name} topluca ekildi.(-${planted} dayanıklılık)`)
    } else {
      addLog('Dayanıklılık ya da tohum yetmediği için ekim yapılamadı.')
    }
    showGhBatchPlant.value = false
  }

  const handleGhUpgrade = () => {
    const upgrade = nextGhUpgrade.value
    if (!upgrade) return
    for (const mat of upgrade.materialCost) {
      if (inventoryStore.getItemCount(mat.itemId) < mat.quantity) {
        addLog('Malzeme yetmedi, sera büyütülemedi.')
        return
      }
    }
    if (!playerStore.spendMoney(upgrade.cost)) {
      addLog('Akçe yetmedi, sera büyütülemedi.')
      return
    }
    for (const mat of upgrade.materialCost) {
      inventoryStore.removeItem(mat.itemId, mat.quantity)
    }
    farmStore.upgradeGreenhouse(upgrade.plotCount)
    addLog(`Sera ${upgrade.name} düzeyine çıktı!（${upgrade.plotCount} parça）`)
    showGhUpgradeModal.value = false
  }
</script>

<style scoped>
  .farm-plot {
    height: 0;
    padding-bottom: 100%;
  }
</style>
