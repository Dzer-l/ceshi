<template>
	<div class="container">
		<div class="big_content">
			<!-- 头部搜索 -->
			<div class="search-issunce-box">
				<el-form label-position="right" label-width="120px">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="搜索类别：">
								<el-input v-model="nameOrMobile" placeholder="搜索姓名/手机号码/固话号码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-button type="primary" size="medium" @click="handleSearch">查询</el-button>
							<el-button size="medium" @click="handleReset">重置</el-button>
						</el-col>

					</el-row>
				</el-form>
			</div>
			<div class="content_box">
				<!-- 新增地址和提示 -->
				<div>
					<div style="padding-botton:10px">
						<el-button type="primary" @click="handleAddAddress">新增地址</el-button>
					</div>
					<div class="tips_content">
						<el-alert class="select_tips" effect="light" show-icon :closable="false">
							<div>地址簿最多允许添加50个地址</div>
						</el-alert>
					</div>
				</div>

				<!-- 表格 -->
				<div class="table_content">
					<el-table ref="multipleTable" :data="addressList" cell-class-name="table_cell_class_name">
						<el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
						<el-table-column prop="name" label="姓名" align="center"></el-table-column>
						<el-table-column prop="contactNumber" label="手机号码"></el-table-column>
						<el-table-column prop="fixedLine" label="固话号码"></el-table-column>
						<el-table-column prop="companyName" label="公司名称" width="180" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="地址" width="210" show-overflow-tooltip>
							<template slot-scope="{row}">
								<div>{{row.address + row.detailAddress}}</div>
								<!-- <div>{{row.address}}</div>
								<div>{{row.detailAddress}}</div> -->
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center">
							<template slot-scope="scope">
								<el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<!-- 分页 -->
				<div class="pagination_content">
					<el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 50]"
						:current-page.sync="pagination.pageNum" @current-change="handleCurrentChange"
						layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getAddressBookList,
} from '../../api/addressBook'

export default {
	data() {
		return {
			nameOrMobile: "",
			addressList: [],

			pagination: {	// 分页
				pageNum: 1,
				pageSize: 10
			},
			total: 0
		}
	},
	methods: {
		// 查询
		handleSearch() {
			this.getAddressList()
		},

		// 重置
		handleReset() {
			this.pagination = {
				pageNum: 1,
				pageSize: 10
			}
			this.nameOrMobile = ""
			this.getAddressList()
		},

		// 获取地址列表
		async getAddressList() {
			let data = {
				nameOrMobile: this.nameOrMobile,
				...this.pagination
			}
			let res = await getAddressBookList(data)
			console.log('地址列表', res);
			this.addressList = res.data.list
			this.total = res.data.total
		},
		// 去编辑
		handleEdit(index, row) {
			console.log(index, row);
			this.$router.push({
				name: "addOrEditAddress",
				query: { id: row.id }
			})
		},

		// 新增地址
		handleAddAddress() {
			console.log('新增地址');
			if (!(this.total < 50)) {
				return this.$alert('<p style="color:red;">可删除不常用地址，继续新增！</p>',
					'所保存的地址已超过50条，无法新增', {
					dangerouslyUseHTMLString: true,
					type: 'warning',
				})
			}
			this.$router.push({ name: "addOrEditAddress" })
		},

		// 分页每页显示条数变化
		handleSizeChange(val) {
			console.log('每页:' + val);
			this.pagination.pageSize = val
			this.getAddressList()
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.pagination.currentPage = val
			this.getAddressList()
		},
	},
	created() {
		this.getAddressList()
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

		.header_title {
			display: flex;
			line-height: 40px;
			span {
				width: 80px;
				font-size: 14px;
			}
		}

		.table_content {
			margin-top: 20px;
		}
	}
}
/deep/.table_cell_class_name {
	padding: 6px 0;
}

.search-issunce-box {
	display: block !important;
	background: #fff;
	padding: 5px;
	min-width: 100%;
}

.content_box {
	margin-top: 10px;
	padding: 0 30px;
	background: #fff;
	min-width: 100%;
}

.tips_content {
	margin: 10px 0;

	.select_tips {
		color: #409eff;
		border: 1px solid #409eff;
		background-color: #e6f7ff;

		.tips_text {
			color: #409eff;
			display: inline-block;
			padding: 0 5px;
		}
	}
}

.table_content {
	margin-top: 20px;
}

.pagination_content {
	padding: 20px 0;
	text-align: center;
}

.date_section {
	padding: 0 5px;
	color: #999;
}

.el-date-editor.el-input {
	width: 200px;
}

/deep/.el-table thead {
	color: #333;
}

/deep/.el-alert__icon.is-big {
	margin-top: 2px;
	font-size: 16px;
	width: 14px;
}
</style>