## Transfer tokens on testnet guidelines

### Playground

http://demo-static-web.lecle.vn.s3-website-ap-southeast-1.amazonaws.com/transfer

### Connect wallets to testnet 

#### 1. ICONex (BSH Address: cx489ed02580ce5cab57925317373310205417c2b7)

**Does not require extra setup to connect this wallet to the testnet for transfer testing**. Just install, and load a wallet (using a keystore or a private key). Here is a ready-to-go account:

**alice.ks.json**
```json
{
  "address": "hx548a976f8eda5d7c0afcb99110ca49434cdf921b",
  "id": "85883325-f892-43f4-9545-1ef91fe4cba0",
  "version": 3,
  "coinType": "icx",
  "crypto": {
    "cipher": "aes-128-ctr",
    "cipherparams": {
      "iv": "6e1a2d777be3a36e90a934d1c82c77f5"
    },
    "ciphertext": "e19de1ed07d4fd380ce5f7775a1f54f07b4058bf6174deb99d7705c2996ef9f5",
    "kdf": "scrypt",
    "kdfparams": {
      "dklen": 32,
      "n": 65536,
      "r": 8,
      "p": 1,
      "salt": "6e05017a64f67f0e"
    },
    "mac": "1b92ae5a7e7e8303367d346b7bc788d96ad6da5c2c17dae2df07b31052499e78"
  }
}
```

- pw: f085f57a6e4f89eb


#### 2. MetaMask

- Install & load wallet: https://docs.moonbeam.network/getting-started/local-node/using-metamask/ 

- Testing account: BOB - Private key: 0x1477fb360c00fd580829d22d842d69034df1e54c563e5f56b8b21a88a36c9678

Ref: https://github.com/icon-project/btp-dashboard/issues/339#issuecomment-919652107

- Switch to Moonbeam network: https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC

**Moonbeam testnet:**
- Name: any
- New RPC URL: http://54.251.114.18:9933
- Chain ID: 1281
- Symbol: DEV

**Moonbeam explore:** http://54.251.114.18/#/explorer
