/*
* @Author: popcornXL
* @Date:   2018-02-23 21:13:59
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-05 15:05:29
*/

'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _user   = require('service/user-service.js');
var _mm     = require('util/mm.js');

// 表單內的錯誤提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide().find('.err-msg').text('');
    }
};

// page 邏輯部分
var page = {
    init: function(){
        this.bindEvent();
    },
    bindEvent : function(){
        var _this = this;
        // 登錄按鈕的點擊
        $('#submit').click(function(){
            _this.submit();
        });
        // 如果按下enter鍵，也進行提交
        $('.user-content').keyup(function(e){
            // keyCode == 13 表示enter鍵
            if(e.keyCode === 13){
                _this.submit();
            }
        });
    },
    // 提交表單
    submit : function(){
        var formData = {
                username : $.trim($('#username').val()),
                password : $.trim($('#password').val())
            },
            // 表單驗證結果
            validateResult = this.formValidate(formData);
        // 驗證成功
        if(validateResult.status){
            _user.login(formData, function(res){
                window.location.href = _mm.getUrlParam('redirect') || './index.html';
            }, function(errMsg){
                formError.show(errMsg);
            });
        }
        // 驗證失敗
        else{
            // 錯誤提示
            formError.show(validateResult.msg);
        }

    },
    // 表單的驗證
    formValidate : function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        if(!_mm.validate(formData.username, 'require')){
            result.msg = '用戶名不能為空';
            return result;
        }
        if(!_mm.validate(formData.password, 'require')){
            result.msg = '密碼不能為空';
            return result;
        }
        // 通過驗證 返回正確提示
        result.status   = true;
        result.msg      = '驗證通過';
        return result;
    }
};
$(function(){
    page.init();
});