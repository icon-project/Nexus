'use strict';

const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');
const app = require('../../src/app/app');

/***************************************** Test btpnetwork *********************************/
//function add Method expect any for array minted
function addMethodAnyForMint(arr) {
  for (let i = 0; i < arr.length; i++) {
    expect(arr[i]).toMatchSnapshot({
      mintedVolume: expect.any(Number),
      networkId: expect.any(String),
      networkName: expect.any(String),
    });
  }
}

describe('Test btpNetwork', () => {
  test('GET /btpnetwork', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork')
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);
    //Using toMatchSnapshot to save Snapshots in folder _snapshots_ and then compare for next time
    expect(response.body.content).toMatchSnapshot({
      bondedValue: expect.any(Number),
      fee: expect.any(Object),
      minted: expect.any(Array),
      totalNetworks: expect.any(Number),
      totalTransactions: expect.any(Number),
      volume: expect.any(Number),
    });

    //If snapshots have array, We will use toMatchSnapshot for each element of the array
    const objectMintedInArray = response.body.content.minted;
    addMethodAnyForMint(objectMintedInArray);
  });

  test('GET /btpnetwork?stats=1', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork')
      .query({
        stats: 1,
      })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchSnapshot({
      bondedValue: expect.any(Number),
      fee: {
        allTimeAmount: expect.any(Array),
        assets: expect.any(Array),
        cumulativeAmount: expect.any(Number),
        currentAmount: expect.any(Number),
      },
      minted: expect.any(Array),
      stats: expect.any(Object),
      totalNetworks: expect.any(Number),
      totalTransactions: expect.any(Number),
      volume: expect.any(Number),
    });

    const objectMintedInArray = response.body.content.minted;

    addMethodAnyForMint(objectMintedInArray);

    const objectIndexersInArray = response.body.content.stats.indexers;
    for (let i = 0; i < objectIndexersInArray.length; i++) {
      expect(objectIndexersInArray[i]).toMatchSnapshot({
        block_height: expect.any(Number),
        name: expect.any(String),
        network_id: expect.any(String),
        updated_time: expect.any(String),
      });
    }
  });

  test('GET /btpnetwork?volumeLast24h=true&mintLast24h=true', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork')
      .query({
        volumeLast24h: true,
        mintLast24h: true,
      })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchSnapshot({
      bondedValue: expect.any(Number),
      fee: {
        allTimeAmount: expect.any(Array),
        assets: expect.any(Array),
        cumulativeAmount: expect.any(Number),
        currentAmount: expect.any(Number),
      },
      mintVolumeLast24hChange: expect.any(Number),
      minted: expect.any(Array),
      totalNetworks: expect.any(Number),
      totalTransactions: expect.any(Number),
      volume: expect.any(Number),
      volumeLast24hChange: expect.any(Number),
    });

    const objectMintedInArray = response.body.content.minted;

    addMethodAnyForMint(objectMintedInArray);
  });
  test('GET /btpnetwork/converter?token=btc&amount=100&convert_to=usd', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork')
      .query({
        token: 'btc',
        amount: 100,
        convert_to: 'usd',
      })
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    expect(response.body.content).toMatchSnapshot({
      bondedValue: expect.any(Number),
      fee: {
        allTimeAmount: expect.any(Array),
        assets: expect.any(Array),
        cumulativeAmount: expect.any(Number),
        currentAmount: expect.any(Number),
      },
      minted: expect.any(Array),
      totalNetworks: expect.any(Number),
      totalTransactions: expect.any(Number),
      volume: expect.any(Number),
    });

    const objectMintedInArray = response.body.content.minted;
    addMethodAnyForMint(objectMintedInArray);
  });
});
