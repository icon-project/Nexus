/* eslint-disable no-undef */
'use strict';

const { getAuctionStartEvent, getAuctionEndedEvent, getBidInfoEvent } = require('../src/modules/icon-indexer/auctions');

const txResult = {
  status: 1,
  to: 'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367', // FAS
  txHash: '0x7b6dd83326648349ddb3412a37fb022195673294a3754a4dbd90571d9db98561',
  txIndex: 0,
  blockHeight: 23215,
  blockHash: '0x3a08d1ac4ac70969dd21ec23c9f8b329155d16b1f8c82ff86dea970b12bd5860',
  eventLogs: [
    {
      scoreAddress: 'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367',
      indexed: [
        'ICXTransfer(Address,Address,int)',
        'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367',
        'cx031b8ac09dac6acc9719442ed80bd514fa914db2',
        '0x63bf212b431ec0000'
      ],
      data: []
    },
    {
      scoreAddress: 'cx031b8ac09dac6acc9719442ed80bd514fa914db2',
      indexed: [
        'FundReceived(Address,str)',
        'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367'
      ],
      data: ['Treasury Fund 115000000000000000000 Received.']
    },
    {
      scoreAddress: 'cx18fbe903abdbb4b1e484e3135782ba2b8ba8dd4c',
      indexed: [
        'Transfer(Address,Address,int,bytes)',
        'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367',
        'hx774ca45c762872ac6dd4780784e279ceb389dec9',
        '0x56bc75e2d63100000'
      ],
      data: ['0x7472616e7366657220746f20626964646572']
    },
    {
      scoreAddress: 'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367', // FAS
      indexed: [
        'AuctionEnded(int,str,Address,int,int,int)',
        '0x1',
        'SampleToken020',
        'hx774ca45c762872ac6dd4780784e279ceb389dec9'
      ],
      data: [
        '0x8e087d455911b400',
        '0x6c6bb29f196746000',
        '0x5c3e8c457f50d'
      ]
    },
    {
      scoreAddress: 'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367', // FAS
      indexed: [
        'AuctionStart(int,str,int,Address,int,int)',
        '0x1',
        'SampleToken020',
        '0x8e087d455911b400'
      ],
      data: [
        'hx774ca45c762872ac6dd4780784e279ceb389dec9',
        '0x5f68fb07608ec7d80',
        '0x5c4b6f8674b0e'
      ]
    },
    {
      scoreAddress: 'cx8ca6ca89fdf3ce6e77b9531b66da51a455be7367',
      indexed: [
        'BidInfo(int,str,Address,int,Address,int)',
        '0x1',
        'SampleToken020',
        'hx774ca45c762872ac6dd4780784e279ceb389dec9'
      ],
      data: [
        '0x5f68fb07608ec7d80',
        'hx774ca45c762872ac6dd4780784e279ceb389dec9',
        '0x6c6bb29f196746000'
      ]
    }
  ],
  logsBloom: '0x040000000000000000000021000000200100...'
};

test('should return AuctionStart event from tx result', async () => {
  const auctionStart = getAuctionStartEvent(txResult.eventLogs);

  // console.log(auctionStart);
  expect(auctionStart).toMatchObject({
    id: 1,
    tokenName: 'SampleToken020',
    tokenAmount: 10.23456789,
    bidderAddress: 'hx774ca45c762872ac6dd4780784e279ceb389dec9',
    bidAmount: 110.00033344455,
    endTime: 1623665014164
  });
});

test('should return AuctionEnded event from tx result', async () => {
  const auctionEnded = getAuctionEndedEvent(txResult.eventLogs);

  expect(auctionEnded).toMatchObject({
    id: 1,
    tokenName: 'SampleToken020',
    winnerAddress: 'hx774ca45c762872ac6dd4780784e279ceb389dec9',
    winnerBidAmount: 125.00055,
    tokenAmount: 10.23456789,
    endTime: 1622779377480
  });
});

test('should return BidInfo event from tx result', async () => {
  const bidInfo = getBidInfoEvent(txResult.eventLogs);

  expect(bidInfo).toMatchObject({
    auctionId: 1,
    tokenName: 'SampleToken020',
    currentBidderAddress: 'hx774ca45c762872ac6dd4780784e279ceb389dec9',
    currentBidAmount: 110.00033344455,
    newBidderAddress: 'hx774ca45c762872ac6dd4780784e279ceb389dec9',
    newBidAmount: 125.00055
  });
});
