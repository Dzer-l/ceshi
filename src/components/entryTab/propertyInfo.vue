<template>
	<div class="property-info-main">
		<!-- 房产信息-一手房 -->
		<div v-if="basicData.prodCode === 'ysf'" class="property-info">
			<h3>
				<span>房产信息</span>
				<span>
					<el-button v-if="basicData.orderStatus===201" size="small" type="primary" style="width:80px"
						:disabled="jurisdiction" @click="editPropertyInformation">{{ editText }}</el-button>
				</span>
			</h3>
			<el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm"
				size="small">
				<el-form-item label="房产地址" prop="propertySite">
					<div v-if="edit" style="white-space: nowrap">{{ ruleForm.propertySite }}</div>
					<div v-else class="edit-info-item">
						<el-input v-model="ruleForm.propertySite" />
						<div class="unit" />
					</div>
				</el-form-item>
				<el-form-item label="建筑面积" prop="constructionArea">
					<div v-if="edit">{{ ruleForm.constructionArea }}平方米</div>
					<div v-else class="edit-info-item">
						<el-input v-model.trim="ruleForm.constructionArea"
							oninput="if(value.length>0)value=value.replace(/^\.+|[^\d.]/g,'').replace(/\.{2,}/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');if(value.indexOf('.')>0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,9);if(value.indexOf('.')<0)value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').slice(0,6);if(value.indexOf('.')>6)value=value.substring(0,value.length-3)" />
						<div class="unit">平方米</div>
					</div>
				</el-form-item>
				<el-form-item label="房产价格" prop="propertyPrice">
					<div v-if="edit">{{ ruleForm.propertyPrice }}(元)人民币</div>
					<div v-else class="edit-info-item">
						<el-input v-model="ruleForm.propertyPrice" />
						<div class="unit">(元)人民币</div>
					</div>
				</el-form-item>
			</el-form>
		</div>

		<!-- 合同信息-人防车位 -->
		<div v-if="basicData.prodCode === 'rfcw'" class="property-info">
			<h3>
				<span>合同信息</span>
				<!-- <span>
					<el-button v-if="basicData.orderStatus===201" size="small" type="primary" style="width:80px"
						:disabled="jurisdiction" @click="editPropertyInformation">{{ editText }}</el-button>
				</span> -->
			</h3>
			<div class="info_content">
				<span>付款方式：{{ orderDefenseParkingContractDTO.paymentMethod | filterPaymentMethod }}</span>
			</div>
			<div class="table_item">
				<div class="table_title">合同信息</div>
				<div class="table_info">
					<!-- paymentMethod 1一次性付款，2分期付款 -->
					<div class="info">合同编号：{{ orderDefenseParkingContractDTO.contractNum}}</div>
					<div class="info">合同金额：{{ orderDefenseParkingContractDTO.contractAmount }}元</div>
					<div class="info" v-if="orderDefenseParkingContractDTO.paymentMethod == 1">
						付款截止日期：{{ orderDefenseParkingContractDTO.paymentDeadline }}
					</div>
					<div class="info" v-if="orderDefenseParkingContractDTO.paymentMethod == 2">
						分期期数：{{ orderDefenseParkingContractDTO.installmentsNum }}
					</div>
				</div>
				<div class="table_info">
					<div class="info" v-if="orderDefenseParkingContractDTO.paymentMethod == 2">
						每期金额：{{ orderDefenseParkingContractDTO.perPeriodAmount }}
					</div>
					<div class="info">物业名称：{{ orderDefenseParkingContractDTO.propertyCompany }}</div>
					<div class="info">物业费：{{ orderDefenseParkingContractDTO.propertyCosts }}元</div>
				</div>
			</div>
		</div>

		<!-- 审核类文书 -->
		<div class="property-info">
			<h3>
				<span>审核类文书</span>
				<!-- 201 待审核状态 && 文书有未审核的 -->
				<span v-if="auditStatusComputed && basicData.orderStatus === 201">
					<el-button type="primary" size="small" @click="handleAuditDocuments" :disabled="jurisdiction">审核文书
					</el-button>
				</span>
			</h3>
			<div class="table_wrapper">
				<el-table :data="notaryPaperDTOList" style="width: 100%" header-row-class-name="rowClassName" border
					cell-class-name="cellClassName">
					<el-table-column prop="notaryPaperType" label="材料类型" align="center" show-overflow-tooltip>
						<template slot-scope="{row}">
							<div>{{row.notaryPaperType | filterNotaryPaperType}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="originalFilename" label="材料名称" align="center" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="applicantMobile" label="签署状态" align="center" show-overflow-tooltip>
						<template slot-scope="{row}">
							<el-tag :type="getTagType(row.signStatus).class" size="medium">
								{{ getTagType(row.signStatus).label }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="审核状态" align="center">
						<template slot-scope="{row}">
							<el-tag :type="getAuditStatus(row.auditStatus)" size="medium">
								{{ row.auditStatus | filterAuditStatus }}
							</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="" label="操作" align="center" width="370px">
						<!-- 
							100: "初始合同",
							800: "最终合同",
							997: "公证书模板",
							998: "公证书", 
						-->
						<template slot-scope="{row}">
							<el-button v-if="row.notaryPaperType == '997'" class="el_link_button" type="text"
								:disabled="jurisdiction" size="mini" @click="handleEdit(row)">编辑</el-button>
							<el-button v-if="basicData.prodCode === 'ysf' && row.notaryPaperType == '800'" size="mini"
								:disabled="jurisdiction" class="el_link_button" type="text"
								@click="handleSetSignArea(row)">设置签名区域</el-button>
							<el-button class="el_link_button" type="text" @click="handleShowNotaryNum(row)" size="mini"
								:disabled="jurisdiction"
								v-if="basicData.prodCode === 'ysf' && row.notaryPaperType != '800' && basicData.orderStatus===306">
								查看公证书编号
							</el-button>
							<el-button
								v-if="row.notaryPaperType!='100' && row.notaryPaperType!='800'&& basicData.orderStatus != 306"
								size="mini" :disabled="jurisdiction" class="el_link_button" type="text"
								@click="handleFill(row)">
								填写公证书编号</el-button>
							<el-button v-if="row.signStatus === 0 && row.notaryPaperType=='998'" class="el_link_button" type="text"
								@click="handleStampSign(row)" size="mini" :disabled="jurisdiction">加盖签章
							</el-button>
							<el-button class="el_link_button" type="text" @click="handlePriview(row)" size="mini"
								:disabled="jurisdiction">预览
							</el-button>
							<!-- <el-link v-if="row.notaryPaperType!='100'" class="el_link_button" type="text"
								@click="handlePrint(row)">打印</el-link> -->
							<el-button class="el_link_button" type="text" @click="handleDownload(row)" size="mini"
								:disabled="jurisdiction">下载
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

		<el-dialog title="填写公证书编号" :visible.sync="dialogVisible" width="550px" :close-on-click-modal="false"
			custom-class="fill_table">
			<el-form style="width:auto;" :model="notaryNumForm" ref="notaryNumForm" :rules="notaryNumFormRules">
				<el-form-item prop="notaryNum">
					<el-input style="width: 100%;" v-model="notaryNumForm.notaryNum" placeholder="请输入公证书编号"></el-input>
				</el-form-item>
				<el-form-item style="text-align:right;">
					<el-button type="primary" @click="handleSubmit">确定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<auditDocumentsDialog :documentsList="documentsList" :visible.sync="auditDocumentsDialogShow"
			@close="auditDocumentsDialogClose" :basicData="basicData" @loadingSuccess="loadingSuccess"
			@error="handleError" />
		<iframe v-show="iframeSta" name="test" frameborder="0" />

		<!-- 设置签名区域 -->
		<setSignArea :man-list="fileSignList" :i-d="orderId" :doc-info="docInfo" :show="signBoxShow" @sucSign="init" />

		<!-- 盖章签署 -->
		<div class="set-up-a-contractor">
			<el-dialog title="选择印章的公证员" :visible.sync="setUpAContractorDialogVisible" :close-on-click-modal="false"
				width="450px">
				<div class="set-up-main">
					<el-radio-group v-model="organizer">
						<el-radio v-for="item in listOfOrganizers" :key="item.id" :label="item.id">
							{{ item.realName }}</el-radio>
					</el-radio-group>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="setUpAContractorDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="determineTheSettings">确 定</el-button>
				</span>
			</el-dialog>
		</div>

		<!-- 客服弹窗 -->
		<el-dialog :visible.sync="tipsVisible" width="380px" custom-class="customer_dialog"
			:close-on-click-modal="false" :show-close="false" append-to-body>
			<div class="header">
				<i class="el-icon-warning"></i>
				<div>所选{{ tips }}，请联系我司客服人员！使用微信扫一扫添加客服人员</div>
			</div>
			<!-- <div class="customer_desc">
				<img class="desc_bg" :src="require('../../assets/imgs/service_bg.png')" alt="">
				<div class="info">
					<div class="company">律证云科技</div>
					<div class="name">木子李</div>
				</div>
			</div> -->
			<div class="customer_image">
				<img class="customer" :src="require('../../assets/imgs/weixinCode.jpg')" alt="">
			</div>
			<!-- <div class="tips">扫描二维码，添加我的企业微信</div> -->
			<div class="footer" slot="footer">
				<el-button type="primary" size="medium" @click="tipsVisible = false">好 的</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	parkingContractInfo,
	notaryPaperPreviewImg,
	downLoadNotaryPaper,
	modifyParkingContractInfo,
	orderNotaryList,
	notaryPaperPreview,
} from '../../api/parkingSpace';
import * as newHouse from '../../api/newhouse';
import * as de from '@/api/delegate';
import auditDocumentsDialog from './auditDocuments.vue'
import { filterNotaryPaperType, filterAuditStatus, filterPaymentMethod } from '../../utils/filters';
import { printInit, print } from '../../utils/printDocuments';
import setSignArea from './setSignArea.vue';
import { showLoading, hideLoading } from "../../utils/loading";
export default {
	components: {
		auditDocumentsDialog,
		setSignArea,
	},
	filters: {
		filterNotaryPaperType,
		filterAuditStatus,
		filterPaymentMethod,
	},
	data() {
		var validAddress = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入详细地址'))
			} else if (value.length < 5) {
				callback(new Error('请输入正确的详细地址'))
			} else {
				callback()
			}
			// }
		}
		return {
			edit: true,
			basicData: '',
			ruleForm: {
				propertySite: '',
				constructionArea: '',
				propertyPrice: '',
				city: [],
				address: ''
			},
			rules: {
				propertySite: [{ required: true, validator: validAddress, trigger: 'blur' }],
				constructionArea: [
					{ required: true, message: '请输入房产面积', trigger: 'blur' }
				],
				propertyPrice: [
					{ required: true, message: '请输入房产价格', trigger: 'blur' }
				]
			},
			orderId: this.$route.query.orderId,
			cityArr: [],
			realEstateData: {},
			jurisdiction: false,


			auditDocumentsDialogShow: false,
			iframeSta: false,
			dialogVisible: false,
			// tableData: [],
			tableData: Array(2).fill({ notaryPaperType: "合同/协议" }),
			notaryNumForm: {
				notaryNum: "",
			},
			notaryNumFormRules: {
				notaryNum: [
					{ required: true, message: '请输入公证书编号', trigger: 'blur' },
					// { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
			},
			orderDefenseParkingContractDTO: {},	// 事项基本信息
			notaryPaperDTOList: [],				// 审核类文书列表
			orderHouseEntrustDTO: {},			// 一手房信息
			orderId: this.$route.query.orderId,
			documentsList: [],		// 待审核文书列表
			editRow: "",			// 选中的编辑行

			// 设置签名区域
			fileSignList: [],
			docInfo: {},
			signBoxShow: false,
			listOfOrganizers: [],	// 公证员列表
			setUpAContractorDialogVisible: false,
			tipsVisible: false,
			organizer: "",			// 加盖签章公证员
			notaryPaper: {},		// 加盖签章文书
			tips: "",
		}
	},
	computed: {
		editText: function () {
			return this.edit ? '编辑' : '保存'
		},
		auditStatusComputed() {
			// 0: "未审核",
			// 1: "审核通过",
			// 2: "审核不通过",
			if (this.documentsList.length > 0) {
				return !this.documentsList.every(i => {
					return i.auditStatus == 1
				})
				// return this.documentsList[0].auditStatus != 1
			} else {
				return false
			}
		}
	},
	created() {
		this.basicData = this.$parent.$parent.$parent.basicData
		// this.basicData.prodCode === 'ysf' && this.getData()			// 一手房-房产信息
		this.getOrderData()	// 事项信息
		this.jurisdiction = this.$parent.$parent.$parent.jurisdiction
		this.getReviewDocuments()
		this.getStampSignList()
	},
	methods: {
		// 加盖签章
		handleStampSign(row) {
			this.organizer = ''
			this.notaryPaper = row
			// this.setUpAContractorDialogVisible = true
			this.determineTheSettings()
		},

		// 加盖签章确认
		determineTheSettings() {
			console.log("加盖确认");
			console.log(this.organizer);
			// this.tipsVisible = true

			// return
			newHouse.gateSignedInterface({ notaryPaperId: this.notaryPaper.id, orderId: this.orderId }).then(res => {
				if (res.success) {
					this.$message({ type: 'success', message: '盖章签署成功' })
					this.$router.go(0)
					return
				}

				/**
				 * 20003, "没找到订单公证员信息"
				 * 20106, "公证员蓝章未上传"
				 * 80007, "公证处红章未上传"
				 * 20410, "请填写公证书编号"
				 */
				if (res.code === 20106 || res.code === 80007) {
					this.tips = res.msg
					this.tipsVisible = true
					return
				}
				this.$message.error(res.msg || "盖章签署失败，请稍后再试")
			})
		},

		// 获取公证员列表
		getStampSignList() {
			newHouse.getAListOfOrganizers().then(res => {
				if (res.success) {
					this.listOfOrganizers = res.data
				}
			})
		},

		init() {
			this.signBoxShow = false
			this.getReviewDocuments()
		},

		loadingSuccess() {
			hideLoading()
		},

		handleError(err) {
			console.log(err);
			hideLoading()
			this.$message.error("打开异常，请稍后再试")
		},

		handleShowNotaryNum(row) {
			console.log(row.notaryNum);
			this.$alert(`<p style="font-size:16px;">${row.notaryNum}</p>`, '公证书编号', {
				confirmButtonText: '确定',
				dangerouslyUseHTMLString: true,
				callback: action => {

				}
			});
		},

		// 设置签名区域
		handleSetSignArea(e) {
			de.getEntrustInfo({ orderId: this.orderId }).then(async (res) => {
				if (res.success) {
					const flieList = []
					const fileSignList = []
					for (const i of res.data.annexDTOList) {
						flieList.push({
							name: i.originFileName,
							url: i.fileName
						})
					}
					// eslint-disable-next-line no-unused-vars
					for (const [index, j] of res.data.entrustList.entries()) {
						fileSignList.push({
							realName: j.realName,
							signUserId: j.id,
							lowLeftX: 0,
							lowLeftY: 0,
							orderId: this.orderId,
							notaryPaperId: '',
							page: '',
							coverType: 2
						})
					}
					this.flieList = flieList
					this.fileSignList = fileSignList
					// this.entrustInfo = res.data;
					this.docInfo = {
						docId: e.id,
						docName: e.originalFilename,
						signStatus: e.signStatus
					}
				}
			})
		},
		// 审核文书
		handleAuditDocuments() {
			showLoading()
			this.auditDocumentsDialogShow = true
		},
		auditDocumentsDialogClose() {
			this.auditDocumentsDialogShow = false
			this.getReviewDocuments()
			this.getOrderData()
		},

		// 获取需要审核的文书列表
		async getReviewDocuments() {
			let res = await orderNotaryList(this.orderId)
			// console.log("需要审核的文书列表---", res);

			if (res.success && res.data) {
				this.documentsList = res.data
			}
		},

		// 获取事项信息 --- 一手房间和人防车位
		async getOrderData() {
			let res = await parkingContractInfo(this.orderId)
			console.log(res, "获取事项信息");
			if (res.success && res.data) {
				this.orderDefenseParkingContractDTO = res.data.orderDefenseParkingContractDTO	// 人防车位信息
				this.notaryPaperDTOList = res.data.notaryPaperDTOList							// 审核类文书列表
				// this.orderHouseEntrustDTO = res.data.orderHouseEntrustDTO						// 一手房信息
				let { orderHouseEntrustDTO } = res.data
				if (orderHouseEntrustDTO) {
					this.realEstateData = orderHouseEntrustDTO
					this.ruleForm.propertySite = orderHouseEntrustDTO.detailAddress
					this.ruleForm.constructionArea = orderHouseEntrustDTO.constructionArea
					this.ruleForm.propertyPrice = orderHouseEntrustDTO.targetAmount
				}
			}
		},

		// 预览合同
		async handlePriview(row, needReturn = false) {
			console.log(row);
			showLoading()
			const imagelist = []
			let res = await notaryPaperPreview(row.id)
			// console.log(res);
			if (res.success && res.data && res.data.data.ids.length > 0) {
				const imageIdList = res.data.data.ids
				for (const item of imageIdList) {
					let imageBase64 = await this.getImageBase64(item)
					imagelist.push(imageBase64)
				}
				hideLoading()
				if (needReturn) return imagelist
				this.$store.commit('app/CHANGE_IMAGE', imagelist)
			} else {
				hideLoading()
				return false
			}
		},

		// 根据材料id获取材料base64
		async getImageBase64(id) {
			let res = await notaryPaperPreviewImg({ id })
			if (res.success && res.data) {
				return 'data:image/png;base64,' + res.data
			}
		},

		// 编辑
		handleEdit(row) {
			console.log(row);
			this.editRow = row
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
			window.open(`${this.http}/page/go-open-notary-paper/${this.orderId}/${row.id}`, 'test')
			// window.open(`https://test-onlyoffice.lvzhengyun.cn/page/go-open-notary-paper/1428242986871603202/1428245714649792514`, 'test')

			let websocket
			let _this = this
			if ('WebSocket' in window) {
				websocket = new WebSocket(process.env.VUE_APP_BASE_WEBSOCKET_WSS + '/websocket/' + row.id)
			}

			websocket.onopen = function () {
				console.log('连接成功')
			}

			websocket.onclose = function () {
				console.log('退出连接')
			}

			websocket.onmessage = async function (event) {
				// console.log("收到消息-----" + event.data);
				if (event.data !== '连接成功') {
					if (JSON.parse(event.data) == "success") { // 文件已经保存的标记
						_this.getOrderData()
						_this.getReviewDocuments()
					}
				}
			}

			websocket.onerror = function () {
				console.log('连接出错')
			}
		},

		// 填写公证书编号
		handleFill(row) {
			this.editRow = row
			this.dialogVisible = true
		},
		handleSubmit() {
			console.log(this.editRow);
			this.$refs.notaryNumForm.validate(async (valid) => {
				if (valid) {
					let res = await modifyParkingContractInfo({
						id: this.editRow.id,
						notaryNum: this.notaryNumForm.notaryNum,
					})

					if (res.success) {
						this.$message.success("填写公证书编号成功！")
						this.dialogVisible = false
						this.getOrderData()
						this.getReviewDocuments()
						return
					}

					this.$message.error(res.msg || "填写公证书编号失败，请稍后再试！")
				} else {
					return false;
				}
			});
		},

		// 打印合同
		async handlePrint(row) {
			console.log(row);
			let imageList = await this.handlePriview(row, true)
			// console.log(imageList);

			if (imageList) {
				await printInit(imageList)
				print()
				return
			}

			this.$message.error("打印失败")
		},

		// 下载合同
		async handleDownload(row) {
			let data = {
				orderId: this.orderId,
				notaryPaperId: row.id,
			}
			let res = await downLoadNotaryPaper(data)
			console.log(res);
			if (res.type === "application/octet-stream") {
				this.$message.success("下载成功")
				this.saveAs(res, row.originalFilename)
				return
			}

			this.$message.error(res.msg || "下载失败，请稍后再试")
		},

		// 获取tag类型
		getTagType(val) {
			const type = {
				0: { label: "未签署", class: "danger" },
				1: { label: "部分签署", class: "warning" },
				2: { label: "已签署", class: "success" },
				default: { label: "-", class: "info" },
			}
			if (type[val]) {
				return type[val]
			}
			return type.default
		},

		// 获取tag类型
		getAuditStatus(val) {
			const type = {
				0: "warning",
				1: "success",
				2: "danger",
				default: "info",
			}
			if (type[val]) {
				return type[val]
			}
			return type.default
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

		// 旧的获取一手房信息
		// getData() {
		// 	newHouse.getRealEstateInformation({ orderId: this.orderId }).then(res => {
		// 		if (res.success) {
		// 			this.realEstateData = res.data
		// 			newHouse.getUrbanAreaTree().then(val => {
		// 			  if (val.data && val.success) {
		// 			    this.cityArr = val.data[0].children
		// 			    const arr = this.findAnArrayOfCities(this.cityArr, res.data.regionCode)
		// 			    this.ruleForm.city = arr.length !== 0 ? (arr.length === 2 ? [arr[0].code, arr[1].code] : [arr[0].code, arr[1].code, arr[2].code]) : ''
		// 			  }
		// 			})
		// 			this.ruleForm.propertySite = res.data.detailAddress
		// 			this.ruleForm.constructionArea = res.data.constructionArea
		// 			this.ruleForm.propertyPrice = res.data.targetAmount
		// 			this.ruleForm.address = res.data.address
		// 		}
		// 	})
		// },
		editPropertyInformation() {
			if (this.edit) {
				this.edit = !this.edit
			} else {
				this.$refs['ruleForm'].validate(valid => {
					if (valid) {
						// let cityList = this.cityArr
						// const arr = this.ruleForm.city.map(function(val, i, arr) {
						//   for (var itm of cityList) {
						//     if (itm.code === val) {
						//       cityList = itm.children
						//       return itm
						//     }
						//   }
						// })
						// const addrDesc = arr.length === 2 ? arr[0].name + arr[1].name : arr[0].name + arr[1].name + arr[2].name
						const data = {
							id: this.realEstateData.id,
							orderId: this.orderId,
							regionCode: null,
							detailAddress: this.ruleForm.propertySite,
							address: null,
							targetAmount: this.ruleForm.propertyPrice,
							constructionArea: this.ruleForm.constructionArea
						}
						newHouse.editPropertyInformation(data).then(res => {
							if (res.success) {
								this.getOrderData()
								this.edit = !this.edit
							}
						})
					}
				})
			}
		}
		// findAnArrayOfCities(arr1, code) {
		//   const temp = []
		//   if (!code) {
		//     return temp
		//   }
		//   var forFn = function(arr, code) {
		//     for (var i = 0; i < arr.length; i++) {
		//       var item = arr[i]
		//       if (item.code === code) {
		//         temp.push(item)
		//         break
		//       } else {
		//         if (item.children) {
		//           forFn(item.children, code)
		//         }
		//       }
		//     }
		//   }
		//   forFn(arr1, code)
		//   const name = []
		//   var forName = function(arrar, id) {
		//     for (var i = 0; i < arrar.length; i++) {
		//       var item = arrar[i]
		//       if (item.id === id) {
		//         name.unshift(item)
		//         forName(arr1, item.parentId)
		//       } else {
		//         if (item.children) {
		//           forName(item.children, id)
		//         }
		//       }
		//     }
		//   }
		//   forName(arr1, temp[0].id)
		//   return name
		// }
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.$refs.notaryNumForm.clearValidate()
				this.notaryNumForm.notaryNum = ""
			}
		},
		notaryPaperDTOList(val) {
			let result = val.every(i => {
				return i.signStatus !== 0
			})

			this.$emit("signStatusFinish", result)
		}
	},
}
</script>

<style lang="less" scoped>
/deep/ .set-up-main {
	.el-radio-group {
		width: 100%;
		margin-top: -20px;
		max-height: 300px;
		overflow-y: scroll;
		.el-radio {
			display: block;
			height: 60px;
			margin: 0;
			border-bottom: #eee 1px solid;
			display: flex;
			align-items: center;
			padding-left: 10px;
		}
	}
}
.el_link_button {
	margin: 0 4px;
	font-size: 14px;
}
/deep/ .rowClassName > th {
	color: #303133;
	background: #e6f6fe !important;
}
/deep/ .cellClassName {
	padding: 6px 0;
}
.table_wrapper {
	margin-top: 20px;
}
.property-info-main {
	.property-info {
		margin-bottom: 30px;
		h3 {
			display: flex;
			justify-content: space-between;
			position: relative;
			padding-left: 10px;
			padding-right: 20px;
		}
		h3::before {
			content: "";
			width: 3px;
			height: 19px;
			background: #1989fa;
			position: absolute;
			left: 2px;
		}
	}
	.el-form {
		width: 600px;
		.el-form-item {
			/deep/ .el-form-item__label {
				color: #999;
			}
			/deep/ .el-form-item__label::before {
				display: none;
			}
		}
		.edit-info-item {
			display: flex;
			/deep/ .el-input {
				flex: 1;
			}
			.unit {
				width: 100px;
				padding-left: 8px;
			}
		}
	}
}
.info_content {
	padding-left: 8px;
}
.table_item {
	margin: 15px 0 40px 0;
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
/deep/.fill_table {
	.el-dialog__body {
		padding-bottom: 10px;
	}
}
/deep/ .customer_dialog {
	border-radius: 4px;
	.el-dialog__body {
		padding: 20px;
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
	}
	.header {
		font-size: 14px;
		display: flex;
		align-items: center;
		line-height: 20px;
		.el-icon-warning {
			color: #faad14;
			font-size: 24px;
			padding-right: 8px;
		}
	}

	.customer_desc {
		width: 280px;
		height: 100px;
		margin: 10px 30px 0 30px;
		box-sizing: border-box;
		background-size: cover;
		background-repeat: no-repeat;
		color: #fff;
		overflow: hidden;
		position: relative;
		.desc_bg {
			width: 100%;
			height: 100%;
			filter: blur(1px);
		}
		.info {
			padding: 20px;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.company {
				font-size: 14px;
				margin-bottom: 20px;
			}
			.name {
				font-size: 16px;
				font-weight: 600;
			}
		}
	}

	.customer_image {
		text-align: center;
		margin: 10px 0;
		.customer {
			// width: 150px;
			// height: 150px;
			width: 250px;
			height: 400px;
			background: #eee;
		}
	}

	.tips {
		text-align: center;
	}

	.footer {
		text-align: center;
		.el-button {
			width: 80px;
		}
	}
}
</style>
