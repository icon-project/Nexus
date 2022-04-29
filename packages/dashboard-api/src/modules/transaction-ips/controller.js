/* eslint-disable indent */
'use strict';

const HttpStatus = require('@tiendq/http-status');
const _ = require('lodash');
const model = require('./model');
const requestIp = require('request-ip');
const { getNetworkInCache } = require('./model');

async function createTransactionIP(request, response) {
  // client's ip when receive request
  const clientIp = requestIp.getClientIp(request);
  // transaction hash
  const txHash = _.get(request, 'body.txHash', null);
  // network's id
  const networkId = _.get(request, 'body.network', null);
  // this param for checking transaction hash related to NEAR nework
  const signerId = _.get(request, 'body.signerId', null);

  // Check network_id
  if (!networkId) {
    return response.status(HttpStatus.BadRequest).json({
      network: 'required'
    });
  }

  const network = await getNetworkInCache(networkId);
  if (!network) {
    return response.status(HttpStatus.BadRequest).json({
      network: 'invalid'
    });
  }

  // check tx_hash exists in database
  const txHashInDB = await model.getTransactionIP(txHash, clientIp, networkId);
  if (txHashInDB) {
    return response.status(HttpStatus.OK).json(null);
  }

  // Check transaction object on blockchain
  const txObject = await model.getTransactionReceipt({ txHash, networkId, signerId });
  if (!txObject) {
    return response.status(HttpStatus.BadRequest).json({
      txHash: 'invalid'
    });
  }

  const result = await model.createTransactionIP(txHash, clientIp, networkId);
  return response.status(HttpStatus.OK).json(result);
}

module.exports = {
  createTransactionIP,
};
