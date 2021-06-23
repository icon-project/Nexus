'use strict';

const { logger } = require('../../common');

const { getNetworkInfo, getTokensVolume24h, getTokenVolumeAllTime, getVolumeToken24hByNid, getVolumeTokenAllTimeByNid} = require('./repository')
const { countNetwork } =  require('../btpnetwork/repository')
const { exchangeToFiat } = require('../../common/util');
const { get } = require('../btpnetwork/route');

async function getListNetworkConnectedIcon() {
    try {
      const networks = await getNetworkInfo();
      const tokensVolume24h = await getTokensVolume24h();
      const tokensVolumeAllTime = await getTokenVolumeAllTime();
  
      return await updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime);
    } catch (err) {
      logger.error(err, '"getListNetworkConnectedIcon" failed while getting total transaction');
      throw new Error('"getListNetworkConnectedIcon" job failed: ' + err.message);
    }
}

async function updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime) {
  const numberNetworks = await countNetwork();
  for (let networkInfo of networks) {
    let USD24h = 0;
    let USDAllTime = 0;
    for (let data of tokensVolume24h) {
      if (data.networkId == networkInfo.id) {
        let fiat = await exchangeToFiat(data.tokenName, ['USD'], parseInt(data.tokenVolume));
        USD24h += fiat.USD;
      }
    }

    for (let data of tokensVolumeAllTime) {
      if (data.networkId == networkInfo.id) {
        let fiat = await exchangeToFiat(data.tokenName, ['USD'], parseInt(data.tokenVolume));
        USDAllTime += fiat.USD;
      }
    }
    networkInfo.usd24h = USD24h;
    networkInfo.usdAllTime = USDAllTime;
  }
  return networks;
}

async function getListTokenRegisteredNetwork(id) {
  //TODO: using SC to get list tokens registered network
  switch(id) {
    case 0:
      return ["icx", "xrp", "eth", "bnb"];
    case 1:
      return ["edg", "ltc", "eth", "bnb"];
    case 2:
      return ["near", "bsh", "eth", "bnb"];
    case 3:
      return ["sol", "pol", "eth", "bnb"];
    default:
      logger.debug(`"getListTokenRegisteredNetwork" invalid network id: ${id}`);
      return [];
  } 
}

async function getNetworkById(id) {
    const tokens = await getListTokenRegisteredNetwork(id);
    let result = [];
    for (let name of tokens) {//getVolumeToken24hByNid, getVolumeTokenAllTimeByNid
      const token24h = await getVolumeToken24hByNid(name, id);
      const tokenAllTime = await getVolumeTokenAllTimeByNid(name, id);

      let USD24h = 0;
      let USDAllTime = 0;
      if(token24h > 0) {
        let fiat24h =  await exchangeToFiat(name , ['USD'], token24h);
        let fiatAllTime =  await exchangeToFiat(name , ['USD'], tokenAllTime);
        USD24h = fiat24h.USD;
        USDAllTime = fiatAllTime.USD;
      } else if(tokenAllTime > 0) {
        let fiatAllTime =  await exchangeToFiat(name , ['USD'], tokenAllTime);
        USDAllTime = fiatAllTime.USD;
      }
      result.push({
        nameToken: name,
        volume24h: token24h,
        volume24hUSD: USD24h,
        volumeAllTime: tokenAllTime,
        volumeAlTimeUSD: USDAllTime,
      });
    }
    return result;
}

module.exports =  {
    getListNetworkConnectedIcon,
    getNetworkById
}
