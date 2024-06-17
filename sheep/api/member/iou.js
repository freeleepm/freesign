import request from '@/sheep/request';

const IouApi = {
  // 创建借条
  createIou: (data) => {
    return request({
      url: '/member/iou/create',
      method: 'POST',
      data,
      custom: {
        showLoading: true,
        auth: true,
        successMsg: '提交成功',
      },
    });
  },
  // 获得获取借条分页
  getIouPage: (params) => {
    return request({
      url: '/member/iou/page',
      method: 'GET',
      params,
      custom: {
        showLoading: false,
        showError: false,
      },
    });
  },
  // 获得获取借条详情
  getIouInfo: (params) => {
    return request({
      url: '/member/iou/get',
      method: 'GET',
      params,
      custom: {
        showLoading: false,
        showError: false,
      },
    });
  },
  // 获得获取借条详情
  getIouRealInfo: (params) => {
    return request({
      url: '/member/iou/get-real-info',
      method: 'GET',
      params,
      custom: {
        showLoading: false,
        showError: false,
      },
    });
  },
  // 修改借条状态
  updateIouStatus: (data) => {
    return request({
      url: '/member/iou/update-state',
      method: 'PUT',
      data,
      custom: {
        showLoading: true,
        auth: true,
        successMsg: '操作成功',
      },
    });
  },
  // 删除借条
  deleteIou: (id) => {
    return request({
      url: '/member/iou/delete?id=' + id,
      method: 'DELETE',
      custom: {
        showLoading: true,
        auth: true,
        successMsg: '删除成功',
      },
    });
  },
  // 支付
  payIou: (data) => {
    return request({
      url: '/member/iou/pay',
      method: 'POST',
      data,
      custom: {
        showLoading: true,
        auth: true
      },
    });
  },
  // 发送签署附件到邮箱
  sendIouAttachment: (data) => {
    return request({
      url: '/member/iou/send-attachment-to-email',
      method: 'POST',
      data,
      custom: {
        showLoading: true,
        auth: true,
        successMsg: '发送成功',
      },
    });
  },
};



export default IouApi;
