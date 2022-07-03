import store from 'store';
import { signingActions, getCurrentChain } from 'connectors/constants';
import { sendLog } from 'services/btpServices';
import { resetTransferStep } from 'connectors/ICONex/utils';
import { sendNoneNativeCoin } from 'connectors/MetaMask/services';
import { EthereumInstance } from 'connectors/MetaMask';

import { SuccessSubmittedTxContent } from 'components/NotificationModal/SuccessSubmittedTxContent';

const { modal } = store.dispatch;

const handleSuccessTx = (txHash) => {
  switch (window[signingActions.globalName]) {
    case signingActions.approve:
      modal.openModal({
        icon: 'checkIcon',
        desc: `You've approved to tranfer your token! Please click the Transfer button to continue.`,
        button: {
          text: 'Transfer',
          onClick: sendNoneNativeCoin,
        },
      });
      break;

    default:
      EthereumInstance.refreshBalance();
      sendLog({
        txHash,
        network: getCurrentChain()?.NETWORK_ADDRESS?.split('.')[0],
      });

      modal.openModal({
        icon: 'checkIcon',
        children: <SuccessSubmittedTxContent />,
        button: {
          text: 'Continue transfer',
          onClick: () => {
            // back to transfer box
            resetTransferStep();
            modal.setDisplay(false);
          },
        },
      });
      break;
  }
};

const handleFailedTx = (message) => {
  modal.openModal({
    icon: 'xIcon',
    desc: message || 'Transaction failed',
    button: {
      text: 'Back to transfer',
      onClick: () => modal.setDisplay(false),
    },
  });
};

const handleError = (error) => {
  if (error.code === 4001) {
    modal.openModal({
      icon: 'exclamationPointIcon',
      desc: 'Transaction rejected.',
      button: {
        text: 'Dismiss',
        onClick: () => modal.setDisplay(false),
      },
    });
    return;
  } else {
    modal.openModal({
      icon: 'xIcon',
      desc: error.message,
      button: {
        text: 'Back to transfer',
        onClick: () => modal.setDisplay(false),
      },
    });
  }
};

export { handleFailedTx, handleSuccessTx, handleError };
