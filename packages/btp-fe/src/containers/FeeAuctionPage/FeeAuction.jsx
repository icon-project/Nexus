import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Header, SubTitle, Text } from 'components/Typography';
import { TextWithInfo } from 'components/TextWithInfo';
import { SortSelect } from 'components/Select';
import { SearchForm } from './SearchForm';
import { AmountOfBidTable } from './AmountOfBidTable';
import { Table } from 'components/Table';

import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import notFoundSearchIcon from '../../assets/images/not-found-search-icon.svg';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: auto;
  padding: 52px 0 31px;

  & > p.medium {
    margin-bottom: 36px;
  }

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

  ${media.md`
    padding: 52px 16px 31px;

    .search-group {
      flex-direction: column;
    }

    .total-available {
      flex-direction: column;

      .divider {
        display: none;
      }

      .table-container {
        width: 90%;
        margin: 24px auto;
      }
    }
  `};
`;

const EmptySearch = styled.div`
  text-align: center;
  padding: 125px 16px 50px;

  & > img {
    width: 81.59px;
    height: 81.5px;
    margin-bottom: 53.42px;
  }

  & > p.medium {
    color: ${colors.graySubText};
    margin-top: 20px;
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
    name: 'DOT 101',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 194,
    name: 'DOT 102',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 195,
    name: 'DOT 103',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 196,
    name: 'DOT 104',
    amount: '100',
    highest: '510',
    mybid: '410',
    expiration: '12hr left',
  },
  {
    key: 197,
    name: 'DOT 105',
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
  const { push } = useHistory();
  const [keySearch, setKeySearch] = useState('');
  const [filteredData, setFilteredData] = useState(dataSource);

  useEffect(() => {
    if (keySearch) {
      setFilteredData(
        dataSource.filter((data) =>
          data.name.toLowerCase().includes(keySearch.trim().toLowerCase()),
        ),
      );
    } else {
      setFilteredData(dataSource);
    }
  }, [keySearch]);

  const isPlural = filteredData.length > 1;

  return (
    <Wrapper>
      <div className="search-group">
        <Header className="medium bold">Fee auction</Header>
        <SearchForm setKeySearch={setKeySearch} />
      </div>
      {filteredData.length > 0 ? (
        <>
          {keySearch ? (
            <Text className="medium">
              There’{isPlural ? 're' : 's'} {filteredData.length} result{isPlural ? 's' : ''} for
              DOT 100
            </Text>
          ) : (
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
          )}
          <div className="filter-by">
            <SubTitle className="medium bold">Auction list</SubTitle>
            <SortSelect />
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            headerColor={colors.grayAccent}
            backgroundColor={colors.darkBG}
            bodyText={'md'}
            onRow={(r) => ({
              onClick: () => {
                push(`/auction/${r.key}`);
              },
            })}
            pagination
          />
        </>
      ) : (
        <EmptySearch>
          <img src={notFoundSearchIcon} alt="not found search" />
          <Header className="x-small regular">
            Sorry, no matching results found with this auction name
          </Header>
          <Text className="medium">Try again using more general search items</Text>
        </EmptySearch>
      )}
    </Wrapper>
  );
};

export default FeeAuction;
