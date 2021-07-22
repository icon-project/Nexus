# References

https://git.baikal.io/icon/btp/-/blob/BTPDocument/BTP-Document.md

# Prepare Environment

```bash
# requires Node >= 10.x
# requires version GoLang 1.13+
brew install go
go version
# go version go1.16.3 darwin/arm64

brew install python
pip install virtualenv setuptools wheel

# Install OpenJDK 11 version.
brew tap AdoptOpenJDK/openjdk
brew install --cask adoptopenjdk11
java --version
# openjdk 11.0.11 2021-04-20
# OpenJDK Runtime Environment AdoptOpenJDK-11.0.11+9 (build 11.0.11+9)
# OpenJDK 64-Bit Server VM AdoptOpenJDK-11.0.11+9 (build 11.0.11+9, mixed mode)

# List Java versions installed
/usr/libexec/java_home -V

# optional: manually set active version at Java 11
# ref: https://stackoverflow.com/a/46517346/108616
export JAVA_HOME=$(/usr/libexec/java_home -v 11)

brew install gradle@6
gradle --version
# Gradle 6.9

npm install -g truffle@5.3.0
truffle --version
```

# Deploy Nodes

## Deploy ICON node

```bash
# root: ~/GitHub
git clone git@github.com:icon-project/goloop.git

cd goloop && GL_TAG=0.9.7 make gochain-icon-image
mkdir gochain && mkdir -p gochain/testsuite/config

# create gochain/testsuite/config/icon.json
# create gochain/testsuite/config/icon.json

cd gochain
docker-compose up -d

# testing
./bin/goloop rpc lastblock --uri http://localhost:9080/api/v3/icondao

# add to .zshrc
export PATH="$PATH:/Users/tiendq/GitHub/goloop/bin"
```

## Deploy Moonbeam node

```bash
docker run -d -p 9933:9933 -p 9944:9944 purestake/moonbeam:v0.9.2 --dev --ws-external --rpc-external

RPC: http://localhost:9933
WS: ws://localhost:9944 (check https://polkadot.js.org/apps/?rpc=ws://localhost:9944#/explorer)
Accounts for test: https://github.com/PureStake/moonbeam#prefunded-development-addresses
```

# Deploy ICON smart contracts

```bash
git clone git@github.com:icon-project/btp.git
cd btp && git checkout icondao

# https://git.baikal.io/icon/btp/-/blob/BTPDocument/files/javascore.tar
# extact to btp/lecle_javascore
tar -xzvf javascore.tar
```

## Compiling Requiring Java Files

```bash
# btp/javascore
cd javascore/bmv/eventDecoder
gradle buildKusamaDecoder
gradle buildMoonriverDecoder
cd ../parachain
gradle optimizedJar

# do it in btp/lecle_javascore
# compiling files to build BMC contract
cd lecle_javascore/bmc
gradle optimizedJar
cd ../nativecoin
gradle optimizedJar
cd ../javaee-tokens
gradle optimizedJar

mkdir -p /Users/tiendq/GitHub/goloop/gochain/testsuite/javascore
export JAVASCORE_SOURCE=/Users/tiendq/GitHub/goloop/gochain/testsuite/javascore/

cp javascore/bmv/parachain/build/libs/parachain-BMV-optimized.jar ${JAVASCORE_SOURCE}
cp javascore/bmv/eventDecoder/build/libs/KusamaEventDecoder-optimized.jar ${JAVASCORE_SOURCE}
cp javascore/bmv/eventDecoder/build/libs/MoonriverEventDecoder-optimized.jar ${JAVASCORE_SOURCE}
cp lecle_javascore/bmc/build/libs/bmc-0.1.0-debug.jar ${JAVASCORE_SOURCE}
cp lecle_javascore/nativecoin/build/libs/nativecoin-0.1.0-debug.jar ${JAVASCORE_SOURCE}
cp lecle_javascore/javaee-tokens/build/libs/irc31-0.1.0-debug.jar ${JAVASCORE_SOURCE}
```

## Deploy BMC SCORE Contract

```bash
# create /Users/tiendq/GitHub/goloop/gochain/testsuite/data/godWallet.json

echo "0x3.icon" > net.btp.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx deploy ./javascore/bmc-0.1.0-debug.jar \
  --key_store ./data/godWallet.json --key_password gochain --nid 3 \
  --content_type application/java --step_limit 13610920001 \
  --param _net=$(cat net.btp.icon) | jq -r . > tx.bmc.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.bmc.icon) | jq -r .scoreAddress > bmc.icon
echo "btp://$(cat net.btp.icon)/$(cat bmc.icon)" > btp.icon
```

## Deploy BMV SCORE Contract

Deploy Kusama and Moonriver Event Decoder

```bash
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx deploy ./javascore/KusamaEventDecoder-optimized.jar \
  --key_store ./data/godWallet.json --key_password gochain --nid 3 \
  --content_type application/java --step_limit 13610920001 | jq -r . > tx.kusamaDecoder.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx deploy ./javascore/MoonriverEventDecoder-optimized.jar \
  --key_store ./data/godWallet.json --key_password gochain --nid 3 \
  --content_type application/java --step_limit 13610920001 | jq -r . > tx.moonriverDecoder.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.kusamaDecoder.icon) | jq -r .scoreAddress > kusamaDecoder.icon
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.moonriverDecoder.icon) | jq -r .scoreAddress > moonriverDecoder.icon
```

Deploy BMV contract on ICON Network

```bash
cd javascore/bmv/helper
yarn
# update getBMVInitializeParams.ts
yarn getBMVInitializeParams

export encodedValidators="$(eval "echo $(jq -r '.encodedValidators' "/Users/tiendq/GitHub/btp/javascore/bmv/helper/BMVInitializeData.json")")"

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx deploy ./javascore/parachain-BMV-optimized.jar \
  --key_store ./data/godWallet.json --key_password gochain --nid 3 \
  --content_type application/java --step_limit 13610920001 \
  --param relayMtaOffset=0x813212 \
  --param paraMtaOffset=0x0 \
  --param bmc=$(cat bmc.icon) \
  --param net=$(cat net.btp.icon) \
  --param mtaRootSize=0x8 \
  --param mtaCacheSize=0x8 \
  --param mtaIsAllowNewerWitness=0x1 \
  --param relayLastBlockHash=0xeb9a4b725137f588e92cc4e8c2ee0f813b6d842b69793803fe5ea573c42ac0e9 \
  --param paraLastBlockHash=0xaf4116d40632d4e50d87c27cf054a1ea92d1c80d74c5b56dac37b1763fe609be \
  --param encodedValidators=${encodedValidators} \
  --param relayEventDecoderAddress=$(cat kusamaDecoder.icon) \
  --param paraEventDecoderAddress=$(cat moonriverDecoder.icon) \
  --param relayCurrentSetId=0xcd5 \
  --param paraChainId=0x0 \
    | jq -r . > tx.bmv.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.bmv.icon) | jq -r .scoreAddress > bmv.icon
```

```bash
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx deploy ./javascore/irc31-0.1.0-debug.jar \
  --key_store ./data/godWallet.json --key_password gochain --nid 3 \
  --content_type application/java --step_limit 13610920001 | jq -r . > tx.irc31token.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.irc31token.icon) | jq -r .scoreAddress > irc31token.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx deploy ./javascore/nativecoin-0.1.0-debug.jar \
    --key_store ./data/godWallet.json --key_password gochain --nid 3 \
    --content_type application/java --step_limit 13610920001 \
    --param _bmc=$(cat bmc.icon) \
    --param _irc31=$(cat irc31token.icon) \
    --param _name=ICX | jq -r . > tx.nativeCoinBsh.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.nativeCoinBsh.icon) | jq -r .scoreAddress > nativeCoinBsh.icon
```

Deploy FeeAggregation Contract

```bash
cd btp/javascore/fee_aggregation
./gradlew build
./gradlew optimizedJar
./gradlew deployToLocal -PkeystoreName="/Users/tiendq/GitHub/goloop/gochain/testsuite/data/godWallet.json" -PkeystorePass=gochain
# Succeeded to deploy: 0x02ea81d33e1b8db4ed60c530a2490da93db15e2ea05d2f94cfc44037161ac654
# SCORE address: cx5f35cc8871158c223476f5a6eea65a315bb38117
echo "cx5f35cc8871158c223476f5a6eea65a315bb38117" > feeAggregation.icon
```

# Deploy Moonbeam smart contracts

```bash
# clean up before compiling
rm -rf .openzeppelin
rm -rf build
```

## Deploy BMC Contracts

```bash
export BTP_PROJ_DIR=/Users/tiendq/GitHub/btp
cd solidity/bmc
yarn
truffle compile --all
# - BMC_PRA_NET: Chain ID and name of a network that BMC is going to deploy on, e.g. '0x501.pra'
BMC_PRA_NET=0x501.pra truffle migrate --network moonbeamlocal

# output

Starting migrations...
======================
> Network name:    'moonbeamlocal'
> Network id:      1281
> Block gas limit: 15000000 (0xe4e1c0)


1_deploy_bmc.js
===============

   Deploying 'BMCManagement'
   -------------------------
   > transaction hash:    0x13a1e1b258cee0b730ea27c5f8afc8f1135afcf92ad2ed5a29dc28cf835eafc0
   > Blocks: 0            Seconds: 0
   > contract address:    0x82745827D0B8972eC0583B3100eCb30b81Db0072
   > block number:        19
   > block timestamp:     1627281914
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.495625154174706176
   > gas used:            4872434 (0x4a58f2)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.09744868 ETH


   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0xa939069ad83a253a83ad86a1403212461faa9341a9fbf9ac6fff25a52314f7b8
   > Blocks: 0            Seconds: 0
   > contract address:    0xEC69d4f48f4f1740976968FAb9828d645Ad1d77f
   > block number:        20
   > block timestamp:     1627281915
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.485970754174706176
   > gas used:            482720 (0x75da0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0096544 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x44f1eed7e6ee7b34a00e76976810e557b9174eb02bf023cb46c420452c424960
   > Blocks: 0            Seconds: 0
   > contract address:    0x493275370aF3f63d9ccd10a6539435121cF4fbb9
   > block number:        21
   > block timestamp:     1627281916
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.472776894174706176
   > gas used:            659693 (0xa10ed)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01319386 ETH


   Deploying 'BMCPeriphery'
   ------------------------
   > transaction hash:    0xfca19d7d18f6f931ee20b1e00c27881cde4feca6fe9a0a3ddaa281708c3ea234
   > Blocks: 0            Seconds: 0
   > contract address:    0x91edC788F9989225BA7891e112AcD51C1e5B6056
   > block number:        22
   > block timestamp:     1627281918
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.385919494174706176
   > gas used:            4342870 (0x424456)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0868574 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x03f5eae0633dc5dbcaa30f25af0bb89d83e662008e2c0d6468afff5a274faeb5
   > Blocks: 0            Seconds: 0
   > contract address:    0x38762083399e60af42e6fD694e7d430a170c9Caf
   > block number:        23
   > block timestamp:     1627281919
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.371094454174706176
   > gas used:            741252 (0xb4f84)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01482504 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.22197938 ETH


Summary
=======
> Total deployments:   5
> Final cost:          0.22197938 ETH
```

https://git.baikal.io/icon/btp/-/blob/BTPDocument/Smart-Contracts-PRA.md#get-a-contract-address-and-full-btp-address-format-of-deployed-bmcperiphery-contract

```bash
truffle(moonbeamlocal)> bmcPeriphery.address
'0x38762083399e60af42e6fD694e7d430a170c9Caf'
truffle(moonbeamlocal)> await bmcPeriphery.getBmcBtpAddress()
'btp://0x501.pra/0x38762083399e60af42e6fD694e7d430a170c9Caf'
```

## Deploy BSH Contracts on Moonriver Network

```bash
BSH_COIN_URL=https://moonbeam.network/ \
  BSH_COIN_NAME=DEV \
  BSH_COIN_FEE=100 \
  BMC_PERIPHERY_ADDRESS=0x38762083399e60af42e6fD694e7d430a170c9Caf \
  BSH_SERVICE=CoinTransfer \
  truffle migrate --network moonbeamlocal

# Output
Starting migrations...
======================
> Network name:    'moonbeamlocal'
> Network id:      1281
> Block gas limit: 15000000 (0xe4e1c0)


1_deploy_bsh.js
===============

   Deploying 'BSHCore'
   -------------------
   > transaction hash:    0x060ac42ab4cde0e9a0345d04468b241c682c69e8f88d5218f0eb3446833c27ab
   > Blocks: 0            Seconds: 0
   > contract address:    0xab7785d56697E65c2683c8121Aac93D3A028Ba95
   > block number:        25
   > block timestamp:     1627282151
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.276421254174706176
   > gas used:            4685860 (0x478024)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0937172 ETH


   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0x5bd745ca188a3a173cd42a9a14dc507d4d79c873f0bb1ce060d0dac985f594ec
   > Blocks: 0            Seconds: 0
   > contract address:    0xb5F73112516ebeB89c7EF67a507513b441Ac28fA
   > block number:        26
   > block timestamp:     1627282152
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.266766854174706176
   > gas used:            482720 (0x75da0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0096544 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x38a11742ee452e6d601747658161a637e76bb2f746f93d75dbdd46554f2e95be
   > Blocks: 0            Seconds: 0
   > contract address:    0x7acc1aC65892CF3547b1b0590066FB93199b430D
   > block number:        27
   > block timestamp:     1627282153
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.249383774174706176
   > gas used:            869154 (0xd4322)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01738308 ETH


   Deploying 'BSHPeriphery'
   ------------------------
   > transaction hash:    0x80e76178202f6bfc23a2cb397f5552439f7a6abad306288d6637c57e9db85082
   > Blocks: 0            Seconds: 0
   > contract address:    0x78D714e1b47Bb86FE15788B917C9CC7B77975529
   > block number:        28
   > block timestamp:     1627282155
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.177534274174706176
   > gas used:            3592475 (0x36d11b)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0718495 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x895fb02c3ee8c4402f8475b9c334b7ef7087e7c81ad07b8c8d4d1f3fba6ee889
   > Blocks: 0            Seconds: 0
   > contract address:    0x85b108660f47caDfAB9e0503104C08C1c96e0DA9
   > block number:        29
   > block timestamp:     1627282156
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.164255894174706176
   > gas used:            663919 (0xa216f)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01327838 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:          0.20588256 ETH


Summary
=======
> Total deployments:   5
> Final cost:          0.20588256 ETH

truffle(moonbeamlocal)> bshPeriphery.address
'0x85b108660f47caDfAB9e0503104C08C1c96e0DA9'
```

## Deploy BMV Contracts on Moonriver Network

```bash
# @params
# - BMC_CONTRACT_ADDRESS: an address on chain of BMCPeriphery contract
# This address is queried after deploying BMC contracts
# - BMV_ICON_INIT_OFFSET: a block height when ICON-BMC was deployed
# - BMV_ICON_LASTBLOCK_HASH: a hash of the above block
# goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.bmc.icon)

BMC_CONTRACT_ADDRESS=0x38762083399e60af42e6fD694e7d430a170c9Caf \
BMV_ICON_NET=0x3.icon \
BMV_ICON_ENCODED_VALIDATORS=0xd69500b6b5791be0b5ef67063b3c10b840fb81514db2fd \
BMV_ICON_INIT_OFFSET=0xf13 \
BMV_ICON_INIT_ROOTSSIZE=8 \
BMV_ICON_INIT_CACHESIZE=8 \
BMV_ICON_LASTBLOCK_HASH=0xbafc1426614bd74a5f9c20300ba04e312456c4696d66aab05c05f7af7102f0bd \
  truffle migrate --network moonbeamlocal

# Output

Starting migrations...
======================
> Network name:    'moonbeamlocal'
> Network id:      1281
> Block gas limit: 15000000 (0xe4e1c0)


1_deploy_bmv.js
===============

   Deploying 'DataValidator'
   -------------------------
   > transaction hash:    0x9b3e66125d234523334b8c8a38ba2bfafc7bdafea4700b9fd9d6dc5657967724
   > Blocks: 0            Seconds: 0
   > contract address:    0xF0e46847c8bFD122C4b5EEE1D4494FF7C5FC5104
   > block number:        31
   > block timestamp:     1627283034
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.120900394174706176
   > gas used:            2120414 (0x205ade)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.04240828 ETH


   Deploying 'ProxyAdmin'
   ----------------------
   > transaction hash:    0x742a9a9b0a9b1f8e093913b202ecd33d6fc15dbe9c311cd7c00794d6ec942547
   > Blocks: 0            Seconds: 0
   > contract address:    0xe78A45427B4797ae9b1852427476A956037B5bC2
   > block number:        32
   > block timestamp:     1627283036
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.111245994174706176
   > gas used:            482720 (0x75da0)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0096544 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x27ef34efc6969bb7a2a2cf816117ffc552ced4f422d209b9c82a11eb1c0147ce
   > Blocks: 0            Seconds: 0
   > contract address:    0xb91C2eeaA0c475115069a6ED4bc601337a22788E
   > block number:        33
   > block timestamp:     1627283037
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.098894834174706176
   > gas used:            617558 (0x96c56)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01235116 ETH


   Deploying 'BMV'
   ---------------
   > transaction hash:    0x62a08475493d6eb5013b400a8510413e3e72e99f959cf22a01142f52ec030d37
   > Blocks: 0            Seconds: 0
   > contract address:    0xad856F238CBeafd064b80D12EadAea3981fB21B5
   > block number:        34
   > block timestamp:     1627283038
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207825.010199234174706176
   > gas used:            4434780 (0x43ab5c)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0886956 ETH


   Deploying 'TransparentUpgradeableProxy'
   ---------------------------------------
   > transaction hash:    0x7bcfcd16342e050c8f4e4b1365f9aa5d1188780126b32bf044b05d8c194ccd0b
   > Blocks: 0            Seconds: 0
   > contract address:    0xD45E290062Bd0D1C640D59C350cA03CC291b37FA
   > block number:        35
   > block timestamp:     1627283039
   > account:             0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
   > balance:             1207824.991629574174706176
   > gas used:            928483 (0xe2ae3)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.01856966 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:           0.1716791 ETH


Summary
=======
> Total deployments:   5
> Final cost:          0.1716791 ETH

truffle(moonbeamlocal)> bmv.address
'0xD45E290062Bd0D1C640D59C350cA03CC291b37FA'
```

# BMC contract configuration

## ICON-BMC Configuration

```bash
# 0x501.pra from deploying Moonbeam BMC contract
echo "0x501.pra" > net.btp.dst
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx call --to $(cat bmc.icon) \
    --key_store ./data/godWallet.json --key_password gochain --nid 3 \
    --step_limit 13610920001 \
    --method addVerifier \
    --param _net=$(cat net.btp.dst) \
    --param _addr=$(cat bmv.icon) \
    | jq -r . > tx.verifier.icon
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.verifier.icon)

echo "btp://0x501.pra/0x38762083399e60af42e6fD694e7d430a170c9Caf" > btp.dst
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx call --to $(cat bmc.icon) \
    --key_store ./data/godWallet.json --key_password gochain --nid 3 \
    --step_limit 13610920001 \
    --method addLink \
    --param _link=$(cat btp.dst) \
    | jq -r . > tx.link.icon
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.link.icon)
```

In success, a connection link from ICON-BMC to Moonriver-BMC will be set.

```bash
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx call --to $(cat bmc.icon) \
    --key_store ./data/godWallet.json --key_password gochain --nid 3 \
    --step_limit 13610920001 \
    --method setLinkRotateTerm \
    --param _link=$(cat btp.dst) \
    --param _block_interval=0x1770 \
    --param _max_agg=0x08 \
    | jq -r . > tx.setLinkRotateTerm.icon

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.setLinkRotateTerm.icon)

goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao sendtx call --to $(cat bmc.icon) \
    --key_store ./data/godWallet.json --key_password gochain --nid 3 \
    --step_limit 13610920001 \
    --method setLinkDelayLimit \
    --param _link=$(cat btp.dst) \
    --param _value=4 \
    | jq -r . > tx.setLinkDelayLimit.icon
goloop rpc --uri http://127.0.0.1:9080/api/v3/icondao txresult $(cat tx.setLinkDelayLimit.icon)
```
