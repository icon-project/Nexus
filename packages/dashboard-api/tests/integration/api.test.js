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
