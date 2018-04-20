const fetchAccessToken = require('./fetchAccessToken')

const j = schedule.scheduleJob('*/50 */1 * *', function () {
  console.log('do schedule', Date.now())
  // fetchAccessToken(true)
})

module.exports = j
