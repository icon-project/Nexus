'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('../btpnetwork/model');

// GET /fees
// curl http://localhost:8000/v1/fees | jq
async function getCurrentFee(request, response) {
  const assets = await model.getAmountFeeAggregationSCORE();

  response.status(HttpStatus.OK).json({
    content: {
      assets: [...assets]
    }
  });
}

module.exports = {
  getCurrentFee
};
