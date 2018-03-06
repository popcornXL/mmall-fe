/*
* @Author: popcornXL
* @Date:   2018-03-05 17:20:32
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-06 17:14:25
*/
'use strict';
var _mm = require('util/mm.js');

var _payment = {
    // 獲得支付訊息
    getPaymentInfo : function(orderNumber, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/pay.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
    },
    // 獲得訂單狀態
    getPaymentStatus : function(orderNumber, resolve, reject){
        _mm.request({
            url     : _mm.getServerUrl('/order/query_order_pay_status.do'),
            data    : {
                orderNo : orderNumber
            },
            success : resolve,
            error   : reject
        });
    }
}
module.exports = _payment;