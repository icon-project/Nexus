# Fee Aggreegation SCORE Guideline!

- testnet with smartcontract Fee Aggregation SCORE
- documents/references to work with this testnet and smartcontract
- examples, commands, scripts... everything helpful to try this testnet/smartcontract

## Build local node

- Goloop version: v0.9.6.
- https://github.com/icon-project/goloop/blob/v0.9.6/doc/gochain_icon_local_node_guide.md

## Deployment

### Token Contract

IRC2 (ERC20)

```bash
cp sample-token-0.2.0-optimized.jar GOCHAIN_LOCAL_ROOT/

# initial 100M tokens
./goloop rpc sendtx deploy ./sample-token-0.2.0-optimized.jar --uri http://localhost:9082/api/v3 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java --param _name=SampleToken1406 --param _symbol=ST1406 --param _decimals=0x12 --param _initialSupply=0x52B7D2DCC80CD2E4000000

./goloop rpc txresult 0x4af5be998a8457835afb2da37591afeed6c4f656c03971156bc5cbc8f9b42132 --uri http://localhost:9082/api/v3

# scoreAddress: 'cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e',
```

### CPS Contract

```bash
cp ./CPFTreasury.zip GOCHAIN_LOCAL_ROOT/

./goloop rpc --uri http://localhost:9082/api/v3 sendtx deploy ./CPFTreasury.zip --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 13610920001 --content_type application/zip

./goloop rpc txresult 0xd019734534dce8f6ff3adabc62ce70db95ce8f2eb9cd5f297b8266149099156d --uri http://localhost:9082/api/v3

# scoreAddress: 'cx031b8ac09dac6acc9719442ed80bd514fa914db2',
```

### Fee Aggregation SCORE Contract

```bash
cp fee-aggregation-system-1.0-optimized.jar GOCHAIN_LOCAL_ROOT/

# Replace _cps_address by the CPS Contract Address deployed
./goloop rpc --uri http://localhost:9082/api/v3 sendtx deploy ./fas-1.0.4.jar --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000 --content_type application/java --param _cps_address="cx031b8ac09dac6acc9719442ed80bd514fa914db2"

./goloop rpc txresult 0x2e34b5cc2f80d4169cc0e03f34bf3fa12e1c7edf1afe0ec9c9e1a70ed9c3e604 --uri http://localhost:9082/api/v3

# "scoreAddress": "cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e",
```

## Methods on Smart Contract

### CLI Reference

https://github.com/icon-project/goloop/blob/master/doc/goloop_cli.md

Generate wallet:

```bash
./goloop ks gen -o wallet1.json -p tien12345
./goloop ks gen -o wallet2.json -p tien12345

# Send new wallet 10.000 via token contract
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx7f0bcc3fba6303536e2363a94df799aa7ec6c0cf --param _to=hx095973fa66ae5ed5d3164cd3c5116bd2efe52255 --param _value=0x10000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cx7f0bcc3fba6303536e2363a94df799aa7ec6c0cf --param _owner=hx095973fa66ae5ed5d3164cd3c5116bd2efe52255

# Send new wallet 100 ICX directly to wallet1
# decimal: 100000000000000000000 = 0x56BC75E2D63100000
# https://www.rapidtables.com/convert/number/decimal-to-hex.html
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 100 ICX" --to hx774ca45c762872ac6dd4780784e279ceb389dec9 --value 0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# wallet 1
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 500 ICX" --to hx774ca45c762872ac6dd4780784e279ceb389dec9 --value 0x1B1AE4D6E2EF500000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc balance hx774ca45c762872ac6dd4780784e279ceb389dec9 --uri http://localhost:9082/api/v3

# wallet 2
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 500 ICX" --to hxfafd853a7b47be47aa19acfb60e730e476fad2ab --value 0x1B1AE4D6E2EF500000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc balance hxfafd853a7b47be47aa19acfb60e730e476fad2ab --uri http://localhost:9082/api/v3

# wallet 3
./goloop rpc sendtx transfer --uri http://localhost:9082/api/v3 --message "Pay 500 ICX" --to hxf929970f97646433610c5b7367e12bb5bd1cab58 --value 0x1B1AE4D6E2EF500000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc balance hxf929970f97646433610c5b7367e12bb5bd1cab58 --uri http://localhost:9082/api/v3
```

### Test Sample Token

Transfer token: `transfer` on [token](#tokencontract) contract.

```bash
# Replace address value
# --to token contract
# --param _to FAS contract
# 100 token, decimal: 100000000000000000000 = 0x56BC75E2D63100000
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e --param _to=cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _value=0x56BC75E2D63100000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

# 150 token
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method transfer --to cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e --param _to=cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _value=0x821AB0D4414980000 --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e --param _owner=cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e

# godWallet.json ICX
./goloop rpc balance hxb6b5791be0b5ef67063b3c10b840fb81514db2fd --uri http://localhost:9082/api/v3

# godWallet.json token
./goloop rpc call --uri http://localhost:9082/api/v3 --method balanceOf --to cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e --param _owner=hxb6b5791be0b5ef67063b3c10b840fb81514db2fd
```

### Fee Aggregation SCORE

```bash
./goloop rpc scoreapi --uri http://localhost:9082/api/v3 cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e
```

Register token: `register` method

```bash
./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method registerIRC2 --to cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _tokenName=SampleToken1406 --param _tokenAddress=cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e --key_store ./data/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

./goloop rpc call --uri http://localhost:9082/api/v3 --method tokens --to cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e

[
  {
    "address": "cx18fbe903abdbb4b1e484e3135782ba2b8ba8dd4c",
    "name": "SampleToken020",
    "tokenId": "0"
  },
  {
    "address": "cx5574137f1a9544c2cd2ab14bf8d5a285c43f761e",
    "name": "SampleToken1406",
    "tokenId": "0"
  }
]
```

Bid for a special token: `bid` method with `--param _tokenName=MySampleToken`

./goloop rpc call --uri http://localhost:9082/api/v3 --method getCurrentAuction --to cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _tokenName=SampleToken1406

./goloop rpc call --uri http://localhost:9082/api/v3 --method availableBalance --to cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _tokenName=SampleToken1406

setDurationTime to 600s (in microsecond)
https://git.baikal.io/btp-dashboard/pm/-/issues/46

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --estimate --method bid --to cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _tokenName=SampleToken1406 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000

./goloop rpc sendtx call --uri http://localhost:9082/api/v3 --method setDurationTime --to cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e --param _duration=300000000 --key_store ./data/godWallet.json --key_password gochain --nid 3 --step_limit 10000000000

./goloop rpc txresult 0xd9e3412ef560e5f8995a1cba66ddc81ae7d2fe004e532643d00128bf19b737c1 --uri http://localhost:9082/api/v3