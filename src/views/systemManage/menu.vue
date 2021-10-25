<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="onClick_showDialog">添加</el-button>
      <el-table
        :data="list"
        style="width: 100%;margin-top: 20px"
        border
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="菜单名称" min-width="140" />
        <el-table-column prop="pathName" label="路由名称" min-width="140" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="path" label="路径" min-width="120" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.type ? '按钮' : '左菜单' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="keepAlive" label="缓冲" width="65">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.keepAlive ? 'success' : 'info'">{{ scope.row.keepAlive ?
              '开启' : '关闭' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" min-width="180" />
        <el-table-column prop="userName" label="操作" width="150">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_editMenu(scope.row,1)">新增</span>
            <span class="table-btn" @click="onClick_editMenu(scope.row,2)">修改</span>
            <span class="table-btn" @click="onClikc_delMenu(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="addList"
      width="800px"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="show-form"
    >
      <el-form
        ref="addRolesForm"
        :model="form"
      >
        <el-form-item label="名称" prop="name" :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="roleDesc">
          <!-- <div style="display: inline-block;width: 100%"> -->
          <el-cascader
            v-model="form.idList"
            :options="list"
            :props="{ checkStrictly: true, value: 'id', label: 'name'}"
            clearable
            placeholder="根目录"
            @change="changeMenu"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
          <!-- </div> -->
        </el-form-item>
        <el-form-item
          label="路由名称"
          prop="pathName"
          :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"
        >
          <el-input v-model="form.pathName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="路由" prop="path" :rules="{ required: true, message: '路由不能为空', trigger: 'blur' }">
          <el-input v-model="form.path" placeholder="请输入路由" />
        </el-form-item>
        <el-form-item label="别名" prop="aliasName" :rules="{ required: false, message: '名称不能为空', trigger: 'blur' }">
          <el-input v-model="form.aliasName" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type" style="display: inline-block;width: 100%" size="small">
            <el-radio-button label="0">左菜单</el-radio-button>
            <el-radio-button label="1">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.hidden" style="display: inline-block;width: 100%" size="small">
            <el-radio-button label="0">是</el-radio-button>
            <el-radio-button label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由缓冲">
          <el-radio-group v-model="form.keepAlive" style="display: inline-block;width: 100%" size="small">
            <el-radio-button label="1">开启</el-radio-button>
            <el-radio-button label="0">关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公共菜单">
          <el-radio-group v-model="form.publicFlag" style="display: inline-block;width: 100%" size="small">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="外链">
          <el-radio-group
            v-model="form.externalLinkFlag"
            style="display: inline-block;width: 100%"
            size="small"
          >
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前窗口打开">
          <el-radio-group
            v-model="form.currentWindowFlag"
            style="display: inline-block;width: 100%"
            size="small"
          >
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="{ required: true, message: '排序不能为空', trigger: 'blur' }">
          <div style="display: inline-block;width: 100%">
            <el-input-number v-model="form.sort" controls-position="right" :min="0" :max="9999" />
          </div>
        </el-form-item>
      </el-form>
      <div class="confirm-btn">
        <el-button type="primary" @click="onClick_addMenu">确认</el-button>
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
        ids: '',
        name: '',
        type: '0',
        idList: [],
        parentId: 0,
        pathName: '',
        path: '',
        hidden: '0',
        sort: 99999,
        keepAlive: '0',
        permission: '',
        publicFlag: '1',
        externalLinkFlag: '0',
        currentWindowFlag: '0',
        aliasName:''
      },
      total: 0,
      addList: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.$axios('org/menu-tree').then(res => {
        if (res.success) {
          this.list = res.data
          this.total = res.data.total
        }
      })
    },
    onClick_showDialog() {
      this.addList = true
    },
    resForm() {
      this.form = {
        ids: '',
        name: '',
        type: '1',
        idList: [],
        parentId: 0,
        pathName: '',
        path: '',
        hidden: '0',
        sort: 99999,
        keepAlive: '0',
        permission: '',
        publicFlag: '1',
        externalLinkFlag: '0',
        currentWindowFlag: '0',
        aliasName:''
      }
    },
    handleClose() {
      this.addList = false
      setTimeout(() => {
        this.resForm()
      }, 300)
    },
    onClick_addMenu() {
      // console.log(this.form)
      this.$refs['addRolesForm'].validate((e) => {
        if (e) {
          this.form.type = parseInt(this.form.type)
          this.form.keepAlive = parseInt(this.form.keepAlive)
          if (typeof this.form.idList === 'object' && this.form.idList.length) {
            this.form.parentId = this.form.idList[this.form.idList.length - 1]
          } else {
            if (this.form.idList.length === 0) {
              this.form.parentId = 0
            } else {
              if (this.form.id && !this.form.ids) {
                this.form.parentId = this.form.id
              }
            }
          }

          var data = JSON.parse(JSON.stringify(this.form))
          if (!this.form.ids) {
            delete data.id
          }
          delete data.idList
          console.log(data)
          this.$axios(this.form.ids ? 'org/edit-org-menu' : 'org/save-org-menu', data, { method: this.form.ids ? 'PUT' : 'POST' }).then(res => {
            console.log(res)
            this.resForm()
            this.getDataList()
            this.addList = false
          })
        }
      })
    },
    onClikc_delMenu(e) {
      this.$axios('org/org-menu/' + e.id, { id: e.id }, { method: 'delete' }).then(res => {
        if (res.success) {
          this.$fun.msg('删除成功！', 'success')
          this.getDataList()
        }
      })
    },
    onClick_editMenu(e, i) {
      this.addList = true
      if (e) {
        this.form = JSON.parse(JSON.stringify(e))
        if (i === 1) {
          this.form.name = ''
          this.form.path = ''
          this.form.pathName = ''
          this.form.hidden = 0
          this.form.keepAlive = 0
          this.form.externalLinkFlag = 0
          this.form.currentWindowFlag = 0
          this.form.publicFlag = 1
          this.form.type = 0
          this.form.sort = 99999
          this.form.idList = this.form.id
        } else {
          console.log(this.form)
          this.form.idList = this.form.parentId ? this.form.parentId : []
          this.form.ids = '112312'
        }
      } else {
        this.resForm()
      }
    },
    changeMenu(e) {
      console.log(e)
      if (e.length === 0) {
        this.form.parentId = null
      }
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

    .data-main {
        padding: 0 50px 0;
        box-sizing: border-box;
    }

    .table-btn {
        cursor: pointer;
        color: #409EFF;
        margin-left: 20px;

        &:first-child {
            margin-left: 0;
        }
    }
    .el-form{
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
        display: flex;
        /deep/ .el-form-item__label{
          width: 100px;
          text-align: left;
          margin-left: 20px;
        }
        /deep/ .el-form-item__content{
          flex: 1;
        }
          /deep/ .el-cascader{
            width: 100%;
          }
      }
    }
    .confirm-btn{
      display: flex;
      justify-content: flex-end;
    }
</style>

<style lang="less">
    // .show-form /deep/ .el-form-item__content,
    // .show-form /deep/ .el-cascader {
    //     width: 310px;
    // }

    // .show-form /deep/ .auto-item,
    // .show-form /deep/ .auto-item .el-form-item__content {
    //     width: 100%
    // }
</style>
