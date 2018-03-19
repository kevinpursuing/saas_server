const router = require('koa-router')()
const cms_controller = require('../app/controllers/cms_controller')

router.post('/createRes', cms_controller.createRes)

router.get('/getResList', cms_controller.getResList)

router.get('/getResInfo', cms_controller.getResInfo)

module.exports = router
