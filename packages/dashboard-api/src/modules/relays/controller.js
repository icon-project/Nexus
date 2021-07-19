'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relays.
// GET /relays
// curl http://localhost:8000/v1/relays | jq
async function getRelayList(request, response) {
  let style = request.query.style || 'list';

  switch (style) {
    case 'count':
      return await getTotalRelay(request, response);

    case 'reward':
      return response.sendStatus(HttpStatus.NotImplemented);

    case 'list':
      return await getRelayDetailList(request, response);

    case 'registeredLast24h':
      return await getRegisteredRelayChange(request, response);

    default:
      return response.sendStatus(HttpStatus.BadRequest);
  }
}

// GET /relays?style=count
async function getTotalRelay(request, response) {
  const count = await model.getTotalRelay();

  return response.status(HttpStatus.OK).json({
    content: {
      count,
    },
  });
}

// GET /relays
async function getRelayDetailList(request, response) {
  const relays = await model.getRelayList();
  let rewardLast24h;

  if (request.query.rewardLast24h == 1) {
    let relays24hAgo = await model.getRelayList24hAgo();
    rewardLast24h = model.calculateReward24hChanged(relays, relays24hAgo);
  }

  return response.status(HttpStatus.OK).json({
    content: [...relays],
    rewardLast24h,
  });
}

// GET /relays?style=registeredLast24h
async function getRegisteredRelayChange(request, response) {
  const last24hChange = await model.getRegisteredChangeLast24h();

  response.status(HttpStatus.OK).json({
    content: {
      last24hChange,
    },
  });
}

module.exports = {
  getRelayList,
};
