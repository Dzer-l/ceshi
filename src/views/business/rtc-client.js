/* eslint-disable require-jsdoc */
import TRTC from 'trtc-js-sdk/trtc'
import { axios } from '@/utils/axios'

let notify = null

export default class RtcClient {
  constructor(options) {
    this.sdkAppId_ = options.sdkAppId
    this.userId_ = options.userId
    this.userSig_ = options.userSig
    this.roomId_ = options.roomNum

    this.orderId = options.orderId
    this.notaryId = null
    this.channel = null
    this.userId = null
    this.path_ = null
    this.notaryOfficeId = null
    this.isJoined_ = false
    this.isPublished_ = false
    this.localStream_ = null
    this.remoteStreams_ = []
    this.videoList = []

    // check if browser is compatible with TRTC
    TRTC.checkSystemRequirements().then(result => {
      if (!result) {
        alert(
          'Your browser is not compatible with TRTC! Please download Chrome M72+'
        )
      }
    })
  }

  // setAttr(d, e, f, g, h, j) {
  //     this.notaryId = d;
  //     this.notaryOfficeId = e;
  //     this.path_ = f;
  //     this.orderId = g;
  //     this.channel = h;
  //     this.userId = j;
  // }

  // cancelNotaryCall() {
  //     axios
  //         .get(
  //             this.path_ +
  //             "/api/notary/callAble/cancelNotaryCall?notaryId=" +
  //             this.notaryId +
  //             "&notaryOfficeId=" +
  //             this.notaryOfficeId
  //         )
  //         .then(function(res) {
  //             console.log("success");
  //         })
  //         .catch(function(e) {
  //             console.log("error");
  //         });
  // }

  // cancelMixStream() {
  //     var qs = require("qs");
  //     axios
  //         .post(
  //             this.path_ + "/api/notary/entrustOrder/cancelMixStream",
  //             qs.stringify({ orderId: this.orderId })
  //         )
  //         .then(function(res) {
  //             console.log("success");
  //         })
  //         .catch(function(e) {
  //             console.log("error");
  //         });
  // }

  getNotify(e) {
    // eslint-disable-next-line no-const-assign
    notify = e
  }
  async join() {
    if (this.isJoined_) {
      console.warn('duplicate RtcClient.join() observed')
      return
    }

    // create a client for RtcClient
    this.client_ = TRTC.createClient({
      mode: 'videoCall', // 实时通话模式
      sdkAppId: this.sdkAppId_,
      userId: this.userId_,
      userSig: this.userSig_
    })

    // 处理 client 事件
    this.handleEvents()

    try {
      // join the room
      await this.client_.join({ roomId: this.roomId_ })
      console.log('join room success')
      console.log('进房成功！')
      this.isJoined_ = true
    } catch (error) {
      console.error('failed to join room because: ' + error)
      alert('呼叫失败')
      console.log('进房错误！')
      console.log(this.sdkAppId_, this.userId_, this.userSig_)
      return
    }

    try {
      // 采集摄像头和麦克风视频流
      await this.createLocalStream({ audio: true, video: true })
      console.log('摄像头及麦克风采集成功！')
      console.log('createLocalStream with audio/video success')
    } catch (error) {
      console.error('createLocalStream with audio/video failed: ' + error)
      alert('请确认已连接摄像头和麦克风并授予其访问权限!')
      try {
        // fallback to capture camera only
        await this.createLocalStream({ audio: false, video: true })
        console.log('采集摄像头成功！')
      } catch (error) {
        console.error('createLocalStream with video failed: ' + error)
        return
      }
    }
    var cameras = null
    TRTC.getCameras().then(devices => {
      cameras = devices
      devices.forEach(dev => {
        // alert(dev.label);
        // console.log('camera label: ' + dev.label + ' deviceId: ' + dev.deviceId);
      })
    })
    this.localStream_.on('player-state-changed', event => {
      console.log(`local stream ${event.type} player is ${event.state}`)
      if (event.type === 'video' && event.state === 'PLAYING') {
        // dismiss the remote user UI placeholder
      } else if (event.type === 'video' && event.state === 'STOPPPED') {
        // show the remote user UI placeholder
      }
    })

    // 在名为 ‘local_stream’ 的 div 容器上播放本地音视频
    this.localStream_.play('local_stream')

    // publish local stream by default after join the room
    await this.publish()
    console.log('发布本地流成功！')
    var sources = {}
    sources.cameras = cameras
    sources.localStream = this.localStream_
    return sources
  }

  async leave() {
    if (!this.isJoined_) {
      console.warn('leave() - leave without join()d observed')
      console.log('请先加入房间！')
      return
    }

    if (this.isPublished_) {
      // ensure the local stream has been unpublished before leaving.
      await this.unpublish(true)
    }

    try {
      // leave the room
      await this.client_.leave()
      console.log('退房成功！')
      this.isJoined_ = false
    } catch (error) {
      console.error('failed to leave the room because ' + error)
      location.reload()
    } finally {
      if (this.localStream_ != null) {
        // 停止本地流，关闭本地流内部的音视频播放器
        this.localStream_.stop()
        // 关闭本地流，释放摄像头和麦克风访问权限
        this.localStream_.close()
        this.localStream_ = null
      }
    }
  }

  async publish() {
    if (!this.isJoined_) {
      console.log('请先加入房间再点击开始推流！')
      console.warn('publish() - please join() firstly')
      return
    }
    if (this.isPublished_) {
      console.warn('duplicate RtcClient.publish() observed')
      console.log('当前正在推流！')
      return
    }
    try {
      // 发布本地流
      await this.client_.publish(this.localStream_)
      console.log('发布本地流成功！')
      this.isPublished_ = true
    } catch (error) {
      console.error('failed to publish local stream ' + error)
      console.log('发布本地流失败！')
      this.isPublished_ = false
    }
  }

  async unpublish(isLeaving) {
    if (!this.isJoined_) {
      console.warn('unpublish() - please join() firstly')
      console.log('请先加入房间再停止推流！')
      return
    }
    if (!this.isPublished_) {
      console.warn('RtcClient.unpublish() called but not published yet')
      console.log('当前尚未发布本地流！')
      return
    }

    try {
      // 停止发布本地流
      await this.client_.unpublish(this.localStream_)
      this.isPublished_ = false
      console.log('停止发布本地流成功！')
    } catch (error) {
      console.error('failed to unpublish local stream because ' + error)
      if (!isLeaving) {
        console.warn('leaving the room because unpublish failure observed')
        this.leave()
      }
    }
  }

  async createLocalStream(options) {
    this.localStream_ = TRTC.createStream({
      audio: options.audio, // 采集麦克风
      video: options.video, // 采集摄像头
      userId: this.userId_
      // cameraId: getCameraId(),
      // microphoneId: getMicrophoneId()
    })
    // 设置视频分辨率帧率和码率
    this.localStream_.setVideoProfile('480p')
    await this.localStream_.initialize()
  }

  handleEvents() {
    // 处理 client 错误事件，错误均为不可恢复错误，建议提示用户后刷新页面
    this.client_.on('error', err => {
      console.error(err)
      alert(err)
      console.log('客户端错误：' + err)
      // location.reload();
    })

    // 处理用户被踢事件，通常是因为房间内有同名用户引起，这种问题一般是应用层逻辑错误引起的
    // 应用层请尽量使用不同用户ID进房
    this.client_.on('client-banned', err => {
      console.error('client has been banned for ' + err)
      console.log('用户被踢出房间！')
      // location.reload();
    })

    // 远端用户进房通知 - 仅限主动推流用户
    this.client_.on('peer-join', evt => {
      const userId = evt.userId
      console.log('peer-join ' + userId)
      console.log('远端用户进房 - ' + userId)
    })
    // 远端用户退房通知 - 仅限主动推流用户
    this.client_.on('peer-leave', evt => {
      const userId = evt.userId
      console.log('peer-leave ' + userId)
      console.log('远端用户退房 - ' + userId)
      // 取消公证员通话中状态
      // this.cancelNotaryCall();
      // 取消混流
      // this.cancelMixStream();
    })

    // 处理远端流增加事件
    this.client_.on('stream-added', evt => {
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      const userId = remoteStream.getUserId()
      console.log(
        `remote stream added: [${userId}] ID: ${id} type: ${remoteStream.getType()}`
      )
      console.log('远端流增加 - ' + userId)
      console.log('subscribe to this remote stream')
      // 远端流默认已订阅所有音视频，此处可指定只订阅音频或者音视频，不能仅订阅视频。
      // 如果不想观看该路远端流，可调用 this.client_.unsubscribe(remoteStream) 取消订阅
      this.client_.subscribe(remoteStream)
    })

    // 远端流订阅成功事件
    this.client_.on('stream-subscribed', evt => {
      const remoteStream = evt.stream
      const userId = remoteStream.getUserId()
      this.remoteStreams_.push(remoteStream)
      this.videoList.push(userId)
      axios(`org/enter-live-room?mobile=${userId}&orderId=${this.orderId}`)
      console.log('-----------------------------88888888888---------------------------')
      setTimeout(() => {
        remoteStream.play(`remote_stream${userId}`)
      }, 500)
    })

    // 处理远端流被删除事件
    this.client_.on('stream-removed', evt => {
      console.log(evt, '用户退出了')
      const remoteStream = evt.stream
      const id = remoteStream.getId()
      const userId = remoteStream.getUserId()
      const i = this.videoList.indexOf(userId)
      if (i !== -1) {
        this.videoList.splice(i, 1)
        axios(`org/leave-live-room?mobile=${userId}&orderId=${this.orderId}`).then(res => {
          console.log(res)
          if (res.data) {
            notify({ title: '提示', message: '当事人' + res.data + '退出房间', type: 'warning', offset: 100 })
            window.location.reload()
          }
        })
      }
      // 关闭远端流内部的音视频播放器
      remoteStream.stop()
      this.remoteStreams_ = this.remoteStreams_.filter(stream => {
        return stream.getId() !== id
      })
    })

    // 处理远端流更新事件，在音视频通话过程中，远端流音频或视频可能会有更新
    this.client_.on('stream-updated', evt => {
      const remoteStream = evt.stream
      console.log(
        'type: ' +
                remoteStream.getType() +
                ' stream-updated hasAudio: ' +
                remoteStream.hasAudio() +
                ' hasVideo: ' +
                remoteStream.hasVideo()
      )
      console.log('远端流更新！')
    })

    // 远端流音频或视频mute状态通知
    this.client_.on('mute-audio', evt => {
      console.log(evt.userId + ' mute audio')
    })
    this.client_.on('unmute-audio', evt => {
      console.log(evt.userId + ' unmute audio')
    })
    this.client_.on('mute-video', evt => {
      console.log(evt.userId + ' mute video')
    })
    this.client_.on('unmute-video', evt => {
      console.log(evt.userId + ' unmute video')
    })

    // 信令通道连接状态通知
    this.client_.on('connection-state-changed', evt => {
      console.log(
        `RtcClient state changed to ${evt.state} from ${evt.prevState}`
      )
    })
  }
}
