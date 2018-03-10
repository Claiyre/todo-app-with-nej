var f=function(_tol, _tab, util){
    var _ = NEJ.P,
        _e = _('nej.e'),    // 节点接口
        _v = _('nej.v'),    // 事件接口
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut')

    // 封装的实用函数
    var ajax = function (url, method, params){
        return new Promise((resolve, reject) => {
            _j._$request(url, {
                sync:true,
                type:'json',
                query:params,
                method:method,
                timeout:3000,    // 超时检测
                cookie: true,
                mode:0||1||2||3,
                onload:function(_data){
                    resolve(_data)
                },
                onerror:function(_error){
                    alert('err code:' + _error.data + ' mes:' + _error.message)
                    // reject(_error)
                }
            })
        })
        
    }

    // ajax('/login', 'post', {name: 'common1', password: '123456'}).then((res) => {
    //     console.log('add user success: ', res)
    // })
    ajax('/addList', 'post', {text: 'this is a todo2', done: true, id: 2}).then((res) => {
        console.log('add list success: ', res)
    })
    ajax('/addList', 'post', {text: 'this is a todo', done: true, id: 1}).then((res) => {
        console.log('add list success: ', res)
    })

    ajax('/getList', 'get').then((res) => {
        console.log('getlist success: ', res)
    })
    // ajax('/change', 'post', {id: 2, done: true, text: 'this is a todo', changeKey: 'done', nowValue: false}).then((res) => {
    //     console.log('change success: ', res)
    // })
    ajax('/delete', 'post', {id: 2}).then((res) => {
        console.log('delete all success: ', res)
    })
    ajax('/getList', 'get').then((res) => {
        console.log('getlist success: ', res)
    })

}

define([
    '{lib}util/template/tpl.js',
    '{lib}util/tab/tab.js',
    './js/pro/util.js'], f)