import { tokenTypes } from 'utils/constants';

export const custom = {
  BSC: {
    tokens: [
      { symbol: 'TBNB', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME },
      { symbol: 'ETH', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME, type: tokenTypes.IRC2 },
      { symbol: 'TICX', chain: process.env.REACT_APP_CHAIN_BSC_CHAIN_NAME, type: tokenTypes.IRC2 },
    ],
  },
};
