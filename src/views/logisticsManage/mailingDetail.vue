<template>
	<div id="div" ref="div" class="main-box">
		<div id="content">
			<div class="header_content">
				<div class="header_title">
					<span v-if="expressInfo.status == 1">快递详情（待邮寄）</span>
					<span v-if="expressInfo.status == 2">快递详情（待揽收）</span>
					<span v-if="expressInfo.status == 3">快递详情（运送中）</span>
					<span v-if="expressInfo.status == 4">快递详情（已签收）</span>
					<span v-if="expressInfo.status == 5">快递详情（已取消）</span>
				</div>
				<div>
					<el-button style="width:80px;" size="small" type="primary" @click="goBack">返 回</el-button>
				</div>
			</div>

			<!-- 订单信息 -->
			<div class="item-box">
				<div class="search-nav">
					<div style="font-weight: bold;">
						<p style="font-size: 16px">订单信息</p>
					</div>
					<div>
						<el-button type="primary" v-if="expressInfo.status==2" size="small" @click="cancelExpress">取消寄件
						</el-button>
					</div>
				</div>
				<div class="express-info">
					<el-form :model="expressInfo" label-width="100px">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="关联订单：">
									<el-tooltip v-if="expressInfo.expressManagementId" popper-class="atooltip"
										placement="bottom">
										<div slot="content" class="tooltipContent">
											<span style="font-size: 13px;"><i class="el-icon-info"
													style="color: #409EFF;" /></span>
											点击该订单编号跳转到对应订单的“订单详情”页
										</div>
										<el-link type="primary" @click="goOrderDetil()">
											<!-- xxfz线下发证  wyjj我要寄件 -->
											{{ expressInfo.prodCode == 'xxfz' || expressInfo.prodCode == 'wyjj' ? expressInfo.expressTempNo : expressInfo.orderNum}}
										</el-link>
									</el-tooltip>
									<div v-else>
										{{ expressInfo.prodCode == 'xxfz' || expressInfo.prodCode == 'wyjj' ? expressInfo.expressTempNo : expressInfo.orderNum}}
									</div>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="业务类型：">{{expressInfo.prodName}}</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="寄件时间：">{{expressInfo.createTime}}</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="签收时间：">{{expressInfo.receiveTime}}</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="操作人：">{{expressInfo.operatingUserName}}</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>

			<!-- 快递信息 -->
			<div class="item-box">
				<div class="search-nav">
					<div style="font-weight: bold;">
						<p style="font-size: 16px">快递信息</p>
					</div>
					<div v-if="expressInfo.status != 5">
						<el-button type="primary" size="small" @click="handleRefreshExpress">刷新快递信息</el-button>
						<el-button type="primary" size="small" @click="handlePrint">打印面单</el-button>
					</div>
				</div>

				<div class="express_info">
					<div class="express_nav">
						<div class="express_content">
							<div class="left_con">
								<el-button style="background-color: #12a3fe;color: white;" circle>寄</el-button>
							</div>
							<div class="right_con">
								<div>{{ expressInfo.senderName }}</div>
								<div class="contact_con">
									<span>{{ expressInfo.senderMobile }}</span>
									<span class="fixline">{{ expressInfo.senderFixedLine }}</span>
								</div>
								<div>{{expressInfo.senderAddress}}</div>
								<div class="daddress">
									{{expressInfo.senderDetailAddress}}
								</div>
							</div>
						</div>

						<div class="line_content">
							<div class="vertical_line"></div>
						</div>

						<div class="express_content">
							<div class="left_con">
								<el-button style="background-color: #2879fe;color: white;" circle>收</el-button>
							</div>
							<div class="right_con">
								<div>{{ expressInfo.receiveName }}</div>
								<div class="contact_con">
									<span>{{ expressInfo.receiveMobile }}</span>
									<span class="fixline">{{ expressInfo.receiveFixedLine }}</span>
								</div>
								<div>{{expressInfo.receiveAddress}}</div>
								<div class="daddress">
									{{expressInfo.receiveDetailAddress}}
								</div>
							</div>
						</div>
					</div>
					<div style="margin-top: 40px">
						<el-form :model="expressInfo" label-width="110px" style="padding-right:150px">
							<el-row :gutter="20">
								<el-col :span="8" style="min-width:300px">
									<el-form-item class="form_item" label="运单号：">
										<div>
											{{expressInfo.expressNo}}
											<i class="copy-order-num el-icon-copy-document"
												:data-clipboard-text="expressInfo.expressNo" @click="copyNum"></i>
										</div>
									</el-form-item>
								</el-col>
								<el-col :span="8" style="min-width:300px">
									<el-form-item class="form_item" label="快递公司：">
										{{expressInfo.expressCompany | filterExpressCompany}}
									</el-form-item>
								</el-col>
								<el-col :span="8" style="min-width:300px">
									<el-form-item v-if="expressInfo.expressCompany=='ems'" class="form_item"
										label="取件方式：">
										{{expressInfo.expressMethod | filterExpressMethod}}
									</el-form-item>
									<el-form-item v-else class="form_item" label="取件方式：">
										上门取件
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="8" style="min-width:300px">
									<el-form-item class="form_item" label="预约上门时间：">
										{{expressInfo.sendStartTime | filterSendStartTime}}
									</el-form-item>
								</el-col>
								<el-col :span="8" style="min-width:300px">
									<el-form-item v-if="expressInfo.expressCompany=='shunfeng'" class="form_item"
										label="运费支付方式：">
										{{expressInfo.payMethod | filterPayMethodSF}}
									</el-form-item>
									<el-form-item v-else class="form_item" label="运费支付方式：">
										{{expressInfo.payMethod | filterPayMethod}}
									</el-form-item>
								</el-col>
								<el-col :span="8" style="min-width:300px">
									<el-form-item class="form_item" label="物品类型：">
										{{expressInfo.packageCategory | filterPackageCategory}}
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="24">
									<el-form-item class="form_item" label="物品信息：">{{expressInfo.remark}}
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>

						<!-- <p>
							<span style="margin-left: 25px">运单号：{{ orderExpressSend.expressNo }}</span>
							<span style="margin-left: 15%">寄件方式：{{ orderExpressSend.expressMethod==1?'上门取件':'' }}</span>
							<span
								style="margin-left: 18%">运费支付方式：{{ orderExpressSend.payMethod==1?'寄付月结':orderExpressSend.payMethod==2?'收方付':orderExpressSend.payMethod==3?'第三方付':'' }}</span>
						</p>
						<p>
							<span style="margin-left: 25px">快递公司：{{ orderExpressSend.expressCompany }}</span>
							<span v-if="expressType == 1"
								style="margin-left: 15%">预约上门时间：{{ orderExpressSend.sendStartTime }}</span>
							<span v-if="expressType == 2"
								style="margin-left: 15%">邮政下单时间：{{ orderExpressSend.emsCreateTime }}</span>
						</p>
						<p>
							<span style="margin-left: 25px">文件描述：{{ orderExpressSend.remark }}</span>
						</p> -->
					</div>

					<!-- 物流信息 -->
					<div style="margin-top: 50px" class="emsInfo">
						<div class="block">
							<el-timeline>
								<el-timeline-item v-for="(activity, index) in expressWayRouteDTOList" :key="index"
									:icon="activity.icon" :type="activity.type" :color="index==0?'#0bbd87':''"
									:size="activity.size" :timestamp="activity.callbackTime || activity.createTime">
									{{ activity.wayRouteInfo }}
								</el-timeline-item>
							</el-timeline>
						</div>
					</div>
					<div v-show="false" id="print" ref="print" style="font-family:黑体;margin: 20px;" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Clipboard from 'clipboard';
import { printInit, print } from '../../utils/printExpressList';
import { filterExpressMethod, filterPayMethod, filterPackageCategory, filterExpressCompany, filterPayMethodSF } from '../../utils/filters'
import {
	packageRecordDetail,
	packagePrint,
	refreshExpress
} from '../../api/logisticsManage';
import { getPackageRecordCancel } from '../../api/mailManage';
const moment = require("moment")
export default {
	filters: {
		filterPayMethodSF,
		filterExpressMethod,
		filterPayMethod,
		filterPackageCategory,
		filterExpressCompany,
		filterSendStartTime(val) {
			if (val) {
				return `${moment(val).format("YYYY-MM-DD HH:mm")} ~ ${moment(val).add(1, "hour").format("HH:mm")}`
			}
			return "定时揽收"
		}
	},
	data() {
		return {
			expressInfo: {}, // 订单信息

			expressWayRouteDTOList: [], // 物流信息
			orderNum: '',
			orderExpressSend: {},
			expressType: 1,
			orderDTO: {},
			defaultExpressWayRouteDTOList: []
		}
	},

	created() {
		// console.log(this.$route.query)
		this.getDetail()
	},

	methods: {
		// 获取快递信息
		async getExpressInfo() {
			let data = {
				orgId: sessionStorage.org_id,
				expressNo: this.expressInfo.expressNo,
				expressType: this.expressInfo.expressCompany == "shunfeng" ? 1 : 2
			}
			let res = await refreshExpress(data)
			console.log(res);
			// this.getDetail(false)
			if (res.success && res.data && res.data.length > 0) {
				// return this.expressWayRouteDTOList = [...res.data, ...this.defaultExpressWayRouteDTOList]
				return this.expressWayRouteDTOList = res.data
			}
			// this.expressWayRouteDTOList = [...this.defaultExpressWayRouteDTOList]
		},

		// 获取快递详情
		async getDetail(flag = true) {
			let res = await packageRecordDetail(this.$route.query.id)
			console.log('快递详情--->', res);
			if (res.success && res.data) {
				this.expressInfo = res.data
				// this.defaultExpressWayRouteDTOList = res.data.expressWayRouteDTOList
				this.expressWayRouteDTOList = flag ? res.data.expressWayRouteDTOList : this.expressWayRouteDTOList
				this.getExpressInfo()
			}
		},

		// 刷新快递信息
		handleRefreshExpress() {
			this.getExpressInfo()
		},

		// 打印面单
		async handlePrint() {
			let res = await packagePrint(this.expressInfo.id)
			console.log("打印面单", res);

			if (res.success && res.data) {
				let flag = await printInit(res)
				flag && print()
				return
			}

			this.$message({
				message: "打印失败，请稍后再试！",
				type: "error"
			})
		},

		// 跳转订单详情页
		goOrderDetil() {
			if (this.expressInfo.expressManagementId) {
				this.$router.push({
					name: 'mailOrderDetail',
					query: { id: this.expressInfo.expressManagementId }
				})
				return
			}

			this.$alert(`<p style='color:red;'>当前订单没有关联订单！</p>`, '提示', {
				confirmButtonText: '确定',
				dangerouslyUseHTMLString: true
			})
		},

		// 取消寄件
		cancelExpress() {
			this.$confirm('<p style="color:red;">取消后，请重新邮寄！</p>',
				'确定取消快递？', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(async () => {
				let res = await getPackageRecordCancel(this.expressInfo.id)
				console.log('取消快递--->', res);
				if (!res.success) {
					this.$message({
						type: 'error;',
						message: res.msg || '取消失败，请稍后再试！'
					});
					return
				}
				this.$message({
					type: 'success',
					message: '取消快递成功！'
				});
				this.getDetail()
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作！'
				});
			});
		},

		goBack() {
			window.history.go(-1)
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
	}
}
</script>

<style lang='less' scoped>
.el-icon-copy-document {
	padding-left: 20px;
	cursor: pointer;
	color: #2879fe;
}
/deep/.el-form-item__label,
/deep/.el-form-item__content {
	color: #333;
}
.form_item {
	margin-bottom: 0;
}
.header_content {
	display: flex;
	justify-content: space-between;
	line-height: 40px;
	padding-right: 20px;

	.header_title {
		font-weight: bold;
	}
}
.atooltip.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
	border-bottom-color: rgb(189, 252, 255);
}

.atooltip.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
	border-bottom-color: rgb(189, 252, 255);
}

.atooltip {
	background: rgba(211, 255, 255, 0.6) !important;
	border: 1px solid #303133;
	border-top-color: rgb(0, 255, 255);
	border-top-style: solid;
	border-top-width: 1px;
	border-right-color: rgb(0, 255, 255);
	border-right-style: solid;
	border-right-width: 1px;
	border-bottom-color: rgb(0, 255, 255);
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-left-color: rgb(0, 255, 255);
	border-left-style: solid;
	border-left-width: 1px;
	border-image-source: initial;
	border-image-slice: initial;
	border-image-width: initial;
	border-image-outset: initial;
	border-image-repeat: initial;
}

.tooltipContent {
	color: #ffffff;
}

.search-nav {
	display: flex;
	align-items: center;
	white-space: nowrap;
	justify-content: space-between;
	padding-left: 20px;
	padding-right: 20px;
	background-color: #eee;
	border: 1px solid #ddd;
	border-bottom: none;
}

.express_info {
	padding: 20px 30px 0;
	box-sizing: border-box;
	padding: 20px;
	border: 1px solid #d7d7d7;

	.express_nav {
		font-size: 15px;
		color: #333;
		display: flex;
		// justify-content: center;
		padding-left: 100px;
		padding-right: 150px;

		.express_content {
			display: flex;
			align-items: center;
			min-height: 150px;

			.left_con {
				display: flex;
				align-items: center;
				padding: 0 20px 0 10px;
				height: 100%;
			}

			.right_con {
				line-height: 25px;
				max-width: 550px;
				.contact_con {
					margin: 5px 0;
				}
				.fixline {
					margin-left: 20px;
				}
				.daddress {
					word-wrap: break-word;
					word-break: break-all;
				}
			}
		}
		.line_content {
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 120px;
			.vertical_line {
				width: 1px;
				height: 120px;
				background: #8b8b8b;
			}
		}
	}
}

.main-box {
	box-sizing: border-box;
	background: #f5f5f5;
	padding: 20px;
	min-height: calc(100vh - 50px);
	min-width: 1080px;
}

.item-box {
	border-radius: 5px;
	box-sizing: border-box;
	margin-top: 30px;
}

.parent {
	display: flex;
	align-items: center;
}

#content {
	background: white;
	padding: 50px;
}

.emsInfo {
	background: #f5f5f5;
	padding: 30px;
}
.express-info {
	margin-top: 10px;
}
/deep/ .el-form-item {
	margin-bottom: 0;
}
/deep/.el-form-item__content,
/deep/.el-form-item__label {
	line-height: 28px;
}
</style>
