<template>
	<div>
		<!-- 头部搜索 -->
		<div class="search-issunce-box">
			<el-form label-position="right" ref="searchForm" label-width="80px" :model="searchFormData">
				<el-row :gutter="20">
					<el-col class="min_width" :span="6">
						<el-form-item label="申请人">
							<el-input v-model="searchFormData.applicantName" placeholder="请输入申请人"></el-input>
						</el-form-item>
					</el-col>
					<el-col class="min_width" :span="6">
						<el-form-item label="邮寄编号">
							<el-input v-model="searchFormData.expressNum" placeholder="请输入邮寄编号"></el-input>
						</el-form-item>
					</el-col>
					<el-col class="min_width" :span="6">
						<el-form-item label="卷宗号">
							<el-input v-model="searchFormData.dossierNum" placeholder="请输入卷宗号"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 下拉行 -->
				<el-row :gutter="20">
					<el-col class="min_width" :span="6">
						<el-form-item label="业务类型">
							<el-select style="width:100%" v-model="searchFormData.prodCodeList" placeholder="请选择业务类型"
								multiple>
								<el-option v-for="item in prodCodeList" :key="item.productionCode"
									:label="item.productionName" :value="item.productionCode">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="min_width" :span="6">
						<el-form-item label="发证类型">
							<el-select style="width:100%" v-model="searchFormData.certificateType"
								placeholder="请选择发证类型">
								<el-option v-for="item in certificateType" :key="item.value" :label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="min_width" :span="6">
						<el-form-item label="办证点">
							<el-select style="width:100%" v-model="searchFormData.orgOfficeId" placeholder="请选择办证点">
								<el-option v-for="item in orgOfficeId" :key="item.id" :label="item.officeName"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 时间 -->
				<el-row :gutter="20">
					<el-col :span="8" style="width:530px">
						<el-form-item label="提交时间">
							<el-date-picker v-model="searchFormData.startTime" value-format="yyyy-MM-dd HH:mm:ss"
								type="datetime" prefix-icon="el-icon-date" placeholder="选择开始时间"
								:picker-options="pickerStartOptions" />
							<span class="date_section">—</span>
							<el-date-picker v-model="searchFormData.endTime" value-format="yyyy-MM-dd HH:mm:ss"
								type="datetime" prefix-icon="el-icon-date" placeholder="选择结束时间"
								:picker-options="pickerEndOptions" />
						</el-form-item>
					</el-col>
					<el-col :span="4" style="min-width:200px">
						<el-button type="primary" size="default" @click="handleQuery">查询</el-button>
						<el-button size="default" @click="resetForm">重置</el-button>
					</el-col>
				</el-row>

				<!-- 单选筛选 -->
				<el-row :gutter="20">
					<el-form-item style="margin:0;" label="订单状态">
						<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
							全选</el-checkbox>
						<el-checkbox-group v-model="searchFormData.orderStatusList"
							style="display: inline;margin-left: 30px;" @change="handleCheckedStatusesChange">
							<el-checkbox v-for="status in statuses" :key="status.name" :label="status.label">
								{{ status.name }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-row>
			</el-form>
		</div>
		<div class="content_box">
			<!-- 批量邮寄和提示 -->
			<div>
				<el-tooltip effect="dark" content="请选择待邮寄的订单" placement="right">
					<!-- <el-button :type="seleceCorrect?'primary':'info'" size="default" @click="handleToMailMany">
						批量邮寄
					</el-button> -->
					<el-button type="primary" size="default" @click="handleToMailMany">
						批量邮寄
					</el-button>
				</el-tooltip>

				<div class="tips_content" :class="selectCount>0?'':'hide'">
					<el-alert class="select_tips" effect="light" show-icon :closable="false">
						<div>已选择<span class="tips_text">{{selectCount}}</span>项
						</div>
					</el-alert>
				</div>
			</div>

			<!-- 表格 -->
			<div class="table_content">
				<el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" border
					cell-class-name="cell_class_name">
					<el-table-column type="selection" width="50" align="center"></el-table-column>
					<el-table-column prop="certificateType" label="发证类型" width="110" align="center">
						<template slot-scope="{row}">
							{{row.certificateType | filterCrtificateType}}
						</template>
					</el-table-column>
					<el-table-column prop="expressNum" label="邮寄编号" show-overflow-tooltip></el-table-column>
					<el-table-column prop="dossierNum" label="卷宗号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="applicantName" label="申请人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="officePoint" label="办证点" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createTime" label="提交时间" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="订单状态" align="center">
						<template slot-scope="{row}">
							<el-tag v-if="row.orderStatus==307" type="info" size="medium">
								{{row.orderStatus | filterOrderStatus}}
							</el-tag>
							<el-tag v-if="row.orderStatus==303 || row.orderStatus==304" type="success" size="medium">
								{{row.orderStatus | filterOrderStatus}}
							</el-tag>
							<el-tag v-if="row.orderStatus==302" type="warning" size="medium">
								{{row.orderStatus | filterOrderStatus}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="prodName" label="业务类型" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="orderSource" label="订单来源" align="center" show-overflow-tooltip>
						<template slot-scope="{row}">
							{{row.orderSource | filterOrderSource}}
						</template>
					</el-table-column>
					<el-table-column prop="operatingUserName" label="发证人" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-link type="primary" style="display:inline-block;margin:0 10px;"
								@click="handleToDetail(scope.$index, scope.row)">详情</el-link>
							<el-link type="primary" v-if="scope.row.orderStatus==302"
								@click="handleToMail(scope.$index, scope.row)">去邮寄</el-link>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 分页 -->
			<!-- <div v-if="total>10" class="pagination_content"> -->
			<div class="pagination_content">
				<el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 30, 40]" background
					:current-page.sync="pagination.pageNum" @current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getOnlineMailList,
	// getOrgProductionList,
	// getOrgOfficeList
	getOnlineMailListDetail
} from '../../api/mailManage';
const moment = require('moment');
export default {
	// props: ["prodCodeList", "orgOfficeId", "searchFormData"],
	props: {
		prodCodeList: {},
		orgOfficeId: {},
		searchFormData: {	// 筛选表单
			type: Object,
			default() {
				return {
					applicantName: "",
					expressNum: "",
					dossierNum: "",
					prodCodeList: [],
					certificateType: "",
					orgOfficeId: "",
					startTime: "",
					endTime: "",
					orderStatusList: [302, "303,304", 307]	// 全选状态
				}
			}
		},
		pagination: {
			type: Object,
			default() {
				return {	// 分页
					pageNum: 1,
					pageSize: 10,
				}
			}
		},
	},
	filters: {
		filterCrtificateType(e) {
			return e == 0 ? "平台业务发证" : "窗口业务发证"
		},
		filterOrderStatus(e) {
			let status
			switch (e) {
				case 302:
					status = "待邮寄"
					break;
				case 303:
					status = "已邮寄"
					break;
				case 304:
					status = "已邮寄"
					break;
				case 307:
					status = "已取消"
					break;
			}
			return status
		},
		filterOrderSource(v) {
			return v == 1 ? "PC" : "小程序"
		}
	},
	data() {
		return {
			// searchFormData: {	// 筛选表单
			// 	applicantName: "",
			// 	expressNum: "",
			// 	dossierNum: "",
			// 	prodCodeList: [],
			// 	certificateType: "",
			// 	orgOfficeId: "",
			// 	startTime: "",
			// 	endTime: "",
			// 	orderStatusList: [302, "303,304", 307]	// 全选状态
			// },
			// prodCodeList: [],	// 业务类型
			// orgOfficeId: [],	// 办证点
			certificateType: [ // 发证类型
				{ name: "全部", value: "" },
				{ name: "平台业务发证", value: 0 },
				{ name: "窗口业务办理", value: 1 },
			],

			selectCount: 0, // 列表选中数
			tableData: [],	// 列表
			selectIds: [],	// 列表前面选中
			seleceCorrect: false,

			checkAll: true,	// 是否全选
			isIndeterminate: false,
			statuses: [	// 筛选选项
				{ name: '待邮寄', label: 302 },
				{ name: '已邮寄', label: "303,304" },
				{ name: '已取消', label: 307 },
			],
			statusOptions: [302, "303,304", 307],

			// pagination: {	// 分页
			// 	pageNum: 1,
			// 	pageSize: 10,
			// },
			total: 0,
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
	methods: {
		// 查询
		handleQuery() {
			this.pagination.pageNum = 1
			this.getOnlineList()
		},
		// 重置
		resetForm(formName) {
			this.searchFormData.applicantName = ""
			this.searchFormData.expressNum = ""
			this.searchFormData.dossierNum = ""
			this.searchFormData.prodCodeList = []
			this.searchFormData.certificateType = ""
			this.searchFormData.orgOfficeId = ""
			this.searchFormData.startTime = ""
			this.searchFormData.endTime = ""
			this.searchFormData.orderStatusList = [302, "303,304", 307]

			this.pagination.pageNum = 1
			this.pagination.pageSize = 10

			this.checkAll = true
			this.getOnlineList()
		},

		// 查看详情
		async handleToDetail(index, row) {
			let res = await getOnlineMailListDetail(row.id)
			if (!res.success && res.code === 20006) {
				this.$alert(`<p style='color:red;'>${res.msg || "您不是该订单的承办人，无法查看该订单内容。"}</p>`, '提示', {
					confirmButtonText: '确定',
					dangerouslyUseHTMLString: true
				})
				return
			}

			this.$router.push({
				name: 'mailOrderDetail',
				query: { id: row.id }
			})
		},

		// 去邮寄
		handleToMail(index, row) {
			this.$router.push({
				name: "expressDelivery",
				query: { ids: [row.id] }
			})
		},

		// 表格前面选中
		handleSelectionChange(arr) {
			this.selectCount = arr.length
			if (arr.length > 0 && arr.every(i => { return i.orderStatus === 302 })) {
				console.log("批量邮寄")
				arr.forEach((value, index) => {
					if (!this.selectIds.some(v => { return v == value.id })) {
						this.selectIds.push(value.id)
					}
				});
				// this.selectIds = [...new Set(this.selectIds)]
				this.seleceCorrect = true
				return
			}
			this.seleceCorrect = false
			this.selectIds = []
		},

		// 点击批量邮寄
		handleToMailMany() {
			if (this.seleceCorrect) {
				this.$router.push({
					name: "expressDelivery",
					query: { ids: [this.selectIds] }
				})
			} else {
				this.$message({
					message: "请勾选待邮寄的订单！",
					type: "warning"
				})
			}
		},

		// 全选
		handleCheckAllChange(val) {
			console.log('全选', val);
			this.searchFormData.orderStatusList = val ? this.statusOptions : []
			this.isIndeterminate = false
			if (!val) {
				return this.tableData = []
			}
			// this.pagination = {	// 分页
			// 	pageNum: 1,
			// 	pageSize: 10,
			// }
			this.pagination.pageNum = 1
			this.pagination.pageSize = 10
			this.getOnlineList()
		},
		// 单选
		handleCheckedStatusesChange(value) {
			console.log('单选', value);
			const checkedCount = value.length
			this.checkAll = checkedCount === this.statuses.length
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.statuses.length
			value.length > 0 ? this.getOnlineList() : this.tableData = []
		},

		// 分页每页显示条数变化
		handleSizeChange(val) {
			console.log('每页:' + val);
			this.pagination.pageSize = val
			this.getOnlineList()
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.pagination.pageNum = val
			this.getOnlineList()
		},

		// 获取列表
		async getOnlineList() {
			let searchData = JSON.parse(JSON.stringify(this.searchFormData))
			let index = searchData.orderStatusList.findIndex(i => { return i == "303,304" })  // 已邮寄有两个状态，需要处理
			// console.log(index)
			if (index != -1) {
				searchData.orderStatusList.splice(index, 1, 303, 304)
			}
			let data = {
				...this.pagination,
				...searchData,
			}
			// console.log('查询', data)
			let res = await getOnlineMailList(data)
			// console.log('列表', res);
			this.tableData = res.data.list
			this.total = res.data.total
		},

		// 获取业务类型
		// async getBusinessType() {
		// 	let res = await getOrgProductionList()
		// 	console.log('业务类型', res);
		// 	this.prodCodeList = res.data
		// },

		// 获取办证点
		// async getOfficeList() {
		// 	let res = await getOrgOfficeList()
		// 	console.log('办证点', res)
		// 	this.orgOfficeId = res.data
		// },
	},
	created() {
		// this.getBusinessType()
		// this.getOfficeList()
		this.getOnlineList()
	},
	watch: {
		"searchFormData": {
			handler(value) {
				this.$emit("update:searchFormData", value)
			},
			deep: true
		},
		"pagination": {
			handler(value) {
				this.$emit("update:pagination", value)
			},
			deep: true
		}
	}
}
</script>

<style lang="less" scoped>
.search-issunce-box {
	display: block !important;
	background: #fff;
	padding: 5px;
	min-width: 100%;
}

.content_box {
	margin-top: 10px;
	padding: 0 30px;
	background: #fff;
	min-width: 100%;
}

.hide {
	visibility: hidden !important;
}

.tips_content {
	margin-top: 10px;
	height: 40px;

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

.pagination_content {
	padding: 40px 0 20px 0;
	text-align: center;
}

.date_section {
	padding: 0 5px;
	color: #999;
}

.el-date-editor.el-input {
	width: 200px;
}

/deep/.el-table thead {
	color: #333;
}

/deep/.el-alert__icon.is-big {
	margin-top: 2px;
	font-size: 16px;
	width: 14px;
}
.min_width {
	min-width: 400px;
}
/deep/.cell_class_name {
	height: 48px;
	padding: 10px 0;
}
</style>