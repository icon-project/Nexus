import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { Loader } from 'components/Loader';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { shortenNumber, toSeparatedNumberString } from 'utils/app';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  margin-top: 13px;

  max-height: 70vh;
  overflow-x: auto;

  ${media.md`
    grid-template-columns: 1fr;
    max-height: 100vh;
  `};
  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #57565a;
  }
`;

const NetworkWrapper = styled.div`
  padding: 16px 32px 20px;
  border-radius: 4px;
  background-color: ${colors.brandSecondaryBase};

  .uppercase {
    text-transform: uppercase;
  }

  .all-time,
  .one-day {
    display: flex;
    justify-content: space-between;

    .plain-text.xs {
      margin-top: 5px;
      color: ${colors.grayScaleSubText};
    }

    .values {
      text-align: right;
    }
  }

  .all-time {
    margin-top: 19px;
  }

  .devider {
    border-bottom: solid 1px ${colors.grayLine};
    margin: 12px 0;
  }
`;

const NetWork = ({ detail = {} }) => {
  const { nameToken, volume24h, volume24hUSD, volumeAlTimeUSD, volumeAllTime } = detail;

  return (
    <NetworkWrapper>
      <Text className="md uppercase">{nameToken}</Text>
      <div className="all-time">
        <Text className="sm">All time</Text>
        <div className="values">
          <Text className="sm uppercase">
            {shortenNumber(volumeAllTime)} {nameToken}
          </Text>
          <Text className="xs">= ${toSeparatedNumberString(volumeAlTimeUSD)}</Text>
        </div>
      </div>

      <div className="devider"></div>

      <div className="one-day">
        <Text className="sm">24 hour</Text>
        <div className="values">
          <Text className="sm uppercase">
            {shortenNumber(volume24h)} {nameToken}
          </Text>
          <Text className="xs">= ${toSeparatedNumberString(volume24hUSD)}</Text>
        </div>
      </div>
    </NetworkWrapper>
  );
};

export const NetwotkDetails = ({ currentNetworkID }) => {
  const [loading, setLoading] = useState(true);

  const { networkDetails = [] } = useSelect(({ network: { selectNetworkDetails } }) => ({
    networkDetails: selectNetworkDetails,
  }));

  const { getNetworkDetails, setNetworkDetails } = useDispatch(
    ({ network: { getNetworkDetails, setNetworkDetails } }) => ({
      getNetworkDetails,
      setNetworkDetails,
    }),
  );

  useEffect(() => {
    if (currentNetworkID) getNetworkDetails(currentNetworkID).then(() => setLoading(false));

    return () => {
      setNetworkDetails([]);
    };
  }, [getNetworkDetails, currentNetworkID, setNetworkDetails]);

  return (
    <>
      {loading ? (
        <Loader size="40px" borderSize="3px" />
      ) : (
        <Wrapper>
          {networkDetails.map((detail) => (
            <NetWork key={detail.nameToken} detail={detail} />
          ))}
        </Wrapper>
      )}
    </>
  );
};
