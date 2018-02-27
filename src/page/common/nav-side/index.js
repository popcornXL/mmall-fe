/*
* @Author: popcornXL
* @Date:   2018-02-27 21:18:57
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-02-27 21:20:29
*/
'use strict';
require('./index.css');
var _mm             = require('util/mm.js');
var templateIndex   = require('./index.string');
// 側邊導航
var navSide = {
    option : {
        name : '',
        navList : [
            {name : 'user-center', desc : '個人中心', href: './user-center.html'},
            {name : 'order-list', desc : '我的訂單', href: './order-list.html'},
            {name : 'user-pass-update', desc : '修改密碼', href: './user-pass-update.html'},
            {name : 'about', desc : '關於COMEMALL', href: './about.html'}
        ]
    },
    init : function(option){
        // 合併選項
        $.extend(this.option, option);
        this.renderNav();
    },
    // 渲染導航菜單
    renderNav : function(){
        // 計算active數據
        for(var i = 0, iLength = this.option.navList.length; i < iLength; i++){
            if(this.option.navList[i].name === this.option.name){
                this.option.navList[i].isActive = true;
            }
        };
        // 渲染list數據
        var navHtml = _mm.renderHtml(templateIndex, {
            navList : this.option.navList
        });
        // 把html放入容器
        $('.nav-side').html(navHtml);
    }
};

module.exports = navSide;