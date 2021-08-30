import { ethers } from 'ethers';
import { ADDRESS_LOCAL_STORAGE, CONNECTED_WALLET_LOCAL_STORAGE } from 'connectors/constants';
import { roundNumber } from 'utils/app';
import { getService } from 'services/transfer';

const initState = {
  unit: '', // a.k.a symbol, also native coin
  wallet: '',
  address: '',
  balance: 0,
  cancelConfirmation: false,
  currentNetwork: '',
  refundableBalance: {
    ICX: 0,
    DEV: 0,
  },
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
      localStorage.removeItem(CONNECTED_WALLET_LOCAL_STORAGE);
      return initState;
    },
  },
  effects: (dispatch) => ({
    async getRefundableBalance({ address, wallet }) {
      try {
        const icxRefundable = await getService(wallet).getBalanceOf({
          address: address,
          refundable: true,
          symbol: 'ICX',
        });
        const devRefundable = await getService(wallet).getBalanceOf({
          address: address,
          refundable: true,
          symbol: 'DEV',
        });
        return {
          ICX: ethers.utils.formatEther(icxRefundable),
          DEV: ethers.utils.formatEther(devRefundable),
        };
      } catch (error) {
        dispatch.modal.handleError();
      }
    },
  }),
  selectors: (slice) => ({
    selectAccountInfo() {
      return slice((state) => ({
        ...state,
        balance: roundNumber(state.balance, 4),
        refundableBalance: {
          ICX: roundNumber(state?.refundableBalance?.ICX, 4),
          DEV: roundNumber(state?.refundableBalance?.DEV, 4),
        },
      }));
    },
    selectIsConnected() {
      return slice((state) => !!state.address);
    },
  }),
};

export default account;
