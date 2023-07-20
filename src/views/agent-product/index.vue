<template>
  <div class="agent-product">
    <div class="item" v-for="item in productList" :key="item">
      <span class="tag">已开通</span>
      <div class="top">
        <span class="tips" @click="handleCheckExample">查看示例<van-icon name="arrow" color="rgba(166, 166, 166, 1)" /></span>
      </div>
      <div class="info">
        <div class="left">
          <span class="label">{{ item.productDesc }}</span>
          <span class="text">
            <span>{{ item.agentAmt }}元</span>
            <span class="btn" @click="handleShowModifyAmtDialog(item)">修改</span>
          </span>
        </div>
        <div class="right">
          <span class="label">基础定价</span>
          <span class="text">{{ item.baseAmt }}元</span>
        </div>
      </div>
      <div class="footer">
        <div class="btn" @click="handleQrCode(item)">二维码</div>
        <div class="btn" @click="handleCopy(item)">复制链接</div>
      </div>
    </div>

    <van-dialog v-model:show="show" title="请输入销售价格" show-cancel-button @confirm="handleModifyAmt" :before-close="handleBeforeClose">
      <van-field v-model="productAmt" type="number" placeholder="请输入销售价格" />
    </van-dialog>

    <div v-show="showQrcode">
      <van-dialog title="产品二维码" :show="true" @confirm="handleCloseQrCode">
        <canvas class="qrcode"></canvas>
      </van-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup name="AgentProductPage">
  import { onMounted, ref } from 'vue';
  import { showToast } from 'vant';
  import QRCode from 'qrcode';
  import { agentProductList, agentUpdateProduct, agentPromoLink } from '/@/api';

  let show = ref(false);
  let showQrcode = ref(false);
  let productList = ref([]);
  let productAmt = ref(0);
  let modifyProduct = ref({});

  onMounted(() => {
    getProductList();
  });

  const getProductList = () => {
    agentProductList().then((res) => {
      productList.value = res.data.value;
    });
  };

  const handleShowModifyAmtDialog = (product) => {
    const { baseAmt, agentAmt, maxAmt, productCode } = product;
    productAmt.value = agentAmt;
    modifyProduct.value = {
      minAmt: baseAmt,
      maxAmt,
      productCode,
    };
    show.value = true;
  };

  const handleModifyAmt = () => {
    if (!productAmt.value) return;
    agentUpdateProduct({
      productCode: modifyProduct.value.productCode,
      agentAmt: productAmt.value,
    }).then(() => {
      showToast('改价成功');
      getProductList();
    });
  };

  const handleBeforeClose = (action) => {
    if (action === 'confirm' && !productAmt.value) return false;
    return true;
  };

  const handleQrCode = (product) => {
    agentPromoLink({
      productCode: product.productCode,
    }).then((res) => {
      showQrcode.value = true;
      QRCode.toCanvas(document.querySelector('.qrcode'), res.data.value, function (error) {
        if (error) console.error(error);
        console.log('success!');
      });
    });
  };

  const handleCloseQrCode = () => {
    showQrcode.value = false;
  };

  const handleCopy = (product) => {
    agentPromoLink({
      productCode: product.productCode,
    }).then((res) => {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', res.data.value);
      document.body.appendChild(input);
      input.setSelectionRange(0, 9999);
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        showToast('已复制');
      }
      document.body.removeChild(input);
    });
  };

  const handleCheckExample = () => {
      window.open('http://rpt.quchaq.com/profile/qucha/open/demo.pdf');
  };
</script>

<style scoped lang="scss">
  .agent-product {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 60px 43px;
    background-color: rgba(245, 245, 245, 1);

    .item {
      height: 324px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 1);
      box-sizing: border-box;
      padding: 18px 34px 0;
      margin-bottom: 60px;
      position: relative;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }

      .tag {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
        width: 100px;
        height: 50px;
        line-height: 50px;
        border-radius: 20px 0 20px 0;
        background: rgba(59, 184, 59, 1);
        text-align: center;
      }

      .top {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .tips {
          margin-right: -6px;
          font-size: 24px;
          color: rgba(166, 166, 166, 1);
        }
      }

      .info {
        padding-top: 40px;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          flex-direction: column;

          .label {
            color: rgba(0, 0, 0, 1);
            padding-bottom: 10px;
          }

          .text {
            font-size: 32px;
            color: rgba(255, 141, 26, 1);
            display: flex;
            align-items: center;

            .btn {
              font-size: 26px;
              color: rgba(2, 121, 254, 1);
              padding-left: 26px;
            }
          }
        }

        .right {
          display: flex;
          flex-direction: column;
          padding-right: 88px;

          .label {
            color: rgba(128, 128, 128, 1);
            padding-bottom: 10px;
          }

          .text {
            font-size: 32px;
            color: rgba(0, 0, 0, 1);
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 40px;

        .btn {
          width: 184px;
          height: 60px;
          line-height: 60px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 1);
          border: 2px solid rgba(2, 121, 254, 1);
          text-align: center;
          font-size: 26px;
          color: rgba(2, 121, 254, 1);

          margin-right: 29px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  :deep .van-field__control {
    text-align: center;
    font-size: 48px;
    color: rgba(255, 141, 26, 1);
    width: 80%;
    margin: 0 auto;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(229, 229, 229, 1);
    border-radius: 0px;
  }

  .qrcode {
    display: block;
    margin: 0 auto;
  }
</style>
