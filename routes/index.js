var express = require('express')
var router = express.Router()
var db = require('../db/index')
/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.cookies.name) {
        res.render('index', {title: 'todo'})
    } else {
        res.redirect('/login')
    }
})

router.get('/getList', function(req, res, next) {
    db.getList({name: req.cookies.name}).then((data) => {
        res.json({
            code: 200,
            list: data
        })
    }).catch((err) => {
        res.json(err)
    })
})

router.post('/addList', function(req, res, next) {
    var param = {
        id: parseInt(req.query.id),
        text: req.query.text,
        done: (req.query.done === 'false' || req.query.done === false) ? false : true
    }
    db.addList({name: req.cookies.name, todo: param}).then((data) => {
        if(data === true) {
            res.json({
                code: 200,
                msg: '添加成功'
            })
        } else {
            res.json({
                code: 500,
                msg: data
            })
        }
    }).catch((err) => {
        res.json(err)
    })
})
router.post('/delete', function(req, res, next) {
    var param = Object.assign({name: req.cookies.name}, req.query)
    db.deleteList(param).then((data) => {
        if(data === true) {
            res.json({
                code: 200,
                msg: '已删除list'
            })
        } else {
            res.json({
                code: 500,
                msg: data
            })
        }
    }).catch((err) => {
        res.json(err)
    })
})

// query: {
//     id: x,
//     text: 'xx',
//     done: 'xx',
//     changeKey: 'text/done',
//     nowValue: 'xx'
// }
router.post('/change', function(req, res, next) {
    var query = req.query
    // 经nej的ajax函数转换后的query的value都为字符串，此处应注意把done转换为Boolean,id转换为Int
    var param = {
        name: req.cookies.name,
        oldTodo: {
            id: parseInt(query.id),
            text: query.text,
            done: (query.done === 'false' || query.done === false) ? false : true
        }
    }
    param.newTodo = Object.assign({}, param.oldTodo)
    if (query.changeKey === 'done') {
        param.newTodo.done = !param.oldTodo.done
    } else {
        param.newTodo.text = query.nowValue
    }
    // param.newTodo[query.changeKey] = query.nowValue
    db.changeList(param).then((data) => {
        if(data === true) {
            res.json({
                code: 200,
                msg: '更改成功'
            })
        } else {
            res.json({
                code: 500,
                msg: data
            })
        }
    }).catch((err) => {
        res.json(err)
    })
})


router.get('/login', function(req, res, next) {
    var username = req.cookies.name

    res.clearCookie('name')
    res.render('login', {name: username})
})

router.post('/login', function(req, res, next) {
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
        res.status(400).json({
            code: 400,
            msg: '用户名或密码的格式错误，应为4-16位的英文字母或数字'
            // msg: 'user name or password format is wrong. It should be ^[a-zA-Z0-9]{5,16}$'
        })
    }
})

module.exports = router
  