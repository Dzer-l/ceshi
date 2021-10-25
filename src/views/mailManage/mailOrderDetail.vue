<template>
	<div class="entry-dateail-mian">
		<!-- <router-view /> -->
		<div class="entry-dateail">
			<div class="go-back-btn">
				<el-button type="primary" size="small" style="width:80px" @click="goBack">返回
				</el-button>
			</div>

			<!-- 订单信息头部 -->
			<div class="basic-order-information">
				<h3 class="mail_status">
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					邮寄编号：{{ orderDetail.expressNum}}
					<el-button type="text" style="padding: 0 20px" class="copy-order-num" :disabled="jurisdiction"
						:data-clipboard-text="orderDetail.expressNum" @click="copyNum">复制</el-button>
				</h3>

				<div class="basic-order-information-list">
					<ul>
						<li>
							<span class="info-title">订单编号：</span>
							<el-tooltip popper-class="atooltip" placement="bottom">
								<div slot="content" class="tooltipContent">
									<span style="font-size: 13px;"><i class="el-icon-info"
											style="color: #409EFF;" /></span>
									点击该订单编号跳转到对应订单的“订单详情”页
								</div>
								<el-button type="text" @click="goOrderDetil()">{{ orderDetail.orderNum }}
								</el-button>
							</el-tooltip>
						</li>
						<li>
							<span class="info-title">业务类型：</span>
							<span>{{ orderDetail.prodName }}</span>
						</li>
						<li>
							<span class="info-title">办证点：</span>
							<span>{{ orderDetail.officePoint }}</span>
						</li>
						<li>
							<span class="info-title">提交时间：</span>
							<span>{{ orderDetail.createTime }}</span>
						</li>
						<li>
							<span class="info-title">订单来源：</span>
							<span>{{ orderDetail.orderSource | filterOrderSource}}</span>
						</li>
					</ul>
					<ul>
						<li>
							<span class="info-title">发证类型：</span>
							<span>{{ orderDetail.certificateType | filterCrtificateType}}</span>
						</li>
						<li v-if="orderDetail.prodCode!='xxfz'">
							<span class="info-title">承办人：</span>
							<span>{{ orderDetail.acceptSysUserName}}</span>
						</li>
						<li>
							<span class="info-title">发证人：</span>
							<span>{{ orderDetail.operatingUserName }}</span>
						</li>
						<!-- <li>
							<span class="info-title">承办人：</span>
							<span>{{ orderDetail.acceptSysUserName }}</span>
						</li> -->
					</ul>
					<ul>
						<li class="mail_status">
							<i class="el-icon-warning"></i>
							<span>订单状态：</span>
							<span>{{ orderDetail.orderStatus | filterOrderStatus}}</span>
						</li>
					</ul>
				</div>
			</div>

			<!-- 卷宗信息 -->
			<div class="basic-order-information" style="margin-top:10px">
				<h3 class="mail_status">
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					卷宗信息
				</h3>
				<div class="dos_info">
					<span class="info-title">卷宗号：</span>
					<span>{{ orderDetail.dossierNum }}</span>
				</div>
			</div>

			<div class="detail_container">
				<!-- 当事人信息 -->
				<div v-if="type" class="content">
					<h3 class="title">
						<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
						当事人信息
					</h3>
					<div class="info_content">
						<el-table :data="litigantTableData" style="width: 100%">
							<el-table-column width="100">
								<template>
									<el-tag type="success" style="background:#d8f7ca;color:#4DD90D;">申请人</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="applicantName" label="当事人名称" align="center">
							</el-table-column>
							<el-table-column label="证件类型" align="center">
								<template slot-scope="{row}">
									{{row.cardType | filterCardType}}
								</template>
							</el-table-column>
							<el-table-column prop="cardNum" label="证件号码" align="center">
							</el-table-column>
							<el-table-column prop="contact" label="手机号码" align="center">
							</el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-link type="primary" style="display:inline-block;margin:0 10px;"
										@click="handleToDetail(scope.$index, scope.row)">查看详情</el-link>
									<!-- <el-link type="primary" @click="handleToMail(scope.$index, scope.row)">去邮寄</el-link> -->
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>

				<div v-else class="content">
					<h3 class="title">
						<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
						当事人信息
					</h3>
					<div v-if="orderDetail.prodCode == 'xxfz'" class="info_content">
						<el-table :data="litigantTableData" style="width: 100%" border>
							<el-table-column width="200" align="center">
								<template slot-scope="{row}">
									<el-tag v-if="orderDetail.prodCode == 'xxfz'" type="success"
										style="background:#d8f7ca;color:#4DD90D;">申请人</el-tag>
									<el-tag v-else type="success"
										style="background:#d8f7ca;color:#4DD90D;">
										{{row.proposerType | filterProposerType}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="当事人名称" align="center">
								<template slot-scope="{row}">
									<span>{{row.applicantName}}</span>
								</template>
							</el-table-column>
							<el-table-column label="证件类型" align="center">
								<template slot-scope="{row}">
									{{row.cardType | filterCardType}}
								</template>
							</el-table-column>
							<el-table-column label="证件号码" align="center">
								<template slot-scope="{row}">
									<span>{{row.cardNum}}</span>
								</template>
							</el-table-column>
							<el-table-column label="手机号码" align="center">
								<template slot-scope="{row}">
									<span>{{row.contact}}</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-link type="primary" style="display:inline-block;margin:0 10px;"
										@click="handleToDetail(scope.$index, scope.row)">查看详情</el-link>
									<!-- <el-link type="primary" @click="handleToMail(scope.$index, scope.row)">去邮寄</el-link> -->
								</template>
							</el-table-column>
						</el-table>
					</div>

					<div v-else class="info_content">
						<el-table :data="partiesTableData" style="width: 100%" border>
							<el-table-column prop="" label="" width="200" align="center">
								<template slot-scope="scope">
									<el-tag type="success">{{ scope.row.type }}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="" label="当事人名称" align="center">
								<template slot-scope="scope">
									<span>
										{{ scope.row.name }}
									</span>
								</template>
							</el-table-column>
							<el-table-column label="证件类型" align="center">
								<template slot-scope="scope">
									<span>
										{{ scope.row.cradType|filterCardType }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="" label="证件号码" align="center">
								<template slot-scope="scope">
									<span>
										{{ scope.row.idCrad }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="" label="手机号码" align="center">
								<template slot-scope="scope">
									<span>
										{{ scope.row.phone }}
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="" label="操作" align="center">
								<template slot-scope="scope">
									<el-link type="primary" style="display:inline-block;margin:0 10px;"
										@click="handleToDetail(scope.$index, scope.row)">查看详情</el-link>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>

				<!-- 邮寄地址 -->
				<div class="content" v-if="orderDetail.prodCode=='xxfz'">
					<div class="title_content">
						<h3>
							<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
							邮寄地址
						</h3>
						<div v-if="orderDetail.orderStatus==303||orderDetail.orderStatus==304">
							<el-button type="primary" size="medium" @click="handleToMailInfo">查看物流</el-button>
						</div>
					</div>
					<div>
						<div class="info_content">
							<div class="mail_info">收件人信息</div>
							<el-row>
								<el-col :span="8">
									<div class="info_content_text text_1">姓名：
										<span class="info_bold">{{receiverAddressData.receiveName}}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="info_content_text text_1">手机号码：
										<span class="info_bold">{{receiverAddressData.receiveMobile}}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="info_content_text text_1">公司名称（选填）：
										<span class="info_bold">{{receiverAddressData.receiveCompany}}</span>
									</div>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<div class="last_wrap">
										<div class="text_1" style="min-width:80px;margin-left:20px;">地址：
										</div>
										<div class="info_bold" style="line-height:20px">
											{{receiverAddressData.receiveAddress + receiverAddressData.receiveDetailAddress}}
										</div>
									</div>

								</el-col>
							</el-row>
						</div>
					</div>
				</div>

				<!-- 领证信息 -->
				<!-- <div class="content" v-else>
					<div class="title_content">
						<h3>
							<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
							领证信息
						</h3>
					</div>
					<div>
						<el-row :gutter="20">
							<el-col :span="6">
								<div class="info_content_text">公证书份数：<span class="info_bold">1111111111份</span></div>
							</el-col>
							<el-col :span="6">
								<div class="info_content_text">领取方式：<span class="info_bold"></span></div>
							</el-col>
						</el-row>
						<div class="info_content">
							<div class="mail_info" style="display:flex;justify-content: space-between;">
								<div>
									领证人信息
								</div>
								<div style="padding-right:10px">
									<el-button size="medium" type="primary" @click="handleToSubscribe">查看预约信息
									</el-button>
								</div>
							</div>
							<el-row>
								<el-col :span="8">
									<div class="info_content_text text_1">姓名：<span class="info_bold"></span></div>
								</el-col>
								<el-col :span="8">
									<div class="info_content_text text_1">证件类型：<span class="info_bold"></span></div>
								</el-col>
								<el-col :span="8">
									<div class="info_content_text text_1">证件号码：<span class="info_bold"></span></div>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="8">
									<div class="info_content_text text_1">手机号码：</div>
								</el-col>
							</el-row>
						</div>
					</div>
				</div> -->
			</div>

			<!-- 底部状态栏 -->
			<footer-status :orderStatus="orderDetail.orderStatus" :orderDetail="orderDetail"
				:receiverAddressData="receiverAddressData" @cancelOrder="cancelOrder"></footer-status>
		</div>

		<!-- 当事人信息弹窗 -->
		<el-dialog title="当事人信息" :visible.sync="showLitigantDialog" width="500px" center>
			<div style="padding-left:20px">
				<el-form label-position="left" :model="orderDetail" label-width="120px">
					<el-form-item label="姓名">{{orderDetail.applicantName}}</el-form-item>
					<el-form-item label="证件类型">{{orderDetail.cardType | filterCardType}}</el-form-item>
					<el-form-item label="证件号码">{{orderDetail.cardNum}}</el-form-item>
					<el-form-item label="性别">{{orderDetail.gender | filterGender}}</el-form-item>
					<el-form-item label="出生日期"></el-form-item>
					<el-form-item label="手机号码">{{orderDetail.contact}}</el-form-item>
					<el-form-item label="地址"></el-form-item>
				</el-form>
			</div>
			<!-- <span slot="footer">
				<el-button style="width:150px" type="primary" size="medium" @click="showLitigantDialog=false">确定
				</el-button>
			</span> -->
		</el-dialog>
		<el-dialog title="当事人信息" top="10vh" :visible.sync="compileParties" width="600px" :close-on-click-modal="false">
			<div style="padding-left:60px"
				v-if="partiesInfo.organizationType !== 0&&partiesInfo.organizationType !== null">
				<el-form label-position="left" label-width="110px">
					<el-form-item label="企业名称">{{partiesInfo.organizationName}}</el-form-item>
					<el-form-item label="证件类型">{{partiesInfo.organizationCardType | filterCardType}}</el-form-item>
					<el-form-item label="证件号码">{{partiesInfo.organizationCardNum}}</el-form-item>
					<el-form-item label="联系电话">{{partiesInfo.organizationPhone}}</el-form-item>
					<el-form-item label="所在地区">
						{{partiesInfo.organizationProvince + partiesInfo.organizationCity + partiesInfo.organizationCounty || ""}}
					</el-form-item>
					<el-form-item label="详细地址">{{partiesInfo.organizationDetailAddress}}</el-form-item>
				</el-form>
			</div>
			<el-divider v-if="partiesInfo.organizationType !== 0&&partiesInfo.organizationType !== null"></el-divider>
			<div style="padding-left:60px">
				<el-form label-position="left" label-width="110px">
					<el-form-item :label="`${partiesInfo.organizationType === 0 ? '姓名' : '法定代表人'}`">
						{{partiesInfo.realName}}
					</el-form-item>
					<el-form-item label="证件类型">{{partiesInfo.cardTypeDesc}}</el-form-item>
					<el-form-item label="证件号码">{{partiesInfo.cardNum}}</el-form-item>
					<el-form-item label="性别">{{partiesInfo.gender | filterGender}}</el-form-item>
					<el-form-item label="出生日期">{{partiesInfo.birthday}}</el-form-item>
					<el-form-item label="手机号码">{{partiesInfo.mobile}}</el-form-item>
					<el-form-item label="地址">{{ partiesInfo.province + partiesInfo.city + partiesInfo.county  || ""}}
					</el-form-item>
					<el-form-item label="详细地址">{{partiesInfo.detailAddress}}</el-form-item>
				</el-form>
			</div>
		</el-dialog>

		<!-- 查看预约信息弹窗 -->
		<el-dialog title="领证信息" :visible.sync="showSubscribeDialog" width="800px">
			<div style="padding-left:0 20px">
				<el-form style="padding:0 50px" label-position="left" :model="getLicenseForm" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="订单编号：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="卷宗号：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="领取人：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="证件类型：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="证件号码：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机号码：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="公证书份数：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="领取时间：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="领取地点：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="领证号：">{{getLicenseForm.realName}}</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<!-- <span slot="footer" style="padding-right:40px">
				<el-button type="primary" @click="showSubscribeDialog=false">确定预约</el-button>
			</span> -->
		</el-dialog>
	</div>

</template>

<script>
import Clipboard from 'clipboard';
import footerStatus from '../../components/mailManage/footerStatus';
import {
	getOnlineMailListDetail,
	getReceiverAddressList,
	orderProposeByOrderNum,
	getOrderByOrderNumOrderNum,
	getOrderOfflineReceiveDetail
} from '../../api/mailManage';
import {
	getProposeDateailInfo,
} from '../../api/cloudMail';
import { filterCardType } from '../../filters/index';
import { filterProposerType } from '../../utils/filters';
export default {
	components: {
		footerStatus
	},
	filters: {
		filterGender(v) {
			return v == 1 ? "男" : "女"
		},
		filterCrtificateType(e) {
			return e == 0 ? "平台业务发证" : "窗口业务发证"
		},
		filterOrderStatus(e) {
			let status
			switch (e) {
				case 302:
					status = "待邮寄"
					break;
				case 303:
					status = "已邮寄"
					break;
				case 304:
					status = "已邮寄"
					break;
				case 307:
					status = "已取消"
					break;
			}
			return status
		},
		filterOrderSource(v) {
			return v == 1 ? "PC" : "小程序"
		},
		filterCardType,
		filterProposerType,
		// filterProposerType(val) {
		// 	const status = {
		// 		0: "申请人",
		// 		1: "委托人",
		// 		2: "公证员",
		// 		3: "原公众号个人主体",
		// 		4: "原公众号企业主体",
		// 		5: "目标公众号企业主体",
		// 		6: "原公众号管理员",
		// 		7: "目标公众号管理员",
		// 		8: "原公众号委托人",
		// 		9: "目标公众号委托人",
		// 		10: "受让人",
		// 		11: "代理人"
		// 	}
		// 	return status[val]
		// },
	},
	data() {
		return {
			orderDetail: {},// 详情
			jurisdiction: false,
			showLitigantDialog: false,
			showSubscribeDialog: false,
			litigantTableData: [], // 当事人信息
			receiverAddressData: {},// 邮寄地址

			getLicenseForm: { // 领证人信息
				realName: '王小虎',
			},
			partiesTableData: [],
			compileParties: false,
			partiesInfo: {},
			orderDTO: {},
			type: "",
		}
	},
	methods: {
		// 跳转订单详情页
		async goOrderDetil() {
			let res = await getOrderByOrderNumOrderNum(this.orderDetail.orderNum)
			console.log(res, "-----------------------------------");
			if (res.success && res.data) {
				this.orderDTO = res.data
				if (this.orderDTO.businessType === 1) {
					this.$router.push({
						name: 'delegateInfo',
						query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
					})
				} else if (this.orderDTO.businessType === 2 || this.orderDTO.businessType === 3) {
					this.$router.push({
						name: 'detailsOrder',
						query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
					})
				} else if (this.orderDTO.businessType === 4 || this.orderDTO.businessType === 5 || this.orderDTO.businessType === 6 || this.orderDTO.businessType === 7 || this.orderDTO.businessType === 11 || this.orderDTO.prodCode === 'ysf') {
					this.$router.push({
						name: 'entryDetailsOrder',
						query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
					})
				}
				// else if (this.orderDTO.businessType === 5) {
				// 	this.$router.push({
				// 		name: 'entryDetail',
				// 		query: { orderId: this.orderDTO.id, orderNum: this.orderDTO.orderNum }
				// 	})
				// }
			}
		},

		// 获取详情
		async getOrderDetail() {
			if (this.type) {
				let data = { orderNum: this.$route.query.orderNum }
				let res = await getOrderOfflineReceiveDetail(data)
				console.log('详情--->', res);
				this.litigantTableData = res.data.orderProposerReDTOS

				return
			}

			let res = await getOnlineMailListDetail(this.$route.query.id)
			console.log('详情--->', res);
			this.orderDetail = res.data
			if (res.data.prodCode === "xxfz") {
				this.litigantTableData.push(res.data)
			} else {
				this.getProposer(res.data.orderNum)
			}
		},

		// 获取申请人及受让人信息 (仅线上邮寄有)
		async getProposer(orderNum) {
			let res = await orderProposeByOrderNum(orderNum)
			if (res.success && res.data) {
				this.partiesTableData = this.dispose(res.data)
			}
		},

		dispose(array) {
			var list = []
			let t = 0
			for (let index = 0; index < array.length; index++) {
				var uo = { id: '', type: '', name: '', cradType: '', idCrad: '', phone: '', organizationType: '', cradTypeDsc: '' }
				uo.id = array[index].id
				uo.type = array[index].proposerTypeDesc

				if (parseInt(array[index].organizationType) === 0) {
					uo.organizationType = array[index].organizationType
					uo.name = array[index].realName
					uo.cradType = array[index].cardType
					uo.cradTypeDsc = array[index].cardTypeDesc
					uo.idCrad = array[index].cardNum
					uo.phone = array[index].mobile
					if (parseInt(array[index].proposerType) === 0 && (array[index].roleCode !== 'zbls' && array[index].roleCode !== 'xbls')) {
						t++
						if (t === 1) {
							list.unshift(uo)
						} else {
							list.push(uo)
						}
					} else {
						list.push(uo)
					}
				} else {
					if (parseInt(array[index].proposerType) === 0) {
						uo.organizationType = array[index].organizationType
						uo.name = array[index].organizationName
						uo.cradType = array[index].organizationCardType
						uo.idCrad = array[index].organizationCardNum
						uo.phone = array[index].organizationPhone
						uo.cradTypeDsc = array[index].cardTypeDesc
						list.unshift(uo)
					} else {
						uo.organizationType = 0
						uo.name = array[index].realName
						uo.cradType = array[index].cardType
						uo.idCrad = array[index].cardNum
						uo.phone = array[index].mobile
						uo.cradTypeDsc = array[index].cardTypeDesc
						list.push(uo)
					}
				}
			}
			return list
		},

		// 获取收件人邮寄地址
		async getReciver() {
			let res = await getReceiverAddressList(this.$route.query.id)
			// console.log('收件人邮寄地址--->', res);
			this.receiverAddressData = res.data[0]
		},

		// 查看当事人详情
		handleToDetail(index, row) {
			console.log(row);
			if (this.orderDetail.prodCode === "xxfz") {
				this.showLitigantDialog = true
			} else {
				this.getProposeDateail(row.id)
			}
		},

		async getProposeDateail(id) {
			let res = await getProposeDateailInfo({ orderProposeId: id })
			if (res.success && res.data) {
				this.partiesInfo = res.data
				this.compileParties = true
			}
		},

		// 查看预约
		handleToSubscribe() {
			this.showSubscribeDialog = true
		},

		// 查看物流
		handleToMailInfo() {
			console.log(this.orderDetail);
			this.$router.push({
				name: "mailingDetail",
				query: { id: this.orderDetail.expressInfoId }
			})
		},

		// 点击复制订单编号
		copyNum() {
			this.copy('.copy-order-num')
		},
		copy(val) {
			// eslint-disable-next-line no-undef
			const clipboard = new Clipboard(val) // 这里括号里填写上面点击事件绑定的class名
			// console.log(clipboard);
			clipboard.on('success', (e) => {
				// 复制成功，提示根据自己项目实际使用的UI来写
				this.$message({
					showClose: true,
					message: '复制成功',
					type: 'success',
					duration: 2000
				})
				// 释放内存
				clipboard.destroy()
			})
			clipboard.on('error', (e) => {
				// 不支持复制，提示根据自己项目实际使用的UI来写
				// 释放内存
				clipboard.destroy()
			})
		},

		cancelOrder() {
			this.getOrderDetail()
			this.litigantTableData = []
		},

		// 返回
		goBack() {
			this.$router.push({ name: 'mailManageIndex' })
		}
	},
	created() {
		this.getOrderDetail()
		this.getReciver()
	},
}
</script>

<style lang="less" scoped>
.entry-dateail-mian {
	background: #eee;
	min-height: calc(100vh - 50px);
	padding: 20px;
	padding-bottom: 0;
	position: relative;
	display: flex;
	flex-flow: column;
	font-size: 14px;
	color: #333;

	.go-back-btn {
		position: absolute;
		right: 20px;
		top: 20px;
	}

	.entry-dateail {
		min-height: calc(100vh - 70px);
		padding-bottom: 5px;
		position: relative;
	}
	.basic-order-information {
		background: #fff;
		padding: 20px;
		border-radius: 3px;
		h3 {
			margin: 0;
			display: flex;
			align-items: center;
		}
		.basic-order-information-list {
			display: flex;
			margin-top: 20px;
			ul {
				padding: 0 100px 0 0;
				li {
					display: flex;
					align-items: center;
					span {
						line-height: 30px;
					}
					.info-title {
						display: block;
						width: 100px;
						text-align: right;
					}
					.stress-text {
						font-size: 20px;
						color: yellowgreen;
						font-weight: bold;
						line-height: 40px;
					}
				}
			}
		}
	}
}

.info_content {
	border: 1px solid #eee;
}

/deep/.el-table td {
	padding: 6px;
}

.detail_container {
	margin-top: 20px;
	background-color: #fff;
	border-radius: 4px;
	padding: 30px;
}

.content {
	&:nth-child(2) {
		margin-top: 45px;
	}
	.title_content {
		display: flex;
		background-color: #e6f6fe;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
		font-size: 16px;
		padding-right: 10px;
	}

	.info_content_text {
		line-height: 40px;
		margin-left: 20px;
		color: #666;
	}

	.last_wrap {
		display: flex;
		height: 60px;
		padding: 10px 30px 15px 0;

		& > .text_1 {
			color: #666;
		}
	}

	.text_1 {
		padding-left: 30px;
	}

	.info_bold {
		color: #333;
	}

	.title {
		background-color: #e6f6fe;
		font-weight: bold;
		line-height: 50px;
		font-size: 18px;
	}
	.title_btn {
		margin-left: auto;
	}
}

.mail_info {
	line-height: 60px;
	padding-left: 20px;
	font-weight: bold;
	border: 1px solid #eee;
}

/deep/ .el-input.is-disabled .el-input__inner {
	color: #666;
	cursor: inherit;
}

/deep/ .el-dialog__header {
	display: flex;
	font-weight: bold;
	padding-left: 40px;
	border-bottom: 1px solid #ddd;
}

/deep/ .el-dialog {
	.el-form-item {
		margin-bottom: 10px;

		.el-form-item__label {
			line-height: 30px;
		}
		.el-form-item__content {
			color: #333;
			line-height: 30px;
		}
	}

	.el-form-item__content {
		color: #333;
	}
}

.mail_status {
	font-size: 18px;
	font-weight: bold;
	padding-left: 5px;

	i {
		display: inline-block;
		padding: 5px;
	}
}

.dos_info {
	padding: 20px 0 10px 20px;
}
</style>