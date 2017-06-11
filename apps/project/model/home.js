'use strict';

const _ = require('lodash');


class home extends global.app.BaseModel {
    constructor (ctx) {
        super(ctx);
    }

    getProjectHomeData(){
        return Promise.all([
            this.api.get('/data/home.json')
        ]).then( result => {

            return result;

        })
    }
}

module.exports = home;