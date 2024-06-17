<template>
	<s-layout title="信用中心">
		<view v-if="state.userList.length > 0" class="view-card" v-for="(item) in state.userList">
			<uni-card :title="item.name" :isFull="true" :sub-title="item.idCard" :thumbnail="item.avatar">
				<view class="view-item">
					<uni-tag text="借款" type="primary"></uni-tag>
					<view>
						{{item.borrowCount }} 次，还有{{item.repayCount}} 次待还款
					</view>
				</view>
				<view class="view-item">
					<uni-tag text="出借" type="success"></uni-tag>
					<view>
						{{ item.lendCount }} 次
					</view>
				</view>
			</uni-card>
		</view>
    <s-empty v-if="state.userList.length === 0" icon="/static/soldout-empty.png" text="暂无借条" />
	</s-layout>
</template>

<script setup>
	import {
		reactive
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import UserApi from '@/sheep/api/member/user';

	const state = reactive({
		userList: []
	});

	onLoad((options) => {
		console.log(options.idCard);
		UserApi.searchUser({
			idCard: options.idCard
		}).then(res => {
			state.userList = res.data;
			console.log(state.userList);
		})
	})
</script>

<style>
  .view-card {
		margin: 30rpx;
    border: 30rpx;
	}
	.view-item {
		display: flex;
		align-items: center;
    margin: 10rpx;

    view {
      margin-left: 20rpx;
      margin-top: 6rpx;
    }
	}

  view {
    font-size: 26rpx;
    font-weight: bold;
  }
</style>