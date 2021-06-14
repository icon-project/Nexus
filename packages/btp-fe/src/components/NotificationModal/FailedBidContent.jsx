import styled from 'styled-components/macro';
import { Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

const Wrapper = styled.div`
  text-align: left;
  padding-top: 27.17px;

  .subtext {
    margin: 14px 0 9px;
  }

  .x-small {
    color: ${colors.graySubText};

    span {
      color: ${colors.grayText};
    }
  }
`;

export const FailedBidContent = () => {
  return (
    <Wrapper>
      <Text className="medium">Bid failure. Please input proper amount.</Text>
      <Text className="x-small subtext">
        Minimium bid: <span>100</span> ICX
      </Text>
      <Text className="x-small">
        Minimium incremental bid: <span>10%</span> higher than the current bid
      </Text>
    </Wrapper>
  );
};
