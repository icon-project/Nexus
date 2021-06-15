import styled from 'styled-components/macro';

import { AssetFeeTable } from './AssetFeeTable';
import { TextWithInfo } from 'components/TextWithInfo';
import { mediumText } from 'components/Typography/Text';
import { SubTitle } from 'components/Typography';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  width: 48.57%;
  background-color: ${colors.brandSecondaryBase};
  color: ${colors.grayText};

  .d-flex {
    display: flex;
    justify-content: space-between;
  }

  .medium-text {
    color: ${colors.grayText};
    ${mediumText};
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

export const Feebox = ({ fee }) => {
  const { cumulativeAmount, currentAmount } = fee;
  return (
    <Wrapper className="box fee">
      <TextWithInfo hasInfo={false}>FEE</TextWithInfo>
      <div className="cumulative-amount d-flex">
        <TextWithInfo className="medium-text">Total cumulative amount</TextWithInfo>
        <SubTitle className="medium bold">{cumulativeAmount.toLocaleString()}</SubTitle>
      </div>
      <div className="current-amount d-flex">
        <TextWithInfo className="medium-text">Total current amount of fee</TextWithInfo>
        <SubTitle className="medium bold">{currentAmount.toLocaleString()}</SubTitle>
      </div>
      <TextWithInfo className="asset-fee">Asset fee</TextWithInfo>
      <AssetFeeTable />
    </Wrapper>
  );
};
