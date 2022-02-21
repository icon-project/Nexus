`goloop rpc txbyhash 0x16f5bbd039598199417849e332a8a83e85449c41efd158f07de31cc1512c6f51 --uri https://lisbon.net.solidwallet.io/api/v3`

```json
{
  "txHash": "0x16f5bbd039598199417849e332a8a83e85449c41efd158f07de31cc1512c6f51",
  "version": "0x3",
  "from": "hxb6b5791be0b5ef67063b3c10b840fb81514db2fd",
  "to": "cx48ced4c8202e040cba8cc0178acb4dc557d6df03",
  "stepLimit": "0xd1c215d7",
  "timestamp": "0x5d7ab31a8e259",
  "nid": "0x2",
  "signature": "8gosH9AQwgeKtMYYC6kvL5D3J79L/W/PTHwIIWRXODhD7X3vU2PJv5KULDRCUlZZhzs+hFv0+cZk2Eo8YzwCvgA=",
  "dataType": "call",
  "data": {
    "method": "register",
    "params": {
      "_decimals": "18",
      "_name": "DEV",
      "_symbol": "DEV"
    }
  },
  "blockHash": "0x7e9cdb964ca085c5b18f5322a474c15e438009f74de12124d790c1a1d7629f66",
  "blockHeight": "0x34369c",
  "txIndex": "0x1"
}
```

`https://moonbase-blockscout.testnet.moonbeam.network/tx/0x8ba8b398e5d07e7f854108a0fe85aa855d99b33749a27abb64c0f8320caf628d/internal-transactions`

```bash
  web3 register Result {
  web3   '0': 'ICON',
  web3   '1': 'ICX',
  web3   '2': '18',
  web3   __length__: 3,
  web3   _name: 'ICON',
  web3   _symbol: 'ICX',
  web3   _decimals: '18'
  web3 } +35s
```
