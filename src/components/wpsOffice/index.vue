<template>
	<div id="viewFile" class="wps_mount_point"></div>
</template>
<script>
export default {
	props: ['wpsUrl', 'token'],
	data() {
		return {
			// 是否开启简易模式
			mode: "normal",		// wps模式 normal正常  simple极简模式
			wpsObject: null,
		}
	},
	mounted() {
		this.openWps(this.wpsUrl, this.token);
	},
	methods: {
		async openWps(url, token) {
			let _this = this;
			const wps = _this.wps.config({
				mode: this.mode,
				mount: document.querySelector('.wps_mount_point'),
				wpsUrl: url,
			});
			wps.setToken({ token });
			wps.on("error", this.onError)
			wps.on("fileOpen", this.onFileOpen)
			wps.on("fileStatus", this.onFileStatus)
			this.wpsObject = wps
			await wps.ready();
			let wpsApp = wps.Application;
			let wpsIframe = await wps.iframe
			// let wpsUrl = await wps.url;
			// console.log([wpsIframe], wpsUrl,'*****');
			this.$emit("wpsAppObject", wpsApp)
			this.$emit("wpsIframe", wpsIframe)
			// 选区后插入文本
			// await app.ActiveDocument.ActiveWindow.Selection.InsertAfter('Textzhangsan');
		},

		// 错误回调
		onError(err) {
			console.log(err, "err");
			this.$emit("error", err)
		},

		// 文档打开回调
		onFileOpen(data) {
			console.log("文件打开");
		},

		// 文档修改回调
		onFileStatus(status) {
			// console.log("文件修改");
			this.$emit("fileUpdate", status)
		},
	},
	watch: {
		wpsUrl(value) {
			this.wpsObject && this.wpsObject.destroy()	// 将上一个实例销毁生成新的实例
			this.openWps(this.wpsUrl, this.token);
		}
	},
	beforeDestroy() {
		this.wpsObject.destroy()
	},
}
</script>
<style lang="less" scoped>
.wps_mount_point {
	height: 800px;
	// min-height: 600px;
	// height: calc(100vh - 250px);
}
</style>