# Dashboard Deployment Guide

## Prepare Blockchain Information

- Network endpoints and contracts information

```bash
ICON_API_URL=https://btp.net.solidwallet.io/api/v3
ICON_NETWORK_ID=
ICON_FAS_ADDRESS=
ICON_BMC_ADDRESS=
ICON_NATIVE_COIN_BSH_ADDRESS=

MOONBEAM_API_URL=https://rpc.testnet.moonbeam.network
MOONBEAM_NETWORK_ID=
MOONBEAM_BSH_CORE_ADDRESS=
MOONBEAM_BMC_ADDRESS=
MOONBEAM_BMC_MANAGEMENT_ADDRESS=
```

- Network explorers

```
https://moonbase-blockscout.testnet.moonbeam.network
https://btp.tracker.solidwallet.io
```

- Block numbers (of each network) where deployment started
- Registered relays (tx/tx result/tx receipt)
- Moonbeam contract ABI files (BMCManagement.json, BSHCore.json, BSHPeriphery.json, ERC20.json)

Ref: https://github.com/icon-project/btp/blob/icondao/doc/deployment.md

# Moonbeam tokens
0x1abea0a03be823bd172c04b4b68dc1d9b8ed45db43b4c12ef262eac1cb6f66bb

eth abi:add bshcore abi.bsh_core.json
eth contract:call --network https://rpc.testnet.moonbeam.network bshcore@0x2a17B6814a172419a5E84d7B746aBEb95a84E76B "coinNames()"
eth contract:call --network https://rpc.testnet.moonbeam.network bshcore@0x2a17B6814a172419a5E84d7B746aBEb95a84E76B "coinId('ICX')"

# Alice hx520c1c75b51e310fe5e9130a2c8d66fcb8d2a4df
# Bob
https://moonbase-blockscout.testnet.moonbeam.network/address/0xD07d078373bE60dd10e35f352559ef1f25029DAf/transactions

# ICON tokens
goloop rpc --uri https://btp.net.solidwallet.io/api/v3/ sendtx call --to cx047d8cd08015a75deab90ef5f9e0f6878d5563bd --method register --param _name=DEV --key_store godWallet.json --key_password gochain --nid 0x42 --step_limit 3519157719

goloop rpc --uri https://btp.net.solidwallet.io/api/v3/ txresult 0xa6cacdc4a8783f62dd981999f3ab7c08340618c8f01e8f5c84369e15c72831d9

goloop rpc call --uri https://btp.net.solidwallet.io/api/v3 --to cx047d8cd08015a75deab90ef5f9e0f6878d5563bd --method coinId --param _coinName=DEV

goloop rpc --uri https://btp.net.solidwallet.io/api/v3/ sendtx call --to cx047d8cd08015a75deab90ef5f9e0f6878d5563bd --method register --param _name=BTC --key_store godWallet.json --key_password gochain --nid 0x42 --step_limit 3519157719

goloop rpc --uri https://btp.net.solidwallet.io/api/v3/ txresult 0x41845171790b40df01dd2838e39569020ff24498034ac5c54eaeb28e33488d39

# ICON relay
goloop rpc --uri https://btp.net.solidwallet.io/api/v3/ sendtx call --to cx11a5a7510b128e0ab16546e1493e38b2d7e299c3 --method addRelay --param _link=btp://0x507.pra/0x3e525eD7a82B87bE30cdADE89d32204cA0F1C356 --param _addr=hx2dbd4f999f0e6b3c017c029d569dd86950c23104 --key_store godWallet.json --key_password gochain --nid 0x42 --step_limit 3519157719

goloop rpc --uri https://btp.net.solidwallet.io/api/v3/ txresult 0xdabca08cf388c374bf61e05dd32a2d6bde0f37e2d1225a447a144662ecc73b13

# ABI

```bash
cat BMCManagement.json | jq '.abi' > abi.bmc_management.json
cat BSHCore.json | jq '.abi' > abi.bsh_core.json
cat BSHPeriphery.json | jq '.abi' > abi.bsh_periphery.json
cat ERC20.json | jq '.abi' > abi.erc20.json
```

## Configure System

```bash
timedatectl list-timezones
sudo timedatectl set-timezone Asia/Ho_Chi_Minh
```

```bash
sudo ufw status
sudo ufw default allow outgoing
sudo ufw default deny incoming
sudo ufw allow ssh

# API
sudo ufw allow 8000/tcp

# indexer
sudo ufw allow 8080/tcp

# checking status
sudo ufw enable
sudo ufw status
```

```bash
sudo apt install cron
sudo systemctl enable cron
crontab -e

sudo apt install jq

# indexer
sudo apt-get install gcc g++ make
```

Creating SSH keys on Ubuntu and add them to your GitHub account to be able to clone code.

```bash
ls -l ~/.ssh/id_*.pub
ssh-keygen -t rsa -b 4096 -C "your_email@domain.com"
cat ~/.ssh/id_rsa.pub
```

## Setup Database

Connect to database using a PGAdmin browser.

Create new database name: `icon_moonbeam1`, login: `dashboard`, added as a member of `postgres` role.

Create database schema with `tables.sql`

Initialize database with `initial-data.sql` and blockchain information: `indexer_stats`, `networks`, `registered_tokens`, `token_prices`

## Setup Application

### Software Requirements

[NodeJS](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)
Yarn `sudo npm i -g yarn`
PM2 `sudo npm i -g pm2`

#### API (.101)

#### Indexer (.131)

```bash
sudo npm i -g eth-cli
sudo npm i -g eth-keys

curl -L -o go1.16.8.linux-amd64.tar.gz https://golang.org/dl/go1.16.8.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.16.8.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
go version

go install github.com/icon-project/goloop/cmd/goloop@v0.9.7
export PATH=$PATH:/home/ubuntu/go/bin
goloop version
```

### Install Apps

```bash
# nano ~/.bashrc
export DASHBOARD_HOME=/home/ubuntu/apps

mkdir apps
git clone git@github.com:icon-project/btp-dashboard.git
git checkout v0.1.2 # use latest stable tag
```

### Configuration Apps

- Create test accounts
- Test transfers with CLI
- Update `.env` files (dashboard-api and block-indexer).
- Test API: `dashboard-api/scripts/test_all.sh`
- Update contract ABIs: `block-indexer/src/modules/web3-indexer/abi/moonbeam`
- Build

### Running Apps

```bash
yarn start:pm2
```

After all apps are running with PM2, follow this to [configure restart script](https://pm2.keymetrics.io/docs/usage/startup/).

### Testing Apps

- Test transfers with CLI
- Test API: `dashboard-api/scripts/test_all.sh`

## References

https://docs.moonbeam.network/builders/get-started/moonbase/#wss-dns
