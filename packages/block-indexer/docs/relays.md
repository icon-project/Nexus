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
  icon 0xff35f61e6134a1f6ffc955bd613f38b6095e040d6b1d1912b6552b45e61f24dc: [RPC ERROR] Executing +5ms
  icon Block height 286 not found +1s
  icon Transaction result: e {
  icon   status: 1,
  icon   to: 'cxc623909611eb44e9cac9efaf6cad1d603e1b543f',
  icon   txHash: '0xff35f61e6134a1f6ffc955bd613f38b6095e040d6b1d1912b6552b45e61f24dc',
  icon   txIndex: 0,
  icon   blockHeight: 285,
  icon   blockHash: '0x593197121a540a163deb302657be85eb8f3e46e5bc3b7a02ed6992ba55b5d160',
  icon   cumulativeStepUsed: H { s: 1, e: 6, c: [ 1263053 ] },
  icon   stepUsed: H { s: 1, e: 6, c: [ 1263053 ] },
  icon   stepPrice: H { s: 1, e: 10, c: [ 12500000000 ] },
  icon   eventLogs: [],
  icon   logsBloom: '0x0000000000000000000000000000000000000000000000...'
  icon } +4s

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
  icon Transaction result: e {
  icon   status: 1,
  icon   to: 'cxc623909611eb44e9cac9efaf6cad1d603e1b543f',
  icon   txHash: '0x5a06e3f37a34f0d470d2000feaf21c7ca8e099ba84662003f7082c498e94ed59',
  icon   txIndex: 0,
  icon   blockHeight: 1481,
  icon   blockHash: '0x3f2bd64ea09c78022ddcc8624d11120271bd11c915f21fe72e1f78b4cdad718a',
  icon   cumulativeStepUsed: H { s: 1, e: 5, c: [ 207750 ] },
  icon   stepUsed: H { s: 1, e: 5, c: [ 207750 ] },
  icon   stepPrice: H { s: 1, e: 10, c: [ 12500000000 ] },
  icon   eventLogs: [
  icon     {
  icon       scoreAddress: 'cxc623909611eb44e9cac9efaf6cad1d603e1b543f',
  icon       indexed: [
  icon         'ICXTransfer(Address,Address,int)',
  icon         'cxc623909611eb44e9cac9efaf6cad1d603e1b543f',
  icon         'hxb6b5791be0b5ef67063b3c10b840fb81514db2fd',
  icon         '0x100'
  icon       ],
  icon       data: []
  icon     }
  icon   ],
  icon   logsBloom: '0x0000000000000000000000010000000000800000...'
  icon } +9ms

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