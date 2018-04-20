const crypto = require('crypto')

/**
 * 生成随机字符串
 */
exports.createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * SHA1加密
 * @param {string} str 要加密的文本
 */
exports.SHA1 = function (str) {
  return crypto.createHash('sha1').update(str).digest('hex')
}
