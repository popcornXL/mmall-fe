/*
* @Author: popcornXL
* @Date:   2018-03-05 17:10:55
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-05 20:19:02
*/
'use strict';
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide         = require('page/common/nav-side/index.js');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var templateIndex   = require('./index.string');

// page 邏輯部分
var page = {
    init: function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        // 初始化左側菜單
        navSide.init({
            name: 'user-center'
        });
        // 加載用戶資料
        this.loadUserInfo();
    },
    bindEvent : function(){
        var _this = this;
        // 點擊提交後的動作
        $(document).on('click', '.btn-submit', function(){
            var userInfo = {
                phone       : $.trim($('#phone').val()),
                email       : $.trim($('#email').val()),
                question    : $.trim($('#question').val()),
                answer      : $.trim($('#answer').val())
            },
            validateResult = _this.validateForm(userInfo);
            if(validateResult.status){
                // 更改用戶資料
                _user.updateUserInfo(userInfo, function(res, msg){
                    _mm.successTips(msg);
                    window.location.href = './user-center.html';
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            else{
                _mm.errorTips(validateResult.msg);
            }
        });
    },
    // 加載用戶資料
    loadUserInfo : function(){
        var userHtml = '';
        _user.getUserInfo(function(res){
            userHtml = _mm.renderHtml(templateIndex, res);
            $('.panel-body').html(userHtml);
        }, function(errMsg){
            _mm.errorTips(errMsg);
        });
    },
    // 驗證字段訊息
    validateForm : function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        // 驗證手機格式
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
        // 通過驗證，返回正確提示
        result.status   = true;
        result.msg      = '驗證通過';
        return result;
    }
};
$(function(){
    page.init();
});