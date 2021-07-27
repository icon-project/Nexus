import styled from 'styled-components/macro';

import { Table } from 'components/Table';
import { Text, SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

const Info = styled.div`
  margin: 33px 0 36px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 23px;

  .x-small {
    margin-bottom: 7px;
    color: ${colors.grayScaleSubText};
  }

  ${media.md`
    grid-template-columns: 1fr 1fr;
  `};
`;

const StyledTable = styled(Table)`
  margin-top: 18px;

  tr > td:first-child {
    color: ${colors.tertiaryBase};
  }
`;

const columns = [
  {
    title: 'Bidder',
    dataIndex: 'bidder',
    width: '236px',
  },
  {
    title: 'Amount (ICX)',
    dataIndex: 'amount',
    width: '156px',
  },
  {
    title: 'Time',
    dataIndex: 'createdTime',
    width: '248px',
  },
];

export const Details = ({ auction, auctionId, pagination, bids, getBids }) => {
  const { createdTime, endTime, availableBidAmount, currentBidAmount, topBidder } = auction;
  return (
    <>
      <Info>
        <div>
          <Text className="x-small">Created date</Text>
          <Text className="medium">{createdTime}</Text>
        </div>
        <div>
          <Text className="x-small">Expiration date</Text>
          <Text className="medium">{endTime}</Text>
        </div>
        <div>
          <Text className="x-small">Available bid amount</Text>
          <Text className="medium">{availableBidAmount} ICX</Text>
        </div>
        <div>
          <Text className="x-small">Current highest bid</Text>
          <Text className="medium">{currentBidAmount} ICX</Text>
        </div>
        <div>
          <Text className="x-small">Next accepted bid</Text>
          <Text className="medium">
            {currentBidAmount && currentBidAmount + currentBidAmount * 0.1} ICX
          </Text>
        </div>
        <div>
          <Text className="x-small">Top bidder</Text>
          <Text className="medium">{topBidder}</Text>
        </div>
      </Info>

      <SubTitle className="medium bold">Bid history</SubTitle>
      <StyledTable
        rowKey="id"
        columns={columns}
        dataSource={bids}
        headerColor={colors.grayAccent}
        backgroundColor={colors.darkBG}
        bodyText={'md'}
        pagination={pagination}
        getItemsHandler={(pageIndex) => () => getBids({ pageIndex, auctionId })}
      />
    </>
  );
};
