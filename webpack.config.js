/*
* @Author: popcornXL
* @Date:   2018-02-23 20:49:58
* @Last Modified by:   popcornXL
* @Last Modified time: 2018-02-25 15:16:52
*/
var webpack             = require('webpack');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin   = require('html-webpack-plugin');

//環境變亮配置, dev / online
var WEBPACK_ENV         = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);
//獲取html-webpack-plugin參數的方法
var getHtmlConfig = function(name){
    return{
        template : './src/view/' + name + '.html',
        filename : 'view/' + name + '.html',
        inject   : true,
        hash     : true,
        chunks   : ['common', name]
    };
};
//webpack config
var config = {
    entry: {
        'common': ['./src/page/common/index.js', 'webpack-dev-server/client?http://localhost:8888/'],
        'index' : ['./src/page/index/index.js'],
        'login' : ['./src/page/login/index.js'],
    },
    output: {
        path: './dist',
        publicPath : '/dist',
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
    plugins: [
        //獨立通用模塊到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        //把css單獨打包到文件裡
        new ExtractTextPlugin("css/[name].css"),
        //html模板的處理
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login')),
    ]
 };

if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8888/');
}


module.exports = config;