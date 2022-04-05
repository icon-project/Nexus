/* eslint-disable yoda */
'use strict';

const axios = require('axios');
const { IconConverter } = require('icon-sdk-js').default;
const { ICX_LOOP_UNIT } = require('./constants');
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

module.exports = {
  hexToFixedAmount,
  hexToIcxUnit,
  tokenToUsd,
  logDbError
};
