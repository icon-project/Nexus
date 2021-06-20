const express = require('express');
const debug = require('debug')('api:btpnetwork');
const { asyncMiddleware, debugLogMiddleware } = require('../../middlewares');
const { getNetworksInfo } = require('./controller');

let router = express.Router();

router.use(debugLogMiddleware(debug));
router.get('/', asyncMiddleware(getNetworksInfo));
module.exports = router;