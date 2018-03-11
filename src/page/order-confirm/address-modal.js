/*
* @Author: popcornXL
* @Date:   2018-03-05 17:13:16
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-11 11:11:16
*/

'use strict';
var _mm                     = require('util/mm.js');
var _cities                 = require('util/cities/index.js');
var _address                = require('service/address-service.js');
var templateAddressModal    = require('./address-modal.string');

var addressModal = {
    show : function(option){
        // option的綁定
        this.option         = option;
        this.option.data    = option.data || {};
        this.$modalWrap     = $('.modal-wrap');
        // 渲染頁面
        this.loadModal();
        // 綁定事件
        this.bindEvent();
    },
    bindEvent :  function(){
        var _this = this;
        // 縣市和區的二級連動
        this.$modalWrap.find('#receiver-province').change(function(){
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        // 提交收貨地址
        this.$modalWrap.find('.address-btn').click(function(){
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate     = _this.option.isUpdate;
            // 使用新地址，且驗證通過
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data, function(res){
                    _mm.successTips('地址添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' 
                        && _this.option.onSuccess(res);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            // 更新收件人，並且驗證通過
            else if(isUpdate && receiverInfo.status){
                _address.update(receiverInfo.data, function(res){
                    _mm.successTips('地址修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' 
                        && _this.option.onSuccess(res);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }
            // 驗證不通過
            else{
                _mm.errorTips(receiverInfo.errMsg || '好像哪裡錯了~');
            }
        });
        // 保證點擊modal內容區的時候，不關閉彈窗
        this.$modalWrap.find('.modal-container').click(function(e){
            e.stopPropagation();
        });
        // 點x號或者蒙版區域，關閉彈窗
        this.$modalWrap.find('.close').click(function(e){
            _this.hide();
        });
    },
    loadModal : function(){
        var addressModalHtml = _mm.renderHtml(templateAddressModal, {
            isUpdate    :  this.option.isUpdate,
            data        : this.option.data
        });
        this.$modalWrap.html(addressModalHtml);
        // 加載縣市
        this.loadProvince();
    },
    // 加載縣市資料
    loadProvince : function(){
        var provinces       = _cities.getProvinces() || [],
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
        // 如果是更新地址，並且有縣市資料，作縣市的回填
        if(this.option.isUpdate && this.option.data.receiverProvince){
            $provinceSelect.val(this.option.data.receiverProvince);
            this.loadCities(this.option.data.receiverProvince);
        }
    },
    // 加載區資料
    loadCities : function(provinceName){
        var cities      = _cities.getCities(provinceName) || [],
            $citySelect = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        // 如果是更新地址，並且有區資料，作區的回填
        if(this.option.isUpdate && this.option.data.receiverCity){
            $citySelect.val(this.option.data.receiverCity);
        }
    },
    // 獲得表單裡收件人資料，並做表單的驗證
    getReceiverInfo : function(){
        var receiverInfo    = {},
            result          = {
                status : false
            };
        receiverInfo.receiverName       = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince   = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity       = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress    = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone      = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip        = $.trim(this.$modalWrap.find('#receiver-zip').val());
        
        if(this.option.isUpdate){
            receiverInfo.id             = this.$modalWrap.find('#receiver-id').val();
        }
        // 表單驗證
        if(!receiverInfo.receiverName){
            result.errMsg = '請輸入收件人姓名';
        }
        else if(!receiverInfo.receiverProvince){
            result.errMsg = '請選擇收件人所在縣市';
        }
        else if(!receiverInfo.receiverCity){
            result.errMsg = '請選擇收件人所在鄉區';
        }
        else if(!receiverInfo.receiverAddress){
            result.errMsg = '請輸入收件人詳細地址';
        }
        else if(!receiverInfo.receiverPhone){
            result.errMsg = '請輸入手機號碼';
        }
        // 所有驗證都通過了
        else{
            result.status   = true;
            result.data     = receiverInfo;
        }
        return result;
    },
    // 獲得select框的選項，輸入:array，輸出: HTML
    getSelectOption : function(optionArray){
        var html = '<option value="">請選擇</option>';
        for(var i = 0, length = optionArray.length; i < length; i++){
            html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>';
        }
        return html;
    },
    // 關閉彈窗
    hide : function(){
        this.$modalWrap.empty();
    }
};
module.exports = addressModal;