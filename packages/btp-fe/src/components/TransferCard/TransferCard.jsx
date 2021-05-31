import styled from 'styled-components';
import { Card as AntCard, Row, Col } from 'antd';

import { requestSigning } from '../../connectors/ICONex/events';
// import { sendTransaction } from '../../connectors/ICONex/iconService';
import IconService, { IconConverter, IconUtil } from 'icon-sdk-js';
const { IconBuilder } = IconService;
const { serialize } = IconUtil;
const { IcxTransactionBuilder } = IconBuilder;

import { SelectNetwork, SelectAsset } from 'components/Select';
import { PrimaryButton } from 'components/Button';
import { media } from '../Styles/Media';

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

  ${media.md`
    width: 90% !important;
  `}
`;
export const TransferCard = () => {
  window.localStorage.setItem('wallet-status', 'connected');
  const isConnected = window.localStorage.getItem('wallet-status') === 'connected';

  const handleTransfer = async () => {
    const from = 'hx1441b48a18321354907f3e0821de66fe0dba9ee8';
    const to = 'hx61ad540fa5ae0176e92bc2a1095b3d319a6589e8';
    const value = IconConverter.toBigNumber(1);
    const stepLimit = IconConverter.toBigNumber(100000);
    const nid = IconConverter.toBigNumber('0xc7c937');
    const nonce = IconConverter.toBigNumber(1);
    const version = IconConverter.toBigNumber(3);
    const timestamp = IconUtil.getCurrentTime() + 1000;
    const icxTransactionBuilder = new IcxTransactionBuilder();
    const testTransaction = icxTransactionBuilder
      .from(from)
      .to(to)
      .value(value)
      .stepLimit(stepLimit)
      .nid(nid)
      .nonce(nonce)
      .version(version)
      .timestamp(timestamp)
      .build();

    const rawTransaction = IconConverter.toRawTransaction(testTransaction);
    console.log(
      '🚀 ~ file: TransferCard.jsx ~ line 93 ~ handleTransfer ~ rawTransaction',
      rawTransaction,
    );
    window.rawTransaction = rawTransaction;
    const transactionHash = serialize(rawTransaction);
    console.log(
      '🚀 ~ file: TransferCard.jsx ~ line 98 ~ handleTransfer ~ transactionHash',
      transactionHash,
    );

    requestSigning({
      from: 'hx1441b48a18321354907f3e0821de66fe0dba9ee8',
      hash: transactionHash,
    });
  };

  return (
    <CardStyled bordered={false} style={{ width: 480 }}>
      <h1>Transfer</h1>
      <div className="content">
        <p className="desc-txt">
          Select an asset and destination chain, to begin or resume a mint.
        </p>
        <Row>
          <Col span={12}>Send</Col>
          <Col span={12} className="right-side">
            <SelectAsset />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col span={12}>To</Col>
          <Col span={12} className="right-side">
            <SelectNetwork />
          </Col>
        </Row>
        <Row className="button-section">
          {isConnected ? (
            <PrimaryButton width={416} height={64} onClick={handleTransfer}>
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
