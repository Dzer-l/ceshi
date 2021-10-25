<template>
  <div class="qualification-info-main">
    <div class="notary-receiving-info">
      <h3><span>公证书领取信息</span></h3>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="公证书份数：">
          <div>-</div>
        </el-form-item>
        <el-form-item label="领取方式：">
          <div>电子公证书</div>
        </el-form-item>
      </el-form>
    </div>
    <!---->
    <div v-if="basicData.orderStatus===301" class="electronic-certificate-list">
      <div class="electronic-certificate-header">
        <div class="material-type">材料类型</div>
        <div class="other-1">
          <div class="file-name">文件名称</div>
          <div class="other-2">
            <div class="sign-status">签署状态</div>
            <div class="operating" style="border-right:none">操作</div>
          </div>
        </div>
      </div>
      <div v-for="(item,key) of fileList" :key="key" class="file-list">
        <div class="list-type">{{ key==800?'合同':'电子公证书' }}</div>
        <div class="list-other-1">
          <div class="list-name">
            <div v-for="(items,index) in item" :key="items.id" :style="{borderBottom:(index!==item.length-1?'1px #ddd solid':'none')}"><span>{{ items.originalFilename }}</span></div>
          </div>
          <div class="list-other-2">
            <div class="list-status">
              <div v-for="(items,index) in item" :key="items.id" :style="{borderBottom:(index!==item.length-1?'1px #ddd solid':'none')}">
                <span :style="{color:(items.signStatus?'#67C23A':'#F56C6C')}">{{ items.signStatus? '已签署': '未签署' }}</span>
              </div>
            </div>
            <div class="list-operating">
              <div v-for="(items,index) in item" :key="items.id" :style="{borderBottom:(index!==item.length-1?'1px #ddd solid':'none')}">
                <div>
                  <el-link v-if="parseInt(key)!==800&&(getFileType(items.originalFilename)==='word'||getFileType(items.originalFilename)==='pdf')" :underline="false" type="primary" :disabled="jurisdiction" @click="editFile(items)">编辑</el-link>
                  <el-link v-if="parseInt(key)!==800" :underline="false" type="primary" :disabled="jurisdiction" @click="stampSign(items)">盖章签署</el-link>
                  <el-link :underline="false" type="primary" :disabled="jurisdiction" @click="previewFile(items)">预览</el-link>
                  <el-link :underline="false" type="primary" :disabled="jurisdiction" @click="downloadFile(items)">下载</el-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <iframe v-show="iframeSta" name="test" frameborder="0" />
  </div>
</template>

<script>
import * as newHouse from '../../api/newhouse'
import * as de from '@/api/delegate'
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: ''
      },
      orderId: this.$route.query.orderId,
      fileList: {},
      basicData: {},
      iframeSta: false,
      http: '',
      jurisdiction: false
    }
  },
  created() {
    this.basicData = this.$parent.$parent.$parent.basicData
    this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
    this.getQualificationInformation()
  },
  methods: {
    getQualificationInformation() {
      newHouse.getAListOfElectronicsCertificates({ orderId: this.orderId }).then(res => {
        this.fileList = res.data
      })
    },
    previewFile(val) {
      newHouse.getAnElectricalCertificatePreview({ notaryPaperId: val.id }).then(async res => {
        if (res.data.success === true) {
          const previewImage = []
          const imaglList = res.data.data.ids
          for (const i in imaglList) {
            const imgUrl = await this.getImg(imaglList[i])
            previewImage.push(imgUrl)
          }
          this.$store.commit('app/CHANGE_IMAGE', previewImage)
        }
      })
    },
    async getImg(id) {
      const url = `org/notary-paper-preview-img?id=${id}`
      return await this.$axios(url).then(async(res) => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data
        }
      })
    },
    downloadFile(e) {
      newHouse.downloadElectricCertificateDocument({ orderId: this.orderId, notaryPaperId: e.id }).then(blob => {
        if (blob) {
          this.$message({ type: 'success', message: '下载成功' })
          const fileName = e.originalFilename
          this.saveAs(blob, fileName)
        }
      })
    },
    stampSign(e) {
      newHouse.gateSignedInterface({ notaryPaperId: e.id, orderId: e.orderId }).then(res => {
        if (res.success) {
          this.$message({ type: 'success', message: '盖章签署成功' })
          this.getQualificationInformation()
        } else {
          this.$message.error(res.msg || "盖章签署失败，请稍后再试") 
        }
      })
    },
    editFile(e) {
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
      window.open(`${this.http}/page/go-open-notary-paper/${e.orderId}/${e.id}`, 'test')
      // window.open(`https://test-onlyoffice.lvzhengyun.cn/page/go-open-notary-paper/${e.orderId}/${e.id}`, 'test')

      let websocket
			let _this = this
			if ('WebSocket' in window) {
				websocket = new WebSocket(process.env.VUE_APP_BASE_WEBSOCKET_WSS + '/websocket/' + e.id)
			}

			websocket.onopen = function () {
				console.log('连接成功')
			}

			websocket.onclose = function () {
				console.log('退出连接')
			}

			websocket.onmessage = async function (event) {
				// console.log("收到消息-----" + event.data);
				if (event.data !== '连接成功') {
					if (JSON.parse(event.data) == "success") { // 文件已经保存的标记
						_this.getQualificationInformation()
					}
				}
			}

			websocket.onerror = function () {
				console.log('连接出错')
			}
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
 .qualification-info-main{
   h3{
     justify-content: space-between;
    position: relative;
    padding-left: 10px;
   }
   h3::before {
      content: "";
      width: 3px;
      height: 19px;
      background: #1989fa;
      position: absolute;
      left: 2px;
    }
    .el-form{
      padding: 0 20px;
      .el-form-item{
      width: 30%;
      /deep/ .el-form-item__label{
        color: #999;
      }
    }
    }

 }
 .electronic-certificate-list{
   .file-list{
     display: flex;
     border: solid 1px #ddd;
     border-top: none;
   }
   .electronic-certificate-header{
     display: flex;
     align-items: center;
     border: solid 1px #ddd;
     height: 50px;
   }
   .material-type,
   .file-name,
   .sign-status,
   .operating{
     height: 100%;
     border-right: solid 1px #ddd;
       text-indent: 1em;
       display: flex;
       align-items: center;
   }
   .material-type,.list-type{
     width: 20%;
   }
   .other-1,.other-2,.list-other-1,.list-other-2{
     flex: 1;
     display: flex;
   }
   .other-1,.other-2{
     height: 100%;
   }
   .file-name,.list-name{
     width: 40%;
   }
  //  .other-2{
  //    flex: 1;
  //  }
   .sign-status,.list-status{
     width: 40%;
   }
   .operating,.list-operating{
     flex: 1;
   }
   .list-name,.list-status,.list-operating{
     & > div{
       height: 50px;
       display: flex;
       flex-flow: column;
       justify-content: center;
        text-indent:1em
     }
   }
   .list-name{
     & > div{
       border-right: solid 1px #ddd;
       width: 100%;
       span{

       overflow: hidden;
       white-space: nowrap;
       text-overflow:ellipsis;
       }
     }
   }
   .list-status{
     & > div{
       border-right: solid 1px #ddd ;
     }
   }
   .list-other-1{
    //  border: ;
   }
   .list-type{
       display: flex;
       align-items: center;
       border-right: solid 1px #ddd;
       text-indent: 1em;
   }
 }
 /deep/ .el-link--primary{
   margin-right: 20px;
   text-indent: 0 !important;
 }
 </style>
