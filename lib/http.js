'use strict';

const _ = require('lodash');

const promiseRequest = require('request-promise');
const urlJoin = require('url-join');

function Request() {
    return (options, ctx) => {
        return promiseRequest(options).then(result => {
            return result;
        }).catch(e => {
            console.log(e);
            return {};
        });
    }
}

function Http(url, opts, ctx) {
    this.request = new Request();
    this.opts = _.defaultsDeep(opts, Http.options);
    this.url = url;
    this.ctx = ctx;

    if (!this.url) {
        throw new Error('the url can not be empty.');
    }
}

Http.prototype.get = function(_path, data, opts) {
    opts = opts || {};
    console.log(this)
    let options = _.defaults(opts, {
        url: urlJoin(this.url, _path),
        method: 'GET',
        qs: data || {},
        timeout: 3000
    }, this.opts);

    return this.request(options, this.ctx);
};

Http.prototype.post = function(_path, data, opts) {
    opts = opts || {};

    let options = _.defaults(opts, {
        url: urlJoin(this.url, _path),
        method: 'POST',
        form: data,
        timeout: 3000
    }, this.opts);

    return this.request(options, this.ctx);
};

Http.options = {
    json: true,
    gzip: true
};

module.exports = Http;
