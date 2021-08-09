# Deployment ICON-Moonbeam testnet

Follow this guide: https://github.com/icon-project/btp/tree/goloop2moonbeam/testnet/goloop2moonbeam

Root folder: ~/testnet

```bash
cd goloop
make

# add to ~/.bashrc
export PATH="$PATH:/home/ubuntu/testnet/goloop/bin"
```

http://gochain:9080
http://moonbeam:9933

relay genesis hash:  0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe
relay chain name:  "Kusama"
para genesis hash:  0x784562cdea6f277a5b773e1eb8eae8655f77895818a3d00d62cd0609684e835a
para chain name:  "Moonbase Development Testnet"
parachain height:0x3e block_hash:0x457cb910733480db51f4c260a7b3ef38230be7abc3db4c2d07daae5342ffcda5

Save configuration to /btpsimple/config/config.moonbeam.json
Save configuration to /btpsimple/config/config.icon.json
All configuration files under: ~/testnet/btp/testnet/goloop2moonbeam/config

## Start / stop

Ctrl-C to stop `make run` command.

```bash
# to start containers
cd testnet/btp/testnet/goloop2moonbeam
docker-compose up -d

# Starting gochain  ... done
# Starting moonbeam ... done
# Starting btp_icon ... done
# Starting btp_moonbeam ... done
```

## Errors

`make run`

```
btp_icon        | D|03:32:53.967529|3Cd0|-|btp|btp.go:188 OnBlockOfDst height:118
btp_moonbeam    | D|03:32:54.606764|b6b5|-|icon|sender.go:483 GetResult: retry 59 with GetResult err:jsonrpc: code: -31003, message: Executing, data: <nil>
btp_moonbeam    | P|03:32:54.607310|b6b5|-|btp|btp.go:447 fail to GetResult GetResultParam:&{0xd329bfec86720c63d9a4a89669e8c9893d97d95bc380ffa3be9c9c783ca1dc0b} err:fail to getresult by pending
btp_moonbeam    | panic: (*logrus.Entry) 0xc006ea0f50
btp_moonbeam    |
btp_moonbeam    | goroutine 12 [running]:
btp_moonbeam    | github.com/sirupsen/logrus.Entry.log(0xc0001a5f80, 0xc0001c6120, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, ...)
btp_moonbeam    | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:259 +0x345
btp_moonbeam    | github.com/sirupsen/logrus.(*Entry).Log(0xc000194070, 0x0, 0xc0002abe70, 0x1, 0x1)
btp_moonbeam    | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:287 +0xf0
btp_moonbeam    | github.com/sirupsen/logrus.(*Entry).Logf(0xc000194070, 0xc000000000, 0xf7f1a3, 0x2b, 0xc006ea8a80, 0x2, 0x2)
btp_moonbeam    | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:333 +0xe5
btp_moonbeam    | github.com/sirupsen/logrus.(*Entry).Panicf(0xc000194070, 0xf7f1a3, 0x2b, 0xc006ea8a80, 0x2, 0x2)
btp_moonbeam    | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:371 +0x65
btp_moonbeam    | github.com/icon-project/btp/btp.(*BTP).updateResult.func1()
btp_moonbeam    | 	/home/ubuntu/testnet/btp/btp/btp.go:447 +0x752
btp_moonbeam    | github.com/gammazero/workerpool.startWorker(0xc005a52b70, 0xc0007fdf80)
btp_moonbeam    | 	/home/ubuntu/work/pkg/mod/github.com/gammazero/workerpool@v1.1.2/workerpool.go:233 +0x27
btp_moonbeam    | created by github.com/gammazero/workerpool.(*WorkerPool).dispatch
btp_moonbeam    | 	/home/ubuntu/work/pkg/mod/github.com/gammazero/workerpool@v1.1.2/workerpool.go:195 +0x2f8
btp_moonbeam exited with code 2
```

```
Gracefully stopping... (press Ctrl+C again to force)
Stopping btp_icon     ... done
Stopping gochain      ...
Stopping moonbeam     ... done

ERROR: for gochain  UnixHTTPConnectionPool(host='localhost', port=None): Read timed out. (read timeout=70)
ERROR: An HTTP request took too long to complete. Retry with --verbose to obtain debug information.
If you encounter this issue regularly because of slow network conditions, consider setting COMPOSE_HTTP_TIMEOUT to a higher value (current value: 60).
Makefile:10: recipe for target 'run' failed
make: *** [run] Error 1
```

Sidecar head block no longer works correctly, always returns 0.
`curl http://54.251.114.18:8080/blocks/head | jq`

## Tests

goloop rpc lastblock --uri http://localhost:9080/api/v3/icon | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getHead"}' http://54.251.114.18:9933/ | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getBlock", "params":["0x5007e097b019a8b5ab3009865900a647357a23746a7158e4ce49b0cc1c2b906b"]}' http://54.251.114.18:9933 | jq

curl http://54.251.114.18:8080/blocks/head | jq
curl http://54.251.114.18:8080/blocks/0x5007e097b019a8b5ab3009865900a647357a23746a7158e4ce49b0cc1c2b906b | jq

SELECT block_hash, block_height, created_time FROM public.icon_blocks
ORDER BY created_time DESC LIMIT 10

SELECT block_hash, block_height, created_time FROM public.moonbeam_blocks
ORDER BY created_time DESC LIMIT 10

curl http://54.251.114.18:8000/v1/btpnetwork | jq

## make transfer_icx

```bash
docker-compose exec btp_icon sh /btpsimple/scripts/transfer_icx.sh
This script demonstrates how to transfer a NativeCoin from ICON to MOONBEAM.

1. Creating Alice account in ICON
hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262 ==> alice.ks.json
Alice's btp address: btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262
Alice's balance: 0 (ICX)
Do you want to deposit 1000.000000000000000000 ICX to Alice ? [Y/n] y

2. Depositing 1000.000000000000000000 ICX to Alice
Error: jsonrpc: code: -31003, message: Executing, data: <nil>

Error: jsonrpc: code: -31003, message: Executing, data: <nil>

# goloop rpc txresult 0xdea2823078a35772825040a2b50a41c0a38ab230e15b795381b12f2c9d842eb1 --uri http://54.251.114.18:9080/api/v3/icon

{ "to": "hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262", "cumulativeStepUsed": "0xbde14", "stepUsed": "0x186a0", "stepPrice": "0x2e90edd00", "eventLogs": [], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status": "0x1", "blockHash": "0x1ed177a6851578fb683f8691b00ba747d72190fbcd6a23d9ab0eeb68c469d59e", "blockHeight": "0x13be", "txIndex": "0x1", "txHash": "0xdea2823078a35772825040a2b50a41c0a38ab230e15b795381b12f2c9d842eb1" }

Alice's balance: 1000.000000000000000000 (ICX)

3. Creating Bob's account in Moonbeam
Bob's btp address: btp://0x501.pra/0x4B0d307675CDae97Fc624E1987B942f4B9483231

4. Transfer 1.000000000000000000 ICX from Alice to Bob
Error: jsonrpc: code: -31003, message: Executing, data: <nil>

# goloop rpc txresult 0xbf6bee0107962f4c3680d94f9bece7c2189a71c0acb2099426af7c1c1bb8089f --uri http://54.251.114.18:9080/api/v3/icon

{ "to": "cx22722ffbc83d57d78e937bb32fa16a84609f6b82", "cumulativeStepUsed": "0x13352e", "stepUsed": "0x74d3a", "stepPrice": "0x2e90edd00", "eventLogs": [ { "scoreAddress": "cx26cdb2d9cf33dee078056532175a696b8a9fcc71", "indexed": [ "Message(str,int,bytes)", "btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46", "0x2" ], "data": [ "0xf8f1b8396274703a2f2f3078332e69636f6e2f637832366364623264396366333364656530373830353635333231373561363936623861396663633731b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e01b86cf86a00b867f865aa687863663361663661303563386631643661386562396635336665353535663466646634333136323632aa307834423064333037363735434461653937466336323445313938374239343266344239343833323331cecd83494358880dbd2fc137a30000" ] }, { "scoreAddress": "cx22722ffbc83d57d78e937bb32fa16a84609f6b82", "indexed": [ "TransferStart(Address,str,int,bytes)", "hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262" ], "data": [ "btp://0x501.pra/0x4B0d307675CDae97Fc624E1987B942f4B9483231", "0x1", "0xd6d583494358880dbd2fc137a30000872386f26fc10000" ] } ], "logsBloom": "0x00200000000000000000100000000020000100000000000000000000000000000000000000002000000000000000000000010000000000000000040000000000000004000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000020000000000000000000020000000400000000000000000000000080001400000000000001000000000000000000000000000000000000000000001000000000000000000000000000004000000000000000000000000000000000000000000000000000000000010800000000000000000", "status": "0x1", "blockHash": "0x1e98522d5e4d16f24e8d8f56a4f2e26037b69fd4c5b1adc1d810d6e968fd3b52", "blockHeight": "0x13c0", "txIndex": "0x1", "txHash": "0xbf6bee0107962f4c3680d94f9bece7c2189a71c0acb2099426af7c1c1bb8089f" }

icon Transaction result: e {
  icon   status: 1,
  icon   to: 'cx26cdb2d9cf33dee078056532175a696b8a9fcc71',
  icon   txHash: '0xd3aa4d152b4e454fed23c248c850e6b82d2a8a0d1b45bc4155d87b25b4bce232',
  icon   txIndex: 0,
  icon   blockHeight: 5060,
  icon   blockHash: '0x4edd7538fc5a41069a7c26544f436651e77c909cc1b8605fb0ab5d8188d82337',
  icon   cumulativeStepUsed: H { s: 1, e: 6, c: [ 2026793 ] },
  icon   stepUsed: H { s: 1, e: 6, c: [ 2026793 ] },
  icon   stepPrice: H { s: 1, e: 10, c: [ 12500000000 ] },
  icon   eventLogs: [
  icon     {
  icon       scoreAddress: 'cx22722ffbc83d57d78e937bb32fa16a84609f6b82',
  icon       indexed: [
  icon         'TransferEnd(Address,int,int,bytes)',
  icon         'hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262'
  icon       ],
  icon       data: [ '0x1', '0x0', '0x' ]
  icon     }
  icon   ],
  icon   logsBloom: '0x00200000000000200000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000001000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000'
  icon } +108ms

5. Checking Bob's balance after 10 seconds...
Result {
  '0': '990000000000000000',
  '1': '0',
  '2': '0',
  _usableBalance: '990000000000000000',
  _lockedBalance: '0',
  _refundableBalance: '0'
}
```

## make transfer_dev

docker-compose exec btp_icon sh /btpsimple/scripts/transfer_dev.sh
This script demonstrates how to transfer a NativeCoin from MOONBEAM to ICON.
1. Skip creating Bob account. Already existed
Bob's btp address: btp://0x501.pra/0x4B0d307675CDae97Fc624E1987B942f4B9483231
Bob's balance: 0 (DEV)
Do you want to deposit 10.000000000000000000 DEV to BOB ? [Y/n] y
2. Depositing 1000000000000000000 DEV for Bob
{
  "blockHash": "0x2a97b1e8b6e25572e6dad48efa989c8897ffa8234e30207ee0e562ac3cb86d02",
  "blockNumber": 4868,
  "contractAddress": null,
  "cumulativeGasUsed": 2875723,
  "from": "0x773539d4ac0e786233d90a233654ccee26a613d9",
  "gasUsed": 21000,
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": true,
  "to": "0x4b0d307675cdae97fc624e1987b942f4b9483231",
  "transactionHash": "0x422aa09cefb022767971d155c219837a3d7ad4cbcb9aeafa721968ab24971de2",
  "transactionIndex": 2
}
Bob's balance: 10 (DEV)
3. Skip creating Alice account. Already existed
Alice's btp address: btp://0x3.icon/hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262
4. Transfering 1.000000000000000000  DEV from Bob to Alice
{
  "blockHash": "0xa0bdb0fdd408916ada2113a8e83c37c50d4bcf485c2acb084723b7fd0504924c",
  "blockNumber": 4869,
  "contractAddress": null,
  "cumulativeGasUsed": 1402611,
  "from": "0x4b0d307675cdae97fc624e1987b942f4b9483231",
  "gasUsed": 527318,
  "logs": [
    {
      "address": "0x5CC307268a1393AB9A764A20DACE848AB8275c46",
      "blockHash": "0xa0bdb0fdd408916ada2113a8e83c37c50d4bcf485c2acb084723b7fd0504924c",
      "blockNumber": 4869,
      "data": "0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f6378323663646232643963663333646565303738303536353332313735613639366238613966636337310000000000000000000000000000000000000000000000000000000000000000000000000000f3f8f1b83a6274703a2f2f30783530312e7072612f307835434333303732363861313339334142394137363441323044414345383438414238323735633436b8396274703a2f2f3078332e69636f6e2f6378323663646232643963663333646565303738303536353332313735613639366238613966636337318a6e6174697665636f696e01b86cf86a00b867f865aa307834423064333037363735434461653937466336323445313938374239343266344239343833323331aa687863663361663661303563386631643661386562396635336665353535663466646634333136323632cecd83444556880dbd2fc137a3000000000000000000000000000000",
      "logIndex": 0,
      "removed": false,
      "topics": [
        "0x37be353f216cf7e33639101fd610c542e6a0c0109173fa1c1d8b04d34edb7c1b"
      ],
      "transactionHash": "0xb783c34779cefa2036aa749b08494662d7f4c1396814723bdea4a915a18a33bb",
      "transactionIndex": 1,
      "transactionLogIndex": "0x0",
      "id": "log_f736ac07"
    },
    {
      "address": "0x9c1da847B31C0973F26b1a2A3d5c04365a867703",
      "blockHash": "0xa0bdb0fdd408916ada2113a8e83c37c50d4bcf485c2acb084723b7fd0504924c",
      "blockNumber": 4869,
      "data": "0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f687863663361663661303563386631643661386562396635336665353535663466646634333136323632000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000dbd2fc137a30000000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000034445560000000000000000000000000000000000000000000000000000000000",
      "logIndex": 1,
      "removed": false,
      "topics": [
        "0x50d22373bb84ed1f9eeb581c913e6d45d918c05f8b1d90f0be168f06a4e6994a",
        "0x0000000000000000000000004b0d307675cdae97fc624e1987b942f4b9483231"
      ],
      "transactionHash": "0xb783c34779cefa2036aa749b08494662d7f4c1396814723bdea4a915a18a33bb",
      "transactionIndex": 1,
      "transactionLogIndex": "0x1",
      "id": "log_ea7a4f0d"
    }
  ],
  "logsBloom": "0x00000002000000000000000000000000000000000200000000000000000000000001000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002040000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000004000000000000000000000000000000000000040000000000200000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000200000200000",
  "status": true,
  "to": "0x7d4567b7257cf869b01a47e8cf0edb3814bdb963",
  "transactionHash": "0xb783c34779cefa2036aa749b08494662d7f4c1396814723bdea4a915a18a33bb",
  "transactionIndex": 1
}
Bob's balance: 8.999472682 (DEV)
5. Checking Alice's balance after 10 seconds...
Alice coin_id: 0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
Alice balance: .990000000000000000 (DEV)

```bash
# 10 DEV to Bob
# http://54.251.114.18/#/explorer/query/0xb03305a5753f20a6769c4cc948acacdc01decb76007770de181c9e419a03b326
moonbeam     {
  moonbeam       method: { pallet: 'ethereum', method: 'transact' },
  moonbeam       signature: null,
  moonbeam       nonce: null,
  moonbeam       args: {
  moonbeam         transaction: {
  moonbeam           nonce: '0',
  moonbeam           gasPrice: '1000000000',
  moonbeam           gasLimit: '6721975',
  moonbeam           action: { call: '0x4b0d307675cdae97fc624e1987b942f4b9483231' },
  moonbeam           value: '10000000000000000000',
  moonbeam           input: '0x',
  moonbeam           signature: {
  moonbeam             v: '2597',
  moonbeam             r: '0xa578128752fb35eab03e4620be268a47db1abbe0cd2901e1167c2b984441834c',
  moonbeam             s: '0x1cb7058600f0624a0b07cf400321d15455fb42ff8116f476103bcb672b90ff2b'
  moonbeam           }
  moonbeam         }
  moonbeam       },
  moonbeam       tip: null,
  moonbeam       hash: '0x89b1c1e43ef0b70868164c96267169ba1e7158590b875c7d1955e6ebe2c71b4e',
  moonbeam       info: {},
  moonbeam       events: [
  moonbeam         {
  moonbeam           method: { pallet: 'system', method: 'NewAccount' },
  moonbeam           data: [ '0x4B0d307675CDae97Fc624E1987B942f4B9483231' ]
  moonbeam         },
  moonbeam         {
  moonbeam           method: { pallet: 'balances', method: 'Endowed' },
  moonbeam           data: [
  moonbeam             '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  moonbeam             '10000000000000000000'
  moonbeam           ]
  moonbeam         },
  moonbeam         {
  moonbeam           method: { pallet: 'balances', method: 'Transfer' },
  moonbeam           data: [
  moonbeam             '0x773539d4Ac0e786233D90A233654ccEE26a613D9',
  moonbeam             '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  moonbeam             '10000000000000000000'
  moonbeam           ]
  moonbeam         },
  moonbeam         {
  moonbeam           method: { pallet: 'ethereum', method: 'Executed' },
  moonbeam           data: [
  moonbeam             '0x773539d4ac0e786233d90a233654ccee26a613d9',
  moonbeam             '0x0000000000000000000000000000000000000000',
  moonbeam             '0x422aa09cefb022767971d155c219837a3d7ad4cbcb9aeafa721968ab24971de2',
  moonbeam             { succeed: 'Stopped' }
  moonbeam           ]
  moonbeam         },
  moonbeam         {
  moonbeam           method: { pallet: 'system', method: 'ExtrinsicSuccess' },
  moonbeam           data: [ { weight: '525000000', class: 'Normal', paysFee: 'Yes' } ]
  moonbeam         }
  moonbeam       ],
  moonbeam       success: true,
  moonbeam       paysFee: false
  moonbeam     }
  moonbeam   ],
  moonbeam   onFinalize: { events: [] },
  moonbeam   finalized: false
  moonbeam } +1s
  ```

```bash
# 1 DEV from Bob to Alice
# http://54.251.114.18/#/explorer/query/0xa5cfb4c259b70db591e8130df30cd3e2eb2af40c0e94d75152ab2b2d70d46f62
moonbeam Transaction: {
  moonbeam   method: { pallet: 'ethereum', method: 'transact' },
  moonbeam   signature: null,
  moonbeam   nonce: null,
  moonbeam   args: {
  moonbeam     transaction: {
  moonbeam       nonce: '0',
  moonbeam       gasPrice: '1000000000',
  moonbeam       gasLimit: '6721975',
  moonbeam       action: { call: '0x7d4567b7257cf869b01a47e8cf0edb3814bdb963' }, # BSH core address
  moonbeam       value: '1000000000000000000',
  moonbeam       input: '0x74e518c5000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f68786366336166366130356338663164366138656239663533666535353566346664663433313632363200000000000000',
  moonbeam       signature: {
  moonbeam         v: '2597',
  moonbeam         r: '0x1368123c44bbae659ec1e783b326ddfa68b4259f406eaea6b4a17c3f1a5f7006',
  moonbeam         s: '0x4af12af11ede3e9e391155203f05b7d0c0ec41750da0b05ca83eb9902b9786ac'
  moonbeam       }
  moonbeam     }
  moonbeam   },
  moonbeam   tip: null,
  moonbeam   hash: '0x0136d79bb9505417ac972f5538cda0cec5c143152480796a50f60ef7ff2104a3',
  moonbeam   info: {},
  moonbeam   events: [
  moonbeam     {
  moonbeam       method: { pallet: 'system', method: 'NewAccount' },
  moonbeam       data: [ '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963' ]
  moonbeam     },
  moonbeam     {
  moonbeam       method: { pallet: 'balances', method: 'Endowed' },
  moonbeam       data: [
  moonbeam         '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  moonbeam         '1000000000000000000'
  moonbeam       ]
  moonbeam     },
  moonbeam     {
  moonbeam       method: { pallet: 'balances', method: 'Transfer' },
  moonbeam       data: [
  moonbeam         '0x4B0d307675CDae97Fc624E1987B942f4B9483231',
  moonbeam         '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963',
  moonbeam         '1000000000000000000'
  moonbeam       ]
  moonbeam     },
  moonbeam     {
  moonbeam       method: { pallet: 'evm', method: 'Log' }, # UnknownResponse
  moonbeam       data: [
  moonbeam         {
  moonbeam           address: '0x5cc307268a1393ab9a764a20dace848ab8275c46',
  moonbeam           topics: [
  moonbeam             '0x37be353f216cf7e33639101fd610c542e6a0c0109173fa1c1d8b04d34edb7c1b'
  moonbeam           ],
  moonbeam           data: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f6378323663646232643963663333646565303738303536353332313735613639366238613966636337310000000000000000000000000000000000000000000000000000000000000000000000000000f3f8f1b83a6274703a2f2f30783530312e7072612f307835434333303732363861313339334142394137363441323044414345383438414238323735633436b8396274703a2f2f3078332e69636f6e2f6378323663646232643963663333646565303738303536353332313735613639366238613966636337318a6e6174697665636f696e01b86cf86a00b867f865aa307834423064333037363735434461653937466336323445313938374239343266344239343833323331aa687863663361663661303563386631643661386562396635336665353535663466646634333136323632cecd83444556880dbd2fc137a3000000000000000000000000000000'
  moonbeam         }
  moonbeam       ]
  moonbeam     },
  moonbeam     {
  moonbeam       method: { pallet: 'evm', method: 'Log' },
  moonbeam       data: [
  moonbeam         {
  moonbeam           address: '0x9c1da847b31c0973f26b1a2a3d5c04365a867703',
  moonbeam           topics: [
    0x50d22373bb84ed1f9eeb581c913e6d45d918c05f8b1d90f0be168f06a4e6994a
  moonbeam             '0x50d22373bb84ed1f9eeb581c913e6d45d918c05f8b1d90f0be168f06a4e6994a',
  moonbeam             '0x0000000000000000000000004b0d307675cdae97fc624e1987b942f4b9483231'
  0x9b4c002cf17443998e01f132ae99b7392665eec5422a33a1d2dc47308c59b6e2
  moonbeam           ],
  moonbeam           data: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000396274703a2f2f3078332e69636f6e2f687863663361663661303563386631643661386562396635336665353535663466646634333136323632000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000dbd2fc137a30000000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000034445560000000000000000000000000000000000000000000000000000000000'
  moonbeam         }
  moonbeam       ]
  moonbeam     },
  moonbeam     {
  moonbeam       method: { pallet: 'ethereum', method: 'Executed' },
  moonbeam       data: [
  moonbeam         '0x4b0d307675cdae97fc624e1987b942f4b9483231',
  moonbeam         '0x0000000000000000000000000000000000000000',
  moonbeam         '0xb783c34779cefa2036aa749b08494662d7f4c1396814723bdea4a915a18a33bb',
  moonbeam         { succeed: 'Returned' }
  moonbeam       ]
  moonbeam     },
  moonbeam     {
  moonbeam       method: { pallet: 'system', method: 'ExtrinsicSuccess' },
  moonbeam       data: [ { weight: '13182950000', class: 'Normal', paysFee: 'Yes' } ]
  moonbeam     }
  moonbeam   ],
  moonbeam   success: true,
  moonbeam   paysFee: false
  moonbeam } +1ms
  ```

Get contract ABI:

$ docker exec -it goloop2moonbeam_btp_moonbeam bash
bash-5.0# cd ../contracts/solidity/bmc/build/contracts
bash-5.0# ls
bash-5.0# cat BMCPeriphery.json | jq -r .abi
bash-5.0# cd ../../../bsh/build/contracts
bash-5.0# cat BSHPeriphery.json | jq -r .abi

# Polkadot portal

docker run -it --name polkadot-ui -e WS_URL=ws://54.251.114.18:9944 -p 80:80 jacogr/polkadot-js-apps:latest
