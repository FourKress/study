<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Mascot from './Mascot.vue';
  import StickerArt from './StickerArt.vue';
  import { isUnlocked, levels, toConfig } from '../game/levels';
  import { resetSave, save, starCount, stickerCount, toggleMotion, toggleSound } from '../game/storage';
  import type { QuizConfig } from '../game/types';

  const emit = defineEmits<{
    back: [];
    start: [payload: { id: string; config: QuizConfig }];
  }>();

  const pickedId = ref<string | null>(null);
  const seconds = ref(10);
  const shaking = ref('');
  const tip = ref('');
  const resetOpen = ref(false);
  const bookOpen = ref(false);
  const shownId = ref<string | null>(null);

  const picked = computed(() => levels.find((level) => level.id === pickedId.value) ?? null);
  const stickers = computed(() => stickerCount());
  const stars = computed(() => starCount());
  const shown = computed(() => levels.find((level) => level.id === shownId.value) ?? null);

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
      <button class="icon-btn" type="button" @click="emit('back')">返回</button>
      <Mascot mood="idle" size="sm" />
      <div class="title-block">
        <p class="eyebrow">豆豆的口算冒险</p>
        <h1>闯关岛</h1>
      </div>
      <div class="top-tools">
        <div class="pocket">
          <span><i class="pocket-star">★</i>{{ stars }}</span>
          <button class="pocket-book" type="button" @click="bookOpen = true">
            <i class="pocket-seal">✿</i>{{ stickers }}
          </button>
        </div>
        <button class="icon-btn" type="button" :aria-pressed="save.motion" @click="toggleMotion">
          {{ save.motion ? '动画开' : '动画关' }}
        </button>
        <button class="icon-btn" type="button" :aria-pressed="save.sound" @click="toggleSound">
          {{ save.sound ? '声音开' : '声音关' }}
        </button>
      </div>
    </header>

    <p v-if="tip" class="toast">{{ tip }}</p>

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
      <div v-if="bookOpen" class="shade" @click.self="bookOpen = false">
        <div class="sheet book" role="dialog" aria-modal="true" aria-label="贴纸册">
          <h3>贴纸册</h3>
          <div v-if="stickers === 0" class="book-empty">
            <Mascot mood="think" size="sm" />
            <p>先去闯一关，豆豆在等你</p>
          </div>
          <div class="book-grid">
            <button
              v-for="level in levels"
              :key="level.id"
              type="button"
              class="book-slot"
              :class="{ got: Boolean(save.clears[level.id]) }"
              :disabled="!save.clears[level.id]"
              @click="shownId = level.id"
            >
              <StickerArt v-if="save.clears[level.id]" :name="level.sticker" />
              <span v-else class="book-fog">雾</span>
              <strong>{{ save.clears[level.id] ? level.sticker : '还在雾里' }}</strong>
              <span v-if="save.clears[level.id]" class="island-stars">
                <i v-for="star in 3" :key="star" :class="{ on: star <= save.clears[level.id].stars }">★</i>
              </span>
            </button>
          </div>
          <div v-if="shown && save.clears[shown.id]" class="book-focus">
            <StickerArt :name="shown.sticker" />
            <strong>{{ shown.sticker }}</strong>
            <small>{{ shown.name }}</small>
          </div>
          <button class="text-btn" type="button" @click="bookOpen = false">合上</button>
        </div>
      </div>
    </Teleport>

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
          <p>闯关进度会消失，自由练不受影响。</p>
          <button class="primary" type="button" @click="confirmReset">清空</button>
          <button class="text-btn" type="button" @click="resetOpen = false">再想想</button>
        </div>
      </div>
    </Teleport>
  </section>
</template>
