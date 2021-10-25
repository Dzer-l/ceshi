<template>
  <div>
    <div class="outside_container">
      <div class="content_wrapper">
        <div class="header_wrapper">
          <div class="title">订单列表</div>
          <div class="button_wrapper">
            <!-- <el-button type="primary" size="medium">点击</el-button> -->
          </div>
        </div>

        <div>
          <el-table
            :data="orderListTableData"
            border
            :header-cell-style="{background:'#e6f6fe',color:'#000'}"
          >
            <el-table-column label="业务类型" prop="prodName" align="center" />
            <el-table-column label="申请人" prop="applicantName" align="center" />
            <el-table-column label="联系方式" prop="applicantMobile" align="center" />
            <el-table-column label="订单提交时间" prop="createTime" align="center" />
            <el-table-column label="承办人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.acceptSysUserName ? scope.row.acceptSysUserName : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderNum" align="center" />
            <el-table-column label="订单状态" prop="name" align="center">
              <template slot-scope="scope">
                <el-tag disable-transitions :class="tagClass(scope.row)">
                  <span>{{ scope.row.orderStatus | filterOrderState }}</span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="支付状态" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.paymentStatus === 0 ? "未支付" : ( scope.row.paymentStatus===1?"已支付":'线下支付') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination_wrapper">
          <el-pagination
            background
            :current-page="pagination.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, sizes, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { filterOrderState } from '../../filters'
import { getProxyOrderList } from '@/api/orderList'
export default {
  filters: {
    filterOrderState
  },
  data() {
    return {
      orderListTableData: [],

      // 分页
      total: 100,
      pagination: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getProxyOrderList(this.pagination)
      // console.log(res);
      if (res.success && res.data) {
        this.orderListTableData = res.data.list
        this.total = res.data.total
      }
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagination.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagination.pageNum = val
      this.getList()
    },

    tagClass(e) {
      switch (true) {
        case e.orderStatus === 306:
          return 'tag-suc'
        case [401, 402].includes(e.orderStatus):
          return 'tag-err'
        case [202, 101].includes(e.orderStatus):
          return 'tag-no'
        default:
          return 'tag-war'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.outside_container {
	padding: 20px;
	background: #f0f2f5;
	min-height: calc(100vh - 50px);

	.content_wrapper {
		border-radius: 6px;
		padding: 30px;
		background: #fff;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
}

.header_wrapper {
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.title {
		font-size: 20px;
		font-weight: bold;
	}

	.back_button {
		cursor: pointer;
		font-weight: bold;
		margin-right: 4px;
	}

	// .button_wrapper {}
}
.pagination_wrapper {
	margin-top: 20px;
	text-align: center;
}
/deep/ .el-table__row > td {
	padding: 8px 0;
}
</style>

<style>
.el-table .err-row {
	background: #f9f9f9;
}

.el-tag.tag-suc {
	background-color: #f0f9ea;
	border: 1px solid #c2e7b0;
	color: #67c239;
}

.el-tag.tag-err {
	background-color: #fef0f0;
	border: 1px solid #fbc4c4;
	color: #f56c6c;
}

.el-tag.tag-no {
	background-color: #f4f4f5;
	border: 1px solid #999;
	color: #999;
}

.el-tag.tag-war {
	background-color: #fffbf5;
	border: 1px solid #ed6732;
	color: #ed6732;
}
</style>
