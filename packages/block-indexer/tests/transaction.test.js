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
  timestamp: 1625217594463911,
  value: '1e+21',
  nid: { c: ['3'] },
  stepLimit: '10000000000',
  from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  to: process.env.ICON_BMC_ADDRESS,
  signature:
    'X01Gnp/G/Bp3UnHw9oqk1lvWuBcsL9dWNQH/4BE65NY2V259BWIvSrIZGFX2p+ITFmjMNi5ymR2KPAhdpkfhRgA=',
  dataType: 'call',
  data: {
    method: 'transferNativeCoin',
    params: {
      _to: 'btp://0x03.icon/hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9'
    }
  },
  version: '3',
  txHash: '0xa856a2afef583be6fa60e00e0e7b3b24713d56ee791867066785080bd84a1754'
};

const txResult = {
  status: 1,
  to: process.env.ICON_BMC_ADDRESS,
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
        'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd'
      ],
      data: [
        'hxdcdbf343de48a378ce68ccef3b380ad45b5f21e9',
        '0x1',
        '0xd0cf83494358893635c9adc5dea0000000'
      ]
    },
    {
      scoreAddress: 'cx0c9f31cd4436d29680b6551a76449020186eeec1',
      indexed: ['TransferEnd(Address,int,int,str)', 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd'],
      data: ['0x1', '0x0', 'Transfer Success']
    }
  ],
  logsBloom: '0x000000000000000000000000000000000000'
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

  expect(pool.query).toBeCalledTimes(3);
  expect(pool.query).nthCalledWith(3,
    `INSERT INTO transactions (
      from_address, token_name, serial_number,
      value, to_address,
      tx_hash, block_time, network_id, btp_fee,
      network_fee, status, total_volume, create_at,
      update_at, contract_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), $13)`,
    [
      txResult.eventLogs[0].indexed[1],
      'ICX',
      1,
      1000,
      txResult.eventLogs[0].data[0],
      txResult.txHash,
      Math.floor(transferNativeCoinTx.timestamp / 1000),
      '0x58eb1c',
      0,
      0.0093075375,
      0,
      1000,
      txResult.eventLogs[0].scoreAddress
    ]
  );
});

test('should update total volume when creating new transaction', async () => {
  pool.query.mockResolvedValueOnce({
    rows: [{ total_volume: 500 }],
    rowCount: 1
  });

  await iconTxHandler.handleTransactionEvents(txResult, transferNativeCoinTx);

  expect(pool.query).toBeCalledTimes(2);
  expect(pool.query).nthCalledWith(2,
    `INSERT INTO transactions (
      from_address, token_name, serial_number,
      value, to_address,
      tx_hash, block_time, network_id, btp_fee,
      network_fee, status, total_volume, create_at,
      update_at, contract_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), $13)`,
    [
      txResult.eventLogs[0].indexed[1],
      'ICX',
      1,
      1000,
      txResult.eventLogs[0].data[0],
      txResult.txHash,
      Math.floor(transferNativeCoinTx.timestamp / 1000),
      '0x58eb1c',
      0,
      0.0093075375,
      0,
      1500,
      txResult.eventLogs[0].scoreAddress
    ]
  );
});
