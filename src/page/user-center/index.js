/*
* @Author: popcornXL
* @Date:   2018-03-05 17:10:47
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-05 19:58:40
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
    },
    onLoad : function(){
        // 初始化左側菜單
        navSide.init({
            name: 'user-center'
        });
        // 加載用戶資訊
        this.loadUserInfo();
    },
    // 加載用戶資訊
    loadUserInfo : function(){
        var userHtml = '';
        _user.getUserInfo(function(res){
            userHtml = _mm.renderHtml(templateIndex, res);
            $('.panel-body').html(userHtml);
        }, function(errMsg){
            _mm.errorTips(errMsg);
        });
    }
};
$(function(){
    page.init();
});