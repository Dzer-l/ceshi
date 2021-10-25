/* eslint-disable vue/no-template-shadow */
<template>
  <div class="main">
    <div class="type-name">
      <div class="search-criteria">
        <div>
          <!-- <span>材料所属人：</span> -->
          <!-- <el-select
            v-model="value"
            size="medium"
            placeholder="请选择"
            style="width: 400px; margin-right: 20px"
          >
            <el-option size="medium" label="全部" value="0" />
            <el-option
              v-for="item in searchBarData"
              :key="parseInt(item.id)"
              size="medium"
              :label="item.proposerName"
              :value="item.id"
            />
          </el-select> -->
          <!-- <el-button
            type="primary"
            size="medium"
            @click="searchAttribution"
          >搜索</el-button> -->
        </div>
        <div>
          <el-button style="width:80px" size="medium" type="primary" @click="goBackToTheLastPage">返回</el-button>
        </div>
      </div>

    </div>
    <div
      v-for="(e,i) in initialData"
      :key="i+'ft'"
      class="info-list"
    >
      <div class="info-list-title">
        <span>{{ e.proposerName }}</span>
      </div>
      <div
        v-for="(items, indexs) in e.orderNeedMaterialDTOS"
        :key="indexs"
        class="dateail-list"
      >
        <div class="material-explain">
          <span>{{ items.materialName }}</span>
        </div>
        <div class="image-list">
          <div
            v-if="items.orderProposerMaterialDTOS"
            style="display: flex;flex-wrap:wrap"
          >
            <div
              v-for="(v, j) in items.orderProposerMaterialDTOS"
              :key="j"
              style="position: relative;"
            >
              <img
                :src="v.url"
                alt=""
                :class="
                  getFileType(v.originFileName) === 'image'
                    ? ''
                    : 'forbid-click'
                "
                @click="clickPreviewImage(v, j)"
              >
              <div v-if="v.status === 1" class="review-tips">审核通过</div>
              <div
                v-if="v.status === 2"
                class="fail-to-pass"
                :class="
                  getFileType(v.originFileName) === 'image'
                    ? ''
                    : 'forbid-click'
                "
                @click="clickPreviewImage(v, j)"
              >
                <div class="fail-to-pass-bause">
                  <span>{{ v.remarksContent }}</span>
                </div>
                <div class="text">审核不通过</div>
              </div>
            </div>
          </div>
          <div v-if="items.status===1" class="blank-material" style="">提示补充材料</div>
        </div>
      </div>
    </div>
    <div class="preview-dialog">
      <el-dialog
        title="材料预览"
        :visible.sync="previewDialogVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <div class="info-title">
          <div>
            <span> 申请人： </span>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <span>材料类型：</span>
            <span>{{ item.materialName }}</span>
          </div>
          <div>
            <div :class="item.status === 1&&item.status!==0 ? 'pass' : 'no-pass'">
              <!-- {{ item.status === 1&&item.status!==0 ? "审核通过" : "审核不通过" }} -->
              {{ item.status === 0 ? "未审核" : (item.status===1?"审核通过":"审核不通过") }}
            </div>
          </div>
        </div>
        <div class="image-main" style="height: 600px">
          <div v-if="imgArray.length > 0" class="block" style="height: 100%">
            <el-carousel
              indicator-position="outside"
              :autoplay="false"
              @change="imageChange"
            >
              <el-carousel-item v-for="(m, index) in imgArray" :key="index">
                <el-image :src="m.url">
                  <div slot="placeholder" class="image-slot">
                    加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- <div class="bottom-operation-bar">
      <div class="presentment-party">
        <el-checkbox v-model="presentmentParty"
          >提示当事人补充空白材料</el-checkbox
        >
      </div>
      <div class="bottom-operation-btn" @click="submitReviewResult">
        确认审核结果
      </div>
    </div> -->
    <el-backtop target=".main" />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { valid } from 'mockjs'
import { showLoading, hideLoading } from '../../utils/loading'
import {
  getAllTypeMaterial,
  getAloneTypeMaterial,
  previewMaterials,
  reviewSingleMaterial,
  reviewAllMaterial,
  supplementaryMaterials
} from '../../api/cloudMail'
export default {
  data() {
    return {
      orderId: '',
      value: '0',
      initialData: [],
      searchBarData: [],
      imageData: [],
      previewDialogVisible: false,
      disqualificationStatu: false,
      formInline: { cause: '' },
      formInlineRulse: {
        cause: [
          { required: true, message: '请输入不合格原因', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在2到50个字',
            trigger: 'blur'
          }
        ]
      },
      presentmentParty: true,
      array: [],
      imgArray: [],
      item: {}
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
    this.$store.commit('app/CHANGE_ORDERID', this.$route.query.orderId)
    this.$axios(`org/mail-order-material-list/${this.orderId}`).then(async res => {
      this.initialData = await this.getImageUrl(res.data)
      this.searchBarData = res.data
      hideLoading()
    })
    // getAllTypeMaterial({ orderId: this.orderId }).then((res) => {
    //   // this.initialData = res.data

    //   this.searchBarData = res.data
    //   this.getImageUrl(res.data)
    // })
  },
  // watch: {
  //   presentmentParty: {
  //     handler(newVal) {
  //       if (this.presentmentParty && newVal) {
  //         for (let index = 0; index < this.initialData.length; index++) {
  //           for (
  //             let i = 0;
  //             i < this.initialData[index].mailOrderMaterialTypeVOS.length;
  //             i++
  //           ) {
  //             this.initialData[index].mailOrderMaterialTypeVOS[
  //               i
  //             ].addMaterialFlag = 1;
  //           }
  //         }
  //       } else {
  //         this.initialData = JSON.parse(JSON.stringify(this.array));
  //       }
  //     },
  //   },
  // },
  methods: {
    searchAttribution() {
      if (parseInt(this.value) === 0) {
        getAllTypeMaterial({ orderId: this.orderId }).then((res) => {
          this.initialData = res.data
          this.getImageUrl()
        })
      } else {
        var data = {
          orderId: this.orderId,
          proposerId: this.value
        }

        getAloneTypeMaterial(data).then((res) => {
          this.initialData = []
          this.initialData.push(res.data)
          this.getImageUrl()
          // var arr = [];
          // arr.push(res.data);
        })
      }
    },
    async getImageUrl(val) {
      showLoading()
      var valData = val
      for (let index = 0; index < val.length; index++) {
        if (valData[index].orderNeedMaterialDTOS) {
          for (let i = 0; i < valData[index].orderNeedMaterialDTOS.length; i++) {
            if (valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS) {
              for (let j = 0; j < valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS.length; j++) {
                var data = { id: valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].id }
                if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'image') {
                  var url = await previewMaterials(data)
                  const im = await this.base64ToBlob({ b64data: url.data, contentType: 'image/png' })
                  valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = im.preview
                } else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'pdf') {
                  valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/pdf.png')
                } else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'word') {
                  valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/DOCX.png')
                } else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'excel'
                ) {
                  valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/xls.png')
                } else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'video') {
                  valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/MP4.png')
                }
              }
            }
          }
        }
      }

      return valData
    },
    async base64ToBlob({ b64data = '', contentType = '', sliceSize = 512 } = {}) {
      return new Promise((resolve, reject) => {
        // 使用 atob() 方法将数据解码
        const byteCharacters = atob(b64data)
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize)
          const byteNumbers = []
          for (let i = 0; i < slice.length; i++) {
            byteNumbers.push(slice.charCodeAt(i))
          }
          // 8 位无符号整数值的类型化数组。内容将初始化为 0。
          // 如果无法分配请求数目的字节，则将引发异常。
          byteArrays.push(new Uint8Array(byteNumbers))
        }
        let result = new Blob(byteArrays, {
          type: contentType
        })
        result = Object.assign(result, {
          // jartto: 这里一定要处理一下 URL.createObjectURL
          preview: URL.createObjectURL(result),
          name: `图片示例.png`
        })
        resolve(result)
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
    clickPreviewImage(val, index) {
      this.imgArray = []
      if (this.getFileType(val.originFileName) === 'image') {
        for (let index = 0; index < this.initialData.length; index++) {
          if (this.initialData[index].orderNeedMaterialDTOS.length > 0) {
            for (
              let i = 0;
              i < this.initialData[index].orderNeedMaterialDTOS.length;
              i++
            ) {
              if (
                this.initialData[index].orderNeedMaterialDTOS[i]
                  .orderProposerMaterialDTOS.length > 0
              ) {
                for (
                  let j = 0;
                  j <
                  this.initialData[index].orderNeedMaterialDTOS[i]
                    .orderProposerMaterialDTOS.length;
                  j++
                ) {
                  this.initialData[index].orderNeedMaterialDTOS[
                    i
                  ].orderProposerMaterialDTOS[
                    j
                  ].materialName = this.initialData[
                    index
                  ].orderNeedMaterialDTOS[i].materialName
                  this.initialData[index].orderNeedMaterialDTOS[
                    i
                  ].orderProposerMaterialDTOS[j].name = this.initialData[
                    index
                  ].realName
                  if (
                    this.getFileType(
                      this.initialData[index].orderNeedMaterialDTOS[i]
                        .orderProposerMaterialDTOS[j].originFileName
                    ) === 'image'
                  ) {
                    if (
                      this.initialData[index].orderNeedMaterialDTOS[i]
                        .orderProposerMaterialDTOS[j].id === val.id
                    ) {
                      this.imgArray.unshift(
                        this.initialData[index].orderNeedMaterialDTOS[i]
                          .orderProposerMaterialDTOS[j]
                      )
                    } else {
                      this.imgArray.push(
                        this.initialData[index].orderNeedMaterialDTOS[i]
                          .orderProposerMaterialDTOS[j]
                      )
                    }
                  }
                  // this.imageData = [];
                  // this.imageData.push(val);
                  this.item = this.imgArray[0]
                  this.$nextTick(() => {
                    this.previewDialogVisible = true
                  })
                }
              }
            }
          }
        }
      }
    },
    disqualificationOperation() {
      this.disqualificationStatu = true
    },
    submitCause() {
      this.$refs['disqualificationForm'].validate((valid, obj) => {
        if (valid) {
          this.imageData[0].status = 2
          this.imageData[0].remarksContent = this.formInline.cause
          reviewSingleMaterial(this.imageData[0]).then((res) => {
            if (res.success) {
              this.$router.go(0)
            }
          })
        }
        // this.formInline.cause = "";
      })
    },
    getApproved() {
      this.imageData[0].status = 1
      reviewSingleMaterial(this.imageData[0]).then((res) => {
        if (res.success) {
          this.$router.go(0)
        }
      })
    },
    submitReviewResult() {
      this.$confirm(
        '确认材料完整且无误？确定后所有材料均视为审核通过',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          reviewAllMaterial({ orderId: this.orderId }).then((res) => {
            if (res.success) {
              this.$router.go(0)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    supplementary(val, val2) {
      var data = {
        orderId: this.orderId,
        proposerId: val2.id,
        materialCode: val.materialCode,
        status: 1,
        content: '',
        materialName: val.materialName
      }

      if (val.addMaterialFlag === 1) {
        data.status = 0
      }
      supplementaryMaterials(data).then((res) => {
        if (res.success) {
          this.$router.go(0)
        }
      })
    },
    imageChange(val, index) {
      this.item = this.imgArray[val]
    },
    goBackToTheLastPage() {
      this.$router.push({ name: 'entryDetailsOrder', query: { orderId: this.orderId }})
    }
  }
}
</script>

<style lang="less" scoped>
.image-main {
  .block {
    height: 100%;
  }
  .el-image {
    height: 100%;
    width: 100%;
    /deep/ .el-image__inner {
      // width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

/deep/ .el-dialog__footer {
  padding-top: 20px;
}
/deep/ .el-dialog {
  margin-top: 10vh !important;
}
.main {
  width: calc(100% - 40px);
  min-height: calc(100vh - 90px);
  background: #fff;
  padding: 0 20px;
  position: relative;
  padding-bottom: 80px;
  .type-name {
    padding: 30px 0;
    padding-bottom: 50px;
    .search-criteria {
      border-bottom: solid #eee 1px;
      padding-bottom: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .info-list {
    border: solid #eee 1px;
    border-radius: 5px;
    margin-bottom: 20px;
    .info-list-title {
      background: #e6f6fe;
      padding: 15px 10px;
      border-radius: 5px;
      span {
        font-size: 16px;
      }
    }
    .dateail-list {
      border: solid #eee 1px;
      border-radius: 5px;
      margin: 20px;
      .material-explain {
        padding: 15px 10px;
        border-bottom: solid #eee 1px;
      }
      .image-list {
        margin: 0 10px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        img {
          height: 100px;
          width: 100px;
          object-fit:cover;
          margin-right: 10px;
          cursor: pointer;
          border:solid 1px #eee
        }
        .hint {
          height: 100px;
          width: 100px;
          border: solid 1px #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          span {
            color: #fff;
          }
          .font-icon-box {
            background: #409eff;
            border-radius: 50%;
            .el-icon-plus {
              font-size: 32px;
              color: #fff;
            }
          }
        }
        .hintNot {
          background: #409eff;
          border: none;
        }
        .review-tips,
        .text {
          position: absolute;

          background: #67c23a;
          border-radius: 4px;
          font-size: 8px;
          color: #fff;
          line-height: 20px;
          padding: 0 5px;
          z-index: 999;
          bottom: 3px;
          right: 10px;
        }
        .fail-to-pass {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          cursor: pointer;
          .fail-to-pass-bause {
            margin-right: 10px;
            display: flex;
            justify-content: center;
            & > span {
              white-space: pre-wrap; /* CSS3 */
              white-space: -moz-pre-wrap; /* Firefox */
              white-space: -pre-wrap; /* Opera <7 */
              white-space: -o-pre-wrap; /* Opera 7 */
              word-wrap: break-word; /* IE */
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              color: #f56c6c;
            }
          }
        }
        .text {
          background: #f56c6c;
        }
      }
    }
  }
  .preview-dialog {
    /deep/ .el-dialog{
      min-width: 600px;
    }
    .info-title {
      display: flex;
      align-items: center;
      height: 50px;
      & > div {
        width: auto;
        padding-right: 15%;
      }
    }
  }
  .bottom-operation-bar {
    height: 80px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    position: absolute;
    bottom: 0;
    margin-left: -20px;
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .presentment-party,
    .bottom-operation-btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .presentment-party {
      padding-right: 30px;
    }
    .bottom-operation-btn {
      padding: 0 50px;
      background: #409eff;
      color: #fff;
    }
  }
}
/deep/ .el-carousel {
  height: 100%;
  background: #f2f2f2;
  border: solid #999 1px;
}
/deep/ .el-dialog__body {
  padding-top: 10px ;
}
.no-pass,
.pass {
  height: 20px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  color: #fff;
}
.pass {
  background: #67c23a;
}
.no-pass {
  color: #f56c6c;
}
/deep/ .el-carousel__indicator {
  /deep/ .el-carousel__button {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
}
.forbid-click {
  cursor: no-drop !important;
}
.blank-material{
height: 100px;width:100px;background:#409eff;
color: #fff;
display: flex;
align-items: center;
justify-content: center;
}
.image-list{
  min-height: 120px;
}
</style>
<style>
.el-carousel__container{
  height: calc(100% - 44px) !important;
}
</style>
