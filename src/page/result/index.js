/*
* @Author: popcornXL
* @Date:   2018-02-27 21:50:05
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-02-27 21:50:46
*/
'use strict';
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');

$(function(){
    var type        = _mm.getUrlParam('type') || 'default',
        $element    = $('.' + type + '-success');
    if(type === 'payment'){
        var orderNumber  = _mm.getUrlParam('orderNumber'),
            $orderNumber = $element.find('.order-number');
        $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);
    }
    // 顯示對應的提示元素
    $element.show();
})