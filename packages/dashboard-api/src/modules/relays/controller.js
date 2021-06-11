'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relays.
// GET /relays
async function getRelayList(request, response) {
  let style = request.query.style;

  if (!style)
    style = 'list';

  switch (style) {
    case 'count':
      return await getTotalRelay(request, response);

    case 'reward':
      return response.sendStatus(HttpStatus.NotImplemented);

    case 'list':
      return response.sendStatus(HttpStatus.NotImplemented);

    default:
      return response.sendStatus(HttpStatus.BadRequest);
  }
}

// GET /relays?style=count
async function getTotalRelay(request, response) {
  const count = await model.getTotalRelay();

  return response.status(HttpStatus.OK).json({
    content: {
      count
    }
  });
}

module.exports = {
  getRelayList
};
