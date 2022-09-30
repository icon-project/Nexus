## ADDING A NEW CHAIN
### Assumptions
A new chain:
- uses Metamask wallet
- has the same/closest ABI set with ICON-BSC BTP, ref: https://github.com/icon-project/icon-bridge/discussions/68
### Configuations
Add these `required` configurations folowing the name pattern below to `.env` file for testnet and `.env.mainnet` file for mainnet:

```javascript
REACT_APP_CHAIN_BSC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
REACT_APP_CHAIN_BSC_EXPLORE_URL=https://testnet.bscscan.com/
REACT_APP_CHAIN_BSC_NETWORK_ADDRESS=0x61.bsc
REACT_APP_CHAIN_BSC_CHAIN_NAME=BNB Smart Chain
REACT_APP_CHAIN_BSC_COIN_SYMBOL=BNB
REACT_APP_CHAIN_BSC_GAS_LIMIT=0x6691B7

REACT_APP_CHAIN_BSC_ICON_BTS_CORE=cxa843db0a27750230559f997bafaeb7f8739afc81
REACT_APP_CHAIN_BSC_BTS_CORE=0x1a2aDf985D6c2700fdAf72A9c1e2b39e3B647F7e
```

### Name Pattern

```
REACT_APP_CHAIN_[ID]_[PROPERTY]
```

- Prefix `REACT_APP_CHAIN`: is required for chain's configuration definition.
- ID: can be named to anything but it must has at least 3 characters (A-Z), unique and meanful to distinguish to other chains.
### Customization

Add your chain's customization to `chainCustomization.js` file in `/src/connectors`

Example:

```js
export const custom = {
  ICON: {
    exploreSuffix: { transaction: 'transaction/' },
    decimals: 18,
  },
  BSC: {
    // disabled: true,
    tokens: [
      {
        symbol: 'sICX',
        type: tokenTypes.IRC2,
        tokenOf: 'ICON',
      },
      {
        symbol: 'bnUSD',
        type: tokenTypes.IRC2,
        tokenOf: 'ICON',
      },
      { symbol: 'BUSD', tokenOf: 'BSC' },
      { symbol: 'USDT', tokenOf: 'BSC' },
      { symbol: 'USDC', tokenOf: 'BSC' },
      { symbol: 'BTCB', tokenOf: 'BSC' },
      { symbol: 'ETH', tokenOf: 'BSC' },
    ],
  },
  NEAR: {
    exploreSuffix: { transaction: 'transactions/', address: 'accounts/' },
    decimals: 24,
  },
};
```

- `exploreSuffix: { transaction: string, address: string}` - Define suffix URL for chain explore

For example: 

https://lisbon.tracker.solidwallet.io/`transaction/`0xefec495234e835c6564b54c7ee5e6c150995fc3794723631aa1014b046ad986a for ICON tracker, and 

https://explorer.testnet.near.org/`transactions/`AmxFL5U8uesKcw3gBk9NZdd127UBeReuwNXHouHEA7rP for NEAR explore

- `decimals: number` - Define decimal number for balance

- `disabled: boolean` - enable/disable a chain

- `tokens: array` - a list of tokens
