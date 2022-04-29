'use strict';

const express = require('express');
const debug = require('debug')('api:transaction-ips');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { createTransactionIP } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.post('/', asyncMiddleware(createTransactionIP));
module.exports = router;
