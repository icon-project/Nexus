'use strict';

const axios = require('axios');
const { Pool } = require('pg');

// Ref: https://node-postgres.com/features/connecting
const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_URL,
});

/*
Test: https://coinmarketcap.com/converter/

Ref:
https://coinmarketcap.com/api/v1/#section/Standards-and-Conventions
https://coinmarketcap.com/api/documentation/v1/#operation/getV1ToolsPriceconversion

Example: 1 BTC to USD
https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=1&id=1&convert_id=2781

curl https://pro-api.coinmarketcap.com/v1/tools/price-conversion?id=1&amount=1&convert_id=2781 \
-H 'X-CMC_PRO_API_KEY: b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c' | jq

{
  "status": {
    "timestamp": "2021-07-28T03:36:24.467Z",
    "error_code": 0,
    "error_message": null,
    "elapsed": 31,
    "credit_count": 1,
    "notice": null
  },
  "data": {
    "id": 1,
    "symbol": "BTC",
    "name": "Bitcoin",
    "amount": 1,
    "last_updated": "2021-07-28T03:35:02.000Z",
    "quote": {
      "2781": {
        "price": 40235.408996089864,
        "last_updated": "2021-07-28T03:35:24.000Z"
      }
    }
  }
}
*/

async function getTokenUsdPrice(id) {
  console.log(`Start getTokenUsdPrice ${id}`);

  try {
    const result = await axios.get(process.env.COIN_MARKET_CAP_URL + '/tools/price-conversion', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_KEY
      },
      params: {
        id, // token ID
        amount: 1,
        convert_id: 2781 // USD
      }
    });

    if (200 === result.status) {
      // Data structure is a bit different between pro and sandbox API, how weird CMC is.
      const price = result.data.data[id.toString()] ? result.data.data[id.toString()].quote['2781'].price : result.data.data.quote['2781'].price;
      console.log(`End getTokenUsdPrice ${id} price ${price}`);

      return price;
    }

    console.log(`getTokenUsdPrice fails to convert ${id} to USD %O`, {
      error_code: result.data.status.error_code,
      error_message: result.data.status.error_message
    });

    return 0;
  } catch (error) {
    console.log(`Fails to convert ${id} to USD %O`, error );
    return 0;
  }
}

async function getTokenList() {
  const query = 'SELECT cmc_id, name FROM token_prices WHERE active=1 ORDER BY created_time';

  try {
    const { rows } = await pool.query(query);
    const tokens = [];

    for (const row of rows) {
      tokens.push({
        id: row.cmc_id,
        name: row.name
      });
    }

    return tokens;
  } catch (error) {
    console.log('getTokenList fails to get token list %O', error);
    return [];
  }
}

async function getTokenPrice(tokens) {
  const prices = [];

  for (const token of tokens) {
    const price = await getTokenUsdPrice(token.id, 1);

    prices.push({
      id: token.id,
      price
    });
  }

  return prices;
}

async function updateTokenPrice(prices) {
  const query = 'UPDATE token_prices SET price=$1, updated_time=NOW() WHERE cmc_id=$2';

  try {
    for (const item of prices) {
      console.log('Update price of %O', item);
      await pool.query(query, [item.price, item.id]);
    }
  } catch (error) {
    console.log('updateTokenPrice fails to update price %O', error);
  }
}

async function start() {
  console.log('Start update token price');

  const tokens = await getTokenList();

  console.log('Update price for tokens: %O', tokens);

  if (tokens.length > 0) {
    const prices = await getTokenPrice(tokens);

    if (prices.length > 0) {
      console.log('Update prices of %O', prices);
      await updateTokenPrice(prices.filter(p => p.price > 0));
    }
  }

  console.log('End update token price');
}

(async function () {
  try {
    await start();
  } catch (error) {
    console.log(error);
  }
})();
