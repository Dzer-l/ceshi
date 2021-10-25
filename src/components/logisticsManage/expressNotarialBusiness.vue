<template>
	<div>
		<!-- 头部搜索 -->
		<div class="search-issunce-box">
			<el-form label-position="right" label-width="90px">
				<!-- 下拉行 -->
				<el-row :gutter="20">
					<el-col :span="6" style="width:430px;">
						<el-form-item label="运单号">
							<el-input placeholder="请输入运单号" v-model="notarialBusinessFormData.expressNo">
							</el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="6" style="width:430px;">
						<el-form-item label="订单编号">
							<el-input placeholder="请输入订单编号" v-model="notarialBusinessFormData.orderNum">
							</el-input>
						</el-form-item>
					</el-col> -->
					<el-col :span="6" style="width:430px;">
						<el-form-item label="寄件人">
							<el-input placeholder="请输入寄件人" v-model="notarialBusinessFormData.senderName">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="6" style="width:430px;">
						<el-form-item label="收件人姓名">
							<el-input placeholder="请输入收件人姓名" v-model="notarialBusinessFormData.receiveName">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6" style="width:430px;">
						<el-form-item label="操作人">
							<el-select style="width:100%" v-model="notarialBusinessFormData.operatingUserName"
								placeholder="请选择操作人">
								<el-option v-for="(item,index) in operatorList" :key="index" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6" style="width:430px;">
						<el-form-item label="快递状态">
							<el-select style="width:100%" v-model="notarialBusinessFormData.status"
								placeholder="请选择快递状态">
								<el-option v-for="item in mailStatus" :key="item.name" :label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 时间 -->
				<el-row :gutter="20">
					<el-col style="width:430px;" :span="6">
						<el-form-item label="业务类型">
							<el-select style="width:100%" v-model="notarialBusinessFormData.prodCode"
								placeholder="请选择业务类型">
								<el-option v-for="item in prodCodeList" :key="item.productionCode"
									:label="item.productionName" :value="item.productionCode">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8" style="width:540px;">
						<el-form-item label="寄件时间">
							<el-date-picker v-model="notarialBusinessFormData.startTime"
								value-format="yyyy-MM-dd HH:mm:ss" type="datetime" prefix-icon="el-icon-date"
								placeholder="选择开始时间" :picker-options="pickerStartOptions" />
							<span class="date_section">—</span>
							<el-date-picker v-model="notarialBusinessFormData.endTime"
								value-format="yyyy-MM-dd HH:mm:ss" type="datetime" prefix-icon="el-icon-date"
								placeholder="选择结束时间" :picker-options="pickerEndOptions" />
						</el-form-item>
					</el-col>
					<el-col :span="4" style="width:180px;">
						<el-form-item label-width="0">
							<el-button type="primary" size="default" @click="handleSearch">查询</el-button>
							<el-button size="default" @click="handleReset">重置</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<!-- 表格区 -->
		<div class="content_box">
			<div>
				<el-tooltip class="item" effect="dark" placement="bottom">
					<div slot="content">若通过“搜索”对订单进行筛选，<br>则导出的订单为被筛选后的数据。</div>
					<el-button type="primary" size="default" plain @click="handleImportRecord">导出记录</el-button>
				</el-tooltip>
			</div>
			<!-- 表格 -->
			<div class="table_content">
				<el-table ref="multipleTable" :data="tableData" border cell-class-name="table_cell">
					<el-table-column prop="expressNo" label="运单号" align="center"></el-table-column>
					<!-- 卷宗号仅第一个列表有 -->
					<el-table-column prop="dossierNum" label="卷宗号" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="senderName" label="寄件人" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="receiveName" label="收件人" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="快递状态" align="center" width="110">
						<template slot-scope="{row}">
							<el-tag v-if="row.status==5" type="info" size="medium">
								{{row.status | filterExpressStatus}}
							</el-tag>
							<el-tag v-if="row.status==4" type="success" size="medium">
								{{row.status | filterExpressStatus}}
							</el-tag>
							<el-tag v-if="row.status==3" type="danger" size="medium">
								{{row.status | filterExpressStatus}}
							</el-tag>
							<el-tag v-if="row.status==2" size="warning">
								{{row.status | filterExpressStatus}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="寄件时间" align="center"></el-table-column>
					<el-table-column prop="officePoint" label="办证点" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="operatingUserName" label="操作人" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-link style="margin-right:15px;display:inline-block" type="primary"
								@click="handleToDetail(scope.$index, scope.row)">详情</el-link>
							<el-link type="primary" v-if="scope.row.status == 2"
								@click="handleCancel(scope.$index, scope.row)">取消寄件</el-link>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- 分页 -->
			<div class="pagination_content">
				<el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 30, 40]" background
					:current-page.sync="notarialBusinessPagination.pageNum" @current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
const moment = require('moment');
import { exportPackageRecordExcel, getPackageRecordCancel } from '../../api/mailManage';
import { packageRecordList } from '../../api/logisticsManage';
import { filterExpressStatus } from '../../utils/filters';
export default {
	filters: {
		filterExpressStatus
	},
	props: {
		operatorList: {},	// 操作人列表
		notarialBusinessFormData: {	// 搜索表单
			type: Object,
			default() {
				return {
					expressNo: "",
					orderNum: "",
					receiveName: "",
					senderName: "",
					operatingUserName: "",
					startTime: "",
					endTime: "",
					status: "",
					prodCode: "",				// 业务类型
				}
			}
		},
		notarialBusinessPagination: {	// 分页
			type: Object,
			default() {
				return {
					pageNum: 1,
					pageSize: 10
				}
			}
		},
		sendReceiveType: {},
		prodCodeList: {},
	},
	data() {
		return {
			searchType: [	// 搜索类别
				{ name: '运单号', value: 1 },
				{ name: '订单编号', value: 2 },
				{ name: '寄件人姓名', value: 3 },
				{ name: '收件人姓名', value: 4 },
			],
			mailStatus: [	// 快递状态
				{ name: "全部", value: "" },
				{ name: "待揽收", value: 2 },
				{ name: "运送中", value: 3 },
				{ name: "已签收", value: 4 },
				{ name: "已取消", value: 5 },
			],
			tableData: [],	// 表格数据
			total: 0,

			pickerStartOptions: {	// 开始时间
				disabledDate: (time) => {
					return time.getTime() > moment(this.notarialBusinessFormData.endTime).format("x")
				}
			},
			pickerEndOptions: {	// 结束时间
				disabledDate: (time) => {
					return time.getTime() < moment(this.notarialBusinessFormData.startTime).format("x")
				}
			},
			isEvid: 0,	// 0 公证业务 1 存证业务
		}
	},
	watch: {
		notarialBusinessFormData: {	// 搜索
			handler(val) {
				this.$emit('update:notarialBusinessFormData', val)
			},
			deep: true
		},
		notarialBusinessPagination: {  // 分页
			handler(val) {
				this.$emit('update:notarialBusinessPagination', val)
			},
			deep: true
		},
	},
	methods: {
		// 公证业务 数据
		async getList() {
			let res = await packageRecordList({
				...this.notarialBusinessFormData,
				...this.notarialBusinessPagination,
				sendReceiveType: this.sendReceiveType,	// 收寄类型，0公证处寄，1公证处收
				isEvid: this.isEvid,
			})
			console.log('公证业务--', res);
			this.tableData = res.data.list
			this.total = res.data.total
		},

		// 查询
		handleSearch() {
			this.notarialBusinessPagination.pageNum = 1
			this.getList()
		},

		// 重置
		handleReset() {
			this.$emit('handleReset')
			this.$nextTick(() => {
				this.getList()
			})
		},

		// 导出记录
		async handleImportRecord() {
			let res = await exportPackageRecordExcel({
				...this.notarialBusinessFormData,
				sendReceiveType: this.sendReceiveType
			})
			// console.log("导出记录", res);
			let date = moment().format("YYYY-MM-DD")
			let fileName = this.sendReceiveType == 0 ? `寄件记录-公证业务快递订单 ${date}.xls` : `收件记录-公证业务快递订单 ${date}.xls`

			// if (res.size != 0) {
			this.$fun.blobFile(res, fileName)
			this.$message.success("导出成功！")
			// return
			// }
			// this.$message.error("数据为空，请检查后再试！")
		},

		// 查看详情
		handleToDetail(index, row) {
			// console.log(row);
			this.$router.push({
				path: `mailingDetail`,
				query: { id: row.id }
			})
		},

		// 取消寄件
		handleCancel(index, row) {
			console.log(row);
			this.$confirm('<p style="color:red;">取消后，请重新邮寄！</p>',
				'确定取消快递？', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(async () => {
				let res = await getPackageRecordCancel(row.id)
				console.log('取消快递--->', res);
				if (!res.success) {
					this.$message({
						type: 'error;',
						message: '取消失败，请稍后再试！'
					});
					return
				}
				this.$message({
					type: 'success',
					message: '取消快递成功！'
				});
				this.getList()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作！'
				});
			});
		},

		// 分页每页显示条数变化
		handleSizeChange(val) {
			console.log('每页:' + val);
			this.notarialBusinessPagination.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.notarialBusinessPagination.pageNum = val
			this.getList()
		},
	},
	created() {
		this.getList()
	},
}
</script>

<style lang="less" scoped>
/deep/ .table_cell {
	padding: 8px 0;
}
.search-issunce-box {
	display: block !important;
	background: #fff;
	padding: 5px;
	min-width: 100%;
	margin: 20px 0;
}

.content_box {
	padding: 0 30px;
	background: #fff;
	min-width: 100%;
}

.table_content {
	margin-top: 20px;
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
</style>