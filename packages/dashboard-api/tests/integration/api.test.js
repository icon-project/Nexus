'use strict';

const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');
const app = require('../../src/app/app');

const { helperCompareObject, helperCompareArray } = require('../helpers/helper');

const functions_btpnetwork = require('../defaults/default_btpnetwork');

/***************************************** Test btpnetwork *********************************/
describe('GET /btpnetwork', () => {
  test('curl $HOST/v1/btpnetwork | jq', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);
    // Declare variable is result of function helperCompareObject return boolean value
    const compareStructure = helperCompareObject.hasEqualStructure(
      response.body.content,
      functions_btpnetwork.btpnetwork(),
    );
    // check value is true => pass
    expect(compareStructure).toBeTruthy();
    //expect(response.body.content).toMatchObject(functions_btpnetwork.btpnetwork());

    // set Timeout: 7000 cause bad network
  }, 7000);

  test('curl $HOST/v1/btpnetwork?stats=1 | jq', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork/?stats=1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);
    const compareStructure = helperCompareObject.hasEqualStructure(
      response.body.content,
      functions_btpnetwork.btpnetwork_stats(),
    );
    expect(compareStructure).toBeTruthy();
    //expect(response.body).toMatchObject(functions_btpnetwork.btpnetwork_stats());
  }, 7000);

  test('curl $HOST/v1/btpnetwork?volumeLast24h=true&mintLast24h=true | jq', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork?volumeLast24h=true&mintLast24h=true')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);
    const compareStructure = helperCompareObject.hasEqualStructure(
      response.body.content,
      functions_btpnetwork.btpnetwork_24h(),
    );
    expect(compareStructure).toBeTruthy();
    // expect(response.body).toMatchObject(functions_btpnetwork.btpnetwork_24h());
  }, 7000);

  test('curl $HOST/v1/btpnetwork/converter?token=btc&amount=100&convert_to=usd | jq', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork/converter?token=btc&amount=100&convert_to=usd')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);
    const compareStructure = helperCompareObject.hasEqualStructure(
      response.body.content,
      functions_btpnetwork.btpnetwork_converter(),
    );
    expect(compareStructure).toBeTruthy();
    //expect(response.body).toMatchObject(functions_btpnetwork.btpnetwork_converter());
  }, 7000);
});
