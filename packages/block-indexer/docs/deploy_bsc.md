# Deploy BSC testnet notes

## General

goloop branch v0.9.7

[Deployment guide](https://github.com/icon-project/btp/blob/btp_web3labs/doc/bsc-guide.md)
[Transfer guide](https://github.com/icon-project/btp/blob/btp_web3labs/doc/token-transfer-guide.md)

## Requirements

[Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
[Docker Compose](https://docs.docker.com/compose/install/)
[OpenJDK 11](https://linuxize.com/post/install-java-on-ubuntu-18-04/)
[NodeJS 14.x LTS](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)

sudo apt-get install gcc g++ make
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

[Go](https://golang.org/doc/install)

curl -L -o go1.16.8.linux-amd64.tar.gz https://golang.org/dl/go1.16.8.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.16.8.linux-amd64.tar.gz

go install github.com/icon-project/goloop/cmd/goloop@v0.9.7

For install commands: https://github.com/icon-project/btp/tree/icondao/docker-compose/goloop2moonbeam

## Build

### 1. Build goloop image.

https://github.com/icon-project/btp/blob/btp_web3labs/doc/bsc-guide.md#build-goloop

### 2. Build Binance Smart Chain docker

https://github.com/icon-project/btp/blob/btp_web3labs/doc/bsc-guide.md#build-binance-smart-chain-docker

```bash
git clone -b btp_web3labs https://github.com/icon-project/btp
cd btp
docker build --tag bsc-node ./devnet/docker/bsc-node --build-arg KEYSTORE_PASS=Perlia0

# check for notes if it fails
go mod download github.com/ethereum/go-ethereum
go mod tidy
make

# build dist contract jars for bmc, bmv, bsh and example irc2 token
make dist-javascore

make dist-sol
make btpsimple-image
cd devnet/docker/icon-bsc
./build.sh
docker-compose up -d
```

If all successful, this should start docker network containing provisioned goloop, binance smart chain and BSC ICON BTP relayer.

You can get the keystores from the devnet/work folder. bsc.ks.json - for Binancesmartchain

btp-icon container might take sometime, it usually takes around 15 minutes, but certainly not an hour or so.
To check if the btp-icon container is started, you can check the logs to see if "provision is now complete" is present.

And please keep an eye on the btp-icon logs, cause untill "Provision is now complete" there should be no errors.

### Clean up

```bash
# clean up all manually
cd ~/testnet/btp/devnet/docker/icon-bsc && docker-compose down
sudo rm -rf work
docker rm javascore-dist
docker rmi -f bsc-node
docker rmi -f btp/javascore
docker rmi -f btpsimple
docker rmi -f icon-bsc_btp-icon
docker rmi -f icon-bsc_goloop
```

## Test

```bash
goloop rpc lastblock --uri http://localhost:9080/api/v3/icon
# 546
eth block:number --network http://localhost:8545
# 185

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "icx_getLastBlock"}' http://localhost:9080/api/v3/icon | jq
```

### Transfering

```bash
docker exec -it btp-icon sh
source /btpsimple/bin/keystore.sh
ensure_key_store alice.ks.json alice.secret
# alice.ks.json
# hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c
source /btpsimple/bin/provision.sh
getBalance
# bsc.ks.json
# getBalance 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d
# User Balance: 9999999999999999999900
source /btpsimple/bin/transfer_eth.sh
alice.ks.json
Transfering 0xa to: hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c from: hx5e39a47007c2d79ae1879fb6b524538bbab785ae
{ "to": "cxe32aa9a25c3a934134db8dd6749832fee8b45834", "cumulativeStepUsed": "0x3919", "stepUsed": "0x3919", "stepPrice": "0x0", "eventLogs": [ { "scoreAddress": "cxe32aa9a25c3a934134db8dd6749832fee8b45834", "indexed": [ "Transfer(Address,Address,int,bytes)", "hx5e39a47007c2d79ae1879fb6b524538bbab785ae", "hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c", "0xa" ], "data": [ "0x" ] } ], "logsBloom": "0x04000000000000000000002040000000000000000000000000000000000100000000000000000000000000000000002000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000020000000000000001000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000010000000000005000000010000000000000000000000000000000000000000000000000000000000000000000000000000", "status": "0x1", "blockHash": "0x3975fe456ab2a1a3869426ef72c4dbb01c6169a50f12bd5ab3ae439dc259e36a", "blockHeight": "0x319", "txIndex": "0x0", "txHash": "0xd69486273a7a92688191e493942e0e03b2f1e77ca23c9c67d5cef8d4949fe26c" }
alice.ks.json
Transfering 0xa to: cx77622c6d0bcd80048eb159aa99fd30df2f38c97f from: hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c
{ "to": "cxe32aa9a25c3a934134db8dd6749832fee8b45834", "cumulativeStepUsed": "0x712b", "stepUsed": "0x712b", "stepPrice": "0x0", "eventLogs": [ { "scoreAddress": "cxe32aa9a25c3a934134db8dd6749832fee8b45834", "indexed": [ "Transfer(Address,Address,int,bytes)", "hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c", "cx77622c6d0bcd80048eb159aa99fd30df2f38c97f", "0xa" ], "data": [ "0x" ] } ], "logsBloom": "0x00000000000000000000002040000000000000000000000000000000000100000000000000000000000000000000002010000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000040000000010000000000000008000000000000000000000000000000000000000000000000000000000000000000001000000000100000800000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000010000000000000000000000000000000000000000000000000000000000000000000000000000", "status": "0x1", "blockHash": "0x466fce71da381e9aab46a7e1c3fdc3c70454aca666e5ff2b34a4998d67d3cd33", "blockHeight": "0x31b", "txIndex": "0x0", "txHash": "0x388ee989fa9c588968c8c34f26ecce611d86beadbe082487e0008fc5477473fb" }
Balance of user hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c
{
  "locked": "0x0",
  "refundable": "0x0",
  "usable": "0xa"
}
alice.ks.json

source /btpsimple/bin/provision.sh
getBalance
# getBalance 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d
# User Balance: 9999999999999999999900
```

```bash
goloop rpc balance hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c --uri http://localhost:9080/api/v3/icon
# 0
eth address:balance 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d
# 9999999.178615693
```

scp ssh ubuntu@18.141.139.244:temp/btp-icon.log ~/Public

## Issues

It does not allow start/stop containers ([error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-924647894)).

# Alice to bsc.ks.json
Transfering 0xa to: 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d from: hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c

```json
{ "to": "cx77622c6d0bcd80048eb159aa99fd30df2f38c97f", "cumulativeStepUsed": "0x2fb14", "stepUsed": "0x2fb14", "stepPrice": "0x0", "eventLogs": [ { "scoreAddress": "cx566769f7f8253763d6d022b390a1453d13c28a7b", "indexed": [ "Message(str,int,bytes)", "btp://0x97.bsc/0xAaFc8EeaEE8d9C8bD3262CCE3D73E56DeE3FB776", "0x2" ], "data": [ "0xf8fcb83e6274703a2f2f30783130316335622e69636f6e2f637835363637363966376638323533373633643664303232623339306131343533643133633238613762b8396274703a2f2f307839372e6273632f30784161466338456561454538643943386244333236324343453344373345353644654533464237373688546f6b656e42534801b875f87300b870f86eaa687866366632353866646633643039306263653134663030373366396535613535383733383463633063b8396274703a2f2f307839372e6273632f307837306537383964326635643436396561333065303532356462666464353531356436656164333064c7c6834554480a00" ] }, { "scoreAddress": "cx77622c6d0bcd80048eb159aa99fd30df2f38c97f", "indexed": [ "TransferStart(Address,str,int,bytes)", "hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c", "ETH" ], "data": [ "0x1", "0xc7c6834554480a00" ] } ], "logsBloom": "0x00000000000000000000100000000000000100000040000000280000000000000000000000002000000000000000020010010000000000000000000000000000000000000001000000000000008000000000202000000000008000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000008000000020000000000020000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000004400000000000000000000000000000000000000000000000000200000000800000000000000000", "status": "0x1", "blockHash": "0xe13794d1dd703690850645d457a50e594259cadd39392616792d747c26780623", "blockHeight": "0x31e", "txIndex": "0x0", "txHash": "0x6302a9d349c18c657f3322c1bb2c73ad615547db8637abc3328e938aaaa62913" }
```
