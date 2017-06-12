/**
 * 全局配置
 */

'use strict';

const _ = require('lodash');

const env = process.env.NODE_ENV || 'development';

let config = {
    port: 5001,
    app: 'node-temlate',
    name: 'node-temlate',
    apiUrl: '',
    sourceBase: 'res',
    cookieDomain: 'localhost',
    loggers: {
        console: {
            level: 'debug',
            colorize: 'all',
            prettyPrint: true,
            handleExceptions: true
        },
        infoFile: {
            name: 'info',
            level: 'info',
            filename: 'logs/info.log',
            maxFiles: 7
        },
        errorFile: {
            name: 'error',
            level: 'error',
            filename: 'logs/error.log',
            handleExceptions: true
        }
    }
};

switch (env) {
    case 'production':
        try {
            const production = require('./production');

            _.extend(config, production);
        } catch (e) {
            throw 'production config file not exists';
        }
        break;
    case 'test':
        try {
            const test = require('./test');

            _.extend(config, test);
        } catch (e) {
            throw 'test config file not exists';
        }
        break;
    case 'javadev':
        try {
            const javadev = require('./javadev');

            _.extend(config, javadev);
        } catch (e) {
            throw 'javadev config file not exists';
        }
        break;
    default:
        try {
            const development = require('./development');

            _.extend(config, development);
        } catch (e) {
            throw 'development config file not exists';
        }
        break;
}

module.exports = config;