var f = function() {
    var _ = NEJ.P,
        _e = _('nej.e'),    // 节点接口
        _v = _('nej.v'),    // 事件接口
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut')
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
    _v._$addEvent('login', 'click', function(){
        var param = {
            name: _e._$get('username').value,
            password: _e._$get('password').value
        }
        if(!(param.name && param.password)) {
            alert('用户名或密码不能为空')
            return
        }
        ajax('/login/to', 'post', param).then((res) => {
            if(res.code !== 200) {
                alert(res.msg)
            } else {
                location.href = '/'
            }
        })
    })
}
define([
    '{lib}util/template/tpl.js',
    '{lib}util/tab/tab.js',
    './js/pro/util.js'], f)