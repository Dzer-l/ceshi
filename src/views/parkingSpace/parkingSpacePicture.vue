<template>
	<div class="container">
		<el-card shadow="always" :body-style="{ padding: '20px' }">
			<div class="border_box">
				<div class="title_wrapper">
					<div class="title">车位图片</div>
					<div class="button_wrapper">
						<el-button class="button" size="small" type="primary" @click="handleBack">返回</el-button>
					</div>
				</div>
				<div class="image_content">
					<div class="image_wrapper" v-for="(item,index) in materialList" :key="index"
						@click="handlePreview(item,index)">
						<img class="image" :src="item.imageUrl">
						<el-tooltip :content="item.name" placement="bottom" effect="light">
							<div class="image_label">{{ item.name }}</div>
						</el-tooltip>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
import {
	registerMaterialPreview,
} from '../../api/parkingSpace';
export default {
	data() {
		return {
			materialList: [],	// 图片id列表
		}
	},
	computed: {
		pictureList() {
			let arr = []
			for (const item of this.materialList) {
				arr.push(item.imageUrl)
			}
			return arr
		}
	},
	created() {
		this.materialList = JSON.parse(sessionStorage.getItem("parkingPlaceMaterialList"))
		this.getImage()
	},
	methods: {
		async getImage() {
			for (const item of this.materialList) {
				item.name = JSON.parse(item.materialFile).originalFilename
				this.getImageBase64(item)
			}
		},

		// 获取图片base64
		async getImageBase64(item) {
			let res = await registerMaterialPreview(item.id)
			if (res.success && res.data) {
				let imageUrl = imageBase64ToBlob('data:image/png;base64,' + res.data)
				this.$set(item, "imageUrl", imageUrl)
			}
		},

		handlePreview(image, index) {
			// this.$store.commit('app/CHANGE_IMAGE', [image.imageUrl])
			this.$store.commit('app/CHANGE_IMAGE', this.pictureList)
			this.$store.commit('app/CHANGE_INITIALINDEX', index)
		},

		// 返回
		handleBack() {
			this.$router.back()
		},
	},
	// beforeRouteEnter(to, from, next) {
	// 	if (from.name != "parkingSpacelDetail") {
	// 		location.replace(`${process.env.VUE_APP_BASE_PATH}#/parkingSpace/index`)
	// 	}
	// 	next()
	// },
	beforeRouteLeave(to, form, next) {
		sessionStorage.removeItem("parkingPlaceMaterialList")
		next()
	},
}

function imageBase64ToBlob(urlData, type = 'image/png') {
	try {
		var arr = urlData.split(',')
		var mime = arr[0].match(/:(.*?);/)[1] || type;
		var bytes = window.atob(arr[1]);
		var ab = new ArrayBuffer(bytes.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < bytes.length; i++) {
			ia[i] = bytes.charCodeAt(i);
		}
		return URL.createObjectURL(new Blob([ab], { type: mime }))
	}
	catch (e) {
		return ""
	}
}
</script>

<style lang="less" scoped>
/deep/ .el-card {
	min-height: calc(100vh - 100px);
}
.container {
	padding: 20px;
}
.image_content {
	margin-top: 20px;
	display: flex;
	flex-wrap: wrap;
	padding: 0 20px 20px 20px;

	.image_wrapper {
		width: 120px;
		height: 170px;
		border-radius: 3px;
		overflow: hidden;
		margin-right: 16px;

		.image {
			border: 1px dashed #ddd;
			border-radius: 4px;
			width: 120px;
			height: 120px;
			// background: #eee;
			cursor: pointer;
		}
		.image_label {
			cursor: pointer;
			overflow: hidden;
			text-overflow: ellipsis;
			width: 120px;
			padding: 0 5px;
			font-size: 14px;
			white-space: nowrap;
		}
	}
}
.border_box {
	border: 1px solid #eee;
	border-radius: 4px;
}
.title_wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	line-height: 45px;
	// background: #f2f2f2;
	background: #e6f6fe;
	border-radius: 4px 4px 0 0;
	border-bottom: 1px solid #eee;

	.title {
		font-weight: 650;
		font-size: 16px;
		padding-left: 10px;
	}

	.button_wrapper {
		padding-right: 20px;
	}
}
.button {
	width: 80px;
}
</style>