var express = require('express')
var router = express.Router()

var db = require('../db/index')

router.get('/', function(req, res, next) {
    var username = req.cookies.name

    res.clearCookie('name')
    res.render('login', {name: username})
})

router.post('/to', function(req, res, next) {
    var param = req.query
    var reg = /^[a-zA-Z0-9]{4,16}$/

    if(reg.test(param.name) && reg.test(param.password)) {
        db.login(param).then((data) => {
            if(data === true) {
                res.cookie('name', param.name, {
                    // signed: true,
                    expires: new Date(Date.now() + 900000000)      // 大约十天
                })
                res.json({
                    code: 200,
                    msg: '登录成功'
                })
            } else {
                res.json({
                    code: 400,
                    msg: data
                })
            }
        }).catch((err) =>{
            res.json(err)
        })
    } else {
        res.json({
            code: 400,
            msg: '用户名或密码的格式错误，应为4-16位的英文字母或数字'
            // msg: 'user name or password format is wrong. It should be ^[a-zA-Z0-9]{5,16}$'
        })
    }
})


module.exports = router
