/*
* @Author: popcornXL
* @Date:   2018-03-05 17:13:44
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-06 17:17:56
*/
'use strict';
require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm                 = require('util/mm.js');
var _order              = require('service/order-service.js');
var _address            = require('service/address-service.js');
var templateAddress     = require('./address-list.string');
var templateProduct     = require('./product-list.string');
var addressModal        = require('./address-modal.js');

var page = {
    data : {
        selectedAddressId : null
    },
    init : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        this.loadAddressList();
        this.loadProductList();
    },
    bindEvent : function(){
        var _this = this;
        // 地址的選擇
        $(document).on('click', '.address-item', function(){
            $(this).addClass('active')
                .siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $(this).data('id');
        });
        // 訂單的提交
        $(document).on('click', '.order-submit', function(){
            var shippingId = _this.data.selectedAddressId;
            if(shippingId){
                _order.createOrder({
                    shippingId : shippingId
                }, function(res){
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                }, function(errMsg){
                    _mm.errorTips(errMsg)
                });
            }else{
                _mm.errorTips('請選擇地址後再提交');
            }
        });
        // 地址的添加
        $(document).on('click', '.address-add', function(){
            addressModal.show({
                isUpdate : false,
                onSuccess : function(){
                    _this.loadAddressList();
                }
            });
        });
        // 地址的編輯
        $(document).on('click', '.address-update', function(e){
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data('id');
            _address.getAddress(shippingId, function(res){
                addressModal.show({
                    isUpdate    : true,
                    data        : res,
                    onSuccess   : function(){
                        _this.loadAddressList();
                    }
                });
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
        // 地址的刪除
        $(document).on('click', '.address-delete', function(e){
            e.stopPropagation();
            var id = $(this).parents('.address-item').data('id');
            if(window.confirm('確定要刪除該地址?')){
                _address.deleteAddress(id, function(res){
                    _this.loadAddressList();
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
        });
    },
    // 加載地址列表
    loadAddressList : function(){
        var _this       = this;
        $('.address-con').html('<div class="loading"></div>');
        // 獲得地址列表
        _address.getAddressList(function(res){
            _this.addressFilter(res);
            var addressListHtml = _mm.renderHtml(templateAddress, res);
            $('.address-con').html(addressListHtml);
        }, function(errMsg){
            $('.address-con').html('<p class="err-tip">地址加載失敗，請刷新後重試</p>');
        })
    },
    // 處理地址列表中選中狀態
    addressFilter : function(data){
        if(this.data.selectedAddressId){
            var selectedAddressIdFlag = false;
            for (var i = 0, length = data.list.length; i < length; i++) {
                if(data.list[i].id === this.data.selectedAddressId){
                    data.list[i].isActive = true;
                    selectedAddressIdFlag = true;
                }
            };
            // 如果以前選中的地址不再列表內，將其刪除
            if(!selectedAddressIdFlag){
                this.data.selectedAddressId = null;
            }
        }
    },
    // 加載商品清單
    loadProductList : function(){
        var _this       = this;
        $('.product-con').html('<div class="loading"></div>');
        // 獲得地址列表
        _order.getProductList(function(res){
            var productListHtml = _mm.renderHtml(templateProduct, res);
            $('.product-con').html(productListHtml);
        }, function(errMsg){
            $('.product-con').html('<p class="err-tip">商品資訊加載失敗，請刷新重新測試</p>');
        })
    },
};
$(function(){
    page.init();
})