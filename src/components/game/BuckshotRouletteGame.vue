<template>
  <div class="game-panel max-w-xs w-full">
    <Divider title class="!mb-1" label="Şeytan Çarkı" />

    <!-- Mermi yuvası bilgisi -->
    <div class="border border-accent/20 rounded-xs p-2 mb-3">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted">Mermi yatağı</span>
        <span>
          <span v-for="i in liveRemaining" :key="'l' + i" class="text-danger">&bull;</span>
          <span v-for="i in blankRemaining" :key="'b' + i" class="text-muted">&bull;</span>
          <span class="text-muted ml-1">({{ liveRemaining }} gerçek / {{ blankRemaining }} boş)</span>
        </span>
      </div>
      <div class="flex items-center justify-between text-xs mt-0.5">
        <span class="text-muted">Gidişat</span>
        <span>{{ shellIndex + 1 }}. atış / toplam {{ shells.length }} atış</span>
      </div>
    </div>

    <!-- Can gösterimi -->
    <div class="flex items-center space-x-3 mb-3">
      <!-- Oyuncu canı -->
      <div class="flex-1">
        <div class="flex items-center justify-between text-xs mb-0.5">
          <span :class="isPlayerTurn && !gameOver ? 'text-accent' : 'text-muted'">Sen</span>
          <span class="text-text">{{ playerHP }}/{{ maxPlayerHP }}</span>
        </div>
        <div class="h-1.5 bg-panel rounded-full overflow-hidden" :class="{ 'buckshot-flash-red': playerHit }">
          <div
            class="h-full transition-all duration-300"
            :class="playerHP > 2 ? 'bg-success' : playerHP > 1 ? 'bg-accent' : 'bg-danger'"
            :style="{ width: (playerHP / maxPlayerHP) * 100 + '%' }"
          />
        </div>
      </div>

      <span class="text-xs text-muted/40">VS</span>

      <!-- Krupiye canı -->
      <div class="flex-1">
        <div class="flex items-center justify-between text-xs mb-0.5">
          <span :class="!isPlayerTurn && !gameOver ? 'text-danger' : 'text-muted'">Krupiye</span>
          <span class="text-text">{{ dealerHP }}/{{ maxDealerHP }}</span>
        </div>
        <div class="h-1.5 bg-panel rounded-full overflow-hidden" :class="{ 'buckshot-flash-red': dealerHit }">
          <div
            class="h-full transition-all duration-300"
            :class="dealerHP > 2 ? 'bg-success' : dealerHP > 1 ? 'bg-accent' : 'bg-danger'"
            :style="{ width: (dealerHP / maxDealerHP) * 100 + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- İşlem düğmeleri -->
    <div v-if="isPlayerTurn && !gameOver" class="flex space-x-2 mb-3">
      <Button class="flex-1 justify-center" :disabled="animating" @click="shootOpponent">Krupiyeye ateş et</Button>
      <Button class="flex-1 justify-center" :disabled="animating" @click="shootSelf">Kendine ateş et</Button>
    </div>

    <!-- Krupiye sırası bildirimi -->
    <p v-if="!isPlayerTurn && !gameOver" class="text-xs text-muted/40 text-center mb-3">Krupiye düşünüyor…</p>

    <!-- Hamle günlüğü -->
    <div v-if="actionLog.length > 0" class="border border-accent/10 rounded-xs p-2 mb-3 max-h-24 overflow-y-auto">
      <p
        v-for="(log, i) in actionLog"
        :key="i"
        class="text-[10px] leading-relaxed"
        :class="i === actionLog.length - 1 ? 'text-text' : 'text-muted/60'"
      >
        {{ log }}
      </p>
    </div>

    <!-- Sonuç -->
    <template v-if="gameOver">
      <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
        <p class="text-sm" :class="won ? 'text-success' : draw ? 'text-accent' : 'text-danger'">
          {{ won ? 'Kazandın!' : draw ? 'Berabere' : 'Kaybettin…' }}
        </p>
        <p class="text-xs mt-0.5" :class="won ? 'text-success' : draw ? 'text-accent' : 'text-danger'">
          {{
            won
              ? '+' + BUCKSHOT_BET_AMOUNT * BUCKSHOT_WIN_MULTIPLIER + ' akçe'
              : draw
                ? BUCKSHOT_BET_AMOUNT + ' akçe geri verildi'
                : '-' + BUCKSHOT_BET_AMOUNT + ' akçe'
          }}
        </p>
      </div>
      <Button class="w-full justify-center" @click="emit('complete', won, draw)">Tamam</Button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, onMounted } from 'vue'
  import { BUCKSHOT_BET_AMOUNT, BUCKSHOT_WIN_MULTIPLIER, dealerDecide } from '@/data/hanhai'
  import { sfxGunshot, sfxGunEmpty, sfxCasinoWin, sfxCasinoLose } from '@/composables/useAudio'
  import type { BuckshotSetup, ShellType } from '@/types'
  import Button from '@/components/game/Button.vue'
  import Divider from '@/components/game/Divider.vue'

  const props = defineProps<{ setup: BuckshotSetup }>()
  const emit = defineEmits<{ complete: [won: boolean, draw: boolean] }>()

  // Oyun durumu
  const shells = ref<ShellType[]>([...props.setup.shells])
  const shellIndex = ref(0)
  const playerHP = ref(props.setup.playerHP)
  const dealerHP = ref(props.setup.dealerHP)
  const maxPlayerHP = props.setup.playerHP
  const maxDealerHP = props.setup.dealerHP
  const playerFirst = Math.random() < 0.5
  const isPlayerTurn = ref(playerFirst)
  const gameOver = ref(false)
  const won = ref(false)
  const draw = ref(false)
  const actionLog = ref<string[]>([])
  const animating = ref(false)

  // İsabet animasyonu
  const playerHit = ref(false)
  const dealerHit = ref(false)

  const liveRemaining = computed(() => {
    let count = 0
    for (let i = shellIndex.value; i < shells.value.length; i++) {
      if (shells.value[i] === 'live') count++
    }
    return count
  })

  const blankRemaining = computed(() => {
    let count = 0
    for (let i = shellIndex.value; i < shells.value.length; i++) {
      if (shells.value[i] === 'blank') count++
    }
    return count
  })

  const addActionLog = (msg: string) => {
    actionLog.value.push(msg)
  }

  const triggerHitAnim = (target: 'player' | 'dealer') => {
    if (target === 'player') {
      playerHit.value = true
      setTimeout(() => {
        playerHit.value = false
      }, 400)
    } else {
      dealerHit.value = true
      setTimeout(() => {
        dealerHit.value = false
      }, 400)
    }
  }

  const getCurrentShell = (): ShellType | null => {
    if (shellIndex.value >= shells.value.length) return null
    return shells.value[shellIndex.value]!
  }

  const consumeShell = () => {
    shellIndex.value++
  }

  const checkGameEnd = () => {
    if (playerHP.value <= 0) {
      gameOver.value = true
      won.value = false
      sfxCasinoLose()
      addActionLog('Yere serildin…')
      return true
    }
    if (dealerHP.value <= 0) {
      gameOver.value = true
      won.value = true
      sfxCasinoWin()
      addActionLog('Krupiye yere serildi!')
      return true
    }
    if (shellIndex.value >= shells.value.length) {
      // Mermiler biterse kalan cana bakılır
      if (playerHP.value > dealerHP.value) {
        gameOver.value = true
        won.value = true
        sfxCasinoWin()
        addActionLog('Mermiler tükendi; canın daha yüksek — kazandın!')
      } else if (playerHP.value < dealerHP.value) {
        gameOver.value = true
        won.value = false
        sfxCasinoLose()
        addActionLog('Mermiler tükendi; krupiyenin canı daha yüksek — kaybettin…')
      } else {
        // Berabere, bahis geri verilir
        gameOver.value = true
        draw.value = true
        addActionLog('Mermiler tükendi, canlar eşit — berabere!')
      }
      return true
    }
    return false
  }

  const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

  /** Oyuncu karşı tarafa ateş eder */
  const shootOpponent = async () => {
    if (animating.value || gameOver.value) return
    animating.value = true
    const shell = getCurrentShell()
    consumeShell()

    if (shell === 'live') {
      sfxGunshot()
      dealerHP.value = Math.max(0, dealerHP.value - 1)
      triggerHitAnim('dealer')
      addActionLog('Krupiyeye ateş ettin — gerçek mermi! Krupiye -1 can')
    } else {
      sfxGunEmpty()
      addActionLog('Krupiyeye ateş ettin — boş mermi, isabet yok.')
    }

    await nextTick()

    if (!checkGameEnd()) {
      isPlayerTurn.value = false
      await delay(800)
      animating.value = false
      void dealerTurn()
    } else {
      animating.value = false
    }
  }

  /** Oyuncu kendine ateş eder */
  const shootSelf = async () => {
    if (animating.value || gameOver.value) return
    animating.value = true
    const shell = getCurrentShell()
    consumeShell()

    if (shell === 'blank') {
      sfxGunEmpty()
      addActionLog('Kendine ateş ettin — boş mermi! Fazladan sıra kazandın.')
      // Fazladan sıra, el değişmez
      await delay(400)
      animating.value = false
      if (checkGameEnd()) return
    } else {
      sfxGunshot()
      playerHP.value = Math.max(0, playerHP.value - 1)
      triggerHitAnim('player')
      addActionLog('Kendine ateş ettin — gerçek mermi! -1 can')
      await nextTick()

      if (!checkGameEnd()) {
        isPlayerTurn.value = false
        await delay(800)
        animating.value = false
        void dealerTurn()
      } else {
        animating.value = false
      }
    }
  }

  /** Krupiye sırası */
  const dealerTurn = async () => {
    if (gameOver.value) return
    animating.value = true

    await delay(800)

    if (shellIndex.value >= shells.value.length) {
      checkGameEnd()
      animating.value = false
      return
    }

    const decision = dealerDecide(shells.value, shellIndex.value, false)
    const shell = getCurrentShell()
    consumeShell()

    if (decision === 'opponent') {
      // Oyuncuya ateş eder
      if (shell === 'live') {
        sfxGunshot()
        playerHP.value = Math.max(0, playerHP.value - 1)
        triggerHitAnim('player')
        addActionLog('Krupiye sana ateş etti — gerçek mermi! -1 can')
      } else {
        sfxGunEmpty()
        addActionLog('Krupiye sana ateş etti — boş mermi, isabet yok.')
      }
      await nextTick()

      if (!checkGameEnd()) {
        isPlayerTurn.value = true
        animating.value = false
      } else {
        animating.value = false
      }
    } else {
      // Kendine ateş eder
      if (shell === 'blank') {
        sfxGunEmpty()
        addActionLog('Krupiye kendine ateş etti — boş mermi! Fazladan sıra kazandı.')
        await delay(600)
        if (!checkGameEnd()) {
          await dealerTurn()
        } else {
          animating.value = false
        }
      } else {
        sfxGunshot()
        dealerHP.value = Math.max(0, dealerHP.value - 1)
        triggerHitAnim('dealer')
        addActionLog('Krupiye kendine ateş etti — gerçek mermi! Krupiye -1 can')
        await nextTick()

        if (!checkGameEnd()) {
          isPlayerTurn.value = true
          animating.value = false
        } else {
          animating.value = false
        }
      }
    }
  }

  onMounted(() => {
    if (playerFirst) {
      addActionLog('İlk sıra sende.')
    } else {
      addActionLog('İlk sıra krupiyede.')
      void dealerTurn()
    }
  })
</script>

<style scoped>
  .buckshot-flash-red {
    animation: buckshot-hit 0.3s ease-in-out;
  }

  @keyframes buckshot-hit {
    0%,
    100% {
      background-color: rgb(var(--color-panel));
    }
    50% {
      background-color: rgba(195, 64, 67, 0.4);
    }
  }
</style>
