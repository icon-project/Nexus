```json
{
  "to": "cx22722ffbc83d57d78e937bb32fa16a84609f6b82", // nativeCoinBsh.icon
  "cumulativeStepUsed": "0x13352e",
  "stepUsed": "0x74d3a",
  "stepPrice": "0x2e90edd00",
  "eventLogs": [
    {
      "scoreAddress": "cx26cdb2d9cf33dee078056532175a696b8a9fcc71",
      "indexed": [
        "Message(str,int,bytes)",
        "btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46",
        "0x2"
      ],
      "data": [
        "0xf8f1b8396274703a2f2f3078332e69636f6e2f637832366364623264396366333364656530373830353635333231373561363936623861396663633731b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e01b86cf86a00b867f865aa687863663361663661303563386631643661386562396635336665353535663466646634333136323632aa307834423064333037363735434461653937466336323445313938374239343266344239343833323331cecd83494358880dbd2fc137a30000"
      ]
    },
    {
      "scoreAddress": "cx22722ffbc83d57d78e937bb32fa16a84609f6b82",
      "indexed": [
        "TransferStart(Address,str,int,bytes)",
        "hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262"
      ],
      "data": [
        "btp://0x501.pra/0x4B0d307675CDae97Fc624E1987B942f4B9483231",
        "0x1",
        "0xd6d583494358880dbd2fc137a30000872386f26fc10000"
      ]
    }
  ],
  "logsBloom": "0x00200000000000000000100000000020000...",
  "status": "0x1",
  "blockHash": "0x1e98522d5e4d16f24e8d8f56a4f2e26037b69fd4c5b1adc1d810d6e968fd3b52",
  "blockHeight": "0x13c0",
  "txIndex": "0x1",
  "txHash": "0xbf6bee0107962f4c3680d94f9bece7c2189a71c0acb2099426af7c1c1bb8089f"
}

{
  "to": "cx26cdb2d9cf33dee078056532175a696b8a9fcc71",
  "cumulativeStepUsed": "0x1eed29",
  "stepUsed": "0x1eed29",
  "stepPrice": "0x2e90edd00",
  "eventLogs": [
    {
      "scoreAddress": "cx22722ffbc83d57d78e937bb32fa16a84609f6b82",
      "indexed": [
        "TransferEnd(Address,int,int,bytes)",
        "hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262"
      ],
      "data": [
        "0x1",
        "0x0",
        "0x"
      ]
    }
  ],
  "logsBloom": "0x002000000000002000000000000000200000000000...",
  "status": "0x1",
  "blockHash": "0x4edd7538fc5a41069a7c26544f436651e77c909cc1b8605fb0ab5d8188d82337",
  "blockHeight": "0x13c4",
  "txIndex": "0x0",
  "txHash": "0xd3aa4d152b4e454fed23c248c850e6b82d2a8a0d1b45bc4155d87b25b4bce232"
}

Fail transfer end.

```json
icon Transaction result: e {
  icon   status: 1,
  icon   to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  icon   txHash: '0x9da96a081cf069f257cd9df47f1f596cc1aa9a4bac865d2c6afeae56ff29a5a6',
  icon   txIndex: 0,
  icon   blockHeight: 534000,
  icon   blockHash: '0x8e558451cdd66fd62850a4f92bf4fb058c4021b658190103cea1edafb880bfe0',
  icon   cumulativeStepUsed: H { s: 1, e: 6, c: [ 1914815 ] },
  icon   stepUsed: H { s: 1, e: 6, c: [ 1914815 ] },
  icon   stepPrice: H { s: 1, e: 10, c: [ 12500000000 ] },
  icon   eventLogs: [
  icon     {
  icon       scoreAddress: 'cx22722ffbc83d57d78e937bb32fa16a84609f6b82',
  icon       indexed: [
  icon         'TransferEnd(Address,int,int,bytes)',
  icon         'hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262'
  icon       ],
  icon       data: [ '0x5b', '0x1', '0x496e76616c696441646472657373' ]
  icon     }
  icon   ],
  icon   logsBloom: '0x00200000000000200000000000000020000000000000...'
  icon }
```
