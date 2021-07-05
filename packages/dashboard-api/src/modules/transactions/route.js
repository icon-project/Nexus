'use strict';

const express = require('express');
const debug = require('debug')('api:relays');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getTransHistory,getTransaction } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getTransHistory));
router.get('/:id', asyncMiddleware(getTransaction));
module.exports = router;
