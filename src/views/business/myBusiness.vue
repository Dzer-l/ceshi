<template>
  <div class="business_main">
    <div style="margin-bottom: 20px;background: #fff;">
      <div class="category_title"><p class="font-title">类别检索</p></div>
      <div class="category_to_retrieve">
        <div class="select_type">
          <el-select
            v-model="formInline.region"
            placeholder="申请人"
            size="medium"
          >
            <el-option
              v-for="(item, index) in type"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="select_type_name">
          <el-input
            v-model="formInline.user"
            :placeholder="type_name"
            size="medium"
            clearable
            style="width: 300px"
          />
        </div>
      </div>
      <div style="display: flex;">
        <div class="select_date" style="padding-right: 0">
          <p style="padding-bottom: 20px;" class="font-title">业务类型</p>
          <div class="category_to_retrieve" style="padding: 0">
            <div class="select_type">
              <el-select v-model="formInline.proCode" placeholder="业务类型" size="medium">
                <el-option value=" " label="全部" />
                <el-option v-for="(item, index) in proType" :key="index" :label="item.productionName" :value="item.productionCode" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="select_date" style="padding-left: 0">
          <p style="padding-bottom: 20px;" class="font-title">订单提交时间</p>
          <div>
            <el-date-picker v-model="startDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" size="medium" prefix-icon="el-icon-date" placeholder="选择开始时间" @change="getSStartTime" />
            <span class="date_section">—</span>
            <el-date-picker v-model="endDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" size="medium" prefix-icon="el-icon-date" placeholder="选择结束时间" @change="getSEndTime" />
          </div>
          <span v-if="textSta">开始时间不能大于结束时间，请重新选择</span>
        </div>
      </div>
      <div class="allSelect_btn">
        <div class="button_set" style="margin-top: 15px;">
          <p style="padding: 0;font-weight: bolder;width: 100px;white-space: nowrap;" class="font-title">订单状态：</p>
          <div class="btn_box" style="min-width: 600px;">
            <div class="allBtn" style="margin-left: 0;">
              <el-checkbox-group v-model="testAll" @change="getValueAll()">
                <el-checkbox v-for="(item, index) in allBtnData" :key="index" :label="item.content" :checked="item.checked" />
              </el-checkbox-group>
            </div>
            <div>
              <el-checkbox-group ref="checkData" v-model="test" @change="getValue(test)">
                <el-checkbox v-for="(item, i) in items" :key="i" :label="item.content" :disabled="item.disabled" :checked="item.checked" />
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="reset_btn">
          <el-button type="primary" size="medium" @click="search(1)">搜索</el-button>
          <el-button type="primary" size="medium" @click="reset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="tableData_main">
      <div class="action_button">
        <el-tooltip class="item" effect="dark" placement="bottom">
          <div slot="content">若通过“搜索”对订单进行筛选，<br>则导出的订单为被筛选后的数据。</div>
          <el-button size="medium" style="margin-bottom: 24px;color: #409EFF;border-color: #409EFF" @click="search(2)">导出订单</el-button>
        </el-tooltip>
        <div>
            <el-button class="item" type="primary" size="medium" @click="addOrderVisible = true">新增订单
            </el-button>
        </div>
      </div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :row-class-name="rowClassName">
        <el-table-column prop="" label="业务类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.prodName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applicantName"
          label="申请人"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applicantMobile"
          label="联系方式"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="订单提交时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="acceptSysUserName" label="承办人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.acceptSysUserName===null?'-':scope.row.acceptSysUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="订单编号"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="" label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag disable-transitions :class="tagClass(scope.row)">
              <span>{{ scope.row.orderStatus | orderState }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="orderSource" label="订单来源" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderSource | getSource }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="orderPlatformSourceName" label="订单来源" align="center">
        </el-table-column>
        <el-table-column label="支付状态" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.paymentStatus === 0 ? "未支付" : ( scope.row.paymentStatus===1?"线上支付":'线下支付')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="exit_btn"
              style="font-size: 14px"
              @click="handleEdit(scope.$index, scope.row)"
            >{{ scope.row.orderStatus | correspondingOperation }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging_box">
        <div class="paging">
          <el-pagination
            background
            :current-page.sync="currentPage3"
            :page-size="pageSize"
            layout="prev, pager, next,sizes, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 新增订单 -->
		<addOrder :visible.sync="addOrderVisible" />
  </div>
</template>

<script>
import { getDetailsList } from '../../api/details.js'
import { getInfo } from '../../api/delegate.js'
import addOrder from '../../components/entryTab/addOrder.vue'
export default {
  components:{
    addOrder,
  },
  filters: {
    businessTypeFiltration(val) {
      var str = ''
      if (val === 1) {
        str = '公证在线业务'
      } else if (val === 2) {
        str = '商标转让'
      } else if (val === 4) {
        str = '公证邮寄送达'
      } else if (val === 5) {
        str = '电子数据保管函'
      } else if (val === 6) {
        str = '遗嘱'
      } else if (val === 7) {
        str = '遗赠'
      } else if (val === 3) {
        str = '公众号迁移'
      }
      return str
    },
    // getSource(val) {
    //   var str = ''
    //   if (val === 1) {
    //     str = 'PC'
    //   } else {
    //     str = '小程序'
    //   }
    //   return str
    // },
    orderState(val) {
      var str = ''
      switch (true) {
        case val === 102:
          str = '待签署'
          return str
        case val === 104:
					str = '待拟合同'
					return str
        case val === 105:
					str = '待录制'
					return str
        case val === 201:
          str = '待审核'
          return str
        case val === 202:
          str = '需补材料'
          return str
        case val === 301:
          str = '制证中'
          return str
        case val === 302:
          str = '待邮寄'
          return str
        case val === 303:
          str = '待预约'
          return str
        case val === 304:
          str = '已邮寄'
          return str
        case val === 305:
          str = '已预约'
          return str
        case val === 306:
          str = '已完成'
          return str
        case val === 401:
          str = '拒绝受理'
          return str
        case val === 402:
          str = '已终止'
          return str
        case val === 101:
          str = '待支付'
          return str
        case val === 103:
          str = '待视频'
          return str
        case val === 1:
          str = '待提交'
          return str
        case val === 403:
          str = '已撤销'
          return str
        case val === 404:
          str = '已删除'
          return str
        default:
          return val
      }
    },
    correspondingOperation(val) {
      var str = '查看详情'
      return str
    }
  },
  data() {
    return {
      // 开始时间
      startDate: '',
      // 结束时间
      endDate: '',
      // 输入框初始值
      type_name: '请填写申请人姓名',
      // 下拉框的值的数据组
      type: [{ id: 1, name: '申请人' }, { id: 2, name: '订单编号' }, { id: 3, name: '用户手机号' }, { id: 4, name: '公证员' }, { id: 5, name: '卷宗号' }],
      proType: [{ id: 1, name: '公证在线业务' }, { id: 2, name: '商标转让' }, { id: 3, name: '微信公众号迁移' }, { id: 4, name: '邮寄送达出证' }, { id: 5, name: '电子保管函' }],
      // 输入框初始值改变的数组
      valueData: [
        { id: 1, name: '请填写申请人姓名' },
        { id: 2, name: '请填写订单编号' },
        { id: 3, name: '请填写手机号' },
        { id: 4, name: '请填写名称' },
        { id: 5, name: '请填写卷宗号' }
      ],
      // 下拉框双向绑定的值
      formInline: {
        user: '',
        region: 1,
        proCode: ''
      },
      // 输入框双向绑定的值
      name: '',
      // 按钮组双向绑定的值
      test: [],
      // 全部按钮双向绑定的值
      testAll: [],
      // 全部按钮的初始状态值
      checkedSta: true,
      // 全部按钮的数据
      allBtnData: [{ id: 7, content: '全部', disabled: false, checked: true }],
      // 按钮组的数据
      items: [
        { id: 1, content: '待提交', disabled: false, checked: false },
        { id: 2, content: '受理中', disabled: false, checked: false },
        { id: 201, content: '待审核', disabled: false, checked: false },
        { id: 202, content: '需补材料', disabled: false, checked: false },
        { id: 101, content: '待支付', disabled: false, checked: false },
        { id: 102, content: '待签署', disabled: false, checked: false },
        { id: 103, content: '待视频', disabled: false, checked: false },
        { id: 301, content: '制证中', disabled: false, checked: false },
        { id: 501, content: '认证中', disabled: false, checked: false },
        { id: 302, content: '待邮寄', disabled: false, checked: false },
        { id: 303, content: '待预约', disabled: false, checked: false },
        { id: 304, content: '已邮寄', disabled: false, checked: false },
        { id: 305, content: '已预约', disabled: false, checked: false },
        { id: 306, content: '已完成', disabled: false, checked: false },
        { id: 402, content: '已终止', disabled: false, checked: false },
        { id: 401, content: '拒绝受理', disabled: false, checked: false },
        { id: 403, content: '已撤销', disabled: false, checked: false },
        { id: 404, content: '已删除', disabled: false, checked: false },
        { id: 104, content: '待拟合同', disabled: false, checked: false },
        { id: 105, content: '待录制', disabled: false, checked: false },
      ],
      // 初始加载表格的页码
      currentPage3: 1,
      // 初始加载表格每页显示的数据
      pageSize: 10,
      // 表格数据
      tableData: [],
      loading: false,
      // 提示"时间选择不正确"文字的状态
      textSta: false,
      total: null,
      userId: '',

      // 新增订单
			addOrderVisible: false,
    }
  },
  watch: {
    // 监听下拉框选择的值来确定输入框的初始值
    'formInline.region'(newval, oldval) {
      for (let i = 0; i < this.valueData.length; i++) {
        if (newval === this.valueData[i].id) {
          this.type_name = this.valueData[i].name
        }
      }
    },
    // 监听按钮组绑定的数组,变化触发监听
    'test.length'(newval, oldval) {
      if (newval > 0) {
        this.testAll = []
      } else {
        this.testAll = ['全部']
      }
    },
    // 全部按钮绑定的值发生改变会触发的监听
    'testAll.length'(val) {
      if (val > 0) {
        this.test = []
      } else {
        if (this.test.length === 0) {
          this.testAll = ['全部']
        }
      }
    },
    startDate(val) {
      if (this.endDate !== '') {
        if (new Date(this.endDate).getTime() < new Date(val).getTime()) {
          this.textSta = true
        } else {
          this.textSta = false
        }
      } else {
        this.textSta = false
      }
    },
    endDate(val) {
      if (this.startDate !== '') {
        if (new Date(this.startDate).getTime() > new Date(val).getTime()) {
          this.textSta = true
        } else {
          this.textSta = false
        }
      } else {
        this.textSta = false
      }
    }
  },
  created() {
    // this.$fun.replaceInstrument('1352444625904529410')
    if (sessionStorage.getItem('pageSize')) {
      this.pageSize = parseInt(sessionStorage.getItem('pageSize'))
    }
    if (sessionStorage.getItem('mypageNum')) {
      this.currentPage3 = parseInt(sessionStorage.getItem('mypageNum'))
    }
    if (sessionStorage.getItem('user_id')) {
      this.userId = sessionStorage.getItem('user_id')
    }
    this.getList()
    this.getProductionList()
  },
  mounted() {
    var that = this
    // 监听浏览器是否关闭
    window.addEventListener('beforeunload', e => that.browerStatus())
  },
  destroyed() {
    var that = this
    window.removeEventListener('beforeunload', e => that.browerStatus())
  },
  methods: {
    browerStatus() {
      if (sessionStorage.getItem('mypageNum')) {
        sessionStorage.removeItem('mypageNum')
      }
    },
    rowClassName(e) {
      return e.rowIndex % 2 && 'err-row'
    },
    getProductionList() {
      this.$axios(`org/org-production-list`).then(res => {
        this.proType = res.data
      })
    },
    tagClass(e) {
      switch (true) {
        case e.orderStatus === 306:
          return 'tag-suc'
        case [401, 402].includes(e.orderStatus):
          return 'tag-err'
        case [202, 101].includes(e.orderStatus):
          return 'tag-no'
        default:
          return 'tag-war'
      }
    },
    getList() {
      var data = { pageNum: this.currentPage3, pageSize: this.pageSize, acceptSysUserId: this.userId }
      getDetailsList(data).then((res) => {
        if (res.data != null) {
          this.total = res.data.total
          this.tableData = res.data.list
        }
      })
    },
    search(e) {
      var data = {
        pageNum: this.currentPage3, pageSize: this.pageSize, applicantName: '', orderNum: '',
        phone: '', notaryName: '', dossierNum: '', startTime: this.startDate, endTime: this.endDate, orderStatusList: [], proCode: this.formInline.proCode,
        acceptSysUserId: this.userId }
      if (this.formInline.region === 1) {
        data.applicantName = this.formInline.user
      } else if (this.formInline.region === 2) {
        data.orderNum = this.formInline.user
      } else if (this.formInline.region === 3) {
        data.phone = this.formInline.user
      } else if (this.formInline.region === 4) {
        data.notaryName = this.formInline.user
      } else if (this.formInline.region === 5) {
        data.dossierNum = this.formInline.user
      }
      if (this.testAll.length === 1) {
        data.orderStatusList = []
      } else {
        for (let i = 0; i < this.items.length; i++) {
          for (let j = 0; j < this.test.length; j++) {
            if (this.test[j] === this.items[i].content) {
              data.orderStatusList.push(this.items[i].id)
            }
          }
        }
      }
      if (e === 2) {
        this.down(data)
      } else {
        getDetailsList(data).then((res) => {
          this.total = res.data.total
          this.tableData = res.data.list
        })
      }
      // var data={pageNum:this.currentPage3,pageSize: this.pageSize,applicantName:}
    },
    // 导出订单
    down(data) {
      delete data.pageNum
      delete data.pageSize
      data.isTest = 0
      data.orgId = sessionStorage.getItem('org_id')
      this.$axios('org/download-order-excel', data, { method: 'POST', responseType: 'blob' }).then(blob => {
        this.$fun.blobFile(blob, '订单列表.xls')
      })
    },
    // 选择开始时间触发的事件
    getSStartTime(val) {},
    // 选择结束时间后触发的事件
    getSEndTime(val) {},
    // 点击多选按钮组触发的事件
    getValue(val) {
      this.currentPage3 = 1
      if (sessionStorage.getItem('mypageNum')) {
        sessionStorage.removeItem('mypageNum')
      }
      if (val.length > 0) {
        var cheData = []
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.items.length; j++) {
            if (val[i] === this.items[j].content) {
              cheData.push(this.items[j].id)
            }
          }
        }
        var data = {
          pageNum: this.currentPage3,
          pageSize: this.pageSize,
          applicantName: '',
          orderNum: '',
          phone: '',
          notaryName: '',
          startTime: this.startDate,
          endTime: this.endDate,
          orderStatusList: cheData,
          acceptSysUserId: this.userId
        }
        getDetailsList(data).then((res) => {
          this.total = res.data.total
          this.tableData = res.data.list
        })
      } else {
        getDetailsList({
          pageNum: this.currentPage3,
          pageSize: this.pageSize
        }).then((res) => {
          this.total = res.data.total
          this.tableData = res.data.list
        })
      }
    },
    // 点击全部按钮触发的事件
    getValueAll() {
      getDetailsList({
        pageNum: this.currentPage3,
        pageSize: this.pageSize,
        acceptSysUserId: this.userId
      }).then((res) => {
        this.total = res.data.total
        this.tableData = res.data.list
      })
    },
    // 点击表格中的按钮跳转对应的详情页
    handleEdit(index, row) {
      sessionStorage.removeItem('tabActiveName')
      getInfo({ orderId: row.id }).then(res => {
        if (res.success) {
          if (row.prodCode === '1001' || row.prodCode === 'shjrqypt') {
            this.$router.push({
              name: 'delegateInfo',
              query: { id: row.id }
            })
          } else {
            if (row.businessType === 4 || row.businessType === 5 || row.businessType === 6 || row.businessType === 7 || row.businessType === 11 || row.prodCode === 'ysf') {
              this.$router.push({
                name: 'entryDetailsOrder',
                query: {
                  orderId: row.id
                  // orderNum: row.orderNum,
                  // bidType: row.bidType,
                  // prodCode: row.prodCode,
                }
              })
            } else {
              // console.log('0000000000000000')
              this.$router.push({
                name: 'detailsOrder',
                query: {
                  orderId: row.id,
                  orderNum: row.orderNum,
                  bidType: row.bidType,
                  prodCode: row.prodCode
                }
              })
            }
          }
        } else if (res.code === 20006) {
          this.$alert('您不是该订单的承办人，无法查看订单', '提示', { confirmButtonText: '确定' })
        }
      })
    },
    // 设置每一页表格显示多少数据的事件
    handleSizeChange(val) {
      sessionStorage.setItem('pageSize', val)
      this.pageSize = val
      this.search()
    },
    // 点击跳转上一页下一页的事件
    handleCurrentChange(val) {
      sessionStorage.setItem('mypageNum', this.currentPage3)
      this.search()
    },
    reset() {
      this.test = []
      this.testAll = ['全部']
      this.startDate = ''
      this.endDate = ''
      this.formInline.region = 1
      this.formInline.proCode = ''
      this.getList()
      this.formInline.user = ''
    }
  }
}
</script>

<style lang="less" scoped>
// /deep/ input,/deep/ .el-checkbox__inner{
//   border: solid #111 1px !important;
// }
.font-title {
  font-size: 14px !important;
  color: #666 !important;
  font-weight: bold;
}
p {
  margin: 0;
}
/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
  background-color: #eee;
}
/deep/ .el-table--border,
/deep/ .el-table--group {
  border-color: #eee;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
  border-bottom: 1px solid #eee;
}
/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid red;
}
/deep/ .el-table--border td,
/deep/ .el-table--border th {
  border-right: none;
}
.box_flex_row {
  display: flex;
  flex-flow: row;
}
.list_back {
  background: #fff;
  padding: 0 20px 20px 20px;
}
.box_flex_column {
  display: flex;
  flex-flow: column;
}
.font_title_color {
  color: #333;
  // font-size: 16px;
}
/deep/ .el-pagination__jump {
  margin-left: 0;
}
/deep/ .el-input__prefix {
  width: 30px;
  position: absolute;
  left: 85% !important;
  z-index: 99;
}
/deep/ .el-date-editor--datetime input {
  padding-left: 10px;
}
/deep/.el-date-editor--datetime .el-input__suffix-inner > i::before {
  width: 25px;
  position: absolute;
  right: 80% !important;
}
.el-date-editor.el-input {
  width: 200px;
  font-size: 10px;
}
/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
  background-color: #eee;
}
/deep/ .el-table--border,
/deep/ .el-table--group {
  border-color: #eee;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
  border-bottom: 1px solid #eee;
}
/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid red;
}
/deep/ .el-table--border td,
/deep/ .el-table--border th {
  border-right: none;
}
.business_main {
  background: #f7f7f7;
  padding: 20px;
  min-height: calc(100vh - 50px);
  .box_flex_column;
  .category_to_retrieve {
    .box_flex_row;
    .list_back;
    .select_type {
      background: #fff;
      width: 200px;
      text-align: center;
      position: relative;
      margin-right: 30px;
      & > .el-select{
       /deep/  & > .el-input{
/deep/ .el-input__inner{
  color: #333;
}
        }
      }
      & > p {
        padding: 5px 0;
        .font_title_color;
      }
      .select_type_data {
        position: absolute;
        bottom: 0;
        top: 30px;
        z-index: 9;
      }
      /deep/ input {
        color: #333;
      }
    }
    .search_btn {
      margin-left: 30px;
      button {
        width: 100px;
      }
    }
  }
  .category_title {
    & > p {
      background-color: #fff;
      padding: 20px;
      padding-bottom: 10px;
    }
  }
  .select_date {
    .list_back;
    position: relative;
    & > span {
      position: absolute;
      bottom: 0px;
      z-index: 100;
      font-size: 12px;
      color: red;
    }
    .date_section {
      margin: 0 5px;
    }
  }
  & p {
    .font_title_color;
    padding-bottom: 10px;
  }
  .allSelect_btn {
    padding-bottom: 20px;
    border-bottom: solid #eee 1px;
    .list_back;
    .box_flex_row;
    // border-bottom: solid 1px #d7d7d7;
    padding-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    .button_set,
    & .btn_box {
      .box_flex_row;
      .allBtn {
        margin: 0 0 0 30px;
        .el-checkbox-group {
          width: 90px;
        }
      }
      & label,
      & .el-checkbox-group {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .el-checkbox {
          margin-bottom: 10px;
          margin-right: 35px;
        }
      }
      & /deep/ span {
        font-size: 14px;
      }
    }
    .reset_btn {
      padding-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      & button {
        width: 70px;
        padding: 0;
        text-align: center;
        line-height: 32px;
      }
    }
  }
  .tableData_main {
    // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .list_back;
    padding-top: 30px;
    flex: 1;
    & /deep/ .el-table td {
      padding: 8px 0;
    }
    .paging_box {
      text-align: center;
      padding: 24px 0 4px 0;
      .box_flex_row;
      justify-content: center;
      align-items: center;
      & /deep/ .el-pager li {
        margin-left: 10px;
      }
      & /deep/ .btn-next {
        margin-left: 10px;
      }
    }
    .exit_btn {
      .span {
        font-size: 10px;
      }
    }
  }
}
.action_button {
	display: flex;
	justify-content: space-between;
}
</style>

<style>
.el-table .err-row{
  background: #f9f9f9;
}

.el-tag.tag-suc {
  background-color: #F0F9EA;
  border: 1px solid #C2E7B0;
  color: #67C239;
}

.el-tag.tag-err {
  background-color: #FEF0F0;
  border: 1px solid #FBC4C4;
  color: #F56C6C;
}

.el-tag.tag-no {
  background-color: #F4F4F5;
  border: 1px solid #999;
  color: #999;
}

.el-tag.tag-war {
  background-color: #FFFBF5;
  border: 1px solid #ED6732;
  color: #ED6732;
}
</style>
