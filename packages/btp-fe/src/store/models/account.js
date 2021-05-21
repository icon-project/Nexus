import { ADDRESS_LOCAL_STORAGE } from '../../connectors/constants';

const initState = {
  unit: '',
  wallet: '',
  address: '',
  balance: 0, // TODO: calculating based on BigInt
  cancelConfirmation: false,
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
      return initState;
    },
  },
  selectors: (slice) => ({
    selectAccountInfo() {
      return slice((state) => state);
    },
  }),
};

export default account;
