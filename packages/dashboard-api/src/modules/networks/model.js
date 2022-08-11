'use strict';

const { logger } = require('../../common');
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

module.exports = {
  getListNetworkConnectedIcon,
  getNetworkById,
  getNetworkByIdInDB
};
