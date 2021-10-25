<template>
  <div class="main-box">
    <div class="info-main">
      <div class="info-top">
        <div style="display: flex;align-items: center;height: 21px;margin-bottom: 20px">
          <img src="./../../assets/conn/orderNum.png" width="16" height="18" style="margin-right: 8px" alt="">
          <span>订单编号：{{ topInfo.appointmentNum }}</span>
        </div>
        <div style="display: flex;">
          <div class="top-items"><span>业务类型</span><span>{{ topInfo.appointmentType == 1 ? '购房' : topInfo.appointmentType == 2 ? '卖房' : topInfo.appointmentType == 3 ? '赎楼' : '公证安心贷' }}</span></div>
          <div class="top-items"><span>订单提交时间</span><span>{{ topInfo.createTime }}</span></div>
          <div class="top-items"><span>订单来源</span><span>{{ topInfo.appointmentSource == 1 ? '微信公众号' : 'i深圳' }}</span></div>
        </div>
      </div>
      <div class="info-div">
        <div class="loan-info">
          <div class="loan-title">个人信息</div>
          <div class="loan-flex">
            <div class="info-line"><span>姓名</span><span>{{ topInfo.userName }}</span></div>
            <div class="info-line"><span>手机号</span><span>{{ topInfo.userMobile }}</span></div>
            <div v-if="topInfo.appointmentType == 1" class="info-line"><span>贷款记录</span><span>{{ mainInfo.loanRecord ? '是' : '否' }}</span></div>
            <div v-if="topInfo.appointmentType == 1" class="info-line"><span>首套购房</span><span>{{ mainInfo.houseIndex ? '是' : '否' }}</span></div>
          </div>
          <div v-if="topInfo.appointmentType == 1">
            <div class="loan-title">购房信息</div>
            <div class="loan-flex">
              <div class="info-line"><span>意向片区</span><span>{{ mainInfo.willArea }}</span></div>
              <div class="info-line"><span>物业名称</span><span>{{ mainInfo.propertyName }}</span></div>
              <div class="info-line"><span>房产面积</span><span>{{ mainInfo.houseAcreage }}m²</span></div>
              <div class="info-line"><span>意向户型</span><span>{{ mainInfo.willUnit }}</span></div>
              <div class="info-line"><span>房屋朝向</span><span>{{ mainInfo.houseDirection }}</span></div>
              <div class="info-line"><span>预期总价</span><span>{{ mainInfo.lowPrice }} - {{ mainInfo.highPrice }}万元</span></div>
              <div class="info-line"><span>预计付款方式</span><span>{{ mainInfo.payWay == 1 ? '全款' : mainInfo.payWay == 2 ? '按揭' : '--' }}</span></div>
            </div>
          </div>
          <div v-if="topInfo.appointmentType == 2">
            <div class="loan-title">卖房信息</div>
            <div class="loan-flex">
              <div class="info-line"><span>物业名称</span><span>{{ mainInfo.propertyName }}</span></div>
              <div class="info-line"><span>房产面积</span><span>{{ mainInfo.houseAcreage }}m²</span></div>
              <div class="info-line"><span>期望售价</span><span>{{ mainInfo.willPrice }}元</span></div>
              <div class="info-line"><span>房屋朝向</span><span>{{ mainInfo.houseDirection }}</span></div>
              <div class="info-line"><span>房屋户型</span><span>{{ mainInfo.unit }}</span></div>
              <div class="info-line"><span>房屋年限</span><span>{{ mainInfo.houseYear ? '满五年' : '未满五年' }}</span></div>
              <div class="info-line"><span>是否唯一住宅</span><span>{{ mainInfo.isOnlyHouse ? '是' : '否' }}</span></div>
              <div class="info-line"><span>权属状况</span><span>{{ mainInfo.tenureStatus == 1? '红本' : mainInfo.tenureStatus == 2 ?'抵押' : '--' }}</span></div>
            </div>
          </div>
          <div v-if="topInfo.appointmentType == 3">
            <div class="loan-title">赎楼信息</div>
            <div class="loan-flex">
              <div class="info-line"><span>贷款银行</span><span>{{ mainInfo.loanBank }}</span></div>
              <div class="info-line"><span>欠款金额</span><span>{{ mainInfo.debtAmount }}元</span></div>
              <div class="info-line"><span>是否正常供楼</span><span>{{ mainInfo.normalMortgage ? '是' : '否' }}</span></div>
            </div>
          </div>
          <div v-if="topInfo.appointmentType == 4">
            <div class="loan-title">期望贷款信息</div>
            <div class="loan-flex">
              <div class="info-line"><span>申请贷款类型</span><span>{{ mainInfo.loanType == 1 ? '红本抵押' : mainInfo.loanType == 2 ? '经营性贷款' : '信用贷款' }}</span></div>
              <div class="info-line"><span>意向贷款金额</span><span>{{ mainInfo.loanAmount }}元</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-line">
        <div class="btn" style="background: #fff;color: #000">
          <span>状态：</span>
          <span :style="{ color: !topInfo.appointmentStatus ? '#FF8800' : '#67C239',fontWeight: 'bold' }">{{ !topInfo.appointmentStatus ? '待联系' : '已联系' }}</span>
        </div>
        <div v-if="!topInfo.appointmentStatus" class="btn" style="cursor: pointer;" @click="linkMan">联系</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      type: '',
      topInfo: {},
      mainInfo: {},
      typeAPI: [
        'org/buy-house-detail',
        'org/sell-house-detail',
        'org/redeem-house-detail',
        'org/relieved-loan-detail'
      ]
    }
  },
  created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.getLoanInfo()
  },
  methods: {
    getLoanInfo() {
      this.$axios('org/appointment-order-detail', { id: this.id }).then(res => {
        if (res.success) {
          this.topInfo = res.data
          console.log(this.typeAPI[res.data.appointmentType - 1])
          this.$axios(this.typeAPI[res.data.appointmentType - 1], { id: this.id }).then(typeRes => {
            if (typeRes.success) {
              this.mainInfo = typeRes.data
            }
          })
        }
      })
    },
    linkMan() {
      this.$axios('org/update-appointment-status', { id: this.id, appointmentStatus: 1 }, { method: 'PUT' }).then(res => {
        console.log(res)
        if (res.success) {
          this.getLoanInfo()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .main-box {
        width: 100%;
        padding: 20px 20px 0;
        box-sizing: border-box;
        min-height: calc(100vh - 50px);
        background-color: #f5f5f5;
        position: relative;
    }
    .info-main{
        display: flex;
        height: calc(100vh - 80px);
        flex-direction: column;
    }
    .info-top{
        background-color: #fff;
        padding: 20px 50px 30px;
    }
    .top-items{
        margin-left: 200px;
        span{
            color: #333;
            margin-right: 30px;
            display: inline-block;
            &:first-child{
            color: #999;
            }
        }
        &:first-child{
            margin: 0;
        }
    }
    .info-div{
        background-color: #fff;
        margin-top: 20px;
        box-sizing: border-box;
        flex: 1;
    }
    .loan-info{
      margin: 30px 60px 0;
      border: 1px solid #EEEEEE;
    }
    .loan-title{
      height: 19px;
      line-height: 19px;
      border-left: 3px solid #409EFF;
      text-indent: 10px;
      font-size: 16px;
      color: #333;
      margin: 20px 0 26px 16px;
    }
    .loan-flex{
      display: flex;
      flex-wrap: wrap;
      margin-left: 30px;
    }

    .info-line{
      width: 400px;
      box-sizing: border-box;
      margin-bottom: 20px;
      display: flex;
      padding-right: 20px;
      justify-content: space-between;
      span{
        display: block;
        color: #333;
        &:first-child{
          color: #999;
          width: 110px;
        }
        &:last-child{
          flex: 0 0 240px
        }
      }
    }

    .btn-line{
        flex: 0 0 80px;
        background-color: #fff;
        box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.16);
        display: flex;
        justify-content: flex-end;
    }
    .btn{
        width: 200px;
        height: 80px;
        background-color: #409EFF;
        color: #fff;
        text-align: center;
        line-height: 80px;
        font-size: 20px;
    }
</style>
