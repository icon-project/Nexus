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

```bash
sudo apt-get install gcc g++ make
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

[Go](https://golang.org/doc/install)

```bash
curl -L -o go1.16.8.linux-amd64.tar.gz https://golang.org/dl/go1.16.8.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.16.8.linux-amd64.tar.gz

go install github.com/icon-project/goloop/cmd/goloop@v0.9.7
```

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

go mod download github.com/ethereum/go-ethereum
go mod tidy
make

cd devnet/docker/icon-bsc
make build
make run
```

And please keep an eye on the btp-icon logs, cause untill "Provision is now complete" there should be no errors.

### Clean up

```bash
cd devnet/docker/icon-bsc
make remove

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
# 1051
eth block:number --network http://localhost:8545
# 354

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "icx_getLastBlock"}' http://localhost:9080/api/v3/icon | jq
```

### Transfer scripts

## Issues

eth transaction:get --network http://localhost:8545 0x05cc036f0da8b3b660de629e6f01f1667998d47d5191b8cf5ed8e6fadd4a8b3a
