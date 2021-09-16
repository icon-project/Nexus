'use strict';

const express = require('express');
const debug = require('debug')('api:transactions');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getTransHistory,getTransaction } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getTransHistory));
router.get('/:hash', asyncMiddleware(getTransaction));

module.exports = router;
