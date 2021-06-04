import styled from 'styled-components';

import { TextWithIcon } from 'components/TextWithIcon';
import { Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

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

const NetWork = () => {
  return (
    <NetworkWrapper>
      <TextWithIcon icon="btc" width="24px">
        Bitcoin BTC
      </TextWithIcon>
      <div className="all-time">
        <Text className="small">All time</Text>
        <div className="values">
          <Text className="small">54,714.618 BTC</Text>
          <Text className="x-small">= $1,220,152,075.81</Text>
        </div>
      </div>

      <div className="devider"></div>

      <div className="one-day">
        <Text className="small">24 hour</Text>
        <div className="values">
          <Text className="small">177.802 BTC</Text>
          <Text className="x-small">= $10,053,952.70</Text>
        </div>
      </div>
    </NetworkWrapper>
  );
};

export const NetwotkDetails = () => {
  return (
    <Wrapper>
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
      <NetWork />
    </Wrapper>
  );
};
