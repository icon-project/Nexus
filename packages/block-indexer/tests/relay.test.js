'use strict';

const { Pool } = require('pg');
const iconRelayHandler = require('../src/modules/relays/icon');
const moonbeamRelayHandler = require('../src/modules/relays/moonbeam');

const addIconRelayTx = {
  timestamp: 1629099103257950,
  nid: '3',
  stepLimit: '13610920001',
  from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  signature:
    'pwG/MfYowPZEbOfIKDCBMRKWNXN5UGrQ22UI+mK+VIUw/LjKgp8i1hRLjFKouz+TspSy6qUR3iHlmp+9Ni9sMgA=',
  dataType: 'call',
  data: {
    method: 'addRelay',
    params: {
      _addr: 'hxd007a51447a18021ed2d27e8cb4784febb0c956d',
      _link: 'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
    },
  },
  version: '3',
  txHash: '0x6d690300980e7d708b0b6a3c0529988438583c3f898e52a8be78d70323b778da'
};

const removeIconRelayTx = {
  timestamp: 1629180788442439,
  nid: '3',
  stepLimit: '13610920001',
  from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  signature:
    'MgPQ/wyEivVZf33Iq289WYBS0wz3gAEpeFyz/IfafUpf/+kkQ5AQliZwcF4BiaD8TkLZOt0BlOxF5GSk/BkDWAA=',
  dataType: 'call',
  data: {
    method: 'removeRelay',
    params: {
      _addr: 'hxd007a51447a18021ed2d27e8cb4784febb0c956d',
      _link: 'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
    },
  },
  version: '3',
  txHash: '0xda0e28e7a8ae06cceb10818ce189b27b9b7a4fa0c7d70fba6be626772bfc6998'
};

const addMoonbeamRelayBlock = {
  author: '0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac',
  difficulty: '0',
  extraData: '0x',
  gasLimit: 15000000,
  gasUsed: 42862,
  hash: '0x290ebe885efe8595bb7381bcf24264b1ba1978c2520a37a0768b357982526d8d',
  logsBloom: '0x000000000000000000000000000000000000000000000000000...',
  miner: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
  number: 893564,
  parentHash: '0xb4205d3a0f3c4c974664c16c765002d71c3b0e72e1ecda876d0d7bf242e2b928',
  receiptsRoot: '0xff125f31e6b75e24dc7b75cc2dac6c172a0fe6a9c9686a3274bc610b56e96bd2',
  sealFields: [
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x0000000000000000'
  ],
  sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  size: 884,
  stateRoot: '0x3007f1b335956688a8c80754d3e1dde05ef89e696579800d6e8476180435e37f',
  timestamp: 1638506426,
  totalDifficulty: '0',
  transactions: [
    {
      blockHash: '0x290ebe885efe8595bb7381bcf24264b1ba1978c2520a37a0768b357982526d8d',
      blockNumber: 893564,
      chainId: '0x501',
      creates: null,
      from: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
      gas: 6721975,
      gasPrice: '1000000000',
      hash: '0xd6e8b161f3c42f905f96c89d825d3ea976807601bd4a8b3be4aac48acbc2beff',
      input: '0x0748ea7a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f63783865326437353866626363376639363231663837343831653333343032616332383139373835633800000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000126ad520629a0152b749af26d5fd342cb67ac6ce0000000000000000000000003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0',
      nonce: 35,
      publicKey: '0x509540919faacf9ab52146c9aa40db68172d83777250b28e4679176e49ccdd9fa213197dc0666e85529d6c9dda579c1295d61c417f01505765481e89a4016f02',
      r: '0xfa2a13b0c18a27397743b646847cffa58c80307d6b7f9007f5dc3342b94429fa',
      raw: '0xf9016c23843b9aca00836691b7943ed62137c5db927cb137c26455969116bf0c23cb80b901040748ea7a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f63783865326437353866626363376639363231663837343831653333343032616332383139373835633800000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000126ad520629a0152b749af26d5fd342cb67ac6ce0000000000000000000000003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0820a26a0fa2a13b0c18a27397743b646847cffa58c80307d6b7f9007f5dc3342b94429faa0071d6c636225828d2654da4ba91bb9f013f3c18199dd6b67657bd96c4bca4d60',
      s: '0x71d6c636225828d2654da4ba91bb9f013f3c18199dd6b67657bd96c4bca4d60',
      standardV: '0x1',
      to: process.env.MOONBEAM_BMC_MANAGEMENT_ADDRESS,
      transactionIndex: 0,
      v: '0xa26',
      value: '0'
    }
  ],
  transactionsRoot: '0xf8f87ba87435ff322b806b0ca203dc7354ff9a425e0443fa70fe1e23859fdd73',
  uncles: []
};

const removeMoonbeamRelayBlock = {
  author: '0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac',
  difficulty: '0',
  extraData: '0x',
  gasLimit: 15000000,
  gasUsed: 45190,
  hash: '0x1263e8fd6bf606e746c9f73c4ba4b85e0a5f0a5c52046c3b0b16b83ef153eae8',
  logsBloom: '0x00000000000000000000000000000000000000000000...',
  miner: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
  number: 896513,
  parentHash: '0x125dd62328fd1a8ea27bc98caababb156f6b4125a4b6ab0c2ebd0df19942e243',
  receiptsRoot: '0x6723bf7ee0b01ba7569229cdd3c80e5924ca393dd6040cb2a6f7b9381e364e30',
  sealFields: [
    '0x0000000000000000000000000000000000000000000000000000000000000000',
    '0x0000000000000000'
  ],
  sha3Uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  size: 787,
  stateRoot: '0x8560aecc6af6ac9cd04584514f8152bb35afe34d3b113998745c97845285da33',
  timestamp: 1638515273,
  totalDifficulty: '0',
  transactions: [
    {
      blockHash: '0x1263e8fd6bf606e746c9f73c4ba4b85e0a5f0a5c52046c3b0b16b83ef153eae8',
      blockNumber: 896513,
      chainId: '0x501',
      creates: null,
      from: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
      gas: 6721975,
      gasPrice: '1000000000',
      hash: '0xee5393859049c5d847701246b93a1adda4dc36ae4575330b4114477e51eb9144',
      input: '0xdef59f5e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000126ad520629a0152b749af26d5fd342cb67ac6ce000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f6378386532643735386662636337663936323166383734383165333334303261633238313937383563380000',
      nonce: 38,
      publicKey: '0x509540919faacf9ab52146c9aa40db68172d83777250b28e4679176e49ccdd9fa213197dc0666e85529d6c9dda579c1295d61c417f01505765481e89a4016f02',
      r: '0xb034dd5a5549ae5bdcd6b748aeb861a07e14838d8eb227e39cba5971cc5d9ff5',
      raw: '0xf9010b26843b9aca00836691b7943ed62137c5db927cb137c26455969116bf0c23cb80b8a4def59f5e0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000126ad520629a0152b749af26d5fd342cb67ac6ce000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f6378386532643735386662636337663936323166383734383165333334303261633238313937383563380000820a25a0b034dd5a5549ae5bdcd6b748aeb861a07e14838d8eb227e39cba5971cc5d9ff5a0207f8125756044667af6b8743c2ecb15d7f6241901eb0f7d5e949857667e925f',
      s: '0x207f8125756044667af6b8743c2ecb15d7f6241901eb0f7d5e949857667e925f',
      standardV: '0x0',
      to: process.env.MOONBEAM_BMC_MANAGEMENT_ADDRESS,
      transactionIndex: 0,
      v: '0xa25',
      value: '0'
    }
  ],
  transactionsRoot: '0xf1e72de93e2ba1d0950a59ca1f3020c94bfb0c0abfafa24ba4592c076ec3eba0',
  uncles: []
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

let pool;

beforeEach(() => {
  pool = new Pool();
  jest.resetModules(); // clear cache
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should add ICON relay', async () => {
  pool.query.mockResolvedValueOnce({rows: [] });
  pool.query.mockResolvedValueOnce({rows: [] });
  pool.query.mockResolvedValueOnce({rows: [{}] });

  await iconRelayHandler.handleRelayAction({ status: 1 }, addIconRelayTx);

  const relay = addIconRelayTx.data.params;

  expect(pool.query).toBeCalledTimes(3);
  expect(pool.query,).nthCalledWith(3,
    'INSERT INTO relays (tx_hash, address, link, server_status, registered_time) VALUES ($1, $2, $3, $4, $5)',
    [addIconRelayTx.txHash, relay._addr, relay._link, 'Active', expect.any(Date)]
  );
});

test('should remove ICON relay', async () => {
  pool.query.mockResolvedValueOnce({rows: [] });
  await iconRelayHandler.handleRelayAction({ status: 1 }, removeIconRelayTx);

  const relay = removeIconRelayTx.data.params;

  expect(pool.query).toBeCalledTimes(1);
  expect(pool.query,).toBeCalledWith(
    'UPDATE relays SET updated_at = NOW(), server_status = $2, unregistered_time = $3 WHERE address = $1',
    [relay._addr, 'Inactive', new Date(removeIconRelayTx.timestamp / 1000)]
  );
});

test('should add Moonbeam relay', async () => {
  const relays = [
    { address: '0x126ad520629a0152b749af26d5fd342cb67ac6ce', link: 'btp://0x58eb1c.icon/cx8e2d758fbcc7f9621f87481e33402ac2819785c8' },
    { address: '0x3cd0a705a2dc65e5b1e1205896baa2be8a07c6e0', link: 'btp://0x58eb1c.icon/cx8e2d758fbcc7f9621f87481e33402ac2819785c8' }
  ];

  pool.query.mockResolvedValueOnce({rows: [{}] });
  pool.query.mockResolvedValueOnce({rows: [{ address: relays[0].address }] });
  pool.query.mockResolvedValueOnce({rows: [{}] });

  await moonbeamRelayHandler.handleRelayActions(addMoonbeamRelayBlock.transactions[0], addMoonbeamRelayBlock);

  expect(pool.query).toBeCalledTimes(3);
  expect(pool.query,).nthCalledWith(1,
    'INSERT INTO relays (tx_hash, address, link, server_status, registered_time) VALUES ($1, $2, $3, $4, $5)',
    [addMoonbeamRelayBlock.transactions[0].hash, relays[0].address, relays[0].link, 'Active', expect.any(Date)]
  );
  expect(pool.query,).nthCalledWith(3,
    'INSERT INTO relays (tx_hash, address, link, server_status, registered_time) VALUES ($1, $2, $3, $4, $5)',
    [addMoonbeamRelayBlock.transactions[0].hash, relays[1].address, relays[1].link, 'Active', expect.any(Date)]
  );
});

test('should remove Moonbeam relay', async () => {
  const relay = {
    address: '0x126ad520629a0152b749af26d5fd342cb67ac6ce',
    serverStatus: 'Inactive',
    unregisteredTime: '2021-12-03T07:07:53.000Z'
  };

  pool.query.mockResolvedValueOnce({rows: [] });
  pool.query.mockResolvedValueOnce({rows: [{ address: relay.address }] });

  await moonbeamRelayHandler.handleRelayActions(removeMoonbeamRelayBlock.transactions[0], removeMoonbeamRelayBlock);

  expect(pool.query).toBeCalledTimes(1);
  expect(pool.query).toBeCalledWith('UPDATE relays SET updated_at = NOW(), server_status = $2, unregistered_time = $3  WHERE address = $1',
    [relay.address, relay.serverStatus, new Date(relay.unregisteredTime)]
  );
});
