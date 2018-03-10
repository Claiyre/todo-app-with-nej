define(['{lib}util/ajax/xdr.js'], function(request, p, o, f, r) {
    console.log('args', request, p, o, f, r)
    request = NEJ.P('nej.j')._$request
    p = {}
    p.ajax = function (url, method, params){
        return new Promise((resolve, reject) => {
            request(url, {
                sync:true,
                type:'json',
                data:params,
                method:method,
                timeout:3000,    // 超时检测
                cookie: true,
                mode:0||1||2||3,
                onload:function(_data){
                    resolve(_data)
                },
                onerror:function(_error){
                    alert(_error)
                }
            })
        })
        
    }
    return p
})