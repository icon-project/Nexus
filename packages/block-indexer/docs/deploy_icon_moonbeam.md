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

# Deploy

Get container logs:

```bash
docker logs -f g2m_btp_moonbeam &> g2m_btp_moonbeam.log &
docker logs -f g2m_btp_icon &> g2m_btp_icon.log &
scp ssh ubuntu@54.251.114.18:temp/g2m_btp_moonbeam.log ~/Public
scp ssh ubuntu@54.251.114.18:temp/g2m_btp_icon.log ~/Public
```

Get Solidity contracts ABI:

```bash
$ docker exec -it g2m_btp_moonbeam bash
bash-5.0# cd ../contracts/solidity/bmc/build/contracts
bash-5.0# cat BMCPeriphery.json | jq -r .abi
bash-5.0# cd ../../../bsh/build/contracts
bash-5.0# cat BSHPeriphery.json | jq -r .abi
```

### Configuration

- Update tables: indexer_stats, networks, registered_tokens
- Update contract ABIs
- Build

## Test

### Checks

```bash
# Deposit 1 million to Alice: 1000000000000000000000000
# https://www.rapidtables.com/convert/number/decimal-to-hex.html
goloop rpc sendtx transfer --uri http://localhost:9080/api/v3/icon \
  --to $(cat alice.ks.json | jq -r .address) --value 0xd3c21bcecceda1000000 \
  --key_store goloop.keystore.json --key_password gochain --step_limit 10000000000 --nid 0x58eb1c

# Deposit 1 million to Bob from MOONBEAM_PREFUND_PK
eth transaction:send --network http://localhost:9933 \
  --pk 39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68 \
  --gas 6721975 \
  --to $(cat bob.account | jq -r .address) \
  --value 0xd3c21bcecceda1000000
```

```bash
# Alice ICX
goloop rpc balance $(cat alice.ks.json | jq -r .address) --uri http://localhost:9080/api/v3/icon | jq -r
# 0x17778612664bdf7a310 = 6926.203284212499 (divided by 1000000000000000000)

# Alice DEV
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat nativeCoinBsh.icon) --method coinId --param _coinName=DEV
# coin ID used in next command

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat irc31token.icon) --method balanceOf --param _owner=$(cat alice.ks.json | jq -r .address) --param _id=0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd
# 0x853a0d2313b85ee0 = 9.5999999999995

# it doesn't work, responses 0
# goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method balanceOf --param _owner=hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab --param _coinName=DEV

# Bob DEV
eth address:balance --network http://localhost:9933 $(cat bob.account | jq -r .address)
# 50.290145195

# Bob ICX
eth abi:add bshcore abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat bsh_core.moonbeam) "getBalanceOf('0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D', 'ICX')"
# 72.96
```

### Alice to Bob

```bash
# Alice sends 1 ICX to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0xF8aC273f62F2D1D7283be823400e05Aeddc389F5 --value 1000000000000000000 \
  --key_store config/alice.ks.json --key_password $(cat ./config/alice.secret) --step_limit 10000000000 --nid 0x58eb1c

# check setApprovalForAll status
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat config/irc31token.icon) --method isApprovedForAll --param _owner=$(cat config/alice.ks.json | jq -r .address) --param _operator=$(cat config/nativeCoinBsh.icon)

# setApprovalForAll
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat config/irc31token.icon) --method setApprovalForAll \
  --param _operator=$(cat config/nativeCoinBsh.icon) --param _approved=0x1 \
  --key_store config/alice.ks.json --key_password $(cat config/alice.secret) --step_limit 10000000000 --nid 0x58eb1c

goloop rpc txresult 0x69b5cc4d7c37ecbe4fcd42a4aa3fbc53a34eef977d4f4bad03b53e4f787bbccb --uri http://localhost:9080/api/v3/icon

# Alice sends 0.1 DEV to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transfer \
  --param _to=btp://0x501.pra/0xF8aC273f62F2D1D7283be823400e05Aeddc389F5 --param _value=100000000000000000 \
  --param _coinName=DEV \
  --key_store config/alice.ks.json --key_password $(cat ./config/alice.secret) --step_limit 10000000000 --nid 0x58eb1c
```

### Bob to Alice

```bash
# Bob sends 1 DEV to Alice
encoded_data=$(eth method:encode ./config/abi.bsh_core.json "transferNativeCoin('btp://0x58eb1c.icon/hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab')")

eth transaction:send --network http://localhost:9933 \
  --pk 0xb7de716a085c14b353dec6c516c508bff76b0ac82ec96d854b9d66e58737c22e \
  --gas 6721975 \
  --to $(cat ./config/bsh_core.moonbeam) \
  --data $encoded_data \
  --value 1000000000000000000 | jq -r

# Bob sends 0.1 ICX to Alice
encoded_data=$(eth method:encode ./config/abi.bsh_core.json "transfer('ICX', '0x16345785D8A0000', 'btp://0x58eb1c.icon/hxfa47ea3eaa7ac1bebb6f9dc26a489e6759eb6dab')")

eth transaction:send --network http://localhost:9933 \
  --pk 0xb7de716a085c14b353dec6c516c508bff76b0ac82ec96d854b9d66e58737c22e \
  --gas 6721975 \
  --to $(cat ./config/bsh_core.moonbeam) \
  --data $encoded_data | jq -r
```

```bash
# https://docs.openzeppelin.com/contracts/3.x/api/token/erc1155#IERC1155-setApprovalForAll-address-bool-
# setApprovalForAll with eth-cli REPL
sudo cp abi.bsh_core.json bsh_core.json

eth repl --network http://localhost:9933 --pk $(cat bob.account | jq -r .privateKey) bsh_core.json@$(cat bsh_core.moonbeam)

bshCore.methods.isApprovedForAll('bob_address', 'bsh_core_address').call()

bshCore.methods.setApprovalForAll('bsh_core_address', true).send({ from: 'bob_address', gas: 6721975 }).then(console.log)

.exit

# real commands
bshCore.methods.isApprovedForAll('0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D', '0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963').call()

bshCore.methods.setApprovalForAll('0x7d4567B7257cf869B01a47E8cf0EDB3814bDb963', true).send({ from: '0x9FE123AC9FC29B832c2a16DD83bcE9b509B4C22D', gas: 6721975 }).then(console.log)
```

## BSC

1. Transfer Token(ETH) from ICON (Alice) -> BSC (BOB)

```bash
# deposit 10 ETH to Alice
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat work/irc2_token.icon) --method transfer \
  --param _to=$(cat work/alice.ks.json | jq -r '.address') --param _value=10000000000000000000 \
  --key_store work/goloop.keystore.json --key_password $(cat work/goloop.secret) --step_limit 10000000000 --nid 0x58eb1c

# Alice send 10 ETH to BSH
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat work/irc2_token.icon) --method transfer \
  --param _to=$(cat work/token_bsh.icon) --param _value=10000000000000000000 \
  --key_store work/alice.ks.json --key_password $(cat work/alice.secret) --step_limit 10000000000 --nid 0x58eb1c

# Alice send 10 ETH to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat work/token_bsh.icon) --method transfer \
  --param tokenName=ETH --param to=$(cat work/bsc.ks.json | jq -r '.address') --param value=10000000000000000000 \
  --key_store work/alice.ks.json --key_password $(cat work/alice.secret) --step_limit 10000000000 --nid 0x58eb1c
```
