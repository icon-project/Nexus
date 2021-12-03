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

  test('GET /networks/0x501', async () => {
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
      .get('/v1/networks/0x501')
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

  test('GET /transactions\?to=0x501\&limit=3', async () => {
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
      .get('/v1/transactions\?to=0x501\&limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test('GET /transactions\?from\=0x501\&limit=3', async () => {
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
      .get('/v1/transactions\?from\=0x501\&limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test('GET /transactions\?assetName\=icx\&limit=3', async () => {
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
      .get('/v1/transactions\?assetName\=icx\&limit=3')
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
    expect(response.body.content.length).toBeLessThanOrEqual(3);
  });

  test('GET /transactions/0x0a26af1bf487843c6993bd08e5da5db7f5f04ef7f77ce96dfd3cfd245c52c8c8', async () => {
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
      .get(`/v1/transactions/0x0a26af1bf487843c6993bd08e5da5db7f5f04ef7f77ce96dfd3cfd245c52c8c8`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(HttpStatus.OK);
    expect(response.body).toMatchObject(expected);
  });

  test('GET /transactions/0xe6f572ce219f-not-found', async () => {
    const expected = 'Not Found';
    const response = await request(app)
      .get(`/v1/transactions/0xe6f572ce219f-not-found`)
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
