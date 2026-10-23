<script setup lang="ts">
  import Mascot from './Mascot.vue';
  import { save, toggleSound } from '../game/storage';

  const emit = defineEmits<{
    map: [];
    free: [];
    timed: [];
    table: [];
  }>();
</script>

<template>
  <section class="screen map-screen">
    <header class="topbar">
      <Mascot mood="idle" size="sm" />
      <div class="title-block">
        <p class="eyebrow">挑一种玩法</p>
        <h1>豆豆口算</h1>
      </div>
      <div class="top-tools">
        <button class="icon-btn" type="button" :aria-pressed="save.sound" @click="toggleSound">
          {{ save.sound ? '声音开' : '声音关' }}
        </button>
      </div>
    </header>

    <div class="door-list">
      <button class="free-card door" type="button" @click="emit('timed')">
        <span class="free-mark door-mark time">时</span>
        <span>
          <strong>计时练</strong>
          <small>看算式，心里算，时间到了换下一题</small>
        </span>
      </button>
      <button class="free-card door" type="button" @click="emit('free')">
        <span class="free-mark door-mark">自</span>
        <span>
          <strong>自由练</strong>
          <small>自己搭配加减乘除</small>
        </span>
      </button>
      <button class="free-card door" type="button" @click="emit('map')">
        <span class="free-mark door-mark play">关</span>
        <span>
          <strong>闯关练</strong>
          <small>一关一关收集贴纸</small>
        </span>
      </button>
      <button class="free-card door" type="button" @click="emit('table')">
        <span class="free-mark door-mark times">乘</span>
        <span>
          <strong>乘法表</strong>
          <small>看几行几列怎样变成一个数</small>
        </span>
      </button>
    </div>
  </section>
</template>
