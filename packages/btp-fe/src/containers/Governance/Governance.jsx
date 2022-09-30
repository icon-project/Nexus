import { useState, useEffect } from 'react';
import styled from 'styled-components/macro';

import { Table } from 'components/Table';
import { Header } from 'components/Typography';
import { Helmet } from 'components/Helmet';

import { colors } from 'components/Styles/Colors';
import { Text } from 'components/Typography';
import { media } from 'components/Styles/Media';
import { UpDownPercent } from 'components/UpDownPercent';

import { useDispatch, useSelect } from 'hooks/useRematch';
import { toSeparatedNumberString } from 'utils/app';

const columns = [
  {
    title: 'Address',
    dataIndex: 'address',
    width: '500px',
  },
  {
    title: 'Server status',
    dataIndex: 'serverStatus',
    width: '192px',
  },
  {
    title: 'Transferred transaction',
    dataIndex: 'transferredTransactions',
    render: (value) => toSeparatedNumberString(value),
    width: '214px',
  },
  {
    title: 'Failed transaction',
    dataIndex: 'failedTransactions',
    render: (value) => toSeparatedNumberString(value),
    width: '214px',
  },
];

const candidatesColumns = [
  {
    title: '#',
    dataIndex: 'rank',
    render: (text, record, index) => index + 1,
    width: '100px',
    align: 'center',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '400px',
  },
  {
    title: 'Bonded ICX',
    dataIndex: 'bondedICX',
    render: (value) => toSeparatedNumberString(value),
    width: '620px',
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
      padding: 20px 0;
    `}
  }
  .table-name {
    padding: 0 0 25px 0;
  }
  .table-component {
    padding-bottom: 58px;
  }
  .iconex {
    width: 20px;
    margin-right: 12px;
  }
  .vl {
    border-left: 1px solid ${colors.grayLine};
    height: 50px;
    margin: 0 63px 0 94px;
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
      margin: 0 0 24px;
      flex-direction: column;
      align-items: flex-start;

      .lg {
          font-size: 32px;
      }

      .vl {
        display: none;
      }
    }
  `}
`;

function GovernancePage() {
  const [relayPagination, setRelayPagination] = useState({ totalItem: 0, limit: 10 });
  const [relayCandidatesPagination, setRelayCandidatesPagination] = useState({
    totalItem: 0,
    limit: 10,
  });

  const { relays, totalRewardFund, relayCandidates } = useSelect(
    ({ governance: { selectRelays, selectTotalRewardFund, selectRelayCandidates } }) => ({
      relays: selectRelays,
      totalRewardFund: selectTotalRewardFund,
      relayCandidates: selectRelayCandidates,
    }),
  );

  const { getRelays, getTotalRewardFund, getRelayCandidates } = useDispatch(
    ({ governance: { getRelays, getTotalRewardFund, getRelayCandidates } }) => ({
      getRelays,
      getTotalRewardFund,
      getRelayCandidates,
    }),
  );

  const { content, total, registeredLastChange24h } = relays;
  const { totalAmount, last30DaysChange } = totalRewardFund;

  const fetchRelayHandler = async (page) => {
    const relay = await getRelays({ page: page - 1, limit: relayPagination.limit });
    setRelayPagination({ ...relayPagination, totalItem: relay?.total });
  };

  const fetchRelayCandidatesHandler = async (page) => {
    const relay = await getRelayCandidates({ page: page - 1, limit: relayPagination.limit });
    setRelayCandidatesPagination({ ...relayPagination, totalItem: relay?.total });
  };

  useEffect(() => {
    getTotalRewardFund();
  }, [getTotalRewardFund]);

  return (
    <GovernanceStyled>
      <Helmet title="Governance" />

      <div className="content">
        <div className="heading-area">
          <Header className="md bold">Governance</Header>
          <div className="total">
            <div className="total-wrapper">
              <Text className="sm bold total-text">TOTAL REGISTERED</Text>
              <Text className="lg bold total-value">{total || 0}</Text>
              <UpDownPercent percent={registeredLastChange24h} />
            </div>
            <div className="vl"></div>
            <div className="total-wrapper">
              <Text className="sm bold total-text">TOTAL REWARD FUND</Text>
              <Text className="lg bold total-value">{totalAmount}</Text>
              <UpDownPercent percent={last30DaysChange} label="past 30 days" />
            </div>
          </div>
        </div>
        <Header className="xs bold table-name">Relay</Header>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={content}
          getItemsHandler={(page) => () => fetchRelayHandler(page)}
          headerColor={colors.grayAccent}
          backgroundColor={colors.darkBG}
          hoverColor={colors.darkBG}
          bodyText={'md'}
          pagination={relayPagination}
        />
        <Header className="xs bold table-name">Relay Candidates</Header>
        <Table
          rowKey="id"
          columns={candidatesColumns}
          dataSource={relayCandidates}
          getItemsHandler={(page) => () => fetchRelayCandidatesHandler(page)}
          headerColor={colors.grayAccent}
          backgroundColor={colors.darkBG}
          hoverColor={colors.darkBG}
          bodyText={'md'}
          pagination={relayCandidatesPagination}
        />
      </div>
    </GovernanceStyled>
  );
}

export default GovernancePage;
