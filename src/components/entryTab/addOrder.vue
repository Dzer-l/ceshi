<template>
	<div>
		<!-- 新增订单 -->
		<el-dialog title="新增订单" :visible.sync="visible" width="1180px" center custom-class="add_dialog"
			:close-on-click-modal="false" :before-close="beforeClose">
			<div class="header_button">
				<div>
					<span>公证事项：</span>
					<el-select style="width: 230px;" size="medium" v-model="notaryCode" placeholder="请选择公证事项"
						:filter-method="dataFilter" filterable>
						<el-tabs v-model="activeName" class="notarizedEventTabs"
							:class="activeName==='first'?'firstActive':''" @tab-click="tabsChange">
							<el-tab-pane v-for="(item,index) of notarizedEventList" :key="index"
								:label="item.tabs_label" :name="item.tabs_name">
								<div class="option-box">
									<el-option v-for="optionItem in item.option_list" :key="optionItem.notaryCode"
										:label="optionItem.notaryName" :value="optionItem.notaryCode">
										<el-tooltip v-if="optionItem.notaryName.length>6" class="item" effect="dark"
											:content="optionItem.notaryName" placement="top">
											<div>{{ optionItem.notaryName }}</div>
										</el-tooltip>
									</el-option>
								</div>
							</el-tab-pane>
						</el-tabs>
					</el-select>
				</div>
				<div>
					<el-button type="primary" size="medium" @click="handleAddproposer">新增申请人</el-button>
				</div>
			</div>

			<div class="table_wrapper">
				<el-table :data="proposerList" border stripe header-row-class-name="table_header">
					<el-table-column prop="realName" label="申请人姓名" align="center"></el-table-column>
					<el-table-column label="性别" align="center">
						<template slot-scope="{row}">
							<div>{{ row.gender | filterGender }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="birthday" label="出生日期" align="center"></el-table-column>
					<el-table-column label="证件类型" align="center" show-overflow-tooltip>
						<template slot-scope="{row}">
							<div style="overflow: hidden;text-overflow: ellipsis;">
								{{ row.cardType | filterCardType }}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="cardNum" label="证件号码" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column label="证件有效期" align="center">
						<template slot-scope="{row}">
							<div>{{ row.expiryDate || "-" }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="{$index,row}">
							<div>
								<el-link type="primary" @click="handleEdit($index,row)">编辑</el-link>
								<el-link type="danger" @click="handleDelete($index,row)">删除</el-link>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div slot="footer">
				<el-button style="width: 100px;" size="medium" @click="handleCancelOrder">取 消</el-button>
				<el-button style="width: 100px;" size="medium" type="primary" @click="handleAddOrder">提交订单</el-button>
			</div>
		</el-dialog>

		<!-- 新增/编辑申请人 -->
		<el-dialog :title="textComputed" :visible.sync="proposerVisible" width="1180px" center top="10vh"
			custom-class="add_dialog proposer_dialog" append-to-body :close-on-click-modal="false">
			<div class="header_title">{{ textComputed }}</div>

			<div class="proposer_form">
				<el-form :model="proposerForm" ref="proposerForm" :rules="proposerRules" label-width="80px"
					size="normal" label-position="top">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="姓名：" prop="realName">
								<el-input size="medium" v-model="proposerForm.realName" placeholder="请输入姓名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="性别：" prop="gender">
								<el-select size="medium" v-model="proposerForm.gender" placeholder="请选择性别"
									style="width: 100%;">
									<el-option label="男" value="1"></el-option>
									<el-option label="女" value="2"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="出生日期：" prop="birthday">
								<el-date-picker size="medium" v-model="proposerForm.birthday" type="date"
									placeholder="请选择出生日期" style="width: 100%;" value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="证件类型：" prop="cardType">
								<el-select size="medium" v-model="proposerForm.cardType" placeholder="请选择证件类型"
									style="width: 100%;" @change="changeCardType">
									<el-option v-for="item in cardOptions" :key="item.certCode" :label="item.certName"
										:value="item.certCode">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="证件号码：" prop="cardNum">
								<el-input size="medium" v-model="proposerForm.cardNum" placeholder="请输入证件号码"
									maxlength="20"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item v-if="needExpiryDate" label="证件有效期：" prop="expiryDate">
								<el-date-picker size="medium" v-model="proposerForm.expiryDate" type="date"
									placeholder="请选择证件有效期" style="width: 100%;" value-format="yyyy-MM-dd">
								</el-date-picker>
							</el-form-item>
							<el-form-item v-else label="申请人手机号（省略国家区号）：" prop="mobile">
								<el-input size="medium" v-model="proposerForm.mobile" placeholder="请输入申请人手机号"
									maxlength="11"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row :gutter="20" v-if="needExpiryDate">
						<el-col :span="8">
							<el-form-item label="申请人手机号（省略国家区号）：" prop="mobile">
								<el-input size="medium" v-model="proposerForm.mobile" placeholder="请输入申请人手机号"
									maxlength="11"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<div class="upload_wrapper upload_content el-upload-list el-upload-list--picture-card">
				<div v-for="(item, index) in needUploadList" :key="item.materialCode + index">
					<div v-if="item.imageUrl" class="el-upload-list__item">
						<img class="el-upload-list__item-thumbnail" :src="item.imageUrl" alt="">
						<el-tooltip :content="item.materialName" placement="top" effect="dark">
							<a class="el-upload-list__item-name">{{ item.materialName }}</a>
						</el-tooltip>
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-preview edit_text"
								@click="handlePreview(item, index)">查看</span>
							<el-upload style="display: inline-block;" action :show-file-list="false"
								:data="{item, index, type:'edit' }" :http-request="handleUploadImg">
								<span class="el-upload-list__item-delete edit_text">修改</span>
							</el-upload>
						</span>
					</div>
					<div v-else>
						<el-upload class="upload_card_icon" action list-type="picture-card"
							:on-preview="handlePictureCardPreview" :on-remove="handleRemove" :show-file-list="false"
							:http-request="handleUploadImg" :data="{item, index}">
							<span class="upload_icon">
								<i class="el-icon-plus"></i>
							</span>
						</el-upload>
						<div class="label_tips">{{ item.materialName }}</div>
					</div>
				</div>
			</div>

			<div slot="footer">
				<el-button size="medium" @click="handleCalcelAddProposer">取 消</el-button>
				<el-button size="medium" type="primary" @click="handleComfirmAddProposer">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	orgHotNotaryTopList,
	orgNotaryFirstCharacterMaps,
	certificateType,
	productionRoleCertMaterial,
	singleFileUploadRemote,
	remoteVideoAcceptanceOrderSubmit,
	ocrIdCard,
} from '../../api/addOrder'
import { filterCardType } from '../../filters/index'
const moment = require("moment")
export default {
	props: ['visible'],
	filters: {
		filterGender(val) {
			const gender = {
				1: "男",
				2: "女",
			}
			return gender[val]
		},
		filterCardType
	},
	data() {
		return {
			selectValue: "",	// 选中的公证事项
			notaryCode: "",		// 公证事项
			proposerList: [],	// 申请人列表

			proposerVisible: false,
			proposerForm: {
				realName: "",
				gender: "",
				birthday: "",
				cardType: "",
				cardNum: "",
				expiryDate: "",
				mobile: "",
			},
			proposerRules: {
				realName: [
					{ required: true, message: '请输入姓名', trigger: ["blur", "change"] },
					// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
				gender: [
					{ required: true, message: '请选择性别', trigger: "blur" },
				],
				birthday: [
					{ required: true, message: '请选择出生日期', trigger: "blur" },
				],
				cardType: [
					{ required: true, message: '请选择证件类型', trigger: "blur" },
				],
				cardNum: [
					{ required: true, message: '请输入证件号码', trigger: ["blur", "change"] },
				],
				expiryDate: [
					{ required: true, message: '请选择证件有效日期', trigger: 'blur' },
				],
				mobile: [
					{ required: true, message: '请输入申请人手机号', trigger: 'blur' },
					// { pattern: /^[1][3-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
					{ pattern: /^[0-9]*$/, message: '请输入正确的手机号', trigger: 'blur' }
				],
			},


			fileList: [],	// 上传成功的文件列表


			orgId: "",
			notarizedEventList: [],		// 公证事项列表
			activeName: "first",		// 公证事项列表激活tab
			lastActive: "",				// 上一个选中的tab
			cardOptions: [],			// 证件列表
			needUploadList: [],			// 需要上传的证件类型
			action: "",					// 标记添加/编辑
			actionIndex: "",			// 申请人index
			needExpiryDate: false,		// 需要过期时间
			selectCardType: "",
			backupItem: {}
		}
	},
	computed: {
		textComputed() {
			return this.action === "edit" ? "编辑申请人" : "添加申请人"
		}
	},
	created() {
		this.orgId = JSON.parse(sessionStorage.getItem("org_id"))
		this.getNotaryList()
		this.getCertificateType()
	},
	methods: {
		// 获取公证事项列表
		async getNotaryList() {
			let res = await orgHotNotaryTopList(this.orgId)
			if (res.success && res.data) {
				this.notarizedEventList.push({
					tabs_label: '热门',
					tabs_name: 'first',
					option_list: res.data
				})
			}

			let ret = await orgNotaryFirstCharacterMaps(this.orgId)
			if (ret.success && ret.data) {
				let notaryList = ret.data
				for (const key in notaryList) {
					this.notarizedEventList.push({
						tabs_label: key,
						tabs_name: key,
						option_list: JSON.parse(JSON.stringify(notaryList[key]))
					})
				}

				this.notarizedEventList.push({
					tabs_label: '#',
					tabs_name: 'last',
					option_list: []
				})
			}
		},

		// select 过滤器
		dataFilter(val) {
			const filtrationArray = []
			for (const x of this.notarizedEventList) {
				if (x.tabs_label === '#') {
					x.option_list.length = 0
				}
			}
			if (val !== '') {
				this.activeName = 'last'
				for (const i of this.notarizedEventList) {
					if (i.tabs_label !== '热门') {
						for (const j of i.option_list) {
							if (j.notaryName.includes(val)) {
								filtrationArray.push(j)
							}
						}
					}
				}
				for (const x of this.notarizedEventList) {
					if (x.tabs_label === '#') {
						x.option_list = JSON.parse(JSON.stringify(filtrationArray))
					}
				}
			} else {
				this.activeName = this.lastActive ? this.lastActive : 'first'
			}
		},

		tabsChange(tab, event) {
			this.lastActive = tab.label
		},

		// 获取证件类型列表
		async getCertificateType() {
			let res = await certificateType({ prodCode: "1001" })
			if (res.success && res.data) {
				this.cardOptions = res.data
			}
		},

		// 切换证件类型
		async changeCardType() {
			let selectCardType = this.cardOptions.find(i => {
				return i.certCode === this.proposerForm.cardType
			})

			// 台湾居民来往大陆通行证添加有效期 210924
			if (selectCardType.certCode === "119") {
				selectCardType.needExpiryDate = 1
			}

			this.proposerForm.expiryDate = ""
			this.selectCardType = selectCardType
			this.needExpiryDate = !!selectCardType.needExpiryDate
			let cardId = selectCardType.id
			let res = await productionRoleCertMaterial({
				orgProductionRoleCertId: cardId
			})

			if (res.success && res.data) {
				let needDouble = ['118', '119', '130', '131']
				res.data.forEach((item, index) => {
					item.imageUrl = ""
					item.proposerMaterial = {}
				})
				if (needDouble.includes(selectCardType.certCode)) {
					res.data.push({
						"id": 597,
						"orgMaterialId": 1342,
						"orgProductionRoleCertId": 257,
						"needStatus": 1,
						"materialCode": "1006",
						"materialName": "通行证（正面照+反面照）",
						imageUrl: "",
						proposerMaterial: {}
					})
				}
				this.needUploadList = res.data
			}
		},

		// 保存订单
		async handleAddOrder() {
			// if (!this.notaryCode) {
			// 	this.$message.warning("请先选择公证事项")
			// 	return
			// }

			if (this.proposerList.length === 0) {
				this.$message.warning("请添加申请人")
				return
			}

			// 删除多余数据
			this.proposerList.forEach(item => {
				delete item.needUploadList
			})

			let data = {
				bidType: 1,
				proCode: 1001,
				notaryCode: this.notaryCode,
				orderProposerReList: this.proposerList,
			}

			// console.log(data);
			let res = await remoteVideoAcceptanceOrderSubmit(data)

			// console.log(res, '=========');

			if (res.success && res.data) {
				this.$message.success("新增订单成功")
				this.$emit("update:visible", false)
				this.$router.push({
					name: 'delegateInfo',
					query: { id: res.data.id }
				})
				return
			}
			this.$message.error(res.data || "新增订单失败，请稍后再试")
		},

		handleCancelOrder() {
			if (this.proposerList.length > 0) {
				this.$confirm('<p style="color:red;">填写的内容将清空，确定取消？</p>', '操作提示', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.$emit("update:visible", false)
				}).catch(() => {

				})
			} else {
				this.$emit("update:visible", false)
			}
		},

		// 新增申请人
		async handleAddproposer() {
			this.action = "add"
			this.proposerVisible = true
		},

		// 上传文件
		async handleUploadImg(e) {
			let { file } = e
			const fileType = file.type // 文件类型
			const typeList = ['image/jpeg', 'image/jpg', 'image/png']
			const isImage = typeList.indexOf(fileType) !== -1 // 限制格式
			const isLt15M = file.size / 1024 / 1024 < 15 // 文件大小
			let item = e.data.item
			let copyItem = JSON.parse(JSON.stringify(item))

			// console.log(item);
			// console.log(item);
			// console.log(index);
			if (!isImage) {
				this.$message.error('请上传jpg、jpeg、png格式的文件!')
				return
			}

			if (!isLt15M) {
				this.$message.error('上传图片的大小应小于15M')
				return
			}

			const formData = new FormData()
			formData.append('file', file)
			formData.append('fileType', 'order-material') // 文件流

			const URL = window.URL || window.webkitURL

			let res = await singleFileUploadRemote(formData)
			if (!res.success) {
				this.$message.error(res.msg || "上传失败，请稍后再试")
				return
			}

			if (res.success && res.data) {
				let imageUrl = URL.createObjectURL(file) // 本地url
				item.imageUrl = imageUrl
				item.proposerMaterial = {
					materialCode: item.materialCode,
					materialFile: JSON.stringify(res.data)
				}

				if (item.materialCode === "1007" && e.data.type !== "edit") {	// 护照可上传多张
					this.needUploadList.push(copyItem)
				}
			}

			// 身份证正面ocr
			if (this.selectCardType.certCode === "111" && item.materialCode === "1001") {
				formData.append("idType", 2)
				this.getOcrInfo(formData)
			}
		},

		// 身份证正面ocr
		async getOcrInfo(fileData) {
			let res = await ocrIdCard(fileData)
			// console.log(res);

			if (res.success && res.data) {
				const result = res.data.data
				if (result.card) {
					for (const item of result.card) {
						if (Object.keys(item)[0] === "姓名") {
							this.proposerForm.realName = item["姓名"]
						}
						if (Object.keys(item)[0] === "性别") {
							this.proposerForm.gender = item['性别'] === "男" ? '1' : '2'
						}
						if (Object.keys(item)[0] === "公民身份号码") {
							this.proposerForm.cardNum = item['公民身份号码']
						}
						if (Object.keys(item)[0] === "出生") {
							let birthdayDate = item['出生'].replace(/年/, "-").replace(/月/, "-").replace(/日/, "")
							this.proposerForm.birthday = moment(birthdayDate).format("YYYY-MM-DD")
						}
					}
				}
			}
		},

		// 编辑申请人
		handleEdit(index, row) {
			console.log(row);
			this.actionIndex = index
			this.action = "edit"
			this.backupItem = JSON.parse(JSON.stringify(row))
			this.proposerForm = row
			this.needUploadList = row.needUploadList
			this.needExpiryDate = !!row.expiryDate
			this.proposerVisible = true
		},

		// 删除申请人
		handleDelete(index, row) {
			this.$confirm('<p style="color:red;">删除后将不可恢复，确定删除？</p>', '操作提示', {
				dangerouslyUseHTMLString: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.proposerList.splice(index, 1);
			}).catch((err) => {
				console.log(err);
			})
		},

		// 取消添加申请人
		handleCalcelAddProposer() {
			this.proposerVisible = false
			if (this.action === "edit") {
				this.$set(this.proposerList, this.actionIndex, this.backupItem)
			}
		},

		// 确认添加
		handleComfirmAddProposer() {
			this.$refs.proposerForm.validate((valid) => {
				if (valid) {
					let orderProposerMaterial = []
					this.needUploadList.forEach((item, index) => {
						// console.log(item);
						if (item.proposerMaterial.materialCode) {
							orderProposerMaterial.push(JSON.parse(JSON.stringify(item.proposerMaterial)))
						}
					})
					let proposer = {
						...this.proposerForm,
						roleCode: this.selectCardType.roleCode,
						needUploadList: JSON.parse(JSON.stringify(this.needUploadList)),
						orderProposerMaterial,
					}

					if (this.action === "add") {
						this.proposerList.push(proposer)
					} else if (this.action === "edit") {
						this.$set(this.proposerList, this.actionIndex, proposer)
					}
					this.proposerVisible = false
				} else {
					return false
				}
			})
		},

		// 预览图片
		handlePictureCardPreview() {

		},

		// 删除图片
		handleRemove() {

		},

		handlePreview(file) {
			this.$store.commit('app/CHANGE_IMAGE', [file.imageUrl])
			// const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			// const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLocaleLowerCase()
			// if (imglist.includes(fileType)) {
			// 	this.$store.commit('app/CHANGE_IMAGE', [file.url])
			// 	return
			// }
		},

		handleDeleteImage(image) {

		},

		beforeClose() {
			this.$emit("update:visible", false)
		}

	},
	watch: {
		proposerVisible(val) {
			if (!val) {
				this.proposerForm = {
					realName: "",
					gender: "",
					birthday: "",
					cardType: "",
					cardNum: "",
					expiryDate: "",
					mobile: "",
				}
				this.$refs.proposerForm.clearValidate()
				this.needUploadList = []
				this.needExpiryDate = false
			} else {
				this.$nextTick(() => {
					this.$refs.proposerForm.clearValidate()
				})
			}
		},
		visible(val) {
			if (!val) {
				this.proposerList = []
				this.notaryCode = ""
			}
		}
	},
}
</script>

<style lang="less" scoped>
/deep/.add_dialog {
	.header_button {
		display: flex;
		justify-content: space-between;
	}

	.el-dialog__title {
		font-size: 20px;
		font-weight: 700;
		color: rgba(0, 0, 0, 0.85);
	}

	.table_wrapper {
		margin-top: 24px;

		.table_header > th {
			background: #e6f6fe;
			color: rgba(#000, 0.65);
		}

		.el-link {
			margin: 0 5px;
		}
	}
}
/deep/.proposer_dialog {
	.el-dialog__body {
		padding: 25px 30px 0;
	}
	.header_title {
		line-height: 54px;
		background: #e6f6fe;
		font-weight: 700;
		color: #333;
		padding-left: 20px;
	}

	.proposer_form {
		margin-top: 20px;
		.el-form-item {
			margin-bottom: 10px;
		}
		.el-form-item__label {
			padding-bottom: 0;
		}
	}

	.upload_wrapper {
		padding: 40px 40px 30px 30px;

		.upload_icon {
			width: 56px;
			height: 56px;
		}

		.upload_card_icon {
			margin: 0 20px 0 0;
		}
		.label_tips {
			text-align: center;
			margin-top: 12px;
			margin-right: 20px;
		}
	}
}
.upload_content {
	display: flex;
	flex-wrap: wrap;
}
/deep/ .el-upload--picture-card {
	height: 140px;
	width: 140px;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item-name {
	display: block;
}
/deep/ .el-upload-list__item.is-success .el-upload-list__item-status-label {
	display: none;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
	overflow: inherit;
	margin-bottom: 20px;
	margin-right: 20px;
	width: 140px;
	height: 140px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail,
/deep/ .el-upload-list--picture-card .el-upload-list__item-actions {
	border-radius: 6px;
}
/deep/ .el-upload-list__item-name {
	width: 148px;
	text-align: center;
	padding-right: 15px;
}
/deep/ .edit_text {
	font-size: 16px !important;
	padding: 0 5px;
	color: #fff !important;
	&:hover {
		color: #409eff;
	}
}
/deep/ .el-tabs__item {
	font-size: 14px !important;
	font-weight: 500 !important;
}
</style>


<style>
.el-image-viewer__close {
	color: #fff;
}
.option-box {
	display: flex !important;
	flex-wrap: wrap;
	max-height: 180px;
	overflow-y: auto;
}
.option-box::-webkit-scrollbar {
	width: 4px;
}
.option-box::-webkit-scrollbar-thumb {
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.2);
}
.option-box > li {
	width: 25%;
	padding: 0 11px;
}
.option-box > li > div {
	overflow: hidden;
	text-overflow: ellipsis;
}
.option-box > li:hover {
	border-radius: 4px;
	background-color: #409eff;
	color: #fff;
}
.notarizedEventTabs {
	padding: 0 15px;
	max-width: 500px;
}
.notarizedEventTabs .el-tabs__item {
	padding: 0 5px;
}
.notarizedEventTabs .el-tabs__nav {
	padding: 0 10px;
}
.notarizedEventTabs .el-tabs__active-bar {
	left: 10px;
	width: 9px;
	padding: 0 5px;
}
.firstActive .el-tabs__active-bar {
	width: 28px !important;
}
</style>