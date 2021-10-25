<template>
  <div style="position: relative">
    <nav class="room-info">
      <div style="display:flex">
        <span>房间号：{{ roomData.roomNum }}</span>
        <div id="manList" class="man-list">
          <span id="man">{{ roomData.userId }}</span>
          <span v-for="(i,index) of videoList" :id="i" :key="index">{{ i }}</span>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="onClick_showStep">进度及签署情况</el-button>
        <el-button type="primary" :disabled="startRecor" @click="startRec">开始录制</el-button>
        <el-button type="danger" @click="endRec(1)">结束录制</el-button>
      </div>
    </nav>
    <div id="videoBox" class="vido-box">
      <div
        id="local_stream"
        class="looklookman"
        :style="{opacity: !enlargeId || enlargeId === 'local_stream' ? '1' : '0' }"
      />
      <div
        v-for="(i,index) of videoList"
        :id="'remote_stream' + i"
        :key="index"
        :class="['looklookman', enlargeId === i ? 'big' : '']"
        :style="{opacity: !enlargeId || enlargeId === i ? '1' : '0' }"
      >
        <div v-if="nonAdministratorList.indexOf(i)> -1&&addr&&addr[i] != null" :id="'address_stream' +i" :ref="'remote_stream' + i" class="addrStyle">
          <div class="addr-box" :style="{background: addr[i].showAddr ? 'rgba(0,0,0,.3)' : 'transparent'}">
            <div class="show-btn" @click="onClick_changeShowAddr(i)">
              <img v-if="addr[i].showAddr" src="./../../assets/conn/noShowAddr.png">
              <img v-else src="./../../assets/conn/showAddr.png">
            </div>
            <div class="addr-main" :style="{opacity: addr[i].showAddr ? '1' : '0'}">
              <p>{{ addr[i].name }} {{ addr[i].cardNum }}</p>
              <p>定位：{{ addr[i].status===0?'获取失败，请让当事人挂断重新进入': addr[i].addrs }}</p>
              <p>经度： {{ addr[i].status===0?'-': addr[i].lon }}</p>
              <p>纬度： {{ addr[i].status===0?'-': addr[i].lat }}</p>
            </div>
          </div>
        </div>
        <div
          v-if="nonAdministratorList.indexOf(i)> -1"
          class="prtSc"
          style="right: 4.5vw"
          @click="enlarge(i)"
        >
          <img v-if="enlargeId == i" src="./../../assets/conn/Shrink.png" alt="">
          <img v-else src="./../../assets/conn/enlarge.png" alt="">
        </div>
        <div v-if="nonAdministratorList.indexOf(i)> -1" class="prtSc" @click="screenshot(i)">
          <img src="./../../assets/conn/Screenshot.png" alt="">
        </div>
      </div>
    </div>
    <el-button class="close-video" type="danger" round icon="el-icon-switch-button" circle @click="onClick_endVideo" />
    <div v-if="showStep" class="schedule">
      <div class="schedule-close" @click="onClick_closeStep" />
      <div class="tabs_box">
        <div class="tabs_title">
          <div class="tabs_item">
            <div :class="activeName==='first'?'tabs_item_now':''" @click="onClick_cutContent('first')">进度查看</div>
            <div :class="activeName==='second'?'tabs_item_now':''" @click="onClick_cutContent('second')">签署情况</div>
          </div>
          <div class="tabs_refresh_button">
            <el-button type="primary" @click="getStep">刷新</el-button>
          </div>
        </div>
        <div>
          <div v-show="activeName==='first'">
            <el-table :data="stepList" stripe style="width: 100%" max-height='220'>
              <el-table-column prop="realName" label="姓名 \ 步骤名称" width="180" />
              <el-table-column prop="step" label="手机号授权" width="180">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.step == 0" type="info" disable-transitions>未进行任何操作</el-tag>
                  <el-tag v-if="scope.row.step == 1" type="success" disable-transitions>正在进行</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="step" label="人脸验证身份" width="180">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.needCtidFlag == 0" type="warning" disable-transitions>无人脸验证</el-tag>
                  <el-tag v-if="scope.row.step == 2 && scope.row.needCtidFlag == 1" type="success" disable-transitions>正在进行
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="step" label="阅读文书" width="180">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.step == 3 || scope.row.step == 6" type="success" disable-transitions>正在进行</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="step" label="签署文书" width="180">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.step == 4 || scope.row.step == 7" type="success" disable-transitions>正在进行</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="step" label="进入视频通话" width="180">
                <template slot-scope="scope">
                  <el-tag
                    v-if="scope.row.step == 5 || scope.row.step == 6 || scope.row.step == 7"
                    type="success"
                    disable-transitions
                  >正在进行</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="modifyTime" label="当前步骤开始时间" width="180">
                <template slot-scope="scope">
                  {{ scope.row.modifyTime && scope.row.step != 0? scope.row.modifyTime : '--' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-show="activeName==='second'">
            <el-table ref="fileTable" :data="orderFileList" style="width: 100%" max-height='245'>
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
                  <el-button type="text" @click="onClick_lookFile(scope.row)">预览</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as de from '@/api/delegate'
import RtcClient from './rtc-client'
import * as api from '@/api/delegate'
import Vue from 'vue'
import html2canvas from 'html2canvas'
import { set } from 'js-cookie'

let that = null

let ws = null // websocket
let heartBeatTimeOut = null // 心跳
let heart = '' // 心跳内容
let heartBeatFailCount = 0 // 心跳失败次数

export default {
  data() {
    return {
      orderId: '',
      roomData: {},
      rtc: null,
      localStream: null,
      cameras: null,
      startRecor: false,
      taskId: '',
      stepList: [],
      showStep: false,
      videoList: [],
      enlargeId: '',
      addr: null,
      proList: [],
      nonAdministratorList: [],
      activeName: 'first',
      orderFileList: [] // 文书列表
    }
  },
  watch: {
    'rtc.videoList': {
      async handler(nVal, oVal) {
        console.log('watch videoList', nVal)
        for (let index = 0; index < nVal.length; index++) {
          if (this.proList.indexOf(nVal[index]) < 0 && this.nonAdministratorList.indexOf(nVal[index]) < 0) {
            const res = await this.$axios('org/user-type-sign', { orderId: this.orderId, mobile: nVal[index] })
            // .then(res => {
            if (parseInt(res.data) === 2 && this.proList.indexOf(nVal[index]) < 0) {
              this.proList.push(nVal[index])
            } else if ((parseInt(res.data) === 1 && this.nonAdministratorList.indexOf(nVal[index]) < 0)) {
              this.nonAdministratorList.push(nVal[index])
            }
            // })
          }
        }
        console.log(this.proList, this.nonAdministratorList.indexOf('18503004617'), '--------------------------------------2222222222222222222222222222222222-----------------------')
        this.videoList = nVal
        this.getAddrs()
      }
    }
  },
  created() {
    that = this
    Vue.prototype.$alert('确定开始后，请点击录制开始录制视频！', '提示')
    that.orderId = that.$route.query.orderId
    window.switchDevice = that.switchDevice
    // console.log(this.judgeWho('17346702819'),'--------------------------------------2222222222222222222222222222222222-----------------------')
  },
  mounted() {
    this.useRTC()
    window.onbeforeunload = function() {
      if (ws) {
        ws.close()
        ws = null
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeunloadHandler)
    if (this.rtc != null) {
      this.rtc.leave()
    }
  },
  methods: {
    onClick_cutContent(str) {
      if (str === 'second') {
        this.getSignFileList()
      }
      this.activeName = str
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
    // 预览签署文书
    onClick_lookFile(e) {
      de.getFileImg({ id: e.id }).then(async res => {
        if (res.data.success === true) {
          const list = res.data.data.ids
          for (const i in list) {
            const imgUrl = await this.getImg(list[i])
            list[i] = imgUrl
          }
          this.$store.commit('app/CHANGE_IMAGE', list)
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
    judgeWho(val) {
      this.$axios('org/user-type-sign', { orderId: this.orderId, mobile: val }).then(res => {
        // if (parseInt(res.data)===1) {
        //  resolve(true)
        // }else{
        //  resolve(false)
        // }
        // return  await true
      })
    },
    onClick_showStep() {
      if (!this.showStep) {
        this.showStep = true
        this.getStep()
      }
    },
    onClick_closeStep() {
      this.showStep = false
    },
    // 开启websocket链接
    connectSocket() {
      const wssurl = `${this.$cfg.wssUrl}tencent-video-websocket/${this.roomData.roomNum}`
      ws = new WebSocket(wssurl)
      ws.onopen = this.wssOpen
      ws.onmessage = this.wssMsg
      ws.onclose = this.wssOnClose
    },
    // 开始连接
    wssOpen() {
      console.log('连接成功！')
      ws.send(JSON.stringify({ heart: '你想成为rapstar吗' }))
      setTimeout(() => {
        this.wssStartHeart()
      }, 10000)
    },
    // 接受websocket消息
    wssMsg(e) {
      const data = JSON.parse(e.data)
      if (data['20601'] && that.showStep) {
        that.getStep()
      }
      if (data['20602']) {
        that.getAddrs()
      }
      if (data['20603'] && that.showStep) {
        this.getSignFileList()
      }
      return e.data
    },
    // 开始心跳
    wssStartHeart() {
      console.log('socket开始心跳')
      heart = JSON.stringify({ heart: '你想成为rapstar吗' })
      this.heartBeat()
    },
    // websocket心跳
    heartBeat() {
      if (!heart) {
        return
      }
      ws.send(heart)
      if (ws.onmessage) {
        console.log('心跳成功！')
        if (heart) {
          heartBeatTimeOut = setTimeout(() => {
            this.heartBeat()
          }, 10000)
        }
      } else {
        console.log('socket心跳失败')
        if (heartBeatFailCount > 2) {
          // 重连
          this.connectSocket()
        }
        if (heart) {
          heartBeatTimeOut = setTimeout(() => {
            this.heartBeat()
          }, 10000)
        }
        heartBeatFailCount++
      }
    },
    // 结束心跳
    wssEndHeart() {
      console.log('socket结束心跳')
      heart = ''
      if (heartBeatTimeOut) {
        clearTimeout(heartBeatTimeOut)
        heartBeatTimeOut = null
      }
    },
    // websocket 断开连接
    wssOnClose(e) {
      console.log('Connection closed.')
    },
    async useRTC() {
      api
        .getVideoData({ orderId: this.orderId, username: '公证员' })
        .then(res => {
          if (res.success === true) {
            res.data.orderId = this.orderId
            that.roomData = res.data
            that.connectSocket()
            that.rtc = new RtcClient(that.roomData)
            var source = that.rtc.join()
            that.rtc.getNotify(that.$notify)
            that.cameras = source.cameras
            that.localStream = source.localStream
          } else {
            this.$fun.msg(res.msg, 'error')
            setTimeout(() => {
              that.$router.go(-1)
            }, 1000)
          }
        })
    },
    getStep() {
      if (this.activeName === 'first') {
        this.$axios('org/order-proposer-schedule-record-list', { orderId: this.orderId }).then(res => {
          if (res.success) {
            this.stepList = res.data
          }
        })
      } else {
        this.getSignFileList()
      }
    },
    startRec() {
      const dom = document.getElementById('manList').children
      if (dom.length <= 1) {
        this.$alert('请确认当事人是否进入视频通话中', '提示', {
          confirmButtonText: '我知道啦'
        })
        return
      }
      api.startVideo(`${this.orderId}/${this.roomData.userId}`).then(res => {
        if (res.success === true) {
          that.startRecor = true
          that.taskId = res.data.taskId
        } else {
          if (res.code === 20304) {
            this.$fun.msg('视频正在录制中', 'error')
          } else {
            this.$fun.msg('请重新开始录制，如有问题请联系工作人员', 'error')
          }
          that.startRecor = false
        }
      })
    },
    endRec(type) {
      // if (this.taskId !== '') {
      api.endVideo(`${this.roomData.roomNum}`).then(res => {
        if (res.success === true) {
          that.startRecor = false
          this.$fun.msg('保存视频成功！', 'success')
        } else {
          if (res.code === 20301) {
            this.$fun.msg('请先开始录制', 'warning')
          } else {
            this.$fun.msg(res.msg, 'warning')
          }
        }
      })
      // } else {
      // this.$fun.msg('请开始录制', 'warning')
      // }
    },
    onClick_endVideo() {
      if (this.rtc != null) {
        if (this.startRecor) {
          this.endRec(2)
        }
        this.rtc.leave()
      }
      if (ws) {
        this.wssEndHeart()
        ws.close()
      }
      ws = null
      that.$router.go(-1)
    },
    // 截图
    screenshot(id) {
      const videoBox = document.getElementById(`remote_stream${id}`)
      const video = videoBox.getElementsByTagName('video')[0]
      const canEle = document.createElement('canvas')
      // canEle.width = width
      canEle.height = 500
      videoBox.appendChild(canEle)
      const canvas = videoBox.getElementsByTagName('canvas')[0]
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, 300, 500)
      console.log(this.addr)

      // if (this.addr !== null) {
      if (this.addr !== null) {
        if (this.addr[id].showAddr) {
          canvas.getContext('2d').fillStyle = 'rgba(0,0,0,.3)'
          canvas.getContext('2d').fillRect(0, 0, 300, 100)
          canvas.getContext('2d').fillStyle = '#fff'
          canvas.getContext('2d').textBaseline = 'top'
          canvas.getContext('2d').font = '10pt Calibri'
          canvas.getContext('2d').fillText(`${this.addr[id].name}${this.addr[id].cardNum}`, 10, 10)
          canvas.getContext('2d').fillText(`定位：${this.addr[id].status === 1 ? this.addr[id].addrs : '获取失败，请让当事人挂断重新进入'}`, 10, 30)
          canvas.getContext('2d').fillText(`经度：${this.addr[id].status === 1 ? this.addr[id].lon : '--'}`, 10, 50)
          canvas.getContext('2d').fillText(`纬度：${this.addr[id].status === 1 ? this.addr[id].lat : '--'}`, 10, 70)
        }
      }
      const base = canvas.toDataURL('image/png', 1.0).substring(22)
      this.$axios('org/save-order-capture', { id: this.orderId, base64String: base, mobile: id }, { method: 'POST' }).then(res => {
        if (res.success) {
          this.$notify({ title: '截图成功', message: '请到详情页点击“一键下载材料”，下载截图', type: 'success', offset: 100 })
        } else {
          this.$notify({ title: '提示', message: '截图保存失败，请稍后再试', type: 'error', offset: 100 })
        }
        // canvas.remove()
      })
      // setTimeout(() => {
      //   html2canvas(na, { backgroundColor: null, width: 400, scrollX: 0, scrollY: 0, allowTaint: true, useCORS: true, position: 'fixed', left: '1px', top: '1px' }).then(async res => {
      //     if (res) {

      //       var imgUrl = await canvas.toDataURL()
      //       const data = await fetch(imgUrl)
      //       const blob = await data.blob()
      //       this.blobFile(blob, '4444')

      // this.$axios('org/save-order-capture', { id: this.orderId, base64String: base, mobile: id }, { method: 'POST' }).then(res => {
      //   if (res.success) {
      //     this.$notify({ title: '截图成功', message: '请到详情页点击“一键下载材料”，下载截图', type: 'success', offset: 100 })
      //   } else {
      //     this.$notify({ title: '提示', message: '截图保存失败，请稍后再试', type: 'error', offset: 100 })
      //   }
      // canvas.remove()
      // })
      // }
      // })
      // }, 500)
      // } else {
      // const noAddrBase = canvas.toDataURL('image/png', 1.0).substring(22)
      // this.$axios('org/save-order-capture', { id: this.orderId, base64String: noAddrBase, mobile: id }, { method: 'POST' }).then(res => {
      //   if (res.success) {
      //     this.$notify({ title: '截图成功', message: '请到详情页点击“一键下载材料”，下载截图', type: 'success', offset: 100 })
      //   } else {
      //     this.$notify({ title: '提示', message: '截图保存失败，请稍后再试', type: 'error', offset: 100 })
      //   }
      // })
      canvas.remove()
      // }

      // const videoBox = document.getElementById(`remote_stream${id}`)
      // const video = videoBox.getElementsByTagName('video')[0]
      // html2canvas(video, { backgroundColor: null }).then(async res => {
      //   var imgUrl = res.toDataURL()
      //   const data = await fetch(imgUrl)
      //   const blob = await data.blob()
      //   this.blobFile(blob, '4444')
      //   // var cv = canvas.toDataURL()
      //   // const od = await fetch(cv)
      //   // const vb = await od.blob()
      //   // const base = canvas.toDataURL('image/png', 1.0).substring(22)
      // })
    },
    onClick_changeShowAddr(i) {
      this.addr[i].showAddr = !this.addr[i].showAddr
    },
    blobFile(blob, fileName) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
      } else {
        const link = document.createElement('a')
        const body = document.querySelector('body')
        // link.setAttribute('target', 'view_window')
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
    getAddrs() {
      this.$axios('org/order-proposer-position-record-list', { orderId: this.orderId }).then(res => {
        console.log(res, '--------------------------获取地址--------------------------------')
        if (res.success && res.data !== null && res.data.length > 0) {
          const data = {}
          for (const i of res.data) {
            data[i.mobile] = {
              name: i.realName,
              cardNum: i.cardNum,
              mobile: i.mobile,
              addrs: i.position,
              lon: i.longitude,
              lat: i.latitude,
              showAddr: true,
              status: i.status
            }
          }
          this.addr = data
          // console.log(this.addr, '--------------------------获取地址--------------------------------')
        }
      })
    },
    enlarge(id) {
      if (!this.enlargeId) {
        this.enlargeId = id
      } else if (this.enlargeId === id) {
        this.enlargeId = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .room-info {
    display: flex;
    align-items: center;
    padding: 0 30px;
    box-sizing: border-box;
    height: 50px;
    position: relative;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .el-button {
      padding: 0 10px;
      height: 30px;
    }

    &>span {
      position: absolute;
      color: red;
      padding: 10px 0 0 5px;
      left: 0;
      top: 100%;
    }
  }

  .man-list {
    margin-left: 20px;
    display: flex;

    span {
      margin-right: 20px;
    }
  }

  .close-video {
    position: absolute;
    bottom: 30px;
    display: block;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 50px;
    height: 50px;
    font-size: 23px;
  }

  .schedule {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: auto;
    padding: 20px 20px 50px;
    left: 0;
    bottom: 0;
    background-color: #fff;
    box-shadow: 0 0 20px 3px rgba(0, 0, 0, .2);

    .schedule-close {
      width: 30px;
      height: 30px;
      padding: 20px;
      position: absolute;
      cursor: pointer;
      right: 0;
      top: 0;
      box-sizing: content-box;

      &::after,
      &::before {
        content: '';
        display: block;
        width: 30px;
        height: 3px;
        border-radius: 1.5px;
        background-color: #333;
        position: absolute;
        top: 33px;
      }

      &::after {
        left: 20px;
        transform: rotate(45deg);
      }

      &::before {
        right: 20px;
        transform: rotate(-45deg);
      }

    }
    .tabs_box{
      .tabs_title{
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 30px;
        border-bottom: 1px #EBEEF5 solid;
        .tabs_item{
          margin-bottom:-1px ;
          display: flex;
          flex-direction: row;
          div{
            cursor: pointer;
            padding:5px 20px;
            border: 1px #EBEEF5 solid;
          }
          .tabs_item_now{
            color: #409EFF;
            border-bottom-color:#fff ;
          }
        }
        .tabs_item>div:last-of-type{
          margin-left:-1px ;
        }
        .tabs_refresh_button{
          .el-button{
            padding: 0 15px;
            height: 30px;
            margin-left: 20px;
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .vido-box {
    height: calc(100vh - 100px);
    padding: 20px 0 0 20px;
    box-sizing: border-box;
    position: relative;
    display: flex;

    .looklookman {
      width: 30vw;
      height: 30vw;
      margin: 0 20px 20px 0;
      position: relative;
    }

    // video{
    //   height: auto !important;
    //   top: 50%;
    //   transform: translateY(-50%) rotateY(0) !important;
    // }
    .big {
      position: absolute;
      width: calc(100% - 40px);
      height: calc(100% - 40px);

      video {
        position: absolute;
        width: auto !important;
        height: 100% !important;
        left: 50%;
        top: 0;
        transform: translateX(-50%) rotateY(0) !important;
      }
    }

    .prtSc {
      width: 3vw;
      transition: .5s;
      height: 3vw;
      border-radius: 5px;
      background: rgba(112, 112, 112, 0.68);
      position: absolute;
      right: 1vw;
      bottom: 1vw;
      z-index: 9;
      cursor: pointer;

      img {
        width: 2.4vw;
        height: 2.4vw;
        display: block;
        margin-left: .3vw;
        margin-top: .3vw;
      }
    }

    .addrStyle {
      position: absolute;
      width: 100%;
      z-index: 9;
      top: 1px;
      left: 1px;

      .addr-box {
        width: 100%;
        display: flex;
        align-items: center;

        .addr-main {
          // overflow: hidden;
          color: #fff;

          p {
            margin: 5px 0;
            font-size: 14px;
          }
        }

        .show-btn {
          transition: .5s;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          flex: 0 0 40px;
          border-radius: 5px;
          background: rgba(64, 158, 255, 0.52);
          cursor: pointer;
          margin-left: 1vw;
          margin-right: 1vw;

          img {
            width: 35px;
          }
        }
      }
    }
  }
</style>
