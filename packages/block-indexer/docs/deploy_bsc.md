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

## Issues

```json
tx.token.icon_bsc.transfer

Transfering 10000000000000000000 wei to: 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d from: hx0cfacd4a8abcfc5a429a1c802ccc5e5b893be979

{
  "to": "cxf46155efa2a0ff0545022981bf7ff2fb1f74823e",
  "cumulativeStepUsed": "0x2fbf7",
  "stepUsed": "0x2fbf7",
  "stepPrice": "0x0",
  "eventLogs": [
    {
      "scoreAddress": "cx26bf736f50ba0657aef59ee6afff1b2fb667cf8a",
      "indexed": [
        "Message(str,int,bytes)",
        "btp://0x97.bsc/0xAaFc8EeaEE8d9C8bD3262CCE3D73E56DeE3FB776",
        "0x2"
      ],
      "data": [
        "0xf8fdb83e6274703a2f2f30786433356262622e69636f6e2f637832366266373336663530626130363537616566353965653661666666316232666236363763663861b8396274703a2f2f307839372e6273632f30784161466338456561454538643943386244333236324343453344373345353644654533464237373688546f6b656e42534801b876f87400b871f86faa687830636661636434613861626366633561343239613163383032636363356535623839336265393739aa307837306537383964326635643436396561333065303532356462666464353531356436656164333064d8d78345544889008963dd8c2c5e000088016345785d8a0000"
      ]
    },
    {
      "scoreAddress": "cxf46155efa2a0ff0545022981bf7ff2fb1f74823e",
      "indexed": [
        "TransferStart(Address,str,int,bytes)",
        "hx0cfacd4a8abcfc5a429a1c802ccc5e5b893be979"
      ],
      "data": [
        "btp://0x97.bsc/0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d",
        "0x1",
        "0xd8d78345544889008963dd8c2c5e000088016345785d8a0000"
      ]
    }
  ],
  "logsBloom": "0x000000000000000000001000000000000...",
  "status": "0x1",
  "blockHash": "0x0b23d045d35ce1b065fa8c3a94f5c645a3a0768cee2898c21ff4219d38d11886",
  "blockHeight": "0x258",
  "txIndex": "0x0",
  "txHash": "0xf9d1233dd26399efab32cce6c08fc4ebdf802d41f3db16434c3a396bec683a6c"
}

tx.native.icon_bsc.transfer

Transfer 10.000000000000000000 ICX from Alice to Bob
goloop height:643 hash:0x3eab8a76a831dd7644143378c2b1cffec42c7eb02a8b2aab682f7464120e1718
0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d
0x97.bsc,10000000000000000000

{
  "to": "cxc342ced7ece210531ff9373a29a18cbf092a4e4f",
  "cumulativeStepUsed": "0x3a121",
  "stepUsed": "0x3a121",
  "stepPrice": "0x0",
  "eventLogs": [
    {
      "scoreAddress": "cx26bf736f50ba0657aef59ee6afff1b2fb667cf8a",
      "indexed": [
        "Message(str,int,bytes)",
        "btp://0x97.bsc/0xAaFc8EeaEE8d9C8bD3262CCE3D73E56DeE3FB776",
        "0x3"
      ],
      "data": [
        "0xf8f6b83e6274703a2f2f30786433356262622e69636f6e2f637832366266373336663530626130363537616566353965653661666666316232666236363763663861b8396274703a2f2f307839372e6273632f3078416146633845656145453864394338624433323632434345334437334535364465453346423737368a6e6174697665636f696e01b86df86b00b868f866aa687830636661636434613861626366633561343239613163383032636363356535623839336265393739aa307837306537383964326635643436396561333065303532356462666464353531356436656164333064cfce8349435889008963dd8c2c5e0000"
      ]
    },
    {
      "scoreAddress": "cxc342ced7ece210531ff9373a29a18cbf092a4e4f",
      "indexed": [
        "TransferStart(Address,str,int,bytes)",
        "hx0cfacd4a8abcfc5a429a1c802ccc5e5b893be979"
      ],
      "data": [
        "btp://0x97.bsc/0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d",
        "0x1",
        "0xd8d78349435889008963dd8c2c5e000088016345785d8a0000"
      ]
    }
  ],
  "logsBloom": "0x000000000000000000000000000000000...",
  "status": "0x1",
  "blockHash": "0x567871a5f5888009a07f1cf27ecb1c22f482c23ccfe95ad611c3022a5c9b1c0b",
  "blockHeight": "0x284",
  "txIndex": "0x0",
  "txHash": "0x5ee075016ba04bf810dc97d9ed067d4700d5d9d22aa33ca94b22e4ec88a221fd"
}

tx.token.bsc_icon.transfer

Init BTP transfer of 1000000000000000000 wei to btp://0xd35bbb.icon/hx0cfacd4a8abcfc5a429a1c802ccc5e5b893be979

{
  tx: '0x27e18eeb082e517e105a350076af52528e176bf28664bd5d66732182c24475c3',
  receipt: {
    blockHash: '0x83af41a6dba6fb6bb5e69b466eb34e642cb8a197bb8a210bed6c8f48c829ac61',
    blockNumber: 233,
    contractAddress: null,
    cumulativeGasUsed: 551280,
    from: '0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d',
    gasUsed: 551280,
    logs: [],
    logsBloom: '0x0000000200000000000000000...',
    status: true,
    to: '0x71a1520bbb7e6072bbf3682a60c73d63b693690a',
    transactionHash: '0x27e18eeb082e517e105a350076af52528e176bf28664bd5d66732182c24475c3',
    transactionIndex: 0,
    rawLogs: [ [Object], [Object], [Object], [Object] ]
  },
  logs: []
}

tx.native.bsc_icon.transfer

Init BTP native transfer of 1000000000000000000 wei to btp://0xd35bbb.icon/hx0cfacd4a8abcfc5a429a1c802ccc5e5b893be979

{
  tx: '0x05cc036f0da8b3b660de629e6f01f1667998d47d5191b8cf5ed8e6fadd4a8b3a',
  receipt: {
    blockHash: '0x1da5107cf9f5e26c015533c2795837d53a30fcfa97e23feb934fd0bdd8606f08',
    blockNumber: 246,
    contractAddress: null,
    cumulativeGasUsed: 535430,
    from: '0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d',
    gasUsed: 535430,
    logs: [],
    logsBloom: '0x0000000200000000000000000...',
    status: true,
    to: '0x8c2e5fc5d651129ce7296847dcfac62c646e4e3d',
    transactionHash: '0x05cc036f0da8b3b660de629e6f01f1667998d47d5191b8cf5ed8e6fadd4a8b3a',
    transactionIndex: 0,
    rawLogs: [ [Object], [Object] ]
  },
  logs: []
}
```

eth transaction:get --network http://localhost:8545 0x05cc036f0da8b3b660de629e6f01f1667998d47d5191b8cf5ed8e6fadd4a8b3a

scp ssh ubuntu@18.141.139.244:testnet/btp/devnet/docker/icon-bsc/work/abi/BMCManagement.json ~/Public
scp ssh ubuntu@18.141.139.244:testnet/btp/devnet/docker/icon-bsc/work/abi/BSHCore.json ~/Public
scp ssh ubuntu@18.141.139.244:testnet/btp/devnet/docker/icon-bsc/work/abi/BSHPeriphery.json ~/Public
