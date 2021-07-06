import styled from 'styled-components';
import { Card as AntCard, Row } from 'antd';

import { Select, SelectAsset } from 'components/Select';
import { PrimaryButton } from 'components/Button';
import { media } from '../Styles/Media';

import { useSelect } from '../../hooks/useRematch';

import VectorIconSrc from 'assets/images/vector-icon.svg';

const CardStyled = styled(AntCard)`
  font-style: normal;
  letter-spacing: 1px;
  h1 {
    font-weight: 600;
    font-size: 25px;
    line-height: 36px;
    color: #eff1ed;
    text-align: center;
  }
  .content {
    font-size: 16px;
    color: #eff1ed;
  }
  .desc-txt {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #878491;
    margin-bottom: 37px;
  }
  .ant-card-body {
    background-color: #1d1b22;
    padding: 32px;
  }
  .right-side {
    display: flex;
    justify-content: flex-end;
  }
  hr {
    margin-top: 45px;
    border-top: 1px solid #353242;
    text-align: center;
    margin-bottom: 45px;
  }
  hr:after {
    content: '';
    background-image: url(${VectorIconSrc});
    background-repeat: no-repeat;
    padding-top: 22px;
    padding-right: 40px;
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
export const TransferCard = ({ setStep }) => {
  const { isConnected } = useSelect(({ account }) => ({
    isConnected: account.selectIsConnected,
  }));

  const listNetwork = [{ value: 'ic', label: 'ICON blockchain' }];
  return (
    <CardStyled bordered={false} style={{ width: 480 }}>
      <h1>Transfer</h1>
      <div className="content">
        <p className="desc-txt">
          Select an asset and destination chain, to begin or resume a mint.
        </p>

        <div className="send">
          Send <SelectAsset />
        </div>

        <hr />

        <div className="to">
          To <Select options={listNetwork} />
        </div>

        <Row className="button-section">
          {isConnected ? (
            <PrimaryButton width={416} height={64} onClick={() => setStep(1)}>
              Next
            </PrimaryButton>
          ) : (
            <PrimaryButton width={416} height={64} disabled>
              Connect wallet
            </PrimaryButton>
          )}
        </Row>
      </div>
    </CardStyled>
  );
};
