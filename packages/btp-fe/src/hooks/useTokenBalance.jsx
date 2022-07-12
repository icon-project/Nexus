import { useState, useEffect } from 'react';

import { useSelect } from 'hooks/useRematch';
import { getService } from 'services/transfer';
import { getTokenList } from 'connectors/chainConfigs';

import { useListenForSuccessTransaction } from 'hooks/useListenForSuccessTransaction';

export const useTokenBalance = (currentSymbol, step, shouldFetch = true) => {
  const [token, setToken] = useState({ [currentSymbol]: null });

  useListenForSuccessTransaction(() => {
    setToken({});
  });

  const {
    accountInfo: { address, balance, symbol, currentNetwork },
  } = useSelect(({ account: { selectAccountInfo } }) => ({
    accountInfo: selectAccountInfo,
  }));

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (shouldFetch) {
      if (currentNetwork && currentSymbol && !token[currentSymbol]) {
        const isNativeCoin = currentSymbol === symbol;

        if (isNativeCoin) {
          setToken((prev) => ({ ...prev, [symbol]: balance }));
        } else {
          const isToken = getTokenList().find((token) => token.symbol === currentSymbol);
          getService()
            .getBalanceOf({ address, symbol: currentSymbol, isToken: !!isToken })
            .then((result) => {
              setToken((prev) => ({ ...prev, [currentSymbol]: result }));
            });
        }
      }
    }
  }, [currentSymbol, currentNetwork, step]);

  return [token[currentSymbol] || 0, currentSymbol];
};
