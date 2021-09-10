'use strict';

const { getMintBurnEvent } = require('../src/modules/icon-indexer/mint-burn');

const transactionMint = {
   timestamp: 1630460980087098,
   nid: { s: 1, e: 0, c: [ 3 ] },
   stepLimit: { s: 1, e: 9, c: [ 5000000000 ] },
   from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
   to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
   signature: 'cqkrqtAUa9E3fposozcNCyonGdGzQOlEz3IntyEjXyUdMvrD2Nx5zKVkDZcD+PpOgm8u96dRGZ7guOAuFxLxRQA=',
   dataType: 'call',
   data: {
     method: 'handleRelayMessage',
     params: {
       _prev: 'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
       _msg: '-Qux-QMNuLn4t7izr0_CgV0GUnZOUzNq6UWF8KN4MdBQKUWh3NwlwWZWFdGeJ',
     }
    },
   version:  { s: 1, e: 0, c: [ 3 ] },
   txHash: '0xbf0271afffb758ac685cc3f5017458ee590c0400cdad42ad3797bc31c0b0b04c'
};

const txResultBurn = {
   status: 1,
   to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
   txHash: '0xbf0271afffb758ac685cc3f5017458ee590c0400cdad42ad3797bc31c0b0b04c',
   txIndex: 0,
   blockHeight: 1133447,
   blockHash: '0xbe190a8aa8791e2017b4f303a0a88d28e37113a293aa7756842fbe9e649842f0',
   cumulativeStepUsed:  { s: 1, e: 6, c: [ 2854716 ] },
   stepUsed: { s: 1, e: 6, c: [ 2854716 ] },
   stepPrice: { s: 1, e: 10, c: [ 12500000000 ] },
   eventLogs: [
     {
       scoreAddress: 'cx8cefe5b2d97d15223f474e1aaab35bcb87450885',
       indexed: [
         'TransferBatch(Address,Address,Address,bytes,bytes)',
         'hx77220b7bd46eee88cf3ca61590030d6f85ae42fe',
         'hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
         'hx0000000000000000000000000000000000000000',
       ],
       data: [
         '0xe1a008f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd',
         '0xc3827bc0'
       ]
     },
     {
       scoreAddress: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
       indexed: [
         'Message(str,int,bytes)',
         'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
         '0x147'
       ],
       data: [
         '0xf89cb8396274703a2f2f3078332e69636f6e2f637832366364623264396366333364656530373830353635333231373561363936623861396663633731b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e8200b696d50293d200905472616e736665722053756363657373'
       ]
     }
   ],
   logsBloom: '0x00000000000080000000000000000000000100000000100000000000000000000000000000000000000000000000000000000000000000000000000002000000000044000000000000008000000000000000200000000000000000004000000002000000000000000000000000008000040000100000000000000000000000000000000000000000000000000000020000000000000000000020000000400000000000000000000000000001000000000000001000000000000000000000000080000020000000010000000000000000000000000000400000000000800000000000010000000001000000000000000000000000000000'
};

const transactionBurn = {
    timestamp: 1630460980080000,
    nid: { s: 1, e: 0, c: [ 3 ] },
    stepLimit: { s: 1, e: 9, c: [ 5000000000 ] },
    from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
    to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
    signature: 'cqkrqtAUa9E3fposozcNCyonGdGzQOlEz3IntyEjXyUdMvrD2Nx5zKVkDZcD+PpOgm8u96dRGZ7guOAuFxLxRQA=',
    dataType: 'call',
    data: {
      method: 'handleRelayMessage',
      params: {
        _prev: 'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
        _msg: '-Qux-QMNuLn4t7izr0_CgV0GUnZOUzNq6UWF8KN4MdBQKUWh3NwlwWZWFdGeJ',
      }
     },
    version:  { s: 1, e: 0, c: [ 3 ] },
    txHash: '0xbf0271afffb758ac685cc3f5017458ee590c0400cdad42ad3797bc31c0b0b04c'
 };

const txResultMint = {
  status: 1,
  to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  txHash: '0xbf0271afffb758ac685cc3f5017458ee590c0400cdad42ad3797bc31c0b0b04c',
  txIndex: 0,
  blockHeight: 1133446,
  blockHash: '0xbe190a8aa8791e2017b4f303a0a88d28e37113a293aa7756842fbe9e649842f0',
  cumulativeStepUsed:  { s: 1, e: 6, c: [ 2854716 ] },
  stepUsed: { s: 1, e: 6, c: [ 2854716 ] },
  stepPrice: { s: 1, e: 10, c: [ 12500000000 ] },
  eventLogs: [
    {
      scoreAddress: 'cx8cefe5b2d97d15223f474e1aaab35bcb87450885',
      indexed: [
        'TransferBatch(Address,Address,Address,bytes,bytes)',
        'hx77220b7bd46eee88cf3ca61590030d6f85ae42fe',
        'hx0000000000000000000000000000000000000000',
        'hx77220b7bd46eee88cf3ca61590030d6f85ae42fe'
      ],
      data: [
        '0xe1a008f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd',
        '0xc3827bc0'
      ]
    },
    {
      scoreAddress: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
      indexed: [
        'Message(str,int,bytes)',
        'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
        '0x147'
      ],
      data: [
        '0xf89cb8396274703a2f2f3078332e69636f6e2f637832366364623264396366333364656530373830353635333231373561363936623861396663633731b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e8200b696d50293d200905472616e736665722053756363657373'
      ]
    }
  ],
  logsBloom: '0x000000000000800000000000000000000001000000001'
};

// Test case for mint event
// Issue: getTokenNameById(id); should not query db.
test.skip('should return mint event from tx result', async () => {
  const event = await getMintBurnEvent(txResultMint, transactionMint);

  expect(event).toMatchObject({
    tokenName: 'DEV',
    tokenId: '0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd',
    tokenValue: 3.168e-14,
    to: 'hx77220b7bd46eee88cf3ca61590030d6f85ae42fe',
    from: 'hx0000000000000000000000000000000000000000',
    txHash: '0xbf0271afffb758ac685cc3f5017458ee590c0400cdad42ad3797bc31c0b0b04c',
    blockHash: '0xbe190a8aa8791e2017b4f303a0a88d28e37113a293aa7756842fbe9e649842f0',
    blockHeight: 1133446,
    blockTime: 1630460980087,
    networkId: '0x3'
  });
});

// Test case for burn event
// Issue: getTokenNameById(id); should not query db.
test.skip('should return burn event from tx result', async () => {
    const event = await getMintBurnEvent(txResultBurn, transactionBurn);

    expect(event).toMatchObject({
        tokenName: 'DEV',
        tokenId: '0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd',
        tokenValue: 3.168e-14,
        to: 'hx0000000000000000000000000000000000000000',
        from: 'hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262',
        txHash: '0xbf0271afffb758ac685cc3f5017458ee590c0400cdad42ad3797bc31c0b0b04c',
        blockHash: '0xbe190a8aa8791e2017b4f303a0a88d28e37113a293aa7756842fbe9e649842f0',
        blockHeight: 1133447,
        blockTime: 1630460980080,
        networkId: '0x3',
    });
});
