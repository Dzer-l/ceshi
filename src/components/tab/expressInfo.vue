<template>
  <div class="applicant_main">
    <div style="padding-bottom: 20px;">
      <div v-if="expressState==304||expressState==306" class="title">
        <p style="font-weight: bolder;" class="font-title">快递信息</p>
      </div>
      <div v-if="expressState==304||expressState==306" class="cont_list" style="padding-top: 20px;padding-left: 30px;background: #f2f2f2;">
        <div class="logistics">
          <el-timeline v-if="logisticsListData.length>0">
            <el-timeline-item
              v-for="(activity, index) in logisticsListData"
              :key="index"
              size="large"
              :timestamp="activity.createTime"
              :type="activity.type"
            >
              {{ activity.opInfo }}
            </el-timeline-item>
          </el-timeline>
          <p v-else style="padding-bottom: 20px;font-size: 14px;">暂无物流信息</p>
          <div v-if="dataLength<logisticsData.length" style="display: flex;justify-content: flex-end;padding-right: 50px;"><el-button type="text" @click="loadMore">点击展开更多<i class="el-icon-arrow-down" /></el-button></div>
        </div>
      </div>
      <div class="title">
        <p style="font-weight: bolder;" class="font-title">收件人信息</p>
        <el-button v-if="statu!=304" type="primary" size="small" style="margin-right: 20px;" @click="openPop">编辑</el-button>
        <el-dialog
          title="修改收件人信息"
          :visible.sync="table"
          width="30%"
          :close-on-click-modal="false"
        >
          <div>
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
              <el-form-item label="收件人" prop="name">
                <el-input v-model="ruleForm.name" style="width: 90%;" size="small" clearable />
              </el-form-item>
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="ruleForm.phone" style="width: 90%;" size="small" clearable />
              </el-form-item>
              <el-form-item label="城市/区域" prop="region">
                <el-cascader
                  ref="myCascader"
                  v-model="ruleForm.region"
                  :options="options"
                  :props="{ value:'code',label:'name',children:'children' }"
                  size="small"
                  style="width: 90%;"
                  @change="handleChange"
                />
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="ruleForm.address" style="width: 90%;" :rows="4" type="textarea" maxlength="120" show-word-limit clearable />
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="table = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="cont_list">
        <div>
          <ul>
            <li>
              <div style="min-width: 400px;max-width: 500px;">
                <p style="margin-bottom: 15px;white-space: nowrap;"><span>收件人：</span><span>{{ data.receiveName }}</span></p>
                <p style="margin-bottom: 15px;white-space: nowrap;"><span>城市/区域：</span><span>{{ data.receiveAddress }}</span></p>
                <p><span>公证书和文书材料份数：</span><span style="color: red;">{{ data.notaryNum }}份</span></p>
              </div>
              <div style="min-width: 400px;max-width: 500px;">
                <p style="margin-bottom: 15px;"><span>手机号：</span><span>{{ data.receiveMobile }}</span></p>
                <p style="white-space: nowrap;"><span>详细地址：</span><span>{{ data.receiveDetailAddress }}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="expressState==304||expressState==306" class="title">
        <p>寄件人信息</p>
      </div>
      <div v-if="expressState==304||expressState==306" class="cont_list">
        <div>
          <ul>
            <li>
              <div style="min-width: 400px;max-width: 500px;">
                <p style="margin-bottom: 15px;;white-space: nowrap;"><span>寄件人：</span><span>{{ data.senderName }}</span></p>
                <p style="white-space: nowrap;"><span>城市/区域：</span><span>{{ data.senderDetailAddress }}</span></p>
              </div>
              <div style="min-width: 400px;max-width: 500px;">
                <p style="margin-bottom: 15px;"><span>联系电话：</span><span>{{ data.senderContactNumber }}</span></p>
                <p style="white-space: nowrap;"><span>详细地址：</span><span>{{ data.senderDetailAddress }}</span></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExpressInfo, getCityData, changeInformation, getSendDetail, getCityCode } from '../../api/details.js'
import { isvalidPhone } from './verify.js'
// 验证手机号是否符合规范
var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!isvalidPhone(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
export default {
  props: ['statu'],
  data() {
    return {
      // 订单编号
      orderNum: '',
      // 弹出层的状态
      table: false,
      // 本订单的状态
      expressState: '',
      // 快递信息页面主信息数据
      data: {},
      // 城市三级联动的数组
      options: [],
      // 物流详情总数据
      logisticsData: [],
      // 物流详情规定渲染的数据
      logisticsListData: [],
      // 物流详情数据规定初始要显示的长度
      dataLength: 10,
      // 修改收件人信息中表单绑定的数据
      ruleForm: {
        name: '',
        region: [],
        phone: '',
        address: ''
      },
      // 修改收件人信息中验证表单的数据
      rules: {
        name: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { min: 2, max: 15, message: '请填写 2 到 15 个字', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: validPhone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 5, max: 120, message: '长度在 5 到 120 个字', trigger: 'blur' }
        ]
      },
      // 选择城市后地址的名称
      receiveAddress: ''
    }
  },
	created() {
		// 页面还未渲染完成将路由中订单号参数赋值给页面数据
		this.orderNum = this.$route.query.orderNum || sessionStorage.getItem("detailsOrderNum")
		console.log(sessionStorage.getItem("detailsOrderNum"))
	},
	mounted() {
    // 页面初始加载需要渲染的数据
    this.getExpressData()
    // 将详情页面的订单状态赋值给本页面的状态
    this.expressState = this.$parent.$parent.$parent.headData.orderStatus
    // console.log(, '2222')
  },
  methods: {
    // 获取快递信息页面的数据
    getExpressData() {
      var data = { orderNum: this.orderNum }
      getExpressInfo(data).then((res) => {
        console.log(res, '快递信息数据')
        if (res.data != null) {
          this.data = res.data
          this.getLogisticsData()
        }
      })
    },
    // 由订单号获取物流详情数据
    getLogisticsData() {
      getSendDetail({ orderNum: this.orderNum }).then((res) => {
        console.log(res, '物流详情')
        if (res.data.emsInfoDtoList != null) {
          // var arr = []
          res.data.emsInfoDtoList[0].type = 'primary'
          // for (let i = 0; i < res.data.emsInfoDtoList.length; i++) {
          //   // 物流更新时间的格式不对,转化成xxxx-xx-xx xx:xx:xx的形式
          //   var d = new Date(res.data.emsInfoDtoList[i].createTime)
          //   var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
          //   res.data.emsInfoDtoList[i].createTime = times
          //   arr.push(res.data.emsInfoDtoList[i])
          // }
          // 初始页面物流详情的数据只有5条,点击查看更多增加数据的长度
          this.logisticsData = res.data.emsInfoDtoList
          if (this.dataLength < this.logisticsData) {
            for (let i = 0; i < this.dataLength; i++) {
              this.logisticsListData.push(this.logisticsData[i])
            }
          } else {
            this.logisticsListData = this.logisticsData
          }
        }
      })
    },

    // 弹出层出现的收件人信息修改,验证表单是否通过
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // 表单验证通过时进行的操作
        if (valid) {
          var addresStr = ''
          // 由双向绑定的城市code获取到城市的label
          var arr = this.$refs['myCascader'].getCheckedNodes()[0].pathLabels
          // 获取的城市label是数组格式,转化字符串格式
          for (let i = 0; i < arr.length; i++) {
            addresStr += arr[i] + ' '
          }
          // console.log(addresStr)
          var data = { orderNum: this.orderNum, receiveName: this.ruleForm.name, receiveMobile: this.ruleForm.phone,
            receiveAddress: addresStr, receiveRegionCode: this.ruleForm.region[2], receiveDetailAddress: this.ruleForm.address }
          // 点击确定修改收件人信息
          changeInformation(data).then((res) => {
            // console.log(res)
            // 调用初始页面渲染函数,再次渲染页面
            this.getExpressData()
            // 确定后关闭修改收件人信息弹出层
            this.table = false
          })
          // 表单验证没有通过时进行的操作
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    openPop() {
      // 点击编辑收件人信息获取城市三级联动数据
      getCityData().then((res) => {
        console.log(res, '城市数据')
        var cData = res.data[0].children
        // 点击编辑收件人信息由地址code获取完整的code用于选择器回显数据
        getCityCode({ code: this.data.receiveRegionCode }).then((res) => {
          this.options = cData
          // 回显弹出层中下拉框,输入框的数据
          this.ruleForm.name = this.data.receiveName
          var cityData = []
          for (let i = 1; i < res.data.length; i++) {
            cityData.push(res.data[i])
          }
          // 处理成双向绑定所需要的数据格式cityData数组
          this.ruleForm.region = cityData
          this.ruleForm.phone = this.data.receiveMobile
          this.ruleForm.address = this.data.receiveDetailAddress
          this.table = true
          // console.log(this.ruleForm)
        })
      })
    },

    // 城市三级联动级联选择器值发生改变后,获取到城市形成数据
    handleChange(value) {
      const selectCity = this.$refs.myCascader.getCheckedNodes()[0]
      this.receiveAddress = selectCity.pathLabels
      // console.log(this.ruleForm.region)
    },

    // 物流详情中点击加载更多后,数据变更
    loadMore() {
      if (this.dataLength > this.logisticsData.length) {
        this.logisticsListData = this.logisticsData
        this.$message({
          type: 'info',
          message: '没有更多'
        })
      } else {
        this.dataLength = this.dataLength + 5
        this.logisticsListData = []
        this.getLogisticsData()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  p,ul{
    padding: 0;
    margin: 0;
    color: #333;
  }
  li{
    list-style: none;
  }
  .font-title{
    font-size: 14px !important;
    color: #333 !important;
  }

  .applicant_main{
    border: 1px solid #D7D7D7;
    margin: 10px 30px;
    font-size: 14px;
    .title{
      background-color: #e6f6fe;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        font-size: 14px !important;
        font-family: Microsoft YaHei;
        line-height: 21px;
        color: #333333 !important;
        padding-left: 20px;
        font-weight: bolder;
      }
      .pop{
        height:calc(100%);
        width: calc(100%);
        position: fixed;
        background: rgba(0,0,0,0.5);
        z-index: 99;
      }
    }
    .cont_list{
      padding: 0 20px;
      & ul{
        & li{
          display: flex;
          margin: 15px 0;
          &>div{
            margin-right: 20px;
          }
          .id_card_image{
            height: 108px;
            width: 192px;
            border: dashed #d7d7d7 1px;
          }
        }
      }
    }
    /deep/ .el-dialog__wrapper{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /deep/ .el-dialog__header{
      padding: 10px 20px;
    }
    /deep/ .el-dialog__body{
      padding: 0 20px;
      margin-top: 10px;
    }
    .logistics ul li{
      margin-top: 0;
      margin-bottom: 0;
    }
  }
</style>
