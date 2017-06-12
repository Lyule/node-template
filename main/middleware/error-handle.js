'use strict';

exports.notFound = () => {
    return (req, res, next) => {
        if (req.xhr) {
            return res.status(404).json({
                code: 404,
                message: '抱歉，页面不存在！'
            });
        }

        return res.status(404).render('error/404', {
            module: 'common',
            page: 'error',
            noHead: true,
            noFooter: true,
            title: '出错了，请稍后再来！'
        });
    };
};

/**
 * 服务器错误
 * @return {[type]}
 */
exports.serverError = () => {
    return (err, req, res, next) => {
        if (req.xhr) {
            return res.status(500).json({
                code: 500,
                message: '服务器错误！'
            });
        }

        return res.status(500).render('error/404', {
            module: 'common',
            page: 'error',
            noHead: true,
            noFooter: true,
            title: '出错了，请稍后再来！'
        });
        console.log(err)
        next(err);
    };
};
