# BSC Local Testnet Deployment

## General

[Deployment guide](https://github.com/icon-project/btp/blob/btp_web3labs/doc/bsc-guide.md)
[Transfer guide](https://github.com/icon-project/btp/blob/btp_web3labs/doc/token-transfer-guide.md)

## Requirements

goloop branch `v0.9.7`

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

## Deployment

### 1. Build goloop image

https://github.com/icon-project/btp/blob/btp_web3labs/doc/bsc-guide.md#build-goloop

### 2. Build BSC containers

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
make run-bsc
make run
```

And please keep an eye on the btp-icon logs, cause untill "Provision is now complete" there should be no errors.

### 3. Clean up

```bash
# auto
cd devnet/docker/icon-bsc
sudo make remove

# clean up all manually
cd ~/testnet/btp/devnet/docker/icon-bsc && docker-compose down
sudo rm -rf data
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
# 1204
eth block:number --network http://localhost:8545
# 423

# sudo chmod a+r *

# Alice ICX 0
goloop rpc balance $(cat alice.ks.json | jq -r .address) --uri http://localhost:9080/api/v3/icon

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat nativebsh.icon) --method coinId --param _coinName=BNB

# Alice BNB 0.989999999999950000
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat irc31.icon) --method balanceOf --param _owner=$(cat alice.ks.json | jq -r .address) --param _id=0x7b385445bb7e500a20f3b211e9f1a1ee74affc96409fe693a9c6273b81b002bb

# Alice ETH 0.990000000000000000
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat irc2_token.icon) --method balanceOf --param _owner=$(cat alice.ks.json | jq -r .address)

# Bob BNB 9999998.9773834
eth address:balance $(cat bob.ks.json | jq -r .address)

eth abi:add bshcore abi/BSHCore.json
eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "coinId('ICX')"

# Bob ICX 9.900000000000000000
eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "getBalanceOf('$(cat bob.ks.json | jq -r .address)', 'ICX')"

eth abi:add bep20token abi/BEP20TKN.json

# Bob ETH 9.900000000000000000
eth contract:call --network http://localhost:8545 bep20token@$(cat bep20_token.bsc) "balanceOf('0x$(cat bob.ks.json | jq -r .address)')"
```

```bash
# Deposit 1M ICX to Alice: 1000000000000000000000000
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon \
  --to $(cat alice.ks.json | jq -r .address) --value 0xd3c21bcecceda1000000 \
  --key_store goloop.keystore.json --key_password $(cat goloop.keysecret) --step_limit 10000000000 --nid 0xbe04ab

# How to transfer ETH?
# https://github.com/icon-project/btp-dashboard/issues/382#issuecomment-966881348

# Deposit 1M ETH to Alice: 1000000000000000000000000 0xd3c21bcecceda1000000
# 1 ETH = 0xDE0B6B3A7640000
# 10 ETH = 0xDE0B6B3A7640000
# 1000 ETH = 0x3635C9ADC5DEA00000
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat irc2_token.icon) --method transfer \
  --param _to=$(cat alice.ks.json | jq -r .address) --param _value=0xDE0B6B3A7640000 \
  --key_store goloop.keystore.json --key_password $(cat goloop.keysecret) --step_limit 10000000000 --nid 0xbe04ab

# Alice deposits 0.1 ETH to BSH
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat irc2_token.icon) --method transfer \
  --param _to=$(cat token_bsh.icon) --param _value=0x16345785D8A0000 \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid 0xbe04ab

# Alice send Bob 0.1 ETH
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat token_bsh.icon) --method transfer \
  --param tokenName=ETH --param value=0x16345785D8A0000 \
  --param to=btp://0x97.bsc/0x$(cat bob.ks.json | jq -r .address) \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid 0xbe04ab
```
