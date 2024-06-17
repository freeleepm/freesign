<template>
<!--  <s-layout title="搜索用户">-->
    <view style="background-color: #fff;width: 100%;height: 100%;">
      <view class="search-btn">
        <uni-easyinput class="search-input" suffixIcon="search" placeholder="请输入完整的出借人姓名" @input="searchUser"></uni-easyinput>
      </view>
      <view class="view-card" v-for="(item) in state.userList">
        <uni-card :title="item.name" :isFull="true" :sub-title="item.idCard" :thumbnail="item.avatar" @click="chooseUser(item)"></uni-card>
      </view>
    </view>
<!--  </s-layout>-->
</template>


<script setup>
  import { reactive } from 'vue';
  import UserApi from '@/sheep/api/member/user';

  const state = reactive({
    searchValue: '',
    userList: []
  });

  function chooseUser(item) {
    // 返回刚才的页面并通过uni.$emit触发事件
    uni.$emit('chooseUser', item);
    uni.navigateBack();
  }

  function searchUser(e) {
    console.log(e);
    if (!e) {
      state.userList =[]
      return
    }
    UserApi.searchUser({
      name: e
    }).then(res => {
      state.userList = res.data;
    })
  }
</script>

<style>
  .view-card {
    margin: 30rpx;
    border: 30rpx;
  }

  view {
    font-size: 26rpx;
  }

  .search-btn {
    background-color: #FFF;
    margin: 20rpx;
  }
</style>