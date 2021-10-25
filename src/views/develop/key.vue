<template>
  <div class="main-box">
    <div style="background: #fff;padding: 20px;margin-bottom: 20px" class="table-box">
      <span>用户名：</span>
      <el-input v-model="search.username" placeholder="输入用户名搜索" />
      <el-button type="primary" size="small" icon="el-icon-search" @click="getDataList">搜索</el-button>
    </div>
    <div style="background: #fff;padding: 20px">
      <el-table :data="list" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop="tableName" label="序号" width="50">
          <template slot-scope="scope"><span>{{ scope.$index + 1 }}</span></template>
        </el-table-column>
        <el-table-column prop="id" label="用户ID" show-overflow-tooltip min-width="50" />
        <el-table-column prop="clientId" label="客户端" show-overflow-tooltip min-width="50" />
        <el-table-column prop="username" label="用户名" show-overflow-tooltip min-width="60" />
        <el-table-column prop="tokenValue" label="密钥" show-overflow-tooltip min-width="100" />
        <el-table-column prop="tokenType" label="类型" width="80" />
        <el-table-column prop="expiresIn" label="过期时间" width="90" />
        <el-table-column label="操作" min-width="20">
          <template slot-scope="scope">
            <span class="table-btn" @click="onClick_delKey(scope.row)">删除</span>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dataList: [],
      search: {
        pageNum: 1,
        pageSize: 10,
        username: ''
      },
      downList: [],
      total: 0,
      downCode: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.downList = []
      this.$axios('org/token/page', this.search).then(res => {
        if (res.success) {
          this.list = res.data.records
          this.total = res.data.total
        }
      })
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
    onClick_delKey(e) {
      this.$axios(`org/token/${e.access_token}`, {}, { method: 'DELETE' }).then(res => {
        if (res.success) {
          this.$fun.msg('删除成功！', 'success')
          this.getDataList()
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
