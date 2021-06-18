'use strict';

const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider, IconBuilder, IconConverter } = require('icon-sdk-js');
const { logger } = require('../../common');
const { getAuctionById, getBidByAuctionId } = require('./repository');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);
const ICX_NUMBER = 10 ** 18;

// Ref: block-indexer/src/modules/icon-indexer/auctions.js
function createAuctionId(id) {
  return process.env.FEE_AGGREGATION_SCORE_ADDRESS + '_' + id;
}

async function getAuctionByName(name) {
  const callBuilder = new IconBuilder.CallBuilder();
  const txObject = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('getCurrentAuction')
    .params({ _tokenName: name })
    .build();

  try {
    const auction = await iconService.call(txObject).execute();
    debug(`Current auction ${name}: %O`, auction);

    return auction;
  } catch (error) {
    logger.error(`getAuctionByName failed ${name}`, { error });
    throw error;
  }
}

async function getCurrentAuctions() {
  const callBuilder = new IconBuilder.CallBuilder();
  const txObject = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('tokens')
    .build();

  const auctions = [];

  try {
    const tokens = await iconService.call(txObject).execute();
    debug('Registered tokens: ', tokens);

    for (let token of tokens) {
      const auction = await getAuctionByName(token.name);

      if (auction) {
        auctions.push({
          id: createAuctionId(IconConverter.toNumber(auction._id)),
          name: token.name,
          currentBidAmount: Math.floor(IconConverter.toNumber(auction._bidAmount) / ICX_NUMBER),
          availableBidAmount: Math.floor(IconConverter.toNumber(auction._tokenAmount) / ICX_NUMBER),
          endTime: Math.floor(IconConverter.toNumber(auction._endTime) / 1000) // _endTime in microsecond
        });
      }
    }

    return auctions;
  } catch (error) {
    logger.error('getCurrentAuctions failed', { error });
    throw error;
  }
}

async function getAuctionDetail(auctionId) {
  const auction = await getAuctionById(auctionId);

  if (!auction)
    return null;

  const bids = await getBidByAuctionId(auctionId);

  return {
    name: auction.tokenName,
    topBidder: bids.length > 0 ? bids[bids.length - 1].newBidder : auction.bidder,
    currentBidAmount: bids.length > 0 ? bids[bids.length - 1].newBidAmount : auction.bidAmount,
    availableBidAmount: auction.tokenAmount,
    createdTime: auction.createdTime,
    endTime: auction.endTime,
    bids: bids.map(b => ({
      id: b.id,
      bidder: b.newBidder,
      amount: b.newBidAmount,
      createdTime: b.createdTime
    }))
  };
}

module.exports = {
  getCurrentAuctions,
  getAuctionDetail
};
