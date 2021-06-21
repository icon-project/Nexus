'use strict';
const { exchangeToFiat } = require('../../common/util')

const NUMBER_NETWORK = 4

async function updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime) {
    let mTokens24h = new Map();
    let mTokensAllTime = new Map();
    for( var i = 0; i < NUMBER_NETWORK; i++ ){
      let USD24h = 0;
      let USDAllTime = 0;
      for(let data of tokensVolume24h) {
         if(data.nid == i) {
            let value = parseInt(data.token_volume);
            let fiat = await exchangeToFiat(data.token_name, ['USD'], value);
            USD24h += fiat.USD;
          }
      }

      for(let data of tokensVolumeAllTime) {
        if(data.nid == i) {
            let value = parseInt(data.token_volume); 
            let fiat =  await exchangeToFiat(data.token_name, ['USD'], value);
            USDAllTime += fiat.USD;
          }
      }
      mTokens24h.set(i, USD24h);
      mTokensAllTime.set(i, USDAllTime);
    }

    for (let data of networks) {
      data.fiat24h = mTokens24h.get(parseInt(data.id));
      data.fiatAllTime = mTokensAllTime.get(parseInt(data.id));
    }

    return networks;
}
/*
function updateVolume24hVolumeAllTime(tokensVolume24h, tokensVolumeAllTime, nid) {
  const listTokens = getListTokenRegistered(nid);
  let result = [];
  for (let token of listTokens) {
    
    result.push(
      tokensVolume24h.token_id,
      token_name: tokensVolume24h.token_name,
      tokensVolume24h.token_value,
      tokensVolume24h.tx_numbers,
      	token_id:
	token_name:
	volume24h:
	volume24h_usd:
	volume_all_time:
	volume_all_time_usd:
      );
  }

}

function getListTokenRegistered(nid) {
  //TODO call SC to get list tokens registered in network
  switch(nid) {
    case 0:
      return ['icx', 'bnb', 'uni', 'eos', 'cake', 'doge'];
    case 1:
      return ['icx', 'bnb', 'uni', 'pol', 'near', 'xrp'];
    case 2:
      return ['icx', 'bnb', 'uni', 'link', 'near', 'xrp'];
    case 3:
      return ['icx', 'bnb', 'uni', 'ada', 'near', 'xrp'];
    default:
      return null;
  }
}

*/
module.exports = { 
  updateFiatVolume,
}