'use strict';

const { logger } = require('../../common');
const {
  getNetworkInfo,
  getTokensVolume24h,
  getTokenVolumeAllTime,
  getVolumeToken24hByNid,
  getVolumeTokenAllTimeByNid,
} = require('./repository');
const { tokenToUsd, numberToFixedAmount } = require('../../common/util');
const IconService = require('icon-sdk-js');
const { HttpProvider, IconBuilder } = IconService;

const provider = new HttpProvider(process.env.ICON_API_URL);
const iconService = new IconService(provider);

const Web3 = require('web3');

const { abiBSHScore } = require('../../../scripts/bsh_score.json');

const web3 =  new Web3(process.env.MOONBEAM_RPC_PROVIDER_URL);

async function getTokensRegisteredMoonbeam() {
  const BSHContract = new web3.eth.Contract(abiBSHScore, process.env.BSH_SCORE_MOONBEAM);

  try {
    const listTokens = await BSHContract.methods.coinNames().call();

    return listTokens;
  } catch (error) {
    logger.error('getTokensRegisteredMoonbeam failed', { error });
    throw error;
  }
}

async function getListTokensRegisteredIcon() {
  const callBuilder = new IconBuilder.CallBuilder();
  const call = callBuilder.to(process.env.NATIVE_COIN_BSH_SCORE).method('coinNames').build();

  try {
    const listTokens = await iconService.call(call).execute();

    return listTokens;
  } catch (error) {
    logger.error('getListTokensRegisteredIcon failed', { error });
    throw error;
  }
}

async function getListNetworkConnectedIcon() {
  try {
    const networks = await getNetworkInfo();
    const tokensVolume24h = await getTokensVolume24h();
    const tokensVolumeAllTime = await getTokenVolumeAllTime();

    return await updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime);
  } catch (err) {
    logger.error('"getListNetworkConnectedIcon" failed while getting total transaction', err);
    throw new Error('"getListNetworkConnectedIcon" job failed: ' + err.message);
  }
}

async function updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime) {
  for (let networkInfo of networks) {
    let USD24h = 0;
    let USDAllTime = 0;
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
    networkInfo.usd24h = numberToFixedAmount(USD24h);
    networkInfo.usdAllTime = numberToFixedAmount(USDAllTime);
  }
  return networks;
}

/*===
 *  TODO: Using function BSH contract to get list tokens registered in network.
 *  Currently BSH contract not available to use, now this function just for test
===*/
async function getListTokenRegisteredNetwork(networkId) {
  switch (networkId) {
  case '0x1':
    return ['icx', 'xrp', 'eth', 'bnb'];
  case '0x501':
    return await getTokensRegisteredMoonbeam();
  case '0x3':
    return await getListTokensRegisteredIcon();
  case '0x4':
    return ['sol', 'pol', 'eth', 'bnb'];
  default:
    logger.debug(`"getListTokenRegisteredNetwork" invalid network id: ${networkId}`);
    return [];
  }
}

async function getNetworkById(networkId) {
  const tokens = await getListTokenRegisteredNetwork(networkId);
  let result = [];

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
