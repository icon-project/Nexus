import styled from 'styled-components/macro';

import { Header } from 'components/Typography';
import { SearchForm } from './SearchForm';
import { TextWithInfo } from 'components/TextWithInfo';
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

    .amount-of-bid {
      border-right: solid 1px ${colors.grayLine};
      padding-right: 60px;
    }

    .table {
      flex: 1;
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
        <div className="table"></div>
      </div>
    </Wrapper>
  );
};

export default FeeAuction;
