/*
* @Author: popcornXL
* @Date:   2018-03-07 17:32:22
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-11 16:25:11
*/
'use strict';

require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _payment        = require('service/payment-service.js');
var templateIndex   = require('./index2.string');

// page 邏輯部分
var page = {
    data: {
        orderNumber : _mm.getUrlParam('orderNumber')
    },
    init: function(){
        this.onLoad();
    },
    onLoad : function(){
        // 加載detail數據
        this.loadPaymentInfo();
    },
    // 加載訂單列表
    loadPaymentInfo: function(){
        var _this           = this,
            paymentHtml     = '',
            $pageWrap       = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNumber, function(res){
            // 渲染html
            paymentHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">' + errMsg + '</p>');
        });
    },
    // 監聽訂單狀態
    listenOrderStatus : function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNumber, function(res){
                if(res == true){
                    window.location.href 
                        = './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
                }
            });
        }, 5e3);
    }
};
$(function(){
    page.init();
});