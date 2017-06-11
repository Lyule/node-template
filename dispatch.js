'use strict';

module.exports = app => {
    app.use('/common', require('./main/router')); // 通用

    app.use('/project', require('./apps/project')); //  项目
};
