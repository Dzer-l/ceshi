<template>
	<div class="entry-dateail-mian">
		<router-view />
		<div v-if="mainStatu" class="entry-dateail">
			<div class="go-back-btn">
				<el-button type="primary" size="small" style="width:80px" @click="goBack">返回
				</el-button>
			</div>

			<!-- 订单信息头部 -->
			<div class="basic-order-information">
				<h3>
					<i class="el-icon-s-order" style="color: #409eff; padding-right: 5px" />
					订单编号:{{ basicData.orderNum}}
					<el-button type="text" style="padding: 0 20px" class="copy-order-num" :disabled="jurisdiction"
						:data-clipboard-text="basicData.orderNum" @click="copyNum">复制</el-button>
				</h3>

				<div class="basic-order-information-list">
					<ul>
						<li>
							<span class="info-title">业务类型：</span>
							<span>{{ basicData.businessTypeDesc }}</span>
						</li>
						<li>
							<span class="info-title">提交时间：</span>
							<span>{{ basicData.createTime }}</span>
						</li>
						<li>
							<span class="info-title">{{basicData.orderStatus === 402?"关闭":"完成"}}时间：</span>
							<span>{{ basicData.finishTime }}</span>
						</li>
					</ul>
					<ul>
						<li>
							<span class="info-title">办证点：</span>
							<span>{{ basicData.officePoint }}</span>
						</li>
						<li>
							<span class="info-title">承办人：</span>
							<span>{{ basicData.acceptSysUserName }}</span>
						</li>
					</ul>
				</div>
			</div>

			<!-- 点击查看账号信息 -->
			<div v-if="accountDialogVisible" class="account-dialog-main">
				<el-dialog title="用户账号信息" :visible.sync="accountDialogVisible" width="40%"
					:close-on-click-modal="false">
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
								<span>
									{{accountData.isRealName == 0 ? "未实名" : "已实名"}}
								</span>
							</li>
							<li>
								<span class="accpunt-dislog-list-title">证件类型：</span>
								<span>{{ accountData.userInfoDTO.cardTypeDesc }}</span>
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
									<span>{{
                    accountData.parentAccount == null ||
                      accountData.parentAccount == 0
                      ? "主账号"
                      : "子账号"
                  }}</span>
								</li>
								<li v-if=" parseInt(accountData.parentId)!==0&&accountData.parentId!==null ">
									<span class="accpunt-dislog-list-title">主账号：</span>
									<span>{{ accountData.parentAccount }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">实名状态：</span>
									<span>{{
                    accountData.isRealName == 0 ? "未实名" : "已实名"
                  }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">企业名称：</span>
									<span>{{ accountData.userName }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">证件类型：</span>
									<span>{{ accountData.userInfoDTO.cardTypeDesc }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">统一社会信用代码：</span>
									<span>{{ accountData.cardNum }}</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">所在地区：</span>
								</li>
							</ul>
						</div>
						<p>企业联系人</p>
						<div class="account-dialog">
							<ul>
								<li>
									<span class="accpunt-dislog-list-title">联系人身份：</span>
									<span v-if="parseInt(privyData.companyRelation)===1">法定代表人</span>
									<span v-if="parseInt(privyData.companyRelation)===2">董事</span>
									<span v-if="parseInt(privyData.companyRelation)===3">企业联系人</span>
								</li>
								<li>
									<span class="accpunt-dislog-list-title">姓名：</span>
									<span>{{ privyData.realName }}</span>
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
									<span>{{ privyData.address }}</span>
								</li>
							</ul>
							<ul>
								<li>
									<span class="accpunt-dislog-list-title">证件类型：</span>
									<span>{{ parseInt(privyData.cardType)===111?'身份证':'' }}</span>
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
				</el-dialog>
			</div>

			<!-- tab栏信息展示 -->
			<div v-if="tablesta" class="tab-main">
				<el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
					<el-tab-pane label="申请信息" name="first">
						<applicationInfo v-if="tabActiveName === 'first'" />
					</el-tab-pane>
					<el-tab-pane label="证据材料" name="second">
						<evidenceMaterial v-if="tabActiveName === 'second'" />
					</el-tab-pane>
					<el-tab-pane label="文书材料" name="third">
						<documentMaterial :orderNum="basicData.orderNum" v-if="tabActiveName === 'third'"
							@updateData="updateData" />
					</el-tab-pane>
				</el-tabs>
			</div>

			<!-- 待处理 -->
			<div v-if="basicData.orderStatus === 201" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">待处理</span>
					</div>
					<!-- <div class="describe-text" style="padding-right:0" @click="finishOrder">
						<span class="finish_order">完成办理</span>
					</div> -->
				</div>
			</div>

			<!-- 已完成 -->
			<div v-if="basicData.orderStatus === 306" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #67c239">已完成</span>
					</div>
				</div>
			</div>

			<!-- 已关闭 -->
			<div v-if="basicData.orderStatus === 402" class="statu-main">
				<div class="statu-title-describe">
					<div class="describe-text">
						<span style="line-height: 30px">状态</span>
						<span style="font-size: 18px; color: #f96a00">已关闭</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Clipboard from 'clipboard'

import { getUniversalOrderDetail, finishUniversalOrder } from '../../api/universal'
import documentMaterial from '../../components/universal/documentMaterial'
import evidenceMaterial from '../../components/universal/evidenceMaterial'
import applicationInfo from '../../components/universal/applicationInfo'

export default {
	components: {
		applicationInfo,
		documentMaterial,
		evidenceMaterial,
	},

	data() {
		return {
			pickerOptions0: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7// 如果没有后面的-8.64e7就是不可以选择今天的
				}
			},
			jurisdiction: false,
			submitStatu: false,
			tablesta: false,
			orderId: '',
			mainStatu: true,
			basicData: {},
			volumeData: {
				volumeNum: '',
				name: '',
				assistant: ''
			},
			volumeRules: {
				dossierNum: [
					{ required: true, message: '请输入正确的卷宗号', trigger: 'blur' }
				],
				notaryPersonName: [
					{
						required: true,
						message: '允许输入汉字、数字、字母或（）-',
						trigger: 'blur'
					}
				],
				assistantName: [
					{
						required: true,
						message: '允许输入汉字、数字、字母或（）-',
						trigger: 'blur'
					}
				]
			},
			volumeNumStatu: true,
			accountDialogVisible: false,
			accountData: {},
			refusedAcceptDialogFormVisible: false,
			refusedAcceptForm: { reason: '' },
			refusedAcceptRules: {
				reason: [
					{ required: true, message: '请输入拒绝理由', trigger: 'blur' },
					{
						min: 5,
						max: 120,
						message: '请输入 5 到 120 个字',
						trigger: 'blur'
					}
				]
			},
			materialsDialogVisible: false,
			activeName: 'first',
			searchMaterial: '',
			checkList: [],
			addMaterial: {
				name: '',
				remark: ''
			},
			addMaterialData: [
				{
					id: 1,
					newName: '新材料名称',
					newRemark: '材料备注',
					btn: '添加',
					model: { name: '', remark: '' }
				}
			],
			tabActiveName: 'first',
			materialData: [],
			terminationDialogVisible: false,
			terminationData: {
				terminationCause: ''
			},
			terminationRules: {
				terminationCause: [
					{ required: true, message: '请输入终止原因', trigger: 'blur' },
					{
						min: 5,
						max: 120,
						message: '长度在 3 到 120 个字',
						trigger: 'blur'
					}
				]
			},
			appointmentDialogVisible: false,
			setData: {
				time: '',
				site: '',
				num: ''
			},
			options: [],
			setRulse: {
				time: [
					{
						required: true,
						message: '请选择领证日期',
						trigger: 'change'
					}
				],
				site: [
					{
						required: true,
						message: '请选择领证地点',
						trigger: 'change'
					}
				],
				num: [{ required: true, message: '请填写领证号', trigger: 'blur' }]
			},
			codeDialogVisible: false,
			codeUrl: '',
			privyData: {}
		}
	},

	watch: {
		// 路由监听：监听路由的变化，从而做出相应操作
		$route: {
			immediate: true, // 一旦监听到路由的变化立即执行
			handler(to, from) {
				// 回调函数，两个参数，to：当前的组件，from：上一个组件
				if (to.name !== 'universalDetailsOrder') {
					this.mainStatu = false
				}
			}
		}
	},

	created() {
		if (this.$route.query.orderId) {
			this.orderId = this.$route.query.orderId
		} else {
			this.orderId = this.$store.state.app.orderId
			var url = `/#${this.$route.path}?orderId=${this.orderId}`
			history.pushState(null, null, url)
		}
		var data = { orderId: this.orderId }

		console.log(this.tabActiveName)
		// getJurisdiction({ orderId: this.orderId }).then((res) => {
		// console.log(res, '是否有操作权限')
		// if (res.success) {
		// this.jurisdiction = !res.data
		this.getData(data)
		// }
		// })
	},

	methods: {
		// 刷新页面
		updateData() {
			this.getData({ orderId: this.$store.state.app.orderId })
		},
		// 完成办理
		finishOrder() {
			const h = this.$createElement
			this.$msgbox({
				title: '提示',
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				message: h('p', null, [
					h('p', null, '确定订单已办理？'),
					h('span', { style: 'color: #F04134' }, '确定后，订单无法进行操作！')
				])
			})
				.then(() => {
					const tdata = JSON.parse(JSON.stringify(this.basicData))
					tdata.orderStatus = 306

					console.log('完成办理结果提交的数据', tdata);

					finishUniversalOrder(tdata).then((res) => {
						console.log('完成办理结果', res);
						if (res.success) {
							this.$router.go(0)
						}
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					})
				})

		},

		// 获取列表
		getData(data) {
			getUniversalOrderDetail({ orderId: this.orderId }).then((res) => {
				console.log(res, '00000')
				this.basicData = res.data
				console.log(this.basicData);
				this.volumeData.volumeNum = res.data.dossierNum
				this.volumeData.name = res.data.notaryPersonName
				this.volumeData.assistant = res.data.assistantName
				this.tablesta = true
				if (this.basicData.businessType !== 5) {
					if (sessionStorage.getItem('tabActiveName')) {
						this.tabActiveName = sessionStorage.getItem('tabActiveName')
					} else {
						this.tabActiveName = 'first'
					}
				} else {
					if (sessionStorage.getItem('tabActiveName')) {
						if (sessionStorage.getItem('tabActiveName') === 'second' || sessionStorage.getItem('tabActiveName') === 'third') {
							this.tabActiveName = 'first'
						} else {
							this.tabActiveName = sessionStorage.getItem('tabActiveName')
						}
					} else {
						this.tabActiveName = 'first'
					}
				}
			})
		},

		// 点击复制订单编号
		copyNum() {
			this.copy('.copy-order-num')
		},
		// 点击复制支付编号
		copyPayNum() {
			this.copy('.copy-pay-num')
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

		handleTabClick() {
			sessionStorage.setItem('tabActiveName', this.tabActiveName)
		},
		goBack() {
			// this.$router.push({ name: 'universalList' })
			window.history.go(-1)
		}
	}
}
</script>

<style lang="less" scoped>
/deep/ .el-message-box__content {
	color: #f04134 !important;
}
.finish_order {
	padding: 0 50px;
	font-size: 18px;
	background-color: #1890ff;
	color: #fff;
	line-height: 80px;
	height: 80px;
	font-weight: 530;
}
ul {
	margin: 0;
	padding: 0;
	li {
		list-style: none;
	}
}
/deep/ .el-dialog__body {
	border-top: solid 1px #eee;
	border-bottom: solid #eee 1px;
}
.entry-dateail-mian {
	background: #f7f7f7;
	min-height: calc(100vh - 50px);
	padding: 20px;
	padding-bottom: 0;
	position: relative;
	display: flex;
	flex-flow: column;
	font-size: 14px;
	color: #333;

	.entry-dateail {
		min-height: calc(100vh - 70px);
		padding-bottom: 90px;
		position: relative;
	}
	.basic-order-information {
		background: #fff;
		padding: 20px;
		h3 {
			margin: 0;
			display: flex;
			align-items: center;
		}
		.basic-order-information-list {
			display: flex;
			margin-top: 20px;
			.move-up {
				margin-top: -30px;
			}
			ul {
				// flex: 1;
				padding-right: 50px;
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
	.volume-information {
		margin-top: 20px;
		.volume-information-list {
			padding-top: 20px;
			.el-form {
				display: flex;
				align-items: center;
				.el-form-item {
					width: 32%;
					margin-bottom: 10px;
					/deep/ label::before {
						display: none;
					}
					/deep/ .el-form-item__content {
						width: 70%;
					}
				}
				.compile-button {
					flex: 1;
					padding-left: 20px;
					display: flex;
					justify-content: flex-end;
					padding-right: 20px;
				}
			}
		}
	}
	.statu-main {
		height: 80px;
		position: absolute;
		bottom: 0;
		background: #fff;
		width: calc(100%);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.statu-title-describe {
			display: flex;
			justify-content: flex-end;
			height: 100%;
			& > div {
				width: 180px;
				height: 100%;
			}
			.describe-text,
			.describe-button {
				display: flex;
				flex-flow: column;
				justify-content: center;
				align-items: center;
			}
			.describe-text {
				width: auto;
				padding-right: 20px;
				align-items: flex-end;
			}
			.describe-button {
				width: 180px;
				color: #fff;
				border-radius: 0;
				margin-left: 0;
				border: none;
			}
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
						width: 125px;
						text-align: right;
						color: #999;
						white-space: nowrap;
					}
				}
			}
		}
	}
	.refused-accept {
		.el-form {
			width: 90%;
			margin: auto;
		}
		.el-form-item {
			display: flex;
			/deep/ .el-form-item__content {
				flex: 1;
			}
		}
	}
	.supplementary-materials {
		.select-material {
			.search {
				display: flex;
				/deep/ .el-input,
				/deep/ .el-input__inner {
					width: 400px;
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
				}
				.el-button {
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}
			}
		}
		.material-list {
			height: 400px;
			border: solid 1px #eee;
			margin-top: 20px;
			padding: 20px;
			overflow: auto;
		}
		.add-material {
			height: 470px;
			overflow: auto;
			.el-alert--warning {
				/deep/ .el-alert__closebtn {
					display: none;
				}
			}
			.from-list {
				.from-list-buttom {
					width: 100%;
					padding-top: 20px;
					display: flex;
					align-items: flex-end;
				}
				.add-text-button {
					margin-left: 20px;
					color: #8a2ee6;
					cursor: pointer;
				}
				.reduce-text-button {
					margin-left: 20px;
					color: red;
					cursor: pointer;
				}
				.el-form {
					width: 60%;
					border-bottom: solid 1px #eee;
				}
			}
		}
	}
	.tab-main {
		background: #fff;
		margin: 20px 0;
		padding: 20px;
	}
	.reasons-text {
		flex: 1;
		display: flex;
		flex-flow: row !important;
		align-items: center;
	}
	.make-an-appointment {
		.el-form {
			.el-form-item {
				display: flex;
				/deep/ .el-form-item__content {
					flex: 1;
				}
				.el-date-editor,
				.el-select {
					width: 100%;
				}
			}
		}
	}
}
.code-dialog {
	/deep/ .el-dialog__body {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
/deep/ .el-tabs__item {
	font-size: 14px;
}
.privy-info-list {
	li {
		width: 50%;
	}
}
.go-back-btn {
	position: absolute;
	right: 20px;
	top: 20px;
}
.termination-dialog {
	.el-form-item {
		display: flex;
		/deep/ .el-form-item__content {
			margin-left: 0 !important;
			flex: 1;
		}
	}
}
</style>
<style lang="less">
.el-message-box__content {
	display: flex;
}
.el-message-box__input {
	padding: 0;
	flex: 1;
}
.el-message-box__title {
	position: relative;
	font-size: 16px;
	color: #333;
}
.volume-information {
	.volume-information-list {
		.el-form-item {
			display: flex;
		}
	}
}
</style>
