#!/bin/sh
# chmod +x get_bsc_config.sh
# scp scripts/get_bsc_config.sh ubuntu@18.141.139.244:testnet/btp/devnet/docker/icon-bsc

set -x

# cd testnet/btp/devnet/docker/icon-bsc/work
cd work

sudo chmod a+r *

cat btp.icon
cat btp.bsc
cat bmc.icon
cat bmc.bsc
cat bmc.periphery.bsc
cat nativebsh.icon
cat bsh.core.bsc
cat token_bsh.icon
cat token_bsh.proxy.bsc

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat nativebsh.icon) --method coinId --param _coinName=BNB

eth abi:add bshcore abi/BSHCore.json
eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "coinId('ICX')"

echo Information for FE

cat irc2_token.icon
cat alice.ks.json
cat alice.secret
cat bob.ks.json
cat bob.secret
cat btp.icon
cat btp.bsc

cd ..
