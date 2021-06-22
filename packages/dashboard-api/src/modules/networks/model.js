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
  const numberNetworks = await countNetwork();
  for( let networkInfo of networks){
    let USD24h = 0;
    let USDAllTime = 0;
    for(let data of tokensVolume24h) {
       if(data.nid == networkInfo.id) {
          let fiat = await exchangeToFiat(data.tokenName, ['USD'], parseInt(data.tokenVolume));
          USD24h += fiat.USD;
        }
    }

    for(let data of tokensVolumeAllTime) {
      if(data.nid == networkInfo.id) {
          let fiat =  await exchangeToFiat(data.tokenName, ['USD'], parseInt(data.tokenVolume));
          USDAllTime += fiat.USD;
        }
    }
    networkInfo.usd24h = USD24h;
    networkInfo.usdAllTime = USDAllTime;
  }
  return networks;
}

module.exports =  {
    getListNetworkConnectedIcon,
}