<template>
	<div class="container">
		<div class="content">
			<h2>我要寄件</h2>

			<!-- 卷宗信息 -->
			<div class="sender_content">
				<div class="title_wrap">
					<el-row>
						<el-col :span="16">
							<div class="title">卷宗信息（注：寄公证书或办证资料时必填；其他非必填）</div>
						</el-col>
					</el-row>
				</div>

				<div class="form_wrap">
					<el-form label-width="80px" :inline="false" size="normal">
						<el-form-item label="卷宗号" label-width="100px">
							<el-col :span="11">
								<el-input maxlength="16" v-model="dossierNum" placeholder="寄公证书或办证资料时必填；其他非必填"
									oninput="value=value.replace(/[^A-z\d]/g,'').replace(/[\^_]/,'')" />
							</el-col>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<!-- 寄件人 -->
			<div class="sender_content">
				<div class="title_wrap">
					<el-row>
						<el-col :span="18">
							<div class="title">寄件人</div>
						</el-col>
						<el-col :span="6">
							<div class="button_wrap">
								<el-button type="primary" size="mini" style="margin-left:90px;"
									@click="handleAddressBookShow('sender')">地址簿</el-button>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="form_wrap">
					<el-form ref="senderDataForm" label-position="right" label-width="100px" :model="senderData"
						:rules="addressFormRules">
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="姓名" prop="name">
									<el-input v-model="senderData.name" maxlength="30" placeholder="请输入姓名" />
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="公司名称" prop="companyName">
									<el-input v-model="senderData.companyName" maxlength="35"
										placeholder="请输入公司名称（选填）" />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="手机号码" prop="contactNumber"
									:rules="contactNumberRules(senderData.contactNumber,senderData.fixedLine)">
									<el-input v-model="senderData.contactNumber" maxlength="11"
										placeholder="手机号码与固话必填一个" />
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="固话号码" prop="fixedLine"
									:rules="fixedLineRules(senderData.fixedLine,senderData.contactNumber)">
									<el-input v-model="senderData.fixedLine" maxlength="20"
										placeholder="手机号码与固话必填一个，固话需带 - " oninput="value=value.replace(/[^\d-]/g,'')" />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="省/市/区(县)" prop="regionCodeArr">
									<el-cascader ref="senderCityCascader" v-model="senderData.regionCodeArr"
										style="width:100%" placeholder="请选择省市区（县）" :options="cityList"
										:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
										@change="handleChange($event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="详细地址" prop="detailAddress">
									<el-input v-model="senderData.detailAddress" maxlength="120"
										placeholder="请输入详细地址" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>

			<!-- 收件人 -->
			<div class="sender_content">
				<div class="title_wrap">
					<el-row>
						<el-col :span="18">
							<div class="title">收件人</div>
						</el-col>
						<el-col :span="6">
							<div class="button_wrap">
								<el-tooltip class="item" effect="dark" placement="top">
									<div slot="content">最多可添加10个</div>
									<el-button type="primary" size="mini" @click="handleReceiverAddAddress">添加地址
									</el-button>
								</el-tooltip>
								<el-button type="primary" size="mini"
									@click="handleReceiverAddressBookShow('receiver')">地址簿
								</el-button>
								<!-- <el-button type="primary" size="mini" @click="handleAddressBookShow('receiver')">地址簿 -->
							</div>
						</el-col>
						<!-- <el-col :span="2">
							<div class="title addressDialog" style="width:100px;" @click="handleAddAddress"><i
									class="el-icon-document"></i>添加地址</div>
						</el-col>
						<el-col :span="6">
							<div class="title addressDialog" style="width:100px" @click="handleAddressBookDialog"><i
									class="el-icon-document"></i>地址簿
							</div>
						</el-col> -->
					</el-row>
				</div>

				<!-- <div class="form_wrap">
					<el-form label-position="right" label-width="100px" :model="receiverFormData">
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="姓名">
									<el-input v-model="receiverFormData.receiveName" placeholder="请输入姓名"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="公司名称">
									<el-input v-model="receiverFormData.receiveCompany" placeholder="请输入公司名称（选填）">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="手机号码">
									<el-input v-model="receiverFormData.receiveMobile" placeholder="手机号码与固话必填一个">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="固话号码">
									<el-input v-model="receiverFormData.receiveFixedLine"
										placeholder="手机号码与固话必填一个，固话需带 - " oninput="value=value.replace(/[^\d-]/g,'')">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12" :offset="0">
								<el-form-item label="省/市/区(县)">
									<el-cascader ref="receiverCityCascader" style="width:100%"
										v-model="receiverFormData.receiveRegionCodeArr" placeholder="请选择省市区（县）"
										:options="cityList"
										:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
										@change="handleChangeReceiver($event)">
									</el-cascader>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="详细地址">
									<el-input v-model="receiverFormData.receiveDetailAddress" placeholder="请输入详细地址">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div> -->

				<div class="form_wrap table_wrap">
					<el-table header-row-class-name="receiver_table_header" :data="receiverTableData"
						style="width: 100%;padding:0 30px">
						<el-table-column prop="receiveName" label="姓名" width="150" />
						<el-table-column prop="receiveMobile" label="手机号码" width="150" />
						<el-table-column prop="receiveFixedLine" label="固话号码" />
						<el-table-column prop="receiveCompany" label="公司名称" />
						<el-table-column label="地址" show-overflow-tooltip>
							<template slot-scope="{row}">
								<div>{{ row.receiveAddress }}</div>
								<div>{{ row.receiveDetailAddress }}</div>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="操作" align="center" width="230">
							<template slot-scope="scope">
								<el-link type="primary" style="display:inline-block;margin: 10px 10px;"
									@click="handleEdit(scope.$index, scope.row)">完善修改</el-link>
								<el-link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
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
					<el-form ref="expressInfoForm" label-position="right" label-width="110px" :model="expressInfo"
						:rules="expressInfoFormRules">
						<el-row :gutter="50">
							<el-col :span="12" :offset="0">
								<el-form-item label="快递公司" prop="expressCompany">
									<el-select v-model="expressInfo.expressCompany" placeholder="请选择快递公司"
										style="width: 100%">
										<el-option v-for="item in expressCompanyListCom" :key="item.value"
											:label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item v-if="expressCompanyCom=='ems'||expressCompanyCom==''"
									prop="expressMethod" label="取件方式">
									<el-select v-model="expressInfo.expressMethod" placeholder="请选择取件方式"
										style="width: 100%">
										<el-option v-for="item in expressMethodList" :key="item.value"
											:label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
								<el-form-item v-if="expressCompanyCom=='shunfeng'" label="取件方式">
									<el-input v-model="expressInfo.expressMethodStr" placeholder="上门取件" disabled />
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="50">
							<el-col :span="12" :offset="0">
								<el-form-item v-if="expressMethodCom===1||expressMethodCom===''" label="预约上门时间"
									prop="selectTime">
									<el-popover placement="top" width="420" trigger="click" v-model="popoverVisible">
										<el-input slot="reference" v-model="expressInfo.selectTime"
											placeholder="请选择预约上门时间" />
										<div style="padding:10px;text-align:center;min-height: 200px;">
											<el-radio-group v-model="expressTimeMark" style="margin-bottom:5px"
												@change="handleTimeChange($event)">
												<el-radio-button label="1">今天</el-radio-button>
												<el-radio-button label="2">明天</el-radio-button>
												<el-radio-button label="3">后天</el-radio-button>
											</el-radio-group>
											<div>
												<el-row>
													<el-col v-for="(item,i) in timeList" :key="i" :span="8">
														<span class="time_select"
															:class="{'time_select_active':selectActive(i,expressTimeMark)}"
															@click="handleSelectTime($event,i)">{{ item }}</span>
													</el-col>
												</el-row>
											</div>
										</div>
									</el-popover>
								</el-form-item>
								<el-form-item v-if="expressMethodCom===0" prop="selectTime" label="预约上门时间">
									<el-input v-model="expressInfo.selectTime" placeholder="定时揽收" disabled />
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="运费支付方式" prop="payMethod">
									<el-select v-model="expressInfo.payMethod" placeholder="请选择运费支付方式"
										style="width: 100%">
										<el-option v-for="item in payMethodListCom" :key="item.value"
											:label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="50">
							<el-col :span="12" :offset="0">
								<el-form-item label="物品类型" prop="packageCategory">
									<el-select v-model="expressInfo.packageCategory" clearable style="width: 100%"
										placeholder="请选择选择物品类型">
										<el-option v-for="item in packageCategoryList" :key="item.value"
											:label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12" :offset="0">
								<el-form-item label="物品信息" prop="remark">
									<el-input v-model="expressInfo.remark" maxlength="80" clearable
										placeholder="请输入文件名称或文件内容的简述" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>

			<!-- 呼叫快递 -->
			<div class="footer_button_content">
				<el-button type="primary" size="default" @click="handleCallMail('senderDataForm','expressInfoForm')">
					呼叫快递</el-button>
			</div>
		</div>

		<!-- 地址簿弹窗（单选） -->
		<el-dialog title="从地址簿选择" :visible.sync="addressDialog" width="980px" custom-class="address_dialog"
			@close="addressDialog = false">
			<el-table :data="addressList" header-row-class-name="address_dialog_table_header"
				cell-class-name="address_dialog_table_cell" highlight-current-row @current-change="handleCurrentSelect">
				<el-table-column type="index" width="45" align="center" />
				<el-table-column label="联系人" width="110" show-overflow-tooltip>
					<template slot-scope="scope">
						<div class="scope_title text_ellipsis">{{ scope.row.name }}</div>
						<div class="scope_info text_ellipsis">{{ scope.row.contactNumber }}</div>
					</template>
				</el-table-column>
				<el-table-column property="fixedLine" label="固话号码" width="140" show-overflow-tooltip>
				</el-table-column>
				<el-table-column property="companyName" show-overflow-tooltip label="公司名称" width="180" />
				<el-table-column label="地址" show-overflow-tooltip width="260">
					<template slot-scope="scope">
						<div class="scope_title text_ellipsis">{{ scope.row.address }}</div>
						<div class="scope_info text_ellipsis">{{ scope.row.detailAddress }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="150">
					<template slot-scope="scope">
						<el-link type="primary" style="display:inline-block;margin:0 10px;"
							@click.stop="handleAddressEdit(scope.$index, scope.row)">修改</el-link>
						<el-link type="danger" @click.stop="handleAddressDelete(scope.$index, scope.row)">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" style="text-align:center;">
				<div class="pagination_wrap">
					<el-pagination :current-page.sync="addressPagination.pageNum"
						:page-size="addressPagination.pageSize" layout="total, prev, pager, next" :total="addressTotal"
						@current-change="handleCurrentChange" />
				</div>
				<el-button :disabled="!selectAddress" style="width:200px;" :type="selectAddress?'primary':'info'"
					@click="handleAddreddComfirm">
					确定</el-button>
			</div>
		</el-dialog>

		<!-- 地址簿弹窗（多选） -->
		<el-dialog title="从地址簿选择" :visible.sync="receiverAddressDialog" width="980px" custom-class="address_dialog"
			@close="receiverAddressDialog = false">
			<el-table :data="addressList" header-row-class-name="address_dialog_table_header"
				cell-class-name="address_dialog_table_cell" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="60" align="center"></el-table-column>
				<!-- <el-table-column type="index" width="45" align="center" /> -->
				<el-table-column label="联系人" width="110" show-overflow-tooltip>
					<template slot-scope="scope">
						<div class="scope_title text_ellipsis">{{ scope.row.name }}</div>
						<div class="scope_info text_ellipsis">{{ scope.row.contactNumber }}</div>
					</template>
				</el-table-column>
				<el-table-column property="fixedLine" label="固话号码" width="140" show-overflow-tooltip>
				</el-table-column>
				<el-table-column property="companyName" show-overflow-tooltip label="公司名称" width="180" />
				<el-table-column label="地址" show-overflow-tooltip width="260">
					<template slot-scope="scope">
						<div class="scope_title text_ellipsis">{{ scope.row.address }}</div>
						<div class="scope_info text_ellipsis">{{ scope.row.detailAddress }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="150">
					<template slot-scope="scope">
						<el-link type="primary" style="display:inline-block;margin:0 10px;"
							@click.stop="handleAddressEdit(scope.$index, scope.row)">修改</el-link>
						<el-link type="danger" @click.stop="handleAddressDelete(scope.$index, scope.row)">删除</el-link>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" style="text-align:center;">
				<div class="pagination_wrap">
					<el-pagination :current-page.sync="addressPagination.pageNum"
						:page-size="addressPagination.pageSize" layout="total, prev, pager, next" :total="addressTotal"
						@current-change="handleCurrentChange" />
				</div>
				<el-button style="width:200px;"
					:disabled="selectManyAddress.length==0||(selectManyAddress.length+receiverTableData.length)>10"
					:type="selectManyAddress.length>0&&(selectManyAddress.length+receiverTableData.length)<=10?'primary':'info'"
					@click="handleManyAddreddComfirm">
					确定</el-button>
			</div>
		</el-dialog>

		<!-- 内层dialog -->
		<el-dialog width="510px" title="编辑地址" :visible.sync="addressInnerVisible" append-to-body
			custom-class="address_dialog">
			<el-form ref="addressInnerForm" style="margin-top:30px;" :rules="addressFormRules" label-position="right"
				label-width="110px" :model="addressInnerFormData">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addressInnerFormData.name" maxlength="30" placeholder="请输入姓名" />
				</el-form-item>
				<el-form-item label="手机号码" prop="contactNumber"
					:rules="contactNumberRules(addressInnerFormData.contactNumber,addressInnerFormData.fixedLine)">
					<el-input v-model="addressInnerFormData.contactNumber" minlength="11" maxlength="11"
						placeholder="请输入手机号码" oninput="value=value.replace(/[^\d]/g,'')" />
				</el-form-item>
				<el-form-item label="固话号码" prop="fixedLine"
					:rules="fixedLineRules(addressInnerFormData.fixedLine,addressInnerFormData.contactNumber)">
					<el-input v-model="addressInnerFormData.fixedLine" minlength="16"
						placeholder="手机号码与固话号码必填一个，固话带区号和 -" oninput="value=value.replace(/[^\d-]/g,'')" />
				</el-form-item>
				<el-form-item label="公司名称" prop="companyName">
					<el-input v-model="addressInnerFormData.companyName" minlength="35" placeholder="请输入公司名称（选填）" />
				</el-form-item>
				<el-form-item label="省市区（县）" prop="regionCodeArr">
					<el-cascader ref="innerCityCascader" v-model="addressInnerFormData.regionCodeArr" style="width:100%"
						placeholder="请选择省市区（县）" :options="cityList"
						:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
						@change="handleChangeInner($event)" />
				</el-form-item>
				<el-form-item label="详细地址" prop="detailAddress">
					<el-input v-model="addressInnerFormData.detailAddress" minlength="120" type="textarea"
						placeholder="请输入详细地址，如xx街道xx路xx"
						@input="handleInput($event,'addressInnerFormData','detailAddress')" />
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button size="medium" type="default" @click="handleInnerDialogCancle('addressInnerForm')">取消
				</el-button>
				<el-button size="medium" type="primary" @click="handleInnerDialogComfirm('addressInnerForm')">确定
				</el-button>
			</div>
		</el-dialog>

		<!-- 完善修改弹窗 -->
		<el-dialog width="510px" :title="receiverImproveDialogData.isNew?'添加地址':'编辑地址'" :visible.sync="improveDialog"
			append-to-body custom-class="address_dialog">
			<el-form ref="receiverImproveForm" style="margin-top:30px;" label-position="right" label-width="110px"
				:model="receiverImproveDialogData" :rules="receiverImproveFormRules">
				<el-form-item label="姓名" prop="receiveName">
					<el-input v-model="receiverImproveDialogData.receiveName" maxlength="30" placeholder="请输入姓名" />
				</el-form-item>
				<el-form-item label="手机号码" prop="receiveMobile"
					:rules="contactNumberRules(receiverImproveDialogData.receiveMobile,receiverImproveDialogData.receiveFixedLine)">
					<el-input v-model="receiverImproveDialogData.receiveMobile" maxlength="11" placeholder="请输入手机号码"
						oninput="value=value.replace(/[^\d]/g,'')" />
				</el-form-item>
				<el-form-item label="固话号码" prop="receiveFixedLine"
					:rules="fixedLineRules(receiverImproveDialogData.receiveFixedLine,receiverImproveDialogData.receiveMobile)">
					<el-input v-model="receiverImproveDialogData.receiveFixedLine" maxlength="20"
						placeholder="手机号码与固话号码必填一个，固话带区号和 -" oninput="value=value.replace(/[^\d-]/g,'')" />
				</el-form-item>
				<el-form-item label="公司名称" prop="receiveCompany">
					<el-input v-model="receiverImproveDialogData.receiveCompany" maxlength="35"
						placeholder="请输入公司名称（选填）" />
				</el-form-item>
				<el-form-item label="省市区（县）" prop="receiveRegionCodeArr">
					<el-cascader ref="improveCityCascader" v-model="receiverImproveDialogData.receiveRegionCodeArr"
						style="width:100%" placeholder="请选择省市区（县）" :options="cityList"
						:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
						@change="handleChangeReceiverImprove($event)" />
				</el-form-item>
				<el-form-item label="详细地址" prop="receiveDetailAddress">
					<el-input v-model="receiverImproveDialogData.receiveDetailAddress" maxlength="120" type="textarea"
						placeholder="请输入详细地址，如xx街道xx路xx"
						@input="handleInput($event,'receiverImproveDialogData','receiveDetailAddress')" />
				</el-form-item>
			</el-form>
			<div slot="footer" style="margin-right:20px">
				<el-button size="medium" type="default" @click="handleImproveDialogCancle('receiverImproveForm')">取消
				</el-button>
				<el-button size="medium" type="primary" @click="handleImproveDialogComfirm('receiverImproveForm')">确定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	getCityRegionTree,
	getCityParents,
	getAddressBookList,
	updateExpressAddress,
	deleteExpressAddress
} from '../../api/addressBook'

import {
	callExpress
} from '../../api/mailManage'

import {
	addressFormRules,
	receiverImproveFormRules,
	expressInfoFormRules,
	validPhoneComputed,
	validFixlineComputed
} from '../../utils/validate'
var moment = require('moment')
export default {
	data() {
		return {
			dossierNum: '',
			senderData: {	// 寄件人信息
				name: '',
				companyName: '',
				contactNumber: '',
				fixedLine: '',
				detailAddress: '',
				address: '',
				regionCode: '',
				regionCodeArr: []
			},

			receiverTableData: [],	// 收件人列表信息(多个)
			receiverFormData: {		// 收件人列表信息(单个)
				receiveName: '',
				receiveMobile: '',
				receiveFixedLine: '',
				receiveCompany: '',
				receiveAddress: '',
				receiveDetailAddress: '',
				receiveRegionCode: '',
				receiveRegionCodeArr: []
			},

			// 地址bu
			addressDialog: false,
			receiverAddressDialog: false,
			addressInnerVisible: false,
			addressList: [],	// 地址bu列表
			addressPagination: {	// 地址bu分页
				pageNum: 1,
				pageSize: 8
			},
			addressTotal: 50,
			selectAddress: '',	// 选中的地址
			selectManyAddress: [],
			whoClick: '',	// 点的是寄件还是收件标记

			// 内层弹窗数据
			addressInnerFormData: {
				name: '',
				contactNumber: '',
				fixedLine: '',
				companyName: '',
				detailAddress: '',
				regionCode: '',
				regionCodeArr: []
			},
			addressFormRules,	// 内层弹窗 / 寄件人表单 校验

			// 完善修改弹窗数据
			improveDialog: false,
			receiverImproveDialogData: {
				receiveName: '',
				receiveMobile: '',
				receiveFixedLine: '',
				receiveCompany: '',
				receiveAddress: '',
				receiveDetailAddress: '',
				receiveRegionCode: '',
				receiveRegionCodeArr: [],
				isNew: true
			},
			receiverImproveFormRules, // 完善修改弹窗校验
			cityList: [],	// 省市区

			expressTimeMark: 1,	// 今天明天后天标记
			timeSelectIndex: null,
			preMark: "",
			timeList: [],	// 快递可选时间段
			selectTime: '',	// 快递选择的时间段
			selectDay: '',	// 快递选择的日期
			expressInfo: {	// 快递提交表单
				expressCompany: '',
				expressMethod: '',
				selectTime: '',
				payMethod: '',
				packageCategory: '',
				remark: '',
				range: '',	// 时间范围
				expressMethodStr: '上门取件'
			},
			expressInfoFormRules, // 快递提交表单校验
			expressCompanyList: '',
			// expressCompanyList: [	// 快递公司
			// 	{ label: "中国邮政", value: "ems" },
			// 	{ label: "顺丰速运", value: "shunfeng" },
			// ],
			expressMethodList: [	// 取件方式
				{ label: '固定地址揽收', value: 0 },
				{ label: '预约上门揽收', value: 1 }
			],
			payMethodList: [	// 运费支付方式
				{ label: '寄付月结', value: 1 },
				{ label: '收方付', value: 2 },
				{ label: '第三方付', value: 3 },
				{ label: '寄付现结', value: 4 }
			],
			packageCategoryList: [ // 物品类型
				{ label: '文件', value: 0 }
			],
			orgId: '',	// 公证处id
			popoverVisible: false
		}
	},
	computed: {
		expressMethodCom() { // 取件方式
			this.$nextTick(() => {
				this.expressInfo.selectTime = this.expressInfo.expressMethod === 0 ? '定时揽收' : ''
				this.expressTimeMark = 1
				if (this.orgId == 1) this.expressInfo.payMethod = this.expressInfo.expressMethod === 1 ? 2 : 1	// 坪山预约上门揽收
				if (this.orgId == 1 && this.expressInfo.expressMethod === 1 && this.expressInfo.expressCompany == 'shunfeng') this.expressInfo.payMethod = 3 // 坪山顺丰默认
				// if (this.orgId == 2) this.expressInfo.payMethod = this.expressInfo.expressMethod === 0 ? 2 : 1  // 市处
				this.$refs['expressInfoForm'].clearValidate('selectTime')
			})
			return this.expressInfo.expressMethod
		},
		expressCompanyCom() { // 快递公司
			this.expressInfo.expressMethod = this.expressInfo.expressCompany == 'shunfeng' ? 1 : 0 // 顺丰取件方式
			if (this.expressInfo.expressCompany == 'shunfeng' && this.orgId == 1) this.expressInfo.payMethod = 1 // 坪山 + 顺丰付款方式

			this.expressInfo.expressCompany == 'shunfeng' ? this.generatorTime(8, 20, '', ':30') : this.generatorTime(9, 18)
			return this.expressInfo.expressCompany || ''
		},
		payMethodListCom() { // 运费支付方式
			if (this.expressInfo.expressCompany == 'ems' || this.expressInfo.expressCompany == '') {
				return [
					{ label: '寄付现结', value: 4 },
					{ label: '寄付月结', value: 1 },
					{ label: '到付', value: 2 }
				]
			}
			return [ // 顺丰
				{ label: '寄付现结', value: 1 },
				{ label: '寄付月结', value: 3 },
				{ label: '到付', value: 2 }
			]
		},
		expressCompanyListCom: { // 快递公司列表
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
	watch: {
		'addressDialog'() {
			if (!this.addressDialog) {
				this.selectAddress = ''
				this.getAddressList()
				// this.addressPagination.pageNum = 1
			}
		},
		"receiverAddressDialog"() {
			if (!this.receiverAddressDialog) {
				this.selectManyAddress = []
				this.getAddressList()
				// this.addressPagination.pageNum = 1
			}
		},
		"expressInfo.expressCompany"() {
			this.expressInfo.selectTime = ""
			this.preMark = ""
			this.expressTimeMark = 1
		},
		'senderData.contactNumber'() {
			this.$refs['senderDataForm'].clearValidate('fixedLine')
		},
		'senderData.fixedLine'() {
			this.$refs['senderDataForm'].clearValidate('contactNumber')
		},
		'addressInnerFormData.contactNumber'() {
			this.$refs['addressInnerForm'] && this.$refs['addressInnerForm'].clearValidate('fixedLine')
		},
		'addressInnerFormData.fixedLine'() {
			this.$refs['addressInnerForm'] && this.$refs['addressInnerForm'].clearValidate('contactNumber')
		},
		'receiverImproveDialogData.receiveMobile'() {
			this.$refs['receiverImproveForm'] && this.$refs['receiverImproveForm'].clearValidate('receiveFixedLine')
		},
		'receiverImproveDialogData.receiveFixedLine'() {
			this.$refs['receiverImproveForm'] && this.$refs['receiverImproveForm'].clearValidate('receiveMobile')
		}
	},
	mounted() {
		if (this.orgId == 1) {	// 坪山优先展示顺丰
			this.expressInfo.expressCompany = "shunfeng"	// 打开坪山默认顺丰
			this.expressCompanyList = [
				{ label: '中国邮政', value: 'ems' },
				{ label: '顺丰速运', value: 'shunfeng' }
			]
			this.expressInfo.packageCategory = 0
		}

		if (this.orgId == 2 || this.orgId == 3) {	// orgId 3 中山香山公证处
			this.expressCompanyList = [	// 深圳公证处只有中国邮政
				{ label: '中国邮政', value: 'ems' }
			]
			this.expressInfo.expressCompany = "ems"
			this.expressInfo.expressMethod = 0
			this.expressInfo.payMethod = 2
			this.expressInfo.packageCategory = 0
		}
	},
	created() {
		console.log(this.$route)
		this.getCityData()
		this.getAddressList()
		this.generatorTime(9, 18)
		this.generatorDay(1)
		if (this.$route.params.receiverAddressData) {
			this.copyAddressUse(this.$route.params.receiverAddressData)
		}
		this.orgId = sessionStorage.getItem('org_id')
	},
	methods: {
		// 地址限制输入
		handleInput(value, object, key) {
			if (value.length > 0) {
				this[object][key] = value.replace(/[`~!@#$%^&*_\+={}|<>?:",./;'\\[\]·~！@#￥%……&*（）——《》？：“”【】、；‘’，。、]/g, "").replace(/\s/, "")
			}
		},

		// 添加收件人地址
		handleReceiverAddAddress() {
			if (this.receiverTableData.length >= 10) return this.$message.error("最多可添加10个地址！")
			this.receiverImproveDialogData = {
				receiveName: '',
				receiveMobile: '',
				receiveFixedLine: '',
				receiveCompany: '',
				receiveAddress: '',
				receiveDetailAddress: '',
				receiveRegionCode: '',
				receiveRegionCodeArr: [],
				isNew: true
			}
			this.improveDialog = true
			this.$nextTick(() => {
				this.$refs['receiverImproveForm'].clearValidate()
			})
		},

		// 完善修改
		handleEdit(index, row) {
			console.log(index, row)
			this.improveDialog = true
			this.$nextTick(() => {
				this.$refs['receiverImproveForm'].clearValidate()
			})
			this.receiverImproveDialogData = { index, ...row }
			this.getCityParentImproveDialog(row)
		},

		// 删除收件人
		handleDelete(index, row) {
			// console.log(index, row);
			this.$confirm('<p style="color:red;">确定删除收件人？</p>',
				'操作提示', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(() => {
				this.receiverTableData.splice(index, 1)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作！'
				})
			})
		},

		// 完善修改确定
		handleImproveDialogComfirm(formName) {
			this.$refs[formName].validate(v => {
				if (v) {
					if (this.receiverImproveDialogData.isNew) {
						this.receiverImproveDialogData.isNew = false
						this.receiverImproveDialogData.receiveName && this.receiverTableData.push(this.receiverImproveDialogData)
						this.improveDialog = false
						return
					}
					this.receiverTableData.splice(this.receiverImproveDialogData.index, 1, this.receiverImproveDialogData)
					this.improveDialog = false
				} else {
					console.log('error submit!!')
					return false
				}
			})
		},
		// 完善修改取消
		handleImproveDialogCancle(formName) {
			this.improveDialog = false
		},

		// 呼叫快递
		handleCallMail(formName1, formName2) {
			if (this.isCall) return this.$message.error("请勿重复提交")
			this.isCall = true
			this.$refs[formName1].validate((valid1) => { // 收件人
				if (valid1) {
					if (this.receiverTableData.length == 0) {
						this.isCall = false
						return this.$message.error("收件人信息不能为空") // 寄件人
					}

					this.$refs[formName2].validate((valid2) => { // 快递信息
						if (valid2) {
							this.callExpress()
						} else {
							this.$message.error('请填写快递信息！')
							this.isCall = false
							return false
						}
					})
				} else {
					this.$message.error('请填写收件人信息！')
					this.isCall = false
					return false
				}
			})
		},

		// 呼叫快递
		async callExpress() {
			const data = []
			this.receiverTableData.forEach(e => {
				const receiverObj = {
					...this.expressInfo, // 快递信息
					dossierNum: this.dossierNum,	// 卷宗号
					senderName: this.senderData.name,	// 发件人信息
					senderCompany: this.senderData.companyName,
					senderTel: this.senderData.fixedLine,
					senderMobile: this.senderData.contactNumber,
					senderRegionCode: this.senderData.regionCode,
					senderAddress: this.senderData.address,
					senderDetailAddress: this.senderData.detailAddress,

					// expressSenderReceiverId: e.id || "",	// 收件人信息
					// expressManagementId: e.expressManagementId || "",
					receiverName: e.receiveName,
					receiverCompany: e.receiveCompany,
					receiverTel: e.receiveFixedLine,
					receiverMobile: e.receiveMobile,
					receiverRegionCode: e.receiveRegionCode,
					receiverAddress: e.receiveAddress,
					receiverDetailAddress: e.receiveDetailAddress
				}
				data.push(receiverObj)
			})
			// console.log(data);

			const res = await callExpress(data)
			console.log('呼叫快递-->', res)
			if (!res.success) {
				this.$message({
					type: 'error',
					message: res.msg || '呼叫失败，请稍后再试！'
				})
				this.isCall = false
				return
			}
			this.$router.push({
				name: 'checkoutSuccess',
				query: {
					from: "callMail",
					ids: res.data.join(),
				}
			})
			this.$message({
				type: 'success',
				message: '呼叫快递成功！'
			})
		},

		// 今天明天后天时间切换
		handleTimeChange(e) {
			// console.log(e);
			this.$refs['expressInfoForm'].clearValidate('selectTime')
			this.generatorDay(e)
			if (e == 2 || e == 3) {
				this.expressInfo.expressCompany == 'shunfeng' ? this.generatorTime(8, 20, 7, ':30') : this.generatorTime(9, 18, 7) // 小于开始时间生成全部可选
				return
			}
			this.expressInfo.expressCompany == 'shunfeng' ? this.generatorTime(8, 20, '', ':30') : this.generatorTime(9, 18)	// 从当前时间开始生成

			// let res = this.generatorTime(9, 18) // 中国邮政时间
			// let res = this.generatorTime(8, 20, ":30")	// 顺丰时间
			// console.log(res);
		},

		// 点击选择时间
		handleSelectTime(e, index) {
			// console.log(e.target.innerHTML, index, this.expressTimeMark)
			this.timeSelectIndex = index
			this.preMark = this.expressTimeMark
			const text = e.target.innerHTML
			if (text == '今日无可预约时间') {
				return
			}

			if (text == '一小时内') {
				this.expressInfo.selectTime = text
				this.expressInfo.range = this.expressInfo.expressCompany == "shunfeng" ?
					`${moment().add(1, 'hour').format('MM-DD HH:30')} 至 ${moment().add(2, 'hour').format('MM-DD HH:30')}` :
					`${moment().add(1, 'hour').format('MM-DD HH:00')} 至 ${moment().add(2, 'hour').format('MM-DD HH:00')}`
				console.log(this.expressInfo.range)
				return
			}

			this.expressInfo.selectTime = `${moment().format('YYYY')}-${this.selectDay} ${text}`
			const textArr = text.split('-')
			this.expressInfo.range = `${this.selectDay} ${textArr[0]} 至 ${this.selectDay} ${textArr[1]}`
			console.log(this.expressInfo.range)
			this.popoverVisible = false
		},

		// 生成日期
		generatorDay(e) {
			this.selectDay = e == 1 ? moment(new Date()).format('MM-DD')
				: (e == 2 ? moment(new Date()).add(1, 'days').format('MM-DD')
					: moment(new Date()).add(2, 'days').format('MM-DD'))
		},

		// 生成时间段
		generatorTime(start, end, hourNow, range = ':00') {
			let startTime
			let endTime
			const timeList = []
			hourNow = hourNow || moment().format('H')
			if (hourNow < end - 1 && hourNow >= start) {
				start = Number(hourNow) + 1
				timeList.push('一小时内')
			}
			if (hourNow > (end - 2)) {
				timeList.push('今日无可预约时间')
				this.timeList = timeList
				return
			}
			for (var i = start; i < 24; i++) {
				if (i < end) {
					startTime = i < 10 ? '0' + i + range : i + range
					endTime = i + 1 + range
					timeList.push(startTime + '-' + endTime)
				}
			}
			this.timeList = timeList
		},

		// 点击地址簿
		handleAddressBookShow(whoClick) {
			this.whoClick = whoClick
			this.addressDialog = true
		},

		// 接收人地址弹窗
		handleReceiverAddressBookShow() {
			if (this.receiverTableData.length >= 10) return this.$message.error("最多可添加10个地址！")
			this.receiverAddressDialog = true
		},

		// 地址簿选中地址切换
		handleCurrentSelect(val) {
			console.log('当前选中行', val)
			this.selectAddress = val
		},

		handleSelectionChange(select) {
			console.log(select);
			this.selectManyAddress = select
		},

		// 地址簿选中地址确定
		handleAddreddComfirm() {
			this.addressDialog = false
			if (this.whoClick == 'sender') {
				this.senderData = JSON.parse(JSON.stringify(this.selectAddress))
				this.getCityParent()
				return
			}
			const receiveData = JSON.parse(JSON.stringify(this.selectAddress))
			this.receiverTableData.push({
				receiveAddress: receiveData.address,
				receiveCompany: receiveData.companyName,
				receiveDetailAddress: receiveData.detailAddress,
				receiveFixedLine: receiveData.fixedLine,
				receiveMobile: receiveData.contactNumber,
				receiveName: receiveData.name,
				receiveRegionCode: receiveData.regionCode,
				isNew: receiveData.isNew
			})
		},

		// 地址簿选中地址确定(多选)
		handleManyAddreddComfirm() {
			this.receiverAddressDialog = false
			this.selectManyAddress.length > 0 && this.selectManyAddress.forEach(item => {
				const receiveData = JSON.parse(JSON.stringify(item))
				this.receiverTableData.push({
					receiveAddress: receiveData.address,
					receiveCompany: receiveData.companyName,
					receiveDetailAddress: receiveData.detailAddress,
					receiveFixedLine: receiveData.fixedLine,
					receiveMobile: receiveData.contactNumber,
					receiveName: receiveData.name,
					receiveRegionCode: receiveData.regionCode,
					isNew: receiveData.isNew
				})
			})
		},

		// 弹窗修改地址
		handleAddressEdit(index, row) {
			console.log(row)
			this.addressInnerVisible = true
			this.$nextTick(() => {
				this.$refs['addressInnerForm'].clearValidate()
			})
			this.addressInnerFormData = { ...row }
			this.getCityParentInner(row)
		},

		// 里层弹窗修改地址确认
		handleInnerDialogComfirm(formName) {
			this.$refs[formName].validate(async v => {
				if (v) {
					this.addressInnerVisible = false
					this.updateAddress()
				} else {
					console.log('error submit!!')
					return false
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
			console.log(this.addressInnerFormData)
			this.addressInnerFormData.createTime = ''
			const res = await updateExpressAddress(this.addressInnerFormData)
			console.log('修改地址', res)
			this.feedBack(res, 0)
		},

		// 地址簿删除地址
		handleAddressDelete(index, row) {
			this.$confirm('<p style="color:red;">确定删除地址吗？</p>',
				'操作提示', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(async () => {
				const res = await deleteExpressAddress(row.id)
				console.log('删除地址', res)
				this.feedBack(res, 1)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作！'
				})
			})
		},

		// 修改或删除地址反馈
		feedBack(res, flag) {
			if (res.success) {
				this.$message({
					message: (flag == 0 ? '修改' : '删除') + '地址成功！',
					type: 'success'
				})
				this.getAddressList()
				return
			}
			this.$message({
				message: (flag == 0 ? '修改' : '删除') + '地址失败，请稍后再试！',
				type: 'error'
			})
		},

		// 获取地址簿列表
		async getAddressList() {
			const data = {
				nameOrMobile: '',
				...this.addressPagination
			}
			const res = await getAddressBookList(data)
			// console.log('地址列表', res);
			this.addressList = res.success ? res.data.list : ""
			this.addressTotal = res.success ? res.data.total : ""
		},

		// 省市区选择
		handleChange(arr) {
			if (arr) {
				this.senderData.address = this.$refs.senderCityCascader.getCheckedNodes()[0].pathLabels.join('')
				this.senderData.regionCode = [...arr].pop()
			}
		},
		// 收件人省市区选择(单个)
		handleChangeReceiver(arr) {
			if (arr) {
				this.receiverFormData.receiveAddress = this.$refs.receiverCityCascader.getCheckedNodes()[0].pathLabels.join('')
				this.receiverFormData.receiveRegionCode = [...arr].pop()
			}
		},

		// 里层弹窗省市区选择
		handleChangeInner(arr) {
			if (arr) {
				this.addressInnerFormData.address = this.$refs.innerCityCascader.getCheckedNodes()[0].pathLabels.join('')
				this.addressInnerFormData.regionCode = [...arr].pop()
			}
		},

		// 完善修改弹窗省市区选择
		handleChangeReceiverImprove(arr) {
			if (arr) {
				this.receiverImproveDialogData.receiveAddress = this.$refs.improveCityCascader.getCheckedNodes()[0].pathLabels.join('')
				this.receiverImproveDialogData.receiveRegionCode = [...arr].pop()
			}
		},

		// 城市三级联动数据
		async getCityData() {
			const res = await getCityRegionTree()
			// console.log(res.data[0].children);
			this.cityList = res.data[0].children
		},

		// 获取城市父级
		async getCityParent() {
			const res = await getCityParents({ code: this.selectAddress.regionCode })
			// console.log('城市父级', res)
			this.$refs['senderDataForm'].clearValidate()
			Object.assign(this.senderData, { regionCodeArr: res.data.slice(1) })
		},
		// 里层弹窗获取城市父级
		async getCityParentInner(row) {
			const res = await getCityParents({ code: row.regionCode })
			// console.log('城市父级', res)
			this.$set(this.addressInnerFormData, 'regionCodeArr', res.data.slice(1))
		},
		// 完善修改获取城市父级
		async getCityParentImproveDialog(row) {
			const res = await getCityParents({ code: row.receiveRegionCode })
			// console.log('城市父级', res)
			this.$set(this.receiverImproveDialogData, 'receiveRegionCodeArr', res.data.slice(1))
		},

		// 复用地址信息
		async copyAddressUse(data) {
			this.senderData = {		// 复用寄件人
				name: data.senderName,
				companyName: data.senderCompany,
				contactNumber: data.senderMobile,
				fixedLine: data.senderFixedLine,
				detailAddress: data.senderDetailAddress,
				address: data.senderAddress,
				regionCode: data.senderRegionCode
			}

			this.receiverTableData.push({	// 复用收件人
				receiveName: data.receiveName,
				receiveCompany: data.receiveCompany,
				receiveFixedLine: data.receiveFixedLine,
				receiveMobile: data.receiveMobile,
				receiveRegionCode: data.receiveRegionCode,
				receiveAddress: data.receiveAddress,
				receiveDetailAddress: data.receiveDetailAddress,
				isNew: false
			})

			const res = await getCityParents({ code: data.senderRegionCode })
			console.log('城市父级', res)
			res.success && this.$set(this.senderData, "regionCodeArr", res.data.slice(1,))
		},

		// 返回
		goBack() {
			this.$router.push({ name: 'mailManageList' })
		}
	}
}
</script>

<style lang="less" scoped>
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

.addressDialog {
	cursor: pointer;
}

.container {
	// background: #f7f7f7;
	background-color: #eee;
	padding: 30px;
}

.content {
	background-color: #fff;
	border-radius: 3px;
	padding: 10px 40px;
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
		margin-top: 30px;

		.button_wrap {
			display: flex;
			align-items: center;
			height: 40px;
		}

		.form_wrap {
			padding: 20px 200px 0 20px;
		}

		.table_wrap {
			padding: 5px 10px 0 10px;
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
}

/deep/.receiver_table_header {
	color: #333;
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
}

/deep/.header_row_name,
/deep/.row-class-name {
	color: #333;
}
/deep/ .el-table td {
	padding: 5px 0;
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
