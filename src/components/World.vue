<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = withDefaults(
    defineProps<{
      sky?: 'clear' | 'wind' | 'rain' | 'storm';
      boltKey?: number;
      drops?: number;
    }>(),
    { sky: 'clear', boltKey: 0, drops: 0 },
  );

  const bolt = ref(makeBolt());

  watch(
    () => props.boltKey,
    (key) => {
      if (key > 0) bolt.value = makeBolt();
    },
  );

  function makeBolt() {
    let x = 28 + Math.random() * 34;
    let y = 2;
    const main = [`${x.toFixed(0)},${y.toFixed(0)}`];
    const turns = 4 + Math.floor(Math.random() * 2);
    for (let i = 0; i < turns; i += 1) {
      y += 26 + Math.random() * 14;
      x = Math.min(82, Math.max(8, x + (Math.random() * 46 - 23)));
      main.push(`${x.toFixed(0)},${Math.min(166, y).toFixed(0)}`);
    }
    const forkAt = main[1 + Math.floor(Math.random() * Math.max(1, main.length - 2))];
    const [fx, fy] = forkAt.split(',').map(Number);
    const dir = Math.random() < 0.5 ? -1 : 1;
    const branch = [
      `${fx},${fy}`,
      `${clamp(fx + dir * (16 + Math.random() * 12))},${(fy + 18).toFixed(0)}`,
      `${clamp(fx + dir * (8 + Math.random() * 8))},${(fy + 28).toFixed(0)}`,
      `${clamp(fx + dir * (24 + Math.random() * 14))},${Math.min(166, fy + 46).toFixed(0)}`,
    ].join(' ');
    return {
      left: `${Math.round(6 + Math.random() * 68)}%`,
      flip: Math.random() < 0.5,
      points: main.join(' '),
      branch,
    };
  }

  function clamp(value: number) {
    return Math.min(84, Math.max(6, value)).toFixed(0);
  }
</script>

<template>
  <div class="world" :class="`sky-${sky}`">
    <div v-if="sky === 'clear' || sky === 'wind'" class="sun" aria-hidden="true"></div>
    <template v-if="sky === 'clear' || sky === 'wind'">
      <i class="cloud c1" aria-hidden="true"></i>
      <i class="cloud c2" aria-hidden="true"></i>
      <i class="cloud c3" aria-hidden="true"></i>
    </template>
    <template v-if="sky === 'clear'">
      <i class="spark s1" aria-hidden="true"></i>
      <i class="spark s2" aria-hidden="true"></i>
      <i class="spark s3" aria-hidden="true"></i>
    </template>
    <div v-if="drops > 0" class="rain" aria-hidden="true">
      <i v-for="drop in drops" :key="drop" class="drop" :style="{ left: `${(drop * 13) % 100}%`, animationDelay: `${(drop % 10) * 0.08}s` }"></i>
    </div>
    <svg
      v-if="sky === 'storm'"
      :key="boltKey"
      class="bolt"
      :class="{ flip: bolt.flip }"
      :style="{ left: bolt.left }"
      viewBox="0 0 90 170"
      aria-hidden="true"
    >
      <polyline class="bolt-glow" :points="bolt.points" />
      <polyline class="bolt-core" :points="bolt.points" />
      <polyline class="bolt-branch" :points="bolt.branch" />
    </svg>
    <div class="hill back" aria-hidden="true"></div>
    <div class="hill front" aria-hidden="true"></div>
    <div class="world-content">
      <slot />
    </div>
  </div>
</template>
