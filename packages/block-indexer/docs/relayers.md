  icon Transaction: e {
  icon   timestamp: 1625546309216457,
  icon   value: H { s: 1, e: 2, c: [ 256 ] },
  icon   nid: H { s: 1, e: 0, c: [ 3 ] },
  icon   stepLimit: H { s: 1, e: 10, c: [ 10000000000 ] },
  icon   from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  icon   to: 'cxc623909611eb44e9cac9efaf6cad1d603e1b543f',
  icon   signature: 'F/eoQtmUtl+MacY3gNuJcfJkbIXh4nMTV2KSyPsAQVhTRbI3muZ1x2sisp6cVdVU57UTH8Qs3baHVbrvN5ktAgE=',
  icon   dataType: 'call',
  icon   data: { method: 'registerRelayer', params: { _desc: 'relayer1' } },
  icon   version: H { s: 1, e: 0, c: [ 3 ] },
  icon   txHash: '0xff35f61e6134a1f6ffc955bd613f38b6095e040d6b1d1912b6552b45e61f24dc'
  icon } +98ms

icon Transaction: e {
  icon   timestamp: 1625550961294343,
  icon   nid: H { s: 1, e: 0, c: [ 3 ] },
  icon   stepLimit: H { s: 1, e: 10, c: [ 10000000000 ] },
  icon   from: 'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  icon   to: 'cxc623909611eb44e9cac9efaf6cad1d603e1b543f',
  icon   signature: 'lzvA3awDSESSfuOFmRZnQBy1zajkUDq1PiQ/RWu0cUxrNt3Vj6A/C4sQJ7/faql7VCcQr2kTr1gHMa6JPmUS4wA=',
  icon   dataType: 'call',
  icon   data: { method: 'unregisterRelayer' },
  icon   version: H { s: 1, e: 0, c: [ 3 ] },
  icon   txHash: '0x5a06e3f37a34f0d470d2000feaf21c7ca8e099ba84662003f7082c498e94ed59'
  icon } +35ms

```bash
# inconsistent version, name in code getRelayersProperties
# https://github.com/icon-project/btp/blob/goloop2moonbeam-iconloop/javascore/bmc/src/main/java/foundation/icon/btp/bmc/BTPMessageCenter.java
goloop rpc call --uri http://localhost:9080/api/v3/icon --method getRelayerManagerProperties --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71

goloop rpc call --uri http://localhost:9080/api/v3/icon --method getRelayers --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --method distributeRelayerReward --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --key_store godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --method claimRelayerReward --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --key_store godWallet.json --key_password gochain --step_limit 10000000000 --nid 3


goloop rpc txresult 0xfb0bb38bcf092398c7a333ae9f1f217d64db078fd428c63fd451fa1179b3bdee --uri http://localhost:9080/api/v3/icon
```

# Command
## ICON
### Register Relayer
```bash
goloop rpc --uri https://localhost/api/v3/ sendtx call --to <BMC_address> --method registerRelayer --param _desc="<relayer_name>" --value 1000000000000000000 --key_store <your_wallet.json> --key_password <your_wallet_password> --nid <network_id> --step_limit 3519157719
```
### Unregister Relayer
```bash
goloop rpc --uri https://localhost/api/v3/ sendtx call --to <BMC_address> --method unregisterRelayer --key_store <your_wallet.json> --key_password <your_wallet_password> --nid <network_id> --step_limit 3519157719
```
