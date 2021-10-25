<template>
	<div class="mail-main">
		<div>
			<div class="content-list">
				<div class="title_wrap">
					<el-row>
						<el-col :span="18">
							<div class="title_1">寄件人</div>
						</el-col>
						<el-col :span="5">
							<div class="button_wrap">
								<el-button type="primary" icon="el-icon-document" size="mini"
									@click="handleAddressBookShow">地址簿</el-button>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="from-list-main">
					<el-form ref="recipientsForm" label-position="right" :model="senderData" :rules="recipientsRules">
						<el-form-item label="姓名" prop="name">
							<el-input v-model.trim="senderData.name" size="medium" placeholder="请输入姓名"
								oninput="value=value.replace(/[`~!@#$%^&*_\+=<>?:&quot;{}|,.\/;‘\\[\]·~！@#￥%……&*——\+={}|《》？：“”【】、；‘’，。、…… ]/g,&quot;&quot;);"
								maxlength="15" />
						</el-form-item>
						<el-form-item label="手机号码" prop="phone" class="dont-need-verify">
							<el-input v-model.trim="senderData.phone" size="medium" placeholder="固话号码与手机号码必填一个"
								maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" />
						</el-form-item>
						<el-form-item label="固话号码" prop="fixPhone" class="dont-need-verify">
							<el-input v-model.trim="senderData.fixPhone" size="medium" placeholder="固话号码与手机号码必填一个"
								oninput="value=value.replace(/[^\d,( ) -]/g,'');" maxlength="16" />
						</el-form-item>
						<el-form-item label="公司名称" prop="companyName" class="dont-need-verify">
							<el-input v-model.trim="senderData.companyName" size="medium" placeholder="请输入公司名称(选填)"
								maxlength="36" />
						</el-form-item>
						<el-form-item label="省市区(县)" prop="city">
							<el-cascader ref="myCascader" v-model="senderData.city" :options="options" :props="{
                  value: 'name',
                  label: 'name',
                  children: 'children',
                }" size="medium" placeholder="请选择省市区(县)" @change="handleChange" />
						</el-form-item>
						<el-form-item label="详细地址" prop="address">
							<el-input v-model="senderData.address" size="medium" placeholder="请输入详细地址" maxlength="120"
								oninput="value=value.replace(/[`~!@#$%^&*_\+=<>?:&quot;{}|,.\/;‘\\[\]·~！@#￥%……&*——\+={}|《》？：“”【】、；‘’，。、…… ]/g,&quot;&quot;);" />
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="content-list table-data-main">
				<el-table :data="summonedPersonData" :header-cell-style="{color: '#333', background: '#e6f6fe',}" border
					style="width: 100%">
					<el-table-column prop="name" label="受送达人" width="" />
					<el-table-column prop="phone" label="手机号码" width="" />
					<el-table-column prop="fixedLine" label="固话号码" />
					<el-table-column prop="company" label="公司名称 " />
					<el-table-column prop="" label="地址">
						<template slot-scope="scope">
							<span>{{ scope.row.province }}</span>
							<span>{{ scope.row.city }}</span>
							<span>{{ scope.row.county }}</span>
							<span>{{ scope.row.deatilAddress }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="content-list">
				<div class="title">快递信息</div>
				<div class="from-list-main">
					<el-form ref="expressageForm" label-position="right" :model="expressData" :rules="expressageRules">
						<el-form-item label="快递公司" prop="name">
							<el-input v-model="expressData.name" size="medium" disabled />
						</el-form-item>
						<el-form-item label="寄件方式" prop="expressMethod">
							<!-- <el-input v-model="expressData.way" size="medium" disabled /> -->
							<el-select v-model="expressData.expressMethod" size="medium" placeholder="请选运费支付方式">
								<el-option label="预约上门揽收" value="0" />
								<el-option label="固定地址揽收" value="1" />
							</el-select>
						</el-form-item>
						<el-form-item label="预约上门时间" prop="time">
							<el-input v-if="timeDisable" v-model="expressData.time" size="medium" disabled />
							<el-popover v-else placement="top" width="420" trigger="click" v-model="popoverVisible">
								<el-input slot="reference" v-model="expressData.time" placeholder="请选择预约上门时间"
									size="medium" />
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
						<el-form-item label="运费支付方式" prop="payWay">
							<el-select v-model="expressData.payWay" size="medium" placeholder="请选运费支付方式">
								<el-option label="寄付月结" value="1" />
								<el-option label="到付" value="3" />
								<el-option label="寄付现结" value="11210" />
							</el-select>
						</el-form-item>
						<el-form-item label="物品类型" prop="type">
							<el-select v-model="expressData.type" size="medium" placeholder="请选择物品类型">
								<el-option label="文件" value="1" />
							</el-select>
						</el-form-item>
						<el-form-item label="物品信息">
							<el-input v-model="expressData.goodsData" placeholder="请输入文件名称或文件内容的简述" size="medium"
								maxlength="80"
								oninput="value=value.replace(/[`~!@#$%^&*_\+=<>:&quot;{}|.\/;‘\\[\]·~！@#￥%……&*——\+={}|《》：“”【】、；‘’。、…… ]/g,&quot;&quot;);" />
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="btn">
				<el-button type="primary" size="medium" style="width: 300px" @click="getSendLetterSuccessful">呼叫快递
				</el-button>
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
			<el-form style="margin-top:30px;" :rules="addressFormRules" label-position="right"
				label-width="110px !important" :model="addressInnerFormData" ref="addressInnerForm">
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
	</div>
</template>

<script>
const moment = require('moment')
import {
	getPersonRreceiptInfo,
	getCityData,
	mailOrder,
	getOrgInfo,
	getMailEvidReceivePersonInfo,
	mailOrderBack
} from '../../api/cloudMail'
import {
	addressFormRules,
	validPhoneComputed,
	validFixlineComputed
} from '../../utils/validate';
import {
	getCityRegionTree,
	getCityParents,
	getAddressBookList,
	updateExpressAddress,
	deleteExpressAddress,
} from '../../api/addressBook';
import { Loading } from 'element-ui';
export default {
	data() {
		var validFixPhone = (rule, value, callback) => {
			if (this.senderData.phone === '' && value === '') {
				callback(new Error('手机号码与固话号码必填一个'))
			} else if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.senderData.phone)) {
				callback()
			} else {
				if (!value) {
					callback(new Error('请输入固话号码'))
				} else if (!/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(value)) {
					callback(new Error('请输入正确的固话号码'))
				} else {
					callback()
				}
			}
		}
		var validPhone = (rule, value, callback) => {
			if (this.senderData.fixPhone === '' && value === '') {
				callback(new Error('手机号码与固话号码必填一个'))
			} else if (
				/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(this.senderData.fixPhone)
			) {
				callback()
			} else {
				if (!value) {
					callback(new Error('请输入手机号'))
				} else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
					callback(new Error('请输入正确的手机号'))
				} else {
					callback()
				}
			}
		}
		var validCompanyName = (rule, value, callback) => {
			// console.log(value);
			if (value === '') {
				callback()
			} else {
				if (value.length < 5) {
					callback(new Error('公司名称需输入5-35个字'))
				} else {
					callback()
				}
			}
		}
		return {
			id: '',
			summonedPersonData: [],
			recipientsRules: {
				name: [
					{ required: true, message: '请输入名字', trigger: 'blur' },
					{
						min: 2,
						max: 15,
						message: '姓名需输入 2 - 15 个字',
						trigger: 'blur'
					}
				],
				fixPhone: [
					{ required: true, validator: validFixPhone, trigger: 'blur' }
				],
				phone: [{ required: true, validator: validPhone, trigger: 'blur' }],

				city: [{ required: true, message: '请选择省市区', trigger: 'change' }],
				address: [
					{ required: true, message: '请输入详细地址', trigger: 'blur' },
					{
						min: 5,
						max: 120,
						message: '长度在 5 到 120 个字符',
						trigger: 'blur'
					}
				],
				companyName: [
					{ required: true, validator: validCompanyName, trigger: 'blur' }
				]
			},
			expressageRules: {
				name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
				way: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
				payWay: [
					{ required: true, message: '请选择运费支付方式', trigger: 'change' }
				],
				type: [
					{ required: true, message: '请选择物品类型', trigger: 'change' }
				],
				time: [
					{ required: true, message: '请选择预约上门时间', trigger: 'blur' }
				]
			},
			options: [],
			tableData: [],
			senderData: {
				name: '',
				phone: '',
				fixPhone: '',
				companyName: '',
				city: '',
				address: '',
				id: ''
			},
			expressData: {
				name: '中国邮政ems',
				way: '上门取件',
				time: '',
				payWay: '1',
				type: '1',
				goodsData: '',
				expressMethod: "0",
				reserveDate: "",
				reserveTime: "",
			},
			address: '',
			SelectdeptId: [],


			addressDialog: false,
			addressList: [],
			selectAddress: "",
			addressPagination: {	// 地址bu分页
				pageNum: 1,
				pageSize: 8,
			},
			addressTotal: 0,

			addressInnerVisible: false,
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
			cityList: [],
			evidMailId: "",
			popoverVisible: false,
			expressTimeMark: 1,	// 今天明天后天标记
			timeList: [],
			timeDisable: false,
			selectDay: "",
			type: "",
		}
	},
	created() {
		// console.log(this.$route);
		this.id = sessionStorage.getItem('entryId')
		this.evidMailId = this.$route.query.eMId
		this.type = this.$route.query.type
		console.log(this.id)
		if (this.type != "back") {
			getPersonRreceiptInfo({ evidId: this.id }).then((res) => {
				console.log(res, '受送达人信息')
				this.summonedPersonData = res.data
				getCityData().then((res) => {
					console.log(res, '城市三级联动数据')
					this.options = res.data[0].children
					this.cityList = res.data[0].children
					getOrgInfo({ evidId: this.id }).then((res) => {
						// console.log(res, '公证处信息')
						// this.senderData.name = res.data.officeName
						this.senderData.address = res.data.orgAddress

						this.senderData.city = [res.data.prov, res.data.city, res.data.county]
						// console.log(this.senderData)
						// getShippingInformation({ evidId: this.id }).then(val => {
						// 	console.log(val, '-----------------8888---------------')
						// 	this.senderData.companyName = val.data.orgName
						// 	this.senderData.name = val.data.updateUserName
						// 	this.senderData.phone = val.data.updateUserPhone
						// })
					})
				})
			})
		}
		// if (this.$route.query.id) {
		//   this.id = this.$route.query.id;
		// } else {
		//   this.id = sessionStorage.getItem("entryId");
		//   var url = `/#${this.$route.path}?id=${this.id}`;
		//   history.pushState(null, null, url);
		// }
		this.getAddressList()
		this.getSenderData()
		this.generatorTime(9, 18)
		this.generatorDay(1)
	},
	computed: {
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
	methods: {
		// 今天明天后天时间切换
		handleTimeChange(e) {
			this.generatorDay(e)
			if (e == 2 || e == 3) {
				this.generatorTime(9, 18, 7) // 小于开始时间生成全部可选
				return
			}
			this.generatorTime(9, 18)	// 从当前时间开始生成
		},
		// 点击选择时间
		handleSelectTime(e, index) {
			console.log(e.target.innerHTML, index, this.expressTimeMark)
			this.$refs.expressageForm.clearValidate("time")
			this.timeSelectIndex = index
			this.preMark = this.expressTimeMark
			const text = e.target.innerHTML
			if (text == '今日无可预约时间') {
				return
			}

			if (text == '一小时内') {
				this.expressData.reserveDate = `${moment().format('YYYY')}-${this.selectDay}`
				this.expressData.reserveTime = `${moment().add(1, 'hours').format('HH:00')}-${moment().add(2, 'hours').format('HH:00')}`
				this.expressData.time = `${moment().format('YYYY')}-${this.selectDay} ${moment().add(1, 'hours').format('HH:00')}-${moment().add(2, 'hours').format('HH:00')}`
				this.popoverVisible = false
				return
			}

			this.expressData.reserveDate = `${moment().format('YYYY')}-${this.selectDay}`
			// const textArr = text.split('-')
			// this.expressData.reserveTime = `${this.selectDay} ${textArr[0]} 至 ${this.selectDay} ${textArr[1]}`
			this.expressData.reserveTime = text
			this.expressData.time = `${this.expressData.reserveDate} ${text}`
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
		async getSenderData() {
			let data = {
				personType: 1,
				evidMailId: this.evidMailId
			}

			let res = await getMailEvidReceivePersonInfo(data)
			console.log("getSenderData------", res);
			if (res.success && res.data) {
				const sender = res.data[0]
				if (this.type != "back") {	// 是否回退
					this.senderData.name = sender.name
					this.senderData.phone = sender.phone
					this.senderData.fixPhone = sender.fixedLine
					this.senderData.companyName = sender.company
					this.senderData.id = sender.id
					// this.senderData.city = [sender.province, sender.city, sender.county,]
					return
				}

				getCityData().then((res) => {
					console.log(res, '城市三级联动数据')
					this.options = res.data[0].children
					this.cityList = res.data[0].children
				})

				this.summonedPersonData.push({
					name: sender.name,
					phone: sender.phone,
					fixedLine: sender.fixedLine,
					company: sender.company,
					province: sender.province,
					city: sender.city,
					county: sender.county,
					deatilAddress: sender.deatilAddress,
					id: sender.id
				})
			}
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
		// 点击地址簿
		handleAddressBookShow() {
			this.addressDialog = true
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
		// 地址簿分页切换
		handleCurrentChange(val) {
			this.addressPagination.pageNum = val
			this.getAddressList()
		},
		// 地址簿选中地址确定
		handleAddreddComfirm() {
			console.log(this.selectAddress);
			this.addressDialog = false
			this.senderData.name = this.selectAddress.name
			this.senderData.phone = this.selectAddress.contactNumber
			this.senderData.fixPhone = this.selectAddress.fixedLine
			this.senderData.companyName = this.selectAddress.companyName
			this.senderData.address = this.selectAddress.detailAddress

			this.getCityParent()
		},
		// 地址簿选中地址切换
		handleCurrentSelect(val) {
			console.log('当前选中行', val);
			this.selectAddress = val
		},
		// 获取城市父级
		async getCityParent(regionCode) {
			let res = await getCityParents({ code: regionCode || this.selectAddress.regionCode })
			console.log('城市父级', res)
			this.$refs["recipientsForm"].clearValidate()
			if (res.success) {
				Object.assign(this.senderData, { regionCodeArr: res.data.slice(1,) })
				this.senderData.city = this.getCity(this.senderData.regionCodeArr, this.cityList)
			}

			if (regionCode) {
				setTimeout(() => {
					// console.log(this.$refs.cityCascader.presentText, this.$refs.cityCascader.inputValue);
					this.senderData.address = this.$refs.cityCascader.presentText.replace(/ \/ /g, "")
				}, 500);
			}
		},

		getCity(arr, params) {
			let mark = 0
			let result = []
			function getCityInner(params) {
				for (var i = 0; i < params.length; i++) {
					if (params[i].code == arr[mark]) {
						result.push(params[i].name)
						mark++
						if (params[i].children) {
							getCityInner(params[i].children)
						}
					}
				};
			}
			getCityInner(params)
			return result
		},

		// 里层弹窗获取城市父级
		async getCityParentInner(row) {
			let res = await getCityParents({ code: row.regionCode })
			// console.log('城市父级', res)
			res.success && this.$set(this.addressInnerFormData, "regionCodeArr", res.data.slice(1,))
		},
		// 里层弹窗省市区选择
		handleChangeInner(arr) {
			if (arr) {
				this.addressInnerFormData.address = this.$refs.cityCascader.getCheckedNodes()[0].pathLabels.join("");
				this.addressInnerFormData.regionCode = [...arr].pop()
			}
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
		// 地址限制输入
		handleInput(value, object, key) {
			if (value.length > 0) {
				this[object][key] = value.replace(/[`~!@#$%^&*_\+={}|<>?:",./;'\\[\]·~！@#￥%……&*（）——《》？：“”【】、；‘’，。、]/g, "").replace(/\s/, "")
			}
		},
		// 修改地址请求
		async updateAddress() {
			console.log(this.addressInnerFormData);
			this.addressInnerFormData.createTime = ""
			let res = await updateExpressAddress(this.addressInnerFormData)
			console.log('修改地址', res);
			this.feedBack(res, 0)
		},
		// 里层弹窗修改地址取消
		handleInnerDialogCancle(formName) {
			this.addressInnerVisible = false
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

		changeDetSelect(key, treeData) {
			const arr = [] // 在递归时操作的数组
			let returnArr = [] // 存放结果的数组
			let depth = 0 // 定义全局层级
			// 定义递归函数
			function childrenEach(childrenData, depthN) {
				for (var j = 0; j < childrenData.length; j++) {
					depth = depthN // 将执行的层级赋值 到 全局层级
					arr[depthN] = childrenData[j].code
					if (childrenData[j].code === key) {
						returnArr = arr.slice(0, depthN + 1) // 将目前匹配的数组，截断并保存到结果数组，
						break
					} else {
						if (childrenData[j].nodes) {
							depth++
							childrenEach(childrenData[j].nodes, depth)
						}
					}
				}
				return returnArr
			}
			return childrenEach(treeData, depth)
		},
		getSendLetterSuccessful() {
			const p1 = new Promise((resolve, reject) => {
				this.$refs['expressageForm'].validate((valid) => {
					if (valid) {
						resolve(true)
					} else {
						reject(false)
					}
				})
			})
			const p2 = new Promise((resolve, reject) => {
				this.$refs['recipientsForm'].validate((valid) => {
					if (valid) {
						resolve(true)
					} else {
						reject(false)
					}
				})
			})
			Promise.all([p1, p2]).then((res) => {
				var list = []
				for (let index = 0; index < this.summonedPersonData.length; index++) {
					var info = {}
					info.evidId = this.id
					info.baseProductNo = parseInt(this.expressData.payWay)
					info.senderName = this.senderData.name
					info.senderAddress = this.senderData.city[0] + this.senderData.city[1] + this.senderData.city[2]
					info.senderDetailAddress = this.senderData.address
					info.senderContactNumber = ''
					info.expressMethod = this.expressData.expressMethod
					info.expressCompany = this.expressData.companyName
					info.reserveTime = this.expressData.reserveTime
					info.reserveDate = this.expressData.reserveDate
					info.goodsType = 1
					info.goodsInfo = this.expressData.goodsData
					info.evidPersonId = this.summonedPersonData[index].id
					info.senderRegionCode = this.findRegionCode(this.senderData)		// 添加城市编码
					if (this.senderData.phone && !this.senderData.fixPhone) {
						info.senderContactNumber = this.senderData.phone
					} else if (!this.senderData.phone && this.senderData.fixPhone) {
						info.senderContactNumber = this.senderData.fixPhone
					} else if (this.senderData.phone && this.senderData.fixPhone) {
						info.senderContactNumber = this.senderData.phone
					}
					list.push(info)
				}

				if (this.type == "back") {
					mailOrderBack(list).then((res) => {
						console.log(res, '呼叫快递揽收')
						if (res.success) {
							// this.$router.replace({ name: 'sendLetterSuccessful', query: { type: this.type } })
							this.$router.push({
								name: 'checkoutSuccess',
								query: {
									from: "entryDetail",
									ids: res.data.join(),
								}
							})
						} else {
							this.$message.error('下快递运单失败，请重试')
						}
					})
					return
				}

				mailOrder(list).then((res) => {
					console.log(res, '呼叫快递揽收')
					if (res.success) {
						this.$router.replace({ name: 'sendLetterSuccessful', query: { ids: res.data.join(), } }) // 不再区分回寄和寄件成功的页面
					} else {
						this.$message.error('下快递运单失败，请重试')
					}
				})
			}).catch((err) => {
				console.log(err);
				this.$message.warning("请先完善必填信息")
			})
		},
		handleChange(value) {
			// console.log(this.senderData.city)
			// const selectCity = this.$refs.myCascader.getCheckedNodes()[0]
			// var cityArray = selectCity.pathLabels
			// var str = ''
			// for (let index = 0; index < cityArray.length; index++) {
			//   str += cityArray[index]
			// }
			// this.address = str
			// console.log(this.address)
		},
		findRegionCode(sender) {
			let code
			this.options.forEach(province => {
				if (sender.city[0] == province.name) {
					province.children.forEach(city => {
						if (sender.city[1] == city.name) {
							city.children.forEach(county => {
								if (sender.city[2] == county.name) {
									code = county.code
									return
								}
							})
						}
					})
				}
			})
			return code
		},
	},
	watch: {
		"expressData.expressMethod"(val) {
			console.log(val);
			this.$refs.expressageForm.clearValidate("time")
			if (val == 1) {
				this.expressData.time = "上门取件"
				this.timeDisable = true
			} else {
				this.expressData.time = ""
				this.timeDisable = false
			}
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
/deep/ .el-radio-button__inner {
	margin: 10px;
	border-radius: 2px !important;
	border: 1px solid #dcdfe6;
	width: 100px;
}
.time_select_active {
	color: #409eff;
}
.title_wrap {
	padding: 3px 20px;
	background-color: #e6f6fe;

	.title_1 {
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
	.button_wrap {
		height: 46px;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}
}

.mail-main {
	// margin: 20px;
	// height: 300px;
	width: calc(100%);
	min-height: calc(100vh - 90px) !important;
	background: #fff;
	padding: 20px;
	.content-list {
		overflow: hidden;
		border: solid #eee 1px;
	}
	.table-data-main {
		margin: 40px 0;
	}
	.title {
		line-height: 40px;
		background: #e6f6fe;
		border-bottom: solid 1px #eee;
		margin-bottom: 20px;
		padding-left: 20px;
	}
	.from-list-main {
		.el-form {
			display: flex;
			flex-wrap: wrap;
			.el-form-item {
				width: 40%;
				display: flex;
				.el-form-item__label {
					line-height: 40px !important;
					width: 100px !important;
				}
				/deep/ .el-cascader,
				.el-select {
					width: 100%;
				}
			}
		}
	}
	.btn {
		padding-top: 20px;
		display: flex;
		justify-content: center;
	}
}
/deep/ .dont-need-verify {
	label::before {
		display: none;
	}
}
/deep/ .el-form-item__label {
	width: 150px !important;
}
/deep/ .el-form-item__content {
	flex: 1;
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
