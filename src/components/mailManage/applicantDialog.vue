<template>
	<div>
		<el-dialog width="1000px" title="当事人信息" :visible.sync="applicantShowCom" append-to-body
			custom-class="address_dialog">
			<div class="content">
				<!-- <h3 class="title">
						<i class="el-icon-s-order" style="color: #797979; padding: 0 5px 0 20px" />
						当事人信息
					</h3> -->
				<div class="info_content">
					<el-table :data="litigantTableData" style="width: 100%">
						<el-table-column width="100">
							<template>
								<el-tag type="success" style="background:#d8f7ca;color:#4DD90D;">申请人</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="applicantName" label="当事人名称">
						</el-table-column>
						<el-table-column prop="cardType" label="证件类型">
							<template slot-scope="{row}">{{row.cardType | filterCardType}}</template>
						</el-table-column>
						<el-table-column prop="cardNum" label="证件号码">
						</el-table-column>
						<el-table-column prop="contact" label="手机号码">
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="text" @click="handleToDetail(scope.$index, scope.row)">详情
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</el-dialog>

		<el-dialog width="450px" title="查看当事人" :visible.sync="applicantInnerShow" append-to-body
			custom-class="address_dialog">
			<div class="content">
				<el-form :model="litigantFormData" label-width="90px" size="mini">
					<el-form-item label="姓名">{{litigantFormData.applicantName}}</el-form-item>
					<el-form-item label="证件类型">{{litigantFormData.cardType | filterCardType}}</el-form-item>
					<el-form-item label="证件号码">{{litigantFormData.cardNum}}</el-form-item>
					<!-- <el-form-item label="性别">{{litigantFormData.applicantName}}</el-form-item> -->
					<!-- <el-form-item label="出生日期">{{litigantFormData.applicantName}}</el-form-item> -->
					<el-form-item label="手机号码">{{litigantFormData.contact}}</el-form-item>
					<!-- <el-form-item label="地址">{{litigantFormData.applicantName}}</el-form-item> -->
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { filterCardType } from '../../filters/index';
export default {
	filters: {
		filterCardType
	},
	props: {
		applicantShow: { require: true },
		litigantTableData: {	// 当事人信息
			type: Array
		}
	},
	data() {
		return {
			applicantInnerShow: false,
			litigantFormData: {}
		}
	},
	methods: {
		// 查看详情
		handleToDetail() {
			console.log(this.litigantTableData);
			this.litigantFormData = this.litigantTableData[0]
			this.applicantInnerShow = true
		}
	},
	computed: {
		applicantShowCom: {
			get() {
				return this.applicantShow
			},
			set(val) {
				this.$emit("applicantShowChange", val)
			}
		}
	},
}
</script>

<style lang="less" scoped>
/deep/.el-form-item__content {
	color: #333;
}
/deep/.el-form-item__label {
	color: #999;
}
/deep/ .address_dialog {
	.el-dialog__header {
		font-weight: bold;
		padding-left: 40px;
		border-bottom: 1px solid #eee;
		padding-bottom: 20px;
	}
	.el-dialog__body {
		padding: 20px 40px 50px 40px;
		.scope_title {
			color: #333;
		}
		.scope_info {
			color: #999;
		}
	}
	.address_dialog_table_header {
		color: #333;
	}
	// .el-table th {
	// 	background-color: #f2f2f2;
	// }

	.el-table td {
		padding: 5px 0;
	}
}

/deep/ .el-table th > .cell {
	color: #333;
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
.info_content {
	border: 1px solid #eee;
}
</style>