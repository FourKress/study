<template>
  <div class="container">
    <div class="input">
      <van-cell-group inset>
        <van-field v-model="fieldValue" size="mini" colon type="digit" center clearable label="切换间隔(秒)" placeholder="请输入切换间隔">
          <template #button>
            <van-button size="mini" type="primary" @click="onConfirm">确定</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group inset>
        <van-radio-group v-model="maxNum" size="mini" direction="horizontal">
          <van-radio name="5">5以内</van-radio>
          <van-radio name="10">10以内</van-radio>
          <van-radio name="15">15以内</van-radio>
          <van-radio name="20">20以内</van-radio>
        </van-radio-group>
      </van-cell-group>
    </div>
    <div class="text"> {{ firstItem }} {{ calcType ? '+' : '-' }} {{ secondItem }} </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const firstItem = ref(0);
  const secondItem = ref(0);
  const calcType = ref(1);
  const step = ref(3000);
  const fieldValue = ref(3);
  const timer = ref(0);
  const maxNum = ref('10');

  const handleCompute = () => {
    // const type = Math.round(Math.random() * 10000) % 2;
    const type = 1;
    calcType.value = type;
    const max = parseInt(maxNum.value);

    if ([15, 20].includes(max)) {
      if (type) {
        firstItem.value = Math.round(Math.random() * (max - 2)) + 1;
        const secondItemValue = secondItem.value = Math.round(Math.random() * (max - firstItem.value - 1)) + 1;
        if (firstItem.value < max - 5) {
          secondItem.value = Math.max(secondItemValue, max-4-firstItem.value);
        } else {
           secondItem.value = Math.round(Math.random() * (max - firstItem.value - 1)) + 1;
        }
      } else {
        firstItem.value = Math.max(Math.round(Math.random() * (max - 2)) + 2, max - 4);
        secondItem.value = Math.round(Math.random() * (firstItem.value - 2)) + 1;
      }
    } else {
      if (type) {
        firstItem.value = Math.round(Math.random() * (max - 2)) + 1;
        secondItem.value = Math.round(Math.random() * (max - firstItem.value - 1)) + 1;
      } else {
        firstItem.value = Math.round(Math.random() * (max - 2)) + 2;
        secondItem.value = Math.round(Math.random() * (firstItem.value - 2)) + 1;
      }
    }
  };

  const onConfirm = () => {
    step.value = (fieldValue.value || 3) * 1000;
    clearInterval(timer.value);
    handleCountDown();
  };

  const handleCountDown = () => {
    handleCompute();
    timer.value = setInterval(() => {
      handleCompute();
    }, step.value);
  };

  handleCountDown();
</script>

<style>
#app {
  width: 100vw;
  height: 100%;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: fixed;
  overflow: hidden;
}

.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .input {
    width: 100%;
    position: absolute;
    left: 0;
    top: 10px;
  }

  .text {
    font-size: 214px;
    text-align: center;
    padding-top: 100px;
  }
}

.van-field {
  padding: 0 !important;

  .van-button {
    width: 120px;
  }
}

@media only screen and (min-width: 1366px) {
  .input {
    top: 0 !important;
  }
  .van-radio__icon,
  .van-field__button {
    transform-origin: center;
    transform: scale(0.5);
  }

  .van-radio__label {
    margin-left: 0 !important;
  }

  .van-radio-group {
    transform: translateY(-10px);
  }
}
</style>
