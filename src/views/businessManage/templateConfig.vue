<template>
  <div class="app-container">
    <div class="main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="文书模板" name="first">
          <div class="search-box">
            <div>
              <span class="title">模板名称:</span>
              <el-input v-model="listQuery.templateName" placeholder="请输入模板名称" size="medium" />
            </div>
            <div>
              <span class="title">模板类型:</span>
              <el-select v-model="listQuery.templateType" placeholder="请选择模板类型" size="medium">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div>
              <span class="title">模板状态:</span>
              <el-select v-model="listQuery.templateState" placeholder="请选择模板状态" size="medium">
                <el-option label="全部" value="0" />
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="2" />
              </el-select>
            </div>
            <div style="min-width:155px;flex:1;">
              <el-button type="primary" size="medium" @click="search()">搜索</el-button>
              <el-button size="medium" @click="reset()">重置</el-button>
            </div>
          </div>
          <div class="table-box">
            <div class="align-right">
              <el-button size="medium" type="primary" style="margin-bottom:10px" @click="showTemplateDialog()">引用</el-button>
              <el-button size="medium" type="primary" style="margin-bottom:10px" @click="linkTo('addTemplate',productionId)">新增</el-button>
              <el-button size="medium" type="primary" style="margin-bottom:10px" @click="deleteMultiTemplate">删除</el-button>
            </div>
            <el-table
              :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @selection-change="templateSelectionChange"
            >
              <el-table-column type="selection" :selectable="canSelect" align="center" width="55" />
              <el-table-column label="模板名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.templateName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="模板类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.isCommonTemplate">{{ scope.row.templateTypeDesc }}(通用)</span>
                  <span v-else>{{ scope.row.templateTypeDesc }}</span>
                </template>
              </el-table-column>
              <el-table-column label="模板状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.templateState===1" class="enable-color">已启用</span>
                  <span v-else class="disable-color">已禁用</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.isCommonTemplate===0" class="span-btn" @click="linkTo('editTemplate',productionId,scope.row.id)">编辑</span>
                  <span v-else-if="scope.row.isCommonTemplate===1" class="disable-btn" title="通用模板请到通用模板管理页面编辑">编辑</span>
                  <span v-if="scope.row.templateState===1 && scope.row.isCommonTemplate===0" class="span-btn" @click="confirmEnableDialog(scope.row,'disable')">禁用</span>
                  <span v-else-if="scope.row.templateState===2 && scope.row.isCommonTemplate===0" class="span-btn" @click="confirmEnableDialog(scope.row,'enable')">启用</span>
                  <span v-if="scope.row.templateState === 2 && scope.row.isCommonTemplate === 0" class="span-btn" @click="confirmDeleteTemplate(scope.row,'unCommon')">删除</span>
                  <span v-if="scope.row.isCommonTemplate === 1" class="span-btn" @click="confirmDeleteTemplate(scope.row,'common')">删除</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-show="total>0"
              :page-size="listQuery.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :current-page.sync="listQuery.pageNum"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @current-change="getPaginationList"
              @size-change="handleSizeChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="参考模板" name="second">
          <referenceTemplate v-if="activeName==='second'" />
        </el-tab-pane>
      </el-tabs>

    </div>
    <router-view />
    <el-dialog title="引用通用模板" :visible.sync="templateDialogVisible" @close="closeTemplateDialog">
      <el-table
        key="2"
        v-loading="templateListLoading"
        :data="templateList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="quoteSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column label="模板名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.templateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模板类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.templateTypeDesc }}(通用)</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeTemplateDialog()">取消</el-button>
        <el-button type="primary" @click="confirmUseTemplate()">确认</el-button>
      </div>
    </el-dialog>
  </div>
  <!-- <router-view></router-view> -->
</template>

<script>
import { getProductTemplateList, getProductTemplateType, searchProductTemplateList, deleteProductTemplate, deleteCommonProductTemplate, deleteMultiProductTemplate, updateProductState, getUnusedTemplateInfo, saveUnusedTemplate, getCommonTemplateNum } from '@/api/templateManage'
import referenceTemplate from '../../components/businessManage/referenceTemplate'
export default {
  components: {
    referenceTemplate
  },
  data() {
    return {
      activeName: 'first',
      tableKey: 0,
      list: [],
      templateList: [],
      listLoading: true,
      templateListLoading: true,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        templateName: null,
        templateType: null,
        templateState: null
      },
      total: 0, // 信息条数
      tempUserId: undefined, // 零时存放userId
      selectedRows: [], // 保存被选中项
      selectedQuoteRows: [], // 保存引用列表被选中行
      typeOptions: [],
      templateDialogVisible: false,
      productionId: '', // 保存产品id
      selectRows: []// 保存table中被选中的行
    }
  },
  created() {
    this.productionId = this.$route.query.productionId
    this.getList()
    this.getTemplateType()
  },
  methods: {
    getList() {
      const param = {
        productionId: this.productionId,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      getProductTemplateList(param).then(res => {
        this.listLoading = false
        if (res.success && res.data) {
          this.total = res.data.total
          this.list = res.data.list
        }
      })
    },
    handleClick() {},
    // 获取模板类型分类
    getTemplateType() {
      getProductTemplateType().then(res => {
        if (res.success) {
          const temp = res.data; const arr = []
          for (const key in temp) {
            arr.push({
              value: key,
              label: temp[key]
            })
          }
          this.typeOptions = arr
        }
      })
    },
    // 搜索列表
    search() {
      const param = {
        productionId: this.productionId,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        orgTemplateVO: {
          templateName: this.listQuery.templateName,
          templateType: this.listQuery.templateType,
          templateState: this.listQuery.templateState
        }
      }
      searchProductTemplateList(param).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.list = res.data.list
        }
      })
    },
    // 重置列表
    reset() {
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        templateName: null,
        templateType: null,
        templateState: null
      }
      this.getList()
    },
    // 判断表格row能否勾选
    canSelect(row, rowIndex) {
      if (row.isCommonTemplate === 1 || (row.isCommonTemplate === 0 && row.templateState === 2)) {
        return true
      } else {
        return false
      }
    },
    // 打开启用禁用对话框
    confirmEnableDialog(row, type) {
      if (type === 'disable') {
        this.$confirm('是否确认禁用此模板？', '禁用模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row)
          const param = {
            id: row.id,
            templateState: 2, // 禁用状态
            templateType: row.templateType,
            configTemplateId: row.configTemplateId,
            orgId: row.orgId,
            templatePath: row.templatePath,
            templateName: row.templateName,
            isCommonTemplate: row.isCommonTemplate,
            peopleType: row.peopleType,
            productionId: this.productionId
          }
          updateProductState(param).then(res => {
            if (res.success) {
              this.$fun.msg('禁用模板成功', 'success')
              this.getList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (type === 'enable') {
        const templateParam = {
          productionId: this.productionId,
          templateType: row.templateType
        }
        const arr = []
        let content = ''
        const stateResult = new Promise((resolve, reject) => {
          getCommonTemplateNum(templateParam).then(res => {
            if (res.success) {
              if (res.data > 1) {
                content = '是否确认启用此模板？启用后之前已启用的同类型模板将被禁用（已引用的同类型通用模板将被删除，删除只对该产品生效'
                resolve()
              } else {
                content = '是否确认启用此模板？'
                resolve()
              }
            } else {
              reject()
            }
          })
        })
        arr.push(stateResult)
        Promise.all(arr).then(res => {
          this.$confirm(content, '启用模板', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(row)
            const param = {
              id: row.id,
              templateState: 1, // 禁用状态
              templateType: row.templateType,
              configTemplateId: row.configTemplateId,
              orgId: row.orgId,
              templatePath: row.templatePath,
              templateName: row.templateName,
              isCommonTemplate: row.isCommonTemplate,
              peopleType: row.peopleType,
              productionId: this.productionId
            }
            updateProductState(param).then(res => {
              if (res.success) {
                this.$fun.msg('启用模板成功', 'success')
                this.getList()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '查询失败'
            })
          })
        })
      }
    },
    // 确定删除模板
    confirmDeleteTemplate(row) {
      let des = ''
      if (row.isCommonTemplate) { // 是通用模板
        des = '是否确认为该产品删除此通用模板？删除只对该产品生效。'
      } else {
        des = '是否确认删除已勾选的模板？'
      }
      this.$confirm(des, '禁用模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        const param = {
          productionId: this.productionId,
          templateId: row.id
        }
        if (row.isCommonTemplate) {
          deleteCommonProductTemplate(param).then(res => {
            if (res.success) {
              this.$fun.msg('成功删除此模板', 'success')
              this.getList()
            }
          })
        } else {
          deleteProductTemplate(param).then(res => {
            if (res.success) {
              this.$fun.msg('成功删除此模板', 'success')
              this.getList()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除多个模板
    deleteMultiTemplate() {
      this.$confirm('是否确认删除已勾选的模板？', '删除模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          productionId: this.productionId,
          list: this.selectedRows
        }
        deleteMultiProductTemplate(param).then(res => {
          if (res.success) {
            this.$fun.msg('删除成功', 'success')
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getPaginationList(e) {
      this.listQuery.pageNum = e
      this.getList()
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    // 显示通用模板材料对话框
    showTemplateDialog() {
      const param = {
        productionId: this.productionId
      }
      this.templateDialogVisible = true
      getUnusedTemplateInfo(param).then(res => {
        if (res.success) {
          this.templateList = res.data
          this.templateListLoading = false
        }
      })
      // this.templateListLoading = false;
    },
    // 关闭通用材料对话框
    closeTemplateDialog() {
      this.templateDialogVisible = false
    },
    // 确认引用模板
    confirmUseTemplate() {
      if (this.selectedQuoteRows.length > 0) {
        // 需判断已勾选的模板类型在该产品是否有已启用的同类型模板
        const resultArr = []
        this.selectedQuoteRows.forEach(item => {
          const templateParam = {
            productionId: this.productionId,
            templateType: item.templateType
          }
          const stateResult = new Promise((resolve, reject) => {
            getCommonTemplateNum(templateParam).then(res => {
              if (res.success) {
                if (res.data >= 1) {
                  reject()
                } else {
                  resolve()
                }
              }
            })
          })
          resultArr.push(stateResult)
        })
        // 确定引用通用模板
        const params = []
        this.selectedQuoteRows.forEach(item => {
          params.push({
            orgProductionId: this.productionId,
            orgTemplateId: item.id
          })
        })
        Promise.all(resultArr).then(res => { // 没有相同
          saveUnusedTemplate(params).then(res => {
            if (res.success) {
              this.templateDialogVisible = false
              this.getList()
            }
          })
        }).catch(() => { // 已经有相同类型模板
          this.$confirm('是否确认引用已勾选通用模板，引用后之前已启用的同类型模板将被禁用', '引用通用模板', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            saveUnusedTemplate(params).then(res => {
              if (res.success) {
                this.templateDialogVisible = false
                this.getList()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        })
      } else {
        this.$fun.msg('请选择模板', 'error')
      }
    },
    // 获取未选择模板table勾选的值
    templateSelectionChange(val) {
      this.selectedRows = val
      console.log(this.selectedRows)
    },
    // 获取引用模板table勾选值
    quoteSelectionChange(val) {
      this.selectedQuoteRows = val
    },
    linkTo(name, productionId, templateId) {
      console.log(templateId)
      this.$router.push({
        name: name,
        query: {
          productionId: productionId,
          templateId: templateId
        }
      })
    }
  }
}
</script>

<style lang="less">
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    // margin: 20px;
    // padding: 0px;
  }
  .search-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 30px;
    display: flex;
    > span {
      min-width: 75px;
      line-height: 36px;
      font-size: 14px;
    }
    > .el-input,
    .el-select {
      // flex:1;
      width: 250px;
      margin-right: 30px;
    }
  }
  .table-box {
    background: #fff;
    padding: 30px 0;
    min-height: calc(100vh - 170px);
  }
  .align-right {
    text-align: right;
  }
  .el-pagination {
    margin-top: 24px;
  }
  .el-pagination .el-select .el-input,
  .el-pagination__editor.el-input {
    width: 100px;
    margin-right: 0;
  }
  .span-btn{
    color: #1890ff;
    margin: 10px;
    cursor: pointer;
  }
  .disable-btn{
    color: #909399;
    margin: 10px;
    cursor: not-allowed;
  }
  .enable-color{
    color: #67C23A;
  }
  .disable-color{
    color: #F56C6C;
  }

.search-box{
  display: flex;
  padding: 20px;
  & > div{
    display: flex;
    align-items: center;
    margin-right: 30px;
    .title{
      display: block;
      white-space: nowrap;
      padding-right: 20px;
    }
  }

}
.main{
  min-height: calc(100vh - 90px);
  background: #fff;
  padding: 0 30px;
  padding-top: 20px;
}
</style>
