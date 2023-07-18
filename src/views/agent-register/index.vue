<template>
  <div class="agent-register-page">
    <div class="register-top">
      <img src="../../assets/logo.png" alt="" />
      <div class="info">
        <span class="title">代理认证</span>
        <span class="sub-tips">请填写认证信息成为代理</span>
      </div>
      <CustomerService><van-icon size="20" name="service" color="#fff" /></CustomerService>
    </div>

    <div class="form-panel">
      <van-form @submit="onSubmit">
        <van-cell-group :border="false">
          <van-field v-model="userName" name="userName" placeholder="请输入本人姓名" :rules="[{ validator: validatorUserName }]" />
          <van-field v-model="mobile" name="mobile" type="digit" placeholder="请输入本人手机号" :rules="[{ validator: validatorMobile }]" />
          <van-field
            v-model="smsCode"
            name="smsCode"
            maxlength="6"
            type="digit"
            placeholder="请输入验证码"
            :rules="[{ validator: validatorSmsCode }]"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="countdown > 0 || !mobile || !mobilePattern.test(mobile)"
                @click="sendSmsCode"
                >{{ countdown ? `倒计时${countdown}S` : '发送验证码' }}</van-button
              >
            </template>
          </van-field>
        </van-cell-group>
        <div class="protocol">
          <van-checkbox v-model="checked" />
          <span class="tips"
            >您已阅读并同意<span class="link" @click="openProtocol('agentManager')">《代理商管理制度》</span
            ><span class="link" @click="openProtocol('objection')">《异议说明》</span
            >，点击勾选即代表您同意上述法律文书的相关条款并签署上述法律文书。</span
          >
        </div>

        <div class="submit-btn">
          <van-button block type="primary" native-type="submit">提交认证</van-button>
        </div>
      </van-form>
    </div>

    <Protocol :protocolType="protocolType" />
  </div>
</template>

<script lang="ts" setup name="AgentRegisterPage">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { showToast } from 'vant';
  import { getSmsCode, agentLoginBySms, agentStatus } from '/@/api';
  import { useUserStore } from '/@/store/modules/user';
  import CustomerService from '/@/components/CustomerService.vue';
  import Protocol from '/@/components/protocol.vue';

  const userStore = useUserStore();

  const router = useRouter();
  const userName = ref('');
  const mobile = ref('');
  const smsCode = ref('');
  const userNamePattern = /^[\u4e00-\u9fa5]+$/;
  const mobilePattern = /^1[34578]\d{9}$/;
  const smsCodePattern = /^\d{6}$/;
  const checked = ref(false);
  let countdown = ref(0);
  let timer = ref(0);
  let smsKey = ref(sessionStorage.getItem('smsKey'));
  const protocolType = ref('');

  const validatorUserName = (val) => {
    if (!val) {
      return '请输入本人姓名';
    }
    if (!userNamePattern.test(val)) {
      return '请输入中文姓名';
    }
    return '';
  };

  const validatorMobile = (val) => {
    if (!val) {
      return '请输入本人手机号';
    }
    if (!mobilePattern.test(val)) {
      return '请输入正确的手机号';
    }
    return '';
  };

  const validatorSmsCode = (val) => {
    if (!val) {
      return '请输入验证码';
    }
    if (!smsCodePattern.test(val)) {
      return '请输入正确的验证码';
    }
    return '';
  };

  const onSubmit = (values) => {
    if (!checked.value) {
      showToast('请先阅读并同意勾选协议');
      return;
    }
    const { mobile, userName, smsCode } = values;
    agentLoginBySms({
      mobile,
      userName,
      smsCode,
      smsKey: smsKey.value,
    }).then(async (res) => {
      const data = res?.data?.value;
      const { token } = data;
      token && userStore.setToken(token);

      const statusRes = await agentStatus();
      userStore.setInfo({
        mobile,
        status: statusRes.data.value === 'BIND_MOBILE',
      });
      await router.push(`/agentProduct`);
    });
  };

  const sendSmsCode = () => {
    countdown.value = 60;
    timer.value = setInterval(() => {
      countdown.value = countdown.value - 1;
      if (countdown.value <= 0) {
        countdown.value = 0;
        clearInterval(timer.value);
      }
    }, 1000);
    getSmsCode({
      mobile: mobile.value,
    })
      .then((res) => {
        const data = res?.data?.value;
        smsKey.value = data?.smsKey;
        sessionStorage.setItem('smsKey', smsKey.value);
      })
      .catch(() => {
        countdown.value = 0;
        clearInterval(timer.value);
      });
  };

  const openProtocol = (type) => {
    protocolType.value = type;
  };
</script>

<style scoped lang="scss">
  .agent-register-page {
    min-height: 100%;

    padding: 42px 42px 0;
    box-sizing: border-box;
    background-color: #ccc;
    padding-bottom: calc(42px + env(safe-area-inset-bottom));
    background-image: linear-gradient(to bottom, #3c93d4, #026abb);

    .register-top {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      position: relative;

      img {
        width: 100px;
        height: 100px;
        display: block;
        margin-right: 47px;
        position: absolute;
        left: 0;
        top: 0;
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .title {
          font-size: 40px;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          padding-bottom: 6px;
        }

        .sub-tips {
          font-size: 24px;
          font-weight: 500;
          color: #fff;
        }
      }

      .right-btn {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .form-panel {
      box-sizing: border-box;
      padding: 43px 34px 0;
      border-radius: 20px;
      background-color: #fff;
      margin: 40px 0;
      overflow: hidden;

      :deep .van-cell {
        padding-left: 18px;
        padding-right: 18px;
        margin-bottom: 63px;
        border-radius: 10px;
        position: relative;
        border: 1px solid rgba(229, 229, 229, 1);
        overflow: unset;

        .van-field__error-message {
          position: absolute;
          left: 0;
          bottom: 0;
          transform: translateY(150%);
        }

        &:last-child {
          margin-bottom: 0;
        }

        &:after {
          display: none;
        }
      }

      .protocol {
        font-size: 24px;
        margin-top: 52px;
        color: rgba(128, 128, 128, 1);
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        box-sizing: border-box;
        width: 100%;

        .tips {
          width: calc(100% - 60px);

          .link {
            color: rgba(2, 121, 254, 1);
          }
        }

        :deep .van-checkbox {
          min-width: 40px;
          width: 40px;
          margin-right: 6px;
          align-items: flex-start;
        }
      }

      .submit-btn {
        margin: 40px 0;
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
