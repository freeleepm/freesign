<template>
  <!--  <s-layout :title="!state.autoSignState ? '签署授权协议书' : '取消授权协议书'">-->
  <view style="background-color: #FFF;height: 100%;width: 100%;">
    <uni-notice-bar v-if="state.isShow === 'true'" scrollable single
                    text="本页面仅预览协议，待双方确认后通过借条详情查看实际借款协议"></uni-notice-bar>
    <view id="pdf-box" style="font-size: 32rpx;margin: 20rpx;padding: 20rpx;">
      <view class="pdf-title">
        借款协议
      </view>
      <view class="pdf-content">
        &nbsp;&nbsp;&nbsp;&nbsp;请您认真阅读并充分理解《借款协议》（以下简称“本协议”)，
        您一经点击已阅读并同意本协议，即视为对本协议条款的理解和接受，您同意本协议对您具有法律约束力。
        如果您不同意本协议的任一内容或无法准确理解相关条款，请不要进行后续操作。本协议项下各方均已在“方便签”平台注册，
        同意遵守“方便签”平台的各项交易规则，各方在充分阅读理解本协议条款情形下，本着诚信自愿的原则签订本协议。
        <br />
        <br />
        <br />
        <br />
        甲方（借款人）：{{ state.iouInfo.borrowerName }}
        <br />
        <br />
        身份证号： {{ state.iouInfo.borrowerIdCard }}
        <br />
        <br />
        <br />
        乙方（出借人）：{{ state.iouInfo.lenderName }}
        <br />
        <br />
        身份证号： {{ state.iouInfo.lenderIdCard }}
        <br />
        <br />
        <br />
      </view>
      <view class="pdf-h1">
        鉴于：
      </view>
      <view class="pdf-content">
        1、甲方与乙方自愿使用“ 方便签 ”平台登记确认双方基于借款形成的债权债务法律关系；
        <br />
        2、甲方与乙方知悉并同意本协议下各项条款，并自愿遵守相关约定内容。为此，双方经协商一致，在“ 方便签” 签订本协议，
        达成协议条款如下：
        <br />
        <br />
      </view>
      <view class="pdf-h2" style="margin-top: 40rpx;">
        一、借款主要内容
      </view>
      <uni-table border stripe style="margin-top: 20rpx;">
        <uni-tr>
          <uni-td>借款金额</uni-td>
          <uni-td>{{ state.iouInfo.amount }}元</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td>借款日期</uni-td>
          <uni-td>{{ state.iouInfo.loanDate }}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td>还款方式</uni-td>
          <uni-td>{{ state.iouInfo.repaymentWay }}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td>还款日期</uni-td>
          <uni-td>{{ state.iouInfo.repaymentDate }}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td>年化利率</uni-td>
          <uni-td>{{ state.iouInfo.interestRate }}%</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td>借款用途</uni-td>
          <uni-td>{{ state.iouInfo.reasons }}</uni-td>
        </uni-tr>
        <uni-tr>
          <uni-td>支付方式</uni-td>
          <uni-td>{{ state.iouInfo.payWay }}</uni-td>
        </uni-tr>
      </uni-table>
      <view class="pdf-content">
        注：
        <br />
        1、此处的“借款日期”是指乙方向甲方实际提供借 款且借款已到账的日期。
        <br />
        2、如无特别约定，本协议所指“日”均为日历日。
      </view>
      <view class="pdf-h2">
        二、偿还方式
      </view>
      <view class="pdf-content">
        1、甲方必须按本协议的约定按时、足额偿还乙方的本金和利息，否则会对甲方的信用记录造成不良影响。还款日不受法定假日或公休日的影响，还款日当日甲方需履行还款义务。
        <br />
        2、甲方可以通过线上或者线下的方式进行还款，应优先以条款一中约定的还款方式进行还款。
        <br />
      </view>
      <view style="margin-top: 30rpx;">
        3、如果甲方通过支付宝、微信或现金等线下方式将待还本息偿还给了乙方，乙方确认收到甲方的线下还款后，则视为甲方履行完毕本协议项下的还款义务。
      </view>
      <view class="pdf-h2">
        三、承诺与保证
      </view>
      <view class="pdf-content">
        1、甲方与乙方承诺与保证
        <br />
        (1)甲方与乙方在此确认：各自为具有完全民事权利能力和完全民事行为能力的主体，有权签订并履行本协议，并充分知晓其行为可能存在的各类风险，由本协议引起的违约偿还及其他风险等均由甲方与乙方自行承担；
        <br />
        (2)甲方与乙方在此确认：双方在本协议项下的债权债务关系由双方自行撮合并最终达成，甲方与乙方基于该债权债务关系实施的任何行为及产生的任何后果均不依托于就该债权债务关系为甲方与乙方提供任何相关功能、工具或服务的主体；
        <br />
        (3)甲方与乙方保证：本协议的签订及本协议项下约定的各项内容是双方真实意思表示，且本协议项下债权债务关系符合法律法规规定，否则因此产生的一切法律后果均由甲方与乙方自行承担。
        <br />
        2、甲方承诺并保证：其自身具有与借款金额相匹配的还款能力并按照本协议约定还款，且还款资金来源是其合法合规的自有资金，不存在“以贷养贷”、“多头借贷”等违法违规行为。
        <br />
      </view>
      <view class="pdf-h2">
        四、还款能力降低与违约救济
      </view>
      <view class="pdf-content">
        1、甲方行为符合以下情形中之任意一种即视为还款能力降低：
        <br />
      </view>
      <view style="margin-top: 100rpx;font-size: 26rpx;">
        (1)在乙方以外与任何第三方的其他借款、担保、赔偿、承诺或任何其他债务出现严重违约情况，影响或可能影响甲方在本协议下的还款能力的；
      </view>
      <view class="pdf-content">
        <br />
        (2)部分或者全部丧失民事行为能力、死亡、被宣告死亡或者被宣告失踪，影响或可能影响甲方还款能力的；
        <br />
        (3)甲方被采取刑事强制措施，影响或可能影响甲方还款能力的；
        <br />
        (4)甲方财产被没收、征用、查封、损坏、扣押、冻结的或甲方财产遭受重大损失，影响或可能影响甲方还款能力的；
        <br />
        (5)甲方因与本债务无关的其他争议致使支付账户被冻结、扣划或被采取纳入失信人名单等执行措施，影响或可能影响甲方还款能力的；
        <br />

        (6)甲方为他人债务提供担保或以其主要财产向第三人抵押、质押，影响或可能影响甲方还款能力的；
        <br />
        (7)出现任何其他影响或可能影响甲方还款能力的事件。
        <br />
        <br />
        2、若乙方判断甲方发生前述还款能力降低事件，乙方有权自行或委托
        “ 方便签 ”平台或其指定的业务运营方等服务方采取下列一种或多种措施进行债权救济：
        <br />
        (1)要求甲方立即偿还所有应付款项；
        <br />
        (2)对甲方账户进行冻结等操作；
        <br />
        (3)通过甲方提供的其亲朋好友、紧急联系人、指定联系人等第三人提醒、敦 促甲方履行还款义务；
        <br />
        (4)采取法律、法规以及本协议约定的其他救济措施。
        <br />
        <br />
        3、甲方行为符合以下情形中任意一种的即视为违约
        <br />
        (1)甲方借款到期未足额偿还应付款项的。
        <br />
        (2)甲方提供虚假资料或隐瞒重要事实的。
        <br />
        <br />
      </view>
      <view class="pdf-content" style="margin-top:40rpx;">
        4、双方同意，若甲方发生违约行为，乙方有权自行或委托“ 方便签 ”平 台或其指定的业务运营方等服务方采取下列一种或多种措施协助乙方予以债权救济：
        (1)要求甲方立即偿还所有应付款；
        <br />
        (2)对甲方账户进行冻结等操作；
        <br />
        自行或委托第三方通过电话/短信及其他合法方式实施委托提醒还款与调解；
        <br />
        在“ 方便签 ”平台或其他渠道披露甲方的违约信息；
        <br />
        向甲方提供的其亲朋好友、紧急联系人、指定联系人等第三人提醒、敦促甲方履行还款义务；
        <br />
        将甲方违约情况提供给依法成立的个人征信机构；
        <br />
        (7）将与甲方违约行为相关的判决书、裁定书、仲裁裁决书等文书用于督促还款用途的公开披露；
        <br />
        通过本协议及其从协议、补充协议约定的方式或其他途径收集、核验、储存甲方的信息并用于争议解决的目的，并有权向乙方及其他主体披露甲方相关信息；
        <br />
        向有关部门或者单位予以通报；
        <br />
        采取法律、法规以及本协议约定的其他救济措施。
      </view>
      <view class="pdf-h2">
        五、罚息计算及还款顺序
      </view>
      <view class="pdf-content">
        1、自还款日的次日起计算罚息，以截至当日未偿还借款本金利息之和为基数，每日按年化利率 15%计收罚息。
        <br />
        2、自还款日次日起，甲方的每笔还款金额包括借款本金、利息、罚息等其他费用。
        <br />
        3、借款本金、利息、罚息的金额按照罚息、利息、借款本金的顺序依次偿还。
        <br />
      </view>
      <view class="pdf-h2" style="margin-bottom: 100rpx;">
        六、适用法律及争议解决
      </view>
      <view class="pdf-content">
        1、本协议的签订、履行、终止、解释均适用中华人民共和国法律。
        <br />
        2、若甲方与乙方发生任何纠纷或争议，首先应友好协商解决，协商不成的，
        双方均有权向债务人住所地、债权人（如有债权转让，最终债权受让人为债权人)住所地、保证人（如有)住所地、协议签订地、协议履行地有管辖权的人民法院起诉。
        <br />
        3、相关的诉讼费/仲裁费、律师代理费、差旅费、公告费、执行费、保全费、保险费等因维权产生的所有费用均由借款人承担。
        <br />
      </view>
      <view class="pdf-h2">
        七、其他
      </view>
      <view class="pdf-content">
        1 、本协议采用电子文本形式制成，经双方在线同意后生效；如有补充协议，与本协
        议具有同等法律效力，双方均认可电子文本形式的协议效力。本协议项下的附件（如有）属于本协议不可分割的组成部分。
        <br />
        2、乙方和甲方均委托“ 方便签 ”平台通过其设立的专用服务器保管所有与本协议及补充协议有关的书面文件和电子信息。甲方与乙方在“方便签”平台的《用户注册协议》等内容适用于本协议并具有约束力。
        <br />
        3、本协议任何条款的标题仅系为方便援引和阅读而设置，不得被用于解释本协议任何条款依据。本协议任何条款的无效或不可强制执行并不影响本协议其它条款的效力及可强制执行性。
        <br />
        4、本协议及补充协议的任何修改、补充均以电子文本形式作出。本协议双方确认并同意由“ 方便签
        ”平台或其指定的业务运营方提供的与本协议有关的书面文件或电子信息在无明显错误的情况下应作为本协议有关事项的终局证明。
        <br />
        5、特别说明：“方便签 ” 对出借人与借款人是否属于好友关系，不做任何保证，亦不作为任何一方的担保或代言，借贷风险、责任由借贷双方承担，请借贷双方认
        真阅读本协议。
        <br />
      </view>
      <view class="pdf-content">
        甲方（借款人）：{{ state.iouInfo.borrowerName }}
        <br />
        <br />
        乙方（出借人）：{{ state.iouInfo.lenderName }}
        <br />
        <br />
      </view>
      <view class="pdf-date">
        创建日期： {{ sheep.$helper.timeFormat(state.iouInfo.createTime, 'yyyy-mm-dd') }}
        <br />
        <br />
        打印日期： {{ dayjs().format('YYYY-MM-DD') }}
      </view>
      <view class="pdf-date">
      </view>
    </view>

    <view class="last-area">

    </view>
    <view class="submit-btn">
      <button type="default" plain size="small" @click="back">返回</button>
      <button v-if="state.isShow === 'false'" ype="default" style="background-color: #3277FF;color: #FFFFFF;"
              size="small" @click="sendToEmail()">发送到邮箱
      </button>
    </view>
    <uni-popup ref="inputDialog" type="dialog">
      <uni-popup-dialog mode="input" title="发送到邮箱" placeholder="请输入您的邮箱地址"
                        @confirm="dialogInputConfirm"></uni-popup-dialog>
    </uni-popup>
  </view>
  <!--  </s-layout>-->
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import sheep from '@/sheep';
  import html2canvas from 'html2canvas';
  import jspdf from 'jspdf';
  import IouApi from '@/sheep/api/member/iou';
  import FileApi from '@/sheep/api/infra/file';
  import UserApi from '@/sheep/api/member/user';
  import dayjs from 'dayjs';

  const inputDialog = ref(null);
  const state = reactive({
    autoSignState: null,
    fileName: '借款协议.pdf',
    isShow: true,
    iouId: null,
    iouInfo: {},
    userInfo: {},
    // 借款事由：周转、个体经营、消费、创业、租房、旅游、装修、医疗、其它
    signReasons: [
      { value: 1, text: '周转' },
      { value: 2, text: '个体经营' },
      { value: 3, text: '消费' },
      { value: 4, text: '创业' },
      { value: 5, text: '租房' },
      { value: 6, text: '旅游' },
      { value: 7, text: '装修' },
      { value: 8, text: '医疗' },
      { value: 100, text: '其它' },
    ],
    // 还款方式
    repaymentWays: [
      { value: 1, text: '一次性还本付息' },
    ],
    // 支付方式：网银、支付宝、微信、现金
    payWays: [
      { value: 1, text: '网银' },
      { value: 2, text: '支付宝' },
      { value: 3, text: '微信' },
      { value: 4, text: '现金' },
    ],
  });

  function back() {
    // 返回上一页
    sheep.$router.back();
  }

  function sendToEmail() {
    inputDialog.value.open();
  }

  function dialogInputConfirm(e) {
    downPdf(document.querySelector('#pdf-box'), e);
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
          pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      // 将PDF导出为Blob对象
      let blob = pdf.output('blob');
      // 临时存储
      let file = new File([blob], state.fileName, { type: 'application/pdf' });
      console.log(file);
      FileApi.uploadFileByFile(file).then((res) => {
        IouApi.sendIouAttachment({
          filePath: res.data,
          fileName: state.fileName,
          emailAccount: emailAccount,
        }).then(() => {
          sheep.$helper.toast('发送成功');
        });
      });
    }).catch(err => {
      console.log(JSON.stringify(err));
    });
  }

  function loadIouInfo(iouId) {
    // 获取本人信息
    IouApi.getIouRealInfo({ id: iouId }).then(res => {
      state.iouInfo = res.data;
      state.iouInfo.reasons = state.signReasons.find(item => item.value === res.data.reasons).text;
      state.iouInfo.repaymentWay = state.repaymentWays.find(item => item.value === res.data.repaymentWay).text;
      state.iouInfo.payWay = state.payWays.find(item => item.value === res.data.payWay).text;
      state.iouInfo.interestRate = res.data.interestRate;
    });
  }

  onLoad(async (options) => {
    console.log(options.isShow);
    console.log(options.iouId);
    state.isShow = options.isShow;
    loadIouInfo(options.iouId);
  });
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
    position: fixed;
    bottom: 0;
    top: calc(100% - 200rpx);
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

  .pdf-title {
    text-align: center;
    font-weight: bold;
    font-size: 36rpx;
    margin-bottom: 20rpx;
  }

  .pdf-content {
    font-size: 26rpx;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
  }

  .pdf-h1 {
    font-size: 30rpx;
    font-weight: bold;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
  }

  .pdf-h2 {
    font-size: 26rpx;
    font-weight: bold;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
  }

  .last-area {
    height: 100rpx;
  }

  .pdf-date {
    font-size: 26rpx;
    margin-top: 20rpx;
    margin-bottom: 100rpx;
    text-align: right;
  }
</style>