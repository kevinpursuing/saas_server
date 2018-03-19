const router = require('koa-router')()
const app_router = require('./apps')
const cms_router = require('./cms')
const sts_router = require('./upload')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.use('/app', app_router.routes(), app_router.allowedMethods())
router.use('/cms', cms_router.routes(), cms_router.allowedMethods())
router.use('/sts', sts_router.routes(), sts_router.allowedMethods())
module.exports = router
