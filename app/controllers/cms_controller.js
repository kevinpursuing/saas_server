const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const model = require('../../model')
const timeConvert = require('../../utils/utils')
const Res = model.getModel('res')  //连接app表

const _filter = { 'pwd': 0, '__v': 0 }

// 生成id
function creatResId(len) {
    len = len || 16;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var appId = '';
    for (i = 0; i < len; i++) {
        appId += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return appId;
}

//创建/编辑资源
exports.createRes = async (ctx, next) => {
    let appid = ctx.cookies.get('appid')
    let data = { appId: appid, ...ctx.request.body }
    console.log(data)
    let ret = {}
    let resId = creatResId(16)
    try {
        if (data.id !== "") {
            var { id, ...params } = data
            ret = await Res.findOneAndUpdate({ id: data.id }, params)
            if (ret) {
                ctx.body = { code: 0, msg: 'success', data: ret }
                return ret
            }
        } else {
            resDoc = new Res({ ...data, id: resId })
            ret = await resDoc.save()
            if (ret) {
                ctx.body = { code: 0, msg: 'success', data: ret }
                return ret
            }
        }


    } catch (e) {
        console.log(e)
        ctx.body = { code: 1, msg: 'failed' }
        return false
    }

}

// 获取资源列表
exports.getResList = async (ctx, next) => {
    let appId = ctx.cookies.get('appid')
    let params = ctx.request.query
    var data = await Res.find({ appId: appId, ...params })
    ctx.body = { code: 0, msg: 'success', data: data }
}


// 获取资源信息
exports.getResInfo = async (ctx, next) => {
    let appId = ctx.cookies.get('appid')
    let params = ctx.request.query
    let data = {}
    data = await Res.findOne({ id: params.id });
    console.log(data)
    ctx.body = { code: 0, msg: 'success', data: data }
}

// 获取信息
exports.getmsglist = async (ctx, next) => {
    const userId = ctx.cookies.get('uid')
    // {'$or':[{from:user,to:user}]}
    var data = await User.find({})
    let users = {}
    data.forEach(v => {
        users[v._id] = { name: v.user, avatar: v.avatar }
    })
    var res = await Chat.find({ '$or': [{ from: userId }, { to: userId }] })
    ctx.body = { code: 0, msgs: res, users: users }
}


// 获取用户信息,验证cookies
exports.appInfo = async (ctx, next) => {
    let appid = ctx.cookies.get('appid')
    console.log(appid)
    if (!appid) {
        ctx.body = { code: 1, msg: 'cookies已过期，进入登录状态' }
    } else {
        let res = await app.findOne({ _id: appid }, _filter)
        if (!res) {
            ctx.body = { code: 1, msg: 'cookies错误，进入登录状态' }
        } else {
            ctx.body = { code: 0, msg: 'success', data: res }
        }
    }

}

