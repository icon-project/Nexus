'use strict';

const { logger } = require('../../common');
const { getNetworkInfo, getTokensVolume24h, getTokenVolumeAllTime} = require('./repository')
const {countNetwork} =  require('../btpnetwork/repository')
const { exchangeToFiat } = require('../../common/util')

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
  let mapTokens24h = new Map();
  let mapTokensAllTime = new Map();
  const numberNetworks = await countNetwork();
  for( var i = 0; i < numberNetworks; i++ ){
    let USD24h = 0;
    let USDAllTime = 0;
    for(let data of tokensVolume24h) {
       if(data.nid == i) {
          let fiat = await exchangeToFiat(data.tokenName, ['USD'], parseInt(data.tokenVolume));
          USD24h += fiat.USD;
        }
    }

    for(let data of tokensVolumeAllTime) {
      if(data.nid == i) {
          let fiat =  await exchangeToFiat(data.tokenName, ['USD'], parseInt(data.tokenVolume));
          USDAllTime += fiat.USD;
        }
    }
    mapTokens24h.set(i, USD24h);
    mapTokensAllTime.set(i, USDAllTime);
  }

    for (let data of networks) {
      data.usd24h = mapTokens24h.get(parseInt(data.id));
      data.usdAllTime = mapTokensAllTime.get(parseInt(data.id));
    }

  return networks;
}

module.exports =  {
    getListNetworkConnectedIcon,
}