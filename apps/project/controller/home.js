'use strict';

const _ = require('lodash');

const homeModel = require('../model/home');

const index = (req,res,next) => {
    return res.ctx(homeModel).getProjectHomeData().then(result =>  {
        res.render('home',result);
    }).catch(next);
}

module.exports = {
    index : index
}