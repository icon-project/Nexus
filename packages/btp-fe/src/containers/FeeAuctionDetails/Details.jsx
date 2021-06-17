import styled from 'styled-components/macro';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { Table } from 'components/Table';
import { Text, SubTitle } from 'components/Typography';
import { colors } from 'components/Styles/Colors';
import { media } from 'components/Styles/Media';

import { hashShortener } from 'utils/app';

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
    width: '36.88%',
  },
  {
    title: 'Amount (ICX)',
    dataIndex: 'amount',
    width: '24.38%',
  },
  {
    title: 'Time',
    dataIndex: 'createdTime',
    width: '38.74%',
  },
];

const formatData = (data = {}) => {
  const { createdTime, endTime, topBidder, bids = [], ...ots } = data;
  return {
    ...ots,
    createdTime: dayjs(createdTime).format('DD/MM/YYYY'),
    endTime: dayjs(endTime).format('DD/MM/YYYY'),
    topBidder: hashShortener(topBidder),
    bids: bids.map((bid) => {
      return {
        ...bid,
        bidder: hashShortener(bid.bidder),
        createdTime: dayjs(bid.createdTime).fromNow(),
      };
    }),
  };
};

export const Details = ({ auction }) => {
  const {
    bids,
    createdTime,
    endTime,
    availableBidAmount,
    currentBidAmount,
    topBidder,
  } = formatData(auction);
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
          <Text className="medium">{currentBidAmount + currentBidAmount * 0.1} ICX</Text>
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
      />
    </>
  );
};
