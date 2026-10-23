<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Mascot from './Mascot.vue';
  import { isUnlocked, levels, toConfig } from '../game/levels';
  import { resetSave, save, starCount, stickerCount, toggleSound } from '../game/storage';
  import type { QuizConfig } from '../game/types';

  const emit = defineEmits<{
    free: [];
    start: [payload: { id: string; config: QuizConfig }];
  }>();

  const pickedId = ref<string | null>(null);
  const seconds = ref(10);
  const shaking = ref('');
  const tip = ref('');
  const resetOpen = ref(false);

  const picked = computed(() => levels.find((level) => level.id === pickedId.value) ?? null);
  const stickers = computed(() => stickerCount());
  const stars = computed(() => starCount());

  function showTip(message: string) {
    tip.value = message;
    window.setTimeout(() => {
      if (tip.value === message) tip.value = '';
    }, 1400);
  }

  function openLevel(id: string, index: number) {
    if (!isUnlocked(index, save.clears)) {
      shaking.value = id;
      showTip('先和豆豆通过上一关');
      window.setTimeout(() => {
        if (shaking.value === id) shaking.value = '';
      }, 420);
      return;
    }
    const level = levels[index];
    pickedId.value = id;
    seconds.value = level.seconds;
  }

  function closeSheet() {
    pickedId.value = null;
  }

  function begin() {
    if (!picked.value) return;
    emit('start', { id: picked.value.id, config: toConfig(picked.value, seconds.value) });
    pickedId.value = null;
  }

  function changeSeconds(delta: number) {
    seconds.value = Math.min(30, Math.max(2, seconds.value + delta));
  }

  function confirmReset() {
    resetSave();
    resetOpen.value = false;
    showTip('旅程重新开始啦');
  }
</script>

<template>
  <section class="screen map-screen">
    <header class="topbar">
      <Mascot mood="idle" size="sm" />
      <div class="title-block">
        <p class="eyebrow">豆豆的口算冒险</p>
        <h1>算算岛</h1>
      </div>
      <div class="top-tools">
        <div class="pocket">
          <span><i class="pocket-star">★</i>{{ stars }}</span>
          <span><i class="pocket-seal">✿</i>{{ stickers }}</span>
        </div>
        <button class="icon-btn" type="button" :aria-pressed="save.sound" @click="toggleSound">
          {{ save.sound ? '声音开' : '声音关' }}
        </button>
      </div>
    </header>

    <p v-if="tip" class="toast">{{ tip }}</p>

    <button class="free-card" type="button" @click="emit('free')">
      <span class="free-mark">✏️</span>
      <span>
        <strong>自由练习</strong>
        <small>自己搭配加减乘除</small>
      </span>
    </button>

    <ol class="trail">
      <li v-for="(level, index) in levels" :key="level.id" :class="index % 2 === 0 ? 'left' : 'right'">
        <button
          type="button"
          class="island"
          :class="{
            locked: !isUnlocked(index, save.clears),
            current: isUnlocked(index, save.clears) && !save.clears[level.id],
            cleared: Boolean(save.clears[level.id]),
            nope: shaking === level.id,
          }"
          @click="openLevel(level.id, index)"
        >
          <span class="island-pad" :style="{ background: level.tint }">
            <Mascot v-if="isUnlocked(index, save.clears) && !save.clears[level.id]" mood="idle" size="sm" />
            <span v-else class="island-badge">{{ level.badge }}</span>
          </span>
          <strong>{{ level.name }}</strong>
          <span v-if="save.clears[level.id]" class="island-stars" :aria-label="`${save.clears[level.id].stars} 颗星`">
            <i v-for="star in 3" :key="star" :class="{ on: star <= save.clears[level.id].stars }">★</i>
          </span>
          <small v-else-if="!isUnlocked(index, save.clears)">还在雾里</small>
          <small v-else>可以出发</small>
        </button>
      </li>
    </ol>

    <button class="text-btn" type="button" @click="resetOpen = true">家长：重新开始旅程</button>

    <Teleport to="body">
      <div v-if="picked" class="shade" @click.self="closeSheet">
        <div class="sheet" role="dialog" aria-modal="true">
          <div class="sheet-hero" :style="{ background: picked.tint }">
            <span>{{ picked.badge }}</span>
            <Mascot mood="think" size="sm" />
          </div>
          <h3>{{ picked.name }}</h3>
          <p>{{ picked.blurb }}</p>
          <p class="sheet-meta">一共 {{ picked.count }} 题</p>
          <div class="stepper">
            <button type="button" @click="changeSeconds(-1)">－</button>
            <div>
              <strong>{{ seconds }}</strong>
              <span>秒 / 题</span>
            </div>
            <button type="button" @click="changeSeconds(1)">＋</button>
          </div>
          <button class="primary" type="button" @click="begin">出发</button>
          <button class="text-btn" type="button" @click="closeSheet">再看看</button>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="resetOpen" class="shade" @click.self="resetOpen = false">
        <div class="sheet" role="dialog" aria-modal="true">
          <h3>清空星星和贴纸？</h3>
          <p>闯关进度会消失，自由练习不受影响。</p>
          <button class="primary" type="button" @click="confirmReset">清空</button>
          <button class="text-btn" type="button" @click="resetOpen = false">再想想</button>
        </div>
      </div>
    </Teleport>
  </section>
</template>
