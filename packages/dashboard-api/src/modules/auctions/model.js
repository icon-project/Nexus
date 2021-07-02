'use strict';

const fs = require('fs');
const debug = require('debug')('icon');
const IconService = require('icon-sdk-js');
const { HttpProvider, IconBuilder, IconConverter, IconAmount, IconWallet, SignedTransaction } = require('icon-sdk-js');
const { logger } = require('../../common');
const { getAuctionById, getBidByAuctionId, getTopBidder } = require('./repository');

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

async function getAvailableBalance(name) {
  const callBuilder = new IconBuilder.CallBuilder();
  const txObject = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('availableBalance')
    .params({ _tokenName: name })
    .build();

  try {
    const balance = await iconService.call(txObject).execute();
    const value = Math.floor(IconConverter.toNumber(balance) / ICX_NUMBER);
    debug(`Current balance ${name}: %s %d`, balance, value);

    return value;
  } catch (error) {
    logger.error(`getAvailableBalance failed ${name}`, { error });
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

  const bid = await getTopBidder(auctionId);

  return {
    name: auction.tokenName,
    topBidder: bid ? bid.newBidder : auction.bidder,
    currentBidAmount: bid ? bid.newBidAmount : auction.bidAmount,
    availableBidAmount: auction.tokenAmount,
    createdTime: auction.createdTime,
    endTime: auction.endTime
  };
}

async function getRegisteredTokens() {
  const callBuilder = new IconBuilder.CallBuilder();
  const txObject = callBuilder
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .method('tokens')
    .build();

  const tokens = await iconService.call(txObject).execute();
  debug('Registered tokens: ', tokens);

  return tokens;
}

async function transferToken(tokenContract, tokenAmount) {
  const keystore = JSON.parse(fs.readFileSync(process.env.GOD_WALLET_FILENAME));
  const wallet = IconWallet.loadKeystore(keystore, process.env.GOD_WALLET_PASSWORD);
  const { CallTransactionBuilder } = IconBuilder;

  const txObj = new CallTransactionBuilder()
    .from(wallet.getAddress())
    .to(tokenContract)
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(3))
    .version(IconConverter.toBigNumber(3))
    .timestamp((new Date()).getTime() * 1000)
    .method('transfer')
    .params({
      _to: process.env.FEE_AGGREGATION_SCORE_ADDRESS,
      _value: IconConverter.toHex(IconAmount.of(tokenAmount, IconAmount.Unit.ICX).toLoop())
    })
    .build();

  const signedTransaction = new SignedTransaction(txObj, wallet);
  const txHash = await iconService.sendTransaction(signedTransaction).execute();

  return txHash;
}

async function placeBid(tokenName, bidAmount) {
  const keystore = JSON.parse(fs.readFileSync(process.env.TEST_WALLET_FILENAME));
  const wallet = IconWallet.loadKeystore(keystore, process.env.TEST_WALLET_PASSWORD);
  const { CallTransactionBuilder } = IconBuilder;

  const txObj = new CallTransactionBuilder()
    .from(wallet.getAddress())
    .to(process.env.FEE_AGGREGATION_SCORE_ADDRESS)
    .value(IconConverter.toHex(IconAmount.of(bidAmount, IconAmount.Unit.ICX).toLoop())) // minimum bid 100 ICX
    .stepLimit(IconConverter.toBigNumber(1000000000))
    .nid(IconConverter.toBigNumber(3))
    .version(IconConverter.toBigNumber(3))
    .timestamp((new Date()).getTime() * 1000)
    .method('bid')
    .params({
      _tokenName: tokenName
    })
    .build();

  const signedTransaction = new SignedTransaction(txObj, wallet);
  const txHash = await iconService.sendTransaction(signedTransaction).execute();

  return txHash;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// - Get list of registered tokens
// - Get token contract
// - Transfer token
// - Make a bid
async function createNewAuction(tokenName, tokenAmount) {
  let tokens = await getRegisteredTokens();

  if (!tokens || 0 === tokens.length)
    return 404; // token not found

  tokens = tokens.filter(t => tokenName === t.name);

  if (0 === tokens.length)
    return 404; // token not found

  logger.info(`Transferring ${tokenAmount} ${tokenName}`);
  let txHash = await transferToken(tokens[0].address, tokenAmount);

  await sleep(5000);

  let result = await iconService.getTransactionResult(txHash).execute();

  if (1 !== result.status)
    return result;

  logger.info(`Bidding 100 ${tokenName}`);
  txHash = await placeBid(tokenName, 100);

  await sleep(5000);

  result = await iconService.getTransactionResult(txHash).execute();

  logger.info(`Created a new auction for ${tokenName}`, { txResult: result });
  return result;
}

async function getAvailableAssetsToAuction() {
  const tokens = await getRegisteredTokens();
  const result = [];

  for (const token of tokens) {
    const auction = await getAuctionByName(token.name);

    if (!auction) {
      const value = await getAvailableBalance(token.name);

      if (value > 0) {
        result.push({
          name: token.name,
          value
        });
      }
    }
  }

  return result;
}

async function getBidHistory(auctionId, limit, offset) {
  const result = await getBidByAuctionId(auctionId, limit, offset);

  if (!result) {
    return {
      items: [],
      pagination: {
        limit,
        offset,
        totalItem: 0
      }
    };
  }

  return {
    items: result.items.map(b => ({
      id: b.id,
      bidder: b.newBidder,
      amount: b.newBidAmount,
      createdTime: b.createdTime
    })),
    pagination: {
      limit,
      offset,
      totalItem: result.totalItem
    }
  };
}

module.exports = {
  getCurrentAuctions,
  getAuctionDetail,
  createNewAuction,
  getAvailableAssetsToAuction,
  getBidHistory
};
