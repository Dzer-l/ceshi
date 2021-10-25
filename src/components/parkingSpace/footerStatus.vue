<template>
	<div>
		<!-- 审核中 -->
		<div class="footer_content" v-if="registerStatus==0">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info color_2">审核中</div>
				</div>
				<div class="detail_content">
					<div class="div_3" @click="handleRefuse">拒绝登记</div>
					<div class="div_4" @click="handlePass">审核通过</div>
				</div>
			</div>
		</div>

		<!-- 登记成功 -->
		<div class="footer_content" v-if="registerStatus==1">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info color_1">登记成功</div>
				</div>
				<div class="detail_content"></div>
			</div>
		</div>

		<!-- 已拒绝 -->
		<div class="footer_content" v-if="registerStatus==2">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info color_3">已拒绝</div>
				</div>
				<div class="detail_content"></div>
			</div>
		</div>

		<!-- 已撤销 -->
		<div class="footer_content" v-if="registerStatus==3">
			<div class="left_content"></div>
			<div class="right_content">
				<div class="status">
					<div>状态</div>
					<div class="status_info color_3">已撤销</div>
				</div>
				<div class="detail_content"></div>
			</div>
		</div>

		<!-- 拒绝原因弹窗 -->
		<el-dialog :visible.sync="cancelOrderDialog" width="450px" :close-on-click-modal="false">
			<h3 slot="title">
				<i class="el-icon-warning" style="color:#faae18"></i>
				拒绝受理
			</h3>
			<el-form :model="cancelReason" ref="cancelReason" :rules="cancelReasonRules" label-width="100px"
				:inline="false" size="normal">
				<el-form-item label="拒绝原因：" prop="reason">
					<el-input type="textarea" v-model="cancelReason.reason" placeholder="请输入拒绝原因" maxlength="120">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="cancelOrderDialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="handleRefuseOrderComfirm('cancelReason')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	updateDefenseParkingRegisterStatus,
} from '../../api/parkingSpace';
export default {
	props: ["registerStatus", "orderDetail", "registerId"],
	data() {
		return {
			cancelOrderDialog: false,
			printDialog: false,
			cancelReason: {		// 拒绝登记原因
				reason: ""
			},
			cancelReasonRules: {
				reason: [
					{ required: true, message: '请输入拒绝原因', trigger: 'blur' },
					{ min: 5, max: 120, message: '长度在 5 到 120 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		// 更新登记车位状态
		async updateSataus(registerStatus) {
			let data = {
				id: this.registerId,
				registerStatus: registerStatus,  // "0审核中，1登记成功，2已拒绝，3已撤销"
				revokeReason: this.cancelReason.reason
			}

			let res = await updateDefenseParkingRegisterStatus(data)
			console.log("更新登记车位状态", res);
			return res
		},
		// 审核通过
		handlePass() {
			this.$confirm('<p>审核通过后，车位将登记成功，且不可撤销，确定继续吗？</p>',
				'操作提示', {
				dangerouslyUseHTMLString: true,
				type: 'warning',
				customClass: "confirmClass"
			}).then(async () => {
				let res = await this.updateSataus(1)
				if (res.success) {
					this.$message({
						type: 'success',
						message: '车位登记成功'
					})
					this.$emit("updateStatus")
					return
				}
				this.$message({
					type: 'error;',
					message: '取消失败，请稍后再试！'
				});
			}).catch((err) => {
				console.log(err);
			});
		},

		// 拒绝登记
		handleRefuse() {
			this.cancelOrderDialog = true
		},
		handleRefuseOrderComfirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					let res = await this.updateSataus(2)
					if (res.success) {
						this.cancelOrderDialog = false
						this.$message.success('拒绝登记成功')
						this.$emit("updateStatus")
						return
					}
					this.$message.error("服务器开小差了，请稍后再试！")
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
	watch: {
		cancelOrderDialog(val) {
			if (!val) {
				this.$refs.cancelReason.clearValidate()
				this.cancelReason.reason = ""
			}
		}
	},
}
</script>

<style lang="less" scoped>
.footer_content {
	display: flex;
	margin: 30px 0 0 0;
	box-shadow: 0 -3px 5px 1px #ddd;
	background: #fff;
	border-radius: 3px;
	overflow: hidden;

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
				background-color: rgb(103, 194, 57);
			}

			.div_2 {
				background-color: #e6a23c;
			}

			.div_3 {
				background-color: #d9001b;
			}

			.div_4 {
				background-color: #409eff;
			}
		}
	}
}
.color_1 {
	color: rgb(103, 194, 57) !important;
}

.color_2 {
	color: #e6a23c !important;
}

.color_3 {
	color: #d9001b !important;
}

.color_4 {
	color: #409eff !important;
}

/deep/.el-dialog {
	padding-right: 20px;
}
/deep/.el-dialog__header {
	padding: 0px 20px 0px 20px !important;
	border-bottom: 1px solid #eee !important;
}
</style>

<style>
.confirmClass {
	width: 500px;
}
</style>