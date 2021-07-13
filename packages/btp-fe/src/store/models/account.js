import { ADDRESS_LOCAL_STORAGE, METAMASK_LOCAL_ADDRESS } from 'connectors/constants';
import { roundToTwo } from 'utils/app';

const initState = {
  unit: '',
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
      return slice((state) => ({ ...state, balance: roundToTwo(state.balance) }));
    },
    selectIsConnected() {
      return slice((state) => !!state.address);
    },
  }),
};

export default account;
