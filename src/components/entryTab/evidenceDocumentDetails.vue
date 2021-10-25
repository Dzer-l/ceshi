<template>
	<div class="mian">
		<div class="info-list suspension-account-information">
			<div class="info-title" style="font-weight:bolder">存证账号信息</div>
			<div>
				<ul>
					<li>
						<span>存证账号：</span>
						<span>{{ data.evidUser.userAccount }}</span>
					</li>
					<li>
						<span>姓名：</span>
						<span>{{ data.evidUser.userName }}</span>
					</li>
					<li>
						<span>证件类型：</span>
						<span>{{ data.evidUser.cardTypeDesc }}</span>
					</li>
					<li>
						<span>证件号码：</span>
						<span>{{ data.evidUser.cardNum }}</span>
					</li>
					<li>
						<span>手机号码：</span>
						<span>{{ data.evidUser.mobile }}</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="info-list evidence-information">
			<div class="info-title" style="font-weight:bolder">证据信息</div>
			<div>
				<ul>
					<li>
						<span>保管编号：</span>
						<span>{{ data.evidence.storageNo }}</span>
					</li>
					<li>
						<span>证据编号：</span>
						<span>{{ data.evidence.evidNo }}</span>
					</li>
					<li>
						<span>证据名称：</span>
						<span>{{ data.evidence.evidName }}</span>
					</li>
					<li>
						<span>证据类型：</span>
						<span>{{ data.evidence.evidTypeDesc }}</span>
					</li>
					<li>
						<span>取证时间：</span>
						<span>{{ data.evidence.obtainTime }}</span>
					</li>
					<li>
						<span>存证时间：</span>
						<span>{{ data.evidence.finishTime }}</span>
					</li>
					<li>
						<span>证据包名称：</span>
						<span>{{ data.evidPackageInfo!==null?data.evidPackageInfo.materialName:'' }}</span>
					</li>
					<li>
						<span>证据包hash值：</span>
						<span>{{ data.evidPackageInfo!==null? data.evidPackageInfo.fileHash:'' }}</span>
					</li>
					<li v-if="data.evidMailDTO.evidStatus===10">
						<span>证据大小：</span>
						<span>{{ fileLengthComputed }} mb</span>
					</li>
					<li v-if="data.evidMailDTO.evidStatus===10">
						<span>保管期限：</span>
						<span>{{ time1[0]&&time2[0]?time1[0]+' ~ ' + time2[0]:'' }}</span>
					</li>
				</ul>
			</div>
		</div>

		<div class="info-list evidence-file">
			<div class="info-title">
				<span>证据文件</span>
				<el-row>
					<el-button :disabled="data.evidMailDTO.evidStatus!==10" type="primary" size="mini"
						@click="download(9)">保管函下载</el-button>
					<el-button :disabled="data.evidMailDTO.evidStatus!==10" type="primary" size="mini"
						@click="download(2)">证据日志下载</el-button>
					<el-button v-if="data.evidMailDTO.evidStatus!==10" type="primary" size="mini"
						@click="evidenceFileDownload">证据文件下载</el-button>
					<el-button v-if="data.evidMailDTO.evidStatus===10" type="primary" size="mini" @click="download(3)">
						证据包下载</el-button>
				</el-row>
			</div>
			<div class="table-main">
				<el-table :data="data.mailEvidMaterialDTOS" border style="width: 100%"
					:header-cell-style="{ color: '#333', background: '#e6f6fe',textAlign:'center' }">
					<el-table-column prop="materialName" label="文件名称" align="center" />
					<el-table-column prop="createTime" label="上传时间" align="center" />
					<el-table-column prop="fileHash" label="hash值" />
					<el-table-column prop="" label="加密算法" align="center">
						<template>
							<span>MD5加密</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>

	</div>
</template>

<script>
// import downloadEntryFile from '../../api/cloudMail'
export default {
	props: ['data', 'evidId'],
	data() {
		return {
			time1: '',
			time2: '',
			tableData: []
		}
	},
	created() {
		this.time1 = this.data.evidence.finishTime !== null ? /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.data.evidence.finishTime) : ''
		this.time2 = this.data.evidence.storageExpiresIn !== null ? /\d{4}-\d{1,2}-\d{1,2}/g.exec(this.data.evidence.storageExpiresIn) : ''
		console.log(this.data)
	},
	methods: {
		download(type) {
			console.log(type)
			// const fileName = type === 9 ? `电子数据保管函.png` : (type === 2 ? '证据日志.docx' : this.data.evidence.evidName + '.zip')
			const fileName = type === 9 ? `${this.data.evidence.storageNo}.png` : (type === 2 ? '证据日志.docx' : this.data.evidence.evidName + '.zip')
			if (type === 3) {
				this.$emit('staChange', true)
				return false
			}
			this.$axios(`org/downLoad-evid-file-fileType/${this.evidId}/${type}`, {}, { responseType: 'blob' }).then(blob => {
				this.saveAs(blob, fileName)
			})
		},
		saveAs(blob, fileName) {
			if (window.navigator.msSaveOrOpenBlob) {
				navigator.msSaveBlob(blob, fileName)
			} else {
				const link = document.createElement('a')
				const body = document.querySelector('body')

				link.href = window.URL.createObjectURL(blob) // 创建对象url
				link.download = fileName

				// fix Firefox
				link.style.display = 'none'
				body.appendChild(link)

				link.click()
				body.removeChild(link)

				window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
			}
		},
		evidenceFileDownload() {
			// var time = new Date()
			// console.log(this.getTime(time))
			// downloadEntryFile({
			//   orderId: this.orderId,
			//   orderEvidReIdArray: this.evidId
			// }).then((res) => {
			//   console.log(res, '00000')
			//   this.saveAs(res, `${val.evidName}.zip`)
			// })
			// for (let i = 0; i < this.data.mailEvidMaterialDTOS.length; i++) {

			// }
			console.log(this.evidId)
			this.$axios(`org/download-evid-file?evidId=${this.evidId}`, { evidId: this.evidId }, { method: 'GET', responseType: 'blob' }).then(res => {
				this.saveAs(res, `${this.data.evidence.evidNo}.zip`)
			})
		}
	},
	computed: {
		fileLengthComputed() {
			if (this.data.evidPackageInfo && this.data.evidPackageInfo.fileLength) {
				return Number(this.data.evidPackageInfo.fileLength / 1024 / 1024).toFixed(2)
			}
			return 0
		}
	},
}
</script>

<style lang="less" scoped>
ul {
	padding: 0;
	margin: 0;
	li {
		list-style: none;
	}
}
.mian {
	background: #f7f7f7;
	.info-list {
		background: #fff;
		ul {
			display: flex;
			flex-wrap: wrap;
			padding: 20px;
			li {
				width: 45%;
				line-height: 30px;
			}
		}
		.info-title {
			padding: 20px;
			border-bottom: solid 1px #ddd;
		}
	}
	.evidence-information {
		margin: 20px 0;
	}
}
.evidence-file {
	.info-title {
		font-weight: bolder;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.table-main {
		margin: 20px;
	}
	padding-bottom: 20px;
}
</style>
