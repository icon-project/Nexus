'use strict';

const { IconConverter } = require('icon-sdk-js');
const { ICX_LOOP_UNIT } = require('./constants');

function propsAsString(object) {
  return Object.keys(object)
    .map(function (key) {
      return `"${object[key]}"`;
    })
    .join(', ');
}

function propsCountValueString(object) {
  return Object.keys(object)
    .map(function (key, index) {
      return `$${index + 1}`;
    })
    .join(', ');
}

function sortValuesWithPropsOrdered(objectGetValue, orderPropsObject) {
  return Object.keys(orderPropsObject).map(function (key) {
    return objectGetValue[key];
  });
}

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function hexToDecimal(hex) {
  return parseInt(hex.toString(16), 16);
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
  propsAsString,
  propsCountValueString,
  sortValuesWithPropsOrdered,
  getCurrentTimestamp,
  hexToDecimal,
  hexToFixedAmount,
  hexToIcxUnit
};
