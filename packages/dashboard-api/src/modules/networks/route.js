const express = require('express');
const debug = require('debug')('api:networks');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getNetworksInfo, getNetworkInfoByIdV2 } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getNetworksInfo));
router.get('/:id', asyncMiddleware(getNetworkInfoByIdV2));

module.exports = router;
