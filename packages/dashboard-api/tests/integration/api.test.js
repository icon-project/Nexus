'use strict';

const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');
const app = require('../../src/app/app');

describe('Test /btpnetwork', () => {
  const btpnetwork = {
    volume: expect.any(Number),
    bondedValue: expect.any(Number),
    fee: {
      cumulativeAmount: expect.any(Number),
      currentAmount: expect.any(Number),
      assets: [],
      allTimeAmount: []
    },
    totalNetworks: expect.any(Number),
    totalTransactions: expect.any(Number),
    minted: expect.arrayContaining([
      expect.objectContaining({
        networkId: expect.any(String),
        networkName: expect.any(String),
        mintedVolume: expect.any(Number)
      })
    ])
  };

  test('GET /btpnetwork', async () => {
    const response = await request(app)
      .get('/v1/btpnetwork')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchObject(btpnetwork);
  });

  test('GET /btpnetwork?stats=1', async () => {
    const expected = {
      ...btpnetwork,
      stats: {
        indexers: expect.arrayContaining([
          expect.objectContaining({
            network_id: expect.any(String),
            name: expect.any(String),
            block_height: expect.any(Number),
            updated_time: expect.any(String)
          })
        ])
      }
    };

    const response = await request(app)
      .get('/v1/btpnetwork')
      .query({
        stats: 1
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchObject(expected);
  });

  test('GET /btpnetwork?volumeLast24h=true&mintLast24h=true', async () => {
    const expected = {
      ...btpnetwork,
      volumeLast24hChange: expect.any(Number),
      mintVolumeLast24hChange: expect.any(Number)
    };

    const response = await request(app)
      .get('/v1/btpnetwork')
      .query({
        volumeLast24h: true,
        mintLast24h: true
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchObject(expected);
  });

  test('GET /btpnetwork/converter?token=btc&amount=100&convert_to=usd', async () => {
    const expected = [{
      name: 'USD',
      value: expect.any(Number)
    }];

    const response = await request(app)
      .get('/v1/btpnetwork/converter')
      .query({
        token: 'btc',
        amount: 100,
        convert_to: 'usd'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchObject(expected);
  });
});

describe('Test /relays', () => {
/*
+ curl http://localhost:8000/v1/relays
+ jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   405  100   405    0     0    831      0 --:--:-- --:--:-- --:--:--   829
{
  "content": [
    {
      "id": "9d002c38-36a3-4ca6-af8b-33a70fa870ef",
      "address": "hx5e39a47007c2d79ae1879fb6b524538bbab785ae",
      "serverStatus": "Active",
      "transferredTransactions": 5,
      "failedTransactions": 0
    },
    {
      "id": "114cbffb-04fc-4c8a-bd0a-652bd437efb7",
      "address": "Ahx5e39a47007c2d79ae1879fb6b524538bbab785ae",
      "serverStatus": "Active",
      "transferredTransactions": 25,
      "failedTransactions": 0
    }
  ],
  "total": 2,
  "registeredLastChange24h": 0
}
*/
});

describe('Test /networks', () => {
/*
+ curl http://localhost:8000/v1/networks
+ jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   343  100   343    0     0   1383      0 --:--:-- --:--:-- --:--:--  1383
{
  "content": {
    "networks": [
      {
        "name": "Icon",
        "id": "0x101c5b",
        "pathLogo": "./image/logo/icon-icx-logo.png",
        "url": "https://iconrepublic.org/",
        "usd24h": 0,
        "usdAllTime": 0,
        "mintFee": 0,
        "burnFee": 0
      },
      {
        "name": "BSC",
        "id": "0x97",
        "pathLogo": "./image/logo/binance-bnb-logo.png",
        "url": "https://www.binance.com/",
        "usd24h": 0,
        "usdAllTime": 0,
        "mintFee": 0,
        "burnFee": 0
      }
    ]
  }
}

+ curl http://localhost:8000/v1/networks/0x501
+ jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   202  100   202    0     0    567      0 --:--:-- --:--:-- --:--:--   567
{
  "content": {
    "tokens": [
      {
        "nameToken": "DEV",
        "volume24h": 0,
        "volume24hUSD": 0,
        "volumeAllTime": 0,
        "volumeAlTimeUSD": 0
      },
      {
        "nameToken": "ICX",
        "volume24h": 0,
        "volume24hUSD": 0,
        "volumeAllTime": 0,
        "volumeAlTimeUSD": 0
      }
    ]
  }
}
*/
});
