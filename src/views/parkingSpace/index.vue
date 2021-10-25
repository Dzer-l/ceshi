<template>
	<div class="container">
		<el-card shadow="always" :body-style="{ padding: '30px 20px' }" class="el_card_class">
			<!-- 头部搜索 -->
			<div class="search-issunce-box">
				<el-form label-position="right" label-width="90px" :model="searchFormData">
					<el-row :gutter="20">
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="登记编号：">
								<el-input v-model="searchFormData.registerNum" placeholder="请输入登记编号"></el-input>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="备案号：">
								<el-input v-model="searchFormData.parkingCaseNum" placeholder="请输入备案号"></el-input>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="持有人：">
								<el-input v-model="searchFormData.holderName" placeholder="请输入持有人"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<!-- 第二行 -->
					<el-row :gutter="20">
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="承办人：">
								<el-select style="width:100%" v-model="searchFormData.orgUserName" placeholder="请选择承办人">
									<el-option v-for="(item,index) in orgUserList" :key="index" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8" style="width:540px">
							<el-form-item label="提交时间：">
								<el-date-picker v-model="searchFormData.startTime" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择开始时间"
									:picker-options="pickerStartOptions" />
								<span class="date_section">—</span>
								<el-date-picker v-model="searchFormData.endTime" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择结束时间"
									:picker-options="pickerEndOptions" default-time="23:59:59" />
							</el-form-item>
						</el-col>
						<el-col :span="4" style="min-width:280px">
							<el-button type="primary" size="default" @click="handleQuery">查询</el-button>
							<el-button size="default" @click="resetForm">重置</el-button>
							<el-tooltip class="item" effect="dark" placement="bottom">
								<div slot="content">若通过“查询”对订单进行筛选，<br>则导出的订单为被筛选后的数据。</div>
								<el-button type="primary" plain size="default" @click="handleExport">导出订单</el-button>
							</el-tooltip>
						</el-col>
					</el-row>

					<!-- 单选筛选 -->
					<el-row :gutter="20">
						<el-form-item style="margin:15px 0 0 10px;" label="登记状态：">
							<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
							<el-checkbox-group v-model="searchFormData.registerStatusList"
								style="display: inline;margin-left: 30px;" @change="handleCheckedStatusesChange">
								<el-checkbox v-for="status in registerStatusList" :key="status.name"
									:label="status.label">
									{{ status.name }}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-row>
				</el-form>
			</div>

			<!-- 列表 -->
			<div class="content_box">
				<div class="table_content">
					<el-table ref="multipleTable" :data="tableData" border row-class-name="table_row_class">
						<el-table-column type="index" prop="prodName" label="序号" width="80px" align="center" />
						<el-table-column prop="businessType" label="业务类型" align="center"></el-table-column>
						<el-table-column prop="registerNum" label="登记编号" align="center" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="parkingCaseNum" label="备案号" align="center"></el-table-column>
						<el-table-column prop="userName" label="持有人" align="center" show-overflow-tooltip
							min-width="120">
						</el-table-column>
						<el-table-column prop="createTime" label="提交时间" align="center" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="orgUserName" label="承办人" align="center"></el-table-column>
						<el-table-column label="订单状态" align="center">
							<template slot-scope="{row}">
								<el-tag size="medium" :type="getRegisterStatusTag(row.registerStatus)">
									{{row.registerStatus | filterRegisterStatus}}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-link type="primary" @click="handleToDetail(scope.row)">查看详情</el-link>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<!-- 分页 -->
				<div class="pagination_content">
					<el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 30, 40]" background
						:current-page.sync="pagination.pageNum" @current-change="handleCurrentChange"
						layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import {
	defenseParkingRegisterList,
	downloadParkingOrder,
	getOperator,
} from '../../api/parkingSpace';
import { filterRegisterStatus } from '../../utils/filters';
const moment = require('moment');
export default {
	filters: {
		filterRegisterStatus,
	},
	data() {
		return {
			searchFormData: {
				registerNum: "",			// "登记编号",
				parkingCaseNum: "",			// "车位备案号",
				holderName: "",				// "持有人",
				orgUserName: "",			// "承办人",
				startTime: "",				// "开始时间",
				endTime: "", 				// "结束时间",
				registerStatusList: [],			// 登记状态
			},
			tableData: [],	// 列表数据

			checkAll: true,	// 全选
			registerStatusList: [	// 0审核中，1登记成功，2已拒绝，3已撤销"
				{ name: '审核中', label: 0 },
				{ name: '登记成功', label: 1 },
				{ name: '已拒绝', label: 2 },
				{ name: '已撤销', label: 3 },
			],
			orgUserList: [{ label: "全部", value: "" }],	// 承办人列表

			total: 0,
			pagination: {	// 分页
				pageNum: 1,
				pageSize: 10,
			},
			pickerStartOptions: {	// 开始时间
				disabledDate: (time) => {
					return time.getTime() > moment(this.searchFormData.endTime).format("x")
				}
			},
			pickerEndOptions: {	// 结束时间
				disabledDate: (time) => {
					return time.getTime() < moment(this.searchFormData.startTime).format("x")
				}
			},
		}
	},
	created() {
		this.getTableList()
		this.getOperatorList()
	},
	methods: {
		// 获取承办人
		async getOperatorList() {
			let res = await getOperator()
			console.log("获取承办人", res);
			if (res.success && res.data) {
				res.data.forEach(item => {
					this.orgUserList.push({
						label: item,
						value: item
					})
				})
			}
		},

		// 导出订单
		async handleExport() {
			if (!this.searchFormData.startTime || !this.searchFormData.endTime) {
				return this.$message.warning("请选择导出订单的提交时间")
			}

			let range = moment(this.searchFormData.endTime).diff(moment(this.searchFormData.startTime), "days")
			if (range < 0) return this.$message.error("导出开始时间不能大于结束时间")
			if (range > 365) return this.$message.error("导出时间最大为12个月")

			let data = {
				startTime: this.searchFormData.startTime,
				endTime: this.searchFormData.endTime,
			}

			let res = await downloadParkingOrder(data)
			console.log("导出订单", res);
			if (res.type == "application/x-download") {
				let fileName = `【人防车位登记】 ${moment(this.searchFormData.startTime).format("YYYY-MM-DD")} - ${moment(this.searchFormData.endTime).format("YYYY-MM-DD")}.xls`
				this.$fun.blobFile(res, fileName)
				this.$message.success("导出成功")
				return
			}

			this.$message.error("导出失败，请稍后再试")
		},

		// 查询
		handleQuery() {
			this.pagination.pageNum = 1
			this.getTableList()
		},

		// 重置
		resetForm(formName) {
			this.searchFormData = {
				registerNum: "",			// "登记编号",
				parkingCaseNum: "",			// "车位备案号",
				holderName: "",				// "持有人",
				orgUserName: "",			// "承办人",
				startTime: "",				// "开始时间",
				endTime: "", 				// "结束时间",
				registerStatusList: [],			// 登记状态
			}
			this.pagination = {	// 分页
				pageNum: 1,
				pageSize: 10,
			}
			this.checkAll = true
			this.getTableList()
		},

		// 查看详情
		handleToDetail(row) {
			console.log(row);
			this.$router.push({
				name: 'parkingSpacelDetail',
				query: {
					registerId: row.id
				}
			})
		},

		// 全选
		handleCheckAllChange(val) {
			console.log('全选', val);
			if (val) {
				this.searchFormData.registerStatusList = []
				this.getTableList()
			} else {
				this.tableData = []
			}
		},

		// 单选
		handleCheckedStatusesChange(value) {
			console.log('单选', value);
			this.checkAll = value.length === 0 ? true : false
			this.searchFormData.registerStatusList = value
			this.getTableList()
		},

		// 获取列表
		async getTableList() {
			let data = {
				...this.pagination,
				...this.searchFormData,
			}
			// console.log('查询表单', data)
			let res = await defenseParkingRegisterList(data)
			console.log('列表', res);
			if (res.success && res.data) {
				this.tableData = res.data.list
				this.total = res.data.total
			}
		},

		// 分页每页显示条数变化
		handleSizeChange(val) {
			console.log('每页:' + val);
			this.pagination.pageSize = val
			this.getTableList()
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.pagination.pageNum = val
			this.getTableList()
		},

		// 获取 tag type
		getRegisterStatusTag(status) {
			const statusObj = {
				0: "warning",
				1: "success",
				2: "danger",
				3: "info",
			}

			return statusObj[status]
		}
	},
}
</script>

<style lang="less" scoped>
.container {
	padding: 20px;
	min-width: 1100px;
}
// .el_card_class {
// 	min-height: calc(100vh - 100px);
// }
.el-date-editor.el-input {
	width: 200px;
}

.date_section {
	padding: 0 5px;
	color: #999;
}

.search-issunce-box {
	display: block !important;
	background: #fff;
	padding: 5px;
	min-width: 100%;
}

.content_box {
	padding: 0 10px;
	background: #fff;
	min-width: 100%;
}

.tips_content {
	margin-top: 10px;

	.select_tips {
		color: #409eff;
		border: 1px solid #409eff;
		background-color: #e6f7ff;

		.tips_text {
			color: #409eff;
			display: inline-block;
			padding: 0 5px;
		}
	}
}

.table_content {
	margin-top: 5px;
	border-top: 1px solid #eee;
}

.pagination_content {
	padding: 40px 0 20px 0;
	text-align: center;
}

/deep/.el-table thead {
	color: #333;
}

/deep/.el-alert__icon.is-big {
	margin-top: 2px;
	font-size: 16px;
	width: 14px;
}

/deep/ .el-dialog__header {
	padding-left: 40px;
	display: flex;
	font-weight: bold;
	border-bottom: 1px solid #ddd;
}

/deep/ .el-dialog__body {
	padding-bottom: 0;
	.el-form-item__label,
	.el-form-item__content {
		color: #333;
	}
}

/deep/ .table_row_class > td {
	padding: 7px 0;
}
.min_width {
	min-width: 400px;
}
</style>