<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px;margin-bottom: 20px" class="table-box">
      <el-select v-model="search.dsName" placeholder="请选择" @change="getDataList">
        <el-option
          v-for="(item, index) in dataList"
          :key="index"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-input v-model="search.tableName" placeholder="表名称" />
      <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
      <el-button style="margin-left: 20px" type="primary" size="small" icon="el-icon-download" @click="onClick_showDown">批量生成</el-button>
    </div>
    <div style="background: #fff;padding: 20px">
      <el-table :data="list" style="width: 100%;margin-top: 20px" border @selection-change="selectChange">
        <el-table-column type="selection" width="60" />
        <el-table-column prop="tableName" label="序号" width="50">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column prop="tableName" label="表名称" min-width="60" />
        <el-table-column prop="tableComment" label="表注释" min-width="40" />
        <el-table-column prop="tableCollation" label="表编码" min-width="50" />
        <el-table-column prop="createTime" label="创建时间" min-width="80" />
        <el-table-column prop="userName" label="操作" min-width="20">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_showDown(scope.row)">生成</span>
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
    <el-dialog title="生成配置" :visible.sync="downCode" width="460px" :before-close="handleClose" :close-on-click-modal="false">
      <el-form ref="downCodeForm" :model="form" label-width="80px">
        <el-form-item label="表名称" prop="tableName">
          <el-input v-if="form.tableName.indexOf('-') == -1" v-model="form.tableName" disabled placeholder="请输入名称" />
          <el-input v-else v-model="form.tableName" style="width: 310px" type="textarea" disabled placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="包名" prop="packageName" :rules="{ required: true, message: '包名不能为空', trigger: 'blur' }"><el-input v-model="form.packageName" placeholder="请输入包名" /></el-form-item>
        <el-form-item label="作者" prop="author" :rules="{ required: true, message: '作者不能为空', trigger: 'blur' }"><el-input v-model="form.author" placeholder="请输入作者" /></el-form-item>
        <el-form-item label="模块名" prop="moduleName"><el-input v-model="form.moduleName" placeholder="请输入密码" /></el-form-item>
        <el-form-item label="表前缀" prop="tablePrefix"><el-input v-model="form.tablePrefix" placeholder="请输入密码" /></el-form-item>
        <el-form-item label="注释" prop="comments"><el-input v-model="form.comments" placeholder="请输入密码" /></el-form-item>
      </el-form>
      <div>
        <el-button style="margin-left: auto" type="primary" @click="onClick_downCode">下载</el-button>
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
        tableName: '',
        packageName: '',
        author: '',
        moduleName: '',
        comments: '',
        tablePrefix: '',
        dsName: 'master'
      },
      dataList: [],
      search: {
        current: 1,
        size: 10,
        dsName: '',
        tableName: ''
      },
      downList: [],
      total: 0,
      downCode: false
    }
  },
  created() {
    this.getDataType()
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.downList = []
      this.$axios('gen/generator/page', this.search).then(res => {
        if (res.success) {
          for (const i of res.data.records) {
            i.createTime = i.createTime.substring(0, 10) + ' ' + i.createTime.substring(11, 19)
          }
          this.list = res.data.records
          this.total = res.data.total
        }
      })
    },
    getDataType() {
      this.$axios('gen/dsconf/list').then(res => {
        if (res.success) {
          this.dataList = res.data
        }
      })
    },
    onClick_showDown(e) {
      this.form.dsName = this.search.dsName ? this.search.dsName : 'master'
      if (e['tableName']) {
        this.form.tableName = e.tableName
        this.downCode = true
      } else if (this.downList.length >= 1) {
        this.form.tableName = this.downList.join('-')
        this.downCode = true
      } else {
        this.$fun.msg('还未选择需要生成的表', 'error')
      }
    },
    handleClose() {
      this.$refs['downCodeForm'].resetFields()
      this.downCode = false
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
          this.$axios('gen/dsconf', this.form, { method: this.form.id ? 'PUT' : 'POST' }).then(res => {
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
    selectChange(e) {
      for (const i of e) {
        this.downList.push(i.tableName)
      }
    },
    onClick_downCode() {
      this.$axios('gen/generator/code', this.form, { method: 'POST', responseType: 'blob' }).then(blob => {
        this.saveAs(blob, 'code.zip')
      })
    },
    saveAs(blob, fileName) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName)
      } else {
        const link = document.createElement('a')
        const body = document.querySelector('body')

        link.href = window.URL.createObjectURL(blob) // 创建对象url
        link.download = fileName

        // fix Firefox
        link.style.display = 'none'
        body.appendChild(link)

        link.click()
        body.removeChild(link)

        window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
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

    .el-input,
    .el-select {
        width: 310px;
        margin-right: 30px;
    }
</style>
