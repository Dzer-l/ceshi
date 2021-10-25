<template>
  <div class="business_main">
    <div class="container">
      <div style="padding-left:20px;">
      <el-row :gutter="5">
        <el-col :span="10">
          <el-input v-model="orderNumOrDossierNum" placeholder="请输入订单编号/卷宗号" clearable @clear="atClear"></el-input>
        </el-col>
        <el-col :span="6">
            <el-button style="overflow:hidden;" type="primary" @click="handelSearch">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 表格区域 -->
    <div class="tableData_main">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :row-class-name="rowClassName">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column prop="businessTypeDesc" label="业务类型" align="center" />
        <el-table-column prop="dossierNum" label="卷宗号" align="center" show-overflow-tooltip />
        <el-table-column prop="applicantName" label="申请人" align="center" show-overflow-tooltip />
        <el-table-column prop="createTime" label="提交时间" align="center" show-overflow-tooltip />
        <el-table-column prop="acceptSysUserName" label="承办人" align="center" show-overflow-tooltip />
        <el-table-column prop="orderNum" label="订单编号" align="center" show-overflow-tooltip />

        <el-table-column prop="" label="订单状态" align="center">
          <template slot-scope="scope">
            <!-- <el-tag disable-transitions :class="tagClass(scope.row)">
							<span>{{ scope.row.orderStatus | orderState }}</span>
						</el-tag> -->
            <el-tag disable-transitions :class="tagClass(scope.row)">
              <span>{{ scope.row.orderStatusDesc }}</span>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="orderSource" label="订单来源" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderSource | getSource }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              class="exit_btn"
              style="font-size: 14px"
              @click="handleEdit(scope.$index, scope.row)"
            >
              {{ scope.row.orderStatus | correspondingOperation }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="paging_box">
        <div class="paging">
          <el-pagination
            background
            :current-page.sync="currentPage3"
            :page-size="pageSize"
            layout="prev, pager, next,sizes, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { getInfo } from '../../api/delegate.js'

import { getUniversalListData, getUniversalOrderDetail } from '../../api/universal'

export default {
  filters: {
    orderState(val) {	// 订单状态
      var str = ''
      switch (true) {
        case val === 306:
          str = '已完成'
          return str
        case val === 201:
          str = '待处理'
          return str
        case val === 402:
          str = '已关闭'
          return str
        default:
          return val
      }
    },
    getSource(val) {
      // var str = ''
      // if (val === 1) {
      // 	str = 'PC'
      // } else {
      // 	str = '小程序'
      // }
      return '万能公证受理小程序'
    },
    correspondingOperation(val) {
      var str = '查看详情'
      return str
    }
  },

  data() {
    return {
      orderNumOrDossierNum: '', // 搜索的值
      currentPage3: 1, // 初始加载表格的页码
      pageSize: 10, // 初始加载表格每页显示的数据
      tableData: [],	// 表格数据
      loading: false,
      total: null
    }
  },

  created() {
    if (sessionStorage.getItem('pageSize')) {
      this.pageSize = parseInt(sessionStorage.getItem('pageSize'))
    }
    if (sessionStorage.getItem('universalPageNum')) {
      this.currentPage3 = parseInt(sessionStorage.getItem('universalPageNum'))
    }
    this.getUniversalList()
  },

  mounted() {
    var that = this
    // 监听浏览器是否关闭
    window.addEventListener('beforeunload', e => that.browerStatus())
  },

  destroyed() {
    var that = this
    window.removeEventListener('beforeunload', e => that.browerStatus())
  },

  methods: {
    // 搜索
    handelSearch() {
      // let orderNumOrDossierNum = this.orderNumOrDossierNum.trim()

      // if (!orderNumOrDossierNum) {
      // 	return this.$message.warning('订单编号/卷宗号不能为空！');
      // } else {
      this.getUniversalList()
      // }
    },

    // 清除时触发
    atClear() {
      this.getUniversalList()
    },

    browerStatus() {
      if (sessionStorage.getItem('universalPageNum')) {
        sessionStorage.removeItem('universalPageNum')
      }
    },

    rowClassName(e) {
      return e.rowIndex % 2 && 'err-row'
    },

    getProductionList() {
      this.$axios(`org/org-production-list`).then(res => {
        console.log(res)
        this.proType = res.data
      })
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
    },

    // 获取列表
    getUniversalList() {
      const data = {
        pageNum: this.currentPage3,
        pageSize: this.pageSize,
        orderNumOrDossierNum: this.orderNumOrDossierNum
      }

      getUniversalListData(data).then(res => {
        console.log(res)
        if (res.data != null) {
          this.total = res.data.total
          this.tableData = res.data.list
        }
      })
    },

    // 导出订单
    down(data) {
      delete data.pageNum
      delete data.pageSize
      data.isTest = 0
      data.orgId = sessionStorage.getItem('org_id')
      this.$axios('org/download-order-excel', data, { method: 'POST', responseType: 'blob' }).then(blob => {
        this.$fun.blobFile(blob, '订单列表.xls')
      })
    },

    // 点击表格中的按钮跳转对应的详情页
    handleEdit(index, row) {
      sessionStorage.removeItem('tabActiveName')
      getInfo({ orderId: row.id }).then(res => {
        console.log(res)

        if (res.success) {
          this.$router.push({
            name: 'universalDetailsOrder',
            query: {
              orderId: row.id
              // orderNum: row.orderNum,
              // bidType: row.bidType,
              // prodCode: row.prodCode,
            }
          })

          // if (row.businessType === 1) {
          // 	this.$router.push({
          // 		name: 'delegateInfo',
          // 		query: { id: row.id }
          // 	})
          // } else {
          // 	if (row.businessType === 4 || row.businessType === 5 || row.businessType === 6 || row.businessType === 7) {
          // 		this.$router.push({
          // 			name: 'entryDetailsOrder',
          // 			query: {
          // 				orderId: row.id
          // 				// orderNum: row.orderNum,
          // 				// bidType: row.bidType,
          // 				// prodCode: row.prodCode,
          // 			}
          // 		})
          // 	} else {
          // 		// console.log('0000000000000000')
          // 		this.$router.push({
          // 			name: 'detailsOrder',
          // 			query: {
          // 				orderId: row.id,
          // 				orderNum: row.orderNum,
          // 				bidType: row.bidType,
          // 				prodCode: row.prodCode
          // 			}
          // 		})
          // 	}
          // }
        } else if (res.code === 20006) {
          this.$alert('您不是该订单的承办人，无法查看订单', '提示', { confirmButtonText: '确定' })
        }
      })
    },

    // 设置每一页表格显示多少数据的事件
    handleSizeChange(val) {
      sessionStorage.setItem('pageSize', val)
      this.pageSize = val
      this.getUniversalList()
    },

    // 点击跳转上一页下一页的事件
    handleCurrentChange(val) {
      sessionStorage.setItem('universalPageNum', this.currentPage3)
      this.getUniversalList()
    },

    reset() {
      this.test = []
      this.testAll = ['全部']
      this.startDate = ''
      this.endDate = ''
      this.formInline.region = 1
      this.formInline.proCode = ''
      this.getList()
      this.formInline.user = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-input-group__append button.el-button {
	background-color: #409eff;
	color: #fff;
	border-radius: 0;
}

.font-title {
	font-size: 14px !important;
	color: #666 !important;
	font-weight: bold;
}
p {
	margin: 0;
}
/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
	background-color: #eee;
}
/deep/ .el-table--border,
/deep/ .el-table--group {
	border-color: #eee;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
	border-bottom: 1px solid #eee;
}
/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
	border-bottom: 1px solid red;
}
/deep/ .el-table--border td,
/deep/ .el-table--border th {
	border-right: none;
}
.box_flex_row {
	display: flex;
	flex-flow: row;
}
.list_back {
	background: #fff;
	padding: 0 20px 20px 20px;
}
.box_flex_column {
	display: flex;
	flex-flow: column;
}
.font_title_color {
	color: #333;
	// font-size: 16px;
}
/deep/ .el-pagination__jump {
	margin-left: 0;
}
/deep/ .el-input__prefix {
	width: 30px;
	position: absolute;
	left: 85% !important;
	z-index: 99;
}
/deep/ .el-date-editor--datetime input {
	padding-left: 10px;
}
/deep/.el-date-editor--datetime .el-input__suffix-inner > i::before {
	width: 25px;
	position: absolute;
	right: 80% !important;
}
.el-date-editor.el-input {
	width: 200px;
	font-size: 10px;
}
/deep/ .el-table--border:after,
/deep/ .el-table--group:after,
/deep/ .el-table:before {
	background-color: #eee;
}
/deep/ .el-table--border,
/deep/ .el-table--group {
	border-color: #eee;
}
/deep/ .el-table td,
/deep/ .el-table th.is-leaf {
	border-bottom: 1px solid #eee;
}
/deep/ .el-table--border th,
/deep/ .el-table--border th.gutter:last-of-type {
	border-bottom: 1px solid red;
}
/deep/ .el-table--border td,
/deep/ .el-table--border th {
	border-right: none;
}
.container{
  background: #fff;
  padding: 35px 20px 30px 20px;
  border-radius: 8px;
}

.business_main {
	background: #f7f7f7;
	padding: 20px;
	min-height: calc(100vh - 50px);
	.box_flex_column;
	.category_to_retrieve {
		.box_flex_row;
		.list_back;
		.select_type {
			background: #fff;
			width: 200px;
			text-align: center;
			position: relative;
			margin-right: 30px;
			& > .el-select {
				/deep/ & > .el-input {
					/deep/ .el-input__inner {
						color: #333;
					}
				}
			}
			& > p {
				padding: 5px 0;
				.font_title_color;
			}
			.select_type_data {
				position: absolute;
				bottom: 0;
				top: 30px;
				z-index: 9;
			}
			/deep/ input {
				color: #333;
			}
		}
		.search_btn {
			margin-left: 30px;
			button {
				width: 100px;
			}
		}
	}
	.category_title {
		& > p {
			background-color: #fff;
			padding: 20px;
			padding-bottom: 10px;
		}
	}
	.select_date {
		.list_back;
		position: relative;
		& > span {
			position: absolute;
			bottom: 0px;
			z-index: 100;
			font-size: 12px;
			color: red;
		}
		.date_section {
			margin: 0 5px;
		}
	}
	& p {
		.font_title_color;
		padding-bottom: 10px;
	}
	.allSelect_btn {
		padding-bottom: 20px;
		border-bottom: solid #eee 1px;
		.list_back;
		.box_flex_row;
		// border-bottom: solid 1px #d7d7d7;
		padding-bottom: 10px;
		justify-content: space-between;
		align-items: center;
		.button_set,
		& .btn_box {
			.box_flex_row;
			.allBtn {
				margin: 0 0 0 30px;
				.el-checkbox-group {
					width: 90px;
				}
			}
			& label,
			& .el-checkbox-group {
				display: flex;
				// justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				.el-checkbox {
					margin-bottom: 10px;
					margin-right: 35px;
				}
			}
			& /deep/ span {
				font-size: 14px;
			}
		}
		.reset_btn {
			padding-top: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			& button {
				width: 70px;
				padding: 0;
				text-align: center;
				line-height: 32px;
			}
		}
	}
	.tableData_main {
		// box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		.list_back;
		padding-top: 30px;
		flex: 1;
		& /deep/ .el-table td {
			padding: 8px 0;
		}
		.paging_box {
			text-align: center;
			padding: 24px 0 4px 0;
			.box_flex_row;
			justify-content: center;
			align-items: center;
			& /deep/ .el-pager li {
				margin-left: 10px;
			}
			& /deep/ .btn-next {
				margin-left: 10px;
			}
		}
		.exit_btn {
			.span {
				font-size: 10px;
			}
		}
	}
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
