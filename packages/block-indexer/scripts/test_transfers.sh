#!/bin/sh
# chmod +x test_transfers.sh
# scp scripts/test_transfers.sh ubuntu@54.251.114.18:testnet/btp/docker-compose/goloop2moonbeam

set -x

# cd ~/testnet/btp/docker-compose/goloop2moonbeam
cd config

# Alice sends 1 ICX to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=$(cat bob.btp.address) --value 1000000000000000000 \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

sleep 10s

# Alice sends 0.1 DEV to Bob
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat nativeCoinBsh.icon) --method transfer \
  --param _to=$(cat bob.btp.address) --param _value=100000000000000000 \
  --param _coinName=DEV \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

sleep 10s

# Bob sends 1 DEV to Alice
alice_btp=$(cat alice.btp.address)
encoded_data=$(eth method:encode abi.bsh_core.json "transferNativeCoin('$alice_btp')")

eth transaction:send --network http://localhost:9933 \
  --pk $(cat bob.account | jq -r .privateKey) \
  --gas 6721975 \
  --to $(cat bsh_core.moonbeam) \
  --data $encoded_data \
  --value 1000000000000000000 | jq -r

sleep 10s

# Bob sends 0.1 ICX to Alice
encoded_data=$(eth method:encode abi.bsh_core.json "transfer('ICX', '0x16345785D8A0000', '$alice_btp')")

eth transaction:send --network http://localhost:9933 \
  --pk $(cat bob.account | jq -r .privateKey) \
  --gas 6721975 \
  --to $(cat bsh_core.moonbeam) \
  --data $encoded_data | jq -r

cd ..
