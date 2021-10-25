<template>
  <div class="container">
    <div class="search-issunce-box">
      <div class="title">发证订单列表</div>
      <br>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="寄证申请统计表" name="first">
            <div class="table-box">
              <div style="margin-top: 15px;">
                <el-input v-model="input" placeholder="请输入内容" class="input-with-select" style="width: 600px;">
                  <el-select slot="prepend" v-model="select" placeholder="请选择" style="width: 130px;">
                    <el-option label="申请人" value="applicantName" />
                    <el-option label="订单编号" value="orderNum" />
                    <el-option label="收件人" value="receiveName" />
                    <el-option label="收件人手机号" value="receiveMobile" />
                  </el-select>
                </el-input>
                <el-button style="background-color: #409EFF;color: white;margin-left: 30px;" @click="selectList()">搜索</el-button>
              </div>
              <div>
                <div style="margin-top: 10px;margin-bottom: 10px;height: 36px;">
                  <div style="float: left;height: 36px;line-height: 36px;">
                    物流状态：
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="checkedStatuses" style="display: inline;margin-left: 30px;" @change="handleCheckedStatusesChange">
                      <el-checkbox v-for="status in statuses" :key="status.name" :label="status.label">{{ status.name }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div style="float: right;margin-right: 3%;"><el-button type="primary" size="medium" @click="emails()">邮寄</el-button></div>
                </div>
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
                  <el-table-column type="selection" align="center" />
                  <el-table-column
                    type="index"
                    label="序号"
                    width="70"
                    align="center"
                  />
                  <el-table-column label="业务类型" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.prodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单编号" prop="tag" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.orderNum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="公证申请人" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.applicantName }}</span>
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
                  <el-table-column label="物流状态" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status==1">待邮寄</span>
                      <span v-if="scope.row.status==2">待上门取件</span>
                      <span v-if="scope.row.status==3">运送中</span>
                      <span v-if="scope.row.status==4">已签收</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单来源" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.orderSource==1">pc</span>
                      <span v-if="scope.row.orderSource==2">小程序</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                      <span v-if="scope.row.status==1"><el-link type="primary" @click="email(scope.row.orderNum)">邮寄</el-link></span>
                      <span v-else><el-link type="primary" @click="goInfo(scope.row.orderNum)">查看详情</el-link></span>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 100%;text-align: center;margin-top: 10px;">
                  <el-pagination
                    v-show="total>0"
                    :page-size="listQuery.pageSize"
                    :page-sizes="[10]"
                    :current-page.sync="listQuery.pageNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @current-change="getPaginationList"
                    @size-change="handleSizeChange"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="线下领证申请统计表" name="second">
            <div class="table-box">
              <div style="margin-top: 15px;">
                <el-input v-model="input2" placeholder="请输入内容" class="input-with-select" style="width: 600px;">
                  <el-select slot="prepend" v-model="select2" placeholder="请选择" style="width: 130px;">
                    <el-option label="申请人" value="applicantName" />
                    <el-option label="订单编号" value="orderNum" />
                    <el-option label="领取人" value="receiveName" />
                    <el-option label="领取人手机号" value="receiveMobile" />
                  </el-select>
                </el-input>
                <el-button style="background-color: #409EFF;color: white;margin-left: 30px;" @click="selectList2()">搜索</el-button>
              </div>
              <div>
                <div style="margin-top: 10px;margin-bottom: 10px;height: 36px;">
                  <div style="float: left;height: 36px;line-height: 36px;">
                    预约状态：
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate2" @change="handleCheckAllChange2">全选</el-checkbox>
                    <el-checkbox-group v-model="checkedStatuses2" style="display: inline;margin-left: 30px;" @change="handleCheckedStatusesChange2">
                      <el-checkbox v-for="status in statuses2" :key="status.name" :label="status.label">{{ status.name }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div style="float: right;"><el-button type="primary" size="medium" @click="reserve()">预约时间</el-button></div>
                </div>
              </div>
              <div class="orderList">
                <el-table
                  :key="tableKey"
                  v-loading="listLoading"
                  :data="list2"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;"
                  @selection-change="handleSelectionChange2"
                >
                  <el-table-column type="selection" align="center" />
                  <el-table-column
                    type="index"
                    label="序号"
                    width="70"
                    align="center"
                  />
                  <el-table-column label="业务类型" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.prodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单编号" prop="tag" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.orderNum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="公证申请人" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.applicantName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="领取人" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.receiveName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="领取人手机号" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.mobile }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="领取人身份证号" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.cardNum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="预约状态" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.receiveStatus==0">待预约</span>
                      <span v-if="scope.row.receiveStatus==1">已预约</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单来源" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.orderSource==1">pc</span>
                      <span v-if="scope.row.orderSource==2">小程序</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="95">
                    <template slot-scope="scope">
                      <span v-if="scope.row.receiveStatus == 0"><el-link type="primary" @click="reserve(scope.row)">预约时间</el-link></span>
                      <span v-else><el-link type="primary" @click="reserve(scope.row)">预约时间</el-link><el-link type="primary" @click="orderDetail(scope.row.orderId,scope.row.orderNum)">查看详情</el-link></span>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="width: 100%;text-align: center;margin-top: 10px;">
                  <el-pagination
                    v-show="total2 > 0"
                    :page-size="listQuery2.pageSize"
                    :page-sizes="[10]"
                    :current-page.sync="listQuery2.pageNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total2"
                    @current-change="getPaginationList2"
                    @size-change="handleSizeChange2"
                  />
                </div>
              </div>
              <el-dialog
                title="领证信息"
                :visible.sync="dialogVisible"
                width="650px"
              >
                <div style="margin-left: 30px;">领取人信息</div>
                <div class="reserve">
                  <span class="reserveInfo1">订单编号：</span>
                  <span class="reserveInfo2">{{ selectedRows2[item].orderNum }}</span>
                  <span class="reserveInfo3">卷宗号：</span>
                  <span class="reserveInfo4">{{ selectedRows2[item].dossierNum }}</span>
                </div>
                <div class="reserve" style="line-height: 28px;">
                  <span class="reserveInfo1">领取人：</span>
                  <span class="reserveInfo2">{{ selectedRows2[item].receiveName }}</span>
                  <span class="reserveInfo3">手机号：</span>
                  <span class="reserveInfo4">{{ selectedRows2[item].mobile }}</span>
                </div>
                <div class="reserve" style="line-height: 28px;">
                  <span class="reserveInfo1">领取时间：</span>
                  <span class="reserveInfo2">
                    <el-date-picker
                      v-model="editReceiveTime"
                      type="datetime"
                      size="small"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 190px;"
                      placeholder="请选择领取时间"
                      @change="receiveTimeChange"
                    />
                  </span>
                  <span class="reserveInfo3">领取地点：</span>
                  <span class="reserveInfo4">
                    <!-- <span id="receiveSpan" v-if="selectedRows2[item].receivePointName != null&&selectedRows2[item].receivePointName != '' ">{{selectedRows2[item].receivePointName}}</span> -->
                    <el-select v-model="editReceiveAddress" size="mini" placeholder="请选择" @change="receiveAddressChange">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </span>
                </div>
                <div v-if="receiveTimeTips || receiveAddressTips" class="reserveTips">
                  <span v-if="receiveTimeTips" class="reserveInfo2">
                    请选择选项
                  </span>
                  <span v-if="receiveAddressTips" class="reserveInfo4">
                    请选择选项
                  </span>
                </div>
                <div class="reserve" style="line-height: 28px;">
                  <span class="reserveInfo1">领证号：</span>
                  <span class="reserveInfo2">
                    <el-input v-model="editReceiveNumber" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="15" placeholder="请填写领证号" size="mini" style="width: 190px;" @change="receiveNumberChange" />
                  </span>
                  <span class="reserveInfo3">身份证号码：</span>
                  <span class="reserveInfo4">{{ selectedRows2[item].cardNum }}</span>
                </div>
                <div v-if="receiveNumberTips" class="reserveTips">
                  <span class="reserveInfo2">
                    请填写领证号
                  </span>
                </div>
                <div class="reserve">
                  <span>公证书和文书材料的份数：</span>
                  <span>{{ selectedRows2[item].notaryNum }}份</span>
                </div>
                <span slot="footer" class="dialog-footer">
                  <span v-if="selectedRows2.length > 1">
                    <el-button v-if="item > 0" style="font-size: 12px;" size="mini" @click="previous"><i class="el-icon-arrow-left" /></el-button>
                    <el-button v-else style="font-size: 12px;" size="mini" disabled><i class="el-icon-arrow-left" /></el-button>
                    <el-button v-if="item<selectedRows2.length-1" style="font-size: 12px;margin-right: 200px;" size="mini" @click="next"><i class="el-icon-arrow-right" /></el-button>
                    <el-button v-else style="font-size: 12px;margin-right: 200px;" size="mini" disabled><i class="el-icon-arrow-right" /></el-button>
                  </span>
                  <el-button type="primary" size="small" @click="confirmReserve">确定预约</el-button>
                </span>
              </el-dialog>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
const statusOptions = [1, 2, 3, 4]
const statusOptions2 = [0, 1]
export default {
  data() {
    return {
      item: 0,
      dialogVisible: false,
      input: '',
      input2: '',
      select: 'applicantName',
      select2: 'applicantName',
      checkAll: true,
      statuses: [{
        name: '待邮寄',
        label: 1
      }, {
        name: '待上门取件',
        label: 2
      }, {
        name: '运送中',
        label: 3
      }, {
        name: '已签收',
        label: 4
      }],
      statuses2: [{
        name: '待预约',
        label: 0
      }, {
        name: '已预约',
        label: 1
      }],
      checkedStatuses: statusOptions,
      checkedStatuses2: statusOptions2,
      selectedRows: [],
      selectedRows2: [{}],
      isIndeterminate: true,
      isIndeterminate2: true,
      tableKey: 0,
      list: null,
      list2: null,
      listLoading: false,
      listQuery: {
        pageNum: 1,
        userType: 2,
        status: '',
        applicantName: '',
        orderNum: '',
        receiveName: '',
        receiveMobile: ''
      },
      listQuery2: {
        pageNum: 1,
        userType: 2,
        receiveStatus: '',
        applicantName: '',
        orderNum: '',
        receiveName: '',
        receiveMobile: ''
      },
      total: 0, // 信息条数
      total2: 0, // 信息条数
      activeName: 'first',
      offlineReceive: {},
      options: [],
      receiveTimeTips: false,
      receiveNumberTips: false,
      receiveAddressTips: false,
      editReceiveTime: null,
      editReceiveAddress: null,
      editReceiveNumber: null
    }
  },
  created() {
    this.getList()
    this.getAddressList()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedStatuses = val ? statusOptions : []
      this.isIndeterminate = false
      this.statusChange()
    },
    handleCheckAllChange2(val) {
      this.checkedStatuses2 = val ? statusOptions2 : []
      this.isIndeterminate2 = false
      this.statusChange2()
    },
    handleCheckedStatusesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.statuses.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.statuses.length
      this.statusChange()
    },
    handleCheckedStatusesChange2(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.statuses2.length
      this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.statuses2.length
      this.statusChange2()
    },
    getList() {
      this.listLoading = false
      const url = 'org/select-sending-certificate?pageNum=' + this.listQuery.pageNum + '&userType=' + this.listQuery.userType + '&status=' + this.listQuery.status + '&applicantName=' + this.listQuery.applicantName + '&orderNum=' + this.listQuery.orderNum + '&receiveName=' + this.listQuery.receiveName + '&receiveMobile=' + this.listQuery.receiveMobile + ''
      this.$axios(url).then(res => {
        if (res.success == true) {
          this.list = res.data.sendingCertificateQueryList
          this.total = res.data.total
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      })
    },
    getList2() {
      this.listLoading = false
      const url = 'org/get-application-statistics?pageNum=' + this.listQuery2.pageNum + '&userType=' + this.listQuery2.userType + '&receiveStatus=' + this.listQuery2.receiveStatus + '&applicantName=' + this.listQuery2.applicantName + '&orderNum=' + this.listQuery2.orderNum + '&receiveName=' + this.listQuery2.receiveName + '&mobile=' + this.listQuery2.receiveMobile + ''
      this.$axios(url, {}, {
      }).then(res => {
        if (res.success == true) {
          this.list2 = res.data.offlineLicenseCollectionQueryList
          this.total2 = res.data.total
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      })
    },
    selectList() {
      if (this.select == '') {
        this.$message.error('请选择查询类型')
      } else {
        this.listQuery.status = ''
        for (var i = 0; i < this.checkedStatuses.length; i++) {
          this.listQuery.status = this.listQuery.status + ',' + this.checkedStatuses[i]
        }
        this.listQuery.status = this.listQuery.status.substring(1, this.listQuery.status.length)
        console.log(this.listQuery.status)
        const type = this.select
        console.log(type)
        if (type == 'applicantName') {
          this.listQuery.applicantName = this.input
          console.log(this.listQuery.applicantName)
        } else if (type == 'orderNum') {
          this.listQuery.orderNum = this.input
          console.log(this.listQuery.orderNum)
        } else if (type == 'receiveName') {
          this.listQuery.receiveName = this.input
          console.log(this.listQuery.receiveName)
        } else if (type == 'receiveMobile') {
          this.listQuery.receiveMobile = this.input
          console.log(this.listQuery.receiveMobile)
        }
        this.getList()
      }
    },
    selectList2() {
      if (this.select2 == '') {
        this.$message.error('请选择查询类型')
      } else {
        this.listQuery2.receiveStatus = ''
        for (var i = 0; i < this.checkedStatuses2.length; i++) {
          this.listQuery2.receiveStatus = this.listQuery2.receiveStatus + ',' + this.checkedStatuses2[i]
        }
        this.listQuery2.receiveStatus = this.listQuery2.receiveStatus.substring(1, this.listQuery2.receiveStatus.length)
        console.log(this.listQuery2.receiveStatus)
        const type = this.select2
        console.log(type)
        if (type == 'applicantName') {
          this.listQuery2.applicantName = this.input2
          console.log(this.listQuery2.applicantName)
        } else if (type == 'orderNum') {
          this.listQuery2.orderNum = this.input2
          console.log(this.listQuery2.orderNum)
        } else if (type == 'receiveName') {
          this.listQuery2.receiveName = this.input2
          console.log(this.listQuery2.receiveName)
        } else if (type == 'receiveMobile') {
          this.listQuery2.receiveMobile = this.input2
          console.log(this.listQuery2.receiveMobile)
        }
        this.getList2()
      }
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleSizeChange2(val) {
      this.listQuery2.pageSize = val
      this.getList2()
    },
    getPaginationList(e) {
      this.listQuery.pageNo = e
      this.getList()
    },
    getPaginationList2(e) {
      this.listQuery2.pageNo = e
      this.getList2()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedRows = val
      console.log(this.selectedRows)
    },
    handleSelectionChange2(val) {
      console.log(val)
      this.selectedRows2 = val
    },
    handleClick(tab, event) {
      console.log(this.activeName)
      if (this.activeName == 'first') {
        this.getList()
      } else {
        this.getList2()
      }
    },
    email(orderNum) {
      console.log(orderNum)
      orderNum = "'" + orderNum + "'"
      this.$router.push({
        name: 'mailList',
        query: {
          orderNum: orderNum,
          userType: this.listQuery.userType
        }
      })
    },
    emails() {
      if (this.selectedRows.length == 0) {
        this.$message.error('未选中任何订单')
        return
      }
      var orderNum = ''
      var select = true
      for (var i = 0; i < this.selectedRows.length; i++) {
        if (this.selectedRows[i].status != 1) {
          select = false
          this.$message.error('请选择待邮寄订单')
          return
        }
        orderNum = orderNum + ',' + "'" + this.selectedRows[i].orderNum + "'"
      }
      orderNum = orderNum.substring(1, orderNum.length)
      console.log(orderNum)
      if (select) {
        this.$router.push({
          name: 'mailList',
          query: {
            orderNum: orderNum,
            userType: this.listQuery.userType
          }
        })
      }
    },
    reserve(row) {
      if (row != null) {
        this.selectedRows2 = [{}]
        this.selectedRows2[0] = row
      } else {
        if (this.selectedRows2[0].mobile == null) {
          this.$message.error('未选中任何订单')
          return
        }
      }
      this.item = 0
      this.editReceiveNumber = this.selectedRows2[this.item].receiveNumber
      this.editReceiveAddress = null
      this.editReceiveTime = null
      this.receiveTimeTips = false
      this.receiveNumberTips = false
      this.receiveAddressTips = false
      this.dialogVisible = true
    },
    getAddressList() {
      const url = 'org/org-office'
      this.$axios(url, {}, {
      }).then(res => {
        if (res.success == true) {
          console.log(this.options)
          var result = res.data
          for (var i in result) {
            var option = { label: result[i].pointName, value: result[i].address }
            this.options[i] = option
          }
          console.log(this.options)
        } else {
          this.$message.error('出错了！')
        }
        this.loading = false
      })
    },
    confirmReserve() {
      let goNotConfirm = false
      let addressEcho = false
      this.offlineReceive.receiveNumber = this.editReceiveNumber
      this.offlineReceive.receiveTime = this.editReceiveTime
      this.offlineReceive.receiveAddress = this.editReceiveAddress
      if (document.getElementById('receiveSpan')) {
        addressEcho = true
        console.log('回显了办证点')
      }
      if (this.offlineReceive.receiveTime == null || this.offlineReceive.receiveTime == '') {
        this.receiveTimeTips = true
        goNotConfirm = true
      }
      if (this.offlineReceive.receiveNumber == null || this.offlineReceive.receiveNumber == '') {
        this.receiveNumberTips = true
        goNotConfirm = true
      }
      if (!addressEcho && (this.offlineReceive.receiveAddress == null || this.offlineReceive.receiveAddress == '')) {
        this.receiveAddressTips = true
        goNotConfirm = true
      }
      if (goNotConfirm) {
        return
      }
      if (!addressEcho) {
        for (var i in this.options) {
          if (this.options[i].value == this.offlineReceive.receiveAddress) {
            this.offlineReceive.receivePointName = this.options[i].label
          }
        }
      }
      this.$confirm('确定预约后，将会把预约信息短息发送给领证人，请问要继续吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.offlineReceive.mobile = this.selectedRows2[this.item].mobile
        this.offlineReceive.orderNum = this.selectedRows2[this.item].orderNum
        this.offlineReceive.prodName = this.selectedRows2[this.item].prodName
        console.log(this.offlineReceive)
        const url = 'org/appointment-time'
        this.$axios(url, this.offlineReceive, {
          method: 'put'
        }).then(res => {
          if (res.success == true) {
            this.$message.success('预约成功！')
            if (this.selectedRows2.length == 1) {
              this.dialogVisible = false
              this.getList2()
            } else {
              this.offlineReceive.receiveTime = ''
              this.offlineReceive.receiveNumber = ''
              this.offlineReceive.receiveAddress = ''
              this.selectedRows2.splice(this.item, 1)
              if (this.item == this.selectedRows2.length) {
                item = 0
              }
            }
          } else {
            this.$message.error('出错了！')
          }
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消预约'
        })
      })
    },
    receiveTimeChange() {
      if (this.editReceiveTime != '') {
        this.receiveTimeTips = false
      }
    },
    receiveNumberChange() {
      if (this.editReceiveNumber != '') {
        this.receiveNumberTips = false
      }
    },
    receiveAddressChange() {
      if (this.editReceiveAddress != '') {
        this.receiveAddressTips = false
      }
    },
    previous() {
      this.item = this.item - 1
      this.offlineReceive = {}
    },
    next() {
      this.item = this.item + 1
      this.offlineReceive = {}
    },
    goInfo(orderNum) {
      this.$router.push({
        name: 'expressInfo',
        query: {
          orderNum: orderNum
        }
      })
    },
    statusChange() {
      if (this.checkedStatuses.length == 0) {
        this.list = []
      } else {
        this.listQuery.status = ''
        for (var i = 0; i < this.checkedStatuses.length; i++) {
          this.listQuery.status = this.listQuery.status + ',' + this.checkedStatuses[i]
        }
        this.listQuery.status = this.listQuery.status.substring(1, this.listQuery.status.length)
        this.getList()
      }
    },
    statusChange2() {
      if (this.checkedStatuses2.length == 0) {
        this.list2 = []
      } else {
        this.listQuery2.receiveStatus = ''
        for (var i = 0; i < this.checkedStatuses2.length; i++) {
          this.listQuery2.receiveStatus = this.listQuery2.receiveStatus + ',' + this.checkedStatuses2[i]
        }
        this.listQuery2.receiveStatus = this.listQuery2.receiveStatus.substring(1, this.listQuery2.receiveStatus.length)
        this.getList2()
      }
    },
    orderDetail(orderId, orderNum) {
      this.$router.push({
        name: 'detailsOrder',
        query: { orderId: orderId, orderNum: orderNum }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .title {
    font-weight: bolder;
    font-size: 20px;
    margin-left: 10px;
  }

  .sendingCertificates {
    font-size: 18px;
    padding-top: 50px;
    margin-left: 50px;
  }

  .offlineLicenseApplication {
    font-size: 18px;
    margin-left: 80px;
  }

  .search-issunce-box{
    display: block !important;
    background: #fff;
    margin-bottom: 20px;
    padding: 30px;
    min-width: 100%;
  }

  .table-box {
    background: #fff;
    padding: 10px;
    min-width: 100%;
    margin: 10px;
  }

  .container {
    background: #f5f5f5;
    padding: 20px;
    min-height: calc(100vh - 50px);
  }

  .reserve{
    margin-left: 30px;
    margin-top: 20px;
    position: relative;
    height: 20px;
  }

  .reserveInfo1{
    position: absolute;
    left: 0;
  }

  .reserveInfo2{
    position: absolute;
    left: 80px;
  }

  .reserveInfo3{
    position: absolute;
    left: 285px;
  }

  .reserveInfo4{
    position: absolute;
    left: 385px;
  }

  .reserveTips{
    margin-left: 30px;
    margin-top: 12px;
    position: relative;
    height: 20px;
    color: red;
  }

  .orderList{
    margin-top: 10px;
    width: 100%;
  }

</style>
