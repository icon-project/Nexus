'use strict';

const { Pool } = require('pg');
const Transaction = require('../src/modules/transactions/icon');

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
  logsBloom: '0x000000000000000000000000000000000000',
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
  const OLD_ENV = process.env;
  let pool;

  beforeEach(() => {
    pool = new Pool();
    // Most important - it clears the cache
    jest.resetModules();
    // Make a copy
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.clearAllMocks();
  });

  test('should transfer and create transaction event from tx result', async () => {
    process.env.ICON_BMC_ADDRESS = txResult.to;
    pool.query.mockResolvedValue({
      rows: [{ status: 0, contract_address: txResult.to }],
      rowCount: 1,
    });
    await Transaction.handleTransactionEvents(txResult, transaction);
    expect(pool.query).toBeCalledTimes(3);
    expect(pool.query).toHaveBeenCalledWith('SELECT DISTINCT(contract_address) FROM token_info');
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'SELECT * FROM  transactions WHERE token_name = $1 ORDER BY update_at DESC LIMIT 1',
      ['ICX'],
    );
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'INSERT INTO transactions (\n      from_address, token_name, serial_number,\n      value, to_address,\n      tx_hash, block_time, network_id, btp_fee,\n      network_fee, status, total_volume, create_at,\n      update_at)\n    VALUES (\n      $1, $2, $3, $4,\n      $5, $6, $7, $8,\n      $9, $10, $11, $12,\n      NOW(), NOW())',
      [
        'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
        'ICX',
        1,
        1000,
        'hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9',
        '0xa856a2afef583be6fa60e00e0e7b3b24713d56ee791867066785080bd84a1754',
        1625217594463,
        '0x101c5b',
        0,
        0.0093075375,
        0,
        0,
      ],
    );
  });

  test('should transfer and create transaction event from tx result and update total_volume', async () => {
    process.env.ICON_BMC_ADDRESS = txResult.to;
    pool.query.mockResolvedValue({
      rows: [
        {
          status: 0,
          contract_address: 'cx0c9f31cd4436d29680b6551a76449020186eeec1',
          total_volume: 1000,
        },
      ],
      rowCount: 1,
    });
    await Transaction.handleTransactionEvents(txResult, transaction);
    expect(pool.query).toBeCalledTimes(2);
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'SELECT * FROM  transactions WHERE token_name = $1 ORDER BY update_at DESC LIMIT 1',
      ['ICX'],
    );
    expect(
      pool.query,
    ).toHaveBeenCalledWith(
      'INSERT INTO transactions (\n      from_address, token_name, serial_number,\n      value, to_address,\n      tx_hash, block_time, network_id, btp_fee,\n      network_fee, status, total_volume, create_at,\n      update_at)\n    VALUES (\n      $1, $2, $3, $4,\n      $5, $6, $7, $8,\n      $9, $10, $11, $12,\n      NOW(), NOW())',
      [
        'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
        'ICX',
        1,
        1000,
        'hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9',
        '0xa856a2afef583be6fa60e00e0e7b3b24713d56ee791867066785080bd84a1754',
        1625217594463,
        '0x101c5b',
        0,
        0.0093075375,
        0,
        2000,
      ],
    );
  });
});
