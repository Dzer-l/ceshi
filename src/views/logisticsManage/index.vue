<template>
	<div class="container">
		<div class="big_content">
			<el-tabs v-model="mailActiveName" @tab-click="handleClick">
				<el-tab-pane label="公证业务" name="first">
					<express-notarial-business :notarialBusinessFormData.sync="notarialBusinessFormData"
						:notarialBusinessPagination.sync="notarialBusinessPagination" :sendReceiveType="sendReceiveType"
						:operatorList="operatorList" @handleReset="handleReset" v-if="mailActiveName=='first'"
						:prodCodeList="prodCodeList" />
				</el-tab-pane>
				<el-tab-pane label="存证业务" name="second">
					<!-- <business-tab @searchFormChange="searchFormChange2" @paginationChange="paginationChange2"
						key="second" :businessTabData="businessTabData2" @search="handleSearch" @reset="handleReset"
						:haveDossierNum="false" :total="total" :sendReceiveType="sendReceiveType"
						:mailActiveName="mailActiveName" @updateList="updateList" :operatorList="operatorList">
					</business-tab> -->
					<express-preserve-business :preserveBusinessFormData.sync="preserveBusinessFormData"
						:preserveBusinessPagination.sync="preserveBusinessPagination" :sendReceiveType="sendReceiveType"
						:operatorList="operatorList" @handleReset="handleReset" v-if="mailActiveName=='second'"
						:prodCodeList="prodCodeList" />
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
// import businessTab from '../../components/logisticsManage/businessTab';
import { getOrgProductionList } from '../../api/mailManage';
import expressNotarialBusiness from '../../components/logisticsManage/expressNotarialBusiness.vue';
import expressPreserveBusiness from '../../components/logisticsManage/expressPreserveBusiness.vue';
import { getOperator } from '../../api/logisticsManage';
export default {
	components: {
		// businessTab,
		expressNotarialBusiness,
		expressPreserveBusiness
	},
	data() {
		return {
			// 公证业务
			notarialBusinessFormData: {
				expressNo: "",
				orderNum: "",
				receiveName: "",
				senderName: "",
				operatingUserName: "",
				startTime: "",
				endTime: "",
				status: "",
				prodCode: "",				// 业务类型
			},
			notarialBusinessPagination: {	// 分页
				pageNum: 1,
				pageSize: 10
			},

			// 存证业务
			preserveBusinessFormData: {
				expressNo: "",
				orderNum: "",
				receiveName: "",
				senderName: "",
				operatingUserName: "",
				startTime: "",
				endTime: "",
				status: "",
				prodCode: "",				// 业务类型
			},
			preserveBusinessPagination: {	// 分页
				pageNum: 1,
				pageSize: 10
			},


			operatorList: [{ label: "全部", value: "" }],	// 操作人列表
			sendReceiveType: 0,	// 收寄类型，0寄，1收 (不是寄证和存证！)
			mailActiveName: sessionStorage.getItem('mailActiveName') || 'first',
			prodCodeList: "",
		}
	},
	methods: {
		// 获取业务类型
		async getBusinessType() {
			let res = await getOrgProductionList()
			// console.log('业务类型', res);
			this.prodCodeList = res.data
		},

		// 重置
		handleReset() {
			if (this.mailActiveName == "first") {
				this.notarialBusinessFormData = {
					expressNo: "",
					orderNum: "",
					receiveName: "",
					senderName: "",
					operatingUserName: "",
					startTime: "",
					endTime: "",
					status: "",
					prodCode: "",				// 业务类型
				}
				this.notarialBusinessPagination = {	// 分页
					pageNum: 1,
					pageSize: 10
				}
			} else {
				this.preserveBusinessFormData = {
					expressNo: "",
					orderNum: "",
					receiveName: "",
					senderName: "",
					operatingUserName: "",
					startTime: "",
					endTime: "",
					status: "",
					prodCode: "",				// 业务类型
				}
				this.preserveBusinessPagination = {	// 分页
					pageNum: 1,
					pageSize: 10
				}
			}
		},

		// tabs切换
		handleClick(tab, event) {
			sessionStorage.setItem("mailActiveName", this.mailActiveName)
			// console.log(this.mailActiveName)
		},

		// 获取操作人
		async getOperatorList() {
			let res = await getOperator()
			// console.log("获取操作人", res);
			if (res.success && res.data) {
				res.data.forEach(item => {
					this.operatorList.push({
						label: item,
						value: item
					})
				})
				return
			}
		},

		// 浏览器刷新要执行的事件
		beforeunloadHandler(e) {
			removeData()
		},
	},
	created() {
		this.getBusinessType()
		this.getOperatorList()
		this.notarialBusinessFormData = sessionStorage.notarialBusinessFormData ? JSON.parse(sessionStorage.notarialBusinessFormData) : this.notarialBusinessFormData
		this.notarialBusinessPagination = sessionStorage.notarialBusinessPagination ? JSON.parse(sessionStorage.notarialBusinessPagination) : this.notarialBusinessPagination
		this.preserveBusinessFormData = sessionStorage.preserveBusinessFormData ? JSON.parse(sessionStorage.preserveBusinessFormData) : this.preserveBusinessFormData
		this.preserveBusinessPagination = sessionStorage.preserveBusinessPagination ? JSON.parse(sessionStorage.preserveBusinessPagination) : this.preserveBusinessPagination
	},
	mounted() {
		window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
	},
	beforeRouteLeave(to, from, next) {
		if (to.name != "mailingDetail") {
			sessionStorage.removeItem('mailActiveName')
			removeData()
		} else {
			sessionStorage.setItem("notarialBusinessFormData", JSON.stringify(this.notarialBusinessFormData))
			sessionStorage.setItem("notarialBusinessPagination", JSON.stringify(this.notarialBusinessPagination))
			sessionStorage.setItem("preserveBusinessFormData", JSON.stringify(this.preserveBusinessFormData))
			sessionStorage.setItem("preserveBusinessPagination", JSON.stringify(this.preserveBusinessPagination))
		}
		next()
	},
	beforeEnter: (to, from, next) => {
		if (from.name != "mailingDetail") {
			removeData()
		}
		next()
	},
	destroyed() {
		window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
	},
}
function removeData() {
	sessionStorage.removeItem("notarialBusinessFormData")
	sessionStorage.removeItem("notarialBusinessPagination")
	sessionStorage.removeItem("preserveBusinessFormData")
	sessionStorage.removeItem("preserveBusinessPagination")
}
</script>

<style lang="less" scoped>
.container {
	background: #f5f5f5;
	padding: 20px;
	min-height: calc(100vh - 50px);

	.big_content {
		background-color: #fff;
		padding: 30px;
	}
}
/deep/.el-tabs__item {
	font-size: 15px;
	font-weight: 600;
	color: #333;
}
</style>
