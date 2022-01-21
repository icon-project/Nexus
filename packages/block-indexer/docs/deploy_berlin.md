- MOONBEAM_API_URL=https://moonbeam-alpha.api.onfinality.io/public
MOONBEAM_NETWORK_ID=0x507.pra
MOONBEAM_BSH_CORE_ADDRESS=0xe86c84Ae538b155C928Ed17380beCd253822097e
MOONBEAM_BMC_ADDRESS=0xf4B7ebFDAD341a180b4B014fc017e15B1A4E01ae
MOONBEAM_BMC_MANAGEMENT_ADDRESS=0x9721A52E4DABB807E2A3caeb509AA699B1Bd0667
- Block numbers (of each network) where deployment started 1511560
- Network explorers
- Registered tokens e.g. tx/tx result/tx receipt
- Prefunded test accounts for testing (addresses and keys) e.g. Alice, Bob

http://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam-alpha.api.onfinality.io%2Fpublic-ws#/explorer

Moonbeam relay 0xc705bbe83eedc6aaeb25ac1dca3e9f830ab6e7b85582a71c6c2fb2aa15ab7fc8 1511837

## ICON

“blockHeight”: 0x1b43cb, 1786827

goloop rpc txbyhash 0x82e1f046584502ee9a6c3bf5df87bf573ff419f7c177a189aa4d2d62b2c69382 --uri https://berlin.net.solidwallet.io/api/v3

goloop rpc txresult 0x82e1f046584502ee9a6c3bf5df87bf573ff419f7c177a189aa4d2d62b2c69382 --uri https://berlin.net.solidwallet.io/api/v3

hx1a884192c29c7810ec37dbda1802670a3d9eaa67 deloy account

Latest:

```
bmc cx6a3de71a52d8bbd3f87a497b7a07ebae13368b3f
Fee aggregation cx67a3343bc83835402c2f7b50cb8a4514fd3c2408
- Relay event decoder score address:     cx4975abcae23d32409a3ce4a8119bfc9d068f795f
- Para event decoder score address:     cxc8a9fdf439a6984c878b7bc71817992901920aff
- Para chain bmv score address:  cx8db96b52f5155573be1806e5b0de1aeae2be82db
Irc2 score address cx824f3b2f2a8f59ac3d281b1b9bc295e051be5274
nativeCoinBSH address cx85641349336902f56cb0d5d0f854ac837a243a8a

Irc2 deploy tx hash 0x859f8b704f23bc8bb6862c6826021e74e239add65d4b459e0e6ea81ebf0849a5
bsh deploy tx hash 0xdf1b39b43fffba562318252bac88f6ba6753340171f5b868f995f4e9e59009b7

addRelay txhash 0xe8a964fbf8b04021f8214fe119573473ae89f81b644b9aa193f7dca81302123f 1844957
```

```bash
goloop rpc --uri https://berlin.net.solidwallet.io/api/v3 sendtx deploy nativecoinIRC2-0.1.0-optimized.jar \
--key_store alice.ks.json --key_password xxxx \
  --nid 7 --step_limit 3519157719 \
 --content_type application/java \
  --param _bmc=cx6a3de71a52d8bbd3f87a497b7a07ebae13368b3f \
  --param _irc2=cx578368249b230b823c667549acab13cf910805c4 \
  --param _name=ICX \
  --param _tokenName=MOVR

goloop rpc call --uri https://berlin.net.solidwallet.io/api/v3 --to cx9125e801c9370480ddf95ba48d796b3d4154b343 --method coinId --param _coinName=MOVR

goloop rpc call --uri https://berlin.net.solidwallet.io/api/v3 --to cx9125e801c9370480ddf95ba48d796b3d4154b343 --method coinNames
```

```sql
INSERT INTO registered_tokens (network_id, token_name, token_id, contract_address, token_address, tx_hash) VALUES ('0x7', 'ICX', '0', 'cx9125e801c9370480ddf95ba48d796b3d4154b343', '', '0x294c1e27198ae3b159f93eedd6a478966d725c4d12dd69915992afc50cb10f24');
INSERT INTO registered_tokens (network_id, token_name, token_id, contract_address, token_address, tx_hash) VALUES ('0x507', 'MOVR', '0', 'MOONBEAM_BSH_CORE_ADDRESS', '', '0x5c8b55af397256d06e2be6acdefb350f92ff4363745001ce8cd367c74b10d7f3');
```

## Test

```bash
# ICON Berlin
goloop ks gen -o vova.json -p test12345
goloop rpc balance hxdd7cc765bb90ef63fca515e362feb3cce3f63ec7 --uri https://berlin.net.solidwallet.io/api/v3
# 2001 ICX

# Moonbeam Alpha
0x87a8804BDC1Fe3bC1ad703F61685934E7b348413
# 5 DEV faucet Transaction Hash 0x70281ad33f32932bcb68399bf04ac589b2e449b06835db92608251e611de1f37
eth address:balance 0x87a8804BDC1Fe3bC1ad703F61685934E7b348413 --network https://moonbeam-alpha.api.onfinality.io/public
```

## Issues

- No registered token e.g. DEV on ICON, `coinId` removed from BSH.
- Quy: IRC2 token mint when it deploy. So no mint/burn? Mint/burn event changed?
- What changes to events TransferStart, TransferEnd, TransferBatch, TransferSingle? TransferBatch, TransferSingle are replaced with Transfer.
- Contracts for ICX, DEV?: BSH + IRC2 or ERC20
- ICON: IRC2
- Moonbeam: ERC20
- need to approve for each tx for external token e.g. DEV on ICON
-
