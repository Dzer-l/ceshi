<template>
	<div class="container">
		<div class="content">
			<div class="go_back_btn">
				<el-button type="primary" size="small" style="width:80px;" @click="goBack">返 回</el-button>
			</div>

			<!-- 寄件人 -->
			<div class="sender_content">
				<div class="title_wrap">
					<el-row>
						<el-col :span="19">
							<div class="title">寄件人</div>
						</el-col>
						<el-col :span="5">
							<div class="button_wrap">
								<el-button type="primary" icon="el-icon-document" size="mini"
									@click="handleAddressBookShow">地址簿</el-button>
							</div>
						</el-col>
					</el-row>
				</div>

				<!-- 寄件人表单 -->
				<div class="form_wrap">
					<el-form label-position="right" label-width="100px" :model="senderData" :rules="addressFormRules"
						ref="senderDataForm">
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="姓名" prop="name">
									<el-input maxlength="30" v-model="senderData.name" placeholder="请输入姓名"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="公司名称" prop="companyName">
									<el-input maxlength="35" v-model="senderData.companyName" placeholder="请输入公司名称（选填）">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="手机号码" prop="contactNumber"
									:rules="contactNumberRules(senderData.contactNumber,senderData.fixedLine)">
									<el-input maxlength="11" v-model="senderData.contactNumber"
										placeholder="手机号码与固话必填一个"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="固话号码" prop="fixedLine"
									:rules="fixedLineRules(senderData.fixedLine,senderData.contactNumber)">
									<el-input maxlength="20" v-model="senderData.fixedLine"
										placeholder="手机号码与固话必填一个，固话需带 - " oninput="value=value.replace(/[^\d-]/g,'')">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="省/市/区(县)" prop="regionCodeArr">
									<el-cascader ref="cityCascader" style="width:100%"
										v-model="senderData.regionCodeArr" placeholder="请选择省市区（县）" :options="cityList"
										:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
										@change="handleChange($event)">
									</el-cascader>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="详细地址" prop="detailAddress">
									<el-input maxlength="120" v-model="senderData.detailAddress" placeholder="请输入详细地址">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>

			<!-- 收件人 -->
			<div class="addressee_content">
				<div class="title_wrap">
					<div class="title">收件人</div>
				</div>
				<div class="addressee_form">
					<el-table :data="receiverTableData" style="width: 100%" header-row-class-name="header_row_name"
						row-class-name="row-class-name">
						<el-table-column prop="receiveName" label="姓名" width="180">
						</el-table-column>
						<el-table-column prop="receiveMobile" label="手机号码">
						</el-table-column>
						<el-table-column prop="receiveFixedLine" label="固话号码">
						</el-table-column>
						<el-table-column prop="receiveCompany" label="公司名称">
						</el-table-column>
						<el-table-column label="地址" show-overflow-tooltip>
							<template slot-scope="{row}">
								<div>{{row.receiveAddress}}</div>
								<div>{{row.receiveDetailAddress}}</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-link class="link_btn" type="primary" @click="handleEdit(scope.$index, scope.row)">
									完善修改</el-link>
								<el-link type="primary" @click="handleDetail(scope.$index, scope.row)">查看申请信息</el-link>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<!-- 快递信息 -->
			<div class="sender_content">
				<div class="title_wrap">
					<div class="title">快递信息</div>
				</div>
				<div class="form_wrap">
					<el-form label-position="right" label-width="110px" :model="expressInfo" ref="expressInfoForm"
						:rules="expressInfoFormRules">
						<el-row :gutter="50">
							<el-col :span="12" :offset="0">
								<el-form-item label="快递公司" prop="expressCompany">
									<el-select placeholder="请选择快递公司" v-model="expressInfo.expressCompany"
										style="width: 100%">
										<el-option v-for="item in expressCompanyListCom" :label="item.label"
											:value="item.value" :key="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item prop="expressMethod" label="取件方式"
									v-if="expressCompanyCom=='ems'||expressCompanyCom==''">
									<el-select placeholder="请选择取件方式" v-model="expressInfo.expressMethod"
										style="width: 100%">
										<el-option v-for="item in expressMethodList" :label="item.label"
											:value="item.value" :key="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="取件方式" v-if="expressCompanyCom=='shunfeng'">
									<el-input v-model="expressInfo.expressMethodStr" placeholder="上门取件" disabled>
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="50">
							<el-col :span="12" :offset="0">
								<el-form-item label="预约上门时间" v-if="expressMethodCom===1||expressMethodCom===''"
									prop="selectTime">
									<el-popover placement="top" width="420" trigger="click" v-model="popoverVisible">
										<el-input slot="reference" v-model="expressInfo.selectTime"
											placeholder="请选择预约上门时间">
										</el-input>
										<div style="padding:10px;text-align:center;min-height: 200px;">
											<el-radio-group v-model="expressTimeMark" @change="handleTimeChange($event)"
												style="margin-bottom:5px">
												<el-radio-button label="1">今天</el-radio-button>
												<el-radio-button label="2">明天</el-radio-button>
												<el-radio-button label="3">后天</el-radio-button>
											</el-radio-group>
											<div>
												<el-row>
													<el-col :span="8" v-for="(item,i) in timeList" :key="i">
														<span class="time_select"
															:class="{'time_select_active':selectActive(i,expressTimeMark)}"
															@click="handleSelectTime($event,i)">{{ item }}</span>
													</el-col>
												</el-row>
											</div>
										</div>
									</el-popover>
								</el-form-item>
								<el-form-item prop="selectTime" label="预约上门时间" v-if="expressMethodCom===0">
									<el-input v-model="expressInfo.selectTime" placeholder="定时揽收" disabled></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="运费支付方式" prop="payMethod">
									<el-select placeholder="请选择运费支付方式" v-model="expressInfo.payMethod"
										style="width: 100%">
										<el-option v-for="item in payMethodListCom" :label="item.label"
											:value="item.value" :key="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="50">
							<el-col :span="12" :offset="0">
								<el-form-item label="物品类型" prop="packageCategory">
									<el-select clearable v-model="expressInfo.packageCategory" style="width: 100%"
										placeholder="请选择选择物品类型">
										<el-option v-for="item in packageCategoryList" :label="item.label"
											:value="item.value" :key="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="物品信息" prop="remark">
									<el-input maxlength="80" clearable v-model="expressInfo.remark"
										placeholder="请输入文件名称或文件内容的简述">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>

			<!-- 呼叫快递按钮 -->
			<div class="footer_button_content">
				<el-button type="primary" size="default" @click="handleCallMail('senderDataForm','expressInfoForm')">
					呼叫快递</el-button>
			</div>
		</div>

		<!-- 地址簿弹窗 -->
		<el-dialog title="从地址簿选择" :visible.sync="addressDialog" width="980px" @close="addressDialog = false"
			custom-class="address_dialog">
			<el-table :data="addressList" header-row-class-name="address_dialog_table_header"
				cell-class-name="address_dialog_table_cell" highlight-current-row @current-change="handleCurrentSelect">
				<el-table-column type="index" width="45" align="center">
				</el-table-column>
				<el-table-column label="联系人" width="110" show-overflow-tooltip>
					<template slot-scope="scope">
						<div class="scope_title text_ellipsis">{{scope.row.name}}</div>
						<div class="scope_info text_ellipsis">{{scope.row.contactNumber}}</div>
					</template>
				</el-table-column>
				<el-table-column property="fixedLine" label="固话号码" width="140" show-overflow-tooltip>
				</el-table-column>
				<el-table-column property="companyName" show-overflow-tooltip label="公司名称" width="180">
				</el-table-column>
				<el-table-column label="地址" show-overflow-tooltip width="260">
					<template slot-scope="scope">
						<div class="scope_title text_ellipsis">{{scope.row.address}}</div>
						<div class="scope_info text_ellipsis">{{scope.row.detailAddress}}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="150">
					<template slot-scope="scope">
						<el-link type="primary" @click.stop="handleAddressEdit(scope.$index, scope.row)"
							style="display:inline-block;margin:0 10px;">修改</el-link>
						<el-link type="danger" @click.stop="handleAddressDelete(scope.$index, scope.row)">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" style="text-align:center;">
				<div class="pagination_wrap">
					<el-pagination @current-change="handleCurrentChange" :current-page.sync="addressPagination.pageNum"
						:page-size="addressPagination.pageSize" layout="total, prev, pager, next" :total="addressTotal">
					</el-pagination>
				</div>
				<el-button :disabled="!selectAddress" style="width:200px;" :type="selectAddress?'primary':'info'"
					@click="handleAddreddComfirm">
					确定</el-button>
			</div>
		</el-dialog>

		<!-- 地址簿内层弹窗 -->
		<el-dialog width="510px" title="编辑地址" :visible.sync="addressInnerVisible" append-to-body
			custom-class="address_dialog">
			<el-form style="margin-top:30px;" :rules="addressFormRules" label-position="right" label-width="110px"
				:model="addressInnerFormData" ref="addressInnerForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addressInnerFormData.name" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="contactNumber"
					:rules="contactNumberRules(addressInnerFormData.contactNumber,addressInnerFormData.fixedLine)">
					<el-input maxlength="11" v-model="addressInnerFormData.contactNumber" placeholder="请输入手机号码"
						oninput="value=value.replace(/[^\d]/g,'')"></el-input>
				</el-form-item>
				<el-form-item label="固话号码" prop="fixedLine"
					:rules="fixedLineRules(addressInnerFormData.fixedLine,addressInnerFormData.contactNumber)">
					<el-input maxlength="20" v-model="addressInnerFormData.fixedLine"
						placeholder="手机号码与固话号码必填一个，固话带区号和 -" oninput="value=value.replace(/[^\d-]/g,'')"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="companyName">
					<el-input maxlength="35" v-model="addressInnerFormData.companyName" placeholder="请输入公司名称（选填）">
					</el-input>
				</el-form-item>
				<el-form-item label="省市区（县）" prop="regionCodeArr">
					<el-cascader ref="cityCascader" style="width:100%" v-model="addressInnerFormData.regionCodeArr"
						placeholder="请选择省市区（县）" :options="cityList"
						:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
						@change="handleChangeInner($event)">
					</el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="detailAddress">
					<el-input maxlength="120" type="textarea" v-model="addressInnerFormData.detailAddress"
						placeholder="请输入详细地址，如xx街道xx路xx"
						@input="handleInput($event,'addressInnerFormData','detailAddress')"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" style="padding-right:20px;">
				<el-button size="medium" type="default" @click="handleInnerDialogCancle('addressInnerForm')">取消
				</el-button>
				<el-button size="medium" type="primary" @click="handleInnerDialogComfirm('addressInnerForm')">确定
				</el-button>
			</div>
		</el-dialog>

		<!-- 完善修改弹窗 -->
		<el-dialog width="510px" title="编辑地址" :visible.sync="improveDialog" append-to-body
			custom-class="address_dialog">
			<el-form style="margin-top:30px;" label-position="right" label-width="110px"
				:model="receiverImproveDialogData" :rules="receiverImproveFormRules" ref="receiverImproveForm">
				<el-form-item label="姓名" prop="receiveName">
					<el-input maxlength="30" v-model="receiverImproveDialogData.receiveName" placeholder="请输入姓名">
					</el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="receiveMobile"
					:rules="contactNumberRules(receiverImproveDialogData.receiveMobile,receiverImproveDialogData.receiveFixedLine)">
					<el-input maxlength="11" v-model="receiverImproveDialogData.receiveMobile" placeholder="请输入手机号码"
						oninput="value=value.replace(/[^\d]/g,'')">
					</el-input>
				</el-form-item>
				<el-form-item label="固话号码" prop="receiveFixedLine"
					:rules="fixedLineRules(receiverImproveDialogData.receiveFixedLine,receiverImproveDialogData.receiveMobile)">
					<el-input maxlength="20" v-model="receiverImproveDialogData.receiveFixedLine"
						placeholder="手机号码与固话号码必填一个，固话带区号和 -" oninput="value=value.replace(/[^\d-]/g,'')">
					</el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="receiveCompany">
					<el-input maxlength="35" v-model="receiverImproveDialogData.receiveCompany"
						placeholder="请输入公司名称（选填）"></el-input>
				</el-form-item>
				<el-form-item label="省市区（县）" prop="receiveRegionCodeArr">
					<el-cascader ref="cityCascader" style="width:100%"
						v-model="receiverImproveDialogData.receiveRegionCodeArr" placeholder="请选择省市区（县）"
						:options="cityList" :props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
						@change="handleChangeReceiverImprove($event)">
					</el-cascader>
				</el-form-item>
				<el-form-item label="详细地址" prop="receiveDetailAddress">
					<el-input maxlength="120" type="textarea" v-model="receiverImproveDialogData.receiveDetailAddress"
						@input="handleInput($event,'receiverImproveDialogData','receiveDetailAddress')"
						placeholder="请输入详细地址，如xx街道xx路xx">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" style="padding-right:20px;">
				<el-button size="medium" type="default" @click="handleImproveDialogCancle('receiverImproveForm')">取消
				</el-button>
				<el-button size="medium" type="primary" @click="handleImproveDialogComfirm('receiverImproveForm')">确定
				</el-button>
			</div>
		</el-dialog>

		<!-- 申请人弹窗 -->
		<applicant-dialog @applicantShowChange="applicantShowChange" :applicantShow="applicantShow"
			:litigantTableData="litigantTableData"></applicant-dialog>
	</div>
</template>

<script>
import {
	getCityRegionTree,
	getCityParents,
	getAddressBookList,
	updateExpressAddress,
	deleteExpressAddress,
} from '../../api/addressBook';

import {
	getReceiverAddressList,
	updateExpressReceiverAddress,
	getOnlineMailListDetail,
	callExpress,
	getDeafultSenderAddress
} from '../../api/mailManage';

import {
	addressFormRules,
	receiverImproveFormRules,
	expressInfoFormRules,
	validPhoneComputed,
	validFixlineComputed
} from '../../utils/validate';
import applicantDialog from '../../components/mailManage/applicantDialog';
var moment = require('moment');
export default {
	components: {
		applicantDialog
	},
	data() {
		return {
			senderData: {	// 寄件人信息
				name: "",
				companyName: "",
				contactNumber: "",
				fixedLine: "",
				detailAddress: "",
				address: "",
				regionCode: "",
				regionCodeArr: [],
			},

			receiverTableData: [],	// 收件人列表信息

			// 地址bu
			addressDialog: false,
			addressInnerVisible: false,
			addressList: [],	// 地址bu列表
			addressPagination: {	// 地址bu分页
				pageNum: 1,
				pageSize: 8,
			},
			addressTotal: 50,
			selectAddress: "",	// 选中的地址

			//内层弹窗数据
			addressInnerFormData: {
				name: "",
				contactNumber: "",
				fixedLine: "",
				companyName: "",
				detailAddress: "",
				regionCode: "",
				regionCodeArr: [],
			},
			addressFormRules,	// 内层弹窗 / 寄件人表单 校验

			// 完善修改弹窗数据
			improveDialog: false,
			receiverImproveDialogData: {
				receiveName: "",
				receiveMobile: "",
				receiveFixedLine: "",
				receiveCompany: "",
				receiveAddress: "",
				receiveDetailAddress: "",
				receiveRegionCode: "",
				receiveRegionCodeArr: [],
			},
			receiverImproveFormRules, // 完善修改弹窗校验

			applicantShow: false,	// 申请人信息弹窗
			litigantTableData: [],
			cityList: [],

			expressTimeMark: 1,	// 今天明天后天标记
			timeSelectIndex: null,
			preMark: "",
			timeList: [],	// 快递可选时间段
			selectTime: "",	// 快递选择的时间段
			selectDay: "",	// 快递选择的日期
			expressInfo: {	// 快递提交表单
				expressCompany: "",
				expressMethod: "",
				selectTime: "",
				payMethod: "",
				packageCategory: 0,
				remark: "",
				range: "",	// 时间范围
				expressMethodStr: "上门取件"
			},
			expressInfoFormRules,// 快递提交表单校验
			expressCompanyList: "",
			// expressCompanyList: [	// 快递公司
			// 	{ label: "中国邮政", value: "ems" },
			// 	{ label: "顺丰速运", value: "shunfeng" },
			// ],
			expressMethodList: [	// 取件方式
				{ label: "固定地址揽收", value: 0 },
				{ label: "预约上门揽收", value: 1 },
			],
			payMethodList: [	// 运费支付方式
				{ label: "寄付月结", value: 1 },
				{ label: "收方付", value: 2 },
				{ label: "第三方付", value: 3 },
				{ label: "寄付现结", value: 4 },
			],
			packageCategoryList: [ // 物品类型
				{ label: "文件", value: 0 },
			],
			orgId: "",	// 公证处id
			isCall: false,
			popoverVisible: false,
			from: "",
			fromOrderId: "",
		}
	},
	computed: {
		expressMethodCom() { // 取件方式
			this.$nextTick(() => {
				this.expressInfo.selectTime = this.expressInfo.expressMethod === 0 ? "定时揽收" : ""
				this.expressTimeMark = 1
				if (this.orgId == 1) this.expressInfo.payMethod = this.expressInfo.expressMethod === 1 ? 2 : 1	// 坪山预约上门揽收
				// if (this.orgId == 2) this.expressInfo.payMethod = this.expressInfo.expressMethod === 0 ? 2 : 1  // 市处

				this.$refs["expressInfoForm"].clearValidate("selectTime")
			})
			return this.expressInfo.expressMethod
		},
		expressCompanyCom() { // 快递公司
			this.expressInfo.expressMethod = this.expressInfo.expressCompany == "shunfeng" ? 1 : 0  // 顺丰付款方式
			if (this.expressInfo.expressCompany == "shunfeng" && this.orgId == 1) this.expressInfo.payMethod = 1  // 坪山 + 顺丰付款方式

			this.expressInfo.expressCompany == "shunfeng" ? this.generatorTime(8, 20, "", ":30") : this.generatorTime(9, 18)
			return this.expressInfo.expressCompany || ""
		},
		payMethodListCom() {  // 运费支付方式
			if (this.expressInfo.expressCompany == "ems" || this.expressInfo.expressCompany == "") {
				return [
					{ label: "寄付现结", value: 4 },
					{ label: "寄付月结", value: 1 },
					{ label: "到付", value: 2 },
				]
			}
			return [ // 顺丰
				{ label: "寄付现结", value: 1 },
				{ label: "寄付月结", value: 3 },
				{ label: "到付", value: 2 },
			]
		},
		expressCompanyListCom: {  // 快递公司列表
			get() { return this.expressCompanyList },
			set(val) { return val }
		},
		contactNumberRules() {	// 手机号验证
			return validPhoneComputed
		},
		fixedLineRules() {	// 固话验证
			return validFixlineComputed
		},
		selectActive() {
			return (index, mark) => {
				// console.log(index, mark);
				if (this.timeSelectIndex == index && this.preMark == mark) {
					return true
				}
				return false
			};
		}
	},
	mounted() {
		if (this.orgId == 1) {	// 坪山优先展示顺丰
			this.expressInfo.expressCompany = "shunfeng"
			this.expressCompanyList = [
				{ label: "中国邮政", value: "ems" },
				{ label: "顺丰速运", value: "shunfeng" },
			]
		}

		if (this.orgId == 2 || this.orgId == 3 || this.orgId == 17) { // orgId 3 中山香山公证处(测试)  orgId 17 中山香山公证处(生产)
			this.expressCompanyList = [	// 深圳公证处只有中国邮政 
				{ label: "中国邮政", value: "ems" },
			]
			this.expressInfo.expressCompany = "ems"
			this.expressInfo.expressMethod = 0
			this.expressInfo.payMethod = 2
			this.expressInfo.packageCategory = 0
		}
	},
	created() {
		this.from = this.$route.query.from
		this.fromOrderId = this.$route.query.fromOrderId
		this.getCityData()
		this.getAddressList()
		console.log(this.$route)
		this.getReceiverAddress()
		this.generatorTime(9, 18)
		this.generatorDay(1)
		this.orgId = sessionStorage.getItem('org_id')
		this.getDefaultSender()
		console.log(this.$route);
	},
	methods: {
		// 获取寄件人默认地址
		async getDefaultSender() {
			let res = await getDeafultSenderAddress()
			console.log("寄件人默认地址-->", res);
			if (res.success && res.data) {
				let orgOffice = res.data.orgOffice || ""
				let org = res.data.org || ""

				this.senderData.name = orgOffice.officeName || org.orgName
				this.senderData.companyName = orgOffice.officeName || org.orgName
				this.senderData.fixedLine = orgOffice.phone || org.phone
				this.senderData.detailAddress = orgOffice.orgAddress || org.orgAddr
				this.senderData.regionCode = org.regionCode

				this.getCityParent(org.regionCode)
			}
		},

		// 地址限制输入
		handleInput(value, object, key) {
			if (value.length > 0) {
				this[object][key] = value.replace(/[`~!@#$%^&*_\+={}|<>?:",./;'\\[\]·~！@#￥%……&*（）——《》？：“”【】、；‘’，。、]/g, "").replace(/\s/, "")
			}
		},

		// 完善修改
		handleEdit(index, row) {
			this.improveDialog = true
			this.$nextTick(() => {
				this.$refs["receiverImproveForm"].clearValidate()
			})
			this.receiverImproveDialogData = { ...row }
			this.getCityParentImproveDialog(row)
		},

		// 完善修改确定
		handleImproveDialogComfirm(formName) {
			this.$refs[formName].validate(async v => {
				if (v) {
					console.log(this.receiverImproveDialogData);
					let res = await updateExpressReceiverAddress(this.receiverImproveDialogData)
					// console.log('完善修改确定', res);
					if (!res.success) {
						return this.$message.error('修改地址失败，请稍后再试！')
					}
					this.improveDialog = false
					this.$message.success('修改地址成功！')
					this.getReceiverAddress()
				} else {
					console.log('error submit!!');
					return false;
				}
			})
		},
		// 完善修改取消
		handleImproveDialogCancle(formName) {
			this.improveDialog = false
		},

		// 查看申请信息
		async handleDetail(index, row) {
			console.log(index, row);
			let res = await getOnlineMailListDetail(row.expressManagementId)
			this.litigantTableData = []
			this.applicantShow = true
			console.log('申请信息', res)
			res.data && this.litigantTableData.push(res.data)
		},
		applicantShowChange(v) {
			this.applicantShow = v
		},

		// 呼叫快递
		handleCallMail(formName1, formName2) {
			if (this.isCall) return this.$message.error("请勿重复提交")
			this.isCall = true
			this.$refs[formName1].validate((valid1) => {  // 收件人
				if (valid1) {
					if (this.receiverTableData.length == 0) {
						this.isCall = false
						return this.$message.error("收件人信息不能为空") // 寄件人
					}

					this.$refs[formName2].validate((valid2) => { // 快递信息
						if (valid2) {
							this.callExpress()
						} else {
							this.$message.error("请填写快递信息！")
							this.isCall = false
							return false;
						}
					})
				} else {
					this.$message.error("请填写收件人信息！")
					this.isCall = false
					return false;
				}
			})
		},

		// 呼叫快递
		async callExpress() {
			let data = []
			this.receiverTableData.forEach(e => {
				const receiverObj = {
					...this.expressInfo,
					senderName: this.senderData.name,
					senderCompany: this.senderData.companyName,
					senderTel: this.senderData.fixedLine,
					senderMobile: this.senderData.contactNumber,
					senderRegionCode: this.senderData.regionCode,
					senderAddress: this.senderData.address,
					senderDetailAddress: this.senderData.detailAddress,

					expressSenderReceiverId: e.id || "",
					expressManagementId: e.expressManagementId || "",
					receiverName: e.receiveName,
					receiverCompany: e.receiveCompany,
					receiverTel: e.receiveFixedLine,
					receiverMobile: e.receiveMobile,
					receiverRegionCode: e.receiveRegionCode,
					receiverAddress: e.receiveAddress,
					receiverDetailAddress: e.receiveDetailAddress,
				}
				data.push(receiverObj)
			})
			console.log('下单数据-->', data);

			let res = await callExpress(data)
			console.log("呼叫快递-->", res);
			if (!res.success) {
				this.$message({
					type: "error",
					message: res.msg || "呼叫失败，请稍后再试！"
				})
				this.isCall = false
				return
			}
			this.$router.replace({
				name: "checkoutSuccess",
				query: {
					from: this.from,
					fromOrderId: this.fromOrderId,
					ids: res.data.join(),
					detailId: this.$route.query.detailId
				}
			})
			this.$message({
				type: "success",
				message: "呼叫快递成功！"
			})
		},

		// 今天明天后天时间切换
		handleTimeChange(e) {
			// console.log(e);
			this.$refs["expressInfoForm"].clearValidate("selectTime")
			this.generatorDay(e)
			if (e == 2 || e == 3) {
				this.expressInfo.expressCompany == "shunfeng" ? this.generatorTime(8, 20, 7, ":30") : this.generatorTime(9, 18, 7)  // 小于开始时间生成全部可选
				return
			}
			this.expressInfo.expressCompany == "shunfeng" ? this.generatorTime(8, 20, "", ":30") : this.generatorTime(9, 18)	// 从当前时间开始生成

			// let res = this.generatorTime(9, 18) // 中国邮政时间
			// let res = this.generatorTime(8, 20, ":30")	// 顺丰时间
			// console.log(res);
		},

		// 点击选择时间
		handleSelectTime(e, index) {
			// console.log(e.target.innerHTML, index, this.expressTimeMark)
			this.timeSelectIndex = index
			this.preMark = this.expressTimeMark
			let text = e.target.innerHTML
			if (text == "今日无可预约时间") {
				return
			}

			if (text == "一小时内") {
				this.expressInfo.selectTime = text
				this.expressInfo.range = this.expressInfo.expressCompany == "shunfeng" ?
					`${moment().add(1, 'hour').format('MM-DD HH:30')} 至 ${moment().add(2, 'hour').format('MM-DD HH:30')}` :
					`${moment().add(1, 'hour').format('MM-DD HH:00')} 至 ${moment().add(2, 'hour').format('MM-DD HH:00')}`
				console.log(this.expressInfo.range)
				return
			}

			this.expressInfo.selectTime = `${moment().format('YYYY')}-${this.selectDay} ${text}`
			let textArr = text.split('-')
			this.expressInfo.range = `${this.selectDay} ${textArr[0]} 至 ${this.selectDay} ${textArr[1]}`
			console.log(this.expressInfo.range)
			this.popoverVisible = false
		},

		// 生成日期
		generatorDay(e) {
			this.selectDay = e == 1 ? moment(new Date()).format("MM-DD") :
				(e == 2 ? moment(new Date()).add(1, 'days').format("MM-DD") :
					moment(new Date()).add(2, 'days').format("MM-DD"))
		},

		// 生成时间段
		generatorTime(start, end, hourNow, range = ":00") {
			let startTime
			let endTime
			let timeList = []
			hourNow = hourNow || moment().format("H")
			if (hourNow < end - 1 && hourNow >= start) {
				start = Number(hourNow) + 1
				timeList.push("一小时内")
			}
			if (hourNow > (end - 2)) {
				timeList.push("今日无可预约时间");
				this.timeList = timeList
				return
			}
			for (var i = start; i < 24; i++) {
				if (i < end) {
					startTime = i < 10 ? "0" + i + range : i + range
					endTime = i + 1 + range
					timeList.push(startTime + "-" + endTime)
				}
			}
			this.timeList = timeList
		},

		// 点击地址簿
		handleAddressBookShow() {
			this.addressDialog = true
		},

		// 地址簿选中地址切换
		handleCurrentSelect(val) {
			console.log('当前选中行', val);
			this.selectAddress = val
		},

		// 地址簿选中地址确定
		handleAddreddComfirm() {
			this.addressDialog = false
			this.senderData = { ...this.selectAddress }
			this.getCityParent()
		},

		// 弹窗修改地址
		handleAddressEdit(index, row) {
			this.addressInnerVisible = true
			this.$nextTick(() => {
				this.$refs["addressInnerForm"].clearValidate()
			})
			this.addressInnerFormData = { ...row }
			this.getCityParentInner(row)
		},

		// 里层弹窗修改地址确认
		handleInnerDialogComfirm(formName) {
			this.$refs[formName].validate(async (valid) => {
				console.log(valid)
				if (valid) {
					this.addressInnerVisible = false
					this.updateAddress()
				} else {
					console.log('error submit!!');
					return false;
				}
			})
		},

		// 里层弹窗修改地址取消
		handleInnerDialogCancle(formName) {
			this.addressInnerVisible = false
		},

		// 地址簿分页切换
		handleCurrentChange(val) {
			this.addressPagination.pageNum = val
			this.getAddressList()
		},

		// 修改地址请求
		async updateAddress() {
			console.log(this.addressInnerFormData);
			this.addressInnerFormData.createTime = ""
			let res = await updateExpressAddress(this.addressInnerFormData)
			console.log('修改地址', res);
			this.feedBack(res, 0)
		},

		// 获取收件人地址列表
		async getReceiverAddress() {
			// console.log(this.$route.query);
			let res = await getReceiverAddressList(this.$route.query.ids)
			// console.log('收件人地址列表', res);
			this.receiverTableData = res.data
		},

		// 地址簿删除地址
		handleAddressDelete(index, row) {
			this.$confirm('<p style="color:red;">确定删除地址吗？</p>',
				'操作提示', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(async () => {
				let res = await deleteExpressAddress(row.id)
				console.log('删除地址', res)
				this.feedBack(res, 1)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作！'
				});
			});
		},

		// 修改或删除地址反馈
		feedBack(res, flag) {
			if (res.success) {
				this.$message({
					message: (flag == 0 ? "修改" : "删除") + "地址成功！",
					type: "success"
				})
				this.getAddressList()
				return
			}
			this.$message({
				message: (flag == 0 ? "修改" : "删除") + "地址失败，请稍后再试！",
				type: "error"
			})
		},

		// 获取地址簿列表
		async getAddressList() {
			let data = {
				nameOrMobile: "",
				...this.addressPagination
			}
			let res = await getAddressBookList(data)
			// console.log('地址列表', res);
			this.addressList = res.success ? res.data.list : ""
			this.addressTotal = res.success ? res.data.total : ""
		},

		// 省市区选择
		handleChange(arr) {
			console.log("省市区选择");
			if (arr) {
				this.senderData.address = this.$refs.cityCascader.getCheckedNodes()[0].pathLabels.join("");
				this.senderData.regionCode = [...arr].pop()
			}
		},

		// 里层弹窗省市区选择
		handleChangeInner(arr) {
			if (arr) {
				this.addressInnerFormData.address = this.$refs.cityCascader.getCheckedNodes()[0].pathLabels.join("");
				this.addressInnerFormData.regionCode = [...arr].pop()
			}
		},

		// 完善修改弹窗省市区选择
		handleChangeReceiverImprove(arr) {
			if (arr) {
				this.receiverImproveDialogData.receiveAddress = this.$refs.cityCascader.getCheckedNodes()[0].pathLabels.join("");
				this.receiverImproveDialogData.receiveRegionCode = [...arr].pop()
			}
		},

		// 城市三级联动数据
		async getCityData() {
			let res = await getCityRegionTree()
			// console.log(res.data[0].children);
			if (res.success) this.cityList = res.data[0].children
		},

		// 获取城市父级
		async getCityParent(regionCode) {
			let res = await getCityParents({ code: regionCode || this.selectAddress.regionCode })
			console.log('城市父级', res)
			this.$refs["senderDataForm"].clearValidate()
			res.success && Object.assign(this.senderData, { regionCodeArr: res.data.slice(1,) })
			if (regionCode) {
				setTimeout(() => {
					// console.log(this.$refs.cityCascader.presentText, this.$refs.cityCascader.inputValue);
					this.senderData.address = this.$refs.cityCascader.presentText.replace(/ \/ /g, "")
				}, 500);
			}
		},
		// 里层弹窗获取城市父级
		async getCityParentInner(row) {
			let res = await getCityParents({ code: row.regionCode })
			// console.log('城市父级', res)
			res.success && this.$set(this.addressInnerFormData, "regionCodeArr", res.data.slice(1,))
		},

		// 完善修改获取城市父级
		async getCityParentImproveDialog(row) {
			let res = await getCityParents({ code: row.receiveRegionCode })
			// console.log('城市父级', res)
			res.success && this.$set(this.receiverImproveDialogData, "receiveRegionCodeArr", res.data.slice(1,))
		},

		// 返回
		goBack() {
			window.history.go(-1)
		},
	},
	watch: {
		"addressDialog"() {
			if (!this.addressDialog) {
				this.selectAddress = ''
				this.getAddressList()
			}
		},
		"senderData.contactNumber"() {
			this.$refs["senderDataForm"].clearValidate("fixedLine")
		},
		"senderData.fixedLine"() {
			this.$refs["senderDataForm"].clearValidate("contactNumber")
		},
		"addressInnerFormData.contactNumber"() {
			this.$refs["addressInnerForm"] && this.$refs["addressInnerForm"].clearValidate("fixedLine")
		},
		"addressInnerFormData.fixedLine"() {
			this.$refs["addressInnerForm"] && this.$refs["addressInnerForm"].clearValidate("contactNumber")
		},
		"receiverImproveDialogData.receiveMobile"() {
			this.$refs["receiverImproveForm"] && this.$refs["receiverImproveForm"].clearValidate("receiveFixedLine")
		},
		"receiverImproveDialogData.receiveFixedLine"() {
			this.$refs["receiverImproveForm"] && this.$refs["receiverImproveForm"].clearValidate("receiveMobile")
		}
	}
}
</script>

<style lang="less" scoped>
.addressDialog {
	cursor: pointer;
}

.time_select {
	display: inline-block;
	height: 40px;
	line-height: 40px;
	font-size: 14px;
	cursor: pointer;

	&:hover {
		color: #409eff;
	}
}

.time_select_active {
	color: #409eff;
}

.container {
	// background: #f7f7f7;
	background-color: #eee;
	padding: 30px;
}

.content {
	background-color: #fff;
	border-radius: 3px;
	padding: 40px;
	font-size: 14px;

	.title_wrap {
		padding: 3px 20px;
		border: 1px solid #eee;
		// background-color: #fafafa;
		background-color: #e6f6fe;

		.title {
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			font-weight: bold;
			color: #333;
			vertical-align: middle;

			i {
				padding-right: 5px;
				font-size: 20px;
				line-height: 40px;
			}
		}
	}

	.sender_content {
		border: 1px solid #eee;
		margin-top: 20px;

		.form_wrap {
			padding: 20px 200px 20px 20px;
		}

		.button_wrap {
			display: flex;
			align-items: center;
			height: 40px;
		}
	}

	.footer_button_content {
		padding: 30px 0;
		text-align: center;

		.el-button {
			width: 300px;
		}
	}

	.addressee_content {
		margin-top: 40px;
		padding-bottom: 20px;
		.addressee_form {
			padding: 10px 30px;
		}
	}

	.row-class-name {
		color: red;
	}

	.go_back_btn {
		text-align: right;
		padding-right: 20px;
	}
}

/deep/ .el-radio-button__inner {
	margin: 10px;
	border-radius: 2px !important;
	border: 1px solid #dcdfe6;
	width: 100px;
}

/deep/ .address_dialog {
	.el-dialog__header {
		font-weight: bold;
		padding-left: 40px;
		border-bottom: 1px solid #eee;
		padding-bottom: 20px;
	}
	.el-dialog__body {
		padding: 0 40px;
		.scope_title {
			color: #333;
		}
		.scope_info {
			color: #999;
		}
	}
	.address_dialog_table_header {
		color: #333;
	}
	.el-table th {
		background-color: #f2f2f2;
	}

	.pagination_wrap {
		padding: 10px 0;
	}

	.el-table td {
		padding: 5px 0;
	}
}
.link_btn {
	display: inline-block;
	margin: 0 10px;
}

/deep/.header_row_name,
/deep/.row-class-name {
	color: #333;
}
</style>
<style>
.el-table__body tr.current-row > td {
	background-color: #ddd !important;
}
.text_ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>