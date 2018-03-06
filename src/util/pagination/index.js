/*
* @Author: popcornXL
* @Date:   2018-03-06 15:15:59
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-06 15:19:35
*/
'use strict';
require('./index.css');
var _mm                 = require('util/mm.js');
var templatePagination  = require('./index.string');

var Pagination = function(){
    var _this = this;
    this.defaultOption = {
        container       : null,
        pageNum         : 1,
        pageRange       : 3,
        onSelectPage    : null
    };
    // 事件的處理
    $(document).on('click', '.pg-item', function(){
        var $this = $(this);
        // 對於active和disabled按鈕點擊，不做處理
        if($this.hasClass('active') || $this.hasClass('disabled')){
            return;
        }
        typeof _this.option.onSelectPage === 'function' 
            ? _this.option.onSelectPage($this.data('value')) : null;
    });
};
// 渲染分頁組件
Pagination.prototype.render = function(userOption){
    // 合併選項
    this.option = $.extend({}, this.defaultOption, userOption);
    // 判斷容器是否為合法的jquery對象
    if(!(this.option.container instanceof jQuery)){
        return;
    }
    // 判斷是否只有1頁
    if(this.option.pages <= 1){
        return;
    }
    // 渲染分頁的內容
    this.option.container.html(this.getPaginationHtml());
};
// 換取分頁的html, |上一頁| 2 3 4 =5= 6 7 8|下一頁|  5/9
Pagination.prototype.getPaginationHtml = function(){
    var html        = '',
        option      = this.option,
        pageArray   = [],
        start       = option.pageNum - option.pageRange > 0 
            ? option.pageNum - option.pageRange : 1,
        end         = option.pageNum + option.pageRange < option.pages
            ? option.pageNum + option.pageRange : option.pages;
    // 上一頁按鈕的數據
    pageArray.push({
        name : '上一頁',
        value : this.option.prePage,
        disabled : !this.option.hasPreviousPage
    });
    // 數字按鈕的處理
    for(var i = start; i <= end; i++){
        pageArray.push({
            name : i,
            value : i,
            active : (i === option.pageNum)
        });
    };
    // 下一頁按鈕的數據
    pageArray.push({
        name : '下一頁',
        value : this.option.nextPage,
        disabled : !this.option.hasNextPage
    });
    html = _mm.renderHtml(templatePagination, {
        pageArray   : pageArray,
        pageNum     : option.pageNum,
        pages       : option.pages
    });
    return html;
};

module.exports = Pagination;