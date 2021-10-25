<template>
  <div class="main">
    <div v-if="logisticsData === null" class="no-logistics-information">
      <i class="el-icon-warning" />
      <span>暂无物流信息</span>
    </div>
    <div v-else class="have-logistics-information">
      <div class="recipients-information">
        <ul>
          <li>
            <span>运单号：</span>
            <span>{{ logisticsData.expressNo }}</span>
          </li>
          <li>
            <span>收件人：</span>
            <span>{{ logisticsData.receiveName }}</span>
          </li>
        </ul>
      </div>
      <div class="logistics-information-list">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticsData.emsInfoDTOList"
            :key="index"
            :timestamp="activity.createTime"
            :color="activity.color"
          >
            {{ activity.opInfo }}
          </el-timeline-item>
        </el-timeline>
        <el-button type="primary" size="medium" style="height:32px;width:80px;padding:0" @click="handlePrint">打印面单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogisticInfo, getEntryDateil } from '../../api/cloudMail'
// import { printInit, print } from '../../utils/print.js'
import { printInit, print } from '../../utils/printExpressList';
import {
	packagePrint2,
} from '../../api/logisticsManage';
export default {
  props:["expressId"],
  data() {
    return {
      logisticsData: {},
      orderId: '',
      orderNum: ''
    }
  },
  created() {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
    } else {
      this.orderId = this.$store.state.app.orderId
      var url = `/#${this.$route.path}?orderId=${this.orderId}`
      history.pushState(null, null, url)
    }
    getEntryDateil({ orderId: this.orderId }).then((res) => {
      this.orderNum = res.data.orderNum
      var data = { orderNum: res.data.orderNum }
      getLogisticInfo(data).then((res) => {
        if (res.data !== null) {
          res.data.emsInfoDTOList[0].color =
            '#0bbd87'
          this.getExpressType()
        }

        this.logisticsData = res.data
      })
    })
  },
  methods: {
    // 打印面单
		async handlePrint() {
			let res = await packagePrint2(this.expressId)
			console.log("打印面单", res);

			if (res.success && res.data) {
				let flag = await printInit(res)
				flag && print()
				return
			}

			this.$message({
				message: "打印失败，请稍后再试！",
				type: "error"
			})
		},
    getExpressType() {
      var url = 'org/get-express-type'
      this.$axios(
        url, {}, {}
      ).then(res => {
        if (res.success) {
          this.expressType = res.data
        } else {
          this.$message.error('请求邮政快递面单失败')
        }
        this.loading = false
      }).catch(() => {
        this.$message.error('服务器异常')
      })
    },
    printingMat() {
      print()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  .no-logistics-information {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .have-logistics-information {
    display: flex;
    .recipients-information {
      ul {
        margin: 0;
        padding: 0;
        background: #e6f6fe;
        padding: 10px 0;
        border-left: solid 1px #666;
        li {
          list-style: none;
          padding: 0 20px;
          span {
            line-height: 20px;
          }
        }
      }
    }
    /deep/ .el-timeline-item__wrapper {
      padding-left: 30px;
    }
    /deep/ .el-timeline-item__content{
      line-height: 20px;
    }
  }
}
.logistics-information-list{
  flex: 1;
  display: flex;
  justify-content: space-between;
  /deep/.el-timeline{
    padding-left: 30px;
  }
}
</style>
