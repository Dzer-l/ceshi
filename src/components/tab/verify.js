export function isvalidPhone(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/
  var regs = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  if (reg.test(str) === true || regs.test(str) === true) {
    return true
  } else {
    return false
  }
}

export function isvalidCard(str) {
  const reg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
  var regs = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (reg.test(str) === true || regs.test(str) === true) {
    return true
  } else {
    return false
  }
}
