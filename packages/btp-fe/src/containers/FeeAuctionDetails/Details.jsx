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

  .plain-text.xs {
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
          <Text className="xs">Created date</Text>
          <Text className="md">{createdTime}</Text>
        </div>
        <div>
          <Text className="xs">Expiration date</Text>
          <Text className="md">{endTime}</Text>
        </div>
        <div>
          <Text className="xs">Available bid amount</Text>
          <Text className="md">{availableBidAmount} ICX</Text>
        </div>
        <div>
          <Text className="xs">Current highest bid</Text>
          <Text className="md">{currentBidAmount} ICX</Text>
        </div>
        <div>
          <Text className="xs">Next accepted bid</Text>
          <Text className="md">
            {currentBidAmount && currentBidAmount + currentBidAmount * 0.1} ICX
          </Text>
        </div>
        <div>
          <Text className="xs">Top bidder</Text>
          <Text className="md">{topBidder}</Text>
        </div>
      </Info>

      <SubTitle className="md bold">Bid history</SubTitle>
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
