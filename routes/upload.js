const router = require('koa-router')()
var STS = require('ali-oss').STS;
var co = require('co');
var fs = require('fs');
var path = require('path');
var conf = require('../config/config');

router.get('/', async (ctx, next) => {
    console.log(conf);
    var policy;
    if (conf.PolicyFile) {
        policy = fs.readFileSync(path.resolve(__dirname, conf.PolicyFile)).toString('utf-8')
    }

    var client = new STS({
        accessKeyId: conf.AccessKeyId,
        accessKeySecret: conf.AccessKeySecret,
    });
    var o
    await co(function* () {
        var result = yield client.assumeRole(conf.RoleArn, policy, conf.TokenExpireTime);
        console.log(result);

        // res.set('Access-Control-Allow-Origin', '*');
        // res.set('Access-Control-Allow-METHOD', 'GET');
        o = {
            AccessKeyId: result.credentials.AccessKeyId,
            AccessKeySecret: result.credentials.AccessKeySecret,
            SecurityToken: result.credentials.SecurityToken,
            Expiration: result.credentials.Expiration
        };
    }).then(function () {
    }).catch(function (err) {
        console.log(err);
        ctx.body = { code: 1, msg: 'failed' }
    });
    ctx.body = { code: 0, msg: 'success', data: o }

});

module.exports = router

