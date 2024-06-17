<template>
  <!--  <s-layout title="支付密码设置">-->
  <view>
    <view v-for="(item, index) in state.agreementList">
      <view class="form-item" @click="toSign(item.url)">
        <view class="form-item-title">{{ item.name }}</view>
        <view class="form-item-right">
          <uni-icons class="form-item-right-icon" type="forward" size="12" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
  <!--  </s-layout>-->
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { reactive } from 'vue';
  import sheep from '@/sheep';

  const state = reactive({
    isShow: true,
    iouId: null,
    agreementList: [
      { name: '借款协议', url: '/pages/sign/agreement-jkxy' },
      { name: '借款人自动授权签名确认书', url: '/pages/sign/agreement-jkr' },
      { name: '出借人自动授权签名确认书', url: '/pages/sign/agreement-cjr' },
    ],
  });

  function toSign(url) {
    sheep.$router.go(url, { isShow: state.isShow, iouId: state.iouId });
  }

  onLoad(async (options) => {
    state.isShow = options.isShow;
    state.iouId = options.iouId;
  })


</script>

<style scoped lang="scss">
  .form-item {
    padding: 20rpx;
    background-color: #FFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-item-title {
    flex: 20;
    font-size: 26rpx;
  }

  .form-item-right {
    flex: 1;
  }

</style>