<template>
	<s-layout title="快速打条">
		<view style="padding: 20rpx 0;" v-if="!state.loading">
			<view class="area-item" style="background-color: #E6ECFA;" @click="toPage(1)">
				<!-- ICON -->
				<image class="area-item-image" src="/static/chujie.png"></image>
				<!-- 内容 -->
				<view class="area-item-text">
          <view class="area-item-text-title">我是借款方</view>
          <view class="area-item-text-content">每次的借款都是为了解决问题</view>
				</view>
				<image class="area-item-arrow" src="/static/arrow.png"></image>
			</view>
			<view class="area-item" style="background-color: #E6FAF0;" @click="toPage(2)">
				<!-- ICON -->
				<image class="area-item-image" src="/static/jiekuan.png"></image>
				<!-- 内容 -->
				<view class="area-item-text">
          <view class="area-item-text-title">我是出借方</view>
          <view class="area-item-text-content">每次的出借都是帮助需要的人</view>
				</view>
				<image class="area-item-arrow" src="/static/arrow.png"></image>
			</view>
		</view>
	</s-layout>
</template>

<script setup>
	import { reactive } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import sheep from '@/sheep';
  import UserApi from '@/sheep/api/member/user';

	const state = reactive({
    loading: true,
	});

	function toPage(type) {
		sheep.$router.go('/pages/sign/sign?type=' + type);
	}

	function checkAuth() {
    UserApi.getUserInfo().then(res => {
      // 获取用户信息
      let userInfo = res.data;
      console.log(userInfo);
      if(!userInfo.authState){
        // 弹窗跳转实名
        uni.showModal({
          title: '提示',
          showCancel: true,
          content: '请先完成实名认证',
          success: function (res) {
            if (res.confirm) {
              sheep.$router.go('/pages/sign/realname');
            } else {
              sheep.$router.back();
            }
          },
        });
        return
      }
      if(!userInfo.autoSignState){
        // 跳转签约
        uni.showModal({
          title: '提示',
          showCancel: true,
          content: '请先完成签署授权',
          success: function (res) {
            if (res.confirm) {
              sheep.$router.go('/pages/sign/agreement-sign');
            } else {
              sheep.$router.back();
            }
          },
        });
        return
      }
      state.loading = false;
    })
	}

  onShow(async () => {
		checkAuth();
	});
</script>

<style lang="scss" scoped>
	.area-item {
		height: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 20rpx;
		border-radius: 20rpx;
	}

	.area-item-image {
		height: 100rpx;
		width: 100rpx;
	}

	.area-item-text {
		margin-left: 40rpx;
	}

	.area-item-text-title {
		font-size: 34rpx;
	}

	.area-item-text-content {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #999;
	}

	.area-item-arrow {
		margin-left: 100rpx;
		height: 15rpx;
		width: 15rpx;
	}
</style>