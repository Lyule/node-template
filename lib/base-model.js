'use strict';

const config = require('../config');
const Http = require('./http');

// 创建对象错误
const CREATE_MODEL_ERROR = 'No ctx,please add ctx with req and res!';

/**
 * 数据模型基类
 */
class BaseModel {
    constructor(ctx) {
        console.log(ctx.req)
        if (!ctx || !ctx.req || !ctx.res) {
            throw new Error(CREATE_MODEL_ERROR);
        }
        this.ctx = ctx;
        this.header = {
            'User-Agent': 'node'
        };
        this.api = new Http(ctx.apiUrl || config.apiUrl, {
            headers: this.header
        }, ctx);
    }
}
module.exports = BaseModel;