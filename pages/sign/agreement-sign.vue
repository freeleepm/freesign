<template>
<!--  <s-layout :title="!state.autoSignState ? '签署授权协议书' : '取消授权协议书'">-->
    <view style="background-color: #FFF;height: 100%;width: 100%;">
      <view id="pdf-box" style="font-size: 32rpx;margin: 20rpx;padding: 20rpx;">
        &nbsp;&nbsp;&nbsp;&nbsp;本人确认授权签署功能在签署本授权委托书时开通，
        开通后本人{{state.userInfo.name}}（身份证号码：{{state.userInfo.idCard}})授权公司xxxxxx有限公司
        （统一社会信用代码：91320324MAC5TLP403)在”方便签"平台范围内，无需经短信动态码、人脸识别等本人验证，即可由“方便签”，
        以本人名义实施电子签名。本人同意，为确保授权签署功能正常运行，数字证书有效期届满的，可自动向CA机构申请更新证书无须经本人再次确认。
        本人已充分知悉上述授权可能存在的风险，对在上述授权范围内以本人名义实施电子签名签署的电子合同等数据电文的法律效力予以认可，并承担相应权利义务。
        <br/>
        <view style="margin-top: 20rpx;display: flex;justify-content: flex-end;">
            <view>授权人：</view>
            <view style="font-weight: bold;color:#FF3232;">{{state.userInfo.name}}</view>
        </view>
      </view>
      <view class="submit-btn">
        <button type="default" plain size="small" @click="back">取消</button>
        <button v-if="!state.userInfo.autoSignState" type="primary" size="small" @click="formSubmit(true)">确认签署</button>
        <button v-if="state.userInfo.autoSignState" type="warn" size="small" @click="formSubmit(false)">取消授权</button>
        <button v-if="state.userInfo.autoSignState" type="default" style="background-color: #3277FF;color: #FFFFFF;" size="small" @click="sendToEmail()">发送到邮箱</button>
      </view>
      <uni-popup ref="inputDialog" type="dialog">
        <uni-popup-dialog mode="input" title="发送到邮箱" placeholder="请输入您的邮箱地址" @confirm="dialogInputConfirm"></uni-popup-dialog>
      </uni-popup>
    </view>
<!--  </s-layout>-->
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { onShow } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import UserApi from '@/sheep/api/member/user';
  import html2canvas from 'html2canvas';
  import jspdf from 'jspdf';
  import IouApi from '@/sheep/api/member/iou';
  import FileApi from '@/sheep/api/infra/file';

  const inputDialog = ref(null)
  const state = reactive({
    autoSignState: null,
    userInfo: {}
  });

  function back() {
    // 返回首页
    sheep.$router.redirect('/pages/index/index')
  }

  function formSubmit(state) {
    let msg = state ? '确认签署自动授权协议?' : '确认取消授权自动授权协议?'
    // 二次确认框
    uni.showModal({
      title: '提示',
      showCancel: true,
      content: msg,
      success: function (res) {
        if (res.confirm) {
          UserApi.agreementSign({autoSignState: state}).then(() => {
            if(state){
              sheep.$helper.toast('确认签署成功');
            } else {
              sheep.$helper.toast('取消授权成功');
            }
            sheep.$router.back();
          })
        }
      },
    })
  }

  function sendToEmail() {
    inputDialog.value.open()
  }

  function dialogInputConfirm(e){
    downPdf(document.querySelector('#pdf-box'), e)
  }

  function downPdf(element, emailAccount) {
    // window.scrollTo(0, 0) //首先滚动到顶部 如果要某一个元素 就滚动到元素位置
    //document.querySelector('#toPDF')
    html2canvas(element, { //对应的dom元素id(class也可以)
      allowTaint: true, //是否允许跨域图像渲染画布
      useCORS: true, //是否尝试使用 CORS 从服务器加载图像 解决图片跨域问题
    }).then(function(canvas) {
      //生成的canvas实例
      const contentWidth = canvas.width; //所选元素宽度
      const contentHeight = canvas.height; //所选元素高度
      //一页pdf显示html页面生成的canvas高度;
      const pageHeight = contentWidth / 595.28 * 841.89;
      //未生成pdf的html页面高度
      let leftHeight = contentHeight;
      //pdf页面偏移
      let position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      const imgWidth = 555.28;
      const imgHeight = 555.28 / contentWidth * contentHeight;
      const pageData = canvas.toDataURL('image/jpeg', 1.0); //转成jpg格式
      const pdf = new jspdf('', 'pt', 'a4'); //生成pdf实例
      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      console.log(1111111111111);
      // 将PDF导出为Blob对象
      let blob = pdf.output('blob')
      let fileName = '签署授权协议书.pdf'
      // 临时存储
      let file = new File([blob], '签署授权协议书.pdf', {type: 'application/pdf'});
      console.log(file);
      FileApi.uploadFileByFile(file).then((res) => {
        IouApi.sendIouAttachment({
          filePath: res.data,
          fileName: fileName,
          emailAccount: emailAccount
        }).then(() => {
          sheep.$helper.toast('发送成功');
        })
      })
      //发送pdf
      // let base64 = pdf.output('datauristring') //获取到base64 的pdf
      // let data = {
      //   fileBase64: base64,
      //   fileName: '签署授权协议书.pdf',
      //   emailAccount: emailAccount
      // }
      // IouApi.sendIouAttachment(data).then(() => {
      //   sheep.$helper.toast('发送成功');
      // })
    }).catch(err => {
      console.log(JSON.stringify(err));
    })
  }

  function previewPDF(pdfUrl) {
    console.log(pdfUrl);
    // 使用iframe或embed进行预览
    const iframe = document.createElement('iframe');
    iframe.src = pdfUrl;
    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.height = '800px'; // 或者设置为你想要的高度
    document.body.appendChild(iframe);
  }

  onShow(() => {
    UserApi.getUserInfo().then((res) => {
      if(!res.data.authState){
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
      state.userInfo = res.data;
    })
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
    margin: 0 20rpx 0 20rpx;
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
</style>