/*
* @Author: popcornXL
* @Date:   2018-02-27 16:09:36
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-02-27 16:14:06
*/
'use strict';
require('./index.css');
var _mm     = require('util/mm.js');
// 通用頁面header
var header = {
    init : function(){
        this.onLoad();
        this.bindEvent();
    },
    onLoad : function(){
        var keyword = _mm.getUrlParam('keyword');
        // keyword存在，則回填輸入框
        if(keyword){
            $('#search-input').val(keyword);
        };
    },
    bindEvent : function(){
        var _this = this;
        // 點擊搜索按鈕後，做搜索提交
        $('#search-btn').click(function(){
            _this.searchSubmit();
        });
        // 輸入enter後，會直接提交
        $('#search-input').keyup(function(e){
            // 13是enter的keyCode
            if(e.keyCode === 13){
                _this.searchSubmit();
            }
        });
    },
    // 搜索的提交
    searchSubmit : function(){
        var keyword = $.trim($('#search-input').val());
        // 提交時有Keyword，正常跳轉到list頁
        if(keyword){
            window.location.href = './list.html?keyword=' + keyword;
        }
        // 如果keyword為空，直接返回空
        else{
            _mm.goHome();
        }
    }
};

header.init();