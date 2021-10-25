<template>
  <section id="editGeneralTemplate">
    <div class="app-container">
      <div class="template-box">
        <div class="template-info">
          <el-form ref="tempalteInfo" :model="tempalteInfo" label-width="100px" size="medium" :inline="true" style="margin-top: 30px;">
            <el-form-item label="模板名称" prop="templateName" :rules="[ { required: true, message: '不能为空', trigger: 'blur'}]">
              <el-input v-model="tempalteInfo.templateName" placeholder="请输入模板名称" maxlength="50" />
            </el-form-item>
            <div class="el-form-item">
              <label class="el-form-item__label">模板类型:</label>
              <span class="template-item">{{ tempalteInfo.templateTypeDesc }}</span>
            </div>
          </el-form>
        </div>
        <div class="align-center">
          <el-button type="primary" @click="back">返回</el-button>
          <el-button type="success" @click="saveProductTemplate">保存</el-button>
        </div>
      </div>
      <iframe name="pageOffice" frameborder="0" />
    </div>
  </section>
</template>

<script>
import { getOrgInfo, getTemplateInfo, updateTemplateInfo } from '@/api/templateManage'

export default {
  data() {
    return {
      tempalteInfo: {
        templateName: '',
        templateType: '',
        templatePath: '',
        templateTypeDesc: ''
      }, // 保存模板信息
      http: '', // 保存网站路径前缀
      orgId: '', // 保存公证处id
      templateId: '' // 保存模板id
    }
  },
  created() {
    this.templateId = this.$route.query.templateId
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
    this.getTemplateInfo()
    this.getOrgInfo()
  },
  methods: {
    // 获取公证处信息,并根据公证处id,产品id等打开编辑器
    getOrgInfo() {
      getOrgInfo().then(res => {
        if (res.success) {
          this.orgId = res.data
          window.open(this.http + '/page/go-edit-page/' + this.orgId + '/0/' + this.templateId, 'pageOffice')
          // POBrowser.openWindowModeless(this.http +'/page/edit-template/'+this.orgId+'/0/'+this.templateId,'width=1200px;height=800px;');
        }
      })
    },
    // 获取模板信息
    getTemplateInfo() {
      const param = {
        templateId: this.templateId
      }
      console.log(param)
      getTemplateInfo(param).then(res => {
        if (res.success) {
          this.tempalteInfo.templateName = res.data.templateName
          this.tempalteInfo.templateType = res.data.templateType
          this.tempalteInfo.templatePath = res.data.templatePath
          this.tempalteInfo.templateTypeDesc = res.data.templateTypeDesc
        }
      })
    },
    // 保存通用模板
    saveProductTemplate() {
      this.$refs['tempalteInfo'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.templateId,
            templateState: 1,
            templateType: this.tempalteInfo.templateType,
            configTemplateId: this.tempalteInfo.templateType,
            orgId: this.orgId,
            templateName: this.tempalteInfo.templateName,
            templatePath: this.tempalteInfo.templatePath,
            isCommonTemplate: 1,
            peopleType: 0
          }
          updateTemplateInfo(params).then(res => {
            if (res.success) {
              this.back()
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        }
      })
    },
    // 返回上一页面
    back() {
      this.$router.push({ path: '/businessManage/templateManage' })
    }
  }
}
</script>

<style lang="scss">
#editGeneralTemplate {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    .template-box{
      background: #fff;
      padding: 20px;
      margin-bottom: 20px;
      position: relative;
      min-height: calc(100vh - 80px);
      .template-info{
        font-size: 15px;
        .template-item{
          margin: 0 40px 0 5px;
        }
      }
    }
    .el-tabs__nav{
      width: 100%;
    }
    .el-tabs__active-bar{
      width: 50% !important;
    }
    .el-tabs__item{
      width: 50%;
      text-align: center;
      height: 45px;
      line-height: 45px;
    }
    .align-center{
      text-align: center;
    }
  }
}
</style>
