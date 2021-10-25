<template>
  <div class="signed_main" style="position: relative;">
    <div class="materials_list">
      <el-table :data="data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="originFileName" label="文件名" :render-header="renderHeader" />
        <el-table-column>
          <template slot-scope="scope">
            <span class="handle" @click="download(scope.row)"><i class="el-icon-download" />下载</span>
            <span class="handle" @click="preview(scope.row)"><i class="el-icon-view" />预览</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div>
        <div align="left">
               <el-checkbox v-model="checked" @change="checkedAll"/> 全选/反选
        </div>
        <el-tree
        ref="vuetree"
          :data="datas"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          @check="nodeClick">
        </el-tree>

      </div> -->
    </div>
  </div>
</template>

<script>
import { getMaterialList, previewMaterials, getMateriaProposerlList } from '../../api/details.js'
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
      checked: false,
      orderId: null,
      multipleSelection: [],
      data: [],
      datas: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      select_box: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    console.log(this.name)
    this.orderId = this.$route.query.orderId
    var data = { orderId: this.orderId }
    getMaterialList(data).then((res) => {
      console.log(res, '材料信息数据')
      this.data = res.data
    })
  },
  methods: {
    nodeClick(data, node, e) {
      // 点击的时候获取到所有选中的
      // console.log(this.$refs.tree.getCheckedNodes(), ‘console.log(this.$refs.tree.getCheckedNodes());‘);
      const select_box = []
      this.$refs.vuetree.getCheckedNodes().forEach((item) => {
        select_box.push(item.id)
      })
      this.select_box = select_box
      // console.log(this.select_box, '‘select_box‘');
    },
    checkedAll() {
      if (this.checked) {
        // 全选
        this.$refs.vuetree.setCheckedNodes(this.datas)
      } else {
        // 取消选中
        this.$refs.vuetree.setCheckedKeys([])
      }
    },

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
          : `org/order-proposer-material-preview-word-img/${id}`
      return await this.$axios(url).then(async res => {
        if (res.success) {
          // console.log(res, '0000')
          return 'data:image/png;base64,' + res.data
        }
      })
    },

    preview(e) {
      var data = { id: e.id }

      var suffixal = e.originFileName.match(/^(.*)(\.)(.{1,8})$/)[3]
      var conversion = suffixal.toUpperCase()

      if (conversion === 'PNG' || conversion === 'JPG') {
        console.log(conversion)
        previewMaterials(data).then((res) => {
          var imgList = []
          // console.log(res)
          imgList.push('data:image/png;base64,' + res.data)
          // console.log(imgList)
          this.$store.commit('app/CHANGE_IMAGE', imgList)
        })
      } else {
        getMateriaProposerlList(data).then(async(res) => {
          console.log(res)
          const list = res.data.data.ids
          for (const i in list) {
            const imgUrl = await this.getImg(list[i], 2)
            list[i] = imgUrl
          }
          console.log(list)
          this.$store.commit('app/CHANGE_IMAGE', list)
        })
      }
    },
    download(e) {
      console.log(e)
      const fileName = JSON.parse(e.materialFile).originalFilename
      var downloadType = 2
      this.$axios('org/download-material', { orderId: this.$route.query.orderId, documentId: e.id, downloadType }, { responseType: 'blob' }).then(blob => {
        this.$fun.blobFile(blob, fileName)
      })
    },
    exportExcel() {
      var downloadType = 2
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
          this.$fun.blobFile(blob, `${this.orderNum}-材料信息-${this.name}.zip`)
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
