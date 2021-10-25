<template>
  <section id="editTemplate">
    <div class="app-container">
      <div class="template-box">
        <div class="template-info">
          <el-form ref="tempalteInfo" :model="tempalteInfo" label-width="100px" size="medium" :inline="true" style="margin-top: 30px;">
            <div class="el-form-item">
              <label class="el-form-item__label">产品名称:</label>
              <span class="template-item">{{ tempalteInfo.productName }}</span>
            </div>
            <el-form-item label="模板名称" prop="templateName" :rules="[ { required: true, message: '不能为空', trigger: 'blur'}]">
              <el-input v-model="tempalteInfo.templateName" placeholder="请输入模板名称" maxlength="50" />
            </el-form-item>
            <el-form-item label="模板类型" prop="templateType">
              <el-select v-model="tempalteInfo.templateType" placeholder="请选择模板类型">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
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
import { getProductTemplateType, getOrgInfo, getTemplateInfo, updateTemplateInfo } from '@/api/templateManage'
import { getProductInfo } from '@/api/productManage'

export default {
  data() {
    return {
      medium: '', // 保存媒介值
      typeOptions: [], // 保存模板类型
      tempalteInfo: {
        productName: '',
        templateName: '',
        templateType: '',
        templatePath: ''
      }, // 保存模板信息
      productionId: '', // 保存产品id
      http: '', // 保存网站路径前缀
      orgId: '', // 保存公证处id
      templateId: '' // 保存模板id
    }
  },
  created() {
    const { productionId, templateId } = this.$route.query
    this.productionId = productionId
    this.templateId = templateId
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
    this.getTemplateType()
    this.getProductInfo() // 获取产品信息
    this.getTemplateInfo()
    this.getOrgInfo()
  },
  methods: {
    // 获取公证处信息,并根据公证处id,产品id等打开编辑器
    getOrgInfo() {
      getOrgInfo().then(res => {
        if (res.success) {
          this.orgId = res.data
          console.log(this.http + '/page/go-edit-page/' + this.orgId + '/' + this.productionId + '/' + this.templateId, '--------------------------00000000000-------------------------')
          window.open(this.http + '/page/go-edit-page/' + this.orgId + '/' + this.productionId + '/' + this.templateId, 'pageOffice')
          // POBrowser.openWindowModeless(this.http + '/page/edit-template/' + this.orgId + '/' + this.productionId + '/' + this.templateId, 'width=1200px;height=800px;')
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
        }
      })
    },
    // 获取模板类型分类
    getTemplateType() {
      getProductTemplateType().then(res => {
        if (res.success) {
          const temp = res.data; const arr = []
          for (const key in temp) {
            if (temp[key] !== '全部') {
              arr.push({
                value: key,
                label: temp[key]
              })
            }
          }
          this.typeOptions = arr
        }
      })
    },
    // 获取产品信息
    getProductInfo() {
      const param = {
        id: this.productionId
      }
      getProductInfo(param).then(res => {
        if (res.success) {
          this.tempalteInfo.productName = res.data.productionName
        }
      })
    },
    // 新增产品模板
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
            isCommonTemplate: 0,
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
      this.$router.go(-1)
      // this.$router.push({
      //   path: '/businessManage/productManage/templateConfig',
      //   query: {
      //     productionId: this.productionId
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">
#editTemplate {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    padding: 10px;
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
      .template-content{
        display: flex;
        margin-top: 20px;
        .variable-box{
          flex: 1;
          border: 1px solid #ccc;
          .select-box{
            border-bottom: 1px solid #ccc;
            padding: 10px 20px;
          }
          .select-item{
            display: flex;
            margin-bottom: 20px;
            .item-left{
              flex: 1;
              text-align: right;
              line-height: 32px;
              margin-right: 10px;
            }
            .item-right{
              flex: 2;
            }
          }
          .checkbox-box{
            padding: 20px;
            .checkbox-title{
              margin-bottom: 20px;
              color: #666;
              font-size: 15px;
            }
            .checkbox-group{
              display: flex;
              flex-flow: row wrap;
            }
            .el-checkbox{
              width: 50%;
              margin-right: 0;
              margin-bottom: 20px;
            }
          }
        }
        .office-box{
          flex: 3;
          border: 1px solid #ccc;
          margin-left: 20px;
        }
        .system-variable{
          padding: 10px;
          ul{
            padding-left: 0px;
          }
          li{
            list-style: none;
            position: relative;
            font-size: 14px;
            cursor: pointer;
            padding: 10px 20px;
            border-top: 1px solid #ccc;
          }
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
