'use strict';

const path = require('path');

const express = require('express');
const hbs = require('express-hbs');

const helpers = global.app.helpers;

const app = express();

const view = '../../main/view';

Object.keys(helpers).forEach((name) => {
    hbs.registerHelper(name, helpers[name]);
});

app.engine('hbs', hbs.express4({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, view),
    defaultLayout: path.resolve(__dirname, view, 'layout/layout.hbs'),
    partialsDir: [path.resolve(__dirname, view, 'partial'), path.resolve(__dirname, 'view/partial')]
}));
app.set('view engine', 'hbs');
app.set('views', [path.join(__dirname, 'view'), path.join(__dirname, view)]);

// router
app.use(require('./router'));

module.exports = app;