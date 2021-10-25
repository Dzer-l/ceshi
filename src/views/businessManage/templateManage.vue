<template>
  <section id="templateManage">
    <div class="app-container">
      <div>
        <div class="table-box">
          <h4>通用模板</h4>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            border
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="模板名称">
              <template slot-scope="scope">
                <span>{{ scope.row.templateName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="模板类型">
              <template slot-scope="scope">
                <span>{{ scope.row.templateTypeDesc }}(通用)</span>
              </template>
            </el-table-column>
            <el-table-column
              label="配置"
              class-name="operate-cell"
            >
              <template slot-scope="{row}">
                <span class="span-btn" @click="linkTo(row)">编辑</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-show="total>0"
            :page-size="listQuery.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :current-page.sync="listQuery.pageNum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background
            @current-change="getPaginationList"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
      <router-view />
    </div>
  </section>
</template>

<script>
import { getCommonTemplate } from '@/api/templateManage'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0, // 信息条数
      tempUserId: undefined, // 零时存放userId
      selectedRows: [] // 保存被选中项
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getCommonTemplate(this.listQuery).then(res => {
        if (res.success) {
          if(res.data.list){
            this.list = res.data.list
            this.total = res.data.total
          }
        } else {
          this.$fun.msg('获取通用模板失败', 'error')
        }
        this.listLoading = false
      })
    },
    getPaginationList(e) {
      this.listQuery.pageNum = e
      this.getList()
    },
    // 每页显示条数变化
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    linkTo(row) {
      this.$router.push({ path: '/businessManage/templateManage/editGeneralTemplate', query: { templateId: row.id }})
    }
  }
}
</script>

<style lang="scss">
#templateManage {
  .app-container {
    background: #f5f5f5;
    min-height: calc(100vh - 50px);
  }
  .table-box {
    background: #fff;
    padding: 30px;
    min-height: calc(100vh - 170px);
  }
  .align-right {
    text-align: right;
  }
  .el-pagination {
    margin-top: 24px;
  }
  .span-btn{
    color: #1890ff;
    margin: 10px;
    cursor: pointer;
  }
  .operate-cell span{
    margin:0 15px 0 0;
  }
}
</style>
