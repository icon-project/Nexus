# Get reward data from ICON BMC #307

## Methods on Smart Contract

### CLI Reference

https://github.com/icon-project/goloop/blob/master/doc/goloop_cli.md

```bash
# Create wallet relayer1
goloop ks gen -o relayer1.json -p relayer1

# Add token into relayer1
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon --to $(cat ../relayer1.json | jq -r .address) --value 0x55d4be7c032c6d008 --key_store goloop.keystore.json --key_password $(cat goloop.keysecret) --step_limit 1000000000 --nid $(cat nid.icon)

# ./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon balance hx69fe7ff269b3aafcc2ca1c0d2b82b2d958277880

# Create wallet relayer2
goloop ks gen -o relayer2.json -p relayer2

# Add token into relayer2
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon --to $(cat ../relayer2.json | jq -r .address) --value 0x55d4be7c032c6d008 --key_store goloop.keystore.json --key_password $(cat goloop.keysecret) --step_limit 1000000000 --nid $(cat nid.icon)

# ./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon balance hx46b9171e66ed165d4459840c144f4b0fdc09788e

# Register relayer1 on BMC
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat bmc.icon) --method registerRelayer --param _desc="relayer1" --value 0x200 --key_store ../relayer1.json --key_password relayer1 --step_limit 1000000 --nid $(cat nid.icon)

# Get relayer after registering
# ./goloop rpc --uri http://localhost:9080/api/v3/icon call --to $(cat bmc.icon) --method getRelayers

# Register relayer2 on BMC
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat bmc.icon) --method registerRelayer --param _desc="relayer2" --value 1000000000000000000 --key_store ../relayer2.json --key_password relayer2 --step_limit 1000000 --nid $(cat nid.icon)

#1. Set term
# just 300 for testing
./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon sendtx call --to cx8e2d758fbcc7f9621f87481e33402ac2819785c8 --method setRelayerTerm --param _value=300 --key_store godWallet.json --step_limit 1000000 --nid 0x58eb1c --key_password gochain

# Get term if you want
# ./goloop rpc call --uri http://54.251.114.18:9080/api/v3/icon --method getRelayerTerm --to cx8e2d758fbcc7f9621f87481e33402ac2819785c8

#2. Funding 3 ICX to BMC
./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon sendtx transfer --to cx8e2d758fbcc7f9621f87481e33402ac2819785c8 --value 3000000000000000000 --key_store ./godWallet.json --step_limit 1000000000 --nid 0x58eb1c --key_password gochain


#3. You don't need to call distributeReward method, it handles automatically!
#4. Call getRelayers method
./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon call --to cx8e2d758fbcc7f9621f87481e33402ac2819785c8 --method getRelayers

```
### When registering on BMC, Relayer1 bonds 0x200, relayer2 bonds 0x100. The reward that relayer1 claims is 2/3 funding amount, relayer2 is 1/3.
```json
{
  "hx8058f3ab59a0745036c474af4f30eb95f3afea74": {
    "addr": "hx8058f3ab59a0745036c474af4f30eb95f3afea74",
    "bond": "0x200",
    "desc": "relayer1",
    "reward": "0x1bc16d674ea97b80",
    "since": "0x1d0659",
    "sinceExtra": "0x0"
  },
  "hxa0d49742bb8f6f644373fe9f4bf28a8416daf8c8": {
    "addr": "hxa0d49742bb8f6f644373fe9f4bf28a8416daf8c8",
    "bond": "0x100",
    "desc": "relayer2",
    "reward": "0xde0b6b3a754bdc0",
    "since": "0x1d066f",
    "sinceExtra": "0x0"
  }
}
```
```bash
#5. Funding some ICX to BMC "2nd time". I want to fund 6 ICX
./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon sendtx transfer --to cx8e2d758fbcc7f9621f87481e33402ac2819785c8 --value 6000000000000000000 --key_store ./godWallet.json --step_limit 1000000000 --nid 0x58eb1c --key_password gochain

#6. Get relayers again
./goloop rpc --uri http://54.251.114.18:9080/api/v3/icon call --to cx8e2d758fbcc7f9621f87481e33402ac2819785c8 --method getRelayers

```
### The reward each relayer will be accumulated!
```json
{
  "hx8058f3ab59a0745036c474af4f30eb95f3afea74": {
    "addr": "hx8058f3ab59a0745036c474af4f30eb95f3afea74",
    "bond": "0x200",
    "desc": "relayer1",
    "reward": "0x5342dc69aa6eff38",
    "since": "0x1d0659",
    "sinceExtra": "0x0"
  },
  "hxa0d49742bb8f6f644373fe9f4bf28a8416daf8c8": {
    "addr": "hxa0d49742bb8f6f644373fe9f4bf28a8416daf8c8",
    "bond": "0x100",
    "desc": "relayer2",
    "reward": "0x29a16e34d5377f9c",
    "since": "0x1d066f",
    "sinceExtra": "0x0"
  }
}
```

```bash
# Unregister relayers from BMC
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat bmc.icon) --method unregisterRelayer --key_store ../relayer1.json --key_password relayer1 --step_limit 1000000 --nid $(cat nid.icon)

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat bmc.icon) --method unregisterRelayer --key_store ../relayer2.json --key_password relayer2 --step_limit 1000000 --nid $(cat nid.icon)
