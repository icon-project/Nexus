/* eslint-disable react/display-name */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useTokenToUsd } from 'hooks/useTokenToUsd';

import { Tag } from '../../components/Tag';
import { Icon } from '../../components/Icon/Icon';
import { Loader } from '../../components/Loader';
import { Modal } from '../../components/NotificationModal';

import { getTransferHistoryById } from 'services/btpServices';
import { hashShortener } from '../../utils/app';

import { Text } from '../../components/Typography';
import { colors } from '../../components/Styles/Colors';
import { media } from '../../components/Styles/Media';

const StyledHistoryDetails = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  .history-details {
    width: 100%;
    height: fit-content;
    background: ${colors.grayBG};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 23px;
    overflow-y: auto;
    max-height: 90vh;
    ${media.smallDesktop`
      max-height: 65vh;
  `};
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
  .btp-fee {
    margin-bottom: 0;
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
// const columns = [
//   {
//     title: '#',
//     dataIndex: 'key',
//   },
//   {
//     title: 'Transaction hash',
//     dataIndex: 'hash',
//     render: (text) => (
//       <Text>
//         <span className="copy-address">{text}</span>(BVP)
//       </Text>
//     ),
//   },
//   {
//     title: 'From',
//     dataIndex: 'from',
//     render: (text) => (
//       <Text>
//         <span className="copy-address">{text}</span>(BVP)
//       </Text>
//     ),
//   },
//   {
//     title: 'To',
//     dataIndex: 'to',
//     render: (text) => (
//       <Text>
//         <span className="copy-address">{text}</span>(BVP)
//       </Text>
//     ),
//   },
//   {
//     title: 'Status',
//     dataIndex: 'status',
//     width: 160,
//     render: (text) => <Tag color={getColor(text)}>{text}</Tag>,
//   },
//   {
//     title: 'Block',
//     dataIndex: 'block',
//   },
// ];
const getStatus = (statusCode) => {
  let color = colors.successState;
  let text = 'Success';
  if (statusCode === 0) {
    color = colors.warningState;
    text = 'Pending';
  } else if (statusCode === -1) {
    color = colors.errorState;
    text = 'Failed';
  }

  return {
    color,
    text,
  };
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
export const HistoryDetails = ({ id, onClose }) => {
  const [details, setDetails] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const getTransactionDetails = async () => {
      try {
        const transferData = await getTransferHistoryById(id);
        setDetails(transferData.content);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    getTransactionDetails();
  }, [id]);
  const tokenPrice = useTokenToUsd(details.tokenName, 1);
  return (
    <Modal display title="Transfer details" width="840px" setDisplay={() => onClose()}>
      <StyledHistoryDetails>
        {isFetching ? (
          <Loader size={'24px'} borderSize={'2px'} />
        ) : (
          <div className="history-details">
            <div className="content">
              <Text className="medium">Transaction hash</Text>
              <Text className="medium">
                <CopyAddress text={details.txHash} />
              </Text>
            </div>
            <div className="content">
              <Text className="medium">Amount</Text>
              <Text className="medium">
                {details.value} {details.tokenName} (= $
                {(tokenPrice * details.value)?.toLocaleString()})
              </Text>
            </div>
            <div className="content">
              <Text className="medium">Status</Text>
              <Tag color={getStatus(details.status).color}>{getStatus(details.status).text}</Tag>
            </div>
            <div className="content">
              <Text className="medium">Time</Text>
              <Text className="medium">
                {dayjs(details.blockTime / 1000).fromNow()}{' '}
                <span className="hide-in-mobile">
                  ({dayjs(details.blockTime / 1000).format('MMM-DD-YYYY hh:mm:ss A Z')})
                </span>
              </Text>
            </div>
            <div className="content">
              <Text className="medium">From</Text>
              <Text className="medium">
                <span className="hide-in-mobile">({details.networkNameSrc || 'Unknown'}) </span>
                <CopyAddress text={details.fromAddress} />
              </Text>
            </div>
            <div className="content">
              <Text className="medium">To</Text>
              <Text className="medium">
                <span className="hide-in-mobile">({details.networkNameDst || 'Unknown'}) </span>
                <CopyAddress text={details.toAddress} />
              </Text>
            </div>
            {/* <div className="internal-trx">
            <Text className="medium">Internal transactions</Text>
          </div>
          <div className="content">
            <Table
              headerColor={colors.grayBG}
              backgroundColor={colors.grayBG}
              columns={columns}
              dataSource={[]}
              pagination={false}
              hoverColor={colors.grayBG}
            />
          </div> */}
            <div className="content">
              <Text className="medium">Network fee</Text>
              <Text className="medium">
                {details.networkFee} {details.tokenName} ( $
                {(tokenPrice * details.networkFee)?.toLocaleString()})
              </Text>
            </div>
            <div className="content btp-fee">
              <Text className="medium">BTP fee</Text>
              <Text className="medium">
                {details.bptFee} {details.nativeToken}
              </Text>
            </div>
          </div>
        )}
      </StyledHistoryDetails>
    </Modal>
  );
};
