'use strict';

const express = require('express');
const debug = require('debug')('api:relays');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getRelayCandidateList } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getRelayCandidateList));
module.exports = router;
