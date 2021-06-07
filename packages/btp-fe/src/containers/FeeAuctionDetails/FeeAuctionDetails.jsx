import styled from 'styled-components/macro';
import { Details } from './Details';
import { PlaceBidForm } from './PlaceBidForm';

import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  max-width: 1120px;
  padding: 36px 0;
  margin: auto;
  display: flex;
  justify-content: space-between;

  .details {
    width: 57.14%;
  }

  .place-bid-form {
    width: 31.42%;
    position: relative;
    top: 24px;
  }

  ${media.md`
    flex-direction: column-reverse;
    padding: 36px 16px;

    .details, .place-bid-form {
      width: 100%;
      margin-bottom: 24px;
      top: 0;
    }
  `};
`;

const FeeAuctionDetails = () => {
  return (
    <Wrapper>
      <div className="details">
        <Details />
      </div>
      <div className="place-bid-form">
        <PlaceBidForm />
      </div>
    </Wrapper>
  );
};

export default FeeAuctionDetails;
