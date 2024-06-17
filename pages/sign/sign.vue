<template>
<!--	<s-layout title="快速打条">-->
    <scroll-view scroll-y="true">
			<form @submit="nextStep">
        <view class="form-people-item-top">
          <uni-tag text="借款人" class="form-people-label" type="error"></uni-tag>
          <view v-if="state.formInfo.iouType === 2 && !state.formInfo.lenderId" class="form-people-choose-view" @click="openPopup">
            点击选择借款人
          </view>
          <view v-else class="form-people-view">
            <view>
              {{state.formInfo.lenderName}}
            </view>
            <view class="form-people-idcard">
              {{state.formInfo.lenderIdCard}}
            </view>
          </view>
        </view>
        <view class="form-people-item-bottom">
          <uni-tag text="出借人" class="form-people-label" type="primary"></uni-tag>
          <view v-if="state.formInfo.iouType === 1 && !state.formInfo.borrowerId" class="form-people-choose-view" @click="openPopup">
            点击选择出借人
          </view>
          <view v-else class="form-people-view">
            <view>
              {{state.formInfo.borrowerName}}
            </view>
            <view class="form-people-idcard">
              {{state.formInfo.borrowerIdCard}}
            </view>
          </view>
        </view>
				<view class="form-item form-item-first">
					<view class="form-item-title">借款金额</view>
					<view class="form-item-right">
						<input class="uni-input" type="number" placeholder="请输入金额（整数）" v-model="state.formInfo.amount"
							@blur="amountChange" />
						<view class="form-item-right-unit">元</view>
					</view>
				</view>
				<view class="form-item">
					<view class="form-item-title">借款金额（大写）</view>
					<view class="form-item-right">
						<input class="uni-input" type="text" disabled placeholder="自动显示"
							v-model="state.formInfo.uppercaseAmount" />
						<view class="form-item-right-unit">元</view>
					</view>
				</view>
				<view class="form-item">
					<view class="form-item-title">借款事由</view>
					<view class="form-item-right">
						<uni-data-select class="form-item-right-select" v-model="state.formInfo.reasons" :clear="false"
							:localdata="state.signReasons"></uni-data-select>
						<!--              <uni-data-picker class="form-item-right-select" placeholder="请选择借款事由" :localdata="state.signReasons" popup-title="请选择借款事由" v-model:value="state.formInfo.reasons"></uni-data-picker>-->
					</view>
				</view>
				<view class="form-item">
					<view class="form-item-title">借款日期</view>
					<view class="form-item-right">
						<uni-datetime-picker type="date"
							v-model="state.formInfo.loanDate">{{state.formInfo.loanDate}}</uni-datetime-picker>
						<uni-icons class="form-item-right-icon" type="forward" size="12" color="#999"></uni-icons>
					</view>
				</view>
				<view class="form-item form-item-end">
					<view class="form-item-title">还款日期</view>
					<view class="form-item-right">
						<uni-datetime-picker type="date" :start="minDate"
							v-model="state.formInfo.repaymentDate">{{state.formInfo.repaymentDate}}</uni-datetime-picker>
						<uni-icons class="form-item-right-icon" type="forward" size="12" color="#999"></uni-icons>
					</view>
				</view>

				<view class="form-item form-item-first">
					<view class="form-item-title">年化利率</view>
					<view class="form-item-right">
						<uni-data-select class="form-item-right-select" v-model="state.formInfo.interestRate"
							:clear="false" :localdata="state.interestRates"></uni-data-select>
						<!--              <uni-data-picker class="form-item-right-select" placeholder="请选择年化利率" :localdata="state.interestRates" popup-title="请选择年化利率" v-model:value="state.formInfo.interestRate"></uni-data-picker>-->
					</view>
				</view>
				<view class="form-item form-item-end">
					<view class="form-item-title">还款方式</view>
					<view class="form-item-right">
						<uni-data-select class="form-item-right-select" v-model="state.formInfo.repaymentWay"
							:clear="false" :localdata="state.repaymentWays"></uni-data-select>
						<!--              <uni-data-picker class="form-item-right-select" placeholder="请选择还款方式" :localdata="state.repaymentWays" popup-title="请选择还款方式" v-model:value="state.formInfo.repaymentWay"></uni-data-picker>-->
					</view>
				</view>
				<view class="form-item form-item-single">
					<view class="form-item-title">支付方式</view>
					<view class="form-item-right">
						<uni-data-checkbox mode="tag" v-model="state.formInfo.payWay" :localdata="state.payWays"></uni-data-checkbox>
					</view>
				</view>

				<view class="form-item-remark">
					<uni-easyinput type="textarea" autoHeight v-model="state.formInfo.remark"
						placeholder="备注"></uni-easyinput>
				</view>

				<view class="form-item-radio">
					<label class="radio">
            <radio-group @change="readAgreementChange">
              <radio value="true" />已阅读并同意
              <text class="form-item-radio-text" @click="openAgreement">《借款协议》</text>
            </radio-group>
					</label>
				</view>

				<view class="form-item-button">
					<button class="form-item-button-next" type="primary" form-type="submit">下一步</button>
				</view>
			</form>
      <uni-popup ref="payPasswordInput" type="center" background-color="#fff" :animation="false">
        <view class="pay-password-area">
          <view style="margin-bottom: 20rpx;">请输入支付密码</view>
          <yi-code hide="*" @onComplete="payPasswordComplete"></yi-code>
        </view>
      </uni-popup>
    </scroll-view>
<!--	</s-layout>-->
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
  import UserApi from '@/sheep/api/member/user';
  import IouApi from '@/sheep/api/member/iou';
	import dayjs from 'dayjs';
  import sheep from '@/sheep';
  const minDate = dayjs().format('YYYY-MM-DD');
	const state = reactive({
		// 表单信息
		formInfo: {
      // 发起类型(1:出借人发起;2:借款人发起;)
      iouType: null,
			// 出借人
			lenderId: null,
			lenderName: null,
      lenderIdCard: null,
			// 借款人
			borrowerId: null,
			borrowerName: null,
      borrowerIdCard: null,
      // 借款金额
      amount: null,
      // 借款金额（大写）
      uppercaseAmount: null,
			// 借款事由
			reasons: 1,
			// 借款日期
			loanDate: dayjs().format('YYYY-MM-DD'),
			// 还款日期（默认加一个月）
			repaymentDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
			// 年化利率
			interestRate: 0,
			// 还款方式
			repaymentWay: 1,
			// 支付方式
			payWay: 1,
			// 备注
			remark: null,
			// 已阅读并同意
			readAgreement: false,
		},
    // 搜索名称
    searchName: null,
    // 借款事由：周转、个体经营、消费、创业、租房、旅游、装修、医疗、其它
		signReasons: [{
				value: 1,
				text: "周转"
			},
			{
				value: 2,
				text: "个体经营"
			},
			{
				value: 3,
				text: "消费"
			},
			{
				value: 4,
				text: "创业"
			},
			{
				value: 5,
				text: "租房"
			},
			{
				value: 6,
				text: "旅游"
			},
			{
				value: 7,
				text: "装修"
			},
			{
				value: 8,
				text: "医疗"
			},
			{
				value: 100,
				text: "其它"
			},
		],
		// 年化利率（0-36）
		interestRates: [],
		// 还款方式
		repaymentWays: [{
			value: 1,
			text: "一次性还本付息"
		}],
		// 支付方式：网银、支付宝、微信、现金
		payWays: [{
				value: 1,
				text: "网银"
			},
			{
				value: 2,
				text: "支付宝"
			},
			{
				value: 3,
				text: "微信"
			},
			{
				value: 4,
				text: "现金",
			}
		],
		// 用户列表
		userNameList: [],
		userList: [],
	});

  const payPasswordInput = ref(null);

	function amountChange(e) {
		console.log('amountChange', e.detail.value);
		// 转为大写数字
		state.formInfo.uppercaseAmount = toUpperCase(e.detail.value)
	}

  function openPopup(){
    // 跳转到选择页面
    sheep.$router.go( '/pages/sign/choose-user')
    // 监听chooseUser事件
    uni.$on('chooseUser', (data) => {
      if (state.formInfo.iouType === 2){
        state.formInfo.lenderId = data.id;
        state.formInfo.lenderName = data.name;
        state.formInfo.lenderIdCard = data.idCard;
      }
      if (state.formInfo.iouType === 1){
        state.formInfo.borrowerId = data.id;
        state.formInfo.borrowerName = data.name;
        state.formInfo.borrowerIdCard = data.idCard;
      }
    })
  }

  function checkSubmit() {
    // 校验金额输入
    if (!state.formInfo.amount) {
      sheep.$helper.toast('请输入借款金额');
      return
    }
    // 校验借款人和出借人
    if (!state.formInfo.borrowerId || !state.formInfo.lenderId) {
      sheep.$helper.toast('请选择借款人或出借人');
      return
    }
    if(!state.formInfo.readAgreement){
      sheep.$helper.toast('请勾选已阅读并同意借款协议');
      return
    }
    return true
  }

  function nextStep() {
    let checkState = checkSubmit()
    if (!checkState){
      return
    }
    // 判断当前是否是出借人
    if (state.formInfo.iouType === 2) {
      // 需要输入支付密码
      payPasswordInput.value.open()
    } else {
      // 提交表单
      IouApi.createIou(state.formInfo).then((res) => {
        if(res.code === 0){
          sheep.$helper.toast('提交成功，等待对方确认')
          //  提交成功，跳转到首页
          sheep.$router.go('/pages/index/index')
        } else {
          sheep.$helper.toast(res.message)
        }
      })
    }
  }

  function openAgreement() {
    sheep.$router.go('/pages/sign/agreement-list', {isShow: true})
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
        IouApi.createIou(state.formInfo).then((res) => {
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

  function readAgreementChange(e) {
    state.formInfo.readAgreement = e.detail.value === 'true'
  }

  onLoad(async (options) => {
    // 获取本人信息
    UserApi.getUserInfo().then(res => {
      let userInfo = res.data;
      // 转数字
      state.formInfo.iouType = Number(options.type);
      console.log('userInfo', userInfo);
      console.log('state.formInfo.iouType', state.formInfo.iouType);
      if (state.formInfo.iouType === 1) {
        state.formInfo.lenderId = userInfo.id;
        state.formInfo.lenderName = userInfo.name;
        state.formInfo.lenderIdCard = userInfo.idCard;
        console.log('lenderName', state.formInfo.lenderName);
      } else {
        state.formInfo.borrowerId = userInfo.id;
        state.formInfo.borrowerName = userInfo.name;
        state.formInfo.borrowerIdCard = userInfo.idCard;
        console.log('borrowerName', state.formInfo.borrowerName);
      }
    })
    initInterestRates()
  });

	/**
	 * 数字转大写
	 * @param n 数字
	 * @returns {string}
	 */
	function toUpperCase(n) {
		var unit = "千百拾亿千百拾万千百拾元角分",
			str = "";
		n += "00";
		const indexpoint = n.indexOf('.'); // 如果是小数，截取小数点前面的位数
		if (indexpoint >= 0) {
			n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2); // 若为小数，截取需要使用的unit单位
		}
		unit = unit.substr(unit.length - n.length); // 若为整数，截取需要使用的unit单位
		for (var i = 0; i < n.length; i++) {
			str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i); //遍历转化为大写的数字
		}
		return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g,
			"$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "");
	}

	function initInterestRates() {
		for (let i = 0; i <= 36; i++) {
			state.interestRates.push({
				value: i,
				text: i + '%'
			})
		}
	}

</script>

<style lang="scss" scoped>

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

	.form-item-button {
		height: 70rpx;
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


  .form-item-button-next {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 85%;
    height: 70rpx;
    font-size: 30rpx;
    border-radius: 40rpx;
  }
</style>