/* eslint-disable quotes */
/* eslint-disable no-console */
'use strict';

const axios = require('axios');
const { Pool } = require('pg');
const { logger } = require('../common');
//1. Import coingecko-api
const CoinGecko = require('coingecko-api');
//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
});

async function getTokenList() {
  const query = 'SELECT coingecko_id, name FROM token_prices WHERE active=1 ORDER BY created_time';
  try {
    const { rows } = await pool.query(query);
    return rows.map(e => ({
      id: e.coingecko_id,
      name: e.name
    }));
  } catch (error) {
    logger.error('getTokenList fails to get token list %O', error);
    return [];
  }
}

async function getTokenPrice(tokens) {
  try {
    const prices = [];
    const tokensString = tokens.map(e => e.id).join();
    let response = await CoinGeckoClient.simple.price({ ids: tokensString });
    if (response.success === true) {
      for (const key in response.data) {
        for (let i = 0; i < tokens.length; i++) {
          if (tokens[i].id === key) {
            prices.push({
              ...tokens[i],
              price: response.data[key].usd
            });
            break;
          }
        }
      }
    }
    return prices;
  } catch (error) {
    logger.error('getTokenPrice fails to get price %O', error);
    return [];
  }
}

async function updateTokenPrice(prices) {
  try {
    const query = 'UPDATE token_prices SET price=$1, updated_time=NOW() WHERE coingecko_id=$2';
    const result = await Promise.all(
      prices.map(e => {
        return pool.query(query, [e.price, e.id]);
      })
    );
    return result;
  } catch (error) {
    logger.error('updateTokenPrice fails to update price %O', error);
  }
}

async function gettingTokenPrice() {
  logger.info("Getting token prices each 10 minutes.........." + (new Date()).toISOString());
  const tokens = await getTokenList();
  if (tokens.length > 0) {
    const prices = await getTokenPrice(tokens);
    if (prices.length > 0) {
      return await updateTokenPrice(prices);
    }
  }
}

module.exports = {
  gettingTokenPrice
};
