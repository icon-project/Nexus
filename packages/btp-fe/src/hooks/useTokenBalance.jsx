import { useState, useEffect } from 'react';
import { EthereumInstance } from 'connectors/MetaMask';
import { getBalanceOf } from 'connectors/ICONex/iconService';

import { useSelect } from 'hooks/useRematch';
import { connectedNetWorks } from 'utils/constants';

export const useTokenBalance = (currentSymbol) => {
  const [token, setToken] = useState({ balance: null, symbol: currentSymbol });

  const {
    accountInfo: { address, balance, unit, currentNetwork },
  } = useSelect(({ account: { selectAccountInfo } }) => ({
    accountInfo: selectAccountInfo,
  }));

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentSymbol === unit) {
      setToken({ balance, symbol: unit });
    } else {
      if (currentNetwork === connectedNetWorks.moonbeam) {
        EthereumInstance.getBalanceOf(address, currentSymbol).then((result) => {
          setToken({ balance: result, symbol: currentSymbol });
        });
      } else if (currentNetwork === connectedNetWorks.icon) {
        getBalanceOf(address, currentSymbol).then((result) => {
          setToken({ balance: result, symbol: currentSymbol });
        });
      }
    }
  }, [currentSymbol]);

  return [token.balance, token.symbol];
};
