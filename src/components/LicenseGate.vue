<script setup lang="ts">
  import { ref } from 'vue';
  import Mascot from './Mascot.vue';

  const props = defineProps<{
    deviceId: string;
    message: string;
    busy: boolean;
  }>();

  const emit = defineEmits<{
    retry: [];
  }>();

  const copied = ref(false);
  let copyTimer = 0;

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
        <h1>{{ busy ? '正在检查' : '还没授权' }}</h1>
      </div>
    </header>

    <div class="door-list">
      <div class="sheet license-sheet">
        <p>{{ message }}</p>
        <p class="license-key" @click="copy">{{ deviceId || '正在读取这台设备' }}</p>
        <div class="license-actions">
          <button class="primary" type="button" :disabled="!deviceId" @click="copy">
            {{ copied ? '已复制' : '复制设备码' }}
          </button>
          <button class="ghost" type="button" :disabled="busy" @click="emit('retry')">
            {{ busy ? '正在检查' : '重新检查' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
