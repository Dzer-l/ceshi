<template>
  <div>
    <div class="btn">
      <!-- <el-button type="primary" size="medium">提取证据</el-button> -->
    </div>
    <div class="document-material-table">
      <el-table
        :data="documentMaterialTableData"
        border
        style="width: 100%"
        :expand-row-keys="expends"
        :row-key="getRowKeys"
        :header-cell-style="{ color: '#333', background: '#e6f6fe' }"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="display: flex">
              <ul style="width:90%">
                <li
                  v-for="(item, index) in props.row.orderEvidFileDTOList"
                  :key="index"
                  class="info-list"
                  style="color:#409eff"
                >
                  {{ item.fileName }}
                </li>
              </ul>
              <div><el-button type="text" style="padding:0" @click="packUp">收起</el-button></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="evidName" label="证据名称" show-overflow-tooltip />
        <el-table-column prop="evidNo" label="证据编号" align="center" show-overflow-tooltip />
        <el-table-column prop="storageNo" label="保管编号" show-overflow-tooltip />
        <el-table-column prop="evidType" label="证据类型" show-overflow-tooltip />
        <el-table-column prop="obtainTime" label="取证时间" show-overflow-tooltip />
        <el-table-column prop="storageTime" label="存证时间" show-overflow-tooltip />
        <el-table-column prop="" label="操作" width="200">
          <template slot-scope="scope">
            <span>
              <el-button type="text" @click="openTheDetailsBombBox((scope.row))">详情</el-button>
              <el-button type="text" :disabled="jurisdiction" @click="extractingEvidence(scope.row)">提取证据</el-button>
              <el-button type="text" @click="fun(scope.row)">展开</el-button>
            </span>
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
    <div class="info-dialog">
      <el-dialog
        title="证据文件详情"
        :visible.sync="dialogVisible"
        width="1200px"
        top="5vh"
        :close-on-click-modal="false"
      >
        <div>
          <evidenceDocumentDetails v-if="dialogVisible" :data="infoData" :evid-id="evidId" @staChange="staChange" /></div>
        <div class="inner-layer-pop-up-layer">
          <el-dialog width="40%" title="提取证据" :visible.sync="innerVisible" :close-on-click-modal="false" custom-class="inner-layer-pop-up-layer" append-to-body>
            <fileCheck v-if="innerVisible" :mater-list="materList" :evid-id="evidId" @statusChange="statusChange" />
            <span slot="footer" class="dialog-footer">
              <el-button v-if="status!==2" @click="innerVisible = false">取 消</el-button>
              <el-button v-if="status===2" type="primary" @click="innerVisible = false">好 的</el-button>
              <el-button v-if="status===1" type="primary" @click="extractionImmediately(1)">立即提取</el-button>
            </span>
          </el-dialog>
        </div>
      </el-dialog>
    </div>
    <el-dialog width="40%" title="提取证据" :visible.sync="extractionEvidence" custom-class="inner-layer-pop-up-layer" :close-on-click-modal="false">
      <div class="file-check-assembly"><fileCheck v-if="extractionEvidence" :mater-list="materList" :evid-id="evidId" @statusChange="statusChange" /></div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="status!==2" @click="extractionEvidence = false">取 消</el-button>
        <el-button v-if="status===1" type="primary" @click="extractionImmediately(2)">立即提取</el-button>
        <el-button v-if="status===2" type="primary" @click="extractionEvidence = false">好 的</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFileList, downloadEntry } from '../../api/cloudMail'
import evidenceDocumentDetails from './evidenceDocumentDetails'
import fileCheck from './fileCheck'
export default {
  components: {
    evidenceDocumentDetails,
    fileCheck
  },
  data() {
    return {
      documentMaterialTableData: [],
      currentPage3: 1,
      pageSize: 10,
      total: 0,
      expends: [],
      order: '',
      jurisdiction: false,
      dialogVisible: false,
      innerVisible: false,
      extractionEvidence: false,
      infoData: { },
      evidId: '',
      materList: [],
      status: 0,
      evidNo: ''
    }
  },
  watch: {
    expends: {
      handler: function(val) {
      }
    },
    status: {
      handler: function(val) {
      }
    },
    extractionEvidence: {
      handler: function(val) {
        if (!val) {
          this.status = 0
        }
      }
    },
    innerVisible: {
      handler: function(val) {
        if (!val) {
          this.status = 0
        }
      }
    }
  },
  created() {
    this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
    } else {
      this.orderId = this.$store.state.app.orderId
      var url = `/#${this.$route.path}?orderId=${this.orderId}`
      history.pushState(null, null, url)
    }
    this.getList()
  },
  methods: {
    staChange(val) {
      this.innerVisible = val
    },
    statusChange(val) {
      this.status = val
    },
    getList() {
      var data = {
        orderId: this.orderId,
        pageNum: this.currentPage3,
        pageSize: this.pageSize
      }
      getFileList(data).then((res) => {
        if (res.success) {
          this.total = res.data.total
          for (let index = 0; index < res.data.list.length; index++) {
            for (
              let i = 0;
              i < res.data.list[index].orderEvidFileDTOList.length;
              i++
            ) {
              res.data.list[index].orderEvidFileDTOList[
                i
              ].fileBucket = JSON.parse(
                res.data.list[index].orderEvidFileDTOList[i].fileBucket
              )
            }
          }
          this.documentMaterialTableData = res.data.list
        }
      })
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    getExpends() {
      var Id = this.documentMaterialTableData.map((item) => item.id)
      this.expends = Id
    },
    getRowKeys(row) {
      return row.id
    },
    fun(val) {
      if (this.expends.length === 0) {
        this.expends = []
        this.expends.push(val.id)
      } else {
        this.expends = []
      }
    },
    packUp() {
      this.expends = []
    },
    extractionImmediately(val) {
      var time = new Date()
      downloadEntry({ evidId: this.evidId, fileType: 3 }).then((res) => {
        this.saveAs(
          res,
          `${this.evidNo}${this.getTime(time)}.zip`
        )
        val === 1 ? this.innerVisible = false : this.extractionEvidence = false
      })
    },
    extractingEvidence(val) {
      this.$axios(`org/mailOrder-evid-details/${val.evidId}`).then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.mailEvidMaterialDTOS.length; i++) {
            res.data.mailEvidMaterialDTOS[i].materialBucket = JSON.parse(res.data.mailEvidMaterialDTOS[i].materialBucket)
            res.data.mailEvidMaterialDTOS[i].fileBucket = res.data.mailEvidMaterialDTOS[i].materialBucket
          }
          this.evidNo = val.evidNo
          this.materList = res.data.mailEvidMaterialDTOS
          this.infoData = res.data
          this.evidId = val.evidId// val.evidId
          this.extractionEvidence = true
        }
      })
      // this.evidNo = val.evidNo
      // this.materList = val.orderEvidFileDTOList !== null ? val.orderEvidFileDTOList : []
      // this.evidId = val.evidId// '1371379304229560322'
      // this.extractionEvidence = true
      // var time = new Date()
      // console.log(this.getTime(time))
      // downloadEntryFile({
      //   orderId: this.orderId,
      //   orderEvidReIdArray: val.id
      // }).then((res) => {
      //   console.log(res, '00000')
      //   this.saveAs(res, `${val.evidName}.zip`)
      // })
    },
    getTime(val) {
      var date = new Date(val)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + MM + d + h + m + s
    },
    // 使用axios发起请求的下载
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
    },
    openTheDetailsBombBox(val) {
      this.$axios(`org/mailOrder-evid-details/${val.evidId}`).then(res => {
        if (res.success) {
          for (let i = 0; i < res.data.mailEvidMaterialDTOS.length; i++) {
            res.data.mailEvidMaterialDTOS[i].materialBucket = JSON.parse(res.data.mailEvidMaterialDTOS[i].materialBucket)
            res.data.mailEvidMaterialDTOS[i].fileBucket = res.data.mailEvidMaterialDTOS[i].materialBucket
          }
          this.evidNo = val.evidNo
          this.materList = res.data.mailEvidMaterialDTOS
          this.infoData = res.data
          this.evidId = val.evidId// val.evidId
          this.dialogVisible = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.document-material-table{
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
}

.paging_box {
  text-align: center;
  padding: 24px 0 4px 0;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  & /deep/ .el-pager li {
    margin-left: 10px;
  }
  & /deep/ .btn-next {
    margin-left: 10px;
  }
  /deep/ .el-pagination__jump {
    margin-left: 0;
  }
}
.btn {
  display: flex;
  justify-content: flex-end;
  padding: 5px 0 20px 0;
}
/deep/ .el-table__expanded-cell {
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    padding-left: 50px;
    li {
      list-style: none;
      width: 30%;
      padding-left: 30px;
      color: #999;
    }
  }
}
/deep/ .el-dialog__body{
  background: #f5f5f5;
  padding: 20px;
}
.file-check-assembly{
  width: 100%;
}
</style>

<style>
.inner-layer-pop-up-layer>.el-dialog__body{
  background: #fff !important;
  border-top: solid 1px #ddd;
  border-bottom: solid 1px #ddd;
}
</style>
