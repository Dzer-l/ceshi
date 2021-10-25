<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="onClick_showDialog">新增</el-button>
      <el-table :data="list" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop="name" label="序号" width="50">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column prop="clientId" label="编号" min-width="80"></el-table-column>
        <el-table-column prop="clientSecret" label="密钥" min-width="80"></el-table-column>
        <el-table-column prop="scope" label="域" min-width="50"></el-table-column>
        <el-table-column prop="autoapprove" label="自动放行" min-width="60">
          <template slot-scope="scope">
            {{ scope.row.autoapprove ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="authorizedTypeCn" label="授权模式" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accessTokenValidity" label="令牌时效" min-width="70"></el-table-column>
        <el-table-column prop="refreshTokenValidity" label="刷新时效" min-width="70"></el-table-column>
        <el-table-column prop="userName" label="操作" width="100">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_editTerm(scope.row)">编辑</span>
            <span class="table-btn" @click="onClikc_delTerm(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: center;margin-top: 20px">
        <el-pagination
          background
          center
          :page-size="search.pageSize"
          layout="prev, pager, next, jumper"
          :current-page.sync="search.pageNum"
          :total="total"
          @current-change="changePage"
          @size-change="toPage"
        />
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="addList" width="680px" :before-close="handleClose" :close-on-click-modal="false" class="show-form">
      <el-form ref="addJdbcForm" :model="form" style="display: flex;flex-wrap: wrap;justify-content: space-between;">
        <el-form-item label="编号" prop="clientId" :rules="{ required: true, message: '编号不能为空', trigger: 'blur' }"><el-input v-model="form.clientId" placeholder="请输入编号" /></el-form-item>
        <el-form-item label="密钥" prop="clientSecret" :rules="{ required: true, message: '密钥不能为空', trigger: 'blur' }"><el-input v-model="form.clientSecret" placeholder="请输入密钥" /></el-form-item>
        <el-form-item label="域" prop="scope" :rules="{ required: true, message: '域不能为空', trigger: 'blur' }"><el-input v-model="form.scope" placeholder="请输入域" /></el-form-item>
        <el-form-item label="自动放行">
          <div style="display: inline-block;width: 100%">
            <el-radio v-model="form.autoapprove" label="true">是</el-radio>
            <el-radio v-model="form.autoapprove" label="false">否</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="授权模式" class="auto-item">
          <el-checkbox-group v-model="authList" @change="getValue(authList)">
            <el-checkbox v-for="(item, i) in keyList" :key="i" :label="item.name" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="令牌时效"><el-input v-model="form.accessTokenValidity" placeholder="请输入令牌时效" /></el-form-item>
        <el-form-item label="刷新时效"><el-input v-model="form.refreshTokenValidity" placeholder="请输入刷新时效" /></el-form-item>
        <el-form-item label="回调地址"><el-input v-model="form.webServerRedirectUri" placeholder="请输入回调地址" /></el-form-item>
        <el-form-item label="权限"><el-input v-model="form.authorities" placeholder="请输入权限" /></el-form-item>
        <el-form-item label="拓展信息" class="auto-item">
          <el-input v-model="form.additionalInformation" type="textarea" placeholder="请输入拓展信息" />
        </el-form-item>
      </el-form>
      <div>
        <el-button style="margin-left: auto" type="primary" @click="onClick_addTerm">确认</el-button>
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
        clientId: '',
        clientSecret: '',
        scope: '',
        autoapprove: true,
        authorizedGrantTypes: '',
        additionalInformation: '',
        refreshTokenValidity: '',
        accessTokenValidity: '',
        webServerRedirectUri: '',
        authorities: ''
      },
      search: {
        pageNum: 1,
        pageSize: 10
      },
      authList: [],
      keyList: [],
      total: 0,
      addList: false
    }
  },
  created() {
    this.getDataList()
    this.$axios('org/sys-auth-client-grant-type-enum').then(res => {
      let list = []
      let keyList = Object.keys(res.data)
      for (let i of keyList) {
        list.push({ key: i, name: res.data[i] })
      }
      this.keyList = list
    })
  },
  methods: {
    getDataList() {
      this.$axios('org/sys-auth-client-list', this.search).then(res => {
        if (res.success) {
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },
    onClick_showDialog() {
      this.addList = true
    },
    resFormData() {
      this.form = {
        id: '',
        clientId: '',
        clientSecret: '',
        scope: '',
        autoapprove: true,
        authorizedGrantTypes: '',
        additionalInformation: '',
        refreshTokenValidity: '',
        accessTokenValidity: '',
        webServerRedirectUri: '',
        authorities: ''
      }
    },
    handleClose() {
      this.resFormData()
      this.addList = false
    },
    changePage(e) {
      this.search.pageNum = parseInt(e)
      var url = `/#${this.$route.path}?page=${e}`
      history.pushState(null, null, url)
      this.getDataList()
    },
    toPage(e) {
      this.search.pageNum = e
      this.getDataList()
    },
    onClick_addTerm() {
      this.$refs['addJdbcForm'].validate((e) => {
        if (e) {
          let list = []
          for (let i of this.authList) {
            for (let j of this.keyList) {
              if (j.name === i) {
                list.push(j.key)
              }
            }
          }
          this.form.authorizedGrantTypes = list.join(',')
          this.$axios(this.form.id ? 'org/update-sys-auth-client' : 'org/insert-sys-auth-client', this.form, { method: this.form.id ? 'PUT' : 'POST' }).then(res => {
            console.log(res)
            this.resFormData()
            this.authList = []
            this.getDataList()
            this.addList = false
          })
        }
      })
    },
    onClick_editTerm(e) {
      this.addList = true
      this.authList = e.authorizedTypeCn.split('|')
      if (e) {
        this.form = e
      } else {
        this.resFormData()
      }
    },
    onClikc_delTerm(e) {
      this.$axios('org/delete-sys-auth-client?id=' + e.id, {}, { method: 'delete' }).then(res => {
        if (res.success) {
          this.$fun.msg('删除成功！', 'success')
          this.getDataList()
        }
      })
    },
    getValue(e) {
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

<style lang="less">
    .show-form /deep/ .el-form-item__content{
        width: 310px;
    }
    .show-form /deep/ .auto-item,.show-form /deep/ .auto-item .el-form-item__content{
        width: 100%
    }
</style>
