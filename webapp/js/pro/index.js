/*
 * @Author: mayingying 
 * @Date: 2018-03-11 13:46:43 
 * @Last Modified by: mayingying
 * @Last Modified time: 2018-03-11 23:12:24
 */

var f=function(_tol, _tab, util){
    var _ = NEJ.P,
        _e = _('nej.e'),    // 节点接口
        _v = _('nej.v'),    // 事件接口
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut')
    var allList = []
    var _tabIndex, targetList = [], _listTpl = _e._$addHtmlTemplate('tab-list', true)
    var _element = _e._$get('list')
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
                    if(_data.code === 401) {
                        alert(_data.msg)
                        location.href = '/login'
                    } else {
                        resolve(_data)
                    }
                },
                onerror:function(_error){
                    alert('err code:' + _error.data + ' mes:' + _error.message)
                    // reject(_error)
                }
            })
        })
        
    }
    ajax('/getList', 'get').then((res) => {
        allList = res.list
        changeListView()
    })
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
    }
    
    // 绑定enter事件
    _v._$addEvent('input', 'keyup', function(_event) {
        if (parseInt(_event.keyCode) !== 13) return
        var target = _event.target
        if(!target.value) {
            alert('输入的todo不能为空')
            return
        }
        var param = {
            text: target.value,
            done: false,
            id: allList[0] ? allList[0].id + 1 : 0
        }
        target.value = ''
        ajax('/addList', 'post', param).then((res) => {
            if(res.code === 200) {
                allList.unshift(param)
                changeListView()
            } else {
                alert(res.msg)
            }
        })
    }, false)

    // 删除、编辑、选中等事件
    _v._$addEvent(_element, 'click', function(_event) {
        var className = _event.target.className
        if(!/(delete)|(check-done)/.test(className)){
            return
        }

        var index = _e._$attr(_event.target, 'index')
        index = parseInt(index)
        var param = {id: index}, url, list
        console.log('change: ',className, param)
        if(className === 'delete') {
            //delete todo
            url = '/delete'
        } else {
            // change todo
            url = '/change'
            for(var i = 0; i < allList.length; i++) {
                list = allList[i]
                if(list.id === index){
                    param.text = list.text
                    param.done = list.done
                    break
                }
            }
            if(className === 'check-done') {
                param.changeKey = 'done'
                param.nowValue = _event.target.checked
            } else if(className === 'edit-btn') {
                param.changeKey = 'text'
                param.nowValue = ''
            }
        }
        ajax(url, 'post', param).then((res) => {
            if(res.code !== 200) {
                alert(res.msg)
            } else if(className === 'delete') {
                allList = allList.filter((item) => item.id !== index)
                changeListView()
            } else {
                for(var i = 0; i < allList.length; i++) {
                    list = allList[i]
                    if(list.id === index){
                        list[param.changeKey] = param.nowValue
                        break
                    }
                }
                changeListView()
            }
        })

    })

    
    _v._$addEvent('delete-all', 'click', function() {
        ajax('/delete', 'post', {all: true}).then((res) => {
            if(res.code === 200) {
                allList = []
                changeListView()
            } else {
                alert(res.msg)
            }
        })
        
    })


    

}

define([
    '{lib}util/template/tpl.js',
    '{lib}util/tab/tab.js',
    './js/pro/util.js'], f)