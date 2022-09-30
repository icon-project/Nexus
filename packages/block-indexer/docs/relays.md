## ICON

```json
{
  "txHash": "0x3da0479377d3e644de45bd13fd58725a51cdc755c57cba3cde5b4d50f056e8b8",
  "version": "0x3",
  "from": "hxb6b5791be0b5ef67063b3c10b840fb81514db2fd",
  "to": "cx439c888f491198c800b2e2c5566282b93e6fdab9",
  "stepLimit": "0x12a05f200",
  "timestamp": "0x5cd089ea951ed",
  "nid": "0x58eb1c",
  "signature": "avdHzAB5gwnx+p6uSnZ70F811eZbP/hX6gsoy/GyrOVvsqLZWIMVD942VdIGVpbJam0kVeW14J8NiTEAnFWTHAE=",
  "dataType": "call",
  "data": {
    "method": "addRelay",
    "params": {
      "_addr": "hxb6b5791be0b5ef67063b3c10b840fb81514db2fd",
      "_link": "btp://0x501.pra/0x5CC307268a1393AB9A764A20DACE848AB8275c46"
    }
  },
  "blockHash": "0x21b839e4b4f4f9ef11a4888a58fdd140c13aa0a940dff8985f561efb614671c9",
  "blockHeight": "0x136",
  "txIndex": "0x0"
}
```

### Add relay
```bash
goloop rpc --uri https://localhost/api/v3/ sendtx call --to <BMC_address> --method addRelay --param _link=<link_to_pra_chain> --param _addr=<relay_address> --key_store <godwallet.json> --key_password <godwallet_password> --nid <network_id> --step_limit 3519157719
```
### Remove relay
```bash
goloop rpc --uri https://localhost/api/v3/ sendtx call --to <BMC_address> --method removeRelay --param _link=<link_to_pra_chain> --param _addr=<relay_address> --key_store <godwallet.json> --key_password <godwallet_password> --nid <network_id> --step_limit 3519157719
```

## MOONBEAM

- Access to docker of moonbeam and run `truffle console`
```bash
$ truffle(moonbeamlocal)> let bmcManagement = await BMCManagement.deployed()
```
## Add relay


```bash
$ truffle(moonbeamlocal)> await bmcManagement.addRelay("<link_to_icon_chain>", ["<realy_address>"])

// check result
$ truffle(moonbeamlocal)> await bmcManagement.getRelays("<link_to_icon_chain>")
```
## Remove relay
```bash
$ truffle(moonbeamlocal)> await bmcManagement.removeRelay("<link_to_icon_chain>","<realy_address>")

// check result
$ truffle(moonbeamlocal)> await bmcManagement.getRelays("<link_to_icon_chain>")
```

eth abi:add bmc abi/BMCManagement.json

eth contract:call --network http://localhost:8545 bmc@$(cat bmc.bsc) "getRelays('btp://0xd35bbb.icon/cx11db74c77d4b8ac2e30ff5d73341c8c741be75ae')"

eth contract:call --network http://localhost:8545 bmc@$(cat bmc.bsc) "removeRelay('btp://0xd35bbb.icon/cx11db74c77d4b8ac2e30ff5d73341c8c741be75ae', '0x70E789D2f5D469eA30e0525DbfDD5515d6EAd30D')"

## BSC

Tx from addRelay.bsc

`eth transaction:get --network http://localhost:8545 0x8b44fe0ab93d5d6c33df6d43087637bd0d2485f2b605a2718fc723ce44c23b1a`

```json
{
  "blockHash": "0x4f371a503acdbb814e17afeac03a1f4c076237fe7890e87134516179581b3fdb",
  "blockNumber": 154,
  "from": "0x70E789D2f5D469eA30e0525DbfDD5515d6EAd30D",
  "gas": 6721975,
  "gasPrice": "20000000000",
  "hash": "0x8b44fe0ab93d5d6c33df6d43087637bd0d2485f2b605a2718fc723ce44c23b1a",
  "input": "0x0748ea7a000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000003e6274703a2f2f30786433356262622e69636f6e2f6378313164623734633737643462386163326533306666356437333334316338633734316265373561650000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000070e789d2f5d469ea30e0525dbfdd5515d6ead30d",
  "nonce": 32,
  "to": "0x3cC15e6fE06Ca92c5E062463472852b68AF526F4", // bmc.bsc
  "transactionIndex": 0,
  "value": "0",
  "v": "0xe6",
  "r": "0xb2633d134cb7bf59d9006b1ae2b448a77f9329935a00d8727c64a088261c7be3",
  "s": "0x4ba850d71bbac4d7ac6406903a52e6feb93282f0ca42b4a96746f64300c44e87",
  "receipt": {
    "blockHash": "0x4f371a503acdbb814e17afeac03a1f4c076237fe7890e87134516179581b3fdb",
    "blockNumber": 154,
    "contractAddress": null,
    "cumulativeGasUsed": 94530,
    "from": "0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d",
    "gasUsed": 94530,
    "logs": [],
    "logsBloom": "0x0000000000000000000000000000000...",
    "status": true,
    "to": "0x3cc15e6fe06ca92c5e062463472852b68af526f4",
    "transactionHash": "0x8b44fe0ab93d5d6c33df6d43087637bd0d2485f2b605a2718fc723ce44c23b1a",
    "transactionIndex": 0
  }
}
```
