/*
* @Author: popcornXL
* @Date:   2018-02-26 13:34:40
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-02-27 14:46:05
*/

'use struct';
var Hogan = require('hogan.js');
var conf = {
    serverHost : ''
};
var _mm = {
    // 網路請求
    request : function(param){
        var _this = this;
        $.ajax({
            type        : param.method  || 'get',
            url         : param.url     || '',
            dataType    : param.type    || 'json',
            data        : param.data    || '',
            success     : function(res){
                // 請求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                // 沒有登錄狀態，需要強制登錄
                else if(10 === res.status){
                    _this.doLogin();
                }
                // 請求數據錯誤
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error       : function(err){
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    // 獲得server address
    getServerUrl : function(path){
        return conf.serverHost + path;
    },
    // get url參數
    getUrlParam : function(name){
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板
    renderHtml : function(htmlTemplate, data){
        var template    = Hogan.compile(htmlTemplate),
            result      = template.render(data);
        return result;
    },
    // 成功提示
    successTips : function(msg){
        alert(msg || '操作成功！');
    },
    // 錯誤提示
    errorTips : function(msg){
        alert(msg || '哪裡錯了唷!');
    }, 
    // 字段的驗證, 支持非空、手機、信箱的判斷
    validate : function(value, type){
        var value = $.trim(value);
        // 非空驗證
        if('require' === type){
            return !!value;
        }
        // 手機驗證
        if('phone' === type){
            return /^0\d{9}$/.test(value);
        }
        // 信箱格式驗證
        if('email' === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    // 統一登入處理
    doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    goHome : function(){
        window.location.href = './index.html';
    }
};

module.exports = _mm;