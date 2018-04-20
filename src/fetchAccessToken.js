/**
 * fetchAccessToken
 */

const request = require('superagent')
const config = require('config')
const { WechatCache } = require('./cache')

/**
 * fetchAccessToken
 * @param {boolean} refreshing 是否刷新操作
 */
module.exports = function (refreshing) {
  const tokenTime = WechatCache.get('accessTokenTime') || 0
  const nowTime = (+new Date() / 1000) | 0
  return new Promise((resolve, reject) => {
    if (refreshing || tokenTime < nowTime) {
      request
        .get('https://api.weixin.qq.com/cgi-bin/token')
        .query({
          grant_type: 'client_credential',
          appid: config.wechat.APP_ID,
          secret: config.wechat.APP_SECRET
        })
        .end((err, res) => {
          if (err) {
            reject(err)
            return
          }
          let result
          try {
            result = JSON.parse(res.text)
          } catch (err) {
            reject(err)
            return
          }
          if (result.errcode && result.errcode !== 0) {
            reject(new Error(result.errmsg) || '未知错误')
            return
          }
          const accessToken = result.access_token
          const expireTime = (((+new Date() / 1000)) + result.expires_in) | 0
          WechatCache.set('accessToken', accessToken)
          WechatCache.set('accessTokenTime', expireTime)
          resolve(accessToken)
        })
    } else {
      resolve(WechatCache.get('accessToken'))
    }
  })
}
