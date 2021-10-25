<template>
	<div class="container">
		<!-- 卷宗信息 -->
		<div class="content">
			<h3 class="title"><i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />卷宗信息</h3>

			<div class="info_content">
				<el-row :gutter="20">
					<el-col :span="12" :offset="0">
						<el-form ref="form" :model="form" label-width="80px">
							<el-form-item label="卷宗号">
								<el-input v-model="form.dossierNum" disabled></el-input>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>
			</div>

			<h3 class="title"><i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />当事人信息</h3>
			<div class="info_content">
				<el-table :data="litigantData" style="width: 100%">
					<el-table-column prop="realName" label="当事人名称" min-width="100" align="center">
					</el-table-column>
					<el-table-column label="证件类型" min-width="80" align="center">
						<template slot-scope="scope">
							{{cardFiltration(scope.row.cardType)}}
						</template>
					</el-table-column>
					<el-table-column prop="cardNum" label="证件号码">
					</el-table-column>
					<el-table-column prop="mobile" label="手机号码">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="150" align="center">
						<template slot-scope="scope">
							<el-button @click="handleClick(scope.row)" type="text" size="small">查看
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<el-dialog title="当事人信息" :visible.sync="showDialog" width="500px" center>
				<div style="padding-left:20px">
					<el-form label-position="left" :model="litigantDetail" label-width="120px">
						<el-form-item label="姓名">{{litigantDetail.realName}}</el-form-item>
						<el-form-item label="证件类型">{{cardFiltration(litigantDetail.cardType)}}</el-form-item>
						<el-form-item label="证件号码">{{litigantDetail.cardNum}}</el-form-item>
						<el-form-item label="性别">{{litigantDetail.gender | filterGender}}</el-form-item>
						<el-form-item label="手机号码">{{litigantDetail.mobile}}</el-form-item>
					</el-form>
				</div>
				<span slot="footer">
					<el-button type="primary" size="medium" @click="showDialog=false">确定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import {
	getUniversalLitigantDetail,
	getUniversalOrderLitigant,
	getUniversalOrderDetail
} from '../../api/universal';

export default {
	filters: {
		filterGender(val) {
			return val == 1 ? '男' : '女'
		}
	},
	data() {
		return {
			form: {
				dossierNum: ''
			},
			litigantDetail: {
				realName: '',
				cardType: '',
				cardNum: '',
				gender: '',
				mobile: ''
			},
			litigantData: [],
			showDialog: false,
			orderId: '',
			cardType:[{value:'111',type:'大陆居民身份证'},{value:'114',type:'军官证'},{value:'118',type:'港澳居民来往内地通行证'},{value:'119',type:'台湾来往内地通行证'}
			,{value:'130',type:'港澳居民居住证'},{value:'131',type:'台湾居民居住证'},{value:'132',type:'普通护照（中国）'},{value:'133',type:'外籍护照'}]
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

		// 获取当事人列表
		getUniversalOrderLitigant(data).then(res => {
			this.litigantData = res.data
		})

		getUniversalOrderDetail(data).then(res => {
			this.form = res.data
		})
	},

	methods: {
		// 证件类型过滤
		cardFiltration(str){
			for(const i of this.cardType){
				if(str==i.value){
					return i.type
				}
			}
		},
		handleClick(row) {
			let data = { orderProposeId: row.id }
			getUniversalLitigantDetail(data).then(res => {
				console.log('1111111111',res);
				this.showDialog = true
				this.litigantDetail = res.data
				// console.log()
			})
		},
	}
}
</script>

<style lang="less" scoped>
.content {
	.title {
		background-color: #f2f2f2;
		font-weight: bold;
		line-height: 50px;
		font-size: 18px;
	}
}

/deep/ .el-input.is-disabled .el-input__inner {
	color: #666;
	cursor: inherit;
}

/deep/ .el-dialog__header {
	display: flex;
	font-weight: bold;
}

/deep/ .el-form-item__label {
	color: #333;
}

/deep/ .el-table thead {
	color: #333;
}

/deep/ .el-dialog {
	.el-form-item {
		margin-bottom: 10px;

		.el-form-item__label {
			color: #666;
		}
	}

	.el-form-item__content {
		color: #333;
	}
}
</style>
