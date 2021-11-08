'use strict';

const Web3 = require('web3');
const IconService = require('icon-sdk-js').default;
const { logger } = require('../../common');
const {
  getNetworkInfo,
  getTokensVolume24h,
  getTokenVolumeAllTime,
  getVolumeToken24hByNid,
  getVolumeTokenAllTimeByNid,
  getTotalMintValue,
  getTotalBurnValue,
  getTokensbyNetworkId
} = require('./repository');
const { tokenToUsd, numberToFixedAmount } = require('../../common/util');
const abiBshScore = require('./abi/abi.bsh_core.json');

const { HttpProvider, IconBuilder } = IconService;
const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);
const web3 = new Web3(process.env.MOONBEAM_API_URL);

async function getListNetworkConnectedIcon() {
  try {
    const networks = await getNetworkInfo();

    const totalMintTokens = await getTotalMintValue();
    const totalBurnTokens = await getTotalBurnValue();

    const tokensVolume24h = await getTokensVolume24h();
    const tokensVolumeAllTime = await getTokenVolumeAllTime();

    return await updateFiatVolume(
      networks,
      tokensVolume24h,
      tokensVolumeAllTime,
      totalMintTokens,
      totalBurnTokens,
    );
  } catch (err) {
    logger.error('"getListNetworkConnectedIcon" failed while getting total transaction', err);
    throw new Error('"getListNetworkConnectedIcon" job failed: ' + err.message);
  }
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
  //	Get token_name from token_info table related to networkId
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
};
