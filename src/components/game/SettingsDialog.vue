<template>
  <Transition name="panel-fade">
    <div v-if="open" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
      <div class="game-panel w-full max-w-xs text-center relative">
        <button class="absolute top-2 right-2 text-muted hover:text-text" @click="$emit('close')">
          <X :size="14" />
        </button>
        <Divider title class="my-4" label="Ayarlar" />
        <!-- Sekme gezintisi -->
        <div class="grid grid-cols-3 justify-center gap-1 mb-3">
          <button
            v-for="tab in SETTINGS_TABS"
            :key="tab.key"
            class="text-xs py-1 px-3 border rounded-xs transition-colors"
            :class="activeTab === tab.key ? 'border-accent bg-accent/20 text-accent' : 'border-accent/20 text-muted hover:text-text'"
            @click="activeTab = tab.key"
          >
            <component :is="tab.icon" :size="12" class="inline-block align-[-2px] mr-1" />
            {{ tab.label }}
          </button>
        </div>

        <div class="flex flex-col space-y-3">
          <!-- ===== Genel ===== -->
          <template v-if="activeTab === 'general'">
            <div class="max-h-[40vh] overflow-y-auto">
              <!-- Zaman yönetimi -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Zaman akışı</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button :icon="isPaused ? Play : Pause" :icon-size="12" class="py-1 px-3" @click="togglePause">
                    {{ isPaused ? 'Sürdür' : 'Durdur' }}
                  </Button>
                  <Button class="py-1 px-3" @click="cycleSpeed">Hız {{ gameSpeed }}×</Button>
                </div>
              </div>

              <!-- Ses yönetimi -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Ses</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button :icon="sfxEnabled ? Volume2 : VolumeX" :icon-size="12" class="py-1 px-3" @click="toggleSfx">Efekt</Button>
                  <Button :icon="bgmEnabled ? Headphones : HeadphoneOff" :icon-size="12" class="py-1 px-3" @click="toggleBgm">Müzik</Button>
                </div>
              </div>

              <!-- Yeni başlayan yardımı -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 mb-2">
                <p class="text-xs text-muted mb-2">Başlangıç öğütleri</p>
                <p class="text-[10px] text-muted/50 mb-2">gaKöy muhtarının sabah öğütleri ve panel açıklamaları</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button class="py-1 px-3" :class="{ '!bg-accent !text-bg': tutorialStore.enabled }" @click="tutorialStore.enabled = true">
                    Açık
                  </Button>
                  <Button
                    class="py-1 px-3"
                    :class="{ '!bg-accent !text-bg': !tutorialStore.enabled }"
                    @click="tutorialStore.enabled = false"
                  >
                    Kapalı
                  </Button>
                </div>
              </div>

              <!-- WebDAV bulut eşitleme -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs text-muted">WebDAV bulut eşitleme</p>
                  <div class="flex space-x-1">
                    <Button
                      class="py-0.5 px-2 text-[10px]"
                      :class="{ '!bg-accent !text-bg': webdavConfig.enabled }"
                      @click="setWebdavEnabled(true)"
                    >
                      Açık
                    </Button>
                    <Button
                      class="py-0.5 px-2 text-[10px]"
                      :class="{ '!bg-accent !text-bg': !webdavConfig.enabled }"
                      @click="setWebdavEnabled(false)"
                    >
                      Kapalı
                    </Button>
                  </div>
                </div>
                <template v-if="webdavConfig.enabled">
                  <div class="flex flex-col space-y-2">
                    <div>
                      <label class="text-[10px] text-muted mb-0.5 block">Sunucu adresi</label>
                      <input
                        v-model="webdavConfig.serverUrl"
                        placeholder="WebDAV eşitleme sunucusunun adresini yaz"
                        class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                        @change="saveWebdavConfig"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] text-muted mb-0.5 block">Kayıt yolu</label>
                      <input
                        v-model="webdavConfig.path"
                        placeholder="Özel bir klasör istemiyorsan boş bırakabilirsin"
                        class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                        @change="saveWebdavConfig"
                      />
                      <p class="text-[10px] text-muted/50 mt-0.5">Buluttaki mevcut klasör adını yaz; boş kalırsa kök dizine kaydeder</p>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="text-[10px] text-muted mb-0.5 block">Kullanıcı adı</label>
                        <input
                          v-model="webdavConfig.username"
                          placeholder="Kullanıcı adını yaz"
                          class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                          @change="saveWebdavConfig"
                        />
                      </div>
                      <div>
                        <label class="text-[10px] text-muted mb-0.5 block">Parola</label>
                        <input
                          v-model="webdavConfig.password"
                          type="password"
                          placeholder="Parolanı yaz"
                          class="w-full px-2 py-1.5 bg-bg border border-accent/30 rounded-xs text-xs text-text focus:border-accent outline-none placeholder:text-muted/40 transition-colors"
                          @change="saveWebdavConfig"
                        />
                      </div>
                    </div>
                    <Button
                      class="py-1 px-3 text-xs w-full justify-center"
                      :disabled="webdavTestStatus === 'testing' || !webdavConfig.serverUrl"
                      @click="handleTestWebdav"
                    >
                      {{ webdavTestStatus === 'testing' ? 'Yoklanıyor...' : 'Bağlantıyı dene' }}
                    </Button>
                    <p v-if="webdavTestStatus === 'success'" class="text-success text-xs text-center mt-1">Bağlantı kuruldu</p>
                    <p v-if="webdavTestStatus === 'failed'" class="text-danger text-xs text-center mt-1">
                      {{ webdavTestError || 'Bağlantı kurulamadı' }}
                    </p>
                  </div>
                </template>
              </div>
            </div>
          </template>

          <!-- ===== Görünüş ===== -->
          <template v-if="activeTab === 'display'">
            <!-- Yazı boyu -->
            <div class="border border-accent/20 rounded-xs p-3">
              <p class="text-xs text-muted mb-2">Yazı boyu</p>
              <div class="flex items-center justify-center space-x-3">
                <Button
                  class="py-1 px-3"
                  :icon="Minus"
                  :icon-size="12"
                  :disabled="settingsStore.fontSize <= 12"
                  @click="settingsStore.changeFontSize(-1)"
                />
                <span class="text-sm w-8 text-center">{{ settingsStore.fontSize }}</span>
                <Button
                  class="py-1 px-3"
                  :icon="Plus"
                  :icon-size="12"
                  :disabled="settingsStore.fontSize >= 24"
                  @click="settingsStore.changeFontSize(1)"
                />
              </div>
            </div>

            <!-- Renk düzeni -->
            <div class="border border-accent/20 rounded-xs p-3">
              <p class="text-xs text-muted mb-2">Renk düzeni</p>
              <div class="flex items-center justify-center space-x-2">
                <button
                  v-for="t in THEMES"
                  :key="t.key"
                  class="w-8 h-8 border rounded-xs flex items-center justify-center text-[10px] transition-colors"
                  :class="settingsStore.theme === t.key ? 'border-accent' : 'border-accent/20'"
                  :style="{ backgroundColor: t.bg, color: t.text }"
                  :title="t.name"
                  @click="settingsStore.changeTheme(t.key)"
                >
                  {{ t.name.charAt(0) }}
                </button>
              </div>
            </div>
          </template>

          <!-- ===== Bildirim ===== -->
          <template v-if="activeTab === 'notification'">
            <div class="max-h-[40vh] overflow-y-auto flex flex-col space-y-3">
              <!-- Bildirim konumu -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Belirme yeri</p>
                <div class="grid grid-cols-3 gap-1 w-24 mx-auto">
                  <button
                    v-for="pos in QMSG_POSITIONS"
                    :key="pos.value"
                    class="w-8 h-6 border rounded-xs transition-colors flex items-center justify-center"
                    :class="
                      settingsStore.qmsgPosition === pos.value ? 'border-accent bg-accent/20 text-accent' : 'border-accent/20 text-muted'
                    "
                    :title="pos.label"
                    @click="settingsStore.changeQmsgPosition(pos.value)"
                  >
                    <component :is="pos.icon" :size="10" />
                  </button>
                </div>
              </div>

              <!-- Kalma süresi -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Kalma süresi</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button
                    class="py-0 px-1.5"
                    :icon="Minus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgTimeout <= 500"
                    @click="changeTimeout(-500)"
                  />
                  <span class="text-xs w-12 text-center">{{ (settingsStore.qmsgTimeout / 1000).toFixed(1) }} sn</span>
                  <Button
                    class="py-0 px-1.5"
                    :icon="Plus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgTimeout >= 10000"
                    @click="changeTimeout(500)"
                  />
                </div>
              </div>

              <!-- En çok bildirim -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">En çok sayı</p>
                <div class="flex items-center justify-center space-x-2">
                  <Button
                    class="py-0 px-1.5"
                    :icon="Minus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgMaxNums <= 1"
                    @click="changeMaxNums(-1)"
                  />
                  <span class="text-xs w-6 text-center">{{ settingsStore.qmsgMaxNums }}</span>
                  <Button
                    class="py-0 px-1.5"
                    :icon="Plus"
                    :icon-size="10"
                    :disabled="settingsStore.qmsgMaxNums >= 20"
                    @click="changeMaxNums(1)"
                  />
                </div>
              </div>

              <!-- Genişlik sınırı -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1">
                <p class="text-xs text-muted mb-2">Genişliği sınırla</p>
                <div class="flex items-center justify-center space-x-1 mb-2">
                  <Button
                    class="py-0 px-2"
                    :class="settingsStore.qmsgIsLimitWidth ? '!bg-accent/20 !text-accent !border-accent' : ''"
                    @click="setBool('qmsgIsLimitWidth', true)"
                  >
                    Açık
                  </Button>
                  <Button
                    class="py-0 px-2"
                    :class="!settingsStore.qmsgIsLimitWidth ? '!bg-accent/20 !text-accent !border-accent' : ''"
                    @click="setBool('qmsgIsLimitWidth', false)"
                  >
                    Kapalı
                  </Button>
                </div>
                <template v-if="settingsStore.qmsgIsLimitWidth">
                  <p class="text-xs text-muted mb-2">Genişlik (px)</p>
                  <div class="flex items-center justify-center space-x-2 mb-2">
                    <Button
                      class="py-0 px-1.5"
                      :icon="Minus"
                      :icon-size="10"
                      :disabled="settingsStore.qmsgLimitWidthNum <= 100"
                      @click="changeLimitWidth(-50)"
                    />
                    <span class="text-xs w-10 text-center">{{ settingsStore.qmsgLimitWidthNum }}</span>
                    <Button
                      class="py-0 px-1.5"
                      :icon="Plus"
                      :icon-size="10"
                      :disabled="settingsStore.qmsgLimitWidthNum >= 800"
                      @click="changeLimitWidth(50)"
                    />
                  </div>
                  <p class="text-xs text-muted mb-2">Taşarsa ne olsun</p>
                  <div class="flex items-center justify-center space-x-1">
                    <Button
                      v-for="opt in WRAP_OPTIONS"
                      :key="opt.value"
                      class="!text-[10px] py-0 px-1.5"
                      :class="settingsStore.qmsgLimitWidthWrap === opt.value ? '!bg-accent/20 !text-accent !border-accent' : ''"
                      @click="changeWrap(opt.value)"
                    >
                      {{ opt.label }}
                    </Button>
                  </div>
                </template>
              </div>

              <!-- Açık / kapalı seçenekler -->
              <div class="border border-accent/20 rounded-xs p-3 mr-1 flex flex-col space-y-2">
                <div v-for="opt in TOGGLE_OPTIONS" :key="opt.key" class="flex flex-col items-center space-y-1">
                  <span class="text-xs text-muted">{{ opt.label }}</span>
                  <div class="flex items-center space-x-1">
                    <Button
                      class="py-0 px-2"
                      :class="settingsStore[opt.key] ? '!bg-accent/20 !text-accent !border-accent' : ''"
                      @click="setBool(opt.key, true)"
                    >
                      Açık
                    </Button>
                    <Button
                      class="py-0 px-2"
                      :class="!settingsStore[opt.key] ? '!bg-accent/20 !text-accent !border-accent' : ''"
                      @click="setBool(opt.key, false)"
                    >
                      Kapalı
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Kayıt yönetimi (altta sabit) -->
        <Button :icon="FolderOpen" :icon-size="12" class="py-1 px-3 w-full justify-center mt-3" @click="showSaveManager = true">
          Kayıt işleri
        </Button>
      </div>
    </div>
  </Transition>

  <!-- Kayıt yönetimi penceresi -->
  <Transition name="panel-fade">
    <SaveManager v-if="showSaveManager" @close="showSaveManager = false" />
  </Transition>
</template>

<script setup lang="ts">
  import { ref, type Component } from 'vue'
  import {
    X,
    Pause,
    Play,
    Volume2,
    VolumeX,
    Headphones,
    HeadphoneOff,
    FolderOpen,
    Minus,
    Plus,
    ArrowUpLeft,
    ArrowUp,
    ArrowUpRight,
    ArrowLeft,
    Circle,
    ArrowRight,
    ArrowDownLeft,
    ArrowDown,
    ArrowDownRight,
    Settings,
    Palette,
    Bell
  } from 'lucide-vue-next'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'
  import { useAudio } from '@/composables/useAudio'
  import { useGameClock } from '@/composables/useGameClock'
  import { useSettingsStore, type QmsgPosition, type QmsgLimitWidthWrap } from '@/stores/useSettingsStore'
  import { useTutorialStore } from '@/stores/useTutorialStore'
  import { useWebdav } from '@/composables/useWebdav'
  import { THEMES } from '@/data/themes'
  import SaveManager from '@/components/game/SaveManager.vue'

  type SettingsTab = 'general' | 'display' | 'notification'

  type BoolSettingKey = 'qmsgIsLimitWidth' | 'qmsgAnimation' | 'qmsgAutoClose' | 'qmsgShowClose' | 'qmsgShowIcon' | 'qmsgShowReverse'

  const SETTINGS_TABS: { key: SettingsTab; label: string; icon: Component }[] = [
    { key: 'general', label: 'Genel', icon: Settings },
    { key: 'display', label: 'Görünüş', icon: Palette },
    { key: 'notification', label: 'Bildirim', icon: Bell }
  ]

  const QMSG_POSITIONS: { value: QmsgPosition; label: string; icon: Component }[] = [
    { value: 'topleft', label: 'Sol üst', icon: ArrowUpLeft },
    { value: 'top', label: 'Üst', icon: ArrowUp },
    { value: 'topright', label: 'Sağ üst', icon: ArrowUpRight },
    { value: 'left', label: 'Sol', icon: ArrowLeft },
    { value: 'center', label: 'Orta', icon: Circle },
    { value: 'right', label: 'Sağ', icon: ArrowRight },
    { value: 'bottomleft', label: 'Sol alt', icon: ArrowDownLeft },
    { value: 'bottom', label: 'Alt', icon: ArrowDown },
    { value: 'bottomright', label: 'Sağ alt', icon: ArrowDownRight }
  ]

  const WRAP_OPTIONS: { value: QmsgLimitWidthWrap; label: string }[] = [
    { value: 'no-wrap', label: 'Olduğu gibi' },
    { value: 'wrap', label: 'Alta geçir' },
    { value: 'ellipsis', label: 'Üç nokta' }
  ]

  const TOGGLE_OPTIONS: { key: BoolSettingKey; label: string }[] = [
    { key: 'qmsgAnimation', label: 'Belirme oyunu' },
    { key: 'qmsgAutoClose', label: 'Kendiliğinden kapansın' },
    { key: 'qmsgShowClose', label: 'Kapatma imi görünsün' },
    { key: 'qmsgShowIcon', label: 'Sol tarafta simge görünsün' },
    { key: 'qmsgShowReverse', label: 'Belirme yönü ters olsun' }
  ]

  defineProps<{ open: boolean }>()
  defineEmits<{ close: [] }>()

  const activeTab = ref<SettingsTab>('general')
  const { sfxEnabled, bgmEnabled, toggleSfx, toggleBgm } = useAudio()
  const { isPaused, gameSpeed, togglePause, cycleSpeed } = useGameClock()
  const settingsStore = useSettingsStore()
  const tutorialStore = useTutorialStore()
  const { webdavConfig, webdavTestStatus, webdavTestError, saveConfig: saveWebdavConfig, testConnection } = useWebdav()

  const showSaveManager = ref(false)

  const handleTestWebdav = async () => {
    await testConnection()
  }

  const setWebdavEnabled = (val: boolean) => {
    webdavConfig.value.enabled = val
    saveWebdavConfig()
  }

  const changeTimeout = (delta: number) => {
    settingsStore.qmsgTimeout = Math.min(10000, Math.max(500, settingsStore.qmsgTimeout + delta))
    settingsStore.syncQmsgConfig()
  }

  const changeMaxNums = (delta: number) => {
    settingsStore.qmsgMaxNums = Math.min(20, Math.max(1, settingsStore.qmsgMaxNums + delta))
    settingsStore.syncQmsgConfig()
  }

  const changeLimitWidth = (delta: number) => {
    settingsStore.qmsgLimitWidthNum = Math.min(800, Math.max(100, settingsStore.qmsgLimitWidthNum + delta))
    settingsStore.syncQmsgConfig()
  }

  const changeWrap = (value: QmsgLimitWidthWrap) => {
    settingsStore.qmsgLimitWidthWrap = value
    settingsStore.syncQmsgConfig()
  }

  const setBool = (key: BoolSettingKey, value: boolean) => {
    settingsStore[key] = value
    settingsStore.syncQmsgConfig()
  }
</script>
