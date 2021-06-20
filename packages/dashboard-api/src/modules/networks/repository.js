'use strict';
const { pgPool, TRANSACTION_TBL_NAME, NETWORK_TBL_NAME} = require('../../common');


async function getTokensVolume24h() {
    const _24hours_ago = (new Date().getTime()*1000) - 86400000000;
    const {rows} = await pgPool.query(
      `SELECT nid, token_name, sum(value) as token_volume
       FROM ${TRANSACTION_TBL_NAME}
       WHERE timestamp >= ${_24hours_ago}
       GROUP BY(token_name, nid)`,
    );
    return rows;
  }
  
  async function getTokenVolumeAllTime() {
    const {rows} = await pgPool.query(
      `SELECT nid, token_name, sum(value) as token_volume
       FROM ${TRANSACTION_TBL_NAME}
       GROUP BY(token_name, nid)`,
    );
    return rows;
  }

  async function getNetworkInfo() {
    const {rows} = await pgPool.query(
      `SELECT * FROM ${NETWORK_TBL_NAME}`,
    );
    return rows;
  }

  module.exports =  {
    getNetworkInfo,
    getTokensVolume24h,
    getTokenVolumeAllTime
  };