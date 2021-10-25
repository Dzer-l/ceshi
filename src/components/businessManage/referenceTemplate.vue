<template>
  <div v-loading.fullscreen.lock="fullscreenLoading" class="referenceTemplate-main">
    <div class="condition-search">
      <el-form label-position="left" label-width="50px" :model="formLabelAlign">
        <el-form-item label="名称">
          <el-input v-model="formLabelAlign.fileName" size="medium" style="width:300px" />
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" size="medium" @click="fileNameSearch">搜索</el-button>
        <el-button size="medium" @click="fileNameReset">重置</el-button>
      </div>
    </div>
    <div class="table-main">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column
          prop="originalFilename"
          label="文件名"
        />
        <el-table-column
          prop="name"
          :render-header="renderHeader"
        >
          <template slot-scope="scope">
            <el-button type="text" class="button-group" @click="previewFile(scope.row)">预览</el-button>
            <el-button type="text" class="button-group" @click="deleteFiles(scope.row)">删除</el-button>
            <el-button type="text" class="button-group" @click="downloadFile(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <div class="upload-main">
        <div class="upload-btn">
          <div style="padding-top:10px;padding-right:20px">文件上传</div>
          <el-upload
            ref="upload"
            class="upload-demo"
            action
            multiple
            :show-file-list="false"
            :http-request="upLoadFile"
            accept=".doc,.docx"
          >
            <el-button><i class="el-icon-top" />上传文件</el-button>
            <div slot="tip" class="el-upload__tip">提示：请上传doc，docx格式文件</div>
          </el-upload>
        </div>
        <div style="margin-left:76px" class="file-name-list-show">
          <span v-for="(item,index) in fileArr" :key="index">{{ item.name }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadeConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formLabelAlign: {
        fileName: ''
      },
      prodCode: '',
      dialogVisible: false,
      tableData: [],
      fileArr: [],
      multipleSelection: [],
      pageSize: 10,
      pageNum: 1,
      fullscreenLoading: false
    }
  },
  created() {
    this.prodCode = this.$route.query.productionCode
    const data = { pageNum: 1, pageSize: 10, prodCode: this.prodCode }
    this.getList(data)
  },
  methods: {
    // 获取模板数据
    getList(data) {
      this.$axios('org/org-production-reference-template/page', data).then(res => {
        console.log(res)
        this.tableData = res.data.list
      })
    },
    // 表头插入按钮
    renderHeader(h, { column }) {
      return (
        <div>
          <el-button size='medium' type='primary' on-click={() => this.exportExcel()}>上传文件</el-button>
          <el-button size='medium' type='primary' on-click={() => this.multipleDeletion()}>删除</el-button>
          <el-button size='medium' type='primary' on-click={() => this.multipleDownloads()}>下载</el-button>
        </div>
      )
    },
    // 根据文件名搜索模板
    fileNameSearch() {
      const data = { pageNum: this.pageNum, pageSize: this.pageSize, prodCode: this.prodCode, originalFilename: this.formLabelAlign.fileName }
      this.getList(data)
    },
    fileNameReset() {
      this.pageNum = 1
      this.pageSize = 10
      this.formLabelAlign.fileName = ''
      const data = { pageNum: this.pageNum, pageSize: this.pageSize, prodCode: this.prodCode, originalFilename: this.formLabelAlign.fileName }
      this.getList(data)
    },
    // 多选表格数据
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击上传按钮
    exportExcel() {
      this.dialogVisible = true
    },
    // 点击表头删除按钮
    multipleDeletion() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选要删除的文件')
        return false
      }
      const arr = this.multipleSelection.map((item) => {
        return item.id
      })
      this.$axios('org/org-production-reference-template/batch-delete', arr, { method: 'PUT' }).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({ type: 'success', message: '删除成功' })
          const data = { pageNum: this.pageNum, pageSize: this.pageSize, prodCode: this.prodCode, originalFilename: this.formLabelAlign.fileName }
          this.getList(data)
        }
      })
    },
    // 点击表头下载按钮
    multipleDownloads() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请勾选要下载的文件')
        return false
      }
      const arr = this.multipleSelection.map((item) => {
        return item.id
      })
      this.$axios('org/org-production-reference-template/batch-download', arr, { method: 'PUT', responseType: 'blob' }).then(res => {
        console.log(res)
        const fileName = this.multipleSelection.length === 1 ? this.multipleSelection[0].originalFilename : '参考模板'
        this.$fun.blobFile(res, fileName)
      })
    },
    // 选择文件之后
    async upLoadFile(e) {
      console.log(e)
      if (this.getFileType(e.file.name) !== 'word') {
        this.$fun.msg('请上传doc、docx格式的文件!', 'error')
        return false
      }
      this.fileArr.push(e.file)
    },
    // 预览模板
    previewFile(e) {
      this.fullscreenLoading = true
      // console.log(e)
      this.$axios(`org/org-production-reference-template-preview`, { orgProductionReferenceTemplateId: e.id }).then(async res => {
        // const file = await this.getImg(res.data.data.ids[0])
        var list = res.data.data.ids
        for (const i in list) {
          var imgUrl = await this.getImg(list[i])
          list[i] = imgUrl
        }
        this.fullscreenLoading = false
        this.$store.commit('app/CHANGE_IMAGE', list)
      })
    },
    async getImg(id) {
      const url = `org/org-production-reference-template-preview/${id}`
      return await this.$axios(url).then(async(res) => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data
        } else {
          return false
        }
      })
    },
    // 删除单个模板
    deleteFiles(e) {
      const arr = []
      arr.push(e.id)
      this.$axios('org/org-production-reference-template/batch-delete', arr, { method: 'PUT' }).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({ type: 'success', message: '删除成功' })
          const data = { pageNum: this.pageNum, pageSize: this.pageSize, prodCode: this.prodCode, originalFilename: this.formLabelAlign.fileName }
          this.getList(data)
        }
      })
    },
    // 下载单个模板
    downloadFile(e) {
      const arr = []
      arr.push(e.id)
      this.$axios('org/org-production-reference-template/batch-download', arr, { method: 'PUT', responseType: 'blob' }).then(res => {
        console.log(res)
        const fileName = e.originalFilename
        this.$fun.blobFile(res, fileName)
      })
    },
    // 选择图片后点击确认
    uploadeConfirm() {
      const formData = new FormData()
      this.fileArr.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('proCode', this.prodCode)
      this.dialogVisible = false
      this.$axios('org/org-production-reference-template', formData, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        console.log(res)
        this.fileArr = []
        const data = { pageNum: this.pageNum, pageSize: this.pageSize, prodCode: this.prodCode, originalFilename: this.formLabelAlign.fileName }
        this.getList(data)
      })
      // console.log(formData.get('files'))
    },
    // 根据文件名判断文件格式
    getFileType(fileName) {
      // 后缀获取
      let suffix = ''
      // 获取类型结果
      let result = ''
      try {
        const flieArr = fileName.split('.')
        suffix = flieArr[flieArr.length - 1]
      } catch (err) {
        suffix = ''
      }
      // fileName无后缀返回 false
      if (!suffix) {
        return false
      }
      suffix = suffix.toLocaleLowerCase()
      // 图片格式
      const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
      // 进行图片匹配
      result = imglist.find((item) => item === suffix)
      if (result) {
        return 'image'
      }
      // 匹配txt
      const txtlist = ['txt']
      result = txtlist.find((item) => item === suffix)
      if (result) {
        return 'txt'
      }
      // 匹配 excel
      const excelist = ['xls', 'xlsx']
      result = excelist.find((item) => item === suffix)
      if (result) {
        return 'excel'
      }
      // 匹配 word
      const wordlist = ['doc', 'docx']
      result = wordlist.find((item) => item === suffix)
      if (result) {
        return 'word'
      }
      // 匹配 pdf
      const pdflist = ['pdf']
      result = pdflist.find((item) => item === suffix)
      if (result) {
        return 'pdf'
      }
      // 匹配 ppt
      const pptlist = ['ppt', 'pptx']
      result = pptlist.find((item) => item === suffix)
      if (result) {
        return 'ppt'
      }
      // 匹配 视频
      const videolist = [
        'mp4',
        'm2v',
        'mkv',
        'rmvb',
        'wmv',
        'avi',
        'flv',
        'mov',
        'm4v'
      ]
      result = videolist.find((item) => item === suffix)
      if (result) {
        return 'video'
      }
      // 匹配 音频
      const radiolist = ['mp3', 'wav', 'wmv']
      result = radiolist.find((item) => item === suffix)
      if (result) {
        return 'radio'
      }
      // 其他 文件类型
      return 'other'
    }
  }
}
</script>

<style lang="less" scoped>
.condition-search{
  display: flex;
  .btns{
    margin-left: 50px;
  }
}
/deep/ .el-dialog__body{
  padding-top: 20px;
}
.upload-btn{
  display: flex;
}
.el-upload__tip{
  color: #999;
  line-height: 30px;
}
.file-name-list-show{
  margin-left: 76px;
  display: flex;
  flex-wrap: wrap;
  & > span{
    display: block;
    margin-right: 20px;
    max-width: 20%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #8a2ee6;
    line-height: 30px;
  }
}
.button-group{
  padding: 0;
  margin: 0;
  margin-right: 30px;
}
</style>
