import styled from 'styled-components/macro';

import { Header } from 'components/Typography';
import { SearchForm } from './SearchForm';
import { TextWithInfo } from 'components/TextWithInfo';
import { AmountOfBidTable } from './AmountOfBidTable';
import { colors } from 'components/Styles/Colors';

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
      margin: 0 60px;
      width: 58.5%;
      display: flex;
      align-items: center;
    }
  }
`;

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
    </Wrapper>
  );
};

export default FeeAuction;
