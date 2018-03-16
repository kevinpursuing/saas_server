const router = require('koa-router')()
const app_router = require('./apps')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.use('/app', app_router.routes(), app_router.allowedMethods())
module.exports = router
