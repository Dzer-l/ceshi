/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 手机号
// export function validPhone(rule, value, callback) {
//   if (value) {
//     let reg = /^[1][3-9][0-9]{9}$/
//     if (!reg.test(value)) {
//       callback(new Error('请输入正确的手机号'));
//     }
//     callback()

//   }
//   callback()
// }

// 手机/固话二选一
export function validPhoneComputed(mobile, fixline) {
  if (!mobile && !fixline) {
    return [{ required: true, message: '手机号码与固话必填一个', trigger: 'blur' }]
  }

  if ((mobile && !fixline) || (mobile && fixline)) {
    return [{ pattern: /^[1][3-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }]
  }
  return []
};

export function validFixlineComputed(fixline, mobile) {
  if (!mobile && !fixline) {
    return [{ required: true, message: '手机号码与固话必填一个', trigger: 'blur' }]
  }

  if ((fixline && !mobile) || (mobile && fixline)) {
    return [{ pattern: /^\d{3,5}-?\d{7,8}$/, message: '请输入正确的固话号码', trigger: 'blur' }]
  }
  return []
};

// 详细地址
export function validDetailAddress(rule, value, callback) {
  let reg = /[`~!@#$%^&*_\+={}|<>?:",./;'\\[\]·~！@#￥%……&*（）——《》？：“”【】、；‘’，。、]/g;
  if (reg.test(value)) {
    callback(new Error('详细地址需输入5-120个字，非法字符只支持- ()'));
  }
  callback()
}


// 地址簿校验
export const addressFormRules = {
  name: [
    { required: true, message: '需输入2-30个字', trigger: 'blur' },
    { min: 2, max: 30, message: '需输入2-30个字', trigger: 'blur' }
  ],
  // contactNumber: [
  //   { validator: validPhone, trigger: 'blur' }
  // ],
  // fixedLine: [
  //   { min: 0, max: 20, message: '请输入正确的固话号码', trigger: 'blur' }
  // ],
  companyName: [
    { min: 0, max: 35, message: '最多可输入35个字', trigger: 'blur' }
  ],
  regionCodeArr: [
    { required: true, message: '请选择省市区（县）', trigger: 'change' }
  ],
  detailAddress: [
    { required: true, message: '详细地址需输入5-120个字，非法字符只支持- ()', trigger: 'blur' },
    { min: 5, max: 120, message: '详细地址需输入5-120个字，非法字符只支持- ()', trigger: 'blur' },
    { validator: validDetailAddress, trigger: 'blur' }
    // { pattern: /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, message: '详细地址需输入5-120个字，非法字符只支持- ()', trigger: 'blur' }
  ],
}

export const receiverImproveFormRules = {
  receiveName: [
    { required: true, message: '需输入2-30个字', trigger: 'blur' },
    { min: 2, max: 30, message: '需输入2-30个字', trigger: 'blur' }
  ],
  // receiveMobile: [
  //   { validator: validPhone, trigger: 'blur' }
  // ],
  // receiveFixedLine: [
  //   { min: 0, max: 20, message: '请输入正确的固话号码', trigger: 'blur' }
  // ],
  receiveCompany: [
    { min: 0, max: 35, message: '最多可输入35个字', trigger: 'blur' }
  ],
  receiveRegionCodeArr: [
    { required: true, message: '请选择省市区（县）', trigger: 'change' }
  ],
  receiveDetailAddress: [
    { required: true, message: '详细地址需输入5-120个字，非法字符只支持- ()', trigger: 'blur' },
    { min: 5, max: 120, message: '详细地址需输入5-120个字，非法字符只支持- ()', trigger: 'blur' },
    { validator: validDetailAddress, trigger: 'blur' }
  ],
}

export const getLicenseFormRules = {
  receiveAddress: [
    { required: true, message: '请选择领证地点', trigger: 'blur' }
  ],
  receiveTime: [
    { required: true, message: '请选择领证时间', trigger: 'blur' }
  ],
  receiveNumber: [
    { required: true, message: '请填写领证号', trigger: 'blur' }
  ],
}

export const expressInfoFormRules = {
  expressCompany: [
    { required: true, message: '请选择快递公司', trigger: 'change' },
  ],
  expressMethod: [
    { required: true, message: '请选择取件方式', trigger: 'change' },
  ],
  selectTime: [
    { required: true, message: '请选择预约上门时间', trigger: 'change' }
  ],
  payMethod: [
    { required: true, message: '请选择运费支付方式', trigger: 'change' }
  ],
  packageCategory: [
    { required: true, message: '请选择选择物品类型', trigger: 'change' }
  ],
  remark: [
    { required: true, message: '请输入文件名称或文件内容的简述', trigger: 'blur' },
  ],
}
