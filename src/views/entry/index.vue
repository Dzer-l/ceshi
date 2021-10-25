<template>
	<div class="business_main">
		<el-card shadow="always" :body-style="{ padding: '20px' }">
			<!-- 搜索区域 -->
			<div class="search-issunce-box">
				<el-form label-position="right" ref="searchForm" label-width="80px" :model="formInline">
					<el-row :gutter="20">
						<el-col class="min_width" :span="6">
							<el-form-item label="证据编号">
								<el-input v-model="formInline.keyword" placeholder="请输入证据编号" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6">
							<el-form-item label="取证人">
								<el-input v-model="formInline.userName" placeholder="请输入取证人" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6">
							<el-form-item label="送达方式">
								<el-select style="width:100%" v-model="formInline.mailType" placeholder="请选择送达方式">
									<el-option v-for="item in mailTypeList" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="20">
						<el-col class="min_width" :span="6">
							<el-form-item label="证据类型">
								<el-select style="width:100%" v-model="formInline.evidType" placeholder="请选择证据类型">
									<el-option v-for="item in evidTypeList" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6">
							<el-form-item label="办证点">
								<el-select style="width:100%" v-model="formInline.orgOfficeId" placeholder="请选择办证点">
									<el-option v-for="item in orgOfficeIdList" :key="item.id" :label="item.officeName"
										:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="min_width" :span="6">
							<el-form-item label="承办人">
								<el-select style="width:100%" v-model="formInline.acceptSysUserName"
									placeholder="请选择承办人">
									<el-option v-for="(item,index) in operatorList" :key="index" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="20">
						<el-col :span="8" style="width:530px">
							<el-form-item label="取证时间">
								<el-date-picker v-model="formInline.obtainTimeStart" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择取证开始时间"
									:picker-options="obtainTimeStart" />
								<span class="date_section">—</span>
								<el-date-picker v-model="formInline.obtainTimeEnd" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择取证结束时间"
									:picker-options="obtainTimeEnd" default-time="23:59:59" />
							</el-form-item>
						</el-col>
						<el-col :span="8" style="width:530px">
							<el-form-item label="存证时间">
								<el-date-picker v-model="formInline.finishStartTime" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择存证开始时间"
									:picker-options="finishStartTime" />
								<span class="date_section">—</span>
								<el-date-picker v-model="formInline.finishEndTime" value-format="yyyy-MM-dd HH:mm:ss"
									type="datetime" prefix-icon="el-icon-date" placeholder="选择存证结束时间"
									:picker-options="finishEndTime" default-time="23:59:59" />
							</el-form-item>
						</el-col>
						<el-col :span="4" style="min-width:280px">
							<el-button type="primary" size="default" @click="search">查询</el-button>
							<el-button size="default" @click="reset">重置</el-button>
							<el-button type="primary" size="default" @click="handleImportRecord">导出订单</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<!-- 列表区域 -->
			<div>
				<div class="data-list-main">
					<el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
						<el-tab-pane label="取证中" name="first" />
						<el-tab-pane label="取证成功" name="second" />
						<el-tab-pane label="取消取证" name="third" />
					</el-tabs>

					<!-- checkbox搜索 -->
					<div class="allSelect_btn">
						<div class="button_set" style="margin-top: 15px">
							<p style=" padding: 0;font-weight: bolder;width: 100px;white-space: nowrap;"
								class="font-title">
								订单状态：</p>
							<div class="btn_box" style="min-width: 600px">
								<div class="allBtn" style="margin-left: 0">
									<el-checkbox-group v-model="testAll" @change="getValueAll()">
										<el-checkbox v-for="(item, index) in allBtnData" :key="index"
											:label="item.content" :checked="item.checked" />
									</el-checkbox-group>
								</div>
								<div>
									<el-checkbox-group ref="checkData" v-model="test" @change="getValue(test)">
										<span v-for="(item, i) in items" :key="i">
											<el-checkbox v-if="item.id !== 601" :label="item.content"
												:disabled="item.disabled" :checked="item.checked" />
										</span>
									</el-checkbox-group>
								</div>
							</div>
						</div>
					</div>

					<!-- table表格 -->
					<div class="tableData_main">
						<el-table v-loading="loading" :data="tableData" border style="width: 100%">
							<el-table-column type="index" label="序号" align="center" show-overflow-tooltip />
							<el-table-column prop="evidNo" label="证据编号" align="center" show-overflow-tooltip />
							<el-table-column prop="evidName" label="证据名称" align="center" show-overflow-tooltip />
							<el-table-column prop="evidMailDTO.mailTypeDesc" label="证据类型" align="center" />

							<el-table-column prop="evidMailDTO.evidStatusDesc" label="证据状态" align="center"
								show-overflow-tooltip>
								<template slot-scope="scope">
									<el-tag disable-transitions :class="tagClass(scope.row.evidMailDTO)">
										<span>{{ scope.row.evidMailDTO.evidStatusDesc }}</span>
									</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="obtainTime" label="取证时间" align="center" show-overflow-tooltip />
							<el-table-column label="支付状态" align="center" show-overflow-tooltip>
								<template slot-scope="scope">
									<span
										v-if="scope.row.evidType!==1">{{ scope.row.evidMailDTO.isPayment===0?'未支付':(scope.row.evidMailDTO.isPayment===1?'线上支付':'线下支付') }}</span>
									<span v-else>-</span>
								</template>
							</el-table-column>
							<el-table-column label="承办人" align="center" show-overflow-tooltip>
								<template slot-scope="scope">
									<span>{{ scope.row.evidType===1?'-':scope.row.acceptSysUserName }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="orderSource" label="订单来源" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.orderSource | getSource }}</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" min-width="100" align="center">
								<template slot-scope="scope">
									<el-button type="text" class="exit_btn"
										@click="handleEdit(scope.$index, scope.row)">
										{{ scope.row.orderStatus | correspondingOperation}}</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="paging_box">
							<div class="paging">
								<el-pagination background :current-page.sync="pageNum" :page-size="pageSize"
									layout="prev, pager, next,sizes, jumper" :total="total"
									@size-change="handleSizeChange" @current-change="handleCurrentChange" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<router-view />
		</el-card>
	</div>
</template>

<script>
import { suppressDeprecationWarnings } from 'moment';
const moment = require('moment');
import {
	getCloudListData,
	getOperator,
	getOrgOfficeList,
	exportPackageRecordExcel,
	getCloudDateil,
} from '../../api/cloudMail.js'
export default {
	filters: {
		getSta(val) {
			var str = val
			// if (val === 1) {
			//   str = "房产委托";
			// } else {
			//   if (val === 2) {
			//     str = "商标转让";
			//   } else {
			//     str = "公众号迁移";
			//   }
			// }
			return str
		},
		getSource(val) {
			var str = ''
			if (val === 1) {
				str = 'PC网站'
			} else {
				str = 'PC网站'
			}
			return str
		},
		orderState(val) {
			var str = ''
			switch (true) {
				case val === 4:
					str = '待审核'
					return str
				case val === 201:
					str = '待邮寄原件'
					return str
				case val === 202:
					str = '待取件'
					return str
				case val === 203:
					str = '运送中'
					return str
				case val === 3:
					str = '待公证处收件'
					return str
				case val === 5:
					str = '待支付'
					return str
				case val === 6:
					str = '待公证处寄函'
					return str
				case val === 7 || val === 601:
					str = '已寄函'
					return str
				case val === 8:
					str = '拒绝受理'
					return str
				case val === 9:
					str = '已撤销'
					return str
				case val === 10:
					str = '已存证'
					return str
				default:
					return val
			}
		},
		correspondingOperation(val) {
			var str = '查看详情'
			return str
		}
	},
	data() {
		return {
			activeName: 'first',
			// 开始时间
			startDate: '',
			// 结束时间
			endDate: '',
			// 输入框初始值
			type_name: '请填写申请人姓名',
			// 下拉框的值的数据组
			type: [
				{ id: 1, name: '申请人' },
				{ id: 2, name: '订单编号' },
				{ id: 3, name: '用户手机号' },
				{ id: 4, name: '公证员' }
			],
			// 输入框初始值改变的数组
			valueData: [
				{ id: 1, name: '请填写申请人姓名' },
				{ id: 2, name: '请填写订单编号' },
				{ id: 3, name: '请填写手机号' },
				{ id: 4, name: '请填写名称' }
			],
			// 下拉框双向绑定的值
			formInline: {
				user: '',
				keyword: "",
				obtainTimeStart: "",
				obtainTimeEnd: "",
				acceptSysUserName: "",
				orgOfficeId: "",
				finishStartTime: "",
				finishEndTime: "",
				mailType: "",
				userName: "",
				evidType: "",
			},
			mailTypeList: [		// 送达方式 1自寄函件 2公证处代寄打印件 3公证处代寄原件
				{ label: "全部", value: "" },
				{ label: "自寄函件", value: 1 },
				{ label: "公证处代寄打印件", value: 2 },
				{ label: "公证处代寄原件", value: 3 },
			],
			evidTypeList: [	// 证据类型
				{ label: "全部", value: "" },
				{ label: "自寄送达存证", value: 1 },
				{ label: "公证邮寄送达存证", value: 2 },
			],
			operatorList: [{ label: "全部", value: "" }],	// 操作人列表
			orgOfficeIdList: [{ officeName: "全部", id: "" }],	// 办证点

			obtainTimeStart: {	// 取证开始时间
				disabledDate: (time) => { return time.getTime() > moment(this.formInline.obtainTimeEnd).format("x") }
			},
			obtainTimeEnd: {	// 取证结束时间
				disabledDate: (time) => { return time.getTime() < moment(this.formInline.obtainTimeStart).format("x") }
			},
			finishStartTime: {	// 存证开始时间
				disabledDate: (time) => { return time.getTime() > moment(this.formInline.finishEndTime).format("x") }
			},
			finishEndTime: {	// 存证结束时间
				disabledDate: (time) => { return time.getTime() < moment(this.formInline.finishStartTime).format("x") }
			},

			// 输入框双向绑定的值
			name: '',
			// 按钮组双向绑定的值
			test: [],
			// 全部按钮双向绑定的值
			testAll: [],
			// 全部按钮的初始状态值
			checkedSta: true,
			// 全部按钮的数据
			allBtnData: [{ id: 7, content: '全部', disabled: false, checked: true }],
			// 按钮组的数据
			items: [
				{ id: 202, content: '待取件', disabled: false, checked: false },
				{ id: 203, content: '运送中', disabled: false, checked: false },
				{ id: 204, content: '待邮寄', disabled: false, checked: false },
				{ id: 201, content: '待邮寄原件', disabled: false, checked: false },
				{ id: "3,301", content: '待公证处收件', disabled: false, checked: false },
				{ id: 4, content: '待审核', disabled: false, checked: false },
				{ id: 5, content: '待支付', disabled: false, checked: false },
				{ id: 6, content: '待公证处寄函', disabled: false, checked: false },
				{ id: 7, content: '已寄函', disabled: false, checked: false },
				{ id: 701, content: '待确认寄达', disabled: false, checked: false },
				{ id: 10, content: '已存证', disabled: false, checked: false },
				{ id: 8, content: '拒绝受理', disabled: false, checked: false },
				{ id: 9, content: '已撤销', disabled: false, checked: false },
				{ id: 1, content: '待提交', disabled: false, checked: false },
				{ id: 601, content: '已寄函', disabled: false, checked: false },
			],
			// 初始加载表格的页码
			pageNum: 1,
			// 初始加载表格每页显示的数据
			pageSize: 10,
			// 表格数据
			tableData: [],
			loading: false,
			// 提示"时间选择不正确"文字的状态
			textSta: false,
			total: null
		}
	},
	watch: {
		// 监听下拉框选择的值来确定输入框的初始值
		// 'formInline.region'(newval, oldval) {
		// 	for (let i = 0; i < this.valueData.length; i++) {
		// 		if (newval === this.valueData[i].id) {
		// 			this.type_name = this.valueData[i].name
		// 		}
		// 	}
		// },
		// 监听按钮组绑定的数组,变化触发监听
		'test.length'(newval, oldval) {
			if (newval > 0) {
				this.testAll = []
			} else {
				this.testAll = ['全部']
			}
		},
		// 全部按钮绑定的值发生改变会触发的监听
		'testAll.length'(val) {
			if (val > 0) {
				this.test = []
			} else {
				if (this.test.length === 0) {
					this.testAll = ['全部']
				}
			}
		},
		// startDate(val) {
		// 	// console.log(new Date(val).getTime())
		// 	if (this.endDate !== '') {
		// 		if (new Date(this.endDate).getTime() < new Date(val).getTime()) {
		// 			this.textSta = true
		// 		} else {
		// 			this.textSta = false
		// 		}
		// 	} else {
		// 		this.textSta = false
		// 	}
		// },
		// endDate(val) {
		// 	if (this.startDate !== '') {
		// 		if (new Date(this.startDate).getTime() > new Date(val).getTime()) {
		// 			this.textSta = true
		// 		} else {
		// 			this.textSta = false
		// 		}
		// 	} else {
		// 		this.textSta = false
		// 	}
		// }
	},
	created() {
		// var data = { pageNum: this.pageNum, pageSize: this.pageSize };
		// getCloudListData(data).then((res) => {
		//   console.log(res,'订单列表');
		// });
		// if (sessionStorage.getItem('pageSize')) {
		// 	this.pageSize = parseInt(sessionStorage.getItem('pageSize'))
		// 	// console.log()
		// }
		// if (sessionStorage.getItem('entryPageNum')) {
		// 	this.pageNum = parseInt(sessionStorage.getItem('entryPageNum'))
		// }
		this.formInline = sessionStorage.formInline ? JSON.parse(sessionStorage.formInline) : this.formInline
		console.log(sessionStorage.entryPageNum);
		this.pageNum = sessionStorage.entryPageNum ? Number(sessionStorage.entryPageNum) : this.pageNum
		this.pageSize = sessionStorage.entryPageSize ? Number(sessionStorage.entryPageSize) : this.pageSize
		this.getOperatorList()
		this.getOfficeList()
		this.getList()
	},
	mounted() {
		window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
	},
	beforeRouteLeave(to, from, next) {
		let toNameList = ["entryDetail"]
		if (toNameList.includes(to.name)) {
			sessionStorage.setItem("formInline", JSON.stringify(this.formInline))
			sessionStorage.setItem("entryPageNum", this.pageNum)
			sessionStorage.setItem("entryPageSize", this.pageSize)
		}
		next()
	},
	beforeRouteEnter(to, form, next) {
		let formNameList = ["entryDetail"]
		if (!formNameList.includes(form.name)) {
			sessionStorage.removeItem("formInline")
			sessionStorage.removeItem("entryPageNum")
			sessionStorage.removeItem("entryPageSize")
		}
		next()
	},
	destroyed() {
		window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
	},
	methods: {
		// 浏览器刷新要执行的事件
		beforeunloadHandler(e) {
			sessionStorage.removeItem("formInline")
			sessionStorage.removeItem("entryPageNum")
			sessionStorage.removeItem("entryPageSize")
		},
		// 导出订单
		async handleImportRecord() {
			if (!this.formInline.finishStartTime || !this.formInline.finishEndTime) {
				return this.$message.error("请选择导出订单的存证时间")
			}

			let range = moment(this.formInline.finishEndTime).diff(moment(this.formInline.finishStartTime), "days")
			if (range > 365) {
				return this.$message.error("导出时间范围最大为12个月")
			}
			let data
			if (this.test.length > 0) {
				var cheData = ''
				for (let i = 0; i < this.test.length; i++) {
					for (let j = 0; j < this.items.length; j++) {
						if (this.test[i] === this.items[j].content) {

							if (this.test[i] === '已寄函') {
								cheData = cheData + '7,601' + ','
							} else {
								cheData += this.items[j].id + ','
							}
						}
					}
				}
				data = { ...this.formInline, evidStatusArray: cheData.replace(/,$/gi, '') }
			} else {
				data = this.formInline
			}

			let res = await exportPackageRecordExcel({ ...data })

			let fileName = `证据列表 ${moment(this.formInline.finishStartTime).format("YYYY-MM-DD")} - ${moment(this.formInline.finishEndTime).format("YYYY-MM-DD")}.xls`
			this.$fun.blobFile(res, fileName)
			this.$message.success("导出成功！")
		},

		// 获取办证点
		async getOfficeList() {
			let res = await getOrgOfficeList()
			console.log('办证点', res)
			this.orgOfficeIdList.push(...res.data)
		},
		// 获取操作人
		async getOperatorList() {
			let res = await getOperator()
			// console.log("获取操作人", res);
			if (res.success && res.data) {
				res.data.forEach(item => {
					this.operatorList.push({
						label: item,
						value: item
					})
				})
				return
			}
		},

		tagClass(e) {
			switch (true) {
				case e.evidStatus === 10:
					return 'tag-suc'
				case [9, 8].includes(e.evidStatus):
					return 'tag-err'
				case [201, 5, 202, 203].includes(e.evidStatus):
					return 'tag-no'
				default:
					return 'tag-war'
			}
		},

		// tabs切换
		handleClick(tab) {
			console.log(this.test)
			if (tab === 'first') {
				this.test = []
				this.getList()
				console.log(tab)
			} else if (tab === 'second') {
				this.test = ['已存证']
				this.getValue(this.test)
			} else {
				this.test = ['已撤销', '拒绝受理']
				this.getValue(this.test)
			}
		},

		// 获取列表
		getList(config = {}) {
			var data = Object.assign({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				...this.formInline
			}, config)

			getCloudListData(data).then((res) => {
				console.log("列表------", res)
				if (res.success && res.data) {
					this.total = res.data.total
					this.tableData = res.data.list
				}
			})
		},

		// 搜索
		search() {
			console.log(this.formInline)
			var cheData = ''
			for (let i = 0; i < this.test.length; i++) {
				for (let j = 0; j < this.items.length; j++) {
					if (this.test[i] === this.items[j].content) {

						if (this.test[i] === '已寄函') {
							cheData = cheData + '7,601' + ','
						} else {
							cheData += this.items[j].id + ','
						}
					}
				}
			}
			this.getList({ evidStatusArray: cheData.replace(/,$/gi, '') })
		},

		// 点击多选按钮组触发的事件
		getValue(val) {
			this.pageNum = 1
			if (val.length > 0) {
				var cheData = ''
				for (let i = 0; i < val.length; i++) {
					for (let j = 0; j < this.items.length; j++) {
						if (val[i] === this.items[j].content) {
							cheData += this.items[j].id + ','
						}
					}
				}
				this.getList({ evidStatusArray: cheData.replace(/,$/gi, '') })
				return
			}
			this.getList()
		},

		// 点击全部按钮触发的事件
		getValueAll() {
			this.getList()
		},

		// 点击表格中的按钮跳转对应的详情页
		async handleEdit(index, row) {
			let res = await getCloudDateil({ evidId: row.id })
			if (!res.success && res.code === 20006) {
				this.$confirm(`<p style="color:red;">${res.msg}</p>`, '提示', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定',
					type: 'warning',
					showCancelButton: false,
				}).catch((err) => {

				})
				return
			}

			sessionStorage.setItem('entryId', row.id)
			this.$router.push({
				name: 'entryDetail'
			})
		},

		// 设置每一页表格显示多少数据的事件
		handleSizeChange(val) {
			this.search()
		},

		// 点击跳转上一页下一页的事件
		handleCurrentChange(val) {
			this.search()
		},

		// 重置
		reset() {
			this.resetSearchForm()
			if (this.activeName === 'first') {
				this.test = []
				this.testAll = ['全部']
				this.getList()
			} else if (this.activeName === 'second') {
				this.test = ['已存证']
				this.getValue(this.test)
			} else {
				this.test = ['已撤销', '拒绝受理']
				this.getValue(this.test)
			}
		},

		// 重置表单
		resetSearchForm() {
			this.formInline = {
				user: '',
				keyword: "",
				obtainTimeStart: "",
				obtainTimeEnd: "",
				acceptSysUserName: "",
				orgOfficeId: "",
				finishStartTime: "",
				finishEndTime: "",
				mailType: "",
				userName: "",
				evidType: "",
			}
			this.pageNum = 1
		}
	}
}
</script>

<style lang="less" scoped>
// /deep/ input,/deep/ .el-checkbox__inner{
//   border: solid #111 1px !important;
// }
.date_section {
	padding: 0 5px;
	color: #999;
}
.search-issunce-box {
	display: block !important;
	background: #fff;
	padding: 20px;
	min-width: 100%;
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
.business_main {
	background: #f7f7f7;
	padding: 20px;
	min-height: calc(100vh - 50px);
	.box_flex_column;
	.search-main {
		display: flex;
		width: 100%;
		background: #fff;
		padding: 20px 0;
		align-items: center;
		& > .category-main {
			width: 20%;
		}
		.select_date {
			.list_back;
			width: 40%;
			position: relative;
			.date_section {
				margin: 0 5px;
			}
			& > div {
				display: flex;
				align-items: center;
				& > span {
					display: block;
					width: 18px;
				}
				& > .el-date-editor {
					flex: 1;
				}
			}
		}
	}
	.category_to_retrieve {
		.box_flex_row;
		.list_back;
		.select_type_name,
		.el-input {
			width: 100%;
		}
	}
	.category_title {
		& > p {
			background-color: #fff;
			padding-left: 20px;
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
.data-list-main {
	background: #fff;
	/deep/ .el-tabs__nav-wrap {
		padding-left: 20px;
		padding-top: 10px;
	}
}
.reset_btn {
	padding-top: 5px;

	margin-left: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	& button {
		width: 70px;
	}
}
.hint-text {
	position: absolute;
	bottom: 0;
}
</style>
