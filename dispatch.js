'use strict';

module.exports = app => {
    app.use('/project', require('./apps/project'));
};
