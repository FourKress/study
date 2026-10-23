<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import Mascot from './Mascot.vue';
  import TimesLesson from './TimesLesson.vue';

  const emit = defineEmits<{ back: [] }>();

  const span = ref<9 | 19>(9);
  const col = ref(3);
  const row = ref(3);
  const open = ref(false);
  const scroller = ref<HTMLElement | null>(null);
  const scrollPad = ref(0);
  const cellSize = ref(0);

  const scrollStyle = computed(() => {
    const style: Record<string, string> = {};
    if (scrollPad.value > 0) style.paddingTop = `${scrollPad.value}px`;
    if (cellSize.value > 0) style['--cell'] = `${cellSize.value}px`;
    return Object.keys(style).length ? style : undefined;
  });

  const factors = computed(() => Array.from({ length: span.value }, (_, index) => index + 1));
  const product = computed(() => col.value * row.value);

  function cellClass(r: number, c: number) {
    return {
      block: r <= row.value && c <= col.value,
      hit: r === row.value && c === col.value,
      twin: row.value !== col.value && r === col.value && c === row.value,
      seam: span.value === 19 && c === 9,
      'seam-row': span.value === 19 && r === 9,
      wide: r * c >= 100,
    };
  }

  function colHead(c: number) {
    return { on: c === col.value, seam: span.value === 19 && c === 9 };
  }

  function rowHead(r: number) {
    return { on: r === row.value, 'seam-row': span.value === 19 && r === 9 };
  }

  function nudge(el: Element | null | undefined) {
    const box = scroller.value;
    if (!box || !(el instanceof HTMLElement)) return;
    const br = box.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (er.left < br.left + 52) box.scrollLeft -= br.left + 52 - er.left;
    else if (er.right > br.right - 8) box.scrollLeft += er.right - br.right + 8;
    if (er.top < br.top + 52) box.scrollTop -= br.top + 52 - er.top;
    else if (er.bottom > br.bottom - 8) box.scrollTop += er.bottom - br.bottom + 8;
  }

  function pickCol(n: number) {
    col.value = n;
    nextTick(() => nudge(scroller.value?.querySelector(`thead [data-factor="${n}"]`)));
  }

  function pickRow(n: number) {
    row.value = n;
    nextTick(() => nudge(scroller.value?.querySelector(`tbody th [data-factor="${n}"]`)));
  }

  function pick(c: number, r: number) {
    col.value = c;
    row.value = r;
    nextTick(() => nudge(scroller.value?.querySelector('td.hit')));
  }

  function alignTable(box: HTMLElement) {
    const table = box.querySelector('table');
    if (!table) return;
    const extra = box.clientHeight - table.offsetHeight;
    scrollPad.value = extra > 8 ? Math.floor(extra / 2) : 0;
    box.scrollTop = 0;
    box.scrollLeft = 0;
  }

  function placeTable() {
    nextTick(() => {
      const box = scroller.value;
      if (!box || window.innerWidth < 900) {
        scrollPad.value = 0;
        cellSize.value = 0;
        return;
      }
      if (span.value === 19) {
        const tracks = 20;
        const edge = (tracks + 1) * 2;
        const fit = Math.min(
          Math.floor((box.clientWidth - edge) / tracks),
          Math.floor((box.clientHeight - edge) / tracks),
        );
        const next = Math.max(22, Math.min(36, fit));
        if (next !== cellSize.value) {
          cellSize.value = next;
          scrollPad.value = 0;
          nextTick(() => alignTable(box));
          return;
        }
      } else if (cellSize.value !== 0) {
        cellSize.value = 0;
      }
      alignTable(box);
    });
  }

  function showNines() {
    span.value = 9;
    col.value = Math.min(col.value, 9);
    row.value = Math.min(row.value, 9);
    nextTick(() => {
      if (!scroller.value) return;
      scroller.value.scrollLeft = 0;
      scroller.value.scrollTop = 0;
    });
  }

  function showTeens() {
    span.value = 19;
    if (window.innerWidth >= 900) return;
    nextTick(() => {
      const box = scroller.value;
      const el = box?.querySelector('thead [data-factor="10"]');
      if (!box || !el) return;
      const br = box.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      box.scrollLeft += er.left - br.left - 48;
      box.scrollTop = 0;
    });
  }

  watch(span, placeTable);
  watch(open, (isOpen) => {
    if (!isOpen) placeTable();
  });
  onMounted(() => {
    placeTable();
    window.addEventListener('resize', placeTable);
  });
  onBeforeUnmount(() => window.removeEventListener('resize', placeTable));
</script>

<template>
  <div class="times-root">
    <TimesLesson v-if="open" :a="col" :b="row" @close="open = false" />
    <section v-else class="screen times-screen">
      <header class="topbar">
        <button class="icon-btn" type="button" @click="emit('back')">返回</button>
        <div class="title-block">
          <p class="eyebrow">几行几列</p>
          <h1>乘法表</h1>
        </div>
        <Mascot mood="think" size="sm" />
      </header>

      <p class="times-hint">点上面一个数，再点左边一个数</p>

      <div class="chips times-range">
        <button class="chip" :class="{ on: span === 9 }" type="button" @click="showNines">九九</button>
        <button class="chip" :class="{ on: span === 19 }" type="button" @click="showTeens">十九</button>
      </div>

      <p class="times-eq">
        {{ col }} × {{ row }} = <b>{{ product }}</b>
      </p>

      <div ref="scroller" class="times-scroll" :class="{ full: span === 19 }" :style="scrollStyle">
        <table class="times-grid" aria-label="1 到 19 的乘法表">
          <thead>
            <tr>
              <th class="corner" scope="col">×</th>
              <th v-for="c in factors" :key="`h-${c}`" scope="col" :class="colHead(c)">
                <button
                  class="factor"
                  type="button"
                  :data-factor="c"
                  :aria-pressed="c === col"
                  @click="pickCol(c)"
                >
                  {{ c }}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in factors" :key="`r-${r}`">
              <th scope="row" :class="rowHead(r)">
                <button
                  class="factor"
                  type="button"
                  :data-factor="r"
                  :aria-pressed="r === row"
                  @click="pickRow(r)"
                >
                  {{ r }}
                </button>
              </th>
              <td
                v-for="c in factors"
                :key="`${r}-${c}`"
                :class="cellClass(r, c)"
                :aria-label="`${c} × ${r} = ${r * c}`"
                @click="pick(c, r)"
              >
                <span v-if="r === row && c === col" :key="`hit-${col}-${row}`" class="pop">{{ r * c }}</span>
                <i v-else-if="r <= row && c <= col" class="cell-unit" />
                <span v-else>{{ r * c }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button class="primary times-go" type="button" @click="open = true">豆豆讲讲</button>
    </section>
  </div>
</template>
