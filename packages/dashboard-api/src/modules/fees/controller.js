'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');
const btpNetworkModel = require('../btpnetwork/model');

// GET /fees
// curl http://localhost:8000/v1/fees | jq
// curl http://localhost:8000/v1/fees?availableAmountLast24h=1 | jq
async function getCurrentFee(request, response) {
  if (request.query.availableAmountLast24h) {
    const last24hChange = await model.getAvailableFeeChangeLast24h();

    response.status(HttpStatus.OK).json({
      content: {
        last24hChange
      }
    });
  } else {
    const result = await btpNetworkModel.getAmountFeeAggregationSCORE();

    response.status(HttpStatus.OK).json({
      content: {
        assets: [...result.assets]
      }
    });
  }
}

module.exports = {
  getCurrentFee
};
