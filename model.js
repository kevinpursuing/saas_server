// 引入mongoose
const mongoose = require('mongoose')

// 声明数据库地址,若没有，则monggodb会自动创建
// 创建saas数据库
const uri = 'mongodb://localhost:27017/saas'

// 引入异步promise
mongoose.Promise = global.Promise

// 连接数据库
mongoose
    .connect(uri)
    .then(db => console.log('😁连接saas数据库成功！'))
    .catch(error => console.log('😢连接saas数据库失败~'))

const models = {
    //店铺表
    app: {
        appId: {
            type: String,
            required: true
        }, //店铺id
        userName: String, //用户名
        pwd: {
            type: String,
            required: true
        },  //用户密码（hash之后的）
        phone: {
            type: Number,
            required: true
        },  //用户手机号
        avatar: String, //用户头像
        updateTime: {
            type: Date,
            default: Date.now
        },  //用户信息修改时间
        createTime: {
            type: Date,
            default: Date.now
        }   //用户注册时间
    },
    // 用户表
    user: {
        userName: {
            type: String,
            required: true
        }, //用户名
        pwd: {
            type: String,
            required: true
        },  //用户密码（hash之后的）
        phone: {
            type: Number,
            required: true
        },  //用户手机号
        avatar: String, //用户头像
        updateTime: {
            type: Date,
            default: Date.now
        },  //用户信息修改时间
        createTime: {
            type: Date,
            default: Date.now
        }   //用户注册时间
    },
    // 订单表
    order: {
        resId: {
            type: String,
            required: true
        }, //商品id
        title: String,  //商品名称
        price: Number,   //商品价格
        userId: String,  //购买用户id
        userName: Boolean,   //购买用户名称
        type: Number,  //商品所属类型  1,图文 2,音乐  3,视频
        saleTime: {
            type: Date,
            default: Date.now
        },   //用户购买时间
    },
    // 图文资源表
    text: {
        title: {
            type: String,
            required: true
        }, //标题
        intro: String,  //资源简介
        contents: String,   //图文内容
        price: Number,   //商品价格
        cover: String,  //商品封面
        isCopy: Boolean,   //商品内容是否允许复制
        isAlone: Boolean,   //商品是否单卖
        isShow: Boolean,   //是否上架
        type: Number,  //商品所属类型  1,图文 2,音乐  3,视频
        saleTime: Date, //商品上架时间
        updateTime: Date, //商品信息更新时间
        createTime: {
            type: Date,
            default: Date.now
        }   //商品创建时间
    },
    // 音乐资源表
    audio: {
        title: {
            type: String,
            required: true
        }, //标题
        intro: String,  //资源简介
        uri: String,   //音乐链接
        price: Number,   //商品价格
        cover: String,  //商品封面链接
        isCopy: Boolean,   //商品内容是否允许复制
        isAlone: Boolean,   //商品是否单卖
        isShow: Boolean,   //是否上架
        type: Number,  //商品所属类型  1,图文 2,音乐  3,视频
        saleTime: Date, //商品上架时间
        updateTime: Date, //商品信息更新时间
        createTime: {
            type: Date,
            default: Date.now
        }   //商品创建时间
    },
    // 视频资源表
    video: {
        title: {
            type: String,
            required: true
        }, //标题
        intro: String,  //资源简介
        uri: String,   //视频链接
        price: Number,   //商品价格
        cover: String,  //商品封面链接
        isCopy: Boolean,   //商品内容是否允许复制
        isAlone: Boolean,   //商品是否单卖
        isShow: Boolean,   //是否上架
        type: Number,  //商品所属类型  1,图文 2,音乐  3,视频
        saleTime: Date, //商品上架时间
        updateTime: Date, //商品信息更新时间
        createTime: {
            type: Date,
            default: Date.now
        }   //商品创建时间
    },
    // 
}

for (let m in models) {
    mongoose.model(m, new mongoose.Schema(models[m]))
}

module.exports = {
    getModel: function (name) {
        return mongoose.model(name)
    }
}