/* eslint-disable yoda */
'use strict';

const axios = require('axios');
const { IconConverter } = require('icon-sdk-js').default;
const { ICX_LOOP_UNIT, TRANSACTION_STATUS } = require('./constants');
const { createLogger } = require('./logger');

const logger = createLogger();

// Input: 0x1CBA2C95A76000
// Output: 0.00002021
function hexToIcxUnit(value) {
  return IconConverter.toNumber(value) / ICX_LOOP_UNIT;
}

// Convert to fixed asset value for displaying.
// Input: 0x63bf212b431ec0000
// Output: xx.yyyyyy (x and y are digits)
function hexToFixedAmount(value) {
  const icx = hexToIcxUnit(value);
  return Number(icx.toFixed(process.env.ASSET_FIXED_NUMBER));
}

async function tokenToUsd(name, value) {
  try {
    const result = await axios.get(process.env.DASHBOARD_API_URL + '/btpnetwork/converter', {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        token: name,
        amount: value,
        convert_to: 'usd'
      }
    });

    return 200 === result.status ? result.data.content[0].value : 0;
  } catch (error) {
    logger.error(`Fails to conver ${name} to USD`, { error });
    return 0;
  }
}

function logDbError(message, error) {
  logger.error(`${message}: (${error.message}, ${error.detail})`);
}

function getNameOfTransactionStatus(digit) {
  for (const [key, value] of Object.entries(TRANSACTION_STATUS)) {
    if (value === digit) {
      return key.toString();
    }
  }
  return '';
}

function parseIndexerHealthCheckPeriod() {
  const indexers = process.env.HEALTH_CHECK_PERIOD;
  return indexers.split('||').map(e => {
    const element = e.replace(' ', '');
    const indexer = element.split('|');
    return {
      networkId: indexer[0],
      name: indexer[1],
      period: parseInt(indexer[2], 10)
    };
  });
}

function isJSON(str) {
  try {
    return (!!str && typeof JSON.parse(str) === 'object');
  } catch (e) {
    return false;
  }
}

function formatReceiverAddress(address, networkId, tokenName) {
  const btpAddressRegex = /btp:\/\/0x[0-9]*\.[a-zA-Z0-9]*\/[a-zA-Z0-9]x[a-fA-F0-9]*/;
  if (btpAddressRegex.test(address)) {
    return address;
  }
  return `btp://${networkId}.${tokenName.toLowerCase()}/${address}`;
}

module.exports = {
  hexToFixedAmount,
  hexToIcxUnit,
  tokenToUsd,
  logDbError,
  getNameOfTransactionStatus,
  parseIndexerHealthCheckPeriod,
  isJSON,
  formatReceiverAddress
};
