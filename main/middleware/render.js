/**
 * render重写
 * 根据模块解析静态资源并加载
 * @author: xuqi<xuqi@i0011.com>
 * @date: 2017/4/17
 */

'use strict';

const _ = require('lodash');
const config = require('../../config');

/**
 * 过滤css/js
 * @param manifest 过滤对象
 */
const splitManifest = (manifest) => {
    let js, css;

    if (manifest instanceof Array) {
        let group = _.groupBy(manifest, mani => {
            return _.endsWith(mani, '.js') ? 'js' : 'css';
        });

        js = group.js;

        css = group.css;
    } else {
        if (_.endsWith(manifest, '.js')) {
            js = [manifest];
        } else {
            css = [manifest];
        }
    }
    // 添加前缀
    return {
        js: _.map(js, theJs => `${config.static}/${theJs}`),
        css: _.map(css, theCss => `${config.static}/${theCss}`)
    };
};

/**
 * 从manifest解析静态资源文件名
 */
const getStatic = (manifests, module, page, ext) => {
    let lib = splitManifest(manifests.lib);
    let manifest = {};

    if (module && page) {
        manifest = splitManifest(manifests[`${module}.${page}`]);
    }

    let extJs = _.filter(ext, file => {
        return /\.js$/.test(file);
    });

    let extCss = _.filter(ext, file => {
        return /\.css$/.test(file);
    });

    // attention：合并数组时，lib在前
    return {
        js: _.concat(lib.js, manifest.js, extJs),
        css: _.concat(lib.css, manifest.css, extCss)
    };
};

module.exports = (manifests) => {

    return (req, res, next) => {
        let render = res.render;

        res.render = (view, options, cb) => {
            let {module, page, ext} = options;
            let myStatic = {};

            myStatic = getStatic(manifests, module, page, ext);
            if (req.cookies.auth_token) {
                myStatic.landed = true;
            }

            render.call(res, view, _.assign(options, myStatic), cb);
        };
        next();
    };
};
