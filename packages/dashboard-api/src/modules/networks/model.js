'use strict';

const { logger } = require('../../common');
const { updateFiatVolume } =  require('./handler')
const { getNetworkInfo, getTokensVolume24h, getTokenVolumeAllTime, getTokensByNid} = require('./repository')

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

async function getNetworkById(id) {
  let result = [];
  try {
    const tokens = await getTokensRegisteredNetwork(id);
    const tokens24h = await getTokensVolume24h(networks);
    const tokensAllTime = await getTokenVolumeAllTime();
    mTokens24h = createMapTokens24d(tokens24h)
    mTokenAllTime = createMapTokenAllTime(tokensAllTime)
    for(let token of tokens) {
      result.push({
        token_name : token,
        token24h: mTokens24h.get(token),
        token_all_time: mTokenAllTime.get(token),
        fiat24h: exchangeToFiat(token, ['USD'], token24h),
        fiat_all_time: exchangeToFiat(token, ['USD'], token_all_time)
      });
    }
    return result;
    //return updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime);
  } catch (err) {
    logger.error(err, '"getListNetworkConnectedIcon" failed while getting total transaction');
    throw new Error('"getListNetworkConnectedIcon" job failed: ' + err.message);
  }
}

module.exports =  {
    getListNetworkConnectedIcon,
}