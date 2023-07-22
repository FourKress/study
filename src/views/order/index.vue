<template>
  <div class="order">
    <div class="item" v-for="item in orderList" :key="item" @click="handleCheckDetails(item)">
      <div class="top">
        <span class="label">{{ item.productName }}</span>
        <span class="status">{{ applyStatusMap[item.applyStatus] }}</span>
        <van-button type="primary" size="mini" v-if="item.applyStatus === 'SUCCESS'">查看详情</van-button>
      </div>
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
      <div class="tips">
        <span class="label">实付</span>
        <span class="amount">¥{{ item.payAmt }}</span>
      </div>
      <div class="footer">
        <div class="btn" v-if="item.applyStatus === 'SUCCESS' && item.share === 'Y'" @click.stop="handleSendAgent(item)">发送代理商</div>
        <div class="btn" v-if="item.applyStatus === 'SUCCESS'" @click.stop="handleDownload(item)">下载</div>

        <div class="btn" v-if="item.applyStatus === 'FAILURE'"> <CustomerService>联系客服</CustomerService></div>
        <div class="btn" v-if="item.applyStatus === 'FAILURE'" @click.stop="handleRetry(item)">重试</div>

        <div class="btn" v-if="item.applyStatus === 'REFUND'" @click.stop="handleSearch">去查询</div>
        <div class="btn" v-if="item.applyStatus === 'APPLY'" @click.stop="handleCheckExample">查看示例</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="OrderPage">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { showConfirmDialog, showLoadingToast, showToast } from 'vant';
  import CustomerService from '/@/components/CustomerService.vue';
  import { custApplyList, custReportDownload, custReportRetry, custReportShare } from '/@/api';

  const router = useRouter();
  const applyStatusMap = {
    APPLY: '生成中',
    SUCCESS: '',
    FAILURE: '生成失败',
    REFUND: '已退款',
  };
  let orderList = ref([]);

  const getList = () => {
    custApplyList().then((res) => {
      console.log(res.data.value);
      orderList.value = res.data.value;
    });
  };

  onMounted(() => {
    getList();
  });

  const handleSendAgent = (order) => {
    showConfirmDialog({
      title: '确认发送',
      message: '确认发送该报告给代理商？代理商仅能在24小时内查看。',
    })
      .then(() => {
        const { paySerialNo } = order;
        custReportShare({
          paySerialNo,
        }).then(() => {
          showToast('已发送');
        });
      })
      .catch(() => {});
  };

  const handleDownload = (order) => {
    const loading = showLoadingToast({
      message: '开始下载...',
      forbidClick: true,
      duration: 0,
    });
    const { paySerialNo } = order;
    custReportDownload({
      paySerialNo,
    })
      .then((res) => {
        const blob = res.response.value;
        const objectUrl = URL.createObjectURL(blob); // 创建URL
        const link = document.createElement('a');
        link.download = 'download';
        link.href = objectUrl;
        link.click(); // 下载文件
        URL.revokeObjectURL(objectUrl); // 释放内存
      })
      .finally(() => {
        loading.close();
      });
  };

  const handleRetry = (order) => {
    const { paySerialNo } = order;
    custReportRetry({
      paySerialNo,
    }).then(() => {
      showToast('重试成功');
      getList();
    });
  };

  const handleCheckExample = () => {
    window.open('http://rpt.quchaq.com/profile/qucha/open/demo.pdf');
  };

  const handleSearch = () => {
    router.push(`/register?productCode=${sessionStorage.getItem('productCode')}`);
  };

  const handleCheckDetails = (order) => {
    if (order.applyStatus === 'SUCCESS') {
      router.push(`/reportDetails?paySerialNo=${order.paySerialNo}`);
    }
  };
</script>

<style scoped lang="scss">
  .order {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 60px 43px;
    background-color: rgba(245, 245, 245, 1);

    .item {
      height: 458px;
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

      .info {
        padding-top: 20px;

        .row {
          font-size: 28px;
          color: rgba(128, 128, 128, 1);
          margin-bottom: 24px;

          .text {
            padding-left: 10px;
          }
        }
      }

      .tips {
        text-align: right;
        font-size: 26px;
        color: rgba(166, 166, 166, 1);
        margin-bottom: 22px;
        border-bottom: 2px solid rgba(229, 229, 229, 1);
        padding-bottom: 16px;

        .amount {
          font-size: 26px;
          color: rgba(0, 0, 0, 1);
          padding-left: 29px;
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

  .img {
    display: flex;
    width: 300px;
    height: 300px;
    margin: 50px auto 0;
  }
</style>
