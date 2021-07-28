import { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useDispatch } from 'hooks/useRematch';
import { useTokenToUsd } from 'hooks/useTokenToUsd';
import { useListenForSuccessTransaction } from 'hooks/useListenForSuccessTransaction';

import { transfer, getBTPfee } from 'connectors/ICONex/iconService';
import { EthereumInstance } from 'connectors/MetaMask';
import { hashShortener } from 'utils/app';
import { wallets } from 'utils/constants';

import { Header, Text, SubTitle } from '../Typography';
import { Icon } from '../Icon/Icon';
import { ControlButtons } from './ControlButtons';

import { colors } from '../Styles/Colors';

const Wrapper = styled.div`
  .heading {
    text-align: center;
    margin-bottom: 34px;
  }
`;

const SendToken = styled.div`
  padding: 0 32px;
  margin-bottom: 20px;

  .sub-heading {
    color: ${colors.graySubText};
    margin-bottom: 9px;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .send-token {
      max-width: 280px;
      word-break: break-word;
    }
  }
`;

const Details = styled.div`
  padding: 27px 32px 26px;
  border-top: solid 1px ${colors.grayLine};
  border-bottom: solid 1px ${colors.grayLine};

  .send,
  .to,
  .estimated-fee,
  .transfer-fee {
    display: flex;
    justify-content: space-between;

    & > p.medium {
      color: ${colors.graySubText};
    }

    & > p.bright {
      color: ${colors.grayText};
    }
  }
  .send {
    margin-bottom: 21px;
    margin-top: 12px;

    .sender {
      text-align: right;

      .sender--alias {
        display: inline-block;
        vertical-align: middle;
        margin-left: 8px;
      }

      .sender--name {
        margin-top: 8px;
      }
    }
  }

  .to {
    margin-bottom: 21px;

    .receiver {
      text-align: right;

      .receiver--address {
        display: inline-block;
        vertical-align: middle;
        margin-left: 8.83px;
        color: ${colors.tertiaryBase};
      }

      .receiver--name {
        margin-top: 5px;
      }
    }
  }

  .estimated-fee {
    margin-bottom: 21px;
  }
`;

const Total = styled.div`
  padding: 26px 32px;
  border-bottom: solid 1px ${colors.grayLine};

  display: flex;
  justify-content: space-between;
`;

export const Approval = memo(({ setStep, values, sendingInfo, account, form, isCurrent }) => {
  const [BTPFee, setBTPFee] = useState(0);
  const { recipient, tokenAmount = 0 } = values;
  const { token, network } = sendingInfo;
  const { currentNetwork, wallet, unit } = account;
  const usdBalance = useTokenToUsd(token, tokenAmount);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isCurrent)
      getBTPfee().then((result) => {
        setBTPFee((result / 10000) * tokenAmount);
      });
  }, [isCurrent]);

  useListenForSuccessTransaction(() => {
    setStep(0);
    form.restart();
  });

  const { openModal } = useDispatch(({ modal: { openModal } }) => ({
    openModal,
  }));

  const onApprove = () => {
    if (wallets.iconex === wallet) {
      openModal({
        icon: 'loader',
        desc: 'Waiting for confirmation in your wallet.',
      });
      transfer({ to: recipient, value: tokenAmount });
    } else if (wallets.metamask === wallet) {
      openModal({
        icon: 'loader',
        desc: 'Waiting for confirmation in your wallet.',
      });
      EthereumInstance.tranferToken(recipient, tokenAmount);
    } else {
      openModal({
        icon: 'exclamationPointIcon',
        desc: `This action has not been implemented yet`,
      });
    }
  };

  return (
    <Wrapper>
      <Header className="sm bold heading">Fee & Confirmation</Header>
      <SendToken>
        <Text className="sm sub-heading">You will send</Text>
        <div className="content">
          <Header className="md bold send-token">
            {tokenAmount || 0} {unit}
          </Header>
          <Text className="medium">= ${usdBalance.toLocaleString()}</Text>
        </div>
      </SendToken>

      <Details>
        <SubTitle className="lg">Details</SubTitle>
        <div className="send">
          <Text className="medium">Send</Text>
          <div className="sender">
            <Icon icon={token} size="s" />
            <Text className="medium sender--alias">{token}</Text>
            <Text className="small sender--name">{currentNetwork}</Text>
          </div>
        </div>
        <div className="to">
          <Text className="medium">To</Text>
          <div className="receiver">
            <CopyToClipboard text={recipient}>
              <div>
                <Icon icon="copy" size="s" />
                <Text className="medium receiver--address">{hashShortener(recipient || '')}</Text>
              </div>
            </CopyToClipboard>
            <Text className="small receiver--name">{network}</Text>
          </div>
        </div>
        <div className="estimated-fee">
          <Text className="medium">Estimated network fee</Text>
          <Text className="medium bright">0.1</Text>
        </div>
        <div className="transfer-fee">
          <Text className="medium">BTP transfer fee</Text>
          <Text className="medium bright">{BTPFee}</Text>
        </div>
      </Details>

      <Total>
        <SubTitle className="lg bold">Total receive</SubTitle>
        <SubTitle className="lg bold">
          {tokenAmount - BTPFee} {token}
        </SubTitle>
      </Total>

      <ControlButtons executeLabel="Approve" onBack={() => setStep(1)} onExecute={onApprove} />
    </Wrapper>
  );
});

Approval.displayName = 'Approval';
