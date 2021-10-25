// const LOC_URL = window.location.host;

module.exports = {
  http: process.env.VUE_APP_BASE_PATH,
  wssUrl: process.env.VUE_APP_BASE_WSS,
  httpCfg: { // axios基础配置
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'timeout': 10000
    },
    data: {},
    params: {}
  },
  orgId: 0, // 0 坪山 1 市处
  reg: { // 正则判断
    idCard: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, // 身份证正则
    xydm: /^[a-zA-Z0-9]{1,}$/, // 统一社会信用代码
    tel: /^[1][3,4,5,7,8][0-9]{9}$/, // 手机号
    hkTel: /^(5|6|8|9)\\d{7}$/, // 香港手机号
    Num: /^[0-9]{4,20}$/, // 4-20个数字
    CN: /^[\u4e00-\u9fa5]+$/, // 是否为中文
    comTel: /^\d{3,5}-?\d{7,8}$/ // 固话
  },
  tokenList: ['auth/oauth/token', 'auth/oauth/logout', 'rsa-public-key', 'code'],
  fileAPIList: ['org/order-document-file', 'org/single-file-upload', 'org/order-document', 'org/uploadFile', 'org/acceptance-order-document', 'org/uploadFile', 'auth/oauth/token', 'org/org-carousel-upload', 'org/org-production-reference-template', 'org/org-home-page-conf-upload', 'org/sign-send-file-upload', 'org/batch-send-file-upload', 'org/upload-seal-file', 'org/single-file-upload-remote', 'org/ocr-id-card'],
  notLoading: ['org/org-production-reference-template-preview', 'org/order-proposer-material-preview-word-img', 'org/order-proposer-material-preview-img', 'org/order-document-preview-img'],
  orgCfg: { // 公证处配置
    0: {}
  }
}
