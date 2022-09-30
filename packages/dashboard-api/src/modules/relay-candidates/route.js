'use strict';

const express = require('express');
const debug = require('debug')('api:relay-candidates');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getRelayCandidateList, getMonthlyReward } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getRelayCandidateList));
router.get('/reward', asyncMiddleware(getMonthlyReward));

module.exports = router;
