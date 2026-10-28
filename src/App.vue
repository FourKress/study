<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import World from './components/World.vue';
  import HomeGate from './components/HomeGate.vue';
  import LicenseGate from './components/LicenseGate.vue';
  import IslandMap from './components/IslandMap.vue';
  import FreePlay from './components/FreePlay.vue';
  import PlayStage from './components/PlayStage.vue';
  import ResultStage from './components/ResultStage.vue';
  import TimesTable from './components/TimesTable.vue';
  import { checkLicense, FEATURES, type Feature, type LicenseStatus } from './game/license';
  import { levels, toConfig } from './game/levels';
  import { markClear, save } from './game/storage';
  import { setMusicLayer, startMusic, stopMusic, unlockAudio } from './game/sound';
  import type { QuizConfig, RoundResult } from './game/types';

  type Screen = 'home' | 'map' | 'free' | 'timed' | 'play' | 'result' | 'table';
  type Sky = 'clear' | 'wind' | 'rain' | 'storm';

  interface Summary extends RoundResult {
    levelName: string;
    sticker: string;
    firstClear: boolean;
    improved: boolean;
    hasNext: boolean;
  }

  const screen = ref<Screen>('home');
  const license = ref<LicenseStatus>(
    import.meta.env.DEV && !import.meta.env.VITE_LICENSE_PUBLIC_KEY
      ? { state: 'ready', deviceId: '', message: '', features: [...FEATURES], exp: null, trial: false }
      : { state: 'loading', deviceId: '', message: '正在检查授权', features: [], exp: null, trial: false },
  );
  let licenseTask: Promise<void> | null = null;
  const sky = ref<Sky>('clear');
  const config = ref<QuizConfig | null>(null);
  const levelId = ref<string | null>(null);
  const summary = ref<Summary | null>(null);
  const playKey = ref(0);
  const boltKey = ref(0);
  const drops = ref(0);

  const level = computed(() => levels.find((item) => item.id === levelId.value) ?? null);

  function refreshLicense() {
    if (licenseTask) return licenseTask;
    if (license.value.state !== 'ready') {
      license.value = { ...license.value, state: 'loading', message: '正在检查授权' };
    }
    licenseTask = checkLicense()
      .then((next) => {
        license.value = next;
      })
      .catch(() => {
        license.value = {
          state: 'offline',
          deviceId: license.value.deviceId,
          message: '暂时连不上。有网时再点重新检查。',
          features: [],
          exp: license.value.exp,
          trial: license.value.trial,
        };
      })
      .finally(() => {
        licenseTask = null;
      });
    return licenseTask;
  }

  async function ensure(feature: Feature) {
    await refreshLicense();
    const allowed = license.value.state === 'ready' && license.value.features.includes(feature);
    if (!allowed) screen.value = 'home';
    return allowed;
  }

  async function enter(feature: Feature) {
    if (!(await ensure(feature))) return;
    screen.value = feature;
  }

  async function begin(id: string | null, nextConfig: QuizConfig) {
    const feature: Feature = id ? 'map' : nextConfig.endless ? 'timed' : 'free';
    if (!(await ensure(feature))) return;
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

  async function leavePlay() {
    const feature: Feature = levelId.value ? 'map' : config.value?.endless ? 'timed' : 'free';
    if (!(await ensure(feature))) return;
    screen.value = feature;
  }

  async function replay() {
    if (!config.value) {
      screen.value = 'home';
      return;
    }
    const feature: Feature = levelId.value ? 'map' : config.value.endless ? 'timed' : 'free';
    if (!(await ensure(feature))) return;
    playKey.value += 1;
    screen.value = 'play';
  }

  function nextLevel() {
    const index = levels.findIndex((item) => item.id === levelId.value);
    const next = levels[index + 1];
    if (!next) {
      leavePlay();
      return;
    }
    begin(next.id, toConfig(next));
  }

  function leaveResult() {
    if (levelId.value) {
      leavePlay();
      return;
    }
    screen.value = 'home';
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
    if (value === 'home') refreshLicense();
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

  onMounted(() => {
    refreshLicense();
    window.addEventListener('pointerdown', unlock);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', unlock);
    stopMusic();
  });
</script>

<template>
  <World :class="{ 'motion-off': !save.motion }" :sky="sky" :bolt-key="boltKey" :drops="drops">
    <Transition name="fade" mode="out-in">
      <LicenseGate
        v-if="screen === 'home' && license.state !== 'ready'"
        :device-id="license.deviceId"
        :message="license.message"
        :busy="license.state === 'loading'"
        :state="license.state"
        @retry="refreshLicense"
      />
      <HomeGate
        v-else-if="screen === 'home'"
        :features="license.features"
        :expires-at="license.exp"
        :trial="license.trial"
        @map="enter('map')"
        @free="enter('free')"
        @timed="enter('timed')"
        @table="enter('table')"
      />
      <TimesTable v-else-if="screen === 'table'" @back="screen = 'home'" />
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
        @home="leaveResult"
      />
    </Transition>
  </World>
</template>
