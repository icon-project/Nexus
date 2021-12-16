import { sendNativeCoin, depositTokensIntoBSH, sendNonNativeCoin } from './ICONServices';
import { MOON_BEAM_NODE, BSC_NODE, signingActions } from 'connectors/constants';
import { connectedNetWorks } from 'utils/constants';

export const transfer = (tx, isSendingNativeCoin, network) => {
  window[signingActions.globalName] = signingActions.transfer;
  const networkAddress = BSC_NODE[network]
    ? BSC_NODE.networkAddress
    : MOON_BEAM_NODE.networkAddress;

  if (isSendingNativeCoin) {
    sendNativeCoin(tx, networkAddress);
  } else {
    switch (network) {
      case connectedNetWorks.moonbeam:
        sendNonNativeCoin(tx);
        break;
      case connectedNetWorks.bsc:
        depositTokensIntoBSH(tx);
        break;
      case connectedNetWorks.near:
        console.log('Not implemented yet');
        break;
      default:
        console.log('No matching paired network');
        break;
    }
  }
};
