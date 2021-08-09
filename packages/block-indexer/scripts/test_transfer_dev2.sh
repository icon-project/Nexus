#!/bin/sh
set -e

# docker-compose exec btp_icon sh /btpsimple/scripts/test_transfer_dev.sh

PRECISION=18
COIN_UNIT=$((10 ** $PRECISION))

coin2wei() {
    amount=$1
    printf '%s * %s\n' $COIN_UNIT $amount | bc
}

wei2coin() {
    amount=$1
    printf 'scale=%s; %s / %s\n' $PRECISION $amount $COIN_UNIT | bc
}

MOONBEAM_PREFUND_PK=39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68
MOONBEAM_GAS_LIMIT=6721975
DEV_DEPOSIT_AMOUNT=$(coin2wei 10)
DEV_TRANSER_AMOUNT=$(coin2wei 1)

CONFIG_DIR=/home/ubuntu/testnet/btp/testnet/goloop2moonbeam/config
MOONBEAM_RPC_URL=http://localhost:9933

eth method:encode ../config/abi.bsh_core.json "transferNativeCoin('$(cat ../config/alice.btp.address)')" > encoded_data.txt

eth transaction:send \
  --network http://localhost:9933 \
  --pk $(cat ../config/bob.privatekey) \
  --gas 6721975 \
  --to $(cat ../config/bsh_core.moonbeam) \
  --data $(cat encoded_data.txt) \
  --value 1000000000000000000 > bob2alice.tx

eth transaction:get --network http://localhost:9933 0x4c1a1a72ec6dbb8276ae0dd9b9c4558636fe6f545e3b31af86a9f5f0d517c086 $(cat tx.transfer_dev.tiendq)

transfer_DEV_from_bob_to_alice() {
    echo "$1. Transfering $(wei2coin $DEV_TRANSER_AMOUNT) DEV from Bob to Alice"

    cd ${CONFIG_DIR}
    encoded_data=$(eth method:encode abi.bsh_core.json "transferNativeCoin('$(cat alice.btp.address)')")
    eth transaction:send \
                --network $MOONBEAM_RPC_URL \
                --pk $(cat bob.privatekey) \
                --gas $MOONBEAM_GAS_LIMIT \
                --to $(cat bsh_core.moonbeam) \
                --data $encoded_data \
                --value $DEV_TRANSER_AMOUNT | jq -r > tx.transfer_dev.tiendq
    eth transaction:get --network $MOONBEAM_RPC_URL $(cat tx.transfer_dev.tiendq) | jq -r .receipt
    get_bob_balance
}

goloop rpc call --to $(cat ../config/nativeCoinBsh.icon) --uri http://localhost:9080/api/v3/icon --method coinId --param _coinName=DEV

0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ../config/irc31token.icon) --method balanceOf --param _owner=hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262 --param _id=0x8f7ce30203eb1ff1d26492c94d9ab04d63f4e54f1f9e677e8d4a0d6daaab2dd

0x44b1eec6163e1b30

check_alice_balance_in_Goloop() {
    echo "$1. Checking Alice's balance after 10 seconds..."
    sleep 10

    cd $CONFIG_DIR
    coin_id=$(goloop rpc call \
        --to $(cat nativeCoinBsh.icon) \
        --method coinId --param _coinName=DEV | jq -r )
    echo "Alice coin_id: $coin_id"

    balance=$(goloop rpc call \
        --to $(cat irc31token.icon) \
        --method balanceOf \
        --param _owner=$(get_alice_address) \
        --param _id=$coin_id | jq -r )

    balance=$(hex2int $balance)
    balance=$(wei2coin $balance)
    echo "Alice balance: $balance (DEV)"
}

echo "This script demonstrates how to transfer a NativeCoin DEV from MOONBEAM to ICON."

transfer_DEV_from_bob_to_alice  "1"
check_alice_balance_in_Goloop   "2"
