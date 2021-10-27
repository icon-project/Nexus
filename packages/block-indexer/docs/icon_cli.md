## ICON

goloop rpc txbyhash 0xbcc2f6841359c5069a7e7d42af1db0402c911f67e360b695d2cad27b5f7fab03 --uri http://localhost:9080/api/v3/icon

goloop rpc txresult 0xae12ab8d046bf739f1d25edd1bb55878a0a1a35670326143bad81383fe076826 --uri http://localhost:9080/api/v3/icon

./goloop rpc blockbyhash 0x7b8275119cb9735ac04f6f1da991bb04b8a4605f5ae2bdb604ef70bb09deaba0 --uri http://localhost:9082/api/v3

goloop rpc scoreapi --uri http://localhost:9080/api/v3/icon cxa1229bef36fbdc2d75c8d4ec4b39102586f81eab

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method coinId --param _coinName=DEV

goloop rpc call --uri http://localhost:9080/api/v3/icon --to $(cat ./config/nativeCoinBsh.icon) --method coinNames

goloop rpc lastblock --uri http://localhost:9080/api/v3/icon
# 1051
eth block:number --network http://localhost:8545
# 354

## Ethereum

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getHead"}' http://54.251.114.18:9933/ | jq

curl -H "Content-Type: application/json" -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getBlock", "params":["0xf4dd90b0ac8911eb95844c072ad0fbf31350ba568e1ce744d16f86a3fd4f6aad"]}' http://54.251.114.18:9933 | jq

curl http://54.251.114.18:8080/blocks/head | jq
curl http://54.251.114.18:8080/blocks/0x39ff409c55197e9ef1e258e71a1294effe6e09f103be6ae8263f666caafcb4ea | jq

eth abi:add bshcore ./config/abi.bsh_core.json
eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "getBalanceOf('0xF8aC273f62F2D1D7283be823400e05Aeddc389F5', 'ICX')"

eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "coinId('ICX')"

eth transaction:get --network http://localhost:9933 0xb5b49cd71c1d403db3cb0e7a0a8eeddf8fba93eb15930709ca5583912fc64d6c

eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "coinNames()"

eth block:get --network http://localhost:8545 246
