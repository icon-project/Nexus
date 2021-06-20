'use strict';

const { logger } = require('../../common');
const { updateFiatVolume } =  require('./handler')
const { getNetworkInfo, getTokensVolume24h, getTokenVolumeAllTime} = require('./repository')

async function getListNetworkConnectedIcon() {
    try {
      const networks = await getNetworkInfo();
      const tokensVolume24h = await getTokensVolume24h();
      const tokensVolumeAllTime = await getTokenVolumeAllTime();
  
      return updateFiatVolume(networks, tokensVolume24h, tokensVolumeAllTime);
    } catch (err) {
      logger.error(err, '"getListNetworkConnectedIcon" failed while getting total transaction');
      throw new Error('"getListNetworkConnectedIcon" job failed: ' + err.message);
    }
}

module.exports =  {
    getListNetworkConnectedIcon,
}