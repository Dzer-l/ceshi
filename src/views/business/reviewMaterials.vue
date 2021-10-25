<template>
	<div v-loading.fullscreen.lock="fullscreenLoading" class="main">
		<div class="type-name">
			<div class="search-criteria">
				<div>
					<el-button type="primary" icon="el-icon-plus" @click="openTheSupplementalMaterialFrame">添加需补材料
					</el-button>
				</div>
				<div>
					<el-button type="primary" style="width: 80px" size="medium" @click="goBackToTheLastPage">返回
					</el-button>
				</div>
			</div>
		</div>
		<div v-for="(item, i) in initialData" :key="'bud' + i" class="info-list">
			<div class="info-list-title">
				<span>{{ item.proposerName }}</span>
			</div>
			<div v-for="(items, indexs) in item.orderNeedMaterialDTOS" :key="indexs" class="dateail-list">
				<div class="material-explain">
					<div>
						<span>{{ items.materialName }}</span>
						<i v-if="items.type !== 0" class="el-icon-delete-solid" @click="deleteMaterialType(items)" />
					</div>
				</div>
				<div class="image-list">
					<div style="display: flex; flex-wrap: wrap">
						<div v-for="(v, j) in items.orderProposerMaterialDTOS" :key="j"
							style="position: relative; margin-bottom: 10px">
							<img :src="v.url" alt=""
								style=" height: 100px; width: 100px; margin-right: 10px; border: solid #ddd 1px; object-fit:cover "
								@click="clickPreviewImage(v, items, item)">
							<div v-if="v.status === 1" class="review-tips">审核通过</div>
							<div v-if="v.status === 2" class="fail-to-pass" @click="clickPreviewImage(v, items, item)">
								<div class="fail-to-pass-bause">
									<span>{{ v.remarksContent }}</span>
								</div>
								<div class="text">审核不通过</div>
							</div>
						</div>
						<div class="hint" :class="items.status === 1 ? 'hintNot' : 'hint'"
							@click="supplementary(i, indexs)">
							<span v-if="items.status === 1">提示补充材料</span>
							<div v-if="items.status !== 1" class="font-icon-box">
								<i class="el-icon-plus" />
							</div>
						</div>
					</div>
					<!-- <div v-if="items.orderProposerMaterialDTOS.length < 1" class="hint" :class="items.status === 1 ? 'hintNot' : 'hint'" @click="supplementary(i, indexs)">
						<span v-if="items.status === 1">提示补充材料</span>
						<div v-if="items.status !== 1" class="font-icon-box">
						<i class="el-icon-plus" />
						</div>
					</div> -->
				</div>
			</div>
		</div>
		<div class="preview-dialog">
			<el-dialog title="材料预览" :visible.sync="previewDialogVisible" width="50%" :close-on-click-modal="false">
				<div class="info-title">
					<div style="display: flex; flex-wrap: nowrap">
						<span style="width: 60px"> 申请人： </span>
						<el-tooltip class="item" effect="dark" :content="imageData.realName" placement="top">
							<span style="display: block; flex: 1">{{
                imageData.realName
              }}</span>
						</el-tooltip>
					</div>
					<div style="display: flex; flex-wrap: nowrap">
						<span>材料类型：</span>
						<span>{{ imageData.materialName }}</span>
					</div>
					<div>
						<el-row style="display: flex; flex-wrap: nowrap">
							<el-button type="primary" size="small" @click="getApproved">审核通过</el-button>
							<el-button type="danger" size="small" @click="disqualificationOperation">不符合要求</el-button>
						</el-row>
						<!-- <div v-else
							style="background: #67c23a;color: #fff;padding: 5px 20px;border-radius: 10px;white-space: nowrap;font-size: 12px;">
							审核通过
						</div> -->
					</div>
				</div>
				<div class="disqualification">
					<el-form v-if="disqualificationStatu" ref="disqualificationForm" :inline="true" :model="formInline"
						class="demo-form-inline" :rules="formInlineRulse">
						<el-form-item label="不合格原因" prop="cause">
							<el-input v-model="formInline.cause" placeholder="请输入不合格原因" size="small"
								style="width: 300px" maxlength="50" />
						</el-form-item>
						<el-form-item style="margin: 0">
							<el-button type="primary" size="small" @click="submitCause">确认</el-button>
							<el-button size="small" @click="disqualificationStatu = false">取消</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="image-main" style="height: 400px; margin: 20px 0">
					<div class="block">
						<el-image-viewer v-if="viewerImageData.length > 0" :append-to-body="true"
							:modal-append-to-body="false" :on-close="closeViewer" :url-list="viewerImageData" />
						<el-carousel style="height: 100%" trigger="click" :autoplay="false"
							indicator-position="outside">
							<el-carousel-item v-for="item in imageData.imgUrl" :key="item">
								<el-image :src="item" @click="viewerImg(imageData.imgUrl)">
									<div slot="placeholder" class="image-slot">
										加载中<span class="dot">...</span>
									</div>
								</el-image>
							</el-carousel-item>
						</el-carousel>
					</div>
				</div>
			</el-dialog>
		</div>
		<div v-if="operatingAuthorization" class="bottom-operation-bar">
			<div class="presentment-party">
				<el-checkbox v-model="presentmentParty" @change="tipSupplementBlankMaterial">提示当事人补充空白材料</el-checkbox>
			</div>
			<div class="bottom-operation-btn" @click="submitReviewResult">
				确认审核结果
			</div>
		</div>
		<div class="supplemental-material-pops-up">
			<el-dialog title="补充材料" :visible.sync="materialsDialogVisible" width="50%" :close-on-click-modal="false">
				<el-tabs v-model="activeName">
					<el-tab-pane label="材料选择" name="first">
						<div class="select-material">
							<div class="search">
								<el-input v-model="searchMaterial" placeholder="请输入材料名称" size="medium"
									@input="blankReset(searchMaterial)" />
								<el-button type="primary" size="medium" @click="searchMaterialName">搜索</el-button>
							</div>
							<div style="margin: 20px 0">
								<span>材料所属：</span>
								<el-select v-model="value" size="medium" placeholder="请选择"
									style="width: 385px; margin-right: 20px" @change="searchAttribution(value)">
									<el-option size="medium" label="全部" value="-1" />
									<el-option v-for="item in searchBarData"
										:key="item.proposerId !== null? item.proposerId: item.proposerName"
										size="medium" :label="item.proposerName"
										:value="item.proposerId !== null ? item.proposerId : '0'" />
									<!-- <el-option size="medium" label="事项材料" value="0" /> -->
								</el-select>
								<!-- <el-button
										type="primary"
										size="medium"
										@click="searchAttribution"
									>搜索</el-button> -->
							</div>
							<div class="material-list">
								<div v-for="(item, index) in materialData" :key="index" style="display: flex">
									<span style="display: block; width: 30px">{{ item.firstLetter }}</span>
									<el-checkbox-group v-model="checkList">
										<el-checkbox v-for="(items, indexs) in item.orgMaterialDTOS" :key="indexs"
											:label="items.id" :disabled="items.disable">{{ items.materialName }}
										</el-checkbox>
									</el-checkbox-group>
								</div>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="添加临时材料" name="second">
						<div class="add-material">
							<el-alert title="临时材料不会保存至材料库。" type="warning" show-icon />
							<div class="from-list">
								<div v-for="(item, index) in addMaterialData" :key="index" class="from-list-buttom">
									<el-form label-position="right" label-width="120px">
										<el-form-item :label="item.newName" required>
											<el-input v-model="item.model.name" size="medium" maxlength="50"
												placeholder="请输入材料名称" />
										</el-form-item>
										<el-form-item :label="item.newRemark">
											<el-input v-model="item.model.remark" type="textarea" maxlength="100"
												placeholder="请输入备注" />
										</el-form-item>
									</el-form>
									<span :class="item.btn === '添加'? 'add-text-button': 'reduce-text-button'"
										@click="addForm(item, index)">
										<i :class="item.btn === '添加' ? 'el-icon-plus' : 'el-icon-minus'"
											style="padding-right: 2px; font-size: 8px" />
										<span>{{ item.btn }}</span>
									</span>
								</div>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
				<span slot="footer" class="dialog-footer">
					<el-button @click="materialsDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="confirmAdd">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import {
	previewMaterials,
	reviewSingleMaterial,
	getMaterialDepot
} from '../../api/cloudMail'
import * as ds from '@/api/details'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { showLoading, hideLoading } from '../../utils/loading'
export default {
	components: { ElImageViewer },
	data() {
		return {
			orderId: '',
			value: '-1',
			initialData: [],
			searchBarData: [],
			imageData: {},
			previewDialogVisible: false,
			disqualificationStatu: false,
			formInline: { cause: '' },
			formInlineRulse: {
				cause: [
					{ required: true, message: '请输入不合格原因', trigger: 'blur' },
					{
						min: 2,
						max: 50,
						message: '长度在2到50个字',
						trigger: 'blur'
					}
				]
			},
			presentmentParty: false,
			array: [],
			fullscreenLoading: false,
			srcList: [],
			operatingAuthorization: true,
			viewerImageData: [],
			arr: [],
			materialsDialogVisible: false,
			activeName: 'first',
			searchMaterial: '',
			checkList: [],
			addMaterial: {
				name: '',
				remark: ''
			},
			addMaterialData: [
				{
					id: 1,
					newName: '新材料名称',
					newRemark: '材料备注',
					btn: '添加',
					model: { name: '', remark: '' }
				}
			],
			tabActiveName: 'first',
			materialData: [],
			submitStatu: false,
			all: true
		}
	},
	watch: {
		// initialData: {
		//   handler(newval) {
		//     for (let index = 0; index < newval.length; index++) {
		//       for (let i = 0; i < newval[index].orderNeedMaterialDTOS.length; i++) {
		//         if (newval[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS.length === 0) {
		//           this.operatingAuthorization = true
		//         } else {
		//           for (let j = 0; j < newval[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS.length; j++) {
		//             if (newval[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].status === 0) {
		//               this.operatingAuthorization = true
		//             }
		//           }
		//         }
		//       }
		//     }
		//   },
		//   deep: true
		// },
		presentmentParty: {
			handler(newVal) { }
		}
	},
	created() {
		this.orderId = this.$route.query.orderId
		this.$store.commit('app/CHANGE_ORDERID', this.$route.query.orderId)
		this.getData()
		// getAllTypeMaterial({ orderId: this.orderId }).then(async(res) => {
		// })
	},
	methods: {
		getData() {
			showLoading()
			this.$axios(`org/mail-order-material-list/${this.orderId}`).then(
				async (res) => {
					console.log(res, '材料列表')
					var u = JSON.parse(JSON.stringify(res.data))
					u.splice(u.length - 1)
					this.searchBarData = u
					// this.initialData = res.data
					this.initialData = await this.getImageUrl(res.data)
					hideLoading()
					// const url = this.initialData[0].orderNeedMaterialDTOS[0].orderProposerMaterialDTOS[0].url.split(',')[1]
					console.log(await this.getImageUrl(res.data))
				}
			)
		},
		// 原理：利用URL.createObjectURL为blob对象创建临时的URL

		async base64ToBlob({
			b64data = '',
			contentType = '',
			sliceSize = 512
		} = {}) {
			return new Promise((resolve, reject) => {
				// 使用 atob() 方法将数据解码
				const byteCharacters = atob(b64data)
				const byteArrays = []
				for (
					let offset = 0;
					offset < byteCharacters.length;
					offset += sliceSize
				) {
					const slice = byteCharacters.slice(offset, offset + sliceSize)
					const byteNumbers = []
					for (let i = 0; i < slice.length; i++) {
						byteNumbers.push(slice.charCodeAt(i))
					}
					// 8 位无符号整数值的类型化数组。内容将初始化为 0。
					// 如果无法分配请求数目的字节，则将引发异常。
					byteArrays.push(new Uint8Array(byteNumbers))
				}
				let result = new Blob(byteArrays, {
					type: contentType
				})
				result = Object.assign(result, {
					// jartto: 这里一定要处理一下 URL.createObjectURL
					preview: URL.createObjectURL(result),
					name: `图片示例.png`
				})
				resolve(result)
			})
		},

		viewerImg(val) {
			console.log(val)
			this.viewerImageData = val
		},
		closeViewer() {
			this.viewerImageData = []
		},
		// fcg(val) {
		//   supplementaryMaterials(val).then((res) => {
		//     console.log(res)
		//     if (res.success) {
		//       this.searchAttribution()
		//     }
		//   })
		// },
		searchAttribution(val) {
			this.value = val
			this.checkList = []
			this.all = val === '-1'
			this.openTheSupplementalMaterialFrame()
		},
		async getImageUrl(val) {
			var valData = val
			for (let index = 0; index < val.length; index++) {
				if (valData[index].orderNeedMaterialDTOS.length > 0) {
					for (let i = 0; i < valData[index].orderNeedMaterialDTOS.length; i++) {
						if (valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS) {
							for (let j = 0; j < valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS.length; j++) {
								var data = { id: valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].id }
								if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'image') {
									var url = await previewMaterials(data)
									const im = await this.base64ToBlob({
										b64data: url.data,
										contentType: 'image/png'
									})
									valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = im.preview
								} else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'pdf') {
									valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/pdf.png')
								} else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'word') {
									valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/DOCX.png')
								} else if (
									this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'excel') {
									valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/xls.png')
								} else if (this.getFileType(valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].originFileName) === 'video') {
									valData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].url = require('@/assets/imgs/MP4.png')
								}
							}
						}
					}
				}
			}
			return valData
		},
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
		clickPreviewImage(val, items, item) {
			console.log(items, item)
			var a = JSON.parse(JSON.stringify(val))
			a.realName = item.proposerName
			a.materialName = items.materialName
			a.materialCode = items.materialCode
			this.fullscreenLoading = true
			this.imageData = {}
			a.imgUrl = []
			if (this.getFileType(val.originFileName) !== 'image') {
				ds.getMateriaProposerlList({ id: val.id }).then(async (res) => {
					console.log(res)
					var imglist = []
					if (res.data.success === true) {
						const list = res.data.data.ids
						for (const i in list) {
							const imgUrl = await this.getImg(list[i], 2)
							imglist.push(imgUrl)
						}
						a.imgUrl = imglist
						this.fullscreenLoading = false
						this.previewDialogVisible = true
						this.imageData = a
					}
				})
			} else {
				a.imgUrl.push(val.url)
				this.fullscreenLoading = false
				this.previewDialogVisible = true
				this.imageData = a
			}
		},
		async getImg(id, type) {
			const url =
				type === 1
					? `org/order-document-preview-img/${id}`
					: `org/order-proposer-material-preview-word-img/${id}`
			// console.log(type)
			return await this.$axios(url).then(async (res) => {
				if (res.success) {
					return 'data:image/png;base64,' + res.data
				}
			})
		},
		largerPreview() {
			// this.previewDialogVisible = false
			this.srcList = this.imageData
			// this.$store.commit('app/CHANGE_IMAGE', this.imageData)
		},
		disqualificationOperation() {
			this.disqualificationStatu = true
		},
		submitCause() {
			this.$refs['disqualificationForm'].validate((valid, obj) => {
				if (valid) {
					this.imageData.status = 2
					this.imageData.remarksContent = this.formInline.cause
					reviewSingleMaterial(this.imageData).then((res) => {
						console.log(res)
						if (res.success) {
							this.$router.go(0)
						}
					})
				}
				// this.formInline.cause = "";
			})
		},
		getApproved() {
			console.log(this.imageData)
			this.imageData.status = 1
			reviewSingleMaterial(this.imageData).then((res) => {
				console.log(res)
				if (res.success) {
					this.$router.go(0)
				}
			})
		},
		submitReviewResult() {
			let status = true
			for (let index = 0; index < this.initialData.length; index++) {
				if (this.initialData[index].orderNeedMaterialDTOS) {
					for (let i = 0; i < this.initialData[index].orderNeedMaterialDTOS.length; i++) {
						if (this.initialData[index].orderNeedMaterialDTOS[i].status === 1) {
							status = false
							break
						} else {
							if (this.initialData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS) {
								for (let j = 0; j < this.initialData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS.length; j++) {
									if (this.initialData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[j].status === 2) {
										status = false
									}
								}
							}
						}
					}
				}
			}
			// this.$confirm(
			//   status ? '确认材料完整且无误？确定后剩余材料均视为审核通过' : '是否确认材料审核结果？确认后，将通知当事人补充材料',
			//   '提示',
			//   {
			//     confirmButtonText: '确定',
			//     cancelButtonText: '取消',
			//     type: 'warning'
			//   }
			// )
			//   .then(() => {
			//     this.$axios(`org/order-material-approved/${this.orderId}`).then(res => {
			//       if (res.success) {
			//         console.log(res)
			//         this.$router.go(0)
			//       }
			//     })
			//   })
			//   .catch(() => {
			//     this.$message({
			//       type: 'info',
			//       message: '已取消操作'
			//     })
			//   })
			const h = this.$createElement
			this.$msgbox({
				title: '提示',
				message: h('p', null, [
					h(
						'span',
						null,
						status ? '确认材料完整且无误？' : '是否确认材料审核结果？'
					),
					h(
						'div',
						{ style: 'color: #F56C6C' },
						status
							? '确定后剩余材料均视为审核通过'
							: '确认后，将通知当事人补充材料'
					)
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						this.$axios(`org/order-material-approved/${this.orderId}`).then(
							(res) => {
								if (res.success) {
									console.log(res)
									done()
								}
							}
						)
					} else {
						done()
					}
				}
			})
				.then((action) => {
					this.$store.commit('app/CHANGE_ORDERID', this.orderId)
					this.$router.replace({
						name: 'examineMaterials',
						query: { orderId: this.orderId }
					})
				})
				.catch(() => { })
		},
		supplementary(val, val2) {
			console.log(val, val2)

			const data = [
				JSON.parse(
					JSON.stringify(this.initialData[val].orderNeedMaterialDTOS[val2])
				)
			]
			data[0].status = data[0].status === 1 ? 0 : 1
			data[0].proposerId = this.initialData[val].proposerId
			this.$axios(`org/order-need-material-update`, data, {
				method: 'POST'
			}).then((res) => {
				if (res.success) {
					this.initialData[val].orderNeedMaterialDTOS[val2].status = this.initialData[val].orderNeedMaterialDTOS[val2].status === 0 ? 1 : 0
				}
			})
		},
		goBackToTheLastPage() {
			this.$router.replace({
				name: 'entryDetailsOrder',
				query: { orderId: this.orderId }
			})
		},
		blankReset(val) {
			if (val.length === 0) {
				this.openTheSupplementalMaterialFrame()
			}
		},
		rejectedMaterial() {
			this.submitStatu = false
			getMaterialDepot({
				orderId: this.orderId,
				materialName: ''
			}).then((res) => {
				console.log(res, '材料库')
				this.materialData = res.data
				this.searchMaterial = ''
				this.checkList = []
				this.addMaterialData = [
					{
						id: 1,
						newName: '新材料名称',
						newRemark: '材料备注',
						btn: '添加',
						model: { name: '', remark: '' }
					}
				]
				this.materialsDialogVisible = true
			})
		},
		searchMaterialName() {
			this.openTheSupplementalMaterialFrame()
		},
		addForm(val, index) {
			if (val.btn === '添加') {
				var data = {
					id: this.addMaterialData.length + 1,
					newName: '新材料名称',
					newRemark: '材料备注',
					btn: '删除',
					model: { name: '', remark: '' }
				}
				this.addMaterialData.push(data)
			} else {
				this.addMaterialData.splice(index, 1)
			}
			console.log(val)
		},
		openTheSupplementalMaterialFrame() {
			this.$axios(`org/org-material-list/${this.orderId}`, {
				materialName: this.searchMaterial,
				proposerId: this.value
			}).then((res) => {
				this.materialData = res.data
				for (let i = 0; i < res.data.length; i++) {
					for (let m = 0; m < res.data[i].orgMaterialDTOS.length; m++) {
						if (res.data[i].orgMaterialDTOS[m].isFlag === 1) {
							res.data[i].orgMaterialDTOS[m].disable = true
							this.checkList.push(res.data[i].orgMaterialDTOS[m].id)
						} else {
							res.data[i].orgMaterialDTOS[m].disable = false
						}
					}
				}
				this.addMaterialData = [
					{
						id: 1,
						newName: '新材料名称',
						newRemark: '材料备注',
						btn: '添加',
						model: { name: '', remark: '' }
					}
				]
				this.materialsDialogVisible = true
				// console.log(res.data)
			})
		},
		confirmAdd() {
			if (this.activeName === 'first') {
				if (this.all) {
					this.$message({ type: 'warning', message: '请选择材料所属' })
					return false
				}
				const p = []
				for (let i = 0; i < this.materialData.length; i++) {
					for (
						let j = 0;
						j < this.materialData[i].orgMaterialDTOS.length;
						j++
					) {
						if (this.materialData[i].orgMaterialDTOS[j].isFlag) {
							p.push(this.materialData[i].orgMaterialDTOS[j].id)
						}
					}
				}
				if (p.length === this.checkList.length) {
					this.$message({ message: '请至少选择一项', type: 'warning' })
					return false
				}
				const s2 = new Set(p)
				const intersect = this.checkList.filter((x) => !s2.has(x))
				const arr = []
				for (const key in this.materialData) {
					for (const i in this.materialData[key].orgMaterialDTOS) {
						if (
							intersect.indexOf(this.materialData[key].orgMaterialDTOS[i].id) >
							-1
						) {
							arr.push(this.materialData[key].orgMaterialDTOS[i])
						}
					}
				}
				const y = {}
				const t = []
				for (let index = 0; index < arr.length; index++) {
					y.materialCode = arr[index].materialCode
					y.materialName = arr[index].materialName
					y.proposerId = parseInt(this.value) === 0 ? null : this.value
					y.type = 1
					y.status = 1
					t.push(y)
				}
				// console.log(t)
				this.$axios(`org/add-org-need-material/${this.orderId}`, t, {
					method: 'POST'
				}).then((res) => {
					if (res.success) {
						this.$router.go(0)
					}
				})
			} else {
				var arr = []
				for (let index = 0; index < this.addMaterialData.length; index++) {
					if (this.addMaterialData[index].model.name.length > 0) {
						var data = {
							orderId: this.orderId,
							materialName: this.addMaterialData[index].model.name,
							type: 2,
							status: 0,
							content: this.addMaterialData[index].model.remark,
							proposerId: null
						}
						arr.push(data)
					}
				}
				console.log(arr)
				if (arr.length > 0) {
					if (this.submitStatu) {
						return false
					}
					this.submitStatu = true
					this.$axios(`org/add-order-need-material/${this.orderId}`, arr, {
						method: 'POST'
					}).then((res) => {
						if (res.success) {
							this.$router.go(0)
						}
					})
				} else {
					this.$message({
						message: '请添加临时材料',
						type: 'warning'
					})
				}
			}
		},
		tipSupplementBlankMaterial() {
			const data = JSON.parse(JSON.stringify(this.initialData))
			const sta = this.presentmentParty ? 1 : 0
			const arr = []
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < data[i].orderNeedMaterialDTOS.length; j++) {
					if (
						data[i].orderNeedMaterialDTOS[j].orderProposerMaterialDTOS
							.length === 0
					) {
						data[i].orderNeedMaterialDTOS[j].status = sta
						arr.push(data[i].orderNeedMaterialDTOS[j])
					}
				}
			}
			this.$axios(`org/order-need-material-update`, arr, {
				method: 'POST'
			}).then((res) => {
				if (res.success) {
					for (let i = 0; i < this.initialData.length; i++) {
						for (
							let j = 0;
							j < this.initialData[i].orderNeedMaterialDTOS.length;
							j++
						) {
							if (
								this.initialData[i].orderNeedMaterialDTOS[j]
									.orderProposerMaterialDTOS.length === 0
							) {
								this.initialData[i].orderNeedMaterialDTOS[j].status = sta
							}
						}
					}
				}
			})
		},
		deleteMaterialType(val) {
			this.$confirm('确认删除该类材料？删除后需重新添加！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.$axios(
						`org/del-order-need-material/${val.id}`,
						{},
						{ method: 'delete' }
					).then((res) => {
						console.log(res)
						if (res.success) {
							this.$message({ type: 'success', message: '删除成功' })
							this.$router.go(0)
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		}
	}
}
</script>

<style lang="less" scoped>
.image-main {
	.el-carousel {
		background: #f2f2f2;
		border: solid #999 1px;
	}
	/deep/ .el-carousel__container {
		height: calc(100% - 26px);
	}
	.block {
		height: 100%;
	}
	.el-image {
		height: 100%;
		width: 100%;
		/deep/ .el-image__inner {
			// width: 100%;
			height: 100%;
			cursor: pointer;
			object-fit: contain;
		}
	}
}

/deep/ .el-dialog__footer {
	padding-top: 20px;
}
/deep/ .el-dialog {
	margin-top: 10vh !important;
}
.main {
	width: calc(100% - 40px);
	min-height: calc(100vh - 90px);
	background: #fff;
	padding: 0 20px;
	position: relative;
	padding-bottom: 80px;
	.type-name {
		padding: 30px 0;
		padding-bottom: 50px;
		.search-criteria {
			border-bottom: solid #eee 1px;
			padding-bottom: 50px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
	.info-list {
		border: solid #eee 1px;
		border-radius: 5px;
		margin-bottom: 20px;
		.info-list-title {
			background: #e6f6fe;
			padding: 15px 10px;
			border-radius: 5px;
			span {
				font-size: 16px;
			}
		}
		.dateail-list {
			border: solid #eee 1px;
			border-radius: 5px;
			margin: 20px;
			.material-explain {
				padding: 15px 10px;
				& > div {
					display: flex;
					justify-content: space-between;
					align-items: center;
					& > i {
						font-size: 20px;
						cursor: pointer;
					}
					& > i:hover {
						color: red;
					}
				}
			}
			.image-list {
				margin: 0 10px;
				display: flex;
				flex-wrap: wrap;
				padding: 10px;
				/deep/ img {
					height: 100px;
					width: 100px;
					margin-right: 10px;
					cursor: pointer;
				}
				.hint {
					height: 100px;
					width: 100px;
					border: solid 1px #eee;
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					span {
						color: #fff;
					}
					.font-icon-box {
						background: #409eff;
						border-radius: 50%;
						.el-icon-plus {
							font-size: 32px;
							color: #fff;
						}
					}
				}
				.hintNot {
					background: #409eff;
					border: none;
				}
				.review-tips,
				.text {
					position: absolute;
					background: #67c23a;
					border-radius: 4px;
					font-size: 8px;
					color: #fff;
					line-height: 20px;
					padding: 0 5px;
					z-index: 999;
					bottom: 3px;
					right: 10px;
				}
				.fail-to-pass {
					position: absolute;
					height: 100%;
					width: 100%;
					top: 0;
					left: 0;
					cursor: pointer;
					.fail-to-pass-bause {
						margin-right: 10px;
						display: flex;
						justify-content: center;
						& > span {
							white-space: pre-wrap; /* CSS3 */
							white-space: -moz-pre-wrap; /* Firefox */
							white-space: -pre-wrap; /* Opera <7 */
							white-space: -o-pre-wrap; /* Opera 7 */
							word-wrap: break-word; /* IE */
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
							overflow: hidden;
							color: #f56c6c;
						}
					}
				}
				.text {
					background: #f56c6c;
				}
			}
		}
	}
	.disqualification {
		padding-top: 20px;
		min-height: 61px;
		.el-form {
			display: flex;
			.el-form-item {
				margin-bottom: 0;
				display: flex;
			}
		}
	}
	.preview-dialog {
		/deep/ .el-dialog {
			min-width: 600px;
		}
		.info-title {
			display: flex;
			align-items: center;
			& > div {
				width: auto;
				margin-right: 10%;
				& > span {
					white-space: nowrap;
				}
			}
			& > div:first-child {
				max-width: 60%;
				overflow: hidden;
			}
			/deep/ .el-tooltip {
				width: calc(100% - 60px);
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.bottom-operation-bar {
		height: 80px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		position: absolute;
		bottom: 0;
		margin-left: -20px;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		.presentment-party,
		.bottom-operation-btn {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.presentment-party {
			padding-right: 30px;
		}
		.bottom-operation-btn {
			padding: 0 50px;
			background: #409eff;
			color: #fff;
			cursor: pointer;
		}
	}
}
.add-material {
	height: 470px;
	overflow: auto;
	.el-alert--warning {
		/deep/ .el-alert__closebtn {
			display: none;
		}
	}
	.from-list {
		.from-list-buttom {
			width: 100%;
			padding-top: 20px;
			display: flex;
			align-items: flex-end;
		}
		.add-text-button {
			margin-left: 20px;
			color: #8a2ee6;
			cursor: pointer;
		}
		.reduce-text-button {
			margin-left: 20px;
			color: red;
			cursor: pointer;
		}
		.el-form {
			width: 60%;
			border-bottom: solid 1px #eee;
		}
	}
}
.select-material {
	.search {
		display: flex;
		/deep/ .el-input,
		/deep/ .el-input__inner {
			width: 400px;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		.el-button {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
}
.material-list {
	height: 400px;
	border: solid 1px #eee;
	margin-top: 20px;
	padding: 20px;
	overflow: auto;
	.el-checkbox-group {
		flex: 1;
	}
}
.supplemental-material-pops-up {
	.el-form-item {
		display: flex;
	}
	/deep/ .el-form-item__content {
		margin-left: 0 !important;
		flex: 1;
	}
}
.disqualification {
	.el-form-item {
		/deep/ .el-form-item__label {
			width: auto !important;
		}
	}
}
</style>
