<template>
  <s-layout title ="问题反馈">
    <view class="form-item-remark">
      <uni-easyinput type="textarea" autoHeight v-model="state.remark" placeholder="请在这里写下你的意见和建议...."></uni-easyinput>
    </view>
    <view class="submit-btn">
      <button type="default" plain size="small" @click="back">返回</button>
      <button v-if="!state.autoSignState" type="primary" size="small" @click="submit(true)" :maxlength="200">反馈</button>
    </view>
  </s-layout>
</template>
<script setup>
  import { reactive } from 'vue';
  import sheep from '@/sheep';

  const state = reactive({
    remark: ''
  });

  function back() {
    // 返回
    sheep.$router.back();
  }

  function submit(){
    // 判空
    if(!state.remark){
      sheep.$helper.toast('请填写反馈内容')
      return;
    }
    sheep.$helper.toast('提交成功')
    sheep.$router.back();
  }
</script>
<style scoped lang="scss">
  .form-item-remark {
    background-color: #FFF;
    margin: 20rpx 20rpx 20rpx 20rpx;
    border-radius: 20rpx;
  }
  .submit-btn {
    width: 100%;
    margin-top: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      margin: 20rpx;
      width: 200rpx;
      height: 70rpx;
      font-size: 26rpx;
      border-radius: 40rpx;
    }
  }
</style>