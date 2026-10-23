<script setup lang="ts">
  import { computed } from 'vue';
  import Mascot from './Mascot.vue';
  import { formatLicenseDate, type Feature } from '../game/license';
  import { save, toggleSound } from '../game/storage';

  const props = defineProps<{
    features: Feature[];
    expiresAt: number | null;
  }>();

  const expiresLabel = computed(() => (props.expiresAt ? formatLicenseDate(props.expiresAt) : ''));

  const emit = defineEmits<{
    map: [];
    free: [];
    timed: [];
    table: [];
  }>();

  function open(feature: Feature) {
    return props.features.includes(feature);
  }
</script>

<template>
  <section class="screen map-screen">
    <header class="topbar">
      <Mascot mood="idle" size="sm" />
      <div class="title-block">
        <p class="eyebrow">挑一种玩法</p>
        <h1>豆豆口算</h1>
        <p v-if="expiresLabel" class="stats">授权到 {{ expiresLabel }}</p>
      </div>
      <div class="top-tools">
        <button class="icon-btn" type="button" :aria-pressed="save.sound" @click="toggleSound">
          {{ save.sound ? '声音开' : '声音关' }}
        </button>
      </div>
    </header>

    <div class="door-list">
      <button class="free-card door" type="button" :disabled="!open('timed')" @click="emit('timed')">
        <span class="free-mark door-mark time">时</span>
        <span>
          <strong>计时练</strong>
          <small>{{ open('timed') ? '看算式，心里算，时间到了换下一题' : '这份授权还没包含' }}</small>
        </span>
      </button>
      <button class="free-card door" type="button" :disabled="!open('free')" @click="emit('free')">
        <span class="free-mark door-mark">自</span>
        <span>
          <strong>自由练</strong>
          <small>{{ open('free') ? '自己搭配加减乘除' : '这份授权还没包含' }}</small>
        </span>
      </button>
      <button class="free-card door" type="button" :disabled="!open('map')" @click="emit('map')">
        <span class="free-mark door-mark play">关</span>
        <span>
          <strong>闯关练</strong>
          <small>{{ open('map') ? '一关一关收集贴纸' : '这份授权还没包含' }}</small>
        </span>
      </button>
      <button class="free-card door" type="button" :disabled="!open('table')" @click="emit('table')">
        <span class="free-mark door-mark times">乘</span>
        <span>
          <strong>乘法表</strong>
          <small>{{ open('table') ? '看几行几列怎样变成一个数' : '这份授权还没包含' }}</small>
        </span>
      </button>
    </div>
  </section>
</template>
