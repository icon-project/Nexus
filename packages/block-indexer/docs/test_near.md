```bash
scp defi.wasm ubuntu@54.251.114.18:temp
scp fungible_token.wasm ubuntu@54.251.114.18:temp

NEAR_ID=tiendq.testnet

near deploy --wasmFile fungible_token.wasm --accountId $NEAR_ID

# https://explorer.testnet.near.org/transactions/2GH2QiBTpQXZvocmTwMnJkjvZ78d9X1NtmAnVB4kgMxz

TOTAL_SUPPLY=$((10 ** 18))

near call $NEAR_ID new '{"owner_id": "'$NEAR_ID'", "total_supply": "'$TOTAL_SUPPLY'", "metadata": { "spec": "ft-1.0.0", "name": "tiendq Example Token", "symbol": "TIENDQ", "decimals": 8 }}' --accountId $NEAR_ID

# https://explorer.testnet.near.org/transactions/C2UovYwbahFCFd5LTDPcMGjqsrm1Mv7QPAzYrsvbqTYR

near view $NEAR_ID ft_metadata

near create-account bob.$NEAR_ID --masterAccount $NEAR_ID --initialBalance 10
near call $NEAR_ID storage_deposit '' --accountId bob.$NEAR_ID --amount 0.5
# https://explorer.testnet.near.org/transactions/7qxaRgqCxnmHNULH5FzHUA8uJkqDBicEZVgCp1qMYm26
near view $NEAR_ID ft_balance_of '{"account_id": "'bob.$NEAR_ID'"}'
near call $NEAR_ID ft_transfer '{"receiver_id": "'bob.$NEAR_ID'", "amount": "10"}' --accountId $NEAR_ID --amount 0.000000000000000000000001
# https://explorer.testnet.near.org/transactions/CYF8drbL9UiSBst2PrNcoy4DDgd96bXvzvL7nxScp9qZ

# block -> chunk -> tx
curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "block", "params": { "block_id": "9rRDD9diZHdQKKsesDWwo6rBJ1tejDTKFC5Xs2eDDomG" }}' https://rpc.testnet.near.org | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chunk", "params": { "chunk_id": "27NFZY7oVJs5Zh8VzixnabETpATz95fFjh8vTt6u8JX7" }}' https://rpc.testnet.near.org | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "tx", "params": ["CYF8drbL9UiSBst2PrNcoy4DDgd96bXvzvL7nxScp9qZ", "tiendq.testnet"]}' https://rpc.testnet.near.org | jq
```
