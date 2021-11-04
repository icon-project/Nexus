import { useState } from 'react';
import styled from 'styled-components/macro';

import { Select, SelectAsset } from 'components/Select';
import { PrimaryButton } from 'components/Button';
import { Header, Text } from 'components/Typography';
import { media } from 'components/Styles/Media';
import { TransferApproval } from 'components/NotificationModal/TransferApproval';

import { useDispatch } from 'hooks/useRematch';
import { connectedNetWorks } from 'utils/constants';

import { getService } from 'services/transfer';
import transferIcon from 'assets/images/vector-icon.svg';

const StyledCard = styled.div`
  width: 480px;
  background-color: #1d1b22;
  padding: 32px;

  .desc-txt {
    text-align: center;
    color: #878491;
    margin: 11px 0 37px;
  }

  .right-side {
    display: flex;
    justify-content: flex-end;
  }

  .devider {
    margin: 45px 0;
    border-top: 1px solid #353242;
    position: relative;

    :after {
      content: '';
      background: transparent center / contain no-repeat url(${transferIcon});
      width: 40px;
      height: 40px;
      display: block;

      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .button-section {
    margin-top: 42px;
  }

  .to,
  .send {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ${media.md`
    width: 100% !important;
  `}
`;

export const TransferCard = ({
  setStep,
  setSendingInfo,
  isConnected,
  isSendingNativeCoin,
  currentNetwork,
}) => {
  const [checkingApproval, setCheckingApproval] = useState(false);

  const { openModal, setDisplay } = useDispatch(({ modal: { openModal, setDisplay } }) => ({
    openModal,
    setDisplay,
  }));

  const onChange = (values) => {
    const {
      target: { value, name },
    } = values;
    if (name) {
      setSendingInfo({ [name]: value });
    }
  };

  const onNext = async () => {
    if (isSendingNativeCoin) {
      setStep(1);
    } else {
      setCheckingApproval(true);

      const result = await getService().isApprovedForAll();

      if (result) {
        setStep(1);
      } else if (result === false) {
        openModal({
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

      setCheckingApproval(false);
    }
  };

  const { icon, moonbeam } = connectedNetWorks;

  const getCrossNetworks = () => {
    return currentNetwork
      ? [
          { value: icon, label: icon },
          { value: moonbeam, label: moonbeam },
        ].filter((network) => network.value !== currentNetwork)
      : [];
  };

  return (
    <StyledCard>
      <Header className="sm bold center">Transfer</Header>
      <div className="content">
        <Text className="sm desc-txt">
          Select an asset and destination chain, to begin or resume a mint.
        </Text>

        <div className="send">
          <Text className="md">Send</Text>
          <SelectAsset onChange={onChange} />
        </div>

        <div className="devider" />

        <div className="to">
          <Text className="md">To</Text>
          <Select options={getCrossNetworks()} onChange={onChange} name="network" />
        </div>

        <div className="button-section">
          {isConnected ? (
            <PrimaryButton
              width={416}
              height={64}
              disabled={checkingApproval}
              onClick={() => {
                onNext();
              }}
              type="button"
            >
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton width={416} height={64} disabled>
              Connect wallet
            </PrimaryButton>
          )}
        </div>
      </div>
    </StyledCard>
  );
};
