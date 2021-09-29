#!/bin/bash
# chmod +x test_all.sh

set -x

# HOST=http://localhost:8000
# HOST=http://54.251.114.18:8000
# HOST=http://18.141.139.244:8000

# auctions

# curl $HOST/v1/auctions | jq
# curl $HOST/v1/auctions\?availableAssets=1 | jq
# curl $HOST/v1/auctions/cx51291cbe0fff966b881d251b9414e54f5a02dac7_3 | jq
# curl $HOST/v1/auctions/cx51291cbe0fff966b881d251b9414e54f5a02dac7_1/bids | jq
# curl $HOST/v1/auctions/cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e_3/bids\?limit=5 | jq
# curl $HOST/v1/auctions/cx12387cb688a2c89bcf999c3ec28ca4cb7ac08b3e_3/bids\?limit=3\&offset=3 | jq
# curl -X POST $HOST/v1/auctions -H 'Content-Type: application/json' -d '{"tokenName":"Sample2", "tokenAmount": 10.0906224229}'

# btpnetwork

curl $HOST/v1/btpnetwork | jq
curl $HOST/v1/btpnetwork\?stats=1 | jq
curl $HOST/v1/btpnetwork\?volumeLast24h=true\&mintLast24h=true | jq
curl $HOST/v1/btpnetwork/converter\?token=btc\&amount=100\&convert_to=usd | jq

# fees

# curl $HOST/v1/fees | jq
# curl $HOST/v1/fees\?availableAmountLast24h=1 | jq

# networks

curl $HOST/v1/networks | jq
curl $HOST/v1/networks/0x3 | jq
curl $HOST/v1/networks/0x501 | jq

# relay-candidates

curl $HOST/v1/relay-candidates | jq
curl $HOST/v1/relay-candidates\?page=1\&limit=3 | jq
curl $HOST/v1/relay-candidates/reward | jq

# relays

curl $HOST/v1/relays | jq
curl $HOST/v1/relays\?page=1\&limit=3 | jq

# transactions

curl $HOST/v1/transactions | jq
curl $HOST/v1/transactions\?limit=3 | jq
curl $HOST/v1/transactions\?page=1\&limit=3 | jq
curl $HOST/v1/transactions\?to=0x3 | jq
curl $HOST/v1/transactions\?from\=0x501 | jq
curl $HOST/v1/transactions\?assetName\=icx | jq
curl $HOST/v1/transactions/0x856509dc41dab3289be74348a4a0601639f165b26cd80f90bf184524826113e3 | jq
curl $HOST/v1/transactions/02c892aa-0ff5-4cc2-832b-4c7f613d983f
