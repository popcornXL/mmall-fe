/*
* @Author: popcornXL
* @Date:   2018-02-23 20:49:58
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-03-07 14:30:06
*/
var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

//環境變量配置, dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);
//獲取html-webpack-plugin參數的方法
var getHtmlConfig = function(name,title){
    return{
        template : './src/view/' + name + '.html',
        filename : 'view/' + name + '.html',
        favicon  : './favicon.ico',
        title    : title,
        inject   : true,
        hash     : true,
        chunks   : ['common', name]
    };
};
//webpack config
var config = {
    entry: {
        'common'            : ['./src/page/common/index.js', 'webpack-dev-server/client?http://localhost:8888/'],
        'index'             : ['./src/page/index/index.js'],
        'list'              : ['./src/page/list/index.js'],
        'detail'            : ['./src/page/detail/index.js'],
        'cart'              : ['./src/page/cart/index.js'],
        'order-confirm'     : ['./src/page/order-confirm/index.js'],
        'order-list'        : ['./src/page/order-list/index.js'],
        'order-detail'      : ['./src/page/order-detail/index.js'],
        'payment'           : ['./src/page/payment/index.js'],
        'user-login'        : ['./src/page/user-login/index.js'],
        'user-register'     : ['./src/page/user-register/index.js'],
        'user-center'       : ['./src/page/user-center/index.js'],
        'user-center-update': ['./src/page/user-center-update/index.js'],
        'user-pass-reset'   : ['./src/page/user-pass-reset/index.js'],
        'user-pass-update'  : ['./src/page/user-pass-update/index.js'],
        'result'            : ['./src/page/result/index.js'],
        'about'             : ['./src/page/about/index.js'],
    },
    output: {
        path: __dirname + '/dist/',
        publicPath : 'dev' === WEBPACK_ENV ? '/dist/' : '//s.popcornxl.com/mmall-fe/dist/',
        filename: 'js/[name].js'
    },
    externals : {
        'jquery' : 'window.jQuery'
    },
     module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader") },
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },
            {
                test: /\.string$/, 
                loader: 'html-loader',
                query : {
                    minimize : true,
                    removeAttributeQuotes : false
                }
            }
        ]
    },
      resolve : {
        alias : {
            node_modules    : __dirname + '/node_modules',
            util            : __dirname + '/src/util',
            page            : __dirname + '/src/page',
            service         : __dirname + '/src/service',
            image           : __dirname + '/src/image'
        }
    },
    plugins: [
        //獨立通用模塊到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        //把css單獨打包到文件裡
        new ExtractTextPlugin("css/[name].css"),
        //html模板的處理
        new HtmlWebpackPlugin(getHtmlConfig('index',  '首頁')),
        new HtmlWebpackPlugin(getHtmlConfig('list',  '商品列表')),
        new HtmlWebpackPlugin(getHtmlConfig('detail',  '商品詳細')),
        new HtmlWebpackPlugin(getHtmlConfig('cart',  '購物車')),
        new HtmlWebpackPlugin(getHtmlConfig('order-confirm',  '訂單確認')),
        new HtmlWebpackPlugin(getHtmlConfig('order-list',  '訂單清單')),
        new HtmlWebpackPlugin(getHtmlConfig('order-detail',  '訂單詳細')),
        new HtmlWebpackPlugin(getHtmlConfig('payment',  '訂單支付')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login',  '用戶登錄')),
        new HtmlWebpackPlugin(getHtmlConfig('user-register', '用戶註冊')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset', '找回密碼')),
        new HtmlWebpackPlugin(getHtmlConfig('user-pass-update', '修改密碼')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center', '個人中心')),
        new HtmlWebpackPlugin(getHtmlConfig('user-center-update', '修改個人資料')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果')),
        new HtmlWebpackPlugin(getHtmlConfig('about', '關於COMEMALL')),
    ]
 };

if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8888/');
}


module.exports = config;