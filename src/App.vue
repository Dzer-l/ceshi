<template>
  <div id="app" class="app">
    <router-view />
    <el-image-viewer
      v-if="imgList.length > 0"
      :on-close="closeViewer"
      :append-to-body="true"
      :modal-append-to-body="false"
      :url-list="imgList"
      :initialIndex="initialIndex"
      :onSwitch="handleSwitch"
    />
    <el-backtop v-if="topAppearance" target=".app">
      <div
        style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
      >
        <i class="el-icon-upload2" />
      </div>
    </el-backtop>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'App',
  components: { ElImageViewer },
  data() {
    return {
      imgList: [],
      topAppearance: true,
      initialIndex: 0,
      switchIndex: 0,
    }
  },
  watch: {
    '$store.state.app.imgList': function(newVal, oldVal) {
      this.imgList = newVal
    },
    '$store.state.app.initialIndex': function(newVal, oldVal) {
      this.initialIndex = newVal
      this.switchIndex = newVal
    },
    '$route': function(newval, olr) {
      if (newval.name === 'myBusiness' && olr.name === null) {
        if (sessionStorage.getItem('mypageNum')) {
          sessionStorage.removeItem('mypageNum')
        }
      } else if (newval.name === 'myBusiness' && olr.name === null) {
        if (sessionStorage.getItem('mypageNum')) {
          sessionStorage.removeItem('mypageNum')
        }
      } else if (newval.name === 'businessList' && olr.name === null) {
        if (sessionStorage.getItem('pageNum')) {
          sessionStorage.removeItem('pageNum')
        }
      } else if (newval.name === 'universalList' && olr.name === null) {
        if (sessionStorage.getItem('universalPageNum')) {
          sessionStorage.removeItem('universalPageNum')
        }
      }
      this.topAppearance = !(newval.name === 'entryDetailsOrder')
    },
    switchIndex(newValue, oldValue){
      if (this.imgList.length > 3 && oldValue === this.imgList.length -1 && newValue === 0) {
        this.$message({
          message: '当前是第一张图片',
          type: 'success',
          showClose: false,
          duration: 1500,
        })
      }
    }
  },
  methods: {
    closeViewer() {
      this.$store.commit('app/CHANGE_IMAGE')
      this.$store.commit('app/CHANGE_INITIALINDEX')
      this.$store.commit('app/MASK_CHANGE', true)
    },
    handleSwitch(val){
      this.switchIndex = val
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
  overflow: auto;
}

.el-image-viewer__wrapper /deep/ .el-icon-circle-close {
  color: #fff;
}

.el-image-viewer__wrapper /deep/ .el-image-viewer__next,
.el-image-viewer__wrapper /deep/ .el-image-viewer__prev {
  color: #000;
  background-color: #fff;
}
#app /deep/ .el-backtop {
  bottom: 110px !important;
  right: 30px !important;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(48, 65, 86);
  border-radius: 3px;
}
/* loading图层 */
.el-loading-mask {
  z-index: 9999 !important;
}
/* 图片预览图层 */
.el-image-viewer__wrapper {
	z-index: 4999 !important;
}
/* $comfirm图层 */
/* .el-message-box__wrapper{
  z-index: 6000 !important;
} */
</style>
