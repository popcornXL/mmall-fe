/*
* @Author: popcornXL
* @Date:   2018-03-05 17:20:22
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-06 14:59:07
*/
'use strict';

var _mm = require('util/mm.js');

var _product = {
    // 獲得商品列表
    getProductList : function(listParam, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/product/list.do'),
            data    : listParam,
            success : resolve,
            error   : reject
        });
    },
    // 獲得商品詳細資料
    getProductDetail : function(productId, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/product/detail.do'),
            data    : {
                productId : productId
            },
            success : resolve,
            error   : reject
        });
    }
}
module.exports = _product;