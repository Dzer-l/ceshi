function isvalidPhone(str) {
  var regs = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  if (regs.test(str) === true) {
    return true
  } else {
    return false
  }
}

function isvalidCard(str) {
  const reg = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
  var regs = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (reg.test(str) === true || regs.test(str) === true) {
    return true
  } else {
    return false
  }
}
export {
  isvalidPhone,
  isvalidCard
}
