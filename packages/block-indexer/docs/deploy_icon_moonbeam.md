## Deploy

Get container logs:

```bash
docker logs -f g2m_btp_moonbeam &> g2m_btp_moonbeam.log &
docker logs -f g2m_btp_icon &> g2m_btp_icon.log &
scp ssh ubuntu@54.251.114.18:temp/g2m_btp_moonbeam.log ~/Public
scp ssh ubuntu@54.251.114.18:temp/g2m_btp_icon.log ~/Public
```

Get Solidity contracts ABI:

```bash
$ docker exec -it g2m_btp_moonbeam bash
bash-5.0# cd ../contracts/solidity/bmc/build/contracts
bash-5.0# cat BMCPeriphery.json | jq -r .abi
bash-5.0# cd ../../../bsh/build/contracts
bash-5.0# cat BSHPeriphery.json | jq -r .abi
```

### Configuration

- Update tables: indexer_stats, networks, token_info
- Update contract ABIs
- Build

## Test

### make transfer_icx

```bash
docker-compose exec btp_icon sh /btpsimple/scripts/transfer_icx.sh
This script demonstrates how to transfer a NativeCoin from ICON to MOONBEAM.
1. Creating Alice account in ICON
hxabd35ed2c5f4c206ceae0a695e794b118b0a2708 ==> alice.ks.json
Alice's btp address: btp://0x58eb1c.icon/hxabd35ed2c5f4c206ceae0a695e794b118b0a2708
Alice's balance: 0 (ICX)
Do you want to deposit 1000.000000000000000000 ICX to Alice ? [Y/n] y
2. Depositing 1000.000000000000000000 ICX to Alice
{ "to": "hxabd35ed2c5f4c206ceae0a695e794b118b0a2708", "cumulativeStepUsed": "0x186a0", "stepUsed": "0x186a0", "stepPrice": "0x2e90edd00", "eventLogs": [], "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "status": "0x1", "blockHash": "0x123741645dcd205ee25b0bf6835cc0adb5188fdfe8363c9bb6f9c19a5d27d706", "blockHeight": "0x1b5", "txIndex": "0x0", "txHash": "0x4c9c340ce892de8cba43fc66d13ccd6b74f838df4e019ecfcdfc1d76e2a2c1eb" }
Alice's balance: 1000.000000000000000000 (ICX)
3. Creating Bob's account in Moonbeam
Bob's btp address: btp://0x501.pra/0x1245FC5A0932535c1E3d89C7c136200FCa36742B
4. Bob's balance before transfering: 0 (ICX)
5. Transfer 10.000000000000000000 ICX from Alice to Bob
{ "to": "cx2c8b604078c7820502b9f33c4702d92fbb71ce9a", "cumulativeStepUsed": "0x75264", "stepUsed": "0x75264", "stepPrice": "0x2e90edd00", "eventLogs": [ { "scoreAddress": "cx4e52d353dabf31fc3b43f1d0e685ab41addb84dd", "indexed": [ "Message(str,int,bytes)", "btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46", "0x2" ], "data": [ "0xf8f7b83e6274703a2f2f30783538656231632e69636f6e2f637834653532643335336461626633316663336234336631643065363835616234316164646238346464b83a6274703a2f2f30783530312e7072612f3078354343333037323638613133393341423941373634413230444143453834384142383237356334368a6e6174697665636f696e01b86df86b00b868f866aa687861626433356564326335663463323036636561653061363935653739346231313862306132373038aa307831323435464335413039333235333563314533643839433763313336323030464361333637343242cfce8349435889008963dd8c2c5e0000" ] }, { "scoreAddress": "cx2c8b604078c7820502b9f33c4702d92fbb71ce9a", "indexed": [ "TransferStart(Address,str,int,bytes)", "hxabd35ed2c5f4c206ceae0a695e794b118b0a2708" ], "data": [ "btp://0x501.pra/0x1245FC5A0932535c1E3d89C7c136200FCa36742B", "0x1", "0xd8d78349435889008963dd8c2c5e000088016345785d8a0000" ] } ], "logsBloom": "0x00000000040000000000100000000000000100000000000000000000000000000000000000002000000000100000040000010000000000800000000000000000000004000020000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000020000000000000000000020000000400000000001000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000004000000000000000000080000000000000000000000000000000000000000810000000000000000", "status": "0x1", "blockHash": "0xef4a640f847f46da790cbd0bf08f6fa76719e1327ed7c61f389ae1b7a77cfe80", "blockHeight": "0x1bc", "txIndex": "0x0", "txHash": "0xa886e980a70f490cf6ccab3e3015a019d847acb4b3311283df27e65602ef114a" }
6. Checking Bob's balance after transfering with 60s timeout
[▓▓▓▓▓▓▓▓] done!
Bob's balance after transfering: 9.900000000000000000 (ICX)
```

### make transfer_dev

```bash
docker-compose exec btp_icon sh /btpsimple/scripts/transfer_dev.sh
This script demonstrates how to transfer a NativeCoin from MOONBEAM to ICON.
1. Skip creating Bob account. Already existed
Bob's btp address: btp://0x501.pra/0x1245FC5A0932535c1E3d89C7c136200FCa36742B
Bob's balance: 0 (DEV)
Do you want to deposit 10.000000000000000000 DEV to BOB ? [Y/n] y
2. Depositing 10.000000000000000000 DEV for Bob
{
  "blockHash": "0x6419f1ef58bb03f94b963af58af785417e451689ce05ecb2ad79359d6b9c54d7",
  "blockNumber": 219,
  "contractAddress": null,
  "cumulativeGasUsed": 1768477,
  "from": "0x773539d4ac0e786233d90a233654ccee26a613d9",
  "gasUsed": 21000,
  "logs": [],
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "status": true,
  "to": "0x1245fc5a0932535c1e3d89c7c136200fca36742b",
  "transactionHash": "0x47e9c8cfe1ca5219c0a4b2fe1fcd542a636e24bf7082d8a364eb4394c3b2ceaa",
  "transactionIndex": 1
}
Bob's balance: 10 (DEV)
3. Skip creating Alice account. Already existed
Alice's btp address: btp://0x58eb1c.icon/hxabd35ed2c5f4c206ceae0a695e794b118b0a2708
4. Transfering 1.000000000000000000  DEV from Bob to Alice
{
  "blockHash": "0x2c9af97ffc9824862d553073c26da913f89e7f89f0fdcafe7c740b5578fdf3f0",
  "blockNumber": 221,
  "contractAddress": null,
  "cumulativeGasUsed": 1309526,
  "from": "0x1245fc5a0932535c1e3d89c7c136200fca36742b",
  "gasUsed": 531444,
  "logs": [
    {
      "address": "0x5CC307268a1393AB9A764A20DACE848AB8275c46",
      "blockHash": "0x2c9af97ffc9824862d553073c26da913f89e7f89f0fdcafe7c740b5578fdf3f0",
      "blockNumber": 221,
      "data": "0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f637834653532643335336461626633316663336234336631643065363835616234316164646238346464000000000000000000000000000000000000000000000000000000000000000000f8f8f6b83a6274703a2f2f30783530312e7072612f307835434333303732363861313339334142394137363441323044414345383438414238323735633436b83e6274703a2f2f30783538656231632e69636f6e2f6378346535326433353364616266333166633362343366316430653638356162343161646462383464648a6e6174697665636f696e01b86cf86a00b867f865aa307831323435464335413039333235333563314533643839433763313336323030464361333637343242aa687861626433356564326335663463323036636561653061363935653739346231313862306132373038cecd83444556880dbd2fc137a23cb00000000000000000",
      "logIndex": 0,
      "removed": false,
      "topics": [
        "0x37be353f216cf7e33639101fd610c542e6a0c0109173fa1c1d8b04d34edb7c1b"
      ],
      "transactionHash": "0x2a368efd87c1faa7a5ef5c0575102f7f398e3c96a874c373f9fb31340a3237d6",
      "transactionIndex": 1,
      "transactionLogIndex": "0x0",
      "id": "log_7bd5c905"
    },
    {
      "address": "0x9c1da847B31C0973F26b1a2A3d5c04365a867703",
      "blockHash": "0x2c9af97ffc9824862d553073c26da913f89e7f89f0fdcafe7c740b5578fdf3f0",
      "blockNumber": 221,
      "data": "0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30783538656231632e69636f6e2f68786162643335656432633566346332303663656165306136393565373934623131386230613237303800000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000dbd2fc137a23cb0000000000000000000000000000000000000000000000000002386f26fc1c35000000000000000000000000000000000000000000000000000000000000000034445560000000000000000000000000000000000000000000000000000000000",
      "logIndex": 1,
      "removed": false,
      "topics": [
        "0x50d22373bb84ed1f9eeb581c913e6d45d918c05f8b1d90f0be168f06a4e6994a",
        "0x0000000000000000000000001245fc5a0932535c1e3d89c7c136200fca36742b"
      ],
      "transactionHash": "0x2a368efd87c1faa7a5ef5c0575102f7f398e3c96a874c373f9fb31340a3237d6",
      "transactionIndex": 1,
      "transactionLogIndex": "0x1",
      "id": "log_af7be96b"
    }
  ],
  "logsBloom": "0x00000002000000000000000000000000000000000200000000000000000000000001000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000110000000000000000000000000000004000000000000000000000000000000000000040000100000200000000000000000000000000000000000000000000000000000000000000200800000000000000000000000000000000000000000000000000000200000",
  "status": true,
  "to": "0x7d4567b7257cf869b01a47e8cf0edb3814bdb963",
  "transactionHash": "0x2a368efd87c1faa7a5ef5c0575102f7f398e3c96a874c373f9fb31340a3237d6",
  "transactionIndex": 1
}
Bob's balance: 8.999468556 (DEV)
5. Checking Alice's balance after 10 seconds...
Alice coin_id: 0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
Alice balance: .989999999999950000 (DEV)
```

### Checks

```bash
# Alice ICX
goloop rpc balance hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab --uri http://localhost:9080/api/v3/icon | jq -r
# 9899.89467937500000000

# Alice DEV
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method coinId --param _coinName=DEV

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/irc31token.icon) --method balanceOf --param _owner=hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab --param _id=0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
# 10.889999999999900000

# it doesn't work, responses 0
# goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method balanceOf --param _owner=hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab --param _coinName=DEV

# Bob DEV
eth address:balance --network http://localhost:9933 0xF8aC273f62F2D1D7283be823400e05Aeddc389F5
# 1008.999468423

# Bob ICX
eth abi:add bshcore ./config/abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "getBalanceOf('0xF8aC273f62F2D1D7283be823400e05Aeddc389F5', 'ICX')"
# 9.900000000000000000
```

## Test accounts

### Alice to Bob

```bash
# Alice sends 1 ICX to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0xF8aC273f62F2D1D7283be823400e05Aeddc389F5 --value 1000000000000000000 \
  --key_store config/alice.ks.json --key_password $(cat ./config/alice.secret) --step_limit 10000000000 --nid 0x58eb1c

# setApprovalForAll
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/irc31token.icon) --method isApprovedForAll --param _owner=hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab --param _operator=$(cat ./config/nativeCoinBsh.icon)

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/irc31token.icon) --method setApprovalForAll \
  --param _operator=$(cat ./config/nativeCoinBsh.icon) --param _approved=0x1 \
  --key_store config/alice.ks.json --key_password $(cat ./config/alice.secret) --step_limit 10000000000 --nid 0x58eb1c

goloop rpc txresult 0x69b5cc4d7c37ecbe4fcd42a4aa3fbc53a34eef977d4f4bad03b53e4f787bbccb --uri http://localhost:9080/api/v3/icon

# Alice sends 0.1 DEV to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transfer \
  --param _to=btp://0x501.pra/0xF8aC273f62F2D1D7283be823400e05Aeddc389F5 --param _value=100000000000000000 \
  --param _coinName=DEV \
  --key_store config/alice.ks.json --key_password $(cat ./config/alice.secret) --step_limit 10000000000 --nid 0x58eb1c
```

### Bob to Alice

```bash
# Bob sends 1 DEV to Alice
encoded_data=$(eth method:encode ./config/abi.bsh_core.json "transferNativeCoin('btp://0x58eb1c.icon/hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab')")

eth transaction:send --network http://localhost:9933 \
  --pk 0xb7de716a085c14b353dec6c516c508bff76b0ac82ec96d854b9d66e58737c22e \
  --gas 6721975 \
  --to $(cat ./config/bsh_core.moonbeam) \
  --data $encoded_data \
  --value 1000000000000000000 | jq -r

# Bob sends 0.1 ICX to Alice
encoded_data=$(eth method:encode ./config/abi.bsh_core.json "transfer('ICX', '0x16345785D8A0000', 'btp://0x58eb1c.icon/hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab')")

eth transaction:send --network http://localhost:9933 \
  --pk 0xb7de716a085c14b353dec6c516c508bff76b0ac82ec96d854b9d66e58737c22e \
  --gas 6721975 \
  --to $(cat ./config/bsh_core.moonbeam) \
  --data $encoded_data | jq -r
```

```bash
# https://docs.openzeppelin.com/contracts/3.x/api/token/erc1155#IERC1155-setApprovalForAll-address-bool-
# setApprovalForAll with eth-cli REPL
eth repl --network http://localhost:9933 --pk 0xb7de716a085c14b353dec6c516c508bff76b0ac82ec96d854b9d66e58737c22e ./config/bsh_core_abi.json@0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963

bshCoreAbi.methods.isApprovedForAll('0xF8aC273f62F2D1D7283be823400e05Aeddc389F5', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963').call()

bshCoreAbi.methods.setApprovalForAll('0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', true).send({ from: '0xF8aC273f62F2D1D7283be823400e05Aeddc389F5', gas: 6721975 }).then(console.log)

.exit
```

## BSC

1. Transfer Token(ETH) from ICON (Alice) -> BSC (BOB)

```bash
# deposit 10 ETH to Alice
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat work/irc2_token.icon) --method transfer \
  --param _to=$(cat work/alice.ks.json | jq -r '.address') --param _value=10000000000000000000 \
  --key_store work/goloop.keystore.json --key_password $(cat work/goloop.secret) --step_limit 10000000000 --nid 0x58eb1c

# Alice send 10 ETH to BSH
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat work/irc2_token.icon) --method transfer \
  --param _to=$(cat work/token_bsh.icon) --param _value=10000000000000000000 \
  --key_store work/alice.ks.json --key_password $(cat work/alice.secret) --step_limit 10000000000 --nid 0x58eb1c

# Alice send 10 ETH to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat work/token_bsh.icon) --method transfer \
  --param tokenName=ETH --param to=$(cat work/bsc.ks.json | jq -r '.address') --param value=10000000000000000000 \
  --key_store work/alice.ks.json --key_password $(cat work/alice.secret) --step_limit 10000000000 --nid 0x58eb1c
```
