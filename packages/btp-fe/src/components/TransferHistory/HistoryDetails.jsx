/* eslint-disable react/display-name */
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Tag } from '../Tag';
import { Icon } from '../Icon/Icon';
import { Table } from '../Table';
import { Modal } from '../NotificationModal';

import { hashShortener } from '../../utils/app';

import { Text } from '../Typography';
import { colors } from '../Styles/Colors';
import { media } from '../Styles/Media';

const StyledHistoryDetails = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  .history-details {
    height: fit-content;
    background: ${colors.grayBG};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 23px;
    overflow-y: auto;
    max-height: 65vh;
  }
  .heading {
    text-align: center;
    margin-bottom: 33px;
    width: 100%;
    position: relative;
  }
  .content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 29px;
  }
  .internal-trx {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 9px;
  }
  .copy-address {
    cursor: pointer;
    color: ${colors.tertiaryBase};
    img {
      margin-left: 8.83px;
      width: 18.33px;
      height: 18.33px;
    }
  }
  ${media.md`
    .hide-in-mobile {
      display: none;
    }
  `};
`;
const columns = [
  {
    title: '#',
    dataIndex: 'key',
  },
  {
    title: 'Transaction hash',
    dataIndex: 'hash',
    render: (text) => (
      <Text>
        <span className="copy-address">{text}</span>(BVP)
      </Text>
    ),
  },
  {
    title: 'From',
    dataIndex: 'from',
    render: (text) => (
      <Text>
        <span className="copy-address">{text}</span>(BVP)
      </Text>
    ),
  },
  {
    title: 'To',
    dataIndex: 'to',
    render: (text) => (
      <Text>
        <span className="copy-address">{text}</span>(BVP)
      </Text>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 160,
    render: (text) => <Tag color={getColor(text)}>{text}</Tag>,
  },
  {
    title: 'Block',
    dataIndex: 'block',
  },
];
const getColor = (status) => {
  if (status === 'pending') return colors.warningState;
  if (status === 'success') return colors.successState;
  if (status === 'failed') return colors.errorState;
};
const CopyAddress = ({ text }) => {
  return (
    <CopyToClipboard text={text}>
      <span className="copy-address">
        {hashShortener(text)}
        <Icon icon="copy" size="s" />
      </span>
    </CopyToClipboard>
  );
};
export const HistoryDetails = ({ details, onClose }) => {
  const dataSource = [];
  for (let i = 1; i < 4; i++) {
    dataSource.push({
      key: i,
      hash: '0xA7AE...2107',
      from: '0xA7AE...2107',
      to: '0x5E67...16D3',
      status: details.status,
      block: 12411916,
    });
  }
  return (
    <Modal
      display
      title="Transfer details"
      width="840px"
      marginTop="123px"
      setDisplay={() => onClose()}
    >
      <StyledHistoryDetails>
        <div className="history-details">
          <div className="content">
            <Text className="medium">Transaction hash</Text>
            <Text className="medium">
              <CopyAddress text={details.details} />
            </Text>
          </div>
          <div className="content">
            <Text className="medium">Amount</Text>
            <Text className="medium">{details.amount}</Text>
          </div>
          <div className="content">
            <Text className="medium">Status</Text>
            <Tag color={getColor(details.status)}>{details.status}</Tag>
          </div>
          <div className="content">
            <Text className="medium">Time</Text>
            <Text className="medium">
              55 seconds ago <span className="hide-in-mobile">(May-11-2021 07:52:44 AM +UTC)</span>
            </Text>
          </div>
          <div className="content">
            <Text className="medium">From</Text>
            <Text className="medium">
              <span className="hide-in-mobile">(Binance Smart Chain) </span>
              <CopyAddress text={'0x42A5sabfSDFS4fsdfsdsdfsdf$b3Df'} />
            </Text>
          </div>
          <div className="content">
            <Text className="medium">To</Text>
            <Text className="medium">
              <span className="hide-in-mobile">(Edgeware) </span>
              <CopyAddress text={'0x3C53asCCSDDSasfsf432434323242323DSFDSF5C5e'} />
            </Text>
          </div>
          <div className="internal-trx">
            <Text className="medium">Internal transactions</Text>
          </div>
          <div className="content">
            <Table
              headerColor={colors.grayBG}
              backgroundColor={colors.grayBG}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              hoverColor={colors.grayBG}
            />
          </div>
          <div className="content">
            <Text className="medium">Network fee</Text>
            <Text className="medium">0.010094175 Ether ($39.78)</Text>
          </div>
          <div className="content">
            <Text className="medium">BTP fee</Text>
            <Text className="medium">0.000000480675 Ether</Text>
          </div>
        </div>
      </StyledHistoryDetails>
    </Modal>
  );
};
