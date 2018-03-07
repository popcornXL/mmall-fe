/*
* @Author: popcornXL
* @Date:   2018-03-05 17:16:44
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-06 15:55:04
*/
'use strict';
require('./index.css');
require('page/common/header/index.js');
var nav             = require('page/common/nav/index.js');
var _mm             = require('util/mm.js');
var _cart           = require('service/cart-service.js');
var templateIndex   = require('./index.string');

var page = {
    data : {
        
    },
    init : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        this.loadCart();
    },
    bindEvent : function(){
        var _this = this;
        // 商品的選擇 / 取消選擇
        $(document).on('click', '.cart-select', function(){
            var $this = $(this),
                productId = $this.parents('.cart-table').data('product-id');
            // 選中
            if($this.is(':checked')){
                _cart.selectProduct(productId, function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
            // 取消選中
            else{
                _cart.unselectProduct(productId, function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
        });
        // 商品的全選 / 取消全選
        $(document).on('click', '.cart-select-all', function(){
            var $this = $(this);
            // 全選
            if($this.is(':checked')){
                _cart.selectAllProduct(function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
            // 取消全選
            else{
                _cart.unselectAllProduct(function(res){
                    _this.renderCart(res);
                }, function(errMsg){
                    _this.showCartError();
                });
            }
        });
        // 商品數量的變化
        $(document).on('click', '.count-btn', function(){
            var $this       = $(this),
                $pCount     = $this.siblings('.count-input'),
                currCount   = parseInt($pCount.val()),
                type        = $this.hasClass('plus') ? 'plus' : 'minus',
                productId   = $this.parents('.cart-table').data('product-id'),
                minCount    = 1,
                maxCount    = parseInt($pCount.data('max')),
                newCount    = 0;
            if(type === 'plus'){
                if(currCount >= maxCount){
                    _mm.errorTips('該商品數量已達到上限');
                    return;
                }
                newCount = currCount + 1;
            }else if(type === 'minus'){
                if(currCount <= minCount){
                    return;
                }
                newCount = currCount - 1;
            }
            // 更新購物車商品數量
            _cart.updateProduct({
                productId : productId,
                count : newCount
            }, function(res){
                _this.renderCart(res);
            }, function(errMsg){
                _this.showCartError();
            });
        });
        // 刪除單個商品
        $(document).on('click', '.cart-delete', function(){
            if(window.confirm('確定要刪除此商品?')){
                var productId = $(this).parents('.cart-table')
                    .data('product-id');
                _this.deleteCartProduct(productId);
            }
        });
        // 刪除選中商品
        $(document).on('click', '.delete-selected', function(){
            if(window.confirm('確定要刪除選中的商品?')){
                var arrProductIds = [],
                    $selectedItem = $('.cart-select:checked');
                // 循環查找選中的productIds
                for(var i = 0, iLength = $selectedItem.length; i < iLength; i ++){
                    arrProductIds
                        .push($($selectedItem[i]).parents('.cart-table').data('product-id'));
                }
                if(arrProductIds.length){
                    _this.deleteCartProduct(arrProductIds.join(','));
                }
                else{
                    _mm.errorTips('您還沒有選中要刪除的商品');
                }  
            }
        });
        // 提交購物車
        $(document).on('click', '.btn-submit', function(){
            // 總價大於0，進行提交
            if(_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0){
                window.location.href = './order-confirm.html';
            }else{
                _mm.errorTips('請選擇商品後再提交');
            }
        });
    },
    // 加載購物資料
    loadCart : function(){
        var _this       = this;
        // 獲取購物車列表
        _cart.getCartList(function(res){
            _this.renderCart(res);
        }, function(errMsg){
            _this.showCartError();
        })
    },
    // 渲染購物車
    renderCart : function(data){
        this.filter(data);
        // 緩存購物車資訊
        this.data.cartInfo = data;
        // 生成HTML
        var cartHtml = _mm.renderHtml(templateIndex, data);
        $('.page-wrap').html(cartHtml);
        // 通知導航的購物車更新數量
        nav.loadCartCount();
    },
    // 刪除指定商品，支持批量，productId用逗號分割
    deleteCartProduct : function(productIds){
        var _this = this;
        _cart.deleteProduct(productIds, function(res){
            _this.renderCart(res);
        }, function(errMsg){
            _this.showCartError();
        });
    },
    // 數據匹配
    filter : function(data){
        data.notEmpty = !!data.cartProductVoList.length;
    },
    // 顯示錯誤資訊
    showCartError: function(){
        $('.page-wrap').html('<p class="err-tip">哪裡出錯了，刷新下試試吧。</p>');
    }
};
$(function(){
    page.init();
})