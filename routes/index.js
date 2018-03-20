const router = require('koa-router')()
const app_router = require('./apps')
const cms_router = require('./cms')
const sts_router = require('./upload')
const client_router = require('./client')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.use('/api/app', app_router.routes(), app_router.allowedMethods())
router.use('/api/cms', cms_router.routes(), cms_router.allowedMethods())
router.use('/api/sts', sts_router.routes(), sts_router.allowedMethods())
router.use('/api/client', client_router.routes(), client_router.allowedMethods())
module.exports = router
