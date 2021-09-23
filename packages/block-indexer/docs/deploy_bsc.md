- No goloop branch v0.9.7 (command doesn't work with tag).
- Are they different, OpenJDK 11 vs. JDK11? Our current testnet requires JDK11
- Is NodeJS 14.x LTS fine? Requiring the latest NodeJS version might affect our web apps and other JS tools.
- I see this guide creates its own ICON network, can it be configured to integrate to our existing local ICON network?
- It needs to be included in the guide (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-915049744)
- It needs to be included in the guide (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-915100350)
- These verifications should be included in the guide (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916697472)
- Is it fixed? (https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916713424)

## Requirements

[Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
[Docker Compose](https://docs.docker.com/compose/install/)
[OpenJDK 11](https://linuxize.com/post/install-java-on-ubuntu-18-04/)
[NodeJS](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)

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

### 2. Build Binance Smart Chain docker

https://github.com/icon-project/btp/tree/btp_web3labs/devnet

```bash
git clone -b btp_web3labs https://github.com/icon-project/btp
cd btp
docker build --tag bsc-node ./devnet/docker/bsc-node --build-arg KEYSTORE_PASS=Perlia0

bsc-node image created but this is an [error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-920558438)

go mod download github.com/ethereum/go-ethereum
go mod tidy
make

[error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-920561474)
[error with go 1.17.x](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-920561474)

make dist-javascore
[error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-921604124)

make dist-sol
make btpsimple-image
cd devnet/docker/icon-bsc
./build.sh
docker-compose up -d
```

once everything starts, the icon-bsc node will take some time to provision, once all the containers are up, you can get the keystores from the devnet/work folder. bsc.ks.json - for Binancesmartchain

btp-icon container might take sometime, it usually takes around 15 minutes, but certainly not an hour or so.
To check if the btp-icon container is started, you can check the logs to see if "provision is now complete" is present.

And please keep an eye on the btp-icon logs, cause untill "Provision is now complete" there should be no errors.

```bash
ubuntu@ip-172-31-19-19:~/testnet/btp/devnet/docker/icon-bsc$ docker-compose up
Creating network "icon-bsc_default" with the default driver
Creating binancesmartchain ... done
Creating goloop            ... done
Creating btp-icon          ... done

ERROR: for btp-bsc  Container "5eafacd5d129" is unhealthy.
ERROR: Encountered errors while bringing up the project.
```

[logged error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-922638506)

```bash
# if you still need a clean setup, you can do manually

docker-compose down
sudo rm -rf work
docker rmi -f icon-bsc_goloop
docker rmi -f icon-bsc_btp-icon
docker rm -f javascore-dist
docker rmi -f btpsimple
docker rmi -f btp/javascore
```

verify JSON files https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916687302
Could you also please verify if other folders "bmc"& "bmv" under /contracts/solidity has build folder?
also if you can confirm if "Funding BSH" logs present at the end of the provision

generate missing files https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916700815

Restart at:

REPOSITORY             TAG                 IMAGE ID       CREATED         SIZE
goloop                 latest              253ece31904a   5 days ago      516MB
goloop/java-deps       latest              e33e33c4e846   5 days ago      779MB
goloop/go-deps         latest              7fc8a647901e   5 days ago      723MB
goloop/py-deps         latest              fc07485bf8ab   5 days ago      300MB
alpine                 3.12                48b8ec4ed9eb   2 weeks ago     5.58MB
iconloop/goloop-icon   v0.9.7              2348df1648dc   3 months ago    516MB
alpine                 3.14.0              d4ff818577bc   3 months ago    5.6MB
node                   16.1-alpine         50389f7769d0   4 months ago    113MB
hello-world            latest              d1165f221234   6 months ago    13.3kB
python                 3.7.9-alpine3.12    b9aa0352c160   7 months ago    41.8MB
golang                 1.14.7-alpine3.12   cf2ff089aa2c   12 months ago   287MB

docker logs -f btp-icon &> btp-icon.log &

## Test

```bash
goloop rpc lastblock --uri http://localhost:9080/api/v3/icon
# 546
eth block:number --network http://localhost:8545
# 185
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
