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

```bash
# make alice_transfer_eth
docker-compose exec btp-icon sh /btpsimple/bin/transfer_eth.sh


Step 1: creating/ensuring Alice keystore
alice.ks.json


Step 2: Transfer 10 ETH Tokens to Alice
10000000000000000000


Step 3: Alice Deposits 10 ETH Tokens into BSH
alice.ks.json


Step 4: Bob's ETH balance before Deposit
> Warning: possible unsupported (undocumented in help) command line option: --method,--addr
Using network 'bscDocker'.

Balance: 9900


Step 5: Alice Initiates BTP token transfer of 10 ETH to BOB
alice.ks.json


Step 6: Bob's ETH balance after Deposit
Checking Bob's Balance after BTP transfer:
.
BTP Transfer Successfull!
Bob's Balance after BTP transfer: > Warning: possible unsupported (undocumented in help) command line option: --method,--addr
Using network 'bscDocker'.

Balance: 9909.9 ETH

# make alice_transfer_icx
docker-compose exec btp-icon sh /btpsimple/bin/transfer_icx.sh
alice.ks.json


Step 1: creating/ensuring Alice keystore
alice.ks.json


Step 2: Deposit 10.000000000000000000 ICX to Alice account


Step 3 Bob's balance before BTP Native transfer
> Warning: possible unsupported (undocumented in help) command line option: --method,--addr,--name
Using network 'bscDocker'.

0


Step 4: Alice Initiates BTP Native transfer of 10.000000000000000000 ICX to BOB
alice.ks.json


Step 5: Bob's ICX balance after Deposit
Checking Bob's Balance after BTP transfer
.
 BTP Native Transfer Successfull!
Bob's Balance after BTP Native transfer: > Warning: possible unsupported (undocumented in help) command line option: --method,--addr,--name
Using network 'bscDocker'.

9.9

# make bob_transfer_eth
docker-compose exec btp-icon sh /btpsimple/bin/transfer_eth_bsc.sh


Step 1: creating/ensuring Alice keystore
alice.ks.json


Step 2: Approve BSH to use Bob's funds for 1 ETH> Warning: possible unsupported (undocumented in help) command line option: --method,--addr,--amount
Using network 'bscDocker'.

Approving BSH to use Bob's tokens


Step 3: Alice's ETH balance before BTP Transfer
Balance: 0
> Warning: possible unsupported (undocumented in help) command line option: --method,--amount
Using network 'bscDocker'.

amount:990000000000000000
fee:10000000000000000


Step 4: BOB Initiates BTP token transfer of 1 ETH to Alice


Step 5: Alice ETH Balance after BTP token transfer
. Checking Alice's balance...
Balance: .990000000000000000

# make bob_transfer_bnb
docker-compose exec btp-icon sh /btpsimple/bin/transfer_bnb_bsc.sh
alice.ks.json


Step 1: creating/ensuring Alice keystore
alice.ks.json


Step 2: Alice's BNB balance before BTP Transfer
Alice Balance: 0 (BNB)


Step 3: BOB Initiates BTP Native coin transfer of 1 (BNB) to Alice


Step 4: Alice ETH Balance after BTP token transfer
BNB. Checking Alice's balance...
Alice Balance: .989999999999950000 (BNB)
```

```bash
goloop rpc balance hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c --uri http://localhost:9080/api/v3/icon
# 0
eth address:balance 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d
# 9999999.178615693
```

scp ssh ubuntu@18.141.139.244:temp/btp-icon.log ~/Public

## Issues
