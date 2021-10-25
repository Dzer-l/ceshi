<template>
  <div class="document-material-main">
    <div class="action-bar">
      <!-- 待审核状态显示的按钮-->
      <el-row v-if="staData.orderStatus === 201">
        <el-button
          v-if="staData.prodCode !== 'rfcw'"
          type="primary"
          size="medium"
          :disabled="jurisdiction"
          @click="allSetDistrict"
        >设置签名区域</el-button>
        <el-button
          v-if="staData.prodCode !== 'rfcw'"
          type="primary"
          size="medium"
          :disabled="jurisdiction"
          @click="uploadMaterial"
        >上传签署材料</el-button>
        <el-button
          type="primary"
          size="medium"
          :disabled="jurisdiction"
          @click="allDownload"
        >全部下载</el-button>
      </el-row>
      <!-- 需补材料状态显示的按钮 -->
      <el-row v-if="staData.orderStatus === 202">
        <el-button
          type="primary"
          size="medium"
          :disabled="jurisdiction"
          @click="allDownload"
        >全部下载</el-button>
      </el-row>
      <!-- 待支付状态显示的按钮-->
      <el-row v-if="staData.orderStatus === 101">
        <!-- <el-button
          type="primary"
          size="medium"
          @click="previewPartMaterial"
        >预览签署材料</el-button> -->
        <el-button
          type="primary"
          size="medium"
          :disabled="jurisdiction"
          @click="allDownload"
        >全部下载</el-button>
      </el-row>
      <!-- 待签署状态显示的按钮 -->
      <el-row
        v-if="
          staData.orderStatus === 102 ||
            staData.orderStatus === 301 ||
            staData.orderStatus === 302 ||
            staData.orderStatus === 303 ||
            staData.orderStatus === 304 ||
            staData.orderStatus === 305 ||
            staData.orderStatus === 306
        "
      >
        <el-button
          type="primary"
          size="medium"
          @click="previewAllMaterial"
        >预览</el-button>
        <el-button
          type="primary"
          size="medium"
          :disabled="jurisdiction"
          @click="allDownload"
        >全部下载</el-button>
      </el-row>
    </div>
    <div class="document-material-table">
      <el-table
        :data="documentMaterialTableData"
        border
        style="width: 100%"
        :header-cell-style="{ color: '#333', background: '#e6f6fe' }"
      >
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column
          label="文件名称"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.originalFilename }}</span> -->
            <span>{{ scope.row.afterSignFile!=null?scope.row.afterSignFile.originalFilename:scope.row.originalFilename }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="coverStatus"
          label="签署区域设置状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.coverStatus === 0"
              type="danger"
            >未设置</el-tag>
            <el-tag
              v-if="scope.row.coverStatus === 1"
              type="success"
            >已设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="签署状态" align="center">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.signStatus === 2"
              type="success"
            >已签署</el-tag>
            <el-tag
              v-if="scope.row.signStatus === 0"
              type="danger"
            >未签署</el-tag>
            <el-tag
              v-if="scope.row.signStatus === 1"
              type="warning"
            >部分签署</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="staData.prodCode==='ysf'"
          label="上传时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.originalFilename }}</span> -->
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" fixed="right" width="350" align="center">
          <template slot-scope="scope">
            <span v-if="staData.orderStatus===201" style="margin-right:10px;">
              <el-button
                v-if="getFileType(scope.row.originalFilename) === 'word'"
                type="text"
                :disabled="jurisdiction"
                @click="editDocument(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="scope.row.coverStatus === 0  && staData.prodCode !== 'rfcw'"
                :disabled="jurisdiction"
                type="text"
                @click="setSignature(scope.row)"
              >设置签名区域</el-button>
              <el-button
                v-if="scope.row.coverStatus === 1 && staData.prodCode !== 'rfcw'"
                type="text"
                :disabled="jurisdiction"
                @click="setSignature(scope.row)"
              >重设签名区域</el-button>
              <el-button
                type="text"
                :disabled="jurisdiction"
                @click="deleteMaterials(scope.row)"
              >删除</el-button>
            </span>
            <el-button
              :disabled="jurisdiction"
              type="text"
              @click="previewFile(scope.row)"
            >预览</el-button>
            <el-button
              type="text"
              :disabled="jurisdiction"
              style="margin-left:5px"
              @click="singleDownload(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="paging_box">
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
      </div> -->
    </div>
    <sign-file
      :man-list="fileSignList"
      :i-d="orderId"
      :doc-info="docInfo"
      :show="signBoxShow"
      @sucSign="init"
    />
    <!-- 上传申请材料 -->
    <div class="upload-material-dialog">
      <el-dialog
        title="上传签署材料"
        :visible.sync="uploadMaterialDialogVisible"
        width="40%"
        :close-on-click-modal="false"
      >
        <el-form label-width="80px">
          <el-form-item label="文件上传">
            <el-upload
              action
              :show-file-list="false"
              :multiple="true"
              :http-request="upLoadFile"
              :data="{ type: 'all' }"
            >
              <el-button icon="el-icon-upload2">上传文件</el-button>

              <div slot="tip" class="el-upload__tip" style="margin-right: 50%">
                <span
                  style="color: #999"
                >支持扩展名：.doc .docx .pdf格式，请将上传的文件转成所支持的格式</span>
              </div>
            </el-upload>
            <div v-if="fileShow.length > 0" class="upload-image-list">
              <div v-for="(item, index) in fileShow" :key="index">
                {{ item }}
              </div>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelUploading">取 消</el-button>
          <el-button type="primary" @click="affirmUploading">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <iframe v-show="iframeSta" name="test" frameborder="0" />
  </div>
</template>

<script>
import {
  getDocumentMaterialList,
  DeleteWritMaterials,
  getEntryDateil
} from '../../api/cloudMail'
import signFile from '@/components/entryTab/uploadFile'
import * as de from '@/api/delegate'

export default {
  components: { signFile },
  data() {
    return {
      formLabelAlign: {
        name: '',
        type: ''
      },
      documentMaterialTableData: [],
      fileShowListData: [],
      currentPage3: 1,
      pageSize: 10,
      total: 100,
      uploadMaterialDialogVisible: false,
      http: '',
      orderId: '',
      iframeSta: false,
      staData: {},
      fileSignList: [],
      docInfo: {},
      signBoxShow: false,
      flieList: [],
      upFileList: [],
      jurisdiction: false,
      type: '',
      fileShow: []
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
    var data = {
      pageNum: this.currentPage3,
      pageSize: this.pageSize,
      orderId: this.orderId
    }
    this.getList(data)
    this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
  },
  methods: {
    init() {
      var data = {
        orderId: this.orderId
      }
      this.getList(data)
      // this.getOrderInfo()
      this.signBoxShow = false
      this.uploadMaterialDialogVisible = false
    },
    getList(data) {
      getDocumentMaterialList(data).then((res) => {
        for (let index = 0; index < res.data.length; index++) {
          if (res.data[index].afterSignFile !== null) {
            res.data[index].afterSignFile = JSON.parse(res.data[index].afterSignFile)
          }
        }

        this.documentMaterialTableData = res.data
        this.total = res.data.total
        getEntryDateil(data).then((res) => {
          this.staData = res.data
        })
      })
    },
    handleSizeChange() {
      var data = {
        pageNum: this.currentPage3,
        pageSize: this.pageSize,
        orderId: this.orderId
      }
      this.getList(data)
    },
    handleCurrentChange() {
      var data = {
        pageNum: this.currentPage3,
        pageSize: this.pageSize,
        orderId: this.orderId
      }
      this.getList(data)
    },
    uploadMaterial() {
      this.uploadMaterialDialogVisible = true
      this.fileShowListData = []
      this.fileShow = []
    },
    editDocument(val) {
      this.iframeSta = true
      const mode = process.env.VUE_APP_BASE_MODE
      if (mode === 'development') {
        this.http = 'http://192.168.1.186:12009'
      } else if (mode === 'test') {
        this.http = 'https://test-onlyoffice.lvzhengyun.cn'
      } else if (mode === 'production') {
        this.http = 'https://office.lvzhengyun.cn'
      } else if (mode === 'staging') {
        this.http = 'https://test-onlyoffice.lvzhengyun.cn'
      }
      window.open(`${this.http}/page/go-open-order-docment/${val.orderId}/${val.id}`, 'test')
      // window.open(
      //   `https://test-onlyoffice.lvzhengyun.cn/page/go-open-order-docment/${val.orderId}/${val.id}`,
      //   'test'
      // )
    },
    singleDownload(val) {
      var fileName = ''
      if (val.afterSignFile != null) {
        fileName = val.afterSignFile.originalFilename
      } else {
        fileName = JSON.parse(val.beforeSignFile).originalFilename
      }
      var downloadType = 1
      this.$axios(
        'org/download-material',
        { orderId: this.orderId, documentId: val.id, downloadType: downloadType },
        { responseType: 'blob' }
      ).then((blob) => {
        this.saveAs(blob, fileName)
      })
    },
    deleteMaterials(val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteWritMaterials({ id: val.id }).then((res) => {
            if (res.success) {
              this.init()
              this.$message({
                message: '文件已删除',
                type: 'success'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
    },
    allDownload() {
      if (this.documentMaterialTableData.length > 0) {
        var downloadType = 1
        var allDocument = ''
        for (
          let index = 0;
          index < this.documentMaterialTableData.length;
          index++
        ) {
          allDocument += this.documentMaterialTableData[index].id + ','
        }
        allDocument = allDocument.substring(0, allDocument.length - 1)
        var fileName = allDocument.indexOf(',') !== -1 ? `${this.staData.businessTypeDesc}${this.staData.orderNum} ${this.getTime()}.zip` : this.documentMaterialTableData[0].originalFilename
        this.$axios(
          'org/download-material',
          { orderId: this.orderId, documentId: allDocument, downloadType },
          { responseType: 'blob' }
        ).then((blob) => {
          this.saveAs(blob, fileName)
        })
      } else {
        this.$message.error('没有可下载的文书')
      }
    },
    getTime() {
      const date = new Date()

      const seperator1 = '.' // 年月日之间的分隔

      const seperator2 = ':' // 时分秒之间的分隔

      const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 获取月,如果小于10,前面补个0

      const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 获取日,如果小于10,前面补个0

      const strHours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() // 获取小时,如果小于10,前面补个0

      const strMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() // 获取分,如果小于10,前面补个0

      const strSeconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 获取秒,如果小于10,前面补个0

      const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + strHours + seperator2 + strMinutes + seperator2 + strSeconds // 拼接一下

      return currentdate // 返回
    },

    previewFile(e) {
      de.getFileImg({ id: e.id }).then(async(res) => {
        if (res.data.success === true) {
          const list = res.data.data.ids
          for (const i in list) {
            const imgUrl = await this.getImg(list[i], 1)
            list[i] = imgUrl
          }
          this.$store.commit('app/CHANGE_IMAGE', list)
        }
      })
    },
    async getImg(id, type) {
      const url =
        type === 1
          ? `org/order-document-preview-img/${id}`
          : `org/order-proposer-material-preview-img?id=${id}`
      return await this.$axios(url).then(async(res) => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data
        }
      })
    },
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
    },
    previewPartMaterial() {
      this.selectPreview(1)
    },
    previewAllMaterial() {
      this.selectPreview(0)
    },
    selectPreview(val) {
      if (this.documentMaterialTableData.length > 0) {
        var array = this.documentMaterialTableData
        var list = []
        var previewImage = []
        if (val === 1) {
          for (let index = 0; index < array.length; index++) {
            if (array[index].signStatus === 1) {
              list.push(array[index])
            }
          }
        } else {
          list = this.documentMaterialTableData
        }
        if (list.length > 0) {
          for (let index = 0; index < list.length; index++) {
            de.getFileImg({ id: list[index].id }).then(async(res) => {
              if (res.data.success === true) {
                const imaglList = res.data.data.ids

                for (const i in imaglList) {
                  const imgUrl = await this.getImg(imaglList[i], 1)
                  previewImage.push(imgUrl)
                }
              }
              this.$store.commit('app/CHANGE_IMAGE', previewImage)
            })
          }
        } else {
          this.$message.error('没有可预览的文书')
        }
      } else {
        this.$message.error('没有可预览的文书')
      }
    },
    setSignature(e) {
      de.getEntrustInfo({ orderId: this.orderId }).then(async(res) => {
        if (res.success) {
          const flieList = []
          const fileSignList = []
          for (const i of res.data.annexDTOList) {
            flieList.push({
              name: i.originFileName,
              url: i.fileName
            })
          }
          // eslint-disable-next-line no-unused-vars
          for (const [index, j] of res.data.entrustList.entries()) {
            fileSignList.push({
              realName: j.realName,
              proposerId: j.id,
              lowLeftX: 0,
              lowLeftY: 0,
              orderId: this.orderId,
              orderDocumentId: '',
              page: '',
              coverType: 2
            })
            // j.edit = false;
            // j.gender = j.gender + "";
            // for (let i of j.materialList) {
            //   i.url = await this.getImg(i.id, 2);
            // }
          }
          this.flieList = flieList
          this.fileSignList = fileSignList
          // this.entrustInfo = res.data;
          this.docInfo = {
            docId: e.id,
            docName: e.originalFilename,
            signStatus: e.signStatus
          }
        }
      })
    },
    allSetDistrict() {
      // console.log(this.documentMaterialTableData);
      if (this.documentMaterialTableData.length > 0) {
        this.docInfo = []
        de.getEntrustInfo({ orderId: this.orderId }).then(async(res) => {
          if (res.success) {
            const flieList = []
            const fileSignList = []
            for (const i of res.data.annexDTOList) {
              flieList.push({
                name: i.originFileName,
                url: i.fileName
              })
            }
            // eslint-disable-next-line no-unused-vars
            for (const [index, j] of res.data.entrustList.entries()) {
              fileSignList.push({
                realName: j.realName,
                proposerId: j.id,
                lowLeftX: 0,
                lowLeftY: 0,
                orderId: this.orderId,
                orderDocumentId: '',
                page: '',
                coverType: 2
              })
            }
            this.flieList = flieList
            this.fileSignList = fileSignList
          }
        })
        for (
          let index = 0;
          index < this.documentMaterialTableData.length;
          index++
        ) {
          var data = {
            docId: this.documentMaterialTableData[index].id,
            docName: this.documentMaterialTableData[index].originalFilename,
            signStatus: this.documentMaterialTableData[index].signStatus,
            coverStatus: this.documentMaterialTableData[index].coverStatus
          }
          this.docInfo.push(data)
        }
      } else {
        this.$message.error('请先上传文书')
      }
    },
    // 文件多选上传
    upLoadFile(e) {
      const typeList = ['.doc', '.pdf', '.docx', '.DOC', 'DOCX']
      const file = e.file
      const fileType = file.name.substring(file.name.lastIndexOf('.'))
      const isFile = typeList.indexOf(fileType) !== -1
      const isLt15M = file.size / 1024 / 1024 < 15
      const dataType = e.data.type
      if (this.getFileType(e.file.name) !== 'word' && this.getFileType(e.file.name) !== 'pdf') {
        this.$fun.msg('请上传pdf、doc、docx格式的文件!', 'error')
        return false
      }
      if (!isLt15M) {
        this.$fun.msg('上传文件的大小应小于15M', 'error')
        return false
      }
      if (this.fileShow.length > 29) {
        this.$fun.msg('上传文件的最多30份', 'error')
        return false
      }
      if (file.size === 0) {
        this.$fun.msg('不能上传空白文件', 'error')
        return false
      }
      this.upFileList.push(e.file)
      this.type = dataType
      for (let index = 0; index < this.upFileList.length; index++) {
        if (this.fileShow.indexOf(this.upFileList[index].name) < 0) {
          this.fileShow.push(this.upFileList[index].name)
        }
      }

      // if (!this.isUp) {
      //   this.isUp = true
      //   setTimeout(() => {
      //     this.upLoadAll(dataType)
      //   }, 1000)
      // }
    },
    upLoadAll(type) {
      this.$fun.msg('开始上传', 'success')
      const formData = new FormData()
      for (const i in this.upFileList) {
        formData.append('file', this.upFileList[i])
      }
      formData.append('orderId', this.orderId)
      this.$axios('org/order-document', formData, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      }).then((res) => {
        if (res.success === true) {
          let list = []
          if (type === 'push') {
            list = this.docInfoList
          }
          for (const i of res.data) {
            list.push({
              docId: i.id,
              docName: i.originalFilename,
              signStatus: i.signStatus
            })
          }
          this.docInfoList = list
          if (type !== 'push') {
            this.getDocImg(res.data[0].id)
          }
          for (let index = 0; index < list.length; index++) {
            this.fileShowListData.push(list[index])
          }
          // this.fileShowListData = list
        } else {
          this.$fun.msg('上传失败！', 'error')
        }
      })
      this.upFileList = []
      this.isUp = false
    },
    getDocImg(id) {
      de.getFileImg({ id: id }).then(async(res) => {
        if (res.data.success === true) {
          const list = res.data.data.ids
          const img = []
          for (const i in list) {
            img.push(await this.getImg(list[i]))
          }
          this.imgList = img
          this.isSize = res.data.data.paperType === 'A3' ? 2 : 1
          this.getSignList(id)
        }
      })
    },
    getSignList(id) {
      de.getSignDiv({ orderDocumentId: id }).then((res) => {
        if (res.success === true) {
          if (res.data != null || res.data.length !== 0) {
            const list = JSON.parse(JSON.stringify(res.data))
            this.signList = list
          }
        }
      })
    },
    cancelUploading() {
      this.uploadMaterialDialogVisible = false
    },
    affirmUploading() {
      if (this.fileShow.length > 0) {
        this.$fun.msg('开始上传', 'success')
        var type = this.type
        const formData = new FormData()
        for (const i in this.upFileList) {
          formData.append('file', this.upFileList[i])
        }
        formData.append('orderId', this.orderId)
        this.$axios('org/order-document', formData, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
          if (res.success === true) {
            let list = []
            if (type === 'push') {
              list = this.docInfoList
            }
            for (const i of res.data) {
              list.push({
                docId: i.id,
                docName: i.originalFilename,
                signStatus: i.signStatus
              })
            }
            this.docInfoList = list
            if (type !== 'push') {
              this.getDocImg(res.data[0].id)
            }
            for (let index = 0; index < list.length; index++) {
              this.fileShowListData.push(list[index])
            }
            this.docInfo = []
            de.getEntrustInfo({ orderId: this.orderId }).then(async(res) => {
              if (res.success) {
                const flieList = []
                const fileSignList = []
                for (const i of res.data.annexDTOList) {
                  flieList.push({
                    name: i.originFileName,
                    url: i.fileName
                  })
                }
                // eslint-disable-next-line no-unused-vars
                for (const [index, j] of res.data.entrustList.entries()) {
                  fileSignList.push({
                    realName: j.realName,
                    proposerId: j.id,
                    lowLeftX: 0,
                    lowLeftY: 0,
                    orderId: this.orderId,
                    orderDocumentId: '',
                    page: '',
                    coverType: 2
                  })
                }
                this.flieList = flieList
                this.fileSignList = fileSignList
              }
            })
            this.docInfo = this.fileShowListData
          } else {
            this.$fun.msg('上传失败！', 'error')
          }
        })
        this.upFileList = []
        this.isUp = false
      } else {
        this.$message.error('请上传文件')
      }

      // console.log(this.upFileList, '------------------0----------------------')
      // if (this.fileShowListData.length > 0) {
      //   this.uploadMaterialDialogVisible = false
      //   this.docInfo = []
      //   de.getEntrustInfo({ orderId: this.orderId }).then(async(res) => {
      //     console.log(res)
      //     if (res.code === 200) {
      //       const flieList = []
      //       const fileSignList = []
      //       for (const i of res.data.annexDTOList) {
      //         flieList.push({
      //           name: i.originFileName,
      //           url: i.fileName
      //         })
      //       }
      //       // eslint-disable-next-line no-unused-vars
      //       for (const [index, j] of res.data.entrustList.entries()) {
      //         fileSignList.push({
      //           realName: j.realName,
      //           proposerId: j.id,
      //           lowLeftX: 0,
      //           lowLeftY: 0,
      //           orderId: this.orderId,
      //           orderDocumentId: '',
      //           page: '',
      //           coverType: 2
      //         })
      //       }
      //       this.flieList = flieList
      //       this.fileSignList = fileSignList
      //     }
      //   })
      //   this.docInfo = this.fileShowListData
      // } else {
      //   this.$message.error('请上传文件')
      // }

      // console.log(this.docInfo, this.fileShowListData)
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  margin: 0;
  padding: 0;
  li {
    list-style: none;
  }
}
/deep/ .neterror {
  display: none;
  /deep/ #main-frame-error {
    display: none;
  }
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
.document-material-main {
  .action-bar {
    padding-right: 20px;
    .el-row {
      text-align: right;
    }
  }
  .document-material-table {
    padding: 20px 0;
    .el-button--text {
      padding: 0;
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
  }
}
.upload-material-dialog {
  .el-form {
    margin-left: 50px;
    .el-form-item {
      /deep/ .el-form-item__content {
        line-height: 20px;
      }
    }
  }
  .upload-image-list {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    & > div {
      width: 30%;
      color: #8a2ee6;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
