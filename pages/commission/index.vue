<!-- 分销中心  -->
<template>
	<s-layout navbar="inner" class="index-wrap" title="分销中心" :bgStyle="bgStyle" onShareAppMessage>
		<!-- 分销商信息 -->
		<commission-info />
		<!-- 账户信息 -->
		<account-info />
		<!-- 菜单栏 -->
		<commission-menu />
		<!-- 分销记录 -->
<!--		<commission-log />-->

<!--		&lt;!&ndash; 权限弹窗 &ndash;&gt;-->
<!--		<commission-auth />-->
	</s-layout>
</template>

<script setup>
	import { reactive } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
	import commissionInfo from './components/commission-info.vue';
	import accountInfo from './components/account-info.vue';
	// import commissionLog from './components/commission-log.vue';
	import commissionMenu from './components/commission-menu.vue';
  import UserApi from '@/sheep/api/member/user';
  import sheep from '@/sheep';
	// import commissionAuth from './components/commission-auth.vue';

	const state = reactive({});

	const bgStyle = {
		color: '#F7D598',
	};

  function checkAuth() {
    UserApi.getUserInfo().then(res => {
      // 获取用户信息
      let userInfo = res.data;
      console.log(userInfo);
      if (!userInfo.authState) {
        // 弹窗跳转实名
        uni.showModal({
          title: '提示',
          showCancel: true,
          content: '请先完成实名认证',
          success: function(res) {
            if (res.confirm) {
              sheep.$router.go('/pages/sign/realname');
            } else {
              sheep.$router.back();
            }
          },
        });
        return
      }
    })
  }

  onShow(async () => {
    checkAuth();
  });
</script>

<style lang="scss" scoped>
	:deep(.page-main) {
		background-size: 100% 100% !important;
	}
</style>