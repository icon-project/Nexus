'use strict';

const axios = require('axios');
const { IconConverter } = require('icon-sdk-js');
const { logger } = require('./index');
const { ICX_LOOP_UNIT } = require('./constants');

const COIN_MARKET_CAP_URL =
  process.env.PRO_COIN_MARKETCAP_API_URL || process.env.SANDBOX_COIN_MARKETCAP_API_URL;
const COIN_MARKET_CAP_KEY =
  process.env.PRO_COIN_MARKETCAP_API_KEY || process.env.SANDBOX_COIN_MARKETCAP_API_KEY;

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
/**
 * Get coin info
 * @reference https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyInfo
 * @param {*} coins array of coin names Ex: ['BTC','ICX']
 */
async function getCoinInfo(coins) {
  let coinNames = '';
  if (Array.isArray(coins)) {
    coinNames = coins.join(',');
  }

  try {
    let { data } = await axios.get(
      `${COIN_MARKET_CAP_URL}/cryptocurrency/info?symbol=${coinNames}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': COIN_MARKET_CAP_KEY,
        },
      },
    );
    if (data.status.error_code != 0) {
      logger.error('API call error:', data.status.error_message);
    }
    return data.data || {};
  } catch (error) {
    logger.error('API call error:', error.message);
    return {};
  }
}

/**
 * Exchange coin to fiats
 * @reference https://coinmarketcap.com/api/documentation/v1/#operation/getV1ToolsPriceconversion
 * @param {*} coinName coin name Ex: 'ICX'
 * @param {*} fiatNames fiat names Ex: ['USD','LTC','GBP']
 * @param {*} amount amount of coin Ex: 10000
 * @returns {*}
 * {
 *  GBP: 100000.0000,
 *  USD: 11234.12314,
 *  LTC: 1313123.123123,
 * }
 */
async function exchangeToFiat(coinName, fiatNames, amount) {
  let prices = {};

  let fiatString = fiatNames.join(',');

  coinName = coinName.toUpperCase();
  const coinInfo = (await getCoinInfo([coinName]))[coinName];

  try {
    let { data } = await axios.get(
      `${COIN_MARKET_CAP_URL}/tools/price-conversion?amount=${amount}&convert=${fiatString}&id=${coinInfo.id}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': COIN_MARKET_CAP_KEY,
        },
      },
    );
    if (data.status.error_code != 0) {
      logger.error('API call error:', data.status.error_message);
    }

    if (data.data) {
      let pricingInfos = data.data[coinInfo.id] ? data.data[coinInfo.id].quote : data.data.quote;
      for (const key in pricingInfos) {
        prices[key] = pricingInfos[key].price;
      }
    }
    return prices;
  } catch (error) {
    logger.error('API call error:', error.message);
    return {};
  }
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

// Input: 0.000202138589
// Output: 0.000202
function numberToFixedAmount(value) {
  return Number(value.toFixed(process.env.ASSET_FIXED_NUMBER));
}

module.exports = {
  propsAsString,
  propsCountValueString,
  sortValuesWithPropsOrdered,
  getCurrentTimestamp,
  hexToDecimal,
  getCoinInfo,
  exchangeToFiat,
  hexToFixedAmount,
  hexToIcxUnit,
  numberToFixedAmount
};
