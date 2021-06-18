
'use strict';
const { func } = require("@hapi/joi");
const rp = require('request-promise');
const { logger } = require('./index');


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
  const requestOptions = {
    method: 'GET',
    uri: `${process.env.COIN_MARKETCAP_API_URL}/cryptocurrency/info?symbol=${coinNames}`,
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_KEY,
    },
  };
  try {
    let response = JSON.parse(await rp(requestOptions));
    if (response.status.error_code != 0) {
      logger.error('API call error:', response.status.error_message);
    }
    return response.data || {};
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

  const requestOptions = {
    method: 'GET',
    uri: `${process.env.COIN_MARKETCAP_API_URL}/tools/price-conversion?amount=${amount}&convert=${fiatString}&id=${coinInfo.id}`,
    headers: {
      'X-CMC_PRO_API_KEY': process.env.COIN_MARKETCAP_KEY,
    },
  };

  try {
    let response = JSON.parse(await rp(requestOptions));
    if (response.status.error_code != 0) {
      logger.error('API call error:', response.status.error_message);
    }

    if (response.data && response.data[coinInfo.id]) {
      let pricingInfos = response.data[coinInfo.id].quote;
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

function coinToUSD(token_name, number_token) {
  // TODO: using api in coinmarketcap
  return Math.floor(Math.random() * 1000) + number_token;
}

module.exports = {
  propsAsString,
  propsCountValueString,
  sortValuesWithPropsOrdered,
  getCurrentTimestamp,
  hexToDecimal,
  coinToUSD,
  getCoinInfo,
  exchangeToFiat,
};
