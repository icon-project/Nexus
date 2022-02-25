## ICON

goloop rpc txbyhash 0x21e82864d512107b7541094f1466f48142fac0416497555dae6a29f81c1763b1 --uri http://localhost:9080/api/v3/icon

goloop rpc txbyhash 0xc2eb373959abee897a18da828d3386c292be6aae9560bc2cc17e9a8e9978b37d --uri https://berlin.net.solidwallet.io/api/v3

goloop rpc txresult 0xc2eb373959abee897a18da828d3386c292be6aae9560bc2cc17e9a8e9978b37d --uri https://berlin.net.solidwallet.io/api/v3

./goloop rpc blockbyhash 0x7b8275119cb9735ac04f6f1da991bb04b8a4605f5ae2bdb604ef70bb09deaba0 --uri http://localhost:9082/api/v3

goloop rpc scoreapi --uri $ICON_URL 0x7b63480320B5A21f2294637aD518D174F45c2058

goloop rpc scoreapi --uri https://berlin.net.solidwallet.io/api/v3 cx8a05039c1c1da936d279e276a25c4fa66154bebd
goloop rpc scoreapi --uri https://berlin.net.solidwallet.io/api/v3 cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274

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

eth transaction:get --network moonbeam 0xce086c72ef5b5a3547ace07a9e9791b3b0032b52eb9554e1f60b2250390970ec

eth contract:call --network http://localhost:9933 bshcore@$(cat ./config/bsh_core.moonbeam) "coinNames()"

eth block:get --network http://localhost:8545 246

eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "coinNames()"
eth contract:call --network http://localhost:8545 bshcore@$(cat bsh.core.bsc) "coinId('ICX')"
eth block:number --network http://localhost:8545

eth address:balance 0x70e789d2f5d469ea30e0525dbfdd5515d6ead30d

eth contract:call --network moonbeam bshcore@0xC45517EF106214F34ac7e45F66559b499Ebef542 "coinNames()"
eth contract:call --network moonbeam bshcore@0xC45517EF106214F34ac7e45F66559b499Ebef542 "coinId('ICON')"

scp ssh ubuntu@54.251.114.18:btp/solidity/bsh/build/contracts/BSHCore.json ~/Public
cat BSHCore.json | jq '.abi' > abi.bsh_core.json
