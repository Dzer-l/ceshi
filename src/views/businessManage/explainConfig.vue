<template>
  <section id="editGeneraltemplate">
    <div class="app-container">
      <div class="template-box">
        <div class="editor-box">
          <div class="label">说明:</div>
          <div id="explainEditor" />
        </div>
        <div class="btn-box">
          <el-button type="primary" @click="back">返回</el-button>
          <el-button type="success" @click="saveProductDes">保存</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getProductInfo, updateProductDes } from '@/api/productManage'
import wangEditor from 'wangeditor'

export default {
  data() {
    return {
      productionId: '',
      editorData: ''
    }
  },
  mounted() {
    const editor = new wangEditor(`#explainEditor`)

    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml
    }

    // 创建编辑器
    editor.create()

    this.editor = editor
  },
  created() {
    this.productionId = this.$route.query.productionId
    console.log(this.productionId)
    this.getProductInfo()
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy()
    this.editor = null
  },
  methods: {
    // 获取产品信息
    getProductInfo() {
      const param = {
        id: this.productionId
      }
      getProductInfo(param).then(res => {
        if (res.success) {
          this.editor.txt.html(res.data.productionDes)
        }
      })
    },
    // 返回
    back() {
      this.$router.push({ path: '/businessManage/index' })
    },
    // 保存
    saveProductDes() {
      const param = {
        id: this.productionId,
        productionDes: this.editor.txt.html()
      }
      updateProductDes(param).then(res => {
        if (res.success) {
          this.$fun.msg('保存成功', 'success')
          this.back()
        }
      })
    }
  }
}
</script>

<style lang="scss">
#editGeneraltemplate {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    .template-box{
      background: #fff;
      padding: 50px;
      margin-bottom: 20px;
      position: relative;
      min-height: calc(100vh - 80px);
    }
    .editor-box{
      display: flex;
    }
    .label{
      text-align: right;
      margin-right: 10px;
    }
    #explainEditor{
      flex:10
    }
    .btn-box{
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
