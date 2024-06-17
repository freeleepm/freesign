<template>
<!--	<s-layout title="实名认证">-->
		<form @submit="formSubmit">
			<view class="form-item form-item-first">
				<text>姓名</text>
				<input type="text" v-model="state.formInfo.name" placeholder="请输入姓名" />
			</view>
			<view class="form-item">
				<text>身份证号</text>
				<input type="idcard" v-model="state.formInfo.idCard" placeholder="请输入身份证号" />
			</view>
			<view class="form-item">
				<text>支付密码</text>
				<input type="text" password  v-model="state.formInfo.payPassword" placeholder="请输入支付密码" />
			</view>
			<view class="form-item form-item-end">
				<text>确认密码</text>
				<input type="text" password  v-model="state.formInfo.confirmPayPassword" placeholder="确认密码" />
			</view>
      <view class="submit-btn">
        <button type="default" plain size="small" @click="back">返回</button>
        <button type="primary" size="small" @click="formSubmit">提交认证</button>
      </view>
		</form>
<!--	</s-layout>-->
</template>

<script setup>
	import { reactive } from 'vue';
	import sheep from '@/sheep';
	import UserApi from '@/sheep/api/member/user';

	const state = reactive({
    formInfo: {
      name: null,
      idCard: null,
      // 支付密码
      payPassword: null,
      // 确认支付密码
      confirmPayPassword: null
    },
	});

  function back() {
    // 返回
    sheep.$router.back();
  }

	function formSubmit() {
    // 姓名和身份证号校验
    if (state.formInfo.name === null || state.formInfo.idCard === null) {
      sheep.$helper.toast('请输入姓名和身份证号');
      return;
    }
    // 密码和确认密码一致性校验
    if (state.formInfo.payPassword === null || state.formInfo.confirmPayPassword === null) {
      sheep.$helper.toast('请输入支付密码和确认支付密码');
      return;
    }
    // 六位数字
    if (state.formInfo.payPassword.length !== 6) {
      sheep.$helper.toast('请输入6位数字支付密码');
      return;
    }
    if (state.formInfo.payPassword !== state.formInfo.confirmPayPassword) {
      sheep.$helper.toast('支付密码和确认密码不一致');
      return;
    }
    // UserApi.realname(state.formInfo).then((res) => {
    //   if(res.data.authState){
    //     sheep.$helper.toast('实名认证成功');
    //     sheep.$router.back();
    //   } else {
    //     sheep.$helper.toast('实名认证失败， ' + res.data.failReason + '，请重新提交认证');
    //   }
    // })
    sheep.$router.go('/pages/sign/face-recognition',{
      name: state.formInfo.name,
      idCard: state.formInfo.idCard,
      payPassword: state.formInfo.payPassword
    })
	}
</script>

<style lang="scss" scoped>

  .form-people-label-text {
    text-align: center;
    width: 100rpx;
    height: 20rpx;
    font-size: 18rpx;
    font-weight: bold;
  }

	.form-item {
		display: flex;
		align-items: center;
		background-color: #FFF;
		margin: 0 20rpx 0 20rpx;
		height: 50rpx;
		justify-content: space-between;
		padding: 15rpx;
		border-bottom: 1rpx solid #EBEBEB;

    text {
      font-size: 26rpx;
      color: #999999;
      font-weight: bold;
    }
    input {
      font-size: 26rpx;
      color: #333333;
      font-weight: unset;
      text-align: right;
    }
	}

	.form-item-first {
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		margin: 20rpx 20rpx 0 20rpx;
	}

	.form-item-end {
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		margin: 0 20rpx 20rpx 20rpx;
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