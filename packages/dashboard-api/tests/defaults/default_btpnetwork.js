//Define default values for btn-network api from test_all_server.log

const functions_btpnetwork = {
  //Define default values for btn-network api: curl $HOST/v1/btpnetwork | jq
  btpnetwork: () => {
    return {
      content: {
        volume: 1993.27,
        bondedValue: 0,
        fee: {
          cumulativeAmount: 0,
          currentAmount: 0,
          assets: [],
          allTimeAmount: [],
        },
        totalNetworks: 4,
        totalTransactions: 104,
        minted: [
          {
            networkId: '0x3',
            networkName: 'Icon',
            mintedVolume: 34.12,
          },
          {
            networkId: '0x501',
            networkName: 'Moonbeam',
            mintedVolume: 1181.07,
          },
          {
            networkId: '0x1',
            networkName: 'NEARProtocol',
            mintedVolume: 0,
          },
          {
            networkId: '0x4',
            networkName: 'Binance',
            mintedVolume: 0,
          },
        ],
      },
    };
  },
  //Define default values for btn-network api: curl $HOST/v1/btpnetwork\?stats=1 | jq
  btpnetwork_stats: () => {
    return {
      content: {
        volume: 1993.27,
        bondedValue: 0,
        fee: {
          cumulativeAmount: 0,
          currentAmount: 0,
          assets: [],
          allTimeAmount: [],
        },
        totalNetworks: 4,
        totalTransactions: 104,
        minted: [
          {
            networkId: '0x3',
            networkName: 'Icon',
            mintedVolume: 34.12,
          },
          {
            networkId: '0x501',
            networkName: 'Moonbeam',
            mintedVolume: 1181.07,
          },
          {
            networkId: '0x1',
            networkName: 'NEARProtocol',
            mintedVolume: 0,
          },
          {
            networkId: '0x4',
            networkName: 'Binance',
            mintedVolume: 0,
          },
        ],
        stats: {
          indexers: [
            {
              network_id: '0x3',
              name: 'ICON',
              block_height: 1636304,
              updated_time: '2021-09-12T10:14:47.225Z',
            },
            {
              network_id: '0x501',
              name: 'Moonbeam',
              block_height: 1091954,
              updated_time: '2021-09-12T19:39:49.506Z',
            },
            {
              network_id: '0x61',
              name: 'BSC',
              block_height: 12318715,
              updated_time: '2021-09-12T19:39:49.591Z',
            },
          ],
        },
      },
    };
  },
  //Define default values for btn-network api: curl $HOST/v1/btpnetwork\?volumeLast24h=true\&mintLast24h=true | jq
  btpnetwork_24h: () => {
    return {
      content: {
        volume: 1932.88,
        volumeLast24hChange: 100,
        bondedValue: 0,
        fee: {
          cumulativeAmount: 0,
          currentAmount: 0,
          assets: [],
          allTimeAmount: [],
        },
        totalNetworks: 4,
        totalTransactions: 101,
        minted: [
          {
            networkId: '0x3',
            networkName: 'Icon',
            mintedVolume: 34.12,
          },
          {
            networkId: '0x501',
            networkName: 'Moonbeam',
            mintedVolume: 1180.08,
          },
          {
            networkId: '0x1',
            networkName: 'NEARProtocol',
            mintedVolume: 0,
          },
          {
            networkId: '0x4',
            networkName: 'Binance',
            mintedVolume: 0,
          },
        ],
        mintVolumeLast24hChange: 0,
      },
    };
  },
  //Define default values for btn-network api: curl $HOST/v1/btpnetwork/converter\?token=btc\&amount=100\&convert_to=usd | jq
  btpnetwork_converter: () => {
    return {
      content: [
        {
          name: 'USD',
          value: 100,
        },
      ],
    };
  },
};
module.exports = functions_btpnetwork;
