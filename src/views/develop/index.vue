<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="onClick_showDialog">新增</el-button>
      <el-table :data="list" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop="name" label="序号" width="50">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column prop="name" label="名称" min-width="60" />
        <el-table-column prop="url" label="jdbcUrl" min-width="120" show-overflow-tooltip />
        <el-table-column prop="username" label="用户名" min-width="50" />
        <el-table-column prop="password" label="密码" min-width="120" show-overflow-tooltip />
        <el-table-column prop="createDate" label="创建时间" width="170" />
        <el-table-column prop="updateDate" label="更新时间" width="170" />
        <el-table-column prop="userName" label="操作" width="120">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_editJdbc(scope.row)">修改</span>
            <span class="table-btn" @click="onClikc_delJdbc(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: center;margin-top: 20px">
        <el-pagination
          background
          center
          :page-size="search.size"
          layout="prev, pager, next, jumper"
          :current-page.sync="search.current"
          :total="total"
          @current-change="changePage"
          @size-change="toPage"
        />
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="addList" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="addJdbcForm" :model="form">
        <el-form-item label="名称" prop="name" :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"><el-input v-model="form.name" placeholder="请输入名称" /></el-form-item>
        <el-form-item label="jdbcUrl" prop="url" :rules="{ required: true, message: 'jdbcUrl不能为空', trigger: 'blur' }"><el-input v-model="form.url" placeholder="请输入jdbcUrl" /></el-form-item>
        <el-form-item label="用户名" prop="username" :rules="{ required: true, message: '用户名不能为空', trigger: 'blur' }"><el-input v-model="form.username" placeholder="请输入用户名" /></el-form-item>
        <el-form-item label="密码" prop="password" :rules="{ required: true, message: '密码不能为空', trigger: 'blur' }"><el-input v-model="form.password" placeholder="请输入密码" /></el-form-item>
      </el-form>
      <div>
        <el-button style="margin-left: auto" type="primary" @click="onClick_addJdbc">确认</el-button>
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
        name: '',
        url: '',
        username: '',
        password: ''
      },
      search: {
        current: 1,
        size: 10
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
      this.$axios('gen/dsconf/page', this.search).then(res => {
        if (res.success) {
          this.list = res.data.records
          this.total = res.data.total
        }
      })
    },
    onClick_showDialog() {
      this.addList = true
    },
    handleClose() {
      this.$refs['addJdbcForm'].resetFields()
      this.addList = false
    },
    changePage(e) {
      this.search.current = parseInt(e)
      var url = `/#${this.$route.path}?page=${e}`
      history.pushState(null, null, url)
      this.getDataList()
    },
    toPage(e) {
      this.search.current = e
      this.getDataList()
    },
    onClick_addJdbc() {
      this.$refs['addJdbcForm'].validate((e) => {
        if (e) {
          const form = JSON.parse(JSON.stringify(this.form))
          form.url = this.$fun.base64(form.url)
          this.$axios('gen/dsconf', form, { method: form.id ? 'PUT' : 'POST' }).then(res => {
            console.log(res)
            this.$refs['addJdbcForm'].resetFields()
            this.getDataList()
            this.addList = false
          })
        }
      })
    },
    onClick_editJdbc(e) {
      this.addList = true
      this.form = {
        id: e.id,
        name: e.name,
        url: e.url,
        username: e.username,
        password: e.password
      }
    },
    onClikc_delJdbc(e) {
      this.$axios(`gen/dsconf/${e.id}`, {}, { method: 'DELETE' }).then(res => {
        console.log(res)
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
