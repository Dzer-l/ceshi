<template>
  <section id="materialStore">
    <div class="app-container">
      <div v-show="$route.meta.showRole">
        <div class="search-box">
          <span>材料名称:</span>
          <el-input v-model="listQuery.materialName" placeholder="请输入产品名称" size="medium" />
          <div style="min-width:155px;flex:1;">
            <el-button type="primary" size="medium" @click="search()">搜索</el-button>
            <el-button size="medium" @click="reset()">重置</el-button>
          </div>
        </div>

        <div class="table-box">
          <div class="align-right">
            <el-button
              size="medium"
              type="primary"
              style="margin-bottom:10px"
              @click="showAddDialog"
            >新增</el-button>
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            border
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="材料名称">
              <template slot-scope="scope">
                <span>{{ scope.row.materialName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              class-name="operate-cell"
            >
              <template slot-scope="{row}">
                <span class="span-btn" @click="showEditDialog(row)">编辑材料</span>
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
            background
          />
        </div>
      </div>
      <router-view />
      <el-dialog title="新增材料" :visible.sync="addDialogVisible" @close="closeAddDialog">
        <el-alert title="需要注意，材料名称一经确认将无法更改。" class="alert-blue" show-icon :closable="false" />
        <el-form ref="addMaterialForm" :model="addMaterialForm" :rules="addRules" label-width="100px" class="addForm">
          <el-form-item label="材料名称" prop="name">
            <el-input v-model="addMaterialForm.name" maxlength="50" />
          </el-form-item>
          <el-form-item label="说明" prop="desc">
            <el-input v-model="addMaterialForm.desc" type="textarea" maxlength="50" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog()">取消</el-button>
          <el-button type="primary" @click="confirmAddMaterial()">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑材料" :visible.sync="editDialogVisible" @close="closeEditDialog">
        <el-form ref="editMaterialForm" :model="editMaterialForm" label-width="100px">
          <el-form-item label="材料名称" prop="name">
            <el-input v-model="editMaterialForm.materialName" disabled />
          </el-form-item>
          <el-form-item label="说明" prop="desc">
            <el-input v-model="editMaterialForm.materialDesc" type="textarea" maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEditDialog()">取消</el-button>
          <el-button type="primary" @click="confirmEditMaterial()">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import { getMaterialList, addMaterial, editMaterial } from '@/api/productManage'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageSize: 10,
        pageNum: 1,
        materialName: ''
      },
      total: 0, // 信息条数
      tempUserId: undefined, // 零时存放userId
      addDialogVisible: false, // 弹出框显示
      editDialogVisible: false, // 弹出框显示
      selectedRows: [], // 保存被选中项
      addRules: { // 新增材料校验规则
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      addMaterialForm: {
        name: '',
        desc: ''
      },
      editMaterialForm: {
        materialName: '',
        materialDesc: '',
        id: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMaterialList(this.listQuery).then((res) => {
        if (res.success) {
          this.listLoading = false
          this.list = res.data.list
          this.total = res.data.total
        } else {
          this.listLoading = false
          this.list = []
          this.total = 0
        }
      })
      // this.list = [{name: "委托人户口本"},{name:"受托人身份证"}];
      // this.total = 2;
      // this.listLoading = false;
    },
    search() { // 条件搜索
      this.listLoading = true
      this.getList()
    },
    reset() { // 重置表格
      this.listLoading = true
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        materialName: ''
      }
      this.getList()
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
    // 显示新增模态框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 关闭模态框
    closeAddDialog() {
      this.addDialogVisible = false
      this.addMaterialForm.name = ''
      this.addMaterialForm.desc = ''
      this.$refs['addMaterialForm'].resetFields()
    },
    // 确认新增材料
    confirmAddMaterial() {
      this.$refs['addMaterialForm'].validate((valid) => {
        if (valid) {
          const data = {
            materialName: this.addMaterialForm.name,
            materialDesc: this.addMaterialForm.desc
          }
          addMaterial(data).then(res => {
            if (res.success) {
              this.closeAddDialog()
              this.$fun.msg('新增材料成功', 'success')
              this.getList()
            } else {
              if (res.code === -99) {
                this.$fun.msg(res.msg, 'error')
              } else {
                this.$fun.msg('新增材料失败', 'error')
              }
            }
          })
        } else {
          return false
        }
      })
    },
    // 显示修改模态框
    showEditDialog(row) {
      console.log(row)
      this.editMaterialForm = row
      this.editDialogVisible = true
    },
    // 关闭修改模态框
    closeEditDialog() {
      this.editDialogVisible = false
      this.getList()
    },
    // 确认修改材料
    confirmEditMaterial() {
      const data = {
        materialDesc: this.editMaterialForm.materialDesc,
        id: this.editMaterialForm.id
      }
      editMaterial(data).then(res => {
        if (res.success) {
          this.editDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
#materialStore {
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
    width: 600px;
  }
  .align-right {
    text-align: right;
  }
  .el-tag {
    margin-right: 10px;
  }
  .el-pagination {
    margin-top: 24px;
  }
  .span-btn{
    color: #1890ff;
    margin: 10px;
    cursor: pointer;
  }
  .addForm{
    margin-top: 30px;
  }
  .alert-blue{
    background-color: #d2e3fe;
    color: #337aff;
    margin-bottom: 20px;
  }
  .operate-cell span{
    margin:0 15px 0 0;
  }
}
</style>
