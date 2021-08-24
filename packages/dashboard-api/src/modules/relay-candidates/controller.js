'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relay-candidates.
// GET /relay-candidates
// curl http://localhost:8000/v1/relay-candidates | jq
async function getRelayCandidateList(request, response) {
  const relays = await model.getRelayCandidates();

  return response.status(HttpStatus.OK).json({
    content: [...relays]
  });
}

// GET /relay-candidates/reward
// curl http://localhost:8000/v1/relay-candidates/reward | jq
async function getMonthlyReward(request, response) {
  return response.status(HttpStatus.OK).json({
    content: {
      totalAmount: await model.getTotalMonthlyReward(),
      last30DaysChange: await model.getRewardLast30DaysChange()
    }
  });
}

module.exports = {
  getRelayCandidateList,
  getMonthlyReward
};
