const router = require('koa-router')()
const crypto = require('crypto') //引入加密模块
config = require('../config/config.json');//引入配置文件

router.get('/signature', async (ctx, next) => {
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = ctx.request.query.signature,//微信加密签名
        timestamp = ctx.request.query.timestamp,//时间戳
        nonce = ctx.request.query.nonce,//随机数
        echostr = ctx.request.query.echostr;//随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [config.token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密
    console.log(resultCode)
    console.log(timestamp)
    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        console.log('成功')
        ctx.body = echostr
    } else {
        ctx.body = 'dismatch'
    }
}

)

module.exports = router