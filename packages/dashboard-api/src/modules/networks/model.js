'use strict';

const { logger, ONE_DAY_IN_MILLISECONDS } = require('../../common');
const {
  getNetworkInfo,
  getTokensVolume24h,
  getTokenVolumeAllTime,
  getVolumeToken24hByNid,
  getVolumeTokenAllTimeByNid,
  getTotalMintValue,
  getTotalBurnValue,
  getTokensbyNetworkId,
  getNetworkById: getNetworkByIdInDB,
  getTransactionsByNetworkIdAndTokenNames,
  getPricesByTokenNames
} = require('./repository');
const { tokenToUsd, numberToFixedAmount } = require('../../common/util');

async function getListNetworkConnectedIcon() {

  const results = await Promise.allSettled([getNetworkInfo(), getTotalMintValue(), getTotalBurnValue(), getTokensVolume24h(), getTokenVolumeAllTime()]);
  for (let item of results) {
    if (item.status === 'rejected') {
      logger.error('"getListNetworkConnectedIcon" failed while getting total transaction', item.reason);
      throw new Error('"getListNetworkConnectedIcon" job failed: ' + item.reason);
    }
  }

  const networks = results[0].value;
  const totalMintTokens = results[1].value;
  const totalBurnTokens = results[2].value;
  const tokensVolume24h = results[3].value;
  const tokensVolumeAllTime = results[4].value;

  return await updateFiatVolume(
    networks,
    tokensVolume24h,
    tokensVolumeAllTime,
    totalMintTokens,
    totalBurnTokens,
  );

}

async function updateFiatVolume(
  networks,
  tokensVolume24h,
  tokensVolumeAllTime,
  totalMintTokens,
  totalBurnTokens,
) {
  for (let networkInfo of networks) {
    let USD24h = 0;
    let USDAllTime = 0;
    let USDMint = 0;
    let USDBurn = 0;

    for (let data of tokensVolume24h) {
      if (data.networkId == networkInfo.id) {
        let fiat = await tokenToUsd(data.tokenName, Number(data.tokenVolume));
        USD24h += fiat;
      }
    }

    for (let data of tokensVolumeAllTime) {
      if (data.networkId == networkInfo.id) {
        let fiat = await tokenToUsd(data.tokenName, Number(data.tokenVolume));
        USDAllTime += fiat;
      }
    }

    for (let data of totalMintTokens) {
      if (data.networkId == networkInfo.id) {
        let fiat = await tokenToUsd(data.tokenName, Number(data.tokenValue));
        USDMint += fiat;
      }
    }

    for (let data of totalBurnTokens) {
      if (data.networkId == networkInfo.id) {
        let fiat = await tokenToUsd(data.tokenName, Number(data.tokenValue));
        USDBurn += fiat;
      }
    }

    networkInfo.usd24h = numberToFixedAmount(USD24h);
    networkInfo.usdAllTime = numberToFixedAmount(USDAllTime);
    networkInfo.mintFee = USDMint;
    networkInfo.burnFee = USDBurn;
  }
  return networks;
}

async function getNetworkById(networkId) {
  //	Get token_name from registered_tokens table related to networkId
  const tokens = (await getTokensbyNetworkId(networkId)).map(element => element.token_name);

  if (tokens.length === 0) return null;

  const result = [];

  for (let name of tokens) {
    //getVolumeToken24hByNid, getVolumeTokenAllTimeByNid
    const token24h = await getVolumeToken24hByNid(name, networkId);
    const tokenAllTime = await getVolumeTokenAllTimeByNid(name, networkId);

    let USD24h = 0;
    let USDAllTime = 0;

    if (token24h > 0) {
      USD24h = await tokenToUsd(name, token24h);
      USDAllTime = await tokenToUsd(name, tokenAllTime);
    } else if (tokenAllTime > 0) {
      USDAllTime = await tokenToUsd(name, tokenAllTime);
    }

    result.push({
      nameToken: name,
      volume24h: numberToFixedAmount(token24h),
      volume24hUSD: numberToFixedAmount(USD24h),
      volumeAllTime: numberToFixedAmount(tokenAllTime),
      volumeAlTimeUSD: numberToFixedAmount(USDAllTime),
    });
  }

  return result;
}

async function getNetworkByIdV2(networkId){
  const tokens = (await getTokensbyNetworkId(networkId)).map(element => element.token_name);
  
  const [transactions, prices] = await Promise.all([
    getTransactionsByNetworkIdAndTokenNames(networkId, tokens),
    getPricesByTokenNames(tokens),
  ]);

  const priceProperty = {};
  prices.forEach(price => {
    priceProperty[price.name] = price.price;
  });

  const at24hAgo = Date.now() - ONE_DAY_IN_MILLISECONDS;
  const result = [];
  tokens.forEach(token => {
    let volume24h = 0;
    let volume24hUSD = 0;
    let volumeAllTime = 0;
    let volumeAllTimeUSD = 0;

    transactions.forEach(transaction => {
      if(transaction.token_name !== token){
        return;
      }
      if(Number(transaction.block_time) >= at24hAgo){
        volume24h += Number(transaction.value);
      }
      volumeAllTime += Number(transaction.value);
    });
    volume24hUSD = Number(Number(volume24h * Number(priceProperty[token])).toFixed(2));
    volumeAllTimeUSD = Number(Number(volumeAllTime * Number(priceProperty[token])).toFixed(2));
    result.push({
      nameToken: token,
      volume24h: numberToFixedAmount(volume24h),
      volume24hUSD: numberToFixedAmount(volume24hUSD),
      volumeAllTime: numberToFixedAmount(volumeAllTime),
      volumeAlTimeUSD: numberToFixedAmount(volumeAllTimeUSD)
    });
  });
  return result;
}

// async function getPrices

module.exports = {
  getListNetworkConnectedIcon,
  getNetworkById,
  getNetworkByIdV2,
  getNetworkByIdInDB
};
