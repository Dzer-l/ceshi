<template>
  <div>
    <el-dialog
      :visible.sync="isShow"
      class="sign-dialog"
      :width="200 + (590 * isSize) + 'px'"
      :before-close="clearData"
    >
      <div v-if="docInfoList.length == 0" class="no-list">
        <span>上传注意事项：当前仅能识别.pdf .doc .docx三种格式的文件。为了避免签名区域设置出错，请上传纸张大小为<span style="color: red">A4</span>或<span style="color: red">A3</span>的文件</span>
        <el-upload
          action
          :show-file-list="false"
          :multiple="true"
          :http-request="upLoadFile"
          :data="{ type: 'all' }"
        >
          <el-button type="primary">上传签署文件</el-button>
        </el-upload>
      </div>
      <div v-else class="have-list">
        <div class="up-tit">
          <span>设置签名区域</span>
          <el-upload
            v-if="isBtn"
            action
            :show-file-list="false"
            :multiple="true"
            :http-request="upLoadFile"
            :data="{ type: 'push' }"
          >
            <el-button type="primary">增加文件</el-button>
          </el-upload>
        </div>
        <div class="doc-list">
          <div v-for="(i, index) in docInfoList" :key="'docInfo' + index">
            <span
              v-if="editList > index"
              style="color:#67c23a"
            >已设置区域</span>
            <span v-if="editList == index" style="color:#f56c6c">正在编辑</span>
            <span
              v-if="editList < index"
              style="color:#909399"
            >未设置区域</span>
            <span>{{ i.docName }}</span>
            <span @click="onClikc_delDoc(i, index)">删除</span>
          </div>
        </div>
        <div class="select-man">
          <div>
            <span>选择当事人:</span>
            <el-checkbox-group v-model="selectMan">
              <el-checkbox
                v-for="(man, index) in manList"
                :key="man.proposerId"
                :label="index"
              >{{ man.realName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="select-man">
          <div style="margin-left: 90px">
            <el-button
              type="primary"
              @click="addNowPage"
            >添加到当前页</el-button>
            <el-button
              type="primary"
              @click="addAllPage"
            >添加到每一页</el-button>
          </div>
          <div>第{{ editIndex + 1 }}页 / 共{{ imgList.length }}页</div>
        </div>
        <el-button
          type="primary"
          style="margin: 40px auto 10px;display:block"
          @click="onClick_submitSign"
        >{{
          editList + 1 == docInfoList.length
            ? "完成"
            : "保存当前文书设置，并进入下一份"
        }}</el-button>
        <div ref="signFileBox" class="sign-box" :style="{width:(590 * isSize) + 'px'}">
          <i class="el-icon-caret-left prev" @click="onClick_pagePrev" />
          <i class="el-icon-caret-right next" @click="onClick_pageNext" />
          <template v-for="(img, index) in imgList">
            <img
              v-if="editIndex === index"
              :ref="'signFile' + index"
              :key="'signFile' + index"
              :src="img"
              :width="590 * isSize"
              @click="lookImg(index)"
            >
          </template>
          <template v-for="(man, i) in signList">
            <span
              v-if="man.page == editIndex + 1"
              :key="'man' + i"
              class="sign-area"
              :style="{
                left: man.lowLeftX ? man.lowLeftX + 'px' : (i % 5) * 110 + 'px',
                bottom: man.lowLeftY
                  ? man.lowLeftY + 'px'
                  : `calc(90% - ${parseInt(i / 5) * 40}px - ${parseInt(
                    i / 5
                  )}%)`
              }"
              width="590"
              @mousedown="onMouseDown($event, i)"
            >
              {{ man.realName }}签名区
              <i
                class="el-icon-delete-solid"
                @mousedown.stop
                @click.stop="onClick_delSignMan(i)"
              />
            </span>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as de from '@/api/delegate'
export default {
  props: {
    show: Boolean,
    ID: String,
    manList: Array, // 委托人列表
    docInfo: Object // 文书信息
  },
  data() {
    return {
      isShow: false, // 是否显示
      upFileList: [], // 批量上传列表
      docInfoList: [], // 文书列表
      imgList: [], // 文书图片列表
      selectMan: [], // 选择的委托人
      signList: [], // 签名列表
      editIndex: 0, // 当前编辑页数
      editList: 0, // 当前编辑文件
      isUp: false, // 是否正在上传
      isBtn: true,
      isSize: 1
    }
  },

  watch: {
    show(newVal, oldVal) {
      this.isShow = newVal
    },
    signList(newVal, oldVal) {
      if (newVal.length > 0) {
        this.isShow = true
      }
    },
    docInfo(newVal, oldVal) {
      this.docInfoList = [newVal]
      this.getDocImg(newVal.docId)
      this.isBtn = false
      this.isShow = true
    }
  },

  methods: {
    // 获取文书图片列表
    getDocImg(id) {
      de.getFileImg({ id: id }).then(async res => {
        if (res.data.success == true) {
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
    async getImg(id) {
      return await this.$axios(`org/order-document-preview-img/${id}`).then(
        async res => {
          if (res.success) {
            return 'data:image/png;base64,' + res.data
          }
        }
      )
    },
    // 获取签名列表
    getSignList(id) {
      de.getSignDiv({ orderDocumentId: id }).then(res => {
        if (res.success === true) {
          if (res.data != null || res.data.length !== 0) {
            const list = JSON.parse(JSON.stringify(res.data))
            this.signList = list
          }
        }
      })
    },
    // 添加到当前页
    addNowPage() {
      if (this.selectMan.length === 0) {
        this.$fun.msg('请选择要添加的委托人', 'error')
        return
      }
      for (const i of this.selectMan) {
        const sel = JSON.parse(JSON.stringify(this.manList[i]))
        sel.page = this.editIndex + 1
        sel.orderDocumentId = this.docInfoList[this.editList].docId
        this.signList.push(sel)
      }
      this.selectMan = []
    },
    // 添加到所有页
    addAllPage() {
      if (this.selectMan.length == 0) {
        this.$fun.msg('请选择要添加的委托人', 'error')
        return
      }
      for (const i in this.imgList) {
        for (const j of this.selectMan) {
          const sel = JSON.parse(JSON.stringify(this.manList[j]))
          sel.page = parseInt(i) + 1
          sel.orderDocumentId = this.docInfoList[this.editList].docId
          this.signList.push(sel)
        }
      }
      this.selectMan = []
    },
    // 上一页
    onClick_pagePrev() {
      if (this.editIndex > 0) {
        this.editIndex--
      }
    },

    // 下一页
    onClick_pageNext() {
      if (this.editIndex < this.imgList.length - 1) {
        this.editIndex++
      }
    },
    // 文件多选上传
    upLoadFile(e) {
      const typeList = ['.doc', '.pdf', '.docx']
      const file = e.file
      const fileType = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      const isFile = typeList.indexOf(fileType) != -1
      const isLt15M = file.size / 1024 / 1024 < 30
      const dataType = e.data.type
      if (!isFile) {
        this.$fun.msg('请上传pdf、doc、docx格式的文件!', 'error')
        return false
      }
      if (!isLt15M) {
        this.$fun.msg('上传文件的大小应小于30M', 'error')
        return false
      }
      this.upFileList.push(e.file)
      if (!this.isUp) {
        this.isUp = true
        setTimeout(() => {
          this.upLoadAll(dataType)
        }, 1000)
      }
    },
    upLoadAll(type) {
      // this.$fun.msg('开始上传', 'success')
      const formData = new FormData()
      for (const i in this.upFileList) {
        formData.append('file', this.upFileList[i])
      }
      formData.append('orderId', this.ID)
      this.$axios('org/order-document', formData, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => {
        if (res.success) {
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
        } else {
          this.$fun.msg(res.msg || '上传失败！', 'error')
        }
      })
      this.upFileList = []
      this.isUp = false
    },

    // 删除文件
    onClikc_delDoc(e, i) {
      this.$confirm('确认删除该文书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          de.delSignFile({ id: e.docId }).then(res => {
            if (res.success) {
              this.$fun.msg('删除成功！', 'success')
              this.docInfoList.splice(i, 1)
              if (!this.docInfoList.length) {
                this.isShow = false
                this.$emit('sucSign')
                return
              }
              if (this.editList < i) {
                return
              }
              if (i < this.editList) {
                this.editList--
              } else if (i == this.editList || i == this.editList + 1) {
                if (this.editList > 0) {
                  this.editList--
                }
                this.getDocImg(this.docInfoList[this.editList].docId)
              }
            } else {
              this.$fun.msg('删除失败！', 'error')
            }
          })
        })
        .catch(() => {
          this.$fun.msg('已取消删除')
        })
    },
    // 签名区域拖拽
    onMouseDown(e, spanIndex) {
      const el = e.target
      const defLeft = el.style.left // 初始left
      const defTop = el.style.bottom // 初始bottom
      const disX = e.clientX - el.offsetLeft
      const disY = e.clientY - el.offsetTop
      const he = 842 // 最后一张图片长度

      document.onmousemove = e => {
        const left = e.clientX - disX
        const bto = he - (e.clientY - disY) - 40
        el.style.left = left + 'px'
        el.style.bottom = bto + 'px'
      }

      document.onmouseup = e => {
        if (e.target.offsetLeft < 0 || e.target.offsetLeft > 490 + (590 * (this.isSize - 1))) {
          el.style.left = defLeft
          el.style.bottom = defTop
        }

        if (e.target.offsetTop < 0 || e.target.offsetTop > he - 40) {
          el.style.left = defLeft
          el.style.bottom = defTop
        }
        this.signList[spanIndex].lowLeftX = e.target.offsetLeft
        this.signList[spanIndex].lowLeftY = he - el.offsetTop - 40

        document.onmousemove = null
        document.onmouseup = null
      }
    },
    // 删除签名区
    onClick_delSignMan(i) {
      this.signList.splice(i, 1)
    },
    // 签名区域提交
    onClick_submitSign() {
      const orderProposerDocumentSigns = this.signList
      if (orderProposerDocumentSigns.length === 0) {
        this.$fun.msg('您还未设置签名区', 'error')
        return
      }

      this.$axios(
        'org/order-proposer-document-sig-region',
        orderProposerDocumentSigns,
        { method: 'post' }
      ).then(res => {
        if (res.success) {
          this.signList = []
          this.editIndex = 0
          this.$fun.msg('签名区域设置成功！', 'success')
          if (this.editList == this.docInfoList.length - 1) {
            this.isShow = false
            this.clearData()
            return
          }
          this.editList++
          this.getDocImg(this.docInfoList[this.editList].docId)
        }
      })
    },
    clearData() {
      this.isShow = false
      this.isBtn = true
      this.signList = []
      this.imgList = []
      this.selectMan = []
      this.upFileList = []
      this.docInfoList = []
      this.editList = 0
      this.editIndex = 0
      this.isSize = 1
      this.$emit('sucSign')
    }
  }
}
</script>

<style lang="less" scoped>
.sign-dialog {
  & /deep/ .el-dialog {
    .el-dialog__body,
    .el-dialog__header {
      padding-top: 20px;
    }
  }
}

.no-list {
  text-align: center;
  line-height: 30px;
  padding: 0 40px;
  box-sizing: border-box;
  .el-button {
    display: block;
    margin-left: auto;
    margin-top: 30px;
  }
}

.have-list {
  .up-tit {
    display: flex;
    height: 54px;
    justify-content: space-between;
    align-items: center;
    span {
      font-size: 16px;
    }
    .el-button {
      margin-left: 20px;
      padding: 7px 12px;
      font-size: 14px;
    }
  }
  .doc-list {
    padding-top: 15px;
    max-height: 92px;
    box-sizing: border-box;
    overflow: auto;
    border-top: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    div {
      width: 50%;
      height: 20px;
      line-height: 20px;
      display: inline-block;
      margin-bottom: 15px;
      font-size: 14px;
      span {
        width: 60%;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:first-child {
          width: 60px;
        }
        &:nth-child(2) {
          margin: 0 20px;
        }
        &:last-child {
          width: 30px;
          color: #1989fa;
        }
      }
    }
  }
}

.select-man {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
  & > div {
    display: flex;
    align-items: center;
    & /deep/ .el-checkbox-group {
      display: inline-block;
      margin: 0 10px 0 0;
      .el-checkbox {
        display: inline-flex;
        align-items: center;
        margin-right: 10px;
        span {
          max-width: 60px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 5px;
        }
      }
    }
    .el-button {
      padding: 7px 12px;
      font-size: 14px;
    }
  }
}

.sign-box {
  margin-left: 80px;
  height: 842px;
  position: relative;
  & > div {
    overflow-x: auto;
  }
  img {
    display: block;
    float: left;
    user-select: none;
  }
  .sign-area {
    position: absolute;
    left: 0;
    text-align: center;
    width: 100px;
    height: 40px;
    font-size: 12px;
    padding: 0 5px;
    color: red;
    box-sizing: border-box;
    background-color: rgba(255, 0, 0, 0.3);
    border-radius: 4px;
    cursor: pointer;
    border: 1px dashed red;
    user-select: none;
    line-height: 38px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    i {
      position: absolute;
      font-size: 12px;
      top: 0;
      right: 0;
    }
  }
  .prev {
    top: 50%;
    left: -50px;
    cursor: pointer;
    font-size: 40px;
    position: absolute;
    transform: translateY(-50%);
  }
  .next {
    top: 50%;
    right: -50px;
    cursor: pointer;
    font-size: 40px;
    position: absolute;
    transform: translateY(-50%);
  }
}
</style>
