<template>
<!--  <s-layout title="借条详情">-->
    <view>
      <scroll-view scroll-y="true">
        <view class="form-item-header">
          <view class="form-item-header-left">
            <view class="form-item-header-left-top">￥{{ fen2yuan(state.iouInfo.amount) }}</view>
            <view class="form-item-header-left-bottom">{{ state.iouInfo.uppercaseAmount }}元</view>
          </view>
          <view class="form-item-header-right">
            <view style="color: #FA9E0F;font-weight: bold;" v-if="state.iouInfo.iouState === 1">待确认</view>
            <view v-if="state.iouInfo.iouState === 2"
                  style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
              <view style="color: #4BA4E3;font-weight: bold;">还款中，剩余{{ state.iouInfo.remainRepaymentDays }}天</view>
              <!--            <view style="color: #4BA4E3;font-weight: bold;"></view>-->
            </view>
            <view style="color: #00C843;font-weight: bold;" v-if="state.iouInfo.iouState === 3">已还清</view>
            <view style="color: #00C843;font-weight: bold;" v-if="state.iouInfo.iouState === 4">已销账</view>
            <view style="color: #BBBBBB;font-weight: bold;" v-if="state.iouInfo.iouState === 11">已拒绝</view>
            <view style="color: #FF3232;font-weight: bold;" v-if="state.iouInfo.iouState === 22">已逾期</view>
            <view style="color: #FF3232;font-weight: bold;" v-if="state.iouInfo.iouState === 33">已延期</view>
          </view>
        </view>
        <view class="form-people-item-top">
          <uni-tag text="借款人" class="form-people-label" type="error"></uni-tag>
          <view class="form-people-view">
            <view>
              {{ state.iouInfo.lenderName }}
            </view>
            <view class="form-people-idcard">
              {{ state.iouInfo.lenderIdCard }}
            </view>
          </view>
        </view>
        <view class="form-people-item-bottom">
          <uni-tag text="出借人" class="form-people-label" type="primary"></uni-tag>
          <view class="form-people-view">
            <view>
              {{ state.iouInfo.borrowerName }}
            </view>
            <view class="form-people-idcard">
              {{ state.iouInfo.borrowerIdCard }}
            </view>
          </view>
        </view>
        <view class="form-item form-item-first">
          <view class="form-item-title">借款金额</view>
          <view class="form-item-right">
            <view class="uni-input">{{ fen2yuan(state.iouInfo.amount) }}</view>
            <view class="form-item-right-unit">元</view>
          </view>
        </view>
        <view class="form-item">
          <view class="form-item-title">借款金额（大写）</view>
          <view class="form-item-right">
            <view class="uni-input">{{ state.iouInfo.uppercaseAmount }}元</view>
          </view>
        </view>
        <view class="form-item">
          <view class="form-item-title">借款事由</view>
          <view class="form-item-right">
            <view>{{ state.iouInfo.reasons }}</view>
          </view>
        </view>
        <view class="form-item">
          <view class="form-item-title">借款日期</view>
          <view class="form-item-right">
            <view>{{ state.iouInfo.loanDate }}</view>
          </view>
        </view>
        <view class="form-item form-item-end">
          <view class="form-item-title">还款日期</view>
          <view class="form-item-right">
            <view>{{ state.iouInfo.repaymentDate }}</view>
          </view>
        </view>

        <view class="form-item form-item-first">
          <view class="form-item-title">年化利率</view>
          <view class="form-item-right">
            <view>{{ state.iouInfo.interestRate }}</view>
          </view>
        </view>
        <view class="form-item form-item-end">
          <view class="form-item-title">还款方式</view>
          <view class="form-item-right">
            <view>{{ state.iouInfo.repaymentWay }}</view>
          </view>
        </view>
        <view class="form-item form-item-single">
          <view class="form-item-title">支付方式</view>
          <view class="form-item-right">
            <view>{{ state.iouInfo.payWay }}</view>
          </view>
        </view>

        <view class="form-item-remark form-item-single" style="height: 200rpx;">
          <view style="font-size: 26rpx;margin: 20rpx;padding-top: 20rpx;">{{ state.iouInfo.remark ? state.iouInfo.remark : '暂无备注' }}</view>
        </view>

        <view class="form-item-button">
          <button @click="handleBack"
                  class="form-item-button-next" style="color:#666666;backgroundColor:#FFFFFF;borderColor:rgba(102, 102, 102, 30)">返回</button>
          <button v-if="state.iouInfo.iouState !== 1 && state.iouInfo.iouState !== 11 " @click="openAgreement"
                  class="form-item-button-next" style="color:#FFFFFF;backgroundColor:#3277FF;borderColor:#3277FF">查看协议</button>
          <button v-if="state.iouInfo.iouState === 1 && userInfo.id !== state.iouInfo.initiatorId" @click="refuseSign"
                  class="form-item-button-next" style="color:#FF3232;backgroundColor:rgba(255, 50, 50, 0.3);borderColor:rgba(255, 50, 50, 0.3)">拒绝签署</button>
          <button v-if="state.iouInfo.iouState === 1 && userInfo.id !== state.iouInfo.initiatorId" @click="signIou"
                  class="form-item-button-next" style="color:#FFFFFF;backgroundColor:#3277FF;borderColor:#3277FF">确认签署</button>
          <button v-if="(state.iouInfo.iouState === 2 || state.iouInfo.iouState === 22 || state.iouInfo.iouState === 33) && userInfo.id === state.iouInfo.lenderId" @click="immediateIou"
                  class="form-item-button-next" style="color:#FFFFFF;backgroundColor:#3277FF;borderColor:#3277FF">立即还款</button>
          <button v-if="state.iouInfo.iouState === 22 && userInfo.id !== state.iouInfo.lenderId" @click="delayIou"
                  class="form-item-button-next" style="color:#FFFFFF;backgroundColor:#FF7C1F;borderColor:#FF7C1F">延期</button>
          <button v-if="state.iouInfo.iouState === 3 && userInfo.id === state.iouInfo.borrowerId" @click="writeOffs"
                  class="form-item-button-next" style="color:#FFFFFF;backgroundColor:#4caf50;borderColor:#4caf50">销账</button>
          <button v-if="state.iouInfo.iouState === 4 && userInfo.id === state.iouInfo.borrowerId" @click="deleteIou"
                  class="form-item-button-next" style="color:#FF3232;backgroundColor:rgba(255, 50, 50, 0.3);borderColor:rgba(255, 50, 50, 0.3)">删除借条</button>
        </view>
      </scroll-view>
      <uni-popup ref="payPasswordInput" type="center" background-color="#fff" :animation="false">
        <view class="pay-password-area">
          <view style="margin-bottom: 20rpx;">请输入支付密码</view>
          <yi-code hide="*" @onComplete="payPasswordComplete"></yi-code>
        </view>
      </uni-popup>
      <!--  选择时间弹窗  -->
      <uni-popup ref="selectDelayTime" type="dialog">
        <uni-popup-dialog title="请选择延期时间" @confirm="confirmDelayIou">
          <template #default>
            <!--          <view>选择日期</view>-->
            <uni-datetime-picker type="date" :start="state.currentDate" :clear-icon="true" v-model="state.delayDate"/>
          </template>
        </uni-popup-dialog>
      </uni-popup>
    </view>
<!--  </s-layout>-->
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import IouApi from '@/sheep/api/member/iou';
  import { fen2yuan } from '@/sheep/hooks/useGoods';
  import sheep from '@/sheep';
  import UserApi from '@/sheep/api/member/user';
  import dayjs from 'dayjs';
  const userInfo = computed(() => sheep.$store('user').userInfo);
  const selectDelayTime = ref(null);
  const payPasswordInput = ref(null);
  const state = reactive({
    // 借条详情
    iouInfo: {},
    // 表单信息
    formInfo: {},
    // 搜索名称
    searchName: null,
    // 年化利率（0-36）
    interestRates: [],
    // 借款事由：周转、个体经营、消费、创业、租房、旅游、装修、医疗、其它
    signReasons: [
      { value: 1, text: '周转' },
      { value: 2, text: '个体经营' },
      { value: 3, text: '消费' },
      { value: 4, text: '创业' },
      { value: 5, text: '租房' },
      { value: 6, text: '旅游' },
      { value: 7, text: '装修' },
      { value: 8, text: '医疗' },
      { value: 100, text: '其它' },
    ],
    // 还款方式
    repaymentWays: [
      { value: 1, text: '一次性还本付息' },
    ],
    // 支付方式：网银、支付宝、微信、现金
    payWays: [
      { value: 1, text: '网银' },
      { value: 2, text: '支付宝' },
      { value: 3, text: '微信' },
      { value: 4, text: '现金' },
    ],
    // 当前日期
    currentDate: dayjs().format('YYYY-MM-DD'),
    // 延期日期
    delayDate: null,
    // 用户列表
    userNameList: [],
    userList: [],
  });

  function handleBack(){
    sheep.$router.back();
  }

  function openAgreement() {
    sheep.$router.go('/pages/sign/agreement-list', {isShow: false, iouId: state.iouInfo.id})
  }

  function refuseSign(){
    uni.showModal({
      title: '提示',
      content: '确定拒绝签署该借条吗？',
      success: function (res) {
        if (res.confirm) {
          IouApi.updateIouStatus({
            id: state.iouInfo.id,
            iouState: 11,
          }).then(res => {
            if(res.code === 0) {
              // 刷新当前页面
              loadIouInfo(state.iouInfo.id);
            }
          });
        }
      }
    });

  }

  // 销账
  function writeOffs(){
    uni.showModal({
      title: '提示',
      content: '确定销账该借条吗？',
      success: function (res) {
        if (res.confirm) {
          IouApi.updateIouStatus({
            id: state.iouInfo.id,
            iouState: 4,
          }).then(res => {
            if(res.code === 0) {
              // 刷新当前页面
              loadIouInfo(state.iouInfo.id);
            }
          });
        }
      }
    })
  }

  function maskClick(e) {
    console.log("maskClick", e);
  }

  function signIou() {
    uni.showModal({
      title: '提示',
      content: '确定签署该借条吗？',
      success: function (res) {
        if (res.confirm) {
          // 如果当前人不是发起方且当前人为出借人，需要前往支付
          if(userInfo.value.id !== state.iouInfo.initiatorId && userInfo.value.id === state.iouInfo.borrowerId) {
            // 需要输入支付密码
            payPasswordInput.value.open()
          } else {
            // 直接签署
            IouApi.updateIouStatus({
              id: state.iouInfo.id,
              iouState: 2,
            }).then(res => {
              if(res.code === 0) {
                // 提示
                sheep.$helper.toast('签署成功')
                // 刷新当前页面
                loadIouInfo(state.iouInfo.id);
              }
            })
          }
       }
     }
    })
  }

  function payPasswordComplete(e) {
    if (!e) {
      sheep.$helper.toast('请输入支付密码')
      return
    }
    // 校验支付密码
    UserApi.checkPayPassword({
      payPassword: e
    }).then((res) => {
      if(res.data) {
        state.formInfo.needPay = true;
        IouApi.payIou({id: state.iouInfo.id}).then((res) => {
          if(res.code === 0){
            // 跳转到支付页面
            sheep.$router.redirect('/pages/pay/index', {
              id: res.data,
              orderType: 'sign'
            });
          } else {
            sheep.$helper.toast(res.message)
          }
        })
      } else {
        sheep.$helper.toast('支付密码错误，请重试')
      }
    })
  }


  function deleteIou() {
    uni.showModal({
      title: '提示',
      content: '确定删除该借条吗？',
      success: function (res) {
        if (res.confirm) {
          IouApi.deleteIou(state.iouInfo.id).then(res => {
            if(res.code === 0) {
              // 跳转到iou
              sheep.$router.go("/pages/index/iou");
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  }

  function delayIou() {
    // 打开页面
    selectDelayTime.value.open()
  }

  function closeDelayTime() {
    selectDelayTime.value.close()
  }

  function confirmDelayIou() {
    if(!state.delayDate) {
      sheep.$helper.toast('请选择延期日期')
      return
    }
    uni.showModal({
      title: '提示',
      content: '确定延期该借条吗？',
      success: function (res) {
        if (res.confirm) {
          IouApi.updateIouStatus({
            id: state.iouInfo.id,
            iouState: 33,
            delayDate: state.delayDate,
          }).then(res => {
            if(res.code === 0) {
              // 刷新当前页面
              loadIouInfo(state.iouInfo.id);
            }
          }).finally((res) => {
            selectDelayTime.value.close()
          });
        }
      }
    })
  }

  function immediateIou() {
    uni.showModal({
      title: '提示',
      content: '确定立即还款吗，还款后需要联系出借人进行销账操作？',
      success: function (res) {
        if (res.confirm) {
          IouApi.updateIouStatus({
            id: state.iouInfo.id,
            iouState: 3,
          }).then(res => {
            if(res.code === 0) {
              sheep.$helper.toast('还款成功')
              // 刷新当前页面
              loadIouInfo(state.iouInfo.id);
            }
          });
        }
      }
    })
  }

  function loadIouInfo(iouId){
    // 获取本人信息
    IouApi.getIouInfo({ id: iouId }).then(res => {
      state.iouInfo = res.data;
      state.iouInfo.reasons = state.signReasons.find(item => item.value === res.data.reasons).text;
      state.iouInfo.repaymentWay = state.repaymentWays.find(item => item.value === res.data.repaymentWay).text;
      state.iouInfo.payWay = state.payWays.find(item => item.value === res.data.payWay).text;
      state.iouInfo.interestRate = res.data.interestRate + '%';
    });
  }

  onLoad(async (options) => {
    console.log('1', userInfo.value.id);
    loadIouInfo(options.id);
  });

</script>

<style lang="scss" scoped>

  .form-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #FFF;
    padding: 20rpx 20rpx 20rpx 20rpx;
    margin: 10rpx 20rpx 20rpx 20rpx;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
  }

  .form-item-header-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .form-item-header-left-top {
    font-size: 34rpx;
    color: #3D3D3D;
  }

  .form-item-header-left-bottom {
    font-size: 20rpx;
    color: #D8D8D8;
  }


  .form-item-header-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .form-people-item-top {
    display: flex;
    align-items: center;
    background-color: #FFF;
    justify-content: flex-start;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    margin: 10rpx 20rpx 0 20rpx;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
  }

  .form-people-item-bottom {
    display: flex;
    align-items: center;
    background-color: #FFF;
    justify-content: flex-start;
    margin: 0 20rpx 10rpx 20rpx;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
  }

  .form-people-idcard {
    color: #D8D8D8;
    font-size: 26rpx;
    margin-left: 20rpx;
  }

  .form-people-view {
    display: flex;
    font-size: 26rpx;
    align-items: center;
    margin-left: 20rpx;
  }

  .form-people-choose-view {
    color: #D8D8D8;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    margin-left: 20rpx;
  }


  .form-people-label {
    width: 60rpx;
    height: 28rpx;
    font-size: 20rpx;
    margin-left: 20rpx;
  }

  .form-item {
    display: flex;
    height: 60rpx;
    padding: 15rpx;
    align-items: center;
    background-color: #FFF;
    margin: 0 20rpx 0 20rpx;
    justify-content: space-between;
    border-bottom: 1rpx solid #EBEBEB;
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

  .form-item-single {
    margin: 20rpx;
    border-radius: 20rpx;
  }

  .form-item-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    input {
      width: 350rpx;
      font-size: 26rpx;
      text-align: right;
      font-weight: unset;
    }
  }

  .form-item-right-unit {
    margin-left: 10rpx;
    font-size: 26rpx;
    font-weight: bold;
  }

  .form-item-title {
    font-size: 26rpx;
    color: #999999;
    font-weight: bold;
  }

  .form-item-right-select {
    width: 360rpx;
    font-size: 26rpx;
    font-weight: unset;
    border: none;
    background-color: #FFF;
  }

  .form-item-right-icon {
    margin-left: 10rpx;
  }

  .form-item-remark {
    background-color: #FFF;
    margin: 0 20rpx 20rpx 20rpx;
    border-radius: 20rpx;
  }

  .form-item-radio {
    margin: 0 20rpx 20rpx 20rpx;
    font-size: 26rpx;
    color: #999999;
  }

  .form-item-radio-text {
    font-size: 26rpx;
    font-weight: bold;
    color: #3277FF;
  }

  .form-item-button {
    margin-top: 30rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 50rpx;
  }

  .form-item-button-next {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    margin: 30rpx;
    font-size: 30rpx;
    border-radius: 40rpx;
  }

  .form-container {
    background-color: #F5F5F5;
    overflow-y: scroll;
  }

  .pay-password-area {
    background-color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200rpx;
    width: 1024px;
    flex-direction: column;
    border-radius: 20rpx;
  }
</style>