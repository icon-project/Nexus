import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { Header, SubTitle } from 'components/Typography';
import { SubTitleMixin } from 'components/Typography/SubTitle';
import { Icon } from 'components/Icon';
import { TextWithInfo } from 'components/TextWithInfo';
import { PrimaryButton } from 'components/Button';
import { Feebox } from './FeeBox';
import { Skeleton } from 'components/Loader';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { shortenNumber } from 'utils/app';
import tokenBg from 'assets/images/token-promotion.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .box {
    padding: 27px 32px;
    border-radius: 4px;
    background-color: ${colors.brandSecondaryBase};
  }

  > .transaction {
    display: flex;
    flex-direction: column;
    width: 22.9%;

    > .value-bonded,
    > .transaction {
      width: 100%;
      height: 150px;
      margin-bottom: 32px;

      .header-text {
        margin-bottom: 7px;
      }
    }

    > .networks {
      width: 100%;
      height: 315px;
      padding: 0 !important;

      > .amount-of-networks {
        padding: 23px 15.67px 0 32px;
      }

      > .network-list {
        padding: 23px 8px;

        .subtitle-text {
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

  > .promotion {
    width: 22.9%;
    min-height: 650px;

    text-align: center;
    padding: 50px 32px;
    border-radius: 4px;
    background: ${colors.brandSecondaryBase} bottom / contain no-repeat url('${tokenBg}');

    > .header-text {
      margin-bottom: 12px;
    }

    > .subtitle-text {
      margin-bottom: 27px;
    }

    .start-to-transfer {
      padding: 0;
      ${SubTitleMixin.smBold};
    }
  }
  .flex {
    display: flex;
  }
  .inline {
    display: inline-grid;
  }

  ${media.xl`
    flex-direction: column;
    > .transaction, > .fee, > .networks, > .promotion {
      width: 100%;
      margin-bottom: 24px;
    }
  `}
`;

export const StatisticArea = ({ data, networks, isFetching }) => {
  const { fee = {}, totalTransactions = 0, bondedValue } = data;
  const totalNetworks = networks.length;
  return (
    <Wrapper>
      <div className="transaction">
        <div className="box value-bonded">
          <TextWithInfo className="flex" tooltip="Total collective value bonded by Relays">
            VALUE BONDED
          </TextWithInfo>
          {isFetching ? (
            <Skeleton width="125px" height="36px" />
          ) : (
            <Header className="sm bold" title={bondedValue}>
              {shortenNumber(bondedValue)}
            </Header>
          )}
        </div>

        <div className="box transaction">
          <TextWithInfo className="flex" tooltip="Total number of transactions on the BTP Network">
            TRANSACTIONS
          </TextWithInfo>
          {isFetching ? (
            <Skeleton width="125px" height="36px" />
          ) : (
            <Header className="sm bold" title={totalTransactions}>
              {shortenNumber(totalTransactions)}
            </Header>
          )}
        </div>

        <div className="networks box">
          <div className="amount-of-networks">
            <TextWithInfo
              className="flex"
              tooltip="Total number of transactions on the BTP Network"
            >
              NETWORKS CONNECTED
            </TextWithInfo>
            {isFetching ? (
              <div className="inline">
                <Skeleton width="60px" height="36px" bottom="23px" />
                <Skeleton bottom="12px" />
                <Skeleton bottom="12px" />
                <Skeleton bottom="12px" />
                <Skeleton />
              </div>
            ) : (
              <Header className="sm bold">{totalNetworks}</Header>
            )}
          </div>

          {!isFetching && (
            <div className="network-list">
              {networks.map(({ pathLogo, name }) => (
                <SubTitle className="md bold" key={name}>
                  <Icon
                    iconURL={process.env.REACT_APP_BTP_ENDPOINT + pathLogo.substring(1)}
                    width="24px"
                  />
                  {name}
                </SubTitle>
              ))}
            </div>
          )}
        </div>
      </div>

      <Feebox fee={fee} isFetching={isFetching} />

      <div className="promotion">
        <Header className="xs bold">Transfer your token to many networks</Header>
        <SubTitle className="sm">More than 30+ cryptocurrencies for swap and auction</SubTitle>
        <Link to="/transfer">
          <PrimaryButton width={161} height={44} className="start-to-transfer">
            Start to transfer
          </PrimaryButton>
        </Link>
      </div>
    </Wrapper>
  );
};
