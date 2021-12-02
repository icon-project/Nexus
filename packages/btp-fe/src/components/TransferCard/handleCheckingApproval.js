import { TransferApproval } from 'components/NotificationModal/TransferApproval';
import { isICONAndBSHPaired } from 'utils/constants';
import { getService } from 'services/transfer';

export default async (setStep, isSendingNativeCoin, currentNetwork, openModal, setDisplay) => {
  if (isSendingNativeCoin || isICONAndBSHPaired()) {
    setStep(1);
  } else {
    const result = await getService(currentNetwork).isApprovedForAll();

    if (result) {
      setStep(1);
    } else if (result === false) {
      openModal({
        isSetApprovalForAllModel: true,
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
