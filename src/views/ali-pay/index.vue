<template>
  <div class="ail-pay">
    <div v-html="apply"></div>
  </div>
</template>

<script lang="ts" setup name="AliPayPage">
  import { ref, onMounted, nextTick } from 'vue';

  const apply = ref('');

  onMounted(() => {
    let form = sessionStorage.getItem('aliPayForm');
    apply.value = form;

    nextTick(() => {
      document.forms[O].submit();
    });
  });
</script>

<style lang="scss" scoped></style>
