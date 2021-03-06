'use strict';

const path = require('path');

const express = require('express');
const hbs = require('express-hbs');

const app = express();

const view = '../../main/view';

app.engine('hbs', hbs.express4({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, view),
    defaultLayout: path.resolve(__dirname, view, 'layout/layout.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', [path.join(__dirname, 'view'), path.join(__dirname, view)]);

// router
app.use(require('./router'));

module.exports = app;