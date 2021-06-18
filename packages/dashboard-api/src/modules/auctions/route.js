'use strict';

const express = require('express');
const debug = require('debug')('api:auctions');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getCurrentAuctions, getAuctionDetail } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getCurrentAuctions));
router.get('/:id', asyncMiddleware(getAuctionDetail));

module.exports = router;
