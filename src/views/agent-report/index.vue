<template>
  <div class="agent-report-page">
    <div class="top-tips">请勿随意传播 避免客户信息泄露</div>
    <div class="item" v-for="item in reportList" :key="item">
      <div class="top">
        <span class="label">{{ item.productName }}</span>
        <span class="status">到期时间</span>
      </div>
      <div class="timer"> {{ item.expireDate }} </div>
      <div class="info">
        <div class="row">
          <span class="label">姓名:</span>
          <span class="text">{{ item.custName }}</span>
        </div>
        <div class="row">
          <span class="label">身份证号:</span>
          <span class="text">{{ item.idNo }}</span>
        </div>
        <div class="row">
          <span class="label">手机号:</span>
          <span class="text">{{ item.mobile }}</span>
        </div>
      </div>
      <div class="footer">
        <div class="btn" @click="handleCheckDetails(item)">查看详情</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="AgentReportPage">
  import { agentReportList, custReportView } from '/@/api';
  import { onMounted, ref } from 'vue';

  let reportList = ref([]);

  onMounted(() => {
    getReportList();
  });

  const getReportList = () => {
    agentReportList().then((res) => {
      reportList.value = res.data.value;
    });
  };
  const handleCheckDetails = (item) => {
    console.log(item);
    custReportView({
      paySerialNo: item.paySerialNo,
    }).then((res) => {
        console.log(res.data.value)
    });
  };
</script>

<style scoped lang="scss">
  .agent-report-page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 43px 60px;
    background-color: rgba(245, 245, 245, 1);

    .top-tips {
      padding: 28px 0;
      font-size: 26px;
      color: rgba(2, 121, 254, 1);
    }

    .item {
      height: 389px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 1);
      box-sizing: border-box;
      padding: 20px 34px 0;
      margin-bottom: 60px;

      &:last-child {
        margin-bottom: 0;
      }

      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .label {
          font-size: 32px;
          color: rgba(0, 0, 0, 1);
        }

        .status {
          font-size: 28px;
          color: rgba(255, 141, 26, 1);
        }
      }

      .timer {
        width: 100%;
        text-align: right;
        font-size: 28px;
        color: rgba(255, 141, 26, 1);
      }

      .info {
        padding-top: 28px;

        .row {
          font-size: 28px;
          color: rgba(128, 128, 128, 1);
          margin-bottom: 24px;

          .text {
            padding-left: 10px;
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: -18px;

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
</style>
