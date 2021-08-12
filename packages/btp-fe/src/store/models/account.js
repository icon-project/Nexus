import { ADDRESS_LOCAL_STORAGE, METAMASK_LOCAL_ADDRESS } from 'connectors/constants';
import { roundNumber } from 'utils/app';
import { wallets } from 'utils/constants';

const initState = {
  unit: '', // a.k.a symbol, also native coin
  wallet: '',
  address: '',
  balance: 0,
  cancelConfirmation: false,
  currentNetwork: '',
};

const account = {
  name: 'account',
  state: {
    ...initState,
  },
  reducers: {
    setAccountInfo(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
    resetAccountInfo() {
      localStorage.removeItem(ADDRESS_LOCAL_STORAGE);
      localStorage.removeItem(METAMASK_LOCAL_ADDRESS);
      return initState;
    },
  },
  selectors: (slice) => ({
    selectAccountInfo() {
      return slice((state) => ({ ...state, balance: roundNumber(state.balance, 4) }));
    },
    selectIsConnected() {
      return slice((state) => !!state.address);
    },
    selectIsConnectedToICON() {
      return slice((state) => state.wallet === wallets.iconex);
    },
  }),
};

export default account;
