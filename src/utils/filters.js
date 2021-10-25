
// 物流状态
export function filterExpressStatus(val) {
	const status = {
		2: "待揽收",
		3: "运送中",
		4: "已签收",
		5: "已取消"
	}
	if (status[val]) return status[val]
	return "-"
};

// 取件方式
export function filterExpressMethod(val) {
	const status = {
		0: "固定地址揽收",
		1: "预约上门揽收",
	}
	if (status[val]) return status[val]
	return "-"
}

// 运费支付方式
export function filterPayMethod(val) {
	const status = {
		1: "寄付月结",
		2: "到付",
		4: "寄付现结",
	}
	if (status[val]) return status[val]
	return ""
}

// SF运费支付方式
export function filterPayMethodSF(val) {
	const status = {
		1: "寄付现结",
		2: "到付",
		3: "寄付月结",
	}
	if (status[val]) return status[val]
	return ""
}

export function filterExpressCompany(val) {
	const status = {
		shunfeng: "顺丰速运",
		ems: "中国邮政",
	}
	if (status[val]) return status[val]
	return ""
};

// 物品类型
export function filterPackageCategory(val) {
	const status = {
		0: "文件",
		ems: "中国邮政",
	}
	if (status[val]) return status[val]
	return ""
};

// 当事人信息
export function filterProposerType(val) {
	const status = {
		0: "申请人",
		1: "委托人",
		2: "公证员",
		3: "原公众号个人主体",
		4: "原公众号企业主体",
		5: "目标公众号企业主体",
		6: "原公众号管理员",
		7: "目标公众号管理员",
		8: "原公众号委托人",
		9: "目标公众号委托人",
		10: "受让人",
		11: "代理人",
		12: "立遗嘱人",
		13: "主办律师",
		14: "协办律师",
		15: "当事人",
		16: "领证人"
	}
	if (status[val]) return status[val]
	return "-"
};


export function filterRegisterStatus(val) {
	const status = {
		0: "审核中",
		1: "登记成功",
		2: "已拒绝",
		3: "已撤销",
	}
	return status[val]
};

export function filterGender(val) {
	const status = {
		1: "男",
		2: "女",
	}
	return status[val]
};

export function filterBusinessUserType(val) {
	const status = {
		0: "主账号",
		1: "子账号",
	}
	return status[val]
};

export function filterUserType(val) {
	const status = {
		1: "个人用户",
		2: "企业用户",
	}
	return status[val]
};

export function filterIsRealName(val) {
	const status = {
		0: "未实名",
		1: "已实名",
	}
	return status[val]
};

export function filterNotaryPaperType(val) {
	const status = {
		100: "初始合同",
		800: "最终合同",
		997: "公证书模板",
		998: "公证书",
	}
	if (val) {
		return status[val]
	}
	return "-"
};

export function filterAuditStatus(val) {
	const status = {
		0: "未审核",
		1: "审核通过",
		2: "审核不通过",
	}
	if (status[val]) {
		return status[val]
	}
	return "-"
};

export function filterPaymentMethod(val) {
	const type = {
		1: "一次性付款",
		2: "分期付款"
	}
	return type[val]
}



// export function filterNotaryProdCode(val) {
// 	const status = {
// 		"1001": "房产委托",
// 		"1002": "商标转让",
// 		"1003": "公众号迁移",
// 		"yzdl": "遗嘱订立",
// 		"rfcw": "人防车位",
// 		"shjrqypt": "社会金融签约平台",
// 		"xxfz": "线下发证",
// 		"wyjj": "我要寄件",
// 		"zjsdcz": "自寄送达存证",
// 		"gzyjsdcz": "公证邮寄送达存证",
// 		"ysf": "一手房",
// 	}
// 	if (Object.hasOwnProperty.call(status, val)) {
// 		return status[val]
// 	}
// 	return "-"
// };
