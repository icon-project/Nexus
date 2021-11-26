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

{
  "bond": "0x5af316702100",
  "carryover": "0x0",
  "distributed": "0x0",
  "nextRewardDistribution": "0xc8640",
  "relayerMinBond": "0x1",
  "relayerRewardRank": "0x19",
  "relayerTerm": "0x64"
}

goloop rpc call --uri http://localhost:9080/api/v3/icon --method getRelayers --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --method setRelayerTerm --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --param _value=100 --key_store ./config/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3
# 0xfdca2cdb420e549e069a8f3623e34a7a5da633ff1d686308e48fccb548666e70

# 100 ICX
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --value=0x56BC75E2D63100000 --key_store ./config/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3
# 0x37520fd67ed487c70545891b48bfc3f591fbcee8902cc516b46e48aa1a66468e

goloop rpc balance cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --uri http://localhost:9080/api/v3/icon
# 0xad78f174ddc902100

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --method distributeRelayerReward --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --key_store ./config/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3
# 0x658d2958882f96557664ec6515445e1bd82181edc98aea38214ccd61620412ab

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --method claimRelayerReward --to cx26cdb2d9cf33dee078056532175a696b8a9fcc71 --key_store ./config/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3

goloop rpc txresult 0x37520fd67ed487c70545891b48bfc3f591fbcee8902cc516b46e48aa1a66468e --uri http://localhost:9080/api/v3/icon

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
