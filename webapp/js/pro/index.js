var f=function(_tol, _tab, util){
    var _ = NEJ.P,
        _e = _('nej.e'),    // 节点接口
        _v = _('nej.v'),    // 事件接口
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut')
    var allList = []
    var _tabIndex, targetList = [], _listTpl = _e._$addHtmlTemplate('tab-list', true)

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
    //解析模板
    _e._$parseTemplate('template-box')
    // 使用tab控件
    _e._$tab('filter',{
        index:1,
        onchange:function(_event){
            _tabIndex = _event.index
            changeListView()
        }
    })._$go(0)    //default to all list

    function changeListView(){
        var _element = _e._$get('list')
        switch(_tabIndex){
        case 0:
            targetList = allList
            break
        case 1:
            targetList = allList.filter((item) => !item.done)
            break
        case 2:
            targetList = allList.filter((item) => item.done)
            break
        }
        _element.innerHTML = _e._$getHtmlTemplate(_listTpl, {todoList: targetList})
        var checks = _e._$getByClassName(_element, 'check-done')
        var deleteBtns = _e._$getByClassName(_element, 'delete')

        for(var i = 0; i < checks.length; i++) {
            // 绑定选中/不选中事件
            _v._$addEvent(checks[i], 'click', function(_event){
                var index = _e._$attr(_event.target, 'index')
                index = parseInt(index)
                allList.map(function(item) {
                    if(item.id === index) {
                        item.done = _event.target.checked
                    }
                })
                changeListView()
            })
            // 绑定删除事件
            _v._$addEvent(deleteBtns[i], 'click', function(_event) {
                var index = _e._$attr(_event.target, 'index')
                index = parseInt(index)
                allList = allList.filter((item) => item.id !== index)
                changeListView()
            })
        }
    }
    
    // 绑定enter事件
    _v._$addEvent('input', 'keyup', function(_event) {
        if (parseInt(_event.keyCode) !== 13) return
        var target = _event.target
        allList.unshift({
            text: target.value,
            done: false,
            id: allList.length
        })
        target.value = ''
        changeListView()
    }, false)

    
    _v._$addEvent('delete-all', 'click', function() {
        allList = []
        changeListView()
    })


    

}

define([
    '{lib}util/template/tpl.js',
    '{lib}util/tab/tab.js',
    './js/pro/util.js'], f)