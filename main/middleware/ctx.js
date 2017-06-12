/**
 * 添加上下文中间件
 * @returns {function(*=, *=, *)}
 */
module.exports = () => {
    return (req, res, next) => {
        req.ctx = (Model) => {
            return new Model({req: req, res: res});
        };
        next();
    };
};