/* eslint-disable react/display-name */
import styled from 'styled-components';
import { Header, Text } from '../Typography';
import { Tag } from 'components/Tag';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Icon } from '../Icon/Icon';
import { colors } from '../Styles/Colors';
import { Table } from 'antd';
import closeIcon from '../../assets/images/close-icon.svg';
import { hashShortener } from '../../utils/app';
import { media } from '../Styles/Media';
const TableStyled = styled(Table)`
  width: 100%;
  .ant-table-content {
    font-family: Poppins;
  }
  .ant-table-tbody {
    background-color: ${colors.grayBG};
    color: ${colors.grayText};
    font-size: 14px;
    line-height: 20px;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid ${colors.grayLine};
  }
  .ant-table-thead > tr > th {
    background: ${colors.grayBG};
    font-size: 14px;
    color: ${colors.grayText};
    border-bottom: 1px solid ${colors.grayLine};
    font-weight: 400;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 13px 14px;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: ${colors.grayBG};
  }
  ${media.md`
    .ant-table-content {
      overflow-x: auto;
    }
  `};
`;
const StyledHistoryDetails = styled.div`
  min-height: 100vh;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  z-index: 1;
  .history-details {
    width: 840px;
    height: fit-content;
    background: ${colors.grayBG};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 123px;
    padding: 23px 32px 26px 32px;
    overflow-y: auto;
    max-height: 90vh;
}
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
  .close-btn {
    background: url('${closeIcon}');
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    justify-self: end;
    align-self: center;
    position: absolute;
    right: 0;
    bottom: 9px;
  }
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
      <div>
        <span className="copy-address">{text}</span>(BVP)
      </div>
    ),
  },
  {
    title: 'From',
    dataIndex: 'from',
    render: (text) => (
      <div>
        <span className="copy-address">{text}</span>(BVP)
      </div>
    ),
  },
  {
    title: 'To',
    dataIndex: 'to',
    render: (text) => (
      <div>
        <span className="copy-address">{text}</span>(BVP)
      </div>
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
    <StyledHistoryDetails>
      <div className="history-details">
        <Header className="small bold heading">
          Transfer details
          <button className="close-btn" onClick={() => onClose()} />
        </Header>
        <div className="content">
          <Text className="medium">Transaction hash</Text>
          <CopyToClipboard text={details.details}>
            <span className="copy-address">
              {hashShortener(details.details)}
              <Icon icon="copy" size="s" />
            </span>
          </CopyToClipboard>
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
          <Text className="medium">55 seconds ago (May-11-2021 07:52:44 AM +UTC)</Text>
        </div>
        <div className="content">
          <Text className="medium">From</Text>
          <Text className="medium">
            <CopyToClipboard text={'0x42A5...b3Df'}>
              <div>
                (Binance Smart Chain){' '}
                <span className="copy-address">
                  0x42A5...b3Df
                  <Icon icon="copy" size="s" />
                </span>
              </div>
            </CopyToClipboard>
          </Text>
        </div>
        <div className="content">
          <Text className="medium">To</Text>
          <Text className="medium">
            <CopyToClipboard text={'0x3C53...5C5e'}>
              <div>
                (Edgeware){' '}
                <span className="copy-address">
                  0x3C53...5C5e
                  <Icon icon="copy" size="s" />
                </span>
              </div>
            </CopyToClipboard>
          </Text>
        </div>
        <div className="internal-trx">
          <Text className="medium">Internal transactions</Text>
        </div>
        <div className="content">
          <TableStyled columns={columns} dataSource={dataSource} pagination={false} />
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
  );
};
