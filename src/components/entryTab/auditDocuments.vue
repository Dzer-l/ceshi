<template>
	<div>
		<el-dialog title="审核文书" :visible.sync="visibleComputed" width="1280px" :close-on-click-modal="false" top="0.5vh"
			@close="dialogClose" custom-class="outside_class">
			<div class="audit_title">审核类文书列表</div>
			<div class="document_title_wrapper">
				<el-row>
					<el-col :span="10" v-for="(item,index) in documentsListComputed" :key="item.id">
						<span class="audit_label" :class="statusComputed(item.isEdit).class">
							{{ statusComputed(item.isEdit).label }}
						</span>
						<el-tooltip :content="item.originalFilename" placement="top" effect="dark">
							<span class="audit_paper">{{ item.originalFilename }}</span>
						</el-tooltip>
						<el-link type="primary" style="margin-left: 20px;" @click="handleEdit(item,index)">编辑</el-link>
					</el-col>
				</el-row>
			</div>
			<div class="button_wrapper">
				<el-button :disabled="count === 0" type="primary" size="medium" @click="handlePrev">上一份</el-button>
				<el-button :disabled="count === documentsListComputed.length-1" type="primary" size="medium"
					@click="handleNext">下一份
				</el-button>
				<el-button type="danger" size="medium" @click="handleNotpass">不通过</el-button>
				<el-button type="success" size="medium" @click="handleAllPass">全部通过</el-button>
			</div>

			<div class="document_wrapper">
				<!-- <iframe id="documentIframe" :src="pdfSrc" style="min-height:600px" width="100%" height="100%"
					frameborder="0"></iframe> -->
				<!-- <embed id="documentIframe" style="min-height:600px" width="100%" height="100%" :src="pdfSrc"
					type="application/pdf"> -->
				<wpsOffice v-if="isReady" v-loading="!isReady" v-bind:wpsUrl="jwpsUrl" v-bind:token="jtoken"
					@wpsAppObject="wpsAppObject" @wpsIframe="getWpsIframe" @error="handleError"
					@fileUpdate="fileUpdate" />
			</div>
		</el-dialog>

		<el-dialog title="审核不通过" :visible.sync="dialogNotpass" width="30%" :close-on-click-modal="false" append-to-body>
			<el-form :model="notPassForm" ref="notPassForm" :rules="notPassFormRules">
				<el-form-item prop="reason">
					<el-input type="textarea" v-model="notPassForm.reason" placeholder="请输入不通过原因"></el-input>
				</el-form-item>
				<el-form-item style="text-align:right;">
					<el-button type="primary" @click="handleSubmit">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import wpsOffice from '../wpsOffice/index.vue';
import {
	checkParkingContractInfo,
	wpsV1ApiFileGetViewUrlWebPath,
	wpsTempFile,
} from '../../api/parkingSpace';
import {
	checkingContractInfo,
	sendAuditPassTemplate,
	sendAuditNotPassReason,
} from "../../api/newhouse";
export default {
	props: ["visible", "documentsList", "basicData"],
	components: {
		wpsOffice,
	},
	data() {
		return {
			orderId: this.$route.query.orderId,		// 订单id
			dialogNotpass: false,
			notPassForm: {			// 审核不通过理由
				reason: ""
			},
			notPassFormRules: {		// 审核不通过理由校验
				reason: [
					{ required: true, message: '请输入不通过原因', trigger: 'blur' },
					{ min: 5, max: 120, message: '长度在5-120个字符', trigger: 'blur' }
				],
			},
			pdfList: [
				{
					pdfUrl: "https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-29/1546049718768.pdf",
					title: "你好，2019年"
				},
				{
					pdfUrl: "http://file.gp58.com/file/2018-11-14/111405.pdf",
					title: "中信证券观点"
				},
				{
					pdfUrl: "https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-28/1546003237411.pdf",
					title: "12月投资月刊"
				},
				{
					pdfUrl: "https://dakaname.oss-cn-hangzhou.aliyuncs.com/file/2018-12-28/1546003282521.pdf",
					title: "丰岭资本观点"
				},
			],
			pdfSrc: "https://www.gjtool.cn/pdfh5/git.pdf",
			count: 0,
			jwpsUrl: '',	// wps预览地址
			jtoken: '',		// wpstoken
			wpsApp: null,		// wps实例对象
			loading: false,
			editPaper: {},	// 正在编辑的文书
			isReady: false,
			wpsIframe: null,
			// fileStatus: "",
		}
	},
	created() {
		// this.jwpsUrl = sessionStorage.wpsUrl;
		// this.jtoken = sessionStorage.token;
	},
	methods: {
		async handleEdit(row, index) {
			// console.log(row);
			this.editPaper = row
			this.count = index
			this.changeStatus(row, 2)
			let data = await this.getViewUrlWebPath(row)
			// this.wpsIframe.src = data.data.wpsUrl
			this.jwpsUrl = data.data.wpsUrl
			this.jtoken = data.data.token
		},

		// 获取预览合同文件url(单个)
		async getViewUrlWebPath(row) {
			this.loading = true;
			const params = {
				orderId: this.orderId,
				// bucketName: 'notary-paper-file',
				// fileName: row.originalFilename,
				notaryPaperId: row.id
			};

			let res = await wpsV1ApiFileGetViewUrlWebPath(params)
			// console.log(res, "----------");
			return res
			// if (res.data) {
			// 	// return res.data
			// 	// let r = res.data.data;
			// 	// 跳转 使用sessionStorage，避免关键信息在ip中暴露
			// 	// 使用push会停留当前页面，故不采纳
			// 	// params 传递参数，子组件无法渲染iframe组件，故不采纳
			// 	// sessionStorage.wpsUrl = r.wpsUrl;
			// 	// sessionStorage.token = r.token;
			// 	// const jump = this.$router.resolve({ name: 'viewFile' });
			// 	// window.open(jump.href, '_blank');
			// } else {
			// 	// this.$message.error(res.msg || '服务器开小差了，请稍后再试');
			// 	// this.isReady = false;
			// }
		},

		// 保存 wpsApp
		wpsAppObject(obj) {
			this.wpsApp = obj;
		},

		getWpsIframe(iframe) {
			this.wpsIframe = iframe
		},

		handleError(err) {
			this.$emit("error", err)
		},

		async fileUpdate(status) {
			// console.log(status, "文档更新---");
			if (status.status === 7) {
				// this.fileStatus = status.status
				// let res = await wpsTempFile(this.editPaper.id)
				// console.log("更新文档结果----", res)
			}
		},

		// 上一份
		async handlePrev() {
			this.count--
			if (this.count < 0) {
				this.count = 0
				return
			}
			this.changeStatus(this.documentsListComputed[this.count], 2)
			this.editPaper = this.documentsListComputed[this.count]
			let data = await this.getViewUrlWebPath(this.documentsListComputed[this.count])
			// this.wpsIframe.src = data.data.wpsUrl
			this.jwpsUrl = data.data.wpsUrl
			this.jtoken = data.data.token
		},

		// 下一份
		async handleNext() {
			this.count++
			if (this.count > this.documentsListComputed.length) {
				this.count = this.documentsListComputed.length - 1
				return
			}
			this.changeStatus(this.documentsListComputed[this.count], 2)
			this.editPaper = this.documentsListComputed[this.count]
			let data = await this.getViewUrlWebPath(this.documentsListComputed[this.count])
			// this.wpsIframe.src = data.data.wpsUrl
			this.jwpsUrl = data.data.wpsUrl
			this.jtoken = data.data.token
		},

		// 不通过
		handleNotpass() {
			this.dialogNotpass = true
		},
		handleSubmit() {
			this.$refs.notPassForm.validate(async (valid) => {
				if (valid) {
					let res = await this.updateStatus(2, this.notPassForm.reason)
					if (res.success) {
						this.$message.warning("文书已审核不通过")
						this.documentsListComputed[0].notaryPaperType !== 998 && this.basicData.prodCode === "ysf" && sendAuditNotPassReason({ orderId: this.orderId, reason: this.notPassForm.reason })
						this.dialogNotpass = false
						this.$emit("close")
					} else {
						this.$message.error(res.msg || "服务器开小差了，请稍后再试")
					}
				} else {
					return false;
				}
			});
		},

		// 全部通过
		handleAllPass() {
			this.$confirm('<p style="color:red;">需先确认合同及公证书证词无误，再进行审核通过。通过后将无法修改及审核，确定继续操作？</p>', '操作提示', {
				dangerouslyUseHTMLString: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				customClass: 'confirmClass', // 需要写在没有scope的style里面才会生效
			}).then(async () => {
				let res = await this.updateStatus(1, "")
				if (res.success) {
					this.$message.success("文书已全部审核通过")
					// 998 是合并后的
					this.documentsListComputed[0].notaryPaperType !== 998 && this.basicData.prodCode === "ysf" &&  sendAuditPassTemplate({ orderId: this.orderId })
					this.$emit("close")
				} else {
					this.$message.error(res.msg || "服务器开小差了，请稍后再试")
				}
			}).catch(() => {

			})
		},

		// 更新文书审核状态 0未审核  1审核通过  2审核不通过
		async updateStatus(auditStatus, remark) {
			let data = {
				orderId: this.orderId,
				auditStatus: auditStatus,
				remark: remark,
			}
			if (this.basicData.prodCode === "rfcw") {	// 人防车位
				return await checkParkingContractInfo(data)
			} else if (this.basicData.prodCode === "ysf") {
				return await checkingContractInfo(data)	// 一手房
			}
		},

		dialogClose() {
			this.$emit("close")
		},

		statusComputed(val) {
			const status = {
				0: { label: "未编辑", class: "info" },
				1: { label: "已编辑", class: "" },
				2: { label: "正在编辑", class: "active" },
			}
			return status[val]
		},

		changeStatus(row, status) {
			this.documentsListComputed.forEach(item => {
				if (row.id === item.id) {
					item.isEdit = status
				}
			})
		},
	},
	computed: {
		documentsListComputed() {
			// isEdit 0未编辑  1已编辑  2正在编辑
			let tempList = JSON.parse(JSON.stringify(this.documentsList))
			tempList.forEach((item, index) => {
				item.isEdit = 0
			})
			return tempList
		},
		visibleComputed: {
			get() {
				return this.visible
			},
			set() { }
		},
		visibleAndDocumentList() {
			const { visible, documentsListComputed } = this
			return { visible, documentsListComputed }
		},
	},
	watch: {
		dialogNotpass(val) {
			if (!val) {
				this.$refs.notPassForm.clearValidate()
				this.notPassForm.reason = ""
			}
		},
		visible(val) {
			if (!val) {
				this.isReady = false	// 触发wps组件的生命周期，销毁wps实例
				this.editPaper = {}
			}
		},
		async visibleAndDocumentList(watchObject) {
			if (watchObject.visible && watchObject.documentsListComputed.length) {
				this.documentsListComputed[0].isEdit = 2
				let data = await this.getViewUrlWebPath(this.documentsListComputed[0])
				if (data.success) {
					this.editPaper = this.documentsListComputed[0]
					this.jwpsUrl = data.data.wpsUrl
					this.jtoken = data.data.token
					this.isReady = true
				} else {
					this.$message.error(res.msg || "服务器开小差了，请稍后再试")
					this.isReady = false
				}
			}
		},
		// wpsIframe(val) {
		// 	if (val) {
		// 		console.log("-------初始化完成---------");
		// 		this.$emit("loadingSuccess")
		// 	}
		// },
		wpsApp(val) {
			if (val) {
				console.log("-------初始化完成---------");
				this.$emit("loadingSuccess")
			}
		},
		async editPaper(newValue, oldValue) {
			// console.log(oldValue, "--------oldValue-------", this.fileStatus);
			if (oldValue) {
				oldValue.isEdit = 1
			}

			// if (oldValue.id && this.fileStatus == 7) {
			// 	let res = await wpsTempFile(oldValue.id)
			// 	console.log("更新文档结果----", res)
			// 	this.fileStatus = ""
			// }
		}
	},
}
</script>

<style lang="less" scoped>
.audit_title {
	font-size: 18px;
	font-weight: 900;
	background: #e6f6fe;
	line-height: 40px;
	padding: 0 20px;
}
.document_title_wrapper {
	margin-top: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid #eee;
	.audit_label {
		vertical-align: middle;
		display: inline-block;
		width: 100px;
		padding: 0 20px;
		line-height: 26px;
		color: #70b603;
	}
	.audit_paper {
		vertical-align: middle;
		width: 280px;
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.active {
		color: #f59a23;
	}

	.info {
		color: #666;
	}
}

.button_wrapper {
	margin: 15px 0;
	text-align: center;
}

.document_wrapper {
	height: 800px;
	// min-height: 600px;
	// height: calc(100vh - 250px);
	background: #eee;
}
/deep/ .outside_class .el-dialog__body {
	padding: 20px;
	padding-top: 0;
	color: #333;
}
</style>

<style>
.confirmClass {
	width: 550px;
}
/* .el-dialog__wrapper {
	z-index: 2004 !important;
}
.v-modal {
	z-index: 2002 !important;
} */
</style>