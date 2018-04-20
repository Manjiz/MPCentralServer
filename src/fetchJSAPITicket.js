/**
 * fetchJSAPITicket
 */

const request = require('superagent')
const { WechatCache } = require('./cache')
const fetchAccessToken = require('./fetchAccessToken')

module.exports = function () {
  const apiTime = WechatCache.get('jsapiExpireTime') || 0
  const nowTime = (+new Date() / 1000) | 0
  return new Promise((resolve, reject) => {
    if (apiTime < nowTime) {
      fetchAccessToken().then((accessToken) => {
        request
          .get('https://api.weixin.qq.com/cgi-bin/ticket/getticket')
          .query({
            type: 'jsapi',
            access_token: accessToken
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
              reject(new Error(result.errmsg || '未知错误'))
              return
            }
            const ticket = result.ticket
            const expireTime = (((+new Date() / 1000)) + result.expires_in) | 0
            WechatCache.set('jsapiTicket', ticket)
            WechatCache.set('jsapiExpireTime', expireTime)
            resolve(result.ticket)
          })
      })
    } else {
      resolve(WechatCache.get('jsapiTicket'))
    }
  })
}
