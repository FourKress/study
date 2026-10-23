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

  const ops = ref<Op[]>(['add']);
  const max = ref(10);
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

  const needsRange = computed(() => ops.value.includes('add') || ops.value.includes('sub'));
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

  function begin() {
    const tables =
      table.value === 'hard'
        ? { factorMin: 6, factorMax: 9, otherMin: 1, otherMax: 9 }
        : table.value === 'all'
          ? { factorMin: 1, factorMax: 9, otherMin: 1, otherMax: 9 }
          : { factorMin: 1, factorMax: 5, otherMin: 1, otherMax: 5 };

    emit('start', {
      ops: [...ops.value],
      max: max.value,
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
      <h2>运算</h2>
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
      <p v-if="tip" class="inline-tip">{{ tip }}</p>

      <template v-if="needsRange">
        <h2>加减范围</h2>
        <div class="chips">
          <button v-for="size in [5, 10, 15, 20]" :key="size" type="button" class="chip" :class="{ on: max === size }" @click="max = size">
            {{ size }} 以内
          </button>
        </div>
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
