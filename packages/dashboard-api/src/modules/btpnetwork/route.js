'use strict';

const express = require('express');
const debug = require('debug')('api:btpnetwork');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getNetworkInfo, getPriceConversion } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getNetworkInfo));
router.get('/converter', asyncMiddleware(getPriceConversion));
module.exports = router;
