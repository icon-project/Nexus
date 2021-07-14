import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';

import { useDispatch, useSelect } from 'hooks/useRematch';

import { UpDownPercent } from 'components/UpDownPercent';
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
      width: 310px;

      .percent {
        margin-left: 9.67px;
      }
    }

    .divider {
      border-right: solid 1px ${colors.grayLine};
      height: 60px;
      align-self: center;
    }

    .table-container {
      margin: 0 63px;
      width: 43%;
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

const FeeAuction = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { push } = useHistory();
  const [keySearch, setKeySearch] = useState('');
  const [sortOptions, setSortOptions] = useState({ property: 'name', sortBy: 'abc' });

  const { auctions, availableAssets, fees } = useSelect(
    ({ auction: { selectAuctions, selectAvailableAssets, selectFees } }) => ({
      auctions: selectAuctions,
      availableAssets: selectAvailableAssets,
      fees: selectFees,
    }),
  );
  const [filteredData, setFilteredData] = useState(auctions);

  const { getAuctions, getAvailableAssets, getFees, openModal } = useDispatch(
    ({ auction: { getAuctions, getAvailableAssets, getFees }, modal: { openModal } }) => ({
      getAuctions,
      getAvailableAssets,
      openModal,
      getFees,
    }),
  );

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

  const onSortByChange = (values) => {
    const {
      target: { value },
    } = values;

    if (value) setSortOptions(value);
  };

  return (
    <Wrapper>
      <div className="search-group">
        <Header className="medium bold">Fee auction</Header>
        <SearchForm setKeySearch={setKeySearch} />
      </div>
      {!loading && keySearch && !filteredData.length > 0 ? (
        <EmptySearch>
          <img src={notFoundSearchIcon} alt="not found search" />
          <Header className="x-small regular">
            Sorry, no matching results found with this auction name
          </Header>
          <Text className="medium">Try again using more general search items</Text>
        </EmptySearch>
      ) : (
        <>
          {keySearch ? (
            <Text className="medium">
              There’{isPlural ? 're' : 's'} {filteredData.length} result{isPlural ? 's' : ''} for{' '}
              {keySearch}
            </Text>
          ) : (
            <div className="total-available">
              <div className="amount-of-bid">
                <TextWithInfo tooltip="Total amount of volume transacted via BTP in $">
                  TOTAL FEE AVAILABLE FOR AUCTION
                </TextWithInfo>
                <Header className="large bold inline">$ 1,049</Header>
                <UpDownPercent up={false} percent="3.18%" />
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
            <SortSelect onChange={onSortByChange} />
          </div>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            sortOptions={sortOptions}
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
      )}
      {open && (
        <CreateBidModal
          setOpen={setOpen}
          getAvailableAssets={getAvailableAssets}
          availableAssets={availableAssets}
          openModal={openModal}
        />
      )}
    </Wrapper>
  );
};

export default FeeAuction;
