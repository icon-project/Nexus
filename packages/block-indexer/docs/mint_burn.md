# Mint Burn events

## TransferBatch

```json
  icon_tx Transaction result: e {
  icon_tx   status: 1,
  icon_tx   to: 'cx439c888f491198c800b2e2c5566282b93e6fdab9', // ICON_BMC_ADDRESS
  icon_tx   txHash: '0x0bf8083bdf17667c9f91c0d321f1c64a775868441a71cae6ca0656b64fbab933',
  icon_tx   txIndex: 0,
  icon_tx   blockHeight: 600,
  icon_tx   blockHash: '0x5314a0e3995fdf5e3de56db3f854a11fb1fd1ddc86da80b371078f2b53f232bc',
  icon_tx   cumulativeStepUsed: H { s: 1, e: 6, c: [ 2714735 ] },
  icon_tx   stepUsed: H { s: 1, e: 6, c: [ 2714735 ] },
  icon_tx   stepPrice: H { s: 1, e: 10, c: [ 12500000000 ] },
  icon_tx   eventLogs: [
  icon_tx     {
  icon_tx       scoreAddress: 'cxa1229bef36fbdc2d75c8d4ec4b39102586f81eab',
  icon_tx       indexed: [
  icon_tx         'TransferBatch(Address,Address,Address,bytes,bytes)',
  icon_tx         'hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab',
  icon_tx         'hx0000000000000000000000000000000000000000',
  icon_tx         'hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab'
  icon_tx       ],
  icon_tx       data: [
  icon_tx         '0xe1a008f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd',
  icon_tx         '0xc9880dbd2fc137a23cb0'
  icon_tx       ]
  icon_tx     },
  icon_tx     {
  icon_tx       scoreAddress: 'cx439c888f491198c800b2e2c5566282b93e6fdab9',
  icon_tx       indexed: [
  icon_tx         'Message(str,int,bytes)',
  icon_tx         'btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46',
  icon_tx         '0x3'
  icon_tx       ],
  icon_tx       data: [
  icon_tx         '0xf89fb83e6274703a2f2f30783538656231632e69636f6e2f637834333963383838663439313139386338303062326532633535363632383262393365366664616239b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e0196d50293d200905472616e736665722053756363657373'
  icon_tx       ]
  icon_tx     }
  icon_tx   ],
  icon_tx   logsBloom: '0x000000000000820000000000000000000001...'
  icon_tx }
```

## TransferSingle

```json
eth_tx {
  eth_tx   method: { pallet: 'ethereum', method: 'transact' },
  eth_tx   signature: null,
  eth_tx   nonce: null,
  eth_tx   args: {
  eth_tx     transaction: {
  eth_tx       nonce: '93',
  eth_tx       gasPrice: '1000000000',
  eth_tx       gasLimit: '10000000',
  eth_tx       action: { call: '0x5cc307268a1393ab9a764a20dace848ab8275c46' }, // MOONBEAM_BMC_ADDRESS
  eth_tx       value: '0',
  eth_tx       input: '0x6f4779cc000000000000000000000000000000...',
  eth_tx       signature: {
  eth_tx         v: '2598',
  eth_tx         r: '0x8e288c7a548b0fd47c0481e794f989c5adf118bae56f55262aa1520e52e83251',
  eth_tx         s: '0x24c84c8f85855325e631ef38e176f7dbac26d1e4dd107a4de2014ffa15943b92'
  eth_tx       }
  eth_tx     }
  eth_tx   },
  eth_tx   tip: null,
  eth_tx   hash: '0x260f49f17547f5852007f66a6f74455cc7b45cb68ac25713e4747cdbe5ef092c',
  eth_tx   info: {},
  eth_tx   events: [
  eth_tx     {
  eth_tx       method: { pallet: 'evm', method: 'Log' },
  eth_tx       data: [
  eth_tx         {
  eth_tx           address: '0x7d4567b7257cf869b01a47e8cf0edb3814bdb963',
  eth_tx           topics: [
  eth_tx             '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
  eth_tx             '0x0000000000000000000000009c1da847b31c0973f26b1a2a3d5c04365a867703',
  eth_tx             '0x0000000000000000000000000000000000000000000000000000000000000000',
  eth_tx             '0x000000000000000000000000f8ac273f62f2d1d7283be823400e05aeddc389f5'
  eth_tx           ],
  eth_tx           data: '0xa507a47b174bd5e57300fc555418f6e30207d9f78a31298d1c44e17507aa81b20000000000000000000000000000000000000000000000008963dd8c2c5e0000'
  eth_tx         }
  eth_tx       ]
  eth_tx     },
  eth_tx     {
  eth_tx       method: { pallet: 'evm', method: 'Log' },
  eth_tx       data: [
  eth_tx         {
  eth_tx           address: '0x5cc307268a1393ab9a764a20dace848ab8275c46',
  eth_tx           topics: [
  eth_tx             '0x37be353f216cf7e33639101fd610c542e6a0c0109173fa1c1d8b04d34edb7c1b'
  eth_tx           ],
  eth_tx           data: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f63783433396338383866343931313938633830306232653263353536363238326239336536666461623900000000000000000000000000000000000000000000000000000000000000000091f88fb83a6274703a2f2f30783530312e7072612f307835434333303732363861313339334142394137363441323044414345383438414238323735633436b83e6274703a2f2f30783538656231632e69636f6e2f6378343339633838386634393131393863383030623265326335353636323832623933653666646162398a6e6174697665636f696e0186c50283c20080000000000000000000000000000000'
  eth_tx         }
  eth_tx       ]
  eth_tx     },
  eth_tx     {
  eth_tx       method: { pallet: 'ethereum', method: 'Executed' },
  eth_tx       data: [
  eth_tx         '0x3cd0a705a2dc65e5b1e1205896baa2be8a07c6e0',
  eth_tx         '0x0000000000000000000000000000000000000000',
  eth_tx         '0x1616f8cfcf45874c7433264e2f52075230bcf58b110b143aef009ee6bd8dd030',
  eth_tx         { succeed: 'Returned' }
  eth_tx       ]
  eth_tx     },
  eth_tx     {
  eth_tx       method: { pallet: 'system', method: 'ExtrinsicSuccess' },
  eth_tx       data: [ { weight: '80418150000', class: 'Normal', paysFee: 'Yes' } ]
  eth_tx     }
  eth_tx   ],
  eth_tx   success: true,
  eth_tx   paysFee: false
  eth_tx }
  ```
