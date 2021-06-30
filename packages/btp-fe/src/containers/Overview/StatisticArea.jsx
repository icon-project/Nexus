import styled from 'styled-components/macro';

import { Header, SubTitle, Link } from 'components/Typography';
import { UpDownPercent } from 'components/UpDownPercent';
import { Icon } from 'components/Icon';
import { TextWithInfo } from 'components/TextWithInfo';
import { Feebox } from './FeeBox';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { shortenNumber } from 'utils/app';

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
  `}
`;

export const StatisticArea = ({ data, networks }) => {
  const { fee = {}, totalNetworks = 0, totalTransactions = 0, bondedValue } = data;
  return (
    <Wrapper>
      <div className="transaction">
        <div className="box value-bonded">
          <TextWithInfo tooltip="Total collective value bonded by Relays">
            VALUE BONDED
          </TextWithInfo>
          <Header className="small bold value" title={bondedValue}>
            {shortenNumber(bondedValue)}
          </Header>
          <UpDownPercent up percent="12.22%" />
        </div>
        <div className="box transaction">
          <TextWithInfo tooltip="Total number of transactions on the BTP Network">
            TRANSACTIONS
          </TextWithInfo>
          <Header className="small bold value" title={totalTransactions}>
            {shortenNumber(totalTransactions)}
          </Header>
          <UpDownPercent up percent="12.22%" />
        </div>
      </div>

      <Feebox fee={fee} />

      <div className="networks box">
        <div className="amount-of-networks">
          <TextWithInfo
            tooltip="Total number of transactions on the BTP Network"
            direction="bottom"
          >
            NETWORKS CONNECTED
          </TextWithInfo>
          <Header className="small bold value">{totalNetworks}</Header>
        </div>

        <div className="network-list">
          {networks.slice(0, 3).map(({ pathLogo, name }) => (
            <SubTitle className="small bold" key={name}>
              <Icon
                iconURL={process.env.REACT_APP_BTP_ENDPOINT + pathLogo.substring(1)}
                width="24px"
              />
              {name}
            </SubTitle>
          ))}
        </div>
        {networks.length > 3 && (
          <Link className="x-small" to="/network" center>
            See all
          </Link>
        )}
      </div>
    </Wrapper>
  );
};
