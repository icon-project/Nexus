/* eslint-disable indent */
'use strict';
const { logger } = require('../../common');
const { pgPool, TRANSACTION_TBL_NAME, NETWORK_TBL_NAME, REGISTERED_TOKENS_TABLE } = require('../../common');

async function getTokensVolume24h() {
  const at24hAgo = new Date().getTime() - 86400000; // current_time - 24h
  try {
    const { rows } = await pgPool.query(
      `SELECT network_id, token_name, sum(value) as token_volume
        FROM ${TRANSACTION_TBL_NAME}
        WHERE block_time >= ${at24hAgo} AND status = 1
        GROUP BY(token_name, network_id)`,
    );
    let result = [];
    for (let data of rows) {
      result.push({
        networkId: data.network_id,
        tokenName: data.token_name,
        tokenVolume: data.token_volume,
      });
    }
    return result;
  } catch (err) {
    logger.error('getTokensVolume24h fails', { err });
    throw err;
  }
}

async function getTokenVolumeAllTime() {
  try {
    const { rows } = await pgPool.query(
      `SELECT network_id, token_name, sum(value) as token_volume
        FROM ${TRANSACTION_TBL_NAME}
        WHERE status = 1
        GROUP BY(token_name, network_id)`,
    );
    let result = [];
    for (let data of rows) {
      result.push({
        networkId: data.network_id,
        tokenName: data.token_name,
        tokenVolume: data.token_volume,
      });
    }
    return result;
  } catch (error) {
    logger.error('getTokenVolumeAllTime fails', { error });
    throw error;
  }
}

async function getNetworkInfo() {
  try {
    const { rows } = await pgPool.query(`SELECT * FROM ${NETWORK_TBL_NAME}`);
    let result = [];
    for (let data of rows) {
      result.push({
        name: data.name,
        id: data.id,
        pathLogo: data.path_logo,
        url: data.url,
      });
    }
    return result;
  } catch (error) {
    logger.error('getNetworkInfo fails', { error });
    throw error;
  }
}

async function getTotalMintValue() {
  try {
    let result = [];
    const { rows } = await pgPool.query('SELECT DISTINCT ON (token_name) token_name, total_token_amount, network_id FROM minted_tokens ORDER BY token_name, create_at DESC');

    for (let data of rows) {
      result.push({
        tokenName: data.token_name,
        tokenValue: data.total_token_amount,
        networkId: data.network_id
      });
    }

    return result;
  } catch (error) {
    logger.error('getTotalMintValue fails', { error });
    throw error;
  }
}

async function getTotalBurnValue() {
  try {
    let result = [];

    const { rows } = await pgPool.query('SELECT DISTINCT ON (token_name) token_name, total_token_amount, network_id \
    FROM burned_tokens \
    ORDER BY token_name, create_at DESC');

    for (let data of rows) {
      result.push({
        tokenName: data.token_name,
        tokenValue: data.total_token_amount,
        networkId: data.network_id
      });
    }

    return result;
  } catch (error) {
    logger.error('getTotalBurnValue fails', { error });
    throw error;
  }
}

async function getNetworkById(id) {
  try {
    const { rows } = await pgPool.query(`SELECT * FROM ${NETWORK_TBL_NAME} WHERE id = $1`, [id]);
    let result = [];
    for (let data of rows) {
      result.push({
        name: data.name,
        id: data.id,
        nativeToken: data.native_token,
        pathLogo: data.path_logo,
        url: data.url,
      });
    }
    return result;
  } catch (error) {
    logger.error('getNetworkInfo fails', { error });
    throw error;
  }
}

async function getVolumeToken24hByNid(name, networkId) {
  try {
    const at24hAgo = new Date().getTime() - 24 * 60 * 60 * 1000; // current_time(milisecond) - 24h(milisecond)
    const {
      rows: [result],
    } = await pgPool.query(
      `SELECT sum(value) as token_volume
      FROM ${TRANSACTION_TBL_NAME}
      WHERE status = 1 AND block_time >= $1 AND network_id = $2 AND token_name = $3 `,
      [at24hAgo, networkId, name],
    );
    return Number(result.token_volume) || 0;
  } catch (error) {
    logger.error('getVolumeToken24hByNid fails', { error });
    throw error;
  }
}


async function getTokensbyNetworkId(networkId) {
  try {
    const { rows } = await pgPool.query(
      `SELECT token_name
      FROM ${REGISTERED_TOKENS_TABLE}
      WHERE network_id = $1`,
      [networkId]
    );

    return rows;
  } catch (error) {
    logger.error('getTokensbyNetworkId fails', { error });
    throw error;
  }
}

async function getVolumeTokenAllTimeByNid(name, networkId) {
  try {
    const {
      rows: [result],
    } = await pgPool.query(
      `SELECT sum(value) as token_volume
      FROM ${TRANSACTION_TBL_NAME}
      WHERE status = 1 AND network_id = $1 AND token_name = $2`,
      [networkId, name],
    );
    return Number(result.token_volume) || 0;
  } catch (error) {
    logger.error('getVolumeTokenAllTimeByNid fails', { error });
    throw error;
  }
}

async function getDataFromTable(tableName, conditions = {}, options = {}){
  try{
    let { select } = options;
    const { where = {} } = conditions;
    let whereQuery = '';
    select = select ? select.split(' ').join(', ') : '*';
    Object.keys(where).forEach((key, index) => {
      if(!index){
        return whereQuery += `${key} ${where[key]}`;
      }
      return whereQuery += ` AND ${key} ${where[key]}`;
    });

    const queryString = `SELECT ${select} FROM ${tableName} WHERE ${whereQuery}`;
    console.log('query string', queryString)
    const result = await pgPool.query(queryString);
    return result.rows;
  }
  catch(error){
    logger.error('getAllTransactionByNetworkId fails', { error });
    throw error;
  }
}

module.exports = {
  getNetworkInfo,
  getTokensVolume24h,
  getTokenVolumeAllTime,
  getVolumeToken24hByNid,
  getVolumeTokenAllTimeByNid,
  getNetworkById,
  getTotalMintValue,
  getTotalBurnValue,
  getTokensbyNetworkId,
  getDataFromTable,
};
