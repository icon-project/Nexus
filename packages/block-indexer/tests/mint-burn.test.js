'use strict';

const { getMintEvent } = require('../src/modules/icon-indexer/mint-burn');

const transaction = {
    timestamp: 1625807568924298,
    nid: { s: 1, e: 0, c: [ 3 ] },
    stepLimit: { s: 1, e: 10, c: [ 10000000000 ] },
    from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
    to: 'cxf77ac976e382563402b10eb94f7fa3ad35cb983d',
    signature: 'M+6/VRAJtO0DSbsnTNNIuPRCtEULL9aEvpaDc5NLoi95Iwr9moyu9nJQ7KQ2QbK4T4s6ARqyFGWAFB8f6TCDTQE=',
    dataType: 'call',
    data: {
        method: 'transferFrom',
        params: {
            _from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
            _id: '99',
            _to: 'cx22da8f73382c8ad3c8dfee26f2f50b147ee6cd31',
            _value: '60000000000'
        }
    },
    version:  { s: 1, e: 0, c: [ 3 ] },
    txHash: '0x9cb5c3551f1f593edb325a87937d51da56e61a48bfc285e4f2951e74c9fbdecf'
};

const txResult = {
    status: 1,
    to: 'cxf77ac976e382563402b10eb94f7fa3ad35cb983d', // token address
    txHash: '0x9cb5c3551f1f593edb325a87937d51da56e61a48bfc285e4f2951e74c9fbdecf',
    txIndex: 0,
    blockHeight: 98274,
    blockHash: '0x5a9512b284eb02feaa835651f7a6df99672835ec1a6bc846400e61f41a13faa6',
    eventLogs: [
        {
            scoreAddress: 'cxf77ac976e382563402b10eb94f7fa3ad35cb983d',
            indexed: [
            'TransferSingle(Address,Address,Address,int,int)',//
            'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',  // owner address
            '0', //  When minting/creating tokens, the `_from` must be set to zero address.
            'cx22da8f73382c8ad3c8dfee26f2f50b147ee6cd31' // _to address
            ],
            data: [ '0x63', '0x8AC7230489E80000' ] // id of the token('0x63') and the minted value('0x8AC7230489E80000')
        }
    ],
    logsBloom: '0x0000000000000000800000200000...'
};

const txResultBatch = {
    status: 1,
    to: 'cxf77ac976e382563402b10eb94f7fa3ad35cb983d', // token address
    txHash: '0x9cb5c3551f1f593edb325a87937d51da56e61a48bfc285e4f2951e74c9fbdecf',
    txIndex: 0,
    blockHeight: 98274,
    blockHash: '0x5a9512b284eb02feaa835651f7a6df99672835ec1a6bc846400e61f41a13faa6',
    eventLogs: [
        {
            scoreAddress: 'cxf77ac976e382563402b10eb94f7fa3ad35cb983d',
            indexed: [
            'TransferBatch(Address,Address,Address,bytes,bytes)',//
            'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',  // owner address
            '0', //  When minting/creating tokens, the `_from` must be set to zero address.
            'cx22da8f73382c8ad3c8dfee26f2f50b147ee6cd31' // _to address
            ],
            data: [ '0xabcd494635c9adc5dea0000000', '0xefa83494335c9adc5cab0000000' ] // ids and values
        }
    ],
    logsBloom: '0x0000000000000000800000200000...'
};

// Test case for mint event
test('should return mint event from tx result', async () => {
    const event = await getMintEvent(txResult, transaction);

    expect(event[0]).toMatchObject({
        tokenValue: 10,
        tokenName: 'NEAR',
        txHash: '0x9cb5c3551f1f593edb325a87937d51da56e61a48bfc285e4f2951e74c9fbdecf',
        blockHash: '0x5a9512b284eb02feaa835651f7a6df99672835ec1a6bc846400e61f41a13faa6',
        blockHeight: 98274,
        blockTime: 1625807568924,
        networkId: 3,
    });
});

// Test case for mintBatch event
test('should return mintBatch event from tx result', async () => {
    const event = await getMintEvent(txResultBatch, transaction);

    expect(event[0]).toMatchObject({
        tokenValue: 100,
        tokenName: 'DOT',
        txHash: '0x9cb5c3551f1f593edb325a87937d51da56e61a48bfc285e4f2951e74c9fbdecf',
        blockHash: '0x5a9512b284eb02feaa835651f7a6df99672835ec1a6bc846400e61f41a13faa6',
        blockHeight: 98274,
        blockTime: 1625807568924,
        networkId: 3,
    });

    expect(event[1]).toMatchObject({
        tokenValue: 200,
        tokenName: 'BNB',
        txHash: '0x9cb5c3551f1f593edb325a87937d51da56e61a48bfc285e4f2951e74c9fbdecf',
        blockHash: '0x5a9512b284eb02feaa835651f7a6df99672835ec1a6bc846400e61f41a13faa6',
        blockHeight: 98274,
        blockTime: 1625807568924,
        networkId: 3,
    });
});