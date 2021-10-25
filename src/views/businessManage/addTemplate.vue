<template>
  <section id="addTemplate">
    <div class="app-container">
      <div class="template-box">
        <div class="template-info">
          <el-form ref="tempalteInfo" :model="tempalteInfo" label-width="100px" size="medium" :inline="true" style="margin-top: 30px;">
            <div class="el-form-item">
              <label class="el-form-item__label">产品名称:</label>
              <span class="template-item">{{ tempalteInfo.productName }}</span>
            </div>
            <el-form-item label="模板名称" prop="templateName" :rules="[ { required: true, message: '不能为空', trigger: 'blur'}]">
              <el-input v-model="tempalteInfo.templateName" maxlength="50" placeholder="请输入模板名称" />
            </el-form-item>
            <el-form-item label="模板类型" prop="templateType" :rules="[ { required: true, message: '请选择模板类型', trigger: 'change' }]">
              <el-select v-model="tempalteInfo.templateType" placeholder="请选择模板类型">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="template-content">
          <!-- <div class="variable-box">
             <el-tabs v-model="activeVariable" @tab-click="handleClick">
                <el-tab-pane label="系统变量" name="first">
                  <div class="system-variable">
                    <span>公证事项</span>
                    <ul>
                      <li v-for="item in systemList" :key="item.id">{{item.certName}}</li>
                    </ul>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="用户变量" name="second">
                  <div class="user-variable">
                    <div class="select-box">
                      <div class="select-item">
                        <span class="item-left">用户角色:</span>
                        <el-select v-model="userRole" size="small" class="item-right" placeholder="请选择">
                          <el-option
                            v-for="item in userRoleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="select-item">
                        <span class="item-left">用户角色:</span>
                        <el-select v-model="userRole" size="small" class="item-right" placeholder="请选择">
                          <el-option
                            v-for="item in userRoleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="checkbox-box">
                      <div v-for="(item,index) in checkboxList" :key="index">
                        <div class="checkbox-title">{{item.title}}</div>
                        <el-checkbox-group v-model="item.checkedList">
                          <div class="checkbox-group" v-if="item.itemList">
                            <el-checkbox v-for="(item2,index2) in item.itemList" :label="item2.label" :key="index2"></el-checkbox>
                          </div>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
             </el-tabs>
          </div> -->
        </div>
        <div class="align-center">
          <el-button type="primary" @click="back">返回</el-button>
          <el-button type="success" @click="saveProductTemplate">保存</el-button>
        </div>
      </div>
      <iframe name="test" frameborder="0" />
    </div>
  </section>
</template>

<script>
import { getMedium, getProductTemplateType, addProductTemplate, getOrgInfo } from '@/api/templateManage'
import { getProductInfo } from '@/api/productManage'

export default {
  data() {
    return {
      activeVariable: 'first',
      systemList: [],
      userRole: '',
      userRoleList: [],
      checkList: [], // 用户变量多选框
      checkboxList: [
        {
          title: '',
          checkedList: [],
          itemList: []
        }
      ], //
      medium: '', // 保存媒介值
      typeOptions: [], // 保存模板类型
      tempalteInfo: {
        productName: '',
        templateName: '',
        templateType: ''
      }, // 保存模板信息
      productionId: '', // 保存产品id
      http: '', // 保存网站路径前缀
      orgId: '' // 保存公证处id
    }
  },
  created() {
    this.productionId = this.$route.query.productionId
    const mode = process.env.VUE_APP_BASE_MODE
    console.log(mode)
    if (mode === 'development') {
      this.http = 'http://192.168.1.186:12009'
    } else if (mode === 'test') {
      this.http = 'https://test-onlyoffice.lvzhengyun.cn'
    } else if (mode === 'production') {
      this.http = 'https://office.lvzhengyun.cn'
    } else if (mode === 'staging') {
      this.http = 'https://test-onlyoffice.lvzhengyun.cn'
    }
    this.getOrgInfo()
    this.getTemplateType()
    this.getProductInfo() // 获取产品信息
  },
  methods: {
    // 获取公证处信息
    getOrgInfo() {
      getOrgInfo().then(res => {
        if (res.success) {
          this.orgId = res.data
          this.getMedium() // 获取媒介值
        }
      })
    },
    // 获取模板媒介值
    getMedium() {
      getMedium().then(res => {
        if (res.success) {
          this.medium = res.data
          console.log(this.http + '/page/template-open-empty?medium=' + this.medium + '&orgId=' + this.orgId + '&productionId=' + this.productionId)
          window.open(this.http + '/page/go-add-page?medium=' + this.medium + '&orgId=' + this.orgId + '&productionId=' + this.productionId, 'test')
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
            templateState: 1,
            templateType: this.tempalteInfo.templateType,
            configTemplateId: this.tempalteInfo.templateType,
            orgId: this.orgId,
            templateName: this.tempalteInfo.templateName,
            isCommonTemplate: 0,
            peopleType: 0,
            medium: this.medium,
            productionId: this.productionId
          }
          addProductTemplate(params).then(res => {
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
      this.$router.push({
        name: 'templateConfig',
        query: {
          productionId: this.productionId
        }
      })
    }
  }
}
</script>

<style lang="scss">
#addTemplate {
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
