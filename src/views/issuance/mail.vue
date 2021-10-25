
<template>
  <div class="container">
    <div id="content">
      <div style="text-align: right;width: 100%;"><el-button plain size="small" icon="el-icon-arrow-left" @click="goBack">返回</el-button></div>
      <h2>邮寄详情页</h2>
      <div id="sender">
        <div class="info1">
          <span style="font-weight: bolder;line-height: 60px;">寄件人信息</span>
          <span style="float: right;margin-right: 2%;height: 61px;line-height: 61px;">
            <el-button id="updateButton" type="primary" @click="editSenderInfo">
              <span>配置寄件信息</span>
            </el-button>
          </span>
        </div>
        <div class="info2">
          <div style="width: 30%;display: inline-block;">
            寄&nbsp;件&nbsp;人&nbsp;：&nbsp;
            <span class="sendContent">{{ this.sendInfo.senderName }}</span>
          </div>
          <div style="width: 30%;display: inline-block;">
            手机号码：
            <span class="sendContent">{{ this.sendInfo.contactNumber }}</span>
          </div>
          <div style="display: inline-block;">
            固定电话：
            <span class="sendContent">{{ this.sendInfo.fixedLine }}</span>
          </div>
          <br><br>
          <div style="width: 30%;display: inline-block;">
            城市/区域：
            <span class="sendContent">{{ this.sendInfo.address }}</span>
          </div>
          <div style="display: inline-block;">
            详细地址：
            <span class="sendContent">{{ this.sendInfo.detailAddress }}</span>
          </div>
        </div>
      </div>
      <div id="receive">
        <div class="info1">
          <span style="font-weight: bolder;line-height: 60px;">收件人信息</span>
        </div>
        <div class="orderList">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" label="序号" width="70" align="center" />
            <el-table-column label="业务类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.prodName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单编号" align="center" prop="tag">
              <template slot-scope="scope">
                <span>{{ scope.row.orderNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="卷宗号" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.dossierNum }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收件人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.receiveName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收件人手机号" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.receiveMobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收件人固定电话" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.receiveFixedLine == null">-</span>
                <span v-else-if="scope.row.receiveFixedLine == ''">-</span>
                <span v-else="scope.row.receiveFixedLine == null">{{ scope.row.receiveFixedLine }}</span>
              </template>
            </el-table-column>
            <el-table-column label="收件人地址" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.receiveAddress }}{{ scope.row.receiveDetailAddress }}</span>
              </template>
            </el-table-column>
            <el-table-column label="公证书份数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.notaryNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="订单操作"
              align="center"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-link type="primary" @click="editReceive(scope.row,scope.$index)">编辑</el-link>
                <el-link type="danger" style="margin-left: 10px;" @click="deleteReceive(scope.$index)">移除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div id="reserveInfo">
        <div class="info1">
          <span style="font-weight: bolder;line-height: 60px;">预约信息</span>
        </div>
        <div class="info2">
          <div style="display: inline-block;width: 28%;">
            <span>快递公司：</span>
            <el-input v-if="expressType == 1" style="width: 50%;" size="small" placeholder="顺丰快递" :disabled="true" />
            <el-input v-if="expressType == 2" style="width: 50%;" size="small" placeholder="中国邮政EMS" :disabled="true" />
          </div>
          <div style="display: inline-block;width: 28%;">
            <span>寄件方式：</span>
            <el-input style="width: 50%;" size="small" placeholder="上门取件" :disabled="true" />
          </div>
          <div style="display: inline-block;width: 28%;">
            <span>物品类型：</span>
            <el-input style="width: 50%;" size="small" placeholder="文件" :disabled="true" />
          </div>
          <div id="sendType">
            <div style="display: inline-block;width: 28%;">
              <span>预约日期：</span>
              <el-input v-if="expressType == 1" v-model="reserveDateTime" style="width: 50%;" size="small" placeholder="请选择上门时间" @focus="reserveTime" />
              <el-input v-if="expressType == 2" style="width: 50%;" size="small" placeholder="定点揽收" :disabled="true" />
            </div>
            <div style="display: inline-block;width: 28%;">
              <span>运费支付方式：</span>
              <el-input v-if="expressType == 1" style="width: 50%;" size="small" placeholder="寄付月结" :disabled="true" />
              <el-select v-if="expressType == 2" style="width: 50%;" size="small" placeholder="到付" v-model="payMethod">
                <el-option
                      v-for="item in payMethodOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
              </el-select>
            </div>
            <div id="remarkText" style="margin-top: 20px;">文件描述（可选）：</div>
            <el-input
              id="remarkContent"
              v-model="remark"
              type="textarea"
              style="width: 400px;line-height:initial;margin-top: 10px;"
              placeholder="请简单描述一下您所寄的文件"
              maxlength="120"
              show-word-limit
            />
          </div>
        </div>
      </div>
      <div width="100%;" style="text-align: center;margin-top: 30px;"><el-button width="200px" type="primary" @click="confirmPlaceOrder">确认下单</el-button></div>
    </div>
    <el-dialog
      :visible.sync="editSenderInfoDialogVisible"
      width="550px"
    >
      <el-form ref="editSendInfo" :model="editSendInfo" :rules="rules" style="position: relative;" label-width="40%" class="demo-ruleForm">
        <el-form-item label="寄件人：" prop="senderName">
          <el-input
            v-model="editSendInfo.senderName"
            style="width: 200px"
            size="small"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="手机号码：" prop="contactNumber">
          <el-input
            v-model="editSendInfo.contactNumber"
            style="width: 200px"
            size="small"
            placeholder="请填写寄件人手机号码"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
          />
        </el-form-item>
        <el-form-item label="固定号码：" prop="fixedLine">
          <el-input
            v-model="editSendInfo.fixedLine"
            style="width: 200px"
            size="small"
            placeholder="请输入固定号码"
          />
        </el-form-item>
        <el-form-item label="城市/区域：" prop="regionCode">
          <el-cascader
            v-model="editSendInfo.regionCode"
            :options="options"
            placeholder="请选择"
            size="small"
            @change="cityChange($event)"
          />
        </el-form-item>
        <el-form-item label="详细地址：" prop="detailAddress">
          <el-input
            v-model="editSendInfo.detailAddress"
            style="width: 200px"
            size="small"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEditSender('editSendInfo')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title
      :visible.sync="dialogVisible"
      width="350px"
      top="30vh"
    >
      <!--预约时间 -->
      <div id="reserveTimeList">
        <div class="flex-ul">
          <div
            v-for="(item,index) of timeSelectList"
            :key="'timeType' + index"
            :class="{active : selectTime == item.type}"
            @click="changeTime(item.type)"
          >{{ item.tit }}</div>
        </div>
        <div class="flex-ul">
          <div v-if="dateTimeList.length == 0">无可预约时间</div>
          <div v-for="(item,index) of dateTimeList" v-else :key="'time' + index" :class="{active : selectTime2 == index}" @click="selectTime2 = index">{{ item }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTime">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改收件人信息"
      :visible.sync="editReceiveDialogVisible"
      width="790px"
    >
      <div style="font-weight: bold;">订单信息</div>
      <div style="margin-top: 20px;margin-left: 30px;">
        <span>业务类型：{{ editReceiveInfo.prodName }}</span>
        <span style="margin-left: 50px;">订单编号：{{ editReceiveInfo.orderNum }}</span>
        <span style="margin-left: 50px;">卷宗号：{{ editReceiveInfo.dossierNum }}</span>
      </div>
      <div style="font-weight: bold;margin-top: 30px;">收件人信息</div>
      <el-form ref="editReceiveInfo" :model="editReceiveInfo" :rules="rules" label-width="200px" class="demo-ruleForm">
        <el-form-item label="收件人: " prop="receiveName"><el-input v-model="editReceiveInfo.receiveName" placeholder="请填写收件人姓名" size="small" class="editInfo" /></el-form-item>
        <el-form-item label="手机号: " prop="receiveMobile"><el-input v-model="editReceiveInfo.receiveMobile" placeholder="请填写收件人手机号" size="small" class="editInfo" /></el-form-item>
        <el-form-item label="固定电话: " prop="receiveFixedLine"><el-input v-model="editReceiveInfo.receiveFixedLine" placeholder="请填写固定号码" size="small" class="editInfo" /></el-form-item>
        <el-form-item label="城市/区域: " prop="receiveRegionCode">
          <el-cascader
            v-model="editReceiveInfo.receiveRegionCode"
            :options="options"
            placeholder="请选择"
            size="small"
            class="editInfo"
            @change="cityChange2($event)"
          />
        </el-form-item>
        <el-form-item label="详细地址: " prop="receiveDetailAddress"><el-input v-model="editReceiveInfo.receiveDetailAddress" placeholder="请填写地址" size="small" class="editInfo" /></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editReceiveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditReceive('editReceiveInfo')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
export default {
  data() {
    // 必填一个（寄件）
    const RequiredOne = (rule, value, callback) => {
      var fixedLine = this.editSendInfo.contactNumber
      var contactNumber = this.editSendInfo.fixedLine
      if (fixedLine == '' && contactNumber == '') {
        callback(new Error('手机号码、固话号码请至少填写一项'))
      } else {
        callback()
      }
    }
    // 必填一个（收件）
    const RequiredOne2 = (rule, value, callback) => {
      var receiveMobile = this.editReceiveInfo.receiveMobile
      var receiveFixedLine = this.editReceiveInfo.receiveFixedLine
      if (receiveMobile == '' && receiveFixedLine == '') {
        callback(new Error('手机号码、固话号码请至少填写一项'))
      } else {
        callback()
      }
    }
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      if (value == null) {
        callback()
        return
      }
      if ((value.length > 0 && value.length < 7) || value.length > 15) {
        callback('请填写7-15位数字')
      } else {
        callback()
      }
    }
    // 固定号码验证
    const validateFixeLine = (rule, value, callback) => {
      if (value == null) {
        callback()
        return
      }
      if (value.length > 0 && !/^(\d{2,4}-)\d{7,14}$/.test(value)) {
        callback('请填写正确的固定电话')
      } else {
        callback()
      }
    }
    return {
      payMethod: '收方付',
      payMethodOptions: [{
         value: '2',
         label: '收方付'
        },
        {
         value: '1',
         label: '寄付月结'
        }, {
         value: '4',
         label: '寄付现结'
        }],
      expressType: 1,
      remark: '',
      input: false,
      userType: 2,
      tableKey: 0,
      list: null,
      listLoading: false,
      selectedRows: [],
      a: 'Z20081700232',
      b: '1111',
      orderNum: '',
      sendInfo: {
        id: null,
        orgId: null,
        sysUserId: null,
        senderName: null,
        contactNumber: null,
        fixedLine: null,
        regionCode: null,
        address: null,
        detailAddress: null,
        createTime: null,
        signType: null
      },
      editSendInfo: {
        senderName: null,
        contactNumber: null,
        fixedLine: null,
        regionCode: null,
        address: null,
        detailAddress: null
      },
      options: regionData, // 城市选择码
      dialogVisible: false,
      editReceiveDialogVisible: false,
      editSenderInfoDialogVisible: false,
      selectTime: 1,
      selectTime2: null,
      timeSelectList: [
        { tit: '今天', type: 1 },
        { tit: '明天', type: 2 },
        { tit: '后天', type: 3 }
      ],
      dateTimeList: [],
      reserveDateTime: null,
      reserveDate: [],
      sendStartTime: null,
      editReceiveInfo: {
        prodName: '',
        orderNum: '',
        dossierNum: '',
        receiveName: '',
        receiveMobile: '',
        receiveFixedLine: '',
        receiveAddress: '',
        receiveDetailAddress: '',
        receiveRegionCode: null
      },
      editReceiveRow: 0,
      placeOrderList: [],
      rules: {
        senderName: [
          { required: true, message: ' 请填写寄件人', trigger: 'blur' },
          { min: 2, max: 15, message: '请填写2-15个字', trigger: 'blur' }
        ],
        contactNumber: [
          { required: false, trigger: 'blur', validator: RequiredOne, message: ' 手机号码、固话号码请至少填写一项' },
          { min: 7, max: 15, trigger: 'blur', validator: validatePhone, message: ' 请填写正确的手机号' }
        ],
        fixedLine: [
          { required: false, trigger: 'blur', validator: RequiredOne, message: ' 手机号码、固话号码请至少填写一项' },
          { min: 10, max: 20, trigger: 'blur', validator: validateFixeLine, message: ' 请填写正确的固定号码' }
        ],
        regionCode: [
          { required: true, message: '  请选择选项', trigger: 'change' }
        ],
        detailAddress: [
          { required: true, message: '  请填写详细地址', trigger: 'blur' },
          { min: 5, max: 120, message: ' 请填写5-120个字', trigger: 'blur' }
        ],
        receiveName: [
          { required: true, message: ' 请填写收件人', trigger: 'blur' },
          { min: 2, max: 15, message: '请填写2-15个字', trigger: 'blur' }
        ],
        receiveMobile: [
          { required: false, trigger: 'blur', validator: RequiredOne2, message: ' 手机号码、固话号码请至少填写一项' },
          { min: 7, max: 15, trigger: 'blur', validator: validatePhone, message: ' 请填写正确的手机号' }
        ],
        receiveFixedLine: [
          { required: false, trigger: 'blur', validator: RequiredOne2, message: ' 手机号码、固话号码请至少填写一项' },
          { min: 10, max: 20, trigger: 'blur', validator: validateFixeLine, message: ' 请填写正确的固定号码' }
        ],
        receiveRegionCode: [
          { required: true, message: '  请选择选项', trigger: 'change' }
        ],
        receiveDetailAddress: [
          { required: true, message: '  请填写详细地址', trigger: 'blur' },
          { min: 5, max: 120, message: ' 请填写5-120个字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.orderNum = this.$route.query.orderNum
    this.userType = this.$route.query.userType
    this.getDate()
    this.getExpressType()
    this.getList()
    this.getSendInfo()
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.selectedRows = val
    },
    getList() {
      this.listLoading = false
      console.log(this.orderNum)
      const url = 'org/select-receive-info?orderNum=' + this.orderNum
      this.$axios(
        url,
        {},
        {
          method: 'post'
        }
      ).then(res => {
        if (res.success == true) {
          this.list = res.data
          console.log(this.list)
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      })
    },
    getSendInfo() {
      const url = 'org/get-org-express-sender?userType=' + this.userType
      this.$axios(
        url,
        {},
        {
          method: 'get'
        }
      ).then(res => {
        if (res.success == true) {
          if (res.data != null) {
            this.sendInfo = res.data
          }
          console.log(this.sendInfo)
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      })
    },
    confirmEditSender(editSendInfo) {
      this.$refs[editSendInfo].validate((valid) => {
        if (valid) {
          this.sendInfo.senderName = this.editSendInfo.senderName
          this.sendInfo.contactNumber = this.editSendInfo.contactNumber
          this.sendInfo.fixedLine = this.editSendInfo.fixedLine
          this.sendInfo.regionCode = this.editSendInfo.regionCode
          this.sendInfo.address = this.editSendInfo.address
          this.sendInfo.detailAddress = this.editSendInfo.detailAddress
          console.log(this.sendInfo.id)
          var url = ''
          if (this.sendInfo.id != null) {
            url =
              'org/insert-org-express-sender?userType=' +
              this.userType +
              '&senderName=' +
              this.sendInfo.senderName +
              '&contactNumber=' +
              this.sendInfo.contactNumber +
              '&fixedLine=' +
              this.sendInfo.fixedLine +
              '&address=' +
              this.sendInfo.address +
              '&detailAddress=' +
              this.sendInfo.detailAddress +
              '&regionCode=' +
              this.sendInfo.regionCode +
              '&id=' +
              this.sendInfo.id
          } else {
            url =
              'org/insert-org-express-sender?userType=' +
              this.userType +
              '&senderName=' +
              this.sendInfo.senderName +
              '&contactNumber=' +
              this.sendInfo.contactNumber +
              '&fixedLine=' +
              this.sendInfo.fixedLine +
              '&address=' +
              this.sendInfo.address +
              '&detailAddress=' +
              this.sendInfo.detailAddress +
              '&regionCode=' +
              this.sendInfo.regionCode
          }
          this.$axios(
            url,
            {},
            {
              method: 'post'
            }
          ).then(res => {
            if (res.success == true) {
              console.log('保存成功')
              this.editSenderInfoDialogVisible = false
              console.log(this.sendInfo)
            } else {
              this.$message.error('出错了！')
            }
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return
        }
      })
    },
    cityChange(e) {
      console.log(e)
      console.log(this.editSendInfo.regionCode)
      let str = ''
      let cityList = this.options
      const a = this.editSendInfo.regionCode.map(function(val, i, arr) {
        console.log(val)
        for (var itm of cityList) {
          if (itm.value == val) {
            cityList = itm.children
            return itm
          }
        }
      })
      for (const i of a) {
        str += i.label
      }
      this.editSendInfo.regionCode = this.editSendInfo.regionCode[
        this.editSendInfo.regionCode.length - 1
      ]
      this.editSendInfo.address = str
    },
    cityChange2(e) {
      if (this.editReceiveInfo.receiveRegionCode != null && this.editReceiveInfo.receiveRegionCode != '') {
        this.receiveRegionCodeTips = false
      }
      console.log(e)
      console.log(this.editReceiveInfo.receiveRegionCode)
      let str = ''
      let cityList = this.options
      const a = this.editReceiveInfo.receiveRegionCode.map(function(val, i, arr) {
        console.log(val)
        for (var itm of cityList) {
          if (itm.value == val) {
            cityList = itm.children
            return itm
          }
        }
      })
      for (const i of a) {
        str += i.label
      }
      this.editReceiveInfo.receiveRegionCode = this.editReceiveInfo.receiveRegionCode[
        this.editReceiveInfo.receiveRegionCode.length - 1
      ]
      this.editReceiveInfo.receiveAddress = str
    },
    reserveTime() {
      this.dialogVisible = true
      this.getReverveTimeList(this.selectTime - 1)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    changeTime(e) {
      this.selectTime = e
      this.selectTime2 = null
      this.getReverveTimeList(this.selectTime - 1)
    },
    confirmTime() {
      this.dialogVisible = false
      var index = this.selectTime2
      if (index != null) {
        var time = this.dateTimeList[index]
        const url = 'get-sf-appointment-date'
        this.reserveDateTime = this.reserveDate[this.selectTime - 1] + ' ' + time
        if (time == '一小时内') {
          this.sendStartTime = this.reserveDate[this.selectTime - 1] + ' ' + this.dateTimeList[1].substring(0, 5)
        } else {
          this.sendStartTime = this.reserveDate[this.selectTime - 1] + ' ' + time.substring(6, 11)
        }
        this.sendStartTime = this.sendStartTime + ':00'
        console.log(this.sendStartTime)
        this.loading = false
      }
    },
    getReverveTimeList(dateType) {
      var timeList = new Array()
      var date = new Date()
      var hour = date.getHours()
      var minute = date.getMinutes()
      if ((dateType == 0 && hour <= 8 && minute < 30) || dateType != 0) {
        this.getTimeList(hour, timeList, 0, minute)
      } else {
        this.getTimeList(hour, timeList, 1, minute)
      }
      this.dateTimeList = timeList
    },
    getTimeList(hour, timeList, flag, minute) {
      var num = 0
      if (flag == 0) {
        num = 8
        for (var i = 0; i < 12; i++) {
          timeList.push(num + i + ':30-' + (num + i + 1) + ':30')
        }
      } else {
        num = 20 - hour
        if (minute >= 30) {
          hour += 1
          num = num - 1
        }
        timeList.push('一小时内')
        for (var i = 0; i < num; i++) {
          timeList.push(hour + i + ':30-' + (hour + i + 1) + ':30')
        }
      }
    },
    // 获取今天,明天，后天的日期
    getDate() {
      for (var i = 0; i < 3; i++) {
        // 一整天换算成毫秒是86400000；
        var time = new Date().getTime() + i * 86400000
        // 将毫秒转换成日期（YYYY-MM-DD）
        var month = new Date(time).getMonth() + 1
        var datetime = new Date(time).getDate()
        if (month.toString().length == 1) {
          month = 0 + '' + month
        }
        if (datetime.toString().length == 1) {
          datetime = 0 + '' + datetime
        }
        var date = new Date(time).getFullYear() + '-' + month + '-' + datetime
        this.reserveDate[i] = date
      }
    },
    editReceive(row, index) {
      this.editReceiveRow = index
      this.editReceiveDialogVisible = true
      this.editReceiveInfo.prodName = row.prodName
      this.editReceiveInfo.orderNum = row.orderNum
      this.editReceiveInfo.dossierNum = row.dossierNum
      this.editReceiveInfo.receiveName = row.receiveName
      this.editReceiveInfo.receiveMobile = row.receiveMobile
      this.editReceiveInfo.receiveFixedLine = row.receiveFixedLine
      this.editReceiveInfo.receiveAddress = row.receiveAddress
      this.editReceiveInfo.receiveDetailAddress = row.receiveDetailAddress
      this.editReceiveInfo.receiveRegionCode = row.receiveRegionCode
    },
    deleteReceive(index) {
      this.$confirm('点击移除操作后，将从邮寄列表中移除该订单确认移除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '移除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    confirmEditReceive(editReceiveInfo) {
      this.$refs[editReceiveInfo].validate((valid) => {
        if (valid) {
          this.$confirm('点击确定操作后，将修改当前收件人信息确认保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.editReceiveDialogVisible = false
            const url = 'org/update-order-express'
            this.$axios(
              url,
              {
                orderNum: this.editReceiveInfo.orderNum,
                receiveName: this.editReceiveInfo.receiveName,
                receiveMobile: this.editReceiveInfo.receiveMobile,
                receiveFixedLine: this.editReceiveInfo.receiveFixedLine,
                receiveAddress: this.editReceiveInfo.receiveAddress,
                receiveDetailAddress: this.editReceiveInfo.receiveDetailAddress,
                receiveRegionCode: this.editReceiveInfo.receiveRegionCode
              },
              { method: 'put' }
            ).then(res => {
              if (res.success == true) {
                this.list[this.editReceiveRow].receiveName = this.editReceiveInfo.receiveName
                this.list[this.editReceiveRow].receiveMobile = this.editReceiveInfo.receiveMobile
                this.list[this.editReceiveRow].receiveFixedLine = this.editReceiveInfo.receiveFixedLine
                this.list[this.editReceiveRow].receiveAddress = this.editReceiveInfo.receiveAddress
                this.list[this.editReceiveRow].receiveDetailAddress = this.editReceiveInfo.receiveDetailAddress
                this.list[this.editReceiveRow].receiveRegionCode = this.editReceiveInfo.receiveRegionCode
              } else {
                this.$message.error('出错了！')
              }
              this.loading = false
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消修改'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    confirmPlaceOrder() {
      if (this.sendInfo.senderName == null) {
        this.$message.error('请先配置邮寄信息')
        return
      }

      if (this.list.length > 0) {
        console.log(this.expressType)
        if (this.expressType == 1) {
          if (this.sendStartTime == null) {
            this.$message.error('请配置预约上门时间')
            return
          }
          console.log(this.sendStartTime)
          // for (var i in this.list) {
          //   if (this.placeOrderList[i] == undefined) {
          //     this.placeOrderList[i] = {}
          //   }
          //   console.log(this.list[i])
          //   if (this.sendInfo.contactNumber == null || this.sendInfo.contactNumber == '') {
          //     this.placeOrderList[i].sendTel = this.sendInfo.fixedLine
          //   } else {
          //     this.placeOrderList[i].sendTel = this.sendInfo.contactNumber
          //   }
          //   if (this.list[i].receiveMobile == null || this.list[i].receiveMobile == '') {
          //     this.placeOrderList[i].receiveTel	= this.list[i].receiveFixedLine
          //   } else {
          //     this.placeOrderList[i].receiveTel	= this.list[i].receiveMobile
          //   }
          //   this.placeOrderList[i].sendContact = this.sendInfo.senderName
          //   this.placeOrderList[i].sendProvinces = this.sendInfo.address
          //   this.placeOrderList[i].sendDetailAddress = this.sendInfo.detailAddress
          //   this.placeOrderList[i].sendAddress = this.sendInfo.address + this.sendInfo.detailAddress
          //   this.placeOrderList[i].sendCode = this.sendInfo.regionCode
          //   this.placeOrderList[i].sendStartTime	= this.sendStartTime
          //   this.placeOrderList[i].remark	= this.remark
          //   this.placeOrderList[i].receiveContact	= this.list[i].receiveName
          //   this.placeOrderList[i].receiveProvinces	= this.list[i].receiveAddress
          //   this.placeOrderList[i].receiveDetailAddress	= this.list[i].receiveDetailAddress
          //   this.placeOrderList[i].receiveAddress	= this.list[i].receiveAddress + this.list[i].receiveDetailAddress
          //   this.placeOrderList[i].orderNum	= this.list[i].orderNum
          //   this.placeOrderList[i].receiveCode	= this.list[i].receiveRegionCode
          // }
          // console.log(this.placeOrderList)
          // const url = 'org/place-order'
          // this.$axios(
          //   url,
          //   this.placeOrderList,
          //   {
          //     method: 'POST'
          //   }
          // ).then(res => {
          //   if (res.success) {
          //     var orderNum = ''
          //     for (var i = 0; i < this.placeOrderList.length; i++) {
          //       orderNum = orderNum + ',' + "'" + this.placeOrderList[i].orderNum + "'"
          //     }
          //     orderNum = orderNum.substring(1, orderNum.length)
          //     console.log(orderNum)
          //     this.$router.push({
          //       name: 'orderSuccess',
          //       query: {
          //         orderNum: orderNum
          //       }
          //     })
          //   } else {
          //     this.$message.error('下单失败，请重试！')
          //   }
          // })
        } else if (this.expressType == 2) {
          console.log(this.list)
          for (var i in this.list) {
            if (this.placeOrderList[i] == undefined) {
              this.placeOrderList[i] = {}
            }
            if (this.sendInfo.contactNumber == null || this.sendInfo.contactNumber == '') {
              this.placeOrderList[i].senderContactNumber = this.sendInfo.fixedLine
            } else {
              this.placeOrderList[i].senderContactNumber = this.sendInfo.contactNumber
            }
            if (this.list[i].receiveMobile == null || this.list[i].receiveMobile == '') {
              this.placeOrderList[i].receiveMobile	= this.list[i].receiveFixedLine
            } else {
              this.placeOrderList[i].receiveMobile	= this.list[i].receiveMobile
            }
            this.placeOrderList[i].senderName = this.sendInfo.senderName

            this.placeOrderList[i].senderAddress = this.sendInfo.address
            this.placeOrderList[i].senderDetailAddress = this.sendInfo.detailAddress
            this.placeOrderList[i].senderRegionCode = this.sendInfo.regionCode
            this.placeOrderList[i].remark	= this.remark
            this.placeOrderList[i].receiveName	= this.list[i].receiveName
            this.placeOrderList[i].receiveAddress	= this.list[i].receiveAddress
            this.placeOrderList[i].receiveDetailAddress	= this.list[i].receiveDetailAddress
            this.placeOrderList[i].orderNum	= this.list[i].orderNum
            this.placeOrderList[i].receiveRegionCode	= this.list[i].receiveRegionCode
            this.placeOrderList[i].prodName	= this.list[i].prodName
            if(this.payMethod == '收方付'){
              this.placeOrderList[i].payMethod = 2
            }else{
              this.placeOrderList[i].payMethod = this.payMethod
            }
          }
          console.log(this.placeOrderList)
          const url = 'org/ems-order'
          this.$axios(
            url,
            this.placeOrderList,
            {
              method: 'POST'
            }
          ).then(res => {
            if (res.success == true) {
              var orderNum = ''
              for (var i = 0; i < this.placeOrderList.length; i++) {
                orderNum = orderNum + ',' + "'" + this.placeOrderList[i].orderNum + "'"
              }
              orderNum = orderNum.substring(1, orderNum.length)
              console.log(orderNum)
              this.$router.push({
                name: 'orderSuccess',
                query: {
                  orderNum: orderNum
                }
              })
            } else {
              this.$message.error('下单失败，请重试！')
            }
          })
        }
      }
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
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      })
    },
    editSenderInfo() {
      this.editSenderInfoDialogVisible = true
      this.editSendInfo.senderName = this.sendInfo.senderName
      this.editSendInfo.contactNumber = this.sendInfo.contactNumber
      this.editSendInfo.fixedLine = this.sendInfo.fixedLine
      this.editSendInfo.regionCode = this.sendInfo.regionCode
      this.editSendInfo.address = this.sendInfo.address
      this.editSendInfo.detailAddress = this.sendInfo.detailAddress
      console.log(this.editSendInfo.senderName)
      console.log(this.editSendInfo.regionCode)
    }
  }
}
</script>
<style lang="less" scoped>
  .container {
    background: #f5f5f5;
    padding: 20px;
    min-height: calc(100vh - 50px);
  }
  #content {
    background: white;
    padding: 50px;
  }

  #sender {
    position: relative;
    // border:2px solid #f0f0f0;
  }

  #reserveInfo {
    position: relative;
    margin-top: 30px;
  }

  #sendType {
    margin-top: 30px;
  }
  .flex-ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    & > div {
      width: 80px;
      padding: 10px 0;
      margin-bottom: 10px;
      cursor: pointer;
      text-align: center;
      &:nth-child(3n + 2) {
        margin: 0 35px 10px;
      }
    }
  }
  .active {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .eidtReceive{
    margin-top: 20px;
    margin-right: 200px;
  }
  .eidtReceiveTips{
    margin-right: 420px;
    color: red;
  }
  .editInfo{
    width: 300px;
  }
  .editText{
    line-height: 32px;
  }
  .editSender{
    margin-top: 10px;
    margin-right: 150px;
  }
  .info1{
    border-left: 1px solid #d7d7d7;
    border-top: 1px solid #d7d7d7;
    border-right: 1px solid #d7d7d7;
    padding-left: 20px;
    background: #e6f6fe;
  }
  .info2{
    border: 1px solid #d7d7d7;
    padding: 20px;
    font-size: 14px;
    color: #606266;
    font-weight: bold;
  }
  .el-table{
    border: 1px solid #d7d7d7;
  }
  #receive{
    margin-top: 30px;
  }
  .hide:before{
    content: '';
  }
  .sendContent{
    font-weight: normal ;
  }
</style>
