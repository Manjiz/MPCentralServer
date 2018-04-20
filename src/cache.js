const LRU = require('lru-cache')

const WechatCache = LRU({
  max: 500,
  length: n => {
    return n && n.length
  },
  maxAge: 1000 * 60 * 60
})

module.exports = {
  WechatCache
}
