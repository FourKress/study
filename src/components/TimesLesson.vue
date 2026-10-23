<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, watch } from 'vue';
  import Mascot from './Mascot.vue';
  import { holdMusicForSpeech, speak, stopSpeak } from '../game/sound';
  import { save } from '../game/storage';

  const props = defineProps<{ a: number; b: number }>();
  const emit = defineEmits<{ close: [] }>();

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 900px)') : null;
  const wide = ref(Boolean(wideQuery?.matches));

  function onWideChange() {
    wide.value = Boolean(wideQuery?.matches);
  }

  wideQuery?.addEventListener('change', onWideChange);

  type Mode = 'dots' | 'split' | 'near';

  function pieces(a: number, b: number) {
    const cut = (wide: number, rows: number) => {
      const chunk = wide > 9 ? 10 : 5;
      return { rows, chunk, rest: Math.max(0, wide - chunk) };
    };
    if (a > 9 || (a >= b && a * b > 30)) return cut(a, b);
    return cut(b, a);
  }

  const mode = ref<Mode>(props.a * props.b <= 30 ? 'dots' : 'split');
  const step = ref(0);
  const playing = ref(mode.value !== 'near');
  let waitTimer = 0;

  const part = computed(() => pieces(props.a, props.b));
  const product = computed(() => props.a * props.b);
  const canNear = computed(() => props.a > 10 && props.b > 10);
  const shownRows = computed(() => (step.value === 0 ? 1 : props.b));
  const dot = computed(() => {
    const base = props.a > 9 || props.b > 9 ? 12 : 22;
    return wide.value ? Math.round(base * 1.4) : base;
  });
  const gap = computed(() => {
    const base = props.a > 9 || props.b > 9 ? 4 : 6;
    return wide.value ? base + 2 : base;
  });
  const frame = computed(() => {
    const rows = shownRows.value;
    const width = props.a * dot.value + Math.max(0, props.a - 1) * gap.value;
    const height = rows * dot.value + Math.max(0, rows - 1) * gap.value;
    return Math.max(width, height);
  });

  const stepCount = computed(() => {
    if (mode.value === 'near') return 3;
    if (mode.value === 'dots') return props.a === props.b ? 3 : 4;
    return part.value.rest > 0 ? 3 : 2;
  });

  const caption = computed(() => {
    const { a, b } = props;
    if (mode.value === 'dots') {
      if (step.value <= 0) return `一行 ${a} 个`;
      if (step.value === 1) return `一行 ${a} 个，有 ${b} 行`;
      if (step.value === 2) return a === b ? `${a} 行 ${a} 列，收成 ${product.value}` : `${a} × ${b} = ${product.value}`;
      return `转一下，${b} × ${a} 也是 ${product.value}`;
    }
    if (mode.value === 'split') {
      const item = part.value;
      if (step.value <= 0) return `先看 ${item.chunk} 列：${item.rows} × ${item.chunk} = ${item.rows * item.chunk}`;
      if (step.value === 1 && item.rest > 0) return `再看 ${item.rest} 列：${item.rows} × ${item.rest} = ${item.rows * item.rest}`;
      if (item.rest === 0) return `正好是 ${product.value}`;
      return `${item.rows * item.chunk} ＋ ${item.rows * item.rest} ＝ ${product.value}`;
    }
    if (step.value <= 0) return '先看成 20 × 20 = 400';
    if (step.value === 1) return `去掉右边 ${20 - a} 列，下边 ${20 - b} 行`;
    return `角被减了两次，加回来是 ${product.value}`;
  });

  const dotEquation = computed(() =>
    step.value >= 3 ? `${props.b} × ${props.a} = ${product.value}` : `${props.a} × ${props.b} = ${product.value}`,
  );

  const nearLine = computed(() => {
    const da = 20 - props.a;
    const db = 20 - props.b;
    return `400 － 20×${db} － 20×${da} ＋ ${da}×${db} ＝ ${product.value}`;
  });

  const keepStyle = computed(() =>
    step.value === 0
      ? { width: '100%', height: '100%' }
      : { width: `${(props.a / 20) * 100}%`, height: `${(props.b / 20) * 100}%` },
  );

  const cutColStyle = computed(() => ({
    left: `${(props.a / 20) * 100}%`,
    top: '0',
    width: `${((20 - props.a) / 20) * 100}%`,
    height: `${(props.b / 20) * 100}%`,
  }));

  const cutRowStyle = computed(() => ({
    left: '0',
    top: `${(props.b / 20) * 100}%`,
    width: '100%',
    height: `${((20 - props.b) / 20) * 100}%`,
  }));

  const cornerStyle = computed(() => ({
    left: `${(props.a / 20) * 100}%`,
    top: `${(props.b / 20) * 100}%`,
    width: `${((20 - props.a) / 20) * 100}%`,
    height: `${((20 - props.b) / 20) * 100}%`,
  }));

  function clearWait() {
    window.clearTimeout(waitTimer);
    waitTimer = 0;
  }

  function queueAuto(didSpeak: boolean) {
    if (!playing.value || mode.value === 'near') return;
    if (step.value >= stepCount.value - 1) return;
    waitTimer = window.setTimeout(() => {
      if (!playing.value || mode.value === 'near') return;
      if (step.value >= stepCount.value - 1) return;
      step.value += 1;
    }, didSpeak ? 450 : 2600);
  }

  function sayStep() {
    clearWait();
    speak(caption.value, queueAuto);
  }

  function next() {
    playing.value = false;
    clearWait();
    if (step.value < stepCount.value - 1) step.value += 1;
  }

  function replay() {
    playing.value = mode.value !== 'near';
    clearWait();
    if (step.value === 0) sayStep();
    else step.value = 0;
  }

  function openNear() {
    playing.value = false;
    clearWait();
    mode.value = 'near';
    step.value = 0;
  }

  function backMain() {
    playing.value = true;
    clearWait();
    mode.value = props.a * props.b <= 30 ? 'dots' : 'split';
    step.value = 0;
  }

  function dotDelay(r: number, c: number) {
    if (reduced || step.value >= 3) return undefined;
    const index = (r - 1) * props.a + (c - 1);
    return { animationDelay: `${Math.min(index, 24) * 55}ms` };
  }

  watch(caption, sayStep, { immediate: true });

  watch(
    () => save.sound,
    (on) => {
      if (!on) stopSpeak();
    },
  );

  holdMusicForSpeech(true);

  onBeforeUnmount(() => {
    playing.value = false;
    clearWait();
    stopSpeak();
    holdMusicForSpeech(false);
    wideQuery?.removeEventListener('change', onWideChange);
  });
</script>

<template>
  <section class="screen lesson-screen">
    <header class="topbar">
      <button class="icon-btn" type="button" @click="emit('close')">返回</button>
      <div class="title-block">
        <p class="eyebrow">豆豆讲讲</p>
        <h1>{{ a }} × {{ b }}</h1>
      </div>
      <Mascot :mood="step >= stepCount - 1 ? 'cheer' : 'think'" size="sm" />
    </header>

    <p class="lesson-say" aria-live="polite">{{ caption }}</p>

    <div class="lesson-stage">
      <div
        v-if="mode === 'dots' && !(step === 2 && a === b)"
        :key="`dots-${step}`"
        class="dot-frame"
        :style="{ width: `${frame}px`, height: `${frame}px`, '--dot': `${dot}px`, '--gap': `${gap}px` }"
      >
        <div class="dot-board" :class="{ spin: step >= 3 }">
          <span v-for="r in shownRows" :key="r" class="dot-row">
            <i v-for="c in a" :key="c" class="unit" :style="dotDelay(r, c)" />
          </span>
        </div>
      </div>

      <div v-else-if="mode === 'split'" class="split-wrap">
        <div class="split-bars">
          <div class="split-col tens" :style="{ flexGrow: part.chunk }">
            <span>{{ part.chunk }} 列</span>
            <strong>{{ part.rows }}×{{ part.chunk }}</strong>
            <b>{{ part.rows * part.chunk }}</b>
          </div>
          <div v-if="step >= 1 && part.rest > 0" class="split-col rest" :style="{ flexGrow: part.rest }">
            <span>{{ part.rest }} 列</span>
            <strong>{{ part.rows }}×{{ part.rest }}</strong>
            <b>{{ part.rows * part.rest }}</b>
          </div>
        </div>
        <p class="split-rows">{{ part.rows }} 行</p>
      </div>

      <div v-else-if="mode === 'near'" class="near-board">
        <div class="near-keep" :style="keepStyle">{{ step === 0 ? '20×20' : `${a}×${b}` }}</div>
        <div v-if="step >= 1" class="near-cut-col" :style="cutColStyle" />
        <div v-if="step >= 1" class="near-cut-row" :style="cutRowStyle" />
        <div v-if="step >= 2" class="near-corner" :style="cornerStyle" />
        <span class="near-axis y">20</span>
        <span class="near-axis x">20</span>
      </div>

      <p v-if="mode === 'dots' && step >= 2" class="big-product">{{ dotEquation }}</p>
      <p v-else-if="mode === 'split' && step >= stepCount - 1" class="big-product">
        {{ part.rows * part.chunk }}<template v-if="part.rest"> ＋ {{ part.rows * part.rest }}</template> ＝ {{ product }}
      </p>
      <template v-else-if="mode === 'near' && step >= 2">
        <p class="big-product">{{ product }}</p>
        <p class="near-line">{{ nearLine }}</p>
      </template>
    </div>

    <div class="lesson-actions">
      <button class="ghost" type="button" @click="replay">重看</button>
      <button class="primary" type="button" :disabled="step >= stepCount - 1" @click="next">下一步</button>
    </div>
    <button v-if="canNear && mode !== 'near'" class="ghost lesson-extra" type="button" @click="openNear">再看一种</button>
    <button v-else-if="mode === 'near'" class="ghost lesson-extra" type="button" @click="backMain">回到第一种</button>
  </section>
</template>
