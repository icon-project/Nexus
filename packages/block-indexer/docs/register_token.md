Transaction: e {
     timestamp: 1632295444738984,
     nid: H { s: 1, e: 6, c: [ 1055835 ] },
     stepLimit: H { s: 1, e: 9, c: [ 5000000000 ] },
     from: 'hx5e39a47007c2d79ae1879fb6b524538bbab785ae',
     to: 'cx566769f7f8253763d6d022b390a1453d13c28a7b',
     signature: 'JExIo1iqT+yJMhB/QP+8k5wSBRUSjv1F7dTwp8c1rCEGBQQmwAnrkCpw5Hz7tDrKzlSXctNLp2O3WNRy+ryrYQA=',
     dataType: 'call',
     data: {
       method: 'addService',
       params: {
         _addr: 'cx77622c6d0bcd80048eb159aa99fd30df2f38c97f',
         _svc: 'TokenBSH'
       }
     },
     version: H { s: 1, e: 0, c: [ 3 ] },
     txHash: '0x3f09bf2d587fb0b38ad7ce1d6613b01ba77f14e28bbbdecbf3612f5fe5d27acf'
   } +2s

// IRC2
   Transaction: e {
     timestamp: 1632295447017967,
     nid: H { s: 1, e: 6, c: [ 1055835 ] },
     stepLimit: H { s: 1, e: 9, c: [ 5000000000 ] },
     from: 'hx5e39a47007c2d79ae1879fb6b524538bbab785ae',
     to: 'cx77622c6d0bcd80048eb159aa99fd30df2f38c97f',
     signature: 'nDCMo4qoC49i+N1v4u26BFj+1YWGRrcOfBS0JfALnVQ+I2S7eYZpDd8sLyG7hPARTCeKjNqIMO/T3TjRp0OmcgA=',
     dataType: 'call',
     data: {
       method: 'register',
       params: {
         address: 'cxe32aa9a25c3a934134db8dd6749832fee8b45834',
         decimals: '0x12',
         feeNumerator: '0x1',
         name: 'ETH',
         symbol: 'ETH'
       }
     },
     version: H { s: 1, e: 0, c: [ 3 ] },
     txHash: '0x8fabd9ad200497d59f0e2528772d2df8e98093ca3645b821d78286056e9a7c9e'
   } +2s


// IRC31
{
  "txHash": "0xd27a921020404b62e60160634b624e372329461cc44995f40ecd30cafa0e176d",
  "version": "0x3",
  "from": "hxb6b5791be0b5ef67063b3c10b840fb81514db2fd",
  "to": "cxc53d35b4cd28150ee1bd9a36a6d882a5af37b7fd",
  "stepLimit": "0x12a05f200",
  "timestamp": "0x5cd089efa4e94",
  "nid": "0x58eb1c",
  "signature": "tBIN5Up32VyuFgmuZBwcWPEuqRG5AGyZ9E1V7vlFHyEqDZYz8FxFk/1PeejMz7o2nE9UrDm0BozwXBt2XCtzBQE=",
  "dataType": "call",
  "data": {
    "method": "register",
    "params": {
      "_name": "DEV"
    }
  },
  "blockHash": "0x9f5554a3ce285df58be6070588eaddb5921e93cef0f3fbddb6fb96331875cee6",
  "blockHeight": "0x13b",
  "txIndex": "0x0"
}

``` json
Transaction result of register non-token on Moonbeam

{
  "blockHash": "0x7af144284932676713c3504b967e58624e748e6e49fd2dbe664d9886c3916280",
  "blockNumber": 203560,
  "chainId": "0x501",
  "creates": null,
  "from": "0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac",
  "gas": 323804,
  "gasPrice": "1000000000",
  "hash": "0xf0640b5877203550332354046e6ed56f9cd881ed6fa4a30b9e39f4be62ae3256",
  "input": "0xf2c298be0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000453414e4700000000000000000000000000000000000000000000000000000000",
  "nonce": 23,
  "publicKey": "0x509540919faacf9ab52146c9aa40db68172d83777250b28e4679176e49ccdd9fa213197dc0666e85529d6c9dda579c1295d61c417f01505765481e89a4016f02",
  "r": "0xec0addb75b2cf805d76fb10b23ad9262e02c9947aa35d65a919ff01f6f442625",
  "raw": "0xf8cb17843b9aca008304f0dc947d4567b7257cf869b01a47e8cf0edb3814bdb96380b864f2c298be0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000453414e4700000000000000000000000000000000000000000000000000000000820a26a0ec0addb75b2cf805d76fb10b23ad9262e02c9947aa35d65a919ff01f6f442625a01848b5ace46973bdd44f0222435135967d833128bf8c14b477dd7ac2a87636e5",
  "s": "0x1848b5ace46973bdd44f0222435135967d833128bf8c14b477dd7ac2a87636e5",
  "standardV": "0x1",
  "to": "0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963",
  "transactionIndex": 2,
  "v": "0xa26",
  "value": "0",
  "receipt": {
    "blockHash": "0x7af144284932676713c3504b967e58624e748e6e49fd2dbe664d9886c3916280",
    "blockNumber": 203560,
    "contractAddress": null,
    "cumulativeGasUsed": 3044719,
    "from": "0xf24ff3a9cf04c71dbc94d0b566f7a27b94566cac",
    "gasUsed": 70609,
    "logs": [],
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "status": true,
    "to": "0x7d4567b7257cf869b01a47e8cf0edb3814bdb963",
    "transactionHash": "0xf0640b5877203550332354046e6ed56f9cd881ed6fa4a30b9e39f4be62ae3256",
    "transactionIndex": 2
  }
}
```

# Register non-token on Moonbeam
### Get list of token already registed

```bash
eth contract:call --network http://localhost:9933 bshcore@0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963 "coinNames()"
```

### Register non-token

```bash
eth contract:send --pk <addmin_private_key>  --network http://localhost:9933 bshcore@<address_bsh_core> "register('<token_name>')"
```

### Check transaction result

```bash
eth transaction:get --network http://localhost:9933 <transaction_hash>
```