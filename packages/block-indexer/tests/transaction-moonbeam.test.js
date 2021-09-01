'use strict';

const { getTransferStartEvent, getTransferEndEvent } = require('../src/modules/transactions/moonbeam');
const Web3 = require('web3');
const web3 = new Web3(process.env.MOONBEAM_API_URL);

const inputsTransferStartEvent = [
    {indexed: true, internalType: 'address', name: '_from', type: 'address'},
    {indexed: false, internalType: 'string', name: '_to', type: 'string'},
    {indexed: false, internalType: 'uint256', name: '_sn', type: 'uint256'},
    {components: Array(3), indexed: false, internalType: 'struct Types.AssetTransferDetail[]', name: '_assetDetails', type: 'tuple[]'}
];

const inputTransferEndEvent = [
    {indexed: true, internalType: "address", name: "_from", type: "address"},
    {indexed: false, internalType: 'uint256', name: '_sn', type: 'uint256'},
    {indexed: false, internalType: 'uint256', name: '_code', type: 'uint256'},
    {indexed: false, internalType: 'string', name: '_response', type: 'string'},
];


const evmLogDataTransferStart = {
    address: '0x9c1da847b31c0973f26b1a2a3d5c04365a867703',
    topics: [
      '0x50d22373bb84ed1f9eeb581c913e6d45d918c05f8b1d90f0be168f06a4e6994a',
      '0x000000000000000000000000798d4ba9baf0064ec19eb4f0a1a45785ae9d6dfc'
    ],
    data: '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000ab00000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f687837373232306237626434366565653838636633636136313539303033306436663835616534326665000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000007bc0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000034445560000000000000000000000000000000000000000000000000000000000'
}

const evmLogDataTransferEnd = {
    address: '0x9c1da847b31c0973f26b1a2a3d5c04365a867703',
    topics: [
    '0x9b4c002cf17443998e01f132ae99b7392665eec5422a33a1d2dc47308c59b6e2',
    '0x0000000000000000000000004b0d307675cdae97fc624e1987b942f4b9483231'
    ],
    data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000105472616e73666572205375636365737300000000000000000000000000000000'
}



// Test case for transferStart event
test('Should return data transferStart event from input event and evmLogData', async () => {
    const event = await getTransferStartEvent(inputsTransferStartEvent, evmLogDataTransferStart);

    expect(event).toMatchObject({
        from: '0x798d4ba9baf0064ec19eb4f0a1a45785ae9d6dfc',
        to: 'btp://0x3.icon/hx77220b7bd46eee88cf3ca61590030d6f85ae42fe',
        sn: '171',
    });
});

//Test case for transferEnd event
test('Should return data transferEnd event from input event and evmLogData', async () => {
    const event = await getTransferEndEvent(inputTransferEndEvent, evmLogDataTransferEnd);

    expect(event).toMatchObject({
        code: 0,
        from: "0x4b0d307675cdae97fc624e1987b942f4b9483231",
        response: "Transfer Success",
        sn: "1",
    });
});

// Test case for decodeLog
test('Test case for decodeLog', async () => {
    const event = await web3.eth.abi.decodeLog(inputsTransferStartEvent, evmLogDataTransferStart.data, evmLogDataTransferStart.topics.slice(1));

    expect(event).toMatchObject({
        _from: '0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc',
        _to: 'btp://0x3.icon/hx77220b7bd46eee88cf3ca61590030d6f85ae42fe',
        _sn: '171',
        _assetDetails: [
            []
        ]
    });
});