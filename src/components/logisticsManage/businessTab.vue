<template>
	<div>
		<!-- 头部搜索 -->
		<div class="search-issunce-box">
			<el-form label-position="right" label-width="90px">
				<!-- 下拉行 -->
				<el-row :gutter="20">
					<el-col :span="6" style="width:430px;">
						<el-form-item label="运单号">
							<el-input placeholder="请输入运单号" v-model="searchFormData.expressNo">
							</el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="6" style="width:430px;">
						<el-form-item label="订单编号">
							<el-input placeholder="请输入订单编号" v-model="searchFormData.orderNum">
							</el-input>
						</el-form-item>
					</el-col> -->
					<el-col :span="6" style="width:430px;">
						<el-form-item label="寄件人">
							<el-input placeholder="请输入寄件人" v-model="searchFormData.senderName">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="20">
					<el-col :span="6" style="width:430px;">
						<el-form-item label="收件人姓名">
							<el-input placeholder="请输入收件人姓名" v-model="searchFormData.receiveName">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6" style="width:430px;">
						<el-form-item label="操作人">
							<el-select style="width:100%" v-model="searchFormData.operatingUserName"
								placeholder="请选择操作人">
								<el-option v-for="(item,index) in operatorList" :key="index" :label="item"
									:value="item">
								</el-option>
							</el-select>
							<!-- <el-input placeholder="请输入操作人姓名" v-model="searchFormData.operatingUserName">
							</el-input> -->
						</el-form-item>
					</el-col>
					<el-col :span="6" style="width:430px;">
						<el-form-item label="快递状态">
							<el-select style="width:100%" v-model="searchFormData.status" placeholder="请选择快递状态">
								<el-option v-for="item in mailStatus" :key="item.value" :label="item.name"
									:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 时间 -->
				<el-row :gutter="20">
					<el-col :span="8" style="width:540px;">
						<el-form-item label="寄件时间">
							<el-date-picker v-model="searchFormData.startTime" value-format="yyyy-MM-dd HH:mm:ss"
								type="datetime" prefix-icon="el-icon-date" placeholder="选择开始时间"
								:picker-options="pickerStartOptions" />
							<span class="date_section">—</span>
							<el-date-picker v-model="searchFormData.endTime" value-format="yyyy-MM-dd HH:mm:ss"
								type="datetime" prefix-icon="el-icon-date" placeholder="选择结束时间"
								:picker-options="pickerEndOptions" />
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
				<el-table ref="multipleTable" :data="businessTabData" border>
					<el-table-column prop="expressNo" label="运单号" align="center"></el-table-column>
					<!-- 卷宗号仅第一个列表有 -->
					<el-table-column v-if="haveDossierNum" prop="dossierNum" label="卷宗号" align="center"
						show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="senderName" label="寄件人" align="center"></el-table-column>
					<el-table-column prop="receiveName" label="收件人" align="center"></el-table-column>
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
				<el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 30, 40]"
					:current-page.sync="pagination.pageNum" @current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
const moment = require('moment');
import { exportPackageRecordExcel, getPackageRecordCancel } from '../../api/mailManage';
import { filterExpressStatus } from '../../utils/filters';
export default {
	filters: {
		filterExpressStatus
	},
	props: ["businessTabData", 'haveDossierNum', "total", "sendReceiveType", "mailActiveName", "operatorList"],
	data() {
		return {
			searchFormData: {	// 搜索表单
				expressNo: "",
				orderNum: "",
				receiveName: "",
				senderName: "",
				operatingUserName: "",
				startTime: "",
				endTime: "",
				status: ""
			},

			searchType: [	// 搜索类别
				{ name: '运单号', value: 1 },
				{ name: '订单编号', value: 2 },
				{ name: '寄件人姓名', value: 3 },
				{ name: '收件人姓名', value: 4 },
			],
			// operatorList: [ // 操作人
			// 	{ name: "平", value: 1 },
			// 	{ name: "窗", value: 2 },
			// ],
			mailStatus: [	// 快递状态
				// { name: "待邮寄", value: 1 },
				{ name: "待揽收", value: 2 },
				{ name: "运送中", value: 3 },
				{ name: "已签收", value: 4 },
				{ name: "已取消", value: 5 },
			],
			tableData: [],	// 表格数据

			pagination: {	// 分页
				pageNum: 1,
				pageSize: 10
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
	watch: {
		searchFormData: {	// 深度监听，可监听到对象、数组的变化
			handler(val, oldVal) {
				this.$emit('searchFormChange', val)
			},
			deep: true //true 深度监听
		},
		pagination: {	// 深度监听，可监听到对象、数组的变化
			handler(val, oldVal) {
				this.$emit('paginationChange', val)
			},
			deep: true //true 深度监听
		},
	},
	methods: {
		// 查询
		handleSearch() {
			this.$emit('search')
		},

		// 重置
		handleReset() {
			this.searchFormData = {	// 搜索表单
				expressNo: "",
				orderNum: "",
				receiveName: "",
				senderName: "",
				operatingUserName: "",
				startTime: "",
				endTime: "",
				status: ""
			}
			this.$emit('reset')
		},

		// 导出记录
		async handleImportRecord() {
			if (this.mailActiveName == "first") { // 存证业务暂时不做
				let res = await exportPackageRecordExcel({
					...this.searchFormData,
					sendReceiveType: this.sendReceiveType
				})
				// console.log("导出记录", res);
				let date = moment().format("YYYY-MM-DD")
				let fileName = this.sendReceiveType == 0 ?
					(this.mailActiveName == "first" ? `寄件记录-公证业务快递订单 ${date}.xls` : `寄件记录-存证业务快递订单 ${date}.xls`) :
					(this.mailActiveName == "first" ? `收件记录-公证业务快递订单 ${date}.xls` : `收件记录-存证业务快递订单 ${date}.xls`)

				if (res.size != 0) {
					this.$fun.blobFile(res, fileName)
					this.$message.success("导出成功！")
					return
				}
				this.$message.error("导出失败，请稍后再试！")
			}
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
				this.$emit("updateList")
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
			this.pagination.pageSize = val
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.pagination.pageNum = val
		},
	},
}
</script>

<style lang="less" scoped>
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