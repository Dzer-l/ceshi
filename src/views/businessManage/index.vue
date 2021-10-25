<template>
  <section id="productManage">
    <div class="app-container">
      <div>
        <div class="search-box">
          <span>产品名称:</span>
          <el-input
            v-model="listQuery.productionName"
            placeholder="请输入产品名称"
            size="medium"
          />
          <span>公证事项:</span>
          <el-input
            v-model="listQuery.notaryName"
            placeholder="请输入公证事项"
            size="medium"
          />
          <span>公证类别:</span>
          <el-select
            v-model="listQuery.notaryCategoryCode"
            placeholder="请选择公证类别"
            size="medium"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span>产品状态:</span>
          <el-select
            v-model="listQuery.productionState"
            placeholder="请选择产品状态"
            size="medium"
          >
            <el-option label="全部" :value="0" />
            <el-option label="启用" :value="5" />
            <el-option label="禁用" :value="4" />
          </el-select>
          <div style="min-width: 155px; flex: 1">
            <el-button
              type="primary"
              size="medium"
              @click="search()"
            >搜索</el-button>
            <el-button size="medium" @click="reset()">重置</el-button>
          </div>
        </div>

        <div class="table-box">
          <div class="align-right">
            <el-button
              size="medium"
              type="primary"
              style="margin-bottom: 10px"
              @click="enableAccount()"
            >启用</el-button>
            <el-button
              size="medium"
              type="primary"
              @click="disableAccount()"
            >禁用</el-button>
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="productList"
            fit
            border
            highlight-current-row
            class="table-min-width"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" :selectable="isSelectable" />
            <el-table-column label="顺序" width="50px">
              <div class="move"><i class="el-icon-d-caret" /></div>
            </el-table-column>
            <el-table-column label="产品名称">
              <template slot-scope="scope">
                <span>{{ scope.row.productionName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="公证事项">
              <template slot-scope="scope">
                <span class="length-limit">{{ scope.row.notaryName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="公证类别" prop="tag">
              <template slot-scope="scope">
                <span>{{ scope.row.notaryCategoryName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="产品状态">
              <template slot-scope="scope">
                <el-switch
                  v-if="
                    scope.row.productionState == 5 ||
                      scope.row.productionState == 4
                  "
                  v-model="scope.row.productionState"
                  :active-value="5"
                  :inactive-value="4"
                  active-text="启用"
                  inactive-text="禁用"
                  @change="statusChange(scope.row)"
                />
                <span v-else class="danger">已禁用</span>
              </template>
            </el-table-column>
            <el-table-column
              label="配置"
              width="280px"
              class-name="operate-cell"
            >
              <template
                v-if="
                  scope.row.productionState == 1 ||
                    scope.row.productionState == 4 ||
                    scope.row.productionState == 5
                "
                slot-scope="scope"
              >
                <span
                  class="span-btn"
                  @click="showCostDialog(scope.row)"
                >费用</span>
                <span
                  class="span-btn"
                  @click="linkTo('explainConfig', scope.row.id)"
                >说明</span>
                <span
                  class="span-btn"
                  @click="linkTo('templateConfig', scope.row.id,scope.row.productionCode)"
                >模板</span>
                <span
                  class="span-btn"
                  @click="
                    linkTo(
                      'materialConfig',
                      scope.row.id,
                      scope.row.productionCode
                    )
                  "
                >材料</span>
                <span class="span-btn" @click="goTo(scope.row.id,scope.row.notaryName,scope.row.notaryCategoryName,scope.row.productionName)">订单权限</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="total > 0"
            :page-size="listQuery.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :current-page.sync="listQuery.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
            @current-change="getPaginationList"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
      <router-view />
      <el-dialog
        title="费用配置"
        :visible.sync="dialogFormVisible"
        @close="closeDialog"
      >
        <el-table :data="costList" fit border style="width: 100%">
          <el-table-column label="公证事项">
            <template slot-scope="scope">
              <span>{{ scope.row.productionName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="公证费(元)">
            <template slot-scope="scope">
              <input
                v-model="scope.row.notaryCost"
                type="text"
                maxlength="10"
                oninput="value=value.replace(/[^\d.]/g,'')"
              >
            </template>
          </el-table-column>
          <el-table-column label="副本费(元)">
            <template slot-scope="scope">
              <input
                v-model="scope.row.copyCost"
                type="text"
                maxlength="10"
                oninput="value=value.replace(/[^\d.]/g,'')"
              >
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirmSetPrice()">确认</el-button>
        </div>
      </el-dialog>

      <!-- 启用产品对话框 -->
      <el-dialog
        title="启用产品"
        :visible.sync="enableProductDialogVisible"
        center
        @close="closeEnableProductDialog"
      >
        <el-alert
          title="您已选择以下产品，在启用产品前，需要配置完成支付信息，如未完成请联系律证云客服人员；"
          :closable="false"
          show-icon
          class="alert-blue"
        />
        <el-alert
          title="需要注意，系统会有默认配置好的产品模板、材料及说明，如您未进行过修改，将使用系统默认配置；"
          class="alert-blue mb20"
          :closable="false"
          show-icon
        />
        <el-row style="border: 1px solid gray">
          <el-col :span="6" class="table-item">产品名称</el-col>
          <el-col :span="6" class="table-item">公证事项</el-col>
          <el-col :span="6" class="table-item">公证类别</el-col>
          <el-col :span="6" class="table-item">支付信息</el-col>
        </el-row>
        <div v-for="(item, index) in enableProductList" :key="index">
          <el-row
            style="border-left: 1px solid gray; border-right: 1px solid gray"
          >
            <el-col :span="6" class="table-item">{{
              item.productionName
            }}</el-col>
            <el-col :span="6" class="table-item">{{ item.notaryName }}</el-col>
            <el-col :span="6" class="table-item">{{
              item.notaryCategoryName
            }}</el-col>
            <el-col
              :span="6"
              class="table-item"
              :class="item.payConfiged ? 'success' : 'fail'"
            >{{ item.payConfiged ? "已完成" : "未完成" }}</el-col>
          </el-row>
          <el-row style="border: 1px solid gray; padding: 10px 20px">
            <el-col :span="8">
              <span style="margin-right: 20px">平台服务费(元)</span>
              <span>{{ item.platformCost }}</span>
            </el-col>
            <el-col
              :span="16"
              style="border-left: 1px solid gray; padding-left: 30px"
            >
              <div>
                <el-row style="padding: 5px 0">印鉴公证</el-row>
                <el-row style="padding: 5px 0">
                  公证费(元)
                  <input
                    v-model="item.notaryCost"
                    type="text"
                    maxlength="10"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  >
                </el-row>
                <el-row style="padding: 5px 0">
                  副本费(元)
                  <input
                    v-model="item.copyCost"
                    type="text"
                    maxlength="10"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  >
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEnableProductDialog">取消</el-button>
          <el-button
            v-if="canEnable"
            type="primary"
            @click="confirmEnableProduct()"
          >启用</el-button>
          <el-button
            v-else
            type="primary"
            @click="refreshProduct"
          >刷新</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import {
  getProductList,
  getProductInfo,
  updateProductInfo,
  getSelectedProductInfo,
  disableProduct,
  enableProduct,
  getCategoryType,
  productionSortOrder
} from '@/api/productManage'
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      tableKey: 0,
      productList: null,
      listLoading: true,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        productionName: null,
        notaryName: null,
        productionState: null,
        notaryCategoryCode: null,
        orgProductionIds: null
      },
      showReviewer: false,
      total: 0, // 信息条数
      tempUserId: undefined, // 零时存放userId
      dialogFormVisible: false, // 弹出框显示
      enableProductDialogVisible: false, // 启用产品对话框显示
      checkedRoleList: [], // 存放选择的角色
      roleList: [], // 角色列表
      typeOptions: [], // 保存公证类别
      costList: [], // 保存当前产品相关信息
      selectedRows: [], // 保存被选中项
      enableProductList: [], // 保存启用产品列表
      canEnable: false, // 保存是否可启用
      selectedIdList: [] // 保存被选中的启用产品id
    }
  },
  created() {
    this.getList()
    this.getCategoryType()
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    getList() {
      getProductList(this.listQuery).then((res) => {
        if (res.list) {
          this.productList = res.list
          this.total = res.total
        }
      })
      console.log(this.productList)
      this.listLoading = false
      this.$forceUpdate()
    },
    // 获取公证处类别
    getCategoryType() {
      getCategoryType().then((res) => {
        if (res.success) {
          const arr = []
          res.data.forEach((item) => {
            arr.push({
              value: item.notaryCategoryCode,
              label: item.notaryCategoryName
            })
          })
          this.typeOptions = arr
        }
      })
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const param = {
            id1: _this.productList[oldIndex].id,
            id2: _this.productList[newIndex].id,
            index1: _this.productList[newIndex].sortOrder,
            index2: _this.productList[oldIndex].sortOrder
          }
          productionSortOrder(param).then((res) => {})
        }
      })
    },
    // 判断每行是否可以选择
    isSelectable(row) {
      if (row.productionState === 2) {
        return false
      } else {
        return true
      }
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    getPaginationList(e) {
      this.listQuery.pageNo = e
      this.getList()
    },
    search() {
      // 条件搜索
      this.listLoading = true
      this.getList()
    },
    reset() {
      // 重置表格
      this.listLoading = true
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        productionName: null,
        notaryCategoryName: null,
        productionState: null,
        notaryCategoryCode: null,
        orgProductionIds: null,
        notaryName: null
      }
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedRows = val
    },
    // 关闭模态框
    closeDialog() {
      this.dialogFormVisible = false
      this.costList = []
    },
    // 修改账号状态
    statusChange(row) {
      console.log(row)
      const status = row.productionState // 1为启用,4为禁用,2为已禁用不能操作
      if (status === 5) {
        // 启用
        const param = {
          orgProductionIds: [row.id]
        }
        this.selectedIdList = [row.id]
        this.getEnableProductInfo(param)
        this.enableProductDialogVisible = true
      } else if (status === 4) {
        // 禁用
        this.$confirm('是否确认禁用此产品？', '禁用产品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const arr = [row.id]
            disableProduct(arr).then((res) => {
              if (res.success) {
                this.getList()
                this.$fun.msg('账号禁用成功', 'success')
              } else {
                this.$fun.msg('账号禁用失败', 'error')
              }
            })
          })
          .catch(() => {
            row.productionState = 5
            this.$message({
              type: 'info',
              message: '已取消禁用'
            })
          })
      }
    },
    // 关闭启用对话框
    closeEnableProductDialog() {
      this.getList()
      this.enableProductDialogVisible = false
    },
    showCostDialog(row) {
      // 打开重置密码对话框
      console.log(row)
      this.dialogFormVisible = true
      const param = {
        id: row.id
      }
      getProductInfo(param).then((res) => {
        if (res.success) {
          this.costList = [res.data]
        }
      })
    },
    roleListChange(event) {
      console.log(event)
    },
    toAddAccount() {
      this.$router.push({ path: '/systemManage/accountManage/addAccount' })
    },
    // 批量启用账号
    enableAccount() {
      console.log(this.selectedRows)
      if (this.selectedRows && this.selectedRows.length > 0) {
        const idArr = []
        let flag = true
        try {
          this.selectedRows.forEach((item) => {
            if (item.productionState === 1) {
              flag = false
              throw new Error('ending')
            }
            idArr.push(item.id)
          })
        } catch (e) {
          if (e.message === 'ending') {
            this.$fun.msg('请勿勾选【启用】状态的账号', 'error')
          }
        }
        this.selectedIdList = idArr
        const param = {
          orgProductionIds: this.selectedIdList
        }
        setTimeout(() => {
          if (flag) {
            this.enableProductDialogVisible = true
            this.getEnableProductInfo(param)
          }
        }, 0)
      } else {
        this.$fun.msg('请至少勾选一条信息', 'error')
      }
    },
    // 获取启用产品信息的回显
    getEnableProductInfo(param) {
      getSelectedProductInfo(param).then((res) => {
        if (res.success) {
          this.enableProductList = res.data
          let payConfigedFlag = true
          this.enableProductList.forEach((item) => {
            payConfigedFlag = payConfigedFlag && item.payConfiged
          })
          if (payConfigedFlag) {
            this.canEnable = true
          } else {
            this.canEnable = false
          }
        } else {
          this.$fun.msg('获取产品列表失败', 'error')
        }
      })
    },
    // 刷新启用产品列表
    refreshProduct() {
      const param = {
        orgProductionIds: this.selectedIdList
      }
      this.getEnableProductInfo(param)
    },
    // 禁用账号
    disableAccount() {
      if (this.selectedRows.length > 0) {
        const idArr = []
        let flag = true
        try {
          this.selectedRows.forEach((item) => {
            if (item.productionState === 4) {
              flag = false
              throw new Error('ending')
            }
            idArr.push(item.id)
          })
        } catch (e) {
          if (e.message === 'ending') {
            this.$fun.msg('请勿勾选【禁用】状态的账号', 'error')
          }
        }
        setTimeout(() => {
          if (flag) {
            this.$confirm('是否确认禁用已勾选产品？', '禁用产品', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                disableProduct(idArr).then((res) => {
                  if (res.success) {
                    this.getList()
                    this.$fun.msg('账号禁用成功', 'success')
                  }
                })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消禁用'
                })
              })
          }
        }, 0)
      } else {
        this.$fun.msg('请至少勾选一条信息', 'error')
      }
    },
    linkTo(name, id, code) {
      this.$router.push({
        name: name,
        query: { productionId: id, productionCode: code }
      })
    },
    goTo(id,name,type,productionName){
      this.$router.push({name:'orderJurisdiction',query:{id:id,name:name,type:type,productionName:productionName}})
    },
    // 修改产品费用
    confirmSetPrice() {
      console.log(this.costList)
      if (
        !isNaN(this.costList[0].notaryCost) &&
        this.costList[0].notaryCost < 1000000 &&
        !isNaN(this.costList[0].copyCost) &&
        this.costList[0].copyCost < 1000000
      ) {
        const param = {
          id: this.costList[0].id,
          notaryCost: this.costList[0].notaryCost,
          copyCost: this.costList[0].copyCost
        }
        updateProductInfo(param).then((res) => {
          if (res.success) {
            this.dialogFormVisible = false
            this.$fun.msg('产品费用配置成功', 'success')
          }
        })
      } else {
        this.$fun.msg('请输入正确的数字', 'error')
      }
    },
    // 确定启用产品
    confirmEnableProduct() {
      const param = []
      let flag = true // 标记价格格式状态是否正确
      console.log(this.enableProductList)
      this.enableProductList.forEach((item) => {
        flag = flag && !isNaN(item.copyCost) && !isNaN(item.notaryCost)
        param.push({
          id: item.id,
          copyCost: Number(item.copyCost),
          notaryCost: Number(item.notaryCost)
        })
      })
      if (flag) {
        enableProduct(param).then((res) => {
          if (res.success) {
            this.$fun.msg('启用成功', 'success')
            this.enableProductDialogVisible = false
            this.getList()
          }
        })
      } else {
        this.$fun.msg('请填写正确的数字', 'error')
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/main.scss";
#productManage {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
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
    padding: 30px;
    min-height: calc(100vh - 170px);
  }
  .el-dialog {
    width: 800px;
  }
  .align-center {
    text-align: center;
  }
  .align-right {
    text-align: right;
  }
  .el-tag {
    margin-right: 10px;
  }
  .span-btn {
    color: #1890ff;
    margin: 10px;
    cursor: pointer;
  }
  .table-item {
    padding: 10px 20px;
    text-align: center;
  }
  .table-min-width {
    min-width: 1000px;
  }
  .operate-cell span {
    margin: 0 15px 0 0;
  }
  .success {
    color: #67c23a;
  }
  .fail {
    color: #f56c6c;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .length-limit {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .alert-blue {
    background-color: #d2e3fe;
    color: #337aff;
    margin-bottom: 10px;
  }
  .move {
    cursor: pointer;
  }
  .danger {
    color: red;
  }
}
</style>
