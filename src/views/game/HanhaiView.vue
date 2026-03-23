<template>
  <div>
    <div class="flex items-center justify-between mb-1">
      <div class="flex items-center space-x-1.5 text-sm text-accent">
        <Tent :size="14" />
        <span>Kervansaray</span>
      </div>
      <span v-if="hanhaiStore.unlocked" class="text-xs text-success">Açık</span>
      <span v-else class="text-xs text-muted">Kapalı</span>
    </div>

    <!-- Açılmamış -->
    <div v-if="!hanhaiStore.unlocked" class="flex flex-col items-center justify-center py-10 space-y-3">
      <Tent :size="48" class="text-accent/30" />
      <p class="text-sm text-muted">Kervan yolu henüz açılmadı</p>
      <p class="text-xs text-muted/60 text-center max-w-60">Madenin 120. katındaki baş belasını yenip {{ HANHAI_UNLOCK_COST }} akçe yol bedeli ödemen gerekir</p>
      <Button v-if="bossDefeated" :class="canUnlock ? '!bg-accent !text-bg' : 'opacity-50'" :disabled="!canUnlock" @click="handleUnlock">
        Yolu Aç ({{ HANHAI_UNLOCK_COST }} akçe)
      </Button>
      <p v-if="bossDefeated && !canUnlock" class="text-xs text-danger">Akçe yetmiyor ({{ HANHAI_UNLOCK_COST }} akçe gerek)</p>
      <p v-if="!bossDefeated" class="text-xs text-danger">Önce madenin 120. katındaki baş belayı yenmelisin</p>
    </div>

    <!-- Açılmış -->
    <template v-else>
      <!-- Sekmeler -->
      <div class="flex space-x-1 mb-3">
        <Button class="flex-1 justify-center" :class="{ '!bg-accent !text-bg': activeTab === 'shop' }" @click="activeTab = 'shop'">
          Menzil Dükkânı
        </Button>
        <Button class="flex-1 justify-center" :class="{ '!bg-accent !text-bg': activeTab === 'casino' }" @click="activeTab = 'casino'">
          Talih Hanı
        </Button>
      </div>

      <!-- Menzil Dükkânı -->
      <template v-if="activeTab === 'shop'">
        <div class="flex flex-col space-y-1 max-h-80 overflow-y-auto">
          <div
            v-for="item in HANHAI_SHOP_ITEMS"
            :key="item.itemId"
            class="flex items-center justify-between border border-accent/20 rounded-xs px-3 py-2 cursor-pointer hover:bg-accent/5 transition-colors mr-1"
            @click="shopModalItem = item"
          >
            <div class="flex-1 min-w-0">
              <p class="text-xs truncate">{{ item.name }}</p>
              <p class="text-xs text-muted truncate">{{ item.description }}</p>
            </div>
            <div class="flex flex-col items-end ml-2 shrink-0">
              <span class="text-xs text-accent">{{ item.price }} akçe</span>
              <span
                v-if="item.weeklyLimit"
                class="text-[10px]"
                :class="hanhaiStore.getWeeklyRemaining(item.itemId) > 0 ? 'text-muted' : 'text-danger'"
              >
                Hafta sınırı {{ hanhaiStore.getWeeklyRemaining(item.itemId) }}/{{ item.weeklyLimit }}
              </span>
            </div>
          </div>
        </div>
        <!-- Hazine haritası -->
        <Button v-if="treasureMapCount > 0" :icon="Map" :icon-size="12" class="w-full justify-center mt-2" @click="handleUseTreasureMap">
          Hazine Haritasıyla Ara ({{ treasureMapCount }} adet)
        </Button>
      </template>

      <!-- Talih Hanı -->
      <template v-if="activeTab === 'casino'">
        <div class="border border-accent/20 rounded-xs p-2 mb-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Bugün kalan hak</span>
            <span class="text-xs" :class="hanhaiStore.canBet ? 'text-accent' : 'text-danger'">
              {{ hanhaiStore.betsRemaining }}/{{ MAX_DAILY_BETS }}
            </span>
          </div>
        </div>

        <!-- Hak bitmiş -->
        <div v-if="!hanhaiStore.canBet" class="flex flex-col items-center justify-center py-8 space-y-3">
          <Dices :size="48" class="text-accent/30" />
          <p class="text-sm text-muted">Bugünkü oyun hakkın bitti</p>
          <p class="text-xs text-muted/60">Yarın yeniden gelip talihini deneyebilirsin</p>
        </div>

        <div v-else class="flex flex-col space-y-2">
          <!-- Talih Çarkı -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <CircleDot :size="12" />
              <span>Talih Çarkı</span>
            </p>
            <p class="text-xs text-muted mb-2">Bahis miktarını seç, çarkı döndür ve katlı ödül kazan</p>
            <div class="flex space-x-1">
              <Button
                v-for="tier in ROULETTE_BET_TIERS"
                :key="tier"
                class="flex-1 justify-center"
                :disabled="playerStore.money < tier"
                @click="handleRoulette(tier)"
              >
                {{ tier }} akçe
              </Button>
            </div>
          </div>

          <!-- Zarla Büyük Küçük -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <Dices :size="12" />
              <span>Zarla Büyük Küçük</span>
            </p>
            <p class="text-xs text-muted mb-2">{{ DICE_BET_AMOUNT }} akçe koy, doğru bilirsen 2 kat al</p>
            <div class="flex space-x-1">
              <Button class="flex-1 justify-center" :disabled="playerStore.money < DICE_BET_AMOUNT" @click="handleDice(false)">
                Küçük (2-6)
              </Button>
              <Button class="flex-1 justify-center" :disabled="playerStore.money < DICE_BET_AMOUNT" @click="handleDice(true)">
                Büyük (7-12)
              </Button>
            </div>
          </div>

          <!-- Kupa Tahmini -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <Trophy :size="12" />
              <span>Kupa Oyunu</span>
            </p>
            <p class="text-xs text-muted mb-2">{{ CUP_BET_AMOUNT }} akçe koy, 3 kupadan doğruyu bulursan {{ CUP_WIN_MULTIPLIER }} kat al</p>
            <div class="flex space-x-1">
              <Button
                v-for="i in 3"
                :key="i"
                class="flex-1 justify-center"
                :disabled="playerStore.money < CUP_BET_AMOUNT"
                @click="handleCup(i - 1)"
              >
                {{ i }}. Kupa
              </Button>
            </div>
          </div>

          <!-- Cırcır Böceği Dövüşü -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <Bug :size="12" />
              <span>Cırcır Dövüşü</span>
            </p>
            <p class="text-xs text-muted mb-2">{{ CRICKET_BET_AMOUNT }} akçe koy, böceğini seç, kazanırsan {{ CRICKET_WIN_MULTIPLIER }} kat al</p>
            <div class="flex space-x-1">
              <Button
                v-for="c in CRICKETS"
                :key="c.id"
                class="flex-1 justify-center"
                :disabled="playerStore.money < CRICKET_BET_AMOUNT"
                @click="handleCricket(c)"
              >
                {{ c.name }}
              </Button>
            </div>
          </div>

          <!-- Kart Çevir Hazine Bul -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <Gem :size="12" />
              <span>Kartta Hazine</span>
            </p>
            <p class="text-xs text-muted mb-2">{{ CARD_BET_AMOUNT }} akçe koy, {{ CARD_TOTAL }} karttan {{ CARD_TREASURE_COUNT }} tanesinde hazine var</p>
            <div class="flex space-x-1">
              <Button
                v-for="i in CARD_TOTAL"
                :key="i"
                class="flex-1 justify-center"
                :disabled="playerStore.money < CARD_BET_AMOUNT"
                @click="handleCardFlip(i - 1)"
              >
                {{ i }}
              </Button>
            </div>
          </div>

          <!-- Hanhai Poker -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <Spade :size="12" />
              <span>Kervansaray Pokeri</span>
            </p>
            <p class="text-xs text-muted mb-2">Masa seçip otur; giriş parası fişin olur, her elde kâhya payını alır</p>
            <div class="flex flex-col space-y-1">
              <div
                v-for="t in TEXAS_TIERS"
                :key="t.id"
                class="flex items-center justify-between border border-accent/10 rounded-xs px-2 py-1.5"
              >
                <div class="flex-1 min-w-0">
                  <p class="text-xs">{{ t.name }}</p>
                  <p class="text-xs text-muted">Giriş {{ t.entryFee }} akçe + kâhya payı {{ t.rake }} akçe · kör bahis {{ t.blind }} · {{ t.rounds }} el</p>
                </div>
                <Button class="ml-2 shrink-0" :disabled="playerStore.money < t.minMoney" @click="handleTexas(t.id)">
                  {{ playerStore.money < t.minMoney ? `${t.minMoney} akçe gerek` : 'Otur' }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Şeytan Çarkı -->
          <div class="border border-accent/20 rounded-xs p-2">
            <p class="text-xs text-accent mb-2 flex items-center space-x-1">
              <Crosshair :size="12" />
              <span>Şeytan Çarkı</span>
            </p>
            <p class="text-xs text-muted mb-2">{{ BUCKSHOT_BET_AMOUNT }} akçe koy, tefeciyle sırayla tetiğe dokun; galip {{ BUCKSHOT_WIN_MULTIPLIER }} kat alır</p>
            <Button class="w-full justify-center" :disabled="playerStore.money < BUCKSHOT_BET_AMOUNT" @click="handleBuckshot">Meydan Oku</Button>
          </div>
        </div>
      </template>

      <!-- Alt istatistik -->
      <div class="mt-3 border border-accent/20 rounded-xs p-2">
        <div class="grid grid-cols-2 gap-x-3 gap-y-0.5">
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Eldeki akçe</span>
            <span class="text-xs">{{ playerStore.money }} akçe</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">Bugünkü oyun</span>
            <span class="text-xs">{{ MAX_DAILY_BETS - hanhaiStore.betsRemaining }}/{{ MAX_DAILY_BETS }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Ürün alma penceresi -->
    <Transition name="panel-fade">
      <div
        v-if="shopModalItem"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        @click.self="shopModalItem = null"
      >
        <div class="game-panel max-w-xs w-full relative">
          <button class="absolute top-2 right-2 text-muted hover:text-text" @click="shopModalItem = null">
            <X :size="14" />
          </button>

          <p class="text-sm text-accent mb-2">{{ shopModalItem.name }}</p>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <p class="text-xs text-muted">{{ shopModalItem.description }}</p>
          </div>

          <div class="border border-accent/10 rounded-xs p-2 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted">Bedel</span>
              <span class="text-xs text-accent">{{ shopModalItem.price }} akçe</span>
            </div>
            <div class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Elindeki</span>
              <span class="text-xs">{{ playerStore.money }} akçe</span>
            </div>
            <div v-if="shopModalItem.weeklyLimit" class="flex items-center justify-between mt-0.5">
              <span class="text-xs text-muted">Bu hafta sınırı</span>
              <span class="text-xs" :class="hanhaiStore.getWeeklyRemaining(shopModalItem.itemId) > 0 ? '' : 'text-danger'">
                Kalan {{ hanhaiStore.getWeeklyRemaining(shopModalItem.itemId) }}/{{ shopModalItem.weeklyLimit }}
              </span>
            </div>
          </div>

          <Button
            class="w-full justify-center !bg-accent !text-bg"
            :disabled="playerStore.money < shopModalItem.price || hanhaiStore.getWeeklyRemaining(shopModalItem.itemId) <= 0"
            @click="handleBuyItem(shopModalItem.itemId)"
          >
            {{ hanhaiStore.getWeeklyRemaining(shopModalItem.itemId) <= 0 ? 'Bu hafta tükendi' : 'Satın Al' }}
          </Button>
        </div>
      </div>
    </Transition>

    <!-- Talih Çarkı penceresi -->
    <Transition name="panel-fade">
      <div v-if="showRouletteModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div class="game-panel max-w-xs w-full">
          <p class="text-sm text-accent text-center mb-1">Talih Çarkı</p>
          <p class="text-xs text-muted text-center mb-3">Bahis {{ rouletteBetAmount }} akçe</p>

          <!-- Çark dilimleri -->
          <div class="flex flex-col space-y-1 mb-3">
            <div
              v-for="(outcome, i) in ROULETTE_OUTCOMES"
              :key="i"
              class="border rounded-xs px-3 py-1.5 text-xs text-center transition-all duration-100"
              :class="rouletteHighlight === i ? 'border-accent bg-accent/15 text-accent' : 'border-accent/10 text-muted/40'"
            >
              {{ outcome.label }}
              <span class="ml-1 opacity-60">×{{ outcome.multiplier }}</span>
            </div>
          </div>

          <!-- Sonuç -->
          <template v-if="roulettePhase === 'done' && rouletteAnimResult">
            <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
              <p class="text-sm mb-0.5" :class="rouletteAnimResult.multiplier > 0 ? 'text-success' : 'text-danger'">
                {{ rouletteAnimResult.multiplier > 0 ? 'Talih güldü!' : 'Bu kez nasip değil…' }}
              </p>
              <p v-if="rouletteAnimResult.multiplier > 0" class="text-xs text-success">+{{ rouletteAnimResult.winnings }} akçe</p>
              <p v-else class="text-xs text-danger">-{{ rouletteBetAmount }} akçe</p>
            </div>
            <Button class="w-full justify-center" @click="showRouletteModal = false">Tamam</Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Zar penceresi -->
    <Transition name="panel-fade">
      <div v-if="showDiceModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div class="game-panel max-w-xs w-full">
          <p class="text-sm text-accent text-center mb-1">Zarla Büyük Küçük</p>
          <p class="text-xs text-muted text-center mb-4">
            Seçimin:
            <span class="text-accent">{{ diceGuessIsBig ? 'Büyük (7-12)' : 'Küçük (2-6)' }}</span>
          </p>

          <!-- Zar yüzleri -->
          <div class="flex justify-center space-x-4 mb-3">
            <div v-for="(val, di) in diceDisplay" :key="di" class="dice-face" :class="{ 'dice-rolling': dicePhase === 'rolling' }">
              <div v-for="pos in 9" :key="pos" class="flex items-center justify-center">
                <div
                  v-if="DICE_DOTS[val]?.includes(pos - 1)"
                  class="w-2.5 h-2.5 rounded-full transition-colors"
                  :class="dicePhase === 'rolling' ? 'bg-muted/60' : 'bg-text'"
                />
              </div>
            </div>
          </div>

          <!-- Toplam -->
          <p v-if="dicePhase !== 'rolling'" class="text-xs text-center mb-3">
            <span class="text-muted">{{ diceDisplay[0] }} + {{ diceDisplay[1] }} =</span>
            <span class="text-accent">{{ diceSum }}</span>
            <span class="text-muted">（{{ diceSum >= 7 ? 'Büyük' : 'Küçük' }}）</span>
          </p>
          <p v-else class="text-xs text-muted/40 text-center mb-3">Zarlar dönüyor…</p>

          <!-- Sonuç -->
          <template v-if="dicePhase === 'done' && diceAnimResult">
            <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
              <p class="text-sm" :class="diceAnimResult.won ? 'text-success' : 'text-danger'">
                {{ diceAnimResult.won ? 'Bildin!' : 'Tutmadı…' }}
              </p>
              <p class="text-xs mt-0.5" :class="diceAnimResult.won ? 'text-success' : 'text-danger'">
                {{ diceAnimResult.won ? '+' + diceAnimResult.winnings + ' akçe' : '-' + DICE_BET_AMOUNT + ' akçe' }}
              </p>
            </div>
            <Button class="w-full justify-center" @click="showDiceModal = false">Tamam</Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Kupa oyunu penceresi -->
    <Transition name="panel-fade">
      <div v-if="showCupModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div class="game-panel max-w-xs w-full">
          <p class="text-sm text-accent text-center mb-1">Kupa Oyunu</p>
          <p class="text-xs text-muted text-center mb-4">{{ cupGuess + 1 }}. kupayı seçtin</p>

          <!-- Üç kupa -->
          <div class="flex justify-center space-x-3 mb-3">
            <div
              v-for="i in 3"
              :key="i"
              class="cup-box"
              :class="{
                'cup-highlight': cupPhase === 'shuffling' && cupShuffleIndex === i - 1,
                'cup-correct': cupPhase === 'done' && cupAnimResult && cupAnimResult.correctCup === i - 1,
                'cup-picked': cupPhase === 'done' && cupGuess === i - 1 && cupAnimResult && !cupAnimResult.won
              }"
            >
              <div class="cup-body" :class="{ 'cup-shake': cupPhase === 'shuffling' }">
                <Trophy :size="20" class="text-accent/60" />
              </div>
              <p
                class="text-xs text-center mt-1"
                :class="cupPhase === 'done' && cupAnimResult?.correctCup === i - 1 ? 'text-accent' : 'text-muted/40'"
              >
                {{ i }}
              </p>
              <div
                v-if="cupPhase === 'done' && cupAnimResult?.correctCup === i - 1"
                class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success flex items-center justify-center"
              >
                <Check :size="10" class="text-bg" />
              </div>
            </div>
          </div>

          <p v-if="cupPhase === 'shuffling'" class="text-xs text-muted/40 text-center mb-3">Kupalar karıştırılıyor…</p>

          <!-- Sonuç -->
          <template v-if="cupPhase === 'done' && cupAnimResult">
            <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
              <p class="text-sm" :class="cupAnimResult.won ? 'text-success' : 'text-danger'">
                {{ cupAnimResult.won ? 'Doğru kupa!' : 'Yanlış kupa…' }}
              </p>
              <p class="text-xs mt-0.5" :class="cupAnimResult.won ? 'text-success' : 'text-danger'">
                {{ cupAnimResult.won ? '+' + cupAnimResult.winnings + ' akçe' : '-' + CUP_BET_AMOUNT + ' akçe' }}
              </p>
            </div>
            <Button class="w-full justify-center" @click="showCupModal = false">Tamam</Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Cırcır dövüşü penceresi -->
    <Transition name="panel-fade">
      <div v-if="showCricketModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div class="game-panel max-w-xs w-full">
          <p class="text-sm text-accent text-center mb-1">Cırcır Dövüşü</p>
          <p class="text-xs text-muted text-center mb-4">
            Senin böceğin:
            <span class="text-accent">{{ cricketChoiceName }}</span>
          </p>

          <!-- Karşılaşma -->
          <div class="flex items-center justify-between space-x-2 mb-3">
            <!-- Oyuncu -->
            <div class="flex-1 text-center">
              <p class="text-xs text-accent mb-1">{{ cricketChoiceName }}</p>
              <div class="border border-accent/20 rounded-xs p-2">
                <div class="cricket-icon" :class="{ 'cricket-fight': cricketPhase === 'fighting' }">
                  <Bug :size="24" class="text-accent" />
                </div>
                <div class="mt-1 h-1.5 bg-panel rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-500"
                    :class="
                      cricketPhase === 'fighting'
                        ? 'bg-accent/40'
                        : cricketAnimResult && cricketAnimResult.won
                          ? 'bg-success'
                          : cricketAnimResult && cricketAnimResult.draw
                            ? 'bg-accent'
                            : 'bg-danger'
                    "
                    :style="{
                      width:
                        cricketPhase === 'fighting'
                          ? (cricketDisplayPower[0] ?? 5) * 10 + '%'
                          : (cricketAnimResult?.playerPower ?? 0) * 10 + '%'
                    }"
                  />
                </div>
                <p class="text-xs mt-0.5" :class="cricketPhase === 'fighting' ? 'text-muted/40' : 'text-accent'">
                  {{ cricketPhase === 'fighting' ? '?' : cricketAnimResult?.playerPower }}
                </p>
              </div>
            </div>

            <span class="text-xs text-muted/40">VS</span>

            <!-- Rakip -->
            <div class="flex-1 text-center">
              <p class="text-xs text-danger mb-1">Rakip</p>
              <div class="border border-danger/20 rounded-xs p-2">
                <div class="cricket-icon" :class="{ 'cricket-fight': cricketPhase === 'fighting' }">
                  <Bug :size="24" class="text-danger -scale-x-100" />
                </div>
                <div class="mt-1 h-1.5 bg-panel rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-500"
                    :class="
                      cricketPhase === 'fighting'
                        ? 'bg-danger/40'
                        : cricketAnimResult && !cricketAnimResult.won && !cricketAnimResult.draw
                          ? 'bg-success'
                          : cricketAnimResult && cricketAnimResult.draw
                            ? 'bg-accent'
                            : 'bg-danger'
                    "
                    :style="{
                      width:
                        cricketPhase === 'fighting'
                          ? (cricketDisplayPower[1] ?? 5) * 10 + '%'
                          : (cricketAnimResult?.opponentPower ?? 0) * 10 + '%'
                    }"
                  />
                </div>
                <p class="text-xs mt-0.5" :class="cricketPhase === 'fighting' ? 'text-muted/40' : 'text-danger'">
                  {{ cricketPhase === 'fighting' ? '?' : cricketAnimResult?.opponentPower }}
                </p>
              </div>
            </div>
          </div>

          <p v-if="cricketPhase === 'fighting'" class="text-xs text-muted/40 text-center mb-3">Dövüş sürüyor…</p>

          <!-- Sonuç -->
          <template v-if="cricketPhase === 'done' && cricketAnimResult">
            <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
              <p class="text-sm" :class="cricketAnimResult.won ? 'text-success' : cricketAnimResult.draw ? 'text-accent' : 'text-danger'">
                {{ cricketAnimResult.won ? 'Ezici zafer!' : cricketAnimResult.draw ? 'Başa baş' : 'Yenildin…' }}
              </p>
              <p
                class="text-xs mt-0.5"
                :class="cricketAnimResult.won ? 'text-success' : cricketAnimResult.draw ? 'text-muted' : 'text-danger'"
              >
                {{
                  cricketAnimResult.won
                    ? '+' + cricketAnimResult.winnings + ' akçe'
                    : cricketAnimResult.draw
                      ? CRICKET_BET_AMOUNT + ' akçe geri verildi'
                      : '-' + CRICKET_BET_AMOUNT + ' akçe'
                }}
              </p>
            </div>
            <Button class="w-full justify-center" @click="showCricketModal = false">Tamam</Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Kart çevirme penceresi -->
    <Transition name="panel-fade">
      <div v-if="showCardModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div class="game-panel max-w-xs w-full">
          <p class="text-sm text-accent text-center mb-1">Kartta Hazine</p>
          <p class="text-xs text-muted text-center mb-4">{{ cardPick + 1 }}. kartı seçtin</p>

          <!-- Kartlar -->
          <div class="flex justify-center space-x-2 mb-3">
            <div
              v-for="i in CARD_TOTAL"
              :key="i"
              class="card-tile"
              :class="{
                'card-flipping': cardPhase === 'flipping' && cardFlipIndex === i - 1,
                'card-treasure': cardPhase === 'done' && cardAnimResult && cardAnimResult.treasures.includes(i - 1),
                'card-empty': cardPhase === 'done' && cardAnimResult && !cardAnimResult.treasures.includes(i - 1),
                'card-picked': cardPick === i - 1
              }"
            >
              <template v-if="cardPhase === 'done' && cardAnimResult">
                <Gem v-if="cardAnimResult.treasures.includes(i - 1)" :size="16" class="text-success" />
                <X v-else :size="14" class="text-muted/30" />
              </template>
              <template v-else>
                <span class="text-sm" :class="cardPhase === 'flipping' && cardFlipIndex === i - 1 ? 'text-accent' : 'text-muted/30'">
                  ?
                </span>
              </template>
              <p class="text-xs mt-0.5" :class="cardPick === i - 1 ? 'text-accent' : 'text-muted/30'">{{ i }}</p>
            </div>
          </div>

          <p v-if="cardPhase === 'flipping'" class="text-xs text-muted/40 text-center mb-3">Kart çevriliyor…</p>

          <!-- Sonuç -->
          <template v-if="cardPhase === 'done' && cardAnimResult">
            <div class="border border-accent/10 rounded-xs p-3 text-center mb-3">
              <p class="text-sm" :class="cardAnimResult.won ? 'text-success' : 'text-danger'">
                {{ cardAnimResult.won ? 'Hazineyi buldun!' : 'Boş kart…' }}
              </p>
              <p class="text-xs mt-0.5" :class="cardAnimResult.won ? 'text-success' : 'text-danger'">
                {{ cardAnimResult.won ? '+' + cardAnimResult.winnings + ' akçe' : '-' + CARD_BET_AMOUNT + ' akçe' }}
              </p>
            </div>
            <Button class="w-full justify-center" @click="showCardModal = false">Tamam</Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Poker penceresi -->
    <Transition name="panel-fade">
      <div v-if="showTexasModal && texasSetup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <TexasHoldemGame :setup="texasSetup" @complete="handleTexasComplete" />
      </div>
    </Transition>

    <!-- Şeytan Çarkı penceresi -->
    <Transition name="panel-fade">
      <div v-if="showBuckshotModal && buckshotSetup" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <BuckshotRouletteGame :setup="buckshotSetup" @complete="handleBuckshotComplete" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { Tent, X, Dices, Trophy, Bug, Gem, Check, CircleDot, Spade, Crosshair, Map } from 'lucide-vue-next'
  import { useHanhaiStore } from '@/stores/useHanhaiStore'
  import { useInventoryStore } from '@/stores/useInventoryStore'
  import { useMiningStore } from '@/stores/useMiningStore'
  import { usePlayerStore } from '@/stores/usePlayerStore'
  import {
    HANHAI_SHOP_ITEMS,
    ROULETTE_BET_TIERS,
    ROULETTE_OUTCOMES,
    DICE_BET_AMOUNT,
    MAX_DAILY_BETS,
    HANHAI_UNLOCK_COST,
    CUP_BET_AMOUNT,
    CUP_WIN_MULTIPLIER,
    CRICKET_BET_AMOUNT,
    CRICKET_WIN_MULTIPLIER,
    CRICKETS,
    CARD_BET_AMOUNT,
    CARD_TOTAL,
    CARD_TREASURE_COUNT,
    TEXAS_TIERS,
    BUCKSHOT_BET_AMOUNT,
    BUCKSHOT_WIN_MULTIPLIER
  } from '@/data/hanhai'
  import type { HanhaiShopItemDef, CricketDef, TexasSetup, TexasTierId, BuckshotSetup } from '@/types'
  import { addLog } from '@/composables/useGameLog'
  import { useAudio } from '@/composables/useAudio'
  import {
    sfxRouletteSpin,
    sfxRouletteStop,
    sfxRouletteTick,
    sfxDiceRoll,
    sfxDiceLand,
    sfxDiceTick,
    sfxCupShuffle,
    sfxCupReveal,
    sfxCupTick,
    sfxCricketChirp,
    sfxCricketClash,
    sfxCricketTick,
    sfxCardFlip,
    sfxCasinoWin,
    sfxCasinoLose,
    sfxBuy
  } from '@/composables/useAudio'
  import TexasHoldemGame from '@/components/game/TexasHoldemGame.vue'
  import BuckshotRouletteGame from '@/components/game/BuckshotRouletteGame.vue'
  import Button from '@/components/game/Button.vue'

  // suppress unused warnings for template-only refs
  void CRICKET_WIN_MULTIPLIER
  void CARD_TREASURE_COUNT
  void BUCKSHOT_WIN_MULTIPLIER

  const hanhaiStore = useHanhaiStore()
  const playerStore = usePlayerStore()
  const { startHanhaiBgm, endHanhaiBgm } = useAudio()
  const activeTab = ref<'shop' | 'casino'>('shop')
  const shopModalItem = ref<HanhaiShopItemDef | null>(null)

  onMounted(() => {
    startHanhaiBgm()
  })

  onUnmounted(() => {
    endHanhaiBgm()
  })

  // === Açma mantığı ===
  const miningStore = useMiningStore()
  const bossDefeated = computed(() => miningStore.defeatedBosses.includes('abyss_dragon'))
  const canUnlock = computed(() => bossDefeated.value && playerStore.money >= HANHAI_UNLOCK_COST)
  const handleUnlock = () => {
    const result = hanhaiStore.unlockHanhai()
    if (result.success) addLog(result.message)
  }

  // === Çark animasyonu ===
  const showRouletteModal = ref(false)
  const roulettePhase = ref<'spinning' | 'done'>('spinning')
  const rouletteHighlight = ref(0)
  const rouletteAnimResult = ref<{ multiplier: number; winnings: number } | null>(null)
  const rouletteBetAmount = ref(0)

  // === Zar animasyonu ===
  const showDiceModal = ref(false)
  const dicePhase = ref<'rolling' | 'done'>('rolling')
  const diceDisplay = ref<number[]>([1, 1])
  const diceAnimResult = ref<{ won: boolean; winnings: number } | null>(null)
  const diceGuessIsBig = ref(false)

  const diceSum = computed(() => (diceDisplay.value[0] ?? 0) + (diceDisplay.value[1] ?? 0))

  /** Zar yüzündeki noktalar (3×3 grid, 0-indexed) */
  const DICE_DOTS: Record<number, number[]> = {
    1: [4],
    2: [2, 6],
    3: [2, 4, 6],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  }

  // === Kupa oyunu animasyonu ===
  const showCupModal = ref(false)
  const cupPhase = ref<'shuffling' | 'done'>('shuffling')
  const cupGuess = ref(0)
  const cupShuffleIndex = ref(0)
  const cupAnimResult = ref<{ correctCup: number; won: boolean; winnings: number } | null>(null)

  // === Cırcır dövüşü animasyonu ===
  const showCricketModal = ref(false)
  const cricketPhase = ref<'fighting' | 'done'>('fighting')
  const cricketChoiceName = ref('')
  const cricketDisplayPower = ref<number[]>([5, 5])
  const cricketAnimResult = ref<{ playerPower: number; opponentPower: number; won: boolean; draw: boolean; winnings: number } | null>(null)

  // === Kart çevirme animasyonu ===
  const showCardModal = ref(false)
  const cardPhase = ref<'flipping' | 'done'>('flipping')
  const cardPick = ref(0)
  const cardFlipIndex = ref(-1)
  const cardAnimResult = ref<{ treasures: number[]; won: boolean; winnings: number } | null>(null)

  const handleBuyItem = (itemId: string) => {
    const result = hanhaiStore.buyShopItem(itemId)
    if (result.success) {
      sfxBuy()
      addLog(result.message)
      shopModalItem.value = null
    }
  }

  // === Hazine haritası ===
  const inventoryStore = useInventoryStore()
  const treasureMapCount = computed(() => inventoryStore.getItemCount('hanhai_map'))
  const handleUseTreasureMap = () => {
    const result = hanhaiStore.useTreasureMap()
    if (result.success) {
      sfxCasinoWin()
    }
  }

  // === Çark mantığı ===
  const startRouletteSpin = (targetIndex: number) => {
    const len = ROULETTE_OUTCOMES.length
    const fullCycles = 3 + Math.floor(Math.random() * 2)
    const totalSteps = fullCycles * len + targetIndex
    let step = 0

    const tick = () => {
      rouletteHighlight.value = step % len
      sfxRouletteTick()

      if (step >= totalSteps) {
        sfxRouletteStop()
        setTimeout(() => {
          roulettePhase.value = 'done'
          if (rouletteAnimResult.value && rouletteAnimResult.value.multiplier > 0) sfxCasinoWin()
          else sfxCasinoLose()
        }, 400)
        return
      }

      step++
      const remaining = totalSteps - step
      let delay: number
      if (remaining > 10) delay = 60
      else if (remaining > 6) delay = 120
      else if (remaining > 3) delay = 200
      else if (remaining > 1) delay = 350
      else delay = 500

      setTimeout(tick, delay)
    }

    setTimeout(tick, 60)
  }

  const handleRoulette = (betTier: number) => {
    const result = hanhaiStore.playRoulette(betTier)
    if (!result.success) return

    rouletteBetAmount.value = betTier
    rouletteAnimResult.value = { multiplier: result.multiplier, winnings: result.winnings }
    roulettePhase.value = 'spinning'
    rouletteHighlight.value = 0
    showRouletteModal.value = true
    sfxRouletteSpin()

    const targetIndex = ROULETTE_OUTCOMES.findIndex(o => o.multiplier === result.multiplier)
    startRouletteSpin(targetIndex >= 0 ? targetIndex : 0)
  }

  // === Zar mantığı ===
  const startDiceRoll = (finalDice1: number, finalDice2: number) => {
    let step = 0
    const totalSteps = 14

    const tick = () => {
      if (step < totalSteps) {
        diceDisplay.value = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
        sfxDiceTick()
        step++
        const delay = step < 8 ? 80 : step < 11 ? 150 : 250
        setTimeout(tick, delay)
      } else {
        diceDisplay.value = [finalDice1, finalDice2]
        sfxDiceLand()
        setTimeout(() => {
          dicePhase.value = 'done'
          if (diceAnimResult.value?.won) sfxCasinoWin()
          else sfxCasinoLose()
        }, 500)
      }
    }

    tick()
  }

  const handleDice = (guessBig: boolean) => {
    const result = hanhaiStore.playDice(guessBig)
    if (!result.success) return

    diceGuessIsBig.value = guessBig
    diceAnimResult.value = { won: result.won, winnings: result.winnings }
    dicePhase.value = 'rolling'
    diceDisplay.value = [1, 1]
    showDiceModal.value = true
    sfxDiceRoll()

    startDiceRoll(result.dice1, result.dice2)
  }

  // === Kupa mantığı ===
  const startCupShuffle = () => {
    let step = 0
    const totalSteps = 12

    const tick = () => {
      if (step < totalSteps) {
        cupShuffleIndex.value = Math.floor(Math.random() * 3)
        sfxCupTick()
        step++
        const delay = step < 6 ? 100 : step < 10 ? 180 : 300
        setTimeout(tick, delay)
      } else {
        cupShuffleIndex.value = -1
        sfxCupReveal()
        setTimeout(() => {
          cupPhase.value = 'done'
          if (cupAnimResult.value?.won) sfxCasinoWin()
          else sfxCasinoLose()
        }, 400)
      }
    }

    tick()
  }

  const handleCup = (guess: number) => {
    const result = hanhaiStore.playCup(guess)
    if (!result.success) return

    cupGuess.value = guess
    cupAnimResult.value = { correctCup: result.correctCup, won: result.won, winnings: result.winnings }
    cupPhase.value = 'shuffling'
    cupShuffleIndex.value = 0
    showCupModal.value = true
    sfxCupShuffle()

    startCupShuffle()
  }

  // === Cırcır mantığı ===
  const startCricketFight = () => {
    let step = 0
    const totalSteps = 12

    const tick = () => {
      if (step < totalSteps) {
        cricketDisplayPower.value = [Math.floor(Math.random() * 10) + 1, Math.floor(Math.random() * 10) + 1]
        sfxCricketTick()
        step++
        const delay = step < 6 ? 120 : step < 10 ? 200 : 350
        setTimeout(tick, delay)
      } else {
        sfxCricketClash()
        setTimeout(() => {
          cricketPhase.value = 'done'
          if (cricketAnimResult.value?.won) sfxCasinoWin()
          else if (!cricketAnimResult.value?.draw) sfxCasinoLose()
        }, 400)
      }
    }

    tick()
  }

  const handleCricket = (cricket: CricketDef) => {
    const result = hanhaiStore.playCricketFight(cricket.name)
    if (!result.success) return

    cricketChoiceName.value = cricket.name
    cricketAnimResult.value = {
      playerPower: result.playerPower,
      opponentPower: result.opponentPower,
      won: result.won,
      draw: result.draw,
      winnings: result.winnings
    }
    cricketPhase.value = 'fighting'
    cricketDisplayPower.value = [5, 5]
    showCricketModal.value = true
    sfxCricketChirp()

    startCricketFight()
  }

  // === Kart mantığı ===
  const startCardFlip = (pickIndex: number) => {
    let step = 0
    const order: number[] = []
    order.push(pickIndex)
    for (let i = 0; i < CARD_TOTAL; i++) {
      if (i !== pickIndex) order.push(i)
    }

    const tick = () => {
      if (step < order.length) {
        cardFlipIndex.value = order[step]!
        sfxCardFlip()
        step++
        const delay = step === 1 ? 600 : 300
        setTimeout(tick, delay)
      } else {
        cardFlipIndex.value = -1
        setTimeout(() => {
          cardPhase.value = 'done'
          if (cardAnimResult.value?.won) sfxCasinoWin()
          else sfxCasinoLose()
        }, 200)
      }
    }

    tick()
  }

  const handleCardFlip = (pick: number) => {
    const result = hanhaiStore.playCardFlip(pick)
    if (!result.success) return

    cardPick.value = pick
    cardAnimResult.value = { treasures: result.treasures, won: result.won, winnings: result.winnings }
    cardPhase.value = 'flipping'
    cardFlipIndex.value = -1
    showCardModal.value = true

    startCardFlip(pick)
  }

  // === Poker ===
  const showTexasModal = ref(false)
  const texasSetup = ref<TexasSetup | null>(null)

  const handleTexas = (tierId: TexasTierId) => {
    const result = hanhaiStore.startTexas(tierId)
    if (!result.success) return
    texasSetup.value = result as TexasSetup
    showTexasModal.value = true
  }

  const handleTexasComplete = (finalChips: number, tierName: string) => {
    hanhaiStore.endTexas(finalChips, tierName)
    showTexasModal.value = false
  }

  // === Şeytan Çarkı ===
  const showBuckshotModal = ref(false)
  const buckshotSetup = ref<BuckshotSetup | null>(null)

  const handleBuckshot = () => {
    const result = hanhaiStore.startBuckshot()
    if (!result.success) return
    buckshotSetup.value = result as BuckshotSetup
    showBuckshotModal.value = true
  }

  const handleBuckshotComplete = (won: boolean, draw: boolean) => {
    hanhaiStore.endBuckshot(won, draw)
    showBuckshotModal.value = false
  }
</script>

<style scoped>
  .dice-face {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 3.5rem;
    height: 3.5rem;
    border: 1px solid rgba(200, 164, 92, 0.3);
    border-radius: 2px;
    padding: 6px;
    margin: 2px;
  }

  .dice-rolling {
    animation: dice-shake 0.1s infinite;
  }

  @keyframes dice-shake {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-1px, 1px);
    }
    50% {
      transform: translate(1px, -1px);
    }
    75% {
      transform: translate(-1px, -1px);
    }
  }

  /* Kupa oyunu */
  .cup-box {
    position: relative;
    width: 4rem;
    height: 4rem;
    border: 1px solid rgba(200, 164, 92, 0.2);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .cup-highlight {
    border-color: rgba(200, 164, 92, 0.6);
    background: rgba(200, 164, 92, 0.1);
  }

  .cup-correct {
    border-color: rgba(90, 158, 111, 0.6);
    background: rgba(90, 158, 111, 0.1);
  }

  .cup-picked {
    border-color: rgba(195, 64, 67, 0.4);
  }

  .cup-shake {
    animation: cup-wobble 0.15s infinite alternate;
  }

  @keyframes cup-wobble {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-2px);
    }
  }

  /* Cırcır dövüşü */
  .cricket-icon {
    display: flex;
    justify-content: center;
    line-height: 1;
  }

  .cricket-fight {
    animation: cricket-bounce 0.2s infinite alternate;
  }

  @keyframes cricket-bounce {
    0% {
      transform: translateX(-2px);
    }
    100% {
      transform: translateX(2px);
    }
  }

  /* Kart çevirme */
  .card-tile {
    width: 3rem;
    height: 3.5rem;
    border: 1px solid rgba(200, 164, 92, 0.2);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
  }

  .card-flipping {
    border-color: rgba(200, 164, 92, 0.6);
    background: rgba(200, 164, 92, 0.1);
    animation: card-flip 0.4s ease;
  }

  .card-treasure {
    border-color: rgba(90, 158, 111, 0.6);
    background: rgba(90, 158, 111, 0.08);
  }

  .card-empty {
    border-color: rgba(200, 164, 92, 0.1);
    opacity: 0.5;
  }

  .card-picked {
    border-width: 2px;
  }

  @keyframes card-flip {
    0% {
      transform: scaleX(1);
    }
    50% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
</style>
