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
import { txStatus } from 'utils/constants';

import { Text } from 'components/Typography';
import { colors, media, mixins } from 'components/Styles';
import { chainConfigs, chainList } from 'connectors/chainConfigs';

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

    ${mixins.scrollBar};
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
  if (statusCode === txStatus.PENDING) {
    color = colors.warningState;
    text = 'Pending';
  } else if (statusCode === txStatus.FAILED) {
    color = colors.errorState;
    text = 'Failed';
  }

  return {
    color,
    text,
  };
};

const CopyAddress = ({ text, href, copyText }) => {
  return (
    <>
      {href && (
        <>
          <a href={href} className="copy-address" target="_blank" rel="noreferrer">
            {hashShortener(text)}
          </a>
          <CopyToClipboard text={copyText || text}>
            <span>
              <Icon icon="copy" color="#878491" width="18.33px" />
            </span>
          </CopyToClipboard>
        </>
      )}
    </>
  );
};

const statusText = 'txStatus';
export const HistoryDetails = ({ txHash, onClose }) => {
  const [details, setDetails] = useState({});
  const [isFetching, setIsFetching] = useState(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const getTransactionDetails = async () => {
      try {
        const status = sessionStorage.getItem(statusText);
        if (!status || status == txStatus.PENDING) {
          const transferData = await getTransferHistoryByTxHash(txHash);
          setDetails(() => transferData.content);
          setIsFetching(() => false);
          sessionStorage.setItem(statusText, transferData?.content?.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTransactionDetails();
    const intervalFetch = setInterval(getTransactionDetails, 3000);

    return () => {
      sessionStorage.removeItem(statusText);
      clearInterval(intervalFetch);
    };
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
  const toAddresssOnly = toAddress?.split('/')[3];

  const getChain = (chainName) =>
    chainList.find(({ CHAIN_NAME }) => CHAIN_NAME?.toLowerCase() === chainName?.toLowerCase());

  const srcChain = chainConfigs[getChain(networkNameSrc)?.id];
  const dstChain = chainConfigs[getChain(networkNameDst)?.id];

  return (
    <Modal display title="Transfer details" width="840px" setDisplay={() => onClose()}>
      <StyledHistoryDetails>
        {isFetching ? (
          <Loader size="24px" borderSize="2px" />
        ) : (
          <div className="history-details">
            <div className="content">
              <Text className="md">Transaction hash</Text>
              <Text className="md">
                <CopyAddress
                  text={txHash}
                  href={
                    srcChain?.EXPLORE_URL + (srcChain?.exploreSuffix?.transaction || 'tx/') + txHash
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
                      ? srcChain?.EXPLORE_URL +
                        (srcChain?.exploreSuffix?.address || 'address/') +
                        fromAddress
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
                  copyText={toAddresssOnly}
                  href={
                    networkNameDst
                      ? dstChain?.EXPLORE_URL +
                        (dstChain?.exploreSuffix?.address || 'address/') +
                        toAddresssOnly
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
                {bptFee} {tokenName}
              </Text>
            </div>
          </div>
        )}
      </StyledHistoryDetails>
    </Modal>
  );
};
