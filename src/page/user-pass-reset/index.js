/*
* @Author: popcornXL
* @Date:   2018-03-05 17:09:54
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-05 17:29:45
*/

'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _user   = require('service/user-service.js');
var _mm     = require('util/mm.js');

// 表單裡的錯誤提示
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
    data : {
        username    : '',
        question    : '',
        answer      : '',
        token       : ''
    },
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        this.loadStepUsername();
    },
    bindEvent : function(){
        var _this = this;
        // 輸入用戶名後下一步按鈕的點擊
        $('#submit-username').click(function(){
            var username = $.trim($('#username').val());
            // 用戶名存在
            if(username){
                _user.getQuestion(username, function(res){
                    _this.data.username = username;
                    _this.data.question = res;
                    _this.loadStepQuestion();
                }, function(errMsg){
                    formError.show(errMsg);
                });
            }
            // 用戶名不存在
            else{
                formError.show('請輸入用戶名');
            }
        });
        // 輸入密碼提示問題答案中的按鈕點擊
        $('#submit-question').click(function(){
            var answer = $.trim($('#answer').val());
            // 密碼提示問題答案存在
            if(answer){
                // 檢查密碼提示問題答案
                _user.checkAnswer({
                    username : _this.data.username,
                    question : _this.data.question,
                    answer   : answer
                }, function(res){
                    _this.data.answer   = answer;
                    _this.data.token    = res;
                    _this.loadStepPassword();
                }, function(errMsg){
                    formError.show(errMsg);
                });
            }
            // 用户名不存在
            else{
                formError.show('請輸入密碼提示問題答案');
            }
        });
        // 輸入新密碼後的按鈕點擊
        $('#submit-password').click(function(){
            var password = $.trim($('#password').val());
            // 密碼不為空
            if(password && password.length >= 6){
                // 檢查密碼提示問題答案
                _user.resetPassword({
                    username        : _this.data.username,
                    passwordNew     : password,
                    forgetToken     : _this.data.token
                }, function(res){
                    window.location.href = './result.html?type=pass-reset';
                }, function(errMsg){
                    formError.show(errMsg);
                });
            }
            // 密碼為空
            else{
                formError.show('請輸入不少於6位的新密碼');
            }
        });
        
    },
    // 加載輸入用戶名的一步
    loadStepUsername : function(){
        $('.step-username').show();
    },
    // 加載輸入密碼提示問題的一步
    loadStepQuestion : function(){
        // 清除錯誤提示
        formError.hide();
        // 做容器的切換
        $('.step-username').hide()
            .siblings('.step-question').show()
            .find('.question').text(this.data.question);
    },
    // 加載輸入password的一步
    loadStepPassword : function(){
        // 清除錯誤的提示
        formError.hide();
        // 做容器的切換
        $('.step-question').hide()
            .siblings('.step-password').show();
    }
    
};
$(function(){
    page.init();
});