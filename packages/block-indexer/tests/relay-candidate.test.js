const { Pool } = require('pg');
const RelayerICON = require('../src/modules/icon-indexer/relay-candidate');

const addRelayerICONTrans = {
  timestamp: 1629099103257950,
  nid: '3',
  stepLimit: '13610920001',
  from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  signature:
    'pwG/MfYowPZEbOfIKDCBMRKWNXN5UGrQ22UI+mK+VIUw/LjKgp8i1hRLjFKouz+TspSy6qUR3iHlmp+9Ni9sMgA=',
  dataType: 'call',
  data: {
    method: 'registerRelayer',
    params: {
      _desc: 'Relayer 1',
    },
  },
  value: { c: ['0xDE0B6B3A7640000'] },
  version: '3',
  txHash: '0x6d690300980e7d708b0b6a3c0529988438583c3f898e52a8be78d70323b778da',
  // blockNumber: 452634
};

const removeRelayerICONTrans = {
  timestamp: 1629180788442439,
  nid: '3',
  stepLimit: '13610920001',
  from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  signature:
    'MgPQ/wyEivVZf33Iq289WYBS0wz3gAEpeFyz/IfafUpf/+kkQ5AQliZwcF4BiaD8TkLZOt0BlOxF5GSk/BkDWAA=',
  dataType: 'call',
  data: {
    method: 'unregisterRelayer',
  },
  version: '3',
  txHash: '0xda0e28e7a8ae06cceb10818ce189b27b9b7a4fa0c7d70fba6be626772bfc6998',
  // blockNumber: 493470
};

jest.mock('pg', () => {
  const mPool = {
    connect: function () {
      return { query: jest.fn() };
    },
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('test for handle relay action', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
    // Most important - it clears the cache
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should add relayer to icon', async () => {
    let data = addRelayerICONTrans.data.params;
    pool.query.mockResolvedValue({ rows: [] });
    await RelayerICON.handleRelayerAction({ status: 1 }, addRelayerICONTrans);
    expect(pool.query).toBeCalledTimes(1);
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'INSERT INTO relay_candidates ( id, rank, name, address, dest_address, bonded_icx, registered_time, unregistered_time, created_time, updated_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) ON CONFLICT (address) DO UPDATE SET rank = $2 dest_address = $5, bonded_icx = $6, registered_time = $7, unregistered_time = $8, updated_time = NOW()',
      [
        expect.anything(),
        0,
        data._desc,
        addRelayerICONTrans.from,
        addRelayerICONTrans.to,
        1,
        new Date(addRelayerICONTrans.timestamp / 1000),
        undefined,
      ],
    );
  });

  test('should remove relayer to icon', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await RelayerICON.handleRelayerAction({ status: 1 }, removeRelayerICONTrans);
    expect(pool.query).toBeCalledTimes(1);
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'UPDATE relay_candidates SET unregistered_time = $1, updated_time = NOW() WHERE address = $2',
      [new Date(removeRelayerICONTrans.timestamp / 1000), removeRelayerICONTrans.from],
    );
  });

  test('shouldn not add relayer to icon', async () => {
    addRelayerICONTrans.data.method = 'addRelay';
    pool.query.mockResolvedValue({ rows: [] });
    await RelayerICON.handleRelayerAction({ status: 1 }, addRelayerICONTrans);
    expect(pool.query).toBeCalledTimes(0);
  });

  test('should not remove relayer to icon', async () => {
    removeRelayerICONTrans.data.method = 'relayRelay';
    pool.query.mockResolvedValue({ rows: [] });
    await RelayerICON.handleRelayerAction({ status: 1 }, removeRelayerICONTrans);
    expect(pool.query).toBeCalledTimes(0);
  });
});
