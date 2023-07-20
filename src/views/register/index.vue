<template>
  <div class="register-page">
    <div class="register-top">
      <img src="../../assets/logo.png" alt="" />
      <div class="info">
        <span class="title">{{ isRegister ? '风险评估' : '登录查看报告' }}</span>
        <span class="sub-tips">{{ isRegister ? '为保证报告准确，请输入真实信息' : '登录后可查看已购买报告' }}</span>
      </div>
      <CustomerService class="right-btn">
        <van-icon size="20" name="service" color="#fff" />
      </CustomerService>
    </div>

    <div class="form-panel">
      <van-form @submit="onSubmit">
        <van-cell-group :border="false">
          <van-field
            v-model="userName"
            name="userName"
            v-if="isRegister"
            placeholder="请输入本人姓名"
            :rules="[{ validator: validatorUserName }]"
          />
          <van-field v-model="idNo" name="idNo" v-if="isRegister" placeholder="请输入本人身份证" :rules="[{ validator: validatorIdNo }]" />
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
        <div class="protocol" v-if="isRegister">
          <van-checkbox v-model="checked" />
          <span class="tips"
            >您已阅读并同意<span class="link" @click="openProtocol('customer')">《用户协议》</span
            ><span class="link" @click="openProtocol('objection')">《异议说明》</span
            ><span class="link" @click="openProtocol('tripartite')">《代收代付三方协议》</span
            ><span class="link" @click="openProtocol('auth')">《授权书》</span
            ><span class="link" @click="openProtocol('server')">《信息技术服务合同》</span
            >，点击勾选即代表您同意上述法律文书的相关条款并签署上述法律文书。</span
          >
        </div>

        <div class="submit-btn">
          <van-button block type="primary" native-type="submit">{{ isRegister ? `${amt}元查询` : '登录' }}</van-button>
        </div>
      </van-form>

      <div class="footer">
        <van-icon v-if="isRegister" name="description" size="20" color="rgba(128, 128, 128, 1)" />
        <div class="tips" v-if="isRegister" @click="handleCheckExample">示例报告</div>
        <div class="right" @click="jumpLogin">{{ isRegister ? '已有报告，立即登录' : '暂无报告，立即查询' }}</div>
        <van-icon name="arrow" color="rgba(2, 121, 254, 1)" />
      </div>
    </div>

    <Advertising />

    <van-action-sheet v-model:show="visiblePay" :title="`支付金额: ${amt}`">
      <div class="pay-content">
        <div class="row" v-for="pay in payList" :key="pay.key" :class="selectPay === pay.key && 'active'" @click="handleSelectPay(pay)">
          <div class="icon">
            <img :src="pay.icon" alt="" />
          </div>
          <div class="label">{{ pay.label }}</div>
        </div>
        <van-button type="primary" block :disabled="!selectPay" @click="handlePay">立即支付</van-button>
      </div>
    </van-action-sheet>

    <Protocol
      :protocolType="protocolType"
      :name="userName"
      :mobile="mobile"
      :idNo="idNo"
      :agentName="agentName"
      :agentMobile="agentMobile"
    />

    <div v-show="showPayQrcode">
      <van-dialog title="微信支付二维码" :show="true" show-cancel-button :show-confirm-button="false" @cancel="handlePayCancel">
        <div class="qrcode-container">
          <canvas class="img qrcode"></canvas>
        </div>
      </van-dialog>
    </div>

    <div v-html="applyForm"></div>
  </div>
</template>

<script lang="ts" setup name="RegisterPage">
  import { nextTick, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { showToast, showLoadingToast, closeToast } from 'vant';
  import Advertising from '/@/components/Advertising.vue';
  import CustomerService from '/@/components/CustomerService.vue';
  import Protocol from '/@/components/protocol.vue';
  import { agentProductAmt, custLoginBySms, custReport, getSmsCode, getAgentInfo, custApplyDetail } from '/@/api';
  import { getUrlParams2, judgeClient } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import QRCode from 'qrcode';

  const router = useRouter();
  const userStore = useUserStore();
  const { agentNo = 'ATqucha', productCode = 'BASE' } = getUrlParams2(window.location.href);
  const userName = ref('');
  const idNo = ref('');
  const mobile = ref('');
  const smsCode = ref('');
  const userNamePattern = /^[\u4e00-\u9fa5]+$/;
  const idCardPattern = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const mobilePattern = /^1[34578]\d{9}$/;
  const smsCodePattern = /^\d{6}$/;
  let isRegister = ref(true);
  let visiblePay = ref(false);
  let selectPay = ref('');
  let smsKey = ref(sessionStorage.getItem('smsKey'));
  let countdown = ref(0);
  let timer = ref(0);
  let amt = ref(0);
  const checked = ref(false);
  const protocolType = ref('');
  const agentName = ref('');
  const agentMobile = ref('');
  const showPayQrcode = ref(false);
  const applyForm = ref('');
  const payTimer = ref(0);

  sessionStorage.setItem('agentNo', agentNo);
  sessionStorage.setItem('productCode', productCode);

  agentProductAmt({
    agentNo,
    productCode,
  }).then((res) => {
    amt.value = res?.data?.value;
  });

  const payList = [
    {
      key: 'WECHAT_PAY',
      label: '微信支付',
      icon: new URL('../../assets/wechat.png', import.meta.url).href,
    },
    {
      key: 'ALI_PAY',
      label: '支付宝支付',
      icon: new URL('../../assets/aliPay.png', import.meta.url).href,
    },
  ];

  const validatorUserName = (val) => {
    if (!val) {
      return '请输入本人姓名';
    }
    if (!userNamePattern.test(val)) {
      return '请输入中文姓名';
    }
    return '';
  };

  const validatorIdNo = (val) => {
    if (!val) {
      return '请输入本人身份证号';
    }
    if (!idCardPattern.test(val)) {
      return '请输入正确的身份证号';
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
    if (!checked.value && isRegister.value) {
      showToast('请先阅读并同意勾选协议');
      return;
    }
    const { mobile, userName, smsCode } = values;

    if (isRegister.value) {
      selectPay.value = '';
      visiblePay.value = true;
    } else {
      custLoginBySms({
        smsKey: smsKey.value,
        smsCode,
        mobile,
        userName,
      }).then((res) => {
        handleLogin(res);
        router.push(`/order`);
      });
    }
  };

  const handleLogin = (res) => {
    const data = res?.data?.value;
    const { token } = data;
    token && userStore.setToken(token);
    userStore.setInfo({
      mobile: mobile.value,
    });
  };

  const jumpLogin = () => {
    isRegister.value = !isRegister.value;
    idNo.value = '';
    userName.value = '';
    mobile.value = '';
    smsCode.value = '';
  };

  const handleSelectPay = (pay) => {
    selectPay.value = pay.key;
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

  const handleCheckExample = () => {
    window.open('http://rpt.quchaq.com/profile/qucha/open/demo.pdf');
  };

  const handlePay = () => {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0,
    });
    custReport({
      agentNo,
      productCode,
      custName: userName.value,
      idNo: idNo.value,
      mobile: mobile.value,
      smsKey: smsKey.value,
      smsCode: smsCode.value,
      payChannel: selectPay.value,
      orderAmt: amt.value,
      terminal: judgeClient(),
    }).then((res) => {
      handleLogin(res);
      const payData = res?.data?.value;
      if (selectPay.value === 'WECHAT_PAY') {
        showPayQrcode.value = true;
        QRCode.toCanvas(document.querySelector('.qrcode'), payData.payUrl, function (error) {
          if (error) console.error(error);
          console.log('success!');
          visiblePay.value = false;
          closeToast();

          payTimer.value = setInterval(() => {
            custApplyDetail({
              paySerialNo: payData.paySerialNo,
            }).then((result) => {
              if (result.data.value?.applyStatus) {
                router.push('/order');
              }
            });
          }, 3000);
        });
      } else {
        applyForm.value = payData.payUrl;
        nextTick(() => {
          closeToast();
          document.forms[1]?.submit();
        });
      }
    });
  };

  const openProtocol = async (type) => {
    if (userName.value && mobile.value && mobile.value) {
      if (type === 'tripartite') {
        const res = await getAgentInfo({
          agentNo: agentNo,
        });
        const agentInfo = res.data.value;
        agentName.value = agentInfo.agentName;
        agentMobile.value = agentInfo.agentMobile;
      }

      protocolType.value = type;
    } else {
      showToast('请先输入姓名、身份证号、手机号');
    }
  };

  const handlePayCancel = () => {
    idNo.value = '';
    userName.value = '';
    mobile.value = '';
    smsCode.value = '';
    showPayQrcode.value = false;
    payTimer.value && clearInterval(payTimer.value);
  };
</script>

<style scoped lang="scss">
  .register-page {
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
        margin-top: 40px;
      }
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 36px 0 40px 0;

      .left {
        width: 40px;
        height: 40px;
        display: block;
      }
      .tips {
        flex: 1;
        font-size: 24px;
        font-weight: 500;
        color: rgba(128, 128, 128, 1);
        padding-left: 10px;
      }

      .right {
        flex: 1;
        font-size: 24px;
        font-weight: 400;
        color: rgba(2, 121, 254, 1);
        text-align: right;
      }
    }
  }

  .pay-content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 42px 65px;

    .row {
      display: flex;
      align-items: center;
      height: 126px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 1);
      border: 4px solid rgba(255, 255, 255, 1);
      font-size: 28px;
      color: rgba(0, 0, 0, 1);
      margin-bottom: 42px;
      padding: 0 52px;
      box-sizing: border-box;

      &:last-child {
        margin-bottom: 42px;
      }

      &.active {
        border-color: rgba(2, 121, 254, 1);
        box-shadow: 0px 4.05px 8.11px rgba(2, 121, 254, 0.3);
      }

      .icon {
        width: 71px;
        height: 71px;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .label {
        flex: 1;
        text-align: center;
      }
    }
  }

  .qrcode-container {
    .img {
      display: flex;
      width: 400px;
      height: 400px;
      margin: 50px auto 0;
    }
  }
</style>
