import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { useDispatch, useSelect } from 'hooks/useRematch';
import { hashShortener } from 'utils/app';

import { Header, SubTitle, Text } from 'components/Typography';
import { TextWithInfo } from 'components/TextWithInfo';
import { SortSelect } from 'components/Select';
import { Table } from 'components/Table';
import { PrimaryButton } from 'components/Button';
import { SearchForm } from './SearchForm';
import { AmountOfBidTable } from './AmountOfBidTable';
import { CreateBidModal } from './CreateBidModal';

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
    align-items: center;
    margin-bottom: 42px;

    .amount-of-bid {
      margin-right: 60px;
      max-width: 255px;
    }

    .divider {
      border-right: solid 1px ${colors.grayLine};
      height: 60px;
      align-self: center;
    }

    .table-container {
      margin: 0 63px;
      width: 40.64%;
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

const CreateBidButton = styled(PrimaryButton)`
  margin-left: auto;
  width: 153px;
  height: 48px;
  line-height: 48px;
  padding: 0;
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
    dataIndex: 'shortedId',
  },
  {
    title: 'Auction name',
    dataIndex: 'name',
  },
  {
    title: 'Bid amount',
    dataIndex: 'availableBidAmount',
  },
  {
    title: 'Current highest bid (ICX)',
    dataIndex: 'currentBidAmount',
  },
  {
    title: 'Expiration',
    dataIndex: 'endTime',
  },
];

const formatData = (data = []) => {
  return data.map((d) => {
    const { id, endTime, ...ots } = d;

    return {
      ...ots,
      id,
      shortedId: hashShortener(id),
      endTime: dayjs(endTime).fromNow(true) + ' left',
    };
  });
};

const FeeAuction = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const { push } = useHistory();
  const [keySearch, setKeySearch] = useState('');
  const { auctions, fees } = useSelect(({ auction: { selectFees, selectAuctions } }) => ({
    auctions: selectAuctions,
    fees: selectFees,
  }));
  const [filteredData, setFilteredData] = useState(auctions);

  const { getAuctions, getFees } = useDispatch(({ auction: { getAuctions, getFees } }) => ({
    getAuctions,
    getFees,
  }));

  useEffect(() => {
    getFees();
    getAuctions().then(() => {
      setLoading(false);
    });
  }, [getAuctions, getFees]);

  useEffect(() => {
    if (keySearch) {
      setFilteredData(
        auctions.filter((data) => data.name.toLowerCase().includes(keySearch.trim().toLowerCase())),
      );
    } else {
      setFilteredData(auctions);
    }
  }, [keySearch, auctions]);

  const isPlural = filteredData.length > 1;

  return (
    <Wrapper>
      <div className="search-group">
        <Header className="medium bold">Fee auction</Header>
        <SearchForm setKeySearch={setKeySearch} />
      </div>
      {!keySearch || loading ? (
        <>
          {keySearch ? (
            <Text className="medium">
              There’{isPlural ? 're' : 's'} {filteredData.length} result{isPlural ? 's' : ''} for{' '}
              {keySearch}
            </Text>
          ) : (
            <div className="total-available">
              <div className="amount-of-bid">
                <TextWithInfo>TOTAL AVAILABLE BID AMOUNT</TextWithInfo>
                <Header className="large bold">$ 1,049</Header>
              </div>

              <div className="divider"></div>

              <div className="table-container">
                <AmountOfBidTable fees={fees} />
              </div>
              <div className="divider"></div>

              <CreateBidButton
                onClick={() => {
                  setOpen(true);
                }}
              >
                <SubTitle className="small bold">Create new bid</SubTitle>
              </CreateBidButton>
            </div>
          )}
          <div className="filter-by">
            <SubTitle className="medium bold">Auction list</SubTitle>
            <SortSelect />
          </div>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={formatData(filteredData)}
            headerColor={colors.grayAccent}
            backgroundColor={colors.darkBG}
            bodyText={'md'}
            onRow={(r) => ({
              onClick: () => {
                push({ pathname: `/auction/${r.id}`, state: { id: r.id } });
              },
            })}
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
      {open && <CreateBidModal setOpen={setOpen} />}
    </Wrapper>
  );
};

export default FeeAuction;
