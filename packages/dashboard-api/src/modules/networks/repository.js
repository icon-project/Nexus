'use strict';
const { logger } = require('../../common');
const { pgPool, TRANSACTION_TBL_NAME, NETWORK_TBL_NAME} = require('../../common');


async function getTokensVolume24h() {
    const at24hAgo = (new Date().getTime()*1000) - 86400000000;
    try {
      const {rows} = await pgPool.query(
        `SELECT nid, token_name, sum(value) as token_volume
        FROM ${TRANSACTION_TBL_NAME}
        WHERE timestamp >= ${at24hAgo} AND confirmed = true
        GROUP BY(token_name, nid)`,
      );
      let result = [];
      for(let data of rows) {
          result.push({
          nid: data.nid,
          tokenName: data.token_name,
          tokenVolume: data.token_volume
        });
      }
      return result;
    } catch(error) {
      logger.error('getTokensVolume24h fails', { err });
      throw err;
    }
  }
  
  async function getTokenVolumeAllTime() {
    try {
      const {rows} = await pgPool.query(
        `SELECT nid, token_name, sum(value) as token_volume
        FROM ${TRANSACTION_TBL_NAME}
        WHERE confirmed = true
        GROUP BY(token_name, nid)`,
      );
      let result = [];
      for(let data of rows) {
          result.push({
          nid: data.nid,
          tokenName: data.token_name,
          tokenVolume: data.token_volume
        });
      }
      return result;
    } catch(error) {
      logger.error('getTokenVolumeAllTime fails', { err });
      throw err;
    }
  }

  async function getNetworkInfo() {
    try {
      const {rows} = await pgPool.query(
        `SELECT * FROM ${NETWORK_TBL_NAME}`,
      );
      let result = [];
      for(let data of rows) {
        const row = rows[0];
        result.push({
          name: data.name,
          id: data.id,
          pathLogo: data.path_logo,
          url: data.url,
          mintFee: Number(data.mint_fee),
          burnFee: Number(data.burn_fee),
        });
      }
      return result;
    } catch(error) {
      logger.error('getNetworkInfo fails', { err });
      throw err;
    }
  }

  async function getVolumeToken24hByNid(name, id) {
    const at24hAgo = (new Date().getTime()*1000) - 86400000000;
    const {
      rows: [result],
    } = await pgPool.query(
      `SELECT sum(value) as token_volume
      FROM ${TRANSACTION_TBL_NAME}
      WHERE confirmed = true AND timestamp >= $1 AND nid = $2 AND token_name = $3 `,
      [at24hAgo, id, name]
    );
    return Number(result.token_volume) || 0;
  }

  async function getVolumeTokenAllTimeByNid(name, id) {
    const {
      rows: [result],
    } = await pgPool.query(
      `SELECT sum(value) as token_volume
      FROM ${TRANSACTION_TBL_NAME}
      WHERE confirmed = true AND nid = $1 AND token_name = $2`,
      [id, name]
    );
    return Number(result.token_volume) || 0;
  }

  module.exports  =  {
    getNetworkInfo,
    getTokensVolume24h,
    getTokenVolumeAllTime,
    getVolumeToken24hByNid,
    getVolumeTokenAllTimeByNid
  };
