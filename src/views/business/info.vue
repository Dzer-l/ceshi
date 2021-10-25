<template>
  <div class="main-box">
    <!-- 订单信息 -->
    <div class="item-box">
      <div>
        <el-steps :active="active" align-center>
          <el-step title="信息录入" />
          <el-step title="签署文书上传" />
          <el-step title="在线视频签署" />
          <el-step title="完成" />
        </el-steps>
      </div>
      <div class="order-info">
        <div style="display: flex;;justify-content: space-between;align-items: center;">
          <div style="font-size: 20px">订单编号：{{ orderInfo.orderNum }}</div>
          <el-button style="width:80px;" type="primary" size="medium" @click="$router.go(-1)">返 回</el-button>
        </div>
        <p style="color: #333">公证事项：{{ orderInfo.notaryItems }}</p>
        <p v-if="!orderInfo.dossierNum || changeDoss" style="color: #333">
          卷宗号：
          <el-input
            v-model="dossierNum"
            style="width: 230px;height: 35px;line-height: 35px"
            :placeholder="orderInfo.dossierNum ? orderInfo.dossierNum : '请填写卷宗号'"
          />
          <el-button type="primary" style="margin-left: 20px;" @click="onClick_saveDossierNum">保存</el-button>
        </p>
        <p v-if="orderInfo.dossierNum && !changeDoss" style="color: #333">
          卷宗号：{{ orderInfo.dossierNum }}
          <el-button type="primary" style="margin-left: 20px;" @click="changeDoss = true">修改</el-button>
        </p>
        <p style="color: #333">信息提交时间：{{ orderInfo.createTime }}</p>
        <p style="color: #333">
          <span>签署记录视频生成情况：{{ orderInfo.isVideo ? '已生成' : '否' }}</span>
          <span
            style="margin-left: 30px"
          >材料签署情况：{{ orderInfo.signStatus == 2 ? '所有当事人已完成签署' : orderInfo.signStatus == 1 ? '部分已签署' : '未签署' }}</span>
        </p>
      </div>
    </div>

    <div class="item-box">
      <nav class="type-nav">
        <div class="select-type">
          <span :class="{act: infoAct == 1}" @click="onClick_changeTab(1)">签署材料上传</span>
          <span :class="{act: infoAct == 2}" @click="onClick_changeTab(2)">申请人信息</span>
          <span :class="{act: infoAct == 3}" @click="onClick_changeTab(3)">邮递信息</span>
        </div>
        <div style="padding-right: 20px;">
          <el-button v-if="infoAct == 2" @click="addProposer" type="primary">新增申请人</el-button>
          <el-button v-if="infoAct == 1" type="primary" @click="upSignFile">上传签署文件</el-button>
        </div>
      </nav>
      <!-- 文件签署情况 -->
      <div v-if="infoAct == 1" style="margin-top: 30px">
        <el-table ref="fileTable" :data="orderFileList" style="width: 100%">
          <el-table-column prop="fileName" label="文件名称" min-width="120" show-overflow-tooltip />
          <el-table-column prop="coverStatus" label="签署区域设置情况" min-width="80">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.coverStatus == '1' ? 'success' : 'danger'"
                disable-transitions
              >{{ scope.row.coverStatus == 1 ? '已设置' : '未设置' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="signStatus" label="签署情况" min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.orderProposerDocumentSignVOS==null||scope.row.orderProposerDocumentSignVOS.length==0">
                <el-tag
                  :type="scope.row.signStatus == '2' ? 'success' : 'danger'"
                  disable-transitions
                >{{ scope.row.signStatus == 2 ? '已签署' : scope.row.signStatus == 1 ? '部分已签署' : '未签署' }}</el-tag>
              </div>
              <div v-else>
                <div v-for="(item,index) of scope.row.orderProposerDocumentSignVOS" :key="index"
                :style="scope.row.orderProposerDocumentSignVOS.length>1&&index!=(scope.row.orderProposerDocumentSignVOS.length-1)?'margin-bottom: 10px;':''">
                  <span style="padding-right:10px">{{item.realName}}</span>
                  <el-tag
                    :type="item.isSign == '1' ? 'success' : 'danger'"
                    disable-transitions
                  >{{ item.isSign == 1 ? '已签署' : '未签署' }}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="上传时间" min-width="100" />
          <el-table-column label="操作" min-width="190">
            <template slot-scope="scope">
              <span class="table-btn" @click="onClick_lookFile(scope.row)">预览</span>
              <span class="table-btn" @click="onClick_delFile(scope.row)">删除</span>
              <span class="table-btn" @click="onClick_print(scope.row)">打印文书</span>
              <span class="table-btn" @click="onClikc_SignFile(scope.row)">重设签名区域</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="video-box">
          <div>
            <span @click="onClick_notrayUser">生成公证员视频通话二维码图片</span>
            <span @click="onClick_downCode(1)">生成当事人视频签署二维码图片</span>
          </div>
          <div>
            <el-button type="primary" @click="onClick_goVideo">开始远程视频</el-button>
          </div>
          <div>
            <el-button size="small" @click="downAllFile(1)">一键下载材料</el-button>
            <p>包括当事人已签名的所有文件、人脸检测报告、日志、录制视频及视频截图</p>
          </div>
        </div>
      </div>
      <!-- 文件签署情况 END -->
      <!-- 申请人信息 -->
      <div v-if="infoAct == 2" style="margin-top: 30px">
        <entrust-info ref="category" :order-id="orderId" :order-num="orderInfo.orderNum" :flie-list="flieList" />
      </div>
      <!-- 申请人信息 END -->
      <!-- 邮寄信息 -->
      <div v-if="infoAct == 3" style="margin-top: 30px">
        <div v-for="(item,index) in shippingInfo" :key="'shipping' + index">
          <el-form ref="shippingForm" :model="item">
            <div class="form-tit">公证书邮寄地址{{ index + 1 > 1? index + 1 : '' }}</div>
            <div class="form-item-main">
              <section>
                <el-form-item label="收件人姓名：">
                  <el-input
                    v-model="item.addresseeName"
                    :disabled="!shippingEdit"
                    placeholder="请输入收件人姓名"
                  />
                </el-form-item>
                <el-form-item label="收件地区：">
                  <el-cascader
                    v-model="item.regionCode"
                    :disabled="!shippingEdit"
                    :options="options"
                    placeholder="请选择"
                    @change="cityChange($event,index)"
                  />
                </el-form-item>
                <el-form-item label="收件详细地址：">
                  <el-input
                    v-model="item.detailAddress"
                    :disabled="!shippingEdit"
                    placeholder="请输入详细的收件地址"
                  />
                </el-form-item>
                <el-form-item label="收件人联系方式：">
                  <el-input
                    v-model="item.mobile"
                    :disabled="!shippingEdit"
                    placeholder="请输入收件人联系方式"
                  />
                </el-form-item>
              </section>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 邮寄信息 END -->
    </div>
    <div v-show="sendNoteLinkShow" class="send_note_link_button">
      <el-button type="primary" round @click="onClick_sendNote">发送短信链接</el-button>
    </div>
    <sign-file
      :man-list="fileSignList"
      :i-d="orderId"
      :doc-info="docInfo"
      :show="signBoxShow"
      @sucSign="init"
    />
    <el-dialog
      title="填写公证员手机号"
      :visible.sync="setTel"
      width="500px"
      top="20%"
      :close-on-click-modal="false"
    >
      <el-form ref="gzyTel" :model="gzyTelData">
        <el-form-item prop="gzyTel" :rules="telReg">
          <el-input v-model="gzyTelData.gzyTel" maxlength="11" />
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        style="margin-top: 20px;margin-left: auto;display:block"
        @click="onClick_submitTel"
      >提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
import * as de from '@/api/delegate'
import { regionData } from 'element-china-area-data'
import signFile from '@/components/delegate/signFile.vue'
import entrustInfo from '@/components/delegate/entrustInfo.vue'
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  components: { signFile, entrustInfo },
  data() {
    var gzyTel = (rule, value, callback) => {
      const tel = /^[\d]{11}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!tel.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      url: this.$cfg.http,
      active: 1,
      infoAct: 1,
      orderId: '',
      dossierNum: '',
      notaryUserMobile: '',
      orderInfo: {}, // 订单信息
      orderFileList: [], // 文书列表
      entrustInfo: {}, // 联系人
      shippingInfo: [], // 邮寄地址
      flieList: [], // 申请人材料列表
      fileSignList: [], // 需签字的申请人列表
      showFileSignList: [], // 展示签名列表
      signFileList: [], // 签署的文件列表
      enterustEdit: false, // 编辑联系人
      shippingEdit: false, // 编辑邮寄地址
      options: regionData, // 城市选择码
      manList: [
        { name: '客户答复', x: 0, y: 0 },
        { name: '发到付', x: 0, y: 0 },
        { name: '的吩咐丰富', x: 0, y: 0 },
        { name: '发的分公司', x: 0, y: 0 }
      ],
      docInfo: {},
      signBoxShow: false,
      changeDoss: false,
      setTel: false,
      gzyTelData: {
        gzyTel: '',
        gzyId: ''
      },
      telReg: [
        {
          validator: gzyTel,
          trigger: 'blur'
        }
      ],
      showLoding: false,
      sendNoteLinkShow: false,
      phoneData: []
    }
  },

  computed: {
    headerToken() {
      return {
        Authorization: 'bearer ' + this.$store.getters.token
      }
    }
  },

  watch: {
    infoAct(newVal, oldVal) {
      if (newVal === 1) {
        this.getSignFileList()
      } else if (newVal === 2) {
        this.getEInfo()
      } else {
        de.getShippingInfo({ orderNum: this.orderInfo.orderNum }).then(res => {
          if (res.success) {
            this.shippingInfo = res.data
          }
        })
      }
    },
    orderFileList(newVal, oldVal) {
      if (newVal.length > 0 && this.orderInfo.orderStatus !== 306) {
        this.active = 3
      }
    },
    '$store.state.app.imgList': function(newVal, oldVal) {
      if (newVal.length === 0) {
        this.sendNoteLinkShow = false
      }
    }
  },

  created() {
    this.orderId = this.$route.query.id
    this.init()
  },
  methods: {
    addProposer(){
      this.$refs.category.categorySelect()
    },
    // 进入页面获取信息
    init() {
      this.getEInfo()
      this.getOrderInfo()
      this.signBoxShow = false
    },
    // 获取订单信息
    getOrderInfo() {
      de.getInfo({ orderId: this.orderId }).then(res => {
        if (res.success) {
          this.orderInfo = res.data
          if (res.data.orderStatus === 306) {
            this.active = 4
          }
          this.getSignFileList()
        } else {
          this.$fun.msg('出错了！', 'error')
        }
      })
    },
    // 保存卷宗号
    onClick_saveDossierNum() {
      if (!this.dossierNum && !this.orderInfo.dossierNum) {
        this.$fun.msg('卷宗号不能为空', 'error')
        return
      }
      this.$axios(
        'org/update-order-dossier-num',
        {
          id: this.orderId,
          dossierNum: this.dossierNum
            ? this.dossierNum
            : this.orderInfo.dossierNum
        },
        { method: 'put' }
      ).then(res => {
        this.changeDoss = false
        this.dossierNum = ''
        this.init()
      })
    },
    // 打开签署文件上传
    async upSignFile() {
      if (this.orderInfo.signStatus === 2) {
        if (
          !(await this.showToast(
            '当前订单已完成，重新上传文书，会清空所有文书的签名，需要重新签署，确定要这样做吗？',
            '风险提示'
          ))
        ) {
          return
        }
      }
      this.signBoxShow = true
    },

    onClick_changeTab(e) {
      this.infoAct = e
    },

    // 获取申请人信息

    getEInfo() {
      this.phoneData = []
      if (JSON.stringify(this.entrustInfo) !== '{}') {
        return
      }
      de.getEntrustInfo({ orderId: this.orderId }).then(async res => {
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
          for (const i of res.data.entrustList) {
            this.phoneData.push(i.mobile)
          }
          this.flieList = flieList
          this.fileSignList = fileSignList
          // this.entrustInfo = res.data;
        }
      })
    },

    async getImg(id) {
      return await this.$axios(`org/order-document-preview-img/${id}`).then(async res => {
        if (res.success) {
          return 'data:image/png;base64,' + res.data
        }
      })
    },

    // 获取签署文件列表

    getSignFileList() {
      de.getSignList({ orderId: this.orderId }).then(res => {
        if (res.success) {
          if (!res.data) {
            return
          }
          const list = []
          for (const i of res.data) {
            list.push({
              orderProposerDocumentSignVOS:i.orderProposerDocumentSignVOS,
              fileName: i.originalFilename,
              signStatus: i.signStatus,
              coverStatus: i.coverStatus,
              createTime:
                i.createTime.substr(0, 10) + ' ' + i.createTime.substr(11, 19),
              id: i.id
            })
          }
          this.orderFileList = list
        }
      })
    },
    // upShipping() {
    //   if (this.shippingEdit == false) {
    //     this.shippingEdit = true;
    //   } else {
    //     this.shippingEdit = false;
    //   }
    // },
    // upEnterust() {
    //   if (this.enterustEdit == false) {
    //     this.enterustEdit = true;
    //   } else {
    //     this.enterustEdit = false;
    //   }
    // },

    // 填写公证员手机号
    onClick_notrayUser() {
      // if (this.orderFileList.length === 0) {
      //   this.$fun.msg('您还没有上传文书', 'error')
      //   return
      // }
      for (const i of this.orderFileList) {
        if (i.coverStatus !== 1) {
          this.$fun.msg('有文件尚未设置签署区域', 'error')
          return
        }
      }
      de.getNotrayTel({ orderId: this.orderId }).then(res => {
        this.gzyTelData.gzyTel = ''
        this.gzyTelData.gzyId = ''
        if (res.data != null && res.success === true) {
          this.gzyTelData.gzyTel = res.data.notaryUserMobile
          this.gzyTelData.gzyId = res.data.id
        }
        this.setTel = true
      })
    },
    // 提交修改手机号
    onClick_submitTel() {
      this.$refs['gzyTel'].validate(valid => {
        if (valid) {
          this.$axios(
            'org/order-notary-user-mobile',
            {
              orderId: this.orderId,
              notaryUserMobile: this.gzyTelData.gzyTel,
              id: this.gzyTelData.gzyId
            },
            { method: 'post' }
          ).then(res => {
            if (res.success === true) {
              this.onClick_downCode(2)
              this.setTel = false
            } else {
              this.$fun.msg('公证员手机号设置失败!', 'error')
            }
          })
        } else {
          return false
        }
      })
    },
    // 生成小程序二维码
    onClick_downCode(e) {
      if (this.orderFileList.length > 0) {
        for (const i of this.orderFileList) {
          if (i.coverStatus !== 1) {
            this.$fun.msg('有文件尚未设置签署区域', 'error')
            return
          }
        }
      }
      const qr = e === 1 ? '申请人' : '公证员'

      de.getQR(`?orderId=${this.orderId}&userType=${e}&qrCodeName=${qr}`).then(
        res => {
          // console.log(res)
          this.$store.commit('app/CHANGE_IMAGE', ['data:image/png;base64,' + res.data])
          if (e === 1) {
            this.sendNoteLinkShow = true
          }
        }
      )
    },
    // 发送短信链接按钮消息框弹出事件
    onClick_sendNote() {
      this.$store.commit('app/CHANGE_IMAGE', "")
      const str = '将对手机号' + this.phoneData.toString().replace(/,/g, '、') + '，发送含有小程序跳转链接的短信，请通知当事人，并约定双方进行视频通话的时间。'
      this.$confirm(str, '发送提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$axios('org/send-url-by-sms', { orderId: this.orderId, confType: 1 }).then((res) => {
          if (res.success) {
            this.$fun.msg('短信发送成功!', 'success')
            this.$store.commit('app/CHANGE_IMAGE')
          } else {
            this.$fun.msg('短信发送失败', 'error')
          }
        })
      }).catch(() => {
        this.$fun.msg('已取消', 'info')
      })
    },
    // 预览签署文书
    onClick_lookFile(e) {
      showLoading()
      de.getFileImg({ id: e.id }).then(async res => {
        if (res.data.success === true) {
          const list = res.data.data.ids
          for (const i in list) {
            const imgUrl = await this.getImg(list[i])
            list[i] = imgUrl
          }
          this.$store.commit('app/CHANGE_IMAGE', list)
          hideLoading()
        }else{
          hideLoading()
        }
      })
    },
    async showToast(text, title) {
      return this.$confirm(text, title || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },

    // 删除签署文书
    async onClick_delFile(e) {
      if (
        await this.showToast(
          this.orderInfo.signStatus === 2
            ? '当前订单已完成，删除文书后，会清空所有文书的签名，需要重新签署，确定要这样做吗？'
            : '确认删除该文书？',
          this.orderInfo.signStatus === 2 ? '风险提示' : ''
        )
      ) {
        de.delSignFile({ id: e.id }).then(res => {
          if (res.success === true) {
            this.$fun.msg('删除成功！', 'success')
            this.init()
          } else {
            this.$fun.msg('删除失败！', 'error')
          }
        })
      } else {
        this.$fun.msg('已取消删除')
      }
    },
    // 打印文书
    onClick_print(e) {
      this.$axios(
        'org/order-document-file',
        { id: e.id },
        { responseType: 'arraybuffer' }
      ).then(res => {
        const pdfUrl = window.URL.createObjectURL(
          new Blob([res], { type: 'application/pdf' })
        )
        console.log(pdfUrl)
        var date = new Date().getTime()
        var ifr = document.createElement('iframe')
        ifr.style.frameborder = 'no'
        // ifr.style.width = "100%";
        // ifr.style.height = "100%";
        ifr.style.display = 'none'
        ifr.style.pageBreakBefore = 'always'
        ifr.setAttribute('id', 'printPdf' + date)
        ifr.setAttribute('name', 'printPdf' + date)
        ifr.src = pdfUrl
        document.body.appendChild(ifr)
        this.doPrint('printPdf' + date)
        window.URL.revokeObjectURL(ifr.src) // 释放URL 对象
      })
    },
    // 打印
    doPrint(val) {
      var ordonnance = document.getElementById(val).contentWindow
      setTimeout(() => {
        // window.print()
        ordonnance.print()
        this.pdfLoading = false
      }, 100)
    },

    // 重设文书
    async onClikc_SignFile(e) {
      if (this.orderInfo.signStatus === 2) {
        if (
          !(await this.showToast(
            '当前订单已完成，重设签名区域后，会清空所有文书的签名，需要重新签署，确定要这样做吗？',
            '风险提示'
          ))
        ) {
          return
        }
      }
      this.docInfo = {
        docId: e.id,
        docName: e.fileName,
        signStatus: e.signStatus
      }
    },

    // 下载材料
    downAllFile(e) {
      if (e === 1) {
        this.$axios('org/order-annex-live-log', { orderId: this.orderId, orderNum: this.orderInfo.orderNum }, { responseType: 'blob' }).then(blob => {
          this.$fun.blobFile(blob, `${this.orderInfo.orderNum}.zip`)
        })
      }
    },

    // 开始视频
    onClick_goVideo() {
      for (const i of this.orderFileList) {
        if (i.coverStatus !== 1) {
          this.$fun.msg('有文件尚未设置签署区域', 'error')
          return
        }
      }
      this.$router.push({
        name: 'delegateVideo',
        query: {
          orderId: this.orderId
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.main-box {
  width: 100%;
  padding: 20px 20px 0;
  box-sizing: border-box;
  min-height: calc(100vh - 50px);
  background-color: #f5f5f5;
}

.item-box {
  border-radius: 5px;
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
}

.order-info {
  margin-top: 20px;
  padding: 20px 20px 0;
  box-sizing: border-box;
  border-top: 1px solid #e9e9e9;
}

.type-nav {
  height: 61px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .select-type {
    height: 60px;
    line-height: 59px;
    span {
      display: inline-block;
      margin: 0 10px;
      padding: 0 10px;
      box-sizing: border-box;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      &.act {
        color: #1890ff;
        border-color: #1890ff;
      }
    }
  }
}

.table-btn {
  color: #1890ff;
  margin-right: 20px;
  cursor: pointer;
}

.video-box {
  margin-top: 30px;
  text-align: center;
  font-size: 14px;
  div {
    margin-bottom: 30px;
    span {
      color: #1890ff;
      margin: 0 20px;
      cursor: pointer;
    }
    p {
      font-size: 12px;
      color: #999;
    }
  }
}

.form-tit {
  width: 100%;
  height: 60px;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  padding: 0 34px;
  box-sizing: border-box;
  border-bottom: 1px solid #e9e9e9;
}

.form-item-main {
  padding: 30px;
  font-size: 16px;
  box-sizing: border-box;
  section {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    .el-form-item {
      flex: 0 0 310px;
      margin-left: 10px;
      margin-right: 10px;
    }
    .el-cascader {
      width: 310px;
    }
  }
}

.img-box {
  position: relative;
  text-align: center;
  margin: 0 10px;
  img {
    display: block;
    object-fit: cover;
    border-radius: 4px;
  }
  span {
    width: 136px;
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 30px;
  }
  .mode {
    top: 0;
    left: 0;
    opacity: 0;
    width: 136px;
    height: 136px;
    border-radius: 4px;
    position: absolute;
    line-height: 136px;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    transition: 0.5s;
    span {
      margin: 0 5px;
      line-height: 136px;
      cursor: pointer;
    }
  }
  &:hover .mode {
    opacity: 1;
  }
}

.file-tips {
  margin-bottom: 30px;
  font-size: 16px;
  color: #666;
}

.file-box {
  .el-button {
    height: 50px;
    width: 168px;
    padding: 0;
    font-size: 22px;
    margin-bottom: 15px;
  }
  & /deep/ ul.el-upload-list {
    display: flex;
    flex-wrap: wrap;
    li {
      flex: 0 0 50%;
      height: 25px;
      margin-top: 10px;
    }
  }
}

.upload-demo {
  & /deep/ .el-upload-list__item:hover .el-icon-close {
    display: none;
  }
}

.upload-demo-edit {
  & /deep/ .el-upload-list__item:hover .el-icon-close {
    display: inline-block;
  }
}
.send_note_link_button{
  position: fixed;
  bottom: 94px;
  left: 50%;
  margin-left:-63px ;
  z-index: 8888;
  .el-button{
    padding:10px ;
    box-shadow: 4px 4px 5px rgba(0, 0, 0, 0.2);
  }
}
</style>
