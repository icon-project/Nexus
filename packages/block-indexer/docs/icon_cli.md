## ICON

goloop rpc txbyhash 0x21e82864d512107b7541094f1466f48142fac0416497555dae6a29f81c1763b1 --uri http://localhost:9080/api/v3/icon

goloop rpc txresult 0xa6c041a0c7ec952cfbbf4c335de46051d803fecea9dcbe419c7bde8a79afcaf7 --uri http://localhost:9080/api/v3/icon

./goloop rpc blockbyhash 0x7b8275119cb9735ac04f6f1da991bb04b8a4605f5ae2bdb604ef70bb09deaba0 --uri http://localhost:9082/api/v3

goloop rpc scoreapi --uri http://localhost:9080/api/v3/icon cxa1229bef36fbdc2d75c8d4ec4b39102586f81eab

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method coinId --param _coinName=DEV

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat nativebsh.icon) --method coinId --param _coinName=BNB

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method coinNames

goloop rpc lastblock --uri http://localhost:9080/api/v3/icon

goloop rpc balance hxf6f258fdf3d090bce14f0073f9e5a5587384cc0c --uri http://localhost:9080/api/v3/icon

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "icx_getLastBlock"}' https://btp.net.solidwallet.io/api/v3 | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "icx_getBlockByHeight", "params": { "height": "0x4f92b4" }}' https://btp.net.solidwallet.io/api/v3 | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "icx_getTransactionResult", "params": { "txHash": "0x325d15a9bdf7289760ed894da9b05db6cfd196a4b73dfde49b12ed68e0f248ab" }}' https://bicon.net.solidwallet.io/api/v3 | jq

## Ethereum

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getHead"}' http://54.251.114.18:9933/ | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getBlock", "params":["0xf4dd90b0ac8911eb95844c072ad0fbf31350ba568e1ce744d16f86a3fd4f6aad"]}' http://54.251.114.18:9933 | jq

eth abi:add bshcore ./config/abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "getBalanceOf('0xF8aC273f62F2D1D7283be823400e05Aeddc389F5', 'ICX')"

eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "coinId('ICX')"

eth transaction:get --network http://localhost:9933 0xc67c3a4d537de8d042c6631f857580c78961f21e3bb425314be0cce86bf668b9

eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "coinNames()"

eth block:get --network http://localhost:8545 246

eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "coinNames()"
eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "coinId('ICX')"
eth block:number --network http://localhost:8545

eth address:balance 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d
