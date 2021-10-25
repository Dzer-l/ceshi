<template>
	<div class="container">
		<!-- 持有人 -->
		<div class="box_item">
			<div class="title_wrapper">
				<div class="title">持有人</div>
				<div class="button_wrapper">
					<!-- <el-button class="button" size="small" type="primary">持有人</el-button> -->
				</div>
			</div>
			<div class="table_wrapper">
				<el-table :data="registerTableData" style="width: 100%" :header-row-style="{color:'#555'}" border
					header-row-class-name="table_header" row-class-name="table_row_class">
					<el-table-column align="center" width="180px">
						<template slot-scope="{row}">
							<el-tag size="medium" :type="getRegisterStatusTag(row.holderCardType)">持有人</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="holderName" label="持有人" align="center">
					</el-table-column>
					<el-table-column prop="holderCardType" label="证件类型" align="center">
					</el-table-column>
					<el-table-column prop="holderCardNum" label="证件号码" align="center">
					</el-table-column>
				</el-table>
			</div>
		</div>

		<!-- 车位信息 -->
		<div class="box_item">
			<div class="title_wrapper">
				<div class="title">车位信息</div>
				<div class="button_wrapper">
					<!-- <el-button class="button" size="small" type="primary">车位信息</el-button> -->
				</div>
			</div>
			<div class="info_wrapper">
				<el-row>
					<el-col :span="10">小区名称：{{orderDetail.communityName}}</el-col>
					<el-col :span="12">车位备案号：{{orderDetail.parkingCaseNum}}</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">小区地址：{{orderDetail.communityAddress}}</el-col>
				</el-row>
			</div>
			<div class="table_wrapper">
				<el-table :data="parkingData" style="width: 100%" :header-row-style="{color:'#555',background:'red'}"
					border header-row-class-name="table_header">
					<el-table-column prop="parkingNum" label="车位号" align="center">
					</el-table-column>
					<el-table-column prop="parkingArea" label="车位面积" align="center">
					</el-table-column>
					<el-table-column prop="affiliationPeriod" label="所属楼期" align="center">
					</el-table-column>
					<el-table-column prop="ownedBuilding" label="所属楼栋" align="center">
					</el-table-column>
				</el-table>
			</div>
			<!-- 分页 -->
			<div class="pagination_content">
				<el-pagination @size-change="handleSizeChange" :page-sizes="[10, 20, 30, 40]" background
					:current-page.sync="pagination.pageNum" @current-change="handleCurrentChange"
					layout="total, sizes, prev, pager, next" :total="parkingTotal">
				</el-pagination>
			</div>
		</div>

		<!-- 车位图片 -->
		<div class="box_item">
			<div class="title_wrapper">
				<div class="title">车位图片</div>
				<div class="button_wrapper">
					<el-button class="button" size="small" type="primary" @click="hanleDownload">一键下载</el-button>
					<el-button class="button" size="small" type="primary" @click="handleShowPicture">查看图片</el-button>
				</div>
			</div>
			<div class="table_wrapper">
				<el-table :data="materialList" style="width: 100%" :header-row-style="{color:'#555',background:'red'}"
					border header-row-class-name="table_header">
					<el-table-column prop="date" label="文件名称" align="center">
						<template slot-scope="{row}">
							<div>{{JSON.parse(row.materialFile).originalFilename}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="材料类型" align="center">
						<template slot-scope="{row}">
							<div>{{row.materialType | filterMaterialType}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
import {
	defenseParkingInfoDetail,
	downloadRegisterMaterial,
} from '../../api/parkingSpace'
export default {
	filters: {
		filterMaterialType(val) {
			return "车位图片"
		}
	},
	props: ["registerId", "orderDetail", "registerTableData", "materialList"],
	data() {
		return {
			parkingTotal: 0,
			pagination: {	// 分页
				pageNum: 1,
				pageSize: 10,
			},

			tableData: [],
			parkingData: [],	// 车位信息列表
		}
	},
	created() {
		this.getParkingList()
	},
	methods: {
		// 获取车位信息
		async getParkingList() {
			let data = {
				registerId: this.registerId,
				...this.pagination,
			}
			let res = await defenseParkingInfoDetail(data)
			console.log("车位信息", res);
			if (res.success && res.data) {
				this.parkingData = res.data.list
				this.parkingTotal = res.data.total
			}
		},

		// 分页每页显示条数变化
		handleSizeChange(val) {
			console.log('每页:' + val);
			this.pagination.pageSize = val
			this.getParkingList()
		},
		handleCurrentChange(val) {
			console.log('页面:' + val);
			this.pagination.pageNum = val
			this.getParkingList()
		},

		// 一键下载
		async hanleDownload() {
			let res = await downloadRegisterMaterial(this.registerId)

			console.log(res);

			if (res.type == "application/octet-stream" || res.type == "application/zip") {
				let fileName = `【车位图片】 ${this.orderDetail.registerNum}.zip`
				this.$fun.blobFile(res, fileName)
				this.$message.success("下载成功")
				return
			}

			this.$message.error("下载失败，请稍后再试")
		},

		// 查看图片
		handleShowPicture() {
			sessionStorage.setItem("parkingPlaceMaterialList", JSON.stringify(this.materialList))
			this.$router.push({
				name: "parkingSpacePicture"
			});
		},

		// 持有人前面 tag
		getRegisterStatusTag() {
			return "success"
		}
	},
}
</script>

<style lang="less" scoped>
.box_item {
	padding: 10px 10px 20px;
	margin-bottom: 10px;
	.title_wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 45px;
		// background: #eee;
		background: #e6f6fe;
		border-radius: 4px 4px 0 0;
		border: 1px solid #ebeef5;

		.title {
			font-weight: 650;
			font-size: 16px;
			padding-left: 10px;
		}

		.button_wrapper {
			padding-right: 20px;
		}
	}
	.info_wrapper {
		padding: 10px 30px;
		line-height: 40px;
		color: #333;
		font-size: 14px;
		border: 1px solid #ebeef5;
		border-top: none;
		border-bottom: none;
	}
	.pagination_content {
		padding: 20px 0 20px 0;
		text-align: center;
	}
}
.button {
	width: 80px;
}
/deep/.table_header th {
	padding: 9px 0;
}
/deep/ .table_row_class > td {
	padding: 7px 0;
}
</style>