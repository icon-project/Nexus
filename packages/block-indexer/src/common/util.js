'use strict';

const { IconConverter } = require('icon-sdk-js');
const { ICX_LOOP_UNIT } = require('./constants');

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

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

module.exports = {
  getCurrentTimestamp,
  hexToFixedAmount,
  hexToIcxUnit,
};
