'use strict';

const { getTransferEvent } = require('../src/modules/icon-indexer/transfer-fee');

const txResult = {
  status: 1,
    to: 'cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e', // token address
    txHash: '0x607984145dfe46bb66b7e329e76569b73124e1bfb1936f55ecfd095499ed24b3',
    txIndex: 0,
    blockHeight: 58009,
    blockHash: '0x7ebbce88efc43e7a797f48fc45b8ae672e8eae4fc583a205db458014c98df6d6',
    eventLogs: [
      {
        scoreAddress: 'cx51291cbe0fff966b881d251b9414e54f5a02dac7',
        indexed: [
          'Transfer(Address,Address,int,bytes)',
          'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
          'cx51291cbe0fff966b881d251b9414e54f5a02dac7', // FAS address
          '0x8e087d455911b400' // amount
        ],
        data: [ '0x' ]
      }
    ],
    logsBloom: '0x0000000000000000800000200000...'
};

test('should return Transfer event from tx result', async () => {
  const event = getTransferEvent(txResult.eventLogs);

  expect(event).toMatchObject({
    tokenAmount: 10.23456789
  });
});
