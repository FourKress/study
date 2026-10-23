<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import World from './components/World.vue';
  import HomeGate from './components/HomeGate.vue';
  import IslandMap from './components/IslandMap.vue';
  import FreePlay from './components/FreePlay.vue';
  import PlayStage from './components/PlayStage.vue';
  import ResultStage from './components/ResultStage.vue';
  import { levels, toConfig } from './game/levels';
  import { markClear, save } from './game/storage';
  import { setMusicLayer, startMusic, stopMusic, unlockAudio } from './game/sound';
  import type { QuizConfig, RoundResult } from './game/types';

  type Screen = 'home' | 'map' | 'free' | 'timed' | 'play' | 'result';
  type Sky = 'clear' | 'wind' | 'rain' | 'storm';

  interface Summary extends RoundResult {
    levelName: string;
    sticker: string;
    firstClear: boolean;
    improved: boolean;
    hasNext: boolean;
  }

  const screen = ref<Screen>('home');
  const sky = ref<Sky>('clear');
  const config = ref<QuizConfig | null>(null);
  const levelId = ref<string | null>(null);
  const summary = ref<Summary | null>(null);
  const playKey = ref(0);
  const boltKey = ref(0);
  const drops = ref(0);

  const level = computed(() => levels.find((item) => item.id === levelId.value) ?? null);

  function begin(id: string | null, nextConfig: QuizConfig) {
    levelId.value = id;
    config.value = nextConfig;
    playKey.value += 1;
    screen.value = 'play';
  }

  function onFinish(result: RoundResult) {
    const current = level.value;
    let firstClear = false;
    let improved = false;
    if (current && result.stars > 0) {
      const previous = save.clears[current.id]?.stars ?? 0;
      firstClear = previous === 0;
      improved = result.stars > previous;
      markClear(current.id, result.stars);
    }
    const index = current ? levels.findIndex((item) => item.id === current.id) : -1;
    summary.value = {
      ...result,
      levelName: current?.name ?? '自由练',
      sticker: current?.sticker ?? '',
      firstClear,
      improved,
      hasNext: result.stars > 0 && index >= 0 && index < levels.length - 1,
    };
    screen.value = 'result';
    sky.value = result.stars >= 3 ? 'clear' : result.stars === 2 ? 'wind' : 'rain';
    drops.value = sky.value === 'rain' ? 32 : 0;
  }

  function leavePlay() {
    if (levelId.value) screen.value = 'map';
    else if (config.value?.endless) screen.value = 'timed';
    else screen.value = 'free';
  }

  function replay() {
    if (!config.value) {
      screen.value = 'home';
      return;
    }
    playKey.value += 1;
    screen.value = 'play';
  }

  function nextLevel() {
    const index = levels.findIndex((item) => item.id === levelId.value);
    const next = levels[index + 1];
    if (!next) {
      screen.value = 'map';
      return;
    }
    begin(next.id, toConfig(next));
  }

  function onWeather(next: Sky, count = 0) {
    sky.value = next;
    drops.value = count;
    if (next === 'storm') boltKey.value += 1;
    setMusicLayer(next === 'storm' || next === 'rain' ? 'rain' : next === 'wind' ? 'wind' : 'play');
  }

  function unlock() {
    unlockAudio();
    startMusic();
  }

  watch(screen, (value) => {
    if (value === 'play') {
      sky.value = 'clear';
      drops.value = 0;
      boltKey.value = 0;
      setMusicLayer('play');
      return;
    }
    if (value !== 'result') {
      sky.value = 'clear';
      drops.value = 0;
    }
    setMusicLayer('map');
  });

  watch(
    () => save.sound,
    (on) => {
      if (on) startMusic();
      else stopMusic();
    },
  );

  onMounted(() => window.addEventListener('pointerdown', unlock));
  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', unlock);
    stopMusic();
  });
</script>

<template>
  <World :sky="sky" :bolt-key="boltKey" :drops="drops">
    <Transition name="fade" mode="out-in">
      <HomeGate v-if="screen === 'home'" @map="screen = 'map'" @free="screen = 'free'" @timed="screen = 'timed'" />
      <IslandMap v-else-if="screen === 'map'" @back="screen = 'home'" @start="begin($event.id, $event.config)" />
      <FreePlay v-else-if="screen === 'free'" @back="screen = 'home'" @start="begin(null, $event)" />
      <FreePlay v-else-if="screen === 'timed'" timed @back="screen = 'home'" @start="begin(null, $event)" />
      <PlayStage
        v-else-if="screen === 'play' && config"
        :key="playKey"
        :config="config"
        :title="level?.name ?? (config.endless ? '计时练' : '自由练')"
        @finish="onFinish"
        @quit="leavePlay"
        @weather="onWeather"
      />
      <ResultStage
        v-else-if="screen === 'result' && summary"
        :stars="summary.stars"
        :total="summary.total"
        :first-try="summary.firstTry"
        :level-name="summary.levelName"
        :sticker="summary.sticker"
        :first-clear="summary.firstClear"
        :improved="summary.improved"
        :has-next="summary.hasNext"
        @again="replay"
        @next="nextLevel"
        @home="screen = levelId ? 'map' : 'home'"
      />
    </Transition>
  </World>
</template>
