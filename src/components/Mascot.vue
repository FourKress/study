<script setup lang="ts">
  import { useId } from 'vue';
  import type { Mood } from '../game/types';

  withDefaults(
    defineProps<{
      mood?: Mood;
      look?: 'board' | 'timer' | 'ahead';
      size?: 'sm' | 'md' | 'lg';
    }>(),
    {
      mood: 'idle',
      look: 'ahead',
      size: 'md',
    },
  );

  const fur = useId();
  const belly = useId();
</script>

<template>
  <div class="mascot" :class="[mood, size, `look-${look}`]" aria-hidden="true">
    <svg viewBox="0 0 220 250">
      <defs>
        <radialGradient :id="fur" cx="36%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#ffe3bf" />
          <stop offset="46%" stop-color="#ffb15a" />
          <stop offset="100%" stop-color="#ef7d32" />
        </radialGradient>
        <radialGradient :id="belly" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stop-color="#fffdf8" />
          <stop offset="100%" stop-color="#ffe4c2" />
        </radialGradient>
      </defs>
      <ellipse class="ground" cx="112" cy="234" rx="58" ry="10" />
      <g class="actor">
        <g class="tail">
          <path :fill="`url(#${fur})`" d="M62 170c-40 10-50 52-4 58 16-20 18-36 24-50 4-10-8-14-20-8z" />
          <ellipse cx="34" cy="220" rx="14" ry="9" fill="#fff7ee" />
        </g>
        <g class="arm arm-l">
          <ellipse cx="62" cy="186" rx="18" ry="12" :fill="`url(#${fur})`" />
        </g>
        <g class="arm arm-r">
          <ellipse cx="168" cy="182" rx="18" ry="12" :fill="`url(#${fur})`" />
        </g>
        <ellipse class="body" cx="116" cy="148" rx="66" ry="58" :fill="`url(#${fur})`" />
        <ellipse class="belly" cx="120" cy="166" rx="36" ry="30" :fill="`url(#${belly})`" />
        <ellipse cx="98" cy="124" rx="16" ry="8" fill="#fff" opacity="0.45" />
        <g class="ear ear-l">
          <path :fill="`url(#${fur})`" d="M64 112 82 42l32 64z" />
          <path fill="#ff9ab4" d="M78 104l8-34 16 32z" />
        </g>
        <g class="ear ear-r">
          <path :fill="`url(#${fur})`" d="M168 112 150 42l-32 64z" />
          <path fill="#ff9ab4" d="M154 104l-8-34-16 32z" />
        </g>
        <ellipse class="cheek" cx="74" cy="162" rx="12" ry="8" />
        <ellipse class="cheek" cx="160" cy="162" rx="12" ry="8" />
        <g class="eyes">
          <g class="eye">
            <ellipse cx="94" cy="140" rx="16" ry="18" fill="#fff" />
            <g class="gaze">
              <circle class="pupil" cx="98" cy="144" r="6.5" />
              <circle class="shine" cx="95" cy="140" r="2.5" />
            </g>
          </g>
          <g class="eye">
            <ellipse cx="140" cy="140" rx="16" ry="18" fill="#fff" />
            <g class="gaze">
              <circle class="pupil" cx="144" cy="144" r="6.5" />
              <circle class="shine" cx="141" cy="140" r="2.5" />
            </g>
          </g>
        </g>
        <ellipse class="nose" cx="118" cy="162" rx="9" ry="7" />
        <path v-if="mood === 'oops'" class="mouth" d="M98 184q20-16 40 0" />
        <path v-else-if="mood === 'cheer' || mood === 'win'" class="mouth joy" d="M94 170q24 28 48 0" />
        <path v-else class="mouth" d="M100 174q18 14 36 0" />
        <ellipse class="foot" cx="92" cy="202" rx="18" ry="10" :fill="`url(#${fur})`" />
        <ellipse class="foot" cx="140" cy="202" rx="18" ry="10" :fill="`url(#${fur})`" />
      </g>
    </svg>
  </div>
</template>
