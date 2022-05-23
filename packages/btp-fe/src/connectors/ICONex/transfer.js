import { sendNativeCoin, setApproveForSendNonNativeCoin, approveIRC2 } from './ICONServices';
import { signingActions } from 'connectors/constants';
import { checkIsToken } from 'connectors/chainConfigs';

export const transfer = (tx, isSendingNativeCoin, token) => {
  window[signingActions.globalName] = signingActions.transfer;
  const isToken = checkIsToken(token);

  if (isSendingNativeCoin) {
    sendNativeCoin(tx);
  } else if (isToken) {
    approveIRC2(tx);
  } else {
    setApproveForSendNonNativeCoin(tx);
  }
};
