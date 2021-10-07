import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useTokenToUsd } from 'hooks/useTokenToUsd';

import { Tag } from 'components/Tag';
import { Icon } from 'components/Icon/Icon';
import { Loader } from 'components/Loader';
import { Modal } from 'components/NotificationModal';

import { getTransferHistoryByTxHash } from 'services/btpServices';
import { hashShortener, toSeparatedNumberString } from 'utils/app';

import { Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

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
    > .icon {
      margin-left: 8.83px;
      vertical-align: middle;
    }
  }
  ${media.md`
    .hide-in-mobile {
      display: none;
    }
  `};
`;

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
        <Icon icon="copy" color="#878491" width="18.33px" />
      </span>
    </CopyToClipboard>
  );
};
export const HistoryDetails = ({ txHash, onClose }) => {
  const [details, setDetails] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const getTransactionDetails = async () => {
      try {
        const transferData = await getTransferHistoryByTxHash(txHash);
        setDetails(transferData.content);
        setIsFetching(false);
      } catch (error) {
        console.log(error);
      }
    };
    getTransactionDetails();
  }, [txHash]);
  const tokenPrice = useTokenToUsd(details.tokenName, 1);
  return (
    <Modal display title="Transfer details" width="840px" setDisplay={() => onClose()}>
      <StyledHistoryDetails>
        {isFetching ? (
          <Loader size={'24px'} borderSize={'2px'} />
        ) : (
          <div className="history-details">
            <div className="content">
              <Text className="md">Transaction hash</Text>
              <Text className="md">
                <CopyAddress text={details.txHash} />
              </Text>
            </div>

            <div className="content">
              <Text className="md">Amount</Text>
              <Text className="md">
                {details.value} {details.tokenName} (= $
                {toSeparatedNumberString(tokenPrice * details.value)})
              </Text>
            </div>

            <div className="content">
              <Text className="md">Status</Text>
              <Tag color={getStatus(details.status).color}>{getStatus(details.status).text}</Tag>
            </div>
            <div className="content">
              <Text className="md">Time</Text>
              <Text className="md">
                {dayjs(details.blockTime).fromNow()}{' '}
                <span className="hide-in-mobile">
                  ({dayjs(details.blockTime).format('MMM-DD-YYYY hh:mm:ss A Z')})
                </span>
              </Text>
            </div>

            <div className="content">
              <Text className="md">From</Text>
              <Text className="md">
                <span className="hide-in-mobile">({details.networkNameSrc || 'Unknown'}) </span>
                <CopyAddress text={details.fromAddress} />
              </Text>
            </div>

            <div className="content">
              <Text className="md">To</Text>
              <Text className="md">
                <span className="hide-in-mobile">({details.networkNameDst || 'Unknown'}) </span>
                <CopyAddress text={details.toAddress} />
              </Text>
            </div>

            <div className="content">
              <Text className="md">Network fee</Text>
              <Text className="md">
                {details.networkFee} {details.tokenName} ( $
                {tokenPrice * toSeparatedNumberString(details.networkFee)})
              </Text>
            </div>

            <div className="content btp-fee">
              <Text className="md">BTP fee</Text>
              <Text className="md">
                {details.bptFee} {details.nativeToken}
              </Text>
            </div>
          </div>
        )}
      </StyledHistoryDetails>
    </Modal>
  );
};
