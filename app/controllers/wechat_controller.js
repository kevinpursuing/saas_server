const crypto = require('crypto') //引入加密模块
var request = require('request');  //引入request模块
var koa2Req = require('koa2-request');
const accessTokenJson = require('./AccessToken.json'); //引入本地存储的 access_token
const util = require('util') //引入 util 工具包
const fs = require('fs') //引入 fs模块
const qs = require('qs')
const model = require('../../model')
const config = require('../../config/config.json')
const saasUtils = require('../../utils/utils')
const User = model.getModel('user')  //连接user表

/**
 * 获取微信 access_token
 */
exports.getAccessToken = async (ctx, next) => {
    //获取当前时间 
    var currentTime = new Date().getTime();
    //格式化请求地址
    var url = util.format(config.apiURL.accessTokenApi, config.apiDomain, config.appID, config.appScrect);
    //判断 本地存储的 access_token 是否有效
    if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
        let ret = await request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            if (body.indexOf("errcode") < 0) {
                body = JSON.parse(body)
                accessTokenJson.access_token = body.access_token;
                accessTokenJson.expires_time = new Date().getTime() + (parseInt(body.expires_in) - 200) * 1000;
                //更新本地存储的
                fs.writeFile(__dirname + '/AccessToken.json', JSON.stringify(accessTokenJson), (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('写入成功');
                    }

                })
                //将获取后的 access_token 返回
                ctx.body = accessTokenJson.access_token;
            } else {
                console.log(111)
                //将错误返回
                ctx.body = ret
            }
        })
    } else {
        //将本地存储的 access_token 返回
        ctx.body = accessTokenJson.access_token;
    }
}

exports.signature = async (ctx, next) => {
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

exports.getUserInfo = async (ctx, next) => {
    let code = ctx.request.query.code
    let appId = ctx.request.query.appId
    let uId = ctx.cookies.get('uId')
    console.log(uId)
    console.log(appId)
    if (uId) {
        console.log(123)
        let uInfo = await User.findOne({ appId: appId, uId: uId })
        console.log('uInfo:' + uInfo)
        if (uInfo) {
            ctx.body = { code: 0, msg: 'success', data: uInfo }
        } else {
            ctx.body = { code: 1, msg: 'failed' }
        }
        return
    }
    if (!code || !appId) {
        ctx.body = { code: 1, msg: '参数不完整' }
    }
    let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
    let params = {
        appid: config.appID,
        secret: config.appScrect,
        code: code,
        grant_type: 'authorization_code'
    };

    url = reqUrl + qs.stringify(params)
    console.log(url)
    var data
    let res = await koa2Req(url);

    res = JSON.parse(res.body)
    console.log(res)
    if (!res.errcode) {   //若是获取accessToken和openId成功
        ctx.cookies.set('uId', res.openid, {
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        })
        let userInfo = await User.findOne({ appId: appId, uId: res.openid })
        console.log(userInfo)
        if (userInfo) {
            ctx.body = { code: 0, msg: 'success', data: userInfo }
        } else {
            let wechatUinfoUrl = 'https://api.weixin.qq.com/sns/userinfo?';
            let res_params = {
                access_token: res.access_token,
                openid: res.openid,
                lang: 'zh_CN'
            };
            wxUsrInfoUrl = wechatUinfoUrl + qs.stringify(res_params)
            let finalRes = await koa2Req(wxUsrInfoUrl);
            finalRes = JSON.parse(finalRes.body)
            console.log(saasUtils.getNowFormatDate())

            if (finalRes.openid) {
                let usr = new User({
                    appId: appId,
                    uId: finalRes.openid,
                    nickName: finalRes.nickname,
                    avatar: finalRes.headimgurl,
                    sex: finalRes.sex,
                    city: finalRes.city,
                    province: finalRes.province,
                    country: finalRes.country,
                    createTime: saasUtils.getNowFormatDate(),
                    updateTime: saasUtils.getNowFormatDate(),
                })
                console.log(usr)
                let res = await usr.save()
                console.log(res)
                if (res) {
                    ctx.body = { code: 0, msg: '存储成功', data: finalRes }
                } else {
                    ctx.body = { code: 0, msg: '存储失败' }
                }

            } else {
                ctx.body = { code: 1, msg: 'failed', data: finalRes }
            }
            console.log(finalRes.body)
        }

    } else {
        ctx.body = { code: res.errcode, msg: res.errmsg }
    }
}
