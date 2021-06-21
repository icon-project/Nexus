const express = require('express');
const debug = require('debug')('api:btpnetwork');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getNetworksInfo, getNetworksInfoById } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getNetworksInfo));
router.get('/:id', asyncMiddleware(getNetworksInfoById));
module.exports = router;