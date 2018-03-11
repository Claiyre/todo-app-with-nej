/*
 * @Author: mayingying 
 * @Date: 2018-03-09 21:20:08 
 * @Last Modified by: mayingying
 * @Last Modified time: 2018-03-11 15:54:44
 * #Desc the CURD operation of mongodb
 */

var MongoClient = require('mongodb').MongoClient
var chalk = require('chalk')
var url = 'mongodb://localhost:27017'
var dbName = 'todoApp'

var log = console.log

// 仅有一个集合(collection):super
// 其文档结构: {
//     name: 'xxx',
//     password: 'xxx',
//     list: [{
//         text: 'xxx',
//         done: true/false,
//         id: x
//     }]
// }
var colName = 'super'
/*
 * 连接数据库的语法糖，将回调函数改为promise的形式
 * @param {any} operation 
 * @returns 
 */
function connectDB(operation) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err
            console.log('数据库已创建')
            var dbase = db.db(dbName)
            operation(dbase.collection(colName), db, resolve, reject)
        })
    })
    
}

module.exports = {
    /**
     * @param {Object} data: { name: 'user name', password: 'xxxx'}
     * 如果没有找到name, 则创建一个，并登陆
     */
    login: function(data) {
        var where = { name: data.name }
        return connectDB((col, db, resolve, reject) => {
            col.find(where).toArray((err, res) => {
                log(chalk.blue('login find msg', err, res))
                if(err) {
                    reject(err)
                    db.close()
                } else if(res.length > 0) {
                    if(res[0].password === data.password) {
                        // 登陆成功
                        resolve(true)
                    } else {
                        resolve('密码错误')
                    }
                    db.close()
                } else if(res.length === 0){
                    // 添加用户并登陆
                    col.insertOne(data, (err, res) => {
                        if(err) reject(err)
                        log(chalk.blue('login add user db',res))
                        resolve(true)
                        db.close()
                    })
                }
            })
        })
    },
    /**
     * @param {Object} data: { name: 'user name'}
     */
    getList: function(data) {
        var where = {name: data.name}
        return connectDB((col, db, resolve, reject) => {
            col.find(where).toArray((err, res) => {
                if(err) reject(err)
                resolve((res.length > 0 && res[0].list) ? res[0].list : [])
                log((res.length > 0 && res[0].list) ? res[0].list : [])
                db.close()
            })
        })
    },
    /**
     * @param {Object} data: { name: 'user name', todo: {text: 'xxx', done: false, id: x}}
     */
    addList: function(data) {
        var where = {name: data.name}
        return connectDB((col, db, resolve, reject) => {
            col.updateOne(where, {'$push': { list: data.todo}}, function(err, res){
                res = res.result
                if(err) reject(err)
                log(chalk.blue(res))
                if(res.n === 1 && res.nModified == 1 && res.ok === 1) {
                    resolve(true)
                } else {
                    resolve('database error')
                }
                db.close()
            })
        })
    },
    /**
     * @param {Object} data: { name: 'user name', oldTodo: {text: 'xxx', done: false, id: x}, newTodo}
     */
    changeList: function(data) {
        var where = {name: data.name, list: data.oldTodo}
        return connectDB((col, db, resolve, reject) => {
            col.updateOne(where, {$set: { 'list.$': data.newTodo}}, function(err, res){
                res = res.result
                if(err) reject(err)
                log(chalk.blue(res))
                if(res.n === 1 && res.nModified == 1 && res.ok === 1) {
                    resolve(true)
                } else {
                    resolve('database error')
                }
                db.close()
            })
        })
    },
    /**
     * @param {Object} data: { name: 'user name', id: the todo id, all: true/false}
     * id 和 all 只能传一个，如果都传了，则之删除id所指定的todo
     */
    deleteList: function(data) {
        var where = {name: data.name}
        var update = data.all ? {$set: {list: []}} : {$pull: { list: {id: parseInt(data.id)}}}

        return connectDB((col, db, resolve, reject) => {
            col.updateOne(where, update, (err, res) => {
                if(err) reject(err)
                log(chalk.blue(res))
                res = res.result
                if(res.n === 1 && res.nModified == 1 && res.ok === 1) {
                    resolve(true)
                } else {
                    resolve('database error')
                }
                db.close()
            })
        })
    }

}

