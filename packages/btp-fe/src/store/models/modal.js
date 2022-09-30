import { wallets } from 'utils/constants';
import { SuccessSubmittedTxContent } from 'components/NotificationModal/SuccessSubmittedTxContent';

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

      if (![wallets.iconex, wallets.hana].includes(wallet)) {
        this.openModal({
          icon: 'exclamationPointIcon',
          desc: 'You must connect to your ICONex/Hana wallet first',
          button: {
            text: 'Okay',
            onClick: () => this.setDisplay(false),
          },
        });
        return false;
      }
      return true;
    },
    informFailedTx(msg) {
      this.openModal({
        icon: 'xIcon',
        desc: msg || 'Your transaction has failed. Please go back and try again.',
        button: {
          text: 'Back to transfer',
          onClick: () => this.setDisplay(false),
        },
      });
    },
    informSubmittedTx({ txHash, callback }) {
      this.openModal({
        icon: 'checkIcon',
        children: <SuccessSubmittedTxContent setDisplay={this.setDisplay} txHash={txHash} />,
        button: {
          text: 'Continue transfer',
          onClick: () => {
            if (callback) callback();
            this.setDisplay(false);
          },
        },
      });
    },
    informApprovedTransfer({ onClick, action }) {
      this.openModal({
        icon: 'approveIcon',
        desc: `You've ${
          action || 'approved'
        } to transfer your token! Please click the Transfer button to continue.`,
        button: {
          id: 'approve-transfer-btn',
          text: 'Transfer',
          onClick,
        },
      });
    },
    informRejectedTx() {
      this.openModal({
        icon: 'exclamationPointIcon',
        desc: 'Transaction rejected.',
        button: {
          text: 'Dismiss',
          onClick: () => this.setDisplay(false),
        },
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
