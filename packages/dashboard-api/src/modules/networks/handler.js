'use strict';
const {countNetwork} =  require('../btpnetwork/repository')
const { exchangeToFiat } = require('../../common/util')

async function updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime) {
    let mTokens24h = new Map();
    let mTokensAllTime = new Map();
    const numberNetworks = await countNetwork();
    for( var i = 0; i < numberNetworks; i++ ){
      let USD24h = 0;
      let USDAllTime = 0;
      for(let data of tokensVolume24h) {
         if(data.nid == i) {
            let fiat = await exchangeToFiat(data.token_name, ['USD'], parseInt(data.token_volume));
            USD24h += fiat.USD;
          }
      }

      for(let data of tokensVolumeAllTime) {
        if(data.nid == i) {
            let fiat =  await exchangeToFiat(data.token_name, ['USD'], parseInt(data.token_volume));
            USDAllTime += fiat.USD;
          }
      }
      mTokens24h.set(i, USD24h);
      mTokensAllTime.set(i, USDAllTime);
    }

    for (let data of networks) {
      data.usd_24h = mTokens24h.get(parseInt(data.id));
      data.usd_all_time = mTokensAllTime.get(parseInt(data.id));
    }

    return networks;
}

module.exports = { 
  updateFiatVolume,
}