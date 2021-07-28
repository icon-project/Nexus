/* eslint-disable react/display-name */
import { useEffect } from 'react';
import styled from 'styled-components';

import { Table } from 'components/Table';
import { Header } from 'components/Typography';

import { colors } from 'components/Styles/Colors';
import { Text } from 'components/Typography';
import { media } from 'components/Styles/Media';
import { UpDownPercent } from 'components/UpDownPercent';

import { useDispatch, useSelect } from 'hooks/useRematch';

const columns = [
  {
    title: '#',
    dataIndex: 'rank',
    width: '64px',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '282px',
  },
  {
    title: 'Bonded ICX',
    dataIndex: 'bondedICX',
    width: '241px',
  },
  {
    title: 'Server status',
    dataIndex: 'serverStatus',
    width: '132px',
  },
  {
    title: 'Transferred transaction',
    dataIndex: 'transferredTransactions',
    width: '214px',
  },
  {
    title: 'Failed transaction',
    dataIndex: 'failedTransactions',
    width: '214px',
  },
];

const GovernanceStyled = styled.div`
  max-width: 1120px;
  margin: auto;
  .main {
    display: flex;
    justify-content: center;
    .content {
      ${media.md`
      width: ${`${window.screen.width}px`};
    `}
    }
  }
  .header-text {
    padding: 48px 0 50px 0;
    ${media.md`
      padding: 20px 0 20px 20px;
    `}
  }

  .iconex {
    width: 20px;
    margin-right: 12px;
  }
  .vl {
    border-left: 1px solid ${colors.grayLine};
    height: 50px;
    margin-left: 77px;
    margin-right: 100px;
  }
  .total {
    display: flex;
    align-items: center;
    margin: 72px 0 32px 150px;
  }
  .total-text {
    color: ${colors.graySubText};
    margin-bottom: 10px;
  }
  .heading-area {
    display: inline-flex;
  }
  .total-value {
    display: inline-block;
    margin-right: 9.33px;
  }

  ${media.md`
    .heading-area {
      display: block;
    }

    .total {
      margin: 0px 0 24px 20px;
      flex-direction: column;
      align-items: flex-start;

      .large {
          font-size: 32px;
      }

      .vl {
        display: none;
      }
    }
  `}
`;

function GovernancePage() {
  const { relayCandidates, totalRewardFund, registeredRelayLast24h, rewardLast30Days } = useSelect(
    ({
      governance: {
        selectRelayCandidates,
        selectTotalRewardFund,
        selectRegisteredRelayLast24h,
        selectRewardLast30Days,
      },
    }) => ({
      relayCandidates: selectRelayCandidates,
      totalRewardFund: selectTotalRewardFund,
      registeredRelayLast24h: selectRegisteredRelayLast24h,
      rewardLast30Days: selectRewardLast30Days,
    }),
  );

  const { getRelayCandidates, getRegisteredRelayLast24h } = useDispatch(
    ({ governance: { getRelayCandidates, getRegisteredRelayLast24h } }) => ({
      getRelayCandidates,
      getRegisteredRelayLast24h,
    }),
  );

  useEffect(() => {
    getRelayCandidates();
    getRegisteredRelayLast24h();
  }, [getRelayCandidates, getRegisteredRelayLast24h]);

  return (
    <GovernanceStyled>
      <div className="content">
        <div className="heading-area">
          <Header className="md bold">Governance</Header>
          <div className="total">
            <div className="total-wrapper">
              <Text className="small bold total-text">TOTAL REGISTERED</Text>
              <Text className="large bold total-value">{relayCandidates.length}</Text>
              <UpDownPercent percent={registeredRelayLast24h} />
            </div>
            <div className="vl"></div>
            <div className="total-wrapper">
              <Text className="small bold total-text">TOTAL REWARD FUND</Text>
              <Text className="large bold total-value">{totalRewardFund}</Text>
              <UpDownPercent percent={rewardLast30Days} label="past 30 days" />
            </div>
          </div>
        </div>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={relayCandidates}
          pagination={false}
          headerColor={colors.grayAccent}
          backgroundColor={colors.darkBG}
          hoverColor={colors.darkBG}
          bodyText={'md'}
        />
      </div>
    </GovernanceStyled>
  );
}

export default GovernancePage;
