import { Message } from 'element-ui';
import { filterCardType } from '../filters/index';

export async function printInit(detail, address) {
	var iframe = document.createElement('IFRAME')
	iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
	iframe.setAttribute('id', 'mailiframe')
	document.body.appendChild(iframe)
	var doc = iframe.contentWindow.document
	return new Promise((resolve, reject) => {
		if (detail && address) {
			doc.write(`
				<html>
				<head>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
					<meta http-equiv="Content-Style-Type" content="text/css">
					<title>订单信息</title>
					<style>
						* {margin: 0;padding: 0;box-sizing: border-box;}
						body {font-family: 黑体;color: #000000;font-size: 12pt;}
						td {border-color: #CCCCCC;border: 1px solid;padding: 6pt 20pt 6pt 5pt;width: 150pt;word-break: break-all;word-wrap: break-word;}
						td:nth-child(2) {width: 380pt;}
						.title {font-size: 16pt;font-weight: bold;line-height: 20pt;}
					</style>
				</head>

				<body>
					<table border style="border-collapse: collapse;">
						<tr class="title">
							<td colspan='2'><h3>订单信息</h3></td>
						</tr>
						<tr>
							<td>邮寄编号</td>
							<td>${detail.expressNum || ""}</td>
						</tr>
						<tr>
							<td>卷宗号</td>
							<td>${detail.dossierNum || ""}</td>
						</tr>
						<tr>
							<td>姓名</td>
							<td>${detail.applicantName || ""}</td>
						</tr>
						<tr>
							<td>证件类型</td>
							<td>${filterCardType(detail.cardType) || ""}</td>
						</tr>
						<tr>
							<td>证件号码</td>
							<td>${detail.cardNum || ""}</td>
						</tr>
						<tr class="title">
							<td colspan='2'><h3>收件地址信息</h3></td>
						</tr>
						<tr>
							<td>姓名</td>
							<td>${address.receiveName || ""}</td>
						</tr>
						<tr>
							<td>手机号码</td>
							<td>${address.receiveMobile || ""}</td>
						</tr>
						<tr>
							<td>固话号码</td>
							<td>${address.receiveFixedLine || ""}</td>
						</tr>
						<tr>
							<td>公司名称</td>
							<td>${address.receiveCompany || ""}</td>
						</tr>
						<tr>
							<td>地址</td>
							<td>${(address.receiveAddress + address.receiveDetailAddress) || ""}</td>
						</tr>
					</table>
				</body>
				</html>
			`)
			doc.close()
			resolve(true)
		} else {
			Message.error("信息缺失，请确认后再试！")
			reject(false)
		}
	})
}

export function print() {
	var iframe = document.getElementById("mailiframe")
	iframe.contentWindow.focus()
	iframe.contentWindow.print()
	setTimeout(() => {
		iframe.parentNode.removeChild(iframe)
	}, 2000);
}