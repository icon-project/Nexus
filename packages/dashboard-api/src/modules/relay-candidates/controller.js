'use strict';
const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relay-candidates.
// GET /relay-candidates
// curl http://localhost:8000/v1/relay-candidates | jq
async function getRelayCandidateList(request, response) {
  let page = Number(request.query.page) || 0;
  let limit = Number(request.query.limit) || 20;

  const relays = await model.getRelayCandidates(page, limit);
  const total = await model.getTotalRelayCandidates();

  return response.status(HttpStatus.OK).json({
    content: [...relays],
    total,
  });
}

// GET /relay-candidates/reward
// curl http://localhost:8000/v1/relay-candidates/reward | jq
async function getMonthlyReward(request, response) {
  return response.status(HttpStatus.OK).json({
    content: {
      totalAmount: await model.getTotalMonthlyReward(),
      last30DaysChange: await model.getRewardLast30DaysChange(),
    },
  });
}

module.exports = {
  getRelayCandidateList,
  getMonthlyReward,
};
