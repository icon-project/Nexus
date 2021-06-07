import styled from 'styled-components/macro';

import { Header } from 'components/Typography';

const Wrapper = styled.div`
  max-width: 1120px;
  margin: auto;
  padding: 52px 0 31px;

  .search-control {
  }
`;

const FeeAuction = () => {
  return (
    <Wrapper>
      <div className="search-control">
        <Header className="medium bold">Fee auction</Header>
      </div>
    </Wrapper>
  );
};

export default FeeAuction;
