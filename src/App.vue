<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import World from './components/World.vue';
  import IslandMap from './components/IslandMap.vue';
  import FreePlay from './components/FreePlay.vue';
  import PlayStage from './components/PlayStage.vue';
  import ResultStage from './components/ResultStage.vue';
  import { levels, toConfig } from './game/levels';
  import { markClear, save } from './game/storage';
  import { unlockAudio } from './game/sound';
  import type { QuizConfig, RoundResult } from './game/types';

  type Screen = 'map' | 'free' | 'play' | 'result';

  interface Summary extends RoundResult {
    levelName: string;
    sticker: string;
    firstClear: boolean;
    improved: boolean;
    hasNext: boolean;
  }

  const screen = ref<Screen>('map');
  const config = ref<QuizConfig | null>(null);
  const levelId = ref<string | null>(null);
  const summary = ref<Summary | null>(null);
  const playKey = ref(0);

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
    if (current) {
      const previous = save.clears[current.id]?.stars ?? 0;
      firstClear = previous === 0;
      improved = result.stars > previous;
      markClear(current.id, result.stars);
    }
    const index = current ? levels.findIndex((item) => item.id === current.id) : -1;
    summary.value = {
      ...result,
      levelName: current?.name ?? '自由练习',
      sticker: current?.sticker ?? '',
      firstClear,
      improved,
      hasNext: index >= 0 && index < levels.length - 1,
    };
    screen.value = 'result';
  }

  function replay() {
    if (!config.value) {
      screen.value = 'map';
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

  function unlock() {
    unlockAudio();
  }

  onMounted(() => window.addEventListener('pointerdown', unlock));
  onBeforeUnmount(() => window.removeEventListener('pointerdown', unlock));
</script>

<template>
  <World>
    <Transition name="fade" mode="out-in">
      <IslandMap v-if="screen === 'map'" @free="screen = 'free'" @start="begin($event.id, $event.config)" />
      <FreePlay v-else-if="screen === 'free'" @back="screen = 'map'" @start="begin(null, $event)" />
      <PlayStage
        v-else-if="screen === 'play' && config"
        :key="playKey"
        :config="config"
        :title="level?.name ?? '自由练习'"
        @finish="onFinish"
        @quit="screen = 'map'"
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
        @home="screen = 'map'"
      />
    </Transition>
  </World>
</template>
