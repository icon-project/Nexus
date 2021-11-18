#!/bin/sh
# chmod +x test_transfer_bsc.sh
# scp scripts/test_transfer_bsc.sh ubuntu@18.141.139.244:testnet/btp/devnet/docker/icon-bsc

set -x

# cd ~/testnet/btp/devnet/docker/icon-bsc/work
cd work

alice_btp_address=btp://$(cat net.btp.icon)/$(cat alice.ks.json | jq -r .address)
bob_btp_address=btp://0x97.bsc/0x$(cat bob.ks.json | jq -r .address)
bob_pk=0xfd52d799e21ad6d35a4e0c1679fd82eecbe3e3ccfdeceb8a1eed3a742423f688

echo 1. Alice sends 1 ICX to Bob

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat nativebsh.icon) --method transferNativeCoin \
  --param _to=$bob_btp_address --value 1000000000000000000 \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

sleep 5s
echo 2. Alice sends 0.1 BNB to Bob

#goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
#  --to $(cat irc31.icon) --method setApprovalForAll \
#  --param _operator=$(cat nativebsh.icon) --param _approved=0x1 \
#  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat nativebsh.icon) --method transfer \
  --param _to=$bob_btp_address --param _value=100000000000000000 \
  --param _coinName=BNB \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

sleep 5s
echo 3. Alice sends 0.1 ETH to Bob

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat irc2_token.icon) --method transfer \
  --param _to=$(cat token_bsh.icon) --param _value=0x16345785D8A0000 \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon --to $(cat token_bsh.icon) --method transfer \
  --param tokenName=ETH --param value=0x16345785D8A0000 \
  --param to=$bob_btp_address \
  --key_store alice.ks.json --key_password $(cat alice.secret) --step_limit 10000000000 --nid $(cat nid.icon)

sleep 5s
echo 4. Bob sends 1 BNB to Alice

encoded_data=$(eth method:encode abi/BSHCore.json "transferNativeCoin('$alice_btp_address')")

eth transaction:send --network http://localhost:8545 \
  --pk $bob_pk \
  --gas 16721975 \
  --to $(cat bsh.core.bsc) \
  --data $encoded_data \
  --value 0x16345785D8A0000 | jq -r

sleep 5s
echo 5. Bob sends 0.1 ICX to Alice

encoded_data=$(eth method:encode abi/BSHCore.json "transfer('ICX', '0x16345785D8A0000', '$alice_btp_address')")

eth transaction:send --network http://localhost:8545 \
  --pk $bob_pk \
  --gas 6721975 \
  --to $(cat bsh.core.bsc) \
  --data $encoded_data | jq -r

sleep 5s
echo 6. Bob sends 1 ETH to Alice

encoded_data=$(eth method:encode abi/BEP20TKN.json "transfer('$(cat token_bsh.proxy.bsc)', '0x16345785D8A0000')")

eth transaction:send --network http://localhost:8545 \
  --pk $bob_pk \
  --gas 6721975 \
  --to $(cat bep20_token.bsc) \
  --data $encoded_data | jq -r

encoded_data=$(eth method:encode abi/BSHProxy.json "transfer('ETH', '0x16345785D8A0000', '$alice_btp_address')")

eth transaction:send --network http://localhost:8545 \
  --pk $bob_pk \
  --gas 6721975 \
  --to $(cat token_bsh.proxy.bsc) \
  --data $encoded_data | jq -r

cd ..
