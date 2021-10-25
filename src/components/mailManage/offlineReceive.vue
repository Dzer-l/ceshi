<template>
	<div>
		<!-- 头部搜索 -->
		<div class="search-issunce-box">
			<el-form label-position="right" label-width="80px" :model="searchFormData">
				<el-row :gutter="20">
					<el-col class="min_width" :span="6" :offset="0">
						<el-form-item label="业务类型">
							<el-select style="width:100%" v-model="searchFormData.prodCode" placeholder="请选择业务类型">
								<el-option v-for="item in prodCodeList" :key="item.productionCode"
									:label="item.productionName" :value="item.productionCode">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="min_width" :span="6" :offset="0">
						<el-form-item label="卷宗号">
							<el-input v-model="searchFormData.dossierNum" placeholder="请输入卷宗号"></el-input>
						</el-form-item>
					</el-col>
					<el-col class="min_width" :span="6" :offset="0">
						<el-form-item label="申请人">
							<el-input v-model="searchFormData.applicantName" placeholder="请输入申请人"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col class="min_width" :span="6" :offset="0">
						<el-form-item label="办证点">
							<el-select style="width:100%" v-model="searchFormData.officeId" placeholder="请选择办证点">
								<el-option v-for="item in orgOfficeId" :key="item.officeName" :label="item.officeName"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
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
						<el-checkbox-group v-model="searchFormData.receiveStatus" @change="handleCheckedStatusesChange"
							style="display: inline;margin-left: 20px;">
							<el-checkbox v-for="status in statuses" :key="status.name" :label="status.label">
								{{ status.name }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-row>
			</el-form>
		</div>

		<!-- 列表 -->
		<div class="content_box">
			<!-- 批量邮寄和提示 -->
			<!-- <div>
				<el-button type="primary" size="default" @click="handleToMailMany">批量邮寄</el-button>
				<div class="tips_content">
					<el-alert class="select_tips" effect="light" show-icon :closable="false">
						<div>已选择<span class="tips_text">{{selectCount}}</span>项
						</div>
					</el-alert>
				</div>
			</div> -->

			<!-- 表格 -->
			<div class="table_content">
				<el-table ref="multipleTable" :data="tableData" cell-class-name="table_cell" border>
					<el-table-column prop="prodName" label="业务类型" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="dossierNum" label="卷宗号" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="applicantName" label="申请人" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="receiveName" label="领证人" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="mobile" label="领证人手机号码" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="cardNum" label="领证人证件号码" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="receivePointName" label="办证点" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="createTime" label="提交时间" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="receiveStatus" label="订单状态" align="center">
						<template slot-scope="{row}">
							<el-tag v-if="row.receiveStatus==0" type="warning">
								{{row.receiveStatus | filterReceiveStatus}}
							</el-tag>
							<el-tag v-if="row.receiveStatus==1" type="success">
								{{row.receiveStatus | filterReceiveStatus}}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-link style="margin-right:15px;display:inline-block" type="primary"
								@click="handleToDetail(scope.$index, scope.row)">详情</el-link>
							<el-link v-if="scope.row.receiveStatus==0" @click="handleToMail(scope.$index, scope.row)"
								type="primary">去预约</el-link>
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

		<!-- 查看预约信息弹窗 -->
		<el-dialog title="领证信息" :visible.sync="showSubscribeDialog" width="800px">
			<div style="padding-left:0 20px">
				<el-form style="padding:0 50px" label-position="left" :model="getLicenseForm"
					:rules="getLicenseFormRules" ref="getLicenseForm" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="订单编号：">{{getLicenseForm.orderNum}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="卷宗号：">{{getLicenseForm.dossierNum}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="领取人：">{{getLicenseForm.receiveName}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="证件号码：">{{getLicenseForm.cardNum}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="手机号码：">{{getLicenseForm.mobile}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="公证书份数：">{{getLicenseForm.notaryNum}} 份
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="领取地点：" prop="receiveAddress">
						<el-select style="width:100%" placeholder="请选择领证地点" v-model="getLicenseForm.receivePointName">
							<!-- <el-option label="坪山公证处" value="1" /> -->
							<el-option v-for="item in orgOfficeIdComputed" :key="item.officeName"
								:label="item.officeName" :value="item.officeName">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="领取时间：" prop="receiveTime">
						<el-date-picker style="width:100%" type="datetime" placeholder="请选择领证时间"
							v-model="getLicenseForm.receiveTime" value-format="yyyy-MM-dd HH:mm:ss" />
					</el-form-item>
					<el-form-item label="领证号：" prop="receiveNumber">
						<el-input placeholder="请填写领证号" size="normal" v-model="getLicenseForm.receiveNumber">
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" style="padding-right:40px">
				<el-button type="primary" @click="handleConfirmReserve('getLicenseForm')">确定预约</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	getOfflineLicenseList,
	appointmentTime,
	getOrderOfflineReceiveDetail,
} from '../../api/mailManage';
import { getLicenseFormRules } from '../../utils/validate';
const moment = require('moment');
export default {
	props: ["prodCodeList", "orgOfficeId"],
	filters: {
		filterReceiveStatus(val) {
			return val == 0 ? "待预约" : "已预约"
		}
	},
	data() {
		return {
			searchFormData: {	// 筛选表单
				prodCode: "",				// 业务类型
				officeId: "",				// 办证点
				dossierNum: "",				// 卷宗号
				applicantName: "",			// 申请人
				receiveStatus: [""],			// 订单状态, "" 全部, 0未预约, 1已预约，
				startTime: "",				// 开始时间
				endTime: "",				// 结束时间
			},
			issuanceType: [ // 发证类型
				{ name: "平台业务发证", value: 1 },
				{ name: "窗口业务办理", value: 2 },
			],
			tableData: [],	// 列表数据

			checkAll: true,	// 筛选
			statuses: [	// 筛选选项
				{ name: '全选', label: "" },
				{ name: '待预约', label: 0 },
				{ name: '已预约', label: 1 },
			],

			pagination: {	// 分页
				pageNum: 1,
				pageSize: 10,
			},
			total: 0,

			showSubscribeDialog: false, // 去预约弹窗
			getLicenseForm: {},	// 预约领取人信息
			getLicenseFormRules,
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
	computed: {
		orgOfficeIdComputed() {
			const temp = JSON.parse(JSON.stringify(this.orgOfficeId))
			temp.forEach((item, index) => {
				if (item.id == "") {
					temp.splice(index, 1);
				}
			})
			return temp
		}
	},
	created() {
		this.getOfflineList()
	},
	methods: {
		// 查询
		handleQuery() {
			this.pagination.pageNum = 1
			this.getOfflineList()
		},

		// 重置
		resetForm(formName) {
			// this.$refs[formName].resetFields();
			this.searchFormData = {
				prodCode: "",				// 业务类型
				officeId: "",				// 办证点
				dossierNum: "",				// 卷宗号
				applicantName: "",			// 申请人
				receiveStatus: [""],			// 订单状态, null全部, 0未预约, 1已预约，
				startTime: "",				// 开始时间
				endTime: "",				// 结束时间
			}
			this.pagination = {	// 分页
				pageNum: 1,
				pageSize: 10,
			}
			this.checkAll = true
			this.getOfflineList()
		},

		// 查看详情
		async handleToDetail(index, row) {
			console.log(row);

			let res = await getOrderOfflineReceiveDetail({ orderNum: row.orderNum })
			console.log(res);
			if (!res.success && res.code === 20006) {
				this.$alert(`<p style='color:red;'>${res.msg || "您不是该订单的承办人，无法查看该订单内容。"}</p>`, '提示', {
					confirmButtonText: '确定',
					dangerouslyUseHTMLString: true
				})
				return
			}

			this.$router.push({
				name: 'offlineOrderDetail',
				query: {
					orderNum: row.orderNum,
				}
			})
		},

		// 去预约
		handleToMail(index, row) {
			// console.log(row)
			this.showSubscribeDialog = true
			this.$nextTick(() => {
				this.$refs["getLicenseForm"] && this.$refs["getLicenseForm"].clearValidate()
			})
			this.getLicenseForm = row
		},

		// 确定预约
		handleConfirmReserve(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$confirm('<p style="color:red;">确定预约后，将会把预约信息短息发送给领证人，确定继续？</p>',
						'操作提示', {
						dangerouslyUseHTMLString: true,
						type: 'warning',
						customClass: "confirm_reserve"
					}).then(async () => {
						let res = await appointmentTime(this.getLicenseForm)
						console.log("预约-----", res);
						if (res.success) {
							this.$message.success("预约成功")
							this.getOfflineList()
							this.showSubscribeDialog = false
							return
						}

						this.$message.error(res.msg || "预约失败，请稍后再试")
					}).catch(() => {
						// this.$message({
						// 	type: 'info',
						// 	message: '已取消操作！'
						// });
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			})
		},

		// 单选
		handleCheckedStatusesChange(value) {
			if (value.length > 1) {
				this.searchFormData.receiveStatus.splice(0, 1)
			}
			console.log(value);
			if (value.length == 0) {
				this.tableData = []
				this.total = 0
				return
			}
			this.getOfflineList()
		},

		// 获取列表
		async getOfflineList() {
			let data = {
				...this.pagination,
				...this.searchFormData,
			}

			data.receiveStatus = data.receiveStatus.join("")
			let res = await getOfflineLicenseList(data)
			// console.log('列表', res);
			if (res.success && res.data) {
				this.tableData = res.data.list
				this.total = res.data.total
			}
		},

		// 分页每页显示条数变化
		handleSizeChange(val) {
			console.log('每页:' + val);
			this.pagination.pageSize = val
			this.getOfflineList()
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.pagination.pageNum = val
			this.getOfflineList()
		},
	},
	watch: {
		"getLicenseForm.receivePointName"(val) {
			if (val) {
				let temp = this.orgOfficeIdComputed.find(i => {
					return i.officeName === val
				})
				this.getLicenseForm.receiveAddress = temp.orgAddress
			}
		},
		showSubscribeDialog(val) {
			if (!val) {
				this.getLicenseForm = {}
			}
		}
	},
}
</script>

<style lang="less" scoped>
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
	margin-top: 20px;
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

.min_width {
	min-width: 400px;
}

/deep/ .table_cell {
	padding: 8px 0;
}
</style>
<style>
.confirm_reserve {
	width: 500px;
}
</style>