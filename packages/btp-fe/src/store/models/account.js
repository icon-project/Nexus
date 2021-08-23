import {
  ADDRESS_LOCAL_STORAGE,
  METAMASK_LOCAL_ADDRESS,
  CONNECTED_WALLET_LOCAL_STORAGE,
} from 'connectors/constants';
import { roundNumber } from 'utils/app';

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
      localStorage.removeItem(CONNECTED_WALLET_LOCAL_STORAGE);
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
  }),
};

export default account;
