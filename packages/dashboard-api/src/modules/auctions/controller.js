'use strict';

const Joi = require('@hapi/joi');
const HttpStatus = require('@tiendq/http-status');
const model = require('./model');

// Show the list of auctions currently in progress.
// GET /auctions
// curl http://localhost:8000/v1/auctions | jq
// curl http://localhost:8000/v1/auctions?availableAssets=1 | jq
async function getCurrentAuctions(request, response) {
  if (request.query.availableAssets) {
    const assets = await model.getAvailableAssetsToAuction();

    response.status(HttpStatus.OK).json({
      content: [
        ...assets
      ]
    });
  } else {
    const auctions = await model.getCurrentAuctions();

    response.status(HttpStatus.OK).json({
      content: [
        ...auctions
      ]
    });
  }
}

// GET /auctions/:id
// curl http://localhost:8000/v1/auctions/cx51291cbe0fff966b881d251b9414e54f5a02dac7_3 | jq
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

// GET /auctions/:id/bids
// curl http://localhost:8000/v1/auctions/cx51291cbe0fff966b881d251b9414e54f5a02dac7_1/bids
// curl http://localhost:8000/v1/auctions/cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e_3/bids?limit=5
// curl http://localhost:8000/v1/auctions/cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e_3/bids?limit=5&offset=0
async function getBidHistory(request, response) {
  const auctionId = request.params.id;

  if (!auctionId)
    return response.sendStatus(HttpStatus.BadRequest);

  let limit = request.query.limit;

  if (limit) {
    limit = Number(limit);

    if (Number.isNaN(limit) || limit <= 0)
      return response.sendStatus(HttpStatus.BadRequest);
  } else {
    limit = 25;
  }

  let offset = request.query.offset;

  if (offset) {
    offset = Number(offset);

    if (Number.isNaN(offset) || offset < 0)
      return response.sendStatus(HttpStatus.BadRequest);
  } else {
    offset = 0;
  }

  const result = await model.getBidHistory(auctionId, limit, offset);

  response.status(HttpStatus.OK).json({
    content: result.items,
    metadata: {
      pagination: result.pagination
    }
  });
}

// POST /auctions
// curl -X POST http://localhost:8000/v1/auctions -H 'Content-Type: application/json' -d '{"tokenName":"Sample2", "tokenAmount": 10.0906224229}'
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
  createNewAuction,
  getBidHistory
};
