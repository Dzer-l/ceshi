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
					订单编号：{{orderOfflineReceiveDTO.orderNum}}
					<el-button type="text" style="padding: 0 20px" class="copy-order-num"
						:data-clipboard-text="orderNum" @click="copyNum">复制</el-button>
				</h3>

				<div class="basic-order-information-list">
					<ul>
						<li>
							<!-- <span class="info-title">关联订单：</span> -->
							<!-- <span>{{ orderDetail.prodName }}</span> -->
							<!-- <el-link type="primary" :underline="false">{{ orderDetail.orderNum }}</el-link> -->
							<span class="info-title">关联订单：</span>
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
							<span>{{ orderDetail.submitDate }}</span>
						</li>
					</ul>
					<ul>
						<li>
							<span class="info-title">发证类型：</span>
							<span>{{ orderDetail.prodCode | filterProdCode}}</span>
						</li>
						<li>
							<span class="info-title">订单来源：</span>
							<span>{{ orderDetail.orderSource | filterOrderSource}}</span>
						</li>
						<li v-if="orderDetail.prodCode!='xxfz'">
							<span class="info-title">承办人：</span>
							<span>{{ orderDetail.acceptSysUserName}}</span>
						</li>
						<li>
							<span class="info-title">发证人：</span>
							<span>{{ orderDetail.notaryPersonName }}</span>
						</li>
					</ul>
					<ul>
						<li class="mail_status">
							<i class="el-icon-warning"></i>
							<span>订单状态：</span>
							<span>{{ orderOfflineReceiveDTO.receiveStatus | filterReceiveStatus}}</span>
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
				<div class="content">
					<h3 class="title">
						<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
						当事人信息
					</h3>
					<div class="info_content">
						<el-table :data="litigantTableData" style="width: 100%" border>
							<el-table-column width="200" align="center">
								<template slot-scope="{row}">
									<el-tag type="success" style="background:#d8f7ca;color:#4DD90D;">
										{{row.proposerType | filterProposerType}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="realName" label="当事人名称" align="center">
							</el-table-column>
							<el-table-column label="证件类型" align="center">
								<template slot-scope="{row}">
									{{row.cardType | filterCardType}}
								</template>
							</el-table-column>
							<el-table-column prop="cardNum" label="证件号码" align="center">
							</el-table-column>
							<el-table-column prop="mobile" label="手机号码" align="center">
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

				<!-- 邮寄地址 -->
				<!-- <div class="content" v-if="orderDetail.prodCode=='xxfz'">
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
				</div> -->

				<!-- 领证信息 -->
				<div class="content">
					<div class="title_content">
						<h3>
							<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
							领证信息
						</h3>
					</div>
					<div>
						<el-row :gutter="20">
							<el-col :span="6">
								<div class="info_content_text">公证书份数：
									<span class="info_bold">{{orderOfflineReceiveDTO.notaryNum}}份</span>
								</div>
							</el-col>
							<el-col :span="6">
								<div class="info_content_text">领取方式：
									<span class="info_bold">{{orderDetail.obtainCertType | filterObtainCertType}}</span>
								</div>
							</el-col>
						</el-row>
						<div class="info_content">
							<div class="mail_info" style="display:flex;justify-content: space-between;">
								<div>
									领证人信息
								</div>
								<div style="padding-right:10px" v-if="orderDetail.orderStatus == 305">
									<el-button size="medium" type="primary" @click="handleToSubscribe">查看预约信息
									</el-button>
								</div>
							</div>
							<el-row>
								<el-col :span="8">
									<div class="info_content_text text_1">姓名：
										<span class="info_bold">{{orderOfflineReceiveDTO.receiveName}}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="info_content_text text_1">证件类型：
										<span
											class="info_bold">{{orderOfflineReceiveDTO.cardType | filterCardType}}</span>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="info_content_text text_1">证件号码：
										<span class="info_bold">{{orderOfflineReceiveDTO.cardNum}}</span>
									</div>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="8">
									<div class="info_content_text text_1">手机号码：{{orderOfflineReceiveDTO.mobile}}
									</div>
								</el-col>
							</el-row>
						</div>
					</div>
				</div>
			</div>

			<!-- 底部状态栏 -->
			<footer-status :orderStatus="orderOfflineReceiveDTO.receiveStatus" :orderDetail="orderDetail"
				:receiverAddressData="receiverAddressData" @cancelOrder="cancelOrder" @subscribe="handleSubscribe">
			</footer-status>
		</div>

		<!-- 当事人信息弹窗 -->
		<el-dialog title="当事人信息" :visible.sync="showLitigantDialog" width="500px" center>
			<div style="padding-left:20px">
				<el-form label-position="left" label-width="120px">
					<el-form-item label="姓名">{{showDetailRow.realName}}</el-form-item>
					<el-form-item label="证件类型">{{showDetailRow.cardType | filterCardType}}</el-form-item>
					<el-form-item label="证件号码">{{showDetailRow.cardNum}}</el-form-item>
					<el-form-item label="性别">{{showDetailRow.gender | filterGender}}</el-form-item>
					<el-form-item label="出生日期">{{showDetailRow.birthday}}</el-form-item>
					<el-form-item label="手机号码">{{showDetailRow.mobile}}</el-form-item>
					<el-form-item label="地址">{{showDetailRow.detailAddress}}</el-form-item>
				</el-form>
			</div>
			<!-- <span slot="footer">
				<el-button style="width:150px" type="primary" size="medium" @click="showLitigantDialog=false">确定
				</el-button>
			</span> -->
		</el-dialog>

		<!-- 查看预约信息弹窗 -->
		<el-dialog title="领证信息" :visible.sync="showSubscribeDetailDialog" width="800px">
			<div style="padding-left:0 20px">
				<el-form style="padding:0 50px" label-position="left" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="订单编号：">{{orderOfflineReceiveDTO.orderNum}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="卷宗号：">{{orderOfflineReceiveDTO.dossierNum}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="领取人：">{{orderOfflineReceiveDTO.receiveName}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="证件类型：">{{orderOfflineReceiveDTO.cardType | filterCardType}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="证件号码：">{{orderOfflineReceiveDTO.cardNum}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机号码：">{{orderOfflineReceiveDTO.mobile}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="公证书份数：">{{orderOfflineReceiveDTO.notaryNum}}</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="领取时间：">{{orderOfflineReceiveDTO.receiveTime}}</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="领取地点：">
								<p style="margin:0;line-height:20px;margin-top:10px;">
									{{orderOfflineReceiveDTO.receiveAddress}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="领证号：">{{orderOfflineReceiveDTO.receiveNumber}}</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</el-dialog>

		<!-- 预约信息弹窗 -->
		<el-dialog title="领证信息" :visible.sync="showSubscribeDialog" width="800px">
			<div style="padding-left:0 20px">
				<el-form style="padding:0 50px" label-position="left" :model="getLicenseForm"
					:rules="getLicenseFormRules" ref="getLicenseForm" label-width="100px">
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="订单编号：">{{getLicenseForm.orderNum}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="卷宗号：">{{getLicenseForm.dossierNum}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="领取人：">{{getLicenseForm.receiveName}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="证件号码：">{{getLicenseForm.cardNum}}
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="手机号码：">{{getLicenseForm.mobile}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item style="margin-bottom:10px;" label="公证书份数：">{{getLicenseForm.notaryNum}} 份
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="领取地点：" prop="receiveAddress">
						<el-select style="width:100%" placeholder="请选择领证地点" v-model="getLicenseForm.receivePointName">
							<el-option v-for="item in orgOfficeId" :key="item.officeName" :label="item.officeName"
								:value="item.officeName">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="领取时间：" prop="receiveTime">
						<el-date-picker style="width:100%" type="datetime" placeholder="请选择领证时间"
							v-model="getLicenseForm.receiveTime" value-format="yyyy-MM-dd HH:mm:ss" />
					</el-form-item>
					<el-form-item label="领证号：" prop="receiveNumber">
						<el-input placeholder="请填写领证号" size="normal" v-model="getLicenseForm.receiveNumber">
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" style="padding-right:40px">
				<el-button type="primary" @click="handleConfirmReserve('getLicenseForm')">确定预约</el-button>
			</span>
		</el-dialog>
	</div>

</template>

<script>
import Clipboard from 'clipboard';
import footerStatus from '../../components/mailManage/footerStatus';
import {
	getOrderOfflineReceiveDetail,
	getOrgOfficeList,
	appointmentTime,
	getOrderByOrderNumOrderNum,
} from '../../api/mailManage';
import { filterCardType } from '../../filters/index';
import { getLicenseFormRules } from '../../utils/validate';
import { filterProposerType } from '../../utils/filters';
export default {
	components: {
		footerStatus
	},
	filters: {
		filterGender(v) {
			return v == 1 ? "男" : "女"
		},
		filterProdCode(val) {
			return val == "xxfz" ? "线下发证" : "平台业务发证"
		},
		filterCrtificateType(e) {
			return e == 0 ? "平台业务发证" : "窗口业务发证"
		},
		filterOrderStatus(e) {
			const status = {
				302: "待邮寄",
				303: "已邮寄",
				304: "已邮寄",
				305: "已预约",
				307: "已取消",
			}
			return status[e]
		},
		filterOrderSource(v) {
			return v == 1 ? "PC" : "小程序"
		},
		filterCardType,
		filterObtainCertType(val) {
			const status = {
				1: "邮寄",
				2: "线下领取"
			}
			return status[val]
		},
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
		filterReceiveStatus(val) {
			const status = {
				0: "待预约",
				1: "已预约",
			}
			return status[val]
		},
		filterReceiveStatus(val) {
			const status = {
				0: "已预约",
				1: "已预约",
			}
			return status[val]
		}
	},
	data() {
		return {
			orderNum: "",
			orderDetail: {},// 详情
			jurisdiction: false,
			showLitigantDialog: false,
			showSubscribeDetailDialog: false,
			litigantTableData: [], // 当事人信息

			receiverAddressData: {},// 邮寄地址

			orderOfflineReceiveDTO: {},
			showDetailRow: "",
			getLicenseForm: {}, // 领证人信息    
			showSubscribeDialog: false, // 去预约弹窗
			getLicenseFormRules,
			orgOfficeId: [],
			orderDTO: {},
		}
	},
	created() {
		this.orderNum = this.$route.query.orderNum
		this.getOrderDetail()
		this.getOfficeList()
	},
	methods: {
		// 跳转订单详情页
		async goOrderDetil() {
			let res = await getOrderByOrderNumOrderNum(this.orderDetail.orderNum)
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

		// 去预约
		handleSubscribe() {
			console.log("--------");
			this.getLicenseForm = JSON.parse(JSON.stringify(this.orderOfflineReceiveDTO))
			this.showSubscribeDialog = true
		},

		// 确定预约
		handleConfirmReserve() {
			this.$confirm('<p style="color:red;">确定预约后，将会把预约信息短息发送给领证人，确定继续？</p>',
				'操作提示', {
				dangerouslyUseHTMLString: true,
				type: 'warning',
				customClass: "confirm_reserve"
			}).then(async () => {
				let res = await appointmentTime(this.getLicenseForm)
				console.log("预约-----", res);
				if (res.success) {
					this.$message.success("预约成功")
					this.getOrderDetail()
					this.showSubscribeDialog = false
					return
				}

				this.$message.error(res.msg || "预约失败，请稍后再试")
			}).catch(() => {
				// this.$message({
				// 	type: 'info',
				// 	message: '已取消操作！'
				// });
			})
		},

		// 获取办证点
		async getOfficeList() {
			let res = await getOrgOfficeList()
			console.log('办证点', res)
			this.orgOfficeId.push(...res.data)
		},

		// 获取详情
		async getOrderDetail() {
			let data = { orderNum: this.$route.query.orderNum }
			let res = await getOrderOfflineReceiveDetail(data)
			console.log('详情--->', res);
			if (res.success && res.data) {
				this.orderDetail = res.data.orderDTO
				this.litigantTableData = res.data.orderProposerReDTOS
				this.orderOfflineReceiveDTO = res.data.orderOfflineReceiveDTO
				return
			}
			this.$message.error(res.msg || "服务器开小差了，请稍后再试")
		},

		// 查看当事人详情
		handleToDetail(index, row) {
			console.log(row);
			this.showDetailRow = row
			this.showLitigantDialog = true
		},

		// 查看预约
		handleToSubscribe() {
			this.showSubscribeDetailDialog = true
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
	watch: {
		"getLicenseForm.receivePointName"(val) {
			if (val) {
				let temp = this.orgOfficeId.find(i => {
					return i.officeName === val
				})
				this.getLicenseForm.receiveAddress = temp.orgAddress
			}
		},
		showSubscribeDialog(val) {
			if (!val) {
				this.getLicenseForm = {}
			}
		}
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

/deep/ .el-form-item__label {
	color: #333;
}

/deep/ .el-dialog {
	.el-form-item {
		margin-bottom: 10px;

		.el-form-item__label {
			color: #333;
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
<style>
.confirm_reserve {
	width: 500px;
}
</style>