<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Mascot from './Mascot.vue';
  import authorWechat from '../assets/author-wechat.jpg';
  import type { LicenseState } from '../game/license';

  const props = defineProps<{
    deviceId: string;
    message: string;
    busy: boolean;
    state: LicenseState;
    instantUsed: boolean;
  }>();

  const emit = defineEmits<{
    retry: [];
    hour: [];
  }>();

  const copied = ref(false);
  const showWechat = ref(false);
  let copyTimer = 0;

  const contactLabel = computed(() => {
    if (showWechat.value) return '收起二维码';
    if (props.state === 'missing') return '申请 7 天试用';
    if (props.state === 'expired') return '联系作者授权';
    return '联系作者';
  });

  const canHour = computed(() => props.state === 'missing' && !props.instantUsed && !props.busy);

  async function copy() {
    if (!props.deviceId) return;
    try {
      await navigator.clipboard.writeText(props.deviceId);
    } catch {
      const area = document.createElement('textarea');
      area.value = props.deviceId;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    copied.value = true;
    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => {
      copied.value = false;
    }, 1600);
  }
</script>

<template>
  <section class="screen map-screen">
    <header class="topbar">
      <Mascot mood="idle" size="sm" />
      <div class="title-block">
        <p class="eyebrow">{{ busy ? '请稍等' : '请家长看这里' }}</p>
        <h1>{{ busy ? '正在检查' : state === 'expired' ? '授权到期了' : '还未授权' }}</h1>
      </div>
    </header>

    <div class="door-list">
      <div class="sheet license-sheet">
        <p>{{ message }}</p>
        <p class="license-key" @click="copy">{{ deviceId || '正在读取这台设备' }}</p>
        <div class="license-actions">
          <button v-if="canHour" class="primary" type="button" @click="emit('hour')">立即试用一小时</button>
          <button class="primary" type="button" :disabled="!deviceId" @click="copy">
            {{ copied ? '已复制' : '复制设备码' }}
          </button>
          <button class="ghost" type="button" :disabled="busy" @click="emit('retry')">
            {{ busy ? '正在检查' : '重新检查' }}
          </button>
          <button class="ghost" type="button" @click="showWechat = !showWechat">
            {{ contactLabel }}
          </button>
        </div>
        <figure v-if="showWechat" class="license-qr">
          <img :src="authorWechat" alt="作者微信二维码" />
          <figcaption>扫码加作者微信</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
