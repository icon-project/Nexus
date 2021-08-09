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
