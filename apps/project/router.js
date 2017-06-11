'use strict';

const router = require('express').Router();

const home = require('./controller/home');

router.get('/home',home.index);

module.exports = router;