'use strict';

const _ = require('lodash');

const homeModel = require('../model/home');

const index = (req, res, next) => {
    res.render('home', {
        module: 'project',
        page: 'home',
        noFooter: true
    });
}

const info = (req, res, next) => {
    return res.ctx().getProjectHomeData().then( data =>  {
        res.send(data);
    })
}

module.exports = {
    index: index,
    info: info
}