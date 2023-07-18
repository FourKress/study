<template>
  <div class="agent-income-page">
    <div class="top">
      <div class="center">
        <span class="value">+{{ incomeInfo.todayIncome || '0.00' }}</span>
        <span class="label">今日收益（元）</span>
      </div>
      <div class="list">
        <div class="item">
          <span class="value">{{ incomeInfo.currentMonthIncome || '0.00' }}</span>
          <span class="label">本月收益</span>
        </div>
        <div class="item">
          <span class="value">{{ incomeInfo.lastMonthIncome || '0.00' }}</span>
          <span class="label">上月收益</span>
        </div>
        <div class="item">
          <span class="value">{{ incomeInfo.totalIncome || '0.00' }}</span>
          <span class="label">累计收益</span>
        </div>
      </div>
    </div>

    <div class="more-btn">
      <span @click="jumpDetails">查看明细 <van-icon name="arrow" color="rgba(2, 121, 254, 1)" /></span>
    </div>

    <div class="details">
      <div class="top">
        <span>日期</span>
        <span>销售额</span>
        <span>收益</span>
      </div>
      <div class="item" v-for="item in incomeInfo.dailyReportList" :key="item">
        <span>{{ item.createTime }}</span>
        <span>{{ item.salesAmount }}</span>
        <span>+{{ item.income }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="AgentIncomePage">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { agentIncome } from '/@/api';

  const router = useRouter();
  const incomeInfo = ref({});

  onMounted(() => {
    getIncome();
  });

  const getIncome = () => {
    agentIncome().then((res) => {
      console.log(res.data.value);
      incomeInfo.value = res.data.value;
    });
  };

  const jumpDetails = () => {
    router.push('/agentIncomeDetails');
  };
</script>

<style scoped lang="scss">
  .agent-income-page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 60px;
    background-color: rgba(245, 245, 245, 1);

    .top {
      width: 100%;
      height: 418px;
      background-color: rgba(2, 121, 254, 1);

      .center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 75px 0 85px;
        color: rgba(255, 255, 255, 1);

        .value {
          font-size: 56px;
          font-weight: 500;
          padding-bottom: 16px;
        }

        .label {
          font-size: 26px;
        }
      }

      .list {
        padding: 0 36px 67px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 1);
          font-size: 26px;

          .value {
            padding-bottom: 10px;
          }
        }
      }
    }

    .more-btn {
      padding: 25px 28px;
      width: 100%;
      box-sizing: border-box;
      text-align: right;
      font-size: 26px;
      color: rgba(2, 121, 254, 1);
    }

    .details {
      width: 100%;
      padding: 0 28px;
      box-sizing: border-box;

      .top {
        height: 97px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: rgba(219, 236, 255, 1);

        span {
          width: 33.33%;
          font-size: 28px;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          text-align: center;

          &:first-child {
            text-align: left;
          }

          &:last-child {
            text-align: right;
          }
        }
      }

      .item {
        font-size: 26px;
        color: rgba(0, 0, 0, 1);
        font-weight: 500;
        margin-top: 8px;
        height: 112px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;

        span {
          width: 33.33%;
          text-align: center;
          &:first-child {
            text-align: left;
          }

          &:last-child {
            text-align: right;
            color: rgba(255, 87, 51, 1);
          }
        }
      }
    }
  }
</style>
