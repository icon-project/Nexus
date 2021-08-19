import styled from 'styled-components/macro';

import { AssetFeeTable } from './AssetFeeTable';
import { TextWithInfo } from 'components/TextWithInfo';
import { TextMixin } from 'components/Typography/Text';
import { SubTitle } from 'components/Typography';
import { Skeleton } from 'components/Loader';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { toSeparatedNumberString } from 'utils/app';

const Wrapper = styled.div`
  width: 48.57%;
  background-color: ${colors.brandSecondaryBase};
  color: ${colors.grayText};

  .d-flex {
    display: flex;
    justify-content: space-between;
  }

  .medium-text {
    ${TextMixin.md};
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
  .fee-text {
    width: 100%;
  }
  .center-skeleton {
    width: 100%;
    display: flex;
    justify-content: center;
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

export const Feebox = ({ fee, isFetching }) => {
  const { cumulativeAmount, currentAmount, assets = [] } = fee;
  return (
    <Wrapper className="box fee">
      <TextWithInfo className="fee-text" hasInfo={false}>
        FEE
      </TextWithInfo>
      {isFetching ? (
        <div>
          <Skeleton width="480px" height="24px" bottom="12px" />
          <Skeleton width="480px" height="24px" bottom="22px" />
          <Skeleton width="100px" height="24px" bottom="10px" />
          <Skeleton width="480px" height="440px" bottom="12px" />
          <div className="center-skeleton">
            <Skeleton width="236px" height="32px" />
          </div>
        </div>
      ) : (
        <>
          <div className="cumulative-amount d-flex">
            <TextWithInfo
              tooltip="Total cumulative amount that the Fee Aggregation SCORE has received"
              className="medium-text"
            >
              Total cumulative amount
            </TextWithInfo>
            <SubTitle className="md bold">
              {cumulativeAmount ? toSeparatedNumberString(cumulativeAmount) : 0}
            </SubTitle>
          </div>
          <div className="current-amount d-flex">
            <TextWithInfo
              tooltip="Total current amount of fee in the Fee Aggregation SCORE"
              className="medium-text"
            >
              Total current amount of fee
            </TextWithInfo>
            <SubTitle className="md bold">
              {currentAmount ? toSeparatedNumberString(currentAmount) : 0}
            </SubTitle>
          </div>
          <TextWithInfo tooltip="Amount of fee for each asset" className="asset-fee medium-text">
            Asset fee
          </TextWithInfo>
          <AssetFeeTable assets={assets} />
        </>
      )}
    </Wrapper>
  );
};
