'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('../btpnetwork/model');

// GET /fees
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
