import styled from 'styled-components/macro';

import { ChartBox } from './ChartBox';

import { TextWithInfo } from 'components/TextWithInfo';
import { Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  .chart {
    width: 48.9%;
    height: 548px;
    padding: 32px;
    background-color: ${colors.brandSecondaryBase};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    ${media.sm`
      height: 595px;
    `}
  }

  ${media.xl`
    flex-direction: column;

    .chart {
      width: 100%;

      &:first-child{
        margin-bottom: 24px;
      }

      h3 {
        word-break: break-all;
      }
    }
  `}
`;

export const ChartArea = ({ volume = 0 }) => {
  return (
    <Wrapper>
      <div className="chart">
        <TextWithInfo tooltip="Total amount of volume transacted via BTP in $">VOLUME</TextWithInfo>
        <Header className="medium bold inline">
          ${volume.toLocaleString()} <UpDownPercent up percent="9.55%" />
        </Header>
        <ChartBox />
      </div>
      <div className="chart">
        <TextWithInfo tooltip="Total amount of mint transacted via BTP in $" width={300}>
          VALUE MINT
        </TextWithInfo>
        <Header className="medium bold inline">
          $892,797,895.53 <UpDownPercent up percent="9.55%" />
        </Header>
        <ChartBox />
      </div>
    </Wrapper>
  );
};