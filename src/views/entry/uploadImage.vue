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
				<div class="se_title">{{needMaterialTips[0].materialName}}</div>
			</div>

			<!-- 签收上传 -->
			<div v-if="materialCode==2061">
				<div class="up_content">
					<div class="th_title">{{needMaterialTips[0].materialName}}</div>
					<div class="tips">{{needMaterialTips[0].materialDesc}}</div>
					<div class="up_icon el-upload-list el-upload-list--picture-card upload_content">
						<div class="el-upload-list__item" v-for="(image, imageIndex) in fileList" :key="imageIndex">
							<img class="el-upload-list__item-thumbnail" :src="image.url" alt="">
							<el-tooltip :content="image.materialName" placement="top" effect="dark">
								<a class="el-upload-list__item-name">{{image.materialName}}</a>
							</el-tooltip>
							<span class="el-upload-list__item-actions">
								<span class="el-upload-list__item-preview" @click="handlePreview(image)">
									<i class="el-icon-zoom-in"></i>
								</span>
								<span class="el-upload-list__item-delete">
									<i class="el-icon-delete" @click="handleDelete(image)"></i>
								</span>
							</span>
						</div>

						<el-upload action list-type="picture-card" :on-preview="handlePictureCardPreview"
							:on-remove="handleRemove" :file-list="fileList" multiple :http-request="uploadFile"
							:limit="50" :on-exceed="handleExceed" :on-change="handleChange" accept="image/jpeg"
							:before-upload="beforeUpload" :show-file-list="false">
							<i class="el-icon-plus"></i>
						</el-upload>
					</div>
				</div>
			</div>

			<!-- 寄函上传 -->
			<div v-if="materialCode==2071">
				<div class="up_content" v-for="(person) in personData" :key="person.id">
					<div class="th_title">{{person.name}}</div>
					<div class="tips">{{needMaterialTips[0].materialDesc}}</div>
					<div class="up_icon el-upload-list el-upload-list--picture-card upload_content">
						<div class="el-upload-list__item" v-for="(image, imageIndex) in uploadImageComputed(person.id)"
							:key="imageIndex">
							<img class="el-upload-list__item-thumbnail" :src="image.url" alt="">
							<el-tooltip :content="image.materialName" placement="top" effect="dark">
								<a class="el-upload-list__item-name">{{image.materialName}}</a>
							</el-tooltip>
							<span class="el-upload-list__item-actions">
								<span class="el-upload-list__item-preview" @click="handlePreview(image)">
									<i class="el-icon-zoom-in"></i>
								</span>
								<span class="el-upload-list__item-delete">
									<i class="el-icon-delete" @click="handleDelete(image)"></i>
								</span>
							</span>
						</div>

						<el-upload action list-type="picture-card" :data="person" :file-list="fileList" multiple
							:http-request="uploadFile" :limit="50" :on-exceed="handleExceed" :on-change="handleChange"
							accept="image/jpeg" :before-upload="beforeUpload" :show-file-list="false">
							<i class="el-icon-plus"></i>
						</el-upload>
						<!-- <el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl">
						</el-dialog> -->
					</div>
				</div>
			</div>

			<!-- 按钮 -->
			<div class="button_wrap">
				<el-button type="primary" style="margin-right:20px;" @click="handleSubmit">提交证据</el-button>
				<el-button plain @click="handleBack">返回</el-button>
			</div>

			<!-- 二维码 -->
			<div class="code_wrapper">
				<!-- <el-tooltip class="item" effect="dark" content="使用手机扫一扫上传" placement="top"> -->
				<div class="code_tranform">
					<div class="code">
						<el-popover placement="bottom" width="180" trigger="hover" :close-delay="50"
							popper-class="popper_class">
							<div style="margin:0 auto;text-align:center;">
								<img style="width: 160px; height: 160px" :src="imgUrl">
								<div style="font-size:14px;">手机扫一扫上传材料</div>
							</div>
							<img slot="reference" :src="imgUrl">
						</el-popover>
					</div>
				</div>
				<!-- </el-tooltip> -->
				<div class="upload_tips">使用手机<br />扫一扫上传</div>
			</div>
			<!-- <el-dialog :visible.sync="codeDialogVisible" width="400px" custom-class="code_class">
				<img class="code_preview" width="100%" :src="imgUrl">
			</el-dialog> -->
		</el-card>
	</div>
</template>

<script>
import {
	getEvidSignSendNeedMaterial,
	signSendFileUpload,
	getMailEvidReceivePersonInfo,
	saveMailPicture,
	updateEvidMail,
	getCloudDateil,
	evidSignUploadQrcode,
	getH5FileStream,
	delH5File
} from '../../api/cloudMail'
export default {
	data() {
		return {
			dialogImageUrl: '',
			dialogVisible: false,
			fileList: [],
			materialCode: "",	// 2061签收图片； 2071寄函图片
			evidId: "",			// 证据id
			id: "",
			evidMailId: "",
			needMaterialTips: [{
				materialName: "",
				materialDesc: "",
			}],	// 上传提示
			personData: [],	// 收件人/寄件人信息
			evidData: "",
			imgUrl: "",
			// codeDialogVisible: false,
			frequency_astrict: 5,

		};
	},
	created() {
		this.materialCode = this.$route.query.materialCode
		this.evidId = this.$route.query.evidId
		this.id = this.$route.query.id
		this.evidMailId = this.$route.query.evidMailId
		this.getNeedMaterial()
		this.getPersonData()
		this.getMailData()
		this.getEvidSignUploadQrcode()
	},
	methods: {
		// 获取上传二维码
		async getEvidSignUploadQrcode() {
			let websocket
			let data = {
				url: process.env.VUE_APP_BASE_WEBSOCKET_PATH,
				evidId: this.evidId,
				materialCode: this.materialCode
			}
			let res = await evidSignUploadQrcode(data)

			// console.log("获取上传二维码", res);
			this.getImageUrl(res)

			var that = this
			if ('WebSocket' in window) {
				websocket = new WebSocket(process.env.VUE_APP_BASE_WEBSOCKET_WSS + '/websocket/' + this.evidMailId)
			}

			websocket.onopen = function () {
				console.log('连接成功')
			}

			websocket.onclose = function () {
				that.frequency_astrict = that.frequency_astrict - 1
				console.log('退出连接')
				if (that.$route.name == 'uploadImage' && that.frequency_astrict) {
					that.getEvidSignUploadQrcode(data)
				}
			}

			websocket.onmessage = async function (event) {
				console.log("收到消息" + event.data);
				if (event.data !== '连接成功') {
					var fileDTO = JSON.parse(event.data)
					if (fileDTO.isDel && fileDTO.objectName) {	// 删除文件
						console.log("删除文件====>", fileDTO);

						that.fileList.forEach((item, index) => {
							if (item.objectName == fileDTO.objectName) {
								that.fileList.splice(index, 1)
							}
						})

						// for (let index = 0; index < that.materialTips.length; index++) {
						// 	if (that.materialTips[index].list.length > 0) {
						// 		for (let index2 = 0; index2 < that.materialTips[index].list.length; index2++) {
						// 			if (that.materialTips[index].list[index2].objectName == fileDTO.objectName) {
						// 				that.materialTips[index].list.splice(index2, 1)
						// 			}
						// 		}
						// 	}
						// }

					} else {	// 添加文件
						let file = {
							bucketName: fileDTO.bucketName,
							encryptKey: null,
							tempId: fileDTO.tempId,
							materialCode: fileDTO.materialCode,
							materialName: fileDTO.originalFilename,
							materialBucket: JSON.stringify({
								bucketName: fileDTO.bucketName,
								objectName: fileDTO.objectName
							}),
							objectName: fileDTO.objectName,
							originalFilename: fileDTO.originalFilename,
							rename: fileDTO.rename,
							type: fileDTO.originalFilename.substr(fileDTO.originalFilename.lastIndexOf('.') + 1).toLocaleLowerCase(),
							url: '',
							evidId: that.evidId,
							mailEvidPersonId: fileDTO.proposerId,
							personId: fileDTO.proposerId,
							name: fileDTO.originalFilename,
						}

						if (that.getFileType(file.originalFilename) === 'pdf') {
							file.url = require('@/assets/imgs/pdf.png')
							file.type = 'pdf'
						} else if (
							that.getFileType(file.originalFilename) === 'excel'
						) {
							file.url = require('@/assets/imgs/xls.png')
							file.type = 'xlsx'
						} else if (that.getFileType(file.originalFilename) === 'word') {
							file.url = require('@/assets/imgs/word.png')
							file.type = 'doc'
						} else if (that.getFileType(file.originalFilename) === 'image') {
							let res = await getH5FileStream(file)

							if (res.success && res.data) {
								file.url = that.dataURItoBlob("data:image/jpeg;base64," + res.data)
								// file.url = 'data:image/jpeg;base64,' + res.data
							}
						}

						console.log("添加文件===>", file);
						that.fileList.push(file)

						// for (let index = 0; index < that.materialTips.length; index++) {
						// 	if (that.materialTips[index].materialCode === file.materialCode) {
						// 		that.materialTips[index].list.push(file)
						// 	}
						// }
					}
				}
			}

			websocket.onerror = function () {
				console.log('连接出错')
			}

		},

		// 判断文件的类型
		getFileType(fileName) {
			// 后缀获取
			let suffix = ''
			// 获取类型结果
			let result = ''
			try {
				const flieArr = fileName.split('.')
				suffix = flieArr[flieArr.length - 1]
			} catch (err) {
				suffix = ''
			}
			// fileName无后缀返回 false
			if (!suffix) {
				return false
			}
			suffix = suffix.toLocaleLowerCase()
			// 图片格式
			const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			// 进行图片匹配
			result = imglist.find((item) => item === suffix)
			if (result) {
				return 'image'
			}
			// 匹配txt
			const txtlist = ['txt']
			result = txtlist.find((item) => item === suffix)
			if (result) {
				return 'txt'
			}
			// 匹配 excel
			const excelist = ['xls', 'xlsx']
			result = excelist.find((item) => item === suffix)
			if (result) {
				return 'excel'
			}
			// 匹配 word
			const wordlist = ['doc', 'docx']
			result = wordlist.find((item) => item === suffix)
			if (result) {
				return 'word'
			}
			// 匹配 pdf
			const pdflist = ['pdf']
			result = pdflist.find((item) => item === suffix)
			if (result) {
				return 'pdf'
			}
			// 匹配 ppt
			const pptlist = ['ppt', 'pptx']
			result = pptlist.find((item) => item === suffix)
			if (result) {
				return 'ppt'
			}
			// 匹配 视频
			const videolist = [
				'mp4',
				'm2v',
				'mkv',
				'rmvb',
				'wmv',
				'avi',
				'flv',
				'mov',
				'm4v'
			]
			result = videolist.find((item) => item === suffix)
			if (result) {
				return 'video'
			}
			// 匹配 音频
			const radiolist = ['mp3', 'wav', 'wmv']
			result = radiolist.find((item) => item === suffix)
			if (result) {
				return 'radio'
			}
			// 其他 文件类型
			return 'other'
		},

		// 获取详情
		async getMailData() {
			var data = { evidId: this.id }
			let res = await getCloudDateil(data)
			if (res.success) {
				this.evidData = res.data
			}
			// console.log(res);
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

		// 获取签收寄函照片需要上传材料类型
		async getNeedMaterial() {
			let data = {
				materialCode: this.materialCode,
				evidId: this.id
			}
			let res = await getEvidSignSendNeedMaterial(data)
			// console.log("获取签收寄函照片需要上传材料类型", res);
			if (res.success && res.data) {
				this.needMaterialTips = res.data
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
							materialCode: this.materialCode,
							materialName: res.data.originalFilename,
							tempId: res.data.tempId,
							materialBucket: JSON.stringify({
								bucketName: res.data.bucketName,
								objectName: res.data.objectName
							}),
							mailEvidPersonId: this.personData[0].id,
							type: res.data.originalFilename.substr(res.data.originalFilename.lastIndexOf('.') + 1).toLocaleLowerCase(),
							bucketName: res.data.bucketName,
							objectName: res.data.objectName,
							personId: this.materialCode == 2071 ? file.data.id : ""
						})
					}
				})
			}
		},

		handlePreview(file) {
			console.log(file);
			const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			const fileType = file.name.substr(file.name.lastIndexOf('.') + 1).toLocaleLowerCase()
			if (imglist.includes(fileType)) {
				this.$store.commit('app/CHANGE_IMAGE', [file.url])
				return
			}

			this.$message.error("当前文件暂不支持预览")
			// this.dialogImageUrl = ;
			// this.dialogVisible = true;
		},

		handleCodePreview() {
			// this.codeDialogVisible = true
		},

		// 删除图片
		async handleDelete(file) {
			console.log(file);

			const data = {
				bucketName: file.bucketName,
				objectName: file.objectName,
			}
			// let res = await delH5File(data)
			let res = await this.$axios(`${process.env.VUE_APP_BASE_WEBSOCKET_PATH}/del-h5-file/${this.evidMailId}`, data, { method: 'delete' })

			console.log("删除图片-------", res);
			if (res.success) {
				this.fileList.forEach((item, index) => {
					if (item.uid == file.uid) {
						this.fileList.splice(index, 1)
					}
				})
				return
			}

			this.$message.error("删除图片失败，请稍后再试")
		},

		// 上传前处理
		beforeUpload(file) {
			// console.log("上传前处理", file);

			const acceptType = ["jpg", "jpeg"]
			const index = file.name.lastIndexOf(".") + 1
			const fileType = file.name.substr(index, file.name.length).toLocaleLowerCase()
			if (!acceptType.includes(fileType)) {
				this.$message.warning('不支持的文件格式，请选择 JPG/JPEG 格式的文件');
				return false
			}
			return true

			// const isJPG = file.type === 'image/jpeg';
			// const isLt2M = file.size / 1024 / 1024 < 2;
			// if (!isJPG) {
			// 	this.$message.error('不支持的文件格式，请选择 JPG/JPEG 格式的文件');
			// }
			// if (!isLt2M) {
			// 	this.$message.error('上传图片大小不能超过 2MB!');
			// }
			// return isJPG
		},

		// 超出选择
		handleExceed(files, fileList) {
			console.log(files, fileList);
			this.$message.warning(`最多上传50个文件，已上传了 ${fileList.length} 个文件`);
		},

		// 选择触发
		handleChange(files, fileList) {
			// console.log(files, fileList);
			this.fileList = fileList
		},

		// 删除图片
		handleRemove(file, fileList) {
			// console.log(file, fileList);
			this.fileList = fileList
		},

		// 预览图片
		handlePictureCardPreview(file) {
			this.$store.commit('app/CHANGE_IMAGE', [file.url])
			// this.dialogImageUrl = file.url;
			// this.dialogVisible = true;
		},

		// 提交证据
		async handleSubmit() {
			if (!this.getIsUploaded()) return

			let data = {
				evidMailId: this.evidMailId,
				mailEvidMaterialDTOS: this.fileList
			}

			let res = await saveMailPicture(data)
			console.log("提交证据", res);
			if (res.success) {
				this.$message.success("提交证据成功")
				if (this.materialCode == 2061) {
					this.updateStatus(4)
					return
				}

				this.updateStatus(701)
				return
			}

			this.$message.error("提交证据失败，请稍后再试")
		},

		// 判断是否上传
		getIsUploaded() {
			if (this.materialCode == 2061 && this.fileList.length > 0) {
				return true
			}
			let flag = this.personData.every(receiver => {
				return this.fileList.find(item => {
					return receiver.id == item.personId
				})
			})

			if (!flag) {
				let msg = this.materialCode == "2061" ? "请先上传签收图片" : "每个收件人至少需要上传一份文件"
				this.$message.error(msg)
				return false
			}

			return true
		},

		// 更新状态
		async updateStatus(val) {
			let data = {
				id: this.evidMailId,
				evidStatus: val
			}
			let res = await updateEvidMail(data)
			if (res.success) {
				this.$router.go(-1)
			}
		},

		// 返回
		handleBack() {
			this.$router.go(-1)
		},

		// 文件流获取图片
		getImageUrl(tu) {
			var dataInfo = tu
			var that = this
			// var cr=btoa(new Uint8Array(tu).reduce((data,type)=>data+String.fromCharCode(byte),''))
			const reader = new window.FileReader()
			// 使用readAsArrayBuffer读取文件, result属性中将包含一个 ArrayBuffer 对象以表示所读取文件的数据
			reader.readAsDataURL(dataInfo)
			reader.onload = function (e) {
				const base64Data = e.target.result
				// 调用dataURItoBlob转换方法
				that.imgUrl = that.dataURItoBlob(base64Data)
				// that.srcList.push(that.imgUrl)
				// console.log(that.dataURItoBlob(base64Data), "-----------------------------------------");
			}
		},

		dataURItoBlob(base64Data) {
			// console.log(base64Data, base64Data.length)
			let byteString = base64Data
			if (base64Data.split(',')[0].indexOf('base64') >= 0) {
				byteString = atob(base64Data.split(',')[1]) // base64 解码
			} else {
				byteString = unescape(base64Data.split(',')[1])
			}
			// 获取文件类型
			const mimeString = base64Data.split(',')[0].match(/:(.*?);/)[1] // mime类型

			// ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
			// let arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
			// let uintArr = new Uint8Array(arrayBuffer) // 创建视图

			const uintArr = new Uint8Array(byteString.length) // 创建视图

			for (let i = 0; i < byteString.length; i++) {
				uintArr[i] = byteString.charCodeAt(i)
			}
			// 生成blob图片
			const blob = new Blob([uintArr], {
				type: mimeString
			})
			// console.log( blob);
			// 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
			return URL.createObjectURL(blob)
		},
	},
	computed: {
		uploadImageComputed: function () {
			return (id) => {
				return this.fileList.filter(item => item.personId == id)
			}
		},
		fileListComputed() {
			return this.fileList
		}
	},
}
</script>

<style lang="less" scoped>
/deep/ .el-card {
	position: relative;
}
.code_wrapper {
	position: absolute;
	top: -64px;
	right: 200px;
	border-radius: 4px;

	.code_tranform {
		overflow: hidden;
		.code {
			width: 150px;
			height: 150px;
			// background: red;
			transform: rotateZ(45deg) translate(95px, 95px);
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
			cursor: pointer;

			img {
				width: 150px;
				height: 150px;
			}
		}
	}

	.upload_tips {
		background: #303133;
		position: absolute;
		left: -65px;
		bottom: 5px;
		font-size: 10px;
		color: #fff;
		height: 38px;
		line-height: 16px;
		width: 85px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 4px;

		&::after {
			position: absolute;
			border-top: 8px solid transparent;
			border-bottom: 8px solid transparent;
			border-right: 8px solid transparent;
			border-left: 8px solid #303133;
			content: " ";
			display: block;
			width: 0;
			height: 0;
			top: 30%;
			right: -16px;
		}
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
.up_content {
	padding: 20px;
	margin-top: 20px;
	color: #7f7f7f;
	border: 1px solid #ddd;
	border-radius: 8px;

	.th_title {
		font-size: 16px;
		margin-bottom: 20px;
		font-weight: bold;
	}
	.tips {
		font-size: 14px;
	}
	.up_icon {
		padding: 20px 0;
		display: flex;
		flex-wrap: wrap;
	}
	.image_wrap {
		width: 148px;
		height: 148px;
		margin: 0 8px 8px 0;
		border: 1px solid #c0ccda;
		border-radius: 6px;
		overflow: hidden;
		cursor: pointer;
	}
}
.button_wrap {
	text-align: center;
	margin-top: 30px;
}

/deep/ .el-icon-circle-close {
	color: #333;
}
// /deep/.el-upload--picture-card {
// 	width: 110px;
// 	height: 110px;
// 	line-height: 110px;
// }

// /deep/ .el-upload-list__item {
// 	width: 110px;
// 	height: 110px;
// 	line-height: 110px;
// }

.upload_content {
	display: flex;
	flex-wrap: wrap;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item-name {
	display: block;
}
/deep/ .el-upload-list__item.is-success .el-upload-list__item-status-label {
	display: none;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
	overflow: inherit;
	margin-bottom: 40px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail,
/deep/ .el-upload-list--picture-card .el-upload-list__item-actions {
	border-radius: 6px;
}
/deep/ .el-upload-list__item-name {
	width: 148px;
}
</style>

<style>
.code_class .el-dialog__header {
	padding: 0;
}
.code_class .el-dialog__body {
	padding: 20px;
}
.popper_class {
	top: 165px !important;
}
</style>