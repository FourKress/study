<template>
  <router-view />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(async () => {
    if (!location.href.includes('/#/')) {
      const href = `${location.origin}/#/${location.href.split('#/')[1]}${location.search}`;
      window.location.replace(href);
      return;
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
