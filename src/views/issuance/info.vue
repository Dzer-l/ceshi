<template>
  <div id="div" ref="div" class="main-box">
    <div id="content">
      <div style="text-align: right;width: 100%;"><el-button plain size="small" icon="el-icon-arrow-left" @click="goBack">返回</el-button></div>
      <span v-if="orderExpressSend.status == 2">快递详情页(待上门取件)</span>
      <span v-if="orderExpressSend.status == 3">快递详情页(运送中)</span>
      <span v-if="orderExpressSend.status == 4">快递详情页(已签收)</span>
      <!-- 订单信息 -->
      <div class="item-box">
        <div class="search-nav">
          <div style="font-weight: bold;">
            <p style="font-size: 16px">订单信息</p>
          </div>
          <div v-if="orderExpressSend.status==2">
            <el-button type="primary" size="small" @click="cancelExpress()">取消寄件</el-button>
          </div>
        </div>

        <div class="express-info">
          <span style="font-size: 16px">订单编号：
            <el-tooltip popper-class="atooltip" placement="bottom">
              <div slot="content" class="tooltipContent">
                <span style="font-size: 13px;"><i class="el-icon-info" style="color: #409EFF;" /></span>
                点击该订单编号跳转到对应订单的“订单详情”页
              </div>
              <el-button type="text" @click="goOrderDetil()">{{ orderExpressSend.orderNum }}</el-button>
            </el-tooltip>
          </span>
          <!-- <span style="font-size: 16px">订单编号：<el-button type="text" @click="goOrderDetil()">{{orderExpressSend.orderNum}}</el-button></span> -->
          <span style="font-size: 16px;margin-left:20%">卷宗号：{{ orderExpressSend.dossierNum }}</span>
        </div>
      </div>

      <!-- 快递信息 -->
      <div class="item-box">
        <div class="search-nav">
          <div style="font-weight: bold;">
            <p style="font-size: 16px">快递信息</p>
          </div>
          <div>
            <el-button type="primary" size="small" @click="printEmsOrder()">打印面单</el-button>
          </div>
        </div>

        <div class="express-info">
          <div class="express-nav">
            <div class="parent">
              <div>
                <el-button style="background-color: #12a3fe;color: white;" circle>寄</el-button>
              </div>
              <div style="margin-left: 5%;">
                <div class="express-font">
                  <span>{{ orderExpressSend.senderName }}</span>
                  <span style="margin-left: 25%">{{ orderExpressSend.senderContactNumber }}</span>
                </div>
                <div class="express-font">
                  {{ orderExpressSend.senderAddress }}{{ orderExpressSend.senderDetailAddress }}
                </div>
              </div>
            </div>

            <div class="vertical-line" />

            <div class="parent" style="margin-left:10%">
              <div>
                <el-button style="background-color: #2879fe;color: white;" circle>收</el-button>
              </div>
              <div style="margin-left: 5%;">
                <div class="express-font">
                  <span>{{ orderExpressSend.receiveName }}</span>
                  <span v-if="orderExpressSend.receiveMobile == null" style="margin-left: 25%">{{ orderExpressSend.receiveFixedLine }}</span>
                  <span v-else-if="orderExpressSend.receiveMobile == ''" style="margin-left: 25%">{{ orderExpressSend.receiveFixedLine }}</span>
                  <span v-else style="margin-left: 25%">{{ orderExpressSend.receiveMobile }}</span>
                </div>
                <div class="express-font">
                  {{ orderExpressSend.receiveAddress }}{{ orderExpressSend.receiveDetailAddress }}
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top: 40px">
            <p>
              <span style="margin-left: 25px">运单号：{{ orderExpressSend.expressNo }}</span>
              <span style="margin-left: 15%">寄件方式：{{ orderExpressSend.expressMethod==1?'上门取件':'' }}</span>
              <span style="margin-left: 18%">运费支付方式：{{ orderExpressSend.payMethod==1?'寄付月结':orderExpressSend.payMethod==2?'收方付':orderExpressSend.payMethod==3?'第三方付':'' }}</span>
            </p>
            <p>
              <span style="margin-left: 25px">快递公司：{{ orderExpressSend.expressCompany }}</span>
              <span v-if="expressType == 1" style="margin-left: 15%">预约上门时间：{{ orderExpressSend.sendStartTime }}</span>
              <span v-if="expressType == 2" style="margin-left: 15%">邮政下单时间：{{ orderExpressSend.emsCreateTime }}</span>
            </p>
            <p>
              <span style="margin-left: 25px">文件描述：{{ orderExpressSend.remark }}</span>
            </p>
          </div>

          <div style="margin-top: 100px" class="emsInfo">
            <div class="block">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :timestamp="activity.createTime"
                >
                  {{ activity.opInfo }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
          <div
            v-show="false"
            id="print"
            ref="print"
            style="font-family:黑体;margin: 20px;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { printInit, print } from '../../utils/print.js'
export default {
  data() {
    return {
      activities: [{}],
      orderNum: '',
      orderExpressSend: {},
      expressType: 1,
      orderDTO: {}
    }
  },

  created() {
    this.orderNum = this.$route.query.orderNum
    this.getExpressSendInfo()
    this.getEmsInfos()
    this.getExpressType()
    this.getOrderInfo()
  },

  methods: {
    // 跳转订单详情页
    goOrderDetil() {
      console.log(this.orderDTO)
      if (this.orderDTO.businessType === 1) {
        this.$router.push({
          name: 'delegateInfo',
          query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
        })
      } else if (this.orderDTO.businessType === 2 || this.orderDTO.businessType === 3) {
        this.$router.push({
          name: 'detailsOrder',
          query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
        })
      } else if (this.orderDTO.businessType === 4) {
        this.$router.push({
          name: 'entryDetailsOrder',
          query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
        })
      } else if (this.orderDTO.businessType === 5) {
        this.$router.push({
          name: 'entryDetail',
          query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
        })
      }
      // this.$router.push({
      //   name: 'detailsOrder',
      //   query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
      // })
    },

    // 打印面单
    printEmsOrder() {
      print()
    },

    // 获取物流信息TimeLine
    getEmsInfos() {
      console.log(this.activities)
      this.activities.forEach((item, index) => {
        // item.createTime = this.rTime(item.createTime);
        item.size = 'large'
        if (index === 0) {
          item.size = 'large'
          item.color = '#0bbd87'
        }
      })
    },

    // 获取详情
    getExpressSendInfo() {
      if (!this.orderNum) {
        this.$message.error('获取订单号失败!')
        return
      }
      this.$axios(
        'org/get-send-detail?orderNum=' + this.orderNum, {}, {
          method: 'get'
        }
      ).then(res => {
        console.log(res)
        this.orderExpressSend = res.data.orderExpressSendDTO
        this.activities = res.data.emsInfoDtoList
        this.getEmsInfos()
      })
    },

    // 取消寄件
    cancelExpress() {
      console.log(this.activities)
      this.$confirm('取消后需重新提交快递订单，确认取消该订单？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        if (this.expressType == 1) {
          this.$axios(
            'org/cancel-order', {
              orderExpressId: this.orderExpressSend.expressTempNo
            }, {
              method: 'put'
            }
          ).then(res => {
            if (res.success == true) {
              this.$message({
                type: 'success',
                message: '快递订单取消成功!'
              })
              this.getExpressSendInfo()
            } else {
              this.$message({
                type: 'error',
                message: '快递订单取消失败!'
              })
            }
          })
        } else if (this.expressType == 2) {
          console.log(this.orderExpressSend.emsCreateTime)
          var url = 'org/ems-cancel-order'
          this.$axios(
            url,
            {
              expressTempNo: this.orderExpressSend.expressTempNo,
              emsCreateTime: this.orderExpressSend.emsCreateTime,
              expressNo: this.orderExpressSend.expressNo
            }, {
              method: 'put'
            }
          ).then(res => {
            if (res.success == true) {
              this.$message({
                type: 'success',
                message: '快递订单取消成功!'
              })
              this.getExpressSendInfo()
            } else {
              this.$message({
                type: 'error',
                message: '快递订单取消失败!'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },

    // 时间转换
    rTime(date) {
      var json_date = new Date(date).toJSON()
      return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,
        '')
    },
    goBack() {
      window.history.go(-1)
    },
    getExpressType() {
      var url = 'org/get-express-type'
      this.$axios(
        url, {}, {}
      ).then(res => {
        if (res.success == true) {
          this.expressType = res.data
          printInit(this.expressType, this.orderNum)
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('服务器异常')
      })
    },
    getOrderInfo() {
      var url = 'org/get-order-by-orderNum?orderNum=' + this.orderNum
      this.$axios(
        url, {}, {}
      ).then(res => {
        if (res.success == true) {
          this.orderDTO = res.data
          console.log(this.orderDTO)
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('服务器异常')
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .atooltip.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: rgb(189, 252, 255);
  }

  .atooltip.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
    border-bottom-color: rgb(189, 252, 255);
  }

  .atooltip {
    background: rgba(211, 255, 255, 0.6) !important;
    border: 1px solid #303133;
    border-top-color: rgb(0, 255, 255);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(0, 255, 255);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(0, 255, 255);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(0, 255, 255);
    border-left-style: solid;
    border-left-width: 1px;
    border-image-source: initial;
    border-image-slice: initial;
    border-image-width: initial;
    border-image-outset: initial;
    border-image-repeat: initial;
  }

  .tooltipContent {
    color: #ffffff;
  }

  .search-nav {
    display: flex;
    align-items: center;
    white-space: nowrap;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
  }

  .express-nav {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .express-font {
    font-size: 16px;
    line-height: 34px;
  }

  .vertical-line {
    float: left;
    width: 1px;
    height: 60px;
    margin-left: 15%;
    background: #8b8b8b;
  }

  .main-box {
    box-sizing: border-box;
    background: #f5f5f5;
    padding: 20px;
    min-height: calc(100vh - 50px);
  }

  .item-box {
    border-radius: 5px;
    box-sizing: border-box;
    margin-top: 30px;
  }

  .parent {
    display: flex;
    align-items: center;
  }

  .express-info {
    padding: 20px 30px 0;
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #d7d7d7;
  }

  #content {
    background: white;
    padding: 50px;
  }

  .emsInfo{
    background: #f5f5f5;
    padding: 30px;
  }
</style>
