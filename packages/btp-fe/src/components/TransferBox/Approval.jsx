import { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useDispatch } from 'hooks/useRematch';
import { useListenForSuccessTransaction } from 'hooks/useListenForSuccessTransaction';

import { hashShortener, toSeparatedNumberString } from 'utils/app';
import { toChecksumAddress } from 'connectors/MetaMask/utils';
import { chainConfigs } from 'connectors/chainConfigs';
import { getService } from 'services/transfer';

import { Header, Text, SubTitle } from 'components/Typography';
import { Icon } from 'components/Icon/Icon';
import { ControlButtons } from './ControlButtons';

import { colors } from 'components/Styles/Colors';

const Wrapper = styled.div`
  padding-top: 23px;

  .heading {
    text-align: center;
    margin-bottom: 34px;
  }
`;

const SendToken = styled.div`
  padding: 0 32px;
  margin-bottom: 20px;

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 9px;

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
  .transfer-fee {
    display: flex;
    justify-content: space-between;

    & > .plain-text.md {
      color: ${colors.graySubText};
    }

    & > .plain-text.bright {
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
`;

const Total = styled.div`
  padding: 26px 32px;
  border-bottom: solid 1px ${colors.grayLine};

  .total-receive {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
`;

export const Approval = memo(({ setStep, values, sendingInfo, account, form, usdRate, BTPFee }) => {
  const { recipient, tokenAmount = 0 } = values;
  const { token, network } = sendingInfo;
  const { currentNetwork, symbol } = account;

  useListenForSuccessTransaction(() => {
    setStep(0);
    form.restart();
  });

  const { openModal } = useDispatch(({ modal: { openModal } }) => ({
    openModal,
  }));

  const onApprove = () => {
    const isSendingNativeCoin = symbol === token;
    const tx = { to: toChecksumAddress(recipient), value: tokenAmount, coinName: token, network };
    openModal({
      icon: 'loader',
      desc: 'Waiting for confirmation in your wallet.',
    });

    getService()?.transfer(tx, isSendingNativeCoin, token);
  };

  return (
    <Wrapper>
      <Header className="sm bold heading">Fee & Confirmation</Header>
      <SendToken>
        <Text className="sm" color={colors.graySubText}>
          You will send
        </Text>
        <div className="content">
          <Header className="md bold send-token">
            {tokenAmount || 0} {token}
          </Header>
          <Text className="md">= ${toSeparatedNumberString(usdRate * tokenAmount)}</Text>
        </div>
      </SendToken>

      <Details>
        <SubTitle className="lg">Details</SubTitle>
        <div className="send">
          <Text className="md">Send</Text>
          <div className="sender">
            <Icon icon={token} size="s" />
            <Text className="md sender--alias">{token}</Text>
            <Text className="sm sender--name">{currentNetwork}</Text>
          </div>
        </div>
        <div className="to">
          <Text className="md">To</Text>
          <div className="receiver">
            <CopyToClipboard text={recipient}>
              <div>
                <Icon icon="copy" size="s" color="#878491" />
                <Text className="md receiver--address">{hashShortener(recipient || '')}</Text>
              </div>
            </CopyToClipboard>
            <Text className="sm receiver--name">
              {chainConfigs[network]?.CHAIN_NAME || network}
            </Text>
          </div>
        </div>
        <div className="transfer-fee">
          <Text className="md">BTP transfer fee</Text>
          <Text className="md bright">{BTPFee}</Text>
        </div>
      </Details>

      <Total>
        <div className="total-receive">
          <SubTitle className="lg bold">Total receive</SubTitle>
          <SubTitle className="lg bold">
            {(tokenAmount - BTPFee).toPrecision(4)} {token}
          </SubTitle>
        </div>
        <Text className="xs" color={colors.graySubText}>
          Please be known that this is NOT the final Total Receive. There will be an amount of
          network fee deducted from the above Total receive.
        </Text>
      </Total>

      <ControlButtons executeLabel="Approve" onBack={() => setStep(1)} onExecute={onApprove} />
    </Wrapper>
  );
});

Approval.displayName = 'Approval';

Approval.propTypes = {
  /** Set step for transfer box */
  setStep: PropTypes.func,
  /** Transfer box values */
  values: PropTypes.shape({ recipient: PropTypes.string, tokenAmount: PropTypes.string }),
  sendingInfo: PropTypes.shape({
    token: PropTypes.string,
    network: PropTypes.string,
  }),
  account: PropTypes.shape({
    currentNetwork: PropTypes.string,
    symbol: PropTypes.string,
  }),
  /** react-final-form object */
  form: PropTypes.object,
  /** Is the current display screen */
  isCurrent: PropTypes.bool,
  /** Token in USD rate */
  usdRate: PropTypes.number,
};
