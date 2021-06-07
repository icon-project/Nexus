import styled from 'styled-components/macro';

import { Header } from 'components/Typography';
import { SearchForm } from './SearchForm';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: auto;
  padding: 52px 0 31px;

  .search-group {
    display: flex;
    justify-content: space-between;
  }
`;

const FeeAuction = () => {
  return (
    <Wrapper>
      <div className="search-group">
        <Header className="medium bold">Fee auction</Header>
        <SearchForm />
      </div>
    </Wrapper>
  );
};

export default FeeAuction;
