'use strict';

const _ = require('lodash');
const request = require('request');


class home extends global.app.BaseModel {
    constructor (ctx) { // req ,res
        super(ctx);
    }

    getProjectHomeData(){
        return Promise.all([
            this.api.get('/data/home.json')
        ]).then( result => {
            homeModel
            return result;

        })
    }
}

module.exports = home;