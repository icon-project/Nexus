'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relays.
// GET /relays
async function getRelayList(request, response) {
  let style = request.query.style;

  if (!style) style = 'list';

  switch (style) {
    case 'count':
      return await getTotalRelay(request, response);

    case 'reward':
      return response.sendStatus(HttpStatus.NotImplemented);

    case 'list':
      return await getRelayDetailList(request, response);

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

  return response.status(HttpStatus.OK).json({
    content: [...relays],
  });
}

async function getRelayById(request, response) {
  const id = request.params.id;
  if (!id) {
    return response.sendStatus(HttpStatus.BadRequest);
  }
  const relay = await model.getRelayById(id);

  // TODO it should call to BMC to get total amount of monthly reward fund for Relay Candidate
  // follow this issue to get final discussion https://git.baikal.io/btp-dashboard/pm/-/issues/37
  // just the sameple data
  relay.monthlyReward = 12312312;

  return response.status(HttpStatus.OK).json({
    content: {
      ...relay,
    },
  });
}

module.exports = {
  getRelayList,
  getRelayById,
};
