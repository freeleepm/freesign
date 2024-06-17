<template>
<!--  <s-layout title="支付密码设置">-->
    <form @submit="formSubmit">
      <view class="form-item" style="margin-top: 20rpx;">
        <text>验证码</text>
        <uni-easyinput
          class="get-code-input"
          placeholder="请输入验证码"
          v-model="state.formInfo.code"
          :inputBorder="false"
          type="number"
          maxlength="4"
        >
          <template v-slot:right>
            <button type="primary" size="mini" @tap="getCode" class="get-code-btn">
              {{state.btnContent === -1 ? '获取验证码' : state.btnContent}}
            </button>
          </template>
        </uni-easyinput>
<!--        <uni-easyinput-->
<!--          placeholder="请输入验证码"-->
<!--          v-model="state.formInfo.code"-->
<!--          :inputBorder="false"-->
<!--          type="number"-->
<!--        >-->
<!--          <template v-slot:right>-->
<!--            <button-->
<!--              class="ss-reset-button code-btn code-btn-start"-->
<!--              :class="{ 'code-btn-end': state.isMobileEnd }"-->
<!--              @tap="getSmsCode('smsResetPayPwd', state.model.mobile)"-->
<!--            >-->
<!--              {{ getSmsTimer('smsResetPayPwd') }}-->
<!--            </button>-->
<!--          </template>-->
<!--        </uni-easyinput>-->
      </view>
      <view class="form-item">
        <text>支付密码</text>
        <input type="number" password v-model="state.formInfo.payPassword" placeholder="请输入支付密码" />
      </view>
      <view class="form-item form-item-end">
        <text>确认密码</text>
        <input type="number" password v-model="state.formInfo.confirmPayPassword" placeholder="请输入确认密码" />
      </view>
      <view class="submit-btn">
        <button type="default" plain size="small" @click="back">返回</button>
        <button type="primary" size="small" @click="formSubmit">提交</button>
      </view>
    </form>
<!--  </s-layout>-->
</template>

<script setup>
  import { reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import UserApi from '@/sheep/api/member/user';
  import AuthUtil from '@/sheep/api/member/auth';
  import { showAuthModal } from '@/sheep/hooks/useModal';

  const state = reactive({
    // 显示内容
    btnContent: -1,
    formInfo: {
      // 手机号
      mobile: sheep.$store('user').userInfo.mobile,
      // 验证码
      code: null,
      // 支付密码
      payPassword: null,
      // 确认支付密码
      confirmPayPassword: null,
    },
  });

  function back() {
    // 返回
    sheep.$router.back();
  }

  function getCode(){
    if(checkPhone()){
      AuthUtil.sendSmsCode(state.formInfo.mobile, 5).then((res) => {
        if (res.code === 0) {
          sheep.$helper.toast('验证码已发送');
          // 设置为60秒倒计时
          state.btnContent = 60
          // 每秒减少1
          setInterval(id => {
            state.btnContent--
            if (state.btnContent <= 0) {
              state.btnContent = -1
              clearInterval(id)
            }
          }, 1000)
        }
      });
    }
  }

  function formSubmit() {
    if (!state.formInfo.code){
      sheep.$helper.toast('请输入验证码');
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
    UserApi.updatePayPassword(state.formInfo).then((res) => {
      if (res.code !== 0) {
        sheep.$helper.toast(res.msg);
        return;
      }
      sheep.$helper.toast('设置成功');
      sheep.$router.back();
    });
  }

  function checkPhone(){
    if(!sheep.$store('user').userInfo.mobile){
      // 提示绑定手机号
      sheep.$helper.toast('请先绑定手机号');
      showAuthModal('changeMobile');
      return false
    }
    return true
  }


  onLoad(async (options) => {
    checkPhone()
  })

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

  .get-code-btn {
    margin-left: 20rpx;
    width: 170rpx;
    font-size: 22rpx;
    height: 50rpx;
    display: flex;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    justify-content: center;
    align-items: center;
  }

  .get-code-input {
    text-align: right;
  }
</style>