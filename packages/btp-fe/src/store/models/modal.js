import { wallets } from 'utils/constants';

const modal = {
  name: 'modal',
  state: {
    display: false,
    options: {},
  },
  reducers: {
    setDisplay(state, display) {
      return {
        ...state,
        display,
      };
    },
    openModal(state, payload = {}) {
      return {
        ...state,
        options: {
          ...payload,
        },
        display: true,
      };
    },
  },
  effects: () => ({
    handleError(error) {
      console.log('error', error);
      this.openModal({
        icon: 'xIcon',
        desc: (error && error.message) || error || 'Something went wrong!',
      });
    },
    isICONexWalletConnected(_, rootState) {
      const {
        account: { wallet },
      } = rootState;

      if (wallet !== wallets.iconex) {
        this.openModal({
          icon: 'exclamationPointIcon',
          desc: 'You must connect to your ICONex wallet first',
          button: {
            text: 'Okay',
            onClick: () => this.setDisplay(false),
          },
        });
        return false;
      }
      return true;
    },
    openUnSupportTransfer() {
      this.openModal({
        icon: 'exclamationPointIcon',
        desc: 'We have not supported for transfer none native coin in same chain for now.',
      });
    },
  }),

  selectors: (slice) => ({
    selectDisplay() {
      return slice((state) => state.display);
    },
    selectOptions() {
      return slice((state) => state.options);
    },
  }),
};

export default modal;
