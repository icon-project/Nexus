'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relay-candidates.
// GET /relay-candidates
// curl http://localhost:8000/v1/relay-candidates | jq
async function getRelayCandidateList(request, response) {
  const relays = await model.getRelayCandidates();
  let rewardChanged30Days;

  if (request.query.rewardLast30Days == 'true') {
    let relayCANDs30DaysAgo = await model.getRelayCandidates30DaysAgo();
    rewardChanged30Days = model.calculateReward30DaysChanged(relays, relayCANDs30DaysAgo);
  }

  return response.status(HttpStatus.OK).json({
    content: [...relays],
    rewardChanged30Days,
  });
}

module.exports = {
  getRelayCandidateList,
};
