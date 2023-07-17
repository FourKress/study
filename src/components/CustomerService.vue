<template>
  <div>
    <span @click.stop="handleQrCode">
      <slot></slot>
    </span>
    <van-dialog title="客服二维码" teleport="body" v-model:show="showQrcode" @confirm="handleCloseQrCode">
      <div class="qrcode-container">
        <img class="img" :src="qrcodeInfo.qrcode" />
        <p class="mobile">电话: {{ qrcodeInfo.mobile }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<script lang="ts" setup name="CustomerService">
  import { ref, defineProps, watch } from 'vue';
  import { customerService } from '/@/api';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: false,
    },
  });

  watch(
    () => props?.isOpen,
    (val = {}) => {
      if (val) {
        handleQrCode();
      }
    },
  );

  let showQrcode = ref(false);
  const qrcodeInfo = ref({});

  const handleCloseQrCode = () => {
    showQrcode.value = false;
  };

  const handleQrCode = () => {
    showQrcode.value = true;
    customerService().then((res) => {
      const { serviceMobile, wxQrCode } = res.data.value;
      qrcodeInfo.value = {
        mobile: serviceMobile,
        qrcode: wxQrCode,
      };
    });
  };
</script>

<style scoped lang="scss">
  .qrcode-container {
    .img {
      display: flex;
      width: 300px;
      height: 300px;
      margin: 50px auto 0;
    }
    .mobile {
      text-align: center;
    }
  }
</style>
