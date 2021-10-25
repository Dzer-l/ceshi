<template>
	<div>
		<!-- ----------------------线上领取公证书/线上业务---------------------------- -->
		<!-- 待邮寄/线上业务 -->
		<!-- <div class="footer_content">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已邮寄</div>
				</div>
				<div class="detail_content">
					<div>去邮寄</div>
				</div>
			</div>
		</div> -->

		<!-- 已邮寄/待揽收 -->
		<!-- <div class="footer_content">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已邮寄</div>
				</div>
				<div class="detail_content">
					<div>取消寄件</div>
				</div>
			</div>
		</div> -->

		<!-- 已邮寄/运送中 -->
		<!-- <div class="footer_content">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已邮寄</div>
				</div>
				<div class="detail_content">
					<div class="div_1">打印订单信息</div>
					<div>复用地址信息</div>
				</div>
			</div>
		</div> -->

		<!-- ----------------------线上领取公证书/线下业务---------------------------- -->
		<!-- 待邮寄/线下业务 -->
		<div class="footer_content" v-if="orderStatus=='302'">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">待邮寄</div>
				</div>
				<div class="detail_content">
					<div class="div_2" @click="handleCancelOrder">取消订单</div>
					<div class="div_1" @click="handlePrint">打印订单信息</div>
					<div @click="handleToMail">去邮寄</div>
				</div>
			</div>
		</div>

		<!-- 已邮寄/待揽收 -->
		<div class="footer_content" v-if="orderStatus=='303'">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已邮寄</div>
				</div>
				<div class="detail_content">
					<div class="div_1" @click="handlePrint">打印订单信息</div>
					<div @click="handleCancelMail">取消寄件</div>
				</div>
			</div>
		</div>

		<!-- 已邮寄/运送中 -->
		<div class="footer_content" v-if="orderStatus=='304'">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已邮寄</div>
				</div>
				<div class="detail_content">
					<div class="div_1" @click="handlePrint">打印订单信息</div>
					<div @click="handleCopyAddress">复用地址信息</div>
				</div>
			</div>
		</div>

		<!-- 已取消 -->
		<div class="footer_content" v-if="orderStatus=='307'">
			<div class="left_content">
				<div>取消原因：{{orderDetail.cancelReason||"当事人线下领取"}}</div>
			</div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已取消</div>
				</div>
				<div class="detail_content"></div>
			</div>
		</div>

		<!-- ----------------------线下领取公证书---------------------------- -->
		<!-- 已预约 -->
		<div v-if="orderStatus == 1" class="footer_content">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">已预约</div>
				</div>
				<div class="detail_content"></div>
			</div>
		</div>

		<!-- 待预约 -->
		<div v-if="orderStatus == 0" class="footer_content">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info">待预约</div>
				</div>
				<div class="detail_content" @click="handleSubscribe">
					<div>预约领证信息</div>
				</div>
			</div>
		</div>

		<!-- 取消订单弹窗 -->
		<el-dialog :visible.sync="cancelOrderDialog" width="450px">
			<h3 slot="title">
				<i class="el-icon-warning" style="color:#faae18"></i>
				您正在取消订单
			</h3>
			<el-form :model="cancelReason" ref="cancelReason" :rules="cancelReasonRules" label-width="100px"
				:inline="false" size="normal">
				<el-form-item label="取消原因：" prop="reason">
					<el-input type="textarea" v-model="cancelReason.reason" placeholder="请输入取消原因" maxlength="80">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="cancelOrderDialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="handleCancelOrderComfirm('cancelReason')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	getOnlineCancelOrder,
	getPackageRecordCancel
} from '../../api/mailManage';
import { printInit, print } from '../../utils/printMail'
export default {
	props: ["orderStatus", "orderDetail", "receiverAddressData"],
	data() {
		return {
			cancelOrderDialog: false,
			printDialog: false,
			cancelReason: {
				reason: ""
			},
			cancelReasonRules: {
				reason: [
					{ required: true, message: '请输入取消原因', trigger: 'blur' },
					{ min: 3, max: 80, message: '长度在 3 到 80 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		// 去预约
		handleSubscribe() {
			this.$emit("subscribe")
		},

		// 取消订单
		handleCancelOrder() {
			this.cancelOrderDialog = true
		},
		handleCancelOrderComfirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.cancelOrderDialog = false
					let res = await getOnlineCancelOrder({
						id: this.orderDetail.id,
						cancelReason: this.cancelReason.reason
					})
					if (res.success) {
						this.$message.success('订单取消成功！')
						this.$emit("cancelOrder")
						return
					}
					this.$message.error("订单取消失败，请稍后再试！")
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		// 去邮寄
		handleToMail() {
			this.$router.push({
				name: "expressDelivery",
				query: {
					ids: [this.orderDetail.id],
					detailId: this.$route.query.id
				}
			})
		},

		// 取消寄件
		handleCancelMail() {
			this.$confirm('<p style="color:red;">取消后，需重新邮寄！</p>',
				'确定取消快递？', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(async () => {
				let res = await getPackageRecordCancel(this.orderDetail.expressInfoId)
				if (!res.success) {
					this.$message({
						type: 'error',
						message: '取消失败，请稍后再试！'
					});
					return
				}
				this.$message({
					type: 'success',
					message: '取消快递成功！'
				});
				this.$emit("cancelOrder")  // 更新订单信息
			});
		},

		// 打印订单信息
		async handlePrint() {
			console.log(this.orderDetail, this.receiverAddressData);
			let res = await printInit(this.orderDetail, this.receiverAddressData)
			console.log("打印订单信息", res)
			if (res) print()
		},

		// 复用地址信息
		handleCopyAddress() {
			console.log(this.receiverAddressData, this.orderDetail);
			this.$router.push({
				name: "callMail",
				params: { receiverAddressData: this.receiverAddressData }
			})
		},
	},
	beforeUpdate() {
		// console.log(this.orderStatus, this.orderDetail, this.receiverAddressData)
	},
	created() {
		console.log(this.$route)
	},
}
</script>

<style lang="less" scoped>
.footer_content {
	display: flex;
	margin: 30px 0 10px 0;
	box-shadow: 0 -3px 5px 1px #ddd;

	.left_content {
		flex: 1;
		div {
			line-height: 70px;
			font-size: 16px;
			padding-left: 20px;
		}
	}

	.right_content {
		display: flex;

		.status {
			height: 70px;
			width: 160px;
			text-align: right;
			margin-right: 20px;
			font-size: 16px;
			color: #666;
			line-height: 30px;

			.status_info {
				font-weight: bold;
				line-height: 40px;
				color: #333;
			}
		}
		.detail_content {
			display: flex;
			cursor: pointer;

			div {
				width: 160px;
				height: 70px;
				line-height: 70px;
				text-align: center;
				font-size: 18px;
				color: #fff;
				background-color: #766ec4;
			}

			.div_1 {
				background-color: #70b603;
			}

			.div_2 {
				background-color: #b8741a;
			}
		}
	}
}
/deep/.el-dialog {
	padding-right: 20px;
}
/deep/.el-dialog__header {
	padding: 0px 20px 0px 20px !important;
	border-bottom: 1px solid #eee !important;
}
</style>