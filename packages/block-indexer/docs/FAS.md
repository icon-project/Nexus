# Fee Aggreegation SCORE Guideline!

- testnet with smartcontract Fee Aggregation SCORE
- documents/references to work with this testnet and smartcontract
- examples, commands, scripts... everything helpful to try this testnet/smartcontract

## Build local node

- Goloop version: v0.9.6.
- https://github.com/icon-project/goloop/blob/v0.9.6/doc/gochain_icon_local_node_guide.md

## Deployment

### Token Contract

#### IRC2 (ERC20)

```bash
cp sample-token-0.2.0-optimized.jar GOCHAIN_LOCAL_ROOT/

# initial 100M tokens
./goloop rpc sendtx deploy ./sample-token-0.2.0-optimized.jar --uri http://localhost:9082/api/v3 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java --param _name=SampleToken1 --param _symbol=Sample1 --param _decimals=0x12 --param _initialSupply=0x52B7D2DCC80CD2E4000000

./goloop rpc sendtx deploy ./sample-token-0.2.0-optimized.jar --uri http://localhost:9082/api/v3 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java --param _name=SampleETH --param _symbol=ETH --param _decimals=0x12 --param _initialSupply=0x52B7D2DCC80CD2E4000000

./goloop rpc txresult 0xe8afac166da06603c8fec8ebdcc2ad86450ee9233d9ae79ad5082c529c5eaaf6 --uri http://localhost:9082/api/v3

# Sample1: 'cx5c3d7459ca5228ac42900947c1e75c8f28884869',
# ETH: 'cxc11a4e6286215c0c982365a024a8a370186f5a71',

# remote
./goloop rpc sendtx deploy ./sample-token-0.2.0-optimized.jar --uri http://localhost:9082/api/v3 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java --param _name=Test2206 --param _symbol=ST2206 --param _decimals=0x12 --param _initialSupply=0x52B7D2DCC80CD2E4000000

# Test2206 "scoreAddress": "cx883f24e8b42f686fdfb48abb5efa709c7eacd64c"
```

#### ERC1155/IRC31

```bash
./goloop rpc sendtx deploy ./SampleMultiToken.zip --uri http://localhost:9082/api/v3 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/zip

./goloop rpc txresult 0x850fdb27ab2f6419aea5bd9e3abfa961f147fee8df08af8622cce4a97400d556 --uri http://localhost:9082/api/v3

# "scoreAddress": "cxace8e7095dd2bd47d3f1295ddebed41da61bd936"
# initial 100M tokens, token id 100
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method mint --to cxace8e7095dd2bd47d3f1295ddebed41da61bd936 --param _id=100 --param _supply=0x52B7D2DCC80CD2E4000000 --param _uri=https://test.com --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc txresult 0xbe8ab3ef5ed45722182e5e3c842a69c60a55a4b4a491a6f214bf7a956d820546 --uri http://localhost:9082/api/v3
```

### CPS Contract

```bash
cp ./CPFTreasury.zip GOCHAIN_LOCAL_ROOT/

./goloop rpc --uri http://localhost:9082/api/v3 sendtx deploy ./CPFTreasury.zip --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 13610920001 --content_type application/zip

./goloop rpc txresult 0x2331c37fb914a91463fced47d5b18c9db342314d2a7851124180839c6e205a06 --uri http://localhost:9082/api/v3

# scoreAddress: 'cxef9cc1ff56a8ffadae294c0e874f9dd0ae828b9f',
```

### Fee Aggregation SCORE Contract

```bash
cp fee-aggregation-system-1.0-optimized.jar GOCHAIN_LOCAL_ROOT/

# Replace _cps_address by the CPS Contract Address deployed
./goloop rpc --uri http://localhost:9082/api/v3 sendtx deploy ./fas-1.0.4.jar --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java --param _cps_address=cxef9cc1ff56a8ffadae294c0e874f9dd0ae828b9f

./goloop rpc txresult 0x88a2e4e6a0625219f8e40171006c96b748ec11058a0a630a05ce51238c367e0f --uri http://localhost:9082/api/v3

# "scoreAddress": "cx51291cbe0fff966b881d251b9414e54f5a02dac7",
```

## Methods on Smart Contract

### CLI Reference

https://github.com/icon-project/goloop/blob/master/doc/goloop_cli.md

Generate wallet:

```bash
./goloop ks gen -o wallet1.json -p tien12345

# Send new wallet 10.000 via token contract
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx7f0bcc3fba6303536e2363a94df799aa7ec6c0cf --param _to=hx095973fa66ae5ed5d3164cd3c5116bd2efe52255 --param _value=0x10000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cx7f0bcc3fba6303536e2363a94df799aa7ec6c0cf --param _owner=hx095973fa66ae5ed5d3164cd3c5116bd2efe52255

# Send new wallet 500 ICX directly to wallet1
# decimal: 500000000000000000000 = 0x1B1AE4D6E2EF500000
# https://www.rapidtables.com/convert/number/decimal-to-hex.html
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 500 ICX" --to hxa5a41195fcef2167df40de516c48adb5c6c35056 --value 0x1B1AE4D6E2EF500000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc balance hx774ca45c762872ac6dd4780784e279ceb389dec9 --uri http://localhost:9082/api/v3

# wallet 2
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 500 ICX" --to hxcc317aea9bec8840b88125047a65bef04b1157a8 --value 0x1B1AE4D6E2EF500000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc balance hxfafd853a7b47be47aa19acfb60e730e476fad2ab --uri http://localhost:9082/api/v3

# wallet 3
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 500 ICX" --to hx4186087ae601a527635ea19093b3680dfbb358ea --value 0x1B1AE4D6E2EF500000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc balance hx4186087ae601a527635ea19093b3680dfbb358ea --uri http://localhost:9082/api/v3
```

### Test Sample Token

Transfer token: `transfer` on [token](#tokencontract) contract.

//        000000000000000000
//           567000000000000
//          8086000000000000
//            20210000000000

```bash
# Replace address value
# --to token contract
# --param _to FAS contract
# 100 token, decimal: 100000000000000000000 = 0x56BC75E2D63100000
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5c3d7459ca5228ac42900947c1e75c8f28884869 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# .567000000000000 tokens
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5c3d7459ca5228ac42900947c1e75c8f28884869 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x203AEF9967000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# .8086000000000000 tokens
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5c3d7459ca5228ac42900947c1e75c8f28884869 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x1CBA2C95A76000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# .8086000000000000 ETH tokens
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cxc11a4e6286215c0c982365a024a8a370186f5a71 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x1CBA2C95A76000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# 10 ETH
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cxc11a4e6286215c0c982365a024a8a370186f5a71 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x8AC7230489E80000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# .20210000000000 tokens
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5c3d7459ca5228ac42900947c1e75c8f28884869 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x126181DEF400 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# 10 tokens
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5c3d7459ca5228ac42900947c1e75c8f28884869 --param _to=cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _value=0x8AC7230489E80000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cx5c3d7459ca5228ac42900947c1e75c8f28884869 --param _owner=cx51291cbe0fff966b881d251b9414e54f5a02dac7

# godWallet.json ICX
./goloop rpc balance hxb6b5791be0b5ef67063b3c10b840fb81514db2fd --uri http://localhost:9082/api/v3

# godWallet.json token
./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e --param _owner=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd
```

### Fee Aggregation SCORE

```bash
./goloop rpc scoreapi --uri http://localhost:9082/api/v3 cx51291cbe0fff966b881d251b9414e54f5a02dac7
```

Register token: `register` method

```bash
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method registerIRC2 --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _tokenName=Sample1 --param _tokenAddress=cx5c3d7459ca5228ac42900947c1e75c8f28884869 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# ETH
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method registerIRC2 --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _tokenName=ETH --param _tokenAddress=cxc11a4e6286215c0c982365a024a8a370186f5a71 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# Register ERC1155/IRC31
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method registerIRC31 --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _tokenName=XRP --param _tokenAddress=cxace8e7095dd2bd47d3f1295ddebed41da61bd936 --param _tokenId=100 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3
```

#### Token list

```bash
./goloop rpc call --uri http://localhost:9082/api/v3 --method tokens --to cx51291cbe0fff966b881d251b9414e54f5a02dac7

[
  {
    "address": "cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e",
    "name": "SampleToken1406",
    "tokenId": "0"
  },
  {
    "address": "cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e",
    "name": "Test2206",
    "tokenId": "0"
  },
  {
    "address": "cx3c80950bcd83f54753da3a9f35aefa108920282d",
    "name": "SunnyDay",
    "tokenId": "0"
  },
  {
    "address": "cxace8e7095dd2bd47d3f1295ddebed41da61bd936",
    "name": "XRP",
    "tokenId": "100"
  }
]
```

Bid for a special token: `bid` method with `--param _tokenName=MySampleToken`

./goloop rpc call --uri http://localhost:9082/api/v3 --method getCurrentAuction --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _tokenName=Sample1

./goloop rpc call --uri http://localhost:9082/api/v3 --method availableBalance --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _tokenName=Sample1

setDurationTime to 600s (in microsecond)
https://git.baikal.io/btp-dashboard/pm/-/issues/46

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --estimate --method bid --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _tokenName=SampleToken1406 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method setDurationTime --to cx51291cbe0fff966b881d251b9414e54f5a02dac7 --param _duration=300000000 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000

./goloop rpc txresult 0xd76f07ca45e1523ae9f6404878a697c4dac87f09c79d51fa7de075c2c3cf98f5 --uri http://localhost:9082/api/v3

curl -X POST http://localhost:8000/v1/auctions -H 'Content-Type: application/json' -d '{"tokenName":"Test2206", "tokenAmount": 10}'

## Deploy ICON BMC

```bash
# 0x03.icon default value of icon chain
./goloop rpc --uri http://localhost:9082/api/v3 sendtx deploy ./bmc-0.1.0-debug.jar --param _net='0x03.icon' --content_type application/java --nid 3 --step_limit 10000000000 --key_store ./data/godWallet.json --key_password gochain

./goloop rpc txresult 0xb1153093e1d095682470103737c0d5b4bdc007242d3097f381f233ba1bd21613 --uri http://localhost:9082/api/v3

# "scoreAddress": "cxc623909611eb44e9cac9efaf6cad1d603e1b543f"
```

### registerRelayer

./goloop ks gen -o relayer1.json -p relayer1

./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --to hxe98c8ee5fcc42f5dee87892ab7ee105e2b988000 --value 0x100 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop ks gen -o relayer2.json -p relayer2

./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --to hx0dc600b1da7abff0551b2e1f180fc4c0e1e8f0e4 --value 0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --to cxc623909611eb44e9cac9efaf6cad1d603e1b543f --method registerRelayer --param _desc="relayer2" --value 0x200 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --to cxc623909611eb44e9cac9efaf6cad1d603e1b543f --method registerRelayer --param _desc="relayer3" --value 0x100 --key_store ./relayer2.json --key_password relayer2 --step_limit 10000000000 --nid 3

#./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --to cxc623909611eb44e9cac9efaf6cad1d603e1b543f --method registerRelayer --param _desc="relayer4" --value 0x100 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc txresult 0x0e77c0a0ba1808d10503df29c0de107197b93e24eb953a2f91a1cade73f5c8fe --uri http://localhost:9082/api/v3

./goloop ks gen -o relayer3.json -p relayer3

./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --to hx0a905ceb811eb764734413f137a4c934e7c6b6ac --value 0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --to cxc623909611eb44e9cac9efaf6cad1d603e1b543f --method registerRelayer --param _desc="relayer13" --value 0x100 --key_store ./relayer3.json --key_password relayer3 --step_limit 10000000000 --nid 3

### unregisterRelayer

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --to cxc623909611eb44e9cac9efaf6cad1d603e1b543f --method unregisterRelayer --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

### getRelayers

./goloop rpc call --uri http://localhost:9082/api/v3 --to cxc623909611eb44e9cac9efaf6cad1d603e1b543f --method getRelayers

{
  "hxb6b5791be0b5ef67063b3c10b840fb81514db2fd": {
    "addr": "hxb6b5791be0b5ef67063b3c10b840fb81514db2fd",
    "bond": "0x100",
    "desc": "relayer1",
    "reward": "0x0",
    "since": "0x11d",
    "sinceExtra": "0x0"
  }
}

### Issues

1. Cannot register 2 relayers with same address godWallet

"failure": {
  "code": "0x2a",
  "message": "Reverted(10)"
},

2. Cannot register relayer with non-God address

Error: jsonrpc: code: -31002, message: Pending, data: <nil>

3. I don't see anything related to transaction to get Transferred Transactions and Failed Transactions values.

4. Is `_desc` relay name in `registerRelayer`?

5. Can bonded value be changed after a relay is registered?
