const router = require('koa-router')()
const client_controller = require('../app/controllers/client_controller')

router.get('/getResList', client_controller.getResList)

router.get('/getRes', client_controller.getRes)

module.exports = router
