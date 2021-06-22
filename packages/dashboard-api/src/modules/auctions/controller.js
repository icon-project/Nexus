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

// POST /auctions
// curl -X POST http://localhost:8000/v1/auctions -H 'Content-Type: application/json' -d '{"tokenName":"SampleToken1406", "tokenAmount": 100}'
async function createNewAuction(request, response) {
  const schema = Joi.object({
    tokenName: Joi.string().required(),
    tokenAmount: Joi.number().required()
  }).unknown().required();

  const { error, value } = schema.validate(request.body);

  if (error)
    return response.sendStatus(HttpStatus.BadRequest);

  const result = await model.createNewAuction(value.tokenName, value.tokenAmount);

  if (404 === result) {
    return response.status(HttpStatus.NotFound).json({
      error: {
        message: 'Token not found'
      }
    });
  }

  response.status(HttpStatus.OK).json({
    content: {
      txResult: {
        ...result
      }
    }
  });
}

module.exports = {
  getCurrentAuctions,
  getAuctionDetail,
  createNewAuction
};
