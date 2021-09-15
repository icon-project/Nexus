## Result

```bash
docker image ls

REPOSITORY                     TAG            IMAGE ID       CREATED          SIZE
goloop2moonbeam_btp_icon       latest         66639b200905   3 minutes ago    447MB
goloop2moonbeam_btp_moonbeam   latest         66639b200905   3 minutes ago    447MB
goloop2moonbeam_moonbeam       latest         b4f78cb5ce71   4 minutes ago    711MB
goloop2moonbeam_goloop         latest         a9001c3b0603   5 minutes ago    519MB
btpsimple                      latest         75dfcfd8a582   10 minutes ago   42.7MB
debian                         buster-slim    105744913aa9   11 days ago      69.3MB
alpine                         3.12           48b8ec4ed9eb   13 days ago      5.58MB
canhlinh/truffle               5.3.0-alpine   6682e28e868b   6 weeks ago      470MB
purestake/moonbeam             v0.9.6         4cb093083486   7 weeks ago      669MB
iconloop/goloop-icon           v0.9.9         75eeefc55cba   2 months ago     516MB

docker container ls -a

CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS                      PORTS                                                                                                             NAMES
9671cb97b832   goloop2moonbeam_btp_moonbeam     "/entrypoint.sh"         21 minutes ago   Exited (2) 10 minutes ago                                                                                                                     g2m_btp_moonbeam
13c708b423af   goloop2moonbeam_btp_icon         "/entrypoint.sh"         22 minutes ago   Up 22 minutes (healthy)                                                                                                                       g2m_btp_icon
b5944f347994   goloop2moonbeam_goloop           "/entrypoint /bin/sh…"   22 minutes ago   Up 22 minutes (healthy)     8080/tcp, 0.0.0.0:9080->9080/tcp, :::9080->9080/tcp                                                               g2m_goloop
2eb160fb298a   goloop2moonbeam_moonbeam         "/moonbeam/moonbeam …"   22 minutes ago   Up 22 minutes (healthy)     0.0.0.0:9933->9933/tcp, :::9933->9933/tcp, 9615/tcp, 30333-30334/tcp, 0.0.0.0:9944->9944/tcp, :::9944->9944/tcp   g2m_moonbeam
```

## Tests

~/testnet/btp/docker-compose/goloop2moonbeam
docker-compose up -d

```bash
make transfer_icx

docker-compose exec btp_icon sh /btpsimple/scripts/transfer_icx.sh
This script demonstrates how to transfer a NativeCoin from ICON to MOONBEAM.
1. Skip creating Alice account. Already existed
Alice's btp address: btp://0x58eb1c.icon/hx548a976f8eda5d7c0afcb99110ca49434cdf921b
Alice's balance: 0 (ICX)
Do you want to deposit 1000.000000000000000000 ICX to Alice ? [Y/n] y
2. Depositing 1000.000000000000000000 ICX to Alice
{ "to": "hx548a976f8eda5d7c0afcb99110ca49434cdf921b", "cumulativeStepUsed": "0xbea52", "stepUsed": "0x186a0", "stepPrice": "0x2e90edd00", "eventLogs": [], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status": "0x1", "blockHash": "0xb6259866785452f91e1edb65e9fbe4bb6b158fbedcbcbd0c13f92f21fa9e3bfd", "blockHeight": "0x232", "txIndex": "0x1", "txHash": "0x6184b03decb27e9e99a443c01cd5adba777cbae6ed27ba1ed7d4ee9fde251106" }
Alice's balance: 1000.000000000000000000 (ICX)
3. Creating Bob's account in Moonbeam
Bob's btp address: btp://0x501.pra/0xDC70A1b79415034Ba08fa235b09f6b3f75c1e1d4
4. Bob's balance before transfering: 0 (ICX)
5. Transfer 10.000000000000000000 ICX from Alice to Bob
{ "to": "cx489ed02580ce5cab57925317373310205417c2b7", "cumulativeStepUsed": "0x751b4", "stepUsed": "0x751b4", "stepPrice": "0x2e90edd00", "eventLogs": [ { "scoreAddress": "cx362bec5623356a90f607d4e693b5d9a898a0dc6f", "indexed": [ "Message(str,int,bytes)", "btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46", "0x2" ], "data": [ "0xf8f7b83e6274703a2f2f30783538656231632e69636f6e2f637833363262656335363233333536613930663630376434653639336235643961383938613064633666b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e01b86df86b00b868f866aa687835343861393736663865646135643763306166636239393131306361343934333463646639323162aa307844433730413162373934313530333442613038666132333562303966366233663735633165316434cfce8349435889008963dd8c2c5e0000" ] }, { "scoreAddress": "cx489ed02580ce5cab57925317373310205417c2b7", "indexed": [ "TransferStart(Address,str,int,bytes)", "hx548a976f8eda5d7c0afcb99110ca49434cdf921b" ], "data": [ "btp://0x501.pra/0xDC70A1b79415034Ba08fa235b09f6b3f75c1e1d4", "0x1", "0xd8d78349435889008963dd8c2c5e000088016345785d8a0000" ] } ], "logsBloom": "0x00000000000000000000100000000000000100000000800000000000000000000100000000002000000000000000000000010000000004000000000000000000000004000000000000000000000000000000200000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000080000000000000000020000000000000000000020000000400000000000000000040000040000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000004000000000000000000000000000000000000000000008000000000000000800000000000000200", "status": "0x1", "blockHash": "0x208c62a3474a15a70767cad8e261b7b053a0205ae4c27cd09cbbc57cde975505", "blockHeight": "0x236", "txIndex": "0x0", "txHash": "0x856509dc41dab3289be74348a4a0601639f165b26cd80f90bf184524826113e3" }
6. Checking Bob's balance after transfering with 60s timeout
[▓▓] done!
Bob's balance after transfering: 9.900000000000000000 (ICX)
```

```bash
make transfer_dev

docker-compose exec btp_icon sh /btpsimple/scripts/transfer_dev.sh
This script demonstrates how to transfer a NativeCoin from MOONBEAM to ICON.
1. Skip creating Bob account. Already existed
Bob's btp address: btp://0x501.pra/0xDC70A1b79415034Ba08fa235b09f6b3f75c1e1d4
Bob's balance: 0 (DEV)
Do you want to deposit 10.000000000000000000 DEV to BOB ? [Y/n] y
2. Depositing 10.000000000000000000 DEV for Bob
{
  "blockHash": "0x1c0fea4864158246a2c0e35f9ddd448f9a621abb0697f2b9332a5fd2c383149c",
  "blockNumber": 688,
  "contractAddress": null,
  "cumulativeGasUsed": 2948143,
  "from": "0x773539d4ac0e786233d90a233654ccee26a613d9",
  "gasUsed": 21000,
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": true,
  "to": "0xdc70a1b79415034ba08fa235b09f6b3f75c1e1d4",
  "transactionHash": "0xc8bddd1ddb0f8aa84fe75db383b52eda876c0da6ef4e2c52f5be609957068de6",
  "transactionIndex": 2
}
Bob's balance: 10 (DEV)
3. Skip creating Alice account. Already existed
Alice's btp address: btp://0x58eb1c.icon/hx548a976f8eda5d7c0afcb99110ca49434cdf921b
4. Transfering 1.000000000000000000  DEV from Bob to Alice
{
  "blockHash": "0xb9eb3e8d0923550b6a9a1057434c2ad8f1029d3f0c6fd9c9498947bb444f8248",
  "blockNumber": 689,
  "contractAddress": null,
  "cumulativeGasUsed": 1309031,
  "from": "0xdc70a1b79415034ba08fa235b09f6b3f75c1e1d4",
  "gasUsed": 531508,
  "logs": [
    {
      "address": "0x5CC307268a1393AB9A764A20DACE848AB8275c46",
      "blockHash": "0xb9eb3e8d0923550b6a9a1057434c2ad8f1029d3f0c6fd9c9498947bb444f8248",
      "blockNumber": 689,
      "data": "0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f637833363262656335363233333536613930663630376434653639336235643961383938613064633666000000000000000000000000000000000000000000000000000000000000000000f8f8f6b83a6274703a2f2f30783530312e7072612f307835434333303732363861313339334142394137363441323044414345383438414238323735633436b83e6274703a2f2f30783538656231632e69636f6e2f6378333632626563353632333335366139306636303764346536393362356439613839386130646336668a6e6174697665636f696e01b86cf86a00b867f865aa307844433730413162373934313530333442613038666132333562303966366233663735633165316434aa687835343861393736663865646135643763306166636239393131306361343934333463646639323162cecd83444556880dbd2fc137a23cb00000000000000000",
      "logIndex": 0,
      "removed": false,
      "topics": [
        "0x37be353f216cf7e33639101fd610c542e6a0c0109173fa1c1d8b04d34edb7c1b"
      ],
      "transactionHash": "0x44f4c66c37ff86443e93d23cdd8a615182e87ff483b5c9c8980d6f75911183d6",
      "transactionIndex": 1,
      "transactionLogIndex": "0x0",
      "id": "log_8278f8d0"
    },
    {
      "address": "0x9c1da847B31C0973F26b1a2A3d5c04365a867703",
      "blockHash": "0xb9eb3e8d0923550b6a9a1057434c2ad8f1029d3f0c6fd9c9498947bb444f8248",
      "blockNumber": 689,
      "data": "0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f68783534386139373666386564613564376330616663623939313130636134393433346364663932316200000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000dbd2fc137a23cb0000000000000000000000000000000000000000000000000002386f26fc1c35000000000000000000000000000000000000000000000000000000000000000034445560000000000000000000000000000000000000000000000000000000000",
      "logIndex": 1,
      "removed": false,
      "topics": [
        "0x50d22373bb84ed1f9eeb581c913e6d45d918c05f8b1d90f0be168f06a4e6994a",
        "0x000000000000000000000000dc70a1b79415034ba08fa235b09f6b3f75c1e1d4"
      ],
      "transactionHash": "0x44f4c66c37ff86443e93d23cdd8a615182e87ff483b5c9c8980d6f75911183d6",
      "transactionIndex": 1,
      "transactionLogIndex": "0x1",
      "id": "log_4a3532df"
    }
  ],
  "logsBloom": "0x00000002000000000000000008000000000000000200000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000004000000000000000000000000000000000000040000000000200000000000000000000000000000000100000000000100000000000000000200000000000000000000000000000000000000000000000000000000200000",
  "status": true,
  "to": "0x7d4567b7257cf869b01a47e8cf0edb3814bdb963",
  "transactionHash": "0x44f4c66c37ff86443e93d23cdd8a615182e87ff483b5c9c8980d6f75911183d6",
  "transactionIndex": 1
}
Bob's balance: 8.999468492 (DEV)
5. Checking Alice's balance after 10 seconds...
Alice coin_id: 0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
Alice balance: .989999999999950000 (DEV)
```

## Accounts

```bash
# Tien
goloop ks gen -o tiendq.ks.json -p test12345
# hx0a349be9845c75f8c8945451e212b86110b36e2c

# deposite Tien 100K ICX
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon \
--to hx0a349be9845c75f8c8945451e212b86110b36e2c --value 0xd3c21bcecceda1000000 \
--key_store ./config/goloop.keystore.json --key_password gochain --step_limit 10000000000 --nid 0x58eb1c

goloop rpc txresult 0x7de58745bdee55e487784de9f23d311cf628808bc5955c124d1e9af7a6c196fc --uri http://localhost:9080/api/v3/icon

# deposite Alice 100K ICX
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon \
--to hx548a976f8eda5d7c0afcb99110ca49434cdf921b --value 0xd3c21bcecceda1000000 \
--key_store ./config/goloop.keystore.json --key_password gochain --step_limit 10000000000 --nid 0x58eb1c

goloop rpc balance hx0a349be9845c75f8c8945451e212b86110b36e2c --uri http://localhost:9080/api/v3/icon | jq -r
goloop rpc balance hx548a976f8eda5d7c0afcb99110ca49434cdf921b --uri http://localhost:9080/api/v3/icon | jq -r
```

## Configuration

Update tables: indexer_stats, networks
Removed fkey: token_info, burned_tokens, minted_tokens

## Issues

It makes `g2m_btp_moonbeam` stops.

```bash
g2m_btp_moonbeam | D|04:12:54.536999|b6b5|-|btp|btp.go:235 canRelay rms:2 has_wait:true skippable:true relayable:false
g2m_btp_moonbeam | P|04:12:56.915627|b6b5|-|btp|btp.go:447 fail to GetResult GetResultParam:&{0x58f5a99b7fb079ac16c36c68c04d4ac0091d1566ad4021d05832e7699829c7c7} err:fail to getresult by pending
g2m_btp_moonbeam | panic: (*logrus.Entry) 0xc0001a5dc0
g2m_btp_moonbeam |
g2m_btp_moonbeam | goroutine 158 [running]:
g2m_btp_moonbeam | github.com/sirupsen/logrus.Entry.log(0xc0001a5f80, 0xc000121140, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, ...)
g2m_btp_moonbeam | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:259 +0x345
g2m_btp_moonbeam | github.com/sirupsen/logrus.(*Entry).Log(0xc000196070, 0x0, 0xc004ae3e70, 0x1, 0x1)
g2m_btp_moonbeam | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:287 +0xf0
g2m_btp_moonbeam | github.com/sirupsen/logrus.(*Entry).Logf(0xc000196070, 0xc000000000, 0xf9f12d, 0x2b, 0xc000aec6e0, 0x2, 0x2)
g2m_btp_moonbeam | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:333 +0xe5
g2m_btp_moonbeam | github.com/sirupsen/logrus.(*Entry).Panicf(0xc000196070, 0xf9f12d, 0x2b, 0xc000aec6e0, 0x2, 0x2)
g2m_btp_moonbeam | 	/home/ubuntu/work/pkg/mod/github.com/sirupsen/logrus@v1.6.0/entry.go:371 +0x65
g2m_btp_moonbeam | github.com/icon-project/btp/btp.(*BTP).updateResult.func1()
g2m_btp_moonbeam | 	/home/ubuntu/testnet/btp/btp/btp.go:447 +0x752
g2m_btp_moonbeam | github.com/gammazero/workerpool.startWorker(0xc005576930, 0xc0009e61e0)
g2m_btp_moonbeam | 	/home/ubuntu/work/pkg/mod/github.com/gammazero/workerpool@v1.1.2/workerpool.go:233 +0x27
g2m_btp_moonbeam | created by github.com/gammazero/workerpool.(*WorkerPool).dispatch
g2m_btp_moonbeam | 	/home/ubuntu/work/pkg/mod/github.com/gammazero/workerpool@v1.1.2/workerpool.go:195 +0x2f8
g2m_btp_icon    | D|04:12:57.028309|3Cd0|-|btp|btp.go:188 OnBlockOfDst height:235
g2m_btp_moonbeam exited with code 2
```
