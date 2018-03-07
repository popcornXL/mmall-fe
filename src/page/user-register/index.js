/*
* @Author: popcornXL
* @Date:   2018-03-05 16:11:55
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-05 16:18:46
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
        // 驗證username
        $('#username').blur(function(){
            var username = $.trim($(this).val());
            // 如果用戶名為空，我們不做驗證
            if(!username){
                return;
            }
            // 異步驗證用戶名是否存在
            _user.checkUsername(username, function(res){
                formError.hide();
            }, function(errMsg){
                formError.show(errMsg);
            });
        });
        // 註冊按鈕的點擊
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
                username        : $.trim($('#username').val()),
                password        : $.trim($('#password').val()),
                passwordConfirm : $.trim($('#password-confirm').val()),
                phone           : $.trim($('#phone').val()),
                email           : $.trim($('#email').val()),
                question        : $.trim($('#question').val()),
                answer          : $.trim($('#answer').val())
            },
            //  表單驗證結果
            validateResult = this.formValidate(formData);
        // 驗證成功
        if(validateResult.status){
            _user.register(formData, function(res){
                window.location.href = './result.html?type=register';
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
        // 驗證用戶名是否為空
        if(!_mm.validate(formData.username, 'require')){
            result.msg = '用戶名不能為空';
            return result;
        }
        // 驗證密碼是否為空
        if(!_mm.validate(formData.password, 'require')){
            result.msg = '密碼不能為空';
            return result;
        }
        // 驗證密碼長度
        if(formData.password.length < 6){
            result.msg = '密碼長度不能少於6位';
            return result;
        }
        // 驗證兩次輸入的密碼是否一致
        if(formData.password !== formData.passwordConfirm){
            result.msg = '兩次輸入的密碼不一致';
            return result;
        }
        // 驗證手機
        if(!_mm.validate(formData.phone, 'phone')){
            result.msg = '手機格式不正確';
            return result;
        }
        // 驗證信箱格式
        if(!_mm.validate(formData.email, 'email')){
            result.msg = '信箱格式不正確';
            return result;
        }
        // 驗證密碼提示問題是否為空
        if(!_mm.validate(formData.question, 'require')){
            result.msg = '密碼提示問題不能為空';
            return result;
        }
        // 驗證密碼提示問題答案是否為空
        if(!_mm.validate(formData.answer, 'require')){
            result.msg = '密碼提示問題答案不能為空';
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