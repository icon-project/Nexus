import store from 'store';
import { signingActions, getCurrentChain } from 'connectors/constants';
import { sendLog } from 'services/btpServices';
import { resetTransferStep } from 'connectors/ICONex/utils';
import { sendNoneNativeCoin } from 'connectors/MetaMask/services';
import { EthereumInstance } from 'connectors/MetaMask';

const { modal } = store.dispatch;

const handleSuccessTx = (txHash) => {
  switch (window[signingActions.globalName]) {
    case signingActions.approve:
      modal.informApprovedTransfer({ onClick: sendNoneNativeCoin });
      break;

    default:
      EthereumInstance.refreshBalance();
      sendLog({
        txHash,
        network: getCurrentChain()?.NETWORK_ADDRESS?.split('.')[0],
      });

      modal.informSubmittedTx({ txHash, callback: resetTransferStep });
      break;
  }
};

const handleFailedTx = (message) => {
  modal.informFailedTx(message);
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
    modal.informFailedTx(error.message);
  }
};

export { handleFailedTx, handleSuccessTx, handleError };
