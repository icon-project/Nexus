import { chainConfigs, getTokenList, checkIsToken } from '../chainConfigs';

const harmonyChain = { symbol: 'ETH', chain: 'Harmony' };
jest.mock('connectors/chainCustomization', () => {
  return {
    custom: {
      HARMONY: {
        tokens: [harmonyChain],
      },
    },
  };
});

describe('connectors/chainConfigs', () => {
  test('if valid .env file', () => {
    const ICON = chainConfigs.ICON || {};

    expect(ICON.CHAIN_NAME).toBeTruthy();
    expect(ICON.COIN_SYMBOL).toBeTruthy();
    expect(ICON.EXPLORE_URL).toMatch(/^(https:\/\/).*(\/)$/);
    expect(ICON.NETWORK_ADDRESS).toMatch(/./); // 0x7.icon
    expect(ICON.RPC_URL).toBeTruthy();
    expect(ICON.STEP_LIMIT).toBeTruthy();
    expect(ICON.id).toBeTruthy();

    delete chainConfigs.ICON;

    for (const key in chainConfigs) {
      expect(chainConfigs[key].BTS_CORE).toBeTruthy();
      expect(chainConfigs[key].CHAIN_NAME).toBeTruthy();
      expect(chainConfigs[key].COIN_SYMBOL).toBeTruthy();
      expect(chainConfigs[key].EXPLORE_URL).toMatch(/^(https:\/\/).*(\/)$/);
      expect(chainConfigs[key].GAS_LIMIT).toBeTruthy();
      expect(chainConfigs[key].ICON_BTS_CORE).toBeTruthy();
      expect(chainConfigs[key].NETWORK_ADDRESS).toMatch(/./);
      expect(chainConfigs[key].RPC_URL).toBeTruthy();
      expect(chainConfigs[key].id).toBeTruthy();
    }
  });

  test('getTokenList & checkIsToken', () => {
    const tokenList = getTokenList();
    expect(tokenList).toEqual([
      { ...harmonyChain, chainId: harmonyChain.chain.toLocaleUpperCase() },
    ]);

    const isToken = checkIsToken(harmonyChain.symbol);
    const isNotToken = checkIsToken('ICX');
    expect(isToken).toBeTruthy();
    expect(isNotToken).toBeFalsy();
  });
});
