<template>
  <section id="editRole">
    <div class="app-container">
      <div class="main-box">
        <el-form ref="editRoleForm"
                 :model="roleNameForm"
                 :inline="true"
                 :rules="rules"
                 label-width="100px"
                 class="demo-form-inline">
          <el-form-item label="角色名称:"
                        prop="roleName"
                        required>
            <el-input v-model="roleNameForm.roleName"
                      type="text"
                      placeholder="请输入角色名称"
                      disabled />
          </el-form-item>
          <el-form-item label="权限设置:"
                        style="width:300px"
                        prop="list">
            <el-tree ref="tree"
                     :data="roleNameForm.permissionList"
                     show-checkbox
                     default-expand-all
                     node-key="id"
                     highlight-current
                     :default-checked-keys="checkedMenuList" />
          </el-form-item>
          <el-button type="primary"
                     size="medium"
                     style="margin-left:50px"
                     @click="save()">保存</el-button>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getRoleMenuList, getRoleDetail
} from '@/api/roleManage'

export default {
  data () {
    var validateList = (rule, value, callback) => {
      if (this.$refs.tree.getCheckedNodes().length <= 0) {
        callback(new Error('请设置权限'))
      } else {
        console.log('success')
        callback()
      }
    }
    return {
      roleNameForm: {
        roleName: '',
        permissionList: []
      },
      id: null,
      checkedMenuList: [], // 存放选中的树节点
      rules: {
        list: [{ required: true, validator: validateList, trigger: 'blur' }]
      }
    }
  },
  created () {
    const id = this.$route.params.id
    this.id = id
    this.getPermissionTree(id)
    this.getRoleInfo(id)
  },
  methods: {
    getPermissionTree (id) {
      getRoleMenuList(id).then(res => {
        const temp = []
        this.treeNodeTrans(res.data, temp)
        console.log(temp)
        // this.roleNameForm.permissionList = temp
        this.roleNameForm.permissionList = [{
          id: '0',
          label: '全部',
          children: temp
        }]
      })
    },
    getRoleInfo (id) {
      getRoleDetail(id).then(res => {
        this.roleNameForm.roleName = res.roleName
      })
    },
    treeNodeTrans (originData, treeArr) { // 转换数据为树形数据
      originData.forEach((item, index) => {
        if (item.flag === 1 && item.childMenus.length === 0) { // 有子节点的默认不选中,树形插件如果父节点选中,子节点会默认都选中
          this.checkedMenuList.push(item.id)
        }
        treeArr.push({
          id: item.id,
          label: item.menuTitle,
          children: []
        })
        if (item.childMenus.length > 0) {
          this.treeNodeTrans(item.childMenus, treeArr[index].children)
        }
      })
    },
    nodeTransData (originArr, newArr) { // 把树形数据转换成后台所需数据
      const checkedArr = this.$refs.tree.getCheckedKeys()
      const halfCheckArr = this.$refs.tree.getHalfCheckedKeys()
      // 去除树形结构根节点"全部"
      halfCheckArr.splice(halfCheckArr.indexOf('0'), 1)
      const selectedArr = checkedArr.concat(halfCheckArr)
      console.log(selectedArr)
      originArr.forEach(item => {
        if (selectedArr.indexOf(item.id) >= 0) {
          newArr.push({
            menuId: item.id,
            checkFlag: true
          })
        } else {
          newArr.push({
            menuId: item.id,
            checkFlag: false
          })
        }
        if (item.children.length > 0) {
          this.nodeTransData(item.children, newArr)
        }
      })
    },
    save () {
      this.$refs['editRoleForm'].validate((valid) => {
        if (valid) {
          const tempList = []
          this.nodeTransData(this.roleNameForm.permissionList[0].children, tempList)
          console.log(tempList)
          const param = {
            roleName: this.roleNameForm.roleName,
            orgRoleMenuReVOList: tempList
          }
          this.$axios('org/sys-role-update/' + this.id, param, { method: 'post' }).then(res => {
            if (res.success) {
              this.$router.push({ path: '/systemManage/roleManage' })
            } else {
              this.$fun.msg(res.msg, 'error')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
#editRole {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
    padding: 10px;
  }
  .main-box {
    background: #fff;
    padding: 30px;
    min-height: calc(100vh - 100px);
  }
  .el-input {
    width: 400px;
  }
  .el-tree {
    margin-top: 10px;
  }
}
</style>
