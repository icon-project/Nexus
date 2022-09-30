#!/bin/sh

# chmod +x test_transfers.sh
# scp scripts/test_transfers.sh ubuntu@54.251.114.18:testnet/btp/docker-compose/goloop2moonbeam
# set -x

# PRECISION=18
# COIN_UNIT=$((10 ** $PRECISION))
# printf '%d' 0x140
# echo $((0x16345785D8A0000))

ALICE_ADDRESS=hxdd7cc765bb90ef63fca515e362feb3cce3f63ec7
ALICE_BTP_ADDRESS=btp://$ICON_NETWORK_ID.icon/$ALICE_ADDRESS
# ALICE_SECRET=
ALICE_KS=vova.json
BOB_ADDRESS=0x87a8804BDC1Fe3bC1ad703F61685934E7b348413
BOB_BTP_ADDRESS=btp://$MOONBEAM_NETWORK_ID.pra/$BOB_ADDRESS
# BOB_PK=
DEV_IRC2_ADDRESS=cx6ea23146cedff04e93462f067765bd150d8f24b5
ICX_ERC20_ADDRESS=0x7b329aA204fe2c790f714C5A25123bb2DaC86632

echo Alice sends 0.1 ICX to Bob

goloop rpc sendtx call --uri $ICON_API_URL --to $ICON_NATIVE_COIN_BSC_BSH_ADDRESS --method transferNativeCoin \
  --param _to=$BOB_BTP_ADDRESS --value=100000000000000000 \
  --key_store $ALICE_KS --key_password $ALICE_SECRET --step_limit 10000000000 --nid $ICON_NETWORK_ID

sleep 1s

echo Alice sends 0.1 DEV to Bob

goloop rpc sendtx call --uri $ICON_API_URL --to $DEV_IRC2_ADDRESS --method approve \
  --param spender=$ICON_NATIVE_COIN_BSC_BSH_ADDRESS --param amount=100000000000000000 \
  --key_store $ALICE_KS --key_password $ALICE_SECRET --step_limit 10000000000 --nid $ICON_NETWORK_ID

sleep 1s

goloop rpc call --uri $ICON_API_URL --to $DEV_IRC2_ADDRESS --method allowance \
  --param owner=$ALICE_ADDRESS --param spender=$ICON_NATIVE_COIN_BSC_BSH_ADDRESS

goloop rpc sendtx call --uri $ICON_API_URL --to $ICON_NATIVE_COIN_BSC_BSH_ADDRESS --method transfer \
  --param _to=$BOB_BTP_ADDRESS --param _coinName=DEV --param _value=100000000000000000 \
  --key_store $ALICE_KS --key_password $ALICE_SECRET --step_limit 10000000000 --nid $ICON_NETWORK_ID

sleep 1s

echo Bob sends 0.1 DEV to Alice

# eth address:balance --network $MOONBEAM_API_URL $BOB_ADDRESS

eth contract:send --network $MOONBEAM_API_URL bshcore@$MOONBEAM_BSH_CORE_ADDRESS "transferNativeCoin('$ALICE_BTP_ADDRESS')" \
  --pk $BOB_PK --value 100000000000000000 | jq -r

sleep 1s

echo Bob sends 0.1 ICX to Alice

eth contract:send --network $MOONBEAM_API_URL erc20@$ICX_ERC20_ADDRESS "approve('$MOONBEAM_BSH_CORE_ADDRESS', '100000000000000000')" \
  --pk $BOB_PK | jq -r

sleep 1s

eth contract:call --network $MOONBEAM_API_URL erc20@$ICX_ERC20_ADDRESS "allowance('$BOB_ADDRESS', '$MOONBEAM_BSH_CORE_ADDRESS')"

eth contract:send --network $MOONBEAM_API_URL bshcore@$MOONBEAM_BSH_CORE_ADDRESS "transfer('ICX', '100000000000000000', '$ALICE_BTP_ADDRESS')" \
  --pk $BOB_PK | jq -r
