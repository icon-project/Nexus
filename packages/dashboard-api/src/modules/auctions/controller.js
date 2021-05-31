'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of auctions currently in progress.
async function getCurrentAuctions(request, response) {
  const auctions = await model.getCurrentAuctions();

  response.status(HttpStatus.OK).json({
    content: [
      ...auctions
    ]
  });
}

module.exports = {
  getCurrentAuctions
};
