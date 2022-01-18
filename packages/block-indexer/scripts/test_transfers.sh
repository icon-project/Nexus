#!/bin/sh

# chmod +x test_transfers.sh
# scp scripts/test_transfers.sh ubuntu@54.251.114.18:testnet/btp/docker-compose/goloop2moonbeam
# set -x

# PRECISION=18
# COIN_UNIT=$((10 ** $PRECISION))
# printf '%d' 0x140

ICON_API=https://berlin.net.solidwallet.io/api/v3
ICON_ID=0x7
ICON_BSH_ADDRESS=cx8a05039c1c1da936d279e276a25c4fa66154bebd
ICON_IRC2_ADDRESS=cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274
MOONBEAM_API=https://moonbeam-alpha.api.onfinality.io/public
MOONBEAM_ID=0x507
MOONBEAM_BSH=0xC0bDA7E7Cb3f0277748aF59F1c639BE7589bE4Ec
MOONBEAM_ERC20=0xC0bDA7E7Cb3f0277748aF59F1c639BE7589bE4Ec
ALICE_BTP_ADDRESS=btp://$ICON_ID.icon/hxdd7cc765bb90ef63fca515e362feb3cce3f63ec7
ALICE_SECRET=
ALICE_KS=vova.json
BOB_BTP_ADDRESS=btp://$MOONBEAM_ID.moonbeam/0x87a8804BDC1Fe3bC1ad703F61685934E7b348413
BOB_PK=

echo Alice sends 0.1 ICX to Bob

goloop rpc sendtx call --uri $ICON_API --to $ICON_BSH_ADDRESS --method transferNativeCoin \
  --param _to=$BOB_BTP_ADDRESS --value=100000000000000000 \
  --key_store $ALICE_KS --key_password $ALICE_SECRET --step_limit 10000000000 --nid $ICON_ID

sleep 5s

echo Approve

goloop rpc sendtx call --uri $ICON_API --to $ICON_IRC2_ADDRESS --method approve \
  --param spender=$ICON_BSH_ADDRESS --value=100000000000000000 \
  --key_store $ALICE_KS --key_password $ALICE_SECRET --step_limit 10000000000 --nid $ICON_ID

sleep 5s

echo Alice sends 0.1 DEV to Bob

goloop rpc sendtx call --uri $ICON_API --to $ICON_IRC2_ADDRESS --method transfer \
  --param _to=$BOB_BTP_ADDRESS --param _value=100000000000000000 \
  --key_store $ALICE_KS --key_password $ALICE_SECRET --step_limit 10000000000 --nid $ICON_ID

sleep 5s

echo Bob sends 0.1 DEV to Alice

eth contract:send --network $MOONBEAM_API bshCore@$MOONBEAM_BSH 'transferNativeCoin("$ALICE_BTP_ADDRESS")' \
  --pk $BOB_PK --value 100000000000000000 | jq -r

sleep 5s

echo Approve

eth contract:send --network $MOONBEAM_API erc20@$MOONBEAM_ERC20 'approve("$MOONBEAM_BSH", 100000000000000000)' \
  --pk $BOB_PK | jq -r

echo Bob sends 0.1 ICX to Alice

eth contract:send --network $MOONBEAM_API bshCore@$MOONBEAM_BSH 'transfer("ICX", "0x16345785D8A0000", "$ALICE_BTP_ADDRESS")' \
  --pk $BOB_PK | jq -r
