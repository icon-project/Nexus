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
curl -L -o go1.17.1.linux-amd64.tar.gz https://golang.org/dl/go1.17.1.linux-amd64.tar.gz

go install github.com/icon-project/goloop/cmd/goloop@v0.9.7

For install commands: https://github.com/icon-project/btp/tree/icondao/docker-compose/goloop2moonbeam

## Build

### 1. Build goloop image.

### 2. Build Binance Smart Chain docker

https://github.com/icon-project/btp/tree/btp_web3labs/devnet

git clone -b btp_web3labs https://github.com/icon-project/btp
cd btp
docker build --tag bsc-node ./devnet/docker/bsc-node --build-arg KEYSTORE_PASS=Perlia0
bsc-node image created but this is an [error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-920558438)

go mod download github.com/ethereum/go-ethereum
make
[error](https://github.com/icon-project/btp-dashboard/issues/308#issuecomment-920561474)

===

once everything starts, the icon-bsc node will take some time to provision, once all the containers are up, you can get the keystores from the devnet/work folder.
bsc.ks.json - for Binancesmartchain

btp-icon container might take sometime, it usually takes around 15 minutes, but certainly not an hour or so.
To check if the btp-icon container is started, you can check the logs to see if "provision is now complete" is present.

"please try to manually stop and start the "btp-icon" container from the docker dashboard. and see if it tries to connect to goloop then.

// to fix some icon docker issues https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916589551
Yes, I resolved this problem by remove folder work and run docker-compose up -d again, so now I'm stuck with the token guide

verify JSON files https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916687302
Could you also please verify if other folders "bmc"& "bmv" under /contracts/solidity has build folder?
also if you can confirm if "Funding BSH" logs present at the end of the provision

generate missing files https://github.com/icon-project/btp-dashboard/issues/273#issuecomment-916700815

- clean up
You can use these commands to clean

docker-compose down
rm -rf work/*
docker rmi -f icon-bsc_btp-icon

And please keep an eye on the btp-icon logs, cause untill "Provision is now complete" there should be no errors
