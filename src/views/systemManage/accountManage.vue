<template>
  <section id="userList">
    <div class="app-container">
      <div v-show="$route.meta.showRole">
        <div class="search-box">
          <span>手机号码:</span>
          <el-input
            v-model="listQuery.mobile"
            placeholder="请输入手机号码"
            size="medium"
          />
          <span>真实姓名:</span>
          <el-input
            v-model="listQuery.realName"
            placeholder="请输入姓名"
            size="medium"
          />
          <span>状态:</span>
          <el-select
            v-model="listQuery.accountState"
            placeholder="请选择用户状态"
            size="medium"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
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
              type="primary"
              size="medium"
              icon="el-icon-circle-plus"
              style="margin-bottom: 10px"
              @click="toAddAccount()"
            >新增账号</el-button>
            <el-button size="medium" @click="enableAccount()">启用</el-button>
            <el-button size="medium" @click="disableAccount()">禁用</el-button>
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            class="table-min-width"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="手机号码" width="200px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.mobile }}</span>
              </template>
            </el-table-column>
            <el-table-column label="真实姓名" width="200px" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.realName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="角色"
              min-width="300px"
              align="center"
              prop="tag"
            >
              <template slot-scope="scope">
                <div>
                  <el-tag
                    v-for="tag in scope.row.roleNameArr"
                    :key="tag"
                    :disable-transitions="false"
                    size="small"
                  >{{ tag }}</el-tag>
                  <span
                    v-if="scope.row.roles && scope.row.roles.length > 2"
                  >...</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="账号状态" min-width="200px" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.accountState"
                  :active-value="1"
                  :inactive-value="2"
                  active-text="启用"
                  inactive-text="禁用"
                  :disabled="scope.row.isSysRole"
                  @change="statusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="350"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <span
                  v-if="!row.isSysRole"
                  class="span-btn"
                  @click="editAccount(row)"
                >编辑</span>
                <span
                  v-if="!row.isSysRole"
                  class="span-btn"
                  @click="handleResetPassword(row)"
                >重置密码</span>
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
            @current-change="getPaginationList"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
      <router-view />
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogFormVisible"
        @close="closeDialog"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="passwordForm"
          label-position="left"
          label-width="120px"
          style="margin-left: 50px"
        >
          <el-form-item label="设置新密码:" prop="password">
            <el-input
              v-model="passwordForm.password"
              show-password
              maxlength="16"
            />
          </el-form-item>
          <el-form-item label="确定密码:" prop="confirmPass">
            <el-input
              v-model="passwordForm.confirmPass"
              show-password
              maxlength="16"
            />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelReset()">取消</el-button>
          <el-button
            type="primary"
            @click="confirmResetPassword()"
          >确认</el-button>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import {
  getUserInfo,
  deleteUser,
  bacthOperate,
  resetPassword
} from '@/api/userManage'

export default {
  data() {
    // 表单校验
    var validatePass = (rule, value, callback) => {
      const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('格式不正确'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageSize: 10,
        pageNo: 1,
        username: undefined,
        accountState: undefined,
        mobile: undefined
      },
      showReviewer: false,
      total: 0, // 信息条数
      passwordForm: {
        // 零时存放某一行的用户数据
        password: '',
        confirmPass: ''
      },
      tempUserId: undefined, // 零时存放userId
      dialogTitle: '重置密码',
      dialogFormVisible: false, // 弹出框显示
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        confirmPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      checkedRoleList: [], // 存放选择的角色
      roleList: [], // 角色列表
      stateOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 1,
          label: '启用中'
        },
        {
          value: 2,
          label: '禁用中'
        }
      ],
      selectedRows: [] // 保存被选中项
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserInfo(this.listQuery).then((res) => {
        this.listLoading = false
        const list = res.data.list
        list.forEach((item) => {
          item['isSysRole'] = false
          if (item.roles && item.roles.length > 0) {
            item.roles.forEach((item2) => {
              if (item2.isSysRole === '1') {
                // 表示包含超级管理员权限
                item['isSysRole'] = true
              }
            })
          }
        })
        this.list = this.roleTrans(list)
        console.log(this.list)
        this.total = res.data.total
      })
    },
    // 对表格数据中的角色进行转换,保留2个角色标签
    roleTrans(list) {
      list.forEach((item1) => {
        let tempArr = []
        const roleNameArr = []
        if (item1.roles) {
          if (item1.roles.length >= 2) {
            tempArr = item1.roles.slice(0, 2)
          } else {
            tempArr = item1.roles
          }
          tempArr.forEach((item2) => {
            roleNameArr.push(item2.roleName)
          })
          item1.roleNameArr = roleNameArr
        }
      })
      return list
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
        pageNo: 1,
        username: undefined,
        accountState: undefined,
        mobile: undefined
      }
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedRows = val
    },
    // 修改账号状态
    statusChange(row) {
      console.log(row)
      const status = row.accountState // 1为启用,2为禁用
      const param = {
        userIds: row.id,
        isSelect: status - 1 // accountState转换,isSelect=0表示启用,1表示禁用
      }
      bacthOperate(param).then((res) => {
        if (res.success) {
          if (status === 1) {
            this.$fun.msg('账号启用成功', 'success')
          } else {
            this.$fun.msg('账号禁用成功', 'success')
          }
        }
      })
    },
    handleResetPassword(row) {
      // 打开重置密码对话框
      this.dialogFormVisible = true
      this.tempUserId = row.id
    },
    // 取消重置密码
    cancelReset() {
      this.dialogFormVisible = false
      this.passwordForm = {
        password: '',
        confirmPass: ''
      }
      this.$refs['dataForm'].resetFields()
    },
    // 重置密码
    confirmResetPassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            userId: this.tempUserId,
            password: this.passwordForm.password
          }
          resetPassword(param).then((res) => {
            if (res.success) {
              this.dialogFormVisible = false
              this.$fun.msg('重置密码成功', 'success')
            } else {
              this.dialogFormVisible = false
              this.$fun.msg('重置密码失败', 'success')
            }
            this.passwordForm = {
              password: '',
              confirmPass: ''
            }
          })
        } else {
          console.log('error submit')
          return false
        }
      })
    },
    // 关闭对话框回调
    closeDialog() {
      this.passwordForm = {
        password: '',
        confirmPass: ''
      }
      this.$refs['dataForm'].resetFields()
    },
    roleListChange(event) {
      console.log(event)
    },
    toAddAccount() {
      this.$router.push({ path: '/systemManage/accountManage/addAccount' })
    },
    deleteUser(row) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const param = {
            userId: row.id
          }
          // 删除数据
          deleteUser(param).then((res) => {
            if (res.success) {
              this.getList()
              this.$fun.msg('删除成功!', 'success')
            }
          })
        })
        .catch(() => {
          this.$fun.msg('已取消删除', 'info')
        })
    },
    // 启用账号
    enableAccount() {
      if (this.selectedRows && this.selectedRows.length > 0) {
        const idArr = []
        let flag = true
        try {
          this.selectedRows.forEach((item) => {
            if (item.accountState === 1) {
              flag = false
              throw new Error('ending')
            } else if (item.isSysRole) {
              flag = false
              throw new Error('sysRole')
            }
            idArr.push(item.id)
          })
        } catch (e) {
          if (e.message === 'ending') {
            this.$fun.msg('请勿勾选【启用】状态的账号', 'error')
          } else if (e.message === 'sysRole') {
            this.$fun.msg('请勿勾选系统管理员账号', 'error')
          }
        }
        const param = {
          userIds: idArr.join(','),
          isSelect: 0
        }
        setTimeout(() => {
          if (flag) {
            bacthOperate(param).then((res) => {
              if (res.success) {
                this.getList()
                this.$fun.msg('账号启用成功', 'success')
              }
            })
          }
        }, 0)
      } else {
        this.$fun.msg('请至少勾选一条信息', 'error')
      }
    },
    // 禁用账号
    disableAccount() {
      if (this.selectedRows.length > 0) {
        const idArr = []
        let flag = true
        try {
          this.selectedRows.forEach((item) => {
            if (item.accountState === 2) {
              flag = false
              throw new Error('ending')
            } else if (item.isSysRole) {
              flag = false
              throw new Error('sysRole')
            }
            idArr.push(item.id)
          })
        } catch (e) {
          if (e.message === 'ending') {
            this.$fun.msg('请勿勾选【禁用】状态的账号', 'error')
          } else if (e.message === 'sysRole') {
            this.$fun.msg('请勿勾选系统管理员账号', 'error')
          }
        }
        const param = {
          userIds: idArr.join(','),
          isSelect: 1
        }
        setTimeout(() => {
          if (flag) {
            bacthOperate(param).then((res) => {
              if (res.success) {
                this.getList()
                this.$fun.msg('账号禁用成功', 'success')
              }
            })
          }
        }, 0)
      } else {
        this.$fun.msg('请至少勾选一条信息', 'error')
      }
    },
    // 编辑账号信息
    editAccount(row) {
      console.log(row)
      // 页面跳转前,对角色进行处理,储存角色id,这里有个特殊点超级管理员不到编辑页面显示
      const roleIdArr = []
      if (row.roles) {
        row.roles.forEach((item) => {
          if (item.isSysRole === '0') {
            // 非系统角色进行展示,系统角色不展示
            roleIdArr.push(item.id)
          }
        })
      }
      row['roleIdArr'] = roleIdArr
      this.$router.push({ name: 'editAccount', params: { row: row }})
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/main.scss";
#userList {
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
      width: 250px;
      margin-right: 30px;
    }
  }
  .table-min-width {
    min-width: 1000px;
  }
  .table-box {
    background: #fff;
    padding: 30px;
    min-height: calc(100vh - 170px);
  }
  .el-dialog {
    width: 600px;
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
}
</style>
