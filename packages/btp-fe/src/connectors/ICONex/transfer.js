import { sendNativeCoin, setApproveForSendNonNativeCoin, approveIRC2 } from './ICONServices';
import { signingActions } from 'connectors/constants';
import { checkIsToken } from 'connectors/chainConfigs';

export const transfer = async (tx, isSendingNativeCoin, token) => {
  window[signingActions.globalName] = signingActions.transfer;
  const isToken = checkIsToken(token);

  if (isSendingNativeCoin) {
    return sendNativeCoin(tx);
  } else if (isToken) {
    return approveIRC2(tx);
  } else {
    return await setApproveForSendNonNativeCoin(tx);
  }
};
