## Transfer tokens on testnet guidelines

### Playground

http://demo-static-web.lecle.vn.s3-website-ap-southeast-1.amazonaws.com/transfer

### Connect wallets to testnet

#### 1. ICONex

**Does not require extra setup to connect this wallet to the testnet for transfer testing**. Just install, and load a wallet (using a keystore or a private key). Here is a ready-to-go account:

**alice.ks.json**
```json
{"address":"hxcf3af6a05c8f1d6a8eb9f53fe555f4fdf4316262","id":"1f9dc34f-3f02-46e3-8119-3d6129006c7b","version":3,"coinType":"icx","crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"076ee1d73509fd71f25910612a0238a4"},"ciphertext":"74e4b9f0fde7ded1019cd43c786921f5eb030df6a3df8ca711a1a2232a5fd375","kdf":"scrypt","kdfparams":{"dklen":32,"n":65536,"r":8,"p":1,"salt":"245e74f679274316"},"mac":"9a0ead7b1082945dc0f337a345b3827eec756e0be9e6b64ef9f549dcfa1859e0"}}
```

- pw: a8042ac1f8db288a


#### 2. MetaMask

- Install & load wallet: https://docs.moonbeam.network/getting-started/local-node/using-metamask/ (You can use any development account as: Alith / Baltathar / ...)

- Switch to Moonbeam network: https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC

**Moonbeam testnet:**
- Name: any
- New RPC URL: http://54.251.114.18:9933
- Chain ID: 1281
- Symbol: DEV

**Moonbeam explore:** http://54.251.114.18/#/explorer
