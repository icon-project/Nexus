## ICON

goloop rpc txbyhash 0x82e1f046584502ee9a6c3bf5df87bf573ff419f7c177a189aa4d2d62b2c69382 --uri https://berlin.net.solidwallet.io/api/v3

goloop rpc txresult 0x82e1f046584502ee9a6c3bf5df87bf573ff419f7c177a189aa4d2d62b2c69382 --uri https://berlin.net.solidwallet.io/api/v3

hx1a884192c29c7810ec37dbda1802670a3d9eaa67 deloy account

Latest:

addRelay txhash 0xe8a964fbf8b04021f8214fe119573473ae89f81b644b9aa193f7dca81302123f 1844957
```

```bash
Irc2 score address cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274 => it is DEV token contract

https://berlin.tracker.solidwallet.io/transaction/0x859f8b704f23bc8bb6862c6826021e74e239add65d4b459e0e6ea81ebf0849a5

```json
{
	"contentType": "application/java",
	"params": {
		"_decimals": "0x12",
		"_initialSupply": "0x186A0",
		"_name": "DEV",
		"_symbol": "DEV"
	}
}
```

goloop rpc txresult 0x859f8b704f23bc8bb6862c6826021e74e239add65d4b459e0e6ea81ebf0849a5 --uri https://berlin.net.solidwallet.io/api/v3

```json
{
  "to": "cx0000000000000000000000000000000000000000",
  "cumulativeStepUsed": "0x3dbd653d",
  "stepUsed": "0x3dbd653d",
  "stepPrice": "0x2e90edd00",
  "eventLogs": [
    {
      "scoreAddress": "cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274",
      "indexed": [
        "Transfer(Address,Address,int,bytes)",
        "hx0000000000000000000000000000000000000000",
        "hx1a884192c29c7810ec37dbda1802670a3d9eaa67",
        "0x152d02c7e14af6800000"
      ],
      "data": [
        "0x6d696e74"
      ]
    }
  ],
  "logsBloom": "0x00000000000000000200002000080000000100...",
  "status": "0x1",
  "scoreAddress": "cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274",
  "blockHash": "0xce0d63c0eed534b397d22f84e88cf2f15d1a409bff042e96f521385ffefd6fcc",
  "blockHeight": "0x1c2584",
  "txIndex": "0x1",
  "txHash": "0x859f8b704f23bc8bb6862c6826021e74e239add65d4b459e0e6ea81ebf0849a5"
}
```

Native coin BSH contract manages DEV token (IRC2)

https://berlin.tracker.solidwallet.io/transaction/0x9da27f1e007eb34adbc7100762def1d7b655adce95d0f9b1aa422b5fe9fe5579

```json
{
	"contentType": "application/java",
	"params": {
		"_bmc": "cx6a3de71a52d8bbd3f87a497b7a07ebae13368b3f",
		"_irc2": "cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274",
		"_name": "ICX",
		"_tokenName": "DEV"
	}
}
```

```sql
INSERT INTO registered_tokens (network_id, token_name, token_id, contract_address, token_address, tx_hash) VALUES ('0x7', 'ICX', '0', 'cx9125e801c9370480ddf95ba48d796b3d4154b343', '', '0x294c1e27198ae3b159f93eedd6a478966d725c4d12dd69915992afc50cb10f24');
INSERT INTO registered_tokens (network_id, token_name, token_id, contract_address, token_address, tx_hash) VALUES ('0x507', 'MOVR', '0', 'MOONBEAM_BSH_CORE_ADDRESS', '', '0x5c8b55af397256d06e2be6acdefb350f92ff4363745001ce8cd367c74b10d7f3');
```

## Test

```bash
# ICON Berlin
goloop ks gen -o vova.json -p test12345
goloop rpc balance hxdd7cc765bb90ef63fca515e362feb3cce3f63ec7 --uri https://berlin.net.solidwallet.io/api/v3

# Moonbeam Alpha
eth address:balance 0x87a8804BDC1Fe3bC1ad703F61685934E7b348413 --network https://moonbeam-alpha.api.onfinality.io/public

# Send DEV from Moonbeam to ICON

eth contract:send --network https://moonbeam-alpha.api.onfinality.io/public erc2Bshcore@0xC0bDA7E7Cb3f0277748aF59F1c639BE7589bE4Ec 'transferNativeCoin("btp://0x7.icon/hxdd7cc765bb90ef63fca515e362feb3cce3f63ec7")' --pk YOUR_PRIVATE_KEYS --gas 6721975 --value 1000000000000000000

# Check DEV balance on ICON

goloop rpc --uri https://berlin.net.solidwallet.io/api/v3 call --to cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274 --method balanceOf --param _owner=hxc00a6d2d1e9ee0686704e0b6eec75d0f2c095b39

# Send DEV from icon to moonbeam
# 1. deposit DEV to BSH

goloop rpc --uri https://berlin.net.solidwallet.io/api/v3 sendtx call --to cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274 --method transfer --param _to=cx8a05039c1c1da936d279e276a25c4fa66154bebd --param _value=100000000000000000 --key_store daniel111.ks.json --nid 0x7 --step_limit 3519157719 --key_password abc12345

# 2. Transfer DEV from icon

goloop rpc --uri https://berlin.net.solidwallet.io/api/v3 sendtx call --to cx8a05039c1c1da936d279e276a25c4fa66154bebd --method transfer --param _coinName=DEV --param _value=100000000000000000 --param _to=btp://0x507.pra/0x0e367f147682237a0Bc1c839a2a4a1b2c28Bd77C --key_store daniel111.ks.json --nid 0x7 --step_limit 3519157719 --key_password abc12345

# Send ICX from ICON

goloop rpc --uri https://berlin.net.solidwallet.io/api/v3 sendtx call --to cx8a05039c1c1da936d279e276a25c4fa66154bebd --method transferNativeCoin --param _to=btp://0x507.pra/0x0e367f147682237a0Bc1c839a2a4a1b2c28Bd77C --value 1000000000000000000 --key_store daniel111.ks.json --key_password abc12345 --nid 0x7 --step_limit 3519157719

# Send ICX from Moonbeam

eth contract:send --network https://moonbeam-alpha.api.onfinality.io/public erc2Bshcore@0xC0bDA7E7Cb3f0277748aF59F1c639BE7589bE4Ec 'approve("0xC0bDA7E7Cb3f0277748aF59F1c639BE7589bE4Ec", "10000000000000000000")' --pk YOUR_PRIVATE_KEY --gas 6721975

eth contract:send --network https://moonbeam-alpha.api.onfinality.io/public erc2Bshcore@0xC0bDA7E7Cb3f0277748aF59F1c639BE7589bE4Ec ‘transferWrappedCoin(“ICX”,“1000000000000000000”, “btp://0x7.icon/hxc00a6d2d1e9ee0686704e0b6eec75d0f2c095b39”)’ --pk YOUR_PRIVATE_KEY --gas 6721975

## Issues

- ICON contracts: BSH and IRC2 (not exact IRC2 specs)
- Moonbeam contract: ERC20 for both native and wrapped coins
