# Setup Users

```bash
# create John user
goloop ks gen -o john.ks.json -p test12345
# hxfa7ab3465e24ed44a1a8a3696d718b40043592fd ==> john.ks.json
echo 'btp://$(cat ./config/net.btp.icon)/$(cat john.ks.json | jq -r .address)'
# btp://0x3.icon/hxfa7ab3465e24ed44a1a8a3696d718b40043592fd

# deposite John 100K ICX
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon \
--to hxfa7ab3465e24ed44a1a8a3696d718b40043592fd --value 0xd3c21bcecceda1000000 \
--key_store ./config/godWallet.json --key_password gochain --step_limit 10000000000 --nid 3
# 0xd052efb9c1d6dcff99a8e6113a3c65585d3297defa743fd1c6fd028a45730dd9
goloop rpc txresult 0xd052efb9c1d6dcff99a8e6113a3c65585d3297defa743fd1c6fd028a45730dd9 --uri http://localhost:9080/api/v3/icon

# check John balance
goloop rpc balance hxfa7ab3465e24ed44a1a8a3696d718b40043592fd --uri http://localhost:9080/api/v3/icon | jq -r
# 0xd3c21bcecceda1000000
echo 0xd3c21bcecceda1000000 | sed 's/^0x//g'
# d3c21bcecceda1000000
echo 'ibase=16; d3c21bcecceda1000000' | bc
# 0 (too big to show :))

# Ida:
# Warning: address must be case sensitive.
# Public Address: 0xC41C5F1123ECCd5ce233578B2e7ebd5693869d73
# Private Key: 0x4c42532034540267bf568198ccec4cb822a025da542861fcb146a5fab6433ff8
# printf '%s\n' "0xC41C5F1123ECCd5ce233578B2e7ebd5693869d73" | awk '{ print tolower($0) }'

echo "btp://$(cat ./config/net.btp.moonbeam)/0xc41c5f1123eccd5ce233578b2e7ebd5693869d73"
# btp://0x501.pra/0xc41c5f1123eccd5ce233578b2e7ebd5693869d73
eth address:balance --network http://localhost:9933 0xc41c5f1123eccd5ce233578b2e7ebd5693869d73
# 1208925.819614629174706176
```

# ICON to Moonbeam

```bash
# John send 5 ICX to Ida
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0xc41c5f1123eccd5ce233578b2e7ebd5693869d73 --value 0x4563918244f40000 \
  --key_store john.ks.json --key_password test12345 --step_limit 10000000000 --nid 3
# Moonbeam block: from 182555
goloop rpc txresult 0x3532eb2cfd1b2b240ccf9680a6c4f2ada67f2b2d86227890777c123a5c943114 --uri http://localhost:9080/api/v3/icon
# check result, see TransferStart here

# check Ida ICX balance
eth abi:add bshcore ./config/abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "getBalanceOf('0xC41C5F1123ECCd5ce233578B2e7ebd5693869d73', 'ICX')"
# 0, why?

# John send 5 ICX to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0x4b0d307675cdae97fc624e1987b942f4b9483231 --value 0x4563918244f40000 \
  --key_store john.ks.json --key_password test12345 --step_limit 10000000000 --nid 3
# Moonbeam block: from 182837
goloop rpc txresult 0x4e6920e0b93715da32c2c3c982849b8b363815face435bb537c92c640527a3dc --uri http://localhost:9080/api/v3/icon
# check result, see TransferStart here

# check Bob ICX balance
eth abi:add bshcore ./config/abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "getBalanceOf('0x4b0d307675cdae97fc624e1987b942f4b9483231', 'ICX')"
# 0, why?

# Alice send 5 ICX to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0x4b0d307675cdae97fc624e1987b942f4b9483231 --value 5000000000000000000 \
  --key_store ./config/alice.ks.json --key_secret ./config/alice.secret --step_limit 10000000000 --nid 3
# Moonbeam block: from 183088, 183120
goloop rpc txresult 0xdd5cfdbae14e4d435253d19470caa32cd4ccdb82369b911e80f0a3a28fc839aa --uri http://localhost:9080/api/v3/icon
# check result, see TransferStart here

# check Bob ICX balance
eth abi:add bshcore ./config/abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "getBalanceOf('0x4b0d307675cdae97fc624e1987b942f4b9483231', 'ICX')"
# 0, why?
```

# Moonbeam to ICON

```bash
# Ida send 5 DEV to John
encoded_data=$(eth method:encode ./config/abi.bsh_core.json "transferNativeCoin('btp://0x3.icon/hxfa7ab3465e24ed44a1a8a3696d718b40043592fd')")

eth transaction:send --network http://localhost:9933 \
  --pk 0x4c42532034540267bf568198ccec4cb822a025da542861fcb146a5fab6433ff8 \
  --gas 6721975 \
  --to $(cat ./config/bsh_core.moonbeam) \
  --data $encoded_data \
  --value 5000000000000000000 | jq -r
# 185820, 0xe40803aacf904f552431c0d9db5e8200a75f189dbf9cfb33a541897defc76084
# ICON height: blockHeight: 278114,
eth transaction:get --network http://localhost:9933 0xe40803aacf904f552431c0d9db5e8200a75f189dbf9cfb33a541897defc76084

# check John DEV balance
goloop rpc call --uri http://localhost:9080/api/v3/icon \
--to $(cat ./config/nativeCoinBsh.icon) --method coinId --param _coinName=DEV
# 0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
goloop rpc call --uri http://localhost:9080/api/v3/icon \
 --to $(cat ./config/irc31token.icon) --method balanceOf \
  --param _owner=hxfa7ab3465e24ed44a1a8a3696d718b40043592fd --param _id=0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
# 0x44b1eec6162f0000 = 4950000000000000000, subtracted 0.05 DEV for fee
```

## Duy tests on 08/13/2021

ICON => MB
Send 100 ICX: 0xe6fdf2fa851fe06a9adabf71c4d8164688051b0877b3260573ba7f164e57d880
Send 1 DEV: 0x1f88a83f58ce3eef18c6c3c05d32e9b949df1b11616efa24cfae0a41e8f5b45a
MB => ICON
Send 100 DEV: 0x97ceb92790a4f79cd480fb36a4b2bcd16060d86261bf1e3d3f03a40a462324c6
Send 1 ICX: 0x9f2d28b1f3f501bdb9cba01716599fba7c063f307ecc841e3e269d3ff6b283d2

eth transaction:get --network http://localhost:9933 0x97ceb92790a4f79cd480fb36a4b2bcd16060d86261bf1e3d3f03a40a462324c6

# Test with UI 08/16/2021

Ida sent John 10 DEV successfully.

transactions.id = 0e9ee10b-8e56-4aae-ad2a-1228524ac875
block 296971 0x7dcc42ccf9fe5f4ce4aa82485ba1cde0eb7becc5b14eb8b40503b344f4734508
tx 0xd1aef8c48703dfe1d9745559eb45c32f280b92394395c5309669ac02de28f027

John sent Ida 10 ICX unsuccessfully.

transactions.id = 04355fdc-0987-452b-b240-d1d9600aa398
block 445596 "0xa8c1f3f4363fdef54462f6161845fb6bf2cdfeca3780d85268721a91b873860c"
tx "0x1b01d51f95dd20060c22bb5f081f79d0071bf561f2a9f565abf350f8871033d6"

1 ICX from Alice to Bob:
7cbefae7-6230-4062-a3a9-b5adde1a6b0d
block 450546
