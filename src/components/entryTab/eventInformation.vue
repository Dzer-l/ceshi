<template>
	<div>
		<div class="title_wrapper">
			<h3 class="title">合同信息</h3>
			<!-- <el-button type="primary" size="small">审核文书</el-button> -->
		</div>
		<div class="info_content">
			<span>付款方式：</span>
		</div>

		<div class="table_item">
			<div class="table_title">合同信息</div>
			<div class="table_info">
				<div class="info">合同编号：{{ orderData.contractNum }}</div>
				<div class="info">合同金额：¥ {{ orderData.contractAmount }}元</div>
				<div class="info">付款截止日期：{{ orderData.paymentDeadline }}</div>
			</div>
			<div class="table_info">
				<div class="info">物业名称：{{ orderData.propertyCompany }}</div>
				<div class="info">物业费：¥ {{ orderData.propertyCosts }}元</div>
			</div>
		</div>

		<div class="title_wrapper">
			<h3 class="title">审核类文书</h3>
			<el-button type="primary" size="small" @click="handleAuditDocuments">审核文书</el-button>
		</div>
		<div class="table_item">
			<el-table :data="tableData" style="width: 100%" header-row-class-name="rowClassName"
				cell-class-name="cellClassName">
				<el-table-column prop="notaryPaperType" label="材料类型" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="originalFilename" label="材料名称" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="applicantMobile" label="签署状态" align="center" show-overflow-tooltip>
					<template slot-scope="{row}">
						<el-tag :type="getTagType(row.signStatus)" size="medium">
							{{ row.signStatus == 0 ? '未签署':'已签署' }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="审核状态" align="center">
					<template slot-scope="{row}">
						<el-tag :type="getTagType(row.signStatus)" size="medium">
							{{ row.signStatus == 0 ? '未签署':'已签署' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="" label="操作" align="center" width="220px">
					<template slot-scope="{row}">
						<el-link class="el_link_button" type="primary" @click="handleEdit(row)">编辑</el-link>
						<el-link class="el_link_button" type="primary" @click="handleFill">填写公证书编号</el-link>
						<el-link class="el_link_button" type="primary" @click="handlePriview">预览</el-link>
						<el-link class="el_link_button" type="primary" @click="handlePrint">打印</el-link>
						<el-link class="el_link_button" type="primary" @click="handleDownload">下载</el-link>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<el-dialog title="填写公证书编号" :visible.sync="dialogVisible" width="550px" :close-on-click-modal="false">
			<el-form :model="notaryNumForm" ref="notaryNumForm" :rules="notaryNumFormRules">
				<el-form-item prop="number">
					<el-input v-model="notaryNumForm.number" placeholder="请输入公证书编号"></el-input>
				</el-form-item>
				<el-form-item style="text-align:right;">
					<el-button type="primary" @click="handleSubmit">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<auditDocumentsDialog :visible.sync="auditDocumentsDialogShow" @close="auditDocumentsDialogClose" />
		<iframe v-show="iframeSta" name="test" frameborder="0" />
	</div>
</template>

<script>
import {
	parkingContractInfo,
	notaryPaperPreviewImg,
	downLoadNotaryPaper,
	modifyParkingContractInfo,
} from '../../api/parkingSpace';
import auditDocumentsDialog from './auditDocuments.vue'
export default {
	components: {
		auditDocumentsDialog
	},
	data() {
		return {
			orderId: "",
			// tableData: [],
			tableData: Array(2).fill({ notaryPaperType: "合同/协议" }),
			orderData: {},	// 事项基本信息
			dialogVisible: false,
			notaryNumForm: {
				number: "",
			},
			notaryNumFormRules: {
				number: [
					{ required: true, message: '请输入公证书编号', trigger: 'blur' },
					// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
			},

			auditDocumentsDialogShow: false,
			iframeSta: false,
		}
	},
	created() {
		this.orderId = this.$route.query.orderId
	},
	methods: {
		// 审核文书
		handleAuditDocuments() {
			console.log("审核文书");
			this.auditDocumentsDialogShow = true
		},
		auditDocumentsDialogClose() {
			this.auditDocumentsDialogShow = false
		},

		// 获取事项信息
		async getOrderData() {
			let res = await parkingContractInfo(this.orderId)

			if (res.success && res.data) {
				this.orderData = res.data
				this.tableData.push(res.data.notaryPaperDTO)
			}
		},

		// 预览合同
		async handlePriview() {
			const list = []
			let res = await notaryPaperPreviewImg({ id: "" })

			// if (res.success && res.data) {
			// 	list.push('data:image/png;base64,' + res.data)
			// 	this.$store.commit('app/CHANGE_IMAGE', list)
			// }
		},

		// 获取base64
		async getImg(id) {
			// const url = `org/notary-paper-preview-img?id=${id}`
			// return await this.$axios(url).then(async (res) => {
			// 	if (res.success) {
			// 		return 'data:image/png;base64,' + res.data
			// 	}
			// })
		},

		// 编辑
		handleEdit(row) {
			console.log(row);
			// this.iframeSta = true
			const mode = process.env.VUE_APP_BASE_MODE
			if (mode === 'development') {
				this.http = 'http://192.168.1.186:12009'
			} else if (mode === 'test') {
				this.http = 'https://test-onlyoffice.lvzhengyun.cn'
			} else if (mode === 'production') {
				this.http = 'https://office.lvzhengyun.cn'
			} else if (mode === 'staging') {
				this.http = 'https://test-onlyoffice.lvzhengyun.cn'
			}
			// window.open(`https://test-onlyoffice.lvzhengyun.cn/page/go-open-notary-paper/${row.orderId}/${row.id}`, 'test')
			window.open(`https://test-onlyoffice.lvzhengyun.cn/page/go-open-notary-paper/1428242986871603202/1428245714649792514`, 'test')
		},

		// 填写
		handleFill() {
			this.dialogVisible = true
		},
		handleSubmit() {
			this.$refs.notaryNumForm.validate(async (valid) => {
				if (valid) {
					let res = await modifyParkingContractInfo({
						id: "",
						notaryNum: "",
					})

					if (res.success) {
						this.$message.success("填写公证书编号成功！")
						return
					}

					this.$message.error(res.msg || "填写公证书编号失败，请稍后再试！")
				} else {
					return false;
				}
			});
		},

		// 打印合同
		async handlePrint() {
			
		},

		// 下载合同
		async handleDownload() {
			let data = {
				orderId: "",
				notaryPaperId: "",
			}
			let res = await downLoadNotaryPaper(data)
			console.log(res);

			// this.saveAs()
		},

		// 获取tag类型
		getTagType(val) {
			const type = {
				0: "success",
				1: "danger",
			}
			return type[val]
		},

		// 下载文件函数
		saveAs(blob, fileName) {
			if (window.navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, fileName)
			} else {
				const link = document.createElement('a')
				const body = document.querySelector('body')
				link.href = window.URL.createObjectURL(blob) // 创建对象url
				link.download = fileName
				// fix Firefox
				link.style.display = 'none'
				body.appendChild(link)
				link.click()
				body.removeChild(link)
				window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
			}
		},
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.$refs.notaryNumForm.clearValidate()
			}
		}
	},
}
</script>

<style lang="less" scoped>
.title_wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 20px;

	.title {
		border-left: 3px solid #1989fa;
		padding-left: 5px;
	}
}
.info_content {
	padding-left: 8px;
}
.table_item {
	margin: 10px 0 40px 0;
	border: 1px solid #ddd;
	.table_title {
		line-height: 40px;
		font-size: 15px;
		background: #e6f6fe;
		padding: 0 10px;
	}
	.table_info {
		display: flex;
		padding: 0 30px;
		.info {
			min-width: 33%;
			line-height: 40px;
		}
	}
}
.el_link_button {
	margin-left: 8px;
}
/deep/ .rowClassName > th {
	color: #303133;
	background: #e6f6fe !important;
}
/deep/ .cellClassName {
	padding: 6px 0;
}
</style>