import { tokenTypes } from 'utils/constants';

/**
 * exploreSuffix: { transaction: string, address: string} - Define suffix URL for chain explore
 * disabled: boolean - Disable a chain
 */

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
    // disabled: true,
    exploreSuffix: { transaction: 'transactions/', address: 'accounts/' },
    decimals: 24,
  },
};
