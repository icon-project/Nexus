import { memo } from 'react';
import styled from 'styled-components/macro';
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

export const Approval = memo(({ setStep, tokenValue }) => (
  <Wrapper>
    <Header className="small bold heading">Fee & Confirmation</Header>
    <SendToken>
      <Text className="small sub-heading">You will send</Text>
      <div className="content">
        <Header className="medium bold send-token">{tokenValue || 0} ETH</Header>
        <Text className="medium">= $108,670.92</Text>
      </div>
    </SendToken>

    <Details>
      <SubTitle className="large">Details</SubTitle>
      <div className="send">
        <Text className="medium">Send</Text>
        <div className="sender">
          <Icon icon="eth" size="s" />
          <Text className="medium sender--alias">ETH</Text>
          <Text className="small sender--name">Etherum Mainnet</Text>
        </div>
      </div>
      <div className="to">
        <Text className="medium">To</Text>
        <div className="receiver">
          <Icon icon="copy" size="s" />
          <Text className="medium receiver--address">0xCe3E...D2fd</Text>
          <Text className="small receiver--name">Binance Smart Chain</Text>
        </div>
      </div>
      <div className="estimated-fee">
        <Text className="medium">Estimated network fee</Text>
        <Text className="medium bright">0.1</Text>
      </div>
      <div className="transfer-fee">
        <Text className="medium">BTP transfer fee</Text>
        <Text className="medium bright">0.02</Text>
      </div>
    </Details>

    <Total>
      <SubTitle className="large bold">Total receive</SubTitle>
      <SubTitle className="large bold">1.88 ETH</SubTitle>
    </Total>

    <ControlButtons executeLabel="Approve" onBack={() => setStep(1)} />
  </Wrapper>
));

Approval.displayName = 'Approval';
