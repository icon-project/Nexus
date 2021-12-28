'use strict';

const path = require('path');
const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');

require('dotenv-safe').config({
  path: path.resolve(__dirname, '.env'),
  example: path.resolve(__dirname, '.env.example')
});

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

  test('GET /btpnetwork/converter?token=BTC&amount=100&convert_to=USD', async () => {
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
  test('GET /relays', async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          address: expect.any(String),
          serverStatus: expect.any(String),
          transferredTransactions: expect.any(Number),
          failedTransactions: expect.any(Number)
        })
      ]),
      total: expect.any(Number),
      registeredLastChange24h: expect.any(Number)
    };

    const response = await request(app)
      .get('/v1/relays')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject(expected);
  });

  test('GET /relays\?page=1\&limit=3', async () => {
    const expected = {
      content: [],
      total: expect.any(Number),
      registeredLastChange24h: expect.any(Number)
    };

    const response = await request(app)
      .get('/v1/relays\?page=1\&limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toEqual(0);
  });

  test('GET /relays\?page=0\&limit=3', async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          address: expect.any(String),
          serverStatus: expect.any(String),
          transferredTransactions: expect.any(Number),
          failedTransactions: expect.any(Number)
        })
      ]),
      total: expect.any(Number),
      registeredLastChange24h: expect.any(Number)
    };

    const response = await request(app)
      .get('/v1/relays\?page=0\&limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });
});

describe('Test /networks', () => {
  test('GET /networks', async () => {
    const expected = {
      networks: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          pathLogo: expect.any(String),
          url: expect.any(String),
          usd24h: expect.any(Number),
          usdAllTime: expect.any(Number),
          mintFee: expect.any(Number),
          burnFee: expect.any(Number)
        })
      ])
    };

    const response = await request(app)
      .get('/v1/networks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchObject(expected);
  });

  test(`GET /networks/${process.env.NETWORK_ID}`, async () => {
    const expected = {
      tokens: expect.arrayContaining([
        expect.objectContaining({
          nameToken: expect.any(String),
          volume24h: expect.any(Number),
          volume24hUSD: expect.any(Number),
          volumeAllTime: expect.any(Number),
          volumeAlTimeUSD: expect.any(Number)
        })
      ])
    };

    const response = await request(app)
      .get(`/v1/networks/${process.env.NETWORK_ID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchObject(expected);
  });
});

describe('Test /transactions', () => {
  test('GET /transactions', async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          blockTime: expect.any(Number),
          status: expect.any(Number),
          tokenName: expect.any(String),
          txHash: expect.any(String),
          value: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };
    const response = await request(app)
      .get('/v1/transactions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
  });

  test('GET /transactions\?limit=3', async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          tokenName: expect.any(String),
          value: expect.any(Number),
          txHash: expect.any(String),
          status: expect.any(Number),
          blockTime: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };
    const response = await request(app)
      .get('/v1/transactions\?limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test('GET /transactions\?page=1\&limit=3', async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          tokenName: expect.any(String),
          value: expect.any(Number),
          txHash: expect.any(String),
          status: expect.any(Number),
          blockTime: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };
    const response = await request(app)
      .get('/v1/transactions\?page=1\&limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test(`GET /transactions\?to=${process.env.NETWORK_ID}\&limit=3`, async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          tokenName: expect.any(String),
          value: expect.any(Number),
          txHash: expect.any(String),
          status: expect.any(Number),
          blockTime: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };
    const response = await request(app)
      .get(`/v1/transactions\?to=${process.env.NETWORK_ID}\&limit=3`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test(`GET /transactions\?from\=${process.env.NETWORK_ID}\&limit=3`, async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          tokenName: expect.any(String),
          value: expect.any(Number),
          txHash: expect.any(String),
          status: expect.any(Number),
          blockTime: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };
    const response = await request(app)
      .get(`/v1/transactions\?from\=${process.env.NETWORK_ID}\&limit=3`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test(`GET /transactions\?assetName\=${process.env.TOKEN_NAME}\&limit=3`, async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          tokenName: expect.any(String),
          value: expect.any(Number),
          txHash: expect.any(String),
          status: expect.any(Number),
          blockTime: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };
    const response = await request(app)
      .get(`/v1/transactions\?assetName\=${process.env.TOKEN_NAME}\&limit=3`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test(`GET /transactions/${process.env.TX_HASH}`, async () => {
    const expected = {
      content: expect.objectContaining({
        networkNameDst: expect.any(String),
        serialNumber: expect.any(String),
        tokenName: expect.any(String),
        value: expect.any(Number),
        toAddress: expect.any(String),
        fromAddress: expect.any(String),
        txHash: expect.any(String),
        status: expect.any(Number),
        createAt: expect.any(Number),
        updateAt: expect.any(Number),
        networkId: expect.any(String),
        blockTime: expect.any(Number),
        bptFee: expect.any(Number),
        networkFee: expect.any(Number),
        networkNameSrc: expect.any(String),
        nativeToken: expect.any(String),
        txError: "",
      })
    };

    const response = await request(app)
      .get(`/v1/transactions/${process.env.TX_HASH}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
  });

  test('GET /transactions/tx-not-found', async () => {
    const expected = 'Not Found';
    const response = await request(app)
      .get(`/v1/transactions/tx-not-found`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /text\/plain/)
      .expect(HttpStatus.NotFound);
    expect(response.text).toBe(expected);
  })
});

describe('Test /relay-candidates', () => {
  test('GET /relay-candidates', async () => {
    const expected = {
      content: expect.arrayContaining([
        expect.objectContaining({
          rank: expect.any(Number),
          name: expect.any(String),
          address: expect.any(String),
          bondedICX: expect.any(Number),
          monthlyReward: expect.any(Number)
        })
      ]),
      total: expect.any(Number)
    };

    const response = await request(app)
      .get('/v1/relay-candidates')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject(expected);
  });

  test('GET /relay-candidates/reward', async () => {
    const expected = {
      content: expect.objectContaining({
        totalAmount: expect.any(Number),
        last30DaysChange: expect.any(Number)
      })
    };

    const response = await request(app)
      .get('/v1/relay-candidates/reward')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject(expected);
  });
});
