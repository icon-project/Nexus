'use strict';

const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of registered relays.
// GET /relays
async function getTransHistory(request, response) {
  let page = Number(request.query.page) || 0;
  let limit = Number(request.query.limit) || 20;

  let transHistory = await model.getTrans(page, limit);

  if (!transHistory) return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: {
      ...transHistory,
    },
  });
}

module.exports = {
  getTransHistory,
};
