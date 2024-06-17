import request from '@/sheep/request';

const UserApi = {
  // 获得基本信息
  getUserInfo: () => {
    return request({
      url: '/member/user/get',
      method: 'GET',
      custom: {
        showLoading: false,
        auth: true,
      },
    });
  },
  // 实名认证
  realname: (data) => {
    return request({
      url: '/member/user/realname',
      method: 'POST',
      data,
      custom: {
        auth: true,
        showSuccess: true,
        successMsg: '实名认证成功'
      },
    });
  },

  checkPayPassword: (data) => {
    return request({
      url: '/member/user/check-pay-password',
      method: 'POST',
      data,
      custom: {
        auth: true,
        showSuccess: true
      },
    });
  },

  // 修改支付密码
  updatePayPassword: (data) => {
    return request({
      url: '/member/user/update-pay-password',
      method: 'POST',
      data,
      custom: {
        auth: true,
        showSuccess: true,
        successMsg: '操作成功'
      },
    });
  },

  // 签署授权
  agreementSign: (data) => {
    return request({
      url: '/member/user/agreement-sign',
      method: 'POST',
      data,
      custom: {
        auth: true,
        showSuccess: true,
        successMsg: '操作成功'
      },
    });
  },
  // 修改基本信息
  updateUser: (data) => {
    return request({
      url: '/member/user/update',
      method: 'PUT',
      data,
      custom: {
        auth: true,
        showSuccess: true,
        successMsg: '更新成功'
      },
    });
  },
  // 修改用户手机
  updateUserMobile: (data) => {
    return request({
      url: '/member/user/update-mobile',
      method: 'PUT',
      data,
      custom: {
        loadingMsg: '验证中',
        showSuccess: true,
        successMsg: '修改成功'
      },
    });
  },
  // 基于微信小程序的授权码，修改用户手机
  updateUserMobileByWeixin: (code) => {
    return request({
      url: '/member/user/update-mobile-by-weixin',
      method: 'PUT',
      data: {
        code
      },
      custom: {
        showSuccess: true,
        loadingMsg: '获取中',
        successMsg: '修改成功'
      },
    });
  },
  // 修改密码
  updateUserPassword: (data) => {
    return request({
      url: '/member/user/update-password',
      method: 'PUT',
      data,
      custom: {
        loadingMsg: '验证中',
        showSuccess: true,
        successMsg: '修改成功'
      },
    });
  },
  // 重置密码
  resetUserPassword: (data) => {
    return request({
      url: '/member/user/reset-password',
      method: 'PUT',
      data,
      custom: {
        loadingMsg: '验证中',
        showSuccess: true,
        successMsg: '修改成功'
      }
    });
  },
  // 搜索用户
  searchUser: (data) => {
    return request({
      url: '/member/user/search-user',
      method: 'GET',
      data,
      custom: {
        showLoading: false,
        auth: true,
      },
    });
  },
  // 获取余额信息
  getUserAmount: () => {
    return request({
      url: '/member/user/get-amount',
      method: 'GET',
      custom: {
        showLoading: false,
        auth: true,
      },
    });
  },
  // 添加分享记录
  addShareLog: (data) => {
    return request({
      url: '/member/user/add-share-log',
      method: 'POST',
      data,
      custom: {
        showLoading: false,
        auth: true,
      },
    });
  },
};

export default UserApi;
