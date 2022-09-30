'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relays.
// GET /relays
// curl http://localhost:8000/v1/relays | jq
async function getRelayList(request, response) {
  let page = Number(request.query.page) || 0;
  let limit = Number(request.query.limit) || 20;

  const totalRelay = await model.getTotalRelay();
  const relays = await model.getRelayList(page, limit);
  const registeredLastChange24h = await model.getRegisteredLast24hChange();

  return response.status(HttpStatus.OK).json({
    content: [...relays],
    total: totalRelay || 0,
    registeredLastChange24h,
  });
}

module.exports = {
  getRelayList,
};
