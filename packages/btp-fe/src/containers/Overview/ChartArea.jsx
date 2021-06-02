import styled from 'styled-components/macro';

import { SubTitle, Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';

import { colors } from 'components/Styles/Colors';

import infoIcon from '../../assets/images/info-icon.svg';

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

    .heading {
      color: ${colors.grayScaleSubText};
      margin-bottom: 10px;
    }
  }
`;

export const ChartArea = () => {
  return (
    <Wrapper>
      <div className="chart">
        <SubTitle className="small bold heading">
          VOLUME <img src={infoIcon} alt="icon" />
        </SubTitle>
        <Header className="medium bold inline">
          $9,672,047,464.01 <UpDownPercent up percent="9.55%" />
        </Header>
      </div>
      <div className="chart"></div>
    </Wrapper>
  );
};
