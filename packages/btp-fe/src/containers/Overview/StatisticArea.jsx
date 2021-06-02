import styled from 'styled-components/macro';

import { Heading } from './Heading';
import { Header, SubTitle, Link } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';
import { Icon } from 'components/Icon';
import { Feebox } from './FeeBox';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .box {
    padding: 27px 32px;
    border-radius: 4px;
    background-color: ${colors.brandSecondaryBase};
  }

  .transaction {
    display: flex;
    flex-direction: column;
    width: 23.57%;

    .value-bonded,
    .transaction {
      width: 100%;
      height: 150px;
      .value {
        margin-bottom: 7px;
      }
    }

    .value-bonded {
      margin-bottom: 24px;
    }
  }

  .networks {
    width: 23.57%;
    height: 324px;
    padding: 27px 0 32px;
    background-color: ${colors.brandSecondaryBase};

    .amount-of-networks {
      padding: 0 23.67px 0 32px;
    }

    .network-list {
      margin: 23px 0;
      padding: 0 15px;

      h3 {
        height: 40px;
        padding: 0 12px;
        display: flex;
        align-items: center;

        &:hover {
          background-color: #312f39;
        }

        img {
          margin-right: 8px;
        }
      }
    }
  }

  ${media.xl`
    flex-direction: column;

    .transaction, .fee, .networks {
      width: 100%;
      margin-bottom: 24px;
    }

    .transaction {
    }


  `}
`;

const networks = [
  { icon: 'binance', name: 'Binance Smart Chain' },
  { icon: 'edgeware', name: 'Edgeware' },
  { icon: 'iconex', name: 'ICON blockchain' },
];

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

      <Feebox />

      <div className="networks box">
        <div className="amount-of-networks">
          <Heading>NETWORKS CONNECTED</Heading>
          <Header className="small bold value">3</Header>
        </div>

        <div className="network-list">
          {networks.map(({ icon, name }) => (
            <SubTitle className="small bold" key={name}>
              <Icon icon={icon} width="24px" />
              {name}
            </SubTitle>
          ))}
        </div>
        <Link className="x-small" to="#" center>
          See all
        </Link>
      </div>
    </Wrapper>
  );
};
