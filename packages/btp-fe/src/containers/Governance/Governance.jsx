/* eslint-disable react/display-name */
import styled from 'styled-components';

import { Layout } from 'components/Layout';
import { Table } from 'components/Table';
import { Header } from 'components/Typography';

import { colors } from 'components/Styles/Colors';
import { Text } from 'components/Typography';
import { media } from 'components/Styles/Media';
import { Change } from 'components/Change';

import iconexIcon from 'assets/images/icon-ex.svg';

const columns = [
  {
    title: '#',
    dataIndex: 'key',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => (
      <>
        <img className="iconex" src={iconexIcon} />
        <span className="copy-address">{text}</span>
      </>
    ),
  },
  {
    title: 'Bonded ICX',
    dataIndex: 'bonded',
  },
  {
    title: 'Server status',
    dataIndex: 'status',
  },
  {
    title: 'Transferred transaction',
    dataIndex: 'transaction',
  },
  {
    title: 'Failed transaction',
    dataIndex: 'failed',
  },
];
let dataSource = [];
for (let i = 1; i < 22; i++) {
  dataSource.push({
    key: i,
    name: 'ICON Foundation',
    bonded: '52,254,777.1397',
    status: 'Active',
    transaction: '12,394',
    failed: '127',
  });
}

const GovernanceStyled = styled(Layout)`
  .main {
    display: flex;
    justify-content: center;
    .content {
      width: 1120px;
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
  return (
    <GovernanceStyled>
      <div className="content">
        <div className="heading-area">
          <Header className="medium bold heading">Governance</Header>
          <div className="total">
            <div className="total-wrapper">
              <Text className="small bold total-text">TOTAL REGISTERED</Text>
              <Change status={'descrease'} value={'1,742'} percent={32} />
            </div>
            <div className="vl"></div>
            <div className="total-wrapper">
              <Text className="small bold total-text">TOTAL REWARD FUND</Text>
              <Change status={'increase'} value={'1,742'} percent={32} />
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
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
