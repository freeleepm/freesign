<template>
<!--  <s-layout title="信用中心">-->
    <view style="background-color: #fff;width: 100%;height: 100%;">
      <view class="content-area">
        <image style="width: 300rpx;height: 300rpx;" src="/static/search.png" />
        <view class="content-area-easyinput">
          <uni-easyinput prefixIcon="search" v-model="state.searchName" placeholder="输入完整身份证号进行搜索" @confirm="searchUser"></uni-easyinput>
        </view>
      </view>
    </view>
<!--  </s-layout>-->
</template>

<script setup>
  import { reactive } from 'vue';
  import sheep from '@/sheep';
  import UserApi from '@/sheep/api/member/user';

  const state = reactive({
    searchName: null,
  });

  function searchUser(e){
    // 携带参数跳转
    sheep.$router.go('/pages/sign/credit-result', {
      idCard: e
    });
  }
</script>

<style>
  .content-area {
    margin-top: 100rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    image {
      width: 260rpx;
      height: 260rpx;
    }
  }

  .content-area-easyinput {
    width: 600rpx;
    margin-top: 40rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
  }
</style>
