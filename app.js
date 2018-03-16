const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
const cookieParser = require('cookie-parser')
// log工具
const logUtil = require('./utils/log_util')
const response_formatter = require('./middlewares/response_formatter')
const index = require('./routes/index')

const koaStatic = require('koa-static')
const router = require('koa-router')()
// 静态资源目录对于相对入口文件index.js的路径
// const staticPath = '../build'

// error handler
onerror(app)


// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
// app.use(cookieParser())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  // 响应开始时间
  const start = new Date()
  // 响应间隔时间
  var ms
  try {
    // 开始进入下一个中间件
    await next()
    ms = new Date() - start;
    // 记录响应时间
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, error, ms)
  }
})

// 添加格式化处理响应结果的中间件，在添加路由之前调用
app.use(response_formatter('^/xxx'))
// routes
app.use(index.routes(), index.allowedMethods())

app.use((req, res, next) => {
  if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
    return next()
  }
  console.log('path resolve', path.resolve('build/index.html'))
  return res.sendFile(path.resolve('build/index.html'))
})
app.use(koaStatic(path.resolve('build')))
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
