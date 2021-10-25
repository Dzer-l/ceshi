<template>
	<div class="container">
		<div class="big_content">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="线上邮寄公证书" name="first">
					<online-receive :orgOfficeId="orgOfficeId" :prodCodeList="prodCodeList" v-if="activeName=='first'"
						:searchFormData.sync="searchFormOnlineData" :pagination.sync="paginationOnline">
					</online-receive>
				</el-tab-pane>
				<el-tab-pane label="线下领取公证书" name="second">
					<offline-receive :orgOfficeId="orgOfficeId" :prodCodeList="prodCodeList"
						v-if="activeName=='second'">
					</offline-receive>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
import onlineReceive from '../../components/mailManage/onlineReceive';
import offlineReceive from '../../components/mailManage/offlineReceive';
import {
	getOrgOfficeList,
	getOrgProductionList
} from '../../api/mailManage';

export default {
	components: {
		offlineReceive,
		onlineReceive
	},
	data() {
		return {
			activeName: sessionStorage.getItem('activeName') || 'first',
			orgOfficeId: [
				{ officeName: "全部", id: "" }
			],
			prodCodeList: "",
			searchFormOnlineData: {
				applicantName: "",
				expressNum: "",
				dossierNum: "",
				prodCodeList: [],
				certificateType: "",
				orgOfficeId: "",
				startTime: "",
				endTime: "",
				orderStatusList: [302, "303,304", 307]	// 全选状态
			},
			paginationOnline: {	// 分页
				pageNum: 1,
				pageSize: 10,
			}
		}
	},
	methods: {
		// 点击tabs
		handleClick(tab, event) {
			sessionStorage.setItem("activeName", this.activeName)
		},

		// 获取办证点
		async getOfficeList() {
			let res = await getOrgOfficeList()
			console.log('办证点', res)
			this.orgOfficeId.push(...res.data)
		},
		// 获取业务类型
		async getBusinessType() {
			let res = await getOrgProductionList()
			// console.log('业务类型', res);
			this.prodCodeList = res.data
		},
		beforeunloadHandler(e) {	// 浏览器刷新要执行的事件
			sessionStorage.removeItem("searchFormOnlineData")
			sessionStorage.removeItem("paginationOnline")
		},
	},
	created() {
		this.getOfficeList()
		this.getBusinessType()
		this.searchFormOnlineData = sessionStorage.searchFormOnlineData ? JSON.parse(sessionStorage.searchFormOnlineData) : this.searchFormOnlineData
		this.paginationOnline = sessionStorage.paginationOnline ? JSON.parse(sessionStorage.paginationOnline) : this.paginationOnline
	},
	mounted() {
		window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
	},
	beforeRouteLeave(to, from, next) {
		let toNameList = ["expressDelivery", "mailOrderDetail", "offlineOrderDetail"]
		// console.log(toNameList.includes(to.name));
		if (toNameList.includes(to.name)) {
			sessionStorage.setItem("searchFormOnlineData", JSON.stringify(this.searchFormOnlineData))
			sessionStorage.setItem("paginationOnline", JSON.stringify(this.paginationOnline))
		}
		if (!toNameList.includes(to.name)) {
			sessionStorage.removeItem('activeName')
		}
		next()
	},
	beforeRouteEnter(to, form, next) {
		// console.log(form);
		let formNameList = ["expressDelivery", "mailOrderDetail", "offlineOrderDetail"]
		if (!formNameList.includes(form.name)) {
			sessionStorage.removeItem("searchFormOnlineData")
			sessionStorage.removeItem("paginationOnline")
		}
		next()
	},
	destroyed() {
		window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
	},
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
