import styled from 'styled-components/macro';
import { useSelect } from 'hooks/useRematch';

import { TextWithInfo } from 'components/TextWithInfo';
import { Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';
import { Skeleton } from 'components/Loader';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';
import { toSeparatedNumberString } from 'utils/app';

import bgImg from 'assets/images/many-lines.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  > .value {
    width: 48.9%;
    height: 169px;
    padding: 32px;
    background: ${colors.brandSecondaryBase} right / contain no-repeat url('${bgImg}');
    border-radius: 4px;
    display: flex;
    flex-direction: column;

    > p.percent {
      margin-top: 12px;
    }
  }

  ${media.xl`
    flex-direction: column;

    > .value {
      width: 100%;
      height: fit-content;

      &:first-child{
        margin-bottom: 24px;
      }

      .header-text {
        word-break: break-all;
      }
    }
  `}
`;

export const ValuesArea = ({ isFetching, data }) => {
  const { volume = 0, volumeLast24hChange, mintVolumeLast24hChange } = data;
  const { valueMint = 0 } = useSelect(({ app: { selectValueMint } }) => ({
    valueMint: selectValueMint,
  }));

  return (
    <Wrapper>
      <div className="value">
        <TextWithInfo tooltip="Total amount of volume transacted via BTP in $">VOLUME</TextWithInfo>
        {isFetching ? (
          <>
            <Skeleton width="337px" height="48px" bottom="12px" />
            <Skeleton width="120px" height="20px" />
          </>
        ) : (
          <>
            <Header className="md bold">${toSeparatedNumberString(volume)}</Header>
            <UpDownPercent percent={volumeLast24hChange} />
          </>
        )}
      </div>
      <div className="value">
        <TextWithInfo
          tooltip="Total value (TVL) of all digital assets currently minted on each blockchain by BTP in $"
          width={300}
        >
          VALUE MINT
        </TextWithInfo>
        {isFetching ? (
          <>
            <Skeleton width="337px" height="48px" bottom="12px" />
            <Skeleton width="120px" height="20px" />
          </>
        ) : (
          <>
            <Header className="md bold">${toSeparatedNumberString(valueMint)} </Header>
            <UpDownPercent percent={mintVolumeLast24hChange} />
          </>
        )}
      </div>
    </Wrapper>
  );
};
