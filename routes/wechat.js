const router = require('koa-router')()
const wechat_controller = require('../app/controllers/wechat_controller')

router.get('/signature', wechat_controller.signature)

router.get('/getAccessToken', wechat_controller.getAccessToken)

router.get('/getUserInfo', wechat_controller.getUserInfo)

module.exports = router