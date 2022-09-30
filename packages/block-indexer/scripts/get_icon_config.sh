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

cat tx.icon.registerCoin
goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat nativeCoinBsh.icon) --method coinId --param _coinName=DEV

cat tx.moonbeam.registerICX
eth abi:add bshcore abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat bsh_core.moonbeam) "coinId('ICX')"

add_relay_icon=$(goloop rpc txresult $(cat tx.icon.addRelay) --uri http://localhost:9080/api/v3/icon | jq -r .blockHeight)
printf '%d\n' $add_relay_icon

eth transaction:get --network http://localhost:9933 $(cat tx.moonbeam.addRelay)  | jq -r .blockNumber

cd ..
