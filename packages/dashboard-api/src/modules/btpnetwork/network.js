'use strict';
const { coinToUSD } = require('../../common/util')

const NUMBER_NETWORK = 4

function updateVolume24hVolumeAllTime(networks, tokensVolume24h, tokensVolumeAllTime) {
    let mTokens24h = new Map();
    let mTokensAllTime = new Map();
    for( var i = 0; i < NUMBER_NETWORK; i++ ){
      let volume24h = 0;
      let volumeAllTime = 0;
      for(let data of tokensVolume24h) {
         if(data.nid == i) {
            volume24h += coinToUSD(data.token_name, data.total_token)
         }
      }

      for(let data of tokensVolumeAllTime) {
        if(data.nid == i) {
           volumeAllTime += coinToUSD(data.token_name, data.total_token)
        }
      }
      mTokens24h.set(i, volume24h);
      mTokensAllTime.set(i, volumeAllTime);
    }

    for (let data of networks) {
      data.volume24h = mTokens24h.get(parseInt(data.id));
      data.vulume_all_time = mTokensAllTime.get(parseInt(data.id));
    }

    return networks;
}

module.exports = { 
    updateVolume24hVolumeAllTime,
}