<template>
	<div>
		<div class="account-dialog-main">
			<!-- 个人账号信息 -->
			<div v-if="accountData.userType === 1" class="account-dialog">
				<ul>
					<li>
						<span class="accpunt-dislog-list-title">用户名：</span>
						<span>{{ accountData.userAccount }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">注册时间：</span>
						<span>{{ accountData.registerTime }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">实名状态：</span>
						<span>{{accountData.isRealName == 0 ? "未实名" : "已实名"}}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">证件类型：</span>
						<span>{{ accountData.cardType|filterCardType }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">性别：</span>
						<span>{{ accountData.gender == 1 ? "男" : "女" }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">出生日期：</span>
						<span>{{ accountData.userInfoDTO.birth }}</span>
					</li>
				</ul>
				<ul>
					<li>
						<span class="accpunt-dislog-list-title">用户类型：</span>
						<span>{{ accountData.userType | userType }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">注册公证处：</span>
						<span>{{ accountData.orgName }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">姓名：</span>
						<span>{{ accountData.userInfoDTO.userName }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">证件号码：</span>
						<span>{{ accountData.userInfoDTO.cardNum }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">手机号码：</span>
						<span>{{ accountData.userInfoDTO.mobile===null?accountData.mobile:accountData.userInfoDTO.mobile }}</span>
					</li>
					<li>
						<span class="accpunt-dislog-list-title">所在地区：</span>
						<span>{{ privyData.permanentAddress }}</span>
					</li>
				</ul>
			</div>
			<!-- 企业主账号信息 -->
			<div v-if="accountData.userType === 2">
				<div class="account-dialog">
					<ul style="display: flex;flex-wrap:wrap" class="privy-info-list">
						<li>
							<span class="accpunt-dislog-list-title">用户名：</span>
							<span>{{ accountData.userAccount }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">用户类型：</span>
							<span>{{ accountData.userType | userType }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">注册时间：</span>
							<span>{{ accountData.registerTime }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">注册公证处：</span>
							<span>{{ accountData.orgName }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">账号类型：</span>
							<span>{{accountData.parentAccount == null ||accountData.parentAccount == 0? "主账号": "子账号"}}</span>
						</li>
						<li v-if=" parseInt(accountData.parentId)!==0&&accountData.parentId!==null ">
							<span class="accpunt-dislog-list-title">主账号：</span>
							<span>{{ accountData.parentAccount }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">实名状态：</span>
							<span>{{ accountData.isRealName == 0 ? "未实名" : "已实名"}}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">企业名称：</span>
							<span>{{ accountData.organizationName?accountData.organizationName:accountData.userName }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">证件类型：</span>
							<span>{{ (accountData.organizationCardType? accountData.organizationCardType:accountData.cardType)|filterCardType }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">统一社会信用代码：</span>
							<span>{{ accountData.organizationCardNum? accountData.organizationCardNum:accountData.cardNum }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">所在地区：</span>
							<span>{{ accountData.organizationAddress }}</span>
						</li>
					</ul>
				</div>
				<p>企业联系人</p>
				<div class="account-dialog">
					<ul>
						<li>
							<span class="accpunt-dislog-list-title">联系人身份：</span>
							<span v-if="parseInt(accountData.companyRelation)===1">法定代表人</span>
							<span v-if="parseInt(accountData.companyRelation)===2">董事</span>
							<span v-if="parseInt(accountData.companyRelation)===3">企业联系人</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">姓名：</span>
							<span>{{ privyData.userName }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">证件号码：</span>
							<span>{{ privyData.cardNum }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">出生日期：</span>
							<span>{{ privyData.birth }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">所在地区：</span>
							<span>{{ privyData.permanentAddress }}</span>
						</li>
					</ul>
					<ul>
						<li>
							<span class="accpunt-dislog-list-title">证件类型：</span>
							<span>{{ privyData.cardType|filterCardType }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">性别：</span>
							<span>{{ privyData.gender === 1 ? "男" : "女" }}</span>
						</li>
						<li>
							<span class="accpunt-dislog-list-title">手机号码：</span>
							<span>{{ privyData.mobile }}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { filterCardType } from '@/filters/index'
export default {
	filters: {
		filterCardType,
		userType(val) {
			var str = ''
			if (parseInt(val) === 1) {
				str = '个人用户'
			} else if (parseInt(val) === 2) {
				str = '企业用户'
			}
			return str
		}
	},
	props: ['accountId'],
	data() {
		return {
			accountData: {},
			privyData: {}
		}
	},
	created() {
		this.getInfo()
	},
	methods: {
		getInfo() {
			this.$axios(`org/user-account/${this.accountId}`).then(res => {
				console.log(res)
				// debugger
				this.accountData = res.data
				if (res.data.userType !== 1) {
					// this.$axios(`org/query-account-userPersonbook/${res.data.id}`).then(data => {
					// console.log(data)
					this.privyData = res.data.userInfoDTO
					this.privyData.mobile = res.data.mobile
					// })
				}
			})
		}
	}
}
</script>

<style lang="less" scoped>
ul {
	padding: 0;
	margin: 0;
	li {
		list-style: none;
	}
}
.account-dialog-main {
	/deep/ .el-dialog__body {
		padding-top: 10px;
	}
	/deep/ .el-dialog__header {
		border-bottom: solid #eee 1px;
		padding-bottom: 20px;
	}
	.account-dialog {
		display: flex;
		align-items: center;
		ul {
			flex: 1;
			li {
				display: flex;
				padding: 10px 0;
				.accpunt-dislog-list-title {
					display: block;
					text-align: right;
					color: #999;
					white-space: nowrap;
				}
			}
		}
	}
}
.privy-info-list {
	li {
		width: 50%;
	}
}
</style>
