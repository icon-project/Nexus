import { useState, useEffect } from 'react';
import { EthereumInstance } from 'connectors/MetaMask';
import { getBalanceOf } from 'connectors/ICONex/iconService';
import { useSelect } from 'hooks/useRematch';

export const useTokenBalance = (currentSymbol) => {
  const [token, setToken] = useState({ balance: null, symbol: currentSymbol });

  const {
    accountInfo: { address, balance, unit, currentNetwork },
    isConnectedToICON,
  } = useSelect(({ account: { selectAccountInfo, selectIsConnectedToICON } }) => ({
    accountInfo: selectAccountInfo,
    isConnectedToICON: selectIsConnectedToICON,
  }));

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentNetwork && currentSymbol) {
      const isNativeCoin = currentSymbol === unit;

      if (isNativeCoin) {
        setToken({ balance, symbol: unit });
      } else {
        if (isConnectedToICON) {
          getBalanceOf(address, currentSymbol).then((result) => {
            setToken({ balance: result, symbol: currentSymbol });
          });
        } else {
          EthereumInstance.getBalanceOf(address, currentSymbol).then((result) => {
            setToken({ balance: result, symbol: currentSymbol });
          });
        }
      }
    }
  }, [currentSymbol, currentNetwork]);

  return [token.balance, token.symbol];
};
