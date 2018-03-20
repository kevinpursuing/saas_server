// md5加密
const utility = require('utility')

const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const model = require('../../model')
const Res = model.getModel('res')  //连接app表


// 获取资源列表
exports.getResList = async (ctx, next) => {
    let params = ctx.request.query
    var data = await Res.find({ ...params })
    ctx.body = { code: 0, msg: 'success', data: data }
}

//获取资源详情
// 获取资源信息
exports.getRes = async (ctx, next) => {
    let params = ctx.request.query
    console.log(params)
    let data = {}
    data = await Res.findOne({ ...params });
    console.log(data)
    ctx.body = { code: 0, msg: 'success', data: data }
}