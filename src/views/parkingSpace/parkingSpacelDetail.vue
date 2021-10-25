<template>
	<div class="entry-dateail-mian">
		<div class="entry-dateail">
			<div class="go-back-btn">
				<el-button class="button" type="primary" size="small" @click="goBack">返回
				</el-button>
			</div>

			<!-- 登记编号 -->
			<div class="basic-order-information">
				<h3 class="mail_status">
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					登记编号：{{ orderDetail.registerNum }}
					<el-button type="text" style="padding: 0 20px" class="copy-order-num"
						:data-clipboard-text="orderDetail.registerNum" @click="copyNum">复制</el-button>
				</h3>

				<div class="basic-order-information-list">
					<ul>
						<li>
							<span class="info-title">业务类型：</span>
							<span>{{ orderDetail.businessType }}</span>
						</li>
						<li>
							<span class="info-title">公证处：</span>
							<span>{{ orderDetail.orgName }}</span>
						</li>
						<li>
							<span class="info-title">办证点：</span>
							<span>{{ orderDetail.orgOfficeName}}</span>
						</li>
						<li>
							<span class="info-title">承办人：</span>
							<span>{{ orderDetail.orgUserName}}</span>
						</li>
						<li>
							<span class="info-title">提交时间：</span>
							<span>{{ orderDetail.createTime }}</span>
						</li>
					</ul>
					<ul style="margin-right:auto;">
						<!-- 0: "审核中",
							1: "登记成功",
							2: "已拒绝",
							3: "已撤销", -->
						<li v-if="orderDetail.registerStatus == 0 || orderDetail.registerStatus == 1">
							<span class="info-title">审核通过时间：</span>
							<span>{{ orderDetail.registerTime}}</span>
						</li>
						<li v-if="orderDetail.registerStatus == 0 || orderDetail.registerStatus == 1">
							<span class="info-title">通过时间：</span>
							<span>{{ orderDetail.registerTime}}</span>
						</li>
						<li v-if="orderDetail.registerStatus == 2">
							<span class="info-title">拒绝时间：</span>
							<span>{{ orderDetail.revokeTime}}</span>
						</li>
						<li v-if="orderDetail.registerStatus == 3">
							<span class="info-title">撤销时间：</span>
							<span>{{ orderDetail.revokeTime}}</span>
						</li>
					</ul>
					<ul style="margin-right:200px;">
						<li class="mail_status">
							<i class="el-icon-warning"></i>
							<span>登记状态：</span>
							<span class="status_text">{{ orderDetail.registerStatus | filterRegisterStatus}}</span>
						</li>
					</ul>
				</div>
			</div>

			<!-- 登记账号 -->
			<div class="basic-order-information" style="margin-top:15px">
				<h3 class="mail_status">
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					登记账号
					<!-- <el-button type="text" style="padding: 0 20px" class="copy-order-num"
						:data-clipboard-text="orderDetail.expressNum" @click="copyNum">复制</el-button> -->
				</h3>

				<div class="table_content">
					<el-table :data="registerTableData" style="width: 100%" :header-row-style="{color:'#555'}" border
						header-row-class-name="table_header">
						<el-table-column prop="userAccount" label="用户名" align="center">
						</el-table-column>
						<el-table-column prop="userName" label="姓名" align="center">
						</el-table-column>
						<el-table-column label="证件类型" align="center">
							<template slot-scope="{row}">
								<div>{{row.cardTypeDesc}}</div>
							</template>
						</el-table-column>
						<el-table-column prop="cardNum" label="证件号码" align="center">
						</el-table-column>
						<el-table-column prop="mobile" label="联系方式" align="center">
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-link type="primary" style="display:inline-block;margin:0 10px;"
									@click="handleToDetail(scope.row)">查看</el-link>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<!-- tabs区域 -->
			<div class="detail_container">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="车位信息" name="first">
						<parkingSpaceInformation :registerId="registerId" :orderDetail="orderDetail"
							:registerTableData="registerTableData" :materialList="materialList" />
					</el-tab-pane>
					<!-- <el-tab-pane label="车位信息" name="secend">
						<parkingSpaceInformation />
					</el-tab-pane> -->
				</el-tabs>
			</div>

			<!-- 底部状态栏 -->
			<footer-status :registerStatus="orderDetail.registerStatus" :orderDetail="orderDetail"
				:registerId="registerId" @updateStatus="updateStatus">
			</footer-status>
		</div>

		<!-- 用户账号信息--个人账号 -->
		<el-dialog title="用户账号信息" :visible.sync="showLitigantDialog" width="780px" custom-class="account_info">
			<div>
				<el-row>
					<el-col :span="12">
						<span class="label_text">用户名：</span>
						<span>{{ accountInfo.userAccount }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">用户类型：</span>
						<span>{{ accountInfo.userType | filterUserType}}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">注册时间：</span>
						<span>{{ accountInfo.registerTime }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">注册公证处：</span>
						<span class="label_block">{{ accountInfo.orgName }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">实名状态：</span>
						<span>{{ accountInfo.isRealName | filterIsRealName }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">姓名：</span>
						<span>{{ accountInfo.userName }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">证件类型：</span>
						<span>{{ accountInfo.cardTypeDesc }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">证件号码：</span>
						<span>{{ accountInfo.cardNum }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">性别：</span>
						<span>{{ accountInfo.gender | filterGender }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">手机号码：</span>
						<span>{{ accountInfo.mobile }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">出生日期：</span>
						<span>{{ accountInfo.birth }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">所在地区：</span>
						<span class="label_block">{{ accountInfo.address }}</span>
					</el-col>
				</el-row>
			</div>
		</el-dialog>

		<!-- 用户账号信息--企业账号 -->
		<el-dialog title="用户账号信息" :visible.sync="showSubscribeDialog" width="780px" custom-class="account_info">
			<div>
				<el-row>
					<el-col :span="12">
						<span class="label_text">用户名：</span>
						<span>{{ accountInfo.userAccount }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">用户类型：</span>
						<span>{{ accountInfo.userType | filterUserType }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">注册时间：</span>
						<span>{{ accountInfo.registerTime }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">注册公证处：</span>
						<span>{{ accountInfo.orgName }}</span>
					</el-col>
				</el-row>
				<!-- 企业主账号 -->
				<template v-if="accountInfo.businessUserType==0">
					<el-row>
						<el-col :span="12">
							<span class="label_text">账号类型：</span>
							<span>{{ accountInfo.businessUserType | filterBusinessUserType }}</span>
						</el-col>
						<el-col :span="12">
							<span class="label_text">实名状态：</span>
							<span>{{ accountInfo.isRealName | filterIsRealName }}</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<span class="label_text">企业名称：</span>
							<span class="label_block">{{ accountInfo.organizationName }}</span>
						</el-col>
						<el-col :span="12">
							<span class="label_text">证件类型：</span>
							<span>{{ accountInfo.organizationCardType }}</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<span class="label_text">统一社会信用代码：</span>
							<span>{{ accountInfo.organizationCardNum }}</span>
						</el-col>
						<el-col :span="12">
							<span class="label_text">所在地区：</span>
							<span class="label_block">{{ accountInfo.organizationAddress }}</span>
						</el-col>
					</el-row>
				</template>

				<!-- 企业子账号 -->
				<template v-if="accountInfo.businessUserType==1">
					<el-row>
						<el-col :span="12">
							<span class="label_text">账号类型：</span>
							<span>{{ accountInfo.businessUserType | filterBusinessUserType  }}</span>
						</el-col>
						<el-col :span="12">
							<span class="label_text">主账号：</span>
							<span>{{ accountInfo.parentAccount || "-"}}</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<span class="label_text">实名状态：</span>
							<span>{{ accountInfo.isRealName | filterIsRealName  }}</span>
						</el-col>
						<el-col :span="12">
							<span class="label_text">企业名称：</span>
							<span class="label_block">{{ accountInfo.organizationName }}</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<span class="label_text">证件类型：</span>
							<span>{{ accountInfo.organizationCardType }}</span>
						</el-col>
						<el-col :span="12">
							<span class="label_text">统一社会信用代码：</span>
							<span>{{ accountInfo.organizationCardNum }}</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<span class="label_text">所在地区：</span>
							<span class="label_block">{{ accountInfo.organizationAddress }}</span>
						</el-col>
					</el-row>
				</template>
			</div>
			<div style="border-top:1px solid #eee;margin-top:10px;">
				<div style="font-size:16px;line-height:40px;padding-left:20px;font-weight:600;color: #333;">企业联系人</div>
				<el-row>
					<el-col :span="12">
						<span class="label_text">联系人身份：</span>
						<span>{{ accountInfo.companyRelation }}</span>
					</el-col>
					<!-- <el-col :span="12">
						<span class="label_text">用户类型：</span>
					</el-col> -->
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">姓名：</span>
						<span>{{ accountInfo.userName }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">证件类型：</span>
						<span>{{ accountInfo.cardTypeDesc }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">证件号码：</span>
						<span>{{ accountInfo.cardNum }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">性别：</span>
						<span>{{ accountInfo.gender | filterGender }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<span class="label_text">出生日期：</span>
						<span>{{ accountInfo.birth }}</span>
					</el-col>
					<el-col :span="12">
						<span class="label_text">手机号码：</span>
						<span>{{ accountInfo.mobile }}</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="label_text">所在地区：</span>
						<span class="label_block">{{ accountInfo.address }}</span>
					</el-col>
				</el-row>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	defenseParkingRegisterDetail,
	parkingRegisterAccountInfo,
} from '../../api/parkingSpace';
import Clipboard from 'clipboard';
import footerStatus from '../../components/parkingSpace/footerStatus';
import parkingSpaceInformation from '../../components/parkingSpace/parkingSpaceInformation';
// import { filterCardType } from '../../filters/index';
import {
	filterRegisterStatus,
	filterGender,
	filterBusinessUserType,
	filterUserType,
	filterIsRealName,
} from '../../utils/filters';
export default {
	components: {
		footerStatus,
		parkingSpaceInformation,
	},
	filters: {
		filterRegisterStatus,
		// filterCardType,
		filterGender,
		filterBusinessUserType,
		filterUserType,
		filterIsRealName,
	},
	data() {
		return {
			registerId: "",				// 登记id
			orderDetail: {},			// 详情
			showLitigantDialog: false,
			showSubscribeDialog: false,
			showSubscribeDialog1: false,
			registerTableData: [], 		// 登记账号
			activeName: 'first',
			materialList: [],
			accountInfo: {},			// 账号详情
		}
	},
	created() {
		this.registerId = this.$route.query.registerId
		this.getRegisterDetail()
	},
	methods: {
		// 更新页面状态
		updateStatus() {
			this.getRegisterDetail()
		},

		// tabs切换
		handleClick(tab, event) {
			console.log(tab, event);
		},

		// 获取详情
		async getRegisterDetail() {
			let res = await defenseParkingRegisterDetail(this.registerId)
			console.log('详情--->', res);
			if (res.success && res.data) {
				this.orderDetail = res.data
				this.materialList = res.data.materialList
				this.registerTableData = [res.data]
			}
		},

		// 查看当事人详情
		async handleToDetail(row) {
			console.log(row);
			let res = await parkingRegisterAccountInfo(row.userAccountInfoId)
			console.log(res);

			if (res.success && res.data) {
				this.accountInfo = res.data
				if (res.data.userType == 1) {	// 人个账号
					this.showLitigantDialog = true
				} else {	// 企业账号
					this.showSubscribeDialog = true
				}
				return
			}

			this.$message({
				message: '服务器开小差了，请稍后再试',
				type: 'error',
			})
		},

		// 点击复制
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

		// 返回
		goBack() {
			this.$router.go(-1)
		}
	},
}
</script>

<style lang="less" scoped>
.entry-dateail-mian {
	background: #efefef;
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
		border-radius: 4px;
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
				min-width: 350px;
				li {
					display: flex;
					align-items: center;
					span {
						line-height: 26px;
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

.table_content {
	margin-top: 10px;
}

.info_content {
	border: 1px solid #eee;
}

/deep/.el-table td {
	padding: 8px;
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
		background-color: #f2f2f2;
		align-items: center;
		justify-content: space-between;
		font-weight: bold;
		font-size: 16px;
		padding-right: 10px;
	}

	.info_content_text {
		line-height: 60px;
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
		background-color: #f2f2f2;
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
.status_text {
	color: yellowgreen;
}
.button {
	width: 80px;
}
/deep/.table_header th {
	padding: 9px 0;
}
/deep/ .el-tabs__item {
	font-size: 15px;
	font-weight: bold;
}

.label_text {
	width: 130px;
	display: inline-block;
	text-align: right;
	height: 100%;
}
.label_block {
	vertical-align: top;
	display: inline-block;
	width: 220px;
}
/deep/.account_info {
	line-height: 30px;
}
/deep/ .el-dialog__body {
	padding: 10px 20px 20px;
}
</style>
