import styled from 'styled-components/macro';

import { Header, SubTitle } from 'components/Typography';
import { TextWithInfo } from 'components/TextWithInfo';
import { SortSelect } from 'components/Select';

import { SearchForm } from './SearchForm';
import { AmountOfBidTable } from './AmountOfBidTable';
import { colors } from 'components/Styles/Colors';
import { Table } from 'components/Table';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: auto;
  padding: 52px 0 31px;

  .search-group {
    display: flex;
    justify-content: space-between;
  }

  .total-available {
    display: flex;
    margin-bottom: 42px;

    .amount-of-bid {
      margin-right: 60px;
    }

    .divider {
      border-right: solid 1px ${colors.grayLine};
      height: 60px;
      align-self: center;
    }

    .table-container {
      margin: 0 65px;
      width: 58.5%;
      display: flex;
      align-items: center;
    }
  }

  .filter-by {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
`;

const columns = [
  {
    title: 'Auction ID',
    dataIndex: 'key',
    width: '12.5%',
  },
  {
    title: 'Auction name',
    dataIndex: 'name',
    width: '15.18%',
  },
  {
    title: 'Bid amount',
    dataIndex: 'amount',
    width: '15.18%',
  },
  {
    title: 'Current highest bid (ICX)',
    dataIndex: 'highest',
    width: '20%',
  },
  {
    title: 'My bid',
    dataIndex: 'mybid',
    width: '20%',
  },
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    width: '17.14%',
  },
];
const dataSource = [
  {
    key: 191,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 192,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 193,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 194,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 195,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 196,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 197,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 198,
    name: 'DOT 100',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
];

const FeeAuction = () => {
  return (
    <Wrapper>
      <div className="search-group">
        <Header className="medium bold">Fee auction</Header>
        <SearchForm />
      </div>
      <div className="total-available">
        <div className="amount-of-bid">
          <TextWithInfo>TOTAL AVAILABLE BID AMOUNT</TextWithInfo>
          <Header className="large bold">$ 1,049</Header>
        </div>

        <div className="divider"></div>

        <div className="table-container">
          <AmountOfBidTable />
        </div>
      </div>
      <div className="filter-by">
        <SubTitle className="medium bold">Auction list</SubTitle>
        <SortSelect />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        headerColor={colors.grayAccent}
        backgroundColor={colors.darkBG}
        bodyText={'md'}
        onRow={() => ({
          onClick: () => {},
        })}
        pagination
      />
    </Wrapper>
  );
};

export default FeeAuction;
