'use strict';

const express = require('express');
const debug = require('debug')('api:relays');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getRelayList, getRelayById } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getRelayList));
router.get('/:id', asyncMiddleware(getRelayById));
module.exports = router;
