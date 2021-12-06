import { sendNativeCoin, depositTokensIntoBSH, sendNonNativeCoin } from './ICONService';
import { MOON_BEAM_NODE, BSC_NODE, signingActions } from 'connectors/constants';
import { isICONAndBSHPaired } from 'utils/constants';

export const transfer = (tx, isSendingNativeCoin, network) => {
  window[signingActions.globalName] = signingActions.transfer;
  const networkAddress = BSC_NODE[network]
    ? BSC_NODE.networkAddress
    : MOON_BEAM_NODE.networkAddress;

  if (isSendingNativeCoin) {
    sendNativeCoin(tx, networkAddress);
  } else {
    if (isICONAndBSHPaired()) depositTokensIntoBSH(tx);
    else sendNonNativeCoin(tx);
  }
};
