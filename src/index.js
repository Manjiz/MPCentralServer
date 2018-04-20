const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const config = require('config')
// require('./schedule')
const fetchAccessToken = require('./fetchAccessToken')
const fetchJSAPITicket = require('./fetchJSAPITicket')
const { createNonceStr, SHA1 } = require('./utils')

// 定时任务，每1小时59分钟刷新token
fetchAccessToken(true)
setInterval(function () {
  fetchAccessToken(true)
}, 7140000)

const app = new Koa()
const router = new Router()

/**
 * 中间件：白名单校验
 */
const whiteListCheck = (ctx, next) => {
  const whiteList = config.whiteList || []
  const hostname = ctx.hostname
  const ip = ctx.ip
  if (whiteList.indexOf(hostname) < 0 && whiteList.indexOf(ip) < 0) {
    ctx.status = 403
    return
  }
  next()
}

app
  .use(router.allowedMethods())
  .use(cors())

router.get('/', (ctx, next) => {
  ctx.body = 'Hello MP Developer'
})

router.get('/token', whiteListCheck, (ctx, next) => {
  fetchAccessToken().then((token) => {
    ctx.body = {
      code: 0,
      token
    }
  }).catch((err) => {
    ctx.body = {
      code: 1,
      err
    }
  })
})

router.get('/signature', whiteListCheck, (ctx, next) => {
  const { url } = ctx.query
  const timestamp = (new Date().getTime() / 1000) | 0
  const nonceStr = createNonceStr()
  fetchJSAPITicket().then((ticket) => {
    ctx.body = {
      code: 0,
      data: {
        signature: SHA1(`jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${originUrl}`),
        timestamp,
        nonceStr,
        appId: config.wechat.APP_ID
      }
    }
  }).catch((err) => {
    ctx.body = {
      code: 1,
      err
    }
  })
})

app.use(router.routes())

app.listen(config.port)
