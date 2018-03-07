/*
* @Author: popcornXL
* @Date:   2018-02-27 13:13:01
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-02-27 15:16:35
*/

'use strict';
require('./index.css');
var _mm     = require('util/mm.js');
var _user   = require('service/user-service.js');
var _cart   = require('service/cart-service.js');

var nav = {
    init : function(){
        this.bindEvent();
        this.loadUserInfo();
        this.loadCartCount();
        return this;
    },
    bindEvent : function(){
        // 點擊登錄事件
        $('.js-login').click(function(){
            _mm.doLogin();
        });
        // 點擊註冊事件
        $('.js-register').click(function(){
            window.location.href = './user-register.html';
        });
        // 點擊登出事件
        $('.js-logout').click(function(){
            _user.logout(function(res){
                window.location.reload();
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    //加載用戶資料
    loadUserInfo : function(){
         _user.checkLogin(function(res){
            $('.user.not-login').hide().siblings('.user.login').show()
                .find('.username').text(res.username);
        }, function(errMsg){
            // do nothing
        });
    },
    //加載購物車數量
    loadCartCount : function(){
      _cart.getCartCount(function(res){
            $('.nav .cart-count').text(res || 0);
        }, function(errMsg){
            $('.nav .cart-count').text(0);
        });
    }
};

module.exports = nav.init();