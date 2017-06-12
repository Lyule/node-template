'use strict';

const baseModel = require('./base-model');

const Http = require('./http');

/**
 * 公用方法类库
 *
 * @param {any} config
 */
function Lib(config) {
    this.config = config;
    this.Http = Http;
    this.BaseModel = baseModel;
}

const lib = {
    global(config, name) {
        name = name || 'application';
        global[name] = this.init(config);
    },
    init(config) {
        return new Lib(config);
    }
};

module.exports = lib;