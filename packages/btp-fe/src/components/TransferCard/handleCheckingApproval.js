import { TransferApproval } from 'components/NotificationModal/TransferApproval';
import { getPairedNetwork, pairedNetworks } from 'utils/constants';
import { getService } from 'services/transfer';

export default async (setStep, isSendingNativeCoin, currentNetwork, openModal, setDisplay) => {
  if (
    isSendingNativeCoin ||
    // Not implemented checking approval for BSC and NEAR
    // So, just bypass for now.
    [pairedNetworks['ICON-NEAR'], pairedNetworks['ICON-BSC']].includes(getPairedNetwork())
  ) {
    setStep(1);
  } else {
    const result = await getService(currentNetwork).isApprovedForAll();

    if (result) {
      setStep(1);
    } else if (result === false) {
      openModal({
        isSetApprovalForAllModal: true,
        hasHeading: false,
        children: (
          <TransferApproval
            onOk={() => {
              getService().setApprovalForAll();
            }}
            onCancel={() => {
              setDisplay(false);
            }}
          />
        ),
      });
    } else {
      openModal({
        icon: 'xIcon',
        desc: 'Something went wrong',
      });
    }
  }
};
