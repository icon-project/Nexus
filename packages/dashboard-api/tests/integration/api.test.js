'use strict';

const request = require('supertest');
const HttpStatus = require('@tiendq/http-status');
const app = require('../../src/app/app');

describe('GET /btpnetwork', () => {
  test('should return general network information', async () => {
    let response = await request(app)
      .get('/v1/btpnetwork')
      .expect(HttpStatus.OK);

    expect(response.body.content).toBeDefined();
  });
});

describe('GET /networks', () => {
  // test('something', async () => {
  // });
});
