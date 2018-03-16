const router = require('koa-router')()
const app_controller = require('../app/controllers/app_controller')

router.get('/deleteAll', app_controller.deleteAll)

router.get('/getApp', app_controller.getApp)

router.post('/login', app_controller.login)

router.post('/register', app_controller.registerApp)

router.get('/appList', app_controller.appList)
module.exports = router
