<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px" class="search-nav">
      <span>角色名：</span>
      <el-input v-model="search.roleName" placeholder="请输入角色名称" />
      <el-button type="primary" @click="getDataList">查询</el-button>
    </div>
    <div style="background: #fff;padding: 20px">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="onClick_showDialog">新增</el-button>
      <el-table :data="list" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop="name" label="序号" width="50">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" min-width="60"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" min-width="50"></el-table-column>
        <el-table-column prop="isSysRole" label="角色类型" min-width="120">
          <template slot-scope="scope">
            {{ !scope.row.roleType ? '超管' : scope.row.roleType === 1 ? '管理员' : '普通角色' }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="password" label="数据权限" min-width="120"></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" min-width="80"></el-table-column>
        <el-table-column prop="userName" label="操作" width="150">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_editRoles(scope.row)">编辑</span>
            <span class="table-btn" @click="onClick_saveRoles(scope.row)">权限</span>
            <span class="table-btn" @click="onClikc_delRoles(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: center;margin-top: 20px">
        <el-pagination
          background
          center
          :page-size="search.size"
          layout="prev, pager, next, jumper"
          :current-page.sync="search.pageNum"
          :total="total"
          @current-change="changePage"
          @size-change="toPage"
        />
      </div>
    </div>
    <el-dialog :title="form.id ? '编辑' : '新增'" :visible.sync="addList" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="addRolesForm" :model="form">
        <el-form-item label="角色名称" prop="roleName" :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }">
          <el-input v-model="form.roleName" placeholder="请输入名称" maxlength="15" :disabled="form.id ? true : false" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :rules="{ required: true, message: '角色描述不能为空', trigger: 'blur' }">
          <el-input v-model="form.roleDesc" maxlength="15" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <div>
        <el-button style="margin-left: auto" type="primary" @click="onClick_addRoles">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="saveRoles" width="45%" :before-close="handleClose" :close-on-click-modal="false" class="roles-list">
      <el-tree ref="rolesTree" :data="rolesTree" node-key="id" :default-checked-keys="nowRoles" default-expand-all show-checkbox>
        <span slot-scope="{ data }" class="custom-tree-node">{{ data.name }}</span>
      </el-tree>
      <div>
        <el-button style="margin: 30px auto 0;display: block;" type="primary" @click="onClick_changeRoles">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      search: {
        pageNum: 1,
        roleName: '',
        pageSize: 10
      },
      rolesTree: [],
      nowRoles: [],
      nowUserId: '',
      total: 0,
      addList: false,
      saveRoles: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.$axios('org/org-role-page', this.search).then(res => {
        if (res.success) {
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },
    onClick_showDialog() {
      this.addList = true
    },
    handleClose() {
      this.addList = false
      this.saveRoles = false
      setTimeout(() => {
        this.rolesTree = []
        this.nowRoles = []
        this.nowUserId = ''
        this.form = {
          id: '',
          roleName: '',
          roleDesc: ''
        }
      }, 300)
    },
    changePage(e) {
      this.search.pageNum = parseInt(e)
      var url = `/#${this.$route.path}?page=${e}`
      history.pushState(null, null, url)
      this.getDataList()
    },
    toPage(e) {
      this.search.pageNum = JSON.parse(JSON.stringify(e))
      this.getDataList()
    },
    onClick_addRoles() {
      this.$refs['addRolesForm'].validate((e) => {
        if (e) {
          this.$axios(this.form.id ? 'org/edit-org-role' : 'org/insert-org-role', this.form, { method: this.form.id ? 'PUT' : 'POST' }).then(res => {
            if (res.success) {
              this.form = {
                id: '',
                roleName: '',
                roleDesc: ''
              }
              this.$fun.msg(this.form.id ? '修改成功！' : '添加成功！', 'success')
              this.getDataList()
              this.addList = false
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        }
      })
    },
    async showToast(text, title) {
      return this.$confirm(text, title || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    },
    async onClikc_delRoles(e) {
      if (await this.showToast('确认删除该角色？','')) {
        this.$axios('org/org-role/' + e.id, { id: e.id }, { method: 'delete' }).then(res => {
          if (res.success) {
            this.$fun.msg('删除成功！', 'success')
            this.getDataList()
          } else {
            this.$fun.msg(res.msg, 'error')
          }
        })
      } else {
        this.$fun.msg('已取消删除')
      }
    },
    onClick_editRoles(e) {
      this.addList = true
      if (e) {
        this.form = JSON.parse(JSON.stringify(e))
      } else {
        this.form = {
          id: '',
          roleName: '',
          roleDesc: ''
        }
      }
    },
    onClick_saveRoles(e) {
      this.$axios('org/menu-tree').then(res => {
        if (res.success) {
          this.rolesTree = res.data
          this.$axios('org/menu-tree/' + e.id).then(res => {
            if (res.success) {
              this.nowRoles = this.resolveAllEunuchNodeId(this.rolesTree, res.data, [])
              this.nowUserId = e.id
              this.saveRoles = true
            }
          })
        }
      })
    },
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    onClick_changeRoles() {
      let list = this.$refs.rolesTree.getCheckedNodes(false, true)
      let pushList = []
      for (let i of list) {
        pushList.push({ orgRoleId: this.nowUserId, orgMenuId: i.id })
      }
      this.$axios('org/update-role-menu', pushList, { method: 'PUT' }).then(res => {
        if (res.success) {
          this.$fun.msg('修改成功！', 'success')
          this.nowUserId = ''
          this.rolesTree = []
          this.nowRoles = []
          this.saveRoles = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .main-box {
      width: 100%;
      padding: 20px 20px;
      box-sizing: border-box;
      min-height: calc(100vh - 50px);
      background-color: #f5f5f5;
    }

    .search-nav {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin-bottom: 20px;
      .el-input,
      .el-select {
        width: 310px;
        margin-right: 30px;
      }
    }

    .data-main{
      padding: 0 50px 0;
      box-sizing: border-box;
    }

    .table-btn{
      cursor: pointer;
      color: #409EFF;
      margin-left: 20px;
      &:first-child{
        margin-left: 0;
      }
    }
</style>

<style lang="less">
  .roles-list /deep/ .el-dialog__body{
    max-height: 60vh;
    overflow: scroll;
  }
</style>
