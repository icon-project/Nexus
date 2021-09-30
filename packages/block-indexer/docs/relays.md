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

# Command
## ICON
### Add relay
```bash
goloop rpc --uri https://localhost/api/v3/ sendtx call --to <BMC_address> --method addRelay --param _link=<link_to_pra_chain> --param _addr=<relay_address> --key_store <godwallet.json> --key_password <godwallet_password> --nid <network_id> --step_limit 3519157719
```
### Remove relay
```bash
goloop rpc --uri https://localhost/api/v3/ sendtx call --to <BMC_address> --method removeRelay --param _link=<link_to_pra_chain> --param _addr=<relay_address> --key_store <godwallet.json> --key_password <godwallet_password> --nid <network_id> --step_limit 3519157719
```

##MOONBEAM

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
