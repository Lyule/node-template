'use strict';

const _ = require('lodash');

const homeModel = require('../model/home');

const index = (req, res, next) => {
    return req.ctx(homeModel).getProjectHomeData().then( result =>  {
        
        res.render('home', {
            module: 'project',
            page: 'home',
            noFooter: true,
            info: result
        });
    }).catch(next);
}

const info = (req, res, next) => {
    return req.ctx(homeModel).getProjectHomeData().then( data =>  {
        res.send(data);
    })
}

module.exports = {
    index: index,
    info: info
}