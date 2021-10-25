/**
 *
 * @param {*} val 证件类型code
 * @returns 证件类型描述
 */
export function filterCardType(val) {
  const type = {
    111: '居民身份证',
    112: '临时居民身份证',
    113: '户口簿',
    114: '中国人民解放军军官证',
    115: '护照',
    116: '香港居民身份证',
    117: '澳门居民身份证',
    118: '港澳居民来往内地通行证',
    119: '台湾居民来往内地通行证',
    121: '营业执照注册号',
    122: '机构组织代码',
    123: '士兵证',
    124: '台湾居民身份证',
    125: '律师证',
    126: '统一社会信用代码',
    127: '企业注册编码',
    128: '驾驶证',
    130: '港澳居民居住证',
    131: '台湾居民居住证',
    132: '普通护照（中国）',
    133: '外国护照',
    '000': '其他'
  }
  if (type[val]) return type[val]
  return ''
}

/**
 *
 * @param {*} val 订单状态
 * @returns  订单状态描述
 */
export function filterOrderState(val) {
  const orderState = {
    1: '待提交',
    101: '待支付',
    102: '待签署',
    103: '待视频',
    104: '待拟合同',
    105: '待录制',
    2: '受理中',
    201: '待审核',
    202: '需补材料',
    3: '出证',
    301: '制证中',
    302: '待邮寄',
    303: '待预约',
    304: '已邮寄',
    305: '已预约',
    306: '已完成',
    307: '已取消',
    401: '拒绝受理',
    402: '已终止',
    403: '已撤销',
    404: '已删除'
  }

  if (orderState[val]) return orderState[val]
  return val
}
