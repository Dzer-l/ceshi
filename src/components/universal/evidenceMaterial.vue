<template>
	<div v-loading.fullscreen.lock="fullscreenLoading" class="evidence-material-main">
		<div class="tree-main">
			<div class="tree-header">
				<div class="operation-all-list"></div>
				<el-row>
					<el-button type="primary" size="medium" :disabled="jurisdiction" @click="batchDownload">一键下载
					</el-button>
				</el-row>
			</div>
			<div class="materail-list-main">
				<div class="list-header">
					<div class="material-belongs">材料归属</div>
					<div class="material-type">材料类型</div>
					<div class="file-name">文件名称</div>
					<div class="operating">操作</div>
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
													<p>{{ arr.originFileName }}</p>
												</el-tooltip>
											</div>
										</div>
										<div class="btns">
											<span>
												<el-button type="text" @click="download(arr)">下载</el-button>
												<el-button v-if="judgeFileFormat(arr.originFileName)" type="text" @click="previewFile(arr)">预览</el-button>
												<!-- <el-button type="text" @click="deleteMaterials(arr)">删除</el-button> -->
												<el-button v-if="judgeFileFormat(arr.originFileName)" type="text" @click="printMaterial(arr)">打印</el-button>
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
		</div>
	</div>
</template>

<script>
import {
	getEvidenceMaterial,  // 获取证据材料列表（旧）
	getEntryDateil,  // 获取订单详情（旧）
	previewMaterials,  // 预览图片（旧）
	DeleteMaterials,  // 删除证据材料（旧）
	getAllTypeMaterial,  // 获取订单所有关系人下的材料类型及材料文件（旧）
	addApplicationMaterial  // 订单新增关系人材料（旧）
} from '../../api/cloudMail'

import {
	getUniversalMaterialList,  // 证据材料查询
	getUniversalOrderDetail,   // 订单详情
	getUniversalDocumentPreviewImg,  // 文书材料预览图片
} from '../../api/universal'

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
		judgeFileFormat(str){
			let is_button=true
			let videoSuffixData=['avi','wmv','mpg','mpeg','mov','rm','ram','swf','flv','mp4','m2v','mkv','rmvb','m4v']
			for(let i of videoSuffixData){
				if(str.includes(i)){
					is_button=false
				}
			}
			return is_button
		},
		// 获取列表
		getList() {
			var data = {
				orderId: this.orderId,
				pageNum: this.currentPage3,
				pageSize: this.pageSize
			}

			// 新增加
			getUniversalOrderDetail(data).then((res) => {
				this.basueData = res.data
				getUniversalMaterialList(data).then((res) => {
					if (res.success) {
						this.materialListData = res.data
						// this.total = res.data.total
					}
				})
			})

			// 原来的
			// getEntryDateil(data).then((res) => {
			// 	this.basueData = res.data
			// 	getEvidenceMaterial(data).then((res) => {
			// 		if (res.success) {
			// 			this.materialListData = res.data
			// 			// this.total = res.data.total
			// 		}
			// 	})
			// })
		},

		// 文书下载（单个）
		download(val) {
			console.log(val)
			var downloadType = 2
			var fileName = val.originFileName
			this.$axios(
				'org/acceptance-download-material',	// 文书下载地址
				{ orderId: this.orderId, documentId: val.id, downloadType: downloadType },
				{ responseType: 'blob' }
			).then((blob) => {
				console.log(blob)
				console.log(fileName);
				this.saveAs(blob, fileName)
				this.getList()
			})
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

		// 获取文件后缀
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

		// 预览图片
		previewFile(items) {
			if (this.getFileType(items.originFileName) === 'excel') {
				this.$message({ message: '该文件暂不支持预览', type: 'warning' })
				return false
			}
			this.fullscreenLoading = true
			console.log(this.getFileType(items.originFileName))
			if (this.getFileType(items.originFileName) === 'image') {

				// 预览图片函数
				getUniversalDocumentPreviewImg({ id: items.id }).then((res) => {
					console.log(res)
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
					this.getList()
				})
			} else {
				// console.log(items.id);
				this.$axios(`org/acceptance-order-proposer-material-preview/${items.id}`).then(async res=>{
					if (res.data.success === true) {
						const list = res.data.data.ids
						for (const i in list) {
							const imgUrl = await this.getImg(list[i], 2)
							list[i] = imgUrl
						}
						this.fullscreenLoading = false
						this.$store.commit('app/CHANGE_IMAGE', list)
						this.getList()
					}
				})
				// ds.getMateriaProposerlList({ id:  }).then(async (res) => {
				// 	console.log(res)
				// 	if (res.data.success === true) {
				// 		const list = res.data.data.ids
				// 		for (const i in list) {
				// 			const imgUrl = await this.getImg(list[i], 2)
				// 			list[i] = imgUrl
				// 		}
				// 		this.fullscreenLoading = false
				// 		this.$store.commit('app/CHANGE_IMAGE', list)
				// 	}
				// })
			}
		},

		// 获取图片地址
		async getImg(id, type) {
			const url =
				type === 1
					? `org/acceptance-order-proposer-material-preview/${id}`
					: `org/acceptance-order-proposer-material-preview-word-img/${id}`
			return await this.$axios(url).then(async (res) => {
				if (res.success) {
					return 'data:image/png;base64,' + res.data
				}
			})
		},

		// 打印材料
		async printMaterial(val) {
			// console.log(document.getElementsByTagName('iframe')[0])
			if (this.getFileType(val.originFileName) !== 'image' && this.getFileType(val.originFileName) !== 'word') {
				this.$message({ message: '该文件暂不支持打印', type: 'warning' })
				return false
			}
			if (this.getFileType(val.originFileName) === 'image') {
				const status = await printInit(1, { id: val.id })
				console.log(val.id)
				if (status) {
					setTimeout(() => {
						print()
					}, 500)
				}
			} else {
				const status = await printInit(3, { id: val.id })
				if (status) {
					setTimeout(() => {
						print()
					}, 500)
				}
			}
		},

		// 一键下载
		batchDownload() {
			// var fileName = `${this.basueData.businessTypeDesc}${this.basueData.orderNum} ${this.getTime()}.zip`
			var fileName = `证据文件${this.basueData.orderNum} ${this.getTime()}.zip`
			console.log(fileName);
			let ids = ''
			for(const index of this.materialListData){
				if(index.orderNeedMaterialDTOS!==null){
					for (const i of index.orderNeedMaterialDTOS) {
						if(i.orderProposerMaterialDTOS!==null){
							for (const m of i.orderProposerMaterialDTOS) {
								ids+=m.id+','
							}
						}
					}
				}
			}
			ids = ids.substring(0, ids.length - 1)
			this.$axios(
				'org/acceptance-download-material',
				{ orderId: this.orderId, documentId: ids, downloadType: 2 },
				{ responseType: 'blob' }
			).then((blob) => {
				console.log(blob)
				this.saveAs(blob, fileName)
				this.getList()
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
		& > div {
			padding: 20px 10px;
		}
	}
	.material-belongs {
		width: 25%;
		min-width: 200px;
		// width: 200px;
		border-right: solid 1px #ddd;
		display: flex;
		align-items: center;
		padding-left: 10px;
	}
	.material-type {
		width: 25%;
		border-right: solid 1px #ddd;
	}
	.file-name {
		width: 25%;
		border-right: solid 1px #ddd;
	}
	.operating {
		flex: 1;
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
			width: 33.33%;
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
				& > div {
					padding-left: 10px;
					// display: flex;
					// align-items: center;
					// width: 100%;
				}
				& > .img-name {
					p {
						min-width: 100px;
						max-width: 350px;
						overflow: hidden;

						white-space: nowrap;

						text-overflow: ellipsis;

						-o-text-overflow: ellipsis;
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
		padding-left: 10px;
	}
	.btns {
		& > span {
			padding-left: 10px;
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
</style>
