// md5加密
const utility = require('utility')

const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const model = require('../../model')
const App = model.getModel('app')  //连接app表
const _filter = { 'pwd': 0, '__v': 0 }
// 二次加密
function md5Pwd(pwd) {
    const salt = 'jserk_3957qwWe.sxf@#$'
    return utility.md5(utility.md5(pwd + salt))
}
// 生成店铺id
function creatAppId(len) {
    len = len || 16;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var appId = 'app';
    for (i = 0; i < len; i++) {
        appId += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return appId;
}

//删除所有客户
exports.deleteAll = async (ctx, next) => {
    var res = await App.remove();
    console.log(res);
    ctx.body = res
}
//获取客户
exports.getApp = async (ctx, next) => {
    //如果id != 1抛出API异常
    // if (ctx.query.id !== 1) {
    //     throw new ApiError(ApiErrorNames.app_NOT_EXIST)
    // }
    ctx.body = {
        appname: '阿，洗吧',
        age: 30
    }
}

// 获取用户信息,验证cookies
exports.appInfo = async (ctx, next) => {
    let appid = ctx.cookies.get('appid')
    console.log(appid)
    if (!appid) {
        ctx.body = { code: 1, msg: 'cookies已过期，进入登录状态' }
    } else {
        let res = await App.findOne({ appId: appid }, _filter)
        if (!res) {
            ctx.body = { code: 1, msg: 'cookies错误，进入登录状态' }
        } else {
            ctx.body = { code: 0, msg: 'success', data: res }
        }
    }

}

// 所有app
exports.appList = async (ctx, next) => {
    var { type } = ctx.query
    if (!type) {
        type = null
    }
    var st = await App.find({ type }, function (err, docs) {
        return docs
    })
    ctx.body = { code: 0, msg: 'success', data: st }
}

//客户注册
exports.registerApp = async (ctx, next) => {
    const { phone, pwd } = ctx.request.body
    // 参数检验
    if (!phone || !pwd) {
        ctx.body = { code: 1, msg: '传入的参数必须都不为空' }
    } else {

        var app = await App.findOne({ phone: phone })
        if (app) {
            ctx.body = { code: 2, msg: '账号已注册' }
        } else {
            try {
                var appId = creatAppId()
                var aps = new App({
                    appId: appId,
                    phone: phone,
                    pwd: md5Pwd(pwd),
                })
                var ap = aps.save()
                console.log(ap)
                const { app, _id } = ap
                if (ap) {
                    ctx.cookies.set('appid', appId)
                    ctx.body = {
                        code: 0,
                        msg: 'success',
                        data: { app, _id }
                    }
                }
            }
            catch (e) {
                console.log(e)
                ctx.body = {
                    code: 1,
                    msg: 'false'
                }
            }
        }
    }
}

// 客户登录
exports.login = async function (ctx, next) {
    let { phone, pwd } = ctx.request.body
    if (!phone || !pwd) {
        ctx.body = { code: 1, msg: '用户名和密码必须都不能为空' }
    } else {
        var res = await App.findOne({ phone: phone, pwd: md5Pwd(pwd) }, _filter)
        if (res) {
            ctx.cookies.set('appid', res.appId, {
                httpOnly: false,  // 是否只用于http请求中获取
                overwrite: false  // 是否允许重写
            })
            ctx.body = { code: 0, msg: 'success', data: res }
        } else {
            ctx.body = { code: 1, msg: '用户名或密码错误' }
        }
    }
}


