<!-- 商品分类列表 -->
<template>
  <s-layout title="借条"
            tabbar="/pages/index/iou"
            navbar="normal"
            :bgStyle="{ color: '#fff' }"
            :leftWidth="0"
            :rightWidth="0"
            tools="search"
            :defaultSearch="state.searchKey"
            @search="onSearch">
    <!-- 筛选 -->
    <su-sticky bgColor="#fff">
      <view class="ss-flex">
        <view class="ss-flex-1">
          <su-tabs :list="state.tabList"
                   :scrollable="false"
                   @change="onTabsChange"
                   :current="state.currentTab"
          />
        </view>
      </view>
    </su-sticky>
    <view v-if="state.pagination.total > 0" class="goods-list ss-m-t-20">
      <view class="iou-item" v-for="item in state.pagination.list" :key="item.id">
        <uni-card @click="sheep.$router.go('/pages/index/iou-info', { id: item.id })">
          <template v-slot:title>
            <div
              style="display: flex;justify-content: space-between;padding-left: 20rpx;padding-right: 10rpx;padding-top: 20rpx;">
              <view>
                JT{{ item.id }}
              </view>
              <view>
                <view style="color: #FA9E0F;font-weight: bold;" v-if="item.iouState === 1">待确认</view>
                <view v-if="item.iouState === 2"
                      style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <view style="color: #4BA4E3;font-weight: bold;">还款中</view>
                  <view style="color: #4BA4E3;font-weight: bold;">剩余{{ item.remainRepaymentDays }}天</view>
                </view>
                <view style="color: #00C843;font-weight: bold;" v-if="item.iouState === 3">已还清</view>
                <view style="color: #00C843;font-weight: bold;" v-if="item.iouState === 4">已销账</view>
                <view style="color: #BBBBBB;font-weight: bold;" v-if="item.iouState === 11">已拒绝</view>
                <view style="color: #FF3232;font-weight: bold;" v-if="item.iouState === 22">已逾期</view>
                <view style="color: #FF3232;font-weight: bold;" v-if="item.iouState === 33">已延期</view>
              </view>
            </div>
          </template>
          <view class="iou-item-amount">
            ￥{{ fen2yuan(item.amount) }}
          </view>
          <view v-if="item.myIdentity === 1" class="iou-item">
            <view class="iou-item-image">
              <image :src="item.lenderAvatar"></image>
            </view>
            <view class="iou-item-right">
              <view class="iou-item-top">{{ item.lenderName }}</view>
              <view class="iou-item-bottom">
                <view class="iou-item-time">{{ item.loanDate }} ~ {{ item.repaymentDate }}</view>
                <view class="iou-item-time">{{ sheep.$helper.timeFormat(item.createTime, 'yyyy-mm-dd hh:MM') }}</view>
              </view>
            </view>
          </view>
          <view v-if="item.myIdentity === 2" class="iou-item">
            <view class="iou-item-image">
              <image :src="item.borrowerAvatar"></image>
            </view>
            <view class="iou-item-right">
              <view class="iou-item-top">{{ item.borrowerName }}</view>
              <view class="iou-item-bottom">
                <view class="iou-item-time">{{ item.loanDate }} ~ {{ item.repaymentDate }}</view>
                <view class="iou-item-time">{{ sheep.$helper.timeFormat(item.createTime, 'yyyy-mm-dd hh:MM') }}</view>
              </view>
            </view>
          </view>
        </uni-card>
      </view>
    </view>
    <uni-load-more v-if="state.pagination.total > 0" :status="state.loadStatus"
                   :content-text="{contentdown: '上拉加载更多',}" @tap="loadMore" />
    <s-empty v-if="state.pagination.total === 0" icon="/static/soldout-empty.png" text="暂无借条" />
    <!-- 弹窗 -->
    <su-popup :show="state.showFilter" type="top" round="10" :space="sys_navBar + 38" backgroundColor="#F6F6F6"
              :zIndex="10" @close="state.showFilter = false">
      <view class="filter-list-box">
        <view class="filter-item" v-for="(item, index) in state.tabList[state.currentTab].list"
              :key="item.value" :class="[{ 'filter-item-active': index === state.curFilter[state.currentTab] }]"
              @tap="onFilterItem(item, index)">
          {{ item.label }}
        </view>
      </view>
    </su-popup>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { resetPagination } from '@/sheep/util';
  import { onPullDownRefresh, onShow, onReachBottom } from '@dcloudio/uni-app';
  import { reactive } from 'vue';
  import IouApi from '@/sheep/api/member/iou';
  import _ from 'lodash';
  import { fen2yuan } from '@/sheep/hooks/useGoods';
  import UserApi from '@/sheep/api/member/user';

  const sys_navBar = sheep.$platform.navbar;
  const state = reactive({
    searchKey: null,
    currentTab: 0, // 当前选中的 tab
    curFilter: [0, 0], // 当前选中的 list 筛选项
    showFilter: false,
    tabList: [
      {
        name: '借条类型',
        list: [
          { label: '全部', value: -1 },
          { label: '借款', value: 1 },
          { label: '出借', value: 2 },
        ],
      },
      // 借条状态(1:待确认;2:还款中;3:已还清;4:已销账;11:已拒绝;22:已逾期;33:已延期;)
      {
        name: '借条状态',
        list: [
          { label: '全部', value: -1 },
          { label: '待确认', value: 1 },
          { label: '还款中', value: 2 },
          { label: '已还清', value: 3 },
          { label: '已销账', value: 4 },
          { label: '已拒绝', value: 11 },
          { label: '已逾期', value: 22 },
          { label: '已延期', value: 33 },
        ],
      },
    ],
    pagination: {
      // 商品分页
      list: [], // 商品列表
      total: [], // 商品总数
      pageNo: 1,
      pageSize: 6,
      iouType: null, // 借条类型(1:借款;2:出借;)
      iouState: null, // 借条状态(1:待确认;2:还款中;3:已还清;4:已销账;11:已拒绝;22:已逾期;33:已延期;)
    },
    loadStatus: '',
  });

  function onSearch(e) {
    console.log('搜索', e);
    // 当前用户ID
    state.searchKey = e;
    emptyList();
    getList();
  }

  // 点击
  function onTabsChange(e) {
    // 如果点击的是【综合推荐】，则直接展开或者收起筛选项
    if (state.tabList[e.index].list) {
      state.currentTab = e.index;
      state.showFilter = !state.showFilter;
      return;
    }
    state.showFilter = false;

    // 如果点击的是【销量】或者【新品优先】，则直接切换 tab
    if (e.index === state.currentTab) {
      return;
    }

    state.currentTab = e.index;
    state.currentSort = e.sort;
    state.currentOrder = e.order;
    emptyList();
    getList(e.sort, e.order);
  }

  // 点击 tab 的 list 筛选项
  const onFilterItem = (item, index) => {
    console.log(item);
    console.log(index);
    state.curFilter[state.currentTab] = index;
    if (state.currentTab === 0){
      // 如果是-1, 则清空筛选项
      if (item.value === -1) {
        state.pagination.iouType = null;
      } else {
        state.pagination.iouType = item.value;
      }
    }
    if (state.currentTab === 1){
      if (item.value === -1) {
        state.pagination.iouState = null;
      } else {
        state.pagination.iouState = item.value;
      }
    }
    state.showFilter = false;
    emptyList();
    getList();
  };

  async function getList() {
    state.loadStatus = 'loading';
    const { code, data } = await IouApi.getIouPage({
      pageNo: state.pagination.pageNo,
      pageSize: state.pagination.pageSize,
      iouType: state.pagination.iouType,
      iouState: state.pagination.iouState,
      searchKey: state.searchKey,
    });
    if (code !== 0) {
      return;
    }
    state.pagination.list = _.concat(state.pagination.list, data.list);
    state.pagination.total = data.total;
    state.loadStatus = state.pagination.list.length < state.pagination.total ? 'more' : 'noMore';
  }

  function emptyList() {
    resetPagination(state.pagination);
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

  // 加载更多
  function loadMore() {
    if (state.loadStatus === 'noMore') {
      return;
    }
    state.pagination.pageNo++;
    getList(state.currentSort, state.currentOrder);
  }

  onShow(async () => {
    checkAuth()
    emptyList()
    await getList();
  });

  onReachBottom(() => {
    loadMore();
  });

  // 下拉刷新
  onPullDownRefresh(async () => {
    emptyList();
    await getList();
    uni.stopPullDownRefresh();
  });
</script>

<style lang="scss" scoped>
  .iou-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .iou-item-image {
    flex: 1 1 10%;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 65rpx;
      height: 65rpx;
      background-color: #eeeeee;
      border-radius: 50rpx;
      margin-right: 10rpx;
    }
  }

  .iou-item-top {
    font-size: 26rpx;
    color: #000000;
  }

  .iou-item-time {
    font-size: 22rpx;
    color: #9E9E9E;
  }

  .iou-item-left {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .iou-item-right {
    margin-top: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 9 1 90%;
  }

  .iou-item-amount {
    color: #FF3232;
    font-weight: bold;
    font-size: 30rpx;
    margin-bottom: 10rpx;
  }

  .iou-item-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .goods-list-box {
    width: 50%;
    box-sizing: border-box;

    .left-list {
      margin-right: 10rpx;
      margin-bottom: 20rpx;
    }

    .right-list {
      margin-left: 10rpx;
      margin-bottom: 20rpx;
    }
  }

  .goods-box {
    &:nth-last-of-type(1) {
      margin-bottom: 0 !important;
    }

    &:nth-child(2n) {
      margin-right: 0;
    }
  }

  .list-icon {
    width: 80rpx;

    .sicon-goods-card {
      font-size: 40rpx;
    }

    .sicon-goods-list {
      font-size: 40rpx;
    }
  }

  .goods-card {
    margin-left: 20rpx;
  }

  .list-filter-tabs {
    background-color: #fff;
  }

  .filter-list-box {
    padding: 28rpx 52rpx;

    .filter-item {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
      line-height: normal;
      margin-bottom: 24rpx;

      &:nth-last-child(1) {
        margin-bottom: 0;
      }
    }

    .filter-item-active {
      color: var(--ui-BG-Main);
    }
  }

  .tab-item {
    height: 50px;
    position: relative;
    z-index: 11;

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
      bottom: 10rpx;
      background-color: var(--ui-BG-Main);
      z-index: 12;
    }
  }
</style>
