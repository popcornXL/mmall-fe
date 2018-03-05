/*
* @Author: popcornXL
* @Date:   2018-03-05 17:09:31
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-05 20:28:36
*/
'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');

// page 邏輯部分
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        // 初始化左側菜單
        navSide.init({
            name: 'user-pass-update'
        });
    },
    bindEvent : function(){
        var _this = this;
        // 點擊提交後的動作
        $(document).on('click', '.btn-submit', function(){
            var userInfo = {
                password        : $.trim($('#password').val()),
                passwordNew     : $.trim($('#password-new').val()),
                passwordConfirm : $.trim($('#password-confirm').val())
            },
            validateResult = _this.validateForm(userInfo);
            if(validateResult.status){
                // 更改用戶密碼
                _user.updatePassword({
                    passwordOld : userInfo.password,
                    passwordNew : userInfo.passwordNew
                }, function(res, msg){
                    _mm.successTips(msg);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            else{
                _mm.errorTips(validateResult.msg);
            }
        });
    },
    // 驗證字段訊息
    validateForm : function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        // 驗證原密碼是否為空
        if(!_mm.validate(formData.password, 'require')){
            result.msg = '原密碼不能為空';
            return result;
        }
        // 驗證新密碼長度
        if(!formData.passwordNew || formData.passwordNew.length < 6){
            result.msg = '密碼長度不得少於6位';
            return result;
        }
        // 驗證兩次輸入的密碼是否一致
        if(formData.passwordNew !== formData.passwordConfirm){
            result.msg = '兩次輸入的密碼不一致';
            return result;
        }
        // 通過驗證，返回正確提示
        result.status   = true;
        result.msg      = '驗證通過';
        return result;
    }
};
$(function(){
    page.init();
});