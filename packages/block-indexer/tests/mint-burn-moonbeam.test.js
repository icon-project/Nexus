'use strict';

const { getMintBurnEvent, getBaseInfoBlock } = require('../src/modules/moonbeam-indexer/mint-burn');

// transaction
const transaction = {
  method: { pallet: 'ethereum', method: 'transact' },
  signature: null,
  nonce: null,
  args: {
    transaction: {
      nonce: '30',
      gasPrice: '0',
      gasLimit: '21000',
      action: { call: '0x3cd0a705a2dc65e5b1e1205896baa2be8a07c6e0' },
      value: '1000000000000000000',
      input: '0x',
      signature: {
        v: '2598',
        r: '0x2f026701abf30b25f141d14141b7bba63258197369c4253609c9b0187886eb01',
        s: '0x793e2c155257e3557576ae5da7f6915cc5d7739e634dec80a5532e4545b7d457'
      }
    }
  },
  tip: null,
  hash: '0xa24a4e702806561c50e144e26ee617499a47c872877a471e303d521700302236',
  info: {},
  events: [
    {
      method: { pallet: 'balances', method: 'TransferSingle(Address,Address,Address,int,int)' },
      data: [
        '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac', // owner
        '0x0', // from
        '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', // to
        '0xa2bda12341565adbefaca', // id
        '1000000000000000000' // value
      ]
    },
    {
      method: { pallet: 'ethereum', method: 'Executed' },
      data: [
        '0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac',
        '0x0000000000000000000000000000000000000000',
        '0x1d2cf09c29bff0ccc526c976f1c518d0dd15f79b72d08fbd9aee91595faa6988',
        [Object]
      ]
    },
    {
      method: { pallet: 'system', method: 'ExtrinsicSuccess' },
      data: [ [Object] ]
    }
  ],
  success: true,
  paysFee: false
};

// block
const block = {
  number: '31',
  hash: '0x614eb173c49fe93a227c5e09e970c226e24150ec4d3b8954c28f3c688be3076c',
  parentHash: '0xf325209c0ab01090f6b5332338b79f9af4f20628e22beb697512eefe016ecd2d',
  stateRoot: '0xd59d9300ea0e611ca2b7e7680cc138f7ac60e70bf15cb1e5c4b4ef8dfcf8a325',
  extrinsicsRoot: '0xfa48a8fa47f32224d581492fa2e32666433f3979608c5b48bd63548511bac14b',
  authorId: '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b',
    logs: [
      {
        type: 'Consensus',
        index: '4',
        value: [ '0x61757468', '0x6be02d1d3665660d22ff9624b7be0551ee1ac91b' ]
      },
      {
        type: 'Consensus',
        index: '4',
        value: [
          '0x66726f6e',     '0x017429e4fba3f7cd02db8ddfea2ca5b076f6e4fb6255727fbdbac0551982d11c1f041d2cf09c29bff0ccc526c976f1c518d0dd15f79b72d08fbd9aee91595faa6988'
        ]
      }
    ],
    extrinsics: [
      {
        method: { pallet: 'timestamp', method: 'set' },
        signature: null,
        nonce: null,
        args: { now: '1627874540955' },
        tip: null,
        hash: '0xe880d53f889d6e01f790ca34c0d712c559500c398e0acfd92fa60a4c36ff7694',
        info: {},
        events: [
          {
            method: { pallet: 'system', method: 'ExtrinsicSuccess' },
            data: [ [Object] ]
          }
        ],
        success: true,
        paysFee: false
      },
      {
      method: { pallet: 'ethereum', method: 'transact' },
      signature: null,
      nonce: null,
      args: {
        transaction: {
          nonce: '30',
          gasPrice: '0',
          gasLimit: '21000',
          action: { call: '0x3cd0a705a2dc65e5b1e1205896baa2be8a07c6e0' },
          value: '1000000000000000000',
          input: '0x',
          signature: {
            v: '2598',
            r: '0x2f026701abf30b25f141d14141b7bba63258197369c4253609c9b0187886eb01',
            s: '0x793e2c155257e3557576ae5da7f6915cc5d7739e634dec80a5532e4545b7d457'
          }
        }
      },
      tip: null,
      hash: '0xa24a4e702806561c50e144e26ee617499a47c872877a471e303d521700302236',
      info: {},
      events: [
        {
          method: { pallet: 'balances', method: 'TransferSingle(Address,Address,Address,int,int)' },
          data: [
            '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac', // owner
            '0x0', // from
            '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0', // to
            '0xa2bda12341565adbefaca', // id
            '1000000000000000000' // value
          ]
        },
        {
          method: { pallet: 'ethereum', method: 'Executed' },
          data: [
            '0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac',
            '0x0000000000000000000000000000000000000000',
            '0x1d2cf09c29bff0ccc526c976f1c518d0dd15f79b72d08fbd9aee91595faa6988',
            [Object]
          ]
        },
        {
          method: { pallet: 'system', method: 'ExtrinsicSuccess' },
          data: [ [Object] ]
        }
      ],
      success: true,
      paysFee: false
    }
    ]
}

// Test case for mint event
test('should return mint event on MOONBEAM from tx result', async () => {
    const event = await getMintBurnEvent(transaction);

    expect(event).toMatchObject({
      tokenValue: 1,
      tokenName: 'BNB',
      txHash: '0xa24a4e702806561c50e144e26ee617499a47c872877a471e303d521700302236'
    });
});

// Test case for base block
test('should return block info on MOONBEAM from tx result', async () => {
  const blockInfo = await getBaseInfoBlock(block);

  expect(blockInfo).toMatchObject({
    blockTime: '1627874540955',
    blockHash: '0x614eb173c49fe93a227c5e09e970c226e24150ec4d3b8954c28f3c688be3076c',
    blockHight: '31',});
});