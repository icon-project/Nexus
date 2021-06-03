import styled from 'styled-components/macro';

import { Heading } from './Heading';
import { Text } from 'components/Typography';
import { AssetFeeTable } from './AssetFeeTable';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import infoIcon from '../../assets/images/info-icon.svg';

const StyledText = styled(Text)`
  display: flex;
  align-items: center;

  img {
    margin-left: 8.67px;
  }
`;

const TextWithInfo = ({ children, className }) => (
  <StyledText className={`medium ${className}`}>
    {children}
    <img src={infoIcon} alt="icon" />
  </StyledText>
);

const Wrapper = styled.div`
  width: 48.57%;
  background-color: ${colors.brandSecondaryBase};
  color: ${colors.grayText};

  .d-flex {
    display: flex;
    justify-content: space-between;
  }

  .cumulative-amount {
    margin-bottom: 12px;
  }

  .current-amount {
    margin-bottom: 22px;
  }

  .asset-fee {
    margin-bottom: 12px;
  }

  ${media.xl`
    .d-flex {
      flex-direction: column;

      span {
        margin-top: 12px;
      }
    }
  `}
`;

export const Feebox = () => {
  return (
    <Wrapper className="box fee">
      <Heading hasInfo={false}>FEE</Heading>
      <div className="cumulative-amount d-flex">
        <TextWithInfo>Total cumulative amount</TextWithInfo>
        <span>1,3948535.42</span>
      </div>
      <div className="current-amount d-flex">
        <TextWithInfo>Total current amount of fee</TextWithInfo>
        <span>3,49584834.42</span>
      </div>
      <TextWithInfo className="asset-fee">Asset fee</TextWithInfo>
      <AssetFeeTable />
    </Wrapper>
  );
};
