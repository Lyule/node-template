/**
 * webpack config
 * @author: xuqi<xuqi@i0011.com>
 * @date: 2017/4/21
 */

'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const shelljs = require('shelljs');
const _ = require('lodash');
const chalk = require('chalk');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const err = chalk.red;

const PRO_ENV = process.env.NODE_ENV === 'production';

const sysConfig = require('../config');

const domain = sysConfig.static;

const sourceBase = sysConfig.sourceBase || 'clinks';

let entry = {};

// 通过约定的入口文件命名构建webpack打包入口
// entry的name规则为：模块名.页面名
shelljs.ls(path.join(__dirname, '/source/**/*.page.js')).forEach(f => {
    let fp = f.split('/');

    let file = _.last(fp);
    let page = file.replace(/\.page.js$/, ''); // 从文件名中取出需要打包的文件的「页面名」

    // 「模块名」取/source/module/，即source目录下一级目录名
    let pos = _.indexOf(fp, 'source');
    let mod = fp.slice(pos + 1, pos + 2);

    // 防止直接将.page.js放到source目录中
    if (/\.page.js$/.test(mod)) {
        console.log(err(`Please don't settle ${chalk.bold(file)} in folder source directly`));
        return;
    }

    entry[`${mod}.${page}`] = `./${fp.slice(pos).join('/')}`;
});

const config = {
    entry: entry,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hot: true,
        inline: true,
        stats: {
            colors: true
        }
    },
    output: {
        filename: PRO_ENV ? `${sourceBase}/[name].[chunkhash].js` : `${sourceBase}/[name].js`,
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    require('autoprefixer')
                                ]
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    context: path.join(__dirname, 'source/'),
                    outputPath: `${sourceBase}/imgs/`,
                    publicPath: `${domain}/`,
                    regExp: 'public\/source\/(.+)\/img\/', // 解析掉路径中的img/
                    name: '[1]/[name].[ext]'.replace(/\/img\/, '\/'/) + (PRO_ENV ? '?[hash:6]' : '')
                }
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                options: {
                    helperDirs: [
                        path.join(__dirname, './helpers')
                    ],
                    partialDirs: [
                        path.join(__dirname, '../superman/view/partial')
                    ]
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: PRO_ENV ? `${sourceBase}/[name].[chunkhash].css` : `${sourceBase}/[name].css`,
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            filename: PRO_ENV ? `${sourceBase}/lib.[hash].js` : `${sourceBase}/lib.js`,

            // 取node_modules或者global中被引用大于3次则加入lib（js或css）
            minChunks: function(module, count) {
                let resource = module.resource;

                return resource &&
                    (resource.indexOf('node_modules') > -1 || resource.indexOf('public/global/') > -1) &&
                    count >= 3;
            }
        }),
        function() {
            this.plugin('done', stats => {
                let chunks = stats.toJson().assetsByChunkName;

                fs.writeFileSync(
                    path.join(__dirname, '.manifest.json'),
                    JSON.stringify(_.mapValues(chunks, chunk => {

                        // 排除map文件
                        _.remove(chunk, the => _.endsWith(the, '.map'));
                        return chunk;
                    }))
                );
            });
        }
    ],
    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    }
};

// fonts loader
let fonts = ['woff', 'woff2', 'ttf', 'eot', 'svg'].map(icon => {
    let loader = 'file-loader';

    switch (icon) {
        case 'woff':
        case 'woff2':
            loader += '?mimetype=application/font-woff';
            break;
        case 'ttf':
            loader += '?mimetype=application/octet-stream';
            break;
        case 'svg':
            loader += '?mimetype=image/svg+xml';
            break;
        default:
            break;
    }
    return {
        test: new RegExp(`\\.${icon}(\\?v=\\d+\\.\\d+\\.\\d+)?$`),
        loader: loader,
        options: {
            context: path.join(__dirname, 'source/global/fontawesome/fonts'),
            outputPath: `${sourceBase}/icons/`,
            publicPath: `${domain}/`,
            name: '[path][name].[ext]' + (PRO_ENV ? '?[hash:6]' : '')
        }
    };
});

config.module.rules.splice(_.size(config.module.rules), 0, ...fonts);


if (PRO_ENV) {
    config.devtool = '#source-map';

    // plugins
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new OptimizeCssAssetsPlugin()
    ]);
}

module.exports = config;
