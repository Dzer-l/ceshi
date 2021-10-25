<template>
  <section id="addRole">
    <div class="app-container">
      <div class="main-box">
        <el-form
          ref="roleNameForm"
          :model="roleNameForm"
          :inline="true"
          :rules="rules"
          label-width="100px"
          class="demo-form-inline"
        >
          <el-form-item
            label="角色名称:"
            prop="roleName"
          >
            <el-input
              v-model="roleNameForm.roleName"
              type="text"
              maxlength="15"
              placeholder="请输入角色名称"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="权限设置:"
            style="width:300px"
            prop="list"
          >
            <el-tree
              ref="tree"
              :data="roleNameForm.permissionList"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
              @check-change="nodeChange"
            />
          </el-form-item>
          <el-button
            type="primary"
            size="medium"
            style="margin-left: 50px"
            @click="save()"
          >保存</el-button>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getAddRoleMenuList
} from '@/api/roleManage'

export default {
  data() {
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
      permissionList: [], // 存放规则树
      rules: {
        roleName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 15, message: '长度不能超过15个字符', trigger: 'blur' }
        ],
        list: [{ required: true, validator: validateList, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPermissionTree()
  },
  methods: {
    getPermissionTree() {
      getAddRoleMenuList().then(res => {
        const temp = []
        this.treeNodeTrans(res.data, temp)
        console.log(temp)
        this.roleNameForm.permissionList = [{
          id: '0',
          label: '全部',
          children: temp
        }]
      })
    },
    treeNodeTrans(originData, treeArr) { // 转换数据为树形数据
      originData.forEach((item, index) => {
        if (item.flag === 1) {
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
    nodeTransData(originArr, newArr) { // 把树形数据转换成后台所需数据
      const checkedArr = this.$refs.tree.getCheckedKeys()
      const halfCheckArr = this.$refs.tree.getHalfCheckedKeys()
      // 去除树形结构根节点"全部"
      halfCheckArr.splice(halfCheckArr.indexOf('0'), 1)
      const selectedArr = checkedArr.concat(halfCheckArr)
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
    nodeChange(obj, checked) {
    },
    save() { // 保存数据
      this.$refs['roleNameForm'].validate((valid) => {
        if (valid) {
          const tempList = []
          this.nodeTransData(this.roleNameForm.permissionList[0].children, tempList)
          console.log(tempList)
          const param = {
            roleName: this.roleNameForm.roleName.trim(),
            orgRoleMenuReVOList: tempList
          }
          this.$axios('org/sys-role-insert', param, { method: 'post' }).then(res => {
            if (res.success) {
              this.$fun.msg('角色添加成功', 'success')
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
#addRole {
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
