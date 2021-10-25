<template>

  <div v-show="isShow" class="item-box" style="margin-top: 30px">
    <div id="content">
      <div style="text-align: right;width: 100%;"><el-button plain size="small" icon="el-icon-arrow-left" @click="goBack">返回</el-button></div>
      <div class="head-icon">
        <i style="font-weight: bold;" class="el-icon-success" />
      </div>
      <div class="head-icon" style="margin-top: 18px;">
        <span class="head-span">下单成功，等待快递上门取件</span>
      </div>
      <div class="head-icon" style="margin-bottom: 5px;">
        <span class="head-span">请打印快递电子面单，贴于包裹上，用于取件标识。</span>
      </div>
      <el-table
        ref="orderTable"
        :header-cell-style="{
          color: '#333',
          background: '#e6f6fe',
        }"
        :data="orderList"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="prodName" label="业务类型" />
        <el-table-column prop="orderNum" label="订单编号" />
        <el-table-column prop="dossierNum" label="卷宗号" />
        <el-table-column prop="receiveName" label="收件人" />
        <el-table-column prop="receiveMobile" label="收件人联系号码" show-overflow-tooltip />
        <el-table-column prop="address" label="收件人地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="notaryNum" label="公证书份数" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="table-btn" @click="printEmsOrder(scope.row.orderNum)">打印电子面单</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
import { printInit, print } from '../../utils/print.js'
export default {
  data() {
    return {
      orderList: [],
      orderNum: '',
      isShow: true,
      expressType: 1
    }
  },

  created() {
    this.orderNum = this.$route.query.orderNum
    this.getExpressSendInfo()
    this.getExpressType()
  },

  methods: {

    // 打印面单
    printEmsOrder(orderNum) {
      var iframe = document.getElementsByTagName('IFRAME')[0]
      try {
        document.body.removeChild(iframe)
      } catch (e) {
        // TODO handle the exception
      }
      var result = printInit(this.expressType, orderNum)
      setTimeout(function() {
        print()
      }, '1000')
    },

    // 获取详情
    getExpressSendInfo() {
      if (!this.orderNum) {
        this.$message.error('获取订单号失败!')
        return
      }
      const orderNum = this.orderNum
      this.$axios(
        `org/select-receive-info?orderNum=${orderNum}`, {}, {
          method: 'post'
        }
      ).then(res => {
        for (const i of res.data) {
          i.businessType = i.businessType === 1 ? '公证在线业务在线公证' : i.businessType === 2 ? '商标转让在线公证' : i.businessType ===
              3 ? '公众号迁移在线公证' : ''
        }
        this.orderList = res.data
        for (var i in res.data) {
          if (this.orderList[i] === undefined) {
            this.orderList[i] = {}
          }
          this.orderList[i].prodName = res.data[i].prodName
          this.orderList[i].orderNum = res.data[i].orderNum
          this.orderList[i].dossierNum = res.data[i].dossierNum
          this.orderList[i].receiveName = res.data[i].receiveName
          if (res.data[i].receiveMobile == null || res.data[i].receiveMobile == '') {
            this.orderList[i].receiveMobile = res.data[i].receiveFixedLine
          } else {
            this.orderList[i].receiveMobile = res.data[i].receiveMobile
          }
          this.orderList[i].address = res.data[i].receiveAddress + res.data[i].receiveDetailAddress
          this.orderList[i].notaryNum = res.data[i].notaryNum
        }
      }).catch(err => {
        this.isShow = false
      })
    },
    goBack() {
      window.history.go(-2)
    },
    getExpressType() {
      var url = 'org/get-express-type'
      this.$axios(
        url, {}, {}
      ).then(res => {
        if (res.success === true) {
          this.expressType = res.data
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

<style lang="less" scoped>
  .head-span {
    font-size: 16px;
    color: #409eff;
    line-height: 30px;
  }

  .head-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
  }

  .main-box {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    min-height: calc(100vh - 50px);
    background-color: #f5f5f5;
  }

  .item-box {
    background: #f5f5f5;
    padding: 20px;
    min-height: calc(100vh - 50px);
  }

  .search-nav {
    display: flex;
    align-items: center;
    white-space: nowrap;

    .el-input,
    .el-select {
      width: 310px;
      margin-right: 30px;
    }
  }

  .table-btn {
    color: #1890ff;
    margin-right: 20px;
    cursor: pointer;
  }

  #content {
    background: white;
    padding: 50px;
  }

  .el-icon-success {
    font-size: 80px;
    color: #67c23a;
    line-height: 50px;
  }

  /deep/ .el-table td:first-child{
    border-left: 1px solid #ebeef5;
  }

  /deep/ .el-table td:last-child{
    border-right: 1px solid #ebeef5;
  }
</style>
