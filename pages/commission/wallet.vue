<!-- 分销 - 佣金明细 -->
<template>
	<s-layout title="佣金">
<!--    <view class="wallet-wrap">-->
		<!-- 钱包卡片 -->
		<view class="header-box ss-flex ss-row-center ss-col-center">
			<view class="card-box ui-BG-Main ui-Shadow-Main">
				<view class="card-head ss-flex ss-col-center">
					<view class="card-title ss-m-r-10">可提现佣金（元）</view>
					<view @tap="state.showMoney = !state.showMoney" class="ss-eye-icon"
						:class="state.showMoney ? 'cicon-eye' : 'cicon-eye-off'" />
				</view>
				<view class="ss-flex ss-row-between ss-col-center ss-m-t-30">
					<view class="money-num">{{ state.showMoney ? fen2yuan(state.summary.brokeragePrice || 0) : '*****' }}</view>
					<view class="ss-flex">
						<view class="ss-m-r-20">
							<button class="ss-reset-button withdraw-btn" @tap="sheep.$router.go('/pages/commission/withdraw')">
								提现
							</button>
						</view>
<!--						<button class="ss-reset-button balance-btn ss-m-l-20" @tap="state.showModal = true">-->
<!--							转余额-->
<!--						</button>-->
					</view>
				</view>

				<view class="ss-flex">
					<view class="loading-money">
						<view class="loading-money-title">冻结佣金（元）</view>
						<view class="loading-money-num">
              {{ state.showMoney ? fen2yuan(state.summary.frozenPrice || 0) : '*****' }}
            </view>
					</view>
					<view class="loading-money ss-m-l-100">
						<view class="loading-money-title">累计提现（元）</view>
						<view class="loading-money-num">
              {{ state.showMoney ? fen2yuan(state.summary.withdrawPrice || 0) : '*****' }}
            </view>
					</view>
				</view>
			</view>
		</view>

		<su-sticky>
			<!-- 统计 -->
<!--			<view class="filter-box ss-p-x-30 ss-flex ss-col-center ss-row-between">-->
<!--				<uni-datetime-picker v-model="state.date" type="daterange" @change="onChangeTime" :end="state.today">-->
<!--					<button class="ss-reset-button date-btn">-->
<!--						<text>{{ dateFilterText }}</text>-->
<!--						<text class="cicon-drop-down ss-seldate-icon" />-->
<!--					</button>-->
<!--				</uni-datetime-picker>-->

<!--				<view class="total-box">-->
<!--          &lt;!&ndash; TODO 芋艿：这里暂时不考虑做 &ndash;&gt;-->
<!--					&lt;!&ndash; <view class="ss-m-b-10">总收入￥{{ state.pagination.income.toFixed(2) }}</view> &ndash;&gt;-->
<!--					&lt;!&ndash; <view>总支出￥{{ (-state.pagination.expense).toFixed(2) }}</view> &ndash;&gt;-->
<!--				</view>-->
<!--			</view>-->
			<su-tabs :list="tabMaps" @change="onChangeTab" :scrollable="false" :current="state.currentTab" />
		</su-sticky>
		<s-empty v-if="state.pagination.total === 0" icon="/static/data-empty.png" text="暂无数据"></s-empty>

    <!-- 转余额弹框 -->
		<su-popup :show="state.showModal" type="bottom" round="20" @close="state.showModal = false" showClose>
			<view class="ss-p-x-20 ss-p-y-30">
				<view class="model-title ss-m-b-30 ss-m-l-20">转余额</view>
				<view class="model-subtitle ss-m-b-100 ss-m-l-20">将您的佣金转到余额中继续消费</view>
				<view class="input-box ss-flex ss-col-center border-bottom ss-m-b-70 ss-m-x-20">
					<view class="unit">￥</view>
					<uni-easyinput :inputBorder="false" class="ss-flex-1 ss-p-l-10" v-model="state.price" type="number"
                         placeholder="请输入金额" />
				</view>
				<button class="ss-reset-button model-btn ui-BG-Main-Gradient ui-Shadow-Main" @tap="onConfirm">
					确定
				</button>
			</view>
		</su-popup>

		<!-- 钱包记录 -->
		<view v-if="state.pagination.total > 0">
			<view class="wallet-list ss-flex border-bottom" v-for="item in state.pagination.list" :key="item.id">
				<view class="list-content">
					<view class="title-box ss-flex ss-row-between ss-m-b-20">
						<text class="title ss-line-1">{{ item.title }}</text>
						<view class="money">
							<text v-if="item.price >= 0" class="add">+{{ fen2yuan(item.price) }}</text>
							<text v-else class="minus">{{ fen2yuan(item.price) }}</text>
						</view>
					</view>
					<text class="time">{{ sheep.$helper.timeFormat(item.createTime, 'yyyy-mm-dd hh:MM:ss') }}</text>
				</view>
			</view>
		</view>

		<!-- <u-gap></u-gap> -->
		<uni-load-more v-if="state.pagination.total > 0" :status="state.loadStatus" :content-text="{
        contentdown: '上拉加载更多',
      }" />
<!--    </view>-->
	</s-layout>
</template>

<script setup>
	import { computed, reactive } from 'vue';
	import { onLoad, onReachBottom } from '@dcloudio/uni-app';
	import sheep from '@/sheep';
	import dayjs from 'dayjs';
	import _ from 'lodash';
  import BrokerageApi from '@/sheep/api/trade/brokerage';
  import { fen2yuan } from '@/sheep/hooks/useGoods';
  import { resetPagination } from '@/sheep/util';

	const headerBg = sheep.$url.css('/static/img/shop/user/wallet_card_bg.png');

	const state = reactive({
    showMoney: false,
    summary: {}, // 分销信息

    today: '',
    date: [],
		currentTab: 0,
		pagination: {
      list: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
    },
		loadStatus: '',

    price: undefined,
		showModal: false,
	});

	const tabMaps = [{
			name: '分佣',
			value: '1', // BrokerageRecordBizTypeEnum.ORDER
		},
		{
			name: '提现',
			value: '2', // BrokerageRecordBizTypeEnum.WITHDRAW
		}
	];

	const dateFilterText = computed(() => {
		if (state.date[0] === state.date[1]) {
			return state.date[0];
		} else {
			return state.date.join('~');
		}
	});

	async function getLogList() {
		state.loadStatus = 'loading';
		let { code, data } = await BrokerageApi.getBrokerageRecordPage({
			pageSize: state.pagination.pageSize,
			pageNo: state.pagination.pageNo,
      bizType: tabMaps[state.currentTab].value,
		});
		if (code !== 0) {
      return;
		}
    state.pagination.list = _.concat(state.pagination.list, data.list);
    state.pagination.total = data.total;
    state.loadStatus = state.pagination.list.length < state.pagination.total ? 'more' : 'noMore';
	}

	function onChangeTab(e) {
		resetPagination(state.pagination);
		state.currentTab = e.index;
		getLogList();
	}

	function onChangeTime(e) {
		state.date[0] = e[0];
		state.date[1] = e[e.length - 1];
    resetPagination(state.pagination);
		getLogList();
	}

	// 确认操作（转账到余额）
	async function onConfirm() {
		if (state.price <= 0) {
			sheep.$helper.toast('请输入正确的金额');
			return;
		}
		uni.showModal({
			title: '提示',
			content: '确认把您的佣金转入到余额钱包中？',
			success: async function(res) {
				if (!res.confirm) {
          return;
				}
        const { code } = await BrokerageApi.createBrokerageWithdraw({
          type: 1, // 钱包
          price: state.price * 100,
        });
        if (code === 0) {
          state.showModal = false;
          await getAgentInfo();
          onChangeTab({
            index: 1
          });
        }
			}
		});
	}

	async function getAgentInfo() {
		const { code, data } = await BrokerageApi.getBrokerageUserSummary();
    if (code !== 0) {
      return;
    }
    state.summary = data;
	}

	onLoad(async (options) => {
    if (options.type === 2) { // 切换到“提现” tab 下
      state.currentTab = 1;
    }
		getLogList();
		getAgentInfo();
	});

	onReachBottom(() => {
		if (state.loadStatus === 'noMore') {
			return;
		}
    state.pagination.pageNo++;
    getLogList();
	});
</script>

<style lang="scss" scoped>
	// 钱包
	.header-box {
		background-color: $white;
		padding: 30rpx;

		.card-box {
			width: 100%;
			min-height: 300rpx;
			padding: 40rpx;
			background-size: 100% 100%;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			z-index: 1;
			box-sizing: border-box;

			&::after {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				z-index: 2;
				position: absolute;
				top: 0;
				left: 0;
				background: v-bind(headerBg) no-repeat;
				pointer-events: none;
			}

			.card-head {
				color: $white;
				font-size: 24rpx;
			}

			.ss-eye-icon {
				font-size: 40rpx;
				color: $white;
			}

			.money-num {
				font-size: 40rpx;
				line-height: normal;
				font-weight: 500;
				color: $white;
				font-family: OPPOSANS;
			}

			.reduce-num {
				font-size: 26rpx;
				font-weight: 400;
				color: $white;
			}

			.withdraw-btn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30px;
				font-size: 24rpx;
				font-weight: 500;
				background-color: $white;
				color: var(--ui-BG-Main);
			}

			.balance-btn {
				width: 120rpx;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30px;
				font-size: 24rpx;
				font-weight: 500;
				color: $white;
				border: 1px solid $white;
			}
		}
	}

	.loading-money {
		margin-top: 56rpx;

		.loading-money-title {
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
			line-height: normal;
			margin-bottom: 30rpx;
		}

		.loading-money-num {
			font-size: 30rpx;
			font-family: OPPOSANS;
			font-weight: 500;
			color: #fefefe;
		}
	}

	// 筛选

	.filter-box {
		height: 120rpx;
		padding: 0 30rpx;
		background-color: $bg-page;

		.total-box {
			font-size: 24rpx;
			font-weight: 500;
			color: $dark-9;
		}

		.date-btn {
			background-color: $white;
			line-height: 54rpx;
			border-radius: 27rpx;
			padding: 0 20rpx;
			font-size: 24rpx;
			font-weight: 500;
			color: $dark-6;

			.ss-seldate-icon {
				font-size: 50rpx;
				color: $dark-9;
			}
		}
	}

	// tab
	.wallet-tab-card {
		.tab-item {
			height: 80rpx;
			position: relative;

			.tab-title {
				font-size: 30rpx;
			}

			.cur-tab-title {
				font-weight: $font-weight-bold;
			}

			.tab-line {
				width: 60rpx;
				height: 6rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 2rpx;
				background-color: var(--ui-BG-Main);
			}
		}
	}

	// 钱包记录
	.wallet-list {
		padding: 30rpx;
		background-color: #ffff;

		.head-img {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			background: $gray-c;
		}

		.list-content {
			justify-content: space-between;
			align-items: flex-start;
			flex: 1;

			.title {
				font-size: 28rpx;
				color: $dark-3;
				width: 400rpx;
			}

			.time {
				color: $gray-c;
				font-size: 22rpx;
			}
		}

		.money {
			font-size: 28rpx;
			font-weight: bold;
			font-family: OPPOSANS;

			.add {
				color: var(--ui-BG-Main);
			}

			.minus {
				color: $dark-3;
			}
		}
	}

	.model-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}

	.model-subtitle {
		font-size: 26rpx;
		color: #c2c7cf;
	}

	.model-btn {
		width: 100%;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		font-weight: 500;
		color: #ffffff;
		line-height: normal;
	}

	.input-box {
		height: 100rpx;

		.unit {
			font-size: 48rpx;
			color: #333;
			font-weight: 500;
			line-height: normal;
		}

		.uni-easyinput__placeholder-class {
			font-size: 30rpx;
			height: 40rpx;
			line-height: normal;
		}
	}
</style>