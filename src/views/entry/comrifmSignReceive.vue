<template>
	<div class="container">
		<el-card shadow="always" :body-style="{ padding: '20px' }" class="main_card">
			<!-- 头部 -->
			<div class="content">
				<div class="title">
					<div>证据编号：{{evidData.evidNo}}</div>
					<el-button type="primary" size="medium" @click="handleBack">返回
					</el-button>
				</div>
			</div>
			<div class="table_content">
				<div class="btn_wrapper">
					<el-button v-if="isComfirm" type="primary" size="medium" @click="handleComfirm('all')">确认已寄达
					</el-button>
				</div>
				<div class="table_wrapper">
					<el-table :data="comfirmTaleData" border header-row-class-name="table_header"
						cell-class-name="table_cell">
						<el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
						<el-table-column label="受达达人" prop="mailEvidPersonInfoDTO.name" show-overflow-tooltip
							align="center">
						</el-table-column>
						<el-table-column label="手机号码" prop="mailEvidPersonInfoDTO.phone" align="center">
						</el-table-column>
						<el-table-column label="确认结果" prop="isConfirmed" align="center">
							<template slot-scope="{row}">
								<el-tag :type="filterType(row.isConfirmed)" size="medium">
									{{row.isConfirmed|isConfirmedFilter}}</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="最新一条物流节点" prop="emsInfoDTO.opInfo" show-overflow-tooltip align="center">
						</el-table-column>
						<el-table-column label="操作" align="center" width="200">
							<template slot-scope="{row}">
								<div v-if="row.isConfirmed==0">
									<el-link type="primary" style="margin-right:10px;"
										@click="handleComfirm('single',row)">
										确认已寄达</el-link>
									<el-link type="primary" @click="handleOpenDialog(row)">确认被退回</el-link>
								</div>
								<div v-else>
									<span>-</span>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</el-card>

		<!-- 上传退回图片 -->
		<el-dialog title="上传退回包裹的图片" :visible.sync="dialogVisible" width="650px">
			<div class="upload_wrapper">
				<div class="u_title">文件上传：</div>
				<div>
					<el-upload action :on-change="handleChange" :file-list="fileList" :on-remove="handleRemove"
						accept="image/jpeg" :http-request="uploadFile">
						<el-button size="default" plain>点击上传</el-button>
						<div slot="tip" class="el-upload__tip">支持扩展名：.jpg.jpeg格式，请将所上传的文件转为所支持格式</div>
					</el-upload>
				</div>
			</div>
			<span slot="footer">
				<el-button @click="dialogVisible= false">取消</el-button>
				<el-button type="primary" @click="handleSendBack">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	getMailEvidReceivePersonInfo,
	updateEvidMail,
	getCloudDateil,
	mailEvidExpressInfo,
	updateMailConfirmExpressInfo,
	signSendFileUpload,
	saveMailPicture
} from '../../api/cloudMail'
export default {
	filters: {
		isConfirmedFilter(val) {
			switch (val) {
				case 0:
					return "未确认"
				case 1:
					return "已确认"
				case 2:
					return "已退回"
			}
		}
	},
	data() {
		return {
			evidId: "",			// 证据id
			id: "",
			evidMailId: "",
			evidData: "",

			comfirmTaleData: [],
			dialogVisible: false,
			fileList: [],
			clickRow: null,
		};
	},
	computed: {
		isComfirm() {
			return this.comfirmTaleData.some(item => {
				return item.isConfirmed == 0
			})
		}
	},
	created() {
		this.evidId = this.$route.query.evidId
		this.id = this.$route.query.id
		this.evidMailId = this.$route.query.evidMailId
		this.getPersonData()
		this.getMailData()
		this.getMailEvidExpressInfo()
	},
	methods: {
		// 获取详情
		async getMailData() {
			var data = { evidId: this.id }
			let res = await getCloudDateil(data)
			// console.log(res);
			if (res.success) {
				this.evidData = res.data
			}
		},

		// 查询证据物流送达信息
		async getMailEvidExpressInfo() {
			let res = await mailEvidExpressInfo(this.id)
			// console.log("查询证据物流送达信息--->", res);

			if (res.success && res.data) {
				this.comfirmTaleData = res.data
			}
		},

		// 获取收件人/寄件人
		async getPersonData() {
			let data = {
				evidMailId: this.evidMailId,
				personType: this.materialCode == "2061" ? 1 : 2,	// 2061获取寄件人  2071获取收件人
			}
			let res = await getMailEvidReceivePersonInfo(data)
			// console.log("收件人/寄件人", res);
			this.personData = res.data
		},

		// 更新状态
		async updateStatus(val) {
			let data = {
				id: this.evidMailId,
				evidStatus: val
			}
			let res = await updateEvidMail(data)
			if (res.success) {
				// this.$router.go(-1)
			}
		},

		// 上传图片
		async uploadFile(file) {
			console.log("上传图片--------", file);

			const formData = new FormData()
			formData.append('orderId', this.evidMailId)
			formData.append('file', file.file)
			// const URL = window.URL || window.webkitURL
			// const imgURL = URL.createObjectURL(file.file)
			// console.log(imgURL);

			let res = await signSendFileUpload(formData)

			console.log("上传图片结果", res);
			if (res.success) {
				console.log(file.file);

				this.fileList.forEach((item, index) => {
					if (file.file.uid == item.uid) {
						Object.assign(item, {
							materialCode: "2081",
							materialName: res.data.originalFilename,
							tempId: res.data.tempId,
							materialBucket: JSON.stringify({
								bucketName: res.data.bucketName,
								objectName: res.data.objectName
							}),
							mailEvidPersonId: this.clickRow.mailEvidPersonId,
							type: res.data.originalFilename.substr(res.data.originalFilename.lastIndexOf('.') + 1).toLocaleLowerCase(),
							bucketName: res.data.bucketName,
							objectName: res.data.objectName,
						})
					}
				})
			}
		},

		// 确认退回弹窗
		handleOpenDialog(row) {
			console.log(row);
			this.clickRow = row
			this.dialogVisible = true
		},

		// 确认退回
		async handleSendBack() {
			if (this.fileList.length == 0) {
				this.$message.warning("请上传退回包裹的图片")
				return
			}

			let imageData = {
				evidMailId: this.evidMailId,
				mailEvidMaterialDTOS: this.fileList
			}
			let result = await saveMailPicture(imageData)
			if (!result.success) {
				this.$message.error("保存图片失败，请稍后再试")
				return
			}

			let data = [{
				id: this.clickRow.id,
				evidMailId: this.evidMailId,
				isConfirmed: 2, //1确认已寄达 2确认被退回
			}]
			let res = await updateMailConfirmExpressInfo(data)
			console.log("确认已退回", res);
			if (res.success) {
				this.$message.success("退回成功")
				this.dialogVisible = false
				this.getMailEvidExpressInfo()
				return
			}
			this.$message.error(res.msg || "确认退回失败，请稍后再试")
		},

		// 删除图片
		handleRemove(file, fileList) {
			this.fileList = fileList
		},

		// 选择改变
		handleChange(file, fileList) {
			this.fileList = fileList
		},

		// 确认已寄达
		handleComfirm(type, row) {
			// console.log(type);
			this.clickRow = row
			this.$confirm(`<p style='color:red;'>物流未完结之前就确定快递寄达，将导致邮寄送达电子数据信息不完整从而影响证据效力，因此，请查看系统物流最后节点情况后，谨慎操作本步骤。</p>`, '确定运单号的物流显示已签收/代收/收件人已取邮件？', {
				confirmButtonText: '确定',
				dangerouslyUseHTMLString: true,
				showClose: false,
				type: "warning"
			}).then(async () => {
				let data = []
				if (type == "single") {	// 单个确认
					data.push({
						id: this.clickRow.id,
						evidMailId: this.evidMailId,
						isConfirmed: 1, //1确认已寄达 2确认被退回
					})
				} else {
					for (var i = 0; i < this.comfirmTaleData.length; i++) {	// 全部确认
						if (this.comfirmTaleData[i].isConfirmed == 2) {
							continue;
						}
						data.push({
							id: this.comfirmTaleData[i].id,
							evidMailId: this.evidMailId,
							isConfirmed: 1, //1确认已寄达 2确认被退回
						})
					};
				}

				let res = await updateMailConfirmExpressInfo(data)
				console.log("确认已寄达", res);
				if (res.success) {
					this.$message.success("确认成功")
					this.getMailEvidExpressInfo()
					return
				}

				this.$message.error(res.msg || "确认寄达失败，请稍后再试")
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作'
				});
			});
		},

		filterType(val) {
			switch (val) {
				case 0:
					return "warning"
				case 1:
					return "success"
				case 2:
					return "danger"
			}
		},

		// 返回
		handleBack() {
			this.$router.go(-1)
		},
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.fileList = []
			}
		}
	},
}
</script>

<style lang="less" scoped>
.upload_wrapper {
	display: flex;
	.u_title {
		line-height: 32px;
		font-size: 16px;
		margin-right: 10px;
	}
}
.container {
	padding: 20px;
	color: #333;
}
.main_card {
	min-height: calc(100vh - 100px);
}
.content {
	.title {
		font-size: 18px;
		margin-bottom: 30px;
		font-weight: bold;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.se_title {
		font-size: 18px;
		line-height: 50px;
		background: #f2f2f2;
		font-weight: bold;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 0 0 0 10px;
	}
}
.table_content {
	margin-top: 30px;
	.btn_wrapper {
		display: flex;
		flex-direction: row-reverse;
	}
	.table_wrapper {
		margin-top: 30px;
	}
}
</style>
<style >
.el-message-box {
	width: 600px;
	padding: 10px;
}
.table_header {
	color: #666;
}
.table_cell {
	height: 48px;
	box-sizing: border-box;
	padding: 5px 0 !important;
}
</style>
