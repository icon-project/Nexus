'use strict';

const { Pool } = require('pg');
const relayer = require('../src/modules/icon-indexer/relay-candidate');
const { hexToFixedAmount } = require('../src/common');

const registerRelayerTx = {
  timestamp: 1638258565685867,
  value: { s: 1, e: 2, c: [ 256 ] },
  nid: { s: 1, e: 6, c: [ 5827356 ] },
  stepLimit: { s: 1, e: 6, c: [ 1000000 ] },
  from: 'hxd98b12f8f12e4bc60fb6d2f4fd613db3f2c0cc92',
  to: 'cx8e2d758fbcc7f9621f87481e33402ac2819785c8',
  signature: '/XUN9wI791cOq2cVmixD3fxnCiQJXldynnqtaxnNTKNBPlb3diHAKDGE9xMHhpWgYUoxRy9IFbeZl+3zLRDYvAA=',
  dataType: 'call',
  data: { method: 'registerRelayer', params: { _desc: 'relayer3' } },
  version: { s: 1, e: 0, c: [ 3 ] },
  txHash: '0xe87656f7a91192162f037ac4643d0da30ae4b3e96e6e38de7154c3e6a5b6e66d'
};

const unregisterRelayerTx = {
  timestamp: 1638259453792276,
  nid: { s: 1, e: 6, c: [ 5827356 ] },
  stepLimit: { s: 1, e: 6, c: [ 1000000 ] },
  from: 'hxd98b12f8f12e4bc60fb6d2f4fd613db3f2c0cc92',
  to: 'cx8e2d758fbcc7f9621f87481e33402ac2819785c8',
  signature: 'AgcByUhfVeG+H3yxyHDHlMNIrLdSWKWRaP9Ou6Bi1rUfi4jIMXJDpbI+G3agG3JhxiuAeRLSZZTbifYQZTvowwE=',
  dataType: 'call',
  data: { method: 'unregisterRelayer' },
  version: { s: 1, e: 0, c: [ 3 ] },
  txHash: '0x6af89abd0929682d89d8da31a7f3cfd2756b31dad00b49c3738f1aa97b969403'
};

jest.mock('pg', () => {
  const mPool = {
    connect: function () {
      return {
        query: jest.fn()
      };
    },
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn()
  };

  return {
    Pool: jest.fn(() => mPool)
  };
});

let pool = null;

beforeEach(() => {
  pool = new Pool();
  jest.resetModules(); // clear cache
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should add new registered relayer', async () => {
  pool.query.mockResolvedValue({ rows: [] });
  await relayer.handleRelayerAction(registerRelayerTx);

  expect(pool.query).toBeCalledTimes(1);
  expect(pool.query).toHaveBeenCalledWith(
    'INSERT INTO relay_candidates (tx_hash, name, address, bonded_icx, registered_time) VALUES ($1, $2, $3, $4, $5)',
    [registerRelayerTx.txHash, registerRelayerTx.data.params._desc, registerRelayerTx.from,
      hexToFixedAmount(registerRelayerTx.value), new Date(registerRelayerTx.timestamp / 1000)]
  );
});

test('should remove unregistered relayer', async () => {
  pool.query.mockResolvedValue({ rows: [] });
  await relayer.handleRelayerAction(unregisterRelayerTx);

  expect(pool.query).toBeCalledTimes(1);
  expect(pool.query).toHaveBeenCalledWith(
    'UPDATE relay_candidates SET unregistered_time=$1, tx_hash_unregistered=$2, updated_time=NOW() WHERE address=$3',
    [new Date(unregisterRelayerTx.timestamp / 1000), unregisterRelayerTx.txHash, unregisterRelayerTx.from]
  );
});

test('should not add new registered relayer', async () => {
  registerRelayerTx.data.method = 'test';
  pool.query.mockResolvedValue({ rows: [] });

  await relayer.handleRelayerAction({ status: 1 }, registerRelayerTx);
  expect(pool.query).toBeCalledTimes(0);
});

test('should not remove unregistered relayer', async () => {
  unregisterRelayerTx.data.method = 'test';
  pool.query.mockResolvedValue({ rows: [] });

  await relayer.handleRelayerAction({ status: 1 }, unregisterRelayerTx);
  expect(pool.query).toBeCalledTimes(0);
});
