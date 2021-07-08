'use strict';

const Transaction = require('../src/modules/icon-indexer/transactions');
const { Pool } = require('pg');
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

const txResult = {
  status: 1,
  to: 'cx0c9f31cd4436d29680b6551a76449020186eeec1',
  txHash: '0xa856a2afef583be6fa60e00e0e7b3b24713d56ee791867066785080bd84a1754',
  txIndex: 0,
  blockHeight: 129858,
  blockHash: '0xa5b0c06ffef783d7ec0c4e49966dede727f1a365c7701683388d610f49b94d96',
  cumulativeStepUsed: '744603',
  stepUsed: { c: [744603] },
  stepPrice: { c: [12500000000] },
  eventLogs: [
    {
      scoreAddress: 'cx0c9f31cd4436d29680b6551a76449020186eeec1',
      indexed: [
        'TransferStart(Address,str,int,bytes)',
        'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
      ],
      data: [
        'hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9',
        '0x1',
        '0xd0cf83494358893635c9adc5dea0000000',
      ],
    },
    {
      scoreAddress: 'cx0c9f31cd4436d29680b6551a76449020186eeec1',
      indexed: ['TransferEnd(Address,int,int,str)', 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd'],
      data: ['0x1', '0x0', 'Transfer Success'],
    },
  ],
  logsBloom:
    '0x00000000000000000000000000000000000020000000000000000000000000000000000000000400000000000000004000010000000000000000000000000020000000000000000000000000000000000000000000000000000000000001000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000001000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000800000000000000000',
};

const transaction = {
  timestamp: 1625217594463911,
  value: '1e+21',
  nid: { c: ['3'] },
  stepLimit: '10000000000',
  from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  to: 'cx0c9f31cd4436d29680b6551a76449020186eeec1',
  signature:
    'X01Gnp/G/Bp3UnHw9oqk1lvWuBcsL9dWNQH/4BE65NY2V259BWIvSrIZGFX2p+ITFmjMNi5ymR2KPAhdpkfhRgA=',
  dataType: 'call',
  data: {
    method: 'transferNativeCoin',
    params: {
      _to: 'btp://0x03.icon/hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9',
    },
  },
  version: '3',
  txHash: '0xa856a2afef583be6fa60e00e0e7b3b24713d56ee791867066785080bd84a1754',
};

describe('test for handle transation events', () => {
  let pool;
  beforeEach(() => {
    pool = new Pool();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should transfer and confirm event from tx result', async () => {
    pool.query.mockResolvedValue({ rows: [{ status: 0 }], rowCount: 1 });
    await Transaction.handleTransEvent(txResult, transaction);
    expect(pool.query).toBeCalledTimes(2);
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'INSERT INTO transactions ("id", "from_address", "token_name", "serial_number", "value", "to_address", "block_height", "block_hash", "tx_hash", "block_time", "network_id", "btp_fee", "network_fee", "status", "create_at", "update_at", "delete_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
      [
        expect.anything(),
        'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
        'ICX',
        1,
        1000,
        'hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9',
        129858,
        '0xa5b0c06ffef783d7ec0c4e49966dede727f1a365c7701683388d610f49b94d96',
        '0xa856a2afef583be6fa60e00e0e7b3b24713d56ee791867066785080bd84a1754',
        1625217594463911,
        '3',
        0,
        0.0093075375,
        0,
        expect.anything(),
        expect.anything(),
        0,
      ],
    );
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM  transactions WHERE serial_number = $1',
      [1],
    );
  });
});
