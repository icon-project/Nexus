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
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Bonded ICX',
    dataIndex: 'bondedICX',
  },
  {
    title: 'Server status',
    dataIndex: 'serverStatus',
  },
  {
    title: 'Transferred transaction',
    dataIndex: 'transferredTransactions',
  },
  {
    title: 'Failed transaction',
    dataIndex: 'failedTransactions',
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
  .heading {
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
    .large {
        font-size: 32px;
    }
  }
  .total-text {
    font-size: 12px;
  }
  .vl {
    margin-left: 24px;
    margin-right: 24px;
  }
    `}
`;

function GovernancePage() {
  const { relayCandidates } = useSelect(({ governance: { selectRelayCandidates } }) => ({
    relayCandidates: selectRelayCandidates,
  }));

  const { getRelayCandidates } = useDispatch(({ governance: { getRelayCandidates } }) => ({
    getRelayCandidates,
  }));

  useEffect(() => {
    getRelayCandidates();
  }, [getRelayCandidates]);

  return (
    <GovernanceStyled>
      <div className="content">
        <div className="heading-area">
          <Header className="medium bold heading">Governance</Header>
          <div className="total">
            <div className="total-wrapper">
              <Text className="small bold total-text">TOTAL REGISTERED</Text>
              <Text className="large bold total-value">{relayCandidates.length}</Text>
              <UpDownPercent up={false} sm percent="32%" />
            </div>
            <div className="vl"></div>
            <div className="total-wrapper">
              <Text className="small bold total-text">TOTAL REWARD FUND</Text>
              <Text className="large bold total-value">1,742</Text>
              <UpDownPercent up sm percent="9.55%" />
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
          bodyText={'md'}
        />
      </div>
    </GovernanceStyled>
  );
}

export default GovernancePage;
