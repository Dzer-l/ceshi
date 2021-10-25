<template>
	<div class="container">
		<el-card shadow="always" :body-style="{ padding: '40px' }">
			<!-- 搜索区域 -->
			<div class="search_warp">
				<el-form label-position="left" label-width="80px" :model="searchFormData">
					<el-row :gutter="60">
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="核验编号">
								<el-input placeholder="请输入核验编号" v-model="searchFormData.orderNum" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="卷宗号">
								<el-input v-model="searchFormData.dossierNum" placeholder="请输入卷宗号" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="申请人">
								<el-input v-model="searchFormData.applicantName" placeholder="请输入申请人" clearable>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<!-- 第二行 -->
					<el-row :gutter="60">
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="订单状态">
								<el-select style="width:100%" multiple v-model="searchFormData.orderStatusList"
									placeholder="请选择订单状态">
									<el-option v-for="item in orderStatusList" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="承办人">
								<el-select style="width:100%" v-model="searchFormData.notaryName" placeholder="请选择承办人">
									<el-option v-for="item in operatorList" :key="item.label" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6" :offset="0">
							<el-form-item label="办证点">
								<el-select style="width:100%" v-model="searchFormData.orgOfficeId" placeholder="请选择办证点">
									<el-option v-for="item in orgOfficeId" :key="item.id" :label="item.officeName"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="60">
						<el-col style="width:550px;padding-right:0;">
							<el-form-item label="提交时间">
								<el-date-picker v-model="searchFormData.startTime" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择开始时间"
									:picker-options="pickerStartOptions" style="width:200px;" />
								<span class="date_section">—</span>
								<el-date-picker v-model="searchFormData.endTime" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择结束时间"
									:picker-options="pickerEndOptions" style="width:200px;" default-time="23:59:59" />
							</el-form-item>
						</el-col>
						<el-col style="width:550px;padding-right:0;">
							<el-form-item label="完成时间">
								<el-date-picker v-model="searchFormData.finishStartTime"
									value-format="yyyy-MM-dd HH:mm:ss" type="datetime" prefix-icon="el-icon-date"
									placeholder="选择完成开始时间" :picker-options="finishPickerStartOptions"
									style="width:200px;" />
								<span class="date_section">—</span>
								<el-date-picker v-model="searchFormData.finishEndTime"
									value-format="yyyy-MM-dd HH:mm:ss" type="datetime" prefix-icon="el-icon-date"
									placeholder="选择完成结束时间" :picker-options="finishPickerEndOptions" style="width:200px;"
									default-time="23:59:59" />
							</el-form-item>
						</el-col>
						<el-col style="width:320px;padding-left:30px;">
							<el-button type="primary" size="medium" @click="handelSearch">搜索</el-button>
							<el-button size="medium" @click="handleReset">重置</el-button>
							<el-tooltip class="item" effect="dark" placement="bottom">
								<div slot="content">若通过“搜索”对订单进行筛选，<br>则导出的订单为被筛选后的数据。</div>
								<el-button type="primary" size="medium" plain @click="handleImportRecord">导出订单
								</el-button>
							</el-tooltip>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<!-- 表格区域 -->
			<div class="tableData_main">
				<el-table v-loading="loading" :data="tableData" border style="width: 100%"
					:row-class-name="rowClassName" header-row-class-name="table_header_name">
					<el-table-column type="index" label="序号" align="center" width="60px" />
					<el-table-column prop="businessTypeDesc" label="业务类型" align="center" />
					<el-table-column prop="dossierNum" label="卷宗号" align="center" show-overflow-tooltip />
					<el-table-column prop="applicantName" label="申请人" align="center" show-overflow-tooltip />
					<el-table-column prop="createTime" label="提交时间" align="center" show-overflow-tooltip />
					<el-table-column prop="acceptSysUserName" label="承办人" align="center" show-overflow-tooltip />
					<el-table-column prop="orderNum" label="核验编号" align="center" show-overflow-tooltip />
					<el-table-column prop="" label="订单状态" align="center" width="120">
						<template slot-scope="scope">
							<el-tag size="medium" disable-transitions :class="tagClass(scope.row)">
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
							<el-link type="primary" @click="handleEdit(scope.$index, scope.row)">
								{{ scope.row.orderStatus | correspondingOperation }}</el-link>
						</template>
					</el-table-column>
				</el-table>

				<div class="paging_box">
					<div class="paging">
						<el-pagination background :current-page.sync="pageNum" :page-size="pageSize"
							layout="total, pager, next,sizes, jumper" :total="total" @size-change="handleSizeChange"
							@current-change="handleCurrentChange" />
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import { getInfo } from '../../api/delegate.js'
import {
	getUniversalListData,
	getOperator,
	getOrgOfficeList,
	exportPackageRecordExcel
} from '../../api/universal'
const moment = require("moment");
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
			searchFormData: {	// 筛选表单
				orderNum: "",
				dossierNum: "",
				applicantName: "",
				orderStatusList: [],
				notaryName: "",	// 承办人
				orgOfficeId: "",
				startTime: "",
				endTime: "",
				acceptSysUserId: "",
				finishStartTime: "",	// 完成开始时间
				finishEndTime: "",		// 完成结束时间
			},
			orderStatusList: [
				{ label: "待处理", value: 1 },
				{ label: "已完成", value: 2 },
				{ label: "已关闭", value: 3 },
			],

			orderNumOrDossierNum: '', // 搜索的值
			pageNum: 1, // 初始加载表格的页码
			pageSize: 10, // 初始加载表格每页显示的数据
			tableData: [],	// 表格数据
			loading: false,
			total: null,
			operatorList: [
				{ label: "全部", value: "" },
			],	// 操作人列表
			orgOfficeId: [
				{ officeName: "全部", id: "" }
			],

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
			finishPickerStartOptions: {	// 开始时间
				disabledDate: (time) => {
					return time.getTime() > moment(this.searchFormData.finishEndTime).format("x")
				}
			},
			finishPickerEndOptions: {	// 结束时间
				disabledDate: (time) => {
					return time.getTime() < moment(this.searchFormData.finishStartTime).format("x")
				}
			},
		}
	},
	created() {

		this.searchFormData = sessionStorage.searchFormUniversalPersonalData ? JSON.parse(sessionStorage.searchFormUniversalPersonalData) : this.searchFormData
		this.searchFormData.acceptSysUserId = sessionStorage.user_id
		this.pageNum = sessionStorage.pageNumUniversalPersonal ? Number(sessionStorage.pageNumUniversalPersonal) : this.pageNum
		this.pageSize = sessionStorage.pageSizeUniversalPersonal ? Number(sessionStorage.pageSizeUniversalPersonal) : this.pageSize

		this.getOperatorList()
		this.getOfficeList()
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
		// 导出订单
		async handleImportRecord() {
			if (!this.searchFormData.finishStartTime || !this.searchFormData.finishEndTime) {
				return this.$message.error("请选择导出订单的完成时间")
			}

			let range = moment(this.searchFormData.finishEndTime).diff(moment(this.searchFormData.finishStartTime), "days")
			if (range > 365) {
				return this.$message.error("导出时间最大为12个月")
			}

			let res = await exportPackageRecordExcel({
				...this.searchFormData
			})

			let fileName = `万能公证受理 ${moment(this.searchFormData.finishStartTime).format("YYYY-MM-DD")} - ${moment(this.searchFormData.finishEndTime).format("YYYY-MM-DD")}.xls`
			this.$fun.blobFile(res, fileName)
			this.$message.success("导出成功！")
		},

		// 获取办证点
		async getOfficeList() {
			let res = await getOrgOfficeList()
			// console.log('办证点', res)
			if (res.success && res.data) {
				this.orgOfficeId.push(...res.data)
				return
			}
			this.orgOfficeId = []
		},

		// 获取操作人
		async getOperatorList() {
			let res = await getOperator()
			// console.log("获取操作人", res);
			if (res.success && res.data) {
				res.data.forEach(item => {
					this.operatorList.push({ label: item, value: item })
				})
				return
			}
			this.operatorList = []
		},

		// 搜索
		handelSearch() {
			this.pageNum = 1
			this.getUniversalList()
		},

		// 重置
		handleReset() {
			this.searchFormData = {	// 筛选表单
				orderNum: "",
				dossierNum: "",
				applicantName: "",
				orderStatusList: [],
				notaryName: "",	// 承办人
				orgOfficeId: "",
				startTime: "",
				endTime: "",
				finishStartTime: "",	// 完成开始时间
				finishEndTime: "",		// 完成结束时间
			}
			this.searchFormData.acceptSysUserId = this.$route.name === "universalListPersonal" ? sessionStorage.user_id : ""
			this.pageNum = 1
			this.pageSize = 10
			this.getUniversalList()
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

		// 清除时触发
		atClear() {
			this.getUniversalList()
		},

		rowClassName(e) {
			return e.rowIndex % 2 && 'err-row'
		},

		getProductionList() {
			this.$axios(`org/ org - production - list`).then(res => {
				console.log(res)
				this.proType = res.data
			})
		},

		// 获取列表
		getUniversalList() {
			const data = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				...this.searchFormData
			}

			getUniversalListData(data).then(res => {
				// console.log(res)
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
		},

		browerStatus() {
			sessionStorage.removeItem("searchFormUniversalPersonalData")
			sessionStorage.removeItem("pageNumUniversalPersonal")
			sessionStorage.removeItem("pageSizeUniversalPersonal")
		},
	},
	beforeRouteLeave(to, from, next) {
		let toNameList = ["universalDetailsOrder"]
		// console.log(toNameList.includes(to.name));
		if (toNameList.includes(to.name)) {
			sessionStorage.setItem("searchFormUniversalPersonalData", JSON.stringify(this.searchFormData))
			sessionStorage.setItem("pageNumUniversalPersonal", this.pageNum)
			sessionStorage.setItem("pageSizeUniversalPersonal", this.pageSize)
		}
		next()
	},
	beforeRouteEnter(to, form, next) {
		console.log(form);
		let formNameList = ["universalDetailsOrder"]
		if (!formNameList.includes(form.name)) {
			sessionStorage.removeItem("searchFormUniversalPersonalData")
			sessionStorage.removeItem("pageNumUniversalPersonal")
			sessionStorage.removeItem("pageSizeUniversalPersonal")
		}
		next()
	},
}
</script>

<style lang="less" scoped>
/deep/.table_header_name {
	color: #333;
}
.min_width {
	min-width: 330px;
}
.container {
	padding: 20px;
	background: #f0f2f5;
	min-height: calc(100vh - 50px);
	min-width: 1080px;

	.search_warp {
		margin: 10px 0;
	}

	.date_section {
		padding: 0 10px;
		color: #666;
	}

	.tableData_main {
		padding-top: 20px;
		flex: 1;
		& /deep/ .el-table td {
			padding: 8px 0;
		}
		.paging_box {
			margin-top: 10px;
			text-align: center;
			padding: 24px 0 4px 0;
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
