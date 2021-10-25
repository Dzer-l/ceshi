<template>
  <section id="roleManage">
    <div class="app-container">
      <div v-show="$route.meta.showRole">
        <div class="search-box">
          <span>角色名称:</span>
          <el-input style="width:250px"
                    v-model="listQuery.username"
                    placeholder="请输入角色名称"
                    size="medium"
                    clearable />
          <el-button type="primary"
                     size="medium"
                     style="margin-left:30px;"
                     @click="search()">搜索</el-button>
          <el-button size="medium"
                     @click="reset()">重置</el-button>
        </div>

        <div class="table-box">
          <div class="align-right">
            <el-button type="primary"
                       size="medium"
                       icon="el-icon-circle-plus"
                       style="margin-bottom:10px"
                       @click="showAddRole()">新增角色</el-button>
            <el-button size="medium"
                       @click="deleteRole2()">删除</el-button>
          </div>
          <el-table :key="tableKey"
                    v-loading="listLoading"
                    :data="list"
                    border
                    fit
                    highlight-current-row
                    style="min-width:1000px"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="55" />
            <el-table-column label="角色名称"
                             width="250px"
                             align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.roleName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="权限"
                             min-width="300px"
                             align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.permissionList }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             align="center"
                             width="350"
                             class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <span v-if="row.isSysRole==0"
                      class="span-btn"
                      @click="handleUpdateUser(row)">编辑</span>
                <span v-if="row.isSysRole==0"
                      class="span-btn"
                      @click="deleteRole(row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-show="total>0"
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="listQuery.pageSize"
                         :current-page.sync="listQuery.pageNum"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"
                         @current-change="getPaginationList"
                         @size-change="handleSizeChange" />
        </div>
      </div>
      <router-view />
    </div>
  </section>
</template>

<script>
import {
  getRoleInfo,
  deleteRole,
  searchRole
} from '@/api/roleManage'

export default {
  data () {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        username: '',
        pageSize: 10,
        pageNum: 1
      },
      total: 0, // 信息条数
      temp: {
        // 零时存放某一行的用户数据
        id: undefined,
        roleName: '',
        roleDescription: '',
        isSysRole: undefined
      },
      rules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        roleDescription: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      selectedRows: [] // 保存被选中项
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      getRoleInfo(this.listQuery).then((res) => {
        if (res.success) {
          this.listLoading = false
          this.list = res.data.list
          this.list.forEach(item => {
            const tempList = item.sysOrgMenuDTOListList
            if (tempList.length <= 4) {
              const tempArr = []
              tempList.forEach(item2 => {
                tempArr.push(item2.menuTitle)
              })
              item.permissionList = tempArr.join(' ')
            } else {
              const newArr = tempList.slice(0, 4)
              const tempArr = []
              newArr.forEach(item2 => {
                tempArr.push(item2.menuTitle)
              })
              tempArr.push('...')
              item.permissionList = tempArr.join(' ')
            }
          })
          this.total = res.data.total
          console.log(this.total)
        }
      })
    },
    // 条件搜索
    search () {
      this.listLoading = true
      const param = {
        sysRoleName: this.listQuery.username,
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize
      }
      if (this.listQuery.username !== '') {
        searchRole(param).then((res) => {
          console.log(res)
          if (res.success) {
            this.listLoading = false
            this.list = res.data.list
            this.list.forEach(item => {
              const tempList = item.sysOrgMenuDTOListList
              if (tempList.length <= 4) {
                const tempArr = []
                tempList.forEach(item2 => {
                  tempArr.push(item2.menuTitle)
                })
                item.permissionList = tempArr.join(' ')
              } else {
                const newArr = tempList.slice(0, 4)
                const tempArr = []
                newArr.forEach(item2 => {
                  tempArr.push(item2.menuTitle)
                })
                tempArr.push('...')
                item.permissionList = tempArr.join(' ')
              }
            })
            this.total = res.data.total
          }
        })
      } else {
        this.getList()
      }
    },
    // 重置搜索
    reset () {
      this.listLoading = true
      this.listQuery = {
        pageSize: 10,
        pageNum: 1,
        username: ''
      }
      this.getList()
    },
    handleSelectionChange (val) {
      console.log(val)
      this.selectedRows = val
    },
    // 每页显示条数变化
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleUpdateUser (row) {
      this.$router.push({ path: `/systemManage/roleManage/editRole/${row.id}` })
    },
    getPaginationList (e) {
      console.log(e)
      this.listQuery.pageNum = e
      this.getList()
    },
    showAddRole () {
      this.$router.push({ path: '/systemManage/roleManage/addRole' })
    },
    deleteRole (row) { // 删除单行数据
      this.$confirm('确定删除角色名称?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const param = {
            roleId: row.id
          }
          // 删除数据
          deleteRole(param).then((res) => {
            if (res.success) {
              this.getList()
              this.$fun.msg('删除成功!', 'success')
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        })
        .catch(() => {
          this.$fun.msg('已取消删除', 'info')
        })
    },
    deleteRole2 () { // 批量删除
      if (this.selectedRows.length > 0) {
        this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 删除数据
            const deleteArr = []
            this.selectedRows.forEach(item => {
              deleteArr.push(item.id)
            })
            this.$axios('org/sys-role-list', this.selectedRows, { method: 'delete' }).then(res => {
              if (res.success) {
                this.getList()
                this.$fun.msg('删除成功!', 'success')
              } else {
                this.$fun.msg(res.msg, 'error')
                // this.$message.error(res.msg)
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message.error('请至少勾选一条信息')
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/main.scss";
#roleManage {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
  }
  .align-right {
    text-align: right;
  }
  .search-box {
    background: #fff;
    margin-bottom: 20px;
    padding: 30px;
    > span {
      min-width: 75px;
      line-height: 36px;
      font-size: 14px;
    }
  }
  .table-box {
    background: #fff;
    padding: 30px;
  }
  .el-dialog {
    width: 600px;
  }
  .span-btn {
    color: #1890ff;
    margin: 10px;
    cursor: pointer;
  }
}
</style>
