<template>
	<div v-loading.fullscreen.lock="fullscreenLoading" class="evidence-material-main">
		<div class="tree-main">
			<div class="tree-header">
				<div class="operation-all-list">
					<!-- <el-checkbox
						v-model="allChecked"
						:indeterminate="isIndeterminate"
						:disabled="jurisdiction"
						@change="allSelectMaterail"
					/>
					<span style="padding-left: 5px">文件名</span> -->
				</div>
				<el-row>
					<el-button type="primary" size="medium" :disabled="jurisdiction" @click="batchDownload">一键下载
					</el-button>
					<el-button v-if="basueData.orderStatus === 201||basueData.prodCode==='ysf'" type="primary"
						size="medium" :disabled="jurisdiction" @click="uploading">上传证据材料</el-button>
					<el-button v-if="basueData.orderStatus === 201&&basueData.prodCode!=='ysf'" type="primary"
						size="medium" :disabled="jurisdiction" @click="reviewMaterials">审核材料</el-button>
					<el-button v-if="basueData.orderStatus !== 201||basueData.prodCode==='ysf'" type="primary"
						size="medium" :disabled="jurisdiction" @click="examineMaterials">查看材料</el-button>
				</el-row>
			</div>
			<div class="materail-list-main">
				<div class="list-header">
					<div class="material-belongs">材料归属</div>
					<div class="other-flex">
						<div class="material-type">材料类型</div>
						<div class="other-flex-2">
							<div class="file-name">文件名称</div>
							<div v-if="basueData.prodCode==='ysf'" class="file-upload-time">上传时间</div>
							<div class="operating">操作</div>
						</div>
					</div>
				</div>
				<div v-if="materialListData.length>0" class="materail-list">
					<div v-for="(item,index) in materialListData" :key="index" class="merge">
						<div class="material-belongs">{{ item.proposerName }}</div>
						<div class="other-collection">
							<div v-for="(items,indexs) in item.orderNeedMaterialDTOS" :key="'chid'+indexs"
								class="together">
								<div class="type">{{ items.materialName }}</div>
								<div class="name">
									<div v-for="(arr,i) in items.orderProposerMaterialDTOS" :key="i+'levelThree'"
										class="name-list">
										<div class="materail-name">
											<div><img style="width:20px;height:20px"
													:src="getFileType(arr.originFileName)==='image'?require('../../assets/imgs/img.png'):(getFileType(arr.originFileName)==='word'?require('../../assets/imgs/word.png'):(getFileType(arr.originFileName)==='pdf'?require('../../assets/imgs/pdf1.png'):require('../../assets/imgs/xlss.png')))"
													alt="">
											</div>
											<div class="img-name">
												<el-tooltip :content="arr.originFileName" placement="top">
													<span>{{ arr.originFileName }}</span>
												</el-tooltip>
											</div>
										</div>
										<div v-if="basueData.prodCode==='ysf'" class="time">{{ arr.createTime }}</div>
										<div class="btns">
											<span>
												<el-button type="text" @click="download(arr)">下载</el-button>
												<el-button v-if="getFileType(arr.originFileName)!=='video'" type="text"
													@click="previewFile(arr)">预览</el-button>
												<el-button v-if="getFileType(arr.originFileName)!=='video'" type="text"
													@click="deleteMaterials(arr)">删除</el-button>
												<el-button v-if="getFileType(arr.originFileName)!=='video'" type="text"
													@click="printMaterial(arr)">打印</el-button>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="materialListData.length===0||materialListData===null" class="no-data">
					暂无数据
				</div>
			</div>
			<!-- <ul class="materail-list-title">
        <li
          v-for="(item, index) in evienceData"
          :key="index"
          class="materail-list-title-text"
        >
          <div class="name-title">
            <div class="name-title-btn">
              <i
                :class="
                  item.show ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="funs(index)"
              />

              <el-checkbox
                v-model="item.check"
                :indeterminate="item.isIndeterminate"
                :disabled="jurisdiction"
                @change="handleCheckAllChange(item, index)"
              >{{ item.materialName }}
              </el-checkbox>
            </div>
          </div>
          <el-collapse-transition>
            <ul v-show="item.show" class="materail-list">
              <li
                v-for="(items, indexs) in item.orderProposerMaterialDTOS"
                :key="indexs"
              >
                <el-checkbox-group
                  v-model="item.list"
                  :disabled="jurisdiction"
                  @change="handleCheckedCitiesChange(index, indexs, item.list)"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="items.originFileName"
                    placement="top-end"
                  >
                    <el-checkbox
                      :label="items.id"
                    ><span class="hint-tooltip">{{
                      items.originFileName
                    }}</span>
                    </el-checkbox>
                  </el-tooltip>
                </el-checkbox-group>
                <div class="materail-name">
                  <div class="operation">
                    <el-button
                      :disabled="jurisdiction"
                      type="text"
                      @click.stop="download(items)"
                    >
                      下载
                    </el-button>
                    <el-button
                      :disabled="jurisdiction"
                      type="text"
                      @click="previewFile(items)"
                    >预览</el-button>
                    <el-button
                      :disabled="jurisdiction"
                      type="text"
                      @click="deleteMaterials(items)"
                    >删除</el-button>
                    <el-button
                      :disabled="jurisdiction"
                      type="text"
                      @click="printMaterial(items)"
                    >打印</el-button>
                  </div>
                </div>
              </li>
            </ul>
          </el-collapse-transition>
        </li>
      </ul> -->
		</div>

		<div class="upload-material-dialog">
			<el-dialog title="上传申请材料" :visible.sync="uploadMaterialDialogVisible" width="50%"
				:close-on-click-modal="false">
				<el-form label-width="80px" :model="formLabelAlign">
					<el-form-item label="材料类型">
						<el-select ref="typeSelect" v-model="formLabelAlign.type" placeholder="请选择需要上传的材料类型"
							style="width: 50%" @change="changeType($event)">
							<el-option v-for="(item, index) in options" :key="index"
								:label="item.proposerName===null?item.materialName: item.materialName+'('+item.proposerName+')'"
								:value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item label="文件上传">
						<el-upload ref="upload" class="upload-demo" action="" :show-file-list="false"
							:http-request="uploadFile" :data="materialData">
							<el-button icon="el-icon-upload2">上传文件</el-button>
							<div slot="tip" class="el-upload__tip">
								<span style="color: #999">支持扩展名：.doc .docx .pdf .jpg .jpeg
									.png格式，请将上传的文件转成所支持的格式</span>
								<div class="upload-image-list" style="width:100%">
									<div style="display:flex;flex-wrap: wrap;width:100%">
										<div v-for="(item, index) in imgURLData" :key="index"
											style="position: relative;border:solid 1px #eee;height: 80px; width: 80px; margin-right: 10px;margin-bottom:10px">
											<img :src="item" alt="" style="height: 80px;width:80px;">
											<i class="el-icon-close"
												style="position: absolute;right: 0;top:0;cursor: pointer;"
												@click="deleteImage(index)" />
										</div>

									</div>
								</div>
							</div>
						</el-upload>
					</el-form-item>
				</el-form>

				<span slot="footer" class="dialog-footer">
					<el-button @click="uploadMaterialDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="uploadMaterialConfirm">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<!-- <iframe class="iframe" /> -->
	</div>
</template>

<script>
import {
	getEvidenceMaterial,
	previewMaterials,
	DeleteMaterials,
	getEntryDateil,
	getAllTypeMaterial,
	addApplicationMaterial
} from '../../api/cloudMail'
import * as ds from '@/api/details'
import { printInit, print } from '../../utils/entryPrint'
export default {
	data() {
		return {
			jurisdiction: false,
			fileList: [],
			file: {},
			checkList: [],
			tableData: [],
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			selectData: [],
			evienceData: [],
			allChecked: false,
			isIndeterminate: false,
			currentPage3: 1,
			pageSize: 10,
			total: 0,
			orderId: '',
			basueData: {},
			uploadMaterialDialogVisible: false,
			formLabelAlign: {
				name: '',
				type: ''
			},
			options: [],
			imgURLData: [],
			propesData: [],
			materialData: {},
			uploadData: [],
			fullscreenLoading: false,
			materialList: [],
			totalStatu: false,
			checkStatus: true,
			materialListData: []
		}
	},
	watch: {},
	created() {
		this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
		if (this.$route.query.orderId) {
			this.orderId = this.$route.query.orderId
		} else {
			this.orderId = this.$store.state.app.orderId
			var url = `/#${this.$route.path}?orderId=${this.orderId}`
			history.pushState(null, null, url)
		}
		this.getList()
	},
	methods: {
		uploading() {
			this.$axios(`org/mail-order-need-material/${this.orderId}`).then(res => {
				this.options = res.data
				this.uploadData = []
				this.imgURLData = []
				this.uploadMaterialDialogVisible = true
			})
		},
		getList() {
			var data = {
				orderId: this.orderId,
				pageNum: this.currentPage3,
				pageSize: this.pageSize
			}
			getEntryDateil(data).then((res) => {
				this.basueData = res.data
				getEvidenceMaterial(data).then((res) => {
					if (res.success) {
						this.materialListData = res.data
						// this.total = res.data.total
					}
				})
			})
		},
		reviewMaterials() {
			this.$store.commit('app/CHANGE_ORDERID', this.orderId)
			this.$router.push({
				name: 'reviewMaterials',
				query: { orderId: this.orderId }
			})
		},
		examineMaterials() {
			this.$store.commit('app/CHANGE_ORDERID', this.orderId)
			this.$router.push({
				name: 'examineMaterials',
				query: { orderId: this.orderId }
			})
		},
		download(val) {
			var downloadType = 2
			var fileName = val.originFileName
			this.$axios(
				'org/download-material',
				{ orderId: this.orderId, documentId: val.id, downloadType: downloadType },
				{ responseType: 'blob' }
			).then((blob) => {
				this.saveAs(blob, fileName)
			})
		},
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
		allSelectMaterail(val) {
			this.isIndeterminate = false
			if (this.allChecked) {
				for (let index = 0; index < this.evienceData.length; index++) {
					for (let i = 0; i < this.evienceData[index].orderProposerMaterialDTOS.length; i++) {
						this.evienceData[index].list.push(this.evienceData[index].orderProposerMaterialDTOS[i].id)
						this.evienceData[index].check = true
					}
				}
			} else {
				for (let index = 0; index < this.evienceData.length; index++) {
					for (let i = 0; i < this.evienceData[index].orderProposerMaterialDTOS.length; i++) {
						this.evienceData[index].list = []
						this.evienceData[index].check = false
					}
				}
			}
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
		previewFile(items) {
			if (this.getFileType(items.originFileName) === 'excel') {
				this.$message({ message: '该文件暂不支持预览', type: 'warning' })
				return false
			}
			this.fullscreenLoading = TextTrackCueList
			if (this.getFileType(items.originFileName) === 'image') {
				previewMaterials({ id: items.id }).then((res) => {
					// if (res.data != null) {

					//   // 图片地址初始值为base64,给每个url转化成可渲染的地址
					this.fullscreenLoading = false
					var e = 'data:image/png;base64,' + res.data
					var list = []
					// 将图片的url存入一个数组中
					list.push(e)
					// 将数组存入到vuex中在app.vue中调用预览
					this.$store.commit('app/CHANGE_IMAGE', list)
					// }
				})
			} else {
				// console.log(items.id);
				ds.getMateriaProposerlList({ id: items.id }).then(async (res) => {
					if (res.data.success === true) {
						const list = res.data.data.ids
						for (const i in list) {
							const imgUrl = await this.getImg(list[i], 2)
							list[i] = imgUrl
						}
						this.fullscreenLoading = false
						this.$store.commit('app/CHANGE_IMAGE', list)
					}
				})
			}
		},
		async getImg(id, type) {
			const url =
				type === 1
					? `org/order-document-preview-img/${id}`
					: `org/order-proposer-material-preview-word-img/${id}`
			return await this.$axios(url).then(async (res) => {
				if (res.success) {
					return 'data:image/png;base64,' + res.data
				}
			})
		},
		deleteMaterials(val) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					DeleteMaterials({ id: val.id }).then((res) => {
						if (res.success) {
							this.$message({
								message: '文件已删除',
								type: 'success'
							})
							this.getList()
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
		},
		async printMaterial(val) {
			// console.log(document.getElementsByTagName('iframe')[0])
			if (this.getFileType(val.originFileName) !== 'image' && this.getFileType(val.originFileName) !== 'word') {
				this.$message({ message: '该文件暂不支持打印', type: 'warning' })
				return false
			}
			if (this.getFileType(val.originFileName) === 'image') {
				const status = await printInit(1, { id: val.id })
				if (status) {
					setTimeout(() => {
						print()
					}, 500)
				}
				// previewMaterials({ id: val.id }).then((res) => {
				//   console.log(res)
				//   // if (res.data != null) {

				//   //   // 图片地址初始值为base64,给每个url转化成可渲染的地址
				//   var e = 'data:image/png;base64,' + res.data
				//   inner =
				//     "<div><img src='" +
				//     e +
				//     "'/ style='max-width:100%;height:auto'></div>" // 再将所要打印区域内容赋值给body
				//   // document.getElementsByTagName('iframe')[0].innerHTML = inner
				//   document.body.innerHTML = inner // 再将所要打印区域内容赋值给body
				//   // document.body.printArea();
				//   setTimeout(function() {
				//     window.print() // 调用全部打印事件
				//     document.body.innerHTML = oldHtml // 将body内容再返回原页面
				//     window.location.reload() // 打印取消后刷新页面防止按钮不能点击
				//   }, 100)
				//   // }
				// })
			} else {
				const status = await printInit(3, { id: val.id })
				if (status) {
					setTimeout(() => {
						print()
					}, 500)
				}
				// ds.getMateriaProposerlList({ id: val.id }).then(async(res) => {
				//   console.log(res)
				//   if (res.data.success === true) {
				//     const list = res.data.data.ids
				//     for (const i in list) {
				//       const imgUrl = await this.getImg(list[i], 2)
				//       list[i] = imgUrl
				//     }
				//     for (let index = 0; index < list.length; index++) {
				//       inner +=
				//         "<div><img src='" +
				//         list[index] +
				//         "' style='height:100%;width:100%'/></div>"
				//     }
				//     document.body.innerHTML = inner
				//     setTimeout(function() {
				//       window.print() // 调用全部打印事件
				//       document.body.innerHTML = oldHtml // 将body内容再返回原页面
				//       window.location.reload() // 打印取消后刷新页面防止按钮不能点击
				//     }, 100)
				//   }
				// })
			}
		},
		batchDownload() {
			let ids = ''
			let th = 0
			let singleFileName = ''
			for (let index = 0; index < this.materialListData.length; index++) {
				for (let i = 0; i < this.materialListData[index].orderNeedMaterialDTOS.length; i++) {
					for (let m = 0; m < this.materialListData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS.length; m++) {
						ids += this.materialListData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[m].id + ','
						th++
						singleFileName = this.materialListData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[m].originFileName
						// console.log(this.materialListData[index].orderNeedMaterialDTOS[i].orderProposerMaterialDTOS[m])
					}
				}
			}
			ids = ids.substring(0, ids.length - 1)
			var fileName = th > 1 ? `${this.basueData.businessTypeDesc}${this.basueData.orderNum} ${this.getTime()}.zip` : singleFileName
			if (ids === '') {
				this.$message.error('当前订单没有证据材料')
				return false
			}
			this.$axios(
				'org/download-material',
				{ orderId: this.orderId, documentId: ids, downloadType: 2 },
				{ responseType: 'blob' }
			).then((blob) => {
				this.saveAs(blob, fileName)
			})
		},
		getTime() {
			const date = new Date()

			const seperator1 = '.' // 年月日之间的分隔

			const seperator2 = ':' // 时分秒之间的分隔

			const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 获取月,如果小于10,前面补个0

			const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 获取日,如果小于10,前面补个0

			const strHours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() // 获取小时,如果小于10,前面补个0

			const strMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() // 获取分,如果小于10,前面补个0

			const strSeconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 获取秒,如果小于10,前面补个0

			const currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + strHours + seperator2 + strMinutes + seperator2 + strSeconds // 拼接一下

			return currentdate // 返回
		},
		uploadFile(e) {
			if (this.formLabelAlign.type === '') {
				this.$message.error('请先选择需要上传材料的类型')
			} else {
				const file = e.file
				const fileType = file.type // 文件类型
				const typeList = [
					'image/jpeg',
					'image/jpg',
					'image/png',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'application/pdf',
					'application/msword'
				]
				const isImage = typeList.indexOf(fileType) !== -1 // 限制格式
				const isLt15M = file.size / 1024 / 1024 < 15 // 文件大小
				if (this.getFileType(e.file.name) !== 'image' && this.getFileType(e.file.name) !== 'pdf' && this.getFileType(e.file.name) !== 'word') {
					this.$message.error(
						'该文件格式不支持，请上传.doc.png.docx.jpg.jpeg.pdf扩展名文件'
					)
					return
				}

				if (!isLt15M) {
					this.$message.error('上传文件的大小应小于15M')
					return
				}
				if (this.imgURLData.length > 30) {
					this.$message.error('上传文件不能超过三十份')
					return
				}
				var formData = new FormData()
				formData.append('file', file)
				formData.append('fileType', 'order-material')
				formData.append('orderId', this.orderId)
				this.$axios('org/single-file-upload', formData, { method: 'post' }).then(
					(res) => {
						if (res.success) {
							var url = ''
							if (
								this.getFileType(res.data.originalFilename) === 'word'
							) {
								url = require('@/assets/imgs/DOCX.png')
								this.imgURLData.push(url)
							} else if (this.getFileType(res.data.originalFilename) === 'pdf') {
								url = require('@/assets/imgs/pdf.png')
								this.imgURLData.push(url)
							} else {
								const URL = window.URL || window.webkitURL
								const imgURL = URL.createObjectURL(file) // 本地url
								this.imgURLData.push(imgURL)
							}
							const data = res.data
							const ou = {
								proposerId: e.data.proposerId,
								orderId: this.orderId,
								materialCode: e.data.materialCode,
								materialFile: JSON.stringify(data),
								fileName: data.originalFilename,
								originFileName: data.originalFilename,
								fileLength: file.size,
								createTime: null,
								status: 1
							}
							this.uploadData.push(ou)
						} else {
							this.$message.error('上传文件失败')
						}
					}
				)
			}
		},
		changeType(val) {
			var u = {}
			for (const key in this.options) {
				if (this.options[key].id === val) {
					u = this.options[key]
				}
			}
			this.materialData = u
		},
		uploadMaterialConfirm() {
			if (this.formLabelAlign.type === '') {
				this.$message.error('请先选择需要上传材料的类型')
			} else {
				if (this.uploadData.length > 0) {
					addApplicationMaterial(this.uploadData).then((res) => {
						if (res.success) {
							this.getList()
							this.uploadMaterialDialogVisible = false
						}
					})
				} else {
					this.$message.error('请上传文件')
				}
			}
		},
		deleteImage(val) {
			this.imgURLData.splice(val, 1)
		}
	}
}
</script>

<style lang="less" scoped>
// /deep/ .el-icon-arrow-right:before {
//   content: "\e791";
// }
// /deep/ .el-table__expand-column {
//   /deep/ .cell {
//     padding: 0;
//   }
// }
// div{
//   overflow: hidden !important;
// }
// ul,
// p {
//   margin: 0;
//   padding: 0;
// }
// li {
//   list-style: none;
// }
// .paging_box {
//   text-align: center;
//   padding: 24px 0 4px 0;
//   display: flex;
//   flex-flow: row;
//   justify-content: center;
//   align-items: center;
//   & /deep/ .el-pager li {
//     margin-left: 10px;
//   }
//   & /deep/ .btn-next {
//     margin-left: 10px;
//   }
//   /deep/ .el-pagination__jump {
//     margin-left: 0;
//   }
// }
// .materail-list-title {
//   & .materail-list-title-text {
//     & .name-title {
//       display: flex;
//       border-bottom: solid 1px #eee;
//       line-height: 40px;
//       // padding-left: 20px;
//       .name-title-btn {
//         width: 50%;
//       }
//       .two-btn {
//         flex: 1;
//         span {
//           margin: 0 10px;
//           cursor: pointer;
//         }
//         span,
//         i {
//           color: #409eff;
//         }
//       }
//     }
//   }
// }
// .materail-list {
//   // display: none;
//   & > li {
//     display: flex;
//     align-items: center;
//     border-bottom: solid 1px #eee;
//   }
//   & .materail-name {
//     display: flex;

//     & > span {
//       display: block;
//       flex: 1;
//     }
//   }
//   .el-checkbox-group {
//     position: relative;
//     width: 50%;
//     .el-checkbox {
//       padding: 10px 0;
//       position: static;
//       display: flex;
//       align-items: center;
//     }
//   }
// }
.tree-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px 10px 30px;
	.operation-all-list {
		display: flex;
		align-items: center;
	}
}
// .operation {
//   flex: 1;
//   span {
//     margin: 0 10px;
//     cursor: pointer;
//   }
//   span,
//   i {
//     color: #409eff;
//   }
// }
// .materail-list {
//   .el-checkbox {
//     margin-left: 50px;
//   }
// }
// .name-title {
//   .name-title-btn {
//     padding-left: 15px;
//   }
// }
// .hint-tooltip {
//   display: block;
//   width: 400px;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   overflow: hidden;
//   word-break: break-all;
// }
.upload-material-dialog {
	.el-form {
		margin-left: 50px;
		.el-form-item {
			/deep/ .el-form-item__content {
				line-height: 20px;
			}
		}
	}
	.upload-image-list {
		& > div {
			margin-top: 10px;
		}
	}
}
.materail-list-main {
	margin-top: 15px;
	.list-header {
		display: flex;
		border: solid #ddd 1px;
		background: #e6f6fe;
	}
	.material-belongs {
		width: 20%;
		min-width: 200px;
		// width: 200px;
		border-right: solid 1px #ddd;
		display: flex;
		align-items: center;
		text-indent: 1em;
	}
	.material-type {
		width: 25%;
		border-right: solid 1px #ddd;
	}
	.file-name {
		flex: 1;
		border-right: solid 1px #ddd;
	}
	.operating {
		flex: 1;
	}
	.file-upload-time {
		flex: 1;
		border-right: solid #ddd 1px;
	}
}
.merge:hover {
	background: #f5f5f5;
}
.merge {
	display: flex;
	border-left: solid 1px #ddd;
	border-right: solid 1px #ddd;
	.material-belongs {
		border-bottom: solid #ddd 1px;
	}
	.other-collection {
		flex-grow: 1;
		border-bottom: solid 1px #ddd;
		overflow: hidden;
	}
	.together {
		display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
		display: -moz-box; /* Firefox 17- */
		display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
		display: -moz-flex; /* Firefox 18+ */
		display: -ms-flexbox; /* IE 10 */
		width: 100%;
		border-bottom: solid #ddd 1px;
		min-height: 50px;
		.type {
			width: 25%;
		}
	}
	.together:last-child {
		border-bottom: none;
	}
	.name {
		flex: 1;
		.name-list {
			display: flex;
			border-bottom: solid 1px #ddd;
			& > div {
				flex: 1;
				overflow: hidden;
			}
			.materail-name {
				border-right: solid 1px #ddd;
				height: 50px;
				display: flex;
				align-items: center;
				max-width: 490px;
				& > div {
					text-indent: 1em;
					// display: flex;
					// align-items: center;
					// width: 100%;
				}
				& > .img-name {
					text-indent: 0em;
					display: flex;
					flex-flow: column;
					overflow: hidden;
					span {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
		.name-list:last-child {
			border-bottom: none;
		}
	}
	.type {
		border-right: solid 1px #ddd;
		text-indent: 1em;
	}
	.btns {
		& > span {
			text-indent: 1em;
		}
	}
	.btns,
	.type {
		display: flex;
		align-items: center;
		.el-button--text {
			padding: 0;
		}
	}
}
.no-data {
	height: 60px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: solid 1px #ddd;
	border-left: solid 1px #ddd;
	border-right: solid 1px #ddd;
	color: #999;
}
.other-flex,
.other-flex-2 {
	flex: 1;
	display: flex;
	height: 58px;
	& > div {
		display: flex;
		height: 100%;
		align-items: center;
		text-indent: 1em;
	}
}
.time {
	border-right: solid 1px #ddd;
	text-indent: 1em;
	display: flex;
	align-items: center;
}
</style>
