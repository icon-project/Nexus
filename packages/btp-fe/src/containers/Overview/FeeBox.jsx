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
    margin-bottom: 2px;
  }

  .current-amount {
    margin-bottom: 12px;
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
  const { cumulativeAmount, currentAmount, assets = [] } = fee;
  return (
    <Wrapper className="box fee">
      <TextWithInfo hasInfo={false}>FEE</TextWithInfo>
      <div className="cumulative-amount d-flex">
        <TextWithInfo
          tooltip="Total cumulative amount that the Fee Aggregation SCORE has received"
          className="medium-text"
        >
          Total cumulative amount
        </TextWithInfo>
        <SubTitle className="medium bold">
          {cumulativeAmount ? cumulativeAmount.toLocaleString() : 0}
        </SubTitle>
      </div>
      <div className="current-amount d-flex">
        <TextWithInfo
          tooltip="Total current amount of fee in the Fee Aggregation SCORE"
          className="medium-text"
        >
          Total current amount of fee
        </TextWithInfo>
        <SubTitle className="medium bold">
          {currentAmount ? currentAmount.toLocaleString() : 0}
        </SubTitle>
      </div>
      <TextWithInfo tooltip="Amount of fee for each asset" className="asset-fee medium-text">
        Asset fee
      </TextWithInfo>
      <AssetFeeTable assets={assets} />
    </Wrapper>
  );
};
