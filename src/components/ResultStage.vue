<script setup lang="ts">
  import { computed } from 'vue';
  import Mascot from './Mascot.vue';
  import StickerArt from './StickerArt.vue';

  const props = defineProps<{
    stars: number;
    total: number;
    firstTry: number;
    levelName: string;
    sticker: string;
    firstClear: boolean;
    improved: boolean;
    hasNext: boolean;
  }>();

  const emit = defineEmits<{
    again: [];
    next: [];
    home: [];
  }>();

  const passed = computed(() => props.stars > 0);

  const headline = computed(() => {
    if (!passed.value && props.sticker) return '再试一次';
    if (!props.sticker) return '练完啦';
    if (props.firstClear) return '通关啦';
    if (props.improved) return '星星变多啦';
    return '又闯了一遍';
  });

  const praise = computed(() => {
    if (!passed.value) return props.sticker ? '这次还没闯过，再来一次吧' : '再练一次，豆豆等你';
    if (props.stars >= 3) return '几乎全对，豆豆开心极了';
    if (props.stars === 2) return '很棒，再细心一点就能满星';
    return '闯过啦，雨也停得下来';
  });
</script>

<template>
  <section class="screen result-screen">
    <Mascot :mood="passed ? 'win' : 'think'" size="lg" />
    <p class="eyebrow">{{ levelName }}</p>
    <h2>{{ headline }}</h2>
    <p class="praise">{{ praise }}</p>
    <div class="star-row" aria-label="星星">
      <svg v-for="star in 3" :key="star" viewBox="0 0 64 64" :class="{ on: star <= stars }" :style="{ animationDelay: `${star * 0.18}s` }">
        <polygon points="32,6 39,24 58,24 42,36 48,54 32,43 16,54 22,36 6,24 25,24" />
      </svg>
    </div>
    <p class="score">一次就对了 {{ firstTry }} / {{ total }} 题</p>
    <div v-if="sticker && passed" class="sticker-card">
      <StickerArt :name="sticker" />
      <strong>{{ sticker }}</strong>
      <small>{{ firstClear ? '新贴纸' : '你的贴纸' }}</small>
    </div>
    <div class="result-actions">
      <button v-if="hasNext && passed" class="primary" type="button" @click="emit('next')">下一关</button>
      <button :class="hasNext && passed ? 'ghost again' : 'primary'" type="button" @click="emit('again')">再来一次</button>
      <button class="text-btn" type="button" @click="emit('home')">{{ sticker ? '回小岛' : '返回' }}</button>
    </div>
  </section>
</template>
