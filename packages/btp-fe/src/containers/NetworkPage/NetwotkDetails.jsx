import { useEffect } from 'react';
import styled from 'styled-components';

import { TextWithIcon } from 'components/TextWithIcon';
import { Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { shortenNumber } from 'utils/app';

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

    .x-small {
      margin-top: 5px;
      color: ${colors.grayScaleSubText};
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
      <TextWithIcon icon={nameToken} width="24px" className="uppercase">
        {nameToken}
      </TextWithIcon>
      <div className="all-time">
        <Text className="small">All time</Text>
        <div className="values">
          <Text className="small uppercase">
            {shortenNumber(volumeAllTime)} {nameToken}
          </Text>
          <Text className="x-small">= ${(volumeAlTimeUSD + '').toLocaleString()}</Text>
        </div>
      </div>

      <div className="devider"></div>

      <div className="one-day">
        <Text className="small">24 hour</Text>
        <div className="values">
          <Text className="small uppercase">
            {shortenNumber(volume24h)} {nameToken}
          </Text>
          <Text className="x-small">= ${(volume24hUSD + '').toLocaleString()}</Text>
        </div>
      </div>
    </NetworkWrapper>
  );
};

export const NetwotkDetails = ({ currentNetworkID }) => {
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
    if (currentNetworkID) getNetworkDetails(currentNetworkID);

    return () => {
      setNetworkDetails([]);
    };
  }, [getNetworkDetails, currentNetworkID, setNetworkDetails]);

  return (
    <Wrapper>
      {networkDetails.map((detail) => (
        <NetWork key={detail.nameToken} detail={detail} />
      ))}
    </Wrapper>
  );
};
