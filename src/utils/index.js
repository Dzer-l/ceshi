import { Message } from 'element-ui'
import forge from 'node-forge'
import Layout from '@/layout'
import { axios } from './axios'
import router from '../router/index'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string')) {
			if ((/^[0-9]+$/.test(time))) {
				// support "1548221490638"
				time = parseInt(time)
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}

		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		return value.toString().padStart(2, '0')
	})
	return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
	if (('' + time).length === 10) {
		time = parseInt(time) * 1000
	} else {
		time = +time
	}
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return `${d.getMonth() + 1}月${d.getDate()}日${d.getHours()}时${d.getMinutes()}分`
	}
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
	if (!search) {
		return {}
	}
	const obj = {}
	const searchArr = search.split('&')
	searchArr.forEach(v => {
		const index = v.indexOf('=')
		if (index !== -1) {
			const name = v.substring(0, index)
			const val = v.substring(index + 1, v.length)
			obj[name] = val
		}
	})
	return obj
}

/**
 * el-msg
 * @param {string} msg
 * @param {string} type
 */

export function msg(msg, type) {
	Message({
		message: msg,
		type: type || 'info',
		duration: 2000
	})
}

export function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

/**
 * 获取uuid
 */
export function getUuid() {
	return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}`
}

/**
 * 密码ras -> base64加密
 * @param {string} str 要加密的内容
 * @param {string} pubKey 密钥
 */
export function rasEncrypt(str, pubKey) {
	const publicK = forge.pki.publicKeyFromPem(
		'-----BEGIN PUBLIC KEY-----\n' + pubKey + '\n-----END PUBLIC KEY-----'
	)
	return forge.util.encode64(publicK.encrypt(str))
}

/**
 * base64加密
 * @param {string} str 要加密的内容
 */
export function base64(str) {
	return forge.util.encode64(str)
}

/**
 * 转换menu树
 * @param {string} str 要加密的内容
 */

export function getMenuTree(data, arr) {
	if (data) {
		for (const i of data) {
			let ch = []
			if (i.children && i.children.length !== 0) {
				ch = getMenuTree(i.children, [])
			}
			const data = {}
			const index = i.path.lastIndexOf('/') + 1
			data.url = i.path
			data.name = `${i.pathName}`
			if (i.path.indexOf('http://') !== -1 || i.path.indexOf('https://') !== -1) {
				data.path = i.path
				data.component = i.parentId === '0' ? Layout : (resolve) => require([`@/views/open/index.vue`], resolve)
			} else {
				data.path = `${index > 1 ? i.path.substring(index, i.path.length) : i.path}`
				data.component = i.parentId === '0' ? Layout : (resolve) => require([`@/views${i.path}.vue`], resolve)
			}
			if (i.parentId === '0') {
				data.redirect = `${i.path}/index`
				data.alwaysShow = true
			}
			data.hidden = !!i.hidden
			data.externalLinkFlag = !!i.externalLinkFlag
			data.currentWindowFlag = !!i.currentWindowFlag
			data.meta = { title: i.name, icon: i.icon ? i.icon : 'el-icon-s-order' }
			if (ch && ch.length > 0) {
				data.children = ch
			}
			arr.push(data)
		}
		return arr
	} else {
		return []
	}
}

// 获取文件流本地下载
export function blobFile(blob, fileName) {
	if (window.navigator.msSaveOrOpenBlob) {
		navigator.msSaveBlob(blob, fileName)
	} else {
		const link = document.createElement('a')
		const body = document.querySelector('body')
		// link.setAttribute('target', 'view_window')
		link.href = window.URL.createObjectURL(blob) // 创建对象url
		link.download = fileName
		// fix Firefox
		link.style.display = 'none'
		body.appendChild(link)
		link.click()
		body.removeChild(link)
		window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
	}
}

export function replaceInstrument(orderId) {
	axios(`org/get-certifying-confirm-info/${orderId}`, {}, { method: 'GET' }).then(res => {
		console.log(res, '-------------文本替换的信息--------------------')
		// var proCode=res.data.orderInfo.prodCode
		let appliData, agencyData
		for (let index = 0; index < res.data.orderProposerInfo.length; index++) {
			if (parseInt(res.data.orderProposerInfo[index].proposerType) === 0) {
				appliData = res.data.orderProposerInfo[index]
			} else if (parseInt(res.data.orderProposerInfo[index].proposerType) === 11) {
				agencyData = res.data.orderProposerInfo[index]
			}
		}
		
		axios(`org/order-proposer-material-all-proposer/${orderId}`, {}, { method: 'GET' }).then(p => {
			console.log(p, '材料信息--------------------')

			let str = ''
			for (let index = 0; index < p.data.length; index++) {
				for (let i = 0; i < p.data[index].mailOrderMaterialTypeVOS.length; i++) {
					str += p.data[index].mailOrderMaterialTypeVOS[i].materialName + '，'
				}
			}

			var transferData = {
				orderId: orderId,
				proCode: res.data.orderInfo.prodCode,
				templateType: 0,
				json: {
					公证书份数: res.data.orderInfo.prodCode !== 'yzdl' ? (res.data.orderInfo.prodCode === 'ysf' ? '-' : res.data.offlineReceive.notaryNum) : (res.data.orderInfo.obtainCertType === 1 ? res.data.orderExpressSendDTOS.notaryNum : res.data.offlineReceive.notaryNum),
					领取方式: res.data.orderInfo.obtainCertType === 1 ? '邮寄送达 ' : res.data.orderInfo.obtainCertType === null ? '电子公证书' : '线下领取',
					公证书领取方式: res.data.orderInfo.obtainCertType === 1 ? '邮寄送达 ' : res.data.orderInfo.obtainCertType === null ? '电子公证书' : '线下领取',
					证明材料: str.replace(/，$/gi, ''),
					领证人姓名: res.data.orderInfo.prodCode !== 'yzdl' ? (res.data.orderInfo.prodCode === 'ysf' ? '-' : res.data.offlineReceive.receiveName) : res.data.orderCertifier.name,
					领证人证件号: res.data.orderInfo.prodCode !== 'yzdl' ? (res.data.orderInfo.prodCode === 'ysf' ? '-' : res.data.offlineReceive.cardNum) : res.data.orderCertifier.cardNumber,
					领证人电话: res.data.orderInfo.prodCode !== 'yzdl' ? (res.data.orderInfo.prodCode === 'ysf' ? '-' : res.data.offlineReceive.mobile) : res.data.orderCertifier.mobile,
					合计: res.data.orderInfo.totalCost,
					收件人地址: res.data.orderExpressSendDTOS
						? res.data.orderExpressSendDTOS.receiveAddress +
						res.data.orderExpressSendDTOS.receiveDetailAddress
						: '',
					公证员: res.data.orderDossier ? res.data.orderDossier.notaryUserName : '',
					公证员助理: res.data.orderDossier ? res.data.orderDossier.assistantUserName : '',
					卷宗号: res.data.orderInfo.dossierNum,
					日期: res.data.orderInfo.obtainCertType === 2 ? res.data.offlineReceive.receiveTime : '',
					收件人姓名: res.data.orderInfo.obtainCertType === 1 ? res.data.orderExpressSendDTOS.applicantName : '',
					收件人联系方式: res.data.orderInfo.obtainCertType === 1 ? (res.data.orderExpressSendDTOS.receiveMobile ? res.data.orderExpressSendDTOS.receiveMobile : res.data.orderExpressSendDTOS.receiveFixedLine) : '',
					applicationPeople: []
				}
			}

			function typeFilter(val) {
				let str = ''
				switch (true) {
					case parseInt(val) === 111:
						str = '居民身份证'
						return str
					case parseInt(val) === 130:
						str = '港澳居民居住证'
						return str
					case parseInt(val) === 131:
						str = '台湾居民居住证'
						return str
					case parseInt(val) === 118:
						str = '港澳居民来往内地通行证'
						return str
					case parseInt(val) === 132:
						str = '中国护照'
						return str
					case parseInt(val) === 126:
						str = '营业执照'
						return str
					case parseInt(val) === 127:
						str = '注册证书'
						return str
					default:
						return val
				}
			}

			if (res.data.orderInfo.bidType === 2) {
				var array = res.data.orderProposerInfo
				var fu = {}; var tu = {}
				for (let index = 0; index < array.length; index++) {
					if (parseInt(array[index].proposerType) === 0) {
						fu = array[index]
						const ap = {
							name: fu.realName,
							cardType: typeFilter(fu.cardType),
							cardNum: fu.cardNum,
							birthDay: fu.birthday,
							sex: parseInt(fu.gender) === 1 ? '男' : '女',
							mobile: fu.mobile,
							address: fu.detailAddress,
							organizationMobile: fu.organizationPhone,
							organizationCardNum: fu.organizationCardNum,
							organizationName: fu.organizationName,
							artificialPersonName: fu.realName,
							artificialPersonCardNum: fu.cardNum,
							artificialPersonBirthDay: fu.birthday,
							artificialPersonSex: parseInt(fu.gender) === 1 ? '男' : '女'
						}
						transferData.json.applicationPeople.push(ap)
						transferData.json.pyPeople = [{
							name: res.data.orderProposerInfo[0].realName,
							cardType: typeFilter(res.data.orderProposerInfo[0].cardType),
							cardNum: res.data.orderProposerInfo[0].cardNum,
							birthDay: res.data.orderProposerInfo[0].birthday,
							sex: parseInt(res.data.orderProposerInfo[0].gender) === 1 ? '男' : '女',
							mobile: res.data.orderProposerInfo[0].mobile,
							address: res.data.orderProposerInfo[0].detailAddress
						}]
						transferData.json.psOrganization = [{
							organizationMobile: appliData.organizationPhone,
							organizationCardNum: appliData.organizationCardNum,
							organizationName: appliData.organizationName,
							artificialPersonName: appliData.realName,
							artificialPersonCardNum: appliData.cardNum,
							artificialPersonBirthDay: appliData.birthday,
							artificialPersonSex: parseInt(appliData.gender) === 1 ? '男' : '女'
						}]
					} else if (parseInt(array[index].proposerType) === 11) {
						tu = array[index]
						transferData.json.applicationPeople = [{
							name: tu.realName,
							cardType: typeFilter(tu.cardType),
							cardNum: tu.cardNum,
							birthDay: tu.birthday,
							sex: parseInt(tu.gender) === 1 ? '男' : '女',
							mobile: tu.mobile,
							address: tu.detailAddress,
							organizationMobile: fu.organizationPhone,
							organizationCardNum: fu.organizationCardNum,
							organizationName: fu.organizationName,
							artificialPersonName: fu.realName,
							artificialPersonCardNum: fu.cardNum,
							artificialPersonBirthDay: fu.birthday,
							artificialPersonSex: parseInt(fu.gender) === 1 ? '男' : '女'
						}]
						transferData.json.pyPeople = [{
							name: agencyData.realName,
							cardType: typeFilter(agencyData.cardType),
							cardNum: agencyData.cardNum,
							birthDay: agencyData.birthday,
							sex: parseInt(agencyData.gender) === 1 ? '男' : '女',
							mobile: agencyData.mobile,
							address: agencyData.detailAddress
						}]
						transferData.json.psOrganization = [{
							organizationMobile: appliData.organizationPhone,
							organizationCardNum: appliData.organizationCardNum,
							organizationName: appliData.organizationName,
							artificialPersonName: appliData.realName,
							artificialPersonCardNum: appliData.cardNum,
							artificialPersonBirthDay: appliData.birthday,
							artificialPersonSex: parseInt(appliData.gender) === 1 ? '男' : '女'
						}]
					}
				}
			} else {
				transferData.json.psPeople = []
				for (let index = 0; index < res.data.orderProposerInfo.length; index++) {
					var gu = {
						name: res.data.orderProposerInfo[index].realName,
						cardType: typeFilter(res.data.orderProposerInfo[index].cardType),
						cardNum: res.data.orderProposerInfo[index].cardNum,
						birthDay: res.data.orderProposerInfo[index].birthday,
						sex: parseInt(res.data.orderProposerInfo[index].gender) === 1 ? '男' : '女',
						mobile: res.data.orderProposerInfo[index].mobile,
						address: res.data.orderProposerInfo[index].detailAddress
					}
					transferData.json.applicationPeople.push(gu)
					const psobj = {
						name: res.data.orderProposerInfo[index].realName,
						cardType: typeFilter(res.data.orderProposerInfo[index].cardType),
						cardNum: res.data.orderProposerInfo[index].cardNum,
						birthDay: res.data.orderProposerInfo[index].birthday,
						sex: parseInt(res.data.orderProposerInfo[index].gender) === 1 ? '男' : '女',
						mobile: res.data.orderProposerInfo[index].mobile,
						address: res.data.orderProposerInfo[index].detailAddress
					}
					transferData.json.psPeople.push(psobj)
				}
			}

			const peArr = []
			if (res.data.orderInfo.prodCode === 'yzdl') {
				for (let index = 0; index < res.data.orderProposerInfo.length; index++) {
					if (res.data.orderProposerInfo[index].roleCode === 'lyzr') {
						const reobj = {
							name: res.data.orderProposerInfo[index].realName,
							sex: parseInt(res.data.orderProposerInfo[index].gender) === 1 ? '男' : '女',
							cardNum: res.data.orderProposerInfo[index].cardNum,
							birthDay: res.data.orderProposerInfo[index].birthday
						}
						peArr.push(reobj)
					}
				}
				transferData.json.testator = [peArr[0]]
			}
			const v = JSON.parse(JSON.stringify(transferData))
			console.log(v)
			transferData.json = JSON.stringify(transferData.json)

			axios(`org/replace-variable`, transferData, { method: 'POST' }).then(async data => {
				console.log(data, transferData, '-------------文本替换成功的信息--------------------')
				let suc = false
				if (res.data.orderInfo.prodCode === 'yzdl' && peArr.length === 2) {
					v.type = 1
					v.json.testator = [peArr[1]]
					v.json = JSON.stringify(v.json)
					v.isDelete = 0
					const reVer = await axios(`org/replace-variable`, v, { method: 'POST' })
					suc = reVer.success
				} else {
					suc = true
				}
				if (suc) {
					router.go(0)
				}
			})
		})
	})
}
