<template>
  <div class="layout">
    <van-nav-bar placeholder left-arrow @click-left="onClickLeft">
      <template #left>
        <van-icon size="20" color="#fff" name="arrow-left" />
      </template>
      <template #title>
        <span class="nav-title">{{ title }}</span>
      </template>
      <template #right>
        <CustomerService>
          <van-icon size="20" name="service" color="#fff" />
        </CustomerService>
      </template>
    </van-nav-bar>
    <div class="container">
      <div class="main">
        <div class="scroll-view">
          <router-view />
        </div>
      </div>
    </div>
    <van-tabbar route placeholder v-if="hasTabbar">
      <van-tabbar-item v-for="tabbar in tabbarList" :key="tabbar.path" replace :to="`${tabbar.path}`" :icon="tabbar.icon">{{
        tabbar.label
      }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts" setup name="BasicLayoutPage">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  const onClickLeft = () => history.back();

  let hasTabbar = ref(true);
  let title = ref('');

  const route = useRoute();
  watch(
    () => route?.meta,
    (val = {}) => {
      hasTabbar.value = val?.hasTabbar;
      title.value = val?.title;
    },
    { immediate: true },
  );

  const tabbarList = [
    {
      label: '产品',
      path: '/agentProduct',
      icon: 'apps-o',
    },
    {
      label: '报告',
      path: '/agentReport',
      icon: 'description',
    },
    {
      label: '收益',
      path: '/agentIncome',
      icon: 'balance-o',
    },
    {
      label: '我的',
      path: '/agentUser',
      icon: 'contact',
    },
  ];
</script>

<style scoped lang="scss">
  .layout {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .nav-title {
      font-size: 32px;
      color: rgba(255, 255, 255, 1);
    }
  }
  .container {
    width: 100%;
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .main {
      flex: 1;
      overflow: hidden;
      overflow-y: auto;

      .scroll-view {
        height: 100%;
        overflow-y: auto;
      }
    }
  }

  .img {
    display: flex;
    width: 300px;
    height: 300px;
    margin: 50px auto 0;
  }
</style>
