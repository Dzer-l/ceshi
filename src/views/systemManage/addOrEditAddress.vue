<template>
	<div class="container">
		<div class="big_content">
			<el-button type="primary" size="medium" @click="goBack">返回</el-button>
			<h3 class="form_title">{{addressFormData.id?"修改地址":"添加地址"}}</h3>
			<div class="form_content">
				<el-form :model="addressFormData" :rules="addressFormRules" ref="addressForm" label-width="120px">
					<el-form-item label="姓名：" prop="name">
						<el-col :span="8">
							<el-input v-model="addressFormData.name" placeholder="请输入姓名"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="手机号码：" prop="contactNumber"
						:rules="contactNumberRules(contactNumberComputed,fixedLineComputed)">
						<el-col :span="8">
							<el-input maxlength="11" v-model="contactNumberComputed" placeholder="请输入手机号码"
								oninput="value=value.replace(/[^\d]/g,'')">
							</el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="固话号码：" prop="fixedLine"
						:rules="fixedLineRules(fixedLineComputed,contactNumberComputed)">
						<el-col :span="8">
							<el-input v-model="fixedLineComputed" placeholder="手机号码与固话号码必填一个，固话带区号和 -">
							</el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="公司名称：" prop="companyName">
						<el-col :span="8">
							<el-input v-model="addressFormData.companyName" placeholder="请输入公司名称（选填）"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="省市区（县）：" prop="regionCodeArr">
						<el-col :span="8">
							<el-cascader ref="cityCascader" style="width:100%" v-model="addressFormData.regionCodeArr"
								placeholder="请选择省市区（县）" :options="cityList"
								:props="{ expandTrigger: 'hover',label:'name' ,value:'code'}"
								@change="handleChange($event)">
							</el-cascader>
						</el-col>
					</el-form-item>
					<el-form-item label="详细地址：" prop="detailAddress">
						<el-col :span="8">
							<el-input type="textarea" v-model="addressFormData.detailAddress"
								placeholder="请输入详细地址，如xx街道xx路xx"
								@input="handleInput($event,'addressFormData','detailAddress')">
							</el-input>
						</el-col>
					</el-form-item>
					<!-- <el-form-item label="设为默认地址：">
						<el-col :span="8">
							<el-switch v-model="addressFormData.isDefault"> </el-switch>
							<span style="padding:0 15px">否</span>
						</el-col>
					</el-form-item> -->
					<el-form-item label-width="30px">
						<el-button style="width:80px" type="primary" @click="handleSave('addressForm')">保存</el-button>
						<el-button type="danger" v-if="addressFormData.id" @click="handleDelete">删除</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import {
	getCityRegionTree,
	updateExpressAddress,
	addExpressAddress,
	deleteExpressAddress,
	getCityParents,
	getAddressDetail
} from '../../api/addressBook';

import {
	addressFormRules,
	validPhoneComputed,
	validFixlineComputed
} from '../../utils/validate';

export default {
	data() {
		return {
			addressFormData: {
				id: "",				// 地址id
				name: "",			// 姓名
				contactNumber: "",	// 手机
				fixedLine: "",		// 固话
				companyName: "",	// 公司
				address: "",		// 地址
				detailAddress: "",	// 详细地址
				regionCode: "",		// 地址编码
				regionCodeArr: []
			},

			addressFormRules: addressFormRules,
			cityList: [],
		}
	},
	computed: {
		contactNumberRules() {	// 手机号验证);
			return validPhoneComputed
		},
		fixedLineRules() {	// 固话验证
			return validFixlineComputed
		},
		contactNumberComputed: {
			get() { return this.addressFormData.contactNumber },
			set(val) {
				this.$refs["addressForm"].clearValidate(["fixedLine", "contactNumber"])
				this.addressFormData.contactNumber = val
			}
		},
		fixedLineComputed: {
			get() { return this.addressFormData.fixedLine },
			set(val) {
				this.$refs["addressForm"].clearValidate(["fixedLine", "contactNumber"])
				this.addressFormData.fixedLine = val
			}
		}
	},
	methods: {
		// 地址限制输入
		handleInput(value, object, key) {
			if (value.length > 0) {
				this[object][key] = value.replace(/[`~!@#$%^&*_\+={}|<>?:",./;'\\[\]·~！@#￥%……&*（）——《》？：“”【】、；‘’，。、]/g, "").replace(/\s/, "")
			}
		},

		// 保存
		handleSave(formName) {
			this.$refs[formName].validate((valid) => {
				console.log(valid);
				if (valid) {
					if (this.addressFormData.id) {
						return this.updateAddress()
					}
					this.addAddress()
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		// 新增地址
		async addAddress() {
			let res = await addExpressAddress(this.addressFormData)
			console.log('新增地址', res);
			this.feedBack(res, this.addressFormData.id)
		},

		// 修改地址
		async updateAddress() {
			let res = await updateExpressAddress(this.addressFormData)
			console.log('修改地址', res);
			this.feedBack(res, this.addressFormData.id)
		},

		// 删除地址
		handleDelete() {
			this.$confirm('<p style="color:red;">确定删除地址吗？</p>',
				'操作提示', {
				dangerouslyUseHTMLString: true,
				type: 'warning'
			}).then(async () => {
				let res = await deleteExpressAddress(this.addressFormData.id)
				console.log('删除地址', res)
				this.feedBack(res, this.addressFormData.id, true)
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消操作！'
				});
			});
		},

		// 反馈
		feedBack(res, id, isDelete = false) {
			if (res.success) {
				this.$message({
					type: "success",
					message: (isDelete ? "删除" : (id ? "修改" : "新增")) + "地址成功！",
					type: "success"
				})
				this.$router.push({ name: "addressBook" })
				return
			}
			this.$message({
				type: "success",
				message: (isDelete ? "删除" : (id ? "修改" : "新增")) + "地址失败，请稍后再试！",
				type: "error"
			})
		},

		// 返回前一页
		goBack() {
			window.history.go(-1)
		},

		// 城市三级联动数据
		async getCityData() {
			let res = await getCityRegionTree()
			this.cityList = res.data[0].children
		},

		// 省市区选择
		handleChange(arr) {
			this.addressFormData.address = this.$refs.cityCascader.getCheckedNodes()[0].pathLabels.join("");
			this.addressFormData.regionCode = [...arr].pop()
		},

		// 反推城市父级
		// getCityParents(key, treeData) {
		// 	let _this = this
		// 	let arr = []; // 在递归时操作的数组
		// 	let returnArr = []; // 存放结果的数组
		// 	let depth = 0; // 定义全局层级
		// 	// 定义递归函数
		// 	function childrenEach(childrenData, depthN) {
		// 		for (var j = 0; j < childrenData.length; j++) {
		// 			depth = depthN; // 将执行的层级赋值 到 全局层级
		// 			arr[depthN] = (childrenData[j].code);
		// 			if (childrenData[j].code == key) {
		// 				returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组
		// 				console.log('结果的数组', returnArr)
		// 				_this.regionCodeArr = returnArr
		// 				break
		// 			} else {
		// 				if (childrenData[j].children) {
		// 					depth++;
		// 					childrenEach(childrenData[j].children, depth);
		// 				}
		// 			}
		// 		}
		// 		return returnArr;
		// 	}
		// 	return childrenEach(treeData, depth);
		// },

		// 获取城市父级
		async getCityParent() {
			let res = await getCityParents({ code: this.addressFormData.regionCode })
			this.$set(this.addressFormData, "regionCodeArr", res.data.slice(1,))
		},

		// 地址详情
		async getDetail() {
			let res = await getAddressDetail(this.$route.query.id)
			console.log('地址详情', res)
			Object.assign(this.addressFormData, res.data)
			this.$route.query.id && this.getCityParent()
		}
	},
	created() {
		this.getCityData()
		this.$route.query.id && this.getDetail()
	},
	watch: {
		// "addressFormData.contactNumber"() {
		// 	this.$refs["addressForm"].clearValidate(["fixedLine", "contactNumber"])
		// },
		// "addressFormData.fixedLine"() {
		// 	this.$refs["addressForm"].clearValidate(["fixedLine", "contactNumber"])
		// }
	}
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
		.form_content {
			margin-top: 30px;
			padding-left: 30px;
		}
		.form_title {
			margin-top: 30px;
			padding-left: 10px;
		}
	}
}

/deep/.el-form-item__label {
	color: #333;
}
</style>