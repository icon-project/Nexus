'use strict';

const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider, IconBuilder, IconConverter } = require('icon-sdk-js');
const { logger } = require('../../common');

const httpProvider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(httpProvider);
const ICX_NUMBER = 10 ** 18;

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
          id: IconConverter.toNumber(auction._id),
          name: token.name,
          currentBid: Math.floor(IconConverter.toNumber(auction._bidAmount) / ICX_NUMBER),
          availableBid: Math.floor(IconConverter.toNumber(auction._tokenAmount) / ICX_NUMBER),
          expiration: Math.floor(IconConverter.toNumber(auction._endTime) / 1000) // _endTime in microsecond
        });
      }
    }

    return auctions;
  } catch (error) {
    logger.error('getCurrentAuctions failed', { error });
    throw error;
  }
}

module.exports = {
  getCurrentAuctions
};
