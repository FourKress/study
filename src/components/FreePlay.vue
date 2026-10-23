<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Mascot from './Mascot.vue';
  import type { Op, QuizConfig } from '../game/types';

  const props = defineProps<{
    timed?: boolean;
  }>();

  const emit = defineEmits<{
    back: [];
    start: [config: QuizConfig];
  }>();

  const presetSizes = [5, 10, 15, 20];
  const ops = ref<Op[]>(['add']);
  const rangeMode = ref<'preset' | 'custom'>('preset');
  const presetMax = ref(10);
  const customMax = ref('30');
  const table = ref<'easy' | 'hard' | 'all'>('easy');
  const count = ref(12);
  const seconds = ref(8);
  const tip = ref('');

  const opChoices: { id: Op; label: string; symbol: string }[] = [
    { id: 'add', label: '加法', symbol: '＋' },
    { id: 'sub', label: '减法', symbol: '－' },
    { id: 'mul', label: '乘法', symbol: '×' },
    { id: 'div', label: '除法', symbol: '÷' },
  ];

  const regroupChoices: { id: Op; label: string; symbol: string }[] = [
    { id: 'carryAdd', label: '进位加法', symbol: '进' },
    { id: 'borrow', label: '退位减法', symbol: '退' },
  ];

  const needsRange = computed(() => ops.value.some((op) => op === 'add' || op === 'sub' || op === 'carryAdd' || op === 'borrow'));
  const needsTable = computed(() => ops.value.includes('mul') || ops.value.includes('div'));

  function toggle(op: Op) {
    if (ops.value.includes(op)) {
      if (ops.value.length === 1) {
        tip.value = '至少留一种运算';
        return;
      }
      ops.value = ops.value.filter((item) => item !== op);
      tip.value = '';
      return;
    }
    ops.value = [...ops.value, op];
    tip.value = '';
  }

  function selectPreset(size: number) {
    rangeMode.value = 'preset';
    presetMax.value = size;
    tip.value = '';
  }

  function selectCustom() {
    rangeMode.value = 'custom';
    tip.value = '';
  }

  function currentMax() {
    if (!needsRange.value || rangeMode.value === 'preset') return presetMax.value;
    const raw = customMax.value.trim();
    if (!/^\d+$/.test(raw)) return null;
    const value = Number(raw);
    if (value < 1 || value > 999) return null;
    return value;
  }

  function begin() {
    const max = currentMax();
    if (max === null) {
      tip.value = '范围要在 1 到 999 之间';
      return;
    }
    const regroup = ops.value.filter((op) => op === 'carryAdd' || op === 'borrow');
    if (regroup.length && max < 10) {
      const names = regroupChoices.filter((item) => regroup.includes(item.id)).map((item) => item.label);
      tip.value = `${names.join('和')}的运算范围至少要到 10`;
      return;
    }

    const tables =
      table.value === 'hard'
        ? { factorMin: 6, factorMax: 9, otherMin: 1, otherMax: 9 }
        : table.value === 'all'
          ? { factorMin: 1, factorMax: 9, otherMin: 1, otherMax: 9 }
          : { factorMin: 1, factorMax: 5, otherMin: 1, otherMax: 5 };

    emit('start', {
      ops: [...ops.value],
      max,
      ...tables,
      count: props.timed ? 0 : count.value,
      seconds: seconds.value,
      endless: props.timed,
    });
  }
</script>

<template>
  <section class="screen free-screen">
    <header class="topbar">
      <button class="icon-btn" type="button" @click="emit('back')">返回</button>
      <div class="title-block">
        <p class="eyebrow">{{ timed ? '看算式，心里算' : '自己出题' }}</p>
        <h1>{{ timed ? '计时练' : '自由练' }}</h1>
      </div>
      <Mascot mood="think" size="sm" />
    </header>

    <div class="panel">
      <h2>运算方法</h2>
      <div class="symbol-row">
        <button
          v-for="item in opChoices"
          :key="item.id"
          type="button"
          class="symbol-key"
          :class="[item.id, { on: ops.includes(item.id) }]"
          @click="toggle(item.id)"
        >
          <b>{{ item.symbol }}</b>
          <span>{{ item.label }}</span>
        </button>
      </div>
      <div class="regroup-row">
        <button
          v-for="item in regroupChoices"
          :key="item.id"
          type="button"
          class="symbol-key"
          :class="[item.id, { on: ops.includes(item.id) }]"
          @click="toggle(item.id)"
        >
          <b>{{ item.symbol }}</b>
          <span>{{ item.label }}</span>
        </button>
      </div>
      <p v-if="tip" class="inline-tip">{{ tip }}</p>

      <template v-if="needsRange">
        <h2>运算范围</h2>
        <div class="chips">
          <button
            v-for="size in presetSizes"
            :key="size"
            type="button"
            class="chip"
            :class="{ on: rangeMode === 'preset' && presetMax === size }"
            @click="selectPreset(size)"
          >
            {{ size }} 以内
          </button>
          <button type="button" class="chip" :class="{ on: rangeMode === 'custom' }" @click="selectCustom">自定义</button>
        </div>
        <label v-if="rangeMode === 'custom'" class="range-custom">
          <input v-model="customMax" type="text" inputmode="numeric" maxlength="3" aria-label="自定义运算范围" @input="tip = ''" />
          <span>以内</span>
        </label>
      </template>

      <template v-if="needsTable">
        <h2>乘除口诀</h2>
        <div class="chips">
          <button type="button" class="chip" :class="{ on: table === 'easy' }" @click="table = 'easy'">5 以内</button>
          <button type="button" class="chip" :class="{ on: table === 'hard' }" @click="table = 'hard'">6 到 9</button>
          <button type="button" class="chip" :class="{ on: table === 'all' }" @click="table = 'all'">全部</button>
        </div>
      </template>

      <template v-if="!timed">
        <h2>题数</h2>
        <div class="chips">
          <button v-for="size in [6, 12, 18]" :key="size" type="button" class="chip" :class="{ on: count === size }" @click="count = size">
            {{ size }} 题
          </button>
        </div>
      </template>

      <h2>每题时间</h2>
      <div class="stepper">
        <button type="button" @click="seconds = Math.max(2, seconds - 1)">－</button>
        <div>
          <strong>{{ seconds }}</strong>
          <span>秒</span>
        </div>
        <button type="button" @click="seconds = Math.min(30, seconds + 1)">＋</button>
      </div>

      <button class="primary" type="button" @click="begin">{{ timed ? '开始计时' : '开始练习' }}</button>
    </div>
  </section>
</template>
