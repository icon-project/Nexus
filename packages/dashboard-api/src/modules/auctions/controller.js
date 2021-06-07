'use strict';

const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of auctions currently in progress.
// GET /auctions
async function getCurrentAuctions(request, response) {
  const auctions = await model.getCurrentAuctions();

  response.status(HttpStatus.OK).json({
    content: [
      ...auctions
    ]
  });
}

// GET /auctions/:id
async function getAuctionDetail(request, response) {
  const auctionId = request.params.id;

  if (!auctionId)
    return response.sendStatus(HttpStatus.BadRequest);

  const auction = await model.getAuctionDetail(auctionId);

  if (!auction)
    return response.sendStatus(HttpStatus.NotFound);

  response.status(HttpStatus.OK).json({
    content: {
      ...auction
    }
  });
}

module.exports = {
  getCurrentAuctions,
  getAuctionDetail
};
