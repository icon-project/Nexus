import { tokenTypes } from 'utils/constants';

export const custom = {
  BSC: {
    disabled: true,
    tokens: [
      { symbol: 'sICX', chain: process.env.REACT_APP_CHAIN_ICON_CHAIN_NAME, type: tokenTypes.IRC2 },
      {
        symbol: 'bnUSD',
        chain: process.env.REACT_APP_CHAIN_ICON_CHAIN_NAME,
        type: tokenTypes.IRC2,
      },
      { symbol: 'BUSD', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME },
      { symbol: 'USDT', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME },
      { symbol: 'USDC', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME },
      { symbol: 'BTCB', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME },
      { symbol: 'ETH', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME },
    ],
  },
};
