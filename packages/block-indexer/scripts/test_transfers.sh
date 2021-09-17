#!/bin/sh

# Tien: hx0a349be9845c75f8c8945451e212b86110b36e2c
# Dorothy: 0x773539d4Ac0e786233D90A233654ccEE26a613D9
# 0x39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68

cd testnet/btp/docker-compose/goloop2moonbeam

# Tien send Dorothy 1 ICX
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0x773539d4Ac0e786233D90A233654ccEE26a613D9 --value 1000000000000000000 \
  --key_store tiendq.ks.json --key_password test12345 --step_limit 10000000000 --nid 0x58eb1c

# Tien send Dorothy 5 ICX
goloop rpc sendtx call --uri http://localhost:9080/api/v3/icon \
  --to $(cat ./config/nativeCoinBsh.icon) --method transferNativeCoin \
  --param _to=btp://0x501.pra/0x773539d4Ac0e786233D90A233654ccEE26a613D9 --value 5000000000000000000 \
  --key_store tiendq.ks.json --key_password test12345 --step_limit 10000000000 --nid 0x58eb1c

goloop rpc txresult 0x062ae2ada01eb19c3e38938c1618b32c4e6f4e3c295dde50cd89ca0318c18fde --uri http://localhost:9080/api/v3/icon

goloop rpc balance hx0a349be9845c75f8c8945451e212b86110b36e2c --uri http://localhost:9080/api/v3/icon | jq -r

# Dorothy send Tien 1 DEV
encoded_data=$(eth method:encode ./config/abi.bsh_core.json "transferNativeCoin('btp://0x58eb1c.icon/hx0a349be9845c75f8c8945451e212b86110b36e2c')")

eth transaction:send --network http://localhost:9933 \
  --pk 0x39539ab1876910bbf3a223d84a29e28f1cb4e2e456503e7e91ed39b2e7223d68 \
  --gas 6721975 \
  --to $(cat ./config/bsh_core.moonbeam) \
  --data $encoded_data \
  --value 1000000000000000000 | jq -r

eth transaction:get --network http://localhost:9933 0x4ccd5b5c217cc315bdae5694e2aa2b302052a6f62e9620651cdaa88fca3d0f02
