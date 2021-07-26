import styled from 'styled-components/macro';

import { Header, SubTitle } from 'components/Typography';
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
    width: 24.1%;

    .value-bonded,
    .transaction {
      width: 100%;
      height: 150px;
      margin-bottom: 24px;

      .value {
        margin-bottom: 7px;
      }
    }

    .networks {
      width: 100%;
      height: 315px;
      padding: 0 !important;

      .amount-of-networks {
        padding: 23px 32px 0;
      }

      .network-list {
        padding: 27px 8px;

        h3 {
          height: 40px;
          padding: 4px 12px;
          display: flex;
          align-items: center;
          border-radius: 4px;

          &:hover {
            background-color: #312f39;
          }

          img {
            margin-right: 8px;
          }
        }
      }
    }
  }

  .promotion {
    width: 24.1%;
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
        </div>

        <div className="box transaction">
          <TextWithInfo tooltip="Total number of transactions on the BTP Network">
            TRANSACTIONS
          </TextWithInfo>
          <Header className="small bold value" title={totalTransactions}>
            {shortenNumber(totalTransactions)}
          </Header>
        </div>

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
            {networks.map(({ pathLogo, name }) => (
              <SubTitle className="medium bold" key={name}>
                <Icon
                  iconURL={process.env.REACT_APP_BTP_ENDPOINT + pathLogo.substring(1)}
                  width="24px"
                />
                {name}
              </SubTitle>
            ))}
          </div>
        </div>
      </div>

      <Feebox fee={fee} />

      <div className="promotion box"> abc</div>
    </Wrapper>
  );
};
