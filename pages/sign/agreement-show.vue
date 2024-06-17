<template>
<!--  <s-layout  title="支付密码设置">-->
    <view style="width: 100%; height: 100%;">
      <iframe :src="pageUrl" width="100%" height="100%"></iframe>
      <!-- 添加一个覆盖层用于放置悬浮按钮，确保按钮始终在最上层 -->
      <view v-if="loadingBtn" class="overlay">
        <view class="float-buttons">
          <button @click="goBack" class="button back">返回</button>
          <button @click="sendToEmail" class="button back">发送邮箱</button>
<!--          <button @click="download" class="button download">下载</button>-->
        </view>
      </view>
      <uni-popup ref="inputDialog" type="dialog">
        <uni-popup-dialog ref="inputClose" mode="input" title="发送到邮箱" placeholder="请输入您的邮箱地址" @confirm="dialogInputConfirm"></uni-popup-dialog>
      </uni-popup>
    </view>
<!--  </s-layout>-->
</template>
<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { signUrl } from '@/sheep/config';
  import { ref } from 'vue';
  import sheep from '@/sheep';
  const pageUrl = ref('')
  const pfgUrl = ref('')
  const loadingBtn = ref(false)
  const inputDialog = ref(null)

  // 返回按钮点击事件
  function goBack() {
    sheep.$router.back();
  }

  // 发送邮箱
  function sendToEmail(){
    inputDialog.value.open()
  }

  function dialogInputConfirm(e){
    // 非空判断
    if(!e){
      sheep.$helper.toast('请输入邮箱地址')
      return
    }
    console.log(e);
  }

  // 下载按钮点击事件（这里仅为示例，实际下载逻辑需根据需求实现）
  function download() {
    console.log('下载按钮点击事件');

    // 实现下载逻辑，下载PDF
    // try {
    //   // 假设你有一个API可以提供文件的下载链接
    //   const fileDownloadUrl = pfgUrl; // 请替换为实际的文件下载URL
    //   // 创建隐藏的可下载链接
    //   const link = document.createElement('a');
    //   link.href = fileDownloadUrl;
    //   link.style.display = 'none';
    //   document.body.appendChild(link);
    //   // 触发点击
    //   link.click();
    //   // 清理
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error('下载文件时出错:', error);
    // }
  }
  onLoad(async (options) =>{
    pfgUrl.value = options.url
    pageUrl.value = signUrl + '?url='+ options.url
    console.log(signUrl);
    console.log(pageUrl.value);
    // 等待3s赋值
    setTimeout(() => {
      loadingBtn.value = true
    }, 2000);
  })
</script>


<style scoped lang="scss">
  .overlay {
    position: fixed;
    top: 900rpx;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end; /* 让按钮底部对齐 */
  }

  .float-buttons {
    width: 500rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 50px; /* 与底部的距离 */
    pointer-events: auto; /* 允许按钮接收点击事件 */
  }

  .button {
    font-size: 26rpx;
    height: 80rpx;
    width: 180rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50rpx;
  }

  .back {
    background-color: #3277FF;
    color: #FFFFFF;
  }

  .download {
    background-color: #3277FF;
    color: #FFFFFF;
  }
</style>