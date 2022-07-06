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
import { chainConfigs } from 'connectors/chainConfigs';

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
  }

  .icon {
    margin-left: 8.83px;
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

const CopyAddress = ({ text, href }) => {
  return (
    <>
      {href && (
        <>
          <a href={href} className="copy-address" target="_blank" rel="noreferrer">
            {hashShortener(text)}
          </a>
          <CopyToClipboard text={text}>
            <span>
              <Icon icon="copy" color="#878491" width="18.33px" />
            </span>
          </CopyToClipboard>
        </>
      )}
    </>
  );
};

const exploreURL = {
  ICON: {
    transaction: 'transaction/',
  },
  HARMONY: {
    transaction: 'tx/',
  },
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

  const {
    tokenName,
    networkNameSrc,
    value,
    status,
    blockTime,
    fromAddress,
    networkNameDst,
    toAddress,
    networkFee,
    bptFee,
    nativeToken,
  } = details || {};

  const tokenPrice = useTokenToUsd(tokenName, 1);
  const nativeTokenPrice = useTokenToUsd(nativeToken, 1, tokenName !== nativeToken);
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
                <CopyAddress
                  text={txHash}
                  href={
                    chainConfigs[networkNameSrc]?.EXPLORE_URL +
                    exploreURL[networkNameSrc]?.transaction +
                    txHash
                  }
                />
              </Text>
            </div>

            <div className="content">
              <Text className="md">Amount</Text>
              <Text className="md">
                {value} {tokenName} (~ ${toSeparatedNumberString(tokenPrice * value)})
              </Text>
            </div>

            <div className="content">
              <Text className="md">Status</Text>
              <Tag color={getStatus(status).color}>{getStatus(status).text}</Tag>
            </div>
            <div className="content">
              <Text className="md">Time</Text>
              <Text className="md">
                {dayjs(blockTime).fromNow()}{' '}
                <span className="hide-in-mobile">
                  ({dayjs(blockTime).format('MMM-DD-YYYY hh:mm:ss A Z')})
                </span>
              </Text>
            </div>

            <div className="content">
              <Text className="md">From</Text>
              <Text className="md">
                <span className="hide-in-mobile">({networkNameSrc || 'Unknown'}) </span>
                <CopyAddress
                  text={fromAddress}
                  href={
                    networkNameSrc
                      ? chainConfigs[networkNameSrc]?.EXPLORE_URL + 'address/' + fromAddress
                      : null
                  }
                />
              </Text>
            </div>

            <div className="content">
              <Text className="md">To</Text>
              <Text className="md">
                <span className="hide-in-mobile">({networkNameDst || 'Unknown'}) </span>
                <CopyAddress
                  text={toAddress}
                  href={
                    networkNameDst
                      ? chainConfigs[networkNameDst]?.EXPLORE_URL +
                        'address/' +
                        toAddress.split('/')[3]
                      : null
                  }
                />
              </Text>
            </div>

            <div className="content">
              <Text className="md">Network fee</Text>
              <Text className="md">
                {networkFee} {nativeToken} (~ $
                {toSeparatedNumberString(
                  (tokenName === nativeToken ? tokenPrice : nativeTokenPrice) * networkFee,
                )}
                )
              </Text>
            </div>

            <div className="content btp-fee">
              <Text className="md">BTP fee</Text>
              <Text className="md">
                {bptFee} {nativeToken}
              </Text>
            </div>
          </div>
        )}
      </StyledHistoryDetails>
    </Modal>
  );
};
