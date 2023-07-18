<template>
  <div class="user-page">
    <div class="user-info">
      <div class="avatar">
        <van-icon name="manager" size="48" color="#D1D1D1" />
      </div>
      <div class="info">
        <span class="name">{{ status ? useInfo.agentName : '游客' }}</span>
        <span class="phone" v-if="status">{{ useInfo.mobile }}</span>
      </div>

      <div class="tag" v-if="!status">未认证</div>
    </div>

    <div class="card">
      <div class="row" @click="handleJump('/agentProduct')">
        <van-icon name="apps-o" size="20" color="rgba(2, 121, 254, 1)" />
        <span class="label">代理产品</span>
      </div>
      <div class="row" @click="handleJump('/agentReport')">
        <van-icon name="description" size="20" color="rgba(2, 121, 254, 1)" />
        <span class="label">可阅报告</span>
      </div>
      <div class="row" @click="handleJump('/agentOrder')">
        <van-icon name="orders-o" size="20" color="rgba(2, 121, 254, 1)" />
        <span class="label">订单</span>
      </div>
    </div>

    <div class="card">
      <div class="row" @click="handleJump('/agentIncome')">
        <van-icon name="balance-o" size="20" color="rgba(2, 121, 254, 1)" />
        <span class="label">收益</span>
      </div>
    </div>
    <div class="card" v-if="!status">
      <div class="row" @click="handleJump('/agentRegister')">
        <van-icon name="shield-o" size="20" color="rgba(2, 121, 254, 1)" />
        <span class="label">认证</span>
      </div>
    </div>
    <div class="card">
      <CustomerService>
        <div class="row">
          <van-icon name="service" size="20" color="rgba(2, 121, 254, 1)" />
          <span class="label">联系客服</span>
        </div>
      </CustomerService>
    </div>
  </div>
</template>

<script lang="ts" setup name="UserPage">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { agentMy } from '/@/api';
  import { useUserStore } from '/@/store/modules/user';
  import CustomerService from '/@/components/CustomerService.vue';

  const router = useRouter();
  const userStore = useUserStore();
  const appUser = userStore.info;
  const { mobile, status } = appUser;

  const useInfo = ref({});

  onMounted(() => {
    getMyInfo();
  });

  const getMyInfo = () => {
    if (!mobile) return;
    agentMy({
      mobile,
    }).then((res) => {
      useInfo.value = res.data.value;
    });
  };

  const handleJump = (path) => {
    router.push(path);
  };
</script>

<style lang="scss" scoped>
  .user-page {
    width: 100%;
    min-height: 100%;
    background-color: rgba(245, 245, 245, 1);
    box-sizing: border-box;
    padding: 50px 45px 60px;

    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 40px;

      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        overflow: hidden;
      }

      .info {
        flex: 1;
        padding-left: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 28px;
        color: rgba(0, 0, 0, 1);
      }

      .tag {
        width: 100px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        border-radius: 4px;
        background: rgba(255, 251, 230, 1);
        font-size: 24px;
        color: rgba(250, 173, 20, 1);
      }
    }

    .card {
      margin-bottom: 65px;
      background-color: #fff;
      min-height: 110px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;

      &:last-child {
        margin-top: 0;
      }

      .row {
        height: 110px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 40px;

        .label {
          font-size: 28px;
          color: rgba(0, 0, 0, 1);
          padding-left: 26px;
        }
      }
    }
  }
</style>
