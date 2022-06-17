/* eslint-disable no-undef */
'use strict';

jest.mock('../src/modules/tokens/model', () => ({
  getTokenName: jest.fn()
}));

const tokenModel = require('../src/modules/tokens/model');
const { getMintBurnEvent } = require('../src/modules/mint-burn/icon');

const mintTx = {
  timestamp: 1652440529773522,
  nid: { s: 1, e: 0, c: [7] },
  stepLimit: { s: 1, e: 10, c: [13610920010] },
  from: 'hx681a290ecf0e460998d6bebe7b3da7589ed6b3db',
  to: 'cxf3f7533eead8941a5655a90379caf9d121fb2725',
  signature: 'Loi2Z5YhTS5WjCl3P2pE6Rv1+yRWC0Y2gCDLZqfWagoKfjwR66ri3IlxkMBNDPkOXlANUf+CXxhmqTYk89rSxAE=',
  dataType: 'call',
  data: {
    method: 'handleRelayMessage',
    params: {
      _prev: 'btp://0x61.bsc/0x121A1AAd623AF68162B1bD84c44234Bc3a3562a9',
      _msg: '-QFI-QFFuQFC-QE_B7kBNvkBM_kBMLg5YnRwOi8vMHg3Lmljb24vY3hmM2Y3NTMzZWVhZDg5NDFhNTY1NWE5MDM3OWNhZjlkMTIxZmIyNzI1Srjy-PC4OWJ0cDovLzB4NjEuYnNjLzB4MTIxQTFBQWQ2MjNBRjY4MTYyQjFiRDg0YzQ0MjM0QmMzYTM1NjJhObg5YnRwOi8vMHg3Lmljb24vY3hmM2Y3NTMzZWVhZDg5NDFhNTY1NWE5MDM3OWNhZjlkMTIxZmIyNzI1im5hdGl2ZWNvaW4duGz4agC4Z_hlqjB4NTA0Y2YyZEFlMEFCMzRhQ2VhQUVCMjk1NDY3MzYxN2Y1QjFBMjJBMKpoeDY4MWEyOTBlY2YwZTQ2MDk5OGQ2YmViZTdiM2RhNzU4OWVkNmIzZGLOzYNCTkKIBt6X4JvQvLCEASX_DQ=='
    }
  },
  version: { s: 1, e: 0, c: [3] },
  txHash: '0x6f9e009c6d9ab1dc39342d64d14f777b220981cf77796ee9ed97f9e860d5f935'
};

const mintTxResult = {
  status: 1,
  to: 'cxf3f7533eead8941a5655a90379caf9d121fb2725',
  txHash: '0x6f9e009c6d9ab1dc39342d64d14f777b220981cf77796ee9ed97f9e860d5f935',
  txIndex: 1,
  blockHeight: 6661436,
  blockHash: '0x4be8114485aef4fdf7c8af341f53f3beb8e7e1936765cb53acf3e29e5d18cfb5',
  cumulativeStepUsed: { s: 1, e: 6, c: [2205893] },
  stepUsed: { s: 1, e: 6, c: [2205893] },
  stepPrice: { s: 1, e: 10, c: [12500000000] },
  eventLogs: [
    {
      scoreAddress: 'cxb6d60828624d902f5e0b1980b3e9fe27d6fe4b9e',
      indexed: [
        'Transfer(Address,Address,int,bytes)',
        'hx0000000000000000000000000000000000000000',
        'hx681a290ecf0e460998d6bebe7b3da7589ed6b3db',
        '0x6de97e09bd0bcb0'
      ],
      data: ['0x6d696e74']
    },
    {
      scoreAddress: 'cxf3f7533eead8941a5655a90379caf9d121fb2725',
      indexed: [
        'Message(str,int,bytes)',
        'btp://0x61.bsc/0x121A1AAd623AF68162B1bD84c44234Bc3a3562a9',
        '0x4d'
      ],
      data: [
        '0xf899b8396274703a2f2f3078372e69636f6e2f637866336637353333656561643839343161353635356139303337396361663964313231666232373235b8396274703a2f2f307836312e6273632f3078313231413141416436323341463638313632423162443834633434323334426333613335363261398a6e6174697665636f696e1d96d50293d200905472616e736665722053756363657373'
      ]
    }
  ],
  logsBloom: '0x00000000000000000200002800000000000100200000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000008040000000000000000000000200000000000000000000000000000000800000000000000000000000000200001000000000400000000000000000000000002000080000000000000020000000000000000000000000000100000000000080000000000000000000000000000000000000000000000004000010000002000020000000000000000000000000000000001000000000400000000000000000000020100000000000000000000000000000000000004000000000000'
};

const burnTx = {
  timestamp: 1652931208216566,
  nid: { s: 1, e: 0, c: [7] },
  stepLimit: { s: 1, e: 10, c: [13610920010] },
  from: 'hxfaff7dfd515d7f2b43270d5977b7587a65a48972',
  to: 'cx17ead9e38e3c67f7e60adffdc2891eab2a932481',
  signature: 'r3E1LPfy5Uz2QZB+90Q/rvLb4CRG7TQ8yMPBCtjiExtf9YJPMK69C1h3+BIHLIw2ivr1b0RaQ6CGy1t/l5TSuQE=',
  dataType: 'call',
  data: {
    method: 'handleRelayMessage',
    params: {
      _prev: 'btp://0x6357d2e0.hmny/0x4159f9A697735b299813Fe3A540c55e4bba4DD39',
      _msg: '-OL44Lje-NwAuNT40vjQuDlidHA6Ly8weDcuaWNvbi9jeDE3ZWFkOWUzOGUzYzY3ZjdlNjBhZGZmZGMyODkxZWFiMmE5MzI0ODE8uJL4kLhAYnRwOi8vMHg2MzU3ZDJlMC5obW55LzB4NDE1OWY5QTY5NzczNWIyOTk4MTNGZTNBNTQwYzU1ZTRiYmE0REQzObg5YnRwOi8vMHg3Lmljb24vY3gxN2VhZDllMzhlM2M2N2Y3ZTYwYWRmZmRjMjg5MWVhYjJhOTMyNDgxim5hdGl2ZWNvaW4YhsUCg8IAgIQBg6y6'
    }
  },
  version: { s: 1, e: 0, c: [3] },
  txHash: '0x0ca3a18ee4b69c05e72c46f8ac4fd602680ca9ab635364272778e5d2bc69f26c'
};

const burnTxResult = {
  status: 1,
  to: 'cx17ead9e38e3c67f7e60adffdc2891eab2a932481',
  txHash: '0x0ca3a18ee4b69c05e72c46f8ac4fd602680ca9ab635364272778e5d2bc69f26c',
  txIndex: 1,
  blockHeight: 6904682,
  blockHash: '0x7f61ca668fd8ab1555ee474ef42cf676e2818213ecd1643fcaa171848a55658c',
  cumulativeStepUsed: { s: 1, e: 6, c: [1541598] },
  stepUsed: { s: 1, e: 6, c: [1541598] },
  stepPrice: { s: 1, e: 10, c: [12500000000] },
  eventLogs: [
    {
      scoreAddress: "cxf6e39926c8a0a3597537ab478aac64c7e1ed8906",
      indexed: [
        "Transfer(Address,Address,int,bytes)",
        "cxedde5ba834fddcea4ae488eb0e588abb2b7831a9",
        "hx0000000000000000000000000000000000000000",
        "0x232bff5f46c000"
      ],
      data: [
        "0x6275726e"
      ]
    },
    {
      scoreAddress: "cxedde5ba834fddcea4ae488eb0e588abb2b7831a9",
      indexed: [
        "TransferEnd(Address,int,int,bytes)",
        "hx6d338536ac11a0a2db06fb21fe8903e617a6764d"
      ],
      data: [
        "0x18",
        "0x0",
        "0x"
      ]
    }
  ],
  logsBloom: "0x00000000000080200000002000000000000000000100000000000000000000000000004000000000000000000000000000000000000040001000000000000000000800000000001000008000000000000000001000000000000000200000000000000000080000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000800000000000000000110000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000001000000004000000000020200000000000000000000000000000000000000000000000000000000000400"
};

test('should return mint event from tx result', async () => {
  tokenModel.getTokenName.mockReturnValue('DEV');
  const event = await getMintBurnEvent(mintTxResult.eventLogs[0], mintTx);
  event.tokenValue = Number(event.tokenValue).toFixed(20);

  expect(event).toMatchObject({
    tokenName: 'DEV',
    tokenValue: '0.49499999999995003552',
    from: 'hx0000000000000000000000000000000000000000',
    to: 'hx681a290ecf0e460998d6bebe7b3da7589ed6b3db',
    networkId: '0x7',
    txHash: '0x6f9e009c6d9ab1dc39342d64d14f777b220981cf77796ee9ed97f9e860d5f935',
    blockTime: 1652440529773
  });

  jest.clearAllMocks();
});

test('should return burn event from tx result', async () => {
  tokenModel.getTokenName.mockReturnValue('DEV');
  const event = await getMintBurnEvent(burnTxResult.eventLogs[0], burnTx);
  event.tokenValue = Number(event.tokenValue).toFixed(20);

  expect(event).toMatchObject({
    tokenName: 'DEV',
    tokenValue: '0.00990000000000000081',
    from: 'cxedde5ba834fddcea4ae488eb0e588abb2b7831a9',
    to: 'hx0000000000000000000000000000000000000000',
    networkId: '0x7',
    txHash: '0x0ca3a18ee4b69c05e72c46f8ac4fd602680ca9ab635364272778e5d2bc69f26c',
    blockTime: 1652931208216
  });

  jest.clearAllMocks();
});
