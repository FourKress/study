<template>
  <div class="order">
    <div class="item" v-for="item in orderList" :key="item">
      <div class="top">
        <span class="label">{{ item.createTime }}</span>
        <span class="status">{{ applyStatusMap[item.applyStatus] }}</span>
      </div>
      <div class="tips">
        <span class="label">{{ item.productName }}</span>
        <span class="amount">实付 ¥{{ item.payAmt }}</span>
      </div>
      <div class="info">
        <div class="row">
          <span class="label">订单号: </span>
          <span class="text">{{ item.paySerialNo }}</span>
        </div>
        <div class="row">
          <span class="label">客户:</span>
          <span class="text">{{ item.custName }}</span>
        </div>
      </div>
      <div class="footer" v-if="item.applyStatus === 'SUCCESS' && item.share === 'Y'">
        <div class="btn" @click="handleReport(item)">可阅报告</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="OrderPage">
  import { ref, onMounted } from 'vue';
  import { agentOrderList } from '/@/api';

  const applyStatusMap = {
    APPLY: '生成中',
    SUCCESS: '已完成',
    FAILURE: '生成失败',
    REFUND: '已退款',
  };
  let orderList = ref([]);

  const getList = () => {
    agentOrderList().then((res) => {
      console.log(res.data.value);
      orderList.value = res.data.value;
    });
  };

  onMounted(() => {
    getList();
  });

  const handleReport = (item) => {
    console.log(item);
  };
</script>

<style scoped lang="scss">
  .order {
    width: 100%;
    box-sizing: border-box;
    padding: 60px 43px;
    background-color: rgba(245, 245, 245, 1);

    .item {
      height: 244px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 1);
      box-sizing: border-box;
      padding: 28px 36px 0;
      margin-bottom: 46px;

      &:last-child {
        margin-bottom: 0;
      }

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .label {
          font-size: 28px;
          color: rgba(166, 166, 166, 1);
        }

        .status {
          font-size: 28px;
          color: rgba(255, 141, 26, 1);
        }
      }

      .info {
        .row {
          display: flex;
          align-items: center;
          font-size: 28px;
          color: rgba(0, 0, 0, 1);
          margin-bottom: 12px;

          .label {
            min-width: 90px;
            text-align: right;
            padding-right: 12px;
          }
        }
      }

      .tips {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28px;
        color: rgba(2, 121, 254, 1);
        margin: 13px 0 15px 0;

        .amount {
          color: rgba(0, 0, 0, 1);
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .btn {
          width: 184px;
          height: 60px;
          line-height: 60px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 1);
          border: 2px solid rgba(166, 166, 166, 1);
          text-align: center;
          font-size: 26px;
          color: rgba(166, 166, 166, 1);

          margin-right: 29px;

          &:last-child {
            margin-right: 0;
            color: rgba(2, 121, 254, 1);
            background: rgba(255, 255, 255, 1);
            border-color: rgba(2, 121, 254, 1);
          }
        }
      }
    }
  }
</style>
