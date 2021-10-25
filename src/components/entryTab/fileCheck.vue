<template>
	<div class="file-check-main">
		<h2 v-if="materList.length>0">证据文件校验中...</h2>
		<div v-if="materList.length>0" class="check-list">
			<ul>
				<li v-for="(item,index) in showList" :key="index">
					<span>
						<i v-if="item.check===0" class="el-icon-loading" />
						<i v-if="item.check===1" class="el-icon-success" />
						<i v-if="item.check===2" class="el-icon-error" />
					</span>
					<span>文件：</span>
					<span style="color:#8a2ee6;margin-right:10px">{{ item.materialName }}</span>
					<span>{{ item.check===0?'校验中':'校验完成，' }}</span>
					<span v-if="item.check!==0"
						:class="item.check===1?'check-success':'check-error'">{{ item.check===1?'通过':(item.check===2?'不通过':'验证失败') }}</span>
				</li>
				<li v-if="status!==0">
					<span style="font-weight: bold;">校验结果：</span>
					<span :class="status===1?'check-success':'check-error'">{{ result }}</span>
				</li>
			</ul>
		</div>
		<div v-else class="no-list-data">
			暂无可校验的的证据文件
		</div>
	</div>
</template>

<script>
export default {
	props: ['materList', 'evidId'],
	data() {
		return {
			showList: [],
			status: 0,
			result: ''
		}
	},
	created() {
	},
	mounted() {
		setTimeout(() => {
			this.checkFile(0, this.materList)
		}, 200)
	},
	methods: {
		checkFile(val, arr) {
			// console.log(arr)
			if (arr.length === 0) {
				return false
			}
			if (val === arr.length) {
				let t = 0
				for (let i = 0; i < this.showList.length; i++) {
					if (this.showList[i].check === 1) {
						t++
					}
				}
				this.result = t === this.showList.length ? '全部文件校验通过' : (t === 0 ? '全部文件校验不通过，请联系运营人员！' : '部分文件校验不通过，请联系运营人员！')
				this.status = t === this.showList.length ? 1 : 2
				this.$emit('statusChange', this.status)
				return false
			} else {
				arr[val].check = 0
				this.showList.push(arr[val])
				const data = {
					bucketName: this.showList[val].fileBucket.bucketName,
					objectName: this.showList[val].fileBucket.objectName,
					fileHash: this.showList[val].fileHash
				}
				setTimeout(() => {
					this.$axios(`org/evid-file-check/${this.evidId}`, data, { method: 'POST' }).then(res => {
						// console.log(res)
						if (res) {
							this.showList[val].check = res.data ? 1 : 2
						} else {
							this.showList[val].check = 3
						}
						this.$forceUpdate()
						// console.log(this.showList[val].check)
						setTimeout(() => {
							this.checkFile(val + 1, this.materList)
						}, 200)
					})
				}, 200)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.file-check-main {
	ul {
		padding: 0;
		margin: 0;
		li {
			list-style: none;
		}
	}
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	h2 {
		text-align: center;
	}
	.check-list {
		width: 60%;
		ul {
			li {
				line-height: 30px;
				span {
					font-size: 16px;
				}
			}
		}
	}
}
.el-icon-success,
.check-success {
	color: #67c23a;
}

.el-icon-error,
.check-error {
	color: #f56c6c;
}
.no-list-data {
}
</style>
