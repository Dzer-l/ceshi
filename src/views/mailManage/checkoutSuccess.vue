<template>
	<div class="container">
		<div class="content">
			<div class="go_back_btn">
				<el-button type="primary" style="width:80px;" size="small" @click="goBack">返回</el-button>
			</div>
			<div class="content_banner">
				<div><i class="el-icon-success"></i></div>
				<div class="banner_title">下单成功，等待快递上门取件</div>
				<div class="banner_title">请打印快递电子面单，贴于包裹上，用于取件标识。</div>
			</div>
			<div class="mail_table">
				<el-table :data="expressList" style="width: 100%">
					<el-table-column type="index" label="序号" align="center">
					</el-table-column>
					<el-table-column prop="expressNo" label="订单编号">
					</el-table-column>
					<el-table-column prop="dossierNum" label="卷宗号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="receiveName" label="姓名" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="receiveMobile" label="手机号码">
					</el-table-column>
					<el-table-column prop="receiveFixedLine" label="固话号码">
					</el-table-column>
					<el-table-column prop="receiveCompany" label="公司地址" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="收件人地址" show-overflow-tooltip>
						<template slot-scope="{row}">
							<div>{{row.receiveAddress}}</div>
							<div>{{row.receiveDetailAddress}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="140">
						<template slot-scope="scope">
							<el-button type="primary" size="medium" @click="handlePrint(scope.$index, scope.row)">打印电子面单
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
import { getExpressPrintList, packagePrint } from '../../api/mailManage';
import { printInit, print } from '../../utils/printExpressList';
export default {
	data() {
		return {
			expressList: [],	// 呼叫快递成功列表
			from: "",			// 来自哪个路由
			detailId: "",
			fromOrderId: "",
		}
	},
	methods: {
		// 打印电子面单
		async handlePrint(index, row) {
			console.log(index, row);
			let res = await packagePrint(row.id)
			// console.log(res);

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

		// 下单列表展示
		async getPrintList() {
			let res = await getExpressPrintList({
				ids: this.$route.query.ids.split(",")
			})
			console.log(res);
			if (res.success && res.data.list) this.expressList = res.data.list
		},

		// 返回
		goBack() {
			if (this.from == "detailsOrder") return this.$router.replace({ name: 'detailsOrder', query: { orderId: this.fromOrderId } })
			if (this.from == "entryDetailsOrder") return this.$router.replace({ name: 'entryDetailsOrder', query: { orderId: this.fromOrderId } })
			if (this.from == "entryDetail") return this.$router.push({ name: 'entryDetail' })
			if (this.from == "callMail") return this.$router.push({ name: 'mailingRecord' })
			if (this.detailId) return this.$router.push({ name: 'mailOrderDetail', query: { id: this.detailId } })
			this.$router.push({ name: 'mailManageIndex' })
		}
	},
	created() {
		// console.log(this.$route)
		this.detailId = this.$route.query.detailId ? this.$route.query.detailId : ""
		this.fromOrderId = this.$route.query.fromOrderId || ""
		this.getPrintList()
		this.from = this.$route.query.from
	},
}
</script>

<style lang="less" scoped>
.container {
	background: #f7f7f7;
	padding: 30px;
}

.content {
	background-color: #fff;
	border-radius: 3px;
	padding: 40px;
	font-size: 14px;

	.go_back_btn {
		text-align: right;
		padding-right: 20px;
	}

	.content_banner {
		text-align: center;

		.el-icon-success {
			font-size: 150px;
			color: #70b603;
		}
		.banner_title {
			font-size: 20px;
			color: #199ed8;
			text-align: center;
			line-height: 50px;
		}
	}

	.mail_table {
		margin-top: 30px;
		padding: 20px;
	}
}
.el-table,
/deep/.el-table thead {
	color: #333;
}
</style>
