'use strict';

const { IconConverter } = require('icon-sdk-js').default;
const logger = require('./logger');
const pool = require('./postgresql');
const { ICX_LOOP_UNIT } = require('./constants');

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

// Input: 0.000202138589
// Output: 0.000202
function numberToFixedAmount(value) {
  return Number(value.toFixed(process.env.ASSET_FIXED_NUMBER));
}

async function tokenToUsd(name, value) {
  const query = 'SELECT price FROM token_prices WHERE UPPER(name)=$1';

  try {
    const { rows } = await pool.query(query, [name.toUpperCase()]);

    if (rows[0]) {
      const price = Number(rows[0].price);
      const result = value * price;
      return Number(result.toFixed(2));
    }
  } catch (error) {
    logger.error(`tokenToUsd fails to convert ${value} ${name}`, { error });
  }

  return 0;
}

module.exports = {
  hexToFixedAmount,
  hexToIcxUnit,
  numberToFixedAmount,
  tokenToUsd,
};
