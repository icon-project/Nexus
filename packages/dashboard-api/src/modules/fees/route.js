'use strict';

const express = require('express');
const debug = require('debug')('api:fees');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getCurrentFee } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getCurrentFee));

module.exports = router;
