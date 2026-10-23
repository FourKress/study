<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import Mascot from './Mascot.vue';
  import { makeQuestion, starsFor } from '../game/engine';
  import { playTone } from '../game/sound';
  import type { Mood, Question, QuizConfig, RoundResult } from '../game/types';

  const props = defineProps<{
    config: QuizConfig;
    title: string;
  }>();

  const emit = defineEmits<{
    finish: [result: RoundResult];
    quit: [];
  }>();

  const index = ref(0);
  const question = ref<Question>(makeQuestion(props.config));
  const wrong = ref<number[]>([]);
  const phase = ref<'play' | 'reveal' | 'pause'>('play');
  const revealReason = ref<'ok' | 'time' | null>(null);
  const firstTry = ref(0);
  const attempted = ref(false);
  const streak = ref(0);
  const leftMs = ref(props.config.seconds * 1000);
  const cooling = ref(false);
  const bits = ref<{ id: number; x: number; y: number; dx: number; dy: number; rot: number; color: string; delay: number }[]>([]);

  const totalMs = computed(() => props.config.seconds * 1000);
  const ratio = computed(() => Math.max(0, leftMs.value / totalMs.value));
  const dash = 94.2;
  const urgent = computed(() => phase.value === 'play' && leftMs.value <= 3000);
  const look = computed(() => (urgent.value ? 'timer' : phase.value === 'play' ? 'board' : 'ahead'));
  const mood = computed<Mood>(() => {
    if (phase.value === 'pause') return 'idle';
    if (revealReason.value === 'ok') return 'cheer';
    if (revealReason.value === 'time' || wrong.value.length) return 'oops';
    return 'think';
  });
  const speech = computed(() => {
    if (phase.value === 'pause') return '休息一下';
    if (revealReason.value === 'ok' && streak.value >= 2) return '连对啦！';
    if (revealReason.value === 'ok' && !attempted.value) return '太棒了！';
    if (revealReason.value === 'ok') return '答对啦';
    if (revealReason.value === 'time') return '时间到啦';
    if (wrong.value.length) return '再试一次';
    return '点一个答案';
  });

  let frame = 0;
  let last = 0;
  let alive = true;
  const timers: number[] = [];

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(() => {
      if (alive) fn();
    }, ms);
    timers.push(id);
  }

  function loop(now: number) {
    if (last && phase.value === 'play') {
      leftMs.value -= Math.min(now - last, 200);
      if (leftMs.value <= 0) {
        leftMs.value = 0;
        onTimeout();
      }
    }
    last = now;
    frame = requestAnimationFrame(loop);
  }

  function burst(x: number, y: number) {
    const colors = ['#ffd166', '#ff8fab', '#7bdff2', '#b8f2a2', '#c9b6ff', '#ffb15a'];
    bits.value = Array.from({ length: 16 }, (_, id) => ({
      id,
      x,
      y,
      dx: (Math.random() - 0.5) * 220,
      dy: -40 - Math.random() * 110,
      rot: Math.random() * 180,
      color: colors[id % colors.length],
      delay: Math.random() * 0.06,
    }));
  }

  function pick(option: number, event?: MouseEvent) {
    if (phase.value !== 'play' || cooling.value || wrong.value.includes(option)) return;
    if (option === question.value.answer) {
      const clean = !attempted.value;
      if (clean) {
        firstTry.value += 1;
        streak.value += 1;
      } else {
        streak.value = 0;
      }
      revealReason.value = 'ok';
      phase.value = 'reveal';
      const point = event ?? { clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 };
      burst(point.clientX, point.clientY);
      playTone('ok');
      later(next, 1100);
      return;
    }
    attempted.value = true;
    streak.value = 0;
    wrong.value = [...wrong.value, option];
    cooling.value = true;
    playTone('bad');
    later(() => {
      cooling.value = false;
    }, 600);
  }

  function onTimeout() {
    if (phase.value !== 'play') return;
    streak.value = 0;
    revealReason.value = 'time';
    phase.value = 'reveal';
    playTone('bad');
    later(next, 1100);
  }

  function next() {
    if (!alive) return;
    if (index.value + 1 >= props.config.count) {
      playTone('win');
      emit('finish', {
        total: props.config.count,
        firstTry: firstTry.value,
        stars: starsFor(firstTry.value, props.config.count),
      });
      return;
    }
    index.value += 1;
    question.value = makeQuestion(props.config);
    wrong.value = [];
    attempted.value = false;
    cooling.value = false;
    revealReason.value = null;
    bits.value = [];
    phase.value = 'play';
    leftMs.value = totalMs.value;
  }

  function resume() {
    if (phase.value === 'pause') phase.value = 'play';
  }

  function skip() {
    phase.value = 'play';
    onTimeout();
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && phase.value === 'pause') {
      resume();
      return;
    }
    if (phase.value !== 'play') return;
    const choice = Number(event.key);
    if (choice >= 1 && choice <= question.value.options.length) pick(question.value.options[choice - 1]);
  }

  onMounted(() => {
    last = performance.now();
    frame = requestAnimationFrame(loop);
    window.addEventListener('keydown', onKey);
  });

  onBeforeUnmount(() => {
    alive = false;
    cancelAnimationFrame(frame);
    timers.forEach((id) => window.clearTimeout(id));
    window.removeEventListener('keydown', onKey);
  });
</script>

<template>
  <section class="screen play-screen">
    <div class="bits" aria-hidden="true">
      <i
        v-for="bit in bits"
        :key="`${index}-${bit.id}`"
        class="bit"
        :style="{
          left: `${bit.x}px`,
          top: `${bit.y}px`,
          background: bit.color,
          animationDelay: `${bit.delay}s`,
          '--dx': `${bit.dx}px`,
          '--dy': `${bit.dy}px`,
          '--rot': `${bit.rot}deg`,
        }"
      ></i>
    </div>

    <header class="play-bar">
      <button class="icon-btn" type="button" @click="phase = 'pause'">暂停</button>
      <div class="progress" aria-hidden="true">
        <i v-for="dot in config.count" :key="dot" :class="{ done: dot - 1 < index, now: dot - 1 === index }"></i>
      </div>
    </header>

    <div class="stage">
      <div class="buddy">
        <p class="bubble">{{ speech }}</p>
        <Mascot :mood="mood" :look="look" size="lg" />
      </div>

      <div class="sign">
        <div class="timer" :class="{ warn: urgent }">
          <svg viewBox="0 0 36 36">
            <circle class="track" cx="18" cy="18" r="15" />
            <circle class="bar" cx="18" cy="18" r="15" :style="{ strokeDashoffset: String(dash * (1 - ratio)) }" />
          </svg>
          <span>{{ Math.ceil(leftMs / 1000) }}</span>
        </div>
        <p class="round-name">{{ title }} · {{ index + 1 }}/{{ config.count }}</p>
        <p v-if="revealReason === 'ok' && streak >= 2" class="combo"><i>★</i> 连对 {{ streak }}</p>
        <h2 :key="index" class="prompt">{{ question.prompt }}</h2>
        <div :key="`choices-${index}`" class="choices">
          <button
            v-for="(option, optionIndex) in question.options"
            :key="`${index}-${optionIndex}`"
            type="button"
            class="choice"
            :class="{
              bad: wrong.includes(option),
              good: phase === 'reveal' && option === question.answer,
            }"
            :disabled="phase !== 'play' || cooling || wrong.includes(option)"
            @click="pick(option, $event)"
          >
            {{ option }}
          </button>
        </div>
        <p class="key-hint">电脑上也可以按 1 2 3 4</p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="phase === 'pause'" class="shade">
        <div class="sheet">
          <Mascot mood="idle" size="sm" />
          <h3>暂停啦</h3>
          <button class="primary" type="button" @click="resume">继续</button>
          <button class="ghost" type="button" @click="skip">跳过这题</button>
          <button class="text-btn" type="button" @click="emit('quit')">回到小岛</button>
        </div>
      </div>
    </Teleport>
  </section>
</template>
