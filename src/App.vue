<template>
  <div class="container"> {{ firstItem }} {{ calcType ? '+' : '-' }} {{ secondItem }} </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const firstItem = ref(0);
  const secondItem = ref(0);
  const calcType = ref(1);

  const handleCompute = () => {
    const type = Math.round(Math.random() * 10000) % 2;
    calcType.value = type;

    if (type) {
      firstItem.value = Math.round(Math.random() * 18) + 1;
      secondItem.value = Math.round(Math.random() * 18) + 1;
    } else {
      firstItem.value = Math.round(Math.random() * 12) + 7;
      secondItem.value = Math.round(Math.random() * (firstItem.value - 2)) + 1;
    }
  };

  const handleCountDown = () => {
    handleCompute();
    setInterval(() => {
      handleCompute();
    }, 2000);
  };

  handleCountDown();
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
    overflow: hidden;
  }

  .container {
    height: 100vh;
    font-size: 214px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
