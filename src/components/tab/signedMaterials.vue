<template>
  <div class="signed_main" style="position: relative;">
    <div class="materials_list">
      <el-table :data="data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="originalFilename" label="文件名" :render-header="renderHeader" />
        <el-table-column>
          <template slot-scope="scope">
            <span class="handle" @click="download(scope.row)"><i class="el-icon-download" />下载</span>
            <span class="handle" @click="preview(scope.row)"><i class="el-icon-view" />预览</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSignedInfo, getFileImg } from '../../api/details.js'
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    orderNum: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderId: null,
      multipleSelection: [],
      data: []
    }
  },
  mounted() {
    this.orderId = this.$route.query.orderId
    var data = { orderId: this.orderId }
    getSignedInfo(data).then((res) => {
      console.log(res, '已签署材料数据')
      this.data = res.data
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    renderHeader(h, { column }) {
      return h('span', [
        h('span', column.label),
        h('el-button', {
          on: {
            click: this.exportExcel
          },
          attrs: {
            size: 'mini',
            type: 'primary',
            style: 'margin-left: 20px;'
          }
        }, '下载')
      ])
    },

    async getImg(id, type) {
      const url =
        type == 1
          ? `org/order-document-preview-img/${id}`
          : `org/order-proposer-material-preview-img?id=${id}`
      return await this.$axios(url).then(async res => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data
        }
      })
    },

    preview(e) {
      var data = { id: e.id }
      getFileImg(data).then(async(res) => {
        // console.log(res)
        const list = res.data.data.ids
        for (const i in list) {
          const imgUrl = await this.getImg(list[i], 1)
          list[i] = imgUrl
        }
        // console.log(res.data.data.ids)
        this.$store.commit('app/CHANGE_IMAGE', list)
      })
    },
    download(e) {
      console.log(e)
      const fileName = JSON.parse(e.beforeSignFile).originalFilename
      var downloadType = 1
      this.$axios('org/download-material', { orderId: this.$route.query.orderId, documentId: e.id, downloadType }, { responseType: 'blob' }).then(blob => {
        this.$fun.blobFile(blob, fileName)
      })
    },
    exportExcel() {
      var downloadType = 1
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要下载的文件',
          type: 'warning'
        })
      } else {
        var allDocument = ''
        for (let i = 0; i < this.multipleSelection.length; i++) {
          allDocument += this.multipleSelection[i].id + ','
        }
        allDocument = allDocument.substring(0, allDocument.length - 1)
        this.$axios('org/download-material', { orderId: this.$route.query.orderId, documentId: allDocument, downloadType }, { responseType: 'blob' }).then(blob => {
          this.$fun.blobFile(blob, `${this.orderNum}-已签署文件-${this.name}.zip`)
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
body .el-table th.gutter {
  display: table-cell !important;
}
.handle{
  margin: 0 10px;
  cursor: pointer;
}
.handle:hover{
  color: #409EFF;
}
</style>
