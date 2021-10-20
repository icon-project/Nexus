#!/bin/sh
# chmod +x get_icon_config.sh
# scp scripts/get_icon_config.sh ubuntu@54.251.114.18:testnet/btp/docker-compose/goloop2moonbeam

set -x

# cd testnet/btp/docker-compose/goloop2moonbeam
cd config

cat btp.icon
cat btp.moonbeam
cat bmc.icon
cat bmc.moonbeam
cat bmc_management.moonbeam
cat nativeCoinBsh.icon
cat bsh_core.moonbeam

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat nativeCoinBsh.icon) --method coinId --param _coinName=DEV

eth abi:add bshcore abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat bsh_core.moonbeam) "coinId('ICX')"

cd ..
