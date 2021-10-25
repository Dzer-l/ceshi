<template>
  <div class="main-box">
    <div
      class="list-box"
      style="background: #fff"
    >
      <div class="list-top">
        <span>姓名：</span>
        <el-input
          v-model="search.userName"
          placeholder="请输入姓名信息"
        />
        <span>业务类型：</span>
        <el-select
          v-model="search.appointmentType"
          placeholder="请选择业务类型"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span>订单提交时间：</span>
        <div class="time-block">
          <div>
            <el-date-picker v-model="search.startTime" value-format="yyyy-MM-dd" type="date" size="small" prefix-icon="el-icon-date" placeholder="开始日期" />
            <span class="date_section" />
            <el-date-picker v-model="search.endTime" value-format="yyyy-MM-dd" type="date" size="small" prefix-icon="el-icon-date" placeholder="结束日期" />
          </div>
          <p v-if="textSta">开始时间不能大于结束时间，请重新选择</p>
        </div>
      </div>
      <div style="line-height: 60px;font-size: 20px;font-family: Source Han Sans CN;">订单状态：</div>
      <div class="list-select">
        <div>
          <div style="display: flex">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              style="margin-right: 40px"
              @change="handleCheckAllChange"
            >全部</el-checkbox>
            <el-checkbox-group
              ref="checkData"
              v-model="appointmentStatus"
              @change="getValue(appointmentStatus)"
            >
              <el-checkbox
                v-for="(item, i) in selectItems"
                :key="i"
                :label="item.content"
                :v-model="item.id"
                :disabled="item.disabled"
                :checked="item.checked"
              />
            </el-checkbox-group>
          </div>
        </div>
        <div>
          <el-button
            style="border-color: #409EFF; color: #409EFF;"
            @click="onClick_reset"
          >重置</el-button>
          <el-button
            type="primary"
            @click="getLoanList"
          >搜索</el-button>
        </div>
      </div>
      <div class="out-btn">
        <el-button
          style="border-color: #409EFF; color: #409EFF;"
          @click="downFile"
        >导出订单</el-button>
      </div>
      <el-table
        ref="loanTable"
        :data="orderList"
        style="width: 100%"
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        @selection-change="tableChange"
      >
        <el-table-column
          type="selection"
          width="55"
          label=""
        />
        <el-table-column
          prop="appointmentType"
          label="业务类型"
          min-width="100"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.appointmentType == 1 ? '购房' : scope.row.appointmentType == 2 ? '卖房' : scope.row.appointmentType == 3 ? '赎楼' : '公证安心贷' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          min-width="120"
        />
        <el-table-column
          prop="userMobile"
          label="联系方式"
          min-width="120"
        />
        <el-table-column
          prop="createTime"
          label="提交时间"
          min-width="160"
        />
        <el-table-column
          prop="acceptSysUserName"
          label="承办人"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.acceptSysUserName ? scope.row.acceptSysUserName : '未分配' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="appointmentNum"
          label="预约编号"
          min-width="130"
        />
        <el-table-column
          prop="appointmentStatus"
          label="预约状态"
          min-width="120"
        >
          <template slot-scope="scope">
            <span :style="{ color: !scope.row.appointmentStatus ? '#FF8800' : '#67C239' }">{{ !scope.row.appointmentStatus ? '待联系' : '已联系' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="appointmentSource"
          label="预约来源"
          min-width="110"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.appointmentSource == 1 ? '微信公众号' : 'i深圳' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="businessType"
          label="操作"
          min-width="180"
        >
          <template slot-scope="scope">
            <span
              class="table-btn"
              @click="onClikc_toInfo(scope.row)"
            >查看详情</span>
            <span
              v-if="!scope.row.appointmentStatus"
              class="table-btn"
              style="margin-left: 24px"
              @click="linkMan(scope.row)"
            >已联系</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: center">
        <el-pagination
          background
          center
          :page-sizes="[10, 30, 40, 50,100]"
          :page-size="search.pageSize"
          layout="prev, pager, next,sizes, jumper"
          :current-page.sync="search.pageNum"
          :total="total"
          @current-change="changePage"
          @size-change="toPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { value: 1, label: '购房' },
        { value: 2, label: '卖房' },
        { value: 3, label: '赎楼' },
        { value: 4, label: '公证安心贷' }
      ],
      search: {
        appointmentType: '',
        userName: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        appointmentStatus: '',
        pageSize: 10
      },
      total: 10,
      appointmentStatus: [],
      isIndeterminate: false,
      checkAll: true,
      selectItems: [
        { id: 201, content: '待联系', disabled: false, checked: false },
        { id: 202, content: '已联系', disabled: false, checked: false }
      ],
      orderList: [],
      textSta: false,
      downList: []
    }
  },
  watch: {
    'search.startTime'(val) {
      if (this.search.endTime) {
        if (new Date(val).getTime() < new Date(this.search.endTime).getTime()) {
          this.textSta = false
        } else {
          this.textSta = true
        }
      } else {
        this.textSta = false
      }
    },
    'search.endTime'(val) {
      if (this.search.endTime) {
        if (new Date(this.search.startTime).getTime() < new Date(val).getTime()) {
          this.textSta = false
        } else {
          this.textSta = true
        }
      } else {
        this.textSta = false
      }
    }
  },
  created() {
    const page = this.$route.query.page
    page ? (this.search.pageNum = parseInt(page)) : null
    this.getLoanList()
  },
  methods: {
    getLoanList() {
      const list = this.appointmentStatus
      if (list.length === 2) {
        this.search.appointmentStatus = ''
      } else {
        if (list.indexOf('待联系') !== -1) {
          this.search.appointmentStatus = 0
        } else if (list.indexOf('已联系') !== -1) {
          this.search.appointmentStatus = 1
        } else {
          this.search.appointmentStatus = ''
        }
      }
      if (this.textSta) { return }
      this.$axios('org/appointment-order-list', this.search, { method: 'POST' }).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.orderList = res.data.list
        }
      })
    },
    onClick_reset(e) {
      this.search.appointmentType = ''
      this.search.userName = ''
      this.search.startTime = ''
      this.search.endTime = ''
      this.search.appointmentStatus = ''
      this.checkAll = true
      this.appointmentStatus = []
      this.getLoanList()
    },
    handleCheckAllChange(val) {
      const list = []
      if (!val) {
        this.checkAll = true
      }
      this.appointmentStatus = list
      this.isIndeterminate = false
      this.getLoanList()
    },
    getValue(e) {
      const checkedCount = e.length
      this.checkAll = checkedCount === 0
      this.isIndeterminate = false
      this.getLoanList()
    },
    tableChange(e) {
      this.downList = []
      for (const i of e) {
        this.downList.push(i.id)
      }
    },
    changePage(e) {
      this.search.pageNum = parseInt(e)
      var url = `/#${this.$route.path}?page=${e}`
      history.pushState(null, null, url)
      this.getLoanList()
    },
    linkMan(e) {
      console.log(e)
      this.$axios('org/update-appointment-status', { id: e.id, appointmentStatus: 1 }, { method: 'PUT' }).then(res => {
        console.log(res)
        if (res.success) {
          this.getLoanList()
        }
      })
    },
    toPage(e) {
      this.search.pageSize = e
      this.getLoanList()
    },
    onClikc_toInfo(e) {
      this.$router.push({
        name: 'loanApptInfo',
        query: {
          id: e.id,
          type: e.appointmentType
        }
      })
    },
    downFile() {
      let list = []
      if (this.downList.length === 0) {
        for (const i of this.orderList) {
          list.push(i.id)
        }
      } else {
        list = this.downList
      }
      this.$axios('org/download-appointment-order', list, { method: 'POST', responseType: 'blob' }).then(blob => {
        this.saveAs(blob, '公证房产交易服务数据表.xls')
      })
    },
    saveAs(blob, fileName) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
      } else {
        const link = document.createElement('a')
        const body = document.querySelector('body')

        link.href = window.URL.createObjectURL(blob) // 创建对象url
        link.download = fileName

        // fix Firefox
        link.style.display = 'none'
        body.appendChild(link)

        link.click()
        body.removeChild(link)

        window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
      }
    }
  }
}
</script>

<style lang="less" scoped>
    .main-box {
        width: 100%;
        padding: 20px 20px;
        box-sizing: border-box;
        min-height: calc(100vh - 50px);
        background-color: #f5f5f5;
    }
    .time-block{
      position: relative;
      div{
        display: flex;
        align-items: center;
      }
      p{
        margin: 0;
        font-size: 12px;
        color: red;
        margin-top: 5px;
        position: absolute;
        left: 0;
      }
    }
    .list-box{
        padding: 0 50px 0;
        box-sizing: border-box;
    }
    .list-top{
        height: 96px;
        display: flex;
        align-items: center;
        .el-input,.el-select{
            width: 270px;
            margin-right: 40px;
            height: 36px;
        }
        & > span{
            margin-right: 16px;
            font-size: 14px;
            white-space:nowrap;
        }
        .el-date-editor.el-input{
            width: 150px;
            margin: 0
        }
        div span{
            display: block;
            width: 12px;
            height: 1px;
            background: #707070;
            margin: 0 4px;
        }
        /deep/ input.el-input__inner{
            height: 36px !important;
        }
        /deep/ .el-input__suffix{
            top: 2px;
        }
    }
    .list-select{
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .el-button{
        height: 36px;
        width: 98px;
        line-height: 36px;
        text-align: center;
        padding: 0;
        box-sizing: border-box;
    }
    .out-btn{
        padding: 30px 0 24px;
        border-top: 1px solid #EEEEEE;
        margin-top: 24px;
    }
    .el-pagination{
        padding: 24px 0 40px;
        display: inline-block;
    }

.table-btn {
  cursor: pointer;
  color: #409eff;
}
</style>
