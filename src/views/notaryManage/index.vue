<template>
  <div class="app-container">
    <h2>公证机构管理</h2>
    <div>
      <el-input v-model="input1"
                placeholder="请输入机构名称"
                size="medium"
                clearable />
      <el-input v-model="input2"
                placeholder="请输入权限"
                size="medium"
                clearable />
      <el-button type="primary"
                 size="medium"
                 icon="el-icon-search">搜索</el-button>
    </div>

    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              @sort-change="sortChange">
      <el-table-column label="ID"
                       prop="id"
                       sortable="custom"
                       align="center"
                       width="80"
                       :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公证处名称"
                       width="150px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type"
                @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Author"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer"
                       label="Reviewer"
                       width="110px"
                       align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp"
                       width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance"
                    :key="n"
                    icon-class="star"
                    class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Status"
                       class-name="status-col"
                       width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions"
                       align="center"
                       width="230"
                       class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary"
                     size="mini"
                     @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getNotary } from '@/api/notaryManage'

export default {
  data () {
    return {
      tableKey: 0,
      input1: '',
      input2: '',
      list: null,
      listLoading: true,
      listQuery: {
        orgId: 1,
        pageSize: 10,
        pageNo: 1
      },
      showReviewer: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      getNotary(this.listQuery).then(response => {

      })
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<style  scoped>
.el-input {
  width: 250px;
  margin-right: 30px;
}
</style>
