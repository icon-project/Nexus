import { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelect } from 'hooks/useRematch';

import { BackButton } from 'components/Button/BackButton';
import { Details } from './Details';
import { PlaceBidForm } from './PlaceBidForm';

import { media } from 'components/Styles/Media';

const Wrapper = styled.div`
  max-width: 1120px;
  padding: 36px 0;
  margin: auto;

  .content {
    display: flex;
    justify-content: space-between;

    .details {
      width: 57.14%;
    }

    .place-bid-form {
      width: 31.42%;
      position: relative;
      top: -24px;
    }
  }

  ${media.md`
    padding: 36px 16px;

    .content {
      flex-direction: column-reverse;

      .details, .place-bid-form {
        width: 100%;
        margin: 24px 0;
        top: 0;
      }
    } 
  `};
`;

const FeeAuctionDetails = () => {
  const { id } = useParams();

  const { auction } = useSelect(({ app }) => ({
    auction: app.selectCurrentAuction,
  }));

  const { getAuctionDetails } = useDispatch(({ app: { getAuctionDetails } }) => ({
    getAuctionDetails,
  }));

  useEffect(() => {
    if (id) getAuctionDetails(id);
  }, [getAuctionDetails, id]);

  return (
    <Wrapper>
      <BackButton>{auction.name}</BackButton>

      <div className="content">
        <div className="details">
          <Details auction={auction} />
        </div>
        <div className="place-bid-form">
          <PlaceBidForm />
        </div>
      </div>
    </Wrapper>
  );
};

export default FeeAuctionDetails;
