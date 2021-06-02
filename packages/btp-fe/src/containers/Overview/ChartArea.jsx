import styled from 'styled-components/macro';

import { Heading } from './Heading';
import { ChartBox } from './ChartBox';
import { Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';

import { colors } from 'components/Styles/Colors';

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
  }
`;

export const ChartArea = () => {
  return (
    <Wrapper>
      <div className="chart">
        <Heading>VOLUME</Heading>
        <Header className="medium bold inline">
          $9,672,047,464.01 <UpDownPercent up percent="9.55%" />
        </Header>
        <ChartBox />
      </div>
      <div className="chart"></div>
    </Wrapper>
  );
};
