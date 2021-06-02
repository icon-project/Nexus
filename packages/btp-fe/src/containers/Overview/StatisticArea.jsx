import styled from 'styled-components/macro';

import { Heading } from './Heading';
import { Header } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';

import { colors } from 'components/Styles/Colors';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .transaction {
    display: flex;
    flex-direction: column;
    width: 23.57%;

    .box {
      height: 150px;
      width: 100%;
      padding: 27px 32px;
      border-radius: 4px;
      background-color: ${colors.brandSecondaryBase};

      .value {
        margin-bottom: 7px;
      }
    }

    .value-bonded {
      margin-bottom: 24px;
    }
  }

  .fee {
    width: 48.57%;
    background-color: ${colors.brandSecondaryBase};

    height: 324px;
  }

  .networks {
    width: 23.57%;
    background-color: ${colors.brandSecondaryBase};

    height: 324px;
  }
`;

export const StatisticArea = () => {
  return (
    <Wrapper>
      <div className="transaction">
        <div className="box value-bonded">
          <Heading>VALUE BONDED</Heading>
          <Header className="small bold value">1,115.42 M</Header>
          <UpDownPercent up percent="12.22%" />
        </div>
        <div className="box transaction">
          <Heading>TRANSACTIONS</Heading>
          <Header className="small bold value">1,115.42 M</Header>
          <UpDownPercent up percent="12.22%" />
        </div>
      </div>
      <div className="fee"></div>
      <div className="networks"></div>
    </Wrapper>
  );
};
