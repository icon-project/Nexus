'use strict';

const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');
const app = require('../../src/app/app');

/***************************************** Test btpnetwork *********************************/

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
    const objectInArray = response.body.content.minted;
    for (let i = 0; i < objectInArray.length; i++) {
      expect(objectInArray[i]).toMatchSnapshot({
        mintedVolume: expect.any(Number),
        networkId: expect.any(String),
        networkName: expect.any(String),
      });
    }
  });

  // test('GET /btpnetwork?stats=1', async () => {
  //   let response = await request(app)
  //     .get('/v1/btpnetwork')
  //     .query({
  //       stats: 1
  //     })
  //     .set('Accept', 'application/json')
  //     .expect(HttpStatus.OK);
  //     const keys = Object.keys(response.body.content);
  //     let newObject;

  // expect(response.body.content).toMatchSnapshot({
  //   "bondedValue": expect.any(Number),
  //   "fee": {
  //     "allTimeAmount": expect.any(Array),
  //     "assets": expect.any(Array),
  //     "cumulativeAmount": expect.any(Number),
  //     "currentAmount": expect.any(Number),
  //   },
  //   "minted": expect.any(Array),
  //   "stats": expect.any(Object),
  //   "totalNetworks": expect.any(Number),
  //   "totalTransactions":  expect.any(Number),
  //   "volume":  expect.any(Number),
  // })
  // });

  // test('curl $HOST/v1/btpnetwork?volumeLast24h=true&mintLast24h=true | jq', async () => {
  //   let response = await request(app)
  //     .get('/v1/btpnetwork?volumeLast24h=true&mintLast24h=true')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(HttpStatus.OK);
  //   const compareStructure = helperCompareObject.hasEqualStructure(
  //     response.body,
  //     functions_btpnetwork.btpnetwork_24h(),
  //   );
  //   expect(compareStructure).toBeTruthy();
  // });

  // test('curl $HOST/v1/btpnetwork/converter?token=btc&amount=100&convert_to=usd | jq', async () => {
  //   let response = await request(app)
  //     .get('/v1/btpnetwork/converter?token=btc&amount=100&convert_to=usd')
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(HttpStatus.OK);
  //   const compareStructure = helperCompareObject.hasEqualStructure(
  //     response.body,
  //     functions_btpnetwork.btpnetwork_converter(),
  //   );
  //   expect(compareStructure).toBeTruthy();
  //   //expect(response.body).toMatchObject(functions_btpnetwork.btpnetwork_converter());
  // });
});
