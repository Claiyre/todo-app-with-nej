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

module.exports = router
  