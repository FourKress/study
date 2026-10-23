<script setup lang="ts">
  defineProps<{
    name: string;
  }>();
</script>

<template>
  <svg viewBox="0 0 120 120" class="sticker-art" aria-hidden="true">
    <template v-if="name === '橡果'">
      <ellipse cx="60" cy="78" rx="28" ry="26" fill="#c47a3a" />
      <ellipse cx="60" cy="74" rx="16" ry="18" fill="#e8a15a" />
      <path d="M60 40c8 10 6 20 0 26-8-8-10-18 0-26z" fill="#6fbf64" />
      <rect x="56" y="28" width="8" height="16" rx="3" fill="#8a5a32" />
    </template>
    <template v-else-if="name === '小鱼'">
      <ellipse cx="58" cy="64" rx="32" ry="20" fill="#ff8a7a" />
      <polygon points="86,64 112,46 112,82" fill="#ffb15a" />
      <circle cx="42" cy="60" r="4" fill="#3c3356" />
      <path d="M48 74q12 8 24 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" />
    </template>
    <template v-else-if="name === '小花'">
      <circle cx="60" cy="62" r="12" fill="#ffd166" />
      <circle cx="60" cy="38" r="12" fill="#ff8fab" />
      <circle cx="82" cy="54" r="12" fill="#ffb15a" />
      <circle cx="74" cy="80" r="12" fill="#c9b6ff" />
      <circle cx="46" cy="80" r="12" fill="#8fd3ff" />
      <circle cx="38" cy="54" r="12" fill="#b8f2a2" />
      <circle cx="60" cy="62" r="8" fill="#fff4c2" />
    </template>
    <template v-else-if="name === '彩石'">
      <ellipse cx="60" cy="78" rx="36" ry="16" fill="#d9ecff" />
      <path d="M30 70c4-24 22-36 30-36s26 12 30 36c-8 8-52 8-60 0z" fill="#7eb6ff" />
      <path d="M48 52c6 8 8 16 4 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" />
    </template>
    <template v-else-if="name === '星星'">
      <polygon points="60,18 70,48 102,48 76,66 86,98 60,78 34,98 44,66 18,48 50,48" fill="#ffd166" />
      <polygon points="60,34 66,52 84,52 70,62 74,80 60,70 46,80 50,62 36,52 54,52" fill="#fff4c2" />
    </template>
    <template v-else-if="name === '月亮'">
      <circle cx="64" cy="62" r="32" fill="#ffe08a" />
      <circle cx="78" cy="52" r="26" fill="#fff4c8" />
      <circle cx="48" cy="48" r="3" fill="#fff" />
      <circle cx="40" cy="70" r="2" fill="#fff" />
    </template>
    <template v-else-if="name === '糖果'">
      <rect x="38" y="46" width="44" height="32" rx="10" fill="#ff8fab" />
      <path d="M38 54 18 44v36l20-10z" fill="#ffd166" />
      <path d="M82 54 102 44v36l-20-10z" fill="#ffd166" />
      <path d="M50 46v32" stroke="#fff" stroke-width="4" />
    </template>
    <template v-else>
      <circle cx="60" cy="64" r="34" fill="#ffd166" />
      <circle cx="60" cy="64" r="24" fill="none" stroke="#f08a3c" stroke-width="4" />
      <polygon points="60,42 64,56 78,56 66,64 70,78 60,70 50,78 54,64 42,56 56,56" fill="#f08a3c" />
    </template>
  </svg>
</template>
