/* eslint-disable no-undef */
'use strict';

const { Pool } = require('pg');
const iconTxHandler = require('../src/modules/transactions/icon');

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

const transferNativeCoinTx = {
  timestamp: 1654697443093000,
  value: { s: 1, e: 18, c: [10000] },
  nid: { s: 1, e: 0, c: [7] },
  stepLimit: { s: 1, e: 6, c: [2000000] },
  nonce: { s: 1, e: 0, c: [1] },
  from: 'hxe52720d9125586e64c745bf3c2c1917dbb46f9ba',
  to: 'cxe3fbc6d12fc842935ad68991b5247ea821584002',
  signature: 'xp/8Cgbvq52sDe+gu8536Vy1E3HytUym85GE4ZF8MI8KRnvE452aiddZzmuHvmqeuoJUXhIievGiUA14qj1smwE=',
  dataType: 'call',
  data: {
    method: 'transferNativeCoin',
    params: {
      _to: 'btp://0x61.bsc/0x4bb718Cb404787BF97bB012Bb08096602fb9544B'
    }
  },
  version: { s: 1, e: 0, c: [3] },
  txHash: '0xcafb7f8a63c307e440db3fc5ee2d8214f5e9eb1097c17c888e081122eaa66b48'
};

const txResult = {
  status: 1,
  to: 'cxe3fbc6d12fc842935ad68991b5247ea821584002',
  txHash: '0xcafb7f8a63c307e440db3fc5ee2d8214f5e9eb1097c17c888e081122eaa66b48',
  txIndex: 1,
  blockHeight: 7780042,
  blockHash: '0x3150f71e5b448626e105a72c53f73c0d518beb4f8da6c49714e12c54efafc092',
  cumulativeStepUsed: { s: 1, e: 6, c: [1291748] },
  stepUsed: { s: 1, e: 6, c: [1291748] },
  stepPrice: { s: 1, e: 10, c: [12500000000] },
  eventLogs: [
    {
      scoreAddress: 'cxf3f7533eead8941a5655a90379caf9d121fb2725',
      indexed: [
        'Message(str,int,bytes)',
        'btp://0x61.bsc/0x121A1AAd623AF68162B1bD84c44234Bc3a3562a9',
        '0x77'
      ],
      data: [
        '0xf8f0b8396274703a2f2f3078372e69636f6e2f637866336637353333656561643839343161353635356139303337396361663964313231666232373235b8396274703a2f2f307836312e6273632f3078313231413141416436323341463638313632423162443834633434323334426333613335363261398a6e6174697665636f696e57b86cf86a00b867f865aa687865353237323064393132353538366536346337343562663363326331393137646262343666396261aa307834626237313843623430343738374246393762423031324262303830393636303266623935343442cecd83494358880dbd2fc137a30000'
      ]
    },
    {
      scoreAddress: 'cxe3fbc6d12fc842935ad68991b5247ea821584002',
      indexed: [
        'TransferStart(Address,str,int,bytes)',
        'hxe52720d9125586e64c745bf3c2c1917dbb46f9ba'
      ],
      data: [
        'btp://0x61.bsc/0x4bb718Cb404787BF97bB012Bb08096602fb9544B',
        '0x57',
        '0xd6d583494358880dbd2fc137a30000872386f26fc10000'
      ]
    }
  ],
  logsBloom: '0x40000000000000000000000000000000000100200000000000000000000000000000000000020000000000000000000000010000000000000000000000000000000000000008040000000000000000200000200000000000000000000000000000000000000000000000000000040000000000000000000000000000080000002000000000000000000000000000020000000000000000000000000000002000000000000000000000000000000000000800000000000000000000004000010000000000000000000001000000000000000000000000000000000400000000000000000000000000000000000000000000000000001000800000000000000000'
};

let pool = null;

beforeEach(() => {
  pool = new Pool();
  jest.resetModules(); // clear cache
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should create new transaction with TransferStart event', async () => {
  pool.query.mockResolvedValueOnce({
    rows: [{ contract_address: txResult.to }],
    rowCount: 1
  });

  await iconTxHandler.handleTransactionEvents(txResult, transferNativeCoinTx);

  expect(pool.query).toBeCalledTimes(4);
  expect(pool.query).nthCalledWith(2,
    `SELECT * FROM  transactions WHERE token_name = $1 ORDER BY update_at DESC LIMIT 1`, ["ICX"]
  );
  expect(pool.query).nthCalledWith(3,
    `INSERT INTO transactions (
      from_address, token_name, serial_number,
      value, to_address,
      tx_hash, block_time, network_id, btp_fee,
      network_fee, status, total_volume, wps_data,
      contract_address, log_id1)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      "hxe52720d9125586e64c745bf3c2c1917dbb46f9ba",
      "ICX",
      87,
      0.99,
      "btp://0x61.bsc/0x4bb718Cb404787BF97bB012Bb08096602fb9544B",
      "0xcafb7f8a63c307e440db3fc5ee2d8214f5e9eb1097c17c888e081122eaa66b48",
      1654697443093,
      "0x7",
      0.01,
      0.01614685,
      0,
      0.99,
      undefined,
      "cxe3fbc6d12fc842935ad68991b5247ea821584002",
      ""
    ]

  );
  expect(pool.query).nthCalledWith(4,
    `SELECT name FROM networks WHERE id = $1`,
    ["0x7"]
  );
});

