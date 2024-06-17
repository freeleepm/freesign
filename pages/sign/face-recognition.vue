<template>
  <view class="wrap">
    <view class="video-wrap">
      <video id="video" :controls="false"></video>
    </view>
    <canvas id="canvas"></canvas>

    <view class="tip">{{tip}}</view>
  </view>
</template>

<script>

  // JavaScript访问设备前后摄像头
  import FileApi from '@/sheep/api/infra/file';
  import sheep from '@/sheep';
  import UserApi from '@/sheep/api/member/user';

  const constraints = {
    // 初始值
    video: {
      width: {
        min: 300,
        ideal: 1920,
        max: 500,
      },
      height: {
        min: 250,
        ideal: 1080,
        max: 400,
      },
      facingMode: 'user',
      // user -- 前置 、environment -- 后置
    } ,
    // 流以正确的宽度和高度比例进入，如果它是处于纵向模式的手机，则需要进行尺寸反转
  }

  export default {
    data() {
      return {
        tip: '拍摄实际人脸，请确保正对手机且光线充足',
        timer: null,
        idCard: '',
        payPassword: '',
        name: '',
        myVideo: null,
        canvas: null,
        videoStream: null,
        error: '',
        src: '',
        info: '',
        tempFilePaths: '',
        canvasW: 0,
        canvasH: 0,
        params: {},
      }
    },
    onLoad(options) {
      this.idCard = options.idCard
      this.name = options.name
      this.payPassword = options.payPassword
    },

    onReady() {
      this.init()
    },

    onUnload() {
      this.clearTimer()
    },

    methods: {
      async init() {
        try {
          this.myVideo = document.querySelector('.uni-video-video')
          // 前置摄像头
          if ('mediaDevices' in window.navigator && 'getUserMedia' in window.navigator.mediaDevices) {
            // 浏览器支持
            this.videoStream = await window.navigator.mediaDevices.getUserMedia(constraints)
            // 调用将询问用户是否允许访问摄像机。如果用户拒绝，它将引发异常并且不返回流。因此，必须在 try/catch 块内处理这种情况,它返回一个Promise，必须使用 async/await 或 then 块
            this.myVideo.srcObject = this.videoStream
            this.myVideo.play()
            this.screenshot()
          } else {
            this.error = '手机不支持'
          }
        } catch(err) {
          this.error = `init: ${err}`
          console.log(err)
        }
      },

      // 绘制canvas画布、获取data
      screenshot() {
        try {
          let canvas = document.querySelector('#canvas canvas')
          this.timer = setTimeout(() => {
            canvas.width = this.myVideo.videoWidth * 3
            canvas.height = this.myVideo.videoHeight * 3
            canvas.getContext('2d').drawImage(this.myVideo, 0, 0)
            this.tempFilePaths = canvas.toDataURL('image/jpeg')
            console.log(this.tempFilePaths);
            // 上传
            FileApi.uploadFile(this.tempFilePaths).then((res) => {
              if(res.code === 0){
                // 上传认证信息
                UserApi.realname({
                  idCard: this.idCard,
                  name: this.name,
                  payPassword: this.payPassword,
                  faceImg: res.data
                }).then((res) => {
                  if (res.code === 0) {
                    sheep.$helper.toast('实名认证成功');
                    // 回到首页
                    sheep.$router.go("/pages/index/index")
                  } else {
                    sheep.$helper.toast('实名认证失败， ' + res.data.failReason + '，请重新提交认证');
                    // 回到上一页
                    sheep.$router.back()
                  }
                });
              } else {
                this.error = '认证异常：' +  res.msg + '，请退出重试'
              }
            });
          }, 1000)
        } catch(err) {
          this.error = `screenshot: ${err}`
          console.log(err)
        }
      },

      clearTimer() {
        clearTimeout(this.timer)
        this.timer = null
      },
    },
  }
</script>

<style scoped>
  .wrap {
    padding: 40px 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tip {
    margin-top: 16px;
    font-size: 16px;
    line-height: 44rpx;
    color: rgba(10, 15, 45, 0.5);
  }

  .video-wrap {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    background: #000000;
  }

  #video {
    width:100%;
    height:100%;
    border-radius:50%;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
  }

  #canvas {
    position: absolute;
    left: -10000px;
  }

</style>