<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { getUrlParams2 } from '/@/utils';
  import { wechatBinding } from '/@/api';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

  onMounted(async () => {
    const { code = '' } = getUrlParams2(window.location.href);
    if (code) {
      const res = await wechatBinding({ code });

      const { token, status } = res.data.value || {};
      token && userStore.setToken(token);

      userStore.setInfo({
        mobile: '',
        status: status === 'BIND_MOBILE',
      });
    }
  });
</script>

<style>
  #app {
    width: 100vw;
    height: 100%;
    box-sizing: border-box;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    position: fixed;
    overflow-y: auto;
  }
</style>
